"use client"

import { useMemo } from "react"
import { calculateRyzykoPid } from "@/lib/core/modules/pv/ryzyko-pid/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"
import { PROG_NAPIECIA_PID_V } from "@/lib/core/modules/pv/ryzyko-pid/constants"

type FormularzStan = {
  napiecieDcV: string
  wilgotnoscWysoka: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieDcV: "",
  wilgotnoscWysoka: false,
}

export default function RyzykoPidPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ryzyko-pid", STAN_POCZATKOWY)
  const { napiecieDcV, wilgotnoscWysoka } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setNapiecieDcV = (a: string | ((p: string) => string)) => setPole("napiecieDcV", a)
  const setWilgotnoscWysoka = (a: boolean | ((p: boolean) => boolean)) => setPole("wilgotnoscWysoka", a)

  const result = useMemo(
    () =>
      calculateRyzykoPid({
        napiecieDcV: napiecieDcV === "" ? 0 : Number(napiecieDcV),
        wilgotnoscWysoka,
      }),
    [napiecieDcV, wilgotnoscWysoka],
  )

  const poziom: WerdyktPoziom = result.value.ryzykoPid ? "uwaga" : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ryzyko-pid" />
      <NaglowekEkranu
        tytul="Ryzyko PID (degradacja indukowana napięciem)"
        ekran="ryzyko-pid"
        wynik={result}
        parametry={{ prog: PROG_NAPIECIA_PID_V }}
      >
        W długich stringach napięcie panelu względem ramy/ziemi może przekroczyć kilkaset wolt.
        Przy wilgotnej pogodzie jony sodu ze szkła migrują pod wpływem tego napięcia, powodując
        trwałą utratę mocy panelu. Moduł 3.
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <Pole
          label="Napięcie systemu DC względem ziemi"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieDcV}
          onChange={(e) => setNapiecieDcV(e.target.value)}
          pomoc={<PomocPola ekran="ryzyko-pid" pole="napiecie" params={{ prog: PROG_NAPIECIA_PID_V }} />}
        />
        <PoleCheckbox
          id="wilgotnosc-wysoka"
          checked={wilgotnoscWysoka}
          onChange={(e) => setWilgotnoscWysoka(e.target.checked)}
          label="Wysoka wilgotność w miejscu montażu"
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz napięcie systemu DC, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={result.value.ryzykoPid ? "Ryzyko PID" : "Brak ryzyka PID"}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          {result.value.ryzykoPid && (
            <p className="mt-2 text-small text-muted-foreground">
              Zalecane: uziemienie konstrukcji montażowej lub panele z certyfikatem anty-PID.
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
