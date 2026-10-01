---
title: "I regressed my own GitHub history"
description: "Why the front page of this site has a regression table, what it says about how I work, and how a 130-line OLS routine was checked against R."
date: 2026-10-01
tags: ["econometrics", "data viz", "this site"]
---

Most portfolios show a contribution graph: a grid of little green squares that says "this person commits code". I wanted mine to answer a question instead. So the empirical section of this site treats my public GitHub activity as a dataset, and the dataset as a small research project.

## The data

At build time, a script calls the GitHub GraphQL API and stores one observation per day: the date, the weekday, and the number of public contributions. That gives a daily time series covering the last year. No token ever reaches the browser; the numbers are baked into the page when it is built.

Two figures describe it. Figure 1 is the raw daily series with a 7-day moving average on top. Figure 2 is the same data as a calendar, which makes weekly rhythm visible at a glance.

## The question

What predicts a busy day? The baseline specification is the simplest one an economist would write down:

```text
contributions_t = a + sum_d b_d * 1[weekday_t = d] + e_t
```

with Monday as the omitted category. Columns 2 to 4 of Table 2 add a linear trend, month fixed effects and a lagged dependent variable. Standard errors are heteroskedasticity-robust (HC1), because daily counts with occasional large spikes are about as heteroskedastic as data gets.

## The finding

Weekend coefficients are large, negative and significant in every column. None of the weekday coefficients is statistically significant: once I am working, a Tuesday looks much like a Thursday. The lagged term picks up some persistence, which matches how projects actually go: a productive day tends to be followed by another one.

None of this is causal. Weekdays do not cause commits; deadlines, lectures and good ideas do. But as descriptive evidence it is honest, and it is reproducible: every number on the page is recomputed from the raw data on every build.

## Your turn

The last column of Table 2 is live. Tick or untick the controls and the model is re-estimated in your browser, with a 130-line OLS routine written for this page: matrix inversion by Gauss-Jordan elimination, the HC1 sandwich estimator, normal-approximation p-values. Before shipping it, I checked the full specification against `lm()` in R with a hand-built sandwich: coefficients, standard errors, the number of observations and R² all match to four decimals.

It is a toy model. But it is the kind of thing I like doing: take a familiar, slightly boring piece of data, ask a real question of it, and show the work.
