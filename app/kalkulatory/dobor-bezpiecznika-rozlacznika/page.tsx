"use client"

import { useMemo } from "react"
import { calculateDoborBezpiecznikaRozlacznika } from "@/lib/core/modules/okablowanie/dobor-bezpiecznika-rozlacznika/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  pradZnamionowyA: number
  pradZwarciowyA: number
  aicBezpiecznikaA: number
}

const STAN_POCZATKOWY: FormularzStan = {
  pradZnamionowyA: 0,
  pradZwarciowyA: 0,
  aicBezpiecznikaA: 0,
}

export default function DoborBezpiecznikaRozlacznikaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dobor-bezpiecznika-rozlacznika", STAN_POCZATKOWY)
  const { pradZnamionowyA, pradZwarciowyA, aicBezpiecznikaA } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPradZnamionowyA = (a: number | ((p: number) => number)) => setPole("pradZnamionowyA", a)
  const setPradZwarciowyA = (a: number | ((p: number) => number)) => setPole("pradZwarciowyA", a)
  const setAicBezpiecznikaA = (a: number | ((p: number) => number)) => setPole("aicBezpiecznikaA", a)

  const result = useMemo(
    () => calculateDoborBezpiecznikaRozlacznika({ pradZnamionowyA, pradZwarciowyA, aicBezpiecznikaA }),
    [pradZnamionowyA, pradZwarciowyA, aicBezpiecznikaA],
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
        ? "Zabroniona kombinacja — dobierz bezpiecznik o wyższej zdolności łączeniowej"
        : "Bezpiecznik dobrany"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-bezpiecznika-rozlacznika" />
      <NaglowekEkranu tytul="Dobór bezpieczników i rozłączników" ekran="dobor-bezpiecznika-rozlacznika" wynik={result}>
        Bezpiecznik to bezpieczna wkładka topikowa dla całej instalacji — ma przepalić się on,
        zanim przepali się kabel. Moduł 5, Ekran 6.
      </NaglowekEkranu>

      <Pole
        label="Prąd znamionowy obwodu"
        unit="A"
        type="number"
        inputMode="decimal"
        min={0}
        value={pradZnamionowyA || ""}
        onChange={(e) => setPradZnamionowyA(Number(e.target.value))}
        pomoc={<PomocPola ekran="dobor-bezpiecznika-rozlacznika" pole="prad" />}
      />

      <Pole
        label="Prąd zwarciowy w tym punkcie"
        unit="A"
        type="number"
        inputMode="decimal"
        min={0}
        value={pradZwarciowyA || ""}
        onChange={(e) => setPradZwarciowyA(Number(e.target.value))}
        pomoc={<PomocPola ekran="dobor-bezpiecznika-rozlacznika" pole="pradZwarcia" />}
      />

      <Pole
        label="Zdolność łączeniowa (AIC) wybranego bezpiecznika"
        unit="A"
        type="number"
        inputMode="decimal"
        min={0}
        value={aicBezpiecznikaA || ""}
        onChange={(e) => setAicBezpiecznikaA(Number(e.target.value))}
        pomoc={<PomocPola ekran="dobor-bezpiecznika-rozlacznika" pole="aic" />}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">Wpisz prąd znamionowy obwodu, żeby zobaczyć werdykt.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikGlowny>{result.value.pradBezpiecznikaZalecanyA} A</WynikGlowny>
          <p className="text-small text-muted-foreground">Zalecany prąd znamionowy bezpiecznika (1,25 × prąd obwodu)</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
