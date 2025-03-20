import { Injectable } from '@nestjs/common';

import { Logger, LoggerService } from '@app/logger';
import { PaymentLogStatus } from '@components/checkout/payment-log/payment-log-status.enum';

import { PaymentLog } from '../../payment-log/payment-log.entity';
import { PaymentLogService } from '../../payment-log/payment-log.service';
import { PaymentData, PaymentInput, PaymentTransactionFailedResult, PaymentTransactionResult } from '../payment-processor.interfaces';

@Injectable()
export abstract class PaymentProcessor<Input extends PaymentInput = PaymentInput> {
  protected readonly logger: Logger;

  protected constructor(
    protected readonly loggerService: LoggerService,
    protected readonly paymentLogService: PaymentLogService,
  ) {
    this.logger = this.loggerService.getLogger(PaymentProcessor.name);
  }

  protected abstract _pay(paymentData: PaymentData, paymentInput: Input): Promise<PaymentTransactionResult>;

  async pay(paymentData: PaymentData, paymentInput: Input): Promise<PaymentLog> {
    const paymentLogData = new PaymentLog({
      amount: paymentInput.amount,
      paymentType: paymentData.type,
      input: paymentInput,
      status: PaymentLogStatus.PENDING,
      checkoutId: paymentData.checkoutId,
    });

    const paymentLog = await this.paymentLogService.create(paymentLogData);

    return this._payAndUpdateLog(paymentLog, paymentData);
  }

  private async _payAndUpdateLog(paymentLog: PaymentLog, paymentData: PaymentData): Promise<PaymentLog> {
    try {
      const { result } = await this._pay(paymentData, paymentLog.input as Input);

      return this.paymentLogService.update(paymentLog, {
        status: PaymentLogStatus.COMPLETED_SUCCESSFULLY,
        processedDate: new Date(),
        result,
      });
    } catch (err) {
      const result = err instanceof Error ? err.message : err;
      return this.paymentLogService.update(paymentLog, {
        status: PaymentLogStatus.FAILED,
        processedDate: new Date(),
        result,
      });
    }
  }

  protected abstract _refund(paymentLog: PaymentLog): Promise<PaymentTransactionFailedResult>;

  async refund(paymentLog: PaymentLog): Promise<PaymentLog> {
    try {
      const { message } = await this._refund(paymentLog);

      return await this.paymentLogService.update(paymentLog, {
        status: PaymentLogStatus.REFUNDED,
        refundResult: message,
      });
    } catch (err) {
      const result = err instanceof Error ? err.message : err;
      this.logger.error(`Error refunding payment ${paymentLog.id}`, result);

      return await this.paymentLogService.update(paymentLog, {
        status: PaymentLogStatus.FAILED_REFUND,
        refundResult: result,
      });
    }
  }
}
