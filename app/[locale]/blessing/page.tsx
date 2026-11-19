import { BlessingIndex } from "@/components/BlessingIndex";
import { copy } from "@/lib/i18n/messages";
import { asLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({
    title: text.blessing.title,
    description: text.blessing.lede,
    path: "/blessing",
    locale,
  });
}

export default async function BlessingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <BlessingIndex locale={asLocale(locale)} />;
}
