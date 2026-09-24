import { prisma } from "../utils/prisma.js";
import { uuidv7 } from "uuidv7";
import type {
  UpdateUserProfileData,
  OnboardingProfileResponse,
  CreateVendorProfileInput,
  VendorProfileResponse,
  UpdateVendorEligibilityInput,
  VendorEligibilityResponse,
  UpdateVendorExpertiseInput,
  VendorExpertiseResponse,
  CreateUserExperienceInput,
  UserExperienceResponse,
  CreateUserCertificationInput,
  UserCertificationResponse,
  VendorSubmitResponse,
} from "../types/index.js";

export const updateOnboardingProfile = async (
  userId: string,
  data: UpdateUserProfileData,
): Promise<OnboardingProfileResponse> => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      country: true,
      pinCode: true,
      languages: true,
      avatarUrl: true,
    },
  });
};

export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const createVendorProfile = async (
  userId: string,
  data: CreateVendorProfileInput,
): Promise<VendorProfileResponse> => {
  return prisma.vendorProfile.create({
    data: {
      id: uuidv7(),
      userId,
      vendorType: data.vendorType,
    },
    select: {
      id: true,
      userId: true,
      vendorType: true,
      verificationStatus: true,
    },
  });
};

export const findVendorProfileByUserId = async (userId: string) => {
  return prisma.vendorProfile.findUnique({
    where: {
      userId,
    },
  });
};

export const updateVendorEligibility = async (
  userId: string,
  data: UpdateVendorEligibilityInput,
): Promise<VendorEligibilityResponse> => {
  return prisma.vendorProfile.update({
    where: {
      userId,
    },
    data,
    select: {
      id: true,
      userId: true,
      isAgeEligible: true,
      hasRequiredExperience: true,
      hasFirstAidCertification: true,
      hasSmartphoneAndWhatsApp: true,
      agreesToInsuranceTerms: true,
      agreesToSafetyStandards: true,
    },
  });
};

export const updateVendorExpertise = async (
  userId: string,
  data: UpdateVendorExpertiseInput,
): Promise<VendorExpertiseResponse> => {
  return prisma.vendorProfile.update({
    where: {
      userId,
    },
    data,
    select: {
      id: true,
      userId: true,
      experienceYears: true,
      treksLed: true,
      regionsWorkedIn: true,
    },
  });
};

export const createUserExperience = async (
  userId: string,
  data: CreateUserExperienceInput,
): Promise<UserExperienceResponse> => {
  return prisma.userExperience.create({
    data: {
      id: uuidv7(),
      userId,
      description: data.description,
      imageUrls: data.imageUrls,
    },
    select: {
      id: true,
      userId: true,
      description: true,
      imageUrls: true,
      verificationStatus: true,
    },
  });
};

export const createUserCertification = async (
  userId: string,
  data: CreateUserCertificationInput,
): Promise<UserCertificationResponse> => {
  return prisma.userCertification.create({
    data: {
      id: uuidv7(),
      userId,
      title: data.title,
      issuingOrganization: data.issuingOrganization,
      certificateNumber: data.certificateNumber,
      certificateUrl: data.certificateUrl,
      issuedAt: data.issuedAt
        ? new Date(data.issuedAt)
        : null,
      expiresAt: data.expiresAt
        ? new Date(data.expiresAt)
        : null,
    },
    select: {
      id: true,
      userId: true,
      title: true,
      issuingOrganization: true,
      certificateNumber: true,
      certificateUrl: true,
      issuedAt: true,
      expiresAt: true,
      verificationStatus: true,
    },
  });
};

export const submitVendorProfile = async (
  userId: string,
): Promise<VendorSubmitResponse> => {
  return prisma.vendorProfile.update({
    where: {
      userId,
    },
    data: {
      verificationStatus: "PENDING",
      submittedAt: new Date(),
    },
    select: {
      id: true,
      userId: true,
      verificationStatus: true,
      submittedAt: true,
    },
  });
};





