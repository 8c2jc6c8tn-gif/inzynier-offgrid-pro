# 10 — Testy

Powiązane: [03 Jądro obliczeniowe](03-jadro-obliczeniowe.md) · [02 Model danych](02-model-danych.md) · [11 CI/Deployment](11-ci-deployment.md)

---

## 10.1. Zakres obowiązkowy

- **Jądro obliczeniowe:** testy jednostkowe obowiązkowe, z wartościami referencyjnymi (patrz podwójna weryfikacja, rozdział 03.4).
- **Profile regionalne:** walidacja schematem w CI (rozdział 02.1).
- **Ścieżki użytkownika (UI):** weryfikacja w przeglądarce/na urządzeniu po każdej większej zmianie widocznej dla użytkownika — automatyczne testy UI tam gdzie opłacalne, ręczna weryfikacja jako minimum.

**Zasada podstawowa: "kompiluje się bez błędów" ≠ "działa poprawnie".** Typecheck przechodzący nie jest dowodem poprawności logiki.

## 10.2. Minimalny zestaw testów per kalkulator

Dla każdego kalkulatora/funkcji obliczeniowej, obowiązkowo:
1. Przypadek nominalny (typowe, poprawne dane).
2. Wartości graniczne (skrajne, ale wciąż poprawne dane wejściowe).
3. Błędne jednostki lub zakres poza dozwolonym.
4. Brakujące dane (test statusu `INCOMPLETE`, rozdział 03.3).
5. Regresja dla każdego wykrytego wcześniej błędu — błąd raz znaleziony dostaje test, który nigdy więcej nie pozwoli mu wrócić po cichu.

Testy kalkulatorów są deterministyczne — brak losowości, brak zależności od czasu systemowego czy zewnętrznej sieci w teście jednostkowym.

## 10.3. Test integracyjny całego jądra na danych domyślnych

**Reguła.** Dla projektów z architekturą wielomodułową (rozdział 01.2) — jeden test rejestrujący wszystkie moduły, przeliczający je na danych domyślnych nowego projektu, sprawdzający że żaden moduł nie kończy status `BŁĄD` na danych startowych, i weryfikujący że propagacja zmian (kaskada "dirty") poprawnie przechodzi przez cały graf zależności.

**Uzasadnienie.** Ten pojedynczy test wyłapuje całą klasę błędów integracyjnych, których żaden test jednostkowy pojedynczego modułu nie zobaczy — sprawdzone w praktyce jako skuteczne (realnie wykrywał błędy przed wdrożeniem).

## 10.4. Definicja ukończenia zadania (DoD)

Zadanie jest ukończone, gdy: kod działa, testy przechodzą, typowanie nie zgłasza nowych błędów, nie ma martwego kodu ani nieużywanych importów, dokumentacja (w tym `docs/memory.md` jeśli dotyczy — rozdział 14) została zaktualizowana, zmiana nie narusza innych modułów.
