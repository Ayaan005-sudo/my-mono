import z from "zod";


export const CreateBookingSchema = z.object({
  scheduleId: z
    .string()
    .min(1, "Schedule ID is required")
    .openapi({
      example: "schedule_123",
    }),

  adultCount: z
    .number()
    .int()
    .min(1, "At least one adult is required")
    .openapi({
      example: 2,
    }),

  childCount: z
    .number()
    .int()
    .min(0)
    .default(0)
    .openapi({
      example: 1,
    }),
});


export const BookingIdParamSchema = z.object({
  bookingId: z
    .string()
    .min(1, "Booking ID is required")
    .openapi({
      example:
        "01a0c996-ea06-7706-b4eb-2834a5889a13",
    }),
});