import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { CreateMasterTrekSchema, UpdateMasterTrekSchema } from "../validators/master-trek.validator.js";


import { createMasterTrek, deleteMasterTrek, getAllMasterTreksAdmin, getAllMasterTreksUser, getAllMasterTreksVendor, getMasterTrekByIdAdmin, getMasterTrekByIdUser, getMasterTrekByIdVendor, updateMasterTrek } from "../controllers/master-trek.controller.js";

import {authMiddleware,requireRole} from "../middlewares/auth.middleware.js"

export const MasterTrekRoutes = new OpenAPIHono();



const ErrorSchema = z
    .object({
        success: z.boolean().openapi({ example: false }),
        message: z.string().openapi({ example: "Error message" }),
    })
    .openapi("ErrorResponse");

const SuccessSchema = z
    .object({
        success: z.boolean().openapi({ example: true }),
        message: z.string().openapi({ example: "Success message" }),
        data: z.any().optional(),
    })
    .openapi("SuccessResponse");




MasterTrekRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",

    tags: ["Trek"],

    summary: "Create master trek",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateMasterTrekSchema,
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
        description: "Trek created successfully",
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
        description: "Forbidden - Admin only",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to create trek",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("ADMIN"),
    ],
  }),

  createMasterTrek as any,
);


MasterTrekRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/{id}",

    tags: ["Trek"],

    summary: "Update master trek",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z.string().min(1).openapi({
          example: "019abc123",
        }),
      }),

      body: {
        content: {
          "application/json": {
            schema: UpdateMasterTrekSchema,
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
        description: "Trek updated successfully",
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
        description: "Forbidden - Admin only",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Trek not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to update trek",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("ADMIN"),
    ],
  }),

  updateMasterTrek as any,
);





MasterTrekRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",

    tags: ["Trek"],
    summary: "Delete master trek",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z.string().min(1).openapi({
          example:
            "01a06b03-00bf-790e-937b-32ec6617b322",
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
          "Trek deleted successfully",
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
          "Forbidden - Admin only",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Trek not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to delete trek",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("ADMIN"),
    ],
  }),

  deleteMasterTrek as any,
);


MasterTrekRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",

    tags: ["Trek"],
    summary:
      "Get all master treks for Admin",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      query: z.object({
        cursor: z
          .string()
          .optional()
          .openapi({
            example:
              "01a06b03-00bf-790e-937b-32ec6617b322",
          }),

        limit: z.coerce
          .number()
          .int()
          .min(1)
          .max(50)
          .default(10)
          .openapi({
            example: 10,
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
          "Treks fetched successfully",
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
          "Forbidden - Admin only",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch treks",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("ADMIN"),
    ],
  }),

  getAllMasterTreksAdmin as any,
);


MasterTrekRoutes.openapi(
  createRoute({
    method: "get",
    path: "/vendor",

    tags: ["Trek"],
    summary:
      "Get all master treks for vendor",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      query: z.object({
        cursor: z
          .string()
          .optional()
          .openapi({
            example:
              "01a06b03-00bf-790e-937b-32ec6617b322",
          }),

        limit: z.coerce
          .number()
          .int()
          .min(1)
          .max(50)
          .default(10)
          .openapi({
            example: 10,
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
          "Treks fetched successfully",
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
          "Vendor access required",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch treks",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  getAllMasterTreksVendor as any,
);



MasterTrekRoutes.openapi(
  createRoute({
    method: "get",
    path: "/vendor/{id}",

    tags: ["Trek"],
    summary: "Get master trek for vendor",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z.string().min(1).openapi({
          example:
            "01a06b03-00bf-790e-937b-32ec6617b322",
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
          "Trek fetched successfully",
      },

      401: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Unauthorized",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Trek not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch trek",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  getMasterTrekByIdVendor as any,
);



MasterTrekRoutes.openapi(
  createRoute({
    method: "get",
    path: "/public",

    tags: ["Trek"],
    summary: "Get all master treks for user",

    request: {
      query: z.object({
        cursor: z
          .string()
          .optional()
          .openapi({
            example:
              "01a06b03-00bf-790e-937b-32ec6617b322",
          }),

        limit: z.coerce
          .number()
          .int()
          .min(1)
          .max(50)
          .default(10)
          .openapi({
            example: 10,
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
          "Treks fetched successfully",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch treks",
      },
    },
  }),

  getAllMasterTreksUser as any,
);



MasterTrekRoutes.openapi(
  createRoute({
    method: "get",
    path: "/public/{id}",

    tags: ["Trek"],
    summary: "Get master trek for user",

    request: {
      params: z.object({
        id: z.string().min(1).openapi({
          example:
            "01a06b03-00bf-790e-937b-32ec6617b322",
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
          "Trek fetched successfully",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Trek not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch trek",
      },
    },
  }),

  getMasterTrekByIdUser as any,
);



MasterTrekRoutes.openapi(



  createRoute({
    method: "get",
    path: "/{id}",

    tags: ["Trek"],
    summary: "Get master trek for Admin by id",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        id: z.string().min(1).openapi({
          example:
            "01a06b03-00bf-790e-937b-32ec6617b322",
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
          "Trek fetched successfully",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Trek not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to fetch trek",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("ADMIN"),
    ],
  }),

  getMasterTrekByIdAdmin as any,
);