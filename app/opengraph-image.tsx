import { ImageResponse } from "next/og";
import { publicConfig } from "@/lib/public-config";

export const alt = `${publicConfig.brandName} sample catalog`;
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
          background: "#f4efe6",
          color: "#241f1c",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#8e2a22" }}>SAMPLE CATALOG</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>{publicConfig.brandName}</div>
          <div style={{ fontSize: 32, color: "#3a332d" }}>Illustrative USD prices. Not a live shop.</div>
        </div>
      </div>
    ),
    size,
  );
}
