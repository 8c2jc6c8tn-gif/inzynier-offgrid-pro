import { describe, expect, it } from "vitest"
import { calculateDoborIzolacjiKabla } from "../calculator"

describe("calculateDoborIzolacjiKabla", () => {
  it("PVC dokładnie na granicy 70°C -> VALID, wystarcza", () => {
    const result = calculateDoborIzolacjiKabla({
      miejsceTrasy: "ziemia",
      izolacjaWybrana: "PVC",
      temperaturaMaksymalnaC: 70,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.maksTemperaturaIzolacjiC).toBe(70)
    expect(result.warnings[0].code).toBe("IZOLACJA-WYSTARCZAJACA")
  })

  it("KRYTYCZNE — PVC przy 75°C (powyżej 70°C)", () => {
    const result = calculateDoborIzolacjiKabla({
      miejsceTrasy: "zewnetrznie-blisko-paneli",
      izolacjaWybrana: "PVC",
      temperaturaMaksymalnaC: 75,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("IZOLACJA-PONIZEJ-TEMPERATURY")
  })

  it("XLPE przy 85°C -> VALID, wystarcza (do 90°C)", () => {
    const result = calculateDoborIzolacjiKabla({
      miejsceTrasy: "zewnetrznie-blisko-paneli",
      izolacjaWybrana: "XLPE",
      temperaturaMaksymalnaC: 85,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.maksTemperaturaIzolacjiC).toBe(90)
  })

  it("KRYTYCZNE — XLPE przy 95°C (powyżej 90°C)", () => {
    const result = calculateDoborIzolacjiKabla({
      miejsceTrasy: "zewnetrznie-blisko-paneli",
      izolacjaWybrana: "XLPE",
      temperaturaMaksymalnaC: 95,
    })
    expect(result.warnings[0].code).toBe("IZOLACJA-PONIZEJ-TEMPERATURY")
  })

  it("INCOMPLETE — izolacja niewybrana", () => {
    const result = calculateDoborIzolacjiKabla({
      miejsceTrasy: null,
      izolacjaWybrana: null,
      temperaturaMaksymalnaC: 50,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna temperatura", () => {
    const result = calculateDoborIzolacjiKabla({
      miejsceTrasy: "ziemia",
      izolacjaWybrana: "PVC",
      temperaturaMaksymalnaC: -5,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenia zwracają i18nKey/params, nie message", () => {
    const wystarcza = calculateDoborIzolacjiKabla({
      miejsceTrasy: "ziemia",
      izolacjaWybrana: "PVC",
      temperaturaMaksymalnaC: 70,
    })
    expect(wystarcza.warnings[0].i18nKey).toBe("IZOLACJA-WYSTARCZA-NA-TEMPERATURE")
    expect(wystarcza.warnings[0].params).toEqual({ izolacja: "PVC", max: 70 })
    expect(wystarcza.warnings[0].message).toBeUndefined()

    const ponizej = calculateDoborIzolacjiKabla({
      miejsceTrasy: "zewnetrznie-blisko-paneli",
      izolacjaWybrana: "PVC",
      temperaturaMaksymalnaC: 75,
    })
    expect(ponizej.warnings[0].i18nKey).toBe("IZOLACJA-PONIZEJ-TEMPERATURY")
    expect(ponizej.warnings[0].params).toEqual({ izolacja: "PVC", temp: 75, max: 70 })

    const ujemna = calculateDoborIzolacjiKabla({
      miejsceTrasy: "ziemia",
      izolacjaWybrana: "PVC",
      temperaturaMaksymalnaC: -5,
    })
    expect(ujemna.warnings[0].i18nKey).toBe("WARTOSC-NIE-MOZE-BYC-UJEMNA")
  })
})
