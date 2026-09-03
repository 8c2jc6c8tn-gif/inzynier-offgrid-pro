# Moduł 12 (Kafel 12): Szybki kalkulator / tryb mobilny — treść ekranów

**Etap 3 — finał.** Trzynasty i ostatni w pełni opisany moduł treściowy. Zgodnie z audytem §25 Zasad UX. Większość ekranów to genuinie proste, samodzielne kalkulatory (Wzorzec D-lite) — mniej złożone niż silniki Doradcy z Modułów 3-6, bo dotyczą małych, tymczasowych instalacji, nie stałych systemów off-grid.

---

## EKRAN 1: Tryb uproszczony — dobór akumulatora i odbiorników
*(dawne 8.1 — Wzorzec D)*

**A:** typ i pojemność akumulatora, lista prostych odbiorników.
**B:** `czas_pracy = pojemność_Ah × napięcie / moc_odbiornika`.
**C:** *"Akumulator 100Ah/12V zasili lodówkę turystyczną (50W) przez ok. 20 godzin."*
**D:** *"To wejście dla kogoś, kto nie chce przechodzić przez pełny proces projektowy — szybka odpowiedź na jedno pytanie."*

---

## EKRAN 2: Zabezpieczenia dla małych instalacji
*(scala dawne: 8.2, 8.10 — Wzorzec D)*

**A:** prąd obciążenia, długość kabla, napięcie (12/24V).
**B:** dobór minimalnego przekroju i bezpiecznika — uproszczona wersja silnika z Modułu 5, Ekran 1, skalibrowana pod niskie napięcia i krótkie trasy typowe dla małych instalacji.
**C:** *"Przy 15A i 3m kabla potrzebujesz minimum 2,5mm² i bezpiecznika 20A."*
🔴 przekrój poniżej wyliczonego minimum.
**D:** *"Nawet mały zestaw solarny rządzi się tą samą fizyką co duża instalacja — tylko liczby są mniejsze."*

---

## EKRAN 3: Gotowe szablony zestawów
*(scala dawne: 8.3, 8.16 — Wzorzec A, przełącznik trybu)*

**A:** wybór kategorii: Kamper / Jacht / Domek letniskowy / Warsztat / Kemping, liczba osób, dni pobytu.
**B:** każdy szablon ładuje gotową listę typowych odbiorników z czasami pracy, dostosowywalną.
**C:** *"Kamping na 3 dni, 2 osoby: telefon, lodówka turystyczna, oświetlenie LED, radio — gotowy zestaw paneli i akumulatora do wyboru."*
**D:** *"Zamiast zaczynać od zera, wybierasz swój typ wyjazdu i dostajesz gotowy punkt startowy."*

---

## EKRAN 4: "Mam akumulator — co mogę podłączyć?"
*(dawne 8.4 — Wzorzec D)*

**A:** typ akumulatora (AGM/LiFePO4/kwasowy), pojemność (Ah), napięcie.
**B:** lista urządzeń możliwych do zasilenia z podanym czasem pracy dla każdego.
**C:** *"Akumulator 100Ah LiFePO4 12V: lodówka turystyczna 20h, laptop 15h, oświetlenie LED 100h — wszystko razem jednocześnie: 8h."*
**D:** *"Odwrotność typowego pytania — zamiast 'jaki akumulator potrzebuję', pytasz 'co mogę zrobić z tym, co mam'."*

---

## EKRAN 5: Kalkulator "na weekend"
*(dawne 8.5 — Wzorzec D)*

**A:** liczba dni (2-3), liczba osób, lista urządzeń (oświetlenie LED, radio, ładowarki USB, wentylator).
**B:** sumaryczne zapotrzebowanie na weekend, z typowych mocy i czasów pracy z bazy.
**C:** *"Weekend dla 4 osób: potrzebujesz ok. 4kWh łącznie — akumulator 100Ah/12V (1,2kWh) wystarczy przy doładowaniu panelem 100W w ciągu dnia."*

