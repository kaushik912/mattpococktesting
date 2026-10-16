# UI improvement — analysis & decisions

Status: planning. Date: 2026-10-16.

## Context
- UI = `app/src/ui/App.tsx` (343 lines, single component file) + `app/src/ui/app.css` (30 lines). PWA (`app/src/pwa/`).
- Domain terms in `GLOSSARY.md` (Note, Title, Tag, Trash, Export bundle). Use them in prompts.
- UI is thin → big design latitude, low risk. Visual questions can't be settled in chat.

## Recommended path (skills, in order)

| # | Skill | Why | Output goes to |
|---|-------|-----|----------------|
| 1 | `/grill-with-docs` | Pin down *what* "improve" means (look? flow? mobile? a11y?). Updates GLOSSARY/ADR if UI terms emerge | `decisions.md` |
| 2 | `/prototype` | UI look/feel can't be decided on paper. Throwaway variants, pick one | `prototype/<name>` branch + `decisions.md` |
| 3 | `/to-spec` → `/to-tickets` | Only if the winning design is multi-session (e.g. split App.tsx + restyle + mobile) | `.scratch/ui-improvement/issues/` |
| 4 | `/implement` (drives `/tdd`) | Build per ticket, fresh context each | code |
| 5 | `/code-review` | Standards + Spec check of diff | review notes |
| 6 | `/retro` | Capture env improvements | `retro.md` |

Optional side skills:
- `/improve-codebase-architecture` — if App.tsx 343-line monolith needs deepening (split into components) *before* restyling.
- `/research` — if you want primary-source facts first (PWA mobile UX guidelines, WCAG, notes-app patterns).
- `/handoff` — only if prototyping in a separate dir/session.
- `/wait-what` — if agent jargon loses you.

If scope is small (just restyle): skip 3, do `/grill-with-docs` → `/prototype` → `/implement`.

## Prompts

### 1. /grill-with-docs
```
/grill-with-docs I want to improve the UI of the notes app (app/src/ui/App.tsx, app.css).
Interview me on: what feels bad today, target devices (mobile PWA vs desktop), must-keep
behaviours (Tags, search, Trash, Export bundle), visual direction, accessibility, and
what's out of scope. Record decisions in .scratch/ui-improvement/decisions.md.
```

### 2. /prototype
```
/prototype UI for the notes app. Build 3 radically different variants of the Note list +
editor screen (e.g. A: two-pane list/editor, B: single column mobile-first with bottom
search, C: dense/keyboard-driven). Switchable via ?variant=a|b|c. Use real Notes, Tags,
Trash states. Throwaway code under .scratch/ui-improvement/prototype/. Question to answer:
which layout makes finding and capturing a Note fastest?
```

### 3. /to-spec + /to-tickets
```
/to-spec from our grilling + chosen prototype variant. Keep to Glossary terms.
/to-tickets split into tracer-bullet tickets (e.g. layout shell → Note list → editor →
Tags/search → Trash → polish). Write to .scratch/ui-improvement/issues/.
```

### 4. /implement
```
/implement .scratch/ui-improvement/issues/01-*.md
```
(`/clear` between tickets.)

### 5. /code-review
```
/code-review since main
```

### 6. /retro
```
/retro focus on UI work: missing visual checks, style standards worth encoding.
```

## Decisions log
(append as we go; one line each: date — decision — why)

- 2026-10-16 — Docs live in `.scratch/ui-improvement/` — user request, matches existing `.scratch/notes-app` convention.

## Open questions
- What specifically is wrong with current UI?
- Mobile vs desktop priority?
- Design system / CSS approach (stay plain CSS, or Tailwind)?
- Is a visual regression/screenshot check wanted?
