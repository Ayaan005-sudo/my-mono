import { logger } from "../utils/logger.js";
import * as AdminVendorRepository from "../repositories/admin-vendor.repository.js";
import type {
  PendingVendorApplicationResponse,
  RejectVendorApplicationInput,
  VendorApplicationDetailsResponse,
  VendorReviewResponse,
} from "../types/index.js";
import { CustomError } from "../utils/custom-error.js";

export const getPendingVendorApplicationsService = async (): Promise<
  PendingVendorApplicationResponse[]
> => {
  const applications =
    await AdminVendorRepository.getPendingVendorApplications();

  logger.info(
    { count: applications.length },
    "Pending vendor applications fetched successfully",
  );

  return applications;
};

export const getVendorApplicationByUserIdService = async (
  userId: string,
): Promise<VendorApplicationDetailsResponse> => {
  const application =
    await AdminVendorRepository.getVendorApplicationByUserId(userId);

  if (!application) {
    logger.warn(
      { userId },
      "Vendor application not found",
    );

    throw new CustomError("Vendor application not found", 404);
  }

  logger.info(
    { userId, vendorProfileId: application.id },
    "Vendor application details fetched successfully",
  );

  return application;
};

export const approveVendorApplicationService = async (
  userId: string,
): Promise<VendorReviewResponse> => {
  const application =
    await AdminVendorRepository.getVendorApplicationByUserId(userId);

  if (!application) {
    logger.warn(
      { userId },
      "Vendor application approval failed: vendor application not found",
    );

    throw new CustomError(
      "Vendor application not found",
      404,
    );
  }

  if (application.verificationStatus !== "PENDING") {
    logger.warn(
      {
        userId,
        verificationStatus: application.verificationStatus,
      },
      "Vendor application approval failed: application is not pending",
    );

    throw new CustomError(
      "Only pending vendor applications can be approved",
      400,
    );
  }

  const result =
    await AdminVendorRepository.approveVendorApplication(userId);

  logger.info(
    {
      userId,
      vendorProfileId: result.id,
    },
    "Vendor application approved successfully",
  );

  return result;
};

export const rejectVendorApplicationService = async (
  userId: string,
  data: RejectVendorApplicationInput,
): Promise<VendorReviewResponse> => {
  const application =
    await AdminVendorRepository.getVendorApplicationByUserId(userId);

  if (!application) {
    logger.warn(
      { userId },
      "Vendor application rejection failed: vendor application not found",
    );

    throw new CustomError(
      "Vendor application not found",
      404,
    );
  }

  if (application.verificationStatus !== "PENDING") {
    logger.warn(
      {
        userId,
        verificationStatus: application.verificationStatus,
      },
      "Vendor application rejection failed: application is not pending",
    );

    throw new CustomError(
      "Only pending vendor applications can be rejected",
      400,
    );
  }

  const result =
    await AdminVendorRepository.rejectVendorApplication(
      userId,
      data,
    );

  logger.info(
    {
      userId,
      vendorProfileId: result.id,
    },
    "Vendor application rejected successfully",
  );

  return result;
};

