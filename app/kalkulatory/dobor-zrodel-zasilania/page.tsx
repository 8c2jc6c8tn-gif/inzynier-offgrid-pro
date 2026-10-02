"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateDoborZrodelZasilania } from "@/lib/core/modules/ai/dobor-zrodel-zasilania/calculator"
import {
  LIMIT_C_RATE_CHLODNO,
  LIMIT_C_RATE_ZIMNO,
  PROG_BLOKADY_C,
  PROG_LIMITU_02C,
  PROG_LUKI_GORNY_C,
  PROG_PELNEGO_PRADU_C,
} from "@/lib/core/modules/ai/dobor-zrodel-zasilania/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Stan = {
  pvTeraz: boolean
  soc: string
  socProg: string
  slonceJutro: boolean
  agregat: boolean
  siec: boolean
  taniaTaryfa: boolean
  temperatura: string
  pojemnosc: string
  prad: string
}

const STAN_POCZATKOWY: Stan = {
  pvTeraz: false,
  soc: "",
  socProg: "",
  slonceJutro: false,
  agregat: false,
  siec: false,
  taniaTaryfa: false,
  temperatura: "",
  pojemnosc: "",
  prad: "",
}

// Labels of the Moduł 4 hierarchy screen — the same sources, the same words (echo).
const ETYKIETA_ZRODLA: Record<string, string> = {
  PV: "UI-HIELAD-LADOWANIE-PANELI",
  AGREGAT: "UI-HIELAD-LADOWANIE-AGREGATU-PRADOTWOR",
  SIEC: "UI-HIELAD-DOLADOWANIE-SIECI-TANIA",
  BRAK: "UI-HIELAD-BRAK-AKTYWNEGO-ZRODLA",
}
const PARAMS_ZIMNO = {
  blokada: PROG_BLOKADY_C,
  limit02: PROG_LIMITU_02C,
  luka: PROG_LUKI_GORNY_C,
  pelny: PROG_PELNEGO_PRADU_C,
  cZimno: LIMIT_C_RATE_ZIMNO,
  cChlodno: LIMIT_C_RATE_CHLODNO,
}
const r1 = (x: number) => Math.round(x * 10) / 10

/** Moduł 10, Ekran 4 — automatyczny dobór i optymalizacja źródeł zasilania (dawne 12.7, 12.8, 12.9). */
export default function DoborZrodelZasilaniaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("dobor-zrodel-zasilania", STAN_POCZATKOWY)
  const ustaw = <K extends keyof Stan>(k: K, v: Stan[K]) => setStan((s) => ({ ...s, [k]: v }))

  const result = useMemo(
    () =>
      calculateDoborZrodelZasilania({
        produkcjaPvDostepnaTeraz: stan.pvTeraz,
        socAktualnyPct: liczba(stan.soc) ?? 0,
        socProguKrytycznegoPct: liczba(stan.socProg) ?? 0,
        prognozaSloncaJutro: stan.slonceJutro,
        agregatDostepny: stan.agregat,
        siecDostepna: stan.siec,
        taniaTaryfaNocna: stan.taniaTaryfa,
        temperaturaOgniwaC: liczba(stan.temperatura) ?? null,
        pojemnoscAh: liczba(stan.pojemnosc) ?? 0,
        pradMozliwyA: liczba(stan.prad) ?? 0,
      }),
    [stan],
  )
  const v = result.value
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-zrodel-zasilania" />
      <NaglowekEkranu tytul={t("UI-M10-ZR-TYTUL")} ekran="dobor-zrodel-zasilania" wynik={result} parametry={PARAMS_ZIMNO}>
        {t("UI-M10-ZR-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-M10-ZR-ZRODLO")}</h2>
        <PoleCheckbox id="zr-pv-teraz" label={t("UI-HIELAD-TERAZ-PRODUKCJA")} checked={stan.pvTeraz} onChange={(e) => ustaw("pvTeraz", e.target.checked)} />
        <Pole
          label={t("UI-HIELAD-AKTUALNY-SOC-BATERII")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.soc}
          onChange={(e) => ustaw("soc", e.target.value)}
          pomoc={<PomocPola ekran="hierarchia-ladowania" pole="soc" />}
        />
        <Pole
          label={t("UI-HIELAD-PROG-KRYTYCZNY-SOC")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socProg}
          onChange={(e) => ustaw("socProg", e.target.value)}
          pomoc={<PomocPola ekran="hierarchia-ladowania" pole="progKrytyczny" />}
        />
        <PoleCheckbox
          id="zr-slonce-jutro"
          label={t("UI-HIELAD-PROGNOZA-PRZEWIDUJE-PRODUKCJ")}
          checked={stan.slonceJutro}
          onChange={(e) => ustaw("slonceJutro", e.target.checked)}
        />
        <PoleCheckbox id="zr-agregat" label={t("UI-HIELAD-AGREGAT-PRADOTWORCZY-DOSTEPN")} checked={stan.agregat} onChange={(e) => ustaw("agregat", e.target.checked)} />
        <PoleCheckbox id="zr-siec" label={t("UI-HIELAD-PODLACZENIE-SIECI-ENERGETYCZ")} checked={stan.siec} onChange={(e) => ustaw("siec", e.target.checked)} />
        <PoleCheckbox
          id="zr-tania-taryfa"
          label={t("UI-HIELAD-TERAZ-OBOWIAZUJE-TANIA")}
          checked={stan.taniaTaryfa}
          onChange={(e) => ustaw("taniaTaryfa", e.target.checked)}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-M10-ZR-PRAD")}</h2>
        <Pole
          label={t("UI-M10-ZR-TEMPERATURA")}
          unit="°C"
          type="number"
          inputMode="decimal"
          value={stan.temperatura}
          onChange={(e) => ustaw("temperatura", e.target.value)}
          pomoc={<PomocPola ekran="cold-c-rate" pole="temperatura" params={PARAMS_ZIMNO} />}
        />
        <Pole
          label={t("UI-M10-ZR-POJEMNOSC")}
          unit="Ah"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.pojemnosc}
          onChange={(e) => ustaw("pojemnosc", e.target.value)}
          pomoc={<PomocPola ekran="cold-c-rate" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-M10-ZR-PRAD-MOZLIWY")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.prad}
          onChange={(e) => ustaw("prad", e.target.value)}
          pomoc={<PomocPola ekran="dobor-zrodel-zasilania" pole="pradMozliwy" />}
        />
      </section>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M10-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-HIELAD-WPISZ-AKTUALNY-SOC")}</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"} etykieta={t("UI-M10-ZR-W-TERAZ")}>
          <WynikGlowny>{t(ETYKIETA_ZRODLA[v.zrodlo]!)}</WynikGlowny>
          <p className="mt-1 text-small">
            {v.pradLadowaniaA !== null
              ? t("UI-M10-ZR-PRAD-WYNIK", { a: r1(v.pradLadowaniaA) })
              : v.maxPradA !== null
                ? t("UI-M10-ZR-LIMIT-WYNIK", { a: r1(v.maxPradA) })
                : v.strefa === "pelny-prad"
                  ? t("UI-M10-ZR-BEZ-LIMITU")
                  : null}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/przesuwanie-zadan" className="text-small underline">
        {t("UI-M10-ZR-LINK-E5")}
      </Link>
      <Link href="/kalkulatory/hierarchia-ladowania" className="text-small underline">
        {t("UI-M10-ZR-LINK-HIERARCHIA")}
      </Link>
      <Link href="/kalkulatory/cold-c-rate" className="text-small underline">
        {t("UI-M10-ZR-LINK-COLD")}
      </Link>
    </main>
  )
}
