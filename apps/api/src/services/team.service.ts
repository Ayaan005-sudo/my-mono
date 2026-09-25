import { sendVendorOnboardingInvitationEmail } from "../lib/email.service.js";
import { findVendorProfileByUserId } from "../repositories/onboarding.repository.js";

import { acceptTeamInvitation, createOnboardingTeamInvitation, createTeam, createTeamInvitation, findApprovedVendorById, findPendingTeamInvitation, findPendingTeamInvitationByEmail, findTeamById, findTeamInvitationById, findTeamMember, findTeamPublicProfileById, findUserByEmail, getActiveTeamMembers, getMyPendingTeamInvitations, getTeamBookingsData, getTeamDashboardData, getTeamDetailsById, rejectTeamInvitation, searchApprovedVendors, updateTeam } from "../repositories/team.repository.js";
import type { CreateTeamInput, CreateTeamResponse, GetReviewsResponse, InviteTeamVendorInput, InviteVendorOnboardingInput, MyTeamInvitation, ReviewPaginationQuery, TeamBookingsQuery, TeamBookingsResponse, TeamDashboardResponse, TeamDetailsResponse, TeamInvitationActionResponse, TeamInvitationResponse, TeamMemberResponse, TeamPublicProfileResponse, TeamVendorSearchResult, UpdateTeamInput, UpdateTeamResponse, VendorOnboardingInvitationResponse } from "../types/index.js";
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

export const getTeamDetailsService = async (
  teamId: string,
): Promise<TeamDetailsResponse> => {
  const team =
    await getTeamDetailsById(teamId);

  if (!team) {
    
    throw new CustomError(
      "Team not found",
      404,
    );
  }

  return team;
};

export const updateTeamService = async (
  userId: string,
  teamId: string,
  data: UpdateTeamInput,
): Promise<UpdateTeamResponse> => {
  const team = await findTeamById(teamId);

  if (!team) {
    throw new CustomError(
      "Team not found",
      404,
    );
  }

  const membership =
    await findTeamMember(teamId, userId);

  if (
    !membership ||
    membership.role !== "OWNER" ||
    membership.status !== "ACTIVE"
  ) {
    throw new CustomError(
      "Only the team owner can update the team",
      403,
    );
  }

  return updateTeam(teamId, data);
};


export const getTeamPublicProfileService = async (
  teamId: string,
): Promise<TeamPublicProfileResponse> => {
  const team =
    await findTeamPublicProfileById(
      teamId,
    );

  if (!team) {
    throw new CustomError(
      "Team not found",
      404,
    );
  }

  return team;
};

export const getTeamDashboardService = async (
  userId: string,
  teamId: string,
): Promise<TeamDashboardResponse> => {


  console.log("TEAM ACCESS CHECK:", {
  teamId,
  userId,
});


  
  const member =
    await findTeamMember(
      teamId,
      userId,
    );

    console.log("TEAM MEMBER FOUND:", member);

  if (
    !member ||
    member.status !== "ACTIVE"
  ) {
    throw new CustomError(
      "You are not authorized to access this team",
      403,
    );
  }

  const now = new Date();

  const data =
    await getTeamDashboardData(
      teamId,
      now,
    );

  const totalEarnings =
    data.successfulPayments.reduce(
      (total, payment) =>
        total + payment.amount,
      0,
    );

  const totalTrekkers =
    data.confirmedBookingParticipants.reduce(
      (total, booking) =>
        total +
        booking.adultCount +
        booking.childCount,
      0,
    );

  // Last 6 months including current month
  const revenueTrend: {
    period: string;
    revenue: number;
  }[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1,
    );

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0");

    revenueTrend.push({
      period: `${year}-${month}`,
      revenue: 0,
    });
  }

  for (const payment of
    data.successfulPayments) {
    if (!payment.paidAt) continue;

    const year =
      payment.paidAt.getFullYear();

    const month = String(
      payment.paidAt.getMonth() + 1,
    ).padStart(2, "0");

    const period = `${year}-${month}`;

    const item =
      revenueTrend.find(
        (entry) =>
          entry.period === period,
      );

    if (item) {
      item.revenue += payment.amount;
    }
  }

  return {
    stats: {
      totalEarnings,

      activeTreks:
        data.activeTreksCount,

      pendingBookings:
        data.pendingBookingsCount,

      totalTrekkers,
    },

    revenueTrend,

    pendingBookings:
      data.pendingBookings,

    activeTreks:
      data.activeTreks,
  };
};

export const getTeamBookingsService = async (
  userId: string,
  teamId: string,
  query: TeamBookingsQuery,
): Promise<TeamBookingsResponse> => {
  const member =
    await findTeamMember(
      teamId,
      userId,
    );

  if (
    !member ||
    member.status !== "ACTIVE"
  ) {
    throw new CustomError(
      "You are not authorized to access this team",
      403,
    );
  }

  const data =
    await getTeamBookingsData(
      teamId,
      query,
      new Date(),
    );

  const hasNextPage =
    data.bookings.length >
    query.limit;

  const bookings =
    hasNextPage
      ? data.bookings.slice(
          0,
          query.limit,
        )
      : data.bookings;

  const nextCursor =
    hasNextPage &&
    bookings.length > 0
      ? bookings[
          bookings.length - 1
        ].bookingId
      : null;

  return {
    ...data,

    bookings,

    nextCursor,

    hasNextPage,
  };
};


