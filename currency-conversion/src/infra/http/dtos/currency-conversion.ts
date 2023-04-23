export interface CurrencyConversionBody {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  user: {
    name: string;
    email: string;
  };
  convertedAmount?: string;
}
