import { ImageResponse } from "next/og";
import { publicConfig } from "@/lib/public-config";
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
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, color: "#4c1d6e" }}>护佑一生</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>{publicConfig.brandName}</div>
          <div style={{ fontSize: 32, color: "#3d3148" }}>Payment is off.</div>
        </div>
      </div>
    ),
    size,
  );
}
