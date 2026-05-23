"use client";

import { Button } from "@shipyard/ui/components/button";
import { Input } from "@shipyard/ui/components/input";
import { Label } from "@shipyard/ui/components/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "@/src/providers/trpc-react-provider";

interface OrgNameFormProps {
  orgId: string;
  orgName: string;
  orgSlug: string;
  canEdit: boolean;
}

export function OrgNameForm({
  orgId,
  orgName,
  orgSlug,
  canEdit,
}: OrgNameFormProps) {
  const router = useRouter();
  const [name, setName] = useState(orgName);

  const update = trpc.organization.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const isDirty = name.trim() !== orgName;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isDirty || !canEdit) return;
    update.mutate({ orgId, name: name.trim() });
  }

  return (
    <div className="rounded-lg border bg-card p-5 space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Organization name */}
          <div className="space-y-1.5">
            <Label htmlFor="org-name">Organization name</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!canEdit || update.isPending}
              maxLength={50}
              placeholder="My organization"
            />
          </div>

          {/* Slug — read-only */}
          <div className="space-y-1.5">
            <Label htmlFor="org-slug">
              URL slug{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (cannot be changed)
              </span>
            </Label>
            <Input
              id="org-slug"
              value={orgSlug}
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
            Organization name updated.
          </p>
        )}

        {canEdit && (
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || update.isPending}
          >
            {update.isPending ? (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            ) : null}
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
        )}
      </form>
    </div>
  );
}
