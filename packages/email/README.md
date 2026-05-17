# @shipyard/email

Email templates and sending helper for Shipyard. Uses React Email for template authoring, Nodemailer in development (MailHog), and Resend in production.

## Sending an email

```ts
import { sendEmail, renderInviteEmail } from "@shipyard/email";

const html = await renderInviteEmail({
  inviteeName: "Alice",
  inviterName: "Bob",
  orgName: "Acme",
  inviteUrl: "https://app.example.com/invites/abc123",
});

await sendEmail({
  to: "alice@example.com",
  subject: "You've been invited to Acme",
  html,
  templateName: "invite",           // stored in EmailLog
  templateData: { orgName: "Acme" }, // stored in EmailLog
  db,                                // omit to skip EmailLog
});
```

## Templates

| Template file | Render function | When used |
|--------------|-----------------|-----------|
| `verify-email.tsx` | `renderVerifyEmail` | Email address verification |
| `invite.tsx` | `renderInviteEmail` | Organisation invitation |
| `task-assigned.tsx` | `renderTaskAssignedEmail` | Task assigned to a member |
| `comment-mention.tsx` | `renderCommentMentionEmail` | @mention in a task comment |
| `payment-failed.tsx` | `renderPaymentFailedEmail` | Stripe payment failure |
| `subscription.tsx` | `renderSubscriptionUpgradeEmail` | Plan upgraded |
| `subscription.tsx` | `renderSubscriptionCancelScheduledEmail` | Cancellation scheduled |
| `subscription.tsx` | `renderSubscriptionReactivatedEmail` | Cancellation reversed |
| `subscription.tsx` | `renderSubscriptionDowngradedEmail` | Plan downgraded |

## Transport

| Environment | Transport | Configuration |
|-------------|-----------|---------------|
| `development` | Nodemailer → MailHog | `EMAIL_HOST` (default: `localhost`), `EMAIL_PORT` (default: `1025`) |
| `production` | Resend | `RESEND_API_KEY` |

`EMAIL_FROM` sets the sender address in both environments (default: `noreply@shipyard.dev`).

## Previewing templates

Start the React Email dev server on port 3001:

```sh
yarn workspace @shipyard/email preview
```

## Environment variables

| Variable | Required in | Description |
|----------|-------------|-------------|
| `RESEND_API_KEY` | Production | Resend API key |
| `EMAIL_FROM` | Both | Sender address |
| `EMAIL_HOST` | Development | MailHog SMTP host |
| `EMAIL_PORT` | Development | MailHog SMTP port |
