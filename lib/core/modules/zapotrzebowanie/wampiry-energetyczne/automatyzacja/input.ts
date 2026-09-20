/**
 * Moduł zbiorczy "Wampiry energetyczne", podzakładka 5: Automatyzacja. Domyka dawne 1.34
 * (tryb "czuwanie domowe"), 1.40 (tryb "nieobecność"), 1.48-scenariusze (praca z domu/weekend/
 * urlop) — generyczny silnik "standby referencyjny vs standby w scenariuszu", nie 4 kopie tego
 * samego liczenia. 1.47 (redukcja poboru falownika nocą) to echo do już zbudowanego ekranu
 * `pobor-wlasny-falownika` — bez własnej logiki tutaj. 1.35+1.36+1.49 (detekcja always-on/
 * integracja smart-plug API/harmonogram wg obecności) to treść informacyjna w UI — wymagałyby
 * realnej integracji sprzętowej, poza zakresem kalkulatora offline-first.
 */

export type ScenariuszAutomatyzacjiInput = {
  /** Standby w normalnym trybie (dziś, bez scenariusza) [W]. */
  standbyReferencyjnyW: number
  /** Standby w wybranym scenariuszu (np. nocny, nieobecność, urlop) [W]. */
  standbyWScenariuszuW: number
}
