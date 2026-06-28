import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { projectPath, projectsPath, type Dictionary, type Locale, type Project } from "@/lib/i18n";
import { absoluteUrl, languageCode } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export function ProjectDetailPage({
  locale,
  dictionary,
  project,
}: {
  locale: Locale;
  dictionary: Dictionary;
  project: Project;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(projectPath(locale, project.slug))}#project`,
    name: project.name,
    description: project.summary,
    url: absoluteUrl(projectPath(locale, project.slug)),
    image: absoluteUrl(project.image),
    inLanguage: languageCode(locale),
    creator: { "@id": `${SITE_URL}/#person` },
    keywords: project.tags.join(", "),
    dateCreated: project.year,
    genre: project.category,
    sameAs: project.url || undefined,
  };

  return (
    <main className="min-h-screen pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="dot-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" className="mb-10 text-muted-foreground">
            <Link href={projectsPath(locale)}><ArrowLeft />{dictionary.common.backToProjects}</Link>
          </Button>
          <div>
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge style={{ background: `${project.accent}18`, color: project.accent }}>{project.number}</Badge>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: project.accent }}>{project.category}</span>
              </div>
              <h1 className="mt-6 font-display text-5xl font-black sm:text-7xl">{project.name}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{project.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.url && (
                  <Button asChild>
                    <a href={project.url} target="_blank" rel="noreferrer">
                      {dictionary.common.visitWebsite}<ExternalLink />
                    </a>
                  </Button>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => <Badge key={tag} variant="secondary" className="font-mono text-xs">{tag}</Badge>)}
                </div>
              </div>
            </div>
            <Card className="mt-14 overflow-hidden border-border bg-card shadow-2xl">
              <div className="flex h-10 items-center gap-2 border-b border-border bg-slate-950 px-4">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-yellow-400" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 truncate font-mono text-xs text-slate-400">{project.url}</span>
              </div>
              <div className="relative aspect-[16/9] bg-background">
                <Image
                  src={project.image}
                  alt={`${project.name} website homepage`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {project.metrics.map(([value, label]) => (
            <Card key={label} className="border-border bg-card text-center">
              <CardContent className="p-7">
                <strong className="font-display text-4xl" style={{ color: project.accent }}>{value}</strong>
                <p className="mt-2 text-sm text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-8">
            <DetailBlock title={dictionary.projectDetail.role} text={project.role} />
            <DetailBlock title={dictionary.projectDetail.year} text={project.year} />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">{dictionary.common.technologies}</h2>
              <div className="mt-4 flex flex-wrap gap-2">{project.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
            </div>
          </div>
          <div className="space-y-12">
            <DetailBlock title={dictionary.projectDetail.overview} text={project.overview} large />
            <DetailBlock title={dictionary.projectDetail.challenge} text={project.challenge} large />
            <DetailBlock title={dictionary.projectDetail.solution} text={project.solution} large />
            <div>
              <h2 className="font-display text-3xl font-black">{dictionary.common.features}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <Card key={feature} className="border-border bg-card">
                    <CardContent className="flex items-start gap-3 p-5">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10"><Check className="size-3 text-primary" /></span>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function DetailBlock({ title, text, large = false }: { title: string; text: string; large?: boolean }) {
  return (
    <div>
      <h2 className={large ? "font-display text-3xl font-black" : "text-xs font-bold uppercase tracking-widest text-primary"}>{title}</h2>
      <p className={large ? "mt-4 text-lg leading-relaxed text-muted-foreground" : "mt-2 font-semibold"}>{text}</p>
    </div>
  );
}
