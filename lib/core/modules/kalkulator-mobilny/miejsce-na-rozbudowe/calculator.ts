import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { MiejsceNaRozbudoweInput } from "./input"
import { validateInput } from "./validation"
import { brakOdstepow, elementWiekszyNizMiejsce, elementZaWysoki, pietrowanieBezWysokosci, planPonadMiejsce } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "n = \\left\\lfloor \\dfrac{S - 2m + g}{e + g} \\right\\rfloor,\\quad N = n_{dl} \\cdot n_{szer} \\cdot n_{warstw}"
const EPS = 1e-9

export type Uklad = "wzdluz" | "wszerz"

export type MiejsceNaRozbudoweResult = {
  /** How many elements fit in total (all layers). */
  maksSztuk: number
  /** Orientation of the element's length against the length of the space. */
  uklad: Uklad
  /** Elements along the length and along the width of the space, and the layers. */
  kolumny: number
  rzedy: number
  warstwy: number
  naWarstwe: number
  /** Share of the space's floor area covered by one layer of elements [%]. */
  wykorzystanieMiejscaPct: number
  /** `null` without a planned number; otherwise whether the plan fits and how many pieces are missing. */
  zmiesciSiePlan: boolean | null
  brakujeSztuk: number | null
}

const PUSTY: MiejsceNaRozbudoweResult = {
  maksSztuk: 0,
  uklad: "wzdluz",
  kolumny: 0,
  rzedy: 0,
  warstwy: 0,
  naWarstwe: 0,
  wykorzystanieMiejscaPct: 0,
  zmiesciSiePlan: null,
  brakujeSztuk: null,
}

/** Elements along one axis of length `S` with `m` margin on both sides and `g` between neighbours. */
function ileNaOsi(S: number, e: number, g: number, m: number): number {
  const wolne = S - 2 * m
  return wolne + EPS >= e ? Math.floor((wolne + g) / (e + g) + EPS) : 0
}

/**
 * Free space for an expansion (module 12, screen 31): how many identical boxes (panels or batteries) fit in a free box, in a
 * rectangular grid parallel to the walls, the element turned by 90° in the horizontal plane when that fits more. Geometry only — the
 * clearances are the user's own numbers; nothing here knows about ventilation, service access, weight or cable lengths.
 */
export function calculateMiejsceNaRozbudowe(input: MiejsceNaRozbudoweInput): CalcResult<MiejsceNaRozbudoweResult> {
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number" && Number.isFinite(v)) inputs[k] = v
  const wynik = (status: CalcResult<MiejsceNaRozbudoweResult>["status"], value: MiejsceNaRozbudoweResult, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<MiejsceNaRozbudoweResult> => ({
    value,
    unit: "szt.",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const errors = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)
  const { miejsceDlugoscMm: L, miejsceSzerokoscMm: W, elementDlugoscMm: a, elementSzerokoscMm: b } = input
  if (L === null || W === null || a === null || b === null) return wynik("INCOMPLETE", PUSTY, [])

  const g = input.odstepMiedzyMm ?? 0
  const m = input.marginesPrzyScianieMm ?? 0
  const warnings: Warning[] = []
  const wzdluz = ileNaOsi(L, a, g, m) * ileNaOsi(W, b, g, m)
  const wszerz = ileNaOsi(L, b, g, m) * ileNaOsi(W, a, g, m)
  const uklad: Uklad = wszerz > wzdluz ? "wszerz" : "wzdluz"
  const naWarstwe = Math.max(wzdluz, wszerz)
  const kolumny = uklad === "wzdluz" ? ileNaOsi(L, a, g, m) : ileNaOsi(L, b, g, m)
  const rzedy = uklad === "wzdluz" ? ileNaOsi(W, b, g, m) : ileNaOsi(W, a, g, m)

  const H = input.miejsceWysokoscMm
  const h = input.elementWysokoscMm
  const znaWysokosci = H !== null && h !== null
  const zaWysoki = znaWysokosci && h > H + EPS
  if (zaWysoki) warnings.push(elementZaWysoki(h, H))
  let warstwy = 1
  if (input.moznaPietrowac && znaWysokosci && !zaWysoki) warstwy = Math.max(1, Math.floor((H - 2 * m + g) / (h + g) + EPS))
  else if (input.moznaPietrowac && !znaWysokosci) warnings.push(pietrowanieBezWysokosci())

  const maksSztuk = zaWysoki ? 0 : naWarstwe * warstwy
  if (naWarstwe === 0) warnings.push(elementWiekszyNizMiejsce())
  const plan = input.planowanaLiczba
  if (plan !== null && plan > maksSztuk) warnings.push(planPonadMiejsce(plan, maksSztuk))
  if (input.odstepMiedzyMm === null || input.marginesPrzyScianieMm === null) warnings.push(brakOdstepow())

  const assumptions: Assumption[] = [{ kod: "MIEJROZ-ZAL-SIATKA" }, { kod: "MIEJROZ-ZAL-TYLKO-GEOMETRIA" }]
  if (input.odstepMiedzyMm === null || input.marginesPrzyScianieMm === null) assumptions.push({ kod: "MIEJROZ-ZAL-ODSTEPY-ZERO" })

  return wynik(
    warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    {
      maksSztuk,
      uklad,
      kolumny,
      rzedy,
      warstwy,
      naWarstwe,
      wykorzystanieMiejscaPct: (naWarstwe * a * b * 100) / (L * W),
      zmiesciSiePlan: plan === null ? null : plan <= maksSztuk,
      brakujeSztuk: plan === null ? null : Math.max(0, plan - maksSztuk),
    },
    warnings,
    assumptions,
  )
}
