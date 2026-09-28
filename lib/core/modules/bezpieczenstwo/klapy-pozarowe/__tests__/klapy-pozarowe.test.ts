import { describe, expect, it } from "vitest"
import { calculateKlapyPozarowe } from "../calculator"
import type { KlapyPozaroweInput } from "../input"

const OK: KlapyPozaroweInput = {
  wentylacja: "mechaniczna",
  wentylacjaWylaczanaPrzyPozarze: true,
  klapyZamykanePrzyPozarze: true,
  sygnalizacjaStanuKlap: true,
  maOddymianie: true,
}

describe("calculateKlapyPozarowe (M8/E8, dawne 11.56 + 12.56)", () => {
  it("pełna reakcja na pożar → VALID bez ostrzeżeń", () => {
    expect(calculateKlapyPozarowe(OK)).toMatchObject({ status: "VALID", warnings: [] })
  })

  it("rekuperacja nie wyłączana, klapy nie zamykane → 2× 🟡 (źródło bez 🔴)", () => {
    const w = calculateKlapyPozarowe({ ...OK, wentylacjaWylaczanaPrzyPozarze: false, klapyZamykanePrzyPozarze: false })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["KLAPY-WENTYLACJA-NIE-WYLACZANA", "warning"],
      ["KLAPY-NIE-ZAMYKANE", "warning"],
    ])
    expect(w.value.liczbaBrakow).toBe(2)
  })

  it("brak oddymiania i sygnalizacji → tylko info, VALID", () => {
    const w = calculateKlapyPozarowe({ ...OK, sygnalizacjaStanuKlap: false, maOddymianie: false })
    expect(w.status).toBe("VALID")
    expect(w.warnings.every((x) => x.level === "info")).toBe(true)
  })

  it("brak wentylacji mechanicznej → nie dotyczy (info); nie wybrano → INCOMPLETE", () => {
    const w = calculateKlapyPozarowe({ ...OK, wentylacja: "brak", klapyZamykanePrzyPozarze: false })
    expect(w.warnings.map((x) => x.code)).toEqual(["KLAPY-BRAK-WENTYLACJI-MECHANICZNEJ"])
    expect(calculateKlapyPozarowe({ ...OK, wentylacja: null }).status).toBe("INCOMPLETE")
  })
})
