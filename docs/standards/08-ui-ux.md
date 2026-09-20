# 08 — UI/UX i treść

Powiązane: [03 Jądro logiki domenowej](03-jadro-obliczeniowe.md) · [04 Walidacja i twarde stopy](04-walidacja-i-twarde-stopy.md) · [09 Zasady i granice AI](09-ai-w-produkcie.md)

---

## 8.1. Zasada nadrzędna: aplikacja jest doradcą, nie encyklopedią

Ekran dotyczący decyzji użytkownika o realnych konsekwencjach (dobór, kompatybilność, konfiguracja, "czy to jest bezpieczne/dopuszczalne w tej sytuacji") nie może kończyć się na "oto reguła i wynik". Musi: przyjąć realne dane/kontekst użytkownika jako wejście (nie generyczne przykłady), ocenić wybór względem granic bezpieczeństwa/dopuszczalności, wydać jednoznaczny werdykt (rozdział 04), wytłumaczyć **dlaczego** — mechanizm rzeczywisty, nie "przekroczono limit" — i twardo ostrzec, gdy opcja grozi realną szkodą (fizyczną, zdrowotną, finansową czy prawną, zależnie od domeny).

## 8.2. Taksonomia wzorców ekranu

Punkt startowy, nie zamknięta lista — jeśli funkcja nie pasuje dobrze do żadnego wzorca, tworzy się nowy dedykowany, zamiast naciągać istniejący (naciąganie na siłę pogarsza UX bardziej niż dodanie kolejnego wzorca).

| Wzorzec | Kiedy stosować |
|---|---|
| **A — Przełącznik trybu** | Opcje wzajemnie się wykluczają i są równoważne (ten sam typ wejścia/wyjścia, inna reguła/wzór). |
| **B — Karty porównawcze** | User wybiera produkt/wariant z opisową charakterystyką, niekoniecznie własne dane na wejściu. |
| **C — Akordeon / informacja** | Tematy uzupełniają się, nie wykluczają — user może chcieć przeczytać wszystkie. |
| **D — Doradca** | Dobór/ocena z werdyktem bezpieczeństwa lub dopuszczalności. Patrz 8.3-8.4. **Zawsze wygrywa nad A/B/C**, gdy się kwalifikuje. |
| **E — Checklist weryfikacyjna** | Sekwencja "zrób i potwierdź", opcjonalnie z wynikiem pomiaru/obserwacji porównanym do progu — nie kalkulacja. |
| **F — Przewodnik z ilustracją** | Zasada przestrzenna/wizualna, do której się zagląda podczas pracy — bez pól do wpisania, rysunek + reguła. |
| **G — Raport/podsumowanie** | Ekran tylko do odczytu, zagregowany wynik, koniec ścieżki decyzyjnej, nie jej część. |
| **H — Katalog komponentów** | User dodaje dowolną liczbę niewykluczających się elementów (różni się od A: nie wybiera JEDNEGO wariantu). |

## 8.3. Kryteria kwalifikacji do wzorca D (Doradca)

Funkcja **musi** być Doradcą, jeśli odpowiedź na którekolwiek z poniższych brzmi "tak":
- Czy dotyczy doboru/oceny jednej rzeczy względem parametrów/kontekstu innej (np. komponent do instalacji, produkt do terminu ważności, wydatek do budżetu)?
- Czy błędny wybór może fizycznie zaszkodzić użytkownikowi/mieniu, spowodować utratę zdrowia, albo stratę finansową?
- Czy błędny wybór unieważnia gwarancję, narusza przepis, albo ma inną trwałą, nieodwracalną konsekwencję?
- Czy istnieją jasne, liczbowe granice bezpieczeństwa/dopuszczalności (np. limit, próg, data, kwota)?
- Czy tytuł/nazwa funkcji zawiera: *dobór, kompatybilność, zabezpieczenie, ochrona, koordynacja, limit, ryzyko*?

Jeśli żadne z powyższych nie zachodzi, a funkcja tylko wyjaśnia zjawisko lub pokazuje dane — wystarczy wzorzec B lub C. To jest obiektywny test, nie uznaniowa decyzja.

## 8.4. Obowiązkowy szablon ekranu Doradcy (wzorzec D)

Cztery sekcje, w tej kolejności:

- **Sekcja A — Twoje dane/kontekst.** Pola do wpisania realnych parametrów (nie placeholder w stylu "np. 40V" — prawdziwe dane od użytkownika, np. z etykiety produktu czy karty katalogowej urządzenia). Wartość domyślna dopuszczalna tylko wtedy, gdy jest bezpieczna — **dane wpływające na bezpieczeństwo nigdy nie są ukryte jako wartość domyślna** (patrz 8.6).
- **Sekcja B — Silnik oceny.** Dla każdej rozważanej opcji: wartości robocze i ekstremalne (nie tylko warunki nominalne — też scenariusz brzegowy), werdykt trójstopniowy (rozdział 04), uzasadnienie w jednym zdaniu.
- **Sekcja C — Rekomendacja.** Wyróżniona wizualnie najlepsza opcja spośród ocenionych na 🟢, z krótkim podsumowaniem dlaczego.
- **Sekcja D — Migawka edukacyjna.** Krótkie "o co chodzi" tłumaczenie zjawiska/mechanizmu stojącego za oceną. Treść pochodzi z pól `formula`/`assumptions` wyniku (rozdział 03) — nigdy nie jest przepisywana ręcznie osobno od logiki, która ją wyprodukowała.

Każdy parametr liczbowy na dowolnym ekranie (nie tylko Doradcy) ma mały znak `?` obok etykiety — popover z pełną nazwą, jednym zdaniem "do czego służy", gdzie to znaleźć, typowym zakresem wartości. To jest **inny** poziom wyjaśnienia niż Migawka (Migawka tłumaczy całą funkcję/zjawisko, `?` tłumaczy pojedyncze oznaczenie/pole) — oba mogą występować na tym samym ekranie i się uzupełniają.

