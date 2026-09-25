import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { getVendorDashboardController, getVendorPublicProfileController } from "../controllers/vendor.controller.js";
import { VendorIdParamSchema } from "../validators/vendor.validator.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
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



VendorRoutes.openapi(
	createRoute({
		method: "get",
		path: "/dashboard",
		tags: ["Vendor"],
		summary: "Get vendor dashboard",
		security: [{ bearerAuth: [] }],
		responses: {
			200: {
				content: { "application/json": { schema: SuccessSchema } },
				description: "Vendor dashboard fetched successfully",
			},
			401: {
				content: { "application/json": { schema: ErrorSchema } },
				description: "Unauthorized",
			},
			403: {
				content: { "application/json": { schema: ErrorSchema } },
				description: "Vendor role required",
			},
			500: {
				content: { "application/json": { schema: ErrorSchema } },
				description: "Failed to fetch vendor dashboard",
			},
		},
		middleware: [authMiddleware, requireRole("VENDOR")],
	}),
	getVendorDashboardController as any,
);