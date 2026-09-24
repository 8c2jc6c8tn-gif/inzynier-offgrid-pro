# 02 — Model danych i profile kontekstowe

Powiązane: [01 Architektura](01-architektura.md) · [05 Baza danych i offline-first](05-baza-danych-offline.md) · [14 Proces i pamięć](14-proces-i-pamiec.md)

---

## 2.1. Profile kontekstowe jako dane, nie kod

**Reguła.** Wszystko, co zależy od kontekstu zewnętrznego wobec logiki domenowej (kraj/region, waluta, jednostki, lokalne przepisy/normy, wartości referencyjne, dopuszczalne tolerancje), żyje w plikach danych (JSON/YAML) walidowanych schematem (np. Zod, Pydantic), nigdy w `if (kraj === 'PL')` rozsypanym po kodzie.

**Uzasadnienie.** Nowy kraj/region/wariant = nowy plik danych + jego walidacja, bez zmian w jądrze obliczeniowym. Struktura jest wielowariantowa od pierwszego dnia, nawet jeśli na start istnieje tylko jeden profil.

**Konsekwencja.** Start: jeden profil (np. `PL`). Dodanie drugiego nie wymaga refaktoringu jądra — jeśli wymaga, oznacza to, że reguła została złamana wcześniej i trzeba to naprawić, zanim dojdzie drugi profil.

[24.09.2026] ✅ DODANO — źródło: farmer360.io (U.4). **Wartości regulowane prawem jako dane z metadanymi weryfikacji, nie gołe liczby.** Wartość referencyjna regulowana prawem (stawka, próg, termin, limit, norma) w pliku danych z reguły wyżej nigdy nie jest zapisana jako goła liczba — niesie obowiązkowo: `validFrom`/`validTo` (data obowiązywania), `legalBasis` (podstawa prawna/normatywna — przepis, paragraf, norma), `verifiedBy` (kto/co zweryfikowało wartość — osoba, partner prawny/podatkowy, źródło oficjalne), `confidence` (✅ zweryfikowane / 🔎 do weryfikacji). Wartość pochodząca z materiału generowanego przez AI (burza mózgów, research) ma `confidence: 🔎` do czasu jawnej weryfikacji eksperckiej — obliczenie może jej używać, żeby nie blokować budowy, ale UI/audyt (rozdział 15, Y.11) musi umieć odróżnić wartości zweryfikowane od czekających na weryfikację. Obliczenie zawsze używa wartości ważnej na dzień zdarzenia (`validFrom`/`validTo`), nigdy "aktualnie wpisanej".

**Uzasadnienie pola strukturalnego, nie zapisu procesowego w `docs/memory.md`.** To dane (2.1), nie jednorazowa decyzja polityczna jak w 4.4 ("które twarde stopy bez wyjątku") — skala (dziesiątki/setki wartości referencyjnych, rosnąca w czasie) i możliwość automatycznej kontroli (build/audyt Y.11 może failować przy braku `verifiedBy`/`validFrom` przy nowej wartości) przeważają nad zapisem procesowym, którego nic nie wymusi przy dodaniu kolejnej wartości za pół roku. Źródło decyzji: właściciel repo, 24.09.2026.

## 2.2. Nazewnictwo encji 1:1 ze źródłem domenowym

**Reguła.** Nazwy encji i modułów przyjmuje się wprost ze specyfikacji źródłowej projektu (np. z dokumentu domenowego/"konstytucji" danego produktu), nie tłumaczy się ich swobodnie. Jedna funkcja specyfikacji → jeden nazwany moduł o tym samym identyfikatorze.

**Uzasadnienie.** Zachowanie mapowania 1:1 to warunek integralności (rozdział 14) i szybkiej nawigacji między dokumentem specyfikacji a kodem — ktoś czytający specyfikację musi umieć od razu znaleźć odpowiadający jej kod, i odwrotnie.

## 2.3. Model rekordu/projektu użytkownika

**Reguła.** Główna jednostka pracy w aplikacji (projekt, wpis, rekord — nazwa zależy od domeny) zawiera co najmniej: identyfikator, nazwę, kontekst ogólny (np. lokalizację, kategorię), `schema_version`, datę utworzenia i modyfikacji, parametry domenowe, wybrane warianty, wyniki logiki domenowej, ostrzeżenia, załączniki (zdjęcia/notatki), historię decyzji, oraz — jeśli domena tego wymaga — harmonogram i kosztorys.

**Uzasadnienie.** To jest minimalny zestaw pól, żeby jednostkę pracy dało się w pełni odtworzyć, wyeksportować i zsynchronizować bez utraty kontekstu.

## 2.4. Wersjonowanie schematu i migracje

**Reguła.** Każdy zapis danych ma pole `schema_version`, rosnące przy każdej zmianie kształtu danych. Migracje danych są: jednokierunkowe, testowane, odwracalne przez kopię zapasową, opisane w historii zmian.

**Uzasadnienie.** Bez wersjonowania schematu każda zmiana kształtu danych wejściowych ryzykuje uszkodzeniem danych zapisanych wcześniejszą wersją aplikacji.

**Konsekwencja.** Preferowany jest **jeden, scentralizowany, deklaratywny mechanizm migracji** ("migruj z wersji N do N+1"), a nie rozproszone po każdym module doraźne `?? wartość_domyślna` w kodzie odczytu. To drugie jest dopuszczalne tylko jako świadomy, tymczasowy kompromis na wczesnym etapie — ma trafić do `docs/memory.md` jako znany dług, nie zostać cichym stanem docelowym.

## 2.5. Zakaz luźnych struktur między warstwami

**Reguła.** Nie przekazuj luźnych słowników/obiektów `any` między warstwami, jeśli struktura danych jest znana. Osobne typy dla wejścia i wyniku każdej operacji, jawne jednostki w nazwach pól (`length_m`, `expiry_date`, nie `length`, `date`).

**Uzasadnienie.** Luźna struktura ukrywa błędy typu i jednostki do czasu wykonania — jawny typ wyłapuje je przy kompilacji/przed testami.
