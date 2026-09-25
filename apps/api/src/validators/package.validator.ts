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

export const UpdatePackageBasicsSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .optional()
    .openapi({
      example: "Kedarkantha Winter Trek",
    }),

  description: z
    .string()
    .optional()
    .openapi({
      example: "A scenic winter trek through the Himalayas.",
    }),

  locationId: z
    .string()
    .min(1, "Location ID cannot be empty")
    .optional()
    .openapi({
      example: "STATE:5",
    }),

  difficulty: z
  .nativeEnum(Difficulty)
  .optional()
  .openapi({
    example: "MODERATE",
  }),

  durationDays: z
    .coerce
    .number()
    .int()
    .positive()
    .optional()
    .openapi({
      example: 6,
    }),

  distanceKm: z
    .coerce
    .number()
    .positive()
    .optional()
    .openapi({
      example: 20,
    }),

  galleryImages: z
    .array(z.string().url())
    .optional()
    .openapi({
      example: [
        "https://example.com/kedarkantha-1.jpg",
        "https://example.com/kedarkantha-2.jpg",
      ],
    }),
});

