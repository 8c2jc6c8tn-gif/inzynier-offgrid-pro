import { describe, expect, it } from "vitest"
import { calculateAnalizaSpof } from "../calculator"

describe("calculateAnalizaSpof (M7/E10, dawne 6.12)", () => {
  it("przykład źródła: BMS, bezpiecznik główny, pompa ciepła bez redundancji → 🔴 BMS + 2× 🟡 z zaleceniami", () => {
    const w = calculateAnalizaSpof({
      komponenty: [
        { nazwa: "BMS", typ: "bms", maRedundancje: false },
        { nazwa: "Bezpiecznik główny", typ: "bezpiecznik-glowny", maRedundancje: false },
        { nazwa: "Pompa ciepła", typ: "pompa-ciepla", maRedundancje: false },
        { nazwa: "Falownik", typ: "falownik", maRedundancje: true },
      ],
    })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["SPOF-BMS", "critical"],
      ["SPOF-BEZPIECZNIK-GLOWNY", "warning"],
      ["SPOF-POMPA-CIEPLA", "warning"],
    ])
    expect(w.value).toEqual({ liczbaKomponentow: 4, liczbaSpof: 3 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("inny typ bez redundancji → ogólne 🟡; pusta nazwa → numer", () => {
    const w = calculateAnalizaSpof({ komponenty: [{ nazwa: "", typ: "mppt", maRedundancje: false }] })
    expect(w.warnings[0]).toMatchObject({ code: "SPOF-KOMPONENT", level: "warning", params: { nazwa: "#1" } })
  })

  it("wszystko z redundancją → VALID; pusta lista → INCOMPLETE", () => {
    expect(calculateAnalizaSpof({ komponenty: [{ nazwa: "BMS", typ: "bms", maRedundancje: true }] }).status).toBe("VALID")
    expect(calculateAnalizaSpof({ komponenty: [] }).status).toBe("INCOMPLETE")
  })
})
