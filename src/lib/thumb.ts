// Generative figure thumbnails. Every project gets a deterministic little chart,
// derived from its slug, drawn in the site's ink and accent colours via CSS classes
// (see .thumb rules in global.css), so the thumbnails follow light and dark mode.

export type ThumbStyle = "scatter" | "coef" | "series" | "hist" | "map" | "network";

const STYLES: ThumbStyle[] = ["scatter", "coef", "series", "hist", "map", "network"];

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

// Approximate standard normal draw (sum of uniforms).
const normal = (r: () => number) => r() + r() + r() + r() - 2;

const W = 320;
const H = 220;
const P = { l: 34, r: 12, t: 14, b: 28 };
const X = (v: number) => P.l + v * (W - P.l - P.r);
const Y = (v: number) => H - P.b - v * (H - P.t - P.b);
const f = (n: number) => n.toFixed(1);

function axes(xTicks = 5, yTicks = 4, zeroLine?: number) {
  let s = `<line class="k" x1="${P.l}" y1="${H - P.b}" x2="${W - P.r}" y2="${H - P.b}"/>`;
  s += `<line class="k" x1="${P.l}" y1="${P.t}" x2="${P.l}" y2="${H - P.b}"/>`;
  for (let i = 0; xTicks > 0 && i <= xTicks; i++) {
    const x = X(i / xTicks);
    s += `<line class="k" x1="${f(x)}" y1="${H - P.b}" x2="${f(x)}" y2="${H - P.b + 4}"/>`;
  }
  for (let i = 0; i <= yTicks; i++) {
    const y = Y(i / yTicks);
    s += `<line class="k" x1="${P.l - 4}" y1="${f(y)}" x2="${P.l}" y2="${f(y)}"/>`;
  }
  if (zeroLine !== undefined) s += `<line class="m dash" x1="${P.l}" y1="${f(Y(zeroLine))}" x2="${W - P.r}" y2="${f(Y(zeroLine))}"/>`;
  return s;
}

