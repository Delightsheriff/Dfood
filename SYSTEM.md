# Dfood System Overview

> Generated for rebuild planning. Captures the full feature inventory of the existing system (backend API, admin dashboard, mobile app).

---

## Repository Structure

```
Dfood/
├── apps/
│   ├── api/          # Express.js backend (TypeScript)
│   ├── admin/        # React admin dashboard (Vite + TypeScript)
│   └── mobile/       # React Native (Expo) mobile app
├── packages/
│   ├── @dfood/types/         # Shared TypeScript type definitions
│   ├── @dfood/validation/    # Zod schemas (auth, food items)
│   ├── @dfood/shared/        # Shared utilities (cn)
│   └── @dfood/sdk/           # API client factory (createApiClient)
├── .env.example              # Root env template (all apps)
├── docker-compose.yml        # PostgreSQL + API
├── tsconfig.base.json        # Shared TS config
├── package.json              # Root workspace scripts
└── turbo.json                # Turborepo config
```

---

## 1. Backend API (`apps/api/`)

Express.js REST API with PostgreSQL (Drizzle ORM), JWT auth, modular architecture.

### Tech Stack
- **Runtime:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** JWT (access + refresh tokens), bcrypt
- **File Upload:** multer + Cloudinary
- **Payments:** Paystack
- **Notifications:** Expo Push Notifications
- **Validation:** Zod

### Config & Middleware

| Layer | File | Purpose |
|-------|------|---------|
| Env config | `src/config/env.ts` | Source of truth for all env vars (~38 vars) |
| Database config | `src/config/database.ts` | PostgreSQL connection via Drizzle |
| Cloudinary config | `src/config/cloudinary.ts` | Media upload service config |
| Error handler | `src/middleware/errorHandler.ts` | Global error handler |
| Auth guard | `src/middleware/auth.ts` | JWT verification + role-based guards (`authenticate`, `optionalAuth`, `requireAdmin`, `requireRole`) |
| Validate middleware | `src/middleware/validate.ts` | Zod schema validation (body, params, query, file) |
| Upload middleware | `src/middleware/upload.ts` | Multer setup for single/multiple image upload |
| Response helpers | `src/utils/response.ts` | `sendSuccess`, `sendError`, `sendPaginated` |
| init-app | `src/init-app.ts` | App factory: routes, CORS, JSON parsing, error handler |

### Modules

#### 1. Auth Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/auth/signup` | POST | Register new user (customer role) | Public |
| `/auth/signin` | POST | Sign in, returns tokens | Public |
| `/auth/refresh` | POST | Refresh access token | Public |
| `/auth/session` | GET | Get current user session | Authenticated |
| `/auth/forgot-password` | POST | Send OTP to email | Public |
| `/auth/verify-otp` | POST | Verify OTP, get reset token | Public |
| `/auth/reset-password` | POST | Reset password with reset token | Public |

**Controller:** signup, signin, refresh, getSession, forgotPassword, verifyOTP, resetPassword
**Drizzle queries:** createUser, findUserByEmail, findUserById, updateUserPassword, createOtp, findLatestOtpByEmail, markOtpAsUsed, deleteExpiredOtps

#### 2. Categories Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/categories` | GET | List all categories | Public |
| `/categories` | POST | Create category | Admin |
| `/categories/:id` | PATCH | Update category | Admin |
| `/categories/:id` | DELETE | Delete category + reassign items to uncategorized | Admin |
| `/categories/:id/image` | POST | Upload category image | Admin |
| `/categories/:id/image` | DELETE | Delete category image | Admin |

#### 3. Restaurants Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/restaurants` | GET | List all (optional `?isOpen=true`) | Public |
| `/restaurants` | POST | Create restaurant | Admin |
| `/restaurants/:id` | GET | Get single restaurant | Public |
| `/restaurants/:id` | PATCH | Update restaurant | Admin |
| `/restaurants/:id` | DELETE | Soft-delete restaurant | Admin |
| `/restaurants/:id/image` | POST | Upload restaurant image(s) | Admin |
| `/restaurants/:id/image/:imageId` | DELETE | Delete restaurant image | Admin |

