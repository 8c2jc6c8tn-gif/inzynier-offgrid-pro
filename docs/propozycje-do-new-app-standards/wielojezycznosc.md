# PROPOZYCJA dla `new-app-standards` — Nowy rozdział: Wielojęzyczność (i18n)

> **Status: SZKIELET, nie propozycja gotowa do przyjęcia.** Ten plik to szkic rozszerzenia,
> powiązany ze zgłoszeniem w `docs/wklad-do-standardu.md`. **Nie jest częścią `docs/standards/`** i
> nie ma mocy obowiązującej. Podobnie jak `logowanie-i-konta.md` w tym samym folderze — celowo
> niedokończony, bo właściciel projektu zlecił oparcie rekomendacji na realnej implementacji w apce
> `zero-waste`, a ta sesja nie miała do niej dostępu. Struktura identyczna: (A) skala luki, (B) co
> wynika już dziś z reguł standardu bez zero-waste, (C) pytania do rozstrzygnięcia po przejrzeniu
> zero-waste.

## A. Skala luki — sprawdzone, nie zgadywane

W całym standardzie (`docs/standards/00`-`16`) i w GOD BOOK jest dokładnie **jedno** zdanie
dotyczące wielojęzyczności — w `01-architektura.md`: i18n wymieniona jako jeden z elementów, które
mają żyć w warstwie domenowej (`domain/core`) jako czyste funkcje, nie w UI. To reguła **gdzie**
umieścić mechanizm, nie strategia **jak** go zbudować (które języki, format plików tłumaczeń,
przełącznik w UI, fallback przy brakującym tłumaczeniu). Zero dedykowanego rozdziału. W tym projekcie
(`inzynier-offgrid-pro`) — zero implementacji: cała treść UI wpisana na sztywno po polsku,
`package.json` bez żadnej biblioteki i18n.

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

## C. Pytania do rozstrzygnięcia po przejrzeniu zero-waste

1. **Zakres języków** — ile i jakich języków zero-waste faktycznie obsługuje (nie ile planuje) —
   punkt odniesienia dla realistycznego zakresu rekomendacji, zamiast projektować "na wyrost" pod
   dowolną liczbę języków.
2. **Mechanizm/biblioteka** — jakiej biblioteki i18n używa zero-waste (jeśli w ogóle — może to
   własne, proste rozwiązanie zamiast zależności), i czy to ma zostać rekomendacją dla całej
   rodziny, czy zostaje decyzją lokalną tamtego projektu.
3. **Rozwiązanie punktu B.3 wyżej w praktyce** — jak zero-waste faktycznie tłumaczy komunikaty
   pochodzące z logiki domenowej/walidacji (jeśli ma taką warstwę) — to najbardziej wartościowa
   rzecz do przeniesienia stąd, bo dotyka rdzenia architektury współdzielonej przez całą rodzinę.
4. **Wykrywanie/wybór języka** — automatyczne (język przeglądarki/systemu) vs jawny wybór
   użytkownika vs oba z priorytetem — i czy wybór jest per-urządzenie czy zapisany w koncie
   (zazębia się z `logowanie-i-konta.md` w tym samym folderze, jeśli konto istnieje).
5. **Fallback przy brakującym tłumaczeniu** — pokazać klucz surowy (zły UX, ale widoczny błąd),
   pokazać język bazowy (dobry UX, ale ukrywa brak tłumaczenia), czy inaczej.
6. **Treści normatywne/bezpieczeństwa** — ten projekt (Offgrid) ma dane bezpieczeństwa-krytyczne
   (progi, ostrzeżenia 🔴) pochodzące z norm w jednym języku źródłowym (polskie tłumaczenia norm
   PN/IEC) — tłumaczenie takiego komunikatu na inny język niesie ryzyko utraty precyzji prawnej/
   technicznej, którego zero-waste (inna domena, prawdopodobnie bez tego ryzyka) może nie mieć —
   wart osobnej uwagi w finalnym rozdziale, nawet jeśli zero-waste nie daje na to gotowej odpowiedzi.

## Następny krok

Jak w `logowanie-i-konta.md` — po dołączeniu `zero-waste` do sesji, sekcja C ma zostać zastąpiona
konkretnymi odpowiedziami z realnego kodu, a punkt B.3 (najważniejsza decyzja architektoniczna)
rozstrzygnięty na tej podstawie, zanim ten plik przejdzie do statusu gotowego do konsolidacji.
