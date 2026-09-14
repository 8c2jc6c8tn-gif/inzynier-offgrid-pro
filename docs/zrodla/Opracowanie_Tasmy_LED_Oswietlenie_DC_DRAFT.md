# Opracowanie: Taśmy LED i oświetlenie DC w systemach Off-Grid

**STATUS: SZKIC ROBOCZY — NIE JEST CZĘŚCIĄ BIBLII.** Ten dokument to "totalne opracowanie" na
prośbę autora (14.09.2026), poprzedzające ewentualne włączenie do Biblii projektu. Nie wdrażać do
`docs/god-book`/Biblii i nie budować kalkulatora na jego podstawie bez wyraźnej akceptacji autora.
Autor zapowiedział własne uzupełnienia — ten szkic jest punktem wyjścia do dyskusji, nie
gotowym, zamkniętym materiałem.

**Konwencja tagowania (zgodna z `docs/standards/15-wspolpraca-z-ai.md` / GOD BOOK):**
- `[FAKT]` — twarde prawo fizyki/elektrotechniki, niezależne od producenta (Ohm, moc, temperatura barwowa jako wielkość fizyczna).
- `[TYPOWA WARTOŚĆ]` — wartość powszechnie spotykana w ofertach rynkowych, ale zależna od konkretnego producenta/modelu — nie traktować jako uniwersalnej stałej.
- `[ZAŁOŻENIE]` — przyjęte na potrzeby przykładu liczbowego, jawnie oznaczone.
- `[DO WERYFIKACJI]` — miejsce, gdzie przydałaby się karta katalogowa konkretnego produktu, zanim to wejdzie do Biblii jako twarda dana.

---

## 0. Cel dokumentu

Użytkownik ma wejść w ten moduł i wyjść z **totalną wiedzą**, co kupować i dlaczego — żeby w
sklepie albo na AliExpress nie zgadywał, tylko rozumiał: jakie napięcie taśmy, jakie oznaczenie na
etykiecie znaczy co, dlaczego jedna taśma przeżyje 5 lat a inna pół roku, czy brać biel czy RGBW,
jak rozmieścić zasilanie na długiej trasie żeby nie było "gaśnięcia" na końcu, i jak wygląda dana
barwa światła w realnym pomieszczeniu, zanim się ją kupi.

Docelowo (Krok 3, po akceptacji) ten materiał ma zasilić kalkulator/doradcę z żywym podglądem:
suwak CCT zmieniający na żywo barwę przykładowego pomieszczenia, pasek RGB/RGBW na czarnym tle
pokazujący realne możliwości kolorystyczne taśmy. Uwagi UI dla tego kroku są zebrane w Sekcji 9.

---

## 1. Rodzaje taśm LED wg napięcia zasilania

### 1.1 Tabela porównawcza

| Napięcie | Dostępność rynkowa | Typowa długość odcinka | Maks. długość jednego odcinka bez spadku napięcia* | Typowe zastosowanie | Bezpieczeństwo dotykowe |
|---|---|---|---|---|---|
| **12V DC** | Bardzo szeroka (najpopularniejsze) | 5 m (300/600 LED) | Krótka — patrz Sekcja 8 | Kampery, łodzie, dekoracje, meble, akcenty | SELV — bezpieczne, wolno dotykać |
| **24V DC** | Szeroka, rośnie | 5 m, coraz częściej 10 m | 2× dłuższa niż 12V przy tej samej mocy/m | Domy off-grid, dłuższe trasy, listwy sufitowe | SELV — bezpieczne |
| **36V DC** | Wąska nisza | 5 m | Pośrednia | Rzadkie, głównie profesjonalne/przemysłowe instalacje | SELV — bezpieczne |
| **48V DC** | Rosnąca (profesjonalny segment) | 5 m, projekty na 10-20 m | Najdłuższa z DC | Duże domy off-grid, linie oświetleniowe zintegrowane z magazynem 48V | Blisko granicy SELV (50V) — do przestrzegania |
| **230V AC** | Bardzo szeroka (segment "gotowe oprawy") | Dowolna (zasilanie z sieci/falownika) | Bez ograniczenia praktycznego (napięcie sieciowe) | Domy z falownikiem, gdy nie buduje się osobnej instalacji DC | Wymaga zabezpieczeń AC (RCD), nie wolno dotykać żył |

*„Maks. długość bez spadku napięcia" — patrz algorytm w Sekcji 8; zależy od mocy taśmy na metr, nie jest stałą.

### 1.2 12V — plusy i minusy

**Plusy:** najszerszy wybór na rynku (praktycznie każdy sklep/AliExpress), tanie zasilacze i
akcesoria, standard w kamperach/łodziach (kompatybilność z istniejącą instalacją 12V pojazdu),
łatwe testowanie (akumulator samochodowy/żelowy jako źródło zapasowe).

**Minusy:** przy tej samej mocy prąd jest **4× większy niż przy 48V** [FAKT — I=P/V], więc: grubsze
przewody zasilające, większe straty I²R na dłuższych trasach, najkrótszy dystans między punktami
zasilania (patrz Sekcja 8), słabsza opcja przy dużych domach/długich instalacjach.

