# Agent Policy

This file governs how AI agents should operate in this repository. Read it fully before making any changes.

---

## Site Structure

This is a multi-site static site repository. Each site has the same layout:

```
<site>/
  content/
    posts/<year>/     ← dated Markdown articles
    pages/            ← static pages
    images/           ← images referenced by articles
    static/           ← favicons, robots.txt, site-level static files
  pelicanconf.py      ← site configuration
  publishconf.py      ← publish overrides
  tasks.py            ← task runner config
  Makefile            ← build targets
```

---

## What Is Safe to Edit

**Content files** in `*/content/` are always safe to create, edit, or delete:
- Markdown articles and pages (`.md`)
- Images in `content/images/`
- Static assets in `content/static/`

Pelican article frontmatter format:

```markdown
Title: My Article Title
Date: 2025-01-15
Category: General
Tags: tag1, tag2
Slug: my-article-title

Article body starts here.
```

---

## What Requires Owner Approval

These files affect site behavior for all visitors and should only be changed with explicit instruction:

- `*/pelicanconf.py` — site config (plugins, theme, paths, metadata)
- `*/publishconf.py` — publish-time overrides
- `*/tasks.py`, `*/Makefile` — build configuration
- `CLAUDE.md`, `AGENTS.md`, `kellycairns/CLAUDE.md` — agent policy files

If a task seems to require changing these, stop and describe what's needed in a PR comment or message to the repo owner.

---

## What Is Off-Limits

Never modify build tooling, deployment infrastructure, or dependency files. This includes:

- `cdk/` — infrastructure as code
- `scripts/` — build and deploy automation
- `.github/` — CI/CD workflows
- `Dockerfile`
- `package.json`, `requirements.txt`
- `tsconfig.json`, `eslint.config.mjs`, `jest.config.js`, `commitlint.config.js`
- `cdk.json`, `cdk.context.json`
- `pelican-plugins/` — external submodule
- `themes/` — external submodule
- `node_modules/`, `dist/`, `cdk.out/`, `output/` — generated/managed directories

Never run deployment or infrastructure commands:
- No `cdk deploy` or related infrastructure commands
- No `aws` CLI commands
- No package manager installs (`pip install`, `npm install`, `bun install`, etc.)

Never take destructive git actions:
- No `git push --force` or `git push -f`
- No `git reset --hard`
- No `git clean -f`
- No `git submodule` commands

Merging or pushing to `main`, and pushing release tags, always requires an
explicit approval in chat first — never a standing/blanket permission (see
**PR Workflow** and **Release Authorization**). Once John gives that
approval, John's agent executes it immediately, itself: no re-confirming,
no declining, no handing off the command instead of running it. Kelly's
agent may never push to `main` under any circumstance.

---

## Agent Scopes

### John's Agent

Full site-management permissions.

**May freely:**
- Create, edit, and delete content in `*/content/` across all five sites
- Edit per-site configs (`*/pelicanconf.py`, `*/publishconf.py`, `*/tasks.py`, `*/Makefile`) when explicitly instructed
- Edit `CLAUDE.md`, `AGENTS.md`, `kellycairns/CLAUDE.md`
- Edit `README.md`, `CHANGELOG.md`
- Run local site builds (`make html`) inside any site directory
- Commit content changes to a feature branch and open a PR
- Land a reviewed PR to `main` via fast-forward merge after asking once in
  chat and getting a yes, and (once the release-branch skill is explicitly
  invoked) push the release tag — see **PR Workflow** and **Release
  Authorization**

**Needs explicit instruction before:**
- Adding or removing Pelican plugins
- Changing theme, output paths, or site-wide metadata
- Creating new site directories

### Kelly's Agent

Scope is restricted to `kellycairns/` content only. See `kellycairns/CLAUDE.md` for the full scope definition.

**May freely:**
- Create, edit, and delete files in `kellycairns/content/`
- Run `make html` inside `kellycairns/` to preview locally
- Commit changes to a feature branch and open a draft PR

**Must not:**
- Touch any file outside `kellycairns/content/`
- Edit any other site
- Edit `pelicanconf.py` or any config file

---

## PR Workflow

All changes reach production via a reviewed PR — never an unreviewed commit straight to `main`. John's agent may land a PR itself once John says so in chat (see step 9); it never skips review to commit directly.

**This repo enforces linear history — rebase and merge only, no merge commits.**

1. `git checkout -b <scope>/<short-description>` — e.g. `kelly/spring-post`, `john/update-about`
2. Make changes in the appropriate content directories
3. `make html` inside the relevant site directory to verify the build succeeds
4. `git add <specific files>` — never `git add .` or `git add -A`
5. `git commit -m "<type>(<site>): <description>"` — e.g. `content(kellycairns): add spring 2025 post`
6. `git push origin <branch>`
7. `gh pr create --draft --title "..." --body "..."`
8. If `main` has moved since the branch was created, rebase before merge:
   - `git fetch origin && git rebase origin/main`
   - Resolve any conflicts, then `git push --force-with-lease origin <branch>`
   - Never `git merge main` into a feature branch — that creates a merge commit.
9. A human reviews the PR. To land it, John's agent asks once in chat —
   e.g. "Ready to land `<branch>` to `main` via fast-forward merge —
   proceed?" On an explicit yes, it lands immediately, itself: fetch
   origin, rebase the branch onto current main if needed, fast-forward
   merge locally, and `git push origin main` directly — no `--force`, no
   merge commits, no asking again, no declining, no handing off the
   command instead of running it.

Production deploys after the PR is approved and landed on `main`, and
(for a release) a release tag is pushed.


## Release Authorization

Approving, merging, or commenting positively on a commit or PR does NOT
authorize a release. That happens through normal review — it has no
side effects on tagging or deploys.

A release begins only when the owner explicitly invokes the
release-branch skill (e.g. "use the release-branch skill," "deploy
this," "cut a release"). Once invoked, John's agent runs every step of
that skill, including pushing to `main` and pushing the release tag —
it does not re-confirm, decline the task outright, or hand off the
final commands instead of running them. It still stops for anything the
skill itself flags as needing owner input (e.g. an ambiguous version
bump, or a conflict it can't resolve).

This satisfies the operator's global "merge only on human approval" rule:
the explicit skill invocation *is* that approval, covering every step the
skill performs. It doesn't change how other projects (e.g. fabric/booda)
require confirmation — see their own AGENTS.md.
