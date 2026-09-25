import type { CreateTeamSchema, InviteTeamVendorSchema, InviteVendorOnboardingSchema, SearchTeamVendorQuerySchema, UpdateTeamSchema } from "../validators/team.validator.js";
import type z from "zod";

export type CreateTeamResponse = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;


export type SearchTeamVendorQuery = z.infer<typeof SearchTeamVendorQuerySchema>;

export type TeamVendorSearchResult = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;

  city: string | null;
  state: string | null;

  vendorType: string | null;
  experienceYears: number | null;
};


export type InviteTeamVendorInput = z.infer<
  typeof InviteTeamVendorSchema
>;

export type TeamInvitationResponse = {
  id: string;
  teamId: string;
  invitedUserId: string | null;
  email: string;
  invitedByUserId: string;
  status: string;
  expiresAt: Date | null;
  createdAt: Date;
};

export type InviteVendorOnboardingInput = z.infer<
  typeof InviteVendorOnboardingSchema
>;

export type VendorOnboardingInvitationResponse = {
  id: string;
  teamId: string;
  invitedUserId: string | null;
  email: string;
  invitedByUserId: string;
  status: string;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};


export type MyTeamInvitation = {
  id: string;
  status: string;
  createdAt: Date;
  expiresAt: Date | null;

  team: {
    id: string;
    name: string;
    logoUrl: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
  };

  invitedBy: {
    id: string;
    name: string | null;
    email: string;
  };
};

export type TeamInvitationActionResponse = {
  id: string;
  teamId: string;
  invitedUserId: string | null;
  email: string;
  invitedByUserId: string;
  status: string;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};


export type TeamMemberResponse = {
  id: string;
  role: string;
  status: string;
  joinedAt: Date | null;

  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    city: string | null;
    state: string | null;

    vendorProfile: {
      vendorType: string | null;
      experienceYears: number | null;
    } | null;
  };
};

export type TeamDetailsResponse = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  _count: {
    members: number;
    packages: number;
  };
};

export type UpdateTeamInput = z.infer<
  typeof UpdateTeamSchema
>;

export type UpdateTeamResponse = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
};


export type TeamPublicProfileResponse = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;

  city: string | null;
  state: string | null;
  country: string | null;

  owner: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };

  members: {
    id: string;
    role: string;

    user: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
      city: string | null;
      state: string | null;
      country: string | null;
    };
  }[];

  experiences: {
  id: string;

  packageId: string;
  scheduleId: string;

  trekName: string;
  difficulty: string | null;

  completedAt: Date;
  duration: number | null;
  altitude: number | null;

  imageUrls: string[];
}[];

  packages: {
    id: string;
    title: string | null;
    description: string | null;
    galleryImages: string[];
  }[];

  createdAt: Date;
};
export type TeamBookingsQuery = {
  status?:
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";
  packageId?: string;
  search?: string;
  limit: number;
  cursor?: string;
};

export type TeamDashboardRepositoryData = {
  successfulPayments: {
    amount: number;
    paidAt: Date | null;
  }[];

  confirmedBookingParticipants: {
    adultCount: number;
    childCount: number;
  }[];

  pendingBookingsCount: number;
  activeTreksCount: number;

  pendingBookings: {
    bookingId: string;

    trekker: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    };

    package: {
      id: string;
      title: string | null;
    };

    participantCount: number;
    totalAmount: number;
    currency: string;
    bookingStatus: string;
    bookedAt: Date;
  }[];

  activeTreks: {
    scheduleId: string;

    package: {
      id: string;
      title: string | null;
      galleryImages: string[];
    };

    startDate: Date;
    endDate: Date;

    bookedSeats: number;
    availableSeats: number;
    maxParticipants: number;

    status: string;
  }[];
};

export type TeamDashboardResponse = {
  stats: {
    totalEarnings: number;
    activeTreks: number;
    pendingBookings: number;
    totalTrekkers: number;
  };

  revenueTrend: {
    period: string;
    revenue: number;
  }[];

  pendingBookings:
    TeamDashboardRepositoryData["pendingBookings"];

  activeTreks:
    TeamDashboardRepositoryData["activeTreks"];
};

export type TeamBookingsRepositoryData = {
  bookings: {
    bookingId: string;

    trekker: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    };

    package: {
      id: string;
      title: string | null;
    };

    schedule: {
      id: string;
      startDate: Date;
      endDate: Date;
    };

    adultCount: number;
    childCount: number;
    participantCount: number;

    totalAmount: number;
    currency: string;
    status: string;
    bookedAt: Date;
  }[];

  totalBookings: number;
  pendingBookings: number;
  confirmedRevenue: number;
  upcomingTreks: number;
};

export type TeamBookingsResponse =
  TeamBookingsRepositoryData & {
    nextCursor: string | null;
    hasNextPage: boolean;
  };