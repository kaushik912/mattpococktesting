# mattpococktesting

Testing Matt Pocock's agent skills (spec → tickets → TDD workflow) on a worked example.

- `.claude/skills/`, `.agents/skills/` — the skills (pinned in `skills-lock.json`).
- `examples/notesapp/` — notes PWA built with that workflow. See its `WORKFLOW.md`, `GLOSSARY.md`, `docs/`.

## Run the example

```bash
cd examples/notesapp/app
npm ci
npm test
npm run dev
```

CI: `.github/workflows/ci.yml` (typecheck, unit, build, e2e). Deploy: `deploy.yml` to GitHub Pages (Settings > Pages > Source = GitHub Actions).
