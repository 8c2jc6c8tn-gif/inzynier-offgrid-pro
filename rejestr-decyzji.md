# Rejestr decyzji — Inżynier Offgrid Pro

**Wersja:** 1.18 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 28.09.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `docs/memory.md`, `USTALENIA.md` (historyczny, Część II)

TL;DR: D1, D2, D3… — decyzje **strategiczne/fundamentalne** (blokujące wiele innych rzeczy naraz, Krok 4 GOD BOOK), ponumerowane, nigdy nie kasowane, tylko unieważniane jawnie (F.5). **Nie duplikuje `docs/memory.md`**: tam żyje pełna, szczegółowa historia każdej sesji (setki drobnych decyzji implementacyjnych per ekran) — tu tylko decyzje, które zmieniły kierunek/regułę obowiązującą cały projekt. Gdy wpis niżej odsyła do `docs/memory.md`, tam jest pełne uzasadnienie i przykłady.

**Rozróżnienie od `docs/memory.md`:** ten rejestr = decyzje na poziomie "co obowiązuje odtąd w całym projekcie" (F.6: koszt cofnięcia zwykle średni/drogi). `docs/memory.md` = "co się wydarzyło w tej sesji, jaka lekcja" — każda pojedyncza implementacja ekranu, każdy znaleziony błąd. Jeśli szukasz konkretnego uzasadnienia formuły jednego ekranu — idź do `docs/memory.md` albo `docs/rejestr-pokrycia.md`, nie tutaj.

---

## Decyzje

**D1 (28.08.2026) — Rozdział 7 (Tryb Live) = 33 funkcje, nie 50 czy 3.** Koszt cofnięcia: średni (wpływa na metryczkę i rejestr pokrycia). Pierwotnie 50 (błąd "3" w scaleniu odrzucony), skorygowane 29.08.2026 programistycznie na 33 (numeracja 7.9–7.25 nie istnieje w źródle). Pełne uzasadnienie: `USTALENIA.md` D-1 (historyczny), `docs/memory.md`.

**D2 (28.08.2026) — Podział FREE/PRO.** Koszt cofnięcia: drogi (wpływa na architekturę uprawnień). FREE: 1 projekt, tryb prosty, kalkulatory awaryjne (Moduł 12). PRO: wiele projektów, Tryb Inżyniera, stress-test zimowy, tryb Live, eksport, AI. Pełne: `USTALENIA.md` D-2 (historyczny).

**D3 (28.08.2026) — Etap 1 (szkielet architektury) wstrzymany.** Koszt cofnięcia: tani (to pauza, nie decyzja architektoniczna). Autor projektował szkielet osobno.

**D4 (29.08.2026) — D-01 zamknięty: kanoniczna wersja Biblii źródłowej v2.0 (Architektura Modułowa), 579 funkcji (nie 540), zweryfikowane programistycznie z `Tresc_WSZYSTKIE_MODULY_scalone.md`, nie z deklaratywnej metryczki dokumentu.** Koszt cofnięcia: drogi (podstawa całego rejestru pokrycia). **UNIEWAŻNIA częściowo D1** w sensie: ta sama metoda weryfikacji (przeliczenie, nie metryczka) zastosowana też do Rozdziału 7.

**D5 (29.08.2026) — Etap 1 wznowiony, kod startuje.** Koszt cofnięcia: drogi (odblokowuje całą resztę pracy). Pauza z D3 zakończona, decyzja autora.

**D6 (29.08.2026) — Kolejność budowy: fundament → Moduł 1 → 2 → … → 13, czysta kolejność zależności danych.** Koszt cofnięcia: tani (to kolejność pracy, nie architektura). Pełna lista: `mapa-wdrozenia.md`.

**D7 (30.08.2026) — Roadmapa przepisana z numeracji "Rozdział" na "Moduł/Kafel" (pulpit adaptacyjny, 13+1 kafli).** Koszt cofnięcia: średni (dotyka nazewnictwa w wielu plikach). Mapowanie: `docs/pulpit-i-nawigacja.md` §2.

**D8 (30.08.2026) — Porzucono wyciąganie Modułu 12 do przodu "na wczesne demo".** Koszt cofnięcia: tani. Wraca do czystej kolejności zależności (D6).

**D9 (30.08.2026) — Kafel 14 (Ustawienia) dostaje własny, jawny punkt w planie budowy**, zamiast być domyślnie wliczonym w szkielet.

**D10 (29.08.2026) — Standard `docs/standards/` (17 rozdziałów) zaadaptowany z `new-app-standards`, integracja z GOD BOOK jako fundament poprzedzający.** Koszt cofnięcia: drogi (dotyczy całej rodziny aplikacji, nie tylko tego projektu). Pełne: `docs/memory.md`, sekcja na początku pliku.

**D11 (03.09.2026) — `docs/domena/` przemianowany na `docs/zrodla/`**, ujednolicenie nazewnictwa z GOD BOOK Część B.5. Koszt cofnięcia: tani (mechaniczna zmiana nazwy, 79 odwołań zaktualizowanych jednym commitem).

**D12 (2026-09-04, w toku sesji) — Wzorzec "echo": gdy dwa ekrany potrzebują tego samego wzoru, wzór ekstrahowany do jednej, eksportowanej funkcji, drugi ekran ją importuje, zamiast duplikować logikę.** Koszt cofnięcia: tani, ale wysoka wartość (`docs/standards/01-architektura.md` §1.3). Zastosowane w praktyce ≥4 razy: Pre-Charge (M4/M11), prąd zwarciowy (dobor-bezpiecznika-dc → detekcja-zwarcia-efuse), pojemność użyteczna (dobor-pojemnosci → dni-autonomii), koszt/kWh (oplacalnosc-magazynu → vehicle-to-home).

**D13 (2026-09-04) — Konwencja statusu: tylko ostrzeżenia poziomu `warning`/`critical` podnoszą status na `VALID_WITH_WARNINGS`; same ostrzeżenia `info` zostawiają status `VALID`.** Koszt cofnięcia: średni (dotyka każdego kalkulatora z ostrzeżeniami info-level, wielu ekranów). Znaleziona i naprawiona jako błąd we wcześniejszych ekranach (`oplacalnosc-magazynu`), potem stosowana konsekwentnie jako reguła. Pełne: `docs/memory.md`.

