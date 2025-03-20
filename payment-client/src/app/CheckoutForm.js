import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [voucherRef, setVoucherRef] = useState("");

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the ConfirmationToken using the details collected by the Payment Element
    // and additional shipping information
    const { error, confirmationToken } = await stripe.createConfirmationToken({
      elements,
      params: {
        shipping: {
          name: "Jenny Rosen",
          address: {
            line1: "1234 Main Street",
            city: "San Francisco",
            state: "CA",
            country: "US",
            postal_code: "94111",
          },
        },
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // creating the ConfirmationToken. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
      return;
    }

    // Reference for Stripe's testing cards -> https://docs.stripe.com/testing#cards
    const paymmentPayload = {
      amount: 100,
      currency: "USD",
      payments: [
        {
          paymentType: "CARD",
          processorType: "CARD_STRIPE",
          amount: 100,
          currency: "USD",
          confirmationTokenId: confirmationToken.id,
        },
      ],
    };

    if (voucherRef) {
      paymmentPayload.amount = 120;
      paymmentPayload.payments.push({
        paymentType: "VOUCHER",
        processorType: "CUSTOM_VOUCHER",
        amount: 20,
        currency: "USD",
        voucherRef: voucherRef,
      });
    }

    // Create the PaymentIntent
    const res = await fetch(`http://localhost:3000/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymmentPayload),
    });

    const data = await res.json();

    // Handle any next actions or errors. See the Handle any next actions step for implementation.
    console.log(data);
    // handleServerResponse(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <input
        style={{ margin: "20px 0", padding: "10px 0px", width: "100%" }}
        type="text"
        placeholder="Voucher Reference"
        value={voucherRef}
        onChange={(e) => setVoucherRef(e.target.value)}
      />
      <hr />
      <button type="submit" disabled={!stripe || loading}>
        Submit
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}
