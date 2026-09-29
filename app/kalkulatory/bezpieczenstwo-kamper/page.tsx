"use client"

import { calculateBezpieczenstwoKamper } from "@/lib/core/modules/kalkulator-mobilny/bezpieczenstwo-kamper/calculator"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranChecklistyChemii } from "@/components/wzorce/ekran-checklisty-chemii"

export default function BezpieczenstwoKamperPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bezpieczenstwo-kamper" />
      <NaglowekEkranu tytul="Bezpieczeństwo w kamperze" ekran="bezpieczenstwo-kamper">Akumulator to ciężki i niebezpieczny pasażer — musi być odpowiednio zabezpieczony. Moduł 12.</NaglowekEkranu>
      <EkranChecklistyChemii kluczSzkicu="bezpieczenstwo-kamper" oblicz={calculateBezpieczenstwoKamper} etykietaGotowe="Akumulator bezpiecznie zamontowany" />
    </main>
  )
}