**D14 (2026-09-04) — Konwencja UI werdyktu: kolor (🟢/🟡/🔴) liczony z poziomów `result.warnings` (`hasCritical`/`hasWarning`), nie bezpośrednio z dwuwartościowego `Status` enum.** Koszt cofnięcia: średni. Bez tego `VALID_WITH_WARNINGS` nie rozróżnia krytycznego twardego stopu od zwykłego ostrzeżenia. Wzorzec ustalony w `dobor-bezpiecznika-dc` (M4/E24), stosowany od tego momentu we wszystkich ekranach z twardym stopem.

**D15 (2026-09-04) — Konwencja `number | null` dla pól, gdzie `0` jest legalną, realną wartością** (temperatury, SoC, nadwyżka PV), w odróżnieniu od zwykłej konwencji "`0` = jeszcze nie wpisano" dla pól zawsze dodatnich. Koszt cofnięcia: tani (lokalne dla typu inputu). Ustalone przy `chlodzenie-latem` (M4), stosowane konsekwentnie dalej (`profil-astronomiczny`, `load-shedding`, `modul-ev`, `stress-test-mppt`).

**D16 (2026-09-04) — Zasada "nie zgaduj wewnątrz podanego zakresu": gdy źródło podaje tylko zakres (np. "-0,3 do -0,45%/°C", "25-30°C") bez pojedynczej wartości, pole wymaga ręcznego wpisania z podpowiedzią o zakresie — nigdy nie przyjmujemy środka/granicy zakresu jako cichego domyślnego.** Koszt cofnięcia: tani, ale fundamentalne dla wiarygodności wyników. Zastosowane konsekwentnie: ΔT w `bojler-cwu`, γ w `wplyw-temperatury`, β w `stress-test-mppt`, Vmp w `niedopasowanie-paneli`.

**D17 (2026-09-04) — Moduł 4 i Moduł 2 uznane za "wyczerpane" po osiągnięciu odpowiednio 29/34 i 13/17 — reszta pozycji sprawdzona i odrzucona jako niebuildowalna bez wymyślania danych (baza komponentów, brakująca norma/wzór, dane historyczne niedostępne).** Decyzja o przejściu do pojedynczych ekranów Modułu 3 (nie pełnego wyliczenia per-funkcja) podjęta przez AI z potwierdzeniem właściciela projektu (moduł 2→4 przejście: pytanie wprost; moduł 4→3: kontynuacja bez pytania, w duchu "dawaj dalej"). Pełna lista blocked: `backlog-poza-v1.md`.

**D18 (2026-09-04) — Ekspertyza domenowa formalnie zadeklarowana** (elektryk/inżynier off-grid PV, senior/20 lat) — merytorycznie stosowana od początku sesji, deklaracja dopisana po pytaniu właściciela projektu, czy GOD BOOK §0.2 jest przestrzegane. Naprawa dryfu (Część Y.2 GOD BOOK), nie nowa decyzja treściowa. Pełne: `docs/memory.md` c.d. 67, `ZASADY_APLIKACJI.md` §0.1 (historyczny, treść zachowana).

**D19 (04.09.2026) — Migracja `ZASADY_APLIKACJI.md`/`USTALENIA.md` do kanonicznego formatu GOD BOOK (`00_Biblia.md` i pozostałe dokumenty Części S).** Koszt cofnięcia: średni (zmiana struktury plików, nie treści — wszystko zmapowane, nic nie usunięte). Decyzja właściciela projektu, wcześniej otwarta w `docs/lista-do-zrobienia.md` jako "czeka na właściciela" (patrz D17 tego rejestru — ta sama sesja). Stare pliki zostają, oznaczone jako historyczne (Część D GOD BOOK — nic nie usuwamy).

**D20 (07.09.2026) — Wzorzec "echo" (D12) wymaga wspólnego uzasadnienia fizycznego/normatywnego, nie tylko wspólnej wartości liczbowej — doprecyzowanie, nie unieważnienie D12.** Koszt cofnięcia: tani, ale wysoka wartość zapobiegawcza (dotyczy każdego przyszłego echo w projekcie). Znalezione przy audycie GOD BOOK Część N: `ochrona-stringow` (M3/E22) i `dobor-bezpiecznika-rozlacznika` (M5/E6) dzieliły funkcję `obliczPradBezpiecznikaA` przez ~2 dni, bo obie mnożyły przez współczynnik 1,25 — ale to były dwa niezależne prawa (margines Isc_STC→Isc_max wg Załącznika B.2 normy HD 60364-7-712 vs. ogólny margines doboru bezpiecznika obwodu), które tylko przypadkiem miały tę samą wartość. Gdy norma poprawiła pierwszy wzór (przedział `[1,1×I_SC_MAX, I_MOD_MAX_OCPR]` zamiast stałej `1,25×Isc`), echo trzeba było rozdzielić — M5/E6 dostał lokalną kopię formuły. Decyzja właściciela projektu, na wyraźną prośbę. Pełne: `docs/memory.md` (2026-09-07), `dlug-techniczny.md` TD13, `kontrakty-rdzenia.md` §4.

**D21 (23.09.2026) — Cykl sprawdzania Y.6 (`AKTUALIZACJE.md` w `new-app-standards`) w tym projekcie obniżony do ≤12h, świadome lokalne odstępstwo od domyślnego GOD BOOK Y.6 (≤3h od wersji 2.18).** Koszt cofnięcia: tani (jedna linia w `CLAUDE.md`, bez wpływu na kod). Na wyraźne polecenie właściciela projektu. **Nie jest to zmiana samego standardu** — `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_21.md` i `PROMPT_STARTOWY.md` (kategoria NIETYKALNE, mirror `new-app-standards`) nadal poprawnie mówią ≤3h i celowo nie zostały lokalnie zmienione (kolejna synchronizacja Y.6 i tak by je nadpisała z powrotem — lokalna edycja byłaby myląca, nie trwała). Realny powód praktyczny zaobserwowany kilka dni wcześniej: dwa kolejne sprawdzenia Y.6 w odstępie ~2 minut (20.09.2026) obie nie znalazły niczego nowego — cykl 3h przy wolno zmieniającym się `new-app-standards` generuje dużo zerowych sprawdzeń. Pełne: `docs/memory.md`. **Zastąpione przez D24 (24.09.2026) — patrz niżej.**

