# docs/wklad-do-standardu.md — Inżynier Offgrid Pro

Rosnący log nietrywialnych spostrzeżeń z pracy nad **tym** projektem, wartych rozważenia dla całego pakietu `new-app-standards`/GOD BOOK — nie tylko tego repo. To **nie jest** źródło prawdy o standardzie — to surowy materiał zgłoszeniowy. AI dopisuje tu z własnej inicjatywy (analogicznie do Części U.2 GOD BOOK), gdy natrafi na coś nietrywialnego. **Nigdy nie edytuj stąd bezpośrednio plików w `new-app-standards`** — konsolidacja i decyzja o promocji do reguły dzieje się wyłącznie w sesji nad repo `new-app-standards` (Część Y.8 GOD BOOK).

Format i zasada aktualizacji: nie usuwamy wpisów, tylko dopisujemy — tak jak reszta Biblii (Część D GOD BOOK).

## Co zapisywać, i pod jaką kategorią

- **BŁĄD** — decyzja architektoniczna/procesowa (ze standardu albo z GOD BOOK), która okazała się zła w praktyce, i dlaczego. Nie literówka — coś, co kosztowało realny czas albo spowodowało realny problem.
- **DOBRA PRAKTYKA** — rozwiązanie, które się sprawdziło, nieoczywiste, warte powtórzenia w innych projektach (nie "użyłem X" — coś specyficznego, co inaczej trzeba by wymyślić od nowa).
- **POMYSŁ NA REGUŁĘ** — luka zauważona w standardzie/GOD BOOK, którą warto rozważyć jako nową, uniwersalną zasadę.

**Nie zapisuj tutaj:** rzeczy trywialnych; specyficznych wyłącznie dla domeny *tego* projektu (te idą do `docs/memory.md`, nie tutaj); jednorazowych literówek.

[16.09.2026] ✅ DOPRECYZOWANO — źródło: właściciel repo, `new-app-standards`. **Próg zgłoszenia jest niżej, niż wygląda.** Nie czekaj na coś spektakularnego — błąd, który kosztował choćby pół godziny pracy, albo rozwiązanie, którego nie chciałbyś wymyślać od zera w kolejnym projekcie rodziny, już się kwalifikuje. Cały mechanizm konsolidacji (U.1–U.4 GOD BOOK) działa tylko wtedy, gdy ten plik faktycznie rośnie — rzadkie wpisy oznaczają, że reszta rodziny projektów nie korzysta z lekcji wyciągniętych tutaj. Zgłaszaj częściej, nie rzadziej.

## Format wpisu

```
[DD.MM.RRRR] KATEGORIA: [BŁĄD / DOBRA PRAKTYKA / POMYSŁ NA REGUŁĘ] — [krótki opis]
Szczegóły: [co się stało / na czym polega]
Dlaczego warto zgłosić do new-app-standards: [uogólnienie — dlaczego to dotyczy więcej niż tego projektu]
Status: 🔎 nowe / ✅ przekazane do new-app-standards (DD.MM.RRRR)
```

---

## Wpisy

<!-- Pierwszy wpis powstaje, gdy AI natrafi na coś wartego zgłoszenia — nie czekaj na "koniec projektu". -->

