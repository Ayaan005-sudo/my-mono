import type { CreateBookingSchema } from "../validators/booking.validator.js";
import type { z } from "zod";


export type CreateBookingInput =
  z.infer<typeof CreateBookingSchema>;

  export type CreateBookingResponse = {
  id: string;
  scheduleId: string;

  adultCount: number;
  childCount: number;

  subtotal: number;
  discountAmount: number;
  bookingFee: number;
  totalAmount: number;

  currency: string;
  balanceDueDate: Date | null;

  status: string;
  bookedAt: Date;
};

export type CreateBookingRepoInput = {
  userId: string;
  input: CreateBookingInput;
  subtotal: number;
  discountAmount: number;
  bookingFee: number;
  totalAmount: number;
  currency: string;
  balanceDueDate: Date | null;
};

