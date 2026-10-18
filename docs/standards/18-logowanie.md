# 18 — Logowanie, konta i tożsamość

Powiązane: [05 Baza danych i offline-first](05-baza-danych-offline.md) · [06 API i sieć](06-api-i-siec.md) · [07 Bezpieczeństwo](07-bezpieczenstwo.md) · [12 Freemium i płatności](12-freemium.md) · [13 Droga web → mobile](13-droga-mobile.md)

Dotyczy mechaniki logowania i tożsamości — kto może korzystać z aplikacji i jak. Co dokładnie odblokowuje płatność (FREE vs PRO) jest w rozdziale 12; ten rozdział mówi wyłącznie o samym mechanizmie konta.

Źródło: doświadczenie zero-waste (realnie zbudowany, działający system kont/multi-device/sync) + niezależne, zbieżne wnioski inzynier-szkieletowy-pro i inzynier-offgrid-pro, zebrane mechanizmem U.4 tego samego dnia (14.09.2026).

---

## 18.1. Zasada nadrzędna

Konto jest wymagane od pierwszego uruchomienia aplikacji, bez wyjątku. To rozszerzenie 5.3 ("pierwsze pobranie danych" obejmuje jednorazową aktywację/logowanie), nie jej złamanie — po jednorazowym zalogowaniu aplikacja działa w pełni offline (05), zgodnie z filozofią rodziny (wszystkie aplikacje są długotrwałego, powtarzalnego użytku, nie jednorazowego).

**Uzasadnienie — trzy niezależne, równorzędne powody:**
1. **Kontrolowany trial** — bez tożsamości nie da się bezpiecznie ograniczyć czasowego dostępu do PRO (12.6).
2. **Weryfikacja tier'u** — model subskrypcyjny (12.5) wymaga jednoznacznej tożsamości do odwołania/odnowienia/przeniesienia zakupu między urządzeniami.
3. **Ograniczenie botów i nadużyć** — w pełni anonimowy dostęp uniemożliwia skuteczny rate limiting (18.11); konto daje jednostkę, wobec której limity i blokady faktycznie działają.

[21.09.2026] ✅ DOPRECYZOWANO — źródło: właściciel repo. 18.1 ("bez wyjątku") jest już dziś tym samym rodzajem bezwarunkowej obowiązkowości co 9.0 (rozdz. 09) — dotyczy KAŻDEGO projektu rodziny, również już istniejących, nie tylko nowych budowanych od zera. Nazwane tu wprost dla spójności z równoległym doprecyzowaniem 17.1a i 5.7 (ten sam wątek, ta sama decyzja).

## 18.2. Dostawcy logowania

Trzy równorzędne metody logowania od startu: **magic link e-mail** (passwordless), **Google**, **Apple**. Magic link eliminuje temat "reset hasła" jako kategorię — nie ma hasła, nie ma czego resetować.

**Apple Sign-In jest wymagany**, jeśli aplikacja oferuje jakikolwiek inny provider społecznościowy (Google) — zasada App Store, niezależnie od platformy docelowej (13). Koszt: Apple Developer Program, 99 USD/rok, do uwzględnienia w budżecie od dnia decyzji o dodaniu Google, nie odkładany "na wersję mobile".

2FA poza zakresem uniwersalnego wymogu v1 — decyzja per projekt.

[15.09.2026] ✅ DODANO — źródło: właściciel repo, audyt zabezpieczenia sesji. **Magic link niesie URL powrotny (redirect) po kliknięciu w linku e-mail — to klasyczny wektor open redirect, jeśli nie jest sprawdzony.** Bez walidacji atakujący może wygenerować pozornie normalny link logowania do Twojej domeny, w którym parametr powrotny wskazuje na stronę atakującego — ofiara loguje się prawdziwie (link faktycznie przyszedł z Twojego systemu), po czym zostaje przekierowana gdzie indziej, z zaufaniem wynikającym z tego, że cały proces zaczął się na Twojej domenie (phishing korzystający z Twojej reputacji). **Wymóg:** URL powrotny zawsze sprawdzany wobec allowlisty własnych, znanych ścieżek/domen aplikacji (nigdy przyjmowany jako dowolny string z parametru) — dopuszczalna jest tylko ścieżka względna w obrębie własnej aplikacji albo pełny URL na jawnie wypisanej liście własnych domen (np. wersje web/mobile tej samej aplikacji).

