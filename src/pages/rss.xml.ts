import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getNotes } from "../lib/content";

export async function GET(context: APIContext) {
  const posts = await getNotes();
  return rss({
    title: "Notes · Furkan Çoban",
    description: "Notes on econometrics, data and the tools in between.",
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/notes/${p.id}/`,
    })),
  });
}
