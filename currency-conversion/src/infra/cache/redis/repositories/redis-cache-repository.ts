import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';
import { CacheRepository } from 'src/infra/repositories/cache-repository';

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  private readonly client: RedisClient;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async save(key: string, value: any): Promise<void> {
    console.log('SAVE');
    await this.client.set(key, JSON.stringify(value), 'EX', 60);
  }

  async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }
    console.log('RECOVER');
    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }

  async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);
    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
