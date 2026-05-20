# kellycairns.com — Kelly's Site

You are working in Kelly's site directory. Your scope is strictly limited to content within this directory.

**You may edit:**
- `content/posts/` — dated Markdown articles
- `content/pages/` — static pages (About, etc.)
- `content/images/` — images used in posts
- `content/static/` — favicons and site-level static files

**You must not touch:**
- `pelicanconf.py`, `publishconf.py`, `tasks.py`, `Makefile` — site config, John's responsibility
- Any directory outside `kellycairns/` — other sites are out of scope
- Any infrastructure file anywhere in the repo

If a change you want to make would require editing anything outside `kellycairns/content/`, stop and describe the request in the PR body so John can handle it.

**To propose a change:**
1. `git checkout -b kelly/<short-description>`
2. Edit files in `content/`
3. `make html` to verify the build succeeds locally
4. `git add <specific files>` — never `git add .` or `git add -A`
5. `git commit -m "content(kellycairns): <description>"`
6. `git push origin kelly/<short-description>`
7. `gh pr create --draft --title "..." --body "..."`

For full project policy see the root [`CLAUDE.md`](../CLAUDE.md).
