# ofurkan.co

Personal site of Ömer Furkan Çoban, typeset as an economics working paper. Static site built with [Astro](https://astro.build), served by nginx from the VPS.

## Commands

| Command          | What it does                                               |
| ---------------- | ---------------------------------------------------------- |
| `npm run dev`    | Local dev server at http://localhost:4321                  |
| `npm run github` | Refresh `src/data/github.json` from the GitHub GraphQL API |
| `npm run build`  | Build the static site into `dist/`                         |
| `npm run deploy` | Trigger the deploy workflow on GitHub and follow it        |

The GitHub token is taken from `GITHUB_TOKEN` or `gh auth token` and is only used at build time.

## Admin panel and deploys

- **Admin panel:** https://ofurkan.co/admin (Sveltia CMS). Sign in with a fine-grained GitHub token that has *Contents: read and write* on this repository only. Saving in the panel commits to `main`.
- **Deploys:** every push to `main` (including panel edits) runs `.github/workflows/deploy.yml`: refresh GitHub data, build, rsync to the VPS. It also runs every 15 minutes: it fetches the contribution data, compares its hash (`/data-version.txt`) with the live site, and rebuilds only when it changed, so the figures and the regression table follow new commits in any repository.
- **Server access:** the workflow logs in as the `deploy` user, whose key is locked by `rrsync` to `/var/www/ofurkan.co`. Secrets: `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`, `DEPLOY_HOST`, optional `STATS_TOKEN`.

## Adding content

All content is Markdown with frontmatter. The schema lives in `src/content.config.ts`.

- **Project**: `src/content/projects/<slug>.md`. Fields: `title`, `summary`, `year`, `kind` (`paper`, `package`, `tool`, `app`, `hardware`), `stack`, optional `role`, `repo`, `live`, `featured`, `order`, `figure`, `methods`.
- **Note (blog post)**: `src/content/writing/<slug>.md`. Fields: `title`, `description`, `date`, `tags`, `draft`.
- **Music (Appendix A)**: put the file in `public/audio/` and create `src/content/music/<slug>.md` with `title`, `date`, `audio: "/audio/<file>.mp3"` (or `embed:` for SoundCloud/YouTube), optional `genre`, `bpm`, `key`, `gear`. The appendix only appears on the home page once at least one non-draft track exists.
- **About / CV**: edit `src/data/cv.json` (or "About & CV" in the admin panel). Uploading a CV PDF there adds a download button.

Entries with `draft: true` are shown in `npm run dev` only. Files in `public/` starting with `_test` are never deployed.

## Structure

- `src/components/Evidence.astro`: §3, the GitHub tracker written up as an empirical section (figures, summary table, live regression table).
- `src/lib/ols.ts`: OLS with HC1 robust standard errors, used at build time and in the browser.
- `src/lib/thumb.ts`: deterministic figure thumbnails generated from each project's slug.
- `scripts/fetch-github.mjs`: GitHub data fetch, streaks and language counts.
- `scripts/deploy.sh`: trigger the deploy workflow.
- `public/admin/`: admin panel page and its `config.yml`.
