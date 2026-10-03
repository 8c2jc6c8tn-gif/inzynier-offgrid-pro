"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateTrackerVsStaly } from "@/lib/core/modules/pv/tracker-vs-staly/calculator"
import { ZYSK_TRACKERA_MAX_PCT, ZYSK_TRACKERA_MIN_PCT } from "@/lib/core/modules/pv/tracker-vs-staly/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  liczbaPaneliTracker: string
  kosztTrackeraZl: string
  kosztPaneluZl: string
  uzyskPaneluKwh: string
}

const STAN_POCZATKOWY: FormularzStan = { liczbaPaneliTracker: "", kosztTrackeraZl: "", kosztPaneluZl: "", uzyskPaneluKwh: "" }

/** Money fields converted when the display currency changes. */
const PRZELICZ_KWOTY = przeliczPola<FormularzStan>("kosztTrackeraZl", "kosztPaneluZl")

type WierszPorownania = { id: string; parametr: string; tracker: string; staly: string }

const kolumny = (t: (kod: string) => string): Kolumna<WierszPorownania>[] => [
  { naglowek: t("UI-TRAVSSTA-PARAMETR"), render: (r) => <span className="font-medium">{r.parametr}</span> },
  { naglowek: t("UI-TRAVSSTA-TRACKER"), render: (r) => r.tracker },
  { naglowek: t("UI-TRAVSSTA-STALY-STELAZ"), render: (r) => r.staly },
]

const liczba = (v: number, miejsca = 0) => v.toLocaleString("pl-PL", { maximumFractionDigits: miejsca })
const naLiczbe = (s: string) => (s === "" ? 0 : Number(s))

/** Polish plural form key: 1 panel, 2–4 panele (except 12–14), otherwise paneli (EN/RU texts follow the same three keys). */
const odmianaPanel = (n: number) =>
  n === 1 ? "UI-TRAVSSTA-PANEL-1" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "UI-TRAVSSTA-PANEL-2-4" : "UI-TRAVSSTA-PANEL-5"

const ETYKIETA_WERDYKTU = {
  staly: "UI-TRAVSSTA-WIECEJ-ENERGII-STALY",
  tracker: "UI-TRAVSSTA-WIECEJ-ENERGII-TRACKER",
  zalezy: "UI-TRAVSSTA-REMIS-ZALEZY-ILE",
} as const

