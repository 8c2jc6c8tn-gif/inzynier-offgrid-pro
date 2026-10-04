"use client"

import { useMemo } from "react"
import { calculateSymulacjaLadowania } from "@/lib/core/modules/baterie/symulacja-ladowania-rozladowania/calculator"
import {
  DLUGOSC_DNIA_SUGEROWANA_GODZ,
  SOC_PROG_SUGEROWANY_PCT,
} from "@/lib/core/modules/baterie/symulacja-ladowania-rozladowania/constants"
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
  mocLadowaniaKw: string
  mocRozladowaniaKw: string
  dlugoscDniaGodz: string
  socProgPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscUzytecznaKwh: "",
  socStartPct: "",
  mocLadowaniaKw: "",
  mocRozladowaniaKw: "",
  dlugoscDniaGodz: String(DLUGOSC_DNIA_SUGEROWANA_GODZ),
  socProgPct: String(SOC_PROG_SUGEROWANY_PCT),
}

export default function SymulacjaLadowaniaRozladowaniaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("symulacja-ladowania-rozladowania", STAN_POCZATKOWY)

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: string) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const {
    pojemnoscUzytecznaKwh,
    socStartPct,
    mocLadowaniaKw,
    mocRozladowaniaKw,
    dlugoscDniaGodz,
    socProgPct,
  } = stan

  const result = useMemo(
    () =>
      calculateSymulacjaLadowania({
        pojemnoscUzytecznaKwh: pojemnoscUzytecznaKwh === "" ? 0 : Number(pojemnoscUzytecznaKwh),
        socStartPct: socStartPct === "" ? 0 : Number(socStartPct),
        mocLadowaniaKw: mocLadowaniaKw === "" ? 0 : Number(mocLadowaniaKw),
        mocRozladowaniaKw: mocRozladowaniaKw === "" ? 0 : Number(mocRozladowaniaKw),
        dlugoscDniaGodz: dlugoscDniaGodz === "" ? 0 : Number(dlugoscDniaGodz),
        socProgPct: socProgPct === "" ? 0 : Number(socProgPct),
      }),
    [pojemnoscUzytecznaKwh, socStartPct, mocLadowaniaKw, mocRozladowaniaKw, dlugoscDniaGodz, socProgPct],
  )

  const poziom = result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "blad"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/symulacja-ladowania-rozladowania" />
      <NaglowekEkranu
        tytul={t("UI-SYMLADROZ-SYMULACJA-CZASU-LADOWANIA")}
        ekran="symulacja-ladowania-rozladowania"
        wynik={result}
      >
        {t("UI-SYMLADROZ-POKAZUJE-BATERIA-PRODUKCJA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-SYMLADROZ-POJEMNOSC-UZYTECZNA-BATERII")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.pojemnoscUzytecznaKwh}
          onChange={(e) => setPole("pojemnoscUzytecznaKwh", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-SYMLADROZ-SOC-POCZATKU-DNIA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socStartPct}
          onChange={(e) => setPole("socStartPct", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="socStart" />}
        />
        <Pole
          label={t("UI-SYMLADROZ-SREDNIA-MOC-LADOWANIA")}
          unit="kW"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.mocLadowaniaKw}
          onChange={(e) => setPole("mocLadowaniaKw", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="mocLadowania" />}
        />
        <Pole
          label={t("UI-SYMLADROZ-DLUGOSC-OKNA-LADOWANIA")}
          unit={t("UI-SYMLADROZ-GODZ-2")}
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          value={stan.dlugoscDniaGodz}
          onChange={(e) => setPole("dlugoscDniaGodz", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="oknoLadowania" />}
        />
        <Pole
          label={t("UI-SYMLADROZ-SREDNIA-MOC-ROZLADOWANIA")}
          unit="kW"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.mocRozladowaniaKw}
          onChange={(e) => setPole("mocRozladowaniaKw", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="mocNoc" />}
        />
        <Pole
          label={t("UI-SYMLADROZ-PROG-OSTRZEGAWCZY-SOC")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socProgPct}
          onChange={(e) => setPole("socProgPct", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="progSoc" params={{ progSoc: SOC_PROG_SUGEROWANY_PCT }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-SYMLADROZ-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-SYMLADROZ-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={result.value.przetrwaCalaNoc ? t("UI-SYMLADROZ-PRZETRWA-CALA-NOC") : t("UI-SYMLADROZ-PRZETRWA-RANA")}
        >
          <WynikGlowny>
            {Number.isFinite(result.value.godzinDoPelna)
              ? t("UI-SYMLADROZ-PELNA-GODZ", { godzinDoPelna: result.value.godzinDoPelna.toFixed(1) })
              : t("UI-SYMLADROZ-NALADUJE-DZIS")}
          </WynikGlowny>
          <p className="mt-1 text-small">
            {result.value.zdazyNaladowacPrzedZachodem
              ? t("UI-SYMLADROZ-ZDAZY-NALADOWAC-PELNI")
              : t("UI-SYMLADROZ-ZACHODU-SOC-OSIAGNIE", { socOZachodzieSlonca: result.value.socOZachodzieSlonca.toFixed(0) })}
          </p>
          <p className="mt-1 text-small">
            {t("UI-SYMLADROZ-PROG-SOC-OSIAGNIE", { socProgPct: stan.socProgPct })}
            <strong>{t("UI-SYMLADROZ-GODZ", { godzinDoProguWNocy: result.value.godzinDoProguWNocy.toFixed(1) })}</strong> {t("UI-SYMLADROZ-ZACHODU-SLONCA")}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
