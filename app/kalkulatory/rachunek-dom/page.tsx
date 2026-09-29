"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { FormularzRachunku } from "@/components/siec/formularz-rachunku"

export default function RachunekDomPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/rachunek-dom" />
      <NaglowekEkranu tytul="Mój rachunek dziś">
        Z czego składa się Twój rachunek za prąd i ile z niego płacisz za samo posiadanie przyłącza („cena trzymania
        sieci”). Stawki dystrybucyjne 2026 są w aplikacji dla Tauron, Energa i Stoen — dla innych OSD wpiszesz je z
        faktury. M14 „Dom – sieć”, ekran D1.
      </NaglowekEkranu>
      <FormularzRachunku segment="dom" />
    </main>
  )
}
