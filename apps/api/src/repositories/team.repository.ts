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
