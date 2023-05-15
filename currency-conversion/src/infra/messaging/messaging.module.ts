import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { SqsConsumerService } from './sqs/sqs-consumer.service';
import { SqsProducerService } from './sqs/sqs-producer.service';
import { GetExchangeRate } from 'src/application/use-cases/get-exchange-rate';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [SqsConsumerService, SqsProducerService, GetExchangeRate],
})
export class MessagingModule implements OnApplicationBootstrap {
  constructor(private readonly consumerService: SqsConsumerService) {}

  async onApplicationBootstrap() {
    await this.consumerService.receiveMessage();
  }
}
