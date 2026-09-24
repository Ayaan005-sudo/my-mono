import { Resend } from "resend";
import "dotenv/config";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVendorOnboardingInvitationEmail = async (
  email: string,
  teamName: string,
  invitationId: string,
) => {
  const onboardingUrl =
    `${process.env.FRONTEND_URL}/vendor/onboarding?teamInvitationId=${invitationId}`;

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: `Invitation to join ${teamName}`,
    html: `
      <h2>You've been invited to join ${teamName}</h2>

      <p>
        Complete your vendor onboarding to become
        eligible to join the team.
      </p>

      <a href="${onboardingUrl}">
        Complete Vendor Onboarding
      </a>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
};
