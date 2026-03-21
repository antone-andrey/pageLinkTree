import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "");
}
const FROM_EMAIL = process.env.FROM_EMAIL || "PageDrop <noreply@pagedrop.com>";

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your PageDrop password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #111; margin: 0;">PageDrop</h1>
        </div>
        <h2 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 16px;">Reset your password</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Click the button below to reset your password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Reset password
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendBookingConfirmationEmail({
  guestEmail,
  guestName,
  serviceName,
  hostName,
  startTime,
  duration,
}: {
  guestEmail: string;
  guestName: string;
  serviceName: string;
  hostName: string;
  startTime: Date;
  duration: number;
}) {
  const dateStr = startTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = startTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: guestEmail,
    subject: `Booking confirmed — ${serviceName} with ${hostName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #111; margin: 0;">PageDrop</h1>
        </div>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
          <p style="color: #166534; font-weight: 600; margin: 0;">✓ Booking confirmed</p>
        </div>
        <p style="color: #555; font-size: 15px; margin-bottom: 16px;">Hi ${guestName},</p>
        <h2 style="font-size: 18px; font-weight: 600; color: #111; margin-bottom: 4px;">${serviceName}</h2>
        <p style="color: #555; font-size: 14px; margin-bottom: 20px;">with ${hostName}</p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; color: #111; font-size: 14px;"><strong>Date:</strong> ${dateStr}</p>
          <p style="margin: 0 0 8px; color: #111; font-size: 14px;"><strong>Time:</strong> ${timeStr}</p>
          <p style="margin: 0; color: #111; font-size: 14px;"><strong>Duration:</strong> ${duration} minutes</p>
        </div>
        <p style="color: #999; font-size: 13px;">
          Booked via <a href="${process.env.NEXTAUTH_URL}" style="color: #6366f1;">PageDrop</a>
        </p>
      </div>
    `,
  });
}

export async function sendBookingNotificationToHost({
  hostEmail,
  guestName,
  guestEmail,
  serviceName,
  startTime,
  duration,
}: {
  hostEmail: string;
  guestName: string;
  guestEmail: string;
  serviceName: string;
  startTime: Date;
  duration: number;
}) {
  const dateStr = startTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = startTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: hostEmail,
    subject: `New booking: ${guestName} — ${serviceName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #111; margin: 0;">PageDrop</h1>
        </div>
        <h2 style="font-size: 18px; font-weight: 600; color: #111; margin-bottom: 16px;">New booking received!</h2>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; color: #111; font-size: 14px;"><strong>Service:</strong> ${serviceName}</p>
          <p style="margin: 0 0 8px; color: #111; font-size: 14px;"><strong>Guest:</strong> ${guestName} (${guestEmail})</p>
          <p style="margin: 0 0 8px; color: #111; font-size: 14px;"><strong>Date:</strong> ${dateStr}</p>
          <p style="margin: 0 0 8px; color: #111; font-size: 14px;"><strong>Time:</strong> ${timeStr}</p>
          <p style="margin: 0; color: #111; font-size: 14px;"><strong>Duration:</strong> ${duration} minutes</p>
        </div>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/booking" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          View in dashboard
        </a>
      </div>
    `,
  });
}
