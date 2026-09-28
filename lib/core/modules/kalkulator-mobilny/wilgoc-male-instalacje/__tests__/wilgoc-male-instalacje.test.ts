import { describe, expect, it } from "vitest"
import { calculateWilgocMaleInstalacje } from "../calculator"
import type { WilgocMaleInstalacjeInput } from "../input"

const bazowe: WilgocMaleInstalacjeInput = { miejsce: "piwnica", narazoneNaWilgoc: true, ipKod: 55 }
const kody = (r: ReturnType<typeof calculateWilgocMaleInstalacje>) => r.warnings.map((w) => w.code)

describe("calculateWilgocMaleInstalacje (M12/E23, echo M4/E10)", () => {
  it("brak miejsca, odpowiedzi o wilgoci albo IP → INCOMPLETE, bez wartości domyślnych", () => {
    expect(calculateWilgocMaleInstalacje({ ...bazowe, miejsce: null }).status).toBe("INCOMPLETE")
    expect(calculateWilgocMaleInstalacje({ ...bazowe, narazoneNaWilgoc: null }).status).toBe("INCOMPLETE")
    expect(calculateWilgocMaleInstalacje({ ...bazowe, ipKod: 0 }).status).toBe("INCOMPLETE")
  })

  it("wilgoć + IP55 (granica z M4/E10) → VALID, pełna lista osłon ze źródła, bez twardego stopu", () => {
    const r = calculateWilgocMaleInstalacje(bazowe)
    expect(r.status).toBe("VALID")
    expect(r.value).toEqual({
      minimalneIp: 55,
      ipWystarczajace: true,
      zalecenia: ["obudowy-ip", "puszki-z-uszczelka", "przewody-w-peszlu", "osuszacz-pochlaniacz"],
    })
    expect(kody(r)).toEqual(["WMI-WILGOC-CICHY-ZABOJCA"])
    expect(r.assumptions).toEqual([{ kod: "WMI-ZALOZENIE-PROG-Z-M4-E10", params: { min: 55 } }])
  })

  it("wilgoć + IP54 → twardy stop IP-PONIZEJ-WYMAGANEGO (ten sam co M4/E10)", () => {
    const r = calculateWilgocMaleInstalacje({ ...bazowe, ipKod: 54 })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.value.ipWystarczajace).toBe(false)
    const stop = r.warnings.find((w) => w.code === "IP-PONIZEJ-WYMAGANEGO")
    expect(stop?.level).toBe("critical")
    expect(stop?.params).toEqual({ ip: 54, min: 55 })
  })

  it("wilgotny garaż poniżej IP65 → info z przykładu źródła; od IP65 bez tej informacji", () => {
    const r = calculateWilgocMaleInstalacje({ ...bazowe, miejsce: "garaz", ipKod: 55 })
    expect(r.warnings.find((w) => w.code === "WMI-GARAZ-ZALECANE-IP65")?.level).toBe("info")
    expect(kody(calculateWilgocMaleInstalacje({ ...bazowe, miejsce: "garaz", ipKod: 65 }))).not.toContain("WMI-GARAZ-ZALECANE-IP65")
    expect(kody(calculateWilgocMaleInstalacje({ ...bazowe, miejsce: "piwnica", ipKod: 55 }))).not.toContain("WMI-GARAZ-ZALECANE-IP65")
  })

  it("miejsce nienarażone na wilgoć → próg IP nie dotyczy, także dla IP20", () => {
    const r = calculateWilgocMaleInstalacje({ miejsce: "garaz", narazoneNaWilgoc: false, ipKod: 20 })
    expect(r.status).toBe("VALID")
    expect(r.value).toEqual({ minimalneIp: null, ipWystarczajace: true, zalecenia: [] })
    expect(r.warnings).toEqual([])
  })

  it("i18n (17.2): ostrzeżenia bez tekstu wprost, tylko i18nKey", () => {
    const r = calculateWilgocMaleInstalacje({ ...bazowe, miejsce: "garaz", ipKod: 20 })
    expect(r.warnings.every((w) => w.message === undefined && typeof w.i18nKey === "string")).toBe(true)
  })
})
