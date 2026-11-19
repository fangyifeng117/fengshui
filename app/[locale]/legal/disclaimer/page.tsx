import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    title: "Disclaimer",
    description: "Draft disclaimer for this demonstration shop.",
    path: "/legal/disclaimer",
    locale,
  });
}

export default function DisclaimerPage() {
  return (
    <article className="page prose-page">
      <p className="kicker">Draft</p>
      <h1>Disclaimer</h1>
      <p>
        The paragraph below is the disclaimer for this demonstration. A lawyer has not reviewed it for a live merchant,
        and the legal entity behind a future shop is still TODO.
      </p>
      <ExactDisclaimer />
    </article>
  );
}
