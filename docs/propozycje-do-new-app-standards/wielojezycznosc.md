# PROPOZYCJA dla `new-app-standards` — Nowy rozdział: Wielojęzyczność (i18n)

> **Status: gotowa do konsolidacji — sekcja C rozstrzygnięta na bazie realnej implementacji w TYM
> projekcie, nie w `zero-waste`.** Pierwotny plan (patrz historia niżej) był czekać na dostęp do
> `zero-waste`. Właściciel projektu (16.09.2026) polecił inaczej: nie czekać na dostęp do innych
> repo, tylko budować i zgłaszać na bazie tego, co faktycznie wiadomo/zbudowane w tym projekcie —
> `docs/wklad-do-standardu.md` i pliki w tym folderze to jedyny kanał, decyzja o promocji i tak
> zapada wyłącznie w sesji nad `new-app-standards`. Sekcja C poniżej jest teraz odpowiedzią z
> realnego, przetestowanego kodu (`lib/i18n/`, `components/jezyk-wybor.tsx`, `middleware.ts`,
> `app/layout.tsx`) zamiast pytaniami czekającymi na `zero-waste`. Jedno pytanie (C6, treści
> bezpieczeństwa-krytyczne) pozostaje świadomie otwarte — ten projekt jeszcze go nie rozwiązał w
> praktyce, nie tylko nie zgłosił.

## A. Skala luki — sprawdzone, nie zgadywane

W całym standardzie (`docs/standards/00`-`16`, stan na 14.09.2026) i w GOD BOOK był dokładnie
**jedno** zdanie dotyczące wielojęzyczności — w `01-architektura.md`: i18n wymieniona jako jeden z
elementów, które mają żyć w warstwie domenowej (`domain/core`) jako czyste funkcje, nie w UI. To
reguła **gdzie** umieścić mechanizm, nie strategia **jak** go zbudować. Od synchronizacji
16.09.2026 (v2.18) `docs/standards/17-i18n.md` ma już regułę **jak** przechowywać wybór języka przy
SSR (17.4/17.4a: cookie + `Accept-Language`, nie `localStorage`/`navigator.language`) — ale wciąż
bez rozdziału opisującego całość: format słowników, kontrakt `t()`, kontrakt `Warning`/`Assumption`
jako klucz+params, przełącznik w UI, fallback przy brakującym tłumaczeniu. W tym projekcie
(`inzynier-offgrid-pro`) stan na 16.09.2026 (przed pracą opisaną niżej): 1 zmigrowany moduł na 116
(`kalkulatory-pomocnicze`), słownik tylko polski, zero przełącznika języka w UI.

## B. Co da się ustalić już teraz, bez zero-waste

1. **Zgodność z regułą z rozdziału 01** — jakikolwiek mechanizm i18n przyjęty w nowym rozdziale musi
   respektować już istniejący podział warstw: słowniki/klucze tłumaczeń jako dane w warstwie
   domenowej lub obok niej (import przez UI, nigdy odwrotnie), nie logika tłumaczenia wpleciona w
   komponenty.
2. **Model danych i profile kontekstowe (rozdział 02)** — ten projekt ma już `profil regionalny`
   (np. `PL` — waluta, jednostki, format liczb, patrz `lib/core/profiles/`). **Język interfejsu i
   profil regionalny to dwie NIEZALEŻNE osie**, łatwe do pomylenia: użytkownik może chcieć polski
   interfejs z profilem regionalnym USA (jednostki imperialne) albo odwrotnie. Nowy rozdział
   powinien to jawnie rozróżnić, a nie zakładać "1 język = 1 profil regionalny".
3. **Jądro obliczeniowe (rozdział 03)** — `CalcResult.formula`/`assumptions`/komunikaty `Warning`
   są dziś tekstem w jednym języku (polskim), wpisanym w logice domenowej. To bezpośrednio koliduje
   z regułą 01 ("i18n w warstwie domenowej jako czyste funkcje") — potrzebna jasna decyzja: czy
   treść `Warning`/`formula` staje się kluczem tłumaczenia (`warning.led_ip_rating_low`) tłumaczonym
   w UI, czy jądro zwraca już przetłumaczony tekst (wymaga przekazania języka jako parametru do
   każdej funkcji domenowej) — to fundamentalna decyzja architektoniczna z konsekwencjami dla
   **każdego** istniejącego kalkulatora w każdym projekcie rodziny, nie kosmetyczna.
4. **Styl komunikatów (rozdział 08.8)** — reguła "proste, konkretne, bez straszenia" musi przetrwać
   tłumaczenie maszynowe/ręczne na każdy obsługiwany język, nie tylko polski — wart dopisania jako
   jawne kryterium jakości tłumaczenia, nie tylko oryginału.

## C. Rozstrzygnięcia z realnej implementacji (16.09.2026, `inzynier-offgrid-pro`)

