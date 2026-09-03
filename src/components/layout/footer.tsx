"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n/context";
import { PUBLICATION } from "@/lib/constants";
import { Leaf } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-primary mb-2">
              <Leaf className="h-5 w-5" aria-hidden="true" />
              NusaUrban Observatory
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t.common.tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium text-sm mb-3">{t.nav.explore}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/explore" className="hover:text-foreground transition-colors">{t.nav.explore}</Link></li>
              <li><Link href="/compare" className="hover:text-foreground transition-colors">{t.nav.compare}</Link></li>
              <li><Link href="/methodology" className="hover:text-foreground transition-colors">{t.nav.methodology}</Link></li>
              <li><Link href="/data" className="hover:text-foreground transition-colors">{t.nav.data}</Link></li>
            </ul>
          </div>

          {/* Citation */}
          <div>
            <h3 className="font-medium text-sm mb-3">{t.footer.citation}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {PUBLICATION.authors.join(", ")} ({PUBLICATION.year}).{" "}
              <em>{PUBLICATION.title}</em>.{" "}
              {PUBLICATION.journal}, {PUBLICATION.volume}({PUBLICATION.issue}), {PUBLICATION.pages}.
            </p>
            <a
              href={`https://doi.org/${PUBLICATION.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-1 inline-block"
            >
              DOI: {PUBLICATION.doi}
            </a>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{t.footer.disclaimer}</p>
          <p>
            {t.footer.dataSource}
          </p>
        </div>
      </div>
    </footer>
  );
}
