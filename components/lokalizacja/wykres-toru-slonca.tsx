/**
 * Wykresy ekranu „Tor słońca” (Moduł 3) jako czyste SVG — bez biblioteki wykresów, działają offline i w ciemnym motywie
 * (`currentColor`, zmienne `--seria-*`). Tylko rysowanie wyników kalkulatora `pv/tor-slonca`.
 */
import type { GodzinaEnergii, IdLuku, LukSlonca } from "@/lib/core/modules/pv/tor-slonca/calculator"
import type { ProfilHoryzontu } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/profil"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"

/** Styl łuku: kolor ORAZ wzór linii (kolor nie jest jedynym nośnikiem informacji). */
export const STYL_LUKU: Record<IdLuku, { kolor: string; kreska: string | undefined; grubosc: number; etykieta: string }> = {
  lato: { kolor: "var(--seria-2)", kreska: undefined, grubosc: 1.75, etykieta: "UI-TORS-LUK-LATO" },
  rownonoc: { kolor: "var(--seria-3)", kreska: "6 3", grubosc: 1.75, etykieta: "UI-TORS-LUK-ROWNONOC" },
  zima: { kolor: "var(--seria-1)", kreska: "1 3", grubosc: 2.25, etykieta: "UI-TORS-LUK-ZIMA" },
  wybrany: { kolor: "var(--seria-4)", kreska: undefined, grubosc: 3.25, etykieta: "UI-TORS-LUK-WYBRANY" },
}

const KOLEJNOSC_RYSOWANIA: IdLuku[] = ["lato", "rownonoc", "zima", "wybrany"]
const KROK_SIATKI_AZYMUTU_DEG = 30
const KROK_SIATKI_WYSOKOSCI_DEG = 10

/** Linia w legendzie: ten sam kolor, grubość i wzór co łuk. */
export function ProbkaLuku({ id }: { id: IdLuku }) {
  const s = STYL_LUKU[id]
  return (
    <svg viewBox="0 0 28 8" className="h-2 w-7 shrink-0" aria-hidden="true">
      <line x1={1} x2={27} y1={4} y2={4} stroke={s.kolor} strokeWidth={s.grubosc} strokeDasharray={s.kreska} strokeLinecap="round" />
    </svg>
  )
}

type Polozenie = { azymutDeg: number; wysokoscDeg: number }

