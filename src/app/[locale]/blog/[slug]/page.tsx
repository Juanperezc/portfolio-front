import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticlePage } from "@/components/blog-article-page";
import { blogPostPath, getDictionary, isLocale, locales } from "@/lib/i18n";
import { OG_IMAGE } from "@/lib/site";
import { getArticle, getArticleSlugs, strapiMediaUrl } from "@/lib/strapi";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = await getArticle(slug);
  if (!article) return {};
  const cover = strapiMediaUrl(article.cover) ?? OG_IMAGE;
  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: blogPostPath(locale, slug),
      languages: {
        es: blogPostPath("es", slug),
        en: blogPostPath("en", slug),
        "x-default": blogPostPath("es", slug),
      },
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: blogPostPath(locale, slug),
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      images: [{ url: cover, alt: article.cover?.alternativeText || article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [cover],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = await getArticle(slug);
  if (!article) notFound();
  return <BlogArticlePage locale={locale} dictionary={getDictionary(locale)} article={article} />;
}
