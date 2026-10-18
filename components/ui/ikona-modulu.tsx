import { IKONA, Ikona, type NazwaIkony } from "@/components/ui/ikona"

/**
 * Line icon of a dashboard module / preset, in place of the emoji kept in the tile registry (`lib/pulpit/registry.ts`, `presety.ts`; the emoji stay as
 * data for translation parameters). Same names as in the registry: pin = location, bolt = demand, pv, bat, plug = cabling, flame = heating, snow = winter,
 * shield = safety, chip = electronics, ai, wrench = battery mounting, calc, live, sliders = settings, home and fabr = the two grid tiles.
 */
const IKONA_KAFLA: Record<number, NazwaIkony> = {
  1: IKONA.pin,
  2: IKONA.bolt,
  3: IKONA.pv,
  4: IKONA.bat,
  5: IKONA.plug,
  6: IKONA.flame,
  7: IKONA.snow,
  8: IKONA.shield,
  9: IKONA.chip,
  10: IKONA.ai,
  11: IKONA.wrench,
  12: IKONA.calc,
  13: IKONA.live,
  14: IKONA.sliders,
  15: IKONA.home,
  16: IKONA.fabr,
}

const IKONA_PRESETU: Record<string, NazwaIkony> = {
  "caly-system": IKONA.home,
  pv: IKONA.pv,
  magazyn: IKONA.bat,
  zapotrzebowanie: IKONA.bolt,
  ogrzewanie: IKONA.flame,
  elektryka: IKONA.wrench,
  analiza: IKONA.flask,
  automatyka: IKONA.ai,
  mikro: IKONA.van,
  siec: IKONA.plug,
}

export const KAFLE_Z_IKONA_LINIOWA = Object.keys(IKONA_KAFLA).map(Number)
export const PRESETY_Z_IKONA_LINIOWA = Object.keys(IKONA_PRESETU)

export function IkonaKafla({ kafelId, className }: { kafelId: number; className?: string }) {
  const nazwa = IKONA_KAFLA[kafelId]
  return nazwa ? <Ikona nazwa={nazwa} className={className} /> : null
}

export function IkonaPresetu({ presetId, className }: { presetId: string; className?: string }) {
  const nazwa = IKONA_PRESETU[presetId]
  return nazwa ? <Ikona nazwa={nazwa} className={className} /> : null
}
