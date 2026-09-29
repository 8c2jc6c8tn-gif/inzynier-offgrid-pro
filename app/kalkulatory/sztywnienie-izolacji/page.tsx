"use client"

import { useId, useMemo } from "react"
import { calculateSztywnienieIzolacji } from "@/lib/core/modules/stress-test/sztywnienie-izolacji/calculator"
import type { MaterialMrozu } from "@/lib/core/modules/stress-test/sztywnienie-izolacji/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { MIN_TEMPERATURA_MATERIALU_C } from "@/lib/core/modules/stress-test/sztywnienie-izolacji/constants"

type FormularzStan = {
  materialy: MaterialMrozu[]
  temperaturaMinimalnaC: string
}

const STAN_POCZATKOWY: FormularzStan = { materialy: [], temperaturaMinimalnaC: "" }

const MATERIALY: { id: MaterialMrozu; label: string; hint: string }[] = [
  { id: "PVC", label: "PVC", hint: "Np. YKY, YDY, peszel i złączki z PVC." },
  { id: "XLPE", label: "XLPE", hint: "Np. kabel solarny, YKXS." },
  { id: "guma", label: "Guma", hint: "Np. przewody OnPD, H07RN-F, uszczelki." },
  { id: "aluminium", label: "Aluminium (żyły, zaciski)", hint: "Np. YAKY, zaciski aluminiowe." },
]

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function SztywnienieIzolacjiPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("sztywnienie-izolacji", STAN_POCZATKOWY)
  const idBazowe = useId()

  const result = useMemo(
    () =>
      calculateSztywnienieIzolacji({
        materialy: stan.materialy,
        temperaturaMinimalnaC: stan.temperaturaMinimalnaC === "" ? null : Number(stan.temperaturaMinimalnaC),
      }),
    [stan],
  )

  const przelacz = (m: MaterialMrozu, zaznaczony: boolean) =>
    setStan((prev) => ({
      ...prev,
      materialy: zaznaczony ? [...prev.materialy.filter((x) => x !== m), m] : prev.materialy.filter((x) => x !== m),
    }))

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/sztywnienie-izolacji" />
      <NaglowekEkranu
        tytul="Sztywnienie izolacji na mrozie"
        ekran="sztywnienie-izolacji"
        wynik={result}
        parametry={{ pvc: MIN_TEMPERATURA_MATERIALU_C.PVC ?? "—", xlpe: MIN_TEMPERATURA_MATERIALU_C.XLPE ?? "—" }}
      >
        Czy izolacja kabli, osłony i złączki wytrzymają najniższą temperaturę w miejscu montażu. Moduł 7.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Najniższa temperatura w miejscu montażu"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={stan.temperaturaMinimalnaC}
          onChange={(e) => setStan((prev) => ({ ...prev, temperaturaMinimalnaC: e.target.value }))}
          pomoc={<PomocPola ekran="sztywnienie-izolacji" pole="temp" />}
        />
        <p className="text-small font-medium">Materiały w instalacji</p>
        {MATERIALY.map((m) => (
          <PoleCheckbox
            key={m.id}
            id={`${idBazowe}-${m.id}`}
            label={m.label}
            hint={m.hint}
            checked={stan.materialy.includes(m.id)}
            onChange={(e) => przelacz(m.id, e.target.checked)}
          />
        ))}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz temperaturę i zaznacz co najmniej jeden materiał.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? "PVC nie wytrzyma tego mrozu" : hasWarning ? "Sprawdź kartę producenta" : "Materiały wytrzymają mróz"}
        >
          <WynikGlowny>{f0(Number(stan.temperaturaMinimalnaC))} °C</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {result.value.oceny.map((o) => (
              <li key={o.material}>
                {o.zapasK === null ? "ℹ️" : o.zapasK < 0 ? (o.material === "PVC" ? "🔴" : "🟡") : "✅"} {o.material}
                {o.progC === null
                  ? " — źródło nie podaje progu"
                  : ` — próg ${f0(o.progC)} °C, zapas ${f0(o.zapasK!)} K`}
              </li>
            ))}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
