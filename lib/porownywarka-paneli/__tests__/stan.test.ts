import { describe, expect, it } from "vitest"
import { KATALOG_PANELI_PV } from "@/lib/core/dane/katalog-paneli-pv"
import { aktywneMiejsce, budujWejscie, kolejnyId, KWOTY_ZESTAWOW, MIEJSCE_PUSTE, migrujStarySzkic, PANEL_PUSTY, seedZKatalogu, STAN_POCZATKOWY, wymiaryZMiejsca, type FormularzStan } from "../stan"

const t = (k: string, p?: Record<string, string | number>) => (p ? `${k}:${JSON.stringify(p)}` : k)

describe("migrujStarySzkic", () => {
  it("szkic sprzed A2 (kąty i liczba paneli na wierzchu) trafia do pierwszego miejsca, stare klucze znikają", () => {
    const stary = { ...STAN_POCZATKOWY, nachylenie: "35", azymut: "180", albedo: "", liczbaPaneli: "8", wymDlugosc: "6", wymSzerokosc: "4", wymMargines: "0.1", montaz: "rownolegly", powierzchniaId: "x" } as unknown as FormularzStan
    const nowy = migrujStarySzkic(stary)!
    expect(nowy.miejsca).toHaveLength(1)
    expect(nowy.miejsca[0]).toMatchObject({ id: "m1", nachylenie: "35", azymut: "180", liczbaPaneli: "8", wymDlugosc: "6", wymMargines: "0.1", powierzchniaId: "x" })
    for (const k of ["nachylenie", "azymut", "liczbaPaneli", "wymDlugosc", "montaz"]) expect(k in nowy).toBe(false)
    expect(migrujStarySzkic(nowy)).toBeNull()
  })

  it("szkic w nowym kształcie — bez zmian (null)", () => {
    expect(migrujStarySzkic(STAN_POCZATKOWY)).toBeNull()
  })
})

describe("miejsca i identyfikatory", () => {
  it("aktywneMiejsce: po id, a przy nieznanym id pierwsze; kolejnyId nie powtarza istniejących", () => {
    const st: FormularzStan = { ...STAN_POCZATKOWY, miejsca: [MIEJSCE_PUSTE("m1"), MIEJSCE_PUSTE("m3")], aktywneMiejsceId: "m3" }
    expect(aktywneMiejsce(st).id).toBe("m3")
    expect(aktywneMiejsce({ ...st, aktywneMiejsceId: "zgubione" }).id).toBe("m1")
    expect(kolejnyId("m", st.miejsca)).toBe("m4")
    expect(kolejnyId("p", [])).toBe("p1")
  })
})

describe("wymiaryZMiejsca i budujWejscie", () => {
  it("wymiary liczą się dopiero po wpisaniu wszystkich trzech liczb; margines 0 jest liczbą", () => {
    const m = { ...MIEJSCE_PUSTE("m1"), wymDlugosc: "6", wymSzerokosc: "4" }
    expect(wymiaryZMiejsca(m)).toBeNull()
    expect(wymiaryZMiejsca({ ...m, wymMargines: "0" })).toEqual({ dlugoscM: 6, szerokoscM: 4, marginesM: 0, montaz: "rownolegly" })
  })

  it("okno bez cienia trafia do wymiarów tylko przy montażu pochylonym i tylko, gdy wpisano oba końce", () => {
    const m = { ...MIEJSCE_PUSTE("m1"), wymDlugosc: "6", wymSzerokosc: "4", wymMargines: "0", oknoOd: "10", oknoDo: "14" }
    expect(wymiaryZMiejsca(m)).toEqual({ dlugoscM: 6, szerokoscM: 4, marginesM: 0, montaz: "rownolegly" })
    const p = { ...m, montaz: "pochylony-na-konstrukcji" as const }
    expect(wymiaryZMiejsca(p)).toEqual({ dlugoscM: 6, szerokoscM: 4, marginesM: 0, montaz: "pochylony-na-konstrukcji", oknoOdH: 10, oknoDoH: 14 })
    expect(wymiaryZMiejsca({ ...p, oknoDo: "" })).toEqual({ dlugoscM: 6, szerokoscM: 4, marginesM: 0, montaz: "pochylony-na-konstrukcji" })
  })

  it("wejście silnika z miejsca i panelu; puste pole = null; pusta moc = panel pominięty; zużycie tylko przy zaznaczeniu", () => {
    const k = KATALOG_PANELI_PV[0]!
    const stan: FormularzStan = {
      ...STAN_POCZATKOWY,
      panele: [{ ...PANEL_PUSTY("p1"), ...seedZKatalogu(k), cena: "500" }, PANEL_PUSTY("p2")],
    }
    const miejsce = { ...MIEJSCE_PUSTE("m1"), nachylenie: "35", azymut: "180", liczbaPaneli: "8" }
    const w = budujWejscie({ stan, miejsce, lokalizacja: null, dane: null, zuzycie: Array(12).fill(100), t })
    expect(w.miejsce).toEqual({ nachylenieDeg: 35, azymutDeg: 180 })
    expect(w.liczbaPaneli).toBe(8)
    expect(w.panele).toHaveLength(1)
    expect(w.panele[0]).toMatchObject({ pmaxW: k.pmaxW, cenaBruttoZl: 500, dlugoscMm: k.dlugoscMm, masaKg: k.masaKg })
    expect(w.zapotrzebowanieMiesiaceKwh).toHaveLength(12)
    expect(budujWejscie({ stan: { ...stan, uzyjZuzycia: false }, miejsce, lokalizacja: null, dane: null, zuzycie: Array(12).fill(100), t }).zapotrzebowanieMiesiaceKwh).toBeNull()
  })
})

describe("zestawy: przeliczenie kwot", () => {
  it("ceny paneli w zapisanych zestawach przeliczane współczynnikiem waluty", () => {
    const st: FormularzStan = { ...STAN_POCZATKOWY, stawka: "1", panele: [{ ...PANEL_PUSTY("p1"), cena: "400" }] }
    const wynik = KWOTY_ZESTAWOW({ zestawy: [{ id: "z1", nazwa: "A", zapisanoIso: "2026-10-08T00:00:00.000Z", stan: st }] }, 0.25)
    expect(Number(wynik.zestawy[0]!.stan.panele[0]!.cena)).toBeCloseTo(100, 6)
    expect(Number(wynik.zestawy[0]!.stan.stawka)).toBeCloseTo(0.25, 6)
  })
})