#### 4. Food Items Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/food-items/restaurant/:restaurantId` | GET | List food items by restaurant | Public |
| `/food-items/category/:categoryId` | GET | List food items by category | Public |
| `/food-items/:id` | GET | Get single food item | Public |
| `/food-items` | POST | Create food item | Admin |
| `/food-items/:id` | PATCH | Update food item | Admin |
| `/food-items/:id` | DELETE | Soft-delete food item | Admin |
| `/food-items/:id/image` | POST | Upload food item image(s) | Admin |
| `/food-items/:id/image/:imageId` | DELETE | Delete food item image | Admin |

#### 5. Orders Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/orders` | GET | List user's orders (or all for admin) | Authenticated |
| `/orders` | POST | Create order (validates cart, address, payment) | Authenticated |
| `/orders/:id` | GET | Get order by ID | Authenticated |
| `/orders/number/:orderNumber` | GET | Get order by order number | Authenticated |
| `/orders/:id/cancel` | PATCH | Cancel pending order | Authenticated |
| `/orders/:id/status` | PATCH | Update order status (admin) | Admin |

**Status flow:** pending → confirmed (auto after payment) → preparing → out_for_delivery → delivered. Cancellation allowed only for pending orders.

#### 6. Addresses Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/addresses` | GET | List user's addresses | Authenticated |
| `/addresses` | POST | Create address | Authenticated |
| `/addresses/:id` | GET | Get address by ID | Authenticated |
| `/addresses/:id` | PATCH | Update address | Authenticated |
| `/addresses/:id` | DELETE | Delete address | Authenticated |
| `/addresses/default` | GET | Get default address | Authenticated |
| `/addresses/:id/default` | PATCH | Set address as default | Authenticated |

#### 7. Payment Methods Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/payment-methods` | GET | List user's payment methods | Authenticated |
| `/payment-methods/default` | GET | Get default payment method | Authenticated |
| `/payment-methods/:id/default` | PATCH | Set default payment method | Authenticated |
| `/payment-methods/:id` | DELETE | Delete payment method | Authenticated |

#### 8. Favorites Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/favorites` | GET | List user's favorite food items | Authenticated |
| `/favorites/:foodItemId` | POST | Add food item to favorites | Authenticated |
| `/favorites/:foodItemId` | DELETE | Remove from favorites | Authenticated |
| `/favorites/:foodItemId/check` | GET | Check if item is favorited | Authenticated |

#### 9. Profile Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/profile` | GET | Get user profile | Authenticated |
| `/profile` | PATCH | Update profile (name, phone) | Authenticated |
| `/profile/image` | POST | Upload profile image | Authenticated |
| `/profile/image` | DELETE | Delete profile image | Authenticated |

#### 10. Search Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/search?q=...` | GET | Full-text search across restaurants (name, desc, address) and food items (name, desc) | Public |

#### 11. Device Tokens Module
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/device-tokens/register` | POST | Register Expo push token | Authenticated |
| `/device-tokens/unregister` | POST | Unregister push token | Authenticated |

#### 12. Users Module (Admin)
| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/users` | GET | List all users | Admin |
| `/users/:id` | GET | Get user by ID | Admin |
| `/users/:id` | PATCH | Update user (name, email, role, phone, isActive) | Admin |
| `/users/:id` | DELETE | Hard delete user | Admin |

### Database Schema (Drizzle)

| Table | Key Fields |
|-------|-----------|
| `users` | id, name, email, password, phone, role (customer/admin), image, isActive, createdAt, updatedAt |
| `password_reset_otps` | id, email, otp, type, expiresAt, usedAt |
| `refresh_tokens` | id, userId, token, expiresAt |
| `device_tokens` | id, userId, token |
| `categories` | id, name, image, isActive, createdAt |
| `restaurants` | id, name, description, deliveryFee, deliveryTime, isActive, isOpen, address, images[], hours, createdAt, deletedAt |
| `food_items` | id, name, description, price, categoryId, restaurantId, images[], isActive, calories, createdAt, deletedAt |
| `orders` | id, orderNumber, userId, restaurantId, items[], deliveryAddress, paymentMethod, deliveryInstruction, status, subtotal, deliveryFee, total, createdAt |
| `addresses` | id, userId, label, street, city, state, latitude, longitude, isDefault, createdAt |
| `payment_methods` | id, userId, type, provider, cardLast4, isDefault |
| `favorites` | id, userId, foodItemId, createdAt |

---

## 2. Admin Dashboard (`apps/admin/`)

React SPA (Vite + TypeScript + Tailwind + shadcn/ui + React Query).

