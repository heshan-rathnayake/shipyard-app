"use client";

import { Button } from "@shipyard/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shipyard/ui/components/dialog";
import { Input } from "@shipyard/ui/components/input";
import { Label } from "@shipyard/ui/components/label";
import { Loader2, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { deleteAccount, type DeleteAccountState } from "../actions";

const initialState: DeleteAccountState = { status: "idle" };

interface DeleteAccountButtonProps {
  email: string;
}

export function DeleteAccountButton({ email }: DeleteAccountButtonProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [state, action, isPending] = useActionState(deleteAccount, initialState);

  // On success, the user record is gone — sign out and redirect to home.
  useEffect(() => {
    if (state.status === "success") {
      signOut({ callbackUrl: "/" });
    }
  }, [state.status]);

  const isConfirmed = confirmText === email;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setConfirmText("");
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1.5">
          <Trash2 className="size-3.5" />
          Delete account
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This will permanently delete your account and remove you from all
            organizations. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Blocked — sole owner of one or more orgs */}
          {state.status === "blocked" && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 space-y-1.5 text-sm">
              <p className="font-medium text-amber-700 dark:text-amber-400">
                You are the sole owner of:
              </p>
              <ul className="list-disc list-inside text-amber-700 dark:text-amber-400 space-y-0.5">
                {state.orgs.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
              <p className="text-muted-foreground">
                Please{" "}
                <Link
                  href="/dashboard"
                  className="underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  delete or transfer ownership
                </Link>{" "}
                of these organizations before deleting your account.
              </p>
            </div>
          )}

          {state.status === "error" && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          {state.status !== "blocked" && (
            <>
              <Label htmlFor="confirm-email">
                Type <span className="font-semibold text-foreground">{email}</span> to confirm
              </Label>
              <Input
                id="confirm-email"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={email}
                disabled={isPending}
              />
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>

          {state.status !== "blocked" && (
            <form action={action}>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={!isConfirmed || isPending}
                className="gap-1.5"
              >
                {isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                {isPending ? "Deleting…" : "Delete my account"}
              </Button>
            </form>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
