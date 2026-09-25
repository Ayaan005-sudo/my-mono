import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/custom-error.js";
import type { Context } from "hono";
import type { CreatePackageInput, UpdatePackageBasicsInput } from "../types/index.js";
import { createPackageService, updatePackageBasicsService } from "../services/package.service.js";
import ApiResponse from "../utils/api-response.js";

export const createPackage = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;

    const body =
      await c.req.json<CreatePackageInput>();

    const result =
      await createPackageService(
        userId,
        body,
      );

    logger.info(
      {
        userId,
        packageId: result.id,
      },
      "Package created successfully",
    );

    return ApiResponse.success(
      "Package created successfully",
      result,
      201,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to create package",
    );

    console.error("ACTUAL PRISMA PACKAGE ERROR:", error);

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to create package",
      500,
    ).send(c);
  }
};

export const updatePackageBasics = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;
    const packageId = c.req.param("id");

    const body =
      await c.req.json<UpdatePackageBasicsInput>();

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    const result =
      await updatePackageBasicsService(
        userId,
        packageId,
        body,
      );

    logger.info(
      {
        userId,
        packageId,
      },
      "Package basics updated successfully",
    );

    return ApiResponse.success(
      "Package basics updated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to update package basics",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to update package basics",
      500,
    ).send(c);
  }
};