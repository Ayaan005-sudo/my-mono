import type { Context } from "hono";
import * as AdminVendorService from "../services/admin-vendor.service.js";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";

export const getPendingVendorApplications = async (
  c: Context,
): Promise<Response> => {
  try {
    const result =
      await AdminVendorService.getPendingVendorApplicationsService();

    logger.info("Pending vendor applications fetched successfully");

    return ApiResponse.success(
      "Pending vendor applications fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch pending vendor applications",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch pending vendor applications",
      500,
    ).send(c);
  }
};

export const getVendorApplicationByUserId = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.req.param("userId") as string;

    const result =
      await AdminVendorService.getVendorApplicationByUserIdService(userId);

    logger.info(
      { userId },
      "Vendor application fetched successfully",
    );

    return ApiResponse.success(
      "Vendor application fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch vendor application",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch vendor application",
      500,
    ).send(c);
  }
};

export const approveVendorApplication = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.req.param("userId") as string;

    const result =
      await AdminVendorService.approveVendorApplicationService(userId);

    logger.info(
      { userId },
      "Vendor application approved successfully",
    );

    return ApiResponse.success(
      "Vendor application approved successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to approve vendor application",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to approve vendor application",
      500,
    ).send(c);
  }
};

export const rejectVendorApplication = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.req.param("userId") as string;
    const body = c.req.valid("json" as never);

    const result =
      await AdminVendorService.rejectVendorApplicationService(
        userId,
        body,
      );

    logger.info(
      { userId },
      "Vendor application rejected successfully",
    );

    return ApiResponse.success(
      "Vendor application rejected successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to reject vendor application",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to reject vendor application",
      500,
    ).send(c);
  }
};


