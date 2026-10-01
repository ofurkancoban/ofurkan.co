---
title: "German Power Price Forecasting"
summary: "Forecasting hourly day-ahead electricity prices in Germany (2020 to 2026) around the merit-order effect, from automated ETL to ARIMAX vs Ridge vs XGBoost."
year: 2026
kind: paper
stack: ["Python", "XGBoost", "statsmodels", "scikit-learn", "SMARD API", "Open-Meteo"]
role: "Data Science 1, Uni Oldenburg (WiSe 2025/26)"
repo: "https://github.com/ofurkancoban/DS_EnergyPricePrediction"
featured: true
order: 7
figure: series
methods: ["ARIMAX", "Ridge", "XGBoost", "Time-series features"]
---

When wind and solar are abundant, they displace expensive gas and coal at the margin and the price falls: the **merit-order effect**. The model is built around that mechanism.

## Pipeline

- **ETL** from SMARD (prices, load, generation by fuel), Open-Meteo (hourly weather) and Yahoo Finance (TTF gas, EUA carbon, Rotterdam coal).
- **Weather clusters**: five strategic locations (Hamburg, Helgoland, Munich, Berlin, Cologne) as proxies for national generation and demand.
- **Features**: 24 h and 168 h lags for daily and weekly cycles, net load.

## Models

A Ridge baseline for fundamental trends, **ARIMAX(2,0,1)** with net load and wind as exogenous regressors, and **XGBoost** to capture the step-function shape of the merit-order curve.
