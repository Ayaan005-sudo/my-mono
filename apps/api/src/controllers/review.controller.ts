
import ApiResponse from "../utils/api-response.js";
import { Context } from "hono";
import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/custom-error.js";
import { createReviewService, deleteReviewService, getPackageReviewsService, getTeamReviewsService, getVendorReviewsService, updateReviewService } from "../services/review.service.js";
import type { CreateReviewInput, ReviewPaginationQuery, UpdateReviewInput } from "../types/index.js";

 

 export const createReviewController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");

    const body =
      await c.req.json<CreateReviewInput>();

    const result =
      await createReviewService(
        userId,
        body,
      );

    logger.info(
      {
        userId,
        bookingId: body.bookingId,
      },
      "Review submitted successfully",
    );

    return ApiResponse.success(
      "Review submitted successfully",
      result,
      201,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          userId: c.get("userId"),
        },
        "Review submission failed",
      );

      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    logger.error(
      {
        error,
        userId: c.get("userId"),
      },
      "Failed to submit review",
    );

    return ApiResponse.error(
      "Failed to submit review",
      500,
    ).send(c);
  }
};


export const updateReviewController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const reviewId =
      c.req.param("reviewId");

    if (!reviewId) {
      logger.warn(
        { userId },
        "Update review failed: review ID is required",
      );

      return ApiResponse.error(
        "Review ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<UpdateReviewInput>();

    const result =
      await updateReviewService(
        userId,
        reviewId,
        body,
      );

    logger.info(
      {
        userId,
        reviewId,
      },
      "Review updated successfully",
    );

    return ApiResponse.success(
      "Review updated successfully",
      result,
      200,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          userId: c.get("userId"),
          reviewId: c.req.param("reviewId"),
        },
        "Review update failed",
      );

      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    logger.error(
      {
        error,
        userId: c.get("userId"),
        reviewId: c.req.param("reviewId"),
      },
      "Failed to update review",
    );

    return ApiResponse.error(
      "Failed to update review",
      500,
    ).send(c);
  }
};


export const deleteReviewController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const reviewId =
      c.req.param("reviewId");

    if (!reviewId) {
      logger.warn(
        { userId },
        "Delete review failed: review ID is required",
      );

      return ApiResponse.error(
        "Review ID is required",
        400,
      ).send(c);
    }

    await deleteReviewService(
      userId,
      reviewId,
    );

    logger.info(
      {
        userId,
        reviewId,
      },
      "Review deleted successfully",
    );

    return ApiResponse.success(
      "Review deleted successfully",
      null,
      200,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          userId: c.get("userId"),
          reviewId: c.req.param("reviewId"),
        },
        "Review deletion failed",
      );

      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    logger.error(
      {
        error,
        userId: c.get("userId"),
        reviewId: c.req.param("reviewId"),
      },
      "Failed to delete review",
    );

    return ApiResponse.error(
      "Failed to delete review",
      500,
    ).send(c);
  }
};

export const getPackageReviewsController = async (
  c: Context,
): Promise<Response> => {
  try {
    const packageId =
      c.req.param("packageId");

    if (!packageId) {
      logger.warn(
        "Get package reviews failed: package ID is required",
      );

      return ApiResponse.error(
        "Package ID is required",
        400,
      ).send(c);
    }

    const query: ReviewPaginationQuery = {
      limit: Number(
        c.req.query("limit") ?? 10,
      ),
      cursor:
        c.req.query("cursor") || undefined,
    };

    const result =
      await getPackageReviewsService(
        packageId,
        query,
      );

    logger.info(
      {
        packageId,
        limit: query.limit,
        cursor: query.cursor,
      },
      "Package reviews fetched successfully",
    );

    return ApiResponse.success(
      "Package reviews fetched successfully",
      result,
      200,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          packageId:
            c.req.param("packageId"),
        },
        "Failed to fetch package reviews",
      );

      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    logger.error(
      {
        error,
        packageId:
          c.req.param("packageId"),
      },
      "Failed to fetch package reviews",
    );

    return ApiResponse.error(
      "Failed to fetch package reviews",
      500,
    ).send(c);
  }
};


export const getVendorReviewsController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId =
      c.req.param("userId");

    if (!userId) {
      logger.warn(
        "Get vendor reviews failed: vendor ID is required",
      );

      return ApiResponse.error(
        "Vendor ID is required",
        400,
      ).send(c);
    }

    const query: ReviewPaginationQuery = {
      limit: Number(
        c.req.query("limit") ?? 10,
      ),
      cursor:
        c.req.query("cursor") || undefined,
    };

    const result =
      await getVendorReviewsService(
        userId,
        query,
      );

    logger.info(
      {
        userId,
        limit: query.limit,
        cursor: query.cursor,
      },
      "Vendor reviews fetched successfully",
    );

    return ApiResponse.success(
      "Vendor reviews fetched successfully",
      result,
      200,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          userId:
            c.req.param("userId"),
        },
        "Failed to fetch vendor reviews",
      );

      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    logger.error(
      {
        error,
        userId:
          c.req.param("userId"),
      },
      "Failed to fetch vendor reviews",
    );

    return ApiResponse.error(
      "Failed to fetch vendor reviews",
      500,
    ).send(c);
  }
};


export const getTeamReviewsController = async (
  c: Context,
): Promise<Response> => {
  try {
    const teamId =
      c.req.param("teamId");

    if (!teamId) {
      logger.warn(
        "Get team reviews failed: team ID is required",
      );

      return ApiResponse.error(
        "Team ID is required",
        400,
      ).send(c);
    }

    const query: ReviewPaginationQuery = {
      limit: Number(
        c.req.query("limit") ?? 10,
      ),
      cursor:
        c.req.query("cursor") || undefined,
    };

    const result =
      await getTeamReviewsService(
        teamId,
        query,
      );

    logger.info(
      {
        teamId,
        limit: query.limit,
        cursor: query.cursor,
      },
      "Team reviews fetched successfully",
    );

    return ApiResponse.success(
      "Team reviews fetched successfully",
      result,
      200,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          teamId:
            c.req.param("teamId"),
        },
        "Failed to fetch team reviews",
      );

      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    logger.error(
      {
        error,
        teamId:
          c.req.param("teamId"),
      },
      "Failed to fetch team reviews",
    );

    return ApiResponse.error(
      "Failed to fetch team reviews",
      500,
    ).send(c);
  }
};