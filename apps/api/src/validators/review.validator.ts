import z from "zod";


export const ReviewPaginationQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .default(10),

  cursor: z.string().optional(),
});

export const CreateReviewSchema = z
  .object({
    bookingId: z
      .string()
      .min(1, "Booking ID is required")
      .openapi({
        example: "01a0c996-ea06-7706-b4eb-2834a5889a13",
      }),

    rating: z
      .number()
      .int()
      .min(1)
      .max(5)
      .openapi({ example: 5 }),

    guideExpertise: z
      .number()
      .int()
      .min(1)
      .max(5)
      .openapi({ example: 5 }),

    safetyProtocols: z
      .number()
      .int()
      .min(1)
      .max(5)
      .openapi({ example: 5 }),

    logisticsAndCare: z
      .number()
      .int()
      .min(1)
      .max(5)
      .openapi({ example: 4 }),

    sustainableImpact: z
      .number()
      .int()
      .min(1)
      .max(5)
      .openapi({ example: 5 }),

    title: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .optional()
      .openapi({
        example: "Amazing trekking experience",
      }),

    comment: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .optional()
      .openapi({
        example: "The trek was very well organized.",
      }),

    imageUrls: z
      .array(z.string().url())
      .max(5)
      .optional()
      .default([])
      .openapi({
        example: [
          "https://example.com/review-1.jpg",
        ],
      }),
  })
  .openapi("CreateReview");



  export const ReviewIdParamSchema = z
  .object({
    reviewId: z
      .string()
      .min(1, "Review ID is required")
      .openapi({
        example: "01a0c996-ea06-7706-b4eb-2834a5889a13",
      }),
  })
  .openapi("ReviewIdParam");


export const UpdateReviewSchema = z
  .object({
    rating: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional(),

    guideExpertise: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional(),

    safetyProtocols: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional(),

    logisticsAndCare: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional(),

    sustainableImpact: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional(),

    title: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .optional(),

    comment: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .optional(),

    imageUrls: z
      .array(z.string().url())
      .max(5)
      .optional(),
  })
  .refine(
    (data) =>
      Object.values(data).some(
        (value) => value !== undefined,
      ),
    {
      message:
        "At least one field is required to update the review",
    },
  )
  .openapi("UpdateReview");


  

export const PackageReviewParamSchema = z.object({
  packageId: z.string().min(1, "Package ID is required").openapi({
    example: "01a0c996-ea06-7706-b4eb-2834a5889a13",
  }),
});