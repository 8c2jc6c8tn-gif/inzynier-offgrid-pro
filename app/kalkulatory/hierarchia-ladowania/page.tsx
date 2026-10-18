"use client"

import { useMemo } from "react"
import { calculateHierarchiaLadowania } from "@/lib/core/modules/baterie/hierarchia-ladowania/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  produkcjaPvDostepnaTeraz: boolean
  socAktualnyPct: string
  socProguKrytycznegoPct: string
  prognozaSloncaJutro: boolean
  agregatDostepny: boolean
  siecDostepna: boolean
  taniaTaryfaNocna: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  produkcjaPvDostepnaTeraz: false,
  socAktualnyPct: "",
  socProguKrytycznegoPct: "",
  prognozaSloncaJutro: false,
  agregatDostepny: false,
  siecDostepna: false,
  taniaTaryfaNocna: false,
}

const ETYKIETA_ZRODLA: Record<string, string> = {
  PV: "UI-HIELAD-LADOWANIE-PANELI",
  AGREGAT: "UI-HIELAD-LADOWANIE-AGREGATU-PRADOTWOR",
  SIEC: "UI-HIELAD-DOLADOWANIE-SIECI-TANIA",
  BRAK: "UI-HIELAD-BRAK-AKTYWNEGO-ZRODLA",
}

export default function HierarchiaLadowaniaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("hierarchia-ladowania", STAN_POCZATKOWY)

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const {
    produkcjaPvDostepnaTeraz,
    socAktualnyPct,
    socProguKrytycznegoPct,
    prognozaSloncaJutro,
    agregatDostepny,
    siecDostepna,
    taniaTaryfaNocna,
  } = stan

  const result = useMemo(
    () =>
      calculateHierarchiaLadowania({
        produkcjaPvDostepnaTeraz,
        socAktualnyPct: socAktualnyPct === "" ? 0 : Number(socAktualnyPct),
        socProguKrytycznegoPct: socProguKrytycznegoPct === "" ? 0 : Number(socProguKrytycznegoPct),
        prognozaSloncaJutro,
        agregatDostepny,
        siecDostepna,
        taniaTaryfaNocna,
      }),
    [
      produkcjaPvDostepnaTeraz,
      socAktualnyPct,
      socProguKrytycznegoPct,
      prognozaSloncaJutro,
      agregatDostepny,
      siecDostepna,
      taniaTaryfaNocna,
    ],
  )

  const poziom = poziomZStatusu(result.status)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/hierarchia-ladowania" />
      <NaglowekEkranu
        tytul={t("UI-HIELAD-HIERARCHIA-LADOWANIA-AGREGAT")}
        ekran="hierarchia-ladowania"
        wynik={result}
      >
        {t("UI-HIELAD-MADRY-SYSTEM-CZEKA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleCheckbox
          id="produkcja-pv-teraz"
          label={t("UI-HIELAD-TERAZ-PRODUKCJA")}
          checked={produkcjaPvDostepnaTeraz}
          onChange={(e) => setPole("produkcjaPvDostepnaTeraz", e.target.checked)}
        />
        <Pole
          label={t("UI-HIELAD-AKTUALNY-SOC-BATERII")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socAktualnyPct}
          onChange={(e) => setPole("socAktualnyPct", e.target.value)}
          pomoc={<PomocPola ekran="hierarchia-ladowania" pole="soc" />}
        />
        <Pole
          label={t("UI-HIELAD-PROG-KRYTYCZNY-SOC")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socProguKrytycznegoPct}
          onChange={(e) => setPole("socProguKrytycznegoPct", e.target.value)}
          pomoc={<PomocPola ekran="hierarchia-ladowania" pole="progKrytyczny" />}
        />
        <PoleCheckbox
          id="prognoza-slonca-jutro"
          label={t("UI-HIELAD-PROGNOZA-PRZEWIDUJE-PRODUKCJ")}
          hint={t("UI-HIELAD-DOCELOWO-AUTO-MODULU")}
          checked={prognozaSloncaJutro}
          onChange={(e) => setPole("prognozaSloncaJutro", e.target.checked)}
        />
        <PoleCheckbox
          id="agregat-dostepny"
          label={t("UI-HIELAD-AGREGAT-PRADOTWORCZY-DOSTEPN")}
          checked={agregatDostepny}
          onChange={(e) => setPole("agregatDostepny", e.target.checked)}
        />
        <PoleCheckbox
          id="siec-dostepna"
          label={t("UI-HIELAD-PODLACZENIE-SIECI-ENERGETYCZ")}
          checked={siecDostepna}
          onChange={(e) => setPole("siecDostepna", e.target.checked)}
        />
        <PoleCheckbox
          id="tania-taryfa-nocna"
          label={t("UI-HIELAD-TERAZ-OBOWIAZUJE-TANIA")}
          checked={taniaTaryfaNocna}
          onChange={(e) => setPole("taniaTaryfaNocna", e.target.checked)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-HIELAD-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-HIELAD-WPISZ-AKTUALNY-SOC")}
        </p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={t(ETYKIETA_ZRODLA[result.value.zrodlo]!)}>
          <WynikGlowny>{t(ETYKIETA_ZRODLA[result.value.zrodlo]!)}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
