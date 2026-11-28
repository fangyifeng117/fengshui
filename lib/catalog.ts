import type { Collection, Product } from "@/lib/types";

const sampleSpecs = (
  materials: string,
  size: string,
  closure: string,
): Product["specs"] => [
  { label: "Listing type", value: "Sample — not a merchant SKU" },
  { label: "Price type", value: "Illustrative USD amount" },
  { label: "Materials shown", value: materials },
  { label: "Size in the concept", value: size },
  { label: "Closure in the concept", value: closure },
  { label: "Photograph", value: "None. Original SVG illustration only." },
];

export const collections: Collection[] = [
  {
    slug: "cord-bracelets",
    title: "Cord bracelets",
    description:
      "Sample listings for adjustable cord bracelets. The drawings show a sliding knot and a single small bead. They are not photographs of stock.",
    seo: {
      title: "Cord bracelets",
      description:
        "Sample cord bracelet listings with illustrative USD prices and original drawings.",
    },
  },
  {
    slug: "beaded-bracelets",
    title: "Beaded bracelets",
    description:
      "Sample listings for beaded bracelets. Bead counts, colors, and elastic construction are illustrative details for the drawings.",
    seo: {
      title: "Beaded bracelets",
      description:
        "Sample beaded bracelet listings with illustrative USD prices and original drawings.",
    },
  },
  {
    slug: "decorative-objects",
    title: "Decorative objects",
    description:
      "Sample listings for small decorative objects meant for a shelf or desk. Placement notes cover ordinary stability and dryness only.",
    seo: {
      title: "Decorative objects",
      description:
        "Sample decorative object listings with illustrative USD prices and original drawings.",
    },
  },
];

const sharedFaq = (noun: string): Product["faq"] => [
  {
    question: "Is this a real item I can order?",
    answer: `No. This ${noun} is a sample listing. The name, materials, price, and picture are illustrative. It is not a merchant SKU, and payment capture is blocked.`,
  },
  {
    question: "Does this listing promise a personal outcome?",
    answer:
      "No. The description is limited to how the sample is drawn and how a physical piece would be handled in ordinary use. It is not advice and it does not promise any outcome.",
  },
  {
    question: "Why is there no product photo?",
    answer:
      "This listing does not show a product photo. The stored image is an original SVG illustration and is not rendered here. Home-page reference photos are not this item.",
  },
];

