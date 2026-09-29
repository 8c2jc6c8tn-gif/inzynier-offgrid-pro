"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { EkranPvMagazynu } from "@/components/siec/pv-magazyn"

export default function PvWFirmiePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pv-w-firmie" />
      <NaglowekEkranu tytul="PV w firmie i autokonsumpcja" ekran="pv-w-firmie">
        Ile energii z paneli firma zużyje od razu, ile przesunie magazyn, a ile odda do sieci (net-billing — im mniej
        oddajesz, tym lepiej). Nasłonecznienie z lokalizacji (Moduły 1 i 3). M14 „Firma – sieć”, ekran F6.
      </NaglowekEkranu>
      <EkranPvMagazynu segment="firma" />
    </main>
  )
}
