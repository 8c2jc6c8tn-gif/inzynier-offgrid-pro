"use client"

/**
 * Lista założeń kalkulatora — wydzielona z app/kalkulatory/prognozy/page.tsx (Server Component),
 * bo tłumaczenie (`useTranslate`) działa tylko w Client Components, docs/standards/17-i18n.md
 * 17.4 (korekta offline-first: brak cookie/serwera, więc brak `getServerLanguage()` w Server
 * Components — jedyny taki przypadek w projekcie, patrz docs/memory.md).
 */
import { useTranslate } from "@/lib/i18n/language-context"
import type { Assumption } from "@/lib/core/calc-result"

export function ZalozeniaLista({ assumptions }: { assumptions: Assumption[] }) {
  const t = useTranslate()
  return (
    <ul className="text-caption text-muted-foreground">
      {assumptions.map((a, i) => (
        <li key={typeof a === "string" ? a : a.kod + i}>
          Założenie: {typeof a === "string" ? a : t(a.kod, a.params)}
        </li>
      ))}
    </ul>
  )
}
