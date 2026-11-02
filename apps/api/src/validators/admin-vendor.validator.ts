import { z } from "@hono/zod-openapi";

export const RejectVendorApplicationSchema = z.object({
  rejectionReason: z.string().min(1).openapi({
    example: "Certification details are incomplete",
  }),
});
