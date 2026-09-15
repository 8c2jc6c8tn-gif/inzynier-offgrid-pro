# 09 — Zasady i granice AI w produkcie

Dotyczy AI jako **funkcji aplikacji** (asystent w produkcie), nie AI jako narzędzia kodującego — to jest rozdział [15](15-wspolpraca-z-ai.md).

Powiązane: [03 Jądro logiki domenowej](03-jadro-obliczeniowe.md) · [07 Bezpieczeństwo](07-bezpieczenstwo.md) · [08 UI/UX](08-ui-ux.md)

---

## 9.0. Obowiązkowość AI w produkcie

[15.09.2026] ✅ DODANO — źródło: decyzja właściciela repo (14.09.2026), integracja z blokiem U.4 (zero-waste, inzynier-offgrid-pro). **AI w produkcie jest obowiązkowym elementem każdego projektu naszej rodziny** — w odróżnieniu od modułów opcjonalnych (Część Y.10 GOD BOOK, `docs/playbooki-opcjonalne/`), nie jest to funkcja do świadomego włączenia/wyłączenia per projekt.

Zawsze jednak jako **dodatkowa, wyłącznie-online warstwa nad rdzeniem** — nigdy jako wymóg rdzenia. Rdzeń (logika domenowa, dane, podstawowe operacje) działa w pełni bez AI, zgodnie z 9.1 i offline-first (rozdział 05). Wzorzec: warstwa AI sprawdza swoją dostępność (`isAiAvailable()` lub równoważnik) i degraduje się w milczeniu do zwykłego UI bez AI, gdy sieć/model niedostępne — nigdy nie blokuje żadnej podstawowej operacji. To rozstrzyga wprost napięcie AI↔offline-first, zgłoszone niezależnie przez zero-waste (14.09.2026): integracja AI nie jest wyjątkiem od Złotej Zasady offline-first, jest zawsze jej podporządkowana.

## 9.1. Zasada nadrzędna

AI w produkcie nie zastępuje silników obliczeniowych/decyzyjnych. AI wywołuje logikę domenową, interpretuje wyniki, sprawdza kompletność danych i prowadzi użytkownika. Podstawowe obliczenia/decyzje aplikacji **nigdy** nie zależą od dostępności modelu AI.

## 9.2. Co AI może i czego nie może wobec logiki domenowej

**AI może:** zebrać dane od użytkownika, zaproponować pytania o brakujące dane, wybrać właściwą funkcję/moduł, wywołać go, odebrać wynik strukturalny (rozdział 03), wyjaśnić wynik "po ludzku", porównać warianty.

**AI nigdy nie może:** zastąpić logiki domenowej własnym szacunkiem wygenerowanym przez model językowy, zmienić dane wejściowe projektu bez wiedzy i zgody użytkownika, ukrywać przyjętych założeń, tworzyć fikcyjnych norm/wzorów/wartości referencyjnych, wpisywać losowych współczynników bezpieczeństwa, deklarować zgodności z normą/przepisem bez wskazania jej wersji i zakresu, mieszać jednostek, wykonywać obliczeń krytycznych dla bezpieczeństwa wyłącznie "w głowie" modelu językowego z pominięciem właściwego modułu.

**Reguła wywołania modułu przez AI:** jeśli pytanie użytkownika zawiera wynik możliwy do uzyskania przez istniejącą funkcję domenową — (1) zidentyfikuj funkcję, (2) sprawdź wymagane dane, (3) dopytaj o brakujące, (4) wywołaj funkcję, (5) odbierz wynik strukturalny, (6) wyjaśnij wynik, (7) zapisz decyzję/dane do projektu dopiero po zgodzie użytkownika.

[15.09.2026] ✅ DODANO — źródło: zero-waste (14.09.2026), pomysł uogólniony z już istniejącej reguły 15.1 (AI piszące kod nigdy nie zgaduje po cichu). **To samo dotyczy AI działającego w produkcie wobec danych bezpieczeństwo-krytycznych.** Gdy AI ma dopisać do projektu dane, których błąd niesie realne ryzyko (np. termin ważności produktu, wymiar konstrukcyjny, dawka) na podstawie niejednoznacznego opisu użytkownika — **musi dopytać, nigdy nie zgaduje cicho**. Dotyczy to wprost kroku (3) reguły wywołania modułu wyżej: "dopytaj o brakujące" obejmuje też przypadek, gdy dana formalnie jest podana, ale niejednoznacznie.

## 9.3. Architektura narzędziowa (function calling / tool use)

**Reguła.** Model językowy nie zna reguł/wzorów na pamięć — korzysta z rejestru jawnie zdefiniowanych narzędzi (np. `get_project_data`, `run_calculator`, `compare_variants`, `search_project_docs`, `analyze_photo`, `create_report`).

Każde narzędzie w rejestrze ma: nazwę, opis, schemat wejścia, schemat wyniku, zakres uprawnień, typ operacji (odczyt / zapis), jawne wymaganie potwierdzenia użytkownika dla operacji zapisu, testy.

**Konsekwencja bezpieczeństwa.** AI nie może: wykonywać dowolnych poleceń systemowych, edytować plików/danych poza zakresem projektu, usuwać danych bez potwierdzenia, samodzielnie publikować wygenerowanych raportów na zewnątrz.

