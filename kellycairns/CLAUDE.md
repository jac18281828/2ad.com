# kellycairns.com — Kelly's Site

## To propose a change

1. `git checkout -b kelly/<short-description>`
2. Edit files in `content/`
3. `make html` to verify the build succeeds locally
4. `git add <specific files>` — never `git add .` or `git add -A`
5. `git commit -m "post(kellycairns): <description>"`
6. `git push origin kelly/<short-description>`
7. `gh pr create --draft --title "..." --body "..."`

## Categories and tags

These are different tools. Keep them apart.

**Categories are the site's navigation.** A post has exactly one category, and
the sidebar links to some category pages. The current categories are being
redesigned as part of a menu overhaul. Until then, do not add, rename or remove
a category, and do not move a post between categories, without asking Kelly.

**Tags are free markers that link similar content.** A tag can name anything a
reader might search for or browse: a topic (`hurricane`, `senior pets`,
`prevention`), an outlet or organization (`dvm360`, `Fear Free`), or a kind of
appearance (`interviews`, `speaking`). A tag costs the site nothing, so add the
ones that fit and lean toward keeping a tag already on a post. Use the words her
readers would search for. Name outlets and organizations as they style
themselves; use the show, not its network. Do not repeat a post's category as a
tag.

There is no approved list. Before tagging, list the tags in use and reuse an
existing spelling, because a variant splits one page into two:

    grep -rh '^tags:' content | sed 's/^tags://' | tr ',' '\n' \
      | sed 's/^ *//;s/ *$//' | grep -v '^$' | sort | uniq -c | sort -rn

When a post needs a tag that does not exist, create it and name it in one line of
the PR description so Kelly can see what was added. When retagging existing
posts, tell Kelly every tag you drop and why. A tag can carry an association
(an organization she works with, a phrase people search for) that the content
alone does not show, so do not prune on your own judgement.

**Some tags and categories are structural.** The sidebar links in
`pelicanconf.py` (`LINKS`) point at tag and category pages. Before changing any
tag or category, read `LINKS`. Anything it links to is structural: never rename
or remove it, and give every post that belongs in it the matching tag or
category.

**Never change a published post's slug.** Other sites may link to its URL.
Removing or renaming a tag or category deletes its page on the next deploy, so
check what you would break first.

For full project policy see [`AGENTS.md`](../AGENTS.md).
