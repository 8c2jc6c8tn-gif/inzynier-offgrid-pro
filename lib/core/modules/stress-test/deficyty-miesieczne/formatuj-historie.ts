import type { RokHistorii } from "./input"

/**
 * Inverse of `parsujHistorie`: one line per year, `year` followed by the daily values from 1 January,
 * space-separated, `.` decimal; a missing day is written as `-` (parsed back as `null`, never filled).
 */
export function formatujHistorie(lata: RokHistorii[], miejscaDziesietne = 3): string {
  return lata
    .map(({ rok, dni }) => [rok, ...dni.map((d) => (d === null ? "-" : String(Number(d.toFixed(miejscaDziesietne)))))].join(" "))
    .join("\n")
}
