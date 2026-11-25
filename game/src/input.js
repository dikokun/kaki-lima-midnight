// Kaki Lima Midnight — input mapping only: raw mouse and keyboard events in,
// named game actions out. Hit-tests use the same LAYOUT boxes the renderer
// draws with, so the clickable thing is always the visible thing.

import { LAYOUT } from './config.js';
import { INGREDIENTS } from './data.js';

export const ACTION_START = 'start';
export const ACTION_PAUSE = 'pause';
export const ACTION_MUTE = 'mute';
export const ACTION_SERVE = 'serve';
export const ACTION_NEXT_DAY = 'next-day';

const KEY_TO_INGREDIENT = new Map();
for (const ingredient of INGREDIENTS) {
  KEY_TO_INGREDIENT.set(`Digit${ingredient.key}`, ingredient.id);
  KEY_TO_INGREDIENT.set(`Key${ingredient.key}`, ingredient.id);
}
KEY_TO_INGREDIENT.set('Digit0', 'tomato');
KEY_TO_INGREDIENT.set('KeyQ', 'satay');
KEY_TO_INGREDIENT.set('KeyW', 'dough');

function inside(point, box) {
  return point.x >= box.x && point.x <= box.x + box.w && point.y >= box.y && point.y <= box.y + box.h;
}

// What a click at a stage point means, given how many order tickets and ready
// plates are currently on show. Pure geometry: the caller acts on the result.
export function hitTest(point, orderCount, readyCount) {
  if (inside(point, LAYOUT.pauseBtn)) return { type: ACTION_PAUSE };
  if (inside(point, LAYOUT.muteBtn)) return { type: ACTION_MUTE };
  // Order tickets.
  for (let i = 0; i < orderCount; i += 1) {
    const box = { x: 14 + i * (LAYOUT.ticketW + LAYOUT.ticketGap), y: LAYOUT.orders.y + 6, w: LAYOUT.ticketW, h: 116 };
    if (inside(point, box)) return { type: 'ticket', index: i };
  }
  // Stations.
  const sy = LAYOUT.stations.y;
  const sh = LAYOUT.stations.h;
  if (inside(point, { x: LAYOUT.prep.x, y: sy, w: LAYOUT.prep.w, h: sh })) return { type: 'station', station: 'chop' };
  if (inside(point, { x: LAYOUT.wok.x, y: sy, w: LAYOUT.wok.w, h: sh })) return { type: 'station', station: 'fry' };
  if (inside(point, { x: LAYOUT.pot.x, y: sy, w: LAYOUT.pot.w, h: sh })) return { type: 'station', station: 'boil' };
  if (inside(point, { x: LAYOUT.pass.x, y: sy, w: LAYOUT.pass.w, h: sh })) {
    if (readyCount > 0) {
      const slot = point.y < sy + 84 + 37 ? 0 : 1;
      return { type: 'serve', slot: Math.min(slot, readyCount - 1) };
    }
    return { type: 'station', station: 'pass' };
  }
  if (inside(point, { x: LAYOUT.assembly.x, y: sy, w: LAYOUT.assembly.w, h: sh })) return { type: 'station', station: 'plate' };
  // Ingredient bins.
  for (let i = 0; i < INGREDIENTS.length; i += 1) {
    const box = { x: LAYOUT.bins.x + i * (LAYOUT.binW + LAYOUT.binGap), y: LAYOUT.bins.y + 6, w: LAYOUT.binW, h: 84 };
    if (inside(point, box)) return { type: 'ingredient', ingredient: INGREDIENTS[i].id };
  }
  return { type: 'none' };
}

export function keyAction(event) {
  if (event.code === 'Space' || event.code === 'Enter') return { type: ACTION_START };
  if (event.code === 'KeyP' || event.code === 'Escape') return { type: ACTION_PAUSE };
  if (event.code === 'KeyM') return { type: ACTION_MUTE };
  const ingredient = KEY_TO_INGREDIENT.get(event.code);
  if (ingredient) return { type: 'ingredient', ingredient };
  return null;
}
