// Single place for identity and contact details.

export const SITE = {
  name: "Furkan Çoban",
  short: "Furkan Çoban",
  github: "ofurkancoban",
  location: "Oldenburg, Germany",
};

export const SOCIALS = [
  { label: "GitHub", handle: "@ofurkancoban", href: "https://github.com/ofurkancoban" },
  { label: "LinkedIn", handle: "in/ofurkancoban", href: "https://linkedin.com/in/ofurkancoban" },
  { label: "Kaggle", handle: "ofurkancoban", href: "https://kaggle.com/ofurkancoban" },
  { label: "X / Twitter", handle: "@ofurkancoban", href: "https://x.com/ofurkancoban" },
  { label: "Notes feed", handle: "rss.xml", href: "/rss.xml" },
];

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

export function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