export default function TrackerVsStalyPage() {
  const t = useTranslate()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("tracker-vs-staly", STAN_POCZATKOWY, PRZELICZ_KWOTY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan({ ...stan, [pole]: e.target.value })

  const result = useMemo(
    () =>
      calculateTrackerVsStaly({
        liczbaPaneliTracker: naLiczbe(stan.liczbaPaneliTracker),
        kosztTrackeraZl: naLiczbe(stan.kosztTrackeraZl),
        kosztPaneluZl: naLiczbe(stan.kosztPaneluZl),
        uzyskPaneluKwh: naLiczbe(stan.uzyskPaneluKwh),
      }),
    [stan],
  )
  const w = result.value

  const wiersze: WierszPorownania[] = [
    { id: "panele", parametr: t("UI-TRAVSSTA-LICZBA-PANELI"), tracker: `${liczba(naLiczbe(stan.liczbaPaneliTracker))} ${t("UI-J-SZT")}`, staly: `${liczba(w.liczbaPaneliStaly)} ${t("UI-J-SZT")}` },
    { id: "koszt", parametr: t("UI-TRAVSSTA-DODATKOWY-KOSZT"), tracker: t("UI-TRAVSSTA-ZL", { p: liczba(naLiczbe(stan.kosztTrackeraZl)) }), staly: t("UI-TRAVSSTA-ZL", { p: liczba(w.dodatkowePanele * naLiczbe(stan.kosztPaneluZl)) }) },
    { id: "uzysk", parametr: t("UI-TRAVSSTA-UZYSK-ROCZNY"), tracker: `${liczba(w.uzyskTrackerMinKwh)}–${liczba(w.uzyskTrackerMaxKwh)} kWh`, staly: `${liczba(w.uzyskStalyKwh)} kWh` },
    { id: "wiatr", parametr: t("UI-TRAVSSTA-NAPOR-WIATRU"), tracker: t("UI-TRAVSSTA-DUZO-WIEKSZY-LICZONY"), staly: t("UI-TRAVSSTA-POLICZYSZ-ZLOTYM-SRODKU") },
  ]

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/tracker-vs-staly" />
      <NaglowekEkranu
        tytul={t("UI-TRAVSSTA-TRACKER-STALY-STELAZ")}
        ekran="tracker-vs-staly"
        wynik={result}
        parametry={{ zyskMin: ZYSK_TRACKERA_MIN_PCT, zyskMax: ZYSK_TRACKERA_MAX_PCT }}
      >
        {t("UI-TRAVSSTA-TRACKER-OBRACA-PANELE", { ZYSK_TRACKERA_MIN_PCT, ZYSK_TRACKERA_MAX_PCT })}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <Pole label={t("UI-TRAVSSTA-LICZBA-PANELI-TRACKERZE")} unit={t("UI-J-SZT")} type="number" inputMode="numeric" min={0} step={1}
        value={stan.liczbaPaneliTracker} onChange={ustaw("liczbaPaneliTracker")} pomoc={<PomocPola ekran="tracker-vs-staly" pole="liczbaPaneli" />} />
      <Pole label={t("UI-TRAVSSTA-KOSZT-TRACKERA-MECHANIZM")} unit={t("UI-J-ZL")} type="number" inputMode="decimal" min={0}
        value={stan.kosztTrackeraZl} onChange={ustaw("kosztTrackeraZl")} pomoc={<PomocPola ekran="tracker-vs-staly" pole="kosztTrackera" />} />
      <Pole label={t("UI-TRAVSSTA-KOSZT-JEDNEGO-DODATKOWEGO")} unit={t("UI-J-ZL")} type="number" inputMode="decimal" min={0}
        value={stan.kosztPaneluZl} onChange={ustaw("kosztPaneluZl")} pomoc={<PomocPola ekran="tracker-vs-staly" pole="kosztPanelu" />} />
      <Pole label={t("UI-TRAVSSTA-ROCZNY-UZYSK-JEDNEGO")} unit={t("UI-J-KWH-ROK")} type="number" inputMode="decimal" min={0}
        value={stan.uzyskPaneluKwh} onChange={ustaw("uzyskPaneluKwh")} pomoc={<PomocPola ekran="tracker-vs-staly" pole="uzyskPanelu" />} />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-TRAVSSTA-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-TRAVSSTA-WYPELNIJ-WSZYSTKIE-CZTERY")}</p>
      ) : (
        <>
          <WerdyktPanel poziom="ok" etykieta={t(ETYKIETA_WERDYKTU[w.werdykt])}>
            <WynikGlowny>
              {t("UI-TRAVSSTA-CENE-TRACKERA", { dodatkowePanele: liczba(w.dodatkowePanele), p: t(odmianaPanel(w.dodatkowePanele)) })}
            </WynikGlowny>
            <p className="mt-1 text-small">
              {w.werdykt === "staly" &&
                t("UI-TRAVSSTA-STALY-STELAZ-DAJE", { przewagaStalegoMinPct: liczba(w.przewagaStalegoMinPct), przewagaStalegoMaxPct: liczba(w.przewagaStalegoMaxPct) })}
              {w.werdykt === "tracker" &&
                t("UI-TRAVSSTA-TRACKER-DAJE-WIECEJ", { p: liczba(-w.przewagaStalegoMaxPct), p2: liczba(-w.przewagaStalegoMinPct) })}
              {w.werdykt === "zalezy" &&
                t("UI-TRAVSSTA-ZYSKU-TRACKERA-WYGRYWA", { ZYSK_TRACKERA_MIN_PCT, ZYSK_TRACKERA_MAX_PCT })}
            </p>
            {result.warnings.map((ow) => (
              <p key={ow.code} className="mt-1 text-small">
                {ow.message ?? t(ow.i18nKey ?? ow.code, ow.params)}
              </p>
            ))}
            <p className="mt-2 text-small text-muted-foreground">
              {t("UI-TRAVSSTA-NAPOR-WIATRU-BALAST")}{" "}
              <Link href="/kalkulatory/zloty-srodek" className="underline">
                {t("UI-TRAVSSTA-ZLOTY-SRODEK-KAT")}
              </Link>
              .
            </p>
            <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
          </WerdyktPanel>
          <KartaPorownawcza kolumny={kolumny(t)} wiersze={wiersze} minWidth={320} />
        </>
      )}

      
    </main>
  )
}
