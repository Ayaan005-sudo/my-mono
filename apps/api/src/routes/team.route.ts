import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { createTeam } from "../controllers/team.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { CreateTeamSchema } from "../validators/team.validator.js";

export const teamRoutes = new OpenAPIHono();

const ErrorSchema = z
  .object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: "Error message" }),
  })
  .openapi("TeamErrorResponse");

const SuccessSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Success message" }),
    data: z.any().optional(),
  })
  .openapi("TeamSuccessResponse");

teamRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Team"],
    summary: "Create a team",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateTeamSchema,
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
        description: "Team created successfully",
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
        description: "Forbidden - Approved vendor only",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to create team",
      },
    },
    middleware: [authMiddleware, requireRole("VENDOR")],
  }),
  createTeam as any,
);
