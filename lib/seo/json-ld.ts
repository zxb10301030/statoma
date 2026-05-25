import { absoluteUrl, siteName } from "@/lib/seo/metadata";

type SoftwareApplicationInput = {
  name: string;
  description: string;
  path: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

export function softwareApplicationJsonLd({
  name,
  description,
  path,
}: SoftwareApplicationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description,
    url: absoluteUrl(path),
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
    },
  };
}

export function faqPageJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
