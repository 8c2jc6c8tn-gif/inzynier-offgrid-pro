"use client"

import {
  CZYNNIKI,
  OSTRZEZENIE,
  PRZYKLAD_ILUSTRACYJNY,
  ZALECENIA,
} from "@/lib/core/modules/ogrzewanie/halas-i-wibracje/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WerdyktPanel } from "@/components/werdykt"
import { useTranslate } from "@/lib/i18n/language-context"

export default function HalasIWibracjePage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/halas-i-wibracje" />
      <NaglowekEkranu tytul={t("UI-HALIWIB-HALAS-WIBRACJE-POMPY")} ekran="halas-i-wibracje">
        {t("UI-HALIWIB-MODUL-CZESC-TRESC")}
      </NaglowekEkranu>

      <WerdyktPanel poziom="uwaga" etykieta={t("UI-HALIWIB-SPRAWDZ-LOKALNA-NORME")}>
        <p className="mt-1 text-small">{OSTRZEZENIE}</p>
      </WerdyktPanel>

      <div>
        <h2 className="mb-2 text-small font-semibold">{t("UI-HALIWIB-CZYNNIKI-WPLYWAJACE-HALAS")}</h2>
        <ul className="flex flex-col gap-2">
          {CZYNNIKI.map((czynnik) => (
            <li key={czynnik.id} className="rounded-md border p-3 text-small">
              <p className="font-medium">{czynnik.etykieta}</p>
              <p className="text-caption text-muted-foreground">{t("UI-HALIWIB-ZRODLO-DANYCH", { zrodlo: czynnik.zrodlo })}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 text-small">
        <p className="font-medium">{t("UI-HALIWIB-PRZYKLAD-ILUSTRACYJNY")}</p>
        <p className="mt-1 text-muted-foreground">{PRZYKLAD_ILUSTRACYJNY}</p>
      </div>

      <div>
        <h2 className="mb-2 text-small font-semibold">{t("UI-HALIWIB-ZALECENIA")}</h2>
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
