import type { Collection, Product } from "@/lib/types";
import type { Locale } from "@/lib/locale";

type ZhListing = {
  title: string;
  description: string;
  alts: string[];
  phrases: Record<string, string>;
  benefits: string[];
  useNotes: string[];
  noun: string;
  faq?: Product["faq"];
};

const sharedPhrases: Record<string, string> = {
  "Listing type": "列表类型",
  "Sample — not a merchant SKU": "样品，不是商家 SKU",
  "Price type": "价格类型",
  "Illustrative USD amount": "示意美元金额",
  "Materials shown": "图中材料",
  "Size in the concept": "设想中的尺寸",
  "Closure in the concept": "设想中的开合",
  Photograph: "照片",
  "None. Original SVG illustration only.": "没有。只有原创 SVG 图稿。",
};

const listings: Record<string, ZhListing> = {
  "smp-red-cord": {
    title: "样品红绳手串",
    description:
      "一条可调节红绳手串的样品列表。图片是原创图稿，画的是棉绳、滑动结和一颗深色小珠。不是照片，也不是在售商品。",
    alts: ["样品图稿：带滑动结和一颗深色珠的红绳手串", "样品细节图稿：红绳手串上的滑动结"],
    noun: "红绳手串",
    phrases: {
      "Illustrated cotton cord and a small alloy bead": "图中的棉绳和一颗合金小珠",
      "Sliding concept for about 14–20 cm wrists": "设想可滑动，大约适合 14–20 厘米的手腕",
      "Sliding knot": "滑动结",
    },
    benefits: [
      "样品画成可贴身日常佩戴的绳子。",
      "滑动结用来放松或收紧。",
      "红色是图稿里的设计选择。",
    ],
    useNotes: [
      "对照大约 14–20 厘米的设想之前，先量手腕。",
      "如果做成实物，需要保持干燥并远离香水。",
      "这个列表不描述仪式、规定摆放或承诺的结果。",
    ],
  },
  "smp-ink-cord": {
    title: "样品墨色绳编手串",
    description: "炭色绳编手串的样品列表，滑动结设想与红绳相同。价格、材料和图片都是示意。",
    alts: ["样品图稿：带一颗朱红珠的炭色绳编手串"],
    noun: "墨色绳编手串",
    phrases: {
      "Illustrated charcoal cotton cord and a small glass bead": "图中的炭色棉绳和一颗玻璃小珠",
      "Sliding concept for about 14–20 cm wrists": "设想可滑动，大约适合 14–20 厘米的手腕",
      "Sliding knot": "滑动结",
    },
    benefits: [
      "轮廓与红绳样品相同，颜色更深。",
      "一颗珠子标在图稿正面，结留在侧面。",
      "配色是炭色，加一小点朱红。",
    ],
    useNotes: [
      "把设想范围和量过的手腕对照。这个范围是示意。",
      "以后如果有实物绳子，纤维会挂到粗糙表面，图稿按温和的日常佩戴来画。",
      "这一页不给深色指定含义或结果。",
    ],
  },
  "smp-beaded": {
    title: "样品珠串手串",
    description:
      "弹力珠串的样品列表。图稿是象牙色、炭色和朱红的圆珠。珠子大小和数量按图绘制，不是从库存量出来的。",
    alts: ["样品图稿：象牙色、炭色和朱红圆珠组成的手串", "样品细节图稿：象牙色、炭色和朱红的圆珠"],
    noun: "珠串手串",
    phrases: {
      "Illustrated glass beads on elastic": "图中的玻璃珠，穿在松紧绳上",
      "Concept inner circumference about 16 cm": "设想内周长大约 16 厘米",
      "Elastic, no clasp in the drawing": "图稿里是松紧绳，没有扣",
    },
    benefits: [
      "画成可以单戴、也可以和绳编样品并排的轻细一串。",
      "圆珠在图里大小接近，整串看起来均匀。",
      "松紧绳只表示简单的戴上和取下，不是特殊功能。",
    ],
    useNotes: [
      "实物弹力手串会变松。这个样品不承诺合适。",
      "以后如果有实物，设想中要远离水。保养说明仍是草稿。",
      "珠色是配色选择，不是取得某种结果的指示。",
    ],
  },
  "smp-seed-bead": {
    title: "样品米珠手串",
    description: "更窄的米珠手串样品列表。图稿用重复的小珠，价格是示意。这一页没有测量过实物。",
    alts: ["样品图稿：细窄的米珠手串"],
    noun: "米珠手串",
    phrases: {
      "Illustrated small seed beads": "图中的小米珠",
      "Concept inner circumference about 15.5 cm": "设想内周长大约 15.5 厘米",
      "Tied thread in the concept": "设想中用线打结",
    },
    benefits: [
      "比混色珠串更窄，两张图容易分开。",
      "重复图案是图稿的视觉节奏。",
      "标出的价格是示范占位，不是按成本加成算出来的。",
    ],
    useNotes: [
      "实物米珠会挂到针织和毛巾。图稿按小心佩戴来画。",
      "用尺寸说明里的纸条方法，不要凭图片猜测。",
      "图案不附带任何结果。",
    ],
  },
  "smp-object": {
    title: "样品摆件",
    description: "小型抽象桌面器物的样品列表。图稿是矮足圆器，象牙色和朱红。这是示范图稿，不是目录照片。",
    alts: ["样品图稿：小型抽象装饰器", "样品细节图稿：装饰器的足和口沿"],
    noun: "摆件",
    phrases: {
      "Illustrated matte form; no clay body has been produced": "图中的哑光形体；没有制作过陶胎",
      "Concept height about 9 cm": "设想高度大约 9 厘米",
      "Not wearable — sits on a surface": "不能佩戴，放在平面上",
    },
    benefits: [
      "样品构图里，轮廓适合架子或桌面。",
      "足画得够宽，在图里看起来稳。",
      "象牙色和朱红是示范配色，这里只表示表面颜色。",
    ],
    useNotes: [
      "如果做成实物，应放在平整、干燥、离边缘远的地方。",
      "图稿不能打开，不盛水，也不存放东西。",
      "这一页的摆放只是为了不被碰倒，不是其他结果的方法。",
    ],
  },
  "smp-stands": {
    title: "样品摆件座",
    description: "一对小座的样品列表。图稿是两个不同高度的矮块。材料和价格都是占位。",
    alts: ["样品图稿：两个矮的装饰座"],
    noun: "这对座",
    phrases: {
      "Illustrated wood-tone blocks; no timber has been specified": "图中的木色块；没有指定木材",
      "Concept heights about 3 cm and 5 cm": "设想高度大约 3 厘米和 5 厘米",
      "Not wearable — sit on a surface": "不能佩戴，放在平面上",
    },
    benefits: [
      "两个高度在图里形成简单的台阶。",
      "这些块是抽象道具，用来在样品画面里托一个小器物。",
      "这一对按一条样品列表标价，不是按材料成本计算。",
    ],
    useNotes: [
      "实物块需要平整的表面。这个示范不发货这些块。",
      "不要把台阶形状当成地图或一组指示。",
      "因为没有制作过，运输重量未知。",
    ],
  },
  "babao-liuli": {
    title: "八宝琉璃手串",
    description:
      "琉璃珠手串。照片里是珠子、配件、吊坠和托着它的手。它承载祈福与招财的传统美好祝愿。这是文化象征，不是实际的财富结果。",
    alts: ["一只手托着琉璃珠手串，上面有吊坠和纸质吊牌"],
    noun: "琉璃手串",
    phrases: {
      "Shown photograph and price. Payment is off.": "展示照片和价格。支付已关闭。",
      Material: "材料",
      Liuli: "琉璃",
      "On hand": "库存",
      "10": "10 件",
      Size: "尺寸",
      Craft: "工艺",
      Origin: "产地",
      "Not confirmed": "待确认",
      "Authorized photograph. A paper tag covers part of one bead.":
        "已授权照片。纸质吊牌盖住一颗珠子的一部分。",
    },
    benefits: [
      "写明的材料是琉璃。",
      "照片保留真实的珠子、颜色、配件、吊坠和手。",
      "它承载祈福与招财的传统美好祝愿。这是文化象征，不是实际的财富结果。",
    ],
    useNotes: [
      "支付已关闭，所以这个页面不能下单。",
      "接受订单后，这串手串从杭州发出，全球配送含追踪且不另收费。计划 1–3 个工作日发出。主要地区预计发货后 7–15 个工作日，偏远地区可能更久。这是估计。进口关税由收件人承担。未使用的可以退，除非有缺陷或与描述不符，退货运费由买方承担。",
      "尺寸、工艺和产地都待确认。",
      "纸质吊牌留在照片里，因为它盖住一颗珠子。被挡住的部分没有重画。",
    ],
    faq: [
      {
        question: "这串手串可以下单吗？",
        answer: "不能。页面展示已授权的照片、USD 188 和库存 10 件。支付已关闭，也没有购物车按钮。",
      },
      {
        question: "这个列表承诺个人结果吗？",
        answer: "不承诺。它承载祈福与招财的传统美好祝愿。这是文化象征，不是实际的财富结果。",
      },
      {
        question: "这张照片是这件手串吗？",
        answer:
          "是。照片里是珠子、配件、吊坠和托着它的手。账号水印和底部宣传文字已去掉。纸质吊牌盖住一颗珠子的一部分，被挡住的珠面没有重画。",
      },
    ],
  },
  "goat-year-red-string": {
    title: "羊年红绳（金红缠绕）",
    description:
      "金红编织绳，缠绕，没有吊坠。羊年只标年份。它是文化与装饰用的绳子。每件包含一次代为安排的上香过程影像，由我们代请代办。这不是寺庙官方服务，不是合作，不是开光，也不是登记册承诺，并且不保证任何结果。",
    alts: [
      "手腕上的金红缠绕编织绳，背景是书法",
      "同一条金红缠绕编织绳戴在手腕上，背景是绿植",
    ],
    noun: "红绳",
    phrases: {
      "Shown photographs and price. Payment is off. Sample listing.": "展示照片和价格。支付已关闭。样品列表。",
      Material: "材料",
      "Braided cord": "编织红绳",
      Quantity: "数量",
      Size: "尺寸",
      "Not confirmed": "未确认",
      Photograph: "照片",
      "Two authorized wrist photographs of the gold-and-red coil. No pendant.":
        "两张已授权的手腕照片，都是金红缠绕。没有吊坠。",
    },
    benefits: [
      "绳子是金红编织并缠绕的，没有吊坠。",
      "这里写明的材料是编织红绳。",
      "名称里的年份是文化标记，不是任何结果的保证。",
    ],
    useNotes: [
      "支付已关闭，所以这个页面不能下单。",
      "这条红绳的运费和时效尚未确认。八宝琉璃手串的配送说明不适用于它。",
      "每件包含一次代为安排的上香过程影像，由我们代请代办。这不是寺庙官方服务，不是合作，不是开光，也不是登记册承诺，并且不保证任何结果。",
      "尺寸未确认。没有吊坠。",
    ],
    faq: [
      {
        question: "这条红绳可以下单吗？",
        answer: "不能。这个页面标价 USD 30。数量未确认。支付已关闭，也没有购物车按钮。",
      },
      {
        question: "这个列表承诺个人结果吗？",
        answer:
          "不承诺。这是文化与装饰用的绳子。上香过程影像是代请代办。这不是寺庙官方服务，不是合作，不是开光，也不是登记册承诺，并且不保证任何结果。",
      },
      {
        question: "这两张照片拍的是什么？",
        answer: "同一条金红缠绕的绳子戴在手腕上。一张背景是书法，一张背景是绿植。没有吊坠。",
      },
    ],
  },
};

