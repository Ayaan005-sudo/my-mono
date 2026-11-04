

export type CreateReviewInput = {
  bookingId: string;

  rating: number;
  guideExpertise: number;
  safetyProtocols: number;
  logisticsAndCare: number;
  sustainableImpact: number;

  title?: string;
  comment?: string;
  imageUrls?: string[];
};

export type CreateReviewRepoInput = {
  userId: string;
  packageId: string;
  bookingId: string;

  rating: number;
  guideExpertise: number;
  safetyProtocols: number;
  logisticsAndCare: number;
  sustainableImpact: number;

  title?: string;
  comment?: string;
  imageUrls: string[];
};

export type CreateReviewResponse = {
  id: string;
  bookingId: string;
  packageId: string;

  rating: number;
  guideExpertise: number;
  safetyProtocols: number;
  logisticsAndCare: number;
  sustainableImpact: number;

  title: string | null;
  comment: string | null;
  imageUrls: string[];

  createdAt: Date;
};


export type UpdateReviewInput = {
  rating?: number;

  guideExpertise?: number;
  safetyProtocols?: number;
  logisticsAndCare?: number;
  sustainableImpact?: number;

  title?: string;
  comment?: string;
  imageUrls?: string[];
};

export type UpdateReviewResponse = {
  id: string;
  packageId: string;
  bookingId: string;

  rating: number;

  guideExpertise: number;
  safetyProtocols: number;
  logisticsAndCare: number;
  sustainableImpact: number;

  title: string | null;
  comment: string | null;
  imageUrls: string[];

  createdAt: Date;
  updatedAt: Date;
};


export type ReviewUser = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
};

export type ReviewListItem = {
  id: string;

  rating: number;
  guideExpertise: number;
  safetyProtocols: number;
  logisticsAndCare: number;
  sustainableImpact: number;

  title: string | null;
  comment: string | null;
  imageUrls: string[];

  createdAt: Date;

  user: ReviewUser;
};

export type ReviewRatingDistribution = {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
};

export type ReviewCategorySummary = {
  guideExpertise: number;
  safetyProtocols: number;
  logisticsAndCare: number;
  sustainableImpact: number;
};

export type ReviewSummary = {
  averageRating: number;
  totalReviews: number;

  ratingDistribution: ReviewRatingDistribution;

  categories: ReviewCategorySummary;
};

export type ReviewPaginationQuery = {
  limit: number;
  cursor?: string;
};

export type GetReviewsResponse = {
  summary: ReviewSummary;
  reviews: ReviewListItem[];
  nextCursor: string | null;
  hasNextPage: boolean;
};


