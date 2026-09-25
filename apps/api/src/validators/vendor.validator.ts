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