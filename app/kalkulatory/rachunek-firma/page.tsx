"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { FormularzRachunku } from "@/components/siec/formularz-rachunku"
import { stawkiDoPomocy } from "@/components/siec/wspolne"

export default function RachunekFirmaPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/rachunek-firma" />
      <NaglowekEkranu tytul="Mój rachunek dziś (taryfa C)" ekran="rachunek-firma" parametry={stawkiDoPomocy()}>
        Rachunek firmy na niskim napięciu (C11–C22b): energia, dystrybucja, opłata mocowa za pobór w dni robocze 7–22 i
        koszt stały zależny od mocy umownej. Cena sprzedaży jest rynkowa — wpisujesz ją z faktury. M14 „Firma – sieć”,
        ekran F1.
      </NaglowekEkranu>
      <FormularzRachunku segment="firma" />
    </main>
  )
}
