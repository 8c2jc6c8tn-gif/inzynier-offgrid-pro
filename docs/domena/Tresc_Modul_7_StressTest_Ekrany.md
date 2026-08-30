# Moduł 7 (Kafel 7): Stress-test zimowy — treść ekranów

**Etap 3 — kontynuacja.** Piąty w pełni opisany moduł treściowy. Kategoryzacja tego modułu była już wcześniej oparta na pełnej liście 40 tytułów (audyt §16 w Zasadach UX), więc nie wymagała korekty jak Moduł 6. Wzory i przykłady z oryginalnego dokumentu źródłowego.

---

## EKRAN 1: Symulacja przy −20°C i −30°C
*(dawne 6.1 — Wzorzec D)*

**A:** zakres temperatur do symulacji (np. 0°C do −30°C), dane z Modułów 1-6 (produkcja PV, zapotrzebowanie na ciepło, magazyn energii — wszystko auto).
**B:** symulacja dzień po dniu: produkcja PV (obniżona przez mróz — cross-ref Moduł 3 Ekran 18), zapotrzebowanie grzewcze (rośnie ze spadkiem temperatury), dodatkowe zużycie (grzałki BMS, defrost), spadek pojemności użytecznej baterii (np. −20% przy −20°C — cross-ref Moduł 4).
**C:** *"W styczniu, przy średniej −15°C, system będzie miał 7 dni z deficytem 55 kWh. Potrzebujesz agregatu lub dodatkowych paneli."*
**D:** *"To codzienna symulacja zimy — pokazuje, czy system da radę w normalne mroźne dni, nie tylko w ekstremalnym scenariuszu z Ekranu 3."*

---

## EKRAN 2: Deficyty miesięczne i agregat
*(dawne 6.2 — Wzorzec D)*

**A:** wynik symulacji dziennej (Ekran 1), parametry agregatu (Moduł 2), ceny paliwa.
**B:** suma dziennych deficytów per miesiąc → przeliczenie na godziny pracy agregatu (przy zalecanym obciążeniu 70-80% mocy) → zużycie paliwa i koszt.
**C:** *"Grudzień: deficyt 120 kWh → agregat 5 kW pracuje 30 h → 45 l paliwa → 350 zł."*
🟡 *"W lutym agregat będzie pracował 40 h — sprawdź zapas paliwa."*
**D:** *"To portfel zimy — wiesz, ile realnie wydasz na paliwo, zanim przyjdzie mróz, zamiast dowiadywać się w trakcie."*

---

## EKRAN 3: Raport kryzysowy — RAPORT
*(dawne 6.3 — Wzorzec G)*

Ekran zbiorczy, bez pól do wypełnienia — agreguje wyniki Ekranów 1, 2, 4 i innych symulacji zimowych w jeden dokument.

**Zawartość:** całkowite zapotrzebowanie roczne/sezonowe, produkcja PV zimą, deficyty miesięczne, godziny pracy agregatu, koszt paliwa, liczba dni na granicy wyłączenia, **Współczynnik Bezpieczeństwa Zimowego** (cross-ref Ekran 12).
**Przykład:** *"Twój system przetrwa zimę na 87% — brakuje 13% energii, którą pokryje agregat. Zalecamy dodanie 4 paneli lub zwiększenie baterii o 10 kWh."*
Przycisk: "Pobierz pełny raport PDF" (cross-ref §13.1).

---

## EKRAN 4: Pełny scenariusz awaryjny "Blackout"
*(dawne 6.4 — Wzorzec D)*

**A:** dane klimatyczne najgorszego okresu (Moduł 1), konfiguracja agregatu.
**B:** symulacja skrajnego scenariusza: 10-14 dni całkowitego zachmurzenia, temperatura do −25°C; produkcja PV = 0; śledzenie SoC do momentu krytycznego minimum (np. 10%).
**C:** *"W scenariuszu 14 dni bez słońca przy −25°C Twój system padnie 9. dnia o 3:00 w nocy. Aby przetrwać, potrzebujesz dodatkowo 30 kWh baterii lub musisz ograniczyć zużycie o 40%."*
**D:** *"To test najgorszego koszmaru — jeśli system przeżyje ten scenariusz, przeżyje właściwie wszystko inne."*

