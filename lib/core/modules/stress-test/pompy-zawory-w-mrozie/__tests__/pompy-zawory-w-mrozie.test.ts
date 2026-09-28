import { describe, expect, it } from "vitest"
import { calculatePompyZaworyWMrozie } from "../calculator"
import type { ElementArmatury, PompyZaworyWMrozieInput } from "../input"

const pompa: ElementArmatury = { id: "1", nazwa: "Pompa obiegowa", typ: "pompa", minTempPracyC: -10 }
const BAZA: PompyZaworyWMrozieInput = {
  temperaturaMiejscaC: -15,
  elementy: [pompa],
  maZaworZewnetrzny: false,
  zaworZewnetrznyOprozniony: false,
}

describe("calculatePompyZaworyWMrozie (M7/E21, dawne 6.32)", () => {
  it("przykład źródła: pompa cyrkulacyjna w garażu przy −15°C poniżej zakresu → 🟡, zapas −5 K", () => {
    const w = calculatePompyZaworyWMrozie(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings[0]!.level).toBe("warning")
    expect(w.warnings[0]!.i18nKey).toBe("POMPY-PONIZEJ-MIN-POMPA")
    expect(w.value.oceny[0]!.zapasK).toBe(-5)
    expect(w.value.liczbaPonizejMin).toBe(1)
  })

  it("temperatura równa minimum → w zakresie, VALID", () => {
    const w = calculatePompyZaworyWMrozie({ ...BAZA, temperaturaMiejscaC: -10 })
    expect(w.status).toBe("VALID")
    expect(w.warnings).toEqual([])
  })

  it("zawór zewnętrzny nieopróżniony → 🟡; opróżniony → bez ostrzeżenia", () => {
    const zawor = { ...BAZA, temperaturaMiejscaC: null, elementy: [], maZaworZewnetrzny: true }
    const w = calculatePompyZaworyWMrozie(zawor)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => x.code)).toEqual(["POMPY-ZAWOR-ZEWNETRZNY"])
    expect(calculatePompyZaworyWMrozie({ ...zawor, zaworZewnetrznyOprozniony: true }).status).toBe("VALID")
  })

  it("brak danych z karty → info, status nie rośnie; pusta nazwa → „element N”", () => {
    const w = calculatePompyZaworyWMrozie({ ...BAZA, elementy: [{ id: "2", nazwa: "", typ: "silownik", minTempPracyC: null }] })
    expect(w.status).toBe("VALID")
    expect(w.warnings[0]!.code).toBe("POMPY-BRAK-MIN-TEMP")
    expect(w.value.oceny[0]!.nazwa).toBe("element 1")
  })

  it("brak temperatury i brak zaworu zewnętrznego → INCOMPLETE", () => {
    expect(calculatePompyZaworyWMrozie({ ...BAZA, temperaturaMiejscaC: null }).status).toBe("INCOMPLETE")
    expect(calculatePompyZaworyWMrozie({ ...BAZA, elementy: [] }).status).toBe("INCOMPLETE")
  })
})
