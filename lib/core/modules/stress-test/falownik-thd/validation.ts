import type { Warning } from "@/lib/core/calc-result"
import type { FalownikThdInput } from "./input"
import { tabelaNieRosnaca, wartoscUjemnaThd, wspolczynnikPozaZakresem } from "./warnings"

export function validateInput(input: FalownikThdInput): { errors: Warning[] } {
  const errors: Warning[] = []
  const nieujemne: Record<string, number> = {
    mocZnamionowaKw: input.mocZnamionowaKw,
    mocObciazeniaKw: input.mocObciazeniaKw,
  }
  if (input.thdPct !== null) nieujemne.thdPct = input.thdPct
  input.tabela.forEach((p, i) => {
    nieujemne[`tabela[${i}].thdPct`] = p.thdPct
  })
  for (const [pole, v] of Object.entries(nieujemne)) if (!Number.isFinite(v) || v < 0) errors.push(wartoscUjemnaThd(pole, v))

  input.tabela.forEach((p, i) => {
    if (!Number.isFinite(p.wspolczynnik) || p.wspolczynnik < 0 || p.wspolczynnik > 1) errors.push(wspolczynnikPozaZakresem(i, p.wspolczynnik))
    if (i > 0 && !(p.thdPct > input.tabela[i - 1]!.thdPct)) errors.push(tabelaNieRosnaca(i))
  })
  return { errors }
}