[18.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpis z 18.10.2026), decyzja właściciela repo: **klucz dostępu (passkey, WebAuthn) będzie w każdym projekcie rodziny**, jako dodatkowa metoda logowania obok trzech podstawowych (nie zamiast nich: magic link, Google i Apple zostają). Termin wdrożenia w istniejącym projekcie ustala jego właściciel. Zasady niezależne od dostawcy:
- **Zgodność z 18.5.** Rejestracja i logowanie kluczem dostępu wołane są wyłącznie po stronie serwera (Server Action, route albo endpoint backendu), a sesja zostaje w `HttpOnly` cookie. Gotowa funkcja SDK dostawcy, która obsługuje klucz w przeglądarce i trzyma sesję po stronie klienta, łamie 18.5 i nie jest używana. Okno systemowe otwiera przeglądarka natywnym API (`PublicKeyCredential`, w tym funkcje `parse…OptionsFromJSON` i `toJSON()`).
- **Klucz zakłada się po zalogowaniu inną metodą.** Usługa wymaga istniejącego konta, więc passkey jest dodatkiem do konta, nie sposobem jego założenia.
- **Identyfikator strony (RP ID) to domena i jest niezmienny po zapisaniu pierwszych kluczy.** Domenę produkcyjną wybiera się **przed** włączeniem kluczy dostępu; zmiana domeny unieważnia zapisane klucze.
- **Eksperymentalność u dostawcy.** Gdy dostawca oznacza funkcję jako eksperymentalną, każde podniesienie wersji biblioteki auth wymaga ręcznego przejścia ścieżki (rejestracja, logowanie, usunięcie klucza) na prawdziwym urządzeniu przed wdrożeniem.
- **Przykład (zweryfikowany w jednym projekcie):** Supabase Auth ma klucze dostępu natywnie (`supabase-js` od 2.105, flaga `auth.experimental.passkey`); w inzynier-offgrid-pro użyto dwuetapowego interfejsu `auth.passkey.*` wołanego tylko z Server Actions. Pozostałe dostawcy (np. Keycloak w farmer360.io) realizują te same zasady własnym mechanizmem; nie sprawdzono tego tutaj.

## 18.3. Scalanie tożsamości

**Automatyczne** — ten sam zweryfikowany adres e-mail zalogowany przez różnych providerów to jedno konto, scalane automatycznie po adresie.

**Ręczne — gdy adresy nie mogą się zgodzić** (najczęstszy przypadek: Apple private relay, `@privaterelay.appleid.com`, zamiast prawdziwego adresu). System nie może się tego domyślić sam — żadnego dopasowywania po urządzeniu/fingerprintingu (złamałoby 7.5). Jedyny bezpieczny mechanizm:

1. **Inicjacja wyłącznie przez użytkownika**, z poziomu już zalogowanego konta: Ustawienia → "Dodaj/połącz metodę logowania".
2. **Weryfikacja = pełne, żywe uwierzytelnienie drugiej tożsamości w tej samej sesji.** Użytkownik przechodzi cały flow logowania dla drugiego konta, będąc już zalogowanym na pierwsze — skuteczne ukończenie tego uwierzytelnienia jest dowodem posiadania, tym samym poziomem zaufania co reszta systemu.
3. **Jeśli druga tożsamość jest już osobnym kontem z własnymi danymi** — ten sam wzorzec co dołączanie do grupy (18.7): migawka danych obu kont przed scaleniem + ręczne potwierdzenie duplikatów + pełny resync po scaleniu. Nigdy auto-merge.
4. Po scaleniu drugie konto przestaje istnieć jako osobny byt logowania (18.8), jego dane (Seed) żyją dalej pod kontem docelowym.

System może **proaktywnie zasugerować** ten flow, gdy przy zwykłym logowaniu adresy e-mail faktycznie się zgadzają — ale to tylko podpowiedź prowadząca do kroków 1–2, nie substytut ręcznej weryfikacji.

## 18.4. Supabase Auth jako wymóg

Wszystkie projekty rodziny korzystają z Supabase Auth, spójnie z wzorcem RLS-config (6.5) — nie osobna decyzja infrastrukturalna per projekt. Świadome odejście dopuszczalne wyłącznie jako jawna, udokumentowana decyzja (0.1 — nigdy cicha rozbieżność), nie domyślny wybór innego dostawcy z wygody chwili. Mechanizm auth ma przetrwać punkt wymiany web→mobile (13) bez przepisywania.

## 18.5. Sesja i tokeny — bezpieczeństwo

