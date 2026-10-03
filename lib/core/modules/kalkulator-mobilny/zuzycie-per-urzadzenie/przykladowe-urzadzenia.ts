/**
 * Przykładowe średnie moce typowych urządzeń — podpowiedź dla laika, nie dane katalogowe i nie norma.
 * Decyzja właściciela projektu D33 (28.09.2026, `rejestr-decyzji.md`): pokazujemy typową moc, jak
 * w poradnikach, ale użytkownik zawsze wpisuje moc SWOJEGO modelu (tabliczka, instrukcja, internet).
 * Nigdy nie wstawiać tych wartości do obliczeń jako domyślnych. Wartości do potwierdzenia przez
 * właściciela (✅🤖).
 */

export type PrzykladoweUrzadzenie = {
  /** Polish default name; `nazwaKey` is its UI translation (the datalist offers the translated one). */
  nazwa: string
  nazwaKey: string
  /** Przykładowa średnia moc podczas pracy [W] — orientacyjnie, konkretne modele różnią się wielokrotnie. */
  mocW: number
  /** Pracuje cyklicznie (sprężarka) — współczynnik pracy i tak wpisuje użytkownik. */
  cykliczne: boolean
}

export const PRZYKLADOWE_URZADZENIA: readonly PrzykladoweUrzadzenie[] = [
  // Example from the source (Tresc_Modul_12, E11): 45 W camping fridge.
  { nazwa: "Lodówka turystyczna sprężarkowa 12 V", nazwaKey: "UI-PRZYKURZ-LODOWKA-TURYSTYCZNA", mocW: 45, cykliczne: true },
  { nazwa: "Lodówka domowa", nazwaKey: "UI-PRZYKURZ-LODOWKA-DOMOWA", mocW: 100, cykliczne: true },
  { nazwa: "Zamrażarka", nazwaKey: "UI-PRZYKURZ-ZAMRAZARKA", mocW: 120, cykliczne: true },
  { nazwa: "Router Wi-Fi", nazwaKey: "UI-PRZYKURZ-ROUTER", mocW: 10, cykliczne: false },
  { nazwa: "Żarówka LED", nazwaKey: "UI-PRZYKURZ-ZAROWKA", mocW: 8, cykliczne: false },
  { nazwa: "Ładowarka telefonu", nazwaKey: "UI-PRZYKURZ-LADOWARKA", mocW: 10, cykliczne: false },
  { nazwa: "Laptop (ładowanie)", nazwaKey: "UI-PRZYKURZ-LAPTOP", mocW: 60, cykliczne: false },
  { nazwa: "Telewizor LED 32″", nazwaKey: "UI-PRZYKURZ-TV32", mocW: 40, cykliczne: false },
  { nazwa: "Telewizor LED 55″", nazwaKey: "UI-PRZYKURZ-TV55", mocW: 100, cykliczne: false },
  { nazwa: "Pompa wody 12 V", nazwaKey: "UI-PRZYKURZ-POMPA-WODY", mocW: 50, cykliczne: false },
  { nazwa: "Wentylator dachowy 12 V", nazwaKey: "UI-PRZYKURZ-WENTYLATOR", mocW: 25, cykliczne: false },
  { nazwa: "Pompa obiegowa C.O.", nazwaKey: "UI-PRZYKURZ-POMPA-CO", mocW: 40, cykliczne: false },
  { nazwa: "Kuchenka mikrofalowa (pobór z sieci)", nazwaKey: "UI-PRZYKURZ-MIKROFALOWKA", mocW: 1200, cykliczne: false },
  { nazwa: "Ekspres do kawy", nazwaKey: "UI-PRZYKURZ-EKSPRES", mocW: 1200, cykliczne: false },
  { nazwa: "Czajnik elektryczny", nazwaKey: "UI-PRZYKURZ-CZAJNIK", mocW: 2000, cykliczne: false },
  { nazwa: "Suszarka do włosów", nazwaKey: "UI-PRZYKURZ-SUSZARKA", mocW: 1800, cykliczne: false },
  // Added 28.09.2026 at the owner's request (D33 addendum) — values chosen by AI, same status as above.
  { nazwa: "Pompa głębinowa (studnia)", nazwaKey: "UI-PRZYKURZ-POMPA-GLEBINOWA", mocW: 750, cykliczne: false },
  { nazwa: "Klimatyzator split", nazwaKey: "UI-PRZYKURZ-KLIMATYZATOR", mocW: 900, cykliczne: true },
  { nazwa: "Kamera monitoringu IP", nazwaKey: "UI-PRZYKURZ-KAMERA", mocW: 5, cykliczne: false },
]

/**
 * Przykład pasujący do wpisanej nazwy (bez rozróżniania wielkości liter), albo null. Dopasowanie do nazwy
 * polskiej albo — gdy podano `nazwaWyswietlana` — do nazwy w języku UI (podpowiedź z datalisty wstawia ją do pola).
 */
export function znajdzPrzyklad(
  nazwa: string,
  nazwaWyswietlana?: (p: PrzykladoweUrzadzenie) => string,
): PrzykladoweUrzadzenie | null {
  const n = nazwa.trim().toLocaleLowerCase("pl-PL")
  if (n === "") return null
  const rowna = (tekst: string) => tekst.toLocaleLowerCase("pl-PL") === n
  return PRZYKLADOWE_URZADZENIA.find((p) => rowna(p.nazwa) || (nazwaWyswietlana !== undefined && rowna(nazwaWyswietlana(p)))) ?? null
}
