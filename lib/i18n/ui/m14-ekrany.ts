/**
 * M14 — titles and descriptions of the simple screens (FAQ, dotacje, scenariusze, PV i magazyn) and
 * the subsidy list. The catalogue entries themselves (`lib/core/dane/dotacje`: name, description) are
 * catalogue content and stay Polish for now (`docs/lista-do-zrobienia.md`).
 */
// English: ./m14-ekrany.en.ts, Russian: ./m14-ekrany.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-FAQ-DOM-TYTUL": "Najczęstsze pytania — dom i sieć",
  "UI-FAQ-DOM-OPIS":
    "Rachunek, prosument, odłączenie i bezpieczeństwo w krótkich odpowiedziach, z odnośnikami do kalkulatorów. M14 „Dom – sieć”, ekran D14.",
  "UI-FAQ-FIRMA-TYTUL": "Najczęstsze pytania firm",
  "UI-FAQ-FIRMA-OPIS":
    "Taryfy C, moc bierna, opłata mocowa, net-billing, magazyny i licznik — odpowiedzi poprawione względem materiału źródłowego. M14 „Firma – sieć”, ekran F13.",
  "UI-DOT-TYTUL": "Dotacje (stan na dzień)",
  "UI-DOT-OPIS":
    "Informacja, nie porada. Każda pozycja ma datę stanu i znak pewności: ✅ odczyt źródła, 🔎B jedno źródło albo wiedza ekspercka. Po terminie naboru pozycja sama zmienia się na „nabór zakończony”. M14 „Dom – sieć”, ekran D13.",
  "UI-DOT-UWAGA-KOLEJNOSC":
    "Uwaga na kolejność: dotacje na magazyn są dziś powiązane z byciem prosumentem przyłączonym do sieci. Odłączenie w okresie trwałości projektu może oznaczać zwrot dotacji — sprawdź regulamin, zanim wybierzesz scenariusz D.",
  "UI-DOT-FIRMA-TYTUL": "Dotacje i podatki — informacja, nie porada",
  "UI-DOT-FIRMA-OPIS":
    "Nabory dla firm ze stanem na dzień. „Przydomowe Magazyny Energii” i ulga termomodernizacyjna dotyczą osób fizycznych, więc są w części „Dom”. M14 „Firma – sieć”, ekran F12.",
  "UI-DOT-PODATKI": "Podatki",
  "UI-DOT-PODATKI-OPIS":
    "Skutki podatkowe net-billingu w firmie zależą od formy opodatkowania — skonsultuj z księgowym; interpretacje indywidualne wiążą tylko wnioskodawcę.",
  "UI-DOT-STAN-TRWA": "nabór trwa",
  "UI-DOT-STAN-ZAKONCZONY": "nabór zakończony",
  "UI-DOT-STAN-PRZYSZLY": "nabór jeszcze się nie zaczął",
  "UI-DOT-STAN-BEZ-TERMINU": "bez terminu naboru",
  "UI-DOT-STAN-NA": "Stan na {data}.",
  "UI-DOT-REGULAMIN": "Regulamin",
  "UI-DOT-BRAK-REGULAMINU":
    "Regulaminu jeszcze nie odczytaliśmy ze źródła — sprawdź go u operatora programu przed decyzją.",
  "UI-SCEN-DOM-TYTUL": "Porównanie scenariuszy A–D",
  "UI-SCEN-DOM-OPIS":
    "Sieć + PV, sieć + PV + magazyn, off-grid z siecią jako zapasem i pełne odłączenie — koszt całkowity w horyzoncie, okres zwrotu, godziny agregatu i odwracalność obok siebie. Ceny wpisujesz Ty. M14 „Dom – sieć”, ekran D7.",
  "UI-SCEN-FIRMA-TYTUL": "Scenariusze A–D dla firmy",
  "UI-SCEN-FIRMA-OPIS":
    "Te same cztery scenariusze co dla domu, z kontrolą ciągłości działania (RF1): ile godzin firma zniesie bez zasilania i czy magazyn z agregatem to pokrywa. M14 „Firma – sieć”, ekran F8.",
  "UI-PVF-TYTUL": "PV w firmie i autokonsumpcja",
  "UI-PVF-OPIS":
    "Ile energii z paneli firma zużyje od razu, ile przesunie magazyn, a ile odda do sieci (net-billing — im mniej oddajesz, tym lepiej). Nasłonecznienie z lokalizacji (Moduły 1 i 3). M14 „Firma – sieć”, ekran F6.",
  "UI-PVD-TYTUL": "Ile PV i magazynu, żeby uniezależnić się od sieci",
  "UI-PVD-OPIS":
    "Bilans miesiąc po miesiącu: ile energii dadzą panele i magazyn, ile nadal weźmiesz z sieci i ile do niej oddasz. Nasłonecznienie z Twojej lokalizacji (Moduły 1 i 3), magazyn jak w Module 4. M14 „Dom – sieć”, ekran D4.",
} as const
