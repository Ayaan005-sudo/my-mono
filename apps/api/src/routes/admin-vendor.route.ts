import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  getPendingVendorApplications,
  getVendorApplicationByUserId,
  approveVendorApplication,
  rejectVendorApplication,
} from "../controllers/admin-vendor.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { RejectVendorApplicationSchema } from "../validators/admin-vendor.validator.js";

export const adminVendorRoutes = new OpenAPIHono();

const ErrorSchema = z
  .object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: "Error message" }),
  })
  .openapi("AdminVendorErrorResponse");

const SuccessSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Success message" }),
    data: z.any().optional(),
  })
  .openapi("AdminVendorSuccessResponse");

adminVendorRoutes.openapi(
  createRoute({
    method: "get",
    path: "/vendors/pending",
    tags: ["Admin Vendor Review"],
    summary: "Get pending vendor applications",
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description: "Pending vendor applications fetched successfully",
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
        description: "Forbidden - Insufficient permissions",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to fetch pending vendor applications",
      },
    },
    middleware: [authMiddleware, requireRole("ADMIN")],
  }),
  getPendingVendorApplications as any,
);

adminVendorRoutes.openapi(
  createRoute({
    method: "get",
    path: "/vendors/{userId}",
    tags: ["Admin Vendor Review"],
    summary: "Get vendor application details",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      params: z.object({
        userId: z.string().openapi({
          param: {
            name: "userId",
            in: "path",
          },
          example: "01a07f29-3ff9-716d-9c6e-52bb006b78d4",
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
        description: "Vendor application fetched successfully",
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
        description: "Forbidden - Insufficient permissions",
      },
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Vendor application not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to fetch vendor application",
      },
    },
    middleware: [authMiddleware, requireRole("ADMIN")],
  }),
  getVendorApplicationByUserId as any,
);

adminVendorRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/vendors/{userId}/approve",
    tags: ["Admin Vendor Review"],
    summary: "Approve vendor application",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      params: z.object({
        userId: z.string().openapi({
          param: {
            name: "userId",
            in: "path",
          },
          example: "01a07f29-3ff9-716d-9c6e-52bb006b78d4",
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
        description: "Vendor application approved successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Vendor application is not pending",
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
        description: "Forbidden - Insufficient permissions",
      },
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Vendor application not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to approve vendor application",
      },
    },
    middleware: [authMiddleware, requireRole("ADMIN")],
  }),
  approveVendorApplication as any,
);

adminVendorRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/vendors/{userId}/reject",
    tags: ["Admin Vendor Review"],
    summary: "Reject vendor application",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      params: z.object({
        userId: z.string().openapi({
          param: {
            name: "userId",
            in: "path",
          },
          example: "01a07f29-3ff9-716d-9c6e-52bb006b78d4",
        }),
      }),
      body: {
        content: {
          "application/json": {
            schema: RejectVendorApplicationSchema,
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
        description: "Vendor application rejected successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Vendor application is not pending or request validation failed",
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
        description: "Forbidden - Insufficient permissions",
      },
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Vendor application not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to reject vendor application",
      },
    },
    middleware: [authMiddleware, requireRole("ADMIN")],
  }),
  rejectVendorApplication as any,
);

