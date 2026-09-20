"use client"

import { useMemo } from "react"
import { calculateOplacalnoscMagazynu } from "@/lib/core/modules/baterie/oplacalnosc-magazynu/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  cenaBateriiZl: string
  pojemnoscUzytecznaKwh: string
  liczbaCykli: string
  sprawnoscPct: string
  kosztAlternatywyZlZaKwh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  cenaBateriiZl: "",
  pojemnoscUzytecznaKwh: "",
  liczbaCykli: "",
  sprawnoscPct: "",
  kosztAlternatywyZlZaKwh: "",
}

export default function OplacalnoscMagazynuPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("oplacalnosc-magazynu", STAN_POCZATKOWY)
  const { cenaBateriiZl, pojemnoscUzytecznaKwh, liczbaCykli, sprawnoscPct, kosztAlternatywyZlZaKwh } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setCenaBateriiZl = (a: string | ((p: string) => string)) => setPole("cenaBateriiZl", a)
  const setPojemnoscUzytecznaKwh = (a: string | ((p: string) => string)) => setPole("pojemnoscUzytecznaKwh", a)
  const setLiczbaCykli = (a: string | ((p: string) => string)) => setPole("liczbaCykli", a)
  const setSprawnoscPct = (a: string | ((p: string) => string)) => setPole("sprawnoscPct", a)
  const setKosztAlternatywyZlZaKwh = (a: string | ((p: string) => string)) => setPole("kosztAlternatywyZlZaKwh", a)

  const result = useMemo(
    () =>
      calculateOplacalnoscMagazynu({
        cenaBateriiZl: cenaBateriiZl === "" ? 0 : Number(cenaBateriiZl),
        pojemnoscUzytecznaKwh: pojemnoscUzytecznaKwh === "" ? 0 : Number(pojemnoscUzytecznaKwh),
        liczbaCykli: liczbaCykli === "" ? 0 : Number(liczbaCykli),
        sprawnoscPct: sprawnoscPct === "" ? 0 : Number(sprawnoscPct),
        kosztAlternatywyZlZaKwh: kosztAlternatywyZlZaKwh === "" ? null : Number(kosztAlternatywyZlZaKwh),
      }),
    [cenaBateriiZl, pojemnoscUzytecznaKwh, liczbaCykli, sprawnoscPct, kosztAlternatywyZlZaKwh],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID"
        ? "ok"
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/oplacalnosc-magazynu" />
      <NaglowekEkranu tytul="Analiza opłacalności magazynu (True Cost of Storage)">
        Bateria to skarbonka energii, ale sama też kosztuje — dopiero policzenie kosztu za każdą
        oddaną kWh pokazuje, czy się faktycznie opłaca. Moduł 4, Ekran 23.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Cena baterii"
          unit="zł"
          type="number"
          inputMode="decimal"
          value={cenaBateriiZl}
          onChange={(e) => setCenaBateriiZl(e.target.value)}
        />
        <Pole
          label="Pojemność użyteczna"
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={pojemnoscUzytecznaKwh}
          onChange={(e) => setPojemnoscUzytecznaKwh(e.target.value)}
        />
        <Pole
          label="Liczba cykli życia przy wybranym DoD"
          type="number"
          inputMode="numeric"
          value={liczbaCykli}
          onChange={(e) => setLiczbaCykli(e.target.value)}
          hint="Z karty katalogowej albo Ekranu 30 (Porównanie technologii)."
        />
        <Pole
          label="Sprawność magazynu"
          unit="%"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={sprawnoscPct}
          onChange={(e) => setSprawnoscPct(e.target.value)}
        />
        <Pole
          label="Koszt alternatywy (agregat/sieć) — opcjonalnie"
          unit="zł/kWh"
          type="number"
          inputMode="decimal"
          value={kosztAlternatywyZlZaKwh}
          onChange={(e) => setKosztAlternatywyZlZaKwh(e.target.value)}
          hint="Zostaw puste, żeby zobaczyć sam koszt magazynu, bez porównania."
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane, żeby zobaczyć koszt energii z magazynu.
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        poziom !== null &&
        poziom !== "blad" && (
          <WerdyktPanel poziom={poziom} etykieta="Koszt energii z magazynu">
            <WynikGlowny>
              {result.value.kosztZaKwh.toLocaleString("pl-PL", { maximumFractionDigits: 2 })} zł/kWh
            </WynikGlowny>
            <p className="mt-1 text-small">
              Całkowita energia oddana przez baterię w ciągu życia:{" "}
              {result.value.energiaCalkowitaZyciaKwh.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} kWh.
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
