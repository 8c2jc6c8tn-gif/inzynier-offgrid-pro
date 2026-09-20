"use client"

import { useMemo } from "react"
import { calculateStratyZlaczkiMc4 } from "@/lib/core/modules/pv/straty-zlaczki-mc4/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  rezystancjaZlaczkiMOhm: string
  liczbaZlaczek: string
  pradA: string
}

const STAN_POCZATKOWY: FormularzStan = {
  rezystancjaZlaczkiMOhm: "",
  liczbaZlaczek: "",
  pradA: "",
}

export default function StratyZlaczkiMc4Page() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("straty-zlaczki-mc4", STAN_POCZATKOWY)
  const { rezystancjaZlaczkiMOhm, liczbaZlaczek, pradA } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setRezystancjaZlaczkiMOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaZlaczkiMOhm", a)
  const setLiczbaZlaczek = (a: string | ((p: string) => string)) => setPole("liczbaZlaczek", a)
  const setPradA = (a: string | ((p: string) => string)) => setPole("pradA", a)

  const result = useMemo(
    () =>
      calculateStratyZlaczkiMc4({
        rezystancjaZlaczkiMOhm: rezystancjaZlaczkiMOhm === "" ? 0 : Number(rezystancjaZlaczkiMOhm),
        liczbaZlaczek: liczbaZlaczek === "" ? 0 : Number(liczbaZlaczek),
        pradA: pradA === "" ? 0 : Number(pradA),
      }),
    [rezystancjaZlaczkiMOhm, liczbaZlaczek, pradA],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical") && result.status !== "INVALID_INPUT"
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/straty-zlaczki-mc4" />
      <NaglowekEkranu tytul="Straty na złączkach MC4 w praktyce">
        Małe złączki, duże znaczenie — luźny styk MC4 to jedna z najczęstszych przyczyn awarii i
        pożarów w instalacjach PV, mimo że wygląda niepozornie. Moduł 3, Ekran 26.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Rezystancja jednej złączki"
          unit="mΩ"
          type="number"
          inputMode="decimal"
          step="0.1"
          min={0}
          hint="Dobry stan: 0,5-2 mΩ. Luźna/zaśniedziała: nawet 10× więcej."
          value={rezystancjaZlaczkiMOhm}
          onChange={(e) => setRezystancjaZlaczkiMOhm(e.target.value)}
        />
        <Pole
          label="Liczba złączek"
          unit="szt."
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaZlaczek}
          onChange={(e) => setLiczbaZlaczek(e.target.value)}
        />
        <Pole
          label="Prąd"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradA}
          onChange={(e) => setPradA(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"} etykieta="Strata całkowita na złączkach">
          <WynikGlowny>{result.value.strataCalkowitaW.toFixed(1)} W</WynikGlowny>
          <p className="mt-2 text-small">Strata na jedną złączkę: {result.value.strataNaZlaczkeW.toFixed(2)} W.</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
