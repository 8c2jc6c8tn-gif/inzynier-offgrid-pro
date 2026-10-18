# Historia wersji programu Inżynier Offgrid

Zasady numeracji: `docs/wersjonowanie.md`. Najnowszy wpis na górze; jego numer musi zgadzać się z `package.json` (pilnuje tego test). Każdy wpis ma linię „Wpływ na liczby”.

## [3.34.0] — 18.10.2026

Status wyniku `ESTIMATE` (standard 3.3, audyt Y.11 poz. 9, D92):
- szósta wartość `Status` w `lib/core/calc-result.ts`, lista `STATUSY` w jednym miejscu; 278 schematów narzędzi AI buduje `z.enum(STATUSY)` zamiast własnej kopii listy,
- `isComputed` traktuje `ESTIMATE` jako policzoną liczbę, `poziomZStatusu` pokazuje go jako „uwaga”; powielone predykaty (6 miejsc) i trójki warunków (4 ekrany) zastąpione wspólnymi funkcjami,
- żaden kalkulator jeszcze nie zwraca `ESTIMATE` (pierwsze użycie: wiatr dla paneli pod kątem 30–90° — osobne zadanie).

Wpływ na liczby: brak (żaden wynik nie zmienia statusu ani wartości).

## [3.33.1] — 18.10.2026

Liczby i daty zgodne z językiem interfejsu (audyt Y.11 z 18.10.2026, poz. 8, standard 17.12):
- nowy pomocnik `lib/i18n/liczby.ts` (`formatujLiczbe`, `formatujDate`, mapa `LOCALE_INTL`) i hak `useFormatLiczby()`; 166 wywołań `toLocaleString("pl-PL", …)` w ekranach i komponentach oraz 3 daty przeszły przez niego, więc w EN liczby mają kropkę dziesiętną (1,234.5), a w RU przecinek i spację jako separator tysięcy,
- `formatujKwote` (waluta) korzysta z tej samej mapy ustawień regionalnych,
- generator słownika wzorów `scripts/generuj-formuly.mjs` (drzewo składni TypeScript): wiąże każdy `formulaKey` z literałem `formula` w module, wykrywa rozjazd, brakujący klucz i pojedynczy backslash (`"\\times"` daje TAB), a `pnpm formuly:napraw` poprawia słownik; sprawdzenie jest częścią `pnpm check:i18n-guard` i CI,
- test pilnuje, żeby w `lib/`, `app/` i `components/` nie wróciło `toLocaleString("pl-PL")` (wyjątek: tekst listy kontrolnej momentu dokręcania, który jest po polsku w całości).

Wpływ na liczby: brak (wartości te same; zmienia się tylko zapis separatorów w EN i RU, po polsku wygląd bez zmian).

## [3.33.0] — 18.10.2026

Wiatr dla dachu czterospadowego i ściany, powiadomienia o przeglądach, kreska w ilustracjach, rekomendacje w raporcie kryzysowym, ikony ekranów (D91):
- Porównywarka (silnik 1.11.0), zakładka „Obciążenia”: pole „Rodzaj połaci albo ściany” ma dwie nowe wartości, dach czterospadowy (Tablica 7.5, spadek 5–75°) i ściana budynku (Tablica 7.1, nachylenie 85–90°); liczby sprawdzone ze skanem PDF; dla ściany najgorsza wartość ze wszystkich pól i stosunków h/d (aplikacja ich nie zna); górne oszacowanie jak dla pozostałych połaci,
- powiadomienia przeglądarki o przeglądach po terminie: pole na ekranie terminarza (zgoda przeglądarki pytana dopiero po kliknięciu), jedno powiadomienie dziennie przy otwarciu aplikacji; nic nie przychodzi, gdy aplikacja jest zamknięta (offline, bez harmonogramu w tle); dzwonek na pulpicie działa jak dotąd,
- „Raport kryzysowy”: pod pokryciem najgorszego miesiąca pokazuje, o ile procent więcej mocy PV by to wymagało (zwykła proporcja dwóch liczb ekranu współczynnika), a przy blackoucie, którego bateria nie wytrzymuje, ile kWh pojemności brakuje (z modelu ekranu „Blackout”); liczby paneli raport nie podaje, bo zależy od uzysku jednego panelu,
- reguła grubości kreski w ilustracjach (3,2 jednostki `viewBox 256` przy 80 px, bez napisów) jako zapadka w teście; rozmiary ilustracji kafli zmierzone w emulatorze przy gęstości 1×–3× (zawsze 112 albo 128 px),
- ikony „pogoda” (ekrany prognoz) i „bojler” (bojler CWU) przy tytułach tych ekranów, tylko przy wyborze „Ikony 3D”; ikony liniowe zamiast emoji w nagłówku pulpitu.

Wpływ na liczby: tak, dla paneli równoległych do dachu czterospadowego albo do ściany z wybranym rodzajem Porównywarka pokazuje ocenę wiatru (wcześniej tylko śnieg); raport kryzysowy dostaje dwie nowe linie (bez zmiany istniejących liczb); pozostałe liczby bez zmian.

## [3.32.0] — 18.10.2026

Wiatr dla paneli równoległych do połaci i minimum czytelności ilustracji (D90):
- Porównywarka paneli (silnik 1.10.0), zakładka „Obciążenia”: dla paneli równoległych do połaci nowe pole „Rodzaj połaci” (dach jednospadowy albo dwuspadowy); wiatr liczony z ciśnienia zewnętrznego połaci c_pe,1 z Tablic 7.3 i 7.4 PN-EN 1991-1-4, dla spadku 5–75°, jako górne oszacowanie (najgorsze pole i kierunek wiatru; norma nie podaje współczynników panelu ze szczeliną pod spodem); tablice przepisane i sprawdzone ze skanem; pole zapisuje się w udostępnianym stanie, narzędzie AI `porownaj_panele` przyjmuje `typDachu`; panele pochylone na konstrukcji bez zmian (Tablica 7.6, 0–30°),
- bilans zimy: ogrzewanie elektryczne doliczone w Porównywarce rozkłada się na godziny wg temperatury godzinowej (zimne noce dostają więcej), a nie w profilu dobowym reszty prądu (spec 60); założenie jawne w wyniku,
- przycisk napięcia układu z profilu obiektu na kolejnych czterech ekranach z listą napięć (ochrona przed rozładowaniem, gniazdo zapalniczki, urządzenie 12 V bezpośrednio, tryb uproszczony),
- narzędzia AI pobierające PVGIS przyjmują własne miesięczne nasłonecznienie i temperatury (`nadpisanieGhiKwhM2`, `nadpisanieTempSrednieC`), liczone tą samą funkcją co ekran,
- ikony liniowe zamiast emoji kafli i presetów w Ustawieniach, na stronach modułów i we wzorniku (komponent `ikona-modulu`, dwie nowe ikony: kolba i kamper; emoji zostają w rejestrze jako dane do tłumaczeń),
- dzwonek na pulpicie pokazuje liczbę przeglądów po terminie z terminarza użytkownika i prowadzi do terminarza (bez wysyłania powiadomień; liczba czytana przy otwarciu aplikacji),
- panele pochylone na konstrukcji pod kątem 30–90° dostają wiatr z WŁASNEGO oszacowania aplikacji (wartości z 30° Tablicy 7.6 zachowane dla większych kątów); żadna norma ani dokument tego nie opisuje, co ekran mówi wprost w ostrzeżeniu, a narzędzie AI zwraca `wspolczynnikiWiatru: wlasne-oszacowanie`; kąty powyżej 90° i ujemne nadal poza zakresem,
- minimum czytelności ilustracji kafla pulpitu to 80 px (token `--ikona-min`, test skali ikon).

