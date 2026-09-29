"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateTrackerVsStaly } from "@/lib/core/modules/pv/tracker-vs-staly/calculator"
import { ZYSK_TRACKERA_MAX_PCT, ZYSK_TRACKERA_MIN_PCT } from "@/lib/core/modules/pv/tracker-vs-staly/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
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

type WierszPorownania = { id: string; parametr: string; tracker: string; staly: string }

const KOLUMNY: Kolumna<WierszPorownania>[] = [
  { naglowek: "Parametr", render: (r) => <span className="font-medium">{r.parametr}</span> },
  { naglowek: "Tracker", render: (r) => r.tracker },
  { naglowek: "Stały stelaż", render: (r) => r.staly },
]

const liczba = (v: number, miejsca = 0) => v.toLocaleString("pl-PL", { maximumFractionDigits: miejsca })
const naLiczbe = (s: string) => (s === "" ? 0 : Number(s))

/** Polska odmiana: 1 panel, 2–4 panele (poza 12–14), reszta paneli. */
const odmianaPanel = (n: number) =>
  n === 1 ? "panel" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "panele" : "paneli"

const ETYKIETA_WERDYKTU = {
  staly: "Więcej energii da stały stelaż z dodatkowymi panelami",
  tracker: "Więcej energii da tracker",
  zalezy: "Remis — zależy, ile naprawdę da Twój tracker",
} as const

export default function TrackerVsStalyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("tracker-vs-staly", STAN_POCZATKOWY)
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
    { id: "panele", parametr: "Liczba paneli", tracker: `${liczba(naLiczbe(stan.liczbaPaneliTracker))} szt.`, staly: `${liczba(w.liczbaPaneliStaly)} szt.` },
    { id: "koszt", parametr: "Dodatkowy koszt", tracker: `${liczba(naLiczbe(stan.kosztTrackeraZl))} zł`, staly: `${liczba(w.dodatkowePanele * naLiczbe(stan.kosztPaneluZl))} zł` },
    { id: "uzysk", parametr: "Uzysk roczny", tracker: `${liczba(w.uzyskTrackerMinKwh)}–${liczba(w.uzyskTrackerMaxKwh)} kWh`, staly: `${liczba(w.uzyskStalyKwh)} kWh` },
    { id: "wiatr", parametr: "Napór wiatru", tracker: "dużo większy, nie liczony", staly: "policzysz w „Złotym środku”" },
  ]

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/tracker-vs-staly" />
      <NaglowekEkranu
        tytul="Tracker czy stały stelaż"
        ekran="tracker-vs-staly"
        wynik={result}
        parametry={{ zyskMin: ZYSK_TRACKERA_MIN_PCT, zyskMax: ZYSK_TRACKERA_MAX_PCT }}
      >
        Tracker obraca panele za słońcem i zwiększa uzysk o {ZYSK_TRACKERA_MIN_PCT}–{ZYSK_TRACKERA_MAX_PCT}%. Za te
        same pieniądze możesz jednak dokupić panele na zwykły stały stelaż. Ten ekran porównuje oba warianty.
        Moduł 3, Ekran 3.
      </NaglowekEkranu>

      <Pole label="Liczba paneli na trackerze" unit="szt." type="number" inputMode="numeric" min={0} step={1}
        value={stan.liczbaPaneliTracker} onChange={ustaw("liczbaPaneliTracker")} pomoc={<PomocPola ekran="tracker-vs-staly" pole="liczbaPaneli" />} />
      <Pole label="Koszt trackera (mechanizm + fundament)" unit="zł" type="number" inputMode="decimal" min={0}
        value={stan.kosztTrackeraZl} onChange={ustaw("kosztTrackeraZl")} pomoc={<PomocPola ekran="tracker-vs-staly" pole="kosztTrackera" />} />
      <Pole label="Koszt jednego dodatkowego panelu na stałym stelażu" unit="zł" type="number" inputMode="decimal" min={0}
        value={stan.kosztPaneluZl} onChange={ustaw("kosztPaneluZl")} pomoc={<PomocPola ekran="tracker-vs-staly" pole="kosztPanelu" />} />
      <Pole label="Roczny uzysk jednego panelu na stałym stelażu" unit="kWh/rok" type="number" inputMode="decimal" min={0}
        value={stan.uzyskPaneluKwh} onChange={ustaw("uzyskPaneluKwh")} pomoc={<PomocPola ekran="tracker-vs-staly" pole="uzyskPanelu" />} />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie cztery pola, żeby zobaczyć porównanie.</p>
      ) : (
        <>
          <WerdyktPanel poziom="ok" etykieta={ETYKIETA_WERDYKTU[w.werdykt]}>
            <WynikGlowny>
              Za cenę trackera: +{liczba(w.dodatkowePanele)} {odmianaPanel(w.dodatkowePanele)}
            </WynikGlowny>
            <p className="mt-1 text-small">
              {w.werdykt === "staly" &&
                `Stały stelaż daje o ${liczba(w.przewagaStalegoMinPct)}–${liczba(w.przewagaStalegoMaxPct)}% więcej energii niż tracker.`}
              {w.werdykt === "tracker" &&
                `Tracker daje o ${liczba(-w.przewagaStalegoMaxPct)}–${liczba(-w.przewagaStalegoMinPct)}% więcej energii niż stały stelaż z dodatkowymi panelami.`}
              {w.werdykt === "zalezy" &&
                `Przy zysku trackera ${ZYSK_TRACKERA_MIN_PCT}% wygrywa stały stelaż, przy ${ZYSK_TRACKERA_MAX_PCT}% — tracker. Rozstrzygnie zysk podany przez producenta dla Twojej lokalizacji.`}
            </p>
            {result.warnings.map((ow) => (
              <p key={ow.code} className="mt-1 text-small">
                {ow.message ?? t(ow.i18nKey ?? ow.code, ow.params)}
              </p>
            ))}
            <p className="mt-2 text-small text-muted-foreground">
              Napór wiatru i balast stałego stelaża:{" "}
              <Link href="/kalkulatory/zloty-srodek" className="underline">
                Złoty środek — kąt, wiatr i balast
              </Link>
              .
            </p>
            <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
          </WerdyktPanel>
          <KartaPorownawcza kolumny={KOLUMNY} wiersze={wiersze} minWidth={320} />
        </>
      )}

      
    </main>
  )
}
