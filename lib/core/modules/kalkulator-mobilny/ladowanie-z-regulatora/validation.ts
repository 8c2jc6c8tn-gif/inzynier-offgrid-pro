import type { Warning } from "@/lib/core/calc-result"
import type { LadowanieZRegulatoraInput } from "./input"
import { wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna } from "./warnings"

const skonczona = (x: number) => Number.isFinite(x)

export function validateInput(i: LadowanieZRegulatoraInput): Warning[] {
  const e: Warning[] = []
  const dodatnie: [keyof LadowanieZRegulatoraInput, number | null][] = [
    ["mocPaneliW", i.mocPaneliW],
    ["napiecieAkumulatoraV", i.napiecieAkumulatoraV],
    ["pojemnoscAh", i.pojemnoscAh],
    ["maksPradLadowaniaAkumulatoraA", i.maksPradLadowaniaAkumulatoraA],
    ["regulatorPradMaxA", i.regulatorPradMaxA],
    ["regulatorMocPvMaxW", i.regulatorMocPvMaxW],
  ]
  for (const [pole, v] of dodatnie) {
    if (v === null) continue
    if (!skonczona(v) || v < 0) e.push(wartoscUjemna(pole, v))
    else if (v === 0) e.push(wartoscNiedodatnia(pole, v))
  }
  if (i.sprawnoscRegulatoraPct !== null && (!skonczona(i.sprawnoscRegulatoraPct) || i.sprawnoscRegulatoraPct <= 0 || i.sprawnoscRegulatoraPct > 100)) {
    e.push(wartoscPozaZakresem("sprawnoscRegulatoraPct", i.sprawnoscRegulatoraPct, 0, 100))
  }
  for (const [pole, v] of [["socOdPct", i.socOdPct], ["socDoPct", i.socDoPct]] as const) {
    if (v !== null && (!skonczona(v) || v < 0 || v > 100)) e.push(wartoscPozaZakresem(pole, v, 0, 100))
  }
  if (i.socOdPct !== null && i.socDoPct !== null && i.socOdPct >= i.socDoPct && e.length === 0) {
    e.push(wartoscPozaZakresem("socOdPct", i.socOdPct, 0, i.socDoPct))
  }
  return e
}
