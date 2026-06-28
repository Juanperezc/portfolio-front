import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home-page";
import { formatDate } from "@/components/blog-page";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { absoluteUrl, homeAlternates, languageCode, SEO_KEYWORDS } from "@/lib/seo";
import { OG_IMAGE } from "@/lib/site";
import { getArticles, strapiMediaUrl } from "@/lib/strapi";

export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dictionary = getDictionary(locale);
  const isEs = locale === "es";
  const title = isEs
    ? "Juan Pérez — Full Stack Developer | SaaS, Travel Tech y plataformas enterprise"
    : "Juan Pérez — Full Stack Developer | SaaS, Travel Tech & enterprise platforms";
  return {
    title: { absolute: title },
    description: dictionary.hero.description,
    keywords: [...SEO_KEYWORDS, "portfolio developer", "SaaS portfolio", "Travel Tech portfolio"],
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      languages: homeAlternates(),
    },
    openGraph: {
      title,
      description: dictionary.hero.description,
      url: absoluteUrl(`/${locale}`),
      type: "profile",
      locale: languageCode(locale).replace("-", "_"),
      alternateLocale: isEs ? "en_US" : "es_AR",
      images: [{ url: absoluteUrl(OG_IMAGE), width: 1200, height: 630, alt: "Juan Pérez — Full Stack Developer" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dictionary.hero.description,
      images: [absoluteUrl(OG_IMAGE)],
    },
  };
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const articles = (await getArticles()).slice(0, 3).map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category?.name ?? null,
    date: formatDate(article.publishedAt ?? article.createdAt, locale),
    cover: strapiMediaUrl(article.cover, "small") ?? strapiMediaUrl(article.cover),
  }));
  return <HomePage locale={locale} dictionary={getDictionary(locale)} latestPosts={articles} />;
}
