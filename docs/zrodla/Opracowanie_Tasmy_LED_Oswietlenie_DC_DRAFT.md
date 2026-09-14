# Opracowanie: Taśmy LED i oświetlenie DC w systemach Off-Grid

**STATUS: SZKIC ROBOCZY — NIE JEST CZĘŚCIĄ BIBLII.** Ten dokument to "totalne opracowanie" na
prośbę autora (14.09.2026), poprzedzające ewentualne włączenie do Biblii projektu. Nie wdrażać do
`docs/god-book`/Biblii i nie budować kalkulatora na jego podstawie bez wyraźnej akceptacji autora.
Autor zapowiedział własne uzupełnienia — ten szkic jest punktem wyjścia do dyskusji, nie
gotowym, zamkniętym materiałem.

**[14.09.2026, runda 2]** Rozbudowany o drugą turę uzupełnień autora (FCOB, SPI/adresowalne
WS2811/WS2812B, okablowanie VCC/GND/DATA, kontrolery, dobór zasilacza 220V, ostrzeżenie o
zawyżaniu mocy przez producentów, pełna tabela IP jako przyszły zasób współdzielony całej apki,
pełny katalog typów rynkowych z AliExpress, złącza dedykowane vs lutowanie, doradca weryfikacji
taśmy po zakupie). Wciąż szkic — czeka na dalsze uzupełnienia i akceptację.

**[14.09.2026, runda 3]** Uzupełniona luka: Sekcja 6.5 opisywała tylko protokoły sterowania (SPI
vs PWM), nie realne sposoby sterowania oświetleniem (piloty, aplikacje, smart home, profesjonalne
protokoły). Dodana jako Sekcja 14 — **stub/zarys, świadomie niepełny**, do głębszego rozwinięcia w
kolejnej turze (na wyraźną prośbę autora: "potem będziemy to głębiej rozwijać"). Dodana też
propozycja struktury nawigacyjnej (hierarchia kafli/ekranów) w Sekcji 15.

**[14.09.2026, runda 4 — korekta]** Autor słusznie skorygował pierwszą wersję Sekcji 15: myliła
ona "kroki ścieżki zakupowej" z "materiałem edukacyjnym", efektywnie proponując jeden
ekran-wykład zamiast właściwego zastosowania już istniejącej w apce taksonomii Wzorców A-H.
Sekcja 15.3 poprawiona: rozdzielono **artykuły referencyjne (Wzorzec C, 10 niezależnych ekranów,
wejście po konkretną wiedzę bez wymuszonej kolejności)** od **osobnego, celowo chudego kreatora/
doradcy (Wzorzec D, tylko pytania→werdykt, z linkami do artykułów zamiast ich treści wklejonej
między krokami)**.

**[14.09.2026, runda 5 — doprecyzowanie]** Autor dodał trzeci wymiar: postrzeganą wartość apki dla
początkującego (liczba/nazwy widocznych kafelków, nie to, co ukryte w środku). Sekcja 15.3a: obok
artykułów i Kreatora, dodane **ekrany pochodne** — cienkie, jednozadaniowe nakładki na te same
funkcje kalkulatora (zero nowej logiki, czysty echo), po jednym na typową, nazwaną sytuację
początkującego (np. "jaka taśma do kuchni"). Pełny multi-ścieżkowy kreator z pierwotnej wersji
15.3 przemianowany na **Kreator Pro** — opcja dla zaawansowanych, nie domyślny punkt wejścia.

**[14.09.2026, runda 6]** Rozwinięta Sekcja 14 (dotąd świadomy zarys) do pełnej głębi: piloty
RF/IR, sterowanie WiFi/Bluetooth (z ryzykiem zależności od chmury producenta), integracje smart
home (Zigbee/Tuya/Matter/Home Assistant, z rozróżnieniem "działa z Tuya" od natywnej integracji),
profesjonalne magistrale DALI/KNX, ściemniacze DC, czujniki i harmonogramy, oraz konsekwencja
off-gridowa: stały pobór kontrolerów WiFi/chmurowych w trybie czuwania jako kategoria odbiornika
bazowego (echo Etapu B.2 modułu "Dobór napięcia").

**[14.09.2026, runda 7]** Dodana Sekcja 1.6a: taśmy LED "230V" z wbudowanym prostownikiem (High
Voltage LED Strip) — odpowiedź na pytanie autora, czy istnieją taśmy z "wlutowanym zasilaczem na
220V". Tak, to osobny, realny produkt (nie to samo co "gotowe oprawy" z 1.6) — prostownik
wbudowany segmentowo w samą elastyczną taśmę, bez centralnego zasilacza. Kluczowa, jawnie
wyróżniona różnica: to jedyna taśma w całym dokumencie, która NIE jest SELV — napięcie sieciowe
jest fizycznie obecne w samej taśmie, nie tylko w obudowie zasilacza. Tabela 1.1 i Sekcja 14.5
(ściemniacze) zaktualizowane z odnośnikiem. Dokument wciąż czeka na akceptację całości — przed nią
nic w kodzie/Biblii się nie zmienia.

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
jak rozmieścić zasilanie na długiej trasie żeby nie było "gaśnięcia" na końcu, jak dobrać zasilacz,
jak łączyć odcinki, jak sprawdzić taśmę po zakupie, i jak wygląda dana barwa światła w realnym
pomieszczeniu, zanim się ją kupi.

Docelowo (Krok 3, po akceptacji) ten materiał ma zasilić kalkulator/doradcę z żywym podglądem:
suwak CCT zmieniający na żywo barwę przykładowego pomieszczenia, pasek RGB/RGBW na czarnym tle
pokazujący realne możliwości kolorystyczne taśmy. Uwagi UI dla tego kroku są zebrane w Sekcji 12.

---

## 1. Rodzaje taśm LED wg napięcia zasilania

### 1.1 Tabela porównawcza

| Napięcie | Dostępność rynkowa | Typowa długość odcinka | Maks. długość jednego odcinka bez spadku napięcia* | Typowe zastosowanie | Bezpieczeństwo dotykowe |
|---|---|---|---|---|---|
| **12V DC** | Bardzo szeroka (najpopularniejsze) | 5 m (300/600 LED) | Krótka — patrz Sekcja 8 | Kampery, łodzie, dekoracje, meble, akcenty | SELV — bezpieczne, wolno dotykać |
| **24V DC** | Szeroka, rośnie | 5 m, coraz częściej 10 m | 2× dłuższa niż 12V przy tej samej mocy/m | Domy off-grid, dłuższe trasy, listwy sufitowe | SELV — bezpieczne |
| **36V DC** | Wąska nisza | 5 m | Pośrednia | Rzadkie, głównie profesjonalne/przemysłowe instalacje | SELV — bezpieczne |
| **48V DC** | Rosnąca (profesjonalny segment) | 5 m, projekty na 10-20 m | Najdłuższa z DC | Duże domy off-grid, linie oświetleniowe zintegrowane z magazynem 48V | Blisko granicy SELV (50V) — do przestrzegania |
| **230V AC** | Bardzo szeroka (gotowe oprawy ORAZ taśmy z wbudowanym prostownikiem — patrz 1.6a) | Dowolna (zasilanie z sieci/falownika) | Bez ograniczenia praktycznego (napięcie sieciowe) | Domy z falownikiem, gdy nie buduje się osobnej instalacji DC | Wymaga zabezpieczeń AC (RCD) — **nie wolno dotykać żył, a w taśmach 1.6a napięcie sieciowe jest w samej elastycznej taśmie, nie tylko w zasilaczu** |

*„Maks. długość bez spadku napięcia" — patrz algorytm w Sekcji 8; zależy od mocy taśmy na metr, nie jest stałą. Wyjątek: taśmy 230V (1.6a) nie mają tego problemu — patrz uzasadnienie tam.

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

**Ważne — powyższe dotyczy GOTOWYCH OPRAW (żarówki, listwy z wtyczką), nie taśmy LED jako takiej.
Sama taśma LED zasilana bezpośrednio 230V to inny, osobny produkt — patrz 1.6a.**

### 1.6a Taśmy LED "230V" z wbudowanym prostownikiem (High Voltage LED Strip) — TAK, to istnieje

Odpowiedź na pytanie wprost: **tak**, istnieją taśmy LED przeznaczone do podłączenia bezpośrednio
do sieci 230V, bez żadnego zewnętrznego zasilacza/transformatora — sprzedawane jako "High Voltage
LED Strip" / "230V LED Strip" / "Mains Voltage LED Strip". To **nie** jest to samo co "gotowa
oprawa z driverem" z 1.6 (tam driver siedzi w obudowie żarówki/listwy) — tu prostownik jest
wbudowany bezpośrednio w samą elastyczną taśmę, po kawałku, na całej jej długości.

**Jak to działa** `[FAKT]`: taśma jest podzielona na segmenty (typowo co kilka-kilkanaście cm,
`[TYPOWA WARTOŚĆ]` zależnie od producenta), a każdy segment ma własną, małą grupę diod
połączonych szeregowo (tyle diod w szeregu, żeby suma ich napięć przewodzenia z grubsza
odpowiadała wyprostowanemu napięciu sieci ~310V DC szczytowe) plus mały mostek prostowniczy
(4 diody prostownicze) i element ograniczający prąd (rezystor lub kondensator) — każdy segment
samodzielnie prostuje lokalnie napięcie sieciowe i ogranicza sobie prąd, **bez** centralnego
zasilacza w osobnej obudowie. Cięcie taśmy możliwe **tylko** w wyznaczonych miejscach na granicy
segmentu (mniej elastyczne niż w taśmach niskonapięciowych, gdzie czasem można ciąć gęściej).

