import type { z } from "@hono/zod-openapi";
import type {
  UpdateOnboardingProfileSchema,
  CreateVendorProfileSchema,
  UpdateVendorEligibilitySchema,
  UpdateVendorExpertiseSchema,
  CreateUserExperienceSchema,
  CreateUserCertificationSchema,
} from "../validators/onboarding.validator.js";

export type UpdateOnboardingProfileInput =
  z.infer<typeof UpdateOnboardingProfileSchema>;

export type OnboardingProfileResponse = {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pinCode: string | null;
  languages: string[];
  avatarUrl: string | null;
};

export type UpdateUserProfileData = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  languages: string[];
  avatarUrl?: string;
};

export type CreateVendorProfileInput =
  z.infer<typeof CreateVendorProfileSchema>;

export type VendorProfileResponse = {
  id: string;
  userId: string;
  vendorType:
    | "TREK_LEADER"
    | "LOCAL_TRAIL_GUIDE"
    | "MOUNTAINEER"
    | "EXPERIENCE_ORGANIZER"
    | "ACTIVITY_HOST"
    | "CAMP_OPERATOR"
    | null;
  verificationStatus:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
};

export type UpdateVendorEligibilityInput =
  z.infer<typeof UpdateVendorEligibilitySchema>;

export type VendorEligibilityResponse = {
  id: string;
  userId: string;
  isAgeEligible: boolean;
  hasRequiredExperience: boolean;
  hasFirstAidCertification: boolean;
  hasSmartphoneAndWhatsApp: boolean;
  agreesToInsuranceTerms: boolean;
  agreesToSafetyStandards: boolean;
};

export type UpdateVendorExpertiseInput =
  z.infer<typeof UpdateVendorExpertiseSchema>;

export type VendorExpertiseResponse = {
  id: string;
  userId: string;
  experienceYears: number | null;
  treksLed: number | null;
  regionsWorkedIn: string[];
};

export type CreateUserExperienceInput =
  z.infer<typeof CreateUserExperienceSchema>;

export type UserExperienceResponse = {
  id: string;
  userId: string;
  description: string;
  imageUrls: string[];
  verificationStatus:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
};

export type CreateUserCertificationInput =
  z.infer<typeof CreateUserCertificationSchema>;

export type UserCertificationResponse = {
  id: string;
  userId: string;
  title: string;
  issuingOrganization: string;
  certificateNumber: string | null;
  certificateUrl: string;
  issuedAt: Date | null;
  expiresAt: Date | null;
  verificationStatus:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
};

export type VendorSubmitResponse = {
  id: string;
  userId: string;
  verificationStatus:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
  submittedAt: Date | null;
};




