import { prisma } from "../utils/prisma.js";
import { uuidv7 } from "uuidv7";


export const findBookingForPayment = async (
  bookingId: string,
) => {
  return prisma.packageBooking.findUnique({
    where: {
      id: bookingId,
    },

    select: {
      id: true,
      userId: true,
      status: true,

      totalAmount: true,
      currency: true,

      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      country: true,
      pinCode: true,

      schedule: {
        select: {
          id: true,

          startDate: true,
          bookingStartDate: true,
          bookingEndDate: true,

          status: true,
          availableSeats: true,

          allowPartialPayment: true,
          depositType: true,
          depositValue: true,
          balanceDueDaysBeforeStart: true,
        },
      },
    },
  });
};

export const updateBookingBalanceDueDate = async (
  bookingId: string,
  balanceDueDate: Date,
): Promise<void> => {
  await prisma.packageBooking.update({
    where: {
      id: bookingId,
    },

    data: {
      balanceDueDate,
    },
  });
};


export const createPendingPayment = async (
  bookingId: string,
  amount: number,
  currency: string,
  paymentType: "FULL" | "DEPOSIT",
) => {
  return prisma.payment.create({
    data: {
      id: uuidv7(),

      bookingId,

      amount,
      currency,
      paymentType,

      paymentGateway: "RAZORPAY",

      status: "PENDING",
    },
  });
};

export const updatePaymentGatewayOrder = async (
  paymentId: string,
  gatewayOrderId: string,
) => {
  return prisma.payment.update({
    where: {
      id: paymentId,
    },

    data: {
      gatewayOrderId,
    },
  });
};


export const findPendingPayment = async (
  bookingId: string,
  paymentType: "FULL" | "DEPOSIT",
) => {
  return prisma.payment.findFirst({
    where: {
      bookingId,
      paymentType,
      status: "PENDING",
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const markPaymentFailed = async (
  paymentId: string,
) => {
  return prisma.payment.update({
    where: {
      id: paymentId,
    },

    data: {
      status: "FAILED",
      failedAt: new Date(),
    },
  });
};