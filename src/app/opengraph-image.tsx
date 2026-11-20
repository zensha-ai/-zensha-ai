import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const alt = `${brand.brandName} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social-share image (WhatsApp, LinkedIn, X, Facebook) for every page. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(60% 80% at 80% 20%, #1f2552 0%, #07080a 60%), #07080a",
          color: "#f3f4f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, letterSpacing: 6, fontWeight: 700 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "#5eead4" }} />
            {brand.brandName}
          </div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 72, lineHeight: 1.02, fontWeight: 700, letterSpacing: -2 }}>
            {brand.tagline}
          </div>
          <div style={{ display: "flex", marginTop: 32, fontSize: 28, color: "#c4c8d0" }}>Websites · Apps · AI · Automation · Data</div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 22, color: "#5eead4" }}>Packages from ₹9,999 · Bengaluru, India</div>
        </div>
        <svg width="380" height="380" viewBox="0 0 64 64">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f3f4f6" />
              <stop offset="0.55" stopColor="#8b9cff" />
              <stop offset="1" stopColor="#5eead4" />
            </linearGradient>
          </defs>
          <path d="M46.5 18.5A19 19 0 1 0 51 30" fill="none" stroke="url(#g)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="50.5" cy="21.5" r="3.6" fill="#5eead4" />
        </svg>
      </div>
    ),
    size,
  );
}