**D22 (23.09.2026) — Architektura Modułu 1, Ekrany 2–4 (Skaner działki, Analiza zacienienia, Bryła budynku): MapLibre GL + three.js/React Three Fiber + dane online ULDK (GUGiK) i PVGIS przez własny Route Handler (proxy), kolejność: najpierw czyste jądro obliczeniowe z testami, potem UI.** Koszt cofnięcia: średni (biblioteki UI ładowane leniwie tylko na tych ekranach; jądro niezależne od wyboru bibliotek). Decyzja właściciela projektu, zamyka sprawę otwartą 20.09.2026 ("Moduł 1 pominięty — czeka na osobną decyzję architektoniczną: jaka biblioteka mapowa/GPS", `docs/memory.md`). Wybrane z opcji przedstawionych przez AI: mapa MapLibre GL (zamiast Leaflet / własnego planu SVG), 3D three.js/R3F (zamiast samego MapLibre 3D / rzutu 2D), dane online ULDK+PVGIS (zamiast tylko PVGIS / nic online). Offline-first (standard 5.3) bez zmian: tryb "spacer GPS" i ręczne wprowadzanie działają bez sieci, dane online są dodatkiem i zapisywane lokalnie po pobraniu. Wzory: wyłącznie uznane, cytowalne modele (pozycja słońca NOAA/Meeus, model izotropowy Liu–Jordana, geometria analityczna) — przykładowe liczby ze źródła ("94%", "12%") nie są przepisywane jako fakty, tylko liczone modelem.

**D23 (24.09.2026) — ULDK (GUGiK) wołany bezpośrednio z przeglądarki, BEZ proxy — zmienia część D22 ("ULDK + PVGIS przez proxy"); PVGIS zostaje przez proxy.** Koszt cofnięcia: tani (adapter jest czystą funkcją z wstrzykiwanym `fetch` — przeniesienie za Route Handler to jeden plik). Decyzja właściciela projektu po przedstawieniu przez AI faktów sprawdzonych na żywo 24.09.2026: ULDK wysyła `Access-Control-Allow-Origin: *` (PVGIS nie — jego dokumentacja wprost zakazuje wywołań "via AJAX", więc tam proxy jest konieczne). Za: zero kosztu i pracy serwera, brak zależności od naszego hostingu. Przeciw (zaakceptowane): adres IP użytkownika trafia do GUGiK; wymagało poszerzenia CSP `connect-src` o `https://uldk.gugik.gov.pl` (jedyny zewnętrzny origin danych dopuszczony z nazwy, `middleware.ts`) — zweryfikowane w przeglądarce: ULDK przechodzi, bezpośredni PVGIS i inne originy nadal blokowane przez CSP.

**D24 (24.09.2026) — Cykl Y.6 zastąpiony formułą adaptacyjną (start 12h, ×1,5 do pułapu 48h po zerowym sprawdzeniu, reset do 12h po realnej zmianie); D21 (sztywne ≤12h) uchylone.** Koszt cofnięcia: tani (formuła w `CLAUDE.md` + logika Routine, bez wpływu na kod aplikacji). Na wyraźne polecenie właściciela projektu (skonfiguruj Y.6 z cyklem adaptacyjnym 12h→48h). **Kluczowa różnica względem D21: to już NIE jest lokalne odstępstwo od standardu.** Przy tym samym sprawdzeniu Y.6 (24.09.2026) okazało się, że `new-app-standards` niezależnie wprowadził dokładnie tę samą formułę jako nowy **domyślny** mechanizm GOD BOOK Y.6/U.4 (wersja 2.32, wiersz `AKTUALIZACJE.md` z 24.09.2026 — "Y.6/U.4 cykl adaptacyjny... zamyka retroaktywnie D21 inzynier-offgrid-pro"). Od D24 ten projekt jest więc zgodny z bieżącym standardem, nie odstaje od niego — `interwał_h` i licznik zerowych sprawdzeń żyją w `docs/memory.md` (sekcja "Synchronizacja ze standardem"), nie w tym pliku. Realizacja: samo-przeplanowująca się Routine (`create_trigger`/`update_trigger`, self-bind), `run_once_at` przeliczany po każdym odpaleniu. Pełne: `docs/memory.md` (24.09.2026, sprawdzenie Y.6 v2.21→v2.37). **Numeracja D22 była pierwotnie zajęta dwukrotnie przez dwie równoległe sesje (kolizja ID, dokładnie ten przypadek opisuje nowa GOD BOOK Część H.3, v2.37, wiersz `AKTUALIZACJE.md` 24.09.2026) — wpis o architekturze Modułu 1 (MapLibre/three.js) scalony do `main` jako pierwszy zachował D22/D23, ten wpis przenumerowany na D24 zgodnie z regułą H.3(c) "pierwszy scalony zachowuje numer".**

**[24.09.2026] DOPISEK do D24 — pełna synchronizacja Y.9 wykonana, propozycja NIETYKALNE/ADAPTOWALNE z tego wpisu nie czeka już na decyzję właściciela.** Powód: skorygowana Routine Y.6 (GOD BOOK v2.38, dopisek "[24.09.2026] ✅ KOREKTA" w Y.6 — Y.8 ma pierwszeństwo nad literalnym brzmieniem "Konsekwencja"; pytanie z góry o KAŻDĄ podmianę, w tym NIETYKALNE, było regresem). Zastosowano automatycznie, bez pytania: GOD BOOK `v2_21.md`→`v2_38.md` (pełny nadpis), 11 plików `docs/standards/` (00-INDEKS, 00-filozofia, 02, 03, 05, 07, 08, 10, 11, 15, 17), `PROMPT_STARTOWY.md`, `docs/przyklady/i18n/{README.md,check-i18n-guard.mjs}` — wszystko NIETYKALNE, pełny mirror `new-app-standards`. `CLAUDE.md` i `.claude/skills/standards/SKILL.md` (ADAPTOWALNE) — wskaźnik wersji GOD BOOK poprawiony na v2_38. `docs/przyklady/pwa/` świadomie NIE skopiowane — projekt nie ma jeszcze kodu PWA/Service Workera (Y.8, informacyjne do czasu faktycznej budowy). Szczegóły i checklista Y.9: `docs/memory.md`, sekcja "Synchronizacja ze standardem".

