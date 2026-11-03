import { type Context } from "hono";

import * as LocationService from "../services/location.service.js";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";


export const searchLocations = async (
  c: Context,
): Promise<Response> => {
  try {
    const search =
      c.req.query("search")?.trim() || "";

    if (!search) {
      logger.warn(
        "Location search attempted without search query",
      );

      return ApiResponse.error(
        "Search query is required",
        400,
      ).send(c);
    }

    const result =
      await LocationService.searchLocationsService(
        search,
      );

    logger.info(
      { search, count: result.length },
      "Locations fetched successfully",
    );

    return ApiResponse.success(
      "Locations fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch locations",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch locations",
      500,
    ).send(c);
  }
};



export const getLocationById = async (
  c: Context,
): Promise<Response> => {
  try {
    const locationId = c.req.param("id");

    if (!locationId) {
      logger.warn(
        "Location fetch attempted without location id",
      );

      return ApiResponse.error(
        "Location id is required",
        400,
      ).send(c);
    }

    const result =
      await LocationService.getLocationByIdService(
        locationId,
      );

    logger.info(
      { locationId },
      "Location fetched successfully",
    );

    return ApiResponse.success(
      "Location fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch location",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch location",
      500,
    ).send(c);
  }
};


export const getLocationChildren = async (
  c: Context,
): Promise<Response> => {
  try {
    const locationId =
      c.req.param("id");

      if(!locationId){
          return ApiResponse.error(
        "Refresh token missing",
        401,
      ).send(c);
      }

    const result =
      await LocationService.getLocationChildrenService(
        locationId,
      );

    return ApiResponse.success(
      "Location children fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch location children",
      500,
    ).send(c);
  }
};