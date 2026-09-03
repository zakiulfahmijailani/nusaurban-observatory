"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/i18n/context";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <TooltipProvider delayDuration={300}>
        {children}
      </TooltipProvider>
    </LanguageProvider>
  );
}