**D25 (25.09.2026) — M3/E4 „Symulacja liczby paneli”: zamiast 3 wariantów źródła (Minimum / Optymalnie / Z zapasem) — drabinka okresów pokrycia + limit montażowy.** Koszt cofnięcia: tani (ekran jeszcze niezbudowany). Decyzja właściciela projektu (rozmowa 25.09.2026). Treść: (1) okresy pokrycia: **lato (cze–sie) / mar–paź / lut–lis / cały rok** — dla każdego `N = ⌈max_{m∈okres}(E_zapotrz,m / E_panel,m)⌉`, z miesiącem decydującym wyznaczonym z danych PVGIS lokalizacji (nie założonym z góry; w Polsce zwykle grudzień, luty już wyraźnie lepszy — obserwacja właściciela). (2) **Limit montażowy** — pole użytkownika „ile paneli realnie zmieścisz/zamontujesz”, z jawnie oznaczoną podpowiedzią 30 szt. (praktyczny pułap wskazany przez właściciela projektu, nie wartość ze źródła ani normy). (3) **Rekomendacja „optymalna na cały rok”** = najszerszy okres, którego N mieści się w limicie; dla pozostałych miesięcy ekran pokazuje **deficyt energii [kWh/mies.] do pokrycia innym źródłem** (agregat — M2/E17, kocioł/ogrzewanie paliwowe — M6), zamiast proponować dziesiątki paneli. (4) Produkcja panelu z silnika M1/E4 (napromieniowanie) × moc panelu × **PR wpisany ręcznie** (źródło go nie podaje, Dyrektywa #1). **Otwarte:** czy zapotrzebowanie zimowe (ogrzewanie) wchodzi jako osobna wartość miesięczna — zależy od metrażu i źródła ciepła, patrz pomysł „ogrzewanie paliwowe typu webasto” w `docs/lista-do-zrobienia.md` (25.09.2026). **[25.09.2026] Rozstrzygnięte przez właściciela („tak ma być”):** osobne pole „dodatkowe zużycie w sezonie grzewczym [kWh/dzień]” + miesiące grzewcze wybierane przez użytkownika; metraż→ciepło czeka na PN-EN 12831-1.

**D26 (25.09.2026) — Stelaż naziemny z ręcznie regulowanym kątem pochylenia (zmiana kąta w ciągu roku) jako wspierany wariant montażu; stelaż PV w obliczeniach wiatru = wiata jednospadowa (PN-EN 1991-1-4, Tablica 7.6).** Koszt cofnięcia: tani (ekrany jeszcze niezbudowane). Decyzja właściciela projektu (rozmowa 25.09.2026). Konsekwencje: (1) M3/E1 (kąt i azymut) liczy dodatkowo **optymalny kąt dla każdego miesiąca** i zysk z przestawiania vs kąt stały — silnik M1/E4 (PVGIS TMY, Muneer), bez nowych współczynników; (2) M3/E2 dostaje tryb „stelaż regulowany (naziemny)” — poza 5 trybami źródła, świadome rozszerzenie; (3) **ograniczenie normy:** siła wiatru z Tablicy 7.6 tylko dla 0–30° oraz 90° (7.4.3, `cf = 1,80`) — dla ustawień 30–90° ekran pokazuje „brak danych normowych”, nie interpoluje (Dyrektywa #1); (4) założenie „stelaż = wiata” jawnie oznaczone w `assumptions`. Źródło danych: `docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md`.

**D27 (25.09.2026) — M3/E9 „Złoty środek”: rekomendowany kąt + wykresy i dowolny kąt do porównania, siła wiatru w % i w N, balast w kg z kosztem (domyślnie 1 zł/kg, edytowalne — wykonanie własne), porady: bloczki odlewane samodzielnie albo słupki kotwiczące w gruncie.** Koszt cofnięcia: tani (ekran niezbudowany). Decyzja właściciela projektu (rozmowa 25.09.2026), zamyka pytanie o wagi z 25.09.2026. Treść: (1) ekran pokazuje najlepszy kąt, a obok wykresy (produkcja, siła wiatru, śnieg) i możliwość sprawdzenia dowolnego innego kąta; (2) siła wiatru jako % względem wybranego odniesienia i w N — tor PN-EN 1991-1-4: `Fw = cscd·cf·qp(ze)·Aref`, `qp = ce(z)·qb` (Tablice NA.1, NA.3), `cf` z Tablicy 7.6 (stelaż = wiata, D26) — tylko 0–30° i 90°; (3) balast w kg z siły odrywającej, koszt = kg × cena, cena domyślna **1 zł/kg jako jawnie oznaczona podpowiedź właściciela projektu** (wykonanie własne, nie zakup), użytkownik wpisuje swoją; (4) ekran podpowiada alternatywy wykonania: bloczki balastowe odlewane samodzielnie oraz słupki kotwiczące w gruncie z mocowaniem stelaża do kotew. **Ograniczenia (do jawnego pokazania):** bez PN-EN 1990 balast to masa równoważąca samą siłę (`m = Fw/g`), bez współczynników bezpieczeństwa i bez przesuwu/wywracania — ekran musi to napisać wprost i skierować do konstruktora; nośność słupków kotwiczących zależy od gruntu — bez danych geotechnicznych tylko porada, bez obliczenia; kryterium „najlepszego kąta” = koszt balastu minus wartość energii w okresie analizy (cena kWh i liczba lat — pola użytkownika, bez domyślnych).

**D28 (25.09.2026) — M6: ekran „Porównanie kosztów ogrzewania” (funkcja źródła 5.39 / Biblia 6.27.13) rozszerzony o nagrzewnicę paliwową typu „webasto” i olej opałowy/napędowy; paliwa stałe (drewno, węgiel, pellet) i gaz jak w źródle.** Koszt cofnięcia: tani (ekran niezbudowany). Decyzja właściciela projektu (rozmowa 25.09.2026: „Moduł 6 z tym pomysłem na paliwo stałe i inne paliwa porównanie, to też rób”), zamyka pomysł „webasto” z `docs/lista-do-zrobienia.md`. Treść: (1) użytkownik dodaje źródła ciepła do porównania; koszt 1 kWh ciepła: paliwo `c / (WO × η)`, urządzenie z karty katalogowej (nagrzewnica) `c × zużycie [l/h] / moc [kW]`, prąd `c_el / COP` (grzałka/kocioł/IR: COP = 1); (2) **wartość opałowa, sprawność, ceny, COP, moc i zużycie z karty — wyłącznie wpis użytkownika** (źródło nie podaje wartości; Dyrektywa #1) — przykładowe stawki źródła „0,25 / 0,80 / 0,15 / 0,35 zł/kWh” to ilustracja; (3) zapotrzebowanie na ciepło w sezonie [kWh] — wpis użytkownika (M6/E2 niezbudowany, brak PN-EN 12831-1); (4) ranking kosztu całkowitego w okresie analizy (inwestycja + lata × (paliwo + serwis)), okres domyślny **10 lat ze źródła** (edytowalny), zwrot względem źródła najtańszego w zakupie; (5) off-grid: energia elektryczna potrzebna na sezon (urządzenia elektryczne w całości, paliwowe — pobór pomocniczy × godziny pracy przy mocy nominalnej, jawne założenie); (6) ostrzeżenia: paliwa stałe → ekran bezpieczeństwa M8/E2 (CO, odległości, nawiew); nagrzewnica typu webasto → spaliny/CO, urządzenie samochodowe w budynku mieszkalnym (konsultacja z kominiarzem), parafinizacja oleju napędowego na mrozie (źródło: „przy −20°C olej napędowy gęstnieje”, zalecenie paliwa arktycznego); drewno — cena nie obejmuje pracy (źródło: „ale praca”).


**D29 (26.09.2026) — Balast projektowy wg PN-EN 1990 (EQU) w M3/E9, M3/E2 i M3/E6 — zamyka ograniczenie D27 „bez PN-EN 1990”.** Koszt cofnięcia: tani (jedna funkcja wspólna `lib/core/modules/pv/eurokod-0/rownowaga.ts`). Polecenie właściciela projektu (26.09.2026: „balast projektowy wg PN-EN 1990 w ekranach M3 E9, E2 i E6”). Treść: (1) sprawdzenie równowagi statycznej EQU, wzór (6.7) `Ed,dst ≤ Ed,stb`, współczynniki z Tablicy A1.2(A) (zestaw A, wartości zalecane — załącznik krajowy NB „nie wprowadza zmian krajowych”): wiatr odrywający `γQ,1 = 1,50`, balast (stałe, korzystne) `γG,inf = 0,90` → `m = γQ·Fw / (γG,inf·g)` = 1,667 × dotychczasowe `Fw/g`; wartości zweryfikowane wizualnie z oryginałem PDF (notatka `docs/zrodla/norma-PN-EN-1990-eurokod-0/00-INDEKS.md`); (2) ciężar paneli i stelaża pominięty (byłby stabilizujący — po stronie bezpiecznej), cała siła jako pionowa (jak dotąd, D27); (3) **sprawdzane tylko oderwanie** — przesuw (współczynnik tarcia: 6.4.2 (2) dopuszcza warunek, nie daje wartości) i wywracanie (punkt przyłożenia siły) nieliczone, ostrzeżenie `warning` na każdym ekranie; (4) Załącznik A1 dotyczy budynków — zastosowanie do stelaża PV to praktyka inżynierska (jawne założenie, jak „stelaż = wiata” w D26); (5) M3/E6: balast z siły ekranu `F = 0,5ρv²ACd` (źródło), z informacją, że ma sens tylko dla szczytowej prędkości porywu (tor normowy — E2/E9), + opcjonalne pole „planowany balast” i twardy stop przy za małym balaście (źródło: lista twardych stopów Modułu 3, „niewystarczający balast/kotwienie względem naporu wiatru (Ekran 6)”). **Do potwierdzenia przez właściciela (✅🤖):** punkty (2) i (5) — pominięcie ciężaru własnego i balast w E6 z siły wzoru źródła.

**D30 (28.09.2026) — M7/E23 „Obciążenie dachu śniegiem”: 🟡 od 80% nośności dachu, 🔴 powyżej 100%.** Koszt cofnięcia: tani (stała `PROG_ZBLIZANIA_DO_NOSNOSCI` w `lib/core/modules/stress-test/obciazenie-dachu-sniegiem/constants.ts`). Decyzja właściciela projektu (runda pytań 3, 28.09.2026). Treść: próg 80% dotyczy obu porównań — obciążenia normowego i aktualnej warstwy śniegu; **80% to ustalenie tej aplikacji, nie wymóg normy** — tak opisane w kodzie i w tekstach ostrzeżeń.

**D31 (28.09.2026) — M7/E19 „Elektronika w mrozie”: przetwornica/falownik poniżej minimum temperatury pracy → 🔴 (jak BMS); nowy typ „regulator ładowania (MPPT/PWM)” → 🟡.** Koszt cofnięcia: tani (`TYPY_KRYTYCZNE` w `lib/core/modules/stress-test/elektronika-w-mrozie/constants.ts`). Decyzja właściciela projektu (runda 3, 28.09.2026). Uzasadnienie: wyłączony falownik = brak 230 V w całym domu; regulator przestaje ładować, ale nie odcina odbiorów.

**D32 (28.09.2026) — M7/E8 „Agregat w mrozie”: progi rozruchu z praktyki właściciela zamiast sprzecznych progów źródła (B: −20°C, C: −15°C).** Koszt cofnięcia: tani (stałe w `lib/core/modules/stress-test/agregat-w-mrozie/constants.ts`). Decyzja właściciela projektu (runda 3, 28.09.2026: „zwykły diesel może już nie wystartować przy plus 5 a przy zero już ryzyko bardzo duże… Diesel przy −10 … potrzebuje naładowanego akumulatora i świeżych świec… dodatki na zimę… przy benzynie odpowiedni olej na zimę, świeca zapłonowa”). Treść: (1) zwykły diesel ≤ +5°C → 🟡, ≤ 0°C → 🔴 (dodatek opóźniający parafinowanie / paliwo arktyczne); (2) każdy diesel ≤ −10°C → 🟡 akumulator rozruchowy i świece żarowe; (3) benzyna < 0°C → ℹ️ olej zimowy wg producenta, świeca zapłonowa; (4) liczy się temperatura w miejscu agregatu i paliwa (na zewnątrz / w budynku) — podpowiedź przy polu; (5) samo „paliwo + temperatura” daje już werdykt rozruchu (wcześniej INCOMPLETE). Progi to praktyka, nie norma — tak opisane w tekstach. **Do potwierdzenia przez właściciela (✅🤖):** poziomy (właściciel podał progi, poziomy 🟡/🔴/ℹ️ dobrane przez AI) i punkt (5). Lokalizacja nagrzewnicy typu webasto — osobno, M8/E1 / ekrany ogrzewania (`docs/lista-do-zrobienia.md`).

**D33 (28.09.2026) — M12/E11 „Zużycie per urządzenie”: baza przykładowych średnich mocy typowych urządzeń jako podpowiedź, nigdy wartość domyślna.** Koszt cofnięcia: tani (`lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/przykladowe-urzadzenia.ts`). Decyzja właściciela projektu (runda 3, 28.09.2026: „wpisać przykładowe średnie dane mocy dla typowych urządzeń… jako przykład dla laika, ale on musi wpisać swoje poprawne moce… wyszukać w internecie, ile jego model pobiera… wpisuje tylko raz i system zapamięta, więc warto poświęcić 10–15 minut”). Treść: lista przykładów (rozwijana) + podpowiedzi nazw; po wybraniu nazwy z listy ekran pokazuje „przykładowa średnia: ok. X W — to nie jest moc Twojego modelu”, ale pola mocy nie wypełnia; komunikat o jednorazowym wpisie i zapamiętaniu (zapis lokalny szkicu). Wartości to przykładowe średnie, nie dane katalogowe. **Do potwierdzenia przez właściciela (✅🤖):** lista urządzeń i wartości (16 pozycji w pliku).


**D34 (28.09.2026) — Chmurki „?” przy polach (standard 8.4): wariant B + bogaty opis działania kalkulatora.** Koszt cofnięcia: średni (treść na wszystkich ekranach). Decyzja właściciela projektu (wybór B w poprzedniej sesji, potwierdzony 28.09.2026: „muszą zawierać bogaty opis wyjaśniający jak i po co działa kalkulator, no i tak jak było podane w odpowiedzi B”). Treść: (1) każde pole liczbowe ma `?` z pełną nazwą, do czego służy, gdzie znaleźć wartość i typowym zakresem — zakresy wyłącznie ze źródeł/norm w repo, w braku — „zakres z karty katalogowej” (Dyrektywa #1, bez zgadywania); (2) chmurki wyjaśniają też, jak i po co działa kalkulator — bogato, językiem dla laika; (3) moduł po module, PR na moduł; warianty A (mechaniczne przepisanie `hint`) i C (A, potem B) odrzucone; (4) praca w osobnej sesji (`docs/lista-do-zrobienia.md`). Nowe ekrany od teraz od razu z chmurkami w tym standardzie.
**D35 (28.09.2026) — Nowy moduł M14 = ścieżka przejścia z sieci na off-grid; na pulpicie dwa duże kafle i dwa rozdziały: „Dom – sieć” (M14-D, grupy G) i „Firma – sieć” (M14-F, grupy C); w każdym najpierw część Sieć, potem jako opcja część Przejście.** Koszt cofnięcia: średni (nawigacja, pulpit, podział ekranów; kod jeszcze nie istnieje). Decyzje właściciela projektu z 28.09.2026, numery 1, 2, 3 i 7 w opracowaniu. Cytaty:
- „niektórzy jeszcze są podłączeni do sieci i chcą częściowo przejść do Offgrid… muszą mieć podgląd i porównanie”;
- „jak przejść na off grid, z kalkulatorami obliczeń, opłacalności, doboru magazynów energii, ilości PV… dokładnie informować, co i jak zrobić i jakie ryzyka niesie, także przy odłączeniu przyłącza”;
- „moduły opowiadają i liczą sieć, a dopiero potem jest opcja obliczenia dla przejścia Offgrid”.

Treść:
- (1) Rozdział nie jest samą porównywarką taryf. Najpierw pokazuje rachunek, taryfy, prosumenta i licznik, a potem daje wejście do scenariuszy A–D (TCO, echo M1–M8), ryzyk i procedury odłączenia.
- (2) Ekrany wspólne dla Domu i Firmy (ryzyka, procedura, przełącznik sieć/wyspa, test licznika) to w kodzie jeden ekran z parametrem segmentu (D12/D20).
- (3) Kreator „Ścieżka przejścia” ma 6 kroków i startuje z końca części Sieć.
- (4) Wynik nigdy nie jest jednym werdyktem „najlepszy”. Pokazuje osobno „najtańszy” i „najbardziej niezależny”, zawsze z informacją o odwracalności.

Kolejny numer modułu po M13 (zgodnie z Z1). Pełne: `03_M14_Dom_i_Firma_Siec.md`, opracowanie `docs/zrodla/Opracowanie_M14_Z_Sieci_Na_OffGrid_DRAFT.md`.

**D36 (28.09.2026) — Stawki rozliczeń energii to dane, nie stałe w kodzie. Plik JSON + Zod `rozliczenia-pl-2026`, każda stawka ma listę okresów ważności `{ odDnia, doDnia, wartosc }` i pola `zrodlo`/`stanNa`/`pewnosc`. Wartości domyślne pochodzą wyłącznie ze źródeł ✅. Tryb „moje dane z faktury” jest zawsze dostępny przy każdym polu stawki.** Koszt cofnięcia: średni (model danych M14; kod jeszcze nie istnieje). Decyzja właściciela projektu nr 4 (28.09.2026): „ty znajdziesz mi poprawne dane i je wpiszesz, a także zostawisz opcje dla wpisania swoich danych”.

Model z okresami ważności zamiast pary (rok, wartość) wynika z odczytu pierwotnego: stawka jakościowa zmieniła się w trakcie roku (0,0331 → 0,0332 zł/kWh od 1.02.2026).

Treść:
- (1) Rachunek roczny liczy się jako średnia ważona zużyciem z miesięcy. Przy braku danych miesięcznych bierze się stawkę obowiązującą najdłużej, z ostrzeżeniem.
- (2) Po `waznoscDo` pojawia się ostrzeżenie „stawki mogą być nieaktualne — sprawdź fakturę”.
- (3) Do czasu zamknięcia DANE-1 dla danego OSD kalkulator działa tylko w trybie „moje dane z faktury”. To pełnoprawny tryb, nie namiastka.
- (4) Liczby z dok. 2 (tabele stawek z innego narzędzia AI) nie wchodzą do danych (✏️ K11).

Pełne: `03_M14_Dom_i_Firma_Siec.md` §2, opracowanie §0, §2.3–2.4a, §9.

**D37 (28.09.2026) — FREE/PRO dla M14: na razie nie przypisujemy.** Koszt cofnięcia: tani. Decyzja właściciela projektu nr 6: „Free pro narazie nie ruszamy. Potem będziemy dzielić.” Ekrany M14 nie mają przypisania FREE/PRO, a podział wróci osobną decyzją. **Nie unieważnia D2**: D2 nadal obowiązuje dla modułów M1–M13, a M14 jest do tego czasu poza podziałem.

**D38 (28.09.2026) — M14: autokonsumpcja w trybie prostym liczona z profili zużycia, nie z samego wpisu %.** Koszt cofnięcia: tani. Decyzja właściciela projektu (P3 w opracowaniu: „Autokonsumpcja wybieram profile, to najlepiej”).

Treść:
- (1) Profil „typowy” pochodzi ze standardowych profili zużycia OSD (IRiESD) dla G11/C11. Do czasu odczytu (W4, 🔎B) profilu nie ma w kodzie.
- (2) Warianty („nikogo w dzień”, „praca zdalna”) wolno dodać tylko ze źródłem albo jako jawne przesunięcie profilu typowego, z opisem założenia.
- (3) Wpis ręczny % zostaje jako opcja „znam swoją autokonsumpcję”.
- (4) W trybie zaawansowanym używany jest profil z M2.

**D39 (28.09.2026) — M14: dwa kafle („Dom – sieć”, „Firma – sieć”) stoją na końcu domyślnej kolejności pulpitu, za kaflem 13; później preset onboardingu „Jestem podłączony do sieci” wysuwa je na początek.** Koszt cofnięcia: tani (kolejność kafli to konfiguracja pulpitu, kod M14 jeszcze nie istnieje). Decyzja właściciela projektu z 28.09.2026: „Zgadzam się” — na propozycję AI (wcześniej ✅🤖). „Kafel 14” pozostaje Ustawieniami (D9), więc kafle M14 nazywa się nazwą albo M14-D / M14-F. Pełne: `03_M14_Dom_i_Firma_Siec.md` („Miejsce w aplikacji”), `docs/pulpit-i-nawigacja.md`.

**D40 (28.09.2026) — M14 TCO: `N` = 15 lat (zakres 10–25), `r` = 0, `g` = 0 plus suwak −3 / 0 / +5 / +10%/rok plus trzecia opcja „Ścieżka UE” — dynamika cen energii z oficjalnej projekcji Komisji Europejskiej dla Polski.** Koszt cofnięcia: tani (dane plus jedna opcja wyboru, kod jeszcze nie istnieje). Decyzja właściciela projektu z 28.09.2026: „Tak. Ale weźmy jeszcze planowane ceny energii prognozowane na kolejne lata przez ue.”

Treść:
- (1) Źródło „Ścieżki UE”: KE DG ENER, *EU Reference Scenario 2020*, arkusz wyników, `PL_A`, „Average Price of Electricity in Final demand sectors (€'15/MWh)”, odczyt pierwotny ✅. Na 28.09.2026 to najnowsza opublikowana edycja.
- (2) Do obliczeń wchodzi tylko dynamika realna (ponad inflację), nie poziom w €/MWh. Wartość to średnia dla wszystkich odbiorców, a status podatków jest nieokreślony.
- (3) Ścieżka jest zawsze podpisana źródłem i datą i ma ostrzeżenie: założenia polityki z końca 2019 r., bez kryzysu cen 2021–2023, Fit for 55 i ETS2.
- (4) Domyślnie nadal `g` = 0: aplikacja sama cen nie prognozuje, a ścieżkę UE wybiera użytkownik.
- (5) `g` z suwaka ma to samo znaczenie (zmiana ponad inflację). Wynik przy `r` = 0 jest w dzisiejszych złotych.
- (6) Nowsza edycja projekcji KE podmienia dane (dane z okresem ważności, D36).

Pełne: `03_M14_Dom_i_Firma_Siec.md` („Kluczowe zasady i wzory”, TCO).

**D41 (28.09.2026) — M14 TCO: czwarta opcja cen energii „Ścieżka UE + inflacja” (ceny nominalne, kwoty do zapłaty). Rozszerza D40, niczego w nim nie unieważnia.** Koszt cofnięcia: tani (dane plus opcja, kod jeszcze nie istnieje). Decyzja właściciela projektu z 28.09.2026: „Musimy zrobić opcję liczenia wzrostu cen na te 15 lat zgodnie z planami ue i drugą opcją plany ue + średnioroczną inflacja.”

Treść:
- (1) Wzór Fisher: `(1+g_UE)·(1+π) − 1`, nie suma.
- (2) `π` do wyboru:
  - cel NBP 2,5% — Uchwała RPP nr 7/2025, M.P. 2025 poz. 1013, ✅. Jako domyślna to propozycja AI ✅🤖, do potwierdzenia; **[28.09.2026] rozstrzygnięte przez D43: domyślna jest średnia GUS 3,58%, NBP zostaje do wyboru;**
  - średnia GUS z 15 lat 3,58% (2011–2025, ✅ z danych pierwotnych);
  - własna wartość.
- (3) Przy inflacji rośnie o `π` każdy koszt bieżący (paliwo, serwis, wymiany), a nie tylko sieć.
- (4) Wynik pokazuje sumę nominalną i sumę w dzisiejszych złotych. Ranking scenariuszy idzie według złotych dzisiejszych, bo suma nominalna bez dyskonta faworyzuje duże inwestycje na starcie.
- (5) Nazewnictwo w UI: „ponad inflację” (UE) oraz „kwoty, które zapłacisz” (UE + inflacja). Nie używamy słowa „realny” dla ceny nominalnej.

Pełne: `03_M14_Dom_i_Firma_Siec.md` (TCO, „Ścieżka UE + inflacja”).

**D42 (28.09.2026) — M14: wybór ścieżki cen energii to jedno pole „Wzrost cen energii” w miejscu suwaka procentów (ekrany D7 i F8).** Koszt cofnięcia: tani (układ jednego pola, kod jeszcze nie istnieje). Decyzja właściciela projektu z 28.09.2026: „Myślę że musi być ten przełącznik akurat tam gdzie do wyboru jest pasek z procentami”.

Treść:
- (1) Przełącznik segmentowy: „Suwak %” (domyślny, 0) / „Plany UE” / „Plany UE + inflacja”.
- (2) Pod przełącznikiem, w tym samym miejscu, pojawia się odpowiednio:
  - suwak;
  - średnia %/rok ze źródłem i ostrzeżeniem;
  - to samo plus wybór inflacji (NBP / GUS / własna).
- (3) Każda zmiana od razu przelicza tabelę A–D.
- (4) Wyjaśnienia trafiają do chmurki „?” (D34).

Uzupełnia D40/D41, niczego nie unieważnia. Pełne: `03_M14_Dom_i_Firma_Siec.md` (TCO, „Gdzie użytkownik to wybiera”).

**D43 (28.09.2026) — M14: domyślna inflacja w opcji „Plany UE + inflacja” = średnia GUS z ostatnich 15 lat, 3,58%/rok (2011–2025, średnia geometryczna rocznych wskaźników CPI).** Koszt cofnięcia: tani (jedna wartość domyślna, kod jeszcze nie istnieje). Decyzja właściciela projektu z 28.09.2026: „Ja wybieram inflację GUS, ponieważ podawana inflacja jest i tak zaniżona i nie trzyma się kupy z prawdziwymi cenami.”

Treść:
- (1) Rozstrzyga otwarty punkt D41 (2): propozycja AI „cel NBP domyślny” (✅🤖) nie zostaje przyjęta.
- (2) Cel NBP 2,5% zostaje w przełączniku jako opcja, podobnie jak własna wartość.
- (3) Średnia jest przeliczana po publikacji przez GUS danych za kolejny rok (okres ważności wartości, D36).

Uwaga rewidenta, zapisana jako kontekst, a nie korekta decyzji: średnia GUS też jest wskaźnikiem CPI, tym samym co w celu NBP. Różnica bierze się z tego, że średnia z ostatnich 15 lat zawiera szok 2022–2023 (14,4% i 11,4%), a cel NBP to kotwica na przyszłość. Wybór GUS daje ostrożniejszy, czyli wyższy, szacunek przyszłych rachunków.

Pełne: `03_M14_Dom_i_Firma_Siec.md` (TCO, tabela źródeł `π`).

---

## Założenia robocze (F.7 GOD BOOK)

**Z1 (04.09.2026) — przyjęto:** ID modułów (H.2 GOD BOOK, M#) odpowiadają wprost numeracji "Moduł N" już używanej w całym projekcie (1–13), nie nowej, niezależnej numeracji. **Powód:** ta numeracja jest już stabilna, używana w kodzie, dokumentacji i UI od 29.08.2026 — wprowadzenie równoległej numeracji M# byłoby duplikatem, nie nowym bytem. **Na czym się opiera:** cała struktura `docs/rejestr-pokrycia.md`, `lib/pulpit/registry.ts`, `docs/pulpit-i-nawigacja.md`.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — D1–D19 zrekonstruowane z `USTALENIA.md` Część II, dziennika zmian `ZASADY_APLIKACJI.md`, oraz decyzji strategicznych z `docs/memory.md`. Z1 dodane. Wersja 1.0. |
| 07.09.2026 | Dodano D20 (echo wymaga wspólnego uzasadnienia, nie tylko wspólnej wartości) — na wyraźną prośbę właściciela projektu, po audycie GOD BOOK Część N. Wersja 1.0→1.1. |
| 23.09.2026 | Dodano D21 (cykl Y.6 obniżony lokalnie do ≤12h, GOD BOOK/PROMPT_STARTOWY.md bez zmian) — na wyraźne polecenie właściciela projektu. Wersja 1.1→1.2. |
| 23.09.2026 | Dodano D22 (architektura Modułu 1, Ekrany 2–4: MapLibre GL + three.js/R3F + ULDK/PVGIS przez proxy, najpierw jądro) — decyzja właściciela projektu. Wersja 1.2→1.3. |
| 24.09.2026 | Dodano D23 (ULDK bezpośrednio z przeglądarki, bez proxy — zmienia część D22; CSP `connect-src` + `https://uldk.gugik.gov.pl`) — decyzja właściciela projektu. Wersja 1.3→1.4. |
| 24.09.2026 | Dodano D24 (cykl Y.6 zastąpiony formułą adaptacyjną 12h→48h, zgodną z nowym domyślnym GOD BOOK Y.6/U.4 v2.32 — D21 uchylone, to już nie lokalne odstępstwo). Kolizja numeracji z D22 (przypadek H.3) — przenumerowane z pierwotnego D22 na D24, pierwszy scalony wpis zachował numer. Wersja 1.4→1.5. |
| 24.09.2026 | Dopisek do D24 — pełna synchronizacja Y.9 wykonana (skorygowana Routine Y.6, GOD BOOK v2.38 KOREKTA: Y.8 ma pierwszeństwo, NIETYKALNE/ADAPTOWALNE stosowane automatycznie). GOD BOOK → v2_38, 11 plików `docs/standards/`, `PROMPT_STARTOWY.md`, przykłady i18n nadpisane; `CLAUDE.md`/skill SKILL.md — wskaźnik wersji. Wersja 1.5→1.6. |
| 25.09.2026 | Dodano D25 (M3/E4: drabinka okresów pokrycia + limit montażowy + deficyt zimowy zamiast 3 wariantów źródła) — decyzja właściciela projektu. Wersja 1.6→1.7. |
| 25.09.2026 | Dodano D26 (stelaż naziemny z regulowanym kątem; stelaż = wiata jednospadowa wg PN-EN 1991-1-4 Tablica 7.6, zakres 0–30° + 90°) — decyzja właściciela projektu. Wersja 1.7→1.8. |
| 25.09.2026 | Dodano D27 (M3/E9: rekomendacja + wykresy + dowolny kąt, siła wiatru %/N, balast kg z ceną domyślną 1 zł/kg, porady wykonania; ograniczenie — brak PN-EN 1990). Wersja 1.8→1.9. |
| 25.09.2026 | Dodano D28 (M6: porównanie kosztów ogrzewania 5.39 + nagrzewnica typu webasto i olej; parametry paliw tylko wpis użytkownika) — decyzja właściciela projektu. Wersja 1.9→1.10. |
| 26.09.2026 | Dodano D29 (balast projektowy PN-EN 1990 EQU w M3/E9, E2, E6; twardy stop E6 „za mały balast”) — polecenie właściciela projektu. Wersja 1.10→1.11. |
| 28.09.2026 | Dodano D30 (E23 próg 80%), D31 (E19 falownik 🔴, regulator 🟡), D32 (E8 progi rozruchu diesla/benzyny), D33 (E11 przykładowe moce urządzeń) — decyzje właściciela projektu, runda 3. Wersja 1.11→1.12. |
| 28.09.2026 | Dodano D34 (chmurki „?” — wariant B + bogaty opis działania kalkulatora) — decyzja właściciela projektu. Wersja 1.12→1.13. |
| 28.09.2026 | Dodano D35 (M14: ścieżka przejścia sieć → off-grid, kafle „Dom – sieć” / „Firma – sieć”, najpierw Sieć, potem Przejście), D36 (stawki jako dane z okresami ważności + tryb „moje dane z faktury”), D37 (FREE/PRO dla M14 odłożone, D2 bez zmian), D38 (autokonsumpcja z profili) — integracja M14 do Biblii („Integruj teraz”). Wersja 1.13→1.14. |
| 28.09.2026 | Dodano D39 (pozycja kafli M14) i D40 (parametry TCO M14 plus „Ścieżka UE” z EU Reference Scenario 2020) — decyzje właściciela projektu. Wersja 1.14→1.15. |
| 28.09.2026 | Dodano D41 (M14 TCO: „Ścieżka UE + inflacja”, π z celu NBP albo średniej GUS) — decyzja właściciela projektu. Wersja 1.15→1.16. |
| 28.09.2026 | Dodano D42 (M14: przełącznik ścieżek cen w miejscu suwaka procentów) — decyzja właściciela projektu. Wersja 1.16→1.17. |
| 28.09.2026 | Dodano D43 (M14: domyślna inflacja = średnia GUS 15 lat 3,58%) — decyzja właściciela projektu. Wersja 1.17→1.18. |
