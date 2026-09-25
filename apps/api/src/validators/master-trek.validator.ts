import { z } from "@hono/zod-openapi";
import { Difficulty } from "@mono/database";


export const ActivityInputSchema = z.object({
  name: z.string().min(1).openapi({
    example: "Camping",
  }),

  description: z.string().optional().openapi({
    example: "Night camping activity",
  }),

  iconUrl: z.string().url().optional().openapi({
    example:
      "https://res.cloudinary.com/demo/image/upload/camping.png",
  }),
});

export const TrekItineraryDayInputSchema = z.object({
  dayNumber: z.number().int().positive().openapi({
    example: 1,
  }),

  title: z.string().min(1).openapi({
    example: "Sankri to Juda Ka Talab",
  }),

  description: z.string().optional().openapi({
    example: "Trek through dense pine forest.",
  }),

  startLocation: z.string().optional().openapi({
    example: "Sankri",
  }),

  endLocation: z.string().optional().openapi({
    example: "Juda Ka Talab",
  }),

  distanceKm: z.number().positive().optional().openapi({
    example: 4,
  }),

  duration: z.string().optional().openapi({
    example: "4 hours",
  }),

  altitude: z.number().positive().optional().openapi({
    example: 2780,
  }),

  imageUrls: z
  .array(z.string().url())
  .default([])
  .openapi({
    example: [
      "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/day-1-2.jpg",
    ],
  }),

  activities: z
    .array(ActivityInputSchema)
    .default([])
    .openapi({
      example: [
        {
          name: "Camping",
          description: "Night camping at Juda Ka Talab",
          iconUrl:
            "https://res.cloudinary.com/demo/image/upload/camping.png",
        },
      ],
    }),
});

export const TrekRouteInputSchema = z.object({
  name: z.string().min(1).openapi({
    example: "Standard Route",
  }),

  description: z.string().optional().openapi({
    example: "Most commonly used route for this trek.",
  }),

  distanceKm: z.number().positive().optional().openapi({
    example: 20,
  }),

  difficulty: z
  .nativeEnum(Difficulty)
  .optional()
  .openapi({
    example: Difficulty.MODERATE,
  }),
  
  elevationGain: z.number().optional().openapi({
    example: 1200,
  }),

  ascentTime: z.string().optional().openapi({
    example: "7 hours",
  }),

  descentTime: z.string().optional().openapi({
    example: "5 hours",
  }),

  startPoint: z.string().optional().openapi({
    example: "Sankri",
  }),

  endPoint: z.string().optional().openapi({
    example: "Kedarkantha Summit",
  }),

  isPopular: z.boolean().default(false).openapi({
    example: true,
  }),

  isDefault: z.boolean().default(false).openapi({
    example: true,
  }),

  itineraryDays: z
    .array(TrekItineraryDayInputSchema)
    .default([])
    .openapi({
      example: [
        {
          dayNumber: 1,
          title: "Sankri to Juda Ka Talab",
          description: "Trek through dense pine forest.",
          startLocation: "Sankri",
          endLocation: "Juda Ka Talab",
          distanceKm: 4,
          duration: "4 hours",
          altitude: 2780,

            imageUrls: [
      "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/day-1-2.jpg",
    ],

          activities: [
            {
              name: "Camping",
              description: "Night camping at Juda Ka Talab",
              iconUrl:
                "https://res.cloudinary.com/demo/image/upload/camping.png",
            },
          ],
        },
      ],
    }),
});

export const NearbyPlaceInputSchema = z.object({
  name: z.string().min(1).openapi({
    example: "Mori Village",
  }),

  description: z.string().optional().openapi({
    example: "A nearby Himalayan village.",
  }),

  locationId: z.string().optional().openapi({
    example: "DISTRICT:56",
  }),

  latitude: z.number().optional().openapi({
    example: 31.05,
  }),

  longitude: z.number().optional().openapi({
    example: 78.12,
  }),

  imageUrl: z.string().url().optional().openapi({
    example:
      "https://res.cloudinary.com/demo/image/upload/mori.jpg",
  }),

  distanceFromTrek: z.number().positive().optional().openapi({
    example: 15,
  }),

  travelTime: z.string().optional().openapi({
    example: "30 minutes",
  }),
});

export const MasterTrekFaqInputSchema = z.object({
  question: z.string().min(1).openapi({
    example: "What is the best time to visit?",
  }),

  answer: z.string().min(1).openapi({
    example: "The best time to visit is from December to April.",
  }),

  order: z.number().int().nonnegative().optional().openapi({
    example: 0,
  }),
});

