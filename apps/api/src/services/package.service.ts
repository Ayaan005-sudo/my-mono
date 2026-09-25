import type { Difficulty } from "@mono/database";
import {
  addPackageItineraryDay,
  bulkCancelPackageSchedules,
  cancelPackageSchedule,
  countPackageItineraryDays,
  createPackage,
  createPackageItinerary,
  createPackageSchedule,
  deactivatePackage,
  deletePackageItineraryDay,
  findMasterTrekById,
  findMasterTrekItinerary,
  findMasterTrekRoutes,
  findPackageById,
  findPackageForPublish,
  findPackageItineraryDay,
  findPackageItineraryDayByNumber,
  findPackageScheduleById,
  findPackageSchedules,
  findPackageSchedulesByIds,
  findRouteForMasterTrek,
  getVendorActiveTeamsForPackageCreation,
  getVendorPackageCreationProfile,
  openPackageSchedule,
  publishPackage,
  updatePackageBasics,
  updatePackageInclusions,
  updatePackageItineraryDay,
  updatePackageSchedule,
  updatePackageScheduleType,
} from "../repositories/package.repository.js";
import type { AddPackageItineraryDayInput, AddPackageItineraryDayResponse, BulkCancelPackageSchedulesInput, BulkCancelPackageSchedulesResponse, CancelPackageScheduleInput, CancelPackageScheduleResponse, CreatePackageInput, CreatePackageItineraryInput, CreatePackageItineraryResponse, CreatePackageResponse, CreatePackageScheduleInput, CreatePackageScheduleResponse, DeactivatePackageResponse, DeletePackageItineraryDayResponse, GetPackageItineraryResponse, GetPackageRoutesResponse, GetPackageSchedulesResponse, OpenPackageScheduleResponse, PackageScheduleDisplayStatus, PublishPackageResponse, UpdatePackageBasicsInput, UpdatePackageBasicsResponse, UpdatePackageInclusionsInput, UpdatePackageInclusionsResponse, UpdatePackageItineraryDayInput, UpdatePackageItineraryDayResponse, UpdatePackageScheduleInput, UpdatePackageScheduleResponse, UpdatePackageScheduleTypeInput, UpdatePackageScheduleTypeResponse } from "../types/package.js";
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



export const updatePackageInclusionsService = async (
  userId: string,
  packageId: string,
  input: UpdatePackageInclusionsInput,
): Promise<UpdatePackageInclusionsResponse> => {

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

  return updatePackageInclusions(
    packageId,
    input,
  );
};

export const createPackageScheduleService = async (
  userId: string,
  packageId: string,
  input: CreatePackageScheduleInput,
): Promise<CreatePackageScheduleResponse> => {
  const existingPackage = await findPackageById(packageId);

  if (!existingPackage) {
    throw new CustomError("Package not found", 404);
  }

  if (existingPackage.createdByUserId !== userId) {
    throw new CustomError(
      "You are not authorized to manage this package",
      403,
    );
  }

 

const hasSinglePrice = input.price !== undefined;
const hasAdultPrice = input.adultPrice !== undefined;
const hasChildPrice = input.childPrice !== undefined;

if (hasSinglePrice && (hasAdultPrice || hasChildPrice)) {
  throw new CustomError(
    "Use either single price or adult/child prices, not both",
    400,
  );
}

if (!hasSinglePrice && (!hasAdultPrice || !hasChildPrice)) {
  throw new CustomError(
    "Provide either a single price or both adult and child prices",
    400,
  );
}

  if (input.endDate <= input.startDate) {
    throw new CustomError(
      "End date must be after start date",
      400,
    );
  }

  if (input.minParticipants > input.maxParticipants) {
    throw new CustomError(
      "Minimum participants cannot exceed maximum participants",
      400,
    );
  }

  if (
    input.bookingStartDate &&
    input.bookingEndDate &&
    input.bookingEndDate <= input.bookingStartDate
  ) {
    throw new CustomError(
      "Booking end date must be after booking start date",
      400,
    );
  }

  if (input.allowPartialPayment) {
    if (
      !input.depositType ||
      input.depositValue === undefined ||
      input.balanceDueDaysBeforeStart === undefined
    ) {
      throw new CustomError(
        "Deposit type, deposit value, and balance due days are required when partial payment is enabled",
        400,
      );
    }

    if (
      input.depositType === "PERCENTAGE" &&
      input.depositValue >= 100
    ) {
      throw new CustomError(
        "Percentage deposit must be less than 100",
        400,
      );
    }

    if (
      input.bookingStartDate &&
      new Date(
        input.startDate.getTime() -
          input.balanceDueDaysBeforeStart *
            24 *
            60 *
            60 *
            1000,
      ) < input.bookingStartDate
    ) {
      throw new CustomError(
        "Balance due date cannot be before booking start date",
        400,
      );
    }
  }

  return createPackageSchedule(packageId, input);
};


