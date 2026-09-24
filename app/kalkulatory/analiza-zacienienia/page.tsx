"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useMemo, useState } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { kolorStraty, normalnaPolaci, type ProbkaMapy } from "@/components/lokalizacja/mapa-cieplna"
import { MIESIACE, WykresMiesiecy, WykresHoryzontu } from "@/components/lokalizacja/wykresy-zacienienia"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WerdyktPanel } from "@/components/werdykt"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import type { Assumption, Warning } from "@/lib/core/calc-result"
import type { Punkt3D } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/input"
import { calculateSkanerDzialki } from "@/lib/core/modules/lokalizacja/skaner-dzialki/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import {
  dachWedlugObrysu,
  KLUCZ_MODELU_DZIALKI,
  liczba,
  MODEL_PUSTY,
  polacieLokalne,
  przeszkodyZacienienia,
  punktyProbkowania,
  SIATKA_PROBKOWANIA,
  wejscieSkanera,
  wejscieZacienienia,
  type ModelDzialki,
  type PolacLokalna,
  type PrognozaSeed,
} from "@/lib/lokalizacja/model-dzialki"
import { zapisPasuje } from "@/lib/lokalizacja/dane-tmy"
import { podsumujPowierzchnie, type PodsumowaniePowierzchni } from "@/lib/lokalizacja/podsumowanie-zacienienia"
import { useDaneTmy } from "@/lib/lokalizacja/use-dane-tmy"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"
import { useOnline } from "@/lib/lokalizacja/use-online"

const Widok3d = dynamic(() => import("@/components/lokalizacja/widok-3d"), {
  ssr: false,
  loading: () => <StanLadowania linie={6} />,
})

type StanE3 = {
  prognoza: PrognozaSeed
  /** Dach płaski wg obrysu budynku — gdy Skaner nie ma połaci z wysokościami (np. obrys z ULDK). */
  dach: { wysokoscM: string; nachyleniePaneliDeg: string; azymutPaneliDeg: string }
}

const STAN_POCZATKOWY: StanE3 = {
  prognoza: { wysokosci: {}, lat: "" },
  dach: { wysokoscM: "", nachyleniePaneliDeg: "", azymutPaneliDeg: "" },
}

/** Siatka punktów mapy cieplnej na powierzchnię: n × n (każdy punkt ~0,15 s obliczeń w tle). */
const SIATKA = SIATKA_PROBKOWANIA

type Powierzchnia = { polac: PolacLokalna; punkty: Punkt3D[] }
type WynikE3 = {
  klucz: string
  /** Wariant obliczenia: strata całkowita (PVGIS TMY) albo zapasowa — bezpośrednie clear-sky. */
  zrodlo: "pvgis-tmy" | "czyste-niebo"
  podsumowania: (PodsumowaniePowierzchni | null)[]
  assumptions: Assumption[]
  /** Ostrzeżenia kalkulatora, bez powtórzeń (każdy punkt siatki zwraca te same). */
  warnings: Warning[]
}

