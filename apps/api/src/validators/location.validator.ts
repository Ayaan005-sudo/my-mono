import { z } from "@hono/zod-openapi";

export const SearchLocationQuerySchema = z.object({
  search: z
    .string()
    .min(1, "Search query is required")
    .openapi({
      example: "Dharamshala",
      description: "Location name to search",
    }),

  limit: z.coerce
    .number()
    .min(1)
    .max(50)
    .optional()
    .openapi({
      example: 10,
      description: "Maximum number of location results to return",
    }),
});


export const LocationIdParamSchema = z.object({
  id: z
    .string()
    .min(1)
    .openapi({
      example: "ULB:252220",
    }),
});