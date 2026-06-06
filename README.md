# Omar Pizza — Neapolitan Calculator

**Live app:** https://xk5fvhmcht-oss.github.io/omar-pizza/

A physics- and biology-grounded Neapolitan pizza dough calculator. Built as a Progressive Web App — install it on your iPhone home screen and it works offline.

The app has one job: tell you how much yeast to use and how to time your ferment so a dough ball arrives ready to stretch and bake — whether that's 4 hours from now or 72. Every recommendation is anchored to published reference data or real bakes, never guessed.

## Fermentation Modes

Five modes. Direct dough (Rapid/Slow) runs on one unified model; the two preferments and sourdough each answer their own question.

- **⚡ Rapid / 🌙 Slow** — two doors into one room. Both run the **Naples model** (below). Rapid is framed for same-day, Slow for overnight/cold-retard, but the math is identical and continuous — a Slow dough with the fridge zeroed gives exactly what Rapid would.
- **🍋 Sourdough** — inoculation-based, with ripeness and timing guidance.
- **🍕 Biga** — stiff pre-ferment (44–60% hydration). Preferment yeast calibrated to the Giorilli standard (0.33% IDY at 18h/64°F). Final-dough yeast uses the coverage model (below).
- **🌊 Poolish** — liquid pre-ferment (100% hydration). Preferment yeast anchored to the median of five published sources. Final-dough yeast uses the coverage model, tuned so a normal poolish needs none.

## The Naples Model (direct dough)

The core of the app. One activity-integral model, anchored to **24h at 75°F = the Naples standard** and validated against the Ooni calculator, the Lehmann cold-retard method, and InnoviCat/AVPN data.

```
yeast_IDY% = A(rT) × E^(-1.391)
E          = bH + s_eff(fT) × fH          (effective room-equivalent hours)
A(rT)      = 0.00982 × 2^((75 − rT) / 15.1)
s_eff(fT)  = 0.0565  × 2^((fT − 39) / 15.5)
```

**The biology it encodes:** at room temperature the yeast population compounds (it reproduces as it ferments), which is why long ferments need so little yeast — the steep power-law exponent captures this. In the fridge the population is near-static (reproduction nearly stops below ~40°F), so each fridge hour contributes only ~0.057 of a room-temperature hour. That single effective-rate figure absorbs the cooldown transient, so we don't over-model a fridge whose temperature isn't even constant.

Below 4 hours (room only) a linear ramp grades smoothly from the 4h anchor up to a 2% ceiling at 1h, so very short same-day bakes stay sane.

### Naples vs Yeasty toggle

- **🍕 Naples** (default) — the unified model above. Restrained, Naples-style, leans slightly under.
- **🍞 Yeasty** — the previous three-model "new physics" build, kept as a comparison. Tends to recommend a bit more yeast. Useful for side-by-side testing.

The old "classic" linear model has been retired (it over-recommended). In practice Naples and Yeasty agree across most everyday scenarios; they diverge only at the extremes.

## Cold Retard

Handled inside the Naples model via the `s_eff(fT) × fH` term — no separate formula. Validated against Lehmann/PizzaBlab (6/6) and InnoviCat multipliers (AVPN + Dough School source). Warmer-fridge sensitivity is real: at 43°F+ the app warns the fridge is fermenting significantly.

## Preferment Final-Dough Yeast

After a biga or poolish is mixed into the final dough, the mature preferment already carries much of the leavening. The remaining fresh flour needs a top-up — and that top-up responds to the final schedule and the preferment percentage:

```
finalIDY = freshFlour × Naples(finalSchedule) × (1 − coverage)
coverage = ANCHOR × (pct / (1 − pct)),  capped at 1.0
```

- **Biga** ANCHOR = 0.834 — anchored to a real bake (1.5g ADY at 2h room/75°F, 50% biga). Coverage reaches 100% (zero added yeast) around 70% biga.
- **Poolish** ANCHOR = 2.333 — a wet poolish is a stronger, less-exhausted leavener, so coverage reaches 100% around 30% poolish. A normal poolish (20–40%) needs **no added yeast** — it is the leavening — which matches published practice. Only a small poolish with a short finish gets a small optional boost.

Zero means zero (no artificial floor), and the final-dough yeast is shown at 0.01g resolution.

## Over-Ferment Nudge

A gentle, time-and-temperature-aware note — never a verdict, never a collapse time. It appears when:

- **Direct dough:** the model wants *less* yeast than is practical to weigh (below ~0.1g) — meaning the schedule has run long/warm past ready.
- **Preferment:** the schedule delivers more than ~2 room-hours-at-75°F of activity *past* the point where the preferment alone fully leavens.

Both triggers scale with temperature from the activity math — a cooler kitchen gets more grace, a hotter one triggers sooner. The line reads: *"🌙 may ferment past its peak at this time & temperature — for more control, try a cooler spot, a shorter proof, or mixing later."*

## Other Features

- **Desired Dough Temperature** — 3-factor DDT water temperature for all modes.
- **Fermentation potential meter** — visual activity gauge with zone warnings (independent of which yeast model is active).
- **Smart Schedule** — set your bake time and the app works backward to schedule every fermentation window. Supports Slow, Sourdough, Biga, and Poolish.
- **Newtonian cooling model** — calculates temper time to pull cold balls before baking.
- **Keep-awake toggle** — holds the screen on while you bake with floury hands (Screen Wake Lock API, session-only, re-acquires on return).
- **Bake journal** — two side-by-side tiles (save / journal) with a live entry-count badge. Captures full params, mode-specific ferment detail, and a recipe snapshot; reload any bake's settings; export all entries to clipboard (iOS fallback: selectable overlay).
- **Autolyse toggle** — 30-minute rest step for KitchenAid and spiral workflows.
- **Two themes** — Artisan and Professional.
- **PWA** — network-first service worker (always fetches the latest when online, falls back to cache offline). Installable on iOS via Safari share sheet.

## Ingredients

Pure Neapolitan. Four ingredients:

- Tipo 00 flour (or bread flour for direct dough)
- Water
- Sea salt — 2.8% (AVPN range 2.5–3%)
- Yeast — instant, active dry, or fresh (ADY = IDY × 1.33, Fresh = IDY × 3.0)

Optional: diastatic malt (biga), honey (poolish).

## Dough Balls

- Range 220–300g in 5g steps
- Pills: 230g (thin) / 250g (classic, AVPN standard) / 270g (generous)
- Default: 6 × 250g

## Ovens & Mixers

- **Ovens:** home steel ~550°F · Gozney Dome 700–900°F
- **Mixers:** hand · KitchenAid · Ooni Halo Pro spiral

## Validation Summary

| Source | Result |
|--------|--------|
| Ooni room temp (the anchor) | 6/6 ✓ |
| Ooni cold retard | 4/4 ✓ |
| Lehmann / InnoviCat cold | 6/6 ✓ |
| Biga (Giorilli + real bake) | anchored ✓ |
| Poolish (5 published sources) | anchored ✓ |
| Physics directions (time, temp, fridge) | all monotonic ✓ |

dough.school was deliberately set aside as the lone outlier — it targets a fuller, yeastier rise and stood alone against Ooni, Lehmann, InnoviCat, and AVPN. Anchoring to Ooni/Naples resolved a long-standing calibration drift.

## Install on iPhone

1. Open in Safari
2. Tap Share
3. Tap "Add to Home Screen"
4. Works offline after first load

## Version

Current: v1.6.6 · service worker cache v10

## License

MIT

---

*Built by Omar with Claude. No frameworks, no build tools, no dependencies — just flour, water, salt, and JavaScript.*
