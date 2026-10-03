import type { Warning } from "@/lib/core/calc-result"
import type { DeepWinterBudgetInput } from "./input"
import {
  biezacyDzienPozaZakresem,
  celPowtorzony,
  dniMiesiacaPozaZakresem,
  procentPozaZakresemDwb,
  udzialyPowyzej100,
  wartoscUjemnaDwb,
} from "./warnings"

export const DNI_MIESIACA_MIN = 28
export const DNI_MIESIACA_MAX = 31

export function validateInput(input: DeepWinterBudgetInput): { errors: Warning[] } {
  const errors: Warning[] = []
  const nieujemne: Record<string, number> = {
    planPvKwh: input.planPvKwh,
    planAgregatKwh: input.planAgregatKwh,
    planMagazynKwh: input.planMagazynKwh,
    zuzycieNarastajaceKwh: input.zuzycieNarastajaceKwh,
    roznicaTemperaturK: input.roznicaTemperaturK,
  }
  input.cele.forEach((c, i) => {
    nieujemne[`cele[${i}].zuzycieKwh`] = c.zuzycieKwh
  })
  for (const [pole, v] of Object.entries(nieujemne)) if (v < 0 || !Number.isFinite(v)) errors.push(wartoscUjemnaDwb(pole, v))

  const n = input.dniMiesiaca
  if (n !== 0 && (!Number.isInteger(n) || n < DNI_MIESIACA_MIN || n > DNI_MIESIACA_MAX)) errors.push(dniMiesiacaPozaZakresem(n))
  const d = input.biezacyDzien
  if (d !== 0 && (!Number.isInteger(d) || d < 1 || (n >= DNI_MIESIACA_MIN && d > n))) errors.push(biezacyDzienPozaZakresem(d, n))

  if (input.udzialOgrzewaniaPct < 0 || input.udzialOgrzewaniaPct > 100) {
    errors.push(procentPozaZakresemDwb("udzialOgrzewaniaPct", input.udzialOgrzewaniaPct))
  }
  let suma = 0
  const widziane = new Set<string>()
  for (const c of input.cele) {
    if (c.udzialPlanuPct < 0 || c.udzialPlanuPct > 100) errors.push(procentPozaZakresemDwb(`cele.${c.cel}.udzialPlanuPct`, c.udzialPlanuPct))
    suma += c.udzialPlanuPct
    if (widziane.has(c.cel)) errors.push(celPowtorzony(c.cel))
    widziane.add(c.cel)
  }
  if (suma > 100 + 1e-9) errors.push(udzialyPowyzej100(suma))
  return { errors }
}
