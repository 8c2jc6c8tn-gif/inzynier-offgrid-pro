# Opis ekranów dla AI projektującego wygląd — Inżynier Offgrid Pro

**Stan na:** 30.09.2026 (220 ekranów w `app/kalkulatory/`). **Dla kogo:** AI (v0, Claude, inny
generator UI), które ma zaprojektować wygląd aplikacji i musi wiedzieć, **co faktycznie jest na
ekranach** — bez zgadywania i bez otwierania 220 plików.

**Jak czytać:** najpierw sekcje 1–7 (obraz całości i reguły), potem załącznik (katalog ekranów
moduł po module). Uzupełnia — nie zastępuje — `docs/brief-dla-v0.md` (stack, tokeny, edytor
kolorów) i `docs/standards/08-ui-ux.md` (reguły UX). Przy sprzeczności wygrywa standard 08; zgłoś ją,
nie rozstrzygaj sam.

Załącznik wygenerowano skryptem z kodu stron (etykiety pól, jednostki, duży wynik, elementy
graficzne), nie z pamięci. Po dodaniu ekranów liczby mogą się zestarzeć — źródło prawdy o liście
ekranów to `lib/pulpit/registry.ts`, o statusie — `docs/rejestr-pokrycia.md`.

---

## 1. Co to za aplikacja, w jednym akapicie

Inżynierski kalkulator i doradca do projektowania domu/firmy zasilanych z własnej instalacji
off-grid: panele PV, magazyn energii (baterie LiFePO4 i kwasowe), okablowanie i zabezpieczenia,
ogrzewanie z pompą ciepła, zima w najgorszym scenariuszu, bezpieczeństwo pożarowe, elektronika
ESP32, a także rachunek za prąd z sieci i droga „z sieci na off-grid”. Liczy **twarde fakty
fizyczne** (napięcia, prądy, energia, temperatury, siły wiatru) i na końcu mówi wprost: **wolno /
wolno z uwagą / nie wolno**. PWA, działa offline, PL/EN/RU.

**Użytkownicy:**
- inwestor/właściciel domu, który planuje własny system (często laik, chce jasnej odpowiedzi),
- instalator/elektryk w terenie — telefon w ręce, czasem w rękawicach, w słońcu albo w piwnicy,
- (plan) handlowiec/instalator pokazujący wynik klientowi — stąd potrzeba trybu „na sprzedaż”.

## 2. Liczby, które wyznaczają skalę projektu

| Co | Ile |
|---|---|
| Ekrany kalkulatorów | 220 (w 15 kaflach pulpitu; kilka ekranów M14 jest wspólnych dla „Dom” i „Firma”) |
| Pola do wpisania na ekranie | na ekranach z polami `Pole`: mediana **3**, średnio 3,6, maksimum 13 (`zloty-srodek`); ok. 60 ekranów nie ma pól `Pole` (checklisty, treść, karty wyboru albo własne formularze M14) |
| Najczęstsze jednostki pól | V (42 ekrany), A (34), % (33), W (31), °C (30), kWh (20), ° (17), szt. (17), m (17), kW (13), zł (9), Ah (9) |
| Szerokość treści | 190 ekranów `max-w-md` (wąska kolumna jak w telefonie), 30 ekranów `max-w-2xl` (mapy, wykresy, tabele, M14) |
| Ekrany z werdyktem 🟢🟡🔴 | 204 z 220 |
| Ekrany z jedną dużą liczbą wyniku | 139 |
| Checklisty | ok. 32 ekrany |
| Listy „dodaj pozycję” (urządzenia, punkty, połacie) | ok. 22 |
| Schematy SVG (połączenia ogniw, kąty, diody) | ok. 13 |
| Karty porównawcze (A vs B vs C) | ok. 10 |
| Mapa / wykres / tabela | po kilka ekranów (M1, M3, M14) |
| Widok 3D | 1 (`analiza-zacienienia`, mapa cieplna cienia na połaciach) |
| Kroki ze zdjęciem/nagraniem | ok. 7 (montaż baterii; zdjęcia jeszcze niedostarczone — dziś jawny placeholder) |

Wniosek dla projektanta: **typowy ekran jest mały** — 3 pola, jedna liczba, jeden werdykt i lista
uwag. Problem „nieprzejrzystości” nie wynika z nadmiaru pól, tylko z tego, że wszystko (założenia,
ostrzeżenia, wzór) ma tę samą wagę wizualną i stoi jeden pod drugim.

## 3. Anatomia jednego ekranu kalkulatora (od góry)

To jest szkielet, który powtarza się na prawie każdym z 220 ekranów. Projektuj **ten szkielet raz**
— zmiana komponentu rozchodzi się na wszystkie ekrany.

1. **Nawigacja** — `NawigacjaEkranu` (220/220): „← Wstecz” + okruszki „Pulpit / Moduł / Ekran”.
   Mały szary tekst.
2. **Nagłówek** — `NaglowekEkranu` (220/220): tytuł `h1` + przycisk **„i”** obok tytułu + 1–2
   zdania kontekstu („po co ten ekran, jaki moduł i ekran”). „i” otwiera **Migawkę** z zakładkami
   (m.in. „Fizyka”: wzór i założenia bieżącego wyniku). Na telefonie (<640 px) „i” i „?” otwierają
   się jako panel od dołu, na desktopie jako dymek.
3. **Pola wejściowe** — `Pole` / `PoleSelect` (182 ekrany): etykieta, pole liczbowe, **jednostka
   przy polu** (V, A, kWh…), przycisk **„?”** z wyjaśnieniem pola (obowiązkowy przy każdym polu).
   Wartości zapisują się same (autosave). Część pól ma wartość startową jako przykład — pola
   wpływające na bezpieczeństwo nie mają ukrytych wartości domyślnych.
4. **Panel werdyktu** — `WerdyktPanel` (204 ekrany): ramka w kolorze werdyktu, na górze ikona
   🟢/🟡/🔴 + etykieta (np. „Zalecane”, „Dopuszczalne, ale poniżej zalecanego minimum”,
   „Zabronione — ryzyko trwałego uszkodzenia falownika”, „Nie da się policzyć”). W środku:
   - **duża liczba** — `WynikGlowny` (139 ekranów), np. `I_zw = 4 800 A`, `14,2 kWh/dobę`,
     `V_string = 487 V`, `12 paneli · 5,4 kWp`, `7,5 h dnia / 16,5 h nocy`;
   - **szczegóły** — `WynikSzczegoly` (160 ekranów): lista założeń, lista ostrzeżeń, wzór drobną
     czcionką mono (np. `I_zw = U / R_wewn`).
5. **Opcjonalnie pod werdyktem:** schemat SVG, tabela, wykres, karty porównawcze, akordeon z treścią,
   checklista, lista dodanych pozycji.
6. **Globalnie na każdej stronie:** pływający **asystent AI** (`components/asystent-ai.tsx`, z
   `app/layout.tsx`) — czat, który może wywołać kalkulatory jako narzędzia.

**Stany brzegowe** (`components/ui/stany.tsx`, ok. 39 ekranów): `StanPusty` (brakuje danych —
neutralny, przerywana ramka), `StanBledu` (dane są, ale nie da się policzyć — 🔴), `StanLadowania`
(szkielet; dziś rzadko widoczny, bo liczenie jest natychmiastowe).

## 4. Co dokładnie niesie wynik (kontrakt danych — nie do zmiany)

Każdy kalkulator zwraca `CalcResult` (`lib/core/calc-result.ts`, standard 03):

| Pole | Co to jest | Jak dziś wygląda |
|---|---|---|
| `value` | liczba albo obiekt z kilkoma liczbami | duża liczba w panelu werdyktu |
| `unit` | jednostka | przy liczbie |
| `status` | `VALID` / `VALID_WITH_WARNINGS` / `INCOMPLETE` / `OUT_OF_SCOPE` / `INVALID_INPUT` | mapowany na 🟢 / 🟡 / 🔴 albo stan pusty |
| `warnings[]` | `{level: info / warning / critical, komunikat, pole?}` | lista punktów pod liczbą, ta sama waga dla wszystkich poziomów |
| `assumptions[]` | założenia przyjęte w obliczeniu (np. „sprawność 0,92, domyślnie”) | lista „Założenie: …” |
| `formula` | wzór tekstem | mała czcionka mono, przygaszona |
| `calculatorVersion` | wersja silnika | niewidoczna |

**Poziom `critical` = twardy stop** (zagrożenie życia/pożar/uszkodzenie sprzętu, rejestr:
`docs/rejestr-twardych-stopow.md`). Dziś wygląda tak samo jak zwykła uwaga — **to jest do
poprawienia w nowym designie**, a nie do schowania.