export function thumbSvg(slug: string, title: string, label: string, style?: ThumbStyle | ""): string {
  const seed = hash(slug);
  const r = rng(seed);
  const kind = style || STYLES[seed % STYLES.length];
  let art = "";

  switch (kind) {
    case "scatter": {
      const b = 0.35 + r() * 0.4;
      const a = 0.15 + r() * 0.2;
      // Confidence band, then points, then the fitted line.
      let up = "";
      let lo = "";
      for (let i = 0; i <= 20; i++) {
        const x = i / 20;
        const w = 0.04 + Math.pow(x - 0.5, 2) * 0.3;
        up += `${f(X(x))},${f(Y(a + b * x + w))} `;
        lo = `${f(X(x))},${f(Y(a + b * x - w))} ` + lo;
      }
      art += `<polygon class="band" points="${up}${lo}"/>`;
      for (let i = 0; i < 70; i++) {
        const x = r();
        const y = Math.min(0.98, Math.max(0.02, a + b * x + normal(r) * 0.09));
        art += `<circle class="kf o6" cx="${f(X(x))}" cy="${f(Y(y))}" r="2.2"/>`;
      }
      art += `<line class="a w2" x1="${X(0)}" y1="${f(Y(a))}" x2="${X(1)}" y2="${f(Y(a + b))}"/>`;
      art += axes();
      break;
    }
    case "coef": {
      // Event-study style coefficient plot with 95% intervals.
      const n = 9;
      const ev = 3 + Math.floor(r() * 2);
      const jump = 0.18 + r() * 0.18;
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) / n;
        const est = 0.42 + (i > ev ? jump + (i - ev) * 0.015 : normal(r) * 0.03);
        const ci = 0.06 + r() * 0.06;
        const cls = i > ev ? "a" : "k";
        art += `<line class="${cls} w15" x1="${f(X(x))}" y1="${f(Y(est - ci))}" x2="${f(X(x))}" y2="${f(Y(est + ci))}"/>`;
        art += `<circle class="${cls}f" cx="${f(X(x))}" cy="${f(Y(est))}" r="3.4"/>`;
      }
      const evx = X((ev + 1) / n);
      art += `<line class="m dash" x1="${f(evx)}" y1="${P.t}" x2="${f(evx)}" y2="${H - P.b}"/>`;
      art += axes(0, 4, 0.42);
      break;
    }
    case "series": {
      let d = "";
      let d2 = "";
      let v = 0.35 + r() * 0.2;
      let ma = v;
      const pts = 80;
      const brk = 0.45 + r() * 0.25;
      for (let i = 0; i < pts; i++) {
        const x = i / (pts - 1);
        v += normal(r) * 0.05 + (x > brk ? 0.006 : -0.001) + Math.sin(i / 3) * 0.01;
        v = Math.min(0.95, Math.max(0.05, v));
        ma = ma * 0.85 + v * 0.15;
        d += `${i ? "L" : "M"}${f(X(x))} ${f(Y(v))}`;
        d2 += `${i ? "L" : "M"}${f(X(x))} ${f(Y(ma))}`;
      }
      art += `<rect class="bandf" x="${f(X(brk))}" y="${P.t}" width="${f(X(1) - X(brk))}" height="${H - P.t - P.b}"/>`;
      art += `<path class="m" d="${d}"/>`;
      art += `<path class="a w2" d="${d2}"/>`;
      art += axes();
      break;
    }
    case "hist": {
      const bins = 22;
      const mu = 0.35 + r() * 0.3;
      const sd = 0.12 + r() * 0.08;
      const bw = (W - P.l - P.r) / bins;
      let curve = "";
      for (let i = 0; i < bins; i++) {
        const x = (i + 0.5) / bins;
        const dens = Math.exp(-Math.pow((x - mu) / sd, 2) / 2);
        const h = Math.max(0.02, dens * (0.75 + r() * 0.25) * 0.9);
        art += `<rect class="kf o8" x="${f(P.l + i * bw + 1)}" y="${f(Y(h))}" width="${f(bw - 2)}" height="${f(Y(0) - Y(h))}"/>`;
      }
      for (let i = 0; i <= 60; i++) {
        const x = i / 60;
        curve += `${i ? "L" : "M"}${f(X(x))} ${f(Y(Math.exp(-Math.pow((x - mu) / sd, 2) / 2) * 0.9))}`;
      }
      art += `<path class="a w2" d="${curve}"/>`;
      art += `<line class="a dash" x1="${f(X(mu))}" y1="${P.t}" x2="${f(X(mu))}" y2="${H - P.b}"/>`;
      art += axes();
      break;
    }
    case "map": {
      // Dot-density "choropleth": a blob of districts with a hot core.
      const cx = 0.35 + r() * 0.3;
      const cy = 0.4 + r() * 0.2;
      const cols = 26;
      const rows = 17;
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const x = (i + (j % 2) * 0.5) / cols;
          const y = j / rows;
          const shape = Math.pow((x - 0.5) / 0.48, 2) + Math.pow((y - 0.5) / 0.52, 2) + normal(r) * 0.12;
          if (shape > 1) continue;
          const heat = Math.exp(-(Math.pow(x - cx, 2) + Math.pow(y - cy, 2)) / 0.03) + r() * 0.15;
          const cls = heat > 0.75 ? "af" : heat > 0.4 ? "af o5" : heat > 0.2 ? "kf o5" : "kf o2";
          art += `<circle class="${cls}" cx="${f(12 + x * (W - 24))}" cy="${f(12 + y * (H - 24))}" r="4.4"/>`;
        }
      break;
    }
    case "network": {
      const n = 16;
      const nodes = Array.from({ length: n }, () => ({ x: 0.08 + r() * 0.84, y: 0.1 + r() * 0.8 }));
      const hub = Math.floor(r() * n);
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 0.28 || i === hub || j === hub) {
            const cls = i === hub || j === hub ? "a o6" : "m";
            art += `<line class="${cls}" x1="${f(a.x * W)}" y1="${f(a.y * H)}" x2="${f(b.x * W)}" y2="${f(b.y * H)}"/>`;
          }
        });
      });
      nodes.forEach((p, i) => {
        art += `<circle class="${i === hub ? "af" : "pf"}" cx="${f(p.x * W)}" cy="${f(p.y * H)}" r="${i === hub ? 7 : 4}"/>`;
      });
      break;
    }
  }

  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}: illustrative figure for ${esc(title)}">${art}</svg>`;
}
