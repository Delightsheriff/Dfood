/**
 * @dfood/sdk
 *
 * Shared API client SDK for admin and mobile apps.
 *
 * In Phase 5, this will host the shared axios instance + service functions.
 * The current pattern from apps/admin/lib/api-client.ts and
 * apps/mobile/lib/api-client.ts will be unified here, with a token-getter
 * function injected per app:
 *
 *   - Admin: token from next-auth session
 *   - Mobile: token from expo-secure-store
 */

export const VERSION = "0.1.0";
