import { SQS } from 'aws-sdk';
import { CurrencyConversionBody } from '../../http/dtos/CurrencyConversion';

export class SqsProducerService {
  private sqs = new SQS({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  private readonly queueUrl = process.env.AWS_QUEUE_URL || '';

  async enqueue(
    messageBody: CurrencyConversionBody,
  ): Promise<SQS.SendMessageResult | Error> {
    if (!this.queueUrl) {
      throw new Error('SQS Queue URL not specified');
    }
    const params = {
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: this.queueUrl,
    };
    console.log('SQS Message: ', params);
    try {
      const result = await this.sqs.sendMessage(params).promise();
      console.log('SQS Result: ', result);
      return result;
    } catch (err) {
      console.log('SQS Error: ', err);
      return new Error('Failed to send message to SQS');
    }
  }
}
