export type ProductImage = {
  src: string;
  webp?: string;
  alt: string;
  width?: number;
  height?: number;
};

export type ProductSeo = {
  title: string;
  description: string;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: "USD";
  images: ProductImage[];
  collection: string;
  seo: ProductSeo;
  sample: boolean;
  captureAllowed: boolean;
  /** When true, the public shop may show this photo, price, and quantity. Payment stays closed. */
  publicListing?: boolean;
  illustrativeQuantity: number;
  materials: string[];
  specs: { label: string; value: string }[];
  benefits: string[];
  useNotes: string[];
  faq: ProductFaq[];
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  seo: ProductSeo;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type StoredLine = {
  productId: string;
  slug: string;
  title: string;
  quantity: number;
  unitAmountCents: number;
  currency: "USD";
  sample: boolean;
  captureAllowed: boolean;
};

export type OrderStatus =
  | "creating"
  | "paypal_created"
  | "approved"
  | "pending"
  | "paid"
  | "denied"
  | "cancelled"
  | "refunded"
  | "demo_blocked"
  | "sandbox_not_connected"
  | "mock_demonstration"
  | "inventory_rejected";

export type OrderKind = "paypal" | "mock";

export type OrderMode = "sandbox" | "live" | "mock" | "unconfigured";

export type StoredOrder = {
  id: string;
  cartId: string | null;
  cartVersion: number;
  kind: OrderKind;
  status: OrderStatus;
  currency: "USD";
  amountCents: number;
  mode: OrderMode;
  paypalOrderId: string | null;
  createRequestId: string | null;
  captureRequestId: string | null;
  items: StoredLine[];
  inventoryDecremented: boolean;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContentPage = {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  paragraphs: string[];
  sections: { heading: string; paragraphs: string[] }[];
};
