// Kaki Lima Midnight — game state and rules, no drawing, no browser APIs.
// Orders arrive on the board, each dish is built step by step: an ingredient
// is sent to a station, the station works, the cook collects it onto that
// order's plate. A plate with every step done waits at the pass, ready to
// serve. Quality comes from the wok's doneness window and the pot's grace
// time; tips come from patience left; streaks build a combo multiplier.

import { COOK, DAY, SCORE } from './config.js';
import { DISHES } from './data.js';

export const EVENT_SERVE = 1;
export const EVENT_EXPIRE = 2;
export const EVENT_WRONG = 4;
export const EVENT_STEP_DONE = 8;
export const EVENT_READY = 16;
export const EVENT_SPAWN = 32;

let nextOrderId = 1;

export function createWorld(random) {
  const state = {
    day: 1,
    timeLeft: DAY.seconds,
    elapsed: 0,
    coins: 0,
    dayCoins: 0,
    score: 0,
    combo: 0,
    bestCombo: 0,
    served: 0,
    missed: 0,
    orders: [],
    jobs: { chop: null, fry: null, boil: null },
    activeOrderId: null,
    spawnTimer: DAY.firstSpawnDelay,
    message: '',
    messageTimer: 0,
    rushAnnounced: false,
    lastServe: null,
  };

  function dishesForToday() {
    return DISHES.filter((dish) => dish.unlockDay <= state.day);
  }

  function spawnEvery() {
    return Math.max(DAY.minSpawnEvery, DAY.baseSpawnEvery - (state.day - 1) * DAY.spawnEveryPerDay);
  }

  function patienceFor() {
    return Math.max(DAY.minPatience, DAY.basePatience - (state.day - 1) * DAY.patiencePerDay);
  }

  function spawnOrder(forcedDishId) {
    if (state.orders.length >= DAY.maxOrders) return null;
    const pool = dishesForToday();
    const dish = forcedDishId
      ? pool.find((entry) => entry.id === forcedDishId) || pool[0]
      : pool[Math.floor(random() * pool.length)];
    const patience = patienceFor() * (0.9 + random() * 0.25);
    const order = {
      id: nextOrderId,
      dish,
      stepIndex: 0,
      qualities: [],
      patience,
      patienceMax: patience,
      ready: false,
      flash: 0,
    };
    nextOrderId += 1;
    state.orders.push(order);
    if (state.activeOrderId === null) state.activeOrderId = order.id;
    return order;
  }

  function activeOrder() {
    return state.orders.find((order) => order.id === state.activeOrderId) || state.orders[0] || null;
  }

  function orderById(id) {
    return state.orders.find((order) => order.id === id) || null;
  }

  function currentStep(order) {
    if (!order || order.ready) return null;
    return order.dish.steps[order.stepIndex] || null;
  }

  function jobForOrder(orderId) {
    for (const station of ['chop', 'fry', 'boil']) {
      const job = state.jobs[station];
      if (job && job.orderId === orderId) return job;
    }
    return null;
  }

  function say(text, seconds = 2.6) {
    state.message = text;
    state.messageTimer = seconds;
  }

  // Send the current step's ingredient to its station. Returns false (and the
  // caller buzzes) when the ingredient is not the next step, the order is
  // already cooking that step, or the station is busy with another order.
  function pickIngredient(ingredientId) {
    const order = activeOrder();
    if (!order || order.ready) return { ok: false, reason: 'no-order' };
    const stepDef = currentStep(order);
    if (!stepDef) return { ok: false, reason: 'no-step' };
    if (jobForOrder(order.id)) return { ok: false, reason: 'already-cooking' };
    if (stepDef.ingredient !== ingredientId) {
      return { ok: false, reason: 'wrong-ingredient', needed: stepDef.ingredient };
    }
    if (stepDef.station === 'plate') {
      order.qualities.push(SCORE.perfectQuality);
      order.stepIndex += 1;
      finishStepIfDone(order);
      return { ok: true, station: 'plate', order };
    }
    const station = stepDef.station;
    if (state.jobs[station]) return { ok: false, reason: 'station-busy', station };
    const duration = station === 'chop' ? COOK.chopSeconds : station === 'fry' ? COOK.frySeconds : COOK.boilSeconds;
    state.jobs[station] = {
      station,
      orderId: order.id,
      ingredient: ingredientId,
      t: 0,
      duration,
      done: false,
      dinged: false,
    };
    return { ok: true, station, order };
  }

  function finishStepIfDone(order) {
    if (order.stepIndex >= order.dish.steps.length) {
      order.ready = true;
      return true;
    }
    return false;
  }

  function qualityForCollection(job) {
    const ratio = job.t / job.duration;
    if (job.station === 'fry') {
      if (ratio < COOK.fryPerfectFrom) return SCORE.okQuality;
      if (ratio <= COOK.fryPerfectTo) return SCORE.perfectQuality;
      if (ratio < COOK.fryBurntAt) return SCORE.goodQuality;
      return SCORE.poorQuality;
    }
    if (job.station === 'boil') {
      return ratio <= 1 + COOK.boilGraceSeconds / job.duration ? SCORE.perfectQuality : SCORE.goodQuality;
    }
    return SCORE.perfectQuality;
  }

  // Clicking a station: chopping speeds the knife; a finished job is collected
  // onto its order's plate; a wok job can be lifted early or late at a cost.
  function clickStation(station) {
    const job = state.jobs[station];
    if (!job) return { ok: false, reason: 'empty' };
    if (station === 'chop' && !job.done) {
      job.t = Math.min(job.duration, job.t + COOK.chopClickBoost);
      if (job.t >= job.duration) job.done = true;
      return { ok: true, action: 'chop-boost', job };
    }
    const collectable = job.done || station === 'fry';
    if (!collectable) return { ok: false, reason: 'not-ready', job };
    const order = orderById(job.orderId);
    state.jobs[station] = null;
    if (!order) return { ok: false, reason: 'order-gone' };
    const quality = qualityForCollection(job);
    order.qualities.push(quality);
    order.stepIndex += 1;
    const becameReady = finishStepIfDone(order);
    return { ok: true, action: 'collect', job, order, quality, becameReady };
  }

  function averageQuality(order) {
    if (!order.qualities.length) return 1;
    return order.qualities.reduce((sum, value) => sum + value, 0) / order.qualities.length;
  }

  function serveOrder(orderId) {
    const order = orderById(orderId);
    if (!order || !order.ready) return { ok: false, reason: 'not-ready' };
    const quality = averageQuality(order);
    const patienceRatio = Math.max(0, order.patience / order.patienceMax);
    const tip = Math.round(order.dish.price * SCORE.tipFraction * patienceRatio * quality);
    const comboBonus = state.combo >= 2 ? Math.min(10, state.combo * SCORE.comboStepBonus - 2) : 0;
    const earned = order.dish.price + tip + comboBonus;
    state.coins += earned;
    state.dayCoins += earned;
    state.score += earned * 10;
    state.served += 1;
    if (quality >= 0.8 && patienceRatio > 0.35) {
      state.combo += 1;
      state.bestCombo = Math.max(state.bestCombo, state.combo);
    } else {
      state.combo = 0;
    }
    state.lastServe = { name: order.dish.name, earned, tip, quality, at: state.elapsed };
    state.orders = state.orders.filter((entry) => entry.id !== order.id);
    if (state.activeOrderId === order.id) {
      const next = state.orders.find((entry) => !entry.ready) || state.orders[0];
      state.activeOrderId = next ? next.id : null;
    }
    return { ok: true, earned, tip, quality, order };
  }

  function removeOrder(order) {
    state.orders = state.orders.filter((entry) => entry.id !== order.id);
    for (const station of ['chop', 'fry', 'boil']) {
      if (state.jobs[station] && state.jobs[station].orderId === order.id) state.jobs[station] = null;
    }
    if (state.activeOrderId === order.id) {
      const next = state.orders[0];
      state.activeOrderId = next ? next.id : null;
    }
  }

  function step(dt) {
    let events = 0;
    state.elapsed += dt;
    state.timeLeft = Math.max(0, DAY.seconds - state.elapsed);
    if (state.messageTimer > 0) state.messageTimer = Math.max(0, state.messageTimer - dt);

    if (!state.rushAnnounced && state.timeLeft < DAY.seconds * 0.45 && state.timeLeft > 0) {
      state.rushAnnounced = true;
    }

    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      if (spawnOrder()) events |= EVENT_SPAWN;
      state.spawnTimer = spawnEvery() * (0.75 + random() * 0.5);
    }

    for (const station of ['chop', 'fry', 'boil']) {
      const job = state.jobs[station];
      if (!job) continue;
      job.t += dt;
      const cap = station === 'fry' ? job.duration * 1.35 : job.duration;
      if (job.t >= job.duration) {
        if (!job.dinged) {
          job.dinged = true;
          events |= EVENT_STEP_DONE;
        }
        job.done = true;
        if (job.t > cap) job.t = cap;
      }
    }

    for (let i = state.orders.length - 1; i >= 0; i -= 1) {
      const order = state.orders[i];
      if (order.flash > 0) order.flash = Math.max(0, order.flash - dt);
      if (order.ready) continue;
      order.patience -= dt;
      if (order.patience <= 0) {
        removeOrder(order);
        state.missed += 1;
        state.combo = 0;
        state.coins = Math.max(0, state.coins - DAY.missPenalty);
        state.dayCoins = Math.max(0, state.dayCoins - DAY.missPenalty);
        events |= EVENT_EXPIRE;
        say('An order walked away hungry… -5 coins', 3);
      }
    }
    return events;
  }

  function stars() {
    if (state.served === 0) return 0;
    const ratio = state.served / Math.max(1, state.served + state.missed);
    if (ratio >= 0.85 && state.dayCoins >= 120) return 3;
    if (ratio >= 0.65 && state.dayCoins >= 70) return 2;
    if (ratio >= 0.4) return 1;
    return 0;
  }

  function nextDay() {
    state.day += 1;
    state.elapsed = 0;
    state.timeLeft = DAY.seconds;
    state.orders = [];
    state.jobs = { chop: null, fry: null, boil: null };
    state.activeOrderId = null;
    state.spawnTimer = 0.6;
    state.served = 0;
    state.missed = 0;
    state.dayCoins = 0;
    state.combo = 0;
    state.rushAnnounced = false;
    state.lastServe = null;
  }

  function resetAll() {
    nextOrderId = 1;
    state.day = 1;
    state.coins = 0;
    state.score = 0;
    state.bestCombo = 0;
    nextDay();
    state.day = 1;
  }

  return {
    state,
    spawnOrder,
    activeOrder,
    orderById,
    currentStep,
    jobForOrder,
    pickIngredient,
    clickStation,
    serveOrder,
    averageQuality,
    step,
    stars,
    nextDay,
    resetAll,
    say,
  };
}
