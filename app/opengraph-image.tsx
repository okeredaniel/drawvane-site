import { ImageResponse } from "next/og";
export const alt =
  "Stratora: Construction intelligence, grounded in the drawing set.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#111315",
        color: "#fff",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#F5C93C",
          fontSize: 30,
          letterSpacing: 5,
        }}
      >
        STRATORA
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 76,
          fontSize: 76,
          lineHeight: 1.06,
        }}
      >
        Construction intelligence.
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 35,
          color: "#d6d9dc",
        }}
      >
        Grounded in the drawing set.
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          width: 100,
          height: 8,
          background: "#F5C93C",
        }}
      />
    </div>,
    size,
  );
}
