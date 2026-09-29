/**
 * M14 — D14 „FAQ” (dom) and F13 „FAQ firm”, Wzorzec C. `03_M14_Dom_i_Firma_Siec.md` §1–3, §7–8,
 * opracowanie §3, §7, §8 — the firm questions are the material's part 8 corrected (✏️ K1, K3, K5–K7b,
 * K9, K13, K14). Prices from the material (BESS 1 400–2 500 zł/kWh, meter test 130–210 zł, „do 85%”)
 * are 🔎B / unconfirmed and are NOT stated as facts. Guide text — Polish only.
 */
export type PytanieFaq = { id: string; pytanie: string; odpowiedz: string; link?: { href: string; etykieta: string } }

export const FAQ_DOM: PytanieFaq[] = [
  {
    id: "dom-cena-trzymania",
    pytanie: "Ile płacę za samo to, że mam przyłącze?",
    odpowiedz:
      "To „cena trzymania sieci”: opłata sieciowa stała, abonamentowa, handlowa sprzedawcy i mocowa (w G ryczałt wg progu zużycia), razem z VAT — płacisz je, dopóki istnieją umowa i licznik, nawet przy zerowym zużyciu. PV i magazyn obniżają tylko składniki zmienne. Rachunek rozbity na stałe i zmienne pokaże, ile to w Twoim przypadku.",
    link: { href: "/kalkulatory/rachunek-dom", etykieta: "Mój rachunek dziś" },
  },
  {
    id: "dom-net-metering",
    pytanie: "Czym różni się net-metering od net-billingu?",
    odpowiedz:
      "Net-metering (instalacje z wniosków sprzed 1.04.2022): z 1 kWh oddanej odbierasz 0,8 kWh (do 10 kW) albo 0,7 kWh (powyżej), przez 15 lat. Net-billing: nadwyżka jest wyceniana ceną rynkową (RCEm albo godzinowa RCE), a wartość trafia na depozyt prosumencki ważny 12 miesięcy.",
    link: { href: "/kalkulatory/depozyt-prosumencki", etykieta: "Depozyt prosumencki" },
  },
  {
    id: "dom-1-23",
    pytanie: "Skąd współczynnik 1,23 w depozycie?",
    odpowiedz:
      "Z ustawy o OZE (art. 4c ust. 4): wartość depozytu z danego miesiąca jest zwiększana o 1,23 — dla każdego prosumenta, od 1.02.2025.",
  },
  {
    id: "dom-zwrot-depozytu",
    pytanie: "Co się dzieje z niewykorzystanym depozytem?",
    odpowiedz:
      "Po 12 miesiącach możesz dostać zwrot, ale najwyżej 20% wartości energii z danego miesiąca przy rozliczeniu RCEm albo 30% przy RCE. Reszta jest umarzana. Ujemna cena RCE liczy się jako zero.",
  },
  {
    id: "dom-jednokierunkowe",
    pytanie: "Czy mogę wrócić z RCE na RCEm albo z net-billingu na net-metering?",
    odpowiedz: "Nie. Oba przejścia są jednokierunkowe (art. 4b ust. 2b i art. 4d ust. 1 ustawy o OZE).",
  },
  {
    id: "dom-odlaczenie",
    pytanie: "Czy opłaca się całkiem odłączyć od sieci?",
    odpowiedz:
      "To zależy od Twojego zużycia zimą, lokalizacji i cen sprzętu. Porównanie A–D pokazuje obok siebie najtańszy i najbardziej niezależny scenariusz. Stary prosument w net-meteringu zwykle wygrywa scenariuszem A — aplikacja powie to uczciwie, nawet jeśli wynik brzmi „zostań”.",
    link: { href: "/kalkulatory/scenariusze-dom", etykieta: "Porównanie scenariuszy A–D" },
  },
  {
    id: "dom-najpierw",
    pytanie: "Od czego zacząć, jeśli myślę o odłączeniu?",
    odpowiedz:
      "Od odwracalnych kroków: policz scenariusze, zbuduj system wyspowy i przetestuj go przy wciąż podłączonej sieci przez pełną zimę. Wypowiedzenie umowy to dopiero krok 5 z 7.",
    link: { href: "/kalkulatory/rezygnacja-z-przylacza", etykieta: "Jak zrezygnować z przyłącza" },
  },
  {
    id: "dom-agregat",
    pytanie: "Czy mogę podłączyć agregat do gniazdka?",
    odpowiedz:
      "Nie. Agregat zasila instalację budynku wyłącznie przez przełącznik z pozycją 0 i blokadą — inaczej może podać napięcie do sieci albo na bolce wtyczki. Agregat spalinowy nigdy w pomieszczeniu mieszkalnym (czad).",
    link: { href: "/kalkulatory/przelacznik-siec-wyspa", etykieta: "Przełącznik sieć/wyspa" },
  },
  {
    id: "dom-licznik",
    pytanie: "Podejrzewam, że licznik zawyża. Co zrobić?",
    odpowiedz:
      "Zrób test diody, potem złóż reklamację. 14 dni to termin odpowiedzi przedsiębiorstwa, a nie termin na złożenie reklamacji. Badanie laboratoryjne licznika OSD przeprowadza w 14 dni od zgłoszenia.",
    link: { href: "/kalkulatory/test-licznika", etykieta: "Test licznika i reklamacja" },
  },
]

