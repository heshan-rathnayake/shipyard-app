"use client";

import { Button } from "@shipyard/ui/components/button";
import { Input } from "@shipyard/ui/components/input";
import { Label } from "@shipyard/ui/components/label";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { type ResetPasswordState, resetPassword } from "./actions";

const initialState: ResetPasswordState = { status: "idle" };

interface ResetPasswordFormProps {
  token: string;
  email: string;
}

export function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const [state, action, isPending] = useActionState(
    resetPassword,
    initialState
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">
          Choose a new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter a new password for{" "}
          <span className="font-medium text-foreground">{email}</span>.
        </p>
      </div>

      <form action={action} className="space-y-4">
        {/* Hidden fields carry the token + email through the form submission */}
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="email" value={email} />

        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
            disabled={isPending}
          />
        </div>

        {state.status === "error" && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            {state.message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
          {isPending ? "Saving…" : "Set new password"}
        </Button>
      </form>
    </div>
  );
}
