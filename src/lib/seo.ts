import { blogPath, blogPostPath, projectPath, projectsPath, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const SEO_KEYWORDS = [
  "Juan Perez",
  "Juan Pérez",
  "Full Stack Developer",
  "Software Engineer",
  "Laravel developer",
  "React developer",
  "Next.js developer",
  "TypeScript developer",
  "SaaS developer",
  "Travel Tech",
  "Legal Tech",
  "remote developer",
  "desarrollador full stack",
  "desarrollador Laravel",
  "desarrollador React",
] as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function homeAlternates() {
  return {
    es: absoluteUrl("/es"),
    en: absoluteUrl("/en"),
    "x-default": absoluteUrl("/es"),
  };
}

export function projectsAlternates() {
  return {
    es: absoluteUrl(projectsPath("es")),
    en: absoluteUrl(projectsPath("en")),
    "x-default": absoluteUrl(projectsPath("es")),
  };
}

export function projectAlternates(slug: string) {
  return {
    es: absoluteUrl(projectPath("es", slug)),
    en: absoluteUrl(projectPath("en", slug)),
    "x-default": absoluteUrl(projectPath("es", slug)),
  };
}

export function blogAlternates() {
  return {
    es: absoluteUrl(blogPath("es")),
    en: absoluteUrl(blogPath("en")),
    "x-default": absoluteUrl(blogPath("es")),
  };
}

export function blogPostAlternates(slug: string) {
  return {
    es: absoluteUrl(blogPostPath("es", slug)),
    en: absoluteUrl(blogPostPath("en", slug)),
    "x-default": absoluteUrl(blogPostPath("es", slug)),
  };
}

export function languageCode(locale: Locale): "es-AR" | "en-US" {
  return locale === "es" ? "es-AR" : "en-US";
}
