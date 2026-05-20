# 2ad.com — Multi-Site Pelican Repo

This repo hosts five static websites built with [Pelican](https://getpelican.com) (Python).

| Directory | Site | Owner |
|-----------|------|-------|
| `2ad/` | 2ad.com | John |
| `kellycairns/` | kellycairns.com | Kelly |
| `archiecairns/` | archiecairns.com | children |
| `emmycairns/` | emmycairns.com | children |
| `minacairns/` | minacairns.com | children |

**Full agent policy:** [`AGENTS.md`](AGENTS.md) — read this first.

## Identifying which agent you are

At the start of every session, check the `userEmail` in your context:

- **`john@2ad.com`** → John's agent. Full scope as defined in `AGENTS.md`.
- **Any other email** (including Kelly's) → restricted scope. Default to Kelly's scope: edit only within `kellycairns/content/`. If the user asks for something outside that scope, stop and ask John.
- **Email unknown or unclear** → assume restricted scope and ask the user to confirm their role before making any changes.

When working inside `kellycairns/`, also read [`kellycairns/CLAUDE.md`](kellycairns/CLAUDE.md).
