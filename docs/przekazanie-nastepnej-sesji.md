# Przekazanie dla następnej sesji — co dalej (28.09.2026)

**Wersja:** 1.0 | **Utworzono:** 28.09.2026 | **Status:** aktualne, dopóki kolejna sesja nie odhaczy kroków

Polecenie właściciela z 28.09.2026: sesja, która kończy się tym wpisem, **nie pisze kodu M14**. Zostawia
instrukcje, a kod pisze następna sesja. Ten plik mówi: od czego zacząć, co jest otwarte, jaki kod
powstaje i w jakiej kolejności. Nie zastępuje Biblii — każdy krok odsyła do miejsca, gdzie leży pełna treść.

**Czytaj najpierw (Y.4):** ten plik → `docs/lista-do-zrobienia.md` (końcówka, wpisy z 28.09) →
`03_M14_Dom_i_Firma_Siec.md` → `rejestr-decyzji.md` D35–D46. Nie czytaj całej `docs/memory.md` od nowa —
wystarczą sekcje z 28.09.2026 („Integracja M14 do Biblii”, „Audyt końcowy N.3…”, „Audyt N.3 — decyzje 1–3…”).

---

## Stan na koniec sesji

- Audyt końcowy N.3 całej Biblii jest **wykonany**. Decyzje 1–3 właściciela są zapisane i zrobione:
  - D44 — szczegół przełącznika w M14/D11;
  - D45 — blok bezpieczeństwa agregatu, już w kodzie M2/E17 i M7/E8;
  - D46 — szkic LED jest kandydatem poza Biblią.
- **Otwarta jest tylko decyzja 4:** 12 pozycji ✅🤖 do potwierdzenia (lista niżej). Do czasu odpowiedzi
  **bramka N.3 trzyma kod M14.**
- Ostatni commit z pracą: `09af18f` (gałąź `claude/nowy-rozdzial-biblia-kalkulator-to73by`, potem PR i merge).
- CI nie działa do 1.10.2026 (`CLAUDE.md`) — przed merge uruchom lokalnie pełny pakiet:
  `pnpm typecheck`, `lint`, `check:i18n-guard`, `test`, `build`, `audit:gate`, `audit:n1`.

---

## Krok 0 — odpowiedź właściciela na decyzję 4 (zanim powstanie jakikolwiek kod M14)

Wyjaśnienie z opcjami dostał właściciel 28.09.2026. Jeśli nie odpowiedział, zapytaj go jeszcze raz,
krótko, tą samą listą. Opcja **A** = zostaw, jak jest (nic w kodzie). Przy **B/C** — zmiana we wskazanym miejscu.

