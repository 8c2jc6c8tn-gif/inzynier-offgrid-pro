import { describe, expect, it } from "vitest"
import { dzisiajLokalnie, pozycjeDoSilnika } from "../terminarz-przegladow-draft"

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
