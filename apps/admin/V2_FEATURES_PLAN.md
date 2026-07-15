# Dfood Admin V2 Features Implementation Plan

This document outlines the visual, functional, and layout overhaul for the Dfood Admin Website, transitioning it to a premium, feature-rich admin dashboard. Since the backend changes will follow later, all new capabilities will initially run on high-fidelity **dummy/mock data** with full client-side state simulation.

---

## Technical Stack & Design Guidelines
- **Framework:** Next.js 16 (App Router)
- **Styling System:** Tailwind CSS v4 + shadcn/ui.
- **Design Presets:** `npx shadcn@latest init --preset bKsI1x32 --template vite` (adapted to Next.js configuration).
- **Animations:** Framer Motion + [ReactBits](https://reactbits.dev/) custom interactive UI components.
- **Visual Aesthetic:** Dark-mode primary theme, glassmorphic panels (`glass` and `glass-hover`), glowing HSL gradients, and high information density layouts.

---

## Phased Implementation Plan

### Phase 1: Styling System & Foundation Refresh
- Initialize shadcn presets using the custom system.
- Build theme provider with default dark-mode glassmorphic layouts.
- Integrate premium typography (Sen, Bebas, and DM Sans).
- Setup global notification framework using `sonner`.

### Phase 2: Role-Based Routing & Context Simulation
- **Roles to Support:** `Super Admin`, `Manager`, `Support`, `Restaurant Admin`, `Content Manager`, and `Finance`.
- Implement a persistent **Developer Role Selector** in the development environment to instantly hot-swap active roles and inspect restricted pages.
- Setup sidebar navigation lists showing options based on the active role's permissions.

### Phase 3: Analytics & Dashboard Upgrades
- **Main Dashboard View:**
  - KPI cards (Revenue, orders, user count, platform health metrics).
  - Live orders tracker panel showing active counts.
  - "Top" lists: Top restaurants, top-selling foods, low-rated restaurants.
  - Quick action shortcuts (Add restaurant, issue coupon, broadcast notice).
- **Interactive Charts (Recharts):**
  - Daily overview, revenue trends, orders by hour, user/restaurant growth rates, and category item distributions.

### Phase 4: Modern Order & Customer Operations
- **Order Views:**
  - **Kanban Board:** Columns for `Pending`, `Preparing`, `Out for Delivery`, and `Delivered`.
  - **Table View:** Dense data table with advanced multi-select checkboxes.
  - **Timeline/Detail View:** Interactive step-by-step order journey tracker, customer metadata, payment states, and custom fields for `Estimated Completion` and `Internal Notes`.
  - **Bulk Actions:** Multi-select for Accept, Cancel, Export, and Assign actions.
- **Customer Directory:**
  - Instead of a simple user table, design deep profiles showing order histories, total platform spend, favorite foods, favorite restaurants, average basket sizes, last active date, and stored addresses.

### Phase 5: Advanced Catalog Management (Restaurants & Menu)
- **Restaurant Workspace:**
  - Enhanced Profiles: Hero cover images, multi-image carousel galleries, opening hours builder, and social links.
  - Interactive Maps: Geofenced delivery zone drawing interface (polygons).
  - Operational Status: Real-time toggles for `Open`, `Closed`, `Busy`, or `Temporarily Disabled`.
- **Food Catalog:**
  - **Variants & Options:** Create variants (e.g., Small, Medium, Large) and modifier groups (e.g., Extra Cheese, No Onion).
  - **Product Badges:** Attach visual tag pills: `Popular`, `New`, `Recommended`, `Chef's Choice`.
  - **Availability Toggles:** `Available`, `Out of Stock`, `Seasonal`.
  - **Bulk Operations:** Duplicate item and archive item functions.
- **Category Workspace:**
  - Drag-and-drop hierarchy sorting, "Featured" category toggles, "Hide" visibility toggles, and dynamic icon picker.

### Phase 6: Promotions, Reviews, & Settings Modules
- **Promotions Builder:**
  - Coupon creations, active campaign planners, advanced discount rules (buy X get Y, percentage codes), and referral program monitors.
- **Review Moderation Queue:**
  - Separate lists for `Pending`, `Reported`, `Hidden`, and `Approved` reviews.
  - Vendor reply composer.
- **Media Library Manager:**
  - Centralized asset explorer with folders, text searches, and image tags.
  - Detects unused media assets and provides manual triggers for WebP/AVIF file-size optimization.
- **Settings Workspace:**
  - Branding presets, mock payment gateway toggles, email layout customizers, storage bucket configs, and local tax/delivery rates setup.
- **Audit & Activity Logs:**
  - Detailed events feed documenting changes (e.g. who did what, when, IP address, before/after JSON diffs).
- **Reports Exporter:**
  - Triggers to download mock data exports in CSV, Excel, or PDF formats.
