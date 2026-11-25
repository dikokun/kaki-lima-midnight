// Kaki Lima Midnight — deterministic staged scenes for the maker's
// screenshots (?shot=cover|rush|summary|title&seed=N) and an automated
// end-to-end playtest (?test=1) that plays one full order through the real
// rules — pick, chop, fry, boil or plate, collect, serve — and reports the
// coin total changing on window.__testResult. Scenes are built by driving
// the world's own functions, never by painting a fake frame.

import { SCREEN_PLAY, SCREEN_SUMMARY, SCREEN_TITLE } from './render.js';

function forceStep(world, order, ingredient, station, jobT) {
  world.state.activeOrderId = order.id;
  const result = world.pickIngredient(ingredient);
  if (!result.ok) return false;
  if (station !== 'plate') {
    const job = world.state.jobs[station];
    if (job) {
      job.t = jobT;
      if (jobT >= job.duration) {
        job.done = true;
        job.dinged = true;
      }
    }
  }
  return true;
}

function collect(world, station) {
  return world.clickStation(station);
}

export function stageShot(name, world) {
  world.resetAll();
  const s = world.state;
  if (name === 'title') {
    world.spawnOrder('nasi-goreng');
    world.spawnOrder('mie-tektek');
    return { screen: SCREEN_TITLE };
  }
  if (name === 'summary') {
    s.day = 1;
    s.served = 9;
    s.missed = 1;
    s.dayCoins = 148;
    s.coins = 148;
    s.score = 1480;
    s.bestCombo = 5;
    world.spawnOrder('nasi-goreng');
    return { screen: SCREEN_SUMMARY };
  }
  if (name === 'rush') {
    s.day = 3;
    s.elapsed = 88;
    s.timeLeft = 62;
    s.coins = 86;
    s.score = 860;
    s.combo = 4;
    s.served = 6;
    const first = world.spawnOrder('udang-bakar');
    const second = world.spawnOrder('nasi-goreng');
    const third = world.spawnOrder('mie-tektek');
    const fourth = world.spawnOrder('tahu-crispy');
    // Second order is fully built and waits at the pass, ready to serve.
    for (const stepDef of [...second.dish.steps]) {
      forceStep(world, second, stepDef.ingredient, stepDef.station, stepDef.station === 'fry' ? 1.9 : 3);
      if (stepDef.station !== 'plate') collect(world, stepDef.station);
    }
    // First order is mid-assembly: two steps on the plate, shrimp in the wok.
    forceStep(world, first, 'shrimp', 'chop', 3); collect(world, 'chop');
    forceStep(world, first, 'chili', 'chop', 3); collect(world, 'chop');
    forceStep(world, first, 'garlic', 'fry', 1.8);
    // Third order has one step plated.
    forceStep(world, third, 'cabbage', 'chop', 3); collect(world, 'chop');
    s.activeOrderId = first.id;
    void fourth;
    return { screen: SCREEN_PLAY };
  }
  // cover (default): the full kitchen at a glance — three tickets on the
  // board, one dish mid-assembly with ingredients on its plate, garlic
  // frying in the perfect window, one finished plate ready at the pass,
  // the shift timer and the coin score all on screen together.
  s.elapsed = 34;
  s.timeLeft = 116;
  s.coins = 37;
  s.score = 370;
  s.combo = 2;
  s.served = 3;
  const main = world.spawnOrder('nasi-goreng');
  const ready = world.spawnOrder('tahu-crispy');
  const queued = world.spawnOrder('mie-tektek');
  for (const stepDef of [...ready.dish.steps]) {
    forceStep(world, ready, stepDef.ingredient, stepDef.station, stepDef.station === 'fry' ? 1.9 : 3);
    if (stepDef.station !== 'plate') collect(world, stepDef.station);
  }
  forceStep(world, main, 'chicken', 'chop', 3); collect(world, 'chop');
  forceStep(world, main, 'garlic', 'chop', 3); collect(world, 'chop');
  forceStep(world, main, 'rice', 'fry', 1.75);
  s.activeOrderId = main.id;
  void queued;
  return { screen: SCREEN_PLAY };
}

// Automated playtest: with accelerated real steps, cook the first order from
// ticket to served coins, using only the world's public actions (the same
// ones mouse clicks and hotkeys call). Runs inside the page so a headless
// browser can verify a full loop with no console errors.
export function runPlaytest(world) {
  const result = { ok: false, stages: [], coinsBefore: 0, coinsAfter: 0, error: '' };
  try {
    world.resetAll();
    const order = world.spawnOrder('mie-tektek');
    result.stages.push('spawned');
    result.coinsBefore = world.state.coins;
    let guard = 0;
    while (!order.ready && guard < 40) {
      guard += 1;
      const stepDef = world.currentStep(order);
      if (!stepDef) break;
      const picked = world.pickIngredient(stepDef.ingredient);
      if (!picked.ok) throw new Error(`pick failed: ${picked.reason}`);
      result.stages.push(`picked-${stepDef.ingredient}`);
      if (stepDef.station !== 'plate') {
        // Advance the real world clock until the job is collectable.
        for (let i = 0; i < 400 && !world.state.jobs[stepDef.station]?.done; i += 1) world.step(1 / 60);
        if (stepDef.station === 'fry') {
          // Fry was left to the cap by the loop above; reset timing is not
          // possible, so accept whatever quality the collection gives.
        }
        const collected = world.clickStation(stepDef.station);
        if (!collected.ok) throw new Error(`collect failed at ${stepDef.station}`);
        result.stages.push(`collected-${stepDef.station}`);
      } else {
        result.stages.push('plated');
      }
    }
    if (!order.ready) throw new Error('order never became ready');
    result.stages.push('ready');
    const served = world.serveOrder(order.id);
    if (!served.ok) throw new Error('serve failed');
    result.coinsAfter = world.state.coins;
    result.stages.push(`served-+${served.earned}c`);
    result.ok = result.coinsAfter > result.coinsBefore && world.state.served === 1;
  } catch (error) {
    result.error = String(error && error.message ? error.message : error);
  }
  return result;
}
