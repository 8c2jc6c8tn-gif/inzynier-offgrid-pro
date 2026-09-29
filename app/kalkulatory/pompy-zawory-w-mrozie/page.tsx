"use client"

import { useId, useMemo } from "react"
import { calculatePompyZaworyWMrozie } from "@/lib/core/modules/stress-test/pompy-zawory-w-mrozie/calculator"
import type { ElementArmatury, TypArmatury } from "@/lib/core/modules/stress-test/pompy-zawory-w-mrozie/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  temperaturaMiejscaC: string
  elementy: ElementArmatury[]
  maZaworZewnetrzny: boolean
  zaworZewnetrznyOprozniony: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  temperaturaMiejscaC: "",
  elementy: [],
  maZaworZewnetrzny: false,
  zaworZewnetrznyOprozniony: false,
}

const TYPY: { id: TypArmatury; label: string }[] = [
  { id: "pompa", label: "Pompa (ciepła, obiegowa, głębinowa)" },
  { id: "zawor", label: "Zawór" },
  { id: "silownik", label: "Siłownik" },
  { id: "inne", label: "Inne" },
]

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function PompyZaworyWMroziePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pompy-zawory-w-mrozie", STAN_POCZATKOWY)
  const idZawor = useId()
  const idOprozniony = useId()

  function aktualizuj(id: string, zmiana: Partial<ElementArmatury>) {
    setStan((prev) => ({ ...prev, elementy: prev.elementy.map((e) => (e.id === id ? { ...e, ...zmiana } : e)) }))
  }

  const result = useMemo(
    () =>
      calculatePompyZaworyWMrozie({
        temperaturaMiejscaC: stan.temperaturaMiejscaC === "" ? null : Number(stan.temperaturaMiejscaC),
        elementy: stan.elementy,
        maZaworZewnetrzny: stan.maZaworZewnetrzny,
        zaworZewnetrznyOprozniony: stan.zaworZewnetrznyOprozniony,
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pompy-zawory-w-mrozie" />
      <NaglowekEkranu tytul="Pompy i zawory w mrozie" ekran="pompy-zawory-w-mrozie" wzor={result.formula}>
        Które pompy, zawory i siłowniki mogą się zablokować przy najniższej temperaturze w miejscu montażu. Moduł 7.
      </NaglowekEkranu>

      <Pole
        label="Najniższa temperatura w miejscu montażu"
        unit="°C"
        type="number"
        inputMode="decimal"
        value={stan.temperaturaMiejscaC}
        onChange={(e) => setStan((prev) => ({ ...prev, temperaturaMiejscaC: e.target.value }))}
        pomoc={<PomocPola ekran="pompy-zawory-w-mrozie" pole="temp" />}
      />

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">Pompy, zawory i siłowniki w tym miejscu</p>
        <p className="text-caption text-muted-foreground">
          Minimalną temperaturę pracy („operating temperature”) przepisz z karty katalogowej.
        </p>
        <ul className="flex flex-col gap-3">
          {stan.elementy.map((e, i) => {
            const opis = e.nazwa || `element ${i + 1}`
            return (
              <li key={e.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder="Nazwa"
                  value={e.nazwa}
                  onChange={(ev) => aktualizuj(e.id, { nazwa: ev.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={`Nazwa — element ${i + 1}`}
                />
                <PomocPola ekran="pompy-zawory-w-mrozie" pole="nazwa" />
                <select
                  value={e.typ}
                  onChange={(ev) => aktualizuj(e.id, { typ: ev.target.value as TypArmatury })}
                  className={`${pole} max-w-full`}
                  aria-label={`Typ — ${opis}`}
                >
                  {TYPY.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="pompy-zawory-w-mrozie" pole="typ" />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="min °C"
                  value={e.minTempPracyC ?? ""}
                  onChange={(ev) =>
                    aktualizuj(e.id, { minTempPracyC: ev.target.value === "" ? null : Number(ev.target.value) })
                  }
                  className={`${pole} w-24`}
                  aria-label={`Minimalna temperatura pracy [°C] — ${opis}`}
                />
                <PomocPola ekran="pompy-zawory-w-mrozie" pole="tempMin" />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, elementy: prev.elementy.filter((x) => x.id !== e.id) }))}
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
              elementy: [...prev.elementy, { id: crypto.randomUUID(), nazwa: "", typ: "pompa", minTempPracyC: null }],
            }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          + Dodaj element
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <PoleCheckbox
          id={idZawor}
          label="Mam zawór zewnętrzny do wody ogrodowej"
          checked={stan.maZaworZewnetrzny}
          onChange={(e) => setStan((prev) => ({ ...prev, maZaworZewnetrzny: e.target.checked }))}
        />
        {stan.maZaworZewnetrzny && (
          <PoleCheckbox
            id={idOprozniony}
            label="Zawór zewnętrzny jest opróżniony na zimę"
            checked={stan.zaworZewnetrznyOprozniony}
            onChange={(e) => setStan((prev) => ({ ...prev, zaworZewnetrznyOprozniony: e.target.checked }))}
          />
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz temperaturę i dodaj co najmniej jeden element.</p>
      ) : (
        <WerdyktPanel
          poziom={hasWarning ? "uwaga" : "ok"}
          etykieta={hasWarning ? "Przygotuj pompy i zawory na mróz" : "Pompy i zawory w zakresie"}
        >
          {result.value.oceny.length > 0 && (
            <>
              <WynikGlowny>
                {result.value.liczbaPonizejMin} z {result.value.oceny.length} poniżej minimum
              </WynikGlowny>
              <ul className="mt-2 flex flex-col gap-1 text-small">
                {result.value.oceny.map((o) => (
                  <li key={o.id}>
                    {o.zapasK === null ? "ℹ️" : o.zapasK < 0 ? "🟡" : "✅"} {o.nazwa}
                    {o.zapasK === null ? " — brak danych z karty" : ` — zapas ${f0(o.zapasK)} K`}
                  </li>
                ))}
              </ul>
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
