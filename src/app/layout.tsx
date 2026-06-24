import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { OG_IMAGE, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Juan Pérez — Full Stack Developer",
    template: "%s · Juan Pérez",
  },
  description:
    "Full Stack Developer con 10+ años en Laravel, React y TypeScript. Construyo plataformas SaaS, Travel Tech y enterprise que escalan a millones de usuarios.",
  applicationName: "Juan Pérez — Portfolio",
  authors: [{ name: "Juan Luis Pérez", url: SITE_URL }],
  creator: "Juan Luis Pérez",
  publisher: "Juan Luis Pérez",
  keywords: [
    "Juan Pérez",
    "Full Stack Developer",
    "Laravel developer",
    "React developer",
    "Next.js developer",
    "TypeScript",
    "SaaS",
    "Travel Tech",
    "Desarrollador web",
    "Software engineer",
  ],
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Juan Pérez — Full Stack Developer",
    description:
      "10+ años construyendo plataformas SaaS, Travel Tech y enterprise con Laravel, React y TypeScript.",
    type: "website",
    siteName: "Juan Pérez — Portfolio",
    locale: "es_AR",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Juan Pérez — Full Stack Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juan Pérez — Full Stack Developer",
    description:
      "10+ años construyendo plataformas SaaS, Travel Tech y enterprise con Laravel, React y TypeScript.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable} ${jetBrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