### 1.3 24V — plusy i minusy

**Plusy:** dobry kompromis — 2× mniejszy prąd niż 12V przy tej samej mocy, więc dłuższe odcinki bez
przerywania zasilania, wciąż szeroki wybór na rynku, dobra kompatybilność z systemami baterii 24V.

**Minusy:** droższe taśmy/zasilacze niż 12V (mniejsza skala produkcji), mniejszy wybór gotowych
opraw dekoracyjnych niż w 12V.

### 1.4 36V — czy ma sens? (odpowiedź na pytanie z rozmowy)

`[TYPOWA WARTOŚĆ / OCENA INŻYNIERSKA]` 36V to nisza pomiędzy 24V a 48V, spotykana głównie w
instalacjach profesjonalnych (sklepy, ekspozycje) i w niektórych systemach modułowych LED. W
kontekście domowego systemu off-grid **zwykle nie ma sensu**, z trzech powodów:

1. **Niekompatybilność z typowymi napięciami systemowymi baterii.** Systemy off-grid budowane są
   na 12/24/48V (patrz moduł "Dobór napięcia systemowego" w tej aplikacji) — 36V nie pasuje do
   żadnego z tych poziomów bez dodatkowej przetwornicy DC-DC, co dokłada koszt i stratę (podobnie
   jak przetwornice 48V→24V opisane w Etapie D modułu Dobór napięcia).
2. **Mniejszy wybór na rynku** niż 12V/24V/48V — trudniej o zamienniki, akcesoria, sterowniki RGB
   w tym napięciu.
3. **Brak wyraźnej przewagi nad 48V** — jeśli i tak trzeba akceptować mniej popularne napięcie,
   48V daje dodatkowo najmniejszy prąd/najdłuższe odcinki bez przerywania.

**Wniosek:** 36V wart rozważenia tylko wtedy, gdy konkretny produkt (np. gotowy system oświetlenia
z własnym zasilaczem 36V) jest z innych powodów jedynym sensownym wyborem — nie jako świadomy
wybór napięcia systemowego od zera.

### 1.5 48V — plusy i minusy

**Plusy:** najmniejszy prąd przy danej mocy [FAKT], najdłuższe odcinki bez przerywania zasilania,
najlepsza integracja z systemem baterii 48V (bez przetwornicy), najlepsza opcja przy dużych domach.

**Minusy:** wymaga oświetlenia 24V przez przetwornicę DC-DC, JEŚLI budynek ma linie 24V (opisane
już w Etapie D modułu "Dobór napięcia") — ale jeśli od początku planuje się taśmy 48V, tego kosztu
nie ma. Węższy wybór produktów niż 12V/24V (choć rosnący).

### 1.6 230V AC — plusy i minusy

**Plusy:** ogromny wybór gotowych opraw i listew, prosta instalacja (wtyczka/gniazdko), brak
potrzeby projektowania sieci DC.

**Minusy:** wymaga falownika (koszt, straty konwersji DC→AC, patrz Etap D.2 modułu Dobór
napięcia — podwójna konwersja to strata rzędu 15-25% [TYPOWA WARTOŚĆ, źródło: materiał Dobór
napięcia D.2]), każda oprawa ma własny mały zasilacz/driver — to dodatkowe ciepło i dodatkowy
punkt awarii na każdą lampę, gorsza filozofia off-gridowa (patrz Etap D.1 modułu Dobór napięcia —
ten sam wniosek co dla żarówek LED 230V vs 24V).

---

## 2. Jak czytać oznaczenia taśm LED (rozszyfrowanie dla laika)

To jest najczęstszy powód nieporozumień przy zakupie. Poniżej rozszyfrowanie typowej etykiety
produktu, np.: `SMD5050 RGB 12V 14.4W/m 60LED/m IP65 5m`.

### 2.1 Kod chipa: `SMDxxxx` / `COB`

`SMD` (Surface-Mounted Device) + 4 cyfry = **wymiary pojedynczej diody w dziesiątych częściach
milimetra**. `[FAKT — konwencja nazewnicza branży]`

| Oznaczenie | Wymiar chipa | Typowa moc/diodę | Charakterystyka |
|---|---|---|---|
| SMD2835 | 2,8 × 3,5 mm | `[TYPOWA WARTOŚĆ]` 0,2 W | Najnowsza generacja małych chipów, dobra efektywność świetlna (lm/W), niska cena, dominuje w tanich taśmach 2020+ |
| SMD3528 | 3,5 × 2,8 mm | `[TYPOWA WARTOŚĆ]` 0,06-0,1 W | Starsza, słabsza generacja — mało światła, głównie dekoracyjne/ambientowe zastosowania, dziś raczej przestarzała |
| SMD5050 | 5,0 × 5,0 mm | `[TYPOWA WARTOŚĆ]` 0,2 W (3 diody w jednym chipie — stąd "5050" bywa jaśniejsze niż 2835 przy tej samej liczbie chipów/m) | Popularna w taśmach RGB (3 diody = R+G+B w jednej obudowie), większa niż 2835, więcej ciepła na chip |
| SMD5630/5730 | 5,6-5,7 × 3,0 mm | `[TYPOWA WARTOŚĆ]` 0,5 W | Mocniejsze, jaśniejsze pojedyncze diody, używane gdy potrzeba dużo światła z mniejszej liczby chipów |
| COB (Chip-on-Board) | Brak pojedynczych punktów — ciągła "linia światła" | Moc liczona na metr, nie na chip | Setki mikro-chipów naniesionych bezpośrednio na taśmę bez indywidualnych obudów — światło wygląda jak jednolita linia, bez widocznych punktów. Zwykle wyższe CRI, bardziej równomierne, ale trudniejsze do naprawy punktowej (nie da się wymienić pojedynczej diody) |