---

## EKRAN 6: Szybki dobór paneli PV dla pojedynczego urządzenia
*(dawne 8.6 — Wzorzec D)*

**A:** urządzenie i jego moc (np. lodówka 50W), czas pracy dziennie, uproszczona lokalizacja.
**B:** dobór mocy panelu na podstawie dobowego zapotrzebowania i średniego nasłonecznienia.
**C:** *"Lodówka 50W pracująca 24h/dobę potrzebuje panelu min. 150W przy Twoim nasłonecznieniu."*

---

## EKRAN 7: Powerbank solarny vs mały akumulator
*(dawne 8.7 — Wzorzec B)*

**A:** przeznaczenie (telefon/tablet/laptop/lodówka turystyczna/oświetlenie awaryjne).
**B:** porównanie pojemności, wagi, ceny, czasu ładowania między gotowymi powerbankami solarnymi a małymi zestawami akumulator+panel.
**C:** *"Do ładowania telefonu wystarczy powerbank solarny 20 000mAh. Do lodówki turystycznej potrzebujesz osobnego akumulatora — powerbanki nie mają wystarczającej mocy ciągłej."*

---

## EKRAN 8: Przetwornice — mode-switch po typie konwersji
*(scala dawne: 8.9, 8.41, 8.42 — Wzorzec A)*

**Tryb "USB/12V→5V" (dawne 8.9):** dobór przetwornicy/ładowarki USB wg mocy urządzenia.
**Tryb "12V→230V" (dawne 8.41):** dobór mocy przetwornicy/falownika wg listy urządzeń 230V i ich prądów rozruchowych. *"3 urządzenia 230V o łącznej mocy 800W + prąd rozruchowy lodówki (3×) — potrzebujesz przetwornicy min. 1500W."*
**Tryb "12V→24V" (dawne 8.42):** kiedy potrzebne — zasilanie urządzeń 24V z akumulatora 12V, dobór przetwornicy DC/DC.
**D:** *"Trzy różne kierunki konwersji napięcia, ta sama zasada doboru — moc urządzenia plus zapas na rozruch."*

---

## EKRAN 9: Ochrona przed rozładowaniem akumulatora
*(dawne 8.11 — Wzorzec D)*

**A:** typ akumulatora, napięcie znamionowe.
**B:** dobór dozownika napięcia (low voltage disconnect) — odłącza odbiornik przy zbyt niskim napięciu, chroniąc akumulator przed głębokim rozładowaniem.
**C:** *"Dla AGM 12V ustaw odcięcie na 11,5V. Dla LiFePO4 — 11,0V (inna krzywa rozładowania)."*
🔴 brak dozownika przy akumulatorze kwasowym/AGM zasilającym odbiornik bez własnego zabezpieczenia — realne ryzyko trwałego uszkodzenia przez głębokie rozładowanie.

---

## EKRAN 10: Łączenie paneli przenośnych
*(dawne 8.12 — Wzorzec D)*

**A:** typ paneli przenośnych (składane/mata/powerbank solarny), liczba sztuk, napięcie, moc.
**B:** sprawdzenie kompatybilności złączy i napięć przy łączeniu różnych paneli przenośnych (często różne standardy złączy między producentami).
**C:** *"Dwa panele składane 100W tego samego producenta — połącz równolegle dla zachowania napięcia ładowania."*
🔴 łączenie paneli o niekompatybilnych złączach bez odpowiedniego adaptera.

---

## EKRAN 11: Kalkulator zużycia energii per urządzenie — moduł zbiorczy
*(scala dawne: 8.23-28 [już wcześniej scalone] + 8.15 dołączone podczas audytu treści — Wzorzec D)*