Wpływ na liczby: tak. (1) Przy włączonym doliczaniu ogrzewania elektrycznego bilans godzinowy Porównywarki (brak, pokrycie, koszt braku, dobór paneli na zimę) zmienia się: ogrzewanie przesuwa się na zimne godziny, więc brak i koszt braku zwykle rosną; zużycie miesięczne i roczne bez zmian. (2) Dla paneli równoległych do połaci z wybranym rodzajem połaci oraz dla paneli na konstrukcji pod kątem 30–90° Porównywarka pokazuje teraz ocenę wiatru (wcześniej tylko śnieg; w drugim przypadku z oznaczeniem „własne oszacowanie”); bez wyboru rodzaju połaci wynik jak dotąd (tylko śnieg). Pozostałe liczby bez zmian.

## [3.31.0] — 18.10.2026

Klucze dostępu (passkey) jako dodatkowa metoda logowania (D89):
- na ekranie logowania nowy przycisk „Zaloguj się kluczem dostępu (twarz lub odcisk palca)”; pokazuje się tylko w przeglądarce obsługującej WebAuthn, a logowanie linkiem e-mail, Google i Apple działa jak dotąd,
- w Ustawieniach, w sekcji „Konto”, nowa podsekcja „Klucze dostępu”: lista kluczy konta (data dodania i ostatniego użycia), dodanie klucza na tym urządzeniu i usunięcie klucza; klucz zakłada się po zalogowaniu inną metodą,
- weryfikacją i przechowywaniem kluczy publicznych zajmuje się Supabase Auth (funkcja oznaczona przez dostawcę jako eksperymentalna); aplikacja woła ją tylko z serwera, więc sesja nadal siedzi wyłącznie w ciasteczku `HttpOnly`, bez klienta Supabase w przeglądarce,
- tłumaczenia PL/EN/RU, testy akcji serwerowych i warstwy przeglądarkowej,
- do uruchomienia potrzebne są kroki po stronie właściciela (włączenie kluczy dostępu w projekcie Supabase, domena aplikacji); do tego czasu przycisk po kliknięciu pokazuje komunikat, a reszta logowania działa bez zmian.

Wpływ na liczby: brak — nowa metoda logowania, bez zmian w obliczeniach i w formacie zapisów użytkownika.

## [3.30.2] — 17.10.2026

Dokumentacja: ocena ustawień BMS i plan ekranu zestawów JK (bez zmian w kodzie aplikacji):
- nowy plik źródłowy `docs/zrodla/jk-bms-ustawienia-pozytywnie-nauczeni-2026-10-17.md` — 18 parametrów JK BMS autora „Pozytywnie nauczeni” (zrzut tabeli, z oznaczeniem pozycji do potwierdzenia w instrukcji JK),
- w `docs/lista-do-zrobienia.md`: ekran „Zestawy ustawień JK BMS od autorów” (decyzja właściciela), cztery braki wykryte przy ocenie (czas balansowania, histereza temperatury UTP/UTPR, rozróżnienie top balancingu od startu balansu, potwierdzenie parametrów JK) oraz dwa rozjazdy do decyzji właściciela (model napięcie odcięcia ↔ DoD ↔ cykle, ładowanie poniżej 0 °C).

Wpływ na liczby: brak — zmiana dokumentacji.

## [3.30.1] — 16.10.2026

Bob w komunikatach przy wyborze „Ikony 3D” (D87):
- gdy w Ustawieniach wybrano ikony 3D, maskotka znika też ze stanów interfejsu: panel werdyktu (zostaje znak ✓ / ▲ / ✕), pusty stan, strona 404; awatar asystenta AI (przycisk i nagłówek okna) pokazuje liniową ikonę „AI” zamiast Boba,
- wybór „Maskotka Bob” działa jak dotąd.

Wpływ na liczby: brak — zmiana wyglądu.

## [3.30.0] — 16.10.2026

Zestaw ikon 3D „zamiast Boba” (D87):
- 16 ikon 3D kafli (WebP 384 px, przezroczyste tło, razem około 0,65 MB) w `public/ikony-3d/`, mapa `IKONA_3D_PO_ID_KAFLA` obok `maskotki.ts`,
- w Ustawieniach, w sekcji wyglądu, wybór „Ilustracje modułów”: maskotka Bob (domyślnie) albo ikony 3D; dotyczy kafli pulpitu, górnej części stron modułów i Ustawień; zapis w tej przeglądarce (`ikonyKafli` w `offgrid.wyglad.v1`, stare zapisy czytają się jako Bob), tłumaczenia PL/EN/RU i pomoc „?”,
- Bob w komunikatach (werdykty, pusty ekran, 404, asystent AI) na razie zostaje także przy ikonach 3D.

Wpływ na liczby: brak — zmiana wyglądu.

## [3.29.0] — 16.10.2026

