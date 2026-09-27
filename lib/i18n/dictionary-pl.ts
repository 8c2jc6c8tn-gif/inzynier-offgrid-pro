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
  "MOC-LADOWANIA-UJEMNA": "Moc ładowania z PV nie może być ujemna.",
  "MOC-ROZLADOWANIA-NIEDODATNIA": "Moc rozładowania w nocy musi być większa od zera.",
  "DLUGOSC-DNIA-POZA-ZAKRESEM": "Długość okna ładowania musi być z przedziału 0–24 godzin.",
  "NIE-PRZETRWA-NOCY":
    "Przy tych parametrach bateria osiągnie próg ostrzegawczy SoC przed końcem nocy — sprawdź, czy moc " +
    "rozładowania lub pojemność są realistyczne.",
  "SYMULACJA-SREDNIA-MOC-NIE-PROFIL-GODZINOWY":
    "Symulacja liczy na średniej mocy ładowania/rozładowania przez całe okno, nie na pełnym profilu " +
    "godzinowym — rzeczywisty przebieg w ciągu dnia/nocy może się różnić.",
  "NAPIECIE-ODCIECIA-NIEDODATNIE": "Napięcie odcięcia musi być większe od zera.",
  "LICZBA-OGNIW-NIEPOPRAWNA": "Liczba ogniw połączonych szeregowo musi być liczbą całkowitą co najmniej 1.",
  "EKSTRAPOLACJA-POZA-KALIBRACJA":
    "To napięcie na ogniwo wykracza poza zakres 2,625–2,750V, na którym skalibrowany jest model (dwa " +
    "punkty danych ze źródła) — wynik jest ekstrapolacją, nie zweryfikowaną kalibracją.",
  "MODEL-LIFEPO4-DWA-PUNKTY-KALIBRACJI":
    "Model liniowy skalibrowany na dwóch punktach danych LiFePO4 ze źródła (42,0V/16S→100% DoD→2000 " +
    "cykli; 44,0V/16S→80% DoD→5000 cykli) — nie na pełnej krzywej producenta.",
  "OCZEKIWANIE-NA-SLONCE":
    "SoC jest poniżej progu krytycznego, ale prognoza przewiduje słońce jutro — system celowo NIE " +
    "włącza agregatu, czeka na darmową energię z PV.",
  "BRAK-DOSTEPNEGO-ZRODLA-LADOWANIA":
    "SoC jest poniżej progu krytycznego i żadne źródło ładowania nie jest dostępne (brak PV, brak " +
    "agregatu lub prognozy słońca, brak taniej taryfy sieciowej) — realne ryzyko dalszego spadku SoC.",
  "PRODUKCJA-NOMINALNA-NIEDODATNIA": "Nominalna produkcja dobowa PV musi być większa od zera.",
  "POZIOM-ZACHMURZENIA-POZA-ZAKRESEM": "Poziom zachmurzenia musi być z przedziału 0–100%.",
  "LICZBA-DNI-SCENARIUSZA-NIEDODATNIA": "Liczba dni scenariusza musi być większa od zera.",
  "SYSTEM-NIE-PRZETRWA-SCENARIUSZA":
    "Przy tych parametrach system nie przetrwa całego scenariusza zachmurzenia — nastąpi blackout, " +
    "zanim skończy się zadana liczba dni.",
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
  "TYLKO-SILA-NAPORU-NIE-SSANIE": "Siła naporu (parcie na przód panelu) i balast przeciw oderwaniu — siła ssania od spodu osobno i moment wywracający NIE liczone (wymagają geometrii montażu, której źródło nie podaje jako liczb).",
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
  "BUFOR-ZA-MALY":
    "Posiadany bufor ({pojemnosc} l) jest mniejszy od zalecanej pojemności ({zalecana} l) — za mały " +
    "bufor to częste starty pompy i większe zużycie prądu.",
  "BUFOR-WYSTARCZAJACY": "Posiadany bufor ({pojemnosc} l) mieści zalecaną pojemność ({zalecana} l).",
  "WYMIANY-POZA-SANITY-CHECK":
    "To nietypowo wysoka liczba wymian powietrza na godzinę (>{max}) — sprawdź dane z testu szczelności.",
  "STRATA-INFILTRACJI": "Strata ciepła przez infiltrację: {strata} kW.",
  "OSZCZEDNOSC-KOCIOL-VS-POMPA":
    "Pompa ciepła jest tańsza o {oszczednosc} zł — kocioł elektryczny zużyje {mnoznik}× więcej prądu na " +
    "to samo ciepło.",
  "OSZCZEDNOSC-POMPA-CYRKULACYJNA":
    "Wymiana na pompę elektroniczną zaoszczędzi {oszczednoscKwh} kWh/dobę ({oszczednoscPct}%).",
  "NOWA-POMPA-NIE-OSZCZEDZA":
    "Wpisana moc nowej pompy nie jest niższa od obecnej — sprawdź dane, bo taka wymiana nie przyniesie " +
    "oszczędności.",
  "GODZINY-POZA-ZAKRESEM": "Doba ma maksymalnie 24 godziny.",
  "NAPIECIE-POZA-SANITY-CHECK":
    "To nietypowo wysoka wartość napięcia (>{max}V) — sprawdź, czy nie pomyliłeś jednostek.",
  "POMPA-SIE-WYLACZY":
    "Aktualne napięcie systemu ({aktualne} V) jest poniżej minimalnego napięcia pracy pompy ({min} V) — " +
    "pompa się wyłączy. Niskie napięcie to cichy zabójca pomp: nie zepsuje się od razu, po prostu " +
    "przestanie działać dokładnie wtedy, gdy jest najbardziej potrzebna.",
  "MARGINES-BEZPIECZNY": "Margines do progu wyłączenia pompy: {margines} V.",
  "SPRAWNOSC-REKUPERATORA-POZA-ZAKRESEM": "Sprawność rekuperatora musi być z przedziału 0–100%.",
  "ODZYSK-INFO":
    "Odzyskane ciepło: {odzysk} kW. Stały pobór wentylatorów: {pobor} W dolicza się do bilansu " +
    "elektrycznego.",
  "STALE-FIZYCZNE-POWIETRZA-INFILTRACJA":
    "Gęstość i ciepło właściwe powietrza jako stałe fizyczne (1,2 kg/m³, 1005 J/(kg·K)) — nie dane " +
    "specyficzne dla źródła.",
  "KOCIOL-SPRAWNOSC-COP1": "Kocioł elektryczny: sprawność 99%, zaokrąglona do COP=1 (1:1 ze źródła).",
  "TA-SAMA-CENA-ENERGII-OBA-ZRODLA":
    "Zakłada tę samą cenę energii elektrycznej dla obu źródeł ciepła (off-grid, ta sama instalacja " +
    "PV/magazyn).",
  "GODZINY-PRACY-WPISANE-RECZNIE":
    "Godziny pracy dobowo wpisane ręcznie — źródło opisuje profil ciągły/sterowany bez wzoru na " +
    "konkretną liczbę godzin dla trybu sterowanego.",
  "NAPIECIE-SYSTEMU-RECZNIE":
    "Aktualne napięcie systemu wpisane ręcznie — docelowo auto z Modułu 4 (live), gdy tryb Live będzie " +
    "miał dane na żywo do pokazania.",
  "STALE-FIZYCZNE-POWIETRZA-WENTYLACJA": "Gęstość i ciepło właściwe powietrza jako stałe fizyczne (1,2 kg/m³, 1005 J/(kg·K)).",
  "POBOR-WENTYLATOROW-OSOBNO-BILANS":
    "Stały pobór wentylatorów raportowany osobno (bilans elektryczny) — nie odejmowany od odzyskanego " +
    "ciepła (inna domena: elektryczna vs cieplna).",
  "PROJEKT-STRUMIENI-BYPASS-NIE-LICZONE":
    "Projekt strumieni per pomieszczenie i logika bypassu letniego (dawne 5.23, 5.24) NIE są tu liczone " +
    "— wymagają danych/reguł nieobecnych w źródle jako wzór.",
  "BRAK-BALANSERA-ZEWNETRZNEGO":
    "{ilosc} akumulatory kwasowe w szeregu bez balansera zewnętrznego — z czasem rozjadą się napięciowo " +
    "(w przeciwieństwie do LiFePO4 z aktywnym BMS). Wymagany balanser podłączony równolegle do każdego " +
    "akumulatora.",
  "ILOSC-AKUMULATOROW-NIEDODATNIA": "Liczba akumulatorów w szeregu musi być większa od zera.",
  "NAPIECIE-PAKIETU-NIEDODATNIE": 'Wartość pola "napięcie pakietu" musi być większa od zera.',
  "PAKIET-WCIAZ-NALADOWANY":
    "Napięcie ogniwa ({napiecie} V) przekracza zalecane {max} V przed demontażem — nie odłączaj ogniw " +
    "przy pełnym naładowaniu, ryzyko iskrzenia i uszkodzenia terminali.",
  "KROK-POZA-KOLEJNOSCIA":
    "Zaznaczono krok poza kolejnością — potwierdź wcześniejsze kroki najpierw, kolejność ma znaczenie.",
  "STAN-PELNY": "Gęstość elektrolitu {gestosc} g/cm³ — akumulator pełny (≥{pelny} g/cm³).",
  "STAN-CZESCIOWO-NALADOWANY":
    "Gęstość elektrolitu {gestosc} g/cm³ — akumulator naładowany częściowo (ok. połowy, referencja " +
    "{polowa} g/cm³). Zalecane doładowanie.",
  "STAN-ROZLADOWANY":
    "Gęstość elektrolitu {gestosc} g/cm³ — akumulator rozładowany. Wymagane doładowanie przed dalszym " +
    "użytkowaniem.",
  "GESTOSC-NIEDODATNIA": "Gęstość elektrolitu musi być większa od zera.",
  "DOCISK-NIEDODATNI": "Docisk musi być większy od zera.",
  "OBJAWY-ZASIARCZENIA-JEDEN": 'Zaobserwowano 1 objaw zasiarczenia — patrz Ekran B11 „Ratowanie zasiarczonego akumulatora".',
  "OBJAWY-ZASIARCZENIA-WIELE":
    'Zaobserwowano {liczba} objawy zasiarczenia — patrz Ekran B11 „Ratowanie zasiarczonego akumulatora".',
  "NAPIECIE-OGNIWA-UJEMNE": "Napięcie ogniwa nie może być ujemne.",
  "TOP-BALANCING-NIEOSIAGNIETY":
    "Napięcie najwyższego ogniwa ({napiecie} V) jeszcze nie osiągnęło progu Top Balancing ({prog} V) — " +
    "kontynuuj ładowanie małym prądem.",
  "POJEMNOSCFALOWNIKAUF-NIEDODATNI": 'Wartość pola "pojemność DC falownika" musi być większa od zera.',
  "REZYSTANCJAPRECHARGEOHM-NIEDODATNI": 'Wartość pola "rezystancja wstępna" musi być większa od zera.',
  "OGNIWO-ZERO-WOLTOWE":
    "Ogniwo ma 0 V. Prawdopodobnie doszło do przebicia separatora. Próba ładowania grozi pożarem. " +
    "Zalecana utylizacja, nie ratunek.",
  "RATUNEK-OPCJONALNY-NIEZALECANY":
    "Napięcie ogniwa ({napiecie} V) jest niskie, ale niezerowe — ratunek jest opcjonalny i nie zalecany. " +
    "Jeśli się zdecydujesz: zasilacz {zasilacz} V, limit prądu {prad} A, obserwuj temperaturę przez cały " +
    "czas ładowania.",
  "PROCEDURA-STANDARDOWEGO-RATUNKU":
    "Napięcie ogniwa ({napiecie} V) pozwala na powolne ładowanie prądem 0,05C pod ścisłą obserwacją.",
  "NAPIECIE-OGNIWA-POLE-UJEMNE": 'Wartość pola "napięcie ogniwa" nie może być ujemna.',
  "NIEPARZYSTA-LICZBA-OGNIW":
    "{liczba} ogniw nie da się ułożyć w dwóch równych rzędach — układ opisany w źródle wymaga parzystej " +
    "liczby ogniw.",
  "ZA-MALO-OGNIW": "Minimum {min} ogniwa — poniżej tego układ dwurzędowy nie ma sensu.",
  "ZA-DUZO-OGNIW":
    "Powyżej {max} ogniw źródło nie opisuje już tego układu — sprawdź specyfikę swojego BMS/obudowy " +
    "ręcznie.",
  "SEKWENCJA-UKLAD-PRESET": "Układ 2 rzędów po {n} ogniw (serpentyna) — 1:1 ze źródła dla tej liczby ogniw.",
  "SEKWENCJA-UKLAD-NIESTANDARDOWY":
    "Układ 2 rzędów po {n} ogniw (serpentyna) — źródło opisuje wprost tylko 4S/8S/16S; dla {liczba}S ten " +
    "sam wzorzec geometryczny zastosowany logicznie (nie 1:1 ze źródła).",
  "NAPIECIE-OGNIWA-NIEDODATNIE": "Napięcie ogniwa nr {numer} musi być większe od zera.",
  "BRAK-BMS-Z-BALANSEREM": "Nie masz BMS z balanserem — bez tego montaż jest niebezpieczny.",
  "ROZNICA-NAPIEC-OGNIW-ZA-DUZA":
    "Różnica napięć między ogniwami ({roznica} V) przekracza {prog} V — wymaga wstępnego zbalansowania " +
    "przed połączeniem w pakiet.",
  "LICZBA-OGNIW-NIEZGODNA":
    "Dla systemu {system} V oczekiwana liczba ogniw w szeregu to {oczekiwana}S — wprowadzono {podana}.",
  "WIDOCZNE-WYBRZUSZENIE":
    "Widoczne puchnięcie obudowy — ogniwo do wycofania z eksploatacji, nie do ponownego montażu.",
  "ZA-MALA-ODLEGLOSC":
    "Odległość od materiałów palnych ({odleglosc} cm) jest mniejsza od minimum {min} cm — realne " +
    "ryzyko pożaru.",
  "ODLEGLOSC-OK": "Odległość od materiałów palnych ({odleglosc} cm) spełnia minimum {min} cm.",
  "BRAK-NAWIEWU":
    "Brak osobnego nawiewu powietrza do spalania — ryzyko niedotlenienia pomieszczenia i cofki spalin.",
  "NAWIEW-OBECNY": "Osobny nawiew powietrza do spalania jest zapewniony.",
  "BRAK-CZUJNIKA-CO":
    "Brak czujnika czadu (CO) w pomieszczeniu z otwartym źródłem spalania — to zagrożenie życia, nie " +
    "tylko mienia. Czad nie ma zapachu i zabija we śnie.",
  "CZUJNIK-CO-OBECNY": "Czujnik czadu (CO) jest zamontowany w pomieszczeniu.",
  "BRAK-ZAZNACZONYCH-URZADZEN": "Nie zaznaczono żadnego urządzenia krytycznego do podtrzymania.",
  "CZAS-PODTRZYMANIA": "Czas podtrzymania: {czas} h.",
  "POJEMNOSCAH-NIEDODATNI": 'Wartość pola "pojemność akumulatora" musi być większa od zera.',
  "NAPIECIEV-NIEDODATNI": 'Wartość pola "napięcie" musi być większa od zera.',
  "MOCODBIORNIKAW-NIEDODATNI": 'Wartość pola "moc odbiornika" musi być większa od zera.',
  "TRYB-UPROSZCZONY-CZAS-TEORETYCZNY":
    "Bez uwzględnienia sprawności układu i głębokości rozładowania (DoD) — czas teoretyczny.",
  "MOC-UJEMNA": "Obciążenie szczytowe nie może być ujemne.",
  "REKOMENDACJA-NAPIECIA":
    "Wyższe napięcie systemowe = mniejszy prąd przy tej samej mocy = cieńsze, tańsze kable. " +
    "Rekomendowane: {napiecie}V.",
  "KONFLIKT-JEDNOCZESNOSCI":
    "Zaznaczone odbiorniki w połączeniu pobierają {suma} W — to przekracza planowaną moc ciągłą " +
    "falownika ({limit} W).",
  "KONFLIKT-JEDNOCZESNOSCI-Z-PROPOZYCJA":
    "Zaznaczone odbiorniki w połączeniu pobierają {suma} W — to przekracza planowaną moc ciągłą " +
    "falownika ({limit} W). Nie uruchamiaj razem: {urzadzenia}.",
  "OGRZEWANIE-WYMAGA-48V":
    "Zaznaczone ogrzewanie elektryczne ({moc} W) zwykle wymaga systemu 48V — obecna rekomendacja to " +
    "{napiecie}V, sprawdź czy to na pewno wystarczy przy długotrwałej pracy grzania.",
  "PRAD-WYSOKI-PRZY-12V":
    "Przy 12V ten system pociągnąłby {prad} A — to prąd rzędu spawarki. Każde poluzowane złącze przy " +
    "takim prądzie to potencjalny hotspot i ryzyko pożaru. Systemy 12V o prądach powyżej 100A są " +
    "niezalecane.",
  "PULAPKA-KONWERSJI-24-DO-48":
    "Nie łącz dwóch gotowych pakietów 24V szeregowo, żeby uzyskać 48V — BMS-y nie komunikują się ze " +
    "sobą, ogniwa się rozjadą. Zbuduj pakiet 48V od podstaw (16 ogniw, jeden BMS 16S) — poniżej " +
    "szacowany koszt przejścia.",
  "NAPIECIE-SYSTEMOWE-PASMO-24V-DOPOWIEDZIANE":
    "Pasmo 1000-3000W → 24V dopowiedziane logicznie ze struktury 12/24/48V (źródło podaje wprost " +
    "tylko progi <1000W i >3000W).",
  "NAPIECIE-SYSTEMOWE-MOC-SZCZYTOWA-DEFINICJA":
    "Moc szczytowa = suma zaznaczonych odbiorników (Etap B) + moc ogrzewania (Etap A), chyba że " +
    "wpisano ręczne pole 'Obciążenie szczytowe' — wtedy ono nadpisuje sumę z kreatora.",
  "NAPIECIE-SYSTEMOWE-KONFLIKT-JEDNOCZESNOSCI-WARUNEK":
    "Etap B.2 (konflikt jednoczesności) sprawdzany tylko gdy podano planowaną moc ciągłą falownika — " +
    "bez niej nie ma z czym porównać sumy 'worst case'.",
  "NAPIECIE-SYSTEMOWE-KABEL-ECHO":
    "Etap C: przekrój/spadek napięcia/straty roczne liczone przez echo M5/Ekran1 (norma PN-HD " +
    "60364-5-52), nie przez uproszczony wzór P=I²R z materiału źródłowego.",
  "NAPIECIE-SYSTEMOWE-KOSZTORYS-METODA":
    "Etap E: kosztorysy dla TEJ SAMEJ docelowej pojemności energetycznej u wszystkich trzech napięć " +
    "(poprawne porównanie wg źródła, nie naiwne porównanie tą samą liczbą ogniw). Koszt BMS liczony " +
    "jako jedna sztuka niezależnie od liczby równoległych stringów — zgodnie z literalnymi tabelami " +
    "źródła.",
  "RYZYKO-PID": "Napięcie systemu DC ({napiecie} V) przekracza próg {prog} V przy wysokiej wilgotności — ryzyko PID.",
  "BRAK-RYZYKA-PID": "Napięcie systemu DC ({napiecie} V) — brak ryzyka PID w obecnych warunkach.",
  "NIEZGODNOSC-NAPIEC-PWM":
    "Panel {panel} V do akumulatora {akumulator} V — PWM nie obniży napięcia panelu, wymagany MPPT.",
  "MPPT-OPLACALNY-PRZY-MOCY": "Moc paneli {moc} W ({prog} W lub więcej) — MPPT jest opłacalny.",
  "PWM-WYSTARCZY": "Moc paneli {moc} W, napięcia zgodne — regulator PWM wystarczy.",
  "PID-PROG-NAPIECIA-ZE-ZRODLA": "Próg napięcia (400V) i wysoka wilgotność jako warunek ryzyka PID wzięte wprost ze źródła — bez modelu tempa utraty mocy.",
  "PROG-MOC-MPPT-OPLACALNOSC-DOPOWIEDZIANY": "Próg mocy 250W (środek zakresu 200-300W ze źródła) — dopowiedziany, nie podany wprost jako jedna liczba.",
  "POZA-ZAKRESEM-WZORU-WIND-CHILL":
    "Wzór wind chill jest zdefiniowany tylko dla temperatury ≤{maxTemp}°C i wiatru >{minWiatr} km/h — poza tym zakresem wynik nie ma sensu fizycznego.",
  "WIND-CHILL-WZOR-NWS": "Standardowy wzór meteorologiczny NWS/Environment Canada (2001) — nie podany wprost w materiale źródłowym tego projektu, ale publicznie znana fizyka.",
  "SUGEROWANA-WYMIANA-STARYCH-URZADZEN": "Urządzenia klasy \"stare\" (realnie zużywają więcej niż nominalna moc sugeruje): {urzadzenia}. Rozważ wymianę — może się zwrócić w oszczędności baterii.",
  "NISKIE-OBCIAZENIE-FALOWNIKA": "Obciążenie falownika to tylko {obciazenie}% mocy znamionowej — sprawność w tym zakresie zwykle spada.",
  "OBCIAZENIE-FALOWNIKA-OPTYMALNE": "Obciążenie falownika ({obciazenie}%) jest w zakresie typowo najwyższej sprawności.",
  "MIESZANI-PRODUCENCI-MC4":
    "Złączki żeńska i męska są od różnych producentów — styki różnych rodzin nie zawsze pasują idealnie, luźny styk pod prądem robi łuk elektryczny i to realne ryzyko pożaru.",
  "PRODUCENT-MC4-NIEZNANY": "Producenta złączki oznaczono jako nieznany — zgodności styków nie da się potwierdzić bez identyfikacji.",
  "ZLACZA-MC4-ZGODNE": "Złączki {producent} po obu stronach — komplet od jednego producenta, zgodne.",
  "SZCZELINA-KRYTYCZNA":
    "Szczelina {szczelina} cm jest poniżej progu krytycznego (5 cm) — temperatura panelu może sięgnąć nawet 70°C, szacowana strata mocy ok. {strata}%.",
  "SZCZELINA-POSREDNIA-BRAK-DANYCH":
    "Szczelina {szczelina} cm jest w zakresie pośrednim (5–15 cm), dla którego źródło nie podaje dokładnej straty mocy — dla pewności zalecana szczelina min. 15 cm.",
  "SZCZELINA-BEZPIECZNA": "Szczelina wentylacyjna wystarczająca (≥15 cm) — bez istotnej straty mocy z przegrzania.",
  "GEOMETRIA-PRETA-NIEFIZYCZNA": "Ta kombinacja długości i średnicy pręta jest poza zakresem wzoru — sprawdź jednostki (m dla długości, mm dla średnicy).",
  "ZA-DUZO-PRETOW-DO-PROSTEGO-LICZENIA":
    "Szacowana liczba prętów ({liczba}) przekracza {max} — przy tak trudnym gruncie potrzebny jest realny projekt uziemienia, nie tylko proste liczenie.",
  "UZIOM-ZAPROJEKTOWANY": "Szacowana liczba prętów: {liczba} (rezystancja pojedynczego pręta ≈ {rezystancja} Ω).",
  "UZIOM-MODEL-N-PRETOW-UPROSZCZONY":
    "Liczba prętów liczona uproszczonym modelem równoległym (1/n), bez korekty na wzajemne oddziaływanie prętów — realna wartość po instalacji może wymagać jednego pręta więcej. Zmierz rezystancję po wykonaniu uziomu.",
  "UZIOM-MATERIAL-PATRZ-LACZENIE-CU-AL":
    "Dobór materiału pręta (miedź vs stal ocynkowana) i unikanie korozji galwanicznej przy łączeniu różnych metali — patrz ekran „Łączenie Cu-Al i ochrona przed korozją” (Moduł 5, Ekran 4).",
  "UKLAD-IT-BEZ-IMD": "Układ sieci jest typu IT, ale brak zamontowanego IMD — pierwsze doziemienie nie wyłączy bezpiecznika i pozostanie niewykryte.",
  "IMD-ZAINSTALOWANY-POPRAWNIE": "IMD zainstalowany, próg alarmu {prog} kΩ.",
  "UKLAD-NIE-IT-IMD-NIEPOTRZEBNY": "Układ nie jest typu IT — doziemienie wyłącza bezpiecznik automatycznie, IMD nie jest wymagany.",
  "IMD-PROG-ALARMU-PRZYKLADOWA-WARTOSC-ZRODLA":
    "Wpisany próg alarmu to wartość ustawiona przez Ciebie — źródło podaje 50 kΩ tylko jako przykład, nie jako uniwersalny wymóg. Realny próg zależy od napięcia systemu i zaleceń producenta IMD.",
  "BRAK-CERTYFIKATU": "{komponent} — certyfikat jeszcze niepotwierdzony.",
  "WAMPIR-POZYCJA-NIEDODATNIA": 'Zaznaczone urządzenie "{label}" musi mieć moc większą od zera.',
  "WAMPIR-BRAK-ZAZNACZONYCH": "Nie zaznaczono żadnego urządzenia z katalogu standby.",
  "WAMPIR-POZYCJA-WARTOSC-DOMYSLNA": '"{label}" przyjęte z domyślną mocą {value} W (nie edytowane).',
  "WAMPIR-POMIAR-NIEDODATNI": 'Zmierzona pozycja "{label}" musi mieć moc większą od zera.',
  "WAMPIR-BRAK-POMIAROW": "Nie wpisano żadnego pomiaru mocy jałowej.",
  "WAMPIR-STANDBY-NIEDODATNI": "Pobór standby musi być liczbą większą od zera.",
  "WAMPIR-DOD-POZA-ZAKRESEM": "DoD (głębokość rozładowania) musi być z przedziału (0, 100].",
  "WAMPIR-POJEMNOSC-NIEDODATNIA": "Pojemność użyteczna musi być liczbą większą od zera.",
  "WAMPIR-CENA-ENERGII-NIEDODATNIA": "Cena energii musi być liczbą większą od zera.",
  "WAMPIR-ELIMINACJA-POZA-ZAKRESEM": "Procent eliminacji standby musi być z przedziału (0, 100].",
  "WAMPIR-KOSZT-UJEMNY": 'Koszt zakupu/montażu metody "{label}" nie może być ujemny.',
  "WAMPIR-OSZCZEDNOSC-NIGDY-NIE-ZWROCI": 'Metoda "{label}" — przy tak niskiej rocznej oszczędności koszt zakupu nigdy się nie zwróci.',
  "WAMPIR-STANDBY-REFERENCYJNY-NIEDODATNI": "Standby referencyjny (tryb normalny) musi być liczbą większą od zera.",
  "WAMPIR-STANDBY-SCENARIUSZ-NIEDODATNI": "Standby w scenariuszu nie może być liczbą ujemną.",
  "WAMPIR-REDUKCJA-NIEPOZYTYWNA": "Ten scenariusz nie daje redukcji poboru standby względem trybu referencyjnego.",
  "ZACIENIENIE-PRZESZKODA-NIEPOPRAWNA": "Przeszkoda \"{nazwa}\" ma niepoprawne wymiary (wysokość nie może być ujemna, promień korony i obrys muszą być dodatnie/kompletne).",
  "ZACIENIENIE-PUNKT-W-PRZESZKODZIE": "Punkt analizy leży wewnątrz przeszkody \"{nazwa}\" — przesuń punkt albo popraw położenie przeszkody.",
  "ZACIENIENIE-PROGNOZA-NIZSZA": "Prognozowana wysokość drzewa \"{nazwa}\" jest niższa niż obecna — sprawdź, czy to zamierzone (np. planowane przycięcie).",
  "ZACIENIENIE-POWIERZCHNIA-BEZ-SLONCA": "Przy tej orientacji słońce przez cały rok jest za płaszczyzną — promieniowanie bezpośrednie na nią nie pada.",
  "ZACIENIENIE-ZALOZENIE-BEZPOSREDNIE-CZYSTE-NIEBO": "Strata dotyczy promieniowania bezpośredniego przy bezchmurnym niebie (model Meinela, ważenie cos θ). Promieniowanie rozproszone i zachmurzenie nie są uwzględnione — rzeczywista strata całkowitej energii jest zwykle mniejsza. Wariant zapasowy bez danych PVGIS — pobierz je, żeby policzyć stratę całkowitą.",
  "ZACIENIENIE-ZALOZENIE-TMY-MUNEER": "Strata całkowitego napromieniowania płaszczyzny na godzinowych danych PVGIS TMY (rzeczywiste zachmurzenie), model Muneera — ten sam co na Ekranie 4. Gdy słońce jest za przeszkodą, znika promieniowanie bezpośrednie i okołosłoneczne; albedo gruntu {albedo}.",
  "ZACIENIENIE-ZALOZENIE-NIEBOSKLON": "Przeszkody zasłaniają też część nieba, co zmniejsza promieniowanie rozproszone nawet przy widocznym słońcu — tego efektu nie liczymy, więc rzeczywista strata może być nieco większa.",
  "ZACIENIENIE-ZALOZENIE-JEDEN-PUNKT": "Analiza dla jednego punktu płaszczyzny. Częściowe zacienienie części modułów działa na cały string przez diody bocznikujące — patrz Moduł 3, Symulacja zacienienia i diody bocznikujące.",
  "ZACIENIENIE-ZALOZENIE-DRZEWA-NIEPRZEZROCZYSTE": "Drzewa nieoznaczone jako liściaste (albo bez podanych miesięcy bez liści) traktowane jako nieprzezroczyste przez cały rok — założenie ostrożne, zawyża stratę dla drzew bezlistnych zimą.",
  "ZACIENIENIE-ZALOZENIE-DRZEWA-LISCIASTE": "Drzewa liściaste ({nazwy}) w miesiącach bez liści ({miesiace}) przepuszczają {procent}% promieniowania bezpośredniego — dolna granica pomiarów koron bezlistnych (Konarska i in. 2014: 40–52%); w pozostałych miesiącach nieprzezroczyste. Miesiące bez liści wpisane ręcznie.",
  "ZACIENIENIE-BRAK-OKRESU-BEZLISCI": "Drzewa oznaczone jako liściaste ({nazwy}) liczone jako nieprzezroczyste cały rok — nie podano miesięcy bez liści.",
  "ZACIENIENIE-ZALOZENIE-PROGNOZA": "Prognoza za {lata} lat na podstawie wysokości drzew wpisanych ręcznie — aplikacja nie modeluje tempa wzrostu.",
  "ORIENTACJA-DANE-NIEPELNY-ROK": "Dane godzinowe muszą obejmować pełny rok (8760 lub 8784 godzin), otrzymano {liczba}.",
  "ORIENTACJA-DANE-UJEMNE": "Rekord danych nr {indeks} zawiera ujemne lub niepoprawne promieniowanie.",
  "ORIENTACJA-POWIERZCHNIA-NIEPOPRAWNA": "Powierzchnia \"{nazwa}\": nachylenie musi być z przedziału 0–90°, a azymut 0–360°.",
  "ORIENTACJA-ZALOZENIE-MODEL-MUNEER": "Napromieniowanie płaszczyzny z modelu anizotropowego nieba Muneera (1990) — tego samego, którego używa PVGIS — na godzinowych danych PVGIS TMY; optimum wyznaczone z tych samych danych.",
  "ORIENTACJA-ZALOZENIE-NAPROMIENIOWANIE-NIE-UZYSK": "Wskaźnik porównuje napromieniowanie powierzchni, nie uzysk energii — pomija temperaturę ogniw i straty odbicia (zacienienie — osobne założenie). Szczegółowy uzysk liczy Moduł 3.",
  "ORIENTACJA-ZALOZENIE-ALBEDO": "Albedo gruntu = {albedo} (domyślnie 0,2 — typowy grunt bez śniegu; zmień, jeśli teren jest inny).",
  "ORIENTACJA-HORYZONT-NIEPOPRAWNY": "Powierzchnia \"{nazwa}\": profil horyzontu jest pusty albo zawiera kąt spoza 0–90°.",
  "ORIENTACJA-ZALOZENIE-ZACIENIENIE-HORYZONT": "Zacienienie przez przeszkody z modelu działki (Ekran 2, obecna wysokość): gdy słońce jest za przeszkodą, promieniowanie bezpośrednie = 0, a rozproszone liczone jak dla powierzchni zacienionej (Muneer). Przesłonięcie części nieboskłonu przez przeszkody nie jest modelowane. Wynik = średnia z punktów siatki na połaci (jak mapa cieplna Ekranu 3); optimum lokalizacji — bez przeszkód.",
  "ORIENTACJA-ZALOZENIE-ZACIENIENIE-BRAK": "Bez zacienienia (brak profilu horyzontu — wysokość punktu na powierzchni nieznana): {nazwy}.",
  "SKANER-PUNKT-POZA-ZAKRESEM": "Punkt nr {indeks} w zbiorze {zbior} ma współrzędne poza zakresem (szerokość −90…90°, długość −180…180°).",
  "SKANER-ZA-MALO-PUNKTOW": "Zbiór {zbior} potrzebuje co najmniej {min} punktów.",
  "SKANER-POLAC-BEZ-WYSOKOSCI": "Połać \"{nazwa}\": każdy punkt musi mieć wysokość z GPS — bez niej nie da się wyznaczyć nachylenia.",
  "SKANER-KALIBRACJA-NIEPOPRAWNA": "Kalibracja jest niepoprawna: wybierz dwa różne punkty z tego samego zbioru i podaj dodatnią znaną długość.",
  "SKANER-PRZESZKODA-NIEPOPRAWNA": "Przeszkoda \"{nazwa}\": wysokość nie może być ujemna, a promień musi być większy od zera.",
  "SKANER-PRZESZKODA-OBRYS-NIEPOPRAWNA": "Przeszkoda \"{nazwa}\": wysokość nie może być ujemna.",
  "SKANER-BRAK-WYSOKOSCI-GRUNTU": "Narożniki budynku nie mają wysokości z GPS — wysokość kalenicy nie może być wyznaczona.",
  "SKANER-ZALOZENIE-UKLAD-LOKALNY": "Współrzędne GPS przeliczone na lokalny układ metryczny (płaszczyzna styczna do elipsoidy WGS84 w pierwszym punkcie) — dokładne dla obszaru działki.",
  "SKANER-ZALOZENIE-KALIBRACJA-POZIOMA": "Kalibracja znanym wymiarem koryguje tylko wymiary poziome — błąd wysokości z GPS pozostaje.",
  "SKANER-ZALOZENIE-WYSOKOSC-GPS": "Nachylenie połaci i wysokość kalenicy wyznaczone z wysokości GPS, która jest zwykle mniej dokładna niż położenie poziome — traktuj je orientacyjnie albo skoryguj ręcznie.",
  "MIKROPEKNIECIA-ODSTEP-ZA-MALY": "Odstęp dylatacyjny {odstep} mm jest mniejszy niż minimum {min} mm — sztywny montaż doprowadzi do mikropęknięć w ciągu ok. {lata} lat.",
  "MIKROPEKNIECIA-BRAK-EPDM": "Brak podkładek EPDM — sztywne mocowanie nie daje panelom luzu na rozszerzalność cieplną; ryzyko mikropęknięć w ciągu ok. {lata} lat.",
  "MIKROPEKNIECIA-MONTAZ-ELASTYCZNY": "Montaż elastyczny: podkładki EPDM i odstęp dylatacyjny {odstep} mm — spełnia zalecenie źródła.",
  "MIKROPEKNIECIA-DANE-ZE-ZRODLA": "Minimum 5 mm, nagrzewanie do 65–70°C, schłodzenie o 30°C w kilka minut i czas ok. 2 lat wzięte wprost ze źródła — bez modelu naprężeń (reguła progowa, nie obliczenie).",
  "POWLOKA-AR-CZYSZCZENIE": "Z czasem powłoka może się zabrudzić — myj panele delikatnie, unikaj ściernych środków czyszczących.",
  "POWLOKA-AR-ZAKRES-ZE-ZRODLA": "Wzrost uzysku {min}–{max}% to typowy zakres ze źródła — rzeczywisty zysk zależy od konkretnego szkła i powłoki, dlatego wynik jest przedziałem, nie jedną liczbą.",
  "TECHNOLOGIE-POWIERZCHNIA-MODULOW": "Powierzchnia samych modułów z definicji mocy znamionowej (1 kWp = 1000 W przy 1000 W/m², warunki STC) — bez odstępów montażowych i miejsca na serwis.",
  "TECHNOLOGIE-SPRAWNOSC-TO-POWIERZCHNIA": "Wyższa sprawność oznacza mniej m² na tę samą moc (kWp), a nie automatycznie więcej kWh z każdego kWp. Różnice uzysku na kWp wynikają m.in. ze współczynnika temperaturowego, pracy przy słabym świetle i degradacji — dlatego procenty uzysku ze źródła są pokazane jako dane do weryfikacji, nie jako obliczenie.",
  "REKOMENDACJA-MIKROINWERTERY": "Przy częściowym/regularnym zacienieniu wybierz mikroinwertery — każdy panel pracuje niezależnie od sąsiadów.",
  "REKOMENDACJA-INWERTER-CENTRALNY": "Bez regularnego zacienienia główna przewaga mikroinwerterów nie ma zastosowania — inwerter centralny jest tańszy.",
  "MIKROINWERTER-OFFGRID-SPRZEZENIE-AC": "Uwaga off-grid: typowy mikroinwerter to falownik sieciowy — nie wystartuje bez napięcia odniesienia. W instalacji wyspowej potrzebuje sprzężenia AC z falownikiem wyspowym, który tworzy sieć i ogranicza moc mikroinwerterów przy pełnym magazynie. Sprawdź u producenta, czy dany model obsługuje taką pracę.",
  "NADMORSKA-BRAK-IEC-61701": "Lokalizacja nadmorska: wybierz panele z certyfikatem IEC 61701 (odporność na mgłę solną) — sól koroduje ramki i połączenia.",
  "NADMORSKA-BRAK-RAMY-ANODOWANEJ": "Lokalizacja nadmorska: wybierz panele z ramą anodowaną.",
  "NADMORSKA-ZLACZKI-MC4": "Sól niszczy standardowe złączki MC4 — stosuj złączki dedykowane do warunków morskich.",
  "WARUNKI-BRAK-ANTY-PID": "Bliskość morza lub wysoka wilgotność podnosi ryzyko PID — wybierz panele z certyfikatem anty-PID.",
  "PYLISTA-RYSOWANIE-SZKLA": "Lokalizacja pylista: pył i piasek mogą rysować szkło paneli — zaplanuj częstsze czyszczenie.",
  "WARUNKI-SRODOWISKOWE-SPELNIONE": "Dobór paneli spełnia reguły źródła dla tej lokalizacji.",
  "KAT-PR-POZA-ZAKRESEM": "Współczynnik wydajności PR musi być większy od 0 i nie większy niż 1 (np. 0,8 = 80%).",
  "KAT-PRODUKCJA-WYMAGA-MOCY-I-PR": "Pokazuję nasłonecznienie paneli (kWh/m²). Żeby zobaczyć produkcję w kWh, wpisz moc instalacji i współczynnik wydajności PR.",
  "KAT-ZALOZENIE-TABELA-PVGIS": "Nasłonecznienie dla azymutu {azymut}° i albedo {albedo}, policzone dla każdego kąta 0–90° co 1° z godzinowych danych PVGIS (model Muneera, jak w Module 1).",
  "KAT-ZALOZENIE-ZAOKRAGLENIE": "Kąt zaokrąglony do najbliższego pełnego stopnia: {kat}°.",
  "KAT-ZALOZENIE-PR-UZYTKOWNIKA": "Produkcja = moc × nasłonecznienie / 1 kW/m² × PR, przy PR = {pr} wpisanym przez Ciebie — źródło nie podaje wartości PR.",
  "WZ-POZA-TYPOWYM-ZAKRESEM": "Dla Twojej lokalizacji i kątów wschód-zachód daje {stosunek}% energii południa — poza typowym zakresem {min}–{max}% podawanym w źródle. To nie błąd: wynik jest policzony z danych Twojej działki.",
  "WZ-ZALOZENIE-ODNIESIENIE": "Odniesienie: panele skierowane na południe (180°) pod najlepszym kątem stałym dla tej lokalizacji — {kat}°.",
  "WZ-ZALOZENIE-UDZIAL-MOCY": "Moc paneli: {wschod}% na wschodzie, {zachod}% na zachodzie — ta sama technologia paneli na obu połaciach (nasłonecznienie ważone mocą).",
  "ZS-WYSOKOSC-POZA-WZOREM-STREFY-3": "Wzór strefy 3 (PN-EN 1991-1-4, Tablica NA.1) działa tylko dla wysokości poniżej 20 000 m n.p.m. — sprawdź wpisaną wysokość.",
  "ZS-KAT-BEZ-DANYCH-WIATRU": "Dla kąta {kat}° norma PN-EN 1991-1-4 nie podaje współczynnika siły dla wiaty (Tablica 7.6 kończy się na 30°, dla pionu jest tylko 90°). Aplikacja nie zgaduje tej wartości — siła wiatru i balast nie są policzone.",
  "ZS-PION-SILA-POZIOMA": "Przy 90° wiatr pcha panel poziomo (współczynnik 1,80, PN-EN 1991-1-4, p. 7.4.3). Masa balastu zależy wtedy od tarcia o podłoże i od przewracania — norma tego nie podaje, więc aplikacja nie liczy kg balastu dla pionu. Przy pionie praktyczniejsze są słupki kotwiczące w gruncie.",
  "ZS-REKOMENDACJA-WYMAGA-WYCENY": "Żeby wskazać najlepszy kąt, wpisz moc paneli, współczynnik PR, cenę 1 kWh i liczbę lat. Aplikacja porównuje wtedy wartość energii z kosztem balastu dla każdego kąta. Bez tych danych widzisz wykresy i możesz sprawdzić dowolny kąt.",
  "ZS-OPTIMUM-ENERGII-POZA-ZAKRESEM-WIATRU": "Najwięcej energii daje kąt {kat}°, ale dla kątów powyżej 30° norma nie podaje siły wiatru na wiatę. Dlatego rekomendacja jest wybierana tylko spośród kątów 0–30°.",
  "ZS-ZALOZENIE-STELAZ-WIATA": "Stelaż traktowany jak wiata jednospadowa (PN-EN 1991-1-4, Tablica 7.6) — przyjęte w decyzji D26, to praktyka inżynierska, nie zapis normy.",
  "ZS-ZALOZENIE-CSCD": "Współczynnik konstrukcyjny cscd = {cscd} — norma dopuszcza go dla niskich, sztywnych konstrukcji (p. 6.2); dla stelaża to założenie.",
  "ZS-ZALOZENIE-CDIR-CSEASON": "Współczynnik kierunkowy i sezonowy = 1,0 (najbardziej niekorzystne; Tablica NA.2, NA.4) — bez znajomości kierunku wiatru względem stelaża.",
  "ZS-ZALOZENIE-KAT-POSREDNI": "Dla kąta między wierszami Tablicy 7.6 (co 5°) brana jest bardziej niekorzystna z dwóch sąsiednich wartości; zabudowa pod stelażem φ — interpolacja liniowa (p. 7.3 (3)).",
  "ZS-ZALOZENIE-BALAST-PIONOWO": "Cała siła wiatru traktowana jako odrywająca pionowo (zachowawczo), g = {g} m/s².",
  "NW-PREDKOSC-SZCZYTOWA": "Balast z tego ekranu ma sens tylko wtedy, gdy wpisana prędkość to najsilniejszy poryw wiatru dla Twojej lokalizacji. Dokładniej, według normy wiatrowej PN-EN 1991-1-4 (strefa, teren, wysokość, kąt), policzysz go na ekranach „Typ montażu” i „Złoty środek”.",
  "NW-BALAST-NIEWYSTARCZAJACY": "Za mały balast: planujesz {planowany} kg, a projektowo potrzeba co najmniej {wymagany} kg. Przy silnym wietrze stelaż może zostać oderwany — zwiększ balast albo zakotwicz stelaż w gruncie.",
  "ZS-ZALOZENIE-BALAST-EQU": "Balast projektowy: PN-EN 1990, wzór (6.7), Tablica A1.2(A) — γQ = {gammaQ} dla wiatru (oddziaływanie niekorzystne), γG,inf = {gammaG} dla balastu (oddziaływanie korzystne); załącznik krajowy NB bez zmian krajowych. Ciężar paneli i stelaża pominięty (po stronie bezpiecznej).",
  "ZS-BALAST-EQU-TYLKO-ODRYWANIE": "Balast policzony jako projektowy wg PN-EN 1990 (stan równowagi EQU): siła wiatru ×1,5, ciężar balastu liczony tylko w 90%. To zabezpiecza przed oderwaniem stelaża. Nie sprawdzono przesunięcia (wymaga współczynnika tarcia podłoża) ani przewrócenia (wymaga punktu przyłożenia siły) — rozmieszczenie balastu i mocowanie potwierdź u konstruktora.",
  "OC-TEMP-WEWN-NIE-WYZSZA": "Temperatura wewnątrz ({ti} °C) nie jest wyższa od temperatury obliczeniowej na zewnątrz ({te} °C) — sprawdź wpisane dane.",
  "OC-BEZ-PN-EN-12831": "To straty ciepła przez przegrody i przez wymianę powietrza — dokładnie tak, jak opisuje źródło. Nie ma w nich mostków cieplnych, dokładnego liczenia strat do gruntu, zysków od słońca i ludzi ani zapasu mocy na nagrzanie po przerwie z pełnej normy PN-EN 12831-1 (tej normy nie ma w aplikacji). Mostki cieplne zwiększają straty — przy doborze źródła ciepła zostaw zapas albo poproś projektanta o pełne obliczenie.",
  "OC-MIESIACE-ZE-SREDNICH": "Ciepło w miesiącach liczone ze średniej temperatury miesiąca. W miesiącach przejściowych (dni ciepłe i zimne na zmianę) wynik jest nieco zaniżony, a pominięcie zysków od słońca i ludzi go zawyża.",
  "OC-ZALOZENIE-TEMP-STREFY": "Temperatura obliczeniowa na zewnątrz dla strefy klimatycznej {strefa}: {te} °C (PN-82/B-02403, Tablica 1 — te same wartości podaje załącznik krajowy PN-EN 12831).",
  "OC-ZALOZENIE-DOBA-PRZY-TE": "Ciepło na dobę = moc strat × 24 h przy temperaturze obliczeniowej przez całą dobę (najzimniejszy dzień projektowy).",
  "OC-ZALOZENIE-STALA-TEMP-PRZYLEGLYCH": "Temperatura po drugiej stronie przegród przy gruncie i nieogrzewanych pomieszczeniach — stała, wpisana przez Ciebie, przez cały rok.",
  "OC-ZALOZENIE-COP": "Energia elektryczna = ciepło ÷ COP, COP = {cop} (grzałka, kocioł elektryczny: 1).",
  "COCWU-CWU-NIE-CIEPLEJSZA": "Temperatura ciepłej wody ({tCwu} °C) nie jest wyższa od temperatury zimnej wody ({tZimna} °C) — sprawdź wpisane dane.",
  "COCWU-BRAK-MIESIECY-CO": "Brak ciepła C.O. w miesiącach — na Ekranie 1 „Straty ciepła budynku” wpisz albo wstaw z PVGIS średnie temperatury miesięcy. Na razie pokazane jest tylko C.W.U.",
  "COCWU-CWU-BEZ-STRAT": "C.W.U. to tu samo podgrzanie wody. Straty zasobnika i cyrkulacji (ciepło uciekające, gdy woda stoi albo krąży w rurach) dochodzą do tego — liczy je osobny ekran „System C.W.U.”.",
  "COCWU-ZALOZENIE-LITRY": "Ciepła woda: {litry} l na osobę na dobę (źródło: ok. {zrodlo} l/osobę/dobę; Moduł 2 podaje zakres 50–70 l).",
  "COCWU-ZALOZENIE-STALA-TEMP-WODY": "Temperatura zimnej wody {tZimna} °C i ciepłej {tCwu} °C — stałe przez cały rok (w rzeczywistości woda z sieci lub studni jest zimą chłodniejsza).",
  "COCWU-ZALOZENIE-CO-Z-EKRANU-1": "C.O. na dobę = ciepło miesiąca z Ekranu 1 „Straty ciepła budynku” ÷ liczba dni miesiąca (średnia doba miesiąca, nie najzimniejsza).",
  "COCWU-ZALOZENIE-COP-CO": "Prąd na C.O. = ciepło ÷ COP, COP = {cop}.",
  "COCWU-ZALOZENIE-COP-CWU": "Prąd na C.W.U. = ciepło ÷ COP, COP = {cop} (grzałka elektryczna: 1).",
  "MT-NADPROZE-BEZ-IZOLACJI": "„{nazwa}”: niezaizolowane nadproże nad oknem to stały wyciek ciepła — przy dociepleniu obłóż je izolacją razem ze ścianą.",
  "MT-PSI-OD-UZYTKOWNIKA": "Część współczynników Ψ pochodzi od Ciebie — z katalogu mostków cieplnych, od projektanta albo z karty systemu. Aplikacja ich nie sprawdza (obliczenia wg PN-EN ISO 10211 są poza nią).",
  "MT-PSI-Z-TABLICY-A2": "Ψ z PN-EN ISO 14683, Tablica A.2 — wartości orientacyjne dobrane pod najgorszy przypadek (dokładność typowo 0–50 %, zwykle zawyżają stratę). Tylko do strat ciepła, nie do oceny kondensacji na powierzchni. Detal z projektu albo katalogu producenta daje dokładniejszy wynik.",
  "MT-NIEZNANY-KOD": "Kodu „{kod}” nie ma w Tablicy A.2 PN-EN ISO 14683 — wybierz detal z listy.",
  "MT-ZALOZENIE-TEMPERATURY": "Temperatury z Ekranu 1: wewnątrz {ti} °C, na zewnątrz {te} °C (obliczeniowa strefy) — wszystkie mostki między wnętrzem a powietrzem zewnętrznym.",
  "MT-ZALOZENIE-WYMIARY": "Ψ musi pasować do sposobu mierzenia powierzchni przegród na Ekranie 1: przy wymiarach zewnętrznych (jak w PN-EN 12831) Ψ narożników bywa ujemne. Ψ policzone dla wymiarów wewnętrznych daje przy wymiarach zewnętrznych stratę zawyżoną.",
  "MT-ZALOZENIE-SYSTEM-E": "Ψ z Tablicy A.2 dla wymiarów zewnętrznych (Ψe) — powierzchnie przegród na Ekranie 1 muszą być mierzone po zewnętrznym obrysie budynku.",
  "MT-ZALOZENIE-SYSTEM-OI": "Ψ z Tablicy A.2 dla całkowitych wymiarów wewnętrznych (Ψoi) — powierzchnie przegród na Ekranie 1 mierzone po wewnętrznych powierzchniach ścian zewnętrznych, łącznie z grubością ścian działowych.",
  "MT-ZALOZENIE-SYSTEM-I": "Ψ z Tablicy A.2 dla wymiarów wewnętrznych (Ψi) — powierzchnie przegród na Ekranie 1 mierzone w świetle każdego pomieszczenia, bez grubości ścian działowych.",
  "CRL-SKUTKI-KRYTYCZNE": "Przepięcie zagrażałoby życiu (np. systemy podtrzymania życia, sprzęt medyczny), usługom publicznym, działalności gospodarczej (także gospodarstwu rolnemu) albo wielu osobom — wtedy ochrona przed przepięciami przejściowymi jest obowiązkowa bez liczenia ryzyka (HD 60364-4-443, 443.4).",
  "CRL-SPD-WYMAGANY": "CRL = {crl} — poniżej 1000, więc ochrona przed przepięciami pochodzenia atmosferycznego jest wymagana (HD 60364-4-443, 443.5).",
  "CRL-BRAK-LINII": "Brak linii zasilających (typowy off-grid) — metoda CRL nie daje wymogu SPD od strony sieci. To nie znaczy, że instalacja jest chroniona: pozostaje strona DC paneli i przepięcia łączeniowe.",
  "CRL-PRZEPIECIA-LACZENIOWE": "Instalacja z własnym źródłem (falownik, agregat), magazynem energii lub silnikami — norma każe rozważyć ochronę przed przepięciami łączeniowymi niezależnie od CRL (443.4).",
  "CRL-STRONA-DC-POZA": "CRL dotyczy linii, które zasilają instalację. Ochrona strony DC generatora PV to osobne wymagania HD 60364-7-712 — ten wynik ich nie obejmuje.",
  "CRL-ZALOZENIE-F": "Współczynnik F = {f} (Tablica 443.1: „dla wszystkich instalacji”; krajowy wybór 1–3 dla mieszkań nie jest znany aplikacji).",
  "CRL-ZALOZENIE-NIEZNANE-DLUGOSCI": "Część długości sieci nieznana — brakujące {reszta} km przyjęte jako linia napowietrzna nn, jak każe 443.5 (najbardziej niekorzystnie).",
  "CRL-ZALOZENIE-OBCIECIE": "Liczone tylko pierwsze {limit} km sieci (1 km albo do pierwszego SPD w sieci). Norma nie mówi, które odcinki odciąć — aplikacja zostawia najpierw te o największej wadze (wynik ostrożny).",
  "CRL-ZALOZENIE-NG-Z-TD": "Gęstość wyładowań z dni burzowych: Ng = 0,1 · Td (HD 60364-4-443, 443.5 Uwaga 2).",
  "ZS-ZALOZENIE-CENA-BALASTU": "Cena balastu {cena} zł/kg — podpowiedź 1 zł/kg to wartość właściciela projektu dla bloczków odlewanych samodzielnie (nie ze źródła ani normy); możesz wpisać swoją.",
  "ZS-ZALOZENIE-SNIEG-MU1": "Śnieg: współczynnik kształtu μ1 z PN-EN 1991-1-3, Tablica 5.2 — obowiązuje, gdy nic nie blokuje zsuwania się śniegu z dolnej krawędzi paneli.",
  "LP-SEZON-BEZ-MIESIECY": "Wpisałeś dodatkowe zapotrzebowanie zimą — zaznacz też, w których miesiącach grzejesz, żeby aplikacja wiedziała, kiedy je doliczyć.",
  "LP-LIMIT-ZA-MALY-NAWET-LATO": "Nawet samo lato (czerwiec–sierpień) wymaga {n} paneli, a możesz zamontować {limit}. Zmniejsz zużycie, zwiększ miejsce na panele albo zaplanuj stałe drugie źródło energii.",
  "LP-DEFICYT-POZA-OKRESEM": "Przy {n} panelach w chłodnych miesiącach zabraknie łącznie ok. {kwh} kWh w roku. Tę energię trzeba pokryć innym źródłem: agregatem, kotłem albo ogrzewaniem paliwowym (grzejnik powietrzny na olej napędowy pobiera mało prądu) — albo ograniczyć zużycie zimą.",
  "LP-OKRES-BEZ-PRODUKCJI": "W jednym z miesięcy okresu (miesiące {od}–{do}) panele przy tym ustawieniu nic nie wyprodukują — tego okresu nie da się pokryć żadną liczbą paneli.",
  "LP-ZALOZENIE-DNI-KALENDARZ": "Zapotrzebowanie miesięczne = dobowe × liczba dni miesiąca w roku nieprzestępnym (typowy rok PVGIS ma 365 dni).",
  "LP-ZALOZENIE-KAT-STALY": "Panele na stałym kącie {kat}° przez cały rok.",
  "LP-ZALOZENIE-STELAZ-REGULOWANY": "Stelaż regulowany: w każdym miesiącu panele ustawione na najlepszy kąt tego miesiąca (decyzja D26) — wymaga ręcznego przestawiania.",
  "LP-ZALOZENIE-LIMIT": "Limit montażowy {limit} szt. — podpowiedź 30 szt. to praktyczny pułap wskazany przez właściciela projektu, nie wartość z normy; wpisz, ile paneli realnie zmieścisz.",
  "TVS-LICZBA-NIECALKOWITA": "{label} musi być liczbą całkowitą — nie da się zamontować części panelu.",
  "TVS-NAPOR-WIATRU-TRACKERA": "Tracker łapie dużo większy napór wiatru niż stały stelaż i potrzebuje solidniejszego fundamentu. Źródło nie podaje wzoru na napór trackera, więc aplikacja go nie liczy — fundament trackera skonsultuj z konstruktorem. Napór i balast stałego stelaża policzysz na ekranie „Złoty środek”.",
  "TVS-ZERO-DODATKOWYCH-PANELI": "Za cenę trackera nie dokupisz ani jednego panelu — przy tych cenach porównanie wypada na korzyść trackera tylko dlatego, że jest tańszy niż jeden panel. Sprawdź, czy koszt trackera obejmuje mechanizm i fundament.",
  "TVS-ZYSK-TRACKERA-ZAKRES": "Tracker zwiększa uzysk o {min}–{max}% (zakres ze źródła). Rzeczywisty zysk zależy od typu trackera i lokalizacji, dlatego uzysk trackera jest pokazany dla obu granic.",
  "TVS-DOKUPIENIE-W-DOL": "Liczba dodatkowych paneli zaokrąglona w dół — za resztę pieniędzy nie kupisz całego panelu.",
  "TVS-UZYSK-PANELU-STALY": "Każdy panel na stałym stelażu daje ten sam roczny uzysk — dodatkowe panele stoją pod tym samym kątem i bez zacienienia.",
  "TM-ZASPA-ZACIENIA-DOLNE-OGNIWA": "Trawa lub zaspa ({przeszkodaCm} cm) sięga wyżej niż dolna krawędź paneli ({krawedzCm} cm) — dolne ogniwa będą w cieniu. Przez diody bocznikujące cień jednego rzędu ogniw może wyłączyć całą sekcję panelu. Podnieś panele albo koś/odśnieżaj pod nimi.",
  "TM-SNIEG-ZALEGA": "Przy kącie {kat}° (poniżej {prog}°) rośnie ryzyko zalegania śniegu na panelach — zimą mogą nie produkować, dopóki śnieg sam nie zsunie się albo go nie zgarniesz.",
  "TM-SSANIE-OD-SPODU": "Kąt {kat}° (od {prog}° wzwyż): siła ssania od spodu może zerwać panele — skonsultuj z konstruktorem mocowanie i fundament.",
  "TM-DACH-POZA-MODELEM-WIATY": "Stelaż na dachu płaskim: aplikacja liczy wiatr jak dla wiaty wolnostojącej. Nad dachem budynku, zwłaszcza przy krawędziach i narożnikach, wiatr działa inaczej — tego ekran nie liczy. Nie sprawdza też, czy dach uniesie balast. Oba punkty potwierdź u konstruktora.",
  "TM-WIATA-KAT-PONIZEJ-SAMOOCZYSZCZANIA": "Kąt {kat}° jest poniżej minimum {min}–{max}° potrzebnego do samooczyszczania — deszcz nie spłucze kurzu i liści, a woda może stać przy dolnej ramce. Zwiększ spadek wiaty albo planuj regularne mycie.",
  "TM-WIATA-KAT-W-ZAKRESIE": "Kąt {kat}° mieści się w zakresie {min}–{max}° podanym jako minimum dla samooczyszczania. Źródło nie precyzuje, który koniec zakresu wystarcza — bliżej {max}° jest pewniej.",
  "TM-WIATA-ZERO-PANELI": "Panel nie mieści się na połaci w żadnym ułożeniu — sprawdź wymiary wiaty i panelu.",
  "TM-POWIERZCHNIA-NIEZNANA": "Powierzchni „{nazwa}” nie ma w ostatniej ocenie z Modułu 1 — oceń powierzchnie ponownie.",
  "TM-ZAKRES-REGULACJI-ODWROCONY": "Najmniejszy kąt regulacji ({min}°) jest większy od największego ({max}°) — zamień wartości.",
  "TM-MIESIACE-BEZ-DANYCH-WIATRU": "W {liczba} mies. stelaż stoi pod kątem ponad 30°, a dla takich kątów norma PN-EN 1991-1-4 nie podaje siły wiatru na wiatę. Balast dla tych ustawień jest nieznany — podany balast wymagany dotyczy tylko ustawień do 30°. Ogranicz regulację do 30° albo skonsultuj stelaż z konstruktorem.",
  "TM-ZALOZENIE-PION-VS-OPTIMUM": "Pion porównany z najlepszym stałym kątem przy tym samym azymucie ({kat}°), wyznaczonym z danych PVGIS — nie z przyjętym z góry kątem dachu.",
  "TM-ZALOZENIE-NAPROMIENIOWANIE": "Porównanie nasłonecznienia płaszczyzny (kWh/m²). Temperatura ogniw i odbicia przy dużych kątach padania nie są uwzględnione.",
  "TM-ZALOZENIE-ZE": "Wysokość odniesienia wiatru ze = {ze} m — dolna krawędź paneli nad terenem plus podniesienie h (PN-EN 1991-1-4, p. 7.3 (8)).",
  "TM-ZALOZENIE-PROG-SSANIA": "Źródło ostrzega o ssaniu od spodu „przy kącie ~45°” — przyjęto próg {prog}°.",
  "TM-ZALOZENIE-OCENA-M1": "Nasłonecznienie i wskaźnik % każdej powierzchni — z oceny w Module 1, Ekran 4 (dane PVGIS, zacienienie ze Skanera dla połaci).",
  "TM-ZALOZENIE-WYMIARY-POLACI": "Wymiary wiaty to wymiary połaci w płaszczyźnie dachu (wzdłuż spadku), nie rzut z góry.",
  "TM-ZALOZENIE-UKLAD-DWUBLOKOWY": "Sprawdzane układy: wszystkie panele w jednej orientacji albo połać podzielona raz na dwie części z różną orientacją. Przy nietypowych wymiarach może istnieć układ z jeszcze jednym panelem.",
  "TM-ZALOZENIE-BEZ-SZCZELIN": "Panele ułożone bez odstępów. Jeśli klemy lub profile wymagają szczelin albo marginesu od krawędzi, odejmij je od wymiarów wiaty.",
  "TM-ZALOZENIE-REGULACJA-CO-MIESIAC": "Kąt przestawiany raz w miesiącu na najlepszy dla tego miesiąca, w zakresie regulacji stelaża {min}–{max}°.",
  "TM-ZALOZENIE-OS-NA-DOLNEJ-KRAWEDZI": "Stelaż obraca się na dolnej krawędzi — jej wysokość nad terenem nie zmienia się, a górna krawędź podnosi się o h = L × sin(kąt). Przy innej osi obrotu wysokości będą inne.",
  "KO-INWESTYCJA-I-PALIWO": "Koszt inwestycji to jedno, koszt paliwa to drugie. Sprawdź oba — ranking liczy je razem w całym okresie analizy.",
  "KO-ZRODLO-NIEKOMPLETNE": "„{nazwa}” — brakuje danych, więc to źródło nie jest w rankingu. Uzupełnij puste pola w jego karcie.",
  "KO-PALIWO-STALE-BEZPIECZENSTWO": "„{nazwa}” — paliwo stałe: czujnik CO, odległość od materiałów palnych i nawiew powietrza do spalania sprawdź na ekranie „Bezpieczeństwo pożarowe — dogrzewanie paliwem stałym”.",
  "KO-DREWNO-PRACA": "„{nazwa}” — koszt drewna nie obejmuje Twojej pracy: rąbania, suszenia, noszenia i palenia.",
  "KO-NAGRZEWNICA-SPALINY": "„{nazwa}” — nagrzewnica paliwowa wytwarza spaliny z tlenkiem węgla. Wydech musi szczelnie wychodzić na zewnątrz, w pomieszczeniu potrzebny jest czujnik CO. Urządzenia tego typu są projektowane głównie do pojazdów — montaż w budynku mieszkalnym skonsultuj z kominiarzem.",
  "KO-OLEJ-GESTNIEJE": "„{nazwa}” — olej napędowy gęstnieje na mrozie (źródło: przy {temperatura}°C może uniemożliwić rozruch). Zimą stosuj paliwo arktyczne i trzymaj zbiornik w cieple.",
  "KO-PRAD-OFFGRID": "„{nazwa}” — grzejesz prądem. W off-gridzie zimą panele dają najmniej energii, więc ten prąd pochodzi głównie z baterii albo agregatu. Ile brakuje zimą, pokazuje ekran „Ile paneli potrzebujesz”.",
  "KO-SPRAWNOSC-POWYZEJ-100": "„{nazwa}” — sprawność {sprawnosc}% jest możliwa tylko względem wartości opałowej, w kotle kondensacyjnym. Sprawdź, do jakiej wartości opałowej odnosi się sprawność z karty.",
  "KO-ZALOZENIE-WPIS-UZYTKOWNIKA": "Wartości opałowe, sprawności, ceny, COP i dane z kart katalogowych — wpisane przez Ciebie. Źródło aplikacji ich nie podaje.",
  "KO-ZALOZENIE-OKRES": "Okres analizy: {lata} lat (źródło proponuje ranking w skali {zrodlo} lat).",
  "KO-ZALOZENIE-CENY-STALE": "Ceny paliw i prądu stałe przez cały okres — bez inflacji i zmian taryf.",
  "KO-ZALOZENIE-ZWROT": "Zwrot liczony względem źródła najtańszego w zakupie: „{nazwa}”.",
  "KO-ZALOZENIE-COP-OPOROWE": "Grzałka, kocioł elektryczny i promienniki podczerwieni: COP = 1 — cały prąd zamienia się w ciepło (źródło: kocioł elektryczny „COP=1”).",
  "KO-ZALOZENIE-GODZINY-NOMINALNE": "Godziny pracy i prąd urządzeń paliwowych policzone przy mocy nominalnej (ciepło ÷ moc). Przy pracy na niższej mocy godzin i prądu pomocniczego będzie więcej.",
  "PROGNOZY-ZALOZENIE-DANE-DEMO": "Dane demonstracyjne — docelowo ekran czerpie z silnika symulacji rocznej i prognozy pogody live.",
  "PROGNOZY-ZALOZENIE-PROBKOWANIE-3H": "Suma liczona po dostępnych punktach próbkowania (co 3h), nie pełnej krzywej godzinowej — orientacyjnie, nie jako projekt wykonawczy.",
  "PROTOKOL-NIEZNANY": "Co najmniej jedno z urządzeń ma nieznany/niesklasyfikowany protokół — sprawdź dokumentację obu urządzeń, zgodności nie da się ocenić automatycznie.",
  "PORTECH-POJEMNOSC-NIEDODATNIA": "Wartość pola \"planowana pojemność\" musi być większa od zera.",
  "PORTECH-ZALOZENIE-BASELINE": "Pojemność nie podana — porównanie liczone dla {pojemnosc} kWh (baseline \"na 1 kWh\").",
  "PORTECH-ZALOZENIE-SRODEK-CYKLI": "Dla technologii, gdzie źródło podaje przedział cykli, użyto środka przedziału jako wartości reprezentatywnej.",
  "AUDYT-ZALOZENIE-DANE-DEMO": "Dane demonstracyjne (SAMPLE_AUDIT_ITEMS) — docelowo ekran czerpie na żywo z Modułów 8/9/13.",
  "KROK-POZA-KOLEJNOSCIA-ROZRUCH": "Zaznaczono krok poza kolejnością — potwierdź wcześniejsze kroki najpierw, zła kolejność rozruchu może uszkodzić sprzęt.",
  "KABLE-OLOW-ZALOZENIE-ECHO-M5": "Dobór kabla i bezpiecznika liczony przez echo tych samych kalkulatorów co Moduł 5 (Ekran 1 i Ekran 6) — chemia baterii (kwasowa) nie wchodzi do wzoru, tylko wartości wejściowe.",
  "OPD-ZALOZENIE-BRAK-TABELI-IP": "Lista wymaganych stopni IP wg miejsca montażu (z treści źródłowej) NIE zbudowana — źródło nie podaje tabeli miejsce→IP dla tego ekranu.",
  "OZNAKOWANIE-ZALOZENIE-KOLORY-ZYL": "Kolorystyka żył (np. żółto-zielony PE, niebieski N) NIE jest tu podana — normuje ją IEC 60446, nie PN-EN 60445 (ta norma daje tylko kody alfanumeryczne/graficzne z Tabeli 1).",
  "PUSZKI-ZALOZENIE-BRAK-LISTY-Z-TRAS": "Automatyczna lista punktów połączeniowych z tras (Ekran 19) NIE zbudowana — Ekran 19 nie ma modelu danych tras, nie ma skąd wygenerować listy bez wymyślania struktury.",
  "SZYNY-ZALOZENIE-BRAK-DOBORU-PRZEKROJU": "Dobór przekroju szyny wg wytrzymałości zwarciowej (górna sekcja D źródła) NIE zbudowany — źródło nie podaje wzoru/tabeli.",
  "KAT-ZAKRES-PRZEJSCIOWY": "Dla tego zakresu kąta źródło nie podaje jednoznacznej klasyfikacji.",
  "IZOL-GRUBOSC-NIE-ZWRACA-SIE": "{nazwa} {grubosc} cm: dodatkowe centymetry względem cieńszego wariantu kosztują {krancowy} zł za zaoszczędzoną kWh — więcej niż cena ciepła {cena} zł/kWh. Przy zbyt grubej izolacji koszt dodatkowego centymetra przestaje się zwracać.",
  "IZOL-BRAK-SEZONU-GRZEWCZEGO": "Żaden miesiąc nie jest chłodniejszy niż temperatura w domu — w tym modelu nie ma sezonu grzewczego, więc izolacja nic nie oszczędza. Sprawdź temperatury miesięcy na Ekranie 1.",
  "IZOL-ZALOZENIE-WARSTWA-SZEREGOWA": "U po dociepleniu = 1/(1/U + d/λ): nowa warstwa dokłada swój opór do obecnej przegrody (opory przejmowania ciepła są już w obecnym U). Bez łączników mechanicznych, szczelin i mostków na styku warstw — rzeczywiste U będzie nieco wyższe.",
  "IZOL-ZALOZENIE-10-LAT": "Opłacalność liczona na {lata} lat (horyzont ze źródła): koszt izolacji ÷ ciepło zaoszczędzone w tym czasie, bez zmiany cen i bez dyskontowania.",
  "IZOL-ZALOZENIE-CIEPLO-NIE-PRAD": "Oszczędność to ciepło (kWh ciepła), liczone z tych samych średnich miesięcznych co Ekran 1. Prąd zaoszczędzony przez pompę ciepła = ciepło ÷ COP.",
  "DBS-ZALOZENIE-BEZ-DOLADOWANIA": "Akumulator na starcie w pełni naładowany i przez cały ten czas bez żadnego doładowania (panel, alternator, sieć) — każdy słoneczny dzień wydłuża wynik.",
  "DBS-ZALOZENIE-BEZ-KOREKTY-TEMPERATURY": "Bez korekty na temperaturę — w mrozie akumulator oddaje mniej energii niż na tabliczce, więc zimą wynik będzie niższy (patrz Moduł 4: praca baterii w mrozie).",
  "LVD-BRAK-OCHRONY-OLOWIOWY": "Akumulator kwasowy/AGM bez dozownika napięcia, a odbiornik nie ma własnego zabezpieczenia — odbiornik rozładuje akumulator do zera. Głębokie rozładowanie trwale niszczy akumulator ołowiowy (zasiarczenie). Zamontuj dozownik (LVD) z progiem podanym wyżej.",
  "LVD-PROG-KWASOWY-BRAK-W-ZRODLE": "Dla akumulatora kwasowego (zalewowego) nie podajemy progu — źródło daje go tylko dla AGM i LiFePO4. Sprawdź napięcie odcięcia w karcie producenta akumulatora.",
  "LVD-ZALOZENIE-SKALOWANIE-SZEREGOWE": "Próg dla 12 V ze źródła przeliczony na ogniwo i pomnożony ×{krotnosc} — akumulator o wyższym napięciu to ogniwa połączone szeregowo.",
  "LVD-ZALOZENIE-SPOJNE-Z-M4-E31": "LiFePO4: 2,75 V na ogniwo — ten sam punkt co w Module 4 (napięcie odcięcia a żywotność): ok. 80% DoD i ok. 5000 cykli.",
  "U12-TOLERANCJA-POZA-ZAKRESEM": "Tolerancja napięcia urządzenia musi być z przedziału 0–99%.",
  "U12-PRZEPIECIE-PRZY-LADOWANIU": "Przy ładowaniu akumulator ma do {aku} V, a urządzenie znosi najwyżej {urzadzenie} V — wprost na akumulatorze może zostać uszkodzone. Zasil je przez stabilizator lub przetwornicę DC-DC.",
  "U12-ZA-NISKIE-PRZY-ROZLADOWANIU": "Rozładowany akumulator ma ok. {aku} V, a urządzenie potrzebuje co najmniej {urzadzenie} V — pod koniec rozładowania może się wyłączać lub działać niestabilnie.",
  "U12-PRZEZ-STABILIZATOR": "Zasilanie przez stabilizator: sprawdź w jego karcie, że zakres wejścia obejmuje {min}–{max} V (cały zakres pracy akumulatora).",
  "U12-ZALOZENIE-ZAKRES-AKU": "Realne napięcie akumulatora 12 V: od 11 V (rozładowany) do 14,5 V (ładowanie) — nie stałe 12 V z etykiety.",
  "U12-ZALOZENIE-24V-SZEREGOWO": "Instalacja 24 V to dwa akumulatory 12 V w szeregu — zakres napięcia ×2 (22–29 V).",
  "POJC-ZALACZNIK-A-PRZYBLIZENIE": "Pojemność liczona metodą uproszczoną EN ISO 13786, Załącznik A (grubość efektywna dla wahań dobowych). To przybliżenie: rzeczywista warstwa czynna to 40–120 % przyjętej, a dla drewna i betonu komórkowego metoda może pojemność zawyżać. Nie planuj ochrony przed mrozem na styk z tym czasem.",
  "POJC-ELEMENT-CIENSZY-NIZ-WARSTWA": "„{nazwa}”: grubość całej przegrody ({element} cm) nie może być mniejsza niż grubość warstwy masywnej ({warstwa} cm).",
  "POJC-GRANICA-NIEOSIAGALNA": "Bez ogrzewania dom ustali się na ok. {rownowaga} °C — w tym modelu nie spadnie do {granica} °C.",
  "POJC-BRAK-WYCHLADZANIA": "Temperatura początkowa {start} °C nie jest wyższa niż temperatura, do której dąży dom bez ogrzewania (ok. {rownowaga} °C) — w tych warunkach dom się nie wychładza.",
  "POJC-GRANICA-NIE-NIZSZA": "Temperatura graniczna {granica} °C musi być niższa niż temperatura początkowa {start} °C.",
  "POJC-ZALOZENIE-JEDEN-WEZEL": "Cały dom jako jeden węzeł o jednej temperaturze: wychładzanie wykładnicze θ(t) = θ∞ + (θ0 − θ∞)·e^(−t/τ), τ = C/H. Pomieszczenia przy ścianach zewnętrznych wychłodzą się szybciej niż środek domu.",
  "POJC-ZALOZENIE-BEZ-ZYSKOW": "Bez zysków od słońca, ludzi i urządzeń — w dzień realny spadek będzie wolniejszy, w nocy zbliżony do wyniku.",
  "POJC-ZALOZENIE-STALA-TEMP-ZEWN": "Temperatura na zewnątrz i w strefach nieogrzewanych stała przez cały czas awarii; straty H z Ekranu 1 (przenikanie + wentylacja).",
  "POJC-ZALOZENIE-ZALACZNIK-A": "Ciepło przy wychładzaniu oddaje tylko warstwa przy powierzchni: grubość czynna = najmniejsza z: połowa grubości przegrody, grubość materiału do pierwszej warstwy izolacji, {dMax} mm (EN ISO 13786, Tablica A.1, okres 1 doby). Ściany wewnątrz domu pracują obiema stronami. Uwzględniony opór przejmowania ciepła {rsi} m²·K/W (wzór A.4). Pełna masa przegród podana osobno — pracuje dopiero przy wychładzaniu trwającym wiele dni.",
} as const

export type KluczTlumaczenia = keyof typeof dictionaryPl
