import {
  createRoute,
  OpenAPIHono,
  z,
} from "@hono/zod-openapi";

import {
  authMiddleware,
  requireRole,
} from "../middlewares/auth.middleware.js";
import { createBookingController, getBookingDetailController } from "../controllers/booking.controller.js";
import { BookingIdParamSchema, CreateBookingSchema } from "../validators/booking.validator.js";



export const BookingRoutes =
  new OpenAPIHono();

const ErrorSchema = z
  .object({
    success: z
      .boolean()
      .openapi({ example: false }),

    message: z
      .string()
      .openapi({
        example: "Error message",
      }),
  })
  .openapi("BookingErrorResponse");

const SuccessSchema = z
  .object({
    success: z
      .boolean()
      .openapi({ example: true }),

    message: z
      .string()
      .openapi({
        example: "Success message",
      }),

    data: z.any().optional(),
  })
  .openapi("BookingSuccessResponse");


BookingRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Booking"],
    summary: "Create a booking",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateBookingSchema,
          },
        },
      },
    },

    responses: {
      201: {
        description:
          "Booking initiated successfully",
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
      },

      400: {
        description: "Invalid booking request",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },

      404: {
        description: "Schedule not found",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },

      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },

    middleware: [
      authMiddleware,
      requireRole("USER"),
    ],
  }),

  createBookingController as any,
);

BookingRoutes.openapi(
  createRoute({
    method: "get",

    path: "/{bookingId}",

    tags: ["Booking"],

    summary:
      "Get booking details for booking info page",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: BookingIdParamSchema,
    },

    responses: {
      200: {
        description:
          "Booking details fetched successfully",

        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
      },

      403: {
        description: "Forbidden",

        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },

      404: {
        description: "Booking not found",

        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },

      500: {
        description: "Internal server error",

        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
      },
    },

    middleware: [
      authMiddleware,
      requireRole("USER"),
    ],
  }),

  getBookingDetailController as any,
);
