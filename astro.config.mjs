import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ofurkan.co",
  trailingSlash: "ignore",
  build: { format: "directory" },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: "css-variables", wrap: true },
  },
});
