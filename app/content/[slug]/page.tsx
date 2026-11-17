import Link from "next/link";
import { notFound } from "next/navigation";
import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { getContentPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getContentPage(slug);
  if (!page) {
    return pageMetadata({
      title: "Page not found",
      description: "That draft page is not in this demonstration.",
      path: `/content/${slug}`,
    });
  }
  return pageMetadata({ title: page.title, description: page.description, path: `/content/${page.slug}` });
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getContentPage(slug);
  if (!page) notFound();
  return (
    <article className="page prose-page">
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
            <Link href="/content/size">Size guide</Link>
          </li>
          <li>
            <Link href="/content/care">Care notes</Link>
          </li>
          <li>
            <Link href="/content/cultural-notes">Cultural notes</Link>
          </li>
          <li>
            <Link href="/content/faq">Questions</Link>
          </li>
          <li>
            <Link href="/content/shipping-returns">Shipping and returns (TODO)</Link>
          </li>
        </ul>
      ) : null}
      <ExactDisclaimer />
    </article>
  );
}
