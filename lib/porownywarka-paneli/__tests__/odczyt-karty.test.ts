import { describe, expect, it } from "vitest"
import type { OdczytKarty, OdczytLiczby } from "@/lib/core/modules/pv/porownywarka-paneli/odczyt-karty"
import { poprawkaSeedZOdczytu, pozycjaPoprawna, pozycjeOdczytu, type PozycjaOdczytu } from "../odczyt-karty"
import { wymiaryPoZmniejszeniu } from "../zmniejsz-obraz"

const L = (wartosc: number | null, pewnosc: OdczytLiczby["pewnosc"] = "wysoka"): OdczytLiczby => ({ wartosc, widoczne: wartosc !== null, pewnosc })
const BRAK: OdczytLiczby = { wartosc: null, widoczne: false, pewnosc: "wysoka" }

const ODCZYT: OdczytKarty = {
  rozpoznany: "Trina Vertex S+ TSM-470NEG9R.28",
  zgodnoscZPodpowiedzia: "tak",
  kolumnaMocy: "470 W",
  nazwa: { wartosc: "Trina TSM-470NEG9R.28", widoczne: true, pewnosc: "wysoka" },
  pmaxW: L(470),
  vocV: L(41.6, "niska"),
  vmpV: L(34.4),
  iscA: L(14.1),
  impA: L(13.65),
  betaVocPctNaC: BRAK,
  gammaPctNaC: L(-0.29),
  noctC: BRAK,
  maxNapieciaSystemuV: L(1500),
  maxBezpiecznikSzeregowyA: BRAK,
  dlugoscMm: L(1762),
  szerokoscMm: L(1134),
  masaKg: L(22),
  degradacjaPierwszyRokPct: BRAK,
  degradacjaLiniowaPctNaRok: BRAK,
  obciazeniePrzodPa: L(5400),
  obciazenieTylPa: L(4000),
  bifacjalny: { wartosc: true, widoczne: true, pewnosc: "srednia" },
  obciazenieRodzaj: { wartosc: "testowe", widoczne: true, pewnosc: "srednia" },
  uwagi: [],
}

const zatwierdz = (p: PozycjaOdczytu[], ...pola: string[]) => p.map((x) => (pola.includes(x.pole) ? { ...x, zatwierdzone: true } : x))

describe("pozycjeOdczytu", () => {
  it("zawiera tylko pola widoczne na dokumencie i żadne nie jest zatwierdzone", () => {
    const p = pozycjeOdczytu(ODCZYT)
    expect(p.map((x) => x.pole)).not.toContain("noctC")
    expect(p.map((x) => x.pole)).not.toContain("betaVocPctNaC")
    expect(p.every((x) => x.zatwierdzone === false)).toBe(true)
    expect(p.find((x) => x.pole === "vocV")).toMatchObject({ tekst: "41.6", pewnosc: "niska" })
    expect(p.find((x) => x.pole === "bifacjalny")?.tekst).toBe("tak")
    expect(p.find((x) => x.pole === "nazwa")?.tekst).toBe("Trina TSM-470NEG9R.28")
  })
})

describe("poprawkaSeedZOdczytu", () => {
  it("bez zatwierdzenia nic nie trafia do formularza", () => {
    expect(poprawkaSeedZOdczytu(pozycjeOdczytu(ODCZYT))).toEqual({})
  })

  it("trafiają tylko zatwierdzone pola, a panel staje się ręcznym (katalogId puste)", () => {
    const poprawka = poprawkaSeedZOdczytu(zatwierdz(pozycjeOdczytu(ODCZYT), "pmaxW", "gammaPctNaC", "bifacjalny", "obciazeniePrzodPa", "obciazenieRodzaj"))
    expect(poprawka).toEqual({ katalogId: "", moc: "470", gamma: "-0.29", bifacjalny: true, obcPrzod: "5400", obcRodzaj: "testowe" })
    expect(poprawka).not.toHaveProperty("voc")
  })

  it("poprawiona przez użytkownika wartość zastępuje odczyt", () => {
    const p = pozycjeOdczytu(ODCZYT).map((x) => (x.pole === "vocV" ? { ...x, tekst: "51,6", zatwierdzone: true } : x))
    expect(poprawkaSeedZOdczytu(p)).toMatchObject({ voc: "51,6" })
  })

  it("zatwierdzona, ale niepoprawna wartość nie wchodzi do formularza", () => {
    const p = pozycjeOdczytu(ODCZYT).map((x) => (x.pole === "vocV" ? { ...x, tekst: "abc", zatwierdzone: true } : x))
    expect(pozycjaPoprawna(p.find((x) => x.pole === "vocV")!)).toBe(false)
    expect(poprawkaSeedZOdczytu(p)).toEqual({})
  })

  it("pola wyboru przyjmują tylko dozwolone wartości", () => {
    const p = pozycjeOdczytu(ODCZYT)
    expect(pozycjaPoprawna({ ...p.find((x) => x.pole === "bifacjalny")!, tekst: "może" })).toBe(false)
    expect(pozycjaPoprawna({ ...p.find((x) => x.pole === "obciazenieRodzaj")!, tekst: "obliczeniowe" })).toBe(true)
    expect(pozycjaPoprawna({ ...p.find((x) => x.pole === "nazwa")!, tekst: "  " })).toBe(false)
  })
})

describe("wymiaryPoZmniejszeniu", () => {
  it("nie powiększa i nie zmienia małych obrazów", () => {
    expect(wymiaryPoZmniejszeniu(1600, 1200)).toEqual({ szerokosc: 1600, wysokosc: 1200 })
  })
  it("zmniejsza dłuższy bok do limitu, zachowując proporcje", () => {
    expect(wymiaryPoZmniejszeniu(4800, 3600)).toEqual({ szerokosc: 2400, wysokosc: 1800 })
    expect(wymiaryPoZmniejszeniu(3000, 6000)).toEqual({ szerokosc: 1200, wysokosc: 2400 })
  })
})
