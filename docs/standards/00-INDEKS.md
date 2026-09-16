# Standard projektowy — indeks rozdziałów

Pakiet referencyjny wspólny dla wszystkich naszych aplikacji (obecnych i przyszłych, niezależnie od domeny). Jeden plik = jeden rozdział, każdy samodzielnie czytelny. Powiązany z `docs/memory.md` (specyfika tego konkretnego projektu) i `CLAUDE.md` (krótki punkt wejścia dla AI).

**Relacja do GOD BOOK.** Ten standard opisuje *czym budujemy* (stała architektura, wspólna dla całej rodziny aplikacji). Osobny dokument, `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_18.md`, opisuje *jak prowadzić proces* budowy Biblii tego konkretnego projektu — od burzy mózgów do wdrożenia. Pełna relacja i kolejność czytania obu naraz: Część Y tamtego dokumentu.

## Zalecana kolejność czytania

**Na starcie każdej sesji nad projektem korzystającym z tego standardu:** `CLAUDE.md` → `docs/memory.md` (lub `00_Biblia.md`, jeśli projekt prowadzi pełną Biblię wg GOD BOOK) → [00](00-filozofia.md) → dokument tematyczny związany z zadaniem.

**Przy budowie nowego projektu od zera:** 00 → 01 → 02 → 03 → 04 → reszta wg potrzeby.

## Spis rozdziałów

| # | Rozdział | O czym |
|---|---|---|
| [00](00-filozofia.md) | Filozofia i jak czytać ten standard | Nadrzędność standardu nad kodem, filozofia produktowa i procesowa, skąd to się wzięło. |
| [01](01-architektura.md) | Architektura | Warstwy, kierunek zależności, wzorzec Kernela, echo pattern, generyczny silnik. |
| [02](02-model-danych.md) | Model danych i profile kontekstowe | Dane nie kod, model projektu/rekordu, wersjonowanie schematu i migracje. |
| [03](03-jadro-obliczeniowe.md) | Jądro logiki domenowej | Kontrakt wyniku, status, podwójna weryfikacja, jednostki i zaokrąglenia, audit trail. |
| [04](04-walidacja-i-twarde-stopy.md) | Walidacja, ostrzeżenia i twarde stopy | Werdykt 🟢🟡🔴, Kontrakt Widżetu, zbiorczy rejestr twardych stopów. |
| [05](05-baza-danych-offline.md) | Baza danych i offline-first | Seed vs Wynik, StorageAdapter, offline jako wymóg. |
| [06](06-api-i-siec.md) | API i sieć | Proxy bez zmyślania danych, offline queue, sekrety server-side, SSRF przy żądaniach na podstawie danych użytkownika. |
| [07](07-bezpieczenstwo.md) | Bezpieczeństwo i prywatność | Mapowanie natywne→web, nagłówki (CSP, clickjacking), prywatność lokalna-domyślna, sanityzacja treści przeciw XSS u źródła, SQL injection. |
| [08](08-ui-ux.md) | UI/UX i treść | Taksonomia wzorców ekranu A-H, szablon Doradcy, tryb prosty/zaawansowany. |
| [09](09-ai-w-produkcie.md) | Zasady i granice AI w produkcie | Obowiązkowość AI (warstwa wyłącznie-online nad rdzeniem), AI vs logika deterministyczna, kontrakt `AiToolDefinition`, budżet/koszt egzekwowany jak freemium, wzorce UX, ujawnianie niepewności. |
| [10](10-testy.md) | Testy | Minimalny zestaw per moduł, test integracyjny jądra, DoD. |
| [11](11-ci-deployment.md) | CI/Deployment | Jeden lockfile, CI niezależne od hostingu, skanowanie podatności zależności, przykład referencyjny CI (`docs/przyklady/ci/`). |
| [12](12-freemium.md) | Freemium i płatności | Feature→tier jako dane, egzekwowanie server-side. |
| [13](13-droga-mobile.md) | Droga web → mobile | Punkty wymiany (w tym preferencja języka: cookie/`Accept-Language` → `StorageAdapter`/locale systemu), etapowanie. |
| [14](14-proces-i-pamiec.md) | Proces, wersjonowanie i pamięć projektu | Dziennik zmian, znane luki, `docs/memory.md`. |
| [15](15-wspolpraca-z-ai.md) | Współpraca z asystentami AI | Integralność informacji, hierarchia źródeł prawdy, zgłaszanie konfliktów. Źródło `CLAUDE.md`. |
| [16](16-standard-kodowania.md) | Standard kodowania | Priorytety jakości, nazewnictwo, projektowanie funkcji, niemutowalność, nazwane typy błędów, komentarze — przekrojowo, niezależnie od warstwy i języka. |
| [17](17-i18n.md) | Wielojęzyczność (i18n) | Kernel zwraca klucze nie tekst, profil regionalny vs język UI, stan lokalny nie URL routing (cookie przy SSR + `Accept-Language` na pierwszą wizytę, `localStorage` tylko czysto klienckie), treść rozpoznawana ≠ tłumaczenie 1:1, pułapki regex/ICU plural, status draft/reviewed, treść bezpieczeństwo-krytyczna, przykład referencyjny mechanizmu strażniczego AST (`docs/przyklady/i18n/`). |
| [18](18-logowanie.md) | Logowanie, konta i tożsamość | Dostawcy (magic link/Google/Apple), open redirect w linku powrotnym, scalanie tożsamości, Supabase Auth, sesja/tokeny (SameSite/CSRF), multi-device vs multi-user, grupy współdzielone, sync = Seed nigdy Wynik, rozwiązywanie konfliktu synchronizacji, transfer danych między powiązanymi appkami przez plik. |

## Zasada dla tego pakietu samego w sobie

Ten standard podlega tym samym zasadom, które opisuje — w szczególności rozdziałowi 14 (jawna korekta zamiast cichego nadpisania) i rozdziałowi 15 (nigdy nie rozstrzygaj konfliktu samodzielnie). Zmiana reguły w jednym z naszych projektów, która ma zastosować się do wszystkich, wraca tutaj — nie zostaje lokalną, niewidoczną modyfikacją w jednym repo.
