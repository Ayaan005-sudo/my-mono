import type z from "zod";
import type { CreatePaymentOrderSchema } from "../validators/payment.validator.js";


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