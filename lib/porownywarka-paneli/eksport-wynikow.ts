/**
 * Results of the panel comparer as a CSV table (one row per panel) for a spreadsheet. The same numbers as the on-screen table, but raw
 * numbers instead of formatted text with units, so a spreadsheet can sort and sum them; the unit is in the header.
 */
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { KomorkaCsv, OpcjeZapisuCsv } from "./csv"
import { zbudujCsv } from "./csv"
import type { ZwrotZOsprzetem } from "./zwrot-z-osprzetem"

type Tlumacz = (klucz: string, parametry?: Record<string, string | number>) => string

/** Polish and Russian spreadsheets expect `;` and a decimal comma, English ones `,` and a decimal point. */
export function opcjeCsvDlaJezyka(jezyk: string): OpcjeZapisuCsv {
  return jezyk === "en" ? { separator: ",", przecinekDziesietny: false } : { separator: ";", przecinekDziesietny: true }
}

export function wynikiDoCsv(i: { panele: readonly WynikPanelu[]; t: Tlumacz; waluta: string; zwroty?: ReadonlyMap<string, ZwrotZOsprzetem | null>; opcje: OpcjeZapisuCsv }): string {
  const { t, waluta, zwroty } = i
  const kolumny: { naglowek: string; wartosc: (p: WynikPanelu) => KomorkaCsv }[] = [
    { naglowek: t("UI-PORP-NAZWA"), wartosc: (p) => p.nazwa },
    { naglowek: t("UI-PORP-LICZBA-SZTUK"), wartosc: (p) => p.liczbaPaneli },
    { naglowek: `${t("UI-PORP-MOC-KWP")} [kWp]`, wartosc: (p) => p.mocKwp },
    { naglowek: `${t("UI-PORP-MASA-RAZEM")} [kg]`, wartosc: (p) => p.masaRazemKg },
    { naglowek: `${t("UI-PORP-ZIMA-KWH")} [kWh]`, wartosc: (p) => p.zimaKwh },
    { naglowek: `${t("UI-PORP-ROK-KWH")} [kWh]`, wartosc: (p) => p.rokKwh },
    { naglowek: `${t("UI-PORP-UZYTECZNA-ROK")} [kWh]`, wartosc: (p) => p.uzytecznaRokKwh },
    { naglowek: `${t("UI-PORP-NADWYZKA-ROK")} [kWh]`, wartosc: (p) => p.nadwyzkaRokKwh },
    { naglowek: `${t("UI-PORP-CENA-RAZEM")} [${waluta}]`, wartosc: (p) => p.cenaRazemZl },
    { naglowek: `${t("UI-PORP-CENA-ZA-WP")} [${waluta}/Wp]`, wartosc: (p) => p.cenaZaWpZl },
    { naglowek: `${t("UI-PORP-KOSZT-ZIMOWEJ-KWH")} [${waluta}/kWh]`, wartosc: (p) => p.kosztZimowejKwhZl },
    { naglowek: `${t("UI-PORP-WARTOSC-ROK")} [${waluta}]`, wartosc: (p) => p.wartoscRokZl },
    { naglowek: `${t("UI-PORP-WARTOSC-ZIMA")} [${waluta}]`, wartosc: (p) => p.wartoscZimaZl },
    { naglowek: `${t("UI-PORP-ZWROT")} [${t("UI-PORP-CSV-LATA")}]`, wartosc: (p) => p.okresZwrotuLat },
    { naglowek: `${t("UI-PORP-MOC-25")} [%]`, wartosc: (p) => p.moc25LatPct },
  ]
  if (zwroty) {
    const z = (p: WynikPanelu) => zwroty.get(p.id) ?? null
    kolumny.push(
      { naglowek: `${t("UI-PORP-CENA-Z-OSPRZETEM")} min [${waluta}]`, wartosc: (p) => z(p)?.cenaMin ?? null },
      { naglowek: `${t("UI-PORP-CENA-Z-OSPRZETEM")} max [${waluta}]`, wartosc: (p) => z(p)?.cenaMax ?? null },
      { naglowek: `${t("UI-PORP-ZWROT")} min [${t("UI-PORP-CSV-LATA")}] (${t("UI-PORP-CENA-Z-OSPRZETEM")})`, wartosc: (p) => z(p)?.okresZwrotuMinLat ?? null },
      { naglowek: `${t("UI-PORP-ZWROT")} max [${t("UI-PORP-CSV-LATA")}] (${t("UI-PORP-CENA-Z-OSPRZETEM")})`, wartosc: (p) => z(p)?.okresZwrotuMaxLat ?? null },
    )
  }
  return zbudujCsv([kolumny.map((k) => k.naglowek), ...i.panele.map((p) => kolumny.map((k) => k.wartosc(p)))], i.opcje)
}

/** Browser download of a text file (a user action: the click on the export button). */
export function pobierzPlikTekstowy(nazwa: string, tresc: string, typ = "text/csv;charset=utf-8"): void {
  const url = URL.createObjectURL(new Blob([tresc], { type: typ }))
  const a = document.createElement("a")
  a.href = url
  a.download = nazwa
  a.click()
  URL.revokeObjectURL(url)
}