## 5. Rodzaje ekranów (wzorce A–H) — jak wyglądają i gdzie je zobaczyć

| Wzorzec | Co pokazuje | Żywy przykład | Szacunkowo ekranów |
|---|---|---|---|
| **D — Doradca** (najczęstszy) | 2–5 pól → liczba → werdykt 🟢🟡🔴 z uzasadnieniem → rekomendacja → migawka edukacyjna | `/kalkulatory/dobor-bezpiecznika-dc` | zdecydowana większość |
| **A — Przełącznik trybu** | przełącznik „liczę z X / liczę z Y”, pola zmieniają się z trybem | `/kalkulatory/konfigurator-stringow`, `/kalkulatory/pomocnicze` | kilka (policzone: 2 ekrany z polem „Tryb”, reszta z przełącznikiem innego typu) |
| **B — Karty porównawcze** | 2–4 karty obok siebie (technologia/wariant), plusy/minusy, badge werdyktu | `/kalkulatory/porownanie-technologii-magazynow`, `/kalkulatory/tracker-vs-staly` | ok. 10 |
| **C — Akordeon / treść** | rozwijane sekcje tekstu, bez liczenia albo z 1–2 polami | `/kalkulatory/czystosc-i-snieg`, `/kalkulatory/przechowywanie-recykling` | ok. 8 |
| **E — Checklista** | kroki do odhaczenia, często z wymuszoną kolejnością; werdykt „gotowe / nie gotowe” | `/kalkulatory/moment-dokrecania-srub`, `/kalkulatory/procedura-black-start` | ok. 30 |
| **F — Przewodnik z ilustracją** | schemat SVG albo kroki ze zdjęciem, mało pól | `/kalkulatory/trasy-kablowe`, `/kalkulatory/sekwencja-montazu` | kilkanaście |
| **G — Raport** | tylko odczyt, podsumowanie kilku wyników, koniec ścieżki | `/kalkulatory/audyt-pozarowy`, `/kalkulatory/scenariusze-dom` (M14) | kilka |
| **H — Katalog** | lista dodawanych elementów (czujniki, urządzenia) z sumą | `/kalkulatory/katalog-czujnikow`, `/kalkulatory/kategorie-specjalne` | ok. 20 |

Wzorzec D „zawsze wygrywa”, gdy decyzja ma konsekwencję bezpieczeństwa (standard 08.3). Stała
struktura D: **A) Twoje dane → B) ocena (werdykt + uzasadnienie fizyczne) → C) rekomendacja
(wyróżniona) → D) migawka edukacyjna.**

## 6. Ekrany nietypowe (wymagają osobnego projektu)

- **M1 Skaner działki** — mapa MapLibre (ortofotomapa online), punkty ze spaceru GPS, połacie,
  przeszkody. Szeroki układ.
- **M1 Analiza zacienienia** — widok 3D (three.js) z mapą cieplną cienia, wykres miesięcy,
  profil horyzontu. Najcięższy wizualnie ekran.
- **M1 Orientacja powierzchni** — ranking połaci i ścian po uzysku, dane PVGIS.
- **M3 Kąt i azymut / Wschód–zachód / Złoty środek** — suwaki, schemat kąta SVG, tabela i wykres
  uzysku miesięcznego.
- **M11 Montaż baterii** — długie sekwencje kroków (do 15 połączeń dla 16S) z miejscem na zdjęcie
  i nagranie, schematy łączenia ogniw.
- **M14 Dom/Firma – sieć** (15 + 15 kafli) — formularz rachunku z faktury, porównywarka taryf
  (tabela), porównanie scenariuszy A–D (TCO, **nigdy jeden „najlepszy”**), dotacje z datami, FAQ,
  6-krokowy kreator „Ścieżka przejścia”.
- **M13 Tryb Live** — dziś jeden ekran informujący, że telemetria nie jest podłączona; docelowo
  27 widżetów (moc na żywo, alarmy, SoC). Zaprojektuj jako przyszły dashboard, nie teraz.
- **Pulpit** (`app/page.tsx`) — siatka kafli modułów z animowanymi ikonami (SVG) i maskotkami;
  **Moduł** (`app/moduly/[id]`) — lista ekranów modułu; **Ustawienia** — kafle, język, motyw,
  edytor kolorów i czcionki; **`/wzornik`** — żywa strona z wszystkimi komponentami.

## 7. Reguły, których żaden nowy wygląd nie może złamać

1. **Kolory werdyktu są święte.** 🟢/🟡/🔴 zawsze z ikoną lub kształtem, nie samym kolorem.
   Żaden motyw (także „luksusowy”) nie może przefarbować 🔴 na złoty, szary ani „elegancki” odcień
   słabo odróżnialny od 🟡.
2. **Ostrzeżenie `critical` nigdy nie jest schowane** w zwiniętej sekcji, w „i” ani pod „pokaż
   więcej”. Założenia i wzór wolno zwinąć, twardego stopu — nie.
3. **Werdykt zawsze razem z liczbą** — aplikacja jest doradcą, nie encyklopedią (08.1).
4. **Tylko tokeny CSS** (`app/globals.css`), zero kolorów wpisanych w komponent — inaczej edytor
   kolorów w Ustawieniach przestaje działać na tym fragmencie.
5. **Mobile-first:** cel dotyku ≥ 44 px, pole ≥ 16 px (bez auto-zoomu na iOS), kontrast WCAG AA,
   czytelność w słońcu, obsługa w rękawicach. Animacje wyłączane przez `prefers-reduced-motion`.
6. **Trzy języki.** Teksty EN/RU mają inną długość niż PL (rosyjskie etykiety bywają wyraźnie dłuższe) —
   układ nie może się rozjechać przy żadnym z trzech języków.
7. **Jasny i ciemny motyw** (plus „systemowy”) — każdy nowy element w obu.
8. **Liczby:** polski format (`4 800`, `14,2`), jednostka zawsze przy liczbie, cyfry o stałej
   szerokości w wynikach (żeby nie „skakały” przy wpisywaniu).
9. **Nie zmieniasz logiki ani treści** — `lib/core/` i teksty merytoryczne są poza zakresem
   projektu wyglądu.

## 8. Co dziś nie działa wizualnie (punkt wyjścia dla nowego projektu)

Diagnoza właściciela projektu (30.09.2026): aplikacja jest funkcjonalna, ale nieprzejrzysta —
„wszystko prosto jest”. Konkretnie w kodzie:

- **Brak hierarchii w panelu werdyktu** — duża liczba, założenia, ostrzeżenia i wzór stoją jeden
  pod drugim w tej samej ramce; `critical` wygląda jak `info`.
- **Paleta prawie szara** (chroma 0), bez koloru marki — jedynym kolorem są werdykty.
- **Ikony to emoji** (📍⚡☀️🔋…) — różnie wyglądają na każdym systemie.
- **Wąska kolumna `max-w-md` także na desktopie** — na szerokim ekranie dużo pustego miejsca.
- **Pulpit** pokazuje od razu wszystkie kafle, bez podsumowania „mój system”.
- **Brak raportu dla klienta** (PDF z okładką) — dziś wynik żyje tylko na ekranie.

**Kierunek zaproponowany właścicielowi (do decyzji, nie przesądzony):** dwa tryby wyglądu w
Ustawieniach — **„Warsztat”** (obecny, gęsty, do pracy) i **„Premium”** (do sprzedaży: ciemny
grafit lub granat, oszczędny akcent w kolorze szampańskiego złota, szeryfowe nagłówki, liczba wyniku
jako bohater ekranu, szczegóły rozwijane, karta „Twój system” na pulpicie, raport PDF dla klienta).
Oba tryby korzystają z tych samych komponentów z sekcji 3 i tych samych tokenów — to zestaw wartości
tokenów plus kilka wariantów komponentów, nie 220 przepisanych ekranów.

---

## Załącznik — katalog ekranów moduł po module

Format wiersza: **Nazwa ekranu** — co użytkownik wpisuje (etykieta pola [jednostka]) — duży wynik
(„…” = liczba wyliczana na żywo) — etykiety werdyktu, jeśli ekran ma własne — elementy graficzne
poza standardowym szkieletem z sekcji 3. Etykiety w nawiasach kwadratowych bez jednostki (np.
`[UI-…]`) to klucze tłumaczeń. Brak „dużego wyniku” zwykle oznacza ekran z kilkoma wynikami w
tabeli/liście, checklistę albo treść.


### M1 — Lokalizacja i teren

_Fundament: klimat, nasłonecznienie, strefy. Zasila prawie wszystkie pozostałe moduły._ 

