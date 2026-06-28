import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/components/project-detail-page";
import { getDictionary, isLocale, locales, projectPath } from "@/lib/i18n";
import { absoluteUrl, languageCode, projectAlternates, SEO_KEYWORDS } from "@/lib/seo";

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
  if (!project) return {};
  const title = `${project.name} — ${project.category}`;
  return {
    title: project.name,
    description: project.summary,
    keywords: [...SEO_KEYWORDS, project.name, project.category, project.role, ...project.tags],
    alternates: {
      canonical: absoluteUrl(projectPath(locale, slug)),
      languages: projectAlternates(slug),
    },
    openGraph: {
      title,
      description: project.summary,
      url: absoluteUrl(projectPath(locale, slug)),
      type: "article",
      locale: languageCode(locale).replace("-", "_"),
      images: [{ url: absoluteUrl(project.image), alt: `${project.name} — ${project.category}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
      images: [absoluteUrl(project.image)],
    },
  };
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
