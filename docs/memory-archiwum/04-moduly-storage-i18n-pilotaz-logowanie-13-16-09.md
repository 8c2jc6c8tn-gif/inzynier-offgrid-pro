# Archiwum docs/memory.md — 04-moduly-storage-i18n-pilotaz-logowanie-13-16-09

**Przeniesiono:** 02.10.2026 (archiwizacja wg zasady z `docs/memory.md`, sekcja „Archiwizacja”) | **Źródło:** `docs/memory.md`, sekcje z linii 3284–4001 stanu sprzed archiwizacji | **Liczba sekcji:** 19
Plik jest append-only: treść pod znacznikiem to dosłowna kopia 1:1 (nic nie skrócono ani nie poprawiono). Indeks wszystkich plików archiwum: `docs/memory-archiwum/INDEKS.md`. Aktualne pułapki i decyzje w skrócie: `docs/memory.md`.

<!-- ARCHIWUM-1:1 — poniżej treść przeniesiona bez zmian z docs/memory.md, nie edytować wstecz -->

## Mapa orientacyjna

- `docs/rejestr-twardych-stopow.md` — zbiorczy indeks warunków zawsze skutkujących 🔴 (04.3), z odsyłaczami do modułu/ekranu/pliku źródłowego. Dopisz tu nowy twardy stop, gdy kolejny moduł go wprowadzi.
- `docs/normy-brakujace.md` — zbiorcza lista norm/materiałów formalnych, które są potrzebne kalkulatorom, ale których pełnej treści jeszcze nie mamy (w odróżnieniu od `docs/zrodla/`, gdzie leży to, co już mamy). Sprawdź tu, zanim zapytasz właściciela projektu "czy mamy normę X".
- `docs/standards/00-INDEKS.md` — standard wspólny dla rodziny aplikacji (17 rozdziałów), zacznij tu przy pytaniach "jak mamy to robić".
- `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_8.md` — metodologia procesowa (GOD BOOK) — jak prowadzić Biblię projektu; Część Y opisuje relację ze standardem powyżej. `PROMPT_STARTOWY.md` (root) to gotowy tekst startowy sesji wg tej metodologii.
- `docs/lista-do-zrobienia.md` — bieżące zadania, czytaj zaraz po tym pliku na starcie sesji.
- `docs/wklad-do-standardu.md` — tu AI dopisuje z własnej inicjatywy spostrzeżenia warte rozważenia dla całego `new-app-standards` (nigdy nie edytuje repo źródłowego bezpośrednio).
- `ZASADY_APLIKACJI.md` (pełna) / `USTALENIA.md` (skrót) — konstytucja Offgrid, nadrzędna wobec kodu. Pełni rolę "Biblii" tego projektu (GOD BOOK), jeszcze nie zmigrowana do jego kanonicznego nazewnictwa — patrz decyzja wyżej.
- `docs/zrodla/` — materiały źródłowe Offgrid (Biblia, treść 13 modułów, plik scalony, Zasady UX Doradcy) — przeszukiwać tu zamiast pytać użytkownika o ponowne wysłanie.
- `docs/pulpit-i-nawigacja.md` — decyzja o pulpicie adaptacyjnym (13+1 kafli, kolejność, presety onboardingu) — czytaj przed budową ekranu głównego lub menu wewnątrz modułu.
- `lib/pulpit/registry.ts` — jedyne źródło prawdy o 13 kaflach i ich ekranach; dopisz tu nowy ekran, żeby pojawił się w `/moduly/[id]`.
- `components/kafle-ikony/` — animowane SVG ikony kafli pulpitu (na razie 1–7); dopisz tu kolejny `<symbol>` + wpis w `ikona.tsx`, gdy kolejny kafel zostanie zablokowany jako finalny w artefakcie roboczym "Off-Grid Tile Set".
- `app/`, `components/ui/`, `lib/utils.ts` — obecny szkielet Next.js, bez kodu domenowego.
- `CLAUDE.md` — punkt wejścia dla AI, odsyła tutaj i do standardu.

## Moduł 5 — 7 nowych ekranów niezablokowanych (13.09.2026)

[13.09.2026] ✅ DODANO — na polecenie właściciela ("zacznijmy z tych co nic nie blokuje"): zbudowana pierwsza partia ekranów Modułu 5 zidentyfikowanych w audycie jako `todo` (nie `blocked`), buildowalnych bez wymyślania danych. Zaimplementowane: Ekran 2 (SPD), Ekran 4 (Łączenie Cu-Al), Ekran 10 (GSW), Ekran 12 (Analiza zwarciowa), Ekran 16 (Wyłączniki RCD), Ekran 28 (Dobór izolacji kabla), Ekran 29 (Pomiary powykonawcze) — pełny wzorzec plikowy każdy (input/constants/warnings/validation/calculator/testy + UI), zarejestrowane w `lib/pulpit/registry.ts` (Kafel 5) i `docs/rejestr-pokrycia.md`. `tsc --noEmit`/`pnpm test` (584/584)/`pnpm lint`/`pnpm build` — wszystkie czyste po całej partii.

**Świadomie NIE zbudowane w tej partii** (wymagają bazy komponentów albo wzoru nieobecnego w źródle, żeby nie zgadywać — pozostają `todo`, nie `blocked`): Ekran 5 (złącza MC4 — baza producentów), Ekran 9 (uziemienie — brak wzoru rezystywności gruntu w źródle), Ekran 13 (selektywność — baza krzywych wyzwalania), Ekran 18 (IMD — zależny od nierozstrzygniętego Ekranu 11, a próg "50kΩ" źródła jest wprost oznaczony jako "np.", nie normatywny), Ekran 21 (normy i certyfikaty — baza certyfikatów).

**Pułapka znaleziona i naprawiona przy Ekranie 29:** `rezystancjaUziemieniaOhm=0` i `czasZadzialaniaRcdS=0` (konwencja "0 = jeszcze nie wpisano") by pomyłkowo przeszły próg `< 10/30 Ω` i `< 0,4 s` jako fałszywy pass (0 < próg jest matematycznie prawdą). Rozwiązanie: dodane osobne ostrzeżenia `REZYSTANCJA-UZIEMIENIA-NIEZMIERZONA`/`CZAS-RCD-NIEZMIERZONY` (critical) dla wartości 0, sprawdzane przed porównaniem z progiem — nie dotyczy `rezystancjaIzolacjiMohm` (próg ">1MΩ" — 0 naturalnie i poprawnie nie przechodzi progu).

**Powtórzona pułapka typów (już znana z wcześniejszych ekranów, dwa nowe przypadki tej sesji):** `CalcResult.inputs` to `Record<string, number>` — pola string/boolean (np. `material1`/`material2` w Ekranie 4, `uzywanaJakoPrzylaczeOdbiornikow` w Ekranie 10) muszą być pominięte w `inputs`, nie tylko w logice. Złapane przez `tsc --noEmit` uruchamiane od razu po każdym `calculator.ts`, nie na końcu partii.

## Nowy materiał źródłowy — propozycja modułu "Dobór napięcia systemu Off-Grid v3.0" (13.09.2026)

[13.09.2026] ✅ DODANO, decyzja o budowie **wstrzymana na wyraźną prośbę właściciela**. Właściciel
dostarczył pełną specyfikację roboczą nowego modułu — zapisana 1:1, bez zmian, jako
`docs/zrodla/Material_Nowy_Modul_Dobor_Napiecia_Systemu_OffGrid_v3_0.md` (indeks: `docs/zrodla/README.md`).
Ustalony proces: (1) zapis jak jest [wykonane] → (2) poprawki [oczekujące] → (3) budowa modułu
[oczekujące]. **Przypisanie do numeru modułu Off-Grid NIEROZSTRZYGNIĘTE** — właściciel wprost
powiedział, że nie wie, gdzie ten moduł najlepiej pasuje; nie decydować samodzielnie.

