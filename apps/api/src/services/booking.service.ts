import { createBooking, findBookingDetailById, findScheduleForBooking } from "../repositories/booking.repository.js";
import type { CreateBookingInput, CreateBookingResponse, GetBookingDetailResponse } from "../types/booking.js";
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


export const getBookingDetailService = async (
  userId: string,
  bookingId: string,
): Promise<GetBookingDetailResponse> => {
  const booking =
    await findBookingDetailById(bookingId);

  if (!booking) {
    throw new CustomError(
      "Booking not found",
      404,
    );
  }

  if (booking.userId !== userId) {
    throw new CustomError(
      "You are not authorized to view this booking",
      403,
    );
  }

  const userName =
    booking.user.name?.trim() ?? "";

  const nameParts = userName
    ? userName.split(/\s+/)
    : [];

  const fallbackFirstName =
    nameParts.length > 0
      ? nameParts[0]
      : null;

  const fallbackLastName =
    nameParts.length > 1
      ? nameParts.slice(1).join(" ")
      : null;

  return {
    id: booking.id,
    status: booking.status,

    personalInfo: {
      // Booking snapshot always wins once saved.
      firstName:
        booking.firstName ??
        fallbackFirstName,

      lastName:
        booking.lastName ??
        fallbackLastName,

      email:
        booking.email ??
        booking.user.email ??
        null,

      phone:
        booking.phone ??
        booking.user.phone ??
        null,

      address:
        booking.address ?? null,

      city:
        booking.city ??
        booking.user.city ??
        null,

      state:
        booking.state ??
        booking.user.state ??
        null,

      country:
        booking.country ??
        booking.user.country ??
        null,

      pinCode:
        booking.pinCode ?? null,

      message:
        booking.message ?? null,
    },

    orderSummary: {
      packageId:
        booking.schedule.package.id,

      packageTitle:
        booking.schedule.package.title ??
        booking.schedule.package.masterTrek.name,

      trekLeader: {
        id:
          booking.schedule.package.createdBy.id,

        name:
          booking.schedule.package.createdBy.name,

        avatarUrl:
          booking.schedule.package.createdBy.avatarUrl,
      },

      scheduleId:
        booking.schedule.id,

      startDate:
        booking.schedule.startDate,

      endDate:
        booking.schedule.endDate,

      adultCount:
        booking.adultCount,

      childCount:
        booking.childCount,

      subtotal:
        booking.subtotal,

      discountAmount:
        booking.discountAmount,

      bookingFee:
        booking.bookingFee,

      totalAmount:
        booking.totalAmount,

      currency:
        booking.currency,

      cancellationPolicy:
        booking.schedule.cancellationPolicy,
    },
  };
};
