// A tiny OLS estimator with HC1 heteroskedasticity-robust standard errors.
// Used at build time for the static regression table and in the browser for the
// interactive specification builder. No dependencies.

export type Day = { date: string; count: number; weekday: number };

export type Spec = { weekdays: boolean; trend: boolean; monthFE: boolean; lag: boolean };

export type Coef = { name: string; b: number; se: number; p: number };

export type Fit = {
  coefs: Coef[];
  n: number;
  r2: number;
  spec: Spec;
};

export const WEEKDAY_ROWS = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// JS weekday index for each displayed dummy (Monday is the omitted category).
const WEEKDAY_IDX = [2, 3, 4, 5, 6, 0];

function invert(m: number[][]): number[][] | null {
  const n = m.length;
  const a = m.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(a[r][c]) > Math.abs(a[piv][c])) piv = r;
    if (Math.abs(a[piv][c]) < 1e-10) return null;
    [a[c], a[piv]] = [a[piv], a[c]];
    const d = a[c][c];
    for (let j = 0; j < 2 * n; j++) a[c][j] /= d;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = a[r][c];
      if (f === 0) continue;
      for (let j = 0; j < 2 * n; j++) a[r][j] -= f * a[c][j];
    }
  }
  return a.map((row) => row.slice(n));
}

// Two-sided p-value from a z statistic (Abramowitz-Stegun normal CDF).
function pValue(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const tail = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return 2 * tail;
}

export function stars(p: number) {
  return p < 0.01 ? "***" : p < 0.05 ? "**" : p < 0.1 ? "*" : "";
}

export function fit(days: Day[], spec: Spec): Fit {
  const months = [...new Set(days.map((d) => d.date.slice(0, 7)))];
  const names: string[] = ["Constant"];
  if (spec.weekdays) names.push(...WEEKDAY_ROWS);
  if (spec.trend) names.push("Trend (per 100 days)");
  if (spec.lag) names.push("Contributions, t-1");

  const X: number[][] = [];
  const y: number[] = [];
  days.forEach((d, i) => {
    if (spec.lag && i === 0) return;
    const row = [1];
    if (spec.weekdays) WEEKDAY_IDX.forEach((w) => row.push(d.weekday === w ? 1 : 0));
    if (spec.trend) row.push(i / 100);
    if (spec.lag) row.push(days[i - 1].count);
    if (spec.monthFE) {
      const m = months.indexOf(d.date.slice(0, 7));
      for (let k = 1; k < months.length; k++) row.push(m === k ? 1 : 0);
    }
    X.push(row);
    y.push(d.count);
  });

  const n = X.length;
  const k = X[0].length;
  const XtX = Array.from({ length: k }, (_, a) =>
    Array.from({ length: k }, (_, b) => {
      let s = 0;
      for (let i = 0; i < n; i++) s += X[i][a] * X[i][b];
      return s;
    })
  );
  const inv = invert(XtX);
  if (!inv) throw new Error("Design matrix is singular");
  const Xty = Array.from({ length: k }, (_, a) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += X[i][a] * y[i];
    return s;
  });
  const beta = inv.map((row) => row.reduce((s, v, j) => s + v * Xty[j], 0));

  const e = y.map((yi, i) => yi - X[i].reduce((s, v, j) => s + v * beta[j], 0));
  const ybar = y.reduce((s, v) => s + v, 0) / n;
  const sst = y.reduce((s, v) => s + (v - ybar) ** 2, 0);
  const sse = e.reduce((s, v) => s + v * v, 0);

  // HC1 sandwich: (X'X)^-1 X' diag(e^2) X (X'X)^-1 * n / (n - k)
  const meat = Array.from({ length: k }, (_, a) =>
    Array.from({ length: k }, (_, b) => {
      let s = 0;
      for (let i = 0; i < n; i++) s += X[i][a] * X[i][b] * e[i] * e[i];
      return s;
    })
  );
  const tmp = inv.map((row) => Array.from({ length: k }, (_, b) => row.reduce((s, v, j) => s + v * meat[j][b], 0)));
  const V = tmp.map((row) => Array.from({ length: k }, (_, b) => row.reduce((s, v, j) => s + v * inv[j][b], 0)));
  const adj = n / (n - k);

  const coefs: Coef[] = names.map((name, j) => {
    const se = Math.sqrt(Math.max(0, V[j][j] * adj));
    return { name, b: beta[j], se, p: se > 0 ? pValue(beta[j] / se) : 1 };
  });

  return { coefs, n, r2: sst > 0 ? 1 - sse / sst : 0, spec };
}

export function summary(values: number[]) {
  const n = values.length;
  const s = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
  const q = (p: number) => s[Math.min(n - 1, Math.floor(p * (n - 1)))];
  return { n, mean, sd, min: s[0], p50: q(0.5), p90: q(0.9), max: s[n - 1], zero: values.filter((v) => v === 0).length / n };
}
