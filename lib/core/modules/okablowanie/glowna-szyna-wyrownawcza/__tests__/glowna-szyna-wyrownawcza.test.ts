import { describe, expect, it } from "vitest"
import { calculateGlownaSzynaWyrownawcza } from "../calculator"

describe("calculateGlownaSzynaWyrownawcza", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/5", () => {
    const result = calculateGlownaSzynaWyrownawcza({ potwierdzoneIds: [], uzywanaJakoPrzylaczeOdbiornikow: false })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 0, razem: 5 })
  })

  it("wszystkie potwierdzone -> VALID, 5/5", () => {
    const result = calculateGlownaSzynaWyrownawcza({
      potwierdzoneIds: ["konstrukcja-paneli", "falownik", "bateria", "instalacja-wodna", "uziom"],
      uzywanaJakoPrzylaczeOdbiornikow: false,
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 5, razem: 5 })
  })

  it("KRYTYCZNE — GSW używana jako przyłącze odbiorników, niezależnie od checklisty", () => {
    const result = calculateGlownaSzynaWyrownawcza({
      potwierdzoneIds: [],
      uzywanaJakoPrzylaczeOdbiornikow: true,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("GSW-UZYWANA-JAKO-PRZYLACZE")
  })

  it("duplikat id nie zawyża postępu", () => {
    const result = calculateGlownaSzynaWyrownawcza({
      potwierdzoneIds: ["uziom", "uziom"],
      uzywanaJakoPrzylaczeOdbiornikow: false,
    })
    expect(result.value.potwierdzone).toBe(1)
  })
})
