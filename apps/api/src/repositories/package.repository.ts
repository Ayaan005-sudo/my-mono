import type { MasterTrek, ScheduleType } from "@mono/database";
import { uuidv7 } from "uuidv7";
import type { AddPackageItineraryDayInput, CreatePackageInput, CreatePackageItineraryInput, CreatePackageScheduleInput, GetMyActivitiesQuery, SearchPackagesQuery, UpdatePackageBasicsInput, UpdatePackageInclusionsInput, UpdatePackageItineraryDayInput, UpdatePackageScheduleInput } from "../types/package.js";
import { prisma } from "../utils/prisma.js";

export const createPackage = async (
  userId: string,
  data: CreatePackageInput,
  masterTrek: MasterTrek,
) => {
  return prisma.package.create({
    data: {
      id: uuidv7(),

      createdByUserId: userId,
      teamId: data.teamId ?? null,

      masterTrekId: data.masterTrekId,

      title: masterTrek.name,
      description: masterTrek.description,
      locationId: masterTrek.locationId,
      difficulty: masterTrek.difficulty,
      durationDays: masterTrek.durationDays,
      distanceKm: masterTrek.distanceKm,
    },

    include: {
      location: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });
};


export const findMasterTrekById = async (masterTrekId: string) => {
  return prisma.masterTrek.findUnique({
    where: {
      id: masterTrekId,
    },
  });
};

export const getVendorPackageCreationProfile = async (
  userId: string,
) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      avatarUrl: true,

      vendorProfile: {
        select: {
          vendorType: true,
          verificationStatus: true,
        },
      },
    },
  });
};

