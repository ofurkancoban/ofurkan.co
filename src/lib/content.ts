import { getCollection } from "astro:content";

const showDrafts = import.meta.env.DEV;

export const kindLabel: Record<string, string> = {
  paper: "Paper",
  package: "R package",
  tool: "Tool",
  app: "Web app",
  hardware: "Hardware",
};

export async function getProjects() {
  const all = await getCollection("projects");
  return all
    .sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year)
    .map((p, i) => ({ ...p, ref: i + 1 }));
}

export async function getNotes() {
  const all = await getCollection("writing", ({ data }) => showDrafts || !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getMusic() {
  const all = await getCollection("music", ({ data }) => showDrafts || !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
