import type { Context } from "hono";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import * as MasterTrekService from "../services/master-trek.service.js"
import { logger } from "../utils/logger.js";
import type { CreateMasterTrekRequest, UpdateMasterTrekRequest } from "../types/index.js";


export const createMasterTrek = async (
    c: Context,
): Promise<Response> => {
    try {
        const body = await c.req.json<CreateMasterTrekRequest>();

        const userId = c.get("userId");

        const result = await MasterTrekService.createMasterTrek(
            body,
            userId,
        );

        logger.info(
            { trekId: result.id, userId },
            "Master trek created successfully",
        );

        return ApiResponse.success(
            "Trek created successfully",
            result,
            201,
        ).send(c);
    } catch (error) {
       console.error("CREATE MASTER TREK ORIGINAL ERROR:", error);
        logger.error(
            { error },
            "Failed to create master trek",
        );

        if (error instanceof CustomError) {
            return ApiResponse.error(
                error.message,
                error.statusCode,
            ).send(c);
        }

        return ApiResponse.error(
            "Failed to create trek",
            500,
        ).send(c);
    }
};


export const updateMasterTrek = async (
  c: Context,
): Promise<Response> => {
  try {
    const trekId = c.req.param("id");

    if (!trekId) {
      logger.warn(
        "Master trek update attempted without trek id",
      );

      return ApiResponse.error(
        "Trek ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<UpdateMasterTrekRequest>();

    const result =
      await MasterTrekService.updateMasterTrekService(
        trekId,
        body,
      );

    logger.info(
      { trekId },
      "Master trek updated successfully",
    );

    return ApiResponse.success(
      "Trek updated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to update master trek",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to update trek",
      500,
    ).send(c);
  }
};

export const getMasterTrekByIdAdmin = async (
  c: Context,
): Promise<Response> => {
  try {
    const trekId = c.req.param("id");

    if (!trekId) {
      logger.warn(
        "Admin master trek fetch attempted without trek id",
      );

      return ApiResponse.error(
        "Trek ID is required",
        400,
      ).send(c);
    }

    const result =
      await MasterTrekService.getMasterTrekByIdAdminService(
        trekId,
      );

    logger.info(
      { trekId },
      "Master trek fetched successfully for admin",
    );

    return ApiResponse.success(
      "Trek fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch master trek for admin",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch trek",
      500,
    ).send(c);
  }
};


export const deleteMasterTrek = async (
  c: Context,
): Promise<Response> => {
  try {
    const trekId = c.req.param("id");

    if (!trekId) {
      logger.warn(
        "Master trek delete attempted without trek id",
      );

      return ApiResponse.error(
        "Trek ID is required",
        400,
      ).send(c);
    }

    const result =
      await MasterTrekService.deleteMasterTrekService(
        trekId,
      );

    logger.info(
      { trekId },
      "Master trek deleted successfully",
    );

    return ApiResponse.success(
      "Trek deleted successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to delete master trek",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to delete trek",
      500,
    ).send(c);
  }
};


export const getAllMasterTreksAdmin = async (
  c: Context,
): Promise<Response> => {
  try {
    const cursor =
      c.req.query("cursor");

    const limit = Number(
      c.req.query("limit") ?? 10,
    );

    const result =
      await MasterTrekService.getAllMasterTreksAdminService(
        limit,
        cursor,
      );

    logger.info(
      { limit, cursor },
      "Master treks fetched successfully for admin",
    );

    return ApiResponse.success(
      "Treks fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch master treks for admin",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch treks",
      500,
    ).send(c);
  }
};


export const getAllMasterTreksVendor = async (
  c: Context,
): Promise<Response> => {
  try {
    const cursor =
      c.req.query("cursor");

    const limit = Number(
      c.req.query("limit") ?? 10,
    );

    const result =
      await MasterTrekService.getAllMasterTreksVendorService(
        limit,
        cursor,
      );

    logger.info(
      { limit, cursor },
      "Master treks fetched successfully for vendor",
    );

    return ApiResponse.success(
      "Treks fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch master treks for vendor",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch treks",
      500,
    ).send(c);
  }
};


export const getMasterTrekByIdVendor = async (
  c: Context,
): Promise<Response> => {
  try {
    const trekId = c.req.param("id");

    if (!trekId) {
      logger.warn(
        "Vendor master trek fetch attempted without trek id",
      );

      return ApiResponse.error(
        "Trek ID is required",
        400,
      ).send(c);
    }

    const result =
      await MasterTrekService.getMasterTrekByIdVendorService(
        trekId,
      );

    logger.info(
      { trekId },
      "Master trek fetched successfully for vendor",
    );

    return ApiResponse.success(
      "Trek fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch master trek for vendor",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch trek",
      500,
    ).send(c);
  }
};


export const getAllMasterTreksUser = async (
  c: Context,
): Promise<Response> => {
  try {
    const cursor =
      c.req.query("cursor");

    const limit = Number(
      c.req.query("limit") ?? 10,
    );

    const result =
      await MasterTrekService.getAllMasterTreksUserService(
        limit,
        cursor,
      );

    logger.info(
      { limit, cursor },
      "Master treks fetched successfully for user",
    );

    return ApiResponse.success(
      "Treks fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch master treks for user",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch treks",
      500,
    ).send(c);
  }
};


export const getMasterTrekByIdUser = async (
  c: Context,
): Promise<Response> => {
  try {
    const trekId = c.req.param("id");

    if (!trekId) {
      logger.warn(
        "User master trek fetch attempted without trek id",
      );

      return ApiResponse.error(
        "Trek ID is required",
        400,
      ).send(c);
    }

    const result =
      await MasterTrekService.getMasterTrekByIdUserService(
        trekId,
      );

    logger.info(
      { trekId },
      "Master trek fetched successfully for user",
    );

    return ApiResponse.success(
      "Trek fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch master trek for user",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch trek",
      500,
    ).send(c);
  }
};





