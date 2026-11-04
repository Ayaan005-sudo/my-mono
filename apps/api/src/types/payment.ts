import type z from "zod";
import type { CreatePaymentOrderSchema, VerifyPaymentSchema } from "../validators/payment.validator.js";


export type CreatePaymentOrderInput =
  z.infer<typeof CreatePaymentOrderSchema>;

export type CreatePaymentOrderResponse = {
  paymentId: string;
  bookingId: string;

  paymentType: "FULL" | "DEPOSIT";

  amount: number;
  currency: string;

  razorpayOrderId: string;
  razorpayKeyId: string;
};

export type VerifyPaymentInput =
  z.infer<typeof VerifyPaymentSchema>;

export type VerifyPaymentResponse = {
  paymentId: string;
  bookingId: string;

  paymentType:
    | "FULL"
    | "DEPOSIT"
    | "BALANCE";

  amount: number;
  currency: string;

  paymentStatus: "SUCCESS";
  bookingStatus: "CONFIRMED";

  razorpayPaymentId: string;

  paidAt: Date;
};
