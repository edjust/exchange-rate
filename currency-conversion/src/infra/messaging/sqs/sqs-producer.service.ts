import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { CurrencyConversionBody } from 'src/infra/http/dtos/currency-conversion';
import { MailViewModel } from 'src/infra/http/view-models/mail-view-model';

@Injectable()
export class SqsProducerService {
  private sqs = new SQS({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  private readonly queueUrl = process.env.AWS_QUEUE_URL || '';

  async sendMessage(messageBody: CurrencyConversionBody): Promise<void> {
    const emailResponse = MailViewModel.toEmail(messageBody);
    const params = {
      MessageBody: JSON.stringify(emailResponse),
      QueueUrl: this.queueUrl,
    };
    console.log('SQS Producer Message: ', params);
    // await this.sqs.sendMessage(params).promise();
  }
}
