import { describe, expect, it } from "vitest"
import { KAFLE_Z_IKONA_LINIOWA, PRESETY_Z_IKONA_LINIOWA } from "@/components/ui/ikona-modulu"
import { PRESETY } from "../presety"
import { KAFLE, USTAWIENIA_KAFEL } from "../registry"

describe("line icons of the modules and presets replace the emoji on the screens", () => {
  it("every dashboard tile and the settings tile has a line icon", () => {
    for (const k of [...KAFLE, USTAWIENIA_KAFEL]) expect(KAFLE_Z_IKONA_LINIOWA, `kafel ${k.id}`).toContain(k.id)
  })

  it("every preset has a line icon", () => {
    for (const p of PRESETY) expect(PRESETY_Z_IKONA_LINIOWA, p.id).toContain(p.id)
  })
})