Prace bez telemetrii z listy „co zostało”:
- Porównywarka paneli (silnik 1.9.1): ostrzeżenia o pułapkach ofert — moc z karty a zima oraz cena za Wp a zimowa kWh (spec 55); w zakładce „Falownik i osprzęt” ładowanie akumulatora z wybranego regulatora dla każdego zestawu paneli, z opcjonalną pojemnością i limitem prądu akumulatora (spec 56),
- „Straty ciepła budynku”: biblioteka 20 materiałów i 3 szablony przegród szkieletowych z jawnym statusem λ (karta producenta, norma, orientacyjna; dane ze Szkieletowego, spec 57),
- nowy ekran „Bilans ciepła małego obiektu” (kamper, altana lub domek ROD, garaż): straty, moc grzania w mrozie, prąd na ogrzewanie w miesiącach użytkowania, zapas paliwa; w trybie mikroinstalacji Porównywarka dolicza to ogrzewanie do bilansu zimy (spec 58),
- tryb mikroinstalacji: przycisk napięcia układu na kolejnych 12 ekranach modułu 12; pozycje dodane z szablonu zestawu przypisują się do wybranego obiektu,
- własne średnie temperatury miesięczne zamiast PVGIS TMY (temperatury godzinowe miesiąca przesunięte tak, by średnia równała się wpisanej),
- ekran „Prognozy” liczy z punktów wpisanych przez użytkownika (kalkulator 1.2.0); dane demonstracyjne tylko na przycisk „Wstaw przykład”,
- nowe ekrany: „Tryb wyjazdu i tryb nocny” (zużycie ograniczone z listy odbiorników; M13 7.27 i 7.49 bez telemetrii) i „Terminarz przeglądów i serwisu” (własne interwały użytkownika; M13 7.32), z narzędziami AI,
- ikony interfejsu: liniowe SVG zamiast emoji w werdykcie (znak ✓ / ▲ / ✕ zamiast kolorowych kółek — poziom widać po kształcie, nie tylko po kolorze), przełączniku motywu, Ustawieniach, stanach i ostrzeżeniach na ekranach kalkulatorów,
- pomiar precache (D61): 793 wpisy, 54,1 MiB surowo, 18,8 MiB gzip, 15,3 MiB brotli (wpis w `docs/memory.md`).

Wpływ na liczby: wyniki istniejących ekranów nie zmieniają się dla tych samych danych, z czterema wyjątkami: (1) ekran „Prognozy” nie ma już domyślnych danych demonstracyjnych — liczy z wpisanych punktów; (2) przy wpisaniu własnych średnich temperatur miesięcznych zmieniają się wyniki wszystkich ekranów liczących z temperatury godzinowej (uzysk paneli, Porównywarka, M7) w tej lokalizacji; (3) Porównywarka w trybie mikroinstalacji z włączonym doliczaniem ogrzewania bierze je z nowego ekranu „Bilans ciepła małego obiektu”, nie ze „Strat ciepła budynku”; (4) wybór materiału lub szablonu w „Stratach ciepła budynku” wstawia λ z biblioteki (orientacyjne, do weryfikacji) — U z warstw zależy od tego, co wpisano.

## [3.28.2] — 16.10.2026

Ikony liniowe i napisy BOB na kaflach:
- komponent `Ikona` (`components/ui/ikona.tsx`) z 26 ikonami liniowymi na siatce 24 px, rysowanymi kolorem tekstu (`currentColor`), więc zmieniają kolor razem ze stylem aplikacji; nazwy ikon w stałych `IKONA`, żeby komponenty nie przekazywały gołych tekstów (strażnik i18n 17.1a),
- w interfejsie emoji zastąpiły ikony: 🔔 w nagłówku pulpitu, ✕ w oknie i na przycisku asystenta AI oraz przy punktach lokalizacji, ← na stronie 404 (reszta emoji w kolejnym pakiecie),
- kafle 1, 2, 4, 8, 12, 13, 14 i 15 mają nowe obrazy Boba z napisem BOB na kasku i plakietką na kamizelce (kafel 3 i baner modułu 7 zostają bez zmian: właściciel potwierdził, że zestaw jest zgodny).

Wpływ na liczby: brak — zmiana wyglądu.

## [3.28.1] — 16.10.2026

Skala rozmiarów ikon (D83, `docs/ikony-rozmiary.md`):
- ilustracje kafli pulpitu wypełniają szerokość kafla (układ C wybrany przez właściciela), do limitu 112 px na telefonie i 128 px od 640 px szerokości (wcześniej 44 px, przez co kreski i napisy były rozmyte); maskotki na kaflach używają tego samego rozmiaru,
- kafle pulpitu mają ikonę, nazwę i plakietkę PRO wycentrowane w poziomie, kafle w jednym rzędzie tę samą wysokość, a ikony leżą na jednej linii: pod ikoną jest stałe pole na dwie linie nazwy, w którym krótka nazwa centruje się w pionie (wcześniej wszystko było przy lewej krawędzi, a kafle z dłuższą nazwą były wyższe i przesuwały ikony),
- kafel Ustawienia (14) jest widoczny jako ostatni kafel siatki pulpitu, z klucza `UI-PUL-USTAWIENIA-KAFEL` (PL/EN/RU),
- kafel 7 (Stress-test zimowy) ma nową ilustrację z wyciętym tłem, a dotychczasowa scena z domem jest banerem strony modułu 7 (`modul-07-baner.webp`),
- maskotka Bob na kaflach 1 (Lokalizacja i teren), 2 (Zapotrzebowanie), 4 (Magazyn energii), 3 (nowy obraz z wyciętym tłem), 10 (AI i prognozy), 8 (Bezpieczeństwo), 12 (Szybki kalkulator) oraz 13 (Tryb Live), 15 (Dom – sieć) i 16 (Firma – sieć) na pulpicie i stronach modułów oraz na stronie Ustawień (kafel 14 nie ma miejsca w siatce pulpitu); dwa nowe pliki WebP w `public/maskotki-bob/`, wygenerowane z promptów D84,
- dokument z 19 promptami do ilustracji maskotki Bob (`docs/maskotka-bob-prompty.md`, D84), bez zmian w kodzie,
- układ pulpitu (D86): Ustawienia stoją zaraz po Trybie Live, a „Dom – sieć” i „Firma – sieć” są zwykłymi kaflami na samym końcu, oddzielone cienką czerwoną linią, która zwęża się i zanika 1 cm od krawędzi ekranu,
- Bob w stanach interfejsu (D88, seria C): awatar asystenta AI na przycisku i w nagłówku okna, miny werdyktu 🟢🟡🔴 obok etykiety w `WerdyktPanel`, Bob z kartonem w `StanPusty`, Bob z wtyczką na stronie 404 (wyśrodkowany w pionie i w poziomie, 224 px); wszystkie obrazy są tylko dekoracją (`alt=""`), a kolory i teksty werdyktu bez zmian,
- ikona aplikacji (PWA: `icon-192.png`, `icon-512.png`, `apple-icon.png`) to głowa Boba na tle koloru głównego, w manifeście także jako ikona maskable,
- rozmiar bierze się z tokenów `--ikona-*` w `app/globals.css`, a nie z liczby w komponencie; dodany test pilnujący skali.

