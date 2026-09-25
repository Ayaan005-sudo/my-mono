import type { Difficulty, PackageStatus } from "@mono/database";
import type { UpdatePackageBasicsSchema } from "../validators/package.validator.js";
import z from "zod";

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

export type UpdatePackageBasicsInput =
  z.infer<typeof UpdatePackageBasicsSchema>;

export type UpdatePackageBasicsResponse = {
  id: string;
  masterTrekId: string;
  createdByUserId: string;

  title: string | null;
  description: string | null;

  locationId: string | null;
  location: {
    id: string;
    name: string;
    type: string;
  } | null;

  difficulty: Difficulty | null;
  durationDays: number | null;
  distanceKm: number | null;

  galleryImages: string[];

  status: PackageStatus;

  createdAt: Date;
  updatedAt: Date;
};

