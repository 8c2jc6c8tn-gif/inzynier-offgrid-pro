import { describe, expect, it } from "vitest"
import { KATALOG_PANELI_PV, type PozycjaKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import { polaNiepewne, sprawdzSpojnoscOdczytu, type OdczytKarty, type OdczytLiczby } from "../odczyt-karty"

const L = (wartosc: number | null, pewnosc: OdczytLiczby["pewnosc"] = "wysoka"): OdczytLiczby => ({ wartosc, widoczne: wartosc !== null, pewnosc })
const BRAK: OdczytLiczby = { wartosc: null, widoczne: false, pewnosc: "wysoka" }

/** Odczyt "idealny" z wpisu katalogu: to samo, co powinien przepisać asystent z karty tego panelu. */
function odczytZKatalogu(k: PozycjaKatalogu): OdczytKarty {
  const e = k.elektryka
  return {
    rozpoznany: k.nazwa,
    zgodnoscZPodpowiedzia: "tak",
    kolumnaMocy: `${k.pmaxW} W`,
    nazwa: { wartosc: k.nazwa, widoczne: true, pewnosc: "wysoka" },
    pmaxW: L(k.pmaxW),
    vocV: e ? L(e.vocV) : BRAK,
    vmpV: e ? L(e.vmpV) : BRAK,
    iscA: e ? L(e.iscA) : BRAK,
    impA: e ? L(e.impA) : BRAK,
    betaVocPctNaC: e ? L(e.betaVocPctNaC) : BRAK,
    gammaPctNaC: L(k.gammaPctNaC),
    noctC: L(k.noctC),
    maxNapieciaSystemuV: e ? L(e.maxNapieciaSystemuV) : BRAK,
    maxBezpiecznikSzeregowyA: e ? L(e.maxBezpiecznikSzeregowyA) : BRAK,
    dlugoscMm: L(k.dlugoscMm),
    szerokoscMm: L(k.szerokoscMm),
    masaKg: L(k.masaKg),
    degradacjaPierwszyRokPct: L(k.degradacjaPierwszyRokPct),
    degradacjaLiniowaPctNaRok: L(k.degradacjaLiniowaPctNaRok),
    obciazeniePrzodPa: L(k.obciazenie?.przodPa ?? null),
    obciazenieTylPa: L(k.obciazenie?.tylPa ?? null),
    bifacjalny: { wartosc: k.bifacjalny, widoczne: true, pewnosc: "wysoka" },
    obciazenieRodzaj: { wartosc: k.obciazenie?.rodzaj ?? null, widoczne: k.obciazenie !== null && k.obciazenie !== undefined, pewnosc: "wysoka" },
    uwagi: [],
  }
}

const TRINA_470 = KATALOG_PANELI_PV.find((k) => k.id.startsWith("trina") && k.pmaxW === 470)!

describe("sprawdzSpojnoscOdczytu — kalibracja na całym katalogu", () => {
  it("wszystkie wpisy katalogu (dane z kart) przechodzą kontrole bez uwag", () => {
    expect(KATALOG_PANELI_PV.filter((k) => k.elektryka).length).toBeGreaterThan(30)
    for (const k of KATALOG_PANELI_PV) {
      expect(sprawdzSpojnoscOdczytu(odczytZKatalogu(k)), k.id).toEqual([])
    }
  })
})

describe("sprawdzSpojnoscOdczytu — pomyłki w cyfrach", () => {
  const dobry = odczytZKatalogu(TRINA_470)

  it("Vmp pomylone (np. 43,2 przeczytane jako 34,2): Vmp·Imp nie zgadza się z mocą", () => {
    const vmp = dobry.vmpV.wartosc!
    const zly = { ...dobry, vmpV: L(Number(String(vmp).split("").reverse().join("")) || vmp * 0.8) }
    const kody = sprawdzSpojnoscOdczytu(zly).map((u) => u.kod)
    expect(kody).toContain("ODCZYT-VMP-IMP-NIE-PASUJE")
  })

  it("podaje liczby do pokazania: Vmp·Imp (zaokrąglone) i moc", () => {
    const zly = { ...dobry, impA: L(dobry.impA.wartosc! * 1.1) }
    const u = sprawdzSpojnoscOdczytu(zly).find((x) => x.kod === "ODCZYT-VMP-IMP-NIE-PASUJE")!
    expect(u.pola).toEqual(["vmpV", "impA", "pmaxW"])
    expect(u.params.pmax).toBe(TRINA_470.pmaxW)
    expect(u.params.vmpImp).toBe(Math.round(dobry.vmpV.wartosc! * dobry.impA.wartosc! * 1.1))
  })

  it("Voc ≤ Vmp i Isc ≤ Imp (zamienione wiersze) są wykryte", () => {
    const zly = { ...dobry, vocV: dobry.vmpV, vmpV: dobry.vocV, iscA: dobry.impA, impA: dobry.iscA }
    const kody = sprawdzSpojnoscOdczytu(zly).map((u) => u.kod)
    expect(kody).toContain("ODCZYT-VOC-NIE-WIEKSZE-OD-VMP")
    expect(kody).toContain("ODCZYT-ISC-NIE-WIEKSZE-OD-IMP")
  })

  it("wymiar przeczytany z dodatkowym zerem daje niewiarygodną sprawność", () => {
    const zly = { ...dobry, dlugoscMm: L(TRINA_470.dlugoscMm! * 10) }
    const u = sprawdzSpojnoscOdczytu(zly).find((x) => x.kod === "ODCZYT-SPRAWNOSC-NIEPRAWDOPODOBNA")
    expect(u?.pola).toEqual(["pmaxW", "dlugoscMm", "szerokoscMm"])
    expect(u!.params.sprawnosc).toBeLessThan(3)
  })

  it("dodatni współczynnik temperaturowy (zgubiony minus) jest wykryty osobno dla β i γ", () => {
    const zly = { ...dobry, betaVocPctNaC: L(0.25), gammaPctNaC: L(0.29) }
    const u = sprawdzSpojnoscOdczytu(zly).filter((x) => x.kod === "ODCZYT-WSPOLCZYNNIK-DODATNI")
    expect(u.map((x) => x.pola[0]).sort()).toEqual(["betaVocPctNaC", "gammaPctNaC"])
  })

  it("pola niewidoczne nie wywołują kontroli (nic nie jest zgadywane)", () => {
    const pusty: OdczytKarty = { ...dobry, pmaxW: BRAK, vocV: BRAK, vmpV: BRAK, iscA: BRAK, impA: BRAK, dlugoscMm: BRAK, betaVocPctNaC: BRAK, gammaPctNaC: BRAK }
    expect(sprawdzSpojnoscOdczytu(pusty)).toEqual([])
  })

  it("tolerancja Vmp·Imp jest ta sama co w silniku (2%): 1,5% przechodzi, 3% nie", () => {
    const vmpImp = dobry.vmpV.wartosc! * dobry.impA.wartosc!
    const przy = (mnoznik: number) => sprawdzSpojnoscOdczytu({ ...dobry, pmaxW: L(vmpImp * mnoznik) }).map((u) => u.kod)
    expect(przy(1.015)).not.toContain("ODCZYT-VMP-IMP-NIE-PASUJE")
    expect(przy(1.03)).toContain("ODCZYT-VMP-IMP-NIE-PASUJE")
  })
})

describe("polaNiepewne", () => {
  it("wskazuje widoczne pola o pewności innej niż wysoka, pomija niewidoczne", () => {
    const o = { ...odczytZKatalogu(TRINA_470), vocV: L(52.1, "niska"), iscA: L(11.2, "srednia"), masaKg: { wartosc: null, widoczne: false, pewnosc: "niska" as const } }
    expect(polaNiepewne(o).sort()).toEqual(["iscA", "vocV"])
  })
})
