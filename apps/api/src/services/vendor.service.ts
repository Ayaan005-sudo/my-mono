import { findVendorPublicProfileById } from "../repositories/vendor.repository.js";
import type { VendorPublicProfileResponse } from "../types/index.js";
import { CustomError } from "../utils/custom-error.js";


export const getVendorPublicProfileService = async (
	vendorId: string,
): Promise<VendorPublicProfileResponse> => {
	const vendor =
		await findVendorPublicProfileById(vendorId);

	if (!vendor) {
		throw new CustomError(
			"Vendor not found",
			404,
		);
	}

	return vendor;
};