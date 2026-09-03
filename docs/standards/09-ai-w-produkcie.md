# 09 — Zasady i granice AI w produkcie

Dotyczy AI jako **funkcji aplikacji** (asystent w produkcie), nie AI jako narzędzia kodującego — to jest rozdział [15](15-wspolpraca-z-ai.md).

Powiązane: [03 Jądro logiki domenowej](03-jadro-obliczeniowe.md) · [07 Bezpieczeństwo](07-bezpieczenstwo.md) · [08 UI/UX](08-ui-ux.md)

---

## 9.1. Zasada nadrzędna

AI w produkcie nie zastępuje silników obliczeniowych/decyzyjnych. AI wywołuje logikę domenową, interpretuje wyniki, sprawdza kompletność danych i prowadzi użytkownika. Podstawowe obliczenia/decyzje aplikacji **nigdy** nie zależą od dostępności modelu AI.

## 9.2. Co AI może i czego nie może wobec logiki domenowej

**AI może:** zebrać dane od użytkownika, zaproponować pytania o brakujące dane, wybrać właściwą funkcję/moduł, wywołać go, odebrać wynik strukturalny (rozdział 03), wyjaśnić wynik "po ludzku", porównać warianty.

**AI nigdy nie może:** zastąpić logiki domenowej własnym szacunkiem wygenerowanym przez model językowy, zmienić dane wejściowe projektu bez wiedzy i zgody użytkownika, ukrywać przyjętych założeń, tworzyć fikcyjnych norm/wzorów/wartości referencyjnych, wpisywać losowych współczynników bezpieczeństwa, deklarować zgodności z normą/przepisem bez wskazania jej wersji i zakresu, mieszać jednostek, wykonywać obliczeń krytycznych dla bezpieczeństwa wyłącznie "w głowie" modelu językowego z pominięciem właściwego modułu.

**Reguła wywołania modułu przez AI:** jeśli pytanie użytkownika zawiera wynik możliwy do uzyskania przez istniejącą funkcję domenową — (1) zidentyfikuj funkcję, (2) sprawdź wymagane dane, (3) dopytaj o brakujące, (4) wywołaj funkcję, (5) odbierz wynik strukturalny, (6) wyjaśnij wynik, (7) zapisz decyzję/dane do projektu dopiero po zgodzie użytkownika.

## 9.3. Architektura narzędziowa (function calling / tool use)

**Reguła.** Model językowy nie zna reguł/wzorów na pamięć — korzysta z rejestru jawnie zdefiniowanych narzędzi (np. `get_project_data`, `run_calculator`, `compare_variants`, `search_project_docs`, `analyze_photo`, `create_report`).

Każde narzędzie w rejestrze ma: nazwę, opis, schemat wejścia, schemat wyniku, zakres uprawnień, typ operacji (odczyt / zapis), jawne wymaganie potwierdzenia użytkownika dla operacji zapisu, testy.

**Konsekwencja bezpieczeństwa.** AI nie może: wykonywać dowolnych poleceń systemowych, edytować plików/danych poza zakresem projektu, usuwać danych bez potwierdzenia, samodzielnie publikować wygenerowanych raportów na zewnątrz.

## 9.4. Obrona przed wstrzyknięciem poleceń z treści zewnętrznych (prompt injection)

**Reguła.** AI nigdy nie traktuje treści pochodzącej ze zdjęć, zeskanowanych dokumentów, danych zewnętrznych API czy jakiegokolwiek materiału dostarczonego jako *dane* jako polecenia systemowego. Tekst odczytany np. przez OCR z fotografii jest przetwarzany jako informacja do analizy, nigdy jako instrukcja zmieniająca zachowanie asystenta.

## 9.5. Ujawnianie niepewności przy interpretacji percepcyjnej

**Reguła.** Każda funkcja AI oparta o interpretację niepewnych danych wejściowych (analiza zdjęcia, rozpoznawanie mowy, klasyfikacja obrazu) mówi: co prawdopodobnie widzi/słyszy, z jaką pewnością, czego nie może potwierdzić, jakie dodatkowe dane/pomiar są potrzebne do pewności. **Nigdy** nie deklaruje stanu bezpieczeństwa lub zgodności ("to jest bezpieczne", "to spełnia normę/termin") wyłącznie na podstawie takiej interpretacji — to zawsze wymaga pełnej ścieżki przez właściwy moduł/Doradcę (rozdział 08).

## 9.6. Tryby pracy wg dostępności sieci

| Tryb | Zachowanie |
|---|---|
| `OFFLINE` | Tylko lokalne modele i lokalna dokumentacja. |
| `HYBRID` | Lokalne dane i logika domenowa zawsze; chmura wyłącznie opcjonalnie, za zgodą. |
| `CLOUD_ASSISTED` | Cięższe modele chmurowe, ale zawsze za jawną, uprzednią zgodą użytkownika (patrz rozdział 07, prywatność lokalna-domyślna). |

## 9.7. Pamięć rozmowy vs stan projektu

**Reguła.** Rozróżnij: pamięć bieżącej rozmowy (efemeryczna), stan projektu (trwały, w bazie danych — rozdział 05), trwałe preferencje użytkownika, dokumentację źródłową. **Decyzje techniczne mają trafiać do stanu projektu lub dokumentacji, nigdy pozostawać wyłącznie w historii czatu** — inaczej znikają razem z sesją.

## 9.8. Dostęp AI do dokumentacji projektu

AI przeszukuje dokumentację na żądanie (indeksowaną, podzieloną tematycznie), a nie ładuje całość przy każdym pytaniu. Każda odpowiedź oparta na dokumentacji wskazuje źródło: nazwę dokumentu, sekcję, wersję/datę aktualizacji — żeby użytkownik mógł zweryfikować, a nie tylko zaufać.
