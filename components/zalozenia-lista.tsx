"use client"

/**
 * Lista założeń kalkulatora — jedyny komponent, który je renderuje: pod wynikiem (`WynikSzczegoly`,
 * ekran prognoz) i w zakładce „Fizyka” migawki „i” (standard 8.4b: ta sama treść, tym samym
 * komponentem, nigdy przepisana ręcznie). Wydzielona z app/kalkulatory/prognozy/page.tsx
 * (Server Component), bo tłumaczenie (`useTranslate`) działa tylko w Client Components,
 * docs/standards/17-i18n.md 17.4 (korekta offline-first: brak cookie/serwera, więc brak
 * `getServerLanguage()` w Server Components — jedyny taki przypadek w projekcie, patrz docs/memory.md).
 */
import { useTranslate } from "@/lib/i18n/language-context"
import type { Assumption } from "@/lib/core/calc-result"
import { cn } from "@/lib/utils"

export function ZalozeniaLista({ assumptions, className }: { assumptions: Assumption[]; className?: string }) {
  const t = useTranslate()
  return (
    <ul className={cn("text-caption text-muted-foreground", className)}>
      {assumptions.map((a, i) => (
        <li key={typeof a === "string" ? a : a.kod + i}>
          {t("WYNIK-UI-ZALOZENIE")}: {typeof a === "string" ? a : t(a.kod, a.params)}
        </li>
      ))}
    </ul>
  )
}
