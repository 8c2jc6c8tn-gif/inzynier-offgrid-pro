# 03 — Jądro logiki domenowej

Powiązane: [01 Architektura](01-architektura.md) · [04 Walidacja i twarde stopy](04-walidacja-i-twarde-stopy.md) · [10 Testy](10-testy.md)

---

## 3.1. Logika domenowa jako główne źródło wyników

**Reguła.** Funkcje domenowe (kalkulatory, reguły, silniki decyzyjne — nazwa zależy od projektu) zwracające wynik są **jedynym** źródłem wyników technicznych/merytorycznych w aplikacji. Muszą być deterministyczne (te same wejścia → te same wyjścia), testowalne i niezależne od modelu językowego. AI nigdy nie zastępuje tej logiki własnym szacunkiem (patrz rozdział 09).

## 3.2. Kontrakt wyniku

**Reguła.** Każda funkcja domenowa zwraca nie tylko wartość, ale pełną strukturę wyniku:

```ts
type CalcResult<T> = {
  value: T
  unit: string
  status: 'VALID' | 'VALID_WITH_WARNINGS' | 'INCOMPLETE' | 'OUT_OF_SCOPE' | 'INVALID_INPUT'
  formula: string                  // wzór/reguła (np. LaTeX lub opis), np. "I = P / (V \\cdot \\eta)"
  inputs: Record<string, number>   // wartości użyte do obliczenia
  assumptions: string[]            // przyjęte założenia (np. "sprawność = 0,92", "produkt przechowywany w lodówce")
  warnings: Warning[]              // patrz rozdział 04
  calculatorVersion: string        // wersja funkcji/metody
  traceId: string                  // do audit trail, patrz 3.6
}
```

**Uzasadnienie.** Widok "Szczegóły"/Migawka (rozdział 08), audyt (3.6) i podwójna weryfikacja (3.4) wymagają, by wynik niósł ze sobą swój wywód — nie da się tego odtworzyć wstecz z samej wartości. Jawny `status` (a nie tylko lista ostrzeżeń) pozwala UI i logice biznesowej podejmować decyzje maszynowo, bez parsowania tekstu ostrzeżeń.

**Konsekwencja.** Zakaz "magicznych liczb" w kodzie. Wszystkie stałe (współczynniki, tolerancje, progi) pochodzą z nazwanych stałych lub z profilu kontekstowego (rozdział 02), nigdy nie są wpisane wprost w środku wzoru/reguły.

## 3.3. Status wyniku

| Status | Znaczenie |
|---|---|
| `VALID` | Wynik pewny, dane kompletne, brak ostrzeżeń. |
| `VALID_WITH_WARNINGS` | Wynik policzony, ale są ostrzeżenia do przeczytania (rozdział 04). |
| `INCOMPLETE` | Brak wymaganych danych — wynik nie został jeszcze policzony, nie "policzony na zero". |
| `OUT_OF_SCOPE` | Dane wejściowe poza zakresem, dla którego funkcja jest ważna (np. inna kategoria/wariant). |
| `INVALID_INPUT` | Dane wejściowe błędne (ujemne tam gdzie nie wolno, zła jednostka, sprzeczność pól). |

**Konsekwencja w UI.** `INCOMPLETE` sprawdzane jest **przed** wywołaniem właściwej logiki obliczeniowej, nie po — `undefined` nigdy nie wpływa w głąb logiki domenowej.

## 3.4. Podwójna weryfikacja obliczeń krytycznych

**Reguła.** Każda krytyczna reguła/wzór (taka, gdzie błąd niesie realne ryzyko — dla zdrowia, bezpieczeństwa, pieniędzy lub zgodności z prawem, w zależności od domeny projektu) ma dwie niezależne ścieżki dające ten sam wynik w granicy tolerancji: (1) ścieżka główna — logika w kodzie, (2) ścieżka kontrolna — test jednostkowy z wartością referencyjną policzoną ręcznie lub wziętą z normy/dokumentacji źródłowej.

**Uzasadnienie.** Błąd w takim obliczeniu to realne ryzyko dla użytkownika. Co dokładnie jest "krytyczne" zależy od domeny — np. w projekcie inżynierskim: obliczenie wytrzymałościowe czy elektryczne; w projekcie dotyczącym żywności: data ważności/bezpieczeństwo spożycia; w finansowym: kwota do zapłaty. Aplikacja nie może mylić się po cichu w żadnym z tych przypadków.

**Konsekwencja.** Rozbieżność ponad ustaloną tolerancję = build fail, nie ostrzeżenie w logu.

## 3.5. Jednostki i zaokrąglenia

**Reguła.**
- System wewnętrzny stosuje spójny zestaw jednostek (np. SI, albo — gdy domena nie jest fizyczna — spójny, jawnie zdefiniowany zestaw jednostek własnych, np. dni/sztuki/waluta). Warstwa prezentacji może przeliczać jednostki na potrzeby wyświetlania, ale wynik źródłowy zawsze zachowuje jednostkę bazową.
- Nigdy nie przechowuj samej liczby bez informacji, czym jest (jednostka jest częścią wartości, nie komentarzem).
- Obliczenia pośrednie: bez przedwczesnego zaokrąglania. Prezentacja: zaokrąglanie wg reguł konkretnego modułu, udokumentowanych jawnie.
- Pieniądze: typ dziesiętny z kontrolowaną precyzją (np. `Decimal`), nigdy zmiennoprzecinkowy `float`.

## 3.6. Audit trail

**Reguła.** Każde nietrywialne przeliczenie zapisuje wpis: `traceId`, funkcja/moduł, wejścia, wynik, wersja jądra, znacznik czasu. Błędy (runtime, walidacja, rozbieżność weryfikacji z 3.4) trafiają do jednego centralnego raportera — z rozróżnieniem: użytkownik widzi komunikat "po ludzku", log niesie pełne szczegóły techniczne.

**Uzasadnienie.** Bez tego nie da się odtworzyć, dlaczego aplikacja pokazała dany wynik miesiąc temu — kluczowe przy reklamacjach, audytach bezpieczeństwa i debugowaniu.

**Konsekwencja.** Zero cichych `catch {}` / `except Exception: pass`. Każdy złapany błąd jest albo obsłużony merytorycznie, albo opakowany z kontekstem i zaraportowany.
