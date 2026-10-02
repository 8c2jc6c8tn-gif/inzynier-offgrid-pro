import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../../zapotrzebowanie/bojler-cwu/constants"
import { calculateWplywCzynnika } from "../../wplyw-czynnika/calculator"
import { calculateBuforPracaPompy } from "../calculator"
import type { BuforPracaPompyInput } from "../input"

const baza: BuforPracaPompyInput = {
  mocPompyKw: 8,
  obciazenieKw: 2,
  wodaInstalacjiL: 100,
  histerezaK: 5,
  buforL: 400,
  dTMagazynK: 0,
  stratyPostojoweW: 0,
  dniPracy: 0,
}

describe("praca pompy z buforem i bez (dawne 5.28 + 5.70)", () => {
  it("starty z buforem 400 l przy 100 l wody w instalacji: 5× mniej (ten sam cykl co 2D 5.100)", () => {
    const r = calculateBuforPracaPompy(baza)
    expect(r.status).toBe("VALID")
    expect(r.value.bez!.startyDoba / r.value.z!.startyDoba).toBeCloseTo(5, 9)
    const e = 100 * WSPOLCZYNNIK_KWH_NA_L_K * 5
    expect(r.value.bez!.pracaMin).toBeCloseTo((e / 6) * 60, 9)
    expect(r.value.bez!.postojMin).toBeCloseTo((e / 2) * 60, 9)
    const d2 = calculateWplywCzynnika({
      czynnik: "bufor-starty",
      pola: { mocPompyKw: 8, obciazenieKw: 2, wodaInstalacjiL: 100, histerezaK: 5, buforL: 400 },
    })
    expect(d2.value.glowny!.params.z).toBeCloseTo(r.value.z!.startyDoba, 9)
  })

  it("magazyn PV: 400 l × 20 K = 9,3 kWh → 4,65 h przy 2 kW; straty 80 W → 1,92 kWh/dobę, 200 dni → 384 kWh", () => {
    const r = calculateBuforPracaPompy({ ...baza, dTMagazynK: 20, stratyPostojoweW: 80, dniPracy: 200 })
    expect(r.value.cieploMagazynKwh).toBeCloseTo(400 * WSPOLCZYNNIK_KWH_NA_L_K * 20, 9)
    expect(r.value.czasPokryciaH).toBeCloseTo(r.value.cieploMagazynKwh! / 2, 9)
    expect(r.value.stratyDobaKwh).toBeCloseTo(1.92, 9)
    expect(r.value.stratySezonKwh).toBeCloseTo(384, 9)
  })

  it("obciążenie ≥ moc → praca ciągła (ℹ️, bez cykli); brak bufora → INCOMPLETE; wartość ujemna → INVALID_INPUT", () => {
    const r = calculateBuforPracaPompy({ ...baza, obciazenieKw: 8 })
    expect(r.value.bez).toBeNull()
    expect(r.warnings.map((w) => w.code)).toEqual(["WPC-BUFOR-PRACA-CIAGLA"])
    expect(calculateBuforPracaPompy({ ...baza, buforL: 0 }).status).toBe("INCOMPLETE")
    expect(calculateBuforPracaPompy({ ...baza, histerezaK: -1 }).status).toBe("INVALID_INPUT")
  })
})
