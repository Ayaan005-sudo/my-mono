import { z } from "@hono/zod-openapi";

export const CreateTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(100, "Team name must not exceed 100 characters")
    .openapi({
      example: "Himalayan Ascents",
    }),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .openapi({
      example: "A team of experienced trekking professionals.",
    }),

  logoUrl: z
    .string()
    .url("Invalid logo URL")
    .optional()
    .openapi({
      example: "https://example.com/team-logo.jpg",
    }),

  city: z
    .string()
    .optional()
    .openapi({
      example: "Dehradun",
    }),

  state: z
    .string()
    .optional()
    .openapi({
      example: "Uttarakhand",
    }),

  country: z
    .string()
    .optional()
    .openapi({
      example: "India",
    }),
});


export const SearchTeamVendorQuerySchema = z.object({
  search: z
    .string()
    .min(1, "Search query is required")
    .openapi({
      example: "ayaan",
    }),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .default(10)
    .openapi({
      example: 10,
    }),
});

export const InviteTeamVendorSchema = z.object({
  invitedUserId: z
    .string()
    .min(1, "Vendor user ID is required")
    .openapi({
      example: "019abc123vendor",
    }),
});

export const InviteVendorOnboardingSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .openapi({
      example: "someone@gmail.com",
    }),
});


export const TeamInvitationParamSchema = z.object({
  invitationId: z
    .string()
    .min(1, "Invitation ID is required")
    .openapi({
      example: "01a0c342-08b0-74c6-985d-3c384a5a17a8",
    }),
});
