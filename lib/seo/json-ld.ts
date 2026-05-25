import { absoluteUrl, siteName } from "@/lib/seo/metadata";

const contactEmail = "contact@statoma.com";
const organizationId = `${absoluteUrl("/")}#organization`;
const websiteId = `${absoluteUrl("/")}#website`;
const educatorId = `${absoluteUrl("/about/")}#educator`;

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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteName,
    url: absoluteUrl("/"),
    description:
      "Statoma is an educational statistics calculator suite that explains methods, assumptions, and interpretation alongside each result.",
    email: contactEmail,
    contactPoint: {
      "@type": "ContactPoint",
      email: contactEmail,
      contactType: "general inquiries",
      availableLanguage: "en",
    },
  };
}

export function educatorPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": educatorId,
    name: "Statoma educator",
    jobTitle: "Math educator",
    description:
      "A working math educator who builds Statoma as an educational statistics calculator suite.",
    url: absoluteUrl("/about/"),
    worksFor: {
      "@id": organizationId,
    },
    mainEntityOfPage: absoluteUrl("/about/"),
  };
}

export function aboutPageJsonLd() {
  return [organizationJsonLd(), educatorPersonJsonLd()];
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteName,
    url: absoluteUrl("/"),
    description:
      "A free, modern statistics calculator suite that explains each step so users can understand the result, not just copy a number.",
    inLanguage: "en",
    publisher: {
      "@id": organizationId,
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
