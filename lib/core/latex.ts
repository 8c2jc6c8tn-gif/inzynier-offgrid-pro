/**
 * A number for a LaTeX `formula` string, with the decimal comma the formulas use (`1{,}25`).
 * Formulas build their numbers from engine constants with this helper instead of retyping
 * them, so the shown formula cannot drift from the calculation (8.4b).
 */
export function latexLiczba(x: number | string): string {
  return String(x).replace(".", "{,}")
}
