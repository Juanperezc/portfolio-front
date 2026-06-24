import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
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
  metadataBase: new URL("https://juanperez.dev"),
  title: {
    default: "Juan Pérez — Full-stack Developer",
    template: "%s · Juan Pérez",
  },
  description:
    "Desarrollo productos digitales rápidos, accesibles y memorables para startups y equipos en crecimiento.",
  keywords: [
    "Full-stack developer",
    "Next.js developer",
    "React developer",
    "Desarrollador web",
    "Buenos Aires",
  ],
  openGraph: {
    title: "Juan Pérez — Full-stack Developer",
    description:
      "Diseño y desarrollo productos digitales que convierten ideas ambiciosas en experiencias memorables.",
    type: "website",
    locale: "es_AR",
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
