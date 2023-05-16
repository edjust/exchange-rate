import { Controller, Post, Body } from '@nestjs/common';
import { GetExchangeRate } from '../../../application/use-cases/get-exchange-rate';
import { CurrencyConversionBody } from '../dtos/currency-conversion';

@Controller('exchange')
export class ExchangeRateController {
  constructor(private readonly getExchangeRate: GetExchangeRate) {}

  @Post('convert')
  async convertCurrency(@Body() body: CurrencyConversionBody) {
    const { user, amount, fromCurrency, toCurrency } = body;
    const convertedAmount = await this.getExchangeRate.execute({
      user,
      amount,
      fromCurrency,
      toCurrency,
    });
    return { convertedAmount };
  }
}