**Dlaczego to ma znaczenie przy zakupie:** ta sama etykieta "60 LED/m" znaczy zupełnie co innego
przy SMD2835 (słabsze diody, ale gęściej upakowane) niż przy SMD5050 (mocniejsze diody, więcej
ciepła). Liczba LED/m bez znajomości typu chipa **nic nie mówi o rzeczywistej jasności**.

### 2.2 Gęstość: `60LED/m`, `120LED/m`, `240LED/m`

`[FAKT]` Liczba diod na metr bieżący taśmy. Więcej diod na metr = więcej światła, ale też więcej
ciepła i wyższy pobór prądu na metr — przekłada się wprost na W/m (patrz 2.3) i na dystans między
punktami zasilania (Sekcja 8, bo mniejszy dystans przy wyższej mocy/m).

`[TYPOWA WARTOŚĆ]` Typowe stopnie gęstości na rynku: 30, 60, 96, 120, 180, 240, 300, a nawet 480
LED/m w segmencie "high density". Powyżej ~120 LED/m różnica jasności "gołym okiem" jest coraz
mniej odczuwalna względem rosnącego kosztu i ciepła — punkt opłacalności zależy od zastosowania
(oświetlenie funkcjonalne vs efekt "linii światła bez punktów" przy bardzo dużej gęstości).

### 2.3 Moc: `14.4W/m`

`[FAKT]` Deklarowana moc pobierana przez metr taśmy przy napięciu znamionowym. To jest **kluczowa
liczba do obliczeń** (Etap B tego modułu, Sekcja 8 tego dokumentu) — nie liczba LED/m. Dwie taśmy
o tej samej liczbie LED/m mogą mieć różną moc/m w zależności od typu chipa i prądu, jakim są
zasilane przez producenta.

### 2.4 Stopień ochrony: `IPxx`

`[FAKT — norma IEC 60529]` Dwie cyfry: pierwsza = ochrona przed ciałami stałymi/pyłem (0-6), druga
= ochrona przed wodą (0-9K).

| Oznaczenie | Ochrona | Typowe zastosowanie |
|---|---|---|
| IP20 | Brak ochrony przed wodą/pyłem | Wnętrza suche, meble, wnęki (bez kontaktu z wilgocią) |
| IP44 | Ochrona przed bryzgami wody z każdej strony | Łazienki (poza strefą natrysku), kuchnie |
| IP65 | Ochrona przed strugą wody, pełna ochrona przed pyłem | Zewnętrzne pod zadaszeniem, łodzie, kampery |
| IP67/IP68 | Ochrona przed czasowym/ciągłym zanurzeniem | W pełni zewnętrzne, oczka wodne, ekspozycja na deszcz bezpośrednio |

`[TYPOWA WARTOŚĆ / PUŁAPKA ZAKUPOWA]` Taśmy IP65+ mają zwykle dodatkową powłokę silikonową na
wierzchu — to **obniża jasność o kilka do kilkunastu procent** względem tej samej taśmy w IP20 i
**pogarsza odprowadzanie ciepła** (silikon izoluje termicznie) — realny wpływ na żywotność, patrz
Sekcja 3.

### 2.5 Napięcie i typ prądu: `12V`, `24V`, `230V`

Patrz Sekcja 1. Ważne: **nigdy nie podłączać taśmy do niewłaściwego napięcia** — taśma 12V
podłączona do 24V spali się niemal natychmiast (nadmiar prądu przez rezystory ograniczające
zaprojektowane na 12V); taśma 24V podłączona do 12V będzie świecić bardzo słabo lub wcale.

### 2.6 CRI (Color Rendering Index) — często pomijane na etykiecie, a ważne

`[FAKT]` Wskaźnik 0-100 określający, jak wiernie źródło światła oddaje kolory w porównaniu do
światła naturalnego. `[TYPOWA WARTOŚĆ]` Tanie taśmy: CRI 70-80 (kolory wyglądają "spłaszczone",
np. czerwienie wyglądają matowo). Taśmy dobrej jakości: CRI 90+ (kolory wyglądają naturalnie —
ważne w kuchni, przy pracy, w garderobie). Warto szukać tej wartości na karcie produktu, nawet
jeśli nie zawsze jest w samej nazwie/etykiedzie — brak podanego CRI to zwykle sygnał niższej klasy
produktu.

---

## 3. Żywotność taśm LED — co wpływa i dlaczego

