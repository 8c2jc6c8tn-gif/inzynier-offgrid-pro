import type { Warning } from "@/lib/core/calc-result"
import { PSI_SANITY_MAX } from "./constants"
import type { MostkiTermiczneInput } from "./input"
import { wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(input: MostkiTermiczneInput): Warning[] {
  const e: Warning[] = []
  input.mostki.forEach((m, i) => {
    const etykieta = m.nazwa || `mostek ${i + 1}`
    if (m.dlugoscM !== null && m.dlugoscM < 0) e.push(wartoscUjemna(`mostki.${i}.dlugoscM`, `Długość (${etykieta})`, m.dlugoscM))
    for (const [pole, psi] of [
      ["psiWmK", m.psiWmK],
      ["psiPoPoprawieWmK", m.psiPoPoprawieWmK],
    ] as const) {
      if (psi !== null && Math.abs(psi) > PSI_SANITY_MAX) {
        e.push(wartoscPozaZakresem(`mostki.${i}.${pole}`, `Ψ (${etykieta})`, psi, -PSI_SANITY_MAX, PSI_SANITY_MAX))
      }
    }
  })
  return e
}
