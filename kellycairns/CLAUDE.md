# kellycairns.com — Kelly's Site

## To propose a change

1. `git checkout -b kelly/<short-description>`
2. Edit files in `content/`
3. `make html` to verify the build succeeds locally
4. `git add <specific files>` — never `git add .` or `git add -A`
5. `git commit -m "content(kellycairns): <description>"`
6. `git push origin kelly/<short-description>`
7. `gh pr create --draft --title "..." --body "..."`

For full project policy see [`AGENTS.md`](../AGENTS.md).
