"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { PorownanieScenariuszy } from "@/components/siec/porownanie-scenariuszy"
import { useTranslate } from "@/lib/i18n/language-context"

export default function ScenariuszeFirmaPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/scenariusze-firma" />
      <NaglowekEkranu tytul={t("UI-SCEN-FIRMA-TYTUL")} ekran="scenariusze-firma">
        {t("UI-SCEN-FIRMA-OPIS")}
      </NaglowekEkranu>
      <PorownanieScenariuszy segment="firma" />
    </main>
  )
}
