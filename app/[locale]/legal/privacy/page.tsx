import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { SupportEmail } from "@/components/SupportEmail";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    title: "Privacy",
    description: "Draft privacy note. This demo is not a finished privacy policy.",
    path: "/legal/privacy",
    locale,
  });
}

export default function PrivacyPage() {
  return (
    <article className="page prose-page">
      <p className="kicker">Draft / TODO</p>
      <h1>Privacy</h1>
      <p>
        TODO. This demonstration does not open accounts and does not take live payments. Do not submit personal
        information through this demo. No privacy contact and no data-protection officer have been appointed.
      </p>
      <p>
        Draft, awaiting confirmation: <SupportEmail /> is the temporary customer-support address for shop questions. It
        is not designated as a privacy contact or a DPO. Do not treat it as either role until a later notice confirms
        that appointment.
      </p>
      <p>
        If a production shop is launched, this page has to be replaced with a reviewed policy that names the actual
        payment processor, the order fields that are stored, and how long those records are kept. The current database
        is built to store order ids, line items, amounts, and payment status. It is not built to store card numbers.
        Webhook payloads are stored only after sensitive payer fields are removed.
      </p>
      <ExactDisclaimer />
    </article>
  );
}