**🔴 Kluczowa różnica bezpieczeństwa — to NIE jest SELV.** `[FAKT]` W przeciwieństwie do
WSZYSTKICH pozostałych opcji w tym dokumencie (12/24/36/48V DC — bezpieczne w dotyku, patrz tabela
1.1), w tej taśmie **realne napięcie sieciowe 230V jest obecne bezpośrednio w elastycznej
taśmie**, nie tylko w sztywnej obudowie zasilacza. Uszkodzony fragment, przecięte zakończenie bez
zaślepki, albo odsłonięty punkt lutowniczy stwarza realne ryzyko porażenia — jakościowo inny
poziom ryzyka niż reszta tego dokumentu. Wymaga: prawidłowego, szczelnego zakończenia
przewodów/wpustu kablowego, zaślepek na cięciach, ochrony różnicowoprądowej (RCD) na obwodzie, i
traktowania montażu z taką samą ostrożnością jak każdej innej instalacji 230V — nie tak
"swobodnie" jak przy taśmie 12V, którą można bezpiecznie dotykać gołymi rękami.

**Zaleta praktyczna — brak problemu spadku napięcia z Sekcji 8.** Ponieważ każdy segment
prostuje napięcie lokalnie z sieci, nie ma kumulującego się spadku napięcia wzdłuż długiej trasy
DC opisanego w Sekcji 8 — to właśnie dlatego w tabeli 1.1 kategoria 230V ma "brak ograniczenia
praktycznego" długości. To realna przewaga przy bardzo długich, jednolitych trasach (iluminacje
zewnętrzne, dekoracje na dużą odległość).

**Wady** `[OCENA INŻYNIERSKA]`: awaria jednego elementu w segmencie (np. mostka prostowniczego)
zwykle gasi cały ten segment naraz, nie pojedynczą diodę; ściemnianie wymaga ściemniacza
przeznaczonego do napięcia sieciowego (TRIAC, kompatybilnego z obciążeniem konkretnego segmentu),
nie prostej regulacji PWM jak w taśmach DC (patrz Sekcja 14.5); mniejsza elastyczność cięcia niż
w taśmach niskonapięciowych.

**Wniosek off-gridowy:** to wciąż napięcie sieciowe AC — w systemie off-gridowym nadal wymaga
falownika, dokładnie tak samo jak "gotowe oprawy" z 1.6, więc nie zmienia ogólnej rekomendacji
tego dokumentu (24V DC jako domyślny wybór off-gridowy, Sekcja 1.3/4.3) — ale to inny, realny
produkt, na który kupujący trafi na AliExpress i musi rozpoznać, że to nie zwykła taśma
niskonapięciowa z osobnym zasilaczem, tylko coś, co ma sieciowe napięcie "w środku" na całej
długości.

### 1.7 Nazewnictwo rynkowe — jak wygląda oferta sklepu/AliExpress

`[FAKT — konwencja sprzedażowa branży]` W realnej ofercie sklepu (patrz zrzut ekranu z rozmowy)
taśmy są kategoryzowane wg **koloru/trybu światła**, niezależnie od napięcia i typu chipa opisanych
wyżej. Typowy zestaw kategorii, od najprostszej do najbardziej złożonej:

| Kategoria w sklepie | Co to znaczy | Odnośnik w tym dokumencie |
|---|---|---|
| Warm White 3000K | Jednokolorowa biel, stała temperatura barwowa ~3000K | Sekcja 4.1, 5 |
| Nature White 4000K | Jednokolorowa biel, stała temperatura barwowa ~4000K | Sekcja 4.1, 5 |
| Cool White 6000K | Jednokolorowa biel, stała temperatura barwowa ~6000K | Sekcja 4.1, 5 |
| CCT (Dual White) | Dwa kanały bieli (ciepła+zimna), regulowana temperatura barwowa | Sekcja 4.1 |
| RGB | Trzy kanały kolorowe (R, G, B), bez dedykowanego białego | Sekcja 6.2 |
| RGBW | Trzy kanały kolorowe + jeden dedykowany biały | Sekcja 6.2 |
| RGBCCT (czasem RGBWW) | Trzy kanały kolorowe + dwa kanały bieli (ciepła+zimna) — najbardziej uniwersalna, ale najdroższa i elektronicznie najbardziej złożona | Sekcja 4.1 (jako RGBWW), 6.2 |

**Liczba LED podana w ofercie (np. "608 Leds", "756 Leds", "840 Leds") to LICZBA CAŁKOWITA na
CAŁYM odcinku** (zwykle 5 m), **nie liczba na metr** — trzeba podzielić przez długość, żeby dostać
LED/m (patrz Sekcja 2.2 — tam pełne wyjaśnienie i przykład liczbowy).

`[TYPOWA WARTOŚĆ / WAŻNE ZASTRZEŻENIE — konwencja bywa różna u różnych sprzedawców, do
weryfikacji per oferta]` Przy taśmach wielokanałowych (CCT, RGB, RGBW, RGBCCT) podana "liczba LED"
często liczy **każdą pojedynczą diodę koloru osobno**, nie "pozycję" na taśmie. Przykład: taśma
RGBCCT ma w jednej pozycji montażowej zwykle 5 osobnych diod (R+G+B+ciepła biel+zimna biel) — więc
"840 LED" na 5m dla RGBCCT może oznaczać tylko ok. 168 pozycji/m (840 ÷ 5 diod na pozycję ÷ 5m),
podczas gdy "608 LED" na 5m dla zwykłej bieli (1 dioda/pozycja) to ok. 121,6 pozycji/m. **Nie da
się więc porównywać "liczby LED" między różnymi kategoriami kolorystycznymi wprost** — trzeba
znać liczbę kanałów, żeby porównanie miało sens. To jeden z częstszych błędów przy porównywaniu
ofert na AliExpress.

---

## 2. Jak czytać oznaczenia taśm LED (rozszyfrowanie dla laika)

To jest najczęstszy powód nieporozumień przy zakupie. Poniżej rozszyfrowanie typowej etykiety
produktu, np.: `SMD5050 RGB 12V 14.4W/m 60LED/m IP65 5m`.

### 2.1 Kod chipa: `SMDxxxx` / `COB` / `FCOB`

`SMD` (Surface-Mounted Device) + 4 cyfry = **wymiary pojedynczej diody w dziesiątych częściach
milimetra**. `[FAKT — konwencja nazewnicza branży]`

| Oznaczenie | Wymiar chipa | Typowa moc/diodę | Charakterystyka |
|---|---|---|---|
| SMD2835 | 2,8 × 3,5 mm | `[TYPOWA WARTOŚĆ]` 0,2 W | Najnowsza generacja małych chipów, dobra efektywność świetlna (lm/W), niska cena, dominuje w tanich taśmach 2020+ |
| SMD3528 | 3,5 × 2,8 mm | `[TYPOWA WARTOŚĆ]` 0,06-0,1 W | Starsza, słabsza generacja — mało światła, głównie dekoracyjne/ambientowe zastosowania, dziś raczej przestarzała |
| SMD5050 | 5,0 × 5,0 mm | `[TYPOWA WARTOŚĆ]` 0,2 W (3 diody w jednym chipie — stąd "5050" bywa jaśniejsze niż 2835 przy tej samej liczbie chipów/m) | Popularna w taśmach RGB (3 diody = R+G+B w jednej obudowie), większa niż 2835, więcej ciepła na chip |
| SMD5630/5730 | 5,6-5,7 × 3,0 mm | `[TYPOWA WARTOŚĆ]` 0,5 W | Mocniejsze, jaśniejsze pojedyncze diody, używane gdy potrzeba dużo światła z mniejszej liczby chipów |
| COB (Chip-on-Board) | Brak pojedynczych punktów — ciągła "linia światła" | Moc liczona na metr, nie na chip | Setki mikro-chipów naniesionych bezpośrednio na sztywniejsze podłoże, pokryte wspólną warstwą fosforu — patrz Sekcja 7 |
| FCOB (Flexible COB) | Jak COB, ale na elastycznym podłożu | Moc liczona na metr | Nowsza, elastyczna generacja COB (dominuje dziś w ofertach "COB LED strip" na AliExpress) — daje się giąć jak zwykła taśma SMD, zachowując efekt jednolitej linii światła bez kropek. Patrz Sekcja 7.1 |

**Dlaczego to ma znaczenie przy zakupie:** ta sama etykieta "60 LED/m" znaczy zupełnie co innego
przy SMD2835 (słabsze diody, ale gęściej upakowane) niż przy SMD5050 (mocniejsze diody, więcej
ciepła). Liczba LED/m bez znajomości typu chipa **nic nie mówi o rzeczywistej jasności**.

### 2.2 Gęstość: `60LED/m`, `120LED/m`, `240LED/m` — i jak to się przekłada na długość odcinka

`[FAKT]` Liczba diod na metr bieżący taśmy. Więcej diod na metr = więcej światła, ale też więcej
ciepła i wyższy pobór prądu na metr — przekłada się wprost na W/m (patrz 2.3) i na dystans między
punktami zasilania (Sekcja 8, bo mniejszy dystans przy wyższej mocy/m).

`[TYPOWA WARTOŚĆ]` Typowe stopnie gęstości na rynku: 30, 60, 96, 120, 180, 240, 300, a nawet 480
LED/m w segmencie "high density". Powyżej ~120 LED/m różnica jasności "gołym okiem" jest coraz
mniej odczuwalna względem rosnącego kosztu i ciepła — punkt opłacalności zależy od zastosowania
(oświetlenie funkcjonalne vs efekt "linii światła bez punktów" przy bardzo dużej gęstości).

**Jak liczyć LED/m z oferty sklepu (patrz też Sekcja 1.7):** oferty często podają liczbę CAŁKOWITĄ
na cały odcinek (zwykle 5 m), nie na metr. Przykład `[FAKT — arytmetyka]`:

