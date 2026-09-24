import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { acceptTeamInvitationController, createTeam, getMyTeamInvitationsController, getTeamMembersController, inviteTeamVendorController, inviteVendorOnboardingController, rejectTeamInvitationController, searchTeamVendorsController } from "../controllers/team.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { CreateTeamSchema, InviteTeamVendorSchema, InviteVendorOnboardingSchema, SearchTeamVendorQuerySchema, TeamIdParamSchema, TeamInvitationParamSchema } from "../validators/team.validator.js";

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

teamRoutes.openapi(
  createRoute({
    method: "get",
    path: "/vendors/search",

    tags: ["Team"],

    summary: "Search approved vendors for team",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      query: SearchTeamVendorQuerySchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description: "Vendors fetched successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid search query",
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

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to search vendors",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  searchTeamVendorsController as any,
);

teamRoutes.openapi(
  createRoute({
    method: "post",
    path: "/{teamId}/invitations",

    tags: ["Team"],

    summary: "Invite an approved vendor to team",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        teamId: z.string().min(1).openapi({
          example: "019abc123team",
        }),
      }),

      body: {
        content: {
          "application/json": {
            schema: InviteTeamVendorSchema,
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
        description: "Team invitation sent successfully",
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
        description: "Only team owner can invite members",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Team or approved vendor not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Vendor already invited or already a member",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to send team invitation",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  inviteTeamVendorController as any,
);

teamRoutes.openapi(
  createRoute({
    method: "post",
    path: "/{teamId}/onboarding-invitations",

    tags: ["Team"],

    summary: "Invite user to complete vendor onboarding",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: z.object({
        teamId: z.string().min(1).openapi({
          example: "019abc123team",
        }),
      }),

      body: {
        content: {
          "application/json": {
            schema: InviteVendorOnboardingSchema,
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
        description: "Vendor onboarding invitation sent successfully",
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
        description: "Only team owner can send invitations",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Team not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invitation already exists or user is already a vendor",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to send vendor onboarding invitation",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  inviteVendorOnboardingController as any,
);

teamRoutes.openapi(
  createRoute({
    method: "get",
    path: "/invitations/me",
    tags: ["Team"],
    summary: "Get my pending team invitations",

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
          "Team invitations fetched successfully",
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
        description: "Forbidden",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch team invitations",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  getMyTeamInvitationsController as any,
);

teamRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/invitations/{invitationId}/accept",
    tags: ["Team"],
    summary: "Accept team invitation",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: TeamInvitationParamSchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Team invitation accepted successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid invitation",
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
        description: "Forbidden",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invitation not found",
      },

      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Already a team member",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to accept team invitation",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  acceptTeamInvitationController as any,
);


teamRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/invitations/{invitationId}/reject",
    tags: ["Team"],
    summary: "Reject team invitation",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: TeamInvitationParamSchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Team invitation rejected successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid invitation",
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
        description: "Forbidden",
      },

      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invitation not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to reject team invitation",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  rejectTeamInvitationController as any,
);


teamRoutes.openapi(
  createRoute({
    method: "get",
    path: "/{teamId}/members",
    tags: ["Team"],
    summary: "Get active team members",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      params: TeamIdParamSchema,
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Team members fetched successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid team ID",
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
        description: "Team not found",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch team members",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("VENDOR"),
    ],
  }),

  getTeamMembersController as any,
);

