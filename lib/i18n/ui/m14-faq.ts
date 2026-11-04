/**
 * M14 — FAQ texts: D14 „FAQ” (dom) and F13 „FAQ firm” (`components/siec/tresci-faq.ts` holds the
 * order, ids and links). Source and corrections as described there — prices from the material are
 * 🔎B and are NOT stated as facts, in any language.
 */
// English: ./m14-faq.en.ts, Russian: ./m14-faq.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-FAQ-DOM-CENA-TRZYMANIA-P": "Ile płacę za samo to, że mam przyłącze?",
  "UI-FAQ-DOM-CENA-TRZYMANIA-O":
    "To „cena trzymania sieci”: opłata sieciowa stała, abonamentowa, handlowa sprzedawcy i mocowa (w G ryczałt wg progu zużycia), razem z VAT — płacisz je, dopóki istnieją umowa i licznik, nawet przy zerowym zużyciu. PV i magazyn obniżają tylko składniki zmienne. Rachunek rozbity na stałe i zmienne pokaże, ile to w Twoim przypadku.",
  "UI-FAQ-DOM-CENA-TRZYMANIA-L": "Mój rachunek dziś",
  "UI-FAQ-DOM-NET-METERING-P": "Czym różni się net-metering od net-billingu?",
  "UI-FAQ-DOM-NET-METERING-O":
    "Net-metering (instalacje z wniosków sprzed 1.04.2022): z 1 kWh oddanej odbierasz 0,8 kWh (do 10 kW) albo 0,7 kWh (powyżej), przez 15 lat. Net-billing: nadwyżka jest wyceniana ceną rynkową (RCEm albo godzinowa RCE), a wartość trafia na depozyt prosumencki ważny 12 miesięcy.",
  "UI-FAQ-DOM-NET-METERING-L": "Depozyt prosumencki",
  "UI-FAQ-DOM-1-23-P": "Skąd współczynnik 1,23 w depozycie?",
  "UI-FAQ-DOM-1-23-O":
    "Z ustawy o OZE (art. 4c ust. 4): wartość depozytu z danego miesiąca jest zwiększana o 1,23 — dla każdego prosumenta, od 1.02.2025.",
  "UI-FAQ-DOM-ZWROT-DEPOZYTU-P": "Co się dzieje z niewykorzystanym depozytem?",
  "UI-FAQ-DOM-ZWROT-DEPOZYTU-O":
    "Po 12 miesiącach możesz dostać zwrot, ale najwyżej 20% wartości energii z danego miesiąca przy rozliczeniu RCEm albo 30% przy RCE. Reszta jest umarzana. Ujemna cena RCE liczy się jako zero.",
  "UI-FAQ-DOM-JEDNOKIERUNKOWE-P": "Czy mogę wrócić z RCE na RCEm albo z net-billingu na net-metering?",
  "UI-FAQ-DOM-JEDNOKIERUNKOWE-O":
    "Nie. Oba przejścia są jednokierunkowe (art. 4b ust. 2b i art. 4d ust. 1 ustawy o OZE).",
  "UI-FAQ-DOM-ODLACZENIE-P": "Czy opłaca się całkiem odłączyć od sieci?",
  "UI-FAQ-DOM-ODLACZENIE-O":
    "To zależy od Twojego zużycia zimą, lokalizacji i cen sprzętu. Porównanie A–D pokazuje obok siebie najtańszy i najbardziej niezależny scenariusz. Stary prosument w net-meteringu zwykle wygrywa scenariuszem A — aplikacja powie to uczciwie, nawet jeśli wynik brzmi „zostań”.",
  "UI-FAQ-DOM-ODLACZENIE-L": "Porównanie scenariuszy A–D",
  "UI-FAQ-DOM-NAJPIERW-P": "Od czego zacząć, jeśli myślę o odłączeniu?",
  "UI-FAQ-DOM-NAJPIERW-O":
    "Od odwracalnych kroków: policz scenariusze, zbuduj system wyspowy i przetestuj go przy wciąż podłączonej sieci przez pełną zimę. Wypowiedzenie umowy to dopiero krok 5 z 7.",
  "UI-FAQ-DOM-NAJPIERW-L": "Jak zrezygnować z przyłącza",
  "UI-FAQ-DOM-AGREGAT-P": "Czy mogę podłączyć agregat do gniazdka?",
  "UI-FAQ-DOM-AGREGAT-O":
    "Nie. Agregat zasila instalację budynku wyłącznie przez przełącznik z pozycją 0 i blokadą — inaczej może podać napięcie do sieci albo na bolce wtyczki. Agregat spalinowy nigdy w pomieszczeniu mieszkalnym (czad).",
  "UI-FAQ-DOM-AGREGAT-L": "Przełącznik sieć/wyspa",
  "UI-FAQ-DOM-LICZNIK-P": "Podejrzewam, że licznik zawyża. Co zrobić?",
  "UI-FAQ-DOM-LICZNIK-O":
    "Zrób test diody, potem złóż reklamację. 14 dni to termin odpowiedzi przedsiębiorstwa, a nie termin na złożenie reklamacji. Badanie laboratoryjne licznika OSD przeprowadza w 14 dni od zgłoszenia.",
  "UI-FAQ-DOM-LICZNIK-L": "Test licznika i reklamacja",
  "UI-FAQ-FIRMA-REGULOWANE-P": "Czy ceny w taryfach C są nieregulowane?",
  "UI-FAQ-FIRMA-REGULOWANE-O":
    "Nieregulowana jest sprzedaż energii. Stawki dystrybucji dla grup C co roku zatwierdza Prezes URE — to one są w pliku taryf OSD.",
  "UI-FAQ-FIRMA-BIERNA-KTO-P": "Czy firma w taryfie C płaci za moc bierną?",
  "UI-FAQ-FIRMA-BIERNA-KTO-O":
    "Tylko jeśli wynika to z warunków przyłączenia albo umowy — w praktyce głównie odbiorcy powyżej 40 kW. Sprawdź, czy na fakturze jest pozycja za energię bierną. Opłata dotyczy nadwyżki ponad tgφ₀ (domyślnie 0,4, nigdy poniżej 0,2).",
  "UI-FAQ-FIRMA-BIERNA-KTO-L": "Moc bierna",
  "UI-FAQ-FIRMA-BIERNA-JAK-P": "Jak uniknąć opłat za moc bierną?",
  "UI-FAQ-FIRMA-BIERNA-JAK-O":
    "Kompensacja (bateria kondensatorów) i regularne sprawdzanie tgφ. Kalkulator liczy, jaką moc kompensacji potrzebujesz do docelowego tgφ; kwotę opłaty — dopiero gdy wpiszesz cenę C_rk.",
  "UI-FAQ-FIRMA-MOCOWA-P": "Ile wynosi opłata mocowa dla firm w 2026 roku?",
  "UI-FAQ-FIRMA-MOCOWA-O":
    "0,2194 zł/kWh netto za energię pobraną w dni robocze w godzinach 7:00–22:00 (Informacja Prezesa URE nr 58/2025). To +55,3% wobec 0,1413 zł/kWh w 2025.",
  "UI-FAQ-FIRMA-MOCOWA-L": "Opłata mocowa",
  "UI-FAQ-FIRMA-NET-BILLING-P": "Czy net-billing dla firm się opłaca?",
  "UI-FAQ-FIRMA-NET-BILLING-O":
    "Kluczowa jest autokonsumpcja: kWh zużyta od razu jest warta pełną cenę zakupu, a oddana — tylko cenę rynkową. Współczynnik bilansowania nie jest stałą 0,3–0,4; aplikacja wylicza go z Twoich danych (wartość nadwyżki ÷ pełny koszt kWh pobranej).",
  "UI-FAQ-FIRMA-NET-BILLING-L": "PV w firmie i autokonsumpcja",
  "UI-FAQ-FIRMA-DEPOZYT-P": "Czym jest depozyt prosumencki firmy?",
  "UI-FAQ-FIRMA-DEPOZYT-O":
    "Wirtualne konto z wartością oddanej energii, zwiększaną o 1,23 (każdy prosument, od 1.02.2025) i ważną 12 miesięcy. Skutki podatkowe po stronie firmy zależą od formy opodatkowania — skonsultuj z księgowym.",
  "UI-FAQ-FIRMA-DEPOZYT-L": "Depozyt prosumencki",
  "UI-FAQ-FIRMA-BESS-CENA-P": "Ile kosztuje magazyn energii dla firmy i kiedy się zwraca?",
  "UI-FAQ-FIRMA-BESS-CENA-O":
    "Aplikacja nie podaje cen z pamięci — ceny zmieniają się szybko. Wpisz ceny z ofert, a kalkulator policzy zwrot z Twoich strumieni korzyści.",
  "UI-FAQ-FIRMA-BESS-CENA-L": "Magazyn (BESS) w firmie",
  "UI-FAQ-FIRMA-DOTACJE-P": "Czy są dotacje na magazyny energii dla firm?",
  "UI-FAQ-FIRMA-DOTACJE-O":
    "„Przydomowe Magazyny Energii” i ulga termomodernizacyjna dotyczą osób fizycznych, nie firm. Regionalny nabór FEPK.02.03-IZ.00-002/26 zakończył się 31.03.2026. Sprawdzaj aktualne nabory w programach regionalnych.",
  "UI-FAQ-FIRMA-DOTACJE-L": "Dotacje i podatki",
  "UI-FAQ-FIRMA-LICZNIK-TEST-P": "Jak sprawdzić, czy licznik działa poprawnie?",
  "UI-FAQ-FIRMA-LICZNIK-TEST-O":
    "Test diody: wyłącz, co się da, i zmierz czas n impulsów. P [kW] = 3600 · n ÷ (czas [s] · stała licznika [imp/kWh]). Przykład: 15 impulsów w 60 s przy 1000 imp/kWh to 0,9 kW.",
  "UI-FAQ-FIRMA-LICZNIK-TEST-L": "Test licznika",
  "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-P": "Co zrobić, jeśli licznik zawyża?",
  "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-O":
    "Złóż reklamację — 14 dni to termin odpowiedzi przedsiębiorstwa. Potem możesz zażądać badania laboratoryjnego (OSD ma 14 dni od zgłoszenia). Dodatkową ekspertyzę opłaca odbiorca, chyba że wykaże nieprawidłowości — wtedy koszt ponosi przedsiębiorstwo. Kwoty badania różnią się między OSD — sprawdź cennik swojego operatora.",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-P": "Czy mogę zmienić taryfę, np. z C11 na C12a?",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-O":
    "Tak. Najpierw porównaj koszt w każdej dostępnej taryfie dla swojego profilu zużycia — grupy C1x są dla mocy umownej do 40 kW, C2x powyżej.",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-L": "Porównywarka taryf C",
} as const
