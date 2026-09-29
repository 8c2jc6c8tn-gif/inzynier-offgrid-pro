"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaDotacji } from "@/components/siec/lista-dotacji"

export default function DotacjePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dotacje" />
      <NaglowekEkranu tytul="Dotacje (stan na dzień)" ekran="dotacje">
        Informacja, nie porada. Każda pozycja ma datę stanu i znak pewności: ✅ odczyt źródła, 🔎B jedno źródło albo wiedza
        ekspercka. Po terminie naboru pozycja sama zmienia się na „nabór zakończony”. M14 „Dom – sieć”, ekran D13.
      </NaglowekEkranu>
      <ListaDotacji segment="dom" />
      <p className="text-small text-muted-foreground">
        Uwaga na kolejność: dotacje na magazyn są dziś powiązane z byciem prosumentem przyłączonym do sieci. Odłączenie w okresie
        trwałości projektu może oznaczać zwrot dotacji — sprawdź regulamin, zanim wybierzesz scenariusz D.
      </p>
    </main>
  )
}
