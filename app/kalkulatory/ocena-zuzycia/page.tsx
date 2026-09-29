"use client"

import { useMemo } from "react"
import { calculateOcenaZuzycia } from "@/lib/core/modules/montaz-baterii/ocena-zuzycia/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/montaz-baterii/ocena-zuzycia/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  widocznePuchniecie: boolean | null
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  widocznePuchniecie: null,
  potwierdzoneIds: [],
}

export default function OcenaZuzyciaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ocena-zuzycia", STAN_POCZATKOWY)
  const { widocznePuchniecie, potwierdzoneIds } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setWidocznePuchniecie = (a: boolean | null | ((p: boolean | null) => boolean | null)) => setPole("widocznePuchniecie", a)
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("potwierdzoneIds", a)

  const result = useMemo(
    () => calculateOcenaZuzycia({ widocznePuchniecie, potwierdzoneIds }),
    [widocznePuchniecie, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "blad" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ocena-zuzycia" />
      <NaglowekEkranu tytul="Ocena zużycia ogniwa po demontażu" ekran="ocena-zuzycia">
        Trzy pomiary do wykonania po zdjęciu ogniwa, plus jedna ocena, która decyduje o
        wszystkim: czy obudowa widocznie spuchła. Moduł 11, Ekran A8.
      </NaglowekEkranu>

      <div className="flex flex-col gap-2">
        <span className="text-small font-medium">Widoczne puchnięcie obudowy?</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setWidocznePuchniecie(false)}
            aria-pressed={widocznePuchniecie === false}
            className="min-h-11 flex-1 rounded-md border px-3 text-small transition-colors aria-pressed:border-werdykt-ok-border aria-pressed:bg-werdykt-ok-bg aria-pressed:text-werdykt-ok-foreground hover:bg-muted"
          >
            Nie
          </button>
          <button
            type="button"
            onClick={() => setWidocznePuchniecie(true)}
            aria-pressed={widocznePuchniecie === true}
            className="min-h-11 flex-1 rounded-md border px-3 text-small transition-colors aria-pressed:border-werdykt-blad-border aria-pressed:bg-werdykt-blad-bg aria-pressed:text-werdykt-blad-foreground hover:bg-muted"
          >
            Tak
          </button>
        </div>
      </div>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => item.element}
      />

      {poziom === null ? (
        <StanPusty tytul="Oceń obudowę, żeby zobaczyć werdykt." />
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={poziom === "blad" ? "Wycofaj ogniwo z eksploatacji" : "Ogniwo do ponownego montażu"}
        >
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
          {poziom === "ok" && (
            <p className="mt-1 text-small">
              Potwierdzono {result.value.potwierdzone} / {result.value.razem} pomiarów.
            </p>
          )}
        </WerdyktPanel>
      )}
    </main>
  )
}
