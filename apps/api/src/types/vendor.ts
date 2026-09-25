

export type VendorPublicProfileResponse = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;

  location: {
    city: string | null;
    state: string | null;
    country: string | null;
  };

  languages: string[];

  professionalInfo: {
    vendorType: string | null;
    experienceYears: number | null;
    treksLed: number | null;
    regionsWorkedIn: string[];
  };

  experiences: {
  id: string;

  description: string;
  imageUrls: string[];

  trekName: string | null;
  difficulty: string | null;
  roleDuringTrek: string | null;
  completedAt: Date | null;
  duration: number | null;
  altitude: number | null;
  proofUrl: string | null;

  verificationStatus: string;

  source: "SELF_SUBMITTED" | "PLATFORM";
  packageId: string | null;
  scheduleId: string | null;
}[];

  certifications: {
    id: string;
    title: string;
    issuingOrganization: string;
    certificateNumber: string | null;
    certificateUrl: string;
    issuedAt: Date | null;
    expiresAt: Date | null;
    verificationStatus: string;
  }[];

  badges: {
    id: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
  }[];

  packages: {
    id: string;
    title: string | null;
    description: string | null;
    galleryImages: string[];
  }[];}



  export type VendorDashboardStats = {
  totalEarnings: number;
  activeTreks: number;
  pendingBookings: number;
  totalTrekkers: number;
};

export type VendorRevenueTrendItem = {
  period: string;
  revenue: number;
};

export type VendorPendingBookingItem = {
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
};

export type VendorActiveTrekItem = {
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
};

export type VendorDashboardResponse = {
  stats: VendorDashboardStats;
  revenueTrend: VendorRevenueTrendItem[];
  pendingBookings: VendorPendingBookingItem[];
  activeTreks: VendorActiveTrekItem[];
};


export type VendorBookingListItem = {
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
};

export type VendorBookingsSummary = {
  totalBookings: number;
  pendingBookings: number;
  confirmedRevenue: number;
  upcomingTreks: number;
};

export type VendorBookingsResponse = {
  summary: VendorBookingsSummary;
  bookings: VendorBookingListItem[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type VendorDashboardRepositoryData = {
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
  pendingBookings: VendorPendingBookingItem[];
  activeTreks: VendorActiveTrekItem[];
};