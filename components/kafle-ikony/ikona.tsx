/**
 * Mapowanie id kafla (lib/pulpit/registry.ts) → id <symbol> zdefiniowanego w
 * definicje-symboli.tsx. Kafle bez wpisu tutaj nie mają jeszcze zbudowanej animowanej ikony —
 * app/page.tsx pokazuje wtedy dotychczasowe emoji z rejestru jako fallback.
 */
const SYMBOL_PO_ID_KAFLA: Record<number, string> = {
  1: "tile-terrain-symbol",
  2: "tile-energy-symbol",
  3: "tile-pv-symbol",
  4: "tile-battery-symbol",
  5: "tile-cabling-symbol",
  6: "tile-heatpump-symbol",
  7: "tile-winter-symbol",
}

/** Kafle, dla których jest już zbudowana animowana ikona — app/page.tsx używa tego do wyboru
 * między <KafelIkonaSvg> a emoji z rejestru. */
export const KAFLE_ZE_ZBUDOWANA_IKONA = Object.keys(SYMBOL_PO_ID_KAFLA).map(Number)

export function KafelIkonaSvg({ kafelId, className }: { kafelId: number; className?: string }) {
  const symbolId = SYMBOL_PO_ID_KAFLA[kafelId]
  if (!symbolId) return null

  return (
    <svg
      className={["kafel-ikona-svg", className].filter(Boolean).join(" ")}
      width={44}
      height={44}
      viewBox="0 0 256 256"
      role="img"
      aria-hidden="true"
    >
      <use href={`#${symbolId}`} />
    </svg>
  )
}