---

## EKRAN 5: Procedura "Black Start"
*(dawne 6.5 — Wzorzec E, checklist)*

| Krok | Działanie | ☐ |
|---|---|---|
| 1 | Uruchom agregat, poczekaj na stabilne napięcie | ☐ |
| 2 | Podłącz agregat do ładowarki/MPPT (lub bezpośrednio do falownika, jeśli ma wejście AC) | ☐ |
| 3 | Wybudź BMS (jeśli w trybie uśpienia) | ☐ |
| 4 | Naładuj baterię do min. poziomu (np. 20%) | ☐ |
| 5 | Włącz falownik, załączaj stopniowo systemy krytyczne | ☐ |

🔴 *"Nie podłączaj agregatu bezpośrednio do baterii bez ładowarki — uszkodzisz ogniwa!"*
**D:** *"To jak rozruch samochodu po nocy na mrozie — trzeba wiedzieć dokładnie, co i w jakiej kolejności przekręcić, żeby zapalić."*

---

## EKRAN 6: Priorytetowa strategia "Zamarzanie" (Freeze Protection Load Shedding)
*(dawne 6.6 — Wzorzec D)*

**A:** temperatura wewnętrzna/zewnętrzna (live), SoC baterii (live), lista odbiorników z priorytetami (Moduł 2, Ekran 1.20), model termiczny budynku (Moduł 6, Ekran 8).
**B:** trójpoziomowa hierarchia odłączania: (1) krytyczne — pompa ciepła, pompa głębinowa, przepompownia ścieków, grzałki BMS — nigdy nie odłączane; (2) ważne — oświetlenie, router, monitoring — ostateczność; (3) komfort — zmywarka, pralka, klimatyzacja — pierwsze do odłączenia.
**C:** *"Przy SoC 15% system odłączy zmywarkę i pralkę, ale utrzyma ogrzewanie przez 12 godzin. Temperatura wewnętrzna spadnie do 12°C, ale rury nie zamarzną."*
**D:** *"Gdy energii jest mało, trzeba wybierać, co poświęcić — ogrzewanie i woda są ważniejsze niż zmywarka, i system musi to wiedzieć wcześniej, nie w panice."*

---

## EKRAN 7: Śnieg i oblodzenie na PV
*(scala dawne: 6.7, 6.20 — Wzorzec D)*

### Sekcja A
strefa śniegowa, temperatura, opady (Moduł 1); konfiguracja paneli — typ, kąt, montaż (Moduł 3); model dachu z kierunkami wiatru (Moduł 1).

### Sekcja B — dwa aspekty tego samego zjawiska
1. **Wpływ pokrywy na produkcję** (dawne 6.7): śnieg sypki przy kącie >30° może zsunąć się sam; śnieg mokry przykleja się; gołoledź/szron blokuje produkcję całkowicie.
2. **Nierównomierny rozkład** (dawne 6.20): wiatr przenosi śnieg nierównomiernie między połaciami — strona zawietrzna, krawędzie, kosze dachowe gromadzą więcej.

### Sekcja C
*"Po 24h opadów śniegu produkcja spadnie do 0%. Przy −5°C śnieg utrzyma się 3 dni, chyba że panele zostaną odśnieżone."*
*"Panele na południowej połaci są chronione przed wiatrem, ale północna strona będzie zasypywana — string północny straci produkcję na 5 dni."*
🟡 *"Nierównomierne zasypanie może wywołać różnice napięć między stringami" (cross-ref Moduł 3, Ekran 17 — mismatch).*

### Sekcja D
*"Zasypany panel to martwy panel, a wiatr rozkłada śnieg jak piasek na pustyni — nierównomiernie. Trzeba wiedzieć nie tylko ile, ale i gdzie dokładnie osiądzie."*

