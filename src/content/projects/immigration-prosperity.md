---
title: "Immigration, Crime and Prosperity"
summary: "A 400-district, 19-year panel of Germany: prosperity follows the quality of labour-market integration, not the quantity of migrants."
year: 2026
kind: paper
stack: ["R", "TWFE", "renv", "Make", "INKAR", "PKS"]
role: "Applied Economics research project, Uni Oldenburg"
repo: "https://github.com/ofurkancoban/ImmigrationCrimeGermany_AppliedEconResearchProj"
featured: false
order: 5
figure: coef
methods: ["Two-way FE", "Constructed indices", "District panel"]
---

A balanced panel of **400 German districts (NUTS-3), 2003 to 2021**, 7,200 observations, combining BBSR INKAR indicators, police crime statistics (PKS) and disaggregated state capital stocks.

## Constructed metrics

- **Labour Integration Efficacy (LIE)**: how efficiently a district absorbs its foreign-born population into the active labour market.
- **Foreign Labour Supply Pressure (FLSP)**: the concentration of foreign labour reserves relative to the regional labour force.

## Findings (two-way fixed effects)

- **The integration dividend.** A 1% increase in lagged LIE raises GDP per capita by about 0.028%.
- **Quantity versus quality.** A higher foreign-born share without integration has a slightly negative effect (β = -0.005).
- **Property damage as a density proxy** correlates positively with prosperity, capturing urban vibrancy rather than decline.
- **Regional heterogeneity.** The integration gains concentrate in mature, high-capital Western districts.

The whole study runs end to end with `make all`: a 32-stage pipeline under `renv`. The [inkaR](/work/inkar) package was born here.
