import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { wspolczynnikStratWentylacyjnychWK } from "../infiltracja-powietrza/calculator"
import { uPoDociepleniu } from "../optymalizacja-izolacji/calculator"
import { obliczStrumienCieplaPowietrzaW } from "../wentylacja-odzysk-ciepla/calculator"
import { cyklStartStop, przeplywWodyLH } from "../wspolne/hydraulika"
import { COP_NA_STOPIEN_ZASILANIA, L_NA_M3, MIN_NA_H, POLA_CZYNNIKA, W_NA_KW } from "./constants"
import type { Czynnik, KluczPola, WplywCzynnikaInput } from "./input"
import { validateInput } from "./validation"
import { buforPracaCiagla, falownikPrzeciazony, odwiertyZaMalo, ograniczenieDeficyt, pompaZaMala } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

/** One line of the result: a dictionary key (`WPC-G-*` headline, `WPC-W-*` detail) with its numbers. */
export type Wiersz = { klucz: string; params: Record<string, number> }

export type WplywCzynnikaResult = {
  /** Headline (Sekcja C of the source) — null until the factor's fields are complete. */
  glowny: Wiersz | null
  wiersze: Wiersz[]
}

/** Display rounding of a result line (2 decimals) — `t()` only swaps the decimal separator. */
export function paramsDoWyswietlenia(params: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(params).map(([k, x]) => [k, Math.round(x * 100) / 100]))
}

const PUSTY: WplywCzynnikaResult = { glowny: null, wiersze: [] }

const FORMULY: Record<Czynnik, string> = {
  okna: "\\Phi = U A \\Delta T",
  dach: "U' = 1/(1/U + d/\\lambda),\\; \\Phi = U A \\Delta T",
  podloga: "U' = 1/(1/U + d/\\lambda),\\; \\Phi = U A \\Delta T_{grunt}",
  mostki: "\\Phi = H_{TB} \\Delta T",
  szczelnosc: "\\Phi = n V \\rho c_p \\Delta T / 3600",
  wentylacja: "\\Phi = \\dot V \\rho c_p (1 - \\eta) \\Delta T / 3600",
  wysokosc: "\\Phi = (n A h \\rho c_p / 3600 + U_{ścian} O h) \\Delta T",
  rury: "E = \\Psi L (\\theta_w - \\theta_o) t",
  "zyski-sloneczne": "Q = A g H (1 - z)",
  "zyski-bytowe": "\\bar P = Q_{doba} / 24",
  "temp-zasilania": "E = Q / COP",
  "temp-zrodla": "E = Q / COP",
  "temp-powrotu": "E = Q / COP",
  defrost: "E = E_{doba} \\cdot d",
  "ograniczenie-mocy": "P' = P \\cdot k,\\; t'/t = P / P',\\; P_{el} = P / COP",
  przeplyw: "\\dot V = P / (c_w \\Delta T)",
  odwierty: "L = n h,\\; K = L c,\\; P = L q",
  "bufor-starty": "C = V c_w,\\; t = C\\Delta T_h/(P - L) + C\\Delta T_h/L,\\; n = 24/t",
}

const w = (klucz: string, params: Record<string, number>): Wiersz => ({ klucz, params })

type Obliczenie = { glowny: Wiersz; wiersze: Wiersz[]; warnings: Warning[]; assumptions: Assumption[] }

/**
 * „Moc” factors (Sekcja B: wymagana moc pompy): loss before/after at the design temperature difference, then the
 * optional pump check against the design demand from Screen 1/2 — the demand is taken to already contain the "before"
 * state. No oversizing threshold: the source does not give one, only the margin is shown.
 */
function wynikMocy(przedW: number, poW: number, v: (k: KluczPola) => number, wiersze: Wiersz[] = []): Obliczenie {
  const przed = przedW / W_NA_KW
  const po = poW / W_NA_KW
  const zmiana = po - przed
  const warnings: Warning[] = []
  const zap = v("zapotrzebowanieKw")
  const moc = v("mocPompyKw")
  if (zap > 0) {
    const nowe = zap + zmiana
    wiersze.push(w("WPC-W-ZAPOTRZEBOWANIE-PO", { kw: nowe, pct: (zmiana / zap) * 100 }))
    if (moc > 0) {
      wiersze.push(w("WPC-W-ZAPAS-POMPY", { moc, zapas: moc - nowe }))
      if (nowe > moc) warnings.push(pompaZaMala(nowe, moc))
    }
  }
  return { glowny: w("WPC-G-MOC", { przed, po, zmiana }), wiersze, warnings, assumptions: [{ kod: "WPC-ZAL-STAN-USTALONY" }] }
}

