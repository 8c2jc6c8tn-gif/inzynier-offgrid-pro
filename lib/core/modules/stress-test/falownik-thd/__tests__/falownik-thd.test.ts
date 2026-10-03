import { describe, expect, it } from "vitest"
import { calculateFalownikThd } from "../calculator"
import type { FalownikThdInput } from "../input"

// Invented test curve (NOT a datasheet): THD 0% → k=1.0, 20% → k=0.9, 40% → k=0.7.
const BAZA: FalownikThdInput = {
  mocZnamionowaKw: 5,
  mocObciazeniaKw: 3,
  thdPct: 30,
  tabela: [
    { thdPct: 0, wspolczynnik: 1 },
    { thdPct: 20, wspolczynnik: 0.9 },
    { thdPct: 40, wspolczynnik: 0.7 },
  ],
}

describe("calculateFalownikThd (M7/E24, dawne 6.38)", () => {
  it("interpolacja liniowa ręcznie: THD 30% między 20% (0,9) i 40% (0,7) → k=0,8, dostępna 4 kW, zapas 1 kW = 25%", () => {
    const w = calculateFalownikThd(BAZA)
    expect(w.value.wspolczynnik).toBeCloseTo(0.8, 12)
    expect(w.value.dostepnaKw).toBeCloseTo(4, 12)
    expect(w.value.zapasKw).toBeCloseTo(1, 12)
    expect(w.value.zapasPct).toBeCloseTo(25, 9)
    expect(w.status).toBe("VALID")
    expect(w.warnings).toEqual([])
  })

  it("punkt tabeli trafiony dokładnie: THD 20% → k=0,9", () => {
    const w = calculateFalownikThd({ ...BAZA, thdPct: 20 })
    expect(w.value.wspolczynnik).toBeCloseTo(0.9, 12)
    expect(w.value.dostepnaKw).toBeCloseTo(4.5, 12)
  })

  it("końce tabeli są w zakresie: THD 0% → k=1, THD 40% → k=0,7", () => {
    expect(calculateFalownikThd({ ...BAZA, thdPct: 0 }).value.wspolczynnik).toBe(1)
    expect(calculateFalownikThd({ ...BAZA, thdPct: 40 }).value.wspolczynnik).toBeCloseTo(0.7, 12)
  })

  it("🔴 obciążenie 4,5 kW > dostępna 4 kW: brakuje 0,5 kW", () => {
    const w = calculateFalownikThd({ ...BAZA, mocObciazeniaKw: 4.5 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.value.przekroczone).toBe(true)
    expect(w.value.zapasKw).toBeCloseTo(-0.5, 12)
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["FTHD-OBCIAZENIE-PRZEKRACZA-DOSTEPNA", "critical"]])
    expect(w.warnings[0]!.params).toEqual({ obciazenie: 4.5, dostepna: 4, brak: 0.5 })
  })

  it("obciążenie równe dostępnej: zapas 0, bez 🔴 (🟢 — źródło nie podaje progu 🟡)", () => {
    const w = calculateFalownikThd({ ...BAZA, mocObciazeniaKw: 4 })
    expect(w.status).toBe("VALID")
    expect(w.value.zapasKw).toBeCloseTo(0, 12)
  })

  it("THD poza tabelą (poniżej i powyżej) → OUT_OF_SCOPE, bez ekstrapolacji", () => {
    const wysoki = calculateFalownikThd({ ...BAZA, thdPct: 45 })
    expect(wysoki.status).toBe("OUT_OF_SCOPE")
    expect(wysoki.warnings[0]!.code).toBe("FTHD-THD-POZA-TABELA")
    expect(wysoki.warnings[0]!.params).toEqual({ thd: 45, min: 0, max: 40 })
    const tab = BAZA.tabela.slice(1)
    expect(calculateFalownikThd({ ...BAZA, tabela: tab, thdPct: 10 }).status).toBe("OUT_OF_SCOPE")
  })

  it("współczynnik 0 w tabeli: dostępna 0, zapas ujemny, zapasPct null", () => {
    const w = calculateFalownikThd({
      ...BAZA,
      thdPct: 50,
      tabela: [
        { thdPct: 0, wspolczynnik: 1 },
        { thdPct: 50, wspolczynnik: 0 },
      ],
    })
    expect(w.value.dostepnaKw).toBe(0)
    expect(w.value.zapasPct).toBeNull()
    expect(w.value.przekroczone).toBe(true)
  })

  it("INCOMPLETE: brak mocy, obciążenia, THD albo tabeli krótszej niż 2 punkty", () => {
    expect(calculateFalownikThd({ ...BAZA, mocZnamionowaKw: 0 }).status).toBe("INCOMPLETE")
    expect(calculateFalownikThd({ ...BAZA, mocObciazeniaKw: 0 }).status).toBe("INCOMPLETE")
    expect(calculateFalownikThd({ ...BAZA, thdPct: null }).status).toBe("INCOMPLETE")
    expect(calculateFalownikThd({ ...BAZA, tabela: BAZA.tabela.slice(0, 1) }).status).toBe("INCOMPLETE")
    expect(calculateFalownikThd({ ...BAZA, tabela: [] }).status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT: ujemna moc, współczynnik > 1, THD tabeli nie rośnie", () => {
    expect(calculateFalownikThd({ ...BAZA, mocObciazeniaKw: -1 }).warnings[0]!.code).toBe("FTHD-WARTOSC-UJEMNA")
    const zlyK = calculateFalownikThd({ ...BAZA, tabela: [{ thdPct: 0, wspolczynnik: 1.2 }, { thdPct: 40, wspolczynnik: 0.7 }] })
    expect(zlyK.status).toBe("INVALID_INPUT")
    expect(zlyK.warnings[0]!.code).toBe("FTHD-WSPOLCZYNNIK-POZA-ZAKRESEM")
    const zlaKolejnosc = calculateFalownikThd({ ...BAZA, tabela: [{ thdPct: 20, wspolczynnik: 0.9 }, { thdPct: 20, wspolczynnik: 0.7 }] })
    expect(zlaKolejnosc.warnings.map((x) => x.code)).toContain("FTHD-TABELA-NIEROSNACA")
  })

  it("założenia: tabela producenta + interpolacja liniowa", () => {
    expect(calculateFalownikThd(BAZA).assumptions).toEqual([{ kod: "FTHD-ZALOZENIE-TABELA-PRODUCENTA" }, { kod: "FTHD-ZALOZENIE-INTERPOLACJA-LINIOWA" }])
  })
})
