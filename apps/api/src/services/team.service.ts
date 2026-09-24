import { findVendorProfileByUserId } from "../repositories/onboarding.repository.js";
import { createTeam, createTeamInvitation, findApprovedVendorById, findPendingTeamInvitation, findTeamById, findTeamMember, searchApprovedVendors } from "../repositories/team.repository.js";
import type { CreateTeamInput, CreateTeamResponse, InviteTeamVendorInput, TeamInvitationResponse, TeamVendorSearchResult } from "../types/index.js";
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


export const inviteTeamVendorService = async (
  userId: string,
  teamId: string,
  data: InviteTeamVendorInput,
): Promise<TeamInvitationResponse> => {
  const team = await findTeamById(teamId);

  if (!team) {
    throw new CustomError(
      "Team not found",
      404,
    );
  }

  
  const ownerMembership = await findTeamMember(
    teamId,
    userId,
  );

  if (
    !ownerMembership ||
    ownerMembership.role !== "OWNER" ||
    ownerMembership.status !== "ACTIVE"
  ) {
    throw new CustomError(
      "Only the team owner can invite members",
      403,
    );
  }

  if (data.invitedUserId === userId) {
    throw new CustomError(
      "You cannot invite yourself",
      400,
    );
  }

  const vendor = await findApprovedVendorById(
    data.invitedUserId,
  );

  if (!vendor) {
    throw new CustomError(
      "Approved vendor not found",
      404,
    );
  }

  const existingMember = await findTeamMember(
    teamId,
    vendor.id,
  );

  if (
    existingMember &&
    existingMember.status === "ACTIVE"
  ) {
    throw new CustomError(
      "Vendor is already a team member",
      409,
    );
  }

  const pendingInvitation =
    await findPendingTeamInvitation(
      teamId,
      vendor.id,
    );

  if (pendingInvitation) {
    throw new CustomError(
      "Invitation already sent to this vendor",
      409,
    );
  }

  return createTeamInvitation(
    teamId,
    vendor.id,
    vendor.email,
    userId,
  );
};