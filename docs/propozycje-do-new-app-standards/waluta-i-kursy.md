# Waluta wyświetlania, przeliczanie kwot w polach i źródło kursów — instrukcja do przeniesienia (02.10.2026)

Plik jest kompletny sam w sobie: można go wziąć 1:1 do dowolnego projektu rodziny z i18n i kwotami. Nie jest częścią standardu (decyzję o promocji podejmuje sesja nad `new-app-standards`). Kod referencyjny: `lib/waluta/*`, `lib/adapters/kursy/*`, `lib/adapters/supabase/kursy-store.ts`, `components/waluta-wybor.tsx`, `components/przeliczone-info.tsx`.

## 1. Zasada: język i waluta to dwie osobne preferencje
- Domena (silnik, taryfy, stałe) liczy w **jednej walucie bazowej** (tu PLN). Nigdy nie zmieniamy liczb silnika po zmianie waluty.
- Wybór waluty zmienia tylko **granicę wyświetlania**: `useZl()` (kwota w bazowej → sformatowana w wybranej, `Intl.NumberFormat` + język UI) i `useDenominacja()` (w jakiej walucie użytkownik wpisuje teraz kwoty).
- W tekstach nie ma „zł” na sztywno: placeholder `{waluta}` podstawiany przez `t()`/`podstaw()` (symbol wybranej waluty). Ekrany **rynku bazowego** (np. taryfy OSD, URE) przypinamy do waluty bazowej (`useTranslate(true)`) — to stawki prawne w PLN, nie wolno ich „przewalutować”.
- Test zgodności `{params}` PL/EN/RU (u nas `pomoc.test.ts`) łapie tłumaczenie, w którym zgubiono `{waluta}` — zostawić go jako obowiązkowy.

## 2. Kurs i jego źródła
- Kurs = jednostki waluty wyświetlania na 1 jednostkę bazowej. Kurs efektywny = **ręczny > automatyczny**, następnie × (1 + narzut%/100) (narzut domyślnie 0; zastępuje „kurs banku/kantoru” — żaden bank detaliczny nie ma publicznego API, więc ten wariant załatwia „chcę kurs mojego banku”).
- Automatyczne źródło: **Frankfurter (`api.frankfurter.dev/v1/latest?base=PLN&symbols=…`) = referencyjne kursy EBC**, publiczne, bez klucza, publikacja raz dziennie. Waluty spoza EBC (np. UAH) → tylko wpis ręczny (flaga `automatyczny: false`). Brak kursu → pokazujemy walutę bazową, **nigdy** błędną liczbę w wybranej.
- Łańcuch pobierania w aplikacji online: **`/api/kursy` (własny serwer) → Frankfurter bezpośrednio (fallback, wymaga wyjątku w CSP `connect-src`) → ostatnie zapisane lokalnie**. Offline aplikacja używa ostatnich zapisanych kursów. Zapis lokalny: `{pobranoMs, dataEcb, kursy}`, ważność 12 h; UI zawsze pokazuje **datę kursu EBC** i moment pobrania.
- Serwer (`/api/kursy`): (1) trwały zapis (tabela `kursy_walut`, jeden wiersz na datę EBC = historia, RLS włączone bez polityk, dostęp wyłącznie kluczem service role); świeży (<12 h) → bez wołania Frankfurter; (2) inaczej pobranie z Frankfurter + zapis dla wszystkich; (3) Frankfurter niedostępny → ostatni zapis oznaczony `source: zapis-nieaktualny`; (4) nic → 502 `KURSY-NIEDOSTEPNE`, klient przechodzi na fallback. Bez konfiguracji Supabase magazyn jest pomijany (sam cache Next/CDN, `s-maxage`) — łagodna degradacja, nic się nie psuje.
- Logikę trasy trzymać w `lib/` (cienka trasa w `app/api`) — runner testów często obejmuje tylko `lib/**` i test trasy pod `app/` po cichu się nie uruchamia (nas to zaskoczyło).

