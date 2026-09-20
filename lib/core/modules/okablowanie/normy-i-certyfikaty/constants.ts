/**
 * Ekran 21, Moduł 5 "Okablowanie i zabezpieczenia" — "Normy i certyfikaty" (dawne 4.26,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec E — checklist certyfikatów.
 *
 * Źródło nazywa wprost tylko trzy normy przykładowe (Sekcja: "IEC 61730, 62109, 62619 itd.") —
 * "itd." sygnalizuje otwartą, nie zamkniętą listę. Bez pełnej bazy komponentów (§15.2, jeszcze
 * nie istnieje w tym projekcie) NIE dopisujemy własnych numerów norm dla pozostałych typów
 * komponentów (złącza, kable, SPD, wyłączniki) — to byłoby zgadywanie, którego standard zakazuje
 * (docs/standards/09-ai-w-produkcie.md 9.2 / 15-wspolpraca-z-ai.md 15.7, stosowane analogicznie do
 * kodu). Pozostałe komponenty dostają jeden, jawnie opisany wpis zbiorczy.
 */
export type PozycjaCertyfikatu = { id: string; komponent: string; norma: string }

export const CHECKLIST_ITEMS: PozycjaCertyfikatu[] = [
  { id: "panele", komponent: "Panele fotowoltaiczne", norma: "IEC 61730 (bezpieczeństwo modułów PV)" },
  { id: "falownik", komponent: "Falownik / przetwornica", norma: "IEC 62109 (bezpieczeństwo przetwornic PV)" },
  { id: "baterie-litowe", komponent: "Baterie litowe", norma: "IEC 62619 (bezpieczeństwo ogniw/baterii litowych)" },
  {
    id: "pozostale",
    komponent: "Pozostałe komponenty (złącza, kable, SPD, wyłączniki, BMS)",
    norma: "Sprawdź wymagany certyfikat u producenta — źródło nie precyzuje normy dla każdego typu",
  },
]
