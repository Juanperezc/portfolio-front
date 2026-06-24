const STRAPI_URL = (process.env.STRAPI_URL ?? "").replace(/\/$/, "");
const TOKEN = process.env.STRAPI_API_TOKEN ?? "";
const SHOW_DRAFTS = process.env.STRAPI_DRAFTS === "true";

export const strapiConfigured = Boolean(STRAPI_URL && TOKEN);

export type StrapiMedia = {
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  mime?: string | null;
  formats?: Record<string, { url: string; width: number; height: number }> | null;
};

export type ArticleBlock =
  | { __component: "shared.rich-text"; id: number; body: string }
  | { __component: "shared.quote"; id: number; title?: string | null; body?: string | null }
  | { __component: "shared.media"; id: number; file?: StrapiMedia | null }
  | { __component: "shared.slider"; id: number; files?: StrapiMedia[] | null };

export type Article = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  cover?: StrapiMedia | null;
  author?: { name: string; avatar?: StrapiMedia | null } | null;
  category?: { name: string; slug: string } | null;
  blocks?: ArticleBlock[];
};

export function strapiMediaUrl(
  media?: StrapiMedia | null,
  format?: "thumbnail" | "small" | "medium" | "large",
): string | null {
  if (!media) return null;
  const url = (format && media.formats?.[format]?.url) || media.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

async function strapiFetch<T>(path: string): Promise<T | null> {
  if (!strapiConfigured) return null;
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { revalidate: 300, tags: ["strapi"] },
    });
    if (!res.ok) {
      console.error(`Strapi request failed: ${path} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error("Strapi request error:", error);
    return null;
  }
}

const statusQuery = SHOW_DRAFTS ? "&status=draft" : "";

export async function getArticles(): Promise<Article[]> {
  const data = await strapiFetch<{ data: Article[] }>(
    `/articles?sort=publishedAt:desc&populate[cover]=true&populate[category]=true&populate[author][populate]=avatar${statusQuery}`,
  );
  return data?.data ?? [];
}

export async function getArticleSlugs(): Promise<string[]> {
  const data = await strapiFetch<{ data: { slug: string }[] }>(
    `/articles?fields[0]=slug&pagination[pageSize]=100${statusQuery}`,
  );
  return (data?.data ?? []).map((item) => item.slug).filter(Boolean);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const data = await strapiFetch<{ data: Article[] }>(
    `/articles?filters[slug][$eq]=${encodeURIComponent(slug)}` +
      `&populate[cover]=true&populate[category]=true&populate[author][populate]=avatar` +
      `&populate[blocks][populate]=*${statusQuery}`,
  );
  return data?.data?.[0] ?? null;
}
