# Dfood Monorepo

A TypeScript monorepo for the Dfood food-ordering platform — admin panel, API, and mobile app, sharing common types, validation, and SDK.

## Structure

```
dfood/
├── apps/
│   ├── admin/      # Next.js 16 admin dashboard
│   ├── api/        # Node.js/Express backend
│   └── mobile/     # Expo/React Native mobile app
├── packages/
│   ├── sdk/        # API client SDK
│   ├── shared/     # Shared utilities, hooks, business logic
│   ├── validation/ # Zod validation schemas
│   ├── config/     # Shared configs (ESLint, TS, etc.)
│   └── types/      # Shared TypeScript types
├── docs/           # Documentation
└── scripts/        # Build and maintenance scripts
```

## Requirements

- **Node.js**: `>=20.0.0`
- **pnpm**: `>=10.0.0` (install with `npm install -g pnpm`)

## Quick Start

```bash
# Install all dependencies
pnpm install

# Run all apps in development
pnpm dev

# Build everything
pnpm build

# Lint everything
pnpm lint

# Type-check everything
pnpm type-check
```

## Working with a specific app

```bash
# Run dev for just the API
pnpm --filter @dfood/api dev

# Add a dep to the admin app
pnpm --filter @dfood/admin add some-package

# Add a dev dep to the root
pnpm add -Dw some-tool
```

## Adding a shared package to an app

```bash
# From the app's directory, add the workspace package
pnpm --filter @dfood/admin add @dfood/types@workspace:*
```

## Git Workflow

- **Main branch**: stable, deployable code
- **Feature branches**: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

## See Also

- [Migration Plan](./MIGRATION_PLAN.md) — how this monorepo was assembled from 3 separate repos
