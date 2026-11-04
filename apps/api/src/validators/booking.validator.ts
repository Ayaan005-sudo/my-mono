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

export const UpdateBookingContactInfoSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100)
    .openapi({
      example: "Ayaan",
    }),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100)
    .openapi({
      example: "Ahmed",
    }),

  email: z
    .string()
    .trim()
    .email("Valid email is required")
    .openapi({
      example: "itseditz786@gmail.com",
    }),

  phone: z
    .string()
    .trim()
    .min(7, "Valid phone number is required")
    .max(20)
    .openapi({
      example: "8967451234",
    }),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(500)
    .openapi({
      example: "246 Painter Colony",
    }),

  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100)
    .openapi({
      example: "Jaipur",
    }),

  state: z
    .string()
    .trim()
    .min(1, "State is required")
    .max(100)
    .openapi({
      example: "Rajasthan",
    }),

  country: z
    .string()
    .trim()
    .min(1, "Country is required")
    .max(100)
    .openapi({
      example: "India",
    }),

  pinCode: z
    .string()
    .trim()
    .min(1, "Pin code is required")
    .max(20)
    .openapi({
      example: "302016",
    }),

  message: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .openapi({
      example: "Please contact me before departure.",
    }),
});