- **Lokalizacja i dane klimatyczne** — **wpisujesz:** Adres / działka (opcjonalnie); Szerokość geograficzna [°]; Długość geograficzna [°]; Temperatura minimalna w lokalizacji [°C]
- **Skaner działki** — **wpisujesz:** Następny punkt dodaj do; Identyfikator działki (TERYT); Nazwa połaci; Nazwa; Wysokość [m]; Promień [m]; Zbiór; Punkt A (nr); Punkt B (nr); Długość A–B [m] — **elementy:** lista dodawanych pozycji, mapa
- **Analiza zacienienia** — **wpisujesz:** Wysokość dachu [m]; Nachylenie paneli [°]; Azymut paneli [°]; Horyzont prognozy [lata] — **elementy:** checklista, lista dodawanych pozycji, widok 3D z mapą cieplną, wykres
- **Bryła budynku i orientacja ścian** — **wpisujesz:** Nachylenie [°]; Azymut [°]; Nazwa; Albedo gruntu (opcjonalnie) — **elementy:** lista dodawanych pozycji

### M2 — Zapotrzebowanie energetyczne

_Bilans obciążeń — ile energii realnie potrzebujesz._ 

- **Systemy podtrzymania życia** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Inteligentny bojler C.W.U.** — **wpisujesz:** Dobowe zapotrzebowanie na C.W.U. [l/dobę]; Wzrost temperatury wody (zimna → C.W.U.) [K]; Moc grzałki [kW]; Pojemność zbiornika bojlera [l] — **duży wynik:** … kWh/dobę
- **Liczba domowników** — **wpisujesz:** Liczba domowników [os.] — **duży wynik:** …–… l/dobę
- **Dni autonomii** — **wpisujesz:** Dni autonomii; Zapotrzebowanie dobowe [kWh]; Sprawność falownika [%]; DoD (głębokość rozładowania) [%] — **duży wynik:** … …
- **Profil dobowy + astronomiczny dzień/noc** — **wpisujesz:** Szerokość geograficzna [°]; Dzień roku [1-365]; Moc odbiornika działającego tylko w ciemności (opcjonalnie) [W] — **duży wynik:** … h dnia / … h nocy
- **Sezonowość i tryb wakacyjny** — **wpisujesz:** Zapotrzebowanie urządzenia (w okresie aktywności) [kWh/dobę]; Typ sezonowości; Miesiąc początku sezonu [1-12]; Miesiąc końca sezonu [1-12]; Sprawdzany miesiąc [1-12] — **duży wynik:** … kWh/dobę
- **Kalkulatory pomocnicze** — **wpisujesz:** Tryb; Moc urządzenia [W]; Napięcie systemu [V]; Pojemność [Ah]; Energia [Wh]; Sprawność układu (opcjonalnie, domyślnie 0,92) [0–1]
- **Agregat prądotwórczy — definicja i logika pracy** — **wpisujesz:** Deficyt energetyczny w najgorszym miesiącu [kWh]; Moc znamionowa agregatu [kW]; Średnie zużycie paliwa przy optymalnym obciążeniu [l/h]; Cena paliwa [zł/l] — **duży wynik:** … h
- **Pobór własny falownika** — **wpisujesz:** Pobór w stanie jałowym [W] — **duży wynik:** … kWh/dobę
- **Przetwornice DC/DC** — **wpisujesz:** Zapotrzebowanie mocy urządzenia [W]; Sprawność przetwornicy DC/DC [%] — **duży wynik:** … W
- **Moc pozorna (cos φ)** — **wpisujesz:** Moc czynna urządzenia [W]; Współczynnik mocy (cos φ) — **duży wynik:** … VA
- **Macierz priorytetów odłączania (Smart Load Shedding)** — **wpisujesz:** Priorytet odbiornika; Aktualny SoC baterii [%] — **duży wynik:** …
- **Bufor na rozbudowę** — **wpisujesz:** Całkowite zapotrzebowanie dobowe (bez bufora) [kWh]; Bufor na rozbudowę — **duży wynik:** … kWh/dobę
- **Urządzenia zmienne i klasa energetyczna** — **wpisujesz:** Moc palników — **duży wynik:** … kWh — **elementy:** checklista
- **Sprawność inwertera przy niskim obciążeniu** — **wpisujesz:** Bieżące zapotrzebowanie [W]; Znamionowa moc falownika [W]; Sprawność falownika przy tym obciążeniu [%] — **duży wynik:** … W
- **Architektura 1-fazowa / 3-fazowa** — **wpisujesz:** Obciążenie L1 [W]; Obciążenie L2 [W]; Obciążenie L3 [W]
- **Kategorie specjalne** — **wpisujesz:** Kategoria — **duży wynik:** … kWh — **elementy:** lista dodawanych pozycji
- **Wampiry energetyczne** — **wpisujesz:** Podzakładka

### M3 — Instalacja PV

_Panele, stringi, konfiguracja instalacji fotowoltaicznej._ 

- **Kąt pochylenia i azymut** — **wpisujesz:** Azymut paneli [°]; Moc instalacji [kWp]; Współczynnik wydajności PR — **duży wynik:** … kWh/rok albo … kWh/m² rocznie — **elementy:** schemat SVG, tabela, wykres, suwak
- **Typ montażu** — **wpisujesz:** Jak staną panele?
- **Orientacja wschód-zachód** — **wpisujesz:** Wschód — nachylenie [°]; Wschód — azymut [°]; Zachód — nachylenie [°]; Zachód — azymut [°]; Udział mocy paneli na połaci wschodniej [%] — **duży wynik:** …% energii południa — **elementy:** schemat SVG, tabela, wykres
- **Ile paneli potrzebujesz** — **wpisujesz:** Azymut paneli [°]; Kąt pochylenia [°]; Moc jednego panelu [Wp]; Powierzchnia jednego panelu [m²]; Współczynnik wydajności PR; Zużycie energii na dobę [kWh/dzień]; Dodatkowe zużycie w sezonie grzewczym [kWh/dzień]; Ile paneli realnie zamontujesz [szt.] — **duży wynik:** … paneli · … kWp — **etykiety werdyktu:** Cały rok — **elementy:** tabela
- **Złoty środek — kąt, wiatr i balast** — **wpisujesz:** Azymut paneli [°]; Strefa wiatrowa; Wysokość terenu n.p.m. [m]; Teren wokół (kategoria terenu); Wysokość górnej krawędzi stelaża [m]; Powierzchnia paneli na stelażu [m²]; Zabudowa pod stelażem φ; Masa paneli i stelaża (opcjonalnie) [kg]; Cena balastu [zł/kg]; Moc paneli na stelażu [kWp]; Współczynnik wydajności PR; Wartość 1 kWh [zł]; Okres analizy [lat] — **duży wynik:** …° — **elementy:** schemat SVG, tabela, wykres, suwak
- **Tracker czy stały stelaż** — **wpisujesz:** Liczba paneli na trackerze [szt.]; Koszt trackera (mechanizm + fundament) [zł]; Koszt jednego dodatkowego panelu na stałym stelażu [zł]; Roczny uzysk jednego panelu na stałym stelażu [kWh/rok] — **duży wynik:** Za cenę trackera: +… … — **elementy:** karty porównawcze
- **Konfigurator stringów** — **wpisujesz:** Tryb; Napięcie Vmp panelu [V]; Prąd Imp panelu [A]; Paneli w grupie (szereg) [szt.]; Liczba grup (równolegle) [szt.]; Liczba paneli [szt.] — **duży wynik:** … V  /  … A — **elementy:** lista dodawanych pozycji
- **Czystość i śnieg na panelach** — **wpisujesz:** Kąt pochylenia panelu [°]; Spadek produkcji względem oczekiwanej [%] — **elementy:** akordeon
- **Wpływ temperatury na wydajność** — **wpisujesz:** Temperatura otoczenia [°C]; Przyrost temperatury panelu ponad otoczenie [°C]; Współczynnik temperaturowy mocy γ [%/°C]; Moc nominalna panelu (STC, 25°C) [W] — **duży wynik:** … W
- **Straty na okablowaniu DC** — **wpisujesz:** Długość kabla panel→falownik (jedna strona) [m]; Prąd roboczy (Imp) [A]; Napięcie robocze (Vmp) [V]; Przekrój kabla [mm²] — **duży wynik:** …%
- **Zimowy stress-test napięciowy MPPT (Voc max)** — **wpisujesz:** Voc panelu (STC, 25°C) [V]; Współczynnik temperaturowy Voc (β) [%/°C]; Minimalna temperatura w lokalizacji (Tmin) [°C]; Liczba paneli w stringu [szt.]; Max napięcie wejściowe MPPT/falownika [V] — **duży wynik:** V_string = … V — **etykiety werdyktu:** Nie da się policzyć · Zabronione — ryzyko trwałego uszkodzenia falownika
- **Niedopasowanie mocy paneli (mismatch)** — **wpisujesz:** Moc panelu 1 [W]; Prąd roboczy panelu 1 (Imp) [A]; Moc panelu 2 [W]; Prąd roboczy panelu 2 (Imp) [A]; Wspólne napięcie robocze stringu (Vmp) [V] — **duży wynik:** … W
- **Aerodynamika — napór wiatru** — **wpisujesz:** Prędkość wiatru [m/s]; Powierzchnia panelu [m²]; Współczynnik oporu Cd [—]; Planowany balast (opcjonalnie) [kg]; Masa panelu i stelaża (opcjonalnie) [kg] — **duży wynik:** … N
- **Ochrona stringów (bezpieczniki, diody blokujące)** — **wpisujesz:** Prąd zwarciowy panelu w STC (Isc) [A]; Maks. prąd zabezpieczenia nadprądowego modułu (I_MOD_MAX_OCPR, karta katalogowa) [A]; Liczba stringów równoległych [szt.]; Prąd znamionowy wybranego bezpiecznika [A] — **duży wynik:** …–… A — **etykiety werdyktu:** Nie da się policzyć · Zabronione — norma HD 60364-7-712 nie jest spełniona · Zgodne z normą HD 60364-7-712
- **Dopasowanie tablicy PV do falownika** — **wpisujesz:** Voc panelu (STC) [V]; Vmp panelu (STC) [V]; Prąd roboczy panelu (Imp) [A]; Współczynnik temperaturowy Voc (β) [%/°C]; Minimalna temperatura w lokalizacji (Tmin) [°C]; Liczba paneli w stringu [szt.]; Maksymalne napięcie DC falownika [V]; Okno MPPT — dolna granica [V]; Okno MPPT — górna granica [V]; Maksymalny prąd MPPT [A]; Moc znamionowa AC falownika [W] — **duży wynik:** … DC/AC
- **Straty na złączkach MC4 w praktyce** — **wpisujesz:** Rezystancja jednej złączki [mΩ]; Liczba złączek [szt.]; Prąd [A] — **duży wynik:** … W
- **Panele bifacjalne** — **wpisujesz:** Roczny uzysk z przedniej strony (bez efektu bifacjalnego) [kWh]; Typ powierzchni pod spodem; Dodatkowy uzysk z tylnej strony [%] — **duży wynik:** … kWh
- **Ryzyko PID (degradacja indukowana napięciem)** — **wpisujesz:** Napięcie systemu DC względem ziemi [V]
- **Mikropęknięcia termiczne** — **wpisujesz:** Odstęp dylatacyjny między panelami [mm]
- **Wpływ diod bocznikujących** — **wpisujesz:** Liczba zacienionych sekcji — **duży wynik:** Strata mocy panelu: …% — **elementy:** schemat SVG
- **Powłoki antyrefleksyjne** — **wpisujesz:** Roczny uzysk instalacji (bez powłoki) [kWh/rok] — **duży wynik:** +…–… kWh/rok
- **Technologie paneli** — **wpisujesz:** Planowana moc instalacji [kWp] — **elementy:** karty porównawcze
- **Mikroinwertery vs inwerter centralny** — **wpisujesz:** Czy panele będą częściowo lub regularnie zacienione?; Czy masz falownik wyspowy obsługujący sprzężenie AC mikroinwerterów? — **elementy:** karty porównawcze
- **Warunki nadmorskie i pyliste** — **wpisujesz:** Typ lokalizacji

