"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { PorownanieScenariuszy } from "@/components/siec/porownanie-scenariuszy"

export default function ScenariuszeDomPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/scenariusze-dom" />
      <NaglowekEkranu tytul="Porównanie scenariuszy A–D">
        Sieć + PV, sieć + PV + magazyn, off-grid z siecią jako zapasem i pełne odłączenie — koszt całkowity w horyzoncie,
        okres zwrotu, godziny agregatu i odwracalność obok siebie. Ceny wpisujesz Ty. M14 „Dom – sieć”, ekran D7.
      </NaglowekEkranu>
      <PorownanieScenariuszy segment="dom" />
    </main>
  )
}
