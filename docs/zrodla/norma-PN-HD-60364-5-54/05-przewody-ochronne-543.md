# 543 — Przewody ochronne

Zakres: str. 15-19 (PDF, liczone od 0). Metoda ekstrakcji: tekst natywny PDF, tabela i wzór
zweryfikowane wizualnie względem `page_016.png`.

## 543.1 Minimalne przekroje poprzeczne

**543.1.1** Przekrój każdego przewodu ochronnego powinien spełniać warunki samoczynnego
wyłączenia zasilania wg Rozdziału 411 w IEC 60364-4-41 i powinien wytrzymywać spodziewany prąd
zwarciowy.

Przekrój przewodu ochronnego powinien być albo obliczony zgodnie z 543.1.2, albo dobrany zgodnie
z **Tablicą 54.3** niżej. W innym przypadku, powinny być wzięte pod uwagę wymagania podane w
543.1.3. Zaciski dla przewodów ochronnych powinny umożliwiać przyłączenie przewodów o wymiarach
wymaganych przez ten podrozdział.

### Tablica 54.3 — Minimalny przekrój przewodów ochronnych

| Przekrój przewodów fazowych S, mm² | Minimalny przekrój przewodu ochronnego — jeżeli z tego samego materiału co przewód fazowy, mm² | Minimalny przekrój przewodu ochronnego — jeżeli NIE z tego samego materiału, mm² |
|---|---|---|
| S ≤ 16 | S | (k₁/k₂) × S |
| 16 < S ≤ 35 | 16 ᵃ | (k₁/k₂) × 16 |
| S > 35 | Sᵃ/2 | (k₁/k₂) × (S/2) |

Przy czym: **k₁** jest wartością k dla przewodu fazowego, otrzymaną z zależności podanej w
Załączniku A lub w HD 384.4.43, Tablica 43A, zgodnie z rodzajem materiałów przewodu oraz izolacji;
**k₂** jest wartością k dla przewodu ochronnego, dobranego odpowiednio wg Tablic od A.54.2 do
A.54.6 (patrz `zalacznik-A-wspolczynnik-k.md`).

ᵃ Dla przewodu PEN, zmniejszenie przekroju jest dopuszczalne tylko zgodnie z zasadami
wymiarowania przewodu neutralnego (patrz HD 384.5.52).

W sieciach TT, przekrój przewodów ochronnych może być ograniczony do 25 mm² (miedź) lub 35 mm²
(aluminium), pod warunkiem że uziomy punktu neutralnego źródła i części przewodzących dostępnych
są elektrycznie niezależne.

**543.1.2** Przekrój przewodów ochronnych nie powinien być mniejszy niż wyznaczona wartość albo
według IEC 60949, albo z następującej zależności (ma zastosowanie tylko dla czasów wyłączania
nieprzekraczających 5 s):

**S = √(I² · t) / k**

gdzie:
- **S** — przekrój, w mm²,
- **I** — wartość (skuteczna), w A, spodziewanego prądu zwarciowego dla zwarć o pomijalnej
  impedancji, który może płynąć przez urządzenie ochronne (patrz IEC 60949),
- **t** — czas zadziałania urządzenia ochronnego przy samoczynnym wyłączeniu, w s,
- **k** — współczynnik, którego wartość zależy od materiału przewodu, izolacji i innych części
  oraz temperatur początkowej i końcowej (aby obliczyć wartość k, patrz Załącznik A,
  `zalacznik-A-wspolczynnik-k.md`).

> UWAGA 1: Należy wziąć pod uwagę ograniczenie prądu na skutek impedancji obwodu oraz
> ograniczenie I²t urządzenia ochronnego.

Gdy uzyskana wartość przekroju przewodu ochronnego nie jest wartością znormalizowaną, należy ją
zwiększyć do najbliższej wartości przekroju znormalizowanego.

