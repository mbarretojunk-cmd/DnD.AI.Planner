# Evenings at Home

A personal habit tracker for the evenings after work, played as a small party RPG. Chores, cat care, cooking and reading power up a party of adventurers; skipped tasks hurt them. An AI Dungeon Master (Claude) narrates the nights and helps break big tasks into quests.

It's an installable web app (PWA), built for one person.

## What's in here

| Path | What it is |
|---|---|
| `app/` | The app itself (published to GitHub Pages) |
| `app/config.js` | Where the Supabase URL and anon key go (optional) |
| `app/store.js` | Data layer: this device only, or synced through Supabase |
| `app/dm.js` | The Dungeon Master chat and the Settings screen |
| `supabase/schema.sql` | One-time database setup with row-level security |
| `.github/workflows/pages.yml` | Publishes `app/` to GitHub Pages on every push |

## Setup

1. **Turn on GitHub Pages.** Repository → Settings → Pages → Source: **GitHub Actions**. The next push publishes the app at `https://<username>.github.io/<repository>/`.
2. **Install it on Android.** Open that address in Chrome → ⋮ → **Install app**.
3. **Sync (optional).** Create a free Supabase project, run `supabase/schema.sql` in the SQL Editor, then put the Project URL and the anon public key in `app/config.js`. Never put the service_role key anywhere in this repository. In Supabase → Authentication → URL Configuration, set the Site URL to the GitHub Pages address.
4. **Dungeon Master (optional).** Create an API key at console.anthropic.com, add a little credit and set a monthly spend limit. Paste the key in the app's Settings (the gear icon). It is stored only on that device and is never saved to the database or this repository.
5. **Move existing progress.** Settings → Import a backup, and pick the backup JSON file.

## Privacy

This repository is public, so it only ever contains the app's code. Personal data lives in your Supabase project (protected by row-level security) or on your device. Backup files are ignored by git.
