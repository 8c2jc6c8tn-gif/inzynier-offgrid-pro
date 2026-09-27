/**
 * Indicative Ψ values of PN-EN ISO 14683:2007, Załącznik A, Tablica A.2 (`docs/zrodla/norma-PN-EN-ISO-14683-1/`).
 * Values transcribed from the native PDF text (script check: 76 details × 3 values) and compared visually with
 * every sketch of the table (27.09.2026). The norm (5.1, 5.5, A — Uwaga 1): worst-case parameters (Tablica A.1),
 * typical accuracy 0 % to 50 %, rounded to 0,05 W/(m·K), valid for heat loss only — not for surface condensation.
 * Descriptions say what the sketch shows; the column of the table is the position of the main insulating layer
 * (outside / middle / inside / light wall of masonry or timber frame).
 */

/** Dimension system of Rozdz. 4.3: external (e), overall internal (oi), internal (i). */
export type SystemWymiarow = "e" | "oi" | "i"

export type KategoriaMostka =
  | "dach"
  | "balkon"
  | "narozniki"
  | "strop"
  | "sciana-wewnetrzna"
  | "podloga-grunt"
  | "podloga-podwieszona"
  | "slup"
  | "otwor"

export type PozycjaKatalogu = {
  kod: string
  kategoria: KategoriaMostka
  opis: string
  psi: Record<SystemWymiarow, number>
}

const p = (kod: string, kategoria: KategoriaMostka, opis: string, e: number, oi: number, i: number): PozycjaKatalogu => ({
  kod,
  kategoria,
  opis,
  psi: { e, oi, i },
})

