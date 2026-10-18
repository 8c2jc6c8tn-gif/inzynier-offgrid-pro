# 04 — Walidacja, ostrzeżenia i twarde stopy

Powiązane: [03 Jądro logiki domenowej](03-jadro-obliczeniowe.md) · [08 UI/UX i treść](08-ui-ux.md) · [07 Bezpieczeństwo](07-bezpieczenstwo.md)

---

## 4.1. Poziomy ostrzeżeń

**Reguła.** Domyślny, obowiązujący język całej aplikacji to **werdykt trójstopniowy**:

- 🟢 **Zalecane** — mieści się bezpiecznie, z marginesem.
- 🟡 **Dopuszczalne, ale gorsze** — działa, ale blisko limitu albo nieoptymalne.
- 🔴 **Zabronione — ryzyko** — przekracza granicę bezpieczeństwa. Patrz 4.3 (twarde stopy).

Każdy werdykt ma **jednozdaniowe uzasadnienie merytoryczne** — nigdy samo "błąd walidacji", zawsze konkretna przyczyna (np. "napięcie przy mrozie przekroczy limit wejścia DC" w projekcie inżynierskim, albo "produkt przekroczył termin PAO o 14 dni" w projekcie spożywczym).

Dla projektów potrzebujących większej granulacji przy komunikatach nie-bezpieczeństwa (np. jakość danych, kompletność), dopuszczalny jest dodatkowy, wewnętrzny 4-poziomowy system `INFO / NOTICE / WARNING / CRITICAL`, **mapowany na powyższy trójstopniowy język w warstwie prezentacji** — użytkownik zawsze widzi 🟢🟡🔴, nigdy surowe nazwy poziomów wewnętrznych.

Struktura pojedynczego ostrzeżenia: kod, poziom, komunikat dla użytkownika ("po ludzku"), komunikat techniczny, pole/wynik którego dotyczy, zalecana czynność.

[15.09.2026] ✅ DODANO — źródło: integracja z rozdz. 17 (i18n), kolizja zgłoszona przez inzynier-offgrid-pro. **`kod` jako jedyny output domenowy.** Domenowa funkcja generująca ostrzeżenie zwraca wyłącznie `kod` — nigdy gotowy `komunikat dla użytkownika`. Ten komunikat jest wygenerowany dopiero w warstwie prezentacji, odczytem `kod` ze słownika tłumaczeń (17.2), tak samo jak `komunikat techniczny` pozostaje wewnętrzny/deweloperski i nie podlega i18n. Bez tego rozróżnienia domenowa funkcja produkowałaby twardy tekst w jednym języku, kolidując z 01.1.

[07.10.2026] ✅ DOPRECYZOWANO (nic nie usunięto) — „odczyt `kod` ze słownika” wyżej czytaj przez 17.2 (dopisek 07.10.2026): domenowa funkcja zwraca `kod` + jawne `i18nKey` + `params` (opcjonalnie `akcjaI18nKey`); tłumaczenie nadal wyłącznie w warstwie prezentacji. Zasada „nigdy gotowy komunikat dla użytkownika” bez zmian.

**Reguła priorytetu.** Ostrzeżenia nigdy nie zmieniają statusu wyniku (3.3) same z siebie. Priorytet stanu widżetu/ekranu: `BŁĄD > NIEKOMPLETNE > OK`.

## 4.2. Kontrakt wyniku prezentacyjnego (Kontrakt Widżetu)

**Reguła.** Każdy moduł/ekran zwraca ten sam kształt wyniku prezentacyjnego, niezależnie od domeny: `status`, `skrót` (krótkie podsumowanie), `metryki` (kluczowe liczby), `liczbaOstrzeżeń`, `liczbaBłędów`, `celNawigacji` (dokąd prowadzi kliknięcie).

**Uzasadnienie.** Jeden spójny kształt pozwala UI renderować dziesiątki różnych modułów jednym komponentem karty/widżetu, i pozwala zbudować zbiorczą agregację (4.4) bez znajomości wnętrza każdego modułu.

**Konsekwencja.** Agregacja alertów (np. `pobierzAlerty()`) zbiera gotowe wyniki ze wszystkich modułów w jedną posortowaną listę — **nigdy nie przelicza walidacji na nowo**. Moduł ze statusem `INCOMPLETE` nigdy nie generuje alertu.

