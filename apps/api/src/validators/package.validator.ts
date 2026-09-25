import { z } from "@hono/zod-openapi";
import {Difficulty, PackageStatus} from "@mono/database";

export const CreatePackageSchema = z.object({
  masterTrekId: z
    .string()
    .min(1, "Master Trek ID is required")
    .openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
  teamId: z
    .string()
    .min(1, "Team ID cannot be empty")
    .optional()
    .openapi({
      example: "01a0c342-08b0-74c6-985d-3c384a5a17a8",
    }),
});

