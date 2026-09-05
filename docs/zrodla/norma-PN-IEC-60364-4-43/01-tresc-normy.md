# PN-IEC 60364-4-43:1999 — Treść (Wyciąg)

Metoda ekstrakcji: `antiword`/`wvHtml` z pliku `.doc` (Word 95/97, kodowanie cp1250), nie OCR.
Tablica 43A zweryfikowana krzyżowo dwiema metodami (ASCII-art tekstowy i realna struktura
`<table>` HTML) — wynik identyczny.

## 43 — Zabezpieczenie przed prądem przetężeniowym

### 431 Postanowienia ogólne

Przewody robocze powinny być zabezpieczone urządzeniem/urządzeniami powodującymi samoczynne
wyłączenie zasilania w razie przeciążenia (433) i zwarcia (434), jeżeli prądy przetężeniowe nie są
ograniczone zgodnie z 436. Zabezpieczenia przed prądem przeciążeniowym i zwarciowym powinny być
skoordynowane zgodnie z 435.

> UWAGI: (1) Przewody zabezpieczone przed przeciążeniem wg 433 uważa się za zabezpieczone również
> przed prądami zakłóceniowymi o podobnych wartościach. (2) Warunki stosowania — patrz 473.
> (3) Zabezpieczenie przewodów wg tego arkusza nie zawsze zapewnia zabezpieczenie urządzeń
> przyłączonych do tych przewodów.

### 432 Rodzaje urządzeń zabezpieczających

**432.1 Jednocześnie przed przeciążeniem i zwarciem.** Zdolność przerywania ≥ spodziewany prąd
zwarciowy w miejscu instalacji. Przykłady: wyłączniki z wyzwalaczami przeciążeniowymi (IEC 60898,
IEC 60947-2, IEC 61009); wyłączniki współpracujące z bezpiecznikami topikowymi; bezpieczniki
topikowe z wkładkami charakterystyki gG (IEC 60269-1/2/3).

**432.2 Tylko przed przeciążeniem.** Charakterystyka czasowo-prądowa odwrotnie proporcjonalna;
zdolność przerywania tylko poniżej przewidywanego prądu zwarciowego.

**432.3 Tylko przed zwarciem.** Gdy zabezpieczenie przeciążeniowe jest inne lub niekonieczne wg 473.
Zdolność przerywania ≥ spodziewany prąd zwarciowy. Przykłady: wyłączniki z wyzwalaczami zwarciowymi,
bezpieczniki topikowe.

**432.4 Przewody połączone równolegle** — zabezpieczenie wg 47.

### 433 Zabezpieczenie przed prądem przeciążeniowym

**433.1** Urządzenia zabezpieczające dobrane tak, aby przerwanie prądu przeciążeniowego nastąpiło
zanim wystąpi ryzyko uszkodzenia izolacji/połączeń/zacisków/otoczenia przewodów wskutek nadmiernego
wzrostu temperatury.

**433.2 Koordynacja przewodów i urządzeń zabezpieczających.** Dwa warunki:

**IB ≤ In ≤ Iz**

**I₂ ≤ 1,45 × Iz**

gdzie: IB — prąd obliczeniowy obwodu; Iz — obciążalność prądowa długotrwała przewodu (patrz ark.
523, tj. odpowiednik dzisiejszej normy PN-HD 60364-5-52, `docs/zrodla/norma-PN-HD-60364-5-52/`);
In — prąd znamionowy urządzenia zabezpieczającego (dla urządzeń regulowanych: prąd nastawiony);
I₂ — prąd zadziałania urządzenia w określonym czasie (wg normy wyrobu lub danych producenta).

> Zabezpieczenie to nie zapewnia pełnej ochrony we wszystkich przypadkach (np. długotrwały prąd
> przeciążeniowy poniżej I₂) — zakłada się, że obwód jest tak zaprojektowany, że taka sytuacja jest
> mało prawdopodobna.

### 434 Zabezpieczenie przed prądami zwarciowymi

**434.1** Urządzenia zabezpieczające dobrane tak, aby przerwanie prądu zwarciowego nastąpiło zanim
wystąpi ryzyko uszkodzeń cieplnych/mechanicznych przewodów i połączeń.

**434.2** Przewidywane prądy zwarciowe określa się metodą obliczeniową lub pomiarową, w miejscach
gdzie ich znajomość jest niezbędna.

**434.3 Charakterystyki urządzeń zabezpieczających przed zwarciem.**

**434.3.1** Zdolność przerywania ≥ spodziewany prąd zwarciowy w miejscu instalacji — z wyjątkiem
przypadku, gdy przed danym urządzeniem (od strony zasilania) znajduje się inne urządzenie o
wystarczającej zdolności przerywania, a charakterystyki obu urządzeń są skoordynowane tak, by
energia przenoszona przez każde nie przekraczała energii, jaką mogą bez uszkodzenia wytrzymać
urządzenia/przewody za danym zabezpieczeniem.

