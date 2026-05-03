"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/src/trpc/react";
import { Button } from "@shipyard/ui/components/button";
import { Input } from "@shipyard/ui/components/input";
import { Label } from "@shipyard/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shipyard/ui/components/dialog";

function toSlugPreview(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CreateOrgDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const createOrg = trpc.organization.create.useMutation({
    onSuccess: () => {
      // Refresh server component data after creating org
      router.refresh();
      setIsOpen(false);
      setName("");
    },
  });

  const slugPreview = toSlugPreview(name);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">New Organization</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Organizations group your projects and team members.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="org-name">Name</Label>
            <Input
              id="org-name"
              placeholder="Acme Inc"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim().length >= 2) {
                  createOrg.mutate({ name: name.trim() });
                }
              }}
              autoFocus
            />
            {slugPreview && (
              <p className="text-xs text-muted-foreground">
                URL: <span className="font-mono">/{slugPreview}</span>
              </p>
            )}
          </div>

          {createOrg.error && (
            <p className="text-sm text-destructive">
              {createOrg.error.message}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={name.trim().length < 2 || createOrg.isPending}
            onClick={() => createOrg.mutate({ name: name.trim() })}
          >
            {createOrg.isPending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
