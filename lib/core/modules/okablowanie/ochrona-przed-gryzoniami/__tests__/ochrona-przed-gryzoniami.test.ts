import { describe, expect, it } from "vitest"
import { calculateOchronaPrzedGryzoniami } from "../calculator"

describe("calculateOchronaPrzedGryzoniami", () => {
  it("wysokie ryzyko -> peszel metalowy spiralny", () => {
    const result = calculateOchronaPrzedGryzoniami({ poziomRyzyka: "wysokie" })
    expect(result.status).toBe("VALID")
    expect(result.value.zalecanaOslona).toBe("Peszel metalowy spiralny")
  })

  it("niskie ryzyko -> peszel plastikowy wystarcza", () => {
    const result = calculateOchronaPrzedGryzoniami({ poziomRyzyka: "niskie" })
    expect(result.value.zalecanaOslona).toBe("Peszel plastikowy (standardowy)")
  })

  it("INCOMPLETE — poziom ryzyka niewybrany", () => {
    const result = calculateOchronaPrzedGryzoniami({ poziomRyzyka: null })
    expect(result.status).toBe("INCOMPLETE")
  })
})