/** COP change (5.69, 5.93, 5.95): electricity for the same heat, E = Q / COP. */
function wynikCop(v: (k: KluczPola) => number): Obliczenie {
  const copPrzed = v("copPrzed")
  const copPo = v("copPo")
  const q = v("cieploSezonKwh")
  const dT = v("tPrzedC") - v("tPoC")
  const wiersze: Wiersz[] = []
  const assumptions: Assumption[] = []
  if (copPo > 0) {
    const zmianaPct = (copPo / copPrzed - 1) * 100
    if (dT !== 0) wiersze.push(w("WPC-W-COP-ZMIANA", { pct: zmianaPct, naStopien: zmianaPct / Math.abs(dT) }))
    if (q > 0) {
      const przed = q / copPrzed
      const po = q / copPo
      return { glowny: w("WPC-G-PRAD-SEZON", { przed, po, oszczednosc: przed - po }), wiersze, warnings: [], assumptions }
    }
    return { glowny: w("WPC-G-COP", { przed: copPrzed, po: copPo, pct: zmianaPct }), wiersze, warnings: [], assumptions }
  }
  // Only reachable for temp-zasilania (copPo is required elsewhere): the source's 2–3 %/°C rule as a range.
  const min = copPrzed * (1 + COP_NA_STOPIEN_ZASILANIA.min * dT)
  const max = copPrzed * (1 + COP_NA_STOPIEN_ZASILANIA.max * dT)
  assumptions.push({ kod: "WPC-ZAL-COP-REGULA", params: { min: COP_NA_STOPIEN_ZASILANIA.min * 100, max: COP_NA_STOPIEN_ZASILANIA.max * 100 } })
  if (q > 0 && min > 0 && max > 0) {
    wiersze.push(w("WPC-W-OSZCZEDNOSC-WIDELKI", { min: q / copPrzed - q / min, max: q / copPrzed - q / max }))
  }
  return { glowny: w("WPC-G-COP-WIDELKI", { przed: copPrzed, min, max }), wiersze, warnings: [], assumptions }
}