export const getVendorActiveTeamsForPackageCreation = async (
  userId: string,
) => {
  return prisma.teamMember.findMany({
    where: {
      userId,
      status: "ACTIVE",
    },

    select: {
      team: {
        select: {
          id: true,
          name: true,
          logoUrl: true,

          members: {
            where: {
              status: "ACTIVE",
              user: {
                role: "VENDOR",
                status: "ACTIVE",
                isDeleted: false,

                vendorProfile: {
                  is: {
                    verificationStatus: "APPROVED",
                  },
                },
              },
            },

            select: {
              user: {
                select: {
                  vendorProfile: {
                    select: {
                      vendorType: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};


export const findPackageById = async (
  packageId: string,
) => {
  return prisma.package.findUnique({
    where: {
      id: packageId,
    },
  });
};


export const updatePackageBasics = async (
  packageId: string,
  data: UpdatePackageBasicsInput,
) => {
  return prisma.package.update({
    where: {
      id: packageId,
    },

    data,

    include: {
      location: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });
};

export const findMasterTrekItinerary = async (
  masterTrekId: string,
  routeId: string,
) => {
  return prisma.trekRoute.findFirst({
    where: {
      id: routeId,
      masterTrekId,
    },

    select: {
      id: true,
      name: true,

      itineraryDays: {
        orderBy: {
          dayNumber: "asc",
        },

        select: {
          dayNumber: true,
          title: true,
          description: true,
          startLocation: true,
          endLocation: true,
          distanceKm: true,
          duration: true,
          altitude: true,
          imageUrls: true,

          activities: {
            select: {
              id: true,
              name: true,
              description: true,
              iconUrl: true,
            },
          },
        },
      },
    },
  });
};

export const findMasterTrekRoutes = async (
  masterTrekId: string,
) => {
  return prisma.trekRoute.findMany({
    where: {
      masterTrekId,
    },

    select: {
      id: true,
      name: true,
      description: true,

      distanceKm: true,
      difficulty: true,
      elevationGain: true,

      ascentTime: true,
      descentTime: true,

      startPoint: true,
      endPoint: true,

      isPopular: true,
    },
  });
};

export const createPackageItinerary = async (
  packageId: string,
  routeId: string,
  days: CreatePackageItineraryInput["days"],
) => {
  return prisma.$transaction(async (tx) => {

    await tx.package.update({
  where: {
    id: packageId,
  },

  data: {
    route: {
      connect: {
        id: routeId,
      },
    },
  },
});

    for (const day of days) {
       console.log("3. BEFORE DAY CREATE", day.dayNumber);
      await tx.packageItineraryDay.create({
        data: {
          id: uuidv7(),
          packageId,

          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,

          startLocation: day.startLocation,
          endLocation: day.endLocation,

          distanceKm: day.distanceKm,
          duration: day.duration,
          altitude: day.altitude,

          imageUrls: day.imageUrls,
        },

      });
    }

    return tx.package.findUnique({
      where: {
        id: packageId,
      },
      select: {
        id: true,
        routeId: true,

        itineraryDays: {
          orderBy: {
            dayNumber: "asc",
          },
          select: {
            id: true,
            dayNumber: true,
            title: true,
            description: true,
            startLocation: true,
            endLocation: true,
            distanceKm: true,
            duration: true,
            altitude: true,
            imageUrls: true,


          },
        },
      },
    });
  });
};



export const findPackageItineraryDay = async (
  packageId: string,
  dayId: string,
) => {
  return prisma.packageItineraryDay.findFirst({
    where: {
      id: dayId,
      packageId,
    },
  });
};

export const updatePackageItineraryDay = async (
  dayId: string,
  data: UpdatePackageItineraryDayInput,
) => {
  return prisma.packageItineraryDay.update({
    where: {
      id: dayId,
    },

    data: {
      ...(data.dayNumber !== undefined && {
        dayNumber: data.dayNumber,
      }),

      ...(data.title !== undefined && {
        title: data.title,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.startLocation !== undefined && {
        startLocation: data.startLocation,
      }),

      ...(data.endLocation !== undefined && {
        endLocation: data.endLocation,
      }),

      ...(data.distanceKm !== undefined && {
        distanceKm: data.distanceKm,
      }),

      ...(data.duration !== undefined && {
        duration: data.duration,
      }),

      ...(data.altitude !== undefined && {
        altitude: data.altitude,
      }),

      ...(data.imageUrls !== undefined && {
        imageUrls: data.imageUrls,
      }),
    },

    select: {
      id: true,
      packageId: true,

      dayNumber: true,
      title: true,
      description: true,

      startLocation: true,
      endLocation: true,

      distanceKm: true,
      duration: true,
      altitude: true,

      imageUrls: true,

      

      updatedAt: true,
    },
  });
};

export const deletePackageItineraryDay = async (
  dayId: string,
) => {
  return prisma.packageItineraryDay.delete({
    where: {
      id: dayId,
    },

    select: {
      id: true,
      dayNumber: true,
    },
  });
};


export const findPackageItineraryDayByNumber = async (
  packageId: string,
  dayNumber: number,
) => {
  return prisma.packageItineraryDay.findFirst({
    where: {
      packageId,
      dayNumber,
    },
    select: {
      id: true,
      dayNumber: true,
    },
  });
};

export const addPackageItineraryDay = async (
  packageId: string,
  input: AddPackageItineraryDayInput,
) => {
  return prisma.packageItineraryDay.create({
    data: {
      id: uuidv7(),

      packageId,

      dayNumber: input.dayNumber,
      title: input.title,
      description: input.description,

      startLocation: input.startLocation,
      endLocation: input.endLocation,

      distanceKm: input.distanceKm,
      duration: input.duration,
      altitude: input.altitude,

      imageUrls: input.imageUrls,
    },

    select: {
      id: true,
      packageId: true,

      dayNumber: true,
      title: true,
      description: true,

      startLocation: true,
      endLocation: true,

      distanceKm: true,
      duration: true,
      altitude: true,

      imageUrls: true,


      createdAt: true,
      updatedAt: true,
    },
  });
};

export const countPackageItineraryDays = async (
  packageId: string,
) => {
  return prisma.packageItineraryDay.count({
    where: {
      packageId,
    },
  });
};

export const findRouteForMasterTrek = async (
  routeId: string,
  masterTrekId: string,
) => {
  return prisma.trekRoute.findFirst({
    where: {
      id: routeId,
      masterTrekId,
    },
    select: {
      id: true,
    },
  });
};


export const updatePackageInclusions = async (
  packageId: string,
  data: UpdatePackageInclusionsInput,
) => {
  return prisma.package.update({
    where: {
      id: packageId,
    },

    data: {
      ...(data.inclusions !== undefined && {
        inclusions: data.inclusions,
      }),

      ...(data.exclusions !== undefined && {
        exclusions: data.exclusions,
      }),

      ...(data.packingList !== undefined && {
        packingList: data.packingList,
      }),

     ...(data.fitnessAndExperienceRequirement !== undefined && {
  fitnessAndExperienceRequirement:
    data.fitnessAndExperienceRequirement,
}),
    },

    select: {
      id: true,

      inclusions: true,
      exclusions: true,
      packingList: true,

      fitnessAndExperienceRequirement: true,

      updatedAt: true,
    },
  });
};

export const createPackageSchedule = async (
  packageId: string,
  input: CreatePackageScheduleInput,
) => {
  return prisma.packageSchedule.create({
    data: {
      id: uuidv7(),
      packageId,

      startDate: input.startDate,
      endDate: input.endDate,

      bookingStartDate: input.bookingStartDate,
      bookingEndDate: input.bookingEndDate,

      price: input.price ?? null,
adultPrice: input.adultPrice ?? null,
childPrice: input.childPrice ?? null,

            allowPartialPayment:
              input.allowPartialPayment ?? false,
            depositType: input.allowPartialPayment
              ? input.depositType ?? null
              : null,
            depositValue: input.allowPartialPayment
              ? input.depositValue ?? null
              : null,
            balanceDueDaysBeforeStart:
              input.allowPartialPayment
                ? input.balanceDueDaysBeforeStart ?? null
                : null,

currency: input.currency ?? "INR",

      minParticipants: input.minParticipants,
      maxParticipants: input.maxParticipants,
      availableSeats: input.maxParticipants,

      cancellationPolicy: input.cancellationPolicy,
    },
  });
};

export const findPackageSchedules = async (
  packageId: string,
) => {
  return prisma.packageSchedule.findMany({
    where: {
      packageId,
    },

    orderBy: {
      startDate: "asc",
    },
  });
};

export const findPackageScheduleById = async (
  scheduleId: string,
) => {
  return prisma.packageSchedule.findUnique({
    where: {
      id: scheduleId,
    },
  });
};

export const updatePackageSchedule = async (
  scheduleId: string,
  input: UpdatePackageScheduleInput,
) => {
  const paymentPolicyData =
    input.allowPartialPayment === false
      ? {
          allowPartialPayment: false,
          depositType: null,
          depositValue: null,
          balanceDueDaysBeforeStart: null,
        }
      : {
          ...(input.allowPartialPayment !== undefined && {
            allowPartialPayment: input.allowPartialPayment,
          }),
          ...(input.depositType !== undefined && {
            depositType: input.depositType,
          }),
          ...(input.depositValue !== undefined && {
            depositValue: input.depositValue,
          }),
          ...(input.balanceDueDaysBeforeStart !== undefined && {
            balanceDueDaysBeforeStart:
              input.balanceDueDaysBeforeStart,
          }),
        };

  return prisma.packageSchedule.update({
    where: {
      id: scheduleId,
    },

    data: {
      ...paymentPolicyData,

      ...(input.startDate !== undefined && {
        startDate: input.startDate,
      }),

      ...(input.endDate !== undefined && {
        endDate: input.endDate,
      }),

      ...(input.bookingStartDate !== undefined && {
        bookingStartDate: input.bookingStartDate,
      }),

      ...(input.bookingEndDate !== undefined && {
        bookingEndDate: input.bookingEndDate,
      }),

     ...(input.price !== undefined && {
  price: input.price,
}),

...(input.adultPrice !== undefined && {
  adultPrice: input.adultPrice,
}),

...(input.childPrice !== undefined && {
  childPrice: input.childPrice,
}),

      ...(input.currency !== undefined && {
        currency: input.currency,
      }),

      ...(input.minParticipants !== undefined && {
        minParticipants: input.minParticipants,
      }),

      ...(input.maxParticipants !== undefined && {
        maxParticipants: input.maxParticipants,
      }),

      ...(input.cancellationPolicy !== undefined && {
        cancellationPolicy: input.cancellationPolicy,
      }),
    },
  });
};


export const updatePackageScheduleType = async (
  packageId: string,
  scheduleType: ScheduleType,
) => {
  return prisma.package.update({
    where: {
      id: packageId,
    },

    data: {
      scheduleType,
    },

    select: {
      id: true,
      scheduleType: true,
      updatedAt: true,
    },
  });
};


export const cancelPackageSchedule = async (
  scheduleId: string,
  cancellationReason: string,
) => {
  return prisma.packageSchedule.update({
    where: {
      id: scheduleId,
    },

    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancellationReason,
    },

    select: {
      id: true,
      packageId: true,
      status: true,
      cancelledAt: true,
      cancellationReason: true,
      updatedAt: true,
    },
  });
};

export const findPackageSchedulesByIds = async (
  packageId: string,
  scheduleIds: string[],
) => {
  return prisma.packageSchedule.findMany({
    where: {
      packageId,
      id: {
        in: scheduleIds,
      },
    },
  });
};

export const bulkCancelPackageSchedules = async (
  packageId: string,
  scheduleIds: string[],
  cancellationReason: string,
) => {
  return prisma.packageSchedule.updateMany({
    where: {
      packageId,
      id: {
        in: scheduleIds,
      },
    },

    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancellationReason,
    },
  });
};


export const openPackageSchedule = async (
  scheduleId: string,
) => {
  return prisma.packageSchedule.update({
    where: {
      id: scheduleId,
    },

    data: {
      status: "OPEN",
      publishedAt: new Date(),
    },

    select: {
      id: true,
      packageId: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
};

export const findPackageForPublish = async (
  packageId: string,
) => {
  return prisma.package.findUnique({
    where: {
      id: packageId,
    },
    include: {
      itineraryDays: true,
      schedules: true,
    },
  });
};

export const publishPackage = async (
  packageId: string,
) => {
  return prisma.package.update({
    where: {
      id: packageId,
    },
    data: {
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      status: true,
      updatedAt: true,
    },
  });
};


export const deactivatePackage = async (
  packageId: string,
) => {
  return prisma.package.update({
    where: {
      id: packageId,
    },
    data: {
      status: "INACTIVE",
    },
    select: {
      id: true,
      title: true,
      status: true,
      updatedAt: true,
    },
  });
};


export const findVendorPackages = async (
  userId: string,
  query: GetMyActivitiesQuery,
) => {
  const skip = (query.page - 1) * query.limit;

  const where = {
    createdByUserId: userId,

    ...(query.status && {
      status: query.status,
    }),

    ...(query.search && {
      title: {
        contains: query.search,
        mode: "insensitive" as const,
      },
    }),
  };

  const [packages, total] = await Promise.all([
    prisma.package.findMany({
      where,

      select: {
        id: true,
        title: true,
        status: true,
        durationDays: true,
        createdAt: true,

        schedules: {
          where: {
            status: "OPEN",
          },

          orderBy: {
            startDate: "asc",
          },

          select: {
            id: true,
            price: true,
            adultPrice: true,
            childPrice: true,
            currency: true,
            startDate: true,
            endDate: true,
            availableSeats: true,
          },
        },
      },

      orderBy: {
        createdAt:
          query.sortBy === "oldest"
            ? "asc"
            : "desc",
      },

      skip,
      take: query.limit,
    }),

    prisma.package.count({
      where,
    }),
  ]);

  return {
    packages,
    total,
  };
};

export const searchPublicPackages = async (
  query: SearchPackagesQuery,
  now: Date,
) => {
  const {
    search,
    difficulty,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    page,
    limit,
  } = query;

  const skip = (page - 1) * limit;

  const priceFilter =
    minPrice !== undefined || maxPrice !== undefined
      ? {
          OR: [
            {
              price: {
                ...(minPrice !== undefined && {
                  gte: minPrice,
                }),
                ...(maxPrice !== undefined && {
                  lte: maxPrice,
                }),
              },
            },
            {
              AND: [
                ...(minPrice !== undefined
                  ? [
                      { adultPrice: { gte: minPrice } },
                      { childPrice: { gte: minPrice } },
                    ]
                  : []),
                ...(maxPrice !== undefined
                  ? [
                      {
                        OR: [
                          { adultPrice: { lte: maxPrice } },
                          { childPrice: { lte: maxPrice } },
                        ],
                      },
                    ]
                  : []),
              ],
            },
          ],
        }
      : {};

  const scheduleWhere: any = {
    status: "OPEN",
    availableSeats: {
      gt: 0,
    },
    startDate: {
      gt: now,
      ...(startDate && {
        gte: startDate,
      }),
      ...(endDate && {
        lte: endDate,
      }),
    },
    ...priceFilter,
  };

  const where: any = {
    status: "PUBLISHED",
    visibility: "PUBLIC",

    ...(difficulty && {
      difficulty,
    }),

    ...((minDuration !== undefined || maxDuration !== undefined) && {
      durationDays: {
        ...(minDuration !== undefined && {
          gte: minDuration,
        }),
        ...(maxDuration !== undefined && {
          lte: maxDuration,
        }),
      },
    }),

    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          masterTrek: {
            is: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    }),

    ...((startDate || endDate || minPrice !== undefined || maxPrice !== undefined) && {
      schedules: {
        some: scheduleWhere,
      },
    }),
  };

  const [packages, total] = await Promise.all([
    prisma.package.findMany({
      where,

      select: {
        id: true,
        title: true,
        galleryImages: true,
        difficulty: true,
        durationDays: true,

        location: {
          select: {
            id: true,
            name: true,
          },
        },

        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },

        schedules: {
          where: scheduleWhere,

          select: {
            id: true,
            price: true,
            adultPrice: true,
            childPrice: true,
            currency: true,
            startDate: true,
            endDate: true,
            availableSeats: true,
          },

          orderBy: {
            startDate: "asc",
          },
        },
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.package.count({
      where,
    }),
  ]);

  return {
    packages,
    total,
  };
};

const getScheduleDisplayPrice = (schedule: {
  price: number | null;
  adultPrice: number | null;
  childPrice: number | null;
}): number | null => {
  if (schedule.price !== null) {
    return schedule.price;
  }

  if (
    schedule.adultPrice !== null &&
    schedule.childPrice !== null
  ) {
    return Math.min(
      schedule.adultPrice,
      schedule.childPrice,
    );
  }

  return null;
};

export const findPublicPackageDetail = async (
  packageId: string,
) => {
  const now = new Date();

  return prisma.package.findFirst({
    where: {
      id: packageId,
      status: "PUBLISHED",
      visibility: "PUBLIC",
    },

    select: {
      id: true,

      title: true,
      description: true,

      galleryImages: true,

      difficulty: true,
      durationDays: true,
      distanceKm: true,

      inclusions: true,
      exclusions: true,
      packingList: true,

      fitnessAndExperienceRequirement: true,

      meetingPoint: true,
      instructions: true,

      location: {
        select: {
          id: true,
          name: true,
        },
      },

      createdBy: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },

      itineraryDays: {
        orderBy: {
          dayNumber: "asc",
        },

        select: {
          id: true,
          dayNumber: true,
          title: true,
          description: true,

          startLocation: true,
          endLocation: true,

          distanceKm: true,
          duration: true,
          altitude: true,

          imageUrls: true,
        },
      },

      schedules: {
        where: {
          status: "OPEN",

          startDate: {
            gt: now,
          },

          availableSeats: {
            gt: 0,
          },
        },

        orderBy: {
          startDate: "asc",
        },

        select: {
          id: true,

          startDate: true,
          endDate: true,

          bookingStartDate: true,
          bookingEndDate: true,

          price: true,
          adultPrice: true,
          childPrice: true,
          currency: true,
          

          minParticipants: true,
          maxParticipants: true,
          availableSeats: true,

          cancellationPolicy: true,
        },
      },

      masterTrek: {
        select: {
          name: true,

          overview: true,
          howToReach: true,

          fitnessInfo: true,
          safetyInfo: true,
          permitInfo: true,
          sustainabilityInfo: true,

          bestSeason: true,
          beginnerFriendly: true,

          maxAltitude: true,

         nearbyPlaces: {
  select: {
    distanceFromTrek: true,
    travelTime: true,

    nearbyPlace: {
      select: {
        id: true,
        name: true,
        description: true,
        latitude: true,
        longitude: true,
        imageUrl: true,

        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
},
        },
      },
    },
  });
}; 


export const findPublicPackagesByLocationIds = async (
  locationIds: string[],
  page: number,
  limit: number,
) => {
  const now = new Date();

  const where = {
    status: "PUBLISHED" as const,
    visibility: "PUBLIC" as const,

    locationId: {
      in: locationIds,
    },
  };

  const [packages, total] = await Promise.all([
    prisma.package.findMany({
      where,

      skip: (page - 1) * limit,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        title: true,
        galleryImages: true,
        difficulty: true,
        durationDays: true,

        location: {
          select: {
            id: true,
            name: true,
          },
        },

        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },

        schedules: {
          where: {
            status: "OPEN",
            startDate: {
              gt: now,
            },
            availableSeats: {
              gt: 0,
            },
          },

          orderBy: {
            startDate: "asc",
          },

          select: {
            price: true,
            adultPrice: true,
            childPrice: true,
            currency: true,
          },
        },
      },
    }),

    prisma.package.count({
      where,
    }),
  ]);

  return {
    packages,
    total,
  };
};


export const findLocationAndDescendantIds = async (
  locationId: string,
): Promise<string[]> => {
  const locationIds: string[] = [locationId];
  let currentLevelIds: string[] = [locationId];

  while (currentLevelIds.length > 0) {
    const children = await prisma.location.findMany({
      where: {
        parentId: {
          in: currentLevelIds,
        },
      },
      select: {
        id: true,
      },
    });

    const childIds = children.map((location) => location.id);

    if (childIds.length === 0) {
      break;
    }

    locationIds.push(...childIds);
    currentLevelIds = childIds;
  }

  return locationIds;
};


export const findUpcomingDepartures = async (
  limit: number,
) => {
  return prisma.packageSchedule.findMany({
    where: {
      status: "OPEN",

      startDate: {
        gte: new Date(),
      },

      availableSeats: {
        gt: 0,
      },

      package: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
    },

    orderBy: {
      startDate: "asc",
    },

    take: limit,

    select: {
      id: true,
      startDate: true,
      endDate: true,
      price: true,
adultPrice: true,
childPrice: true,
currency: true,
      availableSeats: true,
      maxParticipants: true,

      package: {
        select: {
          id: true,
          title: true,
          galleryImages: true,
          difficulty: true,
          durationDays: true,

          location: {
            select: {
              id: true,
              name: true,
            },
          },

          createdBy: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },

          masterTrek: {
            select: {
              id: true,
              name: true,
              coverImageUrl: true,
            },
          },
        },
      },
    },
  });
};


