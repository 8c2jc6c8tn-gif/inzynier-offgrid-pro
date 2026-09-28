"use client"

import { useMemo } from "react"
import { calculateRyzykoZamarzniecia } from "@/lib/core/modules/stress-test/ryzyko-zamarzniecia/calculator"
import type {
  InstalacjaGruntowa,
  MetodaRozmrazania,
  TypInstalacjiGruntowej,
} from "@/lib/core/modules/stress-test/ryzyko-zamarzniecia/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  glebokoscPrzemarzaniaCm: string
  instalacje: InstalacjaGruntowa[]
  metodaRozmrazania: MetodaRozmrazania
}

const STAN_POCZATKOWY: FormularzStan = { glebokoscPrzemarzaniaCm: "", instalacje: [], metodaRozmrazania: "nie-dotyczy" }

const TYPY: { id: TypInstalacjiGruntowej; label: string }[] = [
  { id: "kabel", label: "Kabel ziemny" },
  { id: "rura-wodna", label: "Rura wodna" },
  { id: "uziom", label: "Uziom" },
  { id: "inne", label: "Inne" },
]

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function RyzykoZamarznieciaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ryzyko-zamarzniecia", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<InstalacjaGruntowa>) {
    setStan((prev) => ({ ...prev, instalacje: prev.instalacje.map((e) => (e.id === id ? { ...e, ...zmiana } : e)) }))
  }

  const result = useMemo(
    () =>
      calculateRyzykoZamarzniecia({
        glebokoscPrzemarzaniaCm: stan.glebokoscPrzemarzaniaCm === "" ? null : Number(stan.glebokoscPrzemarzaniaCm),
        instalacje: stan.instalacje,
        metodaRozmrazania: stan.metodaRozmrazania,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ryzyko-zamarzniecia" />
      <NaglowekEkranu tytul="Ryzyko zamarznięcia — grunt">
        Czy kable, rury i uziomy leżą poniżej strefy przemarzania, i jak bezpiecznie rozmrozić rurę. Moduł 7.
      </NaglowekEkranu>

      <Pole
        label="Głębokość przemarzania gruntu"
        unit="cm"
        type="number"
        inputMode="decimal"
        min={0}
        value={stan.glebokoscPrzemarzaniaCm}
        onChange={(e) => setStan((prev) => ({ ...prev, glebokoscPrzemarzaniaCm: e.target.value }))}
        hint="Z mapy stref przemarzania dla Twojej lokalizacji albo z projektu budowlanego."
      />

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">Co leży w gruncie</p>
        <p className="text-caption text-muted-foreground">Głębokość do wierzchu kabla, rury lub uziomu.</p>
        <ul className="flex flex-col gap-3">
          {stan.instalacje.map((e, i) => {
            const opis = e.nazwa || `instalacja ${i + 1}`
            return (
              <li key={e.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder="Nazwa"
                  value={e.nazwa}
                  onChange={(ev) => aktualizuj(e.id, { nazwa: ev.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={`Nazwa — instalacja ${i + 1}`}
                />
                <select
                  value={e.typ}
                  onChange={(ev) => aktualizuj(e.id, { typ: ev.target.value as TypInstalacjiGruntowej })}
                  className={pole}
                  aria-label={`Typ — ${opis}`}
                >
                  {TYPY.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="cm"
                  value={e.glebokoscCm ?? ""}
                  onChange={(ev) => aktualizuj(e.id, { glebokoscCm: ev.target.value === "" ? null : Number(ev.target.value) })}
                  className={`${pole} w-20`}
                  aria-label={`Głębokość ułożenia [cm] — ${opis}`}
                />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, instalacje: prev.instalacje.filter((x) => x.id !== e.id) }))}
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
              instalacje: [...prev.instalacje, { id: crypto.randomUUID(), nazwa: "", typ: "kabel", glebokoscCm: null }],
            }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          + Dodaj instalację
        </button>
      </div>

      <PoleSelect
        label="Jak rozmrozisz zamarzniętą rurę?"
        value={stan.metodaRozmrazania}
        onChange={(e) => setStan((prev) => ({ ...prev, metodaRozmrazania: e.target.value as MetodaRozmrazania }))}
      >
        <option value="nie-dotyczy">Nie dotyczy</option>
        <option value="kabel-grzewczy">Kabel grzewczy</option>
        <option value="otwarty-ogien">Otwarty ogień / palnik</option>
      </PoleSelect>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz głębokość przemarzania i dodaj co najmniej jedną instalację.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? "Instalacja zagrożona mrozem" : hasWarning ? "Za mały zapas pod strefą" : "Poniżej strefy przemarzania"}
        >
          {result.value.oceny.length > 0 && (
            <>
              <WynikGlowny>
                {result.value.liczbaWStrefie} z {result.value.oceny.length} w strefie przemarzania
              </WynikGlowny>
              <ul className="mt-2 flex flex-col gap-1 text-small">
                {result.value.oceny.map((o) => (
                  <li key={o.id}>
                    {o.zapasCm === null ? "ℹ️" : o.wStrefiePrzemarzania ? "🔴" : o.zapasCm < 0 ? "🟡" : "✅"} {o.nazwa}
                    {o.zapasCm === null ? " — brak głębokości" : ` — wymagane ≥ ${f0(o.wymaganaCm)} cm, zapas ${f0(o.zapasCm)} cm`}
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
