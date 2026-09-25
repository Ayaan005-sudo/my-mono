import type { CreateBookingSchema, UpdateBookingContactInfoSchema } from "../validators/booking.validator.js";
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

export type GetBookingDetailResponse = {
  id: string;
  status: string;

  personalInfo: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pinCode: string | null;
    message: string | null;
  };

  orderSummary: {
    packageId: string;
    packageTitle: string | null;

    trekLeader: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    };

    scheduleId: string;
    startDate: Date;
    endDate: Date;

    adultCount: number;
    childCount: number;

    subtotal: number;
    discountAmount: number;
    bookingFee: number;
    totalAmount: number;
    currency: string;

    cancellationPolicy: string | null;
  };
};


export type UpdateBookingContactInfoInput =
  z.infer<typeof UpdateBookingContactInfoSchema>;


  export type UpdateBookingContactInfoResponse = {
  id: string;

  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;

  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pinCode: string | null;

  message: string | null;

  status: string;

  updatedAt: Date;
};


export type GetBookingPaymentOptionsResponse = {
  bookingId: string;

  totalAmount: number;
  currency: string;

  paymentOptions: {
    full: {
      available: true;
      amount: number;
    };

    deposit: {
      available: boolean;
      amount: number | null;
      remainingAmount: number | null;
      balanceDueDate: Date | null;
    };
  };
};