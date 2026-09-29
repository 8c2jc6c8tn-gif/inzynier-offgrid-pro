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
import { calculateKatIAzymut } from "@/lib/core/modules/pv/kat-i-azymut/calculator"
import type { TabelaNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/input"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"

type FormularzStan = {
  azymutDeg: string
  nachylenieDeg: string
  mocInstalacjiKwp: string
  wspolczynnikPr: string
}

const STAN_POCZATKOWY: FormularzStan = { azymutDeg: "", nachylenieDeg: "", mocInstalacjiKwp: "", wspolczynnikPr: "" }

const MIESIACE = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"]
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

/** Słupki 12 miesięcy — jedna seria (bez legendy, tytuł nazywa serię), dymek natywny `<title>`. */
function WykresMiesieczny({ wartosci, jednostka }: { wartosci: number[]; jednostka: string }) {
  const max = Math.max(...wartosci, 1)
  const W = 360
  const H = 160
  const szer = W / 12
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full text-foreground" role="img" aria-label={`Wykres miesięczny (${jednostka})`}>
      <line x1={0} y1={H} x2={W} y2={H} className="stroke-muted-foreground/40" strokeWidth={1} />
      {wartosci.map((v, m) => {
        const h = (v / max) * (H - 8)
        return (
          <g key={m}>
            <rect x={m * szer + 2} y={H - h} width={szer - 4} height={h} rx={3} className="fill-sky-500/80">
              <title>{`${MIESIACE[m]}: ${f0(v)} ${jednostka}`}</title>
            </rect>
            <text x={m * szer + szer / 2} y={H + 13} textAnchor="middle" className="fill-muted-foreground text-[9px]">
              {MIESIACE[m]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** Suma roczna w funkcji kąta — linia 2px, znacznik wybranego kąta i optimum. */
function WykresKata({ wartosci, wybrany, optimum }: { wartosci: number[]; wybrany: number; optimum: number }) {
  const W = 360
  const H = 140
  const max = Math.max(...wartosci)
  const min = Math.min(...wartosci)
  const x = (k: number) => (k / 90) * (W - 20) + 10
  const y = (v: number) => H - 10 - ((v - min) / Math.max(max - min, 1e-9)) * (H - 30)
  const d = wartosci.map((v, k) => `${k === 0 ? "M" : "L"}${x(k).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full text-foreground" role="img" aria-label="Roczne nasłonecznienie w zależności od kąta pochylenia">
      <path d={d} className="fill-none stroke-sky-500" strokeWidth={2} />
      <circle cx={x(optimum)} cy={y(wartosci[optimum]!)} r={5} className="fill-background stroke-sky-600" strokeWidth={2}>
        <title>{`Najlepszy stały kąt: ${optimum}° — ${f0(wartosci[optimum]!)} kWh/m²`}</title>
      </circle>
      <circle cx={x(wybrany)} cy={y(wartosci[wybrany]!)} r={5} className="fill-foreground stroke-background" strokeWidth={2}>
        <title>{`Twój kąt: ${wybrany}° — ${f0(wartosci[wybrany]!)} kWh/m²`}</title>
      </circle>
      {[0, 30, 60, 90].map((k) => (
        <text key={k} x={x(k)} y={H + 12} textAnchor="middle" className="fill-muted-foreground text-[9px]">
          {k}°
        </text>
      ))}
    </svg>
  )
}

export default function KatIAzymutPage() {
  const t = useTranslate()
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("kat-i-azymut", STAN_POCZATKOWY)
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const [tabela, setTabela] = useState<{ klucz: string; t: TabelaNapromieniowania | null; blad: boolean } | null>(null)
  const ustaw = (pole: keyof FormularzStan, v: string) => setStan((prev) => ({ ...prev, [pole]: v }))

  const azymut = liczba(stan.azymutDeg)
  const klucz = JSON.stringify([lokalizacja?.szerokosc, lokalizacja?.dlugosc, dane?.pobrano, azymut])
  const aktualna = tabela !== null && tabela.klucz === klucz ? tabela : null

  async function policzTabele() {
    if (!lokalizacja || !dane || azymut === undefined) return
    const r = await uruchom({
      typ: "tabela-napromieniowania",
      wejscie: {
        szerokoscGeograficzna: lokalizacja.szerokosc,
        dlugoscGeograficzna: lokalizacja.dlugosc,
        daneGodzinowe: dane.dane.rekordy,
        azymutDeg: azymut,
      },
    })
    if (!r) return
    setTabela({ klucz, t: r.wynik.value, blad: r.wynik.status !== "VALID" })
    const t = r.wynik.value
    if (t) {
      // Start suwaka na najlepszym kącie stałym — tylko gdy użytkownik nie ustawił kąta w trakcie liczenia (16.7).
      const roczne = t.miesiace.map((w) => w.reduce((a, b) => a + b, 0))
      const optimum = String(t.katyDeg[roczne.indexOf(Math.max(...roczne))])
      setStan((prev) => (prev.nachylenieDeg === "" ? { ...prev, nachylenieDeg: optimum } : prev))
    }
  }

  const pr = liczba(stan.wspolczynnikPr)
  const result = useMemo(
    () =>
      calculateKatIAzymut({
        tabela: aktualna?.t ?? null,
        nachylenieDeg: liczba(stan.nachylenieDeg) ?? null,
        mocInstalacjiKwp: liczba(stan.mocInstalacjiKwp) ?? 0,
        wspolczynnikPr: pr === undefined ? null : pr,
      }),
    [aktualna, stan.nachylenieDeg, stan.mocInstalacjiKwp, pr],
  )

  if (!wczytano) return <StanLadowania linie={6} />
  const r = result.value
  const zProdukcja = r?.produkcjaMiesiecznaKwh ?? null

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kat-i-azymut" />
      <NaglowekEkranu tytul="Kąt pochylenia i azymut" ekran="kat-i-azymut" wzor={result.formula}>
        Ile słońca złapią panele w każdym miesiącu przy wybranym kącie i kierunku — policzone z godzinowych danych
        PVGIS dla Twojej lokalizacji. Dla stelaża z regulacją: najlepszy kąt na każdy miesiąc. Moduł 3, Ekran 1.
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />

      <section className="flex flex-col gap-3">
        <Pole
          label="Azymut paneli"
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={360}
          value={stan.azymutDeg}
          onChange={(e) => ustaw("azymutDeg", e.target.value)}
          pomoc={<PomocPola ekran="kat-i-azymut" pole="azymut" />}
        />
        <Button className="min-h-11" disabled={!lokalizacja || !dane || azymut === undefined || obliczenia.liczy} onClick={policzTabele}>
          {obliczenia.liczy ? "Liczę nasłonecznienie dla kątów 0–90°…" : "Policz nasłonecznienie"}
        </Button>
        {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
        {tabela && !aktualna && !obliczenia.liczy && <StanPusty tytul="Zmieniła się lokalizacja lub azymut — policz ponownie." />}
      </section>

      {aktualna && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-small font-medium">
            <div className="flex items-center gap-1">
              <label htmlFor="suwak-kata">
                Kąt pochylenia: {stan.nachylenieDeg === "" ? "—" : `${stan.nachylenieDeg}°`}
              </label>
              <PomocPola ekran="kat-i-azymut" pole="kat" />
            </div>
            <span className="font-normal text-muted-foreground">0° = panel leży płasko, 90° = panel stoi pionowo.</span>
            <input
              id="suwak-kata"
              type="range"
              min={0}
              max={90}
              step={1}
              value={stan.nachylenieDeg === "" ? 35 : stan.nachylenieDeg}
              onChange={(e) => ustaw("nachylenieDeg", e.target.value)}
              className="min-h-11 w-full accent-sky-600"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Pole
              label="Moc instalacji"
              unit="kWp"
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.mocInstalacjiKwp}
              onChange={(e) => ustaw("mocInstalacjiKwp", e.target.value)}
              pomoc={<PomocPola ekran="kat-i-azymut" pole="moc" />}
            />
            <Pole
              label="Współczynnik wydajności PR"
              type="number"
              inputMode="decimal"
              min={0}
              max={1}
              step={0.01}
              value={stan.wspolczynnikPr}
              onChange={(e) => ustaw("wspolczynnikPr", e.target.value)}
              pomoc={<PomocPola ekran="kat-i-azymut" pole="pr" />}
            />
          </div>
        </section>
      )}

      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}

      {r && (
        <WerdyktPanel poziom="ok" etykieta={`Kąt ${r.nachylenieDeg}°, azymut ${aktualna?.t?.azymutDeg}°`}>
          <WynikGlowny>
            {zProdukcja ? `${f0(r.produkcjaRocznaKwh!)} kWh/rok` : `${f0(r.napromieniowanieRoczneKwhM2)} kWh/m² rocznie`}
          </WynikGlowny>
          <p className="text-small text-muted-foreground">
            {zProdukcja ? "Roczna produkcja" : "Roczne nasłonecznienie paneli"} — każdy miesiąc:
          </p>
          <WykresMiesieczny
            wartosci={zProdukcja ?? r.napromieniowanieMiesieczneKwhM2}
            jednostka={zProdukcja ? "kWh" : "kWh/m²"}
          />
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}

          <h3 className="mt-3 font-semibold">Który kąt jest najlepszy?</h3>
          <WykresKata
            wartosci={r.napromieniowanieRoczneWgKataKwhM2}
            wybrany={r.nachylenieDeg}
            optimum={r.optimumRoczne.nachylenieDeg}
          />
          <p className="text-small">
            Najlepszy <strong>stały</strong> kąt przy tym azymucie: <strong>{r.optimumRoczne.nachylenieDeg}°</strong> (
            {f0(r.optimumRoczne.napromieniowanieRoczneKwhM2)} kWh/m² rocznie). Twój kąt daje{" "}
            {f1((100 * r.napromieniowanieRoczneKwhM2) / r.optimumRoczne.napromieniowanieRoczneKwhM2)}% tej wartości.
          </p>

          <h3 className="mt-3 font-semibold">Stelaż z regulacją kąta — najlepszy kąt w każdym miesiącu</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-2 font-medium">Miesiąc</th>
                  <th className="p-2 text-right font-medium">Najlepszy kąt</th>
                  <th className="p-2 text-right font-medium">kWh/m² przy nim</th>
                  <th className="p-2 text-right font-medium">kWh/m² przy {r.nachylenieDeg}°</th>
                </tr>
              </thead>
              <tbody>
                {r.optimumMiesieczne.map((o, m) => (
                  <tr key={m} className="border-b last:border-0">
                    <td className="p-2">{MIESIACE[m]}</td>
                    <td className="p-2 text-right font-mono">{o.nachylenieDeg}°</td>
                    <td className="p-2 text-right font-mono">{f0(o.napromieniowanieKwhM2)}</td>
                    <td className="p-2 text-right font-mono">{f0(r.napromieniowanieMiesieczneKwhM2[m]!)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-small">
            Przestawiając stelaż co miesiąc zyskasz <strong>{f1(r.zyskRegulacjiWzgledemWybranegoPct)}%</strong> względem
            kąta {r.nachylenieDeg}° i {f1(r.zyskRegulacjiWzgledemOptimumPct)}% względem najlepszego kąta stałego.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