export const FAQ_FIRMA: PytanieFaq[] = [
  {
    id: "firma-regulowane",
    pytanie: "Czy ceny w taryfach C są nieregulowane?",
    odpowiedz:
      "Nieregulowana jest sprzedaż energii. Stawki dystrybucji dla grup C co roku zatwierdza Prezes URE — to one są w pliku taryf OSD.",
  },
  {
    id: "firma-bierna-kto",
    pytanie: "Czy firma w taryfie C płaci za moc bierną?",
    odpowiedz:
      "Tylko jeśli wynika to z warunków przyłączenia albo umowy — w praktyce głównie odbiorcy powyżej 40 kW. Sprawdź, czy na fakturze jest pozycja za energię bierną. Opłata dotyczy nadwyżki ponad tgφ₀ (domyślnie 0,4, nigdy poniżej 0,2).",
    link: { href: "/kalkulatory/moc-bierna", etykieta: "Moc bierna" },
  },
  {
    id: "firma-bierna-jak",
    pytanie: "Jak uniknąć opłat za moc bierną?",
    odpowiedz:
      "Kompensacja (bateria kondensatorów) i regularne sprawdzanie tgφ. Kalkulator liczy, jaką moc kompensacji potrzebujesz do docelowego tgφ; kwotę opłaty — dopiero gdy wpiszesz cenę C_rk.",
  },
  {
    id: "firma-mocowa",
    pytanie: "Ile wynosi opłata mocowa dla firm w 2026 roku?",
    odpowiedz:
      "0,2194 zł/kWh netto za energię pobraną w dni robocze w godzinach 7:00–22:00 (Informacja Prezesa URE nr 58/2025). To +55,3% wobec 0,1413 zł/kWh w 2025.",
    link: { href: "/kalkulatory/oplata-mocowa", etykieta: "Opłata mocowa" },
  },
  {
    id: "firma-net-billing",
    pytanie: "Czy net-billing dla firm się opłaca?",
    odpowiedz:
      "Kluczowa jest autokonsumpcja: kWh zużyta od razu jest warta pełną cenę zakupu, a oddana — tylko cenę rynkową. Współczynnik bilansowania nie jest stałą 0,3–0,4; aplikacja wylicza go z Twoich danych (wartość nadwyżki ÷ pełny koszt kWh pobranej).",
    link: { href: "/kalkulatory/pv-w-firmie", etykieta: "PV w firmie i autokonsumpcja" },
  },
  {
    id: "firma-depozyt",
    pytanie: "Czym jest depozyt prosumencki firmy?",
    odpowiedz:
      "Wirtualne konto z wartością oddanej energii, zwiększaną o 1,23 (każdy prosument, od 1.02.2025) i ważną 12 miesięcy. Skutki podatkowe po stronie firmy zależą od formy opodatkowania — skonsultuj z księgowym.",
    link: { href: "/kalkulatory/depozyt-prosumencki", etykieta: "Depozyt prosumencki" },
  },
  {
    id: "firma-bess-cena",
    pytanie: "Ile kosztuje magazyn energii dla firmy i kiedy się zwraca?",
    odpowiedz:
      "Aplikacja nie podaje cen z pamięci — ceny zmieniają się szybko. Wpisz ceny z ofert, a kalkulator policzy zwrot z Twoich strumieni korzyści.",
    link: { href: "/kalkulatory/magazyn-firmy", etykieta: "Magazyn (BESS) w firmie" },
  },
  {
    id: "firma-dotacje",
    pytanie: "Czy są dotacje na magazyny energii dla firm?",
    odpowiedz:
      "„Przydomowe Magazyny Energii” i ulga termomodernizacyjna dotyczą osób fizycznych, nie firm. Regionalny nabór FEPK.02.03-IZ.00-002/26 zakończył się 31.03.2026. Sprawdzaj aktualne nabory w programach regionalnych.",
    link: { href: "/kalkulatory/dotacje-firma", etykieta: "Dotacje i podatki" },
  },
  {
    id: "firma-licznik-test",
    pytanie: "Jak sprawdzić, czy licznik działa poprawnie?",
    odpowiedz:
      "Test diody: wyłącz, co się da, i zmierz czas n impulsów. P [kW] = 3600 · n ÷ (czas [s] · stała licznika [imp/kWh]). Przykład: 15 impulsów w 60 s przy 1000 imp/kWh to 0,9 kW.",
    link: { href: "/kalkulatory/test-licznika", etykieta: "Test licznika" },
  },
  {
    id: "firma-licznik-reklamacja",
    pytanie: "Co zrobić, jeśli licznik zawyża?",
    odpowiedz:
      "Złóż reklamację — 14 dni to termin odpowiedzi przedsiębiorstwa. Potem możesz zażądać badania laboratoryjnego (OSD ma 14 dni od zgłoszenia). Dodatkową ekspertyzę opłaca odbiorca, chyba że wykaże nieprawidłowości — wtedy koszt ponosi przedsiębiorstwo. Kwoty badania różnią się między OSD — sprawdź cennik swojego operatora.",
  },
  {
    id: "firma-zmiana-taryfy",
    pytanie: "Czy mogę zmienić taryfę, np. z C11 na C12a?",
    odpowiedz:
      "Tak. Najpierw porównaj koszt w każdej dostępnej taryfie dla swojego profilu zużycia — grupy C1x są dla mocy umownej do 40 kW, C2x powyżej.",
    link: { href: "/kalkulatory/taryfy-c", etykieta: "Porównywarka taryf C" },
  },
]
