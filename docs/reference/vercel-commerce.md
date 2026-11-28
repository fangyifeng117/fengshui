# Vercel Commerce reference

This note records a read-only look at `https://github.com/vercel/commerce`. The checkout is not in this repository and is not a dependency.

- Clone path, outside this repo: `/home/ubuntu/reference/vercel-commerce`
- Commit: `f7521d57d29f0eb3d23c1399cf9bb299d61fcd21`
- Subject: `docs(readme): add archive notice (#1541)`
- License: MIT, Copyright (c) 2025 Vercel, Inc. (`license.md`)
- No files, images, product copy, Shopify queries, or brand assets from that checkout are vendored here.

## Product page

`app/product/[handle]/page.tsx` is a server component. It loads one product through `lib/shopify`, returns 404 when missing, emits Product JSON-LD, and renders two columns: `components/product/gallery` and `components/product/product-description`. Related products are a separate server function using Shopify recommendations.

`ProductDescription` is a server component that shows the title, a price component, a variant selector, HTML description, and the client `AddToCart` form. `AddToCart` is a client component. It reads the selected variant from the URL, calls the server action `addItem`, and updates `CartContext` optimistically. The server action in `components/cart/actions.ts` calls Shopify `addToCart` and stores only a cart id cookie.

## Cart

There is no dedicated cart page in this checkout. The cart is a client modal, `components/cart/modal.tsx`, fed by `cart-context.tsx`. Quantity edits and removal are server actions. Totals in the optimistic context are derived on the client from Shopify line prices. That client-price path is not used here. This shop keeps the catalog price on the server.

## Spec sections 3 and 5

`AGENTS.md`, `TEMPLE-STORE-SPEC.md`, `skills/nextjs-store-builder.md`, and `skills/bilingual-i18n.md` are not in this repository, its parent directories, or the owner's GitHub repositories. Sections 3 and 5 therefore have no source text to implement. The existing ten product modules and the EN/ZH routes were not rebuilt from this reference.