Token sesji wyłącznie w `HttpOnly` cookie, **nigdy** przez `StorageAdapter` projektu — spójne z już istniejącym 7.2 ("tokeny w HttpOnly cookies"). `StorageAdapter` (5.2) abstrahuje dane domenowe (Seed), nie sekrety sesji — łatwa pomyłka łamiąca 7.2 po cichu, warta jawnego zakazu.

[15.09.2026] ✅ DODANO — źródło: właściciel repo, pytanie kontrolne o kompletność zabezpieczenia sesji. **`HttpOnly` samo w sobie broni tylko przed wyniesieniem tokenu przez XSS — nie przed CSRF ani przed działaniem XSS "na żywo" w ramach sesji.** Cookie sesyjne wymaga dodatkowo:

- **`Secure`** — cookie nigdy nie leci przez zwykłe HTTP, wyłącznie HTTPS.
- **`SameSite=Lax` jako domyślny wybór** (`Strict` tam, gdzie projekt nie potrzebuje, by sesja przetrwała wejście z linku zewnętrznego — np. z e-maila magic-linku, patrz 18.2). `SameSite=Lax` blokuje dołączenie cookie do żądań wywołanych z obcej strony (CSRF) **z wyjątkiem** nawigacji GET na najwyższym poziomie — dlatego:
- **Żadna operacja zmieniająca stan (POST/PUT/PATCH/DELETE) nigdy nie jest wywoływana przez GET** (patrz też 4.5, walidacja wejścia) — to zamyka lukę, którą `SameSite=Lax` świadomie zostawia otwartą.
- **Token CSRF (synchronizer token albo double-submit cookie) na każdym endpointzie zmieniającym stan**, niezależnie od `SameSite` — obrona w głąb, nie zamiennik. `SameSite` to ochrona przeglądarki, token CSRF to ochrona po stronie serwera; jedno bez drugiego zostawia lukę, gdy przeglądarka użytkownika jest starsza/źle skonfigurowana albo gdy projekt kiedyś złagodzi `SameSite`.

**Granica tego, czego to nie rozwiązuje.** XSS, który już wykonuje się na stronie, nadal może wywoływać żądania do Twojego API w imieniu zalogowanego użytkownika (przeglądarka dołączy `HttpOnly` cookie automatycznie) — powyższe chroni przed **wyniesieniem** tokenu i przed **obcą stroną**, nie przed złośliwym skryptem działającym w obrębie Twojej własnej strony. To domyka 7.3 (nagłówki bezpieczeństwa, w tym CSP) — ograniczenie tego, co w ogóle może się wykonać, jest komplementarne, nie zastępcze wobec zabezpieczeń cookie tutaj.

[16.09.2026] ✅ DOPRECYZOWANO — źródło: inzynier-offgrid-pro (U.4), pułapka między 18.4 i tą sekcją, znaleziona i sprawdzona wprost w kodzie biblioteki. **18.4 (Supabase Auth jako wymóg) i wymóg `HttpOnly` tutaj kolidują dla najbardziej oczywistego, udokumentowanego sposobu użycia biblioteki.** `createBrowserClient()` (`@supabase/ssr`, klient dla komponentów klienckich, dokumentowany jako standardowy sposób odczytu stanu logowania po stronie przeglądarki) ma domyślnie `httpOnly: false` — nie przez zaniedbanie biblioteki, tylko dlatego, że JavaScript w przeglądarce z definicji nie może ustawić/odświeżyć `HttpOnly` cookie, a ten klient musi to robić. Skutek: projekt, który podąży za "oczywistym" wzorcem (Server Component loguje, komponent kliencki czyta status logowania przez `createBrowserClient().auth.getUser()`), **cicho łamie wymóg `HttpOnly` powyżej** przy pierwszym odświeżeniu tokenu przez klienta — sama obecność `createBrowserClient` gdziekolwiek w kodzie wystarczy, żeby zepsuć resztę, niezależnie od poprawnych opcji przekazanych po stronie serwera.

**Reguła.** Nigdy nie używaj klienta Supabase w przeglądarce (`createBrowserClient` czy odpowiednik innej biblioteki auth) do odczytu stanu sesji. Stan logowania czytany wyłącznie server-side (Server Component albo Server Action), nawet kosztem dodatkowego round-tripu do serwera przy każdym odczycie w komponencie klienckim. Dopiero bez żadnego przeglądarkowego klienta auth w kodzie, jawne `cookieOptions: { httpOnly: true, secure: ..., sameSite: ... }` przekazane do `createServerClient` faktycznie działa zgodnie z tą sekcją, bez ryzyka cichego nadpisania przez inny fragment kodu.

