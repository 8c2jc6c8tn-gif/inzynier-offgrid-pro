# 06 — API i sieć

Powiązane: [05 Baza danych i offline-first](05-baza-danych-offline.md) · [07 Bezpieczeństwo](07-bezpieczenstwo.md) · [12 Freemium i płatności](12-freemium.md)

---

## 6.1. Proxy do zewnętrznych API: waliduj, ogranicz czasowo, nigdy nie zmyślaj

**Reguła.** Każdy route/endpoint proxujący zewnętrzne API (dane referencyjne, ceny, pogoda, bazy produktów...):
- waliduje parametry wejściowe przed wysłaniem dalej,
- ustawia jawny timeout (np. `AbortSignal.timeout(...)`),
- sprawdza kształt odpowiedzi zewnętrznego serwisu przed przekazaniem dalej,
- przy błędzie zwraca jawny status błędu z kodem powodu — **nigdy nie zwraca zmyślonych/zgadywanych danych w miejsce prawdziwych**.

**Uzasadnienie.** Aplikacja ustalająca twarde, weryfikowalne fakty domenowe (00.3) nie może w cichym miejscu zacząć zwracać przybliżeń podszywających się pod dane rzeczywiste — to podważa całą wiarygodność wyników.

**Konsekwencja w UI.** Gdy dane zewnętrzne są niedostępne, odpowiedni panel/widżet **chowa się** lub jawnie oznacza "dane niedostępne" — nigdy nie pokazuje placeholdera wyglądającego jak realna liczba.

## 6.2. Offline queue

**Reguła.** Operacja użytkownika (np. dodanie wpisu wymagającego dalszego przetworzenia przez usługę online) nigdy nie czeka na sieć, jeśli sama operacja da się zapisać lokalnie. Trafia do stanu "w kolejce" i jest przetwarzana automatycznie po powrocie połączenia (nasłuch zdarzenia online przeglądarki lub odpowiednika platformowego).

## 6.3. Sekrety wyłącznie po stronie serwera

**Reguła.** Żaden klucz API ani sekret nigdy nie trafia do kodu klienta/bundla. Endpointy niewymagające klucza (np. darmowe API publiczne) w ogóle go nie wymagają od klienta. Endpointy wymagające płatnego/prywatnego API (np. rozpoznawanie obrazu przez model AI) czytają klucz wyłącznie w warstwie serwerowej i **łagodnie degradują** do trybu ręcznego, gdy klucza brak — nigdy nie rzucają nieobsłużonego wyjątku do wywołującego.

## 6.4. Idempotency przy płatnościach

**Reguła.** Każde żądanie płatności niesie klucz idempotency, żeby powtórzenie żądania (np. przez niestabilne połączenie) nie skutkowało podwójnym obciążeniem. Patrz rozdział 12.
