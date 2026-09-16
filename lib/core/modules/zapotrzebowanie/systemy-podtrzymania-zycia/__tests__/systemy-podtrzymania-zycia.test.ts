import { describe, expect, it } from "vitest"
import { calculateSurvivalCore } from "../calculator"
import { DEFAULT_CRITICAL_LOADS } from "../constants"
import type { CriticalLoadItem } from "../input"

function itemsFromCatalog(
  overrides: Record<string, { selected: boolean; powerW?: number }>,
): CriticalLoadItem[] {
  return DEFAULT_CRITICAL_LOADS.map((def) => {
    const override = overrides[def.id]
    return {
      id: def.id,
      label: def.label,
      selected: override?.selected ?? false,
      powerW: override?.powerW ?? def.defaultPowerW ?? 0,
    }
  })
}

describe("Ekran 1 (Moduł 2): Systemy podtrzymania życia (Survival Core)", () => {
  it("przypadek nominalny: pompa + router + kamery, wartości domyślne", () => {
    const items = itemsFromCatalog({
      "pompa-glebinowa": { selected: true },
      router: { selected: true },
      "monitoring-kamery": { selected: true },
    })

    const result = calculateSurvivalCore({ items })

    // wartość referencyjna policzona ręcznie: 800 + 15 + 20 = 835
    expect(result.status).toBe("VALID")
    expect(result.unit).toBe("W")
    expect(result.value).toBe(835)
    expect(result.assumptions).toHaveLength(3)
  })

  it("wartość graniczna: jedna zaznaczona pozycja", () => {
    const items = itemsFromCatalog({ router: { selected: true } })
    const result = calculateSurvivalCore({ items })

    expect(result.status).toBe("VALID")
    expect(result.value).toBe(15)
  })

  it("jawnie zmieniona moc nie trafia do assumptions (nie jest już wartością domyślną)", () => {
    const items = itemsFromCatalog({ router: { selected: true, powerW: 25 } })
    const result = calculateSurvivalCore({ items })

    expect(result.status).toBe("VALID")
    expect(result.value).toBe(25)
    expect(result.assumptions).toHaveLength(0)
  })

  it("ogrzewanie: brak domyślnej mocy w źródle, wymaga ręcznego wpisania", () => {
    const items = itemsFromCatalog({ ogrzewanie: { selected: true, powerW: 500 } })
    const result = calculateSurvivalCore({ items })

    expect(result.status).toBe("VALID")
    expect(result.value).toBe(500)
    // 500 W nie jest wartością domyślną (defaultPowerW = null) — nie trafia do assumptions
    expect(result.assumptions).toHaveLength(0)
  })

  it("błędne dane: zaznaczona pozycja bez wpisanej mocy (0 W) → INVALID_INPUT", () => {
    const items = itemsFromCatalog({ ogrzewanie: { selected: true, powerW: 0 } })
    const result = calculateSurvivalCore({ items })

    expect(result.status).toBe("INVALID_INPUT")
    expect(result.warnings.some((w) => w.code === "POZYCJA-NIEDODATNIA")).toBe(true)
  })

  it("brak zaznaczonych pozycji → INCOMPLETE, nie ciche zero", () => {
    const items = itemsFromCatalog({})
    const result = calculateSurvivalCore({ items })

    expect(result.status).toBe("INCOMPLETE")
    expect(result.warnings.some((w) => w.code === "BRAK-ZAZNACZONYCH")).toBe(true)
  })

  it("i18n (17.2): warnings mają i18nKey/params, nie gotowy tekst PL", () => {
    const bezMocy = calculateSurvivalCore({ items: itemsFromCatalog({ ogrzewanie: { selected: true, powerW: 0 } }) })
    const [warn] = bezMocy.warnings
    expect(warn.i18nKey).toBe("POZYCJA-NIEDODATNIA")
    expect(warn.params).toEqual({ label: "Ogrzewanie" })
    expect(warn.message).toBeUndefined()

    const pusty = calculateSurvivalCore({ items: itemsFromCatalog({}) })
    expect(pusty.warnings[0].i18nKey).toBe("BRAK-ZAZNACZONYCH")
    expect(pusty.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): assumptions to {kod, params}, nie gotowy tekst PL", () => {
    const result = calculateSurvivalCore({ items: itemsFromCatalog({ router: { selected: true } }) })
    expect(result.assumptions).toEqual([{ kod: "POZYCJA-WARTOSC-DOMYSLNA", params: { label: "Router", value: 15 } }])
  })
})
