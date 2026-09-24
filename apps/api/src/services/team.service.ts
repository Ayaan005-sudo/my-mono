import { findVendorProfileByUserId } from "../repositories/onboarding.repository.js";
import { createTeam, searchApprovedVendors } from "../repositories/team.repository.js";
import type { CreateTeamInput, CreateTeamResponse, TeamVendorSearchResult } from "../types/index.js";
import { CustomError } from "../utils/custom-error.js";

export const createTeamService = async (
  userId: string,
  data: CreateTeamInput,
): Promise<CreateTeamResponse> => {
  const vendorProfile = await findVendorProfileByUserId(userId);

  if (!vendorProfile) {
    throw new CustomError(
      "Vendor profile not found",
      404,
    );
  }

  if (vendorProfile.verificationStatus !== "APPROVED") {
    throw new CustomError(
      "Only approved vendors can create a team",
      403,
    );
  }

  return createTeam(data, userId);
};


export const searchTeamVendorsService = async (
  search: string,
  limit: number,
): Promise<TeamVendorSearchResult[]> => {
  const vendors = await searchApprovedVendors(
    search.trim(),
    limit,
  );

  return vendors.map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    email: vendor.email,
    avatarUrl: vendor.avatarUrl,

    city: vendor.city,
    state: vendor.state,

    vendorType: vendor.vendorProfile?.vendorType ?? null,
    experienceYears:
      vendor.vendorProfile?.experienceYears ?? null,
  }));
};
