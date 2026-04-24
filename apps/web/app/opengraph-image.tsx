import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FlexQR — QR Code Generator with Analytics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #6D28D9 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          FlexQR
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            marginBottom: 28,
          }}
        >
          QR Code Generator
          <br />
          with Analytics
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.5,
          }}
        >
          Create dynamic QR codes and track scans in real time
        </div>

        {/* Bottom pill */}
        <div
          style={{
            position: "absolute",
            bottom: 64,
            right: 96,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 9999,
            padding: "8px 20px",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#34D399",
            }}
          />
          <span style={{ fontSize: 18, color: "white", fontWeight: 500 }}>
            Dynamic • Trackable • Always up to date
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
