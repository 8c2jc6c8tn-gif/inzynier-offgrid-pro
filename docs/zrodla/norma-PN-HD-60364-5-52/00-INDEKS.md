# Indeks — PN-HD 60364-5-52:2011 (Instalacje elektryczne niskiego napięcia — Oprzewodowanie)

Źródło: `docs/zrodla/PN-HD-60364-5-52-2011-Instalacje-elektryczne-niskiego-napiecia-Oprzewodowanie.pdf` (zakupiona, oficjalna norma PKN, 96 stron, dokument skanowany — treść poniżej to wynik OCR, patrz zastrzeżenie niżej).

## ⚠️ Zastrzeżenie o jakości OCR — WAŻNE, przeczytaj przed użyciem jakiejkolwiek liczby

Oryginalny plik PDF to **skan**, nie tekst (0 znaków przy bezpośredniej ekstrakcji tekstu z każdej
sprawdzonej strony). Treść w plikach `docs/zrodla/norma-PN-HD-60364-5-52/*.md` pochodzi z OCR
(tesseract, pakiet językowy polski, 300 DPI) — **nagłówki klauzul i tytuły tabel są wiarygodne**
(sprawdzone ręcznie), ale **treść samych tabel liczbowych (Załącznik B i pokrewne) może zawierać
błędy OCR w cyfrach** (np. `8`↔`3`, `0`↔`O`, rozjechane kolumny). Zgodnie z Dyrektywą #3
(`02_Dyrektywy_AI_Projektu.md`) i CLAUDE.md ("nie wymyślaj brakujących danych") — **przed użyciem
jakiejkolwiek konkretnej wartości liczbowej z Załącznika A/C/E/F/G/H/I/ZA-ZC w kodzie kalkulatora,
zweryfikuj ją wizualnie względem oryginalnego PDF** (odpowiednia strona, renderowana z pliku
źródłowego — numery stron w tym indeksie odpowiadają numeracji PDF liczonej od 0), nie ufaj samemu
tekstowi OCR dla liczb bezpieczeństwa-krytycznych. **Załącznik B jest już w pełni zweryfikowany i
skorygowany — patrz niżej — reszta dokumentu (Załączniki A, C, E, F, G, H, I, ZA-ZC oraz klauzule
520-529) ma tylko wstępny, niesystematyczny spot-check, nie pełną weryfikację.**

**05.09.2026 — pełna weryfikacja i korekta Załącznika B (str. 33-58, wszystkie 26 stron, Tablice
B.52.1-B.52.21).** Pierwszy spot-check (jedna strona, Tablica B.52.4) znalazł 3 błędy OCR w
cyfrach i zaniepokoił na tyle, że zlecono **pełną wizualną weryfikację wszystkich 26 stron**
(5 równoległych przebiegów, każdy porównujący bezpośredni odczyt renderu strony z tekstem OCR,
komórka po komórce) — nie tylko pojedynczych błędnie odczytanych cyfr, ale też **całych brakujących
kolumn i wierszy**, których sam spot-check by nie wykrył. Wynik: **~35 błędów znalezionych i
poprawionych** w pliku `zalacznik-B-tablice-obciazalnosci.md`, w tym:
- pojedyncze błędnie odczytane cyfry (np. `2,5`→`28`, `13,5`→`13:95`, `77`→`Ł44`/`mr`/`ŚL`,
  `BD`→`75`, `144`→`77`, `FT`→`77`, `22`→`32`) — Tablice B.52.2, B.52.4, B.52.5, B.52.6, B.52.8,
  B.52.9, B.52.12, B.52.14;
- **całe kolumny cicho pominięte** w wybranych wierszach (nie błędny znak, brak znaku w ogóle) —
  Tablice B.52.6 i B.52.8 (500 V, przekroje 1,5/2,5/4 mm²);
