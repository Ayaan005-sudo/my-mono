
import ApiResponse from "../utils/api-response.js";
import { Context } from "hono";
import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/custom-error.js";
import { createReviewService, deleteReviewService, updateReviewService } from "../services/review.service.js";
import type { CreateReviewInput, UpdateReviewInput } from "../types/index.js";

 

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