import type { Context } from "hono";
import type { CreateTeamInput } from "../types/index.js";
import * as TeamService from "../services/team.service.js";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";

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
