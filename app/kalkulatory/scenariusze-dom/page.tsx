"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { PorownanieScenariuszy } from "@/components/siec/porownanie-scenariuszy"
import { useTranslate } from "@/lib/i18n/language-context"

export default function ScenariuszeDomPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/scenariusze-dom" />
      <NaglowekEkranu tytul={t("UI-SCEN-DOM-TYTUL")} ekran="scenariusze-dom">
        {t("UI-SCEN-DOM-OPIS")}
      </NaglowekEkranu>
      <PorownanieScenariuszy segment="dom" />
    </main>
  )
}
