# Przekazanie dla następnej sesji — co dalej (28.09.2026)

**Wersja:** 1.5 | **Utworzono:** 28.09.2026 | **Aktualizacja:** 28.09.2026 (cały rozdział M14 zbudowany) | **Status:** aktualne, dopóki kolejna sesja nie odhaczy kroków

Polecenie właściciela z 28.09.2026: sesja, która kończy się tym wpisem, **nie pisze kodu M14**. Zostawia
instrukcje, a kod pisze następna sesja. Ten plik mówi: od czego zacząć, co jest otwarte, jaki kod
powstaje i w jakiej kolejności. Nie zastępuje Biblii — każdy krok odsyła do miejsca, gdzie leży pełna treść.

## ▶ STAN NA TERAZ (28.09.2026, D50) — przeczytaj tę sekcję, reszta pliku to historia

Polecenie właściciela: „Zostaw pytania na potem. Napisz co jest do zrobienia i na czym stanęło w Biblii, żeby inna
sesja mogła już działać z tym rozdziałem”. **Następna sesja może od razu pisać kod M14. Nie pytaj właściciela o
odłożone pozycje (lista niżej), dopóki sam do nich nie wróci.**

### Na czym stanęło w Biblii

| Element | Stan |
|---|---|
| Rozdział `03_M14_Dom_i_Firma_Siec.md` | **v1.6, kompletny, kod odblokowany (D50).** Wzory §1–§9, wejście, walidacja, twarde stopy, przykłady kontrolne, plan ekranów D1–D14 / F1–F13 plus kreator |
| Decyzje M14 | D35–D43 (zakres, dane, FREE/PRO odłożone, profile, kafle, TCO, ścieżki cen, inflacja), D47 (przełącznik w D11), D50 (odblokowanie) — `rejestr-decyzji.md` |
| Audyt końcowy N.3 | wykonany; decyzje 1–3 wdrożone (D47–D49); decyzja 4: część zamknięta, reszta **odłożona** (D50) |
| Bezpieczeństwo agregatu | **gotowe w kodzie:** `lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo.ts` (D48), M2/E17 1.1.0, M7/E8 1.3.0 — ekran D6 M14 ma go użyć, nie pisać drugi raz |
| Kod M14 | ~~**nic jeszcze nie istnieje**~~ **[28.09.2026]** plik danych `lib/core/dane/rozliczenia-pl-2026`, silniki `lib/core/modules/siec/` (rachunek, porównanie taryf, depozyt, test licznika, moc bierna, moc umowna, opłata mocowa, ścieżka cen), ekrany D1, D2, D8, D12/F11, F1–F5, 2 kafle w pulpicie, 3 narzędzia AI. Ograniczenia: TD22. **[28.09.2026] Rozdział zbudowany w całości:** wszystkie ekrany D1–D14, F1–F13, kreator `/kalkulatory/sciezka-przejscia`, 5 narzędzi AI, silniki `bilans-miesieczny`, `scenariusze-przejscia`, `przelacznik-siec-wyspa`, `koszt-powrotu`, `strumienie-bess`, plik `lib/core/dane/dotacje`. Ograniczenia: TD22, TD23 |
| Bramka danych DANE-1 | **obowiązuje:** domyślne tylko wartości ✅ (Tauron, Energa, Stoen netto, stawki ogólnokrajowe); reszta = tryb „moje dane z faktury” |
| Dane, których brakuje (dostarcza właściciel) | PDF PGE, PDF regulaminu PME (NFOŚiGW), odczyt skanu Enea netto, Stoen C22a/b, profile W4, `C_rk`, opłaty przyłączeniowe IV–VI, 495,16 zł/MWh — lista: M14 „Otwarte — wymaga danych zewnętrznych” |
| FREE/PRO dla M14 | nieprzypisane (D37) — nie wprowadzaj podziału |

### Co jest do zrobienia — w tej kolejności

