# PN-IEC 60364-4-41:2000 — Treść (Wyciąg)

Metoda ekstrakcji: `antiword`/`wvHtml` z pliku `.doc` (Word 95/97, kodowanie cp1250), nie OCR.
Kilka drobnych artefaktów konwersji zachowanych z ostrożności: w oryginalnym pliku niektóre numery
w listach UWAGI wyglądają jak małe „l" zamiast cyfry „1" (typowy artefakt czcionki Word 95) —
poprawione tu na czytelne cyfry tam, gdzie kontekst jest jednoznaczny. Wzory matematyczne oznaczone
w oryginale jako `[pic]` (obrazek OLE) odzyskane osobno z 4 plików WMF osadzonych w dokumencie i
wstawione tutaj jako czysty zapis — **poza Tablicami 41A i 41B, które nie istnieją nigdzie w tym
pliku źródłowym (patrz `00-INDEKS.md`, zastrzeżenie krytyczne)**.

## 400 — Wprowadzenie

**400.1.1** Arkusze od 41 do 46 zawierają podstawowe wymagania dotyczące zapewnienia
bezpieczeństwa przeciwporażeniowego ludzi, zwierząt domowych i mienia. Arkusz 47 obejmuje
zastosowanie i koordynację tych wymagań, a w arkuszu 48 odniesiono te wymagania do poszczególnych
klas warunków środowiskowych. Wymagania dotyczące wyboru i instalowania urządzeń są wyszczególnione
w części 5, a wymagania dotyczące badań odbiorczych — w części 6.

**400.1.2** Środki ochrony mogą dotyczyć całej instalacji, jej części lub tylko jednego urządzenia.
Jeżeli zastosowanie jednego środka ochrony nie spełnia wymaganych warunków, należy zastosować inne
środki, które łącznie z tym środkiem ochrony zapewnią wymagany poziom bezpieczeństwa.

**400.1.3** Kolejność, w jakiej są wymienione środki ochrony, nie jest związana w jakikolwiek
sposób ze stopniem ich ważności.

## 41 — Ochrona przeciwporażeniowa

**41.1 Zakres.** Ochrona przed porażeniem prądem elektrycznym powinna być zapewniona przez
zastosowanie odpowiednich środków wyszczególnionych w: 411 (ochrona zarówno w warunkach normalnych,
jak i w przypadkach uszkodzenia) lub 412 (ochrona w warunkach normalnych) i 413 (ochrona w
przypadku uszkodzenia, zgodnie z wymaganiami 471 i 48).

**41.2 Normy powołane.** IEC 146-2:1974 (przekształtniki półprzewodnikowe), IEC 536-2:1992
(klasyfikacja urządzeń wg ochrony przed porażeniem), IEC 1201:1992 (Extra-low voltage — Limit
values).

## 411 — Równoczesna ochrona przed dotykiem bezpośrednim i pośrednim

### 411.1 Ochrona polegająca na zastosowaniu bardzo niskiego napięcia SELV i PELV

**411.1.1** Ochronę przed porażeniem elektrycznym uważa się za zapewnioną, jeżeli: napięcie
znamionowe nie przekracza górnej granicy zakresu I; źródło zasilania jest jednym ze źródeł
wymienionych w 411.1.2; spełnione są warunki 411.1.3 oraz dodatkowo 411.1.4 (obwody nieuziemione —
SELV) lub 411.1.5 (obwody uziemione — PELV).

> W układach prądu stałego z bateriami akumulatorów, napięcia ładowania i doładowywania
> przekraczają znamionowe napięcie baterii — nie wymaga się dodatkowych środków ochrony poza
> przewidywanymi w tym podrozdziale. Napięcie ładowania nie powinno przekraczać maksymalnej
> wartości 75 V prądu przemiennego lub 150 V prądu stałego, zależnie od warunków środowiskowych
> (IEC 1201, tablica 1).

**411.1.2 Źródło zasilania dla SELV i PELV:** transformator bezpieczeństwa (IEC 742:1983); źródło
prądu o stopniu bezpieczeństwa równoważnym (np. przetwornica dwumaszynowa); źródło elektrochemiczne
(np. bateria akumulatorów) lub inne źródło niezależne od obwodu zasilającego wyższego napięcia (np.
zespół prądotwórczy z silnikiem Diesla); niektóre urządzenia elektroniczne spełniające wymagania
odpowiednich norm; ruchome źródła (transformatory bezpieczeństwa, zespoły prądotwórcze) — dobierane
i instalowane jak urządzenia II klasy ochronności (patrz 413.2).