```
608 LED na odcinku 5 m → 608 / 5 = 121,6 LED/m
```

To jest właśnie ten typ przeliczenia, który powinien trafić do przyszłego kalkulatora (Sekcja 12)
jako prosty konwerter "LED na odcinku → LED/m", żeby użytkownik mógł porównywać oferty pisane
różnymi konwencjami.

**Czy więcej (tańszych) czipów = gorsza jakość? — odpowiedź na wprost zadane pytanie.**
`[OCENA INŻYNIERSKA — nie twarda stała, ale spójna z fizyką opisaną w Sekcji 3]` Intuicja
autora jest zasadniczo słuszna, z ważnym doprecyzowaniem: **liczba chipów na metr i JAKOŚĆ
chipów to dwie niezależne osie, nie jedna.**

- Wyższa gęstość (więcej LED/m) **poprawia** równomierność światła (mniej widocznych "kropek") i
  pozwala uzyskać więcej lumenów/m przy tym samym prądzie na chip — to realna zaleta jakości
  *światła*.
- Ale wyższa gęstość **nie mówi nic** o jakości samych chipów (klasa/binning producenta — patrz
  Sekcja 3, punkt 2) ani o tym, czy producent nie "podkręca" (overdrive) prądu, żeby z tańszych,
  gorszych chipów wycisnąć deklarowaną jasność kosztem żywotności (Sekcja 3, punkt 3).
- **Typowy, realny scenariusz na AliExpress:** tania taśma z dużą liczbą chipów/m, ale niskiej
  klasy i przewymiarowanym prądem, może na starcie wyglądać równie jasno jak droższa taśma z
  mniejszą liczbą lepszych chipów — różnica ujawnia się dopiero po miesiącach (szybszy spadek
  jasności, żółknięcie, część diod gaśnie pojedynczo). To dokładnie zjawisko opisane w Sekcji 3
  ("żywotność to nie tylko cyfra na etykiecie").

**Wniosek:** liczba LED/m to dobry wskaźnik *potencjalnej jasności i równomierności*, ale **zły
samodzielny wskaźnik jakości/trwałości** — tej nie da się ocenić z samej specyfikacji, tylko
pośrednio: marka/renoma sprzedawcy, cena względem konkurencji (podejrzanie tania taśma przy tej
samej specyfikacji = sygnał ostrzegawczy), CRI podane wprost (Sekcja 2.6), i realny test po
zakupie (Sekcja 11).

### 2.3 Moc: `14.4W/m`

`[FAKT]` Deklarowana moc pobierana przez metr taśmy przy napięciu znamionowym. To jest **kluczowa
liczba do obliczeń** (Etap B tego modułu, Sekcja 8 tego dokumentu) — nie liczba LED/m. Dwie taśmy
o tej samej liczbie LED/m mogą mieć różną moc/m w zależności od typu chipa i prądu, jakim są
zasilane przez producenta.

**Uwaga — deklarowana moc bywa niewiarygodna, w obie strony.** Patrz Sekcja 9.3 (zawyżanie/
zaniżanie mocy przez producentów) i Sekcja 11 (jak samodzielnie zmierzyć rzeczywisty pobór).

### 2.4 Stopień ochrony: `IPxx` — pełna tabela

`[FAKT — norma IEC 60529]` Dwie cyfry: pierwsza = ochrona przed ciałami stałymi/pyłem (0-6), druga
= ochrona przed wodą (0-9K).

**Pierwsza cyfra (ciała stałe/pył):**

| Cyfra | Ochrona |
|---|---|
| 0 | Brak ochrony |
| 1-2 | Ochrona przed dużymi ciałami obcymi/palcami (rzadko istotne dla taśm LED) |
| 3-4 | Ochrona przed narzędziami/drutami/małymi ciałami obcymi |
| 5 | Ochrona przed pyłem w stopniu ograniczającym (dust-protected) |
| 6 | Pełna ochrona przed pyłem (dust-tight) |

**Druga cyfra (woda):**

