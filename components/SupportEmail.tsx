import { publicConfig } from "@/lib/public-config";

export function SupportEmail() {
  const email = publicConfig.supportEmail;
  return <a href={`mailto:${email}`}>{email}</a>;
}
