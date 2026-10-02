"use client"

import { useTranslate } from "@/lib/i18n/language-context"

/**
 * One translated `UI-*` text (D58) for a module that must stay server-safe — e.g. `components/werdykt.tsx`
 * also exports plain functions that Server Components call, so it cannot become `"use client"` itself.
 * Text only: an attribute value (aria-label, title) still needs `useTranslate()` in a Client Component.
 */
export function TekstUi({ kod, params }: { kod: string; params?: Record<string, string | number> }) {
  const t = useTranslate()
  return <>{t(kod, params)}</>
}
