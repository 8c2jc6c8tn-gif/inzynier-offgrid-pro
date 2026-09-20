"use client"

import { useMemo } from "react"
import { calculateOznakowanieObwodow } from "@/lib/core/modules/okablowanie/oznakowanie-obwodow/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/oznakowanie-obwodow/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

type FormularzStan = {
  oznaczoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  oznaczoneIds: [],
}

export default function OznakowanieObwodowPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("oznakowanie-obwodow", STAN_POCZATKOWY)
  const { oznaczoneIds } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setOznaczoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("oznaczoneIds", a)

  const result = useMemo(() => calculateOznakowanieObwodow({ oznaczoneIds }), [oznaczoneIds])

  function toggle(id: string) {
    setOznaczoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null = result.status === "VALID" ? "ok" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/oznakowanie-obwodow" />
      <NaglowekEkranu tytul="Oznakowanie obwodów">
        Za 5 lat zapomnisz, co jest czym. Etykieta to pamięć twojego systemu. Moduł 5, Ekran 20.
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={oznaczoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.nazwa}</span>
            <span className="block text-muted-foreground">Kod wg PN-EN 60445: {item.kodOznaczenia}</span>
          </>
        )}
      />

      <p className="text-small text-muted-foreground">
        Kolorystyka żył (np. żółto-zielony PE, niebieski N) normuje osobna norma (IEC 60446), której
        nie mamy dziś w projekcie — tu podane są tylko kody alfanumeryczne z PN-EN 60445.
      </p>

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta="Wszystkie obwody oznaczone" />
      ) : (
        <StanPusty tytul={`Oznaczono ${result.value.oznaczone} / ${result.value.razem} obwodów`} />
      )}
    </main>
  )
}
