import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { blogPostPath, type Dictionary, type Locale } from "@/lib/i18n";
import { strapiMediaUrl, type Article } from "@/lib/strapi";

export function formatDate(value: string | null, locale: Locale): string {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale === "es" ? "es-AR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function BlogPage({
  locale,
  dictionary,
  articles,
}: {
  locale: Locale;
  dictionary: Dictionary;
  articles: Article[];
}) {
  return (
    <main className="dot-grid min-h-screen overflow-x-hidden pt-16">
      <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
          {dictionary.blog.tag}
        </Badge>
        <h1 className="mt-5 max-w-4xl break-words font-display text-4xl font-black sm:text-6xl">
          {dictionary.blog.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {dictionary.blog.description}
        </p>

        {articles.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center text-muted-foreground">
            {dictionary.blog.empty}
          </div>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const cover = strapiMediaUrl(article.cover, "medium") ?? strapiMediaUrl(article.cover);
              const date = formatDate(article.publishedAt ?? article.createdAt, locale);
              return (
                <Link
                  key={article.id}
                  href={blogPostPath(locale, article.slug)}
                  className="card-glow group/post flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-background">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={article.cover?.alternativeText || article.title}
                        fill
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover/post:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    )}
                    {article.category && (
                      <Badge className="absolute left-3 top-3 bg-background/80 text-foreground backdrop-blur">
                        {article.category.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {date && <span className="text-xs uppercase tracking-wider text-muted-foreground">{date}</span>}
                    <h2 className="mt-2 font-display text-xl font-bold leading-snug transition-colors group-hover/post:text-primary">
                      {article.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {article.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {dictionary.blog.readMore}
                      <ArrowRight className="size-4 transition-transform group-hover/post:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
