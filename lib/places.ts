export type Place = {
  slug: string;
  name: { en: string; zh: string };
  region: { en: string; zh: string };
  theme: { en: string; zh: string };
  regionPending: boolean;
  productIds: string[];
};

export const places: Place[] = [
  {
    slug: "wutai",
    name: { en: "Wutai Mountain", zh: "五台山" },
    region: { en: "Xinzhou, Shanxi", zh: "山西忻州" },
    theme: { en: "Manjushri, wisdom", zh: "文殊智慧" },
    regionPending: false,
    productIds: ["smp-red-cord"],
  },
  {
    slug: "emei",
    name: { en: "Emei Mountain", zh: "峨眉山" },
    region: { en: "Leshan, Sichuan", zh: "四川乐山" },
    theme: { en: "Samantabhadra, practice", zh: "普贤行愿" },
    regionPending: false,
    productIds: ["smp-beaded"],
  },
  {
    slug: "putuo",
    name: { en: "Putuo Mountain", zh: "普陀山" },
    region: { en: "Zhoushan, Zhejiang", zh: "浙江舟山" },
    theme: { en: "Guanyin, compassion", zh: "观音慈悲" },
    regionPending: false,
    productIds: ["smp-seed-bead"],
  },
  {
    slug: "jiuhua",
    name: { en: "Jiuhua Mountain", zh: "九华山" },
    region: { en: "Chizhou, Anhui", zh: "安徽池州" },
    theme: { en: "Ksitigarbha, the great vow", zh: "地藏大愿" },
    regionPending: false,
    productIds: ["smp-object"],
  },
  {
    slug: "xuedou",
    name: { en: "Xuedou Mountain", zh: "雪窦山" },
    region: { en: "Pending verification", zh: "地域待核实" },
    theme: { en: "Maitreya, joy", zh: "弥勒欢喜" },
    regionPending: true,
    productIds: ["smp-ink-cord"],
  },
];

export function getPlace(slug: string): Place | undefined {
  return places.find((place) => place.slug === slug);
}

export type ServiceImage = {
  src: string;
  webp: string;
  width: number;
  height: number;
  alt: { en: string; zh: string };
};

export type ServiceOffer = {
  id: string;
  label: { en: string; zh: string };
  detail: { en: string; zh: string };
};

export type ServiceDraft = {
  slug: string;
  title: { en: string; zh: string };
  summary: { en: string; zh: string };
  status?: { en: string; zh: string };
  offers?: ServiceOffer[];
  images?: ServiceImage[];
  gaps?: { en: string; zh: string }[];
  scope?: { en: string; zh: string };
  rules?: { en: string; zh: string }[];
  faq?: { question: { en: string; zh: string }; answer: { en: string; zh: string } }[];
  supplementZh?: string;
};

