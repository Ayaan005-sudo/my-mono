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


export const GetPackageItineraryParamsSchema = z.object({
  id: z
    .string()
    .min(1, "Package ID is required")
    .openapi({
      example: "019c1234-5678-7abc-9def-123456789abc",
    }),
});

export const PackageItineraryDaySchema = z.object({
  dayNumber: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1 }),

  title: z
    .string()
    .min(1, "Day title is required")
    .openapi({ example: "Sankri to Juda Ka Talab" }),

  description: z
    .string()
    .optional()
    .openapi({
      example: "Trek through dense pine forest to Juda Ka Talab.",
    }),

  startLocation: z
    .string()
    .optional()
    .openapi({ example: "Sankri" }),

  endLocation: z
    .string()
    .optional()
    .openapi({ example: "Juda Ka Talab" }),

  distanceKm: z
    .number()
    .positive()
    .optional()
    .openapi({ example: 4 }),

  duration: z
    .string()
    .optional()
    .openapi({ example: "4 hours" }),

  altitude: z
    .number()
    .positive()
    .optional()
    .openapi({ example: 2780 }),

  imageUrls: z
    .array(z.string().url())
    .default([])
    .openapi({
      example: [
        "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg",
      ],
    }),

  
});


export const GetPackageRoutesParamsSchema = z.object({
  id: z
    .string()
    .min(1, "Package ID is required")
    .openapi({
      example: "01a0b469-20fb-795b-98ca-89e931968a12",
    }),
});


export const CreatePackageItinerarySchema = z.object({
  routeId: z
    .string()
    .min(1, "Route ID is required")
    .openapi({
      example: "01a0b464-0c2e-76f7-943b-15c39886dd68",
    }),

  days: z
    .array(PackageItineraryDaySchema)
    .min(1, "At least one itinerary day is required"),
});

export const UpdatePackageItineraryDaySchema = z.object({
  dayNumber: z
    .number()
    .int()
    .positive()
    .optional()
    .openapi({ example: 2 }),

  title: z
    .string()
    .min(1, "Day title cannot be empty")
    .optional()
    .openapi({
      example: "Bekaltal to Brahmatal",
    }),

  description: z
    .string()
    .optional()
    .openapi({
      example: "Trek through alpine forests towards Brahmatal.",
    }),

  startLocation: z
    .string()
    .optional()
    .openapi({ example: "Bekaltal" }),

  endLocation: z
    .string()
    .optional()
    .openapi({ example: "Brahmatal" }),

  distanceKm: z
    .number()
    .positive()
    .optional()
    .openapi({ example: 7 }),

  duration: z
    .string()
    .optional()
    .openapi({ example: "5 hours" }),

  altitude: z
    .number()
    .positive()
    .optional()
    .openapi({ example: 3200 }),

  imageUrls: z
    .array(z.string().url())
    .optional()
    .openapi({
      example: [
        "https://res.cloudinary.com/demo/image/upload/day-2.jpg",
      ],
    }),

});


export const DeletePackageItineraryDayParamsSchema = z.object({
  id: z
    .string()
    .min(1, "Package ID is required")
    .openapi({
      example: "01a0b469-20fb-795b-98ca-89e931968a12",
    }),

  dayId: z
    .string()
    .min(1, "Itinerary day ID is required")
    .openapi({
      example: "01a0c123-4567-789a-bcde-123456789abc",
    }),
});


export const AddPackageItineraryDaySchema =
  PackageItineraryDaySchema;


   export const UpdatePackageInclusionsSchema = z.object({
  inclusions: z
    .array(z.string().min(1))
    .optional()
    .openapi({
      example: [
        "Accommodation (Tents/Homestays)",
        "All Meals during the trek",
        "Qualified Trek Leader",
      ],
    }),

  exclusions: z
    .array(z.string().min(1))
    .optional()
    .openapi({
      example: [
        "Cab fare to Jobra and from Chattru to Manali is not included",
      ],
    }),

  packingList: z
    .array(z.string().min(1))
    .optional()
    .openapi({
      example: [
        "Trekking shoes",
        "Warm jacket",
        "Water bottle",
      ],
    }),

  fitnessAndExperienceRequirement: z
  .string()
  .optional()
  .openapi({
    example:
      "Participants must be able to jog 5 km in 30 minutes. Previous high-altitude experience is recommended but not mandatory.",
  }),
});