1. ~~**Plik danych `rozliczenia-pl-2026`** (Krok 2a niżej) — JSON + Zod, tylko wartości ✅, testy przykładu TCO.~~ **✅ 28.09.2026** (przykład TCO w testach silnika `siec/sciezka-cen-energii`; ścieżka zapisana w `kontrakty-rdzenia.md` §9).
2. **Część Sieć, Dom:** ~~D1 rachunek, D2 taryfa G,~~ D3 zużycie, ~~D8 prosument, D12 licznik~~ (Krok 2b). **✅ 28.09.2026 poza D3** (D3 = pole zużycia miesięcznego, silnik rachunku już je obsługuje — TD22 pkt 3). Zostają też artykuły D13, D14.
3. **Część Sieć, Firma:** ~~F1–F5~~ (Krok 2c). **✅ 28.09.2026.** Zostają F6, F7 (echo M3/M4), F12, F13.
4. **Silnik TCO i scenariusze A–D** (D7/F8, Krok 2d). **Następny krok.** Pole „Wzrost cen energii” ma już silnik: `mnoznikCenyEnergii` / `mnoznikKosztowBiezacych` w `lib/core/modules/siec/sciezka-cen-energii/calculator.ts` — TCO ma go użyć (echo), nie liczyć drugi raz. Uwaga: ścieżka UE od 2026 z N = 25 wychodzi poza 2050 → `OUT_OF_SCOPE` (bez ekstrapolacji) — rozważyć, czy UI ogranicza N przy tej ścieżce.
5. **Część Przejście:** D4–D6, D9–D11 (Krok 2e). D5 czeka na M7 7.2 i 7.37 albo na liczenie zimy w M14 z PVGIS.
6. **Kafle, pulpit, kreator** (Krok 2f) — kafle domyślnie ukryte w 8 presetach (✅🤖, pytanie odłożone). **[28.09.2026]** Kafle są już w `lib/pulpit/registry.ts` (id 15/16, na końcu); zostaje: „duży” wygląd, animowana ikona, presety (nie istnieją jeszcze w kodzie), kreator.
**[28.09.2026] Punkty 2–6 zrobione** (D3 = `/kalkulatory/zuzycie-miesieczne`, zasila D1 — TD22 pkt 3 zamknięty; D5 liczy
bilans wyspy miesięcznie i odsyła do M7 — TD23; UI ścieżki UE przy N = 25 pokazuje `OUT_OF_SCOPE` z silnika, bez ekstrapolacji).
**Co zostaje po M14 (wszystko czeka na dane albo decyzje właściciela, nie na kod):** lista „Otwarte — wymaga danych
zewnętrznych” w 03_M14 (PGE, Enea, Stoen C22, W4, W6 → linki regulaminów w `lib/core/dane/dotacje`, `C_rk`, stawki
przyłączeniowe); „duży” wygląd kafli i presety onboardingu (odłożone); FREE/PRO (D37); M7 7.2/7.37 jako pełny warunek zimowy D5.

7. Przy każdym ekranie: `docs/rejestr-pokrycia.md`, `docs/rejestr-twardych-stopow.md`, `mapa-wdrozenia.md`, lokalny
   pakiet kontroli, commit → push → PR → merge.

### Odłożone przez właściciela (nie pytaj teraz, nie blokują M14)

TD21 CRL · Rsi per kierunek (czeka na PKN; ~~podane 0,17 / 0,10 / 0,13 — przypisanie do sprawdzenia z normą~~ **[29.09] ustalone: ściana 0,13 · strop/dach 0,10 · podłoga 0,17** — sprawdzenie końcowe z PKN, patrz lista 28.09) · M8/E3
fail-secure · M8/E4 gaz · M9/E2 magistrala · M9/E4 CAN · kafle M14 w presetach · 2 wyjątki D48 (wejście AC falownika,
odbiorniki wprost). Kod tych miejsc zostaje bez zmian (✅🤖).

---

**Czytaj najpierw (Y.4):** ten plik → `docs/lista-do-zrobienia.md` (końcówka, wpisy z 28.09) →
`03_M14_Dom_i_Firma_Siec.md` → `rejestr-decyzji.md` D35–D43 i D47–D49. Nie czytaj całej `docs/memory.md` od nowa —
wystarczą sekcje z 28.09.2026 („Integracja M14 do Biblii”, „Audyt końcowy N.3…”, „Audyt N.3 — decyzje 1–3…”).

---

## Stan na koniec sesji

- Audyt końcowy N.3 całej Biblii jest **wykonany**. Decyzje 1–3 właściciela są zapisane i zrobione:
  - D47 — szczegół przełącznika w M14/D11;
  - D48 — blok bezpieczeństwa agregatu, już w kodzie M2/E17 i M7/E8;
  - D49 — szkic LED jest kandydatem poza Biblią.