---

## EKRAN 8: Agregat w mrozie — praca, rozruch, długi postój
*(scala dawne: 6.9, 6.23, 6.36 — Wzorzec D)*

### Sekcja A
typ agregatu i paliwa (Moduł 2), dane klimatyczne (Moduł 1), miejsce przechowywania, planowany czas pracy ciągłej.

### Sekcja B — trzy aspekty pracy agregatu w zimie
1. **Rozruch w mrozie** (dawne 6.9): parafinizacja diesla przy −20°C, spadek pojemności akumulatora rozruchowego, gęstnienie oleju silnikowego.
2. **Praca ciągła** (dawne 6.23): maksymalny czas pracy bez przerwy (niektóre agregaty wymagają przerw co 8-12h), konieczność uzupełniania paliwa i wymiany oleju.
3. **Długi postój** (dawne 6.36): ryzyko po 2+ tygodniach bezczynności w mrozie — rozładowany akumulator, zgęstniały olej, sparafinowane paliwo.

### Sekcja C
*"Twój agregat na zwykłym dieslu nie wystartuje przy −15°C. Zastosuj paliwo arktyczne i olej 5W-40."*
*"Twój agregat może pracować ciągle 8h, potem wymaga 1h przerwy. W scenariuszu tygodniowym przepracuje 120h, zużyje 180l paliwa i wymaga 2 wymian oleju."*
*"Agregat w garażu przy −20°C po 2 tygodniach postoju może nie wystartować — rozruch zajmie 20-30 sekund zamiast 2. Zastosuj podgrzewacz bloku i akumulator AGM."*

### Sekcja D
*"Agregat też nie lubi mrozu, męczy się przy długiej pracy i 'zapomina jak żyć' po długim postoju — trzeba go przygotować na wszystkie trzy scenariusze, nie tylko sam rozruch."*

---

## EKRAN 9: Analiza albedo i wydajność bifacjalna w śniegu
*(scala dawne: 6.10, 6.21 — Wzorzec D)*

### Sekcja A
pokrywa śnieżna (Moduł 1), konfiguracja paneli — kąt, azymut, bifacjalność (Moduł 3), wysokość montażu nad gruntem.

### Sekcja B
Śnieg odbija 70-90% światła (albedo). Dla paneli pionowych/stromych — bardzo duży zysk z odbicia; dla bifacjalnych — dodatkowy zysk z tylnej strony proporcjonalny do wysokości nad gruntem i kąta.
**C:** *"Panele pionowe na ogrodzeniu zyskują dodatkowo 25% energii dzięki odbiciu od śniegu — to ratuje bilans zimowy."* *"Panele bifacjalne przy 30cm śniegu zyskują dodatkowo 20% produkcji, przy montażu pionowym zysk rośnie do 30%."*
🟡 *"Panele na dachu prawie nie korzystają z albedo — śnieg przed budynkiem szybko się brudzi."*
**D:** *"Śnieg działa jak lustro — panele pionowe i bifacjalne dostają światło z dwóch stron naraz, góry i dołu."*

---

## EKRAN 10: Analiza SPOF (Single Point of Failure)
*(dawne 6.12 — Wzorzec D)*

**A:** lista komponentów systemu (BMS, falownik, bezpieczniki, MPPT, pompy, czujniki — auto ze wszystkich modułów).
**B:** dla każdego komponentu system sprawdza istnienie redundancji (drugi BMS? zapasowy bezpiecznik? druga pompa lub obejście?) i symuluje skutki awarii.
**C:** *"Krytyczne SPOF: BMS (brak obejścia), bezpiecznik główny (brak zapasowego), pompa ciepła (brak grzałki awaryjnej)."*
🔴 *"Jeśli padnie BMS, cały system wyłączy się w 10 sekund. Zainstaluj drugi BMS lub przynajmniej stycznik awaryjny."*
**D:** *"Jeden element może pociągnąć cały system na dno — trzeba go znaleźć, zanim znajdzie go zima."*

