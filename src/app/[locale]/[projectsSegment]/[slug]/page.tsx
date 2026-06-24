import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/components/project-detail-page";
import { getDictionary, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) => {
    const dictionary = getDictionary(locale);
    return dictionary.projects.map((project) => ({
      locale,
      projectsSegment: locale === "es" ? "proyectos" : "projects",
      slug: project.slug,
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; projectsSegment: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = getDictionary(locale).projects.find((item) => item.slug === slug);
  return project ? { title: project.name, description: project.summary } : {};
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ locale: string; projectsSegment: string; slug: string }>;
}) {
  const { locale, projectsSegment, slug } = await params;
  if (!isLocale(locale)) notFound();
  const expected = locale === "es" ? "proyectos" : "projects";
  const dictionary = getDictionary(locale);
  const project = dictionary.projects.find((item) => item.slug === slug);
  if (projectsSegment !== expected || !project) notFound();
  return <ProjectDetailPage locale={locale} dictionary={dictionary} project={project} />;
}