export const products: Product[] = [
  {
    id: "smp-red-cord",
    slug: "sample-red-cord-bracelet",
    title: "Sample Red Cord Bracelet",
    description:
      "A sample listing for an adjustable red cord bracelet. The picture is an original illustration of a cotton cord, a sliding knot, and one small dark bead. It is not a photograph and not a live offer.",
    price: 2800,
    currency: "USD",
    images: [
      {
        src: "/illustrations/red-cord.svg",
        alt: "Sample illustration of a red cord bracelet with a sliding knot and one dark bead",
      },
      {
        src: "/illustrations/red-cord-detail.svg",
        alt: "Sample detail illustration of the sliding knot on a red cord bracelet",
      },
    ],
    collection: "cord-bracelets",
    seo: {
      title: "Sample Red Cord Bracelet",
      description:
        "Sample listing for a red cord bracelet. Illustrative price 28.00 USD. Original drawing, not a live product.",
    },
    sample: true,
    captureAllowed: false,
    illustrativeQuantity: 12,
    materials: ["illustrated cotton cord", "illustrated alloy bead"],
    specs: sampleSpecs(
      "Illustrated cotton cord and a small alloy bead",
      "Sliding concept for about 14–20 cm wrists",
      "Sliding knot",
    ),
    benefits: [
      "Drawn as a close-fitting cord for everyday wear in the sample.",
      "The sliding knot is a practical way to loosen or tighten the fit.",
      "The red color is a design choice in the illustration.",
    ],
    useNotes: [
      "Measure a wrist with the draft size guide before comparing it with the 14–20 cm concept range.",
      "If a physical cord existed, it would need to stay dry and away from perfume.",
      "Nothing on this listing describes a ritual, a required placement, or a promised result.",
    ],
    faq: sharedFaq("red cord bracelet"),
  },
  {
    id: "smp-ink-cord",
    slug: "sample-ink-cord-bracelet",
    title: "Sample Ink Cord Bracelet",
    description:
      "A sample listing for a charcoal-colored cord bracelet with the same sliding-knot concept as the red cord. Price, materials, and the drawing are illustrative.",
    price: 3000,
    currency: "USD",
    images: [
      {
        src: "/illustrations/ink-cord.svg",
        alt: "Sample illustration of a charcoal cord bracelet with a small cinnabar bead",
      },
    ],
    collection: "cord-bracelets",
    seo: {
      title: "Sample Ink Cord Bracelet",
      description:
        "Sample listing for a charcoal cord bracelet. Illustrative price 30.00 USD. Not a live product.",
    },
    sample: true,
    captureAllowed: false,
    illustrativeQuantity: 12,
    materials: ["illustrated cotton cord", "illustrated glass bead"],
    specs: sampleSpecs(
      "Illustrated charcoal cotton cord and a small glass bead",
      "Sliding concept for about 14–20 cm wrists",
      "Sliding knot",
    ),
    benefits: [
      "Uses the same adjustable silhouette as the red cord sample, in a darker color.",
      "A single bead marks the front of the drawing so the knot stays to the side.",
      "The color story is charcoal with a small cinnabar accent.",
    ],
    useNotes: [
      "Compare the concept range with a measured wrist. The range is illustrative.",
      "Cord fibers in a future physical sample would snag on rough surfaces, so the drawing assumes gentle daily wear.",
      "This page does not assign a meaning or a result to the dark color.",
    ],
    faq: sharedFaq("ink cord bracelet"),
  },
  {
    id: "smp-beaded",
    slug: "sample-beaded-bracelet",
    title: "Sample Beaded Bracelet",
    description:
      "A sample listing for a beaded bracelet on elastic. The illustration shows mixed round beads in ivory, charcoal, and cinnabar. Bead size and count are drawn for the sample, not measured from stock.",
    price: 3600,
    currency: "USD",
    images: [
      {
        src: "/illustrations/beaded.svg",
        alt: "Sample illustration of a beaded bracelet with ivory, charcoal, and cinnabar beads",
      },
      {
        src: "/illustrations/beaded-detail.svg",
        alt: "Sample detail illustration of round beads in ivory, charcoal, and cinnabar",
      },
    ],
    collection: "beaded-bracelets",
    seo: {
      title: "Sample Beaded Bracelet",
      description:
        "Sample listing for a beaded bracelet. Illustrative price 36.00 USD. Original drawing, not a live product.",
    },
    sample: true,
    captureAllowed: false,
    illustrativeQuantity: 10,
    materials: ["illustrated glass beads", "illustrated elastic cord"],
    specs: sampleSpecs(
      "Illustrated glass beads on elastic",
      "Concept inner circumference about 16 cm",
      "Elastic, no clasp in the drawing",
    ),
    benefits: [
      "Drawn as a light strand that can sit alone or next to a cord sample.",
      "Round beads are sized in the drawing so the strand stays visually even.",
      "Elastic is shown as a simple on-and-off construction, not as a special function.",
    ],
    useNotes: [
      "A physical elastic bracelet can stretch out. This sample does not promise a fit.",
      "Keep the concept away from water in any future physical version; the care page is a draft.",
      "Bead colors are a palette choice. They are not instructions for a result.",
    ],
    faq: sharedFaq("beaded bracelet"),
  },
  {
    id: "smp-seed-bead",
    slug: "sample-seed-bead-bracelet",
    title: "Sample Seed Bead Bracelet",
    description:
      "A sample listing for a narrower seed-bead bracelet. The drawing uses small repeating beads and an illustrative price. No physical strand was measured for this page.",
    price: 3200,
    currency: "USD",
    images: [
      {
        src: "/illustrations/seed-bead.svg",
        alt: "Sample illustration of a narrow seed bead bracelet",
      },
    ],
    collection: "beaded-bracelets",
    seo: {
      title: "Sample Seed Bead Bracelet",
      description:
        "Sample listing for a seed bead bracelet. Illustrative price 32.00 USD. Not a live product.",
    },
    sample: true,
    captureAllowed: false,
    illustrativeQuantity: 10,
    materials: ["illustrated seed beads", "illustrated beading thread"],
    specs: sampleSpecs(
      "Illustrated small seed beads",
      "Concept inner circumference about 15.5 cm",
      "Tied thread in the concept",
    ),
    benefits: [
      "Narrower than the mixed-bead sample so the two drawings are easy to tell apart.",
      "The repeat pattern is a visual rhythm for the illustration.",
      "The listed price is a placeholder for the demo, not a cost-plus calculation.",
    ],
    useNotes: [
      "Seed beads in a physical piece would catch on knits and towels. The drawing assumes careful wear.",
      "Use the size guide's paper-strip method rather than guessing from the picture.",
      "No outcome is attached to the pattern.",
    ],
    faq: sharedFaq("seed bead bracelet"),
  },
  {
    id: "smp-object",
    slug: "sample-decorative-object",
    title: "Sample Decorative Object",
    description:
      "A sample listing for a small abstract desk object. The illustration shows a rounded vessel on a low foot, finished in ivory and cinnabar. It is a drawing for the demo, not a catalog photo.",
    price: 5400,
    currency: "USD",
    images: [
      {
        src: "/illustrations/object.svg",
        alt: "Sample illustration of a small abstract decorative vessel",
      },
      {
        src: "/illustrations/object-detail.svg",
        alt: "Sample detail illustration of the foot and rim of a decorative vessel",
      },
    ],
    collection: "decorative-objects",
    seo: {
      title: "Sample Decorative Object",
      description:
        "Sample listing for a small decorative object. Illustrative price 54.00 USD. Original drawing, not a live product.",
    },
    sample: true,
    captureAllowed: false,
    illustrativeQuantity: 8,
    materials: ["illustrated matte ceramic-style form"],
    specs: sampleSpecs(
      "Illustrated matte form; no clay body has been produced",
      "Concept height about 9 cm",
      "Not wearable — sits on a surface",
    ),
    benefits: [
      "Compact silhouette for a shelf or desk in the sample composition.",
      "The foot is drawn wide enough to read as stable in the picture.",
      "Ivory and cinnabar are the demo palette, used here as surface color only.",
    ],
    useNotes: [
      "If a physical object were made, it would belong on a flat, dry surface away from the edge.",
      "The drawing does not open, hold water, or store anything.",
      "Placement on this page is about not knocking it over. It is not a formula for any other result.",
    ],
    faq: sharedFaq("decorative object"),
  },
  {
    id: "smp-stands",
    slug: "sample-decorative-stands",
    title: "Sample Decorative Stands",
    description:
      "A sample listing for a pair of small stands. The illustration shows two low blocks of different heights. Materials and the price are placeholders.",
    price: 6200,
    currency: "USD",
    images: [
      {
        src: "/illustrations/stands.svg",
        alt: "Sample illustration of two low decorative stands",
      },
    ],
    collection: "decorative-objects",
    seo: {
      title: "Sample Decorative Stands",
      description:
        "Sample listing for a pair of decorative stands. Illustrative price 62.00 USD. Not a live product.",
    },
    sample: true,
    captureAllowed: false,
    illustrativeQuantity: 8,
    materials: ["illustrated wood-tone blocks"],
    specs: sampleSpecs(
      "Illustrated wood-tone blocks; no timber has been specified",
      "Concept heights about 3 cm and 5 cm",
      "Not wearable — sit on a surface",
    ),
    benefits: [
      "Two heights make a simple stepped arrangement in the drawing.",
      "The blocks are abstract props for displaying a small object in the sample scene.",
      "The pair is priced as one sample listing, not as a measured material cost.",
    ],
    useNotes: [
      "A physical block would need a level surface. This demo does not ship blocks.",
      "Do not treat the step shape as a map or a set of directions.",
      "Shipping weight is unknown because the object has not been manufactured.",
    ],
    faq: sharedFaq("pair of stands"),
  },
  {
    id: "babao-liuli",
    slug: "babao-liuli-bracelet",
    title: "Babao Liuli Bracelet",
    description:
      "A liuli bead bracelet. The photograph shows the beads, the fittings, the charm, and the hand holding them. The cultural meaning is a traditional good wish. It is a symbol and not a promised result.",
    price: 18800,
    currency: "USD",
    images: [
      {
        src: "/media/products/babao-liuli.jpg",
        webp: "/media/products/babao-liuli.webp",
        alt: "A hand holding a liuli bead bracelet with a charm and a paper tag",
        width: 1280,
        height: 1330,
      },
    ],
    collection: "beaded-bracelets",
    seo: {
      title: "Babao Liuli Bracelet",
      description: "Babao Liuli Bracelet in liuli. Ten on hand. USD 188. Payment is off.",
    },
    sample: true,
    captureAllowed: false,
    publicListing: true,
    illustrativeQuantity: 10,
    materials: ["liuli"],
    specs: [
      { label: "Listing type", value: "Shown photograph and price. Payment is off." },
      { label: "Material", value: "Liuli" },
      { label: "On hand", value: "10" },
      { label: "Size", value: "Not confirmed" },
      { label: "Craft", value: "Not confirmed" },
      { label: "Origin", value: "Not confirmed" },
      {
        label: "Photograph",
        value: "Authorized photograph. A paper tag covers part of one bead.",
      },
    ],
    benefits: [
      "The named material is liuli.",
      "The photograph keeps the real beads, colors, fittings, charm, and the hand.",
      "The cultural meaning is a traditional good wish. It is a symbol, not a promised result.",
    ],
    useNotes: [
      "Payment is off, so this page cannot start an order.",
      "When an order is accepted, this bracelet ships from Hangzhou with tracked shipping included worldwide. Dispatch is planned in 1–3 business days. Major regions are estimated at 7–15 business days after dispatch, longer for remote regions. That timing is an estimate. The recipient pays import duties. Unused pieces may be returned; the buyer pays return shipping unless the piece is defective or not as described.",
      "Size, craft, and origin are not confirmed.",
      "The paper tag stays in the photograph because it covers a bead. The covered part was not redrawn.",
    ],
    faq: [
      {
        question: "Can I order this bracelet?",
        answer:
          "No. The page shows the authorized photograph, USD 188, and 10 on hand. Payment is off, and there is no cart button.",
      },
      {
        question: "Does this listing promise a personal outcome?",
        answer:
          "No. The cultural meaning is a traditional good wish. It is a symbol and not a promised result.",
      },
      {
        question: "What does the photograph show?",
        answer:
          "The beads, fittings, charm, and the hand holding them. Account marks and the bottom caption were removed. The paper tag covers part of one bead, and that covered part was not redrawn.",
      },
    ],
  },
  {
    id: "goat-year-red-string",
    slug: "goat-year-red-string-coiled",
    title: "Year of the Goat Red String (Gold-and-Red Coil)",
    description:
      "A braided gold-and-red cord, coiled, with no pendant. The name Year of the Goat marks the year. It is a cultural and decorative cord. Each cord includes one arranged incense-offering process video. We carry that out as an errand. It is not an official temple service, a partnership, a consecration, or a registry promise, and it does not guarantee any outcome.",
    price: 3000,
    currency: "USD",
    images: [
      {
        src: "/media/products/goat-year-red-string-coiled-calligraphy.jpg",
        webp: "/media/products/goat-year-red-string-coiled-calligraphy.webp",
        alt: "A wrist wearing a gold-and-red coiled braided cord, with calligraphy in the background",
        width: 1125,
        height: 2000,
      },
      {
        src: "/media/products/goat-year-red-string-coiled-greenery.jpg",
        webp: "/media/products/goat-year-red-string-coiled-greenery.webp",
        alt: "A wrist wearing the same gold-and-red coiled braided cord, with greenery in the background",
        width: 1125,
        height: 2000,
      },
    ],
    collection: "cord-bracelets",
    seo: {
      title: "Year of the Goat Red String (Gold-and-Red Coil)",
      description:
        "Year of the Goat red string, gold-and-red coil, braided cord. USD 30. Quantity not confirmed. Payment is off.",
    },
    sample: true,
    captureAllowed: false,
    publicListing: true,
    quantityKnown: false,
    illustrativeQuantity: 0,
    materials: ["braided cord"],
    specs: [
      { label: "Listing type", value: "Shown photographs and price. Payment is off. Sample listing." },
      { label: "Material", value: "Braided cord" },
      { label: "Quantity", value: "Not confirmed" },
      { label: "Size", value: "Not confirmed" },
      { label: "Photograph", value: "Two authorized wrist photographs of the gold-and-red coil. No pendant." },
    ],
    benefits: [
      "The cord is braided in gold and red and coiled, with no pendant.",
      "The material named here is braided cord.",
      "The year in the name is a cultural mark. It is not a promise of any outcome.",
    ],
    useNotes: [
      "Payment is off, so this page cannot start an order.",
      "Shipping cost and timing for this cord are not confirmed. The shipping note for the Babao Liuli Bracelet does not cover this cord.",
      "Each cord includes one arranged incense-offering process video. We carry that out as an errand. It is not an official temple service, a partnership, a consecration, or a registry promise, and it does not guarantee any outcome.",
      "Size is not confirmed. There is no pendant.",
    ],
    faq: [
      {
        question: "Can I order this cord?",
        answer:
          "No. The price on this page is USD 30. Quantity is not confirmed. Payment is off, and there is no cart button.",
      },
      {
        question: "Does this listing promise a personal outcome?",
        answer:
          "No. The cord is cultural and decorative. The incense-offering video is an errand. It is not an official temple service, a partnership, a consecration, or a registry promise, and it does not guarantee any outcome.",
      },
      {
        question: "What do the photographs show?",
        answer:
          "The same gold-and-red coiled cord on a wrist, once with calligraphy in the background and once with greenery. There is no pendant.",
      },
    ],
  },
];

