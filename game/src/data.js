// Kaki Lima Midnight — the stall's pantry and menu.
// Recipe data co-produced with the Beastfarmer model (deepseek-v4.1-flash-
// uncensored) for this build and re-balanced by hand: 12 counter ingredients,
// 8 multi-step dishes, four stations. A dish is an ordered list of steps; each
// step sends one ingredient to one station, and the last step always plates a
// finishing ingredient so a finished dish is assembled, never teleported.

export const STATIONS = {
  chop: { id: 'chop', label: 'PREP · CHOP', short: 'chop' },
  fry: { id: 'fry', label: 'WOK · FRY', short: 'fry' },
  boil: { id: 'boil', label: 'POT · BOIL', short: 'boil' },
  plate: { id: 'plate', label: 'PLATE', short: 'plate' },
};

export const INGREDIENTS = [
  { id: 'rice', name: 'Rice', key: '1', color: '#f7f2df' },
  { id: 'noodle', name: 'Noodle', key: '2', color: '#f2c94c' },
  { id: 'egg', name: 'Egg', key: '3', color: '#ffb347' },
  { id: 'chicken', name: 'Chicken', key: '4', color: '#e8a07a' },
  { id: 'shrimp', name: 'Shrimp', key: '5', color: '#ff8f7a' },
  { id: 'tofu', name: 'Tofu', key: '6', color: '#efe3c2' },
  { id: 'cabbage', name: 'Cabbage', key: '7', color: '#8fce6e' },
  { id: 'chili', name: 'Chili', key: '8', color: '#e23b3b' },
  { id: 'garlic', name: 'Garlic', key: '9', color: '#f1e6f5' },
  { id: 'tomato', name: 'Tomato', key: '0', color: '#ef5d4d' },
  { id: 'satay', name: 'Satay', key: 'Q', color: '#b5763a' },
  { id: 'dough', name: 'Dough', key: 'W', color: '#e6c88f' },
];

export const INGREDIENT_BY_ID = Object.fromEntries(INGREDIENTS.map((item) => [item.id, item]));

function step(ingredient, station) {
  return { ingredient, station };
}

export const DISHES = [
  {
    id: 'nasi-goreng', name: 'Nasi Goreng Gerobak', price: 14, unlockDay: 1, tint: '#e2703a',
    steps: [step('chicken', 'chop'), step('garlic', 'chop'), step('rice', 'fry'), step('egg', 'fry'), step('chili', 'plate')],
  },
  {
    id: 'tahu-crispy', name: 'Tahu Crispy Sambal', price: 9, unlockDay: 1, tint: '#d9a441',
    steps: [step('tofu', 'chop'), step('garlic', 'chop'), step('tofu', 'fry'), step('chili', 'plate')],
  },
  {
    id: 'mie-tektek', name: 'Mie Tek-Tek Malam', price: 12, unlockDay: 1, tint: '#c94f38',
    steps: [step('cabbage', 'chop'), step('garlic', 'fry'), step('noodle', 'boil'), step('egg', 'plate')],
  },
  {
    id: 'roti-jala', name: 'Roti Jala Telur', price: 8, unlockDay: 1, tint: '#e0b45c',
    steps: [step('dough', 'chop'), step('egg', 'fry'), step('dough', 'fry'), step('tomato', 'plate')],
  },
  {
    id: 'bihun-kuah', name: 'Bihun Kuah Gerobak', price: 11, unlockDay: 2, tint: '#7fb069',
    steps: [step('noodle', 'boil'), step('cabbage', 'chop'), step('garlic', 'boil'), step('egg', 'plate')],
  },
  {
    id: 'sambal-rice', name: 'Sambal Tomat Rice', price: 15, unlockDay: 2, tint: '#d64541',
    steps: [step('tomato', 'chop'), step('chili', 'chop'), step('garlic', 'fry'), step('rice', 'fry'), step('egg', 'plate')],
  },
  {
    id: 'sate-malam', name: 'Sate Tengah Malam', price: 18, unlockDay: 2, tint: '#a05c2c',
    steps: [step('garlic', 'chop'), step('chicken', 'chop'), step('satay', 'fry'), step('chili', 'plate')],
  },
  {
    id: 'udang-bakar', name: 'Udang Bakar Pedas', price: 22, unlockDay: 3, tint: '#e2603f',
    steps: [step('shrimp', 'chop'), step('chili', 'chop'), step('garlic', 'fry'), step('shrimp', 'fry'), step('tomato', 'plate')],
  },
];

export const DISH_BY_ID = Object.fromEntries(DISHES.map((dish) => [dish.id, dish]));

export const FLAVOR = {
  tagline: 'Nyalakan kompor, layani malam — the street eats, you cook.',
  titleLine: "The carts roll out at dusk and the wok's already hot.",
  titleSub: 'Selamat malam — tie your apron, the night is hungry.',
  rushLine: "Rush hour! Bikes everywhere and someone's yelling 'pedas!'",
  summaryLine: "Lights dim, tables wiped, the final es teh poured.",
};
