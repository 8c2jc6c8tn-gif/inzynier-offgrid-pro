# Rejestr pokrycia — Inżynier Offgrid Pro

Status implementacji każdej funkcji Biblii (579 funkcji, `ZASADY_APLIKACJI.md` §12, D-01 zamknięty).
Zasada: `docs/standards/14-proces-i-pamiec.md` (14.1) — statusy `todo / in-progress / done`,
mapowane po ID z Biblii. Zaczynamy od Modułu 2 (Zapotrzebowanie/Bilans obciążeń), zgodnie z
decyzją wznowienia Etapu 1 (`docs/memory.md`, 2026-08-29).

Nie usuwać wierszy przy zmianie statusu — aktualizować kolumnę Status i (jeśli istotne) dopisywać
notatkę, zgodnie z `docs/standards/15-wspolpraca-z-ai.md` (15.3, "nie usuwaj — oznacz").

## Moduł 2 — Zapotrzebowanie energetyczne (Bilans obciążeń)

| Ekran | ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|---|
| 1 | 1.1 | Systemy podtrzymania życia (Survival Core) | **done** | `lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/`, UI: `app/kalkulatory/systemy-podtrzymania-zycia/page.tsx`, 6 testów. "Ogrzewanie" bez domyślnej mocy — luka źródła, wymaga ręcznego wpisania (błąd 🔴, nie ciche zero). |
| 2 | 1.2 | Inteligentny bojler C.W.U. | todo | |
| 3 | 1.3, 1.4, 1.5 | Urządzenia zmienne + płyta indukcyjna + klasa energetyczna | todo | |
| 4 | 1.6 | Liczba domowników | **done** | `lib/core/modules/zapotrzebowanie/liczba-domownikow/`, UI: `app/kalkulatory/liczba-domownikow/page.tsx`, 5 testów. Liczy tylko dobowe C.W.U. (jedyny fragment z gotowym wzorem 1:1 ze źródła, 50–70 l/osobę/dobę) — Ekrany 2/3, które ta wartość ma docelowo zasilać, jeszcze nie istnieją. |
| 5 | 1.7, 1.16 | Profil dobowy + astronomiczny dzień/noc | todo | |
| 6 | 1.8 | Sezonowość i tryb wakacyjny | todo | |
| 7 | 1.9 | Dni autonomii | **done** | `lib/core/modules/zapotrzebowanie/dni-autonomii/`, UI: `app/kalkulatory/dni-autonomii/page.tsx`, 5 testów. Wartość główna to suwak 1/2/3/5/7 dni (1:1 ze źródła), docelowo auto-zasila Moduł 4/Ekran 1. Opcjonalny podgląd na żywo wpływu na wielkość magazynu — **wzorzec "echo"**: reużywa `obliczPojemnoscUzytecznaKwh` wyekstrahowanego z `lib/core/modules/baterie/dobor-pojemnosci/calculator.ts`, nie duplikuje wzoru. |
| 8 | 1.10, 1.11, 1.21 | Zaawansowane parametry obciążenia | **done** (częściowo) | `lib/core/modules/zapotrzebowanie/moc-pozorna-cosfi/`, UI: `app/kalkulatory/moc-pozorna-cosfi/page.tsx`, 5 testów. Zbudowany wyłącznie podpunkt 1 (dawne 1.10, moc pozorna `VA = P / cos φ`, domyślny cos φ=0,7 z silnikami 1:1 ze źródła). Podpunkty 2 (prądy rozruchowe, dawne 1.11) i 3 (współczynnik jednoczesności, dawne 1.21) NIE zbudowane — wymagają bazy komponentów (współczynniki rozruchu per typ urządzenia) lub statystycznego modelu jednoczesności, których źródło nie podaje jako konkretnych liczb. |
| 9 | 1.12 | Pobór własny falownika | **done** | `lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/`, UI: `app/kalkulatory/pobor-wlasny-falownika/page.tsx`, 4 testy. Wzór `E_doba = P_jałowy × 24 / 1000` 1:1 ze źródła — przykład źródła (45W → 1,08 kWh/dobę) zweryfikowany niezależnie i odtworzony dokładnie. |
| 10 | 1.13 | Sprawność inwertera przy niskim obciążeniu | todo | |
| 11 | 1.17 | Przetwornice DC/DC | **done** | `lib/core/modules/zapotrzebowanie/przetwornice-dcdc/`, UI: `app/kalkulatory/przetwornice-dcdc/page.tsx`, 4 testy. Wzór `P_realne = P_urządzenia / sprawność` 1:1 ze źródła — przykład źródła ("sprawność ~92% → traci 8%") zweryfikowany niezależnie: strata jako % mocy realnie pobranej wynosi dokładnie `1 - sprawność`, potwierdzone w Pythonie. |
| 12 | 1.20 | Macierz priorytetów odłączania (Smart Load Shedding) | todo | |
| 13 | 1.25 | Bufor na rozbudowę | **done** | `lib/core/modules/zapotrzebowanie/bufor-rozbudowe/`, UI: `app/kalkulatory/bufor-rozbudowe/page.tsx`, 5 testów. Wzór `E_z buforem = E_całkowite × (1 + bufor%)` 1:1 ze źródła — wartości suwaka (0/10/20/30%) literalnie ze źródła, tylko info-level ostrzeżenie (status zawsze VALID, nigdy VALID_WITH_WARNINGS). |
| 14 | 1.26 | Architektura 1-fazowa/3-fazowa | todo | |
| 15 | 1.27 | Kategorie specjalne (warsztat/gospodarstwo/oświetlenie terenowe) | todo | |
| **16** | **1.22, 1.23** | **Kalkulatory pomocnicze (W→A, Ah↔Wh, czas pracy)** | **done** | pierwszy pełny przykład end-to-end: `lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/` (input/calculator/validation/warnings/constants + 9 testów), UI: `app/kalkulatory/pomocnicze/page.tsx`. Zweryfikowane: testy, typecheck, lint, build, ręcznie w przeglądarce (3 stany werdyktu). |
| 17 | 1.19 / 2.19 | Agregat prądotwórczy — definicja i logika pracy | **done** | `lib/core/modules/zapotrzebowanie/agregat-pradotworczy/`, UI: `app/kalkulatory/agregat-pradotworczy/page.tsx`, 5 testów. **Domyka lukę 1.19** (patrz sekcja "Luka wykryta i udokumentowana" niżej — status zmieniony na rozwiązana, wpis zachowany, nie usunięty). Treść źródłowa z `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md` (linie 503-521, funkcja 2.19). Wzór (godziny pracy przy optymalnym obciążeniu 70-80%, zużycie paliwa, koszt) odtwarza dokładnie własny przykład źródła (deficyt 80 kWh, agregat 5 kW → 20h, 25l, 200 zł) — zweryfikowany niezależnie w Pythonie przed implementacją. Deficyt wpisywany wprost przez użytkownika (nie wyprowadzany automatycznie z Modułów 1/3 — ta integracja to osobny, nie rozpoczęty krok). |
| — | 1.24, 1.28–1.50 | Moduł zbiorczy: Wampiry energetyczne (24 funkcje) | todo | jeden ekran zbiorczy, treść w Biblii poza tym repo |

