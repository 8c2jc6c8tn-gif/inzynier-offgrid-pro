import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { isComputed } from "@/lib/core/calc-result"
import { calculateDoborBezpiecznikaRozlacznika } from "@/lib/core/modules/okablowanie/dobor-bezpiecznika-rozlacznika/calculator"
import { calculateDoborPrzekrojuKabla } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/calculator"
import { PRZEKROJE_MM2 } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import type { DoborPrzekrojuKablaInput } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/input"
import type { KableBezpiecznikiMaleInput } from "./input"
import { brakPrzekrojuDlaKoordynacji, koordynacjaPodniosla, pojazdWibracje, przekrojPonizejMinimum } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "\\Delta U\\% = \\frac{I_B \\rho\\, 2L / S}{U} \\times 100 \;\; ; \;\; I_n = 1{,}25\\, I_B \;\; ; \;\; I_B \\le I_n \\le I_z"

export type KableBezpiecznikiMaleResult = {
  /** Przekrój dobrany (auto) albo sprawdzany przez użytkownika [mm²]. 0 = brak. */
  przekrojMm2: number
  /** Najmniejszy przekrój spełniający obciążalność, spadek napięcia i koordynację z bezpiecznikiem [mm²]. 0 = brak. */
  wymaganyMm2: number
  /** Obciążalność Iz przekroju `przekrojMm2` po korektach [A]. */
  obciazalnoscA: number
  /** Spadek napięcia dla `przekrojMm2` przy IB [%]. */
  spadekNapieciaPct: number
  /** Minimalny prąd znamionowy bezpiecznika In = 1,25 × IB [A] (M5/E6) — wybierz najbliższy wyższy dostępny. */
  bezpiecznikMinA: number
}

const PUSTY: KableBezpiecznikiMaleResult = {
  przekrojMm2: 0,
  wymaganyMm2: 0,
  obciazalnoscA: 0,
  spadekNapieciaPct: 0,
  bezpiecznikMinA: 0,
}

/**
 * Ekrany 2 i 15, Moduł 12 — echo Modułu 5: przekrój z `calculateDoborPrzekrojuKabla` (M5/E1: obciążalność
 * PN-HD 60364-5-52 + spadek napięcia ρ·2L/S), bezpiecznik 1,25 × IB z `calculateDoborBezpiecznikaRozlacznika`
 * (M5/E6; ta sama reguła w Biblii §12.10). Dołożona koordynacja PN-IEC 60364-4-43, 433.2: IB ≤ In ≤ Iz —
 * jeśli dobrany przekrój ma Iz < In, bierzemy najmniejszy większy, który ją spełnia (inaczej bezpiecznik nie
 * chroniłby kabla przed przeciążeniem). Drugi warunek 433.2 (I₂ ≤ 1,45·Iz) wymaga I₂ z karty bezpiecznika —
 * nie liczony (założenie).
 *
 * ✏️ Przykłady źródła („15 A, 3 m → 2,5 mm²”, „15 A, 4 m → 4 mm²”) odtwarzają się tylko wzorem jednostronnym
 * ρ·L/S przy 3% — ta sama rozbieżność co w M5/E1 (brak drogi powrotnej prądu), tu świadomie nie powielana:
 * przy ρ·2L/S i 3% oba przykłady wymagają 6 mm².
 */