**543.1.3** Przekrój każdego przewodu ochronnego, który nie jest częścią kabla lub nie jest we
wspólnej osłonie z przewodem fazowym, nie powinien być mniejszy niż:
- 2,5 mm² Cu lub 16 mm² Al — w przypadku stosowania ochrony przed uszkodzeniami mechanicznymi,
- 4 mm² Cu lub 16 mm² Al — w przypadku niestosowania ochrony przed uszkodzeniami mechanicznymi.

> **Uwaga dla Polski (Załącznik ZC):** krajowy warunek szczególny zmienia wartość dla aluminium
> chronionego mechanicznie na **10 mm²** (nie 16 mm² jak wyżej) — patrz
> `zalacznik-ZC-szczegolne-warunki-krajowe.md`, sekcja Polska. Rozbieżność między głównym tekstem
> i załącznikiem krajowym odnotowana jawnie, nie rozstrzygana samodzielnie — dla instalacji w
> Polsce obowiązuje wartość z Załącznika ZC (normatywny).

**543.1.4** Gdy przewód ochronny jest wspólny dla dwóch lub więcej obwodów, jego przekrój
powinien być wyznaczony:
- obliczony zgodnie z 543.1.2 dla największego spodziewanego prądu zwarciowego oraz czasu jego
  przepływu w tych obwodach; lub
- dobrany zgodnie z Tablicą 54.3 tak, aby był odpowiedni do największego przekroju przewodu
  fazowego w obwodzie.

## 543.2 Rodzaje przewodów ochronnych

**543.2.1** Przewody ochronne mogą składać się z jednego z następujących:
- żył w przewodach wielożyłowych;
- izolowanych lub gołych przewodów prowadzonych we wspólnej osłonie z przewodami fazowymi;
- ułożonych na stałe przewodów gołych lub izolowanych;
- metalowych powłok kabli, ekranów kabli, pancerzy kabli, przewodów plecionych, przewodów
  koncentrycznych, metalowych rur instalacyjnych, podlegających warunkom ustalonym w 543.2.2 a)
  oraz b).

> UWAGA: Patrz 543.6, w zakresie ich rozmieszczenia.

**543.2.2** Gdy instalacja zawiera urządzenia mające metalowe obudowy (np. wyłącznik niskiego
napięcia, zespoły urządzeń sterujących, układ szyn zbiorczych), metalowe obudowy lub konstrukcje
mogą być wykorzystane jako przewody ochronne, jeżeli spełniają jednocześnie:
- a) ciągłość elektryczna zapewniona przez konstrukcję lub odpowiednie połączenie, chroniona
  przed pogorszeniem jakości mechanicznej, chemicznej i elektrochemicznej;
- b) zgodność z wymaganiem podanym w 543.1;
- c) możliwość podłączenia innych przewodów ochronnych w każdym wcześniej ustalonym dostępnym
  punkcie.

**543.2.3** Następujące części metalowe NIE są dopuszczone jako przewód ochronny ani jako przewód
ochronny wyrównawczy:
- metalowe rury wodociągowe;
- rury zawierające łatwopalne gazy lub płyny;
- części konstrukcyjne narażone na naprężenia mechaniczne w czasie normalnej pracy;
- giętkie lub sprężyste metalowe kanały, chyba że są zaprojektowane do tych celów;
- giętkie części metalowe;
- elementy podtrzymujące oprzewodowania;
- korytka instalacyjne i drabinki instalacyjne.

## 543.3 Ciągłość elektryczna przewodów ochronnych

**543.3.1** Przewody ochronne powinny być odpowiednio chronione przed uszkodzeniem mechanicznym,
chemicznym lub elektrochemicznym, oddziaływaniem sił elektrodynamicznych i sił termodynamicznych.

**543.3.2** Połączenia przewodów ochronnych powinny być dostępne dla kontroli i badań, z
wyjątkiem: połączeń niedostępnych; połączeń w obudowie nierozbieralnej; połączeń w metalowych
kanałach i obudowach przewodów szynowych; połączeń tworzących części urządzenia zgodnie z normami
wyrobu.

**543.3.3** Urządzenie niewyłączające można umieszczać w przewodzie ochronnym, lecz połączenia
wykorzystane do przeprowadzenia badań można rozłączyć jedynie z zastosowaniem narzędzi.

