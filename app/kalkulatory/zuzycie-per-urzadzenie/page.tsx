"use client"

import { useMemo } from "react"
import { calculateZuzyciePerUrzadzenie } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/calculator"
import type { PozycjaZuzycia } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = { urzadzenia: PozycjaZuzycia[] }

const nowaPozycja = (): PozycjaZuzycia => ({
  id: crypto.randomUUID(),
  nazwa: "",
  mocW: 0,
  godzinNaDobe: 0,
  cykliczne: false,
  wspolczynnikPracyPct: 0,
})

const STAN_POCZATKOWY: FormularzStan = { urzadzenia: [] }

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const pole = (x: number) => (x === 0 ? "" : String(x))

export default function ZuzyciePerUrzadzeniePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zuzycie-per-urzadzenie", STAN_POCZATKOWY)
  const urzadzenia = stan.urzadzenia

  function aktualizuj(id: string, zmiana: Partial<PozycjaZuzycia>) {
    setStan((prev) => ({ urzadzenia: prev.urzadzenia.map((u) => (u.id === id ? { ...u, ...zmiana } : u)) }))
  }

  const result = useMemo(() => calculateZuzyciePerUrzadzenie({ urzadzenia }), [urzadzenia])

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zuzycie-per-urzadzenie" />
      <NaglowekEkranu tytul="Zużycie energii per urządzenie">
        Moc × czas pracy — a dla lodówki czy klimatyzatora jeszcze × współczynnik pracy sprężarki, bo nie pracuje ona bez
        przerwy. Moduł 12.
      </NaglowekEkranu>

      <ul className="flex flex-col gap-4">
        {urzadzenia.map((u, i) => (
          <li key={u.id} className="flex flex-col gap-3 rounded-md border p-3">
            <Pole
              label={`Urządzenie ${i + 1}`}
              placeholder="np. lodówka turystyczna"
              value={u.nazwa}
              onChange={(e) => aktualizuj(u.id, { nazwa: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Pole label="Moc" unit="W" type="number" inputMode="decimal" min={0} value={pole(u.mocW)} onChange={(e) => aktualizuj(u.id, { mocW: Number(e.target.value) })} />
              <Pole label="Włączone" unit="h/dobę" type="number" inputMode="decimal" min={0} max={24} value={pole(u.godzinNaDobe)} onChange={(e) => aktualizuj(u.id, { godzinNaDobe: Number(e.target.value) })} />
            </div>
            <PoleCheckbox
              id={`${u.id}-cykliczne`}
              label="Pracuje cyklicznie (sprężarka — lodówka, klimatyzator)"
              checked={u.cykliczne}
              onChange={(e) => aktualizuj(u.id, { cykliczne: e.target.checked })}
            />
            {u.cykliczne && (
              <Pole
                label="Współczynnik pracy sprężarki"
                unit="%"
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                value={pole(u.wspolczynnikPracyPct)}
                onChange={(e) => aktualizuj(u.id, { wspolczynnikPracyPct: Number(e.target.value) })}
                hint="Jaką część czasu sprężarka faktycznie pracuje. Przykład ze źródła: lodówka turystyczna ok. 40% przy 25 °C otoczenia — w upale więcej."
              />
            )}
            <button
              type="button"
              onClick={() => setStan((prev) => ({ urzadzenia: prev.urzadzenia.filter((x) => x.id !== u.id) }))}
              className="self-start text-caption text-muted-foreground underline"
              aria-label={`Usuń ${u.nazwa || `urządzenie ${i + 1}`}`}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setStan((prev) => ({ urzadzenia: [...prev.urzadzenia, nowaPozycja()] }))}
        className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
      >
        + Dodaj urządzenie
      </button>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Dodaj urządzenie z mocą i czasem pracy (a dla cyklicznych — ze współczynnikiem pracy), żeby zobaczyć zużycie.
        </p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Zużycie na dobę">
          <WynikGlowny>{f0(result.value.sumaWh)} Wh</WynikGlowny>
          <ul className="mt-1 text-small">
            {result.value.urzadzenia.map((u, i) => (
              <li key={u.id}>
                {u.nazwa || `Urządzenie ${i + 1}`}: {f0(u.zuzycieWh)} Wh
              </li>
            ))}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
