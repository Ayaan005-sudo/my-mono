import type { Difficulty, VendorType } from "@mono/database";

export const VENDOR_CAPABILITY: Record<
  VendorType,
  {
    rank: number;
    maxDifficulty: Difficulty;
  }
> = {
  LOCAL_TRAIL_GUIDE: {
    rank: 1,
    maxDifficulty: "EASY",
  },

  ACTIVITY_HOST: {
    rank: 1,
    maxDifficulty: "EASY",
  },

  CAMP_OPERATOR: {
    rank: 1,
    maxDifficulty: "EASY",
  },

  TREK_LEADER: {
    rank: 2,
    maxDifficulty: "MODERATE",
  },

  EXPERIENCE_ORGANIZER: {
    rank: 2,
    maxDifficulty: "MODERATE",
  },

  MOUNTAINEER: {
    rank: 3,
    maxDifficulty: "PRO",
  },
};

export const DIFFICULTY_RANK: Record<
  Difficulty,
  number
> = {
  EASY: 1,
  MODERATE: 2,
  DIFFICULT: 3,
  PRO: 4,
};