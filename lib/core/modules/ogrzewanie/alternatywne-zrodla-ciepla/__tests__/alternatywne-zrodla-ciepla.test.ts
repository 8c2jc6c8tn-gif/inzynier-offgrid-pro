import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../zapotrzebowanie-co-cwu/constants"
import { calculateAlternatywneZrodlaCiepla } from "../calculator"
import type { AlternatywneZrodlaCieplaInput } from "../input"

const BAZA: AlternatywneZrodlaCieplaInput = {
  zrodlo: null,
  zapotrzebowanieKw: 0,
  kominekMocKw: 0,
  kominekDoWodyPct: 0,
  kominekZabezpieczenieBezPradu: false,
  irMocW: 0,
  irGodzinNaDobe: 0,
  irJakoPodstawowe: false,
  matyMocWm2: 0,
  matyPowierzchniaM2: 0,
  matyStropNieizolowany: false,
  pcmObjetoscL: 0,
  pcmGestoscKgL: 0,
  pcmCieploTopnieniaKjKg: 0,
  buforDeltaTK: 0,
}

describe("calculateAlternatywneZrodlaCiepla (M6/2A, dawne 5.32–5.36)", () => {
  it("kominek źródła: 10 kW × 70% → 7 kW do wody, 3 kW do pomieszczenia; „60%” przy 11,67 kW zapotrzebowania", () => {
    const w = calculateAlternatywneZrodlaCiepla({ ...BAZA, zrodlo: "kominek", kominekMocKw: 10, kominekDoWodyPct: 70, kominekZabezpieczenieBezPradu: true, zapotrzebowanieKw: 7 / 0.6 })
    expect(w.value.kominekDoWodyKw).toBeCloseTo(7, 12)
    expect(w.value.kominekDoPowietrzaKw).toBeCloseTo(3, 12)
    expect(w.value.pokrycieZapotrzebowaniaPct).toBeCloseTo(60, 9)
    expect(w.value.kominekPokrycieRazemPct).toBeCloseTo((10 / (7 / 0.6)) * 100, 9)
    expect(w.status).toBe("VALID")
  })

  it("🟡 kominek bez zabezpieczenia przed przegrzaniem przy braku prądu", () => {
    const w = calculateAlternatywneZrodlaCiepla({ ...BAZA, zrodlo: "kominek", kominekMocKw: 10, kominekDoWodyPct: 70 })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["ALT-KOMINEK-PRZEGRZANIE", "warning"]])
    expect(w.value.pokrycieZapotrzebowaniaPct).toBeNull()
  })

  it("IR źródła: 600 W × 1 h = 0,6 kWh; jako ogrzewanie podstawowe → 🟡", () => {
    const w = calculateAlternatywneZrodlaCiepla({ ...BAZA, zrodlo: "ir", irMocW: 600, irGodzinNaDobe: 1 })
    expect(w.value.irEnergiaKwhDoba).toBeCloseTo(0.6, 12)
    expect(w.warnings).toEqual([])
    const p = calculateAlternatywneZrodlaCiepla({ ...BAZA, zrodlo: "ir", irMocW: 600, irGodzinNaDobe: 1, irJakoPodstawowe: true })
    expect(p.warnings.map((x) => x.code)).toEqual(["ALT-IR-PUNKTOWE"])
  })

  it("maty: 60 W/m² × 100 m² = 6 kW → 100% przy 6 kW zapotrzebowania; nieizolowany strop → 🟡", () => {
    const w = calculateAlternatywneZrodlaCiepla({ ...BAZA, zrodlo: "maty", matyMocWm2: 60, matyPowierzchniaM2: 100, zapotrzebowanieKw: 6, matyStropNieizolowany: true })
    expect(w.value.matyMocKw).toBeCloseTo(6, 12)
    expect(w.value.pokrycieZapotrzebowaniaPct).toBeCloseTo(100, 12)
    expect(w.warnings.map((x) => x.code)).toEqual(["ALT-MATY-STROP"])
  })

  it("PCM źródła: 100 l × 1 kg/l × 200 kJ/kg = 5,56 kWh ≈ 300 l wody tylko przy ΔT ≈ 16 K (niespójność: źródło nie podaje ΔT ani gęstości)", () => {
    const w = calculateAlternatywneZrodlaCiepla({ ...BAZA, zrodlo: "pcm", pcmObjetoscL: 100, pcmGestoscKgL: 1, pcmCieploTopnieniaKjKg: 200, buforDeltaTK: 16 })
    expect(w.value.pcmEnergiaKwh).toBeCloseTo(20000 / 3600, 12)
    expect(w.value.rownowaznikWodyL).toBeCloseTo(20000 / 3600 / (WSPOLCZYNNIK_KWH_NA_L_K * 16), 9)
    expect(Math.round(w.value.rownowaznikWodyL!)).toBe(299)
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["ALT-PCM-KOSZT", "info"]])
    expect(w.status).toBe("VALID")
  })

  it("kocioł → OUT_OF_SCOPE (osobny ekran); brak danych → INCOMPLETE; udział > 100% → INVALID_INPUT", () => {
    expect(calculateAlternatywneZrodlaCiepla({ ...BAZA, zrodlo: "kociol-elektryczny" }).status).toBe("OUT_OF_SCOPE")
    expect(calculateAlternatywneZrodlaCiepla(BAZA).status).toBe("INCOMPLETE")
    expect(calculateAlternatywneZrodlaCiepla({ ...BAZA, zrodlo: "pcm", pcmObjetoscL: 100 }).status).toBe("INCOMPLETE")
    expect(calculateAlternatywneZrodlaCiepla({ ...BAZA, zrodlo: "kominek", kominekMocKw: 10, kominekDoWodyPct: 120 }).status).toBe("INVALID_INPUT")
  })
})
