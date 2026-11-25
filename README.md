# Kaki Lima Midnight

**Nyalakan kompor, layani malam — the street eats, you cook.**

An original night-stall cooking game for desktop Chrome, built for the
make.fun "Make the best cooking game" bounty. The carts roll out at dusk and
the wok's already hot: run a kaki lima street stall through a 150-second
night shift, then come back tomorrow to a harder night and a bigger menu.

## How to play

- **Order board** — tickets land at the top with the dish, its step chips and
  a shrinking patience bar. Click a ticket to make it the active plate.
- **Ingredient counter** — 12 bins along the bottom (rice, noodle, egg,
  chicken, shrimp, tofu, cabbage, chili, garlic, tomato, satay, dough).
  Click a bin or press its key (1–0, Q, W) to send the next needed
  ingredient to its station. The glowing bin is always the next step.
- **Stations** — chop on the prep board (click the board to chop faster),
  fry in the wok (lift it inside the green doneness window or serve it
  undercooked, over or burnt), boil in the pot (steady, with a grace
  window), and plate the finisher onto the assembly plate, where the dish
  visibly builds up ingredient by ingredient.
- **The pass** — a finished plate waits at the pass, ready to serve. Click
  it (or press Space) to collect its price plus a tip scaled by patience
  left and cooking quality. Good, fast plates build a combo streak.
- Expired tickets walk away and cost 5 coins. At last orders you get the
  night's summary — served, missed, earnings and a 0–3 star stall rating —
  and the next night is faster, less patient, and unlocks new dishes.

8 dishes, 3 nights of menu growth, pause (P), mute (M), and WebAudio sound
generated entirely in code (sizzle, chop, bell, coins) — no audio files, no
network requests, no libraries. All art is canvas vector drawn in code.

## Run it

```sh
node serve.ts            # serves game/ at http://localhost:8091
# or serve game/ with any static file server and open index.html
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/`
to the output directory and writes `dossier.json` with the vendored
`vendor/makefun-game.ts` library, unchanged from the bounty kit.

## Layout

- `game/index.html` — the page
- `game/src/config.js` — tuning, palette, layout boxes
- `game/src/data.js` — ingredients, dishes, stations, flavor copy
- `game/src/world.js` — rules and state: orders, stations, quality, scoring
- `game/src/render.js` — all canvas drawing
- `game/src/input.js` — mouse/keyboard mapping and hit-tests
- `game/src/audio.js` — generated WebAudio sounds
- `game/src/shots.js` — deterministic screenshot scenes + automated playtest
- `game/src/main.js` — boot and the game loop

Recipe data and the first draft of the audio module were co-produced with a
Beastfarmer model (`deepseek-v4.1-flash-uncensored`) and integrated by hand.
Everything else is an original work written for this bounty.

MIT licensed — see `LICENSE`.
