import { Request, Response } from 'express';
import { SqsProducerService } from '../../messaging/sqs/SQSProducerService';
import { CurrencyConversionBody } from '../dtos/CurrencyConversion';
export class CurrencyConversionController {
  async convert(request: Request, response: Response) {
    const { user, amount, fromCurrency, toCurrency } =
      request.body as CurrencyConversionBody;
    const params = {
      user,
      amount,
      fromCurrency,
      toCurrency,
    };
    const sqsProducerService = new SqsProducerService();
    const result = await sqsProducerService.enqueue(params);
    return response.json(result);
  }
}
