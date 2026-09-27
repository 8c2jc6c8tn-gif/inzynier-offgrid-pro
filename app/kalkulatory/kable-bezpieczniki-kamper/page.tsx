"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranKabliMalejInstalacji } from "@/components/wzorce/ekran-kabli-malej-instalacji"

export default function KableBezpiecznikiKamperPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kable-bezpieczniki-kamper" />
      <NaglowekEkranu tytul="Kable i bezpieczniki w kamperze">W pojeździe prąd płynie krótkimi trasami, ale często duży — przewód musi go wytrzymać, a bezpiecznik musi go chronić. Moduł 12.</NaglowekEkranu>
      <EkranKabliMalejInstalacji kluczSzkicu="kable-bezpieczniki-kamper" pojazd={true} />
    </main>
  )
}
