import { Module } from '@nestjs/common';
import { CacheRepository } from '../repositories/cache-repository';
import { RedisCacheRepository } from './redis/repositories/redis-cache-repository';

@Module({
  providers: [
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
