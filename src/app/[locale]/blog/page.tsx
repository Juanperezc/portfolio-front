import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPage } from "@/components/blog-page";
import { blogPath, getDictionary, isLocale, locales } from "@/lib/i18n";
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
  return {
    title,
    description,
    alternates: {
      canonical: blogPath(locale),
      languages: { es: blogPath("es"), en: blogPath("en"), "x-default": blogPath("es") },
    },
    openGraph: {
      title,
      description,
      url: blogPath(locale),
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
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