[16.09.2026] ✅ ROZSTRZYGNIĘTE — pytanie otwarte zgłoszone przez inzynier-offgrid-pro (U.4, 15.4): czy wbudowana ochrona Next.js Server Actions (weryfikacja nagłówka Origin/Host przez framework przy każdym wywołaniu) spełnia wymóg "tokenu CSRF" powyżej. **Tak — ale wyłącznie dla prawdziwych Server Actions, nie dla zwykłych Route Handlerów/API routes.** Uzasadnienie: weryfikacja Origin/Host daje ten sam efekt ochronny co synchronizer/double-submit token (żądanie z obcej domeny nie potrafi podrobić zgodnego nagłówka Origin) i jest wbudowana we framework — zawsze aktywna, nie do pominięcia przez zapomnienie dodania tokenu na nowym endpointzie, więc w praktyce mocniejsza gwarancja niż ręcznie doklejany token. Zastrzeżenie: to dotyczy wyłącznie mechanizmu Server Actions samego frameworka — zwykły Route Handler/API route (nawet w tym samym projekcie Next.js) nie ma tej ochrony automatycznie i nadal wymaga jawnego tokenu CSRF zgodnie z regułą powyżej.

## 18.6. Multi-device vs multi-user — dwa różne problemy

"To samo konto na wielu urządzeniach" (synchronizacja) i "wiele osób dzielących te same dane" (gospodarstwo domowe/zespół) to **dwa niezależne mechanizmy**, mylone na starcie. Pierwszy działa od razu z byle backendem auth. Drugi wymaga osobnego modelu członkostwa — nie da się go dorobić później bez migracji danych.

## 18.7. Model grupy współdzielonej (household/zespół)

Gdy projekt potrzebuje współdzielenia danych między kontami:

- **`grupa.id` jako samodzielna encja**, nigdy z twardym FK do konta założyciela — kaskadowe usunięcie konta założyciela nie może usunąć całej grupy.
- **RLS grupowe przez `security definer` helper** (`grupa_id_for(uid)`), nie rekurencyjne podzapytanie na tabeli członkostwa.
- **Dołączenie do grupy = migawka danych przed dołączeniem** + ręczne potwierdzenie duplikatów przez człowieka. Nigdy auto-merge.
- **Pełny resync po dołączeniu**, nie tylko delta — serwer ma zero rekordów pod nowym właścicielem grupowym.
- **Etykieta "kto zmienił"** na bannerze konfliktu pokazywana wyłącznie, gdy grupa ma >1 członka.

## 18.8. Usuwanie konta

Prawdziwy `DELETE`, nie tombstone, z `ON DELETE CASCADE` na kolumnie właściciela. Konto będące administratorem grupy z innymi członkami **nie może się usunąć**, dopóki nie przekaże roli administratora dalej.

## 18.9. Zakres synchronizacji: Seed, nigdy Wynik

Rozszerzenie 5.1 na chmurę — synchronizowane jest wyłącznie surowe wejście użytkownika, nigdy przeliczony wynik. Eliminuje klasę błędów "wynik z chmury niezgodny z nowszą wersją silnika obliczeniowego".

## 18.10. Zanim zbudujesz sync dla danego typu danych

Sprawdź (`grep`/audyt referencji), czy dany typ danych jest w ogóle gdziekolwiek wyświetlany z powrotem użytkownikowi, **zanim** zbudujesz dla niego mechanizm synchronizacji/retencji.

## 18.11. Niezawodność sync na hostingu serverless

Rate limiting liczony w zmiennej procesu **nie działa** na hostingu serverless (różne instancje = osobna pamięć) — licznik musi siedzieć w bazie danych. Minimalny, tani zestaw niezawodności: retry z backoffem + rate limit w bazie + monitoring błędów wąsko zakresowany do kilku znanych, krytycznych miejsc.

## 18.12. Offline-first a wymóg konta

