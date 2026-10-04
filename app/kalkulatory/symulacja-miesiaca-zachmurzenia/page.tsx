"use client"

import { useMemo } from "react"
import { calculateSymulacjaZachmurzenia } from "@/lib/core/modules/baterie/symulacja-miesiaca-zachmurzenia/calculator"
import { LICZBA_DNI_SCENARIUSZA_SUGEROWANA } from "@/lib/core/modules/baterie/symulacja-miesiaca-zachmurzenia/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pojemnoscUzytecznaKwh: string
  socStartPct: string
  zapotrzebowanieDoboweKwh: string
  produkcjaNominalnaDobowaKwh: string
  poziomZachmurzeniaPct: string
  liczbaDniScenariusza: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscUzytecznaKwh: "",
  socStartPct: "100",
  zapotrzebowanieDoboweKwh: "",
  produkcjaNominalnaDobowaKwh: "",
  poziomZachmurzeniaPct: "",
  liczbaDniScenariusza: String(LICZBA_DNI_SCENARIUSZA_SUGEROWANA),
}

function formatujGodzine(godzinaW24h: number): string {
  const godziny = Math.floor(godzinaW24h)
  const minuty = Math.round((godzinaW24h - godziny) * 60)
  return `${String(godziny).padStart(2, "0")}:${String(minuty).padStart(2, "0")}`
}

export default function SymulacjaMiesiacaZachmurzeniaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("symulacja-miesiaca-zachmurzenia", STAN_POCZATKOWY)

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: string) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const {
    pojemnoscUzytecznaKwh,
    socStartPct,
    zapotrzebowanieDoboweKwh,
    produkcjaNominalnaDobowaKwh,
    poziomZachmurzeniaPct,
    liczbaDniScenariusza,
  } = stan

  const result = useMemo(
    () =>
      calculateSymulacjaZachmurzenia({
        pojemnoscUzytecznaKwh: pojemnoscUzytecznaKwh === "" ? 0 : Number(pojemnoscUzytecznaKwh),
        socStartPct: socStartPct === "" ? 0 : Number(socStartPct),
        zapotrzebowanieDoboweKwh: zapotrzebowanieDoboweKwh === "" ? 0 : Number(zapotrzebowanieDoboweKwh),
        produkcjaNominalnaDobowaKwh: produkcjaNominalnaDobowaKwh === "" ? 0 : Number(produkcjaNominalnaDobowaKwh),
        poziomZachmurzeniaPct: poziomZachmurzeniaPct === "" ? 0 : Number(poziomZachmurzeniaPct),
        liczbaDniScenariusza: liczbaDniScenariusza === "" ? 0 : Number(liczbaDniScenariusza),
      }),
    [
      pojemnoscUzytecznaKwh,
      socStartPct,
      zapotrzebowanieDoboweKwh,
      produkcjaNominalnaDobowaKwh,
      poziomZachmurzeniaPct,
      liczbaDniScenariusza,
    ],
  )

  const poziom = result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "blad"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/symulacja-miesiaca-zachmurzenia" />
      <NaglowekEkranu
        tytul={t("UI-SYMMIEZAC-SYMULACJA-MIESIACA-ZACHMURZE")}
        ekran="symulacja-miesiaca-zachmurzenia"
        wynik={result}
      >
        {t("UI-SYMMIEZAC-PROJEKTUJESZ-SYSTEM-SREDNIA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-SYMMIEZAC-POJEMNOSC-UZYTECZNA-BATERII")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.pojemnoscUzytecznaKwh}
          onChange={(e) => setPole("pojemnoscUzytecznaKwh", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-miesiaca-zachmurzenia" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-SYMMIEZAC-SOC-POCZATKU-SCENARIUSZA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socStartPct}
          onChange={(e) => setPole("socStartPct", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-miesiaca-zachmurzenia" pole="socStart" />}
        />
        <Pole
          label={t("UI-SYMMIEZAC-ZAPOTRZEBOWANIE-DOBOWE")}
          unit={t("UI-SYMMIEZAC-KWH-DZIEN")}
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zapotrzebowanieDoboweKwh}
          onChange={(e) => setPole("zapotrzebowanieDoboweKwh", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-miesiaca-zachmurzenia" pole="zapotrzebowanie" />}
        />
        <Pole
          label={t("UI-SYMMIEZAC-NOMINALNA-PRODUKCJA-DOBOWA")}
          unit={t("UI-SYMMIEZAC-KWH-DZIEN")}
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.produkcjaNominalnaDobowaKwh}
          onChange={(e) => setPole("produkcjaNominalnaDobowaKwh", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-miesiaca-zachmurzenia" pole="produkcja" />}
        />
        <Pole
          label={t("UI-SYMMIEZAC-POZIOM-ZACHMURZENIA-PRODUKCJ")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.poziomZachmurzeniaPct}
          onChange={(e) => setPole("poziomZachmurzeniaPct", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-miesiaca-zachmurzenia" pole="zachmurzenie" />}
        />
        <Pole
          label={t("UI-SYMMIEZAC-LICZBA-DNI-SCENARIUSZA")}
          unit={t("UI-J-DNI")}
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={stan.liczbaDniScenariusza}
          onChange={(e) => setPole("liczbaDniScenariusza", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-miesiaca-zachmurzenia" pole="dni" params={{ dni: LICZBA_DNI_SCENARIUSZA_SUGEROWANA }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-SYMMIEZAC-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-SYMMIEZAC-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={result.value.przetrwaCalyScenariusz ? t("UI-SYMMIEZAC-PRZETRWA-CALY-SCENARIUSZ") : t("UI-SYMMIEZAC-SYSTEM-PADNIE-PRZED")}
        >
          <WynikGlowny>
            {result.value.przetrwaCalyScenariusz
              ? t("UI-SYMMIEZAC-BRAK-BLACKOUTU")
              : t("UI-SYMMIEZAC-PADNIE-DNIA", { dzienPadnieSystem: result.value.dzienPadnieSystem ?? "—", p: formatujGodzine(result.value.godzinaPadnieSystemW24H ?? 0) })}
          </WynikGlowny>
          {!result.value.przetrwaCalyScenariusz && (
            <p className="mt-1 text-small">
              {t("UI-SYMMIEZAC-ABY-PRZETRWAC-BEZ")}
              <strong>{result.value.energiaBrakujacaKwh.toFixed(1)} kWh</strong> {t("UI-SYMMIEZAC-POJEMNOSCI-BATERII")}
            </p>
          )}
          <p className="mt-1 text-small">
            {result.value.dobowyDeficytKwh > 0
              ? t("UI-SYMMIEZAC-DEFICYT-ENERGII-KWH", { dobowyDeficytKwh: result.value.dobowyDeficytKwh.toFixed(1) })
              : t("UI-SYMMIEZAC-NADWYZKA-ENERGII-NAWET", { p: Math.abs(result.value.dobowyDeficytKwh).toFixed(1) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