### M4 — Magazyn energii / baterie

_Dobór i bezpieczeństwo magazynu energii._ 

- **Dobór pojemności baterii** — **wpisujesz:** Zapotrzebowanie dobowe [kWh]; Dni autonomii [dni]; Sprawność falownika [%]; DoD (głębokość rozładowania) [%] — **duży wynik:** … kWh
- **Symulacja czasu ładowania/rozładowania** — **wpisujesz:** Pojemność użyteczna baterii [kWh]; SoC na początku dnia [%]; Średnia moc ładowania z PV [kW]; Długość okna ładowania (naświetlenia) [godz.]; Średnia moc rozładowania w nocy [kW]; Próg ostrzegawczy SoC [%] — **duży wynik:** …
- **Napięcie odcięcia vs żywotność** — **wpisujesz:** Napięcie odcięcia (ustawione na falowniku/BMS) [V]; Liczba ogniw połączonych szeregowo (S) — **duży wynik:** ~… cykli
- **Hierarchia ładowania (PV > Agregat > Sieć)** — **wpisujesz:** Aktualny SoC baterii [%]; Próg krytyczny SoC (od którego rozważany jest agregat) [%] — **duży wynik:** …
- **Symulacja miesiąca zachmurzenia (No-Sun Scenario)** — **wpisujesz:** Pojemność użyteczna baterii [kWh]; SoC na początku scenariusza [%]; Zapotrzebowanie dobowe [kWh/dzień]; Nominalna produkcja dobowa PV (dzień słoneczny) [kWh/dzień]; Poziom zachmurzenia (% produkcji nominalnej) [%]; Liczba dni scenariusza [dni] — **duży wynik:** wartość wyliczana (tekst zależny od wyniku)
- **Doradca doboru napięcia systemowego (12/24/48V)** — **wpisujesz:** Obciążenie szczytowe (opcjonalnie — nadpisuje sumę z kreatora niżej) [W]; Gdzie będzie używany ten system?; Co jest dla Ciebie ważniejsze?; Szczytowa moc ogrzewania elektrycznego [W]; Planowana moc ciągła falownika (opcjonalnie — do sprawdzenia konfliktu jednoczesności) [W]; Długość trasy (w jedną stronę) [m]; Temperatura otoczenia [°C]; Materiał; Sposób ułożenia; Liczba kabli w wiązce; Dopuszczalny spadek napięcia [%]; Docelowa pojemność energetyczna banku [kWh]; Liczba linii oświetlenia 24V (tylko jeśli budujesz system 48V) — **duży wynik:** … V — **elementy:** checklista, akordeon, tabela
- **Moduł EV — ładowanie samochodu elektrycznego** — **wpisujesz:** Dobowe zapotrzebowanie na ładowanie EV [kWh/dobę]; Nadwyżka produkcji PV latem [kWh/dobę]; Nadwyżka produkcji PV zimą [kWh/dobę] — **duży wynik:** …
- **Grzałki BMS i ochrona przed mrozem** — **wpisujesz:** Najniższa spodziewana temperatura przy baterii [°C]; Bieżący SoC baterii [%]; Czy w tej chwili jest produkcja PV — **etykiety werdyktu:** Nie da się ocenić — sprawdź wpisane dane · Grzanie wstrzymane — ładowanie zablokowane
- **Starzenie i degradacja ogniw** — **wpisujesz:** Pojemność użyteczna potrzebna dziś [kWh]; Horyzont projektowy; Roczny spadek pojemności [%] — **duży wynik:** … kWh
- **Obwód Pre-Charge** — **wpisujesz:** Pojemność wejściowa DC falownika [µF]; Rezystor wstępny (pre-charge) [Ω] — **duży wynik:** … s
- **Ograniczenie prądu ładowania w mrozie** — **wpisujesz:** Temperatura ogniwa [°C]; Pojemność pakietu [Ah] — **duży wynik:** … A
- **Cold Cranking Amps — zimny start dużych odbiorników** — **wpisujesz:** Napięcie pakietu bez obciążenia [V]; Prąd rozruchowy odbiornika [A]; Rezystancja wewnętrzna pakietu [mΩ]; Minimalne napięcie pracy falownika [V] — **duży wynik:** … V
- **Pobór własny BMS i tryb uśpienia** — **wpisujesz:** Pobór w trybie pracy ciągłej [W]; Pobór w trybie uśpienia (deep sleep) [W] — **duży wynik:** … kWh
- **Analiza opłacalności magazynu (True Cost of Storage)** — **wpisujesz:** Cena baterii [zł]; Pojemność użyteczna [kWh]; Liczba cykli życia przy wybranym DoD; Sprawność magazynu [%]; Koszt alternatywy (agregat/sieć) — opcjonalnie [zł/kWh] — **duży wynik:** … zł/kWh
- **Kalibracja i dokładność SoC** — **wpisujesz:** Dni od ostatniego pełnego naładowania [dni]
- **Tryb Long Term Storage (odstawienie na zimę)** — **wpisujesz:** Docelowy SoC przed odstawieniem [%]; Najniższa spodziewana temperatura przechowywania [°C] — **elementy:** checklista
- **Łączenie równoległe różnych baterii (Mixing)** — **wpisujesz:** Chemia ogniw; Napięcie nominalne [V]; Rezystancja wewnętrzna [mΩ] — **duży wynik:** … A — **etykiety werdyktu:** Nie da się ocenić — sprawdź wpisane dane · Zabronione
- **Szyny zbiorcze i połączenia międzypakietowe** — **wpisujesz:** Prąd całkowity rozpływający się między gałęziami [A]; Materiał przewodów; Długość odcinka do wspólnej szyny [m]; Przekrój przewodu [mm²] — **etykiety werdyktu:** Nie da się policzyć · Rozpływ prądu policzony — **elementy:** lista dodawanych pozycji
- **Porównanie technologii magazynów** — **wpisujesz:** Planowana pojemność magazynu (opcjonalnie) [kWh] — **elementy:** karty porównawcze
- **Dobór bezpiecznika DC** — **wpisujesz:** Napięcie baterii [V]; Rezystancja wewnętrzna pakietu [Ω]; AIC wybranego bezpiecznika [A] — **duży wynik:** I_zw = … A — **etykiety werdyktu:** Nie da się policzyć · Zabronione
- **Moment dokręcania śrub** — **wpisujesz:** Typ / pojemność ogniwa — **elementy:** checklista
- **Matryca alarmów BMS i reakcje systemu** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** tabela
- **Chłodzenie baterii latem** — **wpisujesz:** Temperatura ogniw [°C]
- **Topologia BMS (Common Port vs Separate Port)** — **wpisujesz:** Prąd znamionowy Common Port wybranego BMS [A]; Szczytowy prąd rozruchu falownika [A]
- **Komunikacja BMS — CAN/RS485/Modbus** — **wpisujesz:** Protokół BMS; Protokół falownika/ładowarki
- **Vehicle-to-Home (V2H)** — **wpisujesz:** Pojemność baterii trakcyjnej EV [kWh]; Rezerwa na dojazd [kWh]; Sprawność efektywna (degradacja + straty) [%]; Koszt wymiany baterii trakcyjnej [zł]; Liczba cykli życia baterii trakcyjnej [cykli] — **duży wynik:** … kWh
- **Ochrona przed wilgocią i kondensacją** — **wpisujesz:** Temperatura otoczenia [°C]; Wilgotność względna [%]; Temperatura obudowy / ogniw [°C]; Kod IP obudowy — **duży wynik:** Punkt rosy: …°C
- **Symulacja Słabego Ogniwa (Cell Drift & Balancing)** — **wpisujesz:** Pojemność znamionowa ogniwa [Ah]; Tolerancja fabryczna [%] — **duży wynik:** … Ah
- **Detekcja zwarcia i e-Fuse** — **wpisujesz:** Napięcie baterii [V]; Rezystancja wewnętrzna pakietu [Ω]; Zdolność łączeniowa tranzystorów BMS [A] — **duży wynik:** I_zw = … A
- **Algorytm końca ładowania (Tail Current / Absorption)** — **wpisujesz:** Pojemność baterii [Ah]; Napięcie absorpcji [V]; Próg prądu końcowego [C]; Aktualny prąd (live) [A]; Aktualne napięcie (live) [V] — **duży wynik:** Próg prądu końcowego: … A
- **Detekcja doziemienia (Ground Fault & IMD)** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Pozycjonowanie ogniw (kompresja/spuchnięcie)** — **wpisujesz:** Zastosowany docisk na pakiet [kgf]
- **SoH — diagnostyka per ogniwo** — **wpisujesz:** Rezystancja wewnętrzna fabryczna (nowe ogniwo) [mΩ]; Rezystancja wewnętrzna aktualna [mΩ] — **duży wynik:** +…% względem fabrycznej
- **Analiza Second-Life (baterie z EV)** — **wpisujesz:** Deklarowana pojemność [kWh]; Cena zakupu [zł]; Metoda szacunku SoH; Wiek baterii [lata]; Przebieg pojazdu [km]; Cena nowej baterii LiFePO4 — opcjonalnie [zł/kWh] — **duży wynik:** … zł/kWh

