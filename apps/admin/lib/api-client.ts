import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

// API base URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token cache to avoid repeated session reads
let tokenCache: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

/**
 * Get auth token with caching and deduplication
 */
async function getAuthToken(): Promise<string | null> {
  // Return cached token if available
  if (tokenCache) {
    return tokenCache;
  }

  // Deduplicate concurrent requests
  if (tokenPromise) {
    return tokenPromise;
  }

  tokenPromise = (async () => {
    try {
      const session = await getSession();
      const token = session?.accessToken ?? null;

      // Cache the token
      if (token) {
        tokenCache = token;
      }

      return token;
    } catch (error) {
      console.error("Failed to get session:", error);
      return null;
    } finally {
      tokenPromise = null;
    }
  })();

  return tokenPromise;
}

/**
 * Clear token cache (call on logout)
 */
export function clearTokenCache() {
  tokenCache = null;
  tokenPromise = null;
}

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token cache
      clearTokenCache();

      // Redirect to login if in browser
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error - check if backend is running");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
