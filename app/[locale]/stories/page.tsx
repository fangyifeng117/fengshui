import { copy } from "@/lib/i18n/messages";
import { asLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({ title: text.stories.title, description: text.stories.lede, path: "/stories", locale });
}

export default async function StoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const text = copy(asLocale((await params).locale));
  return (
    <div className="page narrow">
      <header className="section-head">
        <p>{text.demo}</p>
        <h1>{text.stories.title}</h1>
        <p>{text.stories.lede}</p>
      </header>
    </div>
  );
}
