"use client"

import Link from "next/link"
import { znajdzKafelIEkranPoHref } from "@/lib/pulpit/registry"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * Przycisk "Wstecz" + okruszki (Pulpit / Moduł / Ekran) — docs/standards/08-ui-ux.md, 8.7:
 * "Przycisk Wstecz zawsze w tym samym miejscu... Okruszki pokazujące pozycję w strukturze
 * modułów." Jeden komponent, każdy ekran przekazuje własny `href` (ten sam co jego route) —
 * nie `usePathname()`, żeby nie wymuszać "use client" na ekranach, które go nie potrzebują.
 */
export function NawigacjaEkranu({ href }: { href: string }) {
  const t = useTranslate()
  const wynik = znajdzKafelIEkranPoHref(href)
  const wstecz = wynik ? `/moduly/${wynik.kafel.id}` : "/"

  return (
    <div className="flex flex-col gap-1">
      <Link href={wstecz} className="w-fit text-sm text-muted-foreground hover:text-foreground hover:underline">
        {t("UI-NAWEKR-WSTECZ")}
      </Link>
      <nav aria-label={t("UI-NAWEKR-OKRUSZKI")} className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground hover:underline">
          {t("UI-NAWEKR-PULPIT")}
        </Link>
        {wynik && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={wstecz} className="hover:text-foreground hover:underline">
              {wynik.kafel.nazwa}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{wynik.ekran.label}</span>
          </>
        )}
      </nav>
    </div>
  )
}