const collectionsZh: Record<string, { title: string; description: string }> = {
  "cord-bracelets": {
    title: "绳编手串",
    description: "可调节绳编手串的样品列表。图稿里有滑动结和一颗小珠。它们不是库存照片。",
  },
  "beaded-bracelets": {
    title: "珠串手串",
    description: "珠串手串的样品列表。珠数、颜色和松紧结构都是图稿里的示意细节。",
  },
  "decorative-objects": {
    title: "摆件",
    description: "适合架子或桌面的小型摆件样品列表。摆放说明只涉及平常的稳定和干燥。",
  },
};

const questions = [
  "这是可以下单的真实商品吗？",
  "这个列表承诺个人结果吗？",
  "为什么没有商品照片？",
];

export const zhTrustBadges = ["样品图稿", "示意美元价格", "支付已关闭", "配送和退货仍是草稿"];

export function displayTitle(product: Product, locale: Locale): string {
  if (locale !== "zh") return product.title;
  return listings[product.id]?.title ?? product.title;
}

export function displayDescription(product: Product, locale: Locale): string {
  if (locale !== "zh") return product.description;
  return listings[product.id]?.description ?? product.description;
}

export function displayAlt(product: Product, index: number, locale: Locale): string {
  const image = product.images[index];
  if (locale !== "zh" || !image) return image?.alt ?? "";
  return listings[product.id]?.alts[index] ?? image.alt;
}

