import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const runtime = "nodejs";
export const contentType = "image/png";

const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f4f7",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          color: "#16141f",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 10,
            background: "#6d28d9",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 68,
              height: 68,
              borderRadius: 20,
              border: "3px solid #6d28d9",
              fontSize: 38,
              fontStyle: "italic",
              color: "#16141f",
            }}
          >
            a
          </div>
          <div style={{ fontSize: 22, letterSpacing: 3, color: "#605b70" }}>
            PORTFOLIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 28,
            }}
          >
            <div style={{ width: 56, height: 4, background: "#6d28d9" }} />
            <div style={{ fontSize: 32, color: "#605b70" }}>{profile.role}</div>
          </div>
        </div>

        <div style={{ fontSize: 22, color: "#928ca2" }}>
          {profile.email}
        </div>
      </div>
    ),
    { ...size }
  );
}