---

## EKRAN 11: Obciążenie grzałek dachowych i rynnowych (Ice Dam Prevention)
*(dawne 6.16 — Wzorzec D)*

**A:** wymiary dachu i rynien (Moduł 1), dane klimatyczne (opady, temperatura, wilgotność), parametry kabli grzewczych.
**B:** identyfikacja stref najbardziej narażonych na zatory lodowe (kosze, strefy przy rynnach); dobór mocy kabli grzewczych i obliczenie całkowitego zużycia energii.
**C:** *"Rynny o długości 12m wymagają kabla 30 W/m, łącznie 360W. Przy pracy 6h/dobę zużyjesz 2,16 kWh/dobę."*
🟡 *"Grzałki dachowe mogą obciążyć system bardziej niż pompa ciepła — sprawdź, czy masz zapas mocy."*
**D:** *"Zamarznięte rynny to ciężar i zniszczenia — grzałki ratują dach, ale są bardzo 'głodne' prądu, trzeba to policzyć zawczasu, nie odkryć w trakcie zimy."*

---

## EKRAN 12: Ocena ryzyka i Współczynnik Bezpieczeństwa Zimowego — RAPORT
*(dawne 6.14 — Wzorzec G, z elementami D w składowych)*

Ekran agregujący wyniki wielu symulacji (6.1, 6.4, 6.7, 6.9, 6.11 i innych) w jeden procentowy wskaźnik.

**Składowe wskaźnika:** pokrycie energetyczne (produkcja/zapotrzebowanie w najgorszym miesiącu), czas autonomii, odporność na awarie (brak SPOF — Ekran 10), czas reakcji na zamarznięcie, zapas mocy agregatu.
**Przykład:** *"Współczynnik Bezpieczeństwa Zimowego: 74% (dobrze, ale są słabe punkty). Słabe punkty: brak grzałek BMS, za mała bateria, agregat bez paliwa arktycznego."*
**D:** *"To ocena z egzaminu — pokazuje, czy system zda zimę, czy będzie miał poprawkę, i dokładnie z czego."*

---

## EKRAN 13: Test sztywnienia izolacji w niskich temperaturach
*(dawne 6.17 — Wzorzec D)*

**A:** materiały izolacji kabli/osłon/złączek (baza komponentów), minimalna temperatura w lokalizacji.
**B:** progi materiałowe: PVC sztywnieje i pęka poniżej −10°C; XLPE wytrzymuje do −40°C; guma zachowuje elastyczność; aluminium kurczy się i może poluzować połączenia.
**C:** *"Twoje złączki PVC w ziemi pękną przy −15°C. Wymień na XLPE lub gumowe."*
🔴 stosowanie PVC w miejscach o spodziewanej temperaturze poniżej jego progu.
**D:** *"Mróz nie tylko chłodzi, ale i ściska — materiały kurczą się i pękają, trzeba używać takich, które to znoszą."*
Cross-ref: Moduł 5, Ekran 28 (dobór izolacji kabla).

---

## EKRAN 14: Scenariusz "Wiecznej mgły i szadzi" (Freezing Fog)
*(dawne 6.18 — Wzorzec D)*

**A:** dane o mgle/wilgotności/temperaturze (Moduł 1), konfiguracja paneli.
**B:** szadź osadza się i NIE zsuwa się sama (w przeciwieństwie do śniegu) — mgła zapobiega topnieniu, więc osad utrzymuje się długo.
**C:** *"Po 48h mgły i szadzi produkcja spadnie do 5% nominalnej. System będzie musiał polegać na baterii i agregacie."*
**D:** *"Mgła to cichy zabójca paneli — zamarza na nich jak lukier na szybie i, w przeciwieństwie do śniegu, nie odpada sama."*

---

## EKRAN 15: Strategia maksymalizacji ładowania w krótkim oknie słonecznym
*(dawne 6.22 — Wzorzec D)*

