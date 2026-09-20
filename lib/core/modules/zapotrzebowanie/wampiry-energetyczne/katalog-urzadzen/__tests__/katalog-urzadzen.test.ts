import { describe, expect, it } from "vitest"
import { calculateKatalogUrzadzen } from "../calculator"
import { KATALOG_URZADZEN_STANDBY } from "../constants"
import type { StandbyDeviceItem } from "../input"

function itemsFromCatalog(
  overrides: Record<string, { selected: boolean; powerW?: number }>,
): StandbyDeviceItem[] {
  return KATALOG_URZADZEN_STANDBY.map((def) => {
    const override = overrides[def.id]
    return {
      id: def.id,
      label: def.label,
      selected: override?.selected ?? false,
      powerW: override?.powerW ?? def.defaultPowerW,
    }
  })
}

describe("Moduł zbiorczy Wampiry energetyczne — podzakładka Katalog urządzeń (dawne 1.24)", () => {
  it("przykład źródła: 45 W standby → 1,08 kWh/dobę → 394 kWh/rok", () => {
    const items: StandbyDeviceItem[] = [
      { id: "custom-1", label: "Suma testowa", selected: true, powerW: 45 },
    ]
    const result = calculateKatalogUrzadzen({ items })

    expect(result.status).toBe("VALID")
    expect(result.value.sumaW).toBe(45)
    expect(result.value.energiaDobowaKwh).toBeCloseTo(1.08, 5)
    expect(result.value.energiaRocznaKwh).toBeCloseTo(394.2, 5)
  })

  it("nominalny: router + dekoder z wartościami domyślnymi katalogu", () => {
    const items = itemsFromCatalog({ router: { selected: true }, dekoder: { selected: true } })
    const result = calculateKatalogUrzadzen({ items })

    // wartość referencyjna: 10 + 20 = 30 W
    expect(result.status).toBe("VALID")
    expect(result.value.sumaW).toBe(30)
    expect(result.assumptions).toHaveLength(2)
  })

  it("graniczny: jedno zaznaczone urządzenie", () => {
    const items = itemsFromCatalog({ listwa: { selected: true } })
    const result = calculateKatalogUrzadzen({ items })
    expect(result.value.sumaW).toBe(0.3)
  })

  it("edytowana moc nie trafia do assumptions", () => {
    const items = itemsFromCatalog({ telewizor: { selected: true, powerW: 12 } })
    const result = calculateKatalogUrzadzen({ items })
    expect(result.value.sumaW).toBe(12)
    expect(result.assumptions).toHaveLength(0)
  })

  it("błędne dane: zaznaczona pozycja z mocą 0 → INVALID_INPUT", () => {
    const items = itemsFromCatalog({ router: { selected: true, powerW: 0 } })
    const result = calculateKatalogUrzadzen({ items })
    expect(result.status).toBe("INVALID_INPUT")
    expect(result.warnings.some((w) => w.code === "WAMPIR-POZYCJA-NIEDODATNIA")).toBe(true)
  })

  it("brak zaznaczonych → INCOMPLETE", () => {
    const result = calculateKatalogUrzadzen({ items: itemsFromCatalog({}) })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.warnings.some((w) => w.code === "WAMPIR-BRAK-ZAZNACZONYCH")).toBe(true)
  })

  it("i18n: warnings/assumptions mają i18nKey/kod + params, nie gotowy tekst PL", () => {
    const bledny = calculateKatalogUrzadzen({ items: itemsFromCatalog({ router: { selected: true, powerW: 0 } }) })
    expect(bledny.warnings[0].i18nKey).toBe("WAMPIR-POZYCJA-NIEDODATNIA")
    expect(bledny.warnings[0].message).toBeUndefined()

    const domyslny = calculateKatalogUrzadzen({ items: itemsFromCatalog({ router: { selected: true } }) })
    expect(domyslny.assumptions).toEqual([{ kod: "WAMPIR-POZYCJA-WARTOSC-DOMYSLNA", params: { label: "Router", value: 10 } }])
  })
})
