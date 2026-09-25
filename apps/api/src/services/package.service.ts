import type { Difficulty } from "@mono/database";
import {
  addPackageItineraryDay,
  countPackageItineraryDays,
  createPackage,
  createPackageItinerary,
  deletePackageItineraryDay,
  findMasterTrekById,
  findMasterTrekItinerary,
  findMasterTrekRoutes,
  findPackageById,
  findPackageItineraryDay,
  findPackageItineraryDayByNumber,
  findRouteForMasterTrek,
  getVendorActiveTeamsForPackageCreation,
  getVendorPackageCreationProfile,
  updatePackageBasics,
  updatePackageItineraryDay,
} from "../repositories/package.repository.js";
import type { AddPackageItineraryDayInput, AddPackageItineraryDayResponse, CreatePackageInput, CreatePackageItineraryInput, CreatePackageItineraryResponse, CreatePackageResponse, DeletePackageItineraryDayResponse, GetPackageItineraryResponse, GetPackageRoutesResponse, UpdatePackageBasicsInput, UpdatePackageBasicsResponse, UpdatePackageItineraryDayInput, UpdatePackageItineraryDayResponse } from "../types/package.js";
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

export const getPackageItineraryService = async (
  userId: string,
  packageId: string,
  routeId: string,
): Promise<GetPackageItineraryResponse> => {
  const existingPackage =
    await findPackageById(packageId);

  if (!existingPackage) {
    throw new CustomError(
      "Package not found",
      404,
    );
  }

  if (existingPackage.createdByUserId !== userId) {
    throw new CustomError(
      "You are not authorized to access this package",
      403,
    );
  }

  const route = await findMasterTrekItinerary(
    existingPackage.masterTrekId,
    routeId,
  );

  if (!route) {
    throw new CustomError(
      "Trek route not found for this package",
      404,
    );
  }

  return {
    routeId: route.id,
    routeName: route.name,
    days: route.itineraryDays,
  };
};

export const getPackageRoutesService = async (
  userId: string,
  packageId: string,
): Promise<GetPackageRoutesResponse> => {
  const existingPackage =
    await findPackageById(packageId);

  if (!existingPackage) {
    throw new CustomError(
      "Package not found",
      404,
    );
  }

  if (existingPackage.createdByUserId !== userId) {
    throw new CustomError(
      "You are not authorized to access this package",
      403,
    );
  }

  const routes = await findMasterTrekRoutes(
    existingPackage.masterTrekId,
  );

  return routes;
};

export const createPackageItineraryService = async (
  userId: string,
  packageId: string,
  input: CreatePackageItineraryInput,
): Promise<CreatePackageItineraryResponse> => {
  const existingPackage =
    await findPackageById(packageId);

  if (!existingPackage) {
    throw new CustomError(
      "Package not found",
      404,
    );
  }

  if (existingPackage.createdByUserId !== userId) {
    throw new CustomError(
      "You are not authorized to update this package",
      403,
    );
  }

  const route = await findRouteForMasterTrek(
    input.routeId,
    existingPackage.masterTrekId,
  );

  if (!route) {
    throw new CustomError(
      "Invalid route for this package",
      400,
    );
  }

  

  const existingDays =
    await countPackageItineraryDays(packageId);

  if (existingDays > 0) {
    throw new CustomError(
      "Package itinerary already exists",
      409,
    );
  }

  const result =
    await createPackageItinerary(
      packageId,
      input.routeId,
      input.days,
    );

  if (!result) {
    throw new CustomError(
      "Failed to create package itinerary",
      500,
    );
  }

  return {
    packageId: result.id,
    routeId: result.routeId!,
    days: result.itineraryDays,
  };
};

export const updatePackageItineraryDayService = async (
  userId: string,
  packageId: string,
  dayId: string,
  input: UpdatePackageItineraryDayInput,
): Promise<UpdatePackageItineraryDayResponse> => {
  const existingPackage =
    await findPackageById(packageId);

  if (!existingPackage) {
    throw new CustomError(
      "Package not found",
      404,
    );
  }

  if (existingPackage.createdByUserId !== userId) {
    throw new CustomError(
      "You are not authorized to update this package",
      403,
    );
  }

  const existingDay =
    await findPackageItineraryDay(
      packageId,
      dayId,
    );

  if (!existingDay) {
    throw new CustomError(
      "Package itinerary day not found",
      404,
    );
  }

  return updatePackageItineraryDay(
    dayId,
    input,
  );
};

export const deletePackageItineraryDayService = async (
  userId: string,
  packageId: string,
  dayId: string,
): Promise<DeletePackageItineraryDayResponse> => {
  const existingPackage =
    await findPackageById(packageId);

  if (!existingPackage) {
    throw new CustomError(
      "Package not found",
      404,
    );
  }

  if (existingPackage.createdByUserId !== userId) {
    throw new CustomError(
      "You are not authorized to update this package",
      403,
    );
  }

  const existingDay =
    await findPackageItineraryDay(
      packageId,
      dayId,
    );

  if (!existingDay) {
    throw new CustomError(
      "Package itinerary day not found",
      404,
    );
  }

  return deletePackageItineraryDay(dayId);
};

export const addPackageItineraryDayService = async (
  userId: string,
  packageId: string,
  input: AddPackageItineraryDayInput,
): Promise<AddPackageItineraryDayResponse> => {

  const existingPackage =
    await findPackageById(packageId);

  if (!existingPackage) {
    throw new CustomError(
      "Package not found",
      404,
    );
  }

  if (existingPackage.createdByUserId !== userId) {
    throw new CustomError(
      "You are not authorized to update this package",
      403,
    );
  }

  const existingDay =
    await findPackageItineraryDayByNumber(
      packageId,
      input.dayNumber,
    );

  if (existingDay) {
    throw new CustomError(
      `Day ${input.dayNumber} already exists`,
      409,
    );
  }


  return addPackageItineraryDay(
    packageId,
    input,
  );
};


