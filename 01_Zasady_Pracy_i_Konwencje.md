# 01. Zasady Pracy i Konwencje — Inżynier Offgrid Pro

**Wersja:** 1.0 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 04.09.2026 | **Status:** Stabilny
**Powiązane dokumenty:** `00_Biblia.md`, `02_Dyrektywy_AI_Projektu.md`, `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_20.md` (Część P.1)

TL;DR: Wyciąg operacyjny z GOD BOOK — jak formatować i prowadzić tę Biblię, dopasowany do tego projektu. Ktoś (człowiek albo AI), kto dostanie ten dokument bez GOD BOOK, ma tu wszystko potrzebne do dalszej pracy zgodnej z metodologią.

---

## §1 Ekspertyza domenowa i tryby sesji

**Ekspertyza domenowa (stała dla całego projektu):** elektryk / inżynier instalacji off-grid PV (panele, magazyny energii, ogrzewanie, bezpieczeństwo elektryczne), poziom senior / 20 lat doświadczenia w terenie. Zastosowanie: każdy wzór weryfikowany niezależnie przed implementacją; rozróżnianie uniwersalnej fizyki od współczynników, których nie wolno zgadywać; wychwytywanie sprzeczności fizycznych w materiale źródłowym. Pełne uzasadnienie: `00_Biblia.md`, `zlote-zasady.md`.

**Tryby sesji** (uniwersalne, GOD BOOK 0.3):
- **Pisanie** — domyślny tryb tego projektu. Generatywny, buduje kolejne ekrany/moduły.
- **Audyt** — sceptyczny, aktywnie szuka dziur/sprzeczności. Używany przy sprawdzaniu synchronizacji ze standardem, przy code review.
- **Wdrożenie** — pilnuje zgodności kod↔specyfikacja i mapy wdrożenia.

Tryb ustala się jawnie, jeśli właściciel projektu go poda, inaczej automatycznie z treści polecenia. Domyślny: Pisanie.

## §2 Hierarchia pierwszeństwa zasad (przy kolizji, GOD BOOK 0.4)

