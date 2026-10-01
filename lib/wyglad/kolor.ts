/**
 * Colour maths for the appearance layer: WCAG 2.x relative luminance and contrast ratio, and an
 * sRGB mix used to derive a verdict background from its base colour and the card colour.
 *
 * Pure functions on `#rrggbb` strings — shared by the style table (`./style.ts`, which emits the
 * mixed colour as a literal hex so the browser shows exactly what the contrast test measured) and
 * by `./storage.ts` (readable text on a user-picked accent).
 */

export const HEX = /^#[0-9a-fA-F]{6}$/

export function jestHeksem(value: unknown): value is string {
  return typeof value === "string" && HEX.test(value)
}

function kanaly(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
}

/** WCAG 2.x relative luminance (sRGB, threshold 0.04045). */
export function luminancja(hex: string): number {
  const [r, g, b] = kanaly(hex).map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio, 1–21. Order of the arguments does not matter. */
export function kontrast(a: string, b: string): number {
  const la = luminancja(a)
  const lb = luminancja(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** `udzial` of `kolor` over `tlo` (0 = only `tlo`, 1 = only `kolor`), per sRGB channel, rounded. */
export function zmieszaj(kolor: string, tlo: string, udzial: number): string {
  const a = kanaly(kolor)
  const b = kanaly(tlo)
  return (
    "#" +
    a
      .map((v, i) => Math.round(v * udzial + b[i] * (1 - udzial)))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  )
}