### Funkcje przeniesione (nie mają tu ekranu — implementować przy docelowym module)

| ID Biblii | Nazwa | Cel | Status |
|---|---|---|---|
| 1.14 | Cykle odszraniania pompy ciepła | → Moduł 6 (Ogrzewanie), scalone z 5.6+6.8 | todo (przy Module 6) |
| 1.15 | Grzałki BMS i samorozładowanie ogniw | → Moduł 4 (Baterie), scalone z 3.5+3.14 | todo (przy Module 4) |
| 1.18 | Degradacja i starzenie (aging factor) | zasila Moduł 3 Ekran 19 i Moduł 4 Ekran 6 jednocześnie, bez własnego ekranu | todo (przy Module 3/4) |

### Luka wykryta i udokumentowana

| ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|
| 1.19 | Agregat prądotwórczy — definicja i logika | ~~**luka**~~ **rozwiązana (2026-09-04)** | zaplanowana jako osobny ekran D w Module 2 (§20 Zasad UX), treść źródłowa gotowa w Biblii, nigdy nie przepisana do pliku treści modułu ani ujęta w sekcji "znane luki" pliku scalonego — patrz `docs/memory.md`. **Domknięta**: zaimplementowana jako Ekran 17, patrz wiersz wyżej w tabeli głównej i `docs/memory.md` (2026-09-04). Wpis zachowany zgodnie z zasadą "nie usuwaj — oznacz" (`docs/standards/15-wspolpraca-z-ai.md`, 15.3). |

## Moduł 1 — Lokalizacja (Geostruktura)

~~Brak pełnej treści źródłowej w tym repo~~ — **korekta 2026-08-29:** pełna treść (4 ekrany)
dotarła i jest w `docs/zrodla/Tresc_Modul_1_Lokalizacja_Ekrany.md`. ~~Implementacja wciąż nie
rozpoczęta~~ — **korekta 2026-08-30:** Ekran 1 zaimplementowany (żeby Kafel 1 na pulpicie miał
gdzie prowadzić), pozostałe 3 nadal `todo`.

| Ekran | ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|---|
| 1 | 0.1 | GPS i pobranie lokalizacji/klimatu | **done** | `lib/core/modules/lokalizacja/lokalizacja-i-klimat/`, UI: `app/kalkulatory/lokalizacja-i-klimat/page.tsx`, 6 testów. Tylko tryb offline (ręczne wpisanie) — integracja PVGIS/PVWatts poza zakresem, jawnie oznaczona jako `assumption`. |
| 2 | 0.2 | Skaner działki (online/offline) | todo | |
| 3 | 0.3 | Analiza zacienienia (horyzont cieni) | todo | |
| 4 | 0.4 | Bryła budynku i orientacja ścian | todo | |

## Moduł 11 — Montaż baterii

Treść źródłowa kompletna w `docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md`. Dwie ścieżki
chemii (LiFePO4, kwasowo-ołowiowa) ze wspólnym szkieletem UI. Ekran A7 był już zaimplementowany
(pokrycie pulpitu, 2026-08-30); Ekran A1 dodany 2026-09-03.

