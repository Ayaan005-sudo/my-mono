import type { z } from "@hono/zod-openapi";
import type { RejectVendorApplicationSchema } from "../validators/admin-vendor.validator.js";

export type RejectVendorApplicationInput =
  z.infer<typeof RejectVendorApplicationSchema>;

export type PendingVendorApplicationResponse = {
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
  submittedAt: Date | null;
  user: {
    name: string | null;
    email: string;
    avatarUrl: string | null;
    city: string | null;
    state: string | null;
  };
};

export type VendorApplicationDetailsResponse = {
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
  experienceYears: number | null;
  treksLed: number | null;
  regionsWorkedIn: string[];
  isAgeEligible: boolean;
  hasRequiredExperience: boolean;
  hasFirstAidCertification: boolean;
  hasSmartphoneAndWhatsApp: boolean;
  agreesToInsuranceTerms: boolean;
  agreesToSafetyStandards: boolean;
  verificationStatus:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
  submittedAt: Date | null;
  user: {
    name: string | null;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pinCode: string | null;
    languages: string[];
    userExperiences: {
      id: string;
      description: string;
      imageUrls: string[];
      verificationStatus:
        | "PENDING"
        | "APPROVED"
        | "REJECTED";
    }[];
    userCertifications: {
      id: string;
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
    }[];
  };
};

export type VendorReviewResponse = {
  id: string;
  userId: string;
  verificationStatus:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
  verifiedAt: Date | null;
  rejectionReason: string | null;
};

