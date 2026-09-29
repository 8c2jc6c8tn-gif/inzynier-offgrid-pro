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
