import { Request, Response } from 'express';
import { SqsProducerService } from '../../messaging/sqs/SQSProducerService';
import { CurrencyConversionBody } from '../dtos/CurrencyConversion';
export class CurrencyConversionController {
  public async convert(request: Request, response: Response) {
    const { user, amount, fromCurrency, toCurrency } =
      request.body as CurrencyConversionBody;
    const params = {
      amount,
      fromCurrency,
      toCurrency,
      user,
    };
    const sqsProducerService = new SqsProducerService();
    const result = await sqsProducerService.enqueue(params);
    response.send(JSON.stringify(result));
  }
}