export const serviceDrafts: ServiceDraft[] = [
  {
    slug: "offering-lamps",
    title: { en: "A Temple Lamp Offering, Requested on Your Behalf", zh: "寺庙供灯代请服务" },
    summary: {
      en: "We request the lamp, go to the venue, and record the visit. We are a merchant errand, not a temple and not a religious organization, and we do not perform religious ceremonies. This is not an official temple service and not a partnership. No result is promised. This page is a proposed display. Booking and payment are not open. It cannot be purchased now.",
      zh: "我们代为申请、到场，并记录这一趟。我们只是跑腿人，不是寺庙，也不是宗教组织，不代表对方主持仪式。这不是寺庙官方服务，也不是合作关系，并且不承诺任何结果。本页是拟定展示。预约和支付未开放，现在不能购买。",
    },
    status: {
      en: "Proposed display. Booking and payment are not open.",
      zh: "拟定展示。预约和支付未开放。",
    },
    offers: [
      {
        id: "day",
        label: { en: "Proposed: 1-day lamp, USD 29", zh: "拟定：一天灯，USD 29" },
        detail: {
          en: "Suggested price. Proposed only, and not for sale.",
          zh: "建议价格。只是拟定，现在不能购买。",
        },
      },
      {
        id: "week",
        label: { en: "Proposed: 7-day lamp, USD 49", zh: "拟定：七天灯，USD 49" },
        detail: {
          en: "Suggested price. Proposed only, and not for sale.",
          zh: "建议价格。只是拟定，现在不能购买。",
        },
      },
      {
        id: "forty-nine",
        label: { en: "Proposed: 49-day lamp, USD 99", zh: "拟定：四十九天灯，USD 99" },
        detail: {
          en: "Suggested price. Proposed only, and not for sale.",
          zh: "建议价格。只是拟定，现在不能购买。",
        },
      },
      {
        id: "annual",
        label: { en: "Proposed: annual lamp, USD 199", zh: "拟定：常年灯，USD 199" },
        detail: {
          en: "Suggested price. This is not a subscription, and it does not renew by itself.",
          zh: "建议价格。这不是订阅，也不会自动续费。",
        },
      },
    ],
    images: [
      {
        src: "/media/offering-lamps/lotus-pair.jpg",
        webp: "/media/offering-lamps/lotus-pair.webp",
        width: 1080,
        height: 500,
        alt: {
          en: "Two pink and gold lotus-shaped lamps, cropped close",
          zh: "两盏粉金莲花灯的近景",
        },
      },
      {
        src: "/media/offering-lamps/lotus-stands.jpg",
        webp: "/media/offering-lamps/lotus-stands.webp",
        width: 1600,
        height: 624,
        alt: {
          en: "Yellow lotus lamp stands on a wooden table",
          zh: "木桌上的黄色莲花灯",
        },
      },
      {
        src: "/media/offering-lamps/red-candles.jpg",
        webp: "/media/offering-lamps/red-candles.webp",
        width: 430,
        height: 630,
        alt: {
          en: "Two red lamp candles with a small flame-shaped light at each top",
          zh: "两盏红色灯烛，顶部各有一个火焰形状的小灯",
        },
      },
      {
        src: "/media/offering-lamps/altar-row.jpg",
        webp: "/media/offering-lamps/altar-row.webp",
        width: 1130,
        height: 260,
        alt: {
          en: "A row of small lamps and lotus-shaped lights on a stone ledge",
          zh: "石台上的一排小灯和莲花灯",
        },
      },
    ],
    scope: {
      en: "The customer would choose one venue in Hangzhou, either 天下第一财神庙 or 灵隐寺, not both. Each amount above is a suggested price. It is intended to cover an errand fee, a temple offering fee, and documentation, and those components are not confirmed. None of these periods is a subscription, and none renews by itself. We do not promise that a wish will come true.",
      zh: "顾客会在杭州的天下第一财神庙和灵隐寺中选择一处，不是两处都做。上面每个金额都是建议价格，打算用于跑腿费、寺庙供灯费用和记录，但这几项尚未分开确认。这些档期都不是订阅，也不会自动续费。我们不承诺愿望会实现。",
    },
    rules: [
      {
        en: "Refund wording on this page is a draft, not a current policy. A venue rule about non-refund is not adopted here. Statutory rights stay in place. Payment is off, so this page cannot start a purchase or a refund.",
        zh: "这里的退款文字只是草稿，不是现行政策。本页不采用场所的不退规则。法定权利仍然保留。支付已关闭，所以这个页面不能发起购买或退款。",
      },
    ],
    gaps: [
      {
        en: "Permission to film is not confirmed. A recording, if one is ever made, has no promised delivery time, and this page does not say whether it would be reused.",
        zh: "拍摄许可尚未确认。即使以后记录到访，也没有承诺交付时间，本页也不说明影像会不会被再次使用。",
      },
      {
        en: "The start date is not confirmed.",
        zh: "开始日期尚未确认。",
      },
      {
        en: "What happens on a closure day is not confirmed.",
        zh: "遇到关闭日怎么办，尚未确认。",
      },
    ],
    faq: [
      {
        question: { en: "Are you a temple?", zh: "你们是寺庙吗？" },
        answer: {
          en: "No. We are a merchant errand. We do not represent a temple, and we do not perform a religious ceremony.",
          zh: "不是。我们是商家代办。我们不代表寺庙，也不主持宗教仪式。",
        },
      },
      {
        question: { en: "Do you collect a wish?", zh: "现在收集愿望吗？" },
        answer: {
          en: "No. This page does not collect a name, an email, or a religious wish.",
          zh: "不收集。这个页面不收集姓名、邮箱或宗教祈愿。",
        },
      },
      {
        question: { en: "When would a visit be documented?", zh: "记录和日期确定了吗？" },
        answer: {
          en: "Documentation and timing are not confirmed.",
          zh: "记录方式和时间都尚未确认。",
        },
      },
      {
        question: { en: "Can I purchase a lamp period?", zh: "现在能购买吗？" },
        answer: {
          en: "No. Booking and payment are not open. We do not promise that a wish will come true.",
          zh: "不能。预约和支付未开放。我们不承诺愿望会实现。",
        },
      },
    ],
    supplementZh:
      "补充说明：上面的英文声明保持原文。标出的价格只是拟定建议，并不表示费用已经按公布标准代收或交付。我们不承诺愿望会实现。",
  },
  {
    slug: "wish-card",
    title: { en: "Wish card", zh: "愿卡" },
    summary: {
      en: "A future cultural note. Not for sale in this demo.",
      zh: "以后可能做的文化记录。这个示范里不能买。",
    },
  },
  {
    slug: "short-video",
    title: { en: "Short video", zh: "短片" },
    summary: {
      en: "A future one-to-two minute note. No footage is available, and nothing can be downloaded.",
      zh: "以后可能做的一两分钟记录。现在没有影像，也不能下载。",
    },
  },
  {
    slug: "booklet",
    title: { en: "Digital booklet", zh: "电子册" },
    summary: {
      en: "A future short booklet. No file is available.",
      zh: "以后可能做的短册。现在没有文件。",
    },
  },
];

export function getServiceDraft(slug: string): ServiceDraft | undefined {
  return serviceDrafts.find((service) => service.slug === slug);
}