**411.1.3 Wykonanie obwodów.** Części czynne obwodów SELV i PELV powinny być elektrycznie
oddzielone od obwodów wyższego napięcia (oddzielenie nie gorsze niż między obwodem pierwotnym i
wtórnym transformatora bezpieczeństwa). Przewody każdego obwodu SELV i PELV powinny być prowadzone
oddzielnie od innych obwodów (albo osłona izolacyjna niezależna od izolacji podstawowej, albo
uziemione ekrany/osłony metalowe między obwodami o różnych napięciach, albo wspólna izolacja na
najwyższe występujące napięcie). Wtyczki i gniazda SELV/PELV: niemożliwość wsadzenia wtyczki na
inne napięcie, gniazda bez styku ochronnego.

**411.1.4 Wymagania dla obwodów nieuziemionych (SELV).** Części czynne SELV nie mogą być połączone
z uziomem ani z częściami czynnymi/przewodami ochronnymi innych obwodów. Części przewodzące
dostępne nie mogą być zamierzenie połączone z uziemieniem, przewodami ochronnymi innych obwodów ani
z częściami przewodzącymi obcymi (poza wyjątkami, gdy napięcie na tych częściach nie przekroczy
wartości z 411.1.1). Jeżeli napięcie znamionowe przekracza 25 V AC skutecznej / 60 V DC
nietętniącego, ochrona przed dotykiem bezpośrednim wymaga: ogrodzeń/obudów stopnia co najmniej
IPXXB, lub izolacji wytrzymującej próbę 500 V AC przez 1 min. Poniżej tych wartości ochrona przed
dotykiem bezpośrednim niekonieczna (poza szczególnie niekorzystnymi warunkami środowiskowymi).

**411.1.5 Wymagania dla obwodów uziemionych (PELV).** Ochrona przed dotykiem bezpośrednim: jak
wyżej (IPXXB lub izolacja 500 V/1 min) — NIEKONIECZNA wewnątrz/na zewnątrz budynku, jeżeli
zastosowano główne połączenia wyrównawcze + układ uziemiający, a napięcie znamionowe nie
przekracza: **25 V AC / 60 V DC** (urządzenia normalnie użytkowane tylko w suchych pomieszczeniach,
brak przewidywanego dotknięcia dużą powierzchnią ciała) lub **6 V AC / 15 V DC** (wszystkie inne
przypadki).

### 411.2 Ochrona za pomocą ograniczenia energii rozładowywania

W opracowywaniu (brak treści w tej wersji normy — zapis pozostawiony otwarty przez IEC w 2000 r.).

### 411.3 Obwody FELV

**411.3.1** Jeżeli ze względów funkcjonalnych stosuje się napięcie zakresu I, a nie są spełnione
wszystkie wymagania SELV/PELV (411.1) ani nie jest konieczne ich stosowanie — stosuje się środki
411.3.2 i 411.3.3; takie obwody nazywa się FELV.

**411.3.2 Ochrona przed dotykiem bezpośrednim:** ogrodzenia/obudowy zgodnie z 412.2, lub izolacja
wytrzymująca co najmniej napięcie probiercze obwodu pierwotnego (jeśli niewystarczająca — wzmocnić
do próby 1500 V AC/1 min podczas montażu).

**411.3.3 Ochrona przed dotykiem pośrednim:** połączenie części przewodzących dostępnych z
przewodem ochronnym obwodu pierwotnego (jeśli ten ma samoczynne wyłączenie wg 413.1), lub z
nieuziemionym przewodem wyrównawczym obwodu pierwotnego (przy separacji elektrycznej wg 413.5).

**411.3.4** Wtyczki/gniazda FELV: niemożliwość wsadzenia na inne napięcie.

> Odsyłacz krajowy: patrz norma IEC 529:1989 — odpowiednik krajowy PN-92/E-08106 (Stopnie ochrony
> zapewniane przez obudowy, kod IP).

## 412 — Ochrona przed dotykiem bezpośrednim (ochrona podstawowa)

**412.1 Izolowanie części czynnych.** Części czynne całkowicie pokryte izolacją usuwalną tylko
przez zniszczenie; farba/pokost/podobne produkty same w sobie NIE są uznawane za odpowiednią
izolację ochronną.

**412.2 Ogrodzenia lub obudowy.** Stopień ochrony co najmniej IP2X (wyjątki: wymiana części — np.
oprawy oświetleniowe, gniazda, bezpieczniki — wymagają wtedy środków ostrożności i informacji o
ryzyku). Łatwo dostępne górne poziome powierzchnie: co najmniej IP4X. Usunięcie ogrodzenia/obudowy
możliwe tylko: za pomocą klucza/narzędzia, lub po wyłączeniu zasilania (z blokadą ponownego
włączenia do czasu założenia z powrotem), lub przez osłonę wewnętrzną IP2X usuwalną tylko
narzędziem.

