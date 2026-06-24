import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { marked } from "marked";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/components/blog-page";
import { blogPath, blogPostPath, type Dictionary, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { strapiMediaUrl, type Article, type ArticleBlock } from "@/lib/strapi";

marked.setOptions({ gfm: true });

function BlockRenderer({
  block,
  html,
  fallbackAlt,
}: {
  block: ArticleBlock;
  html: string | null;
  fallbackAlt: string;
}) {
  switch (block.__component) {
    case "shared.rich-text":
      return <div className="article-body" dangerouslySetInnerHTML={{ __html: html ?? "" }} />;
    case "shared.quote":
      return (
        <blockquote className="rounded-r-xl border-l-4 border-primary bg-card/50 px-6 py-4">
          {block.title && <p className="font-display text-lg font-bold">{block.title}</p>}
          {block.body && <p className="mt-1 italic text-muted-foreground">{block.body}</p>}
        </blockquote>
      );
    case "shared.media": {
      const url = strapiMediaUrl(block.file, "large") ?? strapiMediaUrl(block.file);
      if (!url) return null;
      return (
        <figure>
          <Image
            src={url}
            alt={block.file?.alternativeText || fallbackAlt}
            width={block.file?.width ?? 1200}
            height={block.file?.height ?? 800}
            className="w-full rounded-xl border border-border"
          />
          {block.file?.caption && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">{block.file.caption}</figcaption>
          )}
        </figure>
      );
    }
    case "shared.slider": {
      const files = (block.files ?? [])
        .map((file) => ({ url: strapiMediaUrl(file, "medium") ?? strapiMediaUrl(file), alt: file.alternativeText || fallbackAlt }))
        .filter((item): item is { url: string; alt: string } => Boolean(item.url));
      if (!files.length) return null;
      return (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {files.map((file, index) => (
            <div key={index} className="relative aspect-[4/3] w-72 shrink-0 overflow-hidden rounded-xl border border-border">
              <Image src={file.url} alt={file.alt} fill sizes="288px" className="object-cover" />
            </div>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

export async function BlogArticlePage({
  locale,
  dictionary,
  article,
}: {
  locale: Locale;
  dictionary: Dictionary;
  article: Article;
}) {
  const cover = strapiMediaUrl(article.cover, "large") ?? strapiMediaUrl(article.cover);
  const avatar = strapiMediaUrl(article.author?.avatar, "thumbnail");
  const date = formatDate(article.publishedAt ?? article.createdAt, locale);
  const blocks = article.blocks ?? [];
  const renderedHtml = await Promise.all(
    blocks.map((block) =>
      block.__component === "shared.rich-text" ? marked.parse(block.body || "") : null,
    ),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: cover ? [cover] : undefined,
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt,
    inLanguage: locale === "es" ? "es-AR" : "en-US",
    mainEntityOfPage: `${SITE_URL}${blogPostPath(locale, article.slug)}`,
    author: { "@type": "Person", name: article.author?.name ?? "Juan Pérez" },
  };

  return (
    <main className="min-h-screen pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <Link
          href={blogPath(locale)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          {dictionary.blog.back}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {article.category && (
            <Badge variant="outline" className="border-primary/40 text-primary">{article.category.name}</Badge>
          )}
          {date && <span>{date}</span>}
        </div>

        <h1 className="mt-4 font-display text-4xl font-black leading-tight lg:text-5xl">{article.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{article.description}</p>

        {article.author && (
          <div className="mt-6 flex items-center gap-3">
            {avatar && (
              <Image src={avatar} alt={article.author.name} width={40} height={40} className="size-10 rounded-full object-cover" />
            )}
            <span className="text-sm font-medium">
              {dictionary.blog.by} {article.author.name}
            </span>
          </div>
        )}

        {cover && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
            <Image
              src={cover}
              alt={article.cover?.alternativeText || article.title}
              fill
              sizes="(max-width:768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-10 space-y-8">
          {blocks.map((block, index) => (
            // Strapi dynamic-zone block ids are not unique across component types,
            // so combine component + index to guarantee a unique key.
            <BlockRenderer key={`${block.__component}-${index}`} block={block} html={renderedHtml[index]} fallbackAlt={article.title} />
          ))}
        </div>
      </article>
    </main>
  );
}
