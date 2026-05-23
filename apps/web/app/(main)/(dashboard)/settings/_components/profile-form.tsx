"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shipyard/ui/components/avatar";
import { Button } from "@shipyard/ui/components/button";
import { Input } from "@shipyard/ui/components/input";
import { Label } from "@shipyard/ui/components/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { userInitials } from "@/lib/userInitials";
import { trpc } from "@/src/providers/trpc-react-provider";

interface ProfileFormProps {
  name: string | null;
  email: string | null;
  image: string | null;
  providers: string[];
}

export function ProfileForm({
  name,
  email,
  image,
  providers,
}: ProfileFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(name ?? "");

  const update = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const isDirty = displayName.trim() !== (name ?? "");
  const initials = userInitials(displayName || name || email || "?");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isDirty || !displayName.trim()) return;
    update.mutate({ name: displayName.trim() });
  }

  return (
    <div className="rounded-lg border bg-card p-5 space-y-5">
      {/* Avatar + identity */}
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          <AvatarImage src={image ?? undefined} alt={name ?? undefined} />
          <AvatarFallback className="text-base font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium truncate">{name ?? "No name set"}</p>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
          {providers.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Signed in with{" "}
              {providers
                .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                .join(", ")}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Display name */}
          <div className="space-y-1.5">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={update.isPending}
              maxLength={100}
              placeholder="Your name"
            />
          </div>

          {/* Email — read-only */}
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (cannot be changed)
              </span>
            </Label>
            <Input
              id="email"
              value={email ?? ""}
              readOnly
              disabled
              className="bg-muted text-muted-foreground"
            />
          </div>
        </div>

        {update.error && (
          <p className="text-sm text-destructive">{update.error.message}</p>
        )}

        {update.isSuccess && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Profile updated.
          </p>
        )}

        <Button
          type="submit"
          size="sm"
          disabled={!isDirty || !displayName.trim() || update.isPending}
        >
          {update.isPending ? (
            <Loader2 className="size-3.5 animate-spin mr-1.5" />
          ) : null}
          {update.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
