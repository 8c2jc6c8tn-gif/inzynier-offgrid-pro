import { describe, expect, it } from "vitest"
import { calculateAuditPozarowy } from "../calculator"
import type { AuditCheckItem } from "../input"
import { SAMPLE_AUDIT_ITEMS } from "../constants"

describe("calculateAuditPozarowy", () => {
  it("wszystkie OK -> 100%, status VALID", () => {
    const items: AuditCheckItem[] = [
      { id: "a", kategoria: "x", element: "y", status: "ok", opis: "" },
      { id: "b", kategoria: "x", element: "y", status: "ok", opis: "" },
    ]
    const result = calculateAuditPozarowy(items)
    expect(result.status).toBe("VALID")
    expect(result.value.procentGotowosci).toBe(100)
    expect(result.warnings).toHaveLength(0)
  })

  it("referencja ręczna: 3 z 4 OK -> 75%, VALID_WITH_WARNINGS", () => {
    const items: AuditCheckItem[] = [
      { id: "a", kategoria: "x", element: "y", status: "ok", opis: "" },
      { id: "b", kategoria: "x", element: "y", status: "ok", opis: "" },
      { id: "c", kategoria: "x", element: "y", status: "ok", opis: "" },
      { id: "d", kategoria: "x", element: "y", status: "warning", opis: "problem" },
    ]
    const result = calculateAuditPozarowy(items)
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.procentGotowosci).toBe(75)
    expect(result.value.liczbaOstrzezen).toBe(1)
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0].level).toBe("warning")
  })

  it("pozycja critical daje ostrzeżenie level critical", () => {
    const items: AuditCheckItem[] = [
      { id: "a", kategoria: "x", element: "y", status: "critical", opis: "przeterminowane" },
    ]
    const result = calculateAuditPozarowy(items)
    expect(result.warnings[0].level).toBe("critical")
  })

  it("pusta lista -> INCOMPLETE", () => {
    const result = calculateAuditPozarowy([])
    expect(result.status).toBe("INCOMPLETE")
  })

  it("dane demonstracyjne SAMPLE_AUDIT_ITEMS: 9 OK, 2 warning, 1 critical z 12 -> 75%", () => {
    const result = calculateAuditPozarowy(SAMPLE_AUDIT_ITEMS)
    expect(result.value.razem).toBe(12)
    expect(result.value.liczbaOk).toBe(9)
    expect(result.value.liczbaOstrzezen).toBe(2)
    expect(result.value.liczbaKrytycznych).toBe(1)
    expect(result.value.procentGotowosci).toBe(75)
    expect(result.status).toBe("VALID_WITH_WARNINGS")
  })
})
