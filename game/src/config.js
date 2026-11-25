// Kaki Lima Midnight — every tuning number, colour and layout box in one place.
// The kitchen is a fixed 1280x720 stage; the renderer scales it to the window,
// so gameplay never depends on the player's screen size.

export const STAGE = { width: 1280, height: 720 };
export const STEP = 1 / 60;

export const DAY = {
  seconds: 150,
  firstSpawnDelay: 1.2,
  baseSpawnEvery: 8.5,
  spawnEveryPerDay: 0.7,
  minSpawnEvery: 4.2,
  basePatience: 52,
  patiencePerDay: 3,
  minPatience: 34,
  maxOrders: 4,
  missPenalty: 5,
};

export const COOK = {
  chopSeconds: 1.05,
  chopClickBoost: 0.34,
  frySeconds: 2.6,
  fryPerfectFrom: 0.55,
  fryPerfectTo: 0.86,
  fryBurntAt: 1.08,
  boilSeconds: 2.3,
  boilGraceSeconds: 1.6,
};

export const SCORE = {
  tipFraction: 0.5,
  perfectQuality: 1,
  goodQuality: 0.82,
  okQuality: 0.6,
  poorQuality: 0.38,
  comboStepBonus: 2,
};

export const PALETTE = {
  night: '#17101f',
  sky: '#241631',
  awning: '#7a2436',
  awningStripe: '#e8a33d',
  wood: '#4a2e20',
  woodLight: '#6b4630',
  counter: '#2e1d33',
  counterTop: '#8a5a36',
  panel: '#2c1e3a',
  panelEdge: '#5a4370',
  paper: '#fdf3d8',
  paperEdge: '#d9b878',
  ink: '#33241a',
  text: '#fdf3d8',
  muted: '#c9a86a',
  dim: '#9b8aa8',
  amber: '#ffb347',
  flame: '#ff7a3d',
  teal: '#39d0c4',
  good: '#7dd069',
  warn: '#ffb347',
  bad: '#ff5d5d',
  plate: '#f4ead2',
  plateRim: '#cbb98f',
};

export const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';

// Layout boxes the renderer and the input hit-tests share, so what is drawn
// is exactly what can be clicked.
export const LAYOUT = {
  hud: { x: 0, y: 0, w: 1280, h: 54 },
  orders: { x: 14, y: 62, w: 1252, h: 128 },
  ticketW: 302,
  ticketGap: 14,
  stations: { y: 202, h: 252 },
  prep: { x: 14, w: 238 },
  wok: { x: 264, w: 238 },
  pot: { x: 514, w: 200 },
  assembly: { x: 726, w: 306 },
  pass: { x: 1044, w: 222 },
  bins: { x: 14, y: 560, w: 1252, h: 96 },
  binW: 96,
  binGap: 8.7,
  strip: { y: 664, h: 48 },
  pauseBtn: { x: 1152, y: 9, w: 54, h: 36 },
  muteBtn: { x: 1214, y: 9, w: 52, h: 36 },
};
