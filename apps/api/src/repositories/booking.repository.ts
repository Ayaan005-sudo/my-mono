import { uuidv7 } from "uuidv7";
import { prisma } from "../utils/prisma.js";
import type { CreateBookingRepoInput, CreateBookingResponse, UpdateBookingContactInfoInput } from "../types/booking.js";


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


export const updateBookingContactInfo = async (
  bookingId: string,
  input: UpdateBookingContactInfoInput,
) => {
  return prisma.packageBooking.update({
    where: {
      id: bookingId,
    },

    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,

      address: input.address,
      city: input.city,
      state: input.state,
      country: input.country,
      pinCode: input.pinCode,

      message: input.message ?? null,
    },

    select: {
      id: true,

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

      status: true,
      updatedAt: true,
    },
  });
};


export const findBookingForPaymentOptions = async (
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

      // Contact info bhi lao because payment se pehle
      // booking form complete hona chahiye.
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