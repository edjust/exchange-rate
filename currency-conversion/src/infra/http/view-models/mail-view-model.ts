import { CurrencyConversionBody } from '../dtos/currency-conversion';

export class MailViewModel {
  static toEmail(response: CurrencyConversionBody) {
    const { user, amount, fromCurrency, toCurrency, convertedAmount } =
      response;

    return {
      name: user.name,
      email: user.email,
      amount,
      fromCurrency,
      toCurrency,
      convertedAmount,
    };
  }
}
