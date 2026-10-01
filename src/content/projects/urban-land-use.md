---
title: "Urban Land-Use Efficiency"
summary: "Why the official SDG 11.3.1 sprawl indicator is statistically unstable, what a log-based replacement recovers, and how per-capita designs can manufacture the drivers they claim to find. 193 countries, 1985 to 2020."
year: 2026
kind: paper
stack: ["R", "Google Earth Engine", "GHSL", "Dynamic panel GMM", "Two-way FE"]
role: "Sole author · Development Economics Seminar, Uni Oldenburg"
repo: "https://github.com/ofurkancoban/UrbanLandUseEfficiency_DevEconResearchProj"
featured: true
order: 4
figure: scatter
methods: ["Two-way FE", "Dynamic panel GMM", "Remote sensing"]
---

Cities must grow to house more people. The policy question is how much land each new resident consumes. SDG indicator 11.3.1 measures this as the ratio of land consumption to population growth (**LCRPGR**), and every country is judged by it.

## Three findings

1. **The official ratio is unstable.** When population growth is near zero the denominator explodes and flips sign, and it mixes arithmetic and log growth rates.
2. **A stable alternative works.** The log-based *Built-up per Capita Rate* (BpCR) recovers precise drivers on the same data where LCRPGR leaves every driver undetectable at 5%.
3. **Per-capita designs can fool you.** Urban density's celebrated "compact city" coefficient turns out to be an artefact of the metric's own arithmetic, not a behavioural effect.

The panel covers 193 UN member states from 1985 to 2020, built from harmonised GHSL satellite layers via Google Earth Engine, estimated with two-way fixed effects and dynamic-panel GMM, plus a heterogeneity analysis by development group and a sub-national German case study.
