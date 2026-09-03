"use client";

import { isDatasetValidated } from "@/lib/utils";
import { useTranslation } from "@/i18n/context";
import { AlertTriangle } from "lucide-react";

export function DatasetBanner() {
  const validated = isDatasetValidated();
  const { t } = useTranslation();

  if (validated) return null;

  return (
    <div
      role="status"
      className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-center text-sm text-amber-800 dark:text-amber-200 flex items-center justify-center gap-2"
    >
      <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>{t.common.datasetReconciliationNotice}</span>
    </div>
  );
}
