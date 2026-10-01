import { describe, expect, it } from "vitest"
import { calculateSzybkaDiagnoza } from "../calculator"
import { DRZEWO_DIAGNOZY, OBJAWY } from "../constants"

describe("calculateSzybkaDiagnoza (M12/E25, dawne 8.50)", () => {
  it("przykład Treści: brak prądu, akumulator OK → najpierw bezpiecznik główny, potem złącza, potem LVD", () => {
    const krok = (odpowiedzi: Record<string, "ok" | "problem">) => calculateSzybkaDiagnoza({ objaw: "brak-pradu", odpowiedzi }).value.aktualnyKrok
    expect(krok({})).toBe("napiecie-akumulatora")
    expect(krok({ "napiecie-akumulatora": "ok" })).toBe("bezpiecznik-glowny")
    expect(krok({ "napiecie-akumulatora": "ok", "bezpiecznik-glowny": "ok" })).toBe("zlacza")
    expect(krok({ "napiecie-akumulatora": "ok", "bezpiecznik-glowny": "ok", zlacza: "ok" })).toBe("lvd")
  })

  it("pierwszy 'problem' kończy diagnozę z przyczyną i odnośnikiem; status VALID", () => {
    const w = calculateSzybkaDiagnoza({ objaw: "brak-pradu", odpowiedzi: { "napiecie-akumulatora": "ok", "bezpiecznik-glowny": "problem", zlacza: "ok" } })
    expect(w.value.przyczyna).toBe("bezpiecznik-glowny")
    expect(w.value.aktualnyKrok).toBeNull()
    expect(w.value.kroki.map((k) => k.id)).toEqual(["napiecie-akumulatora", "bezpiecznik-glowny"])
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["DG-BEZPIECZNE-POMIARY"])
  })

  it("przegrzewanie ze spalenizną → 🔴 odłącz zasilanie", () => {
    const w = calculateSzybkaDiagnoza({ objaw: "przegrzewanie", odpowiedzi: { spalenizna: "problem" } })
    expect(w.warnings[0]).toMatchObject({ code: "DG-ODLACZ-ZASILANIE", level: "critical" })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("wszystkie kroki OK → ℹ️ nie znaleziono; brak objawu → INCOMPLETE", () => {
    for (const objaw of OBJAWY) {
      const odpowiedzi = Object.fromEntries(DRZEWO_DIAGNOZY[objaw].map((k) => [k.id, "ok" as const]))
      const w = calculateSzybkaDiagnoza({ objaw, odpowiedzi })
      expect(w.value.przyczyna).toBeNull()
      expect(w.warnings.map((x) => x.code)).toContain("DG-NIE-ZNALEZIONO")
    }
    expect(calculateSzybkaDiagnoza({ objaw: null, odpowiedzi: {} }).status).toBe("INCOMPLETE")
  })

  it("id kroków unikalne w obrębie objawu", () => {
    for (const objaw of OBJAWY) {
      const ids = DRZEWO_DIAGNOZY[objaw].map((k) => k.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})
