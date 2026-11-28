import type { ContentPage } from "@/lib/types";

export const contentPages: ContentPage[] = [
  {
    slug: "guide",
    title: "Guide",
    description: "Draft guide to this demonstration shop: samples, size, care, and unfinished policies.",
    kicker: "Draft",
    paragraphs: [
      "This guide explains the shop. Sample listings are still samples. The Babao Liuli Bracelet page shows its photograph, USD 188, and 10 on hand. Payment is off.",
      "Creating or capturing an order is closed on the server.",
    ],
    sections: [
      {
        heading: "Pages in this guide",
        paragraphs: [
          "Size is a draft method for measuring a wrist. Care is a draft note for cord, beads, and small objects. Cultural notes give general background without telling you what an object will do. Shipping for the Babao Liuli Bracelet is on the shipping page. Other listings are not shipped.",
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
          "Payment is off, so nothing on this site can be ordered today. Sample listings stay samples. The Babao Liuli Bracelet shows a price and a count, and offering lamps are a merchant errand on display.",
        ],
      },
      {
        heading: "Why are prices in US dollars?",
        paragraphs: [
          "Listed amounts are in USD. Payment is off, so a listed amount is not a charge.",
        ],
      },
      {
        heading: "Can I pay with a card form on this site?",
        paragraphs: [
          "No. There is no card form, and payment is off.",
        ],
      },
      {
        heading: "Where do I ask a shop question?",
        paragraphs: [
          "Use the customer-service and privacy address shown on this page and in the footer. The seller, domain, and registered address are on the terms page. No phone number is published.",
        ],
      },
      {
        heading: "Can this preview mark an order paid?",
        paragraphs: [
          "No. Checkout does not start a payment, and a return URL is not proof of payment.",
        ],
      },
    ],
  },
  {
    slug: "shipping-returns",
    title: "Shipping and returns",
    description: "Free tracked shipping for the Babao Liuli Bracelet from Hangzhou. Payment is off.",
    kicker: "Merchant draft",
    paragraphs: [
      "This note covers the Babao Liuli Bracelet only. It ships from Hangzhou, China. Tracked shipping worldwide is free. Other listings are samples and are not shipped. Payment is off, so this page does not start an order.",
    ],
    sections: [
      {
        heading: "Dispatch and delivery",
        paragraphs: [
          "After an order is accepted, dispatch from Hangzhou is planned in 1–3 business days. Delivery to major regions is estimated at 7–15 business days after dispatch. Remote regions can take longer. These are estimates, not a guarantee. The recipient pays import duties and taxes.",
        ],
      },
      {
        heading: "Returns",
        paragraphs: [
          "Returns go to the registered address on the terms page. An unused bracelet may be returned. Unless it is defective or not as described, the buyer pays the return shipping. Statutory rights stay in place.",
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
