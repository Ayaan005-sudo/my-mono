import type { Context } from "hono";
import type {
  UpdateOnboardingProfileInput,
  CreateVendorProfileInput,
  UpdateVendorEligibilityInput,
  UpdateVendorExpertiseInput,
  CreateUserExperienceInput,
  CreateUserCertificationInput,
} from "../types/index.js";
import * as OnboardingService from "../services/onboarding.service.js";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";

export const updateOnboardingProfile = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;

    const body = await c.req.json<UpdateOnboardingProfileInput>();

    const result = await OnboardingService.updateOnboardingProfileService(
      userId,
      body,
    );

    logger.info(
      { userId },
      "Onboarding profile updated successfully",
    );

    return ApiResponse.success(
      "Onboarding profile updated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error({ error }, "Failed to update onboarding profile");

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to update onboarding profile",
      500,
    ).send(c);
  }
};

export const createVendorProfile = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;

    const body = await c.req.json<CreateVendorProfileInput>();

    const result = await OnboardingService.createVendorProfileService(
      userId,
      body,
    );

    logger.info(
      { userId },
      "Vendor profile created successfully",
    );

    return ApiResponse.success(
      "Vendor profile created successfully",
      result,
      201,
    ).send(c);
  } catch (error) {
    logger.error({ error }, "Failed to create vendor profile");

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to create vendor profile",
      500,
    ).send(c);
  }
};

export const updateVendorEligibility = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;

    const body = await c.req.json<UpdateVendorEligibilityInput>();

    const result = await OnboardingService.updateVendorEligibilityService(
      userId,
      body,
    );

    logger.info(
      { userId },
      "Vendor eligibility updated successfully",
    );

    return ApiResponse.success(
      "Vendor eligibility updated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error({ error }, "Failed to update vendor eligibility");

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to update vendor eligibility",
      500,
    ).send(c);
  }
};

export const updateVendorExpertise = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;

    const body = await c.req.json<UpdateVendorExpertiseInput>();

    const result = await OnboardingService.updateVendorExpertiseService(
      userId,
      body,
    );

    logger.info(
      { userId },
      "Vendor expertise updated successfully",
    );

    return ApiResponse.success(
      "Vendor expertise updated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error({ error }, "Failed to update vendor expertise");

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to update vendor expertise",
      500,
    ).send(c);
  }
};

export const createUserExperience = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;

    const body = await c.req.json<CreateUserExperienceInput>();

    const result = await OnboardingService.createUserExperienceService(
      userId,
      body,
    );

    logger.info(
      { userId },
      "Experience added successfully",
    );

    return ApiResponse.success(
      "Experience added successfully",
      result,
      201,
    ).send(c);
  } catch (error) {
    logger.error({ error }, "Failed to add experience");

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to add experience",
      500,
    ).send(c);
  }
};

export const createUserCertification = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;

    const body =
      await c.req.json<CreateUserCertificationInput>();

    const result =
      await OnboardingService.createUserCertificationService(
        userId,
        body,
      );

    logger.info(
      { userId },
      "Certification added successfully",
    );

    return ApiResponse.success(
      "Certification added successfully",
      result,
      201,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to add certification",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to add certification",
      500,
    ).send(c);
  }
};

export const submitVendorProfile = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;

    const result =
      await OnboardingService.submitVendorProfileService(
        userId,
      );

    logger.info(
      { userId },
      "Vendor profile submitted successfully",
    );

    return ApiResponse.success(
      "Vendor profile submitted successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to submit vendor profile",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to submit vendor profile",
      500,
    ).send(c);
  }
};




