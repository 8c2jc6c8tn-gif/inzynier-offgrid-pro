"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { PorownywarkaTaryf } from "@/components/siec/porownywarka-taryf"

export default function TaryfyCPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/taryfy-c" />
      <NaglowekEkranu tytul="Porównywarka taryf C" ekran="taryfy-c">
        Roczny koszt w taryfach C11–C22b dla Twojej mocy umownej i zużycia. Taryfy niedostępne dla tej mocy są wyłączone z
        porównania (C1x do 40 kW, C2x powyżej). M14 „Firma – sieć”, ekran F2.
      </NaglowekEkranu>
      <PorownywarkaTaryf segment="firma" />
    </main>
  )
}
