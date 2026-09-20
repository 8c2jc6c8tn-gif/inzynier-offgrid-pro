"use client"

import { useMemo } from "react"
import { calculateSecondLife } from "@/lib/core/modules/baterie/second-life/calculator"
import type { MetodaSzacunkuSoh } from "@/lib/core/modules/baterie/second-life/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pojemnoscDeklarowanaKwh: string
  cenaZakupuZl: string
  metodaSzacunku: MetodaSzacunkuSoh
  wiekLata: string
  przebiegKm: string
  cenaNowejLiFePO4ZlZaKwh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscDeklarowanaKwh: "",
  cenaZakupuZl: "",
  metodaSzacunku: "",
  wiekLata: "",
  przebiegKm: "",
  cenaNowejLiFePO4ZlZaKwh: "",
}

export default function SecondLifePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("second-life", STAN_POCZATKOWY)
  const { pojemnoscDeklarowanaKwh, cenaZakupuZl, metodaSzacunku, wiekLata, przebiegKm, cenaNowejLiFePO4ZlZaKwh } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscDeklarowanaKwh = (a: string | ((p: string) => string)) => setPole("pojemnoscDeklarowanaKwh", a)
  const setCenaZakupuZl = (a: string | ((p: string) => string)) => setPole("cenaZakupuZl", a)
  const setMetodaSzacunku = (a: MetodaSzacunkuSoh | ((p: MetodaSzacunkuSoh) => MetodaSzacunkuSoh)) => setPole("metodaSzacunku", a)
  const setWiekLata = (a: string | ((p: string) => string)) => setPole("wiekLata", a)
  const setPrzebiegKm = (a: string | ((p: string) => string)) => setPole("przebiegKm", a)
  const setCenaNowejLiFePO4ZlZaKwh = (a: string | ((p: string) => string)) => setPole("cenaNowejLiFePO4ZlZaKwh", a)

  const result = useMemo(
    () =>
      calculateSecondLife({
        pojemnoscDeklarowanaKwh: pojemnoscDeklarowanaKwh === "" ? 0 : Number(pojemnoscDeklarowanaKwh),
        cenaZakupuZl: cenaZakupuZl === "" ? 0 : Number(cenaZakupuZl),
        metodaSzacunku,
        wiekLata: wiekLata === "" ? 0 : Number(wiekLata),
        przebiegKm: przebiegKm === "" ? 0 : Number(przebiegKm),
        cenaNowejLiFePO4ZlZaKwh: cenaNowejLiFePO4ZlZaKwh === "" ? null : Number(cenaNowejLiFePO4ZlZaKwh),
      }),
    [pojemnoscDeklarowanaKwh, cenaZakupuZl, metodaSzacunku, wiekLata, przebiegKm, cenaNowejLiFePO4ZlZaKwh],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : hasCritical
        ? "blad"
        : result.status === "VALID"
          ? "ok"
          : result.status === "VALID_WITH_WARNINGS"
            ? "uwaga"
            : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/second-life" />
      <NaglowekEkranu tytul="Analiza Second-Life (baterie z EV)">
        Kupujesz kota w worku — bateria z rozbiórki EV może być świetną okazją albo drogim
        rozczarowaniem, zależnie od realnego stanu, nie deklarowanego. Moduł 4, Ekran 17.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Deklarowana pojemność"
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={pojemnoscDeklarowanaKwh}
          onChange={(e) => setPojemnoscDeklarowanaKwh(e.target.value)}
        />
        <Pole
          label="Cena zakupu"
          unit="zł"
          type="number"
          inputMode="decimal"
          value={cenaZakupuZl}
          onChange={(e) => setCenaZakupuZl(e.target.value)}
        />
        <PoleSelect
          label="Metoda szacunku SoH"
          value={metodaSzacunku}
          onChange={(e) => setMetodaSzacunku(e.target.value as MetodaSzacunkuSoh)}
        >
          <option value="">— wybierz —</option>
          <option value="wiek">Z wieku baterii</option>
          <option value="przebieg">Z przebiegu pojazdu</option>
        </PoleSelect>
        {metodaSzacunku === "wiek" && (
          <Pole
            label="Wiek baterii"
            unit="lata"
            type="number"
            inputMode="numeric"
            value={wiekLata}
            onChange={(e) => setWiekLata(e.target.value)}
          />
        )}
        {metodaSzacunku === "przebieg" && (
          <Pole
            label="Przebieg pojazdu"
            unit="km"
            type="number"
            inputMode="numeric"
            value={przebiegKm}
            onChange={(e) => setPrzebiegKm(e.target.value)}
          />
        )}
        <Pole
          label="Cena nowej baterii LiFePO4 — opcjonalnie"
          unit="zł/kWh"
          type="number"
          inputMode="decimal"
          value={cenaNowejLiFePO4ZlZaKwh}
          onChange={(e) => setCenaNowejLiFePO4ZlZaKwh(e.target.value)}
          hint="Zostaw puste, żeby zobaczyć sam koszt tej baterii, bez porównania."
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane, żeby zobaczyć szacowany SoH i koszt za kWh.
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        poziom !== null &&
        poziom !== "blad" && (
          <WerdyktPanel poziom={poziom} etykieta={`Szacowany SoH: ${result.value.sohSzacowanyPct.toFixed(0)}%`}>
            <WynikGlowny>
              {result.value.kosztZaKwh.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł/kWh
            </WynikGlowny>
            <p className="mt-1 text-small">
              Pojemność użyteczna: {result.value.pojemnoscUzytecznaKwh.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} kWh.
            </p>
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-2 text-small">
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
            <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
