# 07 — Bezpieczeństwo i prywatność

Powiązane: [06 API i sieć](06-api-i-siec.md) · [09 Zasady i granice AI](09-ai-w-produkcie.md) · [11 CI/Deployment](11-ci-deployment.md)

---

## 7.1. Reguła bazowa

Żaden sekret, klucz API ani logika płatności nie trafia do kodu klienta. Walidacja i sanityzacja każdego wejścia, na każdej warstwie, która je przyjmuje (poprawność domenowa: 4.5; sanityzacja przeciw wstrzyknięciom: 7.7).

[15.09.2026] ✅ POPRAWIONO — źródło: właściciel repo, audyt zabezpieczenia sesji. Odsyłacz do 4.5 był mylący — 4.5 dotyczy wyłącznie poprawności domenowej, nie sanityzacji przeciw wstrzyknięciom (XSS). Rozdzielone na dwa osobne odsyłacze, patrz 4.5 (dopisek 15.09.2026) i nowa 7.7 niżej.

## 7.2. Mapowanie zabezpieczeń natywnych → web (gdy projekt startuje jako PWA/web z myślą o mobile)

| Wymóg natywny | Odpowiednik web/PWA |
|---|---|
| Android Keystore / iOS Keychain | WebCrypto + sekrety wyłącznie po stronie serwera; tokeny w HttpOnly cookies |
| Obfuskacja (ProGuard/DexGuard/iXGuard) | minifikacja bundla; świadomość, że brak sekretów w kliencie jest jedyną realną ochroną |
| Root/jailbreak/SSL pinning | poza zakresem web; nagłówki bezpieczeństwa + wymuszone HTTPS |
| Restore purchases (App/Play Store) | odpowiednik płatności webowych (rozdział 12), natywne restore dopiero w wersji mobile |

## 7.3. Nagłówki bezpieczeństwa

`X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy` (ograniczaj do faktycznie używanych uprawnień, np. geolokalizacja `=(self)`).

[15.09.2026] ✅ DODANO — źródło: właściciel repo, pytanie kontrolne o kompletność zabezpieczenia sesji (18.5). **Brakowało `Content-Security-Policy` (CSP)** — jedyny nagłówek z tej listy, który ogranicza, co w ogóle może się wykonać na stronie (`script-src` bez `unsafe-inline`, jeśli tylko projekt na to pozwala; whitelist źródeł skryptów zamiast domyślnego "wszystko dozwolone"). Pozostałe nagłówki wyżej chronią przed innymi klasami ataków (MIME sniffing, wyciek referrera, downgrade do HTTP, nadużycie uprawnień przeglądarki) — żaden z nich nie ogranicza uruchomienia złośliwego skryptu. CSP nie eliminuje XSS (błąd w walidacji wejścia, 4.5, wciąż może go wpuścić), ale realnie zmniejsza jego zasięg — to samo miejsce w modelu zagrożenia, które 18.5 nazywa wprost jako granicę tego, czego `HttpOnly`/`SameSite`/CSRF token nie rozwiązują same z siebie.

[15.09.2026] ✅ DODANO — źródło: właściciel repo, dalsza część tego samego audytu. **Brakowało też ochrony przed clickjackingiem.** Dopisz `X-Frame-Options: DENY` (albo, jeśli projekt korzysta już z CSP powyżej, `frame-ancestors 'none'` w tym samym nagłówku — nowocześniejszy, obsługuje oba naraz) — domyślnie żadna strona aplikacji nie daje się osadzić w cudzej ramce `<iframe>`. Bez tego atakujący może nałożyć niewidoczną ramkę z Twoją zalogowaną aplikacją pod własnym interfejsem i nakłonić użytkownika do kliknięcia w coś, co wygląda niewinnie na stronie atakującego, a faktycznie kliknięcie trafia w Twoją aplikację (np. przycisk "usuń konto"/"potwierdź płatność"). Wyjątek: jeśli konkretny ekran ma być świadomie osadzalny (np. widget do embedowania na stronach partnerów) — `frame-ancestors` z jawną listą dozwolonych domen dla tego jednego ekranu, nigdy globalne zezwolenie "wszystko".

