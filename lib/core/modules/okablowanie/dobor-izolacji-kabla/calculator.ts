import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { DoborIzolacjiKablaInput } from "./input"
import { validateInput } from "./validation"
import { izolacjaPonizejTemperatury, izolacjaWystarczajaca } from "./warnings"
import { MAX_TEMPERATURA_C } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type DoborIzolacjiKablaResult = {
  maksTemperaturaIzolacjiC: number
}

function pusty(): DoborIzolacjiKablaResult {
  return { maksTemperaturaIzolacjiC: 0 }
}

/**
 * Ekran 28, Moduł 5 "Okablowanie i zabezpieczenia" — "Dobór izolacji kabla do warunków montażu"
 * (dawne 4.38, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md, Sekcja B). Twardy stop 1:1 ze
 * źródła: kabel PVC w miejscu o spodziewanej temperaturze >70°C (np. tuż pod panelami).
 * `miejsceTrasy` to informacyjna podpowiedź (ziemia→PVC typowo, blisko paneli→XLPE typowo) —
 * decyzję o rzeczywistej izolacji podejmuje user, sprawdzaną jest ona, nie sama podpowiedź.
 */
export function calculateDoborIzolacjiKabla(
  input: DoborIzolacjiKablaInput,
): CalcResult<DoborIzolacjiKablaResult> {
  const { errors } = validateInput(input)
  const inputs = { temperaturaMaksymalnaC: input.temperaturaMaksymalnaC }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "°C",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.izolacjaWybrana === null || input.temperaturaMaksymalnaC === 0) {
    return {
      value: pusty(),
      unit: "°C",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const maksTemperaturaIzolacjiC = MAX_TEMPERATURA_C[input.izolacjaWybrana]
  const wystarcza = input.temperaturaMaksymalnaC <= maksTemperaturaIzolacjiC

  const warnings: Warning[] = [
    wystarcza
      ? izolacjaWystarczajaca(input.izolacjaWybrana, maksTemperaturaIzolacjiC)
      : izolacjaPonizejTemperatury(input.izolacjaWybrana, input.temperaturaMaksymalnaC, maksTemperaturaIzolacjiC),
  ]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { maksTemperaturaIzolacjiC },
    unit: "°C",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
