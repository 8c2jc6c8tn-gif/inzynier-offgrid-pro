import { describe, expect, it } from "vitest"
import { calculateKalkulatoryPomocnicze } from "../calculator"
import { EFFICIENCY_DEFAULT } from "../constants"

describe("Ekran 16 (Moduł 2): Kalkulatory pomocnicze", () => {
  describe("watt-to-amp — I = P / (V × η)", () => {
    it("przypadek nominalny: 100W przy 12V, domyślna sprawność", () => {
      const result = calculateKalkulatoryPomocnicze({
        mode: "watt-to-amp",
        powerW: 100,
        voltageV: 12,
      })

      // wartość referencyjna policzona ręcznie: 100 / (12 * 0.92) = 9.057971...
      expect(result.status).toBe("VALID")
      expect(result.unit).toBe("A")
      expect(result.value).toBeCloseTo(100 / (12 * EFFICIENCY_DEFAULT), 6)
      expect(result.assumptions).toContainEqual({ kod: "SPRAWNOSC-DOMYSLNA", params: { efficiency: EFFICIENCY_DEFAULT } })
      expect(result.warnings).toHaveLength(0)
    })

    it("jawnie podana sprawność nie generuje założenia domyślnego", () => {
      const result = calculateKalkulatoryPomocnicze({
        mode: "watt-to-amp",
        powerW: 100,
        voltageV: 12,
        efficiency: 0.95,
      })

      expect(result.status).toBe("VALID")
      expect(result.value).toBeCloseTo(100 / (12 * 0.95), 6)
      expect(result.assumptions).toHaveLength(0)
    })

    it("wartość graniczna: sprawność dokładnie 1 (brak strat) jest dozwolona", () => {
      const result = calculateKalkulatoryPomocnicze({
        mode: "watt-to-amp",
        powerW: 100,
        voltageV: 12,
        efficiency: 1,
      })

      expect(result.status).toBe("VALID")
      expect(result.value).toBeCloseTo(100 / 12, 6)
    })

    it("nietypowo niska sprawność: wynik policzony, ale ze statusem VALID_WITH_WARNINGS", () => {
      const result = calculateKalkulatoryPomocnicze({
        mode: "watt-to-amp",
        powerW: 100,
        voltageV: 12,
        efficiency: 0.4,
      })

      expect(result.status).toBe("VALID_WITH_WARNINGS")
      expect(result.warnings).toHaveLength(1)
      expect(result.warnings[0].code).toBe("SPRAWNOSC-NISKA")
    })

    it("błędne dane: moc niedodatnia → INVALID_INPUT, bez cichego zwrotu liczby", () => {
      const result = calculateKalkulatoryPomocnicze({
        mode: "watt-to-amp",
        powerW: -5,
        voltageV: 12,
      })

      expect(result.status).toBe("INVALID_INPUT")
      expect(result.warnings.some((w) => w.code === "POWERW-NIEDODATNI")).toBe(true)
    })

    it("błędny zakres: sprawność poza (0, 1] → INVALID_INPUT", () => {
      const result = calculateKalkulatoryPomocnicze({
        mode: "watt-to-amp",
        powerW: 100,
        voltageV: 12,
        efficiency: 1.5,
      })

      expect(result.status).toBe("INVALID_INPUT")
      expect(result.warnings.some((w) => w.code === "SPRAWNOSC-POZA-ZAKRESEM")).toBe(true)
    })
  })

  describe("ah-to-wh i wh-to-ah — konwersje", () => {
    it("100 Ah przy 12V = 1200 Wh", () => {
      const result = calculateKalkulatoryPomocnicze({
        mode: "ah-to-wh",
        capacityAh: 100,
        voltageV: 12,
      })

      expect(result.status).toBe("VALID")
      expect(result.unit).toBe("Wh")
      expect(result.value).toBeCloseTo(1200, 6)
    })

    it("1200 Wh przy 12V = 100 Ah (odwrotność powyższego)", () => {
      const result = calculateKalkulatoryPomocnicze({
        mode: "wh-to-ah",
        energyWh: 1200,
        voltageV: 12,
      })

      expect(result.status).toBe("VALID")
      expect(result.unit).toBe("Ah")
      expect(result.value).toBeCloseTo(100, 6)
    })
  })

  describe("runtime — szacowany czas pracy z baterii", () => {
    it("100 Ah / 12V / 50W przy domyślnej sprawności = 22,08 h", () => {
      const result = calculateKalkulatoryPomocnicze({
        mode: "runtime",
        capacityAh: 100,
        voltageV: 12,
        powerW: 50,
      })

      // wartość referencyjna: (100 * 12 * 0.92) / 50 = 22.08
      expect(result.status).toBe("VALID")
      expect(result.unit).toBe("h")
      expect(result.value).toBeCloseTo(22.08, 6)
    })
  })
})