Wpływ na liczby: brak — zmiana wyglądu pulpitu.

## [3.28.0] — 11.10.2026

Tryb mikroinstalacji O5: szablony zestawów jako punkt startu listy odbiorników (spec `docs/tryb-mikroinstalacji-specyfikacja.md`, sekcja 7):
- ekran „Zużycie energii per urządzenie”: wybór szablonu (kamper, jacht, domek, warsztat, kemping) i przycisk „Dodaj odbiorniki z szablonu”,
- dodawane są same nazwy typowych odbiorników; moc i czas pracy zostają puste i wpisujesz je sam (zasada: aplikacja nie zakłada mocy),
- powtórne kliknięcie nie dubluje pozycji, które już są na liście.

Wpływ na liczby: bez zmian — nowe puste pozycje nie wchodzą do sumy, dopóki nie wpiszesz mocy i czasu.

## [3.27.0] — 11.10.2026

Tryb mikroinstalacji: decyzje właściciela z 11.10.2026 (spec `docs/tryb-mikroinstalacji-specyfikacja.md`, sekcja 7):
- Ustawienia → „Rodzaj obiektu”: nowe pole „Napięcie układu (opcjonalnie)” — 12, 24 albo 48 V, wybierane raz dla mikroinstalacji; puste, dopóki go nie wybierzesz,
- ekrany „Akumulator kampera”, „Ładowanie akumulatora z regulatora” i „Dobór regulatora PWM/MPPT” pokazują obok swojego pola napięcia przycisk „Wpisz 24 V” z tą wartością (nie wpisują jej same i znikają, gdy pole już ją zawiera),
- „Zużycie energii per urządzenie”: wspólna lista odbiorników, ale każde urządzenie ma zaznaczenie „Dla jakich obiektów” (kamper, altana lub domek ROD, garaż); domyślnie dotyczy wszystkich; zużycie miesięczne mikroinstalacji w Porównywarce liczy tylko urządzenia wybrane dla rodzaju obiektu z Ustawień,
- garaż zostaje osobnym rodzajem obiektu (bez zmian).

Wpływ na liczby: bez zmian dla dotychczasowych list — urządzenia bez zaznaczonych obiektów liczą się w każdym obiekcie, jak dotąd; zmienia się tylko zużycie miesięczne mikroinstalacji, gdy zaznaczysz obiekty przy urządzeniach. Suma dobowa na ekranie zużycia nadal liczy wszystkie urządzenia.

## [3.26.0] — 11.10.2026

Porównywarka paneli, zakładka „Oferta (wydruk)”: suma „Razem brutto z montażem” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 54):
- decyzja właściciela (11.10.2026): ceny w Porównywarce są zawsze brutto (z VAT) — pole „Cena brutto za sztukę”, cennik osprzętu przeliczony o VAT 23 %, własne ceny osprzętu wpisywane brutto,
- gdy podasz cenę netto montażu i stawkę VAT, wydruk dolicza cenę brutto montażu do ceny paneli każdej wersji oferty (oraz do zakresu „panele, urządzenie i osprzęt”, jeśli wybrano urządzenie); bez stawki VAT sum nie liczy i mówi dlaczego,
- zmieniono opisy i pomoc „?” przy polach montażu (wcześniej mówiły, że kwota nie jest sumowana).

Wpływ na liczby: bez zmian w silnikach i wynikach porównania — dochodzi tylko suma na wydruku oferty (ceny brutto paneli i osprzętu + montaż brutto, do grosza).

## [3.25.0] — 11.10.2026

Porównywarka paneli, zakładka „Oferta (wydruk)”: numer oferty, warunki handlowe i montaż z VAT (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 53):
- nowe pola oferty: „Numer oferty” (drukowany u góry jako „Oferta nr …”) i „Warunki handlowe” (osobna sekcja z tekstu, który wpiszesz) — aplikacja niczego nie numeruje ani nie podpowiada,
- sekcja „Montaż i podłączenie”: wpisujesz cenę netto montażu i stawkę VAT, a wydruk pokazuje kwotę VAT i cenę brutto (do grosza); bez stawki pokazuje samą kwotę netto i mówi, że stawki nie podano; stawki aplikacja nie zakłada,
- kwota montażu nie jest dodawana do cen paneli i osprzętu z tabeli, bo program nie wie, czy te ceny wpisano netto czy brutto (wydruk to mówi),
- nowe pola nie są dołączane do porównania udostępnianego linkiem lub plikiem (to dane sprzedawcy).

Wpływ na liczby: bez zmian — dodatkowe sekcje wydruku, żaden wynik porównania się nie zmienia.

## [3.24.0] — 11.10.2026

Moduł 10, ekran „Prognoza stanu naładowania i oś czasu” (dawne 12.4 i 12.43; spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 52):
- nowy ekran: wpisujesz baterię z karty (pojemność, najniższy i najwyższy dopuszczalny stan naładowania, opcjonalnie sprawności i limity mocy), godzinę początku i długość prognozy (24, 48 albo 72 h) oraz profil doby — średnią produkcję paneli i zużycie w ośmiu oknach 3-godzinnych; ekran liczy stan naładowania co godzinę,
- pokazuje, kiedy bateria osiągnie najniższy dopuszczalny stan („jeśli nic nie zmienisz”), ile energii zabraknie odbiornikom i ile produkcji się nie zmieści w baterii — czyli kiedy włączyć bojler czy pralkę,
- oś czasu dzieli prognozę na odcinki (bateria się ładuje, jest nadwyżka, bateria zasila odbiorniki, brakuje energii) i pokazuje szczyty produkcji i zużycia na wykresie,
- dla prognozy dłuższej niż doba możesz wpisać, jaki procent produkcji dadzą panele w kolejnych dobach (np. przy zachmurzeniu); wszystkie wartości profilu musisz wpisać sam (zera też) — aplikacja niczego nie zakłada; pogody i temperatury baterii ekran nie zna (zimny akumulator ujmiesz obniżonym limitem mocy ładowania); wody, temperatury i harmonogramów urządzeń z pełnej osi czasu źródła jeszcze nie ma,
- pomoc „?” przy polach, tłumaczenia PL/EN/RU i narzędzie AI `policz_prognoze_soc`.