export const getPackageSchedulesService = async (
  userId: string,
  packageId: string,
): Promise<GetPackageSchedulesResponse> => {
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
      "You are not authorized to manage this package",
      403,
    );
  }

  const schedules =
    await findPackageSchedules(packageId);

  const now = new Date();

 return schedules.map((schedule) => {
  let displayStatus: PackageScheduleDisplayStatus;

  if (schedule.status === "CANCELLED") {
    displayStatus = "CANCELLED";

  } else if (schedule.status === "DRAFT") {
    displayStatus = "NEW";

  } else if (schedule.endDate < now) {
    displayStatus = "COMPLETED";

  } else if (
    schedule.bookingEndDate &&
    schedule.bookingEndDate < now
  ) {
    displayStatus = "CLOSED";

  } else if (schedule.availableSeats <= 0) {
    displayStatus = "SOLD_OUT";

  } else {
    displayStatus = "AVAILABLE";
  }

  return {
    ...schedule,
    displayStatus,
  };
});
};

export const updatePackageScheduleService = async (
  userId: string,
  packageId: string,
  scheduleId: string,
  input: UpdatePackageScheduleInput,
): Promise<UpdatePackageScheduleResponse> => {
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
      "You are not authorized to manage this package",
      403,
    );
  }

  const existingSchedule =
    await findPackageScheduleById(scheduleId);

  if (
    !existingSchedule ||
    existingSchedule.packageId !== packageId
  ) {
    throw new CustomError(
      "Package schedule not found",
      404,
    );
  }
  const price =
  input.price !== undefined
    ? input.price
    : existingSchedule.price;

const adultPrice =
  input.adultPrice !== undefined
    ? input.adultPrice
    : existingSchedule.adultPrice;

const childPrice =
  input.childPrice !== undefined
    ? input.childPrice
    : existingSchedule.childPrice;


    const hasSinglePrice = price !== null;
const hasAdultPrice = adultPrice !== null;
const hasChildPrice = childPrice !== null;

if (hasSinglePrice && (hasAdultPrice || hasChildPrice)) {
  throw new CustomError(
    "Use either single price or adult/child prices, not both",
    400,
  );
}

