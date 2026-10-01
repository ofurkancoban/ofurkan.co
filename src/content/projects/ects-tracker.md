---
title: "AEDS Credit Tracker"
summary: "A single-file ECTS, GPA and graduation planner for my master's programme. No backend, no account, all data stays in the browser."
year: 2026
kind: app
stack: ["HTML", "JavaScript", "GitHub Actions"]
repo: "https://github.com/ofurkancoban/AEDS_ECTS_Tracker"
order: 11
figure: hist
---

Tracking credits across five categories, German grading rules and semester planning in a spreadsheet gets messy fast.

- Autocomplete from the official module catalogue, synced daily from Stud.IP.
- German grade scale, per-category GPA, a "what-if" mode for hypothetical grades.
- A **graduation path simulation** that schedules remaining requirements by when courses are actually offered.
- **Crowd-sourced course difficulty ratings** via a serverless pipeline: a GitHub Actions workflow appends each vote and republishes the aggregate.
- QR-code sharing between devices, built without any QR library.