Wpływ na liczby: bez zmian — nowy ekran, żaden istniejący wynik się nie zmienia.

## [3.23.0] — 11.10.2026

Moduł 10, ekran „Prognoza produkcji miesięcznej” (dawne 12.3; spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 51):
- nowy ekran: wpisujesz produkcję paneli z każdego miesiąca ostatnich 12 miesięcy (z falownika, regulatora albo rachunku) i roczną degradację paneli z karty, a ekran prognozuje produkcję na 1–12 miesięcy naprzód — wykres słupkowy, tabela i zmiana względem tych samych miesięcy rok wcześniej,
- opcjonalnie wpisujesz wahania pogody między latami, a ekran pokazuje zakres dolny i górny (to Twoje założenie, nie przedział ufności ze statystyki),
- miesiąc bez wpisanej produkcji nie dostaje prognozy (brak danych, nie zero); brak degradacji jest liczony jako 0 %, o czym ekran ostrzega,
- ekran nie przewiduje pogody, rozrostu zacienienia ani zabrudzenia paneli; ma pomoc „?” przy polach, tłumaczenia PL/EN/RU i narzędzie AI `policz_prognoze_miesieczna`.

Wpływ na liczby: bez zmian — nowy ekran, żaden istniejący wynik się nie zmienia.

## [3.22.0] — 11.10.2026

Szybki kalkulator (Moduł 12), ekran 8.58 „Planowanie rozbudowy”: nowy ekran „Miejsce na rozbudowę — ile się zmieści” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 50):
- wpisujesz wymiary wolnego miejsca (kamper, altana, skrzynia, półka) i jednego panelu albo akumulatora; ekran liczy, ile sztuk fizycznie się zmieści w prostokątnej siatce, i sam wybiera ustawienie elementu (wzdłuż albo obrócone o 90°), które mieści więcej,
- odstępy między elementami i od ścian wpisujesz sam (z karty urządzenia albo własna decyzja) — aplikacja nie zakłada żadnej wartości; puste pole to 0 mm, o czym ekran ostrzega,
- opcjonalnie: piętrowanie (po wpisaniu wysokości miejsca i elementu) oraz plan „ile chcę dołożyć” — ekran mówi, czy się zmieści i ile sztuk brakuje miejsca,
- to wyłącznie geometria: ekran nie ocenia wentylacji, dostępu serwisowego, masy ani kabli; ma pomoc „?” przy polach, tłumaczenia PL/EN/RU i narzędzie AI `policz_miejsce_na_rozbudowe`.

Wpływ na liczby: bez zmian — nowy ekran, żaden istniejący wynik się nie zmienia.

## [3.21.0] — 11.10.2026

Dane nasłonecznienia (INFRA-2): własne miesięczne sumy promieniowania zamiast wartości PVGIS (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 49):
- w sekcji „Dane nasłonecznienia” (na wszystkich ekranach liczących nasłonecznienie: Kąt i azymut, Liczba paneli, Złoty środek, Odstęp rzędów, Porównywarka paneli, Symulacja mrozu i inne) jest rozwijane „Własne miesięczne sumy promieniowania (opcjonalnie)”: dla każdego miesiąca można wpisać sumę promieniowania całkowitego na płaszczyznę poziomą [kWh/m²], pod polem widać wartość PVGIS i współczynnik skali,
- godzinowe dane PVGIS wpisanego miesiąca są mnożone przez jeden współczynnik (wpisana ÷ PVGIS), więc kształt doby i udział promieniowania rozproszonego zostają; temperatury bez zmian; pusty miesiąc = dane PVGIS bez zmian; wartości niedodatnie są pomijane z komunikatem,
- wpisy zapisują się lokalnie (osobno od dużego zapisu PVGIS) i dotyczą lokalizacji, dla której je wpisano; „Wróć do danych PVGIS” je czyści.

Wpływ na liczby: bez zmian, dopóki użytkownik niczego nie wpisze. Po wpisaniu zmieniają się wyniki ekranów liczących nasłonecznienie w aplikacji (nie narzędzia AI, które pobiera dane PVGIS osobno).

## [3.20.0] — 11.10.2026

Tryb mikroinstalacji, etap O3: odbiorniki sezonowe na ekranie „Zużycie per urządzenie” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 48):
- każde urządzenie na liście ma „Miesiące pracy”: domyślnie pracuje we wszystkich miesiącach użytkowania obiektu (jak dotąd), a odznaczenie miesięcy pozwala ująć grzałkę do wody tylko latem albo ogrzewanie postojowe (np. Webasto) tylko zimą,
- zużycie miesięczne mikroinstalacji, z którego korzysta Porównywarka paneli, liczy w każdym miesiącu tylko urządzenia, które w nim pracują; ekran pokazuje też tabelę dobowego zużycia w poszczególnych miesiącach,
- moc i pobór wpisujesz z karty urządzenia (dla ogrzewania postojowego: pobór elektryczny pompki i wentylatora, nie moc cieplna) — aplikacja nie zakłada żadnej z tych wartości; ekran mówi to wprost,
- listy zapisane wcześniej działają bez zmian (brak miesięcy = wszystkie miesiące użytkowania).

Wpływ na liczby: dla list bez zaznaczonych miesięcy zużycie miesięczne jest identyczne jak w 3.19.0. Zmienia się tylko lista, w której użytkownik odznaczył miesiące pracy urządzenia. Silnik `zuzycie-per-urzadzenie` (suma dobowa) bez zmian.

## [3.19.0] — 11.10.2026

Tryb mikroinstalacji, etap O2: „Ładowanie akumulatora z regulatora” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 47):
- nowy ekran w szybkim kalkulatorze (Moduł 12): wpisujesz moc paneli, napięcie akumulatora i limity z kart (prąd regulatora, moc wejścia PV regulatora, prąd ładowania akumulatora), a ekran liczy, jaki prąd realnie popłynie do akumulatora i co go ogranicza — panele, regulator czy akumulator,
- model regulatora i falownika hybrydowego można wybrać z katalogu urządzeń PV: ekran wstawia jego limity z karty producenta (do poprawienia ręcznie); pole puste znaczy „limit nieznany” i nie jest liczone, a ekran mówi, których limitów brakuje,
- gdy możliwy prąd jest większy, niż akumulator przyjmie, ekran ostrzega, że limit prądu trzeba ustawić w regulatorze; nadmiar mocy paneli ponad wejście PV regulatora jest pokazany osobno,
- z pojemnością i zakresem stanu naładowania ekran podaje szybkość ładowania (C), energię i czas przy stałym prądzie; prąd jest górną granicą (moc w STC), a czas dolną (pod koniec ładowania prąd spada),
- narzędzie AI „policz ładowanie z regulatora”.