`[FAKT]` Deklarowana żywotność LED (często "50 000 h") to teoretyczny czas do spadku jasności o
30% (tzw. L70) w warunkach laboratoryjnych producenta chipa — **nie** gwarancja, że cała taśma
przetrwa tyle w realnych warunkach montażu. Realna żywotność zależy od:

1. **Temperatura pracy chipa [FAKT — degradacja LED jest wykładniczo zależna od temperatury
   złącza].** Im goręcej pracuje dioda, tym szybciej traci jasność i tym szybciej degraduje się
   żywica/soczewka (żółknięcie). Taśma zamontowana w profilu aluminiowym z dobrym odprowadzeniem
   ciepła przeżyje wielokrotnie dłużej niż ta sama taśma przyklejona bezpośrednio do drewna czy
   gipsu bez radiatora.
2. **Jakość chipów i produkcji.** `[TYPOWA WARTOŚĆ]` Renomowani producenci chipów (np. z klasy
   "brand LED" vs bezimienne chipy z najtańszych taśm) mają znacznie mniejszy rozrzut parametrów i
   wolniejszą degradację przy tym samym prądzie — to jeden z głównych powodów, dla których dwie
   wizualnie identyczne taśmy w tej samej cenie mogą się różnić żywotnością nawet kilkukrotnie.
3. **Prąd zasilający względem prądu znamionowego chipa.** `[FAKT]` Producenci tanich taśm często
   "przekraczają" (overdrive) zalecany prąd chipa, żeby uzyskać więcej lumenów z mniejszej liczby
   diod (tańsza produkcja) — kosztem szybszej degradacji. Stabilny, dobrej jakości zasilacz +
   niezawyżony prąd = dłuższa żywotność.
4. **Jakość driverów/zasilaczy.** Tania, niestabilizowana elektronika zasilająca (skoki napięcia,
   tętnienia) skraca żywotność diod i elektroniki sterującej (szczególnie w taśmach RGB/RGBIC z
   wbudowanym układem sterującym na taśmie).
5. **Gęstość LED i moc/m względem odprowadzenia ciepła.** Taśma o wysokiej gęstości (240+ LED/m)
   generuje dużo ciepła na małej powierzchni — bez profilu aluminiowego degraduje się szybciej niż
   taśma o niższej gęstości przy tej samej całkowitej mocy.
6. **Powłoka IP.** Jak w Sekcji 2.4 — silikonowa powłoka IP65+ pogarsza odprowadzanie ciepła,
   skracając żywotność względem tej samej taśmy bez powłoki, montowanej w suchym pomieszczeniu.

**Praktyczny wniosek dla kupującego:** żywotność to nie tylko cyfra na etykiecie (50 000h), tylko
wypadkowa: jakości chipa × jakości zasilacza × sposobu montażu (profil aluminiowy czy nie) ×
warunków otoczenia (IP). Taśma za 15 zł/m i taśma za 60 zł/m mogą mieć tę samą deklarowaną
żywotność na etykiecie i zupełnie inną realną.

---

## 4. Biel (W) czy RGBW — jeśli głównie potrzebne białe światło

### 4.1 Rodzaje "bieli" na rynku

`[FAKT]` Taśmy jednokolorowe białe występują w kilku wariantach:

- **Single White (jedna stała temperatura barwowa)** — np. tylko 3000K albo tylko 6500K, bez
  możliwości zmiany.
- **CCT / Dual White / Tunable White** — dwa rzędy diod (ciepła + zimna biel) sterowane osobno,
  pozwalające płynnie regulować temperaturę barwową od ~2700K do ~6500K jednym sterownikiem.
- **RGBW** — cztery kanały: R, G, B + osobny biały chip.
- **RGBWW** — pięć kanałów: R, G, B + ciepła biel + zimna biel (najbardziej uniwersalne, ale
  najdroższe i najbardziej złożone elektronicznie).

### 4.2 Dlaczego "biel z RGB" (mieszanie R+G+B) jest gorsza niż dedykowany chip biały

`[FAKT — mieszanie barw addytywnych]` Teoretycznie R+G+B w odpowiednich proporcjach daje "biel",
ale:
- Ma znacznie **niższe CRI** niż dedykowany chip biały — kolory pod takim "sztucznym bielem"
  wyglądają nienaturalnie, bo widmo światła nie jest ciągłe, tylko trzema wąskimi pikami (czerwony/
  zielony/niebieski), a nie pełnym spektrum jak przy prawdziwym białym chipie.
- Jest **mniej efektywna energetycznie** — żeby uzyskać tę samą jasność bieli, trzeba zapalić 3
  różne diody na pełnej mocy zamiast jednej dedykowanej, co przy tej samej mocy/m daje mniej
  lumenów białego światła.
- Zwykle wygląda lekko różowawo lub niebieskawo (trudno o idealnie neutralną biel z mieszania RGB),
  podczas gdy dedykowany chip biały jest kalibrowany fabrycznie na konkretną, czystą barwę.

### 4.3 Rekomendacja

**Jeśli światło ma być przez większość czasu białe** (funkcjonalne oświetlenie mieszkania, a nie
efekt dekoracyjny) — `[OCENA INŻYNIERSKA]` lepszym wyborem jest:
1. **Taśma CCT (Dual White)**, jeśli zależy na możliwości zmiany temperatury barwowej w ciągu dnia
   (chłodniejsza biel rano/do pracy, cieplejsza wieczorem) — dobry kompromis jakość/funkcjonalność/cena.