- **cały wiersz danych całkowicie brakujący** (Tablica B.52.20, Drabinki instalacyjne, Stykające
  się, wiersz "3") i jeden wiersz nieodzyskiwalny z samego OCR (ten sam załącznik, Perforowane
  korytka, Oddalone od siebie, wiersz "3") — oba odtworzone z wizualnego odczytu strony;
- **Tablica B.52.1** (str. 36-37, wykaz metod referencyjnych A1/A2/B1/B2/C/D/D2/E/F/G) i **Tablice
  B.52.16/B.52.17** (str. 51, współczynniki poprawkowe/zmniejszające) miały strukturalne
  uszkodzenie OCR na tyle poważne (rozjechane kolumny, brakujące kody metod i odnośniki), że
  zostały **w całości przepisane ręcznie** z wizualnego odczytu strony zamiast łatane punktowo;
- podwójny/zduplikowany etykiet wiersza (Tablica B.52.14: dwa wiersze oznaczone "20", brakujący
  wiersz "25") — naprawiony.

Skan sam w sobie jest wysokiej jakości (czytelny bezpośrednio, bez OCR) — błędy są w warstwie OCR,
nie w źródle. **Wniosek, potwierdzony teraz na pełnej próbie 26 stron, nie tylko jednej:**
renderowanie strony i bezpośredni odczyt obrazu (nie OCR) to jedyna wiarygodna metoda dla tabel
liczbowych tej normy — pojedynczy spot-check nie wystarczy, bo najpoważniejsze błędy (brakujące
kolumny/wiersze) są niewidoczne bez sprawdzenia każdej strony osobno.

## Mapa rozdziałów

| Plik | Zakres | Zawartość |
|---|---|---|
| [`00-przedmowa-i-spis-tresci.md`](00-przedmowa-i-spis-tresci.md) | str. 0-8 (PDF) | Przedmowa krajowa i spis treści |
| [`01-wprowadzenie-i-definicje.md`](01-wprowadzenie-i-definicje.md) | str. 9-10 (PDF) | 520 — Wprowadzenie, zakres, powołania normatywne, definicje |
| [`02-rodzaje-oprzewodowania.md`](02-rodzaje-oprzewodowania.md) | str. 11-12 (PDF) | 521 — Rodzaje oprzewodowania |
| [`03-wplywy-zewnetrzne.md`](03-wplywy-zewnetrzne.md) | str. 12-16 (PDF) | 522 — Dobór i montaż wg wpływów zewnętrznych (AA-CB) |
| [`04-obciazalnosc-pradowa-dlugotrwala.md`](04-obciazalnosc-pradowa-dlugotrwala.md) | str. 16-19 (PDF) | 523 — Obciążalność prądowa długotrwała (zasady ogólne) |
| [`05-przekroje-i-spadek-napiecia.md`](05-przekroje-i-spadek-napiecia.md) | str. 19-20 (PDF) | 524-525 — Przekroje przewodów, spadek napięcia |
| [`06-polaczenia-elektryczne.md`](06-polaczenia-elektryczne.md) | str. 20-22 (PDF) | 526 — Połączenia elektryczne |
| [`07-ochrona-przeciwpozarowa.md`](07-ochrona-przeciwpozarowa.md) | str. 22-22 (PDF) | 527 — Ograniczenie rozprzestrzeniania się ognia |
| [`08-zblizenie-do-innych-instalacji.md`](08-zblizenie-do-innych-instalacji.md) | str. 23-24 (PDF) | 528 — Zbliżenie oprzewodowania do innych instalacji |
| [`09-konserwacja.md`](09-konserwacja.md) | str. 25-25 (PDF) | 529 — Wymagania konserwacji |
| [`zalacznik-A-metody-instalowania.md`](zalacznik-A-metody-instalowania.md) | str. 26-32 (PDF) | Załącznik A (normatywny) — Tablica A.52.1/A.52.3, metody wykonania instalacji |
| [`zalacznik-B-tablice-obciazalnosci.md`](zalacznik-B-tablice-obciazalnosci.md) | str. 33-58 (PDF) | Załącznik B (informacyjny) — Tablice B.52.1-B.52.21: OBCIĄŻALNOŚĆ PRĄDOWA DŁUGOTRWAŁA (kluczowe tabele prądowe i współczynniki poprawkowe) |
| [`zalacznik-C-tablice-uproszczone.md`](zalacznik-C-tablice-uproszczone.md) | str. 59-63 (PDF) | Załącznik C — Tablice uproszczone C.52.1-C.52.3 |
| [`zalacznik-E-wspolczynniki-harmoniczne.md`](zalacznik-E-wspolczynniki-harmoniczne.md) | str. 64-65 (PDF) | Załącznik E — Współczynniki zmniejszające dla wyższych harmonicznych |
| [`zalacznik-F-rury-instalacyjne.md`](zalacznik-F-rury-instalacyjne.md) | str. 66-66 (PDF) | Załącznik F — Proponowane cechy dla rur instalacyjnych |
| [`zalacznik-G-spadek-napiecia.md`](zalacznik-G-spadek-napiecia.md) | str. 67-68 (PDF) | Załącznik G — Spadek napięcia, Tablica G.52.1 |
| [`zalacznik-H.md`](zalacznik-H.md) | str. 69-71 (PDF) | Załącznik H |
| [`zalacznik-I.md`](zalacznik-I.md) | str. 72-78 (PDF) | Załącznik I |
| [`zalaczniki-ZA-ZC-warunki-krajowe.md`](zalaczniki-ZA-ZC-warunki-krajowe.md) | str. 79-95 (PDF) | Załączniki ZA, ZB, ZC — szczególne warunki krajowe (Niemcy, Dania, Szwajcaria, Rumunia i in.) + koniec dokumentu |

