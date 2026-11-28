import Link from "next/link";
import { AbstractMark } from "@/components/AbstractMark";
import { copy } from "@/lib/i18n/messages";
import { asLocale, hrefFor } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({ title: text.videos.title, description: text.videos.lede, path: "/videos", locale });
}

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const text = copy(locale);
  return (
    <div className="page narrow">
      <header className="section-head">
        <p>{text.demo}</p>
        <h1>{text.videos.title}</h1>
        <p>{text.videos.lede}</p>
        <p>{text.comingSoon}</p>
      </header>
      <AbstractMark label={text.demo} />
      <p>
        <Link href={hrefFor(locale, "/blessing/short-video")}>{text.blessing.title}</Link>
      </p>
    </div>
  );
}
