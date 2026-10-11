import { describe, expect, it } from "vitest"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import { rozbierzCsv } from "../csv"
import { opcjeCsvDlaJezyka, wynikiDoCsv } from "../eksport-wynikow"

const t = (klucz: string) => klucz
const panel = (zmiana: Partial<WynikPanelu>): WynikPanelu =>
  ({
    id: "A", nazwa: "Panel A", liczbaPaneli: 4, mocKwp: 2, masaRazemKg: 109.2, zimaKwh: 120.5, rokKwh: 2400, uzytecznaRokKwh: null, nadwyzkaRokKwh: null,
    cenaRazemZl: 2400, cenaZaWpZl: 1.2, kosztZimowejKwhZl: 0.8, wartoscRokZl: 1920, wartoscZimaZl: 96.4, okresZwrotuLat: 1.25, moc25LatPct: 87.4, ...zmiana,
  }) as WynikPanelu

describe("wynikiDoCsv", () => {
  const opcje = opcjeCsvDlaJezyka("pl")

  it("jeden wiersz na panel, liczby surowe z przecinkiem dziesiętnym, jednostka w nagłówku, brak danych = pusta komórka", () => {
    const csv = wynikiDoCsv({ panele: [panel({}), panel({ id: "B", nazwa: "Panel B", masaRazemKg: null, cenaRazemZl: null, cenaZaWpZl: null })], t, waluta: "zł", opcje })
    const wiersze = rozbierzCsv(csv)
    expect(wiersze).toHaveLength(3)
    expect(wiersze[0]![0]).toBe("UI-PORP-NAZWA")
    expect(wiersze[0]).toContain("UI-PORP-MOC-KWP [kWp]")
    expect(wiersze[0]).toContain("UI-PORP-CENA-RAZEM [zł]")
    expect(wiersze[1]).toEqual(["Panel A", "4", "2", "109,2", "120,5", "2400", "", "", "2400", "1,2", "0,8", "1920", "96,4", "1,25", "87,4"])
    expect(wiersze[2]![3]).toBe("")
    expect(wiersze[2]![8]).toBe("")
    expect(wiersze.every((w) => w.length === wiersze[0]!.length)).toBe(true)
  })

  it("angielski arkusz: przecinek jako separator i kropka dziesiętna", () => {
    const csv = wynikiDoCsv({ panele: [panel({})], t, waluta: "PLN", opcje: opcjeCsvDlaJezyka("en") })
    expect(rozbierzCsv(csv)[1]).toEqual(["Panel A", "4", "2", "109.2", "120.5", "2400", "", "", "2400", "1.2", "0.8", "1920", "96.4", "1.25", "87.4"])
  })

  it("nazwa panelu wyglądająca jak formuła nie jest wykonywalna w arkuszu", () => {
    const csv = wynikiDoCsv({ panele: [panel({ nazwa: "=HYPERLINK(\"x\")" })], t, waluta: "zł", opcje })
    expect(rozbierzCsv(csv)[1]![0]).toBe("'=HYPERLINK(\"x\")")
  })

  it("kolumny z osprzętem tylko przy włączonym przełączniku, z zakresem min–max", () => {
    const zwroty = new Map([["A", { cenaMin: 3000, cenaMax: 3500, okresZwrotuMinLat: 1.5, okresZwrotuMaxLat: 1.8, kosztZimowejKwhMin: 1, kosztZimowejKwhMax: 1.2, niepelny: false }], ["B", null]])
    const z = rozbierzCsv(wynikiDoCsv({ panele: [panel({}), panel({ id: "B", nazwa: "Panel B" })], t, waluta: "zł", opcje, zwroty }))
    expect(z[0]!.length).toBe(rozbierzCsv(wynikiDoCsv({ panele: [panel({})], t, waluta: "zł", opcje }))[0]!.length + 4)
    expect(z[1]!.slice(-4)).toEqual(["3000", "3500", "1,5", "1,8"])
    expect(z[2]!.slice(-4)).toEqual(["", "", "", ""])
  })

  it("opcjeCsvDlaJezyka: pl i ru → średnik z przecinkiem dziesiętnym, en → przecinek z kropką", () => {
    expect(opcjeCsvDlaJezyka("pl")).toEqual({ separator: ";", przecinekDziesietny: true })
    expect(opcjeCsvDlaJezyka("ru")).toEqual({ separator: ";", przecinekDziesietny: true })
    expect(opcjeCsvDlaJezyka("en")).toEqual({ separator: ",", przecinekDziesietny: false })
  })
})
