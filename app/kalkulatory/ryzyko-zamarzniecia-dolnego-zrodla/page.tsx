"use client"

import {
  CZYNNIKI_RYZYKA,
  PRZYKLAD_ILUSTRACYJNY,
  TWARDY_STOP,
  ZALECENIA,
} from "@/lib/core/modules/ogrzewanie/ryzyko-zamarzniecia-dolnego-zrodla/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WerdyktPanel } from "@/components/werdykt"
import { useTranslate } from "@/lib/i18n/language-context"

export default function RyzykoZamarznieciaDolnegoZrodlaPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ryzyko-zamarzniecia-dolnego-zrodla" />
      <NaglowekEkranu tytul={t("UI-RYZZAMDOLZRO-RYZYKO-ZAMARZNIECIA-DOLNEGO")} ekran="ryzyko-zamarzniecia-dolnego-zrodla">
        {t("UI-RYZZAMDOLZRO-DLUZSZA-PRACA-CIAGLA")}
      </NaglowekEkranu>

      <WerdyktPanel poziom="blad" etykieta={t("UI-RYZZAMDOLZRO-TWARDY-STOP")}>
        <p className="mt-1 text-small">{TWARDY_STOP}</p>
      </WerdyktPanel>

      <div>
        <h2 className="mb-2 text-small font-semibold">{t("UI-RYZZAMDOLZRO-CZYNNIKI-RYZYKA")}</h2>
        <ul className="flex flex-col gap-2">
          {CZYNNIKI_RYZYKA.map((czynnik) => (
            <li key={czynnik.id} className="rounded-md border p-3 text-small">
              <p className="font-medium">{czynnik.etykieta}</p>
              <p className="text-caption text-muted-foreground">{t("UI-RYZZAMDOLZRO-ZRODLO-DANYCH", { zrodlo: czynnik.zrodlo })}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 text-small">
        <p className="font-medium">{t("UI-RYZZAMDOLZRO-PRZYKLAD-ILUSTRACYJNY")}</p>
        <p className="mt-1 text-muted-foreground">{PRZYKLAD_ILUSTRACYJNY}</p>
      </div>

      <div>
        <h2 className="mb-2 text-small font-semibold">{t("UI-RYZZAMDOLZRO-ZALECENIA")}</h2>
        <ul className="flex flex-col gap-2">
          {ZALECENIA.map((zalecenie) => (
            <li key={zalecenie} className="text-small text-muted-foreground">
              • {zalecenie}
            </li>
          ))}
        </ul>
      </div>

      
    </main>
  )
}
