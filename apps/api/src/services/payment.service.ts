import { razorpay } from "../lib/razorpay.service.js";
import { createPendingPayment, findBookingForPayment, findPendingPayment, markPaymentFailed, updateBookingBalanceDueDate, updatePaymentGatewayOrder } from "../repositories/payment.repository.js";
import type { CreatePaymentOrderInput, CreatePaymentOrderResponse } from "../types/payment.js";
import { CustomError } from "../utils/custom-error.js";

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
