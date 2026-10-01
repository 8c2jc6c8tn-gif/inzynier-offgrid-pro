import { describe, expect, it } from "vitest"
import { calculateLaczeniePaneliPrzenosnych } from "../calculator"

const BAZA = {
  typ: "skladany" as const,
  liczbaPaneli: 2,
  takieSame: true,
  zlaczePaneli: "mc4" as const,
  zlaczeWejscia: "mc4" as const,
  maAdapter: false,
}

const kody = (w: ReturnType<typeof calculateLaczeniePaneliPrzenosnych>) => w.warnings.map((x) => x.code)

describe("calculateLaczeniePaneliPrzenosnych (M12/E10, dawne 8.12)", () => {
  it("przykład Treści: dwa takie same składane z MC4 → można, tylko ℹ️ odsyłacz do E39", () => {
    const w = calculateLaczeniePaneliPrzenosnych(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.moznaLaczyc).toBe(true)
    expect(kody(w)).toEqual(["LPP-SPRAWDZ-NAPIECIE"])
  })

  it("dwa powerbanki solarne → 🔴 LP-POWERBANK-NIE-LACZYC; jeden → bez stopu", () => {
    expect(kody(calculateLaczeniePaneliPrzenosnych({ ...BAZA, typ: "powerbank-solarny" }))).toContain("LPP-POWERBANK-NIE-LACZYC")
    expect(calculateLaczeniePaneliPrzenosnych({ ...BAZA, typ: "powerbank-solarny", liczbaPaneli: 1 }).value.moznaLaczyc).toBe(true)
  })

  it("wyjścia USB przy dwóch panelach → 🔴", () => {
    const w = calculateLaczeniePaneliPrzenosnych({ ...BAZA, zlaczePaneli: "usb", zlaczeWejscia: "usb" })
    expect(w.value.moznaLaczyc).toBe(false)
    expect(kody(w)).toContain("LPP-USB-NIE-LACZYC")
  })

  it("MC4 → XT60 bez adaptera → 🔴; z adapterem → 🟡", () => {
    const bez = calculateLaczeniePaneliPrzenosnych({ ...BAZA, zlaczeWejscia: "xt60" })
    expect(bez.warnings.find((x) => x.code === "LPP-ZLACZA-NIEZGODNE")!.level).toBe("critical")
    const z = calculateLaczeniePaneliPrzenosnych({ ...BAZA, zlaczeWejscia: "xt60", maAdapter: true })
    expect(z.value.moznaLaczyc).toBe(true)
    expect(kody(z)).toContain("LPP-ADAPTER-SPRAWDZ")
  })

  it("różne panele → 🟡; brak odpowiedzi o panelach przy 2 szt. → INCOMPLETE", () => {
    expect(kody(calculateLaczeniePaneliPrzenosnych({ ...BAZA, takieSame: false }))).toContain("LPP-ROZNE-PANELE")
    expect(calculateLaczeniePaneliPrzenosnych({ ...BAZA, takieSame: null }).status).toBe("INCOMPLETE")
    expect(calculateLaczeniePaneliPrzenosnych({ ...BAZA, liczbaPaneli: 1, takieSame: null }).status).toBe("VALID")
  })
})
