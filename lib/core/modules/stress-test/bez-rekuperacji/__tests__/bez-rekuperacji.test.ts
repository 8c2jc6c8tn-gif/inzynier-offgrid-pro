import { describe, expect, it } from "vitest"
import { calculateWentylacjaOdzyskCiepla } from "@/lib/core/modules/ogrzewanie/wentylacja-odzysk-ciepla/calculator"
import { calculateBezRekuperacji } from "../calculator"
import type { BezRekuperacjiInput } from "../input"

const BAZA: BezRekuperacjiInput = {
  strumienM3H: 250,
  sprawnoscOdzyskuPct: 85,
  tempWewnC: 20,
  tempZewnC: -10,
  tempZamarzaniaWymiennikaC: null,
  tempZaNagrzewnicaC: null,
}

describe("calculateBezRekuperacji (M7/E20, dawne 6.30)", () => {
  it("echo M6/E3: dodatkowa strata = ciepło odzyskiwane (250 m³/h, 85%, ΔT 30 K → ok. 2,14 kW)", () => {
    const w = calculateBezRekuperacji(BAZA)
    const m6 = calculateWentylacjaOdzyskCiepla({ wydajnoscCentraliM3H: 250, sprawnoscRekuperatoraPct: 85, deltaTK: 30, poborWentylatorowW: 60 })
    expect(w.value.dodatkowaStrataKw).toBeCloseTo(m6.value.odzyskaneCieploKw, 12)
    expect(w.value.dodatkowaStrataKw).toBeCloseTo((250 * 0.85 * 1.2 * 1005 * 30) / 3600 / 1000, 12)
    expect(w.value.dodatkowaEnergiaKwhDoba).toBeCloseTo(w.value.dodatkowaStrataKw! * 24, 12)
    expect(w.status).toBe("VALID")
  })

  it("nagrzewnica wstępna: 250 m³/h z −15°C do −3°C → V·ρ·cp·12 K / 3600 = 1005 W", () => {
    const w = calculateBezRekuperacji({ ...BAZA, tempZewnC: -15, tempZaNagrzewnicaC: -3 })
    expect(w.value.mocNagrzewnicyW).toBeCloseTo((250 * 1.2 * 1005 * 12) / 3600, 12)
  })

  it("T_zewn poniżej progu zamarzania z instrukcji → 🟡; równo z progiem → bez", () => {
    const w = calculateBezRekuperacji({ ...BAZA, tempZewnC: -16, tempZamarzaniaWymiennikaC: -15 })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["REKU-RYZYKO-ZAMARZNIECIA", "warning"],
      ["REKU-WILGOTNOSC", "info"],
    ])
    expect(calculateBezRekuperacji({ ...BAZA, tempZewnC: -15, tempZamarzaniaWymiennikaC: -15 }).status).toBe("VALID")
  })

  it("brak danych → INCOMPLETE; sprawność 120% → INVALID_INPUT", () => {
    expect(calculateBezRekuperacji({ ...BAZA, tempZewnC: null }).status).toBe("INCOMPLETE")
    expect(calculateBezRekuperacji({ ...BAZA, sprawnoscOdzyskuPct: 120 }).status).toBe("INVALID_INPUT")
  })
})