| Ekran | ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|---|
| A1 | 9.1, 9.8 | Weryfikacja kompletności + kontrola wstępna ogniw | **done** | `lib/core/modules/montaz-baterii/weryfikacja-ogniw/`, UI: `app/kalkulatory/weryfikacja-ogniw/page.tsx`, 8 testów. Dwa twarde stopy z kodu (nie tylko checklist): brak BMS z balancerem, różnica napięć ogniw >0,05V — obydwa liczone z tych samych danych, które user i tak wpisuje (bez osobnych checkboxów "czy sprawdziłeś"). |
| A2 | 9.2, 9.10 | Montaż mechaniczny + separacja ogniw | todo | |
| A3 | 9.3, 9.11 | Połączenia elektryczne + kolejność łączenia | **done** | `lib/core/modules/montaz-baterii/polaczenia-elektryczne/`, UI: `app/kalkulatory/polaczenia-elektryczne/page.tsx`, 4 testy. Ten sam wzorzec co Procedura Black Start (kolejność wymuszona). (2026-09-03) Dodano schemat SVG szeregu ogniw z ponumerowaną kolejnością łączenia (Wzorzec F, ten sam wzorzec co `trasy-kablowe`). |
| A4 | 9.4, 9.5, 9.12 | Podłączenie BMS (+ procedura pre-charge, Wzorzec D) | **done** | `lib/core/modules/montaz-baterii/podlaczenie-bms/`, UI: `app/kalkulatory/podlaczenie-bms/page.tsx`, 6 testów. Prawdziwy kalkulator: `T = 5 × R_pre × C` liczony niezależnie od checklisty (user potrzebuje liczby przed wykonaniem kroku), kolejność checklisty rządzi tylko werdyktem gotowości. (2026-09-03) Dodano schemat SVG podłączenia BMS (wtyczka balansująca → B− → P− przez pre-charge). (2026-09-04) Wzór pre-charge zrefaktoryzowany, żeby re-używać `lib/core/modules/baterie/obwod-precharge/calculator.ts` (Ekran 7, Moduł 4) zamiast duplikować — patrz ten wpis. |
| A5 | 9.6, 9.13 | Pierwsze uruchomienie + test balansowania | todo | |
| A6 | 9.7, 9.14, 9.15 | Demontaż — procedura, SoC, odłączanie BMS | **done** | `lib/core/modules/montaz-baterii/demontaz-pakietu/`, UI: `app/kalkulatory/demontaz-pakietu/page.tsx`, 6 testów. Napięcie na ogniwo liczone z pakietu (reużywa `OCZEKIWANA_LICZBA_OGNIW` z Ekranu A1) — jeśli pakiet wciąż naładowany (>3,2V/ogniwo), krytyczne ostrzeżenie natychmiast, niezależnie od checklisty. (2026-09-03) Dodano schemat SVG rozpinania szeregu ze znacznikiem startu (koniec o najwyższym potencjale). |
| A7 | 9.9 | Przygotowanie stanowiska i narzędzi | **done** | `lib/core/modules/montaz-baterii/przygotowanie-stanowiska/`, UI: `app/kalkulatory/przygotowanie-stanowiska/page.tsx`, 4 testy. |
| A8 | 9.16 | Ocena zużycia ogniwa po demontażu | **done** | `lib/core/modules/montaz-baterii/ocena-zuzycia/`, UI: `app/kalkulatory/ocena-zuzycia/page.tsx`, 4 testy. Ocena wizualna puchnięcia (ten sam wzorzec co checklist A1) wygrywa natychmiast; pozostałe 2 pomiary źródła (napięcie po 24h, rezystancja) bez progu liczbowego w źródle — checklist procesu, nie dane z walidacją. |
| A9 | 9.17 | Ratowanie głęboko rozładowanego ogniwa (Wzorzec D) | **done** | `lib/core/modules/montaz-baterii/ratowanie-ogniwa/`, UI: `app/kalkulatory/ratowanie-ogniwa/page.tsx`, 6 testów. Trzy strefy decyzyjne z pomiaru napięcia (0V / (0,1,5V] / >1,5V), dokładnie jak w źródle. `0` to prawidłowy, krytyczny wynik pomiaru — nie placeholder (`napiecieOgniwaV: number \| null`, inaczej niż w A1). |
| A10 | 9.18–9.20 | Przechowywanie / recykling / narzędzia diagnostyczne (Wzorzec C) | **done** | `lib/core/modules/montaz-baterii/przechowywanie-recykling/`, UI: `app/kalkulatory/przechowywanie-recykling/page.tsx`. Bez kalkulatora — czysta treść (3 akordeony: Przechowywanie / Recykling / Narzędzia diagnostyczne), ten sam wzorzec co `trasy-kablowe`/`czystosc-i-snieg`. Ostatni ekran Ścieżki A (10/10, z A2/A5 świadomie odłożonymi). |
| B1 | 10.1, 10.8 | Weryfikacja + kontrola wstępna (kwasowo-ołowiowa) | **done** | `lib/core/modules/montaz-baterii/weryfikacja-wstepna-olow/`, UI: `app/kalkulatory/weryfikacja-wstepna-olow/page.tsx`. Checklist bez wymuszonej kolejności, ten sam wzorzec co A1/A7. |
| B2 | 10.2, 10.11 | Montaż mechaniczny + mocowanie/wentylacja | **done** | `lib/core/modules/montaz-baterii/montaz-mechaniczny-olow/`, UI: `app/kalkulatory/montaz-mechaniczny-olow/page.tsx`. Twardy stop źródła: brak wentylacji przy akumulatorach kwasowych — ryzyko wybuchu wodoru (dopisane do `docs/rejestr-twardych-stopow.md`). |
| B3 | 10.3, 10.10 | Połączenia + czyszczenie biegunów | **done** | `lib/core/modules/montaz-baterii/polaczenia-czyszczenie-olow/`, UI: `app/kalkulatory/polaczenia-czyszczenie-olow/page.tsx`. (2026-09-03) Dodano schemat SVG szeregowo/równolegle (napięcie vs pojemność). |
| B4 | 10.4, 10.12 | Balansery zewnętrzne (Wzorzec D) | **done** | `lib/core/modules/montaz-baterii/balansery-zewnetrzne-olow/`, UI: `app/kalkulatory/balansery-zewnetrzne-olow/page.tsx`, 5 testów. Warunek liczbowy wyprowadzony ze źródła: balanser wymagany, gdy ≥2 akumulatory w szeregu (poniżej tego nie ma ryzyka rozjazdu napięciowego w szeregu). (2026-09-03) Dodano schemat SVG balansera podłączonego równolegle do każdego akumulatora. |
| B5 | 10.5 | Dobór kabli, bezpieczników i zabezpieczeń (Wzorzec D) | ⚠️ blocked | cross-ref: źródło wprost mówi "ten sam silnik co Moduł 5, Ekran 1" — ale ten ekran (dobór przekroju kabla wg obciążalności/spadku napięcia) jeszcze nie istnieje w kodzie (`docs/rejestr-pokrycia.md`, Moduł 5 ma tylko Ekran 19). Zgodnie z zasadą "nie wymyślaj brakujących norm" (CLAUDE.md) — nie budować równoległego, tymczasowego silnika. Czeka na Moduł 5 Ekran 1. |
| B6 | 10.6 | Pierwsze uruchomienie i testy | **done** | `lib/core/modules/montaz-baterii/uruchomienie-testy-olow/`, UI: `app/kalkulatory/uruchomienie-testy-olow/page.tsx`. |
| B7 | 10.7, 10.14, 10.15 | Demontaż — procedura, kolejność, zabezpieczenie | **done** | `lib/core/modules/montaz-baterii/demontaz-olow/`, UI: `app/kalkulatory/demontaz-olow/page.tsx`. Checklist z wymuszoną kolejnością (5 kroków), ten sam wzorzec co A3/A6. (2026-09-03) Dodano schemat SVG kolejności demontażu (minus systemowy → plus systemowy → szereg wewnętrzny). |
| B8 | 10.9 | Bezpieczeństwo pracy z kwasem | **done** | `lib/core/modules/montaz-baterii/bezpieczenstwo-kwas/`, UI: `app/kalkulatory/bezpieczenstwo-kwas/page.tsx`. Twardy stop źródła: praca bez okularów ochronnych przy akumulatorach z korkami (dopisane do `docs/rejestr-twardych-stopow.md`). |
| B9 | 10.13 | Test pojemności i gęstości elektrolitu (Wzorzec D) | **done** | `lib/core/modules/montaz-baterii/gestosc-elektrolitu/`, UI: `app/kalkulatory/gestosc-elektrolitu/page.tsx`, 6 testów. Trzy strefy z tabeli referencyjnej źródła (1,28=pełny/1,20=połowa/1,12=rozładowany), granice = same wartości referencyjne (ten sam wzorzec co próg 1,5V w A9). Przykład źródła (1,15 g/cm³ → "wymagane doładowanie") odtworzony dokładnie w teście. |
| B10 | 10.16 | Ocena zużycia — siarczanowanie | **done** | `lib/core/modules/montaz-baterii/ocena-zasiarczenia/`, UI: `app/kalkulatory/ocena-zasiarczenia/page.tsx`, 4 testy. W odróżnieniu od checklist procesu (A7/B1/B6/B8) — tu "niezaznaczone" = realnie nieobserwowany objaw, więc kalkulator ma pełną logikę werdyktu (≥1 objaw → ostrzeżenie z odesłaniem do B11). |
| B11 | 10.17 | Ratowanie zasiarczonego akumulatora | **done** | `lib/core/modules/montaz-baterii/ratowanie-zasiarczenia/`, UI: `app/kalkulatory/ratowanie-zasiarczenia/page.tsx`. **Odstępstwo od pierwotnej etykiety "Wzorzec D":** źródło nie podaje żadnego progu liczbowego ani gałęzi decyzyjnej — jedno stałe zalecenie (odsiarczanie), więc ekran zbudowany jako czysta treść (Wzorzec C), nie kalkulator D. |
| B12 | 10.18–10.20 | Przechowywanie / recykling / narzędzia | **done** | `lib/core/modules/montaz-baterii/przechowywanie-recykling-olow/`, UI: `app/kalkulatory/przechowywanie-recykling-olow/page.tsx`. Bez kalkulatora — czysta treść, ten sam wzorzec co A10. Dwa twarde stopy źródła (oba oznaczone 🔴 w źródle, w odróżnieniu od A10): rozładowany akumulator w mrozie (pęka obudowa), zakaz wylewania kwasu do kanalizacji — oba dopisane do `docs/rejestr-twardych-stopow.md`. **Ścieżka B niemal kompletna: 11/12 (B5 blocked).** |