**A:** produkcja PV w ciągu dnia (Moduł 3), zapotrzebowanie (Moduł 2), SoC baterii (live), prognoza pogody.
**B:** priorytetyzacja energii w krótkim zimowym oknie słonecznym (np. 9:00-15:00): (1) bateria, (2) bojler CWU gdy bateria >80%, (3) grzałki BMS jeśli wymagają ogrzania, (4) odbiorniki nadwyżkowe na końcu.
**C:** *"W oknie 9:00-15:00 wyprodukujesz 4,5 kWh. Naładujesz baterię do 65% i zagrzejesz bojler do 50°C. Pralkę włącz dopiero jutro."*
**D:** *"Zimą słońce jest jak krótka wizyta gościa — trzeba wykorzystać każdą minutę, zanim sobie pójdzie."*

---

## EKRAN 16: Turbina wiatrowa jako wsparcie zimowe
*(dawne 6.24 — Wzorzec D)*

**A:** parametry turbiny (jeśli posiadana), dane wiatrowe lokalizacji (Moduł 1), zapotrzebowanie i SoC.
**B:** symulacja produkcji zimowej — zimą wiatry bywają silniejsze i bardziej regularne, turbina pracuje także nocą, gdy PV nie działa.
**C:** *"Turbina 1 kW przy średniej prędkości wiatru 6 m/s dostarczy 3 kWh/dobę. To pokryje 25% Twojego deficytu styczniowego."*
🟡 *"Łopaty turbiny mogą oblodzić się przy −10°C i wysokiej wilgotności — sprawdź system ogrzewania łopat, jeśli dotyczy."*
**D:** *"Zimą słońca mało, ale wiatr wieje — turbina to dodatkowe źródło, które pracuje właśnie wtedy, gdy panele śpią."*

---

## EKRAN 17: Wind Chill — wpływ wiatru na zapotrzebowanie na ciepło
*(dawne 6.26 — Wzorzec D)*

**A:** prędkość i kierunek wiatru (Moduł 1), model termiczny budynku (Moduł 6), temperatura zewnętrzna.
**B:** temperatura odczuwalna (wind chill) rośnie ze spadkiem temperatury i wzrostem prędkości wiatru; dodatkowe straty przez nieszczelności przy silnych podmuchach.
**C:** *"Przy −10°C i wietrze 40 km/h temperatura odczuwalna to −20°C. Straty ciepła wzrosną o 35%. System będzie potrzebował dodatkowo 2 kWh/dobę."*
**D:** *"Wiatr wywiewa ciepło z domu nawet wtedy, gdy termometr nie pokazuje wcale tak niskiej temperatury — liczy się nie tylko stopień, ale i to, jak mocno wieje."*

---

## EKRAN 18: Pre-Heat Thermal Storage — magazynowanie ciepła przed frontem
*(dawne 6.28 — Wzorzec D)*

**A:** prognoza pogody (nadchodzący front, Moduł 1), pojemność cieplna budynku (Moduł 6, Ekran 8), pojemność bojlera CWU, dostępna energia z PV/baterii.
**B:** wykrycie nadchodzącego spadku temperatury → rekomendacja przegrzania budynku i bojlera w dzień poprzedzający (gdy jest słońce), żeby zgromadzić bufor cieplny przed frontem.
**C:** *"Jutro w dzień podnieś temperaturę w domu do 23°C i zagrzej bojler do 70°C. Zużyjesz 8 kWh, ale zyskasz 12 godzin buforu cieplnego."*
🔴 *"Nie wykonuj grzania w nocy z baterii — to zrujnuje magazyn energii."*
**D:** *"To jak naładowanie powerbanku przed wyjazdem — ładuj ciepło, zanim przyjdzie mróz, a nie w trakcie, kiedy będzie już za późno i za drogo."*

---

## EKRAN 19: Wpływ niskich temperatur na elektronikę
*(dawne 6.29 — Wzorzec D)*

