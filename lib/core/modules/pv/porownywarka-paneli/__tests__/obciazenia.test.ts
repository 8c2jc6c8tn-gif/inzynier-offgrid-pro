import { describe, expect, it } from "vitest"
import type { DanePanelu, ObciazeniePaneluKarta, WarunkiObciazen } from "../input"
import { najwyzszeWykorzystaniePct, nosnoscObliczeniowaPa, obciazeniaMiejsca, ocenPanelObciazenia } from "../obciazenia"

const WARUNKI: WarunkiObciazen = {
  strefaSniegowa: 3,
  strefaWiatrowa: 1,
  wysokoscNpmM: 300,
  kategoriaTerenu: "II",
  wysokoscKonstrukcjiM: 5,
  ekspozycjaSniegu: "normalny",
  montaz: "pochylony-na-konstrukcji",
}
const KARTA: ObciazeniePaneluKarta = { przodPa: 5400, tylPa: 2400, rodzaj: "testowe" }
const panel = (obciazenie: ObciazeniePaneluKarta | null): DanePanelu => ({
  id: "p",
  nazwa: "P",
  pmaxW: 450,
  cenaBruttoZl: null,
  gammaPctNaC: null,
  noctC: null,
  sprawnoscWzglednaPrzy200WPct: null,
  degradacjaPierwszyRokPct: null,
  degradacjaLiniowaPctNaRok: null,
  dlugoscMm: 1762,
  szerokoscMm: 1134,
  masaKg: 22,
  bifacjalny: false,
  obciazenie,
})

