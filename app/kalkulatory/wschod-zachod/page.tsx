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
import { useTranslate } from "@/lib/i18n/language-context"
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

const MIESIACE = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"]
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

/** Rozkład dobowy — 2 serie: wschód-zachód (linia ciągła) i południe (przerywana) + legenda. */
function WykresDoby({ wz, poludnie }: { wz: number[]; poludnie: number[] }) {
  const W = 360
  const H = 140
  const max = Math.max(...wz, ...poludnie, 1e-9)
  const x = (g: number) => 10 + (g / 23) * (W - 20)
  const y = (v: number) => H - 8 - (v / max) * (H - 20)
  const linia = (d: number[]) => d.map((v, g) => `${g === 0 ? "M" : "L"}${x(g).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  return (
    <figure className="flex flex-col gap-1">
      <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full text-foreground" role="img" aria-label="Rozkład produkcji w ciągu doby: wschód-zachód i południe">
        <path d={linia(poludnie)} className="fill-none stroke-muted-foreground" strokeWidth={2} strokeDasharray="5 4" />
        <path d={linia(wz)} className="fill-none stroke-sky-500" strokeWidth={2} />
        {wz.map((v, g) => (
          <rect key={g} x={x(g) - 7} y={0} width={14} height={H} className="fill-transparent">
            <title>{`${g}:00–${g + 1}:00 — wschód-zachód ${v.toFixed(1)}%, południe ${poludnie[g]!.toFixed(1)}%`}</title>
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
          wschód-zachód
        </span>
        <span>
          <span className="mr-1 inline-block w-5 border-t-2 border-dashed border-muted-foreground align-middle" />
          południe
        </span>
        <span>(czas słoneczny, % energii rocznej w danej godzinie)</span>
      </figcaption>
    </figure>
  )
}

export default function WschodZachodPage() {
  const t = useTranslate()
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
        tytul="Orientacja wschód-zachód"
        ekran="wschod-zachod"
        wynik={result}
        parametry={{ stosunekMin: TYPOWY_STOSUNEK_MIN_PCT, stosunekMax: TYPOWY_STOSUNEK_MAX_PCT }}
      >
        Panele na dwóch połaciach — wschodniej i zachodniej — w porównaniu z panelami skierowanymi na południe: ile
        energii w roku i jak rozkłada się ona w ciągu dnia. Moduł 3, Ekran 20.
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />

      <section className="grid grid-cols-2 gap-3">
        <Pole
          label="Wschód — nachylenie"
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
          label="Wschód — azymut"
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
          label="Zachód — nachylenie"
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
          label="Zachód — azymut"
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
      <p className="-mt-3 text-small text-muted-foreground">Kąty i azymuty połaci znajdziesz w Module 1 (Bryła budynku i orientacja ścian).</p>
      <Button className="min-h-11" disabled={!lokalizacja || !dane || !kompletne || obliczenia.liczy} onClick={policz}>
        {obliczenia.liczy ? "Liczę…" : "Porównaj z południem"}
      </Button>
      {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
      {baza && !aktualna && !obliczenia.liczy && <StanPusty tytul="Zmieniły się dane połaci lub lokalizacji — policz ponownie." />}

      {aktualna && (
        <Pole
          label="Udział mocy paneli na połaci wschodniej"
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
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}
      {aktualna && result.status === "INCOMPLETE" && (
        <p className="text-small text-muted-foreground">Wpisz udział mocy na wschodzie, żeby zobaczyć wynik.</p>
      )}

      {v && (
        <WerdyktPanel poziom="ok" etykieta="Wschód-zachód względem południa">
          <WynikGlowny>{f0(v.stosunekRocznyPct)}% energii południa</WynikGlowny>
          <p className="text-small">
            Rocznie {f0(v.rocznieWz)} kWh/m² paneli wobec {f0(v.rocznieP)} kWh/m² na południu pod kątem{" "}
            {v.nachylenieOdniesieniaDeg}°. Przed południem słonecznym powstaje {f0(v.udzialRanoWzPct)}% energii
            (południe: {f0(v.udzialRanoPoludniePct)}%). W najlepszej godzinie doby: {f1(Math.max(...v.dobaWzPct))}% energii
            (południe: {f1(Math.max(...v.dobaPoludniePct))}%) — im mniej, tym równiej produkcja rozkłada się w ciągu dnia.
          </p>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <h3 className="mt-3 font-semibold">Jak rozkłada się produkcja w ciągu doby</h3>
          <WykresDoby wz={v.dobaWzPct} poludnie={v.dobaPoludniePct} />
          <h3 className="mt-3 font-semibold">Każdy miesiąc</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-2 font-medium">Miesiąc</th>
                  <th className="p-2 text-right font-medium">Wschód-zachód</th>
                  <th className="p-2 text-right font-medium">Południe</th>
                  <th className="p-2 text-right font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {v.miesiaceWz.map((h, m) => (
                  <tr key={m} className="border-b last:border-0">
                    <td className="p-2">{MIESIACE[m]}</td>
                    <td className="p-2 text-right font-mono">{f0(h)}</td>
                    <td className="p-2 text-right font-mono">{f0(v.miesiacePoludnie[m]!)}</td>
                    <td className="p-2 text-right font-mono">{f0(v.stosunekMiesiecznyPct[m]!)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-small text-muted-foreground">Wartości w kWh/m² powierzchni paneli.</p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
