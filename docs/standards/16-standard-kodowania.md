# 16 — Standard kodowania

Powiązane: [00 Filozofia](00-filozofia.md) · [01 Architektura](01-architektura.md) · [02 Model danych](02-model-danych.md) · [03 Jądro logiki domenowej](03-jadro-obliczeniowe.md) · [07 Bezpieczeństwo](07-bezpieczenstwo.md)

Ten rozdział, w odróżnieniu od reszty pakietu, nie dotyczy jednej warstwy czy jednego tematu — to przekrojowe zasady rzemiosła kodu, obowiązujące w każdej warstwie i (w zakresie, w jakim mają sens) niezależnie od języka/frameworka konkretnego projektu. Gdzie standard konkretnego projektu (np. konfiguracja lintera) idzie dalej niż to, co tu opisane — dobrze, to jest podłoga, nie sufit.

---

## 16.1. Priorytety jakości kodu

**Reguła.** Gdy trzeba wybierać między konkurującymi wartościami, kolejność jest stała:

1. **poprawność** — kod robi to, co ma robić, także na przypadkach brzegowych,
2. **bezpieczeństwo** — nie tworzy furtki, wycieku danych, ryzyka dla użytkownika,
3. **testowalność** — da się zweryfikować automatycznie, bez ręcznego klikania za każdym razem,
4. **czytelność** — ktoś inny (człowiek albo AI) rozumie kod bez tłumaczenia ustnego,
5. **modularność** — zmiana w jednym miejscu nie wymaga dotykania dziesięciu innych,
6. dopiero na końcu: **krótkość i "sprytność"**.

**Uzasadnienie.** Zwięzły kod, który jest trudny do zrozumienia za pół roku, jest tańszy dziś i droższy jutro — a "jutro" w tym standardzie oznacza też sesję AI bez pamięci dzisiejszego kontekstu, która musi zrozumieć kod wyłącznie z niego samego i z `docs/memory.md`.

## 16.2. Nazewnictwo

**Reguła.** Konwencja wielkości liter i formatu nazw idzie za językiem/frameworkiem projektu (np. `camelCase` dla zmiennych/funkcji i `PascalCase` dla klas/typów w TypeScript, `snake_case` w Pythonie) — nie jest przedmiotem tego standardu i nie miesza się dwóch konwencji w jednym projekcie. To, co jest przedmiotem tego standardu, obowiązuje niezależnie od języka:

- **Zakaz nazw nic-nie-mówiących**: `data`, `temp`, `x`, `value` i podobne są zabronione, chyba że zakres zmiennej jest na tyle mały i oczywisty (np. `x` we wzorze matematycznym o długości trzech linijek), że nazwa nie traci znaczenia.
- **Jednostka w nazwie**, gdy wartość ma jednostkę fizyczną/domenową: `length_m`, `load_kn_m2`, `expiry_date`, nie `length`, `load`, `date` (patrz też 02.5).

## 16.3. Projektowanie funkcji

**Reguła.** Funkcja:
- wykonuje jedno zadanie — jeśli nazwa potrzebuje "i" (`validateAndSave`), to często sygnał, że powinny być dwie funkcje,
- ma jawne typy argumentów i wyniku,
- **nie modyfikuje stanu globalnego** poza swoim jawnym wynikiem (patrz też 01.1 — funkcje domenowe są czyste),
- **nie wykonuje ukrytych operacji I/O** — jeśli funkcja robi zapytanie sieciowe/dyskowe, to widać to z jej sygnatury albo z warstwy, w której żyje (infrastructure/application — 01.1), nigdy nie jest to niespodzianka wewnątrz funkcji, która z nazwy wygląda na czystą,
- **zwraca błąd domenowy zamiast `null`/`undefined`/`None`, gdy brak wyniku jest błędem**, a nie prawidłowym stanem. Rozróżnienie jest istotne: `null` jako "nie ma jeszcze danych" (patrz status `INCOMPLETE`, 03.3) to co innego niż `null` jako "coś poszło nie tak, ale funkcja milczy o tym".

## 16.4. Modele danych: niemutowalność i zamknięte zbiory wartości

