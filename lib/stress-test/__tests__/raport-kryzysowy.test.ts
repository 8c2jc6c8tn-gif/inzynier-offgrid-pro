import { describe, expect, it } from "vitest"
import { calculateSymulacjaMrozu } from "@/lib/core/modules/stress-test/symulacja-mrozu/calculator"
import { PUSTE_POLA_DEFICYTOW, wynikDeficytowZeSzkicu } from "../wejscie-deficytow"
import { wejscieWspolczynnika, wynikWspolczynnikaZeSzkicu, type PolaWspolczynnika } from "../wejscie-wspolczynnika"
import { zbudujRaport } from "../raport-kryzysowy"

const SYMULACJA = calculateSymulacjaMrozu({
  produkcjaDobowaKwh: [5, 5, 5],
  korektaProdukcjiPct: 0,
  zuzycieBazoweDobaKwh: 10,
  dodatkoweZuzycieDobaKwh: 0,
  budynek: null,
  zrodloCiepla: null,
  cop: null,
  magazyn: null,
  udzialNocyPct: null,
  scenariusze: [
    { temperaturaC: -20, cop: null, spadekPojemnosciPct: null },
    { temperaturaC: -30, cop: null, spadekPojemnosciPct: null },
  ],
})

// Reference by hand: components 80 / 70 / 80 / 100 / 100 % with weights 30 / 25 / 20 / 15 / 10 → (2400 + 1750 + 1600 + 1500 + 1000) / 100 = 82.5 %.
const SZKIC_WSP: PolaWspolczynnika = {
  produkcja: "800",
  zapotrzebowanie: "1000",
  autonomia: "7",
  wymaganaAutonomia: "10",
  komponenty: "10",
  spof: "2",
  mocAgregatu: "5",
  mocWymagana: "4",
  okno: "12",
  wymaganyCzas: "6",
  prog: "75",
  brakAgregatu: false,
  wlasneWagi: false,
  wagi: { pokrycie: "", autonomia: "", odpornosc: "", agregat: "", reakcja: "" },
}

const DEFICYTY = wynikDeficytowZeSzkicu({ ...PUSTE_POLA_DEFICYTOW, deficyty: ["80", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "120"], moc: "5", zuzycie: "2", cena: "6" })

