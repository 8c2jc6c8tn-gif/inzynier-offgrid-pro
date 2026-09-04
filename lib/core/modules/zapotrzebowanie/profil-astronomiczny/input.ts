/**
 * Ekran 5, Moduł 2 "Zapotrzebowanie energetyczne" — "Profil dobowy + astronomiczny dzień/noc"
 * (scala dawne 1.7, 1.16, docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md). Wzorzec D.
 *
 * Zbudowana tylko część astronomiczna (Sekcja A/B/C: długość dnia/nocy z szerokości geograficznej
 * i dnia roku) — fundamentalna, uniwersalna astronomia (równanie wschodu/zachodu Słońca z
 * deklinacją Coopera), ten sam rodzaj precedensu co Magnus-Tetens (Ekran 10, Moduł 4) i ciepło
 * właściwe wody (Ekran 2, Moduł 2). Profil godzinowych współczynników zapotrzebowania (Sekcja B,
 * "0,3 w nocy, 1,5 w szczycie") NIE zbudowany — źródło podaje to jako przykładowe wartości, nie
 * uniwersalną tabelę, więc przyjęcie ich jako reguły byłoby wymyślaniem danych.
 */

export type ProfilAstronomicznyInput = {
  /** Szerokość geograficzna [°], -90..90. Docelowo auto z Modułu 1. null = jeszcze nie wpisano. */
  szerokoscGeograficzna: number | null
  /** Dzień roku [1-365]. 0 = jeszcze nie wpisano. */
  dzienRoku: number
  /** Opcjonalnie: moc odbiornika działającego tylko w ciemności (np. oświetlenie zewnętrzne) [W]. 0 = pominięte. */
  mocOdbiornikaNocnegoW: number
}
