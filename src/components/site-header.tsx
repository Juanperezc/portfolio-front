"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  FolderKanban,
  Mail,
  Menu,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CvDialog } from "@/components/cv-dialog";
import {
  alternatePath,
  projectsPath,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const pathname = usePathname();
  const home = `/${locale}`;
  const links = [
    { label: dictionary.nav.about, href: `${home}#about`, icon: User },
    { label: dictionary.nav.projects, href: projectsPath(locale), icon: FolderKanban },
    { label: dictionary.nav.experience, href: `${home}#experience`, icon: Briefcase },
    { label: dictionary.nav.contact, href: `${home}#contact`, icon: Mail },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={home} className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">JP</span>
          <span className="hidden font-display text-lg font-black sm:block">Juan Perez</span>
        </Link>

        <div className="hidden items-center gap-0.5 xl:flex">
          {links.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-0.5 rounded-lg border border-border bg-secondary p-1 sm:flex">
            {(["es", "en"] as Locale[]).map((item) => (
              <Button
                key={item}
                asChild
                size="sm"
                variant={locale === item ? "default" : "ghost"}
                className="h-7 px-2.5 text-xs font-bold"
              >
                <Link href={locale === item ? pathname : alternatePath(pathname, locale)}>
                  {item.toUpperCase()}
                </Link>
              </Button>
            ))}
          </div>
          <CvDialog dictionary={dictionary} triggerLabel="CV" triggerClassName="hidden sm:flex" />
          <Button asChild size="sm" className="hidden font-bold sm:flex">
            <Link href={`${home}#contact`}>
              {dictionary.nav.cta}
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label={dictionary.nav.menu}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-80 max-w-[85vw] flex-col gap-0 border-border bg-card p-0">
              <div className="flex items-center gap-2.5 border-b border-border p-6">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">JP</span>
                <span className="font-display text-lg font-black">Juan Perez</span>
              </div>
              <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-4">
                {links.map((link, index) => {
                  const Icon = link.icon;
                  const active = link.href === pathname;
                  return (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        style={{ animationDelay: `${index * 45}ms` }}
                        className={`pop-in group/nav flex items-center gap-3 rounded-xl border px-3 py-2.5 text-base font-medium transition-all duration-200 ${
                          active
                            ? "border-primary/40 bg-primary/10 text-foreground"
                            : "border-transparent text-muted-foreground hover:translate-x-1 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                        }`}
                      >
                        <span
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-primary group-hover/nav:bg-primary group-hover/nav:text-primary-foreground"
                          }`}
                        >
                          <Icon className="size-4" />
                        </span>
                        {link.label}
                        <ArrowRight className="ml-auto size-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover/nav:translate-x-0 group-hover/nav:opacity-100" />
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="space-y-3 border-t border-border p-4">
                <div className="flex items-center gap-2">
                  <CvDialog dictionary={dictionary} triggerLabel="CV" triggerClassName="flex-1" />
                  <div className="flex gap-1 rounded-lg border border-border bg-secondary p-1">
                    {(["es", "en"] as Locale[]).map((item) => (
                      <SheetClose key={item} asChild>
                        <Button asChild size="sm" variant={locale === item ? "default" : "ghost"} className="h-8 px-2.5 text-xs font-bold">
                          <Link href={locale === item ? pathname : alternatePath(pathname, locale)}>
                            {item.toUpperCase()}
                          </Link>
                        </Button>
                      </SheetClose>
                    ))}
                  </div>
                </div>
                <SheetClose asChild>
                  <Button asChild className="w-full font-bold">
                    <Link href={`${home}#contact`}>
                      {dictionary.nav.cta}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