- **Otwarta jest tylko decyzja 4:** ~~12~~ **9 pozycji** ✅🤖 do potwierdzenia (lista niżej). Pozycje 1–3 zamknęła
  równoległa sesja, już na `main`: D29 addendum, D32 z korektą progów, D33 z nowymi mocami. Do czasu odpowiedzi
  **bramka N.3 trzyma kod M14.**
- **Numeracja po scaleniu z `main`:** na `main` numer D44 był już zajęty (M12/E23, stopień IP). Decyzje tej gałęzi
  mają więc numery **D47** (przełącznik w M14/D11), **D48** (blok bezpieczeństwa agregatu) i **D49** (szkic LED)
  zamiast D44–D46 (H.3). M7/E8 z D48 ma wersję **1.3.0** — 1.2.0 na `main` to korekta D32.
- Gałąź `claude/nowy-rozdzial-biblia-kalkulator-to73by` jest scalona do `main` w PR #186. Następna sesja startuje
  od `main`.
- CI nie działa do 1.10.2026 (`CLAUDE.md`) — przed merge uruchom lokalnie pełny pakiet:
  `pnpm typecheck`, `lint`, `check:i18n-guard`, `test`, `build`, `audit:gate`, `audit:n1`.

---

## Krok 0 — odpowiedź właściciela na decyzję 4 ~~(zanim powstanie jakikolwiek kod M14)~~ **[28.09.2026, D50] odłożone — nie blokuje M14**

Wyjaśnienie z opcjami dostał właściciel 28.09.2026. Jeśli nie odpowiedział, zapytaj go jeszcze raz,
krótko, o pozycje, które nadal są bez odpowiedzi (patrz kolumna „Odpowiedź 28.09”).
**[28.09.2026, odpowiedź właściciela]** 1 B, 2 „już ustalone”, 3 zostawić, 4 odłożyć, 5 „już ustalone, odłożone do
PKN”, 7 odłożyć, 8 odłożyć. **Bez odpowiedzi: 6, 9, 10, 11, 12.** Opcja **A** = zostaw, jak jest (nic w kodzie). Przy **B/C** — zmiana we wskazanym miejscu.

| # | Sprawa | Gdzie jest kod / zapis | Co zmienić przy B/C |
|---|---|---|---|
| 1 | ~~Balast M3 (D29 pkt 2 i 5)~~ | — | **✅ zamknięte na `main`** (D29 addendum: masa paneli i stelaża jako siła utrzymująca) — nie pytaj ponownie **Odpowiedź 28.09: B** — to jest dokładnie to, co już jest na `main` (D29 addendum). Nic do zrobienia. |
| 2 | ~~Agregat w mrozie (D32): poziomy 🟡/🔴/ℹ️~~ | — | **✅ zamknięte na `main`** (D32 potwierdzone z korektą progów, E8 1.2.0) — nie pytaj ponownie **Odpowiedź 28.09:** „już pisałem” — tak, zapisane w D32 (korekta: 🟡 od +10°C, 🔴 poniżej +5°C, paliwo zimowe od +5°C, arktyczne poniżej −10°C, świece obowiązkowo, dodatki zimowe). Nic do zrobienia. |
| 3 | ~~Lista 16 urządzeń (D33)~~ | — | **✅ zamknięte na `main`** (D33 potwierdzone, nowe moce, 19 pozycji) — nie pytaj ponownie **Odpowiedź 28.09: zostawić (A).** |
| 4 | CRL: długość > 1 km obcinana od największej wagi (TD21) | `lib/core/modules/okablowanie/ocena-ryzyka-crl/calculator.ts` | B: sortowanie odcinków rosnąco po wadze zamiast malejąco + test **Odpowiedź 28.09: odłożone** — właściciel nie może teraz zdecydować. Zostaje jak jest (✅🤖). |
| 5 | Rsi = 0,13 (M6/E8, TD20) | `lib/core/modules/ogrzewanie/pojemnosc-cieplna/constants.ts` | B: czeka na normę ISO 6946 od właściciela **Odpowiedź 28.09:** decyzja już była (lista 28.09, „Rsi per kierunek”): wartości per kierunek, ale poprawka **odłożona do czasu, aż właściciel dostarczy PKN** (PN-EN ISO 6946). Właściciel podał 0,17 / 0,10 / 0,13 dla ścian / dachu / podłogi — **przypisanie do sprawdzenia z normą** (w ISO 6946 zwykle: ściana 0,13, strumień w górę 0,10, w dół 0,17). Do tego czasu 0,13 wszędzie. **[29.09.2026, korekta właściciela]** Liczby z 28.09 były podane z pamięci — wiążące są wartości z wcześniejszej decyzji: **ściana 0,13 · strop/dach (strumień w górę) 0,10 · podłoga (strumień w dół) 0,17 m²·K/W**; wdrożenie odłożone do sprawdzenia końcowego z PKN. |
| 6 | Zamki fail-secure z UPS = 🟡 (M8/E3) | `lib/core/modules/bezpieczenstwo/zamki-drzwi-ewakuacyjnych/` | B: 🔴 + dopis w `docs/rejestr-twardych-stopow.md` |
| 7 | Gaz obojętny/aerozol przy LiFePO4 = 🟡 (M8/E4) | `lib/core/modules/bezpieczenstwo/modul-gasniczy/` | B: ℹ️; C: 🔴 + rejestr stopów **Odpowiedź 28.09: odłożone.** |
| 8 | Magistrala ponad wejście przetwornicy = 🔴 (M9/E2) | `lib/core/modules/esp32/zasilanie-esp32/` | B: 🟡 + usunięcie z rejestru stopów (przekreślenie, F.5) **Odpowiedź 28.09: odłożone.** |
| 9 | CAN bez transceivera = 🟡 (M9/E4) | `lib/core/modules/esp32/architektura-komunikacji/` | B: 🔴 jak RS485 + rejestr stopów |
| 10 | Kafle M14 ukryte w 8 presetach | `docs/pulpit-i-nawigacja.md` §3 (kafli M14 jeszcze nie ma w `lib/pulpit/`) | B: zapisać, w których presetach są widoczne — wejdzie razem z kaflami |
| 11 | D48 (dawniej D45): agregat przez wejście AC falownika = ℹ️, bez wymogu przełącznika | `lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo.ts` | B: `agregatWejscieFalownika` → poziom `critical` albo `warning` wg odpowiedzi, teksty PL/EN/RU |
| 12 | D48: odbiorniki wpięte wprost w agregat = ℹ️ | ten sam plik | B: jak wyżej, `agregatTylkoOdbiorniki` |

