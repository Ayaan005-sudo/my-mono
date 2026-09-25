

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