describe("zbudujRaport (M7/E3)", () => {
  it("bez żadnego ekranu: wszystkie cztery części brakujące, nic do uwagi", () => {
    const r = zbudujRaport({ symulacja: null, deficyty: null, blackout: null, wspolczynnik: null })
    expect(r.dostepne).toEqual([])
    expect(r.brakujace).toEqual(["symulacja", "deficyty", "blackout", "wspolczynnik"])
    expect(r.wymagaUwagi).toBe(false)
  })

  it("symulacja: najgorszy scenariusz to ten z największym deficytem; wynik niekompletny to brak części, nie zero", () => {
    const r = zbudujRaport({ symulacja: SYMULACJA, deficyty: null, blackout: null, wspolczynnik: null })
    expect(r.symulacja!.scenariusze).toHaveLength(2)
    // 3 dni po 5 kWh PV przy popycie 10 → deficyt 15 kWh w obu scenariuszach (bez ogrzewania); remis zostaje przy pierwszym.
    expect(r.symulacja!.najgorszy!.deficytMiesiacaKwh).toBeCloseTo(15, 9)
    expect(r.symulacja!.najgorszy!.temperaturaC).toBe(-20)
    expect(r.wymagaUwagi).toBe(true)
    const pusta = calculateSymulacjaMrozu({ produkcjaDobowaKwh: [], korektaProdukcjiPct: 0, zuzycieBazoweDobaKwh: null, dodatkoweZuzycieDobaKwh: 0, budynek: null, zrodloCiepla: null, cop: null, magazyn: null, udzialNocyPct: null, scenariusze: [] })
    expect(zbudujRaport({ symulacja: pusta, deficyty: null, blackout: null, wspolczynnik: null }).brakujace).toContain("symulacja")
  })

  it("deficyty miesięczne: suma 200 kWh w 2 miesiącach; grudzień ma najwięcej godzin pracy agregatu", () => {
    const r = zbudujRaport({ symulacja: null, deficyty: DEFICYTY, blackout: null, wspolczynnik: null })
    expect(r.deficyty!.sumaDeficytKwh).toBeCloseTo(200, 9)
    expect(r.deficyty!.miesiecyZDeficytem).toBe(2)
    expect(r.deficyty!.miesiacNajdluzszy).toBe(12)
    expect(r.deficyty!.sumaGodzin).toBeGreaterThan(0)
    expect(r.deficyty!.sumaKosztZl).toBeGreaterThan(0)
  })

  it("blackout: autonomia 7 dni przy scenariuszu 10 dni → nie wystarcza; 10 z 10 → wystarcza", () => {
    expect(zbudujRaport({ symulacja: null, deficyty: null, blackout: { autonomiaDni: 7, wymaganaAutonomiaDni: 10 }, wspolczynnik: null }).blackout!.wystarcza).toBe(false)
    const ok = zbudujRaport({ symulacja: null, deficyty: null, blackout: { autonomiaDni: 10, wymaganaAutonomiaDni: 10 }, wspolczynnik: null })
    expect(ok.blackout!.wystarcza).toBe(true)
    expect(ok.wymagaUwagi).toBe(false)
  })

  it("współczynnik: 82,5%, najsłabsza składowa autonomia (70%), pokrycie najgorszego miesiąca 80% i brak 200 kWh (20%)", () => {
    const wynik = wynikWspolczynnikaZeSzkicu(SZKIC_WSP)!
    const r = zbudujRaport({ symulacja: null, deficyty: null, blackout: null, wspolczynnik: { wynik, wejscie: wejscieWspolczynnika(SZKIC_WSP) } })
    expect(r.wspolczynnik!.wskaznikPct).toBeCloseTo(82.5, 9)
    expect(r.wspolczynnik!.najslabsza).toEqual({ id: "autonomia", wynikPct: 70 })
    expect(r.wspolczynnik!.slabePunkty).toEqual(["autonomia"])
    const p = r.wspolczynnik!.pokrycieNajgorszegoMiesiaca!
    expect(p.pokrycieProc).toBeCloseTo(80, 9)
    expect(p.brakKwh).toBeCloseTo(200, 9)
    expect(p.brakProc).toBeCloseTo(20, 9)
    // 800 kWh produced vs 1000 kWh demand → the worst month needs 1000/800 − 1 = 25% more PV energy (plain proportion, no sizing model)
    expect(p.wzrostPvPct).toBeCloseTo(25, 9)
    expect(r.wymagaUwagi).toBe(true)
  })

  it("produkcja większa od zapotrzebowania: pokrycie obcięte do 100%, brak 0", () => {
    const szkic = { ...SZKIC_WSP, produkcja: "1500" }
    const r = zbudujRaport({ symulacja: null, deficyty: null, blackout: null, wspolczynnik: { wynik: wynikWspolczynnikaZeSzkicu(szkic)!, wejscie: wejscieWspolczynnika(szkic) } })
    expect(r.wspolczynnik!.pokrycieNajgorszegoMiesiaca).toEqual({ pokrycieProc: 100, brakKwh: 0, brakProc: 0, wzrostPvPct: null })
  })

  it("kompletny raport: wszystkie części dostępne, kolejność jak w źródle", () => {
    const r = zbudujRaport({
      symulacja: SYMULACJA,
      deficyty: DEFICYTY,
      blackout: { autonomiaDni: 10, wymaganaAutonomiaDni: 10 },
      wspolczynnik: { wynik: wynikWspolczynnikaZeSzkicu(SZKIC_WSP)!, wejscie: wejscieWspolczynnika(SZKIC_WSP) },
    })
    expect(r.dostepne).toEqual(["symulacja", "deficyty", "blackout", "wspolczynnik"])
    expect(r.brakujace).toEqual([])
  })
})

describe("rekomendacje liczbowe w raporcie: tylko z liczb ekranów, bez modelu doboru", () => {
  it("zero production gives no percentage (undefined), the shortfall stays", () => {
    const szkic = { ...SZKIC_WSP, produkcja: "0" }
    const p = zbudujRaport({ symulacja: null, deficyty: null, blackout: null, wspolczynnik: { wynik: wynikWspolczynnikaZeSzkicu(szkic)!, wejscie: wejscieWspolczynnika(szkic) } }).wspolczynnik!.pokrycieNajgorszegoMiesiaca!
    expect(p.wzrostPvPct).toBeNull()
    expect(p.brakKwh).toBeGreaterThan(0)
  })

  it("blackout: missing battery capacity comes from the Blackout screen's own model, null when the screen gives none", () => {
    const z = zbudujRaport({ symulacja: null, deficyty: null, blackout: { autonomiaDni: 7, wymaganaAutonomiaDni: 10, dodatkowaPojemnoscKwh: 6.5 }, wspolczynnik: null })
    expect(z.blackout).toEqual({ autonomiaDni: 7, wymaganaAutonomiaDni: 10, wystarcza: false, dodatkowaPojemnoscKwh: 6.5 })
    const bez = zbudujRaport({ symulacja: null, deficyty: null, blackout: { autonomiaDni: 10, wymaganaAutonomiaDni: 10 }, wspolczynnik: null })
    expect(bez.blackout!.dodatkowaPojemnoscKwh).toBeNull()
  })
})

