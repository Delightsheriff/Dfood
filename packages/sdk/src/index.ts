import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export type ApiClientOptions = {
  baseURL: string;
  getToken: () => Promise<string | null>;
  onUnauthorized?: () => void | Promise<void>;
  timeout?: number;
};

export function createApiClient({
  baseURL,
  getToken,
  onUnauthorized,
  timeout = 30000,
}: ApiClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        onUnauthorized?.();
      }
      return Promise.reject(error);
    },
  );

  return client;
}

export class TokenCache {
  private token: string | null = null;
  private promise: Promise<string | null> | null = null;

  constructor(private fetcher: () => Promise<string | null>) {}

  async get(): Promise<string | null> {
    if (this.token) return this.token;
    if (this.promise) return this.promise;

    this.promise = this.fetcher()
      .then((t) => {
        this.token = t;
        this.promise = null;
        return t;
      })
      .catch((err) => {
        this.promise = null;
        throw err;
      });

    return this.promise;
  }

  clear(): void {
    this.token = null;
    this.promise = null;
  }
}
