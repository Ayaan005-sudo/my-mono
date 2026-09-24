import { sendVendorOnboardingInvitationEmail } from "../lib/email.service.js";
import { findVendorProfileByUserId } from "../repositories/onboarding.repository.js";
import { acceptTeamInvitation, createOnboardingTeamInvitation, createTeam, createTeamInvitation, findApprovedVendorById, findPendingTeamInvitation, findPendingTeamInvitationByEmail, findTeamById, findTeamInvitationById, findTeamMember, findUserByEmail, getActiveTeamMembers, getMyPendingTeamInvitations, rejectTeamInvitation, searchApprovedVendors } from "../repositories/team.repository.js";
import type { CreateTeamInput, CreateTeamResponse, InviteTeamVendorInput, InviteVendorOnboardingInput, MyTeamInvitation, TeamInvitationActionResponse, TeamInvitationResponse, TeamMemberResponse, TeamVendorSearchResult, VendorOnboardingInvitationResponse } from "../types/index.js";
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


export const inviteVendorOnboardingService = async (
  userId: string,
  teamId: string,
  data: InviteVendorOnboardingInput,
): Promise<VendorOnboardingInvitationResponse> => {
  const email = data.email.trim().toLowerCase();

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
      "Only the team owner can send onboarding invitations",
      403,
    );
  }

  const existingUser = await findUserByEmail(email);

  if (
    existingUser?.role === "VENDOR" &&
    existingUser.vendorProfile?.verificationStatus === "APPROVED"
  ) {
    throw new CustomError(
      "This user is already an approved vendor. Invite them through vendor search",
      409,
    );
  }

  const existingInvitation =
    await findPendingTeamInvitationByEmail(
      teamId,
      email,
    );

  if (existingInvitation) {
    throw new CustomError(
      "Onboarding invitation already sent to this email",
      409,
    );
  }

  const invitation =
    await createOnboardingTeamInvitation(
      teamId,
      email,
      userId,
      existingUser?.id,
    );

  await sendVendorOnboardingInvitationEmail(
    email,
    team.name,
    invitation.id,
  );

  return invitation;
};


export const getMyTeamInvitationsService = async (
  userId: string,
): Promise<MyTeamInvitation[]> => {
  return getMyPendingTeamInvitations(userId);
};

export const acceptTeamInvitationService = async (
  userId: string,
  invitationId: string,
): Promise<TeamInvitationActionResponse> => {
  const invitation =
    await findTeamInvitationById(invitationId);

  if (!invitation) {
    throw new CustomError(
      "Team invitation not found",
      404,
    );
  }

  if (invitation.invitedUserId !== userId) {
    throw new CustomError(
      "You are not authorized to accept this invitation",
      403,
    );
  }

  if (invitation.status !== "PENDING") {
    throw new CustomError(
      "Only pending invitations can be accepted",
      400,
    );
  }

  if (
    invitation.expiresAt &&
    invitation.expiresAt < new Date()
  ) {
    throw new CustomError(
      "Team invitation has expired",
      400,
    );
  }

  const existingMember =
    await findTeamMember(
      invitation.teamId,
      userId,
    );

  if (
    existingMember &&
    existingMember.status === "ACTIVE"
  ) {
    throw new CustomError(
      "You are already a member of this team",
      409,
    );
  }

  return acceptTeamInvitation(
    invitationId,
    invitation.teamId,
    userId,
  );
};


export const rejectTeamInvitationService = async (
  userId: string,
  invitationId: string,
): Promise<TeamInvitationActionResponse> => {
  const invitation =
    await findTeamInvitationById(invitationId);

  if (!invitation) {
    throw new CustomError(
      "Team invitation not found",
      404,
    );
  }

  if (invitation.invitedUserId !== userId) {
    throw new CustomError(
      "You are not authorized to reject this invitation",
      403,
    );
  }

  if (invitation.status !== "PENDING") {
    throw new CustomError(
      "Only pending invitations can be rejected",
      400,
    );
  }

  return rejectTeamInvitation(invitationId);
};

export const getTeamMembersService = async (
  teamId: string,
): Promise<TeamMemberResponse[]> => {
  const team = await findTeamById(teamId);

  if (!team) {
    throw new CustomError(
      "Team not found",
      404,
    );
  }

  return getActiveTeamMembers(teamId);
};

