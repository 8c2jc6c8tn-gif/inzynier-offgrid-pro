# PROPOZYCJA dla `new-app-standards` — Rozbudowa rozdziału 09 (AI w produkcie)

> **Status: propozycja, nie standard.** Ten plik to szkic rozszerzenia, powiązany ze zgłoszeniem w
> `docs/wklad-do-standardu.md`. **Nie jest częścią `docs/standards/`** i nie ma mocy obowiązującej —
> decyzja o przyjęciu (w całości, częściowo, albo wcale) zapada wyłącznie w sesji pracującej
> bezpośrednio nad repo `new-app-standards` (GOD BOOK Część Y.8). Nie zależy od dostępu do żadnego
> innego repo rodziny — oparty wyłącznie na już istniejącym rozdziale 09 i pozostałych rozdziałach
> standardu, których ten projekt (`inzynier-offgrid-pro`) ma pełną, aktualną kopię.

## Kontekst i cel

Rozdział `09-ai-w-produkcie.md` opisuje dziś **zasady i granice** AI jako funkcji produktu (co AI
może/nie może wobec logiki domenowej, architektura narzędziowa, obrona przed prompt injection,
ujawnianie niepewności, tryby OFFLINE/HYBRID/CLOUD_ASSISTED) — to dobry, spójny fundament
**etyczny/architektoniczny**. Czego brakuje, żeby projekt mógł faktycznie **zacząć budować** funkcję
AI, nie tylko wiedzieć, czego jej nie wolno robić: konkretnego kontraktu narzędzia (jak dziś
istnieje konkretny `CalcResult` dla rozdziału 03), wzorców UX dla AI w produkcie (rozdział 08 ma
pełną taksonomię Wzorców A-H dla ekranów, ale zero wzorców dla "jak wygląda w UI odpowiedź AI"),
budżetu/kosztu wywołań, oraz miejsca w procesie wersjonowania Biblii (rozdział 14) na to, co AI
faktycznie proponuje w danym projekcie.

