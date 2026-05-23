# Omar Pizza — Neapolitan Calculator

**Live app:** https://xk5fvhmcht-oss.github.io/omar-pizza/

A science-grounded Neapolitan pizza dough calculator. Built as a Progressive Web App — install it on your iPhone home screen and it works offline.

## Fermentation Modes

**Five modes**, each with its own calibrated yeast formula:

- **⚡ Rapid** — same-day, 1–8 hours room temp. Power law anchored to dough.school reference table. Linear ramp below 4h smooths the transition to the 2% ceiling for very short proofs.
- **🌙 Slow** — overnight room temp or cold retard. Neapolitan partial-rise model (Naples tradition: 8–24h room temp, 24–72h cold retard). Lehmann method for cold fermentation, validated against PizzaBlab and InnoviCat reference data.
- **🍋 Sourdough** — inoculation-based model with ripeness guidance.
- **🍕 Biga** — stiff pre-ferment (44–60% hydration). Calibrated against the Giorilli standard (0.33% IDY at 18h/64°F, C=157). Supports room temp, cold retard, and hybrid workflows. Optional diastatic malt toggle (0.5% flour, ×1.18 activity).
- **🌊 Poolish** — liquid pre-ferment (always 100% hydration). Two-model architecture: power law for room temp (POOLISH_A_REF anchored to median of 5 independent sources), inverse formula for cold poolish. Optional honey toggle (2% poolish flour, ×1.15 activity).

## Science Foundation

Yeast recommendations are calculated from validated formulas, not lookup tables:

**Rapid model (bH ≥ 4h):**
```
y = A(rT) × bH^(-1.676) / 100
A(rT) = 10.0 × 2^((77-rT)/15.5)
```
Calibrated against dough.school reference table (4–24h, three temperatures). Below 4h a linear ramp grades smoothly from the 4h anchor to the 2% ceiling at 1h.

**Slow model (Neapolitan partial rise):**
```
y = 0.0006 × (8.5 / t_eff)^0.5
t_eff = bH × Q10(rT)
```
Blend zone 5–12h (sigmoid) transitions from rapid to slow without a cliff.

**Cold retard (Lehmann method):**
```
y = (K/100) × (3.6 / activity) × 0.75
activity = bH × Q10r × 0.90 + fH × suppF × Q10f
suppF = 0.518 (validated: 1h RT @ 72°F ≈ 6.2h fridge @ 39°F)
K = 0.217
```
Validated against 9 Lehmann/PizzaBlab scenarios and InnoviCat multipliers (AVPN + Dough School source).

**Biga model:**
```
y = BIGA_TARGET / (C × bH × Q10r × hydF + fH × suppF_biga × Q10f × hydF)
C = 157, BIGA_TARGET = 3.5
```
Giorilli-validated. Separate hydration factor (hydF) and fridge suppression.

**Poolish model (room temp):**
```
y = A(rT) × bH^(-1.872) / 100
A(rT) = 13.9 × 2^((72-rT)/18)
```
Inverted Q10 (cooler = more yeast). A_REF anchored to median of biancolievito, Weekend Bakery (summer + winter), Fresh Loaf real bake, and mypizzacorner.

**Poolish model (cold):**
```
y = 6.7 / (1595 × (bH × Q10r + fH × 0.250 × Q10f))
```

## Formula Toggle

Switch between **⚗ new physics** (default, all formulas above) and **⚗ classic** (legacy linear model) to compare recommendations. Classic kept for reference; new physics is the validated default.

## Other Features

- **Desired Dough Temperature** — 3-factor DDT water temperature for all modes
- **Fermentation potential meter** — visual activity gauge with zone warnings (under/ideal/high/excessive)
- **Smart Schedule (Party Mode)** — weekend-only calendar strip. Set your bake time, the app works backwards to set all fermentation windows. Supports Slow, Sourdough, Biga, and Poolish modes. Manual override exits the schedule.
- **Newtonian cooling model** — calculates temper time to pull dough balls from fridge before baking
- **Autolyse toggle** — 30-minute rest step for KitchenAid and spiral mixer workflows
- **Bake journal** — save notes from each bake, reload settings, export all entries to clipboard (iOS fallback: selectable overlay for copy to Notes)
- **Two themes** — Artisan and Professional
- **PWA** — works offline, installable on iOS via Safari share sheet

## Ingredients

Pure Neapolitan. Four ingredients only:

- Tipo 00 flour (or bread flour for Rapid/Slow)
- Water
- Sea salt — 2.8% (AVPN range: 2.5–3%)
- Yeast — fresh, active dry, or instant (all three selectable in every mode)

## Dough Balls

- Range: 220–300g in 5g steps
- Quick pills: 230g (thin) / 250g (classic, AVPN standard) / 270g (generous)
- Default: 6 balls at 250g

## Ovens

- Home steel at 550°F (standard home oven)
- Gozney Dome at 700–900°F (wood-fired / gas outdoor oven)

## Mixers

- Hand mix (default for sourdough)
- KitchenAid
- Ooni Halo Pro spiral (default for yeasted modes)

## Validation Summary

| Model | Tests | Passing | Key anchors |
|-------|-------|---------|-------------|
| Rapid | 8 | 7/8 | dough.school 4h/77°F = 1.0% ✓ |
| Slow RT | 9 | 9/9 | Naples tradition, mypizzacorner ✓ |
| Cold retard | 9 | 9/9 | Lehmann/PizzaBlab, InnoviCat ✓ |
| Biga | 4 | 4/4 | Giorilli 0.33% at 18h/64°F ✓ |
| Poolish RT | 7 | 7/8 | Median of 5 sources ✓ |
| Poolish cold | 4 | 4/4 | Weekend Bakery, Salt Butter Smoke ✓ |
| Fermentation potential | 9 | 9/9 | AVPN thresholds ✓ |

## Install on iPhone

1. Open in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Works offline after first load

## Version

Current: v1.5.6

## License

MIT

---

*Built by Omar with Claude. No frameworks, no build tools, no dependencies — just flour, water, salt, and JavaScript.*