export function getCollections(): Collection[] {
  return collections;
}

export function getCollection(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCollection(slug: string): Product[] {
  return products.filter((product) => product.collection === slug);
}

export function collectionTitle(slug: string): string {
  return getCollection(slug)?.title ?? slug;
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const pool = products.filter((item) => {
    if (item.id === product.id) return false;
    if (product.publicListing !== true && item.publicListing === true) return false;
    return true;
  });
  const same = pool.filter((item) => item.collection === product.collection);
  const others = pool.filter((item) => item.collection !== product.collection);
  return [...same, ...others].slice(0, limit);
}

export function getFeaturedProducts(): Product[] {
  return ["smp-red-cord", "smp-beaded", "smp-object"]
    .map((id) => getProductById(id))
    .filter((product): product is Product => Boolean(product));
}

export function filterProducts(
  list: Product[],
  query: { collection?: string; q?: string; underDollars?: number },
): Product[] {
  const needle = query.q?.trim().toLowerCase();
  return list.filter((product) => {
    if (query.collection && product.collection !== query.collection) return false;
    if (needle) {
      const haystack = [product.title, product.description, product.materials.join(" ")]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    if (query.underDollars != null && Number.isFinite(query.underDollars) && query.underDollars > 0) {
      if (product.price > Math.round(query.underDollars * 100)) return false;
    }
    return true;
  });
}
