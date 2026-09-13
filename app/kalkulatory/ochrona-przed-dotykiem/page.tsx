"use client"

import { useMemo, useState } from "react"
import { calculateOchronaPrzedDotykiem } from "@/lib/core/modules/okablowanie/ochrona-przed-dotykiem/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/ochrona-przed-dotykiem/constants"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

export default function OchronaPrzedDotykiemPage() {
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(() => calculateOchronaPrzedDotykiem({ potwierdzoneIds }), [potwierdzoneIds])

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null = result.status === "VALID" ? "ok" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-przed-dotykiem" />
      <NaglowekEkranu tytul="Ochrona przed dotykiem">
        Prąd nie wybacza. Jak dotkniesz nieosłoniętego plusa, nie zdążysz zareagować. Osłony i
        szybkie wyłączniki to twoje bezpieczeństwo. Moduł 5, Ekran 17.
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.nazwa}</span>
            <span className="block text-muted-foreground">{item.opis}</span>
          </>
        )}
      />

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta="Oba mechanizmy ochrony potwierdzone" />
      ) : (
        <StanPusty tytul={`Potwierdzono ${result.value.potwierdzone} / ${result.value.razem} mechanizmów`} />
      )}
    </main>
  )
}
