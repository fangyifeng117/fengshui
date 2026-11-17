import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms",
  description: "Draft terms. Sample prices are not offers to sell.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <article className="page prose-page">
      <p className="kicker">Draft / TODO</p>
      <h1>Terms</h1>
      <p>
        TODO. These terms are a placeholder, not a completed merchant contract. Sample prices are not offers to sell.
        Checkout capture is disabled for demo items. Shipping and returns are unfinished and promise nothing.
      </p>
      <p>
        A future operator would need a confirmed legal name, a contact method, and reviewed terms before accepting a
        payment. Nothing on this site creates that contract.
      </p>
      <ExactDisclaimer />
    </article>
  );
}
