"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { PorownywarkaTaryf } from "@/components/siec/porownywarka-taryf"

export default function TaryfaGPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/taryfa-g" />
      <NaglowekEkranu tytul="Która taryfa G" ekran="taryfa-g">
        Porównaj roczny koszt w G11, G12 i G12w dla tego samego zużycia. Opłaca się taryfa, której strefy pasują do tego,
        kiedy naprawdę zużywasz prąd. M14 „Dom – sieć”, ekran D2.
      </NaglowekEkranu>
      <PorownywarkaTaryf segment="dom" />
    </main>
  )
}
