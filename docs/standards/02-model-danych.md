# 02 — Model danych i profile regionalne

Powiązane: [01 Architektura](01-architektura.md) · [05 Baza danych i offline-first](05-baza-danych-offline.md) · [14 Proces i pamięć](14-proces-i-pamiec.md)

---

## 2.1. Profile regionalne jako dane, nie kod

**Reguła.** Wszystko, co zależy od kraju/regionu (strefy klimatyczne, normy, waluta, jednostki, ceny referencyjne, dopuszczalne tolerancje), żyje w plikach danych (JSON/YAML) walidowanych schematem (np. Zod, Pydantic), nigdy w `if (kraj === 'PL')` rozsypanym po kodzie.

**Uzasadnienie.** Nowy kraj/region = nowy plik danych + jego walidacja, bez zmian w jądrze obliczeniowym. Struktura jest wielokrajowa od pierwszego dnia, nawet jeśli na start istnieje tylko jeden profil.

**Konsekwencja.** Start: jeden profil (np. `PL`). Dodanie drugiego nie wymaga refaktoringu jądra — jeśli wymaga, oznacza to, że reguła została złamana wcześniej i trzeba to naprawić, zanim dojdzie drugi profil.

## 2.2. Nazewnictwo encji 1:1 ze źródłem domenowym

**Reguła.** Nazwy encji i modułów przyjmuje się wprost ze specyfikacji źródłowej projektu (np. z "Biblii" danej domeny), nie tłumaczy się ich swobodnie. Jedna funkcja specyfikacji → jeden nazwany moduł o tym samym identyfikatorze.

**Uzasadnienie.** Zachowanie mapowania 1:1 to warunek integralności (rozdział 14) i szybkiej nawigacji między dokumentem specyfikacji a kodem — ktoś czytający specyfikację musi umieć od razu znaleźć odpowiadający jej kod, i odwrotnie.

## 2.3. Model projektu użytkownika

**Reguła.** Projekt użytkownika (jednostka pracy w aplikacji) zawiera co najmniej: identyfikator, nazwę, lokalizację ogólną, `schema_version`, datę utworzenia i modyfikacji, parametry domenowe, wybrane technologie/warianty, wyniki kalkulatorów, ostrzeżenia, załączniki (zdjęcia/notatki), historię decyzji, harmonogram i kosztorys (jeśli dotyczy domeny).

**Uzasadnienie.** To jest minimalny zestaw pól, żeby projekt dał się w pełni odtworzyć, wyeksportować i zsynchronizować bez utraty kontekstu.

## 2.4. Wersjonowanie schematu i migracje

**Reguła.** Każdy zapis projektu ma pole `schema_version`, rosnące przy każdej zmianie kształtu danych. Migracje danych są: jednokierunkowe, testowane, odwracalne przez kopię zapasową, opisane w historii zmian.

**Uzasadnienie.** Bez wersjonowania schematu każda zmiana kształtu danych wejściowych ryzykuje uszkodzeniem projektów zapisanych wcześniejszą wersją aplikacji.

**Konsekwencja.** Preferowany jest **jeden, scentralizowany, deklaratywny mechanizm migracji** ("migruj z wersji N do N+1"), a nie rozproszone po każdym module doraźne `?? wartość_domyślna` w kodzie odczytu. To drugie jest dopuszczalne tylko jako świadomy, tymczasowy kompromis na wczesnym etapie — ma trafić do `docs/memory.md` jako znany dług, nie zostać cichym stanem docelowym.

## 2.5. Zakaz luźnych struktur między warstwami

**Reguła.** Nie przekazuj luźnych słowników/obiektów `any` między warstwami, jeśli struktura danych jest znana. Osobne typy dla wejścia i wyniku każdej operacji, jawne jednostki w nazwach pól (`length_m`, `load_kn_m2`, nie `length`, `load`).

**Uzasadnienie.** Luźna struktura ukrywa błędy typu i jednostki do czasu wykonania — jawny typ wyłapuje je przy kompilacji/przed testami.