[06.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak w standardzie procedury przetwarzania dostarczonych materiałów źródłowych (normy, PDF, skany, .doc/.docx)

Szczegóły: W tej sesji przetworzono ~10 dokumentów źródłowych (normy PN/IEC/EN/HD, materiały
branżowe/szkoleniowe) dostarczonych przez właściciela projektu w różnych formatach: PDF z natywnym
tekstem, PDF-skan wymagający OCR, stary binarny `.doc` (Word 95/97 — LibreOffice/`soffice` odmawiał
otwarcia, wymagał `antiword`+`wv`), oraz `.docx` (w tym konwersje z `.pptx` zrobione przez
użytkownika). Standard nie miał dotąd żadnej wytycznej co robić w tej sytuacji — cała metodologia
(rozpoznanie formatu, dobór narzędzia ekstrakcji, dyscyplina weryfikacji) została wypracowana
ad-hoc w trakcie sesji, z kilkoma realnymi wpadkami po drodze zanim ustaliła się właściwa procedura:
- pierwszy pojedynczy spot-check jednej strony normy (5-52, Załącznik B) dał fałszywe poczucie
  bezpieczeństwa — pełne przejście przez wszystkie 26 stron tego załącznika znalazło **~35 błędów**,
  w tym całe brakujące kolumny/wiersze danych (niewidoczne przy losowym sprawdzeniu, bo nie
  wyglądają jak błąd — po prostu jest mniej liczb niż powinno);
- `antiword` bez jawnie podanej mapy znaków (`-m 8859-2.txt`) dawał mojibake na polskich znakach;
- `wvHtml` (a nie sam `antiword`) był potrzebny do odzyskania realnej struktury tabel i osadzonych
  obrazów WMF (wzory matematyczne) z plików `.doc`;
- `.docx` z zachowanymi natywnymi tabelami Worda okazał się czasem **bardziej** wiarygodny niż
  odczyt wizualny tego samego dokumentu jako PDF (dla tabel-jako-tabel), ale **mniej** wiarygodny
  dla treści, która w oryginale była diagramem/SmartArt (te wychodzą jako puste komórki) — czyli
  która metoda jest "lepsza" zależy od tego, czym dana treść była w oryginale, nie od samego
  formatu pliku.
Pełny, samodzielny opis kroków i komend: `docs/propozycje-do-new-app-standards/przetwarzanie-materialow-zrodlowych.md`
w tym repo — surowy szkic, **nie jest częścią standardu**, czeka na konsolidację przez sesję
pracującą bezpośrednio nad repo `new-app-standards` (Część Y.8 GOD BOOK). Ten plik zawiera na
samej górze osobną sekcję **"PROMPT — gotowy do skopiowania i przekazania dowolnej innej sesji/
projektowi"** — skrócony, samodzielny blok bez uzasadnień/przykładów, do wzięcia 1:1 i przekazania
dalej innym projektom rodziny (albo poza nią) bez czekania na formalną promocję do reguły
standardu — sesja `new-app-standards` może go od razu ściągnąć i redystrybuować.

Dlaczego warto zgłosić do new-app-standards: każda aplikacja tej rodziny prędzej czy później
dostanie od właściciela dokument źródłowy (normę, specyfikację, materiał branżowy) w jednym z tych
formatów — bez tej procedury każda kolejna sesja/projekt odkrywa te same pułapki (LibreOffice nie
otwiera starych .doc, OCR bez pełnej weryfikacji daje fałszywe poczucie bezpieczeństwa, mojibake bez
jawnej mapy znaków) od nowa, tracąc czas i ryzykując ciche błędy w danych bezpieczeństwa-krytycznych.

Status: 🔎 nowe

---

[06.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak współdzielonej, wielorazowej biblioteki norm źródłowych między projektami rodziny

Szczegóły: W tym projekcie zgromadzono i przeprocesowano (metodologia — patrz zgłoszenie wyżej,
06.09.2026) 10 źródeł: 8 formalnych norm PN/IEC/EN/HD i 2 materiały branżowe, dotyczące w większości
**generycznej elektryki niskiego napięcia i budownictwa** (instalacje elektryczne, ochrona
przeciwporażeniowa, PV, obciążenie śniegiem dachów) — nie tylko off-grid. Każda przyszła aplikacja
inżynierska tej rodziny (np. kolejny "Kalkulator Inżyniera Pro", instalator PV on-grid, projektant
instalacji elektrycznej budynku) prędzej czy później potrzebuje tych samych norm. Dziś, bez
mechanizmu współdzielenia, każdy kolejny projekt musiałby kupować/skanować/OCR-ować/weryfikować je
od nowa — realny koszt czasu i pieniędzy (część tych norm to płatne zakupy PKN), a przy okazji
ryzyko, że różne projekty rodziny zbudują kalkulatory na niezależnie (i niespójnie) zweryfikowanych
kopiach tej samej normy.

Pełny manifest — dokładnie co jest, gdzie leży, w jakim jest stanie (jaka część zweryfikowana w
pełni vs spot-check vs bezużyteczny wyciąg) i czy nadaje się do skopiowania 1:1 do współdzielonej
biblioteki: `docs/propozycje-do-new-app-standards/biblioteka-norm-zrodlowych.md` w tym repo —
surowy szkic, czeka na konsolidację przez sesję pracującą bezpośrednio nad `new-app-standards`
(albo osobnym repo pod nim, np. `biblioteka-norm`, do decyzji tamtej sesji).

Dlaczego warto zgłosić do new-app-standards: to naturalne rozszerzenie pomysłu zgłoszonego wyżej
(procedura przetwarzania materiałów) — ta reguluje JAK przetwarzać nowy dokument, ta tutaj reguluje
GDZIE trzymać wynik, żeby nie przetwarzać tego samego dokumentu dwa razy w dwóch różnych projektach
rodziny. Dotyczy każdej aplikacji inżynierskiej tej rodziny, nie tylko Offgrid.

Status: 🔎 nowe

---

[14.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — rozdział 09 (AI w produkcie) ma zasady, ale brak
konkretnego kontraktu narzędzia, wzorca UX i budżetu/kosztu

Szczegóły: `docs/standards/09-ai-w-produkcie.md` opisuje dobre, spójne zasady etyczne/architektoniczne
(co AI może/nie może, tryby OFFLINE/HYBRID/CLOUD_ASSISTED, obrona przed prompt injection), ale w
przeciwieństwie do rozdziału 03 (konkretny typ `CalcResult`) nie daje żadnego konkretnego kształtu
narzędzia (function calling), żadnego wzorca UX dla obecności AI w interfejsie (rozdział 08 ma pełną
taksonomię Wzorców A-H dla ekranów, zero dla AI), i nie porusza budżetu/kosztu wywołań modelu mimo
istniejącej warstwy freemium (rozdział 12). Każdy projekt rodziny, który zacznie faktycznie budować
funkcję AI, wymyśli te trzy rzeczy od nowa, niespójnie z resztą rodziny.

Pełna propozycja (konkretny typ `AiToolDefinition`, dwa wzorce UX — asystent inline vs czat, reguła
budżetu z łagodną degradacją, pole `zaproponowaneBy: "ai"` w procesie wersjonowania):
`docs/propozycje-do-new-app-standards/ai-w-produkcie-rozbudowa.md` w tym repo — gotowy do
konsolidacji, nie zależy od żadnego innego repo rodziny.

Dlaczego warto zgłosić do new-app-standards: AI-w-produkcie to nie specyfika Offgrid — każda apka
rodziny prędzej czy później dostanie funkcję asystenta, a bez wspólnego kontraktu narzędzia i
wzorca UX każdy projekt zbuduje niekompatybilną, jednorazową implementację, tak jak dziś dzieje się
z i18n i logowaniem (patrz dwa zgłoszenia niżej).

Status: 🔎 nowe

---

[14.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak w standardzie/GOD BOOK jakiegokolwiek rozdziału o
logowaniu i kontach użytkownika

Szczegóły: Sprawdzone wprost (nie zgadywane) — zero trafień na "logowanie"/"konto użytkownika"/
"uwierzytelnianie"/"autoryzacja" w całym pakiecie `docs/standards/00`-`16` i w GOD BOOK. To nie jest
luka tylko tego projektu (ten też nie ma żadnego kodu auth) — to luka na poziomie samego pakietu.
Właściciel projektu wskazał apkę `zero-waste` (siostrzany projekt rodziny) jako wzorzec, na którym
mają bazować rekomendacje — ta sesja nie miała dostępu do tamtego repo, więc zgłoszenie jest
świadomie niedokończone (szkielet + pytania, nie gotowa specyfikacja).

Co już ustalone bez zero-waste (echo istniejących zasad: offline-first musi przetrwać brak konta,
prywatność lokalna-domyślna = logowanie jako moment zgody na chmurę, freemium egzekwowane
server-side, `StorageAdapter` jako miejsce na dane sesji) oraz pełna lista pytań czekających na
odpowiedź z realnego kodu zero-waste (dostawca auth, model konta, co dokładnie wymaga logowania,
spięcie offline↔online, role, zakres bezpieczeństwa):
`docs/propozycje-do-new-app-standards/logowanie-i-konta.md` w tym repo — **celowo niedokończony**,
czeka na dołączenie repo `zero-waste` do przyszłej sesji.

Dlaczego warto zgłosić do new-app-standards: logowanie to jeden z tych tematów, które "zawsze są
zakładane, nigdy nie są nigdzie zapisane" — dokładnie to odkryła ta sesja, sprawdzając wprost zamiast
zakładać. Dotyczy każdej apki rodziny, która kiedykolwiek doda konta użytkownika.

Status: 🔎 nowe

---

[14.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — wielojęzyczność wspomniana jednym zdaniem (rozdział 01),
brak strategii

Szczegóły: Jedyna wzmianka o i18n w całym standardzie to jedno zdanie w `01-architektura.md` — i18n
ma żyć w warstwie domenowej jako czysta funkcja, nie w UI. To reguła GDZIE, nie strategia JAK (które
języki, format tłumaczeń, przełącznik, fallback). Zero implementacji w tym projekcie. Tak jak przy
logowaniu — właściciel projektu wskazał `zero-waste` jako wzorzec, ta sesja nie miała dostępu, więc
zgłoszenie jest świadomie niedokończone.

Najważniejsze znalezisko możliwe bez zero-waste: realna kolizja z regułą z rozdziału 01 — pola
`CalcResult.formula`/`assumptions`/`Warning.message` (rozdział 03) są dziś tekstem w jednym języku
wpisanym wprost w logice domenowej, co narusza "i18n jako czysta funkcja w warstwie domenowej" —
brak decyzji, czy jądro obliczeniowe ma zwracać klucze tłumaczeń czy gotowy tekst w wybranym języku,
to fundamentalna zmiana dotycząca KAŻDEGO istniejącego kalkulatora w KAŻDYM projekcie rodziny, nie
kosmetyka. Pełna analiza + lista pytań czekających na odpowiedź z zero-waste (zakres języków,
biblioteka, wykrywanie języka, fallback, oraz osobne ryzyko: tłumaczenie treści normatywnych/
bezpieczeństwa-krytycznych, specyficzne dla projektów inżynierskich typu Offgrid):
`docs/propozycje-do-new-app-standards/wielojezycznosc.md` w tym repo — **celowo niedokończony**,
czeka na dołączenie repo `zero-waste`.

Dlaczego warto zgłosić do new-app-standards: kolizja z rozdziałem 01 (punkt B.3 w pliku) to nie
drobiazg — to pytanie architektoniczne o kształt `CalcResult`/`Warning`, współdzielony przez każdy
kalkulator w każdej apce rodziny; im później rozstrzygnięte, tym droższa migracja wstecz.

Status: 🔎 nowe. **Aktualizacja (16.09.2026):** na wyraźne polecenie właściciela repo ("nie musisz
grzebać w innych repo projektów, żeby coś wyjaśniać... jak czegoś ci brakuje, piszesz w wkład do
standardu i tam decydują") — zgłoszenie NIE czeka już na `zero-waste`. Zbudowano i przetestowano
realną implementację w tym projekcie (przełącznik języka w Ustawieniach, 3 języki pl/en/ru, kontrakt
klucz+params w jądrze, cookie zgodna z 17.4/17.4a): `lib/i18n/`, `components/jezyk-wybor.tsx`,
`middleware.ts`, `app/layout.tsx`. Sekcja C `docs/propozycje-do-new-app-standards/wielojezycznosc.md`
zastąpiona konkretnymi rozstrzygnięciami z tego kodu (nie pytaniami czekającymi na inny projekt) —
plik ma teraz status "gotowa do konsolidacji", poza jednym świadomie wciąż otwartym pytanem (C6,
tłumaczenie treści bezpieczeństwa-krytycznych — ten projekt tego jeszcze nie zrobił, nie tylko nie
zgłosił). Punkt B.3 (kolizja z rozdz. 01) **rozstrzygnięty**: jądro zwraca klucz+params, nigdy gotowy
tekst — patrz plik propozycji, sekcja C.3.

---

[16.09.2026] KATEGORIA: DOBRA PRAKTYKA — referencyjny CI (11.2/11.5) i mechanizm strażniczy i18n
(17.9) jako konkretne, sprawdzone przykłady dla reguł, które standard dotąd opisywał tylko abstrakcyjnie

Szczegóły: W tym projekcie 11.5 (audyt podatności jako bramka CI) i 17.9 (mechanizm strażniczy
wykrywający regresję i18n) istniały w standardzie jako **tekst reguły**, ale bez żadnego konkretnego
przykładu implementacji — dokładnie ten sam wzorzec luki, co już zgłoszony wcześniej dla rozdziału
09 (AI w produkcie: zasady są, kontraktu narzędzia nie ma). Zbudowano i zweryfikowano oba jako
realny, działający kod (nie szkic):
- `.github/workflows/ci.yml` — dwa niezależne joby (jakość / audyt), próg `high`, z realną,
  dokumentowaną lekcją: pierwsze włączenie bramki audytu **nie przechodziło** (22 podatności `high`),
  naprawione bez obniżania progu, w granicach już zadeklarowanych zakresów semver, zweryfikowane
  pełnym łańcuchem lint/typecheck/test/build po każdej zmianie zależności.
- `scripts/check-i18n-guard.mjs` — parsowanie AST (nie regex, żeby nie łapać pól świadomie
  wyłączonych z i18n) plus explicit allowlist modułów już zmigrowanych. Złapany i naprawiony
  realny błąd własnej pierwszej wersji (nie wykrywała regresji za wzorcem `warunek ? [...] : []`,
  mimo że to normalny, częsty wzorzec w kodzie, nie edge case) — znaleziony wyłącznie dzięki
  wstrzyknięciu prawdziwej regresji do prawdziwego pliku przed wdrożeniem, nie przez samo
  przeczytanie kodu skryptu.

Pełny opis (kształt decyzji transferowalny między stackami + konkretny YAML/skrypt do adaptacji +
"PROMPT" gotowy do wklejenia w innej sesji, bez czekania na formalną promocję):
`docs/propozycje-do-new-app-standards/ci-referencyjny-i-mechanizm-strazniczy-i18n.md` w tym repo.

Dlaczego warto zgłosić do new-app-standards: bez konkretnego przykładu każdy projekt rodziny
odkrywa te same pułapki od zera (włączenie bramki audytu bez sprawdzenia najpierw, regex zamiast
AST dla guardu i18n, brak testu na prawdziwym wzorcu warunkowym) — dokładnie to, co już się
zdarzyło w TYM projekcie mimo że reguła była znana od dnia wcześniej.

Status: 🔎 nowe. **Korekta (16.09.2026):** ta sesja błędnie oznaczyła to jako "przekazane" i otworzyła
PR wprost w `new-app-standards` (#9, teraz zamknięty bez mergowania, żadna treść nie trafiła na
`main` tamtego repo) — naruszenie zasady z góry tego pliku: "nigdy nie edytuj stąd bezpośrednio
plików w `new-app-standards`". Właściciel repo poprawił: samo dołączenie tamtego repo do sesji nie
czyni jej "sesją nad `new-app-standards`" uprawnioną do konsolidacji — jedyny dopuszczalny kanał
stąd to ten plik, konsolidacja zapada wyłącznie w osobnej, dedykowanej sesji. Wpis wyżej pozostaje
aktualnym zgłoszeniem, czeka na tamtą sesję, nie na nic z tego repo.

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

Status: 🔎 nowe

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

Status: 🔎 nowe

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

Status: 🔎 nowe

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

Status: 🔎 nowe