function oblicz(czynnik: Czynnik, v: (k: KluczPola) => number): Obliczenie {
  switch (czynnik) {
    case "okna": {
      const a = v("powierzchniaM2")
      return wynikMocy(v("uPrzed") * a * v("dTK"), v("uPo") * a * v("dTK"), v)
    }
    case "dach":
    case "podloga": {
      const a = v("powierzchniaM2")
      const dT = czynnik === "dach" ? v("dTK") : v("dTGruntK")
      const uPo = uPoDociepleniu(v("uPrzed"), v("gruboscCm"), v("lambda"))
      return wynikMocy(v("uPrzed") * a * dT, uPo * a * dT, v, [w("WPC-W-U-PO", { u: uPo })])
    }
    case "mostki":
      return wynikMocy(v("hMostkowPrzedWK") * v("dTK"), v("hMostkowPoWK") * v("dTK"), v)
    case "szczelnosc": {
      const h = (n: number) => wspolczynnikStratWentylacyjnychWK(n, v("kubaturaM3"))
      return wynikMocy(h(v("nPrzed")) * v("dTK"), h(v("nPo")) * v("dTK"), v)
    }
    case "wentylacja": {
      const strata = (etaPct: number) => obliczStrumienCieplaPowietrzaW(v("strumienM3H"), v("dTK"), 100 - etaPct)
      const wiersze = v("wentylatoryKwhDoba") > 0 ? [w("WPC-W-WENTYLATORY", { kwh: v("wentylatoryKwhDoba") })] : []
      return wynikMocy(strata(v("etaPrzedPct")), strata(v("etaPoPct")), v, wiersze)
    }
    case "wysokosc": {
      const a = v("powierzchniaPodlogiM2")
      const h = (wys: number) => wspolczynnikStratWentylacyjnychWK(v("nPrzed"), a * wys) + v("uScian") * v("obwodM") * wys
      const wynik = wynikMocy(h(v("hPrzedM")) * v("dTK"), h(v("hPoM")) * v("dTK"), v, [
        w("WPC-W-KUBATURA", { przed: a * v("hPrzedM"), po: a * v("hPoM"), pct: (v("hPoM") / v("hPrzedM") - 1) * 100 }),
      ])
      wynik.assumptions.push({ kod: "WPC-ZAL-WYSOKOSC" })
      return wynik
    }
    case "rury": {
      const dt = Math.max(0, v("tWodyC") - v("tOtoczeniaC"))
      const e = (psi: number) => (psi * v("dlugoscRurM") * dt * v("godzinyH")) / W_NA_KW
      const przed = e(v("psiPrzed"))
      const po = e(v("psiPo"))
      return { glowny: w("WPC-G-RURY", { przed, po, zmiana: po - przed }), wiersze: [], warnings: [], assumptions: [] }
    }
    case "zyski-sloneczne": {
      const q = (zPct: number) => v("powierzchniaOkienM2") * v("g") * v("napromieniowanieKwhM2") * (1 - zPct / 100)
      const przed = q(v("zacienieniePrzedPct"))
      const po = q(v("zacieniePoPct"))
      const wiersze: Wiersz[] = []
      if (po !== przed) wiersze.push(w("WPC-W-ZYSK-ZMIANA", { przed, zmiana: po - przed }))
      if (v("godzinySezonuH") > 0) wiersze.push(w("WPC-W-SREDNIA-MOC", { kw: po / v("godzinySezonuH") }))
      return {
        glowny: w("WPC-G-ZYSK-SEZON", { kwh: po }),
        wiersze,
        warnings: [],
        assumptions: [{ kod: "WPC-ZAL-ZYSKI-SLONECZNE" }, { kod: "WPC-ZAL-ZYSKI-A-MOC" }],
      }
    }
    case "zyski-bytowe": {
      const wiersze = v("dniSezonu") > 0 ? [w("WPC-W-ZYSK-SEZON-BYTOWY", { dni: v("dniSezonu"), kwh: v("zyskiKwhDoba") * v("dniSezonu") })] : []
      return {
        glowny: w("WPC-G-ZYSK-BYTOWY", { kw: v("zyskiKwhDoba") / 24 }),
        wiersze,
        warnings: [],
        assumptions: [{ kod: "WPC-ZAL-ZYSKI-A-MOC" }],
      }
    }
    case "temp-zasilania":
    case "temp-zrodla":
    case "temp-powrotu":
      return wynikCop(v)
    case "defrost": {
      const kwh = v("defrostKwhDoba") * v("dniSzronienia")
      const zuz = v("zuzyciePompySezonKwh")
      const wiersze = zuz > 0 ? [w("WPC-W-DEFROST-UDZIAL", { pct: (kwh / zuz) * 100 })] : []
      return { glowny: w("WPC-G-DEFROST", { kwh }), wiersze, warnings: [], assumptions: [] }
    }
    case "ograniczenie-mocy": {
      const moc = v("mocPompyKw")
      const mocOgr = (moc * v("ograniczeniePct")) / 100
      const razy = moc / mocOgr
      const wiersze: Wiersz[] = []
      const warnings: Warning[] = []
      const zap = v("zapotrzebowanieKw")
      if (zap > mocOgr) warnings.push(ograniczenieDeficyt(mocOgr, zap, zap - mocOgr))
      const copPrzed = v("copPrzed")
      const copOgr = v("copOgraniczony")
      const falownik = v("mocFalownikaKw")
      if (copPrzed > 0) {
        const pobor = moc / copPrzed
        wiersze.push(w("WPC-W-POBOR-PRZED", { kw: pobor }))
        if (falownik > 0 && pobor > falownik) warnings.push(falownikPrzeciazony(pobor, moc, falownik))
      }
      if (copOgr > 0) {
        const pobor = mocOgr / copOgr
        wiersze.push(w("WPC-W-POBOR-PO", { kw: pobor }))
        if (falownik > 0 && pobor > falownik) warnings.push(falownikPrzeciazony(pobor, mocOgr, falownik))
      }
      if (copPrzed > 0 && copOgr > 0) wiersze.push(w("WPC-W-ENERGIA-ZMIANA", { pct: (copPrzed / copOgr - 1) * 100 }))
      return {
        glowny: w("WPC-G-OGRANICZENIE", { kw: mocOgr, razy, pct: (razy - 1) * 100 }),
        wiersze,
        warnings,
        assumptions: [{ kod: "WPC-ZAL-START-STOP" }],
      }
    }
    case "przeplyw": {
      const lH = przeplywWodyLH(v("mocPompyKw"), v("dTObieguK"))
      return { glowny: w("WPC-G-PRZEPLYW", { m3h: lH / L_NA_M3, lmin: lH / MIN_NA_H }), wiersze: [], warnings: [], assumptions: [] }
    }
    case "odwierty": {
      const warnings: Warning[] = []
      const pompa = v("mocPompyKw")
      const wariant = (nazwa: "A" | "B", liczba: number, glebokosc: number) => {
        const dlugosc = liczba * glebokosc
        const koszt = dlugosc * v("cenaZlM")
        const moc = (dlugosc * v("wNaM")) / W_NA_KW
        if (pompa > 0 && moc < pompa) warnings.push(odwiertyZaMalo(nazwa, moc, pompa))
        return { koszt, wiersz: w(`WPC-W-WARIANT-${nazwa}`, { liczba, glebokosc, dlugosc, koszt, moc, zlNaKw: koszt / moc }) }
      }
      const a = wariant("A", v("liczbaA"), v("glebokoscAM"))
      const b = wariant("B", v("liczbaB"), v("glebokoscBM"))
      return {
        glowny: w("WPC-G-ODWIERTY", { roznica: b.koszt - a.koszt }),
        wiersze: [a.wiersz, b.wiersz],
        warnings,
        assumptions: [{ kod: "WPC-ZAL-ODWIERTY-LINIOWO" }],
      }
    }
    case "bufor-starty": {
      const p = v("mocPompyKw")
      const l = v("obciazenieKw")
      const assumptions: Assumption[] = [{ kod: "WPC-ZAL-START-STOP" }]
      if (l >= p) return { glowny: w("WPC-G-STARTY", { bez: 0, z: 0 }), wiersze: [], warnings: [buforPracaCiagla()], assumptions }
      const bez = cyklStartStop(v("wodaInstalacjiL"), v("histerezaK"), p, l)
      const z = cyklStartStop(v("wodaInstalacjiL") + v("buforL"), v("histerezaK"), p, l)
      return {
        glowny: w("WPC-G-STARTY", { bez: bez.startyDoba, z: z.startyDoba }),
        wiersze: [w("WPC-W-CYKL", { pracBez: bez.pracaMin, postojBez: bez.postojMin, pracZ: z.pracaMin, postojZ: z.postojMin })],
        warnings: [],
        assumptions,
      }
    }
  }
}

