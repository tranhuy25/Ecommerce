import { CustomVoucherPaymentInput } from '../custom-voucher/dto/custom-voucher-payment.input';
import { StripePaymentInput } from '../stripe/dto/stripe-payment.input';

export type SpecificPaymentInputs = StripePaymentInput | CustomVoucherPaymentInput;
