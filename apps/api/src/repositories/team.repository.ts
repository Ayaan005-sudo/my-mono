import { prisma } from "../utils/prisma.js";
import { uuidv7 } from "uuidv7";
import type { CreateTeamInput, CreateTeamResponse, MyTeamInvitation } from "../types/index.js";

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