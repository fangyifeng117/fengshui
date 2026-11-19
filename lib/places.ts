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

export type ServiceDraft = {
  slug: string;
  title: { en: string; zh: string };
  summary: { en: string; zh: string };
};

export const serviceDrafts: ServiceDraft[] = [
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