export function displayPhrase(text: string, product: Product, locale: Locale): string {
  if (locale !== "zh") return text;
  return listings[product.id]?.phrases[text] ?? sharedPhrases[text] ?? text;
}

export function displayBenefits(product: Product, locale: Locale): string[] {
  if (locale !== "zh") return product.benefits;
  return listings[product.id]?.benefits ?? product.benefits;
}

export function displayUseNotes(product: Product, locale: Locale): string[] {
  if (locale !== "zh") return product.useNotes;
  return listings[product.id]?.useNotes ?? product.useNotes;
}

export function displayFaq(product: Product, locale: Locale): Product["faq"] {
  if (locale !== "zh") return product.faq;
  const custom = listings[product.id]?.faq;
  if (custom) return custom;
  const noun = listings[product.id]?.noun;
  if (!noun) return product.faq;
  return [
    {
      question: questions[0] ?? "",
      answer: `不是。这个${noun}是样品列表。名称、材料、价格和图片都是示意。它不是商家 SKU，支付捕获已关闭。`,
    },
    {
      question: questions[1] ?? "",
      answer: "不是。说明只限于样品如何绘制，以及实物在日常使用中会怎样处理。它不是建议，也不承诺任何结果。",
    },
    {
      question: questions[2] ?? "",
      answer: "这个列表不展示商品照片。保存的图是原创 SVG 图稿，前台不渲染。首页的参考照片不是这件样品。",
    },
  ];
}

export function displayCollectionTitle(collection: Pick<Collection, "slug" | "title">, locale: Locale): string {
  if (locale !== "zh") return collection.title;
  return collectionsZh[collection.slug]?.title ?? collection.title;
}

export function displayCollectionDescription(collection: Collection, locale: Locale): string {
  if (locale !== "zh") return collection.description;
  return collectionsZh[collection.slug]?.description ?? collection.description;
}

export function zhCatalogCovers(productIds: string[], collectionSlugs: string[]): boolean {
  return productIds.every((id) => Boolean(listings[id])) && collectionSlugs.every((slug) => Boolean(collectionsZh[slug]));
}
