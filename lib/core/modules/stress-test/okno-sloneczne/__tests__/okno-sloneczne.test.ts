import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/constants"
import { calculateOknoSloneczne } from "../calculator"
import type { OknoSloneczneInput } from "../input"

const BAZA: OknoSloneczneInput = {
  energiaOknaKwh: 4.5,
  zuzycieWOknieKwh: 0,
  pojemnoscBateriiKwh: 10,
  socStartPct: 20,
  grzalkiBmsKwh: 0,
  bojlerL: 100,
  bojlerTStartC: 30,
  bojlerTCelC: 50,
}

describe("calculateOknoSloneczne (M7/E15, dawne 6.22)", () => {
  it("niespójność źródła: 4,5 kWh → bateria 20% → 65%, ale bojler nie dostaje nic (reguła „> 80%”)", () => {
    const w = calculateOknoSloneczne(BAZA)
    expect(w.value.naBaterieKwh).toBeCloseTo(4.5, 12)
    expect(w.value.socKoniecPct).toBeCloseTo(65, 12)
    expect(w.value.naBojlerKwh).toBe(0)
    expect(w.value.bojlerTKoniecC).toBe(30)
    expect(w.warnings.map((x) => x.code)).toEqual(["OKNO-BOJLER-NIEDOGRZANY", "OKNO-BRAK-NADWYZKI"])
  })

  it("kolejność: bateria do 80% → bojler → bateria do 100% → nadwyżka", () => {
    const bojler = 100 * 20 * WSPOLCZYNNIK_KWH_NA_L_K
    const w = calculateOknoSloneczne({ ...BAZA, energiaOknaKwh: 6 + bojler + 2 + 1 })
    expect(w.value.naBojlerKwh).toBeCloseTo(bojler, 9)
    expect(w.value.bojlerTKoniecC).toBeCloseTo(50, 9)
    expect(w.value.naBaterieKwh).toBeCloseTo(8, 9)
    expect(w.value.socKoniecPct).toBeCloseTo(100, 9)
    expect(w.value.nadwyzkaKwh).toBeCloseTo(1, 9)
    expect(w.status).toBe("VALID")
  })

  it("bateria wymaga ogrzania: grzałki BMS najpierw; bez pełnego ogrzania bateria się nie ładuje", () => {
    const w = calculateOknoSloneczne({ ...BAZA, grzalkiBmsKwh: 0.5 })
    expect(w.value.naGrzalkiBmsKwh).toBeCloseTo(0.5, 12)
    expect(w.value.naBaterieKwh).toBeCloseTo(4, 12)
    const malo = calculateOknoSloneczne({ ...BAZA, energiaOknaKwh: 0.3, grzalkiBmsKwh: 0.5 })
    expect(malo.value.naBaterieKwh).toBe(0)
    expect(malo.value.socKoniecPct).toBe(20)
  })

  it("🟡 okno nie pokrywa zużycia domu", () => {
    const w = calculateOknoSloneczne({ ...BAZA, zuzycieWOknieKwh: 5 })
    expect(w.value.energiaDoPodzialuKwh).toBe(0)
    expect(w.warnings[0]!.code).toBe("OKNO-NIE-POKRYWA-ZUZYCIA")
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("brak danych → INCOMPLETE; SoC > 100% albo ujemne → INVALID_INPUT", () => {
    expect(calculateOknoSloneczne({ ...BAZA, socStartPct: null }).status).toBe("INCOMPLETE")
    expect(calculateOknoSloneczne({ ...BAZA, bojlerTCelC: null }).status).toBe("INCOMPLETE")
    expect(calculateOknoSloneczne({ ...BAZA, bojlerL: 0, bojlerTCelC: null }).status).toBe("VALID")
    expect(calculateOknoSloneczne({ ...BAZA, socStartPct: 120 }).warnings[0]!.code).toBe("OKNO-SOC-POZA-ZAKRESEM")
    expect(calculateOknoSloneczne({ ...BAZA, bojlerL: -1 }).warnings[0]!.code).toBe("OKNO-WARTOSC-UJEMNA")
  })
})
