"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranPvMagazynu } from "@/components/siec/pv-magazyn"

export default function PvIMagazynPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pv-i-magazyn" />
      <NaglowekEkranu tytul="Ile PV i magazynu, żeby uniezależnić się od sieci">
        Bilans miesiąc po miesiącu: ile energii dadzą panele i magazyn, ile nadal weźmiesz z sieci i ile do niej oddasz.
        Nasłonecznienie z Twojej lokalizacji (Moduły 1 i 3), magazyn jak w Module 4. M14 „Dom – sieć”, ekran D4.
      </NaglowekEkranu>
      <EkranPvMagazynu segment="dom" />
    </main>
  )
}