**A:** lista urządzeń elektronicznych i ich minimalne temperatury pracy (baza komponentów), lokalizacja montażu, dane klimatyczne.
**B:** sprawdzenie, które urządzenia przestają działać poprawnie przy skrajnym mrozie: wyświetlacze LCD zwalniają/gasną, BMS może nie wystartować, czujniki dają błędne odczyty, przetwornice tracą sprawność.
**C:** *"Twój BMS ma minimalną temperaturę pracy −10°C. W garażu przy −20°C może nie wystartować. Przenieś go do piwnicy."*
🔴 krytyczna elektronika (BMS) w lokalizacji poniżej jej minimalnej temperatury pracy.
**D:** *"Elektronika też marznie — jak jest za zimno, przestaje 'myśleć' poprawnie, nawet jeśli fizycznie się nie psuje."*

---

## EKRAN 20: Symulacja "bez wentylacji" (Frozen Recuperation)
*(dawne 6.30 — Wzorzec D)*

**A:** parametry wentylacji mechanicznej (Moduł 6), dane klimatyczne, wilgotność wewnętrzna.
**B:** symulacja skutków zamarznięcia/wyłączenia rekuperacji: wzrost wilgotności wewnętrznej, ryzyko pleśni, spadek jakości powietrza, wzrost zapotrzebowania na ogrzewanie (wentylacja bez odzysku traci ciepło).
**C:** *"Rekuperacja zamarznie przy −15°C i wysokiej wilgotności. Produkcja ciepła spadnie o 30%, a wilgotność wzrośnie do 70%. Zastosuj grzałkę wstępną 200W lub wymiennik z bypassem."*
**D:** *"Wentylacja to płuca domu — jak zamarzną, dom zaczyna się 'dusić' i pleśnieć, nawet jeśli na zewnątrz jest sucho i mroźno."*

---

## EKRAN 21: Wydajność pomp i zaworów w niskich temperaturach
*(dawne 6.32 — Wzorzec D)*

**A:** lista pomp/zaworów w systemie (pompa ciepła, obiegowa, głębinowa, siłowniki), ich minimalne temperatury pracy, lokalizacja.
**B:** ryzyka: gęstnienie oleju w pompach, sztywnienie uszczelek, zamarzanie zaworów zewnętrznych, spadek ciśnienia.
**C:** *"Pompa cyrkulacyjna w garażu może zablokować się przy −15°C. Zastosuj pompę z uszczelnieniem mrozoodpornym."*
🟡 *"Zawór zewnętrzny do wody ogrodowej musi być opróżniony przed zimą."*
**D:** *"Pompy i zawory w mrozie stają się leniwe — trzeba je przygotować, żeby nie zablokowały całego systemu w najgorszym momencie."*

---

## EKRAN 22: Ryzyko zamarznięcia — instalacje wodne i grunt
*(scala dawne: 6.15, 6.27, 6.31, 6.35, 6.37 — Wzorzec A z elementami D, przełącznik typu obiektu)*

Pięć dawnych funkcji to ten sam problem (zamarznięcie) rozpatrywany dla różnych obiektów — jeden ekran z wyborem typu, plus wspólna sekcja rozmrażania.

### Tryb "Rury wewnętrzne / instalacja wodna" (dawne 6.15)
A: lokalizacja rur (model budynku), izolacja, temperatura wewnętrzna/zewnętrzna, prognoza.
B: dla każdego odcinka — czas do 0°C, ryzyko pęknięcia.
C: *"Rura zasilająca w strychu zamarznie po 6 godzinach przy −20°C. Zastosuj kabel grzewczy 10 W/m lub izolację 50 mm."*

### Tryb "Rury zewnętrzne / strych" (dawne 6.27)
A: lokalizacja rur zewnętrznych/w strychu, ich izolacja.
C: *"Rura w strychu zamarznie po 4 godzinach przy −15°C — szybciej niż w innych miejscach, bo strych wychładza się najszybciej. Zastosuj kabel grzewczy 15 W/m."*
🟡 *"Rura zewnętrzna do ogrodu musi być opróżniona przed zimą."*

