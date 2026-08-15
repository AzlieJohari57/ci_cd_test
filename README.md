# CI/CD Practice: Todo CRUD App

A deliberately tiny full-stack app used to practice how a CI/CD pipeline works.

- `backend/` — Express REST API, in-memory todo list (data resets on restart).
- `frontend/` — React app (Vite) that talks to the API.
- `.github/workflows/ci-cd.yml` — the pipeline.

## Running locally

Two terminals:

```bash
cd backend && npm install && npm run dev   # http://localhost:4000
cd frontend && npm install && npm run dev  # http://localhost:5173
```

The frontend dev server proxies `/api` requests to the backend (see `frontend/vite.config.js`), so just open the frontend URL.

## API

| Method | Path              | Body                        | Description       |
|--------|-------------------|------------------------------|--------------------|
| GET    | `/api/health`     | —                             | Health check       |
| GET    | `/api/todos`      | —                             | List todos         |
| POST   | `/api/todos`      | `{ "title": string }`         | Create a todo      |
| PUT    | `/api/todos/:id`  | `{ "title"?, "done"? }`       | Update a todo      |
| DELETE | `/api/todos/:id`  | —                             | Delete a todo      |

## Tests & lint

```bash
cd backend && npm run lint && npm test
cd frontend && npm run lint && npm test && npm run build
```

## The pipeline

`.github/workflows/ci-cd.yml` runs on every push/PR to `main` and has three jobs:

1. **backend-ci** — installs deps, lints, runs the API tests.
2. **frontend-ci** — installs deps, lints, runs component tests, builds the production bundle, and uploads it as a build artifact.
3. **deploy** — only runs on a direct push to `main` (not on PRs), and only after both CI jobs succeed (`needs: [backend-ci, frontend-ci]`). It downloads the artifact frontend-ci built and runs a stubbed "deploy" step, so you can see the full CI → artifact → CD flow without needing any real hosting account.

To wire it to a real host later (Render, Fly.io, a VM, GitHub Pages, etc.), replace the `Deploy (stub)` step with the provider's deploy action/CLI and add any required credentials as encrypted secrets in the repo's **Settings → Secrets and variables → Actions**, then reference them via `${{ secrets.YOUR_SECRET }}`.

## Watching it run

Push this repo to GitHub, open a PR — you'll see `backend-ci` and `frontend-ci` run. Merge to `main` and the `deploy` job will also run. Check the **Actions** tab to watch it live.
