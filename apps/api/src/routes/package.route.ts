import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import {
  authMiddleware,
  requireRole,
} from "../middlewares/auth.middleware.js";
import { addPackageItineraryDayController, bulkCancelPackageSchedulesController, cancelPackageScheduleController, createPackage, createPackageItineraryController, createPackageScheduleController, deactivatePackageController, deletePackageItineraryDayController, getMyActivitiesController, getPackageCreationContextsController, getPackageItinerary, getPackageRoutes, getPackagesByLocationController, getPackageSchedulesController, getPublicPackageDetailController, getUpcomingDeparturesController, openPackageScheduleController, publishPackageController, searchPublicPackagesController, updatePackageBasics, updatePackageInclusionsController, updatePackageItineraryDayController, updatePackageScheduleController, updatePackageScheduleTypeController } from "../controllers/package.controller.js";
import { BulkCancelPackageSchedulesSchema, CancelPackageScheduleSchema, CreatePackageItinerarySchema, CreatePackageScheduleSchema, CreatePackageSchema, DeletePackageItineraryDayParamsSchema, GetMyActivitiesQuerySchema, GetPackageRoutesParamsSchema, LocationIdParamSchema, LocationPackagesQuerySchema, PackageItineraryDaySchema, PublicPackageDetailParamSchema, SearchPackagesQuerySchema, UpcomingDeparturesQuerySchema, UpdatePackageBasicsSchema, UpdatePackageInclusionsSchema, UpdatePackageItineraryDaySchema, UpdatePackageScheduleSchema, UpdatePackageScheduleTypeSchema } from "../validators/package.validator.js";


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

