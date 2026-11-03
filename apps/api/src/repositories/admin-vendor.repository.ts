import { prisma } from "../utils/prisma.js";
import type {
  PendingVendorApplicationResponse,
  RejectVendorApplicationInput,
  VendorApplicationDetailsResponse,
  VendorReviewResponse,
} from "../types/index.js";

export const getPendingVendorApplications = async (): Promise<
  PendingVendorApplicationResponse[]
> => {
  return prisma.vendorProfile.findMany({
    where: {
      verificationStatus: "PENDING",
    },
    select: {
      id: true,
      userId: true,
      vendorType: true,
      verificationStatus: true,
      submittedAt: true,
      user: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
          city: true,
          state: true,
        },
      },
    },
    orderBy: {
      submittedAt: "asc",
    },
  });
};

export const getVendorApplicationByUserId = async (
  userId: string,
): Promise<VendorApplicationDetailsResponse | null> => {
  return prisma.vendorProfile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      vendorType: true,
      experienceYears: true,
      treksLed: true,
      regionsWorkedIn: true,
      isAgeEligible: true,
      hasRequiredExperience: true,
      hasFirstAidCertification: true,
      hasSmartphoneAndWhatsApp: true,
      agreesToInsuranceTerms: true,
      agreesToSafetyStandards: true,
      verificationStatus: true,
      submittedAt: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
          address: true,
          city: true,
          state: true,
          country: true,
          pinCode: true,
          languages: true,
          userExperiences: {
            select: {
              id: true,
              description: true,
              imageUrls: true,
              verificationStatus: true,
            },
          },
          userCertifications: {
            select: {
              id: true,
              title: true,
              issuingOrganization: true,
              certificateNumber: true,
              certificateUrl: true,
              issuedAt: true,
              expiresAt: true,
              verificationStatus: true,
            },
          },
        },
      },
    },
  });
};

export const approveVendorApplication = async (
  userId: string,
): Promise<VendorReviewResponse> => {
  return prisma.$transaction(async (tx) => {
    const vendorProfile = await tx.vendorProfile.update({
      where: {
        userId,
      },
      data: {
        verificationStatus: "APPROVED",
        verifiedAt: new Date(),
        rejectionReason: null,
      },
      select: {
        id: true,
        userId: true,
        verificationStatus: true,
        verifiedAt: true,
        rejectionReason: true,
      },
    });

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        role: "VENDOR",
      },
    });

    return vendorProfile;
  });
};

export const rejectVendorApplication = async (
  userId: string,
  data: RejectVendorApplicationInput,
): Promise<VendorReviewResponse> => {
  return prisma.vendorProfile.update({
    where: {
      userId,
    },
    data: {
      verificationStatus: "REJECTED",
      rejectionReason: data.rejectionReason,
      verifiedAt: null,
    },
    select: {
      id: true,
      userId: true,
      verificationStatus: true,
      verifiedAt: true,
      rejectionReason: true,
    },
  });
};

