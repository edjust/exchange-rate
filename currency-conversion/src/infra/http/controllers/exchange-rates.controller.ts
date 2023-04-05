import { Controller, Post, Body } from '@nestjs/common';
import { GetExchangeRate } from '../../../application/use-cases/get-exchange-rate';
import { CurrencyConversionBody } from '../dtos/currency-conversion';

@Controller('exchange')
export class ExchangeRateController {
  constructor(private readonly getExchangeRate: GetExchangeRate) {}

  @Post('convert')
  async convertCurrency(
    @Body() currencyConversionBody: CurrencyConversionBody,
  ) {
    const { user, amount, fromCurrency, toCurrency } = currencyConversionBody;
    const convertedAmount = await this.getExchangeRate.execute({
      user,
      amount,
      fromCurrency,
      toCurrency,
    });
    const message = { user, amount, fromCurrency, toCurrency, convertedAmount };
    return message;
  }
}
