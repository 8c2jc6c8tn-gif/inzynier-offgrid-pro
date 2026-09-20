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

[16.09.2026] ✅ DOPRECYZOWANO — źródło: właściciel repo, po znaleziskach inzynier-offgrid-pro i inzynier-szkieletowy-pro (U.4) o błysku przy odświeżeniu. `localStorage` dla drobnej preferencji UI eliminuje błysk tylko, jeśli odczyt i zastosowanie dzieje się **przed pierwszym malowaniem** (blokujący, synchroniczny `<script>` w `<head>`/na początku `<body>`, czytający `localStorage` i przełączający klasę/atrybut na `<html>` — wzorzec sprawdzony w praktyce dla motywu kolorystycznego w inzynier-offgrid-pro), **nie** jako efekt uruchamiany po hydratacji Reacta (`useEffect`) — ten drugi wzorzec daje dokładnie ten sam błysk co próba obsługi języka samym `localStorage` (17.4), z tego samego powodu: JS uruchamia się już PO pierwszym malowaniu.

**Rozróżnienie, które rozstrzyga który mechanizm zastosować.** Preferencja, której zmiana to wyłącznie przełączenie klasy/atrybutu CSS (motyw jasny/ciemny, wysoki kontrast, rozmiar czcionki) — blokujący skrypt pre-paint + `localStorage` w pełni wystarcza, bez potrzeby serwera. Preferencja wymagająca innej TREŚCI tekstowej w HTML (język UI) — dla projektu z twardym wymogiem offline (5.3) TEN SAM wzorzec (blokujący skrypt pre-paint) rozszerzony o treść wszystkich obsługiwanych języków w bundlu klienckim, cache'owanym przez service worker, nie cookie+server-side (17.4, korekta 16.09.2026 — cookie+server-side zostaje wyłącznie nazwanym wyjątkiem dla projektu z jawną, udokumentowaną decyzją "głównie online", jak zero-waste). Koszt większego payloadu (wszystkie języki naraz zamiast jednego dociąganego serwerowo) jest tu właściwym, zaakceptowanym kosztem offline-first, nie problemem do optymalizacji. Efekt uboczny po hydratacji (`useEffect`) w ŻADNYM z tych przypadków nie eliminuje błysku — jest poprawny wyłącznie dla stanu, którego początkowa wartość naprawdę nie ma znaczenia wizualnego (np. licznik, dane doładowywane asynchronicznie).

## 5.3. Offline-first jako wymóg, nie dodatek

**Reguła.** Funkcje podstawowe muszą działać w pełni offline po pierwszym pobraniu danych: otwieranie projektu/widoku, logika domenowa, zapis danych, dokumentacja zdjęciowa, raport roboczy, lokalne wyszukiwanie w dokumentacji. Funkcje wymagające sieci (synchronizacja chmurowa, ciężkie modele AI, aktualizacje danych zewnętrznych) są **dodatkiem**, nigdy warunkiem podstawowego działania.

**Konsekwencja (web).** Dane trwałe w IndexedDB, service worker do cache'owania assetów, jednorazowe zapytania online (np. dane referencyjne, geolokalizacja) buforowane na stałe po pierwszym pobraniu.

## 5.4. Struktura magazynu

**Reguła.** Jedna, scentralizowana baza (wersjonowana wg 2.4), z osobnymi "magazynami"/tabelami dla różnych klas danych — np. dane projektu (Seed) osobno od załączników binarnych (zdjęcia jako natywny `Blob`, nigdy base64 w tym samym rekordzie co dane tekstowe — narzut pamięciowy). Scentralizowanie ma celowo unikać rywalizacji wielu niezależnych baz o operacje strukturalne (np. `onupgradeneeded` w IndexedDB).

## 5.5. Odporność na uszkodzone/starsze dane

**Reguła.** Mechanizm wczytywania danych ma naprawiać typowe, znane uszkodzenia struktury (np. tablica zserializowana błędnie jako obiekt przez wcześniejszy bug) w jednym miejscu, z testami odzwierciedlającymi dokładnie historyczne przypadki, które taką naprawę uzasadniły. Nie jest to zamiennik migracji wersji schematu (2.4) — to dodatkowa warstwa odporności na błędy, które migracja nie przewidziała.

## 5.6. Blob po przejściu przez Web Workera: odtwórz przed zapisem do IndexedDB

**Reguła.** Gdy `Blob` powstaje w Web Workerze (np. wynik kompresji zdjęcia, przekazany do głównego wątku przez `postMessage`) i ma trafić do IndexedDB (5.2), odtwórz go z surowych bajtów tuż przed zapisem — `await blob.arrayBuffer()` → `new Blob([bytes], {type})` — zawsze, nie warunkowo dla jednej platformy.

**Uzasadnienie.** Ten sam kod (kompresja w Workerze → zapis `Blob` do IndexedDB) działa bez zarzutu na Chrome/Desktop, ale na Safari/iOS rzuca `UnknownError: Error preparing Blob/File data to be stored in object store` przy każdej próbie zapisu — Blob, który przeszedł przez granicę Workera, bywa tam niezapisywalny. Błąd nie ujawnia się w typowym CI: silniki testowe (jsdom/happy-dom) nie mają prawdziwej implementacji IndexedDB Safari, a e2e uruchamiany na Chromium tego wariantu nie widzi — realnie wykrywalny dopiero na fizycznym urządzeniu Apple.

**Konsekwencja.** Koszt odtworzenia Bloba jest znikomy — stosuj go zawsze przy tej ścieżce (Worker → IndexedDB), nie tylko po wykryciu problemu na Safari.
