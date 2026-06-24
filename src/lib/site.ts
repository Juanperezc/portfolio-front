export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://juan-perez.me"
).replace(/\/$/, "");

export const OG_IMAGE = "/portfolio-assets/og.png";

export const PERSON = {
  name: "Juan Luis Pérez",
  alternateName: "Juan Pérez",
  jobTitle: "Full Stack Developer",
  email: "juanluisperezc1996@gmail.com",
  sameAs: [
    "https://github.com/Juanperezc",
    "https://www.linkedin.com/in/juan-perez-c",
    "https://www.instagram.com/juanluisperezc/",
  ],
  knowsAbout: [
    "Laravel",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "SaaS",
    "Travel Tech",
    "REST APIs",
    "AWS",
  ],
} as const;
