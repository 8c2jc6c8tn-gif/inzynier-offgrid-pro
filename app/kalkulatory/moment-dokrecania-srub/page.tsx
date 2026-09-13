"use client"

import { useMemo, useState } from "react"
import { calculateMomentDokrecania } from "@/lib/core/modules/baterie/moment-dokrecania-srub/calculator"
import {
  CHECKLIST_ITEMS,
  formatujMoment,
  OSTRZEZENIA_STALE,
  OSTRZEZENIE_INNE_OGNIWO,
  TYPY_OGNIW,
  znajdzTypOgniwa,
} from "@/lib/core/modules/baterie/moment-dokrecania-srub/constants"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

export default function MomentDokrecaniaSrubPage() {
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])
  const [typOgniwaId, setTypOgniwaId] = useState(TYPY_OGNIW[0].id)

  const result = useMemo(
    () => calculateMomentDokrecania({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  const typOgniwa = znajdzTypOgniwa(typOgniwaId)
  const czyInne = typOgniwaId === "inne-m6" || typOgniwaId === "inne-m8"

  // Podmienia tylko tekst momentu dla gwintu pasującego do wybranego typu ogniwa — sam checklist
  // (id kroków, ich liczba, logika VALID/INCOMPLETE) zostaje bez zmian.
  const items = useMemo(
    () =>
      CHECKLIST_ITEMS.map((item) => {
        if (!typOgniwa) return item
        const idGwintu = typOgniwa.gwint === "M6" ? "terminal-m6" : "terminal-m8"
        if (item.id !== idGwintu) return item
        return { ...item, moment: formatujMoment(typOgniwa.moment) }
      }),
    [typOgniwa],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/moment-dokrecania-srub" />
      <NaglowekEkranu tytul="Moment dokręcania śrub">
        Śruba to sprężyna — musisz ją naciągnąć dokładnie tyle, ile trzeba, żeby docisnęła
        końcówkę kablową, ani trochę więcej. Moduł 4, Ekran 11.
      </NaglowekEkranu>

      <PoleSelect
        label="Typ / pojemność ogniwa"
        value={typOgniwaId}
        onChange={(e) => setTypOgniwaId(e.target.value)}
      >
        {TYPY_OGNIW.map((typ) => (
          <option key={typ.id} value={typ.id}>
            {typ.etykieta}
          </option>
        ))}
      </PoleSelect>

      {czyInne && (
        <p className="text-small text-muted-foreground">⚠️ {OSTRZEZENIE_INNE_OGNIWO}</p>
      )}

      <ListaChecklist
        items={items}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.element}</span>
            <span className="block text-muted-foreground">Moment: {item.moment}</span>
            {item.uwaga !== "—" && (
              <span className="block text-caption text-muted-foreground">{item.uwaga}</span>
            )}
          </>
        )}
      />

      <ul className="flex flex-col gap-1 text-caption text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}>⚠️ {w}</li>
        ))}
      </ul>

      {result.status === "VALID" ? (
        <WerdyktPanel poziom="ok" etykieta="Wszystkie kroki potwierdzone" />
      ) : (
        <StanPusty tytul={`Potwierdzono ${result.value.potwierdzone} / ${result.value.razem} kroków`} />
      )}
    </main>
  )
}
