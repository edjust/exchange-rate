import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { GetExchangeRate } from './application/use-cases/get-exchange-rate';
import { SqsConsumerService } from './infra/messaging/sqs/sqs-consumer.service';
import { SqsProducerService } from './infra/messaging/sqs/sqs-producer.service';
import { CacheModule } from './infra/cache/cache.module';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [GetExchangeRate, SqsConsumerService, SqsProducerService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly sqsConsumerService: SqsConsumerService) {}

  async onApplicationBootstrap() {
    await this.sqsConsumerService.receiveMessage();
  }
}
