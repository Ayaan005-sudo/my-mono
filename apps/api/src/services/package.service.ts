import type { Difficulty } from "@mono/database";
import {
  createPackage,
  findMasterTrekById,
  findPackageById,
  getVendorActiveTeamsForPackageCreation,
  getVendorPackageCreationProfile,
  updatePackageBasics,
} from "../repositories/package.repository.js";
import type { CreatePackageInput, CreatePackageResponse, UpdatePackageBasicsInput, UpdatePackageBasicsResponse } from "../types/package.js";
import { CustomError } from "../utils/custom-error.js";
import { DIFFICULTY_RANK, VENDOR_CAPABILITY } from "../utils/vendor-capability.js";
import { findLocationByIdRepo } from "../repositories/location.repository.js";

export const createPackageService = async (
  userId: string,
  data: CreatePackageInput,
): Promise<CreatePackageResponse> => {
  const masterTrek =
    await findMasterTrekById(data.masterTrekId);

  if (!masterTrek) {
    throw new CustomError(
      "Master trek not found",
      404,
    );
  }

  if (!masterTrek.difficulty) {
    throw new CustomError(
      "Master trek difficulty is not defined",
      400,
    );
  }

  // INDIVIDUAL PACKAGE
  if (!data.teamId) {
    const vendor =
      await getVendorPackageCreationProfile(userId);

    if (
      !vendor?.vendorProfile ||
      vendor.vendorProfile.verificationStatus !==
        "APPROVED" ||
      !vendor.vendorProfile.vendorType
    ) {
      throw new CustomError(
        "Approved vendor profile is required",
        403,
      );
    }

    const capability =
      VENDOR_CAPABILITY[
        vendor.vendorProfile.vendorType
      ];

    if (
      DIFFICULTY_RANK[masterTrek.difficulty] >
      DIFFICULTY_RANK[capability.maxDifficulty]
    ) {
      throw new CustomError(
        `Your vendor profile can create packages up to ${capability.maxDifficulty} difficulty`,
        403,
      );
    }

    return createPackage(
      userId,
      data,
      masterTrek,
    );
  }

  // TEAM PACKAGE
  const memberships =
    await getVendorActiveTeamsForPackageCreation(
      userId,
    );

  const selectedMembership =
    memberships.find(
      (membership) =>
        membership.team.id === data.teamId,
    );

  if (!selectedMembership) {
    throw new CustomError(
      "You are not an active member of this team",
      403,
    );
  }

  let maxDifficulty: Difficulty | null = null;

  for (
    const member of selectedMembership.team.members
  ) {
    const vendorType =
      member.user.vendorProfile?.vendorType;

    if (!vendorType) {
      continue;
    }

    const memberMaxDifficulty =
      VENDOR_CAPABILITY[vendorType].maxDifficulty;

    if (
      !maxDifficulty ||
      DIFFICULTY_RANK[memberMaxDifficulty] >
        DIFFICULTY_RANK[maxDifficulty]
    ) {
      maxDifficulty = memberMaxDifficulty;
    }
  }

  if (!maxDifficulty) {
    throw new CustomError(
      "Team has no approved vendor members",
      403,
    );
  }

  if (
    DIFFICULTY_RANK[masterTrek.difficulty] >
    DIFFICULTY_RANK[maxDifficulty]
  ) {
    throw new CustomError(
      `This team can create packages up to ${maxDifficulty} difficulty`,
      403,
    );
  }

  return createPackage(
    userId,
    data,
    masterTrek,
  );
};


export const updatePackageBasicsService = async (
  userId: string,
  packageId: string,
  data: UpdatePackageBasicsInput,
): Promise<UpdatePackageBasicsResponse> => {

  const existingPackage = await findPackageById(packageId);

  if (!existingPackage) {
    throw new CustomError("Package not found", 404);
  }

  if (existingPackage.createdByUserId !== userId) {
    throw new CustomError(
      "You are not authorized to update this package",
      403,
    );
  }

  if (data.locationId !== undefined) {
    const location = await findLocationByIdRepo(data.locationId);

    if (!location) {
      throw new CustomError("Location not found", 404);
    }
  }

  return updatePackageBasics(packageId, data);
};

