import { findVendorPublicProfileById, getVendorBookingsData, getVendorDashboardData } from "../repositories/vendor.repository.js";
import type { VendorBookingsQuery, VendorBookingsResponse, VendorDashboardResponse, VendorPublicProfileResponse } from "../types/index.js";
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


export const getVendorDashboardService = async (
	userId: string,
): Promise<VendorDashboardResponse> => {
	const now = new Date();
	const data = await getVendorDashboardData(userId, now);
	const monthStart = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth() - 5,
			1,
		),
	);

	const periods = Array.from({ length: 6 }, (_, index) => {
		const date = new Date(monthStart);
		date.setUTCMonth(monthStart.getUTCMonth() + index);
		return date;
	});

	const revenueByPeriod = new Map<string, number>();
	for (const payment of data.successfulPayments) {
		if (!payment.paidAt || payment.paidAt < monthStart) {
			continue;
		}

		const period = `${payment.paidAt.getUTCFullYear()}-${String(
			payment.paidAt.getUTCMonth() + 1,
		).padStart(2, "0")}`;
		revenueByPeriod.set(
			period,
			(revenueByPeriod.get(period) ?? 0) +
				payment.amount,
		);
	}

	const revenueTrend = periods.map((period) => {
		const key = `${period.getUTCFullYear()}-${String(
			period.getUTCMonth() + 1,
		).padStart(2, "0")}`;
		return {
			period: key,
			revenue: revenueByPeriod.get(key) ?? 0,
		};
	});

	return {
		stats: {
			totalEarnings: data.successfulPayments.reduce(
				(total, payment) => total + payment.amount,
				0,
			),
			activeTreks: data.activeTreksCount,
			pendingBookings: data.pendingBookingsCount,
			totalTrekkers: data.confirmedBookingParticipants.reduce(
				(total, booking) =>
					total + booking.adultCount + booking.childCount,
				0,
			),
		},
		revenueTrend,
		pendingBookings: data.pendingBookings,
		activeTreks: data.activeTreks,
	};
};


export const getVendorBookingsService = async (
	userId: string,
	query: VendorBookingsQuery,
): Promise<VendorBookingsResponse> => {
	const data = await getVendorBookingsData(
		userId,
		query,
		new Date(),
	);
	const hasNextPage =
		data.bookings.length > query.limit;
	const bookings = hasNextPage
		? data.bookings.slice(0, query.limit)
		: data.bookings;

	return {
		summary: {
			totalBookings: data.totalBookings,
			pendingBookings: data.pendingBookings,
			confirmedRevenue: data.confirmedRevenue,
			upcomingTreks: data.upcomingTreks,
		},
		bookings,
		nextCursor: hasNextPage
			? bookings[bookings.length - 1]?.bookingId ?? null
			: null,
		hasNextPage,
	};
};
