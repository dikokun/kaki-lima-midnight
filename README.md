# kaki-lima-midnight

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/dikokun/kaki-lima-midnight/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/dikokun/kaki-lima-midnight/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

**Kaki Lima Midnight** — *Nyalakan kompor, layani malam — the street eats, you cook.*

An original night-stall cooking game for desktop Chrome. The carts roll out
at dusk and the wok's already hot: run a kaki lima street stall through a
150-second night shift, then come back tomorrow to a harder night and a
bigger menu.

- **Order board** — tickets land at the top, each with a sequential number
  (#01, #02, …), one of 10 original customer personas (DRIVER OJOL, SATPAM
  SHIFT MALAM, MAHASISWA BEGADANG, KURIR TENGAH MALAM, …) whose tip and
  patience multipliers differ, the dish's step chips and a shrinking
  patience bar. Click a ticket to make it the active plate.
- **Ingredient counter** — 12 bins along the bottom (rice, noodle, egg,
  chicken, shrimp, tofu, cabbage, chili, garlic, tomato, satay, dough).
  Click a bin or press its key (1–0, Q, W) to send the next needed
  ingredient to its station; the glowing bin is always the next step.
- **Stations are skill actions, and every step is graded** PERFECT / GOOD /
  OK / MISS — a missed step never ends the run, it just drags the dish's
  grade, tip and stars down: chop on the prep board (click on the knife's
  up-swing; 3 clean cuts finish), fry in the wok (lift inside the green
  doneness window or serve it undercooked, over or burnt), boil in the pot
  (click to stir while the bubble marker crosses the green zone), and plate
  the finisher onto the assembly plate, where the dish visibly builds up
  ingredient by ingredient, one grade dot per finished step. The ingredient
  being worked is shown big at its station; tickets and the assembly board
  show the current Step n/N.
- **HUD target** — each night has an earnings target (120 / 160 / 200
  coins) with a progress bar; the last-orders summary grades the night on
  served ratio and the target, awarding 0–3 stars.
- **The pass** — a finished plate waits at the pass with its 1–3 star dish
  rating. Click it (or press Space) to collect price plus a tip scaled by
  patience left, cooking quality and persona. Good, fast plates build a
  combo streak; expired tickets walk away and cost 5 coins.

8 dishes with distinct step chains, unlocking across Nights 1/2/3. Pause
(P), mute (M), and WebAudio sound generated entirely in code (sizzle, chop,
bell, coins) — no audio files, no network requests, no libraries. All art
is canvas vector drawn in code.

Hand-in: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts` copies
`game/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored `vendor/makefun-game.ts` library,
unchanged from the bounty kit (Node 22, standard library only).

Source layout: `game/src/config.js` (tuning, palette, layout),
`game/src/data.js` (ingredients, dishes, personas, flavor copy),
`game/src/world.js` (rules and state), `game/src/render.js` (all canvas
drawing), `game/src/input.js` (mouse/keyboard hit-tests),
`game/src/audio.js` (generated WebAudio sounds), `game/src/shots.js`
(deterministic screenshot scenes + automated playtest), `game/src/main.js`
(boot and the game loop).

Recipe data and the first draft of the audio module were co-produced with
a Beastfarmer model (`deepseek-v4.1-flash-uncensored`) and integrated by
hand. Everything else is an original work written for this bounty.

MIT licensed — see `LICENSE`.

## Run it

```sh
node serve.ts
# serves game/ at http://localhost:8091 — open it in desktop Chrome.
# Any static file server works too: serve the game/ folder and open
# game/index.html; the game loads nothing over the network.
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=best-cooking-game-20261125-0137&utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>
