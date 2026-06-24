import en from "@/messages/en.json";
import es from "@/messages/es.json";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = typeof es;
export type Project = Dictionary["projects"][number];

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function projectsPath(locale: Locale): string {
  return locale === "es" ? `/${locale}/proyectos` : `/${locale}/projects`;
}

export function projectPath(locale: Locale, slug: string): string {
  return `${projectsPath(locale)}/${slug}`;
}

export function blogPath(locale: Locale): string {
  return `/${locale}/blog`;
}

export function blogPostPath(locale: Locale, slug: string): string {
  return `${blogPath(locale)}/${slug}`;
}

export function alternatePath(pathname: string, locale: Locale): string {
  const target = locale === "es" ? "en" : "es";
  const projectMatch = pathname.match(/^\/(es|en)\/(proyectos|projects)\/([^/]+)$/);

  if (projectMatch) {
    return projectPath(target, projectMatch[3]);
  }

  if (/^\/(es|en)\/(proyectos|projects)$/.test(pathname)) {
    return projectsPath(target);
  }

  const blogPostMatch = pathname.match(/^\/(es|en)\/blog\/([^/]+)$/);
  if (blogPostMatch) {
    return blogPostPath(target, blogPostMatch[2]);
  }

  if (/^\/(es|en)\/blog$/.test(pathname)) {
    return blogPath(target);
  }

  return `/${target}`;
}
