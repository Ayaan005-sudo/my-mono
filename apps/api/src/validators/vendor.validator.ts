import { BookingStatus } from "@mono/database";
import z from "zod";

export const VendorIdParamSchema = z
  .object({
    vendorId: z
      .string()
      .min(1, "Vendor ID is required")
      .openapi({
        example: "01a07adc-d4d4-739d-8ca0-73f2b379f16c",
      }),
  })
  .openapi("VendorIdParam");


  export const VendorBookingsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  packageId: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  cursor: z.string().optional(),
});