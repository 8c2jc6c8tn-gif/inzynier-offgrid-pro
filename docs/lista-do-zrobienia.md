# docs/lista-do-zrobienia.md — Inżynier Offgrid Pro

Bieżąca, operacyjna lista zadań tego projektu. Format i zasada aktualizacji: `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_39.md`, Część B.6. Czytana **zaraz po `00_Biblia.md`**, na starcie każdej sesji (Część P.2) — żeby AI nie musiało eksplorować całego projektu od nowa, żeby wiedzieć, od czego zacząć.

**To nie to samo, co:**
- `backlog-poza-v1.md` — rzeczy świadomie odłożone poza zakres (decyzje o skali/fazowaniu produktu, zbierane przy audycie).
- `mapa-wdrozenia.md` — status per moduł (M#), granularny, podczas Wdrożenia.

Tu trafia bieżący stan pracy: co w trakcie, co zablokowane, co następne — aktualizowane na bieżąco, nie tylko przy audycie.

**Statusy:** 🔲 do zrobienia · 🔄 w trakcie · ✅ zrobione · ⏳ odłożone (z powodem) · ⚠️ zablokowane (czeka na decyzję/informację)

**Zasada aktualizacji:** nie usuwamy wpisów (Część D GOD BOOK). Zmiana statusu = dopisanie nowej daty i statusu obok starego, nie kasowanie.

---

> **▶ START NASTĘPNEJ SESJI (28.09.2026):** najpierw `docs/przekazanie-nastepnej-sesji.md` — kolejność pracy
> (decyzja 4 właściciela → zamknięcie N.3 → kod M14), jaki kod pisać i czego nie robić.
> **[29.09.2026]** Nieaktualne jako kolejność: decyzja 4 rozstrzygnięta (D50, D53), N.3 zamknięty, kod M14 zbudowany w
> całości. Stan i to, co zostało (dane zewnętrzne, 3 pytania do właściciela): sekcja „STAN NA TERAZ” w tym samym pliku.
> **[29.09.2026, po D54]** Aktualny indeks wszystkiego, co zostało: ostatni wpis tej listy „CO ZOSTAŁO DO ZROBIENIA —
> indeks po D54”. Brakujące normy i materiały: `docs/normy-brakujace.md`.

## Zadania

- ✅ (2026-09-03) Synchronizacja pakietu `new-app-standards`: rozdziały 00–16 odświeżone, dodano `docs/god-book/`, `PROMPT_STARTOWY.md`, ten plik i `docs/wklad-do-standardu.md`. Szczegóły: `docs/memory.md`, sekcja "Synchronizacja ze standardem".
- ✅ (2026-09-04) **Rozstrzygnięte: migracja do kanonicznego formatu GOD BOOK wykonana.** Właściciel projektu zdecydował migrować. Utworzono `00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`, `02_Dyrektywy_AI_Projektu.md`, `zlote-zasady.md`, `rejestr-decyzji.md` (D1–D19 + Z1), `slownik-pojec.md`, `wiedza-surowa.md`, `kontrakty-rdzenia.md`, `mapa-wdrozenia.md`, `backlog-poza-v1.md`, `dlug-techniczny.md` — komplet 14 pozycji Części S GOD BOOK (pozostałe 2 — `docs/zrodla/` i `docs/lista-do-zrobienia.md` — już istniały). `ZASADY_APLIKACJI.md`/`USTALENIA.md` oznaczone jako historyczne (nagłówek), treść zachowana, nic nie usunięte.
- ✅ (2026-09-04) **Część powyższej decyzji rozstrzygnięta: `docs/domena/` → `docs/zrodla/` (zmiana nazwy).** Właściciel projektu zdecydował ujednolicić nazewnictwo z GOD BOOK Część B.5 — folder pełnił tę rolę od początku, tylko pod inną nazwą. Wykonane: `git mv` + aktualizacja 79 odwołań w repo. Reszta decyzji (`ZASADY_APLIKACJI.md`/`USTALENIA.md` → `00_Biblia.md`/`01_Zasady_Pracy_i_Konwencje.md` itd.) wciąż **otwarta** — dotyczyła tylko `docs/zrodla/`, nie całej migracji do kanonicznego formatu. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-04) Sprawdzono `AKTUALIZACJE.md` w `new-app-standards` (GOD BOOK Y.6) — znaleziono i zsynchronizowano 2 nowe wersje (v2.4→v2.5): GOD BOOK podmieniony w całości, `PROMPT_STARTOWY.md` nadpisany, odsyłacze do wersji poprawione w `docs/standards/00-INDEKS.md`/`00-filozofia.md`/`CLAUDE.md`/`README.md`/`.claude/skills/standards/SKILL.md`. Pełny wynik checklisty Y.9 (9 pozycji): `docs/memory.md`.
- 🔲 Kontynuacja kafli pulpitu 08–14 (animowane ikony) — patrz artefakt roboczy "Off-Grid Tile Set" i `docs/memory.md`.
- 🔲 Kontynuacja Modułu 2 wg `docs/rejestr-pokrycia.md` (ekrany jeszcze nie zbudowane).
- ✅ (2026-09-03) Audyt zgodności apki ze standardem (17 rozdziałów) wykonany, 3 znalezione niezgodności naprawione: Reporter spięty w `lib/pulpit/storage.ts`/`lib/wyglad/storage.ts`/`lib/theme/storage.ts`, dodano `docs/rejestr-twardych-stopow.md` (04.3), doprecyzowano status `lib/adapters/storage-adapter.ts`. Szczegóły: `docs/memory.md`.
- ⏳ (2026-09-03) `StorageAdapter` (`lib/adapters/storage-adapter.ts`) zostaje bez implementacji (IndexedDB) do czasu pierwszej realnej funkcji zapisującej Seed projektu (np. "zapisz projekt") — budowanie jej teraz byłoby spekulacyjne, apka nie ma jeszcze żadnego stanu domenowego do trwałego zapisu.
- ⚠️ (2026-09-03) Do decyzji: `KROK-POZA-KOLEJNOSCIA` w procedurze Black Start (M7/E5) ma poziom `warning`, mimo że opisuje realne ryzyko uszkodzenia sprzętu przy złej kolejności rozruchu — czy podnieść do `critical`? Patrz `docs/rejestr-twardych-stopow.md`, sekcja "Znane luki".
- ✅ (2026-09-07) **Rozstrzygnięte: podniesiono do `critical`.** Decyzja właściciela projektu, po audycie GOD BOOK Część N. Dotyczy tylko M7/E5 (Black Start) — ten sam kod ostrzeżenia w kilku ekranach Modułu 11 świadomie NIEZMIENIONY (niezależne, nie-echo definicje). UI (`app/kalkulatory/procedura-black-start/page.tsx`) poprawiony, żeby werdykt liczył się z `warnings` (D14), nie bezpośrednio ze `Status` — bez tego podniesienie poziomu nie miałoby widocznego efektu. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-03) Ekran A1, Moduł 11 (Montaż baterii) — "Weryfikacja kompletności i kontrola wstępna ogniw" zaimplementowany. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-03) Ekran A3, Moduł 11 — "Połączenia elektryczne i kolejność łączenia" zaimplementowany (ten sam wzorzec co Procedura Black Start).
- ✅ (2026-09-03) Ekran A4, Moduł 11 — "Podłączenie BMS" (+ procedura pre-charge, realny wzór `T = 5×R_pre×C`) zaimplementowany.
- ✅ (2026-09-03) Ekran A6, Moduł 11 — "Demontaż pakietu" zaimplementowany (checklist z wymuszoną kolejnością + kontrola napięcia ogniwa <3,2V przed demontażem).
- ✅ (2026-09-03) Ekran A9, Moduł 11 — "Ratowanie głęboko rozładowanego ogniwa" zaimplementowany (Wzorzec D, 3 strefy decyzyjne z napięcia: 0V/niskie-niezerowe/bezpieczne).
- ✅ (2026-09-03) Ekran A8, Moduł 11 — "Ocena zużycia ogniwa po demontażu" zaimplementowany (ocena wizualna puchnięcia + checklist 3 pomiarów bez progu liczbowego w źródle).
- ✅ (2026-09-03) Ekran A10, Moduł 11 — "Przechowywanie / recykling / narzędzia diagnostyczne" (Wzorzec C) zaimplementowany. Bez kalkulatora — 3 akordeony treści 1:1 ze źródła.
- ✅ (2026-09-03) Ścieżka B (kwasowo-ołowiowa), Moduł 11 — 11/12 ekranów zaimplementowane w jednym przejściu: B1 (weryfikacja wstępna), B2 (montaż mechaniczny + wentylacja, twardy stop), B3 (połączenia + czyszczenie), B4 (balansery zewnętrzne, Wzorzec D, 5 testów), B6 (pierwsze uruchomienie), B7 (demontaż, checklist z kolejnością), B8 (bezpieczeństwo pracy z kwasem, twardy stop), B9 (gęstość elektrolitu, Wzorzec D, 3 strefy, 6 testów), B10 (ocena zasiarczenia, 4 testy), B11 (ratowanie zasiarczenia — treść, nie kalkulator, odstępstwo od pierwotnej etykiety "Wzorzec D"), B12 (przechowywanie/recykling, 2 twarde stopy). Szczegóły: `docs/memory.md`, `docs/rejestr-pokrycia.md`.
- ⚠️ (2026-09-03) **B5 (dobór kabli/bezpieczników, Ścieżka B) zablokowany, nie zbudowany.** Źródło każe użyć tego samego silnika co Moduł 5 Ekran 1 — ten ekran jeszcze nie istnieje w kodzie. Nie budowano tymczasowego silnika, żeby nie wymyślać norm obciążalności. Patrz `docs/rejestr-twardych-stopow.md`, sekcja "Znane luki".
- ⚠️ (2026-09-03) **Moduł 5, Ekran 1 (Dobór przekroju kabla) sprawdzony i również zablokowany** — ta sama przyczyna co B5: źródło odwołuje się do tabeli normatywnej PN-IEC 60364-5-52, której nie podaje w pełni (tylko 1 przykładowa wartość k1, 1 przykładowa wartość k2, nie kompletne tabele). Nie budowany, żeby nie wymyślać norm. Patrz `docs/rejestr-twardych-stopow.md`, sekcja "Znane luki".
- ✅ (2026-09-03) Ekran 4, Moduł 2 — "Liczba domowników" (Wzorzec D-lite) zaimplementowany. Liczy dobowe C.W.U. (50–70 l/osobę/dobę) — jedyny fragment źródła z gotowym wzorem niezależnym od jeszcze niezbudowanych Ekranów 2/3.
- ✅ (2026-09-03) **Rysunki/schematy dodane do ekranów montażu baterii, na wyraźną prośbę autora** ("w elektryce bez rysunków nie ma opcji"). Dotąd wszystkie ekrany Modułu 11 opisujące fizyczne łączenie miały tylko tekst. Dodano schematy SVG (Wzorzec F, ten sam styl co `trasy-kablowe`) do: A3 (kolejność łączenia szeregu ogniw), A4 (podłączenie BMS — wtyczka balansująca/B−/P− przez pre-charge), A6 (kolejność demontażu, koniec o najwyższym potencjale), B3 (szeregowo vs równolegle), B4 (balanser równoległy na każdy akumulator), B7 (kolejność demontażu kwasowego). Szczegóły: `docs/memory.md`.
- ✅ (2026-09-04) Ekran 1, Moduł 4 (Baterie) — "Dobór pojemności baterii" (Wzorzec D) zaimplementowany, pierwszy ekran tego modułu poza wzorcami reprezentatywnymi B/D/E. Pełne wyliczenie per-funkcja dla Modułu 4 (34 ekrany) dopisane do `docs/rejestr-pokrycia.md`. Wzór zweryfikowany dwukrotnie niezależnie od implementacji (Python + ułamek dokładny) przed napisaniem kodu, przykład źródła odtworzony dokładnie w teście.
- ✅ (2026-09-04) Ekran 7, Moduł 4 (Baterie) — "Obwód Pre-Charge" zaimplementowany, **i wzorzec "echo" zastosowany w praktyce**: `podlaczenie-bms` (M11/A4) zrefaktoryzowany, żeby re-używać stąd formułę `T=5×R×C`, zamiast duplikować ją (miał ją jako pierwszy, chronologicznie). Istniejące testy M11/A4 przeszły bez zmian po refaktorze — zachowanie identyczne, zweryfikowane też w przeglądarce (dwa ekrany, ten sam wynik 0,55s dla tych samych danych).
- ✅ (2026-09-04) Ekran 12, Moduł 4 (Baterie) — "Ograniczenie prądu ładowania w mrozie (Cold C-Rate)" zaimplementowany. Twardy stop <-10°C (całkowita blokada) dopisany do rejestru. **Znaleziona i udokumentowana luka w źródle**: tabela limitów nie definiuje zakresu 5–10°C — kalkulator zwraca `OUT_OF_SCOPE` zamiast zgadywać wartość pośrednią. Przykład źródła (-5°C, 280Ah → 28A) zweryfikowany niezależnie przed implementacją.
- ✅ (2026-09-04) Ekran 15, Moduł 4 (Baterie) — "Cold Cranking Amps" zaimplementowany. Wzór `V_sag = V_oc − I×R_wewn` — znaleziona i udokumentowana rozbieżność: Sekcja A źródła nie wymienia V_oc jako pola wejściowego, mimo że wzór go wymaga (dodane transparentnie, nie ukryte).
- ⚠️ (2026-09-04) Ekran 2, Moduł 4 (Sugestia napięcia systemowego) sprawdzony — **częściowo zablokowany**, nie w całości. Rekomendacja napięcia (>3000W→48V, <1000W→12V) jest obliczalna wprost z podanych progów, bez potrzeby tabeli normatywnej. Ale zakres 1000–3000W nie jest zdefiniowany (kolejna luka w tabeli źródła, jak w Ekranie 12), a porównanie przekrojów kabli w Sekcji B/C wymaga tej samej brakującej tabeli PN-IEC 60364-5-52 co M5/E1 i B5. Nie budowany teraz — wymaga decyzji, czy budować okrojoną wersję (sama rekomendacja napięcia, bez porównania kabli) czy czekać na pełne dane.
  ✅ **(19.09.2026) OBIE CZĘŚCI JUŻ ROZSTRZYGNIĘTE — dryf dokumentacji, nie realna luka.** Zakres
  1000–3000W: rekomendacja 24V "dopowiedziana logicznie" (`PROG_12V_MAX_W`/`PROG_48V_MIN_W`,
  `constants.ts`), jawnie oznaczona osobną assumption `NAPIECIE-SYSTEMOWE-PASMO-24V-DOPOWIEDZIANE`
  — zdecydowane już 2026-09-04, patrz wpis tego dnia niżej ("Ekran 2, Moduł 4 — Sugestia napięcia
  systemowego zaimplementowany"). Porównanie kabli: norma PN-HD 60364-5-52 pozyskana 05-06.09.2026,
  Etap C dobudowany 13-14.09.2026 (echo `dobor-przekroju-kabla`). Ten wpis po prostu nigdy nie
  dostał domykającego dopisku — znalezione przy próbie realizacji tego punktu z listy sześciu
  pytań (19.09.2026), bez zmian w kodzie.
- ✅ (2026-09-04) Ekran 6, Moduł 4 (Baterie) — "Starzenie i degradacja ogniw" zaimplementowany. Model liniowy 1:1 ze źródła, przykład (45 kWh → 56 kWh po 10 latach) odtworzony dokładnie przy 2%/rok. Świadomie nie zaokrąglono wyniku do "rozmiaru komercyjnego" (60 kWh w źródle) — brak siatki rozmiarów w danych źródłowych.
- ⚠️ (2026-09-04) Ekran 1 i Ekran 6 (Moduł 4) liczą pokrewne wielkości (pojemność użyteczna dziś / bufor starzeniowy), ale **nie są ze sobą spięte** — każdy ma dziś niezależne pole ręcznego wpisu. Integracja (auto-przekazanie wyniku Ekranu 1 do Ekranu 6, potem powrót z buforem do finalnej rekomendacji) to osobny krok, wymaga wspólnego stanu wejściowego między ekranami (`docs/standards/01-architektura.md`, koncepcja "Mój sprzęt"/profil wejściowy) — nie rozstrzygnięte teraz.
  ✅ **(19.09.2026) ROZSTRZYGNIĘTE i ZREALIZOWANE** — `lib/profil-sprzetu/` (zakres: bateria).
  Szczegóły: `docs/memory.md`, `docs/rejestr-pokrycia.md` (wiersze Ekran 1/Ekran 6, Moduł 4).
- ✅ (2026-09-04) Ekran 22, Moduł 4 (Baterie) — "Pobór własny BMS i tryb uśpienia" zaimplementowany. Wzór `E_roczna = P×24×365/1000`, przykład źródła (7W → 61 kWh/rok, deep sleep → 0,024 kWh/dobę) odtworzony dokładnie, zweryfikowany niezależnie w Pythonie przed implementacją.
- ✅ (2026-09-04) Ekran 28, Moduł 4 (Baterie) — "Kalibracja i dokładność SoC" zaimplementowany. Jeden próg czasowy ze źródła (14 dni), bez wymyślonego wzoru na wielkość błędu SoC.
- ✅ (2026-09-04) Ekran 16, Moduł 4 (Baterie) — "Tryb Long Term Storage (odstawienie na zimę)" zaimplementowany. Wzorzec D z elementem E: SoC docelowy vs zalecany zakres 50–60%, temperatura vs bezpieczne minimum -20°C, checklist 2-punktowy. Sprawdzona wcześniejsza flaga z rejestru pokrycia ("możliwy duplikat M11 A10/B12") — rozstrzygnięta jako NIE duplikat: A10/B12 to czysta treść (Wzorzec C, bez kalkulatora) o przechowywaniu/recyklingu, ten ekran to realny kalkulator dwóch progów liczbowych.
- ✅ (2026-09-04) Ekran 18, Moduł 4 (Baterie) — "Łączenie równoległe różnych baterii (Mixing)" zaimplementowany. Prąd wyrównawczy `ΔV/(R1+R2)` 1:1 ze źródła, plus udział w prądzie obciążenia (dzielnik prądowy z tych samych dwóch rezystancji — konsekwencja prawa Ohma, nie nowy wymyślony wzór). Dwa twarde stopy 🔴 ze źródła (różnica napięć >0,2V, mieszanie chemii bez izolacji) dopisane do rejestru. **Naprawiona usterka podczas budowy**: pierwsza wersja UI mapowała oba twarde stopy na żółte "Dopuszczalne" zamiast czerwone "Zabronione" (patrzyła tylko na `CalcResult.status`, nie na `warning.level`) — poprawione wg wzorca z `dobor-bezpiecznika-dc` (poziom krytyczny → zawsze czerwony werdykt, niezależnie od statusu), zweryfikowane ponownie w Playwright.
- ✅ (2026-09-04) Ekran 34, Moduł 4 (Baterie) — "Matryca alarmów BMS i reakcje systemu" zaimplementowany. Wzorzec C, tabela 7 alarmów→reakcji 1:1 ze źródła, bez kalkulatora (ten sam kształt co M11 A10/B12).
- ✅ (2026-09-04) Ekran 5, Moduł 4 (Baterie) — "Grzałki BMS i ochrona przed mrozem" zaimplementowany. Tylko druga warstwa silnika (drzewo decyzyjne skąd brać prąd na grzanie) — pierwsza warstwa (bilans dobowy grzania w kWh) świadomie nie liczona, brak wzoru w źródle, tylko 2 ilustracyjne przykłady. Znaleziona luka: granica SoC=30% nierozstrzygnięta w źródle → `OUT_OF_SCOPE`, dopisana do rejestru twardych stopów.
- ✅ (2026-09-04) Ekran 27, Moduł 4 (Baterie) — "Chłodzenie baterii latem" zaimplementowany. Sprawdzenie temperatury ogniw vs dopuszczalny zakres 15–35°C, bez liczenia wielkości przyspieszenia degradacji (źródło nie podaje wzoru, tylko ilustracyjny przykład).
- ✅ (2026-09-04) Ekran 23, Moduł 4 (Baterie) — "Analiza opłacalności magazynu (True Cost of Storage)" zaimplementowany. Wzory `energia_całkowita = pojemność×cykle×sprawność`, `koszt_za_kWh = cena/energia_całkowita` 1:1 ze źródła. Wchłania dawną funkcję 12.12 Modułu AI (duplikat wg źródła).
- ✅ (2026-09-04) Ekran 26, Moduł 4 (Baterie) — "Topologia BMS (Common Port vs Separate Port)" zaimplementowany. Wzorzec B + prosty próg z przykładu źródła (Common Port vs prąd rozruchu falownika).
- ⚠️ (2026-09-04) Ekran 25, Moduł 4 (Szyny zbiorcze i połączenia międzypakietowe) sprawdzony — **zablokowany**. Ta sama przyczyna co M5/E1 i M11/B5: źródło daje tylko ilustracyjne przykłady spadku prądu, bez wzoru wiążącego długość/przekrój kabla z rozkładem prądu. Nie budowany, żeby nie wymyślać zależności.
- ✅ (2026-09-04) Ekran 20, Moduł 4 (Baterie) — "Komunikacja BMS — CAN/RS485/Modbus" zaimplementowany. Sprawdzenie zgodności protokołów (prosta równość), bez cennika konwerterów.
- ✅ (2026-09-04) Ekran 10, Moduł 4 (Baterie) — "Ochrona przed wilgocią i kondensacją" zaimplementowany. Punkt rosy liczony standardowym wzorem Magnusa-Tetensa (nie podanym wprost w źródle, ale zweryfikowanym niezależnie). Znaleziona i udokumentowana niespójność fizyczna we własnym przykładzie źródła (Sekcja C) — nie odtworzona dosłownie, silnik liczy poprawną zależność. Twardy stop IP<55 w środowisku wilgotnym dopisany do rejestru.
- ✅ (2026-09-04) Ekran 8, Moduł 4 (Baterie) — "Symulacja Słabego Ogniwa (Cell Drift & Balancing)" zaimplementowany. "Pojemność użyteczna = pojemność najsłabszego ogniwa" 1:1 ze źródła, wynik w Ah/%, bez wymyślonej rekomendacji prądu balansera.
- ✅ (2026-09-04) Ekran 9, Moduł 4 (Baterie) — "Detekcja zwarcia i e-Fuse" zaimplementowany. **Drugie zastosowanie wzorca "echo"** — prąd zwarciowy re-używa wzoru Ohma wyekstrahowanego z Ekranu 24 (`obliczPradZwarciowyA`), zamiast go duplikować. Przykład źródła (5000A, wymagany e-Fuse) odtworzony dokładnie. Twardy stop dopisany do rejestru.
- ✅ (2026-09-04) Ekran 13, Moduł 4 (Baterie) — "Algorytm końca ładowania (Tail Current / Absorption)" zaimplementowany. Próg `I_koncowy = próg_C × pojemność` 1:1 ze źródła — przykład źródła (280Ah × 0,05C = 14A) odtworzony dokładnie.
- ✅ (2026-09-04) Ekran 29, Moduł 4 (Baterie) — "Detekcja doziemienia (Ground Fault & IMD)" zaimplementowany. Sprawdzenie obecności IMD/różnicówki DC, twardy stop przy braku obu.
- ✅ (2026-09-04) Ekran 21, Moduł 4 (Baterie) — "Pozycjonowanie ogniw (kompresja/spuchnięcie)" zaimplementowany. Docisk w kgf (nie moment) sprawdzony wzgl. zakresu 300-400 kgf, twardy stop poza zakresem.
- ✅ (2026-09-04) Ekran 14, Moduł 4 (Baterie) — "SoH — diagnostyka per ogniwo" zaimplementowany **częściowo**. Tylko warstwa 2 (rezystancja wzgl. fabrycznej, próg 50%) — warstwa 1 (SoH ogólny metodą coulombowską) wymaga logowania historii w czasie, niemożliwa do policzenia z jednorazowych danych. Przykład źródła (0,25→0,71mΩ) odtworzony dokładnie.
- ✅ (2026-09-04) Ekran 17, Moduł 4 (Baterie) — "Analiza Second-Life (baterie z EV)" zaimplementowany. SoH z wieku LUB przebiegu, przykład źródła (833 zł/kWh) odtworzony przy self-konsystentnych wartościach obu metod.
- ✅ (2026-09-04) **Moduł 4 zamknięty na 26/34** (reszta blocked/cross-module/wymaga integracji jeszcze nie zbudowanej) — decyzja użytkownika: przejść do kontynuacji Modułu 2.
- ✅ (2026-09-04) **Ekran 17, Moduł 2 — "Agregat prądotwórczy — definicja i logika pracy" — domyka lukę 1.19** znalezioną przy budowie standardu (2026-08-29, patrz `docs/memory.md`). Treść źródłowa odzyskana z `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md` (linie 503-521, funkcja 2.19), wzór zweryfikowany niezależnie w Pythonie, przykład źródła (deficyt 80 kWh, agregat 5 kW → 20h/25l/200zł) odtworzony dokładnie. Wpis "luka" w `docs/rejestr-pokrycia.md` oznaczony jako rozwiązany, nie usunięty.
- ✅ (2026-09-04) Ekran 9, Moduł 2 (Zapotrzebowanie) — "Pobór własny falownika" zaimplementowany. Wzór `E_doba = P_jałowy×24/1000` 1:1 ze źródła, przykład (45W → 1,08 kWh/dobę) odtworzony dokładnie.
- ✅ (2026-09-04) Ekran 11, Moduł 2 (Zapotrzebowanie) — "Przetwornice DC/DC" zaimplementowany. Wzór `P_realne = P_urządzenia/sprawność`, przykład źródła ("sprawność 92% → traci 8%") zweryfikowany matematycznie: strata jako % mocy realnie pobranej to dokładnie `1-sprawność`.
- ✅ (2026-09-04) Ekran 8, Moduł 2 (Zapotrzebowanie) — "Zaawansowane parametry obciążenia" zaimplementowany **częściowo**. Tylko podpunkt 1 (moc pozorna `VA=P/cosφ`) — podpunkty 2/3 (prądy rozruchowe, współczynnik jednoczesności) wymagają bazy komponentów/modelu statystycznego, których źródło nie podaje jako konkretnych liczb.
- ✅ (2026-09-04) Ekran 13, Moduł 2 (Zapotrzebowanie) — "Bufor na rozbudowę" zaimplementowany. Wzór `E_z buforem = E_całkowite × (1 + bufor%)` 1:1 ze źródła, wartości suwaka (0/10/20/30%) literalnie ze źródła, przykład (12,4 kWh + 20% → 14,88 kWh) odtworzony dokładnie.
- ✅ (2026-09-04) Ekran 7, Moduł 2 (Zapotrzebowanie) — "Dni autonomii" zaimplementowany. Suwak 1/2/3/5/7 dni 1:1 ze źródła; opcjonalny podgląd wpływu na wielkość magazynu **wzorzec "echo"** — reużywa `obliczPojemnoscUzytecznaKwh` wyekstrahowanego z Moduł 4/Ekran 1 zamiast duplikować wzór.
- ✅ (2026-09-04) Ekran 2, Moduł 2 (Zapotrzebowanie) — "Inteligentny bojler C.W.U." zaimplementowany. Energia z pojemności cieplnej wody (`Q=V×ΔT×0,001163`, `c_wody` — stała fizyczna). ΔT wymaga ręcznego wpisania (źródło nie podaje domyślnej wartości). Przykład źródła (200l/4 osoby → ok. 8 kWh) odtworzony przy ΔT=35K.
- ✅ (2026-09-04) Ekran 6, Moduł 2 (Zapotrzebowanie) — "Sezonowość i tryb wakacyjny" zaimplementowany. Trzy typy (całoroczny/sezonowy/weekendowy); granice sezonu wpisywane per urządzenie (źródło daje tylko jeden przykład — klimatyzacja czerwiec-wrzesień — nie uniwersalną definicję pór roku), logika przełomu roku obsłużona.
- ✅ (2026-09-04) Ekran 5, Moduł 2 (Zapotrzebowanie) — "Profil dobowy + astronomiczny dzień/noc" zaimplementowany **częściowo**. Tylko część astronomiczna: długość dnia/nocy standardowym równaniem wschodu/zachodu Słońca (deklinacja Coopera 1969). Warszawa/21 grudnia → 7,5h dnia, zgodne z przykładem źródła (~8h). Profil godzinowych współczynników zapotrzebowania (Sekcja B) NIE zbudowany — przykładowe, nie uniwersalne wartości źródła.
- ✅ (2026-09-04) Ekran 12, Moduł 2 (Zapotrzebowanie) — "Macierz priorytetów odłączania (Smart Load Shedding)" zaimplementowany. Progi SoC (20%/90%) podane wprost w źródle. Przykład źródła (SoC 18% → priorytet 3 odłączony, priorytet 1 aktywny) odtworzony dokładnie.
- ✅ (2026-09-04) Ekran 2, Moduł 4 (Baterie) — "Sugestia napięcia systemowego (12/24/48V)" zaimplementowany, dawny blocked z Modułu 4 teraz otwarty. Progi >3000W→48V i <1000W→12V 1:1 ze źródła; 24V dla pasma środkowego dopowiedziane logicznie. Przykład źródła (4800W → 400A@12V, 100A@48V) odtworzony dokładnie. Przekroje kabli NIE policzone (brak normy PN-IEC).
- ✅ (2026-09-04) Ekran 4, Moduł 4 (Baterie) — "Moduł EV — ładowanie samochodu elektrycznego" zaimplementowany. Sprawdza pokrycie zapotrzebowania EV nadwyżką PV latem/zimą (`brak = max(0, E_EV - nadwyżka)`). Zapotrzebowanie EV wpisywane wprost (bez zgadywania zużycia kWh/km). Przykład źródła (10 kWh/dobę, pokryte latem, brak 7 kWh zimą) odtworzony dokładnie.
- ✅ (2026-09-04) Ekran 19, Moduł 4 (Baterie) — "Vehicle-to-Home (V2H)" zaimplementowany. **Czwarte zastosowanie wzorca "echo"** w tej sesji — koszt/kWh reużywa `obliczKosztZaKwh` z Ekranu 23 (oplacalnosc-magazynu). "Rezerwa/degradacja/straty" modelowane jako rezerwa + jeden współczynnik sprawności efektywnej, bez wymuszania dopasowania do niejednoznacznego przykładu źródła.
- ✅ (2026-09-04) Ekran 18, Moduł 3 (Instalacja PV) — "Wpływ temperatury na wydajność" zaimplementowany. Wzór `P_rzeczywista = P_nominalna × (1 + γ×(T_panel−25))` 1:1 ze źródła. Przyrost temperatury i γ to zakresy ze źródła — oba pola ręczne, nie ukryty domyślny. Przykład źródła (35°C→60°C panel, strata ok. 15%) odtworzony dokładnie.
- ✅ (2026-09-04) Ekran 8, Moduł 3 (Instalacja PV) — "Straty na okablowaniu DC (efekt Joule'a)" zaimplementowany. Wzór `R=ρ×2L/S` 1:1 ze źródła (ρ_Cu stała fizyczna). Przykład źródła (30m/15A: 4/6/10mm²→6%/4%/2,4%) odtworzony dokładnie dla wszystkich trzech przekrojów naraz. Dodatkowo porównanie 4 standardowych przekrojów katalogowych na jednym ekranie.
- ✅ (2026-09-04) Ekran 5, Moduł 3 (Instalacja PV) — "Zimowy stress-test napięciowy MPPT (Voc max)" zaimplementowany. Źródło: "jeden z najważniejszych twardych stopów w całej aplikacji" — dopisany do `docs/rejestr-twardych-stopow.md`. Wzór i progi werdyktu 🔴/🟡/🟢 1:1 ze źródła. Przykład źródła (8 paneli → 520V, limit 450V → 🔴) odtworzony dokładnie.
- ✅ (2026-09-04) Naprawa dryfu: deklaracja "Ekspertyza domenowa" (GOD BOOK §0.2) dopisana do `docs/memory.md`, `ZASADY_APLIKACJI.md` §0.1 i `USTALENIA.md` (wersja zasad 0.1.6→0.1.7) — merytorycznie stosowana od początku sesji, nigdy wcześniej jawnie nie zapisana.
- ✅ (2026-09-04) Ekran 17, Moduł 3 (Instalacja PV) — "Niedopasowanie mocy paneli (mismatch)" zaimplementowany. Prąd stringu ogranicza najsłabszy panel; przykład źródła (400W/11A + 330W/9A → 720W zamiast 730W, strata 1,4%, różnica mocy 17,5% → 🔴) odtworzony dokładnie. Twardy próg (10-15% różnicy mocy) użyty jako trójstopniowe kubełkowanie.
- 🔲 **Termin: piątek 2026-09-04 20:00 — maksymalna liczba rozdziałów.** Moduł 4: **29/34** (5 pozostałych blocked — cross-modułowe lub brak normy/wzoru). Moduł 11 **niemal kompletny**: Ścieżka A 8/10 (A2/A5 świadomie odłożone), Ścieżka B 11/12 (B5 blocked) — razem 19/22. Moduł 5 Ekran 1 sprawdzony i też blocked (brak normy). Moduł 2: 13/17 zbudowane, pozostałe (3/10/14/15, wampiry) blocked. Moduł 3: 12 ekranów dodatkowych zbudowanych (Ekrany 5/6/8/13/14/16/17/18/22/26 doszły do reprezentantów wzorców A/C). Moduł 6: sześć dodatkowych ekranów (15 pompy cyrkulacyjne, 14 bufor ciepła, dawne 5.63 ryzyko niskiego napięcia, dawne 5.33 kocioł elektryczny, 12 infiltracja powietrza, 3 wentylacja z odzyskiem) doszły do reprezentanta (COP). Moduł 8: dwa dodatkowe ekrany (6 UPS krytyczny, 2 dogrzewanie paliwem stałym) doszły do reprezentanta (audyt pożarowy). Luka 1.19 domknięta. **Pełna Biblia GOD BOOK napisana** (`00_Biblia.md` + 11 dokumentów, `mapa-wdrozenia.md` ma teraz aktualny status per moduł M1–M13, 92 ekranów `done` łącznie).
- ✅ (2026-09-04) **Napisano pełną Biblię projektu (12 nowych plików, format GOD BOOK).** `AKTUALIZACJE.md` w `new-app-standards` sprawdzone — już zsynchronizowane (v2.5, najnowsza). Szczegóły: `00_Biblia.md`, `docs/memory.md`.
- ✅ (2026-09-04) Ekran 6, Moduł 3 (Instalacja PV) — "Aerodynamika — napór wiatru" zaimplementowany. Wzór `F=0,5×ρ×v²×A×Cd` 1:1 ze źródła. Znaleziona rozbieżność w przykładzie źródła ("350N" niereprodukowalne dla realnego panelu przy podanym zakresie Cd) — wzór wdrożony dokładnie, nie wymuszony do dopasowania. Siła ssania/moment/balast NIE liczone (brak geometrii montażu w źródle).
- ✅ (2026-09-04) Ekran 22, Moduł 3 (Instalacja PV) — "Ochrona stringów (bezpieczniki, diody blokujące)" zaimplementowany. Wzór `I_bezpiecznik=1,25×Isc` i próg (≥3 stringi → obowiązkowe zabezpieczenia) 1:1 ze źródła, oba podane wprost jako liczby. Przykład źródła (Isc→15A) odtworzony dokładnie. Nowy twardy stop.
- ✅ (2026-09-04) Ekran 13, Moduł 3 (Instalacja PV) — "Symulacja zacienienia i wpływ na diody bocznikujące" zaimplementowany (częściowo, świadomie). Fakt konstrukcyjny "3 sekcje/3 diody bocznikujące" → `strata_panelu = sekcje_zacienione/3`, odtwarza dokładnie przykład źródła (1 sekcja→33%, 2 sekcje→66%), zweryfikowany niezależnie w Pythonie. Strata na poziomie CAŁEGO STRINGU (55%+ w przykładzie źródła) świadomie NIE liczona — źródło opisuje ją jako zależną od konfiguracji, bez wzoru; zamiast wymyślać formułę, zostawiona jako opisowa uwaga.
- ✅ (2026-09-04) Ekran 14, Moduł 3 (Instalacja PV) — "Dopasowanie tablicy PV do falownika" zaimplementowany (częściowo, świadomie). "Mega-scalenie" 6 dawnych funkcji — zbudowane 4 z 6 kryteriów jednocześnie (napięcie zimowe, okno MPPT, prąd, przewymiarowanie DC/AC 1,1-1,3), każde z jawnym wzorem/zakresem ze źródła. Wzorzec echo: `obliczNapiecieStringuZimowego` wyekstrahowany z Ekranu 5 (`stress-test-mppt`). Kryterium 4 (napięcie startowe w upale) świadomie pominięte — wymaga współczynnika temperaturowego Vmp nieobecnego w źródle jako wzór.
- ✅ (2026-09-04) Ekran 26, Moduł 3 (Instalacja PV) — "Straty na złączkach MC4 w praktyce" zaimplementowany. Prawo Joule'a `P=n×I²×R`, rezystancja złączki wpisywana ręcznie w podanym zakresie źródła (0,5-2 mΩ dobry stan, D16). Przykład źródła (20 złączek, 10A, dobry styk → 2W) odtworzony dokładnie, zweryfikowany niezależnie w Pythonie.
- ✅ (2026-09-04) Ekran 16, Moduł 3 (Instalacja PV) — "Panele bifacjalne" zaimplementowany (częściowo, świadomie). Dodatkowy uzysk = % (ręcznie w zakresie danym per typ powierzchni) × uzysk bazowy. Przykład źródła ("jasny beton → 12%") odtworzony dokładnie. Współczynnik bifacjalności panelu (70-90%) świadomie NIE użyty — źródło nie podaje wzoru łączącego go z już podanymi zakresami %.
- ✅ (2026-09-04) Ekran 15, Moduł 6 (Ogrzewanie) — "Pompy cyrkulacyjne — dobór" zaimplementowany. Pierwszy nowy ekran M6 poza wzorcem D (COP). `E=P×h/1000` — porównanie pompy stałoobrotowej (100-150W) vs elektronicznej PWM (5-50W). Przykład źródła (45W→1,08 kWh/dobę, 8W→0,19 kWh/dobę, 82% oszczędności) odtworzony dokładnie, zweryfikowany niezależnie w Pythonie.
- ✅ (2026-09-04) Ekran 14, Moduł 6 (Ogrzewanie) — "Bufor ciepła — dobór pojemności" zaimplementowany. Współczynnik 50 l/kW podany wprost jako liczba, nie zakres. Przykład źródła (pompa 8kW → 400l) odtworzony dokładnie.
- ✅ (2026-09-04) Ekran dodatkowy, Moduł 6 (Ogrzewanie, dawne 5.63) — "Ryzyko wyłączenia pompy przy niskim napięciu" zaimplementowany. Bezpieczeństwo-krytyczny (twardy stop 🔴) — prosta różnica napięć, bez wymyślonego współczynnika. Napięcie systemu wpisywane ręcznie (docelowo auto z Modułu 4/Live). Dopisany do `docs/rejestr-twardych-stopow.md`.
- ✅ (2026-09-04) Ekran dodatkowy, Moduł 6 (Ogrzewanie, dawne 5.33) — "Kocioł elektryczny — porównanie kosztu z pompą ciepła" zaimplementowany. Wzorzec echo Ekranu 5 (COP): `E=Q/COP` zastosowany dwukrotnie (pompa z COP ręcznym, kocioł z COP=1 — sprawność 99% ze źródła). Przykład źródła ("kocioł zużywa 3-4× więcej prądu") odtworzony dokładnie.
- ✅ (2026-09-04) Ekran 12, Moduł 6 (Ogrzewanie) — "Infiltracja powietrza (test szczelności)" zaimplementowany (częściowo, świadomie). Wzór `Q=n×V×ρ×cp×ΔT/3600` — fizyka strat ciepła przez wymianę powietrza, stałe fizyczne (gęstość/ciepło właściwe powietrza), analogicznie do `bojler-cwu`. Poprawa "8% po uszczelnieniu" (pojedynczy przykład źródła, nie ogólny współczynnik) świadomie nie liczona.
- ✅ (2026-09-04) Ekran 3, Moduł 6 (Ogrzewanie) — "System wentylacji z odzyskiem ciepła" zaimplementowany (częściowo, świadomie). Wzorzec echo `infiltracja-powietrza` (M6/E12) pomnożony przez sprawność rekuperatora. Przykład źródła (250 m³/h, 85%, −10°C → 2,1 kW) odtworzony przybliżonym dopasowaniem (2,14 kW). Projekt strumieni per pomieszczenie i bypass letni świadomie nie zbudowane.
- ✅ (2026-09-04) Ekran 6, Moduł 8 (Bezpieczeństwo) — "UPS krytyczny — dobór sprzętowy" zaimplementowany (częściowo, świadomie). Pierwszy nowy ekran M8 poza reprezentantem. Wzorzec echo trybu "runtime" z `kalkulatory-pomocnicze` (M2/E16) zastosowany do sumy poboru mocy checklisty urządzeń krytycznych (wzorzec z `systemy-podtrzymania-zycia`, M2/E1). Zarządzanie priorytetami AI przy rozładowaniu (12.54) świadomie nie zbudowane.
- ✅ (2026-09-04) Ekran 2, Moduł 8 (Bezpieczeństwo) — "Bezpieczeństwo pożarowe przy dogrzewaniu paliwem stałym" zaimplementowany. Trzy niezależne twarde stopy: min. odległość 40 cm od materiałów palnych (liczba wprost ze źródła), obecność nawiewu do spalania, obecność czujnika CO — boolowskie pola domyślnie `false` (dane bezpieczeństwa nigdy jako ukryty domyślny "tak"). Wszystkie trzy dopisane do `docs/rejestr-twardych-stopow.md`.
- ✅ (2026-09-04) Sprawdzono `AKTUALIZACJE.md` w `new-app-standards` (GOD BOOK Y.6) — znaleziono i zsynchronizowano 3 nowe wersje (v2.5→v2.8): GOD BOOK podmieniony w całości, odsyłacze do wersji poprawione w 12 plikach (`docs/standards/00-INDEKS.md`/`00-filozofia.md`, `CLAUDE.md`, `README.md`, `.claude/skills/standards/SKILL.md`, `PROMPT_STARTOWY.md`, `00_Biblia.md`, `ZASADY_APLIKACJI.md`, `USTALENIA.md`, `01_Zasady_Pracy_i_Konwencje.md`, ten plik). Przy okazji naprawiony drobny dryf w nagłówku tego pliku (nieaktualne "projekt nie ma jeszcze Biblii"). Pełny wynik checklisty Y.9 (9 pozycji, wszystkie ✅): `docs/memory.md`.
- ✅ (2026-09-06) **KOREKTA — norma PN-HD 60364-5-52 dostarczona i Załącznik B w pełni zweryfikowany
  (05.09.2026, `docs/zrodla/norma-PN-HD-60364-5-52/`).** Cztery pozycje oznaczone wyżej (09-03/09-04)
  jako `blocked`/"brak normy" — B5 (Moduł 11), M5/Ekran 1, M4/Ekran 2 (część porównania kabli), M4/Ekran
  25 — **nie są już blokowane brakiem źródła**, tylko brakiem transkrypcji tabel do kodu (czyste
  zadanie implementacyjne). Odświeżone w `docs/rejestr-pokrycia.md` (statusy zmienione na `todo` z
  notatką). Stare wpisy wyżej celowo NIE usunięte/nadpisane (`docs/standards/15-wspolpraca-z-ai.md`,
  15.3) — poprawnie opisywały stan na swoją datę. Pełna, aktualna lista wszystkich norm wciąż
  brakujących (nigdy nie pozyskanych, w odróżnieniu od tej czwórki): `docs/normy-brakujace.md`.
- ✅ (2026-09-06) **Ekran 1, Moduł 5 — "Dobór przekroju kabla" (mega-Doradca) zaimplementowany.**
  Domyka odblokowanie z wpisu wyżej (05-06.09.2026) — silnik w pełni oparty na tabelach normy
  PN-HD 60364-5-52 (B.52.2 obciążalność bazowa, B.52.14/15 korekta temperatury, B.52.17/18 korekta
  wiązki), `lib/core/modules/okablowanie/dobor-przekroju-kabla/`, 11 testów, wartości referencyjne
  policzone niezależnie przed implementacją. Zakres świadomie ograniczony (izolacja PVC domyślna,
  2 żyły obciążone — udokumentowane w kodzie/`docs/rejestr-pokrycia.md`). Znaleziona i udokumentowana
  rozbieżność: wzór spadku napięcia w opisie produktowym źródła (`R=ρ×L/S`) pomija drogę powrotną
  prądu — użyto poprawnego `R=ρ×2L/S` (ten sam wzór co M3/E8, już zweryfikowany). B5 (Moduł 11) i
  Ekran 25 (Moduł 4) mogą teraz reużyć ten silnik jako "echo" — wciąż `todo`, nie zbudowane.
- ✅ (2026-09-16, wpis retroaktywny) **Domknięta dziura w tym pliku za okres 2026-09-05 →
  2026-09-14** — znaleziona przy audycie zgodności ze standardem (rozdz. 14: ten plik ma być
  aktualizowany na bieżąco). Praca w tym oknie była poprawnie odnotowana na bieżąco w
  `docs/rejestr-pokrycia.md` i `docs/memory.md`, tylko nie przeniesiona tutaj — nic w kodzie nie
  wymagało korekty, tylko ten log. Zbudowano: **(05.09)** Moduł 5/Ekran 6 "Dobór bezpieczników i
  rozłączników" i Moduł 3/Ekran 22 pochodny Ekran "String Box", na wyraźną prośbę autora, przed
  jeszcze pełnym Ekranem 1; **(06.09)** norma PN-HD 60364-5-52 (Załącznik B) w pełni zweryfikowana
  i Moduł 5/Ekran 1 "Dobór przekroju kabla" (mega-Doradca) zbudowany — odblokował 4 wcześniej
  `blocked` ekrany (B5/M11, M5/E1 samo, M4/E2 porównanie kabli, M4/E25); **(13.09)** 14 kolejnych
  ekranów Modułu 5/okablowanie w jednym przejściu — SPD, szyny zbiorcze i połączenia (dolna
  sekcja), Cu-Al/korozja, dobór mocy falownika, Główna Szyna Wyrównawcza, uziemienie
  funkcjonalne/ochronne, analiza zwarciowa, wyłączniki nadprądowe DC, ochrona przed odwrotną
  polaryzacją, wyłączniki RCD, ochrona przed dotykiem, oznakowanie obwodów, optymalizacja trasy
  kabla/TCO, dobór izolacji kabla, pomiary powykonawcze; **(13-14.09)** przebudowa Moduł 4/Ekran 2
  "napiecie-systemowe" do v2.1.0 (kreator odbiorników, analiza jednoczesności, echo doboru
  przekroju kabla ×3 dla 12/24/48V, kosztorysy ×3); **(14.09)** Moduł 11/B5 "dobor-kabli-
  bezpiecznikow-olow" i Moduł 4/Ekran 25 "szyny-zbiorcze-miedzypakietowe" odblokowane jako echo
  Moduł 5/Ekran 1. Pełne szczegóły per ekran, z numerami funkcji źródłowych i uzasadnieniami
  zakresu: `docs/rejestr-pokrycia.md` (wiersze z datami 2026-09-05/06/13/14).
- ✅ (2026-09-15) **Rozstrzygnięte częściowo: `StorageAdapter` (wpis ⏳ z 2026-09-03) ma teraz realną
  implementację** — `IndexedDbStorageAdapter` (`lib/adapters/indexeddb-storage-adapter.ts`) + hook
  `usePersistedDraft` (`lib/adapters/use-persisted-draft.ts`), pilotaż na ekranie `napiecie-systemowe`
  (zgłoszenie użytkownika: strona sama się przeładowywała, dane się gubiły). Pozostałe ~115 ekranów
  kalkulatorów jeszcze nie korzystają z autozapisu — rollout ekran po ekranie, `usePersistedDraft`
  gotowy do skopiowania 1:1. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-15, zamknięte 2026-09-19) **Rollout rozdz. 17 (i18n) na resztę modułów.** Kontrakt
  (`Warning.i18nKey`/`params`, `CalcResult.Assumption` jako `string | {kod, params}`) i wzorzec
  migracji ustalone i sprawdzone na module pilotażowym `kalkulatory-pomocnicze` (M2/E16) —
  `lib/i18n/dictionary-pl.ts` + `lib/i18n/t.ts`. Wykonane moduł po module (zgodnie z 17.9, nie big
  bang), 19 partii, każda z własnym PR — pełna historia procesu i decyzji w `docs/memory.md`.
  **Partia 19. (19.09.2026) zamknęła ostatni moduł z realnym tekstem — `baterie/napiecie-systemowe`
  (87. i ostatni wpis w `MIGRATED_MODULES`).** Rollout `Warning.message`/string `Assumption` →
  `i18nKey`/`{kod,params}` dla kodu domenowego jest kompletny. Jedyny pozostały, świadomie odłożony
  zakres: `pv/czystosc-i-snieg`, `baterie/komunikacja-bms`, `baterie/porownanie-technologii` — dane
  katalogowe (nazwy/opisy produktów/technologii), wymagające osobnej decyzji architektonicznej o
  modelu i18n dla treści katalogowej (nie prostego `Warning`/`Assumption`), poza zakresem tego
  wątku — do rozstrzygnięcia z właścicielem projektu, nie samodzielnie.
- ⚠️ (2026-09-15) **Niezgodność #2 (logowanie, rozdz. 18) — szkielet gotowy, czeka na działanie
  właściciela projektu.** Kod (Supabase Auth, magic link/Google/Apple, middleware, RLS jako
  `.sql`) napisany i zweryfikowany (`tsc`/`lint`/`test`/`build`), ale wyłączony do czasu realnych
  danych — apka dziś działa identycznie jak przed tym szkieletem. Do zrobienia przez właściciela:
  1. Załóż projekt na supabase.com (New Project → Settings → API), wklej URL + anon key do
     `.env.local` (wzór: `.env.example`).
  2. Uruchom `supabase/migrations/0001_profiles.sql` w Supabase Dashboard → SQL Editor.
  3. (Opcjonalnie, koszt: Google — darmowe, Apple — **99 USD/rok**) Włącz dostawców w Supabase
     Dashboard → Authentication → Providers.
  Po tym logowanie działa bez żadnych zmian w kodzie. Szczegóły: `docs/memory.md`.
  **Aktualizacja (2026-09-16, na polecenie "Zajmij się logowaniem i kontami"):** audyt szkieletu
  względem pełnej treści rozdz. 18 znalazł i naprawił dwie realne luki bez potrzeby realnych
  kluczy Supabase — **18.5 (`@supabase/ssr` domyślnie `httpOnly: false`, `createBrowserClient`
  usunięty)** i **18.8 (usuwanie konta, było całkowicie nieobecne — dodany szkielet z kluczem
  service role, tak samo bezpiecznie zdegradowany bez realnych danych jak reszta)**. Kroki 1–3
  wyżej wciąż aktualne i niezmienione — to wciąż jedyne, co blokuje żywe logowanie. Dwa zgłoszenia
  do `docs/wklad-do-standardu.md` (konflikt 18.4/18.5 dla `createBrowserClient`, otwarte pytanie o
  Server Actions vs token CSRF). Szczegóły: `docs/memory.md`.
- ✅ (2026-09-16) **Luka "brak CI" (11.2/11.5) zamknięta.** `.github/workflows/ci.yml` — dwa
  niezależne joby na każdym PR + push na `main`: `quality` (lint/typecheck/test/build) i
  `dependency-audit` (`pnpm audit --audit-level=high`, 11.5). Przy tej okazji zaktualizowano
  zależności i naprawiono 22 podatności `high` wykryte przy pierwszym uruchomieniu audytu (audyt
  dziś: 0 wykrytych). Szczegóły procesu i decyzji: `docs/memory.md`.
- ✅ (2026-09-16) **Luka "brak mechanizmu strażniczego i18n" (17.9) zamknięta.**
  `scripts/check-i18n-guard.mjs` (parsowanie AST, nie regex) blokuje w CI regresję na modułach już
  zmigrowanych (dziś: `kalkulatory-pomocnicze`) — nowy `message`/gołe stringi w `assumptions`. Przy
  tej okazji rozpatrzono i **odrzucono** zmianę kluczy i18n na angielski (17.1 dopuszcza wyjątek —
  cały projekt już ma polską konwencję `Warning.code`, zmiana rozbiłaby ją na dwie równoległe bez
  korzyści funkcjonalnej). **Ważne dla przyszłych migracji:** dopisz nowy moduł do
  `MIGRATED_MODULES` w tym samym kroku, w którym go migrujesz. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-16) **Aktualizacja ze standardu wykonana** (8 nowych wpisów `AKTUALIZACJE.md`,
  GOD BOOK v2.17→v2.18, cykl sprawdzania Y.6 skrócony 7 dni→3h). Nadpisane w całości: `00-INDEKS.md`,
  `11-ci-deployment.md`, `13-droga-mobile.md`, `15-wspolpraca-z-ai.md`, `17-i18n.md`,
  `PROMPT_STARTOWY.md`; nowy `docs/przyklady/` skopiowany (CI + i18n-guard referencyjne — pochodzą
  pierwotnie z tego projektu, promowane i wracają jako standard); PATCH do `CLAUDE.md` (słownik
  aktualizacja/promocja, cykl 3h) i `docs/wklad-do-standardu.md`. 17.4 (SSR flash języka) i 13.2
  (mobile) bez wpływu na kod dziś — projekt nie ma jeszcze przełącznika języka UI ani fazy mobile.
  Szczegóły pełnej checklisty: `docs/memory.md`, sekcja "Synchronizacja ze standardem".
- ⚠️ (2026-09-16) Do decyzji: `dependency-audit` w `.github/workflows/ci.yml`
  (`pnpm audit --audit-level=high`) blokuje merge na KAŻDEJ podatności high/critical, także
  przechodniej — szerszy zakres niż dosłowne brzmienie 11.5 ("zależność bezpośrednia"). Standard
  ma teraz gotowy przykład węższego zakresu (`docs/przyklady/ci/audit-gate.mjs`, filtruje po
  `isDirect`). Dziś 0 podatności obu rodzajów — nie paląca, ale otwarta: zostać przy szerszym
  zakresie (bezpieczniej) czy zawężyć do 11.5 dosłownie? Patrz `docs/memory.md`.
- ✅ (2026-09-16, druga synchronizacja tego dnia) GOD BOOK v2.18→v2.19 — 1 nowy wpis
  `AKTUALIZACJE.md`, dotyczy wyłącznie wewnętrznego mechanizmu `new-app-standards` (live-test
  Routine U.4), zero nowej reguły dla tego projektu. Plik GOD BOOK nadpisany pod nową nazwą,
  odsyłacze poprawione. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-16) **Rozstrzygnięte: wariant B — zgodnie z dosłownym 11.5.** `scripts/audit-gate.mjs`
  (adaptacja `docs/przyklady/ci/audit-gate.mjs` z npm/`isDirect` na pnpm/`package.json` — `pnpm
  audit --json` nie ma pola `isDirect`, sprawdzone wprost w bundlu pnpm) + `pnpm audit:gate`
  zastępuje `pnpm audit --audit-level=high` w `.github/workflows/ci.yml`. Blokuje merge tylko na
  high/critical w zależności bezpośredniej, tranzytywne informacyjnie. Szczegóły weryfikacji:
  `docs/memory.md`.
- ✅ (2026-09-16) **Przełącznik języka w Ustawieniach + EN/RU dodane.** `lib/i18n/language.ts`
  (typ `Language`, `negocjujJezyk` z `Accept-Language`), `dictionary-en.ts`/`dictionary-ru.ts`
  (parytet kluczy z PL wymuszony typem), `t()` language-aware, `LanguageProvider`/`useTranslate()`,
  cookie `jezyk` (nie `localStorage` — 17.4), `middleware.ts` ustawia ją na pierwszej wizycie,
  `app/layout.tsx` czyta ją server-side. `components/jezyk-wybor.tsx` w Ustawieniach. **Nie zmienia**
  stanu rollout'u z wpisu (2026-09-15) niżej — nadal 1/116 modułów ma klucze tłumaczeń (~89 plików
  `warnings.ts`/~109 miejsc `assumptions` wciąż z gotowym tekstem PL) — to dodaje infrastrukturę
  (języki + przełącznik), nie migruje więcej modułów. Zweryfikowano Playwright: negocjacja
  Accept-Language, przełączanie PL/EN/RU, `<html lang>` poprawny po SSR, realny przetłumaczony tekst
  na ekranie modułu pilotażowego, zero błędów konsoli. `docs/wklad-do-standardu.md` i
  `docs/propozycje-do-new-app-standards/wielojezycznosc.md` zaktualizowane (nie czeka już na
  `zero-waste`, na wyraźne polecenie właściciela projektu). Szczegóły: `docs/memory.md`.
- ✅ (2026-09-16, trzecia synchronizacja tego dnia) **Aktualizacja ze standardem — 7 nowych wpisów
  `AKTUALIZACJE.md`, GOD BOOK bez zmiany wersji (v2.19).** Nadpisane: `00-INDEKS.md`, `08-ui-ux.md`,
  `10-testy.md`, `16-standard-kodowania.md`, `17-i18n.md`. **Własne zgłoszenie z dzisiejszej
  wcześniejszej pracy (`wielojezycznosc.md`) zostało skonsolidowane** — 3 nowe reguły standardu
  (8.8, 17.4, nowa 17.7a) cytują wprost ten plik, w tym potwierdzenie naszego dzisiejszego wyboru
  (cookie per-urządzenie bez kont, `⚠ [klucz]` zamiast cichego fallbacku). Sprawdzone względem kodu:
  next-intl (nie dotyczy — nie używamy), region obliczeń/towarów (przełącznik języka już niezależny
  od `lib/core/profiles/`, brak UI regionu do naprawienia), wzorzec async-reset 16.7 (jedyny
  kandydat, `app/auth/login/page.tsx`, sprawdzony — nie występuje), e2e port-cleanup 10.6 (nie
  dotyczy — brak infrastruktury e2e). Szczegóły: `docs/memory.md`.
- 🔲 (2026-09-16) **Audyt pełnego pakietu `docs/standards/` (00-18) + GOD BOOK na polecenie
  właściciela projektu ("przeczytaj dokładnie i zrób listę co nie jest zrobione").** Każdy rozdział
  przeczytany w całości, sprawdzone względem kodu (`grep`), nie z metryczki. Wynik — cztery
  pozycje, w kolejności priorytetu:
  1. **Rozdział 9 (AI w produkcie) — OBOWIĄZKOWY wg 9.0, zero implementacji.** ✅ Pierwsza realna
     integracja zbudowana (2026-09-16) — patrz kolejny wpis niżej.
  2. **Rozdział 12 (Freemium) — jedyny model rodziny wg 12.8, zero implementacji.** Zero
     Stripe/podziału feature→tier/`isPro` w kodzie — cała apka dziś w 100% darmowa.
  3. **5.3 (PWA offline-first) — brak `manifest.json`/service workera/biblioteki PWA**, mimo że
     `CLAUDE.md` nazywa projekt "PWA offline-first". `IndexedDbStorageAdapter` (5.2) już działa
     (`use-persisted-draft.ts`) — to tylko połowa wymogu 5.3. ✅ Zbudowane (2026-09-16) — patrz
     kolejny wpis niżej.
  4. **18.3 (scalanie tożsamości multi-provider)** — nie zbudowane, wymaga już zalogowanego usera
     do testowania, odłożone do czasu żywego logowania (blokowane na akcję właściciela, patrz
     wpis 15.09.2026 wyżej).
  Świadomie odłożone, nie pominięte: rollout i18n (89 plików/109 miejsc, wpis 15.09.2026 wyżej),
  10.5 (audyt K1-K8 na 116 modułach — rozkładalny w czasie), 57 pozycji `todo` w
  `docs/rejestr-pokrycia.md` (głównie klaster stress-test zimowy, w większości zależne od innych
  modułów). Przy tej okazji naprawione dwie nieaktualności dokumentacji (higiena, nie nowa
  funkcja): stary komentarz w `lib/adapters/storage-adapter.ts` (twierdził "apka nie ma jeszcze
  funkcji zapisującej Seed" — nieprawda od czasu `use-persisted-draft.ts`) i przestarzały akapit w
  `docs/rejestr-pokrycia.md` ("moduły 6,7,10-13 nie rozpoczęte" z 30.08 — nieaktualne, każdy ma już
  min. jeden ekran `done`). Szczegóły: `docs/memory.md`.
- ✅ (2026-09-16) **Rozdział 9 (AI w produkcie) — pierwsza realna integracja (Priorytet 1, punkt 1
  z audytu wyżej).** Zakres świadomie wąski: jedno narzędzie AI (`kalkulatoryPomocniczeTool`,
  `operationType: "read"`), jeden pilotażowy ekran (`/kalkulatory/pomocnicze`, ten sam moduł co
  pilot i18n). Zbudowano: `lib/ai/types.ts` (kontrakt `AiToolDefinition<TInput,TOutput>` 1:1 z
  9.3 + `validateAiToolDefinition` — rzuca błąd dla `write`+`requiresConfirmation: false`),
  `lib/adapters/ai/{config,client}.ts` (`isAiConfigured()`, `createAnthropicClient()`,
  `server-only`), `lib/ai/tools/kalkulatory-pomocnicze-tool.ts` (handler deleguje do prawdziwego
  `calculateKalkulatoryPomocnicze()`, nigdy nie liczy sam), `lib/ai/to-anthropic-tool.ts`
  (`z.toJSONSchema()` — bez dodatkowej biblioteki), `lib/ai/pytaj-asystenta.ts` (ręczna pętla
  agentowa — zainstalowana wersja `@anthropic-ai/sdk` 0.126.0 nie ma jeszcze beta Tool Runnera,
  sprawdzone wprost w `node_modules`), `lib/ai/is-ai-available.ts` + `components/asystent-ai.tsx`
  (degradacja w milczeniu bez `ANTHROPIC_API_KEY`, ten sam wzorzec co `KontoSekcja`/Supabase w
  rozdz. 18). Testy: `lib/ai/__tests__/types.test.ts`, `lib/ai/tools/__tests__/kalkulatory-pomocnicze-tool.test.ts`,
  `lib/adapters/ai/__tests__/config.test.ts` (9+4+4 = razem 13 nowych testów). Zweryfikowane:
  `pnpm typecheck`/`lint`/`test` (722/722) czyste, `pnpm build` bez błędów, `pnpm start` + realny
  request na `/kalkulatory/pomocnicze` bez `ANTHROPIC_API_KEY` — strona renderuje się poprawnie,
  sekcja asystenta bezpiecznie nie pojawia się (brak wyjątku, brak martwego UI). Świadomie poza
  zakresem (nie przeoczenie): więcej narzędzi/modułów AI, `AiMode` (OFFLINE/HYBRID/CLOUD_ASSISTED,
  9.6) nie podłączony do trwałego stanu — dziś tylko `CLOUD_ASSISTED` ma sens (brak modelu
  lokalnego), pamięć rozmowy czatu (9.7 — świadome uproszczenie pierwszego kroku), budżet/limity
  zapytań (9.8), pełna obrona przed prompt injection z treści zewnętrznych (9.4 — dziś niskie
  ryzyko: brak zdjęć/OCR/importu dokumentów do apki, jedyny wektor to tekst pytania usera, już
  traktowany jako dane w `tool_result`, nigdy jako `system`). Szczegóły i uzasadnienia
  architektoniczne: `docs/memory.md`.
- ✅ (2026-09-16) **5.3 (PWA offline-first) — manifest + service worker (Priorytet 2 z audytu
  wyżej).** `app/manifest.ts` (konwencja Next.js Metadata File → `/manifest.webmanifest`),
  `public/sw.js` (ręcznie pisany, bez biblioteki — cache-first dla `/_next/static/*`,
  network-first z fallbackiem do cache dla nawigacji), rejestrowany przez zewnętrzny
  `public/register-sw.js` (`<script src>` w `app/layout.tsx`, tylko produkcja). Ikony 192/512px
  wyrenderowane z istniejącego `public/icon.svg`. Przy okazji naprawiony realny placeholder:
  `app/layout.tsx` miał tytuł "v0 App"/"Created with v0" (nieużywany szkielet v0.app, nigdy
  niewypełniony) — teraz prawdziwa nazwa i opis projektu + `appleWebApp` (instalacja na iOS).
  **Uczciwie zgłoszone, nie ukryte:** ikony (`icon.svg`/`apple-icon.png`/192/512px) to wciąż
  domyślny znak graficzny v0.app, nie własne logo "Inżynier Offgrid Pro" — świadomie
  niezaadresowane w tym zadaniu (decyzja wizualna, nie inżynierska), do rozważenia osobno.
  **Znalezisko przy weryfikacji (poza zakresem tego zadania, zgłoszone i pozostawione na
  wyraźne polecenie właściciela — "poprawki idą z aktualizacją standardu, zaczekaj"):**
  produkcyjna CSP (`next.config.mjs`, 7.3) dopuszcza tylko jeden zahardkodowany hash inline
  skryptu (`WYGLAD_INIT_SCRIPT`) — nie obejmuje inline-skryptów RSC streaming, które Next.js
  generuje na każdej stronie, więc **hydracja Reacta psuje się na każdym ekranie w realnej
  produkcji** (`React error #412`), niezależnie od tego zadania. Zweryfikowane programistycznie
  jako pre-existing (identyczne na `main` sprzed PWA, w izolowanym worktree) — nie spowodowane
  tą zmianą. Rejestracja SW celowo zaprojektowana tak, by NIE zależeć od tej zepsutej hydracji
  (zewnętrzny `<script src>`, nie komponent kliencki w drzewie Reacta) — potwierdzone działające
  mimo błędu CSP. Właściwa naprawa (nonce-per-request zamiast statycznego hasha) czeka na
  aktualizację ze standardu, NIE wykonana teraz na wyraźną prośbę. Zweryfikowane end-to-end
  (Playwright, `pnpm start`, prawdziwa produkcyjna CSP): manifest serwowany poprawnie, SW
  rejestruje się automatycznie, strona odwiedzona wcześniej ładuje się offline (status 200,
  poprawna treść) po przejściu w tryb offline. `pnpm typecheck`/`lint`/`test` (722/722)/`build`
  czyste. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-16, czwarta synchronizacja tego dnia) **Aktualizacja ze standardem — 7 nowych wpisów
  `AKTUALIZACJE.md` (wiersze 67-73), GOD BOOK bez zmiany wersji (nadal v2.19).** Nadpisane:
  `00-INDEKS.md`, `07-bezpieczenstwo.md`, `15-wspolpraca-z-ai.md`, `17-i18n.md`, `18-logowanie.md`.
  **Konkretne zadanie dla tego projektu (wpis 70, 7.3 — "hash CSP liczony automatycznie, nigdy
  ręcznie"):** nowy `scripts/check-csp-hash.mjs` w CI (`pnpm check:csp-hash`) — liczy SHA-256
  `WYGLAD_INIT_SCRIPT` z `app/layout.tsx` i porównuje z `WYGLAD_INIT_SCRIPT_HASH` w
  `next.config.mjs`, blokuje merge przy rozjeździe zamiast polegać na pamięci. Zweryfikowany na
  obu przypadkach (zgodny hash → OK; ręcznie zepsuty skrypt → wykryty, exit 1).
  **🔴 Ważne rozróżnienie, nie pomylić:** ten wpis NIE naprawia krytycznego błędu znalezionego
  przy pracy nad 5.3 (PWA) — produkcyjna CSP nadal blokuje inline-skrypty RSC streaming Next.js
  na każdej stronie (`React error #412`), bo wpis 70 dotyczy tylko ryzyka rozjazdu hasha dla
  JEDNEGO już istniejącego skryptu, nie fundamentalnej niekompatybilności statycznego hasha z
  dynamicznie generowanymi skryptami Next.js. Właściwa naprawa (CSP oparta o nonce-per-request)
  wciąż nie jest częścią standardu — pozostaje odłożona, tak jak ustalono wcześniej dziś.
  Pozostałe wpisy (67-69, 71-73) nie wymagały zmian w kodzie — projekt już zgodny (18.5:
  `createBrowserClient` już usunięty w rozdz. 18; 17.4: cookie+server-side już jedyny mechanizm;
  17.8: pl/en/ru już zbudowane) albo dotyczą innych projektów rodziny/samego mechanizmu U.4.
  Szczegóły: `docs/memory.md`.
- ✅ (2026-09-16, piąta synchronizacja tego dnia) **Naprawiony krytyczny błąd CSP/RSC streaming
  — hydracja Reacta działa poprawnie w produkcji.** Zgłoszony do `wklad-do-standardu.md` (PR #101)
  wcześniej dziś błąd (hash-based CSP blokujący inline-skrypty RSC Next.js na każdej stronie)
  został skonsolidowany przez `new-app-standards` z konkretną, jednoznaczną akcją dla tego
  projektu — nonce-per-request zamiast statycznego hasha. Wdrożone: `middleware.ts` generuje
  losowy nonce (`crypto.randomUUID()`) na każde żądanie, ustawia CSP dynamicznie (`script-src
  'self' 'nonce-{wartość}'`) i przekazuje nonce do `app/layout.tsx` przez nagłówek `x-nonce`
  (odczyt przez `headers()` z `next/headers`) — Next.js automatycznie dokłada ten sam nonce do
  własnych inline-skryptów RSC streaming. `next.config.mjs` już nie ustawia CSP (nie ma dostępu
  do per-request nonce'u w statycznej funkcji `headers()`) — tylko pozostałe, statyczne nagłówki
  bezpieczeństwa. Usunięty `scripts/check-csp-hash.mjs` (nieaktualny — nie ma już hasha do
  weryfikacji).
  **Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`,
  prawdziwa produkcyjna CSP):** zero błędów CSP w konsoli, zero `React error #412`, **interakcja
  po hydracji realnie działa** (zmiana trybu w selektorze przelicza wynik na żywo — dowód, że to
  nie tylko "strona się ładuje", ale że hydracja faktycznie się powiodła), service worker
  rejestruje się automatycznie, offline nadal działa. Dodatkowo zweryfikowany `pnpm dev` (CSP
  złagodzona dla HMR, cookie języka nadal poprawnie ustawiana) — middleware nie regresował.
  `pnpm typecheck`/`lint`/`test` (722/722)/`build` czyste. Szczegóły uzasadnień: `docs/memory.md`.
- ✅ (2026-09-16) **Start rolloutu i18n (moduł po module, 17.9) — pierwsza partia: 3 moduły ponad
  pilotaż.** Zmigrowane do `i18nKey`/`params` (bez gotowego tekstu PL w `Warning.message`/
  `assumptions`): `systemy-podtrzymania-zycia`, `cop-pompy-ciepla`, `lokalizacja-i-klimat` —
  wybrane jako pierwsza partia, bo ich strony UI już korzystały z `useTranslate()`
  (najszybszy realny efekt: tylko treść, UI już podłączone). 8 nowych kluczy w
  `dictionary-{pl,en,ru}.ts`. `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone
  z 1 do 4 pozycji.
  **Realny błąd znaleziony i naprawiony przy tej migracji (nie w tych trzech modułach — w
  stronach UI, które je renderują):** wszystkie trzy strony renderowały ostrzeżenia przez samo
  `{w.message}`, bez fallbacku `?? t(w.i18nKey ?? w.code, w.params)` (w odróżnieniu od
  `assumptions`, które już miały poprawny wzorzec, i od współdzielonego
  `components/wzorce/wynik-szczegoly.tsx`, który też ma to poprawnie) — po usunięciu
  `Warning.message` z tych trzech modułów ostrzeżenia renderowałyby się jako puste. Naprawione
  w `app/kalkulatory/{systemy-podtrzymania-zycia,cop-pompy-ciepla,lokalizacja-i-klimat}/page.tsx`.
  Znalezione przez czytanie kodu przed uruchomieniem, nie przez awarię w przeglądarce — ale
  pokazuje, że "strona już używa `useTranslate()`" nie jest dowodem, że KAŻDA ścieżka renderowania
  na niej faktycznie tłumaczy — trzeba sprawdzić `warnings` i `assumptions` osobno.
  Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`,
  wszystkie 3 moduły × PL/EN/RU, zarówno `assumptions` jak i `warnings`): poprawny przetłumaczony
  tekst, zero znaczników braku klucza (`⚠ [...]`), zero błędów konsoli związanych z i18n. 8 nowych
  testów (parytet/podstawianie parametrów w `t.test.ts` + asercje `i18nKey`/`params`/`message ===
  undefined` w każdym z 3 modułów, zgodnie z 17.9 — test w tej samej turze co treść).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (730/730)/`build` czyste.
  **Pozostało do zrobienia** (świadomie odłożone do kolejnych partii, nie przeoczenie):
  ~86 pozostałych plików `warnings.ts`/`calculator.ts` z gotowym tekstem PL, cała reszta UI
  chrome (Pulpit, Ustawienia, nawigacja, etykiety werdyktu) — 0% zmigrowane. Napotkane, odłożone
  przypadki trudniejsze niż prosty `i18nKey`/`params`: `czystosc-i-snieg` (tekst PL wprost w polu
  `value` wyniku, np. `opis`/`powod` — wymaga zmiany kształtu typu wyniku, nie tylko
  `warnings`/`assumptions`), `porownanie-technologii` (nazwy/opisy technologii bateryjnych w
  `constants.ts` — osobna kategoria danych, nie komunikat). Szczegóły: `docs/memory.md`.
- ✅ (2026-09-18) **Rollout i18n — druga partia: kolejne 3 moduły.** Zmigrowane do `i18nKey`/
  `params`: `liczba-domownikow`, `dni-autonomii`, `moc-pozorna-cosfi` (wszystkie z Modułu 2
  "Zapotrzebowanie energetyczne", jak partia 1). 8 nowych kluczy w `dictionary-{pl,en,ru}.ts`
  (w tym reużycie istniejącego `WARTOSC-NIEDODATNIA` dla `moc-pozorna-cosfi`'s `notPositive` —
  identyczny tekst źródłowy, brak duplikatu). Uwaga: nowy klucz `SPRAWNOSC-PROCENT-POZA-ZAKRESEM`
  (nie `SPRAWNOSC-POZA-ZAKRESEM`, mimo że `dni-autonomii/warnings.ts` ma funkcję o tej nazwie) —
  bo istniejący klucz `SPRAWNOSC-POZA-ZAKRESEM` już oznacza co innego (zakres ułamkowy (0,1],
  z pilota `kalkulatory-pomocnicze`), a `dni-autonomii` waliduje zakres procentowy 0–100% —
  różna semantyka, nie wolno nadpisać/reużyć tego samego klucza. `scripts/check-i18n-guard.mjs`
  → `MIGRATED_MODULES` rozszerzone z 4 do 7 pozycji.
  **Ten sam wzorzec błędu co w partii 1, powtórzony w 2 z 3 stron:** `dni-autonomii/page.tsx` i
  `moc-pozorna-cosfi/page.tsx` renderowały `{w.message}` bez importu `useTranslate()` w ogóle
  (nie tylko brak fallbacku — brak w ogóle mechanizmu tłumaczenia na stronie). Naprawione
  (dodany `useTranslate()` + `?? t(w.i18nKey ?? w.code, w.params)`). `liczba-domownikow/page.tsx`
  był już poprawny — korzysta ze współdzielonego `components/wzorce/wynik-szczegoly.tsx`.
  Potwierdza wniosek z partii 1: sprawdzić rendering `warnings`/`assumptions` na KAŻDEJ stronie
  osobno, "moduł ma i18nKey" nie znaczy "strona go pokaże".
  Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`,
  wszystkie 3 moduły × PL/EN/RU): poprawny przetłumaczony tekst, zero `⚠ [...]`, zero błędów
  konsoli i18n. 8 nowych testów (parytet/podstawianie w `t.test.ts` + asercje `i18nKey`/`params`/
  `message === undefined` w każdym module, ta sama tura co treść, 17.9).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (738/738)/`build` czyste.
  **Pozostało:** ~83 plików. Napotkane, odłożone przypadki jak w partii 1 (`czystosc-i-snieg`,
  `porownanie-technologii`) — bez zmian, nadal czekają na osobną decyzję architektoniczną.
- ✅ (2026-09-18) **Rollout i18n — trzecia partia: 5 modułów `baterie/`, decyzja o kontynuacji do
  końca (83 pliki).** Właściciel poprosił o kontynuację bez przerw aż do wyczerpania listy — od
  tej partii PR-e obejmują większe partie modułów (nie po 3), żeby ograniczyć liczbę cykli
  PR/CI/merge na tak dużą liczbę plików. Zmigrowane: `chlodzenie-latem`, `cold-c-rate`,
  `cold-cranking-amps`, `detekcja-doziemienia`, `detekcja-zwarcia-efuse`. 18 nowych kluczy w
  `dictionary-{pl,en,ru}.ts` (w tym `WARTOSC-UJEMNA` — nowy generyczny klucz `{label}` dla
  wzorca "nie może być ujemna", odróżniony od istniejącego `WARTOSC-NIEDODATNIA`/`ZAPOTRZEBOWANIE-UJEMNE",
  bo semantyka >=0 vs >0 jest różna). `WARTOSC-NIEDODATNIA` reużyty w `detekcja-zwarcia-efuse`
  (identyczny tekst źródłowy). `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 7 do 12.
  **Trzeci raz ten sam wzorzec błędu w stronach UI:** `chlodzenie-latem`, `cold-c-rate`,
  `detekcja-zwarcia-efuse`, `detekcja-doziemienia` renderowały `{w.message}` bez fallbacku (2 z
  nich bez `useTranslate()` w ogóle). Naprawione. **Dodatkowo znaleziony i naprawiony osobny,
  niezależny od i18n błąd:** `cold-cranking-amps/page.tsx` w gałęzi sukcesu w ogóle nie
  przekazywało `warnings` do `WynikSzczegoly` — ostrzeżenie „Falownik się wyłączy”/„Falownik
  utrzyma napięcie” nigdy się nie wyświetlało, niezależnie od i18n. Dopisano `warnings={result.warnings}`.
  **Pułapka narzędziowa złapana podczas weryfikacji:** stary proces `next-server` z partii 2
  (uruchomiony przez `pnpm start`, nie zabity poprawnie poprzednim `pkill -f "next start"` — nazwa
  procesu to `next-server`, nie `next start`) wciąż nasłuchiwał na porcie 3000 i serwował
  przestarzały build bez nowych kluczy słownika — dał fałszywy `⚠ [BRAK-ZABEZPIECZENIA-DOZIEMIENIA]`
  w pierwszym przebiegu Playwright. Naprawione: `pkill -9 -f "next-server"` (dokładna nazwa
  procesu), rebuild + restart, powtórna weryfikacja czysta. Zapamiętane dla kolejnych partii:
  zawsze zabijać serwer po dokładnej nazwie procesu (`ps aux | grep next-server`), nie zgadywać
  nazwy komendy startowej.
  8 nowych testów domenowych + rozszerzony blok w `t.test.ts` (12 kluczy z parametrami/6 bez).
  Zweryfikowane end-to-end w przeglądarce (Playwright, świeży `pnpm build && pnpm start`) w PL/EN/RU
  — zero `⚠ [...]`, zero błędów konsoli i18n. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test`
  (746/746)/`build` czyste. **Pozostało ~76 plików**, `czystosc-i-snieg`/`porownanie-technologii`
  nadal odłożone bez zmian.
- ✅ (2026-09-18) **Rollout i18n — czwarta partia: 5 modułów `baterie/` + rozszerzenie strażnika
  o `validation.ts`.** Zmigrowane: `dobor-bezpiecznika-dc`, `dobor-pojemnosci`, `grzalki-bms-mroz`,
  `kalibracja-soc`, `koniec-ladowania`. 22 nowe klucze (w tym 2 retroaktywne poprawki dla już
  zmigrowanych modułów, patrz niżej). `komunikacja-bms` (kolejny kandydat w kolejce) **odłożony,
  dołączony do zbioru "dane katalogowe"** obok `porownanie-technologii` — jego ostrzeżenia
  wstawiają etykiety protokołów z `PROTOKOLY` (`constants.ts`), z których 2 z 5 zawierają polski
  tekst ("Pylontech (protokół producenta)", "Inny / nieznany") — migracja samego `Warning` bez
  migracji katalogu dałaby pół-przetłumaczony komunikat, ten sam problem architektoniczny co
  katalog technologii bateryjnych.
  **Znaleziona luka w strażniku i18n:** `scripts/check-i18n-guard.mjs` sprawdzał tylko
  `warnings.ts`/`calculator.ts`, nigdy `validation.ts` — a dwa moduły (jeden już zmigrowany w
  partii 3: `chlodzenie-latem`, jeden w tej partii: `koniec-ladowania`) miały twardy tekst PL
  wpisany bezpośrednio jako inline `Warning` w `validation.ts`, poza `warnings.ts`. Naprawione:
  `FILES_TO_CHECK` rozszerzone o `validation.ts`; oba znalezione przypadki zmigrowane
  (`TEMPERATURA-FIZYCZNIE-NIEMOZLIWA`, `PROG-KONCOWY-POZA-ZAKRESEM`), z testem dopisanym do
  `chlodzenie-latem.test.ts` retroaktywnie. **Zasada do zapamiętania:** przy każdym module od tej
  partii sprawdzać `grep -n message: validation.ts` obok `warnings.ts`/`calculator.ts` — twardy
  tekst potrafi być wpisany inline w walidacji, nie tylko przez funkcje z `warnings.ts`.
  3 strony UI naprawione (ten sam wzorzec `{w.message}` bez fallbacku, jak w partiach 1-3).
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 12 do 17.
  7 nowych testów domenowych + rozszerzony blok w `t.test.ts`. Zweryfikowane end-to-end w
  przeglądarce (Playwright, świeży `pnpm build && pnpm start`, z potwierdzeniem że proces
  faktycznie zszedł przed startem — pułapka z poprzedniej partii) w PL/EN/RU — zero `⚠ [...]`.
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (753/753)/`build` czyste.
  **Pozostało ~71 plików** (+1 nowo odłożony: `komunikacja-bms`).
- ✅ (2026-09-18) **Rollout i18n — piąta partia: 5 modułów `baterie/`, wzorzec sezonowy.**
  Zmigrowane: `long-term-storage`, `mixing-rownolegle`, `modul-ev`, `obwod-precharge`,
  `pobor-wlasny-bms`. 15 nowych kluczy.
  **Nowy wzorzec pułapki znaleziony i naprawiony przed shipem (nie po):** `modul-ev`'s
  `pokryteWCalosci(sezon)`/`brakujeEnergii(sezon, brakKwh)` przyjmowały dosłowny polski tekst
  `"Latem"`/`"Zimą"` jako parametr `sezon`, wstawiany bezpośrednio do treści ostrzeżenia. Gdyby
  zmigrowano to naiwnie (`i18nKey` + `params: {sezon}`), słowo "Latem"/"Zimą" zostałoby wstawione
  dosłownie w środku przetłumaczonego zdania angielskiego/rosyjskiego — pół-przetłumaczony
  komunikat, dokładnie ten sam problem co katalog `komunikacja-bms`/`porownanie-technologii`, ale
  tym razem możliwy do naprawienia bez architektonicznej przebudowy (tylko 2 stałe warianty, nie
  otwarty katalog). Rozwiązanie: `warnings.ts` przyjmuje teraz identyfikator `Sezon = "lato" |
  "zima"` (nie wyświetlany tekst), a i18nKey jest wybierany warunkowo (`POKRYTE-W-CALOSCI-LATO`/
  `-ZIMA`, `BRAKUJE-ENERGII-LATO`/`-ZIMA`) — sezon zaszyty w przetłumaczonym tekście klucza, nie
  przekazywany jako `{param}`. `calculator.ts` zmieniony, żeby wołać `pokryteWCalosci("lato")`
  zamiast `pokryteWCalosci("Latem")`. **Zasada do zapamiętania dla kolejnych partii:** jeśli
  funkcja `warnings.ts` przyjmuje string, który jest jednocześnie (a) wyświetlanym tekstem PL i
  (b) parametrem sterującym wyborem treści (a nie czystą liczbą/etykietą pola) — sprawdzić, czy to
  nie jest zamknięty, mały zbiór wariantów (→ osobne klucze per wariant, jak tutaj) czy otwarty
  katalog (→ odłożyć, jak `komunikacja-bms`).
  3 strony naprawione (ten sam wzorzec `{w.message}` bez fallbacku).
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 17 do 22.
  8 nowych testów domenowych (w tym test wprost sprawdzający, że `POKRYTE-W-CALOSCI-LATO` ≠
  `-ZIMA` w każdym języku — regresja tego wzorca byłaby niewidoczna bez takiego testu) +
  rozszerzony blok w `t.test.ts`. Zweryfikowane end-to-end w przeglądarce (Playwright, świeży
  `pnpm build && pnpm start`, z potwierdzeniem `ps aux | grep next-server` przed i po) w PL/EN/RU
  — zero `⚠ [...]`, spot-check `modul-ev`/EN potwierdził "Summer:"/"Winter:" zamiast
  "Latem:"/"Zimą:" w przetłumaczonym zdaniu. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test`
  (761/761)/`build` czyste. **Pozostało ~66 plików.** `napiecie-systemowe` (377 linii) świadomie
  odłożony do osobnej partii ze względu na rozmiar.
- ✅ (2026-09-18) **Rollout i18n — szósta partia: 5 modułów `baterie/`, dwie kolejne przeoczone
  wiadomości inline w `validation.ts` znalezione i naprawione.** Zmigrowane: `ochrona-wilgoc`,
  `oplacalnosc-magazynu`, `pozycjonowanie-ogniw`, `second-life`, `slabe-ogniwo`. 22 nowe klucze.
  Strażnik i18n (rozszerzony w partii 4 o `validation.ts`) złapał — jeszcze przed shipem, nie po —
  inline `Warning` z gotowym tekstem PL w `pozycjonowanie-ogniw/validation.ts`
  (`DOCISK-UJEMNY`) oraz w `second-life/calculator.ts` (`SOH-ZEROWY`, inline literal, nie funkcja
  z `warnings.ts`) — oba naprawione w tej samej turze.
  5 stron UI naprawionych (ten sam wzorzec `{w.message}` bez fallbacku, jak w partiach 1-5).
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 22 do 27.
  9 nowych testów domenowych + rozszerzony blok w `t.test.ts` (13 kluczy z parametrami/9 bez).
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, `pnpm build && pnpm start`, z
  potwierdzeniem `ps aux | grep next-server` = puste przed startem) w PL/EN/RU — zero `⚠ [...]`.
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (768/768)/`build` czyste.
  **Pozostało ~61 plików.** `napiecie-systemowe`, `czystosc-i-snieg`, `porownanie-technologii`,
  `komunikacja-bms` nadal odłożone.
- ✅ (2026-09-18) **Rollout i18n — siódma partia: 5 modułów `baterie/`, zamyka "normalne" moduły
  tego katalogu.** Zmigrowane: `soh-per-ogniwo`, `starzenie-degradacja`,
  `szyny-zbiorcze-miedzypakietowe`, `topologia-bms`, `vehicle-to-home`. 16 nowych kluczy.
  2 strony UI naprawione (ten sam wzorzec `{w.message}` bez fallbacku: `soh-per-ogniwo`,
  `topologia-bms`) — pozostałe 3 strony modułów tej partii już poprawnie korzystały z
  `WynikSzczegoly`. `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 27 do 32.
  5 nowych bloków testowych domenowych (`it("i18n (17.2): ...")` per moduł) + nowy blok w
  `t.test.ts` (6 kluczy z parametrami/10 bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test`
  (775/775)/`build` czyste. Zweryfikowane end-to-end w świeżej przeglądarce (Playwright,
  `pnpm build && pnpm start`, z potwierdzeniem `ps aux | grep next-server` = puste przed startem
  i po zatrzymaniu) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) — zero `⚠ [...]`.
  **To zamyka wszystkie "normalne" moduły katalogu `baterie/`** — pozostają w nim tylko odłożone:
  `napiecie-systemowe` (rozmiar), `porownanie-technologii`, `komunikacja-bms` (katalog danych).
  **Pozostało ~56 plików** poza katalogiem `baterie/`: `okablowanie/` (~15), `pv/` (~10, bez
  odłożonego `czystosc-i-snieg`), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1) — kolejna partia zacznie od `okablowanie/`.
- ✅ (2026-09-18) **Rollout i18n — ósma partia: pierwsze 5 modułów `okablowanie/`.** Zmigrowane:
  `analiza-zwarciowa`, `dobor-bezpiecznika-rozlacznika`, `dobor-izolacji-kabla`,
  `dobor-mocy-falownika`, `dobor-przekroju-kabla`. 27 nowych kluczy (moduł
  `dobor-przekroju-kabla` sam wniósł 11 — największy, najbardziej rozbudowany moduł tej partii:
  1 błąd walidacji + 6 funkcji ostrzeżeń + 4 assumptions). 3 klucze reużyte z istniejącego
  słownika po weryfikacji identyczności tekstu 1:1 (`WARTOSC-NIE-MOZE-BYC-UJEMNA` — 3×,
  `MODEL-ZWARCIA-PROSTEGO-NIZSZY` z Modułu 4 — trafne dopasowanie treści między modułami,
  nie tylko nazwy). Strażnik złapał kolejne 3 inline `Warning` z gotowym tekstem PL wpisane
  wprost w `dobor-bezpiecznika-rozlacznika/validation.ts` (`PRAD-ZNAMIONOWY-NIEDODATNI`,
  `PRAD-ZWARCIOWY-UJEMNY`, `AIC-UJEMNE`) — czwarty raz z rzędu, gdy rozszerzenie strażnika o
  `validation.ts` (partia 4) faktycznie wykrywa realną regresję przed shipem.
  1 strona UI naprawiona (`dobor-przekroju-kabla` — ten sam wzorzec `{w.message}` bez
  fallbacku ORAZ brak przekazania `warnings` do `WynikSzczegoly`, jak w `cold-cranking-amps`
  partii 3) — pozostałe 4 strony tej partii już poprawnie korzystały z `WynikSzczegoly`.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 32 do 37.
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (12 kluczy z parametrami/15
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (782/782)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z potwierdzeniem braku
  rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) —
  zero `⚠ [...]`.
  **Pozostało ~51 plików**: `okablowanie/` (~10 pozostałych z 23 istniejących modułów), `pv/`
  (~10), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6), `bezpieczenstwo/` (~2),
  `kalkulator-mobilny/` (~1) — kolejna partia kontynuuje `okablowanie/`.
- ✅ (2026-09-18) **Rollout i18n — dziewiąta partia: kolejne 5 modułów `okablowanie/`.**
  Zmigrowane: `glowna-szyna-wyrownawcza`, `laczenie-cu-al`, `ochrona-odwrotna-polaryzacja`,
  `ochrona-przepieciowa-spd`, `optymalizacja-trasy-kabla`. 27 nowych kluczy, 1 klucz reużyty
  1:1 (`WARTOSC-NIE-MOZE-BYC-UJEMNA` — 2×). 1 strona UI naprawiona (`glowna-szyna-wyrownawcza` —
  ten sam wzorzec `{w.message}` bez fallbacku i18n, tym razem wewnątrz `WerdyktPanel` bez
  `WynikSzczegoly`, naprawione wprost przez `useTranslate()` w stronie) — pozostałe 4 strony tej
  partii już poprawnie korzystały z `WynikSzczegoly`.
  🔴 **Znaleziony i naprawiony realny bug regresyjny (nie tylko literał tekstu):**
  `optymalizacja-trasy-kabla/calculator.ts` echuje krytyczne ostrzeżenia z
  `dobor-przekroju-kabla` (zmigrowany w partii 8) przez `trasaNieSpelniaWymagan(oznaczenie,
  w.message ?? w.code)` — od partii 8 `w.message` tego echa jest `undefined` (moduł zmigrowany
  nie ustawia już `message`), więc fallback pokazywałby surowy `w.code` (np.
  "PRZEKROJ-PONIZEJ-WYLICZONEGO") zamiast przetłumaczonego tekstu. Naprawione architektonicznie,
  nie kosmetycznie: `trasaNieSpelniaWymagan(oznaczenie)` teraz zwraca tylko ogólną etykietę
  ("Trasa X nie spełnia wymagań przekroju — zobacz szczegóły poniżej", nowy klucz
  `TRASA-NIE-SPELNIA-WYMAGAN-PRZEKROJU`), a oryginalne ostrzeżenia echa (z ich `i18nKey`/`params`
  nienaruszone) są dociągane do wyniku obok, oznaczone `field: "trasaA"/"trasaB"` — żadny
  tekst nie jest spłaszczany do stringa w warstwie domenowej. Zweryfikowane end-to-end w
  przeglądarce (pełny wydruk `innerText` dla scenariusza z partii testowej, PL) — oba poziomy
  komunikatu (etykieta + szczegół) wyświetlają się poprawnie przetłumaczone.
  3 stringowe `assumptions` (w `ochrona-odwrotna-polaryzacja`, `ochrona-przepieciowa-spd`,
  `optymalizacja-trasy-kabla` ×4) skonwertowane na `{kod}`.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 37 do 42 (żadnych inline
  literałów w `validation.ts` tej partii — strażnik przeszedł czysto bez nowych wykryć).
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (7 kluczy z parametrami/14
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (790/790)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z potwierdzeniem braku
  rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) —
  zero `⚠ [...]`.
  **Pozostało ~46 plików**: `okablowanie/` (5 pozostałych: `pomiary-powykonawcze`,
  `string-box`, `uziemienie-funkcjonalne-ochronne`, `wylaczniki-nadpradowe-dc`,
  `wylaczniki-rcd` — zamyka katalog), `pv/` (~10), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1) — partia 10 kończy `okablowanie/`.
- ✅ (2026-09-19) **Rollout i18n — dziesiąta partia: ostatnie 5 modułów `okablowanie/`,
  zamyka cały katalog.** Zmigrowane: `pomiary-powykonawcze`, `string-box`,
  `uziemienie-funkcjonalne-ochronne`, `wylaczniki-nadpradowe-dc`, `wylaczniki-rcd`. 32 nowe
  klucze, 3 klucze reużyte 1:1 (`WARTOSC-NIE-MOZE-BYC-UJEMNA` — 3×). 6 stringowych
  `assumptions` skonwertowanych na `{kod}`. Wszystkie 5 stron UI już poprawnie korzystały z
  `WynikSzczegoly` — brak napraw stron w tej partii (pierwszy raz od partii 6).
  Znalezione i naprawione proaktywnie (przed uruchomieniem strażnika, czytaniem kodu) 3
  inline `Warning` z gotowym tekstem PL wpisane wprost w `string-box/validation.ts`
  (`LICZBA-STRINGOW-UJEMNA`, `LICZBA-WEJSC-UJEMNA`, `BEZPIECZNIK-STRINGOWY-UJEMNY`) — piąty
  raz z rzędu to samo źródło regresji, ten sam wzorzec co w partiach 4, 6, 8.
  Dwa bliskie kolizje nazw kluczy rozstrzygnięte przez porównanie treści (nie tylko nazwy
  kodu): `wylaczniki-nadpradowe-dc`'s `AIC-PONIZEJ-PRADU-ZWARCIOWEGO` (kod) i `assumptions`
  tekst o AIC vs prąd zwarciowy miały bliskie, ale NIE identyczne odpowiedniki w istniejącym
  słowniku (`AIC-PONIZEJ-PRADU-ZWARCIOWEGO` z Modułu 4 — inny tekst; `AIC-NIE-SPRAWDZONA-WOBEC-ZWARCIA`
  z partii 8 — różni się słowem "łączeniowa" vs "wyłączania") — oba dostały odrębne, nowe
  klucze (`AIC-WYLACZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO`, `AIC-WYLACZANIA-NIE-SPRAWDZONA-WOBEC-ZWARCIA`)
  zamiast błędnego reużycia.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 42 do 47.
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (9 kluczy z parametrami/24
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (797/797)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z potwierdzeniem braku
  rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) —
  zero `⚠ [...]`.
  **To zamyka cały katalog `okablowanie/`** (23 moduły — 18 zmigrowanych w partiach 8-10,
  5 wcześniej bez `message:` do migracji).
  **Pozostało ~41 plików**: `pv/` (~10), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1) — kolejna partia zaczyna `pv/`.
- ✅ (2026-09-19) **Rollout i18n — jedenasta partia: pierwsze 5 modułów `pv/`.** Zmigrowane:
  `dopasowanie-tablicy-falownika`, `konfigurator-stringow`, `napor-wiatru`,
  `niedopasowanie-paneli`, `ochrona-stringow`. `czystosc-i-snieg` (katalog `pv/`) pominięty —
  świadomie odłożony wcześniej (dane katalogowe). 41 nowych kluczy, 3 klucze reużyte 1:1
  (`WARTOSC-NIE-MOZE-BYC-UJEMNA` — 3×).
  Zweryfikowany brak zależności echo na `Warning[]` tego modułu z innych kalkulatorów przed
  migracją (lekcja z partii 9) — `dopasowanie-tablicy-falownika` importuje tylko czystą funkcję
  liczbową `obliczNapiecieStringuZimowego` z `stress-test-mppt` (nie odwrotnie, nie echo
  ostrzeżeń), a domniemana zależność `napiecie-systemowe` → `dopasowanie-tablicy-falownika`
  (Etap G) została usunięta z kodu 14.09.2026 — potwierdzone grepem, nie z komentarza.
  `konfigurator-stringow/warnings.ts`: `notPositive`/`notWholeNumber` przestały przyjmować
  polską etykietę pola jako parametr runtime (nietłumaczalny string wpisany na miejscu wywołania)
  — zamiast tego każde pole ma własny klucz słownika (np. `VMPV-NIEDODATNI`,
  `LICZBAPANELI-NIE-CALKOWITA`), z etykietą już przetłumaczoną w treści klucza, tak jak
  `Warning.code` (`field.toUpperCase()+"-NIEDODATNI"`) już to robił — `i18nKey` = `code`.
  8 stringowych `assumptions` (w tym jeden z interpolacją liczb) skonwertowanych na `{kod}`/`{kod,params}`.
  Wszystkie 5 stron UI już poprawnie korzystało z `WynikSzczegoly` — brak napraw stron.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 47 do 52.
  5 nowych bloków testowych domenowych (w tym poprawka istniejącej asercji na string assumption
  w `konfigurator-stringow`, która musiała się zmienić na `{kod}`) + nowy blok w `t.test.ts`
  (20 kluczy z parametrami/17 bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test`
  (804/804)/`build` czyste. Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z
  potwierdzeniem braku rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki =
  15 sprawdzeń) — zero `⚠ [...]`.
  **Pozostało ~36 plików**: `pv/` (5 pozostałych: `panele-bifacjalne`, `straty-okablowanie-dc`,
  `straty-zlaczki-mc4`, `stress-test-mppt`, `wplyw-temperatury`, plus `zacienienie-diody-bocznikujace`
  — czyli 6, nie 5, patrz uwaga niżej), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1).
  ⚠ Uwaga do partii 12: `stress-test-mppt` jest ECHOWANY przez `dopasowanie-tablicy-falownika`
  (funkcja czysta `obliczNapiecieStringuZimowego`, bez `Warning[]`) — bezpieczne wobec migracji,
  ale sprawdzić ponownie przy właściwej migracji `stress-test-mppt`, nie zakładać z góry.
- ✅ (2026-09-19) **Rollout i18n — dwunasta partia: kolejne 5 modułów `pv/`.** Zmigrowane:
  `panele-bifacjalne`, `straty-okablowanie-dc`, `straty-zlaczki-mc4`, `stress-test-mppt`,
  `wplyw-temperatury`. Zweryfikowane przed migracją (grepem): brak żadnego żywego importu
  `Warning[]` z `stress-test-mppt` spoza jego własnej strony — echo z `dopasowanie-tablicy-falownika`
  (partia 11) woła tylko czystą funkcję liczbową, potwierdzone ponownie, nie założone.
  38 nowych kluczy, 5 kluczy reużytych 1:1 (`WARTOSC-NIE-MOZE-BYC-UJEMNA` — 5×). 6 stringowych
  `assumptions` skonwertowanych na `{kod}`.
  🔴 **Znaleziony i naprawiony realny bug funkcjonalny (nie tylko i18n)** —
  `wplyw-temperatury/page.tsx`, ścieżka VALID (główny, sukcesowy wynik obliczenia) w ogóle nie
  przekazywała `warnings={result.warnings}` do `WynikSzczegoly` — jedyne ostrzeżenie tego
  kalkulatora (`utrataMocy`, poziom `info`, główna treść informacyjna ekranu: "Panel przy X°C
  traci Y% mocy...") było całkowicie niewidoczne dla użytkownika w normalnym, powodzeniowym
  przebiegu, nie tylko nieprzetłumaczone. Naprawione jednym dopisaniem propsa; zweryfikowane
  pełnym wydrukiem `innerText` przed i po (ostrzeżenie teraz widoczne). Pozostałe 4 strony tej
  partii już poprawnie korzystały z `WynikSzczegoly`.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 52 do 57.
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (10 kluczy z parametrami/6
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (811/811)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z potwierdzeniem braku
  rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) —
  zero `⚠ [...]`.
  **Pozostał 1 plik w `pv/`:** `zacienienie-diody-bocznikujace` — partia 13 połączy go z
  początkiem kolejnego katalogu (`zapotrzebowanie/`, ~8 plików) albo zamknie samodzielnie,
  zależnie od rozmiaru po odczytaniu.
  **Pozostało ~31 plików** poza `pv/`: `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1), plus 1 z `pv/` wyżej.
- ✅ (2026-09-19) **Rollout i18n — trzynasta partia: zamyka katalog `pv/` + pierwsze 4 moduły
  `zapotrzebowanie/`.** Zmigrowane: `zacienienie-diody-bocznikujace` (pv/, ostatni plik),
  `agregat-pradotworczy`, `bojler-cwu`, `bufor-rozbudowe`, `load-shedding` (zapotrzebowanie/).
  Zweryfikowane grepem przed startem: brak echo-zależności `Warning[]` dla żadnego z 5 modułów.
  30 nowych kluczy, 2 klucze reużyte 1:1 (`WARTOSC-NIE-MOZE-BYC-UJEMNA`, `SOC-POZA-ZAKRESEM` —
  ten drugi znaleziony byte-identycznie w istniejącym słowniku po weryfikacji treści, nie tylko
  nazwy). Jedna bliska kolizja rozstrzygnięta przez porównanie treści: `bufor-rozbudowe`'s
  `notPositive` miał tekst różny od istniejącego `ZAPOTRZEBOWANIE-NIEDODATNIE` — dostał odrębny
  klucz `ZAPOTRZEBOWANIE-CALKOWITE-NIEDODATNIE`.
  Drugi przypadek "etykieta pola jako nietłumaczalny parametr runtime" (pierwszy: partia 11,
  `konfigurator-stringow`) — `agregat-pradotworczy`'s `notPositive(field, label, value)` miał
  ten sam problem, naprawiony tym samym wzorcem (`i18nKey` = `code`, etykieta wpisana per pole w
  słowniku, parametr `label` usunięty z sygnatury).
  2 warunkowe funkcje ostrzeżeń (`buforInfo`, `odbiornikAktywny`) zwracały różny TEKST zależnie
  od warunku (nie tylko różne parametry tego samego szablonu) — rozbite na 2 odrębne klucze
  każda (`BUFOR-BRAK`/`BUFOR-DOLICZONY`, `ODBIORNIK-AKTYWNY-PRIORYTET-1`/`ODBIORNIK-AKTYWNY`),
  wybór klucza przeniesiony do logiki `warnings.ts`.
  🔴 **3 kolejne strony UI naprawione (ten sam wzorzec manualnego `{w.message}` bez fallbacku,
  czwarty-szósty przypadek w tej rundzie)**: `agregat-pradotworczy` (podwójny bug — manualny
  render ORAZ brak `warnings` w sąsiednim `WynikSzczegoly`, jak `cold-cranking-amps`/
  `dobor-przekroju-kabla`), `bufor-rozbudowe` i `load-shedding` (obie strony nie importowały
  nawet `WynikSzczegoly` — czysto manualny render bez żadnego fallbacku i18n). Wszystkie 3
  naprawione tym samym wzorcem (usunięcie manualnego `.map`, import + wywołanie
  `WynikSzczegoly` z `warnings`/`assumptions`). Zweryfikowane pełnym wydrukiem `innerText` dla
  wszystkich trzech — treść ostrzeżeń teraz widoczna i poprawnie przetłumaczona.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 57 do 62.
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (9 kluczy z parametrami/18
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (818/818)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z potwierdzeniem braku
  rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) —
  zero `⚠ [...]`.
  **To zamyka cały katalog `pv/`** (12 modułów zmigrowanych w partiach 11-13, plus
  `czystosc-i-snieg` świadomie odłożony).
  **Pozostało ~27 plików**: `zapotrzebowanie/` (4 pozostałe: `pobor-wlasny-falownika`,
  `profil-astronomiczny`, `przetwornice-dcdc`, `sezonowosc`), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1). Zweryfikować dokładną listę grepem na
  starcie partii 14, nie z tej metryczki.

- ✅ (2026-09-19) **Rollout i18n — czternasta partia: zamyka katalog `zapotrzebowanie/`.**
  Zmigrowane: `pobor-wlasny-falownika`, `profil-astronomiczny`, `przetwornice-dcdc`, `sezonowosc`
  (ostatnie 4 pliki katalogu). 19 nowych kluczy (przeliczone programistycznie, nie 22 jak
  wstępnie liczone), zero kolizji.
  Czwarty przypadek "etykieta pola jako nietłumaczalny parametr runtime" — `przetwornice-dcdc`'s
  `notPositive`, naprawiony tym samym wzorcem. Drugi przypadek "różny tekst zależnie od warunku,
  nie tylko różne parametry" — `profil-astronomiczny`'s `nocPolarnaLubDzienPolarny`, rozbite na
  `NOC-POLARNA`/`DZIEN-POLARNY`.
  🔴 **Dryf znaleziony w module z wcześniejszej, już zamkniętej partii** (`baterie/pobor-wlasny-bms`,
  nie część listy plików tej partii) — ten sam anty-wzorzec "etykieta jako parametr" w kluczu
  `POBOR-UJEMNY`, naprawiony od razu zgodnie z wyjątkiem CLAUDE.md dla dryfu bez świadomej decyzji
  (nie zgłaszany jako konflikt — to błąd, nie decyzja do zatwierdzenia).
  🔴 **4 kolejne strony UI naprawione (siódmy-dziesiąty przypadek w tej rundzie)**:
  `pobor-wlasny-falownika`/`sezonowosc` (czysto manualny render, brak importu `WynikSzczegoly`),
  `profil-astronomiczny`/`przetwornice-dcdc` (podwójny bug — manualny render ORAZ brak `warnings`
  w sąsiednim `WynikSzczegoly`, jak `agregat-pradotworczy` p.13). Wszystkie 4 naprawione tym samym
  wzorcem, zweryfikowane pełnym wydrukiem `innerText` przed/po dla obu stron z podwójnym bugiem.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 62 do 66.
  4 nowe bloki testowe domenowe + nowy blok w `t.test.ts` (4 klucze z parametrami/15 bez).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (833/833)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, potwierdzenie braku rezydualnego
  `next-server` przed i po) w PL/EN/RU (4 moduły × 3 języki = 12 sprawdzeń) — zero `⚠ [...]`.
  **To zamyka cały katalog `zapotrzebowanie/`** (8 modułów zmigrowanych w partiach 13-14).
  🔴 **Korekta szacunku pozostałych plików — poprzednie "~27" nie uwzględniało katalogu
  `montaz-baterii/` w ogóle.** Programistyczna weryfikacja (`find` + grep `message:` w każdym
  pozostałym `warnings.ts`) ujawniła realny pozostały zakres: **21 modułów** — `ogrzewanie/` (6,
  zgodne z szacunkiem), `montaz-baterii/` (12, **nowo odkryty katalog**), `bezpieczenstwo/` (2,
  zgodne), `kalkulator-mobilny/` (1, zgodne). Świadomie odłożone bez zmian: `pv/czystosc-i-snieg`,
  `baterie/komunikacja-bms`, `baterie/porownanie-technologii` (dane katalogowe). Do potwierdzenia
  na starcie partii 15: status `baterie/napiecie-systemowe` (7× `message:` — możliwe, że już
  objęty inną decyzją z wcześniejszej sesji, nie zakładać z góry). Pełne uzasadnienie i lista
  modułów: `docs/memory.md`, wpis "czternasta partia". Kolejna partia (15.): start `ogrzewanie/`.

- ✅ (2026-09-19) **Rollout i18n — piętnasta partia: zamyka cały katalog `ogrzewanie/` (6
  modułów, jedna partia).** Zmigrowane: `bufor-ciepla`, `infiltracja-powietrza`,
  `kociol-elektryczny`, `pompy-cyrkulacyjne`, `ryzyko-niskiego-napiecia`,
  `wentylacja-odzysk-ciepla`. 21 nowych kluczy, 2 reużyte po weryfikacji treści
  (`WARTOSC-NIE-MOZE-BYC-UJEMNA`, `COP-POZA-ZAKRESEM`).
  **Pierwsza partia w całej rundzie bez żadnego znalezionego bugu UI** — wszystkie 6 stron już
  poprawnie przekazywały `warnings` do `WynikSzczegoly` na obu ścieżkach. Zero nowych wystąpień
  anty-wzorca "etykieta jako parametr" i wzorca "różny tekst zależnie od warunku" — obie funkcje
  generyczne (`wartoscUjemna`) i warunkowe (`buforZaMaly`/`buforWystarczajacy` itp.) już były
  napisane poprawnie od początku. Jedna bliska kolizja: `SPRAWNOSC-POZA-ZAKRESEM` (istniejący,
  zakres ułamkowy) vs tekst procentowy `wentylacja-odzysk-ciepla` → nowy klucz
  `SPRAWNOSC-REKUPERATORA-POZA-ZAKRESEM`. Naprawiony jeden inline literał `Warning` w
  `pompy-cyrkulacyjne/validation.ts` (poza `warnings.ts`).
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 66 do 72.
  6 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (10 kluczy z parametrami/11
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (857/857)/`build` czyste — testy
  przeszły od razu, bez korekty wartości po pierwszym biegu.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, potwierdzenie braku rezydualnego
  `next-server` przed i po) w PL/EN/RU (6 modułów × 3 języki = 18 sprawdzeń) — zero `⚠ [...]`.
  **Pozostały zakres z realnym tekstem do migracji**: `montaz-baterii/` (12 modułów, nowo odkryty
  w partii 14), `bezpieczenstwo/` (2), `kalkulator-mobilny/` (1) = **15 modułów**. Pełne
  uzasadnienie: `docs/memory.md`, wpis "piętnasta partia". Kolejna partia (16.): start
  `montaz-baterii/` (zweryfikować grepem, czy lista 12 modułów z partii 14 jest wciąż aktualna).

- ✅ (2026-09-19) **Rollout i18n — szesnasta partia: start katalogu `montaz-baterii/`.**
  🔴 Korekta: ponowne przeliczenie grepem pokazało **11 modułów** z realnym tekstem, nie 12 —
  drobny błąd liczenia w partii 14 (moduł `ocena-zuzycia` przeoczony przy ręcznym przepisywaniu
  listy), skorygowany programistycznie.
  Zmigrowane (pierwsze 5 z 11): `balansery-zewnetrzne-olow`, `demontaz-pakietu`,
  `gestosc-elektrolitu`, `montaz-mechaniczny`, `ocena-zasiarczenia`. 12 nowych kluczy, zero
  kolizji.
  Echo-zależności zweryfikowane: `montaz-mechaniczny` faktycznie echuje `Warning[]` z
  `baterie/pozycjonowanie-ogniw` (`dociskZaDuzy`/`dociskZaMaly`) — potwierdzone już zmigrowany,
  bezpieczne.
  **Nowy podtyp wzorca "różny tekst zależnie od warunku": zgodność liczby/rodzaju
  (singular/plural)** — `ocena-zasiarczenia`'s ternary `objaw`/`objawy` wewnątrz szablonu (nie
  dwie różne sytuacje domenowe, tylko odmiana gramatyczna). Rozwiązanie: dwa klucze
  (`OBJAWY-ZASIARCZENIA-JEDEN`/`OBJAWY-ZASIARCZENIA-WIELE`), wybór w `warnings.ts`. Świadome
  ograniczenie: nie skaluje się do pełnej polskiej odmiany 1/2-4/5+ (katalog ma tylko 4 pozycje,
  nigdy nie sięga trzeciego wariantu) — nie zakładać z góry w kolejnych partiach.
  🔴 **2 kolejne strony UI naprawione** (jedenasty-dwunasty przypadek w rundzie): `demontaz-
  pakietu` (manualny render na ścieżce głównej, mimo że `WynikSzczegoly` był już importowany dla
  ścieżki błędu) i `ocena-zasiarczenia` (brak importu `WynikSzczegoly` wcale). Zweryfikowane
  pełnym wydrukiem `innerText`.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 72 do 77.
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (6 kluczy z parametrami/6 bez).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (872/872)/`build` czyste — testy przeszły od
  razu.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, potwierdzenie braku rezydualnego
  `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) — zero `⚠ [...]`.
  **Pozostało w `montaz-baterii/`: 6 modułów** — `pierwsze-uruchomienie`, `podlaczenie-bms`,
  `ratowanie-ogniwa`, `sekwencja-montazu`, `weryfikacja-ogniw`, `ocena-zuzycia`. Pełne
  uzasadnienie: `docs/memory.md`, wpis "szesnasta partia". Kolejna partia (17.): dokończenie
  `montaz-baterii/` (zamknie cały katalog).

- ✅ (2026-09-19) **Rollout i18n — siedemnasta partia: zamyka cały katalog `montaz-baterii/`
  (6 modułów).** Zmigrowane: `pierwsze-uruchomienie`, `podlaczenie-bms`, `ratowanie-ogniwa`,
  `sekwencja-montazu`, `weryfikacja-ogniw`, `ocena-zuzycia`. 18 nowych kluczy, 3 reużyte po
  weryfikacji treści.
  Piąty przypadek anty-wzorca "etykieta jako parametr" (`podlaczenie-bms`), naprawiony tym samym
  wzorcem.
  **Kolizja `code` między dwoma modułami** (`pierwsze-uruchomienie`/`ratowanie-ogniwa`, oba
  `NAPIECIE-OGNIWA-UJEMNE`, różny tekst) wykryta rutynową kontrolą i rozstrzygnięta odrębnymi
  `i18nKey` bez utraty informacji.
  Skonwertowane stringowe `assumptions` w `sekwencja-montazu` na `{kod, params}` — złapało 2
  przedistniejące asercje testowe (`toContain` na starym stringu), naprawione, drugi bieg
  testów czysty.
  🔴 **2 kolejne strony UI naprawione** (trzynasty-czternasty przypadek w rundzie):
  `podlaczenie-bms` (manualny render na głównej ścieżce mimo `WynikSzczegoly` używanego gdzie
  indziej na tej samej stronie) i `ocena-zuzycia` (brak importu wcale). Zweryfikowane pełnym
  wydrukiem `innerText`.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 77 do 83.
  6 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (11 kluczy z parametrami/7
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (894/894)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, potwierdzenie braku rezydualnego
  `next-server` przed i po) w PL/EN/RU (6 modułów × 3 języki = 18 sprawdzeń) — zero `⚠ [...]`.
  **Pozostały zakres z realnym tekstem do migracji**: `bezpieczenstwo/` (2), `kalkulator-
  mobilny/` (1) = **3 moduły**. Pełne uzasadnienie: `docs/memory.md`, wpis "siedemnasta
  partia". Kolejna partia (18.): `bezpieczenstwo/` + `kalkulator-mobilny/` razem.

- ✅ (2026-09-19) **Rollout i18n — osiemnasta partia: zamyka `bezpieczenstwo/` +
  `kalkulator-mobilny/` (3 moduły).** Zmigrowane: `dogrzewanie-paliwem-stalym`, `ups-krytyczny`,
  `tryb-uproszczony`. 12 nowych kluczy, 2 reużyte po weryfikacji treści (w tym `SPRAWNOSC-
  DOMYSLNA` — reużycie między dwoma różnymi katalogami, `kalkulatory-pomocnicze`/`ups-
  krytyczny`).
  Szósty przypadek anty-wzorca "etykieta jako parametr" (`tryb-uproszczony`), naprawiony tym
  samym wzorcem.
  Konwersja 2 stringowych `assumptions` na `{kod, params}` złapała kolejną przedistniejącą
  asercję testową (`ups-krytyczny`), naprawiona proaktywnie przed pierwszym biegiem testów.
  **Zero bugów UI** (trzecia taka partia w rundzie) — wszystkie strony już poprawnie
  obsługiwały i18n (w tym `tryb-uproszczony`, zweryfikowane wprost treścią PL/EN).
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 83 do 86.
  3 nowe bloki testowe domenowe + nowy blok w `t.test.ts` (3 klucze z parametrami/9 bez).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (905/905)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, potwierdzenie braku rezydualnego
  `next-server` przed i po) w PL/EN/RU (3 moduły × 3 języki = 9 sprawdzeń) — zero `⚠ [...]`.
  **To zamyka oba katalogi `bezpieczenstwo/` i `kalkulator-mobilny/`.**
  🔴 **Pozostały zakres potwierdzony grepem**: `baterie/napiecie-systemowe` — 1 moduł, 7×
  `message:`, duży wieloetapowy kalkulator, NIE w `MIGRATED_MODULES`. Po nim: `pv/czystosc-i-
  snieg`, `baterie/komunikacja-bms`, `baterie/porownanie-technologii` (świadomie odłożone, dane
  katalogowe). Pełne uzasadnienie: `docs/memory.md`, wpis "osiemnasta partia". Kolejna partia
  (19.): `baterie/napiecie-systemowe` (własna partia — zacząć od pełnego odczytania plików i
  ponownego przelecenia CAŁEGO `lib/core/modules/` grepem, nie ufać samej metryczce).
- ✅ (2026-09-19) **Sześć otwartych pytań (zebranych z tego pliku i `docs/memory.md`)
  rozstrzygnięte przez właściciela projektu jedną odpowiedzią.** Pełna treść pytań/opcji i
  decyzji: `docs/memory.md`, sekcja "Sześć otwartych pytań...". Status per pytanie:
  1. i18n danych katalogowych (wpis 2026-09-15/19 wyżej) → **nowy, odrębny wątek** — nie
     realizowane teraz.
  2. Integracja Ekran 1↔6 M4 (wpis 2026-09-04 wyżej) → **pełny profil "Mój sprzęt"** —
     ✅ zrealizowane (`lib/profil-sprzetu/`), zakres świadomie zawężony do baterii — szczegóły
     `docs/memory.md`.
  3. Logo/ikony PWA (wpis 2026-09-16 wyżej) → **własne logo teraz** — ✅ zrealizowane, koncepcja D
     "Monogram OG" wybrana i wdrożona (`public/icon.svg` + rasteryzacje). Szczegóły:
     `docs/memory.md`.
  4. Edytor kolorów (`docs/memory.md`, 2026-08-30) → **pełny edytor palety** — ✅ **już istnieje,
     nic do zrobienia.** Znaleziony dryf dokumentacji: pytanie było nieaktualne od 2026-08-30,
     edytor zbudowany tego samego dnia (`components/kolor-grupa-edytor.tsx`, wpięty w
     `/ustawienia` i `/wzornik`), tylko wpis w `docs/memory.md` nigdy nie oznaczony jako
     zamknięty. Skorygowane, nie usunięte — szczegóły: `docs/memory.md`.
  5. Logowanie/Supabase (wpis 2026-09-15 wyżej) → właściciel podłącza klucze w niedzielę po
     20:00 — bez zmian teraz.
  6. Model freemium (rozdz. 12) → decyzja biznesowa w niedzielę — bez zmian teraz.
- ✅ (2026-09-19) **Punkt 7a z prośby "5,6,7,8,9 proszę zrób"** — cztery luki z
  `docs/rejestr-pokrycia.md` oznaczone jako "gotowe do budowy" (audyt GOD BOOK Część N,
  05.09.2026): 2.15 (Ryzyko PID, Moduł 3), 8.8 (Dobór regulatora PWM vs MPPT, Moduł 12) —
  zbudowane jako kalkulatory. 5.46 (ryzyko zamarznięcia dolnego źródła) i 5.31 (hałas i
  wibracje), oba Moduł 6 — **korekta oceny źródła przy realizacji**: brak computable wzoru,
  zbudowane jako Wzorzec C (treść informacyjna). Szczegóły i wyjaśnienie rozbieżności:
  `docs/memory.md`.
- ✅ (2026-09-19) **Punkt 7b z tej samej prośby — Wind Chill (Moduł 7).** Wzór NWS/Environment
  Canada (2001), zweryfikowany niezależnie w Node. Zamyka punkt 7 w zakresie realizowalnym bez
  wymyślania fizyki — pozostały klaster stress-test zimowy jest w większości architektonicznie
  zależny od jeszcze niezbudowanych modułów, nie kolejnymi "gotowymi do budowy" lukami.
  Szczegóły: `docs/memory.md`.
- ✅ (2026-09-19) **Punkt 5 z tej samej prośby — kontynuacja Modułu 2, Ekrany 3/10/14/15.**
  Ostatnie cztery pozostałe `todo` z numerowanej sekwencji Modułu 2. Ekran 3 wprowadza nowy
  wariant wzorca "echo" (reużycie samych mocy urządzeń z katalogu innego modułu, bez czasu
  pracy — inny sens semantyczny). Ekran 10 ma udokumentowaną niespójność przykładu źródła
  (75%→+25% jest matematycznie błędne). Ekran 14 świadomie bez automatycznego werdyktu —
  źródło nie podaje liczbowego progu asymetrii faz. Ekran 15 bez domyślnych mocy urządzeń —
  źródło podaje tylko nazwy. **Świadomie odłożony:** moduł zbiorczy "Wampiry energetyczne"
  (24 dawne funkcje, 5 podzakładek) — osobny, znacznie większy krok, wymaga własnej sesji.
  Szczegóły: `docs/memory.md`.
- ✅ (2026-09-20) **Punkt 8 z tej samej prośby — rollout `usePersistedDraft` na wszystkie
  pozostałe 114 ekranów kalkulatorów** (wcześniej autosave miał tylko `napiecie-systemowe`).
  Mechaniczna transformacja `useState` → jeden Seed obiekt + `usePersistedDraft`, bez zmiany
  logiki domenowej — zachowane nazwy/sygnatury `setX`. Pierwsze podejście (8 równoległych
  agentów w tle) padło na limit sesji API w połowie pracy — dokończone bezpośrednio, bez
  kolejnych subagentów. Zweryfikowane: 115/115 unikalnych kluczy, `pnpm typecheck`/`lint`/`test`
  (965/965)/`build` czyste, Playwright na próbce 5 ekranów potwierdza przetrwanie danych po
  przeładowaniu strony. Szczegóły i lekcja o limicie równoległych agentów: `docs/memory.md`.
- ✅ (2026-09-20) **Punkt 6, ostatni z prośby "5,6,7,8,9 proszę zrób" — kafle 08–14 wdrożone
  po akceptacji.** Artefakt "Off-Grid Tile Set 08–14" zaakceptowany bez uwag per-kafel, wdrożony
  1:1 (nazwy klas/gradientów dostosowane do konwencji `ki-`/`tile-*-symbol` repo). Znaleziska
  przy weryfikacji (nie błędy): kafel 14 "Ustawienia" nie ma slotu w gridzie pulpitu (tylko mały
  link tekstowy w nagłówku, konsekwentnie emoji jak sąsiednie skróty) — ikona zarejestrowana,
  czeka na naturalne miejsce; kafle 09/11 mają już maskotkę "Bob" z wyższym priorytetem niż SVG
  (pre-istniejące zachowanie, dotyczy też kafli 3/6/7). Zweryfikowane: typecheck/lint/build
  czyste, Playwright + zrzut ekranu pulpitu potwierdzają poprawny render 4 z 7 nowych ikon w
  gridzie. **To zamyka całą prośbę "5,6,7,8,9 proszę zrób".** Szczegóły: `docs/memory.md`.
- ✅ (2026-09-20) **Migracja i18n na client-side bundled (offline-first, `docs/standards/17-i18n.md`
  17.4)** — osobny branch/PR (`claude/i18n-offline-first`), na wyraźną prośbę właściciela projektu
  po pełnym audycie (znalezisko: mechanizm cookie+middleware łamał offline-first). Preferencja
  języka przeniesiona z cookie na `localStorage` (`lib/i18n/storage.ts`, wzorzec
  `useSyncExternalStore` jak `lib/theme/storage.ts`) + `navigator.languages` na pierwszą wizytę;
  `<html lang>` korygowany blokującym skryptem pre-paint (jak dla motywu). Jedyny Server Component
  renderujący tłumaczenia wprost (`prognozy/page.tsx`) wydzielony do Client Component. **Znana,
  jawnie ujawniona luka:** widoczna treść UI (nie sam atrybut) może się skorygować po hydratacji
  przy twardym przeładowaniu z językiem ≠ polski — pełne wyeliminowanie wymaga architektury
  CSS-multi-language-DOM (~130 ekranów), poza zakresem tego kroku, czeka na decyzję właściciela.
  Zweryfikowane: typecheck/lint/i18n-guard/test(965/965)/build czyste, Playwright (4 scenariusze:
  świeże wejście, przełączenie, twarde przeładowanie z zapisaną preferencją, ekran Prognozy) —
  zero nowych błędów konsoli. Szczegóły: `docs/memory.md`.

## Pełny audyt (20.09.2026, GOD BOOK Y.6/Y.9 + Część N) — lista priorytetowa

Pełne wyniki audytu: `docs/memory.md`, sekcja "Pełny audyt na polecenie właściciela projektu
(20.09.2026)". Poniżej wyłącznie akcje wynikające z audytu, priorytetyzowane.

- ✅ **[PILNE, architektura] Migracja i18n z cookie+server-side na client-side bundled —
  ZREALIZOWANE** (patrz wpis ✅ wyżej w tej samej sekcji, branch/PR `claude/i18n-offline-first`,
  merge 2026-09-20). Oryginalny opis zadania z audytu, zachowany jako zapis kontekstu, nie
  aktualny stan: projekt jest offline-first (5.3), ówczesny mechanizm (`middleware.ts`,
  `lib/i18n/language.ts`, cookie `jezyk`) łamał tę zasadę. Standard skorygował się 16.09.2026
  (wiersz 76 `AKTUALIZACJE.md`): dla projektów z twardym wymogiem offline (ten projekt, jawnie
  zadeklarowany w `CLAUDE.md` linia 3 jako "Web/PWA offline-first") język UI ma być:
  `localStorage` + `navigator.language` na pierwszą wizytę, blokujący skrypt pre-paint z treścią
  WSZYSTKICH języków w bundlu klienckim (cache SW), zero cookie, zero zależności od serwera.
- 🟢 Wiersz 74 `AKTUALIZACJE.md` (CSP nonce-per-request) — już zaimplementowane w tym repo,
  tylko formalnie zamknięte w logu tym audytem. Bez akcji.
- 🟢 3 pliki `docs/standards/` (`17-i18n.md`, `00-INDEKS.md`, `05-baza-danych-offline.md`) —
  zsynchronizowane w tym audycie. Bez dalszej akcji.
- 🟡 **Backlog funkcjonalny — SKORYGOWANY (20.09.2026, druga korekta tego dnia).** Punkty 1-2
  poniżej były błędne od poprzednich audytów (cytowane z nieaktualnej metryczki, nie z żywego
  `docs/rejestr-pokrycia.md`) — sprostowane w rozmowie z właścicielem projektu, teraz też tutaj,
  żeby nie kłamały kolejnej sesji. Pełna metodologia przeliczenia: `docs/memory.md`, wpis
  "Pełny audyt na polecenie właściciela projektu (20.09.2026)" + kolejne korekty tego dnia.
  1. ~~**Moduł 5 (Okablowanie) — 23/29 gotowe, tylko 6 `todo`** (Złącza MC4, Przepust powietrza pod
     panelami, Projekt uziemienia, Selektywność zabezpieczeń, IMD, Normy i certyfikaty). Żaden nie
     jest blokowany brakiem normy — budowalne od razu.~~ ✅ **(20.09.2026) ZREALIZOWANE — 29/29,
     w pełni skończony.** Wszystkich 6 pozostałych ekranów dobudowane w jednej sesji ("Ruszajmy"),
     w tym Ekran 9 (uziemienie, wzór Dwighta zweryfikowany niezależnie w Pythonie) i dwa świadomie
     zbudowane jako Wzorzec C/informacyjny zamiast D (Selektywność, Normy) — źródło nie dawało
     wzoru/bazy komponentów do prawdziwego kalkulatora. Szczegóły: `docs/memory.md`,
     `docs/rejestr-pokrycia.md`.
  2. **Moduł 11 (Montaż baterii) — 23/23 gotowe, 0 `todo`. W pełni skończony**, nie "w większości
     todo" jak twierdziła poprzednia wersja tego wpisu (Ścieżka A LiFePO4 10 ekranów + A3b, Ścieżka
     B kwasowo-ołowiowa 12 ekranów, w tym B5 dobudowany 14.09.2026).
  3. Klaster stress-test zimowy (Moduł 7) — 2/26 gotowe, 24 `todo`, w większości architektonicznie
     zależny od jeszcze niezbudowanego Modułu 1 (geostruktura, brak treści źródłowej) i modelu
     termicznego Modułu 6.
  4. Moduł zbiorczy "Wampiry energetyczne" (Moduł 2, 24 dawne funkcje, 5 podzakładek) —
     świadomie odłożony jako osobna, większa sesja projektowa.
  5. **Moduł 1 (Lokalizacja) — 1/4 gotowe, 3 `todo`** (Skaner działki, Analiza zacienienia, Bryła
     budynku) — nieblokowane, treść źródłowa kompletna od 29.08.2026, po prostu jeszcze nie
     zbudowane. Nie był wcześniej w tej liście priorytetowej mimo że kwalifikuje się identycznie
     jak punkt 1 (niezależne, budowalne od razu).
  6. **Moduł 4 (Baterie) — 27/31 gotowe, 4 `todo`** (Symulacja czasu ładowania/rozładowania,
     Napięcie odcięcia vs żywotność, Hierarchia ładowania, Symulacja miesiąca zachmurzenia — część
     cross-modułowa, wymaga danych z Modułów 2/3/7).
  7. **116 z 122 kalkulatorów bez opisu narzędzia AI** (rozdział 9.3/9.0a; stan 20.09.2026 — 117→122
     kalkulatorów łącznie po dobudowaniu Modułu 5, ale te 5 nowych dostało opis AI od razu, w tej
     samej sesji, zgodnie z ustaloną kolejnością — więc backlog "bez opisu" liczebnie się NIE
     zmniejszył, tylko przestał rosnąć wraz z nowymi kalkulatorami) — osobny, poprzeczny backlog
     niezależny od powyższych, patrz `docs/wklad-do-standardu.md` (wpis 20.09.2026). Kolejność
     rolloutu dla już istniejących kalkulatorów bez opisu: 11→3→4→2→reszta (Moduł 5 już ma AI-opisy
     dla wszystkich swoich kalkulatorów, nie wchodzi do tego rolloutu).
     **✅ (26.09.2026) Moduł 11 (Montaż baterii) ZAMKNIĘTY w tym rollout-cie — 20/20 kalkulatorów
     (23 ekrany minus 3 Wzorzec C bez `calculator.ts`, patrz `docs/memory.md`) ma teraz opis
     narzędzia AI (`lib/ai/tools/*-tool.ts` + rejestracja w `lib/ai/pytaj-asystenta.ts`). Backlog
     "bez opisu" spada o te 20 pozycji. Następny w ustalonej kolejności: Moduł 3.**
- ✅ (2026-09-20, Routine Y.6 cykliczny) **Kolejne sprawdzenie `AKTUALIZACJE.md` — 1 nowy wpis od
  poprzedniej synchronizacji (rename GOD BOOK v2.20→v2.21, nowa GOD BOOK C.5).** Zero zmian
  merytorycznych w `docs/standards/`. Przy okazji: 4 otwarte wpisy `docs/wklad-do-standardu.md`
  sprawdzone przez porównanie treści z `new-app-standards` — 3 w pełni skonsolidowane (procedura
  materiałów źródłowych, biblioteka norm z fizycznymi plikami, CI referencyjny/i18n-guard), 1
  częściowo (wielojęzyczność — punkty 1–5/B.3 tak, C6 wciąż otwarty). Szczegóły pełnej checklisty
  Y.9: `docs/memory.md`, sekcja "Synchronizacja ze standardem".
- 🔄 (2026-09-23) **Moduł 1 (Lokalizacja), Ekrany 2–4 — jądro, UI i opisy AI gotowe (24.09), zostały długi TD.** Decyzja
  architektoniczna D22 (`rejestr-decyzji.md`). Zbudowane i przetestowane: `geometria-slonca/`,
  `skaner-dzialki/`, `analiza-zacienienia/`, `orientacja-powierzchni/` (55 testów). Dalej, w tej
  kolejności: ✅ (23.09) proxy PVGIS TMY (`app/api/pvgis/tmy/route.ts`, TD15 (1) rozwiązany) ·
  ✅ (24.09) TD16 — model Muneera (jak PVGIS) zamiast izotropowego, optimum 38° vs PVGIS 39° ·
  ✅ (24.09) ULDK — bez proxy, bezpośrednio z przeglądarki (D23, `lib/adapters/uldk/uldk.ts`) · ✅ (24.09) Ekran 2 UI (MapLibre GL, spacer GPS offline, tryb Geoportal/ULDK online — działka i budynek, zapis
  lokalny) · ✅ (24.09) Ekran 3 UI (R3F, mapa cieplna, profil horyzontu; obliczenia w Web Workerze) ·
  ✅ (24.09) Ekran 4 UI (lista powierzchni ze wskaźnikiem, korekta ręczna azymutu/kąta) · ✅ (24.09) opisy narzędzi
  AI dla 3 nowych kalkulatorów (`lib/ai/tools/skaner-dzialki-tool.ts`, `analiza-zacienienia-tool.ts`,
  `orientacja-powierzchni-tool.ts` — E4 pobiera PVGIS w handlerze po stronie serwera, 8760 rekordów
  nie przechodzi przez model) · ✅ (24.09) TD14 (rozproszone + zachmurzenie z PVGIS w E3; wydzielone TD18 nieboskłon, TD19 drzewa liściaste zimą — TD19 — ✅ (24.09) częściowo wdrożony w E3: drzewo liściaste przepuszcza 40% bezpośredniego w miesiącach bez liści wpisanych przez użytkownika) · 🔲 **TD19 — znaleźć pełny tekst** Konarska i in. 2014, *Theor. Appl. Climatol.* 117:363–376, DOI 10.1007/s00704-013-1000-3 (właściciel projektu; z kontenera wydawca zablokowany) — potem dopracować moduł: weryfikacja 40,2–51,9% i wartości per gatunek, drzewa liściaste w E4, fenologia dla Polski · ✅ (24.09) TD15 (2) (zacienienie
  z E3 we wskaźniku E4 — horyzont przeszkód dla połaci, Muneer "zacieniona") · ✅ (24.09) TD17 (przeszkody-bryły w Skanerze) · 🔲 przejście po ekranach z `<Pole>` w `.map()` bez jawnego `id` (powtarzające się `id` z etykiety — dostępność; Ekran 2 naprawiony, patrz `docs/memory.md` "TD17"). Szczegóły:
  `docs/memory.md`, sekcja "Moduł 1 (Lokalizacja), Ekrany 2–4 — jądro obliczeniowe (23.09.2026)".
- 🔄 (2026-09-25) **Moduł 3 (Instalacja PV) — sesja budowy, pełne wyliczenie + partie ekranów.** ✅ (25.09) partia 2: E1 kąt i azymut + optimum miesięczne (D26), E20 wschód-zachód → 20/27; dalej E4 (D25 — czeka na odpowiedź o zimowym zapotrzebowaniu na ogrzewanie), E9 (D27), E2, E3, E27. ✅ (25.09) E9 złoty środek (D27) → 21/27; odpowiedź właściciela: pole „dodatkowe zapotrzebowanie zimą [kWh/dzień]” w E4 — TAK. ✅ (25.09) E4 liczba paneli (D25) → 22/27; zostają E2, E3 (todo), E27 (raport, zależny od zablokowanego E19). ✅ (25.09) E3 tracker vs stały stelaż → 23/27; zostaje E2 (todo) i E27. ✅ (25.09) E2 typ montażu (6 trybów, w tym D26) → 24/27; zostaje E27 (czeka na E19). ✅ (25.09) partia 1: E7, E12, E15, E21, E23, E25 → M3 18/27 `done` (✏️ E21 — ostrzeżenie o sprzężeniu AC mikroinwerterów w off-gridzie czeka na potwierdzenie właściciela). → ✅ (28.09) potwierdzone 25.09 (wiersz rejestru), 28.09 podniesione do 🔴 decyzją właściciela. ✅ (25.09) krok 0: 17 brakujących wierszy M3 w `docs/rejestr-pokrycia.md` (Dyrektywa #14), korekta M3/M5 w `mapa-wdrozenia.md`, blocked E9/E10/E19 w `backlog-poza-v1.md`. Dalej: partia 1 (E7, E12, E23, E15, E21, E25 — źródło kompletne) → partia 2 (E1, E20 — echo silnika M1/E4, PR ręczny) → partia 3 (E4 po potwierdzeniu drabinki okresów, E3, E2 częściowo). **Priorytet:** wysoki (serce produktu off-grid, M1 już dostarcza dane słoneczne). **Odblokowuje:** E27 (raport), M7 ekrany zależne od M3 (śnieg/oblodzenie PV, albedo, awaria stringa zimą, krótkie okno słoneczne). **Plusy teraz:** M1 świeżo gotowy — silnik i dane w kontekście; **minusy odkładania:** M7 dalej zablokowany. **Kolizje:** `lib/pulpit/registry.ts`, `lib/i18n/dictionary-*.ts`, `scripts/check-i18n-guard.mjs`, `lib/ai/pytaj-asystenta.ts` — te same pliki co rollout opisów AI (sesja 2) — nie prowadzić obu równolegle w dwóch gałęziach. **Kolejność:** przed rolloutem opisów AI dla starych kalkulatorów M3 (nowe ekrany dostają opis od razu). Szczegóły: `docs/memory.md` "Moduł 3 — pełne wyliczenie + start sesji budowy (25.09.2026)".
- ✅ (2026-09-25, rozstrzygnięte → D27: rekomendacja + wykresy + dowolny kąt, wiatr %/N, balast kg, 1 zł/kg edytowalne; norma wiatrowa dostarczona; brak PN-EN 1990 → balast bez współczynników bezpieczeństwa) ~~⚠️ Do decyzji właściciela: M3/E9 „Złoty środek”~~ — dostarczenie PN-EN 1991-1-4 (krzywa wiatru w funkcji kąta) i/lub sposób ważenia kryteriów (złotówki vs punkty ważności). **Priorytet:** średni. **Odblokowuje:** E9 w pełni. **Plusy teraz:** wyjaśnienie świeże; **minusy:** bez normy wiatrowej tylko 2 z 3 krzywych. **Kolizje:** bezkolizyjne. **Kolejność:** po partii 2 (E9 korzysta z krzywej produkcji E1).
- ✅ (2026-09-25, potwierdzone tego samego dnia → D25 w `rejestr-decyzji.md`: okresy lato/mar–paź/lut–lis/cały rok, limit montażowy z podpowiedzią 30, deficyt zimowy) ~~⚠️ Do potwierdzenia: M3/E4 drabinka okresów pokrycia~~ (cze–sie / kwi–wrz / mar–paź / lut–lis / cały rok) — potem wpis D# w `rejestr-decyzji.md` (odejście od 3 wariantów źródła). **Priorytet:** średni. **Odblokowuje:** budowę E4. **Kolizje:** bezkolizyjne. **Kolejność:** po E1 (wspólne przeliczenie miesięczne i PR).
- ✅ (2026-09-25, zamknięte 2026-09-26) ~~**Zduplikowane `id` pól formularza w listach**~~ — `Pole`/`PoleSelect` budują `id` z etykiety; pola w `.map()` bez jawnego `id` dublują je (etykieta wiąże się tylko z pierwszym polem — dostępność). Naprawione w M6 koszty ogrzewania, M3/E2, M1/E4, i **od 26.09 strukturalnie dla wszystkich ekranów naraz**: `Pole`/`PoleSelect` (`components/ui/pole.tsx`) teraz zawsze domyślają `id` do `useId()` (standard 8.10), zamiast budować go z etykiety — wpis w commicie "Aktualizacja ze standardu (Y.6/Y.9)" tego samego dnia. Sprawdzone przy weryfikacji tego wpisu (26.09): obie funkcje bezwarunkowo wywołują `useId()` i używają go jako fallbacku, gdy `id` nie jest podane jawnie — duplikaty z `.map()` bez jawnego `id` już nie powstają. Pełen przegląd tras Playwright pod kątem pozostałych, niestandardowych pól (poza `Pole`/`PoleSelect`) zostaje otwarty jako nisko-priorytetowe dopieszczenie, ale główna przyczyna jest usunięta.
- 🔲 (2026-09-25) **Pełna resynchronizacja `mapa-wdrozenia.md`** — wiersze M1, M2, M4, M6–M13 i licznik "Łącznie" nadal ze stanu 07.09.2026 (skorygowane 25.09 tylko M3 i M5). Przeliczyć z `docs/rejestr-pokrycia.md` (14.3 — przeliczeniem, nie z metryczki). **Priorytet:** średni (mapa to jedyne miejsce, które ma być wiarygodne — T.2). **Odblokowuje:** wiarygodny obraz postępu dla planowania. **Plusy teraz:** tanio; **minusy odkładania:** każda sesja planuje na błędnych liczbach. **Kolizje:** `mapa-wdrozenia.md` — dotyka go też sesja M3 (tylko wiersz M3). **Kolejność:** po zamknięciu bieżącej sesji M3 (żeby liczyć raz, na stanie końcowym).
- ✅ (2026-09-25, zbudowane → D28: ekran M6 „Porównanie kosztów ogrzewania” z nagrzewnicą typu webasto, olejem i paliwami stałymi; metraż→ciepło nadal czeka na PN-EN 12831-1) ~~⚠️ (2026-09-25) **Pomysł właściciela projektu (F.1, do decyzji): dogrzewanie paliwowe typu „webasto” (nagrzewnica powietrzna na olej napędowy) jako zimowe źródło ciepła o niskim poborze prądu.**~~ Źródło aplikacji nie ma treści o tym (webasto tylko jako punkt przeglądu, M10 §10.34/10.36; M6 Część 2A „alternatywne źródła ciepła” — luka źródła). Do zbudowania potrzebne: dane z karty katalogowej jako wpis użytkownika (moc grzewcza kW, zużycie paliwa l/h, pobór prądu W w pracy i przy starcie), zapotrzebowanie cieplne budynku (wpis albo PN-EN 12831-1 — `docs/normy-brakujace.md`), ceny paliw do porównania kosztu kWh ciepła. Ryzyka do ujęcia jako twarde stopy/ostrzeżenia: spaliny/CO (M8 — czujnik CO już twardym stopem przy paliwie stałym), montaż urządzenia samochodowego w budynku mieszkalnym (poza jego homologacją — do sprawdzenia z kominiarzem/rzeczoznawcą), parafinowanie oleju na mrozie, przejście gorącego wydechu przez przegrodę. **Priorytet:** średni. **Odblokowuje:** pełny sens deficytu zimowego w M3/E4 (D25), M7 „Deep Winter Energy Budget”. **Plusy teraz:** łączy się z D25; **minusy:** bez PN-EN 12831-1 metraż→kW tylko ręcznie. **Kolizje:** M6 (ogrzewanie) — bezkolizyjne z sesją M3. **Kolejność:** po M3/E4.
- 🔄 (2026-09-25) ✅ PN-EN 1991-1-4 dostarczona tego samego dnia (notatka: `docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md`). **Pozyskanie norm (właściciel projektu):** ~~PN-EN 1991-1-4 (wiatr — 🔴, blokuje M3/E9/E6/E2)~~, PN-EN 12831-1 (obciążenie cieplne), dalej wg `docs/normy-brakujace.md`. **Priorytet:** 1991-1-4 wysoki, reszta średni. **Odblokowuje:** E9 w pełni, balast E6/E2, metraż→ciepło. **Kolizje:** bezkolizyjne. **Kolejność:** niezależne od kodu — im wcześniej, tym lepiej.
- 🔄 (2026-09-25, wybrany plan B: pliki zostają do publikacji, nowe normy jako notatki robocze) ⚠️ **Licencje norm w publicznym repo — do decyzji, najpóźniej PRZED pierwszymi użytkownikami/publikacją.** Repo jest publiczne; `docs/zrodla/` zawiera PDF-y norm chronionych (PKN/IEC) i `.md` z przepisaną treścią rozdziałów. Opcje: (A) repo prywatne teraz, (B) oryginały PDF na dysk właściciela + w repo tylko notatki robocze z liczbami (wzór: `docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md`), przegląd istniejących `.md` pod kątem przedruku. Szczegóły: `docs/memory.md` "Licencje norm w publicznym repozytorium". **Priorytet:** wysoki (ryzyko prawne rośnie z czasem publicznej widoczności). **Odblokowuje:** bezpieczną publikację. **Plusy teraz:** A to jedno kliknięcie; **minusy odkładania:** pliki są publiczne już dziś. **Kolizje:** `docs/zrodla/` — tylko przenoszenie/usuwanie plików, bez kolizji z kodem. **Kolejność:** A od razu, B przed publikacją. → ✅ **(28.09.2026) Właściciel potwierdził: zostaje plan B** (pliki w repo do czasu publikacji; ryzyko świadomie zaakceptowane). Zadanie do wykonania przed publikacją aplikacji: przegląd `docs/zrodla/` pod kątem PDF/OCR norm chronionych.
- ✅ (2026-09-25) **Weryfikacja OCR paczki New-info** — zakres używany w projekcie zweryfikowany wizualnie i przepisany (PN-EN 1991-1-4, PN-EN 1990, IEC 62305, wzory Purmo), błędy poprawione, `00-INDEKS.md` + `normy-brakujace.md` zaktualizowane. Szczegóły: `docs/memory.md` „Weryfikacja OCR paczki New-info”.
- 🔲 (2026-09-25) **Balast projektowy wg PN-EN 1990 (EQU)** w M3/E9, E2, E6 — zamiast `m = Fw/g`: `γG,inf·G ≥ γQ·Fw` (γG,inf = 0,90, γQ = 1,50, Tablica A1.2(A), NB bez zmian). Przesuw (tarcie balastu o podłoże) — normy brak, zostaje ostrzeżenie. **Priorytet:** wysoki (bezpieczeństwo konstrukcji, D27). **Odblokowuje:** usunięcie ostrzeżenia ZS-BALAST-BEZ-WSPOLCZYNNIKOW. **Kolizje:** `lib/core/modules/pv/zloty-srodek/`, `typ-montazu`, słowniki i18n. **Kolejność:** najpierw — dane gotowe.
- 🔲 (2026-09-25) **M6: projektowe obciążenie cieplne z metrażu/przegród** (ΦHL = ΦT + ΦV, poradnik Purmo do PN-EN 12831:2006 + PN-82/B-02403 strefy) i podpięcie do „Porównanie kosztów ogrzewania”. Rozbieżność wersji (2006 vs 12831-1:2017) jako założenie. **Priorytet:** średni. **Odblokowuje:** M3/E4 deficyt zimowy, M7 Deep Winter. **Kolejność:** po balaście.
- ✅ (2026-09-25) ~~**Do decyzji właściciela:** dwa foldery normy wiatrowej (`norma-PN-EN-1991-1-4/` — notatka robocza, `norma-PN-EN-1991-1-4-wiatr/` — pełny tekst): (A) scalić, (B) zostawić z odsyłaczami (stan obecny).~~ **Rozstrzygnięte: wariant A** — wszystko w `docs/zrodla/norma-PN-EN-1991-1-4/` (notatka + PDF + OCR + dawny indeks jako sekcja).

- ✅ (2026-09-26) **Aktualizacja ze standardu (Y.6/Y.9):** GOD BOOK v2_38→v2_39 (B.5 cykl życia `docs/zrodla/`, N.1 kompletność źródło→rejestr), 8 rozdziałów `docs/standards/` (05, 08, 10, 11, 14, 16, 00-INDEKS, 00-filozofia), `PROMPT_STARTOWY.md`; odsyłacze ADAPTOWALNE poprawione; 3 wpisy `wklad-do-standardu.md` → ✅ skonsolidowane; `Pole`/`PoleSelect` na `useId()` (8.10). Szczegóły: `docs/memory.md`.
- ✅ (2026-09-26) **Balast projektowy PN-EN 1990 (EQU) w M3/E9, E2, E6 — D29.** γQ = 1,50, γG,inf = 0,90 (Tablica A1.2(A), NB bez zmian — zweryfikowane wizualnie z PDF). E6: + pole „planowany balast” i twardy stop. **Do potwierdzenia przez właściciela (✅🤖):** pominięcie ciężaru własnego stelaża; balast w E6 z siły wzoru źródła. → **(28.09.2026) Decyzja właściciela: dodać ciężar paneli+stelaża** (opcjonalne pole, γG,inf = 0,90 jako siła utrzymująca) — wpis 🔲 niżej.
- ✅ (2026-09-26) **M6/E1 „Straty ciepła budynku” (dawne 5.1)** — przegrody Σ U·A·ΔT + wentylacja, θe ze strefy I–V, miesiące ze średnich temperatur (opcjonalnie), prąd przy COP. Rejestr M6 Część 1 uzupełniony do 20/20 wierszy (15 nowych, w tym E2 — odblokowany przez E1).
- ✅ (2026-09-26, zweryfikowane ponownie 26.09) ~~**Audyt N.1 (GOD BOOK v2.39) w kierunku źródło → rejestr dla pozostałych modułów**~~ — zalecenie `AKTUALIZACJE.md` z 25.09 dla tego projektu. Ten wpis był chwilowo nieaktualny w chwili zapisu (M6 Część 2, M8, M9, M10, M12, M13 zostały domknięte w tym samym dniu, PR #156, commit `438a75e` "docs(rejestr): pełne wyliczenie N.1..." + nowy skrypt `pnpm audit:n1`, `scripts/audit-n1-rejestr.mjs`) — patrz wpis „Audyt N.1 dla pozostałych modułów” niżej w tym pliku. Sprawdzone ponownie przy porządkowaniu backlogu (26.09, po zamknięciu rolloutu opisów AI): `pnpm audit:n1` zielony, wszystkie 579 pozycji Biblii mają wiersz w `docs/rejestr-pokrycia.md`. Nic do zrobienia.
- 🔲 (2026-09-26) **Następne w M6:** E2 „Zapotrzebowanie na C.O. i C.W.U.” (z E1 + M2), E7 „Mostki termiczne” (⚠️ wymaga PN-EN ISO 14683 / PN-EN 12831-1 — do pozyskania). Opcjonalnie: temperatury T2m z PVGIS TMY do zapisu lokalizacji, żeby miesiące E1 wypełniały się same (zmiana schematu zapisu `offgrid.pvgis-tmy.v1` — wymaga migracji).
- 🔲 (2026-09-26) **Drobne (UI):** parametry liczbowe w tekstach założeń i18n wyświetlają się z kropką („γQ = 1.5”) zamiast przecinka — dotyczy wszystkich ekranów z `params` liczbowymi, nie tylko nowych; do rozwiązania w `t()` (formatowanie wg języka), osobna zmiana.

- ✅ (2026-09-26) Zamyka dwa wpisy 🔲 z 25.09 (równoległa sesja OCR, PR #154): „Balast projektowy wg PN-EN 1990 (EQU)” → D29 (wpis wyżej); „M6: projektowe obciążenie cieplne z metrażu/przegród” → M6/E1 zbudowany z fizyki opisanej w źródle (Σ U·A·ΔT + wentylacja) i stref PN-82/B-02403, bez metody Purmo/PN-EN 12831:2006 (mostki, grunt, zyski — jawnie poza zakresem, ostrzeżenie); podpięcie do „Porównanie kosztów ogrzewania” — przez podpowiedź pola (suma miesięcy E1), bez automatycznego przenoszenia wartości.
- ✅ (2026-09-26) **Audyt N.1 dla pozostałych modułów** (zamyka wpis 🔲 z 26.09): M6 Część 2, M8, M9, M10, M12, M13 + znalezione przy okazji M4 3.10 i M5 4.25 — sekcja „Pełne wyliczenie pozostałych modułów” w `docs/rejestr-pokrycia.md`; każda z 579 pozycji Biblii ma wiersz. Nowe polecenie: `pnpm audit:n1` (`scripts/audit-n1-rejestr.mjs`). Luki `Tresc_*` względem Biblii: M12 8.8 (nowa), M13 7.7, M2 1.19, M3 2.15 (znane).
- ✅ (2026-09-26) **M6/E2 „Zapotrzebowanie na C.O. i C.W.U.”** i **M6/E7 „Mostki termiczne”** (zamyka wpis 🔲 z 26.09) — E7 z Ψ wpisywanym przez użytkownika zamiast czekania na PN-EN ISO 14683 (**do potwierdzenia przez właściciela ✅🤖**, szczegóły: `docs/memory.md`). Dalej w M6: E8 (bezwładność), E10 (izolacja), E11 (okna) — wszystkie korzystają z E1.
- ✅ (2026-09-26) **Temperatury miesięcy z PVGIS** na M6/E1 (zamyka część opcjonalną wpisu z 26.09) — bez zmiany klucza zapisu (pole opcjonalne), stare zapisy → „pobierz ponownie”.
- ✅ (2026-09-26) **Przecinki w liczbach w tekstach założeń** (zamyka wpis 🔲 „Drobne (UI)” z 26.09) — `t()` formatuje separator dziesiętny wg języka (PL/RU „,”, EN „.”) dla parametrów liczbowych i tekstów z `toFixed`.
- ✅ (2026-09-26, zamknięte niezależnie 26.09) ~~**Strażnik i18n — 41 modułów `lib/core/modules/*` poza listą `MIGRATED_MODULES`**~~ (wykryte przy dopisywaniu E1/E2/E7) — ten wpis był już nieaktualny w chwili zapisu, patrz wpis „Strażnik i18n — domknięte” niżej tego samego dnia (150→152 modułów pod ochroną). Ponownie zweryfikowane osobno przy porządkowaniu backlogu: `pnpm check:i18n-guard` zielony (152 moduły); ręczny przegląd wszystkich 24 katalogów `lib/core/modules/*` spoza `MIGRATED_MODULES` — żaden nie zawiera niechronionego kalkulatora. Rozkład: 8 to katalogi-kategorie bez własnych plików (`baterie/`, `pv/` itp.), 5 to podkatalogi `wampiry-energetyczne/*` już osobno wymienione na liście, 9 to świadome Wzorzec C/F (`matryca-alarmow-bms`, `przechowywanie-recykling(-olow)`, `ratowanie-zasiarczenia`, `halas-i-wibracje`, `ryzyko-zamarzniecia-dolnego-zrodla`, `selektywnosc-zabezpieczen`, `separacja-emc`, `trasy-kablowe` — same `constants.ts`, bez `calculator.ts`, treść 1:1 ze źródła), 2 to czyste funkcje pomocnicze bez `CalcResult`/tekstu dla użytkownika (`eurokod-0/rownowaga.ts`, `eurokod-1/wiatr.ts`+`snieg.ts` — dokumentacja wprost mówi „bez CalcResult"). Nic do zrobienia.
- ✅ (2026-09-26) **Strażnik i18n — domknięte** (zamyka wpis 🔲 „41 modułów poza listą” z 26.09): 19 modułów już zgodnych dopisanych, 13 zmigrowanych (14 kluczy PL/EN/RU, strony poprawione), strażnik łapie też `assumptions.push("…")` i zatrzymuje się na module spoza listy. 150 modułów pod ochroną. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-26) **Zduplikowane `id` pól formularza** (zamyka wpis 🔲 z 25.09 oraz podpunkt „przejście po ekranach z `<Pole>` w `.map()`” z wpisu TD14–TD19) — `Pole`/`PoleSelect` mają `useId()` już od `f475302` (wpis nie dostał domknięcia). Sprawdzone Playwrightem na wszystkich 160 trasach, także po 2× kliknięciu każdego przycisku „Dodaj” (8 tras): 0 duplikatów. Przy okazji: pole HEX „Zmiana grupowa” (Ustawienia, Wzornik) bez nazwy dostępnej — dodany `aria-label`.
- ✅ (2026-09-26) **Pełna resynchronizacja `mapa-wdrozenia.md`** (zamyka wpis 🔲 z 25.09): 153 z 314 ekranów docelowych `done` (+3 dodatkowe); M1, M2, M4, M5, M11 — 100%. W rejestrze poprawiona kolumna statusu 13 wierszy (M3 ×11, M6 E2/E7). Nowe polecenie: `pnpm rejestr:licz [moduł]`.
- ✅ (2026-09-26) Domknięcie dwóch martwych wpisów 🔲 z początku listy (bez zmian w kodzie): „Kontynuacja kafli pulpitu 08–14” — wdrożone 20.09.2026 (`docs/memory.md` „Punkt 6 — kafle 08–14”); „Kontynuacja Modułu 2” — 18/18 ekranów `done` (przeliczenie mapy z 26.09).
- ✅ (2026-09-26) **M6/E10 „Optymalizacja izolacji”** — bez PN-EN ISO 6946 (U' = 1/(1/U + d/λ), opory przejmowania już w obecnym U). Dalej w M6: E8 (bezwładność — ⚠️ do decyzji: źródło każe liczyć Σ m·c całego budynku, a fizycznie w dobowym wychładzaniu pracuje tylko warstwa wewnętrzna, PN-EN ISO 13786 poza repo), E11 (okna — 🔴 źródła „wysokie U i niskie g” bez progów liczbowych).
- ✅ (2026-09-26) **M6/E8 „Pojemność cieplna budynku”** (częściowo) — decyzja właściciela: C = Σ m·c całej masy jak w źródle, ze stałym ostrzeżeniem 🟡, że czas do zamarznięcia może być krótszy. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-26) **M6/E8 — głębokość czynna masy wg PN-EN ISO 13786** — czeka na normę od właściciela („potem ci normę dam”). Po dostarczeniu: pojemność tylko warstwy czynnej przy okresie dobowym, zdjąć/złagodzić `POJC-CALA-MASA-ZAWYZA`. → ✅ **(02.10.2026) zamknięte** — zrobione 27.09.2026 (wpis „Poprawki ekranów odblokowanych przez nowe normy”), ten wpis nie dostał domknięcia (potwierdzone w kodzie: `pojemnosc-cieplna` v2.0.0 z Zał. A, `mostki-termiczne/katalog-psi.ts` z Tablicy A.2).
- 🔲 (2026-09-26) **M6/E11 „Okna i drzwi”** — odłożone decyzją właściciela: nie budować, dopóki nie poda progów liczbowych dla 🔴 „wysokie U i niskie g”.
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 3 (Instalacja PV) zamknięty.** Kolejność 11→3→4→2→reszta (wpis z 20.09.2026): po Module 11 (20/20) zrobiony Moduł 3 — 12 nowych plików `lib/ai/tools/*-tool.ts` (`dopasowanie-tablicy-falownika`, `konfigurator-stringow`, `napor-wiatru`, `niedopasowanie-paneli`, `ochrona-stringow`, `panele-bifacjalne`, `ryzyko-pid`, `straty-okablowanie-dc`, `straty-zlaczki-mc4`, `stress-test-mppt`, `wplyw-temperatury`, `zacienienie-diody-bocznikujace`) + 13 kalkulatorów już miało narzędzie z wcześniejszych sesji. Świadomie pominięty `czystosc-i-snieg` (dane katalogowe, ten sam powód co wyłączenie z i18n — patrz wpisy 19–26.09 wyżej). Szczegóły, w tym pełna lista i uzasadnienie: `docs/memory.md`, sekcja „Moduł 3 (Instalacja PV) — opisy narzędzi AI (26.09.2026)”. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (1408/1408)/`build` czyste. **Następny w kolejności: Moduł 4.**
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 4 (Magazyn energii / baterie) zamknięty.** Kolejność 11→3→4→2→reszta: 29 nowych plików `lib/ai/tools/*-tool.ts` zbudowanych od zera (żaden ekran Modułu 4 nie miał wcześniej narzędzia AI). Pominięte świadomie: `matryca-alarmow-bms` (brak `calculator.ts`, Wzorzec C), `komunikacja-bms` i `porownanie-technologii` (dane katalogowe/nie-i18n, ten sam powód co wyłączenia z 19–26.09 wyżej), `napiecie-systemowe` (Ekran 2 — kalkulator wielo-etapowy A–H z kreatorem odbiorników, echem doboru kabla z Modułu 5 i kosztorysami 12/24/48V; kształt wejścia/wyjścia zbyt złożony i zależny od innych modułów, żeby bezpiecznie zmapować 1:1 bez ryzyka błędu w danych elektrycznych — zatrzymane na tym jednym pliku wg zasady „nie zgaduj”, do zrobienia osobno). 4 ekrany wcześniej uznawane za `blocked`/`todo` (Symulacja ładowania/rozładowania, Napięcie odcięcia a żywotność, Hierarchia ładowania, Symulacja miesiąca zachmurzenia) miały już działający `calculator.ts` — zbudowane razem z resztą, zgodnie z zasadą zadania „pomiń tylko jeśli brak calculator.ts”. Szczegóły: `docs/memory.md`, sekcja „Moduł 4 (Magazyn energii / baterie) — opisy narzędzi AI (26.09.2026)”. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (170 plików, 1408 testów)/`build` czyste. **Następny w kolejności: Moduł 2.**
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 2 (Zapotrzebowanie) zamknięty.** Kolejność 11→3→4→2→reszta: 16 nowych plików `lib/ai/tools/*-tool.ts` zbudowanych od zera dla 16 z 17 podkatalogów `lib/core/modules/zapotrzebowanie/*` (wszystkie miały `calculator.ts`). Świadomie pominięty w całości `wampiry-energetyczne/` (5 podmodułów, 24 funkcje wg backlogu) — jawnie wyłączony z tego zadania jako osobna, większa sesja (wpis 19.09.2026 potwierdzony, nadal aktualny). Szczegóły: `docs/memory.md`, sekcja „Moduł 2 (Zapotrzebowanie) — opisy narzędzi AI (26.09.2026)”. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (170 plików, 1408 testów)/`build` czyste. **Następny w kolejności: reszta modułów (poza 11/3/4/2).**
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 5 (Okablowanie) zamknięty (pierwszy z "reszty").** 20 nowych plików `lib/ai/tools/*-tool.ts` zbudowanych od zera (`analiza-zwarciowa`, `dobor-bezpiecznika-rozlacznika`, `dobor-izolacji-kabla`, `dobor-mocy-falownika`, `dobor-przekroju-kabla`, `glowna-szyna-wyrownawcza`, `laczenie-cu-al`, `ochrona-odwrotna-polaryzacja`, `ochrona-przed-dotykiem`, `ochrona-przed-gryzoniami`, `ochrona-przepieciowa-spd`, `optymalizacja-trasy-kabla`, `oznakowanie-obwodow`, `peszle-koryta-rurki`, `pomiary-powykonawcze`, `puszki-polaczeniowe`, `string-box`, `szyny-zbiorcze-polaczenia`, `uziemienie-funkcjonalne-ochronne`, `wylaczniki-nadpradowe-dc`, `wylaczniki-rcd`); 5 z 25 ekranów już miały narzędzie (`zlacza-mc4`, `przepust-powietrza`, `projekt-uziemienia`, `monitorowanie-izolacji-imd`, `normy-i-certyfikaty` — potwierdzone realnym importem `calculateXxx`, nie tylko nazwą pliku); 0 pominiętych (wszystkie 25 podkatalogów Modułu 5 mają `calculator.ts`, brak Wzorca C bez jądra w tym module). Szczegóły: `docs/memory.md`, sekcja „Moduł 5 (Okablowanie) — opisy narzędzi AI (26.09.2026)”. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (170 plików, 1408 testów)/`build`/`audit:gate` czyste. **Następny w kolejności: Moduł 1 (Lokalizacja).**
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 1 (Lokalizacja) zamknięty (0 nowych plików).** `skaner-dzialki`, `analiza-zacienienia`, `orientacja-powierzchni` już miały narzędzie AI z 24.09.2026 (zweryfikowane realnym importem `calculateXxx`, zarejestrowane w `NARZEDZIA`). Świadomie pominięte: `lokalizacja-i-klimat` (Ekran 1 — bez jądra obliczeniowego, tylko zapis GPS/temperatury wpisanych ręcznie, nic do policzenia) i `geometria-slonca` (wewnętrzna biblioteka matematyczna reużywana przez inne moduły, bez własnego ekranu). Szczegóły: `docs/memory.md`, sekcja „Rollout opisów narzędzi AI — Moduł 1 (Lokalizacja), 26.09.2026”. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (170/1408)/`build` czyste. **Następny w kolejności: Moduł 6 (Ogrzewanie).**
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 6 (Ogrzewanie) zamknięty.** 7 nowych plików `lib/ai/tools/*-tool.ts` zbudowanych od zera (`bufor-ciepla`, `cop-pompy-ciepla`, `infiltracja-powietrza`, `kociol-elektryczny`, `pompy-cyrkulacyjne`, `ryzyko-niskiego-napiecia`, `wentylacja-odzysk-ciepla`); 6 ekranów już miało narzędzie z sesji 26.09.2026 (`koszty-ogrzewania`, `obciazenie-cieplne`, `zapotrzebowanie-co-cwu`, `mostki-termiczne`, `optymalizacja-izolacji`, `pojemnosc-cieplna` — potwierdzone realnym importem, nie duplikowane); pominięte 2 (`halas-i-wibracje`, `ryzyko-zamarzniecia-dolnego-zrodla` — brak `calculator.ts`, Wzorzec C). Szczegóły i uzasadnienia per narzędzie (zwłaszcza świadomie częściowe `infiltracja-powietrza`/`wentylacja-odzysk-ciepla`): `docs/memory.md`, sekcja „Rollout opisów narzędzi AI — Moduł 6 (Ogrzewanie), 26.09.2026”. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (170 plików, 1408 testów)/`build`/`audit:gate` czyste. **Następny w kolejności: Moduł 8 (Bezpieczeństwo).**
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 8 (Bezpieczeństwo) zamknięty.** 3 nowe pliki `lib/ai/tools/*-tool.ts` zbudowane od zera (`ups-krytyczny`, `dogrzewanie-paliwem-stalym`, `audyt-pozarowy`) — wszystkie 3 podkatalogi `lib/core/modules/bezpieczenstwo/*` miały `calculator.ts` i żaden nie miał wcześniej narzędzia AI, 0 pominiętych. Dane wysokiego ryzyka (moc urządzeń krytycznych, odległość od materiałów palnych, obecność nawiewu/czujnika CO, status pozycji audytu) opisane jako wyłącznie od usera/realnego pomiaru — nigdy zgadywane przez model. Szczegóły: `docs/memory.md`, sekcja „Rollout opisów narzędzi AI — Moduł 8 (Bezpieczeństwo), 26.09.2026”. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (170 plików, 1408 testów)/`build` czyste. **Następny w kolejności: Moduł 9.**
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 7 (stress-test)/9 (ESP32)/12 (mobilny) zamknięty — KOŃCZY CAŁY ROLLOUT.** 5 nowych plików `lib/ai/tools/*-tool.ts` zbudowanych od zera (`procedura-black-start`, `wind-chill`, `katalog-czujnikow`, `dobor-regulatora-pwm-mppt`, `tryb-uproszczony`) — wszystkie 5 podkatalogów miało `calculator.ts`, 0 pominiętych. Szczególna uwaga: `procedura-black-start-tool` przenosi twardy stop krytyczny `KROK-POZA-KOLEJNOSCIA` z pełną powagą, bez łagodzenia. Sprawdzono też, że nie ma innych podkatalogów `lib/core/modules/*` poza już zrobionymi w poprzednich sesjach — **tym samym cały rollout "opisy narzędzi AI dla kalkulatorów" (backlog 20.09.2026, punkt 7) jest zamknięty dla wszystkich `lib/core/modules/*`**, z wyjątkiem świadomie pominiętych wcześniej (Wzorzec C, dane katalogowe, moduły zbyt złożone do 1:1, `wampiry-energetyczne`). Szczegóły: `docs/memory.md`, sekcja „Rollout opisów narzędzi AI — Moduł 7/9/12, 26.09.2026”. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (170 plików, 1408 testów)/`build` czyste.
- ✅ (2026-09-26) **`napiecie-systemowe` (Ekran 2, Moduł 4) — dług z rolloutu Modułu 4 domknięty.** Ponowna analiza wykazała, że kalkulator to zwykła czysta funkcja bez efektów ubocznych/stanu sesji — dało się zmapować 1:1 (`z.object` z zagnieżdżonymi strukturami dla `odbiorniki[]`/`kable`/`kosztorysy`/`jednoczesnosc`), bez zgadywania. Nowy plik `lib/ai/tools/napiecie-systemowe-tool.ts`, zarejestrowany w `pytaj-asystenta.ts`. Szczegóły i uzasadnienie techniczne: `docs/memory.md`. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (1408/1408)/`build` czyste.
- ✅ (2026-09-27) **2 pliki norm dodane do `docs/zrodla/` na polecenie właściciela:** PN-EN ISO 14683 (mostki cieplne — pełny tekst, przeczytana w całości) i EN ISO 13786 (dynamiczne charakterystyki cieplne — plik dodany, treść niepotwierdzona). Szczegóły: `docs/zrodla/README.md`, `docs/normy-brakujace.md`.
- 🔲 (2026-09-27) **OCR + analiza `docs/zrodla/norma-PN-EN-ISO-13786/` (EN ISO 13786:2007, dynamiczne charakterystyki cieplne).** Dokument w większości skan (~28 stron) — treść nieprzeczytana. Zadanie: tesseract pol+eng 250 DPI → podział na rozdziały w `00-INDEKS.md` (wzorzec: inne normy w tym katalogu) → weryfikacja wizualna tablic/wzorów → ustalić, czy realnie odblokowuje jakąś lukę (dziś: nieznana, hipoteza w `00-INDEKS.md` niepotwierdzona) i ewentualnie dopisać do `docs/normy-brakujace.md`.
- ✅ (2026-09-27) **Wykorzystać PN-EN ISO 14683 (mostki cieplne, pełny tekst) w kodzie M6.** Norma pozyskana i przeanalizowana, ale żaden kalkulator jeszcze jej nie używa. Cel: dodać/rozbudować Ψ (liniowy współczynnik przenikania ciepła) w ekranie mostków termicznych (`lib/core/modules/ogrzewanie/mostki-termiczne/`?) wg Tablicy A.2 (`docs/zrodla/norma-PN-EN-ISO-14683-1/00-INDEKS.md`) — sprawdzić najpierw obecny stan tego ekranu (może już ma własne wartości Ψ do zweryfikowania/skonfrontowania z normą, nie tylko dodania od zera). → ✅ **(02.10.2026) zamknięte** — zrobione 27.09.2026 (wpis „Poprawki ekranów odblokowanych przez nowe normy”), ten wpis nie dostał domknięcia (potwierdzone w kodzie: `pojemnosc-cieplna` v2.0.0 z Zał. A, `mostki-termiczne/katalog-psi.ts` z Tablicy A.2).
- ✅ (2026-09-27) **4 kolejne pliki dodane do `docs/zrodla/` na polecenie właściciela:** SRPS HD 60364-4-443:2017 (pełny tekst, przeczytana w całości — **zamyka pozycję HD 60364-4-443 z listy brakujących**), artykuł PL o EN 62305 (Boryń/Olesz 2010, drugie źródło wtórne), whitepaper IEC 62109-1 (rozpoznany tylko po tytule, treść nieprzeczytana), poradnik ELEKTRA 12831 (duplikat treściowy poradnika Purmo, dodany jako kopia zapasowa). Piąty dostarczony plik (Poradnik Purmo 12831/01/2012) pominięty — identyczny duplikat pliku już w repo. Szczegóły: `docs/zrodla/README.md`, `docs/normy-brakujace.md`.
- 🔲 (2026-09-27) **Dokończyć odczyt whitepaper IEC 62109-1** (`docs/zrodla/norma-IEC-62109-1/`, 14 stron, natywny tekst) — tylko tytuł/metadane rozpoznane w tej sesji, pełna treść nieprzeczytana. Po odczycie: wyodrębnić wymagania o izolacji galwanicznej, ocenić trafność dla Modułu 5/8.
- 🔲 (2026-09-27) **Wykorzystać SRPS HD 60364-4-443 (wzór CRL, ocena ryzyka SPD) w M5/`ochrona-przepieciowa-spd`** — dziś ekran (wg wcześniejszych notatek) liczy margines napięciowy i próg uziemienia, ale nie liczy formalnie, czy instalacja SPD jest wymagana metodą CRL z 443.5. Norma i 4 przykłady liczbowe: `docs/zrodla/norma-HD-60364-4-443/00-INDEKS.md`.
- 🟡 **Wciąż brakujące normy (przypomnienie z `docs/normy-brakujace.md`, zaktualizowane 27.09.2026):** PN-EN 12831-1 (pełny tekst — mamy tylko 2 poradniki wydawców + PN-82/B-02403), IEC 62109-1 (mamy tylko whitepaper firmowy nieprzeczytany), IEC 61215, IEC 62619, EN 61439, pełna seria EN 62305 (mamy tylko 2 materiały wtórne: Furse + artykuł PL), HD 60364-5-551, PN-EN 62852, PN-EN 61427-1, PN-EN 50565-1, + 9 pozycji zgubionych przy konwersji PPTX→DOCX (numery #2,#6,#10,#13,#17,#27,#29,#33,#37 listy w `materialy-branzowe-PV-2019`). **HD 60364-4-443 usunięta z tej listy — pozyskana 27.09.2026.** Pełna lista ze statusami: `docs/normy-brakujace.md`.
- ✅ (2026-09-27) **Dodano `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/` na polecenie właściciela** — plik `.docx` "Bezpieczeństwo instalacji fotowoltaicznych" (dodatek Rynek Elektryczny nr 3/2019, egzemplarz ze szkolenia ZIAD Bielsko-Biała). **Wyłącznie dodany, treść NIE przeanalizowana** (jawne polecenie: inna sesja się tym zajmie).
- 🔲 (2026-09-27) **Sprawdzić `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/` — czy to inna edycja `materialy-branzowe-PV-2019/` z pełną (nieprzyciętą) listą norm.** Tytuł/wydawca identyczne z `materialy-branzowe-PV-2019/Bezpieczenstwo-instalacji-fotowoltaicznych-Rynek-Fotowoltaiczny-2019.docx`, w którym zgubiło się 9 pozycji listy norm (#2,#6,#10,#13,#17,#27,#29,#33,#37) przy konwersji PPTX→DOCX. Jeśli ten plik ma pełną listę — użyć go jako źródła prawdy dla tych 9 pozycji, zamiast zgadywać. Jeśli to inny materiał — pełna ekstrakcja/indeksacja wg wzorca innych plików w `docs/zrodla/`. Szczegóły: `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/00-INDEKS.md`.
- ✅ (2026-09-27) **OCR + analiza EN ISO 13786** (zamyka wpis 🔲 z 27.09 „OCR + analiza `docs/zrodla/norma-PN-EN-ISO-13786/`”): 27 stron, 100% skan; OCR dwoma przebiegami, odczyt wizualny wszystkich stron treści, oba przykłady Zał. D odtworzone w Pythonie. Wzory/tablice: `02-wzory-i-tablice-zweryfikowane.md`. Dwie niespójności samego oryginału oznaczone ⚠️ (literówka Z12 w D.1; wzór (26) vs Tablice D.1/D.4). **Norma odblokowuje M6/E8** — patrz wpis niżej.
- ✅ (2026-09-27) **Sprawdzenie `materialy-szkolenie-ZIAD-Bielsko-Biala/`** (zamyka wpis 🔲 z 27.09): plik **identyczny bajt-w-bajt** (MD5) z `materialy-branzowe-PV-2019/*.docx` — nie inna edycja. 9 „zgubionych” pozycji listy norm (#2, #6, #10, #13, #17, #27, #29, #33, #37) odzyskane z akapitów tego samego `.docx` (poprzednio czytano tylko tabele), potwierdzone wizualnie z PDF str. 8, wpisane do `materialy-branzowe-PV-2019/01-tresc.md`; sekcja ⚫ `docs/normy-brakujace.md` rozwiązana.
- ⚠️ (2026-09-27) **Do decyzji właściciela: duplikat ZIAD** — (A) usunąć `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/` (treść jest w `materialy-branzowe-PV-2019/`, oszczędza 22,5 MB w repo), (B) zostawić z odsyłaczem (stan obecny). → ✅ **Rozstrzygnięte 27.09.2026: wariant A** — folder usunięty; usunięty też niekompletny `.docx` z `materialy-branzowe-PV-2019/` (oryginał = pełny PDF, polecenie właściciela: „zostawić tylko ten pełny w pdf”).
- ✅ (2026-09-27) **M6/E8 — głębokość czynna masy wg EN ISO 13786 Zał. A.2.4 — ODBLOKOWANE** (wpis 🔲 z 26.09 „czeka na normę od właściciela”): norma w repo i zweryfikowana. Reguła: dT = min(½ grubości elementu; grubość do pierwszej warstwy izolacyjnej; 100 mm dla 1 doby — Tablica A.1), κ = Σ ρ·d·c na dT, opcjonalnie (A.4) z oporem przejmowania; wynik z adnotacją „Załącznik A, przybliżenie” (A.1). Testy referencyjne: D.1 (240 → 97/197 kJ/(m²·K)), D.2/Tablica D.5. Potem zdjąć/złagodzić `POJC-CALA-MASA-ZAWYZA`. **Priorytet:** średni (bezpieczeństwo — czas do zamarznięcia dziś zawyżony). **Kolizje:** `lib/core/modules/ogrzewanie/pojemnosc-cieplna/`, słowniki i18n. → ✅ **(02.10.2026) zamknięte** — zrobione 27.09.2026 (wpis „Poprawki ekranów odblokowanych przez nowe normy”), ten wpis nie dostał domknięcia (potwierdzone w kodzie: `pojemnosc-cieplna` v2.0.0 z Zał. A, `mostki-termiczne/katalog-psi.ts` z Tablicy A.2).
- ✅ (2026-09-27) **PDF „ZIAD” (oryginał, z którego robiono `.docx`)** — identyczny (MD5) z PDF w `materialy-branzowe-PV-2019/`, nie dodany drugi raz; tekst natywny, OCR zbędny. Pełny tekst → `materialy-branzowe-PV-2019/02-tresc-pelna-z-pdf.txt`. Porównanie z `.docx`: **żaden rozdział nie zginął**, zgubione tylko fragmenty ze str. 17, 18, 21 (podpisy rysunków, przypis, 2 myśli o odstępie separującym) — 2 merytoryczne dopisane do `01-tresc.md`. Szczegóły: `00-INDEKS.md` tego folderu.
- ✅ (2026-09-27) **Poprawki ekranów odblokowanych przez nowe normy** (zamyka trzy wpisy 🔲 z 27.09: „Wykorzystać PN-EN ISO 14683 w kodzie M6”, „Wykorzystać SRPS HD 60364-4-443 (CRL) w M5/`ochrona-przepieciowa-spd`”, „M6/E8 — głębokość czynna masy wg EN ISO 13786 — ODBLOKOWANE” oraz wpis 🔲 z 26.09 „M6/E8 … czeka na normę”): **M6/E7** — katalog Ψ z Tablicy A.2 (76 detali, 3 systemy wymiarów, testy z Zał. B); **M6/E8** — warstwa czynna wg Zał. A (dT ≤ 100 mm, A.4 z Rsi), czas do zamarznięcia w przykładzie testowym 26,1 h → 6,3 h; **M5/E2** — sekcja „Czy SPD jest wymagany” (443.4 + CRL, testy z 4 przykładów Zał. A) + narzędzie AI `ocen_wymog_spd_crl`. Szczegóły: `docs/memory.md` „Ekrany odblokowane przez normy z 27.09 (27.09.2026)”; uproszczenia: `dlug-techniczny.md` TD20, TD21.
- ⚠️ (2026-09-27) **Do potwierdzenia przez właściciela (✅🤖):** (1) M6/E8: Rsi = 0,13 m²·K/W przyjęte stale (EN ISO 13786 wzór (18) + przykład D.1, PN-EN ISO 14683 Tablica A.1 — samej PN-EN ISO 6946 brak w repo); (2) M6/E8: zdjęcie ostrzeżenia `POJC-CALA-MASA-ZAWYZA` i zastąpienie adnotacją `POJC-ZALACZNIK-A-PRZYBLIZENIE` (nadal 🟡); (3) M5/E2 CRL: obcinanie długości ponad 1 km od największej wagi (norma milczy); (4) M6/E7: opis detalu R11 (różnicy względem R5 nie da się jednoznacznie odczytać z rysunku — w aplikacji odsyłacz do rysunku normy). **Priorytet:** średni. **Kolizje:** bezkolizyjne. → ✅ **(28.09.2026) (2), (3), (4) potwierdzone przez właściciela.** (1) Rsi: właściciel chce Rsi per kierunek strumienia (ściana 0,13 / strop / podłoga) i **dostarczy PN-EN ISO 6946** — do tego czasu zostaje 0,13 dla wszystkich przegród (wpis 🔲 niżej).
  **[29.09.2026, D54]** (1) Rsi: 0,13 ze źródeł zostaje do czasu PN-EN ISO 6946 (decyzja właściciela); (3) CRL: rozstrzygnięte — od budynku na zewnątrz. Otwarte z tego wpisu: (2) i (4).
- 🔲 (2026-09-27) **Wersja PL/EN HD 60364-4-443 — wyjątek ekonomiczny 443.4 dla mieszkań** (TD21): tekst serbski „instalacja pięć razy tańsza od SPD” vs streszczenie „< 5 × wartość SPD”. Bez wersji PL/EN nie wdrażać. **Priorytet:** niski (off-grid: instalacja zawsze warta wielokrotność SPD). **Odblokowuje:** pełne 443.4. Potem ew. Tablica 443.2 (kategorie przepięć, U_W) w M5.
- ✅ (2026-09-27) **M12/E32 „Ile dni pracy bez słońca — mały zestaw”** — zbudowany jako echo M4/E1 (`obliczDniAutonomiiZPojemnosci`), 8+2 testy, narzędzie AI, PL/EN/RU, kafel. M12: 3/43. Szczegóły: `docs/memory.md` („Przegląd niedokończonych sekcji + M12/E32”).
- ⚠️ (2026-09-27) **M12/E41 „Czy mój przedłużacz wytrzyma?” — zablokowany** (sprawdzony przy starcie budowy): obciążalność przewodów giętkich 0,75/1,0/1,5 mm² nie jest w PN-HD 60364-5-52; potrzebna norma z `docs/normy-brakujace.md` (PN-EN 50565-1/-2 — HIPOTEZA, gdzie są tablice). **Priorytet:** niski. **Odblokowuje:** E41 (🔴 z listy twardych stopów źródła). **Plusy/minusy teraz:** bez normy się nie da (Dyrektywa #1). **Kolizje:** bezkolizyjne. **Kolejność:** po dostarczeniu normy przez właściciela.
- 🔲 (2026-09-27) **Moduł 12 — ekrany budowalne bez właściciela (triaż źródła `Tresc_Modul_12`, 27.09).** Kolejność proponowana (od najpewniejszych): **E9** LVD (progi 11,5 V AGM / 11,0 V LiFePO4 dla 12 V są w źródle, 🔴 opisany) · **E27** urządzenie 12 V wprost (zakres 11–14,5 V w źródle, 🔴 tolerancja urządzenia od usera) · **E39** panel → stacja zasilania (Voc vs max wejścia, 🔴; echo Voc w mrozie z M3) · **E11** zużycie per urządzenie (moc × czas × współczynnik pracy od usera; przykład 45 W × 24 h × 40% = 432 Wh) · **E30** gniazdo zapalniczki (prąd bezpiecznika od usera, źródło daje tylko zakres 10–15 A) · **E42** odsyłacz do M11/A9 i B11 · **E22/E36** checklisty (pozycje w źródle) · **E2/E15** echo M5/E1 + M5/E6. **Wymagają danych/decyzji właściciela:** E26 (margines dla sprzętu medycznego — źródło nie podaje liczby), E33 (tabela napięcie spoczynkowe → stan, brak w źródle M12), E37 (progi), E3/E5/E12/E13 (baza typowych mocy urządzeń). **Zależne od niezbudowanych ekranów:** E35 (M7/E2), E14 (raport — na końcu). **Priorytet:** średni (M12 = największa luka liczbowo: 3/43). **Odblokowuje:** kompletność M12, pulpit „Szybki kalkulator”. **Plusy teraz:** małe, samodzielne partie, wzory w źródle lub echo gotowych silników; **minusy:** niska wartość per ekran względem M6/M7 dla głównego off-gridu. **Kolizje:** `lib/i18n/dictionary-*.ts`, `lib/pulpit/registry.ts`, `lib/ai/pytaj-asystenta.ts`, `scripts/check-i18n-guard.mjs` — wspólne dla każdej sesji budującej ekrany (dopisywać, nie przestawiać). **Kolejność:** jeden ekran = jedna partia + commit (Dyrektywa #14).
- 🔲 (2026-09-27) **Przegląd niedokończonych sekcji — stan 27.09 (dla kolejnych sesji).** Łącznie 156/314 ekranów `done`. Największe luki: **M12** 3/43 (wpis wyżej), **M6** 14/48 — Część 2 to w większości tematy „pełna treść tylko w Biblii” (2C) i scalony silnik 2D „wpływ czynnika X” (29 pozycji, jeden silnik); **M7** 2/26 — większość zależy od modelu M1–M6, samodzielni kandydaci: E4 Blackout, E13 sztywnienie izolacji, E19 elektronika w mrozie, E23 śnieg na dachu (norma PN-EN 1991-1-3 w repo); **M10** 1/12, **M9** 1/10, **M8** 3/11 — Wzorce D bez ocenionej budowalności; **M13** — czeka na telemetrię. **Priorytet:** średni (orientacja). **Odblokowuje:** planowanie kolejnych sesji bez eksploracji. **Kolizje:** bezkolizyjne (tylko dokumentacja). **Kolejność:** przed wyborem kolejnego modułu przeczytać ten wpis i `mapa-wdrozenia.md`.
- ✅ (2026-09-27) **M12/E9 „Ochrona przed rozładowaniem” (dozownik LVD)** — z listy triażu M12 wyżej (pierwszy w kolejności). M12: 4/43. Następne wg triażu: E27, E39, E11, E30, E42, E22/E36, E2/E15.
- ✅ (2026-09-27) **Pakiet 2 M12** (z triażu wyżej): E27 urządzenie 12 V wprost, E39 panel → stacja zasilania (echo M3/E5), E11 zużycie per urządzenie (częściowo — bez bazy urządzeń), E30 gniazdo zapalniczki, E42 odsyłacz ratowania do M11, E22 kamper i E36 garaż (checklisty wg chemii). M12: 11/43, łącznie 164/314. Zostaje z triażu: **E2/E15** (echo M5/E1 + M5/E6) — następny pakiet.
- ⚠️ (2026-09-27) **Do decyzji właściciela (pakiet 2 M12):** (1) E27 — górna granica napięcia akumulatora 12 V przy ładowaniu: `Tresc` 14,5 V (użyte) vs Biblia §12.42 14,6 V; (2) E22/E36 — alert Biblii o wodorze (ołowiowy bez wentylacji) wdrożony jako 🟡, czy podnieść do 🔴? (3) E11 — czy budować bazę typowych mocy urządzeń (źródło podaje tylko nazwy; potrzebne dane). **Priorytet:** niski/średni. **Odblokowuje:** ewentualną korektę progów/poziomów. **Kolizje:** bezkolizyjne. **Kolejność:** dowolna. → ✅ **(28.09.2026) (1) i (2) rozstrzygnięte i wdrożone:** (1) E27 — nowe pole „maks. napięcie ładowania instalacji” z ustawień regulatora zamiast stałej; (2) wodór — kwasowy (zalewowy) 🔴, AGM (VRLA) 🟡. (3) baza mocy urządzeń — nadal otwarte. → ✅ **(28.09.2026) (3) wdrożone (D33):** 16 przykładowych średnich mocy jako podpowiedź (lista + podpowiedzi nazw), pole mocy zawsze wpisuje użytkownik; komunikat „sprawdź moc swojego modelu, wpisujesz raz — warto poświęcić 10–15 minut”. Wartości **do potwierdzenia ✅🤖**.
- ✅ (2026-09-27) **Pakiet 3 M12: E2 + E15** (kabel i bezpiecznik małej instalacji / kampera) — echo M5/E1 + M5/E6 + pierwsze użycie PN-IEC 60364-4-43 (433.2, IB ≤ In ≤ Iz). Oba częściowo (bez bazy bezpieczników/złączek — źródło podaje tylko nazwy). M12: 13/43, łącznie 166/314. **Triaż budowalnych ekranów M12 wyczerpany.**
- ✅ (2026-10-02, status odświeżony — runda zrobiona wpisem 28.09 „runda uproszczone wersje” i partią 01.10; M12: wszystkie ekrany `done` poza E41 ⚠️ blocked i E21 przeniesionym do M13, wg `rejestr-pokrycia.md`) ~~🔲~~ (2026-09-27) **M12 — kolejna runda triażu: ekrany „uproszczona wersja Modułu X”** (echo gotowych silników): E23 (M4/E10 kondensacja + IP), E28 (M4/E12 Cold C-Rate), E31 (M2/E13 bufor rozbudowy), E38 (M5/E9/E11 uziemienie), E19 (M3/E2 pakowanie paneli), E6 (PVGIS z M1), E8 (przetwornice — tryb 12 V→230 V echo M5/E7), E20/E17/E18/E7/E34 (Wzorzec B — porównania). Przed budową każdego: sprawdzić, czy silnik-źródło istnieje i czy przykład źródła się odtwarza. **Priorytet:** średni. **Odblokowuje:** dalsze pokrycie M12. **Plusy teraz:** echo gotowych silników, niskie ryzyko; **minusy:** część to Wzorzec B bez liczb. **Kolizje:** wspólne pliki słowników/pulpitu/narzędzi AI (tylko dopisy). **Kolejność:** jeden ekran = jedna partia + commit.
- ⚠️ (2026-09-27) **Do decyzji właściciela przed kolejną rundą M12:** ekrany „uproszczona wersja Modułu X” bywają w praktyce kopią istniejącego ekranu — np. E28 (← M4/E12 Cold C-Rate, który ma już tylko 2 pola: temperatura ogniwa i pojemność). Opcje: (A) osobny ekran M12 jako cienki wrapper silnika M4 (duplikat wejścia na pulpicie), (B) odsyłacz jak E42 (jeden ekran, dwa wejścia), (C) pominąć i oznaczyć jako pokryte przez M4. Dotyczy też E31 (← M2/E13 bufor 0–30% + „ile się zmieści” — bez danych przestrzennych), E23, E38. **Priorytet:** średni. **Odblokowuje:** rundę triażu z wpisu wyżej. **Kolizje:** bezkolizyjne. **Kolejność:** decyzja przed budową. → ✅ **(28.09.2026) Rozstrzygnięte: hybryda.** Gdzie ekran-źródło jest już prosty (E28, E31) — odsyłacz jak E42 (jeden ekran, dwa wejścia); gdzie rozbudowany (E23, E38, E8) — cienki wrapper z 2–3 polami na tym samym silniku; Wzorce B budować.
- ✅ (2026-09-27) **M7/E23 „Obciążenie dachu śniegiem”** (samodzielny kandydat M7 z przeglądu 27.09) — PN-EN 1991-1-3 + Załącznik krajowy NB w całości z repo: sk (NB.1, 5 stref), μ1 (Tablica 5.2), Ce (5.1), Ct = 1,0, γ śniegu (E.1). 🔴 obciążenie normowe lub zmierzona warstwa > nośność dachu od usera. M7: 3/26, łącznie 167/314. Szczegóły: `docs/memory.md` „M7/E23”.
- ⚠️ (2026-09-27) **Do decyzji właściciela — M7/E23 próg „zbliżania się do nośności”.** Źródło: 🔴 przy obciążeniu „zbliżającym się lub przekraczającym” nośność, ale bez liczby (przykład źródła: 120 z 150 kg/m² = 80% → „Zbliżasz się do granicy!”, to ilustracja, nie reguła). Dziś: 🔴 tylko przy przekroczeniu + wykorzystanie w %. Opcje: (A) zostawić tak, (B) 🟡 od progu X% podanego przez właściciela. **Priorytet:** niski. **Odblokowuje:** pełne pokrycie 🔴 ze źródła. **Kolizje:** bezkolizyjne. **Kolejność:** dowolna. → ✅ **(28.09.2026) rozstrzygnięte i wdrożone (D30):** 🟡 od 80% nośności (normowe i aktualne), 🔴 > 100%; próg opisany jako ustalenie aplikacji, nie norma.
- ⚠️ (2026-09-27) **Do decyzji właściciela — M7/E19 zbiór urządzeń krytycznych (🔴).** Źródło nazywa 🔴 tylko BMS („nie wystartuje”); wyświetlacz/czujnik/przetwornica mają opis skutku bez 🔴. Dziś: 🔴 BMS, reszta 🟡. Opcje: (A) zostawić 1:1 ze źródłem, (B) dodać 🔴 dla przetwornicy/falownika i regulatora ładowania (brak startu = brak zasilania). **Priorytet:** niski. **Odblokowuje:** —. **Kolizje:** bezkolizyjne. **Kolejność:** dowolna. → ✅ **(28.09.2026) rozstrzygnięte i wdrożone (D31):** przetwornica/falownik 🔴 (jak BMS), nowy typ „regulator ładowania (MPPT/PWM)” 🟡.
- ⚠️ (2026-09-28) **Do decyzji właściciela — M7/E8 próg parafinizacji zwykłego diesla (konflikt w źródle).** (A) Sekcja B: „parafinizacja diesla przy −20°C”. (B) Przykład C: „na zwykłym dieslu nie wystartuje przy −15°C”. Konsekwencja: przy A ostrzeżenie pojawi się dopiero od −20°C (ryzyko przeoczenia między −15 a −20), przy B — od −15°C. Dziś: tylko info przy każdej temperaturze < 0°C, bez poziomu 🟡/🔴. Do ustalenia też poziom (🟡 czy 🔴). **Priorytet:** średni. **Odblokowuje:** pełny rozruch w M7/E8. **Kolizje:** bezkolizyjne. **Kolejność:** dowolna. → ✅ **(28.09.2026) rozstrzygnięte i wdrożone (D32):** właściciel podał progi z praktyki zamiast A/B — zwykły diesel 🟡 ≤ +5°C, 🔴 ≤ 0°C; każdy diesel 🟡 ≤ −10°C (akumulator, świece żarowe); benzyna ℹ️ < 0°C; samo paliwo + temperatura daje werdykt. Poziomy dobrane przez AI — **do potwierdzenia ✅🤖**.
- ✅ (2026-10-02, status odświeżony — E4 `blackout` 28.09, E13 `sztywnienie-izolacji` i E19 `elektronika-w-mrozie` 27.09 są `done` w `rejestr-pokrycia.md`) ~~🔲~~ (2026-09-27) **M7 — kolejni samodzielni kandydaci** z przeglądu: E4 Blackout (bliski M2/E17 agregat), E13 sztywnienie izolacji (tabela materiałowa — sprawdzić, czy jest w źródle), E19 elektronika w mrozie. Przed budową każdego: czy liczby są w źródle/normie w repo (Dyrektywa #1). **Priorytet:** średni. **Kolizje:** słowniki i18n, `lib/pulpit/registry.ts`, `lib/ai/pytaj-asystenta.ts` (tylko dopisy). **Kolejność:** jeden ekran = jedna partia.

- ✅ (2026-09-28) **M8 — blok 1: E1 awaryjne źródło ciepła (częściowo), E3 zamki drzwi ewakuacyjnych, E4 moduł gaśniczy (częściowo).** M8: 6/11, łącznie 176/314. Szczegóły: `docs/memory.md` „M8 blok 1 (28.09.2026)”. Zostają w M8: E5 (centrala SSP), E7 (oświetlenie awaryjne), E8 (klapy), E10 (syrena/służby) — logika konfiguracyjna, budowalne; E6-AI (priorytety UPS) i E9 (predykcja — telemetria M13) zależne.
- ⚠️ (2026-09-28) **Do potwierdzenia przez właściciela (✅🤖, M8 blok 1):** (1) E3 — zamek fail-secure **z** zasilaniem awaryjnym: dziś 🟡 (🔴 źródło wiąże tylko z brakiem zasilania awaryjnego; sekcja D mówi „nigdy odwrotnie”) — czy podnieść do 🔴? (2) E4 — gaz obojętny / aerozol w strefie LiFePO4: dziś 🟡 (źródło wymaga mgły wodnej lub środka do magazynów energii, ale wprost wyklucza tylko proszek i CO2) — czy 🔴? (3) E4 — minimum 2 czujników potwierdzenia (źródło: „np. dwa”) przyjęte jako próg 🟡. **Priorytet:** średni (bezpieczeństwo życia). **Kolizje:** bezkolizyjne. **Kolejność:** dowolna.
- ✅ (2026-09-28) **M8 — blok 2: E5 centrala SSP, E7 oświetlenie awaryjne (częściowo), E8 klapy i wentylacja (częściowo), E10 syrena/powiadomienia/służby.** M8: 10/11, łącznie 180/314. Zostają w M8: **E9** predykcja ryzyka pożaru (zależna od telemetrii M13) i część AI **E6** (12.54 — priorytety zasilania przy rozładowaniu UPS; źródło podaje kolejność, ale nie próg „zbliżającego się rozładowania”). Szczegóły: `docs/memory.md` „M8 blok 2 (28.09.2026)”.
- ⚠️ (2026-09-28) **Do potwierdzenia przez właściciela (✅🤖, M8 blok 2):** (1) E10 — automatyczne wezwanie służb bez zgody jako 🔴 (źródło: reguła „tylko za wyraźną zgodą”, bez znacznika 🔴); (2) E7 — lampa bez testu 🟡; (3) E5 — brak odbioru sygnału alarmu/awarii z centrali 🟡 (nie 🔴). **Priorytet:** średni. **Kolizje:** bezkolizyjne.
- ✅ (2026-09-28) **M7 — blok 3: E4 Blackout, E6 strategia „Zamarzanie”, E10 SPOF** (wszystkie częściowo). M7: 12/26, łącznie 183/314. Szczegóły: `docs/memory.md` „M7 blok 3 (28.09.2026)”.
- ✅ (2026-09-28) **M7 — pozostałe ekrany po triażu 28.09:** kandydaci z echem gotowych silników: **E18** Pre-Heat (🔴 „nie grzej nocą z baterii” + Q = C·ΔT z M6/E8 i bojler z M2/E2), **E20** bez rekuperacji (dodatkowe straty = echo M6/E3; wilgotność — brak wzoru), **E26** awaria stringa (echo E4, gdy user poda produkcję stringu). **Zablokowane/konflikt:** E24 THD — przykład (5 kW, THD 25% → 4,1 kW) nie wynika z żadnego wzoru w źródle; E25 Deep Winter Budget — przykład C wewnętrznie niespójny (300+150+250 = 700 kWh, zużyte 280, „zostało 170”) → do wyjaśnienia z właścicielem; E16 turbina — brak krzywej mocy (przykład 1 kW / 6 m/s → 3 kWh/dobę bez wzoru). Zależne od M1/M3/M13: E1, E2, E3, E7, E9, E12, E14, E15. → ✅ **(02.10.2026) zamknięte** — budowalne E18/E20/E26 zrobione w bloku 4 (28.09.2026, wpis niżej); reszta przeniesiona do wpisów ⚠️ E24/E25/E16.
- ✅ (2026-09-28) **M7 — blok 4: E18 Pre-Heat, E20 bez rekuperacji, E26 awaria stringa zimą** (wszystkie częściowo). M7: 15/26, łącznie 186/314. Z triażu 28.09 w M7 nie zostało nic budowalnego bez właściciela lub danych z M1/M3/M13: E24 (THD — brak wzoru), E25 (niespójny przykład), E16 (brak krzywej mocy turbiny) — do decyzji; E1, E2, E3, E7, E9, E12, E14, E15 — zależne.
- ⚠️ (2026-09-28) **Do decyzji właściciela — M7/E25 Deep Winter Energy Budget: niespójny przykład źródła.** (A) Plan: 300 kWh PV + 150 kWh agregat + 250 kWh bateria = 700 kWh na styczeń; (B) „do 20 stycznia zużyłeś 280 kWh — zostało Ci 170 kWh”. 700 − 280 = 420, nie 170. Możliwe odczytania: „zostało” dotyczy tylko baterii (250 − 80?) albo plan dzienny do 20. dnia (700 × 20/31 ≈ 452). Konsekwencja: bez rozstrzygnięcia nie wiadomo, co ekran ma pokazywać jako „zostało” i od czego liczyć 🟡 „przekroczenie budżetu o 12%”. **Priorytet:** niski. **Kolizje:** bezkolizyjne.
- ⚠️ (2026-09-28) **Do decyzji właściciela — M7/E24 THD i M7/E16 turbina:** oba przykłady źródła bez wzoru (THD 25% → falownik 5 kW oddaje 4,1 kW; turbina 1 kW przy 6 m/s → 3 kWh/dobę). Zbudowanie wymaga normy/karty (derating falownika przy THD od producenta; krzywa mocy turbiny) — czy wpisywane przez użytkownika z karty producenta (wtedy da się zbudować), czy czekamy na dane? **Priorytet:** niski.
- ✅ (2026-09-28) **M9 — blok 5: E2 zasilanie ESP32, E4 architektura komunikacji, E5 przydział pinów (częściowo), E6 niezawodność.** M9: 5/10, łącznie 190/314. Zostają: E1 wybór płytki (Wzorzec B — tabela porównawcza, możliwy), E3 montaż/obudowa (Wzorzec F — przewodnik), Katalogi 2–4 (Wzorzec H — jak Katalog 1). Szczegóły: `docs/memory.md` „M9 blok 5 (28.09.2026)”.
- ⚠️ (2026-09-28) **Do weryfikacji przez właściciela — M9/E2, przykład źródła „magistrala 48 V → przetwornica MP1584”.** Hipoteza (nie z repo, z wiedzy o kartach katalogowych): MP1584 ma maks. napięcie wejściowe ok. 28 V, a magistrala 48 V LiFePO4 przy ładowaniu dochodzi do ok. 58 V — przykład źródła prowadziłby do uszkodzenia przetwornicy. W kodzie nie wpisano żadnego limitu konkretnej przetwornicy (user podaje go z karty), więc aplikacja nie powtarza błędu — ale treść źródła warto poprawić. Też do potwierdzenia (✅🤖): 🔴 dla przekroczenia napięcia wejściowego przetwornicy (źródło ma 🔴 tylko dla braku przetwornicy) i 🟡 dla CAN bez transceivera (M9/E4). **Priorytet:** średni. **Kolizje:** bezkolizyjne.
- 🔲 (2026-09-28) **Lokalizacja nagrzewnicy typu webasto (na zewnątrz / w budynku) a rozruch na mrozie — przy M8/E1 albo ekranach ogrzewania (D28).** Właściciel (runda 3, przy E8): ryzyko rozruchu diesla zależy od tego, czy agregat albo webasto stoi na dworze, czy wewnątrz. W M7/E8 pokryte temperaturą miejsca agregatu i paliwa (D32); dla webasto — dopisać przy budowie M8/E1 lub w porównaniu kosztów ogrzewania (echo progów D32, nie nowe liczby). **Priorytet:** niski. **Odblokowuje:** spójność ostrzeżeń mrozowych. **Kolizje:** bezkolizyjne. **Kolejność:** przy M8/E1.
- ✅ (2026-09-30, porządek listy: zamknięte 29.09 — D51, PR #206) ~~🔲~~ (2026-09-28) **Chmurki „?” przy polach liczbowych — niezgodność ze standardem 8.4 na prawie wszystkich ekranach (do zrobienia w osobnej sesji).** Standard (`docs/standards/08-ui-ux.md`, 8.4, ostatni akapit): każdy parametr liczbowy na **każdym** ekranie ma mały znak `?` obok etykiety — popover z pełną nazwą, jednym zdaniem „do czego służy”, gdzie to znaleźć i typowym zakresem wartości. Komponent jest gotowy: `PomocPole` w `components/ui/chmurka.tsx`, podłączony przez prop `pomoc` w `Pole`/`PoleSelect` (`components/ui/pole.tsx`). **Stan 28.09.2026:** `pomoc=` używa 1 z 193 ekranów w `app/kalkulatory/` (tylko `dobor-przekroju-kabla`) + `/wzornik`; ok. 107 ekranów ma zamiast tego widoczną podpowiedź `hint` pod polem, reszta nic. Pola w listach budowanych ręcznie (`<input>` w `.map()` — np. M7/E6, M9/E4, M9/E5, M7/E19) nie idą przez `Pole`, więc też trzeba je objąć. Opis całego ekranu (nagłówek `NaglowekEkranu`, część ekranów także `MigawkaBox`) — **jest wszędzie**, luka dotyczy tylko „?” przy polach. Brak decyzji zwalniającej → dryf od standardu (GOD BOOK Y.2), nie świadomy wybór; ekrany z 28.09 (M7/M8/M9) powieliły istniejący wzorzec. **Warianty (do wyboru przez właściciela przed startem):** (A) mechanicznie — `?` przy każdym polu z treścią z obecnego `hint`, pola bez `hint` tylko pełna nazwa + jednostka; szybko, ale część chmurek uboga. (B) pełna treść wg 8.4 — nazwa, do czego służy, gdzie znaleźć, typowy zakres; zakresy **wyłącznie** ze źródeł/norm w repo, gdzie ich brak — „zakres z karty katalogowej” (Dyrektywa #1, bez zgadywania); moduł po module, PR na moduł. (C) **rekomendowane** — najpierw A na wszystkich ekranach (zamyka niezgodność), potem stopniowo B, zaczynając od ekranów z twardymi stopami (`docs/rejestr-twardych-stopow.md`). **Do rozważenia przy okazji:** czy `hint` zostaje obok `?` (dubluje treść) — wtedy decyzja właściciela; i18n treści chmurek (dziś strony mają teksty PL wprost, słowniki `lib/i18n` obejmują tylko komunikaty silników). **Weryfikacja:** Playwright — każde pole liczbowe ma `?` z dostępną nazwą (`aria-label`), brak poziomego przewijania przy 390 px; ewentualnie strażnik (skrypt/test) wykrywający `<Pole type="number">` bez `pomoc`. **Priorytet:** średni (użyteczność i zgodność ze standardem, nie bezpieczeństwo). **Kolizje:** wszystkie `app/kalkulatory/*/page.tsx` — nie prowadzić równolegle z sesją budującą nowe ekrany w tych samych plikach; nowe ekrany od tej chwili powinny od razu dostawać `pomoc`. **Kolejność:** najpierw decyzja A/B/C, potem partie po module. **[28.09.2026] Uwaga dla tej pracy:** komponent chmurki naprawiony — wcześniej (Tooltip) nie otwierał się na dotyk, więc na telefonie „?” nic nie robiło; teraz Popover (hover + tap). Weryfikację robić też z emulacją telefonu. → **[28.09.2026] DECYZJA WŁAŚCICIELA (D34): wariant B** — pełna treść wg 8.4 (pełna nazwa, do czego służy, gdzie znaleźć, typowy zakres; zakresy wyłącznie ze źródeł/norm w repo, a gdzie ich brak — „zakres z karty katalogowej”, Dyrektywa #1), moduł po module, PR na moduł. **Dodatkowo:** chmurki mają zawierać **bogaty opis wyjaśniający, jak i po co działa kalkulator** (nie tylko pole), zrozumiały dla laika. Wariantów A i C nie stosować. Realizacja w **osobnej sesji** — nie zaczynać przy innych zadaniach. Otwarte przy starcie tej sesji: czy `hint` zostaje obok `?`, i18n treści chmurek. → **[29.09.2026] Rozstrzygnięte (D51):** `hint` usunięty (treść do „?”), i18n od razu; realizacja 🔄 — wpis z 29.09 niżej. → ✅ **[30.09.2026, porządek listy]** realizacja zamknięta 29.09 (wpis ✅ „Chmurki „?” i migawka „i” na wszystkich ekranach” niżej, PR #206).
- ✅ (2026-09-28) **Runda decyzji właściciela (sesja „lista do zrobienia po kolei”) — partia 1 wdrożona:** M3/E21 🔴 bez falownika wyspowego z AC-coupling (nowe pytanie tak/nie/nie wiem); M12/E22+E36 wodór — kwasowy 🔴, AGM 🟡; M12/E27 — pole „maks. napięcie ładowania instalacji” (górna granica z regulatora, nie stała 14,5/14,6 V). Rejestr twardych stopów i rejestr pokrycia zaktualizowane. Szczegóły: `docs/memory.md` „Sesja decyzji po kolei (28.09.2026)”.
- ✅ (2026-09-28) **D29 — masa paneli + stelaża w równowadze EQU (M3/E9, E2, E6)** — decyzja właściciela 28.09: opcjonalne pole „masa paneli i stelaża [kg]” (z karty/wagi, nigdy domyślna), liczona jako siła utrzymująca z γG,inf = 0,90 (Tablica A1.2(A) — już w `lib/core/modules/pv/eurokod-0/rownowaga.ts`). Przesuw/wywracanie nadal poza zakresem (brak μ). **Priorytet:** wysoki (bezpieczeństwo konstrukcji). **Odblokowuje:** dokładniejszy (mniejszy) balast. **Plusy teraz:** dane i funkcja EQU gotowe; **minusy odkładania:** balast zawyżony (strona bezpieczna, więc bez ryzyka). **Kolizje:** `lib/core/modules/pv/{zloty-srodek,typ-montazu,napor-wiatru}/`, słowniki i18n. **Kolejność:** następna partia tej sesji. → **Zrobione (28.09.2026):** `balastProjektowyEquKg(F, g, G)` = max(0, γQ·F/(γG,inf·g) − G) — wynik to balast **dodatkowy** ponad masę paneli+stelaża (clamp 0), koszt balastu E9 i twardy stop E6 liczone od niego; pole opcjonalne z chmurką w E2 (dach płaski/grunt, stelaż regulowany), E6, E9 i w narzędziach AI („nigdy nie zgaduj”); założenie `ZS-ZALOZENIE-MASA-WLASNA` (z masą i γG) albo `…-POMINIETA` w każdym wyniku; wersje kalkulatorów E6/E9 → 1.2.0. Przesuw/wywracanie — nadal poza zakresem.
- ⚠️ (2026-09-28) **M6/E8 — Rsi per kierunek strumienia ciepła (ściana/strop/podłoga)** — decyzja właściciela: tak, ale wartości z PN-EN ISO 6946, którą **właściciel dostarczy**. Do tego czasu Rsi = 0,13 dla wszystkich przegród (jawne założenie). **Priorytet:** niski (błąd rzędu kilku % κ). **Odblokowuje:** dokładność E8 dla stropów/podłóg. **Kolizje:** `lib/core/modules/ogrzewanie/pojemnosc-cieplna/`. **Kolejność:** po dostarczeniu normy.
  **[29.09.2026, korekta właściciela]** Wartości były już ustalone przy tej decyzji, tylko nie trafiły tu jako liczby (w `docs/memory.md` zostało samo „0,10/0,17”). Zapis wiążący: **ściana (strumień poziomy) 0,13 · strop/dach (strumień w górę) 0,10 · podłoga (strumień w dół) 0,17 m²·K/W** (✅🤖, układ PN-EN ISO 6946). Wdrożenie w E8 nadal odłożone do sprawdzenia końcowego z PKN — nie pytać właściciela ponownie. Liczby „0,17 / 0,10 / 0,13 ściany/dach/podłoga” z 28.09 (niżej) były podane z pamięci — nieaktualne.
  **[28.09.2026]** Właściciel potwierdził: decyzja zostaje, poprawka odłożona do dostarczenia PKN. Podane wartości: „0,17 0,10 i 0,13 — ściany, dach, podłoga”. ⚠️ Kolejność do sprawdzenia z normą: dosłownie ściana 0,17 / dach 0,10 / podłoga 0,13, a typowe przypisanie w ISO 6946 to ściana (strumień poziomy) 0,13, dach/strop (strumień w górę) 0,10, podłoga (strumień w dół) 0,17. Nie wdrażać przed normą.
  **[29.09.2026, D54]** Do czasu PKN: „używaj danych dostępnych ze źródeł” — 0,13 (kod bez zmian). Norma wpisana w `docs/normy-brakujace.md` (🔵 spodziewane).
- ✅ (2026-10-02, status odświeżony — wszystkie ekrany rundy `done` w `rejestr-pokrycia.md`; zamknięte wpisem 01.10 „M12 — wszystkie ekrany budowalne zbudowane”) ~~🔲~~ (2026-09-28) **M12 — runda „uproszczone wersje” wg decyzji hybryda** (zamyka wpis ⚠️ 27.09): odsyłacze E28 (← M4/E12), E31 (← M2/E13); wrappery E23 (← M4/E10), E38 (← M5 uziemienie), E8 (← M5/E7); Wzorce B E20/E17/E18/E7/E34; E19, E6 po sprawdzeniu silnika-źródła. **Priorytet:** średni. **Odblokowuje:** pokrycie M12 (13/43 → ok. 25/43). **Kolizje:** wspólne pliki słowników/pulpitu/narzędzi AI (tylko dopisy); ekrany z tej rundy od razu z `pomoc` (8.4). **Kolejność:** po D29 (✅ 28.09); jeden ekran = jedna partia. **Postęp:** ✅ E28 (28.09 — odsyłacz do M4/E12 w kaflu M12); ✅ E31 częściowo (28.09 — odsyłacz do M2/E13; „ile się fizycznie zmieści” bez danych w źródle); ✅ E23 (28.09 — wrapper do M4/E10, próg IP55 echo, lista osłon z Biblii §12.34; progi IP wg D44, kalkulator 1.2.0). ✅ E38 (28.09 — wrapper do M5/E9/E11 wg Biblii §12.53: DC bez stopu, 230 V → 🔴 obudowa falownika (poziom echo M5/E11) i 🔴 gniazda bez styku ochronnego, „nie wiem” = „nie”, ℹ️ zalecenie dla jachtu/na zewnątrz; schemat SVG; gałąź `claude/e38-uziemienie-c3xs6h`). **[29.09.2026]** E38 rozbudowany i scalony do `main` (PR #208 — D52, PR #217 — D56 pętla zwarcia, D57 słupek/keja, namiot, jacht; kalkulator 1.3.0); otwarte zostały tylko normy do potwierdzenia poziomów (wpisy 🔲 E38 niżej). **Następny krok: E8 (← M5/E7)**, dalej bez zmian. **→ PRZEKAZANIE DLA KOLEJNEJ SESJI (28.09.2026, aktualizacja):** ostatnia gałąź robocza `claude/standards-history-review-m230z0` — scalona do `main` przez PR (wraz z wcześniejszą `claude/todo-list-review-l7me97`). **Następny krok: E38 (wrapper ← M5 uziemienie)**, potem E8 (← M5/E7), dalej Wzorce B w kolejności E20 → E17 → E18 → E7 → E34, na końcu E19 i E6 (najpierw sprawdzić, czy silnik-źródło istnieje i co liczy — jeśli nie pasuje, wpis ⚠️ do właściciela, nie zgadywać). **Procedura na każdy ekran (jedna partia = jeden commit):** (1) przeczytać dany EKRAN w `docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md` i wiersz w `docs/rejestr-pokrycia.md` (sekcja M12, od ok. linii 509); (2) wrapper = cienki silnik w `lib/core/modules/…` z 2–3 polami wołający istniejący silnik-źródło (bez nowych liczb/norm), z testami; Wzorzec B = tabela porównawcza jak inne ekrany B w repo; (3) strona w `app/kalkulatory/<slug>/page.tsx` — **każde pole z `pomoc`** (D34: pełna nazwa, do czego służy, gdzie znaleźć, typowy zakres tylko ze źródeł, inaczej „z karty katalogowej”); (4) wpis w kaflu M12 w `lib/pulpit/registry.ts` (id 12); ewentualnie słowniki i18n pl/en/ru i narzędzie AI, jeśli silnik ma komunikaty; (5) rejestr pokrycia → done, postęp w tym wpisie, `docs/memory.md` tylko przy nietrywialnej decyzji; (6) lokalnie pełny pakiet: `pnpm typecheck`, `lint` (3 stare ostrzeżenia `<img>` są znane), `check:i18n-guard`, `test` (stan: 213 plików / 1729 testów), `build`, `audit:gate`; (7) commit + push; nie uruchamiać prettiera. **Wzorzec odsyłacza** (gdy źródło już jest „uproszczone”): drugi wpis z tym samym `href` w kaflu M12 — bezpieczne, okruszki pokazują moduł źródłowy (`docs/memory.md`, „Sesja decyzji po kolei”). Raport do właściciela po polsku: ZMIENIONO / DODANO / USUNIĘTO / WPŁYW + status commit/push/PR + ocena `/compact`.
- ✅ (2026-09-28) **D32 i D33 potwierdzone przez właściciela (✅🤖 zamknięte):** M7/E8 — zwykły diesel 🟡 od +10°C, 🔴 poniżej +5°C, zalecenia paliwa zimowego (od +5°C) i arktycznego (< −10°C), świece obowiązkowo, dodatek zimowy; kalkulator 1.2.0; „paliwo + temperatura” jako samodzielny werdykt — potwierdzone. M12/E11 — dopisane przykładowe moce: pompa głębinowa 750 W, klimatyzator split 900 W, kamera IP 5 W (wartości dobrane przez AI na polecenie właściciela). Szczegóły: `rejestr-decyzji.md` D32/D33.
- ⚠️ (2026-09-28) **Nowy rozdział: rozliczenia energii z siecią (gospodarstwo / przedsiębiorca)** — 2 dokumenty zapisane 1:1 w `docs/zrodla/` (`Material_Przedsiebiorcy_Taryfy_C_PV_Magazyny_2026-09-28.md`, `Material_Stawki_Dystrybucyjne_OSD_2026_2026-09-28.md`), weryfikacja i kategoryzacja F.2 wykonane (`docs/memory.md`, wpis 28.09.2026). **Czeka na decyzje właściciela:** (1) czy kolejne dokumenty w drodze, (2) nowa domena w apce off-grid = nowy moduł M14, (3) nawigacja segmentu gospodarstwo/firma, (4) źródło danych stawek. Potem: opracowanie → Biblia → plan ekranów → audyt → kod (N.3). **Priorytet:** wysoki (bieżące zadanie właściciela). **Odblokowuje:** cały nowy rozdział. **Plusy teraz:** materiał świeży, decyzje tanie przed opracowaniem; **minusy:** stawki 2026 tracą ważność 31.12.2026. **Kolizje:** brak z otwartymi wpisami (nowe pliki; przyszła zmiana `lib/pulpit/registry.ts` — kolizja z każdą sesją dodającą kafle). **Kolejność:** decyzje → opracowanie → Biblia; przed wpisem do Biblii sprawdzenie Y.6 (zaległe od 27.09).
  - [28.09.2026, później] Decyzje (1)–(4) podjęte: brak dalszych dokumentów; M14 potwierdzony, dwa duże kafle Dom/Firma = dwa rozdziały; dane stawek wpisuje Claude z poprawnych źródeł + zawsze tryb „moje dane z faktury”. **Opracowanie gotowe (szkic):** `docs/zrodla/Opracowanie_M14_Z_Sieci_Na_OffGrid_DRAFT.md` — scenariusze A–D z wzorem TCO, rejestr ryzyk odłączenia, procedura, twarde stopy, część Firma z 14 adnotacjami ✏️, plan ekranów D1–D14 / F1–F13 + kreator „Ścieżka przejścia”. **Czeka na:** polecenie „integruj teraz” (P3 — profile autokonsumpcji, rozstrzygnięte; P4 — dane: odblokowanie domen albo ręczna weryfikacja właściciela wg listy §9.1, nie blokuje Biblii; P1 FREE/PRO — odłożone, P2 — kafle „Dom – sieć”/„Firma – sieć”, najpierw sieć, potem opcja przejścia) i polecenie „integruj teraz”. **Bloker przed kodem kalkulatorów rachunku — DANE-1:** stawki 2026 z dokumentów pierwotnych (PDF taryf OSD, URE, rozporządzenia); środowisko blokuje te domeny → odblokować w ustawieniach sieci środowiska albo dostarczyć PDF-y. Do tego czasu tylko tryb „moje dane z faktury”. **Stan 28.09.2026 wieczór:** W1, W2, W5, W7 ✅; W3 częściowo (Tauron, Energa, Stoen ✅; Enea tylko brutto; PGE ❌); otwarte: W3-PGE i W6 regulamin PME (tylko PDF od właściciela — serwery z wadliwym certyfikatem), W4 profile zużycia, wartość `C_rk`. Rewizja: ✏️ K4 (1,23) wycofana — materiał miał rację.

  - [28.09.2026, po „Integruj teraz”] ✅ **Zintegrowane do Biblii:** `03_M14_Dom_i_Firma_Siec.md` + D35–D38 + rejestry (pokrycie 28 wierszy `todo`, twarde stopy, słownik, mapa, backlog, pulpit, `00_Biblia.md`); audyt przyrostowy N.2 rozdziału zamknięty (`docs/memory.md`). **Dalej:**
    - (a) ⚠️ PDF od właściciela: taryfa PGE Dystrybucja 2026 i regulamin PME (NFOŚiGW) — serwery z niepełnym łańcuchem TLS;
    - (b) 🔲 odczyt wizualny: ~~skan taryfy Enea (netto), Stoen tabela 7.3 (C22a/b);~~ **[29.09.2026] Enea netto i Stoen C22a/b ✅ w pliku danych;** `C_rk` (komunikat URE); profile W4; stawki przyłączeniowe IV–VI;
    - (c) ⚠️ decyzje właściciela: pozycja kafli na pulpicie, domyślne TCO (`N` = 15, `r` = 0, `g` = 0 — ✅🤖).
    - (c) ✅ [28.09.2026] rozstrzygnięte przez właściciela: pozycja kafli → D39, domyślne TCO → D40, plus „Ścieżka UE” (projekcja cen KE, EU Reference Scenario 2020, odczyt pierwotny arkusza `PL_A`).
    
    **Priorytet:** średni (kod i tak czeka na N.3). **Odblokowuje:** plik danych `rozliczenia-pl-2026` → kod M14 po audycie końcowym. **Kolizje:** brak z innymi wpisami (nowe pliki, rejestry tylko dopisywane). **Kolejność:** dane (a/b) przed kodem kalkulatorów rachunku; część Przejście niezależna od DANE-1.
- ⚠️ (2026-09-28) **M14 — PDF-y od właściciela (DANE-1, W3-PGE i W6).** Na polecenie właściciela („Dodaj do listy zadań”) jako osobne zadanie. Potrzebne dwa pliki:
  1. taryfa **PGE Dystrybucja S.A. na 2026 r.** (PDF z pgedystrybucja.pl → Taryfa);
  2. **regulamin naboru programu „Przydomowe Magazyny Energii” (NFOŚiGW)**, aktualna edycja.

  Obu Claude nie pobierze sam: serwery mają niepełny łańcuch certyfikatów TLS, a obejście zostało zablokowane. Właściciel wrzuca PDF-y do `docs/zrodla/` albo wkleja je w sesji. Claude zapisuje 1:1 i wpisuje stawki PGE do opracowania M14 (§ tabele OSD) oraz warunki PME do §9. **Priorytet:** średni. **Odblokowuje:** domyślne stawki PGE w pliku `rozliczenia-pl-2026` (bez nich użytkownik PGE ma tylko tryb „moje dane z faktury”, D36) oraz kwoty dotacji PME w części Przejście. **Kolizje:** brak. **Kolejność:** przed plikiem danych `rozliczenia-pl-2026`, niezależnie od N.3.
- 🔲 (2026-09-28) **M14 — „Ścieżka UE” do pliku danych i jej aktualność (D40).** (1) Przy budowie pliku danych M14 wpisać punkty 2020–2050 z EU Reference Scenario 2020 (`PL_A`, €'15/MWh) z polami `zrodlo` / `stanNa` / `pewnosc`, plus test: indeks rok do roku z interpolacji geometrycznej odtwarza +1,65%/rok (2020–2030) i +0,44%/rok (2030–2050) z arkusza. (2) Przy każdym przeglądzie danych M14 sprawdzać stronę KE „EU Reference Scenario”: czy opublikowano edycję 2025 lub nowszą. Jeśli tak, podmienić dane i zostawić starą wersję w logu źródła. **Priorytet:** niski (kod M14 czeka na N.3). **Odblokowuje:** opcję „Ścieżka UE” w TCO. **Kolizje:** brak. **Kolejność:** razem z plikiem `rozliczenia-pl-2026`.
- ⚠️ (2026-09-28) **M14 — D41 „Ścieżka UE + inflacja”: do potwierdzenia przez właściciela, która inflacja ma być domyślna.**
  - Propozycja AI (✅🤖): **cel NBP 2,5%** — oficjalna kotwica na przyszłość.
  - Alternatywa: **średnia GUS z 15 lat, 3,58%** — historia, w tym szok 2022–2023.
  
  Obie wartości są w rozdziale ze źródłami. **Przy pliku danych:** wpisać π (NBP, GUS) z `zrodlo` / `stanNa` / `pewnosc` i przykład kontrolny (75 000 / ≈81 444 / ≈100 143 zł) jako test. Średnie GUS przeliczać po publikacji danych za kolejny rok. **Priorytet:** niski (kod czeka na N.3). **Odblokowuje:** opcję nominalną w TCO. **Kolizje:** brak. **Kolejność:** razem z plikiem `rozliczenia-pl-2026`.
- ✅ (2026-09-28) **Rozstrzygnięte: domyślna inflacja M14 = średnia GUS z 15 lat, 3,58% (D43)**. Zamyka wpis ⚠️ „D41 — do potwierdzenia, która inflacja domyślna”. Decyzja właściciela; NBP 2,5% zostaje do wyboru. Przykład kontrolny do testów pliku danych: 109 699 zł (UE + 3,58%, 5 000 zł/rok, `N` = 15).
- ✅ (2026-09-28) ~~**Do decyzji właściciela — M12/E23, wilgotny garaż: IP55 czy IP65?** (A) Próg twardy z M4/E10: poniżej IP55 w miejscu narażonym na wilgoć → 🔴 (wdrożone). (B) Przykład Biblii §12.34: „W garażu wilgotnym użyj obudów IP65 i puszki z uszczelką”. Dziś: IP55–IP64 w wilgotnym garażu = werdykt 🟢 + informacja ℹ️ z zaleceniem IP65 (przykład potraktowany jako zalecenie, nie próg). Opcje: (1) zostaje tak; (2) IP55–IP64 w wilgotnym garażu → 🟡; (3) próg 🔴 w garażu podnieść do IP65 (rozjazd z M4/E10). Dla namiotu i jachtu źródło nie podaje żadnego stopnia IP — obowiązuje ogólne IP55. **Priorytet:** niski. **Kolizje:** bezkolizyjne (`lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/`).~~ **[28.09.2026] Rozstrzygnięte — D44 (`rejestr-decyzji.md`):** garaż IP55–IP64 → 🟡 (opcja 2); namiot i jacht → minimum IP65, poniżej 🔴. Wdrożone (kalkulator 1.1.0). ✅ **Potwierdzone przez właściciela (28.09.2026, kalkulator 1.2.0):** 🔴 poniżej IP65 dla namiotu/jachtu; namiot i jacht zawsze traktowane jako wilgotne; zalecane tam IP67–IP68 (🟡 przy IP65–IP66); zalecane IP65 (🟡 przy IP55–IP64) w każdym miejscu z zaznaczoną wilgocią.
- 🔲 (2026-09-28) **Rejestr twardych stopów — dryf całego M5.** Przy E38 wyszło, że żaden stop `critical` Modułu 5 (ok. 20 realnych, np. `GSW-UZYWANA-JAKO-PRZYLACZE`, `KOROZJA-GALWANICZNA-CU-AL`, `UKLAD-IT-BEZ-IMD`, `BRAK-TYPU-1-PRZY-ODGROMOWEJ`, `SPD-UZIEMIONY-OSOBNO`, `WYLACZNIK-NIECERTYFIKOWANY-DO-DC`, `WYMAGANY-TYP-B`, `PROG-POWYZEJ-OCHRONY-OSOB`, `MIESZANI-PRODUCENCI-MC4`, `BRAK-SKRZYNKI-IP66`, `IZOLACJA-PONIZEJ-TEMPERATURY`, `FALOWNIK-ZA-SLABY`, `SZCZELINA-KRYTYCZNA`, 8 kodów `pomiary-powykonawcze`…) nie jest w `docs/rejestr-twardych-stopow.md` (4.3) — dopisano tylko M5/E11. Generyczne `WARTOSC-UJEMNA` itp. pominąć (sekcja „Walidacja danych”). Przy okazji sprawdzić ten sam skrypt na M3/M6/M7/M8 (lista: pętla po `warnings.ts` z `level: "critical"` i grep kodu w rejestrze). **Priorytet:** wysoki (4.3 — rejestr to narzędzie audytu bezpieczeństwa; GOD BOOK Y.2 — dryf, naprawić bez pytania). **Odblokowuje:** wiarygodny audyt bezpieczeństwa całej instalacji. **Plusy teraz:** tylko dokumentacja, zero ryzyka dla kodu; **minusy:** trzeba przeczytać każdy warunek, żeby opisać go merytorycznie (nie kopiować kodu). **Kolizje:** tylko `docs/rejestr-twardych-stopow.md`. **Kolejność:** najlepiej przed E8 albo zaraz po nim, jedna partia = jeden commit.
- ✅ ~~⚠️~~ (2026-09-28) **Do potwierdzenia przez właściciela — poziomy w M12/E38 (✅🤖):** (1) gniazda 230 V bez podłączonego styku ochronnego = 🔴 (źródło mówi „ryzyko porażenia”, nie podaje poziomu; przyjąłem jak obudowę falownika); (2) jacht/na zewnątrz przy samym 12/24 V DC = ℹ️ zalecenie (źródło: „zaleca”), nie 🟡; (3) „nie wiem” = „nie” (strona bezpieczna, jak M3/E21). Alternatywy: (1) 🟡; (2) 🟡 jak zalecenia IP w E23. **Priorytet:** średni. **Kolizje:** bezkolizyjne. **Kolejność:** dowolnie, zmiana = jedna stała/poziom + teksty. → ✅ **(29.09.2026) Rozstrzygnięte — D52:** (1) gniazda → 🟡, komunikat tłumaczy, po co jest bolec i czym grozi jego brak; (2) jacht/na zewnątrz → 🟡 (tylko przy samym DC — przy 230 V uziemienie i tak sprawdzane); (3) „nie wiem” = „nie” bez zmian. Kalkulator 1.1.0.
- ✅ (2026-09-29) **M12/E38 — pętla zwarcia (D56).** Właściciel: „Musimy to rozwiązanie ująć w kalkulatorze”. Dodane pytania o połączenie N–PE w falowniku i RCD 30 mA (brak = 🔴), objaśnienie „ochrona nie potrzebuje ziemi, tylko zamkniętej pętli” i schemat pętli. Zamyka propozycje po pytaniach o kampera/namiot/jacht: (1) „wiszący przewód ani łańcuch nie jest uziemieniem” — w objaśnieniu i komunikacie N–PE; (2) RCD 30 mA — zrobione (🔴, echo M5); (3) stacja z wyjściem pływającym vs falownik z N–PE — pokryte pytaniem o N–PE (patrz ⚠️ niżej). Kalkulator 1.2.0.
- ✅ ~~(2026-09-29) **Do decyzji właściciela — M12/E38: pojedynczy odbiornik z wyjścia pływającego (✅🤖 w D56).**~~ **[29.09.2026] Rozstrzygnięte — D57:** namiot z wyjściem pływającym → 🟡 z zasadami (separacja elektryczna, podwójna izolacja, PRCD z zastrzeżeniem), nie 🔴 — wiedza z praktyki właściciela. Potwierdzenie z normy: wpis niżej (PN-HD 60364-4-41:2017). (A) Dziś: brak N–PE → 🔴 zawsze, także gdy stacja zasilania z wyjściem pływającym (bez N–PE) zasila jedno urządzenie. (B) Taki układ bywa traktowany jako osobny środek ochrony — separacja elektryczna (jeden odbiornik, bez połączenia z PE innych części) — wtedy 🔴 byłby fałszywym alarmem; wymagałoby to pytania „jeden odbiornik czy więcej” i źródła normowego (🔎 PN-HD 60364-4-41 — brak w repo, nie wpisuję z pamięci). **Priorytet:** średni. **Kolizje:** bezkolizyjne. **Kolejność:** dowolnie.
- ✅ ~~2026-09-29) **M12/E38 — propozycja (4): jacht — separator galwaniczny i połączenie w jednym punkcie** (Wzorzec C, informacyjnie). Czeka na decyzję właściciela, czy robić.~~ **[29.09.2026] Zrobione — D57:** ℹ️ Wzorzec C bez progów (połączenie w jednym punkcie, ELCI, separator galwaniczny/transformator separacyjny przy kei).
- 🔲 (2026-09-29) **M12/E38 — RCD 30 mA: poziom 🔴 tymczasowy (D57).** Właściciel: „na razie czerwone, potem normę dostarczę”. Po dostarczeniu PN-HD 60364-7-721 (instalacje w pojazdach wypoczynkowych/przyczepach) sprawdzić wymaganie RCD 30 mA i poziom `UMI-BRAK-RCD-30MA`; wpis w `docs/normy-brakujace.md` (🔵). **Kolizje:** tylko `uziemienie-male-instalacje/warnings.ts`.
- 🔲 (2026-09-29) **M12/E38 — namiot: potwierdzenie z PN-HD 60364-4-41:2017 (D57).** Mamy tylko wyciąg PN-IEC 60364-4-41:2000 (413.5 separacja elektryczna). Potrzebne do: (a) czy wyjście przenośnej stacji zasilania to „źródło równoważne transformatorowi separacyjnemu”; (b) wymagania przy więcej niż jednym odbiorniku (413.5.3 w starym wydaniu: nieuziemione przewody wyrównawcze, gniazda ze stykami do tego systemu); (c) czy przy wyjściu pływającym i kilku odbiornikach 🟡 powinno przejść w 🔴. Wpis w `docs/normy-brakujace.md` (🟡).
- 🔲 (2026-09-29) **M12/E38 — jacht: pozyskać ABYC E-11 i ISO 13297 (D57).** Dziś treść jachtowa to ℹ️ Wzorzec C „do potwierdzenia z tekstu normy”. Po pozyskaniu: sprawdzić zasady (jeden punkt połączeń, N–PE poza keją, ELCI, separator galwaniczny) i ewentualnie zamienić część ℹ️ na progi. Wpis w `docs/normy-brakujace.md` (🟡).
- 🔲 (2026-09-29) **M12/E38 — komunikat podwójnego N–PE w wersji dla jachtu.** Tekst `UMI-PODWOJNE-POLACZENIE-N-PE` (PL/EN/RU) jest jeden dla kampera i jachtu, więc na jachcie mówi o „słupku”, „podwoziu” i „karoserii” (ekran już dopasowuje słowa: keja, kadłub, pomost). Do zrobienia: osobny klucz i18n dla jachtu albo tekst neutralny. **Priorytet:** niski (poziom i sens poprawne, tylko słownictwo). **Kolizje:** słowniki i18n, `warnings.ts` E38 (+ test). **Kolejność:** dowolnie, najlepiej razem z wpisem ABYC/ISO wyżej.
- 🔲 (2026-09-29) **M12/E38 — pozyskać PN-HD 60364-7-708 i PN-HD 60364-7-709 (strona sieci: kemping, marina).** 7-721 opisuje instalację w pojeździe, a te dwie — **słupek na kempingu** (7-708) i **przyłącze w marinie** (7-709): czy każde gniazdo słupka ma własny RCD, jaki układ sieci jest dopuszczalny na słupku. **Potrzebne do:** komunikatów o słupku/kei w E38 (dziś „stary słupek bez RCD” to wiedza z praktyki, nie wymaganie normy) i ewentualnego pytania „czy słupek ma RCD”. Spis: `docs/normy-brakujace.md` (🟡). **Priorytet:** niski — nie zmienia dziś żadnego poziomu. **Kolizje:** bezkolizyjne.
- ℹ️ (2026-09-28) **Niescalona gałąź `claude/nowy-rozdzial-biblia-kalkulator-to73by`** — commit `d3aad66` „audyt końcowy N.3 całej Biblii — poprawki i 4 decyzje do właściciela” (docs + 2 komentarze TD w kodzie) nie jest na `main` (stan 28.09 17:24 UTC). Decyzja właściciela: PR/scalenie albo porzucenie. Do czasu scalenia 4 decyzje z audytu N.3 nie są widoczne na tej liście. → ✅ **(28.09.2026) Scalona do `main` (PR #186, #187)** — decyzje audytu N.3 są już na liście (wpis niżej, D47–D49).
- ✅ (2026-09-28) **[28.09.2026] Decyzje 1–3 podjęte i wykonane: D47, D48 (kod M2/E17 1.1.0 i M7/E8 1.3.0), D49. Otwarta tylko decyzja 4: 10 × ✅🤖 plus 2 wyjątki przełącznika z D48 pkt 4 (wejście AC falownika, odbiorniki wprost w agregat). Wyjaśnienie z opcjami podane właścicielowi 28.09.2026.** Audyt końcowy N.3 — do zamknięcia potrzebne 4 decyzje właściciela (szczegóły: `docs/memory.md`, „Audyt końcowy N.3 całej Biblii”). Poprawki mechaniczne zrobione (wersje w indeksie, TD20/TD21, słownik, backlog, adnotacje).
  **[28.09.2026, scalenie z `main`]** Z pkt 4 zamknięte na `main` przez równoległą sesję: D29 addendum, D32 i D33. Otwarte zostaje 9 pozycji (TD21, Rsi, M8/E3, M8/E4, M9/E2, M9/E4, kafle M14 i 2 wyjątki D48). Numery D44–D46 z tej gałęzi zmienione na D47–D49 (H.3). Szczegóły: `docs/przekazanie-nastepnej-sesji.md`.
  **[28.09.2026, odpowiedź właściciela na pkt 4]** D29 balast → B (już zrobione na `main`); D32 → „już ustalone” (jest w D32 z korektą: paliwo zimowe/arktyczne, świece, dodatki); D33 → zostawić; TD21 CRL, M8/E4 gaz, M9/E2 magistrala → **odłożone**; Rsi → decyzja już była, poprawka odłożona do dostarczenia PKN (~~wartości podane przez właściciela: 0,17 / 0,10 / 0,13 — przypisanie ściana/dach/podłoga do sprawdzenia z normą~~ **[29.09] korekta:** podane z pamięci; wiążące ściana 0,13 · strop/dach 0,10 · podłoga 0,17 — wpis „Rsi per kierunek” wyżej). **Bez odpowiedzi:** M8/E3 fail-secure, M9/E4 CAN, kafle M14, 2 wyjątki D48.
  **[28.09.2026, D50] Zamknięte dla M14:** właściciel odłożył pozostałe pytania („Zostaw pytania na potem”); bramka N.3 zdjęta, kod M14 może startować. Odłożone pozycje — osobny wpis ⚠️ niżej.
  1. **Przełącznik sieć – 0 – wyspa / SZR:** M14 i stop „backfeed” odsyłają szczegół normowy do M8, a w M8 nie ma na to ekranu. Propozycja: szczegół mieszka w M14/D11, a M8 tylko odsyła. Norma HD 60364-5-551 jest nieobecna (🔎).
  2. **Stopy agregatu w istniejącym kodzie:** M2/E17 i M7/E8 nie ostrzegają przed agregatem w pomieszczeniu (CO) ani przed agregatem bez przełącznika. Propozycja: dopisać do obu ekranów stop „w pomieszczeniu”, a „bez przełącznika” tylko wtedy, gdy użytkownik ma przyłącze.
  3. **Szkic „Oświetlenie LED”** (14.09): czeka na kartę katalogową taśmy (`R_taśmy_na_metr`). Propozycja: status „kandydat poza Biblią”, więc nie blokuje N.3. Po integracji dostaje własny audyt, tak jak M14.
  4. **Potwierdzenie ✅🤖 (C.7), 10 pozycji:**
     - D29 pkt (2) i (5): balast M3;
     - D32: poziomy ostrzeżeń i pkt (5) agregatu w mrozie;
     - D33: lista 16 urządzeń;
     - TD21: obcinanie długości od największej wagi (CRL);
     - M6/E8: Rsi = 0,13;
     - M8/E3: fail-secure z UPS jako 🟡;
     - M8/E4: gaz obojętny/aerozol przy LiFePO4 jako 🟡;
     - M9/E2: 🔴 magistrala ponad wejście przetwornicy;
     - M9/E4: 🟡 CAN bez transceivera;
     - pulpit: kafle M14 ukryte w 8 presetach.

  **Priorytet:** wysoki (bramka N.3 kodu M14). **Odblokowuje:** kod M14. **Kolizje:** pkt 2 zmienia istniejące ekrany M2/E17 i M7/E8 (kolizja z każdą sesją nad nimi). **Kolejność:** decyzje → ewentualne poprawki → zamknięcie audytu → plik danych `rozliczenia-pl-2026` + silnik TCO.
- ⚠️ (2026-09-28) **Szkic „Oświetlenie LED” czeka na kartę katalogową taśmy** (`docs/zrodla/Opracowanie_Tasmy_LED_Oswietlenie_DC_DRAFT.md`, `docs/memory.md` 14.09.2026). Do tej pory śledzony tylko w `docs/memory.md` (znalezione w audycie N.3). Właściciel dostarcza kartę z `R` na metr; bez niej Claude nie proponuje wartości. **Priorytet:** niski. **Odblokowuje:** integrację rozdziału LED. **Kolizje:** brak. **Kolejność:** po decyzji 3 z audytu N.3. **[28.09.2026] Decyzja 3 podjęta (D49): kandydat poza Biblią, nie blokuje N.3; zapis także w `backlog-poza-v1.md` i nagłówku szkicu.**
- 🔲 (2026-09-28) **Przekazanie dla następnej sesji:** `docs/przekazanie-nastepnej-sesji.md`. Ta sesja nie pisze kodu M14 (polecenie właściciela) — kod pisze następna, według tego pliku. **Priorytet:** wysoki. **Odblokowuje:** kod M14. **Kolizje:** brak. **Kolejność:** decyzja 4 → zamknięcie N.3 → plik `rozliczenia-pl-2026` → ekrany Sieć → TCO → Przejście → kafle. **[28.09.2026, D50]** Plik ma na górze sekcję „STAN NA TERAZ” — kod M14 odblokowany, start od pliku danych `rozliczenia-pl-2026`.
- ⚠️ (2026-09-28) **Pytania odłożone przez właściciela (D50) — nie pytać, dopóki sam nie wróci:** TD21 CRL (obcinanie > 1 km), Rsi per kierunek (czeka na PKN, osobny wpis wyżej), M8/E3 fail-secure z UPS 🟡, M8/E4 gaz przy LiFePO4 🟡, M9/E2 magistrala 🔴, M9/E4 CAN 🟡, kafle M14 ukryte w 8 presetach, 2 wyjątki przełącznika D48 (wejście AC falownika, odbiorniki wprost). Opcje i pliki: `docs/przekazanie-nastepnej-sesji.md`, Krok 0. **Priorytet:** niski. **Odblokowuje:** potwierdzenie ✅🤖 (C.7). **Kolizje:** brak. **Kolejność:** gdy właściciel wróci do tematu.
  **[29.09.2026, D53 — odpowiedzi właściciela]** ✅ M8/E3 zamki (pole ręcznego otwarcia bez prądu, 🔴 tylko bez UPS i bez ręcznego otwarcia) · ✅ kafle M14 widoczne we wszystkich presetach (do kodu z onboardingiem) · ✅ 2 wyjątki D48: agregat zawsze przez rozdzielnię (etykiety i teksty) · ✅ M9/E2: ESP32 będzie mieć oddzielne zasilanie, kod bez zmian · ⚠️ M8/E4 gaz: właściciel prosi o podpowiedź — rekomendacja mgła wodna, gaz 🟡 zostaje do potwierdzenia · ⚠️ M9/E4 CAN: właściciel jeszcze nie wie, czy będzie CAN — rekomendacja 🔴 jak RS485, bez zmian · nadal odłożone: TD21 CRL, Rsi (PKN).
  **[29.09.2026, sprawdzenie źródeł i `main`]** Żadna z tych spraw nie została rozwiązana gdzie indziej (brak otwartych PR, gałęzie równoległe starsze niż 28.09 i już scalone). Źródła: gaz — Biblia v2.0 §4.10 potwierdza mgłę wodną / środek do magazynów energii jako jedyny skuteczny (otwarte: 🟡 czy 🔴 dla gazu/aerozolu); CAN — Biblia v2.0 §9.28 ma to samo ostrzeżenie co RS485 (za 🔴); Rsi i CRL — brak rozstrzygnięcia w repo.
  **[29.09.2026, D54]** Rozstrzygnięte: TD21 CRL, Rsi (do PKN), gaz 🟡, kafle M14. **Otwarte zostaje tylko M9/E4 CAN.**
- ✅ ~~(2026-09-28) **M14 — kod, start:** plik danych `rozliczenia-pl-2026` → część Sieć (D1–D3, D8, D12, F1–F5) → TCO i scenariusze → Przejście → kafle. Pełna kolejność: `docs/przekazanie-nastepnej-sesji.md` („STAN NA TERAZ”). **Priorytet:** wysoki. **Odblokowuje:** M14. **Kolizje:** `lib/pulpit/` (kafle, na końcu), `lib/i18n/`. **Kolejność:** od pliku danych.~~ **[28.09.2026] zrobione** (patrz wpis niżej).
- ✅ (2026-09-28) **M14 — start kodu (po D50).** Plik danych `lib/core/dane/rozliczenia-pl-2026` (JSON + Zod, tylko ✅, okresy ważności; schemat odrzuca 🔎), część Sieć: D1/F1 rachunek, D2/F2 porównanie taryf, D8 depozyt, D12/F11 test licznika + pismo, F3 moc bierna, F4 moc umowna, F5 opłata mocowa; silnik „Wzrost cen energii” (D40–D43) z przykładem kontrolnym; 2 kafle pulpitu; 3 narzędzia AI. Ograniczenia: `dlug-techniczny.md` TD22. Szczegóły: `docs/memory.md`.
- ✅ ~~(2026-09-28) M14 — dalej wg `docs/przekazanie-nastepnej-sesji.md`: silnik TCO i ekran D7/F8 (Krok 2d), potem Przejście (2e), reszta Sieci (D3, D13, D14, F6, F7, F12, F13), kafle/kreator (2f).~~ **[28.09.2026] zrobione** — rozdział M14 zbudowany w całości (25/25 ekranów + kreator, 5 narzędzi AI, 5 twardych stopów w kodzie). Uproszczenia TD23.
- 🔲 (2026-09-28) **M14 — po kodzie zostają tylko dane i decyzje:** lista „Otwarte — wymaga danych zewnętrznych” w `03_M14` (PDF PGE, PDF regulaminu PME → linki w `lib/core/dane/dotacje`, ~~Enea, Stoen C22,~~ **[29.09.2026] Enea, Stoen C22 i abonament C Tauronu ✅,** profile W4, `C_rk`, stawki przyłączeniowe IV–VI), „duże” kafle i presety (odłożone), FREE/PRO (D37), M7 7.2/7.37 jako pełny warunek zimowy D5 (TD23). **Priorytet:** średni. **Odblokowuje:** pełne stawki domyślne (DANE-1). **Kolizje:** brak.
- ✅ (2026-09-29) **Chmurki „?” i migawka „i” na wszystkich ekranach (D34 + D51).** Odpowiedzi właściciela na pytania
  otwarte w D34: `hint` usunąć (treść do „?”), tłumaczenia PL/EN/RU od razu, robić „?” i „i”. Zrobione: infrastruktura
  (`lib/i18n/pomoc/`, `components/ui/pomoc.tsx`), strażnik `pnpm check:pomoc-guard` z listą zapadkową, **M12 w komplecie**
  (15 ekranów + 2 komponenty wspólne). Zostaje: pozostałe moduły wg `scripts/pomoc-guard-baseline.json` (226 plików),
  kolejność: ekrany z twardymi stopami → M14 → reszta; PR na moduł. **Priorytet:** średni. **Kolizje:** wszystkie
  `app/kalkulatory/*/page.tsx` — nie równolegle z sesją budującą nowe ekrany w tych samych plikach. Nowe ekrany od
  razu w komplecie (Dyrektywa #15) — strażnik ich nie przepuści.
  **[29.09.2026] M14 w komplecie** (24 ekrany + 9 komponentów wspólnych, w tym `agregat-bezpieczenstwo` używany też
  przez M2/E17 i M7/E8); lista zapadkowa 226 → 193.
  **[29.09.2026] M8 w komplecie** (10 ekranów); lista zapadkowa 193 → 183.
  **[29.09.2026] M5 w komplecie** (29 ekranów + sekcja CRL); teksty `MIGAWKA` z 3 plików `constants.ts` przeniesione do „i” (stałe usunięte jako martwy kod); lista 183 → 153.
  **[29.09.2026] M4 w komplecie** (35 ekranów, w tym F7 „Magazyn w firmie”); `MIGAWKA` matrycy alarmów BMS przeniesiona do „i”; lista 153 → 118.
  **[29.09.2026] M11 w komplecie** (23 ekrany, ścieżki A i B); 3 stałe `MIGAWKA` przeniesione do „i”; lista 118 → 95.
  M3 PV (24 ekrany + 6 komponentów „Typ montażu”) — ✅ „?” + „i” PL/EN/RU
  M2 zapotrzebowanie ✅ (18 ekranów + wampiry energetyczne)
  M7 stress-test ✅ (15 ekranów, baseline 41→26)
  M6 ogrzewanie (15 ekranów) — ✅ ? + i PL/EN/RU; martwe stałe MIGAWKA (hałas, dolne źródło) przeniesione do migawki „i”
  M1 lokalizacja (4 ekrany) ✅
  M9 esp32 (5 ekranów) ✅
  M10 Prognozy: migawka „i” PL/EN/RU (ekran bez pól)
  M13 Tryb Live: migawka „i” PL/EN/RU (ekran bez pól) — baseline strażnika pusta
  **[29.09.2026] ZAMKNIĘTE:** `pnpm check:pomoc-guard` — 255 plików zgodnych, lista zapadkowa pusta (od teraz każdy
  nowy ekran bez „?”/„i” blokuje merge). Prop `hint` usunięty z typów `Pole`/`PoleSelect` (nie da się go już użyć);
  `PoleCheckbox` zachowuje `hint` (opis obok pola wyboru, strażnik go nie liczy jako zamiennika „?”).
- ✅ (2026-09-29) **Prognozy (M10) — możliwe zaniżenie energii ×3 (pytanie do właściciela).** Znalezione przy migawce M10:
  `lib/core/modules/ai/prognozy/calculator.ts` sumuje próbki mocy `produkcjaKw`/`zuzycieKw` (8 punktów co 3 h) wprost jako
  kWh, bez mnożenia przez Δt = 3 h. (A) próbka to średnia moc w przedziale 3 h → energia = Σ P·3 h, obecny wynik ×3 za mały —
  poprawić silnik + testy. (B) próbka to już energia przedziału w kWh → poprawić tylko nazwy pól (`…Kwh`), liczby zostają.
  Dziś ekran pokazuje dane demonstracyjne (TD7), więc bez wpływu na projekt użytkownika. **Nie ruszane — czeka na decyzję.**
  → **[29.09.2026] Decyzja właściciela: A** (tak opisuje to ekran; docelowe źródła — symulacja, pogoda — podają moc).
  Silnik 1.1.0: energia = Σ P × `KROK_PROBKOWANIA_H` (3 h), wzór w `formula`; demo: produkcja 27,3 kWh, zużycie 26,1 kWh,
  bilans +1,2 kWh (było 9,1 / 8,7 / +0,4). Teksty założenia PL/EN/RU mówią wprost „energia = moc × 3 h”.
- 🔲 (2026-09-29) **Tłumaczenie samych stron (etykiety pól, nagłówki, komunikaty UI) na EN/RU.** Wyszło przy D51: treść
  „?”/„i” i komunikaty silników są w trzech językach, ale etykiety pól i teksty na stronach nadal tylko po polsku.
  Osobne, duże zadanie (standard 17). **Priorytet:** do decyzji właściciela. **Kolizje:** te same pliki co chmurki —
  robić po nich albo razem, moduł po module.
  → **[29.09.2026] Stan po D58:** mechanizm gotowy (`lib/i18n/ui/<grupa>.ts`, klucze `UI-*`, test `ui.test.ts`), M14 i E38
  przetłumaczone, strażnik z listą zapadkową pilnuje, żeby nie przybywało. Zostało: **248 plików, 3711 tekstów**
  (`scripts/i18n-ui-guard-baseline.json`; największe: `node scripts/check-i18n-ui-guard.mjs --policz`). Po każdym
  zmigrowanym ekranie obniż jego liczbę albo usuń go z listy (strażnik to wymusza). **Plusy teraz:** każdy moduł to
  zamknięta całość do testu w EN/RU. **Minusy:** duży wolumen tłumaczeń do przeglądu merytorycznego RU/EN. **Kolejność:**
  moduł po module, najpierw ekrany z największą liczbą (M5, M3).
  → **[30.09.2026] 🔄 w toku — gałąź `claude/translate-screen-labels-en-ru-2f94e0`** (sesja „Tłumaczenie etykiet
  ekranów EN/RU”). Zrobione: M11 (23 strony, `m11-montaz-baterii.ts`), M8 (10, `m08-bezpieczenstwo.ts`), M12 (12,
  `m12-mobilny.ts`), M4 baterie (33, `m04-baterie.ts`). Narzędzie: `scripts/migracja-i18n-ui.mjs`
  (`wyciagnij` → tłumaczenia JSON → `zastosuj` → `sprawdz`; opis w nagłówku pliku, usunąć, gdy lista zapadkowa będzie
  pusta). **Zajęte do merge punktu „Stałe fizyczne w tekstach pomocy”** (inna sesja): dobor-przekroju-kabla,
  straty-okablowanie-dc, przepust-powietrza, ochrona-wilgoc, napor-wiatru, bojler-cwu, pre-heat, profil-astronomiczny,
  stress-test-mppt, wplyw-temperatury, panel-do-stacji-zasilania, ochrona-przed-rozladowaniem, rachunek-firma,
  depozyt-prosumencki, moc-bierna, sciezka-przejscia, scenariusze. **Następny krok:** kolejne moduły (M5, M3, M2…) z
  pominięciem zajętych plików; stan liczbowy — `node scripts/check-i18n-ui-guard.mjs`.
  → **[01.10.2026] 🔄 w toku — gałąź `work/i18n`.** Lista zapadkowa **168 → 82 plików** (2728 → 1503 tekstów).
  Zrobione: M5 (30 plików, `m05-elektryka.ts`), M2 (23, `m02-zapotrzebowanie.ts`), M7 (15, `m07-zima.ts`), M9 (5,
  `m09-ekrany.ts`), pojedyncze ekrany M4/M10/M12/M13 (5, `ekrany-rozne.ts`), ekrany sieci D*/F* (9,
  `m15-m16-siec.ts`). `test-licznika` zostaje z 2 tekstami celowo — treść pisma reklamacyjnego do polskiego OSD jest
  zawsze po polsku. Przy okazji naprawione 8 ekranów bez `"use client"` wołających `useTranslate()` (HTTP 500,
  `docs/memory.md`). **Zostało:** M3 (31 plików, ~610 tekstów), M1 (4), M6 ogrzewanie (15 — pominięte, bo równolegle
  trwa praca nad nowymi ekranami M6; robić po jej merge), `app/` poza kalkulatorami, `components/**`.
  **Kolizje:** M6 — sesja nowych ekranów ogrzewania; M3 — dowolna sesja zmieniająca ekrany PV.
  → **[02.10.2026] ✅ migracja ekranów zakończona — gałąź `work/i18n2`.** Lista zapadkowa **82 → 6 plików** (1503 →
  10 tekstów). Zrobione: stare ekrany M6 (15, `m06-stare-ekrany.ts`), M3 (31: `m03-pv-a.ts`, `m03-typ-montazu.ts`,
  `m03-pv-b.ts`), M1 (`m01-lokalizacja.ts`), `components/lokalizacja` (6), `components/siec` (3,
  `komponenty-siec.ts`), komponenty wspólne (`komponenty-wspolne.ts`, `komponenty-wzorce.ts`), pulpit / ustawienia /
  logowanie / lista modułu (`app-strony.ts`), `/wzornik` (`app-wzornik.ts`). Nowy `components/ui/tekst-ui.tsx` —
  tekst `UI-*` w module, który musi zostać serwerowy (`werdykt.tsx`, `/moduly/[id]`). **Zostaje na liście celowo
  (6 plików, 10 trafień):** `test-licznika` (2 — pismo do polskiego OSD); `app/layout.tsx` (3) i `app/manifest.ts`
  (2) — nazwa marki + statyczne `metadata`/manifest, generowane bez znajomości języka (język żyje tylko w
  `localStorage`, standard 17.4 — zero cookie), więc `t()` nie ma tam zastosowania; `definicje-symboli.tsx` (1 — znaczniki
  SVG, fałszywe trafienie); `werdykt.tsx` (1 — nazwa klasy z tokenem `werdykt-uwaga`, fałszywe trafienie);
  `siec/wspolne.tsx` (1 — przyrostek „ zł” we wspólnym formaterze `zl()`, używanym też przez ekrany spoza listy).
  **Zostało (osobne decyzje):** (a) czy opis w `metadata`/manifeście ma być po angielsku (jedna wersja dla
  wszystkich), (b) czy `zl()` ma zwracać „PLN”/„зл” w EN/RU (dotyka ~10 ekranów M14), (c) stałe silnika — wpis
  niżej. Narzędzie `scripts/migracja-i18n-ui.mjs` zostaje do czasu (b)/(c) — potem usunąć. **Priorytet (a)/(b):**
  niski — kosmetyka EN/RU, nie liczby. **Odblokowuje:** pustą listę zapadkową poza wyjątkami. **Plusy teraz:** małe.
  **Minusy:** (b) zmienia wspólny formater M14 — kolizja z każdą sesją nad ekranami sieci. **Kolejność:** (c) przed (b).
  Do przeglądu merytorycznego właściciela: tłumaczenia EN/RU tej partii (≈ 1500 tekstów, terminy jak w `dictionary-*`).
- 🔲 (2026-09-30) **Polskie teksty ze stałych silnika wyświetlane na ekranach (luka i18n poza strażnikiem).** Wyszło
  przy migracji etykiet: część tekstów na ekranach pochodzi ze stałych w `lib/core/**/constants.ts` (np. `label`
  opcji/technologii/protokołów: `OPCJE_IP_MALE_INSTALACJE`, `WYMAGANE_WYPOSAZENIE` demontażu pakietu,
  `DOMYSLNE_URZADZENIA_KRYTYCZNE` UPS, `CENA_STARTOWA_LABELS` i opisy w porównaniu technologii magazynów, opcje
  zastosowania/priorytetu/odbiorników w napięciu systemowym, protokoły w komunikacji BMS, `BATTERY_TECHNOLOGIES`;
  także nazwy zmiennych we wzorach `formula`, np. „Pojemność × C_rate” w cold-c-rate).
  Strażnik UI ich nie widzi (nie są w JSX), więc w EN/RU nadal pokażą się po polsku. **Priorytet:** średni (widoczne
  w EN/RU). **Odblokowuje:** pełne EN/RU tych ekranów. **Jak:** stałe dostają kod (`UI-*` albo osobny klucz domenowy),
  ekran robi `t(kod)` — domena nie importuje z UI (`01-architektura`). **Plusy teraz:** mała liczba miejsc, łatwe do
  wyliczenia grepem `label:` w `lib/core`. **Minusy:** dotyka stałych silnika i ich testów. **Kolizje:** z migracją
  etykiet (te same ekrany) — robić po niej. **Kolejność:** po wpisie „Tłumaczenie samych stron”.
- ✅ (2026-09-29) **Opisy narzędzi AI — domknięcie luk (pytanie właściciela: „czy są rozbudowane opisy funkcji dla AI”).**
  Stan 29.09.2026: 183 narzędzia w rejestrze, 181 ma `.describe()` na polach wejścia, 156 ma w `description` zdanie
  „Użyj, gdy…” (kiedy model ma je wywołać) — **27 go nie ma** (m.in. blackout, analiza-spof, typ-montazu, klapy-pozarowe,
  moc-bierna, zasilanie-esp32). **12 kalkulatorów bez narzędzia AI:** baterie/komunikacja-bms, baterie/porownanie-technologii,
  lokalizacja/lokalizacja-i-klimat, pv/czystosc-i-snieg i 8 kalkulatorów M14 (bilans-miesieczny, depozyt-prosumencki,
  moc-umowna, oplata-mocowa, przelacznik-siec-wyspa, sciezka-cen-energii, strumienie-bess, test-licznika). Do zrobienia:
  dopisać „Użyj, gdy…” w 27 opisach, zbudować brakujące narzędzia (9.0a), rozważyć strażnika jak `check:pomoc-guard`
  (każdy kalkulator ma narzędzie, każdy opis ma „Użyj, gdy”). Kolejność: po chmurkach danego modułu (Dyrektywa #15, krok 5).
  → **[29.09.2026] Decyzja właściciela: „trzeba naprawić”.** Partia 1 ✅: 27 opisów uzupełnionych o „Użyj, gdy…”
  (183/183), strażnik `pnpm check:ai-tools-guard` (w CI i pakiecie przed merge) + lista zapadkowa
  `scripts/ai-tools-guard-baseline.json`. Dokładne liczenie strażnikiem: **18** kalkulatorów bez narzędzia (nie 12 —
  doszło 5 podmodułów `wampiry-energetyczne` i `ai/prognozy`). Dalej, moduł po module (PR na partię): M14 (8) →
  baterie/lokalizacja/pv (4) → wampiry-energetyczne (5) → `ai/prognozy` (po decyzji Δt, wpis wyżej).
  **Partia 2 ✅ (29.09):** M14 — 8 narzędzi (`bilans-miesieczny`, `depozyt-prosumencki`, `moc-umowna`, `oplata-mocowa`,
  `przelacznik-siec-wyspa`, `sciezka-cen-energii`, `strumienie-bess`, `test-licznika`), testy na przykładach kontrolnych
  silników; lista zapadkowa 18 → 10.
  **Partia 3 ✅ (29.09):** wampiry-energetyczne — 5 narzędzi (`wampiry-katalog`, `wampiry-pomiar`,
  `wampiry-automatyzacja`, `wampiry-rekomendacje`, `wampiry-symulacje` z trybami autonomia/koszt-roczny/wplyw-na-dobor);
  lista zapadkowa 10 → 5. Zostały: 4 kalkulatory baterie/lokalizacja/pv (narzędzie albo `ai-tool: nie dotyczy`)
  i `ai/prognozy` (po decyzji Δt).
  **Partia 4 ✅ (29.09):** narzędzia `komunikacja-bms`, `porownanie-technologii`, `czystosc-i-snieg`;
  `lokalizacja-i-klimat` — adnotacja `ai-tool: nie dotyczy` (silnik tylko zapisuje profil, nic nie liczy). Lista 5 → 1.
  **Partia 5 ✅ (29.09) — ZAMKNIĘTE:** `ai/prognozy` — narzędzie `policz_bilans_prognozy` (razem z poprawką Δt, decyzja A).
  Lista zapadkowa pusta — od teraz każdy nowy kalkulator bez narzędzia AI (albo bez `ai-tool: nie dotyczy — powód`)
  blokuje merge.
- ✅ (2026-09-29) **D54 — odpowiedzi właściciela: CRL, kafle M14, gaz, Rsi.** M5/E2 CRL 1.1.0: pole `kolejnoscOdBudynku` (limit 1 km od budynku na zewnątrz; bez kolejności ostrożnie jak dotąd) + ℹ️ `CRL-SPD-ZALECANY` przy CRL ≥ 1000 (TD21 pkt 3 zamknięty). M8/E4 1.1.0: gaz/aerozol 🟡 potwierdzone + ℹ️ `GASZ-PROPOZYCJA-LIFEPO4` (mgła wodna, środek do magazynów energii, chłodzenie/zamrażanie ogniw — ✅🤖). Kafle M14 na końcu presetów — potwierdzone. Rsi = 0,13 ze źródeł do czasu PKN. **Otwarte:** tylko M9/E4 CAN (🟡 ✅🤖, rekomendacja 🔴).
- 🔲 (2026-09-29) **CO ZOSTAŁO DO ZROBIENIA — indeks po D54 (dla następnej sesji).** Zbiorczy wskaźnik; szczegóły w
  podanych wpisach (nie duplikuję treści). Kolejność = priorytet.
  1. 🔲 **PR i merge D54** — commity `39f8748` + scalenie `3ad05a6` są na gałęzi
     `claude/nowy-rozdzial-biblia-kalkulator-to73by`, ale PR nie powstał (serwer GitHub w sesji zwracał 503). Następna
     sesja: sprawdź, czy gałąź jest już w `main`; jeśli nie — scal `main` do gałęzi, pełny pakiet kontroli, PR → merge.
     ✅ **[30.09.2026]** Sprawdzone: `39f8748` i `3ad05a6` są w `main` (PR #216).
  2. ⚠️ **Decyzja właściciela — M9/E4 CAN bez transceivera:** dziś 🟡 (✅🤖), rekomendacja 🔴 jak RS485 (Biblia v2.0
     §9.28). Właściciel „jeszcze nie wie, czy będzie CAN” — nie pytać, dopóki sam nie wróci.
  3. ✅ **[01.10.2026, D68] potwierdzone — zostaje w obecnej formie.** ~~⚠️~~ **Do potwierdzenia (✅🤖) — M8/E4 propozycja chłodzenia/zamrażania ogniw** (D54 pkt 4c): propozycja AI bez
     źródła i bez liczb. Źródło do pozyskania: `docs/normy-brakujace.md` (⚪ wytyczne gaszenia magazynów Li-ion).
  4. 🔵 **Normy od właściciela (PKN):** PN-EN ISO 6946 → Rsi per kierunek w M6/E8 (ściana 0,13 · strop/dach 0,10 ·
     podłoga 0,17, test + wersja kalkulatora). Wersja PL/EN HD 60364-4-443 → wyjątek 443.4 dla mieszkań (TD21 pkt 1).
     Pełna lista brakujących norm: `docs/normy-brakujace.md`.
  5. 🔵 **Dane zewnętrzne M14** (lista „Otwarte — wymaga danych zewnętrznych” w `03_M14_Dom_i_Firma_Siec.md`): PDF
     taryfy PGE 2026 i PDF regulaminu PME/W6 (właściciel dostarcza — nie obchodzić TLS), profile W4 G11/C11, `C_rk`
     (URE), stawki przyłączeniowe IV–VI, godziny stref OSD (TD22 pkt 1), średnia cena G 495,16 zł/MWh (🔎A),
     nowszy EU Reference Scenario (D40).
  6. 🔲 **Tłumaczenie etykiet stron na EN/RU** (wpis z 29.09 wyżej) — dotyczy też nowej listy „Kolejność odcinków od
     budynku” w M5/E2 (etykiety tylko PL, jak reszta tego ekranu).
  7. ⚠️ **Inne decyzje właściciela nadal otwarte** (wpisy wyżej, bez zmian): M7/E8 parafinizacja diesla, M7/E19, M7/E23,
     M7/E24 + E16, M7/E25, M8 blok 2 (E10), M12 pakiet 2 (E27), duplikat ZIAD, licencje norm w repo, M9/E2 przykład
     MP1584, M6/E11 progi okien, M3–M6 drobne ✅🤖 z 27.09 pkt (2) i (4).
  8. 🔲 **Zablokowane brakiem norm/danych** (wpisy wyżej): M5/E1 + M11/B5 + M4/E25 (tabela obciążalności), M12/E41
     (PN-EN 50565-1), szkic LED (karta taśmy), M6 obciążenie cieplne (PN-EN 12831).
  9. 🔲 **Bieżące prace kodowe** (wpisy wyżej): rejestr twardych stopów M5, resynchronizacja `mapa-wdrozenia.md`,
     kolejne ekrany M7/M12, kafle „duże” + presety onboardingu (M14), przecinek w liczbach założeń i18n.
     → **[30.09.2026]** Kafle „duże” + 8 presetów ✅ (wpis niżej). Przecinek w liczbach założeń — był już zamknięty
     26.09 (wpis ✅ „Przecinki w liczbach w tekstach założeń”); ponowna kontrola 30.09: parametry założeń idą przez
     `t()` jako liczby, kropka zostaje tylko w `technicalMessage` (tekst dla programisty, nie UI) — nic do zrobienia.
     ✅ **[30.09.2026]** Rejestr twardych stopów M5 — zrobione (PR #233, lista zapadkowa strażnika pusta).
  **[30.09.2026, 15:40] Sesje równoległe — stan worktree (koordynacja, standard 15.22):**
  - `claude/screens-without-involvement-e468f6` — **aktywna** (25 zmienionych plików): M9 ESP32, `lib/i18n/dictionary-*`,
    `lib/i18n/pomoc/m09-esp32.ts`, `lib/ai/pytaj-asystenta.ts`, `docs/rejestr-twardych-stopow.md`, pliki strażnika stopów.
  - `claude/large-tiles-presets-m14-eca5df` — ~~aktywna~~ **[30.09.2026] zakończona** (pkt 9: kafle „duże” + presety M14; `lib/pulpit/**`).
  - `claude/physics-constants-help-text-91a9b3` (worktree `pwa-parallel-branch-work-4e99fd`) — 8.4b pkt (3):
    `lib/i18n/pomoc/*` + atrybut `parametry` na stronach.
  - `claude/translate-screen-labels-en-ru-2f94e0` — pkt 6: `lib/i18n/ui/*` + strony `app/kalkulatory/*`.
  ⚠️ **Kolizja:** 8.4b pkt (3) i tłumaczenie etykiet dotykają tych samych stron — wpis 8.4b (3) każe robić je **po kolei,
  nie równolegle**; `lib/i18n/pomoc/m09-esp32.ts` i `dictionary-*` współdzieli też sesja M9. Kto zacznie drugi —
  najpierw scala `main` po merge pierwszego, moduł M9 zostawia sesji M9 do jej merge.

- 🔲 (2026-09-29) **Powrót CI od 1.10.2026 (pozostałość sesji 29.09).** (1) Usunąć notę „⚠️ Do końca września 2026
  CI NIE DZIAŁA” z `CLAUDE.md` (sekcja „Stan repo”) i dopisać w `docs/memory.md`, że CI wróciło. (2) Pierwszy przebieg
  CI na `main` sprawdzić ręcznie — od 24.09 wszystkie PR (m.in. #213–#215) scalano tylko po lokalnym pakiecie, a krok
  `pnpm check:ai-tools-guard` w `.github/workflows/ci.yml` jeszcze nigdy nie ruszył w GitHub Actions. Czerwony przebieg
  = naprawić od razu, nie odkładać. **Priorytet:** wysoki, 1.10.2026. **Kolizje:** brak.
  (3) **[29.09.2026, D59]** Dodać job e2e SW do `ci.yml`: `pnpm exec playwright install --with-deps chromium`, potem
  `pnpm test:e2e` (sam robi trzy buildy, ~3–5 min). Kolizja: `.github/workflows/ci.yml`.
  → **[30.09.2026] Pkt (3) zrobiony** — job `e2e-sw` w `ci.yml` (osobny, limit 30 min). Pkt (1) i (2) zostają na 1.10:
  pierwszy przebieg na `main` sprawdzi też nowy job.
  → **[01.10.2026] Pkt (1) zrobiony** — nota usunięta z `CLAUDE.md` (sekcja „Stan repo” i zdanie o merge), wpis w
  `docs/memory.md`. Pkt (2) zostaje: pierwszy przebieg CI na `main` po scaleniu PR ze stylami wyglądu (D63–D67).
  ⚠️ **[01.10.2026, 11:15] Pkt (2): CI nadal nie startuje.** Workflow `CI` jest `active`, Actions `enabled`, repo
  publiczne, ale `actions/runs` = **0 uruchomień w całej historii**, mimo że dziś na `main` weszły PR z kodem (#237,
  #238), które nie mieszczą się w `paths-ignore`. PR #243 (same `.md`) poprawnie bez CI. Do sprawdzenia przez właściciela:
  zakładka Actions / Billing konta (czy limit odnowił się 1.10 i czy nie ma blokady płatności), potem ponowny push
  na `main` albo `workflow_dispatch`. Do wyjaśnienia merge nadal na pełnym pakiecie lokalnym. **Priorytet:** wysoki.
  ⚠️ **[01.10.2026, 18:50] Billing wykluczony.** Zrzut właściciela: Actions 0 min / 2000 min, $0 — limit nie jest
  przyczyną. PR #246 (kod, poza `paths-ignore`) i jego merge na `main` nadal **0 uruchomień**; workflow `CI` `active`.
  Następny krok właściciela: repo → Settings → Actions → General → „Actions permissions” (czy nie „Disable actions”
  albo lista dozwolonych akcji bez `pnpm/action-setup`) oraz zakładka Actions (baner o blokadzie konta/weryfikacji).
- 🔲 (2026-09-29) **Prognozy M10 — Δt przy podłączaniu realnych danych (TD7).** Silnik `ai/prognozy` 1.1.0 zakłada
  stały krok `KROK_PROBKOWANIA_H = 3` (decyzja A). Gdy ekran dostanie prawdziwe źródło (symulacja SoC, pogoda, dane live),
  sprawdzić krok próbkowania tego źródła: inny niż 3 h → krok jako jawne pole wejścia silnika (+ test), nie cicha
  zmiana stałej. Pułapka opisana w `docs/memory.md` („Prognozy M10 — Δt”). **Priorytet:** razem z TD7.
  **Kolizje:** `lib/ai/tools/prognozy-tool.ts` (pole `krokProbkowaniaH` w wyniku).
- ✅ (2026-09-27) **Odczyt whitepaper IEC 62109-1** (zamyka wpis 🔲 z 27.09 „Dokończyć odczyt whitepaper IEC 62109-1”): przeczytany w całości — Texas Instruments SLYY102 (2016), **11 stron, nie 14**. Temat: dobór izolatorów wewnątrz falownika (odstępy izolacyjne, drogi upływu, napięcia udarowe, OVC) — perspektywa producenta elektroniki, nie instalatora. **Nie odblokowuje żadnego ekranu, żadna liczba nie trafia do kodu** (parafraza producenta, nie norma; wymogi instalacyjne udaru/SPD po stronie PV już z HD 60364-7-712 i HD 60364-4-443). Luka IEC 62109-1 bez zmian (🟡). Streszczenie i ocena: `docs/zrodla/norma-IEC-62109-1/00-INDEKS.md`.
- ✅ (2026-09-27) **Przegląd wszystkich 22 folderów `docs/zrodla/` pod kątem nieprzerobionych plików:** poza whitepaperem IEC 62109-1 **wszystkie pliki są przeczytane/przetworzone**. Jedyne luki formalne: 6 oryginałów PDF (`document-download 4–9.pdf` w `materialy-fizyka-budowli/` i `norma-PN-EN-1990-eurokod-0/`) nie były wymienione z nazwy w indeksach, choć ich treść była już wyekstrahowana do plików `.txt` — mapowanie PDF→txt dopisane do obu indeksów. `.docx` w `materialy-branzowe-ochrona-przeciwporazeniowa-2010/` to ta sama treść co PDF (opisane w `docs/zrodla/README.md`, 06.09.2026). Przy okazji: wpis ⚠️ „duplikat ZIAD” wyżej jest już rozstrzygnięty (wariant A, patrz `docs/zrodla/README.md`), a „9 pozycji zgubionych” w przypomnieniu 🟡 wyżej — odzyskane 27.09.2026 (`docs/normy-brakujace.md`, sekcja ⚫).
- ✅ (2026-09-29) **Synchronizacja Y.6 z `new-app-standards` (`af63da7`) — 2 nowe wiersze `AKTUALIZACJE.md` z 29.09.**
  Nadpisane rozdziały 00-INDEKS, 04, 05, 08, 09, 10, 11, 15, 17 (nowe 8.4b, 8.12, 11.9, 15.23); `CLAUDE.md` +3 akapity
  z szablonu (15.21, 15.23, 15.22); 9 wpisów `docs/wklad-do-standardu.md` → ✅. Dryf naprawiony od razu: autozapis
  scala stary szkic ze stanem początkowym (5.5), puste listy zapadkowe strażników usunięte (11.9). Szczegóły:
  `docs/memory.md`, „Synchronizacja ze standardem — Y.6 (29.09.2026, 19:00 UTC)”.
- ✅ (2026-09-30, porządek listy: (1)+(2) w `main` — PR #232; (3) osobny wpis niżej) ~~🔲~~ (2026-09-29) **„i” przy tytule wg nowej 8.4b — dostosować `MigawkaInfo` (`components/ui/pomoc.tsx`).** Różnice:
  (1) zakładka „Fizyka” pokazuje tylko `formula`, a 8.4b wymaga też `assumptions` bieżącego wyniku, tym samym
  komponentem co lista założeń pod wynikiem; (2) na telefonie „i” ma być panelem od dołu, dziś popover wszędzie
  (sprawdzić emulacją dotyku, jak chmurki 28.09); (3) 146 z 345 tekstów `fizyka` w `lib/i18n/pomoc/*` zawiera cyfry —
  przejrzeć, które przepisują stałe silnika, i podać je przez `params` (reszta to numery norm/lat — zostają).
  Sekcja D pod wynikiem: sprawdzone — żaden ekran nie przeniósł jej wyłącznie do „i” (3 ekrany, `koszty-ogrzewania`,
  `skaner-dzialki`, `orientacja-powierzchni`, nigdy nie pokazywały wzoru pod wynikiem — założenia tak). **Priorytet:**
  średni; AKTUALIZACJE: „przy najbliższej zmianie ekranu”, ale (1) i (2) to jeden wspólny komponent — jedna zmiana
  obejmuje ~244 ekrany, taniej od razu. **Kolizje:** każda sesja zmieniająca `components/ui/pomoc.tsx`/`chmurka.tsx`.
  **Kolejność:** (1)+(2) przed (3).
  🔄 **[29.09.2026, 22:55] W trakcie** — gałąź `claude/pwa-parallel-branch-work-4e99fd` (worktree
  `.claude/worktrees/pwa-parallel-branch-work-4e99fd`), po strażniku stopów. Nie koliduje z plikami SW etapu 1.
  ✅ **[29.09.2026, 23:25] (1) + (2) zrobione** (gałąź `claude/stopy-guard-84b`): `NaglowekEkranu`/`MigawkaInfo` biorą
  `wynik` (cały `CalcResult`) zamiast `wzor` — „Fizyka” pokazuje wzór **i założenia** bieżącego wyniku tym samym
  `ZalozeniaLista` co pod wynikiem (`WynikSzczegoly` używa go teraz też; prefiks „Założenie” przetłumaczony, klucz
  `WYNIK-UI-ZALOZENIE`). 139 ekranów przepiętych z `wzor={result.formula}` na `wynik={result}`, +22 ekrany z
  założeniami, które wzoru nie przekazywały (m.in. `audyt-pozarowy`, `prognozy`, `analiza-zacienienia`). Na telefonie
  (<640 px) `Chmurka` otwiera „i” **i „?”** jako panel od dołu (Base UI `Drawer`, przycisk „Zamknij” PL/EN/RU) — 8.4b
  mówi o obu. Sprawdzone w przeglądarce: desktop (popover, zakładki, wzór + założenia) i 375 px (panel, zakładki, „?”,
  zamykanie), konsola bez błędów. **Zostaje (3)** — osobny wpis niżej.
  ✅ **[30.09.2026, porządek listy]** 🔄 z 22:55 nieaktualne — scalone do `main` (PR #232, `claude/stopy-guard-84b`).
- ✅ (2026-09-30, gałąź `claude/physics-constants-help-text-91a9b3`) ~~🔲 (2026-09-29) **8.4b pkt (3) — liczby w tekstach „Fizyka” przez `params`, nie przepisane.**~~ 146 z 345 tekstów
  `fizyka` w `lib/i18n/pomoc/*` ma cyfry; większość to struktura wzoru (`3600`, `/100`, `T = 5·R·C`) — zostaje.
  Kandydaci na przepisaną stałą silnika (przykłady z przeglądu 29.09): `0,4 %/°C` (M3 temperatura), `c_wody = 4186`,
  `0,001163 kWh/(l·K)`, `ρ = 1,225 kg/m³` (napór wiatru), `ρ_Cu ≈ 0,0175`, współczynniki wind chill, stawki ustawowe
  `× 1,23`, `20%/30%`, `12 mies.` (M14 depozyt). Dla każdego: jest stała w `lib/core/modules/**/constants.ts`? → `{nazwa}`
  + `parametry` w `NaglowekEkranu` we wszystkich trzech językach; nie ma → zostaje (to wiedza, nie parametr silnika).
  **Priorytet:** średni. **Odblokowuje:** zgodność 8.4b w całości. **Plusy teraz:** (1)+(2) już weszły, kontekst świeży.
  **Minusy:** ok. 1 sesja, sama treść w 3 językach. **Kolizje:** `lib/i18n/pomoc/*` i strony ekranów (atrybut
  `parametry`) — te same pliki co „Tłumaczenie etykiet stron na EN/RU”; robić po kolei, nie równolegle. Bezkolizyjne z SW
  etapem 1. **Kolejność:** po merge gałęzi `claude/stopy-guard-84b`.
  ✅ **[30.09.2026] Zrobione.** Przegląd 59 tekstów „Fizyka” z cyframi (PL = EN = RU): 16 ekranów przepiętych na
  `{nazwa}` + `parametry` we wszystkich trzech językach — ρ_Cu/ρ_Al (M5 E1, M3 straty DC), ρ powietrza (napór wiatru),
  c_wody + 0,001163 (bojler, pre-heat), Magnus a/b (M4), Cooper 23,45/284/365 (profil astronomiczny), T_STC 25 °C
  (stress-test MPPT, wpływ temperatury, panel do stacji), 0,4 %/°C + 70 °C (przepust powietrza), liczba ogniw 12 V (M12),
  stawki ustawowe VAT/depozyt 1,23/zwrot 20 %/30 %/k = 3 (M14: rachunek C, depozyt, moc bierna, scenariusze) — te ostatnie
  z pliku danych `rozliczenia-pl-2026` przez `stawkiDoPomocy()` (`components/siec/wspolne.tsx`). Tam, gdzie ten sam ekran
  powtarzał stałą w „Jak działa” albo w „?” pola, przepięte też. Nowy test: te same `{parametry}` w PL/EN/RU
  (`lib/i18n/__tests__/pomoc.test.ts`). **Zostały świadomie (wiedza, nie parametr silnika):** wzory ze stałymi
  strukturalnymi (`3600`, `/100`, `8760`, `24 × 365`, `T = 5·R·C`, `3,6·10⁶`), przykłady liczbowe (test licznika,
  napięcie systemowe, 1 Ah × 12 V), „12 mies.” depozytu i numery artykułów/norm (brak stałej w silniku), 2 V / 3,2 V na
  ogniwo, „STC 25 °C” w nazwach pól (definicja STC). Wind chill — współczynniki są w `calculator.ts` inline, nie w
  `constants.ts` → wpis niżej.
- ✅ (2026-09-30, gałąź `claude/engine-constants-formula`: 15 kalkulatorów składa `FORMULA` ze stałych przez `latexLiczba()` (`lib/core/latex.ts`), depozyt — stawki z danych dla miesiąca w samym wzorze; nowe stałe: współczynniki wind chill, `WSPOLCZYNNIK_MARGINESU_BEZPIECZNIKA`; „Fizyka” wind chill i „Jak działa” bezpiecznika przez `parametry`; strażnik `lib/core/__tests__/formula-constants.test.ts`) ~~🔲~~ (2026-09-30) **Stałe wpisane na sztywno w samym silniku (`FORMULA`/`calculator.ts`) — wyciągnąć do `constants.ts`.**
  Znalezione przy 8.4b pkt (3): wind chill (`stress-test/wind-chill/calculator.ts`: 13,12 / 0,6215 / 11,37 / 0,3965 /
  0,16 inline, tekst „Fizyka” też je przepisuje); ciągi `FORMULA` przepisują stałe zamiast je składać — depozyt
  (`1{,}23`, `20\%/30\%`, a wartości idą z pliku danych i mogą się zmienić), pre-heat (`0{,}001163`), profil
  astronomiczny (`23{,}45`, `284`), panel do stacji (`- 25`). Ryzyko: po zmianie stałej/danych wzór w „Fizyce” i pod
  wynikiem pokaże starą liczbę. **Priorytet:** niski–średni (depozyt średni — stawka ustawowa). **Odblokowuje:** pełną
  spójność wzorów z obliczeniem. **Plusy teraz:** kontekst świeży, lista gotowa. **Minusy:** zmiana w silniku → testy +
  wersja kalkulatora (patch). **Kolizje:** pliki `lib/core/modules/**` wymienionych ekranów; bezkolizyjne z tłumaczeniem
  etykiet stron. **Kolejność:** niezależne.
- ✅ (2026-09-30, porządek listy: strażnik w `main` — PR #232; lista zapadkowa pusta — PR #233) ~~🔲~~ (2026-09-29) **Strażnik rejestru twardych stopów — teraz wymóg standardu (4.3 dopisek + 11.9).** Rozszerza wpis
  🔲 z 28.09 „Rejestr twardych stopów — dryf całego M5”: skrypt `scripts/check-stopy-guard.mjs` (każdy kod `level:
  "critical"` w `lib/core/modules/**/warnings.ts` ↔ wpis w `docs/rejestr-twardych-stopow.md`, jawna lista wyjątków
  typu walidacja danych), w pakiecie przed merge i w `ci.yml`. Lista zapadkowa **jednorazowo** przy wprowadzeniu,
  tylko maleje (11.9). Dziś w modułach 373 wystąpienia `level: "critical"`. **Priorytet:** wysoki (rejestr = narzędzie
  audytu bezpieczeństwa). **Kolizje:** `docs/rejestr-twardych-stopow.md`, `package.json`, `.github/workflows/ci.yml`.
  **Kolejność:** najpierw strażnik z listą zapadkową, potem uzupełnianie M5/M3/M6/M7/M8 (lista maleje).
  ✅ **[29.09.2026, 23:05] Strażnik zrobiony** — `pnpm check:stopy-guard` (pakiet, `ci.yml`, `CLAUDE.md`), gałąź
  `claude/stopy-guard-84b`. 265 kodów 🔴: 69 w rejestrze, 145 wyjątków walidacyjnych, 51 na liście zapadkowej.
  Dalsza część → wpis „Rejestr twardych stopów — uzupełnienie 51 pozycji” niżej. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-29, wieczór: 46 do rejestru, 3 do wyjątków, 2 czekają — wpis ⚠️ niżej) ~~🔲 (2026-09-29) **Rejestr twardych stopów — uzupełnienie 51 pozycji z listy zapadkowej**~~
  (`scripts/stopy-guard-baseline.json`; obejmuje wpis z 28.09 „dryf całego M5”). Każdy kod: wpis w
  `docs/rejestr-twardych-stopow.md` (kategoria, opis, M#/E#, plik, funkcja, kod) albo — gdy okaże się walidacją — przeniesienie
  do `scripts/stopy-guard-wyjatki.json` z uzasadnieniem; kod znika z listy zapadkowej w tej samej zmianie (strażnik to
  wymusza). **Priorytet:** wysoki (rejestr = audyt bezpieczeństwa). **Odblokowuje:** pusty baseline = strażnik w pełni
  ostry (11.9). **Plusy teraz:** tylko dokumentacja, bez kodu. **Minusy:** ok. 1 sesja; część kodów niejednoznaczna
  (`ZA-DUZO-OGNIW`, `ZACIENIENIE-*`, `SYSTEM-NIE-PRZETRWA-SCENARIUSZA`, `KONFLIKT-JEDNOCZESNOSCI`) — pytania do właściciela.
  **Kolizje:** `docs/rejestr-twardych-stopow.md` + oba pliki JSON strażnika; bezkolizyjne z SW etapem 1. **Kolejność:**
  decyzja właściciela 29.09 — po merge SW etapu 1 (razem z pracą domenową M5/M7/M12).
- ✅ (2026-09-29, **wybrano B** — obniżone do 🟡, wersja kalkulatora 1.0.1; lista zapadkowa strażnika pusta, strażnik w pełni ostry) ~~⚠️ (2026-09-29) **Do decyzji właściciela: 🔴 przy zacienieniu 2 sekcji / całego panelu**~~ (`ZACIENIENIE-2-SEKCJE`,
  `ZACIENIENIE-PELNY-PANEL`, M3/E13 `pv/zacienienie-diody-bocznikujace`) — jedyne 2 kody na liście zapadkowej. To strata
  uzysku (66% / 100% mocy panelu), nie zagrożenie ani uszkodzenie sprzętu, a źródło przy tym ekranie daje 🟡 (mikroinwertery),
  nie 🔴. Opcje: (A) zostawić 🔴 i wpisać do rejestru; (B) obniżyć do 🟡 `warning` (zmiana kodu + testy, kody znikają z listy
  zapadkowej). Rekomendacja audytora: B — rejestr ma zawierać fakty „niebezpieczne / uszkodzi sprzęt” (nagłówek rejestru).
  **Priorytet:** średni. **Odblokowuje:** pusty baseline = strażnik w pełni ostry (11.9). **Kolizje:** bezkolizyjne.
  **Do potwierdzenia ✅🤖 przy okazji:** `BRAK-PASUJACEGO-PRZEKROJU` i `MK-BRAK-PRZEKROJU-DLA-BEZPIECZNIKA` wpisane do
  rejestru (nie jako „poza zakresem tablicy”), `NIEPARZYSTA-LICZBA-OGNIW`/`ZA-MALO-OGNIW`/`ZA-DUZO-OGNIW` (M11 sekwencja
  montażu, status OUT_OF_SCOPE) — do wyjątków „poza zakresem modelu”.
  🔄 **[29.09.2026, 22:55] W trakcie** — gałąź `claude/pwa-parallel-branch-work-4e99fd` (worktree
  `.claude/worktrees/pwa-parallel-branch-work-4e99fd`). Inne sesje: nie ruszać `docs/rejestr-twardych-stopow.md`
  do merge tej gałęzi. Uzupełnianie M5 i dalszych modułów — po merge SW etapu 1 (decyzja właściciela).
  ✅ **[30.09.2026, porządek listy]** 🔄 nieaktualne — rejestr uzupełniony i zacienienie obniżone do 🟡 scalone do
  `main` (PR #233, `claude/rejestr-stopow-51`); `scripts/stopy-guard-baseline.json` = `[]`. Blokada
  `docs/rejestr-twardych-stopow.md` zdjęta.
- ⚠️ (2026-09-29) **Routine cyklu Y.6 nie istnieje** (`trig_01892Z45ThAi2T56PJRjQQAh` → not found). Kolejne sprawdzenie
  tylko na starcie sesji albo po odtworzeniu Routine — decyzja właściciela (co 12 h wg cyklu adaptacyjnego).
- ✅ (2026-09-29) **Y.11 pkt 1b — twarde polskie teksty w JSX ekranów zmienionych 29.09** (raport:
  `docs/audyt-zgodnosci-kodu.md`, przebieg 1). Do decyzji właściciela: (A) poprawić ≈15 plików teraz (klucze + EN/RU)
  + (B) strażnik 11.9 na teksty w JSX z jednorazową listą zapadkową starych ekranów; albo (C) sam strażnik, teksty przy
  najbliższej zmianie ekranu. Rekomendacja A+B. **Priorytet:** wysoki (8.12 — ekran bez tłumaczeń nie jest ukończony).
  **Kolizje:** rozszerza wpis „Tłumaczenie etykiet stron na EN/RU” (indeks po D54, pkt 6); dotyka tych samych plików co
  „i” wg 8.4b — robić w jednej sesji albo po kolei, nie równolegle. **Kolejność:** strażnik (B) przed tekstami (A).
  → **[29.09.2026] Zrobione — decyzja właściciela „A + B” (D58).** (A) ekrany M14 i E38 w trzech językach (klucze `UI-*`,
  `lib/i18n/ui/`); (B) strażnik `scripts/check-i18n-ui-guard.mjs` w `pnpm check:i18n-guard`, lista zapadkowa 248 plików /
  3711 tekstów. Dalsza migracja starych ekranów: wpis „Tłumaczenie samych stron” wyżej.
  ⏸️ **[29.09.2026] PRACA PRZERWANA (limit konta) — do dokończenia w nowej sesji.** Gałąź `claude/update-audit-xowv23`,
  commit „WIP: D58 …” (push zrobiony, **bez PR**). Zrobione i sprawdzone: `pnpm typecheck` ✅, strażnik UI ✅,
  `lib/i18n/__tests__/ui.test.ts` ✅ (6/6). **NIE uruchomiono** pełnego pakietu. Następny krok: `pnpm lint`,
  `check:i18n-guard`, `check:pomoc-guard`, `check:ai-tools-guard`, `test` (cały — sprawdź zwłaszcza testy ekranów szukające
  polskich tekstów, np. E38/M14), `build`, `audit:gate` → poprawki → PR → merge (SHA 40 znaków).
  ▶️ **[29.09.2026, wieczór] Dokończone.** Scalono `origin/main` (konflikty tylko w docs — dopisy z obu stron, zachowane
  obie). Pełny pakiet lokalnie: typecheck ✅, lint ✅ (2 stare ostrzeżenia `<img>`), `check:i18n-guard` ✅,
  `check:pomoc-guard` ✅, `check:ai-tools-guard` ✅, `test` ✅ 2095/2095 (po poprawce limitów czasu, `docs/memory.md` D58),
  `build` ✅, `audit:gate` ✅. Przeglądarka: E38 i M14 w PL/EN/RU bez surowych kluczy `UI-*`.
  ✅ **[29.09.2026, wieczór]** Uzupełnienie: limit 30 s także dla bloku TMY w `analiza-zacienienia.test.ts`; po nim
  pakiet ponownie zielony (2095/2095, build). Test dymny na `pnpm start`: 6 zmigrowanych ekranów bez widocznych kluczy
  `UI-*`. Scalone do `main` przez PR.
- ✅ (2026-09-29) **Porównanie `public/sw.js` ze wzorcem PWA standardu** (pytanie otwarte od 26.09, `docs/memory.md`,
  Y.6 pkt 2). Raport z pomiarem na buildzie produkcyjnym: `docs/audyt-sw-vs-wzorzec-pwa.md`. Kod bez zmian.
- ✅ (2026-09-29) **Service Worker — decyzja właściciela: wariant C (A etapami).** Plan wykonawczy krok po kroku:
  `docs/plan-migracji-sw-wariant-c.md`. Wzorzec zsynchronizowany do `docs/przyklady/pwa/` (kopia 1:1 z
  `new-app-standards` @ `af63da7`).
- ✅ (2026-09-29) **`middleware.ts` — `/sw.js`, `/register-sw.js`, `/manifest.webmanifest` wykluczone z `matcher`**
  (raport SW, pkt 12). Sprawdzone na `pnpm build` + `pnpm start`: strony mają CSP, trzy pliki PWA omijają middleware.
- ✅ (2026-09-30, porządek listy: w `main` — PR #231) ~~🔲~~ (2026-09-29) **SW wariant C — etap 1: wzorzec standardu** (`docs/plan-migracji-sw-wariant-c.md`, sekcje 0–2).
  Na starcie zapytać właściciela o C-1 (`sonner`), C-2 (`playwright` w devDependencies), C-3 (precache ~230 tras
  dynamicznych). **Priorytet:** wysoki (5.3 — nieodwiedzony ekran nie działa offline w terenie). **Odblokowuje:**
  offline każdego ekranu, aktualizacje SW z toastem (5.9), testy SW (10.8/10.9), etap 2, 5.11 (ten sam toast).
  **Plusy teraz:** plan i wzorzec gotowe, pomiary świeże. **Minusy:** 1–2 sesje; pierwsza instalacja ok. 20+ MB do
  czasu etapu 2. **Kolizje:** `app/layout.tsx`, `next.config.mjs`, `middleware.ts`, `lib/i18n/dictionary-*.ts`
  (klucze `pwa.aktualizacja.*` — uwaga na równoległe sesje tłumaczeń), `package.json`/`pnpm-lock.yaml`, zadanie
  „Powrót CI od 1.10” (job e2e). **Kolejność:** przed etapem 2 i przed 5.11; niezależne od 5.10.
  🔄 **[29.09.2026, 22:45] W trakcie** — gałąź `claude/sw-wariant-c-etap1` (osobny worktree `../offgrid-sw-etap1`).
  C-1…C-3 = rekomendacje A/A/A (D59). Inne sesje: nie ruszać `app/layout.tsx`, `middleware.ts`, `next.config.mjs`,
  `public/sw.js`, `public/register-sw.js`, `lib/pwa/**` do merge tej gałęzi.
  ✅ **[29.09.2026, noc] Zrobione (D59).** Wzorzec standardu wdrożony: `app/sw.js/route.ts`, `lib/pwa/*`,
  `components/pwa/*`, `app/not-found.tsx` (PL/EN/RU), `sonner` + `playwright`; `public/sw.js` i `register-sw.js`
  usunięte. Testy: 26 jednostkowych (`lib/pwa/__tests__`), e2e `pnpm test:e2e` zielone (238 ekranów offline przy ubitym
  serwerze, toast i jedno przeładowanie na dwóch buildach, wyłącznik). Precache **21,3 MB** (539 wpisów). Szczegóły:
  `docs/memory.md` „SW wariant C — etap 1”, raport `docs/audyt-sw-vs-wzorzec-pwa.md` „Stan po etapie 1”.
  ✅ **[30.09.2026, porządek listy]** 🔄 z 22:45 nieaktualne — scalone do `main` (PR #231); blokada plików SW zdjęta.
- ✅ (2026-09-30, porządek listy: D60 + budżet wariant A — D61, PR #235) ~~🔲~~ (2026-09-29) **SW wariant C — etap 2: pomiar i odchudzenie precache** (plan, sekcja 3). **Priorytet:** średni
  (wysoki, jeśli pomiar etapu 1 przekroczy budżet). **Odblokowuje:** rozsądny pierwszy download na słabym łączu.
  **Kolizje:** `lib/pwa/precache-build.ts`, `scripts/kopiuj-maplibre-worker.mjs`, `components/lokalizacja/*`.
  **Kolejność:** dopiero po merge etapu 1 (potrzebne jego liczby); decyzja o budżecie i o widoku 3D offline —
  właściciel.
  → **[29.09.2026] Odblokowane** — etap 1 scalony, pomiar wyjściowy: 21,3 MB / 539 wpisów (`pnpm test:e2e` wypisuje
  rozmiar). Następny krok: 10 największych wpisów, pytanie o budżet i widok 3D (plan, sekcja 3).
  → **[30.09.2026] Częściowo zrobione (D60).** Widok 3D: decyzja właściciela „tylko online” — chunk three.js
  (~0,9 MB) poza precache, na ekranie 3 offline komunikat zamiast widoku. Przy pomiarze wyszedł **błąd etapu 1**:
  worker MapLibre wykluczony, więc offline na Skanerze znikał obrys działki (D22 wymaga spaceru GPS bez sieci) —
  naprawione, worker z powrotem w precache (+0,5 MB), test e2e pilnuje. Przy okazji naprawiony nieobsłużony błąd
  asystenta AI offline na każdym ekranie. Precache: **20,85 MB surowo / ≈ 6,8 MB transferu (gzip)**. Zostaje:
  budżet pierwszego pobrania — osobny wpis ⚠️ niżej. Szczegóły: `docs/memory.md` „Drobne zadania + SW etap 2”.
- ✅ (2026-09-30) ~~🔲~~ (2026-09-29) **5.10 — `navigator.storage.persist()` z zapamiętaniem odmowy** (raport SW, pkt 15; wzorzec
  `docs/przyklady/pwa/trwaly-magazyn.ts`). Bez tego szkice autosave mogą zostać skasowane przez przeglądarkę.
  **Priorytet:** średni. **Kolizje:** `lib/adapters/indexeddb-storage-adapter.ts`, `use-persisted-draft.ts`.
  Niezależne od decyzji SW.
  ✅ **[30.09.2026] Zrobione** — `lib/adapters/trwaly-magazyn.ts` (kopia wzorca), wołane z `setItem` adaptera
  IndexedDB; 5 testów jednostkowych.
- ✅ (2026-09-30) ~~🔲~~ (2026-09-29) **5.11 — obsługa kolizji wersji IndexedDB między kartami** (raport SW, pkt 16; wzorzec
  `indexeddb-baza.ts` + `baza-wersja-listener.tsx`). Dziś `DB_VERSION = 1` — uśpione. **Priorytet:** musi wejść
  **przed** pierwszym podbiciem `DB_VERSION`. **Kolizje:** jak 5.10 — robić w jednej sesji. Toast wymaga tego samego
  komponentu co toast aktualizacji SW — wybrano C, więc robić po etapie 1 SW.
  → **[29.09.2026] Odblokowane** — host toastów `sonner` jest w `app/layout.tsx` (`components/pwa/powiadomienia.tsx`).
  ✅ **[30.09.2026] Zrobione** — `naZdarzenieWersjiBazy` w `lib/adapters/indexeddb-storage-adapter.ts`, toast
  `components/pwa/baza-wersja-listener.tsx` (PL/EN/RU), 5 testów. Podbicie `DB_VERSION` jest od teraz bezpieczne.
- ✅ (2026-09-30) ~~🔲~~ (2026-09-29) **Usunąć nieużywane `public/placeholder*` (5 plików z szablonu).** Wyszło przy D59: nigdzie w `app/`,
  `components/`, `lib/` nieużywane; dziś tylko wykluczone z precache (`lib/pwa/precache-build.ts`). Po usunięciu zdjąć
  wykluczenie. **Priorytet:** niski. **Odblokowuje:** nic. **Plusy teraz:** 5 minut. **Minusy:** brak.
  **Kolizje:** `lib/pwa/precache-build.ts` (etap 2 SW) — robić razem z etapem 2 albo po nim.
  ✅ **[30.09.2026] Zrobione** — 5 plików usuniętych, wykluczenie z `precache-build.ts` zdjęte.
- ✅ (2026-09-30) ~~🔲~~ (2026-09-29) **Next 16: `middleware.ts` → `proxy.ts`.** `pnpm build` ostrzega: konwencja „middleware” jest
  przestarzała, nowa nazwa „proxy” (build nadal działa). Przed zmianą przeczytać przewodnik w
  `node_modules/next/dist/docs/` (standard 11.8 — klasyfikacja zmiany). **Priorytet:** niski, przed kolejnym majorem
  Next. **Kolizje:** `middleware.ts` (CSP, bramka Supabase 18.1, `matcher` plików SW) — nie równolegle z 18.x.
  ✅ **[30.09.2026] Zrobione** — `proxy.ts` (plik + nazwa funkcji), odwołania w komentarzach kodu poprawione;
  build bez ostrzeżenia, e2e SW zielone (CSP i `matcher` bez zmian).
- ⚠️ (2026-09-30) **Budżet pierwszego pobrania aplikacji (SW etap 2, dokończenie) — decyzja właściciela.** Dziś
  20,85 MB surowo, **≈ 6,8 MB realnego transferu** (gzip, 540 wpisów), pobierane raz w tle po pierwszej wizycie;
  chunki (`rev: 'i'`) nie są pobierane ponownie przy kolejnych wersjach, tylko zmienione. Opcje: (A) przyjąć obecny
  stan (≈ 7 MB transferu), dalej nic nie ciąć; (B) budżet ~5 MB transferu — wydzielenie słowników/tekstów pomocy per
  język z dwóch chunków ładowanych na każdej stronie (1,17 + 0,73 MB surowo, 3 języki naraz), zysk szacunkowy ~1–1,5 MB
  transferu, 1 sesja, dotyka `lib/i18n/**` (kolizja z sesjami tłumaczeń); (C) budżet ~2–3 MB — (B) + precache tylko
  części ekranów przy instalacji, reszta w tle/przy pierwszym otwarciu, **zmienia D59 C-3 i 5.3** (nieodwiedzony ekran
  mógłby nie działać offline). Rekomendacja: A teraz, B dopiero gdy pojawi się sygnał z terenu o słabym łączu.
  **Priorytet:** niski przy A, średni przy B. **Kolizje:** B — `lib/i18n/**`; C — `lib/pwa/precache.ts`, D59.
  **Kolejność:** po decyzji; B przed C.
  ✅ **[30.09.2026] Decyzja właściciela: wariant A** (D61) — obecny stan (≈ 6,8 MB transferu) przyjęty, dalej nic nie
  ciąć. B wraca dopiero przy sygnale z terenu o słabym łączu.
- ✅ (2026-09-30) **Opis ekranów dla AI projektującego wygląd** — `docs/opis-ekranow-dla-ai.md`: anatomia ekranu,
  kontrakt wyniku, wzorce A–H z liczbami, ekrany nietypowe, reguły nie do złamania, diagnoza „nieprzejrzystości”,
  załącznik z katalogiem 220 ekranów (wygenerowany z kodu stron). Odsyłacz dopisany w `docs/brief-dla-v0.md`.
- 🔲 (2026-09-30) **Tryb wyglądu „Premium” (na sprzedaż) obok obecnego „Warsztat”** — kierunek zaproponowany
  właścicielowi (sekcja 8 `docs/opis-ekranow-dla-ai.md`): paleta grafit/granat + akcent złoty, szeryfowe nagłówki,
  wynik jako bohater ekranu, szczegóły rozwijane (bez chowania `critical`), karta „Twój system” na pulpicie, raport
  PDF dla klienta. **Priorytet:** średni (czeka na wybór kierunku przez właściciela). **Odblokowuje:** wersję „na
  sprzedaż”. **Plusy teraz:** zmiana w tokenach i ~5 wspólnych komponentach obejmuje wszystkie ekrany. **Minusy:**
  dotyka `app/globals.css`, `components/werdykt.tsx`, `components/wzorce/*`, `lib/wyglad/` — współdzielone przez
  każdy ekran. **Kolizje:** każda sesja zmieniająca te pliki oraz wpis „Tłumaczenie etykiet stron na EN/RU” (inne
  pliki, ale te same ekrany do sprawdzenia wizualnego). **Kolejność:** najpierw prototyp w `/wzornik` + pulpit + jeden
  kalkulator, akceptacja właściciela, dopiero potem reszta.
  🔄 **[30.09.2026] Kierunek rozszerzony przez właściciela: 5 stylów wyglądu na start** — 3 „Premium” (Grafit + złoto,
  Granat + miedź, Jasny architektoniczny; wzór: obrazek nr 3 od właściciela) + 2 „Warsztat” (jasny, ciemny — obecne
  kolory, gęstsze, dopracowane). Prototyp poza kodem (artefakt): https://claude.ai/artifact/JsYnhZYECTQtSTAPAj4kmL —
  pulpit, kalkulator (baner twardego stopu poza akordeonem), raport. **Czeka na akceptację właściciela**, potem wpis D
  w `rejestr-decyzji.md`. Otwarte pytania z prototypu: (1) czcionka szeryfowa z cyrylicą — Fraunces/Instrument Serif
  jej nie mają (RU), w prototypie Source Serif 4; (2) miedź/złoto blisko 🟡 — czy przesunąć miedź; (3) zdjęcie domu vs
  ilustracja (waga precache, D61). **Kolizja:** sesja `large-tiles-presets-m14` wprowadza „presety pulpitu”
  (`lib/pulpit/presety.ts`, `app/ustawienia/page.tsx`, `app/page.tsx`) — styl wyglądu nazywać „Styl wyglądu”
  (`lib/wyglad/`), nie „preset”, a zmiany w Ustawieniach/pulpicie robić po scaleniu tamtej sesji.
  🔄 **[30.09.2026, D63] 3 style Premium przyjęte do pracy, 2 Warsztat odrzucone („za płaskie”).** Do wyboru przez
  właściciela 2 z 5 nowych propozycji w tym samym artefakcie: 4. Tytan (grafit + platyna), 5. Las + mosiądz,
  6. Kreślarski (blueprint), 7. Noc polarna, 8. Beton + mosiądz. **Następny krok:** wybór 2 propozycji → wpis D →
  wdrożenie tokenów 5 stylów w `app/globals.css` + wybór w Ustawieniach (`lib/wyglad/`) + `/wzornik`, pulpit i jeden
  kalkulator do akceptacji. **Priorytet:** średni. **Kolizje:** bez zmian (patrz wyżej).
  🔄 **[30.09.2026, D64] Wybrane kolejne 4 style: Tytan, Las + mosiądz, Kreślarski, Noc polarna (łącznie 7 w pracy).**
  Lista stylów otwarta. Druga runda w tym samym artefakcie czeka na wybór: 9. Różowe złoto, 10. Pudrowy róż,
  11. Pomarańcz sygnałowy (⚠️ blisko 🟡), 12. Słoneczny poranek, 13. Zachód słońca. **Następny krok:** wybór z
  drugiej rundy → dopisek do D64 → wdrożenie tokenów stylów w `app/globals.css` + wybór w Ustawieniach (`lib/wyglad/`),
  kontrola kontrastu werdyktów dla każdego stylu (szczególnie Las), potem `/wzornik`, pulpit i jeden kalkulator do akceptacji.
  Priorytet: średni. Kolizja i kolejność bez zmian: Ustawienia/pulpit dopiero po scaleniu sesji `large-tiles-presets-m14`.
  🔄 **[30.09.2026, D65] Druga runda przyjęta w całości: Różowe złoto, Pudrowy róż, Pomarańcz sygnałowy, Słoneczny poranek,
  Zachód słońca (łącznie 12 stylów).** Pomarańcz z warunkiem testu czytelności względem 🟡. Runda eksperymentalna 14–20
  (Holograficzny, Kokpit HUD, Szkło, Brutalizm, Synthwave, Orbita, Neumorfizm) czeka na wybór. **Uwaga wdrożeniowa:** przy 12+
  stylach tokeny muszą być generowane z jednej tabeli (styl → zestaw tokenów + kilka wariantów komponentów), a nie pisane
  ręcznie w `app/globals.css`. Każdy styl dostaje automatyczny test kontrastu werdyktów (WCAG), inaczej koszt utrzymania rośnie liniowo.
  🔄 **[30.09.2026, D66] Runda eksperymentalna przyjęta w całości (łącznie 19 stylów).** Holograficzny, Kokpit HUD, Szkło,
  Brutalizm, Synthwave, Orbita, Neumorfizm; warunki wdrożenia w D66. Czwarta runda (21–28: Notatnik inżyniera,
  Rozdzielnica, E-ink, OLED oszczędny, Płynny gradient, Terminal DOS, Marmur i złoto, Zen) czeka na wybór.
  **Do rozstrzygnięcia przed wdrożeniem:** jak podzielić listę w Ustawieniach (np. grupy: Premium / Jasne / Eksperymentalne /
  Ukryte-sezonowe), żeby wybór spośród 20+ stylów był czytelny na telefonie. Wdrażać etapami: najpierw mechanizm i tabela
  tokenów + kilka stylów, reszta partiami, bo każdy styl to test kontrastu i przegląd `/wzornik`.
  🔄 **[30.09.2026, D67] Czwarta runda przyjęta, łącznie 27 stylów w 4 grupach (Premium 10 / Jasne 7 / Eksperymentalne 8 /
  Ukryte i sezonowe 2), przydział w D67.** Wybór stylów zamknięty, faza projektowa zakończona. **Następny krok (implementacja,
  najlepiej w nowej sesji po `/compact`):**
  1. Tabela stylów w `lib/wyglad/` (styl → grupa, tokeny, warianty komponentów) i jej walidacja.
  2. Test kontrastu werdyktów dla każdego stylu (Vitest).
  3. Wybór stylu w Ustawieniach, pogrupowany, po scaleniu sesji `large-tiles-presets-m14`.
  4. Pierwsza partia stylów: 1–3 + Rozdzielnica + OLED oszczędny.
  5. Dalsze partie.

  **Otwarte:** mechanizm odblokowania grupy „Ukryte i sezonowe”, zdjęcia domów w pełnej jakości (licencja, D61), czcionka
  szeryfowa z cyrylicą. **Priorytet:** średni. **Kolizje:** Ustawienia/pulpit z sesją `large-tiles-presets-m14`.
  **Dopisek D67:** style 1–3 = bazowe w wersji PRO; styl wersji darmowej do wyboru później (razem z decyzją freemium,
  rozdz. 12 standardu). Tabela stylów dostaje pole dostępności, ale bez blokowania, dopóki freemium nie jest wdrożone.
  🔄 **[01.10.2026] Kroki 1–4 zrobione (gałąź `work/styles`):** tabela `lib/wyglad/style.ts` + walidacja, CSS generowany
  z tabeli, test kontrastu werdyktów WCAG dla każdego stylu (Vitest), wybór stylu w Ustawieniach i `/wzornik` (4 grupy,
  „Ukryte i sezonowe” za przełącznikiem ✅🤖), partia 1: Grafit + złoto, Granat + miedź, Jasny architektoniczny,
  Rozdzielnica, OLED oszczędny. Szczegóły i odstępstwa od prototypu: `docs/memory.md`. **Zostaje:** (5) dalsze partie
  (22 style, każdy z testem kontrastu i warunkami z D65–D67); użycie wariantów w komponentach (karta „Twój system”, wynik
  jako bohater, ramki/gradienty kart) — przegląd w `/wzornik`, pulpit i jeden kalkulator do akceptacji właściciela;
  decyzja o odblokowaniu grupy ukrytej; freemium (`dostepnosc`). **Kolejność:** akceptacja wyglądu partii 1 przed
  kolejnymi partiami. **Kolizje:** `lib/wyglad/`, `app/layout.tsx`, `app/globals.css`, `app/ustawienia/page.tsx`.
  ✅ **[01.10.2026, D69]** Właściciel potwierdził ✅🤖 partii 1: przełącznik grupy ukrytej, styl narzuca tryb jasny/ciemny,
  przyciemnione werdykty/akcent/obrysy z testu kontrastu, Source Serif 4. Decyzja o odblokowaniu grupy ukrytej zamknięta.
  🔄 **[01.10.2026] Krok 5 zrobiony (gałąź `work/styles2`):** wszystkie 27 stylów w tabeli (22 nowe), każdy przechodzi
  test kontrastu, warunki D65–D67 sprawdzane testami (symulacja deuteranopii/protanopii dla Pomarańczu i Kokpitu HUD,
  tęcza/neon nigdy na werdyktach, szkło bez rozmycia na słabych urządzeniach, ruch tła tylko na pulpicie). Żaden styl nie
  odpadł; odstępstwa od prototypu i wybory ✅🤖: `docs/memory.md`. **Zostaje:** akceptacja wyglądu przez właściciela
  (pulpit + jeden kalkulator), użycie `data-karta`/`bg-card` w kolejnych komponentach, freemium.
- ✅ (2026-09-30) **Kafle „duże” M14 + presety pulpitu (TD22 pkt 5, D53/D54).** Kafle „Dom – sieć” / „Firma – sieć”
  zajmują dwie kolumny siatki pulpitu, z opisem. W Ustawieniach sekcja „Co chcesz teraz zrobić?”: 8 presetów z
  `docs/pulpit-i-nawigacja.md` §3, kafle M14 na końcu każdego, kilka zaznaczonych = unia w kolejności domyślnej (✅🤖).
  Teksty PL/EN/RU (`lib/i18n/ui/pulpit.ts`), test `lib/pulpit/__tests__/presety.test.ts`. Przy okazji (Y.2): lista w
  Ustawieniach pokazywała „15. Dom – sieć” — kafle M14 nie mają numeru (D39), numer zdjęty.
- 🔲 (2026-09-30) **Pulpit — co zostało po presetach:** **[30.09.2026, D62] pkt (1) ✅** — właściciel przyjął skład i
  kolejność unii, preset zbudowany; otwarte zostają (2) i (3). (1) dziewiąty preset „Jestem podłączony do sieci” (D39) —
  **skład kafli do decyzji właściciela** (propozycja ✅🤖 do oceny: 15, 16, a za nimi moduły, z których M14 czyta:
  1, 2, 3, 4, 6, 7, 8); (2) ekran onboardingu przy pierwszym uruchomieniu (`backlog-poza-v1.md`); (3) animowana ikona
  kafli M14. **Priorytet:** niski. **Odblokowuje:** pełny §3 pulpitu. **Plusy teraz:** mechanizm presetów gotowy,
  dziewiąty to jedna linia w `lib/pulpit/presety.ts`; **minusy:** bez decyzji o składzie byłby zgadywaniem.
  **Kolizje:** `lib/pulpit/registry.ts` (każda sesja dodająca ekrany/kafle), `app/ustawienia/page.tsx`.
  **Kolejność:** decyzja (1) → kod (1) → (2) razem z onboardingiem.
- ✅ (2026-09-30) **M9 — blok 6: E1 wybór płytki (częściowo), E3 montaż i obudowa, Katalogi 2–4 (aktuatory, protokoły, interfejs lokalny).** M9: 10/10 — **moduł kompletny** (E1, E5 i Katalog 1 częściowo); łącznie 195/314. Wspólny silnik i komponent katalogów (`katalog-komponentow`), Katalog 1 deleguje do silnika (Dyrektywa #8). Szczegóły: `docs/memory.md` „M9 blok 6 (30.09.2026)”.
- ✅ (2026-10-01, D68: brak izolacji → 🔴, reszta bez zmian) ~~⚠️~~ (2026-09-30) **Do potwierdzenia przez właściciela (✅🤖) — M9/E3 poziomy ostrzeżeń.** Źródło E3 nie ma 🔴; w kodzie 🟡: odstęp od szyn prądowych < 2 cm, brak wentylacji, brak izolacji ESP32 od części pod napięciem. Brak izolacji od części pod napięciem to kandydat na 🔴 (ryzyko porażenia/przebicia na elektronikę), ale bez decyzji właściciela nie podnosimy. IP w miejscu wilgotnym — echo istniejących progów (🔴 < IP55, 🟡 IP55–IP64), bez nowej decyzji. **Priorytet:** niski. **Odblokowuje:** potwierdzenie C.7. **Plusy teraz:** jedno zdanie decyzji. **Minusy:** brak. **Kolizje:** tylko `lib/core/modules/esp32/montaz-obudowa/` (+ rejestr stopów, jeśli 🔴). **Kolejność:** niezależne.
- ✅ (2026-09-30) **M9/E4 → link do Katalogu 3 (protokoły)** — źródło: „Link: prowadzi do katalogu protokołów komunikacji”. Katalog jest już zbudowany; brakuje odnośnika na ekranie `architektura-komunikacji` (plik ma stare polskie teksty w JSX — nowy tekst przez `t()`, klucz w `lib/i18n/ui/m09-esp32.ts`). **Priorytet:** niski. **Odblokowuje:** pełne E4 wg źródła. **Plusy:** 5 minut. **Minusy:** brak. **Kolizje:** migracja i18n starego ekranu E4, jeśli ktoś ją prowadzi równolegle. **Kolejność:** dowolna. → ✅ **(02.10.2026) zrobione** — link pod wynikiem ekranu `architektura-komunikacji`, klucz `UI-ARCKOM-LINK-KATALOG-PROTOKOLOW` (PL/EN/RU) w `lib/i18n/ui/m09-ekrany.ts` (nie `m09-esp32.ts`, jak podawał wpis; ekran był już zmigrowany na `t()`).
- 🔲 (2026-09-30) **Dalej w sesji „ekrany bez właściciela”: M12** → ✅ **(01.10.2026) część M12 zamknięta** (wpis niżej); zostaje **M6** → ✅ **(01.10.2026) część M6 zamknięta** (wpis niżej: E13, E16–E20, 5.42, 2A — gałąź `work/m6`). (E4, E5, E6, E8, E10, E12, E13, E19, E20, E29, E40, E7, E17, E18, E34, na końcu E14), potem **M6** (E13, E16–E20, 5.42, ekran porównawczy 2A). Pułapki do jawnego opisania (Dyrektywa #5): M12/E6 — 50 W × 24 h → panel 150 W zakłada 8 h pełnego słońca; M12/E5 — przykład się nie bilansuje. **Priorytet:** średni. **Odblokowuje:** postęp M12/M6. **Kolizje:** `lib/pulpit/registry.ts`, `lib/i18n/ui/index.ts` (dopisywanie — łatwe scalenie). **Kolejność:** M12 przed M6.
- ✅ (2026-10-01) **M12 — wszystkie ekrany budowalne zbudowane: 40/42 ekranów `done`** (5 częściowo: E2, E11, E15, E31 — braki danych w źródle — oraz E21, który nie ma ekranu). Ostatnia partia (gałąź `claude/ekrany-m12-8ac1e6`): E8 przetwornice, E12 kreator małego odbiornika, E24 lista na kemping, E25 szybka diagnoza (🔴 odłącz zasilanie), E26 urządzenia medyczne (D: min. 2 doby jako 🟡 + zawsze zapasowe źródło), E37 urządzenia zabronione dla małych falowników (🔴), E40 blackout w bloku, E3 szablony zestawów, E33 test akumulatora (rezystancja wewnętrzna zamiast tabeli napięć, której źródło nie podaje), E14 raport bezpieczeństwa (🔴 brak bezpiecznika przy akumulatorze). Niespójności przykładów źródła opisane w silnikach i `docs/memory.md`. Zablokowane bez zmian: E41 (norma przewodów giętkich), 12.41 asystent głosowy (specyfikacja).
- ✅ (2026-10-01, D68: (1) i (3) potwierdzone; (2) bezpiecznik większy niż przewód → 🔴, osobny punkt raportu) ~~⚠️~~ (2026-10-01) **Do potwierdzenia przez właściciela (✅🤖) — M12, ostatnia partia.** (1) E33: stan „do wymiany” od wzrostu rezystancji wewnętrznej ≥ 50% względem karty — próg wzięty z M4 (`soh-per-ogniwo`, ta sama wielkość fizyczna), źródło E33 progu nie podaje; 10,5 V w spoczynku (ołów 12 V) = 🟡 „uszkodzony”, nie 🔴. (2) E14: tylko brak bezpiecznika przy akumulatorze jest 🔴 (alert Biblii); pozostałe błędy (dobór bezpieczników, przekroje, rozładowanie, wentylacja, połączenia) 🟡 — kandydat na 🔴: bezpiecznik większy niż obciążalność przewodu. (3) Szablony E3 dla jachtu, domku i warsztatu oraz kroki diagnozy E25 to listy eksperckie ✅🤖. **Priorytet:** niski. **Odblokowuje:** zdjęcie ✅🤖. **Plusy teraz:** każda zmiana to jeden poziom/stała + test. **Minusy:** brak. **Kolizje:** tylko katalogi `lib/core/modules/kalkulator-mobilny/{test-akumulatora,raport-bezpieczenstwa-maly,szablony-zestawow,szybka-diagnoza}/`. **Kolejność:** dowolna.
- ✅ (2026-10-01) **M6 — ekrany bez właściciela zbudowane (gałąź `work/m6`):** E13 dystrybucja ciepła (🔴 zwykłe grzejniki przy pompie ciepła), E16 sterowanie strefowe, E17 zasobnik i cyrkulacja C.W.U., E18 grzałka C.W.U., E19 osłony przeciwsłoneczne (tylko geometria okapu — zyski kWh czekają na model E11), E20 wentylacja naturalna vs mechaniczna, 5.42 kolektor gruntowy (🔴 kolektor poziomy nie głębiej niż strefa przemarzania), 2A alternatywne źródła ciepła (kominek, IR, maty, PCM; kocioł — odsyłacz do istniejącego ekranu 5.33). Każdy: silnik + testy, autosave, PL/EN/RU, „?” przy polach, „i” przy tytule, narzędzie AI. Niespójności przykładów źródła opisane w silnikach i `docs/memory.md` („M6 — ekrany bez właściciela (01.10.2026)”). Nie liczone (brak danych w źródle): wymiarowanie grzejników/pętli (PN-EN 442/1264), klasy ErP zasobników, zyski słoneczne kWh (PN-EN ISO 52016), długość rur kolektora (brak rozstawu), wymiennik kominka, model PCM „±3 °C”.
- ✅ (2026-10-01, D69: (1)–(5) potwierdzone, (6) kominek → 🔴) ~~⚠️~~ (2026-10-01) **Do potwierdzenia przez właściciela (✅🤖) — M6, ekrany bez właściciela.** (1) E16: oszczędność strefy liczona w stanie ustalonym Q = H·ΔT·t — górna granica (bez bezwładności budynku i ciepła na ponowne nagrzanie), ℹ️ w wyniku. (2) E17: cyrkulacja = strata liniowa rury × ΔT × godziny + prąd pompy, bez stygnięcia wody w rurach poza godzinami pracy. (3) E18: moc PV stała przez cały czas grzania (bez profilu dobowego). (4) E19: 🟡 przy jakimkolwiek zacienieniu okna w południe przesilenia zimowego (próg > 0%), tylko geometria południa słonecznego. (5) 5.42: widełki źródła 1,2–1,8 m (głębokość kolektora poziomego) i 50–100 m (odwiert) użyte jako progi 🟡; głębokość przemarzania wpisuje użytkownik (bez mapy stref w aplikacji). (6) 2A: brak schładzania grawitacyjnego kominka przy braku prądu = 🟡 (źródło: „ostrzeżenie”) — **kandydat na 🔴** (przegrzanie płaszcza wodnego). **Priorytet:** średni dla (6) (bezpieczeństwo), niski dla reszty. **Odblokowuje:** zdjęcie ✅🤖 z sześciu ekranów M6; (6) — wpis w `docs/rejestr-twardych-stopow.md`. **Plusy teraz:** każda zmiana to jeden poziom/stała + test. **Minusy:** (1)–(3) przejście z górnej granicy na model dynamiczny wymaga danych, których źródło nie daje. **Kolizje:** tylko katalogi `lib/core/modules/ogrzewanie/{sterowanie-strefowe,zasobnik-cwu,grzalka-cwu,oslony-przeciwsloneczne,kolektor-gruntowy,alternatywne-zrodla-ciepla}/`. **Kolejność:** (6) najpierw; (4) razem z modelem zysków E11, gdy powstanie.
- ✅ (2026-10-02) **Granica Offgrid ↔ przyszła apka „Elektryk Pro” — D70.** Analiza w `/mnt/project-files/analizy/granica-rozdzielnice-offgrid-vs-elektryk.md`; właściciel wybrał model „PV celowo w obu apkach, w innym zakresie”.
- 🔲 (2026-10-02) **D70 pkt 4–5 — wymagania dla rozdzielnicy AC za falownikiem w Offgrid (karta „Przekaż elektrykowi”, podział obwodów rezerwowanych, wpięcie falownika hybrydowego w istniejącą rozdzielnicę) + odesłania do Elektryk Pro.** Priorytet: niski–średni (odesłania mają sens dopiero, gdy Elektryk Pro istnieje; karta wymagań ma wartość od razu). Odblokowuje: domknięcie strefy B bez rozlewania się w projekt rozdzielnicy. Plusy teraz: segmenty „częściowy off-grid”/„przechodzący” (M14) dostają brakujący most do rozdzielnicy. Minusy teraz: część progów może wymagać norm z `docs/normy-brakujace.md` (np. HD 60364-5-551) — bez nich tylko 🔎. Kolizje: M14 D11 (przełącznik sieć/wyspa), M5/E16 RCD, M5/E2 SPD — najpierw sprawdzić, co już pokrywają, żeby nie dublować. Kolejność: po decyzji właściciela, czy budować przed premierą Elektryk Pro.
- 🔲 (2026-10-02) **Ceny apek rodziny — decyzja właściciela (D70 pkt 7).** Cel: min. 5000 zł netto miesięcznie z każdej apki. Analiza rynku i progów: `/mnt/project-files/analizy/ceny-apek-rodziny.md` (rekomendacja: Offgrid ~599 zł/rok + drogi plan miesięczny jako kotwica; Elektryk Pro ~299–349 zł/rok). Priorytet: średni, nie blokuje kodu (płatności nieimplementowane, standard rozdz. 12). Kolizje: zadanie wdrożenia freemium/płatności — ceny są jego wejściem. **[02.10.2026]** Ustalenia zebrane w `04_Plan_Rozwoju_i_Sprzedazy.md` (sekcja 13: otwarte decyzje).
- ✅ (2026-10-02) **M7/M6 — partia ekranów zimowych (gałąź `work/screens`, E2/E4/E6/E9 już zmergowane do main):** M7/E2 deficyty miesięczne i agregat, M7/E15 krótkie okno słoneczne, M7/E7 śnieg i oblodzenie PV + M7/E14 mgła i szadź (wspólny silnik `stress-test/osad-na-pv`), M6/E4 GWC, M6/E6 cykle odszraniania (zamyka też przeniesione 1.14 i 6.8), M6/E9 wentylacja grawitacyjna. Każdy: silnik + testy, autosave, PL/EN/RU, „?” przy polach, „i” przy tytule, narzędzie AI z „Użyj, gdy…”. Silniki echo: `obliczPraceAgregatu` (wydzielona z M2/E17, wyniki bez zmian), `obliczStrumienCieplaPowietrzaW`, `bojler-cwu`, `KAT_SPLUKIWANIE_MAX` (M3). Niespójności przykładów źródła (Dyrektywa #5) w komentarzach silników i `docs/memory.md` („M7/M6 — ekrany zimowe (01–02.10.2026)”). **Nie zbudowane, z powodem w `docs/rejestr-pokrycia.md`:** M7/E1 (pipeline dzień po dniu M1→M6), E3 (agreguje E1/E12), E9 (powielałby M3/E16 bifacjalne), E12 (brak wag składowych — blocked), E16/E24/E25 (otwarte decyzje właściciela), M6/E11 (odłożone decyzją właściciela).
- ✅ (2026-10-02, D71: potwierdzone (2), (3), (4) = pkt 14–16; **nadal otwarte ⚠️: (1) M7/E2 = pkt 13, (5) M7/E7/E14 = pkt 17, (6) wagi E12 / preset E9 — pytanie, nie założenie**) ~~⚠️~~ (2026-10-02) **Do potwierdzenia przez właściciela (✅🤖) — partia M7/M6 zimowa.** (1) M7/E2: 🟡 gdy paliwo na miesiąc przekracza wpisany zapas (źródłowe „40 h” nie ma progu); serwis jako koszt na godzinę pracy. (2) M6/E6: energia defrostu doliczana ponad normalne grzanie; górna granica strefy szronienia 7 °C (źródło: „5–7 °C”). (3) M6/E4: za rekuperatorem oszczędność GWC × (1 − sprawność rekuperatora). (4) M7/E15: grzałki BMS pierwsze (Biblia §2.15), po bojlerze bateria do 100%, zużycie w oknie pokrywane najpierw, bez strat ładowania. (5) M7/E7/E14: dni zalegania i % produkcji pod osadem wpisuje user; próg samoczynnego zsuwania sypkiego śniegu 30° wzięty z M3 `czystosc-i-snieg`. (6) M7/E12 i E9: podać wagi składowych Współczynnika Bezpieczeństwa Zimowego / zdecydować, czy E9 ma być presetem „śnieg” w M3/E16 zamiast osobnego ekranu. **Priorytet:** niski dla (1)–(5) (każda to jedna stała/kolejność + test), średni dla (6) — odblokowuje E12, a przez nie E3. **Odblokowuje:** zdjęcie ✅🤖 z sześciu ekranów; (6) budowę M7/E12 → E3. **Plusy teraz:** zmiany lokalne, testy już są. **Minusy:** brak — poza (6) nic tu nie blokuje dalszej pracy. **Kolizje:** tylko katalogi `lib/core/modules/stress-test/{deficyty-miesieczne,okno-sloneczne,osad-na-pv}/` i `lib/core/modules/ogrzewanie/{gwc,cykle-odszraniania,wentylacja-grawitacyjna}/`; (1) nie dotyka wspólnej `obliczPraceAgregatu` (M2/E17) — próg zapasu jest tylko w silniku E2. **Kolejność:** (6) przed budową E12/E3; E1 (pipeline) przed E3; reszta dowolnie.
- ✅ (2026-10-02) **M6 Część 2 — silnik 2D „wpływ czynnika X” + ekrany 2C (gałąź `work/screens`):** 2D — jeden silnik `ogrzewanie/wplyw-czynnika` (Dyrektywa #8, Wzorzec D) z 18 czynnikami pokrywającymi 21 pozycji (5.69, 5.73, 5.75–5.84, 5.86, 5.90, 5.91, 5.93–5.98, 5.100); fizyka z istniejących silników M6 (E7 `uPoDociepleniu` — wydzielona, E11 strumień ciepła powietrza, E12 infiltracja, `bojler-cwu`). 2C — `rozruch-pompy-ciepla` (5.52 + 5.61 + 5.66), `basen` (5.48), `odzysk-ciepla-sciekow` (5.41), `chlodzenie-pompa-ciepla` (5.29 + 5.47 + 5.51 + energia z 5.53; slug inny niż M4 `chlodzenie-latem`). Każdy: silnik + testy, autosave, PL/EN/RU, „?” przy polach, „i” przy tytule, narzędzie AI z „Użyj, gdy…”. Niespójności przykładów (Dyrektywa #5) w komentarzach silników i `docs/memory.md`. **Nie zbudowane, z powodem w `docs/rejestr-pokrycia.md`:** 2D 5.74, 5.85, 5.87, 5.88, 5.89, 5.92, 5.99 (tylko przykładowe procenty, brak modelu); 2C 5.37, 5.38, 5.44, 5.45, 5.49, 5.50, 5.55, 5.59, 5.60, 5.62.
- ✅ (2026-10-02, D71: potwierdzone (1)–(7) = pkt 20; (8) rozstrzygnięte = pkt 18: `CHL-PONIZEJ-ROSY` → 🔴, zrobione w kodzie i `rejestr-twardych-stopow.md`, `chlodzenie-pompa-ciepla` 1.1.0; brak otwartych punktów) ~~⚠️~~ (2026-10-02) **Do potwierdzenia przez właściciela (✅🤖) — M6 Część 2 (2D + 2C).** (1) 2D: stan ustalony; wpisane zapotrzebowanie zawiera już stan „przed”; brak progu przewymiarowania pompy. (2) 2D temp. zasilania: gdy brak COP „po” — reguła źródła 2–3%/°C liniowo, pokazana jako widełki. (3) 2D: zyski słoneczne i bytowe nie zmniejszają mocy projektowej (tylko energię sezonu); zyski słoneczne Q = A·g·H·(1 − zacienienie), bez ramy. (4) 2D ograniczenie mocy / bufor: pompa start/stop (bez modulacji). (5) 2D odwierty: moc liniowo z W/m. (6) 2D wysokość pomieszczeń zmienia tylko kubaturę i pole ścian; pola „po” = 0 w mostkach/szczelności = wyeliminowane. (7) rozruch: kVA porównane z kW falownika jak przy cos φ = 1; inne odbiorniki dodawane wprost. (8) chłodzenie: free cooling odbiera całe wpisane ciepło; `CHL-PONIZEJ-ROSY` = 🟡 — **kandydat na 🔴** (kondensacja na posadzce/klimakonwektorze). **Priorytet:** średni dla (8) (wilgoć/pleśń), niski dla reszty. **Odblokowuje:** zdjęcie ✅🤖 z silnika 2D i ekranów `rozruch-pompy-ciepla`, `chlodzenie-pompa-ciepla`; (8) — wpis w `docs/rejestr-twardych-stopow.md`. **Plusy teraz:** każda zmiana to jeden poziom/stała + test. **Minusy:** (1), (3), (4) — przejście na model dynamiczny/modulacyjny wymaga danych, których źródło nie daje. **Kolizje:** tylko `lib/core/modules/ogrzewanie/{wplyw-czynnika,rozruch-pompy-ciepla,chlodzenie-pompa-ciepla}/`. **Kolejność:** (8) najpierw; reszta razem przy przeglądzie M6.
- ✅ (2026-10-02, gałąź `work/m6-2b-dokladki`) ~~🔲~~ **M6 Część 2B — dokładki do ekranów Części 1 (5.27, 5.28, 5.30, 5.40, 5.43, 5.54, 5.56, 5.57, 5.58, 5.65, 5.67, 5.70, 5.71, 5.72) + możliwe 2C 5.64 (model sezonowy miesiąc po miesiącu Q/COP) i 5.68 (rekomendacje Wzorca G z wyników 2D).** **Priorytet:** średni. **Odblokowuje:** domknięcie M6 Części 2 w rejestrze pokrycia. **Plusy teraz:** fizyka już jest (Ekrany 2, 5, 13, 14, 15, 18 + silnik 2D). **Minusy:** dokładki edytują istniejące ekrany Części 1 — ryzyko kolizji z sesjami, które je ruszają; 5.57 i 5.30/5.58 już częściowo pokryte (E13, E18). **Kolizje:** `app/kalkulatory/{cop-pompy-ciepla,bufor-ciepla,pompy-cyrkulacyjne,grzalka-cwu,gwc,cykle-odszraniania,dystrybucja-ciepla}` i ich silniki. **Kolejność:** po merge'u gałęzi `work/screens`; 5.68 po 2B (rekomendacje korzystają z dokładek). **Zrobione:** wszystkie 14 pozycji 2B + 2C 5.64 i 5.68. Dokładki jako sekcje z własnym autosave na ekranach 1 (raport strat, 5.40/5.67), 4 (GWC + pompa, 5.54), 5 (dobór mocy 5.27/5.67, krzywa grzewcza 5.71, akapit SCOP 5.43), 6 (defrost w sezonie, 5.56), 14 (praca z buforem i bez, 5.28/5.70), 15 (przepływ przez pompę ciepła 5.65; sezon i zł pompy cyrkulacyjnej 5.72 — `pompy-cyrkulacyjne` 1.1.0), 18 (pompa ciepła w grzaniu C.W.U. i nadwyżka PV, 5.30/5.58); 5.57 pokryte Ekranem 13 (dodany test przykładu); nowe ekrany 2C `model-sezonowy-pompy-ciepla` (5.64 + realny SCOP 5.43) i `plan-poprawy-efektywnosci` (5.68, Wzorzec G). Każdy: silnik + testy, PL/EN/RU, „?” przy polach, narzędzie AI z „Użyj, gdy…”. Wspólne funkcje wydzielone bez zmiany wyników: `wspolne/hydraulika.ts` (przepływ, cykl start/stop — używa ich 2D), `energiaDefrostuNaGodzineKwh` (Ekran 6). Pominięte części i niespójności przykładów — `docs/rejestr-pokrycia.md` (wiersze 5.27–5.72) i `docs/memory.md`.
- ✅ (2026-10-02, D71: potwierdzone (1)–(8) = pkt 23; (9) rozstrzygnięte: pkt 21 `PRZ-PRZEPLYW-ZA-MALY` i `PRZ-PONIZEJ-MINIMUM` → 🔴, pkt 22 `DMP-DEFICYT` → 🔴 tylko bez dogrzewu — zrobione w kodzie i `rejestr-twardych-stopow.md`, `przeplyw-pompy-ciepla` i `dobor-mocy-pompy` 1.1.0; brak otwartych punktów) ~~⚠️~~ (2026-10-02) **Do potwierdzenia przez właściciela (✅🤖) — M6 Część 2B + 2C 5.64/5.68.** (1) 5.27: moc pompy liniowo między dwoma punktami karty, zapotrzebowanie liniowo do zera przy θi (punkt biwalentny). (2) 5.71: krzywa grzewcza = prosta przez dwa punkty; wpływ na COP z reguły źródła 5.69 (2–3 %/K) jako widełki. (3) 5.28/5.70: cykl start/stop jak 5.100 (bez modulacji), ciepło bufora V·c·ΔT_mag. (4) 5.64: COP miesiąca z karty przy średniej temperaturze miesiąca, defrost tylko przez efektywny COP z Ekranu 6. (5) 5.65: punkt pracy pompy obiegowej (przepływ z jej krzywej) wpisuje user; widełki źródła 5–7 K tylko jako ℹ️. (6) 5.30/5.58: COP C.W.U. stały przez cały podgrzew; nadwyżka PV stała przez czas grzania (ten sam model co Ekran 18); „bez nadwyżki PV → bateria” jako 🟡 (źródło: „Ostrzeżenie”). (7) 5.54: wzrost temperatury na wlocie parownika z bilansu mieszania strumieni GWC i parownika (powietrze-woda); wzrost COP tylko z karty. (8) 5.68: prosty okres zwrotu przy dzisiejszej cenie (bez inflacji, dotacji, kosztu kapitału); sortowanie po zwrocie, działania bez kosztu na końcu. (9) **Kandydaci na 🔴** (dziś 🟡): `PRZ-PRZEPLYW-ZA-MALY` i `PRZ-PONIZEJ-MINIMUM` (5.65 — źródło: „ryzyko zamarznięcia”); `DMP-DEFICYT` (5.27), gdy w domu nie ma dogrzewu (dom niedogrzany w mrozy) — dziś 🟡 niezależnie od dogrzewu. **Priorytet:** średni dla (9) (bezpieczeństwo wymiennika), niski dla reszty. **Odblokowuje:** zdjęcie ✅🤖 z 8 nowych silników; (9) — wpis w `docs/rejestr-twardych-stopow.md` i podniesienie poziomu. **Plusy teraz:** każda zmiana to jeden poziom/stała + test, silniki są małe. **Minusy:** (1)–(4) przejście na model dokładniejszy wymaga danych (krzywe mocy/COP, modulacja), których źródło nie daje. **Kolizje:** tylko `lib/core/modules/ogrzewanie/{dobor-mocy-pompy,krzywa-grzewcza,bufor-praca-pompy,model-sezonowy-pompy,przeplyw-pompy-ciepla,cwu-pompa-ciepla,gwc-pompa-ciepla,defrost-sezon,plan-poprawy-efektywnosci}/`; (2) dzieli stałą `COP_NA_STOPIEN_ZASILANIA` z silnikiem 2D (zmiana działa w obu). **Kolejność:** (9) najpierw; (2) razem z przeglądem 2D (wpis „M6 Część 2 (2D + 2C)” wyżej, pkt (2)); reszta dowolnie.
- 🔲 (2026-10-02) **Płatności, konta, mapa FREE/PRO i system kodów (polecenia, partnerzy, prezenty, zniżka krzyżowa) — ścieżka krytyczna startu sprzedaży** (`04_Plan_Rozwoju_i_Sprzedazy.md` §9, standard rozdz. 12). Priorytet: wysoki dla przychodu (bez tego nie ma sprzedaży ani śledzenia poleceń). Odblokowuje: start, program partnerski, konta mentorów, plan Instalator. Plusy teraz: lista oczekujących i beta mogą ruszyć równolegle. Minusy teraz: wymaga konta/backendu (rozdz. 18) i decyzji cenowych (sekcja 13 planu); duże zadanie. Kolizje: wpis „Rozdział 12 (Freemium) — zero implementacji” wyżej, pole `dostepnosc` stylów (D67). Kolejność: przed stroną sprzedażową z płatnością, po decyzji o cenach.
- 🔲 (2026-10-02) **Zgłosić Część I planu rozwoju i sprzedaży do `docs/wklad-do-standardu.md`** — właściciel: „potem zgłosimy”, gdy plan będzie dopracowany, żeby inne apki rodziny korzystały z tego samego schematu. Priorytet: niski (po decyzjach z §13 planu). Kolizje: brak. Kolejność: po zamknięciu otwartych decyzji w `04_Plan_Rozwoju_i_Sprzedazy.md` §13.
- ✅ (2026-10-02, gałąź `work/ekrany-bez-wlasciciela-m10-m8`, niewypchnięta) **M10 + M8 — ekrany bez właściciela (5 ekranów):** M10/E5 przesuwanie zadań domowych pod nadwyżkę PV (12.10), M8/E6 część AI — plan odcinania UPS wg priorytetów (12.54, `ups-krytyczny` 1.1.0), M10/E4 dobór źródła zasilania i prądu ładowania (12.7 + 12.8, echo M4), M10/E12 generalny audyt zimowy (12.36), M10/E7 wykrywanie anomalii PV i zużycia z kaskadą przyczyn (12.13, 12.14, 12.17). Każdy: silnik + testy, autosave, PL/EN/RU, „?” przy polach, „i” przy tytule, narzędzie AI z „Użyj, gdy…”. Pominięte z powodem (wiersze w `rejestr-pokrycia.md`): M10/E2, E3, E6, E8, E9, E10, E11 i części E7 (12.15, 12.16, 12.18) — telemetria/ML/historia albo brak reguł liczbowych w źródle. Szczegóły: `docs/memory.md` „M10 + M8 ekrany bez właściciela (02.10.2026)”.
- ✅ (2026-10-02, D71: potwierdzone (1), (2), (4), (5), (6) = pkt 25 oraz (3) = pkt 24 — `UPS-AKUMULATOR-SLABY` zostaje 🔴; brak otwartych punktów) ~~⚠️~~ (2026-10-02) **Do potwierdzenia przez właściciela (✅🤖) — M10 + M8/E6 AI, ekrany bez właściciela.** (1) M10/E5: siatka planu 30 min, horyzont jednej doby bez przejścia przez północ; priorytet = kolejność listy, zadanie startuje tam, gdzie w jego oknie jest najwięcej energii PV, przy remisie najwcześniej; zadania mogą na siebie zachodzić (łączna moc niesprawdzana); straty baterii pominięte; puste „od/do” = 0/24. (2) M8/E6 (12.54): próg odcięcia („ile minut przed końcem”) wpisuje user — źródło podaje tylko przykład „10 minut”; odcięcie liczone z pozostałego czasu przy bieżącym obciążeniu; oświetlenie awaryjne bez domyślnego priorytetu (źródło go nie wymienia w kolejności); przy braku priorytetu stosowane domyślne ze źródła. (3) M8/E6: 🔴 `UPS-AKUMULATOR-SLABY` dopisany do `rejestr-twardych-stopow.md`, bo źródło wprost oznacza go 🔴 (Ekran 6, Sekcja C) — **do potwierdzenia**; jeśli nie, obniżyć do 🟡. (4) M10/E4: brak temperatury ogniwa = limit prądu niesprawdzany (tylko ℹ️); luka 5–10 °C w tabeli cold C-rate zostawia prąd możliwy bez ograniczenia (zachowanie silnika M4). (5) M10/E12: potrzeba paliwa na zimę to liczba usera; dodany stan „zaplanowane, niewykonane” (liczony jako brak); wynik INCOMPLETE, dopóki każdy punkt nie jest oceniony. (6) M10/E7: próg alarmu od usera (procenty źródła to przykłady); zużycie sprawdzane w obie strony; bez progu kaskada przyczyn rusza przy każdym spadku PV; „uszkodzenie” = 🟡, nie 🔴. **Priorytet:** średni (nie blokuje kodu, każde założenie jest jawne na ekranie). **Odblokowuje:** zamknięcie ✅🤖 dla 5 ekranów; (3) — ewentualny 🔴 w raporcie M8. **Plusy teraz:** decyzje to zmiana stałej/poziomu w jednym pliku `constants.ts`/`warnings.ts` na ekran. **Minusy:** brak. **Kolizje:** wpis 🔲 „Prognozy M10 — Δt przy podłączaniu realnych danych (TD7)” — E5 korzysta z kontraktu E1 (siatka 3 h); zmiana Δt w E1 dotknie E5. **Kolejność:** najpierw (3) (poziom stopu), reszta dowolnie.
- ✅ (2026-10-02, D71, gałąź lokalna, niewypchnięta) **M6/2C — ekran „Pompa ciepła w taryfie nocnej” (dawne 5.59, `taryfa-nocna-pompy-ciepla`).** Właściciel zdecydował: budować, aplikacja obsługuje też domy hybrydowe z przyłączem do sieci. Silnik + testy (`lib/core/modules/ogrzewanie/taryfa-nocna-pompy-ciepla/`), UI `app/kalkulatory/taryfa-nocna-pompy-ciepla/`, narzędzie AI `policz_pompe_ciepla_w_taryfie_nocnej`, pomoc „?”/„i”, PL/EN/RU, autosave, wpis w pulpicie. Ceny, godziny strefy i COP wpisuje użytkownik; dane M14 nie pasują (składniki opłat sieciowych, bez godzin stref i bez ceny energii).
- ⚠️ (2026-10-02) **Do potwierdzenia przez właściciela (✅🤖) — ekran taryfy nocnej (5.59).** (1) Ciepło na dobę rozłożone równo na 24 h (źródło nie podaje profilu godzinowego); strefa dzienna/nocna z długości strefy nocnej od usera. (2) Bufor przesuwa na noc najwyżej V·c·ΔT ciepła strefy dziennej, bez strat bufora i ze stałym COP w strefie (flatteruje oszczędność — jawne założenie na ekranie). (3) COP nocy puste = jak w dzień (jawne założenie). (4) Źródło energii nocnej: sieć / agregat / bateria; bateria → 🟡 z komunikatem źródła („licz się z rozładowaniem”), agregat → ℹ️ „cena nocna = Twój koszt kWh z agregatu”; brak oszczędności przy przesunięciu → 🟡. (5) „Harmonogram pracy nocnej” ze źródła nie liczony godzina po godzinie — wynik to energia i średnia moc w strefie nocnej; „obniży koszt o 30%” to przykład, nie próg. **Priorytet:** niski. **Odblokowuje:** zdjęcie ✅🤖 z ekranu. **Plusy teraz:** każda zmiana to jedna stała/poziom + test. **Minusy:** model godzinowy wymaga profilu zapotrzebowania, którego źródło nie daje. **Kolizje:** tylko `lib/core/modules/ogrzewanie/taryfa-nocna-pompy-ciepla/`. **Kolejność:** dowolnie.
- ✏️ (2026-10-02) **Niespójności źródła znalezione w tej rundzie (do wiadomości, bez zmian w `docs/zrodla/`):** (1) M10/E12 — przykład „8/10 punktów”, a lista ma 5 punktów; (2) M8/E6 — kolejność priorytetów pomija oświetlenie awaryjne wymienione w Sekcji A; (3) `docs/memory.md` (wpis z ok. 27.09) mówił, że 12.54 jest niebudowalne bez progu — rozwiązane progiem od usera, wpis memory zostaje jako historia.
- ✅ (2026-10-02) **Decyzja właściciela — realny dobór paliwa na zimę + dogrzewanie nagrzewnicą powietrza (zbudowane: M7/E2 `deficyty-miesieczne` 1.1.0, nowy ekran M6 `nagrzewnica-powietrza`).** Tekst decyzji (do przeniesienia do `rejestr-decyzji.md` przez sesję, która go edytuje — numer D nadaje ona; tu celowo bez numeru): „Musimy obliczyć zapotrzebowanie na energię, wziąć moc agregatu i ilość zużywanego paliwa na godzinę. Na takiej podstawie obliczać ile w godzinę może wyprodukować kW i ile paliwa potrzeba. Na podstawie tego obliczamy jak dużo paliwa potrzebuje. Na razie pokazujemy opcje przykładowe (horyzonty). Lecz chcę, żeby realnie analizował, prognozował, ile było w poprzednich latach słonecznych dni i tak dalej. A potem jak będą dane z tego budynku albo z tej miejscowości, to będzie liczył bardziej dokładnie i prognozy będą lepsze. Musimy jak można realniej obliczyć zapotrzebowanie, a nie liczyć na cały jeden dzień czy tydzień. Ale jako opcja muszą być na starcie. Plus gdzieś musimy liczyć dogrzewanie przez webasto, dogrzewanie powietrza. Jest tanio i mało prądu potrzebuje, więc wyjdzie taniej niż grzać prądem.” **Zrobione:** (a) łańcuch agregatu jawnie: kW na godzinę pracy (moc × 80%, istniejąca stała), l/kWh, zł paliwa/kWh, godziny i litry na całą energię; (b) horyzonty startowe 3/7/14 dni/miesiąc/własna liczba dni z porównaniem z zapasem (🟡 `DEFM-HORYZONT-PONAD-ZAPAS`); bez wyboru horyzontu — stare ostrzeżenia miesiąc po miesiącu (zgodność wsteczna); (c) tryb realistyczny — typowane wejście `historia` (lata × doby: produkcja PV [kWh] albo nasłonecznienie [kWh/m²] × kWp × PR podane przez usera; źródło oznaczone: PVGIS / pomiar budynku / pomiar miejscowości / ręcznie; brak dnia = `null`, nie wypełniany), rozkład deficytów miesięcznych (min/mediana/percentyl/max), najgorsze okno między dostawami w każdym roku, serie słabych dób, zapas z percentyla użytkownika, liczba lat i dób, na których stoi szacunek, jawna notatka przy małej ilości danych; (d) wersja kalkulatora 1.0.0 → 1.1.0. Ekran `nagrzewnica-powietrza` (M6, D28): koszt 1 kWh ciepła z karty (cena × l/h ÷ kW) + własny prąd nagrzewnicy (pobór [W], energia rozruchu, liczba rozruchów) wyceniony ceną prądu użytkownika vs ogrzewanie prądem (COP 1 albo wpisany), cena prądu równowagi, doba (godziny, litry, Wh i % baterii nagrzewnicy vs ogrzewania prądem), suma sezonu; ostrzeżenia D28 zachowane (spaliny/CO + montaż poza pojazdem, gęstnienie oleju). **Decyzja „czy osobny ekran”:** `koszty-ogrzewania` liczy ranking wielu źródeł w skali lat i nie wycenia prądu pomocniczego w koszcie kWh ani nie pokazuje obciążenia baterii → osobny, zwarty ekran; `koszty-ogrzewania` bez zmian (link z nowego ekranu). Wszystkie dane urządzenia wpisuje użytkownik — zero liczb z głowy.
- ⚠️ (2026-10-02) **Do potwierdzenia przez właściciela (✅🤖) — założenia własne tej rundy (M7/E2 1.1.0 + M6 nagrzewnica).** (1) Horyzont stały = najgorszy miesiąc: średnia doba (deficyt ÷ dni miesiąca, kalendarz nieprzestępny) × N dni; agregat pokrywa całą brakującą energię. (2) Analiza historii: bilans dobowy BEZ magazynu energii (deficyt doby = max(0, zapotrzebowanie − produkcja PV)) — górna, bezpieczna granica, zawyża paliwo; magazyn w bilansie to osobne zadanie niżej. (3) Okno dostaw: najgorsze okno N dni w każdym roku (maksimum roczne), potem rozkład po latach; percentyl metodą najbliższej rangi (bez interpolacji — wynik to zawsze zaobserwowana wartość). (4) Percentyl, okno dostaw i próg „słabej doby” to wpisy użytkownika bez wartości domyślnych (puste = wyłączone); **ekran nie podpowiada żadnej liczby**. (5) Deficyty miesięczne wzięte z historii, gdy nie wpisane: percentyl, a bez percentyla — mediana; miesiące bez pełnych danych = 0 (z info). (6) UI przyjmuje jedno średnie dobowe zapotrzebowanie i powiela je na 12 miesięcy (silnik przyjmuje 12 wartości; zimą zapotrzebowanie bywa wyższe — pole ma to w „?”). (7) „Mało danych” (info, nie 🟡): jeden rok albo percentyl równy maksimum (z reguły najbliższej rangi: ⌈p·n⌉ = n) — brak progu liczby lat, bo źródło go nie podaje. (8) 🟡: `DEFM-HORYZONT-PONAD-ZAPAS`, `DEFM-HISTORIA-ZAPAS-ZA-MALY` — kandydaci (poziom 🟡 z własnej decyzji, nie ze źródła); żadnego nowego 🔴 poza kodami walidacji (w `stopy-guard-wyjatki.json`). (9) Nagrzewnica: praca ciągła na wpisanym ustawieniu mocy (godziny = ciepło ÷ moc); COP puste = 1 jak w `koszty-ogrzewania` (źródło „COP=1”); ostrzeżenia D28 jako 🟡 (jak w `koszty-ogrzewania`), nie 🔴; „prąd tańszy” jako ℹ️ mówione wprost; 🟡 gdy prąd własny doby > pojemność użyteczna baterii (granica fizyczna 100%) albo praca > 24 h/dobę. (10) Format wklejania historii: wiersz = rok + wartości od 1 stycznia, separator spacja/tab/średnik, „-” = brak dnia. **Priorytet:** średni. **Odblokowuje:** zamknięcie ✅🤖 dla dwóch ekranów; (4) i (7) decydują, jak „sztywne” jest zalecenie zapasu. **Plusy teraz:** zmiana każdego punktu to stała/poziom w `constants.ts`/`warnings.ts` jednego modułu. **Minusy:** brak. **Kolizje:** wpis ⚠️ (2026-09-28) o progu parafinizacji M7/E8 (źródło: −20 °C vs −15 °C) — nagrzewnica echo-uje stałą z `koszty-ogrzewania` (−20 °C tylko do komunikatu); rozstrzygnięcie tam przesunie też ten komunikat. **Kolejność:** (2) przed integracją z symulacją M7/E1.
- 🔲 (2026-10-02) **Pobieranie wieloletnich danych dobowych z PVGIS (`seriescalc`) — Route Handler + adapter wg wzorca D22 (`lib/adapters/pvgis/tmy.ts`) — NIEZBUDOWANE i NIEPRZETESTOWANE na żywo.** Powód: z tej piaskownicy `re.jrc.ec.europa.eu` zwraca 403 z proxy (sprawdzone 02.10.2026), więc kształtu odpowiedzi `seriescalc` (pola, znacznik czasu, konwencja offsetu — TD15) nie dało się zweryfikować, a nie wolno go zgadywać. Silnik M7/E2 jest gotowy na ten typ (`historia.zrodlo = "pvgis-seriescalc"`, `rodzaj` produkcja albo nasłonecznienie, agregacja godzin → doby po stronie adaptera); do czasu adaptera użytkownik wkleja dane ręcznie. Testy silnika działają na fixture'ach zbudowanych własnoręcznie, nie na danych klimatycznych. **Priorytet:** średni. **Odblokowuje:** automatyczny „realny” dobór paliwa dla działki bez wpisywania lat; po adapterze — wartość `pvgis-seriescalc` w etykiecie źródła zyskuje pokrycie. **Plusy teraz:** wzorzec proxy istnieje. **Minusy:** bez dostępu sieciowego powstałby kod nieweryfikowalny. **Kolizje:** M1 (proxy PVGIS TMY, TD15 — offset czasu) — jedna konwencja czasu dla obu. **Kolejność:** po sprawdzeniu dostępu do PVGIS w środowisku z dostępem sieciowym.
- 🔲 (2026-10-02) **Dalsze kroki realnej prognozy paliwa (M7/E2):** (a) magazyn energii w bilansie dobowym (pojemność użyteczna, stan początkowy) zamiast „bez magazynu” — zmniejszy zawyżenie paliwa; (b) dane z własnego budynku: wejście `historia` z `zrodlo = "pomiar-budynku"` czeka na źródło pomiarów (telemetria/M13), a im więcej własnych dób, tym węższy zakres — silnik to już pokazuje (liczba lat/dób); (c) połączenie z M7/E1 (symulacja dzień po dniu) jako dostawcą deficytów; (d) podpowiedź ceny prądu z agregatu (l/kWh × cena paliwa) do ekranu `nagrzewnica-powietrza` — dziś wpisywana ręcznie, opisane w „?”. **Priorytet:** średni (a, c), niski (d). **Odblokowuje:** (a) — mniej konserwatywny zapas; (c) — brak ręcznego wpisu deficytów. **Plusy teraz:** typy wejścia już ich nie blokują. **Minusy:** (a) dokłada jawne założenia (stan początkowy baterii). **Kolizje:** TD7 (Prognozy M10 — Δt) dla (c). **Kolejność:** (a) przed (c).
