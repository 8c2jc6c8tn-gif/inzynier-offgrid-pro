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

## 4.4. Świadome odblokowanie błędu do ostrzeżenia

**Reguła.** Błąd (🔴) może zostać obniżony do ostrzeżenia (🟡) **wyłącznie** przez jawną, świadomą zgodę użytkownika (np. zaznaczenie checkboxa "potwierdzam ryzyko"). Sam brak działania nigdy nie obniża poziomu automatycznie. Niektóre twarde stopy (te o najwyższym ryzyku dla zdrowia lub bezpieczeństwa) nie mają takiego obejścia z premedytacji i pozostają zablokowane bez wyjątku — decyzja, które to są, należy do właściciela projektu i ma być spisana w `docs/memory.md`.

## 4.5. Walidacja wielowarstwowa

**Reguła.** Waliduj: zakresy, jednostki, wartości zerowe/ujemne tam gdzie nie mają sensu domenowego, zależności między polami, kompletność danych, zgodność wersji schematu danych (rozdział 02). **Walidacja interfejsu nigdy nie zastępuje walidacji domenowej** — ta sama reguła musi obowiązywać niezależnie od tego, przez jaką warstwę prezentacji dane wejdą (formularz, API, import pliku, głos).
