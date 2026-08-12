import Redis from 'ioredis';

export class RedisService {
  private redis: Redis | null = null;
  private isConnected = false;

  constructor() {
    const rawUrl = process.env.REDIS_URL || '';
    if (rawUrl) {
      try {
        const match = rawUrl.match(/rediss?:\/\/[^\s"'\n]+/);
        let cleanUrl = match ? match[0] : rawUrl;
        const isTls = rawUrl.includes('--tls') || cleanUrl.startsWith('rediss://') || cleanUrl.includes('upstash.io');
        if (isTls && cleanUrl.startsWith('redis://')) {
          cleanUrl = cleanUrl.replace('redis://', 'rediss://');
        }

        this.redis = new Redis(cleanUrl, {
          tls: isTls ? { rejectUnauthorized: false } : undefined,
          maxRetriesPerRequest: 2,
          connectTimeout: 5000,
          lazyConnect: true,
        });

        this.redis.connect().then(() => {
          this.isConnected = true;
          console.log('[RedisService] Connecté à Redis avec succès.');
        }).catch((err) => {
          console.warn('[RedisService] Connexion Redis échouée:', err?.message);
        });

        this.redis.on('error', (err) => {
          this.isConnected = false;
          console.warn('[RedisService] Erreur Redis:', err?.message);
        });
      } catch (err: any) {
        console.warn('[RedisService] Initialisation Redis ignorée:', err?.message);
      }
    }
  }

  public getStatus() {
    return {
      active: this.isConnected,
      hasUrl: !!process.env.REDIS_URL,
    };
  }

  public async getJson<T>(key: string): Promise<T | null> {
    if (!this.redis || !this.isConnected) return null;
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public async setJson<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    if (!this.redis || !this.isConnected) return;
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (e: any) {
      console.warn('[RedisService] Erreur setJson:', e?.message);
    }
  }

  public async del(key: string | string[]): Promise<void> {
    if (!this.redis || !this.isConnected) return;
    try {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.length > 0) await this.redis.del(...keys);
    } catch (e: any) {
      console.warn('[RedisService] Erreur del:', e?.message);
    }
  }

  public async invalidatePattern(pattern: string): Promise<void> {
    if (!this.redis || !this.isConnected) return;
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) await this.redis.del(...keys);
    } catch (e: any) {
      console.warn('[RedisService] Erreur invalidatePattern:', e?.message);
    }
  }
}

export const redisService = new RedisService();