[16.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4), pułapka nazwana wprost przez ich własny komentarz w kodzie. Projekt dopuszcza dokładnie jeden inline `<script>` w CSP przez SHA-256 **hash** (mocniejsze niż `'unsafe-inline'`, bo whitelistuje jedną konkretną treść, nie "dowolny inline"). Hash był wpisywany **ręcznie**, przeliczany przez dewelopera i wklejany do `next.config.mjs` przy każdej zmianie treści skryptu. Ryzyko: ktoś zmienia skrypt i zapomina przeliczyć hash — CSP **po cichu** blokuje skrypt (błysk motywu/inne zjawisko, które skrypt miał eliminować, wraca), **bez błędu widocznego zwykłemu użytkownikowi** w konsoli (blokada CSP nie jest wyjątkiem JS). Ten sam wzorzec ryzyka co "cichy fallback"/"cicha rozbieżność" ostrzegany gdzie indziej w tym standardzie (`00-filozofia.md`) — tu akurat w bezpieczeństwie, nie w danych.

**Reguła.** Gdy CSP dopuszcza konkretny inline script przez hash, ten hash jest **liczony automatycznie** (skrypt buildowy albo krok CI porównujący świeżo wyliczony hash treści skryptu z tym zapisanym w konfiguracji CSP, failujący build przy rozjeździe) — nigdy ręcznie przepisywany przez dewelopera. Koszt wdrożenia jest niski (kilka linii w `next.config.mjs`/skrypcie buildowym), a eliminuje całą klasę cichych regresji bezpieczeństwa, które nie zostawiają śladu w normalnym przepływie testowania.

[16.09.2026, KOREKTA tego samego dnia] ✅ POPRAWIONO — źródło: inzynier-offgrid-pro (U.4), realny błąd produkcyjny znaleziony przy pierwszej faktycznej weryfikacji tej CSP w przeglądarce (`pnpm build && pnpm start`, nie `pnpm dev` — tam CSP jest złagodzona o `unsafe-inline`/`unsafe-eval` dla HMR, więc problem był niewidoczny przez każdą wcześniejszą sesję deweloperską). **Dopisek wyżej (auto-liczony hash) był potrzebny, ale niewystarczający — sam wzorzec "hash-based CSP" jest architektonicznie niekompatybilny z Next.js App Router.** Next.js App Router (13+) generuje własne, dodatkowe inline `<script>` do przesłania payloadu RSC streaming (`self.__next_f.push([...])`), jeden lub więcej PER ŻĄDANIE, z treścią zależną od danych renderowanej strony — taka treść z definicji nie może mieć stałego hasha z góry, obliczonego ręcznie czy automatycznie, bo każde żądanie generuje inną treść. Efekt w produkcji: `script-src` oparty wyłącznie o statyczne hashe blokuje CSP-em własne skrypty frameworka na każdej stronie z jakąkolwiek dynamiczną treścią (RSC/Suspense) — hydracja Reacta psuje się całkowicie (`Minified React error #412`), po cichu (błąd tylko w konsoli deweloperskiej, nie widoczny zwykłemu użytkownikowi), na każdym ekranie aplikacji.