| Cyfra | Ochrona | Typowe zastosowanie dla taśm LED |
|---|---|---|
| 0 | Brak ochrony | Wnętrza całkowicie suche |
| 1-3 | Krople/bryzgi pionowe/kątowe | Rzadko spotykane samodzielnie w taśmach LED |
| 4 | Bryzgi wody z każdego kierunku | Kuchnie (z dala od zlewu), łazienki poza strefą natrysku |
| 5 | Strugi wody pod ciśnieniem z dyszy | Pomieszczenia narażone na czyszczenie wodą |
| 6 | Silne strugi wody (fale) | Zewnętrze osłonięte, tarasy pod zadaszeniem |
| 7 | Czasowe zanurzenie (do 1m, do 30 min) | W pełni zewnętrzne, ekspozycja na deszcz, ogród |
| 8 | Ciągłe zanurzenie (głębokość/czas wg deklaracji producenta) | Oczka wodne, akwaria, elementy pod wodą na stałe |
| 9K | Silny strumień wody pod wysokim ciśnieniem i temperaturą (myjka ciśnieniowa) | Zastosowania przemysłowe/**agro** — pomieszczenia inwentarskie, szklarnie czyszczone myjką ciśnieniową, kuchnie przemysłowe |

**Praktyczne zestawienie "gdzie stosować" (najczęściej spotykane w ofertach taśm LED):**

| Oznaczenie | Gdzie stosować | Gdzie NIE stosować |
|---|---|---|
| IP20 | Wnętrza suche: meble, wnęki, sufity podwieszane, pokoje, salony | Kuchnia przy zlewie, łazienka, na zewnątrz |
| IP44 | Kuchnia (z dala od zlewu/okapu z parą), łazienka poza strefą natrysku, weranda osłonięta | Bezpośredni kontakt z wodą, zanurzenie, pełny zewnątrz |
| IP65 | W pełni zewnętrzne pod zadaszeniem, łodzie, kampery, tarasy, elewacje | Zanurzenie w wodzie |
| IP67 | Ogród bez osłony, bezpośrednia ekspozycja na deszcz, czasowe zalanie | Stałe zanurzenie |
| IP68 | Oczka wodne, elementy stale pod wodą, akwaria | — (najwyższy praktyczny poziom dla taśm LED) |
| IP69K | Mycie pod wysokim ciśnieniem/temperaturą — hale inwentarskie, szklarnie, kuchnie przemysłowe | Rzadkie i drogie w segmencie hobbystycznym — zwykle niepotrzebne w domu |

`[TYPOWA WARTOŚĆ / PUŁAPKA ZAKUPOWA]` Taśmy IP65+ mają zwykle dodatkową powłokę silikonową na
wierzchu — to **obniża jasność o kilka do kilkunastu procent** względem tej samej taśmy w IP20 i
**pogarsza odprowadzanie ciepła** (silikon izoluje termicznie) — realny wpływ na żywotność, patrz
Sekcja 3.

**Nota architektoniczna (Krok 3, dla programisty):** ta tabela IP powinna zostać zapisana jako
**jeden współdzielony zasób w `lib/core/`** (np. `lib/core/shared/ip-ratings.ts`), a nie
duplikowana osobno w module oświetlenia i gdziekolwiek indziej w aplikacji, gdzie IP już się
pojawia lub pojawi (obudowy elektroniki, skrzynki przyłączeniowe, czujniki zewnętrzne itd.) —
zgodnie z zasadą "generyczny silnik + tabela parametrów zamiast duplikowania" (`docs/standards`,
Zasada 5) i zakazem `lib/`→`app/` w drugą stronę. Każdy moduł miałby wtedy tylko import tej samej
tabeli i renderowanie jej we własnym UI, bez przepisywania opisów.

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

### 2.7 Okablowanie — ile żył ma taśma i co która robi

`[FAKT]` Liczba przewodów wychodzących z taśmy zależy od typu sterowania:

**Taśmy analogowe (jeden sygnał PWM na cały odcinek naraz)** — liczba żył = liczba kanałów + 1
(wspólny plus lub minus):
| Typ taśmy | Liczba żył | Oznaczenia |
|---|---|---|
| Single White / CCT-bez-regulacji | 2 | `+`, `−` |
| CCT (Dual White) | 3 | `+` (wspólny), `WW` (ciepła), `CW` (zimna) |
| RGB | 4 | `+` (wspólny), `R`, `G`, `B` |
| RGBW | 5 | `+` (wspólny), `R`, `G`, `B`, `W` |
| RGBCCT | 6 | `+` (wspólny), `R`, `G`, `B`, `WW`, `CW` |

**Taśmy adresowalne/cyfrowe (SPI, np. WS2812B)** — inna zasada, tylko **3 żyły niezależnie od
liczby kolorów**, bo sterowanie nie odbywa się osobnym przewodem na kanał, tylko cyfrowym sygnałem
na jednej linii danych:
| Oznaczenie | Rola |
|---|---|
| VCC | Zasilanie (5V/12V/24V — zależnie od modelu) |
| GND | Masa (wspólna dla zasilania i sygnału) |
| DATA (czasem `DI`/`DIN`) | Cyfrowy sygnał sterujący, niosący informację o kolorze KAŻDEGO pojedynczego chipa z osobna |

Pełne wyjaśnienie różnicy i konkretnych układów (WS2811 vs WS2812B) — patrz Sekcja 6.4.

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
   niezawyżony prąd = dłuższa żywotność. **To samo zjawisko odpowiada za nieprawdziwe wartości mocy
   na etykiecie — patrz Sekcja 9.3.**
4. **Jakość driverów/zasilaczy.** Tania, niestabilizowana elektronika zasilająca (skoki napięcia,
   tętnienia) skraca żywotność diod i elektroniki sterującej (szczególnie w taśmach RGB/RGBIC z
   wbudowanym układem sterującym na taśmie). Patrz Sekcja 9 — dobór zasilacza.
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
- **RGBWW / RGBCCT** — pięć kanałów: R, G, B + ciepła biel + zimna biel (najbardziej uniwersalne,
  ale najdroższe i najbardziej złożone elektronicznie; patrz też Sekcja 1.7).

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

### 6.2 RGB vs RGBW vs RGBCCT vs RGBIC — różnice

**Ważne rozróżnienie na start:** RGBIC to **osobna, samodzielna kategoria produktu**, nie "RGB z
dodanym IC" doklejone do zwykłej taśmy — to zupełnie inna architektura elektroniczna (patrz 6.4).
Nie należy jej traktować jako podtypu zwykłego RGB.

| Typ | Kanały | Możliwości | Ograniczenie |
|---|---|---|---|
| RGB | R, G, B | Pełna paleta kolorów (mieszanie 3 barw) | Słaba/nienaturalna biel (patrz 4.2), cała taśma świeci jednym kolorem naraz |
| RGBW | R, G, B, W (osobny biały chip) | Pełna paleta kolorów + osobna, czysta biel | Nadal cała taśma jednym kolorem/trybem naraz |
| RGBCCT | R, G, B, ciepła biel, zimna biel | Pełna paleta kolorów + regulowana temperatura barwowa bieli | Najdroższa, najbardziej złożone okablowanie (6 żył, patrz 2.7), nadal cała taśma jednym trybem naraz |
| RGBIC (adresowalne, np. WS2812B) | Cyfrowe, każdy segment osobno | Różne kolory na różnych fragmentach TEJ SAMEJ taśmy jednocześnie, efekty "płynące", animacje | Droższe, bardziej złożona elektronika (każdy segment to osobny mikroukład sterujący), wyższa awaryjność, wymaga dedykowanego kontrolera SPI |

### 6.3 Notatka do UI (Krok 3)

Pasek koloru na czarnym tle pokazujący: (a) czyste kolory bazowe R/G/B jakie realnie daje dana
taśma, (b) suwak/przykład mieszanych barw z tych samych 3 kanałów, (c) dopisek wyjaśniający liczbę
teoretycznych kombinacji vs realną rozróżnialność — dokładnie zgodnie z tym, o co prosił autor.
Technicznie prosty do zrobienia w CSS/JS (gradient/mieszanie RGB to podstawowa operacja, nie wymaga
zewnętrznych danych).

### 6.4 Taśmy adresowalne (SPI) — WS2811 vs WS2812B

`[FAKT]` To jest inna rodzina produktów niż zwykłe analogowe RGB/RGBW/RGBCCT (patrz 6.2) — zamiast
jednego sygnału PWM sterującego całą taśmą naraz, sygnał cyfrowy (protokół zbliżony do SPI, choć
nie identyczny co do taktowania — stąd potoczne określenie "taśmy SPI") niesie po jednej linii
DATA instrukcje koloru dla KAŻDEGO pojedynczego chipa z osobna, po kolei wzdłuż taśmy.

**WS2811 vs WS2812B — kluczowa różnica konstrukcyjna:**
| Układ | Konstrukcja | Charakterystyka |
|---|---|---|
| WS2811 | Osobny, zewnętrzny chip sterujący obok grupy diod (typowo steruje 1-3 zwykłymi diodami SMD5050 w jednym punkcie) | Starszy, bardziej rozpowszechniony w tańszych taśmach, chip sterujący widoczny jako osobny mały element na taśmie |
| WS2812B | Chip sterujący **zintegrowany wewnątrz obudowy pojedynczej diody LED** (IC-in-LED) | Nowszy, bardziej kompaktowy, mniejsza taśma na tę samą liczbę adresowalnych punktów, dziś powszechny standard "adresowalnych" taśm/pasków |

`[TYPOWA WARTOŚĆ]` Inne popularne układy tej samej rodziny spotykane na rynku: SK6812 (podobny do
WS2812B, czasem z dodatkowym kanałem białym — czyli "RGBW adresowalne"), APA102/SK9822 (używają
osobnej linii zegara obok DATA — prawdziwe SPI, szybsze i mniej podatne na zakłócenia czasowe niż
protokół WS28xx, ale droższe).

**Konsekwencja praktyczna:** taśmy adresowalne wymagają dedykowanego kontrolera SPI (nie zwykłego
pilota RGB) oraz — przy dłuższych odcinkach — dodatkowego zasilania wstrzykiwanego bezpośrednio do
linii `+`/`GND` (patrz Sekcja 8), bo sama linia DATA nie przenosi mocy, tylko sygnał.

### 6.5 Kontrolery — SPI/cyfrowe vs PWM/analogowe

`[FAKT]` Dwie zasadniczo różne rodziny sterowników:

- **Kontrolery PWM/analogowe** — dla zwykłych taśm Single White/CCT/RGB/RGBW/RGBCCT (Sekcja 2.7).
  Sterują jasnością każdego kanału przez szybkie przełączanie napięcia (modulacja szerokości
  impulsu) — cała taśma zmienia stan naraz. Prostsze, tańsze, mniej podatne na awarię.
- **Kontrolery SPI/cyfrowe** — dla taśm adresowalnych (Sekcja 6.4). Wysyłają cyfrowy strumień
  danych opisujący kolor każdego pojedynczego chipa z osobna. Umożliwiają animacje/efekty
  "płynące", ale wymagają zgodności protokołu z konkretnym chipem taśmy (np. kontroler pod
  WS2812B nie zawsze obsłuży poprawnie APA102 bez zmiany ustawień/oprogramowania) — to częsty
  błąd zakupowy: kupno taśmy i kontrolera od różnych producentów bez sprawdzenia zgodności
  protokołu.

---

## 7. Rodzaje diod wg konstrukcji — SMD vs COB vs FCOB (rozszerzenie Sekcji 2.1)

`[FAKT]` Trzy podejścia do budowy taśmy:

- **SMD (Surface-Mounted Device)** — pojedyncze, dyskretne diody w małych obudowach, rozstawione co
  określoną odległość (np. co 1,67 cm przy 60 LED/m). Gołym okiem widać pojedyncze punkty światła,
  szczególnie z bliska lub przy niskiej gęstości.
- **COB (Chip-on-Board)** — setki mikroskopijnych chipów naniesionych bezpośrednio na podłoże,
  pokryte wspólną warstwą fosforu — efekt to ciągła linia światła bez widocznych punktów, nawet
  z bliska. Historycznie budowane na sztywniejszym podłożu.
- **FCOB (Flexible COB)** — ta sama idea co COB, ale na elastycznym podłożu taśmy, więc daje się
  giąć tak samo jak zwykła taśma SMD. To właśnie FCOB dominuje dziś w ofertach reklamowanych po
  prostu jako "COB LED strip"/"dot-free" na AliExpress — warto sprawdzać w opisie, czy sprzedawca
  ma na myśli prawdziwe FCOB, czy zwykłą taśmę SMD o bardzo wysokiej gęstości reklamowaną
  marketingowo jako "efekt COB".

**Plusy/minusy COB/FCOB względem SMD:**
- (+) Brak efektu "kropek światła", bardziej równomierne oświetlenie.
- (+) Zwykle wyższe CRI (lepsze oddanie kolorów).
- (+) Lepsze rozproszenie ciepła na jednostkę powierzchni (dużo małych źródeł zamiast kilku dużych).
- (−) Nie da się wymienić/naprawić pojedynczego uszkodzonego punktu — uszkodzenie fragmentu COB/
  FCOB zwykle wymaga wymiany całego odcinka.
- (−) Węższy wybór wersji kolorowych/adresowalnych (COB/FCOB dominuje w segmencie biały/CCT).
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

**To NIE jest wada produktu** — to podstawowa fizyka, dotycząca każdej taśmy LED na świecie, o
odpowiedniej długości i bez wstrzykiwania zasilania. Patrz też Sekcja 11 — jak to odróżnić od
prawdziwej wady fabrycznej.

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

## 9. Dobór zasilacza 220V→DC dla taśm LED

### 9.1 Jak policzyć wymaganą moc zasilacza

`[FAKT]` Suma mocy wszystkich podłączonych do jednego zasilacza odcinków taśmy (`moc_na_metr ×
długość`, Sekcja 2.3) plus pobór ewentualnych kontrolerów/wzmacniaczy sygnału podłączonych do tego
samego obwodu.

### 9.2 Zapas mocy — ile i dlaczego

`[TYPOWA WARTOŚĆ / dobra praktyka branżowa, DO WERYFIKACJI dokładnej wartości źródłem
producenckim]` Powszechnie stosowaną praktyką jest dobór zasilacza z zapasem rzędu **20-30%** ponad
obliczoną moc taśmy, z dwóch niezależnych powodów:

1. **Trwałość samego zasilacza.** Zasilacze impulsowe (elektrolity, elementy mocy) starzeją się
   szybciej, pracując blisko swojej maksymalnej mocy znamionowej w sposób ciągły — zasilacz
   dobrany "na styk" grzeje się bardziej i degraduje szybciej niż ten sam model pracujący na
   ok. 70-80% swojej mocy maksymalnej.
2. **Niepewność rzeczywistego poboru taśmy.** Patrz Sekcja 9.3 niżej — deklarowana moc na etykiecie
   taśmy nie zawsze odpowiada rzeczywistości, więc zapas chroni przed niedoszacowaniem.

### 9.3 Zawyżanie (i zaniżanie) mocy taśm przez producentów

`[OCENA INŻYNIERSKA — zjawisko powszechnie zgłaszane w branży, nie da się podać jednej twardej
liczby uniwersalnej dla wszystkich sprzedawców]` Deklarowana moc na etykiecie/w opisie oferty **nie
zawsze jest wiarygodna**, w obie strony:

- **Zawyżenie w dół (marketing zaniża pobór, żeby taśma wydawała się "energooszczędna" przy
  zachowanej jasności)** — rzadsze, ale się zdarza.
- **Zaniżenie realnej mocy względem tego, ile taśma faktycznie POWINNA pobierać przy podanej
  jasności** — częstsze: producent podaje moc "nominalną" (bezpieczną, przy niezawyżonym prądzie),
  ale w praktyce podkręca prąd (overdrive, patrz Sekcja 3 punkt 3), żeby osiągnąć deklarowaną
  jasność z tańszych/mniej wydajnych chipów — realny pobór wtedy jest WYŻSZY niż etykieta, kosztem
  żywotności.

**Konsekwencja praktyczna:** nie da się w 100% zaufać liczbie z etykiety przy doborze zasilacza —
to kolejny argument za zapasem mocy (9.2) i za samodzielnym zmierzeniem rzeczywistego poboru po
zakupie (Sekcja 11), zamiast ślepego zaufania specyfikacji.

### 9.4 Jakość/marka zasilacza — dlaczego to ma znaczenie

`[OCENA INŻYNIERSKA]` Zasilacz to element, na którym oszczędzanie boli najbardziej, bo wpływa na
**całą** podłączoną instalację (Sekcja 3, punkt 4) i bezpieczeństwo pożarowe:

- **Renomowany, uznany w branży producent** (jako punkt odniesienia branżowego — np. Mean Well,
  powszechnie cytowany jako wzorzec jakości zasilaczy LED) zwykle gwarantuje: rzeczywistą moc
  zgodną z deklaracją (nie zawyżoną), stabilne napięcie wyjściowe pod obciążeniem, prawdziwe
  zabezpieczenia (przeciążeniowe/przepięciowe/zwarciowe — nie tylko naklejkę z symbolem), realną
  certyfikację bezpieczeństwa (CE faktycznie przetestowane, nie samo-zadeklarowane).
- **Tani, bezimienny zasilacz "chiński bez marki"** — `[TYPOWA WARTOŚĆ / ostrzeżenie]` częściej
  spotykane problemy: moc rzeczywista niższa niż na obudowie, brak realnych zabezpieczeń mimo
  naklejek sugerujących ich obecność, większe tętnienia napięcia wyjściowego (skraca żywotność
  diod, Sekcja 3 punkt 4), gorsza jakość podzespołów wewnętrznych (krótsza żywotność samego
  zasilacza, ryzyko awarii/przegrzania).

**Nie znaczy to, że każdy tani zasilacz jest zły** — ale przy zasilaczu, w przeciwieństwie do samej
taśmy LED (gdzie awaria to "ciemny odcinek"), awaria złej jakości może oznaczać ryzyko pożarowe —
to jeden z niewielu elementów w tym opracowaniu, gdzie `[OCENA INŻYNIERSKA]` przechyla się wyraźnie
w stronę "dopłać za znaną markę", zamiast neutralnego przedstawienia plusów/minusów jak przy innych
wyborach w tym dokumencie.

---

## 10. Łączenie odcinków taśm — złącza dedykowane vs lutowanie

### 10.1 Ryzyka lutowania

`[FAKT]` Ręczne lutowanie taśmy LED niesie kilka realnych ryzyk:
- **Przegrzanie i spalenie ścieżki miedzianej** — cienka ścieżka na elastycznym podłożu FPC
  odprowadza ciepło znacznie gorzej niż zwykły przewód; za długie trzymanie grotu lutownicy w
  jednym miejscu potrafi odspoić lub przepalić pad lutowniczy, trwale uszkadzając punkt
  przyłączeniowy.
- **Cold joint / złe złącze** — niedogrzane lutowanie tworzy połączenie o wyższej rezystancji niż
  właściwe, które z czasem (wibracje, cykle termiczne, utlenianie powierzchni stykowej) może się
  dalej pogarszać — obluzowany/utleniony styk objawia się migotaniem albo stopniowym gaśnięciem
  danego odcinka miesiące po montażu, trudnym do zdiagnozowania bez rozbierania instalacji.
- **Jakość zależna od umiejętności montującego** — w przeciwieństwie do złącza fabrycznego,
  jakość lutowanego połączenia jest tak dobra, jak osoba, która je wykonała.

### 10.2 Złącza dedykowane — rodzaje

`[FAKT / dobra praktyka branżowa]` Alternatywa dla lutowania — złącza zaciskowe (bez lutowania),
dopasowane do szerokości i liczby żył konkretnej taśmy:

| Typ złącza | Zastosowanie |
|---|---|
| Złącze proste (straight connector) | Łączenie dwóch odcinków tej samej taśmy w linii prostej |
| Złącze narożne L (corner connector) | Zmiana kierunku o 90° bez cięcia/lutowania w rogu (np. obrys sufitu) |
| Złącze T / X | Rozgałęzienie jednej linii zasilającej na dwie/trzy taśmy |
| Złącze z przewodem (z "ogonkiem") | Jak proste/narożne, ale z odcinkiem przewodu pomiędzy, gdy taśmy nie stykają się bezpośrednio (np. przejście przez szczelinę profilu) |
| Złącze zaciskowe (clip-on/spring) | Zaciska się mechanicznie na odsłoniętych padach taśmy po przecięciu w wyznaczonym miejscu — bez lutownicy |

**Zaleta:** stały, powtarzalny nacisk stykowy (nie zależy od umiejętności), brak ryzyka przegrzania
ścieżki, szybszy montaż, łatwa rozbieralność (np. przy naprawie/wymianie odcinka).

**Ograniczenie** `[OCENA INŻYNIERSKA]`: złącza zaciskowe są zwykle projektowane pod konkretną
szerokość taśmy i liczbę żył (2/4/5/6-pin) — taśma o większej liczbie kanałów (RGBCCT, 6 żył) ma
węższy wybór gotowych złączy niż prosta taśma biała (2 żyły), a przy bardzo dużych prądach
(grube, wysokiej mocy taśmy 24/48V na długich, gęsto upakowanych odcinkach) lutowanie może wciąż
dawać pewniejszy, niższy-rezystancyjnie kontakt niż tanie złącze zaciskowe — to realny kompromis,
nie jednoznaczna wyższość jednej metody nad drugą we wszystkich przypadkach.

---

## 11. Jak sprawdzać taśmę LED po zakupie — doradca weryfikacji

### 11.1 Dlaczego test "na rolce przez parę sekund" wprowadza w błąd

`[FAKT / OCENA INŻYNIERSKA]` Częsta praktyka kupujących — podłączenie taśmy wciąż zwiniętej w
rolkę na chwilę, żeby sprawdzić, czy świeci i ile "ciągnie" — daje **niemiarodajny** wynik z dwóch
niezależnych powodów:

1. **Taśma zwinięta w rolkę nie oddaje ciepła tak, jak zamontowana płasko/w profilu.** Diody
   nagrzewają się szybciej w ciasno zwiniętej rolce, a jasność LED **spada wraz ze wzrostem
   temperatury złącza** [FAKT] — krótki test "na zimno" (pierwsze sekundy) pokaże inną jasność i
   inny pobór prądu niż ta sama taśma po kilkunastu minutach pracy w docelowym montażu.
2. **Krótki odcinek nie pokazuje problemu spadku napięcia.** Test na 20-30 cm wyciętych z rolki
   albo pierwszym metrze od złącza **zawsze** wygląda dobrze, nawet jeśli cały 5-metrowy odcinek,
   zasilany tylko z jednego końca, będzie wyraźnie przygasał na końcu po zamontowaniu (Sekcja 8).
   To nie jest wada, którą test na rolce w ogóle jest w stanie wykryć.

### 11.2 Właściwa procedura sprawdzenia

`[OCENA INŻYNIERSKA — procedura praktyczna]`
1. **Rozwiń taśmę do pełnej, docelowej długości** (albo maksymalnie zbliżonej), zamiast testować
   w zwoju.
2. **Zasil napięciem znamionowym i odczekaj kilka minut**, żeby temperatura ustabilizowała się,
   zanim oceni się jasność/kolor — LED "na zimno" i "w ustalonej temperaturze pracy" to zauważalnie
   różne odczyty.
3. **Zmierz rzeczywisty prąd** (multimetrem w szereg, klemą prądową, albo miernikiem mocy USB/AC
   dla zasilacza) i porównaj z deklarowaną mocą na etykiecie (W/m × długość / V). Realny pobór
   zauważalnie inny niż deklarowany (w obie strony, patrz Sekcja 9.3) to sygnał, żeby zweryfikować
   dobór zasilacza na nowo, a nie ufać samej etykiecie.
4. **Oceń jasność/barwę na całej długości, nie tylko przy złączu.** Jeśli koniec długiego,
   jednostronnie zasilanego odcinka jest wyraźnie ciemniejszy — **to (przy odpowiedniej długości)
   nie jest wada fabryczna, tylko efekt spadku napięcia opisany w Sekcji 8** — rozwiązanie to
   zasilanie dwustronne albo punkty wstrzykiwania (Sekcja 8.5), nie reklamacja.
5. **Prawdziwa wada fabryczna wygląda inaczej niż stopniowe przygasanie:** pojedyncze diody
   całkowicie zgaszone porozrzucane po długości (nie tylko na końcu), wyraźnie różniący się odcień
   pojedynczych chipów na tle reszty (rozrzut binningu), migotanie niezależne od obciążenia,
   przepalone/odbarwione miejsca na taśmie. To są sygnały do reklamacji — spadek jasności
   narastający płynnie ku końcowi jednostronnie zasilanego, długiego odcinka — nie jest.

---

## 12. Notatki UI dla przyszłego kalkulatora/doradcy (Krok 3 — po akceptacji)

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
4. **Selektor rodzaju taśmy** (napięcie × typ chipa × gęstość × IP × liczba kanałów) prowadzący do
   rekomendacji, podobnie jak katalog odbiorników w Etapie B modułu "Dobór napięcia".
5. **Porównanie biel vs RGBW/RGBCCT** jako Wzorzec B (karty porównawcze), z jawnym ostrzeżeniem o
   gorszym CRI mieszanej bieli (Sekcja 4.2).
6. **Konwerter "LED na odcinku → LED/m"** (Sekcja 2.2/1.7), z ostrzeżeniem o różnej konwencji
   liczenia diod dla taśm wielokanałowych.
7. **Tabela IP jako współdzielony komponent** (Sekcja 2.4) — zaimportowana z jednego miejsca w
   `lib/core/`, nie przepisywana ręcznie w UI tego modułu.
8. **Kalkulator doboru zasilacza** (Sekcja 9) — suma mocy podłączonych odcinków + suwak/pole zapasu
   mocy %, z wynikiem "minimalna moc zasilacza".
9. **Selektor typu złącza** (Sekcja 10) prowadzący do rekomendacji wg liczby żył taśmy i mocy.
10. **Osobna, dedykowana podstrona/sekcja "Jak sprawdzić taśmę po zakupie"** (Sekcja 11) jako
    Wzorzec E (checklist weryfikacyjna), z jawnym odesłaniem do Sekcji 8 przy punkcie o przygasaniu
    na końcu.

---

## 13. Podsumowanie — checklist zakupowy dla użytkownika

Docelowa treść na koniec modułu (po akceptacji), w duchu "żeby nie miał problemu w sklepie":

1. Jakie napięcie ma system (12/24/48V)? → taśma musi być pod TO SAMO napięcie, bez przejściówek.
2. Ile światła (lm) i jakiego typu (funkcjonalne czy dekoracyjne)? → wpływa na wybór gęstości
   LED/m i typu chipa.
3. Głównie biel czy potrzebny kolor? → Single White/CCT vs RGBW/RGBCCT vs RGBIC (Sekcja 4, 6).
4. Jaka temperatura barwowa pasuje do pomieszczenia? → Sekcja 5.
5. Gdzie będzie montowana (sucho/wilgotno/zewnątrz)? → dobór IP (Sekcja 2.4), pamiętając o wpływie
   na jasność i żywotność.
6. Jak długa trasa? → sprawdzić L_max (Sekcja 8.4), zaplanować zasilanie dwustronne lub punkty
   wstrzykiwania, ZANIM się kupi jeden długi odcinek i będzie zaskoczenie przygasaniem na końcu.
7. Czy warto dopłacić za wyższą jakość chipów/CRI/driver? → tak, jeśli oświetlenie ma być
   długoterminowe i funkcjonalne (Sekcja 3) — nie, jeśli to krótkoterminowa dekoracja.
8. Jaki zasilacz? → moc taśmy + zapas 20-30% (Sekcja 9.2), renomowana marka (Sekcja 9.4), nie ufać
   ślepo mocy z etykiety taśmy (Sekcja 9.3).
9. Jak łączyć odcinki? → złącza dedykowane jako domyślny wybór, lutowanie tylko gdy świadomie
   potrzebny pewniejszy kontakt przy dużych prądach (Sekcja 10).
10. Po dostawie — jak sprawdzić, zanim się zamontuje na stałe? → pełna procedura w Sekcji 11, nie
    test "na rolce przez parę sekund".

---

## 14. Sterowanie oświetleniem — rodzaje kontrolerów i sposoby

Różni się od Sekcji 6.5 (która opisuje elektroniczny PROTOKÓŁ sterowania — SPI/cyfrowy vs
PWM/analogowy, czyli JAK sygnał dociera do diody) — ta sekcja opisuje, CZYM i W JAKI SPOSÓB
człowiek faktycznie steruje światłem na co dzień.

### 14.1 Piloty RF/IR

`[FAKT]` Dwie technologie bezprzewodowe, fizycznie różne:

- **IR (podczerwień)** — wymaga bezpośredniej linii wzroku między pilotem a odbiornikiem
  (przeszkoda = brak sterowania), krótszy zasięg `[TYPOWA WARTOŚĆ]` ok. 8-10 m w linii prostej,
  najtańsza i najpowszechniejsza technologia w budżetowych kontrolerach RGB/RGBW. Typowe piloty
  IR mają 24 lub 44 przyciski z zaprogramowanymi na stałe kolorami/trybami — nie "uczą się"
  nowych barw, tylko wybierają z zaszytej w pilocie palety.
- **RF (radio)** — nie wymaga linii wzroku, działa przez ściany/meble, dłuższy zasięg
  `[TYPOWA WARTOŚĆ]` rzędu 20-30 m, częściej dostępny jako panel dotykowy naścienny (montowany
  jak zwykły włącznik) zamiast małego pilota.

**Ograniczenia wspólne dla obu:** `[OCENA INŻYNIERSKA]` jeden pilot/kontroler to zwykle jedna
strefa (jedna taśma/grupa taśm) — sterowanie kilkoma niezależnymi strefami wymaga zwykle
osobnych par pilot-odbiornik, chyba że kontroler jawnie deklaruje obsługę wielostrefową. Tańsze
modele nie pamiętają ostatniego stanu (koloru/jasności) po zaniku zasilania — po awarii prądu
taśma wraca do ustawienia fabrycznego, nie do tego, co było ustawione wcześniej. Zgubienie pilota
przy braku zapasowego identycznego modelu oznacza utratę sterowania (chyba że kontroler ma też
inną metodę, np. przycisk fizyczny).

### 14.2 Sterowanie przez aplikację (WiFi/Bluetooth)

`[FAKT]` Dwie różne architektury:

- **WiFi** — kontroler łączy się z siecią domową i (w zdecydowanej większości tanich produktów
  z AliExpress) z chmurą producenta. Umożliwia sterowanie spoza domu, ale **zależy od tego, czy
  serwer producenta wciąż działa**. `[OCENA INŻYNIERSKA — realne ryzyko dla sprzętu z
  AliExpress]` Drobni/bezmarkowi producenci potrafią zamknąć serwery bez ostrzeżenia — wtedy
  funkcje chmurowe (harmonogramy w aplikacji, sterowanie zdalne, integracje) przestają działać,
  nawet jeśli samo podstawowe włącz/wyłącz z pilota fizycznego wciąż działa lokalnie. Warto przed
  zakupem sprawdzić, czy producent/aplikacja wspiera **tryb lokalny** (sterowanie w obrębie sieci
  domowej bez przechodzenia przez internet) — nie wszystkie tanie moduły to oferują, mimo że
  technicznie mogłyby.
- **Bluetooth** — połączenie lokalne, bez zależności od chmury, ale krótszy zasięg
  `[TYPOWA WARTOŚĆ]` rzędu 10-30 m zależnie od przeszkód, i brak sterowania zdalnego spoza
  zasięgu (poza domem). Prostsze, tańsze moduły, mniej podatne na "zniknięcie" funkcjonalności
  wraz z zamknięciem serwera producenta.

### 14.3 Integracje smart home

`[FAKT]` Kilka niezależnych ekosystemów, często mylonych ze sobą:

- **Zigbee** — protokół sieci kratowej (mesh) o niskim poborze energii, wymaga bramki/huba;
  urządzenia Zigbee działają też jako repeatery, wydłużając zasięg sieci.
- **Tuya** — nie protokół radiowy, tylko konkretna platforma chmurowa + aplikacja, pod którą
  działa bardzo wiele "białych etykiet" (ten sam sprzęt sprzedawany pod dziesiątkami różnych
  marek na AliExpress). `[OCENA INŻYNIERSKA]` Oferta reklamująca "działa z Alexa/Google Home"
  często oznacza w praktyce "działa z aplikacją Tuya, która mostkuje do Alexy/Google", a nie
  bezpośrednią, lokalną integrację — to inna jakość integracji niż urządzenie natywnie Zigbee/
  Matter, warto rozróżniać przy czytaniu oferty.
- **Matter** — nowszy (2022+), wspólny standard mający ujednolicić sterowanie między
  ekosystemami różnych producentów (Apple/Google/Amazon i inni); `[TYPOWA WARTOŚĆ]` wciąż
  rzadziej spotykany w tanich kontrolerach LED niż Tuya/WiFi, ale rosnący udział na rynku — warto
  sprawdzać wprost w ofercie, nie zakładać.
- **Home Assistant** — otwarte, samodzielnie hostowane oprogramowanie automatyki domowej,
  popularne wśród użytkowników chcących sterowania **lokalnego**, bez chmury producenta. Wiele
  tanich modułów Tuya/WiFi da się podłączyć albo oficjalną integracją chmurową, albo (społecznościowo
  rozwijanym) mechanizmem lokalnym omijającym chmurę producenta — wymaga sprawdzenia zgodności
  konkretnego modelu przed zakupem, jeśli zależy na tym rozwiązaniu.

### 14.4 Profesjonalne magistrale (DALI/KNX)

`[FAKT]` Standardy budynkowej automatyki, rzadko spotykane w hobbystycznych instalacjach taśm
LED, ale warte odnotowania dla kompletności i większych projektów off-gridowych:

- **DALI** (Digital Addressable Lighting Interface) — dwuprzewodowa magistrala cyfrowa,
  adresująca indywidualnie do 64 urządzeń na jednej linii, standard w instalacjach
  komercyjnych/biurowych.
- **KNX** — szerszy standard automatyki budynkowej (nie tylko oświetlenie — też rolety, ogrzewanie
  itd.), stosowany gdy oświetlenie ma być jednym elementem większego, zintegrowanego systemu.

`[OCENA INŻYNIERSKA]` Dla typowej instalacji off-gridowej (dom jednorodzinny, kamper, działka)
to zwykle nieproporcjonalnie drogie i złożone rozwiązanie względem potrzeb — istotne głównie przy
świadomej decyzji o budowie pełnej automatyki budynkowej, nie przy zwykłym doborze taśmy LED.

### 14.5 Ściemniacze (dimmery)

`[FAKT]` Kluczowa różnica względem ściemniania żarówek sieciowych 230V: w taśmie DC (12/24/48V)
ściemnianie odbywa się **na poziomie kontrolera/sterownika** (regulacja PWM), a nie przez
wstawienie osobnego ściemniacza w przewód zasilający — sam kontroler RGB/CCT z pilotem *jest* już
ściemniaczem. Jeśli mimo to używany jest osobny, dedykowany moduł ściemniający DC (np. w
instalacjach bez wbudowanej regulacji w kontrolerze), musi być zgodny z typem sterowania taśmy
(PWM-dimmable vs rzadziej spotykany analogowy 0-10V, typowy raczej w oprawach profesjonalnych niż
hobbystycznych taśmach) — niedopasowanie objawia się migotaniem, brzęczeniem albo brakiem
ściemniania w ogóle. Dla ścieżki 230V AC (Sekcja 1.6, gotowe oprawy przez falownik, oraz Sekcja
1.6a, taśmy z wbudowanym prostownikiem) obowiązują odrębne zasady doboru ściemniacza sieciowego
(TRIAC, dopasowanego do typu obciążenia — rezystancyjne/pojemnościowe/indukcyjne), niezwiązane z
tym rozdziałem — w 1.6a niedopasowany ściemniacz sieciowy jest tym bardziej istotny, bo dotyczy
napięcia obecnego bezpośrednio w taśmie, nie tylko w obudowie zasilacza.

### 14.6 Czujniki ruchu/zmierzchu i harmonogramy (timery)

`[FAKT]` Automatyzacja bez ingerencji człowieka, trzy niezależne mechanizmy, często łączone:

- **Czujnik ruchu (PIR)** — załącza/zmienia scenę po wykryciu ruchu, `[TYPOWA WARTOŚĆ]` typowy
  zasięg detekcji rzędu kilku metrów, regulowana czułość i czas podtrzymania. Popularny tani
  dodatek do taśm pod szafkami/na schodach.
- **Czujnik zmierzchu** — załącza wg poziomu światła otoczenia, typowe zastosowanie: oświetlenie
  zewnętrzne załączające się automatycznie o zmroku, bez potrzeby harmonogramu godzinowego
  (który musiałby się przesuwać wraz z porą roku).
- **Harmonogram/timer** — sterowanie wg zaplanowanego czasu; może być częścią aplikacji
  WiFi/smart home (14.2/14.3) albo **całkowicie niezależnym, prostym modułem sprzętowym**
  (mechaniczny/cyfrowy timer w linii zasilania), bez żadnej zależności od chmury czy aplikacji —
  wart rozważenia właśnie z powodu niezależności od dostawcy, patrz 14.7.

### 14.7 Ograniczenia off-gridowe specyficzne dla tego projektu

`[OCENA INŻYNIERSKA, wartość liczbowa DO WERYFIKACJI]` Kontrolery WiFi/chmurowe (14.2, 14.3)
oparte o popularne moduły radiowe (typowo układy klasy ESP8266/ESP32 w tanich produktach)
pobierają energię **stale**, w trybie czuwania nasłuchując sieci WiFi, **nawet gdy podłączona
taśma jest zgaszona** — rząd wielkości pojedynczych watów na kontroler, do potwierdzenia kartą
katalogową konkretnego modelu przed wpisaniem jako twarda dana. W systemie off-gridowym z
ograniczonym, kosztownym magazynem energii (baterie) to realny, mały, ale **ciągły** pobór —
dokładnie kategoria "odbiornik bazowy/ciągły" z Etapu B.2 modułu "Dobór napięcia systemowego"
(echo — ten sam mechanizm klasyfikacji, nie nowa logika).

**Konsekwencja praktyczna:** dla filozofii minimalizacji strat, którą ta aplikacja już przyjmuje
gdzie indziej (patrz Sekcja 1.6 — "gorsza filozofia off-gridowa" dla ścieżki 230V przez falownik),
prosty pilot RF/IR albo sprzętowy timer bez chmury (14.1, koniec 14.6) jest zgodny z tą samą
minimalistyczną filozofią, podczas gdy wygoda WiFi/smart home jest świadomym kompromisem
energetycznym, nie rozwiązaniem "za darmo" — wart jawnego nazwania w przyszłym kalkulatorze, nie
przemilczenia.

### 14.8 Notatka do UI (Krok 3)

Ten temat zasługuje na osobny artykuł referencyjny w strukturze z Sekcji 15 (Wzorzec C), nie na
dopisanie do ekranu "dobór taśmy" — różne tematy, różne decyzje zakupowe. Dobry kandydat też na
ekran pochodny (Sekcja 15.3a): "Czy ten kontroler zadziała bez internetu/chmury?" jako prosty,
jednozadaniowy test decyzyjny wyprowadzony z 14.2/14.3.

---

## 15. Propozycja struktury nawigacyjnej — PROPOZYCJA, czeka na akceptację

Odpowiedź na pytanie architektoniczne: czy to osobny rozdział, pod-rozdział, i czy wzorzec
kafelek→kafelki powinien objąć całą aplikację.

### 15.1 Jak apka jest zbudowana dzisiaj (sprawdzone w kodzie, nie zgadywane)

Obecnie **dwa poziomy**, jednolicie w całej aplikacji (`lib/pulpit/registry.ts`):
```
Pulpit (13 kafli, np. "Instalacja PV", "Baterie")
  → wejście w kafel → płaska lista ekranów/kalkulatorów tego modułu (`/moduly/[id]`)
    → wejście w ekran → konkretny kalkulator/doradca (Wzorzec A-H)
```
Żaden istniejący moduł nie ma dziś TRZECIEGO poziomu (kafelki wewnątrz kafelka) — to, co Pan
opisuje, byłoby nowym wzorcem, nie kontynuacją istniejącego.

### 15.2 Dlaczego zwykła płaska lista by tu nie wystarczyła

Ten dokument sam w sobie już ma 13+ sekcji, porównywalnie z najbardziej rozbudowanymi istniejącymi
modułami aplikacji, i rośnie z każdą turą (Sekcja 14 dopiero co dodana jako zarys, a zapowiedziany
jest jeszcze cały rozdział Hand-Made). Upchnięcie tego jako 15-20 pozycji w jednej płaskiej liście
ekranów pod jednym kaflem byłoby dokładnie tym, przed czym Pan ostrzega — "przeciągnięty kalkulator
gdzie wszystko zmieszane", tylko na poziomie nawigacji zamiast pojedynczego ekranu.

### 15.3 KOREKTA (14.09.2026, po uwadze autora) — rozdzielić "artykuł" od "kreatora"

Wersja niżej poprawia pierwotną propozycję z tej sekcji, która myliła dwie różne rzeczy: **kroki
ścieżki zakupowej** i **materiał edukacyjny**, jakby to było to samo. Autor słusznie zauważył: apka
już ma na to gotowe rozróżnienie w istniejącej taksonomii Wzorców A-H (`docs/standards/08-...`),
którego pierwsza wersja tej sekcji nie zastosowała poprawnie:

- **Wzorzec C (akordeon/informacja)** — tematy uzupełniające się, każdy samodzielny, wchodzi się
  po konkretną wiedzę, niezależnie od reszty, bez wymuszonej kolejności.
- **Wzorzec D (Doradca)** — krótka ścieżka pytanie→pytanie→werdykt, BEZ wykładu wciśniętego
  pomiędzy krokami.

Pierwotna propozycja traktowała "Dobór taśmy" jako jeden ekran-wykład zawierający całe Sekcje 1-7
naraz — to dokładnie ten błąd, o którym mówi autor: kilka artykułów forum wepchniętych w jeden
mega-artykuł, i jednocześnie brak osobnego miejsca na czystą edukację dla kogoś, kto NIE chce
przechodzić ścieżki zakupowej, tylko dowiedzieć się jednej konkretnej rzeczy.

**Poprawiona struktura — dwa niezależne typy ekranów, nie jeden:**

1. **Artykuły referencyjne (Wzorzec C)** — jeden temat = jeden ekran, wejście z dowolnego miejsca
   (z pulpitu, z wyszukiwarki, z linku "dowiedz się więcej" w kreatorze), bez wymuszania
   przechodzenia przez resztę:
   - Rodzaje taśm wg napięcia (Sekcja 1)
   - Jak czytać oznaczenia — SMD/COB/FCOB, gęstość, moc, IP, CRI (Sekcja 2, 7)
   - Żywotność — co wpływa i dlaczego (Sekcja 3)
   - Biel czy RGBW/RGBCCT (Sekcja 4)
   - Temperatura barwowa — z żywym podglądem na suwaku (Sekcja 5)
   - RGB/RGBIC — prawda o "milionach kolorów", z paskiem kolorów na czarnym tle (Sekcja 6)
   - Zasilacze 220V→DC — dobór, zapas mocy, jakość (Sekcja 9)
   - Łączenie taśm — złącza dedykowane vs lutowanie (Sekcja 10)
   - Jak sprawdzić taśmę po zakupie (Sekcja 11)
   - Sterowanie — kontrolery i sposoby (Sekcja 14)

2. **Hand-Made / DIY (hub, trzeci poziom nawigacji)** — bez zmian względem poprzedniej wersji:
   prawdziwe rozgałęzienie treści (różne czipy/IP/priorytety), nie kolejny artykuł ani krok
   kreatora, więc zasługuje na własny poziom:
   ```
   Hand-Made / DIY
     ├─ Oświetlenie domowe DIY
     ├─ Oświetlenie agro (inne czipy/IP — hale, szklarnie, inwentarz)
     └─ Latarki i małe dedykowane projekty
   ```

### 15.3a DOPRECYZOWANIE (14.09.2026, runda 5) — ekrany pochodne + Kreator Pro

Autor zwrócił uwagę na trzeci wymiar, którego wersja 15.3 jeszcze nie uwzględniała: **postrzeganą
wartość aplikacji dla początkującego użytkownika**. Chowanie dziesiątek/setek funkcji wewnątrz
jednego skonsolidowanego ekranu jest efektywne dla inżyniera, ale użytkownik płaci uwagą/zaufaniem
za to, **co widzi** (liczbę i nazwy kafelków), nie za to, czego musi się domyślić, że jest ukryte w
środku. Aplikacja jest kierowana do początkujących, więc czasem warto dodać ekran, który **nie
liczy nic nowego** (żadnej nowej logiki, echo tej samej funkcji co ekran ogólny), tylko pokazuje
**jeden, zawężony wynik dla jednej konkretnej, nazwanej sytuacji** — żeby początkujący trafił od
razu na kafelek pasujący do jego pytania, zamiast musieć przejść pełną ścieżkę wielopytaniowego
kreatora.

To rozszerza rozróżnienie z 15.3 do **trzech**, nie dwóch, rodzajów ekranów — i jest to
bezpośrednie zastosowanie na poziomie nawigacji już istniejącej w projekcie zasady **Tryb Prosty
vs Tryb Inżyniera** (Zasada 8 standardu), tylko realizowanej jako osobne kafelki zamiast
przełącznika w obrębie jednego ekranu — silniejsze dla kogoś, kto nawet nie wie, że przełącznik
mógłby istnieć.

1. **Artykuły referencyjne (Wzorzec C)** — jak w 15.3, edukacja, bez zmian.

2. **Ekrany pochodne / dedykowane (nowe — wielość, po jednym na typową sytuację początkującego)**
   — każdy to cienka nakładka na TĘ SAMĄ funkcję kalkulatora co ekran ogólny (zero nowej logiki,
   czysty "echo" — identyczna zasada jak reużycie `dobor-przekroju-kabla` w module "Dobór
   napięcia"), tylko z zawężonym kontekstem i jednym, konkretnym wynikiem zamiast pełnego drzewa
   opcji. Przykłady dla tego modułu:
   - "Jaką taśmę do kuchni?" / "do łazienki?" / "na zewnątrz?" / "do akwarium/oczka wodnego?" —
     zawężone IP+CCT+CRI z Sekcji 2.4/2.6/5, jeden werdykt zamiast pytania o wszystko.
   - "Ile metrów mogę zasilić z jednego końca?" — bezpośrednie wywołanie wzoru L_max (Sekcja 8.4)
     z typowymi, gotowymi kombinacjami napięcie/moc do wyboru, bez pytania o resztę.
   - "Jaki zasilacz do mojej taśmy?" — bezpośrednie wywołanie Sekcji 9, osobno od reszty.
   - Konwerter "LED na odcinku → LED/m" (Sekcja 2.2/1.7) jako osobne, jednozadaniowe narzędzie.

   **Decyzja, które konkretnie ekrany pochodne wydzielić, zapada osobno w każdym rozdziale/module**
   (tak jak zaproponował autor) — nie jest to sztywna lista, tylko konsekwentnie stosowana zasada:
   gdziekolwiek pojedyncza, nazwana sytuacja początkującego da się odpowiedzieć jednym wywołaniem
   istniejącej funkcji, warto rozważyć osobny kafelek, zamiast zakładać, że użytkownik sam
   "wydłubie" tę odpowiedź z ogólnego kreatora.

3. **Kreator Pro (Wzorzec D, pełny, multi-ścieżkowy)** — dokładnie to, co było w pierwotnej wersji
   15.3 jako jedyny "kreator": WSZYSTKIE pytania i ścieżki w jednym miejscu (napięcie, zastosowanie,
   IP, kolor, długość trasy, zasilacz — wszystko naraz). Ale teraz poprawnie umiejscowiony jako
   **dodatkowa, świadomie wybierana opcja dla zaawansowanego użytkownika**, który przeszedł już
   przez ekrany pochodne/artykuły, zna temat i chce szybkości "wszystko w jednym miejscu" — nie
   jako domyślny, jedyny punkt wejścia.

**Proponowany kształt kafla 14 "Oświetlenie LED" (poprawiony, runda 5):**
```
Kafel: Oświetlenie LED
  ├─ [Artykuły — Wzorzec C, 10 niezależnych ekranów, patrz 15.3 pkt 1]
  ├─ [Ekrany pochodne — po jednym na typową sytuację, decyzja per moduł, patrz przykłady wyżej]
  ├─ Kreator Pro (Wzorzec D, pełny, multi-ścieżkowy — dla zaawansowanych)
  └─ Hand-Made / DIY (hub — trzeci poziom: Dom / Agro / Latarki)
```

**Nota do standardu (Krok po akceptacji):** warto nazwać ten wzorzec wprost w
`docs/standards/08-ui-ux.md` obok Trybu Prosty/Inżyniera — np. "Ekran pochodny" (derived screen):
zero nowej logiki, jeden zawężony wynik, echo istniejącej funkcji — żeby kolejne moduły miały
gotową, nazwaną decyzję do podjęcia, zamiast wymyślać ją od nowa za każdym razem.

### 15.4 Czy to ma być ogólny wzorzec dla całej apki?

`[OCENA INŻYNIERSKA — rekomendacja, nie decyzja]` **Nie jako sztywna, wszędzie stosowana zasada** —
ale tak, jako **dostępna opcja wzorca, używana świadomie tam, gdzie treść się naprawdę rozgałęzia**.
Powód: większość z 13 istniejących modułów działa dobrze na dwóch poziomach właśnie dlatego, że ich
ekrany to kroki jednej ścieżki, nie niezależne rozgałęzienia — dodanie trzeciego poziomu wszędzie
"na zapas" byłoby przekombinowaniem nawigacji tam, gdzie nie jest potrzebne (sprzeczne z zasadą
"nie dodawaj warstw ponad to, czego wymaga zadanie"). Rekomendacja: potraktować oświetlenie LED
jako **pierwszy, celowy precedens** trzeciego poziomu, opisać go jawnie jako wzorzec nawigacyjny w
`docs/standards/08-ui-ux.md` (obok istniejącej taksonomii Wzorców A-H) — żeby kolejne moduły, które
faktycznie się rozgałęziają (jeśli takie się pojawią), miały gotowy, nazwany wzorzec do
zastosowania, zamiast wymyślać go za każdym razem od nowa. To decyzja dotycząca struktury całej
Biblii/standardu, więc zostawiam ją Panu do potwierdzenia, zamiast rozstrzygać samodzielnie.

---

## Otwarte pytania / miejsca do uzupełnienia przez autora

- Konkretne wartości `R_taśmy_na_metr` dla realnych, popularnych produktów (Sekcja 8.2) — obecnie
  orientacyjny zakres, do potwierdzenia kartą katalogową, zanim trafi do Biblii jako twarda dana.
- Dokładna wartość zapasu mocy zasilacza (9.2, obecnie orientacyjne 20-30%) — do potwierdzenia
  źródłem branżowym/kartą katalogową renomowanego producenta, zanim trafi do Biblii jako twarda
  rekomendacja liczbowa.
- **[14.09.2026] ROZSTRZYGNIĘTE (odłożone, nie otwarte):** marki/modele taśm i zasilaczy dopisane
  później — autor ma konkretną firmę, której dane mają posłużyć do obliczeń i rekomendacji w tym
  module (nie neutralny opis ogólny, tylko realne dane konkretnego dostawcy). Do tego czasu
  dokument zostaje przy opisie ogólnym/orientacyjnym. Gdy dane tej firmy się pojawią, warto przy
  okazji zweryfikować nimi też `R_taśmy_na_metr` (8.2) i zapas mocy zasilacza (9.2) — obie wartości
  wciąż orientacyjne, patrz punkty wyżej.
- **Decyzja architektoniczna do podjęcia przez autora:** biorąc pod uwagę zapowiedziany przyszły
  rozdział "Taśmy LED Hand Made" (lutowanie własnych taśm na poziomie pojedynczych chipów, dla
  zastosowań domowych i agro) oraz już bardzo szeroki zakres samego tego opracowania — czy
  oświetlenie LED powinno zostać wydzielone jako osobna, głęboko rozwijana **podkategoria** w
  strukturze Biblii/aplikacji (analogicznie do istniejących modułów), zamiast zostać pojedynczym
  ekranem/kalkulatorem wewnątrz istniejącego modułu? `[OCENA INŻYNIERSKA — rekomendacja, nie
  decyzja]` Biorąc pod uwagę objętość już zebranego materiału (13 sekcji, porównywalna z
  najbardziej rozbudowanymi istniejącymi modułami aplikacji) i zapowiedź kolejnego, równie
  obszernego rozdziału — wydzielenie osobnej podkategorii wydaje się zasadne, ale to decyzja
  strukturalna dotycząca całej Biblii, nie coś, co powinno zostać rozstrzygnięte jednostronnie.
- **Rozdział "Taśmy LED Hand Made"** (lutowanie na poziomie pojedynczych chipów, dobór konkretnych
  czipów, zastosowania domowe i agro) — zgłoszony jako przyszły, osobny temat, świadomie poza
  zakresem tego opracowania (które dotyczy gotowych taśm fabrycznych, nie budowy własnych od
  podstaw). Do podjęcia jako osobne zadanie po zamknięciu tego dokumentu.
- Miejsce na wszystkie dodatkowe punkty, które autor chciał wnieść, a nie zostały jeszcze
  przekazane w rozmowie.