### Tech Stack
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **UI:** Tailwind CSS + shadcn/ui (Radix primitives)
- **State:** React Query (server state), custom hooks
- **Routing:** React Router v6
- **API Client:** axios (via @dfood/sdk)
- **Forms:** react-hook-form + Zod
- **Auth:** JWT (access + refresh tokens)

### Auth & Layout
- **Login page** — email/password form, redirects to dashboard
- **AppLayout** — sidebar nav + topbar + main content area
- **Sidebar** — Dashboard, Orders, Restaurants, Food Items, Categories, Users, Profile, Settings
- **Auth guard** — redirects to /login if no token, auto-refreshes token

### Pages

#### Dashboard
- **Stats cards** — total orders, revenue, active restaurants, total users (fetched from multiple endpoints)
- **Recent orders** — last 10 orders table

#### Orders
- **List page** — data table with columns: order number, customer, restaurant, items, total, status, date. Filterable by status. Row click → detail page.
- **Detail page** — order info card, customer info, items list, status update dropdown, cancellation option

#### Restaurants
- **List page** — card grid with image, name, status (open/closed), delivery fee, toggle active/inactive, soft delete
- **Create page** — form: name, description, delivery fee, delivery time, hours schedule, address
- **Edit page** — pre-filled form + image manager (upload/delete)

#### Food Items
- **List page** — card grid with image, name, price, category, restaurant, toggle active/inactive, edit/delete
- **Create page** — form: name, description, price, category (select), restaurant (select), calories
- **Edit page** — pre-filled form + image manager

#### Categories
- **List page** — card grid with image, name, item count
- **Create page** — form: name, image upload
- **Edit page** — pre-filled form + image manager

#### Users
- **List page** — data table: name, email, role, status, orders count
- **Detail page** — user info, order history list

#### Profile
- Edit name, email, phone
- Avatar upload/delete

#### Settings
- **Profile section** — edit name, email, phone, avatar
- **Password section** — change password form

### Admin Hooks (custom React Query)
- `useStats()` — aggregates stats from orders, restaurants, food items, users
- `useRestaurants()` / `useRestaurant()` / `useCreateRestaurant()` / `useUpdateRestaurant()` / `useDeleteRestaurant()`
- `useFoodItems()` / `useFoodItem()` / `useCreateFoodItem()` / `useUpdateFoodItem()` / `useDeleteFoodItem()` / `useDeleteFoodItemImage()`
- `useCategories()` / `useCategory()` / `useCreateCategory()` / `useUpdateCategory()` / `useDeleteCategory()`
- `useOrders()` / `useOrder()` / `useUpdateOrderStatus()`
- `useUsers()` / `useUser()` / `useUpdateUser()` / `useDeleteUser()`
- `useProfile()` / `useUpdateProfile()` / `useUpdateProfileImage()` / `useDeleteProfileImage()`

### Admin Services (API client methods)
- Same as mobile `data.service.ts` — covers all CRUD endpoints

---

## 3. Mobile App (`apps/mobile/`)

React Native (Expo) app with Expo Router, Zustand, React Query.

### Tech Stack
- **Framework:** Expo (SDK ~51)
- **Routing:** Expo Router (file-based)
- **UI:** NativeWind (Tailwind for RN), `@rn-primitives` (Radix-like), Reanimated
- **State:** Zustand (cart) + React Query (server state)
- **API Client:** axios (via @dfood/sdk)
- **Forms:** react-hook-form + Zod
- **Payments:** Paystack WebView
- **Maps:** react-native-maps
- **Notifications:** expo-notifications (Expo Push)

### Auth Flows
- **Onboarding** → 3-slide carousel, skip/next/get-started
- **Sign In** → email/password, forgot password link
- **Sign Up** → name, email, password
- **Forgot Password** → email → OTP verification (4 digits, 50s resend) → reset password
- **Session persistence** — SecureStore token + auto-fetch session on launch

### Navigation Structure

