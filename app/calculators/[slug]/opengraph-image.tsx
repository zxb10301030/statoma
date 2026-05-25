import { ImageResponse } from "next/og";
import { calculators, getCalculatorBySlug } from "@/lib/calculators";

export const dynamic = "force-static";
export const dynamicParams = false;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type CalculatorOpenGraphImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return calculators.map((calculator) => ({
    slug: calculator.slug,
  }));
}

export default async function CalculatorOpenGraphImage({
  params,
}: CalculatorOpenGraphImageProps) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  const title = calculator?.name ?? "Statoma calculator";
  const description =
    calculator?.description ??
    "Statistics calculators that show each step clearly.";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#F8FAFC",
          color: "#132238",
          display: "flex",
          height: "100%",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid #D7E3E8",
            height: "390px",
            left: "720px",
            position: "absolute",
            top: "125px",
            transform: "rotate(-8deg)",
            width: "390px",
          }}
        />
        <div
          style={{
            alignItems: "center",
            borderBottom: "3px solid #9AC7D3",
            bottom: "155px",
            display: "flex",
            gap: "34px",
            left: "760px",
            position: "absolute",
            width: "320px",
          }}
        >
          <div
            style={{
              background: "#0B6F88",
              height: "116px",
              width: "18px",
            }}
          />
          <div
            style={{
              background: "#2B8A6E",
              height: "174px",
              width: "18px",
            }}
          />
          <div
            style={{
              background: "#B88B1D",
              height: "82px",
              width: "18px",
            }}
          />
          <div
            style={{
              background: "#64748B",
              height: "142px",
              width: "18px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            maxWidth: "760px",
            position: "relative",
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
              gap: "24px",
            }}
          >
            <div
              style={{
                color: "#132238",
                display: "flex",
                fontSize: 78,
                fontWeight: 700,
                lineHeight: 1.02,
              }}
            >
              {title}
            </div>
            <div
              style={{
                color: "#475569",
                display: "flex",
                fontSize: 32,
                lineHeight: 1.35,
              }}
            >
              {description}
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
      </div>
    ),
    size,
  );
}
