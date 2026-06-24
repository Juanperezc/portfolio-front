import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { projectPath, type Dictionary, type Locale } from "@/lib/i18n";

export function ProjectsPage({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <main className="dot-grid min-h-screen overflow-x-hidden pt-16">
      <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
          {dictionary.projectsPage.tag}
        </Badge>
        <h1 className="mt-5 max-w-4xl break-words font-display text-4xl font-black sm:text-6xl">
          {dictionary.projectsPage.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {dictionary.projectsPage.description}
        </p>

        <div className="mt-16 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
          {dictionary.projects.map((project) => (
            <Card key={project.slug} className="card-glow w-full min-w-0 max-w-full overflow-hidden border-border bg-card">
              <div className="h-1" style={{ background: project.gradient }} />
              <div className="relative aspect-[12/6.5] overflow-hidden border-b border-border bg-background">
                <Image
                  src={project.image}
                  alt={`${project.name} website`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
              </div>
              <CardContent className="flex min-h-80 flex-col justify-between p-7">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <Badge style={{ background: `${project.accent}18`, color: project.accent }}>
                      {project.number}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{project.year}</span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: project.accent }}>
                    {project.category}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-black">{project.name}</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{project.summary}</p>
                </div>
                <div className="mt-8">
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-mono text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild>
                      <Link href={projectPath(locale, project.slug)}>
                        {dictionary.common.viewProject}
                        <ArrowRight />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" aria-label={dictionary.common.visitWebsite}>
                      <a href={project.url} target="_blank" rel="noreferrer">
                        <ExternalLink />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
