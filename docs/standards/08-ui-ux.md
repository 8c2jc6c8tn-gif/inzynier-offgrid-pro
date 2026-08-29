# 08 — UI/UX i treść

Powiązane: [03 Jądro obliczeniowe](03-jadro-obliczeniowe.md) · [04 Walidacja i twarde stopy](04-walidacja-i-twarde-stopy.md) · [09 Zasady i granice AI](09-ai-w-produkcie.md)

---

## 8.1. Zasada nadrzędna: aplikacja jest doradcą, nie encyklopedią

Ekran dotyczący decyzji inżynierskiej (dobór, kompatybilność, konfiguracja) nie może kończyć się na "oto wzór i wynik". Musi: przyjąć realny sprzęt/dane użytkownika jako wejście (nie generyczne przykłady), ocenić wybór względem granic bezpieczeństwa, wydać jednoznaczny werdykt (rozdział 04), wytłumaczyć **dlaczego** — mechanizm fizyczny, nie "przekroczono limit" — i twardo ostrzec, gdy opcja grozi uszkodzeniem, pożarem lub utratą gwarancji.

## 8.2. Taksonomia wzorców ekranu

Punkt startowy, nie zamknięta lista — jeśli funkcja nie pasuje dobrze do żadnego wzorca, tworzy się nowy dedykowany, zamiast naciągać istniejący (naciąganie na siłę pogarsza UX bardziej niż dodanie kolejnego wzorca).

| Wzorzec | Kiedy stosować |
|---|---|
| **A — Przełącznik trybu** | Opcje wzajemnie się wykluczają i są matematycznie równoważne (ten sam typ wejścia/wyjścia, inny wzór). |
| **B — Karty porównawcze** | User wybiera produkt/technologię z opisową charakterystyką, niekoniecznie własny sprzęt na wejściu. |
| **C — Akordeon / informacja** | Tematy uzupełniają się, nie wykluczają — user może chcieć przeczytać wszystkie. |
| **D — Doradca** | Dobór z werdyktem bezpieczeństwa. Patrz 8.3-8.4. **Zawsze wygrywa nad A/B/C**, gdy się kwalifikuje. |
| **E — Checklist weryfikacyjna** | Sekwencja "zrób i potwierdź", opcjonalnie z wynikiem pomiaru porównanym do progu — nie kalkulacja. |
| **F — Przewodnik z ilustracją** | Zasada przestrzenna/fizyczna, do której się zagląda podczas pracy — bez pól do wpisania, rysunek + reguła. |
| **G — Raport/podsumowanie** | Ekran tylko do odczytu, zagregowany wynik, koniec ścieżki decyzyjnej, nie jej część. |
| **H — Katalog komponentów** | User dodaje dowolną liczbę niewykluczających się elementów (różni się od A: nie wybiera JEDNEGO wariantu). |

## 8.3. Kryteria kwalifikacji do wzorca D (Doradca)

Funkcja **musi** być Doradcą, jeśli odpowiedź na którekolwiek z poniższych brzmi "tak":
- Czy dotyczy doboru jednego komponentu do parametrów innego?
- Czy błędny wybór może fizycznie uszkodzić sprzęt, spowodować pożar lub porażenie?
- Czy błędny wybór unieważnia gwarancję producenta?
- Czy istnieją jasne, liczbowe granice bezpieczeństwa (napięcie max, prąd max, temperatura, przekrój)?
- Czy tytuł/nazwa funkcji zawiera: *dobór, kompatybilność, zabezpieczenie, ochrona, koordynacja, limit, ryzyko*?

Jeśli żadne z powyższych nie zachodzi, a funkcja tylko wyjaśnia zjawisko lub pokazuje dane — wystarczy wzorzec B lub C. To jest obiektywny test, nie uznaniowa decyzja.

## 8.4. Obowiązkowy szablon ekranu Doradcy (wzorzec D)

Cztery sekcje, w tej kolejności:

