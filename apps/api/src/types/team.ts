import type { CreateTeamSchema, InviteTeamVendorSchema, InviteVendorOnboardingSchema, SearchTeamVendorQuerySchema } from "../validators/team.validator.js";
import type z from "zod";

export type CreateTeamResponse = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;


export type SearchTeamVendorQuery = z.infer<typeof SearchTeamVendorQuerySchema>;

export type TeamVendorSearchResult = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;

  city: string | null;
  state: string | null;

  vendorType: string | null;
  experienceYears: number | null;
};


export type InviteTeamVendorInput = z.infer<
  typeof InviteTeamVendorSchema
>;

export type TeamInvitationResponse = {
  id: string;
  teamId: string;
  invitedUserId: string | null;
  email: string;
  invitedByUserId: string;
  status: string;
  expiresAt: Date | null;
  createdAt: Date;
};

export type InviteVendorOnboardingInput = z.infer<
  typeof InviteVendorOnboardingSchema
>;

export type VendorOnboardingInvitationResponse = {
  id: string;
  teamId: string;
  invitedUserId: string | null;
  email: string;
  invitedByUserId: string;
  status: string;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};


export type MyTeamInvitation = {
  id: string;
  status: string;
  createdAt: Date;
  expiresAt: Date | null;

  team: {
    id: string;
    name: string;
    logoUrl: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
  };

  invitedBy: {
    id: string;
    name: string | null;
    email: string;
  };
};

export type TeamInvitationActionResponse = {
  id: string;
  teamId: string;
  invitedUserId: string | null;
  email: string;
  invitedByUserId: string;
  status: string;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};


export type TeamMemberResponse = {
  id: string;
  role: string;
  status: string;
  joinedAt: Date | null;

  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    city: string | null;
    state: string | null;

    vendorProfile: {
      vendorType: string | null;
      experienceYears: number | null;
    } | null;
  };
};
