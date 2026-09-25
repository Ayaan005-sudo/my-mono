import type { VendorDashboardRepositoryData, VendorPublicProfileResponse } from "../types/index.js";
import { prisma } from "../utils/prisma.js";


export const findVendorPublicProfileById = async (
  vendorId: string,
): Promise<VendorPublicProfileResponse | null> => {
  const vendorProfile =
    await prisma.vendorProfile.findFirst({
      where: {
        id: vendorId,

        verificationStatus: "APPROVED",

        user: {
          is: {
            role: "VENDOR",
            isDeleted: false,
          },
        },
      },

      select: {
        id: true,

        vendorType: true,
        experienceYears: true,
        treksLed: true,
        regionsWorkedIn: true,

        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,

            city: true,
            state: true,
            country: true,

            languages: true,

            userExperiences: {
              where: {
                verificationStatus: "APPROVED",
              },

              orderBy: {
                completedAt: "desc",
              },

              select: {
                id: true,

                description: true,
                imageUrls: true,

                trekName: true,
                difficulty: true,
                roleDuringTrek: true,
                completedAt: true,
                duration: true,
                altitude: true,
                proofUrl: true,

                verificationStatus: true,

                source: true,
                packageId: true,
                scheduleId: true,
              },
            },

            userCertifications: {
              where: {
                verificationStatus: "APPROVED",
              },

              orderBy: {
                issuedAt: "desc",
              },

              select: {
                id: true,
                title: true,
                issuingOrganization: true,
                certificateNumber: true,
                certificateUrl: true,
                issuedAt: true,
                expiresAt: true,
                verificationStatus: true,
              },
            },

            userBadges: {
              orderBy: {
                awardedAt: "desc",
              },

              select: {
                badge: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    iconUrl: true,
                  },
                },
              },
            },

            packages: {
              where: {
                status: "PUBLISHED",
                visibility: "PUBLIC",
              },

              orderBy: {
                createdAt: "desc",
              },

              take: 6,

              select: {
                id: true,
                title: true,
                description: true,
                galleryImages: true,
              },
            },
          },
        },
      },
    });

  if (!vendorProfile) {
    return null;
  }

  const user = vendorProfile.user;

  return {
    // IMPORTANT:
    // Public vendor profile ID = VendorProfile.id
    id: vendorProfile.id,

    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,

    location: {
      city: user.city,
      state: user.state,
      country: user.country,
    },

    languages: user.languages,

    professionalInfo: {
      vendorType: vendorProfile.vendorType,

      experienceYears:
        vendorProfile.experienceYears,

      treksLed: vendorProfile.treksLed,

      regionsWorkedIn:
        vendorProfile.regionsWorkedIn,
    },

    experiences: user.userExperiences,

    certifications:
      user.userCertifications,

    badges: user.userBadges.map(
      (userBadge) => userBadge.badge,
    ),

    packages: user.packages,
  };
};


export const getVendorDashboardData = async (
  userId: string,
  now: Date,
): Promise<VendorDashboardRepositoryData> => {
 const packageOwner = {
  createdByUserId: userId,
   OR: [
    { teamId: null },
    {
      teamId: {
        isSet: false,
      },
    },
  ],
};
  const [
    successfulPayments,
    confirmedBookingParticipants,
    pendingBookingsCount,
    activeTreksCount,
    pendingBookings,
    activeTreks,
  ] = await Promise.all([
    prisma.payment.findMany({
      where: {
        status: "SUCCESS",
        booking: {
          schedule: {
            package: packageOwner,
          },
        },
      },
      select: {
        amount: true,
        paidAt: true,
      },
    }),
    prisma.packageBooking.findMany({
      where: {
        status: {
          in: ["CONFIRMED", "COMPLETED"],
        },
        schedule: {
          package: packageOwner,
        },
      },
      select: {
        adultCount: true,
        childCount: true,
      },
    }),
    prisma.packageBooking.count({
      where: {
        status: "PENDING",
        schedule: {
          package: packageOwner,
        },
      },
    }),
    prisma.packageSchedule.count({
      where: {
        status: "OPEN",
        startDate: {
          gte: now,
        },
        package: {
          ...packageOwner,
          status: "PUBLISHED",
          visibility: "PUBLIC",
        },
      },
    }),
    prisma.packageBooking.findMany({
      where: {
        status: "PENDING",
        schedule: {
          package: packageOwner,
        },
      },
      orderBy: [
        { bookedAt: "desc" },
        { id: "desc" },
      ],
      take: 5,
      select: {
        id: true,
        adultCount: true,
        childCount: true,
        totalAmount: true,
        currency: true,
        status: true,
        bookedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        schedule: {
          select: {
            package: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    }),
    prisma.packageSchedule.findMany({
      where: {
        status: "OPEN",
        startDate: {
          gte: now,
        },
        package: {
          ...packageOwner,
          status: "PUBLISHED",
          visibility: "PUBLIC",
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: 6,
      select: {
        id: true,
        startDate: true,
        endDate: true,
        availableSeats: true,
        maxParticipants: true,
        status: true,
        package: {
          select: {
            id: true,
            title: true,
            galleryImages: true,
          },
        },
      },
    }),
  ]);

  return {
    successfulPayments,
    confirmedBookingParticipants,
    pendingBookingsCount,
    activeTreksCount,
    pendingBookings: pendingBookings.map((booking) => ({
      bookingId: booking.id,
      trekker: booking.user,
      package: booking.schedule.package,
      participantCount:
        booking.adultCount + booking.childCount,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      bookingStatus: booking.status,
      bookedAt: booking.bookedAt,
    })),
    activeTreks: activeTreks.map((schedule) => ({
      scheduleId: schedule.id,
      package: schedule.package,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      bookedSeats:
        schedule.maxParticipants -
        schedule.availableSeats,
      availableSeats: schedule.availableSeats,
      maxParticipants: schedule.maxParticipants,
      status: schedule.status,
    })),
  };
};