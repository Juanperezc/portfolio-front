"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Dictionary } from "@/lib/i18n";

type CvDialogProps = {
  dictionary: Dictionary;
  triggerLabel?: string;
  triggerVariant?: "default" | "outline" | "ghost";
  triggerClassName?: string;
};

export function CvDialog({
  dictionary,
  triggerLabel,
  triggerVariant = "ghost",
  triggerClassName,
}: CvDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={triggerClassName}>
          <Download className="size-4" />
          {triggerLabel ?? dictionary.common.downloadCv}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{dictionary.cv.title}</DialogTitle>
          <DialogDescription>{dictionary.cv.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Button asChild size="lg" className="h-12 w-full font-bold">
            <a href="/portfolio-assets/CV_Juan_Perez_ES.pdf" download>
              <span className="text-lg">🇪🇸</span>
              {dictionary.cv.spanish}
              <Download className="ml-auto size-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 w-full font-bold">
            <a href="/portfolio-assets/CV_Juan_Perez_EN.pdf" download>
              <span className="text-lg">🇺🇸</span>
              {dictionary.cv.english}
              <Download className="ml-auto size-4" />
            </a>
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">{dictionary.cv.note}</p>
      </DialogContent>
    </Dialog>
  );
}
