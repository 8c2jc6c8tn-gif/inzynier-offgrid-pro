"use client"

import { useMemo } from "react"
import { calculateStringBox } from "@/lib/core/modules/okablowanie/string-box/calculator"
import { BEZPIECZNIK_STRINGOWY_MAX_A, BEZPIECZNIK_STRINGOWY_MIN_A } from "@/lib/core/modules/okablowanie/string-box/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  liczbaStringow: number
  liczbaWejscSkrzynki: number
  bezpiecznikStringowyA: number
  maSkrzynkeIp66: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  liczbaStringow: 0,
  liczbaWejscSkrzynki: 0,
  bezpiecznikStringowyA: 0,
  maSkrzynkeIp66: false,
}

export default function StringBoxPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("string-box", STAN_POCZATKOWY)
  const { liczbaStringow, liczbaWejscSkrzynki, bezpiecznikStringowyA, maSkrzynkeIp66 } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setLiczbaStringow = (a: number | ((p: number) => number)) => setPole("liczbaStringow", a)
  const setLiczbaWejscSkrzynki = (a: number | ((p: number) => number)) => setPole("liczbaWejscSkrzynki", a)
  const setBezpiecznikStringowyA = (a: number | ((p: number) => number)) => setPole("bezpiecznikStringowyA", a)
  const setMaSkrzynkeIp66 = (a: boolean | ((p: boolean) => boolean)) => setPole("maSkrzynkeIp66", a)

  const result = useMemo(
    () =>
      calculateStringBox({
        liczbaStringow,
        liczbaWejscSkrzynki,
        bezpiecznikStringowyA,
        maSkrzynkeIp66,
      }),
    [liczbaStringow, liczbaWejscSkrzynki, bezpiecznikStringowyA, maSkrzynkeIp66],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : hasCritical
          ? "blad"
          : result.status === "VALID_WITH_WARNINGS"
            ? "uwaga"
            : "ok"

  const etykieta =
    result.status === "INVALID_INPUT"
      ? "Nie da się policzyć — sprawdź wpisane dane"
      : hasCritical
        ? "Zabronione — string box nie spełnia wymogów bezpieczeństwa"
        : "String box gotowy do montażu"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/string-box" />
      <NaglowekEkranu
        tytul="String Box / Array Box"
        ekran="string-box" wynik={result}
        parametry={{ bezpMin: BEZPIECZNIK_STRINGOWY_MIN_A, bezpMax: BEZPIECZNIK_STRINGOWY_MAX_A }}
      >
        String box to węzeł, w którym kable z paneli spotykają się w uporządkowany sposób — bez
        tego masz plątaninę i ryzyko pożaru. Moduł 5, Ekran 22.
      </NaglowekEkranu>

      <Pole
        label="Liczba stringów"
        type="number"
        inputMode="numeric"
        min={0}
        value={liczbaStringow || ""}
        onChange={(e) => setLiczbaStringow(Number(e.target.value))}
        pomoc={<PomocPola ekran="string-box" pole="stringi" />}
      />

      <Pole
        label="Liczba wejść DC skrzynki"
        type="number"
        inputMode="numeric"
        min={0}
        value={liczbaWejscSkrzynki || ""}
        onChange={(e) => setLiczbaWejscSkrzynki(Number(e.target.value))}
        pomoc={<PomocPola ekran="string-box" pole="wejscia" />}
      />

      <Pole
        label="Bezpiecznik stringowy"
        unit="A"
        type="number"
        inputMode="decimal"
        min={0}
        value={bezpiecznikStringowyA || ""}
        onChange={(e) => setBezpiecznikStringowyA(Number(e.target.value))}
        pomoc={<PomocPola ekran="string-box" pole="bezpiecznik" params={{ bezpMin: BEZPIECZNIK_STRINGOWY_MIN_A, bezpMax: BEZPIECZNIK_STRINGOWY_MAX_A }} />}
      />

      <PoleCheckbox
        id="skrzynka-ip66"
        label="Skrzynka ma stopień ochrony IP66"
        checked={maSkrzynkeIp66}
        onChange={(e) => setMaSkrzynkeIp66(e.target.checked)}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">Wpisz liczbę stringów, żeby zobaczyć werdykt.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
