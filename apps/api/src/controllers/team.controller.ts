import type { Context } from "hono";
import type { CreateTeamInput, InviteTeamVendorInput, InviteVendorOnboardingInput, SearchTeamVendorQuery } from "../types/index.js";
import * as TeamService from "../services/team.service.js";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";
import { inviteTeamVendorService, inviteVendorOnboardingService, searchTeamVendorsService } from "../services/team.service.js";

export const createTeam = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;

    const body = await c.req.json<CreateTeamInput>();

    const result = await TeamService.createTeamService(
      userId,
      body,
    );

    logger.info(
      { userId, teamId: result.id },
      "Team created successfully",
    );

    return ApiResponse.success(
      "Team created successfully",
      result,
      201,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to create team",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to create team",
      500,
    ).send(c);
  }
};


export const searchTeamVendorsController = async (
  c: Context,
): Promise<Response> => {
  try {
    const query =
      c.req.valid("query" as never) as SearchTeamVendorQuery;

    const result = await searchTeamVendorsService(
      query.search,
      query.limit,
    );

    return ApiResponse.success(
      "Vendors fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to search vendors",
      500,
    ).send(c);
  }
};


export const inviteTeamVendorController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const teamId = c.req.param("teamId");

    if (!teamId) {
      return ApiResponse.error(
        "Team ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<InviteTeamVendorInput>();

    const result = await inviteTeamVendorService(
      userId,
      teamId,
      body,
    );

    return ApiResponse.success(
      "Team invitation sent successfully",
      result,
      201,
    ).send(c);
  } catch (error) {
    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to send team invitation",
      500,
    ).send(c);
  }
};


export const inviteVendorOnboardingController = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId");
    const teamId = c.req.param("teamId");

    if (!teamId) {
      return ApiResponse.error(
        "Team ID is required",
        400,
      ).send(c);
    }

    const body =
      await c.req.json<InviteVendorOnboardingInput>();

    const result =
      await inviteVendorOnboardingService(
        userId,
        teamId,
        body,
      );

    return ApiResponse.success(
      "Vendor onboarding invitation sent successfully",
      result,
      201,
    ).send(c);
  } catch (error) {
    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to send vendor onboarding invitation",
      500,
    ).send(c);
  }
};