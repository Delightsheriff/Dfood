# Dfood Monorepo Migration & Refactor Plan

> **Single source of truth** for the migration from 3 separate repos to 1 monorepo.
> Update this file as we make progress.

---

## Context

**Current state (before migration):**
- 3 separate repos, each with their own history:
  - `git@github.com:Delightsheriff/Dfood-admin.git` → `apps/admin`
  - `git@github.com:Delightsheriff/Dfood-api.git` → `apps/api`
  - `git@github.com:Delightsheriff/Dfood-app.git` → `apps/mobile`
- No monorepo infrastructure yet

**Target state (after all phases):**
- 1 single git repo at `Delightsheriff/Dfood` (or TBD name)
- 3 apps (`apps/admin`, `apps/api`, `apps/mobile`) with **preserved git history**
- 5 shared packages (`packages/sdk`, `packages/shared`, `packages/validation`, `packages/config`, `packages/types`)
- Monorepo tooling: pnpm workspaces + Turborepo
- Shared TypeScript config (`tsconfig.base.json`)

**Working directory:** `/Users/MAC/Desktop/Dfood` (confirmed empty as of 2026-07-12)

---

## Decision Log

| # | Decision | Choice |
|---|----------|--------|
| 1 | History preservation | **Preserve full history** via `git-filter-repo` |
| 2 | New repo name | ✅ `Delightsheriff/Dfood` → `git@github.com:Delightsheriff/Dfood.git` |
| 3 | `git-filter-repo` install | `brew install git-filter-repo` (macOS native) |
| 4 | Old repos after migration | Archive on GitHub (do not delete) |
| 5 | Branch to migrate | `main` only |
| 6 | Phasing | 1→3 first (structural), 4→5 next (refactor), 6 last (push) |

---

## PHASE 1 — Migrate the three repos (preserve history)

**Goal:** One local git repo containing all three apps' full history, each in its own subfolder.

### Steps
1. Install `git-filter-repo`:
   ```bash
   brew install git-filter-repo
   ```
2. Clone each of the 3 repos as **bare mirrors** to `/tmp/`:
   ```bash
   git clone --mirror git@github.com:Delightsheriff/Dfood-admin.git /tmp/dfood-admin.git
   git clone --mirror git@github.com:Delightsheriff/Dfood-api.git   /tmp/dfood-api.git
   git clone --mirror git@github.com:Delightsheriff/Dfood-app.git   /tmp/dfood-app.git
   ```
3. For each, rewrite history so all files live under the target subfolder:
   ```bash
   # Admin
   git --git-dir=/tmp/dfood-admin.git filter-repo --to-subdirectory-filter apps/admin
   # API
   git --git-dir=/tmp/dfood-api.git   filter-repo --to-subdirectory-filter apps/api
   # Mobile
   git --git-dir=/tmp/dfood-app.git   filter-repo --to-subdirectory-filter apps/mobile
   ```
4. Initialize the monorepo at `/Users/MAC/Desktop/Dfood`:
   ```bash
   cd /Users/MAC/Desktop/Dfood
   git init
   echo "# Dfood Monorepo" > README.md
   git add README.md
   git commit -m "chore: initial monorepo commit"
   git branch -M main
   ```
5. Add each rewritten repo as a remote and merge:
   ```bash
   git remote add origin-admin /tmp/dfood-admin.git
   git fetch origin-admin
   git merge origin-admin/main --allow-unrelated-histories -m "Merge admin history into monorepo"
   git remote remove origin-admin
   # Repeat for api and mobile
   ```
6. **Verify:** `git log --oneline --all` shows three lineages, and files live under `apps/admin/`, `apps/api/`, `apps/mobile/`.

### Done when
- [x] `git status` is clean
- [x] `apps/admin/`, `apps/api/`, `apps/mobile/` all populated
- [x] `git log` shows commits from all three original repos
- [x] No files at the monorepo root (besides `README.md`)

---

## PHASE 2 — Strip per-app cruft

