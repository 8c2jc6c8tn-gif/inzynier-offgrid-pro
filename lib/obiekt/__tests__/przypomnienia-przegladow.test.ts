import { describe, expect, it } from "vitest"
import { czyPokazacPrzypomnienie, parsujPrzypomnienia } from "../przypomnienia-przegladow"

const wlaczone = { wlaczone: true, ostatnioDzien: "2026-10-17" }

describe("przypomnienia o przeglądach po terminie", () => {
  it("shows at most one notification a day, only when enabled, allowed and something is overdue", () => {
    const baza = { stan: wlaczone, uprawnienie: "granted" as const, poTerminie: 2, dzisiaj: "2026-10-18" }
    expect(czyPokazacPrzypomnienie(baza)).toBe(true)
    expect(czyPokazacPrzypomnienie({ ...baza, stan: { ...wlaczone, ostatnioDzien: "2026-10-18" } })).toBe(false)
    expect(czyPokazacPrzypomnienie({ ...baza, stan: { ...wlaczone, wlaczone: false } })).toBe(false)
    expect(czyPokazacPrzypomnienie({ ...baza, poTerminie: 0 })).toBe(false)
    for (const u of ["denied", "default", "brak-obslugi"] as const) expect(czyPokazacPrzypomnienie({ ...baza, uprawnienie: u })).toBe(false)
  })

  it("reads a saved state field by field; garbage and an empty value fall back to off", () => {
    expect(parsujPrzypomnienia('{"wlaczone":true,"ostatnioDzien":"2026-10-18"}')).toEqual({ wlaczone: true, ostatnioDzien: "2026-10-18" })
    expect(parsujPrzypomnienia('{"wlaczone":"tak","ostatnioDzien":5}')).toEqual({ wlaczone: false, ostatnioDzien: "" })
    expect(parsujPrzypomnienia("nie json")).toEqual({ wlaczone: false, ostatnioDzien: "" })
    expect(parsujPrzypomnienia(null)).toEqual({ wlaczone: false, ostatnioDzien: "" })
  })
})
