---
title: "Discogs Data Machine"
summary: "A family of tools that turns the monthly Discogs music database dumps (tens of GB of XML) into clean CSVs and publishes them to Kaggle, fully automated."
year: 2026
kind: tool
stack: ["Python", "Swift", "Kaggle API", "Streaming XML", "Homebrew"]
repo: "https://github.com/ofurkancoban/Discogs_Kaggle_Sync"
live: "https://www.kaggle.com/ofurkancoban"
featured: true
order: 8
figure: hist
---

Where music and data meet. Discogs publishes its entire catalogue every month as gzipped XML; the `releases` dump alone is around 10 GB compressed. I wanted it as tidy CSVs, so I built the tools, then automated the whole thing.

## The family

- **DiscogsGUI**: a desktop app with multi-threaded downloads, smart extraction, XML to CSV conversion and a cover-art generator. A native Swift/SwiftUI rewrite is in progress.
- **DiscogsCLI** and a **Homebrew tap** for the terminal crowd.
- **Discogs Kaggle Sync**: the monthly robot.

## The robot

Every month it checks for a new dump, downloads with resume-on-reconnect, converts **straight off the gzip stream** (deleting each archive as soon as its CSV exists to keep peak disk usage low), generates a cover image, publishes a new Kaggle dataset with column descriptions, fills in the metadata Kaggle's public API silently drops, and publishes a starter notebook. It only cleans up once the dataset's usability score is a perfect 1.0.
