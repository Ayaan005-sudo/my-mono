import { createReview, deleteReview, findBookingForReview, findReviewById, updateReview } from "../repositories/review.repository.js";
import type { CreateReviewInput, CreateReviewResponse, UpdateReviewInput, UpdateReviewResponse } from "../types/review.js";
import { CustomError } from "../utils/custom-error.js";



export const createReviewService = async (
  userId: string,
  input: CreateReviewInput,
): Promise<CreateReviewResponse> => {
  const booking =
    await findBookingForReview(
      input.bookingId,
      userId,
    );

  if (!booking) {
    throw new CustomError(
      "Booking not found",
      404,
    );
  }

  if (booking.status !== "COMPLETED") {
    throw new CustomError(
      "You can review only after completing the trek",
      400,
    );
  }

  if (booking.review) {
    throw new CustomError(
      "Review already submitted for this booking",
      409,
    );
  }

  const packageId =
    booking.schedule.package.id;

  return createReview({
    userId,
    packageId,
    bookingId: booking.id,

    rating: input.rating,
    guideExpertise: input.guideExpertise,
    safetyProtocols: input.safetyProtocols,
    logisticsAndCare: input.logisticsAndCare,
    sustainableImpact:
      input.sustainableImpact,

    title: input.title,
    comment: input.comment,
    imageUrls: input.imageUrls ?? [],
  });
};


export const updateReviewService = async (
  userId: string,
  reviewId: string,
  input: UpdateReviewInput,
): Promise<UpdateReviewResponse> => {
  const review =
    await findReviewById(reviewId);

  if (!review) {
    throw new CustomError(
      "Review not found",
      404,
    );
  }

  if (review.userId !== userId) {
    throw new CustomError(
      "You are not allowed to update this review",
      403,
    );
  }

  return updateReview(
    reviewId,
    input,
  );
};

export const deleteReviewService = async (
  userId: string,
  reviewId: string,
): Promise<void> => {
  const review =
    await findReviewById(reviewId);

  if (!review) {
    throw new CustomError(
      "Review not found",
      404,
    );
  }

  if (review.userId !== userId) {
    throw new CustomError(
      "You are not allowed to delete this review",
      403,
    );
  }

  await deleteReview(reviewId);
};
