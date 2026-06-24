import { notFound } from "next/navigation";
import { ProjectsPage } from "@/components/projects-page";
import { getDictionary, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
    projectsSegment: locale === "es" ? "proyectos" : "projects",
  }));
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
