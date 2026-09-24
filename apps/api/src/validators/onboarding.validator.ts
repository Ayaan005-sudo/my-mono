import { z } from "@hono/zod-openapi";

export const UpdateOnboardingProfileSchema = z.object({
  firstName: z.string().min(1).openapi({
    example: "Ayaan",
  }),

  lastName: z.string().min(1).openapi({
    example: "Ahmed Abbasi",
  }),

  phone: z.string().min(10).openapi({
    example: "9876543210",
  }),

  address: z.string().min(1).openapi({
    example: "Malviya Nagar",
  }),

  city: z.string().min(1).openapi({
    example: "Jaipur",
  }),

  state: z.string().min(1).openapi({
    example: "Rajasthan",
  }),

  country: z.string().min(1).openapi({
    example: "India",
  }),

  pinCode: z.string().min(6).openapi({
    example: "302017",
  }),

  languages: z.array(z.string()).min(1).openapi({
    example: ["Hindi", "English"],
  }),

  avatarUrl: z.string().url().optional().openapi({
    example: "https://example.com/profile.jpg",
  }),
});

export const CreateVendorProfileSchema = z.object({
  vendorType: z
    .enum([
      "TREK_LEADER",
      "LOCAL_TRAIL_GUIDE",
      "MOUNTAINEER",
      "EXPERIENCE_ORGANIZER",
      "ACTIVITY_HOST",
      "CAMP_OPERATOR",
    ])
    .openapi({
      example: "TREK_LEADER",
    }),
});

export const UpdateVendorEligibilitySchema = z.object({
  isAgeEligible: z.boolean().openapi({
    example: true,
  }),
  hasRequiredExperience: z.boolean().openapi({
    example: true,
  }),
  hasFirstAidCertification: z.boolean().openapi({
    example: true,
  }),
  hasSmartphoneAndWhatsApp: z.boolean().openapi({
    example: true,
  }),
  agreesToInsuranceTerms: z.boolean().openapi({
    example: true,
  }),
  agreesToSafetyStandards: z.boolean().openapi({
    example: true,
  }),
});

export const UpdateVendorExpertiseSchema = z.object({
  experienceYears: z
    .number()
    .int()
    .min(0)
    .openapi({
      example: 5,
    }),

  treksLed: z
    .number()
    .int()
    .min(0)
    .openapi({
      example: 20,
    }),

  regionsWorkedIn: z
    .array(z.string())
    .min(1)
    .openapi({
      example: [
        "Uttarakhand",
        "Himachal Pradesh",
        "Kashmir",
      ],
    }),
});

export const CreateUserExperienceSchema = z.object({
  description: z.string().min(1).openapi({
    example:
      "Led Hampta Pass trek with a group of 20 trekkers.",
  }),

  imageUrls: z
    .array(z.string().url())
    .min(1)
    .openapi({
      example: [
        "https://example.com/experience1.jpg",
        "https://example.com/experience2.jpg",
      ],
    }),
});

export const CreateUserCertificationSchema = z.object({
  title: z.string().min(1).openapi({
    example: "Basic Mountaineering Certificate",
  }),

  issuingOrganization: z.string().min(1).openapi({
    example: "Nehru Institute of Mountaineering",
  }),

  certificateNumber: z.string().optional().openapi({
    example: "NIM-BMC-2025-001",
  }),

  certificateUrl: z.string().url().openapi({
    example: "https://example.com/certificate.pdf",
  }),

  issuedAt: z.string().datetime().optional().openapi({
    example: "2025-01-01T00:00:00.000Z",
  }),

  expiresAt: z.string().datetime().optional().openapi({
    example: "2030-01-01T00:00:00.000Z",
  }),
});




