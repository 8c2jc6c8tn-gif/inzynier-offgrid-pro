/**
 * Słownik tłumaczeń — docs/standards/17-i18n.md, 17.1-17.2. Język bazowy treści: polski.
 * Klucze zawsze po angielsku/wielkimi literami z myślnikiem (ta sama konwencja co `Warning.code`
 * dotąd) — to kod, nie treść dla użytkownika (0.7/15.15).
 *
 * Placeholdery `{nazwa}` w wartościach są podstawiane przez `t()` z `params`. Jeden słownik na
 * razie (tylko polski) — gdy pojawi się drugi język, każdy klucz musi mieć odpowiednik w obu
 * słownikach, wymuszane typem (17.1: brakujący klucz = błąd kompilacji, nie cichy fallback).
 *
 * Migracja stopniowa (17.9) — dziś tylko klucze zmigrowanych modułów (patrz docs/memory.md,
 * "Pierwsza implementacja i18n — pilotaż"). Większość modułów nadal zwraca gotowy tekst PL
 * bezpośrednio w `Warning.message`/`assumptions` (pole `string`) — to nie jest błąd, to
 * świadomy, tymczasowy stan przejściowy, nie wolno tu dopisywać kluczy "na przyszłość" bez
 * faktycznej migracji modułu, który ich używa (martwe klucze == dług, nie postęp).
 */
