import { describe, expect, it } from "vitest"
import { calculateAuditPozarowy } from "../calculator"
import type { AuditCheckItem } from "../input"

describe("calculateAuditPozarowy", () => {
  it("wszystkie OK -> 100%, status VALID", () => {
    const items: AuditCheckItem[] = [
      { id: "a", kategoria: "gasnice", element: "y", status: "ok", opis: "" },
      { id: "b", kategoria: "gasnice", element: "y", status: "ok", opis: "" },
    ]
    const result = calculateAuditPozarowy(items)
    expect(result.status).toBe("VALID")
    expect(result.value.procentGotowosci).toBe(100)
    expect(result.warnings).toHaveLength(0)
  })

  it("referencja ręczna: 3 z 4 OK -> 75%, VALID_WITH_WARNINGS", () => {
    const items: AuditCheckItem[] = [
      { id: "a", kategoria: "gasnice", element: "y", status: "ok", opis: "" },
      { id: "b", kategoria: "gasnice", element: "y", status: "ok", opis: "" },
      { id: "c", kategoria: "gasnice", element: "y", status: "ok", opis: "" },
      { id: "d", kategoria: "gasnice", element: "y", status: "warning", opis: "problem" },
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
      { id: "a", kategoria: "gasnice", element: "y", status: "critical", opis: "przeterminowane" },
    ]
    const result = calculateAuditPozarowy(items)
    expect(result.warnings[0].level).toBe("critical")
  })

  it("pusta lista -> INCOMPLETE", () => {
    const result = calculateAuditPozarowy([])
    expect(result.status).toBe("INCOMPLETE")
  })

  it("kategoria idzie jako klucz, własna nazwa elementu jako dane, notatka przycięta", () => {
    const result = calculateAuditPozarowy([
      { id: "a", kategoria: "czujniki-dymu", element: "czujka sypialnia", status: "warning", opis: " nie odpowiada " },
    ])
    expect(result.warnings[0].i18nKey).toBe("AUDYT-POZYCJA")
    expect(result.warnings[0].params).toEqual({ kategoriaKey: "AUDYT-KAT-CZUJNIKI-DYMU", element: "czujka sypialnia", opis: "nie odpowiada" })
  })

  it("element bez nazwy -> klucz zastępczy z numerem pozycji na liście; pusta notatka -> wariant bez opisu", () => {
    const result = calculateAuditPozarowy([
      { id: "a", kategoria: "gasnice", element: "", status: "ok", opis: "" },
      { id: "b", kategoria: "klapy-pozarowe", element: "  ", status: "critical", opis: "" },
    ])
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0].i18nKey).toBe("AUDYT-POZYCJA-BEZ-OPISU")
    expect(result.warnings[0].params).toMatchObject({ kategoriaKey: "AUDYT-KAT-KLAPY-POZAROWE", elementKey: "NAZWA-ELEMENT-NR", nr: 2 })
  })

  it("założenie: wpis ręczny, nie dane demonstracyjne", () => {
    const result = calculateAuditPozarowy([{ id: "a", kategoria: "przeglady", element: "", status: "ok", opis: "" }])
    expect(result.assumptions).toEqual([{ kod: "AUDYT-ZALOZENIE-WPIS-RECZNY" }])
  })
})