PackageRoutes.openapi(
  createRoute({
    method: "post",
    path: "/{id}/itinerary",

    tags: ["Package"],

    summary: "Create package itinerary",

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
      }),

      body: {
        content: {
          "application/json": {
            schema: CreatePackageItinerarySchema,
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
          "Package itinerary created successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid itinerary data",
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
        description: "Package not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package itinerary already exists",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to create package itinerary",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  createPackageItineraryController as any,
);

PackageRoutes.openapi(
  createRoute({
    method: "patch",

    path: "/{id}/itinerary/{dayId}",

    tags: ["Package"],

    summary: "Update package itinerary day",

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

        dayId: z.string().openapi({
          example:
            "01a0c123-4567-789a-bcde-123456789abc",
        }),
      }),

      body: {
        content: {
          "application/json": {
            schema:
              UpdatePackageItineraryDaySchema,
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
          "Package itinerary day updated successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid itinerary data",
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
          "Forbidden - Vendor only",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package or itinerary day not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to update package itinerary day",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  updatePackageItineraryDayController as any,
);


PackageRoutes.openapi(
  createRoute({
    method: "delete",

    path: "/{id}/itinerary/{dayId}",

    tags: ["Package"],

    summary: "Delete package itinerary day",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: DeletePackageItineraryDayParamsSchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Package itinerary day deleted successfully",
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
          "Forbidden - Vendor only",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package or itinerary day not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to delete package itinerary day",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  deletePackageItineraryDayController as any,
);


PackageRoutes.openapi(
  createRoute({
    method: "post",

    path: "/{id}/itinerary/day",

    tags: ["Package"],

    summary: "Add itinerary day to package",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
          }),
      }),

      body: {
        content: {
          "application/json": {
            schema: PackageItineraryDaySchema,
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
          "Package itinerary day added successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid itinerary day data",
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
          "Forbidden - Vendor can only update own package",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Package not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Itinerary day number already exists",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to add package itinerary day",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  addPackageItineraryDayController as any,
);

PackageRoutes.openapi(
  createRoute({
    method: "patch",

    path: "/{id}/inclusions",

    tags: ["Package"],

    summary:
      "Update package inclusions and requirements",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
          }),
      }),

      body: {
        content: {
          "application/json": {
            schema:
              UpdatePackageInclusionsSchema,
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
          "Package inclusions and requirements updated successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid request data",
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
          "Forbidden - Vendor can only update own package",
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
          "Failed to update package inclusions and requirements",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  updatePackageInclusionsController as any,
);

PackageRoutes.openapi(
  createRoute({
    method: "post",

    path: "/{id}/schedules",

    tags: ["Package"],

    summary: "Create package schedule",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
          }),
      }),

      body: {
        content: {
          "application/json": {
            schema: CreatePackageScheduleSchema,
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
          "Package schedule created successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid schedule data",
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
          "Forbidden - Vendor can only manage own package",
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
          "Failed to create package schedule",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  createPackageScheduleController as any,
);


PackageRoutes.openapi(
  createRoute({
    method: "get",

    path: "/{id}/schedules",

    tags: ["Package"],

    summary: "Get package schedules",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
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
          "Package schedules fetched successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid request data",
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
          "Forbidden - Vendor can only view own package schedules",
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
          "Failed to fetch package schedules",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  getPackageSchedulesController as any,
);



PackageRoutes.openapi(
  createRoute({
    method: "patch",

    path: "/{id}/schedule-type",

    tags: ["Package"],

    summary: "Update package schedule type",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
          }),
      }),

      body: {
        content: {
          "application/json": {
            schema: UpdatePackageScheduleTypeSchema,
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
          "Package schedule type updated successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid schedule type",
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
          "Forbidden - Vendor can only update own package",
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
          "Failed to update package schedule type",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  updatePackageScheduleTypeController as any,
);

PackageRoutes.openapi(
  createRoute({
    method: "patch",

    path: "/{id}/schedules/{scheduleId}/cancel",

    tags: ["Package"],

    summary: "Cancel package schedule",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
          }),

        scheduleId: z
          .string()
          .min(1, "Schedule ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a13",
          }),
      }),

      body: {
        content: {
          "application/json": {
            schema: CancelPackageScheduleSchema,
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
          "Package schedule cancelled successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Invalid request or schedule cannot be cancelled",
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
          "Forbidden - Vendor can only manage own package",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package or schedule not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package schedule is already cancelled",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to cancel package schedule",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  cancelPackageScheduleController as any,
);

PackageRoutes.openapi(
  createRoute({
    method: "patch",

    path: "/{id}/schedules/bulk-cancel",

    tags: ["Package"],

    summary: "Bulk cancel package schedules",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
          }),
      }),

      body: {
        content: {
          "application/json": {
            schema:
              BulkCancelPackageSchedulesSchema,
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
          "Package schedules cancelled successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Invalid request or completed schedule cannot be cancelled",
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
          "Forbidden - Vendor can only manage own package",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package or one or more schedules not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "One or more schedules are already cancelled",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to cancel package schedules",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  bulkCancelPackageSchedulesController as any,
);

PackageRoutes.openapi(
  createRoute({
    method: "patch",

    path: "/{id}/schedules/{scheduleId}",

    tags: ["Package"],

    summary: "Update package schedule",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
          }),

        scheduleId: z
          .string()
          .min(1, "Schedule ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a13",
          }),
      }),

      body: {
        content: {
          "application/json": {
            schema: UpdatePackageScheduleSchema,
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
          "Package schedule updated successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid schedule data",
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
          "Forbidden - Vendor can only update own package",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package or schedule not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to update package schedule",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  updatePackageScheduleController as any,
);



PackageRoutes.openapi(
  createRoute({
    method: "patch",

    path: "/{id}/schedules/{scheduleId}/open",

    tags: ["Package"],

    summary: "Open package schedule",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
          }),

        scheduleId: z
          .string()
          .min(1, "Schedule ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a13",
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
          "Package schedule opened successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Schedule cannot be opened",
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
          "Forbidden - Vendor can only manage own package",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package or schedule not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package schedule is already open",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to open package schedule",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  openPackageScheduleController as any,
);


PackageRoutes.openapi(
  createRoute({
    method: "patch",

    path: "/{id}/publish",

    tags: ["Package"],

    summary: "Publish package",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
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
          "Package published successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package is incomplete or cannot be published",
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
          "Forbidden - Vendor can only manage own package",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Package not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package is already published",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to publish package",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  publishPackageController as any,
);

PackageRoutes.openapi(
  createRoute({
    method: "patch",

    path: "/{id}/deactivate",

    tags: ["Package"],

    summary: "Deactivate package",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z
          .string()
          .min(1, "Package ID is required")
          .openapi({
            example:
              "01a0b469-20fb-795b-98ca-89e931968a12",
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
          "Package deactivated successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package cannot be deactivated",
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
          "Forbidden - Vendor can only manage own package",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Package not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Package is already deactivated",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to deactivate package",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  deactivatePackageController as any,
);


PackageRoutes.openapi(
  createRoute({
    method: "get",

    path: "/my-activities",

    tags: ["Package"],

    summary: "Get vendor my activities",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      query: GetMyActivitiesQuerySchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "My activities fetched successfully",
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
          "Forbidden - Vendor access required",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch my activities",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  getMyActivitiesController as any,
);


PackageRoutes.openapi(
  createRoute({
    method: "get",

    path: "/search",

    tags: ["Package"],

    summary: "Search public packages",

    request: {
      query: SearchPackagesQuerySchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Packages fetched successfully",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch packages",
      },
    },
  }),

  searchPublicPackagesController as any,
);


PackageRoutes.openapi(
  createRoute({
    method: "get",
    path: "/public/{id}",
    tags: ["Package"],
    summary: "Get public package detail",

    request: {
      params: PublicPackageDetailParamSchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description: "Package fetched successfully",
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
        description: "Failed to fetch package",
      },
    },
  }),

  getPublicPackageDetailController as any,
);


PackageRoutes.openapi(
  createRoute({
    method: "get",
    path: "/location/{locationId}",
    tags: ["Package"],
    summary: "Get public packages by location",

    request: {
      params: LocationIdParamSchema,
      query: LocationPackagesQuerySchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description: "Packages fetched successfully",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Location not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to fetch packages",
      },
    },
  }),

  getPackagesByLocationController as any,
);


PackageRoutes.openapi(
  createRoute({
    method: "get",
    path: "/upcoming-departures",
    tags: ["Package"],
    summary: "Get popular upcoming departures",

    request: {
      query: UpcomingDeparturesQuerySchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Upcoming departures fetched successfully",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch upcoming departures",
      },
    },
  }),
  getUpcomingDeparturesController as any,
);

PackageRoutes.openapi(
  createRoute({
    method: "get",
    path: "/creation-contexts",
    tags: ["Package"],
    summary: "Get available package creation contexts",

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
        description:
          "Package creation contexts fetched successfully",
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
          "Approved vendor profile is required",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch package creation contexts",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  getPackageCreationContextsController as any,
);