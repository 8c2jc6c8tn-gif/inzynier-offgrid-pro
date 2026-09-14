/**
 * Ekran 3, Moduł 5 "Okablowanie i zabezpieczenia" — "Szyny zbiorcze i połączenia"
 * (dawne 4.19, 4.20, 4.24, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md, Wzorzec hybrydowy).
 *
 * Zbudowana tylko dolna sekcja (E — checklist momentów dokręcania). Górna sekcja (D — dobór
 * przekroju szyny wg wytrzymałości zwarciowej) świadomie NIE zbudowana — źródło nie podaje wzoru
 * ani tabeli wiążącej prąd zwarciowy z minimalnym przekrojem szyny zbiorczej (ten sam rodzaj luki
 * co M11/B5 przed pozyskaniem normy PN-HD 60364-5-52 dla kabli).
 */

export type SzynyZbiorczePolaczeniaInput = {
  potwierdzoneIds: string[]
}
