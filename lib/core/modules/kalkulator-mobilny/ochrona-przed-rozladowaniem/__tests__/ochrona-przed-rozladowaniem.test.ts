import { describe, expect, it } from "vitest"
import { KALIBRACJA_NAPIECIE_OGNIWO_MAX_V } from "@/lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc/constants"
import { calculateOchronaPrzedRozladowaniem } from "../calculator"
import type { OchronaPrzedRozladowaniemInput } from "../input"

const BAZA: OchronaPrzedRozladowaniemInput = {
  chemia: "AGM",
  napiecieZnamionoweV: 12,
  maDozownik: true,
  odbiornikMaWlasneZabezpieczenie: false,
}

const kody = (a: { assumptions: unknown[] }) =>
  a.assumptions.map((x) => (typeof x === "string" ? x : (x as { kod: string }).kod))

describe("calculateOchronaPrzedRozladowaniem (M12/E9, dawne 8.11)", () => {
  it("przykład źródła: AGM 12 V → 11,5 V; LiFePO4 12 V → 11,0 V", () => {
    const agm = calculateOchronaPrzedRozladowaniem(BAZA)
    expect(agm.status).toBe("VALID")
    expect(agm.value.progOdcieciaV).toBe(11.5)
    expect(agm.value.liczbaOgniw).toBe(6)
    const lfp = calculateOchronaPrzedRozladowaniem({ ...BAZA, chemia: "LiFePO4" })
    expect(lfp.value.progOdcieciaV).toBe(11)
    expect(lfp.value.progNaOgniwoV).toBeCloseTo(2.75, 12)
  })

  it("LiFePO4 48 V (16S) → 44,0 V = 2,75 V/ogniwo, ten sam punkt co kalibracja M4/E31", () => {
    const w = calculateOchronaPrzedRozladowaniem({ ...BAZA, chemia: "LiFePO4", napiecieZnamionoweV: 48 })
    expect(w.value.progOdcieciaV).toBeCloseTo(44, 12)
    expect(w.value.liczbaOgniw).toBe(16)
    expect(w.value.progNaOgniwoV).toBeCloseTo(KALIBRACJA_NAPIECIE_OGNIWO_MAX_V, 12)
    expect(kody(w)).toEqual(["LVD-ZALOZENIE-SKALOWANIE-SZEREGOWE", "LVD-ZALOZENIE-SPOJNE-Z-M4-E31"])
  })

  it("AGM 24 V → 23,0 V (dwa akumulatory 12 V w szeregu), 12 ogniw", () => {
    const w = calculateOchronaPrzedRozladowaniem({ ...BAZA, napiecieZnamionoweV: 24 })
    expect(w.value.progOdcieciaV).toBeCloseTo(23, 12)
    expect(w.value.liczbaOgniw).toBe(12)
    expect(w.value.progNaOgniwoV).toBeCloseTo(23 / 12, 12)
  })

  it("🔴 AGM bez dozownika i bez zabezpieczenia odbiornika → critical, VALID_WITH_WARNINGS", () => {
    const w = calculateOchronaPrzedRozladowaniem({ ...BAZA, maDozownik: false })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["LVD-BRAK-OCHRONY-OLOWIOWY", "critical"]])
  })

  it("brak dozownika, ale odbiornik ma własne zabezpieczenie → bez twardego stopu", () => {
    const w = calculateOchronaPrzedRozladowaniem({ ...BAZA, maDozownik: false, odbiornikMaWlasneZabezpieczenie: true })
    expect(w.status).toBe("VALID")
    expect(w.warnings).toEqual([])
  })

  it("LiFePO4 bez dozownika → bez twardego stopu (źródło stawia 🔴 tylko dla kwasowego/AGM)", () => {
    const w = calculateOchronaPrzedRozladowaniem({ ...BAZA, chemia: "LiFePO4", maDozownik: false })
    expect(w.status).toBe("VALID")
  })

  it("kwasowy: próg null (źródło nie podaje), info nie podnosi statusu (Dyrektywa #6); 🔴 nadal działa", () => {
    const zOchrona = calculateOchronaPrzedRozladowaniem({ ...BAZA, chemia: "kwasowy" })
    expect(zOchrona.value.progOdcieciaV).toBeNull()
    expect(zOchrona.value.progNaOgniwoV).toBeNull()
    expect(zOchrona.status).toBe("VALID")
    expect(zOchrona.warnings.map((x) => x.level)).toEqual(["info"])
    const bezOchrony = calculateOchronaPrzedRozladowaniem({ ...BAZA, chemia: "kwasowy", maDozownik: false })
    expect(bezOchrony.status).toBe("VALID_WITH_WARNINGS")
    expect(bezOchrony.warnings[0]!.code).toBe("LVD-BRAK-OCHRONY-OLOWIOWY")
  })

  it("brak chemii lub napięcia → INCOMPLETE", () => {
    expect(calculateOchronaPrzedRozladowaniem({ ...BAZA, chemia: null }).status).toBe("INCOMPLETE")
    expect(calculateOchronaPrzedRozladowaniem({ ...BAZA, napiecieZnamionoweV: 0 }).status).toBe("INCOMPLETE")
  })
})
