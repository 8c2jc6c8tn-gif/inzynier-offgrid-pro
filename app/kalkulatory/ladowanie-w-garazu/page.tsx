"use client"

import { calculateLadowanieWGarazu } from "@/lib/core/modules/kalkulator-mobilny/ladowanie-w-garazu/calculator"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranChecklistyChemii } from "@/components/wzorce/ekran-checklisty-chemii"
import { useTranslate } from "@/lib/i18n/language-context"

export default function LadowanieWGarazuPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ladowanie-w-garazu" />
      <NaglowekEkranu tytul={t("UI-LADWGAR-BEZPIECZNE-LADOWANIE-GARAZU")} ekran="ladowanie-w-garazu">{t("UI-LADWGAR-WODOR-CICHY-ZABOJCA")}</NaglowekEkranu>
      <EkranChecklistyChemii kluczSzkicu="ladowanie-w-garazu" oblicz={calculateLadowanieWGarazu} etykietaGotowe={t("UI-LADWGAR-LADOWANIE-MOZNA-ZACZYNAC")} />
    </main>
  )
}
