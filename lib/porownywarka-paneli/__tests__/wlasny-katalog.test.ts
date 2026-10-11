import { describe, expect, it } from "vitest"
import { rozbierzCsv } from "../csv"
import { dolaczWpisy, importujKatalogCsv, kwotyWlasnegoKatalogu, KOLUMNY_CSV, MAKS_WIERSZY_CSV, panelZWpisu, szablonCsv } from "../wlasny-katalog"
import { panelDoSilnika } from "../stan"

const NAGLOWEK = "nazwa;producent;moc_wp;cena;wsp_temp_pmax_proc_na_c;noct_c;bifacjalny"

describe("szablon i nagłówki", () => {
  it("szablon ma jeden wiersz z nazwami wszystkich kolumn i sam w sobie nie zawiera panelu", () => {
    const wiersze = rozbierzCsv(szablonCsv())
    expect(wiersze).toHaveLength(1)
    expect(wiersze[0]).toEqual(KOLUMNY_CSV.map((k) => k.naglowek))
    expect(importujKatalogCsv(szablonCsv()).bladPliku?.kod).toBe("UI-PORP-CSV-BRAK-WIERSZY")
  })
})

describe("importujKatalogCsv — poprawny plik", () => {
  it("średnik, przecinek dziesiętny, producent doklejony do nazwy, bifacjalny tak/nie", () => {
    const w = importujKatalogCsv(`${NAGLOWEK}\nX-500;Acme;500;"600,50";-0,29;45;tak\nY-400;Acme;400;;;;nie`)
    expect(w.bladPliku).toBeNull()
    expect(w.odrzucone).toEqual([])
    expect(w.wpisy).toHaveLength(2)
    expect(w.wpisy[0]).toMatchObject({ nazwa: "Acme X-500", moc: "500", cena: "600.5", gamma: "-0.29", noct: "45", bifacjalny: true, katalogId: "" })
    expect(w.wpisy[1]).toMatchObject({ nazwa: "Acme Y-400", moc: "400", cena: "", gamma: "", noct: "", bifacjalny: false })
  })

  it("puste komórki zostają puste — nic nie jest dopełniane „typową” wartością", () => {
    const [p] = importujKatalogCsv(`nazwa;moc\nSolo;450`).wpisy
    expect(p).toMatchObject({ nazwa: "Solo", moc: "450", cena: "", gamma: "", noct: "", spr200: "", deg1: "", degLin: "", dlugosc: "", szerokosc: "", masa: "", voc: "", maxBezp: "" })
  })

  it("angielskie nagłówki i separator przecinek; nazwa z producentem w środku nie dubluje producenta", () => {
    const w = importujKatalogCsv('name,manufacturer,power,price\n"Acme AC-450",Acme,450,300.00')
    expect(w.separator).toBe(",")
    expect(w.wpisy[0]).toMatchObject({ nazwa: "Acme AC-450", moc: "450", cena: "300" })
  })

  it("dane elektryczne kompletne trafiają do silnika jako ręczne; niekompletne → uwaga i brak elektryki", () => {
    const pelne = importujKatalogCsv("nazwa;moc_wp;voc_v;vmp_v;isc_a;imp_a;beta_voc_proc_na_c;maks_napiecie_ukladu_v\nA;500;43,85;36,91;14,42;13,55;-0,25;1500")
    expect(pelne.odrzucone).toEqual([])
    expect(pelne.uwagi).toEqual([])
    const silnik = panelDoSilnika({ ...pelne.wpisy[0]!, id: "p1" }, "A")!
    expect(silnik.elektryka).toMatchObject({ vocV: 43.85, vmpV: 36.91, iscA: 14.42, impA: 13.55, betaVocPctNaC: -0.25, maxNapieciaSystemuV: 1500, maxBezpiecznikSzeregowyA: null })
    const czesc = importujKatalogCsv("nazwa;moc_wp;voc_v;vmp_v\nA;500;43,85;36,91")
    expect(czesc.wpisy).toHaveLength(1)
    expect(czesc.uwagi).toEqual([{ wiersz: 2, komunikat: { kod: "UI-PORP-CSV-ELEKTRYKA-NIEKOMPLETNA" } }])
    expect(panelDoSilnika({ ...czesc.wpisy[0]!, id: "p1" }, "A")!.elektryka).toBeNull()
  })

  it("nieznana kolumna jest pominięta i wymieniona, a duplikat kolumny nie nadpisuje pierwszej", () => {
    const w = importujKatalogCsv("nazwa;moc_wp;kolor;moc\nA;500;czarny;999")
    expect(w.wpisy[0]!.moc).toBe("500")
    expect(w.pominieteKolumny).toEqual(["kolor", "moc"])
  })
})