Zgłoszone jako osobna propozycja (nie wpisane wprost do `docs/standards/09-ai-w-produkcie.md` w tym
repo — Nietykalne, patrz `README.md` `new-app-standards`), na wyraźną prośbę właściciela projektu
("wszystko trzeba rozbudować, żeby każda nasza apka dokładnie wiedziała co robić i w jakim
kierunku iść").

## 1. Konkretny kontrakt narzędzia (uzupełnienie 9.3)

Rozdział 9.3 mówi ogólnie: "każde narzędzie ma nazwę, opis, schemat wejścia, schemat wyniku, zakres
uprawnień, typ operacji, wymaganie potwierdzenia, testy" — ale nie podaje **kształtu**, w jaki te
pola mają być zapisane, więc każdy projekt wymyśla go od nowa. Propozycja: ten sam duch co
`CalcResult` z rozdziału 03 — jeden, nazwany typ, żeby narzędzia były wzajemnie kompatybilne między
projektami rodziny:

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

**Reguła:** `handler` dla narzędzi typu "wywołaj kalkulator" **zawsze** deleguje do już istniejącej,
niezależnie przetestowanej funkcji domenowej (rozdział 03) — nigdy nie zawiera logiki obliczeniowej
samodzielnie. To czyni regułę 9.1 ("obliczenia nigdy nie zależą od AI") sprawdzalną maszynowo (test:
`handler` nie zawiera nowej logiki, tylko wywołanie + mapowanie), nie tylko deklaratywną.

## 2. Budżet i koszt — brakujący wymiar

Rozdział 9.6 opisuje tryby OFFLINE/HYBRID/CLOUD_ASSISTED wg dostępności **sieci**, ale nie wg
**kosztu**. Dla aplikacji tej rodziny (freemium, rozdział 12) to osobny, realny wymiar:

- Każde wywołanie modelu w trybie CLOUD_ASSISTED ma koszt per token — potrzebny jawny **budżet per
  użytkownik/projekt** (np. limit miesięczny w warstwie freemium), egzekwowany server-side (ta sama
  zasada co rozdział 12: nigdy tylko po stronie klienta).
- **Degradacja przy wyczerpanym budżecie musi być łagodna i jawna** (echo zasady z rozdziału 06 —
  "łagodna degradacja bez zmyślania danych"): AI przechodzi do trybu HYBRID/OFFLINE i **mówi o tym
  wprost** użytkownikowi ("Wyczerpano miesięczny limit asystenta AI — nadal możesz korzystać ze
  wszystkich kalkulatorów ręcznie"), nigdy nie ukrywa degradacji ani nie udaje pełnej funkcjonalności
  gorszym modelem bez powiadomienia.

## 3. Wzorce UX dla AI w produkcie (uzupełnienie rozdziału 08)

Rozdział 08 ma pełną taksonomię Wzorców A-H dla ekranów kalkulatorów/doradców, ale zero wzorca dla
tego, **jak fizycznie wygląda w UI** obecność AI. Propozycja — dwa nazwane, rozróżnialne tryby
(decyzja per projekt, który wdrożyć, nie oba na raz obowiązkowo):

- **Asystent wbudowany w ekran (inline)** — AI sugeruje wypełnienie konkretnych pól na już
  istniejącym ekranie Wzorca D (Doradca), nigdy nie zastępuje samego ekranu. Widoczne jako
  odznaczalna sugestia przy polu ("AI proponuje: 25% na podstawie ostatnich 3 projektów — użyj /
  odrzuć"), zgodnie z 9.2 ("AI nigdy nie zmienia danych bez wiedzy i zgody użytkownika").
- **Czat/asystent rozmowny (osobny panel)** — dla pytań nieprzypisanych do jednego konkretnego
  ekranu ("jaki kabel do X"). Zawsze kończy odpowiedź, jeśli dotyczy wyniku liczbowego, **linkiem do
  właściwego ekranu Doradcy**, nie samą odpowiedzią tekstową z liczbą wygenerowaną przez model — to
  wprost egzekwuje 9.1/9.2 na poziomie UI, nie tylko reguły.

W obu przypadkach: **każda sugestia AI pokazuje źródło** (który kalkulator/która funkcja ją
wyprodukowała, rozdział 03 pole `traceId`/`calculatorVersion`) — użytkownik zawsze może zweryfikować,
skąd wzięła się liczba, zamiast ufać samemu tekstowi.

## 4. Miejsce w procesie wersjonowania Biblii (uzupełnienie rozdziału 14)

Rozdział 14 ma dyscyplinę dziennika zmian dla decyzji/kodu, ale nie ma miejsca na **decyzje
podjęte z asystą AI w produkcie** (nie mylić z rozdziałem 15 — współpraca z AI kodującym, to inny
byt). Propozycja: każda decyzja projektowa zaakceptowana przez użytkownika na podstawie sugestii AI
w produkcie (punkt 3 wyżej) zapisuje się w stanie projektu z polem `zaproponowaneBy: "ai"` obok
zwykłych zapisów — czysto informacyjne, nie zmienia procesu zatwierdzania (wciąż wymaga zgody
użytkownika, 9.2), ale pozwala później odróżnić "user wpisał sam" od "user zaakceptował sugestię AI"
przy audycie/debugowaniu nietypowych wartości w projekcie.

## 5. Otwarte pytania dla sesji `new-app-standards`

- Czy `AiToolDefinition` (punkt 1) powinien żyć w `docs/standards/03-jadro-obliczeniowe.md` (obok
  `CalcResult`, bo to jego naturalne rozszerzenie) czy zostać w `09-ai-w-produkcie.md` — do decyzji
  tamtej sesji, nie rozstrzygane tutaj.
- Budżet/koszt (punkt 2) zazębia się z rozdziałem 12 (freemium) — czy to osobna sekcja w 09, czy
  dopisek do 12 z odnośnikiem zwrotnym z 09 — jw., do decyzji.
- Ten dokument **celowo nie odpowiada** na pytanie "jakiego dostawcy modelu/jakiej architektury
  hostingu użyć" — to decyzja produktowa per projekt, poza zakresem generycznego standardu
  architektonicznego (patrz "Zakres i granice standardu" w `README.md` `new-app-standards`).

## 6. Rejestr narzędzi AI jako architektoniczny domyślny od Etapu 1, nie dobudowywany reaktywnie

[20.09.2026] Dopisane na wyraźną prośbę właściciela projektu — ta sama logika, o którą prosił
wprost: "róbmy to od razu, nie tylko dla wielojęzyczności, ale i dla AI". Propozycja gotowego
podpunktu **9.0a**, zbudowana literalnie na wzorcu już dwukrotnie skonsolidowanym w tym standardzie
dla dwóch innych warstw — [17.1a](../standards/17-i18n.md) (wielojęzyczność) i
[5.7](../standards/05-baza-danych-offline.md) (autosave draftu formularza). Oba mają identyczny
kształt: coś zbudowane jako osobny dodatek PO fakcie, na dziesiątkach już istniejących ekranów,
skutkuje kosztowną, jednorazową kampanią retrofitu zamiast rozłożonym kosztem "buduj to razem od
razu". **To jest już trzecie niezależne wystąpienie dokładnie tego samego wzorca w tym samym
projekcie** — silniejszy sygnał niż przy dwóch poprzednich, że to nie przypadek jednej warstwy,
tylko ogólna prawidłowość dla każdej "poprzecznej" warstwy dobudowywanej do już istniejącego
kalkulatora (i18n, autosave, teraz opisy narzędzi AI — prawdopodobnie też każda kolejna warstwa tego
typu, jaką rodzina projektów doda w przyszłości).

**Dowód z tego projektu:** w chwili zgłoszenia 116 ze 117 zbudowanych kalkulatorów (`lib/core/modules/*/calculator.ts`)
nie ma żadnego zarejestrowanego narzędzia AI (`AiToolDefinition`, punkt 1 wyżej) — dokładnie ten sam
kształt zaległości, co ~90 ekranów bez autosave przed 5.7 i dziesiątki ekranów z twardo wpisanym
polskim tekstem przed 17.1a. Retrofit tych 116 kalkulatorów jest dziś planowany jako osobne,
wielosesyjne zadanie (`docs/lista-do-zrobienia.md`) — dokładnie ten sam koszt, którego 5.7/17.1a
miały zapobiec w przyszłych projektach, tyle że tym razem materializujący się dla samej warstwy AI.

**Proponowana treść reguły (do wklejenia jako 9.0a, obok 9.0 "Obowiązkowość AI w produkcie"):**

> Każdy nowy projekt rodziny zakłada od **Etapu 1** (szkielet architektury, zanim powstanie pierwszy
> ekran kalkulatora), że każdy kalkulator dostanie zarejestrowane narzędzie AI (`AiToolDefinition`,
> punkt 1 wyżej) — nigdy "AI dodamy do interfejsu później, jako osobny projekt nad już gotowymi
> ekranami". Konkretnie, od pierwszego dnia:
>
> - Szkielet ma gotowy, generyczny rejestr narzędzi (`NARZEDZIA`/`AiToolDefinition[]`) i adapter do
>   wybranego dostawcy modelu (most JSON Schema, patrz `docs/wklad-do-standardu.md`,
>   inzynier-offgrid-pro 20.09.2026) — zbudowane razem z Kernelem, nie po fakcie.
> - **Kolejność wewnątrz jednego ekranu pozostaje świadomie inna niż dla i18n**: kalkulator →
>   struktura i18n → dopiero na końcu opis narzędzia AI, bo dokładny opis (`.describe()` na polach
>   Zod, treść `description`) wymaga znajomości OSTATECZNEGO, przetestowanego kształtu
>   wejścia/wyjścia — w odróżnieniu od i18n (gdzie struktura kluczy powstaje pierwsza, bo kalkulator
>   i tak musi zwracać klucze, nie gotowy tekst, patrz 17.2), tutaj struktura rejestru powstaje
>   pierwsza (na poziomie szkieletu), ale WPIS per-kalkulator powstaje ostatni (na poziomie
>   pojedynczego ekranu). To niuans, którego nie ma w 17.1a/5.7 — obie tamte warstwy nie mają
>   odpowiednika "trzeba poczekać, aż kontrakt się ustabilizuje", więc formularz reguły 9.0a nie
>   powinien być czystym kopiuj-wklej z 17.1a bez tego zastrzeżenia.
> - `handler` każdego nowego narzędzia deleguje 1:1 do już istniejącej funkcji domenowej (9.2) —
>   nigdy nowa logika pisana specjalnie pod AI.

**Uzasadnienie:** identyczne jak 17.1a/5.7 — koszt skumulowany w jednej dużej, późniejszej kampanii
retrofitu jest wyższy niż koszt rozłożony na każdy pojedynczy ekran budowany od razu poprawnie, a
przewidywalność tego kosztu (trzeci raz z rzędu) czyni go regułą, nie przypadkiem.
