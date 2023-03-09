import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExchangeRateService {
  private readonly apiURL = 'https://openexchangerates.org/api/latest.json';
  private readonly apiKey = process.env.API_KEY;

  async getExchangeRate(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ) {
    try {
      const url = `${this.apiURL}?app_id=${this.apiKey}&base=${fromCurrency}`;
      const { data } = await axios.get(url);
      const exchangeRates = data.rates;
      const exchangeRate = exchangeRates[toCurrency];
      const convertedAmount = amount * exchangeRate;
      return convertedAmount;
    } catch (err) {
      console.log(err);
    }
  }
}
