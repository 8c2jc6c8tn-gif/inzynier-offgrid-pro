"use client"

import { useMemo, useState } from "react"
import { calculateStressTestMppt } from "@/lib/core/modules/pv/stress-test-mppt/calculator"
import {
  BETA_TYPOWA_MAX_PCT_NA_C,
  BETA_TYPOWA_MIN_PCT_NA_C,
} from "@/lib/core/modules/pv/stress-test-mppt/constants"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function StressTestMpptPage() {
  const [vocStcV, setVocStcV] = useState("")
  const [betaPctNaC, setBetaPctNaC] = useState("")
  const [tminC, setTminC] = useState("")
  const [liczbaPaneliWStringu, setLiczbaPaneliWStringu] = useState("")
  const [limitMpptV, setLimitMpptV] = useState("")

  const result = useMemo(
    () =>
      calculateStressTestMppt({
        vocStcV: vocStcV === "" ? 0 : Number(vocStcV),
        betaPctNaC: betaPctNaC === "" ? 0 : Number(betaPctNaC),
        tminC: tminC === "" ? null : Number(tminC),
        liczbaPaneliWStringu: liczbaPaneliWStringu === "" ? 0 : Number(liczbaPaneliWStringu),
        limitMpptV: limitMpptV === "" ? 0 : Number(limitMpptV),
      }),
    [vocStcV, betaPctNaC, tminC, liczbaPaneliWStringu, limitMpptV],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  const verdict =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "INCOMPLETE"
        ? "incomplete"
        : hasCritical
          ? "red"
          : hasWarning
            ? "yellow"
            : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    yellow: "uwaga",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wypełnij wszystkie pola",
    red: "Zabronione — ryzyko trwałego uszkodzenia falownika",
    yellow: "Dopuszczalne, ale mały margines",
    green: "Bezpieczny margines",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/stress-test-mppt" />
      <NaglowekEkranu tytul="Zimowy stress-test napięciowy MPPT">
        Panele PV zachowują się odwrotnie niż można by się spodziewać — im zimniej, tym WYŻSZE
        napięcie dają na biegu jałowym. Mroźny, słoneczny poranek to najbardziej niebezpieczny
        moment dla falownika, nie upalne lato. To jeden z najważniejszych twardych stopów w
        aplikacji — przekroczenie limitu MPPT to gwarantowane uszkodzenie sprzętu. Moduł 3, Ekran 5.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Voc panelu (STC, 25°C)"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={vocStcV}
          onChange={(e) => setVocStcV(e.target.value)}
          hint="Napięcie obwodu otwartego — z karty katalogowej panelu."
        />
        <Pole
          label="Współczynnik temperaturowy Voc (β)"
          unit="%/°C"
          type="number"
          inputMode="decimal"
          value={betaPctNaC}
          onChange={(e) => setBetaPctNaC(e.target.value)}
          hint={`Typowo ${BETA_TYPOWA_MIN_PCT_NA_C} do ${BETA_TYPOWA_MAX_PCT_NA_C}%/°C (wartość ujemna — Voc rośnie przy spadku temperatury).`}
        />
        <Pole
          label="Minimalna temperatura w lokalizacji (Tmin)"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={tminC}
          onChange={(e) => setTminC(e.target.value)}
          hint="Docelowo automatycznie z Modułu 1 — na razie wpisz ręcznie."
        />
        <Pole
          label="Liczba paneli w stringu"
          unit="szt."
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaPaneliWStringu}
          onChange={(e) => setLiczbaPaneliWStringu(e.target.value)}
        />
        <Pole
          label="Max napięcie wejściowe MPPT/falownika"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={limitMpptV}
          onChange={(e) => setLimitMpptV(e.target.value)}
          hint="Z karty katalogowej falownika — przekroczenie może trwale uszkodzić wejście DC."
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>V_string = {result.value.vStringV.toFixed(0)} V</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
