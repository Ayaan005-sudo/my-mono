import { razorpay } from "../lib/razorpay.service.js";
import { completePaymentAndConfirmBooking, createPendingPayment, findBookingForPayment, findPaymentForVerification, findPendingPayment, markPaymentFailed, updateBookingBalanceDueDate, updatePaymentGatewayOrder } from "../repositories/payment.repository.js";
import type { CreatePaymentOrderInput, CreatePaymentOrderResponse, VerifyPaymentInput, VerifyPaymentResponse } from "../types/payment.js";
import { CustomError } from "../utils/custom-error.js";
import crypto from "node:crypto";

export const createPaymentOrderService = async (
  userId: string,
  input: CreatePaymentOrderInput,
): Promise<CreatePaymentOrderResponse> => {
  const booking =
    await findBookingForPayment(input.bookingId);

  if (!booking) {
    throw new CustomError(
      "Booking not found",
      404,
    );
  }

  // Ownership
  if (booking.userId !== userId) {
    throw new CustomError(
      "You are not authorized to pay for this booking",
      403,
    );
  }

  if (booking.status !== "PENDING") {
    throw new CustomError(
      "Payment can only be initiated for pending bookings",
      400,
    );
  }

  // Contact information must be complete
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

  let payableAmount: number;

  // FULL PAYMENT

  if (input.paymentType === "FULL") {
    payableAmount = booking.totalAmount;
  }

 
  // DEPOSIT PAYMENT
  else {
    if (!schedule.allowPartialPayment) {
      throw new CustomError(
        "Partial payment is not available for this schedule",
        400,
      );
    }

    if (
      !schedule.depositType ||
      schedule.depositValue === null
    ) {
      throw new CustomError(
        "Deposit configuration is invalid",
        500,
      );
    }

    if (schedule.depositType === "PERCENTAGE") {
      payableAmount =
        (booking.totalAmount *
          schedule.depositValue) /
        100;
    } else {
      payableAmount =
        schedule.depositValue;
    }

    payableAmount =
      Math.round(payableAmount * 100) / 100;

    if (
      payableAmount <= 0 ||
      payableAmount >= booking.totalAmount
    ) {
      throw new CustomError(
        "Invalid deposit amount for this booking",
        400,
      );
    }

    if (
      schedule.balanceDueDaysBeforeStart ===
      null
    ) {
      throw new CustomError(
        "Balance due days are not configured",
        500,
      );
    }

    const balanceDueDate =
      new Date(schedule.startDate);

    balanceDueDate.setUTCDate(
      balanceDueDate.getUTCDate() -
        schedule.balanceDueDaysBeforeStart,
    );

    await updateBookingBalanceDueDate(
      booking.id,
      balanceDueDate,
    );
  }

  

  const existingPendingPayment =
    await findPendingPayment(
      booking.id,
      input.paymentType,
    );

  
  if (
    existingPendingPayment?.gatewayOrderId &&
    existingPendingPayment.amount === payableAmount
  ) {
    return {
      paymentId: existingPendingPayment.id,
      bookingId: booking.id,

      paymentType: input.paymentType,

      amount: existingPendingPayment.amount,
      currency: existingPendingPayment.currency,

      razorpayOrderId:
        existingPendingPayment.gatewayOrderId,

      razorpayKeyId:
        process.env.RAZORPAY_KEY_ID!,
    };
  }

  const payment =
    await createPendingPayment(
      booking.id,
      payableAmount,
      booking.currency,
      input.paymentType,
    );

  try {
    /*
     * Razorpay expects INR in paise.
     *
     * ₹9900 -> 990000
     */
    const amountInSubunits =
      Math.round(payableAmount * 100);

    const razorpayOrder =
      await razorpay.orders.create({
        amount: amountInSubunits,

        currency: booking.currency,

        receipt: payment.id,

        notes: {
          bookingId: booking.id,
          paymentId: payment.id,
          paymentType: input.paymentType,
        },
      });
      console.log("CREATED ORDER:", razorpayOrder);

const fetchedOrder = await razorpay.orders.fetch(
  razorpayOrder.id,
);

console.log("FETCHED ORDER:", fetchedOrder);

    await updatePaymentGatewayOrder(
      payment.id,
      razorpayOrder.id,
    );

    return {
      paymentId: payment.id,
      bookingId: booking.id,

      paymentType: input.paymentType,

      amount: payableAmount,
      currency: booking.currency,

      razorpayOrderId: razorpayOrder.id,

      razorpayKeyId:
        process.env.RAZORPAY_KEY_ID!,
    };

  } catch (error) {
    await markPaymentFailed(payment.id);
    throw new CustomError(
      "Failed to create payment order",
      502,
    );
  }
};


