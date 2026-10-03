import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { DEKLINACJA_AMPLITUDA_DEG } from "@/lib/core/modules/zapotrzebowanie/profil-astronomiczny/constants"
import type { OslonyPrzeciwsloneczneInput } from "./input"
import { validateInput } from "./validation"
import { okapZacieniaZima, szerokoscPozaModelem, tylkoGeometria } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "h = 90° - \\varphi \\pm \\delta, \\quad cień = P \\tan h, \\quad zacienienie = \\dfrac{\\min(\\max(P \\tan h - G, 0), H)}{H}"

export type OslonyPrzeciwsloneczneResult = {
  /** Wysokość słońca w południe przesilenia letniego [°]. */
  wysokoscLatoDeg: number
  /** Wysokość słońca w południe przesilenia zimowego [°]. */
  wysokoscZimaDeg: number
  /** Zacieniona część okna w południe przesilenia letniego [%]. */
  zacienienieLatoPct: number
  /** Zacieniona część okna w południe przesilenia zimowego [%]. */
  zacienienieZimaPct: number
  /** Wysięg, przy którym okno jest całe w cieniu w letnie południe [m]. */
  wysiegPelnyCienLatoM: number
  /** Największy wysięg, przy którym okno jest całe w słońcu w zimowe południe [m]. */
  wysiegMaxBezCieniaZimaM: number
}

const PUSTY: OslonyPrzeciwsloneczneResult = {
  wysokoscLatoDeg: 0,
  wysokoscZimaDeg: 0,
  zacienienieLatoPct: 0,
  zacienienieZimaPct: 0,
  wysiegPelnyCienLatoM: 0,
  wysiegMaxBezCieniaZimaM: 0,
}

const RAD = Math.PI / 180
const r1 = (x: number) => Math.round(x * 10) / 10

/** Model range: noon sun south of the zenith all year (φ > δmax) and above the horizon in winter (φ < 90° − δmax). */
const MIN_SZEROKOSC = DEKLINACJA_AMPLITUDA_DEG
const MAX_SZEROKOSC = 90 - DEKLINACJA_AMPLITUDA_DEG

function zacienienie(wysiegM: number, odstepM: number, wysokoscOknaM: number, wysokoscSloncaDeg: number): number {
  const cien = wysiegM * Math.tan(wysokoscSloncaDeg * RAD)
  return (Math.min(Math.max(cien - odstepM, 0), wysokoscOknaM) / wysokoscOknaM) * 100
}

/**
 * Ekran 19, Moduł 6 — "Ochrona przed przegrzaniem latem" (dawne 5.25, Biblia §6.25). Zbudowana część
 * geometryczna, którą źródło opisuje jako zasadę: „latem słońce wysoko, zimą nisko — stała osłona pozioma
 * blokuje wysokie letnie słońce, przepuszcza niskie zimowe”. Wysokość słońca w południe słoneczne
 * h = 90° − φ ± δ (δ = 23,45° — amplituda deklinacji, ta sama stała co `profil-astronomiczny`, Cooper 1969);
 * dla okna południowego w południe kąt profilu = h, cień okapu o wysięgu P sięga P·tan h poniżej okapu
 * (okap nieskończenie szeroki). 🟡 ze źródła „stały okap odbiera zimą darmowe zyski” — gdy okap zacienia
 * okno w zimowe południe (próg = jakikolwiek cień; ✅🤖 poziom). Okna wschodnie/zachodnie — okap poziomy
 * nie działa (słońce nisko rano/wieczorem), info.
 *
 * NIE liczone (Dyrektywa #1): zyski słoneczne w kWh/dobę — wymagają napromieniowania fasady per
 * orientacja, współczynnika g szyby i współczynnika osłony (Fc, PN-EN ISO 52016 / 13790 — brak w repo);
 * to ten sam model co Ekran 11 (okna), odłożony decyzją właściciela 26.09.2026. Przykład źródła „8 → 2 kWh/
 * dobę z żaluzjami” jest więc nieodtwarzalny. Geometria tylko dla południa słonecznego — rano/po południu
 * kąt profilu jest większy (okno południowe jest wtedy bardziej zacienione).
 */
export function calculateOslonyPrzeciwsloneczne(input: OslonyPrzeciwsloneczneInput): CalcResult<OslonyPrzeciwsloneczneResult> {
  const { errors } = validateInput(input)
  const inputs = {
    szerokoscDeg: input.szerokoscDeg ?? Number.NaN,
    wysiegM: input.wysiegM,
    odstepM: input.odstepM,
    wysokoscOknaM: input.wysokoscOknaM,
  }
  const baza = { unit: "%", formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-OSLONY-PRZECIWSLONECZNE", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.szerokoscDeg === null || input.wysiegM === 0 || input.wysokoscOknaM === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }
  if (input.szerokoscDeg <= MIN_SZEROKOSC || input.szerokoscDeg >= MAX_SZEROKOSC) {
    return {
      ...baza,
      value: PUSTY,
      status: "OUT_OF_SCOPE",
      assumptions: [],
      warnings: [szerokoscPozaModelem(input.szerokoscDeg, MIN_SZEROKOSC, r1(MAX_SZEROKOSC))],
    }
  }

  const wysokoscLatoDeg = 90 - input.szerokoscDeg + DEKLINACJA_AMPLITUDA_DEG
  const wysokoscZimaDeg = 90 - input.szerokoscDeg - DEKLINACJA_AMPLITUDA_DEG
  const zacienienieLatoPct = zacienienie(input.wysiegM, input.odstepM, input.wysokoscOknaM, wysokoscLatoDeg)
  const zacienienieZimaPct = zacienienie(input.wysiegM, input.odstepM, input.wysokoscOknaM, wysokoscZimaDeg)
  const wysiegPelnyCienLatoM = (input.odstepM + input.wysokoscOknaM) / Math.tan(wysokoscLatoDeg * RAD)
  const wysiegMaxBezCieniaZimaM = input.odstepM / Math.tan(wysokoscZimaDeg * RAD)

  const warnings: Warning[] = []
  if (zacienienieZimaPct > 0) warnings.push(okapZacieniaZima(Math.round(zacienienieZimaPct)))
  warnings.push(tylkoGeometria())

  const assumptions: Assumption[] = [{ kod: "OSL-ZALOZENIE-POLUDNIE", params: { delta: DEKLINACJA_AMPLITUDA_DEG } }]
  return {
    ...baza,
    value: { wysokoscLatoDeg, wysokoscZimaDeg, zacienienieLatoPct, zacienienieZimaPct, wysiegPelnyCienLatoM, wysiegMaxBezCieniaZimaM },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
