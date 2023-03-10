import { Controller, Get, Param } from '@nestjs/common';
import { GetExchangeRate } from '../../../application/use-cases/get-exchange-rate';
import { SqsProducerService } from 'src/infra/messaging/sqs/sqs-producer.service';

@Controller('exchange')
export class ExchangeRateController {
  constructor(
    private readonly getExchangeRate: GetExchangeRate,
    private readonly sqsProducerService: SqsProducerService,
  ) {}

  @Get('convert/:amount/:fromCurrency/:toCurrency')
  async convertCurrency(
    @Param('amount') amount: number,
    @Param('fromCurrency') fromCurrency: string,
    @Param('toCurrency') toCurrency: string,
  ) {
    const convertedAmount = await this.getExchangeRate.execute(
      amount,
      fromCurrency,
      toCurrency,
    );
    const message = { amount, fromCurrency, toCurrency, convertedAmount };
    await this.sqsProducerService.sendMessage(JSON.stringify(message));
    return message;
  }
}
