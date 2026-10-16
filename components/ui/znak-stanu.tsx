import { Ikona, IKONA, type NazwaIkony } from "@/components/ui/ikona"
import type { WerdyktPoziom } from "@/components/werdykt"

const IKONY: Record<WerdyktPoziom | "info", NazwaIkony> = { ok: IKONA.ok, uwaga: IKONA.warn, blad: IKONA.err, info: IKONA.info }

/**
 * Small status sign in front of a line (list item, table row): the same tick / triangle / cross shapes as the verdict panel, painted
 * with the text colour. Decorative — the meaning is always in the text next to it.
 */
export function ZnakStanu({ poziom }: { poziom: WerdyktPoziom | "info" }) {
  return <Ikona nazwa={IKONY[poziom]} className="mr-1 inline size-4 align-text-bottom" />
}
