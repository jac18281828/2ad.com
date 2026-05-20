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
- No `git push origin main` (no direct main branch commits)
- No `git reset --hard`
- No `git clean -f`
- No `git submodule` commands

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

All changes reach production via merged PR. No direct commits to `main`.

1. `git checkout -b <scope>/<short-description>` — e.g. `kelly/spring-post`, `john/update-about`
2. Make changes in the appropriate content directories
3. `make html` inside the relevant site directory to verify the build succeeds
4. `git add <specific files>` — never `git add .` or `git add -A`
5. `git commit -m "<type>(<site>): <description>"` — e.g. `content(kellycairns): add spring 2025 post`
6. `git push origin <branch>`
7. `gh pr create --draft --title "..." --body "..."`
8. Stop — a human reviews and merges.

Production deploys only after a human merges the PR and pushes a release tag.
