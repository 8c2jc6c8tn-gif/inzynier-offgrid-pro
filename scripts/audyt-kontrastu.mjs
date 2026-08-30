// Audyt kontrastu WCAG (docs/brief-dla-v0.md, sekcja 8) dla par tokenów z app/globals.css.
// Konwersja oklch -> sRGB -> względna luminancja -> współczynnik kontrastu WCAG 2.x.
// Uruchomienie: node scripts/audyt-kontrastu.mjs

function oklchToRgb(L, C, Hdeg) {
  const h = (Hdeg * Math.PI) / 180
  const a = Math.cos(h) * C
  const b = Math.sin(h) * C

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

  const toSrgb = (c) => {
    c = Math.max(0, Math.min(1, c))
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
  }
  return [toSrgb(r), toSrgb(g), toSrgb(bl)].map((c) => Math.max(0, Math.min(1, c)))
}

function relLuminance([r, g, b]) {
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const [rl, gl, bl] = [r, g, b].map(lin)
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

function contrast(oklchA, oklchB) {
  const rgbA = oklchToRgb(...oklchA)
  const rgbB = oklchToRgb(...oklchB)
  const lA = relLuminance(rgbA)
  const lB = relLuminance(rgbB)
  const lighter = Math.max(lA, lB)
  const darker = Math.min(lA, lB)
  return (lighter + 0.05) / (darker + 0.05)
}

function fmt(ratio, target) {
  const pass = ratio >= target
  return `${ratio.toFixed(2)}:1 ${pass ? "PASS" : "FAIL"} (min ${target})`
}

// Kontrast dla warstwy alpha (border/input w dark: biały nakładany z przezroczystością na tło) —
// kompozycja w sRGB (tak jak przeglądarka), nie w oklch, inaczej niż pary powyżej.
function contrastAlphaBlend(alpha, bgOklch) {
  const bgRgb = oklchToRgb(...bgOklch)
  const blended = bgRgb.map((c) => alpha * 1 + (1 - alpha) * c)
  const lBlended = relLuminance(blended)
  const lBg = relLuminance(bgRgb)
  const hi = Math.max(lBlended, lBg)
  const lo = Math.min(lBlended, lBg)
  return (hi + 0.05) / (lo + 0.05)
}

const PARY_LIGHT = [
  ["foreground / background", [0.145, 0, 0], [1, 0, 0], 4.5],
  ["muted-foreground / background", [0.48, 0, 0], [1, 0, 0], 4.5],
  ["primary-foreground / primary (Techniczny błękit)", [0.98, 0, 0], [0.52, 0.18, 245], 4.5],
  ["primary / background (tekst linku)", [0.52, 0.18, 245], [1, 0, 0], 4.5],
  ["card-foreground / card", [0.145, 0, 0], [1, 0, 0], 4.5],
  ["werdykt-ok-foreground / werdykt-ok-bg", [0.35, 0.12, 152], [0.94, 0.05, 152], 4.5],
  ["werdykt-uwaga-foreground / werdykt-uwaga-bg", [0.42, 0.14, 70], [0.94, 0.09, 70], 4.5],
  ["werdykt-blad-foreground / werdykt-blad-bg", [0.4, 0.19, 27], [0.94, 0.05, 27], 4.5],
  ["border/input (obrys Pole, przycisk outline) / background", [0.62, 0, 0], [1, 0, 0], 3.0],
]

const PARY_DARK = [
  ["foreground / background", [0.985, 0, 0], [0.145, 0, 0], 4.5],
  ["muted-foreground / background", [0.72, 0, 0], [0.145, 0, 0], 4.5],
  ["primary-foreground / primary (Techniczny błękit, dark)", [0.15, 0, 0], [0.68, 0.15, 245], 4.5],
  ["primary / background (tekst linku, dark)", [0.68, 0.15, 245], [0.145, 0, 0], 4.5],
  ["card-foreground / card", [0.985, 0, 0], [0.205, 0, 0], 4.5],
]

// border/input w dark to alpha-blend (biały 38% na tle), nie jednolity szary — kontrast liczony
// osobno przez blendRgb (kompozycja w sRGB, tak jak przegldarka), nie przez oklchToRgb+contrast.
const PARA_BORDER_DARK = ["border/input (obrys Pole, przycisk outline, dark) / background", 0.38, 3.0]

// Druga propozycja akcentu — "Energetyczny cyjan" (oklch 0.55 0.15 205) — sprawdzona jako tekst
// linku na tle i jako primary-foreground na primary, tak jak błękit powyżej.
const PARY_CYJAN = [
  ["primary-foreground / primary (Energetyczny cyjan, light)", [0.98, 0, 0], [0.46, 0.13, 205], 4.5],
  ["primary / background (tekst linku, cyjan light)", [0.46, 0.13, 205], [1, 0, 0], 4.5],
]

console.log("=== LIGHT ===")
for (const [nazwa, fg, bg, target] of PARY_LIGHT) {
  console.log(`${nazwa}: ${fmt(contrast(fg, bg), target)}`)
}

console.log("\n=== DARK ===")
for (const [nazwa, fg, bg, target] of PARY_DARK) {
  console.log(`${nazwa}: ${fmt(contrast(fg, bg), target)}`)
}
{
  const [nazwa, alpha, target] = PARA_BORDER_DARK
  console.log(`${nazwa}: ${fmt(contrastAlphaBlend(alpha, [0.145, 0, 0]), target)}`)
}

console.log("\n=== Wariant akcentu: Energetyczny cyjan (light) ===")
for (const [nazwa, fg, bg, target] of PARY_CYJAN) {
  console.log(`${nazwa}: ${fmt(contrast(fg, bg), target)}`)
}