const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function AnalizaZacienieniaPage() {
  const t = useTranslate()
  const { dane: zapisanyModel, wczytano } = useOdczytDraftu<ModelDzialki>(KLUCZ_MODELU_DZIALKI)
  const model = zapisanyModel ?? MODEL_PUSTY
  const [stan, setStan] = usePersistedDraft<StanE3>("analiza-zacienienia", STAN_POCZATKOWY)
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const tmy = useDaneTmy()
  const online = useOnline()
  const [wynikE3, setWynikE3] = useState<WynikE3 | null>(null)
  const [wybrana, setWybrana] = useState(0)

  const skaner = useMemo(() => calculateSkanerDzialki(wejscieSkanera(model)), [model])
  const w = skaner.value
  const przeszkody = useMemo(() => przeszkodyZacienienia(w, stan.prognoza), [w, stan.prognoza])
  /** Prognoza wzrostu tylko dla drzew (walców) — bryły budynków nie rosną. */
  const drzewa = useMemo(() => w.przeszkody.filter((p) => p.typ === "walec"), [w])

  const powierzchnie: Powierzchnia[] = useMemo(() => {
    const polacie = polacieLokalne(model, w)
    const h = liczba(stan.dach.wysokoscM)
    const beta = liczba(stan.dach.nachyleniePaneliDeg)
    const az = liczba(stan.dach.azymutPaneliDeg)
    const dach = polacie.length === 0 && h !== undefined && beta !== undefined && az !== undefined ? dachWedlugObrysu(w, h, beta, az) : null
    return [...polacie, ...(dach ? [dach] : [])].map((polac) => ({ polac, punkty: punktyProbkowania(polac, SIATKA) }))
  }, [model, w, stan.dach])

  const wejscia = useMemo(
    () => powierzchnie.map((p) => p.punkty.map((pt) => wejscieZacienienia(w, stan.prognoza, p.polac, pt))),
    [powierzchnie, w, stan.prognoza],
  )
  // Dane TMY (te same co Ekran 4) — brak → wariant zapasowy clear-sky (TD14, decyzja właściciela).
  const odn = w.odniesienie
  const dane = odn && zapisPasuje(tmy.zapis, odn.szerokosc, odn.dlugosc) ? tmy.zapis : null
  // Klucz bez 8760 rekordów (stringify per punkt byłby kosztowny) — dane identyfikuje data pobrania.
  const klucz = useMemo(() => JSON.stringify([wejscia, dane?.pobrano]), [wejscia, dane?.pobrano])
  const aktualny = wynikE3 !== null && wynikE3.klucz === klucz

  async function policz() {
    const rekordy = dane?.dane.rekordy
    const plaskie = wejscia.flat().map((x) => (rekordy ? { ...x, daneGodzinowe: rekordy } : x))
    const r = await uruchom({ typ: "zacienienie", wejscia: plaskie })
    if (!r) return
    let k = 0
    const podsumowania = wejscia.map((grupa) => {
      const wyniki = r.wyniki.slice(k, k + grupa.length)
      k += grupa.length
      return podsumujPowierzchnie(grupa.map((x) => x.punkt!), wyniki)
    })
    const pierwszy = r.wyniki.find((x) => x.status === "VALID" || x.status === "VALID_WITH_WARNINGS")
    const warnings = [...new Map(r.wyniki.flatMap((x) => x.warnings).map((x) => [x.code + JSON.stringify(x.params ?? {}), x])).values()]
    setWynikE3({
      klucz,
      zrodlo: rekordy ? "pvgis-tmy" : "czyste-niebo",
      podsumowania,
      assumptions: pierwszy?.assumptions ?? [],
      warnings,
    })
  }

  const ustawPrognoze = (z: Partial<PrognozaSeed>) => setStan((s) => ({ ...s, prognoza: { ...s.prognoza, ...z } }))
  const przelaczMiesiac = (m: number, wlaczony: boolean) =>
    setStan((s) => {
      const bez = (s.prognoza.miesiaceBezlisci ?? []).filter((x) => x !== m)
      return { ...s, prognoza: { ...s.prognoza, miesiaceBezlisci: wlaczony ? [...bez, m].sort((a, b) => a - b) : bez } }
    })
  const ustawDach = (z: Partial<StanE3["dach"]>) => setStan((s) => ({ ...s, dach: { ...s.dach, ...z } }))

  const podsumowania = aktualny ? wynikE3.podsumowania : []
  const skalaMax = Math.max(10, ...podsumowania.flatMap((p) => (p ? p.strataPunktow.filter((x): x is number => x !== null) : [])))
  const probki: ProbkaMapy[] = powierzchnie.flatMap((p, i) => {
    const pod = podsumowania[i]
    if (!pod) return []
    const xs = p.polac.punkty.map((q) => q.x)
    const ys = p.polac.punkty.map((q) => q.y)
    const rozmiarM = Math.min(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / SIATKA
    const normalna = normalnaPolaci(p.polac.punkty)
    return p.punkty.map((punkt, j) => ({ punkt, strataProcent: pod.strataPunktow[j] ?? null, normalna, rozmiarM }))
  })
  const wysokoscBudynku =
    powierzchnie.length > 0 ? Math.min(...powierzchnie.flatMap((p) => p.polac.punkty.map((q) => q.z))) : null

  const wybor = Math.min(wybrana, Math.max(0, powierzchnie.length - 1))
  const pod = podsumowania[wybor] ?? null
  const polaczone = powierzchnie.map((p, i) => ({ nazwa: p.polac.nazwa, pod: podsumowania[i] ?? null }))
  const najlepsza = polaczone
    .filter((x) => x.pod)
    .sort((a, b) => a.pod!.obecnie.strataRocznaProcent - b.pod!.obecnie.strataRocznaProcent)[0]

  if (!wczytano || !tmy.wczytano) return <StanLadowania linie={6} />

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/analiza-zacienienia" />
      <NaglowekEkranu tytul="Analiza zacienienia">
        Dla każdej godziny roku sprawdza, czy przeszkoda zasłania słońce, i sumuje roczną stratę energii. Cień to niewidoczny złodziej energii — jedno drzewo, które dziś ledwo sięga dachu, za 10 lat może
        zasłaniać połowę instalacji, jeśli się z tym nie policzy od razu. Moduł 1, Ekran 3.
      </NaglowekEkranu>

      {!w.odniesienie ? (
        <StanPusty tytul="Najpierw zbierz model działki na Ekranie 2.">
          <Link href="/kalkulatory/skaner-dzialki" className="underline">
            → Skaner działki
          </Link>
        </StanPusty>
      ) : (
        <>
          <Widok3d
            dzialka={w.dzialka?.punkty ?? []}
            budynek={w.budynek?.punkty ?? []}
            wysokoscBudynkuM={wysokoscBudynku}
            polacie={powierzchnie.filter((p) => p.polac.nazwa !== "Dach wg obrysu budynku").map((p) => p.polac.punkty)}
            przeszkody={przeszkody}
            probki={probki}
            skalaMaxProcent={skalaMax}
          />
          {probki.length > 0 && (
            <div className="flex items-center gap-2 text-small" aria-label="Legenda mapy cieplnej">
              <span>0%</span>
              <span
                className="h-3 flex-1 rounded"
                style={{ background: `linear-gradient(to right, ${kolorStraty(0, 1)}, ${kolorStraty(0.5, 1)}, ${kolorStraty(1, 1)})` }}
              />
              <span>{f1(skalaMax)}% straty rocznej</span>
            </div>
          )}

          {powierzchnie.length === 0 && (
            <section className="flex flex-col gap-2 rounded-lg border p-4">
              <h2 className="font-semibold">Dach płaski wg obrysu budynku</h2>
              <p className="text-small text-muted-foreground">
                Model nie ma połaci z wysokościami (np. obrys budynku z Geoportalu). Podaj wysokość dachu i planowane
                ustawienie paneli — analiza obejmie cały obrys na tej wysokości.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Pole label="Wysokość dachu" unit="m" inputMode="decimal" value={stan.dach.wysokoscM} onChange={(e) => ustawDach({ wysokoscM: e.target.value })} />
                <Pole label="Nachylenie paneli" unit="°" inputMode="decimal" value={stan.dach.nachyleniePaneliDeg} onChange={(e) => ustawDach({ nachyleniePaneliDeg: e.target.value })} />
                <Pole label="Azymut paneli" unit="°" inputMode="decimal" hint="S = 180" value={stan.dach.azymutPaneliDeg} onChange={(e) => ustawDach({ azymutPaneliDeg: e.target.value })} />
              </div>
            </section>
          )}

          <section className="flex flex-col gap-2 rounded-lg border p-4">
            <h2 className="font-semibold">Przeszkody i prognoza wzrostu</h2>
            {w.przeszkody.length === 0 ? (
              <p className="text-small text-muted-foreground">
                Model nie ma przeszkód — dodaj drzewa i sąsiednie budynki na Ekranie 2.
              </p>
            ) : drzewa.length === 0 ? (
              <p className="text-small text-muted-foreground">
                Przeszkody w modelu to bryły o stałej wysokości (budynki, ściany) — prognoza wzrostu dotyczy tylko drzew.
              </p>
            ) : (
              <>
                <Pole
                  label="Horyzont prognozy"
                  unit="lata"
                  inputMode="numeric"
                  value={stan.prognoza.lat}
                  onChange={(e) => ustawPrognoze({ lat: e.target.value })}
                  placeholder="np. 10"
                />
                {drzewa.map((p) => (
                  <div key={p.nazwa} className="flex flex-col gap-1">
                    <Pole
                      label={`${p.nazwa} — wysokość za ${stan.prognoza.lat || "…"} lat (dziś ${f1(p.wysokoscM)} m)`}
                      unit="m"
                      inputMode="decimal"
                      value={stan.prognoza.wysokosci[p.nazwa] ?? ""}
                      onChange={(e) => ustawPrognoze({ wysokosci: { ...stan.prognoza.wysokosci, [p.nazwa]: e.target.value } })}
                    />
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none"
                        checked={stan.prognoza.lisciaste?.[p.nazwa] ?? false}
                        onChange={(e) => ustawPrognoze({ lisciaste: { ...stan.prognoza.lisciaste, [p.nazwa]: e.target.checked } })}
                      />
                      <span className="text-small">Drzewo liściaste (zimą bez liści)</span>
                    </label>
                  </div>
                ))}
                {Object.values(stan.prognoza.lisciaste ?? {}).some(Boolean) && (
                  <fieldset className="flex flex-col gap-1">
                    <legend className="text-small font-medium">Miesiące bez liści w Twojej okolicy</legend>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {MIESIACE.map((nazwa, m) => (
                        <label key={nazwa} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none"
                            checked={stan.prognoza.miesiaceBezlisci?.includes(m) ?? false}
                            onChange={(e) => przelaczMiesiac(m, e.target.checked)}
                          />
                          <span className="text-small">{nazwa}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-small text-muted-foreground">
                      W zaznaczonych miesiącach korona drzewa liściastego przepuszcza 40% promieniowania bezpośredniego
                      (dolna granica pomiarów, Konarska i in. 2014). Okres bez liści zależy od gatunku i okolicy — aplikacja go nie zakłada.
                    </p>
                  </fieldset>
                )}
              </>
            )}
          </section>

          <section className="flex flex-col gap-2 rounded-lg border p-4">
            <h2 className="font-semibold">Dane nasłonecznienia</h2>
            {dane ? (
              <p className="text-small text-muted-foreground">
                Typowy rok meteorologiczny PVGIS ({dane.dane.meta.bazaPromieniowania}, lata {dane.dane.meta.rokOd}–{dane.dane.meta.rokDo}),
                zapisany na urządzeniu — strata całkowitej energii, z rzeczywistym zachmurzeniem. Działa offline.
              </p>
            ) : (
              <p className="text-small text-muted-foreground">
                Bez danych PVGIS liczę wariant zapasowy: stratę samego promieniowania bezpośredniego przy bezchmurnym
                niebie. Pobierz dane (raz, potem działają offline), żeby policzyć stratę całkowitej energii.
              </p>
            )}
            {odn && (
              <Button
                variant={dane ? "outline" : "default"}
                className="min-h-11"
                disabled={tmy.pobiera || !online}
                onClick={() => tmy.pobierz(odn.szerokosc, odn.dlugosc)}
              >
                {tmy.pobiera ? "Pobieram z PVGIS…" : dane ? "Pobierz ponownie" : "Pobierz dane nasłonecznienia (PVGIS)"}
              </Button>
            )}
            {!online && !dane && <p className="text-small">Brak połączenia — pobierz dane, gdy będziesz online.</p>}
            {tmy.blad && <p className="text-small text-werdykt-blad-foreground">{tmy.blad}</p>}
          </section>

          <Button className="min-h-11" disabled={obliczenia.liczy || powierzchnie.length === 0} onClick={policz}>
            {obliczenia.liczy
              ? `Liczę… ${obliczenia.wszystkie > 0 ? `${obliczenia.gotowe}/${obliczenia.wszystkie} punktów` : ""}`
              : aktualny
                ? "Przelicz ponownie"
                : "Policz zacienienie"}
          </Button>
          {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
          {powierzchnie.length === 0 && (
            <StanPusty tytul="Brak powierzchni do analizy — dodaj połacie z wysokościami na Ekranie 2 albo podaj dach płaski wyżej." />
          )}
          {wynikE3 && !aktualny && !obliczenia.liczy && <StanPusty tytul="Dane zmieniły się od ostatniego obliczenia — policz ponownie." />}

          {aktualny && (
            <>
              {powierzchnie.length > 1 && (
                <div role="tablist" aria-label="Powierzchnia" className="flex flex-wrap gap-2">
                  {polaczone.map((x, i) => (
                    <Button key={i} role="tab" aria-selected={i === wybor} variant={i === wybor ? "default" : "outline"} onClick={() => setWybrana(i)}>
                      {x.nazwa}
                      {x.pod ? ` · ${f1(x.pod.obecnie.strataRocznaProcent)}%` : ""}
                    </Button>
                  ))}
                </div>
              )}
              {pod === null ? (
                <StanPusty tytul="Dla tej powierzchni nie powstał żaden wynik — każdy punkt leży w obrysie przeszkody." />
              ) : (
                <WerdyktPanel
                  poziom={pod.obecnie.strataRocznaProcent === 0 ? "ok" : "uwaga"}
                  etykieta={`${polaczone[wybor]!.nazwa}: strata ok. ${f1(pod.obecnie.strataRocznaProcent)}% rocznie`}
                >
                  <div className="mt-2 flex flex-col gap-3 text-small">
                    {pod.obecnie.udzialPrzeszkod.length > 0 ? (
                      <p>
                        Główna przyczyna: {pod.obecnie.udzialPrzeszkod[0]!.nazwa} ({f1(pod.obecnie.udzialPrzeszkod[0]!.procent)} p.p.)
                        {pod.obecnie.udzialPrzeszkod.length > 1 &&
                          `; dalej: ${pod.obecnie.udzialPrzeszkod
                            .slice(1)
                            .map((u) => `${u.nazwa} ${f1(u.procent)} p.p.`)
                            .join(", ")}`}
                        .
                      </p>
                    ) : (
                      <p>Żadna z przeszkód nie zasłania słońca w ciągu roku.</p>
                    )}
                    {pod.prognoza && (
                      <p>
                        Za {stan.prognoza.lat || "…"} lat (prognozowana wysokość drzew): strata ok.{" "}
                        <strong>{f1(pod.prognoza.strataRocznaProcent)}%</strong> rocznie.
                      </p>
                    )}
                    {najlepsza && najlepsza.nazwa !== polaczone[wybor]!.nazwa && najlepsza.pod!.obecnie.strataRocznaProcent < pod.obecnie.strataRocznaProcent && (
                      <p>
                        Najmniej zacieniona: {najlepsza.nazwa} ({f1(najlepsza.pod!.obecnie.strataRocznaProcent)}%) — rozważ montaż tam.
                      </p>
                    )}
                    {pod.pominiete > 0 && <p>{pod.pominiete} punkt(y) siatki leżą w obrysie przeszkody — pominięte.</p>}
                    <WykresMiesiecy obecnie={pod.obecnie.strataMiesiecznaProcent} prognoza={pod.prognoza?.strataMiesiecznaProcent ?? null} />
                    <WykresHoryzontu profilDeg={pod.profilHoryzontuDeg} />
                    <p className="text-muted-foreground">
                      {wynikE3.zrodlo === "pvgis-tmy"
                        ? "Zakres: strata całkowitego napromieniowania (dane PVGIS, rzeczywiste zachmurzenie)."
                        : "Zakres (wariant zapasowy, bez danych PVGIS): strata promieniowania bezpośredniego przy bezchmurnym niebie — nie całkowitej energii."}{" "}
                      Mapa cieplna: średnia z siatki {SIATKA}×{SIATKA} punktów na powierzchnię.
                    </p>
                    {wynikE3.warnings.length > 0 && (
                      <ul className="flex flex-col gap-1">
                        {wynikE3.warnings.map((x, i) => (
                          <li key={x.code + i}>{x.message ?? t(x.i18nKey ?? x.code, x.params)}</li>
                        ))}
                      </ul>
                    )}
                    <ZalozeniaLista assumptions={wynikE3.assumptions} />
                  </div>
                </WerdyktPanel>
              )}
            </>
          )}
        </>
      )}

      <nav className="flex flex-wrap gap-2" aria-label="Sąsiednie ekrany">
        <Link href="/kalkulatory/skaner-dzialki" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          ← Ekran 2: Skaner działki
        </Link>
        <Link href="/kalkulatory/orientacja-powierzchni" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          → Ekran 4: Orientacja powierzchni
        </Link>
      </nav>
    </main>
  )
}
