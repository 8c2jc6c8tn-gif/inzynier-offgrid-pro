import { describe, expect, it } from "vitest"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { znajdzPanelKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import { calculatePorownywarkaPaneli } from "../calculator"
import type { DanePanelu, PorownywarkaInput, WarunkiObciazen } from "../input"
import { domyslnyWyborKryteriow } from "../kryteria"

const rok = (): RekordGodzinowy[] => {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => {
    const czasUtcMs = start + h * 3_600_000
    const m = new Date(czasUtcMs).getUTCMonth()
    const g = m === 0 ? 200 : m === 6 ? 600 : 0
    return { czasUtcMs, ghi: g, dni: 0, dhi: g, tempC: m === 0 ? -5 : 20 }
  })
}
const ja500: DanePanelu = { ...znajdzPanelKatalogu("ja-solar-jam60d41-lb-500")!, cenaBruttoZl: null }
const WARUNKI: WarunkiObciazen = {
  strefaSniegowa: 3,
  strefaWiatrowa: 1,
  wysokoscNpmM: 300,
  kategoriaTerenu: "II",
  wysokoscKonstrukcjiM: 5,
  ekspozycjaSniegu: "normalny",
  montaz: "pochylony-na-konstrukcji",
}
const wejscie = (obciazenia: WarunkiObciazen | null | undefined, panele: DanePanelu[] = [ja500], nachylenieDeg = 30): PorownywarkaInput => ({
  szerokoscGeograficzna: 52.2,
  dlugoscGeograficzna: 21,
  daneGodzinowe: rok(),
  miejsce: { nachylenieDeg, azymutDeg: 180, albedo: 0.2 },
  liczbaPaneli: 4,
  panele,
  wycena: null,
  kryteria: domyslnyWyborKryteriow(),
  ...(obciazenia !== undefined ? { obciazenia } : {}),
})

describe("calculatePorownywarkaPaneli — obciążenia (spec 32)", () => {
  it("bez warunków miejsca: brak ocen, brak ostrzeżeń i założeń o obciążeniach", () => {
    const r = calculatePorownywarkaPaneli(wejscie(undefined))
    expect(r.value.obciazeniaMiejsca).toBeNull()
    expect(r.value.panele[0]!.obciazenia).toBeNull()
    expect(r.warnings.map((w) => w.code).some((k) => k.startsWith("PORP-OBC"))).toBe(false)
    expect(r.assumptions.some((a) => typeof a !== "string" && a.kod.startsWith("PORP-ZAL-OBC"))).toBe(false)
  })

  it("panel z kartą 5400/2400 Pa przy wietrze 30°: odrywanie na krawędzi 208% → ostrzeżenie „przekroczone” (żółte, nie twardy stop) i założenia", () => {
    const r = calculatePorownywarkaPaneli(wejscie(WARUNKI))
    const o = r.value.panele[0]!.obciazenia!
    expect(o.oceny.map((x) => x.sytuacja)).toEqual(["docisk-srodek", "docisk-krawedz", "odrywanie-srodek", "odrywanie-krawedz"])
    const ostrz = r.warnings.find((w) => w.code === "PORP-OBC-PRZEKROCZONE")!
    expect(ostrz.level).toBe("warning")
    expect(ostrz.params).toMatchObject({ wykorzystanie: Math.round(o.oceny[3]!.wykorzystaniePct!) })
    const kody = r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))
    expect(kody).toEqual(expect.arrayContaining(["PORP-ZAL-OBC-SNIEG", "PORP-ZAL-OBC-WIATR", "PORP-ZAL-OBC-KOMBINACJA", "PORP-ZAL-OBC-NOSNOSC"]))
  })

  it("niski kąt i mała strefa: wszystko mieści się — brak ostrzeżenia o przekroczeniu", () => {
    // 0°, strefa wiatrowa 1, teren III, 2 m: q_p = 300·1,9·(0,2)^0,26 (z = max(2; 5) = 5 m → 1,9·0,5^0,26) ≈ 475 Pa; cp,net odrywania krawędzi 2,2 → 1,5·2,2·475 ≈ 1570 Pa < 1600 Pa
    const r = calculatePorownywarkaPaneli(wejscie({ ...WARUNKI, kategoriaTerenu: "III", wysokoscKonstrukcjiM: 2 }, [ja500], 0))
    expect(r.value.panele[0]!.obciazenia!.oceny.every((x) => x.przekroczone === false)).toBe(true)
    expect(r.warnings.map((w) => w.code)).not.toContain("PORP-OBC-PRZEKROCZONE")
  })

  it("panel bez nośności z karty: obciążenie pokazane, ostrzeżenie informacyjne zamiast oceny", () => {
    const r = calculatePorownywarkaPaneli(wejscie(WARUNKI, [{ ...ja500, obciazenie: null }]))
    expect(r.value.panele[0]!.obciazenia!.maNosnosc).toBe(false)
    const w = r.warnings.find((x) => x.code === "PORP-OBC-BRAK-NOSNOSCI")!
    expect(w.level).toBe("info")
    expect(r.warnings.map((x) => x.code)).not.toContain("PORP-OBC-PRZEKROCZONE")
  })

  it("wysokość n.p.m. albo wysokość paneli poza zakresem → INVALID_INPUT", () => {
    expect(calculatePorownywarkaPaneli(wejscie({ ...WARUNKI, wysokoscNpmM: 9000 })).status).toBe("INVALID_INPUT")
    expect(calculatePorownywarkaPaneli(wejscie({ ...WARUNKI, wysokoscKonstrukcjiM: 0 })).status).toBe("INVALID_INPUT")
    expect(calculatePorownywarkaPaneli(wejscie(WARUNKI, [{ ...ja500, obciazenie: { przodPa: 0, tylPa: null, rodzaj: "testowe" } }])).status).toBe("INVALID_INPUT")
  })
})
