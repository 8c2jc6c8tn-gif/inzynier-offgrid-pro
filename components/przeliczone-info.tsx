"use client"

import { formatujDate } from "@/lib/i18n/liczby"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"
import type { InfoPrzeliczenia } from "@/lib/adapters/use-persisted-draft"

/** Tells the user that typed amounts were converted after a currency change, and at which rate. */
export function PrzeliczoneInfo({ info }: { info: InfoPrzeliczenia | null }) {
  const t = useTranslate()
  const jezyk = useLanguage()
  if (!info) return null
  const { z, na } = info
  const narzut = na.narzutProc > 0 ? t("UI-WAL-NARZUT-DOPISEK", { narzut: na.narzutProc }) : ""
  const data = na.dataEcb ? formatujDate(new Date(na.dataEcb), jezyk) : ""
  const tekst = na.reczny || !na.dataEcb
    ? t("UI-WAL-PRZELICZONO-RECZNY", { z: z.kod, na: na.kod, narzut })
    : t("UI-WAL-PRZELICZONO-ECB", { z: z.kod, na: na.kod, data, narzut })
  return (
    <p role="status" className="rounded-md border bg-muted/40 px-3 py-2 text-small text-muted-foreground">
      {tekst}
    </p>
  )
}
