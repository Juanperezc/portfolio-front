import type { MetadataRoute } from "next";
import { blogPath, blogPostPath, getDictionary, locales, projectPath, projectsPath } from "@/lib/i18n";
import { absoluteUrl, blogAlternates, blogPostAlternates, homeAlternates, projectAlternates, projectsAlternates } from "@/lib/seo";
import { getArticleSlugs } from "@/lib/strapi";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const articleSlugs = await getArticleSlugs();
  const hasArticles = articleSlugs.length > 0;

  for (const locale of locales) {
    entries.push({
      url: absoluteUrl(`/${locale}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: homeAlternates() },
    });
    entries.push({
      url: absoluteUrl(projectsPath(locale)),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: projectsAlternates() },
    });
    if (hasArticles) {
      entries.push({
        url: absoluteUrl(blogPath(locale)),
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: blogAlternates() },
      });
    }
    for (const project of getDictionary(locale).projects) {
      entries.push({
        url: absoluteUrl(projectPath(locale, project.slug)),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: projectAlternates(project.slug) },
      });
    }
    for (const slug of articleSlugs) {
      entries.push({
        url: absoluteUrl(blogPostPath(locale, slug)),
        lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: { languages: blogPostAlternates(slug) },
      });
    }
  }

  return entries;
}
