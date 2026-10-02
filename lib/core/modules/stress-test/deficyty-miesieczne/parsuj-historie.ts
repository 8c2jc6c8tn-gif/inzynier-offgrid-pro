import type { RokHistorii } from "./input"

/**
 * Parses a pasted multi-year daily history: one line per year, `year` followed by the daily values from
 * 1 January. Separators: `;` (an empty cell = missing day) or white space / tab. Decimal point or comma.
 * A day written as `-`, `x`, `n/a` or `NaN` is missing (`null`). Lines that do not start with a 4-digit year or
 * hold a non-numeric value are returned in `nieczytelneLinie` (1-based) and left out — never guessed.
 */
export function parsujHistorie(tekst: string): { lata: RokHistorii[]; nieczytelneLinie: number[] } {
  const lata: RokHistorii[] = []
  const nieczytelneLinie: number[] = []
  tekst.split(/\r?\n/).forEach((linia, idx) => {
    const surowa = linia.trim()
    if (surowa === "") return
    const komorki = surowa.includes(";") ? surowa.split(";").map((c) => c.trim()) : surowa.split(/\s+/)
    const [rokTekst, ...reszta] = komorki
    if (!/^\d{4}$/.test(rokTekst ?? "")) {
      nieczytelneLinie.push(idx + 1)
      return
    }
    const dni: (number | null)[] = []
    for (const c of reszta) {
      if (c === "" || /^(-|x|n\/a|nan)$/i.test(c)) {
        dni.push(null)
        continue
      }
      const v = Number(c.replace(",", "."))
      if (!Number.isFinite(v)) {
        nieczytelneLinie.push(idx + 1)
        return
      }
      dni.push(v)
    }
    lata.push({ rok: Number(rokTekst), dni })
  })
  return { lata, nieczytelneLinie }
}
