"use client"

/**
 * Horizon profile from photos as plain SVG (offline, dark-theme friendly via `currentColor`):
 * elevation of the skyline [°] against azimuth. Directions no photo covered are drawn as a hatched
 * band — unknown is shown as unknown, never as a clear sky.
 */
import type { ProfilHoryzontu } from "@/lib/core/modules/lokalizacja/horyzont-ze-zdjecia/profil"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"

const W = 360
const H = 150
const DOL = 124
const GORA = 14
const MIN_SKALA_DEG = 10

export function WykresHoryzontuZdjecia({ profil }: { profil: ProfilHoryzontu }) {
  const t = useTranslate()
  const { f0 } = useFormaty()
  const max = Math.max(MIN_SKALA_DEG, ...profil.map((v) => v ?? 0))
  const krok = W / profil.length
  const y = (v: number) => DOL - (v / max) * (DOL - GORA)
  // Contiguous runs of known bins → one filled path each; the unknown runs → hatched rectangles.
  const znane: string[] = []
  const nieznane: { od: number; do: number }[] = []
  let i = 0
  while (i < profil.length) {
    const znany = profil[i] !== null
    let j = i
    while (j < profil.length && (profil[j] !== null) === znany) j++
    if (znany) {
      const punkty = profil.slice(i, j).map((v, k) => `L${((i + k) * krok).toFixed(1)},${y(v!).toFixed(1)}`)
      znane.push(`M${(i * krok).toFixed(1)},${DOL} ${punkty.join(" ")} L${((j - 1) * krok).toFixed(1)},${DOL} Z`)
    } else nieznane.push({ od: i, do: j })
    i = j
  }
  const kierunki = [t("UI-TORS-KIERUNEK-N"), t("UI-TORS-KIERUNEK-E"), t("UI-TORS-KIERUNEK-S"), t("UI-TORS-KIERUNEK-W"), t("UI-TORS-KIERUNEK-N")]
  return (
    <figure className="flex flex-col gap-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-foreground" role="img" aria-label={t("UI-HORZ-WYKRES-ARIA")}>
        <defs>
          <pattern id="horz-nieznane" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeOpacity={0.25} strokeWidth="2" />
          </pattern>
        </defs>
        {nieznane.map((n) => (
          <rect key={n.od} x={n.od * krok} y={GORA} width={(n.do - n.od) * krok} height={DOL - GORA} fill="url(#horz-nieznane)" />
        ))}
        {znane.map((d, k) => (
          <path key={k} d={d} className="fill-current opacity-40" stroke="currentColor" strokeOpacity={0.8} />
        ))}
        {kierunki.map((k, idx) => (
          <g key={idx}>
            <line x1={idx * 90} x2={idx * 90} y1={GORA} y2={DOL} stroke="currentColor" strokeOpacity={0.15} />
            <text x={Math.min(W - 8, Math.max(2, idx * 90 - 4))} y={H - 6} className="fill-current text-[10px]">
              {k}
            </text>
          </g>
        ))}
        <line x1={0} x2={W} y1={DOL} y2={DOL} stroke="currentColor" strokeOpacity={0.4} />
        <text x={2} y={10} className="fill-current text-[10px]">
          {f0(max)}°
        </text>
      </svg>
      {nieznane.length > 0 && <figcaption className="text-caption text-muted-foreground">{t("UI-HORZ-WYKRES-NIEZNANE")}</figcaption>}
    </figure>
  )
}
