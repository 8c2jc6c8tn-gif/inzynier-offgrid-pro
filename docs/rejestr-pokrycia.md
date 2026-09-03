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
| 7 | 1.9 | Dni autonomii | todo | |
| 8 | 1.10, 1.11, 1.21 | Zaawansowane parametry obciążenia | todo | |
| 9 | 1.12 | Pobór własny falownika | todo | |
| 10 | 1.13 | Sprawność inwertera przy niskim obciążeniu | todo | |
| 11 | 1.17 | Przetwornice DC/DC | todo | |
| 12 | 1.20 | Macierz priorytetów odłączania (Smart Load Shedding) | todo | |
| 13 | 1.25 | Bufor na rozbudowę | todo | |
| 14 | 1.26 | Architektura 1-fazowa/3-fazowa | todo | |
| 15 | 1.27 | Kategorie specjalne (warsztat/gospodarstwo/oświetlenie terenowe) | todo | |
| **16** | **1.22, 1.23** | **Kalkulatory pomocnicze (W→A, Ah↔Wh, czas pracy)** | **done** | pierwszy pełny przykład end-to-end: `lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/` (input/calculator/validation/warnings/constants + 9 testów), UI: `app/kalkulatory/pomocnicze/page.tsx`. Zweryfikowane: testy, typecheck, lint, build, ręcznie w przeglądarce (3 stany werdyktu). |
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
| 1.19 | Agregat prądotwórczy — definicja i logika | **luka** | zaplanowana jako osobny ekran D w Module 2 (§20 Zasad UX), treść źródłowa gotowa w Biblii, nigdy nie przepisana do pliku treści modułu ani ujęta w sekcji "znane luki" pliku scalonego — patrz `docs/memory.md`. Do dopisania przy domykaniu Modułu 2. |

## Moduł 1 — Lokalizacja (Geostruktura)

~~Brak pełnej treści źródłowej w tym repo~~ — **korekta 2026-08-29:** pełna treść (4 ekrany)
dotarła i jest w `docs/domena/Tresc_Modul_1_Lokalizacja_Ekrany.md`. ~~Implementacja wciąż nie
rozpoczęta~~ — **korekta 2026-08-30:** Ekran 1 zaimplementowany (żeby Kafel 1 na pulpicie miał
gdzie prowadzić), pozostałe 3 nadal `todo`.

| Ekran | ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|---|
| 1 | 0.1 | GPS i pobranie lokalizacji/klimatu | **done** | `lib/core/modules/lokalizacja/lokalizacja-i-klimat/`, UI: `app/kalkulatory/lokalizacja-i-klimat/page.tsx`, 6 testów. Tylko tryb offline (ręczne wpisanie) — integracja PVGIS/PVWatts poza zakresem, jawnie oznaczona jako `assumption`. |
| 2 | 0.2 | Skaner działki (online/offline) | todo | |
| 3 | 0.3 | Analiza zacienienia (horyzont cieni) | todo | |
| 4 | 0.4 | Bryła budynku i orientacja ścian | todo | |

## Moduł 11 — Montaż baterii

Treść źródłowa kompletna w `docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md`. Dwie ścieżki
chemii (LiFePO4, kwasowo-ołowiowa) ze wspólnym szkieletem UI. Ekran A7 był już zaimplementowany
(pokrycie pulpitu, 2026-08-30); Ekran A1 dodany 2026-09-03.

| Ekran | ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|---|
| A1 | 9.1, 9.8 | Weryfikacja kompletności + kontrola wstępna ogniw | **done** | `lib/core/modules/montaz-baterii/weryfikacja-ogniw/`, UI: `app/kalkulatory/weryfikacja-ogniw/page.tsx`, 8 testów. Dwa twarde stopy z kodu (nie tylko checklist): brak BMS z balancerem, różnica napięć ogniw >0,05V — obydwa liczone z tych samych danych, które user i tak wpisuje (bez osobnych checkboxów "czy sprawdziłeś"). |
| A2 | 9.2, 9.10 | Montaż mechaniczny + separacja ogniw | todo | |
| A3 | 9.3, 9.11 | Połączenia elektryczne + kolejność łączenia | **done** | `lib/core/modules/montaz-baterii/polaczenia-elektryczne/`, UI: `app/kalkulatory/polaczenia-elektryczne/page.tsx`, 4 testy. Ten sam wzorzec co Procedura Black Start (kolejność wymuszona). (2026-09-03) Dodano schemat SVG szeregu ogniw z ponumerowaną kolejnością łączenia (Wzorzec F, ten sam wzorzec co `trasy-kablowe`). |
| A4 | 9.4, 9.5, 9.12 | Podłączenie BMS (+ procedura pre-charge, Wzorzec D) | **done** | `lib/core/modules/montaz-baterii/podlaczenie-bms/`, UI: `app/kalkulatory/podlaczenie-bms/page.tsx`, 6 testów. Prawdziwy kalkulator: `T = 5 × R_pre × C` liczony niezależnie od checklisty (user potrzebuje liczby przed wykonaniem kroku), kolejność checklisty rządzi tylko werdyktem gotowości. (2026-09-03) Dodano schemat SVG podłączenia BMS (wtyczka balansująca → B− → P− przez pre-charge). |
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

## Moduły 3–13 — wzorce UI reprezentatywne (przygotowanie pod v0)

**2026-08-29 — decyzja:** zamiast budować moduły 3–13 po kolei ekran-po-ekranie, wybrano po
jednym reprezentatywnym ekranie na każdy z 8 wzorców UI A–H (`docs/standards/08-ui-ux.md`, 8.2),
żeby zebrać je w jedną, spójną paczkę do przekazania v0/Vercel (ustalenie systemu projektowego
naraz, zamiast osobno per moduł). Treść źródłowa dla wszystkich 13 modułów jest już kompletna w
`docs/domena/`. Poniższe 8 ekranów jest w pełni zaimplementowane (domena + testy + UI,
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

Poza jednym ekranem wyżej — nie rozpoczęte. Treść źródłowa kompletna w `docs/domena/`. Rejestr
zostanie rozszerzony o kolejne ekrany w miarę postępu prac, zgodnie z kolejnością z
`ZASADY_APLIKACJI.md` §14.