**Poprawiona reguła.** Dwa reżimy CSP dla inline scriptów, rozróżnione wg architektury, nie jeden uniwersalny wzorzec: **(a) hash-based** (z regułą "liczony automatycznie" wyżej) pozostaje poprawny wyłącznie dla projektu bez Next.js App Routera albo z w pełni statycznym eksportem (`output: 'export'`, zero RSC/Suspense server-side) — czyli sytuacja bez dynamicznie generowanej treści inline. **(b) nonce-per-request w middleware** — WYMAGANY dla każdego projektu Next.js App Router z jakąkolwiek stroną renderowaną dynamicznie (co po uproszczeniu 17.4 dotyczy praktycznie każdego projektu rodziny, bo wszystkie czytają teraz cookie server-side dla języka). Middleware generuje losowy nonce (`crypto.randomUUID()`), dokłada go do nagłówka `Content-Security-Policy: script-src 'self' 'nonce-{wartość}'` ustawianego DYNAMICZNIE w middleware (nie w statycznej funkcji `headers()` w `next.config.mjs` — ta nie ma dostępu do per-request nonce'u), i przekazuje ten sam nonce przez nagłówek (np. `x-nonce`) odczytywany w Server Component roota. Next.js automatycznie dokłada ten nonce do WSZYSTKICH generowanych przez siebie inline-skryptów (w tym RSC streaming) i do własnych inline-skryptów projektu (np. `WYGLAD_INIT_SCRIPT`), jeśli wykryje go w nagłówku odpowiedzi — eliminuje to całkowicie potrzebę ręcznego czy automatycznego liczenia hasha.

**Diagnostyczna pułapka do zapamiętania.** Ten błąd był niewidoczny przez całą dotychczasową pracę, bo weryfikacja w przeglądarce szła przez `pnpm dev` (CSP złagodzona dla HMR). Test lokalny z inną (łagodniejszą) CSP niż produkcyjna nie jest wiarygodnym testem CSP — weryfikacja realnego `script-src` wymaga prawdziwego builda produkcyjnego (`pnpm build && pnpm start` czy odpowiednik) w prawdziwej przeglądarce, nie samego dev-serwera.

[24.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4). Rozszerzenie pułapki wyżej: sam prawdziwy build produkcyjny nie wystarcza, jeśli weryfikacja to tylko "wejdź na stronę, sprawdź konsolę". Realny przypadek: CSP zweryfikowana tym sposobem przepuściła zablokowaną funkcję generowania PDF opartą o WASM — błąd ujawniał się dopiero przy **kliknięciu** akcji uruchamiającej WASM, nie przy samym załadowaniu strony.

**Reguła.** Weryfikacja CSP w prawdziwym buildzie produkcyjnym obejmuje kliknięcie każdej akcji korzystającej z WASM/Web Workerów/`Blob`/`fetch` do zewnętrznych zasobów — nie tylko wejście na stronę i sprawdzenie konsoli przy starcie. Biblioteka oparta o WASM wymaga w CSP dyrektywy `'wasm-unsafe-eval'` — nigdy szerszego `'unsafe-eval'` (ten drugi dopuszcza dowolny `eval`/`Function()`, nie tylko kompilację WASM).

**Przyczyna źródłowa konkretnego przypadku.** [24.09.2026, uzupełnienie po odczytaniu dosłownego źródła] `@react-pdf/renderer` liczy layout przez `yoga-layout` skompilowane do WebAssembly — kompilacja WASM zachodzi dopiero w momencie kliknięcia akcji generującej PDF, nie przy wczytaniu strony, więc błąd `WebAssembly.instantiate` blokowany przez CSP jest niewidoczny przy zwykłym przeglądaniu appki. Osobno: nie każde ostrzeżenie CSP w konsoli oznacza realną lukę do załatania — np. nieszkodliwe ostrzeżenie o `connect-src data:` nie wymaga poszerzania CSP, tylko odróżnienia od błędów faktycznie blokujących funkcję aplikacji (przypadek WASM powyżej).

[24.09.2026] ✅ DOPRECYZOWANO — źródło: zero-waste (U.4). Korekta faktu: wcześniejszy zapis w `AKTUALIZACJE.md` (16.09.2026), że zero-waste jest "dziś bez CSP w ogóle", był nieaktualny — zero-waste wdrożyło CSP tego samego dnia (D91, `rejestr-decyzji.md`), z `script-src 'self' 'unsafe-inline'` (`'unsafe-eval'` wyłącznie poza produkcją). Wybór padł na `'unsafe-inline'` zamiast na regułę (a) wyżej (hash-based, jednoznacznie poprawną dla tego przypadku — zero-waste jest w pełni statycznym eksportem, dokładnie sytuacja, dla której (a) jest napisana), po tym jak pierwsza próba (nonce-per-request wg (b)) fizycznie nie zadziałała — HTML w pełni statycznych stron jest pieczony przy buildzie, więc nonce liczony per-request nigdy nie pasuje do treści wygenerowanej wcześniej (to nie błąd wdrożenia, tylko oczekiwana niekompatybilność (b) ze statycznym eksportem, zgodna z tym, jak (a)/(b) są tu rozdzielone).

**`'unsafe-inline'` nie jest trzecim, dopuszczalnym wariantem obok (a)/(b) — to nie zaostrzona reguła, tylko domknięcie pytania, które to zgłoszenie otwierało.** Dla projektu w pełni statycznym (SSG/`output: 'export'`) reguła (a) hash-based już jest właściwym, gotowym rozwiązaniem — `'unsafe-inline'` whitelistuje DOWOLNY inline script, nie tylko zamierzoną treść, więc jest realnie słabszy niż (a) bez żadnej korzyści technicznej wynikającej z bycia w pełni statycznym (to nie jest sytuacja analogiczna do "nonce fizycznie nie działa dla SSG" — hash fizycznie działa). **Akcja dla zero-waste**: migracja z `'unsafe-inline'` na hash-based (a) — ten sam auto-liczony mechanizm co już opisany wyżej dla inzynier-offgrid-pro, nie nowy wzorzec do wymyślenia od zera.

[24.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4), ta sama praca co skrypt kopiujący plik workera do `public/` (rozdz. 11.7). Biblioteka z własnym Web Workerem (np. MapLibre GL 6) wymaga w CSP dyrektywy **`worker-src 'self' blob:`** — bez niej przeglądarka blokuje uruchomienie workera nawet gdy plik fizycznie istnieje pod poprawną ścieżką (11.7), błąd nieodróżnialny na pierwszy rzut oka od samego brakującego pliku.

## 7.4. Checklist bezpieczeństwa kodu (definicja ukończenia — patrz też 10.4, 14.6)

- Brak sekretów w repozytorium (konfiguracja wyłącznie przez zmienne środowiskowe).
- Walidacja ścieżek plików (zapobieganie path traversal) przy każdej operacji na systemie plików sterowanej danymi użytkownika.
- Ograniczenie rozmiaru i kontrola formatu uploadów (zdjęcia, dokumenty).
- Zakaz wykonywania kodu dostarczonego przez użytkownika.
- Zakaz budowania komend powłoki przez konkatenację tekstu (parametryzowane wywołania zawsze).
- Zapytania SQL wyłącznie przez ORM/query builder z parametrami wiązanymi (bind parameters) — zakaz budowania SQL przez konkatenację/interpolację surowego tekstu, niezależnie od tego, czy backend to Supabase czy inny Postgres/baza. *(dopisane 15.09.2026 — źródło: właściciel repo, audyt zabezpieczenia sesji. To osobne zagrożenie od RLS z 6.5: RLS rozstrzyga, do których wierszy zapytanie ma prawo dotrzeć — parametryzacja rozstrzyga, czy dane wejściowe mogą w ogóle zmienić treść samego zapytania. Projekt może mieć wzorcową RLS i nadal być podatny na SQL injection, jeśli gdziekolwiek buduje zapytanie przez konkatenację stringów.)*
- Nowa funkcja korzystająca z API przeglądarki wymagającego uprawnienia (geolokalizacja, kamera, mikrofon, itd.) zaczyna od sprawdzenia nagłówka `Permissions-Policy` (7.3) — szablonowy nagłówek mógł już domyślnie wyłączyć to uprawnienie (np. `geolocation=()`), po cichu blokując funkcję bez błędu tłumaczącego przyczynę. *(dopisane 24.09.2026 — źródło: inzynier-offgrid-pro (U.4), realny przypadek: nowa funkcja GPS nie działała, przyczyną był szablonowy `Permissions-Policy: geolocation=()` ustawiony wcześniej z zupełnie innego powodu.)*

## 7.5. Prywatność lokalna-domyślna

**Reguła.** Dane wrażliwe (zdjęcia, lokalizacja, dane osobowe) pozostają domyślnie lokalnie na urządzeniu. Wysłanie ich do chmury (backup, przetwarzanie przez model AI, funkcje społecznościowe) wymaga:
- jawnej, świadomej zgody (opt-in, nigdy opt-out jako domyślny stan),
- jasnej informacji, co dokładnie zostanie wysłane,
- możliwości anonimizacji przed wysyłką,
- możliwości późniejszego usunięcia wysłanych danych.

**Uzasadnienie.** To rozszerza zasadę offline-first (rozdział 05) o wymiar prywatności, nie tylko dostępności — "działa bez internetu" i "nic nie wycieka bez zgody" to dwie osobne, równie ważne właściwości.

**Konsekwencja przy funkcjach lokalizacyjnych/społecznościowych.** Jeśli aplikacja udostępnia przybliżoną lokalizację innym użytkownikom (np. do porównań regionalnych czy funkcji społecznościowych), pozycja jest zaokrąglana do siatki/gminy, **nigdy** dokładny punkt GPS. To nie jest tylko kwestia prywatności w sensie ogólnym — jeśli lokalizacja wskazuje coś o wysokiej wartości lub wrażliwości (np. adres domowy, duża instalacja, magazyn), ujawnienie dokładnego punktu to realne ryzyko fizyczne (np. włamania), nie tylko cyfrowe. Rozdzielczość ma to uwzględniać od pierwszej wersji, nie jako poprawkę po fakcie.

## 7.6. Bezpieczeństwo płatności i freemium

Egzekwowanie limitów tier'u freemium wyłącznie po stronie serwera, nigdy tylko w UI klienta (rozdział 12) — UI-only ograniczenie jest trywialne do obejścia i nie jest zabezpieczeniem.

## 7.7. Sanityzacja treści przeciw wstrzyknięciom (XSS u źródła)

[15.09.2026] ✅ DODANO — źródło: właściciel repo, dokończenie audytu zabezpieczenia sesji (18.5, 7.3) — te dwie sekcje ograniczają *zasięg* XSS i chronią przed CSRF, ale nie odpowiadają na pytanie, jak nie dopuścić, by złośliwy skrypt w ogóle się wykonał. To jest ta odpowiedź.

**Reguła bazowa.** Każda treść pochodząca od użytkownika (nazwa, opis, notatka, komentarz, import pliku) trafiająca z powrotem do UI innego użytkownika (albo tego samego, w innej sesji) jest renderowana **wyłącznie przez domyślne, automatyczne escapowanie frameworku** (React/Vue/Svelte i analogiczne — tekst wstawiony jako `{wartosc}`, nigdy przez API wstawiające surowy HTML). **Zakaz świadomego obejścia auto-escapowania** (`dangerouslySetInnerHTML`, `v-html`, `{% autoescape false %}`, `innerHTML =` bezpośrednio) dla treści, której źródłem jest użytkownik — bez wyjątku domyślnie.

**Gdy projekt faktycznie potrzebuje formatowania (rich text/Markdown).** Renderowanie sformatowanej treści użytkownika przechodzi wyłącznie przez dedykowaną bibliotekę sanityzującą z allowlistą dozwolonych znaczników/atrybutów (np. DOMPurify), **nigdy przez własny filtr oparty o regex** — to ta sama pułapka co niekompletne wzorce regex w 17.6 (ASCII `\b`/`\w`): zagnieżdżone/zniekształcone znaczniki HTML systematycznie omijają ręcznie pisane filtry, a błąd ujawnia się dopiero przy złośliwym, nietypowym wejściu, nie przy typowych danych testowych.

**Pliki wgrywane przez użytkownika jako osobny wektor.** SVG i podobne formaty mogące nieść wykonywalną zawartość (skrypty w SVG, aktywna treść w niektórych typach dokumentów) nigdy nie są renderowane bezpośrednio inline z danych użytkownika — albo oczyszczone z aktywnej zawartości po stronie serwera przed zapisem, albo serwowane z osobnej domeny/`sandbox` bez uprawnień do wykonania skryptu. Uzupełnia to kontrolę formatu uploadów z 7.4 (tam: rozmiar/typ pliku; tutaj: co ten plik może zrobić, jeśli mimo poprawnego typu niesie aktywną zawartość).

**Granica.** To domyka model zagrożenia razem z 18.5 (cookie/CSRF) i 7.3 (CSP): 7.7 ogranicza, żeby złośliwy skrypt **nie powstał** w DOM-ie w pierwszej kolejności; CSP (7.3) ogranicza, co taki skrypt mógłby zrobić, gdyby jednak powstał; 18.5 ogranicza, co zyskałby atakujący, gdyby jednak się wykonał. Żadna pojedyncza warstwa nie jest wystarczająca sama — to świadomie obrona w głąb, nie redundancja do uproszczenia.