export function WykresToruSlonca({
  luki,
  zakresAzymutuDeg,
  polozenie,
  teraz,
  etykietyLukow,
  horyzontDeg,
}: {
  luki: LukSlonca[]
  zakresAzymutuDeg: { od: number; do: number } | null
  /** Słońce na łuku wybranego miesiąca w godzinie z suwaka; `null` = jest pod horyzontem. */
  polozenie: Polozenie | null
  /** Słońce w tej chwili (zegar urządzenia); `null` = pod horyzontem albo jeszcze nieznane. */
  teraz: Polozenie | null
  etykietyLukow: Record<IdLuku, string>
  /** Measured horizon (screen "Horyzont ze zdjęcia"): elevation per whole degree of azimuth, null = unknown. */
  horyzontDeg?: ProfilHoryzontu
}) {
  const t = useTranslate()
  const W = 360
  const H = 230
  const lewy = 30
  const prawy = 10
  const gora = 12
  const dol = 26
  const xMin = zakresAzymutuDeg ? Math.max(0, Math.floor((zakresAzymutuDeg.od - 5) / KROK_SIATKI_AZYMUTU_DEG) * KROK_SIATKI_AZYMUTU_DEG) : 45
  const xMax = zakresAzymutuDeg ? Math.min(360, Math.ceil((zakresAzymutuDeg.do + 5) / KROK_SIATKI_AZYMUTU_DEG) * KROK_SIATKI_AZYMUTU_DEG) : 315
  const maksWysokosc = Math.max(0, ...luki.map((l) => l.maksWysokoscDeg))
  const yMax = Math.max(2 * KROK_SIATKI_WYSOKOSCI_DEG, Math.ceil((maksWysokosc + 4) / KROK_SIATKI_WYSOKOSCI_DEG) * KROK_SIATKI_WYSOKOSCI_DEG)
  const x = (az: number) => lewy + ((az - xMin) / (xMax - xMin)) * (W - lewy - prawy)
  const y = (h: number) => gora + (1 - h / yMax) * (H - gora - dol)
  const pionowe: number[] = []
  for (let a = xMin; a <= xMax; a += KROK_SIATKI_AZYMUTU_DEG) pionowe.push(a)
  const poziome: number[] = []
  for (let h = 0; h <= yMax; h += KROK_SIATKI_WYSOKOSCI_DEG) poziome.push(h)
  const kierunek = (az: number): string | null =>
    az % 360 === 0 ? t("UI-TORS-KIERUNEK-N") : az === 90 ? t("UI-TORS-KIERUNEK-E") : az === 180 ? t("UI-TORS-KIERUNEK-S") : az === 270 ? t("UI-TORS-KIERUNEK-W") : null
  const sciezka = (l: LukSlonca) => l.punkty.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.azymutDeg).toFixed(1)},${y(p.wysokoscDeg).toFixed(1)}`).join(" ")

  // Measured horizon: one filled strip per contiguous run of known degrees inside the visible azimuth range.
  const pasyHoryzontu: string[] = []
  if (horyzontDeg) {
    let i = Math.ceil(xMin)
    const koniec = Math.min(Math.floor(xMax), horyzontDeg.length - 1)
    while (i <= koniec) {
      if (horyzontDeg[i] === null || horyzontDeg[i] === undefined) {
        i++
        continue
      }
      let j = i
      while (j + 1 <= koniec && horyzontDeg[j + 1] !== null && horyzontDeg[j + 1] !== undefined) j++
      const gorna = horyzontDeg.slice(i, j + 1).map((h, k) => `L${x(i + k).toFixed(1)},${y(Math.min(yMax, h!)).toFixed(1)}`)
      pasyHoryzontu.push(`M${x(i).toFixed(1)},${y(0).toFixed(1)} ${gorna.join(" ")} L${x(j).toFixed(1)},${y(0).toFixed(1)} Z`)
      i = j + 1
    }
  }

  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-foreground" role="img" aria-label={t("UI-TORS-WYKRES-ARIA")}>
        {pasyHoryzontu.map((d, k) => (
          <path key={`hor${k}`} d={d} fill="currentColor" fillOpacity={0.16} stroke="currentColor" strokeOpacity={0.5} strokeWidth={0.8} />
        ))}
        {pionowe.map((a) => (
          <g key={`v${a}`}>
            <line x1={x(a)} x2={x(a)} y1={gora} y2={y(0)} stroke="currentColor" strokeOpacity={0.12} />
            <text x={x(a)} y={H - 10} textAnchor="middle" className="fill-current text-[9px]">
              {kierunek(a) ?? `${a}°`}
            </text>
          </g>
        ))}
        {poziome.map((h) => (
          <g key={`h${h}`}>
            <line x1={lewy} x2={W - prawy} y1={y(h)} y2={y(h)} stroke="currentColor" strokeOpacity={h === 0 ? 0.5 : 0.12} />
            <text x={lewy - 4} y={y(h) + 3} textAnchor="end" className="fill-current text-[9px]">
              {h}°
            </text>
          </g>
        ))}
        {KOLEJNOSC_RYSOWANIA.map((id) => {
          const l = luki.find((k) => k.id === id)
          if (!l || l.punkty.length === 0) return null
          const s = STYL_LUKU[id]
          return (
            <g key={id}>
              <path d={sciezka(l)} fill="none" stroke={s.kolor} strokeWidth={s.grubosc} strokeDasharray={s.kreska} strokeLinecap="round" strokeLinejoin="round">
                <title>{etykietyLukow[id]}</title>
              </path>
              {l.znaczniki.map((p) => (
                <g key={p.godzinaH}>
                  <circle cx={x(p.azymutDeg)} cy={y(p.wysokoscDeg)} r={id === "wybrany" ? 2.6 : 1.8} fill={s.kolor} stroke="var(--background)" strokeWidth={0.6}>
                    <title>{`${etykietyLukow[id]} · ${p.godzinaH}:00 · ${Math.round(p.wysokoscDeg)}° / ${Math.round(p.azymutDeg)}°`}</title>
                  </circle>
                  {id === "wybrany" && p.godzinaH % 2 === 0 && (
                    <text x={x(p.azymutDeg)} y={y(p.wysokoscDeg) - 5} textAnchor="middle" className="fill-current text-[8px]">
                      {p.godzinaH}
                    </text>
                  )}
                </g>
              ))}
            </g>
          )
        })}
        {polozenie && polozenie.wysokoscDeg > 0 && (
          <circle cx={x(polozenie.azymutDeg)} cy={y(polozenie.wysokoscDeg)} r={6} fill="var(--seria-4)" stroke="currentColor" strokeWidth={1.5} />
        )}
        {teraz && teraz.wysokoscDeg > 0 && (
          <g>
            <circle cx={x(teraz.azymutDeg)} cy={y(teraz.wysokoscDeg)} r={4.5} fill="none" stroke="currentColor" strokeWidth={1.5} />
            <text x={x(teraz.azymutDeg) + 7} y={y(teraz.wysokoscDeg) + 3} className="fill-current text-[9px]">
              {t("UI-TORS-TERAZ")}
            </text>
          </g>
        )}
      </svg>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption">
        {KOLEJNOSC_RYSOWANIA.map((id) => (
          <li key={id} className="flex items-center gap-2">
            <ProbkaLuku id={id} />
            <span>{etykietyLukow[id]}</span>
          </li>
        ))}
      </ul>
      <figcaption className="text-caption text-muted-foreground">{t("UI-TORS-WYKRES-OPIS")}</figcaption>
      {pasyHoryzontu.length > 0 && <p className="text-caption text-muted-foreground">{t("UI-TORS-HORYZONT-OPIS")}</p>}
    </figure>
  )
}

/** Krok osi pionowej z ciągu 1–2–5 × 10^n, tak by osie miały 3–6 podziałek. */
function ladnyKrok(maks: number): number {
  const surowy = maks / 4
  const dziesiatka = 10 ** Math.floor(Math.log10(surowy))
  for (const m of [1, 2, 5, 10]) if (m * dziesiatka >= surowy) return m * dziesiatka
  return 10 * dziesiatka
}

export function WykresEnergiiGodzinowej({ godziny, godzinaZSuwaka, mamTypowa }: { godziny: GodzinaEnergii[]; godzinaZSuwaka: number; mamTypowa: boolean }) {
  const t = useTranslate()
  const { f2 } = useFormaty()
  const W = 360
  const H = 180
  const lewy = 36
  const prawy = 8
  const gora = 12
  const dol = 24
  const aktywne = godziny.filter((g) => g.czysteNiebo > 0 || (g.typowaKwh ?? 0) > 0).map((g) => g.godzinaH)
  const od = aktywne.length > 0 ? Math.max(0, Math.min(...aktywne) - 1) : 6
  const doH = aktywne.length > 0 ? Math.min(23, Math.max(...aktywne) + 1) : 18
  const widoczne = godziny.filter((g) => g.godzinaH >= od && g.godzinaH <= doH)
  const maks = Math.max(0.01, ...widoczne.map((g) => Math.max(g.czysteNiebo, g.typowaKwh ?? 0)))
  const krok = ladnyKrok(maks)
  const yMax = Math.ceil(maks / krok) * krok
  const szerSlupka = (W - lewy - prawy) / widoczne.length
  const x = (i: number) => lewy + i * szerSlupka
  const y = (v: number) => gora + (1 - v / yMax) * (H - gora - dol)
  const podzialki: number[] = []
  for (let v = 0; v <= yMax + krok / 2; v += krok) podzialki.push(v)
  const linia = widoczne.map((g, i) => `${i === 0 ? "M" : "L"}${(x(i) + szerSlupka / 2).toFixed(1)},${y(g.czysteNiebo).toFixed(1)}`).join(" ")

  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-foreground" role="img" aria-label={t("UI-TORS-ENERGIA-ARIA")}>
        {podzialki.map((v) => (
          <g key={v}>
            <line x1={lewy} x2={W - prawy} y1={y(v)} y2={y(v)} stroke="currentColor" strokeOpacity={v === 0 ? 0.5 : 0.12} />
            <text x={lewy - 4} y={y(v) + 3} textAnchor="end" className="fill-current text-[9px]">
              {f2(v)}
            </text>
          </g>
        ))}
        {widoczne.map((g, i) => {
          const wybrana = g.godzinaH === godzinaZSuwaka
          const wart = g.typowaKwh
          return (
            <g key={g.godzinaH}>
              {wart !== null && (
                <rect
                  x={x(i) + 1.5}
                  y={y(wart)}
                  width={Math.max(1, szerSlupka - 3)}
                  height={Math.max(0, y(0) - y(wart))}
                  fill={wybrana ? "var(--seria-4)" : "var(--seria-1)"}
                  stroke={wybrana ? "currentColor" : "none"}
                  strokeWidth={1}
                  opacity={wybrana ? 1 : 0.8}
                >
                  <title>{t("UI-TORS-ENERGIA-SLUPEK", { od: g.godzinaH, do: g.godzinaH + 1, kwh: f2(wart) })}</title>
                </rect>
              )}
              {!mamTypowa && wybrana && <rect x={x(i)} y={gora} width={szerSlupka} height={y(0) - gora} fill="var(--seria-4)" opacity={0.18} />}
              {(g.godzinaH % 2 === 0 || widoczne.length <= 10) && (
                <text x={x(i) + szerSlupka / 2} y={H - 8} textAnchor="middle" className="fill-current text-[9px]">
                  {g.godzinaH}
                </text>
              )}
            </g>
          )
        })}
        <path d={linia} fill="none" stroke="var(--seria-2)" strokeWidth={2} strokeDasharray="5 3" strokeLinecap="round" strokeLinejoin="round" />
        {widoczne.map((g, i) => (
          <circle key={`p${g.godzinaH}`} cx={x(i) + szerSlupka / 2} cy={y(g.czysteNiebo)} r={2.2} fill="var(--seria-2)">
            <title>{t("UI-TORS-ENERGIA-SLUPEK", { od: g.godzinaH, do: g.godzinaH + 1, kwh: f2(g.czysteNiebo) })}</title>
          </circle>
        ))}
        <text x={2} y={9} className="fill-current text-[9px]">
          kWh
        </text>
      </svg>
      <ul className="flex flex-col gap-1 text-caption">
        {mamTypowa && (
          <li className="flex items-center gap-2">
            <svg viewBox="0 0 28 10" className="h-2.5 w-7 shrink-0" aria-hidden="true">
              <rect x={2} y={1} width={24} height={8} fill="var(--seria-1)" opacity={0.8} />
            </svg>
            <span>{t("UI-TORS-ENERGIA-LEGENDA-TYPOWA")}</span>
          </li>
        )}
        <li className="flex items-center gap-2">
          <svg viewBox="0 0 28 8" className="h-2 w-7 shrink-0" aria-hidden="true">
            <line x1={1} x2={27} y1={4} y2={4} stroke="var(--seria-2)" strokeWidth={2} strokeDasharray="5 3" strokeLinecap="round" />
          </svg>
          <span>{mamTypowa ? t("UI-TORS-ENERGIA-LEGENDA-CZYSTE") : t("UI-TORS-ENERGIA-LEGENDA-CZYSTE-SAMA")}</span>
        </li>
      </ul>
      <figcaption className="text-caption text-muted-foreground">{t("UI-TORS-ENERGIA-OPIS")}</figcaption>
    </figure>
  )
}
