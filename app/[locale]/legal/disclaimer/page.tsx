import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { MerchantIdentity } from "@/components/MerchantIdentity";
import { ZH_EXACT_DISCLAIMER } from "@/lib/disclaimer";
import { asLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const active = asLocale(locale);
  return pageMetadata({
    title: active === "zh" ? "免责声明" : "Disclaimer",
    description:
      active === "zh" ? "固定英文免责声明，并附中文译文。这不是律师审定稿。" : "The fixed English disclaimer, with the seller named. Not a lawyer's sign-off.",
    path: "/legal/disclaimer",
    locale,
  });
}

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  return (
    <article className="page prose-page">
      <p className="kicker">{locale === "zh" ? "商家草稿" : "Merchant draft"}</p>
      <h1>{locale === "zh" ? "免责声明" : "Disclaimer"}</h1>
      <p>
        {locale === "zh"
          ? "下面的英文段落按原文保留。这不是律师审定稿。经营者见本页。"
          : "The English paragraph below stays in its required wording. A lawyer has not signed this page. The seller is named here."}
      </p>
      <MerchantIdentity locale={locale} />
      <ExactDisclaimer translation={locale === "zh" ? ZH_EXACT_DISCLAIMER : undefined} />
    </article>
  );
}
