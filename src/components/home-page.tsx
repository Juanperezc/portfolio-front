"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  CreditCard,
  Github,
  HeartHandshake,
  Languages,
  Layout,
  Layers,
  Loader2,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Plane,
  Rocket,
  Scale,
  Server,
  Shield,
  Users,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CvDialog } from "@/components/cv-dialog";
import {
  blogPath,
  blogPostPath,
  projectPath,
  projectsPath,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

const techBadges = ["Laravel", "React", "Next.js", "TypeScript", "Node.js", "Redis", "AWS", "GCP", "MySQL", "Docker", "Vue.js", "Tailwind CSS"];
const skillIcons = { frontend: Layout, backend: Server, cloud: Cloud, product: Layers, tools: Wrench, soft: HeartHandshake, languages: Languages };
const serviceIcons = [Package, Plane, Calendar, BarChart3, Bot, Workflow, CreditCard, Layout, Rocket, Code2, Building2, Zap, Scale, CheckCircle2, Shield, Users];
const socialLinks = [
  { icon: Github, label: "GitHub", value: "github.com/Juanperezc", href: "https://github.com/Juanperezc", color: "#F8FAFC" },
  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/juan-perez-c", href: "https://www.linkedin.com/in/juan-perez-c", color: "#0A66C2" },
  { icon: Mail, label: "Email", value: "juanluisperezc1996@gmail.com", href: "mailto:juanluisperezc1996@gmail.com", color: "#EA4335" },
] as const;

// Fotos de viajes para el collage del about. El `gradient` es fallback si falta una imagen.
const aboutGallery: { src: string; alt: string; span: string; gradient: string }[] = [
  { src: "/portfolio-assets/about/1-santorini.webp", alt: "Juan Perez en Santorini, Grecia", span: "col-span-2 row-span-2", gradient: "linear-gradient(135deg,#0369A1,#38BDF8)" },
  { src: "/portfolio-assets/about/2-budapest.webp", alt: "Juan Perez en Budapest, Hungría", span: "", gradient: "linear-gradient(135deg,#065F46,#34D399)" },
  { src: "/portfolio-assets/about/3-rome.webp", alt: "Juan Perez en el Coliseo de Roma, Italia", span: "", gradient: "linear-gradient(135deg,#5B21B6,#A78BFA)" },
  { src: "/portfolio-assets/about/4-alicante.webp", alt: "Juan Perez en Alicante, España", span: "", gradient: "linear-gradient(135deg,#92400E,#F59E0B)" },
  { src: "/portfolio-assets/about/5-sofia.webp", alt: "Juan Perez en Sofía, Bulgaria", span: "", gradient: "linear-gradient(135deg,#0E7490,#22D3EE)" },
];

type BlogTeaser = {
  slug: string;
  title: string;
  description: string;
  category: string | null;
  date: string;
  cover: string | null;
};

export function HomePage({
  locale,
  dictionary,
  latestPosts,
}: {
  locale: Locale;
  dictionary: Dictionary;
  latestPosts: BlogTeaser[];
}) {
  const [slide, setSlide] = useState(0);
  const [experiencePage, setExperiencePage] = useState(0);
  const [showAllServices, setShowAllServices] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const featured = dictionary.projects.slice(0, 3);
  const visibleExperience = dictionary.experience.items.slice(experiencePage * 4, experiencePage * 4 + 4);
  const experiencePageCount = Math.ceil(dictionary.experience.items.length / 4);
  const visibleServices = showAllServices ? dictionary.services.items : dictionary.services.items.slice(0, 8);
  const activeProject = featured[slide];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("request failed");
      form.reset();
      setStatus("sent");
      window.setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="overflow-x-hidden">
      <section id="hero" className="dot-grid relative flex min-h-screen items-center overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 size-96 rounded-full bg-sky-400/20 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 size-80 rounded-full bg-emerald-400/15 blur-[100px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-3 rounded-full border-2 border-green-500/45 bg-green-500/10 px-5 py-2.5">
              <span className="size-2.5 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm font-black text-green-400">{dictionary.hero.badge}</span>
              <span className="text-green-600">·</span>
              <span className="text-xs text-green-400/80">{dictionary.hero.badgeSub}</span>
            </div>
            <div>
              <h1 className="hero-gradient font-display text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
                {dictionary.hero.title}
              </h1>
              <p className="mt-3 font-display text-xl font-semibold leading-snug text-primary sm:text-2xl">
                {dictionary.hero.role}
              </p>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{dictionary.hero.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-bold glow-sky">
                <Link href={projectsPath(locale)}>{dictionary.hero.primary}<ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-bold">
                <Link href={`/${locale}#contact`}>{dictionary.hero.secondary}</Link>
              </Button>
              <CvDialog dictionary={dictionary} triggerLabel={dictionary.hero.download} />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {techBadges.map((technology) => (
                <Badge key={technology} variant="outline" className="font-mono text-xs text-muted-foreground">{technology}</Badge>
              ))}
            </div>
          </div>
          <CodeVisual dictionary={dictionary} />
        </div>
      </section>

      <section id="about" className="py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <SectionBadge>{dictionary.about.tag}</SectionBadge>
            <h2 className="font-display text-4xl font-black lg:text-5xl">{dictionary.about.title}</h2>
            {dictionary.about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-muted-foreground">{paragraph}</p>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, label, href, color }) => (
                <Button key={label} asChild size="sm" variant="outline" className="bg-card/50 font-semibold hover:bg-card" style={{ borderColor: `${color}66`, color }}>
                  <a href={href} target="_blank" rel="noreferrer"><Icon className="size-4" />{label}</a>
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {dictionary.about.cards.map((item, index) => {
              const Icon = [Code2, Layers, Plane][index];
              const color = ["#38BDF8", "#34D399", "#A78BFA"][index];
              return (
                <Card key={item.title} className="card-glow border-border bg-card">
                  <CardContent className="flex items-start gap-4 p-6">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                      <Icon className="size-5" style={{ color }} />
                    </span>
                    <div>
                      <h3 className="font-display font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:mt-16 lg:px-8">
          <div className="grid auto-rows-[8.5rem] grid-cols-2 gap-3 sm:auto-rows-[10rem] sm:grid-cols-4">
            {aboutGallery.map((tile, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 60}ms` }}
                className={`pop-in group/ph relative overflow-hidden rounded-2xl border border-border ${tile.span}`}
              >
                {tile.src ? (
                  <Image src={tile.src} alt={tile.alt} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover/ph:scale-105" />
                ) : (
                  <span className="absolute inset-0" style={{ background: tile.gradient }} />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/ph:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="dot-grid py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <SectionBadge>{dictionary.featured.tag}</SectionBadge>
              <h2 className="font-display text-4xl font-black lg:text-5xl">{dictionary.featured.title}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground"><strong className="text-foreground">0{slide + 1}</strong> / 0{featured.length}</span>
              <Button variant="outline" size="icon" onClick={() => setSlide((slide - 1 + featured.length) % featured.length)} aria-label={dictionary.common.previous}><ChevronLeft /></Button>
              <Button variant="outline" size="icon" onClick={() => setSlide((slide + 1) % featured.length)} aria-label={dictionary.common.next}><ChevronRight /></Button>
              <Button asChild variant="ghost" className="hidden text-primary sm:flex">
                <Link href={projectsPath(locale)}>{dictionary.common.viewAll}<ChevronRight /></Link>
              </Button>
            </div>
          </div>
          <ProjectFeature locale={locale} dictionary={dictionary} project={activeProject} />
        </div>
      </section>

      <section id="skills" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
            <SectionBadge>{dictionary.skills.tag}</SectionBadge>
            <h2 className="font-display text-4xl font-black lg:text-5xl">{dictionary.skills.title}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{dictionary.skills.description}</p>
          </div>
          <Tabs defaultValue="frontend" className="mx-auto max-w-6xl">
            <TabsList className="mx-auto mb-8 grid h-auto w-full max-w-3xl grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-2 lg:grid-cols-4">
              {dictionary.skills.groups.map((group) => {
                const Icon = skillIcons[group.key as keyof typeof skillIcons];
                return (
                  <TabsTrigger
                    key={group.key}
                    value={group.key}
                    className="group/tab gap-2 rounded-xl py-3 font-semibold transition-all duration-200 hover:bg-primary/10 hover:text-foreground data-[state=active]:scale-[1.02] data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-sky-400 data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_6px_22px_-4px_rgba(56,189,248,.55)] data-[state=active]:[&_svg]:scale-110"
                  >
                    <Icon className="transition-transform duration-200 group-hover/tab:scale-110" />
                    {group.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {dictionary.skills.groups.map((group) => (
              <TabsContent key={group.key} value={group.key} className="focus-visible:outline-none">
                <Card className="overflow-hidden border-border bg-card">
                  <div className="h-1 bg-gradient-to-r from-primary via-accent to-purple-400" />
                  <CardContent className="p-6 sm:p-8">
                    <div className="grid gap-4 md:grid-cols-2">
                      {group.items.map(([name, level, customLabel], index) => {
                        const numericLevel = Number(level);
                        const top = index < 2;
                        const label = customLabel
                          ? String(customLabel)
                          : numericLevel >= 92
                            ? dictionary.skills.primaryLabel
                            : numericLevel >= 85
                              ? dictionary.skills.advancedLabel
                              : dictionary.skills.workingLabel;
                        return (
                          <div
                            key={String(name)}
                            className={`group/skill pop-in flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_10px_28px_-14px_rgba(56,189,248,.6)] ${top ? "border-primary/25 bg-primary/[0.04]" : "border-border bg-background/40"}`}
                            style={{ animationDelay: `${index * 45}ms` }}
                          >
                            <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-black transition-transform duration-200 group-hover/skill:scale-110 ${top ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" : "bg-secondary text-primary"}`}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <strong className="truncate font-display text-base">{name}</strong>
                                <span className="shrink-0 font-mono text-xs font-bold text-primary">{numericLevel}%</span>
                              </div>
                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                                <div
                                  className="grow-bar h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                  style={{ "--lvl": `${numericLevel}%`, animationDelay: `${index * 45}ms` } as React.CSSProperties}
                                />
                              </div>
                              <span className="mt-1.5 block text-xs text-muted-foreground">{label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section id="services" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <SectionBadge accent>{dictionary.services.tag}</SectionBadge>
            <h2 className="font-display text-4xl font-black lg:text-5xl">{dictionary.services.title}</h2>
          </div>
          <TooltipProvider>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleServices.map(([service, detail], index) => {
                const Icon = serviceIcons[index];
                return (
                  <Tooltip key={service}>
                    <TooltipTrigger asChild>
                      <Card
                        tabIndex={0}
                        className="card-glow group/srv cursor-default border-border bg-card outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <CardContent className="flex items-start gap-3 p-5">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary transition-colors duration-200 group-hover/srv:bg-primary">
                            <Icon className="size-4 text-primary transition-colors duration-200 group-hover/srv:text-primary-foreground" />
                          </span>
                          <span className="pt-0.5 text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover/srv:text-foreground">{service}</span>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>{detail}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
          {!showAllServices && (
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => setShowAllServices(true)}>{dictionary.services.showAll}<ChevronDown /></Button>
            </div>
          )}
        </div>
      </section>

      <section id="experience" className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4 text-center">
            <SectionBadge>{dictionary.experience.tag}</SectionBadge>
            <h2 className="font-display text-4xl font-black lg:text-5xl">{dictionary.experience.title}</h2>
          </div>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {experiencePage + 1} / {experiencePageCount}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={experiencePage === 0}
                onClick={() => setExperiencePage((page) => Math.max(0, page - 1))}
              >
                <ChevronLeft />{dictionary.common.previous}
              </Button>
              <Button
                variant="outline"
                disabled={experiencePage === experiencePageCount - 1}
                onClick={() => setExperiencePage((page) => Math.min(experiencePageCount - 1, page + 1))}
              >
                {dictionary.common.next}<ChevronRight />
              </Button>
            </div>
          </div>
          <div className="space-y-5">
            {visibleExperience.map((item) => (
              <Card key={`${item.company}-${item.role}`} className="card-glow border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-bold">{item.role}</h3>
                        <span className="font-semibold text-primary">@ {item.company}</span>
                        {item.badge && <Badge>{item.badge}</Badge>}
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{item.location} · {item.type}</p>
                    </div>
                    <Badge variant="outline" className="self-start font-mono text-primary">{item.period}</Badge>
                  </div>
                  <p className="my-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  {item.highlight && <p className="mb-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">📊 {item.highlight}</p>}
                  <div className="flex flex-wrap gap-1.5">{item.tags.map((tag) => <Badge key={tag} variant="secondary" className="font-mono text-xs">{tag}</Badge>)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section id="blog" className="dot-grid py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <SectionBadge>{dictionary.blog.tag}</SectionBadge>
                <h2 className="font-display text-4xl font-black lg:text-5xl">{dictionary.blog.title}</h2>
              </div>
              <Button asChild variant="ghost" className="hidden text-primary sm:flex">
                <Link href={blogPath(locale)}>{dictionary.blog.all}<ChevronRight /></Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.slug} href={blogPostPath(locale, post.slug)} className="card-glow group/post flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative aspect-[16/10] overflow-hidden bg-background">
                    {post.cover ? (
                      <Image src={post.cover} alt={post.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover/post:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    )}
                    {post.category && <Badge className="absolute left-3 top-3 bg-background/80 text-foreground backdrop-blur">{post.category}</Badge>}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {post.date && <span className="text-xs uppercase tracking-wider text-muted-foreground">{post.date}</span>}
                    <h3 className="mt-2 font-display text-xl font-bold leading-snug transition-colors group-hover/post:text-primary">{post.title}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">{dictionary.blog.readMore}<ArrowRight className="size-4 transition-transform group-hover/post:translate-x-1" /></span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button asChild variant="outline"><Link href={blogPath(locale)}>{dictionary.blog.all}<ChevronRight /></Link></Button>
            </div>
          </div>
        </section>
      )}

      <ContactSection dictionary={dictionary} onSubmit={submit} status={status} />
    </main>
  );
}

function SectionBadge({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return <Badge variant="outline" className={accent ? "border-accent/40 bg-accent/5 text-accent" : "border-primary/40 bg-primary/5 text-primary"}><span className="size-1 rounded-full bg-current" />{children}</Badge>;
}

function CodeVisual({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div className="relative hidden items-center justify-center lg:flex">
      <div className="relative w-full max-w-md">
        <Card className="float overflow-hidden border-sky-400/20 bg-[#1E1E2E] glow-sky">
          <div className="flex items-center gap-2 border-b border-white/5 bg-[#15151F] px-4 py-3">
            <span className="size-3 rounded-full bg-red-400/80" /><span className="size-3 rounded-full bg-yellow-400/80" /><span className="size-3 rounded-full bg-emerald-400/80" />
            <span className="flex-1 text-center font-mono text-xs text-slate-500">{dictionary.hero.codeFile}</span>
          </div>
          <CardContent className="space-y-1.5 p-5 font-mono text-sm">
            <p><span className="text-purple-400">const</span> <span className="text-blue-300">BookingEngine</span> = <span className="text-purple-400">async</span> (</p>
            <p className="pl-4"><span className="text-cyan-300">query</span>: FlightQuery) =&gt; {"{"}</p>
            <p className="pl-6"><span className="text-purple-400">const</span> <span className="text-blue-300">providers</span> = await</p>
            <p className="pl-10 text-emerald-300">fetchGDS(query);</p>
            <p className="pl-6"><span className="text-purple-400">return</span> <span className="text-emerald-300">optimizeResults</span>(providers);</p>
            <p>{"}"}</p><p className="text-slate-600">{dictionary.hero.codeComment}</p>
          </CardContent>
        </Card>
        <Card className="float-d absolute -right-6 -top-6 border-sky-400/25 bg-card p-4 glow-sky">
          <p className="text-xs text-muted-foreground">↗ FlightEpic</p><strong className="font-display text-2xl">1M+</strong><p className="text-xs text-primary">{dictionary.hero.bookings}</p>
        </Card>
        <Card className="float-d2 absolute -bottom-6 -left-6 border-emerald-400/25 bg-card p-4 glow-em">
          <p className="flex items-center gap-2 text-sm font-bold"><Scale className="size-4 text-accent" />Nexo Abogados</p><p className="mt-1 text-xs text-accent">{dictionary.hero.lawyers}</p>
        </Card>
      </div>
    </div>
  );
}

function ProjectFeature({ locale, dictionary, project }: { locale: Locale; dictionary: Dictionary; project: Dictionary["projects"][number] }) {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <div className="h-1" style={{ background: project.gradient }} />
      <div className="grid min-h-[500px] lg:grid-cols-2">
        <CardContent className="flex flex-col justify-between gap-8 p-8 lg:p-12">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3"><Badge style={{ background: `${project.accent}18`, color: project.accent }}>{project.number}</Badge><span className="text-xs uppercase tracking-widest text-muted-foreground">{project.category}</span><span className="text-xs text-muted-foreground">{project.year}</span></div>
            <h3 className="font-display text-4xl font-black lg:text-5xl">{project.name}</h3>
            <p className="leading-relaxed text-muted-foreground">{project.summary}</p>
            <div className="grid grid-cols-3 gap-3">{project.metrics.map(([value, label]) => <div key={label} className="rounded-xl p-3 text-center" style={{ background: `${project.accent}10`, border: `1px solid ${project.accent}20` }}><strong className="font-display text-xl">{value}</strong><p className="text-xs text-muted-foreground">{label}</p></div>)}</div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">{project.tags.map((tag) => <Badge key={tag} variant="secondary" className="font-mono text-xs">{tag}</Badge>)}</div>
            <Button asChild><Link href={projectPath(locale, project.slug)}>{dictionary.common.viewProject}<ArrowRight /></Link></Button>
          </div>
        </CardContent>
        <div className="hidden items-center justify-center overflow-hidden border-l border-border bg-background p-8 lg:flex">
          <div className="relative aspect-[12/8] w-full overflow-hidden rounded-xl border border-border shadow-2xl">
            <div className="absolute inset-x-0 top-0 z-10 flex h-8 items-center gap-1.5 border-b border-white/10 bg-slate-950/90 px-3">
              <span className="size-2 rounded-full bg-red-400" />
              <span className="size-2 rounded-full bg-yellow-400" />
              <span className="size-2 rounded-full bg-emerald-400" />
              <span className="ml-3 truncate font-mono text-[10px] text-slate-400">{project.url.replace("https://", "")}</span>
            </div>
            <Image src={project.image} alt={`${project.name} website`} fill sizes="50vw" className="object-cover object-top pt-8" />
          </div>
        </div>
      </div>
    </Card>
  );
}

type FormStatus = "idle" | "sending" | "sent" | "error";

function ContactSection({ dictionary, onSubmit, status }: { dictionary: Dictionary; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; status: FormStatus }) {
  return (
    <section id="contact" className="dot-grid py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center">
          <Badge variant="outline" className="border-green-500/35 bg-green-500/10 px-5 py-2.5 text-green-400"><span className="size-2.5 animate-pulse rounded-full bg-green-500" />{dictionary.contact.badge} · {dictionary.contact.availability}</Badge>
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-black lg:text-5xl">{dictionary.contact.title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{dictionary.contact.description}</p>
        </div>
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-2">
            <Card className="card-glow border-primary/30 bg-primary/5">
              <CardContent className="space-y-4 p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15">
                  <CalendarDays className="size-5 text-primary" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{dictionary.contact.scheduleTitle}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {dictionary.contact.scheduleDescription}
                  </p>
                </div>
                <Button asChild className="w-full font-bold">
                  <a
                    href="https://calendly.com/juanluisperezc1996/30min"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {dictionary.contact.scheduleCta}
                    <CalendarDays />
                  </a>
                </Button>
              </CardContent>
            </Card>
            {[
              ...socialLinks,
              { icon: MessageCircle, label: "WhatsApp", value: "+54 9 11 7621-1508", href: "https://wa.me/5491176211508", color: "#25D366" },
            ].map(({ icon: Icon, label, value, href, color }) => (
              <Card key={label} className="card-glow bg-card" style={{ borderColor: `${color}45` }}>
                <CardContent className="p-4">
                  <a href={href} className="flex items-center gap-4" target="_blank" rel="noreferrer">
                    <span className="flex size-10 items-center justify-center rounded-xl" style={{ background: `${color}18` }}>
                      <Icon className="size-5" style={{ color }} />
                    </span>
                    <span className="min-w-0">
                      <small className="block uppercase tracking-wider text-muted-foreground">{label}</small>
                      <strong className="block truncate text-sm">{value}</strong>
                    </span>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-border bg-card lg:col-span-3">
            <CardContent className="p-8">
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={dictionary.contact.name}><Input name="name" required placeholder={dictionary.contact.namePlaceholder} /></Field>
                  <Field label={dictionary.contact.email}><Input name="email" type="email" required placeholder={dictionary.contact.emailPlaceholder} /></Field>
                  <Field label={dictionary.contact.company}><Input name="company" placeholder={dictionary.contact.companyPlaceholder} /></Field>
                  <Field label={dictionary.contact.projectType}>
                    <Select name="projectType">
                      <SelectTrigger>
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {dictionary.contact.options.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field label={dictionary.contact.message}><Textarea name="message" required rows={4} placeholder={dictionary.contact.messagePlaceholder} /></Field>
                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                <Button type="submit" size="lg" disabled={status === "sending"} className="w-full font-bold">
                  {status === "sending" ? (
                    <><Loader2 className="animate-spin" />{dictionary.contact.sending}</>
                  ) : status === "sent" ? (
                    <><Check />{dictionary.contact.sent}</>
                  ) : (
                    <>{dictionary.contact.send}<ArrowRight /></>
                  )}
                </Button>
                {status === "error" && (
                  <p role="alert" className="text-center text-sm text-red-400">{dictionary.contact.error}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>{children}</div>;
}
