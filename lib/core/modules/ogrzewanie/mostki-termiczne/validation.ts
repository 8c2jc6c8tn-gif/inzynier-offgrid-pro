import type { Warning } from "@/lib/core/calc-result"
import { PSI_SANITY_MAX } from "./constants"
import type { MostkiTermiczneInput } from "./input"
import { pozycjaKatalogu } from "./katalog-psi"
import { nieznanyKodKatalogu, wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(input: MostkiTermiczneInput): Warning[] {
  const e: Warning[] = []
  input.mostki.forEach((m, i) => {
    const etykieta = m.nazwa || `mostek ${i + 1}`
    if (m.dlugoscM !== null && m.dlugoscM < 0) e.push(wartoscUjemna(`mostki.${i}.dlugoscM`, "POLE-DLUGOSC-MOSTKA", m.dlugoscM, etykieta))
    for (const [pole, psi] of [
      ["psiWmK", m.psiWmK],
      ["psiPoPoprawieWmK", m.psiPoPoprawieWmK],
    ] as const) {
      if (psi !== null && Math.abs(psi) > PSI_SANITY_MAX) {
        e.push(wartoscPozaZakresem(`mostki.${i}.${pole}`, "POLE-PSI-MOSTKA", psi, -PSI_SANITY_MAX, PSI_SANITY_MAX, etykieta))
      }
    }
    for (const [pole, kod] of [
      ["kodKatalogu", m.kodKatalogu],
      ["kodKataloguPoPoprawie", m.kodKataloguPoPoprawie],
    ] as const) {
      if (kod != null && kod !== "" && pozycjaKatalogu(kod) === undefined) e.push(nieznanyKodKatalogu(`mostki.${i}.${pole}`, kod))
    }
  })
  return e
}
