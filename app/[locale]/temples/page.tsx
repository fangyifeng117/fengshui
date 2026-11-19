import { PlacesIndex } from "@/components/PlacesIndex";
import { copy } from "@/lib/i18n/messages";
import { asLocale } from "@/lib/locale";
import { getPlace } from "@/lib/places";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({
    title: text.places.title,
    description: text.places.lede,
    path: "/temples",
    locale,
  });
}

export default async function TemplesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ place?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const selected = getPlace(query.place ?? "")?.slug;
  return <PlacesIndex locale={asLocale(locale)} selected={selected} />;
}
