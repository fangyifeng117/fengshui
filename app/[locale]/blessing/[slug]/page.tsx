import { notFound } from "next/navigation";
import { BlessingDetail } from "@/components/BlessingDetail";
import { asLocale } from "@/lib/locale";
import { getServiceDraft } from "@/lib/places";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const service = getServiceDraft(slug);
  const active = asLocale(locale);
  return pageMetadata({
    title: service ? service.title[active] : "Blessing",
    description: service ? service.summary[active] : "Unknown draft.",
    path: `/blessing/${slug}`,
    locale,
  });
}

export default async function BlessingServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const service = getServiceDraft(slug);
  if (!service) notFound();
  return <BlessingDetail locale={asLocale(locale)} service={service} />;
}