| # | Sprawa | Gdzie jest kod / zapis | Co zmienić przy B/C |
|---|---|---|---|
| 1 | Balast M3 (D29 pkt 2 i 5): bez ciężaru paneli i stelaża; E6 z siły wzoru źródła | `lib/core/modules/pv/eurokod-0/rownowaga.ts`, ekran M3/E6 | B: pole „ciężar paneli + stelaża” i odjęcie go (γG,inf = 0,90) po stronie stabilizującej; C: usunąć balast z E6 (adnotacja, nie kasacja — F.5) |
| 2 | Agregat w mrozie (D32): 🟡/🔴/ℹ️ i werdykt z samego paliwa i temperatury | `lib/core/modules/stress-test/agregat-w-mrozie/` (`warnings.ts`, `calculator.ts`) | B: zmiana `level` w `warnings.ts` wg odpowiedzi + testy |
| 3 | Lista 16 urządzeń (D33) | `lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/przykladowe-urzadzenia.ts` | B: dopisać lub poprawić pozycje podane przez właściciela |
| 4 | CRL: długość > 1 km obcinana od największej wagi (TD21) | `lib/core/modules/okablowanie/ocena-ryzyka-crl/calculator.ts` | B: sortowanie odcinków rosnąco po wadze zamiast malejąco + test |
| 5 | Rsi = 0,13 (M6/E8, TD20) | `lib/core/modules/ogrzewanie/pojemnosc-cieplna/constants.ts` | B: czeka na normę ISO 6946 od właściciela |
| 6 | Zamki fail-secure z UPS = 🟡 (M8/E3) | `lib/core/modules/bezpieczenstwo/zamki-drzwi-ewakuacyjnych/` | B: 🔴 + dopis w `docs/rejestr-twardych-stopow.md` |
| 7 | Gaz obojętny/aerozol przy LiFePO4 = 🟡 (M8/E4) | `lib/core/modules/bezpieczenstwo/modul-gasniczy/` | B: ℹ️; C: 🔴 + rejestr stopów |
| 8 | Magistrala ponad wejście przetwornicy = 🔴 (M9/E2) | `lib/core/modules/esp32/zasilanie-esp32/` | B: 🟡 + usunięcie z rejestru stopów (przekreślenie, F.5) |
| 9 | CAN bez transceivera = 🟡 (M9/E4) | `lib/core/modules/esp32/architektura-komunikacji/` | B: 🔴 jak RS485 + rejestr stopów |
| 10 | Kafle M14 ukryte w 8 presetach | `docs/pulpit-i-nawigacja.md` §3 (kafli M14 jeszcze nie ma w `lib/pulpit/`) | B: zapisać, w których presetach są widoczne — wejdzie razem z kaflami |
| 11 | D45: agregat przez wejście AC falownika = ℹ️, bez wymogu przełącznika | `lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo.ts` | B: `agregatWejscieFalownika` → poziom `critical` albo `warning` wg odpowiedzi, teksty PL/EN/RU |
| 12 | D45: odbiorniki wpięte wprost w agregat = ℹ️ | ten sam plik | B: jak wyżej, `agregatTylkoOdbiorniki` |

Po odpowiedzi: przy każdej pozycji w kodzie i rejestrach zamień „✅🤖” na adnotację
„**[data] potwierdzone przez właściciela (A)**” albo opis zmiany (F.5 — nie kasuj starego tekstu).

## Krok 1 — zamknięcie audytu N.3

1. Dopisz wynik w `docs/memory.md` (sekcja „Audyt końcowy N.3”): „zamknięty [data]”.
2. `docs/lista-do-zrobienia.md`: wpis ⚠️ „Audyt końcowy N.3” → ✅ z datą.
3. `00_Biblia.md`: wiersz w logu + bump wersji (C.5).
4. `03_M14_Dom_i_Firma_Siec.md`, „Stan i bramki”: bramka N.3 → **zdjęta [data]**; nagłówek „kod zablokowany
   bramką N.3” → adnotacja; bump wersji i wiersz w logu.
5. Zatwierdź commitem **przed** pierwszą linijką kodu M14.

## Krok 2 — kod M14, w tej kolejności

Zasady wspólne: pełny wzorzec modułu jak w reszcie `lib/core/modules/` (input / validation / calculator /
warnings / constants / `__tests__`), `CalcResult` z `lib/core/calc-result.ts`, teksty przez i18n (PL/EN/RU,
`pnpm check:i18n-guard`), narzędzie AI w `lib/ai/tools/` (`operationType: 'read'`), UI w
`app/kalkulatory/<ekran>/page.tsx` z `usePersistedDraft`. **Uwaga na pułapkę:** `usePersistedDraft` nie
scala starego szkicu z `poczatkowy` — nowe pole w starym szkicu ma `undefined` (`docs/memory.md`, 28.09).
Nowy moduł M14 tego problemu nie ma, ale każde późniejsze dodanie pola już tak.

**2a. Plik danych `rozliczenia-pl-2026` (D36)** — fundament części Sieć.
- JSON + schemat Zod. Każda stawka: lista okresów `{ odDnia, doDnia, wartosc }` oraz `zrodlo`, `stanNa`,
  `pewnosc`. Miejsce: nowy katalog danych obok jądra (np. `lib/core/dane/rozliczenia-pl-2026/`) —
  jądro czyta, UI nie importuje JSON bezpośrednio. Zapisz wybór ścieżki w `kontrakty-rdzenia.md`.
