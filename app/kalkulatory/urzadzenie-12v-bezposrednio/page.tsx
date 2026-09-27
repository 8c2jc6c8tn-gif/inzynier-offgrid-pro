"use client"

import { useId, useMemo } from "react"
import { calculateUrzadzenie12vBezposrednio } from "@/lib/core/modules/kalkulator-mobilny/urzadzenie-12v-bezposrednio/calculator"
import type { Urzadzenie12vBezposrednioInput } from "@/lib/core/modules/kalkulator-mobilny/urzadzenie-12v-bezposrednio/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  napiecieSystemuV: Urzadzenie12vBezposrednioInput["napiecieSystemuV"]
  napiecieUrzadzeniaV: string
  tolerancjaPct: string
  przezStabilizator: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieSystemuV: 0,
  napiecieUrzadzeniaV: "",
  tolerancjaPct: "",
  przezStabilizator: false,
}

const f1 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export default function Urzadzenie12vBezposrednioPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("urzadzenie-12v-bezposrednio", STAN_POCZATKOWY)
  const idStabilizator = useId()

  const result = useMemo(
    () =>
      calculateUrzadzenie12vBezposrednio({
        napiecieSystemuV: stan.napiecieSystemuV,
        napiecieUrzadzeniaV: stan.napiecieUrzadzeniaV === "" ? 0 : Number(stan.napiecieUrzadzeniaV),
        tolerancjaPct: stan.tolerancjaPct === "" ? null : Number(stan.tolerancjaPct),
        przezStabilizator: stan.przezStabilizator,
      }),
    [stan],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/urzadzenie-12v-bezposrednio" />
      <NaglowekEkranu tytul="Czy mogę podłączyć urządzenie 12 V bezpośrednio?">
        „12 V” na akumulatorze to uproszczenie — realnie od 11 V do 14,5 V. Nie każde urządzenie to wytrzyma. Moduł 12.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Napięcie instalacji (akumulatora)"
          value={stan.napiecieSystemuV}
          onChange={(e) =>
            setStan((prev) => ({ ...prev, napiecieSystemuV: Number(e.target.value) as FormularzStan["napiecieSystemuV"] }))
          }
        >
          <option value={0}>— wybierz —</option>
          <option value={12}>12 V</option>
          <option value={24}>24 V</option>
        </PoleSelect>
        <Pole
          label="Napięcie urządzenia"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.napiecieUrzadzeniaV}
          onChange={(e) => setStan((prev) => ({ ...prev, napiecieUrzadzeniaV: e.target.value }))}
        />
        <Pole
          label="Tolerancja napięcia urządzenia"
          unit="± %"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.tolerancjaPct}
          onChange={(e) => setStan((prev) => ({ ...prev, tolerancjaPct: e.target.value }))}
          hint="Z instrukcji lub tabliczki. Gdy podany jest zakres (np. 10–16 V), przelicz go na ± % od napięcia znamionowego."
        />
        <PoleCheckbox
          id={idStabilizator}
          label="Zasilam przez stabilizator lub przetwornicę DC-DC"
          checked={stan.przezStabilizator}
          onChange={(e) => setStan((prev) => ({ ...prev, przezStabilizator: e.target.checked }))}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : "ok"}
          etykieta={hasCritical ? "Nie podłączaj wprost" : stan.przezStabilizator ? "Przez stabilizator" : "Można podłączyć wprost"}
        >
          <WynikGlowny>
            {f1(v.urzadzenieMinV)}–{f1(v.urzadzenieMaxV)} V
          </WynikGlowny>
          <p className="mt-1 text-small">
            Urządzenie znosi {f1(v.urzadzenieMinV)}–{f1(v.urzadzenieMaxV)} V · akumulator daje {f1(v.akuMinV)}–{f1(v.akuMaxV)} V
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
