import type { MasterTrek } from "@mono/database";
import { uuidv7 } from "uuidv7";
import type { AddPackageItineraryDayInput, CreatePackageInput, CreatePackageItineraryInput, UpdatePackageBasicsInput, UpdatePackageInclusionsInput, UpdatePackageItineraryDayInput } from "../types/package.js";
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

