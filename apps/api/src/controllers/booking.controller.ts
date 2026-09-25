import type { Context } from "hono";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import type { CreateBookingInput } from "../types/booking.js";
import { createBookingService } from "../services/booking.service.js";
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