Rdzeń domenowy (5.3) działa w pełni offline **po** jednorazowej aktywacji kontem — to nie złamanie 5.3, tylko rozróżnienie dwóch osobnych wymiarów: "offline-first" dotyczy dostępności funkcji bez sieci między sesjami, nie eliminacji wymogu tożsamości na starcie. Warte jawnego zapisania: dwa niezależne projekty (offgrid, szkieletowy-pro), wywodząc wniosek czysto z 5.3 w izolacji, doszły do "konto = rozszerzenie, nigdy brama" — sprzecznie z 18.1. Wymóg konta ma dwa niezależne uzasadnienia biznesowe/bezpieczeństwa (kontrolowany trial, anty-bot), o których 5.3 milczy — bez tego zdania każdy kolejny projekt popełni ten sam błąd wnioskowania.

## 18.13. Chmura wyłącznie po zakupie premium

Chmura/synchronizacja jest dostępna wyłącznie po zakupie premium, we wszystkich projektach rodziny (pełny podział FREE/PRO: rozdział 12). Konto FREE (sam fakt zalogowania) nie daje dostępu do chmury — dane pozostają w 100% lokalne (5.3). Moment zgody na wysyłkę do chmury (7.5) następuje przy zakupie premium / włączeniu synchronizacji, nie przy rejestracji.

## 18.14. Rozwiązywanie konfliktu synchronizacji (wzorzec opcjonalny)

**Status.** Nie jest to reguła obowiązkowa jak 18.1–18.13. Wzorzec włączany świadomie, per projekt, gdy realne jest ryzyko równoległej edycji offline tego samego rekordu na dwóch urządzeniach (ten sam mechanizm klasyfikacji co Y.10 GOD BOOK — moduły opcjonalne, nigdy dodawane automatycznie). Projekt jednourządzeniowy, albo taki, gdzie kolizje są w praktyce niemożliwe, może świadomie z niego zrezygnować na rzecz prostszego last-write-wins.

**Krok 1 — Wykrycie.** Każdy synchronizowany rekord (Seed, 18.9) niesie `base_version` — wersję serwera, od której urządzenie zaczęło swoje lokalne zmiany. Przy wypchnięciu zmian serwer porównuje przychodzący `base_version` z aktualną wersją. Zgodne → zapis wprost. Niezgodne → policz różnicę pole-po-polu między zmianami lokalnymi a już zapisanymi na serwerze (oba względem wspólnego przodka). Rozłączne pola → auto-merge, cicho. **To samo pole zmienione po obu stronach → prawdziwy konflikt** (dokładny próg, nie ocena "jak duże jest nakładanie się"), Krok 2.

**Krok 2 — Prezentacja użytkownikowi.** Pełny ekran (nie cichy baner), przy najbliższej okazji, gdy urządzenie z konfliktem jest online: nazwa rekordu, czytelne zestawienie różnic (08 UI/UX, nie surowy JSON), trzy opcje:
1. **Zachowaj wersję z tego urządzenia** — staje się kanoniczną wersją w chmurze.
2. **Zachowaj wersję z chmury** — odrzuć zmiany lokalne (nie bezpowrotnie, patrz Krok 3).
3. **Zachowaj obie** — użytkownik i tak wskazuje, która staje się kanoniczna (system zawsze potrzebuje jednej aktywnej wersji), druga trafia do archiwum jako przywracalny snapshot.

**Krok 3 — Model danych archiwalnej wersji.** Osobny magazyn `zapisane_rozbieznosci`, nigdy nadpisywanie w tym samym rekordzie co dane aktywne (czystość Kernela, 01). Pola: `rekord_id`, `tresc` (pełny Seed odrzuconej wersji, nigdy Wynik), `data_rozjazdu`, `powod` = stała etykieta **"zachowane na prośbę użytkownika"** (nie dowolny tekst — spójna, tłumaczalna fraza), `status`: dostępna do przywrócenia / przywrócona / usunięta trwale.

**Krok 4 — Widoczność w Profilu/Ustawieniach.** Sekcja "Synchronizacja", obok statusu "Zalogowano i zsynchronizowano ✅", dodatkowa podsekcja widoczna tylko gdy istnieją wpisy w `zapisane_rozbieznosci`: nazwa rekordu, data rozjazdu, etykieta "zachowane na prośbę użytkownika", dwie akcje — **Przywróć** (jawnie ponownie uruchamia Krok 1 wobec aktualnej wersji kanonicznej) i **Usuń trwale**.

**Krok 5 — Zasada nadrzędna.** Żadna z trzech opcji w Kroku 2 nie usuwa danych trwale bez osobnej, jawnej akcji użytkownika w Kroku 4. Rozszerzenie 0.4.4 (zero cichych luk) na przypadek konfliktu sync.

## 18.15. Transfer danych między powiązanymi appkami rodziny (wzorzec opcjonalny)

