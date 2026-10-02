import { describe, expect, it } from "vitest"
import { calculateOsadNaPv } from "../calculator"
import type { OsadNaPvInput } from "../input"

const BAZA: OsadNaPvInput = {
  rodzaj: "sypki",
  katDeg: 10,
  produkcjaDobaKwh: 4,
  dniWlasne: null,
  pozostalaWlasnaPct: null,
  nierownoStringi: false,
  powierzchniaM2: 0,
  kabel: { mocWNaM2: 0, godziny: 0 },
  folia: { mocWNaM2: 0, godziny: 0 },
  automat: { mocW: 0, godziny: 0 },
}

describe("calculateOsadNaPv 2.0.0 (M7/E7 + E14, dawne 6.7, 6.20, 6.18) — tabela „co jeśli”", () => {
  it("śnieg bez żadnych liczb od usera: strata dla 1, 3, 5 i 7 dni przy produkcji 0% (przykład źródła); 3 dni oznaczone jako przykład źródła", () => {
    const w = calculateOsadNaPv(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.value.pozostalaZrodlo).toBe("przyklad-zrodla")
    expect(w.value.utrataNaDobeKwh).toBeCloseTo(4, 12)
    expect(w.value.scenariusze.map((s) => [s.dni, s.utrataKwh, s.przykladZrodla])).toEqual([
      [1, 4, false],
      [3, 12, true],
      [5, 20, false],
      [7, 28, false],
    ])
    expect(w.value.dniReferencji).toBe(3)
    expect(w.value.mozeZsunacSie).toBe(false)
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["OSAD-SNIEG-NIE-ZSUNIE", "warning"]])
  })

  it("kąt > 30° → śnieg sypki może się zsunąć (ℹ️); 30° dokładnie → jeszcze nie", () => {
    const w = calculateOsadNaPv({ ...BAZA, katDeg: 35 })
    expect(w.value.mozeZsunacSie).toBe(true)
    expect(w.status).toBe("VALID")
    expect(calculateOsadNaPv({ ...BAZA, katDeg: 30 }).value.mozeZsunacSie).toBe(false)
  })

  it("szadź (Ekran 14): przykład źródła 5% po 48 h = 2 doby → strata 95% × 2 doby; tabela ma też 1, 3, 5, 7 dni", () => {
    const w = calculateOsadNaPv({ ...BAZA, rodzaj: "szadz", katDeg: null })
    expect(w.value.pozostalaProdukcjaPct).toBe(5)
    expect(w.value.dniReferencji).toBe(2)
    const dwie = w.value.scenariusze.find((s) => s.dni === 2)!
    expect(dwie.przykladZrodla).toBe(true)
    expect(dwie.utrataKwh).toBeCloseTo(7.6, 12)
    expect(dwie.produkcjaPodOsademKwh).toBeCloseTo(0.4, 12)
    expect(w.value.scenariusze.map((s) => s.dni)).toEqual([1, 2, 3, 5, 7])
    expect(w.value.mozeZsunacSie).toBeNull()
    expect(w.warnings.map((x) => x.code)).toEqual(["OSAD-SZADZ-NIE-ZSUWA"])
  })

  it("własne dni i własny procent zastępują przykłady: dodatkowy wiersz „własny”, referencja = własne dni", () => {
    const w = calculateOsadNaPv({ ...BAZA, dniWlasne: 4, pozostalaWlasnaPct: 25 })
    expect(w.value.pozostalaZrodlo).toBe("wlasna")
    expect(w.value.utrataNaDobeKwh).toBeCloseTo(3, 12)
    const wlasny = w.value.scenariusze.find((s) => s.wlasny)!
    expect(wlasny.dni).toBe(4)
    expect(wlasny.utrataKwh).toBeCloseTo(12, 12)
    expect(w.value.dniReferencji).toBe(4)
  })

  it("mokry, lód i nierówne stringi → 🟡", () => {
    expect(calculateOsadNaPv({ ...BAZA, rodzaj: "mokry" }).warnings.map((x) => x.code)).toEqual(["OSAD-MOKRY-PRZYKLEJA"])
    expect(calculateOsadNaPv({ ...BAZA, rodzaj: "lod", nierownoStringi: true }).warnings.map((x) => x.code)).toEqual([
      "OSAD-LOD-BLOKUJE",
      "OSAD-NIEROWNO-STRINGI",
    ])
  })

  it("brak rodzaju albo produkcji → INCOMPLETE; procent > 100, kąt > 90 albo ujemna moc → INVALID_INPUT", () => {
    expect(calculateOsadNaPv({ ...BAZA, rodzaj: null }).status).toBe("INCOMPLETE")
    expect(calculateOsadNaPv({ ...BAZA, produkcjaDobaKwh: 0 }).status).toBe("INCOMPLETE")
    expect(calculateOsadNaPv({ ...BAZA, pozostalaWlasnaPct: 120 }).status).toBe("INVALID_INPUT")
    expect(calculateOsadNaPv({ ...BAZA, katDeg: 95 }).warnings[0]!.code).toBe("OSAD-POZA-ZAKRESEM")
    expect(calculateOsadNaPv({ ...BAZA, kabel: { mocWNaM2: -1, godziny: 1 } }).warnings[0]!.code).toBe("OSAD-WARTOSC-UJEMNA")
  })
})

