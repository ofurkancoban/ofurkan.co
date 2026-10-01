---
title: "ESP32 Guitar Tuner"
summary: "A guitar tuner on an ESP32-S3 with a round touch display, using AMDF pitch detection with reverse search to lock onto low strings without harmonic jumps."
year: 2026
kind: hardware
stack: ["C", "ESP-IDF", "DSP", "I2S microphone"]
repo: "https://github.com/ofurkancoban/ESP32_GuitarTuner"
order: 12
figure: series
---

Pitch detection on low strings is notoriously jumpy: the detector locks onto a harmonic instead of the fundamental. This tuner uses the **Average Magnitude Difference Function** and scans from deep to high so fundamentals win, with special handling for A2, D3, G3 and B3.

- Weighted needle physics for an analog feel.
- Dynamic smoothing that keeps tracking as the note decays.
- Runs on an ESP32-S3-Touch-LCD-1.46 with the on-board I2S microphone. Double-tap to sleep.
