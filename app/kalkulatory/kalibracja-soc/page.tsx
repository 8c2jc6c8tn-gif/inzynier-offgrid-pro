"use client"

import { useMemo, useState } from "react"
import { calculateKalibracjaSoc } from "@/lib/core/modules/baterie/kalibracja-soc/calculator"
import { PROG_KALIBRACJI_DNI } from "@/lib/core/modules/baterie/kalibracja-soc/constants"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

export default function KalibracjaSocPage() {
  const t = useTranslate()
  const [dni, setDni] = useState("")

  const result = useMemo(
    () => calculateKalibracjaSoc({ dniOdOstatniegoPelnegoNaladowania: dni === "" ? null : Number(dni) }),
    [dni],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kalibracja-soc" />
      <NaglowekEkranu tytul="Kalibracja i dokładność SoC">
        Liczenie prądu w BMS to ciągły szacunek, nie dokładny pomiar — od czasu do czasu trzeba go
        „zresetować” pełnym naładowaniem, żeby błąd się nie kumulował. Moduł 4, Ekran 28.
      </NaglowekEkranu>

      <Pole
        label="Dni od ostatniego pełnego naładowania"
        unit="dni"
        type="number"
        inputMode="numeric"
        min={0}
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        hint={`Próg rekomendacji kalibracji: ${PROG_KALIBRACJI_DNI} dni. 0 = dziś było pełne ładowanie.`}
      />

      {result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">Liczba dni nie może być ujemna.</p>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz liczbę dni, żeby zobaczyć rekomendację.</p>
      ) : (
        <WerdyktPanel
          poziom={result.value.kalibracjaRekomendowana ? "uwaga" : "ok"}
          etykieta={result.value.kalibracjaRekomendowana ? "Rekomendowana kalibracja" : "Kalibracja niepotrzebna"}
        >
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      )}
    </main>
  )
}
