import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Statoma - Statistics calculators that show you how.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F8FAFC",
          color: "#132238",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "18px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#0B6F88",
              color: "#FFFFFF",
              display: "flex",
              fontSize: 40,
              fontWeight: 700,
              height: "72px",
              justifyContent: "center",
              width: "72px",
            }}
          >
            S
          </div>
          <div
            style={{
              color: "#0F172A",
              display: "flex",
              fontSize: 42,
              fontWeight: 700,
            }}
          >
            Statoma
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              color: "#132238",
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Statistics calculators that show you how.
          </div>
          <div
            style={{
              color: "#475569",
              display: "flex",
              fontSize: 32,
              lineHeight: 1.35,
            }}
          >
            Step-by-step tools for t-tests, p-values, confidence intervals,
            sample size, and chi-square tests.
          </div>
        </div>

        <div
          style={{
            color: "#0B6F88",
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          statoma.com
        </div>
      </div>
    ),
    size,
  );
}
