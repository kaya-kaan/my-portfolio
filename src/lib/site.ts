export const siteConfig = {
  name: "Kaan Kaya",
  title: "Kaan Kaya | Software Engineer",
  description:
    "Software engineer focused on backend development, data-driven systems, workflow automation, and scalable applications.",
  jobTitle: "Software Engineer",
  locale: "en_CA",
  keywords: [
    "Kaan Kaya",
    "software engineer",
    "backend developer",
    "workflow automation",
    "data-driven systems",
    "Next.js portfolio",
    "Java developer",
    "full-stack developer",
  ],
  socialImage: "/logo.jpg",
  email: "kaan.kaya.dev@gmail.com",
  githubUrl: "https://github.com/kaya-kaan",
  linkedinUrl: "https://www.linkedin.com/in/kaankaya7/",
  focusAreas: [
    "Backend engineering",
    "Data-intensive applications",
    "Workflow automation",
    "Full-stack product development",
  ],
} as const;

const normalizeSiteUrl = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const formattedValue = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(formattedValue).origin;
  } catch {
    return undefined;
  }
};

export const getSiteUrl = () => {
  const configuredUrl = normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.SITE_URL ??
      process.env.DOMAIN,
  );

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  return undefined;
};
