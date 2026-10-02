"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useMemo, useState } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { kolorStraty, normalnaPolaci, type ProbkaMapy } from "@/components/lokalizacja/mapa-cieplna"
import { MIESIACE, WykresMiesiecy, WykresHoryzontu } from "@/components/lokalizacja/wykresy-zacienienia"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
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
import { PRZEPUSZCZALNOSC_KORONY_BEZLISTNEJ } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/constants"

// three.js is not in the offline precache (owner's decision 30.09.2026, SW stage 2 — lib/pwa/precache-build.ts).
// Offline, before the chunk was ever loaded, the import fails: a notice instead of an error screen —
// the rest of the screen does not depend on it.
const Widok3d = dynamic(
  () => import("@/components/lokalizacja/widok-3d").catch(() => ({ default: Widok3dBezSieci })),
  {
    ssr: false,
    loading: () => <StanLadowania linie={6} />,
  },
)

function Widok3dBezSieci() {
  const t = useTranslate()
  return <StanPusty tytul={t("UI-PWA-3D-BRAK-TYTUL")}>{t("UI-PWA-3D-BRAK-OPIS")}</StanPusty>
}

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

/** CSS gradient of the heat-map legend (not user text). */
const TLO_LEGENDY = `linear-gradient(to right, ${kolorStraty(0, 1)}, ${kolorStraty(0.5, 1)}, ${kolorStraty(1, 1)})`

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
      <NaglowekEkranu tytul={t("UI-ANAZAC-ANALIZA-ZACIENIENIA")} ekran="analiza-zacienienia" wynik={aktualny ? wynikE3 : null} parametry={{ tau: PRZEPUSZCZALNOSC_KORONY_BEZLISTNEJ * 100 }}>
        {t("UI-ANAZAC-KAZDEJ-GODZINY-ROKU")}
      </NaglowekEkranu>

      {!w.odniesienie ? (
        <StanPusty tytul={t("UI-ANAZAC-NAJPIERW-ZBIERZ-MODEL")}>
          <Link href="/kalkulatory/skaner-dzialki" className="underline">
            {t("UI-ANAZAC-SKANER-DZIALKI")}
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
            <div className="flex items-center gap-2 text-small" aria-label={t("UI-ANAZAC-LEGENDA-MAPY-CIEPLNEJ")}>
              <span>0%</span>
              <span
                className="h-3 flex-1 rounded"
                style={{ background: TLO_LEGENDY }}
              />
              <span>{t("UI-ANAZAC-STRATY-ROCZNEJ", { skalaMax: f1(skalaMax) })}</span>
            </div>
          )}

          {powierzchnie.length === 0 && (
            <section className="flex flex-col gap-2 rounded-lg border p-4">
              <h2 className="font-semibold">{t("UI-ANAZAC-DACH-PLASKI-OBRYSU")}</h2>
              <p className="text-small text-muted-foreground">
                {t("UI-ANAZAC-MODEL-POLACI-WYSOKOSCIAMI")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Pole label={t("UI-ANAZAC-WYSOKOSC-DACHU")} unit="m" inputMode="decimal" value={stan.dach.wysokoscM} onChange={(e) => ustawDach({ wysokoscM: e.target.value })} pomoc={<PomocPola ekran="analiza-zacienienia" pole="wysokoscDachu" />} />
                <Pole label={t("UI-ANAZAC-NACHYLENIE-PANELI")} unit="°" inputMode="decimal" value={stan.dach.nachyleniePaneliDeg} onChange={(e) => ustawDach({ nachyleniePaneliDeg: e.target.value })} pomoc={<PomocPola ekran="analiza-zacienienia" pole="nachylenie" />} />
                <Pole label={t("UI-ANAZAC-AZYMUT-PANELI")} unit="°" inputMode="decimal" value={stan.dach.azymutPaneliDeg} onChange={(e) => ustawDach({ azymutPaneliDeg: e.target.value })} pomoc={<PomocPola ekran="analiza-zacienienia" pole="azymut" />} />
              </div>
            </section>
          )}

          <section className="flex flex-col gap-2 rounded-lg border p-4">
            <h2 className="font-semibold">{t("UI-ANAZAC-PRZESZKODY-PROGNOZA-WZROSTU")}</h2>
            {w.przeszkody.length === 0 ? (
              <p className="text-small text-muted-foreground">
                {t("UI-ANAZAC-MODEL-PRZESZKOD-DODAJ")}
              </p>
            ) : drzewa.length === 0 ? (
              <p className="text-small text-muted-foreground">
                {t("UI-ANAZAC-PRZESZKODY-MODELU-BRYLY")}
              </p>
            ) : (
              <>
                <Pole
                  label={t("UI-ANAZAC-HORYZONT-PROGNOZY")}
                  unit={t("UI-ANAZAC-LATA")}
                  inputMode="numeric"
                  value={stan.prognoza.lat}
                  onChange={(e) => ustawPrognoze({ lat: e.target.value })}
                  placeholder="np. 10"
                  pomoc={<PomocPola ekran="analiza-zacienienia" pole="horyzont" />}
                />
                {drzewa.map((p) => (
                  <div key={p.nazwa} className="flex flex-col gap-1">
                    <Pole
                      label={t("UI-ANAZAC-WYSOKOSC-LAT-DZIS", { nazwa: p.nazwa, p: stan.prognoza.lat || "…", wysokoscM: f1(p.wysokoscM) })}
                      unit="m"
                      inputMode="decimal"
                      value={stan.prognoza.wysokosci[p.nazwa] ?? ""}
                      onChange={(e) => ustawPrognoze({ wysokosci: { ...stan.prognoza.wysokosci, [p.nazwa]: e.target.value } })}
                      pomoc={<PomocPola ekran="analiza-zacienienia" pole="wysokoscPrognoza" />}
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none"
                          checked={stan.prognoza.lisciaste?.[p.nazwa] ?? false}
                          onChange={(e) => ustawPrognoze({ lisciaste: { ...stan.prognoza.lisciaste, [p.nazwa]: e.target.checked } })}
                        />
                        <span className="text-small">{t("UI-ANAZAC-DRZEWO-LISCIASTE-ZIMA")}</span>
                      </label>
                      <PomocPola ekran="analiza-zacienienia" pole="lisciaste" params={{ tau: PRZEPUSZCZALNOSC_KORONY_BEZLISTNEJ * 100 }} />
                    </div>
                  </div>
                ))}
                {Object.values(stan.prognoza.lisciaste ?? {}).some(Boolean) && (
                  <fieldset className="flex flex-col gap-1">
                    <legend className="flex items-center gap-2 text-small font-medium">
                      {t("UI-ANAZAC-MIESIACE-BEZ-LISCI")}
                      <PomocPola ekran="analiza-zacienienia" pole="miesiaceBezlisci" params={{ tau: PRZEPUSZCZALNOSC_KORONY_BEZLISTNEJ * 100 }} />
                    </legend>
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
                      {t("UI-ANAZAC-ZAZNACZONYCH-MIESIACACH-KORO")}
                    </p>
                  </fieldset>
                )}
              </>
            )}
          </section>

          <section className="flex flex-col gap-2 rounded-lg border p-4">
            <h2 className="font-semibold">{t("UI-ANAZAC-DANE-NASLONECZNIENIA")}</h2>
            {dane ? (
              <p className="text-small text-muted-foreground">
                {t("UI-ANAZAC-TYPOWY-ROK-METEOROLOGICZNY", { bazaPromieniowania: dane.dane.meta.bazaPromieniowania, rokOd: dane.dane.meta.rokOd, rokDo: dane.dane.meta.rokDo })}
              </p>
            ) : (
              <p className="text-small text-muted-foreground">
                {t("UI-ANAZAC-BEZ-DANYCH-PVGIS")}
              </p>
            )}
            {odn && (
              <Button
                variant={dane ? "outline" : "default"}
                className="min-h-11"
                disabled={tmy.pobiera || !online}
                onClick={() => tmy.pobierz(odn.szerokosc, odn.dlugosc)}
              >
                {tmy.pobiera ? t("UI-ANAZAC-POBIERAM-PVGIS") : dane ? t("UI-ANAZAC-POBIERZ-PONOWNIE") : t("UI-ANAZAC-POBIERZ-DANE-NASLONECZNIENIA")}
              </Button>
            )}
            {!online && !dane && <p className="text-small">{t("UI-ANAZAC-BRAK-POLACZENIA-POBIERZ")}</p>}
            {tmy.blad && <p className="text-small text-werdykt-blad-foreground">{tmy.blad}</p>}
          </section>

          <Button className="min-h-11" disabled={obliczenia.liczy || powierzchnie.length === 0} onClick={policz}>
            {obliczenia.liczy
              ? t("UI-ANAZAC-LICZE", { p: obliczenia.wszystkie > 0 ? t("UI-ANAZAC-PUNKTOW", { gotowe: obliczenia.gotowe, wszystkie: obliczenia.wszystkie }) : "" })
              : aktualny
                ? t("UI-ANAZAC-PRZELICZ-PONOWNIE")
                : t("UI-ANAZAC-POLICZ-ZACIENIENIE")}
          </Button>
          {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
          {powierzchnie.length === 0 && (
            <StanPusty tytul={t("UI-ANAZAC-BRAK-POWIERZCHNI-ANALIZY")} />
          )}
          {wynikE3 && !aktualny && !obliczenia.liczy && <StanPusty tytul={t("UI-ANAZAC-DANE-ZMIENILY-OSTATNIEGO")} />}

          {aktualny && (
            <>
              {powierzchnie.length > 1 && (
                <div role="tablist" aria-label={t("UI-ANAZAC-POWIERZCHNIA")} className="flex flex-wrap gap-2">
                  {polaczone.map((x, i) => (
                    <Button key={i} role="tab" aria-selected={i === wybor} variant={i === wybor ? "default" : "outline"} onClick={() => setWybrana(i)}>
                      {x.nazwa}
                      {x.pod ? ` · ${f1(x.pod.obecnie.strataRocznaProcent)}%` : ""}
                    </Button>
                  ))}
                </div>
              )}
              {pod === null ? (
                <StanPusty tytul={t("UI-ANAZAC-TEJ-POWIERZCHNI-POWSTAL")} />
              ) : (
                <WerdyktPanel
                  poziom={pod.obecnie.strataRocznaProcent === 0 ? "ok" : "uwaga"}
                  etykieta={t("UI-ANAZAC-STRATA-ROCZNIE", { nazwa: polaczone[wybor]!.nazwa, strataRocznaProcent: f1(pod.obecnie.strataRocznaProcent) })}
                >
                  <div className="mt-2 flex flex-col gap-3 text-small">
                    {pod.obecnie.udzialPrzeszkod.length > 0 ? (
                      <p>
                        {t("UI-ANAZAC-GLOWNA-PRZYCZYNA", { nazwa: pod.obecnie.udzialPrzeszkod[0]!.nazwa, procent: f1(pod.obecnie.udzialPrzeszkod[0]!.procent) })}
                        {pod.obecnie.udzialPrzeszkod.length > 1 &&
                          t("UI-ANAZAC-DALEJ", { p: pod.obecnie.udzialPrzeszkod
                            .slice(1)
                            .map((u) => `${u.nazwa} ${f1(u.procent)} p.p.`)
                            .join(", ") })}
                        .
                      </p>
                    ) : (
                      <p>{t("UI-ANAZAC-ZADNA-PRZESZKOD-ZASLANIA")}</p>
                    )}
                    {pod.prognoza && (
                      <p>
                        {t("UI-ANAZAC-LAT-PROGNOZOWANA-WYSOKOSC", { p: stan.prognoza.lat || "…" })}{" "}
                        <strong>{f1(pod.prognoza.strataRocznaProcent)}%</strong> {t("UI-ANAZAC-ROCZNIE")}
                      </p>
                    )}
                    {najlepsza && najlepsza.nazwa !== polaczone[wybor]!.nazwa && najlepsza.pod!.obecnie.strataRocznaProcent < pod.obecnie.strataRocznaProcent && (
                      <p>
                        {t("UI-ANAZAC-NAJMNIEJ-ZACIENIONA-ROZWAZ", { nazwa: najlepsza.nazwa, strataRocznaProcent: f1(najlepsza.pod!.obecnie.strataRocznaProcent) })}
                      </p>
                    )}
                    {pod.pominiete > 0 && <p>{t("UI-ANAZAC-PUNKT-SIATKI-LEZA", { pominiete: pod.pominiete })}</p>}
                    <WykresMiesiecy obecnie={pod.obecnie.strataMiesiecznaProcent} prognoza={pod.prognoza?.strataMiesiecznaProcent ?? null} />
                    <WykresHoryzontu profilDeg={pod.profilHoryzontuDeg} />
                    <p className="text-muted-foreground">
                      {wynikE3.zrodlo === "pvgis-tmy"
                        ? t("UI-ANAZAC-ZAKRES-STRATA-CALKOWITEGO")
                        : t("UI-ANAZAC-ZAKRES-WARIANT-ZAPASOWY")}{" "}{t("UI-ANAZAC-MAPA-CIEPLNA-SREDNIA", { SIATKA })}
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

      <nav className="flex flex-wrap gap-2" aria-label={t("UI-ANAZAC-SASIEDNIE-EKRANY")}>
        <Link href="/kalkulatory/skaner-dzialki" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          {t("UI-ANAZAC-EKRAN-SKANER-DZIALKI")}
        </Link>
        <Link href="/kalkulatory/orientacja-powierzchni" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          {t("UI-ANAZAC-EKRAN-ORIENTACJA-POWIERZCHNI")}
        </Link>
      </nav>
    </main>
  )
}