### Tryb "Szambo / oczyszczalnia" (dawne 6.31)
A: głębokość posadowienia, izolacja zbiornika, przepływ ścieków.
C: *"Twoje szambo jest płycej niż 1m i nieizolowane. Przy −20°C zamarznie po 5 dniach. Zastosuj izolację lub podgrzewanie."*
🟡 *"Przy ciągłym przepływie ścieków ryzyko zamarznięcia jest mniejsze — ciepło z odpływu pomaga."*

### Tryb "Grunt / instalacje zewnętrzne" (dawne 6.35)
A: strefa przemarzania gruntu (Moduł 1), głębokość ułożenia kabli/rur/uziomów.
C: *"Twój kabel ziemny jest na głębokości 40 cm, a strefa przemarzania to 80 cm. Zamarzający, pęczniejący grunt może go uszkodzić."*
🔴 instalacja ułożona płycej niż strefa przemarzania.

### Sekcja wspólna — Rozmrażanie kablem grzewczym (dawne 6.37)
Po wykryciu zamarznięcia: `energia_potrzebna = f(ciepło_właściwe_lodu, straty_do_otoczenia, moc_kabla)`. *"Rura 20mm zamarznięta na długości 2m. Kabel 20 W/m rozmrozi ją w 3 godziny, zużywając 0,12 kWh."*
🔴 zbyt szybkie rozmrażanie (np. otwartym ogniem) — ryzyko pęknięcia rury i pożaru.

### Migawka wspólna
*"Zamarznięta rura, zbiornik czy uziom to ten sam mechanizm fizyczny — woda zamarzając zwiększa objętość i albo pęka naczynie, albo wypycha to, co jest wokół. Różni się tylko miejsce i konsekwencje."*

---

## EKRAN 23: Obciążenie dachu lodem i śniegiem
*(dawne 6.34 — Wzorzec D)*

**A:** model dachu — kąt, powierzchnia, konstrukcja (Moduł 1), dane o opadach, normy budowlane obciążenia.
**B:** obliczenie ciężaru zalegającego śniegu/lodu, porównanie z dopuszczalnym obciążeniem konstrukcji.
**C:** *"Na dachu płaskim zalega 120 kg/m² śniegu. Dopuszczalne obciążenie to 150 kg/m². Zbliżasz się do granicy! Zalecane odśnieżenie przy warstwie >50 cm."*
🔴 obciążenie zbliżające się lub przekraczające dopuszczalną nośność konstrukcji.
**D:** *"Śnieg jest cięższy, niż się wydaje — dach, który wygląda solidnie, może nie wytrzymać kilku dużych opadów z rzędu bez odśnieżenia."*

---

## EKRAN 24: Falownik przy odkształconych obciążeniach zimą (THD)
*(dawne 6.38 — Wzorzec D)*

**A:** lista odbiorników generujących harmoniczne (pompa ciepła, silniki), parametry falownika (THD, obciążalność).
**B:** odkształcone obciążenia (wysoki THD) dodatkowo grzeją falownik i zmniejszają realnie dostępną moc czynną.
**C:** *"Twoja pompa ciepła generuje THD 25%. Falownik 5 kW może realnie oddać tylko 4,1 kW. Zwiększ zapas mocy lub zastosuj filtr harmonicznych."*
**D:** *"Odkształcony prąd to jak brudne paliwo — silnik dalej chodzi, ale tracisz moc i niepotrzebnie grzejesz sprzęt."*

---

## EKRAN 25: Deep Winter Energy Budget
*(dawne 6.39 — Wzorzec D)*

