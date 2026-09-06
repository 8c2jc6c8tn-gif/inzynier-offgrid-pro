# Indeks — "Aktualne przepisy w zakresie ochrony przed porażeniem prądem elektrycznym przy urządzeniach i instalacjach do 1 kV" (materiał szkoleniowy)

Źródło: `docs/zrodla/materialy-branzowe-ochrona-przeciwporazeniowa-2010/Aktualne-przepisy-ochrona-przeciwporazeniowa-porownanie-norm.pdf`
(48 stron, prezentacja PowerPoint→PDF, autor nieznany z metadanych pliku — treść fachowa, dobrze
udokumentowana numerami klauzul norm). Metoda ekstrakcji: tekst natywny PDF + odczyt wizualny
(prezentacja to głównie slajdy tekstowe/tabelaryczne, nie skan).

## ⚠️ To NIE jest formalna norma — to materiał szkoleniowy porównujący starą i nową wersję

Podobnie jak materiał PV 2019 (`docs/zrodla/materialy-branzowe-PV-2019/`), to prezentacja
ekspercka, nie oficjalny tekst normy. Wartość dla projektu: **rozwiązuje krytyczny brak Tablic 41A
i 41B**, który odnotowaliśmy w `docs/zrodla/norma-PN-IEC-60364-4-41/00-INDEKS.md` (dokument tam był
"Wyciąg" bez tych tablic).

## 🔴 Ważne rozróżnienie: STARA norma (Tablice 41A/41B) vs AKTUALNA norma (Tablica 41.1) — to NIE te same wartości

Prezentacja jawnie pokazuje **obie wersje obok siebie**, oznaczając starą jako "nieaktualną":

### Tablica 41A (stara, PN-IEC 60364-4-41, oznaczona w prezentacji jako "nieaktualna") — maksymalne czasy wyłączenia w układzie TN

| U₀ [V] | Czas wyłączenia [s] |
|---|---|
| 120 | 0,8 |
| 230 | 0,4 |
| 277 | 0,4 |
| 400 | 0,2 |
| >400 | 0,1 |

*Wartości wg IEC 38 (1983).

### Tablica 41B (stara) — maksymalny czas wyłączenia w układach IT (podwójne doziemienie)

| Napięcie znamionowe instalacji U₀/U [V] | Czas wyłączenia bez przewodu neutralnego [s] | Czas wyłączenia z przewodem neutralnym [s] |
|---|---|---|
| 120-240 | 0,8 | 5 |
| 230/400 | 0,4 | 0,8 |
| 400/690 | 0,2 | 0,4 |
| 580/1000 | 0,1 | 0,3 |

UWAGI oryginału: (1) Dla napięć objętych granicami tolerancji IEC 38 stosuje się czasy wyłączenia
odpowiednie do ich wartości znamionowych. (2) Dla pośrednich wartości napięć stosuje się wyższą
wartość napięcia podaną w tabeli 41B.

### Tablica 41.1 (AKTUALNA, PN-HD 60364-4-41:2009, wciąż obowiązująca) — 411.3.2.2, dla obwodów końcowych o prądzie ≤32 A

Struktura zupełnie inna niż stara: rozbita na pasma napięcia, osobno a.c. i d.c., osobno TN i TT
(bez osobnej kolumny IT — patrz UWAGA niżej):

| Układ | 50V<U≤120V a.c. | 50V<U≤120V d.c. | 120V<U₀≤230V a.c. | 120V<U₀≤230V d.c. | 230V<U₀≤400V a.c. | 230V<U₀≤400V d.c. | U₀>400V a.c. | U₀>400V d.c. |
|---|---|---|---|---|---|---|---|---|
| TN | 0,8 | Uwaga 1 | 0,4 | 5 | 0,2 | 0,4 | 0,1 | 0,1 |
| TT | 0,3 | Uwaga 1 | 0,2 | 0,4 | 0,07 | 0,2 | 0,04 | 0,1 |

UWAGA 1: Wyłączenie może być wymagane z innych przyczyn niż ochrona przeciwporażeniowa.
UWAGA 2: Jeżeli wyłączenie jest przewidziane przez RCD, patrz uwagi do 411.4.4 i 411.6.4 b).
UWAGA dodatkowa (z prezentacji): jeżeli w układzie TT wyłączenie jest uzyskiwane dzięki
zabezpieczeniu nadprądowemu i połączenie wyrównawcze ochronne jest przyłączone do części
przewodzących obcych w instalacji, mogą być stosowane maksymalne czasy wyłączenia dla układu TN.