1. **Dyrektywy AI projektu** (`02_Dyrektywy_AI_Projektu.md`) — twarde reguły bezpieczeństwa/zachowania.
2. **Złote Zasady** (`zlote-zasady.md`) — kompas nadrzędny.
3. **Decyzje w rejestrze** (`rejestr-decyzji.md`, D#, nieunieważnione) — konkretne, w swoim wąskim zakresie mają pierwszeństwo przed ogólnym duchem Złotych Zasad, ale nie mogą im wprost zaprzeczać bez jawnego wskazania sprzeczności.
4. **Ekspertyza domenowa** — wypełnia luki tam, gdzie powyższe milczą.
5. **Konwencje formatu** (ten dokument) — tylko *jak zapisywać*, nigdy *co robić*.

Wyższy poziom nigdy nie jest po cichu omijany przez niższy — konflikt między poziomami zgłaszany, nie rozstrzygany automatycznie.

**Poprzedzający fundament (Część Y GOD BOOK):** dla tego projektu (część rodziny aplikacji korzystającej z `new-app-standards`), przed powyższą hierarchią obowiązuje **Standard Architektoniczny** (`docs/standards/`) — wspólny dla całej rodziny, nie do renegocjacji na poziomie pojedynczego projektu. Kolizja z nim: patrz §6 niżej (dryf vs świadoma decyzja).

Procedura pivotu domeny (0.5) i adwokat diabła w trybie Audyt (0.6): bez zmian względem GOD BOOK, stosować wprost.

## §3 Konwencje techniczne (Część C GOD BOOK, bez zmian, uniwersalne)

**Cztery znaczniki treści:**
- ✅ decyzja podjęta
- 🔎 wymaga weryfikacji (fakt do sprawdzenia)
- ⏳ świadomie odłożone
- ⚠️ blokada / nieaktualne

**Status dokumentu:** Stabilny (ewentualnie z zakresem) / ⚠️ Propozycja — nie zapriorytetyzowane (kończy się sekcją "Do decyzji").

**Nagłówek dokumentu (szablon):**
```
# NR. TYTUŁ DOKUMENTU

**Wersja:** X.Y | **Filar:** [A/B/C] | **Data utworzenia:** DD.MM.RRRR | **Ostatnia aktualizacja:** DD.MM.RRRR | **Status:** [...]
**Powiązane dokumenty:** [...]
```

**Format dopisywania nowej treści:** nowa sekcja na końcu dokumentu, z datą i źródłem, nigdy wstawiana w środek/renumerowana. Nieaktualna treść: adnotacja `[DD.MM.RRRR] ⚠️ NIEAKTUALNE (zastąpione przez: X) — powód: Y`, oryginał zostaje widoczny.

**Nazwy plików i wersjonowanie:** myślniki nie spacje. `1.0` = pierwsza stabilna wersja, drobna poprawka +0.1, większa zmiana +1.0. Przy zmianie treści: bump wersji w nagłówku + aktualizacja wpisu w tabeli dokumentów `00_Biblia.md`. Stara nazwa pliku znika (zmieniana, nie duplikowana).

**Log zmian:** obowiązkowy w każdym dokumencie, tabela Data/Zmiana na końcu.

**Znacznik pochodzenia:** ✅ = decyzja jawnie podjęta/potwierdzona przez właściciela projektu. ✅🤖 = z inicjatywy AI, jeszcze niepotwierdzona.

**TL;DR i głębokość czytania:** każdy dokument (poza `00_Biblia.md`) zaczyna się TL;DR. Trzy poziomy: indeks (zawsze) → TL;DR rozdziałów (orientacja) → pełna treść (tylko gdy zadanie faktycznie tego dotyczy).

**Słownik pojęć:** od pierwszego specjalistycznego terminu, dopisywać do `slownik-pojec.md`.

**Termin ważności dla 🔎:** opcjonalnie `🔎 (do: DD.MM.RRRR albo "przed krokiem X")`.

## §4 Jednostka bazowa / konwencja danych (specyficzne dla tego projektu)

**Jednostki SI wewnętrznie** (W, kWh, V, A, Ω, °C, m, mm², %), przeliczanie na jednostki wyświetlania wyłącznie w warstwie prezentacji (`app/`). Waluta: PLN (zł). Format liczb: separator dziesiętny przecinek, `toLocaleString("pl-PL")` w UI. Reguły zaokrągleń dokumentowane per moduł, gdy istotne (np. `docs/rejestr-pokrycia.md`).

## §5 Trzy filary i rozdziały tego projektu (B.1, B.2 GOD BOOK)

- **Filar A (Systemowa)** — `kontrakty-rdzenia.md`, `docs/standards/` (fundament wspólny), architektura `lib/core`/`lib/adapters`/`app`.
- **Filar B (Merytoryczna)** — `docs/rejestr-pokrycia.md` (pełni rolę rozdziałów per moduł/ekran), kod w `lib/core/modules/*` i `app/kalkulatory/*`.
- **Filar C (Zarządcza)** — `00_Biblia.md`, `zlote-zasady.md`, `rejestr-decyzji.md`, `slownik-pojec.md`, `wiedza-surowa.md`, `mapa-wdrozenia.md`, `backlog-poza-v1.md`, `dlug-techniczny.md`, `docs/lista-do-zrobienia.md`, `docs/memory.md`, `docs/zrodla/`.

Rozdziały tematyczne = 13 Modułów źródła (`docs/zrodla/Tresc_Modul_N_*.md`), każdy z własnym wierszem w `docs/rejestr-pokrycia.md` — nie tworzymy równoległej numeracji dokumentów `01, 02, 03…` dla treści merytorycznej, bo już istnieje spójna numeracja Moduł 1–13 (Założenie robocze Z1, `rejestr-decyzji.md`).

## §6 Standard Architektoniczny wspólny (Część Y GOD BOOK)

Ten projekt korzysta z `docs/standards/` (17 rozdziałów, `new-app-standards`) jako fundamentu poprzedzającego tę Biblię. Kolizja treści między Standardem a tą Biblią:
- **Dryf kodu od już ustalonej reguły Standardu, bez świadomej decyzji** — naprawiaj od razu, zapisz w `docs/memory.md` (Część Y.2).
- **Świadomy, jawny konflikt** (Standard mówi X, ta Biblia świadomie mówi Y z uzasadnieniem) — zgłoś właścicielowi projektu, nigdy nie rozstrzygaj sam.

Synchronizacja ze Standardem: cyklicznie, ≤7 dni, sprawdzając `AKTUALIZACJE.md` w `new-app-standards` — status i data ostatniego sprawdzenia: `docs/memory.md`, sekcja "Synchronizacja ze standardem".

## §7 Szablon modułu (Część H.1 GOD BOOK, bez zmian)

Cel · Kluczowe zasady/wzory (z liczbami) · Wejście · Walidacja · Logika/obliczenie · Wynik · Obsługa błędów · Przykład (przeliczony/przetestowany) · Zależności (inne moduły M#) · Wpływ na MVP.

W praktyce tego projektu: ten szablon realizuje wzorzec plikowy kodu — `input.ts` (Wejście), `validation.ts`+`warnings.ts` (Walidacja/Obsługa błędów), `calculator.ts` (Logika+Wynik, z `FORMULA` jako string LaTeX = "Kluczowe wzory"), `__tests__/*.test.ts` (Przykład przeliczony), `app/kalkulatory/*/page.tsx` (UI). Zależności i Wpływ na MVP: opisane w komentarzu nagłówkowym `calculator.ts` i w `docs/rejestr-pokrycia.md`.

## §8 Stabilne ID (Część H.2 GOD BOOK)

- **Moduły:** M1–M13, odpowiadają wprost istniejącej numeracji "Moduł N" (Założenie robocze Z1, `rejestr-decyzji.md`).
- **Ekrany:** `M#/E#` (np. `M4/E24`) — już stosowane nieformalnie w `docs/rejestr-twardych-stopow.md` i kodzie; od D19 formalizowane jako stabilny identyfikator.
- **Decyzje:** D1, D2, D3… w `rejestr-decyzji.md`.
- **Założenia robocze:** Z1, Z2… w `rejestr-decyzji.md`.

## §9 Statusy pomysłu (Część F.3 GOD BOOK, bez zmian)

| Status pomysłu | Znacznik | Znaczenie |
|---|---|---|
| DO REALIZACJI | → ✅ po zapisaniu | pasuje do Złotych Zasad, planujemy |
| ODŁOŻONY | ⏳ | dobry pomysł, świadomie nie teraz |
| ODRZUCONY | brak, zostaje w rejestrze z uzasadnieniem | nie pasuje |
| PRZESTARZAŁY | ⚠️ NIEAKTUALNE | zastąpiony lepszym rozwiązaniem |

## §10 Standardy inżynierskie dla kodu (Część X GOD BOOK, treść z `docs/standards/`)

Testy (`docs/standards/10-testy.md`), CI/deployment (`docs/standards/11-ci-deployment.md`), standard kodowania — kopiowane w całości ze Standardu wspólnego, nie wymyślane per projekt. Lokalny próg może iść dalej niż Standard, nigdy go nie obniżać po cichu. Definicja "Gotowe" dla ekranu tego projektu: kod działa · testy przechodzą · typecheck bez nowych błędów · brak martwego kodu · dokumentacja (w tym `docs/memory.md`) zaktualizowana · zmiana nie narusza innych modułów (`CLAUDE.md`).

## §11 Częste pułapki (Część Q GOD BOOK, skrót uniwersalny)

Pisanie treści przed architekturą · zakładanie zgodności bez sprawdzenia · description drift (opis z pamięci zamiast ponownego sprawdzenia źródła) · milczące zmiany zasad · skracanie "dla zwięzłości" · redakcja bez wpisu w logu zmian · ten sam temat w wielu plikach bez odnośników · twarde liczby zamiast stawek jednostkowych · wspólne struktury wymyślane osobno w każdym module.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — wyciąg operacyjny z GOD BOOK v2.5, dopasowany do tego projektu. Wersja 1.0. |