2. **RGBW**, jeśli oprócz głównie białego światła chce się mieć **też** opcję kolorowego
   podświetlenia okazjonalnie (impreza, nastrój wieczorny) — ale trzeba pogodzić się z tym, że sam
   kanał biały w RGBW jest zwykle pojedynczą, stałą temperaturą barwową (nie CCT), i że jest
   droższa oraz ma bardziej złożoną elektronikę sterującą (więcej punktów potencjalnej awarii) niż
   zwykła taśma biała.
3. **Zwykła taśma Single White**, jeśli kolor nigdy nie będzie potrzebny — najtańsza, najbardziej
   niezawodna (najmniej elektroniki), najlepsza jasność/W spośród wszystkich opcji.

RGBW "na wszelki wypadek" dla kogoś, kto **naprawdę** chce głównie białe funkcjonalne światło, to
zwykle przepłacanie za funkcję, z której się nie skorzysta, kosztem gorszej bieli niż dedykowana
taśma biała.

---

## 5. Temperatura barwowa (CCT) — jak to wygląda w pomieszczeniu

`[FAKT — wielkość fizyczna, jednostka Kelvin]` Temperatura barwowa opisuje "ciepłość"/"chłód"
światła białego. Niższa wartość = cieplejsza (bardziej pomarańczowa/żółta), wyższa = zimniejsza
(bardziej niebieskawa).

| Zakres CCT | Nazwa potoczna | Jak wygląda w pomieszczeniu | Typowe zastosowanie |
|---|---|---|---|
| 2200-2700K | Bardzo ciepła biel ("świeca") | Intensywnie pomarańczowe, przytulne, senne | Sypialnia, oświetlenie nastrojowe, restauracje |
| 3000K | Ciepła biel | Klasyczna "żarówkowa" biel, przyjemna, relaksująca | Salon, jadalnia, oświetlenie wieczorne |
| 4000K | Neutralna biel | Zbalansowana, ani ciepła ani zimna, naturalna | Kuchnia, korytarz, łazienka, oświetlenie ogólne |
| 5000-5500K | Chłodna biel dzienna | Przypomina światło dzienne w południe, energetyzująca | Biuro, warsztat, garaż, miejsce pracy |
| 6000-6500K | Zimna biel | Wyraźnie niebieskawa, bardzo "techniczna" | Oświetlenie przemysłowe, warsztaty precyzyjne |
| 7000-8000K+ | Bardzo zimna biel | Intensywnie niebieska, może być męcząca do długiego przebywania | Rzadko w mieszkaniach — głównie efekty specjalne/przemysł |

**Zasada praktyczna** `[OCENA INŻYNIERSKA, powszechnie stosowana w projektowaniu oświetlenia]`:
pomieszczenia do wypoczynku i snu → niższe CCT (2700-3000K); pomieszczenia do pracy/skupienia →
wyższe CCT (4000-5000K); rzadko warto przekraczać 5000K w mieszkaniu, bo powyżej tej wartości
światło zaczyna być odbierane jako "nieprzytulne" w przestrzeni mieszkalnej, mimo że jest
obiektywnie jaśniejsze psychologicznie.

**Notatka do UI (Krok 3):** dokładnie to, o co prosił autor — suwak 2700K→8000K, przy którym
przykładowe zdjęcie/wizualizacja pomieszczenia zmienia barwę światła na żywo. Technicznie:
najprostsza, w pełni zgodna z zasadą "nie zmyślamy danych" implementacja to nałożenie
półprzezroczystej warstwy koloru (obliczonego ze standardowego przybliżenia CCT→RGB, np. algorytm
Tanner Helland — to publiczna, sprawdzalna formuła, nie wymyślona) na neutralne zdjęcie
pomieszczenia, sterowane wartością suwaka. Wymaga jednego neutralnego zdjęcia referencyjnego
(do przygotowania/wybrania w Kroku 3) — nie wymaga 6 osobnych zdjęć.

---

## 6. RGB / RGBIC — realne możliwości kolorystyczne i prawda o "milionach kolorów"

### 6.1 Skąd bierze się liczba "16 milionów kolorów"

`[FAKT — matematyka 8-bitowego sterowania PWM]` Standardowy sterownik RGB steruje każdym z 3
kanałów (R, G, B) w 256 poziomach jasności (8 bitów, 0-255). Liczba kombinacji: 256 × 256 × 256 =
**16 777 216** — stąd marketingowe "16 milionów kolorów". To matematycznie prawdziwe, ale:

`[OCENA INŻYNIERSKA — ważne zastrzeżenie]` Liczba *teoretycznie adresowalnych kombinacji sygnału
sterującego* to nie to samo, co liczba *realnie rozróżnialnych przez ludzkie oko kolorów*. Ludzkie
oko rozróżnia szacunkowo kilka milionów odcieni w najlepszych warunkach — więc "16 mln" w dużej
mierze zawiera kombinacje wizualnie nieodróżnialne od siebie. Ponadto realna paleta kolorów, jaką
osiąga tania taśma RGB, jest ograniczona przez to, jak "czyste" są fizycznie chipy R/G/B (ich
rzeczywiste widmo) — dwie taśmy RGB "16 mln kolorów" od różnych producentów mogą wizualnie wyglądać
zauważalnie inaczej przy tym samym ustawieniu, bo same diody bazowe mają inne widmo.

