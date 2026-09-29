"use client"

import { useMemo } from "react"
import { calculatePierwszeUruchomienie } from "@/lib/core/modules/montaz-baterii/pierwsze-uruchomienie/calculator"
import { CHECKLIST_ITEMS, PROG_TOP_BALANCING_V } from "@/lib/core/modules/montaz-baterii/pierwsze-uruchomienie/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { CZAS_TESTU_MIN, TEST_LADOWANIA_C_RATE } from "@/lib/core/modules/montaz-baterii/pierwsze-uruchomienie/constants"

type FormularzStan = {
  pojemnoscAh: number
  napiecieNajwyzszegoOgniwaV: number
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscAh: 0,
  napiecieNajwyzszegoOgniwaV: 0,
  potwierdzoneIds: [],
}

export default function PierwszeUruchomieniePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pierwsze-uruchomienie", STAN_POCZATKOWY)
  const { pojemnoscAh, napiecieNajwyzszegoOgniwaV, potwierdzoneIds } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscAh = (a: number | ((p: number) => number)) => setPole("pojemnoscAh", a)
  const setNapiecieNajwyzszegoOgniwaV = (a: number | ((p: number) => number)) => setPole("napiecieNajwyzszegoOgniwaV", a)
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("potwierdzoneIds", a)

  const result = useMemo(
    () => calculatePierwszeUruchomienie({ pojemnoscAh, napiecieNajwyzszegoOgniwaV, potwierdzoneIds }),
    [pojemnoscAh, napiecieNajwyzszegoOgniwaV, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" || hasCritical
      ? "blad"
      : result.status === "INCOMPLETE" && pojemnoscAh === 0
        ? null
        : result.status === "VALID"
          ? "ok"
          : "uwaga"

  const etykieta =
    result.status === "INVALID_INPUT"
      ? "Nie da się policzyć — sprawdź wpisane dane"
      : result.status === "VALID"
        ? "Test zakończony — pakiet gotowy do pełnego obciążenia"
        : "Test w toku — kontynuuj ładowanie małym prądem"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pierwsze-uruchomienie" />
      <NaglowekEkranu
        tytul="Pierwsze uruchomienie i test balansowania"
        ekran="pierwsze-uruchomienie" wynik={result}
        parametry={{ cRate: TEST_LADOWANIA_C_RATE, czas: CZAS_TESTU_MIN, prog: PROG_TOP_BALANCING_V }}
      >
        Pierwsze ładowanie to nie jest &bdquo;włącz i zapomnij&rdquo; — to moment, kiedy BMS uczy
        się Twojego pakietu i wyrównuje różnice między ogniwami z fabryki. Moduł 11, Ekran A5
        (ścieżka LiFePO4).
      </NaglowekEkranu>

      <Pole
        label="Pojemność pakietu"
        unit="Ah"
        type="number"
        inputMode="decimal"
        min={0}
        value={pojemnoscAh || ""}
        onChange={(e) => setPojemnoscAh(Number(e.target.value))}
        pomoc={<PomocPola ekran="pierwsze-uruchomienie" pole="pojemnosc" params={{ cRate: TEST_LADOWANIA_C_RATE, czas: CZAS_TESTU_MIN, prog: PROG_TOP_BALANCING_V }} />}
      />

      {pojemnoscAh > 0 && (
        <p className="text-small">
          Ładuj prądem testowym <strong>{result.value.pradTestowyA} A</strong> przez 30 minut.
        </p>
      )}

      <Pole
        label="Napięcie najwyżej naładowanego ogniwa"
        unit="V"
        type="number"
        inputMode="decimal"
        step="0.01"
        min={0}
        value={napiecieNajwyzszegoOgniwaV || ""}
        onChange={(e) => setNapiecieNajwyzszegoOgniwaV(Number(e.target.value))}
        pomoc={<PomocPola ekran="pierwsze-uruchomienie" pole="napiecieMax" params={{ cRate: TEST_LADOWANIA_C_RATE, czas: CZAS_TESTU_MIN, prog: PROG_TOP_BALANCING_V }} />}
      />

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => item.element}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">Wpisz pojemność pakietu, żeby zobaczyć werdykt.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
