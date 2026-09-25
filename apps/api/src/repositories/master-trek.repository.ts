import {prisma} from "../utils/prisma.js";
import type { MasterTrekListItemResponse, MasterTrekVendorListItemResponse, MasterTrekVendorResponse } from "../types/index.js";

export const findMasterTrekById = async (trekId: string) => {
    console.log("trekId :",trekId );
  return prisma.masterTrek.findUnique({
    where: {
      id: trekId,
    },
  });
};

export const createActivity = async (
  id: string,
  name: string,
  description?: string,
  iconUrl?: string,
) => {
  return prisma.activity.upsert({
    where: {
      name,
    },

    update: {
      description,
      iconUrl,
    },

    create: {
      id,
      name,
      description,
      iconUrl,
      trekIds: [],
      itineraryDayIds: [],
    },
  });
};

export const createMasterTrekRepo = async (data: any) => {
  return prisma.masterTrek.create({
    data,
  });
};

export const createNearbyPlace = async (
  data: {
    id: string;
    name: string;
    description?: string;
    locationId?: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
  },
) => {
  return prisma.nearbyPlace.create({
    data,
  });
};

export const createTrekNearbyPlace = async (
  data: {
    id: string;
    trekId: string;
    nearbyPlaceId: string;
    distanceFromTrek?: number;
    travelTime?: string;
  },
) => {
  return prisma.trekNearbyPlace.create({
    data,
  });
};

export const addTrekToActivities = async (
  activityIds: string[],
  trekId: string,
) => {
  return Promise.all(
    activityIds.map((activityId) =>
      prisma.activity.update({
        where: {
          id: activityId,
        },
        data: {
          trekIds: {
            push: trekId,
          },
        },
      }),
    ),
  );
};


export const findLocationById = async (
  locationId: string,
) => {
  return prisma.location.findUnique({
    where: {
      id: locationId,
    },
  });
};

export const deleteRoutesByTrekId = async (
  trekId: string,
) => {
  return prisma.trekRoute.deleteMany({
    where: {
      masterTrekId: trekId,
    },
  });
};

export const updateMasterTrekRepo = async (
  trekId: string,
  data: any,
) => {
  return prisma.masterTrek.update({
    where: {
      id: trekId,
    },
    data,
  });
};

export const findNearbyLinks = async (
  trekId: string,
) => {
  return prisma.trekNearbyPlace.findMany({
    where: {
      trekId,
    },
  });
};


export const deleteNearbyLinks = async (
  trekId: string,
) => {
  return prisma.trekNearbyPlace.deleteMany({
    where: {
      trekId,
    },
  });
};

export const deleteNearbyPlacesByIds = async (
  ids: string[],
) => {
  if (!ids.length) return;

  return prisma.nearbyPlace.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};



export const getCompleteMasterTrek = async (
  trekId: string,
) => {
  return prisma.masterTrek.findUnique({
    where: {
      id: trekId,
    },

    include: {
      location : true,
      createdBy: true,
      activities: true,

      routes: {
        include: {
          itineraryDays: {
            include: {
              activities: true,
            },
          },
        },
      },

      nearbyPlaces: {
        include: {
          nearbyPlace: {
            include :{
              location: true,
            }
          }
        },
      },
      faqs: {
        orderBy: {
          order: "asc",
        },
      },
       packages: true,
    },
  });
};


export const getMasterTrekByIdAdmin = async (
  trekId: string,
) => {
  return prisma.masterTrek.findUnique({
    where: {
      id: trekId,
    },

    include: {
      location:true,
      createdBy: true,
      activities: true,

      routes: {
        include: {
          itineraryDays: {
            include: {
              activities: true,
            },
          },
        },
      },

      nearbyPlaces: {
        include: {
          nearbyPlace:{
            include:{
              location:true,
            }
          }

        },
      },
      faqs: {
        orderBy: {
          order: "asc",
        },
      },

      packages: true,
    },
  });
};


export const deleteMasterTrekById= async (
  trekId: string,
) => {
  return prisma.masterTrek.delete({
    where: {
      id: trekId,
    },
  });
};

export const getAllMasterTreksAdmin = async (
  limit: number,
  cursor?: string,
): Promise<MasterTrekListItemResponse[]> => {
  return prisma.masterTrek.findMany({
    take: limit + 1,

    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1,
    }),

    include: {
      location: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllMasterTreksVendor = async (
  limit: number,
  cursor?: string,
): Promise<MasterTrekVendorListItemResponse[]> => {
  return prisma.masterTrek.findMany({
    take: limit + 1,

    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1,
    }),

    include: {
      location: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMasterTrekByIdVendor = async (
  trekId: string,
): Promise<MasterTrekVendorResponse | null> => {
  return prisma.masterTrek.findUnique({
    where: {
      id: trekId,
    },

    include: {
      location: true,

      createdBy: true,

      activities: true,

      routes: {
        include: {
          itineraryDays: {
            include: {
              activities: true,
            },
          },
        },
      },

      nearbyPlaces: {
        include: {
          nearbyPlace: {
            include: {
              location: true,
            },
          },
        },
      },

      faqs: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
};

export const getAllMasterTreksUser = async (
  limit: number,
  cursor?: string,
) => {
  const now = new Date();

  return prisma.masterTrek.findMany({
    take: limit + 1,

    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1,
    }),

    include: {
      location: true,
      packages: {
        where: {
          visibility: "PUBLIC",
          status: "PUBLISHED",
        },
        include: {
          schedules: {
            where: {
              status: "OPEN",
              availableSeats: {
                gt: 0,
              },
              startDate: {
                gte: now,
              },
            },
            orderBy: {
              startDate: "asc",
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMasterTrekByIdUser = async (
  trekId: string,
) => {
  const now = new Date();

  return prisma.masterTrek.findUnique({
    where: {
      id: trekId,
    },

    include: {
      location: true,
      activities: true,

      routes: {
        include: {
          itineraryDays: {
            include: {
              activities: true,
            },
          },
        },
      },

      nearbyPlaces: {
        include: {
          nearbyPlace: {
            include: {
              location: true,
            },
          },
        },
      },

      faqs: {
        orderBy: {
          order: "asc",
        },
      },

      packages: {
        where: {
          visibility: "PUBLIC",
          status: "PUBLISHED",
        },
        include: {
          schedules: {
            where: {
              status: "OPEN",
              availableSeats: {
                gt: 0,
              },
              startDate: {
                gte: now,
              },
            },
            orderBy: {
              startDate: "asc",
            },
          },
        },
      },
    },
  });
};




