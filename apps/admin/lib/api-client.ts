import { createApiClient, TokenCache } from "@dfood/sdk";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const tokenCache = new TokenCache(async () => {
  const session = await getSession();
  return session?.accessToken ?? null;
});

const apiClient = createApiClient({
  baseURL: API_URL,
  getToken: () => tokenCache.get(),
  timeout: 30000,
  onUnauthorized: () => {
    tokenCache.clear();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
});

export default apiClient;
