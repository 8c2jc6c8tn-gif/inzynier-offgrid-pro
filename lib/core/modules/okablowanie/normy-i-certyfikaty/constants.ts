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
export type PozycjaCertyfikatu = { id: string; komponentKey: string; normaKey: string }

/** Labels are i18n keys (docs/standards/17-i18n.md, 17.2) — the screen resolves them in the UI language. */
export const CHECKLIST_ITEMS: PozycjaCertyfikatu[] = [
  { id: "panele", komponentKey: "CERT-KOMPONENT-PANELE", normaKey: "CERT-NORMA-PANELE" },
  { id: "falownik", komponentKey: "CERT-KOMPONENT-FALOWNIK", normaKey: "CERT-NORMA-FALOWNIK" },
  { id: "baterie-litowe", komponentKey: "CERT-KOMPONENT-BATERIE-LITOWE", normaKey: "CERT-NORMA-BATERIE-LITOWE" },
  { id: "pozostale", komponentKey: "CERT-KOMPONENT-POZOSTALE", normaKey: "CERT-NORMA-POZOSTALE" },
]
