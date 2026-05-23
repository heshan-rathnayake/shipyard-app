"use server";

import { db } from "@shipyard/db";
import { logger } from "@shipyard/logger";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be under 72 characters"),
});

export type ResetPasswordState =
  | { status: "idle" }
  | { status: "error"; message: string };

const RESET_PREFIX = "pw-reset:";

export async function resetPassword(
  _prev: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = schema.safeParse({
    token: formData.get("token"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { token, email, password } = parsed.data;
  const identifier = `${RESET_PREFIX}${email}`;

  try {
    const record = await db.verificationToken.findUnique({
      where: { identifier_token: { identifier, token } },
      select: { expires: true },
    });

    if (!record) {
      return {
        status: "error",
        message: "This reset link is invalid or has already been used.",
      };
    }

    if (record.expires < new Date()) {
      await db.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      });
      return {
        status: "error",
        message: "This reset link has expired. Please request a new one.",
      };
    }

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return {
        status: "error",
        message: "No account found for this email.",
      };
    }

    const hash = await bcrypt.hash(password, 12);

    // Update or create the password row, then delete the token — all in one transaction.
    await db.$transaction([
      db.password.upsert({
        where: { userId: user.id },
        update: { hash },
        create: { userId: user.id, hash },
      }),
      db.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      }),
    ]);
  } catch (err) {
    logger.error("[resetPassword] unexpected error:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  redirect("/login?reset=true");
}
