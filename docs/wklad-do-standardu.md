# docs/wklad-do-standardu.md — Inżynier Offgrid Pro

Rosnący log nietrywialnych spostrzeżeń z pracy nad **tym** projektem, wartych rozważenia dla całego pakietu `new-app-standards`/GOD BOOK — nie tylko tego repo. To **nie jest** źródło prawdy o standardzie — to surowy materiał zgłoszeniowy. AI dopisuje tu z własnej inicjatywy (analogicznie do Części U.2 GOD BOOK), gdy natrafi na coś nietrywialnego. **Nigdy nie edytuj stąd bezpośrednio plików w `new-app-standards`** — konsolidacja i decyzja o promocji do reguły dzieje się wyłącznie w sesji nad repo `new-app-standards` (Część Y.8 GOD BOOK).

Format i zasada aktualizacji: nie usuwamy wpisów, tylko dopisujemy — tak jak reszta Biblii (Część D GOD BOOK).

## Co zapisywać, i pod jaką kategorią

- **BŁĄD** — decyzja architektoniczna/procesowa (ze standardu albo z GOD BOOK), która okazała się zła w praktyce, i dlaczego. Nie literówka — coś, co kosztowało realny czas albo spowodowało realny problem.
- **DOBRA PRAKTYKA** — rozwiązanie, które się sprawdziło, nieoczywiste, warte powtórzenia w innych projektach (nie "użyłem X" — coś specyficznego, co inaczej trzeba by wymyślić od nowa).
- **POMYSŁ NA REGUŁĘ** — luka zauważona w standardzie/GOD BOOK, którą warto rozważyć jako nową, uniwersalną zasadę.

**Nie zapisuj tutaj:** rzeczy trywialnych; specyficznych wyłącznie dla domeny *tego* projektu (te idą do `docs/memory.md`, nie tutaj); jednorazowych literówek.

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

Status: 🔎 nowe

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

Status: 🔎 nowe
