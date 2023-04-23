import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { RedisService } from 'src/infra/cache/redis/redis.service';
import { SqsProducerService } from 'src/infra/messaging/sqs/sqs-producer.service';
import { CurrencyConversionBody } from 'src/infra/http/dtos/currency-conversion';

@Injectable()
export class GetExchangeRate {
  constructor(
    private readonly sqsProducerService: SqsProducerService,
    private readonly redisService: RedisService,
  ) {}
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
    let convertedAmount = await this.redisService.recover<string>(cacheKey);

    if (convertedAmount) {
      await this.sqsProducerService.sendMessage(
        JSON.stringify(convertedAmount),
      );
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
        await this.redisService.save(cacheKey, convertedAmount);
        const message = {
          user,
          amount,
          fromCurrency,
          toCurrency,
          convertedAmount,
        } as CurrencyConversionBody;
        await this.sqsProducerService.sendMessage(JSON.stringify(message));
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
