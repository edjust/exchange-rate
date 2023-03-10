import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';

@Injectable()
export class SqsProducerService {
  private sqs = new SQS({
    region: '<your AWS region>',
    accessKeyId: '<your AWS access key ID>',
    secretAccessKey: '<your AWS secret access key>',
  });
  private readonly queueUrl: '';

  async sendMessage(messageBody: string): Promise<void> {
    const params = {
      MessageBody: messageBody,
      QueueUrl: this.queueUrl,
    };
    console.log('SQS Message: ', params);
    // await this.sqs.sendMessage(params).promise();
  }
}
