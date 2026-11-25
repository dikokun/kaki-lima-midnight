// Kaki Lima Midnight — drawing only: world state in, pixels out.
// One canvas, one fixed 1280x720 stage scaled to the window. Everything is
// vector drawn in code: the night stall, string lights, order tickets, the
// four stations, the assembly plate with its layered ingredients, the pass
// with ready plates, and the ingredient counter along the bottom.

import { COOK, FONT, LAYOUT, PALETTE, STAGE } from './config.js';
import { INGREDIENTS, INGREDIENT_BY_ID, STATIONS } from './data.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_SUMMARY = 'summary';

export function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function drawIngredientIcon(ctx, id, cx, cy, size) {
  const s = size / 44;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  if (id === 'rice') {
    ctx.fillStyle = '#fdfaf0';
    ctx.beginPath(); ctx.arc(0, 4, 15, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#d8cfb2'; ctx.stroke();
    ctx.fillStyle = '#e8dfc2';
    for (const [gx, gy] of [[-7, -4], [0, -8], [7, -4], [-3, 0], [4, 1]]) { ctx.beginPath(); ctx.ellipse(gx, gy, 3.4, 1.8, 0.6, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#7a4a2b'; ctx.fillRect(-17, 5, 34, 4);
  } else if (id === 'noodle') {
    ctx.strokeStyle = '#f2c94c'; ctx.lineWidth = 3.4;
    for (const off of [-8, -3, 2, 7]) { ctx.beginPath(); ctx.arc(off * 0.4, -2 + Math.abs(off) * 0.4, 8 - Math.abs(off) * 0.3, 0.3, 2.8); ctx.stroke(); }
    ctx.fillStyle = '#c94f38'; ctx.beginPath(); ctx.arc(0, 8, 16, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fdf3d8'; ctx.fillRect(-16, 6, 32, 3);
  } else if (id === 'egg') {
    ctx.fillStyle = '#fffdf4'; ctx.beginPath(); ctx.ellipse(0, 0, 16, 12, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#e3d9bd'; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.fillStyle = '#ffb020'; ctx.beginPath(); ctx.arc(1, 0, 6.6, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffd873'; ctx.beginPath(); ctx.arc(-1, -2, 2.4, 0, 7); ctx.fill();
  } else if (id === 'chicken') {
    ctx.fillStyle = '#e8a07a'; ctx.beginPath(); ctx.ellipse(-3, -3, 12, 9, -0.7, 0, 7); ctx.fill();
    ctx.strokeStyle = '#b06a42'; ctx.stroke();
    ctx.strokeStyle = '#fdf3d8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(5, 4); ctx.lineTo(13, 12); ctx.stroke();
    ctx.fillStyle = '#fdf3d8'; ctx.beginPath(); ctx.arc(14, 13, 3.6, 0, 7); ctx.arc(10, 15, 3.2, 0, 7); ctx.fill();
  } else if (id === 'shrimp') {
    ctx.strokeStyle = '#ff8f7a'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 0, 10, -0.6, 3.6); ctx.stroke();
    ctx.strokeStyle = '#e2603f'; ctx.lineWidth = 2;
    for (const a of [0.4, 1.4, 2.4]) { ctx.beginPath(); ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5); ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14); ctx.stroke(); }
    ctx.fillStyle = '#33241a'; ctx.beginPath(); ctx.arc(-9, -8, 1.8, 0, 7); ctx.fill();
  } else if (id === 'tofu') {
    ctx.fillStyle = '#f3e8c8'; roundRect(ctx, -12, -12, 24, 24, 4); ctx.fill();
    ctx.strokeStyle = '#cbb27e'; ctx.stroke();
    ctx.strokeStyle = '#ddc894'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.moveTo(0, -12); ctx.lineTo(0, 12); ctx.stroke();
  } else if (id === 'cabbage') {
    ctx.fillStyle = '#8fce6e'; ctx.beginPath(); ctx.arc(0, 0, 14, 0, 7); ctx.fill();
    ctx.strokeStyle = '#5da244'; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 8.5, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.quadraticCurveTo(3, 0, 0, 14); ctx.stroke();
  } else if (id === 'chili') {
    ctx.strokeStyle = '#e23b3b'; ctx.lineWidth = 6.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-9, -9); ctx.quadraticCurveTo(10, -4, 7, 11); ctx.stroke();
    ctx.strokeStyle = '#4d8f3a'; ctx.lineWidth = 3.4;
    ctx.beginPath(); ctx.moveTo(-9, -9); ctx.quadraticCurveTo(-13, -14, -8, -16); ctx.stroke();
  } else if (id === 'garlic') {
    ctx.fillStyle = '#f6eef8'; ctx.beginPath();
    ctx.moveTo(0, -15); ctx.quadraticCurveTo(13, -2, 11, 7); ctx.quadraticCurveTo(8, 15, 0, 15);
    ctx.quadraticCurveTo(-8, 15, -11, 7); ctx.quadraticCurveTo(-13, -2, 0, -15); ctx.fill();
    ctx.strokeStyle = '#c9b3d6'; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(0, 13); ctx.moveTo(-6, -4); ctx.quadraticCurveTo(-5, 4, -4, 12); ctx.moveTo(6, -4); ctx.quadraticCurveTo(5, 4, 4, 12); ctx.stroke();
  } else if (id === 'tomato') {
    ctx.fillStyle = '#ef5d4d'; ctx.beginPath(); ctx.arc(0, 2, 13.5, 0, 7); ctx.fill();
    ctx.strokeStyle = '#c23a2e'; ctx.stroke();
    ctx.fillStyle = '#4d8f3a'; ctx.beginPath(); ctx.ellipse(0, -10, 7, 3.4, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#ff9a8a'; ctx.beginPath(); ctx.arc(-5, -2, 3.4, 0, 7); ctx.fill();
  } else if (id === 'satay') {
    ctx.strokeStyle = '#d9b878'; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.moveTo(-14, 14); ctx.lineTo(12, -12); ctx.moveTo(-6, 15); ctx.lineTo(15, -6); ctx.stroke();
    ctx.fillStyle = '#a05c2c';
    for (const [bx, by] of [[-4, -3], [3, -9], [2, 3], [9, -3]]) { roundRect(ctx, bx - 4.4, by - 4.4, 8.8, 8.8, 2.4); ctx.fill(); }
    ctx.fillStyle = '#c47b3a';
    for (const [bx, by] of [[-4, -3], [3, -9]]) { roundRect(ctx, bx - 4.4, by - 4.4, 8.8, 3.4, 1.6); ctx.fill(); }
  } else {
    ctx.fillStyle = '#e6c88f'; ctx.beginPath(); ctx.ellipse(0, 0, 15, 10.5, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#b98f52'; ctx.stroke();
    ctx.fillStyle = '#d9b878'; ctx.beginPath(); ctx.ellipse(-3, -3, 6, 3.6, -0.4, 0, 7); ctx.fill();
  }
  ctx.restore();
}

function text(ctx, value, x, y, size, color, align = 'left', weight = 700) {
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    view.scale = Math.min(canvas.width / STAGE.width, canvas.height / STAGE.height);
    view.x = (canvas.width - STAGE.width * view.scale) / 2;
    view.y = (canvas.height - STAGE.height * view.scale) / 2;
  }
  window.addEventListener('resize', resize);
  resize();

  function toStage(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const px = (clientX - rect.left) * ratio;
    const py = (clientY - rect.top) * ratio;
    return { x: (px - view.x) / view.scale, y: (py - view.y) / view.scale };
  }

  function drawBackground(state) {
    ctx.fillStyle = PALETTE.sky;
    ctx.fillRect(0, 0, STAGE.width, STAGE.height);
    ctx.fillStyle = '#1d1129';
    ctx.fillRect(0, 470, STAGE.width, 250);
    // Distant rooftops and a moon, kept quiet behind the stall.
    ctx.fillStyle = '#2d1b40';
    for (const [x, w, h] of [[0, 180, 90], [210, 140, 64], [960, 170, 78], [1160, 120, 58]]) ctx.fillRect(x, 470 - h, w, h);
    ctx.fillStyle = '#f7e7bd';
    ctx.beginPath(); ctx.arc(1196, 92, 25, 0, 7); ctx.fill();
    ctx.fillStyle = PALETTE.sky;
    ctx.beginPath(); ctx.arc(1184, 84, 22, 0, 7); ctx.fill();
    // Awning over the kitchen.
    ctx.fillStyle = PALETTE.awning;
    ctx.fillRect(0, 188, STAGE.width, 16);
    for (let i = 0; i < 16; i += 1) {
      ctx.fillStyle = i % 2 ? PALETTE.awningStripe : PALETTE.awning;
      ctx.beginPath();
      ctx.moveTo(i * 80, 204); ctx.lineTo(i * 80 + 80, 204); ctx.lineTo(i * 80 + 64, 222); ctx.lineTo(i * 80 + 16, 222);
      ctx.closePath(); ctx.fill();
    }
    // String lights under the awning.
    ctx.strokeStyle = 'rgba(255,179,71,0.5)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(0, 226); ctx.quadraticCurveTo(640, 252, 1280, 226); ctx.stroke();
    for (let i = 0; i <= 20; i += 1) {
      const lx = i * 64;
      const ly = 228 + Math.sin((i / 20) * Math.PI) * 13;
      ctx.fillStyle = i % 3 ? '#ffd873' : '#ff9a5c';
      ctx.beginPath(); ctx.arc(lx, ly, 4.4, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,200,110,0.22)';
      ctx.beginPath(); ctx.arc(lx, ly, 10, 0, 7); ctx.fill();
    }
    void state;
  }

  function drawHud(state, audioMuted) {
    ctx.fillStyle = '#120a1a';
    ctx.fillRect(0, 0, STAGE.width, LAYOUT.hud.h);
    ctx.fillStyle = PALETTE.amber;
    ctx.fillRect(0, LAYOUT.hud.h - 3, STAGE.width, 3);
    text(ctx, 'KAKI LIMA', 16, 20, 25, PALETTE.amber, 'left', 900);
    text(ctx, 'MIDNIGHT', 16, 43, 13.5, PALETTE.text, 'left', 800);
    const clock = Math.max(0, Math.ceil(state.timeLeft));
    const mm = String(Math.floor(clock / 60)).padStart(1, '0');
    const ss = String(clock % 60).padStart(2, '0');
    text(ctx, `NIGHT ${state.day}`, 238, 27, 21, PALETTE.text, 'left', 800);
    // Shift timer: a draining lantern bar, red under 20 seconds.
    const frac = Math.max(0, state.timeLeft / 150);
    ctx.fillStyle = '#3a2a4d'; roundRect(ctx, 356, 15, 252, 24, 12); ctx.fill();
    ctx.fillStyle = state.timeLeft < 20 ? PALETTE.bad : PALETTE.teal;
    if (frac > 0.01) { roundRect(ctx, 356, 15, Math.max(24, 252 * frac), 24, 12); ctx.fill(); }
    text(ctx, `SHIFT ${mm}:${ss}`, 482, 27.5, 16.5, frac > 0.62 ? '#14101f' : PALETTE.text, 'center', 900);
    text(ctx, `COINS ${state.coins}`, 640, 27, 21, '#ffd873', 'left', 900);
    // Shift target: tonight's earnings goal, filling as the till grows.
    const targetFrac = Math.min(1, state.dayCoins / state.targetCoins);
    text(ctx, `TARGET ${state.targetCoins}c`, 786, 13, 11.5, PALETTE.muted, 'left', 900);
    ctx.fillStyle = '#3a2a4d'; roundRect(ctx, 786, 21, 148, 15, 7.5); ctx.fill();
    ctx.fillStyle = targetFrac >= 1 ? PALETTE.good : PALETTE.amber;
    if (targetFrac > 0.01) { roundRect(ctx, 786, 21, Math.max(15, 148 * targetFrac), 15, 7.5); ctx.fill(); }
    text(ctx, `${state.dayCoins}/${state.targetCoins}c`, 860, 28.5, 12, '#14101f', 'center', 900);
    if (state.combo >= 2) {
      text(ctx, `COMBO x${state.combo} 🔥`, 986, 27, 19, PALETTE.flame, 'left', 900);
    } else {
      text(ctx, `SERVED ${state.served}`, 986, 27, 17, PALETTE.dim, 'left', 700);
    }
    // Pause and mute buttons.
    for (const [box, label] of [[LAYOUT.pauseBtn, '❚❚'], [LAYOUT.muteBtn, audioMuted ? '🔇' : '🔊']]) {
      ctx.fillStyle = '#2c1e3a'; roundRect(ctx, box.x, box.y, box.w, box.h, 8); ctx.fill();
      ctx.strokeStyle = PALETTE.panelEdge; ctx.lineWidth = 1.6; ctx.stroke();
      text(ctx, label, box.x + box.w / 2, box.y + box.h / 2 + 1, 16, PALETTE.text, 'center', 800);
    }
  }

  function drawTicket(order, x, y, w, h, isActive, now) {
    ctx.save();
    if (order.flash > 0) { ctx.translate(Math.sin(now * 60) * 3 * order.flash, 0); }
    ctx.fillStyle = order.ready ? '#dff5cf' : PALETTE.paper;
    roundRect(ctx, x, y, w, h, 9); ctx.fill();
    ctx.strokeStyle = isActive ? PALETTE.amber : PALETTE.paperEdge;
    ctx.lineWidth = isActive ? 4 : 1.6; ctx.stroke();
    ctx.fillStyle = order.dish.tint;
    roundRect(ctx, x, y, w, 27, 9); ctx.fill();
    ctx.fillRect(x, y + 18, w, 9);
    text(ctx, order.dish.name.toUpperCase(), x + 10, y + 14, 14.5, '#fff7e0', 'left', 900);
    text(ctx, `${order.dish.price}c`, x + w - 10, y + 14, 15, '#fff7e0', 'right', 900);
    text(ctx, `#${String(order.ticketNo).padStart(2, '0')} · ${order.persona.name}`, x + 10, y + 38, 12.5, PALETTE.ink, 'left', 900);
    text(ctx, order.persona.trait, x + w - 10, y + 38, 10.5, '#8a7648', 'right', 700);
    if (order.ready) {
      text(ctx, '★ READY TO SERVE ★', x + w / 2, y + 66, 20, '#3d7a27', 'center', 900);
      text(ctx, 'click the plate at the PASS →', x + w / 2, y + 88, 13.5, PALETTE.ink, 'center', 700);
      drawPlate(ctx, x + w / 2, y + 104, 20, order, 1);
    } else {
      // Ingredient chips for every step; done steps are ticked and dimmed.
      const steps = order.dish.steps;
      const chipW = Math.min(52, (w - 20 - (steps.length - 1) * 5) / steps.length);
      steps.forEach((stepDef, index) => {
        const cx0 = x + 10 + index * (chipW + 5);
        const done = index < order.stepIndex;
        const current = index === order.stepIndex;
        ctx.fillStyle = done ? '#d8cfb2' : current ? '#ffe1a1' : '#efe3c2';
        roundRect(ctx, cx0, y + 47, chipW, 34, 6); ctx.fill();
        if (current) { ctx.strokeStyle = PALETTE.flame; ctx.lineWidth = 2.4; ctx.stroke(); }
        drawIngredientIcon(ctx, stepDef.ingredient, cx0 + chipW / 2, y + 61, 21);
        text(ctx, STATIONS[stepDef.station].short, cx0 + chipW / 2, y + 75, 10, PALETTE.ink, 'center', 800);
        if (done) text(ctx, '✓', cx0 + chipW - 8, y + 54, 12, '#3d7a27', 'center', 900);
      });
      text(ctx, `STEP ${Math.min(order.stepIndex + 1, steps.length)}/${steps.length} · ${INGREDIENT_BY_ID[steps[Math.min(order.stepIndex, steps.length - 1)].ingredient].name} → ${STATIONS[steps[Math.min(order.stepIndex, steps.length - 1)].station].short.toUpperCase()}`, x + 10, y + 95, 13, PALETTE.ink, 'left', 800);
      // Patience bar.
      const ratio = Math.max(0, order.patience / order.patienceMax);
      ctx.fillStyle = '#d8cfb2'; roundRect(ctx, x + 10, y + h - 13, w - 20, 7, 3.5); ctx.fill();
      ctx.fillStyle = ratio > 0.5 ? PALETTE.good : ratio > 0.25 ? PALETTE.warn : PALETTE.bad;
      if (ratio > 0.01) { roundRect(ctx, x + 10, y + h - 13, Math.max(10, (w - 20) * ratio), 7, 3.5); ctx.fill(); }
    }
    ctx.restore();
  }

  function drawOrders(state, now) {
    if (!state.orders.length) {
      ctx.fillStyle = 'rgba(253,243,216,0.12)';
      roundRect(ctx, 14, LAYOUT.orders.y + 6, 1252, 116, 9); ctx.fill();
      text(ctx, 'No tickets yet — the night is young…', 640, LAYOUT.orders.y + 64, 20, PALETTE.dim, 'center', 700);
      return;
    }
    state.orders.forEach((order, index) => {
      const x = 14 + index * (LAYOUT.ticketW + LAYOUT.ticketGap);
      drawTicket(order, x, LAYOUT.orders.y + 6, LAYOUT.ticketW, 116, order.id === state.activeOrderId, now);
    });
  }

  function drawPlate(ctx2, cx, cy, r, order, alpha) {
    ctx2.save();
    ctx2.globalAlpha = alpha;
    ctx2.fillStyle = PALETTE.plate;
    ctx2.beginPath(); ctx2.ellipse(cx, cy, r, r * 0.42, 0, 0, 7); ctx2.fill();
    ctx2.strokeStyle = PALETTE.plateRim; ctx2.lineWidth = 2; ctx2.stroke();
    ctx2.fillStyle = '#e7dcc0';
    ctx2.beginPath(); ctx2.ellipse(cx, cy, r * 0.68, r * 0.27, 0, 0, 7); ctx2.fill();
    if (order) {
      const doneSteps = order.dish.steps.slice(0, order.stepIndex);
      doneSteps.forEach((stepDef, index) => {
        const angle = (index / Math.max(1, doneSteps.length)) * Math.PI * 2 - 0.6;
        const rr = doneSteps.length === 1 ? 0 : r * 0.36;
        drawIngredientIcon(ctx2, stepDef.ingredient, cx + Math.cos(angle) * rr, cy + Math.sin(angle) * rr * 0.42 - 2, r * 0.62);
      });
    }
    ctx2.restore();
  }

  function stationBox(box, label, accent) {
    ctx.fillStyle = PALETTE.counter;
    roundRect(ctx, box.x, LAYOUT.stations.y, box.w, LAYOUT.stations.h, 12); ctx.fill();
    ctx.strokeStyle = PALETTE.panelEdge; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.fillStyle = accent;
    roundRect(ctx, box.x, LAYOUT.stations.y, box.w, 30, 12); ctx.fill();
    ctx.fillRect(box.x, LAYOUT.stations.y + 18, box.w, 12);
    text(ctx, label, box.x + box.w / 2, LAYOUT.stations.y + 15.5, 16.5, '#17101f', 'center', 900);
  }

  function progressBar(x, y, w, frac, color) {
    ctx.fillStyle = '#17101f'; roundRect(ctx, x, y, w, 13, 6.5); ctx.fill();
    ctx.fillStyle = color;
    if (frac > 0.01) { roundRect(ctx, x, y, Math.max(13, w * Math.min(1, frac)), 13, 6.5); ctx.fill(); }
  }

  function drawStations(state, now) {
    const y = LAYOUT.stations.y;
    // PREP board.
    stationBox(LAYOUT.prep, '🔪 PREP · CHOP', '#8fce6e');
    ctx.fillStyle = '#a9743f'; roundRect(ctx, LAYOUT.prep.x + 18, y + 58, LAYOUT.prep.w - 36, 118, 8); ctx.fill();
    ctx.strokeStyle = '#7a4a2b'; ctx.lineWidth = 2; ctx.stroke();
    const chopJob = state.jobs.chop;
    if (chopJob) {
      ctx.fillStyle = 'rgba(255,211,110,0.14)';
      ctx.beginPath(); ctx.arc(LAYOUT.prep.x + LAYOUT.prep.w / 2, y + 116, 56, 0, 7); ctx.fill();
      drawIngredientIcon(ctx, chopJob.ingredient, LAYOUT.prep.x + LAYOUT.prep.w / 2, y + 116, 88);
      const lift = chopJob.done ? 0 : Math.abs(Math.sin(now * 9)) * 10;
      ctx.save();
      ctx.translate(LAYOUT.prep.x + LAYOUT.prep.w / 2 + 52, y + 74 - lift);
      ctx.rotate(0.5);
      ctx.fillStyle = '#cfd6dd'; ctx.fillRect(-4, 0, 8, 42);
      ctx.fillStyle = '#5a3a22'; ctx.fillRect(-3.4, -16, 6.8, 17);
      ctx.restore();
      // Clean-cut pips: three on-rhythm clicks finish the board.
      for (let pip = 0; pip < 3; pip += 1) {
        ctx.fillStyle = pip < chopJob.cleanCuts ? PALETTE.good : '#17101f';
        ctx.beginPath(); ctx.arc(LAYOUT.prep.x + LAYOUT.prep.w / 2 - 22 + pip * 22, y + 190, 8, 0, 7); ctx.fill();
        ctx.strokeStyle = PALETTE.good; ctx.lineWidth = 1.6; ctx.stroke();
      }
      const upSwing = Math.sin(chopJob.t * 10) > 0;
      text(ctx, chopJob.done ? 'DONE — CLICK TO PLATE IT' : upSwing ? 'NOW! CLICK FOR A CLEAN CUT' : 'click on the up-swing…', LAYOUT.prep.x + LAYOUT.prep.w / 2, y + 224, 13.5, chopJob.done || upSwing ? PALETTE.good : PALETTE.text, 'center', 800);
    } else {
      text(ctx, 'Send an ingredient here', LAYOUT.prep.x + LAYOUT.prep.w / 2, y + 104, 15, PALETTE.dim, 'center', 700);
      text(ctx, 'to chop it', LAYOUT.prep.x + LAYOUT.prep.w / 2, y + 126, 15, PALETTE.dim, 'center', 700);
    }
    // WOK.
    stationBox(LAYOUT.wok, '🔥 WOK · FRY', '#ff9a5c');
    const wokCx = LAYOUT.wok.x + LAYOUT.wok.w / 2;
    ctx.fillStyle = '#1c1426'; ctx.beginPath(); ctx.ellipse(wokCx, y + 128, 84, 34, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#2c1e3a'; ctx.beginPath(); ctx.ellipse(wokCx, y + 122, 76, 28, 0, 0, 7); ctx.fill();
    const fryJob = state.jobs.fry;
    // Flames under the wok, taller while frying.
    const flameH = fryJob ? 30 + Math.sin(now * 13) * 6 : 15;
    for (const off of [-38, 0, 38]) {
      ctx.fillStyle = '#ff7a3d';
      ctx.beginPath(); ctx.moveTo(wokCx + off - 11, y + 168); ctx.quadraticCurveTo(wokCx + off, y + 168 - flameH, wokCx + off + 11, y + 168); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffd873';
      ctx.beginPath(); ctx.moveTo(wokCx + off - 5.5, y + 168); ctx.quadraticCurveTo(wokCx + off, y + 168 - flameH * 0.55, wokCx + off + 5.5, y + 168); ctx.closePath(); ctx.fill();
    }
    if (fryJob) {
      ctx.fillStyle = 'rgba(255,154,92,0.16)';
      ctx.beginPath(); ctx.arc(wokCx, y + 114, 52, 0, 7); ctx.fill();
      drawIngredientIcon(ctx, fryJob.ingredient, wokCx, y + 114, 78);
      // Doneness meter with a green perfect window.
      const mx = LAYOUT.wok.x + 18; const mw = LAYOUT.wok.w - 36;
      ctx.fillStyle = '#17101f'; roundRect(ctx, mx, y + 190, mw, 15, 7.5); ctx.fill();
      ctx.fillStyle = 'rgba(125,208,105,0.85)';
      roundRect(ctx, mx + mw * COOK.fryPerfectFrom, y + 190, mw * (COOK.fryPerfectTo - COOK.fryPerfectFrom), 15, 7); ctx.fill();
      const ratio = fryJob.t / fryJob.duration;
      ctx.fillStyle = '#fff7e0';
      ctx.fillRect(mx + Math.min(1.3, ratio) / 1.3 * mw - 2.5, y + 186, 5, 23);
      const label = ratio < COOK.fryPerfectFrom ? 'FRYING… click early = undercooked' : ratio <= COOK.fryPerfectTo ? 'PERFECT — CLICK WOK TO LIFT!' : ratio < COOK.fryBurntAt ? 'OVER — lift it now!' : 'BURNT — lift it anyway';
      text(ctx, label, wokCx, y + 226, 13.5, ratio >= COOK.fryPerfectFrom && ratio <= COOK.fryPerfectTo ? PALETTE.good : PALETTE.text, 'center', 800);
    } else {
      text(ctx, 'Mind the green window', LAYOUT.wok.x + LAYOUT.wok.w / 2, y + 226, 13.5, PALETTE.dim, 'center', 700);
    }
    // POT.
    stationBox(LAYOUT.pot, '🍲 POT · BOIL', '#39d0c4');
    const potCx = LAYOUT.pot.x + LAYOUT.pot.w / 2;
    ctx.fillStyle = '#39424e'; roundRect(ctx, potCx - 62, y + 84, 124, 84, 12); ctx.fill();
    ctx.fillStyle = '#59636e'; ctx.fillRect(potCx - 68, y + 78, 136, 13);
    ctx.fillStyle = '#7fb069'; ctx.beginPath(); ctx.ellipse(potCx, y + 82, 56, 10, 0, 0, 7); ctx.fill();
    const boilJob = state.jobs.boil;
    if (boilJob) {
      drawIngredientIcon(ctx, boilJob.ingredient, potCx, y + 118, 64);
      for (let i = 0; i < 3; i += 1) {
        const sx = potCx - 26 + i * 26 + Math.sin(now * 3 + i * 2) * 4;
        const sy = y + 58 - ((now * 22 + i * 17) % 26);
        ctx.fillStyle = 'rgba(240,248,255,0.5)';
        ctx.beginPath(); ctx.arc(sx, sy, 5.5 - ((now * 22 + i * 17) % 26) * 0.12, 0, 7); ctx.fill();
      }
      progressBar(LAYOUT.pot.x + 16, y + 184, LAYOUT.pot.w - 32, boilJob.t / boilJob.duration, PALETTE.teal);
      // Stir gauge: click the pot while the bubble marker crosses the green.
      if (!boilJob.done) {
        const gx = LAYOUT.pot.x + 16; const gw = LAYOUT.pot.w - 32;
        ctx.fillStyle = '#17101f'; roundRect(ctx, gx, y + 203, gw, 11, 5.5); ctx.fill();
        ctx.fillStyle = 'rgba(125,208,105,0.9)';
        roundRect(ctx, gx + gw * 0.35, y + 203, gw * 0.3, 11, 5); ctx.fill();
        const marker = 0.5 + 0.5 * Math.sin(boilJob.t * 2.4);
        ctx.fillStyle = '#fff7e0';
        ctx.fillRect(gx + marker * gw - 2.5, y + 200, 5, 17);
      }
      text(ctx, boilJob.done ? 'BOILED — CLICK TO PLATE IT' : boilJob.stirred ? 'STIRRED ✓ PERFECT BREWING' : 'CLICK TO STIR IN THE GREEN!', potCx, y + 232, 12.5, boilJob.done || boilJob.stirred ? PALETTE.good : PALETTE.text, 'center', 800);
    } else {
      text(ctx, 'Stir in the green zone', potCx, y + 224, 13.5, PALETTE.dim, 'center', 700);
    }
    // ASSEMBLY.
    stationBox(LAYOUT.assembly, '🍽 ASSEMBLY · THE PLATE', '#ffb347');
    const active = state.orders.find((order) => order.id === state.activeOrderId) || state.orders[0];
    if (active && !active.ready) {
      drawPlate(ctx, LAYOUT.assembly.x + LAYOUT.assembly.w / 2, LAYOUT.stations.y + 104, 74, active, 1);
      const stepDef = active.dish.steps[Math.min(active.stepIndex, active.dish.steps.length - 1)];
      text(ctx, `BUILDING: ${active.dish.name}`, LAYOUT.assembly.x + LAYOUT.assembly.w / 2, y + 168, 15.5, PALETTE.text, 'center', 900);
      text(ctx, `next: ${INGREDIENT_BY_ID[stepDef.ingredient].name} → ${STATIONS[stepDef.station].label}`, LAYOUT.assembly.x + LAYOUT.assembly.w / 2, y + 192, 15, PALETTE.amber, 'center', 800);
      text(ctx, `STEP ${Math.min(active.stepIndex + 1, active.dish.steps.length)}/${active.dish.steps.length} · ${active.stepIndex} on the plate`, LAYOUT.assembly.x + LAYOUT.assembly.w / 2, y + 212, 13.5, PALETTE.dim, 'center', 700);
      // One grade dot per finished step: green Perfect, gold Good, amber OK, red Miss.
      active.qualities.forEach((quality, index) => {
        const gx = LAYOUT.assembly.x + LAYOUT.assembly.w / 2 + (index - (active.qualities.length - 1) / 2) * 24;
        ctx.fillStyle = quality >= 0.95 ? PALETTE.good : quality >= 0.78 ? '#ffd873' : quality >= 0.55 ? PALETTE.warn : PALETTE.bad;
        ctx.beginPath(); ctx.arc(gx, y + 234, 7.5, 0, 7); ctx.fill();
        ctx.fillStyle = '#17101f';
        ctx.font = `900 10px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(quality >= 0.95 ? 'P' : quality >= 0.78 ? 'G' : quality >= 0.55 ? 'O' : 'M', gx, y + 234.5);
      });
    } else if (active && active.ready) {
      drawPlate(ctx, LAYOUT.assembly.x + LAYOUT.assembly.w / 2, LAYOUT.stations.y + 104, 74, active, 1);
      text(ctx, 'THAT PLATE IS AT THE PASS →', LAYOUT.assembly.x + LAYOUT.assembly.w / 2, y + 192, 16, PALETTE.good, 'center', 900);
    } else {
      drawPlate(ctx, LAYOUT.assembly.x + LAYOUT.assembly.w / 2, LAYOUT.stations.y + 104, 74, null, 0.5);
      text(ctx, 'Pick a ticket to start a plate', LAYOUT.assembly.x + LAYOUT.assembly.w / 2, y + 192, 15, PALETTE.dim, 'center', 700);
    }
    // PASS.
    stationBox(LAYOUT.pass, '🛎 PASS · SERVE', '#7dd069');
    const readyOrders = state.orders.filter((order) => order.ready);
    if (readyOrders.length) {
      readyOrders.slice(0, 2).forEach((order, index) => {
        const px = LAYOUT.pass.x + LAYOUT.pass.w / 2;
        const py = y + 84 + index * 74;
        const avg = order.qualities.length ? order.qualities.reduce((a, b) => a + b, 0) / order.qualities.length : 1;
        const stars = avg >= 0.9 ? 3 : avg >= 0.68 ? 2 : avg >= 0.4 ? 1 : 0;
        if (stars > 0) text(ctx, '★'.repeat(stars), px, py - 32, 15, '#ffd873', 'center', 900);
        drawPlate(ctx, px, py, 52, order, 1);
        text(ctx, order.dish.name, px, py + 30, 13, PALETTE.text, 'center', 900);
        text(ctx, `CLICK TO SERVE · ${order.dish.price}c`, px, py + 48, 12.5, PALETTE.good, 'center', 900);
      });
      if (readyOrders.length === 1) text(ctx, 'Hot and waiting!', LAYOUT.pass.x + LAYOUT.pass.w / 2, y + 224, 13.5, PALETTE.dim, 'center', 700);
    } else {
      text(ctx, 'Finished plates', LAYOUT.pass.x + LAYOUT.pass.w / 2, y + 100, 15.5, PALETTE.dim, 'center', 700);
      text(ctx, 'land here, ready', LAYOUT.pass.x + LAYOUT.pass.w / 2, y + 122, 15.5, PALETTE.dim, 'center', 700);
      text(ctx, 'to serve', LAYOUT.pass.x + LAYOUT.pass.w / 2, y + 144, 15.5, PALETTE.dim, 'center', 700);
    }
  }

  function drawBins(state) {
    ctx.fillStyle = '#241631';
    ctx.fillRect(0, LAYOUT.bins.y - 8, STAGE.width, LAYOUT.bins.h + 16);
    text(ctx, 'INGREDIENT COUNTER — click a bin (or press its key) to send it to its station', 16, LAYOUT.bins.y - 16 + 4, 12.5, PALETTE.muted, 'left', 900);
    const active = state.orders.find((order) => order.id === state.activeOrderId) || state.orders[0];
    const needed = active && !active.ready ? active.dish.steps[active.stepIndex]?.ingredient : null;
    INGREDIENTS.forEach((ingredient, index) => {
      const x = LAYOUT.bins.x + index * (LAYOUT.binW + LAYOUT.binGap);
      const y = LAYOUT.bins.y + 6;
      const isNeeded = ingredient.id === needed;
      ctx.fillStyle = isNeeded ? '#5a3a16' : '#2c1e3a';
      roundRect(ctx, x, y, LAYOUT.binW, 84, 9); ctx.fill();
      ctx.strokeStyle = isNeeded ? PALETTE.amber : PALETTE.panelEdge;
      ctx.lineWidth = isNeeded ? 3.2 : 1.4; ctx.stroke();
      ctx.fillStyle = '#17101f';
      ctx.beginPath(); ctx.arc(x + 15, y + 14, 9.5, 0, 7); ctx.fill();
      text(ctx, ingredient.key, x + 15, y + 14.5, 12.5, PALETTE.amber, 'center', 900);
      drawIngredientIcon(ctx, ingredient.id, x + LAYOUT.binW / 2, y + 40, 40);
      text(ctx, ingredient.name.toUpperCase(), x + LAYOUT.binW / 2, y + 72, 12.5, isNeeded ? PALETTE.amber : PALETTE.text, 'center', 800);
      if (isNeeded) text(ctx, '▼ NEXT', x + LAYOUT.binW / 2, y - 4, 11, PALETTE.flame, 'center', 900);
    });
  }

  function drawStrip(state) {
    ctx.fillStyle = '#120a1a';
    ctx.fillRect(0, LAYOUT.strip.y, STAGE.width, LAYOUT.strip.h + 8);
    const message = state.messageTimer > 0 ? state.message : 'Click ticket → click the glowing ingredient → work its station → serve at the pass.  Keys 1-0 Q W pick · SPACE serve · P pause · M mute';
    text(ctx, message, 640, LAYOUT.strip.y + 24, 15.5, state.messageTimer > 0 ? PALETTE.amber : PALETTE.dim, 'center', 700);
    if (state.lastServe && state.elapsed - state.lastServe.at < 3) {
      const starsText = state.lastServe.stars ? ` ${'★'.repeat(state.lastServe.stars)}` : '';
      text(ctx, `${state.lastServe.grade}! +${state.lastServe.earned}c ${state.lastServe.name}${starsText}`, 1210, LAYOUT.strip.y + 24, 15, PALETTE.good, 'right', 900);
    }
  }

  function drawPanel(lines, title, prompt, accent = PALETTE.amber) {
    ctx.fillStyle = 'rgba(10,6,16,0.72)';
    ctx.fillRect(0, 0, STAGE.width, STAGE.height);
    const w = 760; const h = 118 + lines.length * 30 + 74;
    const x = (STAGE.width - w) / 2; const y = (STAGE.height - h) / 2;
    ctx.fillStyle = '#2c1e3a'; roundRect(ctx, x, y, w, h, 16); ctx.fill();
    ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.stroke();
    text(ctx, title, STAGE.width / 2, y + 52, 40, accent, 'center', 900);
    lines.forEach((line, index) => text(ctx, line, STAGE.width / 2, y + 100 + index * 30, 18.5, PALETTE.text, 'center', 600));
    text(ctx, prompt, STAGE.width / 2, y + h - 34, 19, '#ffd873', 'center', 900);
  }

  function draw(state, screen, now, extras) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PALETTE.night;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    drawBackground(state);
    drawHud(state, extras.audioMuted);
    drawOrders(state, now);
    drawStations(state, now);
    drawBins(state);
    drawStrip(state);
    if (screen === SCREEN_TITLE) {
      drawPanel([
        extras.tagline,
        extras.titleLine,
        extras.titleSub,
        '',
        'Click a ticket, cook each step — chop, fry in the green, boil, plate —',
        'then serve it hot at the pass before patience runs out.',
      ], 'KAKI LIMA MIDNIGHT', 'Click or press SPACE to open the stall');
    } else if (screen === SCREEN_PAUSED) {
      drawPanel(['The wok will wait for you.'], 'PAUSED', 'Press P or click to resume');
    } else if (screen === SCREEN_SUMMARY) {
      const starsText = '★'.repeat(extras.stars) + '☆'.repeat(Math.max(0, 3 - extras.stars));
      drawPanel([
        extras.summaryLine,
        '',
        `Served ${extras.summary.served} plates · Missed ${extras.summary.missed} orders`,
        `Earned ${extras.summary.dayCoins} coins tonight · Best combo x${extras.summary.bestCombo}`,
        extras.summary.dayCoins >= extras.summary.targetCoins
          ? `Target ${extras.summary.targetCoins}c: REACHED ✓ — the stall made its night`
          : `Target ${extras.summary.targetCoins}c: missed by ${extras.summary.targetCoins - extras.summary.dayCoins}c — the stars feel it`,
        `Stall rating ${starsText}`,
        extras.summary.day >= 2 ? 'The menu grows: new dishes join the board.' : 'Tomorrow: Bihun Kuah, Sambal Rice and Sate join the menu.',
      ], `NIGHT ${extras.summary.day} — LAST ORDERS`, 'Click or press ENTER for the next night');
    }
  }

  return { draw, toStage };
}
