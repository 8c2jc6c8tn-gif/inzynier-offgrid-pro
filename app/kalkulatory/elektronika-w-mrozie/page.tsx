"use client"

import { useMemo } from "react"
import { calculateElektronikaWMrozie } from "@/lib/core/modules/stress-test/elektronika-w-mrozie/calculator"
import { jestKrytyczny } from "@/lib/core/modules/stress-test/elektronika-w-mrozie/constants"
import type { TypElektroniki, UrzadzenieElektroniczne } from "@/lib/core/modules/stress-test/elektronika-w-mrozie/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  temperaturaMiejscaC: string
  urzadzenia: UrzadzenieElektroniczne[]
}

const STAN_POCZATKOWY: FormularzStan = { temperaturaMiejscaC: "", urzadzenia: [] }

const TYPY: { id: TypElektroniki; label: string }[] = [
  { id: "BMS", label: "BMS" },
  { id: "przetwornica", label: "Przetwornica / falownik" },
  { id: "wyswietlacz", label: "Wyświetlacz LCD" },
  { id: "czujnik", label: "Czujnik" },
  { id: "regulator", label: "Regulator ładowania (MPPT/PWM)" },
  { id: "inne", label: "Inne" },
]

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function ElektronikaWMroziePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("elektronika-w-mrozie", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<UrzadzenieElektroniczne>) {
    setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.map((u) => (u.id === id ? { ...u, ...zmiana } : u)) }))
  }

  const result = useMemo(
    () =>
      calculateElektronikaWMrozie({
        temperaturaMiejscaC: stan.temperaturaMiejscaC === "" ? null : Number(stan.temperaturaMiejscaC),
        urzadzenia: stan.urzadzenia,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/elektronika-w-mrozie" />
      <NaglowekEkranu tytul="Elektronika w mrozie" ekran="elektronika-w-mrozie" wzor={result.formula}>
        Które urządzenia przestaną działać poprawnie przy najniższej temperaturze w miejscu montażu. Moduł 7.
      </NaglowekEkranu>

      <Pole
        label="Najniższa temperatura w miejscu montażu"
        unit="°C"
        type="number"
        inputMode="decimal"
        value={stan.temperaturaMiejscaC}
        onChange={(e) => setStan((prev) => ({ ...prev, temperaturaMiejscaC: e.target.value }))}
        pomoc={<PomocPola ekran="elektronika-w-mrozie" pole="temp" />}
      />

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">Urządzenia w tym miejscu</p>
        <p className="text-caption text-muted-foreground">
          Minimalną temperaturę pracy („operating temperature”) przepisz z karty katalogowej.
        </p>
        <ul className="flex flex-col gap-3">
          {stan.urzadzenia.map((u, i) => {
            const opis = u.nazwa || `urządzenie ${i + 1}`
            return (
              <li key={u.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder="Nazwa"
                  value={u.nazwa}
                  onChange={(e) => aktualizuj(u.id, { nazwa: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={`Nazwa — urządzenie ${i + 1}`}
                />
                <PomocPola ekran="elektronika-w-mrozie" pole="nazwa" />
                <select
                  value={u.typ}
                  onChange={(e) => aktualizuj(u.id, { typ: e.target.value as TypElektroniki })}
                  className={pole}
                  aria-label={`Typ — ${opis}`}
                >
                  {TYPY.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="elektronika-w-mrozie" pole="typ" />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="min °C"
                  value={u.minTempPracyC ?? ""}
                  onChange={(e) => aktualizuj(u.id, { minTempPracyC: e.target.value === "" ? null : Number(e.target.value) })}
                  className={`${pole} w-24`}
                  aria-label={`Minimalna temperatura pracy [°C] — ${opis}`}
                />
                <PomocPola ekran="elektronika-w-mrozie" pole="tempMin" />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.filter((x) => x.id !== u.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={`Usuń ${opis}`}
                >
                  Usuń
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() =>
            setStan((prev) => ({
              ...prev,
              urzadzenia: [...prev.urzadzenia, { id: crypto.randomUUID(), nazwa: "", typ: "BMS", minTempPracyC: null }],
            }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          + Dodaj urządzenie
        </button>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz temperaturę i dodaj co najmniej jedno urządzenie.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? "BMS nie wystartuje w tym miejscu" : hasWarning ? "Część sprzętu poza zakresem pracy" : "Sprzęt pracuje w zakresie"}
        >
          <WynikGlowny>
            {result.value.liczbaPonizejMin} z {result.value.oceny.length} poniżej minimum
          </WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {result.value.oceny.map((o) => (
              <li key={o.id}>
                {o.zapasK === null ? "ℹ️" : o.zapasK < 0 ? (jestKrytyczny(o.typ) ? "🔴" : "🟡") : "✅"} {o.nazwa}
                {o.zapasK === null ? " — brak danych z karty" : ` — zapas ${f0(o.zapasK)} K`}
              </li>
            ))}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
