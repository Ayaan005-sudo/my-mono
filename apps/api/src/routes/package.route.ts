import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import {
  authMiddleware,
  requireRole,
} from "../middlewares/auth.middleware.js";
import { createPackage, getPackageItinerary, getPackageRoutes, updatePackageBasics } from "../controllers/package.controller.js";
import { CreatePackageSchema, GetPackageRoutesParamsSchema, UpdatePackageBasicsSchema } from "../validators/package.validator.js";


export const PackageRoutes = new OpenAPIHono();

const ErrorSchema = z
  .object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: "Error message" }),
  })
  .openapi("PackageErrorResponse");

const SuccessSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Success message" }),
    data: z.any().optional(),
  })
  .openapi("PackageSuccessResponse");


PackageRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",

    tags: ["Package"],

    summary: "Create package draft",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      body: {
        content: {
          "application/json": {
            schema: CreatePackageSchema,
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
        description: "Package created successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid request body",
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
        description: "Forbidden - Vendor only",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Master trek not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to create package",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  createPackage as any,
);


PackageRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/{id}/basics",

    tags: ["Package"],

    summary: "Update package basics",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z.string().openapi({
          example: "019c1234-5678-7abc-9def-123456789abc",
        }),
      }),

      body: {
        content: {
          "application/json": {
            schema: UpdatePackageBasicsSchema,
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
        description: "Package basics updated successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid request body",
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
        description: "Forbidden - Vendor only",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Package or location not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to update package basics",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  updatePackageBasics as any,
);

PackageRoutes.openapi(
  createRoute({
    method: "get",

    path: "/{id}/routes",

    tags: ["Package"],

    summary:
      "Get available trek routes for package",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: GetPackageRoutesParamsSchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Package routes fetched successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid package ID",
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
          "Forbidden - Vendor can only access own package",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Package not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch package routes",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  getPackageRoutes as any,
);

PackageRoutes.openapi(
  createRoute({
    method: "get",
    path: "/{id}/itinerary/{routeId}",

    tags: ["Package"],

    summary: "Get selected trek route itinerary for package prefill",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z.string().openapi({
          example:
            "01a0b469-20fb-795b-98ca-89e931968a12",
        }),

        routeId: z.string().openapi({
          example:
            "01a0b464-0c2e-76f7-943b-15c39886dd68",
        }),
      }),
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Package itinerary fetched successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid request",
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
          "Forbidden - Vendor can only access own package",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package or trek route not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch package itinerary",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  getPackageItinerary as any,
);