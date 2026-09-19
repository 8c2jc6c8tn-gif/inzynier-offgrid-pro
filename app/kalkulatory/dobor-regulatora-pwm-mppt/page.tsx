"use client"

import { useMemo, useState } from "react"
import { calculateReguRatorPwmMppt } from "@/lib/core/modules/kalkulator-mobilny/dobor-regulatora-pwm-mppt/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

export default function DoborRegulatoraPwmMpptPage() {
  const t = useTranslate()
  const [mocPaneliW, setMocPaneliW] = useState("")
  const [napiecieNominalnePaneluV, setNapiecieNominalnePaneluV] = useState("")
  const [napiecieAkumulatoraV, setNapiecieAkumulatoraV] = useState("")

  const result = useMemo(
    () =>
      calculateReguRatorPwmMppt({
        mocPaneliW: mocPaneliW === "" ? 0 : Number(mocPaneliW),
        napiecieNominalnePaneluV: napiecieNominalnePaneluV === "" ? 0 : Number(napiecieNominalnePaneluV),
        napiecieAkumulatoraV: napiecieAkumulatoraV === "" ? 0 : Number(napiecieAkumulatoraV),
      }),
    [mocPaneliW, napiecieNominalnePaneluV, napiecieAkumulatoraV],
  )

  const poziom: WerdyktPoziom = result.value.niezgodnoscNapiec ? "blad" : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-regulatora-pwm-mppt" />
      <NaglowekEkranu tytul="Dobór regulatora PWM vs MPPT">
        PWM to tani robotnik, MPPT to inżynier — do dużych zysków zatrudnij inżyniera. Moduł 12.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Moc paneli"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPaneliW}
          onChange={(e) => setMocPaneliW(e.target.value)}
        />
        <Pole
          label="Napięcie paneli (klasa)"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieNominalnePaneluV}
          onChange={(e) => setNapiecieNominalnePaneluV(e.target.value)}
          hint="Napięcie znamionowe/klasa panelu (np. 12V, 24V), nie Voc."
        />
        <Pole
          label="Napięcie systemowe akumulatora"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieAkumulatoraV}
          onChange={(e) => setNapiecieAkumulatoraV(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć rekomendację.</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={result.value.niezgodnoscNapiec ? "PWM niekompatybilny" : "Rekomendacja"}
        >
          <WynikGlowny>{result.value.regulator}</WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
