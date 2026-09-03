# docs/lista-do-zrobienia.md — Inżynier Offgrid Pro

Bieżąca, operacyjna lista zadań tego projektu. Format i zasada aktualizacji: `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_3.md`, Część B.6. Ten projekt nie ma (jeszcze) pełnej Biblii w formacie GOD BOOK (`00_Biblia.md`) — czytaj tę listę zaraz po `docs/memory.md`, na starcie każdej sesji, żeby AI nie musiało eksplorować całego projektu od nowa, żeby wiedzieć, od czego zacząć.

**To nie to samo, co:**
- `backlog-poza-v1.md` — rzeczy świadomie odłożone poza zakres (decyzje o skali/fazowaniu produktu, zbierane przy audycie).
- `mapa-wdrozenia.md` — status per moduł (M#), granularny, podczas Wdrożenia.

Tu trafia bieżący stan pracy: co w trakcie, co zablokowane, co następne — aktualizowane na bieżąco, nie tylko przy audycie.

**Statusy:** 🔲 do zrobienia · 🔄 w trakcie · ✅ zrobione · ⏳ odłożone (z powodem) · ⚠️ zablokowane (czeka na decyzję/informację)

**Zasada aktualizacji:** nie usuwamy wpisów (Część D GOD BOOK). Zmiana statusu = dopisanie nowej daty i statusu obok starego, nie kasowanie.

---

## Zadania

- ✅ (2026-09-03) Synchronizacja pakietu `new-app-standards`: rozdziały 00–16 odświeżone, dodano `docs/god-book/`, `PROMPT_STARTOWY.md`, ten plik i `docs/wklad-do-standardu.md`. Szczegóły: `docs/memory.md`, sekcja "Synchronizacja ze standardem".
- ⚠️ (2026-09-03) Do decyzji: czy migrować `ZASADY_APLIKACJI.md`/`USTALENIA.md`/`docs/domena/` do kanonicznego formatu GOD BOOK (`00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`, `rejestr-decyzji.md`...), czy zostać przy obecnej strukturze, która pełni tę samą rolę. Nie rozstrzygnięte — czeka na właściciela projektu, patrz GOD BOOK Część P/S.
- 🔲 Kontynuacja kafli pulpitu 08–14 (animowane ikony) — patrz artefakt roboczy "Off-Grid Tile Set" i `docs/memory.md`.
- 🔲 Kontynuacja Modułu 2 wg `docs/rejestr-pokrycia.md` (ekrany jeszcze nie zbudowane).
- ✅ (2026-09-03) Audyt zgodności apki ze standardem (17 rozdziałów) wykonany, 3 znalezione niezgodności naprawione: Reporter spięty w `lib/pulpit/storage.ts`/`lib/wyglad/storage.ts`/`lib/theme/storage.ts`, dodano `docs/rejestr-twardych-stopow.md` (04.3), doprecyzowano status `lib/adapters/storage-adapter.ts`. Szczegóły: `docs/memory.md`.
- ⏳ (2026-09-03) `StorageAdapter` (`lib/adapters/storage-adapter.ts`) zostaje bez implementacji (IndexedDB) do czasu pierwszej realnej funkcji zapisującej Seed projektu (np. "zapisz projekt") — budowanie jej teraz byłoby spekulacyjne, apka nie ma jeszcze żadnego stanu domenowego do trwałego zapisu.
- ⚠️ (2026-09-03) Do decyzji: `KROK-POZA-KOLEJNOSCIA` w procedurze Black Start (M7/E5) ma poziom `warning`, mimo że opisuje realne ryzyko uszkodzenia sprzętu przy złej kolejności rozruchu — czy podnieść do `critical`? Patrz `docs/rejestr-twardych-stopow.md`, sekcja "Znane luki".
- ✅ (2026-09-03) Ekran A1, Moduł 11 (Montaż baterii) — "Weryfikacja kompletności i kontrola wstępna ogniw" zaimplementowany. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-03) Ekran A3, Moduł 11 — "Połączenia elektryczne i kolejność łączenia" zaimplementowany (ten sam wzorzec co Procedura Black Start).
- ✅ (2026-09-03) Ekran A4, Moduł 11 — "Podłączenie BMS" (+ procedura pre-charge, realny wzór `T = 5×R_pre×C`) zaimplementowany.
- ✅ (2026-09-03) Ekran A6, Moduł 11 — "Demontaż pakietu" zaimplementowany (checklist z wymuszoną kolejnością + kontrola napięcia ogniwa <3,2V przed demontażem).
- ✅ (2026-09-03) Ekran A9, Moduł 11 — "Ratowanie głęboko rozładowanego ogniwa" zaimplementowany (Wzorzec D, 3 strefy decyzyjne z napięcia: 0V/niskie-niezerowe/bezpieczne).
- ✅ (2026-09-03) Ekran A8, Moduł 11 — "Ocena zużycia ogniwa po demontażu" zaimplementowany (ocena wizualna puchnięcia + checklist 3 pomiarów bez progu liczbowego w źródle).
- ✅ (2026-09-03) Ekran A10, Moduł 11 — "Przechowywanie / recykling / narzędzia diagnostyczne" (Wzorzec C) zaimplementowany. Bez kalkulatora — 3 akordeony treści 1:1 ze źródła.
- 🔲 **Termin: piątek 2026-09-04 20:00 — maksymalna liczba rozdziałów.** Moduł 11, Ścieżka A: **kompletna** (A1/A3/A4/A6/A7/A8/A9/A10 — 8/10, A2/A5 świadomie odłożone). Dalej: cała Ścieżka B (kwasowo-ołowiowa, B1–B12) — todo, albo A2/A5, albo inny moduł. Pełna lista: `docs/rejestr-pokrycia.md`, sekcja "Moduł 11".
