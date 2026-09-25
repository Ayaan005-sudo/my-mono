import type { Difficulty, PackageStatus } from "@mono/database";

export type CreatePackageInput = {
  masterTrekId: string;
  teamId?: string;
};
export type CreatePackageResponse = {
  id: string;
  masterTrekId: string;
  teamId: string | null;
  createdByUserId: string;

  title: string | null;
  description: string | null;
  locationId: string | null;
  difficulty: Difficulty | null;
  durationDays: number | null;
  distanceKm: number | null;

  status: PackageStatus;
  createdAt: Date;
  updatedAt: Date;
};
