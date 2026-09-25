import {
  createRoute,
  OpenAPIHono,
  z,
} from "@hono/zod-openapi";


import {
  authMiddleware,
  requireRole,
} from "../middlewares/auth.middleware.js";
import { CreatePaymentOrderSchema } from "../validators/payment.validator.js";
import { createPaymentOrderController } from "../controllers/payment.controller.js";


export const PaymentRoutes = new OpenAPIHono();

const ErrorSchema = z
  .object({
    success: z.boolean().openapi({
      example: false,
    }),
    message: z.string().openapi({
      example: "Error message",
    }),
  })
  .openapi("PaymentErrorResponse");

const SuccessSchema = z
  .object({
    success: z.boolean().openapi({
      example: true,
    }),
    message: z.string().openapi({
      example: "Success message",
    }),
    data: z.any().optional(),
  })
  .openapi("PaymentSuccessResponse");


PaymentRoutes.openapi(
  createRoute({
    method: "post",
    path: "/create-order",

    tags: ["Payment"],

    summary: "Create Razorpay payment order",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      body: {
        content: {
          "application/json": {
            schema: CreatePaymentOrderSchema,
          },
        },
      },
    },

    responses: {
      201: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Payment order created successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Invalid payment request or booking not eligible for payment",
      },

      401: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Unauthorized",
      },

      403: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Forbidden - Booking does not belong to user",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Booking not found",
      },

      502: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to create Razorpay order",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to create payment order",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("USER"),
    ],
  }),

  createPaymentOrderController as any,
);
