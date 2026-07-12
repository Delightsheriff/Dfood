# Dfood — Development Plan

> Living document. Technologies and approaches may change as we go.
> This is a roadmap, not a contract — adapt as you learn.

## Status

Monorepo infrastructure is stable. All 3 apps build and type-check clean.
Now the real work begins: reorganizing, extracting shared code, and building features.

---

## Phase 7 — Reorganize folders

**Goal:** Consistent project structure across all three apps.

### API (`apps/api`)

Current: flat `src/` with controllers, services, models mixed together.
Target — module-based:

```
src/
├── modules/
│   ├── auth/          controller, service, repository, routes, schema, types
│   ├── users/
│   ├── restaurants/
│   ├── menu/
│   ├── orders/
│   ├── cart/
│   └── uploads/
├── common/            shared middleware, helpers, errors
├── config/            env, db, firebase, cloudinary, etc.
├── plugins/           express extensions, third-party setup
├── middleware/        global middleware (auth, rate-limit, etc.)
├── utils/             pure utility functions
├── app.ts
└── server.ts
```

Every module folder follows the same pattern:

```
orders/
├── controller.ts
├── service.ts
├── repository.ts
├── routes.ts
├── schema.ts
└── types.ts
```

No more `orderController.ts` + `order.service.ts` — just `controller.ts` inside the module folder.

### Mobile (`apps/mobile`)

Current: scattered by file type (`components/`, `hooks/`, `services/`, etc.)
Target — organized by feature:

```
src/
├── features/
│   ├── auth/
│   ├── home/
│   ├── restaurant/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   └── profile/
├── components/       shared/reusable UI components
├── services/         shared API calls
├── hooks/            shared hooks
├── providers/        React context providers
├── store/            state management (zustand)
├── lib/              utilities, helpers
└── assets/           images, fonts
```

### Admin (`apps/admin`)

Same idea as mobile:

```
src/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── orders/
│   ├── restaurants/
│   ├── menu/
│   ├── users/
│   ├── analytics/
│   └── settings/
├── components/       shared UI components
├── services/         shared API calls
├── providers/        React context providers
├── hooks/            shared hooks
├── layouts/          page layouts
├── routes/           route config
└── store/            state management
```

### Rule: move first, rewrite later

Don't rename files while moving. Don't refactor logic. Just relocate.
Cleanup comes in later phases.

---

## Phase 8 — Extract shared code into packages

**Goal:** Move duplicated code into `@dfood/*` packages.

### Candidates

| Duplication | Target package |
|---|---|
| `Order`, `User`, `Restaurant`, `FoodItem` types | `@dfood/types` |
| `ErrorResponse`, `SuccessResponse<T>` | `@dfood/types` |
| `signupSchema`, `signinSchema`, `resetPasswordSchema` | `@dfood/validation` |
| `createFoodItemSchema`, `updateFoodItemSchema` | `@dfood/validation` |
| Axios client setup (admin + mobile) | `@dfood/sdk` |
| `formatCurrency`, date formatters | `@dfood/shared` |
| ESLint, TS config presets | `@dfood/config` |

### Rule: extract on duplication, not speculation

Don't force code into packages. Only extract when you've seen the same logic
in two places. If it lives in only one app, keep it there.

---

## Phase 9 — API cleanup

**Goal:** Consistent responses, validation, error handling.

- Standardize response format across all endpoints
  - One convention: `{ success, data, message, errors }` — no mixing
- Consistent error shapes
- Unified pagination (page, limit, total, pages)
- Standard auth middleware
- Centralized validation (zod schemas from `@dfood/validation`)

---

## Phase 10 — UI polish

**Goal:** Improve what exists, don't redesign.

- Better spacing and typography
- Loading states (skeletons, spinners)
- Empty states (no orders, no results, etc.)
- Form validation feedback
- Consistent toast/notification patterns
- Responsive touch-ups

Polish is noticed more than another feature.

---

## Phase 11 — Features

**Goal:** Ship meaningful functionality. Pick a few and finish them.

Good candidates:
- Favorites / saved restaurants
- Search with filters
- Better order history with reorder
- Coupon / promo codes
- Push notifications
- Restaurant ratings & reviews

Five finished features > twenty half-built ones.

---

## Phase 12 — Polish & ship

**Goal:** Production-ready.

- Tests (unit + integration for critical paths)
- CI pipeline (lint → type-check → test → build)
- Performance (bundle分析, image optimization, API response times)
- Documentation (setup, architecture, API)
- EAS builds for mobile
- Error tracking / monitoring

---

## Naming conventions

Every module uses the same file names:

```
controller.ts
service.ts
repository.ts
routes.ts
schema.ts
types.ts
constants.ts
mapper.ts
```

No more `restaurantController.ts`, `order.service.ts`, `user_routes.ts`.
Consistency reduces cognitive load.

---

## Guiding principles

1. **Infrastructure first, features second** — you're doing this right.
2. **Move before you rewrite** — reorganize, then clean.
3. **Extract on duplication** — shared packages earn their keep.
4. **Consistency > perfection** — same patterns everywhere beats an ideal pattern in one place.
5. **Small commits** — each phase, each extraction, each fix gets its own commit.
