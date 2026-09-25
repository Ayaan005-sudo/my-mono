import { prisma } from "../utils/prisma.js";
import { uuidv7 } from "uuidv7";
import type { CreateTeamInput, CreateTeamResponse, MyTeamInvitation, TeamBookingsQuery, TeamBookingsRepositoryData, TeamDashboardRepositoryData, TeamDetailsResponse, TeamInvitationActionResponse, TeamMemberResponse, TeamPublicProfileResponse, UpdateTeamInput, UpdateTeamResponse } from "../types/index.js";
import type { TeamInvitation } from "@mono/database";

export const createTeam = async (
  data: CreateTeamInput,
  userId: string,
): Promise<CreateTeamResponse> => {
  return prisma.$transaction(async (tx) => {
    const team = await tx.team.create({
      data: {
        id: uuidv7(),
        name: data.name,
        description: data.description,
        logoUrl: data.logoUrl,
        city: data.city,
        state: data.state,
        country: data.country,
        createdByUserId: userId,
      },
    });

    await tx.teamMember.create({
      data: {
        id: uuidv7(),
        teamId: team.id,
        userId,
        role: "OWNER",
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });

    return team;
  });
};

export const searchApprovedVendors = async (
  search: string,
  limit: number,
) => {
  return prisma.user.findMany({
    where: {
      role: "VENDOR",
      status: "ACTIVE",
      isDeleted: false,

      vendorProfile: {
        is: {
          verificationStatus: "APPROVED",
        },
      },

      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      city: true,
      state: true,

      vendorProfile: {
        select: {
          vendorType: true,
          experienceYears: true,
        },
      },
    },

    take: limit,

    orderBy: {
      name: "asc",
    },
  });
};


export const findTeamById = async (teamId: string) => {
  return prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });
};

export const findTeamMember = async (
  teamId: string,
  userId: string,
) => {
  return prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });
};

export const findApprovedVendorById = async (
  userId: string,
) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
      role: "VENDOR",
      status: "ACTIVE",
      isDeleted: false,

      vendorProfile: {
        is: {
          verificationStatus: "APPROVED",
        },
      },
    },

    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const findPendingTeamInvitation = async (
  teamId: string,
  invitedUserId: string,
) => {
  return prisma.teamInvitation.findFirst({
    where: {
      teamId,
      invitedUserId,
      status: "PENDING",
    },
  });
};

export const createTeamInvitation = async (
  teamId: string,
  invitedUserId: string,
  email: string,
  invitedByUserId: string,
) => {
  return prisma.teamInvitation.create({
    data: {
      id:uuidv7(),
      teamId,
      invitedUserId,
      email,
      invitedByUserId,
      status: "PENDING",
    },
  });
};

export const findUserByEmail = async (
  email: string,
) => {
  return prisma.user.findUnique({
    where: {
      email,
    },

    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      isDeleted: true,

      vendorProfile: {
        select: {
          verificationStatus: true,
        },
      },
    },
  });
};


export const createOnboardingTeamInvitation = async (
  teamId: string,
  email: string,
  invitedByUserId: string,
  invitedUserId?: string,
) => {
  return prisma.teamInvitation.create({
    data: {
      id :uuidv7(),
      teamId,
      email,
      invitedByUserId,
      invitedUserId: invitedUserId ?? null,
      status: "PENDING",
    },
  });
};

export const findPendingTeamInvitationByEmail = async (
  teamId: string,
  email: string,
) => {
  return prisma.teamInvitation.findFirst({
    where: {
      teamId,
      email,
      status: "PENDING",
    },
  });
};




