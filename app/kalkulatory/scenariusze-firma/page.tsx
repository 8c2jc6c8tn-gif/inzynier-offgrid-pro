"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { PorownanieScenariuszy } from "@/components/siec/porownanie-scenariuszy"

export default function ScenariuszeFirmaPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/scenariusze-firma" />
      <NaglowekEkranu tytul="Scenariusze A–D dla firmy" ekran="scenariusze-firma">
        Te same cztery scenariusze co dla domu, z kontrolą ciągłości działania (RF1): ile godzin firma zniesie bez zasilania
        i czy magazyn z agregatem to pokrywa. M14 „Firma – sieć”, ekran F8.
      </NaglowekEkranu>
      <PorownanieScenariuszy segment="firma" />
    </main>
  )
}
