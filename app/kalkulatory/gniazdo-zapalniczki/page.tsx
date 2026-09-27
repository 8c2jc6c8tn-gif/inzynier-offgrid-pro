"use client"

import { useMemo } from "react"
import { calculateGniazdoZapalniczki } from "@/lib/core/modules/kalkulator-mobilny/gniazdo-zapalniczki/calculator"
import type { GniazdoZapalniczkiInput, UrzadzenieGniazda } from "@/lib/core/modules/kalkulator-mobilny/gniazdo-zapalniczki/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  napiecieV: GniazdoZapalniczkiInput["napiecieV"]
  pradBezpiecznikaA: string
  urzadzenia: UrzadzenieGniazda[]
}

const STAN_POCZATKOWY: FormularzStan = { napiecieV: 0, pradBezpiecznikaA: "", urzadzenia: [] }

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export default function GniazdoZapalniczkiPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("gniazdo-zapalniczki", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<UrzadzenieGniazda>) {
    setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.map((u) => (u.id === id ? { ...u, ...zmiana } : u)) }))
  }

  const result = useMemo(
    () =>
      calculateGniazdoZapalniczki({
        napiecieV: stan.napiecieV,
        pradBezpiecznikaA: stan.pradBezpiecznikaA === "" ? 0 : Number(stan.pradBezpiecznikaA),
        urzadzenia: stan.urzadzenia,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/gniazdo-zapalniczki" />
      <NaglowekEkranu tytul="Gniazdo zapalniczki — co można podłączyć">
        Gniazdo zapalniczki ma własny, niewielki bezpiecznik. Lodówka turystyczna zwykle tak, kompresor do opon na granicy,
        sprzęt powyżej ok. 180 W raczej nie. Moduł 12.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Napięcie instalacji pojazdu"
          value={stan.napiecieV}
          onChange={(e) => setStan((prev) => ({ ...prev, napiecieV: Number(e.target.value) as FormularzStan["napiecieV"] }))}
        >
          <option value={0}>— wybierz —</option>
          <option value={12}>12 V (samochód osobowy, kamper)</option>
          <option value={24}>24 V (ciężarówka, autobus)</option>
        </PoleSelect>
        <Pole
          label="Bezpiecznik gniazda"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.pradBezpiecznikaA}
          onChange={(e) => setStan((prev) => ({ ...prev, pradBezpiecznikaA: e.target.value }))}
          hint="Z instrukcji pojazdu lub opisu skrzynki bezpieczników — typowo 10–15 A."
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">Urządzenia włączone jednocześnie (także przez rozgałęźnik)</p>
        <ul className="flex flex-col gap-2">
          {stan.urzadzenia.map((u, i) => (
            <li key={u.id} className="flex flex-wrap items-center gap-2">
              <input
                placeholder="Nazwa urządzenia"
                value={u.nazwa}
                onChange={(e) => aktualizuj(u.id, { nazwa: e.target.value })}
                className="min-h-10 min-w-24 flex-1 rounded-md border border-input bg-background px-2"
                aria-label={`Nazwa — urządzenie ${i + 1}`}
              />
              <input
                type="number"
                inputMode="decimal"
                placeholder="W"
                value={u.mocW || ""}
                onChange={(e) => aktualizuj(u.id, { mocW: Number(e.target.value) })}
                className="min-h-10 w-20 rounded-md border border-input bg-background px-2"
                aria-label={`Moc [W] — ${u.nazwa || `urządzenie ${i + 1}`}`}
              />
              <button
                type="button"
                onClick={() => setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.filter((x) => x.id !== u.id) }))}
                className="text-caption text-muted-foreground underline"
                aria-label={`Usuń ${u.nazwa || `urządzenie ${i + 1}`}`}
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setStan((prev) => ({ ...prev, urzadzenia: [...prev.urzadzenia, { id: crypto.randomUUID(), nazwa: "", mocW: 0 }] }))}
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          + Dodaj urządzenie
        </button>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz napięcie, wpisz bezpiecznik i dodaj urządzenie z mocą.</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : "ok"} etykieta={hasCritical ? "Gniazdo przeciążone" : "Gniazdo wytrzyma"}>
          <WynikGlowny>{f1(result.value.pradA)} A</WynikGlowny>
          <p className="mt-1 text-small">
            {f0(result.value.sumaMocyW)} W z {f0(result.value.mocMaxW)} W dostępnych · {f0(result.value.obciazeniePct)}% bezpiecznika
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