describe("importujKatalogCsv — odrzucone wiersze i błędy pliku", () => {
  const odrzuca = (wiersz: string, kolumny = NAGLOWEK) => importujKatalogCsv(`${kolumny}\n${wiersz}`).odrzucone[0]?.powody.map((p) => p.kod) ?? []

  it("liczba z jednostką, tekst w kolumnie liczbowej, brak nazwy, brak mocy, zły bifacjalny", () => {
    expect(odrzuca("A;;500 W;;;;")).toContain("UI-PORP-CSV-ZLA-LICZBA")
    expect(odrzuca("A;;abc;;;;")).toContain("UI-PORP-CSV-ZLA-LICZBA")
    expect(odrzuca(";;500;;;;")).toContain("UI-PORP-CSV-BRAK-NAZWY")
    expect(odrzuca("A;;;;;;")).toContain("UI-PORP-CSV-BRAK-MOCY")
    expect(odrzuca("A;;500;;;;może")).toContain("UI-PORP-CSV-ZLY-BIFACJALNY")
  })

  it("kontrola silnika: moc 0, ujemna cena i NOCT poniżej temperatury otoczenia NOCT odrzucają wiersz tymi samymi kodami co formularz", () => {
    expect(odrzuca("A;;0;;;;")).toContain("PORP-MOC-PANELU-POZA-ZAKRESEM")
    expect(odrzuca("A;;500;-5;;;")).toContain("PORP-WARTOSC-UJEMNA")
    expect(odrzuca("A;;500;;;10;")).toContain("PORP-NOCT-POZA-ZAKRESEM")
  })

  it("dodatnia β Voc przy kompletnych danych elektrycznych odrzuca wiersz (PORP-ELEKTRYKA-POZA-ZAKRESEM)", () => {
    const k = "nazwa;moc_wp;voc_v;vmp_v;isc_a;imp_a;beta_voc_proc_na_c;maks_napiecie_ukladu_v"
    expect(odrzuca("A;500;43,85;36,91;14,42;13,55;0,25;1500", k)).toContain("PORP-ELEKTRYKA-POZA-ZAKRESEM")
  })

  it("odrzucony wiersz nie blokuje pozostałych; numer wiersza liczy nagłówek jako 1", () => {
    const w = importujKatalogCsv(`${NAGLOWEK}\nA;;500;;;;\nB;;0;;;;\nC;;400;;;;`)
    expect(w.wpisy.map((x) => x.nazwa)).toEqual(["A", "C"])
    expect(w.odrzucone.map((o) => o.wiersz)).toEqual([3])
  })

  it("błąd pliku: pusty, brak wymaganej kolumny, tylko nagłówki, za dużo wierszy", () => {
    expect(importujKatalogCsv("").bladPliku?.kod).toBe("UI-PORP-CSV-PUSTY")
    expect(importujKatalogCsv("  \n \n").bladPliku?.kod).toBe("UI-PORP-CSV-PUSTY")
    expect(importujKatalogCsv("nazwa;cena\nA;1").bladPliku).toEqual({ kod: "UI-PORP-CSV-BRAK-KOLUMNY", params: { kolumna: "moc_wp" } })
    expect(importujKatalogCsv("moc;cena\n500;1").bladPliku).toEqual({ kod: "UI-PORP-CSV-BRAK-KOLUMNY", params: { kolumna: "nazwa" } })
    expect(importujKatalogCsv("nazwa;moc").bladPliku?.kod).toBe("UI-PORP-CSV-BRAK-WIERSZY")
    const duzo = "nazwa;moc\n" + Array.from({ length: MAKS_WIERSZY_CSV + 1 }, (_, i) => `P${i};400`).join("\n")
    expect(importujKatalogCsv(duzo).bladPliku).toEqual({ kod: "UI-PORP-CSV-ZA-DUZO-WIERSZY", params: { maks: MAKS_WIERSZY_CSV } })
  })
})

describe("katalog w stanie", () => {
  const wpisy = importujKatalogCsv("nazwa;moc_wp;cena\nA;500;100\nB;400;80").wpisy

  it("dolaczWpisy nadaje kolejne identyfikatory po najwyższym istniejącym", () => {
    const pierwsze = dolaczWpisy([], wpisy)
    expect(pierwsze.map((w) => w.wlId)).toEqual(["w1", "w2"])
    expect(dolaczWpisy(pierwsze.slice(1), wpisy).map((w) => w.wlId)).toEqual(["w2", "w3", "w4"])
  })

  it("panelZWpisu zdejmuje identyfikator katalogu i zostawia wpisane liczby; katalogId puste (dane elektryczne wpisane ręcznie)", () => {
    const [w] = dolaczWpisy([], wpisy)
    const panel = panelZWpisu(w!)
    expect("wlId" in panel).toBe(false)
    expect(panel).toMatchObject({ katalogId: "", nazwa: "A", moc: "500", cena: "100" })
  })

  it("kwotyWlasnegoKatalogu przelicza tylko ceny", () => {
    const k = kwotyWlasnegoKatalogu({ wpisy: dolaczWpisy([], wpisy) }, 0.5)
    expect(k.wpisy.map((w) => Number(w.cena))).toEqual([50, 40])
    expect(k.wpisy.map((w) => w.moc)).toEqual(["500", "400"])
  })
})
