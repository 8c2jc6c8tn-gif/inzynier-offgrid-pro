# docs/lista-do-zrobienia.md — Inżynier Offgrid Pro

Bieżąca, operacyjna lista zadań tego projektu. Format i zasada aktualizacji: `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_39.md`, Część B.6. Czytana **zaraz po `00_Biblia.md`**, na starcie każdej sesji (Część P.2) — żeby AI nie musiało eksplorować całego projektu od nowa, żeby wiedzieć, od czego zacząć.

**To nie to samo, co:**
- `backlog-poza-v1.md` — rzeczy świadomie odłożone poza zakres (decyzje o skali/fazowaniu produktu, zbierane przy audycie).
- `mapa-wdrozenia.md` — status per moduł (M#), granularny, podczas Wdrożenia.

Tu trafia bieżący stan pracy: co w trakcie, co zablokowane, co następne — aktualizowane na bieżąco, nie tylko przy audycie.

**Statusy:** 🔲 do zrobienia · 🔄 w trakcie · ✅ zrobione · ⏳ odłożone (z powodem) · ⚠️ zablokowane (czeka na decyzję/informację)

**Zasada aktualizacji:** nie usuwamy wpisów (Część D GOD BOOK). Zmiana statusu = dopisanie nowej daty i statusu obok starego, nie kasowanie.

---

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
- 🔄 (2026-09-25) **Moduł 3 (Instalacja PV) — sesja budowy, pełne wyliczenie + partie ekranów.** ✅ (25.09) partia 2: E1 kąt i azymut + optimum miesięczne (D26), E20 wschód-zachód → 20/27; dalej E4 (D25 — czeka na odpowiedź o zimowym zapotrzebowaniu na ogrzewanie), E9 (D27), E2, E3, E27. ✅ (25.09) E9 złoty środek (D27) → 21/27; odpowiedź właściciela: pole „dodatkowe zapotrzebowanie zimą [kWh/dzień]” w E4 — TAK. ✅ (25.09) E4 liczba paneli (D25) → 22/27; zostają E2, E3 (todo), E27 (raport, zależny od zablokowanego E19). ✅ (25.09) E3 tracker vs stały stelaż → 23/27; zostaje E2 (todo) i E27. ✅ (25.09) E2 typ montażu (6 trybów, w tym D26) → 24/27; zostaje E27 (czeka na E19). ✅ (25.09) partia 1: E7, E12, E15, E21, E23, E25 → M3 18/27 `done` (✏️ E21 — ostrzeżenie o sprzężeniu AC mikroinwerterów w off-gridzie czeka na potwierdzenie właściciela). ✅ (25.09) krok 0: 17 brakujących wierszy M3 w `docs/rejestr-pokrycia.md` (Dyrektywa #14), korekta M3/M5 w `mapa-wdrozenia.md`, blocked E9/E10/E19 w `backlog-poza-v1.md`. Dalej: partia 1 (E7, E12, E23, E15, E21, E25 — źródło kompletne) → partia 2 (E1, E20 — echo silnika M1/E4, PR ręczny) → partia 3 (E4 po potwierdzeniu drabinki okresów, E3, E2 częściowo). **Priorytet:** wysoki (serce produktu off-grid, M1 już dostarcza dane słoneczne). **Odblokowuje:** E27 (raport), M7 ekrany zależne od M3 (śnieg/oblodzenie PV, albedo, awaria stringa zimą, krótkie okno słoneczne). **Plusy teraz:** M1 świeżo gotowy — silnik i dane w kontekście; **minusy odkładania:** M7 dalej zablokowany. **Kolizje:** `lib/pulpit/registry.ts`, `lib/i18n/dictionary-*.ts`, `scripts/check-i18n-guard.mjs`, `lib/ai/pytaj-asystenta.ts` — te same pliki co rollout opisów AI (sesja 2) — nie prowadzić obu równolegle w dwóch gałęziach. **Kolejność:** przed rolloutem opisów AI dla starych kalkulatorów M3 (nowe ekrany dostają opis od razu). Szczegóły: `docs/memory.md` "Moduł 3 — pełne wyliczenie + start sesji budowy (25.09.2026)".
- ✅ (2026-09-25, rozstrzygnięte → D27: rekomendacja + wykresy + dowolny kąt, wiatr %/N, balast kg, 1 zł/kg edytowalne; norma wiatrowa dostarczona; brak PN-EN 1990 → balast bez współczynników bezpieczeństwa) ~~⚠️ Do decyzji właściciela: M3/E9 „Złoty środek”~~ — dostarczenie PN-EN 1991-1-4 (krzywa wiatru w funkcji kąta) i/lub sposób ważenia kryteriów (złotówki vs punkty ważności). **Priorytet:** średni. **Odblokowuje:** E9 w pełni. **Plusy teraz:** wyjaśnienie świeże; **minusy:** bez normy wiatrowej tylko 2 z 3 krzywych. **Kolizje:** bezkolizyjne. **Kolejność:** po partii 2 (E9 korzysta z krzywej produkcji E1).
- ✅ (2026-09-25, potwierdzone tego samego dnia → D25 w `rejestr-decyzji.md`: okresy lato/mar–paź/lut–lis/cały rok, limit montażowy z podpowiedzią 30, deficyt zimowy) ~~⚠️ Do potwierdzenia: M3/E4 drabinka okresów pokrycia~~ (cze–sie / kwi–wrz / mar–paź / lut–lis / cały rok) — potem wpis D# w `rejestr-decyzji.md` (odejście od 3 wariantów źródła). **Priorytet:** średni. **Odblokowuje:** budowę E4. **Kolizje:** bezkolizyjne. **Kolejność:** po E1 (wspólne przeliczenie miesięczne i PR).
- ✅ (2026-09-25, zamknięte 2026-09-26) ~~**Zduplikowane `id` pól formularza w listach**~~ — `Pole`/`PoleSelect` budują `id` z etykiety; pola w `.map()` bez jawnego `id` dublują je (etykieta wiąże się tylko z pierwszym polem — dostępność). Naprawione w M6 koszty ogrzewania, M3/E2, M1/E4, i **od 26.09 strukturalnie dla wszystkich ekranów naraz**: `Pole`/`PoleSelect` (`components/ui/pole.tsx`) teraz zawsze domyślają `id` do `useId()` (standard 8.10), zamiast budować go z etykiety — wpis w commicie "Aktualizacja ze standardu (Y.6/Y.9)" tego samego dnia. Sprawdzone przy weryfikacji tego wpisu (26.09): obie funkcje bezwarunkowo wywołują `useId()` i używają go jako fallbacku, gdy `id` nie jest podane jawnie — duplikaty z `.map()` bez jawnego `id` już nie powstają. Pełen przegląd tras Playwright pod kątem pozostałych, niestandardowych pól (poza `Pole`/`PoleSelect`) zostaje otwarty jako nisko-priorytetowe dopieszczenie, ale główna przyczyna jest usunięta.
- 🔲 (2026-09-25) **Pełna resynchronizacja `mapa-wdrozenia.md`** — wiersze M1, M2, M4, M6–M13 i licznik "Łącznie" nadal ze stanu 07.09.2026 (skorygowane 25.09 tylko M3 i M5). Przeliczyć z `docs/rejestr-pokrycia.md` (14.3 — przeliczeniem, nie z metryczki). **Priorytet:** średni (mapa to jedyne miejsce, które ma być wiarygodne — T.2). **Odblokowuje:** wiarygodny obraz postępu dla planowania. **Plusy teraz:** tanio; **minusy odkładania:** każda sesja planuje na błędnych liczbach. **Kolizje:** `mapa-wdrozenia.md` — dotyka go też sesja M3 (tylko wiersz M3). **Kolejność:** po zamknięciu bieżącej sesji M3 (żeby liczyć raz, na stanie końcowym).
- ✅ (2026-09-25, zbudowane → D28: ekran M6 „Porównanie kosztów ogrzewania” z nagrzewnicą typu webasto, olejem i paliwami stałymi; metraż→ciepło nadal czeka na PN-EN 12831-1) ~~⚠️ (2026-09-25) **Pomysł właściciela projektu (F.1, do decyzji): dogrzewanie paliwowe typu „webasto” (nagrzewnica powietrzna na olej napędowy) jako zimowe źródło ciepła o niskim poborze prądu.**~~ Źródło aplikacji nie ma treści o tym (webasto tylko jako punkt przeglądu, M10 §10.34/10.36; M6 Część 2A „alternatywne źródła ciepła” — luka źródła). Do zbudowania potrzebne: dane z karty katalogowej jako wpis użytkownika (moc grzewcza kW, zużycie paliwa l/h, pobór prądu W w pracy i przy starcie), zapotrzebowanie cieplne budynku (wpis albo PN-EN 12831-1 — `docs/normy-brakujace.md`), ceny paliw do porównania kosztu kWh ciepła. Ryzyka do ujęcia jako twarde stopy/ostrzeżenia: spaliny/CO (M8 — czujnik CO już twardym stopem przy paliwie stałym), montaż urządzenia samochodowego w budynku mieszkalnym (poza jego homologacją — do sprawdzenia z kominiarzem/rzeczoznawcą), parafinowanie oleju na mrozie, przejście gorącego wydechu przez przegrodę. **Priorytet:** średni. **Odblokowuje:** pełny sens deficytu zimowego w M3/E4 (D25), M7 „Deep Winter Energy Budget”. **Plusy teraz:** łączy się z D25; **minusy:** bez PN-EN 12831-1 metraż→kW tylko ręcznie. **Kolizje:** M6 (ogrzewanie) — bezkolizyjne z sesją M3. **Kolejność:** po M3/E4.
- 🔄 (2026-09-25) ✅ PN-EN 1991-1-4 dostarczona tego samego dnia (notatka: `docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md`). **Pozyskanie norm (właściciel projektu):** ~~PN-EN 1991-1-4 (wiatr — 🔴, blokuje M3/E9/E6/E2)~~, PN-EN 12831-1 (obciążenie cieplne), dalej wg `docs/normy-brakujace.md`. **Priorytet:** 1991-1-4 wysoki, reszta średni. **Odblokowuje:** E9 w pełni, balast E6/E2, metraż→ciepło. **Kolizje:** bezkolizyjne. **Kolejność:** niezależne od kodu — im wcześniej, tym lepiej.
- 🔄 (2026-09-25, wybrany plan B: pliki zostają do publikacji, nowe normy jako notatki robocze) ⚠️ **Licencje norm w publicznym repo — do decyzji, najpóźniej PRZED pierwszymi użytkownikami/publikacją.** Repo jest publiczne; `docs/zrodla/` zawiera PDF-y norm chronionych (PKN/IEC) i `.md` z przepisaną treścią rozdziałów. Opcje: (A) repo prywatne teraz, (B) oryginały PDF na dysk właściciela + w repo tylko notatki robocze z liczbami (wzór: `docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md`), przegląd istniejących `.md` pod kątem przedruku. Szczegóły: `docs/memory.md` "Licencje norm w publicznym repozytorium". **Priorytet:** wysoki (ryzyko prawne rośnie z czasem publicznej widoczności). **Odblokowuje:** bezpieczną publikację. **Plusy teraz:** A to jedno kliknięcie; **minusy odkładania:** pliki są publiczne już dziś. **Kolizje:** `docs/zrodla/` — tylko przenoszenie/usuwanie plików, bez kolizji z kodem. **Kolejność:** A od razu, B przed publikacją.
- ✅ (2026-09-25) **Weryfikacja OCR paczki New-info** — zakres używany w projekcie zweryfikowany wizualnie i przepisany (PN-EN 1991-1-4, PN-EN 1990, IEC 62305, wzory Purmo), błędy poprawione, `00-INDEKS.md` + `normy-brakujace.md` zaktualizowane. Szczegóły: `docs/memory.md` „Weryfikacja OCR paczki New-info”.
- 🔲 (2026-09-25) **Balast projektowy wg PN-EN 1990 (EQU)** w M3/E9, E2, E6 — zamiast `m = Fw/g`: `γG,inf·G ≥ γQ·Fw` (γG,inf = 0,90, γQ = 1,50, Tablica A1.2(A), NB bez zmian). Przesuw (tarcie balastu o podłoże) — normy brak, zostaje ostrzeżenie. **Priorytet:** wysoki (bezpieczeństwo konstrukcji, D27). **Odblokowuje:** usunięcie ostrzeżenia ZS-BALAST-BEZ-WSPOLCZYNNIKOW. **Kolizje:** `lib/core/modules/pv/zloty-srodek/`, `typ-montazu`, słowniki i18n. **Kolejność:** najpierw — dane gotowe.
- 🔲 (2026-09-25) **M6: projektowe obciążenie cieplne z metrażu/przegród** (ΦHL = ΦT + ΦV, poradnik Purmo do PN-EN 12831:2006 + PN-82/B-02403 strefy) i podpięcie do „Porównanie kosztów ogrzewania”. Rozbieżność wersji (2006 vs 12831-1:2017) jako założenie. **Priorytet:** średni. **Odblokowuje:** M3/E4 deficyt zimowy, M7 Deep Winter. **Kolejność:** po balaście.
- ✅ (2026-09-25) ~~**Do decyzji właściciela:** dwa foldery normy wiatrowej (`norma-PN-EN-1991-1-4/` — notatka robocza, `norma-PN-EN-1991-1-4-wiatr/` — pełny tekst): (A) scalić, (B) zostawić z odsyłaczami (stan obecny).~~ **Rozstrzygnięte: wariant A** — wszystko w `docs/zrodla/norma-PN-EN-1991-1-4/` (notatka + PDF + OCR + dawny indeks jako sekcja).

- ✅ (2026-09-26) **Aktualizacja ze standardu (Y.6/Y.9):** GOD BOOK v2_38→v2_39 (B.5 cykl życia `docs/zrodla/`, N.1 kompletność źródło→rejestr), 8 rozdziałów `docs/standards/` (05, 08, 10, 11, 14, 16, 00-INDEKS, 00-filozofia), `PROMPT_STARTOWY.md`; odsyłacze ADAPTOWALNE poprawione; 3 wpisy `wklad-do-standardu.md` → ✅ skonsolidowane; `Pole`/`PoleSelect` na `useId()` (8.10). Szczegóły: `docs/memory.md`.
- ✅ (2026-09-26) **Balast projektowy PN-EN 1990 (EQU) w M3/E9, E2, E6 — D29.** γQ = 1,50, γG,inf = 0,90 (Tablica A1.2(A), NB bez zmian — zweryfikowane wizualnie z PDF). E6: + pole „planowany balast” i twardy stop. **Do potwierdzenia przez właściciela (✅🤖):** pominięcie ciężaru własnego stelaża; balast w E6 z siły wzoru źródła.
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
- 🔲 (2026-09-26) **M6/E8 — głębokość czynna masy wg PN-EN ISO 13786** — czeka na normę od właściciela („potem ci normę dam”). Po dostarczeniu: pojemność tylko warstwy czynnej przy okresie dobowym, zdjąć/złagodzić `POJC-CALA-MASA-ZAWYZA`.
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
- 🔲 (2026-09-27) **Wykorzystać PN-EN ISO 14683 (mostki cieplne, pełny tekst) w kodzie M6.** Norma pozyskana i przeanalizowana, ale żaden kalkulator jeszcze jej nie używa. Cel: dodać/rozbudować Ψ (liniowy współczynnik przenikania ciepła) w ekranie mostków termicznych (`lib/core/modules/ogrzewanie/mostki-termiczne/`?) wg Tablicy A.2 (`docs/zrodla/norma-PN-EN-ISO-14683-1/00-INDEKS.md`) — sprawdzić najpierw obecny stan tego ekranu (może już ma własne wartości Ψ do zweryfikowania/skonfrontowania z normą, nie tylko dodania od zera).
- ✅ (2026-09-27) **4 kolejne pliki dodane do `docs/zrodla/` na polecenie właściciela:** SRPS HD 60364-4-443:2017 (pełny tekst, przeczytana w całości — **zamyka pozycję HD 60364-4-443 z listy brakujących**), artykuł PL o EN 62305 (Boryń/Olesz 2010, drugie źródło wtórne), whitepaper IEC 62109-1 (rozpoznany tylko po tytule, treść nieprzeczytana), poradnik ELEKTRA 12831 (duplikat treściowy poradnika Purmo, dodany jako kopia zapasowa). Piąty dostarczony plik (Poradnik Purmo 12831/01/2012) pominięty — identyczny duplikat pliku już w repo. Szczegóły: `docs/zrodla/README.md`, `docs/normy-brakujace.md`.
- 🔲 (2026-09-27) **Dokończyć odczyt whitepaper IEC 62109-1** (`docs/zrodla/norma-IEC-62109-1/`, 14 stron, natywny tekst) — tylko tytuł/metadane rozpoznane w tej sesji, pełna treść nieprzeczytana. Po odczycie: wyodrębnić wymagania o izolacji galwanicznej, ocenić trafność dla Modułu 5/8.
- 🔲 (2026-09-27) **Wykorzystać SRPS HD 60364-4-443 (wzór CRL, ocena ryzyka SPD) w M5/`ochrona-przepieciowa-spd`** — dziś ekran (wg wcześniejszych notatek) liczy margines napięciowy i próg uziemienia, ale nie liczy formalnie, czy instalacja SPD jest wymagana metodą CRL z 443.5. Norma i 4 przykłady liczbowe: `docs/zrodla/norma-HD-60364-4-443/00-INDEKS.md`.
- 🟡 **Wciąż brakujące normy (przypomnienie z `docs/normy-brakujace.md`, zaktualizowane 27.09.2026):** PN-EN 12831-1 (pełny tekst — mamy tylko 2 poradniki wydawców + PN-82/B-02403), IEC 62109-1 (mamy tylko whitepaper firmowy nieprzeczytany), IEC 61215, IEC 62619, EN 61439, pełna seria EN 62305 (mamy tylko 2 materiały wtórne: Furse + artykuł PL), HD 60364-5-551, PN-EN 62852, PN-EN 61427-1, PN-EN 50565-1, + 9 pozycji zgubionych przy konwersji PPTX→DOCX (numery #2,#6,#10,#13,#17,#27,#29,#33,#37 listy w `materialy-branzowe-PV-2019`). **HD 60364-4-443 usunięta z tej listy — pozyskana 27.09.2026.** Pełna lista ze statusami: `docs/normy-brakujace.md`.
- ✅ (2026-09-27) **Dodano `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/` na polecenie właściciela** — plik `.docx` "Bezpieczeństwo instalacji fotowoltaicznych" (dodatek Rynek Elektryczny nr 3/2019, egzemplarz ze szkolenia ZIAD Bielsko-Biała). **Wyłącznie dodany, treść NIE przeanalizowana** (jawne polecenie: inna sesja się tym zajmie).
- 🔲 (2026-09-27) **Sprawdzić `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/` — czy to inna edycja `materialy-branzowe-PV-2019/` z pełną (nieprzyciętą) listą norm.** Tytuł/wydawca identyczne z `materialy-branzowe-PV-2019/Bezpieczenstwo-instalacji-fotowoltaicznych-Rynek-Fotowoltaiczny-2019.docx`, w którym zgubiło się 9 pozycji listy norm (#2,#6,#10,#13,#17,#27,#29,#33,#37) przy konwersji PPTX→DOCX. Jeśli ten plik ma pełną listę — użyć go jako źródła prawdy dla tych 9 pozycji, zamiast zgadywać. Jeśli to inny materiał — pełna ekstrakcja/indeksacja wg wzorca innych plików w `docs/zrodla/`. Szczegóły: `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/00-INDEKS.md`.
- ✅ (2026-09-27) **OCR + analiza EN ISO 13786** (zamyka wpis 🔲 z 27.09 „OCR + analiza `docs/zrodla/norma-PN-EN-ISO-13786/`”): 27 stron, 100% skan; OCR dwoma przebiegami, odczyt wizualny wszystkich stron treści, oba przykłady Zał. D odtworzone w Pythonie. Wzory/tablice: `02-wzory-i-tablice-zweryfikowane.md`. Dwie niespójności samego oryginału oznaczone ⚠️ (literówka Z12 w D.1; wzór (26) vs Tablice D.1/D.4). **Norma odblokowuje M6/E8** — patrz wpis niżej.
- ✅ (2026-09-27) **Sprawdzenie `materialy-szkolenie-ZIAD-Bielsko-Biala/`** (zamyka wpis 🔲 z 27.09): plik **identyczny bajt-w-bajt** (MD5) z `materialy-branzowe-PV-2019/*.docx` — nie inna edycja. 9 „zgubionych” pozycji listy norm (#2, #6, #10, #13, #17, #27, #29, #33, #37) odzyskane z akapitów tego samego `.docx` (poprzednio czytano tylko tabele), potwierdzone wizualnie z PDF str. 8, wpisane do `materialy-branzowe-PV-2019/01-tresc.md`; sekcja ⚫ `docs/normy-brakujace.md` rozwiązana.
- ⚠️ (2026-09-27) **Do decyzji właściciela: duplikat ZIAD** — (A) usunąć `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/` (treść jest w `materialy-branzowe-PV-2019/`, oszczędza 22,5 MB w repo), (B) zostawić z odsyłaczem (stan obecny). → ✅ **Rozstrzygnięte 27.09.2026: wariant A** — folder usunięty; usunięty też niekompletny `.docx` z `materialy-branzowe-PV-2019/` (oryginał = pełny PDF, polecenie właściciela: „zostawić tylko ten pełny w pdf”).
- 🔲 (2026-09-27) **M6/E8 — głębokość czynna masy wg EN ISO 13786 Zał. A.2.4 — ODBLOKOWANE** (wpis 🔲 z 26.09 „czeka na normę od właściciela”): norma w repo i zweryfikowana. Reguła: dT = min(½ grubości elementu; grubość do pierwszej warstwy izolacyjnej; 100 mm dla 1 doby — Tablica A.1), κ = Σ ρ·d·c na dT, opcjonalnie (A.4) z oporem przejmowania; wynik z adnotacją „Załącznik A, przybliżenie” (A.1). Testy referencyjne: D.1 (240 → 97/197 kJ/(m²·K)), D.2/Tablica D.5. Potem zdjąć/złagodzić `POJC-CALA-MASA-ZAWYZA`. **Priorytet:** średni (bezpieczeństwo — czas do zamarznięcia dziś zawyżony). **Kolizje:** `lib/core/modules/ogrzewanie/pojemnosc-cieplna/`, słowniki i18n.
- ✅ (2026-09-27) **PDF „ZIAD” (oryginał, z którego robiono `.docx`)** — identyczny (MD5) z PDF w `materialy-branzowe-PV-2019/`, nie dodany drugi raz; tekst natywny, OCR zbędny. Pełny tekst → `materialy-branzowe-PV-2019/02-tresc-pelna-z-pdf.txt`. Porównanie z `.docx`: **żaden rozdział nie zginął**, zgubione tylko fragmenty ze str. 17, 18, 21 (podpisy rysunków, przypis, 2 myśli o odstępie separującym) — 2 merytoryczne dopisane do `01-tresc.md`. Szczegóły: `00-INDEKS.md` tego folderu.
- ✅ (2026-09-27) **Poprawki ekranów odblokowanych przez nowe normy** (zamyka trzy wpisy 🔲 z 27.09: „Wykorzystać PN-EN ISO 14683 w kodzie M6”, „Wykorzystać SRPS HD 60364-4-443 (CRL) w M5/`ochrona-przepieciowa-spd`”, „M6/E8 — głębokość czynna masy wg EN ISO 13786 — ODBLOKOWANE” oraz wpis 🔲 z 26.09 „M6/E8 … czeka na normę”): **M6/E7** — katalog Ψ z Tablicy A.2 (76 detali, 3 systemy wymiarów, testy z Zał. B); **M6/E8** — warstwa czynna wg Zał. A (dT ≤ 100 mm, A.4 z Rsi), czas do zamarznięcia w przykładzie testowym 26,1 h → 6,3 h; **M5/E2** — sekcja „Czy SPD jest wymagany” (443.4 + CRL, testy z 4 przykładów Zał. A) + narzędzie AI `ocen_wymog_spd_crl`. Szczegóły: `docs/memory.md` „Ekrany odblokowane przez normy z 27.09 (27.09.2026)”; uproszczenia: `dlug-techniczny.md` TD20, TD21.
- ⚠️ (2026-09-27) **Do potwierdzenia przez właściciela (✅🤖):** (1) M6/E8: Rsi = 0,13 m²·K/W przyjęte stale (EN ISO 13786 wzór (18) + przykład D.1, PN-EN ISO 14683 Tablica A.1 — samej PN-EN ISO 6946 brak w repo); (2) M6/E8: zdjęcie ostrzeżenia `POJC-CALA-MASA-ZAWYZA` i zastąpienie adnotacją `POJC-ZALACZNIK-A-PRZYBLIZENIE` (nadal 🟡); (3) M5/E2 CRL: obcinanie długości ponad 1 km od największej wagi (norma milczy); (4) M6/E7: opis detalu R11 (różnicy względem R5 nie da się jednoznacznie odczytać z rysunku — w aplikacji odsyłacz do rysunku normy). **Priorytet:** średni. **Kolizje:** bezkolizyjne.
- 🔲 (2026-09-27) **Wersja PL/EN HD 60364-4-443 — wyjątek ekonomiczny 443.4 dla mieszkań** (TD21): tekst serbski „instalacja pięć razy tańsza od SPD” vs streszczenie „< 5 × wartość SPD”. Bez wersji PL/EN nie wdrażać. **Priorytet:** niski (off-grid: instalacja zawsze warta wielokrotność SPD). **Odblokowuje:** pełne 443.4. Potem ew. Tablica 443.2 (kategorie przepięć, U_W) w M5.
- ✅ (2026-09-27) **M12/E32 „Ile dni pracy bez słońca — mały zestaw”** — zbudowany jako echo M4/E1 (`obliczDniAutonomiiZPojemnosci`), 8+2 testy, narzędzie AI, PL/EN/RU, kafel. M12: 3/43. Szczegóły: `docs/memory.md` („Przegląd niedokończonych sekcji + M12/E32”).
- ⚠️ (2026-09-27) **M12/E41 „Czy mój przedłużacz wytrzyma?” — zablokowany** (sprawdzony przy starcie budowy): obciążalność przewodów giętkich 0,75/1,0/1,5 mm² nie jest w PN-HD 60364-5-52; potrzebna norma z `docs/normy-brakujace.md` (PN-EN 50565-1/-2 — HIPOTEZA, gdzie są tablice). **Priorytet:** niski. **Odblokowuje:** E41 (🔴 z listy twardych stopów źródła). **Plusy/minusy teraz:** bez normy się nie da (Dyrektywa #1). **Kolizje:** bezkolizyjne. **Kolejność:** po dostarczeniu normy przez właściciela.
- 🔲 (2026-09-27) **Moduł 12 — ekrany budowalne bez właściciela (triaż źródła `Tresc_Modul_12`, 27.09).** Kolejność proponowana (od najpewniejszych): **E9** LVD (progi 11,5 V AGM / 11,0 V LiFePO4 dla 12 V są w źródle, 🔴 opisany) · **E27** urządzenie 12 V wprost (zakres 11–14,5 V w źródle, 🔴 tolerancja urządzenia od usera) · **E39** panel → stacja zasilania (Voc vs max wejścia, 🔴; echo Voc w mrozie z M3) · **E11** zużycie per urządzenie (moc × czas × współczynnik pracy od usera; przykład 45 W × 24 h × 40% = 432 Wh) · **E30** gniazdo zapalniczki (prąd bezpiecznika od usera, źródło daje tylko zakres 10–15 A) · **E42** odsyłacz do M11/A9 i B11 · **E22/E36** checklisty (pozycje w źródle) · **E2/E15** echo M5/E1 + M5/E6. **Wymagają danych/decyzji właściciela:** E26 (margines dla sprzętu medycznego — źródło nie podaje liczby), E33 (tabela napięcie spoczynkowe → stan, brak w źródle M12), E37 (progi), E3/E5/E12/E13 (baza typowych mocy urządzeń). **Zależne od niezbudowanych ekranów:** E35 (M7/E2), E14 (raport — na końcu). **Priorytet:** średni (M12 = największa luka liczbowo: 3/43). **Odblokowuje:** kompletność M12, pulpit „Szybki kalkulator”. **Plusy teraz:** małe, samodzielne partie, wzory w źródle lub echo gotowych silników; **minusy:** niska wartość per ekran względem M6/M7 dla głównego off-gridu. **Kolizje:** `lib/i18n/dictionary-*.ts`, `lib/pulpit/registry.ts`, `lib/ai/pytaj-asystenta.ts`, `scripts/check-i18n-guard.mjs` — wspólne dla każdej sesji budującej ekrany (dopisywać, nie przestawiać). **Kolejność:** jeden ekran = jedna partia + commit (Dyrektywa #14).
- 🔲 (2026-09-27) **Przegląd niedokończonych sekcji — stan 27.09 (dla kolejnych sesji).** Łącznie 156/314 ekranów `done`. Największe luki: **M12** 3/43 (wpis wyżej), **M6** 14/48 — Część 2 to w większości tematy „pełna treść tylko w Biblii” (2C) i scalony silnik 2D „wpływ czynnika X” (29 pozycji, jeden silnik); **M7** 2/26 — większość zależy od modelu M1–M6, samodzielni kandydaci: E4 Blackout, E13 sztywnienie izolacji, E19 elektronika w mrozie, E23 śnieg na dachu (norma PN-EN 1991-1-3 w repo); **M10** 1/12, **M9** 1/10, **M8** 3/11 — Wzorce D bez ocenionej budowalności; **M13** — czeka na telemetrię. **Priorytet:** średni (orientacja). **Odblokowuje:** planowanie kolejnych sesji bez eksploracji. **Kolizje:** bezkolizyjne (tylko dokumentacja). **Kolejność:** przed wyborem kolejnego modułu przeczytać ten wpis i `mapa-wdrozenia.md`.
- ✅ (2026-09-27) **M12/E9 „Ochrona przed rozładowaniem” (dozownik LVD)** — z listy triażu M12 wyżej (pierwszy w kolejności). M12: 4/43. Następne wg triażu: E27, E39, E11, E30, E42, E22/E36, E2/E15.
- ✅ (2026-09-27) **Pakiet 2 M12** (z triażu wyżej): E27 urządzenie 12 V wprost, E39 panel → stacja zasilania (echo M3/E5), E11 zużycie per urządzenie (częściowo — bez bazy urządzeń), E30 gniazdo zapalniczki, E42 odsyłacz ratowania do M11, E22 kamper i E36 garaż (checklisty wg chemii). M12: 11/43, łącznie 164/314. Zostaje z triażu: **E2/E15** (echo M5/E1 + M5/E6) — następny pakiet.
- ⚠️ (2026-09-27) **Do decyzji właściciela (pakiet 2 M12):** (1) E27 — górna granica napięcia akumulatora 12 V przy ładowaniu: `Tresc` 14,5 V (użyte) vs Biblia §12.42 14,6 V; (2) E22/E36 — alert Biblii o wodorze (ołowiowy bez wentylacji) wdrożony jako 🟡, czy podnieść do 🔴? (3) E11 — czy budować bazę typowych mocy urządzeń (źródło podaje tylko nazwy; potrzebne dane). **Priorytet:** niski/średni. **Odblokowuje:** ewentualną korektę progów/poziomów. **Kolizje:** bezkolizyjne. **Kolejność:** dowolna.
- ✅ (2026-09-27) **Pakiet 3 M12: E2 + E15** (kabel i bezpiecznik małej instalacji / kampera) — echo M5/E1 + M5/E6 + pierwsze użycie PN-IEC 60364-4-43 (433.2, IB ≤ In ≤ Iz). Oba częściowo (bez bazy bezpieczników/złączek — źródło podaje tylko nazwy). M12: 13/43, łącznie 166/314. **Triaż budowalnych ekranów M12 wyczerpany.**
- 🔲 (2026-09-27) **M12 — kolejna runda triażu: ekrany „uproszczona wersja Modułu X”** (echo gotowych silników): E23 (M4/E10 kondensacja + IP), E28 (M4/E12 Cold C-Rate), E31 (M2/E13 bufor rozbudowy), E38 (M5/E9/E11 uziemienie), E19 (M3/E2 pakowanie paneli), E6 (PVGIS z M1), E8 (przetwornice — tryb 12 V→230 V echo M5/E7), E20/E17/E18/E7/E34 (Wzorzec B — porównania). Przed budową każdego: sprawdzić, czy silnik-źródło istnieje i czy przykład źródła się odtwarza. **Priorytet:** średni. **Odblokowuje:** dalsze pokrycie M12. **Plusy teraz:** echo gotowych silników, niskie ryzyko; **minusy:** część to Wzorzec B bez liczb. **Kolizje:** wspólne pliki słowników/pulpitu/narzędzi AI (tylko dopisy). **Kolejność:** jeden ekran = jedna partia + commit.
- ⚠️ (2026-09-27) **Do decyzji właściciela przed kolejną rundą M12:** ekrany „uproszczona wersja Modułu X” bywają w praktyce kopią istniejącego ekranu — np. E28 (← M4/E12 Cold C-Rate, który ma już tylko 2 pola: temperatura ogniwa i pojemność). Opcje: (A) osobny ekran M12 jako cienki wrapper silnika M4 (duplikat wejścia na pulpicie), (B) odsyłacz jak E42 (jeden ekran, dwa wejścia), (C) pominąć i oznaczyć jako pokryte przez M4. Dotyczy też E31 (← M2/E13 bufor 0–30% + „ile się zmieści” — bez danych przestrzennych), E23, E38. **Priorytet:** średni. **Odblokowuje:** rundę triażu z wpisu wyżej. **Kolizje:** bezkolizyjne. **Kolejność:** decyzja przed budową.
- ✅ (2026-09-27) **M7/E23 „Obciążenie dachu śniegiem”** (samodzielny kandydat M7 z przeglądu 27.09) — PN-EN 1991-1-3 + Załącznik krajowy NB w całości z repo: sk (NB.1, 5 stref), μ1 (Tablica 5.2), Ce (5.1), Ct = 1,0, γ śniegu (E.1). 🔴 obciążenie normowe lub zmierzona warstwa > nośność dachu od usera. M7: 3/26, łącznie 167/314. Szczegóły: `docs/memory.md` „M7/E23”.
- ⚠️ (2026-09-27) **Do decyzji właściciela — M7/E23 próg „zbliżania się do nośności”.** Źródło: 🔴 przy obciążeniu „zbliżającym się lub przekraczającym” nośność, ale bez liczby (przykład źródła: 120 z 150 kg/m² = 80% → „Zbliżasz się do granicy!”, to ilustracja, nie reguła). Dziś: 🔴 tylko przy przekroczeniu + wykorzystanie w %. Opcje: (A) zostawić tak, (B) 🟡 od progu X% podanego przez właściciela. **Priorytet:** niski. **Odblokowuje:** pełne pokrycie 🔴 ze źródła. **Kolizje:** bezkolizyjne. **Kolejność:** dowolna.
- ⚠️ (2026-09-27) **Do decyzji właściciela — M7/E19 zbiór urządzeń krytycznych (🔴).** Źródło nazywa 🔴 tylko BMS („nie wystartuje”); wyświetlacz/czujnik/przetwornica mają opis skutku bez 🔴. Dziś: 🔴 BMS, reszta 🟡. Opcje: (A) zostawić 1:1 ze źródłem, (B) dodać 🔴 dla przetwornicy/falownika i regulatora ładowania (brak startu = brak zasilania). **Priorytet:** niski. **Odblokowuje:** —. **Kolizje:** bezkolizyjne. **Kolejność:** dowolna.
- ⚠️ (2026-09-28) **Do decyzji właściciela — M7/E8 próg parafinizacji zwykłego diesla (konflikt w źródle).** (A) Sekcja B: „parafinizacja diesla przy −20°C”. (B) Przykład C: „na zwykłym dieslu nie wystartuje przy −15°C”. Konsekwencja: przy A ostrzeżenie pojawi się dopiero od −20°C (ryzyko przeoczenia między −15 a −20), przy B — od −15°C. Dziś: tylko info przy każdej temperaturze < 0°C, bez poziomu 🟡/🔴. Do ustalenia też poziom (🟡 czy 🔴). **Priorytet:** średni. **Odblokowuje:** pełny rozruch w M7/E8. **Kolizje:** bezkolizyjne. **Kolejność:** dowolna.
- 🔲 (2026-09-27) **M7 — kolejni samodzielni kandydaci** z przeglądu: E4 Blackout (bliski M2/E17 agregat), E13 sztywnienie izolacji (tabela materiałowa — sprawdzić, czy jest w źródle), E19 elektronika w mrozie. Przed budową każdego: czy liczby są w źródle/normie w repo (Dyrektywa #1). **Priorytet:** średni. **Kolizje:** słowniki i18n, `lib/pulpit/registry.ts`, `lib/ai/pytaj-asystenta.ts` (tylko dopisy). **Kolejność:** jeden ekran = jedna partia.

- ✅ (2026-09-28) **M8 — blok 1: E1 awaryjne źródło ciepła (częściowo), E3 zamki drzwi ewakuacyjnych, E4 moduł gaśniczy (częściowo).** M8: 6/11, łącznie 176/314. Szczegóły: `docs/memory.md` „M8 blok 1 (28.09.2026)”. Zostają w M8: E5 (centrala SSP), E7 (oświetlenie awaryjne), E8 (klapy), E10 (syrena/służby) — logika konfiguracyjna, budowalne; E6-AI (priorytety UPS) i E9 (predykcja — telemetria M13) zależne.
- ⚠️ (2026-09-28) **Do potwierdzenia przez właściciela (✅🤖, M8 blok 1):** (1) E3 — zamek fail-secure **z** zasilaniem awaryjnym: dziś 🟡 (🔴 źródło wiąże tylko z brakiem zasilania awaryjnego; sekcja D mówi „nigdy odwrotnie”) — czy podnieść do 🔴? (2) E4 — gaz obojętny / aerozol w strefie LiFePO4: dziś 🟡 (źródło wymaga mgły wodnej lub środka do magazynów energii, ale wprost wyklucza tylko proszek i CO2) — czy 🔴? (3) E4 — minimum 2 czujników potwierdzenia (źródło: „np. dwa”) przyjęte jako próg 🟡. **Priorytet:** średni (bezpieczeństwo życia). **Kolizje:** bezkolizyjne. **Kolejność:** dowolna.