[15.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (14.09.2026, "gotowa do konsolidacji"). **Kontrakt narzędzia jako typ, nie tylko opis słowny** — czyni regułę wyżej (i 9.1/9.2) sprawdzalną maszynowo, nie tylko przez recenzję:

```ts
type AiToolDefinition<TInput, TOutput> = {
  name: string
  description: string
  inputSchema: Schema<TInput>          // np. Zod albo równoważnik w danym stosie
  outputSchema: Schema<TOutput>
  operationType: 'read' | 'write'
  requiresConfirmation: boolean        // obowiązkowe true dla 'write'
  scope: string                        // zakres uprawnień (np. id projektu/rekordu)
  handler: (input: TInput) => Promise<TOutput>
  // handler ZAWSZE deleguje do już istniejącej funkcji domenowej (rozdział 03)
  // — nigdy własna logika/szacunek modelu językowego wewnątrz handlera
}
```

`requiresConfirmation: false` przy `operationType: 'write'` jest błędem konfiguracji, nie ważną kombinacją — narzędzie rejestrujące taki zapis nie przechodzi testu (10).

### 9.3a. Przykłady narzędzi per projekt (ilustracyjne, nie wiążące)

[15.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro/inzynier-szkieletowy-pro vs zero-waste, ta sama sesja. Każdy projekt sam dobiera własny rejestr narzędzi (9.3) — poniższe pokazuje różnicę `operationType` wynikającą z natury domeny, nie regułę do kopiowania 1:1.

- **inzynier-offgrid-pro / inzynier-szkieletowy-pro** — narzędzia wywołujące kalkulatory inżynierskie są niemal wyłącznie `operationType: 'read'`: policz i pokaż wynik, nic nie zapisują do projektu bez osobnej, jawnej akcji użytkownika.
- **zero-waste** — narzędzia typu "dodaj produkt do spiżarni"/"usuń zużyty produkt" są `operationType: 'write'`, zawsze z `requiresConfirmation: true` — użytkownik widzi i zatwierdza konkretny zapis przed jego wykonaniem, AI nigdy nie zapisuje po cichu w tle.

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

[15.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (14.09.2026). **Budżet/koszt jako brakujący wymiar obok trybów wyżej.** Wywołania modelu chmurowego (`CLOUD_ASSISTED`, częściowo `HYBRID`) mają rzeczywisty koszt pieniężny per zapytanie — limit egzekwowany **server-side**, tym samym mechanizmem co egzekwowanie tier'u we freemium (rozdział 12), nigdy licznikiem trzymanym tylko w kliencie. Wyczerpanie budżetu **nigdy nie jest ciche**: degradacja zawsze łagodna i jawnie zakomunikowana użytkownikowi (np. powrót do `HYBRID`/`OFFLINE` z wyjaśnieniem "limit AI na dziś wykorzystany"), nigdy błąd bez wyjaśnienia ani milczący brak odpowiedzi.

## 9.7. Pamięć rozmowy vs stan projektu

**Reguła.** Rozróżnij: pamięć bieżącej rozmowy (efemeryczna), stan projektu (trwały, w bazie danych — rozdział 05), trwałe preferencje użytkownika, dokumentację źródłową. **Decyzje techniczne mają trafiać do stanu projektu lub dokumentacji, nigdy pozostawać wyłącznie w historii czatu** — inaczej znikają razem z sesją.

## 9.8. Dostęp AI do dokumentacji projektu

AI przeszukuje dokumentację na żądanie (indeksowaną, podzieloną tematycznie), a nie ładuje całość przy każdym pytaniu. Każda odpowiedź oparta na dokumentacji wskazuje źródło: nazwę dokumentu, sekcję, wersję/datę aktualizacji — żeby użytkownik mógł zweryfikować, a nie tylko zaufać.

## 9.9. Wzorce UX obecności AI

[15.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (14.09.2026, "gotowa do konsolidacji"). Dwa dopuszczalne wzorce obecności AI w interfejsie — projekt wybiera jeden lub oba, nie jest to zamknięta lista:

- **Asystent inline** — sugeruje uzupełnienie konkretnych pól na istniejącym ekranie Doradcy (rozdział 08); sugestia widoczna obok pola, użytkownik jawnie akceptuje/odrzuca, nigdy nie jest wpisywana za niego po cichu.
- **Czat swobodny** — zawsze kończy się przejściem/linkiem do właściwego ekranu z wynikiem policzonym przez prawdziwą funkcję domenową (9.2) — **nigdy** samą liczbą wygenerowaną przez model wprost w treści rozmowy, bez przejścia przez Kernel.

Niezależnie od wzorca: każda sugestia AI pokazuje źródło (`traceId`/`calculatorVersion`, rozdział 3.6) — użytkownik musi mieć możliwość zweryfikowania, skąd konkretny wynik pochodzi, nie tylko zaufać treści czatu.

## 9.10. Pole `zaproponowaneBy` w rejestrze pokrycia

[15.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (14.09.2026). Rejestr pokrycia funkcji/reguł (rozdział 14.1) może nieść opcjonalne pole `zaproponowaneBy: "ai" | "czlowiek"` przy pozycji, której pierwszy szkic zasugerował asystent AI działający w produkcie (nie AI piszące kod — to rozdział 15). Pole jest **czysto informacyjne** — nie zmienia procesu decyzyjnego: decyzja o wdrożeniu wymaga tak samo człowieka, jak każda inna pozycja rejestru (15.4).
