"use client"

import { useMemo, useState } from "react"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateWschodZachod } from "@/lib/core/modules/pv/wschod-zachod/calculator"
import type { DaneWschodZachod } from "@/lib/core/modules/pv/wschod-zachod/input"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"
import { TYPOWY_STOSUNEK_MAX_PCT, TYPOWY_STOSUNEK_MIN_PCT } from "@/lib/core/modules/pv/wschod-zachod/constants"

type FormularzStan = {
  wschodNachylenie: string
  wschodAzymut: string
  zachodNachylenie: string
  zachodAzymut: string
  udzialWschodPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  wschodNachylenie: "",
  wschodAzymut: "",
  zachodNachylenie: "",
  zachodAzymut: "",
  udzialWschodPct: "",
}

const MIESIACE = Array.from({ length: 12 }, (_, i) => `UI-MIESIAC-SKR-${i + 1}`)

/** Rozkład dobowy — 2 serie: wschód-zachód (linia ciągła) i południe (przerywana) + legenda. */
function WykresDoby({ wz, poludnie }: { wz: number[]; poludnie: number[] }) {
  const t = useTranslate()
  const W = 360
  const H = 140
  const max = Math.max(...wz, ...poludnie, 1e-9)
  const x = (g: number) => 10 + (g / 23) * (W - 20)
  const y = (v: number) => H - 8 - (v / max) * (H - 20)
  const linia = (d: number[]) => d.map((v, g) => `${g === 0 ? "M" : "L"}${x(g).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  return (
    <figure className="flex flex-col gap-1">
      <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full text-foreground" role="img" aria-label={t("UI-WSCZAC-ROZKLAD-PRODUKCJI-CIAGU")}>
        <path d={linia(poludnie)} className="fill-none stroke-muted-foreground" strokeWidth={2} strokeDasharray="5 4" />
        <path d={linia(wz)} className="fill-none stroke-sky-500" strokeWidth={2} />
        {wz.map((v, g) => (
          <rect key={g} x={x(g) - 7} y={0} width={14} height={H} className="fill-transparent">
            <title>{t("UI-WSCZAC-WSCHOD-ZACHOD-POLUDNIE", { g, p: g + 1, v: v.toFixed(1), p2: poludnie[g]!.toFixed(1) })}</title>
          </rect>
        ))}
        {[0, 6, 12, 18, 23].map((g) => (
          <text key={g} x={x(g)} y={H + 12} textAnchor="middle" className="fill-muted-foreground text-[9px]">
            {g}:00
          </text>
        ))}
      </svg>
      <figcaption className="flex gap-4 text-small text-muted-foreground">
        <span>
          <span className="mr-1 inline-block h-0.5 w-5 bg-sky-500 align-middle" />
          {t("UI-WSCZAC-WSCHOD-ZACHOD")}
        </span>
        <span>
          <span className="mr-1 inline-block w-5 border-t-2 border-dashed border-muted-foreground align-middle" />
          {t("UI-WSCZAC-POLUDNIE")}
        </span>
        <span>{t("UI-WSCZAC-CZAS-SLONECZNY-ENERGII")}</span>
      </figcaption>
    </figure>
  )
}

export default function WschodZachodPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f0 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 })
  const f1 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 1 })
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wschod-zachod", STAN_POCZATKOWY)
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const [baza, setBaza] = useState<{ klucz: string; d: DaneWschodZachod | null } | null>(null)
  const ustaw = (pole: keyof FormularzStan, v: string) => setStan((prev) => ({ ...prev, [pole]: v }))

  const polacie = {
    wschod: { nachylenieDeg: liczba(stan.wschodNachylenie), azymutDeg: liczba(stan.wschodAzymut) },
    zachod: { nachylenieDeg: liczba(stan.zachodNachylenie), azymutDeg: liczba(stan.zachodAzymut) },
  }
  const kompletne = Object.values(polacie).every((p) => p.nachylenieDeg !== undefined && p.azymutDeg !== undefined)
  const klucz = JSON.stringify([lokalizacja?.szerokosc, lokalizacja?.dlugosc, dane?.pobrano, polacie])
  const aktualna = baza !== null && baza.klucz === klucz ? baza : null

  async function policz() {
    if (!lokalizacja || !dane || !kompletne) return
    const r = await uruchom({
      typ: "wschod-zachod",
      wejscie: {
        szerokoscGeograficzna: lokalizacja.szerokosc,
        dlugoscGeograficzna: lokalizacja.dlugosc,
        daneGodzinowe: dane.dane.rekordy,
        wschod: { nachylenieDeg: polacie.wschod.nachylenieDeg!, azymutDeg: polacie.wschod.azymutDeg! },
        zachod: { nachylenieDeg: polacie.zachod.nachylenieDeg!, azymutDeg: polacie.zachod.azymutDeg! },
      },
    })
    if (r) setBaza({ klucz, d: r.wynik.value })
  }

  const udzial = liczba(stan.udzialWschodPct)
  const result = useMemo(
    () => calculateWschodZachod({ dane: aktualna?.d ?? null, udzialWschodPct: udzial === undefined ? null : udzial }),
    [aktualna, udzial],
  )

  if (!wczytano) return <StanLadowania linie={6} />
  const v = result.value

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wschod-zachod" />
      <NaglowekEkranu
        tytul={t("UI-WSCZAC-ORIENTACJA-WSCHOD-ZACHOD")}
        ekran="wschod-zachod"
        wynik={result}
        parametry={{ stosunekMin: TYPOWY_STOSUNEK_MIN_PCT, stosunekMax: TYPOWY_STOSUNEK_MAX_PCT }}
      >
        {t("UI-WSCZAC-PANELE-DWOCH-POLACIACH")}
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />

      <section className="grid grid-cols-2 gap-3">
        <Pole
          label={t("UI-WSCZAC-WSCHOD-NACHYLENIE")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={stan.wschodNachylenie}
          onChange={(e) => ustaw("wschodNachylenie", e.target.value)}
          pomoc={<PomocPola ekran="wschod-zachod" pole="wschodKat" />}
        />
        <Pole
          label={t("UI-WSCZAC-WSCHOD-AZYMUT")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={360}
          value={stan.wschodAzymut}
          onChange={(e) => ustaw("wschodAzymut", e.target.value)}
          pomoc={<PomocPola ekran="wschod-zachod" pole="wschodAzymut" />}
        />
        <Pole
          label={t("UI-WSCZAC-ZACHOD-NACHYLENIE")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={stan.zachodNachylenie}
          onChange={(e) => ustaw("zachodNachylenie", e.target.value)}
          pomoc={<PomocPola ekran="wschod-zachod" pole="zachodKat" />}
        />
        <Pole
          label={t("UI-WSCZAC-ZACHOD-AZYMUT")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={360}
          value={stan.zachodAzymut}
          onChange={(e) => ustaw("zachodAzymut", e.target.value)}
          pomoc={<PomocPola ekran="wschod-zachod" pole="zachodAzymut" />}
        />
      </section>
      <p className="-mt-3 text-small text-muted-foreground">{t("UI-WSCZAC-KATY-AZYMUTY-POLACI")}</p>
      <Button className="min-h-11" disabled={!lokalizacja || !dane || !kompletne || obliczenia.liczy} onClick={policz}>
        {obliczenia.liczy ? t("UI-WSCZAC-LICZE") : t("UI-WSCZAC-POROWNAJ-POLUDNIEM")}
      </Button>
      {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
      {baza && !aktualna && !obliczenia.liczy && <StanPusty tytul={t("UI-WSCZAC-ZMIENILY-DANE-POLACI")} />}

      {aktualna && (
        <Pole
          label={t("UI-WSCZAC-UDZIAL-MOCY-PANELI")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.udzialWschodPct}
          onChange={(e) => ustaw("udzialWschodPct", e.target.value)}
          pomoc={<PomocPola ekran="wschod-zachod" pole="udzial" />}
        />
      )}

      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-WSCZAC-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}
      {aktualna && result.status === "INCOMPLETE" && (
        <p className="text-small text-muted-foreground">{t("UI-WSCZAC-WPISZ-UDZIAL-MOCY")}</p>
      )}

      {v && (
        <WerdyktPanel poziom="ok" etykieta={t("UI-WSCZAC-WSCHOD-ZACHOD-WZGLEDEM")}>
          <WynikGlowny>{t("UI-WSCZAC-ENERGII-POLUDNIA", { stosunekRocznyPct: f0(v.stosunekRocznyPct) })}</WynikGlowny>
          <p className="text-small">
            {t("UI-WSCZAC-ROCZNIE-KWH-PANELI", { rocznieWz: f0(v.rocznieWz), rocznieP: f0(v.rocznieP), nachylenieOdniesieniaDeg: v.nachylenieOdniesieniaDeg, udzialRanoWzPct: f0(v.udzialRanoWzPct), udzialRanoPoludniePct: f0(v.udzialRanoPoludniePct), p: f1(Math.max(...v.dobaWzPct)), p2: f1(Math.max(...v.dobaPoludniePct)) })}
          </p>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <h3 className="mt-3 font-semibold">{t("UI-WSCZAC-ROZKLADA-PRODUKCJA-CIAGU")}</h3>
          <WykresDoby wz={v.dobaWzPct} poludnie={v.dobaPoludniePct} />
          <h3 className="mt-3 font-semibold">{t("UI-WSCZAC-KAZDY-MIESIAC")}</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-2 font-medium">{t("UI-WSCZAC-MIESIAC")}</th>
                  <th className="p-2 text-right font-medium">{t("UI-WSCZAC-WSCHOD-ZACHOD-2")}</th>
                  <th className="p-2 text-right font-medium">{t("UI-WSCZAC-POLUDNIE-2")}</th>
                  <th className="p-2 text-right font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {v.miesiaceWz.map((h, m) => (
                  <tr key={m} className="border-b last:border-0">
                    <td className="p-2">{t(MIESIACE[m])}</td>
                    <td className="p-2 text-right font-mono">{f0(h)}</td>
                    <td className="p-2 text-right font-mono">{f0(v.miesiacePoludnie[m]!)}</td>
                    <td className="p-2 text-right font-mono">{f0(v.stosunekMiesiecznyPct[m]!)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-small text-muted-foreground">{t("UI-WSCZAC-WARTOSCI-KWH-POWIERZCHNI")}</p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