**Wniosek do UI (Krok 3):** "16 milionów kolorów" na pudełku to fakt matematyczny o sterowniku, nie
obietnica jakości — dokument/kalkulator powinien to tłumaczyć wprost, żeby użytkownik rozumiał, co
faktycznie kupuje.

### 6.2 RGB vs RGBW vs RGBIC — różnice

| Typ | Kanały | Możliwości | Ograniczenie |
|---|---|---|---|
| RGB | R, G, B | Pełna paleta kolorów (mieszanie 3 barw) | Słaba/nienaturalna biel (patrz 4.2), cała taśma świeci jednym kolorem naraz |
| RGBW | R, G, B, W (osobny biały chip) | Pełna paleta kolorów + osobna, czysta biel | Nadal cała taśma jednym kolorem/trybem naraz |
| RGBIC (znane też jako "adresowalne", np. WS2812B) | Każdy pojedynczy diod-segment adresowany osobno | Różne kolory na różnych fragmentach TEJ SAMEJ taśmy jednocześnie, efekty "płynące", animacje | Droższe, bardziej złożona elektronika (każdy segment to osobny mikroukład sterujący), wyższa awaryjność, wymaga dedykowanego kontrolera |

`[FAKT]` RGBIC to fizycznie inna technologia niż zwykłe RGB/RGBW — zamiast jednego sterownika na
całą taśmę, każdy mały odcinek ma własny chip sterujący adresowany cyfrowo (protokoły typu
WS2812B/SK6812). To umożliwia efekty typu "tęcza przesuwająca się wzdłuż taśmy", ale to zupełnie
inna klasa produktu niż prosta taśma RGB/RGBW sterowana jednym sygnałem PWM.

### 6.3 Notatka do UI (Krok 3)

Pasek koloru na czarnym tle pokazujący: (a) czyste kolory bazowe R/G/B jakie realnie daje dana
taśma, (b) suwak/przykład mieszanych barw z tych samych 3 kanałów, (c) dopisek wyjaśniający liczbę
teoretycznych kombinacji vs realną rozróżnialność — dokładnie zgodnie z tym, o co prosił autor.
Technicznie prosty do zrobienia w CSS/JS (gradient/mieszanie RGB to podstawowa operacja, nie wymaga
zewnętrznych danych).

---

## 7. Rodzaje diod wg konstrukcji — SMD vs COB (rozszerzenie Sekcji 2.1)

`[FAKT]` Dwa fundamentalnie różne podejścia do budowy taśmy:

- **SMD (Surface-Mounted Device)** — pojedyncze, dyskretne diody w małych obudowach, rozstawione co
  określoną odległość (np. co 1,67 cm przy 60 LED/m). Gołym okiem widać pojedyncze punkty światła,
  szczególnie z bliska lub przy niskiej gęstości.
- **COB (Chip-on-Board)** — setki mikroskopijnych chipów naniesionych bezpośrednio na podłoże,
  pokryte wspólną warstwą fosforu — efekt to ciągła linia światła bez widocznych punktów, nawet
  z bliska.

**Plusy/minusy COB względem SMD:**
- (+) Brak efektu "kropek światła", bardziej równomierne oświetlenie.
- (+) Zwykle wyższe CRI (lepsze oddanie kolorów).
- (+) Lepsze rozproszenie ciepła na jednostkę powierzchni (dużo małych źródeł zamiast kilku dużych).
- (−) Nie da się wymienić/naprawić pojedynczego uszkodzonego punktu — uszkodzenie fragmentu COB
  zwykle wymaga wymiany całego odcinka.
- (−) Węższy wybór wersji kolorowych/adresowalnych (COB dominuje w segmencie biały/CCT).
- (−) Zwykle droższe niż porównywalna taśma SMD.

---

## 8. Algorytm: spadek napięcia i rozmieszczenie punktów zasilania

To jest odpowiedź na konkretną prośbę z rozmowy: jak policzyć, co ile metrów trzeba "wstrzyknąć"
zasilanie na długiej trasie taśmy LED, żeby światło było mocne i równomierne na całej długości, oraz
jakie są patenty na podłączenie z dwóch końców.

### 8.1 Dlaczego to w ogóle problem

`[FAKT]` Taśma LED to w istocie długi, cienki przewód (miedziana ścieżka na taśmie FPC) z wieloma
małymi odbiornikami (diodami) rozłożonymi wzdłuż niej. Zasilając taśmę z jednego końca, prąd
płynący do dalszych diod musi pokonać rosnącą rezystancję ścieżki miedzianej — **każdy kolejny
odcinek taśmy dostaje niższe napięcie niż poprzedni**, więc diody na końcu długiego odcinka świecą
zauważalnie słabiej i mają inny odcień (przy niższym napięciu LED świeci nie tylko słabiej, ale
często lekko przesuwa się barwa).

