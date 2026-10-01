import type { Warning } from "@/lib/core/calc-result"
import { procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { PowerbankVsAkumulatorInput } from "./input"

export function validateInput(input: PowerbankVsAkumulatorInput): { errors: Warning[] } {
  return {
    errors: [
      ...ujemneWartosci(input),
      ...procentPozaZakresem("akumulatorUzytecznaPct", input.akumulatorUzytecznaPct),
      ...procentPozaZakresem("sprawnoscPct", input.sprawnoscPct),
    ],
  }
}
