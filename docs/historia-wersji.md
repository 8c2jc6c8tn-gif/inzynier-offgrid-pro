# Historia wersji programu Inżynier Offgrid

Zasady numeracji: `docs/wersjonowanie.md`. Najnowszy wpis na górze; jego numer musi zgadzać się z `package.json` (pilnuje tego test). Każdy wpis ma linię „Wpływ na liczby”.

## [3.3.0] — 09.10.2026

Porównywarka paneli PV: odczyt karty katalogowej albo naklejki ze zdjęcia lub PDF (Etap B, spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 33):
- blok „Wypełnij ze zdjęcia lub PDF karty (AI)” przy panelu wpisywanym ręcznie: asystent AI przepisuje liczby (moc, Voc, Vmp, Isc, Imp, współczynniki temperaturowe, wymiary, masa, obciążenia mechaniczne i inne), a użytkownik zatwierdza każdą z nich osobno, zanim trafi do formularza,
- jawna zgoda na wysłanie pliku do dostawcy AI przy każdym odczycie, limit odczytów po stronie serwera, kontrole spójności odczytu (Vmp·Imp a moc, Voc > Vmp, Isc > Imp, sprawność z wymiarów, znak współczynników).

Wpływ na liczby: brak. Odczyt tylko wypełnia istniejące pola formularza po zatwierdzeniu przez użytkownika; silnik porównywarki (1.2.0) i wszystkie wyniki bez zmian.

## [3.2.0] — 09.10.2026

Porównywarka paneli PV: zakładka „Obciążenia” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 32):
- obciążenie panelu śniegiem i wiatrem wg Eurokodu (PN-EN 1991-1-3, 1991-1-4, 1990) zestawione z nośnością mechaniczną z karty, osobno dla środka pola i krawędzi,
- nośności mechaniczne wpisane do katalogu paneli z kart, pola dla panelu ręcznego,
- ostrzeżenie, gdy obciążenie obliczeniowe przekracza nośność panelu; narzędzie AI rozszerzone.

Wpływ na liczby: nowa funkcja; żaden dotychczasowy wynik (energia, koszty, stringi, zwrot) się nie zmienia. Nowe liczby (obciążenia w Pa, wykorzystanie nośności) powstają tylko po wpisaniu warunków miejsca. Silnik porównywarki 1.1.0 → 1.2.0.

## [3.1.0] — 09.10.2026 (początek numeracji)

Porównywarka paneli PV, etapy A3b, A4 i dalsze (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcje 26–31):
- ręczne dane elektryczne panelu spoza katalogu,
- zakładka „Falownik i osprzęt”: dopasowanie do falownika, regulatora MPPT i mikroinwertera z katalogu, orientacyjny koszt osprzętu,
- wydruk oferty (PDF) z danymi firmy i logo, wersjami A/B/C i napisami „Wykonano w programie Inżynier Offgrid”,
- ślad wersji programu, silnika i danych na wydruku,
- włącznik „Wlicz urządzenie i osprzęt do ceny” w Opłacalności,
- tryb prosty dla początkujących (trzy pytania, jedna rekomendacja).

Wpływ na liczby: nowe funkcje; wyniki istniejącego porównania paneli bez zmian, a z włączonym wliczaniem osprzętu okres zwrotu i koszt zimowej kWh są liczone od ceny paneli plus urządzenie i osprzęt (zakres). Numer 3.1.0 jest punktem startowym: poprzednie wersje nie były numerowane.
