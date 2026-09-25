import z from "zod";


export const CreatePaymentOrderSchema = z.object({
  bookingId: z
    .string()
    .min(1, "Booking ID is required")
    .openapi({
      example: "01a0c996-ea06-7706-b4eb-2834a5889a13",
    }),

  paymentType: z
    .enum(["FULL", "DEPOSIT"])
    .openapi({
      example: "DEPOSIT",
    }),
});


export const VerifyPaymentSchema = z.object({
  paymentId: z
    .string()
    .min(1, "Payment ID is required")
    .openapi({
      example: "01a0c996-ea06-7706-b4eb-2834a5889a13",
    }),

  razorpayPaymentId: z
    .string()
    .min(1, "Razorpay payment ID is required")
    .openapi({
      example: "pay_Qxxxxxxxxxxxxx",
    }),

  razorpayOrderId: z
    .string()
    .min(1, "Razorpay order ID is required")
    .openapi({
      example: "order_Qxxxxxxxxxxxxx",
    }),

  razorpaySignature: z
    .string()
    .min(1, "Razorpay signature is required")
    .openapi({
      example: "xxxxxxxxxxxxxxxxxxxxxxxx",
    }),
});