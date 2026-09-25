import {
  createRoute,
  OpenAPIHono,
  z,
} from "@hono/zod-openapi";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { createReviewController, deleteReviewController, getPackageReviewsController, updateReviewController } from "../controllers/review.controller.js";
import { CreateReviewSchema, PackageReviewParamSchema, ReviewIdParamSchema, ReviewPaginationQuerySchema, UpdateReviewSchema } from "../validators/review.validator.js";


export const ReviewRoutes = new OpenAPIHono();

const ErrorSchema = z
  .object({
    success: z.boolean().openapi({
      example: false,
    }),
    message: z.string().openapi({
      example: "Error message",
    }),
  })
  .openapi("ReviewErrorResponse");

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
  .openapi("ReviewSuccessResponse");



ReviewRoutes.openapi(
  createRoute({
    method: "post",

    path: "/",

    tags: ["Review"],

    summary:
      "Submit review for completed booking",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      body: {
        content: {
          "application/json": {
            schema:
              CreateReviewSchema,
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
          "Review submitted successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Booking is not completed",
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
          "Forbidden - User only",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Booking not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Review already submitted",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to submit review",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("USER"),
    ],
  }),

  createReviewController as any,
);

ReviewRoutes.openapi(
  createRoute({
    method: "patch",

    path: "/{reviewId}",

    tags: ["Review"],

    summary: "Update own review",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: ReviewIdParamSchema,

      body: {
        content: {
          "application/json": {
            schema: UpdateReviewSchema,
          },
        },
      },
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Review updated successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Invalid review data",
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
          "Cannot update another user's review",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Review not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to update review",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("USER"),
    ],
  }),

  updateReviewController as any,
);

ReviewRoutes.openapi(
  createRoute({
    method: "delete",

    path: "/{reviewId}",

    tags: ["Review"],

    summary: "Delete own review",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: ReviewIdParamSchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Review deleted successfully",
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
          "Cannot delete another user's review",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Review not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to delete review",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("USER"),
    ],
  }),

  deleteReviewController as any,
);

ReviewRoutes.openapi(
  createRoute({
    method: "get",
    path: "/package/{packageId}",
    tags: ["Review"],
    summary: "Get reviews for a package",
    request: {
      params: PackageReviewParamSchema,
      query: ReviewPaginationQuerySchema,
    },
    responses: {
      200: {
        content: { "application/json": { schema: SuccessSchema } },
        description: "Package reviews fetched successfully",
      },
      404: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Package not found",
      },
      500: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Failed to fetch package reviews",
      },
    },
  }),
  getPackageReviewsController as any,
);