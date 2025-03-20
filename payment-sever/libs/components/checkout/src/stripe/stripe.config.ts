import { registerAs } from '@nestjs/config';

export const StripeConfig = registerAs('stripeConfig', () => {
  return {
    apiVersion: process.env.STRIPE_API_VERSION,
    secretKey: process.env.STRIPE_SECRET_KEY,
  };
});