**412.3 Bariery.** Zapobiegają niezamierzonemu zbliżeniu/dotknięciu — mogą być usuwane bez
narzędzia, ale zabezpieczone przed niezamierzonym usunięciem.

**412.4 Umieszczenie poza zasięgiem ręki.** Części o różnych potencjałach jednocześnie dostępne nie
mogą znajdować się w zasięgu ręki — **zasięg ręki = 2,50 m** (patrz rys. 41C w oryginale, tu
niedostępny). W kierunku pionowym zasięg ręki = **2,5 m** od powierzchni stanowiska, bez
uwzględniania barier o stopniu niższym niż IP2X.

**412.5 Ochrona uzupełniająca za pomocą urządzeń różnicowoprądowych.** RCD o znamionowym prądzie
różnicowym **≤30 mA** — uzupełnienie ochrony przy nieskutecznym działaniu innych środków lub
nieostrożności użytkownika. Nie może być jedynym środkiem ochrony.

## 413 — Ochrona przed dotykiem pośrednim

### 413.1 Ochrona za pomocą samoczynnego wyłączenia zasilania

**413.1.1.1 Wyłączenie zasilania.** Urządzenie ochronne powinno samoczynnie wyłączyć zasilanie tak,
żeby spodziewane napięcie dotykowe przekraczające **50 V AC skutecznej / 120 V DC nietętniącego**
zostało wyłączone dostatecznie szybko. Dopuszczalny czas wyłączania nie dłuższy niż **5 s** w
pewnych okolicznościach, niezależnie od napięcia dotykowego (patrz 413.1.3.5). Zakres
częstotliwości: 15 Hz–1000 Hz AC oraz DC nietętniący.

**413.1.1.2 Uziemienie.** Części przewodzące dostępne połączone z przewodem ochronnym wg wymagań
danego układu sieci; części jednocześnie dostępne przyłączone do tego samego uziemienia
(indywidualnie/grupowo/zespołowo).

**413.1.2 Połączenia wyrównawcze.**
- **413.1.2.1 Główne** — łączą: główny przewód ochronny, główną szynę/zacisk uziemiający, rury
  instalacji wewnętrznych (gaz, woda), metalowe elementy konstrukcyjne/CO/klimatyzacji. Elementy
  doprowadzone z zewnątrz — łączone możliwie najbliżej miejsca wprowadzenia.
- **413.1.2.2 Dodatkowe** — gdy warunki samoczynnego wyłączenia (413.1.1.1) nie mogą być spełnione,
  wykonuje się miejscowe połączenia wyrównawcze dodatkowe (patrz 413.1.6).

### 413.1.3 Układy TN

**413.1.3.1** Wszystkie części przewodzące dostępne przyłączone do uziemionego punktu sieci
zasilającej przewodami ochronnymi, uziemionymi na transformatorze/prądnicy lub najbliżej niego.
Uziemiony punkt = punkt neutralny (lub przewód fazowy, jeśli neutralny niedostępny — przewód
fazowy NIGDY nie może być przewodem PEN).

**413.1.3.2** Ten sam przewód może być przewodem ochronno-neutralnym PEN, pod warunkiem spełnienia
546.2.

**413.1.3.3** Warunek samoczynnego wyłączenia dla zwarcia o pomijalnej impedancji między przewodem
fazowym a przewodem ochronnym/częścią przewodzącą dostępną:

**Zs × Ia ≤ U₀**

gdzie: Zs — impedancja pętli zwarciowej (źródło → przewód roboczy do miejsca zwarcia → przewód
ochronny z powrotem do źródła); Ia — prąd powodujący samoczynne zadziałanie urządzenia
wyłączającego w czasie zależnym od U₀ **wg Tablicy 41A** (🔴 tablica niedostępna w tym dokumencie,
patrz `00-INDEKS.md`) lub w czasie umownym ≤5 s (413.1.3.5); U₀ — napięcie znamionowe AC względem
ziemi.

**413.1.3.4** Maksymalne czasy wyłączenia z Tablicy 41A (🔴 niedostępna) dotyczą obwodów odbiorczych
zasilających bezpośrednio lub przez gniazda urządzenia I klasy ochronności ręczne/przenośne.