**Goal:** Remove files that no longer belong in each app (they'll live at the monorepo root instead).

### Steps
For **each** of `apps/admin`, `apps/api`, `apps/mobile`, remove:
- `package.json` (root-level) → migrate deps to monorepo root `package.json`
- `tsconfig.json` (root-level) → replaced by `tsconfig.base.json` + app-specific extends
- `node_modules/` (delete entirely)
- `pnpm-lock.yaml` (root-level) → regenerate at monorepo root
- `package-lock.json` / `yarn.lock` (root-level) → use pnpm at root
- `README.md` (root-level) → root README covers all apps
- `.gitignore` (root-level) → monorepo-level `.gitignore`
- `.env` files → centralize at root

### Keep per app
- Framework configs: `vite.config.ts`, `next.config.js`, `expo.config.js`, etc.
- App-specific source code
- App-specific components/styles/assets

### Done when
- [x] Only the monorepo root has `package.json`, `tsconfig.json`, `README.md`, etc.
- [x] Each app has only its framework config + source

---

## PHASE 3 — Monorepo infrastructure

**Goal:** Working pnpm + Turborepo setup with shared TS config.

### Files to create
- `package.json` (root) — workspaces, scripts (`dev`, `build`, `lint`, `test`)
- `pnpm-workspace.yaml` — points to `apps/*` and `packages/*`
- `turbo.json` — pipelines for `build`, `dev`, `lint`, `test`
- `tsconfig.base.json` — shared compiler options
- `.gitignore` — `node_modules/`, `.turbo/`, `dist/`, `.next/`, `*.log`, `.env`
- `.env.example` — template for env vars
- `README.md` (root) — overview, setup, scripts

### Done when
- [x] `pnpm install` works at the root
- [x] `pnpm turbo run build` succeeds (or at least runs)
- [x] Each app's `tsconfig.json` extends `../../tsconfig.base.json`

---

## PHASE 4 — Create the 5 shared packages (scaffolded)

**Goal:** Empty/scaffolded packages ready to be filled in.

### Packages
| Package | Purpose | Status |
|---------|---------|--------|
| `packages/sdk` | API client SDK (consumed by admin & mobile) | scaffolded |
| `packages/shared` | Shared utilities, hooks, business logic | scaffolded |
| `packages/validation` | Validation schemas (likely Zod) | scaffolded |
| `packages/config` | Shared configs (ESLint, TS, Tailwind) | scaffolded |
| `packages/types` | Shared TypeScript types/interfaces | scaffolded |

### Steps
For each package, create:
- `package.json` with proper name (`@dfood/<name>`), main, types, scripts
- `tsconfig.json` extending base
- `src/index.ts` (empty for now)

### Done when
- [x] All 5 packages exist and are recognized by pnpm workspaces
- [x] Each has a buildable (even if empty) structure

---

## PHASE 5 — Get things building again

**Goal:** Each app builds and dev-runs inside the monorepo.

### Steps
For each app:
1. Update its `package.json` to:
   - Add workspace deps: `@dfood/types`, `@dfood/shared`, `@dfood/validation`, etc. (as needed)
   - Remove deps that are now hoisted or in shared packages
2. Update its `tsconfig.json` to extend `../../tsconfig.base.json`
3. Update import paths if we move shared code
4. Wire up `turbo.json` so the app's `build` depends on the right packages
5. Test `pnpm dev` runs from the root

### Done when
- [x] `pnpm install` works
- [x] `pnpm turbo run build` builds all apps + packages
- [x] `pnpm dev` runs all dev servers in parallel

---

## PHASE 6 — Push to new remote + cleanup

**Goal:** New monorepo is the source of truth on GitHub; old repos archived.

### Steps
1. Create new empty repo on GitHub: `Delightsheriff/Dfood` (or confirmed name)
2. Add as remote and push:
   ```bash
   git remote add origin git@github.com:Delightsheriff/Dfood.git
   git push -u origin main
   ```
3. On GitHub, archive the 3 old repos (Settings → Archive, do not delete)
4. Update local clones' remotes if needed
5. Update any team docs/READMEs pointing to old repos

### Done when
- [x] Monorepo is live at `Delightsheriff/Dfood`
- [x] Old repos archived (not deleted)
- [x] All local work pushes to the new repo

---

## Progress Tracker

| Phase | Status | Date completed |
|-------|--------|----------------|
| 1 — Migrate repos | ✅ Complete | 2026-07-12 |
| 2 — Strip cruft | ⏳ Pending | — |
| 3 — Monorepo infra | ⏳ Pending | — |
| 4 — Shared packages | ⏳ Pending | — |
| 5 — Get building | ⏳ Pending | — |
| 6 — Push & cleanup | ⏳ Pending | — |

**Phase 1 result:** 272 commits (132 api + 90 mobile + 46 admin + 4 merge/init). 3 histories merged, all files under `apps/<name>/`.

---

## Notes / Open Questions

- Repo name `Delightsheriff/Dfood` — to be confirmed before Phase 6
- Old repos: archive, not delete (preserves history if we ever need it)
- `git-filter-repo` rewrite is **destructive** to the bare clones in `/tmp/`, so we work on copies