Wpływ na liczby: brak zmian w istniejących wynikach. Nowe liczby pojawiają się wyłącznie na nowym ekranie (silnik `ladowanie-z-regulatora` 1.0.0).

## [3.18.0] — 11.10.2026

Moduł 7, Ekran 3: „Raport kryzysowy” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 46):
- nowy ekran zbiorczy w Stress-teście zimowym, bez pól do wypełnienia: zestawia w jednym miejscu wyniki ekranów Symulacja mrozu, Deficyty miesięczne i agregat, Blackout oraz Współczynnik Bezpieczeństwa Zimowego,
- pokazuje Współczynnik Bezpieczeństwa Zimowego z najsłabszą składową, pokrycie zapotrzebowania w najgorszym miesiącu i brakujące kWh, dni z deficytem przy mrozie, godziny pracy agregatu, paliwo i koszt oraz to, czy magazyn wytrzyma dni bez słońca,
- część, której ekran nie jest jeszcze wypełniony, jest oznaczona jako brak (z linkiem do ekranu) — nigdy jako zero,
- „Drukuj lub zapisz jako PDF” przez okno drukowania przeglądarki.

Wpływ na liczby: brak. Raport nie liczy własnym modelem — przelicza zapisane szkice tymi samymi silnikami co ekrany źródłowe; wspólne mapowanie formularzy wyciągnięto z ekranów (Deficyty miesięczne, Współczynnik Bezpieczeństwa Zimowego, Symulacja mrozu) do wspólnych plików bez zmiany wyników.

## [3.17.0] — 11.10.2026

Moduł 7, Ekran 1: „Symulacja przy −20°C i −30°C” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 45):
- nowy ekran w Stress-teście zimowym: dzień po dniu przez cały miesiąc przy stałym mrozie (domyślnie −20 i −30 °C, do sześciu scenariuszy): produkcja paneli z danych pogodowych lokalizacji projektu, zużycie domu plus ogrzewanie budynku rosnące ze spadkiem temperatury, dodatkowe zużycie z mrozu i spadek pojemności baterii wpisany z karty ogniwa,
- wynik na scenariusz: ile dni z deficytem, najdłuższa seria, ile energii trzeba pokryć agregatem, jaka część zużycia jest pokryta bez agregatu i tabela dzień po dniu; ogrzewanie bierze dane budynku z ekranu „Straty ciepła budynku”, a bez nich ekran mówi, że deficyty są zaniżone,
- magazyn liczony tak jak w „Deficytach miesięcznych”; spadku pojemności ani COP w mrozie aplikacja nie zgaduje — wpisuje je użytkownik z karty,
- narzędzie AI „policz symulację mrozu”.

Wpływ na liczby: dotychczasowe wyniki bez zmian. Ekran „Straty ciepła budynku” liczy tak samo (silnik 1.2.0 → 1.3.0, tylko dwa nowe pola wyniku: współczynnik strat zewnętrznych i strumień stały). Nowe liczby pojawiają się wyłącznie na nowym ekranie (silnik symulacji 1.0.0).

## [3.16.0] — 11.10.2026

Zima z ociepleniem budynku: okna i drzwi, odzysk z wentylacji, źródło ciepła i spięcie z bilansem zimy na panelach (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 44):
- ekran „Straty ciepła budynku” ma osobne sekcje: „Okna i drzwi” (powierzchnia i U każdego otworu), „Wentylacja” (wymiany powietrza i nowe pole „odzysk ciepła z wentylacji”) oraz „Źródło ciepła” (prąd z COP albo paliwo z wartością opałową, sprawnością i zapasem),
- dla paliwa ekran liczy, na ile dni starczy zapasu przy mrozie obliczeniowym, a po wpisaniu temperatur miesięcy — zużycie roczne, jaką część ciepła pokrywa zapas i ile paliwa brakuje; wartości opałowej ani sprawności aplikacja nie zgaduje,
- w Porównywarce paneli nowe pole „Dolicz ogrzewanie elektryczne”: dodaje do miesięcznego zużycia prąd na ogrzewanie z tego ekranu (ciepło ÷ COP), tylko gdy komplet danych jest znany; ekran mówi, kiedy i dlaczego nic nie doliczył, i ostrzega przed podwójnym liczeniem, gdy rachunki już zawierają ogrzewanie elektryczne,
- narzędzie AI „policz straty ciepła budynku” przyjmuje odzysk z wentylacji i zapas paliwa.

Wpływ na liczby: dotychczasowe wejścia dają te same wyniki (bez wpisanego odzysku strata wentylacyjna jak dotąd). Nowe liczby powstają tylko po wpisaniu odzysku, paliwa albo włączeniu doliczania ogrzewania w Porównywarce. Silnik obciążenia cieplnego 1.1.0 → 1.2.0; silnik porównywarki bez zmian (1.9.0).

## [3.15.0] — 11.10.2026

Porównywarka paneli PV: udostępnianie porównania linkiem lub plikiem (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 43):
- w bloku „Moje zestawy” nowa sekcja „Udostępnij porównanie”: „Skopiuj link” (porównanie jest zapisane w samym adresie, bez konta i serwera) albo „Pobierz plik .json”; bez danych pogodowych, lokalizacji projektu, profilu firmy i danych klienta z oferty,
- odbiorca otwiera link, wkleja link lub kod albo wczytuje plik; widzi, co przyszło, i dopiero po kliknięciu „Dodaj do moich zestawów” dostaje to jako nowy zestaw — formularz, nad którym pracuje, zostaje bez zmian; kwoty są przeliczone na jego walutę,
- dane z zewnątrz są sprawdzane: limit rozmiaru (także po rozpakowaniu), przepisanie tylko znanych pól, kontrola wyliczeń i identyfikatorów katalogów, czytelny komunikat przy uszkodzonym lub obcym pliku.

Wpływ na liczby: brak. Silnik obliczeń bez zmian (1.9.0); zmiana dotyczy zapisu i wymiany danych wejściowych.

## [3.14.0] — 11.10.2026

