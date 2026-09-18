import { describe, expect, it } from "vitest"
import { calculateAnalizaZwarciowa } from "../calculator"

describe("calculateAnalizaZwarciowa", () => {
  it("przykład źródła: 48V/0,01Ω -> 4800A, AIC 2000A (ANL) za mało", () => {
    const result = calculateAnalizaZwarciowa({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaBateriiOhm: 0.01,
      iscPanelaA: 10,
      liczbaStringowRownoleglych: 3,
      aicZabezpieczeniaA: 2000,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.pradZwarciowyBateriaA).toBeCloseTo(4800, 9)
    expect(result.value.pradZwarciowyPvA).toBeCloseTo(30, 9)
    expect(result.value.pradZwarciowyMaksymalnyA).toBeCloseTo(4800, 9)
    expect(result.value.aicWystarczajace).toBe(false)
    expect(result.warnings[0].code).toBe("AIC-PONIZEJ-PRADU-ZWARCIOWEGO")
  })

  it("przykład źródła: Class T AIC 20000A wystarcza", () => {
    const result = calculateAnalizaZwarciowa({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaBateriiOhm: 0.01,
      iscPanelaA: 10,
      liczbaStringowRownoleglych: 3,
      aicZabezpieczeniaA: 20_000,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.aicWystarczajace).toBe(true)
    expect(result.warnings[0].code).toBe("AIC-WYSTARCZAJACE")
  })

  it("prąd PV wyższy niż prąd baterii -> maksymalny to prąd PV", () => {
    const result = calculateAnalizaZwarciowa({
      napiecieBateriiV: 12,
      rezystancjaWewnetrznaBateriiOhm: 1,
      iscPanelaA: 50,
      liczbaStringowRownoleglych: 4,
      aicZabezpieczeniaA: 0,
    })
    // bateria: 12/1 = 12A; PV: 50*4=200A -> maksymalny 200A
    expect(result.value.pradZwarciowyBateriaA).toBeCloseTo(12, 9)
    expect(result.value.pradZwarciowyPvA).toBeCloseTo(200, 9)
    expect(result.value.pradZwarciowyMaksymalnyA).toBeCloseTo(200, 9)
    expect(result.value.aicWystarczajace).toBeNull()
  })

  it("AIC niepodane -> sprawdzenie pominięte (null), status VALID", () => {
    const result = calculateAnalizaZwarciowa({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaBateriiOhm: 0.01,
      iscPanelaA: 10,
      liczbaStringowRownoleglych: 3,
      aicZabezpieczeniaA: 0,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.aicWystarczajace).toBeNull()
    expect(result.assumptions.length).toBeGreaterThan(1)
  })

  it("INCOMPLETE — brakujące dane", () => {
    const result = calculateAnalizaZwarciowa({
      napiecieBateriiV: 0,
      rezystancjaWewnetrznaBateriiOhm: 0.01,
      iscPanelaA: 10,
      liczbaStringowRownoleglych: 3,
      aicZabezpieczeniaA: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna rezystancja", () => {
    const result = calculateAnalizaZwarciowa({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaBateriiOhm: -0.01,
      iscPanelaA: 10,
      liczbaStringowRownoleglych: 3,
      aicZabezpieczeniaA: 0,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenia i assumptions zwracają i18nKey/kod, nie gotowy tekst", () => {
    const zaMalo = calculateAnalizaZwarciowa({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaBateriiOhm: 0.01,
      iscPanelaA: 10,
      liczbaStringowRownoleglych: 3,
      aicZabezpieczeniaA: 2000,
    })
    expect(zaMalo.warnings[0].i18nKey).toBe("AIC-PONIZEJ-MAX-PRADU-ZWARCIOWEGO")
    expect(zaMalo.warnings[0].params).toEqual({ aic: 2000, pradZwarciowy: "4800" })
    expect(zaMalo.warnings[0].message).toBeUndefined()
    expect(zaMalo.assumptions).toEqual([{ kod: "MODEL-ZWARCIA-PROSTEGO-NIZSZY" }])

    const wystarcza = calculateAnalizaZwarciowa({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaBateriiOhm: 0.01,
      iscPanelaA: 10,
      liczbaStringowRownoleglych: 3,
      aicZabezpieczeniaA: 20_000,
    })
    expect(wystarcza.warnings[0].i18nKey).toBe("AIC-WYSTARCZAJACE-NA-PRAD-ZWARCIOWY")

    const bezAic = calculateAnalizaZwarciowa({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaBateriiOhm: 0.01,
      iscPanelaA: 10,
      liczbaStringowRownoleglych: 3,
      aicZabezpieczeniaA: 0,
    })
    expect(bezAic.assumptions).toEqual([
      { kod: "MODEL-ZWARCIA-PROSTEGO-NIZSZY" },
      { kod: "AIC-NIE-SPRAWDZONA-PORUWNAJ" },
    ])

    const ujemna = calculateAnalizaZwarciowa({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaBateriiOhm: -0.01,
      iscPanelaA: 10,
      liczbaStringowRownoleglych: 3,
      aicZabezpieczeniaA: 0,
    })
    expect(ujemna.warnings[0].i18nKey).toBe("WARTOSC-NIE-MOZE-BYC-UJEMNA")
  })
})
