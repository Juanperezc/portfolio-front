import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectsPage } from "@/components/projects-page";
import { getDictionary, isLocale, locales, projectsPath } from "@/lib/i18n";
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
    alternates: {
      canonical: projectsPath(locale),
      languages: {
        es: projectsPath("es"),
        en: projectsPath("en"),
        "x-default": projectsPath("es"),
      },
    },
    openGraph: {
      title,
      description,
      url: projectsPath(locale),
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
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
