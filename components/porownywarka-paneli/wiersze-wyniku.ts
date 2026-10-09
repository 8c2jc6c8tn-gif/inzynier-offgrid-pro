import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { useTranslate } from "@/lib/i18n/language-context"
import type { ZwrotZOsprzetem } from "@/lib/porownywarka-paneli/zwrot-z-osprzetem"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

export type WierszWyniku = [klucz: string, wartosc: (p: WynikPanelu) => string | null]

/**
 * Wiersze tabeli wyniku Porównywarki (zakładka „Opłacalność” i wydruk oferty): klucz etykiety i wartość dla panelu, `null` = brak danych.
 * Jedno miejsce, żeby ekran i wydruk pokazywały te same liczby w tym samym formacie.
 */
export function wierszeWyniku(t: ReturnType<typeof useTranslate>, waluta: string, osprzet?: ReadonlyMap<string, ZwrotZOsprzetem | null>): WierszWyniku[] {
  /** "a–b" for a range, one number when both ends are equal at the displayed precision. */
  const zakres = (a: number, b: number, fmt: (x: number) => string) => (fmt(a) === fmt(b) ? fmt(a) : `${fmt(a)}–${fmt(b)}`)
  /** With the switch on, the figure is a range including the accessories; a panel without a result shows "no data". */
  const zOsprzetem = (p: WynikPanelu) => osprzet?.get(p.id) ?? null
  return [
            ["UI-PORP-LICZBA-SZTUK", (p: WynikPanelu) => `${p.liczbaPaneli}`],
            [
              "UI-PORP-UKLAD-RZEDOW",
              (p: WynikPanelu) =>
                p.rozmieszczenie === null
                  ? null
                  : t("UI-PORP-UKLAD-RZEDOW-WART", {
                      rzedy: p.rozmieszczenie.rzedy,
                      stoly: p.rozmieszczenie.stolowWRzedzie,
                      k: p.rozmieszczenie.panelowNaStole,
                      odstep: f2(p.rozmieszczenie.odstepM),
                    }),
            ],
            ["UI-PORP-MOC-KWP", (p: WynikPanelu) => `${f2(p.mocKwp)} kWp`],
            ["UI-PORP-MASA-RAZEM", (p: WynikPanelu) => (p.masaRazemKg === null ? null : `${f0(p.masaRazemKg)} kg`)],
            ["UI-PORP-MASA-M2", (p: WynikPanelu) => (p.masaNaM2Kg === null ? null : `${f1(p.masaNaM2Kg)} kg/m²`)],
            ["UI-PORP-ZIMA-KWH", (p: WynikPanelu) => `${f1(p.zimaKwh)} kWh`],
            ["UI-PORP-ZIMA-TANIA", (p: WynikPanelu) => (p.zimaTaniaKwh === null ? null : `${f1(p.zimaTaniaKwh)} kWh`)],
            ["UI-PORP-ROK-KWH", (p: WynikPanelu) => `${f0(p.rokKwh)} kWh`],
            ["UI-PORP-UZYTECZNA-ROK", (p: WynikPanelu) => (p.uzytecznaRokKwh === null ? null : `${f0(p.uzytecznaRokKwh)} kWh`)],
            [
              "UI-PORP-NADWYZKA-ROK",
              (p: WynikPanelu) =>
                p.nadwyzkaRokKwh === null || p.nadwyzkaUlamek === null
                  ? null
                  : t("UI-PORP-NADWYZKA-WART", { kwh: f0(p.nadwyzkaRokKwh), proc: f0(p.nadwyzkaUlamek * 100) }),
            ],
            ["UI-PORP-CENA-RAZEM", (p: WynikPanelu) => (p.cenaRazemZl === null ? null : `${f0(p.cenaRazemZl)} ${waluta}`)],
            ...(osprzet
              ? ([["UI-PORP-CENA-Z-OSPRZETEM", (p: WynikPanelu) => { const z = zOsprzetem(p); return z === null ? null : `${zakres(z.cenaMin, z.cenaMax, f0)} ${waluta}` }]] as WierszWyniku[])
              : []),
            ["UI-PORP-CENA-ZA-WP", (p: WynikPanelu) => (p.cenaZaWpZl === null ? null : `${f2(p.cenaZaWpZl)} ${waluta}/Wp`)],
            [
              "UI-PORP-KOSZT-ZIMOWEJ-KWH",
              (p: WynikPanelu) => {
                if (!osprzet) return p.kosztZimowejKwhZl === null ? null : `${f2(p.kosztZimowejKwhZl)} ${waluta}/kWh`
                const z = zOsprzetem(p)
                return z === null || z.kosztZimowejKwhMin === null || z.kosztZimowejKwhMax === null ? null : `${zakres(z.kosztZimowejKwhMin, z.kosztZimowejKwhMax, f2)} ${waluta}/kWh`
              },
            ],
            ["UI-PORP-WARTOSC-ROK", (p: WynikPanelu) => (p.wartoscRokZl === null ? null : `${f0(p.wartoscRokZl)} ${waluta}`)],
            ["UI-PORP-WARTOSC-ZIMA", (p: WynikPanelu) => (p.wartoscZimaZl === null ? null : `${f0(p.wartoscZimaZl)} ${waluta}`)],
            [
              "UI-PORP-ZWROT",
              (p: WynikPanelu) => {
                if (!osprzet) return p.okresZwrotuLat === null ? null : t("UI-PORP-LATA", { x: f1(p.okresZwrotuLat) })
                const z = zOsprzetem(p)
                return z === null || z.okresZwrotuMinLat === null || z.okresZwrotuMaxLat === null ? null : t("UI-PORP-LATA", { x: zakres(z.okresZwrotuMinLat, z.okresZwrotuMaxLat, f1) })
              },
            ],
            ["UI-PORP-MOC-25", (p: WynikPanelu) => (p.moc25LatPct === null ? null : `${f1(p.moc25LatPct)}%`)],
  ]
}
