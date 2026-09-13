import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { DoborMocyFalownikaInput } from "./input"
import { validateInput } from "./validation"
import { falownikWystarczajacy, falownikZaSlaby, rekomendacjaBezSprawdzenia } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type DoborMocyFalownikaResult = {
  mocFalownikaZalecanaW: number
  mocFalownikaZalecanaVa: number
}

const FORMULA = "P_{falownika} = P_{szczytowa} / w_{jednoczesnosci}"

function pusty(): DoborMocyFalownikaResult {
  return { mocFalownikaZalecanaW: 0, mocFalownikaZalecanaVa: 0 }
}

/**
 * Ekran 7, Moduł 5 "Okablowanie i zabezpieczenia" — "Dobór mocy falownika" (dawne 4.3,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Przykład źródła (4,2kW szczytowo →
 * falownik 6kW przy współczynniku 0,7) odtworzony dokładnie: 4200/0,7=6000. Współczynnik
 * jednoczesności działa tu jako odwrotny margines bezpieczeństwa na rozruchy silników (falownik
 * dobrany tak, by szczyt stanowił max 70% jego mocy ciągłej), nie jako redukcja sumy odbiorników.
 * Prądy rozruchowe (>2 razy wspomniane w źródle jako "5-7× normalnego poboru") świadomie NIE
 * liczone liczbowo — źródło nie podaje wzoru wiążącego typ silnika z konkretnym mnożnikiem.
 */
export function calculateDoborMocyFalownika(
  input: DoborMocyFalownikaInput,
): CalcResult<DoborMocyFalownikaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    mocSzczytowaW: input.mocSzczytowaW,
    mocPozornaVa: input.mocPozornaVa,
    wspolczynnikJednoczesnosci: input.wspolczynnikJednoczesnosci,
    mocFalownikaWybranaW: input.mocFalownikaWybranaW,
  }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "W",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.mocSzczytowaW === 0 || input.wspolczynnikJednoczesnosci === 0) {
    return {
      value: pusty(),
      unit: "W",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const mocFalownikaZalecanaW = input.mocSzczytowaW / input.wspolczynnikJednoczesnosci
  const mocFalownikaZalecanaVa =
    input.mocPozornaVa > 0 ? input.mocPozornaVa / input.wspolczynnikJednoczesnosci : 0

  const warnings: Warning[] =
    input.mocFalownikaWybranaW > 0
      ? [
          input.mocFalownikaWybranaW < mocFalownikaZalecanaW
            ? falownikZaSlaby(input.mocFalownikaWybranaW, mocFalownikaZalecanaW)
            : falownikWystarczajacy(input.mocFalownikaWybranaW, mocFalownikaZalecanaW),
        ]
      : [rekomendacjaBezSprawdzenia(mocFalownikaZalecanaW)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { mocFalownikaZalecanaW, mocFalownikaZalecanaVa },
    unit: "W",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Współczynnik jednoczesności działa tu jako odwrotny margines na rozruchy (P_falownika = P_szczytowa / w), nie jako redukcja sumy odbiorników.",
      "Prądy rozruchowe silników NIE liczone liczbowo — źródło nie podaje wzoru/mnożnika, tylko przykład ilustracyjny.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