Jeden generyczny kalkulator z bazą urządzeń do wyboru z listy (zamiast osobnych ekranów per urządzenie): LED, czajnik, pompa głębinowa, klimatyzator, TV/laptop, kamera monitoringu, **lodówka turystyczna (dawne 8.15, dołączona)**.
**Logika wspólna:** `zużycie_dobowe = moc × czas_pracy`, z korektą dla urządzeń cyklicznych (lodówka, klimatyzator) uwzględniającą współczynnik załączenia (np. kompresor lodówki pracuje ~40% czasu, nie w sposób ciągły).
**Przykład (lodówka turystyczna):** *"Lodówka turystyczna 45W, współczynnik pracy kompresora 40% przy 25°C otoczenia — realne zużycie dobowe ok. 430Wh, nie 1080Wh jak sugerowałaby sama moc znamionowa."*

---

## EKRAN 12: Kreator zasilania małego odbiornika — moduł zbiorczy
*(scala dawne: 8.29-36 [już wcześniej scalone] + 8.17,18,19,21,48,52,53,67 dołączone podczas audytu treści — Wzorzec D)*

Jeden kreator ze scenariuszami do wyboru z listy: oświetlenie awaryjne, ładowanie telefonów, alarm, brama, ogród, fontanna, wentylator, sterownik CO, **pompka wodna/hydrofor, elektronarzędzia, router i monitoring, bojler turystyczny, praca zdalna (laptop+router), lodówka domowa awaryjnie, kocioł gazowy awaryjnie, brama garażowa (dołączone)**.
**Logika wspólna:** dla każdego scenariusza — moc odbiornika, wymagany czas podtrzymania, dobór minimalnego zestawu (akumulator+ewentualny falownik).
**Przykład (kocioł gazowy awaryjnie):** *"Sterownik kotła gazowego (nie sam kocioł — to gaz) potrzebuje tylko 30W do podtrzymania elektroniki i pompy obiegowej — mały akumulator 20Ah wystarczy na 12h bez zasilania sieciowego."*

---

## EKRAN 13: Blackout w domu — minimum do przeżycia
*(dawne 8.20 — Wzorzec D)*

**A:** lista krytycznych odbiorników (lodówka, router, oświetlenie, ładowarki), dostępne akumulatory/panele, przewidywany czas trwania blackoutu.
**B:** dobór minimalnego zestawu pokrywającego tylko odbiorniki krytyczne przez zadany czas.
**C:** *"Lodówka + router + oświetlenie awaryjne przez 24h: potrzebujesz akumulatora min. 100Ah/12V i falownika 300W."*
**D:** *"To nie jest projekt pełnego off-gridu — to minimum, żeby przetrwać awarię sieci bez paniki."*

---

## EKRAN 14: Raport bezpieczeństwa małej instalacji — RAPORT
*(dawne 8.22 — Wzorzec G)*

Agreguje wszystkie elementy małej instalacji (akumulator, panele, regulator, przewody, bezpieczniki) w jeden raport zgodności, analogiczny do Modułu 5 (normy i certyfikaty), ale uproszczony pod skalę małej instalacji.

---

## EKRAN 15: Kable/bezpieczniki do kampera + dobór złączek
*(scala dawne: 8.13, 8.49 — Wzorzec D)*

**A:** prądy w instalacji kampingowej/samochodowej, długości kabli, warunki środowiskowe (na zewnątrz/w kamperze).
**B:** dobór wg tego samego wzoru co Moduł 5, Ekran 1, skalibrowany do niskich napięć i krótszych tras.
**C:** *"Instalacja 12V w kamperze, 15A, 4m: minimum 4mm², bezpiecznik 20A z certyfikatem do zastosowań mobilnych (wibracje)."*

---

## EKRAN 16: Czas pracy na akumulatorze samochodowym
*(dawne 8.14 — Wzorzec D)*

