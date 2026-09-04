import { describe, expect, it } from "vitest"
import { calculateKoniecLadowania } from "../calculator"

describe("calculateKoniecLadowania", () => {
  it("prąd końcowy zgodny z przykładem źródła: 280Ah × 0,05C = 14A", () => {
    const result = calculateKoniecLadowania({
      pojemnoscAh: 280,
      napiecieAbsorpcjiV: 3.55,
      progKoncowyC: 0.05,
      aktualnyPradA: 20,
      aktualneNapiecieV: 3.55,
    })
    expect(result.value.pradKoncowyA).toBeCloseTo(14, 6)
  })

  it("faza CC — napięcie jeszcze poniżej absorpcji", () => {
    const result = calculateKoniecLadowania({
      pojemnoscAh: 280,
      napiecieAbsorpcjiV: 3.55,
      progKoncowyC: 0.05,
      aktualnyPradA: 50,
      aktualneNapiecieV: 3.2,
    })
    expect(result.value.faza).toBe("CC")
    expect(result.warnings[0].code).toBe("FAZA-CC")
  })

  it("faza CV-końcówka — napięcie absorpcji osiągnięte, prąd wciąż powyżej progu", () => {
    const result = calculateKoniecLadowania({
      pojemnoscAh: 280,
      napiecieAbsorpcjiV: 3.55,
      progKoncowyC: 0.05,
      aktualnyPradA: 20,
      aktualneNapiecieV: 3.55,
    })
    expect(result.value.faza).toBe("CV-koncowka")
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("FAZA-CV-KONCOWKA")
  })

  it("faza zakończone — prąd dokładnie na progu końcowym (14A, przykład ze źródła)", () => {
    const result = calculateKoniecLadowania({
      pojemnoscAh: 280,
      napiecieAbsorpcjiV: 3.55,
      progKoncowyC: 0.05,
      aktualnyPradA: 14,
      aktualneNapiecieV: 3.55,
    })
    expect(result.value.faza).toBe("zakonczone")
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].code).toBe("LADOWANIE-ZAKONCZONE")
  })

  it("INCOMPLETE — pola live jeszcze nie wpisane (null)", () => {
    const result = calculateKoniecLadowania({
      pojemnoscAh: 280,
      napiecieAbsorpcjiV: 3.55,
      progKoncowyC: 0.05,
      aktualnyPradA: null,
      aktualneNapiecieV: null,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna pojemność", () => {
    const result = calculateKoniecLadowania({
      pojemnoscAh: -10,
      napiecieAbsorpcjiV: 3.55,
      progKoncowyC: 0.05,
      aktualnyPradA: 20,
      aktualneNapiecieV: 3.55,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
