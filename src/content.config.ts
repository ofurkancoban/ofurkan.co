import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// The admin panel may save an optional field as an empty string; treat that as "not set".
const optionalUrl = z.union([z.string().url(), z.literal("")]).optional();
const optionalNumber = z.preprocess((v) => (v === "" || v === null ? undefined : v), z.coerce.number().optional());

// Research and software. Shown as numbered references with a generated figure.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.number(),
    kind: z.enum(["paper", "package", "tool", "app", "hardware"]),
    stack: z.array(z.string()),
    role: z.string().default("Solo, end to end"),
    repo: optionalUrl,
    live: optionalUrl,
    featured: z.boolean().default(false),
    order: z.number().default(99),
    // Optional override for the generated figure thumbnail.
    figure: z.enum(["scatter", "coef", "series", "hist", "map", "network", ""]).optional(),
    // Identification and estimation methods, shown on paper entries.
    methods: z.array(z.string()).default([]),
  }),
});

// Notes: the blog.
const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Appendix: hobby music. Either a local file in /public/audio or an external embed URL.
const music = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/music" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    audio: z.string().optional(),
    embed: optionalUrl,
    genre: z.string().optional(),
    bpm: optionalNumber,
    key: z.string().optional(),
    gear: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing, music };