Porównywarka paneli PV: własny katalog z pliku CSV i eksport wyników do CSV (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 42):
- w kroku „Panele” nowa sekcja „Własny katalog paneli z pliku CSV”: pobierasz wzorzec pliku, wypełniasz go (cennik dostawcy albo własna tabela z kart katalogowych) i wczytujesz; aplikacja pokazuje, które wiersze przyjęła, a które odrzuciła i dlaczego, a dopiero potem zapisujesz je w katalogu na tym urządzeniu (dołączasz albo zastępujesz katalog),
- wiersz jest przyjęty tylko wtedy, gdy przejdzie tę samą kontrolę danych co formularz panelu; puste komórki to brak danych, nic nie jest dopełniane „typową” wartością; separator (średnik, przecinek, tabulator) i przecinek dziesiętny są rozpoznawane automatycznie,
- przy każdym panelu porównania pojawia się wybór „Z Twojego katalogu (CSV)”, który wstawia nazwę, moc, cenę i pozostałe wpisane liczby (dane elektryczne jako wpisane ręcznie),
- w zakładce „Opłacalność” przycisk „Pobierz wyniki jako CSV”: jeden wiersz na panel, liczby bez formatowania, jednostka w nagłówku, kolumny z osprzętem przy włączonym przełączniku; formuły w nazwach są zabezpieczone przed wykonaniem w arkuszu.

Wpływ na liczby: brak. Silnik obliczeń bez zmian (1.9.0); zmiana dotyczy wprowadzania danych i zapisu wyników.

## [3.13.0] — 11.10.2026

Porównywarka paneli PV: osprzęt w scenariuszu „tańszy panel = więcej paneli” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 41):
- w zakładce „Więcej paneli?” pod dotychczasowym wynikiem (z samych cen paneli) pojawia się wariant „Z urządzeniem i osprzętem”: ceny obu zestawów razem z wybranym urządzeniem i osprzętem z zakładki „Falownik i osprzęt”, a liczba dodatkowych paneli jest wyszukiwana, nie dzielona, bo każda dokupiona sztuka zmienia układ stringów, liczbę urządzeń i ilości osprzętu,
- włącza go ten sam przełącznik „Wlicz urządzenie i osprzęt do ceny” z zakładki „Opłacalność”; ceny osprzętu są zakresem, więc liczba paneli jest podana dla obu końców zakresu, a energia dla ostrożniejszej liczby,
- bez wybranego urządzenia, bez najniższej temperatury albo gdy żaden układ nie mieści się w limitach urządzenia ekran mówi, czego brakuje; nic nie jest zgadywane.

Wpływ na liczby: brak dla dotychczasowych wejść i głównych wyników scenariusza (te nadal liczą się z samych cen paneli). Nowy wariant dokłada osobne liczby tylko wtedy, gdy włączono przełącznik i wybrano urządzenie. Silnik porównywarki 1.8.0 → 1.9.0.

## [3.12.0] — 11.10.2026

Porównywarka paneli PV: limity mocy baterii i falownika w bilansie godzinowym (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 40):
- w zakładce „Bilans godzinowy” trzy opcjonalne pola z kart katalogowych: maksymalna moc ładowania baterii, maksymalna moc rozładowania baterii i moc ciągła falownika [kW]; puste pole = bez ograniczenia tej mocy (bez wartości domyślnej),
- bilans nie zakłada już, że sprzęt przeniesie każdą moc: nadwyżka ponad moc ładowania jest odcinana, brakująca część ponad moc rozładowania i ponad moc falownika liczy się jako brak energii (sieć albo agregat); dotyczy też doboru liczby paneli na zimę,
- narzędzie AI porównania paneli przyjmuje limity; pola mają „?” i tłumaczenia PL/EN/RU; założenie wyniku mówi, które limity wpisano.

Wpływ na liczby: brak dla dotychczasowych wejść (bez wpisanych limitów bilans jest taki sam). Z limitami spada pokrycie zużycia i rośnie brak energii oraz odcięta nadwyżka, więc zmieniają się: pokrycie, cykle baterii, koszt braku i dobór paneli na zimę w zakładce „Bilans godzinowy”. Silnik porównywarki 1.7.0 → 1.8.0.

## [3.11.0] — 11.10.2026

Porównywarka paneli PV: profil dobowy zużycia w bilansie godzinowym (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 39):
- w zakładce „Bilans godzinowy” trzy opcjonalne pola: jaka część dobowego zużycia przypada na dzień (6–18), wieczór (18–22) i noc (22–6); bez nich zużycie jest rozłożone równo na dobę jak dotąd (bez wartości domyślnej),
- zużycie każdego miesiąca dzieli się na godziny doby według tego profilu, więc bilans pokazuje realniejszy brak energii wieczorem i w nocy (albo mniejszy, gdy prąd zużywasz głównie w dzień); dotyczy też doboru liczby paneli na zimę,
- narzędzie AI porównania paneli przyjmuje profil w trzech porach doby; pola mają „?” i tłumaczenia PL/EN/RU.

Wpływ na liczby: brak dla dotychczasowych wejść (bez wpisanego profilu bilans jest taki sam). Z profilem zmienia się rozkład zużycia w ciągu doby, więc zmieniają się: pokrycie, brak energii, cykle baterii, koszt braku i dobór paneli na zimę w zakładce „Bilans godzinowy”. Suma zużycia miesiąca zostaje. Silnik porównywarki 1.6.0 → 1.7.0.

## [3.10.0] — 11.10.2026

Porównywarka paneli PV: test „co, jeśli panel ma mniej mocy, niż deklaruje” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 38):
- w zakładce „Opłacalność” nowe pole: o ile procent mniej mocy może mieć panel niż na karcie lub naklejce (bez wartości domyślnej; puste = bez testu),
- po wpisaniu ekran pokazuje obok siebie liczby z karty i po zaniżeniu mocy: moc, energię zimą i w roku, cenę za Wp rzeczywistej mocy, koszt zimowej kWh i okres zwrotu, przy tej samej cenie panelu,
- narzędzie AI porównania paneli przyjmuje ten procent i zwraca scenariusz osobno dla każdego panelu; pole ma „?” i tłumaczenia PL/EN/RU.

Wpływ na liczby: brak dla dotychczasowych wejść (bez wpisanego procentu żaden wynik się nie zmienia, a z procentem główne wyniki też zostają). Nowe liczby powstają tylko w osobnym scenariuszu. Silnik porównywarki 1.5.0 → 1.6.0.

## [3.9.0] — 10.10.2026

