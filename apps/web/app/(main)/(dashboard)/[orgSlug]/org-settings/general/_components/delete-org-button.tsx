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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "@/src/providers/trpc-react-provider";

interface DeleteOrgButtonProps {
  orgId: string;
  orgName: string;
}

export function DeleteOrgButton({ orgId, orgName }: DeleteOrgButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const deleteOrg = trpc.organization.delete.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
  });

  const isConfirmed = confirmText === orgName;

  function handleDelete() {
    if (!isConfirmed) return;
    deleteOrg.mutate({ orgId });
  }

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
          Delete organization
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete organization</DialogTitle>
          <DialogDescription>
            This will permanently delete{" "}
            <strong className="text-foreground">{orgName}</strong> and all of
            its projects, tasks, members, and data. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Label htmlFor="confirm-name">
            Type{" "}
            <span className="font-semibold text-foreground">{orgName}</span> to
            confirm
          </Label>
          <Input
            id="confirm-name"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={orgName}
            disabled={deleteOrg.isPending}
          />

          {deleteOrg.error && (
            <p className="text-sm text-destructive">{deleteOrg.error.message}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={deleteOrg.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={!isConfirmed || deleteOrg.isPending}
            onClick={handleDelete}
            className="gap-1.5"
          >
            {deleteOrg.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
            {deleteOrg.isPending ? "Deleting…" : "Delete organization"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
