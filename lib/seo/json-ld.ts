import { absoluteUrl, siteName } from "@/lib/seo/metadata";

const contactEmail = "contact@statoma.com";
const organizationId = `${absoluteUrl("/")}#organization`;
const websiteId = `${absoluteUrl("/")}#website`;
const educatorId = `${absoluteUrl("/about/")}#educator`;
const calculatorListId = `${absoluteUrl("/calculators/")}#calculator-list`;
const contactPageId = `${absoluteUrl("/contact/")}#contact-page`;

type SoftwareApplicationInput = {
  name: string;
  description: string;
  path: string;
};

type CalculatorListInput = {
  slug: string;
  name: string;
  description: string;
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

export function calculatorItemListJsonLd(items: readonly CalculatorListInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": calculatorListId,
    name: "Statoma statistics calculators",
    description:
      "A list of Statoma calculators for t-tests, p-values, confidence intervals, sample size planning, and chi-square tests.",
    url: absoluteUrl("/calculators/"),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => {
      const url = absoluteUrl(`/calculators/${item.slug}/`);

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url,
        item: {
          "@type": "SoftwareApplication",
          name: item.name,
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          description: item.description,
          url,
          publisher: {
            "@id": organizationId,
          },
        },
      };
    }),
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": contactPageId,
    name: "Contact Statoma",
    description:
      "Contact Statoma for statistics calculator feedback, corrections, content requests, and site questions.",
    url: absoluteUrl("/contact/"),
    mainEntity: {
      "@id": organizationId,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: contactEmail,
      contactType: "general inquiries",
      availableLanguage: "en",
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
