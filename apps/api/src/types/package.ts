import type { DepositType, Difficulty, PackageStatus, ScheduleStatus, ScheduleType } from "@mono/database";
import type { BulkCancelPackageSchedulesSchema, CancelPackageScheduleSchema, CreatePackageItinerarySchema, CreatePackageScheduleSchema, GetMyActivitiesQuerySchema, PackageItineraryDaySchema, SearchPackagesQuerySchema, UpdatePackageBasicsSchema, UpdatePackageInclusionsSchema, UpdatePackageItineraryDaySchema, UpdatePackageScheduleSchema, UpdatePackageScheduleTypeSchema } from "../validators/package.validator.js";
import z from "zod";

export type CreatePackageInput = {
  masterTrekId: string;
  teamId?: string;
};
export type CreatePackageResponse = {
  id: string;
  masterTrekId: string;
  teamId: string | null;
  createdByUserId: string;

  title: string | null;
  description: string | null;
  locationId: string | null;
  difficulty: Difficulty | null;
  durationDays: number | null;
  distanceKm: number | null;

  status: PackageStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdatePackageBasicsInput =
  z.infer<typeof UpdatePackageBasicsSchema>;

export type UpdatePackageBasicsResponse = {
  id: string;
  masterTrekId: string;
  createdByUserId: string;

  title: string | null;
  description: string | null;

  locationId: string | null;
  location: {
    id: string;
    name: string;
    type: string;
  } | null;

  difficulty: Difficulty | null;
  durationDays: number | null;
  distanceKm: number | null;

  galleryImages: string[];

  status: PackageStatus;

  createdAt: Date;
  updatedAt: Date;
};


export type GetPackageItineraryResponse = {
  routeId: string;
  routeName: string;

  days: {
    dayNumber: number;
    title: string;
    description: string | null;

    startLocation: string | null;
    endLocation: string | null;

    distanceKm: number | null;
    duration: string | null;
    altitude: number | null;

    imageUrls: string[];

    activities: {
      id: string;
      name: string;
      description: string | null;
      iconUrl: string | null;
    }[];
  }[];
};


export type GetPackageRoutesResponse = {
  id: string;
  name: string;
  description: string | null;

  distanceKm: number | null;
  difficulty: Difficulty | null;
  elevationGain: number | null;

  ascentTime: string | null;
  descentTime: string | null;

  startPoint: string | null;
  endPoint: string | null;

  isPopular: boolean;
}[];


export type CreatePackageItineraryInput =
  z.infer<typeof CreatePackageItinerarySchema>;

  export type CreatePackageItineraryResponse = {
  packageId: string;
  routeId: string;

  days: {
    id: string;
    dayNumber: number;
    title: string;
    description: string | null;

    startLocation: string | null;
    endLocation: string | null;

    distanceKm: number | null;
    duration: string | null;
    altitude: number | null;

    imageUrls: string[];

  
  }[];
};


export type UpdatePackageItineraryDayInput =
  z.infer<typeof UpdatePackageItineraryDaySchema>;

export type UpdatePackageItineraryDayResponse = {
  id: string;
  packageId: string;

  dayNumber: number;
  title: string;
  description: string | null;

  startLocation: string | null;
  endLocation: string | null;

  distanceKm: number | null;
  duration: string | null;
  altitude: number | null;

  imageUrls: string[];

 
  updatedAt: Date;
};

export type DeletePackageItineraryDayResponse = {
  id: string;
  dayNumber: number;
};


export type AddPackageItineraryDayInput =
  z.infer<typeof PackageItineraryDaySchema>;

export type AddPackageItineraryDayResponse = {
  id: string;
  packageId: string;

  dayNumber: number;
  title: string;
  description: string | null;

  startLocation: string | null;
  endLocation: string | null;

  distanceKm: number | null;
  duration: string | null;
  altitude: number | null;

  imageUrls: string[];


  createdAt: Date;
  updatedAt: Date;
};

export type UpdatePackageInclusionsInput =
  z.infer<typeof UpdatePackageInclusionsSchema>;

export type UpdatePackageInclusionsResponse = {
  id: string;

  inclusions: string[];
  exclusions: string[];
  packingList: string[];

  fitnessAndExperienceRequirement: string | null;

  updatedAt: Date;
};

export type CreatePackageScheduleInput =
  z.infer<typeof CreatePackageScheduleSchema>;

export type CreatePackageScheduleResponse = {
  id: string;
  packageId: string;

  startDate: Date;
  endDate: Date;

  bookingStartDate: Date | null;
  bookingEndDate: Date | null;

  price: number | null;
adultPrice: number | null;
childPrice: number | null;
currency: string;

  allowPartialPayment: boolean;
  depositType: DepositType | null;
  depositValue: number | null;
  balanceDueDaysBeforeStart: number | null;

  minParticipants: number;
  maxParticipants: number;
  availableSeats: number;

  cancellationPolicy: string | null;

  status: ScheduleStatus;

  createdAt: Date;
  updatedAt: Date;
};

export type PackageScheduleDisplayStatus =
  | "NEW"
  | "AVAILABLE"
  | "SOLD_OUT"
  | "EXPIRED"
  | "CANCELLED"
  | "CLOSED"
  | "COMPLETED";

export type GetPackageSchedulesResponse = {
  id: string;
  packageId: string;

  startDate: Date;
  endDate: Date;

  bookingStartDate: Date | null;
  bookingEndDate: Date | null;

  price: number | null;
adultPrice: number | null;
childPrice: number | null;
currency: string;

  allowPartialPayment: boolean;
  depositType: DepositType | null;
  depositValue: number | null;
  balanceDueDaysBeforeStart: number | null;

  minParticipants: number;
  maxParticipants: number;
  availableSeats: number;

  cancellationPolicy: string | null;

  status: ScheduleStatus;
  displayStatus: PackageScheduleDisplayStatus;

  publishedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;

  createdAt: Date;
  updatedAt: Date;
}[];


export type UpdatePackageScheduleInput =
  z.infer<typeof UpdatePackageScheduleSchema>;

export type UpdatePackageScheduleResponse = {
  id: string;
  packageId: string;

  startDate: Date;
  endDate: Date;

  bookingStartDate: Date | null;
  bookingEndDate: Date | null;

  price: number | null;
  adultPrice: number | null;
  childPrice: number | null;
  currency: string;

  allowPartialPayment: boolean;
  depositType: DepositType | null;
  depositValue: number | null;
  balanceDueDaysBeforeStart: number | null;

  minParticipants: number;
  maxParticipants: number;
  availableSeats: number;

  cancellationPolicy: string | null;

  status: ScheduleStatus;

  createdAt: Date;
  updatedAt: Date;
};


export type UpdatePackageScheduleTypeInput =
  z.infer<typeof UpdatePackageScheduleTypeSchema>;

export type UpdatePackageScheduleTypeResponse = {
  id: string;
  scheduleType: ScheduleType;
  updatedAt: Date;
};

export type CancelPackageScheduleInput =
  z.infer<typeof CancelPackageScheduleSchema>;

export type CancelPackageScheduleResponse = {
  id: string;
  packageId: string;
  status: ScheduleStatus;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  updatedAt: Date;
};

export type BulkCancelPackageSchedulesInput =
  z.infer<typeof BulkCancelPackageSchedulesSchema>;

export type BulkCancelPackageSchedulesResponse = {
  cancelledCount: number;
};

export type OpenPackageScheduleResponse = {
  id: string;
  packageId: string;
  status: ScheduleStatus;
  publishedAt: Date | null;
  updatedAt: Date;
};


export type PublishPackageResponse = {
  id: string;
  title: string | null;
  status: PackageStatus;
  updatedAt: Date;
};

export type DeactivatePackageResponse = {
  id: string;
  title: string | null;
  status: PackageStatus;
  updatedAt: Date;
};


export type GetMyActivitiesQuery =
  z.infer<typeof GetMyActivitiesQuerySchema>;

export type MyActivityItem = {
  id: string;
  title: string | null;
  status: PackageStatus;
  durationDays: number | null;

  nextSchedule: {
    id: string;
    price: number | null;
    adultPrice: number | null;
    childPrice: number | null;
    currency: string;
    startDate: Date;
    endDate: Date;
    availableSeats: number;
  } | null;
};

export type GetMyActivitiesResponse = {
  items: MyActivityItem[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};


export type SearchPackagesQuery = z.infer<
  typeof SearchPackagesQuerySchema
>;

export type PublicPackageSearchItem = {
  id: string;
  title: string | null;
  galleryImages: string[];

  location: {
    id: string;
    name: string;
  } | null;

 difficulty: Difficulty | null;

  durationDays: number | null;

  trekLeader: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  } | null;

  rating: number | null;

  startingPrice: number | null;
  originalPrice: number | null;
  currency: string | null;
};

export type SearchPackagesResponse = {
  items: PublicPackageSearchItem[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
