"use server";

import { db } from "@shipyard/db";
import { logger } from "@shipyard/logger";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/server/auth";

// ─── Change password ──────────────────────────────────────────────────────────

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(72, "New password must be under 72 characters"),
});

export type ChangePasswordState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await auth();
  if (!session) return { status: "error", message: "Not authenticated." };

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const record = await db.password.findUnique({
      where: { userId: session.user.id },
      select: { hash: true },
    });

    if (!record) {
      return {
        status: "error",
        message: "No password is set on this account.",
      };
    }

    const isValid = await bcrypt.compare(currentPassword, record.hash);
    if (!isValid) {
      return { status: "error", message: "Current password is incorrect." };
    }

    if (currentPassword === newPassword) {
      return {
        status: "error",
        message: "New password must be different from the current one.",
      };
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await db.password.update({
      where: { userId: session.user.id },
      data: { hash },
    });
  } catch (err) {
    logger.error("[changePassword] unexpected error:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return { status: "success" };
}

// ─── Delete account ───────────────────────────────────────────────────────────

export type DeleteAccountState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "blocked"; orgs: string[] }
  | { status: "error"; message: string };

export async function deleteAccount(
  _prev: DeleteAccountState,
  _formData: FormData
): Promise<DeleteAccountState> {
  const session = await auth();
  if (!session) return { status: "error", message: "Not authenticated." };

  const userId = session.user.id;

  try {
    // Find orgs where this user is the only OWNER — deleting their account
    // would leave those orgs unmanageable.
    const ownedMemberships = await db.member.findMany({
      where: { userId, role: "OWNER" },
      select: {
        organization: {
          select: {
            name: true,
            _count: { select: { members: { where: { role: "OWNER" } } } },
          },
        },
      },
    });

    const orphaningOrgs = ownedMemberships
      .filter((m) => m.organization._count.members === 1)
      .map((m) => m.organization.name);

    if (orphaningOrgs.length > 0) {
      return { status: "blocked", orgs: orphaningOrgs };
    }

    // Delete the user — Prisma cascade removes Member, Account, Session,
    // Password, and Invitation rows automatically.
    await db.user.delete({ where: { id: userId } });
  } catch (err) {
    logger.error("[deleteAccount] unexpected error:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return { status: "success" };
}
