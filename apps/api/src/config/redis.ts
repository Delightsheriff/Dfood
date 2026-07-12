import { Redis } from "@upstash/redis";
import { env } from "./env";

class RedisClient {
  private client: Redis | null = null;

  async connect(): Promise<void> {
    try {
      const url = new URL(env.REDIS_URL!);

      this.client = new Redis({
        url: `https://${url.hostname}`,
        token: url.password,
      });

      const result = await this.client.ping();
      console.log("✅ Redis connected via REST:", result);
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      this.client = null;
    }
  }

  getClient(): Redis | null {
    return this.client;
  }

  isReady(): boolean {
    return this.client !== null;
  }

  async disconnect(): Promise<void> {
    this.client = null;
  }
}

export const redisClient = new RedisClient();
