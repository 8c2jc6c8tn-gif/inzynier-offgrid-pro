"use client"

import { useMemo, useState } from "react"
import { calculateGlownaSzynaWyrownawcza } from "@/lib/core/modules/okablowanie/glowna-szyna-wyrownawcza/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/glowna-szyna-wyrownawcza/constants"
import { PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

export default function GlownaSzynaWyrownawczaPage() {
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])
  const [uzywanaJakoPrzylaczeOdbiornikow, setUzywanaJakoPrzylaczeOdbiornikow] = useState(false)

  const result = useMemo(
    () => calculateGlownaSzynaWyrownawcza({ potwierdzoneIds, uzywanaJakoPrzylaczeOdbiornikow }),
    [potwierdzoneIds, uzywanaJakoPrzylaczeOdbiornikow],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? (hasCritical ? "blad" : "uwaga") : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/glowna-szyna-wyrownawcza" />
      <NaglowekEkranu tytul="Główna Szyna Wyrównawcza (GSW)">
        Jeśli dotkniesz dwóch metalowych rzeczy o różnym potencjale, popłynie przez ciebie prąd —
        GSW wyrównuje potencjały, więc nic nie „kopie”. Moduł 5, Ekran 10.
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.element}</span>
            <span className="block text-muted-foreground">Min. przekrój: {item.minPrzekrojMm2} mm²</span>
          </>
        )}
      />

      <PoleCheckbox
        id="uzywana-jako-przylacze"
        label="GSW jest używana jako punkt przyłączeniowy dla odbiorników"
        checked={uzywanaJakoPrzylaczeOdbiornikow}
        onChange={(e) => setUzywanaJakoPrzylaczeOdbiornikow(e.target.checked)}
      />

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? "GSW skompletowana poprawnie" : undefined}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <StanPusty tytul={`Potwierdzono ${result.value.potwierdzone} / ${result.value.razem} elementów`} />
      )}
    </main>
  )
}
