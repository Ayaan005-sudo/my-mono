

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