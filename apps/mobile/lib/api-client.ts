import { createApiClient } from "@dfood/sdk";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const API_URL = __DEV__
  ? (process.env.EXPO_PUBLIC_API_URL ??
    (Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://localhost:3000"))
  : (process.env.EXPO_PUBLIC_API_URL ?? "https://your-production-api.com");

export const SECURE_STORE_KEYS = {
  AUTH_TOKEN: "auth_token",
} as const;

let inMemoryToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

export const tokenStorage = {
  async save(token: string): Promise<void> {
    inMemoryToken = token;
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.AUTH_TOKEN, token);
  },

  async get(): Promise<string | null> {
    if (inMemoryToken) return inMemoryToken;

    if (!tokenPromise) {
      tokenPromise = SecureStore.getItemAsync(SECURE_STORE_KEYS.AUTH_TOKEN)
        .then((token) => {
          inMemoryToken = token;
          tokenPromise = null;
          return token;
        })
        .catch((err) => {
          tokenPromise = null;
          throw err;
        });
    }

    return tokenPromise;
  },

  async remove(): Promise<void> {
    inMemoryToken = null;
    tokenPromise = null;
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.AUTH_TOKEN);
  },
};

export const apiClient = createApiClient({
  baseURL: API_URL,
  getToken: () => tokenStorage.get(),
  timeout: 10000,
  onUnauthorized: () => tokenStorage.remove(),
});