export const CreateMasterTrekSchema = z.object({
  name: z.string().min(1).openapi({
    example: "Kedarkantha Trek",
  }),

  shortDescription: z.string().optional().openapi({
    example: "A popular winter trek in Uttarakhand.",
  }),

  description: z.string().min(1).openapi({
    example:
      "A complete description of the Kedarkantha trek.",
  }),

  tagline: z.string().optional().openapi({
    example: "Walk through the snow.",
  }),

  difficulty: z
  .nativeEnum(Difficulty)
  .optional()
  .openapi({
    example: Difficulty.MODERATE,
  }),

  durationDays: z.number().int().positive().openapi({
    example: 6,
  }),

  maxAltitude: z.number().positive().optional().openapi({
    example: 3810,
  }),

  distanceKm: z.number().positive().optional().openapi({
    example: 20,
  }),

  distinctRoutes: z
    .number()
    .int()
    .positive()
    .default(1)
    .openapi({
      example: 2,
    }),

  locationId: z.string().min(1).openapi({
    example: "ULB:248211",
  }),

  latitude: z.number().optional().openapi({
    example: 31.022,
  }),

  longitude: z.number().optional().openapi({
    example: 78.17,
  }),

  bestSeason: z.string().optional().openapi({
    example: "December to April",
  }),

  beginnerFriendly: z.boolean().default(false).openapi({
    example: true,
  }),

  overview: z.string().optional().openapi({
    example:
      "A scenic winter trek suitable for beginners.",
  }),

  howToReach: z.string().optional().openapi({
    example:
      "Reach Dehradun and travel by road to Sankri.",
  }),

  fitnessInfo: z.string().optional().openapi({
    example:
      "Basic cardiovascular fitness is recommended.",
  }),

  safetyInfo: z.string().optional().openapi({
    example:
      "Carry proper winter gear and follow your guide.",
  }),

  permitInfo: z.string().optional().openapi({
    example: "Forest permits may be required.",
  }),

  sustainabilityInfo: z.string().optional().openapi({
    example:
      "Avoid single-use plastics and follow leave-no-trace practices.",
  }),

  coverImageUrl: z.string().url().optional().openapi({
    example:
      "https://res.cloudinary.com/demo/image/upload/kedarkantha-cover.jpg",
  }),

  videoUrl: z.string().url().optional().openapi({
    example:
      "https://example.com/kedarkantha-video.mp4",
  }),

  galleryImages: z
    .array(z.string().url())
    .default([])
    .openapi({
      example: [
        "https://res.cloudinary.com/demo/image/upload/kedarkantha-1.jpg",
        "https://res.cloudinary.com/demo/image/upload/kedarkantha-2.jpg",
      ],
    }),

  status: z
    .enum([
      "DRAFT",
      "ACTIVE",
      "INACTIVE",
      "ARCHIVED",
    ])
    .default("DRAFT")
    .openapi({
      example: "DRAFT",
    }),

  activities: z
    .array(ActivityInputSchema)
    .default([])
    .openapi({
      example: [
        {
          name: "Camping",
          description: "Night camping activity",
          iconUrl:
            "https://res.cloudinary.com/demo/image/upload/camping.png",
        },
      ],
    }),

  routes: z
    .array(TrekRouteInputSchema)
    .default([])
    .openapi({
      example: [
        {
          name: "Standard Route",
          description:
            "Most commonly used route for this trek.",
          distanceKm: 20,
          difficulty: Difficulty.MODERATE,
          elevationGain: 1200,
          ascentTime: "7 hours",
          descentTime: "5 hours",
          startPoint: "Sankri",
          endPoint: "Kedarkantha Summit",
          isPopular: true,
          isDefault: true,

          itineraryDays: [
            {
              dayNumber: 1,
              title: "Sankri to Juda Ka Talab",
              description:
                "Trek through dense pine forest.",
              startLocation: "Sankri",
              endLocation: "Juda Ka Talab",
              distanceKm: 4,
              duration: "4 hours",
              altitude: 2780,


    imageUrls: [
      "https://res.cloudinary.com/demo/image/upload/day-1-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/day-1-2.jpg",
    ],

              activities: [
                {
                  name: "Camping",
                  description:
                    "Night camping at Juda Ka Talab",
                  iconUrl:
                    "https://res.cloudinary.com/demo/image/upload/camping.png",
                },
              ],
            },
          ],
        },
      ],
    }),

  nearbyPlaces: z
    .array(NearbyPlaceInputSchema)
    .default([])
    .openapi({
      example: [
        {
          name: "Mori Village",
          description:
            "A nearby Himalayan village.",
          locationId: "DISTRICT:56",
          latitude: 31.05,
          longitude: 78.12,
          imageUrl:
            "https://res.cloudinary.com/demo/image/upload/mori.jpg",
          distanceFromTrek: 15,
          travelTime: "30 minutes",
        },
      ],
    }),

  faqs: z
    .array(MasterTrekFaqInputSchema)
    .default([])
    .openapi({
      example: [
        {
          question: "What is the best time to visit?",
          answer: "The best time to visit is from December to April.",
          order: 0,
        },
      ],
    }),
});

export const UpdateMasterTrekSchema =
  CreateMasterTrekSchema.partial();