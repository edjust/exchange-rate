export interface CurrencyConversionBody {
  user: {
    name: string;
    email: string;
  };
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount?: string;
}
