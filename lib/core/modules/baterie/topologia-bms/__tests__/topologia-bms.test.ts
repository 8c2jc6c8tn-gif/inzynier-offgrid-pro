import { describe, expect, it } from "vitest"
import { calculateTopologiaBms } from "../calculator"

describe("calculateTopologiaBms", () => {
  it("VALID_WITH_WARNINGS — przykład ze źródła: Common Port 100A, falownik 150A przy rozruchu (niewystarczający)", () => {
    const result = calculateTopologiaBms({ bmsCommonPortA: 100, falownikPradRozruchuA: 150 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.commonPortWystarcza).toBe(false)
    expect(result.warnings[0].code).toBe("COMMON-PORT-NIEWYSTARCZAJACY")
  })

  it("VALID — Common Port wystarcza", () => {
    const result = calculateTopologiaBms({ bmsCommonPortA: 200, falownikPradRozruchuA: 150 })
    expect(result.status).toBe("VALID")
    expect(result.value.commonPortWystarcza).toBe(true)
    expect(result.warnings[0].code).toBe("COMMON-PORT-WYSTARCZAJACY")
  })

  it("granica: Common Port dokładnie równy prądowi rozruchu — wystarcza (>=)", () => {
    const result = calculateTopologiaBms({ bmsCommonPortA: 150, falownikPradRozruchuA: 150 })
    expect(result.value.commonPortWystarcza).toBe(true)
    expect(result.status).toBe("VALID")
  })

  it("INCOMPLETE — pola jeszcze nie wpisane (0)", () => {
    const result = calculateTopologiaBms({ bmsCommonPortA: 0, falownikPradRozruchuA: 150 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemny prąd", () => {
    const result = calculateTopologiaBms({ bmsCommonPortA: -50, falownikPradRozruchuA: 150 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