[15.09.2026] ✅ DODANO — źródło: właściciel repo, projekt inzynier-szkieletowy-pro / inzynier-offgrid-pro (dwie appki tej samej marki, jedna kontynuacją drugiej — nie każdy użytkownik potrzebuje obu).

**Status.** Nie jest to reguła obowiązkowa — dotyczy wyłącznie klastrów appek rodziny, gdzie jedna appka realnie korzysta z danych wygenerowanych w drugiej (np. dane budynku z appki konstrukcyjnej potrzebne appce instalacji elektrycznej tego samego budynku). Większość projektów rodziny nie ma takiej pary i nie potrzebuje tego wzorca.

**Decyzja podstawowa: plik, nie żywe połączenie baz.** Transfer między dwiema niezależnymi appkami idzie przez **eksport do pliku wg wersjonowanego schematu** w appce źródłowej i **import tego pliku** w appce docelowej — nigdy przez bezpośrednie zapytanie appki B do bazy appki A. Konsekwencja: appki mogą (i domyślnie powinny) mieć **osobne bazy/projekty backendu**, bez żadnej zależności infrastrukturalnej między nimi — brak wspólnego `auth.uid()`, brak mostka API, brak współdzielonych limitów hostingu. Rozstrzyga to wprost pytanie "wspólny projekt Supabase dla powiązanych appek czy osobne" na korzyść **osobnych**, gdy jedyną realną potrzebą integracji jest jednorazowy transfer danych (nie wspólna subskrypcja/bundle — patrz niżej) — mniej ruchomych części, mniej okazji do rozjazdu.

**Reguła 1 — schemat eksportu ma własną wersję, niezależną od schematu bazy (02).** Plik niesie pole `schemaVersion` (albo równoważne). Appka docelowa sprawdza tę wersję przy imporcie i jawnie odmawia/ostrzega przy niezgodności — nigdy nie zgaduje kształtu starszego/nowszego pliku. Bez tego: refaktoring wewnętrznego schematu appki źródłowej (nawet niezwiązany z eksportem) może po cichu zepsuć import w appce docelowej. Ten sam mechanizm anty-dryfu co przy `schema_version` rekordu projektu (02), zastosowany do granicy międzyappkowej zamiast wewnątrzprojektowej.

**Reguła 2 — plik niesie wyłącznie Seed, nigdy Wynik.** Rozszerzenie 5.1/18.9 na transfer międzyappkowy: eksportowane są surowe fakty (wymiary, geometria, parametry wejściowe), nigdy wartości już policzone przez silnik appki źródłowej. Appka docelowa liczy własnym Kernelem od zera na podstawie zaimportowanych faktów — nigdy nie ufa cudzemu wynikowi jako gotowej wartości. Bez tego rozróżnienia błąd/nieaktualność w jednym kalkulatorze cicho zaraża drugi, niezależny produkt.

**Reguła 3 — import jest jednorazową kopią, nie sync.** Po imporcie oba projekty (źródłowy i docelowy) żyją niezależnie — zmiana w appce źródłowej **nie** propaguje się automatycznie do już zaimportowanej kopii. UI importu komunikuje to jawnie w momencie transferu (np. "zaimportowano stan na dziś — dalsza edycja w obu appkach jest niezależna"), żeby użytkownik nie oczekiwał cichej, ciągłej synchronizacji, której ten wzorzec świadomie nie zapewnia.

