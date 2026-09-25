import { uuidv7 } from "uuidv7";
import type { CreateReviewRepoInput, CreateReviewResponse, UpdateReviewInput, UpdateReviewResponse } from "../types/review.js";
import { prisma } from "../utils/prisma.js";

const reviewSelect = {
  id: true,
  rating: true,
  guideExpertise: true,
  safetyProtocols: true,
  logisticsAndCare: true,
  sustainableImpact: true,
  title: true,
  comment: true,
  imageUrls: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      avatarUrl: true,
    },
  },
} as const;

const findReviews = async (
  where: any,
  limit: number,
  cursor?: string,
) => {
  return prisma.review.findMany({
    where,
    take: limit + 1,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
    orderBy: { createdAt: "desc" },
    select: reviewSelect,
  });
};

const getSummary = async (where: any) => {
  const [aggregate, ...distributionCounts] =
    await Promise.all([
      prisma.review.aggregate({
        where,
        _count: { _all: true },
        _avg: {
          rating: true,
          guideExpertise: true,
          safetyProtocols: true,
          logisticsAndCare: true,
          sustainableImpact: true,
        },
      }),
      ...[1, 2, 3, 4, 5].map((rating) =>
        prisma.review.count({
          where: { ...where, rating },
        }),
      ),
    ]);

  const round = (value: number | null) =>
    value === null
      ? 0
      : Math.round(value * 100) / 100;

  return {
    averageRating: round(aggregate._avg.rating),
    totalReviews: aggregate._count._all,
    ratingDistribution: {
      5: distributionCounts[4],
      4: distributionCounts[3],
      3: distributionCounts[2],
      2: distributionCounts[1],
      1: distributionCounts[0],
    },
    categories: {
      guideExpertise: round(aggregate._avg.guideExpertise),
      safetyProtocols: round(aggregate._avg.safetyProtocols),
      logisticsAndCare: round(aggregate._avg.logisticsAndCare),
      sustainableImpact: round(aggregate._avg.sustainableImpact),
    },
  };
};

export const findReviewById = async (
  reviewId: string,
) => {
  return prisma.review.findUnique({
    where: {
      id: reviewId,
    },

    select: {
      id: true,
      userId: true,
      packageId: true,
      bookingId: true,
    },
  });
};

export const updateReview = async (
  reviewId: string,
  input: UpdateReviewInput,
): Promise<UpdateReviewResponse> => {
  return prisma.review.update({
    where: {
      id: reviewId,
    },

    data: {
      ...(input.rating !== undefined && {
        rating: input.rating,
      }),

      ...(input.guideExpertise !== undefined && {
        guideExpertise:
          input.guideExpertise,
      }),

      ...(input.safetyProtocols !== undefined && {
        safetyProtocols:
          input.safetyProtocols,
      }),

      ...(input.logisticsAndCare !== undefined && {
        logisticsAndCare:
          input.logisticsAndCare,
      }),

      ...(input.sustainableImpact !== undefined && {
        sustainableImpact:
          input.sustainableImpact,
      }),

      ...(input.title !== undefined && {
        title: input.title,
      }),

      ...(input.comment !== undefined && {
        comment: input.comment,
      }),

      ...(input.imageUrls !== undefined && {
        imageUrls: input.imageUrls,
      }),
    },

    select: {
      id: true,
      packageId: true,
      bookingId: true,

      rating: true,
      guideExpertise: true,
      safetyProtocols: true,
      logisticsAndCare: true,
      sustainableImpact: true,

      title: true,
      comment: true,
      imageUrls: true,

      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteReview = async (
  reviewId: string,
): Promise<void> => {
  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
};

export const createReview = async (
  data: CreateReviewRepoInput,
): Promise<CreateReviewResponse> => {
  return prisma.review.create({
    data: {
      id: uuidv7(),

      userId: data.userId,
      packageId: data.packageId,
      bookingId: data.bookingId,

      rating: data.rating,
      guideExpertise: data.guideExpertise,
      safetyProtocols: data.safetyProtocols,
      logisticsAndCare: data.logisticsAndCare,
      sustainableImpact: data.sustainableImpact,

      title: data.title,
      comment: data.comment,
      imageUrls: data.imageUrls,
    },

    select: {
      id: true,
      bookingId: true,
      packageId: true,

      rating: true,
      guideExpertise: true,
      safetyProtocols: true,
      logisticsAndCare: true,
      sustainableImpact: true,

      title: true,
      comment: true,
      imageUrls: true,

      createdAt: true,
    },
  });
};


export const findBookingForReview = async (
  bookingId: string,
  userId: string,
) => {
  return prisma.packageBooking.findFirst({
    where: {
      id: bookingId,
      userId,
    },

    select: {
      id: true,
      status: true,

      review: {
        select: {
          id: true,
        },
      },

      schedule: {
        select: {
          package: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
};


export const findReviewSummaryByPackageId = (packageId: string) =>
  getSummary({ packageId });

export const findReviewsByPackageId = (
  packageId: string,
  limit: number,
  cursor?: string,
) =>{
     console.log(
    "REPOSITORY PACKAGE ID:",
    packageId,
  );
  return findReviews({ packageId }, limit, cursor);
} 

export const findReviewsByVendorId = (
  vendorId: string,
  limit: number,
  cursor?: string,
) => findReviews({ package: { createdByUserId: vendorId } }, limit, cursor);


export const findReviewSummaryByVendorId = (vendorId: string) =>
  getSummary({ package: { createdByUserId: vendorId } });


export const findReviewsByTeamId = (
  teamId: string,
  limit: number,
  cursor?: string,
) => findReviews({ package: { teamId } }, limit, cursor);

export const findReviewSummaryByTeamId = (teamId: string) =>
  getSummary({ package: { teamId } });