**543.3.4** Gdy stosowany jest elektryczny monitoring uziemień, nie należy stosować żadnych
specjalistycznych urządzeń (np. czujniki eksploatacyjne, cewki) włączonych szeregowo w przewody
ochronne.

**543.3.5** Części przewodzące dostępne aparatów nie powinny być wykorzystywane do budowy części
przewodu ochronnego innego wyposażenia, z wyjątkiem spełniających wymagania 543.2.2.

## 543.4 Przewody PEN

**543.4.1** Przewód PEN może być używany w instalacjach elektrycznych ułożonych na stałe i, z
przyczyn mechanicznych, powinien mieć przekrój nie mniejszy niż 10 mm² dla żył miedzianych i
16 mm² dla żył aluminiowych.

**543.4.2** Przewód PEN powinien mieć izolację właściwą do napięcia nominalnego układu. Metalowe
obudowy oprzewodowania nie powinny być stosowane jako przewody PEN, z wyjątkiem obudów przewodów
szynowych zgodnych z EN 61534-1.

**543.4.3** Jeżeli począwszy od jakiegokolwiek punktu instalacji funkcje neutralne i ochronne są
zapewnione przez oddzielne przewody, połączenie przewodu neutralnego z jakąkolwiek inną częścią
uziemioną w instalacji jest niedopuszczalne. Dopuszcza się utworzenie z przewodu PEN więcej niż
jednego przewodu neutralnego i więcej niż jednego przewodu ochronnego — oddzielne zaciski/szyny
dla przewodów ochronnych i neutralnych, przy czym przewód PEN przyłączony do zacisku/szyny
przeznaczonych dla przewodu ochronnego.

**543.4.4** Części przewodzące obce nie powinny być stosowane jako przewody PEN.

## 543.5 Wspólny uziom ochronny i funkcjonalny

**543.5.1** Gdy stosowany jest wspólny przewód ochronny i funkcjonalny uziemiający, powinien on
spełniać wymagania dla przewodu ochronnego oraz odpowiednie wymagania funkcjonalności (patrz
R064-004). Przewód powrotny PEL lub PEM prądu stałego do zasilania układów techniki informacyjnej
może także służyć jako wspólny przewód uziemiający i ochronny.

**543.5.2** Części przewodzące obce nie powinny być stosowane jako PEL lub PEM.

## 543.6 Rozmieszczenie przewodów ochronnych

Gdy jako element ochrony przeciwporażeniowej stosowane są zabezpieczenia nadprądowe, przewód
ochronny powinien być częścią tego samego układu oprzewodowania co przewody fazowe lub powinien
być umieszczony w ich bezpośredniej bliskości.

## 543.7 Wzmocnione przewody ochronne dla prądów w przewodach ochronnych przekraczających 10 mA

Dla odbiorników z planowanym ciągłym przyłączeniem i z prądem w przewodzie ochronnym
przekraczającym 10 mA:
- albo przewód ochronny powinien mieć przekrój co najmniej 10 mm² Cu lub 16 mm² Al na całej
  długości (UWAGA 1: Przewód PEN zgodnie z 543.4 spełnia to wymaganie);
- albo drugi przewód ochronny, co najmniej o takim samym przekroju jak wymagany w ochronie przy
  dotyku pośrednim, powinien być ułożony do punktu, w którym przewód ochronny ma przekrój nie
  mniejszy niż 10 mm² Cu lub 16 mm² Al (wymaga oddzielnego zacisku dla drugiego przewodu
  ochronnego w urządzeniu).

> UWAGA 2: W sieciach TN-C, w których jeden przewód (PEN) stanowi połączenie przewodów ochronnego
> i neutralnego, prąd w przewodzie ochronnym może być uważany za prąd obciążenia.
>
> UWAGA 3: Urządzenia elektryczne mające normalnie duży prąd przewodu ochronnego mogą nie być
> zgodne z instalacjami z zainstalowanymi urządzeniami ochronnymi różnicowoprądowymi.