**Do sprawdzenia na etapie poprawek (zauważone przy zapisie, nierozstrzygnięte, nie naprawiane
samodzielnie — to materiał źródłowy, nietykalny):**
- ~~Tabela C.1 "do 208 A" dla obu kolumn 12V/24V — artefakt kopiowania~~ **[13.09.2026] SPROSTOWANIE:**
  po przeliczeniu to NIE jest błąd — matematyczna koincydencja, poprawna: 2500W/12V = 5000W/24V =
  208,3A dokładnie (bo 5000=2×2500 i 24=2×12). Tabela poprawna, tylko niejasno podpisana (miesza
  "maks. prąd w danym paśmie" z "prąd na granicy poprzedniego pasma"). Mój wcześniejszy wpis w tym
  miejscu był błędny — zostawiony przekreślony, nie usunięty (Zasada 15.4/GOD BOOK "nie usuwaj —
  oznacz").
- Materiał częściowo pokrywa się tematycznie z już istniejącym ekranem `napiecie-systemowe`
  (`lib/core/modules/baterie/napiecie-systemowe/`, M4) — ten nowy materiał go znacznie
  rozszerza (kontekst zastosowania, ogrzewanie, koszty, PV, łączenie pakietów, konwersja 24V→48V).
  Do ustalenia: czy nowy moduł **zastępuje** istniejący ekran, **rozszerza** go, czy to odrębne,
  równoległe ścieżki.
- Etap C (przekroje/prądy/nagrzewanie przewodów) częściowo nakłada się z Modułem 5 (Okablowanie),
  w tym z już zbudowanym `dobor-przekroju-kabla` (M5/Ekran 1, oparty na normie PN-HD 60364-5-52) —
  wzór `P_strat = I²R` w tym materiale jest uproszczony (bez uwzględnienia normy obciążalności),
  do ustalenia czy ma być zastąpiony/uzupełniony przez istniejący silnik normatywny, czy to
  świadomie inny, uproszczony poziom analizy (edukacyjny, nie projektowy).
- Ceny/kursy walut (75,50 USD/szt., 1 USD≈4,00 PLN, ceny VEVOR) są orientacyjne i ulegną
  dezaktualizacji — moduł ma już zaplanowaną opcję "wpisania własnych cen" (punkt 13 w treści),
  co jest zgodne z zasadą "nie wymyślaj/nie zamrażaj twardych danych rynkowych w kodzie".

**[13.09.2026] USTALENIE (potwierdzone z właścicielem):** Etap C tego materiału (wzór
`P_strat=I²R`, tabela nagrzewania przewodów) **nie zostanie zaimplementowany jako nowa logika**.
Zamiast tego przyszły moduł ma wywołać (echo, nie duplikacja):
1. `calculateNapiecieSystemowe` (`lib/core/modules/baterie/napiecie-systemowe/calculator.ts`,
   M4/Ekran 2) — już liczy `I=P/V` dla 12/24/48V i rekomenduje napięcie wg mocy szczytowej. Nic
   nowego do napisania, tylko import + wywołanie z mocą szczytową wyliczoną w nowych Etapach A/B.
2. `calculateDoborPrzekrojuKabla` (`lib/core/modules/okablowanie/dobor-przekroju-kabla/calculator.ts`,
   M5/Ekran 1) — trzykrotnie (dla 12V, 24V, 48V z tą samą mocą) da realny, normatywny (PN-HD
   60364-5-52) przekrój/straty roczne/margines dla porównania — zamiast uproszczonego,
   nienormatywnego `P=I²R` z materiału.

Powód: M4 i M5 działają poprawnie i kompletnie w swoim zakresie — M4 świadomie NIE liczy
przekroju (zapisane w jego własnych `assumptions`), M5 liczy przekrój, ale wymaga 6 dodatkowych
danych wejściowych, których nie ma w M4 ani w tym materiale (długość trasy, materiał, sposób
ułożenia, temperatura otoczenia, liczba kabli w wiązce, dopuszczalny spadek napięcia%). Nowy
moduł ma dostarczyć formularz z tymi 6 polami RAZ i wywołać M5 trzykrotnie (różne V/I na wejściu)
— to jest brakujący element ("nie dograne"), nie brakująca fizyka. Zgodne z zasadą "echo zamiast
duplikowania logiki" (`docs/standards/01-architektura.md`), już stosowaną w tej sesji przy
`analiza-zwarciowa` (M5/E12, echo z `dobor-bezpiecznika-dc`).

Realnie nowa logika do napisania (nieistniejąca nigdzie): Etap A (kontekst+ogrzewanie), Etap B
(kreator odbiorników + analiza jednoczesności/długotrwałości), Etap E (3 kosztorysy), Etap F
(rozpływ prądu w łączeniu równoległym pakietów), Etap G (dobór paneli PV do falownika), Etap H
(pułapka 24V→48V, koszt przejścia).

**[13.09.2026] Zasada nadrzędna potwierdzona przez właściciela dla całego tego modułu:** gdziekolwiek
aplikacja ma już własne, precyzyjniejsze dane/kalkulator niż uproszczenie z tego materiału
źródłowego — **zawsze wygrywa istniejący kalkulator aplikacji**, materiał źródłowy traktowany jako
"pierwsze przybliżenie do zweryfikowania", nie jako ostateczna liczba. Dotyczy to już ustalonego
Etapu C (wyżej) i rozszerza się teraz jawnie na Etap G (patrz niżej).

## Poprawki do modułu "Dobór napięcia" — runda 2 (13.09.2026)

Właściciel dostarczył kartę katalogową JA Solar JAM60D41 LB (zdjęcie, zapisana jako
`docs/zrodla/karta-katalogowa-JA-Solar-JAM60D41-LB/`) i podjął decyzje po analizie z rundy 1.

**A.3 (pytanie o ogrzewanie) — USTALENIE:** moduł ma domyślnie **czytać dane o ogrzewaniu z reszty
aplikacji** (Moduł 1 lokalizacja-i-klimat i/lub Moduł 6 ogrzewanie, jeśli użytkownik je już
wypełnił), zamiast pytać od nowa. Opcja "Nie dotyczy" pozostaje zawsze ręcznie wybieralna — dla
kontekstów, gdzie ogrzewanie elektryczne budynku nie ma zastosowania (łódź, kamper, inny obiekt
bez ogrzewania). To jest kolejny przypadek wspólnego stanu wejściowego (nie tylko echo wyniku
obliczenia, jak w Etapach C/G, ale echo DANYCH WEJŚCIOWYCH między modułami) — spójne z ideą
"profilu sprzętu/obiektu użytkownika" ze standardu (`docs/standards/`). Niespójność 80 W/m² vs
zakres 100-150 W/m² w przykładzie A.3 (zgłoszona w rundzie 1) pozostaje otwarta, nie dotyczy tej
decyzji.

**B.3 (długotrwałe obciążenie) — POPRAWKA:** wiersz "Pralka (grzanie wody)" w tabeli B.3 był
błędnie oznaczony jako "Chwilowe obciążenie" mimo czasu pracy 0,5-1h, co wg własnej definicji
sekcji ("odbiorniki pracujące długotrwale = powyżej 30 minut") kwalifikuje się jako
**długotrwałe**. Poprawka do zastosowania przy budowie: Pralka klasyfikowana jako długotrwałe
(wpływ: "przewody muszą być dobrane na prąd ciągły", jak pozostałe wiersze tej tabeli), nie
chwilowe.

**B.2 (analiza jednoczesności) — ZAPROJEKTOWANY ALGORYTM** (materiał źródłowy dawał tylko
przykłady, bez reguły — poniższe jest propozycją do zaakceptowania przed kodowaniem, nie jeszcze
zaimplementowane):
1. Podział zaznaczonych odbiorników na dwie grupy: **bazowe/ciągłe** (lodówka, router, oświetlenie,
   monitoring — działają praktycznie zawsze razem, sumowane bezwarunkowo) i **przełączalne/
   wysokomocowe** (AGD, narzędzia, ogrzewanie — użytkownik włącza je świadomie, mogą, ale nie
   muszą, nakładać się w czasie).
2. `sumaWorstCase = bazowe + Σ(wszystkie zaznaczone przełączalne)` — scenariusz najgorszego
   przypadku (wszystko naraz).
3. Jeśli `sumaWorstCase ≤ mocCiagłaFalownika` → brak możliwego konfliktu, jeden komunikat "OK",
   koniec (unika sprawdzania 2^n podzbiorów, co jest niepotrzebne i nieczytelne dla użytkownika).
4. Jeśli `sumaWorstCase > mocCiagłaFalownika` → konflikt istnieje. Żeby dać użytkownikowi
   praktyczną odpowiedź (nie tylko "masz konflikt"), algorytm:
   - sortuje przełączalne malejąco wg mocy,
   - podaje `nadwyzka = sumaWorstCase - mocCiagła` i zachłannie wskazuje najmniejszy zestaw
     odbiorników (zaczynając od największego), których wyłączenie/nieuruchamianie jednocześnie
     sprowadza sumę poniżej limitu — komunikat w stylu materiału źródłowego
     ("nie uruchamiaj razem: X + Y", zamiast enumerować wszystkie kombinacje).
5. **Waga ostrzeżenia z Etapu B.3:** konflikt między dwoma odbiornikami, które OBA mają
   długotrwały czas pracy (≥30 min, po poprawce wyżej) → `critical` (realne ryzyko przegrzania
   długotrwałego). Konflikt, gdzie przynajmniej jeden jest chwilowy (np. czajnik) → `warning`
   (przejściowe obciążenie, mniejsze ryzyko, ale wciąż warte zgłoszenia).
6. Świadomie POZA zakresem (brak danych źródłowych, nie zgadywane): prąd rozruchowy/inrush
   silników i pomp — źródło podaje tylko moc znamionową, nie prąd rozruchowy, więc nie jest on
   uwzględniany.

**E.4 pkt 1 ("6× więcej miedzi przy 12V") — USUNIĘTE, zastąpione echem z M5.** Sprawdzone: to
twierdzenie nie ma podanego wzoru i po przeliczeniu wygląda na nieprecyzyjne — przy stałym %
dopuszczalnego spadku napięcia wymagany przekrój skaluje się jak 1/V² (bo `%spadek = I×ρ×2L /
(A×V)`, a `I=P/V`, więc `A ∝ P×ρ×2L/(V²×próg%)`) — przejście z 48V na 12V (÷4 napięcia) dawałoby
**~16×** większy przekrój, nie 6×. Ale **ta liczba "16×" TEŻ jest tylko moim ręcznym przeliczeniem
pod jednym konkretnym kryterium (spadek napięcia) — nie jest to wartość do wpisania do kodu.**
Zgodnie z zasadą nadrzędną (wyżej): moduł ma pokazywać **realne wartości z echa
`calculateDoborPrzekrojuKabla`** (M5) dla 12V/24V/48V przy tej samej mocy/długości trasy — ten
kalkulator **już liczy** `przekrojMm2` (rzeczywisty, normatywny) ORAZ `strataRocznaKwh` (roczna
strata energii w kablu, patrz `calculator.ts` M5/Ekran1) — czyli dokładnie to porównanie "o ile
mniejszy spadek napięcia/strata", o które pytał właściciel, **już istnieje gotowe w kodzie**, nic
nowego nie trzeba liczyć. Nowy moduł ma pokazać te trzy wyniki obok siebie (12V/24V/48V), nie
żadną wymyśloną wielokrotność.

**G.1 (brakujące parametry elektryczne panelu) — ROZWIĄZANE.** Karta katalogowa JA Solar
JAM60D41-500/LB (dostarczona, `docs/zrodla/karta-katalogowa-JA-Solar-JAM60D41-LB/00-INDEKS.md`)
daje realne wartości: Voc=43,85V, Vmp=36,91V, Isc=14,42A, Imp=13,55A, β(Voc)=−0,250%/°C. Te
zastępują przybliżenie "Voc~50V" z materiału. **Przeliczenie kontrolne** (wzór z
`stress-test-mppt`, założenie Tmin=−25°C spójne z resztą aplikacji): napięcie stringu w mrozie na
panel = 43,85×(1+(−0,0025)×(−25−25)) = **49,33V** (blisko przybliżenia "50V" materiału, więc
wnioski jakościowe Etapu G się nie zmieniają, ale teraz są policzone z realnych danych, nie
zgadywane):
- Model 2 (24V, 8 paneli w szeregu, limit MPPT 500V): string w mrozie = 394,7V → margines 21,1%
  do limitu. STC: 295,3V (w oknie MPPT), moc = 4000W (zgodne z materiałem).
- Model 3 (48V, 2×4, limit MPPT 145V): string w mrozie = 98,7V → margines 32,0% do limitu. STC:
  73,8V (w oknie MPPT), moc = 4000W (zgodne z materiałem).

Wniosek: konfiguracje z materiału (8 szeregowo dla Modelu 2, 2×4 dla Modelu 3) **potwierdzone**
jako bezpieczne, teraz z policzonym realnym marginesem zamiast przybliżenia. Przy budowie: te
wartości mają wejść jako `vocStcV`/`vmpStcV`/`impA`/`betaPctNaC` do echa
`calculateStressTestMppt`/`calculateDopasowanieTablicyFalownika` (M3), nie jako nowa logika w tym
module. Otwarte i nierozwiązane: brak analogicznej karty katalogowej dla 3 falowników VEVOR
(potrzebne realne okna MPPT/prądy do pełnej weryfikacji, dziś tylko z materiału źródłowego).

## Poprawki do modułu "Dobór napięcia" — runda 3: C.3 rozstrzygnięte (13.09.2026)

**C.3 (spadek napięcia 100A/25mm²/3m) — właściciel wybrał opcję A.** Liczba w materiale
("~1,2V, 10% napięcia systemu") zastąpiona rzeczywistym wynikiem tego samego wzoru, którego
materiał używa w C.2 (`R=ρ×2×L/A`, ρ=0,0172):

R = 0,0172×2×3/25 = 0,00413 Ω → U = 100A×0,00413Ω = **0,41V (3,4% z 12V)**, nie 1,2V/10%.

Do zastosowania przy budowie tego fragmentu (Etap C.3, akapit "Ostrzeżenie: Prąd 100A przy 12V"):
zdanie "Spadki napięcia: Przy 100A i przewodzie 25mm² o długości 3m spadek napięcia wynosi ~1,2V
(10% napięcia systemu!)" zamienić na "...spadek napięcia wynosi ~0,41V (3,4% napięcia systemu)".
Reszta akapitu (prąd spawalniczy, nagrzewanie złączek, ryzyko pożaru przy wibracjach) zostaje bez
zmian — to jedyna liczba w C.3 niezgodna z własnym wzorem dokumentu, pozostałe trzy argumenty
ostrzeżenia są poprawne i nie wymagają korekty. Ogólny wniosek akapitu (100A@12V jest niebezpieczne)
pozostaje prawdziwy — opiera się głównie na ryzyku łuku elektrycznego i nagrzewania złączek, nie na
samym spadku napięcia.

**Status pozostałych otwartych punktów z rundy 1:** niespójność 80 W/m² vs 100–150 W/m² w
przykładzie A.3 oraz miejsce/numer modułu w strukturze aplikacji — wciąż nierozstrzygnięte, czekają
na kolejną rundę.

## Poprawki do modułu "Dobór napięcia" — runda 4: A.3 rozstrzygnięte (13.09.2026)

**A.3 (niespójność 80 W/m² vs zakres 100–150 W/m²) — WYKREŚLONE, nie poprawione liczbowo.**
Sprawdzone: w aplikacji **nie istnieje dziś żaden kalkulator liczący moc szczytową ogrzewania z
powierzchni budynku** — Moduł 6 (`lib/core/modules/ogrzewanie/kociol-elektryczny/` i inne) bierze
`zapotrzebowanieCieplneKwh` jako gotowy input, nie liczy go z m²/typu izolacji. Skoro (decyzja z
rundy 2) A.3 ma czytać moc ogrzewania z danych już wpisanych w aplikacji (M2/Ekran 1
`systemy-podtrzymania-zycia`, pole "ogrzewanie" — patrz wątek w tym pliku o luce źródłowej dla tej
kategorii) albo z "Nie dotyczy", to **worked example materiału (100m²×80W/m²=8000W→667A/333A/167A)
nigdy nie stanie się żywą kalkulacją w kodzie** — jest to czysto ilustracyjne ręczne szacowanie,
zdegradowane do roli fallbacku.

**Decyzja:** ten konkretny przykład (i jego niespójna liczba 80 W/m²) **nie jest odtwarzany** przy
budowie modułu. Sama tabela kategorii ogrzewania z Etapu A.3 (zakresy W/m², nie punktowe liczby)
zostaje zachowana wyłącznie jako pomocniczy fallback do ręcznego wpisania mocy, gdy użytkownik nie
ma jeszcze żadnych danych w M2/M6 — jako zakresy (nie konkretne liczby) nie są wewnętrznie
sprzeczne, więc nie wymagają korekty.

**Etap A.3 uznany za w pełni rozstrzygnięty.** Jedyny pozostały otwarty punkt z całej rundy 1-4
poprawek: **miejsce/numer modułu w strukturze 13 modułów aplikacji** (patrz wątek "Nowy materiał
źródłowy" wyżej — właściciel wprost nie wie, gdzie to ma trafić).

## Miejsce modułu "Dobór napięcia" — ROZSTRZYGNIĘTE (13.09.2026)

**Decyzja (propozycja AI, zaakceptowana przez właściciela):** ten materiał **NIE** staje się
nowym, 14. modułem. Zamiast tego **rozbudowuje istniejący Ekran 2 Modułu 4** (Magazyn energii/
baterie) — `lib/core/modules/baterie/napiecie-systemowe/` — z dzisiejszego jednopolowego `I=P/V`
do pełnego Wzorca D "Doradca doboru napięcia".

**Uzasadnienie:**
1. Ekran 2 M4 już jest dokładnie tym samym pytaniem ("jakie napięcie systemu") — to rozbudowa
   istniejącego slotu, nie nowy temat.
2. Wybór napięcia systemu jest z natury decyzją architektury bateryjnej/DC (BMS, falownik,
   topologia) — to charter M4, nie M2 (obciążenia)/M3 (PV)/M5 (okablowanie), które dostarczają
   dane wejściowe przez echo, ale nie są miejscem samej decyzji.
3. M4 ma już sąsiadujące, pokrewne ekrany: `mixing-rownolegle` (blisko nowego Etapu F — rozpływ
   prądu przy łączeniu równoległym pakietów) i `oplacalnosc-magazynu` (blisko Etapu E, kosztorysy).
4. Odrzucony 14. moduł — struktura 13 modułów jest już wpisana wszędzie (`lib/pulpit/registry.ts`,
   `docs/rejestr-pokrycia.md`, GOD BOOK, nawigacja `/moduly/[id]`); dodanie kolejnego modułu dla
   jednego (choć dużego) ekranu byłoby nieproporcjonalną zmianą strukturalną wobec gotowego,
   pasującego slotu.

**Docelowy kształt ekranu** (do budowy w kolejnym kroku, poza zakresem tej sesji poprawek):
sekcje kontekstu (Etap A, echo z M1 lokalizacja-i-klimat / M2 systemy-podtrzymania-zycia dla
ogrzewania), kreator odbiorników + analiza jednoczesności (Etap B, nowa logika wg zaprojektowanego
algorytmu wyżej), rekomendacja napięcia (dotychczasowe `I=P/V`, zachowane bez zmian), echo realnego
przekroju kabla i strat rocznych z `dobor-przekroju-kabla` (Etap C→M5, dla 12V/24V/48V), kosztorysy
(Etap E, nowa logika z cenami edytowalnymi przez użytkownika), ostrzeżenie o łączeniu pakietów
(Etap F, blisko `mixing-rownolegle`), echo doboru PV z `stress-test-mppt`/`dopasowanie-tablicy-falownika`
(Etap G→M3, z realnymi Voc/Vmp/Imp/β z karty katalogowej), pułapka konwersji 24V→48V (Etap H, nowa
logika). Wersja kalkulatora rośnie (np. 2.0.0), stara logia `I=P/V` nie jest usuwana, tylko
osadzona w większym ekranie.

**Wszystkie 4 rundy poprawek do tego materiału są teraz zamknięte.** Kolejny krok to budowa —
osobne zadanie, nie część tej sesji poprawek.

## Budowa modułu "Dobór napięcia" — zakończona (14.09.2026)

Ekran `napiecie-systemowe` (M4/Ekran 2) rozbudowany do wersji 2.0.0 zgodnie z planem wyżej. Rdzeń
`I=P/V` (progi, formuła) **niezmieniony** — wszystkie 8 dawnych testów przechodzi bez modyfikacji
logiki. Nowe pliki w module: `jednoczesnosc.ts` (Etap B.2/B.3), `kosztorys.ts` (Etap E + H.4).
25 testów jednostkowych, wszystkie zweryfikowane ręcznie względem przykładów/tabel źródła.

**Odstępstwo od planu — Etap D świadomie pominięty.** Plan wyżej ("docelowy kształt ekranu") nie
wymieniał Etapu D (rekomendacja oświetlenia 24V vs 230V vs 48V, gniazda DC) — sprawdzone: to
czysto informacyjne tabele źródła, bez żadnego wzoru, więc pominięcie nie jest luką liczącą, tylko
brakiem osobnej sekcji UI. Nie dodane w tej turze (zgodnie z literalnym zakresem planu), do
ewentualnego dopisania jako czysto informacyjna sekcja w przyszłości, bez wpływu na kalkulator.

**Znaleziony i naprawiony błąd w trakcie budowy: liczba ogniw szeregowo ≠ V/3,2V.** Pierwsza wersja
`kosztorys.ts` liczyła `liczbaOgniwSzeregowo = napiecieV / 3.2` (np. 12/3.2=3.75 — niecałkowita,
fizycznie bez sensu). Poprawne: pakiet "12V" LiFePO4 to etykieta handlowa dla 4S (4×3,2V=12,8V
nominalnie), "24V"→8S, "48V"→16S — 1:1 ze źródła (Sekcja E). Naprawione tabelą `{12:4, 24:8, 48:16}`,
wykryte przez test jednostkowy (oczekiwane 16 ogniw dla 16kWh@12V, otrzymane 18,75 — niecałkowita
wartość natychmiast zdradziła błąd). Po poprawce kosztorys 16kWh odtwarza dokładnie tabelę E.3
źródła: 6332/6582/7162 zł (12V/24V/48V, bez przetwornic).

**Znaleziony i naprawiony błąd UI: kolizja klucza React w zbiorczej liście ostrzeżeń.** Ostrzeżenia
z echa `dobor-przekroju-kabla` dla 12V/24V/48V (Etap C) były dołączane do wspólnej listy
`result.warnings`, renderowanej przez `WynikSzczegoly` z `key={w.code}` — gdy DWA napięcia dają to
samo ostrzeżenie (np. `BRAK-PASUJACEGO-PRZEKROJU` przy bardzo dużej mocy i 12V ORAZ 24V naraz),
React dostawał duplikat klucza (wykryte na żywo przez Playwright: `[console] Encountered two
children with the same key`). Naprawione przez tagowanie kodu napięciem przed dołączeniem do
zbiorczej listy (`${w.code}-${v}V`) w `calculator.ts` — ostrzeżenia wewnątrz panelu Etapu C (per
napięcie) zachowały oryginalny kod. Ponowny smoke test: `NO CONSOLE/PAGE ERRORS`.

**Realny, pouczający wynik silnika normatywnego (nie błąd):** przy dużej mocy (np. 4615W) i 12V/24V
Etap C poprawnie zwraca "brak pasującego przekroju" (żaden z dostępnych standardowych przekrojów
do 35mm² nie udźwignie 385A/192A) — dokładnie demonstrując problem, przed którym cały ten ekran ma
ostrzegać, tym razem policzony z prawdziwej normy (PN-HD 60364-5-52), nie z uproszczonego `P=I²R`
materiału źródłowego.

**Weryfikacja końcowa:** `npx tsc --noEmit` czyste, `npx vitest run` 658/658 (105 plików), `pnpm
lint` czyste (2 niepowiązane wcześniejsze ostrzeżenia `<img>`), `pnpm build` bez błędów, smoke test
Playwright (formularz wypełniony przez wszystkie Etapy A-H, brak duplikatów DOM id, brak błędów
konsoli, wartości zgodne z ręcznymi przeliczeniami: kosztorys 6332/6582/7162 zł@16kWh, PV
4000Wp/DC-AC=1.33 dla modelu 24V/8 paneli, koszt konwersji 2250 zł). `docs/rejestr-pokrycia.md`
(M4/Ekran2) i `lib/pulpit/registry.ts` (etykieta kafla) zaktualizowane.

## Moduł 5 — druga partia niezablokowanych ekranów (13.09.2026)

[13.09.2026] ✅ DODANO — kontynuacja pracy nad Modułem 5 po przerwie na poprawki innego materiału.
Zbudowana kolejna partia 7 ekranów zidentyfikowanych jako buildowalne bez zgadywania danych:
Ekran 3 (tylko dolna sekcja — checklist momentów dokręcania szyn zbiorczych; górna sekcja dobór
przekroju szyny wg wytrzymałości zwarciowej pozostaje `todo`, brak wzoru w źródle), Ekran 7 (dobór
mocy falownika), Ekran 11 (uziemienie funkcjonalne vs ochronne), Ekran 14 (wyłączniki nadprądowe
DC), Ekran 15 (ochrona przed odwrotną polaryzacją), Ekran 20 (oznakowanie obwodów), Ekran 26
(optymalizacja trasy i kosztu kabla). Pełny wzorzec plikowy każdy, zarejestrowane w
`lib/pulpit/registry.ts` i `docs/rejestr-pokrycia.md`. `tsc --noEmit`/`pnpm test` (616/616)/
`pnpm lint`/`pnpm build` — czyste.

**Odkrycie przy Ekranie 20 (Oznakowanie obwodów):** treść źródłowa tego ekranu wspomina
kolorystykę żył ("czerwony +", "żółto-zielony PE" itd.) jako rzekomo "wg PN-EN 60445" — **to
nieprawda**. Sprawdzone bezpośrednio w `docs/zrodla/norma-PN-EN-60445/00-INDEKS.md`: ta norma
normuje WYŁĄCZNIE kody alfanumeryczne/graficzne (Tabela 1: +, −, PE, U/V/W, N...), nie kolorystykę
— tę normuje osobna norma (IEC 60446), której nie mamy w projekcie. Zbudowano tylko część
faktycznie potwierdzoną (kody alfanumeryczne), kolorystyka świadomie pominięta z jawną notatką w
kodzie i UI — nie przypisano normie treści, której nie zawiera.

**Pułapka znaleziona i naprawiona przy Ekranie 26 (Optymalizacja trasy i kosztu kabla) —
zweryfikowana w przeglądarce, nie tylko w testach jednostkowych:**
1. Dwa pola `Pole` o identycznym tekście etykiety ("Długość trasy" w Trasie A i B) generowały
   duplikat `id` (auto-generowany z tekstu etykiety w `components/ui/pole.tsx`), co łamało
   powiązanie `label`/`input` dla drugiego wystąpienia — złapane przez Playwright (`getByLabel`
   nie widział drugiego pola), nie przez `tsc`/testy jednostkowe. Naprawione: jawne unikalne `id`
   na każdym polu w sekcjach Trasa A/Trasa B. **Wniosek procesowy:** gdy ekran ma dwa powtórzone
   bloki pól o tej samej etykiecie (porównanie A/B, warianty), zawsze nadawać jawne `id` — nie
   polegać na auto-generowaniu z etykiety.
2. Realny błąd logiczny (nie tylko UI): gdy trasa nie spełnia wymagań przekroju, echo
   `calculateDoborPrzekrojuKabla` celowo zwraca `strataRocznaKwh=0` dla tej trasy (nie liczy
   straty dla niezgodnego przekroju — patrz kod M5/E1, tryb "sprawdź mój przekrój"). Pierwsza
   wersja kalkulatora TCO tego nie uwzględniała i pokazywała niezgodną trasę jako fałszywie
   "tańszą" (bo miała 0 kWh/rok straty). Naprawione: TCO NIE jest liczony/pokazywany, dopóki OBIE
   trasy nie spełniają wymagań przekroju — tylko krytyczne ostrzeżenie wskazujące, którą trasę
   poprawić. Znalezione dopiero przy ręcznym teście w przeglądarce z realnymi liczbami, nie przy
   pisaniu testów jednostkowych (które testowały tylko "zgodny" scenariusz) — potwierdza zasadę
   "kompiluje się ≠ działa" z `docs/standards/10-testy.md`.

**Nadal `todo` w Module 5** (świadomie odłożone — wymagają bazy komponentów/wzoru nieobecnego w
źródle): Ekran 5 (MC4), Ekran 8 (przepust powietrza — tylko jeden punkt danych "szczelina<5cm→70°C",
brak wzoru wiążącego szczelinę z temperaturą), Ekran 9 (uziemienie), Ekran 13 (selektywność), Ekran
17 (ochrona przed dotykiem — treść statyczna, niezbudowana w tej rundzie), Ekran 18 (IMD), Ekran 21
(normy i certyfikaty), Ekran 23 (separacja EMC), Ekran 24 (peszle/koryta/rurki), Ekran 25 (ochrona
przed gryzoniami), Ekran 27 (puszki połączeniowe) — te ostatnie 5 (17, 23–25, 27) są buildowalne
jako proste Wzorce B/C/F (treść porównawcza/referencyjna, dane konkretne w źródle), po prostu
jeszcze nie zbudowane w tej rundzie, nie zablokowane merytorycznie.

## Moduł 5 — trzecia partia: ostatnie 5 niezablokowanych ekranów (13.09.2026)

[13.09.2026] ✅ DODANO — dokończenie prostych Wzorców B/C/F zidentyfikowanych w poprzednim wpisie
jako buildowalne. Zbudowane: Ekran 17 (ochrona przed dotykiem — checklist 2 mechanizmów, źródło
nie podaje twardego stopu dla tego ekranu; "lista IP wg miejsca" NIE zbudowana — brak tabeli
miejsce→IP w treści TEGO ekranu, w odróżnieniu od Ekranu 27), Ekran 23 (separacja EMC — Wzorzec F
bez kalkulatora, jak Ekran 19: treść + ilustracja SVG), Ekran 24 (peszle/koryta/rurki — Wzorzec B,
dopasowanie miejsca montażu do 1 z 4 osłon), Ekran 25 (ochrona przed gryzoniami — "auto z Modułu 1"
zastąpione ręcznym wyborem poziomu ryzyka, M1 nie ma pola "typ terenu"), Ekran 27 (puszki
połączeniowe — Wzorzec B wg lokalizacji; "auto-lista punktów z Ekranu 19" NIE zbudowana, Ekran 19
nie ma modelu danych tras). `tsc --noEmit`/`pnpm test` (631/631)/`pnpm lint`/`pnpm build` — czyste,
zweryfikowane w przeglądarce (Playwright) w tym sprawdzenie duplikatów DOM `id` na każdej stronie
(nauczka z poprzedniej partii, Ekran 26).

**To zamyka wszystkie merytorycznie niezablokowane ekrany Modułu 5.** Pozostałe `todo` (6 ekranów:
5 MC4, 8 przepust powietrza, 9 uziemienie, 13 selektywność, 18 IMD, 21 normy/certyfikaty) wymagają
bazy komponentów albo wzoru nieobecnego w źródle — pozostają świadomie odłożone, nie przeoczone.
Moduł 5: 23 z 29 ekranów **done** (79%).

## B5 (Moduł 11) i M4/Ekran 25 — echo doboru kabli, nowa fizyka podziału prądu (14.09.2026)

[14.09.2026] ✅ DODANO — dwa dawno zidentyfikowane "gotowe do echa" ekrany, wreszcie zbudowane.

**B5 (Moduł 11, Ścieżka B — kwasowo-ołowiowa) "Dobór kabli, bezpieczników i zabezpieczeń":**
`lib/core/modules/montaz-baterii/dobor-kabli-bezpiecznikow-olow/`, 5 testów. Źródło jest
jednoznaczne: *"Dobór kabla nie zależy od chemii baterii, tylko od prądu i długości — ten sam
silnik obliczeniowy co w Module 5, tylko podstawiasz inne liczby."* Zaimplementowane jako czyste
echo dwóch gotowych kalkulatorów: `calculateDoborPrzekrojuKabla` (M5/Ekran 1) dla przekroju,
`calculateDoborBezpiecznikaRozlacznika` (M5/Ekran 6) dla bezpiecznika+AIC — zero nowej logiki
liczącej. Status łączny propagowany funkcją `najgorszyStatus` (ten sam wzorzec co w
`optymalizacja-trasy-kabla`, M5/Ekran 26).

**M4/Ekran 25 "Szyny zbiorcze i połączenia międzypakietowe":** `lib/core/modules/baterie/szyny-zbiorcze-miedzypakietowe/`,
5 testów. Wcześniej oznaczone jako wymagające "dodatkowej logiki ponad echo" — sekcja C źródła
daje tylko ilustracyjne przykłady (spadek "20%", "40% vs 15%") bez wzoru. Rozstrzygnięcie:
problem N gałęzi równoległych do wspólnego węzła ma dobrze znane, **niewymyślone** rozwiązanie —
regułę podziału prądu z prawa Ohma (prąd dzieli się odwrotnie proporcjonalnie do rezystancji
gałęzi), z rezystancją liczoną identycznym wzorem co M5/Ekran 1 (R=ρ×2L/A). Podwójna weryfikacja
ręczna w teście: 2 gałęzie z R_B=3×R_A dają dokładnie 75%/25% (bo I_A/I_total=R_B/(R_A+R_B)=3/4).

**Świadome ograniczenie zakresu M4/E25 (udokumentowane w kodzie, nie ukryte):** model obejmuje
TYLKO topologię gwiazda (każda gałąź niezależnym odcinkiem do wspólnego węzła/szyny). NIE
obejmuje: (a) połączenia kaskadowego — rezystancja sumuje się wzdłuż łańcucha, inna topologia
obwodu (drugi przykład źródła, "4 baterie kaskadowo"); (b) asymetrii punktu zasilania wzdłuż
JEDNEJ szyny zbiorczej — rozłożona rezystancja wzdłuż szyny, inny model niż N niezależnych gałęzi
(pierwszy przykład źródła, "ogniwo #1 vs #8, przesuń kabel na środek szyny"). Obie te topologie
wymagałyby osobnego modelu sieciowego (nie prostego podzielnika prądu) — świadomie nie zbudowane,
nie zgadywane. Żaden próg "niebezpiecznego" % odchylenia nie został wymyślony — źródło nie podaje
takiego progu (oba przykłady są ilustracyjne), więc kalkulator pokazuje policzone odchylenie
wprost, bez etykiety "bezpieczne/niebezpieczne".

`tsc --noEmit`/`pnpm test` (641/641)/`pnpm lint`/`pnpm build` — czyste. Zweryfikowane w
przeglądarce (Playwright), w tym sprawdzenie duplikatów DOM `id` (formularz M4/E25 ma dynamiczną
listę gałęzi z jawnymi unikalnymi `id` per gałąź — nauczka z Ekranu 26 zastosowana od razu przy
projektowaniu, nie znaleziona post factum).

## Dobudowa Etapu D w module "Dobór napięcia" (14.09.2026)

Na wyraźną prośbę autora dobudowany pominięty wcześniej Etap D (patrz sekcja "Budowa modułu
'Dobór napięcia' — zakończona" wyżej, akapit "Odstępstwo od planu"). Przeczytany pełny materiał
źródłowy (`docs/zrodla/Material_Nowy_Modul_Dobor_Napiecia_Systemu_OffGrid_v3_0.md`, linie 231-277):
D.1 (porównanie LED 230V/24V/48V + zalecenie) i D.2 (dedykowane gniazda DC dla elektroniki:
router/TV/laptop/telefon/radio).

**Ustalone przed implementacją:** numeryczny rdzeń D.1 (koszt przetwornic DC-DC 48V→24V dla linii
oświetlenia) już liczy się w Etapie E (`kosztorys.ts`, pola `liczbaLiniiOswietlenia24vPrzySystemie48v`/
`cenaPrzetwornicyDcDcZl`, zbudowane wcześniej) — więc Etap D nie potrzebuje nowej logiki
obliczeniowej ani nowego kalkulatora, tylko czysto informacyjnej treści (ten sam wzorzec co już
zbudowany Etap F: statyczne tabele + tekst, bez `calculator.ts`).

Dodane: `POROWNANIE_OSWIETLENIA_LED`, `ZALECENIE_OSWIETLENIA_LED`, `KATALOG_URZADZEN_DC`,
`ZALETA_GNIAZD_DC` w `constants.ts` (dane 1:1 ze źródła) + nowa sekcja `<details>` "Etap D" w
`app/kalkulatory/napiecie-systemowe/page.tsx`, umieszczona między Etapem C a Etapem E (kolejność
źródła). Brak zmian w `calculator.ts`/`input.ts`/testach — CALCULATOR_VERSION pozostaje 2.0.0
(treść informacyjna, nie logika).

Zweryfikowane: `tsc --noEmit` czyste, `vitest run` 658/658 (bez zmian — brak nowej logiki do
testowania), `pnpm lint` czyste (te same 2 niepowiązane ostrzeżenia `<img>`), `pnpm build` bez
błędów, smoke test Playwright (sekcja Etap D otwarta i odczytana — pełna treść D.1/D.2 renderuje
się poprawnie, brak duplikatów DOM `id`, brak błędów konsoli). `docs/rejestr-pokrycia.md`
(M4/Ekran2) zaktualizowany — usunięta wzmianka o świadomym pominięciu Etapu D, zastąpiona opisem
dobudowy.

## Nowa reguła standardu: Ekrany pochodne i Kreator Pro (14.09.2026)

Podczas projektowania (jeszcze roboczego, nieopublikowanego) modułu "Oświetlenie LED"
(`docs/zrodla/Opracowanie_Tasmy_LED_Oswietlenie_DC_DRAFT.md`, Sekcja 15) autor doprowadził w
dyskusji do nowej, ogólnej reguły nawigacyjnej — zapisanej jako `docs/standards/08-ui-ux.md`
§8.11, nie tylko w szkicu tego jednego modułu, bo **ma być zastosowana retroaktywnie w całej
aplikacji** (wyraźna prośba autora — "musimy przejść przez całą apkę i wnieść takie same
poprawki").

**Reguła w skrócie:** w obrębie jednego modułu rozróżniamy trzy role ekranu, nigdy nie mieszane w
jeden: (1) **artykuł referencyjny** (Wzorzec C, samodzielny, edukacyjny) — nie wplatany między
kroki Doradcy; (2) **ekran pochodny** — cienka nakładka na już istniejącą funkcję kalkulatora
(echo, zero nowej logiki), zawężony/nazwany kontekst, jeden konkretny wynik zamiast pełnego
drzewa opcji, motywowany zarówno prowadzeniem początkującego za rękę jak i postrzeganą wartością
aplikacji (użytkownik ocenia po tym, co widzi jako osobne kafelki, nie po tym, co ukryte wewnątrz
jednego złożonego ekranu); (3) **Kreator Pro** — pełny, multi-ścieżkowy wariant Wzorca D/A, jako
świadomie wybierana opcja dla zaawansowanego użytkownika, nie domyślny punkt wejścia (to ten sam
podział co istniejące już §8.5 Tryb prosty/zaawansowany, tylko zrealizowany jako osobny ekran
zamiast przełącznika).

Decyzja **które konkretnie** ekrany pochodne wydzielić z Kreatora Pro zapada osobno w każdym
module (kryterium: da się odpowiedzieć jednym wywołaniem istniejącej funkcji na pojedyncze,
nazwane pytanie początkującego) — nie jest to sztywna, odgórna lista.

**Konsekwencja praktyczna, jeszcze nie wykonana:** autor zlecił przegląd **całej** istniejącej
aplikacji pod kątem tej reguły — czy któryś z 13 istniejących modułów ma dziś ekran, który w
jednym miejscu miesza artykuł/edukację z krokami Doradcy, albo który powinien dostać ekrany
pochodne dla typowych, nazwanych pytań początkujących. To osobne, jeszcze nierozpoczęte zadanie
(wymaga przejścia modułu po module) — nie mylić z samym zapisaniem reguły w standardzie, co
zostało wykonane teraz.

## Opracowanie "Oświetlenie LED" — wstrzymane na jednym punkcie (14.09.2026)

Szkic `docs/zrodla/Opracowanie_Tasmy_LED_Oswietlenie_DC_DRAFT.md` (15 sekcji, ~1280 linii) jest
merytorycznie kompletny i czeka na finalną akceptację autora przed Krokiem 2 (dodanie do Biblii).
**Jedyny blokujący punkt:** `R_taśmy_na_metr` (Sekcja 8.2) wymaga karty katalogowej konkretnego
producenta TAŚM (nie zasilaczy — to inna firma, pomyłka z wcześniejszej tury poprawiona w
dokumencie). Autor świadomie nie przekazał jeszcze tej karty w tej turze i przechodzi do innych
zadań — **nie proponować samodzielnie wartości `R_taśmy_na_metr` ani nie zamykać opracowania bez
tego dokumentu**, tylko czekać, aż autor go dostarczy. Wszystko inne w dokumencie (rodzaje taśm,
oznaczenia, żywotność, biel/RGBW, CCT, RGB/RGBIC, SMD/COB/FCOB, algorytm spadku napięcia, dobór
zasilacza — zapas mocy zamknięty na regule 80%, złącza, weryfikacja po zakupie, sterowanie,
struktura nawigacji "Oświetlenie"→LED z artykułami/ekranami pochodnymi/Kreatorem Pro/hubem
Hand-Made) jest gotowe i nie wymaga dalszej pracy do czasu tej jednej karty katalogowej.

Przy okazji tego opracowania powstała też nowa, ogólna reguła standardu — **Ekrany pochodne i
Kreator Pro** (`docs/standards/08-ui-ux.md` §8.11, zgłoszona równolegle do `new-app-standards` w
`docs/wklad-do-standardu.md`) — oraz trzy zgłoszenia do `new-app-standards`: rozbudowa AI (gotowa
do konsolidacji), i szkielety logowania/wielojęzyczności (świadomie niedokończone, autor robi
`zero-waste` osobno — nie ruszać tych dwóch plików w `docs/propozycje-do-new-app-standards/` do
czasu wyraźnej prośby).

## M4/Ekran2 (Dobór napięcia systemowego) — poprawki Etapu B + usunięcie Etapów D/F/G (14.09.2026)

Pierwsze zastosowanie §8.11 w praktyce, znalezione podczas przeglądu app-wide zainicjowanego przez
autora ("jaka to funkcja, a ja sprawdzę w apce"). Autor zgłosił trzy niezależne rzeczy:

1. **Błąd Etapu B (kreator odbiorników):** pola moc/czas miały `disabled={!stan.selected}` — nie
   dało się w nie wpisać wartości, dopóki nie zaznaczono checkboxa. Naprawione (usunięte
   `disabled`), plus dwa dodatkowe usprawnienia zgłoszone razem: układ wiersza przebudowany, żeby
   pola moc/czas/jednostka trzymały się jednej linii (`flex-nowrap`) niezależnie od szerokości
   ekranu, i dodany wybór jednostki czasu min/godz. z konwersją przy przełączaniu (żeby nie trzeba
   było przeliczać "16 godzin" na minuty w głowie). PR #87.
2. **Analiza strukturalna na żądanie autora** ("do czego ten rozdział ma służyć, jakie pytanie ma
   odpowiadać, jakie funkcje tam wylądowały"): pytanie ekranu to "jakie napięcie systemowe (12/24/
   48V) wybrać". Etapy A/B/C/E/H odpowiadają na to pytanie (kontekst, dane wejściowe, argument
   kosztu kabla, argument kosztu całości, pułapka konwersji). **Etapy D/F/G nie odpowiadały** —
   przykleiły się przy kolejnych rundach rozbudowy bez sprawdzenia dopasowania do tematu ekranu.
3. **Decyzja autora (potwierdzona wprost):** "F i G mają się nijak do tego rozdziału, nic tu nie
   wnoszą oprócz zamętu. Etap D do oświetlenia." Wykonane: Etap D (porównanie LED 24/48/230V,
   katalog gniazd DC) usunięty z UI, dane zachowane w `constants.ts` (oznaczone komentarzem) do
   przeniesienia do przyszłego modułu "Oświetlenie" (jeszcze nie zbudowanego — nie usuwać przy
   porządkach dead-code). Etap F (link do `szyny-zbiorcze-miedzypakietowe`) i Etap G (dobór PV do
   falowników VEVOR, dane `FALOWNIKI_VEVOR`/`PANEL_JA_SOLAR_500W`) **usunięte całkowicie** z kodu
   (nie tylko z UI) — sprawdzone grepem, że te dane nie są używane nigdzie indziej w repo.
   `CALCULATOR_VERSION` 2.0.0→2.1.0. Testy: 25→22 (usunięte 3 testy Etapu G), `tsc`/`vitest`/
   `lint`/`build` czyste. `docs/rejestr-pokrycia.md` zaktualizowany.

**Lekcja procesowa dla dalszego przeglądu app-wide (§8.11):** kandydaci "mega-Doradca" mogą mieć
nie tylko problem "za dużo w jednym ekranie" (rozwiązanie: ekrany pochodne/Kreator Pro), ale też
**etapy, które nie należą do tematu ekranu wcale** (rozwiązanie: usunięcie/przeniesienie, nie
rozbicie). Sprawdzać oba pytania przy każdym kolejnym kandydacie (M5/Ekran1, M3/Ekran14), nie tylko
"czy jest za duży".

## Pierwsza realna implementacja `StorageAdapter` — autozapis Seed formularza (15.09.2026)

**Zgłoszenie autora:** "strona się sama przeładowywała" na telefonie i po przeładowaniu wszystkie
wpisane dane (Etap A-H, `napiecie-systemowe`) trzeba wpisywać od nowa. Diagnoza: nie jest to błąd
tego ekranu — żaden kalkulator w apce nie zapisywał Seed-u formularza, `lib/adapters/storage-adapter.ts`
miał od początku (świadomie, patrz komentarz w pliku) tylko kontrakt, bez implementacji, do czasu
"pierwszej realnej funkcji zapisu". Samo przeładowanie karty na telefonie to prawdopodobnie
zachowanie przeglądarki mobilnej pod presją pamięci (odświeżenie karty w tle) — nie do naprawienia
w kodzie tej apki — ale brak zapisu Seed-u sprawiał, że KAŻDE odświeżenie (manualne, HMR w dev,
albo mobilne w tle) kosztowało cały wpisany formularz.

**Decyzja:** to jest właśnie ten moment z komentarza w `storage-adapter.ts` — zaimplementowano
`IndexedDbStorageAdapter` (`lib/adapters/indexeddb-storage-adapter.ts`, jedna baza `offgrid-storage`,
jeden object store `kv`, zgodnie z 5.2/5.3) oraz hook `usePersistedDraft<T>` (`lib/adapters/use-persisted-draft.ts`)
— zamiennik `useState` o identycznym kształcie `[stan, setStan]`, autozapis debounce 500ms, odczyt
asynchroniczny (SSR-safe, pierwszy render = wartość początkowa, dane doładowują się na kliencie).

**Zakres tej sesji: pilotaż na jednym ekranie** (`napiecie-systemowe`, ten który zgłoszono) —
13 osobnych `useState` scalone w jeden obiekt `FormularzStan` (Seed tego ekranu, 5.1 — Seed nie
Wynik), persystowany pod kluczem `offgrid.draft.napiecie-systemowe`. Wywołania niżej w komponencie
(JSX, `toggleOdbiornik`, `zmienJednostkeCzasu`, edytor cen) **nie zostały zmienione** — każdy
`setX` to teraz wrapper wołający `setPole(pole, akcja)`, akceptujący wartość albo funkcję
aktualizującą tak jak oryginalny `useState`, żeby nie przepisywać całego pliku. Zweryfikowano:
`tsc --noEmit`, `pnpm lint`, `pnpm test` (655/655), `pnpm build` — wszystko czyste.

**Świadomie NIE wykonane w tej sesji (do rozważenia, nie zapomniane):** wdrożenie tego samego
mechanizmu na pozostałych ~100 ekranach kalkulatorów — `usePersistedDraft` jest gotowy do
skopiowania 1:1 (jedna linia zamiast `useState` + bundle pól w jeden typ `FormularzStan`), ale
zrobienie tego dla każdego ekranu naraz to osobne, duże zadanie, nie część naprawy zgłoszonego
błędu. Do rozważenia jako kolejny krok, ekran po ekranie albo partiami.

## Pierwsza implementacja i18n — pilotaż na module `kalkulatory-pomocnicze` (15.09.2026)

**Kontekst:** przy synchronizacji ze standardem (v2.8→v2.17, patrz sekcja "Synchronizacja ze
standardem" wyżej) wykryto niezgodność: rozdz. 17 (i18n, 17.2) i PATCH do 03.2/04 wymagają, żeby
Kernel zwracał **klucze tłumaczeń**, nigdy gotowy tekst — a cały istniejący kod (`Warning.message`,
`CalcResult.assumptions: string[]`) zwraca wprost polski tekst. Autor wybrał tę niezgodność jako
pierwszą do domknięcia (z listy 4: i18n / logowanie / freemium / kontrakt AI).

**Skala sprawdzona przed decyzją o zakresie (nie zgadywana):** 116 katalogów modułów, 90 plików
`warnings.ts`, **326 wystąpień `message:`** w `lib/core/modules` (bez testów), **110 plików**
używających `assumptions`. Migracja wszystkiego naraz byłaby dokładnie tym, co standard sam
zabrania (17.9: "migracja stopniowa, moduł po module, nigdy big bang") — dodatkowo część
`message:` to szablony z wartościami dynamicznymi (np. `label`/`value` wstrzykiwane w runtime),
więc ekstrakcja do słownika wymaga decyzji per funkcja (co jest parametrem, co kluczem), nie jest
czysto mechaniczna dla całego kodu naraz.

**Decyzja o zakresie tej sesji:** zbudować infrastrukturę + zmigrować **jeden pilotażowy moduł**
w całości (ten sam wzorzec co przy `usePersistedDraft` — pilotaż, nie big bang), zamiast czekać z
czymkolwiek do czasu, aż wszystkie 116 modułów zostaną zrobione naraz.

**Wykonane:**
1. `lib/i18n/dictionary-pl.ts` — słownik `{klucz: szablon}`, klucze wielkimi literami z myślnikiem
   (ta sama konwencja co dotychczasowy `Warning.code`), placeholdery `{param}`. Dziś tylko klucze
   faktycznie użyte przez zmigrowany moduł — **nie wolno dopisywać kluczy "na przyszłość"** bez
   migracji modułu, który ich używa (martwe klucze to dług, nie postęp — zapisane jako komentarz
   w samym pliku, żeby przetrwało kompaktowanie kontekstu).
2. `lib/i18n/t.ts` — `t(kod, params?)`, podstawia `{param}` w szablonie. Brakujący klucz nie jest
   cichym fallbackiem (17.1) — raportowany przez `consoleReporter` i widoczny w UI jako `⚠ [KOD]`,
   żeby błąd migracji był widoczny od razu, nie ukryty.
3. **Kontrakt (`lib/core/calc-result.ts`) — zmiana addytywna, nie usuwająca.** `Warning.message`
   stał się **opcjonalny** (oznaczony `@deprecated`, z komentarzem odsyłającym do tej sekcji),
   dodano `i18nKey?`/`params?`. `CalcResult.assumptions` zmieniło typ z `string[]` na nowy
   `Assumption = string | {kod, params?}`. **To jest świadomy, tymczasowy stan przejściowy** — nie
   każe wszystkim 115 pozostałym modułom migrować się natychmiast (są nadal poprawne typowo,
   zwracając same stringi/`message`), ale otwiera legalną ścieżkę dla modułów zmigrowanych.
   Rozstrzyga to WPROST napięcie między 17.1 ("brakujący klucz = błąd typu, nie cichy fallback")
   i 17.9 ("migracja stopniowa, nigdy big bang") — 17.1 opisuje stan DOCELOWY (po migracji
   wszystkiego), nie wymóg natychmiastowy w trakcie przejścia.
4. **Pilotaż w całości:** `lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/warnings.ts`
   (4 funkcje — `message` usunięty, `i18nKey`/`params` gdzie kod jest dynamiczny per pole, np.
   `notPositive`) i `calculator.ts` (2 miejsca `assumptions` → `{kod: "SPRAWNOSC-DOMYSLNA", params}`).
   `components/wzorce/wynik-szczegoly.tsx` (komponent współdzielony przez kilka ekranów) i
   `app/kalkulatory/pomocnicze/page.tsx` rozwiązują teraz `Assumption`/`Warning` niezależnie od
   tego, czy pochodzą z modułu zmigrowanego czy nie (`typeof a === "string" ? a : t(a.kod, a.params)`).
5. **Efekt uboczny zmiany typu (naprawiony, nie przeoczony):** poszerzenie `assumptions` na typ
   unii złapało 7 dodatkowych ekranów renderujących `assumptions.map` **bezpośrednio**, nie przez
   `WynikSzczegoly` (`cop-pompy-ciepla`, `czystosc-i-snieg`, `lokalizacja-i-klimat`,
   `porownanie-technologii-magazynow`, `prognozy`, `systemy-podtrzymania-zycia`, `tryb-uproszczony`)
   — każdy naprawiony tym samym wzorcem odczytu (moduły tych ekranów NIE są zmigrowane, nadal
   zwracają czyste stringi, tylko renderowanie musi już umieć obsłużyć oba kształty). Też: jedno
   miejsce w kodzie DOMENOWYM (`optymalizacja-trasy-kabla/calculator.ts`) czytające `w.message`
   z echo innego modułu jako wymagany `string` — naprawione fallbackiem `?? w.code` (transitional,
   do usunięcia gdy `dobor-przekroju-kabla` też się zmigruje). 2 testy asercji na dosłowny tekst
   `assumptions` i 1 na `w.message` — poprawione na `.includes`/`?.` odpowiednio bezpieczne dla
   typu unii/opcjonalnego pola.
6. Zweryfikowano: `tsc --noEmit`, `pnpm lint`, `pnpm test` (655/655), `pnpm build` — wszystko czyste.

**Świadomie NIE wykonane (rollout, osobne zadanie, `docs/lista-do-zrobienia.md`):** pozostałe ~89
plików `warnings.ts` (326 wystąpień `message:`) i ~109 innych plików z `assumptions: string[]`.
Kolejność rollout-u nie ustalona — naturalny kandydat to moduły najczęściej odwiedzane/najbardziej
"mega-Doradca" (per przegląd §8.11), ale to decyzja na kolejną sesję, nie założenie z tej.

**Lekcja procesowa:** zmiana typu współdzielonego kontraktu (`CalcResult`/`Warning`) używanego w
100+ miejscach, nawet "addytywna" (nowe pole opcjonalne, unia zamiast pojedynczego typu), potrafi
złapać nieoczywiste call site'y (renderowanie bezpośrednie z pominięciem współdzielonego
komponentu, konsumpcja międzymodułowa przez echo) — `tsc --noEmit` po zmianie typu bazowego jest
jedynym wiarygodnym sposobem znalezienia ich wszystkich, nie grep po nazwie pola.

## Szkielet logowania (rozdz. 18) — bez realnych kluczy Supabase (15.09.2026)

**Kontekst:** trzecia z 4 niezgodności znalezionych przy synchronizacji ze standardem (po i18n).
Projekt nie miał żadnego kodu auth (zero zależności Supabase, zero `.env`, zero `middleware.ts`).
Rozdz. 18 wymaga realnej infrastruktury (Supabase Auth, Google/Apple OAuth, sesja HttpOnly) — nie
dało się tego zbudować bez prawdziwego projektu Supabase, którego autor nie miał w tej sesji
(potwierdzone po kilku rundach wyjaśniania — patrz transkrypt, nie ma potrzeby powtarzać tu
przebiegu). **Decyzja: szkielet kodu teraz, bez kluczy — flip na "żywe" logowanie = wklejenie
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` do `.env.local`, bez zmian w kodzie.**

**Wykonane:**
- `@supabase/supabase-js` + `@supabase/ssr` jako zależności (jeden lockfile pnpm, bez naruszenia
  11.1). `.env.example` z placeholderami i komentarzem "skąd wziąć wartości".
- `lib/adapters/supabase/config.ts` — `isSupabaseConfigured()`: jedyne miejsce decydujące, czy
  Supabase jest realnie skonfigurowany (placeholder URL = "nie"). Cała reszta kodu pyta to, nigdy
  nie sprawdza `process.env` bezpośrednio — jedno miejsce prawdy.
- `lib/adapters/supabase/client.ts` (przeglądarka) / `server.ts` (Server Components/Actions/Route
  Handlers) — sesja wyłącznie przez `@supabase/ssr`, nigdy ręczne cookie (18.5).
- `middleware.ts` — 18.1 (konto wymagane od startu), ale **wyłączony całkowicie, gdy Supabase
  nieskonfigurowany** (`isSupabaseConfigured()` na wejściu, `return NextResponse.next()`) — jawny,
  dokumentowany stan przejściowy, nie cichy fallback. Zweryfikowane realnie (`pnpm build` +
  `pnpm start` + `curl`): `/kalkulatory/pomocnicze` odpowiada 200 bez przekierowania, dokładnie
  jak przed tym commitem — apka nie zmieniła zachowania dla użytkownika, dopóki nie ma kluczy.
- `app/auth/login/page.tsx` — 3 równorzędni dostawcy (18.2): magic link e-mail (formularz +
  Server Action `signInWithMagicLink`), Google/Apple (`signInWithOAuth`). Wymagało wrappera
  `<Suspense>` wokół `useSearchParams()` — bez tego `pnpm build` failował na prerenderingu
  (Next.js wymaga tego jawnie, nie ostrzeżenie, błąd zatrzymujący build).
- `app/auth/callback/route.ts` — wymiana kodu na sesję. `next` (URL powrotny) przechodzi przez
  `safeNextPath()` (nowy plik `lib/adapters/supabase/safe-redirect.ts`, z testami) — **realny
  fix na open redirect z 18.2 (dopisek 15.09.2026)**, nie tylko wzmianka w komentarzu: odrzuca
  wszystko, co nie zaczyna się od jednego `/` (łapie też `//host` protocol-relative).
- `app/auth/signout/route.ts` + `components/konto-sekcja.tsx` (sekcja w `/ustawienia`, renderuje
  się na coś tylko gdy `isSupabaseConfigured()` — inaczej apka nie ma jeszcze konceptu
  "zalogowany", pusta sekcja byłaby myląca, nie tylko nieprzydatna).
- `supabase/migrations/0001_profiles.sql` — `public.profiles` (1:1 z `auth.users`, `ON DELETE
  CASCADE` — prawdziwy DELETE, 18.8), RLS (`auth.uid() = id`), trigger auto-insert przy rejestracji.
  Pole `tier` (freemium, rozdz. 12) świadomie NIE dodane teraz — dojdzie, gdy projekt zdecyduje
  się na freemium, nie spekulacyjnie.
- `next.config.mjs` — `connect-src` w CSP dopuszcza URL Supabase, tylko gdy zmienna środowiskowa
  istnieje (`process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""` — pusty string nie dodaje nic do CSP).
- Zweryfikowano: `tsc --noEmit`/`pnpm lint`/`pnpm test` (660/660, +5 nowych testów
  `safe-redirect.test.ts`)/`pnpm build` czyste. `pnpm start`+`curl` potwierdza brak regresji w
  zachowaniu apki bez kluczy.

**Świadomie NIE wykonane (wymaga działań właściciela projektu, poza zasięgiem sesji):**
1. Założenie realnego projektu Supabase (supabase.com → New Project → Settings → API) i wklejenie
   `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` do `.env.local`.
2. Uruchomienie `supabase/migrations/0001_profiles.sql` w Supabase Dashboard → SQL Editor.
3. Włączenie dostawców Google/Apple w Supabase Dashboard → Authentication → Providers (wymaga
   danych OAuth z Google Cloud Console / Apple Developer Program — **99 USD/rok**, 18.2 — koszt
   realny, nie tylko konfiguracyjny, do rozważenia zanim się włączy).
4. Model grupy współdzielonej (18.7), rozwiązywanie konfliktu synchronizacji (18.14, wzorzec
   opcjonalny) — żadnego z tego projekt jeszcze nie potrzebuje (brak danych do synchronizacji w
   ogóle, poza tym co dziś żyje lokalnie w IndexedDB, patrz sekcja `usePersistedDraft` wyżej).
   `docs/lista-do-zrobienia.md` ma wpis na kolejny krok.

**Lekcja procesowa:** rozdz. 18 to pierwsza niezgodność z tej listy czterech, która jest naprawdę
blokowana na zewnętrznym zasobie (konto Supabase), nie na decyzji projektowej czy nakładzie pracy
— i18n/AI-kontrakt/freemium da się zaplanować i częściowo wdrożyć bez niczyjej zewnętrznej akcji,
logowanie nie. Warto to rozpoznawać wcześniej (przed pisaniem kodu), nie w trakcie.

## Mechanizm strażniczy i18n — `scripts/check-i18n-guard.mjs` (16.09.2026)

**Kontekst:** audyt zgodności rozdz. 17 (i18n) z żądania właściciela projektu ("czy nie mamy
odstępstw?") wykrył realną, nieodnotowaną dotąd niezgodność — 17.9 wymaga wprost "mechanizmu
strażniczego (lint/hook wykrywający nowy twardy string)", który nie istniał. Reszta rozdziału
sprawdzona punkt-po-punkcie i **zgodna**: 17.1 (klucze PL w `dictionaryPl` to zastosowanie
wyjątku 0.7 dla już ugruntowanej w projekcie polskiej konwencji `Warning.code` — nie odstępstwo,
patrz decyzja niżej), 17.2 + PATCH 03.2/04 (kontrakt `{kod, params?}`/`i18nKey` 1:1 z tekstem
standardu), 17.9 rollout (moduł-po-module, udokumentowany backlog). 17.3/17.4/17.7/17.8/17.10 nie
mają jeszcze zastosowania — nie istnieje drugi język, to nie jest odstępstwo, tylko punkt, który
zacznie obowiązywać przy dodaniu języka nr 2.

**Zbudowane:** `scripts/check-i18n-guard.mjs` — parsuje AST (`typescript`, nie regex, żeby nie
łapać fałszywych trafień w `technicalMessage`/`formula`, które świadomie NIE podlegają i18n) pliki
`warnings.ts`/`calculator.ts` modułów z listy `MIGRATED_MODULES` (dziś: tylko
`kalkulatory-pomocnicze`) i blokuje: (1) `message` z literałem stringu, (2) element `assumptions`
będący gołym stringiem — także wtedy, gdy tablica jest za `? :`/`??` (realny wzorzec w tym
projekcie, `input.efficiency === undefined ? [...] : []`; pierwsza wersja skryptu sprawdzała tylko
bezpośrednie przypisanie i **nie wykrywała** tego wzorca — złapane i naprawione przed wdrożeniem,
zweryfikowane wstrzyknięciem i usunięciem testowej regresji na obu polach, na prawdziwym pliku, nie
tylko na syntetycznym przykładzie). Nowy skrypt `pnpm check:i18n-guard`, dodany jako krok w
`.github/workflows/ci.yml` (job `quality`, po `typecheck`, przed `test`) — od teraz blokuje merge
PR, nie tylko lokalne uruchomienie.
**Świadomie NIE zrobione:** git hook (pre-commit) — repo nie ma `husky`/innego mechanizmu hooków,
dodanie go byłoby nową zależnością/konwencją poza zakresem tego zadania; bramka w CI wystarcza do
"zapobiega cofaniu się" (17.9), bo blokuje merge, nie tylko ostrzega lokalnie.
**Do pamiętania na przyszłość:** dopisz ścieżkę modułu do `MIGRATED_MODULES` w TEJ SAMEJ sesji, w
której go migrujesz — inaczej guard nie chroni nowo zmigrowanego modułu (guard jest allowlistą,
nie wykrywa automatycznie, które moduły są zmigrowane).

**Decyzja: klucze i18n zostają po polsku, NIE zmieniamy na angielski.** Właściciel projektu
zapytał wprost, czy warto zmienić. Rozpatrzone i odrzucone — uzasadnienie:
- 17.1 samo przewiduje wyjątek "jeśli projekt już go używa gdzie indziej" — a używa: **90 plików
  `warnings.ts`, setki wartości `Warning.code`** po polsku od pierwszego dnia projektu
  (`BEZPIECZNIK-DOBRANY`, `BRAK-CZUJNIKA-CO`, `AIC-WYSTARCZAJACE`...). Zmiana samych kluczy i18n
  na angielski przy pozostawieniu `code` po polsku rozbiłaby jedną konwencję na dwie równoległe
  (klucz i18n ≠ kod ostrzeżenia dla tego samego zjawiska) — dokładnie odwrotny skutek od tego, co
  0.7/15.15 chce osiągnąć ("stosowana wtedy konsekwentnie w całym module").
  Dziś `i18nKey ?? code` w warstwie prezentacji polega właśnie na tej wspólnej konwencji.
- Koszt zmiany na angielski: nie jest to zmiana "tylko 5 kluczy w słowniku" — żeby była
  konsekwentna (a niekonsekwentna nie miałaby sensu), wymagałaby przemianowania `Warning.code` w
  **całym** kodzie (90 plików, setki wystąpień), plus każde miejsce, które go odczytuje: testy
  asercji na dosłowny `code`, `docs/rejestr-twardych-stopow.md`, wszelkie `key={w.code}` w JSX.
  Ryzyko czysto mechaniczne, ale duże i rozsiane, dla zmiany, która **nie zmienia zachowania
  runtime** — `code` nie jest dziś nigdzie parsowany/porównywany po treści semantycznej poza
  równością stringów, tylko wyświetlany (po przetłumaczeniu) i używany jako identyfikator.
- Realna korzyść zmiany na angielski istniałaby tylko przy pracy z **zewnętrznym, nie-polskim
  współpracownikiem/AI bez kontekstu projektu** czytającym kod źle znającym polski — w tym
  projekcie (jedna osoba, PL jako język pracy, GOD BOOK/CLAUDE.md wymagają polskiego wprost) ta
  korzyść nie ma dziś zastosowania.
**Wniosek:** zero zmian kodu z tej decyzji — pozostaje jak jest, z wyjątkiem odnotowanym tutaj
jako świadomy, rozpatrzony i odrzucony, nie przeoczony.

