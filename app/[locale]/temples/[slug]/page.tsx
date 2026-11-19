import { notFound } from "next/navigation";
import { PlaceDetail } from "@/components/PlaceDetail";
import { asLocale } from "@/lib/locale";
import { getPlace } from "@/lib/places";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const place = getPlace(slug);
  const active = asLocale(locale);
  return pageMetadata({
    title: place ? place.name[active] : "Place",
    description: place ? `${place.region[active]}. Sources pending verification.` : "Unknown place.",
    path: `/temples/${slug}`,
    locale,
  });
}

export default async function TemplePlacePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();
  return <PlaceDetail locale={asLocale(locale)} place={place} />;
}
