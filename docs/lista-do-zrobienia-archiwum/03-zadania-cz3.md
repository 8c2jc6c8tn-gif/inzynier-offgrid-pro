# Archiwum docs/lista-do-zrobienia.md — 03-zadania-cz3.md

Dosłowna kopia (1:1) wpisów ze statusem ✅ przeniesionych 03.10.2026 z `docs/lista-do-zrobienia.md` (Sekcja „Zadania”). Kolejność oryginalna. Nic nie edytowano wstecz.

---

- ✅ (2026-09-04) Ekran 17, Moduł 3 (Instalacja PV) — "Niedopasowanie mocy paneli (mismatch)" zaimplementowany. Prąd stringu ogranicza najsłabszy panel; przykład źródła (400W/11A + 330W/9A → 720W zamiast 730W, strata 1,4%, różnica mocy 17,5% → 🔴) odtworzony dokładnie. Twardy próg (10-15% różnicy mocy) użyty jako trójstopniowe kubełkowanie.
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
