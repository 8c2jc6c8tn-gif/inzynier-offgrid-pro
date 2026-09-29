"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaDotacji } from "@/components/siec/lista-dotacji"

export default function DotacjeFirmaPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dotacje-firma" />
      <NaglowekEkranu tytul="Dotacje i podatki — informacja, nie porada" ekran="dotacje-firma">
        Nabory dla firm ze stanem na dzień. „Przydomowe Magazyny Energii” i ulga termomodernizacyjna dotyczą osób fizycznych, więc
        są w części „Dom”. M14 „Firma – sieć”, ekran F12.
      </NaglowekEkranu>
      <ListaDotacji segment="firma" />
      <section className="flex flex-col gap-2 rounded-lg border p-3">
        <h2 className="font-semibold">Podatki</h2>
        <p className="text-small">
          Skutki podatkowe net-billingu w firmie zależą od formy opodatkowania — skonsultuj z księgowym; interpretacje
          indywidualne wiążą tylko wnioskodawcę.
        </p>
      </section>
    </main>
  )
}
