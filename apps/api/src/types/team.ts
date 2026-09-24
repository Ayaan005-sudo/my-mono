import type { CreateTeamSchema } from "../validators/team.validator.js";
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
