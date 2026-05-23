import {
  Button,
  Heading,
  Hr,
  render,
  Section,
  Text,
} from "@react-email/components";
import { EmailShell, styles } from "../components/email-shell";

export interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <EmailShell preview="Reset your Shipyard password">
      <Text style={styles.badgeWarn}>🔑 Password reset</Text>
      <Heading style={styles.heading}>Reset your password</Heading>
      <Text style={styles.body_text}>
        Hi {name}, we received a request to reset the password for your Shipyard
        account. Click the button below to choose a new password. This link
        expires in <strong>1 hour</strong>.
      </Text>
      <Section style={styles.ctaSection}>
        <Button href={resetUrl} style={styles.ctaButton}>
          Reset password →
        </Button>
      </Section>
      <Hr style={styles.divider} />
      <Text style={styles.note}>
        Or copy this link into your browser:
        <br />
        <a href={resetUrl} style={{ color: "#09090b", wordBreak: "break-all" }}>
          {resetUrl}
        </a>
      </Text>
      <Text style={{ ...styles.note, marginTop: "12px" }}>
        If you didn&apos;t request a password reset you can safely ignore this
        email — your password will not change.
      </Text>
    </EmailShell>
  );
}

ResetPasswordEmail.PreviewProps = {
  name: "Alex",
  resetUrl:
    "https://shipyard.dev/reset-password?token=abc123&email=alex%40example.com",
} satisfies ResetPasswordEmailProps;

export default ResetPasswordEmail;

export async function renderResetPasswordEmail(
  props: ResetPasswordEmailProps
): Promise<string> {
  return render(<ResetPasswordEmail {...props} />);
}