- Wartości domyślne **wyłącznie ✅** (rozdział M14 §2 i tabele w
  `docs/zrodla/Opracowanie_M14_Z_Sieci_Na_OffGrid_DRAFT.md`): Tauron, Energa, Stoen netto, stawki
  ogólnokrajowe. Pozostałe OSD (PGE, Enea) — puste, tryb „moje dane z faktury” (lista braków: M14,
  „Otwarte — wymaga danych zewnętrznych”). **Nie wpisuj niczego z pamięci.**
- Te same zasady dla π (inflacja): GUS 15 lat 3,58% domyślnie (D43), NBP 2,5% do wyboru; ścieżka UE
  z EU Reference Scenario 2020 (D40, nachylenia 1,65% i 0,44%).
- Testy: przykład kontrolny TCO (75 000 → ≈ 81 444 / ≈ 100 143 / ≈ 109 699 zł), walidacja schematu,
  ostrzeżenie po `waznoscDo`.

**2b. Część Sieć, Dom** — D1 „Mój rachunek dziś”, D2 „Która taryfa G”, D3 „Moje zużycie” (echo M2),
D8 prosument, D12 test licznika i reklamacja. Wzory: M14 §1–§3, §8. Przykłady kontrolne: M14
„Przykład” (test diody 0,9 kW, depozyt 1 107 zł).

**2c. Część Sieć, Firma** — F1–F5 (rachunek C, taryfy C, moc bierna z √ — K1, test czynnika 0,0381;
moc umowna; opłata mocowa +55,3%). `C_rk` jest 🔎 — pole użytkownika, bez domyślnej.

**2d. Silnik TCO i ekran D7/F8 „Scenariusze A–D”** — wzór M14 §4 (TCO_s(N)), przełącznik „Suwak % /
Plany UE / Plany UE + inflacja” w miejscu suwaka (D42), `N` = 15 (10–25), `r` = 0, `g` = 0 (D40).

**2e. Część Przejście** — D4 (echo M3/M4), D5 zima (echo M7 — **wymaga M7 7.2 i 7.37, oba `todo`**; bez
nich warunek zimowy scenariusza D liczony tylko wg alternatywy w `docs/rejestr-pokrycia.md` D5/D7/F8),
D6 agregat (**użyj istniejącego `bezpieczenstwo.ts`** z M2/E17, nie pisz drugiej wersji), D9 ryzyka,
D10 procedura, D11 przełącznik (twarde stopy: backfeed; szczegół normowy 🔎 HD 60364-5-551, D44).

**2f. Kafle i pulpit** — dwa duże kafle „Dom – sieć” / „Firma – sieć” za kaflem 13 (D39), ukryte w 8
presetach (albo wg odpowiedzi na pozycję 10), kreator „Ścieżka przejścia” (Wzorzec F).

Każdy ekran: wiersz w `docs/rejestr-pokrycia.md` (sekcja M14) todo → done, twarde stopy w
`docs/rejestr-twardych-stopow.md` (sekcja M14 — dopisać ścieżkę `warnings.ts` i kod), `mapa-wdrozenia.md`.

## Czego nie robić

- Nie zaczynaj M14 bez kroku 0 i 1.
- Nie proponuj wartości stawek, `C_rk`, profili W4 ani norm z pamięci — brakujące dane dostarcza właściciel
  (PGE i NFOŚiGW mają zepsuty łańcuch TLS; obejście certyfikatów było odrzucone, nie próbuj).
- FREE/PRO dla M14 nie jest przypisane (D37) — nie wprowadzaj podziału.
- Szkic LED (D46) nie jest częścią tej pracy.

## Stałe sprawy w tle

- Cykl Y.6 (sprawdzenie `AKTUALIZACJE.md` w `new-app-standards`) — następne ok. 29.09.2026 (`docs/memory.md`).
- Od 1.10.2026 wraca CI — usuń notę z `CLAUDE.md`.
- Wpis w `docs/wklad-do-standardu.md` z 28.09 (autozapis szkicu) — czeka na sesję nad standardem.
