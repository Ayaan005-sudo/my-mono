import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { getVendorPublicProfileController } from "../controllers/vendor.controller.js";
import { VendorIdParamSchema } from "../validators/vendor.validator.js";
export const VendorRoutes = new OpenAPIHono();


const ErrorSchema = z.object({
	success: z.boolean(),
	message: z.string(),
});

const SuccessSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: z.any().optional(),
});


VendorRoutes.openapi(
	createRoute({
		method: "get",
		path: "/{vendorId}/public-profile",
		tags: ["Vendor"],
		summary: "Get vendor public profile",
		request: {
			params: VendorIdParamSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: SuccessSchema,
					},
				},
				description: "Vendor profile fetched successfully",
			},
			400: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "Vendor ID is required",
			},
			404: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "Vendor not found",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "Failed to fetch vendor profile",
			},
		},
	}),
	getVendorPublicProfileController as any,
);