1. **Zakres języków — 3: `pl` (bazowy), `en`, `ru`.** Nie "ile zero-waste planuje" — konkretna,
   działająca lista (`lib/i18n/language.ts`, `SUPPORTED_LANGUAGES`). Dodanie kolejnego języka =
   nowy plik słownika + jedna pozycja w tablicy, reszta (routing, cookie, przełącznik UI) generyczna
   względem liczby języków, nic nie zakłada "2" ani "3" na sztywno.
2. **Mechanizm/biblioteka — własne, proste rozwiązanie, zero zależności.** Słownik to zwykły obiekt
   TS (`Record<klucz, string>`) per język, `t(język, klucz, params?)` podstawia `{nazwa}` przez
   `String.replace`. Parytet kluczy między językami wymuszony **typem** (`satisfies
   Record<KluczTlumaczenia, string>` w każdym słowniku poza bazowym) — brakujący/dodatkowy klucz to
   błąd kompilacji, nie runtime. Żadna biblioteka i18n (react-i18next, next-intl...) nie była
   potrzebna przy tej skali (5 kluczy, 3 języki) — świadomie odłożone jako "gdy/jeśli słownik
   urośnie na tyle, że ręczne narzędzia przestaną wystarczać", nie zbudowane z góry pod hipotetyczną
   skalę.
3. **B.3 rozstrzygnięte — klucz + params, nigdy gotowy tekst z jądra.** `Warning.i18nKey`/`params`
   i `CalcResult.Assumption` jako `string | {kod, params?}` (już wcześniej w kontrakcie, rozdz. 03) —
   `lib/core` nigdy nie generuje tekstu dla użytkownika, tylko klucz. Wyłącznie warstwa prezentacji
   (`t()`) rozwiązuje klucz → tekst, w języku znanym dopiero na granicy request/render, nie w
   momencie liczenia. To odpowiada wprost na pytanie B.3 — bez przekazywania języka jako parametru
   do każdej funkcji domenowej, jądro zostaje czyste i bezstanowe względem języka.
4. **Wykrywanie/wybór języka — oba, z jawnym priorytetem, i to jest to samo pytanie co 17.4a
   standardu.** Automatyczne wykrycie tylko przy PIERWSZEJ wizycie (middleware czyta nagłówek HTTP
   `Accept-Language`, ustawia cookie) — każda kolejna wizyta czyta zapisaną cookie i **nigdy** jej
   nie nadpisuje automatycznym wykryciem, nawet jeśli nagłówek przeglądarki się zmieni. Jawny wybór
   usera w Ustawieniach zawsze wygrywa i jest trwały (cookie, 365 dni). Per-urządzenie (cookie), nie
   per-konto — ten projekt nie ma dziś kont (rozdz. 18 nieaktywny), więc pytanie "cookie vs konto"
   nie było jeszcze testowane w praktyce; przy pierwszym projekcie rodziny z aktywnymi kontami i
   i18n jednocześnie wart ponownego sprawdzenia (czy wybór języka powinien podążać za kontem między
   urządzeniami, czy zostać per-urządzenie nawet wtedy).
5. **Fallback przy brakującym tłumaczeniu — widoczny klucz, nigdy cichy fallback do języka
   bazowego.** `⚠ [KLUCZ]` w miejscu tekstu + zgłoszenie przez `Reporter` (rozdz. 03/15) z pełnym
   kontekstem technicznym. Świadomy wybór: cichy fallback do polskiego wygląda na "działające"
   tłumaczenie i ukrywa lukę przed osobą testującą inny język — ten sam powód co ogólna zasada
   projektu "nie ukrywaj braku danych" (`docs/standards/00-filozofia.md`).
6. **Treści normatywne/bezpieczeństwa — świadomie NIEROZSTRZYGNIĘTE, wciąż otwarte.** Ten projekt
   nie przetłumaczył dotąd żadnej treści bezpieczeństwa-krytycznej (progi z norm PN/IEC, ostrzeżenia
   🔴) — 5 zmigrowanych kluczy to generyczna walidacja formularzy (`WARTOSC-NIEDODATNIA` itp.), nie
   fakty inżynierskie. Ryzyko utraty precyzji prawnej/technicznej przy tłumaczeniu normy nadal
   realne i nierozwiązane w praktyce — to jedyny punkt tej sekcji, który pozostaje pytaniem, nie
   odpowiedzią, i powinien nim zostać w rozdziale standardu (jawna, nazwana luka, nie cicho
   pominięta — rozdz. 14, sekcja "Znane luki").

## Następny krok

Gotowe do konsolidacji w sesji nad `new-app-standards` — poza punktem C6, który zasługuje na jawne
oznaczenie jako "otwarte" w treści nowego rozdziału, nie na rozstrzygnięcie na siłę bez realnego
przypadku testowego.