**A:** pojemność i napięcie akumulatora samochodowego, moc podłączonych urządzeń, typ akumulatora (rozruchowy/AGM/kwasowy).
**B:** czas pracy z zastrzeżeniem, że akumulator rozruchowy nie jest projektowany do głębokiego rozładowania (w przeciwieństwie do AGM/żelowego).
🔴 planowanie długiego rozładowania akumulatora typowo rozruchowego (ryzyko niezdolności do odpalenia silnika).
**D:** *"Akumulator rozruchowy jest zoptymalizowany pod krótki, mocny impuls (rozruch silnika), nie pod długie, powolne oddawanie prądu — użyty źle, wysiądzie szybciej niż sugerowałaby jego pojemność."*

---

## EKRAN 17: Dobór akumulatora do kampera (AGM vs LiFePO4)
*(dawne 8.37 — Wzorzec B)*

Porównanie wagowe i pojemnościowe dla zastosowania mobilnego, gdzie waga ma bezpośredni wpływ na zużycie paliwa/zasięg — cross-ref Moduł 4, Ekran 30 (pełne porównanie technologii), tu w wersji uproszczonej pod kątem ograniczeń wagowych pojazdu.

---

## EKRAN 18: Dobór panelu do kampera (elastyczny vs sztywny)
*(dawne 8.38 — Wzorzec B)*

Porównanie: elastyczny (lżejszy, dopasowuje się do zakrzywionego dachu, ale krótsza żywotność, gorsze chłodzenie od spodu) vs sztywny (cięższy, trwalszy, lepsza wentylacja spodnia = wyższa sprawność).

---

## EKRAN 19: Ile paneli na dachu kampera
*(dawne 8.39 — Wzorzec D)*

**A:** wymiary dachu, wymiary paneli, powierzchnia zajęta przez inne elementy (klimatyzator dachowy, świetliki).
**B:** algorytm pakowania podobny do Modułu 3, Ekran 2 (wiata), skalowany do mniejszej powierzchni.
**C:** *"Dach 6×2,3m minus klimatyzator i 2 świetliki — zmieścisz 3 panele po 175W (łącznie 525W)."*

---

## EKRAN 20: Ładowanie z alternatora vs paneli
*(scala dawne: 8.40, 8.43 — Wzorzec B)*

Porównanie: alternator (ładuje tylko podczas jazdy, ale wysoką mocą) vs panele (ładują cały dzień postoju, ale zależnie od pogody); dobór prostownika/DC-DC do bezpiecznego ładowania z alternatora bez przeciążania instalacji samochodowej.
**C:** *"Przy 3h jazdy dziennie alternator da 900Wh. Przy postoju w słońcu panel 200W da 1000Wh. Kombinacja obu daje najbardziej niezawodne pokrycie."*

---

## EKRAN 21: Monitoring małej instalacji
*(dawne 8.44 — przeniesione do Modułu 13 jako widżet Live)*

Ta funkcja nie ma tu ekranu — to widżet biblioteki Trybu Live, czwarty taki przypadek (razem z 2.48, 3.26, 6.33).

---

## EKRAN 22: Bezpieczeństwo w kamperze
*(dawne 8.45 — Wzorzec E)*

Checklist: wentylacja miejsca montażu akumulatora (szczególnie AGM/kwasowy — gazy), stabilne mocowanie wytrzymujące wibracje drogowe, dostęp serwisowy bez demontażu zabudowy.

---

## EKRAN 23: Zabezpieczenia przeciwwilgociowe dla małych instalacji
*(dawne 8.46 — Wzorzec D)*

Uproszczona wersja Modułu 4, Ekran 10 (kondensacja) — dla warunków garaż/piwnica/namiot/jacht, z doborem stopnia IP wg środowiska.

---

## EKRAN 24: Lista kontrolna na kemping
*(dawne 8.47 — Wzorzec E)*

Checklist generowana wg liczby dni/osób/sezonu: kable, panele, akumulator, ładowarki, oświetlenie, ewentualnie lodówka turystyczna — z ilościami dostosowanymi do wprowadzonych parametrów.

---