describe("calculateOsadNaPv 2.0.0 — opcje aktywne: bilans energii (break-even)", () => {
  // Strata dobowa 4 kWh (śnieg 0%). Kabel 200 W/m² × 10 m² = 2 kW × 2 h = 4 kWh; odzysk dla d dni = 4·(d − 2/24).
  const Z_KABLEM: OsadNaPvInput = { ...BAZA, katDeg: 40, powierzchniaM2: 10, kabel: { mocWNaM2: 200, godziny: 2 } }

  it("energia grzania = W/m² × powierzchnia × godziny; odzysk = strata dobowa × (dni − h/24); próg zwrotu w dniach", () => {
    const o = calculateOsadNaPv(Z_KABLEM).value.opcjeAktywne[0]!
    expect(o.id).toBe("kabel")
    expect(o.mocW).toBe(2000)
    expect(o.energiaKwh).toBeCloseTo(4, 12)
    expect(o.wiersze.find((r) => r.dni === 1)!.odzyskKwh).toBeCloseTo(4 * (1 - 2 / 24), 12)
    expect(o.progOplacalnosciDni).toBeCloseTo(2 / 24 + 1, 12)
    // exactly at the break-even the recovered energy equals the used energy
    const naProgu = calculateOsadNaPv({ ...Z_KABLEM, dniWlasne: 2 / 24 + 1 }).value.opcjeAktywne[0]!
    expect(naProgu.wiersze.find((r) => Math.abs(r.dni - (2 / 24 + 1)) < 1e-12)!.odzyskKwh).toBeCloseTo(4, 9)
    expect(naProgu.oplacaWReferencji).toBe(true)
  })

  it("🟡 gdy grzanie zużywa więcej, niż odzyskuje w scenariuszu odniesienia; zwraca się od progu; zawsze ℹ️ o gwarancji", () => {
    // dni własne 1: odzysk 3,67 kWh < 4 kWh → 🟡
    const zle = calculateOsadNaPv({ ...Z_KABLEM, dniWlasne: 1 })
    expect(zle.value.opcjeAktywne[0]!.oplacaWReferencji).toBe(false)
    expect(zle.warnings.map((x) => [x.code, x.level])).toContainEqual(["OSAD-GRZANIE-NIE-ZWRACA-KABEL", "warning"])
    // 3 dni (przykład źródła): odzysk 11,67 kWh > 4 kWh → zwraca się, brak 🟡
    const dobrze = calculateOsadNaPv(Z_KABLEM)
    expect(dobrze.value.opcjeAktywne[0]!.oplacaWReferencji).toBe(true)
    expect(dobrze.warnings.map((x) => x.code)).not.toContain("OSAD-GRZANIE-NIE-ZWRACA-KABEL")
    expect(dobrze.warnings.map((x) => x.code)).toContain("OSAD-GWARANCJA")
    expect(dobrze.assumptions).toContainEqual({ kod: "OSAD-ZALOZENIE-ODZYSK" })
  })

  it("nic do odzyskania (produkcja pod osadem prawie normalna) → grzanie nigdy się nie zwraca, próg = null", () => {
    const w = calculateOsadNaPv({ ...Z_KABLEM, pozostalaWlasnaPct: 100 })
    const o = w.value.opcjeAktywne[0]!
    expect(o.progOplacalnosciDni).toBeNull()
    expect(o.oplacaWReferencji).toBe(false)
    expect(w.warnings.map((x) => x.code)).toContain("OSAD-GRZANIE-NIE-ZWRACA-KABEL")
  })

  it("folia i automat liczone tak samo; automat podaje moc łączną (bez powierzchni)", () => {
    const w = calculateOsadNaPv({
      ...BAZA,
      katDeg: 40,
      powierzchniaM2: 10,
      folia: { mocWNaM2: 100, godziny: 4 },
      automat: { mocW: 300, godziny: 1 },
    })
    const [folia, automat] = w.value.opcjeAktywne
    expect(folia!.id).toBe("folia")
    expect(folia!.energiaKwh).toBeCloseTo(4, 12)
    expect(automat!.id).toBe("automat")
    expect(automat!.energiaKwh).toBeCloseTo(0.3, 12)
  })

  it("niepełne dane opcji (np. brak powierzchni) → ℹ️ opcja nieoceniona, bez wyniku opcji", () => {
    const w = calculateOsadNaPv({ ...BAZA, kabel: { mocWNaM2: 200, godziny: 2 } })
    expect(w.value.opcjeAktywne).toEqual([])
    expect(w.warnings.map((x) => [x.code, x.level])).toContainEqual(["OSAD-OPCJA-NIEPELNA", "info"])
    expect(w.warnings.map((x) => x.code)).not.toContain("OSAD-GWARANCJA")
  })
})
