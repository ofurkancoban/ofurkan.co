---
title: "inkaR"
summary: "An R package on CRAN that turns the BBSR INKAR regional statistics API into tidy data frames and publication-ready maps of Germany."
year: 2026
kind: package
stack: ["R", "CRAN", "sf", "ggplot2", "REST API"]
role: "Author and maintainer"
repo: "https://github.com/ofurkancoban/inkaR"
live: "https://cran.r-project.org/package=inkaR"
featured: true
order: 2
figure: map
---

INKAR (*Indikatoren und Karten zur Raum- und Stadtentwicklung*) is the German Federal Office for Building and Regional Planning's database of regional development indicators. It is a goldmine for regional economics, and a pain to pull from programmatically.

`inkaR` wraps its JSON API into clean analytical data frames. I wrote it while working on a district-level panel study, then polished it for CRAN.

## Highlights

- **Interactive wizard**: call `inkaR()` with no arguments for a guided terminal session.
- **Multi-indicator downloads** with automatic vertical or horizontal joins.
- **Bilingual fuzzy search** across German and English indicator names.
- **Persistent caching** and parallel API discovery.
- **`theme_inkaR`** ggplot2 themes for publication-ready maps.

```r
install.packages("inkaR")
```

Documentation lives at [ofurkancoban.github.io/inkaR](https://ofurkancoban.github.io/inkaR/).
