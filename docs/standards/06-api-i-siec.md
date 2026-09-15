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

## 6.5. Konfiguracja czytana przez SQL na hostowanym Postgresie: tabela z RLS, nigdy `ALTER DATABASE ... SET`

**Reguła.** Wartość konfiguracyjna czytana przez backend przez SQL (np. e-mail administratora panelu, próg limitu, flaga funkcji) żyje w zwykłej tabeli z RLS/`security definer`, nigdy w niestandardowym parametrze serwera (`current_setting('app.xxx')`, ustawianym `alter database ... set app.xxx = '...'`).

**Uzasadnienie.** `alter database ... set` zmienia konfigurację **całej instancji Postgresa**, nie jednej bazy per-aplikacja — hostowane platformy (np. Supabase) odmawiają tego z poziomu SQL Editora zwykłemu użytkownikowi (`ERROR 42501: permission denied to set parameter`), bo pozwoliłoby to jednemu klientowi platformy zmieniać ustawienia współdzielonego serwera innych klientów. Lokalny Postgres z kontem superusera nie ma tego ograniczenia — więc mechanizm przechodzi każdą lokalną weryfikację i wybucha dopiero przy pierwszym wdrożeniu na docelowej platformie hostowanej, gdzie moment odkrycia jest najdroższy.

**Konsekwencja.** `INSERT`/`UPDATE` na zwykłej tabeli schematu `public` to zwykłe uprawnienie na obiekt, nie ustawienie serwera — działa identycznie lokalnie i na platformie hostowanej. Jeśli projekt korzysta z hostowanego Postgresa (Supabase czy podobnego) i lokalna weryfikacja obejmuje tylko poprawność SQL/RLS, a nie model uprawnień samej platformy hostującej (7.4) — to nie jest pełna weryfikacja, tylko jej część.

## 6.6. SSRF — gdy serwer sam wykonuje żądania na podstawie danych od użytkownika

[15.09.2026] ✅ DODANO — źródło: właściciel repo, audyt zabezpieczenia sesji. **Reguła warunkowa** — dotyczy tylko projektu, w którym backend wykonuje żądanie HTTP do adresu URL pochodzącego (choćby częściowo) od użytkownika: proxy obrazków/miniaturek, pobieranie pliku spod podanego linku, webhook wywoływany pod adres skonfigurowany przez użytkownika, generator podglądu linku. Nie dotyczy 6.1 (proxy do *z góry znanych* zewnętrznych API — tam adres docelowy nie pochodzi od użytkownika).

**Reguła.** Gdy taki mechanizm istnieje: waliduj docelowy URL przed wykonaniem żądania — zablokuj adresy wskazujące na sieć wewnętrzną/lokalną (`127.0.0.1`, `localhost`, `169.254.169.254` — adres metadanych chmurowych AWS/GCP/Azure, zakresy prywatne `10.x`/`172.16-31.x`/`192.168.x`), zablokuj protokoły inne niż `http`/`https` (nie `file://`, `ftp://`, `gopher://`), nie podążaj automatycznie za przekierowaniem bez ponownej walidacji nowego adresu (przekierowanie może prowadzić z zewnętrznego adresu na wewnętrzny).

**Uzasadnienie.** Bez tej walidacji serwer aplikacji staje się dla atakującego narzędziem do odpytywania sieci wewnętrznej/infrastruktury chmurowej, do której atakujący sam nie ma bezpośredniego dostępu — serwer "pożycza" swoją uprzywilejowaną pozycję sieciową.
