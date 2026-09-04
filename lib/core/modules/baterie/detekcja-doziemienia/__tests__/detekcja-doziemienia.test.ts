import { describe, expect, it } from "vitest"
import { calculateDetekcjaDoziemienia } from "../calculator"

describe("calculateDetekcjaDoziemienia", () => {
  it("VALID_WITH_WARNINGS (twardy stop) — brak IMD i różnicówki DC", () => {
    const result = calculateDetekcjaDoziemienia({ maMonitorIzolacji: false, maRoznicowkeDc: false })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zabezpieczony).toBe(false)
    const w = result.warnings.find((w) => w.code === "BRAK-ZABEZPIECZENIA-DOZIEMIENIA")
    expect(w?.level).toBe("critical")
  })

  it("VALID — sam IMD wystarcza", () => {
    const result = calculateDetekcjaDoziemienia({ maMonitorIzolacji: true, maRoznicowkeDc: false })
    expect(result.status).toBe("VALID")
    expect(result.value.zabezpieczony).toBe(true)
  })

  it("VALID — sama różnicówka DC wystarcza", () => {
    const result = calculateDetekcjaDoziemienia({ maMonitorIzolacji: false, maRoznicowkeDc: true })
    expect(result.status).toBe("VALID")
    expect(result.value.zabezpieczony).toBe(true)
  })

  it("VALID — oba zabezpieczenia obecne", () => {
    const result = calculateDetekcjaDoziemienia({ maMonitorIzolacji: true, maRoznicowkeDc: true })
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].code).toBe("ZABEZPIECZENIE-OBECNE")
  })
})
