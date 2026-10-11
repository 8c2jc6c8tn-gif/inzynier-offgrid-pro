import { describe, expect, it } from "vitest"
import { KATALOG_PANELI_PV } from "@/lib/core/dane/katalog-paneli-pv"
import { profilDobowyZPor } from "@/lib/core/modules/pv/porownywarka-paneli/bilans-godzinowy"
import { aktywneMiejsce, BILANS_PUSTY, bilansZFormularza, budujWejscie, elektrykaRecznaZPanelu, kolejnyId, KWOTY_ZESTAWOW, MIEJSCE_PUSTE, migrujStarySzkic, PANEL_PUSTY, seedZKatalogu, STAN_POCZATKOWY, wymiaryZMiejsca, type FormularzStan } from "../stan"

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

describe("elektryka panelu wpisana ręcznie", () => {
  const pelny = { ...PANEL_PUSTY("p1"), voc: "43.85", vmp: "36.91", isc: "14.42", imp: "13.55", betaVoc: "-0.25", maxV: "1500", maxBezp: "30" }

  it("komplet pól daje dane elektryczne; bezpiecznik szeregowy jest opcjonalny (null)", () => {
    expect(elektrykaRecznaZPanelu(pelny)).toEqual({ vocV: 43.85, vmpV: 36.91, iscA: 14.42, impA: 13.55, betaVocPctNaC: -0.25, maxNapieciaSystemuV: 1500, maxBezpiecznikSzeregowyA: 30 })
    expect(elektrykaRecznaZPanelu({ ...pelny, maxBezp: "" })!.maxBezpiecznikSzeregowyA).toBeNull()
  })

  it("brak któregokolwiek z sześciu wymaganych pól = null (nic nie jest dopełniane „typową” wartością); szkice sprzed A3 bez kluczy też", () => {
    for (const pole of ["voc", "vmp", "isc", "imp", "betaVoc", "maxV"] as const) expect(elektrykaRecznaZPanelu({ ...pelny, [pole]: "" }), pole).toBeNull()
    const stary = { ...PANEL_PUSTY("p1") } as Record<string, unknown>
    for (const k of ["voc", "vmp", "isc", "imp", "betaVoc", "maxV", "maxBezp"]) delete stary[k]
    expect(elektrykaRecznaZPanelu(stary as ReturnType<typeof PANEL_PUSTY>)).toBeNull()
  })

  it("panele bez katalogId biorą elektrykę z własnych pól (każdy z swojej)", () => {
    const wejscie = budujWejscie({
      stan: { ...STAN_POCZATKOWY, panele: [{ ...pelny, moc: "500" }, { ...PANEL_PUSTY("p2"), moc: "500", voc: "40", vmp: "30", isc: "10", imp: "16", betaVoc: "-0.3", maxV: "1000" }] },
      miejsce: MIEJSCE_PUSTE("m1"), lokalizacja: null, dane: null, zuzycie: null, t,
    })
    expect(wejscie.panele[0]!.elektryka).toMatchObject({ vocV: 43.85, maxNapieciaSystemuV: 1500 })
    expect(wejscie.panele[1]!.elektryka).toMatchObject({ vocV: 40, maxNapieciaSystemuV: 1000 })
  })
})

describe("profil dobowy z trzech pór doby (spec 39)", () => {
  it("udziały rozkładają się po równo na godziny pory: dzień 12 godz., wieczór 4, noc 8", () => {
    const w = profilDobowyZPor(60, 20, 20)!
    expect(w).toHaveLength(24)
    expect(w[10]).toBeCloseTo(60 / 12, 12)
    expect(w[19]).toBeCloseTo(20 / 4, 12)
    expect(w[23]).toBeCloseTo(20 / 8, 12)
    expect(w[3]).toBeCloseTo(20 / 8, 12)
    expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 10)
  })

  it("niekompletne albo zerowe udziały to null (nie uzupełniamy zgadywaniem)", () => {
    expect(profilDobowyZPor(60, undefined, 20)).toBeNull()
    expect(profilDobowyZPor(0, 0, 0)).toBeNull()
    expect(profilDobowyZPor(-1, 50, 50)).toBeNull()
  })

  it("bilansZFormularza: puste pola = bez profilu, komplet = profil, część = bez profilu", () => {
    expect(bilansZFormularza({ ...BILANS_PUSTY, pojemnosc: "5" })!.profilDobowy).toBeNull()
    expect(bilansZFormularza({ ...BILANS_PUSTY, pojemnosc: "5", profilDzien: "50", profilWieczor: "30", profilNoc: "20" })!.profilDobowy).toHaveLength(24)
    expect(bilansZFormularza({ ...BILANS_PUSTY, pojemnosc: "5", profilDzien: "50" })!.profilDobowy).toBeNull()
  })
})
