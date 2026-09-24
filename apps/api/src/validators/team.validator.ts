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
