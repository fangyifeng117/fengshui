import Link from "next/link";
import { SupportEmail } from "@/components/SupportEmail";
import { getCollections } from "@/lib/catalog";

export function Footer() {
  const collections = getCollections();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section>
          <h2>Shop</h2>
          <Link href="/products">All samples</Link>
          {collections.map((collection) => (
            <Link key={collection.slug} href={`/collections/${collection.slug}`}>
              {collection.title}
            </Link>
          ))}
          <Link href="/cart">Cart</Link>
          <Link href="/content/shipping-returns">Shipping and returns</Link>
        </section>
        <section>
          <h2>Legal</h2>
          <Link href="/legal/disclaimer">Disclaimer</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/content/cultural-notes">Cultural notes</Link>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            Customer support: <SupportEmail />
          </p>
          <p>Temporary public address for shop questions.</p>
          <p>Draft. Legal entity, phone number, street address, and domain are not confirmed.</p>
        </section>
      </div>
      <p className="footer-disclaimer">
        For decorative & cultural use only — no results guaranteed. <Link href="/legal/disclaimer">Full disclaimer.</Link>
      </p>
    </footer>
  );
}
