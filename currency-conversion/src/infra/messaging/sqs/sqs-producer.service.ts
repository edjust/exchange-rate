import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';

@Injectable()
export class SqsProducerService {
  private sqs = new SQS({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  private readonly queueUrl = process.env.AWS_QUEUE_URL || '';

  async sendMessage(messageBody: string): Promise<void> {
    const params = {
      MessageBody: messageBody,
      QueueUrl: this.queueUrl,
    };
    console.log('SQS Producer Message: ', params);
    // await this.sqs.sendMessage(params).promise();
  }
}
