# 05 — Baza danych i offline-first

Powiązane: [01 Architektura](01-architektura.md) · [02 Model danych](02-model-danych.md) · [13 Droga web → mobile](13-droga-mobile.md)

---

## 5.1. Zapisuj Seed, nigdy Wynik

**Reguła.** Jedyną trwałą daną jest surowe wejście użytkownika ("Seed"). Wyniki obliczeń/decyzji ("Wynik") są zawsze przeliczane od nowa po wczytaniu — nigdy nie są jedynym źródłem prawdy zapisanym na dysku.

**Uzasadnienie.** Reguły i logika ewoluują. Jeśli zapiszemy wynik zamiast danych źródłowych, poprawka błędu w logice domenowej nigdy nie dotrze do już zapisanych danych — użytkownik zobaczy stary, błędny wynik na zawsze, mimo że aplikacja "naprawiła" logikę.

**Konsekwencja w kodzie.** Typy `PersistedState` (Seed) i `ComputedState` (Wynik) są rozdzielone na poziomie typów, nie tylko konwencji. Mechanizm trwałości (np. `persist` w store) ma trwałość ograniczoną wyłącznie do Seedów; po wczytaniu z dysku silnik obliczeniowy (rozdział 01, 1.2) przelicza wszystkie wyniki od zera.

## 5.2. StorageAdapter

**Reguła.** Cały stan aplikacji jest zapisywany/odczytywany przez jeden interfejs `StorageAdapter`, nigdy przez bezpośrednie wywołania konkretnej bazy rozsiane po kodzie aplikacji. Implementacja: IndexedDB (web) dziś, SQLite (mobile) jutro — bez zmiany logiki, która z adaptera korzysta.

**Zakaz.** `localStorage` jako baza danych stanu domenowego. Dopuszczalny wyłącznie dla drobnych, nieistotnych preferencji UI urządzenia (np. ostatnio wybrany motyw kolorystyczny) — nigdy dla danych domenowych.

## 5.3. Offline-first jako wymóg, nie dodatek

**Reguła.** Funkcje podstawowe muszą działać w pełni offline po pierwszym pobraniu danych: otwieranie projektu/widoku, logika domenowa, zapis danych, dokumentacja zdjęciowa, raport roboczy, lokalne wyszukiwanie w dokumentacji. Funkcje wymagające sieci (synchronizacja chmurowa, ciężkie modele AI, aktualizacje danych zewnętrznych) są **dodatkiem**, nigdy warunkiem podstawowego działania.

**Konsekwencja (web).** Dane trwałe w IndexedDB, service worker do cache'owania assetów, jednorazowe zapytania online (np. dane referencyjne, geolokalizacja) buforowane na stałe po pierwszym pobraniu.

## 5.4. Struktura magazynu

**Reguła.** Jedna, scentralizowana baza (wersjonowana wg 2.4), z osobnymi "magazynami"/tabelami dla różnych klas danych — np. dane projektu (Seed) osobno od załączników binarnych (zdjęcia jako natywny `Blob`, nigdy base64 w tym samym rekordzie co dane tekstowe — narzut pamięciowy). Scentralizowanie ma celowo unikać rywalizacji wielu niezależnych baz o operacje strukturalne (np. `onupgradeneeded` w IndexedDB).

## 5.5. Odporność na uszkodzone/starsze dane

**Reguła.** Mechanizm wczytywania danych ma naprawiać typowe, znane uszkodzenia struktury (np. tablica zserializowana błędnie jako obiekt przez wcześniejszy bug) w jednym miejscu, z testami odzwierciedlającymi dokładnie historyczne przypadki, które taką naprawę uzasadniły. Nie jest to zamiennik migracji wersji schematu (2.4) — to dodatkowa warstwa odporności na błędy, które migracja nie przewidziała.