### 8.2 Wzór (echo I=P/V, ten sam rdzeń co reszta aplikacji)

Dla jednostronnego zasilania odcinka taśmy o długości L:

```
ΔV(x) = I(x) × R_taśmy_na_metr × x
```

gdzie `I(x)` to prąd płynący przez przekrój taśmy w punkcie x (maleje wzdłuż taśmy, bo po drodze
"odpływa" do kolejnych diod) — dla uproszczenia, przy założeniu równomiernego poboru prądu na całej
długości, spadek napięcia na KOŃCU odcinka jednostronnie zasilanego wynosi w przybliżeniu:

```
ΔV_koniec ≈ (I_całkowite × R_taśmy_na_metr × L) / 2
```

(dzielenie przez 2 wynika z tego, że prąd maleje liniowo wzdłuż odcinka przy równomiernym poborze —
to standardowe przybliżenie dla obciążenia rozłożonego, analogiczne do zasilania szyny z
rozproszonym poborem prądu). `[FAKT — elektrotechnika, przybliżenie dla obciążenia rozłożonego
równomiernie]`

gdzie:
- `I_całkowite [A]` = `moc_taśmy_na_metr [W/m] × L [m] / V_nominalne [V]` (ten sam wzór I=P/V co
  rdzeń reszty tej aplikacji)
- `R_taśmy_na_metr [Ω/m]` — rezystancja jednego metra ścieżki miedzianej taśmy (dwie żyły: + i −)

`[TYPOWA WARTOŚĆ, DO WERYFIKACJI per konkretny produkt]` Typowa rezystancja ścieżki miedzianej
standardowej taśmy 10mm (obie żyły łącznie) mieści się orientacyjnie w zakresie **0,1-0,3 Ω/m** —
zależy od grubości miedzi (producenci rzadko podają tę wartość wprost na etykiecie; to jest
dokładnie ten typ danej, którą przed wejściem do Biblii trzeba by potwierdzić kartą katalogową
konkretnego, popularnego produktu, zamiast zostawiać jako wartość ogólną).

### 8.3 Przykład liczbowy `[ZAŁOŻENIE do ilustracji]`

Taśma 12V, 14,4 W/m, odcinek 5 m, R_taśmy ≈ 0,2 Ω/m (założenie):
- I_całkowite = (14,4 × 5) / 12 = 6,0 A
- ΔV_koniec ≈ (6,0 × 0,2 × 5) / 2 = 3,0 V
- Spadek względny: 3,0 / 12 = **25%** — daleko powyżej akceptowalnego progu (typowo przyjmuje się
  max. 5-10% spadku dla oświetlenia, żeby różnica jasności była niezauważalna gołym okiem).

