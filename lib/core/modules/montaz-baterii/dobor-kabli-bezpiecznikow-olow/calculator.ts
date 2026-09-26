import type { CalcResult, Status } from "@/lib/core/calc-result"
import { isComputed } from "@/lib/core/calc-result"
import type { DoborKabliBezpiecznikowOlowInput } from "./input"
import { calculateDoborPrzekrojuKabla } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/calculator"
import { calculateDoborBezpiecznikaRozlacznika } from "@/lib/core/modules/okablowanie/dobor-bezpiecznika-rozlacznika/calculator"

export const CALCULATOR_VERSION = "1.0.0"

export type DoborKabliBezpiecznikowOlowResult = {
  przekrojMm2: number
  obciazalnoscEfektywnaA: number
  spadekNapieciaPct: number
  pradBezpiecznikaZalecanyA: number
  /** null = AIC lub prąd zwarciowy jeszcze nie podane, sprawdzenie nie wykonane. */
  aicWystarczajace: boolean | null
}

function pusty(): DoborKabliBezpiecznikowOlowResult {
  return {
    przekrojMm2: 0,
    obciazalnoscEfektywnaA: 0,
    spadekNapieciaPct: 0,
    pradBezpiecznikaZalecanyA: 0,
    aicWystarczajace: null,
  }
}

function najgorszyStatus(a: Status, b: Status): Status {
  if (a === "INVALID_INPUT" || b === "INVALID_INPUT") return "INVALID_INPUT"
  if (a === "OUT_OF_SCOPE" || b === "OUT_OF_SCOPE") return "OUT_OF_SCOPE"
  if (a === "INCOMPLETE" || b === "INCOMPLETE") return "INCOMPLETE"
  return "VALID"
}

/**
 * Ekran B5, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Dobór kabli,
 * bezpieczników i zabezpieczeń" (dawne 10.5,
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md). Źródło wprost: "ten sam silnik
 * obliczeniowy co w Module 5, tylko podstawiasz inne liczby" — wzorzec echo, nie nowa logika:
 * przekrój kabla przez `calculateDoborPrzekrojuKabla` (M5/Ekran 1), bezpiecznik+AIC przez
 * `calculateDoborBezpiecznikaRozlacznika` (M5/Ekran 6). Chemia baterii (kwasowa vs LiFePO4) nie
 * wchodzi do żadnego wzoru — tylko inne typowe wartości wejściowe (prądy, napięcia).
 */
export function calculateDoborKabliBezpiecznikowOlow(
  input: DoborKabliBezpiecznikowOlowInput,
): CalcResult<DoborKabliBezpiecznikowOlowResult> {
  const inputs = {
    pradA: input.pradA,
    napiecieV: input.napiecieV,
    dlugoscTrasyM: input.dlugoscTrasyM,
    temperaturaOtoczeniaC: input.temperaturaOtoczeniaC ?? 0,
    liczbaKabliWWiazce: input.liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct: input.dopuszczalnySpadekNapieciaPct,
    sprawdzanyPrzekrojMm2: input.sprawdzanyPrzekrojMm2 ?? 0,
    pradZwarciowyA: input.pradZwarciowyA,
    aicBezpiecznikaA: input.aicBezpiecznikaA,
  }

  const echoKabel = calculateDoborPrzekrojuKabla({
    pradA: input.pradA,
    napiecieV: input.napiecieV,
    dlugoscTrasyM: input.dlugoscTrasyM,
    material: input.material,
    sposobUlozenia: input.sposobUlozenia,
    temperaturaOtoczeniaC: input.temperaturaOtoczeniaC,
    liczbaKabliWWiazce: input.liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct: input.dopuszczalnySpadekNapieciaPct,
    sprawdzanyPrzekrojMm2: input.sprawdzanyPrzekrojMm2,
  })

  const echoBezpiecznik = calculateDoborBezpiecznikaRozlacznika({
    pradZnamionowyA: input.pradA,
    pradZwarciowyA: input.pradZwarciowyA,
    aicBezpiecznikaA: input.aicBezpiecznikaA,
  })

  const wspolnyStatus = najgorszyStatus(echoKabel.status, echoBezpiecznik.status)

  if (!isComputed(wspolnyStatus)) {
    return {
      value: pusty(),
      unit: "mm² / A",
      status: wspolnyStatus,
      formula: "",
      inputs,
      assumptions: [],
      warnings: [...echoKabel.warnings, ...echoBezpiecznik.warnings],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const warnings = [...echoKabel.warnings, ...echoBezpiecznik.warnings]
  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: {
      przekrojMm2: echoKabel.value.przekrojMm2,
      obciazalnoscEfektywnaA: echoKabel.value.obciazalnoscEfektywnaA,
      spadekNapieciaPct: echoKabel.value.spadekNapieciaPct,
      pradBezpiecznikaZalecanyA: echoBezpiecznik.value.pradBezpiecznikaZalecanyA,
      aicWystarczajace: echoBezpiecznik.value.aicWystarczajace,
    },
    unit: "mm² / A",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs,
    assumptions: [
      { kod: "KABLE-OLOW-ZALOZENIE-ECHO-M5" },
      ...echoKabel.assumptions,
      ...echoBezpiecznik.assumptions,
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
