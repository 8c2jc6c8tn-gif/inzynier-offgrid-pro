import { describe, expect, it } from "vitest"
import { calculatePoborWlasnyBms } from "../calculator"

describe("calculatePoborWlasnyBms", () => {
  it("przykład ze źródła: 7W ciągle -> 61,32 kWh/rok (źródło: '61 kWh rocznie'); 1W uśpienie -> 0,024 kWh/dobę (zweryfikowane niezależnie w Pythonie)", () => {
    const result = calculatePoborWlasnyBms({ poborCiagleW: 7, poborUspienieW: 1 })
    expect(result.status).toBe("VALID")
    expect(result.value.strataRocznaCiagleKwh).toBeCloseTo(61.32, 9)
    expect(result.value.strataDoboweUspienieKwh).toBeCloseTo(0.024, 9)
  })

  it("roczna strata w uśpieniu i oszczędność roczna liczone spójnie", () => {
    const result = calculatePoborWlasnyBms({ poborCiagleW: 7, poborUspienieW: 1 })
    expect(result.value.strataRocznaUspienieKwh).toBeCloseTo(8.76, 9)
    expect(result.value.oszczednoscRocznaKwh).toBeCloseTo(52.56, 9)
  })

  it("dolna granica zakresu uśpienia (0,5W) -> 0,012 kWh/dobę", () => {
    const result = calculatePoborWlasnyBms({ poborCiagleW: 10, poborUspienieW: 0.5 })
    expect(result.value.strataDoboweUspienieKwh).toBeCloseTo(0.012, 9)
  })

  it("pobór ciągły ujemny -> status INVALID_INPUT", () => {
    const result = calculatePoborWlasnyBms({ poborCiagleW: -1, poborUspienieW: 1 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wpisanych danych (0) -> status INCOMPLETE", () => {
    const result = calculatePoborWlasnyBms({ poborCiagleW: 0, poborUspienieW: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey/params, nie message", () => {
    const result = calculatePoborWlasnyBms({ poborCiagleW: -1, poborUspienieW: 1 })
    expect(result.warnings[0].i18nKey).toBe("POBORCIAGLEW-UJEMNY")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })
})
