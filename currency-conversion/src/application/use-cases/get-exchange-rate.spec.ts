import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetExchangeRate } from './get-exchange-rate';

describe('Get Exchange Rate', () => {
  let getExchangeRate: GetExchangeRate;

  beforeEach(async () => {
    process.env.API_KEY = 'test-api-key';

    jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.resolve({
        data: {
          base: 'USD',
          rates: {
            BRL: 5,
          },
        },
      });
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [GetExchangeRate],
    }).compile();

    getExchangeRate = module.get<GetExchangeRate>(GetExchangeRate);
  });

  it('should be defined getExchangeRate', () => {
    expect(getExchangeRate).toBeDefined();
  });

  it('should throw an error if amount, fromCurrency or toCurrency are missing', async () => {
    await expect(
      getExchangeRate.execute(null, 'USD', 'BRL'),
    ).rejects.toThrowError(
      new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid input parameters',
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should throw an error if API key is missing', async () => {
    process.env.API_KEY = null;

    await expect(
      getExchangeRate.execute(null, 'USD', 'BRL'),
    ).rejects.toThrowError(
      new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid API Key',
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should return converted amount if all parameters are valid', async () => {
    const convertedAmount = await getExchangeRate.execute(1000, 'USD', 'BRL');
    expect(convertedAmount).toBe(5000);
  });

  it('should throw an error if exchange rate is not found', async () => {
    await expect(
      getExchangeRate.execute(1000, 'USD', 'EUR'),
    ).rejects.toThrowError(
      new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Invalid input parameters',
        },
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should throw an error if an unknown error occurs', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue({});

    await expect(
      getExchangeRate.execute(1000, 'USD', 'BRL'),
    ).rejects.toThrowError(
      new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