**434.3.2** Czas przerwania prądu zwarciowego nie powinien podnosić temperatury przewodu powyżej
dopuszczalnej granicznej wartości. Dla czasu zwarcia ≤5 s, w przybliżeniu:

**I × √t = k × S**

(równoważnie: t = (k×S/I)², lub k²S² ≥ I²t)

gdzie: t — czas w sekundach; S — przekrój w mm²; I — wartość skuteczna prądu zwarciowego w A; k —
czynnik zależny od rezystancji, współczynnika temperatury, pojemności cieplnej przewodu oraz
temperatury początkowej i końcowej. Wartości k dla przewodów **roboczych** (fazowych) — **Tablica
43A** niżej.

#### Tablica 43A — Wartości współczynnika k dla przewodów roboczych

| | PVC ≤300 mm² | PVC >300 mm² | EPR/XLPE | Gumowa 60°C | Mineralna z PVC | Mineralna bez powłoki |
|---|---|---|---|---|---|---|
| Temperatura początkowa, °C | 70 | 70 | 90 | 60 | 70 | 105 |
| Temperatura końcowa, °C | 160 | 140 | 250 | 200 | 160 | 250 |
| **k — Miedź** | 115 | 103 | 143 | 141 | 115 ᵃ | 135 |
| **k — Aluminium** | 76 | 68 | 94 | 93 | – | – |
| **k — Połączenia przewodów miedzianych lutowane cyną** | 115 | – | – | – | – | – |

ᵃ Wartość ta powinna być stosowana dla dostępnych przewodów gołych.

> UWAGI: (1) Dla bardzo krótkich czasów (<0,1 s), gdy istotna jest składowa nieokresowa oraz dla
> urządzeń ograniczających prąd, iloczyn k²S² powinien być większy niż energia (I²t), którą wg
> danych producenta może przenosić urządzenie zabezpieczające. (2) Wartości współczynnika w
> opracowaniu dla: przewodów o małych przekrojach (<10 mm²), prądów zwarciowych >5 s, innych
> rodzajów połączeń, przewodów gołych. (3) Znamionowy prąd urządzeń zabezpieczających przed
> zwarciem może być większy od obciążalności prądowej długotrwałej przewodu. (4) Wartości zgodne z
> IEC 60724 (norma powołana informacyjnie).

### 435 Koordynacja zabezpieczeń przeciążeniowych i zwarciowych

**435.1 Zabezpieczenie za pomocą wspólnego urządzenia.** Jeśli urządzenie zabezpieczające przed
przeciążeniem (433) ma zdolność przerywania ≥ spodziewany prąd zwarciowy — może być traktowane
także jako zabezpieczenie przed zwarciem przewodów za nim (od strony zasilania). (Zasada może nie
obowiązywać dla pełnego zakresu prądów zwarciowych — sprawdzić wg 434.3.)

**435.2 Zabezpieczenie za pomocą osobnych urządzeń.** Charakterystyki urządzenia przeciążeniowego
(433) i zwarciowego (434) powinny być skoordynowane tak, aby energia przeniesiona przez urządzenie
zwarciowe nie przekraczała energii, którą bez uszkodzenia może przenieść urządzenie przeciążeniowe.

### 436 Ograniczenie prądów przetężeniowych przez charakterystyki źródła energii elektrycznej

Przewody zasilane ze źródła o takiej impedancji, że największy możliwy prąd nie przekracza ich
obciążalności prądowej długotrwałej, są zabezpieczone przed wszystkimi prądami przetężeniowymi bez
dodatkowego urządzenia (np. przewody zasilane z transformatorów dzwonkowych, spawalniczych,
agregatów prądotwórczych o odpowiednio wysokiej impedancji wewnętrznej).

## Załącznik krajowy NA (informacyjny) — normy powołane i ich odpowiedniki krajowe

Wykaz odsyła m.in. do: IEC 60269-1/2/3 (bezpieczniki topikowe, odpowiedniki PN-91/E-06160/10,
PN-91/E-06160/20, PN-87/E-93100/01); IEC 60364-4-47 (stosowanie środków ochrony bezpieczeństwa,
odpowiednik PN-IEC 60364-4-47:1999); IEC 60364-4-473 (środki ochrony przed przetężeniem, odpowiednik
PN-IEC 60364-4-473:1999); IEC 60364-5-523 (obciążalność prądowa długotrwała przewodów — odpowiednik
dzisiejszej PN-HD 60364-5-52); IEC 60898 (wyłączniki do zabezpieczeń przetężeniowych instalacji
domowych, odpowiednik PrPN-IEC 60898); IEC 60947-2/EN 60947-2 (aparatura rozdzielcza i sterownicza
niskonapięciowa — wyłączniki); IEC 61009-1 (wyłączniki różnicowoprądowe z wbudowanym zabezpieczeniem
nadprądowym RCBO).