### M5 — Okablowanie i zabezpieczenia

_Przekroje, trasy, ochrona instalacji._ 

- **Dobór przekroju kabla** — **wpisujesz:** Prąd roboczy obwodu (I) [A]; Napięcie systemowe (U) [V]; Długość trasy (L, jedna strona) [m]; Materiał przewodnika; Sposób ułożenia; Liczba kabli w wiązce (jeśli dotyczy) [szt.]; Temperatura otoczenia [°C]; Dopuszczalny spadek napięcia [%]; Przekrój do sprawdzenia [mm²] — **duży wynik:** … mm² — **etykiety werdyktu:** Nie da się policzyć — sprawdź wpisane dane · Zabronione
- **Ochrona przeciwprzepięciowa (SPD)** — **wpisujesz:** Napięcie robocze stringu PV (Voc max, zimowe) [V]; Odległość paneli od zwodu piorunochronu [m]; Napięcie trwałej pracy (Uc) rozważanego SPD [V]; Otoczenie; Gęstość wyładowań Ng [1/(km²·rok)]; albo dni burzowe w roku Td [dni]; Odległość do pierwszego SPD w sieci (opcjonalnie) [km]; Kolejność odcinków od budynku — **duży wynik:** …, Uc ≥ … V / … — **etykiety werdyktu:** Nie da się policzyć · Zabronione — ochrona przeciwprzepięciowa niekompletna · SPD dobrany poprawnie
- **Szyny zbiorcze i połączenia** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Trasy kablowe — prowadzenie i separacja** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** schemat SVG, wykres
- **Łączenie Cu-Al i ochrona przed korozją** — **wpisujesz:** Materiał przewodu 1; Materiał przewodu 2; Środowisko; Przekrój Cu (opcjonalnie — przelicznik na Al) [mm²] — **etykiety werdyktu:** Nie da się policzyć · Zabronione — korozja galwaniczna · Połączenie bezpieczne
- **Dobór bezpieczników i rozłączników** — **wpisujesz:** Prąd znamionowy obwodu [A]; Prąd zwarciowy w tym punkcie [A]; Zdolność łączeniowa (AIC) wybranego bezpiecznika [A] — **duży wynik:** … A
- **Dobór mocy falownika** — **wpisujesz:** Moc szczytowa odbiorników [W]; Moc pozorna odbiorników (opcjonalnie) [VA]; Współczynnik jednoczesności; Moc rozważanego falownika (opcjonalnie, do sprawdzenia) [W] — **duży wynik:** Zalecana moc falownika: … W — **etykiety werdyktu:** Nie da się policzyć · Falownik za słaby — ryzyko wyłączeń przy rozruchach · Moc falownika dobrana poprawnie
- **String Box / Array Box** — **wpisujesz:** Liczba stringów; Liczba wejść DC skrzynki; Bezpiecznik stringowy [A]
- **Główna Szyna Wyrównawcza (GSW)** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Uziemienie funkcjonalne vs ochronne** — **wpisujesz:** Układ sieci (informacyjnie) — **etykiety werdyktu:** Wymaga korekty — sprawdź ostrzeżenia poniżej · Uziemienie zgodne z wymaganiami
- **Analiza zwarciowa** — **wpisujesz:** Napięcie baterii [V]; Rezystancja wewnętrzna pakietu [Ω]; Prąd zwarciowy panelu (Isc) [A]; Liczba stringów PV równoległych [szt.]; AIC sprawdzanego zabezpieczenia (opcjonalnie) [A] — **duży wynik:** I_zw maks. = … A — **etykiety werdyktu:** Nie da się policzyć · Zabronione — zdolność wyłączania za niska · Prąd zwarciowy policzony
- **Wyłączniki nadprądowe DC** — **wpisujesz:** Prąd obwodu [A]; Napięcie DC obwodu [V]; Liczba biegunów; Zdolność wyłączania (AIC) — opcjonalnie [A]; Prąd zwarciowy w tym punkcie — opcjonalnie [A] — **etykiety werdyktu:** Nie da się policzyć · Zabronione — wyłącznik nie spełnia wymagań · Wyłącznik dobrany poprawnie
- **Ochrona przed odwrotną polaryzacją** — **wpisujesz:** Miejsce obwodu; Zastosowana ochrona — **etykiety werdyktu:** Zabronione — brak ochrony przed odwrotną polaryzacją · Ochrona zastosowana
- **Wyłączniki RCD** — **wpisujesz:** Zainstalowany typ RCD; Cel ochrony tego obwodu; Prąd różnicowy zainstalowanego RCD [mA] — **duży wynik:** Wymagany próg: … mA — **etykiety werdyktu:** Nie da się policzyć · Zabronione — RCD nie spełnia wymagań · RCD dobrany poprawnie
- **Ochrona przed dotykiem** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Oznakowanie obwodów** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Dobór izolacji kabla do warunków montażu** — **wpisujesz:** Miejsce trasy (informacyjnie); Rozważana izolacja kabla; Maksymalna spodziewana temperatura [°C] — **duży wynik:** Izolacja wytrzymuje do …°C — **etykiety werdyktu:** Nie da się policzyć · Zabronione — izolacja nie wytrzyma tej temperatury · Izolacja wystarczająca
- **Separacja EMC** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** schemat SVG, wykres
- **Peszle, koryta, rurki** — **wpisujesz:** Miejsce montażu — **duży wynik:** …
- **Ochrona przed gryzoniami** — **wpisujesz:** Ryzyko gryzoni w okolicy — **duży wynik:** …
- **Optymalizacja trasy i kosztu kabla** — **wpisujesz:** Prąd obwodu (wspólny dla obu tras) [A]; Napięcie systemowe [V]; Materiał; Sposób ułożenia; Temperatura otoczenia [°C]; Liczba kabli w wiązce [szt.]; Dopuszczalny spadek napięcia [%]; Cena energii elektrycznej [zł/kWh]; Horyzont porównania [lat]; Długość trasy [m]; Przekrój rozważany [mm²]; Koszt zakupu (kabel + osłony + robocizna) [zł] — **duży wynik:** TCO A: … zł (… kWh/rok) · TCO B:… … zł (… kWh/rok) — **etykiety werdyktu:** Nie da się policzyć · Uwaga — jedna z tras nie spełnia wymagań przekroju · Porównanie gotowe
- **Puszki połączeniowe** — **wpisujesz:** Miejsce montażu — **duży wynik:** …
- **Pomiary i testy powykonawcze** — **wpisujesz:** Cel uziemienia; Rezystancja uziemienia [Ω]; Czas zadziałania RCD (wymagane < 0,4 s) [s] — **duży wynik:** … / … testów w normie — **etykiety werdyktu:** Nie da się policzyć · Brak formalnego odbioru — co najmniej jeden test poza progiem · Wszystkie testy w normie — formalny odbiór możliwy
- **Złącza MC4** — **wpisujesz:** Złączka żeńska — producent/rodzina; Złączka męska — producent/rodzina — **duży wynik:** … — **etykiety werdyktu:** Nie da się policzyć · Zabronione — ryzyko łukowania i pożaru
- **Przepust powietrza pod panelami** — **wpisujesz:** Planowana szczelina wentylacyjna pod panelami [cm] — **duży wynik:** ~…% straty mocy (orientacyjnie) — **etykiety werdyktu:** Nie da się policzyć · Za mała szczelina — realna strata mocy latem
- **Projekt uziemienia** — **wpisujesz:** Rezystywność gruntu [Ω·m]; Długość pojedynczego pręta uziomowego [m]; Średnica pręta uziomowego [mm]; Cel uziemienia — **duży wynik:** … … (R ≈… … Ω / pręt) — **etykiety werdyktu:** Nie da się policzyć · Zbyt trudny grunt dla prostego liczenia — potrzebny realny projekt · Uziom zaprojektowany
- **Selektywność zabezpieczeń** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Monitorowanie izolacji (IMD)** — **wpisujesz:** Próg alarmu IMD [kΩ] — **etykiety werdyktu:** Nie da się policzyć · Zabronione — układ IT bez zamontowanego IMD
- **Normy i certyfikaty** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista

### M6 — Ogrzewanie / pompa ciepła

_Termika budynku, pompa ciepła, wentylacja._ 

- **Straty ciepła budynku (przegrody, powietrze, miesiące)** — **wpisujesz:** Nazwa; Powierzchnia [m²]; Współczynnik U [W/(m²·K)]; Po drugiej stronie; Temperatura po drugiej stronie [°C]; Strefa klimatyczna; Temperatura w domu [°C]; Kubatura ogrzewana [m³]; Wymiany powietrza [1/h]; COP ogrzewania (opcjonalnie) — **duży wynik:** … kW — **elementy:** karty porównawcze, lista dodawanych pozycji
- **Zapotrzebowanie na C.O. i C.W.U. (ciepło na dobę w miesiącach)** — **wpisujesz:** Liczba osób; Ciepła woda na osobę [l/dobę]; Temperatura zimnej wody [°C]; Temperatura ciepłej wody [°C]; COP podgrzewania wody (opcjonalnie) — **duży wynik:** … kWh/dobę — **elementy:** karty porównawcze
- **Mostki termiczne (Ψ · długość, udział w stratach)** — **wpisujesz:** Nazwa; Długość [m]; Ψ [W/(m·K)]; Ψ po poprawie (opcjonalnie) [W/(m·K)]; Jak mierzone są powierzchnie na Ekranie 1 — **duży wynik:** … W — **elementy:** checklista, karty porównawcze, lista dodawanych pozycji
- **Pojemność cieplna budynku (bezwładność, czas do zamarznięcia)** — **wpisujesz:** Warstwa / materiał; Położenie; Temperatura w domu [°C]; Temperatura na zewnątrz [°C]; Nie niżej niż (opcjonalnie) [°C] — **duży wynik:** … kWh/K — **elementy:** karty porównawcze, lista dodawanych pozycji
- **Optymalizacja izolacji (materiał i grubość vs oszczędność w 10 lat)** — **wpisujesz:** Materiał; λ [W/(m·K)]; Grubość [cm]; Cena [zł/m²]; Przegroda z Ekranu 1; Powierzchnia przegrody [m²]; Obecne U [W/(m²·K)]; Cena ciepła (opcjonalnie) [zł/kWh] — **duży wynik:** … zł/kWh — **elementy:** karty porównawcze, lista dodawanych pozycji
- **COP pompy ciepła w funkcji temperatury** — **wpisujesz:** Zapotrzebowanie na moc cieplną [kW]; COP przy aktualnej temperaturze [-]
- **Pompy cyrkulacyjne — dobór** — **wpisujesz:** Moc obecnej pompy [W]; Moc rozważanej pompy elektronicznej (PWM) [W]; Godziny pracy na dobę [h] — **duży wynik:** … kWh
- **Bufor ciepła — dobór pojemności** — **wpisujesz:** Moc pompy ciepła [kW]; Posiadana/planowana pojemność bufora [l] — **duży wynik:** … l
- **Ryzyko wyłączenia pompy przy niskim napięciu** — **wpisujesz:** Minimalne napięcie pracy pompy [V]; Aktualne napięcie systemu off-grid [V] — **duży wynik:** … V
- **Kocioł elektryczny vs pompa ciepła** — **wpisujesz:** Zapotrzebowanie na ciepło do pokrycia [kWh]; COP pompy ciepła [-]; Cena energii elektrycznej [zł/kWh] — **duży wynik:** … zł
- **Porównanie kosztów ogrzewania (paliwa, prąd, nagrzewnica)** — **wpisujesz:** Rodzaj; Nazwa (opcjonalnie); Jednostka paliwa; Ciepło potrzebne w sezonie [kWh]; Okres analizy [lat] — **duży wynik:** … — **elementy:** karty porównawcze, lista dodawanych pozycji
- **Infiltracja powietrza (test szczelności)** — **wpisujesz:** Wymiany powietrza na godzinę [1/h]; Kubatura budynku [m³]; Różnica temperatur wewnątrz/na zewnątrz [K] — **duży wynik:** … kW
- **System wentylacji z odzyskiem ciepła** — **wpisujesz:** Wydajność centrali wentylacyjnej [m³/h]; Sprawność rekuperatora [%]; Różnica temperatur wewnątrz/na zewnątrz [K]; Stały pobór mocy wentylatorów [W] — **duży wynik:** … kW
- **Ryzyko zamarznięcia dolnego źródła** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Hałas i wibracje pompy ciepła** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)

### M7 — Stress-test zimowy

_Sprawdza cały system w najgorszych warunkach — spina moduły 1–6._ 