if (!hasSinglePrice && (!hasAdultPrice || !hasChildPrice)) {
  throw new CustomError(
    "Provide either a single price or both adult and child prices",
    400,
  );
}

  const startDate =
    input.startDate ?? existingSchedule.startDate;

  const endDate =
    input.endDate ?? existingSchedule.endDate;

  if (endDate <= startDate) {
    throw new CustomError(
      "End date must be after start date",
      400,
    );
  }

  const minParticipants =
    input.minParticipants ??
    existingSchedule.minParticipants;

  const maxParticipants =
    input.maxParticipants ??
    existingSchedule.maxParticipants;

  if (minParticipants > maxParticipants) {
    throw new CustomError(
      "Minimum participants cannot exceed maximum participants",
      400,
    );
  }

  const bookingStartDate =
    input.bookingStartDate ??
    existingSchedule.bookingStartDate;

  const bookingEndDate =
    input.bookingEndDate ??
    existingSchedule.bookingEndDate;

  if (
    bookingStartDate &&
    bookingEndDate &&
    bookingEndDate <= bookingStartDate
  ) {
    throw new CustomError(
      "Booking end date must be after booking start date",
      400,
    );
  }

  const allowPartialPayment =
    input.allowPartialPayment ??
    existingSchedule.allowPartialPayment;

  const depositType =
    input.depositType !== undefined
      ? input.depositType
      : existingSchedule.depositType;

  const depositValue =
    input.depositValue !== undefined
      ? input.depositValue
      : existingSchedule.depositValue;

  const balanceDueDaysBeforeStart =
    input.balanceDueDaysBeforeStart !== undefined
      ? input.balanceDueDaysBeforeStart
      : existingSchedule.balanceDueDaysBeforeStart;

  if (allowPartialPayment) {
    if (
      !depositType ||
      depositValue === null ||
      depositValue === undefined ||
      balanceDueDaysBeforeStart === null ||
      balanceDueDaysBeforeStart === undefined
    ) {
      throw new CustomError(
        "Deposit type, deposit value, and balance due days are required when partial payment is enabled",
        400,
      );
    }

    if (
      depositType === "PERCENTAGE" &&
      depositValue >= 100
    ) {
      throw new CustomError(
        "Percentage deposit must be less than 100",
        400,
      );
    }

    if (
      bookingStartDate &&
      new Date(
        startDate.getTime() -
          balanceDueDaysBeforeStart *
            24 *
            60 *
            60 *
            1000,
      ) < bookingStartDate
    ) {
      throw new CustomError(
        "Balance due date cannot be before booking start date",
        400,
      );
    }
  }

  return updatePackageSchedule(
    scheduleId,
    input,
  );
};


export const updatePackageScheduleTypeService = async (
  userId: string,
  packageId: string,
  input: UpdatePackageScheduleTypeInput,
): Promise<UpdatePackageScheduleTypeResponse> => {
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
      "You are not authorized to manage this package",
      403,
    );
  }

  return updatePackageScheduleType(
    packageId,
    input.scheduleType,
  );
};

export const cancelPackageScheduleService = async (
  userId: string,
  packageId: string,
  scheduleId: string,
  input: CancelPackageScheduleInput,
): Promise<CancelPackageScheduleResponse> => {
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
      "You are not authorized to manage this package",
      403,
    );
  }

  const existingSchedule =
    await findPackageScheduleById(scheduleId);

  if (
    !existingSchedule ||
    existingSchedule.packageId !== packageId
  ) {
    throw new CustomError(
      "Package schedule not found",
      404,
    );
  }

  if (existingSchedule.status === "CANCELLED") {
    throw new CustomError(
      "Package schedule is already cancelled",
      409,
    );
  }

  if (existingSchedule.status === "COMPLETED") {
    throw new CustomError(
      "Completed schedule cannot be cancelled",
      400,
    );
  }

  return cancelPackageSchedule(
    scheduleId,
    input.cancellationReason,
  );
};

