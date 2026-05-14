"use client";

import { useState } from "react";
import {
  Zap,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2,
} from "lucide-react";
import { trpc } from "@/src/providers/trpc-react-provider";
import { Button } from "@shipyard/ui/components/button";
import { Badge } from "@shipyard/ui/components/badge";
import { Progress } from "@shipyard/ui/components/progress";
import { Separator } from "@shipyard/ui/components/separator";
import { StripeCheckoutDialog } from "@/src/components/stripe-checkout-dialog";
import { CancelPlanDialog } from "@/src/components/cancel-plan-dialog";
import type { SubscriptionTier } from "@shipyard/db/enum";
import { useRouter } from "next/navigation";

interface SubscriptionInfo {
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface PriceDetails {
  amount: number;
  currency: string;
  interval: string;
}

interface UsageStat {
  used: number;
  limit: number;
}

interface BillingCardProps {
  orgId: string;
  orgSlug: string;
  orgName: string;
  tier: SubscriptionTier;
  isOwner: boolean;
  subscription: SubscriptionInfo | null;
  priceDetails: PriceDetails | null;
  usage: {
    projects: UsageStat;
    members: UsageStat;
  };
}

function formatPrice(amount: number, currency: string, interval: string) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
  return `${formatted} / ${interval}`;
}

interface SubscriptionInfo {
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface UsageStat {
  used: number;
  limit: number;
}

interface BillingCardProps {
  orgId: string;
  orgSlug: string;
  orgName: string;
  tier: SubscriptionTier;
  isOwner: boolean;
  subscription: SubscriptionInfo | null;
  usage: {
    projects: UsageStat;
    members: UsageStat;
  };
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  ACTIVE: { label: "Active", variant: "default", icon: CheckCircle },
  TRIALING: { label: "Trial", variant: "secondary", icon: Clock },
  PAST_DUE: { label: "Past due", variant: "destructive", icon: AlertTriangle },
  CANCELED: { label: "Canceled", variant: "outline", icon: AlertTriangle },
  UNPAID: { label: "Unpaid", variant: "destructive", icon: AlertTriangle },
  INCOMPLETE: { label: "Incomplete", variant: "outline", icon: Clock },
};

const DEFAULT_STATUS_CONFIG: {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: React.ComponentType<{ className?: string }>;
} = { label: "Incomplete", variant: "outline", icon: Clock };

function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const isUnlimited = limit === Infinity;
  const pct = isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const isNearLimit = !isUnlimited && pct >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={
            isNearLimit ? "text-destructive font-medium" : "font-medium"
          }
        >
          {isUnlimited ? `${used} / ∞` : `${used} / ${limit}`}
        </span>
      </div>
      {!isUnlimited && (
        <Progress
          value={pct}
          className={isNearLimit ? "h-1.5 [&>div]:bg-destructive" : "h-1.5"}
        />
      )}
    </div>
  );
}

export function BillingCard({
  orgId,
  orgSlug,
  tier,
  isOwner,
  subscription,
  priceDetails,
  usage,
}: BillingCardProps) {
  const router = useRouter();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const isPro = tier === "PRO" || tier === "ENTERPRISE";
  const returnUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${orgSlug}/org-settings/billing`
      : `/${orgSlug}/org-settings/billing`;

  const utils = trpc.useUtils();

  const portal = trpc.subscription.createPortalSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  const reactivate = trpc.subscription.reactivate.useMutation({
    onSuccess: () => {
      utils.subscription.get.invalidate({ orgId });
      router.refresh();
    },
  });

  const statusCfg = subscription
    ? (STATUS_CONFIG[subscription.status] ?? DEFAULT_STATUS_CONFIG)
    : null;

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Current plan</h2>
          <p className="text-sm text-muted-foreground">
            Your organization&apos;s active subscription
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {tier === "ENTERPRISE"
                    ? "Enterprise"
                    : tier === "PRO"
                      ? "Pro"
                      : "Free"}
                </span>
                {isPro && statusCfg && (
                  <Badge variant={statusCfg.variant} className="gap-1 text-xs">
                    <statusCfg.icon className="size-3" />
                    {statusCfg.label}
                  </Badge>
                )}
                {!isPro && (
                  <Badge variant="secondary" className="text-xs">
                    Free tier
                  </Badge>
                )}
              </div>
              {isPro ? (
                <p className="text-sm text-muted-foreground">
                  {priceDetails
                    ? formatPrice(
                        priceDetails.amount,
                        priceDetails.currency,
                        priceDetails.interval,
                      )
                    : "Pro plan"}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">$0 / month</p>
              )}
            </div>

            {isPro ? (
              <Zap className="size-8 text-primary fill-primary opacity-80" />
            ) : (
              <CreditCard className="size-8 text-muted-foreground" />
            )}
          </div>

          {/* Subscription details for PRO */}
          {isPro && subscription && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">
                    {subscription.cancelAtPeriodEnd
                      ? "Cancels on"
                      : "Next billing date"}
                  </p>
                  <p className="font-medium">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" },
                    )}
                  </p>
                </div>
                {subscription.cancelAtPeriodEnd && (
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium text-amber-600">
                      Cancels at period end
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action buttons — owner only */}
          {isOwner && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {!isPro ? (
                  /* FREE → open embedded checkout */
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    <Zap className="size-3.5 fill-current" />
                    Upgrade to Pro
                  </Button>
                ) : (
                  <>
                    {subscription?.cancelAtPeriodEnd ? (
                      /* Reactivate */
                      <Button
                        size="sm"
                        className="gap-1.5"
                        disabled={reactivate.isPending}
                        onClick={() => reactivate.mutate({ orgId })}
                      >
                        {reactivate.isPending ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="size-3.5" />
                        )}
                        {reactivate.isPending
                          ? "Reactivating…"
                          : "Reactivate subscription"}
                      </Button>
                    ) : (
                      /* Cancel */
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-destructive hover:text-destructive"
                        onClick={() => setCancelOpen(true)}
                      >
                        Cancel plan
                      </Button>
                    )}

                    {/* Portal — payment methods / invoices only */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      disabled={portal.isPending}
                      onClick={() => portal.mutate({ orgId, returnUrl })}
                    >
                      {portal.isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <CreditCard className="size-3.5" />
                      )}
                      {portal.isPending ? "Opening…" : "Manage payment"}
                    </Button>
                  </>
                )}
              </div>

              {(reactivate.error ?? portal.error) && (
                <p className="text-sm text-destructive">
                  {reactivate.error?.message ?? portal.error?.message}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <Separator />

      {/* Usage */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Usage</h2>
          <p className="text-sm text-muted-foreground">
            Current usage against your plan limits
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5 space-y-4">
          <UsageMeter
            label="Active projects"
            used={usage.projects.used}
            limit={usage.projects.limit}
          />
          <Separator />
          <UsageMeter
            label="Team members"
            used={usage.members.used}
            limit={usage.members.limit}
          />
        </div>

        {!isPro && (
          <p className="text-xs text-muted-foreground">
            Upgrade to Pro to remove project limits and support larger teams.
          </p>
        )}
      </section>

      {/* Dialogs */}
      <StripeCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        orgId={orgId}
        orgSlug={orgSlug}
        onSuccess={() => {
          setCheckoutOpen(false);
          utils.subscription.get.invalidate({ orgId });
        }}
      />

      {subscription && (
        <CancelPlanDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          orgId={orgId}
          periodEnd={subscription.currentPeriodEnd}
          onSuccess={() => utils.subscription.get.invalidate({ orgId })}
        />
      )}
    </div>
  );
}
