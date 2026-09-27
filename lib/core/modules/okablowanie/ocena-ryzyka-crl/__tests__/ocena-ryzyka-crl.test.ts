import { describe, expect, it } from "vitest"
import { calculateOcenaRyzykaCrl } from "../calculator"
import type { OcenaRyzykaCrlInput } from "../input"

const BAZA: OcenaRyzykaCrlInput = {
  skutkiKrytyczne: false,
  srodowisko: "wiejskie",
  gestoscWyladowanNg: 1,
  dniBurzoweTd: null,
  napowietrznaNnKm: 0.4,
  kablowaNnKm: 0,
  napowietrznaSnKm: 0.6,
  kablowaSnKm: 0,
  dlugosciNiepelne: false,
  odlegloscDoSpdWSieciKm: null,
}
const zero = { napowietrznaNnKm: 0, kablowaNnKm: 0, napowietrznaSnKm: 0, kablowaSnKm: 0 }

describe("calculateOcenaRyzykaCrl (M5/E2, HD 60364-4-443 443.5)", () => {
  // Załącznik A — the norm's own examples 1–4 (values checked in Python).
  it("A.1 dom wiejski: L_P = 1,04, CRL = 85/1,04 = 81,7 → SPD wymagany", () => {
    const w = calculateOcenaRyzykaCrl(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.value!.lpKm).toBeCloseTo(1.04, 12)
    expect(w.value!.crl).toBeCloseTo(81.73076923076923, 9)
    expect(w.value).toMatchObject({ spdWymagany: true, powod: "crl", fEnv: 85 })
    expect(w.warnings[0]).toMatchObject({ code: "CRL-SPD-WYMAGANY", level: "warning" })
  })

  it("A.2 dom wiejski zasilany kablem SN 1 km, Ng 0,4: CRL = 1062,5 → nieobowiązkowy", () => {
    const w = calculateOcenaRyzykaCrl({ ...BAZA, ...zero, kablowaSnKm: 1, gestoscWyladowanNg: 0.4 })
    expect(w.value!.crl).toBeCloseTo(1062.5, 9)
    expect(w.value!.spdWymagany).toBe(false)
    expect(w.status).toBe("VALID")
  })

  it("A.3 dom miejski, linie napowietrzne: CRL = 850/1,04 = 817 → wymagany", () => {
    const v = calculateOcenaRyzykaCrl({ ...BAZA, srodowisko: "miejskie" }).value!
    expect(v.crl).toBeCloseTo(817.3076923076923, 9)
    expect(v.spdWymagany).toBe(true)
  })

  it("A.4 budynek miejski, kabel nn 1 km, Ng 0,5: CRL = 1700 → nieobowiązkowy (próg ≥ 1000)", () => {
    const v = calculateOcenaRyzykaCrl({ ...BAZA, ...zero, srodowisko: "miejskie", kablowaNnKm: 1, gestoscWyladowanNg: 0.5 }).value!
    expect(v.crl).toBeCloseTo(1700, 9)
    expect(v.spdWymagany).toBe(false)
  })

  it("nieznane długości: znany kabel 0,1 km → L_PAL = 0,9 km (przypis krajowy: 900 m)", () => {
    const w = calculateOcenaRyzykaCrl({ ...BAZA, ...zero, kablowaNnKm: 0.1, dlugosciNiepelne: true })
    expect(w.value!.dlugosciUzyte.napowietrznaNnKm).toBeCloseTo(0.9, 12)
    expect(w.value!.lpKm).toBeCloseTo(1.9, 12)
    expect(w.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toContain("CRL-ZALOZENIE-NIEZNANE-DLUGOSCI")
  })

  it("suma ponad 1 km albo ponad odległość do SPD w sieci → obcięcie od największej wagi", () => {
    const v = calculateOcenaRyzykaCrl({ ...BAZA, ...zero, napowietrznaNnKm: 0.3, napowietrznaSnKm: 2 }).value!
    expect(v.dlugosciUzyte).toEqual({ napowietrznaNnKm: 0.3, kablowaNnKm: 0, napowietrznaSnKm: 0.7, kablowaSnKm: 0 })
    expect(v.lpKm).toBeCloseTo(0.88, 12)
    const s = calculateOcenaRyzykaCrl({ ...BAZA, odlegloscDoSpdWSieciKm: 0.25 }).value!
    expect(s.dlugosciUzyte.napowietrznaNnKm).toBe(0.25)
    expect(s.lpKm).toBeCloseTo(0.5, 12)
  })

  it("off-grid bez linii zasilającej: L_P = 0 → brak wymogu z 443.5, informacje o stronie DC i przepięciach łączeniowych", () => {
    const w = calculateOcenaRyzykaCrl({ ...BAZA, ...zero, srodowisko: null, gestoscWyladowanNg: null })
    expect(w.status).toBe("VALID")
    expect(w.value).toMatchObject({ spdWymagany: false, powod: "brak-linii", crl: null, lpKm: 0 })
    expect(w.warnings.map((x) => x.code)).toEqual(["CRL-BRAK-LINII", "CRL-STRONA-DC-POZA", "CRL-PRZEPIECIA-LACZENIOWE"])
  })

  it("443.4 skutki krytyczne → wymagany bez oceny ryzyka", () => {
    const w = calculateOcenaRyzykaCrl({ ...BAZA, skutkiKrytyczne: true, srodowisko: null })
    expect(w.value).toMatchObject({ spdWymagany: true, powod: "skutki-krytyczne", crl: null })
    expect(w.warnings[0]!.code).toBe("CRL-SKUTKI-KRYTYCZNE")
  })

  it("Ng z dni burzowych: 25 dni → 2,5 (Uwaga 2); brak Ng i Td albo środowiska → INCOMPLETE", () => {
    const w = calculateOcenaRyzykaCrl({ ...BAZA, gestoscWyladowanNg: null, dniBurzoweTd: 25 })
    expect(w.value!.ngUzyte).toBeCloseTo(2.5, 12)
    expect(w.value!.crl).toBeCloseTo(85 / (1.04 * 2.5), 9)
    expect(calculateOcenaRyzykaCrl({ ...BAZA, gestoscWyladowanNg: null }).status).toBe("INCOMPLETE")
    expect(calculateOcenaRyzykaCrl({ ...BAZA, srodowisko: null }).status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT: ujemna długość, Ng poza zakresem", () => {
    const w = calculateOcenaRyzykaCrl({ ...BAZA, kablowaNnKm: -1, gestoscWyladowanNg: 40 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((x) => x.field)).toEqual(["gestoscWyladowanNg", "kablowaNnKm"])
  })
})