## 3. Przeliczanie wartości w polach po zmianie waluty (decyzja: PRZELICZAĆ)
Problem: pola kwotowe miały polskie przykłady w PLN; po zmianie waluty zmieniała się tylko etykieta („€/kWh”), liczba zostawała — użytkownik widział „0,80 €/kWh” zamiast ~0,19 €.
Rozwiązanie (wzorzec):
1. Szkic ekranu jest zapisywany (autosave) razem z **znacznikiem waluty szkicu** (`offgrid.draftwaluta.<ekran>`).
2. `usePersistedDraft(klucz, początkowy, konwersjaKwot?)` — gdy waluta wyświetlania ≠ waluta znacznika, wywołuje konwerter pól kwotowych ze współczynnikiem `kursNowy / kursStary` (kursy względem bazowej, więc działa też EUR→USD bez przejścia przez ekran), po czym aktualizuje znacznik. Hook zwraca `[stan, setStan, info]`.
3. Konwerter ekranu to jedna linia: `przeliczPola<T>("cena", "koszt", …)` — dla pól tekstowych `przeliczPoleTekst`: przecinek→kropka, **6 cyfr znaczących** (żeby nie kumulować zaokrągleń przy wielokrotnych zmianach), puste/niepoprawne pole zostaje bez zmian.
4. Komunikat nad polami: `<PrzeliczoneInfo info={info}/>` (`role="status"`): „Przeliczono z PLN kursem EBC z dnia {data}” (albo „kursem ręcznym”, ewentualnie z dopiskiem o narzucie).
5. Ekrany rynku bazowego **nie** przeliczają (pkt 1).
Pułapki: (a) lint `react-hooks/set-state-in-effect` — nie wołać `setState` synchronicznie w efekcie; stan „wczytano” wyprowadzić z porównania klucza (`wczytanoKlucz === key`); (b) podpowiedzi liczbowe w pomocy (`params`) też są kwotami — mnożyć przez kurs; (c) kumulacja zaokrągleń rzędu 1e-6 przy wielu zmianach waluty jest akceptowalna i opisana; (d) ekrany bez `usePersistedDraft`, a z kwotami, trzeba znaleźć osobno (szukać po jednostkach/słowach kluczowych — nie ma pewnego automatu).

## 4. Co się stało ze strażnikiem i18n (lekcja)
Strażnik UI skanował tylko `app/` i `components/` i meldował „OK”, a polskie teksty z `lib/` (rejestry, stałe silnika, komunikaty hooków, **„zł” zaszyte w słownikach i nazwach pól**) trafiały na ekran surowo; strażnik nie widział też tekstów bez polskich liter. Wniosek: **„strażnik OK” ≠ „EN/RU kompletne”**. Zadziałało dopiero: (1) niezależny skan `lib/` poza zasięgiem strażnika, (2) test generowany z rejestru („każdy wpis ma klucze we wszystkich językach”), (3) test zgodności `{params}` PL/EN/RU, który po wprowadzeniu `{waluta}` wychwycił brakujący parametr w RU. Reguła do rozważenia: strażnik skanuje eksportowane literały z polskimi znakami w `lib/` (poza promptami AI i testami) przypisane do pól tekstowych + lista zapadkowa (ratchet) liczona od stanu zera.

## 5. Checklist wdrożenia w nowym projekcie
1. Waluta bazowa + lista walut (`automatyczny` true/false) + `formatujKwote` (`Intl`).
2. Preferencja `{kod, narzutProc, reczne}` + bufor kursów w localStorage (`{pobranoMs, dataEcb, kursy}`), zdarzenie zmiany, `useSyncExternalStore`.
3. `kursy-zrodlo` (URL + parser, wspólny dla serwera i klienta), `/api/kursy` + opcjonalna tabela, wyjątek CSP dla fallbacku.
4. `useZl`, `useDenominacja`, `{waluta}` w tekstach, przypięcie ekranów rynku bazowego.
5. `usePersistedDraft` z konwersją + `PrzeliczoneInfo` na każdym ekranie z kwotami.
6. Testy: współczynnik przeliczenia, zaokrąglenia, parser odpowiedzi, trzy ścieżki trasy (zapis/ECB/zapis nieaktualny + brak danych), zgodność `{params}`.
