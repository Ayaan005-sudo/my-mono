import { logger } from "../utils/logger.js";
import * as OnboardingRepository from "../repositories/onboarding.repository.js";
import type {
  UpdateOnboardingProfileInput,
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
import { CustomError } from "../utils/custom-error.js";

export const updateOnboardingProfileService = async (
  userId: string,
  data: UpdateOnboardingProfileInput,
): Promise<OnboardingProfileResponse> => {
  const user = await OnboardingRepository.findUserById(userId);

  if (!user) {
    logger.warn(
      { userId },
      "Onboarding profile update failed: user not found",
    );

    throw new CustomError("User not found", 404);
  }

  const { firstName, lastName, ...profileData } = data;

  const name = `${firstName} ${lastName}`.trim();

  const updatedUser = await OnboardingRepository.updateOnboardingProfile(
    userId,
    {
      name,
      ...profileData,
    },
  );

  logger.info(
    { userId },
    "User onboarding profile updated",
  );

  return updatedUser;
};

export const createVendorProfileService = async (
  userId: string,
  data: CreateVendorProfileInput,
): Promise<VendorProfileResponse> => {
  const existingProfile =
    await OnboardingRepository.findVendorProfileByUserId(userId);

  if (existingProfile) {
    logger.warn(
      { userId },
      "Vendor profile creation failed: vendor profile already exists",
    );

    throw new CustomError(
      "Vendor profile already exists",
      409,
    );
  }

  const profile = await OnboardingRepository.createVendorProfile(
    userId,
    data,
  );

  logger.info(
    { userId, vendorProfileId: profile.id },
    "Vendor profile created successfully",
  );

  return profile;
};

export const updateVendorEligibilityService = async (
  userId: string,
  data: UpdateVendorEligibilityInput,
): Promise<VendorEligibilityResponse> => {
  const existingProfile =
    await OnboardingRepository.findVendorProfileByUserId(userId);

  if (!existingProfile) {
    logger.warn(
      { userId },
      "Vendor eligibility update failed: vendor profile not found",
    );

    throw new CustomError("Vendor profile not found", 404);
  }

  const updatedProfile = await OnboardingRepository.updateVendorEligibility(
    userId,
    data,
  );

  logger.info(
    { userId, vendorProfileId: updatedProfile.id },
    "Vendor eligibility updated successfully",
  );

  return updatedProfile;
};

export const updateVendorExpertiseService = async (
  userId: string,
  data: UpdateVendorExpertiseInput,
): Promise<VendorExpertiseResponse> => {
  const existingProfile =
    await OnboardingRepository.findVendorProfileByUserId(userId);

  if (!existingProfile) {
    logger.warn(
      { userId },
      "Vendor expertise update failed: vendor profile not found",
    );

    throw new CustomError(
      "Vendor profile not found",
      404,
    );
  }

  const updatedProfile = await OnboardingRepository.updateVendorExpertise(
    userId,
    data,
  );

  logger.info(
    { userId, vendorProfileId: updatedProfile.id },
    "Vendor expertise updated successfully",
  );

  return updatedProfile;
};

export const createUserExperienceService = async (
  userId: string,
  data: CreateUserExperienceInput,
): Promise<UserExperienceResponse> => {
  const existingProfile =
    await OnboardingRepository.findVendorProfileByUserId(userId);

  if (!existingProfile) {
    logger.warn(
      { userId },
      "User experience creation failed: vendor profile not found",
    );

    throw new CustomError("Vendor profile not found", 404);
  }

  const experience = await OnboardingRepository.createUserExperience(
    userId,
    data,
  );

  logger.info(
    { userId, experienceId: experience.id },
    "User experience created successfully",
  );

  return experience;
};

export const createUserCertificationService = async (
  userId: string,
  data: CreateUserCertificationInput,
): Promise<UserCertificationResponse> => {
  const existingProfile =
    await OnboardingRepository.findVendorProfileByUserId(userId);

  if (!existingProfile) {
    logger.warn(
      { userId },
      "Vendor certification creation failed: vendor profile not found",
    );

    throw new CustomError("Vendor profile not found", 404);
  }

  const certification =
    await OnboardingRepository.createUserCertification(
      userId,
      data,
    );

  logger.info(
    { userId, certificationId: certification.id },
    "Vendor certification created successfully",
  );

  return certification;
};

export const submitVendorProfileService = async (
  userId: string,
): Promise<VendorSubmitResponse> => {
  const vendorProfile =
    await OnboardingRepository.findVendorProfileByUserId(userId);

  if (!vendorProfile) {
    logger.warn(
      { userId },
      "Vendor profile submission failed: vendor profile not found",
    );

    throw new CustomError("Vendor profile not found", 404);
  }

  if (vendorProfile.verificationStatus === "PENDING") {
    logger.warn(
      { userId },
      "Vendor profile submission failed: vendor profile already submitted",
    );

    throw new CustomError(
      "Vendor profile already submitted",
      400,
    );
  }

  if (vendorProfile.verificationStatus === "APPROVED") {
    logger.warn(
      { userId },
      "Vendor profile submission failed: vendor profile already approved",
    );

    throw new CustomError(
      "Vendor profile already approved",
      400,
    );
  }

  const result = await OnboardingRepository.submitVendorProfile(userId);

  logger.info(
    { userId, vendorProfileId: result.id },
    "Vendor profile submitted successfully",
  );

  return result;
};





