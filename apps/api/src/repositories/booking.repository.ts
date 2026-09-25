import { uuidv7 } from "uuidv7";
import { prisma } from "../utils/prisma.js";
import type { CreateBookingRepoInput, CreateBookingResponse } from "../types/booking.js";


export const findScheduleForBooking = async (
  scheduleId: string,
) => {
  return prisma.packageSchedule.findUnique({
    where: {
      id: scheduleId,
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,

      bookingStartDate: true,
      bookingEndDate: true,

      allowPartialPayment: true,
      balanceDueDaysBeforeStart: true,

      price: true,
      adultPrice: true,
      childPrice: true,
      currency: true,

      minParticipants: true,
      maxParticipants: true,
      availableSeats: true,

      status: true,

      package: {
        select: {
          id: true,
          status: true,
          visibility: true,
        },
      },
    },
  });
};


export const createBooking = async (
  data: CreateBookingRepoInput,
): Promise<CreateBookingResponse> => {
  return prisma.packageBooking.create({
    data: {
      id : uuidv7(),
      userId: data.userId,
      scheduleId: data.input.scheduleId,

      adultCount: data.input.adultCount,
      childCount: data.input.childCount,

      subtotal: data.subtotal,
      discountAmount: data.discountAmount,
      bookingFee: data.bookingFee,
      totalAmount: data.totalAmount,

      currency: data.currency,

      balanceDueDate: data.balanceDueDate,

      status: "PENDING",
    },

    select: {
      id: true,
      scheduleId: true,

      adultCount: true,
      childCount: true,

      subtotal: true,
      discountAmount: true,
      bookingFee: true,
      totalAmount: true,

      currency: true,
      balanceDueDate: true,

      status: true,
      bookedAt: true,
    },
  });
};


export const findBookingDetailById = async (
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

      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      country: true,
      pinCode: true,
      message: true,

      adultCount: true,
      childCount: true,

      subtotal: true,
      discountAmount: true,
      bookingFee: true,
      totalAmount: true,
      currency: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          state: true,
          country: true,
        },
      },

      schedule: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          cancellationPolicy: true,

          package: {
            select: {
              id: true,
              title: true,

              createdBy: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },

              masterTrek: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
