import { describe, expect, it } from "vitest"
import { calculateRyzykoZamarzniecia } from "../calculator"
import type { InstalacjaGruntowa, RyzykoZamarznieciaInput } from "../input"

const kabel: InstalacjaGruntowa = { id: "1", nazwa: "Kabel ziemny", typ: "kabel", glebokoscCm: 40 }
const BAZA: RyzykoZamarznieciaInput = { glebokoscPrzemarzaniaCm: 80, instalacje: [kabel], metodaRozmrazania: "nie-dotyczy" }

describe("calculateRyzykoZamarzniecia (M7/E22 tryb grunt, dawne 6.35 + 6.37)", () => {
  it("przykład źródła: kabel 40 cm, strefa 80 cm → 🔴, zapas −40 cm", () => {
    const w = calculateRyzykoZamarzniecia(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings[0]!.code).toBe("ZAMARZ-PLYCEJ-NIZ-PRZEMARZANIE")
    expect(w.warnings[0]!.level).toBe("critical")
    expect(w.value.oceny[0]!.zapasCm).toBe(-40)
    expect(w.value.liczbaWStrefie).toBe(1)
  })

  it("kabel dokładnie na granicy strefy (80 cm) → OK", () => {
    const w = calculateRyzykoZamarzniecia({ ...BAZA, instalacje: [{ ...kabel, glebokoscCm: 80 }] })
    expect(w.status).toBe("VALID")
    expect(w.warnings).toEqual([])
  })

  it("rura wodna 90 cm przy strefie 80 cm → poza strefą, ale bez zapasu 20 cm (Biblia) → 🟡", () => {
    const w = calculateRyzykoZamarzniecia({ ...BAZA, instalacje: [{ ...kabel, typ: "rura-wodna", glebokoscCm: 90 }] })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["ZAMARZ-RURA-BEZ-ZAPASU", "warning"]])
    expect(w.value.oceny[0]!.wymaganaCm).toBe(100)
    expect(w.value.oceny[0]!.wStrefiePrzemarzania).toBe(false)
    expect(calculateRyzykoZamarzniecia({ ...BAZA, instalacje: [{ ...kabel, typ: "rura-wodna", glebokoscCm: 100 }] }).status).toBe(
      "VALID",
    )
  })

  it("rozmrażanie otwartym ogniem → 🔴 nawet bez danych gruntu", () => {
    const w = calculateRyzykoZamarzniecia({ glebokoscPrzemarzaniaCm: null, instalacje: [], metodaRozmrazania: "otwarty-ogien" })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => x.code)).toEqual(["ZAMARZ-ROZMRAZANIE-OGIEN"])
  })

  it("brak głębokości ułożenia → info; pusta nazwa → „instalacja N”", () => {
    const w = calculateRyzykoZamarzniecia({ ...BAZA, instalacje: [{ ...kabel, nazwa: "", glebokoscCm: null }] })
    expect(w.status).toBe("VALID")
    expect(w.warnings[0]!.code).toBe("ZAMARZ-BRAK-GLEBOKOSCI")
    expect(w.value.oceny[0]!.nazwa).toBe("instalacja 1")
  })

  it("brak strefy przemarzania lub instalacji (i bez ognia) → INCOMPLETE; ujemna głębokość → INVALID_INPUT", () => {
    expect(calculateRyzykoZamarzniecia({ ...BAZA, glebokoscPrzemarzaniaCm: null }).status).toBe("INCOMPLETE")
    expect(calculateRyzykoZamarzniecia({ ...BAZA, instalacje: [] }).status).toBe("INCOMPLETE")
    const w = calculateRyzykoZamarzniecia({ ...BAZA, instalacje: [{ ...kabel, glebokoscCm: -5 }] })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]!.field).toBe("instalacje.0.glebokoscCm")
  })
})
