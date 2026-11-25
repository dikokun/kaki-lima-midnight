// Kaki Lima Midnight — boot and the one game loop.
// Fixed-step simulation (60 steps a second), screens title / play / paused /
// summary, mouse and keyboard routed through input.js hit-tests into the
// world's actions, sound effects on every verb. ?shot=<scene> stages a
// deterministic screenshot scene; ?test=1 runs the automated playtest.

import { STEP } from './config.js';
import { FLAVOR } from './data.js';
import { createAudio } from './audio.js';
import { createWorld, EVENT_EXPIRE, EVENT_SERVE, EVENT_SPAWN, EVENT_STEP_DONE } from './world.js';
import { createRenderer, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_SUMMARY, SCREEN_TITLE } from './render.js';
import { ACTION_MUTE, ACTION_PAUSE, ACTION_START, hitTest, keyAction } from './input.js';
import { runPlaytest, stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const testMode = params.get('test') === '1';

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const audio = createAudio();
const world = createWorld(Math.random);
const renderer = createRenderer(canvas);

function announce(message) {
  status.textContent = message;
}

if (testMode) {
  window.__testResult = runPlaytest(world);
  status.textContent = `TESTRESULT ${JSON.stringify(window.__testResult)}`;
  renderer.draw(world.state, SCREEN_PLAY, 1, { audioMuted: false, stars: 0, summary: null, ...FLAVOR });
  window.__shotReady = true;
} else if (shotName) {
  const scene = stageShot(shotName, world);
  let painted = 0;
  const paint = () => {
    renderer.draw(world.state, scene.screen, 2.4, {
      audioMuted: false,
      stars: world.stars ? 2 : 2,
      summary: { served: world.state.served, missed: world.state.missed, dayCoins: world.state.dayCoins, bestCombo: world.state.bestCombo, day: world.state.day },
      ...FLAVOR,
    });
    painted += 1;
    if (painted < 3) requestAnimationFrame(paint);
    else window.__shotReady = true;
  };
  requestAnimationFrame(paint);
} else {
  let screen = SCREEN_TITLE;
  let accumulator = 0;
  let last = performance.now();
  const MAX_FRAME = 0.25;

  function extras() {
    return {
      audioMuted: audio.isMuted(),
      stars: world.stars(),
      summary: {
        served: world.state.served,
        missed: world.state.missed,
        dayCoins: world.state.dayCoins,
        bestCombo: world.state.bestCombo,
        day: world.state.day,
      },
      ...FLAVOR,
    };
  }

  function startNight() {
    world.resetAll();
    screen = SCREEN_PLAY;
    audio.unlock();
    announce('The stall is open. First tickets are coming in.');
  }

  function toggleMute() {
    audio.setMuted(!audio.isMuted());
  }

  function togglePause() {
    if (screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      audio.sizzleStop();
      announce('Paused.');
    } else if (screen === SCREEN_PAUSED) {
      screen = SCREEN_PLAY;
      announce('Back to the wok.');
    }
  }

  function handleIngredient(ingredientId) {
    const result = world.pickIngredient(ingredientId);
    if (!result.ok) {
      audio.buzz();
      if (result.reason === 'wrong-ingredient') {
        world.say(`Not next — this plate needs a different ingredient first`, 2);
      } else if (result.reason === 'station-busy') {
        world.say('That station is busy — work another ticket or wait for the ding', 2.2);
      } else if (result.reason === 'already-cooking') {
        world.say('That step is already cooking — collect it when it is done', 2.2);
      }
      return;
    }
    if (result.station === 'chop') audio.chop();
    else if (result.station === 'fry') audio.sizzleStart(0.12);
    else if (result.station === 'plate') audio.pop();
    else audio.pop();
  }

  function handleStation(station) {
    if (station === 'plate' || station === 'pass') return;
    const result = world.clickStation(station);
    if (!result.ok) {
      if (result.reason === 'not-ready') world.say('Not yet — let it cook', 1.4);
      else if (result.reason === 'stir-miss') world.say('Splash! Stir when the marker is in the green', 1.5);
      return;
    }
    if (result.action === 'chop-clean' || result.action === 'chop-dull') {
      audio.chop();
      if (result.job.done) world.say(result.job.cleanCuts >= 3 ? 'Clean cuts! Collect it onto the plate' : 'Chopped — collect it onto the plate', 1.6);
      return;
    }
    if (result.action === 'stir') {
      audio.pop();
      world.say('Nice stir — that pot is on for a PERFECT', 1.6);
      return;
    }
    if (result.action === 'collect') {
      if (station === 'fry') audio.sizzleStop();
      audio.pop();
      const grade = world.gradeOf(result.quality);
      if (result.becameReady) {
        audio.ding();
        world.say(`${grade} finish! ${result.order.dish.name} is READY — serve it at the pass!`, 2.8);
      } else {
        world.say(`${grade} — step plated for ${result.order.dish.name}`, 1.7);
      }
    }
  }

  function handleServe(slot) {
    const readyOrders = world.state.orders.filter((order) => order.ready);
    const target = readyOrders[slot] || readyOrders[0];
    if (!target) return;
    const result = world.serveOrder(target.id);
    if (result.ok) {
      audio.coin();
      audio.ding();
      world.say(`${result.grade} DISH! ${result.order.dish.name} served ${'★'.repeat(result.stars)} +${result.earned} coins`, 3);
    }
  }

  function handleAction(action, point) {
    if (!action || action.type === 'none') return;
    audio.unlock();
    if (action.type === ACTION_MUTE) { toggleMute(); return; }
    if (screen === SCREEN_TITLE) {
      if (action.type === ACTION_START || action.type === 'ingredient' || action.type === 'ticket') startNight();
      return;
    }
    if (screen === SCREEN_SUMMARY) {
      if (action.type === ACTION_START || action.type === 'ticket' || action.type === 'ingredient') {
        world.nextDay();
        screen = SCREEN_PLAY;
        announce(`Night ${world.state.day}. New dishes on the menu.`);
      }
      return;
    }
    if (action.type === ACTION_PAUSE) { togglePause(); return; }
    if (screen !== SCREEN_PLAY) return;
    if (action.type === 'ticket') {
      const order = world.state.orders[action.index];
      if (order) {
        world.state.activeOrderId = order.id;
        audio.pop();
      }
    } else if (action.type === 'ingredient') {
      handleIngredient(action.ingredient);
    } else if (action.type === 'station') {
      handleStation(action.station);
    } else if (action.type === 'serve') {
      handleServe(action.slot);
    } else if (action.type === ACTION_START) {
      // Space serves the longest-waiting ready plate.
      handleServe(0);
    }
    void point;
  }

  canvas.addEventListener('pointerdown', (event) => {
    const point = renderer.toStage(event.clientX, event.clientY);
    const readyCount = world.state.orders.filter((order) => order.ready).length;
    handleAction(hitTest(point, world.state.orders.length, readyCount), point);
  });

  window.addEventListener('keydown', (event) => {
    const action = keyAction(event);
    if (!action) return;
    event.preventDefault();
    if (event.repeat && action.type !== 'ingredient') return;
    handleAction(action, null);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) togglePause();
  });

  function reactToEvents(events) {
    if (events & EVENT_STEP_DONE) audio.ding();
    if (events & EVENT_EXPIRE) audio.buzz();
    if (events & EVENT_SPAWN) audio.pop();
    void EVENT_SERVE;
  }

  function frame(nowMs) {
    requestAnimationFrame(frame);
    accumulator += Math.min((nowMs - last) / 1000, MAX_FRAME);
    last = nowMs;
    if (screen === SCREEN_PLAY) {
      while (accumulator >= STEP) {
        const events = world.step(STEP);
        reactToEvents(events);
        accumulator -= STEP;
        if (world.state.timeLeft <= 0) {
          screen = SCREEN_SUMMARY;
          audio.sizzleStop();
          announce(`Night over. Served ${world.state.served}, earned ${world.state.dayCoins} coins.`);
          break;
        }
      }
    } else {
      accumulator = 0;
    }
    renderer.draw(world.state, screen, nowMs / 1000, extras());
  }

  announce('Kaki Lima Midnight. Click or press Space to open the stall.');
  requestAnimationFrame(frame);
}
