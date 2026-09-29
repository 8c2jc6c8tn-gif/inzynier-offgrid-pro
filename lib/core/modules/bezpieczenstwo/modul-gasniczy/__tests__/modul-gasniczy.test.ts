import { describe, expect, it } from "vitest"
import { calculateModulGasniczy } from "../calculator"
import type { ModulGasniczyInput } from "../input"

const OK: ModulGasniczyInput = {
  srodek: "mgla-wodna",
  magazynWStrefie: "lifepo4",
  liczbaCzujnikowPotwierdzenia: 2,
  odcinaWentylacjeIKlapy: true,
  stanModulu: "sprawny",
}
const poziomy = (i: ModulGasniczyInput) => calculateModulGasniczy(i).warnings.map((w) => [w.code, w.level])

describe("calculateModulGasniczy (M8/E4, dawne 11.52 + 12.51)", () => {
  it("mgła wodna w strefie LiFePO4, 2 czujniki, odcięcie wentylacji, moduł sprawny → VALID", () => {
    const w = calculateModulGasniczy(OK)
    expect(w.status).toBe("VALID")
    expect(w.value).toEqual({ srodekWlasciwyDlaLifepo4: true, liczbaBrakow: 0 })
    expect(calculateModulGasniczy({ ...OK, srodek: "specjalny-magazyn-energii" }).status).toBe("VALID")
  })

  it("proszek i CO2 w strefie LiFePO4 → 🔴 (nie gaszą reakcji ogniwa)", () => {
    expect(poziomy({ ...OK, srodek: "proszek" })).toEqual([["GASZ-SRODEK-NIESKUTECZNY-LIFEPO4", "critical"], ["GASZ-PROPOZYCJA-LIFEPO4", "info"]])
    expect(poziomy({ ...OK, srodek: "co2" })).toEqual([["GASZ-SRODEK-NIESKUTECZNY-LIFEPO4", "critical"], ["GASZ-PROPOZYCJA-LIFEPO4", "info"]])
    expect(calculateModulGasniczy({ ...OK, srodek: "co2" }).value.srodekWlasciwyDlaLifepo4).toBe(false)
  })

  it("gaz obojętny / aerozol w strefie LiFePO4 → 🟡 (D54: potwierdzone) + ℹ️ propozycja środków i chłodzenia ogniw", () => {
    expect(poziomy({ ...OK, srodek: "gaz-obojetny" })).toEqual([["GASZ-SRODEK-NIEPOTWIERDZONY-LIFEPO4", "warning"], ["GASZ-PROPOZYCJA-LIFEPO4", "info"]])
    expect(poziomy({ ...OK, srodek: "aerozol" })).toEqual([["GASZ-SRODEK-NIEPOTWIERDZONY-LIFEPO4", "warning"], ["GASZ-PROPOZYCJA-LIFEPO4", "info"]])
  })

  it("strefa bez magazynu → proszek bez ostrzeżenia; inna chemia → info", () => {
    expect(poziomy({ ...OK, srodek: "proszek", magazynWStrefie: "brak" })).toEqual([])
    expect(poziomy({ ...OK, srodek: "proszek", magazynWStrefie: "inna" })).toEqual([["GASZ-INNA-CHEMIA", "info"]])
    expect(calculateModulGasniczy({ ...OK, magazynWStrefie: "brak" }).value.srodekWlasciwyDlaLifepo4).toBeNull()
  })

  it("moduł rozładowany → 🔴; jeden czujnik i brak odcięcia wentylacji → 🟡", () => {
    const w = calculateModulGasniczy({ ...OK, stanModulu: "rozladowany", liczbaCzujnikowPotwierdzenia: 1, odcinaWentylacjeIKlapy: false })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["GASZ-MODUL-ROZLADOWANY", "critical"],
      ["GASZ-ZA-MALO-CZUJNIKOW", "warning"],
      ["GASZ-BRAK-ODCIECIA-WENTYLACJI", "warning"],
    ])
    expect(w.value.liczbaBrakow).toBe(3)
  })

  it("brak danych → INCOMPLETE; 0 albo 1,5 czujnika → INVALID_INPUT", () => {
    expect(calculateModulGasniczy({ ...OK, srodek: null }).status).toBe("INCOMPLETE")
    expect(calculateModulGasniczy({ ...OK, liczbaCzujnikowPotwierdzenia: null }).status).toBe("INCOMPLETE")
    expect(calculateModulGasniczy({ ...OK, liczbaCzujnikowPotwierdzenia: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateModulGasniczy({ ...OK, liczbaCzujnikowPotwierdzenia: 1.5 }).status).toBe("INVALID_INPUT")
  })
})
