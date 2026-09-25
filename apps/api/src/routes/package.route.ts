import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import {
  authMiddleware,
  requireRole,
} from "../middlewares/auth.middleware.js";
import { createPackage, updatePackageBasics } from "../controllers/package.controller.js";
import { CreatePackageSchema, UpdatePackageBasicsSchema } from "../validators/package.validator.js";


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