Ta sama taśma na 24V (przy tej samej mocy/m, ale 2× mniejszym prądzie):
- I_całkowite = (14,4 × 5) / 24 = 3,0 A
- ΔV_koniec ≈ (3,0 × 0,2 × 5) / 2 = 1,5 V
- Spadek względny: 1,5 / 24 = **6,25%** — **4× lepiej niż na 12V** przy tej samej mocy/m, bo spadek
  napięcia skaluje się z KWADRATEM prądu przy stałej mocy (I zmniejszone 2×, a spadek zależy od I
  liniowo, ale to samo I wynika z podzielenia mocy przez V — więc niższe napięcie systemowe = z
  automatu gorsza sytuacja z zasilaniem długich tras, dokładnie ta sama logika co w module "Dobór
  napięcia systemowego": wyższe napięcie = mniejszy prąd = mniejsze straty).

### 8.4 Reguła: maksymalna długość odcinka jednostronnie zasilanego

Przekształcając wzór z 8.2, dla dopuszczalnego spadku procentowego `d%`:

```
L_max = sqrt( (2 × d% × V_nominalne²) / (moc_na_metr × R_taśmy_na_metr) )
```

`[OCENA INŻYNIERSKA — wyprowadzone z 8.2, nie zmyślona stała]` To jest dokładnie ten typ wzoru,
który powinien trafić do przyszłego kalkulatora — biorąc napięcie, moc/m i dopuszczalny spadek jako
input użytkownika (analogicznie do pól już istniejących w Etapie C modułu "Dobór napięcia"), i
zwracając rekomendowany rozstaw punktów zasilania.

### 8.5 Patenty na podłączenie — zasilanie z dwóch końców i punkty pośrednie

`[FAKT / dobra praktyka branżowa]` Trzy podstawowe strategie na długich trasach:

1. **Zasilanie tylko z jednego końca (domyślne, najgorsze na dłuższych trasach).** Najprostsze, ale
   spadek napięcia kumuluje się liniowo do końca odcinka — nadaje się tylko na krótkie odcinki
   (patrz L_max wyżej).

2. **Zasilanie z obu końców jednocześnie ("power feed at both ends").** Ten sam odcinek zasilony
   równolegle z dwóch stron (dodatkowy przewód zasilający doprowadzony do drugiego końca taśmy,
   z tego samego zasilacza lub równoległej gałęzi). Efekt: maksymalny spadek napięcia występuje
   teraz w **środku** odcinka, a nie na końcu, i jest w przybliżeniu **4× mniejszy** niż przy
   zasilaniu jednostronnym tej samej długości (bo efektywnie każda "połówka" odcinka jest zasilana
   jak niezależny, o połowę krótszy odcinek jednostronny, a spadek skaluje się z kwadratem
   długości). Prosty i tani sposób na 2× wydłużenie zasięgu przy tym samym problemie ze spadkiem.

3. **Wstrzykiwanie zasilania w punktach pośrednich ("power injection").** Zamiast ciągnąć jeden
   długi odcinek, do taśmy co określony dystans (obliczony wg 8.4) doprowadza się dodatkowy
   przewód zasilający równolegle do istniejącej ścieżki miedzianej taśmy — każdy taki punkt
   "resetuje" napięcie z powrotem do wartości nominalnej. To rozwiązanie stosowane przy bardzo
   długich instalacjach (listwy sufitowe biegnące przez cały dom), gdzie nawet zasilanie z dwóch
   końców by nie wystarczyło.

**Rekomendacja praktyczna:** dla krótkich odcinków (do L_max z 8.4) — zasilanie jednostronne
wystarczy. Dla odcinków 2× dłuższych niż L_max — zasilanie z obu końców. Dla bardzo długich tras
(kilkanaście-kilkadziesiąt metrów) — punkty wstrzykiwania co L_max, niezależnie od tego, skąd
fizycznie prowadzony jest główny przewód zasilający.

---

## 9. Notatki UI dla przyszłego kalkulatora/doradcy (Krok 3 — po akceptacji)

Zebrane w jednym miejscu wymagania wizualne z rozmowy, żeby nie zgubić ich przy przechodzeniu do
implementacji:

1. **Suwak CCT (2700K-8000K)** ze zdjęciem/wizualizacją przykładowego pomieszczenia zmieniającą
   barwę na żywo (nakładka koloru wg algorytmu CCT→RGB, np. Tanner Helland — publiczny, sprawdzalny
   wzór, patrz Sekcja 5).
2. **Pasek RGB/RGBW na czarnym tle** pokazujący realne kolory bazowe taśmy + dopisek o
   teoretycznej liczbie kombinacji vs realnej rozróżnialności (Sekcja 6.3).
3. **Kalkulator L_max / rozstawu punktów zasilania** wg wzoru z Sekcji 8.4, z polami analogicznymi
   do już istniejącego Etapu C modułu "Dobór napięcia" (napięcie, moc/m, długość, dopuszczalny
   spadek %).
4. **Selektor rodzaju taśmy** (napięcie × typ chipa × gęstość × IP) prowadzący do rekomendacji,
   podobnie jak katalog odbiorników w Etapie B modułu "Dobór napięcia".
5. **Porównanie biel vs RGBW** jako Wzorzec B (karty porównawcze), z jawnym ostrzeżeniem o gorszym
   CRI mieszanej bieli (Sekcja 4.2).

---

## 10. Podsumowanie — checklist zakupowy dla użytkownika

Docelowa treść na koniec modułu (po akceptacji), w duchu "żeby nie miał problemu w sklepie":

1. Jakie napięcie ma system (12/24/48V)? → taśma musi być pod TO SAMO napięcie, bez przejściówek.
2. Ile światła (lm) i jakiego typu (funkcjonalne czy dekoracyjne)? → wpływa na wybór gęstości
   LED/m i typu chipa.
3. Głównie biel czy potrzebny kolor? → Single White/CCT vs RGBW vs RGBIC (Sekcja 4, 6).
4. Jaka temperatura barwowa pasuje do pomieszczenia? → Sekcja 5.
5. Gdzie będzie montowana (sucho/wilgotno/zewnątrz)? → dobór IP (Sekcja 2.4), pamiętając o wpływie
   na jasność i żywotność.
6. Jak długa trasa? → sprawdzić L_max (Sekcja 8.4), zaplanować zasilanie dwustronne lub punkty
   wstrzykiwania, ZANIM się kupi jeden długi odcinek i będzie zaskoczenie przygasaniem na końcu.
7. Czy warto dopłacić za wyższą jakość chipów/CRI/driver? → tak, jeśli oświetlenie ma być
   długoterminowe i funkcjonalne (Sekcja 3) — nie, jeśli to krótkoterminowa dekoracja.

---

## Otwarte pytania / miejsca do uzupełnienia przez autora

- Konkretne wartości `R_taśmy_na_metr` dla realnych, popularnych produktów (Sekcja 8.2) — obecnie
  orientacyjny zakres, do potwierdzenia kartą katalogową, zanim trafi do Biblii jako twarda dana.
- Czy do dokumentu dodać konkretne, polecane marki/modele, czy zostać przy opisie ogólnym
  (neutralność wobec konkretnych producentów)?
- Czy w Sekcji 1 rozwinąć jeszcze temat sterowników/kontrolerów RGB (osobne zasilacze vs
  wbudowane w taśmę RGBIC) jako osobną podsekcję?
- Miejsce na wszystkie dodatkowe punkty, które autor chciał wnieść, a nie zostały jeszcze
  przekazane w rozmowie.
