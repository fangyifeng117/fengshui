import { copy } from "@/lib/i18n/messages";
import { asLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({ title: text.account.title, description: text.account.lede, path: "/account", locale });
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const text = copy(asLocale((await params).locale));
  return (
    <div className="page narrow">
      <header className="section-head">
        <p>{text.demo}</p>
        <h1>{text.account.title}</h1>
        <p>{text.account.lede}</p>
      </header>
    </div>
  );
}