Po odpowiedzi: przy każdej pozycji w kodzie i rejestrach zamień „✅🤖” na adnotację
„**[data] potwierdzone przez właściciela (A)**” albo opis zmiany (F.5 — nie kasuj starego tekstu).

## Krok 1 — zamknięcie audytu N.3 **[28.09.2026, D50] zrobione: bramka zdjęta w M14 „Stan i bramki”**

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
D10 procedura, D11 przełącznik (twarde stopy: backfeed; szczegół normowy 🔎 HD 60364-5-551, D47).

**2f. Kafle i pulpit** — dwa duże kafle „Dom – sieć” / „Firma – sieć” za kaflem 13 (D39), ukryte w 8
presetach (albo wg odpowiedzi na pozycję 10), kreator „Ścieżka przejścia” (Wzorzec F).

Każdy ekran: wiersz w `docs/rejestr-pokrycia.md` (sekcja M14) todo → done, twarde stopy w
`docs/rejestr-twardych-stopow.md` (sekcja M14 — dopisać ścieżkę `warnings.ts` i kod), `mapa-wdrozenia.md`.

## Czego nie robić

- ~~Nie zaczynaj M14 bez kroku 0 i 1.~~ **[28.09.2026, D50]** Kroki 0 i 1 załatwione — zaczynaj od Kroku 2a.
- Nie proponuj wartości stawek, `C_rk`, profili W4 ani norm z pamięci — brakujące dane dostarcza właściciel
  (PGE i NFOŚiGW mają zepsuty łańcuch TLS; obejście certyfikatów było odrzucone, nie próbuj).
- FREE/PRO dla M14 nie jest przypisane (D37) — nie wprowadzaj podziału.
- Szkic LED (D49) nie jest częścią tej pracy.

## Stałe sprawy w tle

- Cykl Y.6 (sprawdzenie `AKTUALIZACJE.md` w `new-app-standards`) — następne ok. 29.09.2026 (`docs/memory.md`).
- Od 1.10.2026 wraca CI — usuń notę z `CLAUDE.md`.
- Wpis w `docs/wklad-do-standardu.md` z 28.09 (autozapis szkicu) — czeka na sesję nad standardem.
