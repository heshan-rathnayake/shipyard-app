import { redirect } from "next/navigation";

export default async function OrgSettingsRootPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  redirect(`/${orgSlug}/org-settings/general`);
}