describe("obciazeniaMiejsca", () => {
  it("śnieg: strefa 3 na 300 m → s_k = 1,2 kN/m²; α = 30° → μ1 = 0,8; s = 0,96 kN/m², prostopadle do panelu 960·cos²30° = 720 Pa; ψ0 = 0,5", () => {
    const m = obciazeniaMiejsca(WARUNKI, 30)!
    expect(m.snieg).toMatchObject({ mu1: 0.8, ce: 1, ct: 1, psi0: 0.5 })
    expect(m.snieg!.skKnM2).toBeCloseTo(1.2, 10)
    expect(m.snieg!.sKnM2).toBeCloseTo(0.96, 10)
    expect(m.snieg!.sNormalnaPa).toBeCloseTo(720, 8)
  })

  it("wiatr: strefa 1 ≤ 300 m → q_b = 300 Pa; teren II, 5 m → c_e = 2,3·0,5^0,24 = 1,9475; q_p = 584,25 Pa", () => {
    const m = obciazeniaMiejsca(WARUNKI, 30)!
    expect(m.wiatr!.qbPa).toBe(300)
    expect(m.wiatr!.ceZ).toBeCloseTo(1.94751, 5)
    expect(m.wiatr!.qpPa).toBeCloseTo(584.254, 3)
    expect(m.powodBrakuWiatru).toBeNull()
  })

  it("panele równoległe do połaci bez wybranego rodzaju połaci: wiatru nie liczy, śnieg liczy; kąt > 30° na konstrukcji: poza zakresem; brak pola: brak danych", () => {
    expect(obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly" }, 30)).toMatchObject({ wiatr: null, powodBrakuWiatru: "brak-typu-dachu" })
    expect(obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly" }, 30)!.snieg).not.toBeNull()
    expect(obciazeniaMiejsca(WARUNKI, 95)).toMatchObject({ wiatr: null, powodBrakuWiatru: "kat-poza-zakresem" })
    expect(obciazeniaMiejsca({ ...WARUNKI, strefaWiatrowa: null }, 30)).toMatchObject({ wiatr: null, powodBrakuWiatru: "brak-danych" })
    expect(obciazeniaMiejsca({ ...WARUNKI, strefaSniegowa: null }, 30)!.snieg).toBeNull()
  })

  it("panele na konstrukcji 30–90°: WŁASNE oszacowanie aplikacji (wartości z 30° Tablicy 7.6), oznaczone jako takie", () => {
    const na30 = obciazeniaMiejsca(WARUNKI, 30)!.wiatr!
    expect(na30.zrodloCp).toBe("wiata")
    for (const kat of [30.5, 45, 60, 90]) {
      const w = obciazeniaMiejsca(WARUNKI, kat)!.wiatr!
      expect(w.zrodloCp).toBe("wlasne")
      expect(w.cp).toEqual(na30.cp)
    }
    expect(obciazeniaMiejsca(WARUNKI, 90.5)).toMatchObject({ wiatr: null, powodBrakuWiatru: "kat-poza-zakresem" })
    expect(obciazeniaMiejsca(WARUNKI, -1)).toMatchObject({ wiatr: null, powodBrakuWiatru: "kat-poza-zakresem" })
  })

  it("dach czterospadowy (Tablica 7.5) i ściana (Tablica 7.1) dla paneli równoległych", () => {
    const hip = obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly", typDachu: "czterospadowy" }, 30)!
    expect(hip.wiatr!.zrodloCp).toBe("polac")
    expect(hip.wiatr!.cp.dociskKrawedz).toBeCloseTo(0.7, 10)
    const sciana = obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly", typDachu: "sciana" }, 90)!
    expect(sciana.wiatr!.cp).toEqual({ dociskSrodek: 1.0, dociskKrawedz: 1.0, odrywanieSrodek: 0.7, odrywanieKrawedz: 1.4 })
    // a wall needs a vertical panel; a pitched panel with “wall” chosen is out of range
    expect(obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly", typDachu: "sciana" }, 35)).toMatchObject({ wiatr: null, powodBrakuWiatru: "kat-poza-zakresem" })
  })

  it("panele równoległe do połaci z wybranym rodzajem połaci: wiatr z Tablic 7.3/7.4 (cpe,1 połaci), także dla kątów > 30°, do 75°", () => {
    const jedno = obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly", typDachu: "jednospadowy" }, 30)!
    expect(jedno.powodBrakuWiatru).toBeNull()
    expect(jedno.wiatr!.zrodloCp).toBe("polac")
    expect(jedno.wiatr!.cp.odrywanieKrawedz).toBeCloseTo(2.9, 10)
    const strome = obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly", typDachu: "dwuspadowy" }, 60)!
    expect(strome.wiatr).not.toBeNull()
    expect(obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly", typDachu: "dwuspadowy" }, 3)).toMatchObject({ wiatr: null, powodBrakuWiatru: "kat-poza-zakresem" })
    expect(obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly", typDachu: "dwuspadowy" }, 80)).toMatchObject({ wiatr: null, powodBrakuWiatru: "kat-poza-zakresem" })
    // Panels on a frame ignore the roof type and keep Table 7.6.
    expect(obciazeniaMiejsca({ ...WARUNKI, typDachu: "dwuspadowy" }, 30)!.wiatr!.zrodloCp).toBe("wiata")
  })

  it("nic do policzenia (brak stref) = null", () => {
    expect(obciazeniaMiejsca({ ...WARUNKI, strefaSniegowa: null, strefaWiatrowa: null }, 30)).toBeNull()
  })

  it("pion (ogrodzenie, 90°): μ1 = 0, więc śniegu na panelu nie ma", () => {
    expect(obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly" }, 90)!.snieg!.sNormalnaPa).toBeCloseTo(0, 10)
  })

  it("ψ0 śniegu rośnie do 0,7 powyżej 1000 m n.p.m.", () => {
    expect(obciazeniaMiejsca({ ...WARUNKI, wysokoscNpmM: 1200 }, 30)!.snieg!.psi0).toBe(0.7)
  })
})

describe("nosnoscObliczeniowaPa", () => {
  it("testowa 5400 Pa → obliczeniowa 3600 Pa (÷ 1,5); karta z wartością obliczeniową bez zmian", () => {
    expect(nosnoscObliczeniowaPa(5400, "testowe")).toBeCloseTo(3600, 10)
    expect(nosnoscObliczeniowaPa(3600, "obliczeniowe")).toBe(3600)
  })
})

describe("ocenPanelObciazenia — ręczne rachunki: 22 kg, 1762×1134 mm, α = 30°, karta 5400/2400 Pa testowe", () => {
  const m = obciazeniaMiejsca(WARUNKI, 30)!
  const o = ocenPanelObciazenia(panel(KARTA), m)
  const ocena = (s: string) => o.oceny.find((x) => x.sytuacja === s)!

  it("ciężar własny prostopadle: 22·9,80665/1,99811·cos30° = 93,51 Pa", () => {
    expect(o.ciezarWlasnyPa).toBeCloseTo(93.509, 2)
  })

  it("docisk w środku pola: 1,35·93,51 + 1,5·max(720 + 0,6·W, W + 0,5·720), W = 2,2·584,25 → 2594,3 Pa = 72% z 3600 Pa", () => {
    expect(ocena("docisk-srodek").edPa).toBeCloseTo(2594.28, 1)
    expect(ocena("docisk-srodek").rdPa).toBeCloseTo(3600, 8)
    expect(ocena("docisk-srodek").wykorzystaniePct).toBeCloseTo(72.06, 1)
    expect(ocena("docisk-srodek").przekroczone).toBe(false)
  })

  it("docisk na krawędzi (cp = 3,2) → 3470,7 Pa = 96,4%; odrywanie: 1,5·3,0·q_p = 2629,1 Pa wobec 1600 Pa (164%) w środku i 3330,2 Pa (208%) na krawędzi", () => {
    expect(ocena("docisk-krawedz").wykorzystaniePct).toBeCloseTo(96.41, 1)
    expect(ocena("odrywanie-srodek").edPa).toBeCloseTo(2629.14, 1)
    expect(ocena("odrywanie-srodek").rdPa).toBeCloseTo(1600, 8)
    expect(ocena("odrywanie-srodek").wykorzystaniePct).toBeCloseTo(164.32, 1)
    expect(ocena("odrywanie-krawedz").wykorzystaniePct).toBeCloseTo(208.14, 1)
    expect(ocena("odrywanie-krawedz").przekroczone).toBe(true)
    expect(najwyzszeWykorzystaniePct(o)).toBeCloseTo(208.14, 1)
  })

  it("bez wiatru (panele równoległe): jedna ocena „docisk” = 1,35·g + 1,5·śnieg = 1206,2 Pa = 33,5%", () => {
    const bez = ocenPanelObciazenia(panel(KARTA), obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly" }, 30)!)
    expect(bez.oceny.map((x) => x.sytuacja)).toEqual(["docisk"])
    expect(bez.oceny[0]!.edPa).toBeCloseTo(1206.24, 1)
    expect(bez.oceny[0]!.wykorzystaniePct).toBeCloseTo(33.51, 1)
  })

  it("karta Trina (śnieg 5400, wiatr 4000): docisk z wiatrem liczony z niższą wartością 4000/1,5 = 2667 Pa", () => {
    const trina = ocenPanelObciazenia(panel({ przodPa: 5400, tylPa: 4000, wiatrPrzodPa: 4000, rodzaj: "testowe" }), m)
    expect(trina.oceny.find((x) => x.sytuacja === "docisk-srodek")!.rdPa).toBeCloseTo(4000 / 1.5, 8)
    expect(trina.oceny.find((x) => x.sytuacja === "odrywanie-srodek")!.rdPa).toBeCloseTo(4000 / 1.5, 8)
  })

  it("karta z wartością obliczeniową (JAM54D40 LR: 3600/1600 Pa) nie jest dzielona", () => {
    const lr = ocenPanelObciazenia(panel({ przodPa: 3600, tylPa: 1600, rodzaj: "obliczeniowe" }), m)
    expect(lr.oceny.find((x) => x.sytuacja === "docisk-srodek")!.rdPa).toBe(3600)
    expect(lr.oceny.find((x) => x.sytuacja === "odrywanie-srodek")!.rdPa).toBe(1600)
  })

  it("brak karty: obciążenie jest, nośności i wykorzystania nie ma (null, nie zero); brak liczby od tyłu = odrywanie bez oceny", () => {
    const bez = ocenPanelObciazenia(panel(null), m)
    expect(bez.maNosnosc).toBe(false)
    expect(najwyzszeWykorzystaniePct(bez)).toBeNull()
    expect(bez.oceny.every((x) => x.rdPa === null && x.przekroczone === null)).toBe(true)
    const bezTylu = ocenPanelObciazenia(panel({ przodPa: 5400, tylPa: null, rodzaj: "testowe" }), m)
    expect(bezTylu.oceny.find((x) => x.sytuacja === "odrywanie-srodek")!.rdPa).toBeNull()
    expect(bezTylu.oceny.find((x) => x.sytuacja === "docisk-srodek")!.rdPa).not.toBeNull()
  })

  it("bez masy albo wymiarów panelu ciężar własny nie jest liczony (null) i nie wchodzi do kombinacji", () => {
    const bezMasy = ocenPanelObciazenia({ ...panel(KARTA), masaKg: null }, obciazeniaMiejsca({ ...WARUNKI, montaz: "rownolegly" }, 30)!)
    expect(bezMasy.ciezarWlasnyPa).toBeNull()
    expect(bezMasy.oceny[0]!.edPa).toBeCloseTo(1.5 * 720, 8)
  })
})
