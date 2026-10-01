/**
 * Ekran 16, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Sterowanie strefowe" (dawne 5.16,
 * docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §6.16). Wzorzec D.
 */

export type StrefaGrzewcza = {
  nazwa: string
  /** Współczynnik strat ciepła strefy H [W/K] (Ekran 1 — straty przez przegrody i wentylację tej części domu). */
  hWK: number
  /** Temperatura komfortowa strefy [°C]; null = jeszcze nie wpisano. */
  tKomfortC: number | null
  /** Temperatura obniżona [°C]; null = bez obniżenia (strefa grzana cały czas do komfortu). */
  tObnizonaC: number | null
  /** Ile godzin na dobę strefa ma temperaturę obniżoną [h]. 0 = bez obniżenia. */
  godzinObnizenia: number
}

export type SterowanieStrefoweInput = {
  strefy: StrefaGrzewcza[]
  /** Średnia temperatura zewnętrzna okresu, dla którego liczysz (np. typowa doba zimowa) [°C]; null = nie wpisano. */
  tZewnC: number | null
  /** Liczba siłowników (zaworów sterowanych). */
  liczbaSilownikow: number
  /** Pobór jednego siłownika [W] — karta (źródło: „1–5 W każdy”). */
  mocSilownikaW: number
  /** Ile godzin na dobę siłowniki są zasilane [h]. */
  godzinPracySilownikow: number
  /** Łączny pobór sterownika strefowego i termostatów [W], zasilanych całą dobę. */
  mocSterownikowW: number
  /** COP ogrzewania (1 = grzałka/kocioł elektryczny; pompa — karta). 0 = ogrzewanie nieelektryczne (paliwo). */
  copOgrzewania: number
}