**A:** zapotrzebowanie sezonowe (Moduły 2, 6), produkcja PV i wiatru (Ekran 16), pojemność baterii i agregatu, prognozy.
**B:** budżet energetyczny na cały sezon, rozbity na miesiące/tygodnie/dni, z przydziałem na cele (ogrzewanie, CWU, pompy, oświetlenie); bieżące monitorowanie zużycia vs plan.
**C:** *"Na styczeń zaplanowano 300 kWh z PV, 150 kWh z agregatu, 250 kWh z baterii. Do 20 stycznia zużyłeś 280 kWh — zostało Ci 170 kWh."*
🟡 *"Zużycie przekracza budżet o 12%. Ogranicz ogrzewanie o 1°C."*
**D:** *"Energia zimą jest jak pensja — trzeba nią zarządzać, żeby starczyło do 'pierwszego', czyli do wiosny."*

---

## EKRAN 26: Awaria jednego stringa PV w zimie
*(dawne 6.40 — Wzorzec D)*

**A:** konfiguracja stringów (Moduł 3), scenariusze awarii (śnieg, zwarcie, uszkodzona złączka).
**B:** symulacja awarii jednego stringa w najgorszym miesiącu — wpływ na bilans, ryzyko kaskadowej awarii (przeciążenie pozostałych stringów).
**C:** *"Awaria stringu 2 w styczniu oznacza deficyt 8 kWh/dobę. System nie przetrwa bez agregatu."*
**D:** *"Zimą każda kWh jest na wagę złota — jeden chory string, który latem byłby drobnym problemem, w styczniu może oznaczać, że dom nie przetrwa nocy bez agregatu."*
Cross-ref: monitoring napięć stringów jako wczesne ostrzeżenie (widżet Modułu 13).

---

## Funkcje przeniesione z tego modułu (nie mają tu ekranu)

- **6.8 (Zimowa wydajność pompy ciepła i defrost)** → wchłonięte do Modułu 6, Ekran 6 (trzeci wariant tego samego tematu razem z 1.14).
- **6.11 (Bezwładność cieplna budynku)** → wchłonięte do Modułu 6, Ekran 8.
- **6.13 (Test mroźnego startu baterii)** → wchłonięte do Modułu 4, Ekran 15 (Cold Cranking Amps).
- **6.19, 6.25 (awaryjne źródło ciepła, bezpieczeństwo spalania)** → Moduł 8 (Bezpieczeństwo).
- **6.33 (Live Winter Survival Mode)** → widżet/preset biblioteki Trybu Live (Moduł 13).

---

## Podsumowanie modułu

**26 ekranów**, pokrywających 38 z 40 pierwotnych funkcji tego rozdziału (2 już wcześniej przeniesione do Modułu 8 na etapie architektury). 4 merge'e lokalne (agregat w mrozie 3→1, ryzyko zamarznięcia 5→1, śnieg na PV 2→1, albedo/bifacjalne 2→1), 3 dodatkowe przeniesienia znalezione podczas pisania treści (defrost, bezwładność, mroźny start baterii — potwierdzające duplikaty międzyrozdziałowe zidentyfikowane wcześniej w Zasadach UX §20).

**Twarde stopy zidentyfikowane w tym module:** podłączenie agregatu bezpośrednio do baterii bez ładowarki (Ekran 5), krytyczna elektronika (BMS) w lokalizacji poniżej jej minimalnej temperatury pracy (Ekran 19), instalacja ułożona płycej niż strefa przemarzania gruntu (Ekran 22), obciążenie dachu zbliżające się do granicy nośności konstrukcji (Ekran 23), zbyt szybkie rozmrażanie rury grożące pęknięciem (Ekran 22).

---

**Wersja:** 1.0 — pełna treść Modułu 7 (Etap 3)
**Data:** Sierpień 2026
**Status:** Wszystkie 26 ekranów gotowe do przekazania deweloperowi.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, Tresc_Modul_5_Okablowanie_Ekrany.md, Tresc_Modul_3_PV_Ekrany.md, Tresc_Modul_4_Baterie_Ekrany.md, Tresc_Modul_6_Ogrzewanie_Ekrany.md
