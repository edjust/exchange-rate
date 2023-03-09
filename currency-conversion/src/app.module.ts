import { Module } from '@nestjs/common';
import { ExchangeRateController } from './infra/http/controllers/exchange-rates.controller';
import { ExchangeRateService } from './application/use-cases/get-exchange-rate';

@Module({
  imports: [],
  controllers: [ExchangeRateController],
  providers: [ExchangeRateService],
})
export class AppModule {}
