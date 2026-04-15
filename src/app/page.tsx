import HomePage from "../components/HomePage";
import { getSiteUrl, siteConfig } from "../lib/site";

const siteUrl = getSiteUrl();

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [siteConfig.githubUrl, siteConfig.linkedinUrl],
    knowsAbout: siteConfig.focusAreas,
    ...(siteUrl
      ? {
          url: siteUrl,
          image: `${siteUrl}${siteConfig.socialImage}`,
        }
      : {}),
  },
  ...(siteUrl
    ? [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteUrl,
          description: siteConfig.description,
        },
      ]
    : []),
];

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <HomePage />
    </>
  );
}
