# docs/audyt-zgodnosci-kodu.md — raporty Y.11 (audyt zgodności kodu ze standardem)

Kategoria LOKALNE (GOD BOOK Y.11). Rejestr reguł — tabela Y.11 w `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_39.md` (NIETYKALNA). Y.11 **nie naprawia kodu** — każde ⚠️ wraca do zwykłego trybu pracy z właścicielem projektu przed commitem. Append-only: każdy przebieg to nowa sekcja, starych nie poprawiamy.

---

## Przebieg 1 — 29.09.2026, ok. 19:40 UTC (na żądanie właściciela: „przeprowadzimy test Y11”)

Stan kodu: `main` @ `5b51c6e` (po PR #221). Faza projektu: przedpremierowa (17.7c (a)). Rejestr świadomych wyjątków
(`new-app-standards/docs/god-book/memory.md` i „WYJĄTEK OD REGUŁY RODZINY” w `rejestr-decyzji.md`) — pusty.

| # | Reguła | Wynik | Dowód (odtwarzalny) |
|---|---|---|---|
| 1a | 17.1a — mechanizm i18n istnieje | ✅ | `lib/i18n/` (słowniki PL/EN/RU, `t.ts`, `language-context.tsx`); silniki zwracają klucze — `pnpm check:i18n-guard`: 202 moduły, 0 regresji, sprawdza też kompletność własnej listy |
| 1b | 17.1a — nowy/zmieniony kod UI nie dodaje twardych stringów | ⚠️ | Zmiany z 29.09 (`git diff 97dacda 5b51c6e -- app components`) dodały polskie teksty w JSX bez `t(...)`. Najwięcej: `przelacznik-siec-wyspa` (18 linii), `components/siec/porownanie-scenariuszy` (16), `optymalizacja-trasy-kabla` (13), `magazyn-firmy` (13), `uziemienie-male-instalacje` (10 — E38, plik bez żadnego `t(...)`), `dobor-kabli-bezpiecznikow-olow` (10), `components/siec/pv-magazyn` (8), `rezygnacja-z-przylacza` (8), `panel-do-stacji-zasilania` (7), `test-licznika` (6), `agregat-jako-zapas` (6), dalej ≤5 w ok. 25 plikach. Ogółem `useTranslate` ma 58 z 220 `page.tsx` — samo niepełne pokrycie starych ekranów to nie naruszenie (17.9), ale nowe/zmienione linie tak (17.1a, a od 29.09 wprost 8.12 i 17.1a dopisek). Pliki z 1 trafieniem to w większości tylko dopisane `ekran=` przy istniejącym tytule — pominięte. Brak strażnika: `check:i18n-guard` pilnuje tylko silników, nie JSX |
| 1c | 17.7b — selektor tylko kompletnych języków | ✅ | `components/jezyk-wybor.tsx` pokazuje wszystkie `SUPPORTED_LANGUAGES` bez filtra — dopuszczalne w fazie przedpremierowej (17.7c (a)); dodatkowo decyzja właściciela 23.09.2026 „nic na razie nie ukrywaj” (`docs/memory.md`). Do ponownej oceny przed premierą |
| 2 | 5.7 — autosave | ✅ | 220 ekranów: 191 `usePersistedDraft` w `page.tsx`, 13 przez wspólny komponent (`ekran-checklisty-chemii`, `ekran-kabli-malej-instalacji`, `components/siec/*`), 16 statycznych bez pól i bez stanu (`faq-*`, `dotacje*`, `audyt-pozarowy`, `tryb-live`…). Poza kalkulatorami formularz tylko `/wzornik` (strona-wzornik, zapis preferencji przez `lib/wyglad`). Egzekwuje `pnpm check:pomoc-guard` |
| 3 | 9.0a — rejestracja narzędzi AI | ✅ | `pnpm check:ai-tools-guard`: 200 narzędzi z „Użyj, gdy…”, wszystkie zarejestrowane w `lib/ai/pytaj-asystenta.ts`; każdy kalkulator ma narzędzie albo adnotację „nie dotyczy” |
| 4 | Część Y — kategorie plików | ✅ | `diff -rq` z `new-app-standards` @ `af63da7`: `docs/standards/*`, GOD BOOK v2_39, `PROMPT_STARTOWY.md`, `docs/przyklady/i18n/*` identyczne (po PR #221). Nowe pliki od 29.09 (poza kodem): skan taryfy w `docs/zrodla/`, skrypty strażników — lokalne, poza plikami pakietu |
| 5 | K7 — czystość jądra | ✅ | `grep -rnE 'from "@/(app\|components)\|from "(react\|next)\|window\.\|document\.\|localStorage' lib/core` oraz importy `@/lib/adapters`, `@/lib/ai` z `lib/core` — 0 trafień (poza testami) |
| 6 | 9.0 — AI żywe w UI | ✅ | `components/asystent-ai.tsx` woła `pytajAsystenta` (Server Action), osadzony w `app/layout.tsx` — dostępny na każdej trasie |
| 7 | 18.1 — logowanie od pierwszego uruchomienia | ⚠️ (znane, zablokowane) | `middleware.ts` chroni wszystkie trasy poza `/auth/*`, ale dopóki `isSupabaseConfigured()` = false (brak projektu Supabase / `.env.local`), bramka jest **wyłączona** — jawnie, od 15.09.2026 (komentarz w pliku, `docs/memory.md`). Mechanizm gotowy, nieaktywny; czeka na akcję właściciela (projekt Supabase) |

**Podsumowanie:** 7 ✅, 2 ⚠️ (1b — nowe, 7 — znane). Kodu nie zmieniono (Y.11).

**Do decyzji właściciela:**
1. **1b:** (A) naprawić teraz ekrany zmienione 29.09 (≈15 plików z największą liczbą nowych tekstów — klucze + EN/RU), razem z (B) strażnikiem 11.9 na polskie teksty w JSX ekranów (AST, lista zapadkowa jednorazowo dla starych ekranów); albo (C) tylko strażnik teraz, a teksty przy najbliższej zmianie każdego ekranu. Rekomendacja: A+B — bez strażnika to samo wróci przy kolejnym ekranie (11.9), a lista zapadkowa i tak obejmie 162 stare ekrany bez tłumaczeń.
2. **7:** bez zmian — czeka na projekt Supabase (akcja właściciela).

**[29.09.2026] Dopisek po decyzji właściciela (A + B, D58):** 1b naprawione — ekrany M14 i E38 przez klucze `UI-*` PL/EN/RU,
strażnik UI w `pnpm check:i18n-guard` z listą zapadkową. Korekta zakresu: nowe teksty były w ~40 plikach, nie w ≈15
(`docs/memory.md`, sekcja „D58”).

---

## Przebieg 2 — 02.10.2026 (na żądanie właściciela: „zrób Y11 audyt”)

Stan kodu: gałąź `claude/wizardly-brahmagupta-df8tzb` @ `af5503b` (230 commitów po stanie z przebiegu 1; `origin/main` @ `3e71fed`).
Faza przedpremierowa (17.7c (a)). Rejestr świadomych wyjątków — pusty (brak wpisu „WYJĄTEK OD REGUŁY RODZINY”).
`new-app-standards` nie jest dostępne w tej sesji — pozycja 4 sprawdzona tylko lokalnie (patrz niżej).

| # | Reguła | Wynik | Dowód (odtwarzalny) |
|---|---|---|---|
| 1a | 17.1a — mechanizm i18n | ✅ | `pnpm check:i18n-guard`: 265 zmigrowanych modułów silnika bez regresji; `t.ts`, słowniki PL/EN/RU, `language-context.tsx` |
| 1b | 17.1a — brak nowych twardych stringów w UI | ✅ z zastrzeżeniem ➕ | `check:i18n-ui-guard`: lista zapadkowa 6 plików / 10 tekstów (`layout.tsx` 3, `manifest.ts` 2 — metadane; `test-licznika` 2; po 1: `definicje-symboli`, `siec/wspolne`, `werdykt`). **➕ Strażnik nie widzi `lib/`** — niezależny skan 02.10 znalazł 11 grup polskich tekstów poza jego zasięgiem (wpis w `docs/lista-do-zrobienia.md`); część domknięta (stałe ekranów, rejestr pulpitu), reszta otwarta. To luka narzędzia, nie nowe naruszenie ekranów |
| 1c | 17.7b — selektor tylko kompletnych języków | ✅ (faza przedpremierowa) | `components/jezyk-wybor.tsx` mapuje całe `SUPPORTED_LANGUAGES` bez filtra — dopuszczalne wg 17.7c (a) i decyzji 23.09.2026. **Do ponownej oceny przed premierą:** EN/RU nie mają przeglądu merytorycznego, a kompletność nie obejmuje jeszcze grup z audytu |
| 2 | 5.7 — autosave | ✅ | 248 `page.tsx` z `usePersistedDraft` na 277 katalogów w `app/kalkulatory`; reszta to wzorce przez wspólne komponenty i ekrany statyczne (jak w przebiegu 1); egzekwuje `check:pomoc-guard` |
| 3 | 9.0a — rejestracja narzędzi AI | ✅ | `check:ai-tools-guard`: 262 narzędzia z „Użyj, gdy”, 262/262 kalkulatorów z narzędziem albo adnotacją „nie dotyczy” (przebieg 1: 200) |
| 4 | Część Y — kategorie plików | ✅ (tylko lokalnie) | `docs/standards/`, `docs/god-book/`, `PROMPT_STARTOWY.md` obecne; `git status` czysty, brak zmian w NIETYKALNYCH od sync 25.09 (v2_39). Porównanie `diff -rq` ze źródłem niewykonalne w tej sesji (brak klonu `new-app-standards`) |
| 5 | K7 — czystość jądra | ✅ | Grep importów `@/app`, `@/components`, `react`, `next`, `window.`, `document.`, `localStorage` w `lib/core`: 2 trafienia, oba w komentarzach (słowo „window” = okno czasowe: `ai/przesuwanie-zadan/input.ts:25`, `stress-test/okno-sloneczne/warnings.ts:48`); importy `@/lib/adapters`, `@/lib/ai` z `lib/core`: 0 |
| 6 | 9.0 — AI żywe w UI | ✅ | `components/asystent-ai.tsx:46` woła `pytajAsystenta`; `<AsystentAi />` w `app/layout.tsx:186` |
| 7 | 18.1 — logowanie od pierwszego uruchomienia | ⚠️ (znane, zablokowane) | Mechanizm w **`proxy.ts`** (Next 16 zastąpił `middleware.ts`; raport z 29.09 odsyłał do starej nazwy): matcher obejmuje wszystkie trasy poza zasobami statycznymi, redirect na `/auth/login` (l. 116). Przy `!isSupabaseConfigured()` (l. 90) przepuszcza — bramka nieaktywna do czasu projektu Supabase (akcja właściciela). Bez zmian od przebiegu 1 |

**Podsumowanie:** 6 ✅, 1 ⚠️ (poz. 7 — znane), 1 ➕ (luka strażnika 1b). Kodu nie zmieniono (Y.11). Poprawka do przebiegu 1: plik bramki to `proxy.ts`, nie `middleware.ts`.

**Do decyzji właściciela:** (1) czy zamknąć ➕ strażnikiem skanującym `lib/` (zapisane też w `docs/wklad-do-standardu.md`); (2) poz. 7 — bez zmian, czeka na Supabase; (3) przed premierą: przegląd EN/RU i ponowna ocena 1c.

---

## Przebieg 3 — 18.10.2026 (na żądanie właściciela, po synchronizacji do GOD BOOK v2_49; pozycje nowe 8–11)

Stan kodu: gałąź `claude/aktualizacja-standardu-18-10` na `main` @ `b8e85f4c` (3.33.0). Pozycje 1–7 nie były ponawiane (ostatnio sprawdzone w przebiegu 2). Rejestr świadomych wyjątków — pusty. Kodu nie zmieniono (Y.11).

| # | Reguła | Wynik | Dowód (odtwarzalny) |
|---|---|---|---|
| 8 | 17.12 — waluta i kursy (projekt wielorynkowy: PL/EN/RU, ceny w zł) | ⚠️ → ✅ po naprawie w 3.33.1 (decyzja właściciela 18.10: wariant A, po audycie JSX) | Moduł formatujący istnieje: `lib/waluta/przelicz.ts` (`formatujKwote`, locale z języka UI). Poza nim: 188 wywołań `toLocaleString`/`Intl.NumberFormat`/`toLocaleDateString` w kodzie nietestowym, z tego 181 ze sztywnym `"pl-PL"` w 103 plikach (4 w `lib/core`), ok. 14 dotyczy kwot/kosztów (np. `app/kalkulatory/koszty-ogrzewania/page.tsx` 79–81, `oplacalnosc-magazynu`, `second-life`). Skutek: przy języku EN/RU liczby w wynikach mają polski separator dziesiętny. Odtworzenie: `grep -rEn 'toLocaleString|Intl\.NumberFormat' lib app components --include=*.ts --include=*.tsx`. |
| 9 | 3.3 — status `ESTIMATE` (część strukturalna) | ⚠️ → ✅ po naprawie w 3.34.0 (D92, wariant A) | `lib/core/calc-result.ts:6` — unia `Status` ma 5 wartości (`VALID`, `VALID_WITH_WARNINGS`, `INCOMPLETE`, `OUT_OF_SCOPE`, `INVALID_INPUT`); `ESTIMATE`: 0 trafień w `lib/`. Dodanie wartości zmienia kontrakt wyniku (`isComputed`, 278 kalkulatorów) — decyzja właściciela. |
| 10 | Rozdz. 19 — dane środowiskowe (opis pola, metadane źródła, licencja i atrybucja) | ➕ | Projekt nie trzyma własnych plików danych środowiskowych w repo: nasłonecznienie to odpowiedź PVGIS TMY pobierana w locie i zapisywana lokalnie (`lib/lokalizacja/dane-tmy.ts`: współrzędne + `pobrano` ISO 8601 + dane). Brak: pola opisu jednostek/wersji źródła przy zapisie oraz jawnej atrybucji i licencji PVGIS/JRC w UI i w dokumentacji (19.6, 19.10). Dług do domknięcia, nie naruszenie. |
| 11 | 18.2 — klucz dostępu (passkey) | ✅ | `lib/adapters/supabase/passkey-actions.ts` (`"use server"`), `passkey-przegladarka.ts` (tylko okno systemowe), `components/konto-passkey.tsx`, `app/auth/login/page.tsx`; sesja w `HttpOnly` cookie (18.5); brak `createBrowserClient` (komentarz w `components/konto-sekcja.tsx`). Do potwierdzenia przed premierą: RP ID pochodzi z konfiguracji domeny produkcyjnej — w kodzie projektu nie ma własnego RP ID, ustala je Supabase Auth (ustawienia projektu Supabase, który jeszcze nie jest podpięty — patrz poz. 7). |

**Podsumowanie:** 1 ✅, 2 ⚠️ (poz. 8, 9), 1 ➕ (poz. 10). Kodu nie zmieniono.

**Do decyzji właściciela:**
1. Poz. 8 — (A) jeden helper `formatujLiczbe(x, jezyk, opcje)` w `lib/i18n` i migracja 181 wywołań modułami (jak 17.9), (B) tylko kwoty przez `formatujKwote`, liczby bez zmian do czasu migracji. Rekomendacja: A, ale po audycie JSX (poz. 1b), bo dotyka tych samych plików.
2. Poz. 9 — dodać `ESTIMATE` do `Status` (zmiana kontraktu = wyższa cyfra wersji wg `docs/wersjonowanie.md`) albo zapisać świadomy wyjątek w `rejestr-decyzji.md` („WYJĄTEK OD REGUŁY RODZINY”) z powodem.
3. Poz. 10 — dopisać atrybucję PVGIS i licencję (tekst do uzgodnienia z właścicielem; nie zgaduję warunków licencji JRC).

**[18.10.2026, wieczorem] Poz. 8 naprawiona w wersji 3.33.1** na polecenie właściciela (wariant A): `lib/i18n/liczby.ts` + `useFormatLiczby()`, 166 wywołań i 3 daty zmigrowane, 0 wywołań `toLocaleString("pl-PL")` poza dozwolonym tekstem listy kontrolnej momentu dokręcania; test `lib/i18n/__tests__/liczby.test.ts` pilnuje regresji. Zostają: `toLocaleLowerCase("pl-PL")` (porównanie nazw po polsku, nie formatowanie) i dwa `toLocaleString()` bez argumentu w `historia-zdarzen` i `waluta-wybor` (znacznik czasu w ustawieniach przeglądarki, nie w języku UI — do osobnej decyzji). Pakiet: typecheck, lint, `check:i18n-guard`, 4005 testów — zielone. Poz. 9 (`ESTIMATE`) i 10 (PVGIS) bez zmian: 10 odłożona przez właściciela do pracy po stronie bazy danych.

**[18.10.2026, wieczorem] Poz. 9 naprawiona w wersji 3.34.0 (D92, wariant A wybrany przez właściciela):** `ESTIMATE` jest w unii `Status`; lista `STATUSY` w `lib/core/calc-result.ts`, schematy narzędzi AI z `z.enum(STATUSY)`; test `lib/core/__tests__/status-estimate.test.ts`. Żaden kalkulator jeszcze go nie zwraca — pierwsze użycie jest osobnym zadaniem (lista zadań).