export const dictionaryPl = {
  "WARTOSC-NIEDODATNIA": 'Wartość pola "{label}" musi być większa od zera.',
  "SPRAWNOSC-POZA-ZAKRESEM": "Sprawność musi być liczbą z przedziału (0, 1].",
  "SPRAWNOSC-NISKA": "Podana sprawność jest nietypowo niska — sprawdź, czy nie pomyliłeś jednostek.",
  "MOC-NIETYPOWO-WYSOKA": "To nietypowo wysoka wartość mocy — sprawdź, czy nie pomyliłeś jednostek.",
  "SPRAWNOSC-DOMYSLNA": "Sprawność układu przyjęta jako {efficiency} (wartość domyślna, nie zmierzona).",
  "WARTOSC-POZA-ZAKRESEM": 'Wartość pola "{label}" musi być z przedziału {min}–{max}.',
  "POZYCJA-NIEDODATNIA": 'Zaznaczona pozycja "{label}" musi mieć moc większą od zera.',
  "BRAK-ZAZNACZONYCH": "Nie zaznaczono żadnego odbiornika krytycznego.",
  "POZYCJA-WARTOSC-DOMYSLNA": '"{label}" przyjęte z domyślną mocą {value} W (nie edytowane).',
  "COP-POZA-ZAKRESEM": "COP musi być z przedziału {min}–{max} dla typowej pompy ciepła.",
  "MOC-CIEPLNA-NIETYPOWO-WYSOKA":
    "To nietypowo wysoka wartość mocy cieplnej — sprawdź, czy nie pomyliłeś jednostek (kW, nie W).",
  "COP-ZALEZY-OD-TEMPERATURY":
    "COP zależy od temperatury zewnętrznej — podana wartość dotyczy tylko aktualnych warunków, nie jest " +
    "stała przez cały sezon (patrz krzywa COP producenta).",
  "DANE-KLIMATYCZNE-TRYB-OFFLINE":
    "Dane nasłonecznienia/strefy klimatycznej wymagają docelowo integracji z PVGIS/PVWatts (online) — " +
    "w tym kroku dostępny jest tylko tryb offline z ręcznym wpisaniem temperatury minimalnej.",
  "LICZBA-DOMOWNIKOW-POZA-ZAKRESEM": "Liczba domowników musi być z zakresu {min}–{max}.",
  "CWU-ZAKRES-ORIENTACYJNY":
    "Zakres {min}–{max} l C.W.U. na osobę na dobę — wartość orientacyjna ze źródła, nie zmierzona.",
  "ZAPOTRZEBOWANIE-UJEMNE": "Zapotrzebowanie dobowe nie może być ujemne.",
  "SPRAWNOSC-PROCENT-POZA-ZAKRESEM": "Sprawność falownika musi być z przedziału 0–100%.",
  "DOD-POZA-ZAKRESEM": "DoD (głębokość rozładowania) musi być z przedziału 0–100%.",
  "WPLYW-NA-MAGAZYN":
    "Przy {dni} dniach autonomii i wpisanych parametrach magazyn potrzebuje ok. {pojemnosc} kWh " +
    "pojemności użytecznej (szacunek — pełne wyliczenie: Moduł 4, Ekran 1).",
  "COS-FI-POZA-ZAKRESEM": "Współczynnik mocy (cos φ) musi być z przedziału 0–1.",
  "MOC-POZORNA-INFO":
    "Waty na tabliczce znamionowej to nie cała historia — to {va} VA, nie {w} W, realnie obciąża falownik.",
  "SZACUNEK-MAGAZYNU-WYMAGA-DANYCH":
    "Szacunek wpływu na wielkość magazynu wymaga wpisania zapotrzebowania dobowego, sprawności falownika i DoD.",
  "TEMPERATURA-POWYZEJ-ZAKRESU":
    "Temperatura ogniw ({temp}°C) przekracza dopuszczalne {max}°C — ryzyko trwale przyspieszonej " +
    "degradacji. Bateria to nie piec — wysoka temperatura nie tylko chwilowo obniża wydajność, ale " +
    "trwale przyspiesza starzenie ogniw.",
  "TEMPERATURA-PONIZEJ-ZAKRESU":
    "Temperatura ogniw ({temp}°C) jest poniżej dopuszczalnego zakresu pracy ({min}°C) — to nie jest " +
    "ryzyko przegrzania (temat tego ekranu), sprawdź ograniczenie prądu ładowania w mrozie na " +
    "osobnych ekranach (Cold C-Rate, Cold Cranking Amps).",
  "TEMPERATURA-W-ZAKRESIE": "Temperatura ogniw ({temp}°C) mieści się w dopuszczalnym zakresie pracy {min}–{max}°C.",
  "BLOKADA-LADOWANIA-MROZ":
    "Temperatura ogniwa {temp}°C — poniżej -10°C ładowanie jest całkowicie zablokowane. Ładowanie w " +
    "tych warunkach trwale uszkadza ogniwa (osadzanie litu metalicznego).",
  "LIMIT-PRADU-ZIMNO": "Temperatura ogniwa {temp}°C — maksymalny prąd ładowania ograniczony do 0,1C ({maxPrad} A).",
  "LIMIT-PRADU-CHLODNO": "Temperatura ogniwa {temp}°C — maksymalny prąd ładowania ograniczony do 0,2C ({maxPrad} A).",
  "LUKA-TABELI-ZRODLA":
    "Temperatura ogniwa {temp}°C — źródło nie podaje limitu C-rate dla zakresu 5–10°C (luka w tabeli " +
    "oryginalnej). Sprawdź specyfikację producenta ogniw dla tego zakresu — nie zgadujemy wartości pośredniej.",
  "POJEMNOSC-NIEDODATNIA": "Pojemność pakietu musi być większa od zera.",
  "FALOWNIK-SIE-WYLACZY":
    "Napięcie pod obciążeniem rozruchowym spadnie do {vSag} V — poniżej minimalnego napięcia pracy " +
    "falownika ({minNap} V). Falownik się wyłączy.",
  "FALOWNIK-UTRZYMA-NAPIECIE":
    "Napięcie pod obciążeniem rozruchowym spadnie do {vSag} V — powyżej minimalnego napięcia pracy falownika ({minNap} V).",
  "WARTOSC-UJEMNA": "{label} nie może być ujemna.",
  "REZYSTANCJA-ZMIERZONA-W-TEMPERATURZE":
    "Rezystancja wewnętrzna podana przez użytkownika jest już zmierzona w bieżącej temperaturze ogniw.",
  "BRAK-ZABEZPIECZENIA-DOZIEMIENIA":
    "Brak monitora izolacji (IMD) i różnicówki DC — przebicie w panelu spowoduje pojawienie się " +
    "niebezpiecznego potencjału na ramie bez wykrycia. Prąd stały trzyma ofiarę porażenia mocniej " +
    "niż zmienny — zainstaluj IMD lub różnicówkę DC.",
  "ZABEZPIECZENIE-OBECNE": "Zabezpieczenie przed doziemieniem jest obecne (IMD lub różnicówka DC).",
  "WYMAGANY-E-FUSE":
    "Prąd zwarciowy pakietu ({pradA} A) przekracza zdolność łączeniową tranzystorów BMS ({zdolnoscA} A) — " +
    "zwykły bezpiecznik (~10ms) jest za wolny, BMS musi mieć funkcję e-Fuse (wyłączenie natychmiastowe, <100µs).",
  "E-FUSE-NIEPOTRZEBNY":
    "Prąd zwarciowy pakietu ({pradA} A) mieści się w zdolności łączeniowej tranzystorów BMS ({zdolnoscA} A).",
  "MODEL-ZWARCIA-PROSTEGO":
    "Model prostego zwarcia pełnego (rezystancja przewodów i połączeń pominięta) — ten sam model co " +
    "Ekran 24 (Dobór bezpiecznika DC).",
  "BRAK-LIMITU-PRADU-POWYZEJ-10C": "Powyżej 10°C źródło nie ogranicza prądu od strony temperatury ogniw.",
  "AIC-PONIZEJ-PRADU-ZWARCIOWEGO":
    "Zdolność wyłączania (AIC) tego bezpiecznika jest niższa niż prąd zwarciowy pakietu — bezpiecznik " +
    "rozerwie się, tworząc łuk plazmowy, zamiast bezpiecznie przerwać obwód.",
  "AIC-PONIZEJ-ZALECANEGO-MINIMUM":
    "Dla systemów LiFePO4 zalecane jest AIC min. {min} A — ten bezpiecznik jest poniżej tej wartości, " +
    "mimo że wytrzyma obliczony prąd zwarciowy tego pakietu.",
  "MODEL-ZWARCIA-PROSTEGO-NIZSZY":
    "Model prostego zwarcia pełnego (rezystancja przewodów i połączeń pominięta) — rzeczywisty prąd " +
    "zwarciowy w instalacji może być nieco niższy.",
  "ZAPOTRZEBOWANIE-NIEDODATNIE": "Zapotrzebowanie dobowe musi być większe od zera.",
  "DNI-AUTONOMII-NIEDODATNIE": "Dni autonomii muszą być większe od zera.",
  "SPRAWNOSC-PROCENT-DODATNIA-POZA-ZAKRESEM": "Sprawność falownika musi być z przedziału 0–100% (>0).",
  "DOD-DODATNI-POZA-ZAKRESEM": "DoD (głębokość rozładowania) musi być z przedziału 0–100% (>0).",
  "BUFOR-STARZENIOWY-NIE-DOLICZONY": "Bez bufora starzeniowego (Ekran 5, Moduł 4) — ten ekran jeszcze nie istnieje w kodzie.",
  "SOC-POZA-ZAKRESEM": "SoC musi być z przedziału 0–100%.",
  "BRAK-POTRZEBY-GRZANIA":
    "Temperatura ({temp}°C) jest na tyle wysoka, że BMS nie włącza grzałek przed ładowaniem (próg: {prog}°C).",
  "GRZANIE-Z-PV": "Jest produkcja PV — grzałki BMS zasilane bezpośrednio z paneli, zero obciążenia baterii.",
  "GRZANIE-Z-BATERII":
    "Brak produkcji PV, ale SoC ({soc}%) jest powyżej {prog}% — grzanie z baterii, tylko do osiągnięcia " +
    "minimalnej temperatury ładowania.",
  "GRZANIE-WSTRZYMANE":
    "Brak produkcji PV i SoC ({soc}%) poniżej {prog}% — grzanie wstrzymane, tryb uśpienia. BMS " +
    "zablokuje ładowanie przy tej temperaturze, dopóki nie pojawi się PV lub SoC nie wzrośnie.",
  "REKOMENDOWANA-KALIBRACJA-SOC":
    "{dni} dni bez pełnego naładowania (próg: {prog}) — zrób pełne ładowanie, żeby BMS złapał punkty " +
    "odniesienia. Liczenie prądu w BMS to ciągły szacunek, błąd kumuluje się bez okresowego resetu.",
  "KALIBRACJA-NIEPOTRZEBNA":
    "{dni} dni od ostatniego pełnego naładowania — poniżej progu {prog} dni, kalibracja jeszcze niepotrzebna.",
  "DNI-UJEMNE": "Liczba dni od ostatniego pełnego naładowania nie może być ujemna.",
  "WARTOSC-POLA-UJEMNA": 'Wartość pola "{label}" nie może być ujemna.',
  "FAZA-CC": "Napięcie jeszcze nie osiągnęło progu absorpcji ({prog} V) — trwa faza CC (stały prąd).",
  "FAZA-CV-KONCOWKA":
    "Napięcie absorpcji osiągnięte, ale prąd ({aktualny} A) wciąż jest powyżej progu końcowego " +
    "({prog} A) — nie odłączaj ładowania, trwa faza CV (stałe napięcie).",
  "LADOWANIE-ZAKONCZONE": "Prąd spadł poniżej progu końcowego ({prog} A) — bateria w pełni naładowana.",
  "TEMPERATURA-FIZYCZNIE-NIEMOZLIWA": "Podana temperatura jest fizycznie niemożliwa.",
  "PROG-KONCOWY-POZA-ZAKRESEM": "Próg prądu końcowego (jako ułamek C) musi być z przedziału 0–1.",
  "SOC-POZA-ZALECANYM-ZAKRESEM":
    "Docelowy SoC ({soc}%) jest poza zalecanym zakresem {min}–{max}%. Bateria nie lubi być ani " +
    "przesuszona (0% SoC), ani przelana (100% SoC) przez długi czas bezczynności.",
  "TEMPERATURA-PONIZEJ-MINIMUM-BEZPIECZNEGO":
    "Spodziewana temperatura ({temp}°C) jest poniżej bezpiecznego minimum {min}°C — zabezpiecz " +
    "przed mrozem lub zmień miejsce przechowywania.",
  "SOC-DOCELOWY-POZA-ZAKRESEM": "Docelowy SoC musi być z przedziału 0–100%.",
  "ROZNICA-NAPIEC-ZA-DUZA":
    "Różnica napięć między bateriami ({roznica} V) przekracza {prog} V — ryzyko iskrzenia w chwili połączenia.",
  "INNA-CHEMIA-BEZ-IZOLACJI":
    "Baterie mają różną chemię ogniw — mieszanie różnych chemii bez izolacji galwanicznej między nimi jest niebezpieczne.",
  "PRAD-WYROWNAWCZY-CHWILA-POLACZENIA":
    "Prąd wyrównawczy liczony w chwili połączenia (napięcia spoczynkowe) — nie uwzględnia dalszej " +
    "dynamiki ładowania/rozładowania pod obciążeniem.",
  "WARTOSC-NIE-MOZE-BYC-UJEMNA": "Wartość nie może być ujemna.",
  "POKRYTE-W-CALOSCI-LATO": "Latem: nadwyżka PV w pełni pokrywa ładowanie EV.",
  "POKRYTE-W-CALOSCI-ZIMA": "Zimą: nadwyżka PV w pełni pokrywa ładowanie EV.",
  "BRAKUJE-ENERGII-LATO":
    "Latem: brakuje {brak} kWh/dobę — trzeba sięgnąć po baterię domową, agregat, sieć lub zwiększyć PV.",
  "BRAKUJE-ENERGII-ZIMA":
    "Zimą: brakuje {brak} kWh/dobę — trzeba sięgnąć po baterię domową, agregat, sieć lub zwiększyć PV.",
  "POJEMNOSC-FALOWNIKA-NIEDODATNIA": "Pojemność wejściowa DC falownika musi być większa od zera.",
  "REZYSTANCJA-PRECHARGE-NIEDODATNIA": "Rezystor wstępny (pre-charge) musi być większy od zera.",
  "POBOR-UJEMNY": "{label} nie może być ujemny.",
  "WILGOTNOSC-POZA-ZAKRESEM": "Wilgotność względna musi być z przedziału 0–100%.",
  "RYZYKO-KONDENSACJI":
    "Temperatura obudowy ({temp}°C) jest poniżej punktu rosy ({rosa}°C) — wysokie ryzyko wykroplenia " +
    "wody w środku. Mokry BMS i miedziane szyny to gotowy przepis na zwarcie.",
  "BEZPIECZNY-MARGINES":
    "Temperatura obudowy ({temp}°C) jest powyżej punktu rosy ({rosa}°C) — brak ryzyka kondensacji przy tych warunkach.",
  "IP-PONIZEJ-WYMAGANEGO":
    "Obudowa IP{ip} jest poniżej wymaganego minimum IP{min} dla środowiska narażonego na wilgoć.",
  "PUNKT-ROSY-WZOR-MAGNUSA":
    "Punkt rosy liczony standardowym wzorem Magnusa-Tetensa (stałe dla wody ciekłej), nie podanym " +
    "wprost w źródle — zweryfikowany niezależnie względem przykładu źródła (-5°C/85% → -7°C).",
  "SPRAWNOSC-OGOLNA-POZA-ZAKRESEM": "Sprawność musi być z przedziału 0–100%.",
  "TANSZE-NIZ-ALTERNATYWA":
    "Koszt energii z magazynu ({koszt} zł/kWh) jest niższy niż koszt alternatywy ({alt} zł/kWh) — magazyn się opłaca.",
  "DROZSZE-NIZ-ALTERNATYWA":
    "Koszt energii z magazynu ({koszt} zł/kWh) jest wyższy niż koszt alternatywy ({alt} zł/kWh) — " +
    "przy tych parametrach magazyn się nie zwraca.",
  "LICZBA-CYKLI-SPRAWNOSC-OD-UZYTKOWNIKA":
    "Liczba cykli i sprawność wpisane przez użytkownika (np. z karty katalogowej lub Ekranu 30) — " +
    "nie liczone od nowa w tym ekranie.",
  "DOCISK-ZA-MALY":
    "Docisk ({docisk} kgf) jest poniżej zalecanego zakresu {min}-{max} kgf — ryzyko utraty kontaktu " +
    "wewnętrznego i przyspieszonej degradacji.",
  "DOCISK-ZA-DUZY":
    "Docisk ({docisk} kgf) jest powyżej zalecanego zakresu {min}-{max} kgf — ryzyko uszkodzenia mechanicznego ogniw.",
  "BRAK-LUZU-NA-PECZNIENIE":
    "Ogniwa rosną o 1-2% podczas ładowania — bez marginesu luzu docisk stały wzrośnie ponad zalecany zakres.",
  "DOCISK-OK":
    "Docisk ({docisk} kgf) mieści się w zalecanym zakresie {min}-{max} kgf, z zostawionym luzem na dylatację.",
  "DOCISK-UJEMNY": "Docisk nie może być ujemny.",
  "TANSZA-NIZ-NOWA":
    "Koszt 1 kWh użytecznej z tej baterii ({koszt} zł/kWh) jest niższy niż nowej LiFePO4 ({nowa} zł/kWh) " +
    "— ale nowa ma 100% SoH i dłuższą żywotność.",
  "DROZSZA-NIZ-NOWA":
    "Koszt 1 kWh użytecznej z tej baterii ({koszt} zł/kWh) jest wyższy niż nowej LiFePO4 ({nowa} zł/kWh) " +
    "— przy tej cenie zakupu nowa bateria się bardziej opłaca.",
  "SOH-ZEROWY":
    "Szacowany SoH spadł do 0% przy tym modelu degradacji — bateria praktycznie bezużyteczna, nie kupuj.",
  "SOH-SZACUNEK-Z-WIEKU": "SoH szacowany liniowo z wieku, dolna granica zakresu źródła ({rate}%/rok z zakresu 2-3%/rok).",
  "SOH-SZACUNEK-Z-PRZEBIEGU": "SoH szacowany liniowo z przebiegu ({rate}%/10 000 km wg źródła).",
  "TOLERANCJA-POZA-ZAKRESEM": "Tolerancja fabryczna musi być z przedziału 0–100%.",
  "POJEMNOSC-OGRANICZONA-NAJSLABSZYM":
    "To jak pociągnięcie za hamulec w całym pociągu, bo jeden wagon się zepsuł — najsłabsze ogniwo " +
    "ogranicza cały pakiet o {utrata}%.",
  "NAJGORSZY-PRZYPADEK-TOLERANCJA":
    "Najgorszy przypadek: przynajmniej jedno ogniwo w paśmie tolerancji fabrycznej ma pojemność " +
    "dokładnie na dolnej granicy tolerancji.",
  "OGNIWO-DO-WYMIANY":
    "Rezystancja wewnętrzna wzrosła o {wzrost}% względem wartości fabrycznej (próg krytyczny: " +
    "{prog}%) — to ogniwo straciło znaczącą część pojemności, wymień je.",
  "OGNIWO-OK":
    "Rezystancja wewnętrzna wzrosła o {wzrost}% względem wartości fabrycznej — poniżej progu krytycznego ({prog}%).",
  "POJEMNOSC-DZIS-NIEDODATNIA": "Pojemność użyteczna potrzebna dziś musi być większa od zera.",
  "DEGRADACJA-POZA-ZAKRESEM": "Roczny spadek pojemności musi być z przedziału 0–100% (>0).",
  "CALKOWITA-DEGRADACJA-W-HORYZONCIE":
    "Przy {rate}%/rok przez {lata} lat prosty model liniowy degradacji sięga zera lub poniżej — " +
    "wynik nie ma sensu fizycznego. Sprawdź wpisane wartości.",
  "MODEL-LINIOWY-DEGRADACJI": "Prosty model liniowy degradacji (nie kalendarzowo-cykliczny), zgodnie z Sekcją B źródła.",
  "WYNIK-DOKLADNY-BEZ-ZAOKRAGLENIA":
    "Wynik to dokładna wymagana pojemność początkowa — w praktyce zaokrągla się w górę do " +
    "dostępnego rozmiaru komercyjnego (źródło nie podaje siatki rozmiarów).",
  "ROZKLAD-PRADU":
    "Największa gałąź odbiega od równego podziału o {odchylenie} pkt proc. Źródło nie podaje progu " +
    "\"bezpiecznego\" odchylenia — jeśli rozpływ wygląda nierówno, rozważ szynę zbiorczą (gwiazda) " +
    "z kablami o równej długości zamiast łączenia kaskadowego.",
  "MODEL-TOPOLOGIA-GWIAZDA":
    "Model zakłada topologię gwiazda (każda gałąź niezależnym odcinkiem do wspólnego węzła) — NIE " +
    "modeluje kaskady ani asymetrii punktu zasilania wzdłuż jednej szyny.",
  "REZYSTANCJA-WZOR-M5E1": "Rezystancja gałęzi liczona jak w M5/Ekran 1: R=ρ×2L/A (droga tam i z powrotem).",
  "COMMON-PORT-NIEWYSTARCZAJACY":
    "Common Port BMS ({bms} A) jest poniżej szczytowego prądu rozruchu falownika ({falownik} A) — " +
    "wybierz wersję Separate Port.",
  "COMMON-PORT-WYSTARCZAJACY": "Common Port BMS ({bms} A) wytrzymuje szczytowy prąd rozruchu falownika ({falownik} A).",
  "SPRAWNOSC-EFEKTYWNA-POZA-ZAKRESEM": "Sprawność efektywna musi być z przedziału 0–100%.",
  "REZERWA-WIEKSZA-NIZ-POJEMNOSC": "Rezerwa na dojazd nie może być większa niż cała pojemność baterii.",
  "TYLKO-V2L":
    "Auto/falownik wspierają tylko V2L (niższa moc, przykładowo do ok. 3,6 kW) — nie zasilisz nim " +
    "całego domu, tylko pojedyncze urządzenia.",
  "REZERWA-DEGRADACJA-MODEL-UPROSZCZONY":
    "„Rezerwa na dojazd, degradacja, straty” ze źródła modelowane jako rezerwa (wprost odejmowana) " +
    "+ jeden łączny współczynnik sprawności efektywnej — źródło nie rozbija tego na osobne wzory.",
  "AIC-PONIZEJ-MAX-PRADU-ZWARCIOWEGO":
    "Zdolność wyłączania zabezpieczenia ({aic} A) jest poniżej obliczonego maksymalnego prądu " +
    "zwarciowego ({pradZwarciowy} A) — zabezpieczenie samo stanie się źródłem łuku elektrycznego.",
  "AIC-WYSTARCZAJACE-NA-PRAD-ZWARCIOWY": "Zdolność wyłączania {aic} A wystarcza na obliczony prąd zwarciowy.",
  "AIC-NIE-SPRAWDZONA-PORUWNAJ": "Zdolność łączeniowa (AIC) nie sprawdzona — wpisz ją, żeby porównać z prądem zwarciowym.",
  "AIC-BEZPIECZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO":
    "Zdolność łączeniowa bezpiecznika ({aic} A) jest niższa niż prąd zwarciowy w tym punkcie " +
    "({pradZwarciowy} A) — zbyt niska zdolność łączeniowa, ryzyko łuku elektrycznego zamiast " +
    "bezpiecznego przepalenia.",
  "PRAD-ZNAMIONOWY-NIEDODATNI": "Prąd znamionowy obwodu musi być większy od zera.",
  "PRAD-ZWARCIOWY-UJEMNY": "Prąd zwarciowy nie może być ujemny.",
  "AIC-UJEMNE": "Zdolność łączeniowa (AIC) nie może być ujemna.",
  "SELEKTYWNOSC-NIE-SPRAWDZONA":
    "Koordynacja selektywności z Ekranem 13 (Selektywność zabezpieczeń) nie sprawdzona — ten ekran " +
    "jeszcze nie istnieje.",
  "AIC-NIE-SPRAWDZONA-WOBEC-ZWARCIA":
    "Zdolność łączeniowa (AIC) nie sprawdzona wobec prądu zwarciowego — wpisz oba pola, docelowo " +
    "prąd zwarciowy z Ekranu 12 (Analiza zwarciowa).",
  "IZOLACJA-PONIZEJ-TEMPERATURY":
    "Izolacja {izolacja} wytrzymuje do {max}°C, a spodziewana temperatura to {temp}°C — pęknie i " +
    "puści wilgoć. Użyj izolacji o wyższej odporności termicznej.",
  "IZOLACJA-WYSTARCZA-NA-TEMPERATURE": "Izolacja {izolacja} (do {max}°C) wytrzyma spodziewaną temperaturę w tym miejscu.",
  "FALOWNIK-MOCY-ZA-SLABY":
    "Wybrany falownik ({wybrana} W) jest słabszy niż zalecana moc ({zalecana} W) — ryzyko częstych " +
    "wyłączeń przy rozruchach silników.",
  "FALOWNIK-MOCY-WYSTARCZAJACY":
    "Wybrany falownik ({wybrana} W) pokrywa zalecaną moc ({zalecana} W) z zapasem na rozruchy.",
  "REKOMENDACJA-MOCY-FALOWNIKA":
    "Zalecana moc ciągła falownika: {zalecana} W (z zapasem na rozruchy silników, 5 s, do 200% " +
    "przeciążalności).",
  "WSPOLCZYNNIK-JEDNOCZESNOSCI-MARGINES":
    "Współczynnik jednoczesności działa tu jako odwrotny margines na rozruchy (P_falownika = " +
    "P_szczytowa / w), nie jako redukcja sumy odbiorników.",
  "PRADY-ROZRUCHOWE-NIE-LICZONE-LICZBOWO":
    "Prądy rozruchowe silników NIE liczone liczbowo — źródło nie podaje wzoru/mnożnika, tylko " +
    "przykład ilustracyjny.",
  "WARTOSC-MUSI-BYC-WIEKSZA-OD-ZERA": "Wartość musi być większa od zera.",
  "PRZEKROJ-PONIZEJ-WYLICZONEGO-MINIMUM":
    "Wybrany przekrój {sprawdzany} mm² jest mniejszy niż wyliczone minimum ({wymagany} mm²) — " +
    "realne ryzyko przegrzania izolacji i pożaru. Użyj co najmniej {wymagany} mm².",
  "PRZEKROJ-MA-BEZPIECZNY-MARGINES":
    "Wybrany przekrój ma bezpieczny margines (≥15%) zarówno na obciążalność, jak i spadek napięcia.",
  "PRZEKROJ-MARGINES-MALY":
    "Wybrany przekrój spełnia oba kryteria, ale margines jest mały (poniżej 15%) — rozważ większy przekrój.",
  "BRAK-PRZEKROJU-SPELNIAJACEGO-KRYTERIA":
    "Żaden standardowy przekrój do {maksymalny} mm² nie spełnia obu kryteriów przy tych danych — " +
    "potrzebny większy przekrój, inne napięcie systemowe albo krótsza trasa. Skonsultuj projektanta.",
  "TEMPERATURA-OTOCZENIA-POZA-TABELAMI":
    "Temperatura otoczenia {temp}°C jest poza zakresem tabel normy dla izolacji PVC (10-60°C) — " +
    "nie da się bezpiecznie policzyć.",
  "WSPOLCZYNNIK-WIAZKI-POZA-ZAKRESEM":
    "Norma nie podaje współczynnika zmniejszającego dla wiązki tej wielkości ({liczba} kabli) przy " +
    "wybranym sposobie ułożenia.",
  "IZOLACJA-ZALOZONA-PVC-DOMYSLNIE":
    "Izolacja żył założona jako PVC (70°C) — dane wejściowe nie proszą o typ izolacji; PVC ma niższą " +
    "obciążalność niż XLPE/EPR, więc jest zachowawczym (bezpieczniejszym) wyborem domyślnym.",
  "LICZBA-ZYL-DWIE-TABLICA-B52":
    "Liczba żył obciążonych w obwodzie = 2 (obwód DC lub jednofazowy AC) — użyto Tablicy B.52.2 " +
    "normy PN-HD 60364-5-52.",
  "REZYSTANCJA-PETLI-WZOR-2L-S":
    "Rezystancja pętli liczona jako ρ×2×L/S (prąd wraca drugim przewodem) — tak jak w już " +
    "zweryfikowanym kalkulatorze M3/E8 (straty-okablowanie-dc); uproszczony wzór ze źródła tego " +
    "ekranu (bez ×2) zaniżałby spadek napięcia o połowę.",
  "KOREKTA-ULOZENIA-KOLUMNA-TABELI":
    "Korekta sposobu ułożenia zrealizowana przez wybór właściwej kolumny tabeli normy (metoda " +
    "referencyjna C/B2/D), nie przez osobny mnożnik k3 opisany w źródle produktowym — norma nie " +
    "definiuje takiego wspólnego współczynnika.",
  "GSW-UZYWANA-JAKO-PRZYLACZE":
    "GSW to tylko wyrównanie potencjałów, nie szyna prądowa — nie podłączaj do niej odbiorników.",
  "KOROZJA-GALWANICZNA-CU-AL":
    "Bezpośrednie połączenie miedź-aluminium bez bariery koroduje i grzeje się — użyj złączki " +
    "bimetalicznej i pasty antykorozyjnej.",
  "PARA-METALI-OK": "{etykieta} — połączenie bezpieczne w tych warunkach.",
  "WYMAGA-PODKLADKI-I-SMARU":
    "Stal ocynkowana + miedź bez podkładki i smaru — dodaj oba, żeby ograniczyć korozję.",
  "KONTROLUJ-OKRESOWO":
    "Stal nierdzewna + aluminium w środowisku słonym — kontroluj połączenie okresowo pod kątem korozji.",
  "PARA-POZA-ZAKRESEM":
    'Źródło nie ocenia pary "{etykieta}" w tym środowisku — sprawdź kompatybilność u producenta ' +
    "złączki, nie zgadujemy.",
  "BRAK-OCHRONY":
    "Brak jakiejkolwiek ochrony przed odwrotną polaryzacją na obwodzie, gdzie łatwo pomylić plus i minus.",
  "OCHRONA-ZASTOSOWANA": "Ochrona przed odwrotną polaryzacją zastosowana.",
  "REKOMENDACJA-TYPU-OCHRONY-NIE-PODANA":
    "Rekomendacja typu ochrony per miejsce (bateria/panele/falownik) NIE podana w źródle — miejsce " +
    "obwodu jest tu informacyjne, decyzję o typie podejmuje użytkownik.",
  "BRAK-TYPU-1-PRZY-ODGROMOWEJ":
    "Budynek ma instalację odgromową — na wejściu do budynku obowiązkowy jest SPD Typ 1 (prąd " +
    "udarowy 10/350 µs), nie tylko Typ 2.",
  "ZA-BLISKO-ZWODU":
    "Panele {odleglosc} m od zwodu piorunochronu (poniżej {min} m) — ryzyko przeskoku iskry. " +
    "Zwiększ odstęp do min. 1 m lub zastosuj separację izolacyjną.",
  "UC-PONIZEJ-MINIMUM":
    "Napięcie trwałej pracy SPD ({uc} V) jest poniżej wymaganego minimum ({ucMin} V = Voc × 1,25) " +
    "— SPD może ulec uszkodzeniu w normalnej pracy.",
  "SPD-UZIEMIONY-OSOBNO":
    "SPD musi być uziemiony przez wspólną Główną Szynę Wyrównawczą (GSW), nigdy osobno.",
  "SPD-DOBRANY-POPRAWNIE": "SPD {typ}, Uc wystarczające, uziemienie przez GSW — wszystkie warunki spełnione.",
  "VOC-STRINGU-WARTOSC-ZIMOWA":
    "Voc stringu powinien być wartością zimową (Ekran 5, Moduł 3 — Zimowy stress-test MPPT), nie " +
    "warunkami STC — inaczej ochronnik dobrany latem nie da rady zimą.",
  "TRASA-NIE-SPELNIA-WYMAGAN-PRZEKROJU": "Trasa {oznaczenie} nie spełnia wymagań przekroju — zobacz szczegóły poniżej.",
  "POROWNANIE-KOSZTOW-TRAS":
    "Po {lata} latach trasa {tansza} jest tańsza o {roznica} zł (koszt zakupu + straty energii razem).",
  "WYNIK-ZALEZY-OD-ECHA-TRASY":
    "Wynik zależy od echa calculateDoborPrzekrojuKabla dla obu tras — jedna z tras zwróciła status, " +
    "który uniemożliwia dalsze wyliczenie (patrz ostrzeżenia).",
  "STRATY-ROCZNE-LICZONE-PRZEZ-ECHO":
    "Straty roczne liczone przez echo calculateDoborPrzekrojuKabla (M5/Ekran 1, tryb 'sprawdź mój " +
    "przekrój') — normatywne (PN-HD 60364-5-52), nie wymyślone od nowa.",
  "KOSZT-ZAKUPU-JEDNA-SUMA-NA-TRASE":
    "Koszt zakupu (kabel + osłony + robocizna) wpisywany jako jedna suma na trasę, tak jak w " +
    "przykładzie źródła.",
  "TCO-NIE-POKAZANE-NIESPELNIONE-WYMAGANIA":
    "Porównanie kosztów (TCO) NIE pokazane — co najmniej jedna trasa nie spełnia wymagań przekroju " +
    "(echo zwraca stratę 0 dla niezgodnego przekroju, co fałszywie zaniżałoby jej koszt). Popraw " +
    "przekrój trasy oznaczonej jako niespełniającą wymagań.",
  "CIAGLOSC-NIEPOTWIERDZONA":
    "Ciągłość przewodów ochronnych nie potwierdzona — wszystkie muszą być połączone z GSW.",
  "REZYSTANCJA-IZOLACJI-ZA-NISKA":
    "Rezystancja izolacji {wartosc} MΩ jest poniżej wymaganego minimum {min} MΩ.",
  "REZYSTANCJA-UZIEMIENIA-NIEZMIERZONA": "Rezystancja uziemienia jeszcze nie zmierzona.",
  "REZYSTANCJA-UZIEMIENIA-ZA-WYSOKA": "Rezystancja uziemienia {wartosc} Ω przekracza wymagany próg {prog} Ω.",
  "CZAS-RCD-NIEZMIERZONY": "Czas zadziałania RCD jeszcze nie zmierzony.",
  "CZAS-RCD-ZA-DLUGI": "RCD zadziałał po {czas} s — wymagane poniżej {max} s.",
  "TEST-ZWARCIOWY-NIEPOTWIERDZONY":
    "Test zwarciowy pętli nie potwierdzony — zabezpieczenie musi zadziałać przy symulowanym zwarciu.",
  "TERMOWIZJA-NIEPOTWIERDZONA":
    "Termowizja połączeń nie potwierdzona — sprawdź brak gorących punktów pod obciążeniem.",
  "WSZYSTKO-OK": "Wszystkie pomiary i testy powykonawcze w normie — formalny odbiór instalacji możliwy.",
  "BRAK-SKRZYNKI-IP66": "Łączenie stringów bezpośrednio na wolnym powietrzu bez skrzynki IP66 jest zabronione.",
  "ZA-MALO-WEJSC-SKRZYNKI":
    "Skrzynka ma {wejscia} wejść, a stringów jest {stringi} — dobierz skrzynkę z odpowiednią liczbą wejść.",
  "BEZPIECZNIK-STRINGOWY-POZA-ZAKRESEM":
    "Bezpiecznik stringowy ({bezpiecznik} A) jest poza zalecanym zakresem {min}-{max} A/string.",
  "LICZBA-STRINGOW-UJEMNA": "Liczba stringów nie może być ujemna.",
  "LICZBA-WEJSC-UJEMNA": "Liczba wejść skrzynki nie może być ujemna.",
  "BEZPIECZNIK-STRINGOWY-UJEMNY": "Prąd bezpiecznika stringowego nie może być ujemny.",
  "SPD-ROZLACZNIK-NIE-SPRAWDZONE":
    "SPD Typ 2 (cross-ref Ekran 2) i rozłącznik izolacyjny DC nie sprawdzone — brak podanych parametrów w źródle.",
  "LICZBA-WEJSC-NIEPODANA-POMINIETO": "Liczba wejść skrzynki niepodana — sprawdzenie pominięte.",
  "BEZPIECZNIK-STRINGOWY-NIEWYBRANY-POMINIETO":
    "Bezpiecznik stringowy niewybrany — sprawdzenie zakresu pominięte.",
  "BIEGUN-UZIEMIONY-WBREW-IT":
    "Falownik wymaga układu izolowanego (IT), a biegun DC jest uziemiony — ryzyko uszkodzenia MPPT.",
  "WYMAGANY-MONITOR-IZOLACJI":
    "Falownik pracuje w układzie IT — zastosuj monitor izolacji (IMD), zobacz Ekran 18.",
  "OBUDOWA-NIEPOLACZONA-Z-GSW":
    "Uziemienie obudowy falownika nie jest połączone z Główną Szyną Wyrównawczą (GSW).",
  "UZIEMIENIE-OK": "Uziemienie funkcjonalne i ochronne zgodne z wymaganiami producenta falownika.",
  "UKLAD-SIECI-INFORMACYJNY":
    "Układ sieci (TN-S/TN-C-S/TT/IT) jest tu informacyjny — źródło nie wiąże go bezpośrednio z werdyktem " +
    "tego ekranu, tylko z ogólnym kontekstem instalacji.",
  "WYLACZNIK-NIECERTYFIKOWANY-DO-DC":
    "Wyłącznik AC zastosowany w obwodzie DC nie zgasi łuku stałoprądowego — ryzyko pożaru.",
  "AIC-WYLACZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO":
    "Zdolność wyłączania wyłącznika ({aic} A) jest niższa niż prąd zwarciowy w tym punkcie ({pradZwarciowy} A).",
  "WYLACZNIK-DC-DOBRANY-POPRAWNIE": "Wyłącznik certyfikowany do DC, zdolność wyłączania wystarczająca.",
  "AIC-WYLACZANIA-NIE-SPRAWDZONA-WOBEC-ZWARCIA":
    "Zdolność wyłączania (AIC) nie sprawdzona wobec prądu zwarciowego — wpisz oba pola, docelowo prąd " +
    "zwarciowy z Ekranu 12 (Analiza zwarciowa).",
  "WYMAGANY-TYP-B":
    "Falownik hybrydowy wymaga RCD typu B — zainstalowany typ {typ} nie wykryje prądu uszkodzeniowego DC " +
    "(realne ryzyko porażenia).",
  "WYMAGANY-TYP-A-MINIMUM":
    "Odbiorniki z silnikami wymagają RCD co najmniej typu A — zainstalowany typ AC nie wystarcza.",
  "PROG-POWYZEJ-OCHRONY-OSOB": "Próg różnicowy {prog} mA jest za wysoki dla ochrony osób — wymagane 30 mA.",
  "PROG-POWYZEJ-OCHRONY-POZAROWEJ":
    "Próg różnicowy {prog} mA jest za wysoki dla ochrony przeciwpożarowej — wymagane 300 mA.",
  "RCD-DOBRANY-POPRAWNIE": "Typ RCD i próg różnicowy spełniają wszystkie sprawdzone wymagania.",
  "TYP-RCD-MINIMALNY-NIE-PODANY":
    "Bez falownika hybrydowego i bez silników w obwodzie źródło nie podaje minimalnego typu RCD — nie " +
    "zgadywany.",
  "OKNO-MPPT-ODWROCONE": "Dolna granica okna MPPT nie może być większa od górnej.",
  "NAPIECIE-ZIMOWE-ZA-WYSOKIE":
    "Napięcie stringu w najzimniejszych warunkach ({vStringCold} V) przekracza maksymalne " +
    "dopuszczalne napięcie DC falownika ({vMax} V) — realne ryzyko trwałego uszkodzenia falownika " +
    "w mroźny, słoneczny poranek. Zmniejsz liczbę paneli w stringu.",
  "NAPIECIE-ZIMOWE-OK":
    "Napięcie stringu w najzimniejszych warunkach ({vStringCold} V) mieści się w limicie " +
    "falownika ({vMax} V).",
  "PONIZEJ-OKNA-MPPT":
    "Napięcie robocze stringu ({vStringStc} V) jest poniżej dolnej granicy okna MPPT falownika " +
    "({mpptMin} V) — falownik może nie odnaleźć punktu mocy maksymalnej albo w ogóle nie " +
    "wystartować. Dodaj panele do stringu.",
  "POWYZEJ-OKNA-MPPT":
    "Napięcie robocze stringu ({vStringStc} V) przekracza górną granicę okna MPPT falownika " +
    "({mpptMax} V) — falownik może obcinać dostępną moc. Usuń panel ze stringu albo rozdziel na " +
    "dwa krótsze stringi.",
  "W-OKNIE-MPPT":
    "Napięcie robocze stringu ({vStringStc} V) mieści się w oknie MPPT falownika ({mpptMin}-{mpptMax} V).",
  "PRAD-PRZEKROCZONY":
    "Prąd roboczy stringu ({iString} A) przekracza maksymalny prąd wejściowy MPPT falownika " +
    "({iMax} A) — ryzyko uszkodzenia wejścia MPPT. Rozdziel panele na osobne MPPT albo wybierz " +
    "panel o niższym Imp.",
  "PRAD-OK": "Prąd roboczy stringu ({iString} A) mieści się w limicie MPPT falownika ({iMax} A).",
  "DC-AC-ZA-MALE":
    "Stosunek mocy PV do mocy AC falownika ({ratio}) jest poniżej zalecanego zakresu " +
    "({min}-1,3 dla off-gridu) — falownik nie wykorzysta swojego potencjału, zwłaszcza przy " +
    "słabszym świetle.",
  "DC-AC-ZA-DUZE":
    "Stosunek mocy PV do mocy AC falownika ({ratio}) przekracza zalecany zakres (1,1-{max} dla " +
    "off-gridu) — ryzyko obcinania mocy w słoneczne dni, przegrzewania i skróconej żywotności falownika.",
  "DC-AC-OK":
    "Stosunek mocy PV do mocy AC falownika ({ratio}) mieści się w zalecanym zakresie 1,1-1,3 dla off-gridu.",
  "ZAKLADA-JEDEN-STRING":
    "Zakłada JEDEN string (bez wielu stringów równoległych) — zgodnie z parametrami Sekcji A źródła.",
  "MOC-PV-WZOR-VMP-IMP":
    "Moc PV (do współczynnika DC/AC) liczona jako Vmp × Imp × liczba paneli (P=V×I w warunkach " +
    "STC), nie wpisywana osobno.",
  "KRYTERIUM-4-NIE-SPRAWDZANE":
    "Kryterium 4 źródła (napięcie startowe falownika w upale) NIE jest tu sprawdzane — wymaga " +
    "współczynnika temperaturowego Vmp, którego źródło nie podaje jako wzoru w tym ekranie (patrz " +
    "komentarz w kodzie kalkulatora).",
  "VMPV-NIEDODATNI": 'Wartość pola "napięcie Vmp panelu" musi być większa od zera.',
  "IMPA-NIEDODATNI": 'Wartość pola "prąd Imp panelu" musi być większa od zera.',
  "PANELWGRUPIE-NIEDODATNI": 'Wartość pola "liczba paneli w grupie" musi być większa od zera.',
  "LICZBAGRUP-NIEDODATNI": 'Wartość pola "liczba grup równoległych" musi być większa od zera.',
  "LICZBAPANELI-NIEDODATNI": 'Wartość pola "liczba paneli" musi być większa od zera.',
  "PANELWGRUPIE-NIE-CALKOWITA":
    'Wartość pola "liczba paneli w grupie" musi być liczbą całkowitą — nie da się podłączyć ułamka panelu.',
  "LICZBAGRUP-NIE-CALKOWITA":
    'Wartość pola "liczba grup równoległych" musi być liczbą całkowitą — nie da się podłączyć ułamka panelu.',
  "LICZBAPANELI-NIE-CALKOWITA":
    'Wartość pola "liczba paneli" musi być liczbą całkowitą — nie da się podłączyć ułamka panelu.',
  "LICZBA-PANELI-NIETYPOWO-WYSOKA":
    "To nietypowo duża liczba paneli w jednym stringu — sprawdź, czy to zamierzone.",
  "WYNIK-DLA-WARUNKOW-STC":
    "Wynik liczony dla warunków STC (25°C) — bez korekty temperaturowej na mróz (patrz Moduł 3, " +
    "Ekran 5: zimowy stress-test napięciowy MPPT).",
  "RAZEM-PANELI-MIESZANY": "Razem {razem} paneli ({wGrupie} w grupie × {grup} grup).",
  "SILA-NAPORU":
    "Panel działa trochę jak żagiel — przy tym wietrze na jeden panel działa siła ok. {sila} N. " +
    "Zaplanuj mocowanie/balast odpowiedni do tej siły.",
  "TYLKO-SILA-NAPORU-NIE-SSANIE":
    "Tylko siła naporu (parcie na przód panelu) — siła ssania od spodu, moment wywracający i " +
    "wymagany balast NIE liczone (wymagają geometrii montażu, której źródło nie podaje jako liczb).",
  "DUZA-ROZNICA-MOCY":
    "Różnica mocy paneli ({roznica}%) przekracza 15% — rozdziel je na osobne MPPT albo połącz " +
    "równolegle, jeśli mają zbliżone Vmp.",
  "UMIARKOWANA-ROZNICA-MOCY":
    "Różnica mocy paneli ({roznica}%) jest zauważalna (10-15%) — rozważ osobne MPPT.",
  "MALA-ROZNICA-MOCY":
    "Różnica mocy paneli ({roznica}%) jest niewielka (poniżej 10%) — bezpiecznie w jednym stringu.",
  "NAPIECIE-WSPOLNE-RECZNIE":
    "Wspólne napięcie robocze (Vmp) wpisane ręcznie dla obu paneli — źródło używa jednej, " +
    "uśrednionej wartości w swoim przykładzie, nie wyprowadza jej z mocy/prądu każdego panelu osobno.",
  "OCHRONA-OBOWIAZKOWA-BRAK":
    "Norma HD 60364-7-712 wymaga zabezpieczenia nadprądowego każdego z {ns} równoległych stringów " +
    "— brak grozi pożarem od prądu wstecznego z pozostałych stringów przy zwarciu jednego.",
  "ZAKRES-BEZPIECZNIKA-NIEPOPRAWNY":
    "Nie istnieje bezpiecznik spełniający wymagania normy dla tej konfiguracji (dolna granica " +
    "{inMin} A przekracza górną granicę {inMax} A z karty katalogowej panelu) — zmniejsz liczbę " +
    "stringów równoległych na jedno zabezpieczenie lub wybierz panel o wyższym I_MOD_MAX_OCPR.",
  "WYBRANY-BEZPIECZNIK-POZA-ZAKRESEM":
    "Wybrany bezpiecznik {wybrany} A jest poza wymaganym zakresem [{inMin}, {inMax}] A.",
  "ALTERNATYWA-KABLOWA-NIESPRAWDZONA":
    "Zabezpieczenie nadprądowe nie jest tu wymagane wzorem normy, ale przy {ns} stringach " +
    "równoległych kabel string musi wytrzymać prąd wsteczny {wymaganeIz} A — sprawdź to osobno w " +
    "doborze przekroju kabla.",
  "BEZPIECZNIK-DOBRANY": "Dobierz bezpiecznik gPV w zakresie {inMin}–{inMax} A per string.",
  "K1-MINIMUM-NORMOWE":
    "K1=1,25 (minimum normowe, Załącznik B.2) — w warunkach zwiększonego odbicia/naświetlenia " +
    "norma dopuszcza wyższe K1, ale nie podaje konkretnej wartości; nie zgadujemy.",
  "TRAWA-NISKI-ZYSK":
    "Bez jasnego podłoża zysk z bifacjalności jest niewielki — nie przepłacaj za tę technologię, " +
    "jeśli montujesz na trawie.",
  "DOBRA-POWIERZCHNIA": "Dodatkowy roczny uzysk z tylnej strony: {dodatkowyUzysk} kWh.",
  "PROCENT-UZYSKU-RECZNIE":
    "Procent dodatkowego uzysku wpisany ręcznie w zakresie podanym przez źródło dla wybranej " +
    "powierzchni — nie wyliczany ze współczynnika bifacjalności panelu (brak wzoru łączącego w źródle).",
  "STRATA-PONIZEJ-CELU": "Strata {strata}% mieści się w celu źródła (poniżej {cel}%).",
  "STRATA-POWYZEJ-CELU":
    "Strata {strata}% przekracza cel źródła (poniżej {cel}%) — rozważ grubszy przekrój kabla.",
  "REZYSTANCJA-PETLI-DWA-PRZEWODY":
    "Rezystancja pętli liczona dla dwóch przewodów (plus i minus) — 2×długość kabla, standardowa " +
    "praktyka DC.",
  "DOBRY-STYK":
    "Rezystancja złączki ({rezystancja} mΩ) mieści się w zakresie dobrego stanu (0,5-2 mΩ) — " +
    "strata całkowita {strata} W.",
  "PODWYZSZONA-REZYSTANCJA":
    "Rezystancja złączki ({rezystancja} mΩ) przekracza zakres dobrego stanu (0,5-2 mΩ) — strata " +
    "całkowita {strata} W. Sprawdź złączkę pod kątem luzu/korozji.",
  "ZLY-STYK":
    "Rezystancja złączki ({rezystancja} mΩ) odpowiada luźnej/zaśniedziałej złączce (nawet 10× " +
    "więcej niż dobry stan) — strata całkowita {strata} W i realne ryzyko przegrzania/pożaru. " +
    "Wymień lub oczyść złączkę natychmiast.",
  "REZYSTANCJA-ZLACZKI-RECZNIE":
    "Rezystancja złączki wpisana ręcznie — źródło podaje zakres (0,5-2 mΩ dobry stan, nawet 10× " +
    "więcej przy luźnej/zaśniedziałej), nie pojedynczą liczbę.",
  "PRAD-SZEREGOWY-PRZEZ-WSZYSTKIE-ZLACZKI":
    "Zakłada, że ten sam prąd płynie szeregowo przez wszystkie złączki (typowy przypadek stringu) " +
    "— straty się sumują.",
  "PRZEKROCZONY-LIMIT-MPPT":
    "Napięcie stringu w mrozie ({vString} V) przekracza limit MPPT falownika ({limit} V) — realne " +
    "ryzyko trwałego uszkodzenia wejścia DC. Zmień konfigurację stringów.",
  "BLISKO-LIMITU-MPPT":
    "Napięcie stringu w mrozie ({vString} V) przekracza 95% limitu MPPT ({prog} V z {limit} V) — " +
    "mały margines bezpieczeństwa.",
  "BEZPIECZNY-MARGINES-MPPT":
    "Napięcie stringu w mrozie ({vString} V) mieści się bezpiecznie poniżej limitu MPPT ({limit} V).",
  "UTRATA-MOCY":
    "Panel przy {temperatura}°C traci ok. {strata}% mocy względem wartości katalogowej " +
    "(mierzonej w 25°C).",
  "PRZYROST-TEMP-I-GAMMA-RECZNIE":
    "Przyrost temperatury panelu ponad otoczenie i współczynnik γ wpisane ręcznie — źródło podaje " +
    "tylko typowe zakresy (25-30°C, -0,3 do -0,45%/°C), nie pojedyncze wartości.",
  "LICZBA-SEKCJI-POZA-ZAKRESEM": "Liczba zacienionych sekcji musi być liczbą całkowitą od 0 do 3.",
  "BRAK-ZACIENIENIA": "Panel nie jest zacieniony — brak strat mocy z tego tytułu.",
  "ZACIENIENIE-1-SEKCJA":
    "Zacienienie 1 sekcji obniża moc tego panelu o ok. {strata}%. W stringu połączonym szeregowo " +
    "strata całego stringu może być znacznie większa niż strata samego panelu (zależnie od " +
    "konfiguracji) — przy regularnym/częściowym zacienieniu rozważ mikroinwertery lub " +
    "optymalizatory mocy (Ekran 18).",
  "ZACIENIENIE-2-SEKCJE":
    "Zacienienie 2 sekcji obniża moc tego panelu o ok. {strata}%. To poważna strata — jeden " +
    'zacieniony panel potrafi "położyć" produkcję całego szeregowego stringu, nie tylko siebie. ' +
    "Rozważ mikroinwertery lub optymalizatory mocy (Ekran 18).",
  "ZACIENIENIE-PELNY-PANEL":
    "Panel jest zacieniony we wszystkich 3 sekcjach — diody bocznikujące pomijają go niemal " +
    "całkowicie (strata ok. {strata}%). Praktycznie nie wnosi mocy do stringu; rozważ " +
    "mikroinwertery lub optymalizatory mocy (Ekran 18).",
  "STRATA-PANELU-3-SEKCJE-FAKT":
    "Strata panelu liczona z konstrukcyjnego faktu: standardowy panel PV ma 3 sekcje ogniw, każda " +
    "z osobną diodą bocznikującą — zacienienie sekcji obniża napięcie panelu o 1/3 przy zbliżonym prądzie.",
  "STRATA-STRINGU-NIE-LICZONA":
    "Strata CAŁEGO STRINGU ({liczbaPaneli} paneli szeregowo) NIE jest tu liczona liczbowo — źródło " +
    "opisuje ją jako zależną od konfiguracji (topologia MPPT, okablowanie), bez podanego wzoru. " +
    "Przykład źródła: zacienienie 1 panelu w stringu 6 paneli → strata stringu ok. 55%, ale to " +
    "zależy od konfiguracji, nie jest to stała wartość do wyliczenia tutaj.",
  "DEFICYTKWH-NIEDODATNI": 'Wartość pola "deficyt energetyczny" musi być większa od zera.',
  "MOCAGREGATUKW-NIEDODATNI": 'Wartość pola "moc agregatu" musi być większa od zera.',
  "SREDNIZUZYCIELH-NIEDODATNI": 'Wartość pola "średnie zużycie paliwa" musi być większa od zera.',
  "CENAZALITRZL-NIEDODATNI": 'Wartość pola "cena paliwa" musi być większa od zera.',
  "BRAK-WYJSCIA-STERUJACEGO":
    "Agregat musi być uruchamiany ręcznie lub przez autostart — upewnij się, że BMS ma wyjście sterujące.",
  "MA-WYJSCIE-STERUJACE": "BMS ma wyjście sterujące — agregat może załączać się automatycznie.",
  "OPTYMALNE-OBCIAZENIE-AGREGATU":
    "Optymalne obciążenie agregatu przyjęte na {procent}% mocy znamionowej — górna granica zakresu 70-80% ze źródła.",
  "WOLUMEN-UJEMNY": "Dobowe zapotrzebowanie na C.W.U. nie może być ujemne.",
  "DELTA-T-UJEMNA": "Wzrost temperatury wody nie może być ujemny.",
  "MOC-GRZALKI-UJEMNA": "Moc grzałki nie może być ujemna.",
  "POJEMNOSC-BOJLERA-UJEMNA": "Pojemność bojlera nie może być ujemna.",
  "BOJLER-ZA-MALY":
    "Pojemność bojlera ({pojemnosc} l) jest mniejsza niż dobowe zapotrzebowanie ({wolumen} l) — " +
    "jednego ładowania na dobę może nie wystarczyć.",
  "DELTA-T-RECZNIE":
    "ΔT wpisane ręcznie przez użytkownika — źródło nie podaje wartości domyślnej wzrostu temperatury wody.",
  "ZAPOTRZEBOWANIE-CALKOWITE-NIEDODATNIE":
    'Wartość pola "całkowite zapotrzebowanie dobowe" musi być większa od zera.',
  "BUFOR-BRAK": "Bez bufora — system dobierany dokładnie pod dzisiejsze potrzeby, bez zapasu na przyszłość.",
  "BUFOR-DOLICZONY":
    "Bufor {procent}% dolicza {dodatek} kWh/dobę zapasu na przyszłą rozbudowę (nowe urządzenia, " +
    "powiększenie rodziny).",
  "ODBIORNIK-ODLACZONY": "Odbiornik priorytetu {priorytet} zostałby teraz odłączony przez system load sheddingu.",
  "ODBIORNIK-AKTYWNY-PRIORYTET-1": "Priorytet 1 (krytyczny) — nigdy nie odłączany przez system load sheddingu.",
  "ODBIORNIK-AKTYWNY": "Odbiornik priorytetu {priorytet} pozostaje aktywny przy tym SoC.",
  "POBOR-JALOWY-UJEMNY": "Pobór jałowy nie może być ujemny.",
  "STALY-KOSZT-BILANSU":
    "Falownik sam w sobie coś zużywa, tylko żeby być gotowym do pracy — {strata} kWh/dobę " +
    "doliczane do bilansu z priorytetem 1, zanim cokolwiek włączysz.",
  "SZEROKOSC-POZA-ZAKRESEM": "Szerokość geograficzna musi być z przedziału -90–90°.",
  "DZIEN-ROKU-POZA-ZAKRESEM": "Dzień roku musi być z przedziału 1–365.",
  "MOC-ODBIORNIKA-UJEMNA": "Moc odbiornika nie może być ujemna.",
  "NOC-POLARNA": "Na tej szerokości geograficznej w tym dniu Słońce w ogóle nie wschodzi (noc polarna).",
  "DZIEN-POLARNY": "Na tej szerokości geograficznej w tym dniu Słońce nie zachodzi (dzień polarny).",
  "ENERGIA-NOCNA":
    "Odbiornik {moc} W pracujący przez całą noc ({dlugoscNocy} h) zużywa {energia} kWh tej doby.",
  "DEKLINACJA-METODA-COOPERA":
    "Przybliżenie deklinacji Słońca metodą Coopera (1969) — standardowa formuła inżynierii " +
    "słonecznej, dokładność ±1° deklinacji.",
  "ZAPOTRZEBOWANIEURZADZENIAW-NIEDODATNI": 'Wartość pola "zapotrzebowanie urządzenia" musi być większa od zera.',
  "SPRAWNOSC-PRZETWORNICY-POZA-ZAKRESEM": "Sprawność przetwornicy musi być z przedziału 0–100%.",
  "STRATA-NA-KONWERSJI":
    "Każda zmiana napięcia kosztuje trochę energii — przetwornica traci {strata}% ({strataW} W) " +
    "na samej konwersji.",
  "ZASILANIE-BEZPOSREDNIE": "Urządzenie zasilane bezpośrednio z magistrali — brak strat na konwersji napięcia.",
  "ZAPOTRZEBOWANIE-URZADZENIA-UJEMNE": "Zapotrzebowanie urządzenia nie może być ujemne.",
  "MIESIAC-POZA-ZAKRESEM": "Miesiąc musi być z przedziału 1–12.",
  "URZADZENIE-AKTYWNE": "Urządzenie aktywne w tym okresie — {zapotrzebowanie} kWh/dobę liczy się do bilansu.",
  "URZADZENIE-NIEAKTYWNE": "Urządzenie poza swoim okresem aktywności — nie liczy się do bilansu dobowego.",
  "POBORCIAGLEW-UJEMNY": "Pobór w trybie pracy ciągłej nie może być ujemny.",
  "POBORUSPIENIEW-UJEMNY": "Pobór w trybie uśpienia nie może być ujemny.",
} as const

export type KluczTlumaczenia = keyof typeof dictionaryPl
