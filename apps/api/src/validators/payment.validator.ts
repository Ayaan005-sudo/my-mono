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