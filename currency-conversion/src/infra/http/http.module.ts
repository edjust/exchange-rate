import { Module } from '@nestjs/common';
import { ExchangeRateController } from './controllers/exchange-rates.controller';
import { GetExchangeRate } from 'src/application/use-cases/get-exchange-rate';
import { SqsProducerService } from '../messaging/sqs/sqs-producer.service';
import { RedisService } from '../cache/redis/redis.service';

@Module({
  imports: [],
  controllers: [ExchangeRateController],
  providers: [GetExchangeRate, SqsProducerService, RedisService],
})
export class HttpModule {}
