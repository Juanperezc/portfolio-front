import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPage } from "@/components/blog-page";
import { blogPath, getDictionary, isLocale, locales } from "@/lib/i18n";
import { absoluteUrl, blogAlternates, languageCode, SEO_KEYWORDS } from "@/lib/seo";
import { OG_IMAGE } from "@/lib/site";
import { getArticles } from "@/lib/strapi";

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
  const { title, description } = getDictionary(locale).blog;
  const hasArticles = (await getArticles()).length > 0;
  return {
    title,
    description,
    keywords: [...SEO_KEYWORDS, "blog desarrollo web", "full-stack blog", "SaaS articles", "Travel Tech articles"],
    robots: hasArticles ? undefined : { index: false, follow: true },
    alternates: {
      canonical: absoluteUrl(blogPath(locale)),
      languages: blogAlternates(),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(blogPath(locale)),
      type: "website",
      locale: languageCode(locale).replace("-", "_"),
      images: [{ url: absoluteUrl(OG_IMAGE), width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(OG_IMAGE)] },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const articles = await getArticles();
  return <BlogPage locale={locale} dictionary={getDictionary(locale)} articles={articles} />;
}
