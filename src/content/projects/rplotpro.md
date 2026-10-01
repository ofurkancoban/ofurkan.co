---
title: "R Plot Pro"
summary: "A VS Code extension that brings an RStudio-style plots pane to R and Julia: automatic capture, no focus-stealing windows."
year: 2026
kind: tool
stack: ["TypeScript", "VS Code API", "R", "Julia"]
repo: "https://github.com/ofurkancoban/RPlotPro"
featured: true
order: 6
figure: hist
---

Switching between VS Code and floating Quartz or X11 windows just to look at a plot breaks flow. R Plot Pro puts a familiar **plots pane in the sidebar** and captures every plot automatically.

- Works with **base R and ggplot2**, and with **CairoMakie and Plots.jl** in Julia.
- **Invisible background rendering**: no focus-stealing external windows.
- Attaches automatically to any terminal running an R session.
- Leaves R and Julia startup banners untouched.
