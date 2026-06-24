import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, isLocale } from "@/lib/i18n";
import { PERSON, SITE_URL } from "@/lib/site";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PERSON.name,
        alternateName: PERSON.alternateName,
        url: `${SITE_URL}/${locale}`,
        jobTitle: PERSON.jobTitle,
        email: `mailto:${PERSON.email}`,
        image: `${SITE_URL}/portfolio-assets/og.png`,
        description: dictionary.hero.description,
        knowsAbout: [...PERSON.knowsAbout],
        sameAs: [...PERSON.sameAs],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Juan Pérez — Portfolio",
        inLanguage: locale === "es" ? "es-AR" : "en-US",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader locale={locale} dictionary={dictionary} />
      {children}
      <SiteFooter locale={locale} dictionary={dictionary} />
    </>
  );
}
