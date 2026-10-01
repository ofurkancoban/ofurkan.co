---
title: "Regional Favoritism, Rebuilt"
summary: "A from-scratch replication of Hodler & Raschky (2014, QJE): do regions glow brighter at night while their native son holds power? Extended with a harmonised DMSP/VIIRS panel through 2023."
year: 2026
kind: paper
stack: ["R", "GIS", "Nighttime lights", "Panel econometrics", "Quarto", "Make"]
role: "Sole author · Applied Econometrics Using GIS Techniques, Uni Oldenburg"
repo: "https://github.com/ofurkancoban/Regional_Favoritism_Replication"
featured: true
order: 1
figure: coef
methods: ["Replication", "Panel fixed effects", "Nighttime lights", "GIS"]
---

Hodler and Raschky found that a region grows brighter at night while it is the birth region of the sitting political leader: a clean, satellite-measured fingerprint of regional favoritism. I rebuilt that result on an **independently constructed pipeline** rather than the authors' files.

## What is different

- **Boundaries** from GADM instead of the original CIESIN source.
- **Leader birthplaces** from PLAD, supplemented with Wikidata.
- **DMSP-OLS composites** extracted locally from the raw rasters.
- An **extension to 2023** on a harmonised DMSP/VIIRS nighttime-lights panel, past the point where the original sensor series ends.

## How it is built

The package reproduces every table in the paper and its supplementary materials, from raw data to the final PDF and slide deck, through a **41-stage numbered pipeline** orchestrated with `make`. The core analysis replicates HR 2014 Table II and all seven columns of Table IV, plus a 1992 to 2023 extension table. A supplementary phase covers the dynamics, determinants, continent and aid/oil tables.

The paper, supplement and presentation are rendered with Quarto and published as a website from the same repository.