**411.3.2.2 (kontekst):** Tablica 41.1 dotyczy tylko obwodów końcowych o prądzie znamionowym
≤32 A. W układach TN czas wyłączenia ≤5 s jest dopuszczony w obwodach rozdzielczych i obwodach
niewymienionych w pkt 1 (czyli >32 A); w układach TT — czas ≤1 s w tych samych przypadkach.

### Zestawienie porównawcze (z prezentacji, 230 V a.c.)

| Rodzaj obwodu | TN | TT | IT |
|---|---|---|---|
| Obwody odbiorcze, In ≤32 A | 0,4 s | 0,2 s | 0,4 s lub 0,2 s |
| Obwody odbiorcze, In >32 A | 5 s | 1 s | 5 s lub 1 s |
| Obwody rozdzielcze, dowolny prąd | 5 s | 1 s | 5 s lub 1 s |
| Obwody bez możliwości wyłączenia w wymaganym czasie | Miejscowe połączenia wyrównawcze ochronne ograniczające długotrwale utrzymujące się napięcie dotykowe na poziomie dopuszczalnym | (jw.) | (jw.) |

## Uwaga dot. wyboru wartości do implementacji

**Do jakichkolwiek nowych kalkulatorów stosować Tablicę 41.1 (aktualną), nie Tablicę 41A/41B
(stare)** — to jest zgodne z obowiązującą dziś normą PN-HD 60364-4-41:2009, przywołaną
Rozporządzeniem Ministra Infrastruktury z 12.03.2009 r. Stare tablice zachowane tutaj wyłącznie
jako kontekst historyczny/dokumentacyjny (wyjaśniają, dlaczego oryginalny "Wyciąg" PN-IEC
60364-4-41:2000 w `docs/zrodla/norma-PN-IEC-60364-4-41/` może być pomijalny dla nowego kodu —
zawiera nieaktualne już wartości).

## Pozostała zawartość prezentacji (drugorzędna, ale zachowana)

- **Rezystancja izolacji** (PN-IEC 60364-6-61 stara vs PN-HD 60364-6:2008 aktualna) — Tablica 61A
  (stara): SELV/FELV z transformatora ochronnego → 250V probiercze/≥0,25 MΩ; do 500V → 500V/≥0,5MΩ;
  powyżej 500V → 1000V/≥1,0MΩ (wartość ucięta w źródle, prawdopodobnie ≥1,0 MΩ jak w wersji
  aktualnej). Tablica aktualna (PN-HD 60364-6:2008): SELV i PELV → 250V/≥0,5 MΩ; do 500V (w tym
  FELV) → 500V/≥1,0 MΩ; powyżej 500V → 1000V/≥1,0 MΩ.
- **Zmiany w PN-HD 60364-5-54:2010** względem starej wersji — pokrywają się z tym, co już
  udokumentowaliśmy w `docs/zrodla/norma-PN-HD-60364-5-54/` (Tablica 54.2 4-kolumnowa, definicje
  nowe, zakaz zbrojenia betonu sprężonego jako uziomu) — **potwierdzenie zgodności, nie nowa
  informacja**.
- **PN-HD 60364-7-704:2010** (instalacje na terenie budowy i rozbiórki) — norma dotąd nieomawiana
  w tym repo. Kluczowe wymagania: obwody gniazd wtyczkowych/narzędzi ręcznych ≤32 A →
  RCD ≤30 mA lub SELV/PELV/separacja elektryczna; obwody gniazd >32 A → RCD ≤500 mA; zakaz
  stosowania przeszkód/umieszczania poza zasięgiem ręki jako środka ochrony; podział terenu budowy
  na strefy ochronne (przykład schematu w prezentacji: strefy I-IV, rozdzielnice budowlane RB,
  dźwigowe RD, pomiarowe PP); kontrola stanu urządzeń stacjonarnych — co najmniej raz w miesiącu;
  RCD sprawdzane każdorazowo przed przystąpieniem do pracy; kontrola izolacji — dwa razy w roku.
  **Nowa norma, potencjalnie przydatna dla ewentualnego przyszłego ekranu "instalacja tymczasowa
  na etapie montażu" — nieplanowanego dotąd w rejestrze pokrycia.**

## Status wykorzystania w projekcie

Na 05.09.2026: dostarczony, przeanalizowany. Rozwiązuje krytyczny brak Tablic 41A/41B (choć
finalnie wskazuje, że do nowego kodu należy użyć Tablicy 41.1, nie starych 41A/41B). Niewykorzystany
jeszcze w żadnym kalkulatorze.
