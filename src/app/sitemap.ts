import type { MetadataRoute } from "next";
import { blogPath, blogPostPath, getDictionary, locales, projectPath, projectsPath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { getArticleSlugs } from "@/lib/strapi";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const homeLanguages = { es: `${SITE_URL}/es`, en: `${SITE_URL}/en` };
  const entries: MetadataRoute.Sitemap = [];
  const articleSlugs = await getArticleSlugs();

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: homeLanguages },
    });
    entries.push({
      url: `${SITE_URL}${projectsPath(locale)}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: { es: `${SITE_URL}${projectsPath("es")}`, en: `${SITE_URL}${projectsPath("en")}` } },
    });
    entries.push({
      url: `${SITE_URL}${blogPath(locale)}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: { es: `${SITE_URL}${blogPath("es")}`, en: `${SITE_URL}${blogPath("en")}` } },
    });
    for (const project of getDictionary(locale).projects) {
      entries.push({
        url: `${SITE_URL}${projectPath(locale, project.slug)}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            es: `${SITE_URL}${projectPath("es", project.slug)}`,
            en: `${SITE_URL}${projectPath("en", project.slug)}`,
          },
        },
      });
    }
    for (const slug of articleSlugs) {
      entries.push({
        url: `${SITE_URL}${blogPostPath(locale, slug)}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: {
          languages: {
            es: `${SITE_URL}${blogPostPath("es", slug)}`,
            en: `${SITE_URL}${blogPostPath("en", slug)}`,
          },
        },
      });
    }
  }

  return entries;
}
