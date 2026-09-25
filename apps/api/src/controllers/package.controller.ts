import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/custom-error.js";
import type { Context } from "hono";
import type { AddPackageItineraryDayInput, BulkCancelPackageSchedulesInput, CancelPackageScheduleInput, CreatePackageInput, CreatePackageItineraryInput, CreatePackageScheduleInput, UpdatePackageBasicsInput, UpdatePackageInclusionsInput, UpdatePackageItineraryDayInput, UpdatePackageScheduleInput, UpdatePackageScheduleTypeInput } from "../types/index.js";
import { addPackageItineraryDayService, bulkCancelPackageSchedulesService, cancelPackageScheduleService, createPackageItineraryService, createPackageScheduleService, createPackageService, deactivatePackageService, deletePackageItineraryDayService, getMyActivitiesService, getPackageItineraryService, getPackageRoutesService, getPackagesByLocationService, getPackageSchedulesService, getPublicPackageDetailService, openPackageScheduleService, publishPackageService, searchPublicPackagesService, updatePackageBasicsService, updatePackageInclusionsService, updatePackageItineraryDayService, updatePackageScheduleService, updatePackageScheduleTypeService } from "../services/package.service.js";
import ApiResponse from "../utils/api-response.js";
import { GetMyActivitiesQuerySchema, LocationPackagesQuerySchema, SearchPackagesQuerySchema } from "../validators/package.validator.js";

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

export const createPackageScheduleController = async (
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

   const body = c.req.valid("json" as never);

    const result =
      await createPackageScheduleService(
        userId,
        packageId,
        body,
      );

    logger.info(
      { userId, packageId },
      "Package schedule created successfully",
    );

    return ApiResponse.success(
      "Package schedule created successfully",
      result,
      201,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to create package schedule",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }
 
    return ApiResponse.error(
      "Failed to create package schedule",
      500,
    ).send(c);
  }
};

export const getPackageSchedulesController = async (
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

    const result =
      await getPackageSchedulesService(
        userId,
        packageId,
      );

    logger.info(
      { userId, packageId },
      "Package schedules fetched successfully",
    );

    return ApiResponse.success(
      "Package schedules fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch package schedules",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch package schedules",
      500,
    ).send(c);
  }
};

export const updatePackageScheduleController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const packageId = c.req.param("id");
    const scheduleId = c.req.param("scheduleId");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    if (!scheduleId) {
      return ApiResponse.error(
        "Schedule ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<UpdatePackageScheduleInput>();

    const result =
      await updatePackageScheduleService(
        userId,
        packageId,
        scheduleId,
        body,
      );

    logger.info(
      { userId, packageId, scheduleId },
      "Package schedule updated successfully",
    );

    return ApiResponse.success(
      "Package schedule updated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to update package schedule",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to update package schedule",
      500,
    ).send(c);
  }
};

export const updatePackageScheduleTypeController = async (
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
      await c.req.json<UpdatePackageScheduleTypeInput>();

    const result =
      await updatePackageScheduleTypeService(
        userId,
        packageId,
        body,
      );

    logger.info(
      { userId, packageId },
      "Package schedule type updated successfully",
    );

    return ApiResponse.success(
      "Package schedule type updated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to update package schedule type",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to update package schedule type",
      500,
    ).send(c);
  }
};


export const cancelPackageScheduleController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const packageId = c.req.param("id");
    const scheduleId = c.req.param("scheduleId");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    if (!scheduleId) {
      return ApiResponse.error(
        "Schedule ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<CancelPackageScheduleInput>();

    const result =
      await cancelPackageScheduleService(
        userId,
        packageId,
        scheduleId,
        body,
      );

    logger.info(
      { userId, packageId, scheduleId },
      "Package schedule cancelled successfully",
    );

    return ApiResponse.success(
      "Package schedule cancelled successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to cancel package schedule",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to cancel package schedule",
      500,
    ).send(c);
  }
};

export const bulkCancelPackageSchedulesController = async (
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
      await c.req.json<BulkCancelPackageSchedulesInput>();

    const result =
      await bulkCancelPackageSchedulesService(
        userId,
        packageId,
        body,
      );

    logger.info(
      { userId, packageId },
      "Package schedules cancelled successfully",
    );

    return ApiResponse.success(
      "Package schedules cancelled successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to cancel package schedules",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to cancel package schedules",
      500,
    ).send(c);
  }
};

export const openPackageScheduleController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const packageId = c.req.param("id");
    const scheduleId = c.req.param("scheduleId");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    if (!scheduleId) {
      return ApiResponse.error(
        "Schedule ID is required",
        400,
      ).send(c);
    }

    const result =
      await openPackageScheduleService(
        userId,
        packageId,
        scheduleId,
      );

    logger.info(
      { userId, packageId, scheduleId },
      "Package schedule opened successfully",
    );

    return ApiResponse.success(
      "Package schedule opened successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to open package schedule",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to open package schedule",
      500,
    ).send(c);
  }
};


export const publishPackageController = async (
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

    const result =
      await publishPackageService(
        userId,
        packageId,
      );

    logger.info(
      { userId, packageId },
      "Package published successfully",
    );

    return ApiResponse.success(
      "Package published successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to publish package",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to publish package",
      500,
    ).send(c);
  }
};

export const deactivatePackageController = async (
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

    const result =
      await deactivatePackageService(
        userId,
        packageId,
      );

    logger.info(
      { userId, packageId },
      "Package deactivated successfully",
    );

    return ApiResponse.success(
      "Package deactivated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to deactivate package",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to deactivate package",
      500,
    ).send(c);
  }
};

export const getMyActivitiesController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");

    const query =
      GetMyActivitiesQuerySchema.parse(
        c.req.query(),
      );

    const result =
      await getMyActivitiesService(
        userId,
        query,
      );

    logger.info(
      { userId },
      "My activities fetched successfully",
    );

    return ApiResponse.success(
      "My activities fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch my activities",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch my activities",
      500,
    ).send(c);
  }
};

export const searchPublicPackagesController = async (
  c: Context,
): Promise<Response> => {
  try {
    const query =
      SearchPackagesQuerySchema.parse(
        c.req.query(),
      );

    const result =
      await searchPublicPackagesService(query);

    logger.info(
      { query },
      "Public packages fetched successfully",
    );

    return ApiResponse.success(
      "Packages fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch public packages",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch packages",
      500,
    ).send(c);
  }
};


export const getPublicPackageDetailController = async (
  c: Context,
): Promise<Response> => {
  try {
    const packageId = c.req.param("id");

    if (!packageId) {
      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    const result =
      await getPublicPackageDetailService(packageId);

    logger.info(
      { packageId },
      "Public package fetched successfully",
    );

    return ApiResponse.success(
      "Package fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch public package",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch package",
      500,
    ).send(c);
  }
};

export const getPackagesByLocationController = async (
  c: Context,
): Promise<Response> => {
  try {
    const locationId = c.req.param("locationId");

    if (!locationId) {
      return ApiResponse.error(
        "Location ID is required",
        400,
      ).send(c);
    }

    const query =
      LocationPackagesQuerySchema.parse(
        c.req.query(),
      );

    const result =
      await getPackagesByLocationService(
        locationId,
        query,
      );

    logger.info(
      { locationId, query },
      "Packages by location fetched successfully",
    );

    return ApiResponse.success(
      "Packages fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch packages by location",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch packages",
      500,
    ).send(c);
  }
};