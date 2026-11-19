import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlessingDetail } from "@/components/BlessingDetail";
import { BlessingIndex } from "@/components/BlessingIndex";
import { PlaceDetail } from "@/components/PlaceDetail";
import { PlacesIndex } from "@/components/PlacesIndex";
import { SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
import { routing } from "@/i18n/routing";
import { hrefFor } from "@/lib/locale";
import { getPlace, places, serviceDrafts } from "@/lib/places";

const forbidden = [
  /Presented at/i,
  /real temple footage/i,
  /every piece traces back/i,
  /大雄宝殿/,
];

describe("M1 bilingual skeleton", () => {
  it("keeps English URLs unprefixed and prefixes Chinese", () => {
    expect(hrefFor("en", "/temples")).toBe("/temples");
    expect(hrefFor("en", "/")).toBe("/");
    expect(hrefFor("zh", "/")).toBe("/zh");
    expect(hrefFor("zh", "/temples/wutai")).toBe("/zh/temples/wutai");
    expect(routing.localePrefix).toBe("as-needed");
    expect(routing.localeDetection).toBe(false);
  });

  it("lists the five cultural places and marks Xuedou as unverified", () => {
    expect(places.map((place) => place.slug)).toEqual(["wutai", "emei", "putuo", "jiuhua", "xuedou"]);
    expect(getPlace("xuedou")?.regionPending).toBe(true);
    const html = renderToStaticMarkup(<PlacesIndex locale="zh" />);
    expect(html).toContain("五台山");
    expect(html).toContain("资料待核实");
    expect(html).toContain("不是具体寺院");
    expect(html).toContain('href="/zh/temples/wutai"');
  });

  it("shows inspired-by samples and a non-purchasable blessing draft", () => {
    const place = getPlace("wutai");
    if (!place) throw new Error("missing place");
    const placeHtml = renderToStaticMarkup(<PlaceDetail locale="en" place={place} />);
    expect(placeHtml).toContain("Not a record of origin");
    expect(placeHtml).toContain("Sample Red Cord Bracelet");
    const blessing = renderToStaticMarkup(<BlessingIndex locale="en" />);
    expect(blessing).toContain(SERVICE_DRAFT_DISCLAIMER);
    expect(blessing).not.toContain("<form");
    expect(blessing).not.toContain("<input");
    const service = serviceDrafts[0];
    if (!service) throw new Error("missing service");
    const detail = renderToStaticMarkup(<BlessingDetail locale="zh" service={service} />);
    expect(detail).toContain("即将推出");
    expect(detail).toContain(SERVICE_DRAFT_DISCLAIMER);
    expect(detail).not.toContain("<form");
    const blob = JSON.stringify({ places, serviceDrafts, blessing, detail });
    for (const pattern of forbidden) expect(blob.match(pattern)).toBeNull();
  });
});
