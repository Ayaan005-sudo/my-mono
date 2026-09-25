import type { VendorPublicProfileResponse } from "../types/index.js";
import { prisma } from "../utils/prisma.js";


export const findVendorPublicProfileById = async (
  vendorId: string,
): Promise<VendorPublicProfileResponse | null> => {
  const vendorProfile =
    await prisma.vendorProfile.findFirst({
      where: {
        id: vendorId,

        verificationStatus: "APPROVED",

        user: {
          is: {
            role: "VENDOR",
            isDeleted: false,
          },
        },
      },

      select: {
        id: true,

        vendorType: true,
        experienceYears: true,
        treksLed: true,
        regionsWorkedIn: true,

        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,

            city: true,
            state: true,
            country: true,

            languages: true,

            userExperiences: {
              where: {
                verificationStatus: "APPROVED",
              },

              orderBy: {
                completedAt: "desc",
              },

              select: {
                id: true,

                description: true,
                imageUrls: true,

                trekName: true,
                difficulty: true,
                roleDuringTrek: true,
                completedAt: true,
                duration: true,
                altitude: true,
                proofUrl: true,

                verificationStatus: true,

                source: true,
                packageId: true,
                scheduleId: true,
              },
            },

            userCertifications: {
              where: {
                verificationStatus: "APPROVED",
              },

              orderBy: {
                issuedAt: "desc",
              },

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

            userBadges: {
              orderBy: {
                awardedAt: "desc",
              },

              select: {
                badge: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    iconUrl: true,
                  },
                },
              },
            },

            packages: {
              where: {
                status: "PUBLISHED",
                visibility: "PUBLIC",
              },

              orderBy: {
                createdAt: "desc",
              },

              take: 6,

              select: {
                id: true,
                title: true,
                description: true,
                galleryImages: true,
              },
            },
          },
        },
      },
    });

  if (!vendorProfile) {
    return null;
  }

  const user = vendorProfile.user;

  return {
    // IMPORTANT:
    // Public vendor profile ID = VendorProfile.id
    id: vendorProfile.id,

    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,

    location: {
      city: user.city,
      state: user.state,
      country: user.country,
    },

    languages: user.languages,

    professionalInfo: {
      vendorType: vendorProfile.vendorType,

      experienceYears:
        vendorProfile.experienceYears,

      treksLed: vendorProfile.treksLed,

      regionsWorkedIn:
        vendorProfile.regionsWorkedIn,
    },

    experiences: user.userExperiences,

    certifications:
      user.userCertifications,

    badges: user.userBadges.map(
      (userBadge) => userBadge.badge,
    ),

    packages: user.packages,
  };
};