- **Procedura Black Start** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Wind Chill — temperatura odczuwalna** — **wpisujesz:** Temperatura powietrza [°C]; Prędkość wiatru [km/h] — **duży wynik:** … °C
- **Obciążenie dachu śniegiem** — **wpisujesz:** Strefa obciążenia śniegiem; Wysokość nad poziomem morza [m]; Kąt spadku dachu [°]; Otoczenie budynku; Nośność dachu na śnieg [kN/m²]; Grubość śniegu na dachu teraz (opcjonalnie) [cm]; Rodzaj śniegu — **duży wynik:** … kN/m²
- **Sztywnienie izolacji na mrozie** — **wpisujesz:** Najniższa temperatura w miejscu montażu [°C] — **duży wynik:** … °C
- **Elektronika w mrozie** — **wpisujesz:** Najniższa temperatura w miejscu montażu [°C] — **duży wynik:** … z … poniżej minimum — **elementy:** lista dodawanych pozycji
- **Pompy i zawory w mrozie** — **wpisujesz:** Najniższa temperatura w miejscu montażu [°C] — **duży wynik:** … z … poniżej minimum — **elementy:** lista dodawanych pozycji
- **Grzałki dachowe i rynnowe** — **wpisujesz:** Łączna długość kabla grzewczego [m]; Moc kabla na metr [W/m]; Czas pracy na dobę [h]; Moc elektryczna pompy ciepła (opcjonalnie) [W]; Wolny zapas mocy falownika (opcjonalnie) [W] — **duży wynik:** … W
- **Ryzyko zamarznięcia — grunt** — **wpisujesz:** Głębokość przemarzania gruntu [cm]; Jak rozmrozisz zamarzniętą rurę? — **duży wynik:** … z … w strefie przemarzania — **elementy:** lista dodawanych pozycji
- **Agregat w mrozie** — **wpisujesz:** Paliwo; Najniższa temperatura przy agregacie [°C]; Łączny czas pracy [h]; Maks. praca ciągła wg producenta [h]; Wymagana przerwa [h]; Zużycie paliwa [l/h]; Wymiana oleju co [h]; Dni postoju bez uruchamiania [dni] — **duży wynik:** … l paliwa
- **Blackout — dni bez słońca** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **duży wynik:** …
- **Strategia „Zamarzanie” — odłączanie odbiorników** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **duży wynik:** … h ogrzewania i pomp — **elementy:** lista dodawanych pozycji
- **Analiza SPOF — pojedyncze punkty awarii** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **duży wynik:** SPOF: … z … — **elementy:** checklista, lista dodawanych pozycji
- **Pre-Heat — ciepło na zapas przed mrozem** — **wpisujesz:** Skąd energia na przegrzanie? — **duży wynik:** +… h buforu cieplnego / … kWh ciepła w masie domu
- **Rekuperacja zamarzła — straty bez odzysku** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **duży wynik:** +… kW strat bez odzysku
- **Awaria stringa PV zimą** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **duży wynik:** wartość wyliczana (tekst zależny od wyniku)

### M8 — Bezpieczeństwo i sytuacje awaryjne

_Pożar, ewakuacja, systemy alarmowe._ 

- **Autonomiczny audyt bezpieczeństwa pożarowego** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **UPS krytyczny — dobór sprzętowy** — **wpisujesz:** Pojemność akumulatora UPS [Ah]; Napięcie systemu UPS [V] — **duży wynik:** … h — **elementy:** checklista
- **Awaryjne źródło ciepła (kominek, koza, piec)** — **wpisujesz:** Typ źródła; Moc cieplna (z karty) [kW]; Czas palenia w dobie [h]; Moc do wody (z karty) [kW]; Zapotrzebowanie na ciepło w mroźny dzień [kWh/dobę]; Sprawność urządzenia [%]; Wartość opałowa paliwa [kWh/kg] — **duży wynik:** …% zapotrzebowania / … kWh ciepła / dobę
- **Zamki drzwi ewakuacyjnych** — **wpisujesz:** Typ zamka; Co robi zamek przy zaniku prądu? — **duży wynik:** …
- **Moduł gaśniczy** — **wpisujesz:** Środek gaśniczy; Magazyn energii w strefie gaśniczej; Czujniki potwierdzające alarm [szt.]; Stan modułu — **duży wynik:** Braki: …
- **Centrala sygnalizacji pożaru — wejścia** — **wpisujesz:** Połączenie z centralą; Stan centrali — **duży wynik:** Braki: …
- **Oświetlenie awaryjne** — **wpisujesz:** Zasilanie lamp — **duży wynik:** … z … sprawnych — **elementy:** lista dodawanych pozycji
- **Klapy pożarowe i wentylacja** — **wpisujesz:** Wentylacja w budynku — **duży wynik:** Braki: …
- **Syrena, powiadomienia i służby** — **wpisujesz:** Kontakty alarmowe [szt.] — **duży wynik:** …

### M9 — Elektronika / ESP32 / sensoryka

_Czujniki, sterowanie, komunikacja._ 

- **Katalog czujników** — **wpisujesz:** Typ czujnika; Etykieta; Lokalizacja (opcjonalnie) — **elementy:** lista dodawanych pozycji
- **Zasilanie ESP32 z magistrali** — **wpisujesz:** Jak zasilasz ESP32? — **duży wynik:** … A z magistrali
- **Architektura komunikacji ESP32** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **duży wynik:** Problemy: … — **elementy:** checklista, lista dodawanych pozycji
- **Przydział pinów GPIO** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **duży wynik:** Konflikty: … · przypisania: … — **elementy:** lista dodawanych pozycji
- **Niezawodność sterownika ESP32** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **duży wynik:** Włączone: … z …

### M10 — AI i prognozy

_Prognozy produkcji/zużycia, rekomendacje._ 

- **Prognozy** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** tabela

### M11 — Montaż baterii

_Procedury montażu — LiFePO4 i kwasowo-ołowiowe._ 

- **Weryfikacja kompletności i kontrola wstępna ogniw** — **wpisujesz:** Napięcie systemu; Liczba ogniw w pakiecie — **elementy:** checklista
- **Montaż mechaniczny i separacja ogniw** — **wpisujesz:** Docisk ogniw pryzmatycznych [kgf] — **elementy:** checklista
- **Połączenia elektryczne i kolejność łączenia** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** schemat SVG, checklista
- **Sekwencja montażu (busbary + BMS, 4S/8S/16S)** — **wpisujesz:** Liczba ogniw w szeregu; Własna liczba ogniw [szt.] — **elementy:** kroki ze zdjęciem/nagraniem
- **Podłączenie BMS** — **wpisujesz:** Pojemność wejściowa DC falownika [µF]; Rezystor wstępny (pre-charge) [Ω] — **duży wynik:** … s — **elementy:** schemat SVG, checklista, wykres
- **Pierwsze uruchomienie i test balansowania** — **wpisujesz:** Pojemność pakietu [Ah]; Napięcie najwyżej naładowanego ogniwa [V] — **elementy:** checklista
- **Demontaż pakietu** — **wpisujesz:** Napięcie systemu; Zmierzone napięcie pakietu [V] — **elementy:** schemat SVG, checklista
- **Ratowanie głęboko rozładowanego ogniwa** — **wpisujesz:** Zmierzone napięcie ogniwa [V]
- **Ocena zużycia ogniwa po demontażu** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Przygotowanie stanowiska i narzędzi** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Przechowywanie / recykling / narzędzia diagnostyczne** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** akordeon
- **Weryfikacja + kontrola wstępna (kwasowo-ołowiowa)** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Montaż mechaniczny + mocowanie/wentylacja** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Połączenia + czyszczenie biegunów** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** schemat SVG, checklista
- **Balansery zewnętrzne** — **wpisujesz:** Liczba akumulatorów w szeregu [szt.] — **elementy:** schemat SVG
- **Dobór kabli, bezpieczników i zabezpieczeń** — **wpisujesz:** Prąd ładowania/rozładowania [A]; Napięcie systemu [V]; Długość trasy kabla [m]; Materiał; Sposób ułożenia; Temperatura otoczenia [°C]; Liczba kabli w wiązce [szt.]; Dopuszczalny spadek napięcia [%]; Prąd zwarciowy zestawu (opcjonalnie) [A]; Zdolność wyłączania (AIC) bezpiecznika (opcjonalnie) [A] — **duży wynik:** Przekrój: … mm² · Bezpiecznik: … A — **etykiety werdyktu:** Nie da się policzyć · Zabronione — sprawdź ostrzeżenia poniżej · Kabel i bezpiecznik dobrane poprawnie
- **Pierwsze uruchomienie i testy** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Demontaż — procedura, kolejność, zabezpieczenie** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** schemat SVG, checklista
- **Bezpieczeństwo pracy z kwasem** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Test pojemności i gęstości elektrolitu** — **wpisujesz:** Zmierzona gęstość elektrolitu [g/cm³]
- **Ocena zużycia — siarczanowanie** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Ratowanie zasiarczonego akumulatora** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Przechowywanie / recykling / narzędzia (kwasowo-ołowiowa)** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** akordeon

### M12 — Szybki kalkulator / tryb mobilny

_Proste przeliczniki bez pełnego procesu projektowego._ 

