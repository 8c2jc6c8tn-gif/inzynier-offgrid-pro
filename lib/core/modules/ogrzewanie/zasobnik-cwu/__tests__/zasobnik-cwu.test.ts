import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../zapotrzebowanie-co-cwu/constants"
import { calculateZasobnikCwu } from "../calculator"
import type { ZasobnikCwuInput } from "../input"

const BAZA: ZasobnikCwuInput = {
  osoby: 4,
  litrowNaOsobe: 50,
  tZimnaC: 10,
  tCwuC: 70,
  pojemnoscL: 200,
  uaWK: 0.8,
  uaPorownawczyWK: 0,
  tOtoczeniaC: 7.5,
  nieogrzewane: false,
  dlugoscCyrkulacjiM: 0,
  strataRuryWmK: 0,
  tOtoczeniaRurC: null,
  godzinCyrkulacji: 0,
  mocPompyW: 0,
}

describe("calculateZasobnikCwu (M6/E17, dawne 5.19 + 5.20 + 5.21)", () => {
  it("przykład źródła „200 l dla 4 osób” = 4 × 50 l; ciepło wody n·V·ΔT·c (echo E2)", () => {
    const w = calculateZasobnikCwu(BAZA)
    expect(w.value.zapotrzebowanieL).toBe(200)
    expect(w.value.cieploWodyKwh).toBeCloseTo(200 * 60 * WSPOLCZYNNIK_KWH_NA_L_K, 12)
    expect(w.status).toBe("VALID")
  })

  it("przykład źródła „0,8 W/K → 1,2 kWh/dobę” (ΔT = 62,5 K); 0,5 W/K przy tej samej ΔT → 0,75 kWh, 164 kWh/rok (źródło: 0,7 i 180 — niespójne)", () => {
    const w = calculateZasobnikCwu({ ...BAZA, uaPorownawczyWK: 0.5 })
    expect(w.value.strataPostojowaKwh).toBeCloseTo(1.2, 12)
    expect(w.value.strataPorownawczaKwh).toBeCloseTo(0.75, 12)
    expect(w.value.oszczednoscRocznaKwh).toBeCloseTo(0.45 * 365, 9)
  })

  it("cyrkulacja: 10 m × 0,1 W/(m·K) × 40 K + pompa 10 W — ciągła 1,2 kWh/dobę, 6 h → 0,3 kWh (przykład źródła)", () => {
    const w = calculateZasobnikCwu({
      ...BAZA,
      tCwuC: 60,
      dlugoscCyrkulacjiM: 10,
      strataRuryWmK: 0.1,
      tOtoczeniaRurC: 20,
      godzinCyrkulacji: 6,
      mocPompyW: 10,
    })
    expect(w.value.cyrkulacjaCiaglaKwh).toBeCloseTo(1.2, 12)
    expect(w.value.cyrkulacjaCieploKwh + w.value.cyrkulacjaPradKwh).toBeCloseTo(0.3, 12)
    expect(w.warnings.map((x) => x.code)).toEqual(["ZAS-CYRKULACJA-UPROSZCZENIE"])
  })

  it("udział strat w cieple razem (Biblia §6.20: „40% energii na C.W.U.”)", () => {
    const w = calculateZasobnikCwu(BAZA)
    const razem = w.value.cieploWodyKwh + 1.2
    expect(w.value.cieploRazemKwh).toBeCloseTo(razem, 12)
    expect(w.value.udzialStratPct).toBeCloseTo((1.2 / razem) * 100, 12)
  })

  it("🟡 zasobnik mniejszy niż dobowe zużycie (echo M2/E2) i 🟡 nieogrzewane pomieszczenie (źródło)", () => {
    const w = calculateZasobnikCwu({ ...BAZA, pojemnoscL: 150, nieogrzewane: true })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["BOJLER-ZA-MALY", "warning"],
      ["ZAS-NIEOGRZEWANE", "warning"],
    ])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("brak danych → INCOMPLETE; C.W.U. nie cieplejsza niż zimna albo godziny > 24 → INVALID_INPUT", () => {
    expect(calculateZasobnikCwu({ ...BAZA, uaWK: 0 }).status).toBe("INCOMPLETE")
    expect(calculateZasobnikCwu({ ...BAZA, dlugoscCyrkulacjiM: 10 }).status).toBe("INCOMPLETE")
    expect(calculateZasobnikCwu({ ...BAZA, tCwuC: 10 }).warnings[0]!.code).toBe("ZAS-CWU-POZA-ZAKRESEM")
    expect(calculateZasobnikCwu({ ...BAZA, godzinCyrkulacji: 30 }).status).toBe("INVALID_INPUT")
  })
})
