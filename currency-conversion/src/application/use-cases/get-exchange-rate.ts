import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GetExchangeRate {
  private readonly apiURL = 'https://openexchangerates.org/api/latest.json';
  private readonly apiKey = process.env.API_KEY;

  async execute(amount: number, fromCurrency: string, toCurrency: string) {
    try {
      const url = `${this.apiURL}?app_id=${this.apiKey}&base=${fromCurrency}`;
      const { data } = await axios.get(url);
      const exchangeRates = data.rates;
      const exchangeRate = exchangeRates[toCurrency];
      if (!exchangeRate) {
        throw new Error(`Exchange rate not found for ${toCurrency}`);
      }
      const convertedAmount = amount * exchangeRate;
      return convertedAmount;
    } catch (err) {
      console.log(err.response.data);
      const { status, description } = err.response.data;
      throw new HttpException(
        {
          status,
          error: description,
        },
        status,
      );
    }
  }
}
