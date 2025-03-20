"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51OqiBPEDkJqO4VZBx36mLIZuyhAYCkeY8H9YzJOpDJ7iE5NKDGKcWi5KoWiM4UkByYj2gzLMPbjgYuJ6nHPRm97G00vhbDIOmW"
);
export default function Home() {
  const options = {
    mode: "payment",
    amount: 120,
    currency: "usd",
    paymentMethodCreation: "manual",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