**Reguła.** Modele domenowe są, gdzie to praktyczne, **niemutowalne** (w TypeScript: `readonly`, `as const`, brak mutacji obiektu po utworzeniu; w Pythonie: `dataclass(frozen=True)`; analogicznie w innych językach). Zamknięty zbiór dopuszczalnych wartości (status, poziom, tryb) jest **typem** — enumem albo unią literałów — nigdy dowolnym stringiem, który koder ma pamiętać, żeby wpisać poprawnie.

**Uzasadnienie.** Niemutowalność eliminuje całą klasę błędów "ktoś zmienił obiekt w miejscu, którego się nie spodziewałeś, trzy wywołania funkcji dalej". Typ zamknięty zamiast stringa przenosi literówkę z runtime error (albo, gorzej, cichej pomyłki) na błąd kompilacji.

## 16.5. Błędy: nazwane typy, nigdy generyczne połykanie

**Reguła.** Błędy domenowe mają nazwane typy/klasy (np. `ValidationError`, `CalculationError`, `ConfigurationError`, `StorageError` — konkretny zestaw zależy od projektu), nie generyczny `Error`/`Exception` bez rozróżnienia. To uzupełnia zasadę z 3.6 (zero cichych `catch {}` / `except: pass`, każdy błąd obsłużony/opakowany/zaraportowany) o dodatkowy wymóg: samo "nie połykaj błędu po cichu" nie wystarczy, jeśli wywołujący i tak nie może rozróżnić, z jakim typem błędu ma do czynienia, żeby zareagować inaczej na błąd walidacji niż na błąd sieci.

## 16.6. Komentarze

**Reguła.** Komentarz tłumaczy **dlaczego**, nie **co robi kod** — dobrze nazwane zmienne i funkcje mówią "co" same. Komentarz wart napisania to: nieoczywiste ograniczenie, obejście konkretnego błędu, powód biznesowy/domenowy decyzji, ostrzeżenie przed pułapką, którą ktoś już raz odkrył (patrz `docs/memory.md`, rozdział 14).

**Konsekwencja dla funkcji domenowych.** Nazwa wzoru/reguły, znaczenie zmiennych, jednostki, źródło/dokument odniesienia i ograniczenia zastosowania nie muszą żyć w komentarzu — żyją w kontrakcie wyniku w runtime (`formula`, `inputs`, `assumptions`, rozdział 03.2) i w teście z wartością referencyjną (rozdział 03.4). To jest **silniejsza** gwarancja niż docstring: kontrakt i test nie mogą się rozjechać z kodem po cichu tak, jak potrafi się rozjechać komentarz, którego nikt nie zaktualizował.

## 16.7. Efekt uboczny `await`-a nie może cicho nadpisać świeższą akcję użytkownika

[16.09.2026] ✅ DODANO — źródło: zero-waste (U.4). Ten sam kształt błędu wystąpił w tym projekcie **trzy razy, w trzech niezależnych ekranach**: wzorzec `setBusy(true)` → `await mutacja()` → bezwarunkowe nadpisanie/zresetowanie stanu lokalnego (`setPole('')`, wybrany tryb, zaznaczenie) po zakończeniu `await`. Gdy użytkownik zdążył zmienić ten sam stan, zanim operacja się zakończyła (realny scenariusz przy szybkim wpisywaniu/klikaniu, nie tylko wyścig testu), spóźniony reset kasował jego świeżą akcję po cichu — bez błędu, bez ostrzeżenia, czasem z trwale zablokowanym UI w efekcie.

**Reguła.** Asynchroniczna operacja, która na końcu resetuje/nadpisuje powiązany stan lokalny, zapamiętuje wartość tego stanu **PRZED** `await` i po zakończeniu operacji nadpisuje warunkowo — funkcyjnym `setState` porównującym wartość bieżącą z zapamiętaną (`setPole((current) => current === zapamietana ? '' : current)`), nigdy bezwarunkowo. Jeśli użytkownik zmienił stan w międzyczasie, jego świeższa wartość zostaje nietknięta.

**Znalezienie tego wzorca błędu jest metodologicznie powiązane z 10.7** — wykryty nie przez zgadywanie, tylko przez odmowę zamknięcia niestabilnego testu e2e etykietą "flaky" bez diagnozy.
