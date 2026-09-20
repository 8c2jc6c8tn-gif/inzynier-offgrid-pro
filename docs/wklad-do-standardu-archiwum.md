# docs/wklad-do-standardu-archiwum.md — Inżynier Offgrid Pro

Archiwum wpisów `docs/wklad-do-standardu.md` w pełni zamkniętych (status `✅ skonsolidowane`/`✅ przekazane do new-app-standards`, bez żadnej otwartej dalszej akcji), przeniesionych stąd zgodnie z nową regułą **GOD BOOK Y.8** (`AKTUALIZACJE.md` new-app-standards, wiersz 84, 20.09.2026) — `docs/wklad-do-standardu.md` jest append-only i rośnie bez końca, ta reguła utrzymuje go czytelnym, przenosząc w pełni skonsolidowaną treść tutaj zamiast usuwając ją.

**Ten plik też jest append-only** — nie usuwamy stąd wpisów. Kolejne archiwizacje dopisują się na końcu.

---

## Wpisy przeniesione 20.09.2026 (pierwsza archiwizacja, przy okazji sync-u GOD BOOK v2.19→v2.20)

[14.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — rozdział 09 (AI w produkcie) ma zasady, ale brak
konkretnego kontraktu narzędzia, wzorca UX i budżetu/kosztu

Szczegóły: `docs/standards/09-ai-w-produkcie.md` opisuje dobre, spójne zasady etyczne/architektoniczne
(co AI może/nie może, tryby OFFLINE/HYBRID/CLOUD_ASSISTED, obrona przed prompt injection), ale w
przeciwieństwie do rozdziału 03 (konkretny typ `CalcResult`) nie daje żadnego konkretnego kształtu
narzędzia (function calling), żadnego wzorca UX dla obecności AI w interfejsie (rozdział 08 ma pełną
taksonomię Wzorców A-H dla ekranów, zero dla AI), i nie porusza budżetu/kosztu wywołań modelu mimo
istniejącej warstwy freemium (rozdział 12). Każdy projekt rodziny, który zacznie faktycznie budować
funkcję AI, wymyśli te trzy rzeczy od nowa, niespójnie z resztą rodziny.

Pełna propozycja (wersja z pełnym uzasadnieniem/kontekstem zostaje dodatkowo, nieusunięta, w
`docs/propozycje-do-new-app-standards/ai-w-produkcie-rozbudowa.md` w tym repo):

**1. Konkretny kontrakt narzędzia (uzupełnienie 9.3)** — ten sam duch co `CalcResult` z rozdziału 03,
jeden nazwany typ, żeby narzędzia były wzajemnie kompatybilne między projektami rodziny:

```ts
type AiToolDefinition<TInput, TOutput> = {
  name: string                       // np. "run_calculator.dobor_przekroju_kabla"
  description: string                // po ludzku, do czego służy — model to czyta
  inputSchema: ZodSchema<TInput>     // Zod, zgodnie z rozdziałem 02 (dane nie kod)
  outputSchema: ZodSchema<TOutput>   // typowo = CalcResult<T> albo jego podzbiór
  operationType: "read" | "write"
  requiresConfirmation: boolean      // obowiązkowe true dla "write" (9.3)
  scope: string[]                    // np. ["project:current"], nigdy "*"
  handler: (input: TInput) => Promise<TOutput>
}
```

Reguła: `handler` dla narzędzi typu "wywołaj kalkulator" zawsze deleguje do już istniejącej,
niezależnie przetestowanej funkcji domenowej (rozdział 03) — nigdy nie zawiera logiki obliczeniowej
samodzielnie. To czyni regułę 9.1 ("obliczenia nigdy nie zależą od AI") sprawdzalną maszynowo, nie
tylko deklaratywną.

**2. Budżet i koszt** — rozdział 9.6 opisuje tryby OFFLINE/HYBRID/CLOUD_ASSISTED wg dostępności
sieci, nie wg kosztu. Każde wywołanie modelu w trybie CLOUD_ASSISTED ma koszt per token — potrzebny
jawny budżet per użytkownik/projekt (limit miesięczny w warstwie freemium), egzekwowany server-side.
Degradacja przy wyczerpanym budżecie musi być łagodna i jawna (echo zasady z rozdziału 06): AI
przechodzi do trybu HYBRID/OFFLINE i mówi o tym wprost ("Wyczerpano miesięczny limit asystenta AI —
nadal możesz korzystać ze wszystkich kalkulatorów ręcznie"), nigdy nie ukrywa degradacji.

**3. Wzorce UX dla AI w produkcie (uzupełnienie rozdziału 08)** — dwa nazwane, rozróżnialne tryby
(decyzja per projekt, który wdrożyć):
- **Asystent wbudowany w ekran (inline)** — AI sugeruje wypełnienie konkretnych pól na już
  istniejącym ekranie Wzorca D, nigdy nie zastępuje samego ekranu; widoczne jako odznaczalna sugestia
  przy polu ("AI proponuje: 25% — użyj/odrzuć"), zgodnie z 9.2.
- **Czat/asystent rozmowny (osobny panel)** — dla pytań nieprzypisanych do jednego ekranu; zawsze
  kończy odpowiedź dotyczącą wyniku liczbowego linkiem do właściwego ekranu Doradcy, nie samą liczbą
  wygenerowaną przez model.
- W obu przypadkach: każda sugestia AI pokazuje źródło (`traceId`/`calculatorVersion`, rozdz. 03) —
  użytkownik zawsze może zweryfikować, skąd wzięła się liczba.

**4. Miejsce w procesie wersjonowania Biblii (uzupełnienie rozdziału 14)** — każda decyzja projektowa
zaakceptowana przez użytkownika na podstawie sugestii AI w produkcie zapisuje się w stanie projektu z
polem `zaproponowaneBy: "ai"` obok zwykłych zapisów — czysto informacyjne, nie zmienia procesu
zatwierdzania (wciąż wymaga zgody użytkownika, 9.2), pozwala odróżnić "user wpisał sam" od "user
zaakceptował sugestię AI" przy audycie/debugowaniu.

**5. Otwarte pytania dla sesji `new-app-standards`:** czy `AiToolDefinition` (punkt 1) żyje w
`03-jadro-obliczeniowe.md` (obok `CalcResult`) czy w `09-ai-w-produkcie.md`; czy budżet/koszt (punkt
2) to osobna sekcja w 09 czy dopisek do 12 (freemium) z odnośnikiem zwrotnym; ten dokument celowo nie
rozstrzyga "jakiego dostawcy modelu/architektury hostingu użyć" — decyzja produktowa per projekt.

Dlaczego warto zgłosić do new-app-standards: AI-w-produkcie to nie specyfika Offgrid — każda apka
rodziny prędzej czy później dostanie funkcję asystenta, a bez wspólnego kontraktu narzędzia i
wzorca UX każdy projekt zbuduje niekompatybilną, jednorazową implementację, tak jak dziś dzieje się
z i18n i logowaniem (patrz dwa zgłoszenia niżej).

Status: ✅ skonsolidowane (15.09.2026, `docs/standards/09-ai-w-produkcie.md` 9.3/9.6/9.9/9.10 —
kontrakt `AiToolDefinition`, budżet/koszt, dwa wzorce UX inline/czat, pole `zaproponowaneBy`;
zweryfikowane 20.09.2026 przy okazji kolejnej aktualizacji — wszystkie cztery punkty propozycji
faktycznie obecne w źródle, nie tylko zadeklarowane). Wpis wcześniej nieoznaczony mimo konsolidacji
tego samego dnia następnego sync-u — poprawione teraz, zgodnie z zasadą "zweryfikowane
programistycznie, nie z metryczki".

---

---

[14.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak w standardzie/GOD BOOK jakiegokolwiek rozdziału o
logowaniu i kontach użytkownika

Szczegóły: Sprawdzone wprost (nie zgadywane) — zero trafień na "logowanie"/"konto użytkownika"/
"uwierzytelnianie"/"autoryzacja" w całym pakiecie `docs/standards/00`-`16` i w GOD BOOK. To nie jest
luka tylko tego projektu (ten też nie ma żadnego kodu auth) — to luka na poziomie samego pakietu.
Właściciel projektu wskazał apkę `zero-waste` (siostrzany projekt rodziny) jako wzorzec, na którym
mają bazować rekomendacje — ta sesja nie miała dostępu do tamtego repo, więc zgłoszenie jest
świadomie niedokończone (szkielet + pytania, nie gotowa specyfikacja).

Co już ustalone bez zero-waste — echo istniejących zasad standardu (wersja z pełnym uzasadnieniem
zostaje dodatkowo, nieusunięta, w `docs/propozycje-do-new-app-standards/logowanie-i-konta.md` w tym
repo, oznaczona tam jako **celowo niedokończona**, bo miała bazować na kodzie `zero-waste`, do
którego ta sesja nie miała dostępu):
1. Offline-first (rozdział 05) musi przetrwać brak konta — logowanie nie może być bramką blokującą
   dostęp do rdzenia aplikacji, najwyżej do funkcji wymagających synchronizacji/chmury. Konto =
   opcjonalne rozszerzenie, nie warunek wejścia.
2. Prywatność lokalna-domyślna (rozdział 07) — logowanie/konto to dokładnie moment zgody na chmurę,
   nowy rozdział powinien się do 07 odwoływać, nie duplikować.
3. Egzekwowanie freemium wyłącznie server-side (rozdział 12) — jeśli konto odblokowuje płatne
   funkcje, sprawdzanie uprawnień nigdy nie może żyć tylko w kliencie.
4. `StorageAdapter` (rozdział 05) — naturalne miejsce na dane sesji/tokenu, nie nowy równoległy
   mechanizm przechowywania.
5. Droga web→mobile (rozdział 13) — mechanizm auth powinien żyć za tym samym punktem wymiany
   (adapters), nie być wpleciony bezpośrednio w kod web.

Pytania wciąż czekające na odpowiedź z realnego kodu zero-waste (nierozstrzygnięte, nie zgadywane):
dostawca/mechanizm auth (własna implementacja vs Supabase/Clerk/NextAuth/Firebase); model konta
(jedno konto per apka, czy jedno konto rodziny na wszystkie apki); co dokładnie wymaga logowania
(cała apka, czy tylko synchronizacja/chmura/płatności zgodnie z punktem 1); spięcie offline↔online
(scenariusz "user pracował offline bez konta, potem się zalogował" — merge, nadpisanie, ręczny
wybór — dotyka rozdziału 05, Seed vs Wynik); role/uprawnienia (poza pojedynczym typem użytkownika,
np. instalator + klient); zakres bezpieczeństwa faktycznie wdrożony (reset hasła/weryfikacja
email/2FA, do rozdziału 07).

Dlaczego warto zgłosić do new-app-standards: logowanie to jeden z tych tematów, które "zawsze są
zakładane, nigdy nie są nigdzie zapisane" — dokładnie to odkryła ta sesja, sprawdzając wprost zamiast
zakładać. Dotyczy każdej apki rodziny, która kiedykolwiek doda konta użytkownika.

Status: ✅ skonsolidowane (15.09.2026, `docs/standards/18-logowanie.md` — pełny nowy rozdział 18
powstał, nie tylko szkielet; ten projekt zbudował własną implementację Supabase Auth na jego
podstawie, patrz zadanie "Rozdz. 18: audyt i zamknięcie realnych luk"). Zweryfikowane 20.09.2026.


---

[16.09.2026] KATEGORIA: BŁĄD — 18.4 (Supabase Auth jako wymóg) i 18.5 (token sesji wyłącznie w
`HttpOnly` cookie) kolidują w praktyce dla "oczywistego" sposobu użycia biblioteki

Szczegóły: Przy porządkowaniu szkieletu logowania (bez realnych kluczy, patrz `docs/memory.md`)
sprawdzone wprost w `node_modules/@supabase/ssr` (nie zgadywane): `DEFAULT_COOKIE_OPTIONS`
biblioteki to `{ path: "/", sameSite: "lax", httpOnly: **false** }`. Powód: `createBrowserClient()`
(klient dla komponentów klienckich, dokumentowany jako standardowy sposób odczytu stanu logowania
po stronie przeglądarki) musi umieć zapisać/odświeżyć tę samą cookie z poziomu JS — a `HttpOnly`
jest z definicji niemożliwy do ustawienia przez JS w przeglądarce (ograniczenie platformy, nie
wybór biblioteki). Skutek: każdy projekt, który podąży za "oczywistym" wzorcem (Server Component
loguje przez `createServerClient`, komponent kliencki czyta status logowania przez
`createBrowserClient().auth.getUser()` — dokładnie to, co ten projekt miał do 16.09.2026,
`components/konto-sekcja.tsx`) **cicho łamie 18.5** przy pierwszym odświeżeniu tokenu przez klienta
przeglądarkowego, mimo poprawnie ustawionych opcji po stronie serwera — sama obecność
`createBrowserClient` gdziekolwiek w kodzie wystarczy, żeby zepsuć całą resztę.

Naprawione w tym projekcie: `createBrowserClient`/`lib/adapters/supabase/client.ts` usunięte
całkowicie (jedyne użycie zastąpione Server Actionem, `lib/adapters/supabase/get-account-status.ts`
— stan logowania czytany server-side, nigdy przez klienta Supabase w przeglądarce). Dopiero bez
żadnego `createBrowserClient` w kodzie jawne `cookieOptions: { httpOnly: true, secure: ..., sameSite:
"lax" }` przekazane do `createServerClient` (sprawdzone w `node_modules`: biblioteka poprawnie
nadpisuje `DEFAULT_COOKIE_OPTIONS` przekazanymi opcjami) faktycznie działa zgodnie z 18.5, bez
ryzyka cichego nadpisania przez inny fragment kodu.

Dlaczego warto zgłosić do new-app-standards: 18.4 nakazuje Supabase Auth "spójnie z 6.5", 18.5
nakazuje czyste `HttpOnly` — żaden z dwóch punktów nie ostrzega, że najbardziej oczywisty,
udokumentowany wzorzec użycia narzędzia z 18.4 (klient przeglądarkowy do odczytu stanu logowania)
łamie 18.5 po cichu. Każdy kolejny projekt rodziny, który zacznie od klienta przeglądarkowego (bo
to jest to, co pokazuje oficjalna dokumentacja Supabase), odkryje to dopiero przy audycie
bezpieczeństwa, nie przy pisaniu kodu. Warta dopisania jako jawna, nazwana pułapka w 18.5 (albo
nowy podpunkt): "nigdy nie używaj `createBrowserClient`/klienta Supabase w przeglądarce do odczytu
stanu sesji — stan logowania czytany wyłącznie server-side (Server Component/Server Action), nawet
kosztem dodatkowego round-tripu do serwera przy każdym odczycie w komponencie klienckim".

Status: ✅ skonsolidowane (16.09.2026, `AKTUALIZACJE.md` wiersz 67 — nowa 18.5, "pułapka nazwana
wprost": `createBrowserClient()` ma domyślnie `httpOnly:false`, stan logowania czytany wyłącznie
server-side). Dokładnie ta pułapka, dokładnie to rozwiązanie.


---

[16.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — 18.5 wymaga "tokenu CSRF" na każdym endpoincie
zmieniającym stan, ale nie rozstrzyga, czy wbudowana ochrona Next.js Server Actions to spełnia

Szczegóły: 18.5 (dopisek 15.09.2026) mówi wprost: "Token CSRF (synchronizer token albo
double-submit cookie) na każdym endpoincie zmieniającym stan, niezależnie od `SameSite` — obrona w
głąb, nie zamiennik." Ten projekt miał `/auth/signout` jako zwykły Route Handler (`POST`) bez
żadnego tokenu — zamieniony na Server Action (`app/auth/signout/actions.ts`), bo Next.js
weryfikuje nagłówek Origin/Host przy każdym wywołaniu Server Action (mechanizm wbudowany w
framework, nie kod tego projektu). To realna, sprawdzalna ochrona — ale **nie jest to dosłownie
"synchronizer token" ani "double-submit cookie"**, tylko porównanie nagłówków żądania. Nie znaleziono
w tej sesji jednoznacznej odpowiedzi (bez zgadywania), czy sprawdzenie Origin/Host przez framework
ma być traktowane jako spełniające literę 18.5, czy 18.5 wymaga dodatkowo prawdziwego tokenu nawet
na Server Actions. Świadomie NIE rozstrzygnięte samodzielnie w tym projekcie — Server Actions
zamiast Route Handlerów to i tak poprawa względem stanu wyjściowego (zero ochrony → ochrona
frameworkowa), niezależnie od odpowiedzi na to pytanie.

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny na Next.js App Router używający
Server Actions do logowania/wylogowania (ten wzorzec już jest w 18.2/18.5 przykładach) natrafi na
to samo pytanie. Jednoznaczne rozstrzygnięcie w rozdziale 18 (czy ochrona Origin/Host Next.js
Server Actions wystarcza, czy zawsze wymagany jest dodatkowy token) oszczędzi każdej kolejnej
sesji tę samą niepewność.

Status: ✅ skonsolidowane (16.09.2026, `AKTUALIZACJE.md` wiersz 67 — rozstrzygnięcie: ochrona
Origin/Host wbudowana we frameworku dla prawdziwych Server Actions spełnia wymóg "tokenu CSRF" z
18.5; zwykłe Route Handlery nadal wymagają jawnego tokenu). Dokładnie to pytanie, dokładnie ta
odpowiedź.


---

[16.09.2026] KATEGORIA: BŁĄD — 7.3 (hash CSP dla inline `<script>`) jest architektonicznie
niekompatybilny z Next.js App Router: produkcyjna CSP psuje hydrację Reacta na KAŻDEJ stronie

Szczegóły: Przy pracy nad 5.3 (PWA offline-first, ten sam dzień) — pierwsza w tej sesji realna
weryfikacja produkcyjnej CSP w prawdziwej przeglądarce (`pnpm build && pnpm start` + Playwright,
nie `pnpm dev`, gdzie CSP jest celowo złagodzona o `unsafe-inline`/`unsafe-eval` dla HMR) —
odkryto, że **hydracja Reacta psuje się na każdym ekranie aplikacji**, zawsze, w każdej produkcji:
`Uncaught (in promise) Minified React error #412` w konsoli, poprzedzony seriami `Refused to
execute inline script because it violates the following Content Security Policy directive`, za
każdym razem z INNYM wymaganym hashem SHA-256.

Przyczyna źródłowa: `script-src` tej CSP (wzorzec z rozdz. 7.3 tego standardu, wpis 16.09.2026,
wiersz 70 — "hash liczony automatycznie, nigdy ręcznie") dopuszcza inline-skrypty wyłącznie przez
jawnie wymieniony, stały hash — poprawne i wystarczające dla JEDNEGO, statycznego, znanego z góry
skryptu (np. `WYGLAD_INIT_SCRIPT` tego projektu, ustawiający motyw przed pierwszym malowaniem).
Next.js App Router (13+, w tym wersja tego projektu — 16) generuje jednak WŁASNE, dodatkowe
inline `<script>` do przesłania payloadu RSC streaming (`self.__next_f.push([...])`) — jeden lub
więcej PER ŻĄDANIE, z treścią zależną od danych renderowanej strony. Taka treść z definicji nie
może mieć stałego hasha z góry — każde żądanie generuje inny hash, więc żaden statyczny wpis w
`script-src` nigdy go nie obejmie. Rezultat: CSP oparta wyłącznie o statyczne hashe blokuje
hydrację na KAŻDEJ stronie z jakąkolwiek dynamiczną treścią (czyli praktycznie każdej), nie tylko
teoretycznie — potwierdzone jako **obecny, aktywny stan produkcji** tego projektu, nie ryzyko.

Zweryfikowane jako niezwiązane z konkretną zmianą tej sesji (PWA) — identyczny błąd reprodukuje
się na czystym `main` sprzed PWA (commit `b5fb177`), sprawdzone w izolowanym `git worktree`.
Najpewniej niewykryte wcześniej, bo cała dotychczasowa weryfikacja w przeglądarce w tej sesji szła
przez `pnpm dev` (złagodzona CSP) — nigdy przez `pnpm start` z prawdziwą produkcyjną CSP w
rzeczywistej przeglądarce, dopóki nie zaszła potrzeba realnie sprawdzić rejestrację service
workera.

Rozwiązanie standardowe dla tej klasy problemu (nieprzetestowane jeszcze w praktyce w żadnym
projekcie rodziny, ale to udokumentowany, oficjalny wzorzec Next.js): **CSP oparta o nonce
generowany per żądanie w middleware**, nie o stałe hashe. Middleware generuje losowy nonce
(`crypto.randomUUID()`/`crypto.randomBytes`), dokłada go do nagłówka CSP (`script-src 'self'
'nonce-{wartość}'`) ustawianego DYNAMICZNIE w middleware (nie w statycznej funkcji `headers()`
w `next.config.mjs`, bo ta nie ma dostępu do per-request nonce'u), i przekazuje ten sam nonce do
`<html>` przez nagłówek `x-nonce` odczytywany w Server Component roota — Next.js automatycznie
dokłada ten nonce do WSZYSTKICH generowanych przez siebie inline-skryptów (w tym RSC streaming),
jeśli wykryje go w nagłówku odpowiedzi zgodnie z własnym mechanizmem. To eliminuje potrzebę
ręcznego wyliczania hasha dla własnych inline-skryptów (jak `WYGLAD_INIT_SCRIPT`) — te też dostają
ten sam nonce zamiast osobnego hasha.

Dlaczego warto zgłosić do new-app-standards: **7.3 dziś opisuje wyłącznie wzorzec hash-based CSP**
(ostatnio wzmocniony wiersza 70 AKTUALIZACJE.md o automatyczne liczenie hasha) — ten wzorzec
działa poprawnie tylko dla stron w pełni statycznych, bez żadnego dynamicznego contentu
renderowanego przez RSC/Suspense. Każdy przyszły i obecny projekt rodziny na Next.js App Router
(dziś: ten projekt, potencjalnie inzynier-szkieletowy-pro), który wdroży hash-based CSP dosłownie
wg dzisiejszego brzmienia 7.3, odziedziczy dokładnie ten sam błąd — całkowicie zepsutą hydrację w
produkcji, cichą (bez błędu widocznego zwykłemu userowi, tylko w konsoli deweloperskiej), i bardzo
łatwą do przeoczyć, bo `pnpm dev`/testy lokalne z reguły nie używają identycznej, ścisłej CSP co
produkcja. Rekomendacja: 7.3 powinna jawnie rozróżnić dwa reżimy — (a) hash-based, tylko dla
projektów BEZ App Routera Next.js albo ze stronami w pełni statycznymi (`output: "export"`), (b)
nonce-per-request jako WYMAGANY wzorzec dla każdego projektu Next.js App Router z jakąkolwiek
stroną renderowaną dynamicznie (czyli w praktyce: prawie zawsze) — z konkretnym przykładem
middleware + odczytu nonce'u w root layout, analogicznym do już istniejących przykładów w
`docs/przyklady/`.

Świadomie NIE naprawione w tym projekcie na razie — właściciel repo zdecydował poczekać na
rozstrzygnięcie przez tę konsolidację, zamiast budować naprawę lokalnie przed nią. Bieżący,
częściowy obejście w tym projekcie: rejestracja service workera (5.3/PWA) zaprojektowana tak, by
NIE zależeć od hydracji Reacta (zewnętrzny plik `public/register-sw.js` przez zwykły `<script
src>`, nie komponent kliencki) — działa mimo błędu, ale to obejście jednego symptomu, nie
naprawa przyczyny; reszta interaktywności aplikacji zależnej od hydracji pozostaje dotknięta.

Status: ✅ skonsolidowane i naprawione (20.09.2026). `docs/standards/07-bezpieczenstwo.md` 7.3 ma
teraz oba reżimy CSP jawnie rozróżnione (hash-based tylko dla projektów bez App Routera/w pełni
statycznych; nonce-per-request wymagany dla Next.js App Router z dowolną stroną dynamiczną).
**Ten projekt też naprawiony** — zweryfikowane wprost w `middleware.ts`: nonce generowany per
żądanie (`crypto.randomUUID()`), przekazywany przez nagłówek `x-nonce` do Server Componentów i
przez `Content-Security-Policy` do przeglądarki, `app/layout.tsx` odczytuje go i wstawia do
`WYGLAD_INIT_SCRIPT`. Obejście serwis-workera opisane wyżej nie jest już potrzebne jako jedyna
ochrona — pozostaje jako dodatkowa odporność, nie jako jedyny mechanizm.


---

[20.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — "kompletny szablon sekcji" w audycie pokrycia funkcji ≠ "ma computable wzór"

Szczegóły: Wcześniejszy audyt (05.09.2026) oznaczył dwie funkcje (5.46 "ryzyko zamarznięcia
dolnego źródła", 5.31 "hałas i wibracje", oba Moduł 6) jako "gotowe do budowy — pełna treść
Doradcy z formułą", na podstawie tego, że źródło miało wypełniony pełny szablon sekcji A/B/C/D
(Wejście/Silnik/Wynik/Migawka). Przy faktycznej implementacji (20.09.2026) okazało się, że
źródło ma w Sekcji B (Silnik) tylko narrację słowną + jeden ilustracyjny przykład liczbowy —
BEZ wzoru wiążącego wejścia z wynikiem. Etykieta "kompletny szablon" w audycie źle przewidziała
budowalność — audyt sprawdzał obecność struktury (czy sekcje A/B/C/D są wypełnione tekstem),
nie obecność faktycznie odtwarzalnego wzoru wewnątrz Sekcji B. Skutek: dwie funkcje błędnie
zaklasyfikowane jako "todo, gotowe" zamiast "todo, wymaga Wzorca C (informacyjny, bez
kalkulatora)" — poprawione dopiero przy realizacji, nie przy audycie.

Dlaczego warto zgłosić do new-app-standards: to ogólny błąd metodologiczny audytu pokrycia
funkcji w KAŻDYM projekcie rodziny opartym o szablon Doradcy A/B/C/D — łatwo pomylić "sekcja
ma treść" z "sekcja ma wzór". Rekomendacja: standard (rozdział o Procesie/Audycie, albo
09-AI/03-jądro-obliczeniowe) powinien doprecyzować kryterium klasyfikacji "gotowe do budowy"
przy audycie pokrycia — wymagać jawnego potwierdzenia, że Sekcja B zawiera odtwarzalny wzór
matematyczny (nie tylko opis słowny + przykład), zanim funkcja dostanie status "gotowe do
budowy, pełna treść z formułą". Sam przykład liczbowy w źródle, bez ogólnego wzoru, powinien
z automatu klasyfikować funkcję jako kandydata do Wzorca C (informacyjny), nie D (kalkulator).

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/08-ui-ux.md` — doprecyzowanie 8.2: audyt
pokrycia musi potwierdzić odtwarzalny wzór w Sekcji B, nie tylko wypełnioną treść, zanim funkcja
dostanie status "gotowe do budowy, Wzorzec D"). Zweryfikowane wprost w treści rozdziału.

**Korekta numeracji (20.09.2026, przy archiwizacji):** ta reguła faktycznie żyje pod **8.4a**
(`AKTUALIZACJE.md` new-app-standards, wiersz 77), nie 8.2 — pomyłka w cytowaniu numeru sekcji w
oryginalnym wpisie status, treść merytoryczna poprawna i skonsolidowana.


---

[20.09.2026] KATEGORIA: BŁĄD — nowy wzorzec ustalony w połowie projektu nie był retroaktywnie stosowany do kolejnych nowych modułów

Szczegóły: Hook `usePersistedDraft` (autosave draftu formularza do IndexedDB) powstał
15.09.2026 dla jednego ekranu (`napiecie-systemowe`), po zgłoszeniu użytkownika o utracie
wpisanych danych. Od tego dnia to był lepszy, ustalony wzorzec dla KAŻDEGO nowego ekranu
formularza w tym repo. Mimo to w tej samej sesji, już PO 15.09, zbudowano kolejnych 8 nowych
modułów (`ryzyko-pid`, `dobor-regulatora-pwm-mppt`, `wind-chill`, `urzadzenia-zmienne`,
`sprawnosc-inwertera-niskie-obciazenie`, `architektura-fazowa`, `kategorie-specjalne`,
`systemy-podtrzymania-zycia`) zwykłym `useState`, bez autosave — bo AI kopiowało stary
szablon plikowy (z czasów sprzed hooka) z przyzwyczajenia, zamiast za każdym razem sprawdzić,
czy wzorzec, który powiela, jest wciąż aktualny. Błąd wykryty dopiero przy osobnym zadaniu
rolloutu (punkt 8 z listy zaległości), które i tak musiało objąć te "świeże" moduły razem ze
starymi — koszt: 8 modułów zbudowanych od razu źle, do poprawki później, zamiast raz dobrze.

Dlaczego warto zgłosić do new-app-standards: to nie specyfika tego projektu — to ogólny problem
procesowy przy pracy AI nad długim, wielosesyjnym projektem: gdy w trakcie projektu powstaje
nowy, lepszy wzorzec dla klasy plików (nie tylko autosave — dowolny: nowy hook, nowa konwencja
walidacji, nowy komponent bazowy), nic nie wymusza sprawdzenia "czy szablon, który zaraz
skopiuję, jest nadal aktualny" przy KAŻDYM kolejnym pliku tej klasy, nawet w tej samej sesji.
Rekomendacja dla standardu: gdy AI ustala nowy wzorzec dla całej klasy plików (nie
jednorazowa decyzja), powinno od razu dopisać jedno zdanie w `docs/memory.md` w formie
jawnej, przeszukiwalnej reguły ("od DD.MM: każdy nowy ekran typu X używa Y, nie starego Z") —
i AI powinno mieć nawyk, żeby przed kopiowaniem istniejącego pliku jako szablonu dla nowego,
sprawdzić `docs/memory.md` pod kątem takich reguł nowszych niż plik-źródło szablonu.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/15-wspolpraca-z-ai.md` 15.19 — nowy wzorzec
ustalony w trakcie sesji musi trafić do `docs/memory.md` od razu, sprawdzane przed kopiowaniem
szablonu). Zweryfikowane wprost w treści rozdziału.


---

[20.09.2026] KATEGORIA: DOBRA PRAKTYKA — kontrakt `AiToolDefinition` z 9.3 ma teraz działającą
implementację referencyjną (nie tylko typ na papierze), plus jedna reguła kolejności warta
dopisania obok niej

Szczegóły: Wpis z 14.09.2026 (wyżej w tym pliku) zgłosił brak konkretnego kształtu narzędzia AI —
skonsolidowany 15.09.2026 jako 9.3 (`docs/standards/09-ai-w-produkcie.md`). Od tego czasu w tym
projekcie powstała pierwsza realna, przetestowana implementacja tego kontraktu (nie szkic):
`lib/ai/types.ts` (typ + `validateAiToolDefinition()`), `lib/ai/tools/kalkulatory-pomocnicze-tool.ts`
(pierwsze narzędzie), `lib/ai/to-anthropic-tool.ts` (adapter), `lib/ai/pytaj-asystenta.ts` (pętla
agentowa). Dwa elementy tej implementacji są transferowalne i dziś nigdzie w standardzie nieopisane:

1. **Most JSON Schema jako punkt przenośności między dostawcami AI.** `z.toJSONSchema()` (Zod v4,
   natywne, bez dodatkowej biblioteki) generuje z `inputSchema` obiekt JSON Schema, który Anthropic
   przyjmuje wprost jako `Tool.input_schema` — ale to DOKŁADNIE ten sam artefakt, którego zażąda
   `function.parameters` OpenAI i `FunctionDeclaration.parameters` Gemini. Konsekwencja dla każdego
   projektu rodziny planującego BYOK (podłączenie własnego klucza usera do wybranego dostawcy —
   temat poruszony wprost przez właściciela tego projektu, jeszcze nie zbudowany): rejestr narzędzi
   (9.3) pisany raz, w jednym miejscu, nie wymaga przepisania per dostawca — tylko cienkiego
   adaptera per dostawca (~15-20 linii, sama zmiana koperty wokół tego samego JSON Schema), nie
   powielenia opisów. Wart dopisania jako konkretna wskazówka architektoniczna obok samego typu
   `AiToolDefinition` w 9.3 — dziś typ jest tam, ale nic nie mówi, że to, co w niego wpiszesz, jest
   już z natury gotowe pod wielu dostawców, jeśli tylko trzyma się na Zod/schemacie generującym
   standardowy JSON Schema.
2. **Kolejność pisania: opis narzędzia AI na końcu, nie na początku.** Przy planowaniu, jak
   efektywnie dobudować opisy AI do pozostałych kalkulatorów tego projektu (116 z 117 nie ma dziś
   żadnego), ustalona rekomendacja: kalkulator (input/calculator/validation/warnings + testy) →
   i18n (klucze tłumaczeń) → dopiero na końcu `AiToolDefinition`. Powód: dokładny opis narzędzia
   (pola `.describe()` w Zod, treść `description` narzędzia) wymaga znajomości OSTATECZNEGO,
   przetestowanego kształtu wejścia/wyjścia — pisanie go przed ustabilizowaniem kalkulatora ryzykuje,
   że opis skłamie o kształcie danych po pierwszej zmianie w trakcie testowania. To osobna,
   dodatkowa reguła obok już istniejącej 17.1a (i18n jako założenie architektoniczne od Etapu 1) —
   ta ostatnia mówi "buduj razem od początku", ta tutaj doprecyzowuje wewnętrzną kolejność KROKÓW
   w ramach tego samego, jednosesyjnego podejścia, żeby nie była to dowolna kolejność trzech
   rzeczy naraz.

Kod referencyjny (pierwsze narzędzie end-to-end, gotowe do skopiowania jako wzorzec): pliki
wymienione wyżej, `lib/ai/` w tym repo.

Dlaczego warto zgłosić do new-app-standards: AI w produkcie jest już dziś obowiązkowym elementem
każdej apki rodziny (9.0) — każdy kolejny projekt, który zacznie budować rejestr narzędzi, odkryje
te same dwie rzeczy (przenośność JSON Schema, kolejność pisania opisu) samodzielnie, chyba że
zostaną nazwane raz, tutaj. To dokładnie ten sam wzorzec zgłoszenia, co CI referencyjny/i18n guard
(wpis 16.09.2026 wyżej) — reguła bez przykładu kodu jest dużo łatwiejsza do błędnego wdrożenia niż
reguła z gotowym, zweryfikowanym wzorcem obok.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/09-ai-w-produkcie.md` — doprecyzowanie 9.3:
Zod/JSON Schema jako most przenośności między dostawcami AI, reguła kolejności "opis na końcu").
Zweryfikowane wprost w treści rozdziału.


---

[20.09.2026] KATEGORIA: DOBRA PRAKTYKA — weryfikacja zainstalowanej wersji SDK wprost w
`node_modules` (nie z pamięci treningowej modelu) przed wyborem konkretnego wzorca integracji,
z konkretnym, udokumentowanym przykładem decyzji

Szczegóły: Przy budowie `lib/ai/pytaj-asystenta.ts` (16.09.2026, PR #98 — pierwsza realna
integracja rozdziału 09) padła konkretna decyzja techniczna: "pętla agentowa ręczna (manual
agentic loop), nie beta Tool Runner SDK (`client.beta.messages.toolRunner`/`betaZodTool`)".
Powód nie był domysłem — sprawdzone wprost `find`/`grep` w `node_modules`, że zainstalowana
wersja `@anthropic-ai/sdk` (0.126.0) jeszcze nie ma tej bety. Zapisane w `docs/memory.md`
(wpis z 16.09.2026) z jawną notatką na przyszłość: "jeśli SDK zostanie zaktualizowane, warto
rozważyć migrację na Tool Runner — nie zrobione teraz świadomie, nie przeoczenie".

To zastosowanie reguły "Never guess SDK usage" ze skilla `claude-api` (bundlowany skill Claude
Code, nie część `new-app-standards`) — ale sam mechanizm, który tę regułę wymusił (sprawdzenie
`node_modules` PRZED napisaniem kodu, zamiast polegania na tym, co model "pamięta" z treningu
o danym SDK), jest ogólniejszy niż jeden konkretny skill i dotyczy **każdej** biblioteki
zewnętrznej w **każdym** projekcie rodziny, nie tylko integracji AI. SDK-i i biblioteki
zewnętrzne driftują między wersjami szybciej, niż aktualizuje się wiedza treningowa modelu —
to samo ryzyko dotyczy Next.js (patrz już istniejący blok w `CLAUDE.md`/`generate-agent-files.js`:
"This is NOT the Next.js you know"), Supabase, Zod, i każdej kolejnej biblioteki, którą projekt
rodziny kiedykolwiek zaktualizuje.

Rozdział 15 ma dziś **generyczną** wersję tej zasady (15.7, "nie wiem zamiast wymyślania" — nie
zgaduj brakujących DANYCH), ale nie ma jej **konkretnej odmiany dla kodu integrującego bibliotekę
zewnętrzną**: "nie zgaduj API/metod/kształtu wywołania biblioteki z pamięci treningowej — zweryfikuj
wprost w zainstalowanej wersji (`node_modules`/`vendor`/odpowiednik stosu) przed napisaniem kodu,
zwłaszcza gdy bibliotieka ma szybki cykl wydań (SDK dostawców AI, frameworki webowe)". Propozycja:
dopisać to jako **15.7a**, z tym konkretnym przykładem (Anthropic SDK 0.126.0 vs beta Tool Runner)
jako gotowa ilustracja "jak to wygląda w praktyce", analogicznie do już zgłoszonego wzorca
(wpis 16.09.2026 wyżej — "reguła bez przykładu kodu jest łatwiejsza do błędnego wdrożenia niż
reguła z gotowym wzorcem obok").

Dlaczego warto zgłosić do new-app-standards: to nie jest specyfika AI czy jednego SDK — to ogólny
problem każdej sesji AI piszącej kod na bibliotece, która aktualizuje się częściej niż wiedza
treningowa modelu. Bez jawnie nazwanej reguły z konkretnym przykładem, kolejny projekt rodziny
(albo ta samo, po aktualizacji zależności) ryzykuje napisanie kodu na nieistniejące/przestarzałe
API biblioteki, wykryte dopiero przy `pnpm build`/`pnpm typecheck`, a nie przed napisaniem kodu.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/15-wspolpraca-z-ai.md` 15.7a — nie zgaduj
API biblioteki zewnętrznej z pamięci treningowej, zweryfikuj zainstalowaną wersję wprost).
Zweryfikowane wprost w treści rozdziału.


---

[20.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — rejestr narzędzi AI powinien być architektonicznym
domyślnym od Etapu 1 (jak 17.1a i18n oraz 5.7 autosave), nie dobudowywany reaktywnie

Szczegóły: Na wyraźną prośbę właściciela projektu ("róbmy to od razu, nie tylko dla
wielojęzyczności, ale i dla AI") — rozszerzenie wpisu bezpośrednio wyżej (referencyjna
implementacja `AiToolDefinition`) o formalną propozycję reguły w tym samym kształcie, co dwie już
skonsolidowane reguły tego standardu: [17.1a](../standards/17-i18n.md) (wielojęzyczność od Etapu 1)
i [5.7](../standards/05-baza-danych-offline.md) (autosave od Etapu 1). Ten projekt ma dziś **trzeci
niezależny przypadek tego samego wzorca kosztu**: warstwa dobudowana reaktywnie do już istniejących
ekranów (i18n — dziesiątki ekranów z twardym polskim tekstem; autosave — ~90 ekranów bez
persystencji; teraz AI — 116 ze 117 kalkulatorów bez zarejestrowanego narzędzia) zawsze kończy się
osobną, kosztowną kampanią retrofitu zamiast kosztem rozłożonym na każdy ekran budowany od razu
poprawnie. Trzecie wystąpienie tego samego kształtu w jednym projekcie to silny sygnał ogólnej
prawidłowości, nie przypadku.

Gotowa, pełna treść proponowanej reguły (wzorowana 1:1 na strukturze 17.1a/5.7, z jednym świadomie
nazwanym odstępstwem — inną kolejnością pisania wewnątrz pojedynczego ekranu niż przy i18n, bo opis
narzędzia AI wymaga ustabilizowanego kontraktu I/O, więc musi powstać na końcu, nie na początku;
wersja z pełnym uzasadnieniem zostaje dodatkowo, nieusunięta, w
`docs/propozycje-do-new-app-standards/ai-w-produkcie-rozbudowa.md`, sekcja 6, w tym repo) — proponowany
podpunkt **9.0a**, obok 9.0 "Obowiązkowość AI w produkcie":

> Każdy nowy projekt rodziny zakłada od **Etapu 1** (szkielet architektury, zanim powstanie pierwszy
> ekran kalkulatora), że każdy kalkulator dostanie zarejestrowane narzędzie AI (`AiToolDefinition`,
> patrz zgłoszenie 14.09.2026 wyżej) — nigdy "AI dodamy do interfejsu później, jako osobny projekt
> nad już gotowymi ekranami". Konkretnie, od pierwszego dnia:
>
> - Szkielet ma gotowy, generyczny rejestr narzędzi (`NARZEDZIA`/`AiToolDefinition[]`) i adapter do
>   wybranego dostawcy modelu (most JSON Schema, patrz zgłoszenie 20.09.2026 wyżej) — zbudowane razem
>   z Kernelem, nie po fakcie.
> - **Kolejność wewnątrz jednego ekranu pozostaje świadomie inna niż dla i18n**: kalkulator →
>   struktura i18n → dopiero na końcu opis narzędzia AI, bo dokładny opis (`.describe()` na polach
>   Zod, treść `description`) wymaga znajomości OSTATECZNEGO, przetestowanego kształtu
>   wejścia/wyjścia — w odróżnieniu od i18n (gdzie struktura kluczy powstaje pierwsza, bo kalkulator
>   i tak musi zwracać klucze, nie gotowy tekst), tutaj struktura rejestru powstaje pierwsza (na
>   poziomie szkieletu), ale WPIS per-kalkulator powstaje ostatni (na poziomie pojedynczego ekranu).
> - `handler` każdego nowego narzędzia deleguje 1:1 do już istniejącej funkcji domenowej (9.2) —
>   nigdy nowa logika pisana specjalnie pod AI.

Dowód z tego projektu: w chwili zgłoszenia 116 ze 117 zbudowanych kalkulatorów
(`lib/core/modules/*/calculator.ts`) nie miało żadnego zarejestrowanego narzędzia AI — dokładnie ten
sam kształt zaległości, co ~90 ekranów bez autosave przed 5.7 i dziesiątki ekranów z twardo wpisanym
polskim tekstem przed 17.1a.

Dlaczego warto zgłosić do new-app-standards: dokładnie ten sam argument, co przy konsolidacji
17.1a/5.7 — trzy niezależne projekty/warstwy odkryły ten sam koszt osobno, w różnym czasie, co było
wystarczającym sygnałem, żeby podnieść autosave i i18n do rangi reguły. AI w produkcie jest już
dziś obowiązkowa dla każdej apki rodziny (9.0) — bez tej reguły każdy kolejny projekt powtórzy
dokładnie ten sam błąd sekwencji po raz czwarty.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/09-ai-w-produkcie.md` 9.0a — rejestr
narzędzi AI jako architektoniczny domyślny od Etapu 1, z zastrzeżeniem o kolejności "opis na
końcu" przeniesionym 1:1 z propozycji). Zweryfikowane wprost w treści rozdziału.


---

[20.09.2026] KATEGORIA: BŁĄD — równoległe uruchomienie wielu subagentów wyczerpało limit sesji API szybciej niż praca sekwencyjna

Szczegóły: Duży mechaniczny rollout (114 plików, ta sama transformacja `useState` →
`usePersistedDraft` w każdym) podzielony na 8 batchy po ~15 plików, uruchomionych jako 8
niezależnych agentów w tle RÓWNOCZEŚNIE (jedno wywołanie narzędzia z 8 blokami). Wszystkie 8
padło w trakcie pracy na błąd 429 "session limit" — konto wyczerpało limit zanim którykolwiek
agent skończył, zostawiając 75 ze 114 plików przekonwertowanych, resztę trzeba było dokończyć
bezpośrednio (bez kolejnych subagentów, żeby nie powtórzyć błędu). Koszt: przerwana praca,
dodatkowa runda diagnozy (`pnpm typecheck`/`lint` na częściowym stanie, żeby upewnić się, że
żaden agent nie zostawił pliku w połowie edycji) zanim dokończenie było możliwe.

Dlaczego warto zgłosić do new-app-standards: 8 subagentów naraz, każdy robiący dziesiątki
wywołań API w krótkim czasie, może wyczerpać limit sesji konta znacznie szybciej niż ta sama
praca rozłożona sekwencyjnie/mniejszymi turami — to nieoczywiste, bo intuicyjnie
"równoległe = szybsze i bezpieczniejsze". Dla zadań w pełni mechanicznych (bez potrzeby
kreatywnej oceny per plik, jak w tym przypadku) sekwencyjna praca bezpośrednia bywa
bezpieczniejsza niż orkiestracja wielu subagentów. Rekomendacja: standard powinien zawierać
wytyczną o rozsądnym limicie równoległych subagentów (np. 2-4 na raz) dla dużych mechanicznych
rolloutów, z sugestią sprawdzenia typecheck/lint na częściowym stanie przed kontynuacją, gdyby
któryś padł w trakcie.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/15-wspolpraca-z-ai.md` 15.20 — limit 2-4
równoległych subagentów dla dużych mechanicznych rolloutów). Zweryfikowane wprost w treści rozdziału.


---

[20.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — autosave draftu formularza powinien być architektonicznym domyślnym od pierwszego ekranu, nie dobudowywanym reaktywnie po zgłoszeniu

Szczegóły: W tym projekcie autosave (`usePersistedDraft`, zapis draftu formularza do
IndexedDB przy każdej zmianie) powstał 15.09.2026 — dopiero po tym, jak użytkownik zgłosił
realną utratę danych (przeglądarka mobilna odświeżyła kartę w tle, formularz wrócił pusty).
Do tego dnia zbudowano już ~90 ekranów kalkulatorów zwykłym `useState`, bez żadnej persystencji
— wszystkie wymagały późniejszego, osobnego zadania konwersji (114 plików, jedna sesja, viz.
powiązany wpis BŁĄD wyżej o nowym wzorcu nie stosowanym retroaktywnie — to jest jego pierwotna
przyczyna: gdyby autosave był domyślny od Ekranu 1, tamten błąd w ogóle nie mógłby powstać).
Koszt: dziesiątki ekranów budowanych dwa razy (raz bez autosave, raz z konwersją), zamiast raz
z automatycznym mechanizmem od początku.

Dlaczego warto zgłosić do new-app-standards: to nie specyfika tego projektu — **każda** aplikacja
offline-first z formularzami wielopolowymi (dokładnie profil całej rodziny "Inżynier Pro", patrz
`docs/standards/05-baza-danych-offline.md`, "Seed nie Wynik") ma ten sam ryzyko: użytkownik traci
wpisane dane przy odświeżeniu/zamknięciu karty, zanim ktoś to zgłosi jako bug. To przewidywalne
z góry, nie coś, co trzeba było odkryć w praktyce. Rekomendacja dwuczęściowa:
1. **Architektoniczna:** standard (rozdział 05 lub 03-jądro-obliczeniowe) powinien wymagać, żeby
   każdy nowy projekt rodziny miał gotowy, generyczny hook/wzorzec autosave draftu formularza
   (Seed → `StorageAdapter`, debounce'owany zapis, async odczyt przy montowaniu) **zbudowany
   razem ze szkieletem architektury (Etap 1), zanim powstanie pierwszy ekran kalkulatora** — nie
   jako osobne zadanie dobudowywane później per zgłoszenie. Ten sam hook/wzorzec używany od
   pierwszego dnia przez KAŻDY nowy ekran z polami formularza, bez wyjątków.
2. **Procesowa (uzupełnienie wcześniejszego wpisu o kopiowaniu nieaktualnych szablonów):** dopóki
   punkt 1 nie jest jeszcze zaimplementowany w danym projekcie, standard/`CLAUDE.md` powinien
   jawnie nakazywać: przed napisaniem nowego ekranu/pliku wg istniejącego wzorca, AI **musi**
   sprawdzić `docs/memory.md`/`docs/standards/` pod kątem najnowszej, aktualnej wersji tego
   wzorca — nigdy nie kopiować z pamięci/z najbliższego przykładu w kodzie bez tej weryfikacji,
   nawet w obrębie tej samej sesji. Powtarzalny koszt tego zaniedbania (ten projekt: 8 nowych
   modułów zbudowanych bez autosave w tej samej sesji, w której autosave już istniał) pokazuje,
   że "AI pamięta niedawno ustalony wzorzec" nie jest wystarczającym zabezpieczeniem — potrzebna
   jest jawna, wymuszona checklista, nie poleganie na pamięci kontekstu.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/05-baza-danych-offline.md` 5.7 — autosave
draftu formularza jako architektoniczny domyślny od Etapu 1, ten sam wzorzec co 17.1a).
Zweryfikowane wprost w treści rozdziału.

---