export const getMyPendingTeamInvitations = async (
  userId: string,
): Promise<MyTeamInvitation[]> => {
  return prisma.teamInvitation.findMany({
    where: {
      invitedUserId: userId,
      status: "PENDING",
    },

    select: {
      id: true,
      status: true,
      createdAt: true,
      expiresAt: true,

      team: {
        select: {
          id: true,
          name: true,
          logoUrl: true,
          city: true,
          state: true,
          country: true,
        },
      },

      invitedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const acceptTeamInvitation = async (
  invitationId: string,
  teamId: string,
  userId: string,
): Promise<TeamInvitationActionResponse> => {
  return prisma.$transaction(async (tx) => {
    await tx.teamMember.create({
      data: {
        id:uuidv7(),
        teamId,
        userId,
        role: "MEMBER",
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });

    const invitation =
      await tx.teamInvitation.update({
        where: {
          id: invitationId,
        },
        data: {
          status: "ACCEPTED",
        },
      });

    return invitation;
  });
};

export const rejectTeamInvitation = async (
  invitationId: string,
): Promise<TeamInvitationActionResponse> => {
  return prisma.teamInvitation.update({
    where: {
      id: invitationId,
    },
    data: {
      status: "REJECTED",
    },
  });
};

export const findTeamInvitationById = async (
  invitationId: string,
): Promise<TeamInvitation | null> => {
  return prisma.teamInvitation.findUnique({
    where: {
      id: invitationId,
    },
  });
};

export const getActiveTeamMembers = async (
  teamId: string,
): Promise<TeamMemberResponse[]> => {
  return prisma.teamMember.findMany({
    where: {
      teamId,
      status: "ACTIVE",
    },

    select: {
      id: true,
      role: true,
      status: true,
      joinedAt: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          city: true,
          state: true,

          vendorProfile: {
            select: {
              vendorType: true,
              experienceYears: true,
            },
          },
        },
      },
    },

    orderBy: {
      joinedAt: "asc",
    },
  });
};


export const getTeamDetailsById = async (
  teamId: string,
): Promise<TeamDetailsResponse | null> => {
  return prisma.team.findUnique({
    where: {
      id: teamId,
    },

    select: {
      id: true,
      name: true,
      description: true,
      logoUrl: true,

      city: true,
      state: true,
      country: true,

      createdByUserId: true,
      createdAt: true,
      updatedAt: true,

      createdBy: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },

      _count: {
        select: {
          members: {
            where: {
              status: "ACTIVE",
            },
          },
          packages: true,
        },
      },
    },
  });
};

export const updateTeam = async (
  teamId: string,
  data: UpdateTeamInput,
): Promise<UpdateTeamResponse> => {
  return prisma.team.update({
    where: {
      id: teamId,
    },

    data,

    select: {
      id: true,
      name: true,
      description: true,
      logoUrl: true,
      city: true,
      state: true,
      country: true,
      createdByUserId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findTeamPublicProfileById = async (
  teamId: string,
): Promise<TeamPublicProfileResponse | null> => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
    },

    select: {
      id: true,
      name: true,
      description: true,
      logoUrl: true,

      city: true,
      state: true,
      country: true,

      createdAt: true,

      createdBy: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },

      members: {
        orderBy: {
          joinedAt: "asc",
        },

        select: {
          id: true,
          role: true,

          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,

              city: true,
              state: true,
              country: true,

              userExperiences: {
  where: {
    verificationStatus: "APPROVED",
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
  },
},

userCertifications: {
  where: {
    verificationStatus: "APPROVED",
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
            },
          },
        },
      },

      experiences: {
  orderBy: {
    completedAt: "desc",
  },

  select: {
    id: true,

    packageId: true,
    scheduleId: true,

    trekName: true,
    difficulty: true,

    completedAt: true,
    duration: true,
    altitude: true,

    imageUrls: true,
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
  });

  if (!team) {
    return null;
  }

  return {
    id: team.id,
    name: team.name,
    description: team.description,
    logoUrl: team.logoUrl,
    city: team.city,
    state: team.state,
    country: team.country,
    owner: team.createdBy,
    members: team.members,
    experiences: team.experiences,
    packages: team.packages,
    createdAt: team.createdAt,
  };
};

export const getTeamDashboardData = async (
  teamId: string,
  now: Date,
): Promise<TeamDashboardRepositoryData> => {
  const packageOwner = {
    teamId,
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

    pendingBookings: pendingBookings.map(
      (booking) => ({
        bookingId: booking.id,

        trekker: booking.user,

        package:
          booking.schedule.package,

        participantCount:
          booking.adultCount +
          booking.childCount,

        totalAmount: booking.totalAmount,
        currency: booking.currency,
        bookingStatus: booking.status,
        bookedAt: booking.bookedAt,
      }),
    ),

    activeTreks: activeTreks.map(
      (schedule) => ({
        scheduleId: schedule.id,

        package: schedule.package,

        startDate: schedule.startDate,
        endDate: schedule.endDate,

        bookedSeats:
          schedule.maxParticipants -
          schedule.availableSeats,

        availableSeats:
          schedule.availableSeats,

        maxParticipants:
          schedule.maxParticipants,

        status: schedule.status,
      }),
    ),
  };
};


export const getTeamBookingsData = async (
  teamId: string,
  query: TeamBookingsQuery,
  now: Date,
): Promise<TeamBookingsRepositoryData> => {
  const packageFilter = {
    teamId,

    ...(query.packageId && {
      id: query.packageId,
    }),
  };

  const where = {
    ...(query.status && {
      status: query.status,
    }),

    ...(query.search && {
      OR: [
        {
          id: {
            contains: query.search,
          },
        },

        {
          user: {
            name: {
              contains: query.search,
              mode: "insensitive" as const,
            },
          },
        },

        {
          schedule: {
            package: {
              ...packageFilter,

              title: {
                contains: query.search,
                mode: "insensitive" as const,
              },
            },
          },
        },
      ],
    }),

    schedule: {
      package: packageFilter,
    },
  };

  const [
    bookings,
    totalBookings,
    pendingBookings,
    revenue,
    upcomingTreks,
  ] = await Promise.all([
    prisma.packageBooking.findMany({
      where,

      take: query.limit + 1,

      ...(query.cursor
        ? {
            cursor: {
              id: query.cursor,
            },
            skip: 1,
          }
        : {}),

      orderBy: [
        { bookedAt: "desc" },
        { id: "desc" },
      ],

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
            id: true,
            startDate: true,
            endDate: true,

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

    prisma.packageBooking.count({
      where,
    }),

    prisma.packageBooking.count({
      where: {
        ...where,
        status: "PENDING",
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",

        booking: {
          status: {
            in: [
              "CONFIRMED",
              "COMPLETED",
            ],
          },

          schedule: {
            package: packageFilter,
          },
        },
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.packageSchedule.count({
      where: {
        status: "OPEN",

        startDate: {
          gte: now,
        },

        package: {
          ...packageFilter,
          status: "PUBLISHED",
          visibility: "PUBLIC",
        },
      },
    }),
  ]);

  return {
    bookings: bookings.map(
      (booking) => ({
        bookingId: booking.id,

        trekker: booking.user,

        package:
          booking.schedule.package,

        schedule: {
          id: booking.schedule.id,
          startDate:
            booking.schedule.startDate,
          endDate:
            booking.schedule.endDate,
        },

        adultCount:
          booking.adultCount,

        childCount:
          booking.childCount,

        participantCount:
          booking.adultCount +
          booking.childCount,

        totalAmount:
          booking.totalAmount,

        currency:
          booking.currency,

        status:
          booking.status,

        bookedAt:
          booking.bookedAt,
      }),
    ),

    totalBookings,

    pendingBookings,

    confirmedRevenue:
      revenue._sum.amount ?? 0,

    upcomingTreks,
  };
};

export const findTeamAccess = async (
  teamId: string,
  userId: string,
) => {
  return prisma.team.findFirst({
    where: {
      id: teamId,

      OR: [
        {
          createdByUserId: userId,
        },
        {
          members: {
            some: {
              userId,
              status: "ACTIVE",
            },
          },
        },
      ],
    },

    select: {
      id: true,
      createdByUserId: true,
    },
  });
};