- **Tryb uproszczony — dobór akumulatora** — **wpisujesz:** Pojemność akumulatora [Ah]; Napięcie [V]; Moc odbiornika [W]
- **Dobór regulatora PWM vs MPPT** — **wpisujesz:** Moc paneli [W]; Napięcie paneli (klasa) [V]; Napięcie systemowe akumulatora [V] — **duży wynik:** …
- **Ile dni pracy bez słońca — mały zestaw** — **wpisujesz:** Pojemność akumulatora [Ah]; Napięcie akumulatora [V]; Dopuszczalne rozładowanie (DoD) [%]; Sprawność przetwornicy [%]; Zużycie na dobę [Wh] — **duży wynik:** … dni
- **Ochrona przed rozładowaniem (dozownik LVD)** — **wpisujesz:** Typ akumulatora; Napięcie znamionowe — **duży wynik:** …
- **Czy mogę podłączyć urządzenie 12 V bezpośrednio?** — **wpisujesz:** Napięcie instalacji (akumulatora); Napięcie urządzenia [V]; Tolerancja napięcia urządzenia [± %]; Maks. napięcie ładowania instalacji [V] — **duży wynik:** …–… V
- **Łączenie paneli ze stacją zasilania / powerbankiem** — **wpisujesz:** Voc panelu (STC) [V]; Współczynnik temperaturowy Voc (β) [%/°C]; Najniższa temperatura pracy [°C]; Paneli połączonych szeregowo; Max napięcie wejścia solarnego stacji [V]; Prąd zwarciowy panelu (Isc) [A]; Gałęzi równoległych; Max prąd wejścia solarnego stacji [A] — **duży wynik:** … V — **etykiety werdyktu:** Przekroczony limit wejścia stacji · Na granicy — sprawdź · Można podłączyć
- **Zużycie energii per urządzenie (z cyklem pracy sprężarki)** — **wpisujesz:** Moc [W]; Włączone [h/dobę]; Współczynnik pracy sprężarki [%] — **duży wynik:** … Wh — **elementy:** akordeon, lista dodawanych pozycji
- **Gniazdo zapalniczki — co można podłączyć** — **wpisujesz:** Napięcie instalacji pojazdu; Bezpiecznik gniazda [A] — **duży wynik:** … A — **elementy:** lista dodawanych pozycji
- **Ratowanie rozładowanego akumulatora — mała instalacja** — **wpisujesz:** Typ akumulatora; Napięcie spoczynkowe (opcjonalnie) [V]
- **Bezpieczeństwo akumulatora w kamperze (lista kontrolna)** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Bezpieczne ładowanie akumulatora w garażu (lista kontrolna)** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Kabel i bezpiecznik dla małej instalacji 12/24 V** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Kable i bezpieczniki w kamperze / pojeździe** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Zabezpieczenie akumulatora przed zimnem — mała instalacja** — **wpisujesz:** Temperatura ogniwa [°C]; Pojemność pakietu [Ah] — **duży wynik:** … A
- **Planowanie rozbudowy małej instalacji** — **wpisujesz:** Całkowite zapotrzebowanie dobowe (bez bufora) [kWh]; Bufor na rozbudowę — **duży wynik:** … kWh/dobę
- **Zabezpieczenia przeciwwilgociowe — mała instalacja (IP)** — **wpisujesz:** Gdzie stoi instalacja; Czy to miejsce jest narażone na wilgoć?; Stopień ochrony obudowy (IP) — **duży wynik:** …
- **Uziemienie małej instalacji (kamper, jacht)** — **wpisujesz:** Rodzaj instalacji; Gdzie jest instalacja — **duży wynik:** … — **elementy:** schemat SVG, wykres

### M13 — Tryb Live

_Monitoring bieżący — ma sens dopiero, gdy reszta jest zbudowana._ 

- **Wejście w tryb Live** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)

### M15 — Dom – sieć

_Rachunek za prąd, taryfa G, prosument — a potem opcja przejścia na off-grid._ 

- **Mój rachunek dziś** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Która taryfa G** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Net-metering, net-billing, depozyt** — **wpisujesz:** Miesiąc wprowadzenia energii; Energia oddana do sieci w tym miesiącu [kWh]; Cena rozliczenia; Średnia cena tej energii [zł/MWh]; Ile z tego depozytu wykorzystasz w 12 miesięcy (opcjonalnie) [zł]; Pełny koszt 1 kWh pobranej, brutto (opcjonalnie) [zł/kWh] — **duży wynik:** … — **elementy:** akordeon
- **Moje zużycie miesięcznie** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **duży wynik:** …
- **Test licznika i reklamacja** — **wpisujesz:** Liczba impulsów; Czas tych impulsów [s]; Stała licznika [imp/kWh]; Moc włączonego odbiornika (opcjonalnie) [W]; Imię i nazwisko albo nazwa firmy; Adres; NIP (tylko firma); Numer klienta; Numer PPE; Numer i data faktury; Opis problemu; Żądanie; Miejscowość i data — **duży wynik:** … kW — **elementy:** akordeon
- **Dotacje (stan na dzień)** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **FAQ — dom i sieć** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Ścieżka przejścia — kreator** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** kroki ze zdjęciem/nagraniem
- **Ile PV i magazynu** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Zima bez sieci** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **duży wynik:** …
- **Agregat jako zapas** — **wpisujesz:** Moc agregatu [kW]; Zużycie paliwa przy obciążeniu 80% [l/h]; Cena paliwa — **duży wynik:** …
- **Porównanie scenariuszy A–D** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Ryzyka odłączenia** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Jak zrezygnować z przyłącza** — **wpisujesz:** Stawka opłaty przyłączeniowej; Moc przyłączeniowa [kW]; Odległość od sieci — **duży wynik:** … — **elementy:** kroki ze zdjęciem/nagraniem
- **Przełącznik sieć/wyspa i bezpieczeństwo** — **wpisujesz:** Jak instalacja styka się z siecią; Przełącznik; Czy przełączany jest też przewód N?; Mikroinstalacja zgłoszona do OSD? — **elementy:** kroki ze zdjęciem/nagraniem

### M16 — Firma – sieć

_Rachunek w taryfach C, moc bierna, moc umowna, opłata mocowa — a potem opcja przejścia na off-grid._ 

- **Mój rachunek dziś (C)** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Porównywarka taryf C** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Moc bierna — opłata i kompensacja** — **wpisujesz:** Zmierzony tgφ (średni); tgφ₀ z umowy; Energia czynna pobrana [kWh/rok]; Cena C_rk [zł/kWh]; Energia bierna pojemnościowa (opcjonalnie) [kvarh/rok]; Średnia moc czynna w czasie pracy [kW]; Docelowy tgφ; Koszt baterii kondensatorów [zł] — **duży wynik:** wartość wyliczana (tekst zależny od wyniku)
- **Moc umowna — przekroczenia i optymalny poziom** — **wpisujesz:** Grupa taryfowa; Obecna moc umowna [kW]; Składnik stały stawki sieciowej (opcjonalnie, z faktury) [zł/kW/mies.]; Jak licznik mierzy przekroczenia — **duży wynik:** … netto / rok
- **Opłata mocowa — przesunięcie poboru** — **wpisujesz:** Energia pobrana w roku [kWh]; W tym w dni robocze 7:00–22:00 [kWh]; Ile z tego przesuniesz poza te godziny [%]; Stawka z faktury (opcjonalnie) [zł/kWh] — **duży wynik:** … netto / rok
- **PV w firmie i autokonsumpcja** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Magazyn (BESS) — strumienie korzyści** — **wpisujesz:** Energia przez magazyn; Zysk na 1 kWh; Różnica cen; Z tego oddane w dni robocze 7:00–22:00; Grupa taryfowa; Oszczędność na mocy umownej i przekroczeniach — **duży wynik:** wartość wyliczana (tekst zależny od wyniku) — **elementy:** tabela
- **Test licznika, reklamacja, badanie** — **wpisujesz:** Liczba impulsów; Czas tych impulsów [s]; Stała licznika [imp/kWh]; Moc włączonego odbiornika (opcjonalnie) [W]; Imię i nazwisko albo nazwa firmy; Adres; NIP (tylko firma); Numer klienta; Numer PPE; Numer i data faktury; Opis problemu; Żądanie; Miejscowość i data — **duży wynik:** … kW — **elementy:** akordeon
- **Dotacje i podatki — informacja** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **FAQ firm** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Ścieżka przejścia — kreator** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** kroki ze zdjęciem/nagraniem
- **Scenariusze A–D dla firmy** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz)
- **Ryzyka odłączenia firmy** — **wpisujesz:** brak pól `Pole` (wybór, checklista, treść albo własny formularz) — **elementy:** checklista
- **Procedura i umowy B2B** — **wpisujesz:** Stawka opłaty przyłączeniowej; Moc przyłączeniowa [kW]; Odległość od sieci — **duży wynik:** … — **elementy:** kroki ze zdjęciem/nagraniem
- **Przełącznik sieć/wyspa i bezpieczeństwo** — **wpisujesz:** Jak instalacja styka się z siecią; Przełącznik; Czy przełączany jest też przewód N?; Mikroinstalacja zgłoszona do OSD? — **elementy:** kroki ze zdjęciem/nagraniem
