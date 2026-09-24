import {CreateMasterTrekSchema,UpdateMasterTrekSchema} from "../validators/master-trek.validator.js";
import {Prisma} from "@mono/database";
import z from "zod";

export type CreateMasterTrekRequest = z.infer<
  typeof CreateMasterTrekSchema
>;

export const masterTrekAdminInclude = {
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

  packages: true,
} satisfies Prisma.MasterTrekInclude;

export type UpdateMasterTrekRequest = z.infer<
  typeof UpdateMasterTrekSchema
>;

export type MasterTrekByIdResponse =
  Prisma.MasterTrekGetPayload<{
    include: typeof masterTrekAdminInclude;
  }>;

export type MasterTrekListItemResponse =
  Prisma.MasterTrekGetPayload<{
    include: {
      location: true;
    };
  }>;

export type GetAllMasterTreksResponse = {
  treks: MasterTrekListItemResponse[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type MasterTrekVendorListItemResponse =
  Prisma.MasterTrekGetPayload<{
    include: {
      location: true;
    };
  }>;

export type GetAllMasterTreksVendorResponse = {
  treks: MasterTrekVendorListItemResponse[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type MasterTrekVendorResponse =
  Prisma.MasterTrekGetPayload<{
    include: {
      location: true;
      createdBy: true;
      activities: true;
      faqs: {
        orderBy: {
          order: "asc";
        };
      };
      routes: {
        include: {
          itineraryDays: {
            include: {
              activities: true;
            };
          };
        };
      };
      nearbyPlaces: {
        include: {
          nearbyPlace: {
            include: {
              location: true;
            };
          };
        };
      };
    };
  }>;

export type MasterTrekUserListItemResponse =
  Prisma.MasterTrekGetPayload<{
    include: {
      location: true;
    };
  }> & {
    startingPrice: number | null;
    currency: string | null;
  };

export type GetAllMasterTreksUserResponse = {
  treks: MasterTrekUserListItemResponse[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type MasterTrekUserResponse =
  Prisma.MasterTrekGetPayload<{
    include: {
      location: true;
      activities: true;
      faqs: {
        orderBy: {
          order: "asc";
        };
      };
      routes: {
        include: {
          itineraryDays: {
            include: {
              activities: true;
            };
          };
        };
      };
      nearbyPlaces: {
        include: {
          nearbyPlace: {
            include: {
              location: true;
            };
          };
        };
      };
    };
  }> & {
    startingPrice: number | null;
    currency: string | null;
  };
