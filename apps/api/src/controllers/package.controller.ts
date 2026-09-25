import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/custom-error.js";
import type { Context } from "hono";
import type { CreatePackageInput, UpdatePackageBasicsInput } from "../types/index.js";
import { createPackageService, getPackageItineraryService, getPackageRoutesService, updatePackageBasicsService } from "../services/package.service.js";
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

export const getPackageItinerary = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;
    const packageId = c.req.param("id");
    const routeId = c.req.param("routeId");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    if (!routeId) {
      return ApiResponse.error(
        "Route ID is required",
        400,
      ).send(c);
    }

    const result =
      await getPackageItineraryService(
        userId,
        packageId,
        routeId,
      );

    logger.info(
      { userId, packageId, routeId },
      "Package itinerary fetched successfully",
    );

    return ApiResponse.success(
      "Package itinerary fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch package itinerary",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch package itinerary",
      500,
    ).send(c);
  }
};

export const getPackageRoutes = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;
    const packageId = c.req.param("id");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    const result =
      await getPackageRoutesService(
        userId,
        packageId,
      );

    logger.info(
      { userId, packageId },
      "Package routes fetched successfully",
    );

    return ApiResponse.success(
      "Package routes fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch package routes",
    );
 console.error(
    "ACTUAL GET PACKAGE ROUTES ERROR:",
    error,
  );
    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch package routes",
      500,
    ).send(c);
  }
};