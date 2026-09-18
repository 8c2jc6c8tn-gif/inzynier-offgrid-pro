import { describe, expect, it } from "vitest"
import { calculateMixingRownolegle } from "../calculator"

describe("calculateMixingRownolegle", () => {
  it("VALID — ta sama chemia, mała różnica napięć, prąd wyrównawczy i udziały policzone", () => {
    const result = calculateMixingRownolegle({
      chemia1: "lifepo4",
      chemia2: "lifepo4",
      napiecieNominalneV1: 13.3,
      napiecieNominalneV2: 13.2,
      rezystancjaWewnetrznaMOhm1: 10,
      rezystancjaWewnetrznaMOhm2: 15,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.roznicaNapiecV).toBeCloseTo(0.1, 10)
    expect(result.value.iWyrownawczyA).toBeCloseTo(4.0, 10)
    expect(result.value.udzialPradu1Pct).toBeCloseTo(60, 10)
    expect(result.value.udzialPradu2Pct).toBeCloseTo(40, 10)
    expect(result.value.chemiaZgodna).toBe(true)
    expect(result.value.napieciaOk).toBe(true)
    expect(result.warnings).toHaveLength(0)
  })

  it("granica: różnica napięć dokładnie 0,2V jest jeszcze dopuszczalna (nie > 0,2)", () => {
    const result = calculateMixingRownolegle({
      chemia1: "lifepo4",
      chemia2: "lifepo4",
      napiecieNominalneV1: 12.0,
      napiecieNominalneV2: 11.8,
      rezystancjaWewnetrznaMOhm1: 10,
      rezystancjaWewnetrznaMOhm2: 10,
    })
    expect(result.value.napieciaOk).toBe(true)
    expect(result.status).toBe("VALID")
  })

  it("VALID_WITH_WARNINGS — różnica napięć powyżej 0,2V (ryzyko iskrzenia)", () => {
    const result = calculateMixingRownolegle({
      chemia1: "lifepo4",
      chemia2: "lifepo4",
      napiecieNominalneV1: 12.0,
      napiecieNominalneV2: 11.5,
      rezystancjaWewnetrznaMOhm1: 10,
      rezystancjaWewnetrznaMOhm2: 10,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.napieciaOk).toBe(false)
    expect(result.warnings.some((w) => w.code === "ROZNICA-NAPIEC-ZA-DUZA")).toBe(true)
  })

  it("VALID_WITH_WARNINGS — różna chemia ogniw (mieszanie bez izolacji)", () => {
    const result = calculateMixingRownolegle({
      chemia1: "lifepo4",
      chemia2: "agm",
      napiecieNominalneV1: 12.8,
      napiecieNominalneV2: 12.7,
      rezystancjaWewnetrznaMOhm1: 10,
      rezystancjaWewnetrznaMOhm2: 30,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.chemiaZgodna).toBe(false)
    expect(result.warnings.some((w) => w.code === "INNA-CHEMIA-BEZ-IZOLACJI")).toBe(true)
  })

  it("INCOMPLETE — pola liczbowe jeszcze nie wpisane (0)", () => {
    const result = calculateMixingRownolegle({
      chemia1: "lifepo4",
      chemia2: "lifepo4",
      napiecieNominalneV1: 0,
      napiecieNominalneV2: 13.2,
      rezystancjaWewnetrznaMOhm1: 10,
      rezystancjaWewnetrznaMOhm2: 15,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INCOMPLETE — chemia jeszcze nie wybrana", () => {
    const result = calculateMixingRownolegle({
      chemia1: "",
      chemia2: "lifepo4",
      napiecieNominalneV1: 13.3,
      napiecieNominalneV2: 13.2,
      rezystancjaWewnetrznaMOhm1: 10,
      rezystancjaWewnetrznaMOhm2: 15,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna rezystancja", () => {
    const result = calculateMixingRownolegle({
      chemia1: "lifepo4",
      chemia2: "lifepo4",
      napiecieNominalneV1: 13.3,
      napiecieNominalneV2: 13.2,
      rezystancjaWewnetrznaMOhm1: -5,
      rezystancjaWewnetrznaMOhm2: 15,
    })
    expect(result.status).toBe("INVALID_INPUT")
    expect(result.warnings.some((w) => w.code === "REZYSTANCJAWEWNETRZNAMOHM1-UJEMNA")).toBe(true)
  })

  it("i18n (17.2): ostrzeżenia i assumption zwracają i18nKey/kod, nie gotowy tekst", () => {
    const roznica = calculateMixingRownolegle({
      chemia1: "lifepo4",
      chemia2: "lifepo4",
      napiecieNominalneV1: 12.0,
      napiecieNominalneV2: 11.5,
      rezystancjaWewnetrznaMOhm1: 10,
      rezystancjaWewnetrznaMOhm2: 10,
    })
    const roznicaWarning = roznica.warnings.find((w) => w.code === "ROZNICA-NAPIEC-ZA-DUZA")
    expect(roznicaWarning?.i18nKey).toBe("ROZNICA-NAPIEC-ZA-DUZA")
    expect(roznicaWarning?.params).toEqual({ roznica: "0.50", prog: 0.2 })
    expect(roznicaWarning?.message).toBeUndefined()
    expect(roznica.assumptions).toEqual([{ kod: "PRAD-WYROWNAWCZY-CHWILA-POLACZENIA" }])

    const chemia = calculateMixingRownolegle({
      chemia1: "lifepo4",
      chemia2: "agm",
      napiecieNominalneV1: 12.8,
      napiecieNominalneV2: 12.7,
      rezystancjaWewnetrznaMOhm1: 10,
      rezystancjaWewnetrznaMOhm2: 30,
    })
    expect(chemia.warnings.find((w) => w.code === "INNA-CHEMIA-BEZ-IZOLACJI")?.i18nKey).toBe("INNA-CHEMIA-BEZ-IZOLACJI")

    const ujemna = calculateMixingRownolegle({
      chemia1: "lifepo4",
      chemia2: "lifepo4",
      napiecieNominalneV1: 13.3,
      napiecieNominalneV2: 13.2,
      rezystancjaWewnetrznaMOhm1: -5,
      rezystancjaWewnetrznaMOhm2: 15,
    })
    expect(ujemna.warnings[0].i18nKey).toBe("WARTOSC-POLA-UJEMNA")
    expect(ujemna.warnings[0].params).toEqual({ label: "Rezystancja wewnętrzna — bateria 1" })
  })
})
