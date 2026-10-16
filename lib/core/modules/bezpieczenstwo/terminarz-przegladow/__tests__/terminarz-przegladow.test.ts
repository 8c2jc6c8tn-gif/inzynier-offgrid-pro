import { describe, expect, it } from "vitest"
import { calculateTerminarzPrzegladow, dataUtc, dodajMiesiace } from "../calculator"
import type { PozycjaPrzegladu } from "../input"

const p = (id: string, ostatni: string | null, interwal: number | null, nazwa = `Pozycja ${id}`): PozycjaPrzegladu => ({ id, nazwa, ostatniPrzegladData: ostatni, interwalMiesiecy: interwal })
const ms = (s: string) => dataUtc(s)!
const tekst = (n: number) => new Date(n).toISOString().slice(0, 10)

describe("dataUtc i dodajMiesiace (kalendarz)", () => {
  it("poprawna data → UTC; nieistniejąca (30 lutego), zły format, pusta → null", () => {
    expect(dataUtc("2026-10-16")).toBe(Date.UTC(2026, 9, 16))
    expect(dataUtc("2026-02-30")).toBeNull()
    expect(dataUtc("16.10.2026")).toBeNull()
    expect(dataUtc("2026-13-01")).toBeNull()
    expect(dataUtc("")).toBeNull()
  })

  it("31 stycznia + 1 miesiąc = 28 lutego (2026) i 29 lutego (2028, rok przestępny); 31 maja + 1 = 30 czerwca", () => {
    expect(tekst(dodajMiesiace(ms("2026-01-31"), 1))).toBe("2026-02-28")
    expect(tekst(dodajMiesiace(ms("2028-01-31"), 1))).toBe("2028-02-29")
    expect(tekst(dodajMiesiace(ms("2026-05-31"), 1))).toBe("2026-06-30")
  })

  it("przejście przez rok: 15 listopada + 3 miesiące = 15 lutego następnego roku; +12 miesięcy = ta sama data rok później", () => {
    expect(tekst(dodajMiesiace(ms("2026-11-15"), 3))).toBe("2027-02-15")
    expect(tekst(dodajMiesiace(ms("2026-10-16"), 12))).toBe("2027-10-16")
  })
})

describe("calculateTerminarzPrzegladow", () => {
  const dzis = "2026-10-16"

  it("następny termin i dni: 2026-04-16 + 6 mies. = 2026-10-16 → 0 dni (dziś); + 12 mies. od 2026-01-10 = 2027-01-10 → 86 dni", () => {
    const w = calculateTerminarzPrzegladow({ dzisiaj: dzis, pozycje: [p("a", "2026-04-16", 6), p("b", "2026-01-10", 12)] })
    const [a, b] = [w.value!.terminy.find((x) => x.id === "a")!, w.value!.terminy.find((x) => x.id === "b")!]
    expect(a).toMatchObject({ nastepnyTermin: "2026-10-16", dniDoTerminu: 0, status: "w-terminie" })
    expect(b).toMatchObject({ nastepnyTermin: "2027-01-10", dniDoTerminu: 86, status: "w-terminie" })
  })

  it("po terminie: ostatni przegląd 2025-01-16, interwał 12 → termin 2026-01-16, 273 dni temu; licznik i kolejność od najpilniejszej", () => {
    const w = calculateTerminarzPrzegladow({ dzisiaj: dzis, pozycje: [p("pozno", "2026-09-01", 12), p("po", "2025-01-16", 12), p("brak", null, 6)] })
    expect(w.value!.terminy.map((x) => x.id)).toEqual(["po", "pozno", "brak"])
    expect(w.value!.terminy[0]).toMatchObject({ nastepnyTermin: "2026-01-16", dniDoTerminu: -273, status: "po-terminie" })
    expect(w.value!.poTerminie).toBe(1)
    expect(w.value!.terminy[2]).toMatchObject({ nastepnyTermin: null, dniDoTerminu: null, status: "bez-terminu" })
    expect(w.warnings.map((x) => x.code)).toEqual(["TPRZ-POZYCJA-NIEKOMPLETNA"])
  })

  it("data ostatniego przeglądu w przyszłości → ostrzeżenie (prawdopodobna literówka w roku)", () => {
    const w = calculateTerminarzPrzegladow({ dzisiaj: dzis, pozycje: [p("x", "2027-01-01", 6)] })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings[0]!.code).toBe("TPRZ-PRZEGLAD-W-PRZYSZLOSCI")
  })

  it("błędy danych: zła data, interwał 0 / ułamkowy / ujemny, zły dzień odniesienia → INVALID_INPUT; pusta lista → INCOMPLETE", () => {
    expect(calculateTerminarzPrzegladow({ dzisiaj: dzis, pozycje: [p("x", "2026-02-30", 6)] }).warnings[0]!.code).toBe("TPRZ-DATA-NIEPOPRAWNA")
    for (const i of [0, 1.5, -3]) expect(calculateTerminarzPrzegladow({ dzisiaj: dzis, pozycje: [p("x", "2026-01-01", i)] }).warnings[0]!.code).toBe("TPRZ-INTERWAL-NIEPOPRAWNY")
    expect(calculateTerminarzPrzegladow({ dzisiaj: "x", pozycje: [] }).status).toBe("INVALID_INPUT")
    expect(calculateTerminarzPrzegladow({ dzisiaj: dzis, pozycje: [] }).status).toBe("INCOMPLETE")
  })
})
