"use client"

import { useMemo } from "react"
import { calculateGrzalkiDachowe } from "@/lib/core/modules/stress-test/grzalki-dachowe/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  dlugoscKablaM: string
  mocNaMetrW: string
  godzinyPracyNaDobe: string
  mocPompyCieplaW: string
  zapasMocyW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  dlugoscKablaM: "",
  mocNaMetrW: "",
  godzinyPracyNaDobe: "",
  mocPompyCieplaW: "",
  zapasMocyW: "",
}

const liczba = (v: string) => (v === "" ? null : Number(v))
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function GrzalkiDachowePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("grzalki-dachowe", STAN_POCZATKOWY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateGrzalkiDachowe({
        dlugoscKablaM: liczba(stan.dlugoscKablaM),
        mocNaMetrW: liczba(stan.mocNaMetrW),
        godzinyPracyNaDobe: liczba(stan.godzinyPracyNaDobe),
        mocPompyCieplaW: liczba(stan.mocPompyCieplaW),
        zapasMocyW: liczba(stan.zapasMocyW),
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/grzalki-dachowe" />
      <NaglowekEkranu tytul="Grzałki dachowe i rynnowe">
        Ile mocy i energii zjedzą kable grzewcze przeciw zatorom lodowym w rynnach i koszach dachu. Moduł 7.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Łączna długość kabla grzewczego"
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.dlugoscKablaM}
          onChange={ustaw("dlugoscKablaM")}
          hint="Rynny, rury spustowe i kosze dachowe — tam, gdzie kabel faktycznie leży."
        />
        <Pole
          label="Moc kabla na metr"
          unit="W/m"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.mocNaMetrW}
          onChange={ustaw("mocNaMetrW")}
          hint="Z karty katalogowej kabla."
        />
        <Pole
          label="Czas pracy na dobę"
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          value={stan.godzinyPracyNaDobe}
          onChange={ustaw("godzinyPracyNaDobe")}
        />
        <Pole
          label="Moc elektryczna pompy ciepła (opcjonalnie)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.mocPompyCieplaW}
          onChange={ustaw("mocPompyCieplaW")}
          hint="Do porównania — grzałki potrafią pobierać więcej niż pompa."
        />
        <Pole
          label="Wolny zapas mocy falownika (opcjonalnie)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zapasMocyW}
          onChange={ustaw("zapasMocyW")}
          hint="Moc falownika minus odbiorniki pracujące w tym samym czasie."
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz długość kabla, moc na metr i czas pracy.</p>
      ) : (
        <WerdyktPanel
          poziom={hasWarning ? "uwaga" : "ok"}
          etykieta={hasWarning ? "Grzałki mocno obciążą system" : "Obciążenie grzałek"}
        >
          <WynikGlowny>{f0(result.value.mocW)} W</WynikGlowny>
          <p className="mt-1 text-small">{f2(result.value.energiaKwhDoba)} kWh na dobę pracy</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
