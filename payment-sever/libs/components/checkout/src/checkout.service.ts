import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Logger, LoggerService } from '@app/logger';

import { Checkout } from './checkout.entity';
import { ProcessPaymentsInput } from './checkout.interfaces';
import { SpecificPaymentInputs } from './dtos/combined_payment.input';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentProcessorsService } from './payment-processors/payment-processors.service';
import { PaymentLog } from './payment-log/payment-log.entity';
import { PaymentLogStatus } from './payment-log/payment-log-status.enum';

@Injectable()
export class CheckoutService {
  private logger: Logger;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly paymentProcessorsService: PaymentProcessorsService,
    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,
  ) {
    this.logger = this.loggerService.getLogger(CheckoutService.name);
  }

  async processPayments(processPaymentsInput: ProcessPaymentsInput) {
    const paymentInputs = processPaymentsInput.payments;

    const paymentData = new Checkout({
      amount: processPaymentsInput.amount,
      currency: processPaymentsInput.currency,
      status: PaymentStatus.INITIALIZED,
      input: processPaymentsInput,
    });

    const checkout = await this._createCheckout(paymentData);

    const results = await Promise.all(paymentInputs.map(paymentInput => this._processOnePayment(checkout, paymentInput)));
    const failedPayments = results.filter(payment => payment.status === PaymentLogStatus.FAILED);
    const successfulPayment = results.filter(payment => payment.status === PaymentLogStatus.COMPLETED_SUCCESSFULLY);

    if (failedPayments.length > 0) {
      checkout.status = PaymentStatus.FAILED_PAYMENT;
      await this.checkoutRepository.save(checkout);
      await this._processRefundForSuccessfulPayments(checkout, successfulPayment);

      this.logger.error('one or more payments failed');
      throw new Error('One or more payments failed');
    }

    checkout.status = PaymentStatus.COMPLETED;
    await this.checkoutRepository.save(checkout);

    return checkout;
  }

  private async _processRefundForSuccessfulPayments(checkout: Checkout, successfulPayments: PaymentLog[]) {
    const results = await Promise.all(successfulPayments.map(payment => this._processOneRefund(payment)));
    const failedPayments = results.filter(payment => payment.status === PaymentLogStatus.FAILED);

    if (failedPayments.length > 0) {
      checkout.status = PaymentStatus.FAILED_REFUND;
      await this.checkoutRepository.save(checkout);

      this.logger.error('Error requesting refund for one or more payments');
      throw new Error('Error requesting refund for one or more payments');
    }

    checkout.status = PaymentStatus.REFUNDED;
    await this.checkoutRepository.save(checkout);
  }

  private async _processOneRefund(paymentLog: PaymentLog): Promise<PaymentLog> {
    const {
      input: { processorType, paymentType },
    } = paymentLog;

    const paymentProcessor = this.paymentProcessorsService.getProcessor(paymentType, processorType);

    return await paymentProcessor.refund(paymentLog);
  }

  private async _processOnePayment(checkout: Checkout, paymentInput: SpecificPaymentInputs) {
    const { paymentType, processorType } = paymentInput;

    const paymentProcessor = this.paymentProcessorsService.getProcessor(paymentType, processorType);

    const paymentData = {
      type: paymentType,
      checkoutId: checkout.id,
      amount: checkout.amount,
    };

    const paymentLog = await paymentProcessor.pay(paymentData, paymentInput);

    return paymentLog;
  }

  private async _createCheckout(payment: Checkout) {
    return this.checkoutRepository.save(payment);
  }
}