## EKRAN 25: Szybka diagnoza problemów
*(dawne 8.50 — Wzorzec D, diagnostyka reaktywna)*

**A:** zgłaszany objaw (brak prądu/niskie napięcie/przegrzewanie).
**B:** drzewo decyzyjne najczęstszych przyczyn dla danego objawu, prowadzące do konkretnych kroków sprawdzających.
**C:** *"Brak prądu mimo naładowanego akumulatora → sprawdź: (1) bezpiecznik główny, (2) styk na złączu, (3) czy nie zadziałał dozownik niskiego napięcia."*
**D:** *"To odwrotność reszty aplikacji — zamiast projektować od zera, pomaga znaleźć, co już się zepsuło."*

---

## EKRAN 26: Zasilanie urządzeń medycznych
*(dawne 8.51 — Wzorzec D)*

**A:** moc urządzenia medycznego (CPAP, koncentrator tlenu, inhalator), napięcie, wymagany czas pracy (zwykle cała noc, 8-10h).
**B:** dobór z podwyższonym marginesem bezpieczeństwa ze względu na krytyczność zastosowania — nie tylko pokrycie nominalnego zapotrzebowania, ale realny zapas na nieprzewidziane wydłużenie czasu pracy.
🔴 dobór "na styk" bez zapasu dla urządzenia podtrzymującego funkcje życiowe — to jest kategoria, gdzie standardowe marginesy bezpieczeństwa (używane gdzie indziej w aplikacji) są niewystarczające.
**D:** *"To nie jest zwykły odbiornik — błąd w doborze zasilania dla sprzętu medycznego ma bezpośrednie konsekwencje zdrowotne, nie tylko niewygodę."*
Cross-ref: Moduł 2, Ekran 1 (Survival Core).

---

## EKRAN 27: "Czy mogę podłączyć urządzenie 12V bezpośrednio?"
*(dawne 8.54 — Wzorzec D)*

**A:** napięcie urządzenia i jego tolerancja, realne napięcie akumulatora (nie nominalne 12V, tylko rzeczywisty zakres 11-14,5V w zależności od stanu naładowania).
**B:** sprawdzenie, czy urządzenie wytrzyma górny zakres napięcia akumulatora w pełni naładowanego (do 14,5V przy ładowaniu).
🔴 urządzenie o wąskiej tolerancji napięciowej (np. dokładnie 12,0V ±5%) podłączone bezpośrednio bez stabilizacji — może zostać uszkodzone przy napięciu ładowania.
**D:** *"'12V' na etykiecie akumulatora to uproszczenie — realne napięcie waha się od 11V (rozładowany) do 14,5V (ładowanie), i nie każde urządzenie 12V to wytrzyma bez stabilizacji."*

---

## EKRAN 28: Zabezpieczenie akumulatora przed zimnem — mała instalacja
*(dawne 8.55 — Wzorzec D)*

Uproszczona wersja Modułu 4, Ekran 12 (Cold C-Rate) dla małych, mobilnych zastosowań — ograniczenie prądu ładowania i ostrzeżenie przed ładowaniem poniżej progowej temperatury.

---

## EKRAN 29: Koszt małego zestawu solarnego vs przedłużacz
*(dawne 8.56 — Wzorzec B)*

**A:** odległość od najbliższego przyłącza sieciowego, koszt przedłużenia linii, zapotrzebowanie energetyczne.
**B:** porównanie TCO: koszt jednorazowy przedłużacza/linii vs koszt zestawu solarnego + brak kosztów eksploatacji.
**C:** *"Przy odległości 80m koszt wykopania i ułożenia kabla to ok. 2000zł. Mały zestaw solarny (panel 200W + akumulator) kosztuje 1500zł i nie wymaga dalszych wydatków."*

---

## EKRAN 30: Gniazda zapalniczki samochodowej i adaptery
*(dawne 8.57 — Wzorzec C)*