export function calculateKableBezpiecznikiMale(input: KableBezpiecznikiMaleInput): CalcResult<KableBezpiecznikiMaleResult> {
  const bazaKabla: DoborPrzekrojuKablaInput = {
    pradA: input.pradA,
    napiecieV: input.napiecieV,
    dlugoscTrasyM: input.dlugoscTrasyM,
    material: "Cu",
    sposobUlozenia: input.sposobUlozenia,
    temperaturaOtoczeniaC: input.temperaturaOtoczeniaC,
    liczbaKabliWWiazce: input.liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct: input.dopuszczalnySpadekNapieciaPct,
    sprawdzanyPrzekrojMm2: null,
  }
  const inputs = {
    pradA: input.pradA,
    napiecieV: input.napiecieV,
    dlugoscTrasyM: input.dlugoscTrasyM,
    temperaturaOtoczeniaC: input.temperaturaOtoczeniaC ?? 0,
    liczbaKabliWWiazce: input.liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct: input.dopuszczalnySpadekNapieciaPct,
    sprawdzanyPrzekrojMm2: input.sprawdzanyPrzekrojMm2 ?? 0,
  }

  const auto = calculateDoborPrzekrojuKabla(bazaKabla)
  const bezpiecznik = calculateDoborBezpiecznikaRozlacznika({ pradZnamionowyA: input.pradA, pradZwarciowyA: 0, aicBezpiecznikaA: 0 })

  if (!isComputed(auto.status) || !isComputed(bezpiecznik.status)) {
    const status = auto.status === "INVALID_INPUT" || bezpiecznik.status === "INVALID_INPUT" ? "INVALID_INPUT" : isComputed(auto.status) ? bezpiecznik.status : auto.status
    return {
      value: PUSTY,
      unit: "mm²",
      status,
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: status === "INCOMPLETE" ? [] : [...auto.warnings, ...bezpiecznik.warnings],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const bezpiecznikMinA = bezpiecznik.value.pradBezpiecznikaZalecanyA
  const ocen = (przekrojMm2: number) => calculateDoborPrzekrojuKabla({ ...bazaKabla, sprawdzanyPrzekrojMm2: przekrojMm2 })

  // Smallest section meeting ampacity + voltage drop (engine) AND Iz ≥ In (433.2).
  const kandydaci = PRZEKROJE_MM2.Cu.filter((s) => s >= auto.value.przekrojMm2)
  const wymagany = kandydaci.find((s) => ocen(s).value.obciazalnoscEfektywnaA >= bezpiecznikMinA)

  const warnings: Warning[] = []
  const assumptions: Assumption[] = [
    { kod: "MK-ZALOZENIE-ECHO-M5" },
    { kod: "MK-ZALOZENIE-I2-NIELICZONE" },
    ...(input.pojazd ? [{ kod: "MK-ZALOZENIE-PRZEWODY-INSTALACYJNE" } satisfies Assumption] : []),
  ]
  if (input.pojazd) warnings.push(pojazdWibracje())

  if (wymagany === undefined) {
    return {
      value: { ...PUSTY, bezpiecznikMinA },
      unit: "mm²",
      status: "OUT_OF_SCOPE",
      formula: FORMULA,
      inputs,
      assumptions,
      warnings: [brakPrzekrojuDlaKoordynacji(bezpiecznikMinA), ...warnings],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.sprawdzanyPrzekrojMm2 === null) {
    const wynik = ocen(wymagany)
    // Engine margin verdict for the final section (info: safe margin, warning: close to the limit).
    warnings.unshift(...wynik.warnings)
    if (wymagany > auto.value.przekrojMm2) warnings.unshift(koordynacjaPodniosla(auto.value.przekrojMm2, wymagany))
    return {
      value: {
        przekrojMm2: wymagany,
        wymaganyMm2: wymagany,
        obciazalnoscA: wynik.value.obciazalnoscEfektywnaA,
        spadekNapieciaPct: wynik.value.spadekNapieciaPct,
        bezpiecznikMinA,
      },
      unit: "mm²",
      status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
      formula: FORMULA,
      inputs,
      assumptions,
      warnings,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  // „Sprawdź mój przekrój”: engine verdict (🔴 below ampacity/drop minimum) + coordination with the fuse.
  const sprawdzany = ocen(input.sprawdzanyPrzekrojMm2)
  const krytyczneSilnika = sprawdzany.warnings.filter((w) => w.level === "critical")
  if (krytyczneSilnika.length > 0) {
    warnings.unshift(...krytyczneSilnika)
  } else if (sprawdzany.value.obciazalnoscEfektywnaA < bezpiecznikMinA) {
    warnings.unshift(
      przekrojPonizejMinimum(input.sprawdzanyPrzekrojMm2, wymagany, bezpiecznikMinA, sprawdzany.value.obciazalnoscEfektywnaA),
    )
  }

  return {
    value: {
      przekrojMm2: input.sprawdzanyPrzekrojMm2,
      wymaganyMm2: wymagany,
      obciazalnoscA: sprawdzany.value.obciazalnoscEfektywnaA,
      spadekNapieciaPct: sprawdzany.value.spadekNapieciaPct,
      bezpiecznikMinA,
    },
    unit: "mm²",
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