## 8.4a. Kryterium audytu pokrycia: "sekcja wypełniona" ≠ "ma wzór"

[20.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4). Audyt pokrycia funkcji oznaczył dwie funkcje jako "gotowe do budowy — pełna treść Doradcy z formułą" na podstawie tego, że źródło miało wypełniony pełny szablon sekcji A/B/C/D. Przy faktycznej implementacji okazało się, że Sekcja B (Silnik) miała tylko narrację słowną + jeden przykład liczbowy, bez ogólnego wzoru wiążącego wejścia z wynikiem — obie funkcje błędnie zaklasyfikowane jako gotowe do Wzorca D, zamiast do Wzorca C (8.2).

**Reguła.** Przy audycie pokrycia (GOD BOOK Część N) klasyfikującym funkcję jako "gotową do budowy jako Doradca (Wzorzec D)", nie wystarczy sprawdzić, że Sekcja B źródła jest wypełniona tekstem — trzeba jawnie potwierdzić, że zawiera **odtwarzalny wzór matematyczny/logiczny** (nie tylko opis słowny mechanizmu i pojedynczy przykład liczbowy, z którego wzoru nie da się jednoznacznie wyprowadzić). Sam przykład liczbowy bez ogólnego wzoru klasyfikuje funkcję z automatu jako kandydata do Wzorca C (informacyjny) — nie D (kalkulator) — dopóki ktoś nie dostarczy albo nie wyprowadzi brakującego wzoru.

**Uzasadnienie.** "Sekcja ma treść" i "sekcja ma wzór" to dwa różne stany, łatwe do pomylenia przy pobieżnym audycie opartym o samą strukturę szablonu — dotyczy każdego projektu rodziny opartego o szablon Doradcy A/B/C/D, nie specyfiki jednego projektu.

## 8.5. Tryb prosty vs Tryb zaawansowany

**Reguła.** Globalny przełącznik, stan trwały w preferencjach użytkownika. Domyślnie tryb prosty (suwaki, kafle, mniej pól). Tryb zaawansowany odsłania parametry dodatkowe (dla projektu technicznego: protokoły komunikacji, momenty dokręcania; dla innej domeny: pełne dane źródłowe, zaawansowane filtry — dobór wg projektu). **Menu pozostaje zawsze dostępne, również w trybie prowadzonym/prostym** — nigdy nie zamyka użytkownika w liniowej ścieżce bez wyjścia.

## 8.6. Bezpieczne wartości domyślne

**Reguła.** Dane wpływające na bezpieczeństwo nie mogą mieć ukrytej wartości domyślnej, którą użytkownik przeoczy. Jeśli pole ma wartość domyślną, musi być jawnie oznaczone jako domyślne/orientacyjne, nie wyglądać jak dana wpisana świadomie przez użytkownika.

## 8.7. Powiązania Bloków (propagacja i nawigacja)

**Reguła.** Pole `powiazania: string[]` (identyfikatory innych modułów/funkcji) jest częścią definicji każdego modułu. UI pokazuje je jako linki nawigacyjne; silnik używa ich do propagacji danych między modułami (rozdział 01, wzorzec Kernela). Z każdego ekranu Doradcy powinno dać się przejść bezpośrednio do powiązanej funkcji, bez cofania się do pulpitu głównego ("brak ślepych zaułków").

**Konsekwencja nawigacyjna.** Przycisk Wstecz zawsze w tym samym miejscu, zachowuje stan wpisanych danych. Okruszki (breadcrumb) pokazujące pozycję w strukturze modułów — istotne zwłaszcza gdy jeden ekran scala treść wielu dawnych, drobniejszych funkcji.

## 8.8. Styl komunikatów

**Reguła.** Komunikaty są proste, konkretne, bez straszenia, bez udawania pewności, której nie ma.

Przykład: *"Brakuje informacji o dacie otwarcia opakowania. Wynik został policzony orientacyjnie dla wartości domyślnej i nie powinien być traktowany jako pewność."*

[16.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4). Reguła wyżej dotyczy stylu treści w języku bazowym — dla projektu z i18n (rozdz. 17) obowiązuje w **każdym** obsługiwanym języku, nie tylko oryginale. Ton komunikatu (prosty, konkretny, bez straszenia, bez udawanej pewności) jest częścią kryterium jakości tłumaczenia, sprawdzaną tak samo jak poprawność merytoryczna przy nadawaniu tłumaczeniu statusu `reviewed` (17.7) — tłumaczenie może być poprawne językowo i jednocześnie łamać ten styl (np. bardziej alarmistyczne albo bardziej stanowcze niż oryginał), co status `reviewed` powinien wyłapać.

## 8.9. Mobile-first

**Reguła.** Projektuje się pod telefon jako pierwszy cel (dotyk ≥44px, input ≥16px, brak auto-zoom iOS na focusie pola), potem rozwija na tablet/desktop. Scenariusz użycia "w terenie"/poza biurkiem (jeśli dotyczy projektu) wymaga dodatkowo: automatycznego zapisu, dużych przycisków, trybu wysokiego kontrastu, czytelności w jasnym otoczeniu, obsługi jedną ręką.

## 8.10. Dostępność

Nie polegaj wyłącznie na kolorze do przekazania informacji (werdykty 🟢🟡🔴 mają też kształt/ikonę, nie tylko barwę). Zachowaj odpowiedni kontrast. Etykiety dla czytników ekranu. Nie blokuj powiększenia. Obsługa klawiaturą. Unikaj migających elementów.
