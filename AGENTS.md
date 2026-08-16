# Agent Policy

Five family static sites plus the AWS infrastructure that serves them. This
file is a guide to how we work, not a permission system. Git tracks every
change, so most mistakes cost a revert, not a disaster — the few things
below don't revert cleanly, and that's the actual dividing line, not
"content vs. code."

---

## Site Structure

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

Sites: `2ad/` (2ad.com, John) · `kellycairns/` (kellycairns.com, Kelly) ·
`archiecairns/`, `emmycairns/`, `minacairns/` (children's sites).

Infrastructure lives in `cdk/` (AWS CDK, TypeScript) — DNS, hosting, and
CI/CD for all five sites.

---

## Workflow

1. **Just do it** — content in `*/content/` for any site, `README.md`,
   `CHANGELOG.md`, local builds (`make html`), branching, committing,
   pushing a branch, opening a draft PR. No need to ask first.

2. **Ask each time** — editing site config (`pelicanconf.py`,
   `publishconf.py`, `tasks.py`, `Makefile`), editing `cdk/` infrastructure
   code, editing CI/build tooling (`.github/`, `Dockerfile`, `scripts/`),
   adding or removing a dependency, creating a new site directory, editing
   this file. This is an infrastructure repo — editing `cdk/` is normal
   work here, not a special case. Say what you're about to change and why,
   then make the change.

3. **Always ask, then act on yes** — merging or pushing to `main`, pushing
   a release tag, running `cdk deploy`, `cdk destroy`, or any AWS CLI
   command that changes real resources. These touch live DNS, hosting, or
   cloud spend — a revert doesn't undo them once they've run. Once John
   says yes in chat, do it yourself, right then: no handing off the
   command, no asking a second time, no re-litigating after the yes.

4. **Never** — force-push `main`, `git reset --hard`, `git clean -f`,
   `git submodule` commands. These can destroy uncommitted work that git
   itself can't recover, so they're the one category "just revert it"
   doesn't cover. Force-pushing your *own* feature branch after a rebase
   is normal here, not an exception — we always rebase, always keep
   history linear — so `git push --force-with-lease origin <branch>` is
   fine there. Just never force-push `main`.

Don't hand-edit generated or vendored directories — `node_modules/`,
`dist/`, `cdk.out/`, `output/`, `pelican-plugins/`, `themes/`. They're
produced by a build or managed as a submodule; edits there don't stick.

---

## PR Workflow

Linear history only — rebase and merge, no merge commits.

1. `git checkout -b <scope>/<short-description>` — e.g. `kelly/spring-post`, `john/update-about`
2. Make changes, `make html` to verify the build
3. `git add <specific files>` — never `git add .` or `git add -A`
4. `git commit -m "<type>(<site>): <description>"`
5. `git push origin <branch>`
6. `gh pr create --draft --title "..." --body "..."`
7. If `main` has moved: `git fetch origin && git rebase origin/main`,
   resolve conflicts, `git push --force-with-lease origin <branch>` — never
   `git merge main` into the branch
8. A human reviews the PR. To land it: ask once in chat — "ready to land
   `<branch>` to `main`?" On yes, fetch, rebase if needed, fast-forward
   merge, `git push origin main` — right then, yourself.

---

## How to Publish

Landing `main` deploys nothing. The sites go live on a tag push, which runs
`site-deploy`: `cdk deploy --all`, build all five sites, sync to S3,
invalidate CloudFront, cut a GitHub Release. Publishing is Workflow item 3:
ask once, act on yes.

Two commits on the feature branch, landed together:

1. Add an `X.Y.Z` entry to `CHANGELOG.md` and commit — this is R, the release
   commit. `package.json` already reads `X.Y.Z`.
2. Tag R `X.Y.Z`, signed and annotated; the tag message is a one-line release
   note.
3. Bump `package.json` to `X.Y.(Z+1)` and commit as `chore: stage X.Y.(Z+1)` —
   this is S, staging the next release.
4. Land the branch per PR Workflow above; push the tag — `site-deploy` fires
   on tag push.
5. Delete the feature branch (local and remote).

The tag version equals the `package.json` version at the tagged commit.
