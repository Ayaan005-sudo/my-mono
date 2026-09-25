import { createBooking, findScheduleForBooking } from "../repositories/booking.repository.js";
import type { CreateBookingInput, CreateBookingResponse } from "../types/booking.js";
import { CustomError } from "../utils/custom-error.js";




export const createBookingService = async (
  userId: string,
  input: CreateBookingInput,
): Promise<CreateBookingResponse> => {
  const schedule = await findScheduleForBooking(
    input.scheduleId,
  );

  if (!schedule) {
    throw new CustomError(
      "Package schedule not found",
      404,
    );
  }

  if (
    schedule.package.status !== "PUBLISHED" ||
    schedule.package.visibility !== "PUBLIC"
  ) {
    throw new CustomError(
      "Package is not available for booking",
      400,
    );
  }

  if (schedule.status !== "OPEN") {
    throw new CustomError(
      "This schedule is not open for booking",
      400,
    );
  }

  const now = new Date();

  if (
    schedule.bookingStartDate &&
    now < schedule.bookingStartDate
  ) {
    throw new CustomError(
      "Booking has not started yet",
      400,
    );
  }

  if (
    schedule.bookingEndDate &&
    now > schedule.bookingEndDate
  ) {
    throw new CustomError(
      "Booking has already closed",
      400,
    );
  }

  if (schedule.startDate <= now) {
    throw new CustomError(
      "This schedule has already started",
      400,
    );
  }

  const totalParticipants =
    input.adultCount + input.childCount;

  if (
    totalParticipants > schedule.availableSeats
  ) {
    throw new CustomError(
      `Only ${schedule.availableSeats} seats are available`,
      400,
    );
  }

  let subtotal: number;

 
  if (schedule.price !== null) {
    subtotal =
      totalParticipants * schedule.price;
  }

 
  else if (
    schedule.adultPrice !== null &&
    schedule.childPrice !== null
  ) {
    subtotal =
      input.adultCount * schedule.adultPrice +
      input.childCount * schedule.childPrice;
  } else {
    throw new CustomError(
      "Valid pricing is not configured for this schedule",
      400,
    );
  }

 
  const discountAmount = 0;
  const bookingFee = 0;

  const totalAmount =
    subtotal - discountAmount + bookingFee;

  const balanceDueDate: Date | null = null;

  return createBooking({
    userId,
    input,
    subtotal,
    discountAmount,
    bookingFee,
    totalAmount,
    currency: schedule.currency,
    balanceDueDate,
  });
};
