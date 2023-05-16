import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CurrencyConversionBody } from 'src/infra/http/dtos/currency-conversion';
import { CacheRepository } from 'src/infra/repositories/cache-repository';

@Injectable()
export class GetExchangeRate {
  constructor(private readonly cacheRepository: CacheRepository) {}
  private readonly apiURL = 'https://openexchangerates.org/api/latest.json';
  private readonly apiKey = process.env.API_KEY;

  async execute({
    user,
    amount,
    fromCurrency,
    toCurrency,
  }: CurrencyConversionBody) {
    if (!user || !amount || !fromCurrency || !toCurrency) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid input parameters',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const cacheKey = `${fromCurrency}_${toCurrency}`;
    let convertedAmount = await this.cacheRepository.recover<string>(cacheKey);

    if (convertedAmount) {
      return convertedAmount;
    } else {
      if (!this.apiKey) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Invalid API Key',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const url = `${this.apiURL}?app_id=${this.apiKey}&base=${fromCurrency}`;
      try {
        const { data } = await axios.get(url);
        const exchangeRates = data.rates;
        const exchangeRate = exchangeRates[toCurrency];
        if (!exchangeRate) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: `Exchange rate not found for ${toCurrency}`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
        convertedAmount = (parseFloat(amount) * exchangeRate).toString();
        await this.cacheRepository.save(cacheKey, convertedAmount);
        return convertedAmount;
      } catch (err) {
        if (err.response && err.response.data) {
          const { status, description } = err.response.data;
          throw new HttpException(
            {
              status,
              error: description || 'Unknown error',
            },
            status,
          );
        } else {
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: 'Unknown error',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
  }
}
