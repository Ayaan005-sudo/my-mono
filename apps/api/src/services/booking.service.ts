import { createBooking, findBookingDetailById, findBookingForPaymentOptions, findBookingSummaryById, findScheduleForBooking, updateBookingContactInfo } from "../repositories/booking.repository.js";
import type { BookingPaymentDisplayStatus, BookingSummary, CreateBookingInput, CreateBookingResponse, GetBookingDetailResponse, GetBookingPaymentOptionsResponse, UpdateBookingContactInfoInput, UpdateBookingContactInfoResponse } from "../types/booking.js";
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


export const updateBookingContactInfoService = async (
  userId: string,
  bookingId: string,
  input: UpdateBookingContactInfoInput,
): Promise<UpdateBookingContactInfoResponse> => {
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
      "You are not authorized to update this booking",
      403,
    );
  }

  if (booking.status !== "PENDING") {
    throw new CustomError(
      "Only pending bookings can be updated",
      400,
    );
  }

  return updateBookingContactInfo(
    bookingId,
    input,
  );
};


export const getBookingPaymentOptionsService = async (
  userId: string,
  bookingId: string,
): Promise<GetBookingPaymentOptionsResponse> => {
  const booking =
    await findBookingForPaymentOptions(bookingId);

  if (!booking) {
    throw new CustomError(
      "Booking not found",
      404,
    );
  }


  if (booking.userId !== userId) {
    throw new CustomError(
      "You are not authorized to access this booking",
      403,
    );
  }

  
  if (booking.status !== "PENDING") {
    throw new CustomError(
      "Payment options are only available for pending bookings",
      400,
    );
  }

 
  if (
    !booking.firstName ||
    !booking.lastName ||
    !booking.email ||
    !booking.phone ||
    !booking.address ||
    !booking.city ||
    !booking.state ||
    !booking.country ||
    !booking.pinCode
  ) {
    throw new CustomError(
      "Complete booking information before proceeding to payment",
      400,
    );
  }

  const schedule = booking.schedule;
  const now = new Date();

  if (schedule.status !== "OPEN") {
    throw new CustomError(
      "This schedule is not open for booking",
      400,
    );
  }

  if (schedule.startDate <= now) {
    throw new CustomError(
      "This schedule has already started",
      400,
    );
  }

  if (
    schedule.bookingStartDate &&
    now < schedule.bookingStartDate
  ) {
    throw new CustomError(
      "Booking has not opened yet for this schedule",
      400,
    );
  }

  if (
    schedule.bookingEndDate &&
    now > schedule.bookingEndDate
  ) {
    throw new CustomError(
      "Booking has closed for this schedule",
      400,
    );
  }

  if (schedule.availableSeats <= 0) {
    throw new CustomError(
      "No seats are available for this schedule",
      400,
    );
  }

  const totalAmount = booking.totalAmount;

  let depositAvailable = false;
  let depositAmount: number | null = null;
  let remainingAmount: number | null = null;
  let balanceDueDate: Date | null = null;

  if (
    schedule.allowPartialPayment &&
    schedule.depositType &&
    schedule.depositValue !== null &&
    schedule.balanceDueDaysBeforeStart !== null
  ) {
    if (schedule.depositType === "PERCENTAGE") {
      depositAmount =
        (totalAmount * schedule.depositValue) / 100;
    }

    if (schedule.depositType === "FIXED") {
      depositAmount =
        schedule.depositValue;
    }

  
    if (depositAmount !== null) {
      depositAmount =
        Math.round(depositAmount * 100) / 100;
    }

    /*
     * A deposit only makes sense when it is
     * greater than zero AND less than the total.
     */
    if (
      depositAmount !== null &&
      depositAmount > 0 &&
      depositAmount < totalAmount
    ) {
      depositAvailable = true;

      remainingAmount =
        Math.round(
          (totalAmount - depositAmount) * 100,
        ) / 100;

      balanceDueDate =
        new Date(schedule.startDate);

      balanceDueDate.setUTCDate(
        balanceDueDate.getUTCDate() -
          schedule.balanceDueDaysBeforeStart,
      );
    }
  }

  return {
    bookingId: booking.id,

    totalAmount,
    currency: booking.currency,

    paymentOptions: {
      full: {
        available: true,
        amount: totalAmount,
      },

      deposit: {
        available: depositAvailable,
        amount: depositAvailable
          ? depositAmount
          : null,

        remainingAmount: depositAvailable
          ? remainingAmount
          : null,

        balanceDueDate: depositAvailable
          ? balanceDueDate
          : null,
      },
    },
  };
};


export const getBookingSummaryService = async (
  bookingId: string,
  userId: string,
): Promise<BookingSummary> => {
  const booking =
    await findBookingSummaryById(
      bookingId,
      userId,
    );

  if (!booking) {
    throw new CustomError(
      "Booking not found",
      404,
    );
  }

  const amountPaid = booking.payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  const remainingAmount = Math.max(
    booking.totalAmount - amountPaid,
    0,
  );

  const latestSuccessfulPayment =
    booking.payments[0] ?? null;

  const paymentStatus: BookingPaymentDisplayStatus =
    amountPaid <= 0
      ? "UNPAID"
      : remainingAmount > 0
        ? "PARTIALLY_PAID"
        : "PAID";

  return {
    bookingId: booking.id,
    bookingStatus: booking.status,
    bookedAt: booking.bookedAt,

    personalInfo: {
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      address: booking.address,
      city: booking.city,
      state: booking.state,
      country: booking.country,
      pinCode: booking.pinCode,
      message: booking.message,
    },

    orderSummary: {
      packageId: booking.schedule.package.id,
      packageTitle: booking.schedule.package.title ?? "",
      trekLeader: {
        id: booking.schedule.package.createdBy.id,
        name: booking.schedule.package.createdBy.name ?? "",
        avatarUrl: booking.schedule.package.createdBy.avatarUrl,
      },
      scheduleId: booking.schedule.id,
      startDate: booking.schedule.startDate,
      endDate: booking.schedule.endDate,
      adultCount: booking.adultCount,
      childCount: booking.childCount,
      cancellationPolicy:
        booking.schedule.cancellationPolicy,
    },

    priceSummary: {
      subtotal: booking.subtotal,
      discountAmount: booking.discountAmount,
      bookingFee: booking.bookingFee,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
    },

    paymentSummary: {
      paymentStatus,
      paymentType:
        latestSuccessfulPayment?.paymentType ?? null,
      amountPaid,
      remainingAmount,
      balanceDueDate: booking.balanceDueDate,
      paymentGateway:
        latestSuccessfulPayment?.paymentGateway ?? null,
      paidAt: latestSuccessfulPayment?.paidAt ?? null,
    },
  };
};