import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { AnalizaZwarciowaInput } from "./input"
import { validateInput } from "./validation"
import { aicPonizejPraduZwarciowego, aicWystarczajace } from "./warnings"
import { obliczPradZwarciowyA } from "@/lib/core/modules/baterie/dobor-bezpiecznika-dc/calculator"

export const CALCULATOR_VERSION = "1.0.0"

export type AnalizaZwarciowaResult = {
  pradZwarciowyBateriaA: number
  pradZwarciowyPvA: number
  pradZwarciowyMaksymalnyA: number
  /** null = AIC jeszcze nie podane, sprawdzenie nie wykonane. */
  aicWystarczajace: boolean | null
}

const FORMULA = "I_{zw\\,bateria} = V / R_{wewn} \\;;\\; I_{zw\\,PV} = I_{SC} \\times N_s"

function pusty(): AnalizaZwarciowaResult {
  return {
    pradZwarciowyBateriaA: 0,
    pradZwarciowyPvA: 0,
    pradZwarciowyMaksymalnyA: 0,
    aicWystarczajace: null,
  }
}

/**
 * Ekran 12, Moduł 5 "Okablowanie i zabezpieczenia" — "Analiza zwarciowa" (dawne 4.11,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md, Sekcja B). Punkt odniesienia dla wielu
 * innych ekranów tego modułu (Ekran 6 dobór bezpieczników, Ekran 14 wyłączniki DC, Ekran 13
 * selektywność) — dziś ręczny wpis prądu zwarciowego w tamtych ekranach, docelowo stąd.
 *
 * Prąd zwarciowy baterii reużywa `obliczPradZwarciowyA` (V/R, wzorzec "echo" z M4/E24
 * `dobor-bezpiecznika-dc`, już re-używany przez M4/E9 `detekcja-zwarcia-efuse`) — ten sam
 * model prostego zwarcia pełnego, nie duplikowany. Prąd zwarciowy PV (`Isc × liczba stringów
 * równoległych`) to osobny, prostszy wzór 1:1 ze źródła — nie ma tu marginesu K1 z normy
 * HD 60364-7-712 (Załącznik B.2), bo źródło tego ekranu nie go nie wymaga (inny cel: orientacyjne
 * porównanie z AIC zabezpieczeń instalacji, nie formalny dobór bezpiecznika stringu PV).
 */
export function calculateAnalizaZwarciowa(input: AnalizaZwarciowaInput): CalcResult<AnalizaZwarciowaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    napiecieBateriiV: input.napiecieBateriiV,
    rezystancjaWewnetrznaBateriiOhm: input.rezystancjaWewnetrznaBateriiOhm,
    iscPanelaA: input.iscPanelaA,
    liczbaStringowRownoleglych: input.liczbaStringowRownoleglych,
    aicZabezpieczeniaA: input.aicZabezpieczeniaA,
  }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "A",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.napiecieBateriiV === 0 ||
    input.rezystancjaWewnetrznaBateriiOhm === 0 ||
    input.iscPanelaA === 0 ||
    input.liczbaStringowRownoleglych === 0

  if (niekompletne) {
    return {
      value: pusty(),
      unit: "A",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const pradZwarciowyBateriaA = obliczPradZwarciowyA(
    input.napiecieBateriiV,
    input.rezystancjaWewnetrznaBateriiOhm,
  )
  const pradZwarciowyPvA = input.iscPanelaA * input.liczbaStringowRownoleglych
  const pradZwarciowyMaksymalnyA = Math.max(pradZwarciowyBateriaA, pradZwarciowyPvA)

  const sprawdzanoAic = input.aicZabezpieczeniaA > 0
  const aicOk = sprawdzanoAic ? input.aicZabezpieczeniaA >= pradZwarciowyMaksymalnyA : null

  const warnings: Warning[] = []
  if (sprawdzanoAic) {
    warnings.push(
      aicOk
        ? aicWystarczajace(input.aicZabezpieczeniaA)
        : aicPonizejPraduZwarciowego(input.aicZabezpieczeniaA, pradZwarciowyMaksymalnyA),
    )
  }

  const assumptions: Assumption[] = [{ kod: "MODEL-ZWARCIA-PROSTEGO-NIZSZY" }]
  if (!sprawdzanoAic) {
    assumptions.push({ kod: "AIC-NIE-SPRAWDZONA-PORUWNAJ" })
  }

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { pradZwarciowyBateriaA, pradZwarciowyPvA, pradZwarciowyMaksymalnyA, aicWystarczajace: aicOk },
    unit: "A",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
