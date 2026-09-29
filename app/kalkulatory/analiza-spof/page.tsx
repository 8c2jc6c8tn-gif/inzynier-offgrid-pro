"use client"

import { useMemo } from "react"
import { calculateAnalizaSpof } from "@/lib/core/modules/stress-test/analiza-spof/calculator"
import type { KomponentSystemu, TypKomponentu } from "@/lib/core/modules/stress-test/analiza-spof/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { PomocPola } from "@/components/ui/pomoc"

type Wiersz = KomponentSystemu & { id: string }
type FormularzStan = { komponenty: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = { komponenty: [] }

const TYPY: { id: TypKomponentu; label: string }[] = [
  { id: "bms", label: "BMS" },
  { id: "falownik", label: "Falownik" },
  { id: "bezpiecznik-glowny", label: "Bezpiecznik główny" },
  { id: "mppt", label: "Regulator MPPT" },
  { id: "pompa-ciepla", label: "Pompa ciepła" },
  { id: "pompa", label: "Pompa (woda, obieg)" },
  { id: "czujnik", label: "Czujnik" },
  { id: "inne", label: "Inne" },
]

const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function AnalizaSpofPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("analiza-spof", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<Wiersz>) {
    setStan((prev) => ({ komponenty: prev.komponenty.map((k) => (k.id === id ? { ...k, ...zmiana } : k)) }))
  }

  const result = useMemo(() => calculateAnalizaSpof({ komponenty: stan.komponenty }), [stan])
  const hasCritical = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/analiza-spof" />
      <NaglowekEkranu tytul="Analiza SPOF — pojedyncze punkty awarii" ekran="analiza-spof" wzor={result.formula}>
        Jeden element może pociągnąć cały system na dno — trzeba go znaleźć, zanim znajdzie go zima. Moduł 7, Ekran 10.
      </NaglowekEkranu>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">Komponenty systemu</p>
        <p className="text-caption text-muted-foreground">
          Zaznacz „redundancja”, jeśli jest drugi egzemplarz, obejście, zapas na półce albo źródło awaryjne.
        </p>
        <ul className="flex flex-col gap-3">
          {stan.komponenty.map((k, i) => {
            const opis = k.nazwa || `komponent ${i + 1}`
            return (
              <li key={k.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder="Nazwa"
                  value={k.nazwa}
                  onChange={(e) => aktualizuj(k.id, { nazwa: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={`Nazwa — komponent ${i + 1}`}
                />
                <PomocPola ekran="analiza-spof" pole="nazwa" />
                <select
                  value={k.typ}
                  onChange={(e) => aktualizuj(k.id, { typ: e.target.value as TypKomponentu })}
                  className={pole}
                  aria-label={`Typ — ${opis}`}
                >
                  {TYPY.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="analiza-spof" pole="typ" />
                <label className="flex items-center gap-1 text-caption">
                  <input
                    type="checkbox"
                    checked={k.maRedundancje}
                    onChange={(e) => aktualizuj(k.id, { maRedundancje: e.target.checked })}
                    className="h-5 w-5 accent-primary"
                    aria-label={`Redundancja — ${opis}`}
                  />
                  redundancja
                </label>
                <PomocPola ekran="analiza-spof" pole="redundancja" />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ komponenty: prev.komponenty.filter((x) => x.id !== k.id) }))}
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
            setStan((prev) => ({ komponenty: [...prev.komponenty, { id: crypto.randomUUID(), nazwa: "", typ: "bms", maRedundancje: false }] }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          + Dodaj komponent
        </button>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Dodaj komponenty systemu.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : result.value.liczbaSpof > 0 ? "uwaga" : "ok"}
          etykieta={hasCritical ? "Krytyczny pojedynczy punkt awarii" : result.value.liczbaSpof > 0 ? "Są pojedyncze punkty awarii" : "Brak pojedynczych punktów awarii"}
        >
          <WynikGlowny>
            SPOF: {result.value.liczbaSpof} z {result.value.liczbaKomponentow}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
