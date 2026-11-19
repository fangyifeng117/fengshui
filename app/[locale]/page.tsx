import { HomeScreen } from "@/components/HomeScreen";
import { copy } from "@/lib/i18n/messages";
import { asLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({
    title: `${text.home.title} — Demo`,
    description: text.announcement,
    path: "/",
    locale,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HomeScreen locale={asLocale(locale)} />;
}
