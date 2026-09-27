"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranKabliMalejInstalacji } from "@/components/wzorce/ekran-kabli-malej-instalacji"

export default function KableBezpiecznikiMalePage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kable-bezpieczniki-male" />
      <NaglowekEkranu tytul="Kabel i bezpiecznik dla małej instalacji">Nawet mały zestaw solarny rządzi się tą samą fizyką co duża instalacja — tylko liczby są mniejsze. Moduł 12.</NaglowekEkranu>
      <EkranKabliMalejInstalacji kluczSzkicu="kable-bezpieczniki-male" pojazd={false} />
    </main>
  )
}