## Moduł 4 — Magazyn energii / baterie

Treść źródłowa kompletna w `docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md` (34 ekrany). Pierwsze
pełne wyliczenie per-funkcja dla tego modułu (wcześniej tylko 3 reprezentatywne ekrany wzorców
B/D/E, patrz sekcja niżej) — zaczęte 2026-09-04 od Ekranu 1 (fundament doboru magazynu).

| Ekran | ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|---|
| 1 | 3.1 | Dobór pojemności baterii | **done** | `lib/core/modules/baterie/dobor-pojemnosci/`, UI: `app/kalkulatory/dobor-pojemnosci-baterii/page.tsx`, 7 testów. Wzór `C_uzyteczna = (E_dobowe × d_autonomii) / (η × DoD)` 1:1 ze źródła; przykład źródła (Sekcja C, 45 kWh) odtworzony dokładnie w teście, zweryfikowany niezależnie (Python, ułamek dokładny) przed implementacją. Bez bufora starzeniowego (Ekran 6 zbudowany 2026-09-04, ale oba ekrany wciąż niezależne — integracja to osobny krok, patrz wiersz Ekranu 6). Wzór wyekstrahowany do `obliczPojemnoscUzytecznaKwh` (2026-09-04) i reużyty jako "echo" w Moduł 2/Ekran 7 (Dni autonomii). |
| 2 | 3.2 | Sugestia napięcia systemowego (12/24/48V) | todo | |
| 3 | 3.3 | Symulacja czasu ładowania/rozładowania | todo | wymaga profilu produkcji PV (Moduł 3) i obciążenia (Moduł 2) — cross-modułowe |
| 4 | 3.4 | Moduł EV — ładowanie samochodu elektrycznego | todo | |
| 5 | 3.5, 3.14 | Grzałki BMS i ochrona przed mrozem | **done** | `lib/core/modules/baterie/grzalki-bms-mroz/`, UI: `app/kalkulatory/grzalki-bms-mroz/page.tsx`, 9 testów. Zbudowana wyłącznie druga warstwa silnika (dawne 3.14, drzewo decyzyjne "skąd brać prąd na grzanie", 1:1 ze źródła) — pierwsza warstwa (dawne 3.5, bilans dobowy grzania w kWh) NIE liczona: źródło podaje tylko dwa ilustracyjne przykłady liczbowe (0,5/0,6 kWh/dobę), bez wzoru wiążącego temperaturę/czas z energią — pokazane w UI jako informacja, nie wynik obliczenia. **Znaleziona i udokumentowana luka**: granica SoC=30% nie jest jednoznacznie rozstrzygnięta w źródle (">30%" i "<30%" jako osobne warunki) — `OUT_OF_SCOPE`, nie zgadywana strona; dopisana do `docs/rejestr-twardych-stopow.md`. Stan "grzanie wstrzymane" (mróz + brak PV + niski SoC) potraktowany jako twardy stop (BMS blokuje ładowanie). |
| 6 | 3.6 | Starzenie i degradacja ogniw (bufor projektowy) | **done** | `lib/core/modules/baterie/starzenie-degradacja/`, UI: `app/kalkulatory/starzenie-degradacja/page.tsx`, 6 testów. Model liniowy `C_początkowa = C_dziś / (1 − r×lata)` 1:1 ze źródła. Przykład źródła (45 kWh dziś, 10 lat, ~80% → 56 kWh) odtworzony dokładnie przy 2%/rok (dolna granica zakresu 2-3%), zweryfikowany niezależnie w Pythonie. Świadomie NIE zaokrąglono wyniku do "rozmiaru komercyjnego" (źródło: "zamów 60 kWh") — brak siatki rozmiarów w źródle, zwrócona dokładna liczba (56,25 kWh). Jeszcze nie spięty z Ekranem 1 (bufor starzeniowy) — oba ekrany mają dziś niezależne pola ręcznego wpisu, integracja to osobny krok. Cross-ref Moduł 3 Ekran 19 (1.18) — nie zbudowany. |
| 7 | 3.7 | Obwód Pre-Charge | **done** | `lib/core/modules/baterie/obwod-precharge/`, UI: `app/kalkulatory/obwod-precharge/page.tsx`, 8 testów. **Wzorzec "echo" zastosowany w praktyce** (`docs/standards/01-architektura.md`, 1.3): formuła `T = 5×R×C` jest tu kanoniczna, a `lib/core/modules/montaz-baterii/podlaczenie-bms/calculator.ts` (M11/A4) zrefaktoryzowany, żeby ją stąd importować (`obliczCzasPreChargeS`) zamiast duplikować — istniejące 6 testów M11/A4 przeszło bez zmian po refaktorze, zachowanie identyczne (zweryfikowane też w przeglądarce). |
| 8 | 3.8 | Symulacja "Słabego Ogniwa" (Cell Drift & Balancing) | **done** | `lib/core/modules/baterie/slabe-ogniwo/`, UI: `app/kalkulatory/slabe-ogniwo/page.tsx`, 5 testów. "Pojemność użyteczna pakietu = pojemność najsłabszego ogniwa" 1:1 ze źródła — wynik w Ah/%, nie kWh (napięcie ogniwa nie jest w Sekcji A). "Liczba ogniw w szeregu" świadomie nie stała się polem wzoru (nieużywana w tym prostym obliczeniu). Bez rekomendacji prądu balansera (przykład źródła "2A" jest ilustracyjny). |
| 9 | 3.9 | Detekcja zwarcia i e-Fuse | **done** | `lib/core/modules/baterie/detekcja-zwarcia-efuse/`, UI: `app/kalkulatory/detekcja-zwarcia-efuse/page.tsx`, 5 testów. **Wzorzec "echo" w praktyce**: prąd zwarciowy re-używa `obliczPradZwarciowyA` wyekstrahowanej z Ekranu 24 (Dobór bezpiecznika DC), zamiast duplikować wzór Ohma. Przykład źródła (48V/0,0096Ω → 5000A, poniżej 500A tranzystorów → wymagany e-Fuse) odtworzony dokładnie w teście. Twardy stop dopisany do rejestru. |
| 10 | 3.11 | Ochrona przed wilgocią i kondensacją | **done** | `lib/core/modules/baterie/ochrona-wilgoc/`, UI: `app/kalkulatory/ochrona-wilgoc/page.tsx`, 7 testów. Punkt rosy liczony standardowym wzorem meteorologicznym Magnusa-Tetensa (źródło każe go policzyć, ale nie podaje wprost) — zweryfikowany niezależnie w Pythonie, zgodny z zaokrągleniem przykładu źródła (-5°C/85%→-7°C). **Znaleziona i udokumentowana rozbieżność**: własny przykład Sekcji C źródła (obudowa -6°C przy punkcie rosy -7°C) jest fizycznie niespójny — przy poprawnej fizyce -6°C jest cieplejsze niż punkt rosy, więc nie powinno kondensować; silnik liczy poprawną zależność fizyczną, nie odtwarza dosłownie przykładu źródła. Twardy stop IP<55 w środowisku wilgotnym 1:1 ze źródła, dopisany do rejestru. |
| 11 | 3.12 | Moment dokręcania śrub (Torque Control) | **done** | `lib/core/modules/baterie/moment-dokrecania-srub/`, UI: `app/kalkulatory/moment-dokrecania-srub/page.tsx`, 5 testów. Wzorzec E reprezentatywny. |
| 12 | 3.13 | Ograniczenie prądu ładowania w mrozie (Cold C-Rate) | **done** | `lib/core/modules/baterie/cold-c-rate/`, UI: `app/kalkulatory/cold-c-rate/page.tsx`, 11 testów. Tabela 4 stref 1:1 ze źródła + jawnie oznaczona 5. strefa (5–10°C, `OUT_OF_SCOPE`) — źródło ma lukę w tym zakresie, nie interpolowano wymyślonej wartości. Twardy stop: ładowanie <-10°C całkowicie zablokowane (dopisane do `docs/rejestr-twardych-stopow.md`). Przykład źródła (-5°C, 280Ah → 28A) zweryfikowany niezależnie w Pythonie przed implementacją i odtworzony dokładnie w teście. |
| 13 | 3.15 | Algorytm końca ładowania (Tail Current / Absorption) | **done** | `lib/core/modules/baterie/koniec-ladowania/`, UI: `app/kalkulatory/koniec-ladowania/page.tsx`, 6 testów. Próg prądu końcowego `I_koncowy = próg_C × pojemność` 1:1 ze źródła — przykład źródła (280Ah × 0,05C = 14A) zweryfikowany niezależnie w Pythonie i odtworzony dokładnie w teście. Trzy fazy (CC/CV-końcówka/zakończone) — proste drzewo decyzyjne z tej samej Sekcji B. |
| 14 | 3.16, 3.33 | SoH (State of Health) — prognoza żywotności | **done** (częściowo) | `lib/core/modules/baterie/soh-per-ogniwo/`, UI: `app/kalkulatory/soh-per-ogniwo/page.tsx`, 5 testów. Zbudowana wyłącznie warstwa 2 (dawne 3.33, diagnostyka per ogniwo) — próg "wzrost rezystancji o 50%" 1:1 ze źródła, przykład Sekcji C (0,25→0,71mΩ = +184%, KRYTYCZNE) odtworzony dokładnie. Warstwa 1 (dawne 3.16, SoH ogólny metodą coulombowską) NIE zbudowana — wymaga ciągłego logowania historii cykli/temperatury/DoD z BMS w czasie, niemożliwe do policzenia z jednorazowych danych wejściowych bez wymyślenia modelu degradacji. Twardy stop dopisany do rejestru. |
| 15 | 3.17 | Cold Cranking Amps (zimny start dużych odbiorników) | **done** | `lib/core/modules/baterie/cold-cranking-amps/`, UI: `app/kalkulatory/cold-cranking-amps/page.tsx`, 5 testów. Wzór `V_sag = V_oc − I×R_wewn` 1:1 ze źródła (Sekcja B). **Rozbieżność udokumentowana**: Sekcja A nie wymienia V_oc jako pole wejściowe, mimo że wzór go wymaga — dodane jako realna, mierzalna wielkość, nie wymyślony współczynnik, z notatką w kodzie. Temperatura ogniw (też w Sekcji A) świadomie nie stała się osobnym polem obliczeniowym — nie wchodzi do wzoru, tylko pośrednio wpływa na już zmierzoną rezystancję wewnętrzną. |
| 16 | 3.18 | Tryb Long Term Storage (odstawienie na zimę) | **done** | `lib/core/modules/baterie/long-term-storage/`, UI: `app/kalkulatory/long-term-storage/page.tsx`, 9 testów. Wzorzec D z elementem E: dwie realne kontrole liczbowe (SoC docelowy vs zalecany zakres 50–60%, temperatura vs bezpieczne minimum -20°C) + checklist 2-punktowy (odłączenie, uśpienie BMS), kolejność checklisty nieistotna (źródło nie opisuje sekwencji, w odróżnieniu od M11/A4). **Sprawdzona wcześniejsza flaga "możliwy duplikat M11 A10/B12":** nie jest duplikatem — A10/B12 to Wzorzec C (czyste akordeony treści o przechowywaniu/recyklingu/narzędziach, bez kalkulatora), ten ekran to realny kalkulator SoC/temperatura, różny wzorzec i różna treść źródłowa. |
| 17 | 3.19 | Analiza Second-Life (baterie z EV) | **done** | `lib/core/modules/baterie/second-life/`, UI: `app/kalkulatory/second-life/page.tsx`, 7 testów. SoH szacowany z wieku LUB przebiegu (obie metody ze źródła, dolna granica zakresu rocznego 2%/rok jak w Ekranie 6) — obie metody niezależnie odtwarzają przykład źródła (10kWh/6000zł, SoH 72% → 833 zł/kWh) przy self-konsystentnych wartościach (14 lat lub 280 000 km); źródło nie podaje dokładnego wieku/przebiegu użytego w swoim przykładzie. |
| 18 | 3.20 | Łączenie równoległe różnych baterii (Mixing) | **done** | `lib/core/modules/baterie/mixing-rownolegle/`, UI: `app/kalkulatory/mixing-rownolegle/page.tsx`, 7 testów. Wzorzec D — dwa twarde stopy źródła (🔴): różnica napięć >0,2V (prąd wyrównawczy `ΔV/(R1+R2)`, 1:1 ze źródła), mieszanie różnych chemii bez izolacji — oba dopisane do `docs/rejestr-twardych-stopow.md`. Udział w prądzie obciążenia liczony dzielnikiem prądowym `R_druga/(R1+R2)` z tych samych dwóch rezystancji (konsekwencja prawa Ohma dla gałęzi równoległych, nie osobna wymyślona zależność). Wiek/SoH z Sekcji A świadomie nie stały się osobnym polem — nie wchodzą do żadnego wzoru, efekt praktyczny już ujęty w zmierzonej rezystancji wewnętrznej. |
| 19 | 3.21 | Vehicle-to-Home (V2H) | todo | |
| 20 | 3.22 | Komunikacja BMS — CAN/RS485/Modbus | **done** | `lib/core/modules/baterie/komunikacja-bms/`, UI: `app/kalkulatory/komunikacja-bms/page.tsx`, 4 testy. Sprawdzenie zgodności protokołów (prosta równość) 1:1 ze źródła, bez cennika konwerterów (przykład "ok. 150 zł" ze źródła jest ilustracyjny). Protokół "inny/nieznany" → `OUT_OF_SCOPE`, nie zgadywana zgodność. |
| 21 | 3.23 | Pozycjonowanie ogniw (kompresja/spuchnięcie) | **done** | `lib/core/modules/baterie/pozycjonowanie-ogniw/`, UI: `app/kalkulatory/pozycjonowanie-ogniw/page.tsx`, 7 testów. Docisk podawany wprost w kgf (nie moment), sprawdzony względem zakresu 300-400 kgf 1:1 ze źródła — bez przeliczenia docisk→moment (wymagałoby skoku gwintu/współczynnika tarcia, których źródło nie podaje, tylko jeden przykładowy wynik dla konkretnego M8). Twardy stop dopisany do rejestru. |
| 22 | 3.24 | Pobór własny BMS i tryb uśpienia | **done** | `lib/core/modules/baterie/pobor-wlasny-bms/`, UI: `app/kalkulatory/pobor-wlasny-bms/page.tsx`, 5 testów. Wzór `E_roczna = P×24×365/1000` 1:1 ze źródła. Przykład źródła (7W ciągle → 61 kWh/rok, deep sleep → 0,024 kWh/dobę) odtworzony dokładnie (druga wartość przy poborze uśpienia=1W, górna granica zakresu 0,5-1W), zweryfikowany niezależnie w Pythonie przed implementacją. |
| 23 | 3.25 | Analiza opłacalności magazynu (True Cost of Storage) | **done** | `lib/core/modules/baterie/oplacalnosc-magazynu/`, UI: `app/kalkulatory/oplacalnosc-magazynu/page.tsx`, 6 testów. Wzory 1:1 ze źródła: `energia_całkowita = pojemność × cykle × sprawność`, `koszt_za_kWh = cena / energia_całkowita`. Wchłania dawną funkcję 12.12 Modułu AI (duplikat wg źródła). Porównanie z kosztem alternatywy — pole opcjonalne, prosta różnica, bez wymyślonego wzoru na "liczbę cykli do zwrotu" (przykład źródła "zwraca się po 1200 cyklach" jest ilustracyjny). |
| 24 | 3.27 | Dobór bezpiecznika DC (AIC/Class T/NH) | **done** | `lib/core/modules/baterie/dobor-bezpiecznika-dc/`, UI: `app/kalkulatory/dobor-bezpiecznika-dc/page.tsx`, 6 testów. Wzorzec D reprezentatywny, twardy stop AIC. (2026-09-04) Wzór prądu zwarciowego wyekstrahowany do `obliczPradZwarciowyA` — re-używany przez Ekran 9 (Detekcja zwarcia i e-Fuse), wzorzec "echo". |
| 25 | 3.28, 3.38 | Szyny zbiorcze i połączenia międzypakietowe | ⚠️ blocked | Sekcja C daje tylko ilustracyjne przykłady (spadek prądu "20%", "40% vs 15%"), bez wzoru wiążącego długość/przekrój kabla z rozkładem prądu — ten sam rodzaj luki co M5/E1 i M11/B5 (brak tabeli/wzoru normatywnego). Nie budowany, żeby nie wymyślać zależności. |
| 26 | 3.29 | Topologia BMS (Common Port vs Separate Port) | **done** | `lib/core/modules/baterie/topologia-bms/`, UI: `app/kalkulatory/topologia-bms/page.tsx`, 5 testów. Wzorzec B (karty porównawcze) z wbudowanym prostym progiem z Sekcji C ("Common Port 100A, falownik 150A → wybierz Separate Port") — dokładnie odtworzony w teście. |
| 27 | 3.30 | Chłodzenie baterii latem | **done** | `lib/core/modules/baterie/chlodzenie-latem/`, UI: `app/kalkulatory/chlodzenie-latem/page.tsx`, 7 testów. Sprawdzenie temperatury ogniw względem dopuszczalnego zakresu pracy (15–35°C) 1:1 ze źródła. Świadomie NIE liczona wielkość przyspieszenia degradacji — przykład źródła ("+30%") jest ilustracyjny, brak wzoru wiążącego przekroczenie temperatury z wielkością przyspieszenia. |
| 28 | 3.31 | Kalibracja i dokładność SoC | **done** | `lib/core/modules/baterie/kalibracja-soc/`, UI: `app/kalkulatory/kalibracja-soc/page.tsx`, 6 testów. Jeden próg czasowy 1:1 ze źródła ("po ok. 2 tygodniach" → 14 dni) — bez wzoru na wielkość błędu SoC (przykład źródła "rozjechał się o 12%" jest ilustracyjny, źródło nie podaje wzoru wiążącego czas z tą wartością, więc nie liczony). |
| 29 | 3.32 | Detekcja doziemienia (Ground Fault & IMD) | **done** | `lib/core/modules/baterie/detekcja-doziemienia/`, UI: `app/kalkulatory/detekcja-doziemienia/page.tsx`, 4 testy. Sprawdzenie obecności zabezpieczenia (IMD lub różnicówka DC) 1:1 ze źródła — bez symulacji scenariusza przebicia (przykład Sekcji C jest opisowy, nie liczbowy). Twardy stop dopisany do rejestru. |
| 30 | 3.34 | Porównanie technologii magazynów | **done** | `lib/core/modules/baterie/porownanie-technologii/`, UI: `app/kalkulatory/porownanie-technologii-magazynow/page.tsx`, 5 testów. Wzorzec B reprezentatywny. |
| 31 | 3.35 | Napięcie odcięcia vs żywotność (DoD vs Voltage Cut-off) | todo | |
| 32 | 3.36 | Hierarchia ładowania (PV > Agregat > Sieć) | todo | |
| 33 | 3.37 | Symulacja miesiąca zachmurzenia (No-Sun Scenario) | todo | cross-ref Moduł 7 (Stress-test zimowy), wymaga danych historycznych z Modułu 1 |
| 34 | 3.39 | Matryca alarmów BMS i reakcje systemu | **done** | `lib/core/modules/baterie/matryca-alarmow-bms/`, UI: `app/kalkulatory/matryca-alarmow-bms/page.tsx`. Wzorzec C — tabela 7 alarmów→reakcji + przykładowy komunikat, 1:1 ze źródła, bez kalkulatora (ten sam kształt co M11 A10/B12). |

