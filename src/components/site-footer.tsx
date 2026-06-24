import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CvDialog } from "@/components/cv-dialog";
import { projectPath, projectsPath, type Dictionary, type Locale } from "@/lib/i18n";

export function SiteFooter({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">JP</span>
              <span className="font-display font-black">Juan Perez</span>
            </div>
            <p className="text-sm text-muted-foreground">{dictionary.footer.tagline}</p>
            <div className="flex gap-2">
              {[
                [Github, "https://github.com/Juanperezc", "GitHub", "#F8FAFC"],
                [Linkedin, "https://www.linkedin.com/in/juan-perez-c", "LinkedIn", "#0A66C2"],
                [Mail, "mailto:juanluisperezc1996@gmail.com", "Email", "#EA4335"],
              ].map(([Icon, href, label, color]) => (
                <Button key={String(label)} asChild variant="outline" size="icon" className="size-8" style={{ borderColor: `${color}66`, color: String(color) }}>
                  <a href={String(href)} aria-label={String(label)} target="_blank" rel="noreferrer">
                    <Icon className="size-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          <FooterColumn
            title={dictionary.footer.portfolio}
            links={[
              [dictionary.nav.about, `/${locale}#about`],
              [dictionary.nav.skills, `/${locale}#skills`],
              [dictionary.nav.services, `/${locale}#services`],
              [dictionary.nav.experience, `/${locale}#experience`],
            ]}
          />
          <FooterColumn
            title={dictionary.footer.projects}
            links={dictionary.projects.slice(0, 4).map((project) => [
              project.name,
              projectPath(locale, project.slug),
            ])}
          />
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{dictionary.footer.contact}</h2>
            <Link className="block text-sm text-muted-foreground hover:text-primary" href={projectsPath(locale)}>
              {dictionary.projectsPage.title}
            </Link>
            <a className="block text-sm text-muted-foreground hover:text-primary" href="mailto:juanluisperezc1996@gmail.com">
              juanluisperezc1996@gmail.com
            </a>
            <CvDialog dictionary={dictionary} triggerClassName="h-auto justify-start p-0 text-primary" />
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Juan Luis Perez. {dictionary.footer.rights}
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link className="text-sm text-muted-foreground hover:text-primary" href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
