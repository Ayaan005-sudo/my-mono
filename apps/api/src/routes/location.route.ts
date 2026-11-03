import {
  createRoute,
  OpenAPIHono,
  z,
} from "@hono/zod-openapi";

import { getLocationById, getLocationChildren, searchLocations } from "../controllers/location.controller.js";
import { LocationIdParamSchema, SearchLocationQuerySchema } from "../validators/location.validator.js";

export const LocationRoutes =
  new OpenAPIHono();

const ErrorSchema = z
  .object({
    success: z.boolean().openapi({
      example: false,
    }),
    message: z.string().openapi({
      example: "Error message",
    }),
  })
  .openapi("LocationErrorResponse");

const SuccessSchema = z
  .object({
    success: z.boolean().openapi({
      example: true,
    }),
    message: z.string().openapi({
      example:
        "Locations fetched successfully",
    }),
    data: z.any().optional(),
  })
  .openapi("LocationSuccessResponse");

LocationRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",

    tags: ["Location"],

    summary: "Search locations",

      request: {
      query: SearchLocationQuerySchema,
    },


    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Locations fetched successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Search query is required",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch locations",
      },
    },
  }),

  searchLocations as any,
);


LocationRoutes.openapi(
  createRoute({
    method: "get",

    path: "/{id}",

    tags: ["Location"],

    summary:
      "Get location by id with hierarchy",

    request: {
      params: LocationIdParamSchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Location fetched successfully",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Location not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch location",
      },
    },
  }),

  getLocationById as any,
);

LocationRoutes.openapi(
  createRoute({
    method: "get",

    path: "/{id}/children",

    tags: ["Location"],

    summary:
      "Get direct child locations",

    request: {
      params: LocationIdParamSchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Location children fetched successfully",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Location not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch location children",
      },
    },
  }),

  getLocationChildren as any,
);