export const verifyPaymentService = async (
  userId: string,
  input: VerifyPaymentInput,
): Promise<VerifyPaymentResponse> => {
  const payment =
    await findPaymentForVerification(
      input.paymentId,
    );

  if (!payment) {
    throw new CustomError(
      "Payment not found",
      404,
    );
  }

  if (payment.booking.userId !== userId) {
    throw new CustomError(
      "You are not authorized to verify this payment",
      403,
    );
  }

  if (
    payment.status !== "PENDING" &&
    payment.status !== "SUCCESS"
  ) {
    throw new CustomError(
      "This payment cannot be verified",
      400,
    );
  }

  if (!payment.gatewayOrderId) {
    throw new CustomError(
      "Razorpay order not found for this payment",
      400,
    );
  }


  if (
    input.razorpayOrderId !==
    payment.gatewayOrderId
  ) {
    throw new CustomError(
      "Razorpay order ID does not match",
      400,
    );
  }

  const secret =
    process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new CustomError(
      "Razorpay is not configured",
      500,
    );
  }

  /*
   * Razorpay signature:
   *
   * HMAC_SHA256(
   *   order_id + "|" + payment_id,
   *   key_secret
   * )
   */

  const body =
    `${payment.gatewayOrderId}|${input.razorpayPaymentId}`;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        secret,
      )
      .update(body)
      .digest("hex");

  /*
   * timingSafeEqual avoid direct string
   * comparison for signature verification.
   */
  const expectedBuffer =
    Buffer.from(expectedSignature);

  const receivedBuffer =
    Buffer.from(input.razorpaySignature);

  const isValid =
    expectedBuffer.length ===
      receivedBuffer.length &&
    crypto.timingSafeEqual(
      expectedBuffer,
      receivedBuffer,
    );

  if (!isValid) {
    throw new CustomError(
      "Invalid payment signature",
      400,
    );
  }

  if (
    payment.status === "SUCCESS" &&
    payment.gatewayPaymentId &&
    payment.gatewayPaymentId !==
      input.razorpayPaymentId
  ) {
    throw new CustomError(
      "Razorpay payment ID does not match",
      400,
    );
  }

  const participantCount =
    payment.booking.adultCount +
    payment.booking.childCount;

  if (participantCount <= 0) {
    throw new CustomError(
      "Invalid participant count",
      400,
    );
  }

  const result =
    await finalizeSuccessfulPayment(
      payment.id,
      payment.booking.id,
      payment.booking.scheduleId,
      participantCount,
      input.razorpayPaymentId,
    );

  return {
    paymentId: result.payment.id,

    bookingId: result.booking?.id ?? payment.booking.id,

    paymentType:
      result.payment.paymentType,

    amount:
      result.payment.amount,

    currency:
      result.payment.currency,

    paymentStatus: "SUCCESS",

    bookingStatus: "CONFIRMED",

    razorpayPaymentId:
      result.payment.gatewayPaymentId ??
      input.razorpayPaymentId,

    paidAt:
      result.payment.paidAt!,
  };
};

export const finalizeSuccessfulPayment = async (
  paymentId: string,
  bookingId: string,
  scheduleId: string,
  participantCount: number,
  razorpayPaymentId: string,
) => {
  try {
    return await completePaymentAndConfirmBooking(
      paymentId,
      bookingId,
      scheduleId,
      participantCount,
      razorpayPaymentId,
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INSUFFICIENT_SEATS"
    ) {
      throw new CustomError(
        "Not enough seats are available for this booking",
        409,
      );
    }

    if (
      error instanceof Error &&
      error.message === "PAYMENT_NOT_FOUND"
    ) {
      throw new CustomError(
        "Payment not found",
        404,
      );
    }

    if (
      error instanceof Error &&
      error.message === "PAYMENT_NOT_PENDING"
    ) {
      throw new CustomError(
        "Payment cannot be processed in its current state",
        409,
      );
    }

    if (
      error instanceof Error &&
      error.message === "BOOKING_NOT_CONFIRMED"
    ) {
      throw new CustomError(
        "Booking is not confirmed",
        400,
      );
    }

    throw error;
  }
};

