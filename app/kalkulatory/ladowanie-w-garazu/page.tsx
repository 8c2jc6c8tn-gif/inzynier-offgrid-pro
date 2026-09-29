"use client"

import { calculateLadowanieWGarazu } from "@/lib/core/modules/kalkulator-mobilny/ladowanie-w-garazu/calculator"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranChecklistyChemii } from "@/components/wzorce/ekran-checklisty-chemii"

export default function LadowanieWGarazuPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ladowanie-w-garazu" />
      <NaglowekEkranu tytul="Bezpieczne ładowanie w garażu" ekran="ladowanie-w-garazu">Wodór to cichy zabójca — wentylacja to Twój ochroniarz. Moduł 12.</NaglowekEkranu>
      <EkranChecklistyChemii kluczSzkicu="ladowanie-w-garazu" oblicz={calculateLadowanieWGarazu} etykietaGotowe="Ładowanie można zaczynać" />
    </main>
  )
}
