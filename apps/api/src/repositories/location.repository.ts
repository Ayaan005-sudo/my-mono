import { prisma } from "../utils/prisma.js";


export const searchLocations = async (
  search: string,
  limit: number = 10,
) => {
  return prisma.location.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    take: limit,
    orderBy: {
      name: "asc",
    },
  });
};


export const findLocationByIdRepo = async (
  locationId: string,
) => {
  return prisma.location.findUnique({
    where: {
      id: locationId,
    },
  });
};


export const getLocationChildren = async (
  locationId: string,
) => {
  return prisma.location.findMany({
    where: {
      parentId: locationId,
    },

    orderBy: {
      name: "asc",
    },

    select: {
      id: true,
      name: true,
      type: true,
      sourceCode: true,
      localBodyType: true,
      parentId: true,
    },
  });
};