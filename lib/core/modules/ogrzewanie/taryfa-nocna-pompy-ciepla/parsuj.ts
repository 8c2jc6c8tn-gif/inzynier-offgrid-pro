/**
 * Parsers for the two pasted fields of the night-tariff screen (owner decision 04.10.2026, point 1 → B). Pure
 * functions: unreadable text is reported, never guessed.
 */

/**
 * 24 hourly weights (hours 0–23). Separators: `;`, white space, tab or new line; decimal point or comma.
 * Returns `blad: true` when any cell is not a number; the count of values is checked by the engine validation.
 */
export function parsujProfil(tekst: string): { wartosci: number[]; blad: boolean } {
  const komorki = tekst.split(/[;\s]+/).filter((c) => c !== "")
  const wartosci = komorki.map((c) => Number(c.replace(",", ".")))
  return { wartosci, blad: wartosci.some((v) => !Number.isFinite(v)) }
}

/**
 * Cheap-zone hours written as ranges or single hours, e.g. `22-6; 13-15` or `22-6, 13`. A range `a-b` covers the
 * one-hour slots starting at a, a+1, … up to b−1 and may wrap over midnight (`22-6` = 22, 23, 0 … 5). Separators
 * between ranges: `;`, `,` or white space. Hours outside 0–24 or a range with a = b → `blad: true`.
 */
export function parsujGodzinyStrefy(tekst: string): { godziny: number[]; blad: boolean } {
  const godziny: number[] = []
  let blad = false
  for (const czesc of tekst.split(/[;,\s]+/).filter((c) => c !== "")) {
    const zakres = /^(\d{1,2})(?:[-–](\d{1,2}))?$/.exec(czesc)
    if (!zakres) {
      blad = true
      continue
    }
    const od = Number(zakres[1])
    if (zakres[2] === undefined) {
      if (od > 23) blad = true
      else godziny.push(od)
      continue
    }
    const doGodz = Number(zakres[2])
    if (od > 24 || doGodz > 24 || od % 24 === doGodz % 24) {
      blad = true
      continue
    }
    for (let h = od % 24; h !== doGodz % 24; h = (h + 1) % 24) godziny.push(h)
  }
  return { godziny, blad }
}
