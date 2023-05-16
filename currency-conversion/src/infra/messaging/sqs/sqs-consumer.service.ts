import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { GetExchangeRate } from 'src/application/use-cases/get-exchange-rate';
import { SqsProducerService } from './sqs-producer.service';
import { CurrencyConversionBody } from 'src/infra/http/dtos/currency-conversion';

@Injectable()
export class SqsConsumerService {
  constructor(
    private readonly getExchangeRate: GetExchangeRate,
    private readonly producerService: SqsProducerService,
  ) {}
  private sqs = new SQS({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  private readonly queueUrl = process.env.AWS_QUEUE_URL || '';

  async receiveMessage(): Promise<void> {
    if (!this.queueUrl) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'SQS Queue URL not specified',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('Polling for messages...');
    setInterval(async () => {
      try {
        const { Messages } = await this.sqs
          .receiveMessage({
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 5,
            VisibilityTimeout: 10,
          })
          .promise();

        if (Messages && Messages.length > 0) {
          await this.processMessages(Messages);
        }
      } catch (error) {
        console.error('SQS Error receiving messages:', error);
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Unknown error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }, 1000);
  }

  private async processMessages(messages: SQS.Message[]): Promise<void> {
    for (const message of messages) {
      console.log('SQS Message: ', message);
      try {
        const { user, amount, fromCurrency, toCurrency } = JSON.parse(
          message.Body,
        ) as CurrencyConversionBody;

        const convertedAmount = await this.getExchangeRate.execute({
          user,
          amount,
          fromCurrency,
          toCurrency,
        });

        if (convertedAmount) {
          await this.sqs
            .deleteMessage({
              QueueUrl: this.queueUrl,
              ReceiptHandle: message.ReceiptHandle,
            })
            .promise();

          const messageBody = {
            user,
            amount,
            fromCurrency,
            toCurrency,
            convertedAmount,
          } as CurrencyConversionBody;

          await this.producerService.sendMessage(messageBody);
        }
      } catch (error) {
        console.error('SQS Error processing message:', error);
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
