import { describe, expect, it } from "vitest"
import { CIEPLO_WLASCIWE_POWIETRZA_J_KG_K, GESTOSC_POWIETRZA_KG_M3 } from "../../wentylacja-odzysk-ciepla/constants"
import { calculateWentylacjaPorownanie } from "../calculator"
import type { WentylacjaPorownanieInput } from "../input"

/** Wh per (m³/h · K) of a day: ρ·cp/3600 × 24. */
const K = ((GESTOSC_POWIETRZA_KG_M3 * CIEPLO_WLASCIWE_POWIETRZA_J_KG_K) / 3600) * 24
// ΔT = 20 K: natural 8 kWh/doba, mechanical (η = 80%) 3 kWh/doba
const STRUMIEN_NAT = 8000 / (K * 20)
const STRUMIEN_MECH = 3000 / (K * 20 * 0.2)

const BAZA: WentylacjaPorownanieInput = {
  tWewC: 20,
  tZewnC: 0,
  strumienNaturalnyM3H: STRUMIEN_NAT,
  strumienMechanicznyM3H: STRUMIEN_MECH,
  sprawnoscOdzyskuPct: 80,
  mocWentylatorowW: 500 / 24,
  copOgrzewania: 1,
  dniSezonu: 0,
  cenaPraduZlKwh: 0,
  doplataZl: 0,
  szczelnyDom: false,
}

describe("calculateWentylacjaPorownanie (M6/E20, dawne 5.26)", () => {
  it("tabela źródła: straty 8 vs 3 kWh/dobę, wentylatory 0,5 → oszczędność 4,5 kWh/dobę przy COP 1", () => {
    const w = calculateWentylacjaPorownanie(BAZA)
    expect(w.value.stratyNaturalnaKwh).toBeCloseTo(8, 12)
    expect(w.value.stratyMechanicznaKwh).toBeCloseTo(3, 12)
    expect(w.value.pradWentylatorowKwh).toBeCloseTo(0.5, 12)
    expect(w.value.oszczednoscNettoKwh).toBeCloseTo(4.5, 12)
    expect(w.status).toBe("VALID")
  })

  it("„1600 kWh rocznie, zwrot 6 lat” = 4,5 × 365 = 1642,5 kWh; przy 1 zł/kWh dopłata 9855 zł → 6 lat", () => {
    const w = calculateWentylacjaPorownanie({ ...BAZA, dniSezonu: 365, cenaPraduZlKwh: 1, doplataZl: 9855 })
    expect(w.value.oszczednoscSezonKwh).toBeCloseTo(1642.5, 9)
    expect(w.value.zwrotLat).toBeCloseTo(6, 9)
  })

  it("niespójność źródła: przy pompie ciepła (COP 3) oszczędność prądu to 5/3 − 0,5 ≈ 1,17 kWh/dobę, nie 4,5", () => {
    const w = calculateWentylacjaPorownanie({ ...BAZA, copOgrzewania: 3 })
    expect(w.value.oszczednoscNettoKwh).toBeCloseTo(5 / 3 - 0.5, 12)
  })

  it("🟡 wentylatory zużywają więcej, niż oszczędzają (COP 4, wentylatory 100 W)", () => {
    const w = calculateWentylacjaPorownanie({ ...BAZA, copOgrzewania: 4, mocWentylatorowW: 100 })
    expect(w.value.oszczednoscNettoKwh).toBeCloseTo(1.25 - 2.4, 12)
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["WPOR-MECHANICZNA-NIE-OSZCZEDZA", "warning"]])
  })

  it("🟡 źródła: szczelny dom; ogrzewanie nieelektryczne (COP 0) → ℹ️ bez bilansu", () => {
    const w = calculateWentylacjaPorownanie({ ...BAZA, szczelnyDom: true, copOgrzewania: 0 })
    expect(w.warnings.map((x) => x.code)).toEqual(["WPOR-NATURALNA-SZCZELNY-DOM", "WPOR-BEZ-COP"])
    expect(w.value.oszczednoscNettoKwh).toBeNull()
    expect(w.value.oszczednoscCieplaKwh).toBeCloseTo(5, 12)
  })

  it("brak danych → INCOMPLETE; sprawność > 100% albo dni > 366 → INVALID_INPUT", () => {
    expect(calculateWentylacjaPorownanie({ ...BAZA, tZewnC: null }).status).toBe("INCOMPLETE")
    expect(calculateWentylacjaPorownanie({ ...BAZA, sprawnoscOdzyskuPct: 120 }).status).toBe("INVALID_INPUT")
    expect(calculateWentylacjaPorownanie({ ...BAZA, dniSezonu: 400 }).warnings[0]!.code).toBe("WPOR-DNI-POZA-ZAKRESEM")
  })
})
