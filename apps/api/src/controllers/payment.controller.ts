import type { Context } from "hono";
import type { CreatePaymentOrderInput, VerifyPaymentInput } from "../types/payment.js";
import { createBalanceOrderService, createPaymentOrderService, handleRazorpayWebhookService, verifyPaymentService } from "../services/payment.service.js";
import ApiResponse from "../utils/api-response.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/custom-error.js";
import type { CreateBalanceOrderInput } from "../validators/payment.validator.js";


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


export const verifyPaymentController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId =
      c.get("userId");

    const body =
      await c.req.json<VerifyPaymentInput>();

    const result =
      await verifyPaymentService(
        userId,
        body,
      );

    logger.info(
      {
        userId,
      },
      "Payment verified successfully",
    );

    return ApiResponse.success(
      "Payment verified successfully",
      result,
      200,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        {
          error,
          userId: c.get("userId"),
        },
        "Payment verification failed",
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
      "Failed to verify payment",
    );

    return ApiResponse.error(
      "Failed to verify payment",
      500,
    ).send(c);
  }
};

export const razorpayWebhookController = async (
  c: Context,
): Promise<Response> => {
  try {
    const rawBody = await c.req.text();

    const signature = c.req.header(
      "x-razorpay-signature",
    );

    await handleRazorpayWebhookService(
      rawBody,
      signature,
    );

    logger.info(
      "Razorpay webhook processed successfully",
    );

    return ApiResponse.success(
      "Webhook processed successfully",
      undefined,
      200,
    ).send(c);

  } catch (error) {
    if (error instanceof CustomError) {
      logger.warn(
        { error },
        "Razorpay webhook processing failed",
      );

      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    logger.error(
      { error },
      "Failed to process Razorpay webhook",
    );

    return ApiResponse.error(
      "Failed to process Razorpay webhook",
      500,
    ).send(c);
  }
};


export const createBalanceOrderController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");

    const body =
      await c.req.json<CreateBalanceOrderInput>();

    const result =
      await createBalanceOrderService(
        userId,
        body.bookingId,
      );

    logger.info(
      {
        userId,
        bookingId: body.bookingId,
      },
      "Balance payment order created successfully",
    );

    return ApiResponse.success(
      "Balance payment order created successfully",
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
        "Balance payment order creation failed",
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
      "Failed to create balance payment order",
    );

    return ApiResponse.error(
      "Failed to create balance payment order",
      500,
    ).send(c);
  }
};