"use client"

import { useMemo } from "react"
import { calculateOswietlenieAwaryjne } from "@/lib/core/modules/bezpieczenstwo/oswietlenie-awaryjne/calculator"
import type { LampaAwaryjna, StanLampy, ZasilanieLamp } from "@/lib/core/modules/bezpieczenstwo/oswietlenie-awaryjne/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type LampaWiersz = LampaAwaryjna & { id: string }
type FormularzStan = { zasilanie: ZasilanieLamp | ""; lampy: LampaWiersz[]; oswietlenieZewnetrzne: boolean }

const STAN_POCZATKOWY: FormularzStan = { zasilanie: "", lampy: [], oswietlenieZewnetrzne: false }

const STANY: { id: StanLampy; label: string }[] = [
  { id: "nietestowana", label: "Nietestowana" },
  { id: "sprawna", label: "Sprawna" },
  { id: "niesprawna", label: "Niesprawna" },
]

const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function OswietlenieAwaryjnePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("oswietlenie-awaryjne", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<LampaWiersz>) {
    setStan((prev) => ({ ...prev, lampy: prev.lampy.map((l) => (l.id === id ? { ...l, ...zmiana } : l)) }))
  }

  const result = useMemo(
    () =>
      calculateOswietlenieAwaryjne({
        zasilanie: stan.zasilanie === "" ? null : stan.zasilanie,
        lampy: stan.lampy,
        oswietlenieZewnetrzne: stan.oswietlenieZewnetrzne,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const { sprawne, niesprawne, nietestowane } = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/oswietlenie-awaryjne" />
      <NaglowekEkranu tytul="Oświetlenie awaryjne" ekran="oswietlenie-awaryjne" wzor={result.formula}>
        W dymie nie widać drogi — awaria lampy na trasie ewakuacji musi być widoczna, zanim będzie potrzebna. Moduł 8, Ekran 7.
      </NaglowekEkranu>

      <PoleSelect
        label="Zasilanie lamp"
        value={stan.zasilanie}
        onChange={(e) => setStan((prev) => ({ ...prev, zasilanie: e.target.value as FormularzStan["zasilanie"] }))}
        pomoc={<PomocPola ekran="oswietlenie-awaryjne" pole="zasilanie" />}
      >
        <option value="">— wybierz —</option>
        <option value="ups">Z UPS</option>
        <option value="wlasne-akumulatory">Własne akumulatory w lampach</option>
      </PoleSelect>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">Lampy na drogach ewakuacji</p>
        <p className="text-caption text-muted-foreground">Stan z ostatniego testu. Bez testu — „nietestowana”.</p>
        <p className="flex items-center gap-3 text-caption text-muted-foreground">
          <span className="flex items-center gap-1">
            Miejsce <PomocPola ekran="oswietlenie-awaryjne" pole="miejsce" />
          </span>
          <span className="flex items-center gap-1">
            Stan <PomocPola ekran="oswietlenie-awaryjne" pole="stanLampy" />
          </span>
        </p>
        <ul className="flex flex-col gap-3">
          {stan.lampy.map((l, i) => {
            const opis = l.nazwa || `lampa ${i + 1}`
            return (
              <li key={l.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder="Miejsce"
                  value={l.nazwa}
                  onChange={(e) => aktualizuj(l.id, { nazwa: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={`Miejsce — lampa ${i + 1}`}
                />
                <select
                  value={l.stan}
                  onChange={(e) => aktualizuj(l.id, { stan: e.target.value as StanLampy })}
                  className={pole}
                  aria-label={`Stan — ${opis}`}
                >
                  {STANY.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, lampy: prev.lampy.filter((x) => x.id !== l.id) }))}
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
            setStan((prev) => ({ ...prev, lampy: [...prev.lampy, { id: crypto.randomUUID(), nazwa: "", stan: "nietestowana" }] }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          + Dodaj lampę
        </button>
      </div>

      <PoleCheckbox
        id="osw-zewnetrzne"
        label="Oświetlenie zewnętrzne dla służb włącza się po alarmie"
        checked={stan.oswietlenieZewnetrzne}
        onChange={(e) => setStan((prev) => ({ ...prev, oswietlenieZewnetrzne: e.target.checked }))}
      />

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz zasilanie i dodaj co najmniej jedną lampę.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? "Niesprawna lampa na trasie ewakuacji" : hasWarning ? "Nie wszystkie lampy przetestowane" : "Oświetlenie ewakuacyjne sprawne"}
        >
          <WynikGlowny>
            {sprawne} z {sprawne + niesprawne + nietestowane} sprawnych
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <p className="text-caption text-muted-foreground">
        Adaptacyjna trasa ewakuacji (omijanie ognia i dymu) wymaga mapy budynku i czujników na żywo — jeszcze nie w aplikacji.
      </p>
    </main>
  )
}
