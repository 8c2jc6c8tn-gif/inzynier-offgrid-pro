import type { Warning } from "@/lib/core/calc-result"
import { PREDKOSC_WYLACZENIA_MAKS_MS } from "./constants"
import type { TurbinaWiatrowaInput } from "./input"
import {
  krzywaNieRosnaca,
  wartoscUjemnaTurbina,
  wspolczynnikPozaZakresemTurbina,
  wylaczeniePonizejKrzywej,
  wylaczeniePozaZakresem,
} from "./warnings"

export function validateInput(input: TurbinaWiatrowaInput): { errors: Warning[] } {
  const errors: Warning[] = []
  const nieujemne: Record<string, number> = {
    sredniaPredkoscMs: input.sredniaPredkoscMs,
    predkoscWylaczeniaMs: input.predkoscWylaczeniaMs,
  }
  input.krzywa.forEach((p, i) => {
    nieujemne[`krzywa[${i}].predkoscMs`] = p.predkoscMs
    nieujemne[`krzywa[${i}].mocKw`] = p.mocKw
  })
  for (const [pole, v] of Object.entries(nieujemne)) if (!Number.isFinite(v) || v < 0) errors.push(wartoscUjemnaTurbina(pole, v))

  const a = input.wspolczynnikDostepnosciStrat
  if (a !== null && (!Number.isFinite(a) || a < 0 || a > 1)) errors.push(wspolczynnikPozaZakresemTurbina(a))

  input.krzywa.forEach((p, i) => {
    if (i > 0 && !(p.predkoscMs > input.krzywa[i - 1]!.predkoscMs)) errors.push(krzywaNieRosnaca(i))
  })

  const vOff = input.predkoscWylaczeniaMs
  if (Number.isFinite(vOff) && vOff > PREDKOSC_WYLACZENIA_MAKS_MS) errors.push(wylaczeniePozaZakresem(vOff, PREDKOSC_WYLACZENIA_MAKS_MS))
  const ostatni = input.krzywa[input.krzywa.length - 1]
  if (ostatni && vOff > 0 && vOff <= PREDKOSC_WYLACZENIA_MAKS_MS && vOff < ostatni.predkoscMs) {
    errors.push(wylaczeniePonizejKrzywej(vOff, ostatni.predkoscMs))
  }
  return { errors }
}
