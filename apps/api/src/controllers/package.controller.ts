import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/custom-error.js";
import type { Context } from "hono";
import type { AddPackageItineraryDayInput, CreatePackageInput, CreatePackageItineraryInput, UpdatePackageBasicsInput, UpdatePackageInclusionsInput, UpdatePackageItineraryDayInput } from "../types/index.js";
import { addPackageItineraryDayService, createPackageItineraryService, createPackageService, deletePackageItineraryDayService, getPackageItineraryService, getPackageRoutesService, updatePackageBasicsService, updatePackageInclusionsService, updatePackageItineraryDayService } from "../services/package.service.js";
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

export const createPackageItineraryController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const packageId = c.req.param("id");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<CreatePackageItineraryInput>();

    const result =
      await createPackageItineraryService(
        userId,
        packageId,
        body,
      );

    logger.info(
      { userId, packageId },
      "Package itinerary created successfully",
    );

    return ApiResponse.success(
      "Package itinerary created successfully",
      result,
      201,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to create package itinerary",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to create package itinerary",
      500,
    ).send(c);
  }
};

export const updatePackageItineraryDayController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const packageId = c.req.param("id");
    const dayId = c.req.param("dayId");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    if (!dayId) {
      return ApiResponse.error(
        "Day ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<UpdatePackageItineraryDayInput>();

    const result =
      await updatePackageItineraryDayService(
        userId,
        packageId,
        dayId,
        body,
      );

    logger.info(
      { userId, packageId, dayId },
      "Package itinerary day updated successfully",
    );

    return ApiResponse.success(
      "Package itinerary day updated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to update package itinerary day",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to update package itinerary day",
      500,
    ).send(c);
  }
};

export const deletePackageItineraryDayController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const packageId = c.req.param("id");
    const dayId = c.req.param("dayId");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    if (!dayId) {
      return ApiResponse.error(
        "Day ID is required",
        400,
      ).send(c);
    }

    const result =
      await deletePackageItineraryDayService(
        userId,
        packageId,
        dayId,
      );

    logger.info(
      { userId, packageId, dayId },
      "Package itinerary day deleted successfully",
    );

    return ApiResponse.success(
      "Package itinerary day deleted successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to delete package itinerary day",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to delete package itinerary day",
      500,
    ).send(c);
  }
};

export const addPackageItineraryDayController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const packageId = c.req.param("id");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<AddPackageItineraryDayInput>();

    const result =
      await addPackageItineraryDayService(
        userId,
        packageId,
        body,
      );

    logger.info(
      { userId, packageId },
      "Package itinerary day added successfully",
    );

    return ApiResponse.success(
      "Package itinerary day added successfully",
      result,
      201,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to add package itinerary day",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to add package itinerary day",
      500,
    ).send(c);
  }
};

export const updatePackageInclusionsController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const packageId = c.req.param("id");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<UpdatePackageInclusionsInput>();

    const result =
      await updatePackageInclusionsService(
        userId,
        packageId,
        body,
      );

    logger.info(
      { userId, packageId },
      "Package inclusions and requirements updated successfully",
    );

    return ApiResponse.success(
      "Package inclusions and requirements updated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to update package inclusions and requirements",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to update package inclusions and requirements",
      500,
    ).send(c);
  }
};