Informacyjny: max prąd gniazda zapalniczki (typowo 10-15A), lista urządzeń które można/nie można bezpiecznie podłączyć (lodówka turystyczna zwykle tak, kompresor do opon na granicy, sprzęt >180W raczej nie).
🔴 przeciążenie gniazda zapalniczki urządzeniem o zbyt dużym poborze — ryzyko przepalenia bezpiecznika lub przewodów instalacji samochodowej.

---

## EKRAN 31: Planowanie rozbudowy małej instalacji
*(dawne 8.58 — Wzorzec D)*

Uproszczona wersja Modułu 2, Ekran 13 (bufor na rozbudowę) — dla małych, tymczasowych instalacji, z uwzględnieniem ograniczeń przestrzennych (ile jeszcze paneli/akumulatorów fizycznie się zmieści).

---

## EKRAN 32: Ile dni pracy bez słońca — mały zestaw
*(dawne 8.59 — Wzorzec D)*

Uproszczona wersja Modułu 2, Ekran 7 (dni autonomii) dla małych zestawów — z prostszym interfejsem (mniej parametrów) dopasowanym do prostszych, tymczasowych instalacji.

---

## EKRAN 33: Test "czy mój akumulator jest jeszcze dobry?"
*(dawne 8.60 — Wzorzec D)*

Uproszczona wersja Modułu 4, Ekran 14 (SoH) — pomiar napięcia spoczynkowego + opcjonalny test obciążeniowy, bez pełnej diagnostyki BMS (bo małe instalacje często nie mają zaawansowanego BMS).

---

## EKRAN 34: Solarny generator (stacja) vs zestaw DIY
*(dawne 8.61 — Wzorzec B)*

Porównanie gotowych stacji zasilania (typu EcoFlow, Bluetti) z samodzielnie skonstruowanym zestawem — mobilność i wygoda vs cena za Wh i możliwość rozbudowy.

---

## EKRAN 35: Agregat przenośny — ile paliwa na dobę
*(dawne 8.62 — Wzorzec D)*

Uproszczona wersja Modułu 7, Ekran 2 (deficyty i agregat) dla pojedynczego, przenośnego agregatu bez integracji z pełnym systemem off-grid.

---

## EKRAN 36: Bezpieczne ładowanie w garażu
*(dawne 8.63 — Wzorzec E)*

Checklist: wentylacja pomieszczenia (szczególnie kwasowy/AGM — wodór), brak źródeł iskrzenia w pobliżu, odpowiedni typ ładowarki dla danej chemii.

---

## EKRAN 37: Urządzenia zabronione dla małych falowników
*(dawne 8.64 — Wzorzec C)*

Lista ostrzegawcza: urządzenia o wysokim prądzie rozruchowym względem przeciążalności małego falownika (kompresory, niektóre narzędzia z silnikiem indukcyjnym) — z konkretnymi progami "falownik X W udźwignie / nie udźwignie urządzenia Y".

---

## EKRAN 38: Uziemienie małej instalacji
*(dawne 8.65 — Wzorzec D)*

Uproszczona wersja Modułu 5, Ekran 9/11 (uziemienie) dla instalacji tymczasowych/mobilnych, gdzie pełne uziemienie budynkowe nie ma zastosowania (kamper, jacht).

---

## EKRAN 39: Łączenie paneli z powerbankiem/stacją zasilania
*(dawne 8.66 — Wzorzec D)*

**A:** napięcie panelu (Voc, Vmp), parametry wejścia solarnego stacji (max napięcie, max prąd, typ złącza).
🔴 przekroczenie max napięcia wejścia solarnego stacji zasilania — te urządzenia mają zwykle niższe limity niż profesjonalne MPPT, łatwo je uszkodzić panelem dobranym pod "dorosłą" instalację.

---

## EKRAN 40: Blackout w bloku — zestaw balkonowy
*(dawne 8.68 — Wzorzec D)*

