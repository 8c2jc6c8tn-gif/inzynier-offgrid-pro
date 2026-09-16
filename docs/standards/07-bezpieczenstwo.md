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

## 7.4. Checklist bezpieczeństwa kodu (definicja ukończenia — patrz też 10.4, 14.6)

- Brak sekretów w repozytorium (konfiguracja wyłącznie przez zmienne środowiskowe).
- Walidacja ścieżek plików (zapobieganie path traversal) przy każdej operacji na systemie plików sterowanej danymi użytkownika.
- Ograniczenie rozmiaru i kontrola formatu uploadów (zdjęcia, dokumenty).
- Zakaz wykonywania kodu dostarczonego przez użytkownika.
- Zakaz budowania komend powłoki przez konkatenację tekstu (parametryzowane wywołania zawsze).
- Zapytania SQL wyłącznie przez ORM/query builder z parametrami wiązanymi (bind parameters) — zakaz budowania SQL przez konkatenację/interpolację surowego tekstu, niezależnie od tego, czy backend to Supabase czy inny Postgres/baza. *(dopisane 15.09.2026 — źródło: właściciel repo, audyt zabezpieczenia sesji. To osobne zagrożenie od RLS z 6.5: RLS rozstrzyga, do których wierszy zapytanie ma prawo dotrzeć — parametryzacja rozstrzyga, czy dane wejściowe mogą w ogóle zmienić treść samego zapytania. Projekt może mieć wzorcową RLS i nadal być podatny na SQL injection, jeśli gdziekolwiek buduje zapytanie przez konkatenację stringów.)*

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
