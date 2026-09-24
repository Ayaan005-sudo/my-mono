import { prisma } from "../utils/prisma.js";
import { uuidv7 } from "uuidv7";
import type { CreateTeamInput, CreateTeamResponse } from "../types/index.js";

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