## Moduły 3–13 — wzorce UI reprezentatywne (przygotowanie pod v0)

**2026-08-29 — decyzja:** zamiast budować moduły 3–13 po kolei ekran-po-ekranie, wybrano po
jednym reprezentatywnym ekranie na każdy z 8 wzorców UI A–H (`docs/standards/08-ui-ux.md`, 8.2),
żeby zebrać je w jedną, spójną paczkę do przekazania v0/Vercel (ustalenie systemu projektowego
naraz, zamiast osobno per moduł). Treść źródłowa dla wszystkich 13 modułów jest już kompletna w
`docs/zrodla/`. Poniższe 8 ekranów jest w pełni zaimplementowane (domena + testy + UI,
zweryfikowane ręcznie w przeglądarce); **pozostałe ekrany tych modułów są nadal `todo`** — pełne
wyliczenie per-funkcja dla modułów 3, 4, 5, 8, 9 do dopisania w kolejnym przejściu, nie zgadywane
teraz. Moduły 6, 7, 10, 11, 12, 13 dostały dodatkowo (2026-08-30) po jednym ekranie każdy — patrz
tabela niżej — żeby każdy kafel pulpitu (`docs/pulpit-i-nawigacja.md`) prowadził do czegoś realnego,
nie ślepego zaułka.

