import { Module } from '@nestjs/common';
import { ExchangeRateController } from './controllers/exchange-rates.controller';
import { GetExchangeRate } from 'src/application/use-cases/get-exchange-rate';
import { SqsProducerService } from '../messaging/sqs/sqs-producer.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [ExchangeRateController],
  providers: [GetExchangeRate, SqsProducerService],
})
export class HttpModule {}
