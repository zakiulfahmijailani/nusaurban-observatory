"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, useLanguage } from "@/i18n/context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Globe, Menu, X, Leaf } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/explore", key: "explore" as const },
  { href: "/compare", key: "compare" as const },
  { href: "/methodology", key: "methodology" as const },
  { href: "/data", key: "data" as const },
  { href: "/about", key: "about" as const },
];

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMapPage = pathname === "/explore" || pathname === "/compare";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isMapPage && "shadow-sm"
      )}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <Leaf className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">NusaUrban</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "id" : "en")}
            className="text-xs gap-1"
            aria-label={`Switch to ${language === "en" ? "Bahasa Indonesia" : "English"}`}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            {language === "en" ? "ID" : "EN"}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="md:hidden border-t border-border bg-background px-4 py-2"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2 text-sm rounded-md transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