| Wzorzec | Moduł / Ekran | ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|---|---|
| A — przełącznik trybu | Moduł 3 / Ekran 11 | 2.19–2.21 | Konfigurator stringów PV (szereg/równolegle/mieszany) | **done** | `lib/core/modules/pv/konfigurator-stringow/`, UI: `app/kalkulatory/konfigurator-stringow/page.tsx`, 8 testów. |
| B — karty porównawcze | Moduł 4 / Ekran 30 | 3.34 | Porównanie technologii magazynów (LiFePO4/AGM/GEL/Trakcyjna) | **done** | `lib/core/modules/baterie/porownanie-technologii/`, UI: `app/kalkulatory/porownanie-technologii-magazynow/page.tsx`, 5 testów. |
| C — akordeon/informacja | Moduł 3 / Ekran 24 | 2.16, 2.40, 2.44 | Czystość i śnieg na panelach | **done** | `lib/core/modules/pv/czystosc-i-snieg/`, UI: `app/kalkulatory/czystosc-i-snieg/page.tsx`, 12 testów. Zakres kąta 10–15° — luka źródła zgłoszona w kodzie (komunikat, nie cichy default). |
| D — Doradca (werdykt bezpieczeństwa) | Moduł 4 / Ekran 24 | 3.27 | Dobór bezpiecznika DC (AIC/Class T/NH) | **done** | `lib/core/modules/baterie/dobor-bezpiecznika-dc/`, UI: `app/kalkulatory/dobor-bezpiecznika-dc/page.tsx`, 6 testów. Jeden z najpoważniejszych twardych stopów źródła (AIC < prąd zwarciowy → 🔴). |
| E — checklist weryfikacyjna | Moduł 4 / Ekran 11 | 3.12 | Moment dokręcania śrub (Torque Control) | **done** | `lib/core/modules/baterie/moment-dokrecania-srub/`, UI: `app/kalkulatory/moment-dokrecania-srub/page.tsx`, 5 testów. Bez validation.ts/warnings.ts — checklist nie ma stanu nieprawidłowego do walidacji. |
| F — przewodnik z ilustracją | Moduł 5 / Ekran 19 | 4.22 | Trasy kablowe — prowadzenie i separacja | **done** | `lib/core/modules/okablowanie/trasy-kablowe/` (tylko `constants.ts`, brak kalkulatora — ekran bez pól wejściowych), UI: `app/kalkulatory/trasy-kablowe/page.tsx` z ilustracją SVG. Bez testów jednostkowych (brak logiki domenowej do testowania). |
| G — raport/podsumowanie | Moduł 8 / Ekran 11 | 12.57 | Autonomiczny audyt bezpieczeństwa pożarowego | **done** | `lib/core/modules/bezpieczenstwo/audyt-pozarowy/`, UI: `app/kalkulatory/audyt-pozarowy/page.tsx`, 5 testów. **Dane demonstracyjne** (`SAMPLE_AUDIT_ITEMS`) — docelowa wersja czerpie na żywo z Modułów 8/9/13, jawnie oznaczone w kodzie i UI. |
| H — katalog komponentów | Moduł 9 / Katalog 1 | — | Katalog czujników (dodawanie wielu instancji) | **done** | `lib/core/modules/esp32/katalog-czujnikow/`, UI: `app/kalkulatory/katalog-czujnikow/page.tsx`, 3 testy. Katalog 21 typów czujników 1:1 ze źródła. |

