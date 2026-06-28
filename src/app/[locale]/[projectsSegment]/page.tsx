import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectsPage } from "@/components/projects-page";
import { getDictionary, isLocale, locales, projectsPath } from "@/lib/i18n";
import { absoluteUrl, languageCode, projectsAlternates, SEO_KEYWORDS } from "@/lib/seo";
import { OG_IMAGE } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
    projectsSegment: locale === "es" ? "proyectos" : "projects",
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = getDictionary(locale).projectsPage;
  return {
    title,
    description,
    keywords: [...SEO_KEYWORDS, "case studies", "portfolio projects", "proyectos SaaS", "Travel Tech projects"],
    alternates: {
      canonical: absoluteUrl(projectsPath(locale)),
      languages: projectsAlternates(),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(projectsPath(locale)),
      type: "website",
      locale: languageCode(locale).replace("-", "_"),
      images: [{ url: absoluteUrl(OG_IMAGE), width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(OG_IMAGE)] },
  };
}

export default async function AllProjectsPage({
  params,
}: {
  params: Promise<{ locale: string; projectsSegment: string }>;
}) {
  const { locale, projectsSegment } = await params;
  if (!isLocale(locale)) notFound();
  const expected = locale === "es" ? "proyectos" : "projects";
  if (projectsSegment !== expected) notFound();
  return <ProjectsPage locale={locale} dictionary={getDictionary(locale)} />;
}
