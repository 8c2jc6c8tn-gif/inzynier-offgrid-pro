/**
 * Kody znakowania zacisków/żył — 1:1 z Tabeli 1, PN-EN 60445:2010
 * (`docs/zrodla/norma-PN-EN-60445/00-INDEKS.md`, zweryfikowana wizualnie w całości).
 *
 * Uwaga o zakresie: PN-EN 60445 normuje TYLKO kody alfanumeryczne/graficzne (ta tabela).
 * Kolorystykę żył (np. żółto-zielony dla PE, niebieski dla N) normuje OSOBNA norma (IEC 60446),
 * której nie mamy w `docs/zrodla/` — świadomie NIE wpisana tu jako "1:1 ze źródła", żeby nie
 * przypisywać normie PN-EN 60445 treści, której nie zawiera.
 */
export type ElementOznakowania = { id: string; nazwa: string; kodOznaczenia: string }

export const CHECKLIST_ITEMS: ElementOznakowania[] = [
  { id: "dc-plus", nazwa: "Przewód dodatni DC (L+)", kodOznaczenia: "+" },
  { id: "dc-minus", nazwa: "Przewód ujemny DC (L−)", kodOznaczenia: "−" },
  { id: "pe", nazwa: "Przewód ochronny (PE)", kodOznaczenia: "PE" },
  { id: "ac-l", nazwa: "Faza AC (L)", kodOznaczenia: "U" },
  { id: "ac-n", nazwa: "Przewód neutralny AC (N)", kodOznaczenia: "N" },
]
