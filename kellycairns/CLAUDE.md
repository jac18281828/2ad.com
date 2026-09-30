# kellycairns.com — Kelly's Site

## To propose a change

1. `git checkout -b kelly/<short-description>`
2. Edit files in `content/`
3. `make html` to verify the build succeeds locally
4. `git add <specific files>` — never `git add .` or `git add -A`
5. `git commit -m "post(kellycairns): <description>"`
6. `git push origin kelly/<short-description>`
7. `gh pr create --draft --title "..." --body "..."`

## Tags

Each tag gets its own page (`/tag/<slug>.html`), and the sidebar's
"podcast" link is one of them, so tag every post from this list. Reuse an
existing spelling rather than inventing a variant.

1. **Format**: exactly one on every media post and publication:
   `podcast`, `TV & video`, `radio`, `press` (articles quoting or
   featuring Kelly), `publication` (work Kelly wrote), `speaking`.
2. **Outlet or show**: the outlet's own name, capitalized as it styles
   itself: `19 Cats and Counting`, `dvm360`, `FOX 32 Chicago`,
   `WBBM Newsradio`, `Newsweek`, `Chicago Sun-Times`, `Leading Out Loud`.
   A single-use outlet tag is fine; it records where she appeared.
3. **Topics**: lowercase unless a proper noun.
   - Broad: `cats`, `dogs`, `internal medicine`, `pet safety`,
     `behavior`, `senior pets`, `preventive care`, `adoption & rescue`,
     `respiratory illness`, `leadership`, `mentorship`, `wellbeing`,
     `veterinary education`, `research`.
   - Specific clinical areas, kept even when used once:
     `dermatology`, `diabetes`, `kidney disease`, `liver disease`,
     `gastrointestinal disease`, `arthritis`, `parasites`, `nutrition`,
     `pharmacology`, `zoonotic disease`, `genetics`, `immunology`,
     `Pandora syndrome`.
   - Reserved for education and consulting work: use these spellings
     when the first post needs them: `curriculum development`,
     `competency-based education`, `clinical reasoning`,
     `faculty development`, `transition to practice`, `consulting`.

Don't tag locations (`chicago`), `interview` (the format covers it), or
one-off trivia (`tofu`).

For full project policy see [`AGENTS.md`](../AGENTS.md).
