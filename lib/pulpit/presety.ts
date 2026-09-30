/**
 * Dashboard presets ("profile pulpitu" — never "AI", docs/pulpit-i-nawigacja.md §6): a deterministic
 * mapping preset → visible tiles in order. Source: docs/pulpit-i-nawigacja.md §3 (eight working
 * presets). The two M14 tiles ("Dom – sieć", "Firma – sieć", ids 15/16) close every preset (D53, D54).
 * The ninth preset "Jestem podłączony do sieci" (D39) waits for the onboarding screen — its tile set is
 * not decided (backlog-poza-v1.md).
 */
import { KAFLE } from "./registry"
import type { PulpitState } from "./storage"

/** M14 tiles at the end of every preset, "Dom – sieć" first (D53 pkt 2, D54 pkt 3). */
const KAFLE_M14 = [15, 16] as const

export type PresetPulpitu = {
  id: string
  /** i18n keys (`lib/i18n/ui/pulpit.ts`). */
  nazwaKlucz: string
  opisKlucz: string
  ikona: string
  /** Visible tiles in this order; every other tile gets hidden. */
  widoczne: number[]
}

function preset(id: string, ikona: string, kafle: number[]): PresetPulpitu {
  const klucz = `UI-PULPIT-PRESET-${id.toUpperCase()}`
  return { id, nazwaKlucz: klucz, opisKlucz: `${klucz}-OPIS`, ikona, widoczne: [...kafle, ...KAFLE_M14] }
}

export const PRESETY: PresetPulpitu[] = [
  preset("caly-system", "🏠", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]),
  preset("pv", "☀️", [1, 3, 2, 4, 5, 7, 10]),
  preset("magazyn", "🔋", [1, 4, 2, 3, 5, 11, 7]),
  preset("zapotrzebowanie", "⚡", [1, 2, 3, 4, 12]),
  preset("ogrzewanie", "🔥", [1, 6, 2, 7, 10]),
  preset("elektryka", "🧰", [1, 5, 3, 4, 8]),
  preset("analiza", "🧪", [1, 7, 2, 3, 4, 6, 10]),
  preset("automatyka", "🤖", [1, 9, 10, 13, 8]),
]

/**
 * Dashboard state for the chosen presets. One preset → its own order. Several → union of their tiles
 * in the default order (§3: "suma zbiorów"; order of a union is not specified there — the default order
 * of §2 is the same rule "Pełne menu" uses, ✅🤖). Hidden tiles follow in the default order, so
 * "Pokaż" in the settings brings them back in a predictable place. No preset → default state.
 */
export function stanZPresetow(ids: string[]): PulpitState {
  const wybrane = PRESETY.filter((p) => ids.includes(p.id))
  const domyslna = KAFLE.map((k) => k.id)
  if (wybrane.length === 0) return { hiddenIds: [], order: domyslna }

  const widoczne =
    wybrane.length === 1
      ? wybrane[0]!.widoczne
      : domyslna.filter((id) => wybrane.some((p) => p.widoczne.includes(id)))
  const ukryte = domyslna.filter((id) => !widoczne.includes(id))
  return { hiddenIds: ukryte, order: [...widoczne, ...ukryte] }
}
