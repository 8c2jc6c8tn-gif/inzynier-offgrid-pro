"use client"

import { useMemo } from "react"
import { calculateSlabeOgniwo } from "@/lib/core/modules/baterie/slabe-ogniwo/calculator"
import { DOMYSLNA_TOLERANCJA_PCT } from "@/lib/core/modules/baterie/slabe-ogniwo/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pojemnoscZnamionowaAh: string
  tolerancjaPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscZnamionowaAh: "",
  tolerancjaPct: String(DOMYSLNA_TOLERANCJA_PCT),
}

export default function SlabeOgniwoPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("slabe-ogniwo", STAN_POCZATKOWY)
  const { pojemnoscZnamionowaAh, tolerancjaPct } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscZnamionowaAh = (a: string | ((p: string) => string)) => setPole("pojemnoscZnamionowaAh", a)
  const setTolerancjaPct = (a: string | ((p: string) => string)) => setPole("tolerancjaPct", a)

  const result = useMemo(
    () =>
      calculateSlabeOgniwo({
        pojemnoscZnamionowaAh: pojemnoscZnamionowaAh === "" ? 0 : Number(pojemnoscZnamionowaAh),
        tolerancjaPct: tolerancjaPct === "" ? 0 : Number(tolerancjaPct),
      }),
    [pojemnoscZnamionowaAh, tolerancjaPct],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/slabe-ogniwo" />
      <NaglowekEkranu
        tytul="Symulacja Słabego Ogniwa (Cell Drift & Balancing)"
        ekran="slabe-ogniwo"
        wzor={result.formula}
      >
        To jak pociągnięcie za hamulec w całym pociągu, bo jeden wagon się zepsuł — jedno słabe
        ogniwo ogranicza cały pakiet. Moduł 4, Ekran 8.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Pojemność znamionowa ogniwa"
          unit="Ah"
          type="number"
          inputMode="decimal"
          value={pojemnoscZnamionowaAh}
          onChange={(e) => setPojemnoscZnamionowaAh(e.target.value)}
          pomoc={<PomocPola ekran="slabe-ogniwo" pole="pojemnosc" />}
        />
        <Pole
          label="Tolerancja fabryczna"
          unit="%"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={tolerancjaPct}
          onChange={(e) => setTolerancjaPct(e.target.value)}
          pomoc={<PomocPola ekran="slabe-ogniwo" pole="tolerancja" params={{ tolerancja: DOMYSLNA_TOLERANCJA_PCT }} />}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane, żeby zobaczyć pojemność użyteczną pakietu.
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta="Pojemność użyteczna pakietu (najgorszy przypadek)">
          <WynikGlowny>
            {result.value.pojemnoscNajslabszegoAh.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} Ah
          </WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