export const bulkCancelPackageSchedulesService = async (
  userId: string,
  packageId: string,
  input: BulkCancelPackageSchedulesInput,
): Promise<BulkCancelPackageSchedulesResponse> => {
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
      "You are not authorized to manage this package",
      403,
    );
  }

  const uniqueScheduleIds = [
    ...new Set(input.scheduleIds),
  ];

  const schedules =
    await findPackageSchedulesByIds(
      packageId,
      uniqueScheduleIds,
    );

  if (schedules.length !== uniqueScheduleIds.length) {
    throw new CustomError(
      "One or more package schedules were not found",
      404,
    );
  }

  const alreadyCancelled = schedules.some(
    (schedule) =>
      schedule.status === "CANCELLED",
  );

  if (alreadyCancelled) {
    throw new CustomError(
      "One or more schedules are already cancelled",
      409,
    );
  }

  const completedSchedule = schedules.some(
    (schedule) =>
      schedule.status === "COMPLETED",
  );

  if (completedSchedule) {
    throw new CustomError(
      "Completed schedules cannot be cancelled",
      400,
    );
  }

  const result =
    await bulkCancelPackageSchedules(
      packageId,
      uniqueScheduleIds,
      input.cancellationReason,
    );

  return {
    cancelledCount: result.count,
  };
};

export const openPackageScheduleService = async (
  userId: string,
  packageId: string,
  scheduleId: string,
): Promise<OpenPackageScheduleResponse> => {
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
      "You are not authorized to manage this package",
      403,
    );
  }

  const existingSchedule =
    await findPackageScheduleById(scheduleId);

  if (
    !existingSchedule ||
    existingSchedule.packageId !== packageId
  ) {
    throw new CustomError(
      "Package schedule not found",
      404,
    );
  }

  if (existingSchedule.status === "OPEN") {
    throw new CustomError(
      "Package schedule is already open",
      409,
    );
  }

  if (existingSchedule.status === "CANCELLED") {
    throw new CustomError(
      "Cancelled schedule cannot be opened",
      400,
    );
  }

  if (existingSchedule.status === "COMPLETED") {
    throw new CustomError(
      "Completed schedule cannot be opened",
      400,
    );
  }

  if (existingSchedule.status !== "DRAFT") {
    throw new CustomError(
      "Only draft schedules can be opened",
      400,
    );
  }

  return openPackageSchedule(scheduleId);
};


export const publishPackageService = async (
  userId: string,
  packageId: string,
): Promise<PublishPackageResponse> => {
  const existingPackage =
    await findPackageForPublish(packageId);

  if (!existingPackage) {
    throw new CustomError(
      "Package not found",
      404,
    );
  }

  if (existingPackage.createdByUserId !== userId) {
    throw new CustomError(
      "You are not authorized to manage this package",
      403,
    );
  }

  if (existingPackage.status === "PUBLISHED") {
    throw new CustomError(
      "Package is already published",
      409,
    );
  }

  if (existingPackage.status === "CANCELLED") {
    throw new CustomError(
      "Cancelled package cannot be published",
      400,
    );
  }

  if (!existingPackage.title) {
    throw new CustomError(
      "Package title is required before publishing",
      400,
    );
  }

  if (!existingPackage.locationId) {
    throw new CustomError(
      "Package location is required before publishing",
      400,
    );
  }

  if (
    !existingPackage.durationDays ||
    !existingPackage.difficulty
  ) {
    throw new CustomError(
      "Package basics must be completed before publishing",
      400,
    );
  }

  if (existingPackage.itineraryDays.length === 0) {
    throw new CustomError(
      "Package itinerary is required before publishing",
      400,
    );
  }

  if (existingPackage.schedules.length === 0) {
    throw new CustomError(
      "At least one schedule is required before publishing",
      400,
    );
  }

  return publishPackage(packageId);
};

export const deactivatePackageService = async (
  userId: string,
  packageId: string,
): Promise<DeactivatePackageResponse> => {
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
      "You are not authorized to manage this package",
      403,
    );
  }

  if (existingPackage.status === "INACTIVE") {
    throw new CustomError(
      "Package is already deactivated",
      409,
    );
  }

  if (existingPackage.status === "DRAFT") {
    throw new CustomError(
      "Draft package cannot be deactivated",
      400,
    );
  }

  if (existingPackage.status === "CANCELLED") {
    throw new CustomError(
      "Cancelled package cannot be deactivated",
      400,
    );
  }

  return deactivatePackage(packageId);
};