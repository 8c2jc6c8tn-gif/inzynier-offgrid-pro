import { describe, expect, it } from "vitest"
import { calculateUrzadzeniaZabronione } from "../calculator"

const FALOWNIK = { mocFalownikaW: 1000, mocSzczytowaW: 2000 }

describe("calculateUrzadzeniaZabronione (M12/E37, dawne 8.64)", () => {
  it("przykład Biblii §12.52: suszarka 1800 W na falowniku 1000 W → zabronione 🔴", () => {
    const w = calculateUrzadzeniaZabronione({ ...FALOWNIK, urzadzenia: [{ nazwa: "Suszarka", mocW: 1800, krotnoscRozruchu: 1 }] })
    expect(w.value.oceny[0].ocena).toBe("zabronione")
    expect(w.warnings[0]).toMatchObject({ code: "UZF-URZADZENIE-ZABRONIONE", level: "critical" })
  })

  it("OK / ryzykowne (start na przeciążeniu) / ryzykowne (krotność nieznana) / zabronione (rozruch ponad szczyt)", () => {
    const w = calculateUrzadzeniaZabronione({
      ...FALOWNIK,
      urzadzenia: [
        { nazwa: "Router", mocW: 10, krotnoscRozruchu: 1 },
        { nazwa: "Lodówka", mocW: 150, krotnoscRozruchu: 8 },
        { nazwa: "Wiertarka", mocW: 600, krotnoscRozruchu: 0 },
        { nazwa: "Kompresor", mocW: 800, krotnoscRozruchu: 3 },
      ],
    })
    expect(w.value.oceny.map((o) => o.ocena)).toEqual(["ok", "ryzykowne", "ryzykowne", "zabronione"])
    expect(w.warnings.map((x) => x.code)).toEqual(["UZF-START-NA-PRZECIAZENIU", "UZF-ROZRUCH-NIEZNANY", "UZF-URZADZENIE-ZABRONIONE"])
    expect(w.value.potrzebnaMocCiaglaW).toBe(800)
    expect(w.value.potrzebnaMocSzczytowaW).toBe(2400)
  })

  it("brak danych falownika → INCOMPLETE; ujemna moc → INVALID_INPUT", () => {
    expect(calculateUrzadzeniaZabronione({ mocFalownikaW: 0, mocSzczytowaW: 0, urzadzenia: [{ nazwa: "", mocW: 10, krotnoscRozruchu: 1 }] }).status).toBe("INCOMPLETE")
    expect(calculateUrzadzeniaZabronione({ ...FALOWNIK, urzadzenia: [{ nazwa: "", mocW: -1, krotnoscRozruchu: 1 }] }).status).toBe("INVALID_INPUT")
  })
})
