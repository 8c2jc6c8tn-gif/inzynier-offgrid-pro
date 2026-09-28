import { describe, expect, it } from "vitest"
import { calculateWilgocMaleInstalacje } from "../calculator"
import type { WilgocMaleInstalacjeInput } from "../input"

const bazowe: WilgocMaleInstalacjeInput = { miejsce: "piwnica", narazoneNaWilgoc: true, ipKod: 55 }
const kody = (r: ReturnType<typeof calculateWilgocMaleInstalacje>) => r.warnings.map((w) => w.code)

describe("calculateWilgocMaleInstalacje (M12/E23, echo M4/E10)", () => {
  it("brak miejsca, odpowiedzi o wilgoci (garaż/piwnica) albo IP → INCOMPLETE, bez wartości domyślnych", () => {
    expect(calculateWilgocMaleInstalacje({ ...bazowe, miejsce: null }).status).toBe("INCOMPLETE")
    expect(calculateWilgocMaleInstalacje({ ...bazowe, narazoneNaWilgoc: null }).status).toBe("INCOMPLETE")
    expect(calculateWilgocMaleInstalacje({ ...bazowe, ipKod: 0 }).status).toBe("INCOMPLETE")
  })

  it("wilgoć + IP55 (granica z M4/E10) → bez twardego stopu, pełna lista osłon; 🟡 zalecane IP65 (D44)", () => {
    const r = calculateWilgocMaleInstalacje(bazowe)
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.value).toEqual({
      minimalneIp: 55,
      ipWystarczajace: true,
      zalecenia: ["obudowy-ip", "puszki-z-uszczelka", "przewody-w-peszlu", "osuszacz-pochlaniacz"],
    })
    expect(kody(r)).toEqual(["WMI-WILGOC-ZALECANE-IP65", "WMI-WILGOC-CICHY-ZABOJCA"])
    expect(r.warnings.some((w) => w.level === "critical")).toBe(false)
    expect(r.assumptions).toEqual([{ kod: "WMI-ZALOZENIE-PROG-Z-M4-E10", params: { min: 55 } }])
  })

  it("wilgoć + IP54 → tylko twardy stop IP-PONIZEJ-WYMAGANEGO (ten sam co M4/E10), bez zalecenia IP65", () => {
    const r = calculateWilgocMaleInstalacje({ ...bazowe, ipKod: 54 })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.value.ipWystarczajace).toBe(false)
    const stop = r.warnings.find((w) => w.code === "IP-PONIZEJ-WYMAGANEGO")
    expect(stop?.level).toBe("critical")
    expect(stop?.params).toEqual({ ip: 54, min: 55 })
    expect(kody(r)).not.toContain("WMI-WILGOC-ZALECANE-IP65")
  })

  it.each(["garaz", "piwnica"] as const)("%s z wilgocią: IP55–IP64 → 🟡 zalecane IP65 (D44), od IP65 → VALID", (miejsce) => {
    const r = calculateWilgocMaleInstalacje({ ...bazowe, miejsce, ipKod: 55 })
    const zalecenie = r.warnings.find((w) => w.code === "WMI-WILGOC-ZALECANE-IP65")
    expect(zalecenie?.level).toBe("warning")
    expect(zalecenie?.params).toEqual({ ip: 55, zalecane: 65 })
    expect(r.value.minimalneIp).toBe(55)
    const ok = calculateWilgocMaleInstalacje({ ...bazowe, miejsce, ipKod: 65 })
    expect(ok.status).toBe("VALID")
    expect(kody(ok)).toEqual(["WMI-WILGOC-CICHY-ZABOJCA"])
  })

  it.each(["namiot", "jacht"] as const)("%s: minimum IP65 🔴, IP65–IP66 🟡 zalecane IP67–IP68, od IP67 → VALID (D44)", (miejsce) => {
    const r = calculateWilgocMaleInstalacje({ ...bazowe, miejsce, ipKod: 55 })
    expect(r.value.minimalneIp).toBe(65)
    expect(r.value.ipWystarczajace).toBe(false)
    const ipKody = kody(r).filter((k) => k.includes("IP"))
    expect(ipKody).toEqual(["WMI-NAMIOT-JACHT-PONIZEJ-IP65"])
    expect(r.warnings[0].level).toBe("critical")
    expect(r.warnings[0].params).toEqual({ ip: 55, min: 65 })
    expect(r.assumptions).toEqual([{ kod: "WMI-ZALOZENIE-PROG-NAMIOT-JACHT", params: { min: 65, zalecane: 67 } }])
    expect(kody(calculateWilgocMaleInstalacje({ ...bazowe, miejsce, ipKod: 20 })).filter((k) => k.includes("IP"))).toEqual([
      "WMI-NAMIOT-JACHT-PONIZEJ-IP65",
    ])
    for (const ipKod of [65, 66]) {
      const w = calculateWilgocMaleInstalacje({ ...bazowe, miejsce, ipKod })
      expect(w.value.ipWystarczajace).toBe(true)
      expect(w.warnings.some((x) => x.level === "critical")).toBe(false)
      const zal = w.warnings.find((x) => x.code === "WMI-NAMIOT-JACHT-ZALECANE-IP67")
      expect(zal?.level).toBe("warning")
      expect(zal?.params).toEqual({ ip: ipKod, zalecane: 67 })
    }
    for (const ipKod of [67, 68]) {
      const ok = calculateWilgocMaleInstalacje({ ...bazowe, miejsce, ipKod })
      expect(ok.status).toBe("VALID")
      expect(kody(ok)).toEqual(["WMI-WILGOC-CICHY-ZABOJCA"])
    }
  })

  it.each(["namiot", "jacht"] as const)("%s zawsze traktowany jako wilgotny (D44) — odpowiedź „sucho” i brak odpowiedzi nie znoszą progu", (miejsce) => {
    for (const narazoneNaWilgoc of [false, null]) {
      const r = calculateWilgocMaleInstalacje({ miejsce, narazoneNaWilgoc, ipKod: 20 })
      expect(r.status).toBe("VALID_WITH_WARNINGS")
      expect(r.value.minimalneIp).toBe(65)
      expect(kody(r)).toContain("WMI-NAMIOT-JACHT-PONIZEJ-IP65")
    }
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
