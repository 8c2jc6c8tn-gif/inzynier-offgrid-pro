import { describe, expect, it } from "vitest"
import { calculateMonitorowanieIzolacjiImd } from "../calculator"

describe("calculateMonitorowanieIzolacjiImd", () => {
  it("układ nie-IT -> IMD niepotrzebny, VALID", () => {
    const result = calculateMonitorowanieIzolacjiImd({ ukladIt: false, maZainstalowanyImd: false, progAlarmuKOm: 0 })
    expect(result.status).toBe("VALID")
    expect(result.value.wymagany).toBe(false)
    expect(result.warnings[0].code).toBe("UKLAD-NIE-IT-IMD-NIEPOTRZEBNY")
  })

  it("KRYTYCZNE — układ IT bez zainstalowanego IMD", () => {
    const result = calculateMonitorowanieIzolacjiImd({ ukladIt: true, maZainstalowanyImd: false, progAlarmuKOm: 0 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.wymagany).toBe(true)
    expect(result.warnings.some((w) => w.code === "UKLAD-IT-BEZ-IMD" && w.level === "critical")).toBe(true)
  })

  it("układ IT, IMD zainstalowany, próg podany -> VALID", () => {
    const result = calculateMonitorowanieIzolacjiImd({ ukladIt: true, maZainstalowanyImd: true, progAlarmuKOm: 50 })
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].code).toBe("IMD-ZAINSTALOWANY-POPRAWNIE")
  })

  it("INCOMPLETE — układ IT, IMD zainstalowany, ale próg alarmu niepodany", () => {
    const result = calculateMonitorowanieIzolacjiImd({ ukladIt: true, maZainstalowanyImd: true, progAlarmuKOm: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemny próg alarmu", () => {
    const result = calculateMonitorowanieIzolacjiImd({ ukladIt: true, maZainstalowanyImd: true, progAlarmuKOm: -5 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
