import type { Context } from "hono";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";
import { getVendorPublicProfileService } from "../services/vendor.service.js";


export const getVendorPublicProfileController = async (
  c: Context,
): Promise<Response> => {
  try {
    const vendorId = c.req.param("vendorId");

    if (!vendorId) {
      logger.warn(
        "Get vendor public profile failed: vendor ID is required",
      );

      return ApiResponse.error(
        "Vendor ID is required",
        400,
      ).send(c);
    }

    const result =
      await getVendorPublicProfileService(
        vendorId,
      );

    logger.info(
      {
        vendorId,
      },
      "Vendor public profile fetched successfully",
    );

    return ApiResponse.success(
      "Vendor profile fetched successfully",
      result,
      200,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          vendorId:
            c.req.param("vendorId"),
        },
        "Failed to fetch vendor public profile",
      );

      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    logger.error(
      {
        error,
        vendorId:
          c.req.param("vendorId"),
      },
      "Failed to fetch vendor public profile",
    );

    return ApiResponse.error(
      "Failed to fetch vendor profile",
      500,
    ).send(c);
  }
};