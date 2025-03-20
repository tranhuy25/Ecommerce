import { SpecificPaymentInputs } from './dtos/combined_payment.input';

export interface ProcessPaymentsInput {
  amount: number;
  currency: string;
  payments: SpecificPaymentInputs[];
}