```
Root (_layout.tsx)
├── Onboarding (/onboarding)
├── (auth)
│   ├── /signin
│   ├── /signup
│   ├── /forgot-password
│   ├── /verification
│   └── /reset-password
└── (app)
    ├── / (Home)
    ├── /search
    ├── /cart
    ├── /checkout
    ├── /order-confirmation
    ├── /categories/
    │   ├── index (all categories)
    │   └── [id] (category detail)
    ├── /restaurants/
    │   ├── index (all restaurants)
    │   └── [id] (restaurant detail)
    ├── /food/[id] (food detail)
    └── /profile/
        ├── index (profile menu)
        ├── /personal-info
        ├── /addresses
        ├── /add-address (map + form)
        ├── /edit-address (map + form)
        ├── /orders
        ├── /order-details
        ├── /favourites
        ├── /payment-methods
        └── /add-card (Paystack)
```

### Pages & Features

#### Home
- Greeting header (time-based)
- Categories horizontal scroll
- Open restaurants list with pull-to-refresh
- Cart badge icon

#### Search
- Debounced search (500ms)
- Results grouped: "Restaurants" and "Dishes"
- Minimum 2 characters

#### Cart
- Items list with images, quantity controls (+/-)
- Edit mode for removal
- Bottom sheet with total and checkout button
- Single-restaurant enforcement (clears cart if switching)
- Persisted via Zustand + AsyncStorage

#### Checkout
- Order summary (restaurant, items, subtotal, delivery fee, total)
- Delivery address selection (bottom sheet)
- Payment method selection (bottom sheet)
- Delivery instructions input
- Place order button (loading/disabled states)

#### Order Confirmation
- Animated success checkmark
- Order number, restaurant info
- Delivery address, payment details
- Itemized totals

#### Categories
- **Index:** 2-column grid of all categories
- **Detail:** Food items filtered by category, 2-column grid
- **Filter dialog:** Offers, delivery time, pricing, rating

#### Restaurants
- **Index:** FlatList with pull-to-refresh
- **Detail:** Image carousel, info pills (rating, delivery fee, status, hours), menu grid

#### Food Detail
- Image carousel
- Name, description, price, calories
- Favorite toggle (heart)
- Quantity selector + add to cart
- Restaurant-switch confirmation dialog

#### Profile
- **Menu:** avatar card, sections (Personal Info, Addresses, Cart, Orders, Favourites, Notifications, Payment Method, FAQs, Settings), logout
- **Personal Info:** avatar picker (camera/gallery), edit name/phone (email read-only)
- **Addresses:** list with label icons, default badge, edit/delete, tap to set default
- **Add Address:** full-screen MapView with center pin, reverse geocoding, bottom sheet form
- **Edit Address:** draggable marker, reverse geocoding, form
- **Orders:** history cards with status badges, items count, total, date, pull-to-refresh
- **Order Details:** status card, progress stepper (5 steps), cancel button
- **Favourites:** 2-column grid, pull-to-refresh
- **Payment Methods:** list (Cash on Delivery + cards), set default, delete
- **Add Card:** Paystack popup, charges 100 NGN (refundable verification)

### Stores
- **cartStore** (Zustand + persist): items[], addItem, removeItem, incrementItem, decrementItem, updateQuantity, getTotalPrice, getItemCount, getRestaurantId, clearCart

### Hooks (all use React Query)

| Hook | Cached Data | Stale Time |
|------|-------------|------------|
| `useCategories()` | All categories | 10 min |
| `useRestaurants(isOpen?)` | Restaurant list | 2 min |
| `useRestaurant(id)` | Single restaurant | 5 min |
| `useFoodItemsByRestaurant(id)` | Items by restaurant | 5 min |
| `useFoodItemsByCategory(id)` | Items by category | 5 min |
| `useFoodItem(id)` | Single food item | 5 min |
| `useSearch(query)` | Search results | 30s |
| `useProfile()` | User profile | 5 min |
| `useFavorites()` | Favorite items | 30 min |
| `useCheckFavorite(id)` | Favorite check | 5 min |
| `useAddresses()` | Address list | 5 min |
| `useDefaultAddress()` | Default address | 5 min |
| `usePaymentMethods()` | Payment methods | 5 min |
| `useDefaultPaymentMethod()` | Default payment method | 5 min |
| `useOrders()` | Order history | 1 min |
| `useOrder(id)` | Single order | 1 min |

