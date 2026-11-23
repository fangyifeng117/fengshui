import type { Locale } from "@/lib/locale";

export type ThemeImage = {
  id: "roof" | "bracelet" | "lamps";
  href: string;
  src: string;
  small: string;
  width: number;
  height: number;
  label: Record<Locale, string>;
  title: Record<Locale, string>;
  note: Record<Locale, string>;
  alt: Record<Locale, string>;
  credit: string;
};

/** Three homepage reference photos. They are not SKU images. */
export const themeImages: ThemeImage[] = [
  {
    id: "roof",
    href: "/temples",
    src: "/media/themes/roof.jpg",
    small: "/media/themes/roof-640.jpg",
    width: 960,
    height: 1200,
    label: { en: "Scenery", zh: "风光" },
    title: { en: "Roof scenery", zh: "屋檐风光" },
    note: {
      en: "Reference photo of a building roof. Not a partner place.",
      zh: "建筑屋檐的参考照片。不是合作场所。",
    },
    alt: {
      en: "Green glazed roof tiles and a curved eave among trees",
      zh: "树荫下的绿琉璃屋檐",
    },
    credit: "Bernard Spragg. NZ, CC0",
  },
  {
    id: "bracelet",
    href: "/products",
    src: "/media/themes/bracelet.jpg",
    small: "/media/themes/bracelet-640.jpg",
    width: 960,
    height: 1200,
    label: { en: "Style reference", zh: "风格示意" },
    title: { en: "Beaded bracelet", zh: "珠串手镯" },
    note: {
      en: "Style reference of a wrist-sized bead bracelet. Not a sample for sale.",
      zh: "手腕尺寸珠串的风格示意，不是在售样品。",
    },
    alt: {
      en: "A closed loop of small blue-green beads, shaped as a bracelet",
      zh: "一圈蓝绿色小珠组成的手镯",
    },
    credit: "The Metropolitan Museum of Art, CC0",
  },
  {
    id: "lamps",
    href: "/blessing",
    src: "/media/themes/lamps.jpg",
    small: "/media/themes/lamps-640.jpg",
    width: 960,
    height: 1200,
    label: { en: "Atmosphere", zh: "氛围" },
    title: { en: "Lamp light", zh: "灯火" },
    note: {
      en: "Lit lamps, shown as atmosphere only. No offering service is open.",
      zh: "灯火只作氛围参考。供灯服务没有开通。",
    },
    alt: {
      en: "Rows of small lit oil lamps in a dark room",
      zh: "暗处成排的小油灯和火苗",
    },
    credit: "govaayu, CC0",
  },
];
