import type { MasterTrek } from "@mono/database";
import { uuidv7 } from "uuidv7";
import type { CreatePackageInput, UpdatePackageBasicsInput } from "../types/package.js";
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