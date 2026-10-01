// Fetches the GitHub contribution calendar, streaks and language mix at build time
// and writes them to src/data/github.json. The token never reaches the browser.
//
// Token resolution order: GITHUB_TOKEN env var, then `gh auth token`.
// If no token is available the existing JSON is kept untouched.

import { execSync } from "node:child_process";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USER = "ofurkancoban";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = resolve(root, "src/data/github.json");

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execSync("gh auth token", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return null;
  }
}

const query = `
query($login: String!) {
  user(login: $login) {
    createdAt
    followers { totalCount }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        stargazerCount
        pushedAt
        languages(first: 8, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoryContributions
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount weekday } }
      }
    }
  }
}`;

function streaks(days) {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Current streak: today may still be empty, so start from yesterday in that case.
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  let current = 0;
  while (i >= 0 && days[i].count > 0) {
    current++;
    i--;
  }
  return { longest, current };
}

async function main() {
  const token = getToken();
  if (!token) {
    console.warn("[github] no token found, keeping existing data");
    return;
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    console.warn("[github] request failed, keeping existing data", json.errors ?? res.status);
    return;
  }

  const u = json.data.user;
  const cc = u.contributionsCollection;
  const weeks = cc.contributionCalendar.weeks.map((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, weekday: d.weekday }))
  );
  const days = weeks.flat();

  // Language mix by repo count: rendered Quarto/HTML output inflates byte counts,
  // so markup languages are skipped and each repo counts once per language it uses.
  const IGNORED = new Set(["HTML", "CSS", "SCSS", "TeX", "Makefile", "Dockerfile", "Shell", "Batchfile", "PowerShell", "BibTeX Style"]);
  const langs = new Map();
  for (const repo of u.repositories.nodes) {
    for (const e of repo.languages.edges.slice(0, 4)) {
      if (IGNORED.has(e.node.name)) continue;
      const cur = langs.get(e.node.name) ?? { name: e.node.name, color: e.node.color, repos: 0 };
      cur.repos += 1;
      langs.set(e.node.name, cur);
    }
  }
  const sorted = [...langs.values()].sort((a, b) => b.repos - a.repos).slice(0, 8);
  const maxRepos = sorted[0]?.repos ?? 1;
  const languages = sorted.map((l) => ({ ...l, share: l.repos / maxRepos }));

  const busiest = days.reduce((m, d) => (d.count > m.count ? d : m), days[0]);
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
  for (const d of days) weekdayTotals[d.weekday] += d.count;

  const data = {
    user: USER,
    fetchedAt: new Date().toISOString(),
    total: cc.contributionCalendar.totalContributions,
    commits: cc.totalCommitContributions,
    pullRequests: cc.totalPullRequestContributions,
    issues: cc.totalIssueContributions,
    reposCreated: cc.totalRepositoryContributions,
    publicRepos: u.repositories.totalCount,
    stars: u.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0),
    followers: u.followers.totalCount,
    activeDays: days.filter((d) => d.count > 0).length,
    busiest,
    weekdayTotals,
    ...streaks(days),
    languages,
    weeks,
  };

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(data));
  console.log(`[github] ${data.total} contributions, streak ${data.current}/${data.longest}, ${languages.length} languages`);
}

main().catch((err) => {
  console.warn("[github] failed, keeping existing data:", err.message);
  if (!existsSync(outFile)) process.exitCode = 1;
});