## Moduły 6, 7, 10, 11, 12, 13 — po jednym ekranie (pokrycie pulpitu, 2026-08-30)

**2026-08-30 — decyzja:** autor poprosił o pulpit adaptacyjny (`docs/pulpit-i-nawigacja.md`) do
przekazania razem z paczką dla v0, z wymogiem, żeby każdy z 13 kafli dało się kliknąć i trafić na
realny ekran, nie stronę pustą/404. Moduły 3, 4, 5, 8, 9 miały to już z wzorców A–H wyżej — poniższe
sześć dostało dodatkowo po jednym prostym, w pełni zweryfikowanym ekranie. Pozostałe ekrany tych
modułów nadal `todo` — pełne wyliczenie per-funkcja do zrobienia w kolejnym przejściu.

| Moduł | ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|---|
| 6 — Ogrzewanie | 5.5 | COP pompy ciepła w funkcji temperatury | **done** | `lib/core/modules/ogrzewanie/cop-pompy-ciepla/`, UI: `app/kalkulatory/cop-pompy-ciepla/page.tsx`, 6 testów. |
| 7 — Stress-test zimowy | 6.5 | Procedura Black Start (checklist, kolejność ma znaczenie) | **done** | `lib/core/modules/stress-test/procedura-black-start/`, UI: `app/kalkulatory/procedura-black-start/page.tsx`, 4 testy. |
| 10 — AI i prognozy | 12.1–12.5, 12.43 | Prognozy (raport) | **done** | `lib/core/modules/ai/prognozy/`, UI: `app/kalkulatory/prognozy/page.tsx`, 4 testy. Dane demonstracyjne (jak wzorzec G Modułu 8) — docelowo z silnika symulacji rocznej. |
| 11 — Montaż baterii | 9.9 | Przygotowanie stanowiska i narzędzi (checklist, ścieżka LiFePO4) | **done** | `lib/core/modules/montaz-baterii/przygotowanie-stanowiska/`, UI: `app/kalkulatory/przygotowanie-stanowiska/page.tsx`, 4 testy. |
| 12 — Kalkulator/mobilny | 8.1 | Tryb uproszczony — dobór akumulatora i odbiorników | **done** | `lib/core/modules/kalkulator-mobilny/tryb-uproszczony/`, UI: `app/kalkulatory/tryb-uproszczony/page.tsx`, 4 testy. |
| 13 — Tryb Live | 7.1 | Wejście w tryb Live (brama, bez telemetrii) | **done** | UI: `app/kalkulatory/tryb-live/page.tsx`, bez modułu domenowego (czysta bramka informacyjna, brak logiki do testowania) — jawnie pokazuje status "brak połączenia z telemetrią", nie fabrykuje danych live. |

