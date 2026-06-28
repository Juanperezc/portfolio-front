import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, isLocale } from "@/lib/i18n";
import { absoluteUrl, languageCode } from "@/lib/seo";
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
        url: absoluteUrl(`/${locale}`),
        jobTitle: PERSON.jobTitle,
        email: `mailto:${PERSON.email}`,
        image: absoluteUrl("/portfolio-assets/og.png"),
        description: dictionary.hero.description,
        knowsAbout: [...PERSON.knowsAbout],
        sameAs: [...PERSON.sameAs],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Juan Pérez — Portfolio",
        inLanguage: languageCode(locale),
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${absoluteUrl(`/${locale}`)}#profile`,
        url: absoluteUrl(`/${locale}`),
        name: dictionary.hero.title,
        description: dictionary.hero.description,
        inLanguage: languageCode(locale),
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#person` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteUrl("/portfolio-assets/og.png"),
        },
        potentialAction: {
          "@type": "ContactAction",
          target: `mailto:${PERSON.email}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${absoluteUrl(`/${locale}`)}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: dictionary.nav.home,
            item: absoluteUrl(`/${locale}`),
          },
        ],
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
