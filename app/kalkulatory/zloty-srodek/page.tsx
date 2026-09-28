"use client"

import { useMemo, useState } from "react"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { MigawkaBox } from "@/components/wzorce/migawka-box"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { KATEGORIE_TERENU, type KategoriaTerenu, type StrefaWiatrowa } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import type { TabelaNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/input"
import { calculateZlotySrodek, type PunktKata } from "@/lib/core/modules/pv/zloty-srodek/calculator"
import { CENA_BALASTU_PODPOWIEDZ_ZL_KG } from "@/lib/core/modules/pv/zloty-srodek/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"

type FormularzStan = {
  azymutDeg: string
  strefa: string
  wysokoscNpmM: string
  kategoria: string
  wysokoscKonstrukcjiM: string
  powierzchniaM2: string
  phi: string
  cenaBalastu: string
  mocKwp: string
  pr: string
  cenaKwh: string
  lata: string
  nachylenieDeg: string
}

const STAN_POCZATKOWY: FormularzStan = {
  azymutDeg: "",
  strefa: "",
  wysokoscNpmM: "",
  kategoria: "",
  wysokoscKonstrukcjiM: "",
  powierzchniaM2: "",
  phi: "",
  cenaBalastu: String(CENA_BALASTU_PODPOWIEDZ_ZL_KG),
  mocKwp: "",
  pr: "",
  cenaKwh: "",
  lata: "",
  nachylenieDeg: "",
}

const OPIS_TERENU: Record<KategoriaTerenu, string> = {
  "0": "0 — morze, brzeg otwarty na morze",
  I: "I — jeziora, teren płaski bez przeszkód",
  II: "II — niska roślinność, pojedyncze drzewa/budynki daleko od siebie",
  III: "III — wieś, przedmieścia, las, regularna zabudowa",
  IV: "IV — miasto (min. 15% zabudowy wyższej niż 15 m)",
}

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

/**
 * Jedna wielkość w funkcji kąta 0–90° (mała seria wykresów zamiast jednego z trzema osiami — produkcja,
 * wiatr i śnieg mają różne jednostki). `null` = brak danych normowych: przerwa w linii, nie zero.
 */
function WykresKatowy({
  tytul,
  wartosci,
  jednostka,
  formatuj,
  rekomendacja,
  wybrany,
}: {
  tytul: string
  wartosci: (number | null)[]
  jednostka: string
  formatuj: (x: number) => string
  rekomendacja: number | null
  wybrany: number | null
}) {
  const W = 360
  const H = 110
  const liczby = wartosci.filter((v): v is number => v !== null)
  const max = Math.max(...liczby, 1e-9)
  const x = (k: number) => (k / 90) * (W - 20) + 10
  const y = (v: number) => H - 8 - (v / max) * (H - 20)
  let d = ""
  wartosci.forEach((v, k) => {
    if (v === null) return
    d += `${k === 0 || wartosci[k - 1] === null ? "M" : "L"}${x(k).toFixed(1)},${y(v).toFixed(1)} `
  })
  const znacznik = (k: number | null, klasa: string, opis: string) =>
    k !== null && wartosci[k] !== null && wartosci[k] !== undefined ? (
      <circle cx={x(k)} cy={y(wartosci[k]!)} r={5} className={klasa} strokeWidth={2}>
        <title>{`${opis} ${k}°: ${formatuj(wartosci[k]!)} ${jednostka}`}</title>
      </circle>
    ) : null
  return (
    <figure className="flex flex-col gap-1">
      <figcaption className="text-small font-medium">
        {tytul} <span className="text-muted-foreground">[{jednostka}]</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full text-foreground" role="img" aria-label={`${tytul} w zależności od kąta`}>
        <line x1={10} y1={H - 8} x2={W - 10} y2={H - 8} className="stroke-muted-foreground/40" strokeWidth={1} />
        <path d={d} className="fill-none stroke-sky-500" strokeWidth={2} />
        {wartosci.map((v, k) =>
          v !== null && (wartosci[k - 1] ?? null) === null && (wartosci[k + 1] ?? null) === null ? (
            <circle key={k} cx={x(k)} cy={y(v)} r={4} className="fill-sky-500">
              <title>{`${k}°: ${formatuj(v)} ${jednostka}`}</title>
            </circle>
          ) : null,
        )}
        {znacznik(rekomendacja, "fill-background stroke-sky-700", "Rekomendacja")}
        {znacznik(wybrany, "fill-foreground stroke-background", "Twój kąt")}
        {[0, 30, 60, 90].map((k) => (
          <text key={k} x={x(k)} y={H + 10} textAnchor="middle" className="fill-muted-foreground text-[9px]">
            {k}°
          </text>
        ))}
      </svg>
    </figure>
  )
}

export default function ZlotySrodekPage() {
  const t = useTranslate()
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zloty-srodek", STAN_POCZATKOWY)
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const [tabela, setTabela] = useState<{ klucz: string; t: TabelaNapromieniowania | null } | null>(null)
  const ustaw = (pole: keyof FormularzStan, v: string) => setStan((prev) => ({ ...prev, [pole]: v }))

  const azymut = liczba(stan.azymutDeg)
  const klucz = JSON.stringify([lokalizacja?.szerokosc, lokalizacja?.dlugosc, dane?.pobrano, azymut])
  const aktualna = tabela !== null && tabela.klucz === klucz ? tabela : null
  const wysokoscPvgis = dane?.dane.meta.wysokoscNpmM

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
    if (r) setTabela({ klucz, t: r.wynik.value })
  }

  const n = (s: string) => liczba(s) ?? null
  const strefa = stan.strefa === "" ? null : (Number(stan.strefa) as StrefaWiatrowa)
  const kategoria = stan.kategoria === "" ? null : (stan.kategoria as KategoriaTerenu)
  const wysokoscNpm = n(stan.wysokoscNpmM) ?? wysokoscPvgis ?? null
  const result = useMemo(
    () =>
      calculateZlotySrodek({
        tabela: aktualna?.t ?? null,
        strefaWiatrowa: strefa,
        wysokoscNpmM: wysokoscNpm,
        kategoriaTerenu: kategoria,
        wysokoscKonstrukcjiM: n(stan.wysokoscKonstrukcjiM),
        powierzchniaPaneliM2: n(stan.powierzchniaM2),
        wspolczynnikPhi: n(stan.phi),
        cenaBalastuZlKg: n(stan.cenaBalastu),
        mocInstalacjiKwp: n(stan.mocKwp),
        wspolczynnikPr: n(stan.pr),
        cenaEnergiiZlKwh: n(stan.cenaKwh),
        liczbaLat: n(stan.lata),
        nachylenieDeg: n(stan.nachylenieDeg),
      }),
    [aktualna, strefa, wysokoscNpm, kategoria, stan],
  )

  if (!wczytano) return <StanLadowania linie={6} />
  const r = result.value
  const punkt = (k: number | null): PunktKata | null => (r && k !== null ? (r.punkty[k] ?? null) : null)
  const rek = punkt(r?.rekomendacjaDeg ?? null)
  const opt = punkt(r?.optimumEnergiiDeg ?? null)
  const wyb = punkt(r?.wybranyDeg ?? null)
  const hMax = opt?.napromieniowanieRoczneKwhM2 ?? 1
  const katyTabeli = r ? [...new Set([0, 5, 10, 15, 20, 25, 30, r.optimumEnergiiDeg, r.wybranyDeg ?? 0, 90])].sort((a, b) => a - b) : []

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zloty-srodek" />
      <NaglowekEkranu tytul="Złoty środek — kąt, wiatr i balast">
        Kąt, który daje najwięcej energii, zwykle nie jest najtańszy w utrzymaniu: im bardziej stromy stelaż, tym
        mocniej wiatr próbuje go poderwać i tym więcej balastu trzeba. Ten ekran liczy obie strony z Twoich danych i
        normy wiatrowej PN-EN 1991-1-4. Moduł 3, Ekran 9.
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">1. Kierunek paneli</h2>
        <Pole
          label="Azymut paneli"
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={360}
          value={stan.azymutDeg}
          onChange={(e) => ustaw("azymutDeg", e.target.value)}
          hint="180° = południe, 90° = wschód, 270° = zachód."
        />
        <Button className="min-h-11" disabled={!lokalizacja || !dane || azymut === undefined || obliczenia.liczy} onClick={policzTabele}>
          {obliczenia.liczy ? "Liczę nasłonecznienie dla kątów 0–90°…" : "Policz nasłonecznienie"}
        </Button>
        {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
        {tabela && !aktualna && !obliczenia.liczy && <StanPusty tytul="Zmieniła się lokalizacja lub azymut — policz ponownie." />}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">2. Wiatr w miejscu montażu</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <PoleSelect
            label="Strefa wiatrowa"
            value={stan.strefa}
            onChange={(e) => ustaw("strefa", e.target.value)}
            hint="Odczytaj z mapy stref wiatrowych w Załączniku krajowym normy PN-EN 1991-1-4 (Rysunek NA.1)."
          >
            <option value="">— wybierz —</option>
            <option value="1">Strefa 1</option>
            <option value="2">Strefa 2</option>
            <option value="3">Strefa 3</option>
          </PoleSelect>
          <Pole
            label="Wysokość terenu n.p.m."
            unit="m"
            type="number"
            inputMode="decimal"
            value={stan.wysokoscNpmM}
            onChange={(e) => ustaw("wysokoscNpmM", e.target.value)}
            placeholder={wysokoscPvgis !== undefined ? String(wysokoscPvgis) : undefined}
            hint={
              wysokoscPvgis !== undefined
                ? `Puste = wysokość z danych PVGIS dla lokalizacji (${f0(wysokoscPvgis)} m).`
                : "Powyżej 300 m wiatr w strefach 1 i 3 liczy się mocniej."
            }
          />
        </div>
        <PoleSelect
          label="Teren wokół (kategoria terenu)"
          value={stan.kategoria}
          onChange={(e) => ustaw("kategoria", e.target.value)}
          hint="Wybierz teren, jaki ciągnie się od strony wiatru. Im bardziej otwarty, tym silniejszy wiatr przy ziemi."
        >
          <option value="">— wybierz —</option>
          {KATEGORIE_TERENU.map((k) => (
            <option key={k} value={k}>
              {OPIS_TERENU[k]}
            </option>
          ))}
        </PoleSelect>
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole
            label="Wysokość górnej krawędzi stelaża"
            unit="m"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.wysokoscKonstrukcjiM}
            onChange={(e) => ustaw("wysokoscKonstrukcjiM", e.target.value)}
            hint="Od gruntu do najwyższego punktu paneli."
          />
          <Pole
            label="Powierzchnia paneli na stelażu"
            unit="m²"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.powierzchniaM2}
            onChange={(e) => ustaw("powierzchniaM2", e.target.value)}
            hint="Suma powierzchni paneli na jednym stelażu (np. 6 paneli × 1,95 m²)."
          />
        </div>
        <Pole
          label="Zabudowa pod stelażem φ"
          type="number"
          inputMode="decimal"
          min={0}
          max={1}
          step={0.1}
          value={stan.phi}
          onChange={(e) => ustaw("phi", e.target.value)}
          hint="0 = pod panelami pusto (typowy stelaż naziemny). 1 = pod panelami składowane rzeczy aż do krawędzi (drewno, skrzynie). Wartości pośrednie dozwolone."
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">3. Balast i wycena energii</h2>
        <Pole
          label="Cena balastu"
          unit="zł/kg"
          type="number"
          inputMode="decimal"
          min={0}
          step={0.1}
          value={stan.cenaBalastu}
          onChange={(e) => ustaw("cenaBalastu", e.target.value)}
          hint="Podpowiedź 1 zł/kg — bloczki odlane samodzielnie z betonu (wartość właściciela projektu, nie z normy). Wpisz swoją cenę."
        />
        <p className="text-small text-muted-foreground">
          Żeby aplikacja wskazała najlepszy kąt, podaj też, ile warta jest energia. Bez tego zobaczysz wykresy i możesz
          sprawdzić dowolny kąt.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole label="Moc paneli na stelażu" unit="kWp" type="number" inputMode="decimal" min={0} value={stan.mocKwp} onChange={(e) => ustaw("mocKwp", e.target.value)} />
          <Pole
            label="Współczynnik wydajności PR"
            type="number"
            inputMode="decimal"
            min={0}
            max={1}
            step={0.01}
            value={stan.pr}
            onChange={(e) => ustaw("pr", e.target.value)}
            hint="Ułamek 0–1 — część energii, która zostaje po stratach. Źródło nie podaje wartości."
          />
          <Pole
            label="Wartość 1 kWh"
            unit="zł"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={stan.cenaKwh}
            onChange={(e) => ustaw("cenaKwh", e.target.value)}
            hint="Ile płaciłbyś za tę energię z innego źródła (sieć, agregat)."
          />
          <Pole
            label="Okres analizy"
            unit="lat"
            type="number"
            inputMode="numeric"
            min={1}
            value={stan.lata}
            onChange={(e) => ustaw("lata", e.target.value)}
            hint="Przez ile lat liczyć wartość energii."
          />
        </div>
      </section>

      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}
      {result.status === "INCOMPLETE" && aktualna && (
        <StanPusty tytul="Uzupełnij dane wiatru i cenę balastu — wtedy pojawią się wykresy i balast." />
      )}

      {r && (
        <WerdyktPanel poziom="uwaga" etykieta={rek ? `Złoty środek: ${rek.nachylenieDeg}°` : "Porównanie kątów"}>
          {rek ? (
            <>
              <WynikGlowny>{rek.nachylenieDeg}°</WynikGlowny>
              <p className="text-small">
                Przy {rek.nachylenieDeg}° masz {f1((100 * rek.napromieniowanieRoczneKwhM2) / hMax)}% energii najlepszego
                kąta ({r.optimumEnergiiDeg}°), siła wiatru to {f0(rek.silaWiatruN!)} N, a balast projektowy (PN-EN 1990){" "}
                <strong>{f0(rek.balastKg!)} kg</strong> ≈ {f0(rek.kosztBalastuZl!)} zł. Bilans w okresie analizy
                (wartość energii minus balast): {f0(rek.bilansZl!)} zł — najwyższy spośród kątów 0–30°.
              </p>
            </>
          ) : (
            <p className="text-small">Najwięcej energii daje kąt {r.optimumEnergiiDeg}°.</p>
          )}
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}

          <label className="mt-3 flex flex-col gap-1 text-small font-medium" htmlFor="suwak-zs">
            Sprawdź dowolny kąt: {stan.nachylenieDeg === "" ? "—" : `${stan.nachylenieDeg}°`}
            <input
              id="suwak-zs"
              type="range"
              min={0}
              max={90}
              step={1}
              value={stan.nachylenieDeg === "" ? (r.rekomendacjaDeg ?? r.optimumEnergiiDeg) : stan.nachylenieDeg}
              onChange={(e) => ustaw("nachylenieDeg", e.target.value)}
              className="min-h-11 w-full accent-sky-600"
            />
          </label>
          {wyb && (
            <p className="text-small">
              {wyb.nachylenieDeg}°: energia {f1((100 * wyb.napromieniowanieRoczneKwhM2) / hMax)}% maksimum, śnieg μ1 ={" "}
              {f2(wyb.mu1)}
              {wyb.silaWiatruN !== null ? `, wiatr ${f0(wyb.silaWiatruN)} N (${f0(wyb.procentSilyMaks!)}% najgorszego ustawienia)` : ", wiatr — brak danych normy"}
              {wyb.balastKg !== null ? `, balast ${f0(wyb.balastKg)} kg ≈ ${f0(wyb.kosztBalastuZl!)} zł` : ""}.
            </p>
          )}

          <div className="mt-3 flex flex-col gap-4">
            <WykresKatowy
              tytul="Energia w roku"
              wartosci={r.punkty.map((p) => (100 * p.napromieniowanieRoczneKwhM2) / hMax)}
              jednostka="% maksimum"
              formatuj={f1}
              rekomendacja={r.rekomendacjaDeg}
              wybrany={r.wybranyDeg}
            />
            <WykresKatowy
              tytul="Siła wiatru odrywająca stelaż (0–30°) i pchająca pion (90°)"
              wartosci={r.punkty.map((p) => p.silaWiatruN)}
              jednostka="N"
              formatuj={f0}
              rekomendacja={r.rekomendacjaDeg}
              wybrany={r.wybranyDeg}
            />
            <WykresKatowy
              tytul="Śnieg zostający na panelu (μ1)"
              wartosci={r.punkty.map((p) => p.mu1)}
              jednostka="× obciążenie gruntu"
              formatuj={f2}
              rekomendacja={r.rekomendacjaDeg}
              wybrany={r.wybranyDeg}
            />
            <p className="text-caption text-muted-foreground">
              Wykres wiatru ma przerwę 31–89°: norma nie podaje dla tych kątów siły na wiatę, więc aplikacja jej nie
              zgaduje. Śnieg nie różnicuje kątów 0–30° (μ1 = 0,8) — zaczyna zsuwać się dopiero przy większym nachyleniu.
            </p>
          </div>

          <h3 className="mt-3 font-semibold">Tabela kątów</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[320px] text-small">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-2 font-medium">Kąt</th>
                  <th className="p-2 text-right font-medium">Energia</th>
                  <th className="p-2 text-right font-medium">Wiatr [N]</th>
                  <th className="p-2 text-right font-medium">Balast proj. [kg]</th>
                  <th className="p-2 text-right font-medium">Koszt [zł]</th>
                </tr>
              </thead>
              <tbody>
                {katyTabeli.map((k) => {
                  const p = r.punkty[k]!
                  return (
                    <tr key={k} className={`border-b last:border-0 ${k === r.rekomendacjaDeg ? "font-semibold" : ""}`}>
                      <td className="p-2">{k}°</td>
                      <td className="p-2 text-right font-mono">{f1((100 * p.napromieniowanieRoczneKwhM2) / hMax)}%</td>
                      <td className="p-2 text-right font-mono">{p.silaWiatruN === null ? "—" : f0(p.silaWiatruN)}</td>
                      <td className="p-2 text-right font-mono">{p.balastKg === null ? "—" : f0(p.balastKg)}</td>
                      <td className="p-2 text-right font-mono">{p.kosztBalastuZl === null ? "—" : f0(p.kosztBalastuZl)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-caption">
            Ciśnienie wiatru przy stelażu: qp = {f0(r.qpPa)} Pa (qb = {f0(r.qbPa)} Pa × ce = {f2(r.ce)}).
          </p>

          <h3 className="mt-3 font-semibold">Jak zrobić balast lub kotwienie samemu</h3>
          <ul className="list-disc pl-5 text-small">
            <li>
              <strong>Bloczki balastowe odlane samodzielnie</strong> — beton w prostych szalunkach (skrzynki z desek,
              wiadra), z zatopionym prętem lub śrubą do mocowania stelaża. Najtańsza droga do potrzebnych kilogramów.
            </li>
            <li>
              <strong>Słupki kotwiczące w gruncie</strong> — zamiast ciężaru: słupki betonowane w ziemi albo śruby
              gruntowe, a stelaż przykręcony do kotew. Ile utrzymają, zależy od gruntu — aplikacja tego nie liczy
              (brak danych geotechnicznych); zapytaj wykonawcę lub konstruktora.
            </li>
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}

      <MigawkaBox>
        „Najwyższa produkcja teoretyczna rzadko jest najlepszym wyborem w praktyce — czasem warto oddać 5-6%
        energii, żeby radykalnie obniżyć ryzyko uszkodzenia instalacji.”
      </MigawkaBox>
    </main>
  )
}