## 4.3. Zbiorczy rejestr twardych stopów

**Reguła.** Wszystkie warunki, które w dowolnym module aplikacji muszą **zawsze** skutkować werdyktem 🔴, są zbierane w jeden, osobny, przeszukiwalny rejestr — nie tylko rozproszone po poszczególnych modułach.

**Uzasadnienie.** Przy dziesiątkach modułów nikt nie jest w stanie utrzymać w głowie wszystkich twardych stopów aplikacji naraz. Scentralizowany rejestr służy do: audytu bezpieczeństwa całej instalacji/projektu na koniec pracy, wykrywania luk (czy jakiś oczywisty przypadek nie ma jeszcze twardego stopu), onboardingu nowych osób/AI pracujących nad kodem.

**Konsekwencja — wzór struktury** (przykład zweryfikowany w praktyce na dużym projekcie z wieloma modułami domenowymi):

```
Kategoria tematyczna (nazwa zależy od domeny projektu,
                       np. w projekcie inżynierskim: "Elektryczne/pożarowe", "Bezpieczeństwo życia";
                       w projekcie spożywczym: "Zdrowotne/toksykologiczne", "Alergeny")
  - Opis warunku                                    (ID modułu/ekranu źródłowego)
  - <konkretny warunek graniczny nr 1>                (M5/E1)
  - <konkretny warunek graniczny nr 2>                (M4/E24)
  ...
```

Każda pozycja odsyła do modułu/ekranu, w którym warunek jest faktycznie sprawdzany — rejestr jest **indeksem**, nie duplikatem logiki walidacji.

[29.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4). Kompletność rejestru sprawdzana mechanicznie strażnikiem wg 11.9 (każdy kod ostrzeżenia poziomu 🔴 w module ↔ wpis w rejestrze, z listą świadomych wyjątków), nie dyscypliną "dopisz przy każdym module" — w jednym projekcie ~20 twardych stopów całego modułu nie trafiło do rejestru przez 2 tygodnie.

## 4.4. Świadome odblokowanie błędu do ostrzeżenia

**Reguła.** Błąd (🔴) może zostać obniżony do ostrzeżenia (🟡) **wyłącznie** przez jawną, świadomą zgodę użytkownika (np. zaznaczenie checkboxa "potwierdzam ryzyko"). Sam brak działania nigdy nie obniża poziomu automatycznie. Niektóre twarde stopy (te o najwyższym ryzyku dla zdrowia lub bezpieczeństwa) nie mają takiego obejścia z premedytacji i pozostają zablokowane bez wyjątku — decyzja, które to są, należy do właściciela projektu i ma być spisana w `docs/memory.md`.

## 4.5. Walidacja wielowarstwowa

**Reguła.** Waliduj: zakresy, jednostki, wartości zerowe/ujemne tam gdzie nie mają sensu domenowego, zależności między polami, kompletność danych, zgodność wersji schematu danych (rozdział 02). **Walidacja interfejsu nigdy nie zastępuje walidacji domenowej** — ta sama reguła musi obowiązywać niezależnie od tego, przez jaką warstwę prezentacji dane wejdą (formularz, API, import pliku, głos).

[15.09.2026] ✅ DODANO — źródło: właściciel repo, kontynuacja audytu zabezpieczenia sesji (18.5/7.3). **Granica względem sanityzacji bezpieczeństwa.** Ta sekcja dotyczy wyłącznie **poprawności domenowej** wejścia (czy wartość ma sens w domenie projektu) — nie **bezpieczeństwa** treści (czy wejście może wykonać się jako kod w cudzej przeglądarce, XSS). 7.1 odsyłał tu błędnie jako do źródła "sanityzacji" — sanityzacja przeciw wstrzyknięciom jest osobnym tematem, rozdział 7.7. Te dwie walidacje nie zastępują się nawzajem: pole może przejść 4.5 (liczba w poprawnym zakresie) i nadal być wektorem ataku, jeśli trafi do UI bez odpowiedniego escapowania (dotyczy głównie pól tekstowych, nie liczbowych — ale nazwy/opisy/notatki wpisywane przez użytkownika są tu typowym przypadkiem).
