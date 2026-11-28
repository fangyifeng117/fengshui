import Link from "next/link";
import { notFound } from "next/navigation";
import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { ShippingPolicy } from "@/components/ShippingPolicy";
import { SupportEmail } from "@/components/SupportEmail";
import { getContentPage } from "@/lib/content";
import { asLocale, hrefFor } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const page = getContentPage(slug);
  if (!page) {
    return pageMetadata({
      title: "Page not found",
      description: "That draft page is not in this demonstration.",
      path: `/content/${slug}`,
      locale,
    });
  }
  return pageMetadata({ title: page.title, description: page.description, path: `/content/${page.slug}`, locale });
}

export default async function ContentPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const page = getContentPage(slug);
  if (!page) notFound();
  if (slug === "shipping-returns") {
    return <ShippingPolicy locale={asLocale(locale)} />;
  }
  return (
    <article className="page prose-page">
      {locale === "zh" ? <p>以下正文是英文草稿。</p> : null}
      <p className="kicker">{page.kicker}</p>
      <h1>{page.title}</h1>
      {page.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {page.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      {page.slug === "guide" ? (
        <ul className="plain-list">
          <li>
            <Link href={hrefFor(locale, "/content/size")}>Size guide</Link>
          </li>
          <li>
            <Link href={hrefFor(locale, "/content/care")}>Care notes</Link>
          </li>
          <li>
            <Link href={hrefFor(locale, "/content/cultural-notes")}>Cultural notes</Link>
          </li>
          <li>
            <Link href={hrefFor(locale, "/content/faq")}>Questions</Link>
          </li>
          <li>
            <Link href={hrefFor(locale, "/content/shipping-returns")}>Shipping and returns</Link>
          </li>
        </ul>
      ) : null}
      {page.slug === "faq" || page.slug === "guide" ? (
        <p>
          Customer support: <SupportEmail />
        </p>
      ) : null}
      <ExactDisclaimer />
    </article>
  );
}
