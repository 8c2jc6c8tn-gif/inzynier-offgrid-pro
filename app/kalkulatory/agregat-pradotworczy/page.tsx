"use client"

import { useMemo } from "react"
import { calculateAgregatPradotworczy } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  PolaBezpieczenstwaAgregatu,
  naWejscieBezpieczenstwa,
  type BezpieczenstwoAgregatuStan,
} from "@/components/agregat/pola-bezpieczenstwa-agregatu"

type FormularzStan = BezpieczenstwoAgregatuStan & {
  deficytKwh: string
  mocAgregatuKw: string
  sredniZuzycieLH: string
  cenaZaLitrZl: string
  maWyjscieSterujaceBms: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  deficytKwh: "",
  mocAgregatuKw: "",
  sredniZuzycieLH: "",
  cenaZaLitrZl: "",
  maWyjscieSterujaceBms: false,
  miejsceAgregatu: "",
  podlaczenieAgregatu: "",
}

export default function AgregatPradotworczyPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("agregat-pradotworczy", STAN_POCZATKOWY)
  const { deficytKwh, mocAgregatuKw, sredniZuzycieLH, cenaZaLitrZl, maWyjscieSterujaceBms, miejsceAgregatu, podlaczenieAgregatu } =
    stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setDeficytKwh = (a: string | ((p: string) => string)) => setPole("deficytKwh", a)
  const setMocAgregatuKw = (a: string | ((p: string) => string)) => setPole("mocAgregatuKw", a)
  const setSredniZuzycieLH = (a: string | ((p: string) => string)) => setPole("sredniZuzycieLH", a)
  const setCenaZaLitrZl = (a: string | ((p: string) => string)) => setPole("cenaZaLitrZl", a)
  const setMaWyjscieSterujaceBms = (a: boolean | ((p: boolean) => boolean)) => setPole("maWyjscieSterujaceBms", a)

  const result = useMemo(
    () =>
      calculateAgregatPradotworczy({
        deficytKwh: deficytKwh === "" ? 0 : Number(deficytKwh),
        mocAgregatuKw: mocAgregatuKw === "" ? 0 : Number(mocAgregatuKw),
        sredniZuzycieLH: sredniZuzycieLH === "" ? 0 : Number(sredniZuzycieLH),
        cenaZaLitrZl: cenaZaLitrZl === "" ? 0 : Number(cenaZaLitrZl),
        maWyjscieSterujaceBms,
        ...naWejscieBezpieczenstwa({ miejsceAgregatu, podlaczenieAgregatu }),
      }),
    [deficytKwh, mocAgregatuKw, sredniZuzycieLH, cenaZaLitrZl, maWyjscieSterujaceBms, miejsceAgregatu, podlaczenieAgregatu],
  )

  // 1.1.0 (D45): a critical safety warning (CO, no changeover switch) turns the verdict red.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" || hasCritical
      ? "blad"
      : result.status === "VALID"
        ? "ok"
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/agregat-pradotworczy" />
      <NaglowekEkranu tytul="Agregat prądotwórczy — definicja i logika pracy">
        System porównuje produkcję PV z zapotrzebowaniem w najgorszym miesiącu roku. Jeśli
        występuje deficyt, agregat musi go pokryć — tu policzysz ile godzin, ile paliwa i ile to
        będzie kosztować. Moduł 2, Ekran 17.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Deficyt energetyczny w najgorszym miesiącu"
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={deficytKwh}
          onChange={(e) => setDeficytKwh(e.target.value)}
          hint="Produkcja PV minus zapotrzebowanie w tym miesiącu."
        />
        <Pole
          label="Moc znamionowa agregatu"
          unit="kW"
          type="number"
          inputMode="decimal"
          value={mocAgregatuKw}
          onChange={(e) => setMocAgregatuKw(e.target.value)}
        />
        <Pole
          label="Średnie zużycie paliwa przy optymalnym obciążeniu"
          unit="l/h"
          type="number"
          inputMode="decimal"
          value={sredniZuzycieLH}
          onChange={(e) => setSredniZuzycieLH(e.target.value)}
          hint="Z karty katalogowej agregatu, przy ok. 70-80% mocy."
        />
        <Pole
          label="Cena paliwa"
          unit="zł/l"
          type="number"
          inputMode="decimal"
          value={cenaZaLitrZl}
          onChange={(e) => setCenaZaLitrZl(e.target.value)}
        />
        <PoleCheckbox
          id="ma-wyjscie-sterujace"
          checked={maWyjscieSterujaceBms}
          onChange={(e) => setMaWyjscieSterujaceBms(e.target.checked)}
          label="BMS ma wyjście sterujące do automatycznego startu agregatu"
        />
      </div>

      <PolaBezpieczenstwaAgregatu
        miejsceAgregatu={miejsceAgregatu}
        podlaczenieAgregatu={podlaczenieAgregatu}
        onChange={(zmiana) => setStan((prev) => ({ ...prev, ...zmiana }))}
      />

      {result.status === "INCOMPLETE" ? (
        <>
          <p className="text-small text-muted-foreground">
            Wypełnij dane, żeby zobaczyć raport pracy agregatu.
          </p>
          {hasCritical && (
            <WerdyktPanel poziom="blad" etykieta="Zagrożenie życia — agregat w tej konfiguracji jest niebezpieczny">
              <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
            </WerdyktPanel>
          )}
        </>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        poziom !== null && (
          <WerdyktPanel
            poziom={poziom}
            etykieta={hasCritical ? "Raport pracy agregatu — zagrożenie życia, popraw konfigurację" : "Raport pracy agregatu"}
          >
            <WynikGlowny>
              {result.value.godzinyPracy.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} h
            </WynikGlowny>
            <p className="mt-1 text-small">
              Zużycie paliwa: {result.value.zuzyciePaliwaLitry.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} l.
              Koszt: ok. {result.value.kosztZl.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł.
            </p>
            <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