export const KATALOG_PSI_14683: readonly PozycjaKatalogu[] = [
  p("R1", "dach", "Dach płaski bez attyki, izolacja ściany od zewnątrz", 0.55, 0.75, 0.75),
  p("R2", "dach", "Dach płaski bez attyki, izolacja w środku ściany", 0.5, 0.75, 0.75),
  p("R3", "dach", "Dach płaski bez attyki, izolacja ściany od wewnątrz", 0.4, 0.75, 0.75),
  p("R4", "dach", "Dach płaski bez attyki, ściana lekka", 0.4, 0.65, 0.65),
  p("R5", "dach", "Dach płaski z attyką, izolacja ściany od zewnątrz", 0.6, 0.8, 0.8),
  p("R6", "dach", "Dach płaski z attyką, izolacja w środku ściany", 0.5, 0.7, 0.7),
  p("R7", "dach", "Dach płaski z attyką, izolacja ściany od wewnątrz", 0.65, 0.85, 0.85),
  p("R8", "dach", "Dach płaski z attyką, ściana lekka z izolacją od wewnątrz", 0.45, 0.7, 0.7),
  p(
    "R9",
    "dach",
    "Dach płaski bez attyki, izolacja ściany od zewnątrz przechodzi w izolację dachu (czoło stropu osłonięte)",
    -0.05,
    0.15,
    0.15,
  ),
  p("R10", "dach", "Dach płaski bez attyki, ściana lekka, izolacja dachu osłania czoło stropu", 0, 0.2, 0.2),
  p("R11", "dach", "Dach płaski z attyką, izolacja ściany od zewnątrz — wariant R11 normy (sprawdź rysunek Tablicy A.2)", 0.05, 0.25, 0.25),
  p("R12", "dach", "Dach płaski z attyką, ściana lekka, izolacja przy czole stropu", 0.15, 0.4, 0.4),
  p("B1", "balkon", "Płyta balkonu przechodząca przez ścianę, izolacja ściany od zewnątrz", 0.95, 0.95, 1.05),
  p("B2", "balkon", "Płyta balkonu przechodząca przez ścianę, izolacja w środku ściany", 0.95, 0.95, 1.05),
  p("B3", "balkon", "Płyta balkonu przechodząca przez ścianę, izolacja ściany od wewnątrz", 0.9, 0.9, 1.0),
  p("B4", "balkon", "Płyta balkonu przechodząca przez ścianę lekką", 0.7, 0.7, 0.8),
  p("C1", "narozniki", "Narożnik wypukły (zewnętrzny), izolacja od zewnątrz", -0.05, 0.15, 0.15),
  p("C2", "narozniki", "Narożnik wypukły (zewnętrzny), izolacja w środku ściany", -0.1, 0.1, 0.1),
  p("C3", "narozniki", "Narożnik wypukły (zewnętrzny), izolacja od wewnątrz", -0.2, 0.05, 0.05),
  p("C4", "narozniki", "Narożnik wypukły (zewnętrzny), ściana lekka", -0.15, 0.1, 0.1),
  p("C5", "narozniki", "Narożnik wklęsły (wewnętrzny), izolacja od zewnątrz", 0.05, -0.15, -0.15),
  p("C6", "narozniki", "Narożnik wklęsły (wewnętrzny), izolacja w środku ściany", 0.15, -0.1, -0.1),
  p("C7", "narozniki", "Narożnik wklęsły (wewnętrzny), izolacja od wewnątrz", 0.15, -0.05, -0.05),
  p("C8", "narozniki", "Narożnik wklęsły (wewnętrzny), ściana lekka", 0.1, -0.1, -0.1),
  p("IF1", "strop", "Strop pośredni, izolacja ściany od zewnątrz ciągła", 0, 0, 0.1),
  p("IF2", "strop", "Strop pośredni przechodzi przez ścianę i przerywa izolację w środku", 0.95, 0.95, 1.05),
  p("IF3", "strop", "Strop pośredni przechodzi przez ścianę i przerywa izolację od wewnątrz", 0.9, 0.9, 1.0),
  p("IF4", "strop", "Strop pośredni przechodzi przez ścianę lekką", 0.7, 0.7, 0.8),
  p("IF5", "strop", "Strop pośredni przez całą ścianę z izolacją w środku, czoło stropu z cienką izolacją", 0.6, 0.6, 0.65),
  p("IF6", "strop", "Strop pośredni przerywa izolację w środku ściany, strop obłożony izolacją z góry i z dołu", 0.9, 0.9, 1.0),
  p("IF7", "strop", "Strop pośredni przez całą ścianę z izolacją od wewnątrz, czoło stropu z cienką izolacją", 0.7, 0.7, 0.8),
  p("IF8", "strop", "Izolacja ściany od wewnątrz przerwana stropem, strop obłożony izolacją z góry i z dołu", 0.45, 0.45, 0.6),
  p("IW1", "sciana-wewnetrzna", "Ściana wewnętrzna przy zewnętrznej, izolacja od zewnątrz ciągła", 0, 0, 0.1),
  p("IW2", "sciana-wewnetrzna", "Ściana wewnętrzna przechodzi przez ścianę zewnętrzną i przerywa izolację w środku", 0.95, 0.95, 1.05),
  p("IW3", "sciana-wewnetrzna", "Ściana wewnętrzna przerywa izolację ściany zewnętrznej od wewnątrz", 0.9, 0.9, 1.0),
  p("IW4", "sciana-wewnetrzna", "Ściana wewnętrzna przy zewnętrznej ścianie lekkiej", 0, 0, 0.2),
  p("IW5", "sciana-wewnetrzna", "Ściana wewnętrzna dochodzi do warstwy wewnętrznej, izolacja w środku ciągła", 0, 0, 0.1),
  p("IW6", "sciana-wewnetrzna", "Ściana wewnętrzna pod dachem z izolacją ciągłą (styk ściany działowej z dachem)", 0, 0, 0.1),
  p("GF1", "podloga-grunt", "Podłoga na gruncie z izolacją pod płytą, izolacja ściany od zewnątrz", 0.65, 0.8, 0.8),
  p("GF2", "podloga-grunt", "Podłoga na gruncie z izolacją pod płytą, izolacja w środku ściany", 0.6, 0.75, 0.75),
  p("GF3", "podloga-grunt", "Podłoga na gruncie z izolacją pod płytą, ściana masywna bez izolacji na rysunku", 0.55, 0.7, 0.7),
  p("GF4", "podloga-grunt", "Podłoga na gruncie z izolacją pod płytą, ściana lekka", 0.5, 0.65, 0.65),
  p("GF5", "podloga-grunt", "Podłoga na gruncie z izolacją na płycie, izolacja ściany od zewnątrz", 0.6, 0.75, 0.75),
  p("GF6", "podloga-grunt", "Podłoga na gruncie z izolacją na płycie, izolacja w środku ściany", 0.45, 0.6, 0.6),
  p(
    "GF7",
    "podloga-grunt",
    "Podłoga na gruncie z izolacją na płycie, izolacja ściany od wewnątrz ciągła z izolacją podłogi",
    -0.05,
    0.1,
    0.1,
  ),
  p("GF8", "podloga-grunt", "Podłoga na gruncie z izolacją na płycie, ściana lekka", 0.05, 0.2, 0.2),
  p("GF9", "podloga-podwieszona", "Podłoga podwieszona z izolacją pod płytą, izolacja ściany od zewnątrz", 0.75, 0.95, 0.95),
  p("GF10", "podloga-podwieszona", "Podłoga podwieszona z izolacją pod płytą, izolacja w środku ściany", 0.65, 0.85, 0.85),
  p("GF11", "podloga-podwieszona", "Podłoga podwieszona z izolacją pod płytą, izolacja ściany od wewnątrz", 0.55, 0.75, 0.75),
  p("GF12", "podloga-podwieszona", "Podłoga podwieszona z izolacją pod płytą, ściana lekka", 0.5, 0.7, 0.7),
  p("GF13", "podloga-podwieszona", "Podłoga podwieszona z izolacją na płycie, izolacja ściany od zewnątrz", 0.6, 0.8, 0.8),
  p("GF14", "podloga-podwieszona", "Podłoga podwieszona z izolacją na płycie, izolacja w środku ściany", 0.45, 0.65, 0.65),
  p(
    "GF15",
    "podloga-podwieszona",
    "Podłoga podwieszona z izolacją na płycie, izolacja ściany od wewnątrz ciągła z izolacją podłogi",
    -0.1,
    0.1,
    0.1,
  ),
  p("GF16", "podloga-podwieszona", "Podłoga podwieszona z izolacją na płycie, ściana lekka", 0, 0.2, 0.2),
  p("P1", "slup", "Słup w ścianie przerywa izolację od zewnątrz", 1.3, 1.3, 1.3),
  p("P2", "slup", "Słup w ścianie przerywa izolację w środku", 1.2, 1.2, 1.2),
  p("P3", "slup", "Słup w ścianie przerywa izolację od wewnątrz", 1.15, 1.15, 1.15),
  p("P4", "slup", "Słup w ścianie lekkiej", 0.9, 0.9, 0.9),
  p("W1", "otwor", "Okno/drzwi przy zewnętrznym licu, izolacja ściany od zewnątrz (okno w płaszczyźnie izolacji)", 0, 0, 0),
  p("W2", "otwor", "Okno/drzwi przy zewnętrznym licu, izolacja w środku, ościeże zamurowane", 1.0, 1.0, 1.0),
  p("W3", "otwor", "Okno/drzwi przy zewnętrznym licu, izolacja ściany od wewnątrz", 0.8, 0.8, 0.8),
  p("W4", "otwor", "Okno/drzwi przy zewnętrznym licu ściany lekkiej", 0.15, 0.15, 0.15),
  p("W5", "otwor", "Okno/drzwi przy zewnętrznym licu, izolacja w środku dochodzi do ościeża", 0.4, 0.4, 0.4),
  p("W6", "otwor", "Okno/drzwi przy zewnętrznym licu, izolacja od wewnątrz zawinięta na ościeże", 0.1, 0.1, 0.1),
  p("W7", "otwor", "Okno/drzwi w środku grubości ściany, izolacja ściany od zewnątrz", 0.45, 0.45, 0.45),
  p("W8", "otwor", "Okno/drzwi w środku grubości ściany, izolacja w środku, ościeże zamurowane", 1.0, 1.0, 1.0),
  p("W9", "otwor", "Okno/drzwi w środku grubości ściany, izolacja ściany od wewnątrz", 0.6, 0.6, 0.6),
  p("W10", "otwor", "Okno/drzwi w środku grubości ściany lekkiej", 0.1, 0.1, 0.1),
  p("W11", "otwor", "Okno/drzwi w środku grubości ściany, w płaszczyźnie izolacji w środku (izolacja dochodzi do ramy)", 0, 0, 0),
  p("W12", "otwor", "Okno/drzwi w środku grubości ściany, izolacja od wewnątrz zawinięta na ościeże", 0.1, 0.1, 0.1),
  p("W13", "otwor", "Okno/drzwi przy wewnętrznym licu, izolacja ściany od zewnątrz", 0.8, 0.8, 0.8),
  p("W14", "otwor", "Okno/drzwi przy wewnętrznym licu, izolacja w środku, ościeże zamurowane", 1.0, 1.0, 1.0),
  p("W15", "otwor", "Okno/drzwi przy wewnętrznym licu, izolacja ściany od wewnątrz (okno w płaszczyźnie izolacji)", 0, 0, 0),
  p("W16", "otwor", "Okno/drzwi przy wewnętrznym licu ściany lekkiej", 0.15, 0.15, 0.15),
  p("W17", "otwor", "Okno/drzwi przy wewnętrznym licu, izolacja w środku dochodzi do ościeża", 0.4, 0.4, 0.4),
  p("W18", "otwor", "Okno/drzwi przy wewnętrznym licu, izolacja od zewnątrz zawinięta na ościeże", 0.2, 0.2, 0.2),
]

export function pozycjaKatalogu(kod: string): PozycjaKatalogu | undefined {
  return KATALOG_PSI_14683.find((x) => x.kod === kod)
}