/**
 * Moduł 6, Część 2D — scalony silnik „wpływ czynnika X na dobór mocy/COP” (dawne 5.69, 5.73–5.100; Biblia §6.27.43,
 * §6.27.47–6.27.74). One engine, one formula per factor, every number from the user (Dyrektywa #1); physics reused
 * from Part 1 (Dyrektywa #8): U·A·ΔT (Screen 1), U' after insulation (Screen 10, `uPoDociepleniu`), H_V = n·V·ρ·cp
 * (Screen 12, `wspolczynnikStratWentylacyjnychWK`), air heat flow (Screen 3, `obliczStrumienCieplaPowietrzaW`),
 * water heat capacity (M2 `bojler-cwu`), Ψ·L·ΔT of the circulation pipe (Screen 17), W/m of a borehole (5.42).
 *
 * Source examples (Sekcja C) are illustrations without their inputs; where they contradict each other or the
 * formula (Dyrektywa #5):
 * - 5.69 „50 → 40 °C: COP 3,0 → 3,8, 500 kWh” — inside the source's own 2–3 %/°C range (3,6–3,9); 500 kWh needs
 *   Q ≈ 7125 kWh of heat per season.
 * - 5.81 „1500 kWh rocznie = 0,5 kW” implies 3000 h, 5.86 „300 kWh = 0,3 kW” implies 1000 h — the two examples use
 *   different hours, so the average power is only shown when the user enters the season hours.
 * - 5.82 „2,5 kWh/dobę → 0,3 kW” — 2,5 kWh / 24 h = 0,10 kW; 0,3 kW would need 7,2 kWh/dobę.
 * - 5.98 „60% mocy → praca dłuższa o 40%” — at the same heat a start/stop pump runs 1/0,6 = 1,67× longer (+67%);
 *   +40% fits 5.97 („tryb cichy +20%”) logic only with a different limit. Computed from the formula.
 * - 5.90 „100 m: 20 000 zł, 150 m: 30 000 zł, 20% więcej ciepła” — with the 5.42 W/m index 50% more length gives
 *   50% more power; the deeper-ground gain behind „20%” has no model in the source. 5.91 „2 × 80 m droższe niż
 *   1 × 120 m” compares 160 m with 120 m (different power) — the screen shows cost per kW next to the cost.
 * - 5.100 „20 → 4 starty, 5× dłuższa żywotność” — 5× fewer starts needs total water 5× larger (buffer = 4× the
 *   installation water); lifetime is not computed (no model of compressor wear in the source).
 */
export function calculateWplywCzynnika(input: WplywCzynnikaInput): CalcResult<WplywCzynnikaResult> {
  const { errors } = validateInput(input)
  const inputs = Object.fromEntries(Object.entries(input.pola).filter(([, x]) => x !== undefined)) as Record<string, number>
  const baza = {
    unit: "",
    formula: input.czynnik ? FORMULY[input.czynnik] : "",
    inputs,
    calculatorVersion: CALCULATOR_VERSION,
  }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.czynnik === null) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const czynnik = input.czynnik
  const brak = POLA_CZYNNIKA[czynnik].some((p) => {
    if (!p.wymagane) return false
    const x = input.pola[p.klucz]
    return p.rodzaj === "temperatura" ? x === undefined : !x
  })
  if (brak) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const v = (k: KluczPola) => input.pola[k] ?? 0
  const { glowny, wiersze, warnings, assumptions } = oblicz(czynnik, v)
  return {
    ...baza,
    value: { glowny, wiersze },
    status: warnings.some((x) => x.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
