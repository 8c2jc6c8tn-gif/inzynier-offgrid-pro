import { describe, expect, it } from "vitest"
import { calculateSztywnienieIzolacji } from "../calculator"

const kody = (w: { warnings: { code: string }[] }) => w.warnings.map((x) => x.code)

describe("calculateSztywnienieIzolacji (M7/E13, dawne 6.17→7.17)", () => {
  it("przykład źródła: złączki PVC przy −15°C → 🔴, zapas −5 K", () => {
    const w = calculateSztywnienieIzolacji({ materialy: ["PVC"], temperaturaMinimalnaC: -15 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings[0]!.code).toBe("MROZ-PVC-PONIZEJ-PROGU")
    expect(w.warnings[0]!.level).toBe("critical")
    expect(w.value.oceny[0]!.zapasK).toBe(-5)
  })

  it("PVC dokładnie przy −10°C nie jest „poniżej progu”", () => {
    const w = calculateSztywnienieIzolacji({ materialy: ["PVC"], temperaturaMinimalnaC: -10 })
    expect(w.status).toBe("VALID")
    expect(w.warnings).toEqual([])
  })

  it("XLPE przy −30°C → OK; przy −45°C → tylko 🟡 (źródło nie wpisuje 🔴)", () => {
    expect(calculateSztywnienieIzolacji({ materialy: ["XLPE"], temperaturaMinimalnaC: -30 }).status).toBe("VALID")
    const w = calculateSztywnienieIzolacji({ materialy: ["XLPE"], temperaturaMinimalnaC: -45 })
    expect(w.warnings[0]!.level).toBe("warning")
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("guma i aluminium → tylko info, bez progu, status nie rośnie; kolejność stała", () => {
    const w = calculateSztywnienieIzolacji({ materialy: ["aluminium", "guma"], temperaturaMinimalnaC: -25 })
    expect(w.status).toBe("VALID")
    expect(kody(w)).toEqual(["MROZ-GUMA-BEZ-PROGU", "MROZ-ALUMINIUM-KURCZENIE"])
    expect(w.value.oceny.map((o) => o.progC)).toEqual([null, null])
  })

  it("mieszanka PVC + XLPE przy −20°C → 🔴 tylko dla PVC", () => {
    const w = calculateSztywnienieIzolacji({ materialy: ["XLPE", "PVC"], temperaturaMinimalnaC: -20 })
    expect(kody(w)).toEqual(["MROZ-PVC-PONIZEJ-PROGU"])
    expect(w.value.oceny.map((o) => o.material)).toEqual(["PVC", "XLPE"])
  })

  it("brak temperatury albo materiałów → INCOMPLETE; 0°C jest legalne", () => {
    expect(calculateSztywnienieIzolacji({ materialy: ["PVC"], temperaturaMinimalnaC: null }).status).toBe("INCOMPLETE")
    expect(calculateSztywnienieIzolacji({ materialy: [], temperaturaMinimalnaC: -5 }).status).toBe("INCOMPLETE")
    expect(calculateSztywnienieIzolacji({ materialy: ["PVC"], temperaturaMinimalnaC: 0 }).status).toBe("VALID")
  })
})
