// English texts of ./meta.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./meta"

export const en: Record<keyof typeof pl, string> = {
  "UI-META-NAZWA": "Offgrid Engineer Pro",
  "UI-META-NAZWA-KROTKA": "Offgrid Pro",
  "UI-META-OPIS": "Engineering calculator and advisor for off-grid PV systems (panels, energy storage, heating, safety).",
}
