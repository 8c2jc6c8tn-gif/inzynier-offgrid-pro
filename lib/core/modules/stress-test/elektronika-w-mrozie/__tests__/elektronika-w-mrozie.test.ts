import { describe, expect, it } from "vitest"
import { calculateElektronikaWMrozie } from "../calculator"
import type { UrzadzenieElektroniczne } from "../input"

const bms: UrzadzenieElektroniczne = { id: "1", nazwa: "BMS", typ: "BMS", minTempPracyC: -10 }

describe("calculateElektronikaWMrozie (M7/E19, dawne 6.29→7.27)", () => {
  it("przykład źródła: BMS min −10°C w garażu przy −20°C → 🔴, zapas −10 K", () => {
    const w = calculateElektronikaWMrozie({ temperaturaMiejscaC: -20, urzadzenia: [bms] })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings[0]!.code).toBe("ELEKTRONIKA-BMS-PONIZEJ-MIN")
    expect(w.warnings[0]!.level).toBe("critical")
    expect(w.value.oceny[0]!.zapasK).toBe(-10)
    expect(w.value.liczbaPonizejMin).toBe(1)
  })

  it("BMS w piwnicy przy +5°C → OK; temperatura równa minimum też OK", () => {
    expect(calculateElektronikaWMrozie({ temperaturaMiejscaC: 5, urzadzenia: [bms] }).status).toBe("VALID")
    expect(calculateElektronikaWMrozie({ temperaturaMiejscaC: -10, urzadzenia: [bms] }).warnings).toEqual([])
  })

  it("wyświetlacz poniżej zakresu → 🟡 z kluczem skutku dla typu", () => {
    const w = calculateElektronikaWMrozie({
      temperaturaMiejscaC: -25,
      urzadzenia: [{ id: "2", nazwa: "Panel LCD", typ: "wyswietlacz", minTempPracyC: -20 }],
    })
    expect(w.warnings[0]!.level).toBe("warning")
    expect(w.warnings[0]!.i18nKey).toBe("ELEKTRONIKA-PONIZEJ-MIN-WYSWIETLACZ")
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("D31: przetwornica/falownik poniżej zakresu → 🔴; regulator ładowania → 🟡", () => {
    const w = calculateElektronikaWMrozie({
      temperaturaMiejscaC: -25,
      urzadzenia: [
        { id: "4", nazwa: "Falownik", typ: "przetwornica", minTempPracyC: -20 },
        { id: "5", nazwa: "MPPT", typ: "regulator", minTempPracyC: -20 },
      ],
    })
    expect(w.warnings.map((x) => [x.code, x.level, x.i18nKey])).toEqual([
      ["ELEKTRONIKA-PRZETWORNICA-PONIZEJ-MIN", "critical", "ELEKTRONIKA-PONIZEJ-MIN-PRZETWORNICA"],
      ["ELEKTRONIKA-PONIZEJ-MIN", "warning", "ELEKTRONIKA-PONIZEJ-MIN-REGULATOR"],
    ])
    expect(w.value.liczbaPonizejMin).toBe(2)
  })

  it("brak danych z karty → info, status nie rośnie; pusta nazwa → „urządzenie N”", () => {
    const w = calculateElektronikaWMrozie({
      temperaturaMiejscaC: -30,
      urzadzenia: [{ id: "3", nazwa: " ", typ: "czujnik", minTempPracyC: null }],
    })
    expect(w.status).toBe("VALID")
    expect(w.warnings[0]!.code).toBe("ELEKTRONIKA-BRAK-MIN-TEMP")
    expect(w.value.oceny[0]!.nazwa).toBe("urządzenie 1")
  })

  it("brak temperatury albo urządzeń → INCOMPLETE", () => {
    expect(calculateElektronikaWMrozie({ temperaturaMiejscaC: null, urzadzenia: [bms] }).status).toBe("INCOMPLETE")
    expect(calculateElektronikaWMrozie({ temperaturaMiejscaC: -5, urzadzenia: [] }).status).toBe("INCOMPLETE")
  })
})
