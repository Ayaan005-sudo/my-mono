import type { Context } from "hono";
import type { CreatePaymentOrderInput } from "../types/payment.js";
import { createPaymentOrderService } from "../services/payment.service.js";
import ApiResponse from "../utils/api-response.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/custom-error.js";


export const createPaymentOrderController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");

    const body =
      await c.req.json<CreatePaymentOrderInput>();

    const result =
      await createPaymentOrderService(
        userId,
        body,
      );

    logger.info(
      {
        userId,
        bookingId: body.bookingId,
      },
      "Payment order created successfully",
    );

    return ApiResponse.success(
      "Payment order created successfully",
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
        "Payment order creation failed",
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
      "Failed to create payment order",
    );

    return ApiResponse.error(
      "Failed to create payment order",
      500,
    ).send(c);
  }
};