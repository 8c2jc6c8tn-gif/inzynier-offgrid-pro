import { describe, expect, it } from "vitest"
import { safeNextPath } from "../safe-redirect"

describe("safeNextPath — docs/standards/18-logowanie.md 18.2 (open redirect)", () => {
  it("przepuszcza zwykłą ścieżkę względną", () => {
    expect(safeNextPath("/kalkulatory/pomocnicze")).toBe("/kalkulatory/pomocnicze")
  })

  it("brak wartości → strona główna", () => {
    expect(safeNextPath(null)).toBe("/")
    expect(safeNextPath(undefined)).toBe("/")
    expect(safeNextPath("")).toBe("/")
  })

  it("pełny URL zewnętrzny → odrzucone (nie zaczyna się od /)", () => {
    expect(safeNextPath("https://zly-adres.pl/phishing")).toBe("/")
    expect(safeNextPath("http://zly-adres.pl")).toBe("/")
  })

  it("protocol-relative // → odrzucone (przeglądarka traktuje jak zewnętrzny host)", () => {
    expect(safeNextPath("//zly-adres.pl/phishing")).toBe("/")
  })

  it("ścieżka bez wiodącego / → odrzucone", () => {
    expect(safeNextPath("kalkulatory/pomocnicze")).toBe("/")
  })
})
