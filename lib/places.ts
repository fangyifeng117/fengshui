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
};

export const serviceDrafts: ServiceDraft[] = [
  {
    slug: "offering-lamps",
    title: { en: "Offering lamps", zh: "祈福供灯" },
    summary: {
      en: "A cultural record of an offering-lamp service. This page only displays it. There is no booking, no payment, and no automatic charge.",
      zh: "祈福供灯的文化记录。这个页面只做展示。不能预约，不能支付，也不会自动扣费。",
    },
    status: {
      en: "On display. Booking and payment are not open.",
      zh: "服务展示，暂未开放预约/支付。",
    },
    offers: [
      {
        id: "once",
        label: { en: "USD 50, one time", zh: "单次 USD 50" },
        detail: {
          en: "One occasion at one place, not both. The proposed day is the 1st of each month. How many lamps, how long they stay lit, the first month, and closure days are not confirmed.",
          zh: "一次，只在一处，不是两处都做。拟定日期是每月 1 日。灯的数量、点亮多久、从哪一个月开始、遇关闭日怎么办，都还没有确认。",
        },
      },
      {
        id: "year",
        label: { en: "USD 300 for one year, 12 times", zh: "一年 USD 300，共 12 次" },
        detail: {
          en: "Once each month, 12 times, one place each time. USD 300 is the total for that year. It is not charged each month, and it does not renew by itself.",
          zh: "每个月一次，共 12 次，每次只在一处。USD 300 是这一年的总额，不是每月收取，也不会自动续费。",
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
      en: "Each occasion is one place. The customer chooses either 天下第一财神庙 or 灵隐寺, not both. The USD 50 occasion and each of the 12 occasions in the USD 300 year use this same rule. Permission to do the lighting there, and permission to film, are not verified. This page is not an official partnership.",
      zh: "每次只在一处供灯。顾客在天下第一财神庙和灵隐寺中选择一处，不是两处都做。单次 USD 50 和全年 USD 300 的每一次都按这个范围。在当地执行和拍摄的商业许可尚未核实。本页不是官方合作或授权。",
    },
    gaps: [
      {
        en: "Who would do the lighting is not confirmed. The choice of place above is a commercial scope, not a verified permission.",
        zh: "由谁来供灯还没有确认。上面的地点是商业范围，不是已经核实的许可。",
      },
      {
        en: "The proposed day is the 1st of each month. The first month, and what happens on a closure day, are not confirmed.",
        zh: "拟定日期是每月 1 日。从哪一个月开始、遇关闭日怎么办，还没有确认。",
      },
      {
        en: "A private on-site photo or video is a proposed record. It would be delivered only after the person in that record agrees. This page does not collect a name, a wish, or a photo.",
        zh: "现场照片或视频是拟定中的记录，只在画面中的本人同意后私密交付。这个页面不收集姓名、愿望或照片。",
      },
      {
        en: "Pause, cancel, and refund rules are not confirmed.",
        zh: "暂停、取消和退款规则，还没有确认。",
      },
    ],
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
