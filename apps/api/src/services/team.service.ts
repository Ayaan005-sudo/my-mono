import { findVendorProfileByUserId } from "../repositories/onboarding.repository.js";
import { createTeam } from "../repositories/team.repository.js";
import type { CreateTeamInput, CreateTeamResponse } from "../types/index.js";
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
