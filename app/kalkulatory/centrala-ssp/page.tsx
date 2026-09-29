"use client"

import { useMemo } from "react"
import { calculateCentralaSsp } from "@/lib/core/modules/bezpieczenstwo/centrala-ssp/calculator"
import type { InterfejsCentrali, StanCentrali } from "@/lib/core/modules/bezpieczenstwo/centrala-ssp/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Flagi = "odbieraAlarm" | "odbieraAwarie" | "odbieraRozbrojenie" | "logujeZdarzenia"
type FormularzStan = { interfejs: InterfejsCentrali | ""; stanCentrali: StanCentrali | "" } & Record<Flagi, boolean>

const STAN_POCZATKOWY: FormularzStan = {
  interfejs: "",
  stanCentrali: "",
  odbieraAlarm: false,
  odbieraAwarie: false,
  odbieraRozbrojenie: false,
  logujeZdarzenia: false,
}

const FLAGI: { pole: Flagi; label: string }[] = [
  { pole: "odbieraAlarm", label: "Sterownik odbiera sygnał alarmu" },
  { pole: "odbieraAwarie", label: "Sterownik odbiera sygnał awarii centrali" },
  { pole: "odbieraRozbrojenie", label: "Sterownik odbiera sygnał rozbrojenia" },
  { pole: "logujeZdarzenia", label: "Zdarzenia są logowane" },
]

export default function CentralaSspPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("centrala-ssp", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateCentralaSsp({
        ...stan,
        interfejs: stan.interfejs === "" ? null : stan.interfejs,
        stanCentrali: stan.stanCentrali === "" ? null : stan.stanCentrali,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/centrala-ssp" />
      <NaglowekEkranu tytul="Centrala sygnalizacji pożaru — wejścia" ekran="centrala-ssp" wzor={result.formula}>
        Centrala pożarowa to serce ochrony — sterownik musi z nią „rozmawiać” bez zakłóceń, bo od niej zależy, czy reszta
        systemu w ogóle dowie się o zagrożeniu. Moduł 8, Ekran 5.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Połączenie z centralą"
          value={stan.interfejs}
          onChange={(e) => setStan((prev) => ({ ...prev, interfejs: e.target.value as FormularzStan["interfejs"] }))}
          pomoc={<PomocPola ekran="centrala-ssp" pole="polaczenie" />}
        >
          <option value="">— wybierz —</option>
          <option value="styki">Styki bezpotencjałowe</option>
          <option value="rs485">RS485</option>
        </PoleSelect>
        <PoleSelect
          label="Stan centrali"
          value={stan.stanCentrali}
          onChange={(e) => setStan((prev) => ({ ...prev, stanCentrali: e.target.value as FormularzStan["stanCentrali"] }))}
          pomoc={<PomocPola ekran="centrala-ssp" pole="stan" />}
        >
          <option value="">— wybierz —</option>
          <option value="dozor">Dozór (sprawna)</option>
          <option value="awaria">Zgłasza awarię</option>
        </PoleSelect>
        {FLAGI.map(({ pole, label }) => (
          <PoleCheckbox
            key={pole}
            id={`ssp-${pole}`}
            label={label}
            checked={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.checked }))}
          />
        ))}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz połączenie i stan centrali.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? "Centrala niesprawna" : hasWarning ? "System może nie dowiedzieć się o zagrożeniu" : "Integracja kompletna"}
        >
          <WynikGlowny>Braki: {result.value.liczbaBrakow}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
