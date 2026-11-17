import type { ContentPage } from "@/lib/types";

export const contentPages: ContentPage[] = [
  {
    slug: "guide",
    title: "Guide",
    description: "Draft guide to this demonstration shop: samples, size, care, and unfinished policies.",
    kicker: "Draft",
    paragraphs: [
      "This guide explains how to read the demonstration shop. Every product page is a sample. Names, materials, prices, and drawings are placeholders, not a merchant catalog.",
      "Checkout does not capture a payment. PayPal sandbox credentials are not configured, and sample SKUs are blocked from genuine capture even if credentials are added later.",
    ],
    sections: [
      {
        heading: "Pages in this guide",
        paragraphs: [
          "Size is a draft method for measuring a wrist. Care is a draft note for cord, beads, and small objects. Cultural notes give general background without telling you what an object will do. Shipping and returns are unfinished on purpose.",
        ],
      },
    ],
  },
  {
    slug: "size",
    title: "Size guide",
    description: "Draft method for measuring a wrist against the illustrative bracelet ranges.",
    kicker: "Draft",
    paragraphs: [
      "These ranges belong to the sample drawings. They are not a fit guarantee, and no physical bracelet was measured for this page.",
    ],
    sections: [
      {
        heading: "Paper-strip method",
        paragraphs: [
          "Wrap a strip of paper snugly around the wrist where a bracelet would sit. Mark the overlap, lay the strip flat, and measure the length in centimeters.",
          "The cord samples are drawn as sliding knots with a concept range of about 14–20 cm. The beaded samples are drawn around 15.5–16 cm and do not include a sliding knot. If a measured wrist is outside a range, the sample is simply not a match. There is no physical size to exchange.",
        ],
      },
      {
        heading: "What the drawings cannot tell you",
        paragraphs: [
          "Line weight in an SVG is not bead diameter. Do not infer millimeters from the picture. A future production sample would need its own spec sheet.",
        ],
      },
    ],
  },
  {
    slug: "care",
    title: "Care notes",
    description: "Draft care notes for the sample bracelet and object concepts.",
    kicker: "Draft",
    paragraphs: [
      "These notes describe ordinary care for the kinds of materials named in the samples. They are not a warranty. No physical product is attached to this demo.",
    ],
    sections: [
      {
        heading: "Cord",
        paragraphs: [
          "A cotton cord stains and weakens when it stays wet. In a physical version, take it off for washing, swimming, and perfume. Let it dry flat if it is caught in rain.",
        ],
      },
      {
        heading: "Beads",
        paragraphs: [
          "Glass beads can chip if they hit a hard floor. Elastic loses stretch. Keep a beaded strand away from solvents. The seed-bead drawing would be more likely to snag on open knits.",
        ],
      },
      {
        heading: "Small objects",
        paragraphs: [
          "The vessel and stands are drawn as shelf objects. A physical piece would need a level, dry surface away from the edge of a table. They are not shown as containers for liquid.",
        ],
      },
    ],
  },
  {
    slug: "cultural-notes",
    title: "Cultural notes",
    description: "Draft background on cord and bead accessories, without outcome claims.",
    kicker: "Draft",
    paragraphs: [
      "Red cords and strands of beads show up in everyday accessories and gifts in several East Asian traditions, and in other places as well. People wear them because they like the color, the fit, or the person who gave the piece.",
      "This page is general background for visitors to a demonstration shop. It is not a ritual instruction, not a religious authorization, and not a statement that an object changes a life.",
    ],
    sections: [
      {
        heading: "What this shop will not say",
        paragraphs: [
          "Product pages do not assign a power to a color, a knot, or a shelf position. Placement notes are limited to ordinary handling: fit, dryness, and keeping a small object where it will not fall.",
          "If you are making a medical, legal, or financial decision, talk with a licensed professional. An accessory is not part of that advice.",
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "Questions",
    description: "Draft answers about this sample shop, prices, and checkout.",
    kicker: "Draft",
    paragraphs: [
      "These answers describe the demonstration as it is built today. They are not a service policy.",
    ],
    sections: [
      {
        heading: "Are the products for sale?",
        paragraphs: [
          "No. Titles, materials, prices, and pictures are samples. The PayPal button is disabled because sandbox API credentials are not configured, and the catalog is also blocked from genuine capture.",
        ],
      },
      {
        heading: "Why are prices in US dollars?",
        paragraphs: [
          "The demo is an English-language shop with illustrative USD amounts. Those amounts are not a quote, a cost, or an offer to sell.",
        ],
      },
      {
        heading: "Can I pay with a card form on this site?",
        paragraphs: [
          "No. There is no card form. The only payment handoff designed here is PayPal, and it stays disabled until sandbox credentials exist and real SKUs replace the samples.",
        ],
      },
      {
        heading: "Where do I ask a shop question?",
        paragraphs: [
          "Use the customer-support address shown on this page and in the footer. It is a temporary public address for shop questions. Phone, street address, domain, and legal entity remain TODO.",
        ],
      },
      {
        heading: "What does the mock button do?",
        paragraphs: [
          "It writes a record marked MOCK so the return page can be previewed. It does not contact PayPal and it cannot mark an order paid.",
        ],
      },
    ],
  },
  {
    slug: "shipping-returns",
    title: "Shipping and returns",
    description: "Unfinished shipping and return notes. Nothing here is a delivery or refund promise.",
    kicker: "TODO",
    paragraphs: [
      "TODO. This demonstration store does not ship orders and does not accept returns. A carrier, origin address, delivery window, shipping price, return window, and return address have not been set.",
      "Do not send anything to anyone because of this page. Nothing here promises delivery, a replacement, or a refund.",
    ],
    sections: [
      {
        heading: "Shipping — draft / TODO",
        paragraphs: [
          "No origin country is confirmed for a future merchant. No rate card is connected. Checkout shows the sample item total only and labels shipping as not calculated.",
        ],
      },
      {
        heading: "Returns — draft / TODO",
        paragraphs: [
          "No return window is offered. No refund method is offered. Captured payment does not happen for demo items, and this software does not send refunds or payouts on its own.",
        ],
      },
    ],
  },
];

export function getContentPage(slug: string): ContentPage | undefined {
  return contentPages.find((page) => page.slug === slug);
}

export function getContentPages(): ContentPage[] {
  return contentPages;
}
