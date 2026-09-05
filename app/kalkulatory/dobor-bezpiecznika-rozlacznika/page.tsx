"use client"

import { useMemo, useState } from "react"
import { calculateDoborBezpiecznikaRozlacznika } from "@/lib/core/modules/okablowanie/dobor-bezpiecznika-rozlacznika/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function DoborBezpiecznikaRozlacznikaPage() {
  const [pradZnamionowyA, setPradZnamionowyA] = useState(0)
  const [pradZwarciowyA, setPradZwarciowyA] = useState(0)
  const [aicBezpiecznikaA, setAicBezpiecznikaA] = useState(0)

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
      <NaglowekEkranu tytul="Dobór bezpieczników i rozłączników">
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
      />

      <Pole
        label="Prąd zwarciowy w tym punkcie"
        unit="A"
        type="number"
        inputMode="decimal"
        min={0}
        value={pradZwarciowyA || ""}
        onChange={(e) => setPradZwarciowyA(Number(e.target.value))}
        hint="Docelowo z Ekranu 12 (Analiza zwarciowa, jeszcze niezbudowany) — dziś wpisz ręcznie."
      />

      <Pole
        label="Zdolność łączeniowa (AIC) wybranego bezpiecznika"
        unit="A"
        type="number"
        inputMode="decimal"
        min={0}
        value={aicBezpiecznikaA || ""}
        onChange={(e) => setAicBezpiecznikaA(Number(e.target.value))}
        hint="Z karty katalogowej bezpiecznika."
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