- **Sekcja A — Twój sprzęt/dane.** Pola do wpisania realnych parametrów (nie placeholder w stylu "np. 40V" — prawdziwe dane z karty katalogowej urządzenia usera). Wartość domyślna dopuszczalna tylko wtedy, gdy jest bezpieczna — **dane wpływające na bezpieczeństwo nigdy nie są ukryte jako wartość domyślna** (patrz 8.6).
- **Sekcja B — Silnik oceny.** Dla każdej rozważanej opcji: wartości robocze i ekstremalne (nie tylko warunki nominalne — też scenariusz brzegowy), werdykt trójstopniowy (rozdział 04), uzasadnienie fizyczne w jednym zdaniu.
- **Sekcja C — Rekomendacja.** Wyróżniona wizualnie najlepsza opcja spośród ocenionych na 🟢, z krótkim podsumowaniem dlaczego.
- **Sekcja D — Migawka edukacyjna.** Krótkie "o co chodzi" tłumaczenie zjawiska fizycznego stojącego za oceną. Treść pochodzi z pól `formula`/`assumptions` wyniku (rozdział 03) — nigdy nie jest przepisywana ręcznie osobno od logiki, która ją wyprodukowała.

Każdy parametr liczbowy na dowolnym ekranie (nie tylko Doradcy) ma mały znak `?` obok etykiety — popover z pełną nazwą, jednym zdaniem "do czego służy", gdzie to znaleźć, typowym zakresem wartości. To jest **inny** poziom wyjaśnienia niż Migawka (Migawka tłumaczy całą funkcję/zjawisko, `?` tłumaczy pojedyncze oznaczenie/pole) — oba mogą występować na tym samym ekranie i się uzupełniają.

## 8.5. Tryb prosty vs Tryb Inżyniera

**Reguła.** Globalny przełącznik, stan trwały w preferencjach użytkownika. Domyślnie tryb prosty (suwaki, kafle, mniej pól). Tryb Inżyniera odsłania parametry zaawansowane (protokoły komunikacji, momenty dokręcania, rezystancje wewnętrzne...). **Menu pozostaje zawsze dostępne, również w trybie prowadzonym/prostym** — nigdy nie zamyka użytkownika w liniowej ścieżce bez wyjścia.

## 8.6. Bezpieczne wartości domyślne

**Reguła.** Dane wpływające na bezpieczeństwo nie mogą mieć ukrytej wartości domyślnej, którą użytkownik przeoczy. Jeśli pole ma wartość domyślną, musi być jawnie oznaczone jako domyślne/orientacyjne, nie wyglądać jak dana wpisana świadomie przez użytkownika.

## 8.7. Powiązania Bloków (propagacja i nawigacja)

**Reguła.** Pole `powiazania: string[]` (identyfikatory innych modułów/funkcji) jest częścią definicji każdego modułu. UI pokazuje je jako linki nawigacyjne; silnik używa ich do propagacji danych między modułami (rozdział 01, wzorzec Kernela). Z każdego ekranu Doradcy powinno dać się przejść bezpośrednio do powiązanej funkcji, bez cofania się do pulpitu głównego ("brak ślepych zaułków").

**Konsekwencja nawigacyjna.** Przycisk Wstecz zawsze w tym samym miejscu, zachowuje stan wpisanych danych. Okruszki (breadcrumb) pokazujące pozycję w strukturze modułów — istotne zwłaszcza gdy jeden ekran scala treść wielu dawnych, drobniejszych funkcji.

## 8.8. Styl komunikatów

**Reguła.** Komunikaty są proste, konkretne, bez straszenia, bez udawania pewności, której nie ma.

Przykład: *"Brakuje informacji o klasie materiału. Wynik został policzony orientacyjnie dla wartości domyślnej i nie powinien być użyty jako projekt wykonawczy."*

## 8.9. Mobile-first

**Reguła.** Projektuje się pod telefon jako pierwszy cel (dotyk ≥44px, input ≥16px, brak auto-zoom iOS na focusie pola), potem rozwija na tablet/desktop. Ekran terenowy (praca poza biurem) wymaga dodatkowo: automatycznego zapisu, dużych przycisków, trybu wysokiego kontrastu, czytelności w jasnym otoczeniu, działania w rękawicach.

## 8.10. Dostępność

Nie polegaj wyłącznie na kolorze do przekazania informacji (werdykty 🟢🟡🔴 mają też kształt/ikonę, nie tylko barwę). Zachowaj odpowiedni kontrast. Etykiety dla czytników ekranu. Nie blokuj powiększenia. Obsługa klawiaturą. Unikaj migających elementów.
