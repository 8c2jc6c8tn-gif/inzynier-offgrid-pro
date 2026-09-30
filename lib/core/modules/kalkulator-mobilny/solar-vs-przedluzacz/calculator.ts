import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { SolarVsPrzedluzaczInput } from "./input"
import { validateInput } from "./validation"
import { nigdySieNieZwroci, spadekNapieciaKabla } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "K_{sieć} = E \\times c + O, \\quad zwrot = \\dfrac{Z - P}{K_{sieć} - K_{solar}}, \\quad TCO_{n} = inwestycja + n \\times koszt\\_roczny"

export type SolarVsPrzedluzaczResult = {
  /** Roczny koszt energii z przedłużacza [zł/rok] = zużycie × cena + opłaty stałe. */
  kosztRocznySieciZl: number
  /** Roczna oszczędność zestawu względem przedłużacza [zł/rok]. */
  oszczednoscRocznaZl: number
  /** Okres zwrotu dopłaty do zestawu [lat]; 0 = zestaw tańszy od razu; null = nigdy się nie zwróci. */
  zwrotLat: number | null
  /** Koszt całkowity w horyzoncie [zł]. */
  tcoPrzedluzaczZl: number
  tcoZestawZl: number
  /** Tańsza opcja w horyzoncie (remis → przedłużacz, bo bez dodatkowego sprzętu). */
  tanszy: "przedluzacz" | "zestaw"
}

const PUSTY_WYNIK: SolarVsPrzedluzaczResult = {
  kosztRocznySieciZl: 0,
  oszczednoscRocznaZl: 0,
  zwrotLat: null,
  tcoPrzedluzaczZl: 0,
  tcoZestawZl: 0,
  tanszy: "przedluzacz",
}

/**
 * Ekran 29, Moduł 12 — "Koszt małego zestawu solarnego vs przedłużacz" (dawne 8.56, Biblia §12.44).
 * TCO obu opcji w horyzoncie usera i okres zwrotu dopłaty do zestawu. Bez inflacji i dyskonta (jak
 * przykłady źródła). Uwaga: przykład Biblii (300 zł + 50 zł/rok vs 800 zł, „zwrot po 6 latach”) daje
 * z tych liczb 500 / 50 = 10 lat — ekran liczy wzorem, nie przepisuje przykładu (docs/memory.md).
 */
export function calculateSolarVsPrzedluzacz(input: SolarVsPrzedluzaczInput): CalcResult<SolarVsPrzedluzaczResult> {
  const { errors } = validateInput(input)
  const inputs = { ...input }
  const baza = { unit: "zł", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  if (
    input.kosztPrzedluzaczaZl === 0 ||
    input.zuzycieKwhRok === 0 ||
    input.cenaEnergiiZlKwh === 0 ||
    input.kosztZestawuZl === 0 ||
    input.horyzontLat === 0
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const kosztRocznySieciZl = input.zuzycieKwhRok * input.cenaEnergiiZlKwh + input.oplatyStaleZlRok
  const oszczednoscRocznaZl = kosztRocznySieciZl - input.eksploatacjaZestawuZlRok
  const doplata = input.kosztZestawuZl - input.kosztPrzedluzaczaZl
  const zwrotLat = doplata <= 0 ? 0 : oszczednoscRocznaZl > 0 ? doplata / oszczednoscRocznaZl : null
  const tcoPrzedluzaczZl = input.kosztPrzedluzaczaZl + input.horyzontLat * kosztRocznySieciZl
  const tcoZestawZl = input.kosztZestawuZl + input.horyzontLat * input.eksploatacjaZestawuZlRok

  const warnings: Warning[] = [spadekNapieciaKabla()]
  if (zwrotLat === null) warnings.unshift(nigdySieNieZwroci())
  const assumptions: Assumption[] = [{ kod: "SP-ZALOZENIE-BEZ-INFLACJI" }, { kod: "SP-ZALOZENIE-ZESTAW-POKRYWA-ZUZYCIE" }]
  return {
    ...baza,
    value: {
      kosztRocznySieciZl,
      oszczednoscRocznaZl,
      zwrotLat,
      tcoPrzedluzaczZl,
      tcoZestawZl,
      tanszy: tcoZestawZl < tcoPrzedluzaczZl ? "zestaw" : "przedluzacz",
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
