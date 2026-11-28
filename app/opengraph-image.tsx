import { ImageResponse } from "next/og";
import { BRAND_LATIN, BRAND_NAME, BRAND_NAME_EN } from "@/lib/public-config";
import { SITE_TITLE } from "@/lib/seo";

export const alt = SITE_TITLE.en;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f4fb",
          color: "#2e1144",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#4c1d6e" }}>{BRAND_LATIN}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>{BRAND_NAME}</div>
          <div style={{ fontSize: 32, color: "#3d3148" }}>{BRAND_NAME_EN}</div>
          <div style={{ fontSize: 28, color: "#3d3148" }}>Payment is off.</div>
        </div>
      </div>
    ),
    size,
  );
}