## Skrócone wyjaśnienie struktury normy

Norma jest zbudowana z **tekstu normatywnego** (klauzule 520-529, str. 9-25) — zasady ogólne,
definicje, wymagania jakościowe — oraz **załączników z tabelami** (str. 26+), gdzie żyją
konkretne liczby:

- **Załącznik A** (str. 26-32) — kody metod instalowania (np. A1, A2, B1, B2, C, D, E, F, G) —
  potrzebne, żeby wiedzieć, którą kolumnę tabeli w Załączniku B czytać dla danego sposobu ułożenia kabla.
- **Załącznik B** (str. 33-58) — **to jest brakująca tabela obciążalności prądowej**, dokładnie ta,
  której brak blokował M5/Ekran 1, M11/B5, M4/Ekran 25 w tym projekcie. Tablice B.52.2 do B.52.13
  to wartości prądowe [A] w zależności od przekroju żyły i metody instalowania; B.52.14 do B.52.21
  to współczynniki poprawkowe (temperatura otoczenia, grupowanie wiązek, ułożenie w gruncie).
- **Załącznik C** (str. 59-63) — wersja uproszczona tych samych tabel (dla praktycznego doboru bez
  pełnej analizy).
- **Załącznik E/F/G** — harmoniczne, rury instalacyjne, spadek napięcia.
- **Załączniki ZA-ZC** (str. 79-95) — odstępstwa krajowe (Niemcy, Dania, Szwajcaria, Rumunia...) —
  raczej nieistotne dla polskiej instalacji, zachowane dla kompletności źródła.

## Status wykorzystania w projekcie

Na 05.09.2026: dokument **przeanalizowany, podzielony, a Załącznik B (tabele obciążalności
prądowej — to, czego faktycznie potrzebują zablokowane ekrany) w pełni wizualnie zweryfikowany i
skorygowany** (patrz zastrzeżenie wyżej) — ale **jeszcze niewykorzystany w żadnym kalkulatorze**.
M5/Ekran 1, M11/B5, M4/Ekran 25 nadal `⚠️ blocked` w `docs/rejestr-pokrycia.md`, dopóki nie
powstanie kod. To osobny, następny krok — dane źródłowe są już gotowe i wiarygodne, brakuje tylko
implementacji (input/calculator/validation/warnings/testy + UI, wg wzorca reszty projektu).