**Wyjątek od reguły 2 — migawka wyników jako jawny, czasowy etap pośredni.** [16.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro i inzynier-szkieletowy-pro (U.4, wpis z 10.10.2026), decyzja właściciela repo (wariant B). Gdy appka źródłowa ma trudny silnik (np. mostki cieplne wg ISO 6946), którego pełne skopiowanie do appki docelowej byłoby nieproporcjonalne, a appka docelowa potrzebuje z niego tylko kilku wartości zbiorczych (np. sumy strat w W/K, powierzchnia, kubatura), dopuszcza się transfer **migawki wyników** zamiast Seedu — wyłącznie pod wszystkimi poniższymi warunkami:
1. **Jawne oznaczenie rodzaju.** Plik niesie `rodzajDanych: "migawka-wynikow"` (albo równoważne); domyślnie rodzajem jest dane wejściowe (Seed). Appka docelowa nie traktuje migawki jak Seedu i odmawia importu, jeśli rodzaj nie jest jej znany.
2. **Pochodzenie i wiek.** Plik niesie datę eksportu i wersję appki źródłowej (3.8). Appka docelowa pokazuje przy zaimportowanych wartościach „stan na <data>” i prosi o ponowny import po zmianie projektu źródłowego.
3. **Status dziedziczony.** Migawka niesie status wyniku ze źródła (3.3), a appka docelowa **dziedziczy najsłabszy status** (3.7 pkt 2): wynik oparty na migawce o statusie `ESTIMATE` albo `INCOMPLETE` nie jest w appce docelowej prezentowany jako `VALID`.
4. **Oznaczenie „cudze, nieliczone tu”.** Wartości z migawki są w UI i w raporcie oznaczone jako pochodzące z innej appki, nie z Kernela appki docelowej (tak jak `ESTIMATE` w 8.13).
5. **Brak synchronizacji zwrotnej** (reguła 3 bez zmian).
6. **Wyjątek jest czasowy.** To etap pośredni, nie stan docelowy: zastępowany transferem Seedu (reguła 2), gdy silnik źródłowy zostanie zweryfikowany i przekazany do wspólnego użytku albo gdy appka docelowa dostanie własną implementację. Projekt korzystający z wyjątku zapisuje w rejestrze decyzji, **co wygasza wyjątek** i kiedy planowane jest przejście na Seed.
Bez któregokolwiek z warunków 1–4 migawka wraca do zakazu reguły 2.

**Kierunek: pośrednik jako drugi transport (decyzja właściciela repo, 18.10.2026, wariant D) — 🔎 jeszcze nie zaprojektowany.** Pierwszym transportem jest plik (18.16). Planowanym drugim jest **pośrednik (serwer) przekazujący zaszyfrowaną kopertę między aplikacjami tego samego użytkownika**, bez wybierania i wgrywania pliku. Ustalone: (1) **zakres to wyłącznie transfer między własnymi kontami jednego użytkownika** (nadawca = odbiorca); udostępnianie danych innym osobom jest poza zakresem i wymagałoby osobnej decyzji (inny model zagrożeń); (2) **koperta i schemat (18.16, `docs/schematy-transferu/`) są niezależne od transportu** — pośrednik przenosi ten sam obiekt, więc praca nad schematami się nie marnuje; (3) **walidacja schematem po stronie odbiorcy zostaje obowiązkowa także przy pośredniku** (dane z serwera też mogą być złośliwe), tak samo zgoda użytkownika z podglądem (7.5). Jako punkt wyjścia projektu wskazano **parowanie kont jednorazowym kodem** zamiast globalnej unikalnej nazwy użytkownika (mniejsza powierzchnia ataku: brak rejestru nazw, brak zgadywania nazw, brak spamu na cudzą nazwę); ostateczny wybór między parowaniem a globalną nazwą zapada przy projektowaniu. **Do zaprojektowania przed wdrożeniem (osobny rozdział standardu):** rodzaj szyfrowania (end-to-end wymaga wspólnego klucza użytkownika w obu aplikacjach i grozi utratą danych po zgubieniu urządzenia; szyfrowanie w tranzycie i w spoczynku z serwerem jako zaufaną stroną jest prostsze, ale serwer widzi dane), zarządzanie kluczami, retencja i usuwanie danych z pośrednika (RODO), bramka premium (rozdz. 12: sync i chmura tylko w premium), stos pośrednika (dziś osobne backendy, brak wspólnego konta), ochrona przed podszywaniem się i przejęciem konta. Do czasu zbudowania pośrednika transfer idzie plikiem wg 18.16.

[18.10.2026] ✅ ROZSTRZYGNIĘTO — decyzja właściciela repo: **parowanie kont** (jednorazowym kodem), nie globalna unikalna nazwa użytkownika. Pośrednik nie ma rejestru nazw ani wyszukiwania użytkowników; para kont jednego użytkownika jest powiązana przez parowanie, a nie przez nazwę. Pozostałe punkty z listy „do zaprojektowania” (szyfrowanie, klucze, retencja, premium, stos, ochrona przed podszywaniem się i przejęciem konta) rozstrzygnięto 18.10.2026 i opisano w [rozdziale 20](20-wymiana-miedzy-appkami.md) (E2 — szyfrowanie end-to-end, P2 — FREE jeden transfer / premium bez limitu, S1 — wspólny łącznik).

**Granica — czego to nie rozwiązuje.** Ten wzorzec nie jest substytutem współdzielonej subskrypcji/bundla między appkami (to osobna decyzja biznesowa, zależna m.in. od ograniczeń platform — natywne bundle App Store nie obsługują appek z subskrypcją) ani wspólnej tożsamości/logowania. Jeśli projekt rodziny osobno potrzebuje jednego z tych dwóch — to nie jest ten sam problem i nie jest rozwiązywane tym samym mechanizmem.

## 18.16. Koperta pliku transferu między appkami rodziny

[16.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpis „PROPOZYCJA: jednolita koperta pliku do importu i eksportu” z 10.10.2026), decyzja właściciela repo (wariant A). Uzupełnia 18.15 (transfer idzie plikiem z wersjonowanym schematem), który nie mówił, jak plik wygląda — dwie appki ustalałyby format od zera. Wzorzec opcjonalny jak 18.15: dotyczy wyłącznie klastrów appek, gdzie jedna realnie korzysta z danych drugiej.

**1. Nagłówek.** Plik niesie: `schemat` (stały identyfikator rodzaju danych, np. `budynek-sumy-strat`); `wersjaSchematu` (liczba całkowita, reguła 1 z 18.15); `rodzajDanych` (`dane-wejsciowe` albo `migawka-wynikow` — wyjątek opisany w 18.15); `zrodlo` (`aplikacja`, `wersjaAplikacji` — 3.8); `wyeksportowano` (ISO 8601 ze strefą); `projekt` (`id`, `nazwa`); `wersjaPaczkiSrodowiskowej` (wersja paczki `dane-srodowiskowe`, z której liczono — pozwala ostrzec o różnicy po stronie importu, 19.4); `sumaKontrolna` (SHA-256 z kanonicznego zapisu JSON pola `dane`). Suma kontrolna wykrywa **przypadkowe uszkodzenie** pliku, nie manipulację — nie zawiera sekretu, więc nie jest podpisem; import nigdy nie traktuje jej jako dowodu wiarygodności źródła.

**2. Ładunek.** Pole `dane` zawiera wyłącznie liczby, identyfikatory i kody — **bez tekstów dla człowieka** (tłumaczy je appka docelowa, 17.2). Jednostka jest w nazwie klucza (`htrWK`, `afM2`, `grubosc_mm`). `null` = nie wpisano, `0` = zero (3.7 pkt 1). Liczby są liczbami, nie napisami.

**3. Rodzaj danych.** Domyślnie plik niesie dane wejściowe (Seed, 18.15 reguła 2). Migawka wyników jest dopuszczona wyłącznie jako wyjątek na warunkach z 18.15; koperta tylko oznacza ją polem `rodzajDanych`.

**4. Wersjonowanie przy imporcie.** Appka docelowa **odmawia importu** przy `wersjaSchematu` wyższej niż zna, z czytelnym komunikatem; **migruje w przód** starsze wersje; **ignoruje nieznane pola**, a brakujące wymagane **odrzuca**. Walidacja schematem (np. Zod / JSON Schema) jest obowiązkowa przed jakimkolwiek użyciem zawartości.

**5. Bezpieczeństwo i prywatność importu.** Limit rozmiaru pliku sprawdzany przed odczytem; plik nie zawiera danych osobowych ani sekretów poza tym, co użytkownik sam wpisał w projekcie; import wymaga **jawnego dialogu zgody z podglądem** zawartości (7.5: nic nie trafia do projektu bez wiedzy użytkownika). *Przykład:* wspólne rozszerzenie pliku dla klastra (w marce „Inżynier Pro” `.inzpro.json`) — wybór lokalny klastra, nie wymóg rodziny.

**6. Dane środowiskowe.** Plik transferu **nie niesie danych pogodowych ani stref** — wyłącznie współrzędne i `wersjaPaczkiSrodowiskowej`; dane pogodowe zawsze pochodzą z paczki `dane-srodowiskowe` (19.13).

[18.10.2026] ✅ DODANO — rejestr schematów założony na polecenie właściciela repo: folder [`docs/schematy-transferu/`](../schematy-transferu/) trzyma jeden plik schematu na rodzaj pliku (`<schemat>.v<N>.schema.json`), wspólny przykład z poprawną sumą kontrolną oraz instrukcję dla eksportera i importera wraz z opisem testu kontraktowego po obu stronach. Własność schematu ma appka eksportująca. Pierwszy schemat: `budynek-sumy-strat` (wersja 1, robocza 🔎 — migawka wyników szkieletowy→offgrid, wyjątek z 18.15).

