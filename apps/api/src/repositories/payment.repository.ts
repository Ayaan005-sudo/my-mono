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


export const completePaymentAndConfirmBooking = async (
  paymentId: string,
  bookingId: string,
  scheduleId: string,
  participantCount: number,
  razorpayPaymentId: string,
) => {
  return prisma.$transaction(async (tx) => {
    const paidAt = new Date();

    const paymentClaim =
      await tx.payment.updateMany({
        where: {
          id: paymentId,
          status: "PENDING",
        },

        data: {
          status: "SUCCESS",
          gatewayPaymentId: razorpayPaymentId,
          paidAt,
        },
      });

    if (paymentClaim.count === 0) {
      const existingPayment =
        await tx.payment.findUnique({
          where: {
            id: paymentId,
          },

          select: {
            id: true,
            bookingId: true,
            amount: true,
            currency: true,
            paymentType: true,
            status: true,
            gatewayOrderId: true,
            gatewayPaymentId: true,
            paidAt: true,
          },
        });

      if (!existingPayment) {
        throw new Error("PAYMENT_NOT_FOUND");
      }

      if (existingPayment.status === "SUCCESS") {
        const existingBooking =
          await tx.packageBooking.findUnique({
            where: {
              id: existingPayment.bookingId,
            },

            select: {
              id: true,
              status: true,
            },
          });

        return {
          payment: existingPayment,
          booking: existingBooking,
          alreadyProcessed: true,
        };
      }

      throw new Error("PAYMENT_NOT_PENDING");
    }

    const payment =
      await tx.payment.findUnique({
        where: {
          id: paymentId,
        },

        select: {
          id: true,
          bookingId: true,
          amount: true,
          currency: true,
          paymentType: true,
          status: true,
          gatewayOrderId: true,
          gatewayPaymentId: true,
          paidAt: true,
        },
      });

    if (!payment) {
      throw new Error("PAYMENT_NOT_FOUND");
    }

    let booking;

    if (payment.paymentType === "BALANCE") {
      const existingBooking =
        await tx.packageBooking.findUnique({
          where: {
            id: bookingId,
          },

          select: {
            id: true,
            status: true,
          },
        });

      if (
        !existingBooking ||
        existingBooking.status !== "CONFIRMED"
      ) {
        throw new Error("BOOKING_NOT_CONFIRMED");
      }

      booking = existingBooking;
    } else {
      const seatUpdate =
    await tx.packageSchedule.updateMany({
      where: {
        id: scheduleId,

        availableSeats: {
          gte: participantCount,
        },
      },

      data: {
        availableSeats: {
          decrement: participantCount,
        },
      },
    });

  if (seatUpdate.count !== 1) {
    throw new Error("INSUFFICIENT_SEATS");
  }

  booking =
    await tx.packageBooking.update({
      where: {
        id: bookingId,
      },

      data: {
        status: "CONFIRMED",
      },

      select: {
        id: true,
        status: true,
      },
    });
}

    return {
      payment,
      booking,
      alreadyProcessed: false,
    };
  });
};

export const findPaymentForVerification = async (
  paymentId: string,
) => {
  return prisma.payment.findUnique({
    where: {
      id: paymentId,
    },

    select: {
      id: true,
      bookingId: true,

      amount: true,
      currency: true,
      paymentType: true,

      paymentGateway: true,
      gatewayOrderId: true,
      gatewayPaymentId: true,

      status: true,

      booking: {
        select: {
          id: true,
          userId: true,
          status: true,

          adultCount: true,
          childCount: true,

          scheduleId: true,

          schedule: {
            select: {
              id: true,
              availableSeats: true,
            },
          },
        },
      },
    },
  });
};