import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { MIN_TEMPERATURA_MATERIALU_C } from "./constants"
import type { MaterialMrozu, SztywnienieIzolacjiInput } from "./input"
import { aluminiumKurczenie, gumaBezProgu, pvcPonizejProgu, xlpePonizejProgu } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "T_{min,miejsca} \\ge T_{min,materialu}"

export type OcenaMaterialu = {
  material: MaterialMrozu
  /** Próg materiału [°C]; null = źródło nie podaje liczby. */
  progC: number | null
  /** Zapas T_min miejsca − próg [K]; null gdy brak progu. Ujemny = poniżej progu. */
  zapasK: number | null
}

export type SztywnienieIzolacjiResult = {
  oceny: OcenaMaterialu[]
}

const KOLEJNOSC: MaterialMrozu[] = ["PVC", "XLPE", "guma", "aluminium"]

/**
 * Ekran 13, Moduł 7 — "Test sztywnienia izolacji w niskich temperaturach" (dawne 6.17→7.17).
 * Porównanie minimalnej temperatury miejsca z progiem materiału ze źródła. Twardy stop 🔴 1:1 ze
 * źródła: PVC w miejscu o spodziewanej temperaturze poniżej jego progu (−10°C). XLPE poniżej −40°C
 * — tylko 🟡 (źródło podaje próg, ale nie wpisuje go jako twardego stopu). Guma i aluminium — bez
 * liczby w źródle, więc tylko informacja.
 */
export function calculateSztywnienieIzolacji(input: SztywnienieIzolacjiInput): CalcResult<SztywnienieIzolacjiResult> {
  const materialy = KOLEJNOSC.filter((m) => input.materialy.includes(m))
  const inputs = { temperaturaMinimalnaC: input.temperaturaMinimalnaC ?? 0, liczbaMaterialow: materialy.length }

  if (input.temperaturaMinimalnaC === null || materialy.length === 0) {
    return {
      value: { oceny: [] },
      unit: "°C",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const t = input.temperaturaMinimalnaC
  const warnings: Warning[] = []
  const oceny: OcenaMaterialu[] = materialy.map((material) => {
    const progC = MIN_TEMPERATURA_MATERIALU_C[material]
    const zapasK = progC === null ? null : t - progC
    if (zapasK !== null && zapasK < 0) {
      warnings.push(material === "PVC" ? pvcPonizejProgu(t, progC!) : xlpePonizejProgu(t, progC!))
    }
    if (material === "guma") warnings.push(gumaBezProgu())
    if (material === "aluminium") warnings.push(aluminiumKurczenie())
    return { material, progC, zapasK }
  })

  const assumptions: Assumption[] = [{ kod: "MROZ-ZALOZENIE-PROGI-OGOLNE" }]
  const podnosi = warnings.some((w) => w.level !== "info")

  return {
    value: { oceny },
    unit: "°C",
    status: podnosi ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