**413.1.3.5** Umowny czas wyłączenia ≤5 s dopuszczalny w obwodach rozdzielczych, oraz w obwodach
odbiorczych zasilających wyłącznie urządzenia stacjonarne (pod warunkiem spełnienia (a) impedancji
przewodu ochronnego do głównej szyny uziemiającej wg wzoru [pic — nieodzyskany, mała ikonka wzoru
bez odpowiadającego pliku WMF] lub (b) obecności odpowiednich połączeń wyrównawczych w rozdzielnicy).

**413.1.3.6** Jeśli 413.1.3.3–413.1.3.5 nie da się spełnić urządzeniami przetężeniowymi — wykonać
połączenia wyrównawcze dodatkowe (413.1.2.2) lub zastosować RCD.

**413.1.3.7** Dla zwarcia przewodu fazowego z ziemią (np. linie napowietrzne), by napięcie na
przewodzie ochronnym względem ziemi nie przekroczyło 50 V:

**RB / RE ≤ 50 / (U₀ − 50)**

gdzie: RB — wypadkowa rezystancja wszystkich równolegle połączonych uziomów; RE — minimalna
rezystancja styku z ziemią części przewodzących obcych niepołączonych z przewodem ochronnym.

**413.1.3.8** W układzie TN: urządzenia ochronne przetężeniowe LUB różnicowoprądowe (RCD) —
**RCD niedozwolone w układzie TN-C**; jeśli RCD stosowane w TN-C-S, przewód PEN nie może być
używany po stronie odbioru (rozdzielenie PE/PEN musi nastąpić przed RCD, po stronie zasilania).

### 413.1.4 Układy TT

**413.1.4.1** Wszystkie części przewodzące dostępne chronione wspólnie przez to samo urządzenie
ochronne — połączone przewodami ochronnymi, przyłączone do tego samego uziomu. Punkt neutralny (lub
przewód fazowy w jego braku) uziemiony w każdej prądnicy/stacji transformatorowej.

**413.1.4.2** Warunek:

**RA × Ia ≤ 50 V**

gdzie: RA — suma rezystancji uziomu i przewodu ochronnego części przewodzących dostępnych; Ia —
prąd powodujący samoczynne zadziałanie (dla RCD: znamionowy prąd różnicowy zadziałania IΔn; dla
zabezpieczenia przetężeniowego zależnego czasowo: prąd zapewniający zadziałanie ≤5 s, lub dla
urządzeń natychmiastowych: minimalny prąd natychmiastowego wyłączenia). RCD typu S (selektywne)
mogą mieć zwłokę czasową do 1 s w obwodach rozdzielczych.

**413.1.4.3** Jeśli warunek 413.1.4.2 niespełniony — połączenia wyrównawcze wg 413.1.2.2 i 413.1.6.

**413.1.4.4** W układzie TT: RCD (zalecane) lub urządzenia przetężeniowe (tylko gdy RA bardzo mała).

### 413.1.5 Układy IT

**413.1.5.1** Części czynne odizolowane od ziemi lub uziemione przez odpowiednio dużą impedancję
(punkt neutralny lub sztuczny punkt neutralny). Pierwsze doziemienie — prąd mały, wyłączenie
niekonieczne pod warunkiem spełnienia 413.1.5.3; wymagane środki zaradcze na wypadek drugiego
doziemienia.

**413.1.5.2** Żaden przewód czynny nie może być bezpośrednio uziemiony.

**413.1.5.3** Części przewodzące dostępne uziemione indywidualnie/grupowo/zbiorowo, warunek:

**RA × Id ≤ 50 V**

gdzie: RA — rezystancja uziemienia części przewodzących dostępnych; Id — prąd pierwszego
doziemienia przy pomijalnej impedancji (uwzględnia prądy upływowe i całkowitą impedancję
uziemienia).

**413.1.5.4** Przy zasilaniu ciągłym — wymagane urządzenia kontrolujące stan izolacji (wykrycie
pierwszego doziemienia), z sygnałem dźwiękowym i/lub optycznym.

**413.1.5.5** Po pierwszym doziemieniu, warunki wyłączenia przy drugim doziemieniu zależą od
sposobu uziemienia części przewodzących dostępnych: (a) uziemione grupowo/indywidualnie → warunki
jak dla TT (413.1.4, bez drugiego akapitu 413.1.4.1); (b) uziemione zbiorowo → warunki jak dla TN
(413.1.5.6).

**413.1.5.6** Bez przewodu neutralnego:

**Zs ≤ (√3 × U₀) / (2 × Ia)**

Z przewodem neutralnym:

**Ss ≤ U₀ / (2 × Ia)**