**A:** lista krytycznych odbiorników, dostępna przestrzeń balkonowa, parametry paneli balkonowych.
**C:** *"Balkon 2×1m: 1 panel 400W + mały akumulator wystarczy na podtrzymanie routera, ładowania telefonów i częściowego oświetlenia przez kilka godzin dziennie."*
**D:** *"Off-grid nie wymaga działki — nawet balkon w bloku może dać realną niezależność awaryjną, w mniejszej skali."*

---

## EKRAN 41: Czy mój przedłużacz wytrzyma?
*(dawne 8.69 — Wzorzec D)*

**A:** przekrój przedłużacza (mm²), długość, moc podłączanego urządzenia, napięcie 230V.
**B:** ten sam wzór spadku napięcia/obciążalności co Moduł 5, Ekran 1, dla typowych przekrojów przedłużaczy (0,75/1,0/1,5mm²).
🔴 *"Przedłużacz 0,75mm² i 20m dla urządzenia 2000W — przegrzeje się. Maksymalna bezpieczna moc dla tego przekroju i długości to ok. 1000W."*
**D:** *"Przedłużacz to też kabel, który podlega tej samej fizyce co okablowanie stałe — długi i cienki przedłużacz do dużego obciążenia to realne ryzyko pożaru, nie tylko niewygoda."*

---

## EKRAN 42: Ratowanie rozładowanego akumulatora — mała instalacja
*(dawne 8.70 — Wzorzec D)*

**Uwaga o możliwym duplikacie:** ta funkcja opisuje ten sam problem co Moduł 11, Ekran A9 (ratowanie LiFePO4) i Ekran B11 (ratowanie zasiarczonego kwasowego), tylko w wersji uproszczonej dla małych instalacji. Przy pełnej implementacji ten ekran powinien **odsyłać** do pełnych procedur w Module 11 wg wybranej chemii, zamiast duplikować logikę ratunkową po raz trzeci.
**A:** napięcie spoczynkowe, typ akumulatora (AGM/kwasowy — LiFePO4 w małych zestawach rzadsze, ale możliwe).
**C:** *"Twój akumulator to AGM — zobacz pełną procedurę ratowania w sekcji Montaż baterii → Ratowanie zasiarczonego akumulatora."*

---

## Podsumowanie modułu

**42 ekrany** (39 z pełną treścią + 1 pozycja przeniesiona do Modułu 13 + 2 moduły zbiorcze rozszerzone o dodatkowe pozycje znalezione podczas audytu), pokrywających 70 pierwotnych funkcji tego rozdziału (koryguje wcześniejszy szacunek "72" z §25 — 1.22/1.23 z Modułu 2 finalnie **zostały** w Module 2, nie tutaj, zgodnie z korektą z tamtego dokumentu).

**Twarde stopy zidentyfikowane w tym module:** dobór "na styk" bez zapasu dla urządzeń medycznych (Ekran 26), akumulator rozruchowy używany do głębokiego rozładowania (Ekran 16), przeciążenie gniazda zapalniczki (Ekran 30), przekroczenie limitu napięcia wejścia solarnego małej stacji zasilania (Ekran 39), przedłużacz o niewystarczającym przekroju względem mocy i długości (Ekran 41).

**Zidentyfikowany potencjalny potrójny duplikat:** procedury ratowania rozładowanego akumulatora istnieją teraz w trzech miejscach (Moduł 11 ×2 dla obu chemii + ten moduł uproszczony) — rozwiązane przez odesłanie zamiast duplikacji logiki.

---

**Wersja:** 1.0 — pełna treść Modułu 12 (Etap 3) — **ostatni moduł, etap 3 zamknięty dla wszystkich 13 modułów**
**Data:** Sierpień 2026
**Status:** Wszystkie 42 ekrany gotowe do przekazania deweloperowi.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, oraz wszystkie pozostałe pliki Tresc_Modul_*.md (1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13)