Straty ciepła budynku (moduł 6, Ekran 1): U przegrody z warstw na ekranie i w narzędziu AI (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 37):
- przy każdej przegrodzie nowa sekcja „Policz U z warstw”: kierunek strumienia ciepła, warstwy (nazwa, grubość i λ albo gotowy opór R) i na żywo wyliczone U razem z oporem całkowitym; wpisane U ma pierwszeństwo i ekran o tym informuje,
- widoczna uwaga: bez mostków cieplnych (U ściany szkieletowej jest zbyt optymistyczne), dokładne liczenie jest w Inżynierze Szkieletowym Pro; λ wpisuje użytkownik z karty produktu, aplikacja jej nie zgaduje,
- ekrany zależne od Ekranu 1 (pojemność cieplna, optymalizacja izolacji) biorą U policzone z warstw,
- narzędzie AI „policz straty ciepła budynku” przyjmuje warstwy i kierunek zamiast U, a w wyniku zwraca U każdej przegrody,
- pola nowej sekcji mają „?” i tłumaczenia PL/EN/RU; stare szkice bez warstw działają jak dotąd.

Wpływ na liczby: brak dla dotychczasowych wejść (U wpisane ręcznie liczy się jak dotąd). Silnik obciążenia cieplnego bez zmian (1.1.0).

## [3.8.0] — 10.10.2026

Obciążenie cieplne budynku (moduł 6, Ekran 1): podstawa pod „Zimę z ociepleniem budynku” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 37):
- silnik umie policzyć U przegrody z warstw: U = 1 / (Rsi + Σ d/λ + Rse), gdzie Rsi = 0,10 / 0,13 / 0,17 m²·K/W zależnie od kierunku strumienia ciepła (dach / ściana / podłoga), Rse = 0,04 (PN-EN ISO 6946:2017, tablica 7); warstwa może mieć też gotowy opór R (np. szczelina z karty producenta),
- wpisane U przegrody nadal ma pierwszeństwo; niepełna warstwa albo brak kierunku strumienia daje „brak danych”, bez zgadywania; grubość, λ i opór ≤ 0 to błąd danych,
- widoczne założenie: mostki cieplne (słupki, belki, łączniki) nie są liczone, więc U ściany szkieletowej z tej funkcji jest optymistyczne; dokładne liczenie jest w Inżynierze Szkieletowym Pro.
Ekranu z warstwami jeszcze nie ma (kolejny etap); na razie to warstwa silnika z testami.

Wpływ na liczby: brak dla dotychczasowych wejść (przegroda z wpisanym U liczy się jak dotąd). Silnik obciążenia cieplnego 1.0.0 → 1.1.0.

## [3.7.0] — 10.10.2026

Porównywarka paneli PV: „Ile paneli pokryje zimę” bez sztywnego limitu 200 paneli (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 36):
- liczba paneli na cel zimowy jest liczona bez górnej granicy; gdy cel jest nieosiągalny nawet przy dowolnej liczbie paneli, ekran podaje fizyczne maksimum pokrycia z wpisaną baterią,
- gdy znamy wymiary miejsca, obok widać, ile paneli się mieści i jakie pokrycie zimy dają, oraz czy potrzebna liczba się mieści (miejsce nie obcina wyniku),
- poprawione sformułowanie założenia o nocy: brak pokrycia nocy dotyczy pojemności baterii 0, nie „braku baterii” jako zwykłego przypadku,
- narzędzie AI zwraca dodatkowo liczbę paneli mieszczących się w miejscu, pokrycie na miejscu i informację, czy potrzebna liczba się mieści.

Wpływ na liczby: tylko dobór liczby paneli na cel zimowy, i to wyłącznie tam, gdzie dotąd wychodziło „nieosiągalne do 200 paneli”: teraz podajemy rzeczywistą liczbę albo fizyczne maksimum (bywa wyższe niż dotychczasowe „pokrycie przy 200 panelach”). Pozostałe wyniki bez zmian. Silnik porównywarki 1.4.0 → 1.5.0.

## [3.6.0] — 10.10.2026

Porównywarka paneli PV: „Ile paneli pokryje zimę” w zakładce „Bilans godzinowy” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 36):
- opcjonalny cel: jaką część zużycia z listopada–lutego mają pokryć panele; ekran podaje, ile paneli to da „w sumie” (zbyt optymistycznie) i godzina po godzinie z baterią, albo że cel jest nieosiągalny (z informacją, ile najwyżej da się uzyskać przy 200 panelach),
- narzędzie AI rozszerzone o cel zimowy.

Wpływ na liczby: nowa funkcja, tylko gdy użytkownik wpisze cel; żaden dotychczasowy wynik się nie zmienia. Silnik porównywarki 1.3.0 → 1.4.0.

## [3.5.0] — 10.10.2026

Porównywarka paneli PV: zakładka „Producenci” (Etap C, spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcje 15 i 35):
- fakty o producentach paneli z katalogu (kraj, rok założenia, siedziba, giełda, obecność na listach niezależnych testów Kiwa PVEL i RETC, hurtownie w Polsce), każdy z odnośnikiem do źródła i datą odczytu, wpis czeka na akceptację właściciela aplikacji,
- jawne braki: czego nie sprawdzono (certyfikaty, serwis w Polsce, oficjalny dystrybutor) i co jest niespójne w źródłach.

Wpływ na liczby: brak. Opisy są tylko informacją, nie dodają punktów w gwiazdkach; silnik porównywarki (1.3.0) i wszystkie wyniki bez zmian.

## [3.4.0] — 09.10.2026

Porównywarka paneli PV: zakładka „Bilans godzinowy” (Etap A5, spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 34):
- godzina po godzinie roku typowego: ile energii z paneli zużyjesz od razu, ile przejdzie przez baterię, ile brakuje z sieci albo agregatu i ile nie mieści się w baterii, osobno zimą (XI–II) i w roku,
- pojemność baterii wpisana albo wzięta z ekranu „Dobór pojemności baterii”, opcjonalna sprawność cyklu, koszt brakującej energii wg wybranej wyceny kWh (także taryfy dzienno-nocnej wg godziny braku), cykle baterii, brak po miesiącach,
- narzędzie AI rozszerzone o bilans godzinowy.

Wpływ na liczby: nowa funkcja; żaden dotychczasowy wynik (energia, koszty, stringi, zwrot, nadwyżka) się nie zmienia. Nowe liczby powstają tylko po wpisaniu pojemności baterii i przy uzupełnionym zużyciu. Silnik porównywarki 1.2.0 → 1.3.0.

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