gdzie: U₀ — napięcie znamionowe AC między fazą a punktem neutralnym; U — napięcie znamionowe AC
międzyprzewodowe; Zs — impedancja pętli zwarciowej (przewód fazowy + przewód ochronny); Ss —
impedancja pętli zwarciowej (przewód neutralny + przewód ochronny); Ia — prąd wyłączający w czasie
z **Tablicy 41B** (🔴 tablica niedostępna) lub ≤5 s gdy dopuszczalne (413.1.3.5).

**413.1.5.7** W układzie IT: urządzenia do stałej kontroli izolacji, urządzenia przetężeniowe, RCD.

### 413.1.6 Połączenia wyrównawcze dodatkowe

**413.1.6.1** Obejmują wszystkie części przewodzące jednocześnie dostępne urządzeń stałych, części
przewodzące obce, oraz (jeśli możliwe) główne metalowe zbrojenia konstrukcji żelbetowej — połączone
z przewodami ochronnymi wszystkich urządzeń, w tym gniazd.

**413.1.6.2** W razie wątpliwości co do skuteczności — sprawdzić rezystancję między częściami
jednocześnie dostępnymi a częściami przewodzącymi obcymi (warunek analogiczny do powyższych, z Ia
= prąd zadziałania RCD, lub prąd zadziałania urządzenia przetężeniowego w czasie 5 s).

### 413.2 Ochrona polegająca na zastosowaniu urządzenia II klasy ochronności lub o izolacji równoważnej

Zapobiega pojawieniu się niebezpiecznego napięcia na częściach przewodzących dostępnych w razie
uszkodzenia izolacji podstawowej. Zapewniają to: urządzenia z podwójną/wzmocnioną izolacją
(oznaczone symbolem klasy II — kwadrat w kwadracie); zespoły w pełni izolowane fabrycznie;
urządzenia z izolacją dodatkową/wzmocnioną wykonaną podczas montażu (dopuszczalne tylko gdy warunki
konstrukcyjne uniemożliwiają izolację podwójną). Obudowa izolacyjna: stopień ochrony co najmniej
IP2X, odporność na narażenia mechaniczne/elektryczne/termiczne (farba/pokost nieuznawane), bez
śrub metalowych mogących pogorszyć izolację, bez połączenia z przewodem ochronnym.

> Odsyłacz: patrz IEC 439 (Low-voltage switchgear and controlgear assemblies) w kontekście
> odporności na pełzanie i odstępów izolacyjnych (IEC 664).

### 413.3 Ochrona polegająca na izolowaniu stanowiska

Zapobiega równoczesnemu dotknięciu części o różnym potencjale. Dopuszcza się urządzenia klasy 0 pod
warunkiem: brak możliwości równoczesnego dotknięcia dwóch części przewodzących dostępnych, lub
części dostępnej i obcej o różnych potencjałach. Stanowisko: podłoga/ściany izolowane +
przynajmniej jeden z: (a) oddalenie ≥**2 m** (≥1,25 m poza zasięgiem ręki); (b) bariery
zwiększające drogę dotyku do wartości z (a), niepodłączone do ziemi/części dostępnych; (c) izolacja
części obcych wytrzymująca próbę ≥**2000 V**, prąd upływu ≤1 mA. Rezystancja izolacji
podłóg/ścian: ≥**50 kΩ** (napięcie instalacji ≤500V) lub ≥**100 kΩ** (>500V).

### 413.4 Ochrona za pomocą nieuziemionych połączeń wyrównawczych miejscowych

Przewody łączą wszystkie części przewodzące jednocześnie dostępne i części przewodzące obce; system
bez połączenia elektrycznego z ziemią przez te części.

### 413.5 Ochrona za pomocą separacji elektrycznej

Zabezpiecza przed prądem rażeniowym przy dotyku części, które mogłyby znaleźć się pod napięciem
wskutek uszkodzenia izolacji podstawowej pojedynczego obwodu separowanego. Zasilanie: transformator
separacyjny lub źródło równoważne. Napięcie obwodu separowanego ≤**500 V**. Części czynne obwodu
separowanego niepołączone w żadnym punkcie z innym obwodem/ziemią. Przy zasilaniu jednego
urządzenia: części dostępne nieprzyłączone do przewodu ochronnego ani innych obwodów. Przy
zasilaniu więcej niż jednego urządzenia (413.5.3): dodatkowe wymagania — izolowane nieuziemione
przewody wyrównawcze między częściami dostępnymi, gniazda ze stykami ochronnymi przyłączonymi do
tego systemu, przewody giętkie z żyłą ochronną (poza urządzeniami II klasy).

> Zaleca się, aby w obwodzie separowanym iloczyn napięcia znamionowego (V) i łącznej długości
> oprzewodowania (m) nie przekraczał **100 000**, a łączna długość nie przekraczała **500 m**.
