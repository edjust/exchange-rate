import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { CacheModule } from './infra/cache/cache.module';
import { MessagingModule } from './infra/messaging/messaging.module';

@Module({
  imports: [HttpModule, CacheModule, MessagingModule],
})
export class AppModule {}
