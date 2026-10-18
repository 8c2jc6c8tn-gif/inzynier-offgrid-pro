import { describe, expect, it } from "vitest"
import { dzisiajLokalnie, liczbaPrzegladowPoTerminie, pozycjeDoSilnika } from "../terminarz-przegladow-draft"

describe("terminarz przeglądów — szkic", () => {
  it("pozycjeDoSilnika: puste pola → null, przecinek w interwale, pusta nazwa → myślnik", () => {
    expect(
      pozycjeDoSilnika({
        pozycje: [
          { id: "a", nazwa: " Akumulatory ", ostatni: "2026-01-10", interwal: "6" },
          { id: "b", nazwa: "", ostatni: "", interwal: "" },
          { id: "c", nazwa: "Gaśnica", ostatni: "2025-06-01", interwal: "12,0" },
        ],
      }),
    ).toEqual([
      { id: "a", nazwa: "Akumulatory", ostatniPrzegladData: "2026-01-10", interwalMiesiecy: 6 },
      { id: "b", nazwa: "—", ostatniPrzegladData: null, interwalMiesiecy: null },
      { id: "c", nazwa: "Gaśnica", ostatniPrzegladData: "2025-06-01", interwalMiesiecy: 12 },
    ])
  })

  it("dzisiajLokalnie: lokalny dzień kalendarzowy RRRR-MM-DD z zerami", () => {
    expect(dzisiajLokalnie(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05")
    expect(dzisiajLokalnie(new Date(2026, 9, 16, 0, 1))).toBe("2026-10-16")
  })
})

describe("liczbaPrzegladowPoTerminie — dzwonek na pulpicie", () => {
  const pozycja = (id: string, ostatni: string, interwal: string) => ({ id, nazwa: id, ostatni, interwal })

  it("counts only the items past their date on the given day", () => {
    const seed = { pozycje: [pozycja("a", "2025-01-10", "6"), pozycja("b", "2026-09-01", "12"), pozycja("c", "2026-04-01", "6")] }
    // a: due 2025-07-10 (overdue), b: due 2027-09-01, c: due 2026-10-01 (overdue on 2026-10-18)
    expect(liczbaPrzegladowPoTerminie(seed, "2026-10-18")).toBe(2)
    expect(liczbaPrzegladowPoTerminie(seed, "2026-09-30")).toBe(1)
  })

  it("is 0 without a schedule, with an empty one and for incomplete items (no guess)", () => {
    expect(liczbaPrzegladowPoTerminie(null, "2026-10-18")).toBe(0)
    expect(liczbaPrzegladowPoTerminie({ pozycje: [] }, "2026-10-18")).toBe(0)
    expect(liczbaPrzegladowPoTerminie({ pozycje: [pozycja("a", "", "6"), pozycja("b", "2025-01-01", "")] }, "2026-10-18")).toBe(0)
  })
})

