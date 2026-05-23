"use server";

import crypto from "node:crypto";
import { db } from "@shipyard/db";
import { renderResetPasswordEmail, sendEmail } from "@shipyard/email";
import { logger } from "@shipyard/logger";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

// Prefix distinguishes reset tokens from email-verification tokens in the
// shared VerificationToken table.
const RESET_PREFIX = "pw-reset:";
const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function requestPasswordReset(
  _prev: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid email",
    };
  }

  const { email } = parsed.data;

  // Always return success — never reveal whether an account exists.
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        name: true,
        password: { select: { createdAt: true } },
      },
    });

    // Only send to credentials accounts — OAuth-only users have no password to reset.
    if (user?.password) {
      const identifier = `${RESET_PREFIX}${email}`;

      // Delete any existing reset token for this email before issuing a new one.
      await db.verificationToken.deleteMany({ where: { identifier } });

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + RESET_TTL_MS);

      await db.verificationToken.create({
        data: { identifier, token, expires },
      });

      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

      const html = await renderResetPasswordEmail({
        name: user.name ?? email,
        resetUrl,
      });

      await sendEmail({
        to: email,
        subject: "Reset your Shipyard password",
        html,
        templateName: "reset-password",
        templateData: { email },
        db,
      });
    }
  } catch (err) {
    logger.error("[requestPasswordReset] unexpected error:", err);
    // Still return success to avoid revealing server errors to potential attackers.
  }

  return { status: "success" };
}