| Mutation Hook | Endpoint |
|---------------|----------|
| `useSignUp()` | POST /auth/signup |
| `useSignIn()` | POST /auth/signin |
| `useSignOut()` | (local) + POST /device-tokens/unregister |
| `useForgotPassword()` | POST /auth/forgot-password |
| `useVerifyOTP()` | POST /auth/verify-otp |
| `useResetPassword()` | POST /auth/reset-password |
| `useCreateAddress()` | POST /addresses |
| `useUpdateAddress()` | PATCH /addresses/:id |
| `useSetDefaultAddress()` | PATCH /addresses/:id/default |
| `useDeleteAddress()` | DELETE /addresses/:id |
| `useAddCard()` | POST /payment-methods/card |
| `useSetDefaultPaymentMethod()` | PATCH /payment-methods/:id/default |
| `useDeletePaymentMethod()` | DELETE /payment-methods/:id |
| `useAddFavorite()` | POST /favorites/:foodItemId |
| `useRemoveFavorite()` | DELETE /favorites/:foodItemId |
| `useCreateOrder()` | POST /orders |
| `useCancelOrder()` | PATCH /orders/:id/cancel |
| `useUpdateProfile()` | PATCH /profile |
| `useUpdateProfileImage()` | POST /profile/image |
| `useDeleteProfileImage()` | DELETE /profile/image |

### Services
- **authService** — signUp, signIn, getSession, forgotPassword, verifyOTP, resetPassword, signOut
- **dataService** — all CRUD methods for every entity (categories, restaurants, food items, orders, addresses, payment methods, favorites, profile, search)
- **NotificationService** — push notification permissions, token registration/unregistration, foreground/tap listeners, token refresh

### Push Notifications
- Expo Push tokens
- Register on sign-in/sign-up
- Unregister on sign-out
- Foreground listener (shows toast)
- Tap listener (navigates to order-details)
- Token refresh listener

---

## 4. Shared Packages

### `@dfood/sdk` (`packages/sdk/`)
- **`createApiClient(config)`** — creates an axios instance with:
  - Base URL
  - Token storage adapter (get/set/clear)
  - Auto-attach Authorization header
  - Auto-refresh on 401
  - Custom `onUnauthorized` callback
- **`TokenCache`** — interface: `getToken()` / `setToken(token)` / `clearToken()`

### `@dfood/types` (`packages/types/`)
- `Category`, `Restaurant`, `FoodItem`, `Order`, `OrderItem`, `Address`, `PaymentMethod`
- `ErrorResponse`
- Response wrappers: `SuccessResponse<T>`, `PaginatedResponse<T>`
- `UpdateOrderStatusBody`, `CreateOrderInput`

### `@dfood/validation` (`packages/validation/`)
- **Auth schemas:** `signUpSchema`, `signInSchema`, `forgotPasswordSchema`, `verifyOTPSchema`, `resetPasswordSchema`
- **Food item schema:** `createFoodItemSchema`

### `@dfood/shared` (`packages/shared/`)
- `cn()` — class-variance-utility `clsx` + `tailwind-merge` wrapper

---

## 5. Data Flow Summary

```
Mobile/Admin ──axios──▶ Express API ──Drizzle──▶ PostgreSQL
                            │
                            ├── Cloudinary (images)
                            ├── Paystack (payments)
                            └── Expo Push (notifications)

Auth: JWT access (15m) + refresh (7d) tokens
```

---

## 6. Key Features Matrix

| Feature | API | Admin | Mobile |
|---------|-----|-------|--------|
| User auth (signup/signin/session) | ✅ | ✅ (admin only) | ✅ |
| Password reset flow | ✅ | ❌ | ✅ |
| Category CRUD + image | ✅ | ✅ | Read-only |
| Restaurant CRUD + images | ✅ | ✅ | Read-only |
| Food item CRUD + images | ✅ | ✅ | Read-only |
| Order management | ✅ | Status update | Create, view, cancel |
| Address management | ✅ | ❌ | Full CRUD |
| Payment methods | ✅ | ❌ | Add card, list, delete |
| Favorites | ✅ | ❌ | Add/remove/view |
| Profile (edit, avatar) | ✅ | ✅ | ✅ |
| Search (full-text) | ✅ | ❌ | ✅ |
| Push notifications | Token mgmt | ❌ | Full setup |
| Cart | ❌ | ❌ | ✅ (local) |
| Admin dashboard | Aggregated stats | ✅ | ❌ |
| User management (admin) | ✅ | ✅ | ❌ |
| Image upload | ✅ | ✅ | ✅ (avatar) |
| Paystack integration | Verify charge | ❌ | Add card |
| Map integration | ❌ | ❌ | ✅ (add/edit address) |
