import type { Context } from "hono";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import type { CreateBookingInput, UpdateBookingContactInfoInput } from "../types/booking.js";
import { createBookingService, getBookingDetailService, updateBookingContactInfoService } from "../services/booking.service.js";
import { logger } from "../utils/logger.js";


export const createBookingController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");

    const body =
      await c.req.json<CreateBookingInput>();

    const booking =
      await createBookingService(
        userId,
        body,
      );

    logger.info(
      {
        userId,
        bookingId: booking.id,
      },
      "Booking initiated successfully",
    );

    return ApiResponse.success(
      "Booking initiated successfully",
      booking,
      201,
    ).send(c);
  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          userId: c.get("userId"),
        },
        "Booking initiation failed",
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
      "Failed to initiate booking",
    );

    return ApiResponse.error(
      "Failed to initiate booking",
      500,
    ).send(c);
  }
};


export const getBookingDetailController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");

    const bookingId =
      c.req.param("bookingId");

    if (!bookingId) {
      logger.warn(
        { userId },
        "Get booking detail failed: booking ID is required",
      );

      return ApiResponse.error(
        "Booking ID is required",
        400,
      ).send(c);
    }

    const booking =
      await getBookingDetailService(
        userId,
        bookingId,
      );

    logger.info(
      {
        userId,
        bookingId,
      },
      "Booking details fetched successfully",
    );

    return ApiResponse.success(
      "Booking details fetched successfully",
      booking,
      200,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          userId: c.get("userId"),
          bookingId: c.req.param("bookingId"),
        },
        "Failed to fetch booking details",
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
        bookingId: c.req.param("bookingId"),
      },
      "Failed to fetch booking details",
    );

    return ApiResponse.error(
      "Failed to fetch booking details",
      500,
    ).send(c);
  }
};


export const updateBookingContactInfoController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");

    const bookingId =
      c.req.param("bookingId");

    if (!bookingId) {
      logger.warn(
        { userId },
        "Update booking contact info failed: booking ID is required",
      );

      return ApiResponse.error(
        "Booking ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<UpdateBookingContactInfoInput>();

    const result =
      await updateBookingContactInfoService(
        userId,
        bookingId,
        body,
      );

    logger.info(
      {
        userId,
        bookingId,
      },
      "Booking contact information updated successfully",
    );

    return ApiResponse.success(
      "Booking contact information updated successfully",
      result,
      200,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          userId: c.get("userId"),
          bookingId: c.req.param("bookingId"),
        },
        "Failed to update booking contact information",
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
        bookingId: c.req.param("bookingId"),
      },
      "Failed to update booking contact information",
    );

    return ApiResponse.error(
      "Failed to update booking contact information",
      500,
    ).send(c);
  }
};