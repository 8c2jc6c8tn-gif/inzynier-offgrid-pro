import { describe, expect, it } from "vitest"
import { calculateUpsKrytyczny } from "../calculator"
import type { UrzadzenieKrytyczne } from "../input"

function urzadzenia(overrides: Partial<Record<string, number>> = {}): UrzadzenieKrytyczne[] {
  return [
    { id: "esp32", label: "ESP32", powerW: overrides.esp32 ?? 5, selected: true },
    { id: "router", label: "Router", powerW: overrides.router ?? 10, selected: true },
    { id: "silowniki", label: "Siłowniki", powerW: overrides.silowniki ?? 15, selected: true },
    { id: "centrala-pozarowa", label: "Centrala", powerW: overrides["centrala-pozarowa"] ?? 10, selected: true },
    { id: "oswietlenie-awaryjne", label: "Oświetlenie", powerW: overrides["oswietlenie-awaryjne"] ?? 10, selected: true },
  ]
}

describe("calculateUpsKrytyczny", () => {
  it("5 urządzeń (50W łącznie), 20Ah/12V, sprawność domyślna 0,92 -> 4,416h", () => {
    const result = calculateUpsKrytyczny({
      urzadzenia: urzadzenia(),
      pojemnoscAh: 20,
      napiecieV: 12,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.laczonyPoborW).toBe(50)
    expect(result.value.czasPodtrzymaniaH).toBeCloseTo(4.416, 6)
    expect(result.assumptions[0]).toEqual({ kod: "SPRAWNOSC-DOMYSLNA", params: { efficiency: 0.92 } })
  })

  it("wpisana ręcznie sprawność zastępuje domyślną", () => {
    const result = calculateUpsKrytyczny({
      urzadzenia: urzadzenia(),
      pojemnoscAh: 20,
      napiecieV: 12,
      efficiency: 1,
    })
    expect(result.value.czasPodtrzymaniaH).toBeCloseTo(4.8, 6)
    expect(result.assumptions.some((a) => typeof a !== "string" && a.kod === "SPRAWNOSC-DOMYSLNA")).toBe(false)
  })

  it("tylko część urządzeń zaznaczona -> sumuje wyłącznie zaznaczone", () => {
    const items = urzadzenia()
    items[2].selected = false
    items[3].selected = false
    const result = calculateUpsKrytyczny({
      urzadzenia: items,
      pojemnoscAh: 20,
      napiecieV: 12,
    })
    expect(result.value.laczonyPoborW).toBe(25)
  })

  it("INCOMPLETE — nic nie zaznaczono", () => {
    const items = urzadzenia().map((u) => ({ ...u, selected: false }))
    const result = calculateUpsKrytyczny({
      urzadzenia: items,
      pojemnoscAh: 20,
      napiecieV: 12,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INCOMPLETE — pojemność jeszcze nie wpisana", () => {
    const result = calculateUpsKrytyczny({
      urzadzenia: urzadzenia(),
      pojemnoscAh: 0,
      napiecieV: 12,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna moc zaznaczonego urządzenia", () => {
    const result = calculateUpsKrytyczny({
      urzadzenia: urzadzenia({ esp32: -5 }),
      pojemnoscAh: 20,
      napiecieV: 12,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey bez params, nie message", () => {
    const result = calculateUpsKrytyczny({
      urzadzenia: urzadzenia({ esp32: -5 }),
      pojemnoscAh: 20,
      napiecieV: 12,
    })
    expect(result.warnings[0].i18nKey).toBe("WARTOSC-NIE-MOZE-BYC-UJEMNA")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): brak zaznaczonych zwraca i18nKey bez params, nie message", () => {
    const items = urzadzenia().map((u) => ({ ...u, selected: false }))
    const result = calculateUpsKrytyczny({ urzadzenia: items, pojemnoscAh: 20, napiecieV: 12 })
    expect(result.warnings[0].i18nKey).toBe("BRAK-ZAZNACZONYCH-URZADZEN")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): czas podtrzymania zwraca i18nKey/params, nie message", () => {
    const result = calculateUpsKrytyczny({ urzadzenia: urzadzenia(), pojemnoscAh: 20, napiecieV: 12 })
    const w = result.warnings.find((x) => x.code === "CZAS-PODTRZYMANIA")
    expect(w?.i18nKey).toBe("CZAS-PODTRZYMANIA")
    expect(w?.params).toEqual({ czas: "4.42" })
    expect(w?.message).toBeUndefined()
  })
})
