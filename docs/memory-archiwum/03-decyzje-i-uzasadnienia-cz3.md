# Archiwum docs/memory.md — 03-decyzje-i-uzasadnienia-cz3

**Przeniesiono:** 02.10.2026 (archiwizacja wg zasady z `docs/memory.md`, sekcja „Archiwizacja”) | **Źródło:** `docs/memory.md`, sekcje z linii 2371–3283 stanu sprzed archiwizacji | **Liczba sekcji:** 25
Plik jest append-only: treść pod znacznikiem to dosłowna kopia 1:1 (nic nie skrócono ani nie poprawiono). Indeks wszystkich plików archiwum: `docs/memory-archiwum/INDEKS.md`. Aktualne pułapki i decyzje w skrócie: `docs/memory.md`.

<!-- ARCHIWUM-1:1 — poniżej treść przeniesiona bez zmian z docs/memory.md, nie edytować wstecz -->

## Decyzje i uzasadnienie (c.d. 71)

- **2026-09-04 — Ekran 6, Moduł 3: "Aerodynamika — napór wiatru i ssanie" (dawne 2.12,
  Wzorzec D) — kolejna znaleziona rozbieżność w przykładzie źródła, tym razem w formule
  fizycznej z realnym stałym współczynnikiem.** Wzór `F = 0,5×ρ×v²×A×Cd` 1:1 ze źródła, `ρ` jako
  gęstość powietrza (1,225 kg/m³) podana wprost jako stała fizyczna.
  - Przykład źródła Sekcji C ("przy 120 km/h na panel działa 350 N") sprawdzony niezależnie w
    Pythonie: dla Cd w podanym zakresie (1,2–1,5) wymagałoby to powierzchni panelu 0,34–0,43 m²
    — nierealistycznie małej (rzeczywiste panele PV to ~1,6–2,6 m²). To rozbieżność wewnętrzna
    źródła (ten sam rodzaj co M3/E17 mismatch, 1,4% vs 18%) — wzór wdrożony dokładnie jak
    podany, test używa self-konsystentnych wartości (2 m², Cd=1,3 → 1769 N), nie wymuszony do
    dopasowania nieodtwarzalnej liczby.
  - Zbudowana tylko siła naporu (parcie na przód panelu). Siła ssania od spodu ("efekt
    skrzydła"), moment wywracający i wymagany balast NIE zbudowane — wymagają geometrii montażu
    (dźwignia od ziemi do środka parcia, typ konstrukcji), której źródło nie podaje jako liczb.
  - `lib/core/modules/pv/napor-wiatru/`, 4 testy, UI: `app/kalkulatory/napor-wiatru/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 388/388 (4 nowe), `pnpm build` czysto,
    Playwright (33,33 m/s / 2 m² / Cd=1,3 → "1769 N", zgodne z wartością referencyjną).

## Decyzje i uzasadnienie (c.d. 72)

- **2026-09-04 — Ekran 22, Moduł 3: "Ochrona stringów (bezpieczniki, diody blokujące)"
  (dawne 2.38, Wzorzec D) — czysty, w pełni dany przykład bez rozbieżności, priorytet ze
  względu na wpisany wprost twardy stop.** Wzór `I_bezpiecznik = 1,25×Isc` — współczynnik 1,25
  podany wprost jako liczba (nie zakres), przykład źródła (Isc→15A) odtworzony dokładnie.
  - Twardy stop dany wprost: przy ≥3 stringach równoległych bez bezpieczników/diod blokujących
    źródło samo oznacza to 🔴 z konkretnym uzasadnieniem fizycznym (prąd wsteczny z pozostałych
    stringów przy zwarciu jednego). Próg (3) i mechanizm w pełni określone, żadnej wymyślonej
    wartości.
  - `lib/core/modules/pv/ochrona-stringow/`, 6 testów, UI: `app/kalkulatory/
    ochrona-stringow/page.tsx`. Dopisany do `docs/rejestr-twardych-stopow.md`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 394/394 (6 nowych), `pnpm build` czysto,
    Playwright (Isc=12A/3 stringi bez zabezpieczeń → "15,0 A", czerwony "Zabronione"; z
    zabezpieczeniem → zielony "Dobrany bezpiecznik" — oba stany zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 73)

- **2026-09-04 — Ekran 13, Moduł 3: "Symulacja zacienienia i wpływ na diody bocznikujące"**
  (scala dawne 2.23, 2.49, Wzorzec D) — **zbudowany świadomie tylko częściowo (poziom panelu),
  poziom stringu pozostawiony niepoliczony.**
  - Źródło podaje dwa poziomy: strata panelu (1 sekcja→33%, 2 sekcje→66%) i strata CAŁEGO
    STRINGU (przykład: 1 zacieniony panel w stringu 6 paneli → strata stringu 55%+, "zależnie
    od konfiguracji"). Tylko pierwszy poziom ma odtwarzalny wzór — drugi jest jawnie opisany
    przez źródło jako zależny od konfiguracji (topologia MPPT, liczba paneli, okablowanie), bez
    podanego wzoru.
  - Rozpoznanie: "1 sekcja→33%, 2 sekcje→66%" nie jest dowolną liczbą do zgadnięcia — to wynika
    wprost z konstrukcyjnego faktu, że standardowy panel PV (60/72-ogniwowy) ma 3 sekcje ogniw,
    każda z osobną diodą bocznikującą. Zacienienie sekcji uruchamia jej diodę, obniżając napięcie
    panelu o 1/3 przy zbliżonym prądzie → `strata_panelu = sekcje_zacienione/3`. Zweryfikowane
    niezależnie w Pythonie przed implementacją: 1/3=33,3%, 2/3=66,7% — zgodne z zaokrągleniem
    źródła do pełnych procent (33%/66%), nie rozbieżność formuły.
  - Poziom stringu (55%+) świadomie NIE dostał wymyślonego wzoru (np. proporcji liczby paneli) —
    byłoby to naruszenie Dyrektywy #1 (`02_Dyrektywy_AI_Projektu.md`, nigdy nie zgaduj brakującego
    współczynnika/normy). Zamiast tego: opisowa uwaga w `assumptions` wyniku, cytująca wprost
    przykład i zastrzeżenie źródła "zależy od konfiguracji". 🟡 rekomendacja mikroinwerterów przy
    regularnym/częściowym zacienieniu (cross-ref Ekran 18) wpisana do treści ostrzeżeń.
  - `lib/core/modules/pv/zacienienie-diody-bocznikujace/`, 7 testów, UI: `app/kalkulatory/
    zacienienie-diody-bocznikujace/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 401/401 (7 nowych), `pnpm build` czysto,
    Playwright (400W panel, 2 zacienione sekcje, string 6 paneli → "66,7%" straty, "133 W" moc
    rzeczywista, czerwony werdykt z pełnym uzasadnieniem tekstowym — zgodne z oczekiwaniem).

## Decyzje i uzasadnienie (c.d. 74)

- **2026-09-04 — Ekran 14, Moduł 3: "Dopasowanie tablicy PV do falownika"** (scala dawne 2.24,
  2.25, 2.26, 2.27, 2.37, 2.42, Wzorzec D) — **"mega-scalenie" 6 dawnych funkcji w jeden silnik,
  zbudowane świadomie tylko 4 z 6 kryteriów.**
  - Źródło samo mówi "ten ekran już zbudowany i zademonstrowany jako trzeci przykład w tej
    konwersacji" — to odniesienie do demonstracji z ORYGINALNEJ rozmowy specyfikującej projekt
    (przed powstaniem tego repo), nie dowód, że kod istnieje w tym repo. Sprawdzone: nie istnieje
    (`docs/rejestr-pokrycia.md` go nie wymieniał, brak plików `dopasowanie-tablicy-falownika`) —
    zbudowany od zera w tej sesji.
  - Cztery zbudowane kryteria, każde z jawnym wzorem/zakresem ze źródła: (1) napięcie zimowe
    stringu vs limit DC falownika — **wzorzec echo**: `obliczNapiecieStringuZimowego` wyekstrahowany
    z `stress-test-mppt/calculator.ts` (Ekran 5), zamiast duplikowania tego samego wzoru
    `V_max=Voc×(1+β×(Tmin−25))`; (2) napięcie robocze (STC, `Vmp×n`) vs okno MPPT falownika;
    (3) prąd roboczy (`Imp`) vs maks. prąd MPPT; (5+6) współczynnik przewymiarowania DC/AC
    (`P_PV/P_AC`, `P_PV` liczone jako `Vmp×Imp×n` — fizyka P=V×I, nie wpisywane osobno),
    zalecany zakres 1,1-1,3 dla off-gridu 1:1 ze źródła. Kryterium 6 ("ryzyko skrajności") to
    tylko interpretacja tej samej liczby z kryterium 5 (za mało = niewykorzystany potencjał, za
    dużo = przegrzewanie/obcinanie mocy) — scalone, nie osobny wzór.
  - **Kryterium 4 (napięcie startowe w upale) świadomie NIE zbudowane.** Źródłowy przykład
    ("Vmp 35V → w upał spada do 31V") to tylko ilustracja liczbowa, nie definiuje współczynnika
    temperaturowego Vmp — a to inny współczynnik niż β (który dotyczy Voc, użyty w kryterium 1).
    Sekcja A źródła też go nie wymienia jako osobnego pola wejściowego. Zgodnie z Dyrektywą #1
    (nigdy nie zgaduj brakującego współczynnika) — pominięte, udokumentowane w kodzie
    (`calculator.ts` docstring) i tutaj, nie przemilczane cicho.
  - Refaktor `stress-test-mppt/calculator.ts`: wewnętrzna logika `V_max`/`V_string` wyodrębniona
    do eksportowanej `obliczNapiecieStringuZimowego()`, oryginalne 6 testów Ekranu 5 nadal
    przechodzi bez zmian (potwierdza, że refaktor nie zmienił zachowania).
  - Zweryfikowane niezależnie w Pythonie/testach: dwa pełne scenariusze (8 paneli/wszystkie 4
    kryteria OK; 12 paneli z ciaśniejszymi limitami falownika → napięcie zimowe 🔴, MPPT-max i
    prąd i DC/AC osobno przetestowane w kolejnych scenariuszach) — 9 testów.
  - `lib/core/modules/pv/dopasowanie-tablicy-falownika/`, UI: `app/kalkulatory/
    dopasowanie-tablicy-falownika/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 410/410 (9 nowych), `pnpm build` czysto,
    Playwright (12 paneli, Voc=45V/β=-0,3%/Tmin=-25°C/limit falownika 500V → napięcie zimowe
    621V → czerwony "Konfiguracja niedopasowana"; pozostałe 3 kryteria zielone/info w tym samym
    scenariuszu — zgodne z testem jednostkowym).

## Decyzje i uzasadnienie (c.d. 75)

- **2026-09-04 — Ekran 26, Moduł 3: "Straty na złączkach MC4 w praktyce"** (dawne 2.46,
  Wzorzec C z elementami D) — czysta fizyka (prawo Joule'a, `P=n×I²×R`), rezystancja złączki
  jako pole ręcznego wpisu w zakresie źródła.
  - Źródło podaje zakres, nie pojedynczą liczbę: złączka w dobrym stanie 0,5-2 mΩ, luźna/
    zaśniedziała "nawet 10× więcej" — zgodnie z D16 rezystancja jest polem ręcznego wpisu, nie
    ukrytym domyślnym.
  - Przykład źródła (20 złączek, prąd 10A, dobry styk → strata 2W) odtworzony DOKŁADNIE przy
    R=1mΩ (środek zakresu 0,5-2 mΩ), zweryfikowane niezależnie w Pythonie przed implementacją.
  - Przykład "zły styk → nawet 25W" jest z natury przybliżony (źródło samo używa słowa "nawet"
    zarówno dla mnożnika 10× jak i dla wyniku) — przy R=20mΩ (10× górna granica dobrego stanu)
    wzór daje 40W, nie 25W dokładnie. Zgodnie z Dyrektywą #13 (nie naciągaj wzoru do przykładu)
    wzór wdrożony dokładnie jak podany, rozbieżność udokumentowana w kodzie, analogicznie do
    precedensów `napor-wiatru`/`niedopasowanie-paneli`.
  - Progi bucketowania ostrzeżeń (🟢 ≤2mΩ, 🟡 2-20mΩ, 🔴 >20mΩ) to granice zakresu źródła
    (górna granica "dobry stan" i jej 10-krotność), nie wymyślone liczby.
  - `lib/core/modules/pv/straty-zlaczki-mc4/`, 6 testów, UI: `app/kalkulatory/
    straty-zlaczki-mc4/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 416/416 (6 nowych), `pnpm build` czysto,
    Playwright (R=25mΩ, 20 złączek, 10A → "50,0 W" straty, czerwony werdykt z uzasadnieniem
    "realne ryzyko przegrzania/pożaru" — zgodne z testem jednostkowym).

## Decyzje i uzasadnienie (c.d. 76)

- **2026-09-04 — Ekran 16, Moduł 3: "Panele bifacjalne"** (dawne 2.31, Wzorzec D) — zbudowany
  świadomie BEZ współczynnika bifacjalności panelu, tylko na podstawie zakresów % per typ
  powierzchni.
  - Źródło podaje dwie różne liczby dla tego samego zjawiska: współczynnik bifacjalności panelu
    (70-90%, "z bazy komponentów") ORAZ bezpośredni zakres dodatkowego uzysku per typ powierzchni
    (biała membrana 10-20%, jasny beton 8-15%, piasek 10-18%, trawa 3-5%). Źródło NIE podaje
    wzoru łączącego te dwie liczby (np. czy zakres per powierzchnia zakłada już jakiś domyślny
    współczynnik bifacjalności, czy trzeba go dodatkowo mnożyć) — próba wymyślenia takiej formuły
    naruszałaby Dyrektywę #1. Decyzja: użyć TYLKO zakresu per powierzchnia (bezpośrednio
    reprezentuje końcowy efekt), pominąć współczynnik bifacjalności jako osobne pole.
  - Procent dodatkowego uzysku to pole ręcznego wpisu (D16), z podpowiedzią pokazującą zakres
    dla wybranej powierzchni. Przykład źródła ("jasny beton → 12%") odtworzony DOKŁADNIE — 12%
    mieści się w podanym zakresie 8-15% i jest wprost tą samą liczbą co w źródle, nie wymaga
    żadnej dodatkowej weryfikacji Pythonem (to czysta arytmetyka procentowa, nie nowy wzór
    fizyczny).
  - 🟡 ostrzeżenie o niskim zysku na trawie wpisane 1:1 z cytatu źródła ("nie przepłacaj za tę
    technologię, jeśli montujesz na trawie").
  - `lib/core/modules/pv/panele-bifacjalne/`, 5 testów, UI: `app/kalkulatory/
    panele-bifacjalne/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 421/421 (5 nowych), `pnpm build` czysto,
    Playwright (5000 kWh bazowe, jasny beton, 12% → "5600 kWh" całkowitego uzysku, zielony
    werdykt — zgodne z testem jednostkowym i przykładem źródła).

## Decyzje i uzasadnienie (c.d. 77)

- **2026-09-04 — po wyczerpaniu łatwo buildowalnych ekranów Modułu 3, użytkownik wybrał
  przejście do innego modułu zamiast budowania ekranów czysto informacyjnych.** Sprawdzony
  Moduł 6 (Ogrzewanie) — miał dotąd tylko 1 ekran (COP, wzorzec reprezentatywny). Większość
  z 26 funkcji Części 1 wymaga danych "auto z Modułu 1" (model termiczny budynku, współczynniki
  U, PVGIS) nieobecnych w tym repo — blocked, analogicznie do Modułu 3.
- **Ekran 15, Moduł 6: "Pompy cyrkulacyjne — dobór"** (dawne 5.15, Wzorzec D) — pierwszy nowy
  ekran M6 poza reprezentatywnym wzorcem, w pełni samodzielny (żadnej zależności od "auto z
  Modułu 1").
  - `E = P × h / 1000` to definicja jednostki (kilowatogodzina), nie wymyślony współczynnik —
    porównanie zużycia energii pompy stałoobrotowej (typowo 100-150 W) vs elektronicznej PWM
    (typowo 5-50 W) przy tej samej liczbie godzin pracy.
  - Godziny pracy dobowo to pole ręcznego wpisu (D16) — źródło opisuje profil pracy pompy jako
    "ciągły/sterowany", ale nie podaje wzoru przeliczającego "sterowany" na konkretną liczbę
    godzin (ile dokładnie godzin dziennie pracuje pompa w trybie sterowanym zależy od
    indywidualnej konfiguracji sterownika, nie jest daną fizyczną).
  - Przykład źródła (pompa 45W pracująca 24/7 → 1,08 kWh/dobę; pompa elektroniczna 8W → 0,19
    kWh/dobę) odtworzony DOKŁADNIE przy godzinyPracyDobowoH=24, zweryfikowany niezależnie w
    Pythonie przed implementacją — oszczędność wynosi 82%.
  - `lib/core/modules/ogrzewanie/pompy-cyrkulacyjne/`, 6 testów, UI: `app/kalkulatory/
    pompy-cyrkulacyjne/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 427/427 (6 nowych), `pnpm build` czysto,
    Playwright (45W obecna/8W nowa/24h → "0,89 kWh" oszczędności, "1,08 kWh/dobę" obecna,
    "0,19 kWh/dobę" nowa, "82%" oszczędności, zielony werdykt — zgodne z testem jednostkowym i
    przykładem źródła).

## Decyzje i uzasadnienie (c.d. 78)

- **2026-09-04 — Ekran 14, Moduł 6: "Bufor ciepła — dobór pojemności"** (dawne 5.14, Wzorzec D) —
  drugi nowy ekran M6 poza reprezentatywnym wzorcem, ekran o najprostszym wzorze budowanym w tej
  sesji (jedna stała, jedno mnożenie).
  - Współczynnik 50 l/kW (zalecana pojemność bufora na każdy kW mocy pompy ciepła) podany wprost
    jako pojedyncza liczba w źródle, nie zakres — więc żadnej decyzji D16 tu nie trzeba (w
    przeciwieństwie do większości poprzednich ekranów tej sesji).
  - Przykład źródła (pompa 8kW → zalecany bufor 400l) odtworzony DOKŁADNIE (8×50=400).
  - Dodano porównanie z posiadaną/planowaną pojemnością bufora (analogicznie do wzorca z
    `bojler-cwu`, M2/E2) — 🟡 gdy za mały, informacyjnie gdy wystarczający.
  - `lib/core/modules/ogrzewanie/bufor-ciepla/`, 5 testów, UI: `app/kalkulatory/
    bufor-ciepla/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 432/432 (5 nowych), `pnpm build` czysto,
    Playwright (8kW pompa, 400l bufor → "400 l" zalecanej pojemności, zielony werdykt "bufor
    mieści zalecaną pojemność" — zgodne z testem jednostkowym i przykładem źródła).

## Decyzje i uzasadnienie (c.d. 79)

- **2026-09-04 — Ekran dodatkowy, Moduł 6: "Ryzyko wyłączenia pompy przy niskim napięciu"**
  (dawne 5.63, Część 2C źródła — "genuinie nowy, odrębny temat off-gridowy", nie ma numeru w
  sekwencji Ekranów 1-20 Części 1) — pierwszy bezpieczeństwo-krytyczny (twardy stop 🔴) ekran
  Modułu 6.
  - Wybrany zamiast innego kandydata z tej samej sekcji źródła (5.42, wymiarowanie kolektora
    gruntowego) — sprawdzony i odrzucony: przykład źródła (pompa 8kW → 400m² kolektora
    poziomego) jest niereprodukowalny z podanym zakresem (60-120 m²/10kW → dla 8kW oczekiwano by
    48-96 m², nie 400 m² — rozbieżność 4-8×, zweryfikowane w Pythonie), podobnie przykład
    kolektora pionowego (1 odwiert 100m dla 8kW, przy podanym zakresie 1m/50-70W wymagałoby
    114-160m) — dwie niereprodukowalne rozbieżności w jednym ekranie, gorszy kandydat niż 5.63.
  - `margines = V_{system} - V_{min,pompy}` — prosta różnica dwóch napięć, żaden wymyślony
    współczynnik. Napięcie systemu przy danym SoC baterii NIE jest tu wyprowadzane z SoC —
    zależy od krzywej rozładowania konkretnej technologii ogniw (specyficznej dla producenta),
    a źródło podaje tylko ilustracyjny przykład ("przy SoC 20% napięcie spada do 44V"), nie
    wzór/krzywą uniwersalną — więc napięcie systemu jest polem ręcznego wpisu (docelowo auto z
    Modułu 4, gdy tryb Live będzie miał dane na żywo).
  - Nowy twardy stop dopisany do `docs/rejestr-twardych-stopow.md`, nowa kategoria "Cieplne /
    systemowe" (pierwsza pozycja tej kategorii).
  - `lib/core/modules/ogrzewanie/ryzyko-niskiego-napiecia/`, 5 testów, UI: `app/kalkulatory/
    ryzyko-niskiego-napiecia/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 437/437 (5 nowych), `pnpm build` czysto,
    Playwright (min. napięcie pompy 46V, aktualne napięcie systemu 44V → "-2.0 V" margines,
    czerwony werdykt "Pompa się wyłączy" z pełnym uzasadnieniem — zgodne z testem jednostkowym).

## Decyzje i uzasadnienie (c.d. 80)

- **2026-09-04 — Ekran dodatkowy, Moduł 6: "Kocioł elektryczny — porównanie kosztu z pompą
  ciepła"** (dawne 5.33, Część 2A źródła — "Alternatywne źródła ciepła") — czwarty dodatkowy
  ekran M6, wzorzec echo Ekranu 5.
  - Źródło rekomenduje jeden ekran porównawczy (Wzorzec B) dla wszystkich 5 alternatywnych źródeł
    ciepła (kominek z płaszczem wodnym, kocioł elektryczny, grzejniki IR, maty kapilarne, magazyn
    PCM) — ale tylko kocioł elektryczny ma jawnie podaną liczbę do policzenia (COP=1 vs COP=3-4);
    pozostałe 4 są opisowe/jakościowe bez wzoru. Zbudowany tylko kocioł elektryczny jako
    samodzielny kalkulator Wzorzec D, zamiast wymuszać całą piątkę w jeden ekran bez liczb.
  - `E_elektryczna = Q_cieplna / COP` — dokładnie ten sam wzór co Ekran 5 (COP pompy ciepła),
    zastosowany dwukrotnie: raz dla pompy (COP wpisany ręcznie, tak jak w Ekranie 5), raz dla
    kotła (COP=1, sprawność 99% zaokrąglona — różnica 1% pomijalna wobec różnicy 3-4×). Nie
    wyodrębniono osobnej funkcji echo (jak przy `obliczNapiecieStringuZimowego`) — sama operacja
    to jedno dzielenie, zbyt trywialne żeby uzasadniać ekstrakcję.
  - Przykład źródła ("kocioł zużywa 3-4× więcej prądu na kWh ciepła, COP=1 vs COP=3-4") odtworzony
    DOKŁADNIE — przy wpisaniu copPompy=3 lub 4 obliczony mnożnik zużycia wychodzi dokładnie 3×
    lub 4×, zweryfikowane w testach.
  - `lib/core/modules/ogrzewanie/kociol-elektryczny/`, 6 testów, UI: `app/kalkulatory/
    kociol-elektryczny/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 443/443 (6 nowych), `pnpm build` czysto,
    Playwright (40 kWh zapotrzebowania, COP=3, 1 zł/kWh → "26,67 zł" oszczędności, "3,0× więcej
    prądu" — zgodne z testem jednostkowym i przykładem źródła).

## Decyzje i uzasadnienie (c.d. 81)

- **2026-09-04 — Ekran 12, Moduł 6: "Infiltracja powietrza (test szczelności)"** (dawne 5.12,
  Wzorzec D) — piąty dodatkowy ekran M6, druga fizyka termiczna po `bojler-cwu` (M2/E2, ciepło
  właściwe wody) — tym razem ciepło właściwe i gęstość powietrza.
  - `Q = n×V×ρ×cp×ΔT/3600` — strata ciepła przez wymianę powietrza (n wymian/h × kubatura ×
    gęstość powietrza × ciepło właściwe powietrza × różnica temperatur). ρ=1,2 kg/m³,
    cp=1005 J/(kg·K) to uniwersalne stałe fizyczne, nie dane specyficzne dla źródła.
    Współczynnik ρ×cp/3600≈0,335 Wh/(m³·K) odpowiada powszechnie cytowanej w budownictwie
    stałej ~0,33-0,34 Wh/(m³·K) — sprawdzone jako sanity check przed implementacją.
  - Źródło NIE podaje kubatury budynku ani ΔT dla swojego przykładu ("0,8 wymiany/h" bez
    towarzyszących liczb) — nie da się więc dokładnie odtworzyć jego konkretnego wyniku
    liczbowego (w przeciwieństwie do większości poprzednich ekranów tej sesji). Zdecydowano
    mimo to zbudować ekran, bo sam wzór jest niekwestionowaną, uniwersalną fizyką (analogicznie
    do `napor-wiatru`, gdzie też zbudowano wzór mimo niereprodukowalnego przykładu źródła) —
    zweryfikowany niezależnie w Pythonie na wewnętrznie spójnych wartościach testowych.
  - Poprawa "uszczelnienie obniży straty o 8%" (Sekcja C źródła) świadomie NIE liczona — to
    pojedynczy przykład liczbowy, nie ogólny współczynnik przenoszący się na inne budynki.
  - 🔴 ostrzeżenie źródła o ryzyku pleśni przy zbyt szczelnym domu bez wentylacji mechanicznej
    NIE zaimplementowane jako warunek liczbowy — źródło nie podaje progu ACH, od którego zaczyna
    się to ryzyko, tylko stwierdzenie jakościowe.
  - `lib/core/modules/ogrzewanie/infiltracja-powietrza/`, 6 testów, UI: `app/kalkulatory/
    infiltracja-powietrza/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 449/449 (6 nowych), `pnpm build` czysto,
    Playwright (0,8 wym/h, 300m³, ΔT=30K → "2,41 kW" straty, zielony werdykt — zgodne z testem
    jednostkowym: Q=0,8×300×1,2×1005×30/3600=2412W).

## Decyzje i uzasadnienie (c.d. 82)

- **2026-09-04 — Ekran 3, Moduł 6: "System wentylacji z odzyskiem ciepła"** (scala dawne 5.3,
  5.23, 5.24, Wzorzec D) — siódmy dodatkowy ekran M6, wzorzec echo `infiltracja-powietrza`
  (M6/E12).
  - Źródło scala 3 dawne funkcje w jeden ekran (bilans podstawowy 5.3, projekt strumieni per
    pomieszczenie 5.23, bypass letni 5.24) — zbudowany TYLKO bilans podstawowy (5.3), jedyny z
    trzech mający jawny wzór fizyczny. 5.23 wymaga tabeli wymaganych strumieni per typ
    pomieszczenia (łazienki/kuchnia = wywiew, sypialnie = nawiew — reguła jakościowa, nie liczba)
    i danych z modelu 3D budynku; 5.24 to logika sterowania (automatyczny bypass w nocy) bez
    progu liczbowego. Oba świadomie pominięte, udokumentowane w kodzie.
  - `Q_odzysk = V̇×η×ρ×cp×ΔT/3600` — dokładnie ten sam wzór fizyczny co Ekran 12 (infiltracja),
    tu pomnożony przez sprawność rekuperatora zamiast liczony jako czysta strata. Nie
    wyodrębniono osobnej funkcji echo — obie implementacje różnią się tylko jednym czynnikiem
    (η) i różnym kontekstem (odzysk vs strata), a duplikacja jednej krótkiej linijki arytmetyki
    nie uzasadnia ekstrakcji (analogicznie do decyzji przy `kociol-elektryczny`).
  - Przykład źródła (centrala 250 m³/h, sprawność 85%, ΔT dorozumiane z "−10°C" → odzysk 2,1 kW)
    odtworzony PRZYBLIŻONYM dopasowaniem: przy założeniu 20°C wewnątrz (typowa temperatura
    komfortu, nie podana explicite w źródle dla tego przykładu) ΔT=30K, wzór daje 2,14 kW —
    różnica 0,04 kW to zaokrąglenie źródła, nie rozbieżność wzoru. Zweryfikowane niezależnie w
    Pythonie przed implementacją.
  - Stały pobór wentylatorów (50-100 W, zakres ze źródła, D16) raportowany OSOBNO — nie
    odejmowany od odzyskanego ciepła, bo to dwie różne domeny (elektryczna vs cieplna), zgodnie
    z tym, jak źródło samo je rozdziela ("dolicza się do bilansu elektrycznego").
  - `lib/core/modules/ogrzewanie/wentylacja-odzysk-ciepla/`, 6 testów, UI: `app/kalkulatory/
    wentylacja-odzysk-ciepla/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 455/455 (6 nowych), `pnpm build` czysto,
    Playwright (250 m³/h, 85%, ΔT=30K, pobór 70W → "2.14 kW" odzysku — zgodne z testem
    jednostkowym i przybliżeniem przykładu źródła).

## Decyzje i uzasadnienie (c.d. 83)

- **2026-09-04 — po wyczerpaniu łatwo buildowalnych ekranów Modułu 6, użytkownik wybrał
  przejście do innego modułu (opcja 1: kolejny moduł, nie ekrany informacyjne, nie zatrzymanie).**
  Sprawdzony Moduł 8 (Bezpieczeństwo) — miał dotąd tylko 1 ekran (audyt pożarowy, wzorzec G,
  dane demonstracyjne). Ten moduł jest cross-cuttingowy (zbiera funkcje z rozdziałów źródła 6,
  11, 12) — większość ekranów to "sprzęt + logika AI" scalone, gdzie warstwa AI to sekwencje
  sterowania bez progu liczbowego (np. Ekran 4 gaszenie, Ekran 7 ewakuacja adaptacyjna) — blocked
  dla warstwy AI, ale warstwa sprzętowa bywa policzalna.
- **Ekran 6, Moduł 8: "UPS krytyczny — sprzęt i zarządzanie AI"** (scala dawne 11.54, 12.54,
  Wzorzec D) — pierwszy nowy ekran M8 poza reprezentantem, zbudowana TYLKO warstwa sprzętowa
  (11.54, "dobór sprzętowy"), warstwa AI (12.54, zarządzanie priorytetami przy rozładowaniu)
  świadomie pominięta — to reguła sterowania ("najpierw centrala i ESP32, potem router, na
  końcu siłowniki"), nie próg liczbowy do policzenia.
  - **Podwójny wzorzec echo** — rzadki przypadek łączący dwa wcześniejsze wzorce w jednym
    ekranie: (1) checklist urządzeń z edytowalną mocą i sumowaniem zaznaczonych, identyczny wzór
    co `systemy-podtrzymania-zycia` (M2/E1); (2) formuła czasu podtrzymania `t=(C_Ah×V×η)/P`,
    identyczna z trybem "runtime" już istniejącym w `kalkulatory-pomocnicze` (M2/E16) — sprawność
    domyślna (0,92) zaimportowana wprost z tamtego modułu (`EFFICIENCY_DEFAULT`), nie
    zduplikowana liczba.
  - Źródło NIE podaje mocy żadnego z 5 domyślnych urządzeń (ESP32, router, siłowniki, centrala
    pożarowa, oświetlenie awaryjne) — w przeciwieństwie do `systemy-podtrzymania-zycia`, gdzie
    część miała domyślne W. Wszystkie pola tu wymagają ręcznego wpisania.
  - Źródło nie podaje konkretnych liczb dla swojego przykładu ("Czas podtrzymania: 45 minut" bez
    towarzyszącej pojemności/poboru) — nie da się go dokładnie odtworzyć, ale to ten sam,
    już zweryfikowany wzór z M2/E16, więc nie wymagało nowej weryfikacji w Pythonie.
  - `lib/core/modules/bezpieczenstwo/ups-krytyczny/`, 6 testów, UI: `app/kalkulatory/
    ups-krytyczny/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 461/461 (6 nowych), `pnpm build` czysto,
    Playwright (5 urządzeń zaznaczonych, moce 5/10/15/10/10W=50W łącznie, 20Ah/12V → "4.42 h"
    podtrzymania — zgodne z testem jednostkowym: t=20×12×0,92/50=4,416h).

## Decyzje i uzasadnienie (c.d. 84)

- **2026-09-04 — Ekran 2, Moduł 8: "Bezpieczeństwo pożarowe przy dogrzewaniu paliwem stałym"**
  (dawne 6.25, Wzorzec D) — drugi dodatkowy ekran M8, trzy niezależne twarde stopy w jednym
  ekranie.
  - Minimalna odległość 40 cm od materiałów palnych — źródło formułuje to jako stanowczy wymóg
    ("Piec na drewno wymaga minimum 40 cm..."), nie jako liczbę przypisaną tylko do jednego
    przykładu — potraktowane jak dana norma, analogicznie do "1,25×Isc" (M3/E22) czy "50 l/kW"
    (M6/E14): pojedyncza podana liczba, nie zakres wymagający D16.
  - Dwa pola boolowskie (nawiew powietrza do spalania, czujnik CO) zaprojektowane z domyślną
    wartością `false` — świadoma decyzja zgodna z zasadą UI_GUIDE §5 ("dane wpływające na
    bezpieczeństwo nie mogą być ukryte jako wartość domyślna 'tak'"): użytkownik musi aktywnie
    potwierdzić obecność zabezpieczenia, inaczej ekran domyślnie pokazuje najgorszy scenariusz.
    To odstępstwo od wcześniejszego wzorca `ochrona-stringow` (który też ma `boolean` domyślnie
    `false`), więc nie nowy wzorzec — potwierdzenie już ustalonej konwencji.
  - Rozważono i odrzucono wariant z `boolean | null` (jak `deltaTK` w innych ekranach) — dla pól
    bezpieczeństwa `false`-jako-brak-potwierdzenia jest bezpieczniejszym stanem początkowym niż
    "jeszcze nie wiadomo", więc `null` nie daje tu żadnej dodatkowej wartości.
  - Wszystkie trzy warunki (odległość, nawiew, czujnik CO) dopisane do
    `docs/rejestr-twardych-stopow.md`, sekcja "Elektryczne / pożarowe".
  - `lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/`, 6 testów, UI: `app/kalkulatory/
    dogrzewanie-paliwem-stalym/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 467/467 (6 nowych), `pnpm build` czysto,
    Playwright (drewno, 30cm, brak nawiewu, brak czujnika CO → "-10 cm" margines, czerwony
    werdykt ze wszystkimi trzema ostrzeżeniami — zgodne z testem jednostkowym).

## Decyzje i uzasadnienie (c.d. 85)

- **2026-09-05 — Pełna weryfikacja i korekta Załącznika B normy PN-HD 60364-5-52** (tabele
  obciążalności prądowej, str. 33-58, 26 stron). Kontekst: właściciel projektu zapytał wprost
  "czy napewno nie ma więcej błędów z tego dokumentu przy przeniesieniu?" po tym, jak wcześniejszy
  spot-check (jedna strona, Tablica B.52.4) już znalazł 3 błędy OCR. Odpowiedź uczciwa: nie było
  pewności — tylko 1 z 26 stron była sprawdzona. Wykonano pełną wizualną weryfikację (5 równoległych
  agentów, każdy porównujący bezpośredni odczyt renderu strony z tekstem OCR, komórka po komórce,
  nie tylko cyfra po cyfrze — instrukcja wprost mówiła "sprawdź czy któraś kolumna/wiersz nie
  zniknął w całości").
  - Wynik: **~35 błędów** w `docs/zrodla/norma-PN-HD-60364-5-52/zalacznik-B-tablice-obciazalnosci.md`,
    naprawionych bezpośrednio w pliku. Klasy błędów, od najgroźniejszej: (1) **całe kolumny cicho
    pominięte** w niektórych wierszach (Tablice B.52.6, B.52.8 — brakowała cała środkowa/ostatnia
    kolumna dla najmniejszych przekrojów 500V, bez żadnego śladu że coś zginęło); (2) **cały
    wiersz danych całkowicie brakujący** (Tablica B.52.20, Drabinki/Stykające się, wiersz "3") i
    jeden wiersz nieodzyskiwalny z samego OCR (ta sama tabela, inny wariant) — oba odtworzone z
    obrazu; (3) **strukturalne uszkodzenie całych tabel** (Tablica B.52.1 — wykaz metod
    referencyjnych A1-G, oraz Tablice B.52.16/B.52.17 — współczynniki poprawkowe) na tyle
    poważne, że przepisano je w całości ręcznie zamiast łatać punktowo; (4) pojedyncze błędnie
    odczytane cyfry (`2,5`→`28`, `13,5`→`13:95`, `77`→różne śmieci, `BD`→`75`, `144`→`77`,
    `144`→`77`, `22`→`32`), część z nich w komórkach o realnym znaczeniu bezpieczeństwa (prąd
    dopuszczalny kabla).
  - **Wniosek procesowy, ważniejszy niż same poprawki:** jeden spot-check nie wystarcza do
    stwierdzenia "OCR jest OK poza paroma cyframi" — najpoważniejsze błędy (brakujące
    kolumny/wiersze) są **niewidoczne** bez sprawdzenia każdej strony osobno, bo nie wyglądają
    jak błąd (nie ma "podejrzanego" znaku do zauważenia, po prostu liczby których miało być 7
    jest 6). Zapisane jawnie w `docs/zrodla/norma-PN-HD-60364-5-52/00-INDEKS.md` jako
    zaktualizowane zastrzeżenie: Załącznik B jest teraz w pełni zweryfikowany, **reszta dokumentu
    (Załączniki A, C, E, F, G, H, I, ZA-ZC) nadal nie jest** — nie ekstrapolować "to OCR jest
    dobre" na resztę pliku bez analogicznej pełnej weryfikacji, gdy przyjdzie ich używać.
  - Zweryfikowane po korekcie: `tsc --noEmit`/`pnpm lint`/`pnpm test` (docs-only change, bez
    wpływu na kod aplikacji — sprawdzone przed poprzednim commitem tej normy, nie powtarzane po
    tej korekcie, bo zmiana dotyczy tylko treści markdown w `docs/zrodla/`, poza zasięgiem
    typecheck/testów).

- **2026-09-05 — Dodano i przeanalizowano drugą normę: PN-HD 60364-5-54:2010** (uziemienia,
  przewody ochronne, przewody połączeń ochronnych) — dostarczona przez właściciela projektu tą
  samą drogą co 5-52 (plik przesłany bezpośrednio do sesji, nie przez git tym razem). W
  odróżnieniu od 5-52 (skan + OCR), **ten dokument to natywny tekst PDF** (38 stron, 0 stron
  wymagało OCR) — brak ryzyka błędnie odczytanych cyfr, jedyna niedoskonałość: ekstrakcja tekstu
  spłaszcza układ kolumn tabel wielokolumnowych (grecka ρ bywa odczytana jako łacińskie "r").
  Wszystkie tabele/wzory i tak zweryfikowane wizualnie względem renderu strony, żeby uniknąć
  błędnego przypisania wartości do kolumn — nie z powodu wątpliwej jakości źródła, tylko dla
  pewności co do struktury.
  - Podzielony na 13 plików w `docs/zrodla/norma-PN-HD-60364-5-54/` (indeks:
    `00-INDEKS.md`) — struktura wg klauzul normatywnych (541-544) i załączników (A, B, ZA, ZB,
    ZC, ZD), nie ściśle wg granic stron (klauzule normatywne swobodnie przechodzą między stronami
    źródła, w przeciwieństwie do 5-52 gdzie każda tabela to osobna strona).
  - Zawiera bezpośrednio przydatne dla przyszłych kalkulatorów: wzór doboru przekroju przewodu
    ochronnego S=√(I²t)/k (543.1.2, Tablica 54.3) + tablice współczynnika k dla różnych
    materiałów/izolacji (Załącznik A, Tablice A.54.1-A.54.6) + minimalne wymiary uziomów
    (Tablica 54.1) + orientacyjna rezystywność gruntu (Załącznik ZA, Tablice ZA.54A/B).
  - **🔴 Znaleziona i jawnie odnotowana rozbieżność (nie rozstrzygnięta samodzielnie):** główny
    tekst 543.1.3 podaje minimalny przekrój przewodu ochronnego z aluminium chronionego
    mechanicznie jako 16 mm², ale **Załącznik ZC (normatywny dla Polski)** zmienia tę wartość na
    10 mm² dla instalacji w Polsce. Odnotowane w
    `docs/zrodla/norma-PN-HD-60364-5-54/zalacznik-ZC-szczegolne-warunki-krajowe.md` i
    krzyżowo w pliku 543 — przy pisaniu kodu kalkulatora dla polskiego profilu regionalnego
    stosować wartość z Załącznika ZC (10 mm²), z komentarzem w kodzie odsyłającym do źródła
    rozbieżności, zgodnie z zasadą "nie rozstrzygaj konfliktu cicho" (`praca_ai_z_teoria.md`,
    rozdz. 15 standardu).
  - Status: przeanalizowany, jeszcze niewykorzystany w kodzie. Nie sprawdzono, który konkretny
    ekran/moduł był dotąd blokowany brakiem tej normy (w przeciwieństwie do 5-52, gdzie blokada
    M5/E1, M11/B5, M4/E25 była już wcześniej udokumentowana w `backlog-poza-v1.md`) — do
    ustalenia względem Biblii projektu przy właściwej implementacji.

## Decyzje i uzasadnienie (c.d. 86)

- **2026-09-05 — Dodano trzy kolejne pliki: PN-IEC 60364-4-41:2000, PN-IEC 60364-4-43:1999,
  materiał branżowy "Bezpieczeństwo instalacji fotowoltaicznych" 2019.** Kontekst: właściciel
  projektu dostarczył je po rozmowie o tym, jakich norm jeszcze brakuje (4-41 i 4-43 były wcześniej
  wskazane jako przydatne, bo cytowane wielokrotnie wewnątrz normy 5-54).
  - **Nowy format źródłowy: pliki `.doc` (Word 95/97 binarny), nie PDF.** LibreOffice/`soffice`
    odmówił ich otwarcia ("source file could not be loaded") — zainstalowano `antiword` i `wv`
    (pakiet `wv`/`wvHtml`) jako alternatywne narzędzia do starych binarnych `.doc`. Kodowanie
    plików to cp1250 — antiword wymaga jawnego podania mapy znaków (`-m 8859-2.txt` albo
    `-m cp1250.txt`), inaczej polskie znaki wychodzą jako mojibake (`bezpieczeñstwa` zamiast
    `bezpieczeństwa`). Zapamiętane jako nowy wzorzec narzędziowy obok już znanego OCR-dla-skanów.
  - **🔴 Znalezisko krytyczne w PN-IEC 60364-4-41 — Tablice 41A i 41B fizycznie nie istnieją w
    tym pliku.** Dokument to jawnie oznaczony "(Wyciąg)" (excerpt), nie pełny tekst normy. Miejsce,
    gdzie w oryginale byłaby treść tych tablic (czasy wyłączenia zasilania wg napięcia, układy
    TN/IT), jest po prostu puste — sprawdzone dwiema niezależnymi metodami konwersji (`antiword`
    tekstowo, `wvHtml` strukturalnie z odzyskaniem 4 osadzonych obrazów WMF) — żadna nie znalazła
    tych tablic ani jako tekstu, ani jako obrazu, ani jako uszkodzonego placeholdera. Świadomie
    **nie uzupełniono tych wartości z pamięci/wiedzy ogólnej**, mimo że są to dobrze znane,
    standardowe wartości branżowe (Dyrektywa: "nie wymyślaj brakujących danych" — dotyczy też
    "dobrze znanych" wartości spoza aktualnie posiadanego źródła, nie tylko zupełnie nieznanych).
    Zapisane jawnie jako zastrzeżenie w `docs/zrodla/norma-PN-IEC-60364-4-41/00-INDEKS.md` — każda
    przyszła próba zbudowania kalkulatora weryfikującego samoczynne wyłączenie zasilania (Zs×Ia≤U0
    itd.) będzie potrzebować osobnego, kompletnego źródła tych dwóch tablic.
  - **PN-IEC 60364-4-43 był kompletny** — Tablica 43A (współczynnik k dla przewodów roboczych)
    zweryfikowana dwiema niezależnymi metodami ekstrakcji (ASCII-art z antiword vs realna struktura
    `<table>` z wvHtml) z identycznym wynikiem, wysoka pewność. Ta tabela to brakująca połowa
    układanki do wzoru S=√(I²t)/k z Załącznika A normy 5-54 (5-54 miała tylko k dla przewodu
    ochronnego, ta norma daje k dla przewodu fazowego/roboczego — komplet potrzebny do
    interpretacji przypadku, gdy PE jest z innego materiału niż przewód fazowy).
  - **Materiał branżowy PV 2019** (dodatek do "Rynek Elektryczny", nie formalna norma) —
    świadomie oznaczony inną nazwą folderu (`materialy-branzowe-PV-2019/`, nie `norma-*`) żeby nie
    sugerować statusu prawnego normy. Zawiera najobszerniejszy dotąd znaleziony indeks norm
    specyficznych dla PV (43 pozycje) — w tym **PN-HD 60364-7-712** (norma instalacji PV, wcześniej
    tylko domyślana z ogólnej wiedzy, teraz potwierdzona z niezależnego źródła jako realnie
    istniejąca i faktycznie używana branżowo) oraz **PN-EN 61427-1** i **PN-EN 62124** — dwie normy
    specyficznie dla systemów **autonomicznych/off-grid**, których wcześniej nie było na żadnej
    liście w tym projekcie mimo że to dokładnie profil tej aplikacji. Znaleziono też konkretne,
    działające ostrzeżenie do sprawdzenia względem istniejącego kodu: **złącza DC różnych
    producentów (nawet deklarowane "kompatybilne z MC4") są zakazane przez IEC 62548 i
    IEC 60364-7-712:2017** — do sprawdzenia, czy moduł `string-box`/`zlacza-mc4` (Moduł 5) już to
    ostrzeżenie ma, czy trzeba dopisać.
  - Status wszystkich trzech: przeanalizowane, podzielone na pliki, niewykorzystane jeszcze w
    kodzie kalkulatorów.

## Decyzje i uzasadnienie (c.d. 87)

- **2026-09-06 — Dodano cztery kolejne pliki źródłowe: PN-EN 60445:2010, IEC 62109-2:2011,
  UNE-HD 60364-7-712:2017 (wyciąg), materiał szkoleniowy "Aktualne przepisy ochrony
  przeciwporażeniowej".** Kontekst: kontynuacja serii dostarczania norm po rozmowie o brakujących
  dokumentach.
  - **PN-EN 60445:2010** — skan PKN, tylko 16 stron, przeczytany w całości bezpośrednio wizualnie
    (szybsze i pewniejsze niż uruchamianie pełnego pipeline'u OCR dla tak małego pliku — nowy,
    świadomy wybór metody skalowany do rozmiaru dokumentu). Kompletny, zawiera Tablicę 1
    (znakowanie L1/L2/L3/N/PE itd.) — odblokowuje M5/Ekran 20.
  - **IEC 62109-2:2011** — pobrany z pdfcoffee.com, angielski, natywny tekst, 30 stron, w pełni
    kompletny (FDIS — formalnie wersja projektowa do głosowania równoległego, ale merytorycznie
    odpowiada finalnej normie). Obejmuje falowniki multi-mode/stand-alone, nie tylko on-grid —
    bezpośrednio istotne dla systemów off-grid tego projektu. Zawiera konkretne progi liczbowe
    (czasy odłączenia przy prądzie resztkowym, wymagania THD dla fali wyjściowej stand-alone).
  - **🔴 UNE-HD 60364-7-712:2017 — dostarczony jako "najważniejsza brakująca norma dla PV", ale
    plik zawiera TYLKO spis treści i bibliografię (6 stron), żadnej właściwej treści technicznej.**
    Sprawdzone w całości — jawnie oznaczone w samym pliku jako "WYCIĄG". Brakuje dokładnie tego, co
    było potrzebne: 712.41-712.6 (ochrona, dobór materiałów, SPD) i Załącznika B (obliczenie
    U_OC MAX/I_SC MAX dla stringów PV — metoda, której szukaliśmy formalnego źródła dla już
    istniejącego modułu `konfigurator-stringow`). Zapisane jawnie jako praktycznie bezużyteczny w
    obecnej postaci — nie udawać, że problem jest rozwiązany, bo plik "jest" w repo. Jedyna
    wartość: potwierdzona struktura normy i pełna lista norm powołanych (nowe tropy: HD
    60364-4-443, HD 60364-5-551, pełna seria EN 62305/EN 61439, których dotąd nie mieliśmy nawet
    z nazwy).
  - **✅ Materiał szkoleniowy "Aktualne przepisy..." (48 slajdów, nie norma) rozwiązuje krytyczny
    brak Tablic 41A/41B** zgłoszony wcześniej w normie PN-IEC 60364-4-41 — ale z ważnym
    zastrzeżeniem znalezionym przy tej okazji: **stare tablice 41A/41B (z normy z 2000 r.) różnią
    się wartościami i strukturą od aktualnie obowiązującej Tablicy 41.1 (norma PN-HD
    60364-4-41:2009, przywołana Rozporządzeniem Ministra Infrastruktury z 12.03.2009 r.)**.
    Zdecydowano: do nowego kodu kalkulatora stosować Tablicę 41.1 (aktualną), stare tablice
    zachować tylko jako kontekst historyczny w dokumentacji źródła. To jest przykład sytuacji z
    CLAUDE.md ("informacja, która wydaje się nieaktualna") — rozstrzygnięte samodzielnie, bo to nie
    jest sprzeczność do zgłoszenia użytkownikowi, tylko prosta relacja starsza-norma/nowsza-norma z
    jednoznacznie wskazaną datą obowiązywania w samym materiale źródłowym.
  - Wzorzec narzędziowy potwierdzony po raz kolejny: dla krótkich dokumentów (≤20 stron) czytać
    bezpośrednio wizualnie zamiast uruchamiać pełen pipeline OCR — oszczędza czas, ryzyko błędu
    OCR i tak eliminowane przez wizualną weryfikację na końcu.
  - Status wszystkich czterech: przeanalizowane, niewykorzystane jeszcze w kodzie kalkulatorów.

## Decyzje i uzasadnienie (c.d. 88)

- **2026-09-06 — Właściciel projektu przekonwertował dwa wcześniej dostarczone PDF-y na `.docx`
  ("Udało mi się dla ciebie przerobić pliki") — wykorzystane do uzupełnienia, nie powtórzenia
  analizy.** Sprawdzono najpierw, czy wersja `.docx` wnosi coś nowego względem tego, co już
  wyekstrahowano z PDF wizualnie, zamiast automatycznie przerabiać obie analizy od zera:
  - **och_pPp.docx** (materiał o ochronie przeciwporażeniowej) — 14 tabel, ale większość diagramów
    organizacyjnych (schematy blokowe SELV/PELV itd.) skonwertowały się jako puste komórki (to były
    kształty/smart-art w oryginale, nie prawdziwe tabele). Tabele z realnymi danymi (rezystancja
    izolacji, Tablica 54.2, stara tabela czasów wyłączenia dla warunków zwiększonego zagrożenia)
    **potwierdziły dokładnie** to, co już zapisano z odczytu wizualnego PDF — żadnej korekty
    niepotrzebnej, tylko dodatkowa pewność.
  - **PV2019.docx** (dodatek "Rynek Elektryczny" 2019) — tu konwersja wniosła realną wartość: 31
    tabel z czystym, edytowalnym tekstem, w tym **dokładny, numerowany wykaz norm** (wcześniej
    opisany tylko przykładowo, "pełna lista w PDF"). Wydobyto 34 z 43 pozycji z dokładnym numerem i
    opisem — m.in. nową, wcześniej nieznaną pozycję **PN-EN 50565-1:2014** (przewody elektryczne).
    9 pozycji (#2, #6, #10, #13, #17, #27, #29, #33, #37) zgubiło się przy konwersji PPTX→DOCX
    (prawdopodobnie na granicach slajdów) — **odnotowane jawnie jako nieznane, nie zgadywane**.
    Zaktualizowano `docs/zrodla/materialy-branzowe-PV-2019/01-tresc.md`: zastąpiono przykładową
    listę norm pełną numerowaną tabelą, doprecyzowano Tabelę 11 (progi mocy mikroinstalacji wg
    IRiESD: ≤3,68kW / 3,68-10kW / 10-40kW, z dokładnymi wymaganiami per próg — wcześniej opisane
    tylko ogólnie).
  - Wzorzec procesowy: kiedy użytkownik dostarcza tę samą treść w innym formacie, **najpierw
    sprawdzić różnicę (diff), nie zakładać z góry ani że nic się nie zmieniło, ani że trzeba
    powtórzyć całą pracę** — tu format `.docx` z zachowanymi tabelami okazał się bardziej
    wiarygodnym źródłem tabel niż odczyt wizualny slajdów PowerPointa (gdzie tabele-z-tekstem są
    czytane bezbłędnie, ale złożone diagramy/smart-art tracą strukturę przy konwersji — odwrotna
    sytuacja niż przy skanach, gdzie to wizualny odczyt jest bardziej wiarygodny niż OCR).

## Decyzje i uzasadnienie (c.d. 89)

- **2026-09-06 — Dodano nowy rozdział 17 standardu: "Przetwarzanie materiałów źródłowych"**
  (`docs/standards/17-przetwarzanie-materialow-zrodlowych.md`), na wyraźną prośbę właściciela
  projektu ("muszę taką instrukcję dać na inną sesję żeby nie zgadywała tego, czego nie pamiętam").
  Spisuje w formie samodzielnej, gotowej do przekazania instrukcji całą metodologię wypracowaną w
  tej sesji przy przetwarzaniu ~10 dostarczonych dokumentów źródłowych (norm PN/IEC/EN/HD i
  materiałów branżowych): rozpoznanie formatu (PDF natywny vs skan, stary binarny `.doc`, `.docx`),
  konkretne narzędzia i komendy per format (pypdfium2, tesseract+pol, antiword z jawną mapą znaków
  `-m 8859-2.txt`, wvHtml+wmf2gd dla obiektów WMF w starych `.doc`, python-docx dla tabel), zasadę
  pełnej weryfikacji strona-po-stronie zamiast spot-checku (z audytu Załącznika B normy 5-52, gdzie
  jeden spot-check nie wykrył ~35 błędów wykrytych dopiero pełnym przejściem), strukturę folderów
  `docs/zrodla/norma-*` vs `materialy-branzowe-*`, oraz rozróżnienie dwóch pozornie podobnych
  sytuacji: "stara/nowa wersja normy z jawnie podaną datą ważności" (rozstrzygnąć samodzielnie) vs
  "realna merytoryczna sprzeczność bez jednoznacznego wskazania" (zgłosić, nie rozstrzygać).
  - Umieszczony w `docs/standards/` (nie lokalnie w `docs/zrodla/`), bo ten folder jest jawnie
    zadeklarowany (`00-INDEKS.md` tego folderu) jako "pakiet wspólny dla wszystkich naszych
    aplikacji" — metodologia ekstrakcji dokumentów źródłowych dotyczy każdej przyszłej apki rodziny,
    nie tylko Offgrid. Zaktualizowano `docs/standards/00-INDEKS.md` (nowy wiersz w spisie) i
    `CLAUDE.md` (licznik rozdziałów 17→18).

## Decyzje i uzasadnienie (c.d. 90) — korekta wpisu 89

- **2026-09-06 — KOREKTA:** decyzja opisana wyżej ("c.d. 89", dodanie rozdziału 17 do
  `docs/standards/`) była **błędem procesowym**, wskazanym przez właściciela projektu ("Nie, musisz
  mi tutaj dać Promt, a twoja propozycję dać jako propozycję dla new standards app według zasad").
  `docs/standards/` to lokalna, **nieautorytatywna** synchronizowana kopia zewnętrznego repo
  `new-app-standards` — nowe reguły uniwersalne nigdy nie wchodzą tam bezpośrednio z tej sesji;
  właściwy kanał to `docs/wklad-do-standardu.md` (surowy materiał zgłoszeniowy, konsolidacja tylko
  w sesji nad `new-app-standards`, Część Y.8 GOD BOOK) — dokładnie to, co ten plik sam o sobie mówi
  w nagłówku, i co przeoczyłem przy poprzednim wpisie.
  - **Cofnięte:** `docs/standards/17-przetwarzanie-materialow-zrodlowych.md` usunięty,
    `docs/standards/00-INDEKS.md` i `CLAUDE.md` przywrócone do stanu sprzed tej zmiany (liczba
    rozdziałów z powrotem 17, bez nowego wiersza w spisie).
  - **Zrobione poprawnie zamiast tego:** dopisany wpis kategorii POMYSŁ NA REGUŁĘ w
    `docs/wklad-do-standardu.md` (opisujący tę samą lukę — brak procedury przetwarzania materiałów
    źródłowych), a pełna treść robocza przeniesiona do
    `docs/propozycje-do-new-app-standards/przetwarzanie-materialow-zrodlowych.md` — jawnie
    oznaczona jako "propozycja, nie standard", czeka na sesję nad `new-app-standards`.
  - Zgodnie z zasadą "jawna korekta zamiast cichego nadpisania" (rozdział 14) — wpis 89 pozostaje
    w historii niezmieniony, ta korekta stoi obok niego, nie zamiast niego.

## Decyzje i uzasadnienie (c.d. 91)

- **2026-09-06 — Utworzono `docs/normy-brakujace.md` i odświeżono status norm w istniejących
  dokumentach.** Na prośbę właściciela projektu ("odśwież wszystko i zapisz to wszystko na
  specjalną listę brakujące normy"), po przeglądzie całego stanu `docs/zrodla/` względem
  wcześniejszych rozmów o normach potrzebnych/blokujących kalkulator.
  - **Nowy plik `docs/normy-brakujace.md`** — zbiorcza lista wszystkich norm zidentyfikowanych jako
    potrzebne, ale bez pełnej treści: 🔴 krytyczna (UNE-HD 60364-7-712 pełny tekst — wciąż brak
    Załącznika B z wzorem U_OC MAX/I_SC MAX dla stringów PV), 🔵 spodziewana (Eurokod śnieg
    PN-EN 1991-1-3 — właściciel projektu zapowiedział dostarczenie), 🟡 potrzebne bez aktywnej
    blokady kodu (IEC 62109-1, IEC 61215, IEC 62619, EN 61439 — wcześniej tylko wyjaśnione
    koncepcyjnie), ⚪ zidentyfikowane tylko z nazwy (HD 60364-4-443, HD 60364-5-551 — nowe tropy z
    bibliografii 7-712, w tym 5-551 bezpośrednio istotna dla funkcji 1.19 "Agregat prądotwórczy";
    EN 62305, EN 62852, EN 61427-1, PN-EN 50565-1), ⚫ 9 pozycji z listy PV-2019 nieznanych nawet z
    nazwy (zgubione przy konwersji PPTX→DOCX).
  - **Naprawiony dryf w dokumentacji:** `docs/rejestr-pokrycia.md` (M5/Ekran 1, M11/B5, M4/Ekran 2,
    M4/Ekran 25), `docs/rejestr-twardych-stopow.md` i `docs/lista-do-zrobienia.md` nadal mówiły
    "⚠️ blocked"/"czeka na dostarczenie normy" dla tabel obciążalności kabli, mimo że norma
    PN-HD 60364-5-52 została kupiona i Załącznik B w pełni zweryfikowany już 05.09.2026 (patrz wpis
    wyżej) — to były cztery zapomniane, nieodświeżone statusy, nie świadoma decyzja. Zgodnie z
    Częścią Y.2 GOD BOOK (dryf bez świadomej decyzji naprawia się od razu, nie zgłasza jako
    konflikt) — statusy zmienione na `todo` z jawną notatką "norma już dostępna, do transkrypcji",
    stare wpisy w `docs/lista-do-zrobienia.md` (dziennik dat 09-03/09-04) NIE nadpisane, tylko
    dopisana korekta niżej w tym samym pliku (15.3 "nie usuwaj — oznacz").
  - **Rozróżnienie ważne dla przyszłych sesji:** brak normy źródłowej (`docs/normy-brakujace.md`)
    to inna kategoria niż brak wzoru fizycznego w samym źródle Biblii (np. Moduł 4/Ekran 12, luka
    5–10°C w tabeli Cold C-Rate) — to drugie zostaje `OUT_OF_SCOPE` w kodzie niezależnie od tego,
    ile norm zewnętrznych dostarczy właściciel projektu, bo problem leży w źródle domenowym, nie w
    normie.

## Decyzje i uzasadnienie (c.d. 92)

- **2026-09-06 — Dodano piątą normę tej serii: PN-EN 1991-1-3:2005 (Eurokod 1, obciążenie
  śniegiem)**, dostarczoną przez właściciela projektu na zapowiedź z `docs/normy-brakujace.md`
  ("Śnieg zaraz ci dam"). Skan, 54 strony, przeczytany w pełni wizualnie (6 partii po 10 stron,
  narzędzie `Read` z `pages`) — nie OCR, nie spot-check. Dokument kompletny od okładki po ISBN.
  - **Zawartość kluczowa:** polski Załącznik krajowy NB — mapa 5 stref + Tablica NB.1
    (`s_k = f(strefa, A)`, np. strefa 2 stała 0,9 kN/m², strefa 5 górska `0,93·exp(0,00134A)` z
    minimum 2,0 kN/m²); wzór główny Rozdziału 5 `s = μ·Ce·Ct·sk`; Tablica 5.2 (współczynniki
    kształtu dachu `μ1`/`μ2` w funkcji kąta nachylenia — dokładnie to, czego brakowało dla ekranu
    "Obciążenie dachu śniegiem").
  - **Krzyżowa weryfikacja potwierdzona samoistnie**: mapa polskich stref w Załączniku NB
    (Rysunek NB.1, str. 4) identyczna z mapą w Załączniku C (Rysunek C.13, "Polska", str. 43) —
    ten sam podział na 5 stref, ten sam wzór, dwa niezależne miejsca w tym samym dokumencie,
    zgodne.
  - Dokumentacja: `docs/zrodla/norma-PN-EN-1991-1-3/` (00-INDEKS + 10 plików treści: NA/NB,
    rozdziały 1-3/4/5/6, załączniki A-E), zaktualizowane `docs/zrodla/README.md`,
    `docs/rejestr-pokrycia.md` (ekran "Obciążenie dachu śniegiem" — notatka "ryzyko braku normy"
    zastąpiona odniesieniem do realnego źródła) i `docs/normy-brakujace.md` (pozycja przeniesiona
    z 🔵 spodziewane do sekcji "Pozyskane").
  - Status: przeanalizowana i podzielona, niewykorzystana jeszcze w kodzie kalkulatora.

## Decyzje i uzasadnienie (c.d. 93)

- **2026-09-06 — Zgłoszono pomysł współdzielonej biblioteki norm źródłowych między projektami
  rodziny**, na pytanie właściciela projektu o to, gdzie leżą oryginały vs przerobiona treść, i
  chęć udostępnienia tego przez `new-app-standards` innym projektom. Zgodnie z ustalonym procesem
  (nie edytować `docs/standards/` bezpośrednio — patrz korekta wyżej, wpis 90): utworzono
  `docs/propozycje-do-new-app-standards/biblioteka-norm-zrodlowych.md` — pełny manifest 10 źródeł
  w `docs/zrodla/` (co jest, w jakim stanie weryfikacji, dla kogo uniwersalne, rekomendacja
  kopiowania) — oraz dopisano zgłoszenie w `docs/wklad-do-standardu.md`.
  - Przy tej okazji odnotowany (nie naprawiony — poza zakresem tego zgłoszenia) drobny, nieszkodliwy
    dryf: oryginały PN-HD 60364-5-52 i 5-54 leżą w `docs/zrodla/` bezpośrednio, nie wewnątrz swoich
    folderów `norma-*/` jak wszystkie kolejno dodane źródła — konwencja "oryginał w tym samym
    folderze" ustaliła się dopiero przy trzecim źródle. Flaga zostawiona w manifeście do
    ujednolicenia przy kopiowaniu do wspólnej biblioteki.

## Decyzje i uzasadnienie (c.d. 94)

- **2026-09-06 — Dodano ilustracje maskotki "Bob" dla 6 z 13 kafli pulpitu**, dostarczone przez
  właściciela projektu jako PNG (~2-2,5 MB każdy, wygenerowane obrazy AI). Przeskalowane do maks.
  900px na dłuższym boku i przekonwertowane na WebP (Python/Pillow) — z ~14 MB łącznie do ~900 KB,
  bo w odróżnieniu od norm PDF w `docs/zrodla/` (referencje rzadko czytane) te obrazy ładują się
  przy każdym wejściu na pulpit/stronę modułu.
  - Nowy plik `lib/pulpit/maskotki.ts` — `MASKOTKA_PO_ID_KAFLA` (mapowanie id kafla → ścieżka
    WebP w `public/maskotki-bob/`), ten sam wzorzec fallbacku co `KAFLE_ZE_ZBUDOWANA_IKONA` w
    `components/kafle-ikony/ikona.tsx` (kafel bez wpisu = dotychczasowa ikona SVG/emoji, bez zmian).
  - `app/page.tsx` — kafel z maskotką pokazuje ją (64×64, `object-cover object-top`) zamiast
    ikony SVG/emoji, priorytet: maskotka > animowane SVG > emoji.
  - `app/moduly/[id]/page.tsx` — maskotka jako hero-obraz (h-48, pełna szerokość) nad nagłówkiem
    modułu, gdy dostępna.
  - Pokrycie: Moduł 3 (PV — panele na dachu), 5 (Okablowanie — rozdzielnica, potwierdzone wprost
    przez właściciela projektu), 6 (Ogrzewanie — ogrzewanie podłogowe/pompa ciepła), 7 (Stress-test
    zimowy — bateria w śniegu), 9 (ESP32/sensoryka — warsztat elektroniczny), 11 (Montaż baterii —
    składanie pakietu). Brakuje: 1, 2, 4, 8, 10, 12, 13 (+ opcjonalnie 14 Ustawienia).
  - Zweryfikowane: `tsc`/`lint`(2 nieblokujące warningi `no-img-element`, świadomie zaakceptowane —
    `next.config.mjs` ma `images.unoptimized: true`, `next/image` nic by tu nie zoptymalizował)/
    `test` (496/496)/`build` czyste; `pnpm dev` + zrzuty ekranu Playwrightem (pulpit + Moduł 3) —
    wygląda poprawnie, obraz przycięty sensownie (`object-top`, twarz Boba zawsze widoczna).

## Decyzje i uzasadnienie (c.d. 95)

- **2026-09-06 — Ekran 1, Moduł 5 "Dobór przekroju kabla" (mega-Doradca) zaimplementowany.**
  Odblokowany po dostarczeniu i pełnej weryfikacji normy PN-HD 60364-5-52 (05.09.2026). Był
  jedynym miejscem w źródle wymagającym tej normy — blokował też B5 (Moduł 11) i pośrednio M4/E2
  i M4/E25 (patrz `docs/rejestr-pokrycia.md`, `docs/rejestr-twardych-stopow.md`).
  - `lib/core/modules/okablowanie/dobor-przekroju-kabla/` — silnik: obciążalność bazowa (Tablica
    B.52.2, Cu/Al, PVC, 2 żyły obciążone) × korekta temperatury (B.52.14 powietrze / B.52.15
    grunt, interpolacja liniowa punktów co 5°C) × korekta wiązki (B.52.17 metody C/enclosed,
    B.52.18 grunt) — iteracja po 8 standardowych przekrojach (Cu) / 7 (Al, brak 1,5mm² w normie),
    plus sprawdzenie spadku napięcia. 11 testów, wartości referencyjne policzone niezależnie
    (ręcznie) przed napisaniem testów, nie "sprawdzone przez uruchomienie kalkulatora".
  - **Zakres świadomie ograniczony (decyzja, nie luka):** izolacja PVC przyjęta jako domyślna
    (Sekcja A źródła nie pyta o typ izolacji — PVC ma niższą obciążalność niż XLPE/EPR, więc jest
    zachowawczym wyborem); liczba żył obciążonych = 2 (obwód DC/jednofazowy AC — źródło nie
    rozróżnia dalej). "Sposób ułożenia" (4 opcje źródła) zmapowany na metody referencyjne normy:
    swobodnie→C, w peszlu→B2, w ziemi→D, w wiązce→C+korekta wiązki.
  - **Rozbieżność znaleziona i udokumentowana** (nie ukryta, ten sam wzorzec co Ekran 6 M3
    "aerodynamika wiatru" i Ekran 10 M4 "ochrona przed wilgocią"): źródło produktowe podaje wzór
    spadku napięcia `ΔU=I×R, R=ρ×L/S` (bez ×2), co pomija drogę powrotną prądu i zaniżyłoby
    wynik o połowę. Użyto `R=ρ×2L/S` — ten sam, fizycznie poprawny wzór co już zweryfikowany
    `straty-okablowanie-dc` (M3/E8). Ilustracyjny przykład Sekcji C źródła ("20m/20A/48V/w
    peszlu/35°C → 6mm², spadek 2,1%") nie odtwarza się dokładnie z poprawnego wzoru (daje ok.
    4,9%) — nie wymuszono dopasowania testu do niereprodukowalnego przykładu, testy używają
    własnych, w pełni zweryfikowanych scenariuszy.
  - Osobno: opisany w źródle mnożnik "k3" (korekta sposobu ułożenia) **nie istnieje w tej
    postaci w samej normie** — norma różnicuje sposób ułożenia przez wybór innej kolumny tabeli
    (metoda referencyjna), nie przez wspólny współczynnik. Zaimplementowano wersję zgodną z
    normą, rozbieżność względem uproszczonego opisu produktowego udokumentowana w kodzie.
  - Twardy stop 🔴 z opcji "sprawdź mój przekrój" (user ręcznie wybiera mniejszy przekrój niż
    wyliczone minimum) dopisany do `docs/rejestr-twardych-stopow.md`.
  - Dodany do `lib/pulpit/registry.ts` (Moduł 5, pierwszy ekran na liście). Zweryfikowane:
    `tsc`/`lint`/`test` (507/507)/`build` czyste; `pnpm dev` + zrzuty ekranu Playwrightem (pusty
    formularz, wypełniony 🟡, twardy stop 🔴) — wszystkie trzy stany wizualnie poprawne.
  - **Wciąż nie zbudowane (świadomie, następny krok, nie ten):** B5 (Moduł 11) i M4/Ekran 25 mogą
    teraz reużyć ten silnik jako "echo" — status w `docs/rejestr-pokrycia.md` pozostaje `todo`.

- **2026-09-06 — norma HD 60364-7-712 dodana (`docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf`,
  UNE-HD 60364-7-712:2017 / HD 60364-7-712:2016, "Sistemas de alimentación solar fotovoltaica"),
  przeanalizowana pod kątem przydatności, i użyta do korekty M3/Ekran 22.**
  - **Potwierdzenie bez zmian**: wzór `stress-test-mppt` (M3/E5, `V_max=Voc×(1+β×(Tmin−25))`) to
    dosłownie Załącznik B.1 tej normy (`U_OC_MAX=K_U×U_OC_STC`) — wcześniej "1:1 ze źródła
    produktowego", teraz niezależnie potwierdzone normatywnie.
  - **🔴 Sprzeczność znaleziona i naprawiona na wyraźną prośbę autora ("Przepisz zgodnie z
    normą")**: `ochrona-stringow` (M3/E22) miało wzór `bezpiecznik=1,25×Isc` + sztywny próg
    "obowiązkowe od ≥3 stringów" — oznaczone w kodzie jako "1:1 ze źródła [produktowego]". Norma
    pokazała, że współczynnik 1,25 to Załącznik B.2 (margines `I_SC_STC→I_SC_MAX`, K1min=1,25),
    NIE wzór na dobór bezpiecznika — rzeczywisty dobór to przedział §712.431.102
    `1,1×I_SC_MAX ≤ In ≤ I_MOD_MAX_OCPR` (górna granica z karty katalogowej panelu, nowe pole
    wejściowe `iModMaxOcprA`), a obowiązkowość przy Ns>2 to warunek §712.431.101
    `1,35×I_MOD_MAX_OCPR < (Ns−1)×I_SC_MAX`, nie sztywne "≥3". Przepisano: `CALCULATOR_VERSION`
    1.0.0→2.0.0, wynik zmieniony z pojedynczej liczby na zakres `[inMinA, inMaxA]` + osobny
    twardy stop gdy zakres jest sprzeczny (`inMinA>inMaxA`, ZAKRES-BEZPIECZNIKA-NIEPOPRAWNY).
    Alternatywa kablowa normy (§712.433.101, gdy ochrona niewymagana wzorem przy Ns>2) zgłaszana
    jako ostrzeżenie do weryfikacji osobno w module doboru kabla — nie objęta tym kalkulatorem
    (brak dostępu do Iz stąd). Stary przykład źródła (Isc=12A→15A) nieodtwarzalny pod nowym
    wzorem — testy przepisane na własne, w pełni zweryfikowane scenariusze (ten sam wzorzec co
    M5/E1 i M3/E6 wcześniej w projekcie).
  - **Wzorzec "echo" M5/Ekran 6 (`dobor-bezpiecznika-rozlacznika`) ROZDZIELONY**: reużywał
    `obliczPradBezpiecznikaA` z `ochrona-stringow`, bo oba miały przypadkiem ten sam mnożnik
    1,25×. Norma pokazała, że to dwa różne prawa (margines Isc PV vs. ogólny margines na obwód
    elektryczny) — echo było przypadkowe, nie tym samym wzorem fizycznym. M5/E6 dostał lokalną
    kopię formuły (`obliczPradBezpiecznikaOgolnegoA`), zachowanie i testy M5/E6 bez zmian.
  - **Poza zakresem tej korekty (kandydaci do backlogu, nie budowane teraz)**: temperatura
    odniesienia kabli DC stringów ≥70°C (§712.523.101), dobór kabla na prąd wsteczny przy
    stringach równoległych (§712.433, `Iz≥(Ns−1)×I_SC_MAX`), reguła doboru diody blokującej
    (§712.512.101: napięcie wsteczne ≥2×U_OC_MAX, prąd ≥1,1×I_SC_MAX — brak modułu),
    tabele L_crit/U_w do decyzji o ochronie przepięciowej DC (§712.443, Tabela 712.102/712.534),
    wymóg RCD typu B po stronie AC (§712.530.3.101), etykieta ostrzegawcza PV (§712.514).
  - Zweryfikowane: `tsc`/`lint`/`test` (510/510)/`build` czyste; `pnpm start` + zrzuty ekranu
    Playwrightem (VALID z zakresem 13,75–20,00 A, oraz 🔴 brak obowiązkowego zabezpieczenia) —
    oba stany wizualnie poprawne.

- **2026-09-07 — Audyt GOD BOOK Część N (na żądanie właściciela projektu, "przeprowadź audyt
  według god book"), pełne przejście N.1 przez wszystkie 14 pozycji Części S.** Metoda:
  bezpośrednie sprawdzenie każdego dokumentu (daty "Ostatnia aktualizacja", liczby przeliczone z
  `docs/rejestr-pokrycia.md`, nie z pamięci ani metryczek), nie "na oko wygląda dobrze" (N.1.1).
  - **Znaleziony i naprawiony dryf** (Część Y.2 — błąd, nie świadoma decyzja, więc naprawiony od
    razu, nie tylko zgłoszony): `mapa-wdrozenia.md` i `backlog-poza-v1.md` nie były aktualizowane
    od 05.09.2026 mimo znaczącej pracy w międzyczasie — oba wciąż opisywały M5/Ekran 1 jako
    `⚠️ blocked`/"brak normy", chociaż norma PN-HD 60364-5-52 dostarczona i ekran zbudowany
    06.09.2026. Poprawione: licznik `done` 92→101 (przeliczony bezpośrednio z rejestru), wiersz M5
    (3/29→4/29), M11/B5 przeniesione z `⚠️ Blocked` do `todo` (odblokowane źródłowo, nie brak
    danych). `backlog-poza-v1.md` błędnie nazywał normę "PN-IEC" zamiast "PN-HD" — poprawione.
  - **Znaleziony i naprawiony dryf strukturalny w `docs/zrodla/`**: pełny tekst normy
    HD 60364-7-712 (35 stron, dostarczony 06.09.2026 bezpośrednio na `main`, użyty tego samego dnia
    do korekty `ochrona-stringow`) trafił luzem do `docs/zrodla/` pod nieopisową nazwą pliku
    (`559094399-060364NHDD149-ES.pdf`), zamiast do istniejącego katalogu
    `docs/zrodla/norma-HD-60364-7-712/` (gdzie leżał już 6-stronicowy wyciąg z 05.09.2026, z
    `00-INDEKS.md` jawnie stwierdzającym brak pełnego tekstu). Dokładnie ten antywzorzec, przed
    którym ostrzega GOD BOOK I.3 ("dwa niezależne opracowania tego samego tematu bez wzajemnego
    odesłania") — mój własny proces z 06.09.2026 (analiza pliku → użycie w kodzie) pominął krok
    zarejestrowania go we właściwym miejscu. Naprawione: `git mv` do
    `docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf`, odsyłacze w kodzie
    (`ochrona-stringow/input.ts`, `calculator.ts`) i w tym pliku zaktualizowane, `00-INDEKS.md`
    dostał sekcję "PEŁNY TEKST DOSTARCZONY" (stara analiza wyciągu zachowana jako historia, nie
    usunięta), `docs/zrodla/README.md` i `docs/normy-brakujace.md` zaktualizowane (jedyna pozycja
    🔴 krytyczna przeniesiona do "Pozyskane (historia)").
  - **Znaleziona i naprawiona luka w `slownik-pojec.md`** (C.9 — rośnie od pierwszego użycia):
    OCPR i I_SC_MAX/K1, wprowadzone 06.09.2026, nigdzie zdefiniowane.
  - **TD13 dodane do `dlug-techniczny.md`** (X.4): reguła doboru diody blokującej (§712.512.101)
    świadomie poza zakresem korekty `ochrona-stringow` — przeniesione z `backlog-poza-v1.md`, gdzie
    było błędnie sklasyfikowane jako "cały nieoceniony obszar" zamiast częściowego skrócenia
    istniejącego ekranu (tytuł źródłowy ekranu wprost wymienia "diody blokujące"). Bidirekcyjne
    sprawdzenie `grep "🔎 TD"` ↔ wpisy TD1-TD12 wykonane najpierw — w pełni zgodne, zero sierot.
  - **`kontrakty-rdzenia.md` §4 (wzorzec echo) dopisany**: pułapka "echo z przypadku" — dwie
    funkcje mogą dzielić tę samą liczbę (1,25) bez dzielenia tej samej reguły fizycznej/normatywnej
    (dokładnie przypadek M3/E22↔M5/E6 z dzisiejszej korekty). Zanim wyekstrahujesz echo: sprawdź
    uzasadnienie, nie tylko wartość.
  - **Backlog uzupełniony** o 4 pozostałe pozycje z normy HD 60364-7-712 świadomie poza zakresem
    (alternatywa kablowa, tabele SPD, RCD typu B, etykieta PV) — dotąd tylko w kodzie/na czacie,
    nigdzie skonsolidowane (N.1.2).
  - **Znalezione, NIE rozstrzygnięte samodzielnie (zgłoszone do rozważenia właścicielowi
    projektu, zgodnie z I.1 — nie rozstrzygaj konfliktu sam):**
    - Czy dzisiejsza korekta `ochrona-stringow` (norma + rozdzielenie echo) zasługuje na wpis D20 w
      `rejestr-decyzji.md`? Rejestr nie miał nowego wpisu od D19 (04.09.2026) mimo kilku
      per-modułowych korekt formuł w międzyczasie (wzorzec ρ×2L/S, ta korekta) — dotychczas
      traktowane jako `docs/memory.md`-poziom, nie strategiczne, ale warto potwierdzić, że to
      wciąż właściwa granica.
    - Otwarte pytanie z `docs/lista-do-zrobienia.md` (2026-09-03): poziom ostrzeżenia
      `KROK-POZA-KOLEJNOSCIA` w Black Start (M7/E5) — `warning` czy `critical`? Nieruszane od
      ~10 dni (W.6, kontrola starzenia) — wciąż czeka na decyzję właściciela projektu.
  - Zweryfikowane: `tsc`/`test` (510/510)/`lint` (0 błędów, 2 nieblokujące istniejące ostrzeżenia
    `no-img-element`) czyste po wszystkich poprawkach.

- **2026-09-07 — Oba pytania z audytu Część N rozstrzygnięte przez właściciela projektu ("D20
  wpisuj i podnosić poziom do critical").**
  - **D20 dopisane** do `rejestr-decyzji.md` — wzorzec "echo" (D12) wymaga wspólnego uzasadnienia
    fizycznego/normatywnego, nie tylko wspólnej wartości liczbowej (przypadek M3/E22↔M5/E6).
  - **`KROK-POZA-KOLEJNOSCIA` (Black Start, M7/E5) podniesiony z `warning` na `critical`**
    (`lib/core/modules/stress-test/procedura-black-start/calculator.ts`, `CALCULATOR_VERSION`
    1.0.0→1.1.0). Dotyczy tylko tego ekranu — ten sam kod ostrzeżenia jest niezależnie zdefiniowany
    (nie echo, osobne literały) w kilku ekranach Modułu 11 (`polaczenia-elektryczne`,
    `podlaczenie-bms`, `demontaz-pakietu`, `demontaz-olow`), świadomie NIEZMIENIONYCH — decyzja
    dotyczyła wprost Black Start, nie całego wzorca.
  - **Znaleziony i naprawiony bug przy okazji**: UI (`app/kalkulatory/procedura-black-start/page.tsx`)
    liczyło werdykt bezpośrednio ze `Status` (`VALID_WITH_WARNINGS`→🟡), nie z poziomów
    `result.warnings` (D14) — dokładnie przypadek, przed którym D14 ostrzega. Bez tej poprawki
    podniesienie poziomu na `critical` nie miałoby żadnego widocznego efektu w UI. Naprawione
    (`hasCritical` → 🔴), zweryfikowane zrzutem ekranu Playwrightem (krok 5 zaznaczony przed
    krokiem 2-4 → 🔴 "Zabronione").
  - `docs/rejestr-twardych-stopow.md` (Znane luki) i `docs/lista-do-zrobienia.md` (otwarte pytanie
    z 03.09.2026) oznaczone jako rozstrzygnięte, nie usunięte.
  - Zweryfikowane: `tsc`/`test` (510/510, w tym nowa asercja `level==="critical"`)/`lint`/`build`
    czyste.

- **2026-09-13 — Uzupełnienie praktyczne Modułu 11 (montaż 16S LiFePO4) dostarczone przez
  właściciela projektu i przeanalizowane wg GOD BOOK Część L (moduł Biblii → dokument gotowy do
  implementacji).** Zapisane w całości, niezmienione:
  `docs/zrodla/Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md` (5 tomów). Cel wprost od właściciela:
  "żeby było wiadomo na bazie czego było robione" — dokument to notatki z realnego montażu, nie
  formalna norma (status jak `materialy-branzowe-*`).
  - **Sprawdzone względem duplikatów (I.2)** — Ścieżka A LiFePO4 (A1-A10) jest już `done` w całości
    (10/10, `docs/rejestr-pokrycia.md`), więc każdy fragment nowego materiału porównany z
    odpowiednim istniejącym ekranem, nie potraktowany jako nowy, nieoceniony obszar.
  - **Pytanie właściciela wprost: czy dioda jest potrzebna przy BMS↔falownik? ODPOWIEDŹ z nowego
    materiału: NIE.** Rezystor pre-charge tak, dioda nie — dokładnie to, co kod już zakłada
    (`obwod-precharge` M4/E7, `podlaczenie-bms` M11/A4 — żaden nigdy nie miał diody w tym miejscu).
    **Ważne rozróżnienie, żeby nie pomylić z inną, niezależną "diodą" w projekcie**: to pytanie o
    diodę BMS↔falownik (blokada wstecznego prądu między równoległymi pakietami) jest CAŁKOWICIE
    INNYM tematem niż TD13 (`dlug-techniczny.md`, dopisane 07.09.2026) — dioda blokująca stringu PV
    wg normy HD 60364-7-712 §712.512.101 (M3/E22, `ochrona-stringow`). Dwie różne diody, dwa różne
    konteksty, żadnego związku poza nazwą.
  - **🔴 Sprzeczność znaleziona, NIE rozstrzygnięta samodzielnie (I.1)**: moment dokręcania
    terminala M6 — kod ma dziś 4-4,5 N·m (1:1 z oryginalnej Biblii v2.0, `moment-dokrecania-srub`
    M4/E11), nowy materiał praktyczny podaje 5-7 N·m zależnie od pojemności ogniwa (dla EVE MB31
    max 6 N·m). M8 zgodne w przybliżeniu. Zgłoszone w `docs/rejestr-pokrycia.md` (wiersz M4/E11),
    czeka na decyzję właściciela — który wzór ma obowiązywać (może zależeć od konkretnego ogniwa,
    więc rozwiązaniem może być rozszerzenie ekranu o wybór ogniwa, nie prosta podmiana liczby).
  - **Drobna rozbieżność, niekrytyczna**: sugerowana startowa wartość UI rezystora pre-charge
    (`PRZYKLADOWA_REZYSTANCJA_OHM=50` Ω) różni się 50× od "typowo 1 Ω" z nowego materiału — pole
    edytowalne, nie ukryty domyślny, więc nie blokuje niczego, ale wartości aż tak różne sugerują
    zależność od wielkości falownika/sposobu przełączania, niewyjaśnioną w żadnym źródle. Zgłoszone,
    nie zmienione.
  - **Genuinie nowa treść, dziś nigdzie niepokryta w kodzie** (kandydaci do rozbudowy A2/A3/A4,
    nie budowane w tej sesji — czysto dokumentacyjny krok na razie):
    - Etap 0: selekcja ogniw (OCV ≤10mV rozstępu, IR testerem AC 1kHz, odrzucenie odstających >20%
      od mediany) i top-balancing przedmontażowy (ogniwa równolegle, zasilacz 3,60V, do ±5mV) —
      kandydat do rozszerzenia A2 lub nowego ekranu przed A2.
    - Dobór busbarów (wymiary, elastyczne vs sztywne) i obalenie mitu "dziurka w środku busbara
      poprawia balansowanie" (rezystancja miedzi pomijalna, jedyna zaleta to wygoda serwisowa) —
      kandydat do A3.
    - Konfiguracja parametrów BMS po podłączeniu (OVP/UVP/napięcie float/próg balansowania,
      konkretne wartości LiFePO4) — dziś A4 kończy się na podłączeniu fizycznym, nie konfiguracji.
    - Tabele przekrojów przewodów (ogniwo↔BMS, BMS↔falownik wg prądu) i dobór złączy oczkowych
      (materiał — miedź cynowana vs mosiądz, wymiary, konkretni dostawcy) — dziś brak odpowiednika
      w Module 11 (M5/E1 `dobor-przekroju-kabla` to inny, ogólny silnik normowy, nie ten sam zakres
      praktyczny).
  - Nie zbudowano żadnego nowego kodu w tej sesji — czysto dokumentacyjny krok (zapisanie źródła +
    cross-referencja), zgodnie z zakresem prośby właściciela projektu. Decyzje o dalszym kroku
    (rozstrzygnięcie sprzeczności momentu, budowa nowej treści) czekają na właściciela.

- **2026-09-13 (kontynuacja) — Ekran A3b, Moduł 11: generator sekwencji montażu (busbary + BMS),
  parametryzowany liczbą ogniw (4S/8S/16S), z miejscem na media per krok.** Realizacja pierwszych
  dwóch pozycji z listy "nowa treść bez pokrycia" z poprzedniego wpisu — na wyraźną prośbę
  właściciela: *"trzeba opracować, żeby nasz poradnik dopasowywał się do 4S,8s,16s"* +
  *"poradnik musi prowadzić dokładnie krok po kroku z pokazaniem zdjęć albo nagrań"*.
  - `lib/core/modules/montaz-baterii/sekwencja-montazu/` — czyste, testowalne generatory
    (`generujPolaczeniaBusbarow`, `generujOkablowanieBms`) uogólniające wzorzec 16S ze źródła
    (2 rzędy, serpentyna) na dowolną parzystą liczbę ogniw. 14 testów, w tym dokładna weryfikacja
    16S względem numeracji źródła (połączenie #8 = przejście między rzędami, `Połączenie 8` w
    źródle — dokładnie się zgadza) — nie tylko własna, niezależna reimplementacja.
  - **Rozróżnienie 1:1 ze źródła vs. logiczne rozszerzenie**: dla 4S/8S/16S `assumptions` mówi
    "1:1 ze źródła"; dla innej parzystej liczby (np. 6S, 10S) — "nie 1:1 ze źródła", bo źródło
    opisuje wprost tylko te trzy wartości. Nieparzysta/za mała (<4)/za duża (>32) liczba ogniw →
    `OUT_OF_SCOPE`, układ dwurzędowy nie ma sensu albo źródło go nie potwierdza — nie zgadywane.
  - **Nowy komponent `components/wzorce/krok-z-media.tsx`** (`KrokZMedia`) — pierwszy w projekcie
    komponent z opcjonalnym slotem na zdjęcie/nagranie per krok. **Ważne: żadne prawdziwe
    zdjęcia/nagrania nie zostały dostarczone** — komponent renderuje jawny placeholder
    ("Miejsce na zdjęcie/nagranie tego kroku — do dodania") zamiast wymyślonego/wygenerowanego
    obrazu (zasada "nie wymyślaj brakujących danych" — to samo dotyczy materiału wizualnego z
    realnego montażu, nie tylko liczb). Gotowy na `media: {typ, url, opis}`, gdy właściciel dostarczy
    prawdziwe pliki — do ustalenia jak (upload, linki).
  - Zarejestrowany w `lib/pulpit/registry.ts` (Moduł 11, po A3). Zweryfikowane: `tsc`/`test`
    (524/524)/`lint`/`build` czyste; `pnpm start` + zrzuty ekranu Playwrightem (16S — 15 połączeń
    busbarów poprawnie ponumerowanych z placeholderami media; 4S — 3 połączenia + 5 przewodów BMS,
    poprawne napięcia 0/3,2/6,4/9,6/12,8V, werdykt 🟢 12,8V; niepoprawna liczba (7, nieparzysta) —
    🔴 z jasnym komunikatem) — wszystkie trzy stany wizualnie poprawne.
  - **Poza zakresem tej sesji (pozostałe punkty z listy "nowa treść"):** selekcja ogniw/
    top-balancing przedmontażowy, konfiguracja parametrów BMS (OVP/UVP/float), tabele przekrojów
    przewodów i złączy oczkowych — wciąż nie zbudowane, `docs/memory.md` (2026-09-13, wpis wyżej).

- **2026-09-13 (kontynuacja) — Sprzeczność momentu dokręcania M6 (M4/E11) rozstrzygnięta przez
  właściciela projektu — decyzja: "Moment dokręcania podamy do wyboru dla kilku popularnych ogniw
  i ich pojemności. Jeśli nie ma Twojego ogniwa, sprawdź w instrukcji producenta albo użyj
  bezpiecznego momentu."**
  - **Rozwiązanie nie wybiera jednej z dwóch sprzecznych wartości — zachowuje obie, poprawnie
    zakresowane** (zasada "nie usuwaj — oznacz", nie "nowsze wygrywa"): `TYPY_OGNIW` w
    `lib/core/modules/baterie/moment-dokrecania-srub/constants.ts`, 7 pozycji — oryginalne
    4–4,5 N·m z Biblii v2.0 jako opcja "pojemność nieznana" (nie usunięte), 4 nowe pozycje z
    `Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md` (50-150Ah→5-6, 280Ah/EVE LF280K→6-7,
    EVE MB31→maks.6, większe/M8→8-10), 2 fallbacki "Inne" (M6/M8) z bezpieczną najniższą wartością
    znaną w projekcie dla danego gwintu + dokładnie ta wiadomość, którą podał właściciel.
  - **Żaden inny model/producent nie został wymyślony** — tylko te 5 konkretnych pozycji, które
    faktycznie mają źródło w którymś z dwóch dokumentów. Ktoś z innym ogniwem dostaje "Inne" +
    instrukcję sprawdzenia karty katalogowej, nie zgadywaną liczbę.
  - Implementacja: UI dostał selektor typu ogniwa; wybór podmienia tylko wyświetlany tekst
    momentu dla pasującego gwintu (M6 albo M8) w istniejącym checkliście — id kroków, ich liczba
    i logika VALID/postęp bez zmian, więc 5 oryginalnych testów przeszło bez modyfikacji. 7 nowych
    testów dla katalogu/formatowania (`typy-ogniw.test.ts`).
  - Zweryfikowane: `tsc`/`test` (531/531)/`lint`/`build` czyste; zrzuty ekranu Playwrightem
    (280Ah/EVE LF280K → "6–7 N·m" na kroku M6; "Inne (M6)" → "maks. 4 N·m" + ostrzeżenie
    dokładnie z instrukcji właściciela) — oba stany wizualnie poprawne.

