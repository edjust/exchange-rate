import { Controller, Get, Param } from '@nestjs/common';
import { ExchangeRateService } from '../../../application/use-cases/get-exchange-rate';

@Controller('exchange')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get('convert/:amount/:fromCurrency/:toCurrency')
  async convertCurrency(
    @Param('amount') amount: number,
    @Param('fromCurrency') fromCurrency: string,
    @Param('toCurrency') toCurrency: string,
  ) {
    const convertedAmount = await this.exchangeRateService.getExchangeRate(
      amount,
      fromCurrency,
      toCurrency,
    );
    const message = { amount, fromCurrency, toCurrency, convertedAmount };
    return message;
  }
}