## Pulpit i nawigacja (implementacja, 2026-08-30)

Zaimplementowana pierwsza wersja mechanizmu z `docs/pulpit-i-nawigacja.md`: `lib/pulpit/registry.ts`
(rejestr 13 kafli + Kafel 14), `lib/pulpit/storage.ts` (preferencje w `localStorage`, przez
`useSyncExternalStore` — bez efektu ubocznego w `useEffect`), `app/page.tsx` (pulpit — zastąpił
przestarzały `UstaleniaViewer`, usunięty jako martwy kod), `app/moduly/[id]/page.tsx` (lista
ekranów modułu), `app/ustawienia/page.tsx` (pokaż/ukryj/przenieś/przywróć domyślne). Uproszczenie
świadome: "Przenieś" to przyciski ↑/↓, nie przeciąganie (drag-and-drop) — ten sam efekt
funkcjonalny bez nowej zależności; realne przeciąganie można dodać później bez zmiany API stanu.

## Pozostałe moduły (6, 7, 10, 11, 12, 13 — reszta ekranów)

Poza jednym ekranem wyżej — nie rozpoczęte. Treść źródłowa kompletna w `docs/zrodla/`. Rejestr
zostanie rozszerzony o kolejne ekrany w miarę postępu prac, zgodnie z kolejnością z
`ZASADY_APLIKACJI.md` §14.
