// 🔎 TD21 (dlug-techniczny.md): 443.4 exception wording, Table 443.2 unused, length cap cut from the heaviest weight.
import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { CRL_PROG, F_ENV_BAZOWE, LP_DLUGOSC_MAX_KM, NG_NA_DZIEN_BURZOWY, WAGI_LP, WSPOLCZYNNIK_F } from "./constants"
import type { OcenaRyzykaCrlInput } from "./input"
import { validateInput } from "./validation"
import { brakLinii, przepieciaLaczeniowe, skutkiKrytyczne, spdWymagany, stronaDcPoza } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

type Dlugosci = { napowietrznaNnKm: number; kablowaNnKm: number; napowietrznaSnKm: number; kablowaSnKm: number }
/** Order of filling the length limit — heaviest weight first (conservative: the largest L_P). */
const KOLEJNOSC: (keyof Dlugosci)[] = ["napowietrznaNnKm", "kablowaNnKm", "napowietrznaSnKm", "kablowaSnKm"]
const WAGA: Record<keyof Dlugosci, number> = {
  napowietrznaNnKm: WAGI_LP.napowietrznaNn,
  kablowaNnKm: WAGI_LP.kablowaNn,
  napowietrznaSnKm: WAGI_LP.napowietrznaSn,
  kablowaSnKm: WAGI_LP.kablowaSn,
}

export type OcenaRyzykaCrlResult = {
  /** Protection against transient overvoltages of atmospheric origin required (443.4/443.5). */
  spdWymagany: boolean
  powod: "skutki-krytyczne" | "crl" | "brak-linii"
  /** CRL; `null` without supply lines (→ ∞) or, for 443.4 cases, without the data. */
  crl: number | null
  /** L_P [km] after the 443.5 length rules. */
  lpKm: number
  /** f_env from Tablica 443.1; `null` when not needed and not chosen. */
  fEnv: number | null
  /** N_g used [1/(km²·rok)]; `null` when not needed. */
  ngUzyte: number | null
  /** Lengths used after the 443.5 rules (unknown part → L_PAL, limit 1 km / first SPD). */
  dlugosciUzyte: Dlugosci
}

const FORMULA =
  "L_P = 2L_{PAL} + L_{PCL} + 0{,}4L_{PAH} + 0{,}2L_{PCH},\\quad CRL = \\frac{f_{env}}{L_P N_g},\\quad " +
  "f_{env} = 85F \\text{ (wieś) } | 850F \\text{ (miasto)},\\quad CRL < 1000 \\Rightarrow SPD"

/**
 * Moduł 5, Ekran 2 — "Czy SPD jest wymagany" per HD 60364-4-443:2016 443.4/443.5 (Załącznik A examples 1–4 as tests).
 * Length rules of 443.5: the total counted is limited to 1 km or to the first SPD in the network, whichever is smaller;
 * unknown lengths → L_PAL takes the rest. The norm does not say which lengths to cut when the total is longer — here the
 * heaviest weights are kept first (the largest L_P, conservative; ✅🤖 27.09.2026, assumption CRL-ZALOZENIE-OBCIECIE).
 */
export function calculateOcenaRyzykaCrl(input: OcenaRyzykaCrlInput): CalcResult<OcenaRyzykaCrlResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  const wynik = (
    status: CalcResult<OcenaRyzykaCrlResult | null>["status"],
    value: OcenaRyzykaCrlResult | null,
    warnings: Warning[] = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<OcenaRyzykaCrlResult | null> => ({
    value,
    unit: "—",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })
  if (errors.length > 0) return wynik("INVALID_INPUT", null)

  const assumptions: Assumption[] = [{ kod: "CRL-ZALOZENIE-F", params: { f: WSPOLCZYNNIK_F } }]
  const limitKm = Math.min(LP_DLUGOSC_MAX_KM, input.odlegloscDoSpdWSieciKm ?? LP_DLUGOSC_MAX_KM)
  const podane: Dlugosci = {
    napowietrznaNnKm: input.napowietrznaNnKm,
    kablowaNnKm: input.kablowaNnKm,
    napowietrznaSnKm: input.napowietrznaSnKm,
    kablowaSnKm: input.kablowaSnKm,
  }
  const sumaPodanych = KOLEJNOSC.reduce((s, k) => s + podane[k], 0)
  if (input.dlugosciNiepelne && sumaPodanych < limitKm) {
    podane.napowietrznaNnKm += limitKm - sumaPodanych
    assumptions.push({ kod: "CRL-ZALOZENIE-NIEZNANE-DLUGOSCI", params: { reszta: limitKm - sumaPodanych } })
  }
  let zostalo = limitKm
  const dlugosciUzyte = { ...podane }
  for (const k of KOLEJNOSC) {
    dlugosciUzyte[k] = Math.min(podane[k], zostalo)
    zostalo -= dlugosciUzyte[k]
  }
  if (KOLEJNOSC.some((k) => dlugosciUzyte[k] < podane[k])) assumptions.push({ kod: "CRL-ZALOZENIE-OBCIECIE", params: { limit: limitKm } })
  const lpKm = KOLEJNOSC.reduce((s, k) => s + WAGA[k] * dlugosciUzyte[k], 0)

  const fEnv = input.srodowisko === null ? null : F_ENV_BAZOWE[input.srodowisko] * WSPOLCZYNNIK_F
  const ngUzyte = input.gestoscWyladowanNg ?? (input.dniBurzoweTd === null ? null : NG_NA_DZIEN_BURZOWY * input.dniBurzoweTd)
  if (input.gestoscWyladowanNg === null && ngUzyte !== null) assumptions.push({ kod: "CRL-ZALOZENIE-NG-Z-TD" })
  const crl = lpKm > 0 && fEnv !== null && ngUzyte !== null ? fEnv / (lpKm * ngUzyte) : null

  const staleInfo = [stronaDcPoza(), przepieciaLaczeniowe()]
  if (input.skutkiKrytyczne) {
    const value = { spdWymagany: true, powod: "skutki-krytyczne" as const, crl, lpKm, fEnv, ngUzyte, dlugosciUzyte }
    return wynik("VALID_WITH_WARNINGS", value, [skutkiKrytyczne(), ...staleInfo], assumptions)
  }
  if (lpKm === 0) {
    const value = { spdWymagany: false, powod: "brak-linii" as const, crl: null, lpKm, fEnv, ngUzyte, dlugosciUzyte }
    return wynik("VALID", value, [brakLinii(), ...staleInfo], assumptions)
  }
  if (crl === null) return wynik("INCOMPLETE", null, [])
  const wymagany = crl < CRL_PROG
  const warnings = wymagany ? [spdWymagany(crl), ...staleInfo] : staleInfo
  return wynik(wymagany ? "VALID_WITH_WARNINGS" : "VALID", { spdWymagany: wymagany, powod: "crl", crl, lpKm, fEnv, ngUzyte, dlugosciUzyte }, warnings, assumptions)
}
