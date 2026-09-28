/**
 * Przykładowe średnie moce typowych urządzeń — podpowiedź dla laika, nie dane katalogowe i nie norma.
 * Decyzja właściciela projektu D33 (28.09.2026, `rejestr-decyzji.md`): pokazujemy typową moc, jak
 * w poradnikach, ale użytkownik zawsze wpisuje moc SWOJEGO modelu (tabliczka, instrukcja, internet).
 * Nigdy nie wstawiać tych wartości do obliczeń jako domyślnych. Wartości do potwierdzenia przez
 * właściciela (✅🤖).
 */

export type PrzykladoweUrzadzenie = {
  nazwa: string
  /** Przykładowa średnia moc podczas pracy [W] — orientacyjnie, konkretne modele różnią się wielokrotnie. */
  mocW: number
  /** Pracuje cyklicznie (sprężarka) — współczynnik pracy i tak wpisuje użytkownik. */
  cykliczne: boolean
}

export const PRZYKLADOWE_URZADZENIA: readonly PrzykladoweUrzadzenie[] = [
  // Example from the source (Tresc_Modul_12, E11): 45 W camping fridge.
  { nazwa: "Lodówka turystyczna sprężarkowa 12 V", mocW: 45, cykliczne: true },
  { nazwa: "Lodówka domowa", mocW: 100, cykliczne: true },
  { nazwa: "Zamrażarka", mocW: 120, cykliczne: true },
  { nazwa: "Router Wi-Fi", mocW: 10, cykliczne: false },
  { nazwa: "Żarówka LED", mocW: 8, cykliczne: false },
  { nazwa: "Ładowarka telefonu", mocW: 10, cykliczne: false },
  { nazwa: "Laptop (ładowanie)", mocW: 60, cykliczne: false },
  { nazwa: "Telewizor LED 32″", mocW: 40, cykliczne: false },
  { nazwa: "Telewizor LED 55″", mocW: 100, cykliczne: false },
  { nazwa: "Pompa wody 12 V", mocW: 50, cykliczne: false },
  { nazwa: "Wentylator dachowy 12 V", mocW: 25, cykliczne: false },
  { nazwa: "Pompa obiegowa C.O.", mocW: 40, cykliczne: false },
  { nazwa: "Kuchenka mikrofalowa (pobór z sieci)", mocW: 1200, cykliczne: false },
  { nazwa: "Ekspres do kawy", mocW: 1200, cykliczne: false },
  { nazwa: "Czajnik elektryczny", mocW: 2000, cykliczne: false },
  { nazwa: "Suszarka do włosów", mocW: 1800, cykliczne: false },
  // Added 28.09.2026 at the owner's request (D33 addendum) — values chosen by AI, same status as above.
  { nazwa: "Pompa głębinowa (studnia)", mocW: 750, cykliczne: false },
  { nazwa: "Klimatyzator split", mocW: 900, cykliczne: true },
  { nazwa: "Kamera monitoringu IP", mocW: 5, cykliczne: false },
]

/** Przykład pasujący do wpisanej nazwy (bez rozróżniania wielkości liter), albo null. */
export function znajdzPrzyklad(nazwa: string): PrzykladoweUrzadzenie | null {
  const n = nazwa.trim().toLocaleLowerCase("pl-PL")
  if (n === "") return null
  return PRZYKLADOWE_URZADZENIA.find((p) => p.nazwa.toLocaleLowerCase("pl-PL") === n) ?? null
}
