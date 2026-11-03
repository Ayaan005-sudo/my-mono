import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  UpdateOnboardingProfileSchema,
  CreateVendorProfileSchema,
  UpdateVendorEligibilitySchema,
  UpdateVendorExpertiseSchema,
  CreateUserExperienceSchema,
  CreateUserCertificationSchema,
} from "../validators/onboarding.validator.js";
import {
  updateOnboardingProfile,
  createVendorProfile,
  updateVendorEligibility,
  updateVendorExpertise,
  createUserExperience,
  createUserCertification,
  submitVendorProfile,
} from "../controllers/onboarding.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const onboardingRoutes = new OpenAPIHono();

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

onboardingRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/profile",
    tags: ["Onboarding"],
    summary: "Update onboarding profile",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: UpdateOnboardingProfileSchema,
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
        description: "Onboarding profile updated successfully",
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
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "User not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to update onboarding profile",
      },
    },
    middleware: [authMiddleware],
  }),
  updateOnboardingProfile as any,
);

onboardingRoutes.openapi(
  createRoute({
    method: "post",
    path: "/vendor-profile",
    tags: ["Onboarding"],
    summary: "Create vendor profile",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateVendorProfileSchema,
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
        description: "Vendor profile created successfully",
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
      409: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Vendor profile already exists",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to create vendor profile",
      },
    },
    middleware: [authMiddleware],
  }),
  createVendorProfile as any,
);

onboardingRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/vendor-profile/eligibility",
    tags: ["Onboarding"],
    summary: "Update vendor eligibility",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: UpdateVendorEligibilitySchema,
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
        description: "Vendor eligibility updated successfully",
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
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Vendor profile not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to update vendor eligibility",
      },
    },
    middleware: [authMiddleware],
  }),
  updateVendorEligibility as any,
);

onboardingRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/vendor-profile/expertise",
    tags: ["Onboarding"],
    summary: "Update vendor expertise",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: UpdateVendorExpertiseSchema,
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
        description: "Vendor expertise updated successfully",
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
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Vendor profile not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to update vendor expertise",
      },
    },
    middleware: [authMiddleware],
  }),
  updateVendorExpertise as any,
);

onboardingRoutes.openapi(
  createRoute({
    method: "post",
    path: "/experiences",
    tags: ["Onboarding"],
    summary: "Add user experience",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserExperienceSchema,
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
        description: "Experience added successfully",
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
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Vendor profile not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to add experience",
      },
    },
    middleware: [authMiddleware],
  }),
  createUserExperience as any,
);

onboardingRoutes.openapi(
  createRoute({
    method: "post",
    path: "/certifications",
    tags: ["Onboarding"],
    summary: "Add vendor certification",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserCertificationSchema,
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
        description: "Certification added successfully",
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
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Vendor profile not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to add certification",
      },
    },
    middleware: [authMiddleware],
  }),
  createUserCertification as any,
);

onboardingRoutes.openapi(
  createRoute({
    method: "post",
    path: "/submit",
    tags: ["Onboarding"],
    summary: "Submit vendor profile for admin review",
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
        description: "Vendor profile submitted successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Vendor profile already submitted or approved",
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
        description: "Vendor profile not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to submit vendor profile",
      },
    },
    middleware: [authMiddleware],
  }),
  submitVendorProfile as any,
);



