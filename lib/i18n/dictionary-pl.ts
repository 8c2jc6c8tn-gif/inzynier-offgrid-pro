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
  "SNIEG-NORMOWE-PRZEKRACZA-NOSNOSC": "Obciążenie śniegiem wg normy ({s} kN/m²) przekracza nośność dachu ({nosnosc} kN/m²). Taki dach może nie przenieść śniegu, który w tej strefie spada statystycznie raz na 50 lat. Zleć sprawdzenie konstrukcji konstruktorowi, zanim dołożysz na dach panele.",
  "SNIEG-AKTUALNE-PRZEKRACZA-NOSNOSC": "Zmierzona warstwa śniegu waży do {q} kN/m² — więcej niż nośność dachu ({nosnosc} kN/m²). Odśnież dach teraz, bezpiecznie: z ziemi lub z asekuracją, nigdy stojąc na przeciążonej połaci.",
  "SNIEG-NORMOWE-ZBLIZA-SIE-DO-NOSNOSCI": "Obciążenie śniegiem wg normy ({s} kN/m²) to {pct}% nośności dachu ({nosnosc} kN/m²) — zbliżasz się do granicy. Mały zapas nie wybacza błędów: sprawdź z konstruktorem, czy podana nośność to wartość obliczeniowa, i nie dokładaj na dach ciężaru bez tej odpowiedzi. Próg 80% to ustalenie tej aplikacji, nie wymóg normy.",
  "SNIEG-AKTUALNE-ZBLIZA-SIE-DO-NOSNOSCI": "Zmierzona warstwa śniegu waży do {q} kN/m², czyli {pct}% nośności dachu ({nosnosc} kN/m²) — zbliżasz się do granicy. Zaplanuj odśnieżanie przed kolejnym opadem lub odwilżą (mokry śnieg jest cięższy), bezpiecznie: z ziemi lub z asekuracją. Próg 80% to ustalenie tej aplikacji, nie wymóg normy.",
  "SNIEG-BRAK-NOSNOSCI": "Nie podano nośności dachu — pokazujemy samo obciążenie, bez oceny, czy dach je przeniesie. Nośność (obciążenie śniegiem przyjęte w projekcie) znajdziesz w projekcie budowlanym albo uzyskasz od konstruktora.",
  "SNIEG-POMIAR-BEZ-RODZAJU": "Podano grubość warstwy, ale nie rodzaj śniegu — bez niego nie wiadomo, ile waży metr sześcienny (świeży jest cztery razy lżejszy od mokrego). Wybierz rodzaj śniegu.",
  "SNIEG-NAWISY-NB1-12": "Powyżej {prog} m n.p.m. i w całej strefie {strefa} norma zaleca uwzględnić nawisy śnieżne na krawędzi dachu (PN-EN 1991-1-3, 6.3 i NB1.12). Ten ekran ich nie liczy — to obciążenie miejscowe dla okapu i rynny.",
  "SNIEG-ZALOZENIE-WARTOSC-CHARAKTERYSTYCZNA": "Wartości charakterystyczne (bez współczynnika bezpieczeństwa γ = 1,5 z PN-EN 1990). Nośność wpisz też jako wartość charakterystyczną — porównujemy „to samo z tym samym”.",
  "SNIEG-ZALOZENIE-DACH-JEDNO-DWUPOLACIOWY": "Dach jedno- lub dwupołaciowy, obciążenie równomierne (PN-EN 1991-1-3, 5.3.2–5.3.3, Tablica 5.2). Poza zakresem: dachy wielopołaciowe z koszami, walcowe, zaspy przy wyższej ścianie i wyjątkowe zaspy (NB1.5).",
  "SNIEG-ZALOZENIE-CT": "Współczynnik termiczny Ct = {ct} (PN-EN 1991-1-3, 5.2(8)). Mniejsza wartość dla słabo ocieplonych dachów (wzór NB.1) nie jest tu liczona — norma każe ją „starannie rozważyć”.",
  "SNIEG-ZALOZENIE-GRANICA-STREF": "Strefę bierzesz z mapy NB.1. W pasie 10 km po obu stronach granicy stref norma pozwala przyjąć średnią z dwóch sąsiednich (NB1.7) — tu liczymy dla jednej wybranej strefy.",
  "SNIEG-ZALOZENIE-MU-MIN-BARIERKI": "Barierki przeciwśnieżne lub attyka zatrzymują śnieg — współczynnik kształtu podniesiony do {mu} (PN-EN 1991-1-3, uwaga pod Tablicą 5.2).",
  "SNIEG-ZALOZENIE-POMIAR-NA-DACHU": "Grubość zmierzona na dachu, ciężar objętościowy śniegu z PN-EN 1991-1-3, Tablica E.1. Deszcz na śnieg i przymarzanie zwiększają ciężar ponad tablicę (5.2(6)) — lód na dachu licz osobno.",
  "SNIEG-ZALOZENIE-GAMMA-GORNA": "Stary śnieg: norma podaje zakres {min}–{max} kN/m³. Z nośnością porównujemy górną wartość (bezpieczniej).",
  "MROZ-PVC-PONIZEJ-PROGU": "PVC przy {temp}°C: poniżej jego progu {prog}°C sztywnieje i pęka — izolacja kabla lub złączka traci szczelność, wchodzi wilgoć. Wymień na XLPE albo gumę w tym miejscu.",
  "MROZ-XLPE-PONIZEJ-PROGU": "XLPE przy {temp}°C: poniżej {prog}°C — poza zakresem, który podaje źródło. Sprawdź w karcie producenta kabla najniższą temperaturę pracy.",
  "MROZ-GUMA-BEZ-PROGU": "Guma zachowuje elastyczność na mrozie — źródło nie podaje progu liczbowego. Najniższą temperaturę pracy sprawdź w karcie producenta.",
  "MROZ-ALUMINIUM-KURCZENIE": "Aluminium kurczy się na mrozie i może poluzować połączenia. Po pierwszej zimie sprawdź dokręcenie zacisków aluminiowych momentem z karty producenta.",
  "MROZ-ZALOZENIE-PROGI-OGOLNE": "Progi materiałowe ogólne ze źródła (PVC −10°C, XLPE −40°C). Karta producenta konkretnego kabla lub złączki ma pierwszeństwo — często podaje osobno temperaturę układania (zginania) i pracy w stanie ułożonym.",
  "ELEKTRONIKA-BMS-PONIZEJ-MIN": "{nazwa}: minimalna temperatura pracy {min}°C, a w miejscu montażu do {temp}°C — BMS może nie wystartować, a bez BMS bateria nie ruszy. Przenieś BMS (lub całą baterię) do cieplejszego miejsca albo zapewnij ogrzewanie.",
  "ELEKTRONIKA-PONIZEJ-MIN-WYSWIETLACZ": "{nazwa}: minimum {min}°C, w miejscu do {temp}°C — wyświetlacz LCD zwalnia lub gaśnie. Odczyt może być niedostępny w najzimniejsze dni.",
  "ELEKTRONIKA-PONIZEJ-MIN-CZUJNIK": "{nazwa}: minimum {min}°C, w miejscu do {temp}°C — czujnik może dawać błędne odczyty, a automatyka podejmie decyzje na złych danych.",
  "ELEKTRONIKA-PONIZEJ-MIN-PRZETWORNICA": "{nazwa}: minimum {min}°C, w miejscu do {temp}°C — przetwornica traci sprawność i może nie wystartować, a falownik, który nie wystartuje, to brak zasilania 230 V w całym domu. Przenieś ją w cieplejsze miejsce albo dobierz model na niższą temperaturę.",
  "ELEKTRONIKA-PONIZEJ-MIN-REGULATOR": "{nazwa}: minimum {min}°C, w miejscu do {temp}°C — regulator ładowania może nie ładować baterii, dopóki się nie ogrzeje. Zasilanie z baterii trwa, ale w krótkie zimowe dni tracisz część produkcji. Przenieś go w cieplejsze miejsce albo dobierz model na niższą temperaturę.",
  "ELEKTRONIKA-PONIZEJ-MIN-INNE": "{nazwa}: minimum {min}°C, w miejscu do {temp}°C — urządzenie pracuje poza zakresem z karty katalogowej. Przenieś je w cieplejsze miejsce albo dobierz wersję na niższą temperaturę.",
  "ELEKTRONIKA-BRAK-MIN-TEMP": "{nazwa}: brak minimalnej temperatury pracy — nie da się ocenić. Znajdziesz ją w karcie katalogowej („operating temperature”).",
  "ELEKTRONIKA-ZALOZENIE-TEMP-MIEJSCA": "Jedna temperatura dla wszystkich urządzeń — najniższa w miejscu montażu. Jeśli urządzenia stoją w różnych miejscach (garaż, piwnica), sprawdź każde miejsce osobno.",
  "POMPY-PONIZEJ-MIN-POMPA": "{nazwa}: minimum {min}°C, w miejscu do {temp}°C — olej gęstnieje, uszczelki sztywnieją, pompa może się zablokować. Zastosuj pompę z uszczelnieniem mrozoodpornym albo przenieś ją do ogrzewanej strefy.",
  "POMPY-PONIZEJ-MIN-ZAWOR": "{nazwa}: minimum {min}°C, w miejscu do {temp}°C — zawór może zamarznąć albo stracić szczelność. Opróżnij go przed zimą lub zaizoluj i dogrzej.",
  "POMPY-PONIZEJ-MIN-SILOWNIK": "{nazwa}: minimum {min}°C, w miejscu do {temp}°C — uszczelki sztywnieją, siłownik może nie domknąć albo nie otworzyć zaworu.",
  "POMPY-PONIZEJ-MIN-INNE": "{nazwa}: minimum {min}°C, w miejscu do {temp}°C — element pracuje poza zakresem z karty katalogowej. Przenieś go w cieplejsze miejsce albo dobierz wersję na niższą temperaturę.",
  "POMPY-ZAWOR-ZEWNETRZNY": "Zawór zewnętrzny do wody ogrodowej musi być opróżniony przed zimą — woda w nim zamarznie i rozsadzi zawór lub rurę.",
  "POMPY-BRAK-MIN-TEMP": "{nazwa}: brak minimalnej temperatury pracy — nie da się ocenić. Znajdziesz ją w karcie katalogowej („operating temperature”).",
  "POMPY-ZALOZENIE-TEMP-MIEJSCA": "Jedna temperatura dla wszystkich elementów — najniższa w miejscu montażu. Jeśli pompy i zawory są w różnych miejscach (garaż, studnia, piwnica), sprawdź każde miejsce osobno.",
  "GRZALKI-GODZINY-PONAD-DOBE": "Czas pracy na dobę musi mieścić się w przedziale 0–24 h.",
  "GRZALKI-WIEKSZE-NIZ-POMPA": "Grzałki dachowe ({moc} W) obciążą system bardziej niż pompa ciepła ({pompa} W) — sprawdź, czy masz zapas mocy.",
  "GRZALKI-BRAK-ZAPASU-MOCY": "Grzałki potrzebują {moc} W, a wolny zapas mocy to {zapas} W — włączone razem z resztą odbiorników przeciążą falownik. Skróć kabel, podziel na strefy włączane naprzemiennie albo zwiększ zapas mocy.",
  "GRZALKI-SPRAWDZ-ZAPAS": "Grzałki dachowe mogą obciążyć system bardziej niż pompa ciepła — wpisz wolny zapas mocy falownika, żeby to sprawdzić.",
  "GRZALKI-ZALOZENIE-MOC-STALA": "Kabel pracuje z mocą znamionową przez cały podany czas. Kabel samoregulujący lub sterowany termostatem zużyje zwykle mniej — wtedy wpisz czas równoważny pełnej mocy.",
  "GRZALKI-ZALOZENIE-DLUGOSC-USERA": "Długość kabla wpisujesz sam — ekran nie wyznacza stref zatorów lodowych z geometrii dachu. Najbardziej narażone: kosze dachowe i strefy przy rynnach.",
  "ZAMARZ-PLYCEJ-NIZ-PRZEMARZANIE": "{nazwa} leży na głębokości {glebokosc} cm, a strefa przemarzania to {hz} cm. Zamarzający, pęczniejący grunt może go uszkodzić — ułóż głębiej (poniżej strefy przemarzania) albo zabezpiecz izolacją i ogrzewaniem.",
  "ZAMARZ-RURA-BEZ-ZAPASU": "{nazwa}: {glebokosc} cm — poniżej strefy przemarzania, ale przewody wodociągowe układaj minimum 20 cm głębiej niż ta strefa (tu: {wymagana} cm).",
  "ZAMARZ-BRAK-GLEBOKOSCI": "{nazwa}: brak głębokości ułożenia — nie da się ocenić.",
  "ZAMARZ-ROZMRAZANIE-OGIEN": "Nie rozmrażaj rury otwartym ogniem ani palnikiem — zbyt szybkie nagrzanie grozi pęknięciem rury i pożarem. Użyj kabla grzewczego.",
  "ZAMARZ-ZALOZENIE-HZ-USERA": "Głębokość przemarzania wpisujesz sam — z mapy stref przemarzania albo projektu budowlanego. Aplikacja nie ma jeszcze danych lokalizacji, z których mogłaby ją wyznaczyć.",
  "ZAMARZ-ZALOZENIE-DO-WIERZCHU": "Głębokość ułożenia liczona do wierzchu kabla, rury lub uziomu — nie do jego osi ani dna wykopu.",
  "AGREGAT-DIESEL-PARAFINIZACJA": "Zwykły olej napędowy przy {temp}°C — najprawdopodobniej już się parafinuje i agregat nie odpali albo zgaśnie. Poniżej +5°C stosuj paliwo zimowe, poniżej −10°C paliwo arktyczne — niezależnie od deklaracji na dystrybutorze. Zalecany dodatek zimowy (depresator): lżejszy rozruch i opóźnienie parafinowania. Kontrola świec żarowych jest obowiązkowa. Olej silnikowy o niskiej lepkości na zimno (np. 5W-40). Liczy się temperatura tam, gdzie stoi agregat i paliwo. Progi +5°C i −10°C to ustalenie tej aplikacji z praktyki (realia paliwa w Polsce), nie wymóg normy.",
  "AGREGAT-DIESEL-RYZYKO-ROZRUCHU": "Zwykły olej napędowy przy {temp}°C może już sprawiać problem z rozruchem. Od +5°C stosuj paliwo zimowe, poniżej −10°C arktyczne. Zalecany dodatek zimowy (lżejszy rozruch, opóźnienie parafinowania); kontrola świec żarowych przed zimą jest obowiązkowa. Liczy się temperatura tam, gdzie stoi agregat i paliwo (na zewnątrz czy w budynku). Próg +10°C to ustalenie tej aplikacji z praktyki, nie wymóg normy.",
  "AGREGAT-DIESEL-ROZRUCH-MROZ": "Diesel przy {temp}°C: poniżej −10°C tylko paliwo arktyczne (plus dodatek zimowy), w pełni naładowany akumulator rozruchowy i sprawne świece żarowe — kontrola świec jest obowiązkowa, inaczej rozruch może być bardzo ciężki albo niemożliwy. Próg −10°C to ustalenie tej aplikacji z praktyki, nie wymóg normy.",
  "AGREGAT-BENZYNA-MROZ": "Benzyna przy {temp}°C: stosuj olej silnikowy na zimę zgodny z instrukcją producenta agregatu i sprawdź świecę zapłonową — zużyta świeca w mrozie utrudnia rozruch.",
  "AGREGAT-DLUGI-POSTOJ": "Agregat stoi {dni} dni przy {temp}°C — po 2+ tygodniach w mrozie może nie wystartować (rozładowany akumulator, zgęstniały olej, sparafinowane paliwo). Uruchamiaj go okresowo, zastosuj podgrzewacz bloku i akumulator AGM.",
  "AGREGAT-PRZERWY": "Agregat może pracować ciągle {max} h, potem wymaga {przerwa} h przerwy — w tym scenariuszu {liczba} przerw. W tym czasie zasilanie tylko z baterii.",
  "AGREGAT-W-BUDYNKU-CZAD": "Agregat spalinowy w budynku (piwnica, kotłownia, garaż przy domu, pomieszczenie mieszkalne) — śmiertelne ryzyko zatrucia czadem (CO). Czad jest bezwonny i zabija we śnie. Nie uruchamiaj agregatu w budynku, nawet przy otwartych oknach lub drzwiach. Postaw go na zewnątrz albo w wydzielonym pomieszczeniu technicznym z wydechem wyprowadzonym na zewnątrz i osobną wentylacją.",
  "AGREGAT-POMIESZCZENIE-WYDZIELONE": "Agregat w wydzielonym pomieszczeniu technicznym — tylko gdy: wydech jest szczelnie wyprowadzony na zewnątrz, jest osobna wentylacja wyciągowa i nawiewna (dopływ świeżego powietrza do spalania i chłodzenia), pomieszczenie jest oddzielone od części mieszkalnej, a w pomieszczeniu i w domu działają czujki czadu. Szczegółowe wymagania normowe (HD 60364-5-551, przepisy przeciwpożarowe) potwierdź z instalatorem — aplikacja nie ma jeszcze tych norm.",
  "AGREGAT-NA-ZEWNATRZ": "Agregat na zewnątrz: ustaw go tak, żeby spaliny nie trafiały do budynku — z dala od okien, drzwi i czerpni wentylacji, wydechem od domu. Chroń go przed deszczem i śniegiem bez zamykania w szczelnej obudowie. W domu zamontuj czujkę czadu.",
  "AGREGAT-BEZ-PRZELACZNIKA": "Agregat podłączony do instalacji bez przełącznika (przez gniazdko, „wtyczką z dwoma bolcami”) — śmiertelnie niebezpieczne. Przy przyłączu sieci agregat podaje napięcie do sieci (backfeed) i może porazić elektromontera na „wyłączonej” linii; w systemie wyspowym zostaje połączony równolegle z wyjściem falownika — zniszczenie urządzeń i ryzyko pożaru, a na bolcach wtyczki jest napięcie. Zamontuj przełącznik I–0–II z blokadą mechaniczną (sieć/falownik – 0 – agregat), przełączający fazy i N.",
  "AGREGAT-PRZEZ-PRZELACZNIK": "Agregat przez przełącznik I–0–II — dobrze. Przełącznik musi mieć położenie 0 i blokadę mechaniczną (nie da się załączyć obu źródeł naraz) i przełączać fazy oraz N. Przełączaj przy wyłączonych odbiornikach dużej mocy. Montaż — elektryk z uprawnieniami.",
  "AGREGAT-WEJSCIE-FALOWNIKA": "Agregat przez rozdzielnię do wejścia AC falownika/ładowarki — falownik sam przełącza źródła. Agregat łączy się zawsze przez rozdzielnię (zabezpieczenie nadprądowe i różnicowoprądowe obwodu agregatu), nigdy przewodem wprost do falownika. Sprawdź w instrukcji, że to wejście jest przeznaczone dla agregatu i jaki prąd przyjmuje. Jeśli budynek ma też przyłącze sieci, przed tym wejściem potrzebny jest przełącznik sieć – 0 – agregat z blokadą mechaniczną.",
  "AGREGAT-TYLKO-ODBIORNIKI": "Odbiorniki awaryjne zasilane z rozdzielni, którą zasila wyłącznie agregat — według planu awaryjnego (które obwody i w jakiej kolejności). Ta rozdzielnia nie może mieć połączenia z siecią ani z instalacją budynku; jeśli je ma, potrzebny jest przełącznik I–0–II. Nigdy nie podłączaj agregatu do gniazdka w ścianie.",
  "AGREGAT-GORACE-CZESCI-OPARY": "Wysoka temperatura i opary paliwa: tłumik i wydech są bardzo gorące — trzymaj z dala materiały palne i nie dotykaj ich. Tankuj tylko po wyłączeniu i ostygnięciu agregatu, bez otwartego ognia i iskier w pobliżu. Rozlane paliwo wytrzyj przed uruchomieniem.",
  "AGREGAT-PALIWO-OSOBNO": "Zapas paliwa trzymaj osobno — z dala od agregatu i poza pomieszczeniem, w którym pracuje (atestowane kanistry, przewietrzane miejsce, z dala od źródeł ciepła). Oddzielenie zbiornika od agregatu zmniejsza ryzyko pożaru i jego skutki.",
  "AGREGAT-SRODKI-GASNICZE": "Przy agregacie trzymaj gaśnicę odpowiednią do pożaru paliwa i urządzeń elektrycznych (np. proszkową ABC albo śniegową CO₂) i sprawdzaj jej ważność. Nie gaś wodą paliwa ani urządzeń pod napięciem. Przy pożarze najpierw odetnij zasilanie i paliwo, jeśli to bezpieczne.",
  "AGREGAT-ZALOZENIE-DANE-PRODUCENTA": "Czas pracy ciągłej, przerwa, zużycie paliwa i interwał oleju — z instrukcji Twojego agregatu. Zużycie liczone jako stałe przy typowym obciążeniu; zimą, z rozruchami na zimno, bywa wyższe.",
  "BLACKOUT-PROCENT-POZA-ZAKRESEM": "Wartość procentowa musi mieścić się w zakresie 0–100% (sprawność większa od 0).",
  "BLACKOUT-SOC-MIN-NIE-MNIEJSZY": "Krytyczne minimum SoC musi być niższe niż SoC na początku scenariusza.",
  "BLACKOUT-SYSTEM-PADNIE": "W scenariuszu {dni} dni bez słońca system osiągnie krytyczne minimum {dzien}. dnia. Aby przetrwać, potrzebujesz dodatkowo ok. {pojemnosc} kWh baterii albo musisz ograniczyć zużycie o ok. {redukcja}%.",
  "BLACKOUT-SYSTEM-PRZETRWA": "System przetrwa {dni} dni bez słońca przy wpisanym zużyciu.",
  "BLACKOUT-ZALOZENIE-PV-ZERO": "Scenariusz skrajny: produkcja PV = 0 przez cały okres (całkowite zachmurzenie, śnieg na panelach).",
  "BLACKOUT-ZALOZENIE-ZUZYCIE-STALE": "Zużycie dobowe stałe — wpisz je dla najzimniejszych dni (ogrzewanie w mrozie). Model dobowy: nie pokazuje godziny awarii. Pojemność baterii w mrozie nie jest tu obniżana — sprawdź M4 „Cold C-Rate”.",
  "ZAMARZANIE-PROCENT-POZA-ZAKRESEM": "Wartość procentowa musi mieścić się w zakresie 0–100% (sprawność większa od 0).",
  "ZAMARZANIE-SOC-PONIZEJ-MINIMUM": "Bateria jest już na minimum — odbiorniki krytyczne (ogrzewanie, pompy) nie mają zasilania. Uruchom agregat.",
  "ZAMARZANIE-KOMFORT-ODLACZONY": "Odłączone od razu (komfort, zimą bez nadwyżki PV): {nazwy}.",
  "ZAMARZANIE-WAZNE-PRZY-PROGU": "Odłączane przy SoC poniżej {prog}% (ważne — ostateczność): {nazwy}.",
  "ZAMARZANIE-BRAK-KRYTYCZNYCH": "Brak odbiorników krytycznych (priorytet 1) — dodaj ogrzewanie, pompy i grzałki BMS, które nigdy nie mogą zostać odłączone.",
  "ZAMARZANIE-ZALOZENIE-BRAK-PV": "Zima bez nadwyżki PV: komfort odłączony od razu, ważne przy SoC < 20%, krytyczne nigdy — progi z Modułu 2 „Macierz priorytetów odłączania”.",
  "ZAMARZANIE-ZALOZENIE-MOC-STALA": "Moc odbiorników liczona jako stała. Pompa ciepła w mrozie pracuje dłużej i mocniej — wpisz jej średnią moc w mroźną dobę.",
  "SPOF-BMS": "{nazwa}: brak obejścia — jeśli padnie BMS, cały system wyłączy się w kilka sekund. Zainstaluj drugi BMS lub przynajmniej stycznik awaryjny.",
  "SPOF-BEZPIECZNIK-GLOWNY": "{nazwa}: brak zapasowego bezpiecznika — po jego zadziałaniu system stoi do wymiany. Trzymaj zapasowy przy rozdzielni.",
  "SPOF-POMPA-CIEPLA": "{nazwa}: brak grzałki awaryjnej — awaria pompy ciepła zimą to brak ogrzewania. Rozważ grzałkę awaryjną lub inne źródło ciepła.",
  "SPOF-KOMPONENT": "{nazwa}: pojedynczy punkt awarii — brak redundancji ani obejścia.",
  "REKU-SPRAWNOSC-POZA-ZAKRESEM": "Sprawność odzysku musi mieścić się w zakresie 0–100%.",
  "REKU-RYZYKO-ZAMARZNIECIA": "Przy {temp}°C wymiennik może zamarznąć (producent podaje granicę {granica}°C) — rekuperator przejdzie na bypass albo stanie. Zastosuj nagrzewnicę wstępną lub wymiennik z bypassem.",
  "REKU-WILGOTNOSC": "Wyłączona wentylacja to wzrost wilgotności, ryzyko pleśni i gorsze powietrze — tych skutków aplikacja nie liczy (źródło nie podaje zależności).",
  "REKU-ZALOZENIE-STALE-POWIETRZA": "Gęstość 1,2 kg/m³ i ciepło właściwe powietrza 1005 J/(kg·K) — te same stałe co w Module 6. Wymiana powietrza bez odzysku traci całe ciepło, które rekuperator odzyskiwał.",
  "PREHEAT-COP-NIEDODATNI": "COP musi być większy od 0 (1 dla grzałki elektrycznej).",
  "PREHEAT-GRZANIE-NOCA-Z-BATERII": "Nie wykonuj przegrzewania w nocy z baterii — to zrujnuje magazyn energii. Grzej w dzień, z nadwyżki PV.",
  "PREHEAT-ZA-MALA-NADWYZKA": "Przegrzanie wymaga ok. {potrzebne} kWh prądu, a nadwyżka PV to {nadwyzka} kWh — zmniejsz podniesienie temperatury albo pomiń bojler.",
  "PREHEAT-ZALOZENIE-STRATY-STALE": "Bufor liczony przy stałych stratach ciepła z prognozowanego mrozu — realnie maleją, gdy dom stygnie. Pojemność cieplna z Modułu 6 „Pojemność cieplna budynku”.",
  "STRING-PROCENT-POZA-ZAKRESEM": "Wartość procentowa musi być większa od 0 i nie większa niż 100%.",
  "STRING-WIEKSZY-NIZ-CALOSC": "Produkcja jednego stringu nie może być większa niż produkcja całej instalacji.",
  "STRING-DEFICYT": "Po awarii tego stringu w najgorszym miesiącu brakuje {deficyt} kWh na dobę — bez agregatu system nie przetrwa.",
  "STRING-DNI-NA-BATERII": "Przy tym deficycie bateria wystarczy na ok. {dni} dnia.",
  "STRING-KASKADA": "Ryzyko kaskadowej awarii (przeciążenie pozostałych stringów) nie jest liczone. Monitoruj napięcia stringów — wczesne ostrzeżenie (Moduł 13).",
  "STRING-ZALOZENIE-NAJGORSZY-MIESIAC": "Produkcję wpisz dla najgorszego miesiąca (zwykle grudzień/styczeń) — z Modułu 3. Uszkodzony string daje 0 kWh.",
  "ESP-SPRAWNOSC-POZA-ZAKRESEM": "Sprawność przetwornicy musi być większa od 0% i nie większa niż 100%.",
  "ESP-BEZ-PRZETWORNICY": "Nie podłączaj ESP32 bezpośrednio do napięcia magistrali — spalisz stabilizator płytki. Potrzebna przetwornica step-down na 5 V lub 3,3 V.",
  "ESP-PRZETWORNICA-ZA-NISKIE-WEJSCIE": "Magistrala dochodzi do {umax} V, a przetwornica przyjmuje maks. {uwe} V — przy ładowaniu zostanie uszkodzona. Dobierz przetwornicę o wyższym napięciu wejściowym.",
  "ESP-PRZETWORNICA-PRZECIAZONA": "ESP32 z czujnikami pobiera {iout} A, a przetwornica daje maks. {imax} A — dobierz mocniejszą.",
  "ESP-BEZPIECZNIK-FILTR": "Prąd z magistrali ok. {iin} A — zastosuj bezpiecznik na wejściu przetwornicy. Przy zasilaniu z instalacji PV sprawdź potrzebę filtra przeciwzakłóceniowego.",
  "ESP-ZALOZENIE-NAPIECIE-MAX": "Zakres wejściowy przetwornicy porównany z najwyższym napięciem magistrali (przy ładowaniu), nie z nominalnym. Prąd z magistrali liczony przy napięciu nominalnym.",
  "KOM-RS485-BEZ-TRANSCEIVERA": "{nazwa}: nie łącz GPIO 3,3 V bezpośrednio z magistralą RS485 — wymagany transceiver (np. MAX485), inaczej uszkodzisz port.",
  "KOM-CAN-BEZ-TRANSCEIVERA": "{nazwa}: magistrala CAN wymaga transceivera (np. SN65HVD230) — GPIO nie może pracować na niej bezpośrednio.",
  "KOM-KONFLIKT-ADRESU": "Adres {adres} ma kilka urządzeń na RS485 ({nazwy}) — każde urządzenie Modbus musi mieć unikalny adres.",
  "KOM-ROZNE-PREDKOSCI": "Na magistrali {protokol} są różne prędkości ({predkosci}) — wszystkie urządzenia na jednej magistrali muszą mieć tę samą.",
  "KOM-ADRES-NIEPOPRAWNY": "Adres urządzenia musi być liczbą całkowitą, co najmniej 1.",
  "KOM-ZALOZENIE-JEDNA-MAGISTRALA": "Założenie: wszystkie urządzenia RS485 są na jednej magistrali, CAN — na jednej. Przy kilku osobnych magistralach sprawdź każdą oddzielnie.",
  "PIN-GPIO-NIEPOPRAWNY": "Numer GPIO musi być liczbą całkowitą, nie mniejszą niż 0.",
  "PIN-KONFLIKT": "GPIO{gpio} ma przypisane kilka funkcji: {opisy} — każdy pin może mieć jedną funkcję (wyjątek: linie wspólnej magistrali I2C, 1-Wire, SPI).",
  "PIN-ADC-WIFI": "Przy aktywnym Wi-Fi przetwornik ADC2 jest niedostępny — pomiary analogowe podłącz do pinów ADC1 (sprawdź w karcie płytki).",
  "OTA-BEZ-PODPISU": "Aktualizacja OTA bez weryfikacji podpisu cyfrowego — ryzyko wgrania złośliwego albo uszkodzonego firmware.",
  "OTA-BEZ-SUMY-KONTROLNEJ": "Aktualizacja OTA bez sumy kontrolnej — uszkodzony plik może zostać zainstalowany.",
  "OTA-BEZ-ROLLBACKU": "Aktualizacja OTA bez powrotu do poprzedniej wersji — nieudana aktualizacja może unieruchomić sterownik.",
  "ESP-PLYTKA-BRAK-JEDNEJ": "Żaden wariant z listy nie ma wszystkich zaznaczonych cech naraz — najlepsze pokrywają {pokryte} z {liczba}. Porównaj karty katalogowe albo dołóż brakującą funkcję modułem zewnętrznym.",
  "ESP-PLYTKA-BEZ-WYMAGAN": "Nie zaznaczono żadnej potrzeby, a zasilanie jest stałe — każdy wariant z tabeli się nada. Zaznacz, czego potrzebujesz, żeby zawęzić wybór.",
  "ESP-ODSTEP-OD-SZYN": "Odstęp od szyn prądowych {odstep} cm jest mniejszy niż zalecane minimum {min} cm — odsuń obudowę ESP32 od szyn, z dala od tego, co grzeje i co jest pod napięciem.",
  "ESP-OBUDOWA-BEZ-WENTYLACJI": "Obudowa ESP32 bez wentylacji — elektronika potrzebuje przewiewnego miejsca i odprowadzenia ciepła.",
  "ESP-OBUDOWA-BEZ-IZOLACJI": "ESP32 nie jest odizolowany od elementów pod napięciem — oddziel go przegrodą albo osobną obudową.",
  "ESP-MONTAZ-ZALECANY-DIN": "Zalecany montaż na szynie DIN albo płycie montażowej — pewne mocowanie i porządek w rozdzielni.",
  "ESP-ODSTEP-UJEMNY": "Odstęp od szyn musi być liczbą nie mniejszą niż 0 cm.",
  "ZAMEK-BLOKUJE-BEZ-ZASILANIA-AWARYJNEGO": "Zamek blokuje drzwi przy zaniku prądu, a nie ma ani zasilania awaryjnego, ani ręcznego otwarcia działającego bez prądu — w pożarze, gdy padnie zasilanie, drzwi ewakuacyjne mogą zostać zamknięte. Drzwi muszą się wtedy otworzyć: zmień logikę na fail-safe (brak prądu = drzwi otwarte) albo zapewnij osobne zasilanie awaryjne lub ręczne otwarcie mechaniczne (klamka, pochwyt antypaniczny).",
  "ZAMEK-FAIL-SECURE": "Zamek blokuje drzwi przy zaniku prądu — otwarcie zależy od zasilania awaryjnego albo ręcznego otwarcia mechanicznego. To dopuszczalne, ale zasada dla drzwi ewakuacyjnych brzmi: brak prądu = drzwi otwarte. Sprawdzaj regularnie UPS i to, że ręczne otwarcie działa bez prądu i bez klucza od środka; rozważ zamek fail-safe.",
  "ZAMEK-ZACHOWANIE-NIEZNANE": "Nie wiadomo, co robi zamek przy zaniku prądu — liczone jak blokada (strona bezpieczna). Sprawdź w karcie katalogowej: „fail-safe” (otwiera) czy „fail-secure” (blokuje).",
  "ZAMEK-BRAK-PRZYCISKU": "Brak przycisku ewakuacyjnego — drzwi da się zwolnić tylko automatycznie. Przycisk pozwala otworzyć je ręcznie, gdy automatyka zawiedzie.",
  "ZAMEK-BRAK-ZWALNIANIA-PO-ALARMIE": "Zamek nie jest zwalniany sygnałem alarmu pożarowego — w pożarze drzwi pozostaną zamknięte, dopóki ktoś ich nie zwolni.",
  "ZAMEK-BRAK-KONTAKTRONU": "Brak kontaktronu — system nie potwierdzi, że drzwi faktycznie się otworzyły.",
  "GASZ-LICZBA-CZUJNIKOW-NIEPOPRAWNA": "Liczba czujników potwierdzenia musi być liczbą całkowitą, co najmniej 1.",
  "GASZ-SRODEK-NIESKUTECZNY-LIFEPO4": "Proszek i CO2 nie gaszą wewnętrznej reakcji chemicznej ogniwa LiFePO4 — w strefie magazynu energii wymagana jest mgła wodna (agregat wodny/mgłowy) albo środek przeznaczony do magazynów energii.",
  "GASZ-SRODEK-NIEPOTWIERDZONY-LIFEPO4": "Dla strefy magazynu LiFePO4 wymagana jest mgła wodna albo środek przeznaczony do magazynów energii. Jeśli Twój środek ma certyfikat do magazynów energii — wybierz „środek do magazynów energii”; jeśli nie, zmień go.",
  "GASZ-PROPOZYCJA-LIFEPO4": "Propozycja dla magazynu LiFePO4: (1) mgła wodna (agregat wodny/mgłowy) — pierwszy wybór, bo chłodzi ogniwa; (2) środek przeznaczony do magazynów energii — z certyfikatem producenta do baterii litowych; (3) jako uzupełnienie przy większym magazynie: chłodzenie (zamrażanie) ogniw — ogniwo w ucieczce termicznej gaśnie dopiero, gdy odbierze mu się ciepło, a gaz obojętny i aerozol gaszą płomień, ale nie chłodzą, więc ogniwo może zapalić się ponownie. System chłodzenia dobierz z producentem magazynu.",
  "GASZ-INNA-CHEMIA": "W strefie jest magazyn innej chemii niż LiFePO4 — dobierz środek gaśniczy wg zaleceń producenta magazynu.",
  "GASZ-ZA-MALO-CZUJNIKOW": "Gaszenie uruchamia {liczba} czujnik — potwierdzenie alarmu wymaga co najmniej {min} niezależnych czujników, inaczej rośnie ryzyko fałszywego zadziałania.",
  "GASZ-BRAK-ODCIECIA-WENTYLACJI": "Gaszenie nie odcina wentylacji i nie zamyka klap — środek gaśniczy ucieknie ze strefy.",
  "GASZ-MODUL-ROZLADOWANY": "Moduł gaśniczy rozładowany — wymień. W razie pożaru nie zadziała.",
  "ZRODLO-GODZINY-POZA-DOBA": "Czas palenia musi mieścić się w dobie (0–24 h).",
  "ZRODLO-SPRAWNOSC-POZA-ZAKRESEM": "Sprawność musi być większa od 0% i nie większa niż 100%.",
  "ZRODLO-MOC-WODY-WIEKSZA": "Moc do wody nie może być większa od całkowitej mocy cieplnej urządzenia.",
  "ZRODLO-BEZ-PLASZCZA": "Bez płaszcza wodnego urządzenie grzeje głównie pomieszczenie, w którym stoi — znacznie odciąży baterię, ale nie ogrzeje całego domu. Pokrycie zapotrzebowania domu nie jest liczone.",
  "ZRODLO-NIE-POKRYWA": "Źródło awaryjne pokrywa ok. {pokrycie}% dobowego zapotrzebowania — resztę musi dać pompa ciepła lub inne źródło.",
  "ZRODLO-CZUJNIK-CO": "Zainstaluj czujnik czadu (CO) w pomieszczeniu ze źródłem spalania — sprawdź też odległości i nawiew na ekranie „Bezpieczeństwo pożarowe — dogrzewanie paliwem stałym”.",
  "ZRODLO-ZALOZENIE-MOC-STALA": "Moc cieplna liczona jako stała przez cały czas palenia (moc nominalna z karty). Rozpalanie i dogasanie realnie ją obniżają.",
  "ZRODLO-ZALOZENIE-WARTOSC-OPALOWA": "Ilość paliwa z wpisanej sprawności i wartości opałowej. Wartość opałowa drewna mocno zależy od gatunku i wilgotności — mokre drewno daje wyraźnie mniej ciepła.",
  "SSP-AWARIA-CENTRALI": "Awaria centrali pożarowej — sprawdź zasilanie. Dopóki centrala nie działa, system nie dowie się o pożarze.",
  "SSP-BRAK-SYGNALU-ALARMU": "Sterownik nie odbiera sygnału alarmu z centrali — reszta systemu (zamki, klapy, gaszenie, oświetlenie) nie dowie się o pożarze.",
  "SSP-BRAK-SYGNALU-AWARII": "Sterownik nie odbiera sygnału awarii centrali — niesprawna centrala pozostanie niezauważona. Awaria centrali musi być widoczna priorytetowo.",
  "SSP-BRAK-SYGNALU-ROZBROJENIA": "Sterownik nie odbiera sygnału rozbrojenia — nie odróżni wyłączonej centrali od dozoru.",
  "SSP-BRAK-LOGOWANIA": "Zdarzenia z centrali nie są logowane — po incydencie nie odtworzysz przebiegu.",
  "OSW-LAMPA-NIESPRAWNA": "Lampa awaryjna {nazwa} nie działa — sprawdź. Awaria na trasie ewakuacji musi być usunięta, zanim będzie potrzebna.",
  "OSW-LAMPA-NIETESTOWANA": "Lampa awaryjna {nazwa} nie była testowana — jej sprawność jest nieznana. Wykonaj test okresowy.",
  "OSW-BRAK-ZEWNETRZNEGO": "Brak oświetlenia zewnętrznego włączanego po alarmie — ułatwia dojście służbom.",
  "KLAPY-WENTYLACJA-NIE-WYLACZANA": "Rekuperacja/wentylacja nie wyłącza się przy pożarze — będzie tłoczyć dym po domu.",
  "KLAPY-NIE-ZAMYKANE": "Klapy w kanałach nie zamykają się po wykryciu pożaru — dym rozejdzie się kanałami do innych pomieszczeń.",
  "KLAPY-BRAK-SYGNALIZACJI": "Brak sygnalizacji stanu klap — system nie potwierdzi, że klapy się zamknęły.",
  "KLAPY-BRAK-ODDYMIANIA": "Brak wentylacji oddymiającej — dym trzeba będzie usuwać ręcznie (okna, drzwi) po ugaszeniu.",
  "KLAPY-BRAK-WENTYLACJI-MECHANICZNEJ": "Brak wentylacji mechanicznej — klapy pożarowe i wyłączanie rekuperacji nie dotyczą tego budynku.",
  "ALARM-LICZBA-KONTAKTOW-NIEPOPRAWNA": "Liczba kontaktów musi być liczbą całkowitą, nie mniejszą niż 0.",
  "ALARM-WEZWANIE-BEZ-ZGODY": "Automatyczne wezwanie służb włączone bez Twojej wyraźnej zgody — pozostaje nieaktywne. Wezwanie może działać tylko za wcześniejszą, wyraźną zgodą.",
  "ALARM-BRAK-SYRENY": "Brak syreny/sygnalizatora — domownicy i sąsiedzi nie usłyszą alarmu.",
  "ALARM-BRAK-KONTAKTOW": "Brak kontaktów alarmowych — powiadomienie nie trafi do nikogo, gdy nie ma Cię w domu.",
  "ALARM-BRAK-KAMER": "Brak kamer — przebieg zdarzenia nie zostanie nagrany.",
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
  "MIKROINWERTER-OFFGRID-BEZ-FALOWNIKA-WYSPOWEGO": "Instalacja nie wystartuje: mikroinwerter to falownik sieciowy — bez falownika wyspowego, który tworzy sieć 230 V/50 Hz i obsługuje sprzężenie AC (ograniczanie mocy przy pełnym magazynie), nie ma się do czego zsynchronizować. Dobierz falownik wyspowy z AC-coupling zgodny z modelem mikroinwertera albo wybierz inwerter centralny z optymalizatorami.",
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
  "ZS-ZALOZENIE-BALAST-EQU": "Balast projektowy: PN-EN 1990, wzór (6.7), Tablica A1.2(A) — γQ = {gammaQ} dla wiatru (oddziaływanie niekorzystne), γG,inf = {gammaG} dla balastu (oddziaływanie korzystne); załącznik krajowy NB bez zmian krajowych.",
  "ZS-ZALOZENIE-MASA-WLASNA-POMINIETA": "Ciężar paneli i stelaża pominięty (po stronie bezpiecznej) — wpisz masę z karty katalogowej albo z wagi, żeby odjąć ją od balastu.",
  "ZS-ZALOZENIE-MASA-WLASNA": "Ciężar paneli i stelaża {masa} kg (wpisany z karty katalogowej/wagi) wliczony jako oddziaływanie korzystne z γG,inf = {gammaG}; balast = masa wymagana minus ten ciężar (nie mniej niż 0).",
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
  "CRL-SPD-ZALECANY": "Zalecenie, nie wymóg normy: HD 60364-4-443 nie wymaga tu SPD od strony sieci, ale ogranicznik typu 2 kosztuje niewiele w porównaniu ze sprzętem, który chroni — warto go zamontować.",
  "CRL-BRAK-LINII": "Brak linii zasilających (typowy off-grid) — metoda CRL nie daje wymogu SPD od strony sieci. To nie znaczy, że instalacja jest chroniona: pozostaje strona DC paneli i przepięcia łączeniowe.",
  "CRL-PRZEPIECIA-LACZENIOWE": "Instalacja z własnym źródłem (falownik, agregat), magazynem energii lub silnikami — norma każe rozważyć ochronę przed przepięciami łączeniowymi niezależnie od CRL (443.4).",
  "CRL-STRONA-DC-POZA": "CRL dotyczy linii, które zasilają instalację. Ochrona strony DC generatora PV to osobne wymagania HD 60364-7-712 — ten wynik ich nie obejmuje.",
  "CRL-ZALOZENIE-F": "Współczynnik F = {f} (Tablica 443.1: „dla wszystkich instalacji”; krajowy wybór 1–3 dla mieszkań nie jest znany aplikacji).",
  "CRL-ZALOZENIE-NIEZNANE-DLUGOSCI": "Część długości sieci nieznana — brakujące {reszta} km przyjęte jako linia napowietrzna nn, jak każe 443.5 (najbardziej niekorzystnie).",
  "CRL-ZALOZENIE-OBCIECIE": "Liczone tylko pierwsze {limit} km sieci (1 km albo do pierwszego SPD w sieci). Kolejność odcinków od budynku nieznana — aplikacja zostawia najpierw te o największej wadze (typowy układ: nn przy domu, SN za transformatorem; wynik ostrożny). Podaj kolejność, żeby liczyć od budynku.",
  "CRL-ZALOZENIE-OBCIECIE-OD-BUDYNKU": "Liczone tylko pierwsze {limit} km sieci (1 km albo do pierwszego SPD w sieci), od budynku na zewnątrz — w podanej kolejności odcinków (D54).",
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
  "PROGNOZY-ZALOZENIE-PROBKOWANIE-3H": "Każdy punkt to średnia moc w swoim 3-godzinnym oknie — energia = moc × 3 h, zsumowana po punktach. To próbkowanie co 3 h, nie pełna krzywa godzinowa — orientacyjnie, nie jako projekt wykonawczy.",
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
  // M12 — screens built 30.09.2026 (E4, E16, E35 and later)
  "M12-WARTOSC-UJEMNA": "Wpisana wartość nie może być ujemna.",
  "M12-PROCENT-POZA-ZAKRESEM": "Wartość procentowa musi być z przedziału 0–100%.",
  "AS-ROZRUCHOWY-NIE-DO-GLEBOKIEGO": "Akumulator rozruchowy jest zbudowany pod krótki, mocny impuls przy rozruchu silnika, nie pod długie, powolne oddawanie prądu. Głębokie rozładowanie skraca jego życie — do zasilania urządzeń lepszy jest akumulator AGM albo żelowy.",
  "AS-ROZRUCHOWY-PONAD-UZYTECZNA": "Planujesz {planowany} h, a akumulator rozruchowy dojdzie do granicy bezpiecznego rozładowania po ok. {czas} h. Dalej ryzykujesz, że nie odpalisz silnika, i trwale uszkodzisz akumulator. Skróć czas pracy, zmniejsz pobór albo użyj osobnego akumulatora do odbiorników.",
  "AS-PONAD-UZYTECZNA": "Planujesz {planowany} h, a wpisana część użyteczna pojemności skończy się po ok. {czas} h. Dalsza praca to głębsze rozładowanie niż zakładasz — krótsze życie akumulatora.",
  "AS-ZALOZENIE-MOC-Z-AKUMULATORA": "Moc to pobór z akumulatora. Przy urządzeniach 230 V przez przetwornicę dolicz jej straty (wpisz moc większą o straty przetwornicy).",
  "AS-ZALOZENIE-BEZ-TEMPERATURY": "Bez korekty na temperaturę — w mrozie akumulator oddaje mniej, więc realny czas będzie krótszy.",
  "MA-PRAD-URZADZENIA-PONAD-MAKS": "{nazwa} pobiera ok. {prad} A, a akumulator (BMS) oddaje najwyżej {maks} A ciągle — może wyłączyć zasilanie albo przegrzać połączenia. Sprawdź kartę akumulatora zanim podłączysz.",
  "MA-PRAD-RAZEM-PONAD-MAKS": "Wszystkie urządzenia naraz pobierają ok. {prad} A — więcej niż {maks} A, które akumulator oddaje ciągle. Nie włączaj ich jednocześnie.",
  "MA-ZALOZENIE-PELNY-AKUMULATOR": "Start z w pełni naładowanego akumulatora, bez doładowania w trakcie (np. panelem).",
  "AP-DROGIE-PALIWO": "Energia z agregatu to drogie paliwo. Używaj go tylko do doładowania akumulatora albo do krótkiej pracy dużych odbiorników — nie jako stałe źródło.",
  "M12-GODZINY-PONAD-DOBE": "Doba ma 24 godziny — wpisz liczbę godzin na dobę od 0 do 24.",
  "AP-ZALOZENIE-STALE-OBCIAZENIE": "Stałe obciążenie i stałe zużycie paliwa przez cały czas pracy — tak, jak je wpisałeś z karty agregatu.",
  "SP-NIGDY-SIE-NIE-ZWROCI": "Zestaw kosztuje więcej na start, a rocznie nie oszczędza nic (jego utrzymanie kosztuje tyle co prąd z przedłużacza albo więcej) — dopłata nigdy się nie zwróci.",
  "SP-SPADEK-NAPIECIA-KABLA": "Długi przedłużacz to spadek napięcia i nagrzewanie kabla — przekrój dobierz do długości i obciążenia (Moduł 5), a kabel w ziemi układaj jako ziemny, w osłonie.",
  "SP-ZALOZENIE-BEZ-INFLACJI": "Bez inflacji i zmian cen energii — dzisiejsze ceny przez cały horyzont.",
  "SP-ZALOZENIE-ZESTAW-POKRYWA-ZUZYCIE": "Zestaw solarny pokrywa całe wpisane zużycie — dobór jego mocy i pojemności sprawdź na innych ekranach Modułu 12.",
  "SD-DIY-WYMAGA-WIEDZY": "Zestaw DIY wymaga wiedzy i pracy: bezpiecznik przy akumulatorze, przekroje przewodów dobrane do prądu, pewne połączenia. Źle złożony zestaw to ryzyko pożaru — w stacji robi to za Ciebie producent.",
  "SD-ZALOZENIE-TYLKO-MAGAZYN": "Porównanie samego magazynu energii (cena i masa na Wh użyteczną) — wygoda, gwarancja, serwis i możliwość rozbudowy są opisane w Migawce, nie w liczbach.",
  "WK-BRAK-NA-POCHMURNY-POBYT": "Bez słońca akumulator starczy na ok. {dniAkum} doby, a pobyt trwa {dni} — w pochmurny weekend zabraknie energii. Ogranicz zużycie, weź większy akumulator albo zaplanuj doładowanie.",
  "WK-BRAK-NAWET-Z-PANELEM": "Nawet ze średnią produkcją panelu zabraknie ok. {wh} Wh do końca pobytu. Większy panel, większy akumulator albo mniejsze zużycie.",
  "WK-ZALOZENIE-PELNY-NA-START": "Na start pobytu akumulator jest w pełni naładowany.",
  "WK-ZALOZENIE-PANEL-SREDNIA": "Panel produkuje co dobę średnio tyle, ile wynika z wpisanych godzin słońca — w pochmurne dni będzie mniej.",
  "PU-PANEL-ZA-MALY": "Twój panel {posiadany} W jest za mały — przy wpisanym słońcu i uzysku potrzeba co najmniej {minimalna} W. Urządzenie będzie rozładowywać akumulator dzień po dniu.",
  "PU-POCHMURNE-DNI": "W pochmurne dni panel produkuje dużo mniej niż średnio — rozważ większy panel albo zapas w akumulatorze na kilka dni.",
  "PU-ZALOZENIE-BILANS-DOBOWY": "Bilans dobowy: panel oddaje w dzień tyle, ile urządzenie zużywa przez dobę. Praca nocą wymaga akumulatora, który zmagazynuje tę energię.",
  "LPP-POWERBANK-NIE-LACZYC": "Nie łącz powerbanków solarnych ze sobą ani z innymi panelami — mają wbudowany regulator. Ładuj każdy osobno.",
  "LPP-USB-NIE-LACZYC": "Wyjść USB paneli nie łączy się szeregowo ani równolegle — za nimi jest przetwornica. Podłącz każdy panel do osobnego urządzenia albo użyj paneli z wyjściem DC (MC4, XT60, Anderson).",
  "LPP-ZLACZA-NIEZGODNE": "Złącze paneli nie pasuje do wejścia stacji, a nie masz adaptera. Nie przerabiaj wtyków na siłę — kup fabryczny adapter o właściwej biegunowości i prądzie.",
  "LPP-ADAPTER-SPRAWDZ": "Łączysz przez adapter — przed podłączeniem sprawdź miernikiem biegunowość i upewnij się, że adapter wytrzyma prąd paneli.",
  "LPP-ROZNE-PANELE": "Panele są różne: szeregowo prąd ogranicza najsłabszy panel, równolegle — najniższe napięcie. Tracisz część mocy; najlepiej łączyć ten sam model.",
  "LPP-SPRAWDZ-NAPIECIE": "Złącza to nie wszystko: sprawdź napięcie (szeregowo się sumuje, w mrozie rośnie) i prąd (równolegle się sumuje) wobec limitów wejścia stacji — ekran „Panel do stacji zasilania”.",
  "PBA-ZA-MALA-MOC-POWERBANKU": "Urządzenie pobiera {urzadzenie} W, a powerbank oddaje najwyżej {powerbank} W — nie uciągnie go. Do takiego odbiornika potrzebujesz akumulatora z przetwornicą.",
  "PBA-MOC-ZESTAWU-I-KOSZT": "Moc ciągłą zestawu z akumulatorem wyznacza jego przetwornica (ekran „Przetwornice”), a cenę i masę na 1 Wh porównasz na ekranie „Stacja vs zestaw DIY”.",
  "PBA-ZALOZENIE-PELNE-NALADOWANIE": "Obie opcje są na starcie w pełni naładowane; ładowanie ze słońca w trakcie nie jest doliczane.",
  "BM-AKUMULATOR-ZA-MALY": "Twój akumulator {posiadany} Ah to za mało — potrzeba co najmniej {minimalny} Ah. Starczy na ok. {godzin} h; ogranicz odbiorniki albo dołóż pojemność.",
  "BM-ROZRUCH-PRZETWORNICY": "Minimalna przetwornica to suma mocy pracy. Lodówka i pompy przy starcie pobierają kilka razy więcej — dobierz zapas na rozruch na ekranie „Przetwornice”.",
  "BM-ZALOZENIE-BEZ-LADOWANIA": "Akumulator na starcie pełny; przez cały blackout bez ładowania (bez sieci, słońca i agregatu). Odbiorniki pracują średnio tyle godzin na dobę, ile wpisano.",
  "AKK-AGM-ZA-GLEBOKO": "Planujesz rozładowywać AGM do {dod}% — głębiej niż {ref}%, przy których podaje się typową liczbę cykli. AGM w kamperze szybko padnie przy głębokim rozładowaniu; sprawdź liczbę cykli dla tej głębokości w karcie.",
  "AKK-PRZEKROCZONA-MASA-AGM": "Akumulatory AGM ważą razem {masa} kg — więcej niż zapas ładowności {zapas} kg.",
  "AKK-PRZEKROCZONA-MASA-LFP": "Akumulatory LiFePO4 ważą razem {masa} kg — więcej niż zapas ładowności {zapas} kg.",
  "AKK-ZALOZENIE-PELNE-CYKLE": "Koszt kWh zakłada, że akumulator przejdzie wszystkie cykle z karty przy wpisanej głębokości rozładowania (bez starzenia kalendarzowego i złej obsługi).",
  "DK-PANEL-SIE-NIE-MIESCI": "Panel nie mieści się na żadnym wolnym odcinku dachu. Wybierz mniejszy panel, zmniejsz margines albo przesuń świetlik.",
  "DK-SPRAWDZ-MOCOWANIE": "Wynik mówi, co się zmieści. Osobno sprawdź nośność dachu, mocowanie (klej/spoilery), przepust kablowy i czy panele nie zacieniają się nawzajem ani przez klimatyzator.",
  "DK-ZALOZENIE-JEDEN-MODEL": "Wszystkie panele to ten sam model; na każdym odcinku jedna orientacja (lepsza). Mieszane ułożenie w jednym odcinku może czasem zmieścić więcej.",
  "PK-ELASTYCZNY-BEZ-WENTYLACJI": "Panel elastyczny przyklejony płasko do dachu, bez szczeliny wentylacyjnej, przegrzewa się i traci wydajność, a szybciej się starzeje. Jeśli możesz — zostaw szczelinę albo wybierz panel sztywny na ramie.",
  "PK-SPRAWDZ-TEMPERATURE": "Ile mocy stracisz przez nagrzanie, zależy od współczynnika temperaturowego z karty panelu — policz to na ekranie „Wpływ temperatury na wydajność” (Moduł 3).",
  "PK-ZALOZENIE-GWARANCJA-TRWALOSC": "Trwałość mierzona gwarancją mocy producenta — realna żywotność może być inna, zwłaszcza przy złym montażu.",
  "AL-NAPIECIE-ZA-WYSOKIE": "Napięcie ładowania {napiecie} V przekracza {max} V dopuszczalne dla tego typu akumulatora. Za wysokie napięcie zniszczy ogniwa — nie ładuj, zmień ustawienie albo ładowarkę na właściwą dla tej chemii.",
  "AL-NAPIECIE-ZA-NISKIE": "Napięcie ładowania {napiecie} V jest niższe niż {min} V potrzebne temu typowi akumulatora — nie naładujesz go do pełna.",
  "AL-LIFEPO4-BEZ-DCDC": "Alternator nie naładuje LiFePO4 do pełna bez ładowarki DC/DC, a duży prąd pobierany przez LiFePO4 może przeciążyć alternator i instalację auta. Zastosuj ładowarkę DC/DC.",
  "AL-BRAK-POKRYCIA": "Jazda i panele razem nie pokrywają zapotrzebowania — brakuje ok. {wh} Wh na dobę. Jedź dłużej, dołóż panel albo ogranicz zużycie.",
  "AL-ZALOZENIE-STALY-PRAD": "Alternator ładuje stałym prądem przez cały czas jazdy; końcowa faza ładowania (spadek prądu przy pełnym akumulatorze) nie jest liczona, więc realny czas do pełna jest dłuższy.",
  "PRZ-BEZ-PRZETWORNICY": "Urządzenie {napiecie} V zasilisz z akumulatora {napiecie} V bezpośrednio — przetwornica nie jest potrzebna. Sprawdź tylko bezpiecznik i przekrój przewodu.",
  "PRZ-PRZETWORNICA-ZA-SLABA": "Przetwornica/ładowarka daje {posiadany} A, a urządzenie potrzebuje ok. {wymagany} A — będzie przeciążona. Wybierz model o większym prądzie wyjściowym.",
  "PRZ-ROZWAZ-SYSTEM-24V": "Podnosisz napięcie przetwornicą. Jeśli często używasz urządzeń o wyższym napięciu, rozważ zbudowanie systemu na tym napięciu (np. dwa akumulatory 12 V szeregowo = 24 V) — bez strat przetwornicy.",
  "PRZ-FALOWNIK-ZA-SLABY": "Falownik {posiadany} W jest słabszy niż potrzebne minimum {minimalna} W (suma mocy × zapas) — przy pełnym obciążeniu będzie się wyłączał albo przegrzewał.",
  "PRZ-SZCZYT-ZA-MALY": "Moc szczytowa falownika {posiadana} W jest mniejsza niż szczyt przy rozruchu {wymagana} W — urządzenie z silnikiem nie wystartuje, a falownik wyłączy się zabezpieczeniem.",
  "PRZ-SPRAWDZ-SZCZYT": "Sprawdź na karcie falownika moc szczytową (rozruchową) — musi wynosić co najmniej {wymagana} W, inaczej urządzenia z silnikiem nie wystartują.",
  "PRZ-SPRAWDZ-KABLE": "Po stronie akumulatora płynie do ok. {prad} A — dobierz przekrój kabli i bezpiecznik do tego prądu (kalkulator „Zabezpieczenia dla małych instalacji”).",
  "PRZ-ZALOZENIE-USB-5V": "Liczone dla 5 V (USB bez szybkiego ładowania). Przy szybkim ładowaniu (USB PD/QC) napięcie jest wyższe, a prąd mniejszy — moc pozostaje ta sama.",
  "PRZ-ZALOZENIE-ROZRUCH-POJEDYNCZO": "Urządzenia nie startują jednocześnie — szczyt liczony dla rozruchu jednego, najbardziej wymagającego urządzenia przy pracujących pozostałych.",
  "PRZ-ZALOZENIE-BRAK-KROTNOSCI": "Dla części urządzeń nie podano krotności rozruchu — liczone bez rozruchu (1×). Sprawdź kartę urządzenia; silniki i sprężarki pobierają przy starcie kilka razy więcej.",
  "KZ-AKUMULATOR-ZA-MALY": "Twój akumulator {posiadany} Ah podtrzyma odbiornik tylko ok. {h} h — na wymagany czas potrzeba min. {minimalny} Ah.",
  "KZ-PANEL-NIE-POKRYWA": "Panel da ok. {panel} Wh na dobę, a odbiornik zużywa {doba} Wh — akumulator będzie się rozładowywał z dnia na dzień. Zimą będzie gorzej.",
  "KZ-SWIATLO-PRZEZ-FALOWNIK": "Światła awaryjnego nie podłączaj przez falownik 230 V — tracisz energię, a awaria falownika gasi światło. Użyj lamp LED 12 V zasilanych wprost z akumulatora.",
  "KZ-ROZRUCH-FALOWNIKA": "Przy rozruchu silnika falownik musi chwilowo dać ok. {szczyt} W — sprawdź moc szczytową na jego karcie (kalkulator „Przetwornice i falowniki”).",
  "KZ-UWAGA-OSWIETLENIE": "Światło awaryjne ma działać przede wszystkim w nocy — musi być proste i niezawodne.",
  "KZ-UWAGA-TELEFONY": "Ładowanie telefonów przez falownik 230 V i ładowarkę sieciową traci więcej energii niż ładowarka USB zasilana wprost z 12 V.",
  "KZ-UWAGA-ALARM": "Alarm musi mieć podtrzymanie — inaczej w czasie braku prądu przestaje chronić. Wbudowany akumulator centrali też trzeba doładowywać.",
  "KZ-UWAGA-ROZRUCH-SILNIKA": "Silnik (napęd bramy, pompka) przy starcie pobiera kilka razy więcej niż w pracy — wpisz krotność rozruchu z karty urządzenia i dobierz przetwornicę z zapasem.",
  "KZ-UWAGA-OGROD": "Zimą słońca jest mniej i panel może nie naładować akumulatora — rozważ mniej lamp, krótsze świecenie albo większy panel. Pojedyncze lampy solarne bywają prostsze od jednego systemu.",
  "KZ-UWAGA-FONTANNA": "Uruchamiaj fontannę w dzień, gdy jest nadwyżka ze słońca — praca nocą z akumulatora to marnowanie energii.",
  "KZ-UWAGA-WENTYLATOR": "W upały wentylator pracuje dłużej, niż się wydaje — wpisz godziny dla najgorętszych dni.",
  "KZ-UWAGA-OGRZEWANIE": "Bez pompy obiegowej kocioł może się przegrzać — to kwestia bezpieczeństwa. Przy zasilaniu z falownika użyj falownika z czystą sinusoidą, inaczej pompa będzie buczeć i może się uszkodzić.",
  "KZ-UWAGA-ELEKTRONARZEDZIA": "Elektronarzędzia 230 V wymagają dużego falownika i szybko rozładują akumulator. Nie podłączaj narzędzi 230 V bezpośrednio do akumulatora 12 V — to inne napięcie.",
  "KZ-UWAGA-PRACA-CIAGLA": "Praca 24/7 wymaga ciągłego zasilania — panel musi być przewymiarowany, żeby doładować akumulator także w pochmurne dni.",
  "KZ-UWAGA-BOJLER": "Podgrzewanie wody z akumulatora to ogromne obciążenie — grzałka szybko rozładuje mały akumulator.",
  "KZ-UWAGA-PRACA-ZDALNA": "Zasilanie laptopa przez falownik 230 V traci energię — lepsza ładowarka USB-C PD zasilana wprost z 12 V.",
  "KZ-UWAGA-LODOWKA": "Lodówka pracuje cyklicznie — wpisz realne godziny pracy sprężarki, nie 24 h. Sprężarka przy starcie pobiera kilka razy więcej — falownik musi mieć zapas mocy szczytowej. Latem bez zasilania lodówka szybko traci chłód.",
  "KZ-UWAGA-BRAMA-GARAZOWA": "Testuj awaryjne otwieranie bramy przed brakiem prądu, a nie w trakcie. Sprawdź też ręczne odblokowanie napędu.",
  "KZ-ZALOZENIE-ROWNOMIERNY-POBOR": "Zużycie doby rozłożone równomiernie na czas podtrzymania (E × T ÷ 24); akumulator naładowany na starcie, bez ładowania w trakcie.",
  "LKK-GASNICA-MIERNIK": "Nie zapomnij o gaśnicy i mierniku napięcia — to podstawa bezpieczeństwa każdej instalacji na wyjeździe.",
  "LKK-ZALOZENIE-WIELKOSCI-Z-KALKULATOROW": "Lista nie podaje pojemności akumulatora ani mocy panelu — dobierzesz je w kalkulatorach podlinkowanych przy pozycjach (np. „na weekend” dla liczby dni). Ilości: jedna ładowarka na telefon, jedna latarka na osobę.",
  "DG-ODLACZ-ZASILANIE": "Zapach spalenizny, stopiona izolacja albo przebarwienia oznaczają przegrzanie grożące pożarem. Natychmiast odłącz akumulator (rozłącznik albo zdejmij klemę minusową) i nie włączaj instalacji, dopóki przyczyna nie zostanie usunięta.",
  "DG-BEZPIECZNE-POMIARY": "Podczas pomiarów nie zwieraj przewodów ani zacisków — zwarcie akumulatora grozi pożarem i poparzeniem. Zdejmij biżuterię, używaj izolowanych narzędzi; dotykiem sprawdzaj tylko odłączone elementy.",
  "DG-NIE-ZNALEZIONO": "Wszystkie proste kroki wypadły dobrze — przyczyna leży poza tym przewodnikiem (np. uszkodzony regulator, BMS, przetwornica). Skontaktuj się z elektrykiem albo serwisem producenta.",
  "DG-ZALOZENIE-KROKI-EKSPERCKIE": "Kolejność kroków: od najczęstszej i najprostszej przyczyny do rzadszej. Kroki ułożone na podstawie praktyki instalatorskiej ✅🤖 (źródło podaje objawy i przykładową kolejność), bez progów liczbowych — liczby dobierzesz w podlinkowanych kalkulatorach.",
  "MED-PONIZEJ-MINIMUM-DOB": "Twój akumulator podtrzyma urządzenie ok. {doby} doby — mniej niż zalecane minimum {minimum} doby dla sprzętu medycznego. Potrzeba min. {ah} Ah albo drugiego akumulatora.",
  "MED-BRAK-ZAPASOWEGO-ZRODLA": "Urządzenie medyczne nie może zostać bez zasilania — zawsze miej drugie, niezależne źródło (drugi naładowany akumulator, powerbank zatwierdzony przez producenta, agregat) i sprawdzaj je regularnie.",
  "MED-SPRAWDZ-Z-PRODUCENTEM": "Sposób zasilania (wejście 12 V DC, falownik z czystą sinusoidą, dopuszczalne zasilacze) potwierdź w instrukcji urządzenia albo u producenta lub lekarza — ten kalkulator liczy energię, nie zastępuje zaleceń medycznych.",
  "MED-ROZWAZ-ZASILANIE-DC": "Zasilanie przez falownik 230 V traci energię i dodaje kolejny element, który może zawieść. Jeśli producent przewiduje zasilanie 12 V DC (kabel samochodowy), jest ono pewniejsze.",
  "MED-ZALOZENIE-BEZ-LADOWANIA": "Akumulator naładowany na starcie, bez ładowania przez {doby} doby — tyle ma wystarczyć na wypadek dłuższej awarii.",
  "UZF-URZADZENIE-ZABRONIONE": "„{nazwa}” ({moc} W, rozruch ok. {rozruch} W) przekracza możliwości falownika {falownik} W (szczyt {szczyt} W) — nie podłączaj go. Zrezygnuj z tego urządzenia albo zastosuj większy falownik.",
  "UZF-START-NA-PRZECIAZENIU": "„{nazwa}” wystartuje tylko dzięki przeciążalności falownika — każdy rozruch go obciąża, a przy innych włączonych urządzeniach może się wyłączyć. Rozważ większy falownik.",
  "UZF-ROZRUCH-NIEZNANY": "Dla „{nazwa}” nie podano krotności rozruchu — nie da się sprawdzić startu. Sprawdź kartę urządzenia albo zmierz miernikiem z funkcją inrush; do tego czasu traktuj je jako ryzykowne.",
  "UZF-ZALOZENIE-KAZDE-OSOBNO": "Każde urządzenie oceniane osobno, jako jedyne obciążenie falownika. Kilka urządzeń naraz — kalkulator „Przetwornice i falowniki”.",
  "BB-ZA-MALO-NA-BLACKOUT": "Na cały blackout zabraknie ok. {wh} Wh — sama stacja wystarczy na ok. {h} h. Ogranicz odbiorniki, dołóż drugą stację albo panel.",
  "BB-PANEL-SIE-NIE-MIESCI": "Panel jest szerszy niż dostępna długość balustrady — nie zmieści się. Wybierz węższy panel albo inne miejsce.",
  "BB-BEZ-KLIMATYZACJI": "Nie licz na klimatyzację, czajnik ani grzejnik w czasie blackoutu — zestaw balkonowy utrzyma tylko lodówkę, router, światło i telefony.",
  "BB-MONTAZ-NA-BALKONIE": "Panel na balustradzie musi być pewnie przykręcony (wiatr!) i nie może wystawać poza obrys balkonu. Sprawdź regulamin wspólnoty lub spółdzielni — elewacja często wymaga zgody zarządcy.",
  "BB-ZALOZENIE-SREDNIE-SLONCE": "Energia z paneli w czasie blackoutu liczona średnio: dobowa × czas blackoutu ÷ 24. Krótki blackout nocą nie dostanie słońca wcale.",
  "SZ-ZALOZENIE-PUNKT-STARTOWY": "Szablon to tylko punkt startowy — lista typowych odbiorników. Moce i czasy wpisujesz Ty; usuń, czego nie masz, dodaj, czego brakuje.",
  "SZ-ZALOZENIE-PANEL-NA-DOBE": "Panel dobrany tak, by przy średnim słońcu oddać dobowe zużycie — wtedy wystarcza akumulator na jedną dobę. W pochmurne dni potrzebny akumulator na cały pobyt.",
  "TA-OBCIAZENIE-NIE-NIZSZE": "Napięcie pod obciążeniem musi być niższe niż spoczynkowe — sprawdź pomiar (czy obciążenie było włączone, czy akumulator nie był ładowany).",
  "TA-PONIZEJ-PROGU-WYRZUCENIA": "Napięcie spoczynkowe {napiecie} V jest na lub poniżej {prog} V — taki akumulator ołowiowy zwykle nadaje się do wymiany. Próba ratowania: ekran „Ratowanie rozładowanego akumulatora”.",
  "TA-REZYSTANCJA-WZROSLA": "Rezystancja wewnętrzna {r} mΩ to +{wzrost}% względem karty ({karta} mΩ) — przekroczony próg {prog}%. Akumulator stracił sprawność; najpierw sprawdź zaciski i kable (też dodają rezystancję), potem zaplanuj wymianę.",
  "TA-BRAK-ODNIESIENIA": "Wynik niejasny — brak testu obciążeniowego albo rezystancji z karty do porównania. Wpisz je albo zleć test pojemności w warsztacie.",
  "TA-LIFEPO4-PLASKA-KRZYWA": "LiFePO4 ma płaską krzywą napięcia — napięcie spoczynkowe prawie nic nie mówi o stanie. Licz na test obciążeniowy, dane z BMS albo test pojemności.",
  "TA-ZALOZENIE-SPOCZYNEK": "Napięcie spoczynkowe mierzone po co najmniej {h} h bez obciążenia i bez ładowania — wcześniej jest zawyżone lub zaniżone.",
  "TA-ZALOZENIE-POMIAR-NA-ZACISKACH": "Rezystancja liczona z pomiaru na zaciskach akumulatora — mierząc dalej, doliczasz kable i styki.",
  "RB-BRAK-BEZPIECZNIKA-AKUMULATORA": "Brak bezpiecznika przy akumulatorze! To niebezpieczne — zwarcie przewodu może spowodować pożar. Zamontuj bezpiecznik na plusie, jak najbliżej zacisku, dobrany do przekroju przewodu.",
  "RB-NAPRAWA-DOBOR-BEZPIECZNIKOW": "Bezpieczniki do poprawy: prąd bezpiecznika musi być większy od prądu odbiorników, ale nie większy niż obciążalność przewodu, który chroni. Dobierz je kalkulatorem kabli i bezpieczników.",
  "RB-NAPRAWA-PRZEKROJE-PRZEWODOW": "Przewody do poprawy: sprawdź przekrój na prąd i spadek napięcia (w instalacji 12 V liczy się każdy metr). Za cienki przewód grzeje się i obniża napięcie na odbiorniku.",
  "RB-NAPRAWA-OCHRONA-ROZLADOWANIA": "Dodaj ochronę przed głębokim rozładowaniem: BMS (LiFePO4), odłącznik niskiego napięcia (LVD) albo odbiorniki na wyjściu obciążenia regulatora.",
  "RB-NAPRAWA-WENTYLACJA-AKUMULATORA": "Popraw wentylację akumulatora: ołowiowy (szczególnie kwasowy) wydziela przy ładowaniu wodór — potrzebny przepływ powietrza i brak iskier w pobliżu; LiFePO4 nie może się przegrzewać.",
  "RB-NAPRAWA-POLACZENIA": "Popraw połączenia: końcówki zaciśnięte praskami (nie skręcane), dokręcone z właściwym momentem, zabezpieczone przed wibracjami i korozją. Luźny styk grzeje się i bywa przyczyną pożaru.",
  "RB-NIESPRAWDZONE": "{n} punkt(ów) jeszcze niesprawdzonych — w raporcie liczą się jako niebezpieczne, dopóki ich nie sprawdzisz.",
  "RB-ZALOZENIE-SAMOOCENA": "Raport powstaje z Twoich odpowiedzi — to samoocena, nie zastępuje przeglądu instalacji przez elektryka.",
  // end of M12 30.09.2026 block
  "LVD-BRAK-OCHRONY-OLOWIOWY": "Akumulator kwasowy/AGM bez dozownika napięcia, a odbiornik nie ma własnego zabezpieczenia — odbiornik rozładuje akumulator do zera. Głębokie rozładowanie trwale niszczy akumulator ołowiowy (zasiarczenie). Zamontuj dozownik (LVD) z progiem podanym wyżej.",
  "LVD-PROG-KWASOWY-BRAK-W-ZRODLE": "Dla akumulatora kwasowego (zalewowego) nie podajemy progu — źródło daje go tylko dla AGM i LiFePO4. Sprawdź napięcie odcięcia w karcie producenta akumulatora.",
  "WMI-WILGOC-CICHY-ZABOJCA": "Wilgoć to cichy zabójca instalacji elektrycznej — powoduje korozję, zwarcia i uszkodzenia elektroniki.",
  "WMI-WILGOC-ZALECANE-IP65": "Próg minimalny IP55 spełniony, ale w miejscu narażonym na wilgoć zalecane są obudowy IP{zalecane} i puszki z uszczelką (Twoja obudowa: IP{ip}). Przewody prowadź w peszlu. Źródło podaje ten przykład dla wilgotnego garażu; aplikacja stosuje go wszędzie, gdzie jest wilgoć.",
  "WMI-ZALOZENIE-PROG-Z-M4-E10": "Minimalny stopień ochrony obudowy w miejscu narażonym na wilgoć: IP{min} — ten sam próg co w Module 4, Ekran 10 (ochrona przed wilgocią i kondensacją).",
  "WMI-NAMIOT-JACHT-PONIZEJ-IP65": "Namiot albo jacht wymaga obudowy co najmniej IP{min} (Twoja: IP{ip}) — ryzyko jest większe niż w garażu czy piwnicy (deszcz, rosa, bryzgi, słone powietrze). To praktyka przyjęta w aplikacji, nie wymóg normy.",
  "WMI-NAMIOT-JACHT-ZALECANE-IP67": "Minimum IP65 spełnione, ale w namiocie i na jachcie zalecane są obudowy IP{zalecane} lub IP68 (Twoja: IP{ip}) — odporne na zalanie i chwilowe zanurzenie. To praktyka przyjęta w aplikacji, nie wymóg normy.",
  "WMI-ZALOZENIE-PROG-NAMIOT-JACHT": "Namiot i jacht są zawsze traktowane jako narażone na wilgoć. Minimalny stopień ochrony obudowy: IP{min} (wyżej niż ogólne IP55 z Modułu 4, Ekran 10, bo ryzyko jest większe), zalecane IP{zalecane}–IP68 — praktyka przyjęta w aplikacji, nie norma.",
  "UMI-OBUDOWA-FALOWNIKA-NIEUZIEMIONA": "Obudowa falownika 230 V nie jest uziemiona albo nie wiesz, czy jest. Falownik 230 V musi mieć uziemioną obudowę — przy zwarciu do obudowy prąd płynie przez człowieka, który jej dotknie (ryzyko porażenia). Połącz zacisk uziemienia (PE) falownika z uziemieniem pojazdu lub uziomem. Ten sam przewód PE ma łączyć wszystkie metalowe obudowy, styki ochronne gniazd i podwozie (połączenie wyrównawcze) — tą drogą prąd zwarcia wraca do punktu połączenia N–PE w falowniku.",
  "UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO": "Gniazda 230 V nie mają podłączonego styku ochronnego albo nie wiesz, czy mają. Po co jest bolec: łączy metalową obudowę podłączonego urządzenia (np. czajnika, wiertarki, lodówki — urządzeń z wtyczką z otworem na bolec) z przewodem ochronnym (zielono-żółtym). Czym grozi jego brak: gdy w takim urządzeniu uszkodzi się izolacja, jego metalowa obudowa znajdzie się pod napięciem 230 V i nic tego nie zasygnalizuje — prąd popłynie dopiero przez człowieka, który jej dotknie (porażenie). Z podłączonym przewodem ochronnym prąd zwarcia płynie tym przewodem, a zabezpieczenie może wyłączyć obwód. Podłącz styki ochronne gniazd do uziemienia pojazdu lub uziomu. Urządzenia z podwójną izolacją (symbol podwójnego kwadratu, płaska wtyczka bez otworu na bolec) styku ochronnego nie potrzebują.",
  "UMI-BRAK-POLACZENIA-N-PE": "Falownik nie ma połączenia N–PE albo nie wiesz, czy ma. Ochrona na falowniku nie potrzebuje ziemi — potrzebuje zamkniętej pętli zwarcia do źródła: obudowa → przewód ochronny (PE) → punkt połączenia N z PE w falowniku → z powrotem do falownika. Bez tego punktu zwarcie na obudowę nie daje dużego prądu, więc ani bezpiecznik, ani wyłącznik różnicowoprądowy (RCD) nie wyłączą obwodu, a obudowa może zostać pod napięciem. Sprawdź instrukcję: wiele falowników z przełącznikiem sieci robi to połączenie samo, przekaźnikiem, gdy nie ma zasilania z zewnątrz. Połączenie N–PE wykonuj tylko wtedy, gdy producent na to pozwala — nigdy wbrew instrukcji. Pręt wbity w ziemię ani przewód czy łańcuch wiszący spod pojazdu nie zastąpią tego połączenia.",
  "UMI-BRAK-RCD-30MA": "Za połączeniem N–PE nie ma wyłącznika różnicowoprądowego (RCD) 30 mA albo nie wiesz, czy jest. RCD 30 mA wyłącza obwód, gdy część prądu ucieka poza przewody robocze — np. przez obudowę do PE albo przez człowieka. Do ochrony osób potrzebny jest próg 30 mA. RCD działa tylko za połączeniem N–PE (patrz pytanie o połączenie N–PE) — zamontuj go między falownikiem a gniazdami.",
  "UMI-PODWOJNE-POLACZENIE-N-PE": "Przy zasilaniu z zewnątrz (słupek na kempingu, keja) połączenie N–PE w falowniku nie jest rozłączane albo nie wiesz, czy jest. Przy zasilaniu ze słupka przewód ochronny (PE) przychodzi z sieci, a połączenie N z PE jest już po stronie sieci — w kamperze musi być wtedy rozłączone. Inaczej powstaje podwójne połączenie N–PE — norma PN-HD 60364-5-54 (543.4.3) nazywa takie ponowne połączenie N z częścią uziemioną „niedopuszczalnym”. Część prądu roboczego płynie wtedy przewodem ochronnym i podwoziem, a na obudowach pojawia się napięcie względem ziemi. Typowy objaw: wyłącznik różnicowoprądowy (RCD) na słupku wybija zaraz po podłączeniu — nie szukaj obejścia, rozłącz N–PE. Groźniej na starym słupku bez RCD: nic nie wybija, a przy przerwanym przewodzie PEN w sieci cały prąd powrotny idzie przez PE i podwozie, więc na karoserii może pojawić się niebezpieczne napięcie. Na jachcie prąd w przewodzie ochronnym przez wodę powoduje też korozję części podwodnych i grozi porażeniem pływających w marinie. Sprawdź w instrukcji, czy przełącznik sieci w falowniku rozłącza N–PE przekaźnikiem po podłączeniu zasilania z zewnątrz. Stałego mostka N–PE przy zasilaniu ze słupka nie zostawiaj.",
  "UMI-NAMIOT-WYJSCIE-PLYWAJACE": "Namiot, wyjście 230 V bez połączenia N–PE („pływające”, bez połączenia z ziemią) — tak ma większość przenośnych stacji zasilania. Pojedyncza usterka (np. dotknięcie jednego przewodu) nie grozi wtedy porażeniem, bo prąd nie ma drogi powrotnej; niebezpieczna jest druga usterka naraz. Zasady: (1) takiego wyjścia nie uziemiaj na własną rękę, jeśli producent tego nie przewiduje; (2) najbezpieczniej jedno urządzenie na jedno wyjście — norma zna taki środek ochrony pod nazwą „separacja elektryczna”; (3) wybieraj urządzenia z podwójną izolacją (symbol podwójnego kwadratu, płaska wtyczka); (4) użyj przenośnego RCD 30 mA (PRCD) między stacją a przedłużaczem — uwaga: przy wyjściu pływającym RCD może nie zadziałać, zależnie od konstrukcji stacji; sprawdź to w instrukcji, to nie jest pewnik; (5) sprzęt trzymaj nad podłogą, nie na mokrym tropiku, a złącza w obudowach IP (patrz ekran „Zabezpieczenia przeciwwilgociowe — mała instalacja”); (6) szpilka namiotowa jako uziom działa tylko wtedy, gdy instrukcja stacji przewiduje zacisk uziemienia — poza tym daje głównie fałszywe poczucie bezpieczeństwa, tak jak wiszący przewód.",
  "UMI-NAMIOT-WYJSCIE-NIEZNANE": "Namiot — nie wiesz, jakie wyjście 230 V ma stacja albo falownik. Zobacz w instrukcji: większość przenośnych stacji ma wyjście „pływające” (bez połączenia N–PE), a falownik z połączeniem N–PE wymaga RCD 30 mA i przewodu ochronnego do obudów. Do czasu sprawdzenia stosuj zasady dla wyjścia pływającego: nie uziemiaj go na własną rękę, jedno urządzenie na jedno wyjście (separacja elektryczna), urządzenia z podwójną izolacją, przenośny RCD 30 mA (PRCD) między stacją a przedłużaczem (przy wyjściu pływającym może nie zadziałać — sprawdź w instrukcji), sprzęt nad podłogą, złącza w obudowach IP. Szpilka namiotowa działa jako uziom tylko wtedy, gdy instrukcja przewiduje zacisk uziemienia.",
  "UMI-KAMPER-WISZACY-PRZEWOD": "Przewód ani łańcuch wiszący spod kampera nie jest uziemieniem — nie zapewnia ochrony przed porażeniem. Ochrona zależy od sytuacji: (1) na falowniku potrzebna jest zamknięta pętla zwarcia (połączenie wyrównawcze PE, połączenie N–PE w falowniku, RCD 30 mA), nie ziemia; (2) przy zasilaniu ze słupka przewód ochronny przychodzi z sieci, a połączenie N–PE w kamperze musi być rozłączone; (3) szpilka uziemiająca wbita w grunt ma sens przy dłuższym postoju jako dodatek — nie zastępuje połączenia wyrównawczego ani RCD.",
  "UMI-JACHT-POLACZENIE-W-JEDNYM-PUNKCIE": "Jacht — informacyjnie (zasady wg ABYC E-11 i ISO 13297, do potwierdzenia z tekstu normy): „ziemią” na jachcie jest woda. Łączy się z nią metalowy kadłub, a przy kadłubie z laminatu (GRP) blok silnika, śruby balastu albo płyta uziemiająca, do tego wspólna szyna wyrównawcza. Przewód ochronny AC, obudowy i minus DC łączy się w jednym punkcie. Przy falowniku: automatyczne połączenie N–PE, gdy jacht nie jest podłączony do kei, i RCD (w terminologii jachtowej ELCI).",
  "UMI-JACHT-KEJA-SEPARATOR-GALWANICZNY": "Jacht zasilany z kei — informacyjnie (ABYC E-11, ISO 13297 — do potwierdzenia z tekstu normy): zastosuj separator galwaniczny albo transformator separacyjny. Bez nich połączenie przewodu ochronnego z keją powoduje korozję galwaniczną części podwodnych: śruby, anod, wału.",
  "UMI-DC-BEZ-UZIEMIENIA-OCHRONNEGO": "Instalacja tylko 12/24 V DC zwykle nie wymaga uziemienia ochronnego. Jeśli dołożysz falownik 230 V, wybierz „230 V z falownika” — wtedy uziemienie jest wymagane.",
  "UMI-WILGOC-ZALECANE-UZIEMIENIE": "Miejsce wilgotne (jacht, na zewnątrz, namiot) — zalecane uziemienie instalacji, także przy samym 12/24 V DC. Wilgoć sprzyja upływom prądu i korozji połączeń. To ostrzeżenie, nie twardy stop.",
  "UMI-ZALOZENIE-BEZ-UZIOMU-BUDYNKOWEGO": "Instalacja tymczasowa lub mobilna — pełne uziemienie budynkowe (uziom prętowy, rezystancja uziemienia) nie jest tu liczone. Dla uziomu stałego zobacz Moduł 5, Ekran 9 (projekt uziemienia).",
  "UMI-ZALOZENIE-NIE-WIEM-JAK-NIE": "Odpowiedź „nie wiem” jest traktowana jak „nie” — to strona bezpieczna. Sprawdź to (tabliczka i instrukcja falownika — także połączenie N–PE, gniazdo z bolcem ochronnym, RCD 30 mA w rozdzielnicy) i popraw odpowiedź.",
  "LVD-ZALOZENIE-SKALOWANIE-SZEREGOWE": "Próg dla 12 V ze źródła przeliczony na ogniwo i pomnożony ×{krotnosc} — akumulator o wyższym napięciu to ogniwa połączone szeregowo.",
  "LVD-ZALOZENIE-SPOJNE-Z-M4-E31": "LiFePO4: 2,75 V na ogniwo — ten sam punkt co w Module 4 (napięcie odcięcia a żywotność): ok. 80% DoD i ok. 5000 cykli.",
  "U12-TOLERANCJA-POZA-ZAKRESEM": "Tolerancja napięcia urządzenia musi być z przedziału 0–99%.",
  "U12-MAKS-LADOWANIA-PONIZEJ-ZNAMIONOWEGO": "Maks. napięcie ładowania {maks} V jest niższe niż napięcie znamionowe instalacji {system} V — to niemożliwe. Sprawdź, czy wpisujesz wartość dla całej instalacji (np. 24 V → ok. 28–29 V), a nie dla jednego akumulatora 12 V.",
  "U12-PRZEPIECIE-PRZY-LADOWANIU": "Przy ładowaniu akumulator ma do {aku} V, a urządzenie znosi najwyżej {urzadzenie} V — wprost na akumulatorze może zostać uszkodzone. Zasil je przez stabilizator lub przetwornicę DC-DC.",
  "U12-ZA-NISKIE-PRZY-ROZLADOWANIU": "Rozładowany akumulator ma ok. {aku} V, a urządzenie potrzebuje co najmniej {urzadzenie} V — pod koniec rozładowania może się wyłączać lub działać niestabilnie.",
  "U12-PRZEZ-STABILIZATOR": "Zasilanie przez stabilizator: sprawdź w jego karcie, że zakres wejścia obejmuje {min}–{max} V (cały zakres pracy akumulatora).",
  "U12-ZALOZENIE-ZAKRES-AKU": "Realne napięcie akumulatora to nie stałe 12 V z etykiety: dolna granica 11 V na każde 12 V (rozładowany), górna — maks. napięcie ładowania z ustawień Twojego regulatora lub ładowarki.",
  "U12-ZALOZENIE-24V-SZEREGOWO": "Instalacja 24 V to dwa akumulatory 12 V w szeregu — dolna granica ×2 (22 V).",
  "PST-PRZEKROCZONE-NAPIECIE-WEJSCIA": "W mrozie panele dadzą do {voc} V, a wejście solarne stacji przyjmuje najwyżej {limit} V — stacja zostanie uszkodzona. Zmniejsz liczbę paneli w szeregu albo połącz je równolegle.",
  "PST-BLISKO-LIMITU-NAPIECIA": "W mrozie panele dadzą {voc} V — powyżej 95% limitu wejścia stacji ({limit} V). Mieści się, ale bez zapasu; mroźniejszy dzień niż zakładany przekroczy limit.",
  "PST-PRAD-POWYZEJ-LIMITU": "Prąd zwarciowy paneli {isc} A przekracza max prąd wejścia stacji {limit} A. Część stacji sama ogranicza prąd, część nie — sprawdź w instrukcji, czy takie podłączenie jest dozwolone.",
  "PST-SPRAWDZ-POLARYZACJE": "Przed podłączeniem sprawdź polaryzację przejściówki (np. MC4 → XT60/Anderson) — odwrotne podłączenie może uszkodzić wejście stacji.",
  "PST-ZALOZENIE-VOC-W-MROZIE": "Napięcie jałowe rośnie w zimnie — liczone dla najniższej wpisanej temperatury tym samym wzorem co zimowy stress-test MPPT (Moduł 3).",
  "PST-ZALOZENIE-PRAD-NIESPRAWDZONY": "Prąd nie sprawdzony — wpisz Isc panelu i max prąd wejścia stacji, żeby go porównać.",
  "ZPU-GODZIN-PONAD-DOBE": "Czas pracy musi być z przedziału 0–24 h na dobę.",
  "ZPU-WSPOLCZYNNIK-POZA-ZAKRESEM": "Współczynnik pracy musi być z przedziału 0–100%.",
  "ZPU-CYKLICZNE-REALNIE-MNIEJ": "{nazwa}: realnie ok. {realne} Wh na dobę, nie {znamionowe} Wh, jak sugerowałaby sama moc znamionowa — sprężarka nie pracuje bez przerwy.",
  "ZPU-ZALOZENIE-WSPOLCZYNNIK-ZALEZY-OD-TEMPERATURY": "Współczynnik pracy sprężarki rośnie z temperaturą otoczenia i częstym otwieraniem — w upale zużycie będzie wyższe niż dla wpisanej wartości.",
  "GZ-PRZECIAZENIE-GNIAZDA": "Urządzenia pobierają razem {prad} A, a bezpiecznik gniazda ma {bezpiecznik} A (najwyżej {mocMax} W) — bezpiecznik się przepali albo, przy zbyt dużym bezpieczniku, przegrzeją się przewody instalacji pojazdu. Odłącz część urządzeń albo zasil duże odbiorniki wprost z akumulatora osobnym, zabezpieczonym przewodem.",
  "GZ-ZALOZENIE-NAPIECIE-ZNAMIONOWE": "Prąd liczony z napięcia znamionowego (12/24 V). Przy pracującym silniku napięcie jest wyższe, a prąd nieco niższy — wynik jest po stronie bezpiecznej.",
  "GZ-ZALOZENIE-ROZRUCH": "Moc znamionowa, bez prądu rozruchowego — sprężarka (lodówka, kompresor do opon) chwilowo pobiera więcej, dlatego urządzenia blisko limitu mogą przepalać bezpiecznik przy starcie.",
  "RAM-KRYTYCZNIE-ROZLADOWANY": "{napiecie} V to poniżej {prog} V — akumulator jest krytycznie rozładowany. Nie ładuj go zwykłym prostownikiem pełnym prądem: najpierw ocena zasiarczenia, potem ładowarka z trybem regeneracji.",
  "RAM-LIFEPO4-ZMIERZ-OGNIWA": "LiFePO4: procedura ratowania opiera się na napięciu każdego ogniwa osobno (BMS mógł odciąć pakiet) — zmierz ogniwa, nie tylko zaciski akumulatora.",
  "RAM-ZALOZENIE-ODSYLACZ": "Ten ekran tylko kieruje do pełnych procedur w sekcji Montaż baterii — nie powiela ich, żeby nie było trzech różnych wersji tej samej instrukcji.",
  "BK-OLOW-BEZ-WENTYLACJI": "Akumulator ołowiowy (kwasowy/AGM) w kamperze musi być w skrzyni wentylowanej na zewnątrz — wydziela wodór, a w zamkniętej zabudowie to ryzyko wybuchu.",
  "BK-LIFEPO4-WEWNATRZ": "LiFePO4 można montować wewnątrz zabudowy, ale musi być stabilnie zamocowany.",
  "LG-OLOW-BEZ-WENTYLACJI": "Ładowanie akumulatora kwasowego/AGM w zamkniętym garażu grozi wybuchem wodoru! Otwórz drzwi lub zastosuj wentylację mechaniczną.",
  "LG-LIFEPO4-BEZ-GAZOW": "LiFePO4 nie wydziela gazów — ładowanie w garażu jest bezpieczne, o ile ładowarka jest przeznaczona dla tej chemii.",
  "MK-BEZPIECZNIK-NIE-CHRONI-KABLA": "Przekrój {przekroj} mm² jest poniżej minimum: bezpiecznik musi mieć co najmniej {bezpiecznik} A, a ten kabel znosi tylko {iz} A — przy przeciążeniu kabel przegrzeje się, zanim bezpiecznik zadziała. Minimum: {wymagany} mm².",
  "MK-BRAK-PRZEKROJU-DLA-BEZPIECZNIKA": "Żaden przekrój z tablicy (do 35 mm²) nie ma obciążalności co najmniej {bezpiecznik} A, której wymaga bezpiecznik — rozdziel obwód albo przejdź na wyższe napięcie instalacji.",
  "MK-KOORDYNACJA-PODNIOSLA-PRZEKROJ": "Ze spadku napięcia i obciążalności wystarczyłoby {zSpadku} mm², ale bezpiecznik 1,25 × I nie chroniłby takiego kabla przed przeciążeniem — dobrano {przekroj} mm².",
  "MK-POJAZD-WIBRACJE": "W pojeździe użyj bezpiecznika z certyfikatem do zastosowań mobilnych (wibracje), prowadź przewody w peszlach ochronnych i nie używaj przewodów głośnikowych do zasilania.",
  "MK-ZALOZENIE-ECHO-M5": "Te same kalkulatory co Moduł 5: przekrój (obciążalność wg PN-HD 60364-5-52 + spadek napięcia z drogą powrotną prądu, 2L) i bezpiecznik 1,25 × I, sprawdzone warunkiem PN-IEC 60364-4-43 (433.2): I ≤ In ≤ Iz. Przewody miedziane.",
  "MK-ZALOZENIE-I2-NIELICZONE": "Drugi warunek normy (prąd zadziałania bezpiecznika I₂ ≤ 1,45 × Iz) wymaga danych z karty bezpiecznika — nie jest tu sprawdzany. Bezpiecznik dobierz jako najbliższy wyższy dostępny od podanego minimum.",
  "MK-ZALOZENIE-PRZEWODY-INSTALACYJNE": "Obciążalność z tablic dla przewodów instalacyjnych w izolacji PVC (np. H07V-K). Przewody samochodowe (np. FLRY) mają osobne tablice, których tu nie ma — przy nich kieruj się danymi producenta przewodu.",
  "POJC-ZALACZNIK-A-PRZYBLIZENIE": "Pojemność liczona metodą uproszczoną EN ISO 13786, Załącznik A (grubość efektywna dla wahań dobowych). To przybliżenie: rzeczywista warstwa czynna to 40–120 % przyjętej, a dla drewna i betonu komórkowego metoda może pojemność zawyżać. Nie planuj ochrony przed mrozem na styk z tym czasem.",
  "POJC-ELEMENT-CIENSZY-NIZ-WARSTWA": "„{nazwa}”: grubość całej przegrody ({element} cm) nie może być mniejsza niż grubość warstwy masywnej ({warstwa} cm).",
  "POJC-GRANICA-NIEOSIAGALNA": "Bez ogrzewania dom ustali się na ok. {rownowaga} °C — w tym modelu nie spadnie do {granica} °C.",
  "POJC-BRAK-WYCHLADZANIA": "Temperatura początkowa {start} °C nie jest wyższa niż temperatura, do której dąży dom bez ogrzewania (ok. {rownowaga} °C) — w tych warunkach dom się nie wychładza.",
  "POJC-GRANICA-NIE-NIZSZA": "Temperatura graniczna {granica} °C musi być niższa niż temperatura początkowa {start} °C.",
  "POJC-ZALOZENIE-JEDEN-WEZEL": "Cały dom jako jeden węzeł o jednej temperaturze: wychładzanie wykładnicze θ(t) = θ∞ + (θ0 − θ∞)·e^(−t/τ), τ = C/H. Pomieszczenia przy ścianach zewnętrznych wychłodzą się szybciej niż środek domu.",
  "POJC-ZALOZENIE-BEZ-ZYSKOW": "Bez zysków od słońca, ludzi i urządzeń — w dzień realny spadek będzie wolniejszy, w nocy zbliżony do wyniku.",
  "POJC-ZALOZENIE-STALA-TEMP-ZEWN": "Temperatura na zewnątrz i w strefach nieogrzewanych stała przez cały czas awarii; straty H z Ekranu 1 (przenikanie + wentylacja).",
  "POJC-ZALOZENIE-ZALACZNIK-A": "Ciepło przy wychładzaniu oddaje tylko warstwa przy powierzchni: grubość czynna = najmniejsza z: połowa grubości przegrody, grubość materiału do pierwszej warstwy izolacji, {dMax} mm (EN ISO 13786, Tablica A.1, okres 1 doby). Ściany wewnątrz domu pracują obiema stronami. Uwzględniony opór przejmowania ciepła {rsi} m²·K/W (wzór A.4). Pełna masa przegród podana osobno — pracuje dopiero przy wychładzaniu trwającym wiele dni.",
  // M14 „Dom – sieć” / „Firma – sieć” (lib/core/modules/siec, 28.09.2026).
  "SIEC-WARTOSC-UJEMNA": "Wpisana wartość nie może być ujemna (pole: {pole}).",
  "SIEC-GRUPA-NIEZGODNA-Z-SEGMENTEM": "Grupa {grupa} nie pasuje do tego kafla: dom rozlicza się w grupach G, firma w grupach C.",
  "SIEC-GRUPA-NIEZGODNA-Z-MOCA": "Grupa {grupa} nie jest dostępna przy mocy umownej {moc} kW: C11/C12a/C12b do 40 kW, C21/C22a/C22b powyżej 40 kW.",
  "SIEC-STREFA-SPOZA-GRUPY": "Strefa „{strefa}” nie występuje w grupie {grupa} — wpisz zużycie w strefach tej grupy.",
  "SIEC-ENERGIA-MOCOWA-PONAD-ZUZYCIE": "Energia pobrana w dni robocze 7:00–22:00 nie może być większa niż całe zużycie roczne.",
  "SIEC-MIESIACE-NIEPOPRAWNE": "Dane miesięczne muszą mieć 12 wartości nieujemnych (styczeń–grudzień).",
  "SIEC-BRAK-ZUZYCIE": "Brak zużycia — wpisz roczne zużycie w strefach z faktur.",
  "SIEC-BRAK-MOCUMOWNA": "Brak mocy umownej — wpisz ją z umowy albo faktury.",
  "SIEC-BRAK-CENAENERGII": "Brak ceny energii — wpisz cenę netto z faktury sprzedawcy (dla każdej strefy z poborem). Aplikacja nie ma dla niej wartości domyślnej.",
  "SIEC-BRAK-OPLATAHANDLOWA": "Brak opłaty handlowej — wpisz ją z faktury (0, jeśli jej nie ma).",
  "SIEC-BRAK-SIECIOWAZMIENNA": "Brak składnika zmiennego stawki sieciowej dla tego OSD i grupy w danych taryf 2026 — wpisz go z faktury („moje dane z faktury”).",
  "SIEC-BRAK-SIECIOWASTALA": "Brak składnika stałego stawki sieciowej dla tego OSD i grupy w danych taryf 2026 — wpisz go z faktury.",
  "SIEC-BRAK-ABONAMENT": "Brak opłaty abonamentowej dla tego OSD, grupy i okresu rozliczeniowego w danych — wpisz ją z faktury.",
  "SIEC-BRAK-JAKOSCIOWA": "Brak stawki jakościowej na tę datę — wpisz ją z faktury.",
  "SIEC-BRAK-OZE": "Brak opłaty OZE na tę datę — wpisz ją z faktury.",
  "SIEC-BRAK-KOGENERACYJNA": "Brak opłaty kogeneracyjnej na tę datę — wpisz ją z faktury.",
  "SIEC-BRAK-MOCOWA": "Brak stawki opłaty mocowej na tę datę — wpisz ją z faktury.",
  "SIEC-BRAK-ENERGIAMOCOWA": "Brak energii pobranej w dni robocze 7:00–22:00 — potrzebna do opłaty mocowej firmy (faktura albo portal OSD).",
  "SIEC-BRAK-VAT": "Brak stawki VAT na tę datę w danych — wpisz dane z faktury.",
  "SIEC-STAWKI-PO-WAZNOSCI": "Stawki w aplikacji są ważne do {waznoscDo} — mogą być nieaktualne, sprawdź fakturę.",
  "SIEC-STAWKA-NAJDLUZEJ": "Stawka zmienia się w ciągu roku (np. jakościowa od 1.02.2026), a nie podano zużycia miesięcznego — przyjęto stawkę obowiązującą najdłużej.",
  "SIEC-BRAK-WARIANTOW": "Dodaj co najmniej jedną grupę taryfową do porównania.",
  "SIEC-GRUPA-POWTORZONA": "Grupa {grupa} jest na liście więcej niż raz.",
  "SIEC-ROZNE-ZUZYCIE-WARIANTOW": "Zużycie roczne porównywanych grup różni się ({min}–{max} kWh) — porównanie jest uczciwe tylko przy tym samym zużyciu rozłożonym na strefy.",
  "SIEC-HORYZONT-POZA-ZAKRESEM": "Horyzont musi być liczbą całkowitą lat z zakresu {min}–{max}.",
  "SIEC-KOSZT-UJEMNY": "Koszt roczny nie może być ujemny.",
  "SIEC-SUWAK-POZA-LISTA": "Suwak ma tylko wartości −3, 0, +5 i +10 %/rok — to wartości wrażliwości, nie prognoza.",
  "SIEC-INFLACJA-NIEPOPRAWNA": "Wpisz własną inflację w % rocznie (liczba większa niż −100).",
  "SIEC-POZA-PROJEKCJA-UE": "Projekcja UE kończy się w {rokOstatni} r., a horyzont sięga {rokKoncowy} r. — skróć horyzont albo wybierz „Suwak %”. Aplikacja nie przedłuża projekcji na własną rękę.",
  "SIEC-UE-ZALOZENIA-2019": "Projekcja przyjmuje politykę z końca 2019 r. Nie uwzględnia kryzysu cen 2021–2023, pakietu Fit for 55 ani ETS2. To oficjalny scenariusz odniesienia UE, a nie przewidywanie Twojego rachunku.",
  "SIEC-ZRODLO-SCIEZKI-UE": "Dynamika cen: Komisja Europejska, EU Reference Scenario 2020, Polska, średnia cena energii elektrycznej dla odbiorców końcowych (ceny stałe, ponad inflację), odczyt {stanNa}. Między punktami 5-letnimi interpolacja geometryczna; poziom w €/MWh nie jest używany.",
  "SIEC-SUWAK-PONAD-INFLACJE": "Zmiana ceny energii {g} %/rok ponad inflację — wynik w dzisiejszych złotych (r = 0).",
  "SIEC-INFLACJA-FISHER": "Inflacja {pi} %/rok doliczona mnożeniem (Fisher): indeks = indeks UE × (1 + π)^t. Suma nominalna to kwoty do zapłaty; ranking liczy się w dzisiejszych złotych.",
  "SIEC-ZALOZENIE-NETTO-VAT": "Stawki netto z taryf 2026, VAT {vat}% doliczony na końcu (akcyza jest już w cenie energii).",
  "SIEC-ZALOZENIE-NETTO": "Kwoty netto (bez VAT).",
  "SIEC-ZALOZENIE-PRZEJSCIOWA-ZNIESIONA": "Opłata przejściowa zniesiona od 1.01.2026 — nie występuje w rachunku.",
  "SIEC-ZALOZENIE-ZRODLO-DANYCH": "Stawki z pliku danych „rozliczenia-pl-2026” (odczyt pierwotny taryf OSD i Informacji Prezesa URE, stan na {stanNa}, ważne do {waznoscDo}). Wartości wpisane z faktury mają pierwszeństwo.",
  "SIEC-ZALOZENIE-MOCOWA-G-STALA": "Opłata mocowa w grupie G to ryczałt miesięczny wg progu rocznego zużycia — liczona jako składnik stały „ceny trzymania sieci” (zmienia się tylko skokowo na progu).",
  "SIEC-ZALOZENIE-POROWNANIE-TYLKO-TARYFA": "Porównanie tylko na stawkach z danych taryf 2026 — grupy bez takich danych są wyłączone, nie szacowane. Podział zużycia na strefy podajesz sam dla każdej grupy.",
  "SIEC-DEPOZYT-POZA-OKRESEM": "Dla tego miesiąca nie ma w danych współczynnika depozytu 1,23 (obowiązuje od 1.02.2025) — kalkulator go nie liczy.",
  "SIEC-DEPOZYT-WYKORZYSTANO-PONAD": "Wykorzystana kwota nie może być większa niż depozyt z tego miesiąca.",
  "SIEC-DEPOZYT-UTRATA-PRZY-ODEJSCIU": "Rozwiązanie umowy kończy rozliczenia prosumenckie — przed odejściem z sieci wykorzystaj saldo depozytu, inaczej przepadnie poza częściowym zwrotem.",
  "SIEC-DECYZJA-JEDNOKIERUNKOWA": "Przejście z RCEm na RCE oraz z net-meteringu na net-billing jest nieodwracalne (ustawa o OZE, art. 4b ust. 2b, art. 4d ust. 1).",
  "SIEC-DEPOZYT-ZALOZENIE-PODSTAWA": "Ustawa o OZE (t.j. Dz.U. 2026 poz. 68): depozyt = wartość energii × {wsp} (art. 4c ust. 4), niewykorzystany zwracany najwyżej w {zwrot}% wartości energii (art. 4 ust. 11a), reszta umarzana po 12 miesiącach (art. 4c ust. 6).",
  "SIEC-DEPOZYT-ZALOZENIE-UJEMNA-RCE": "Godziny z ujemną RCE liczą się jako 0 (art. 4b ust. 2 pkt 2) — wpisz średnią cenę już z tą zasadą.",
  "SIEC-LICZNIK-ROZNICA-BEZ-WERDYKTU": "Różnica pokazana informacyjnie — aplikacja nie zna klasy dokładności Twojego licznika, więc nie ocenia, czy licznik jest wadliwy. Przy wątpliwościach złóż reklamację i zażądaj badania.",
  "SIEC-LICZNIK-ZALOZENIE-JEDEN-ODBIORNIK": "Test ma sens, gdy w czasie pomiaru pracuje tylko znany odbiornik (reszta obwodów wyłączona), a czas liczysz dla pełnych impulsów.",
  "SIEC-TGFI0-PONIZEJ-MINIMUM": "tgφ₀ nie może być mniejszy niż {min} (taryfy OSD 2026).",
  "SIEC-TGFI-CEL-NIE-PONIZEJ-TGFI0": "Docelowy tgφ nie jest niższy niż tgφ₀ — po kompensacji opłata może nie zniknąć. Wybierz cel z zapasem poniżej tgφ₀.",
  "SIEC-TGFI-CEL-NIE-MNIEJSZY": "Docelowy tgφ nie jest mniejszy od obecnego — kompensacja jest zbędna.",
  "SIEC-PRZEKOMPENSOWANIE": "Uwaga na przekompensowanie: bateria kondensatorów bez automatycznej regulacji w nocy i w weekend oddaje energię pojemnościową, rozliczaną w całości (nie od nadwyżki).",
  "SIEC-MOC-BIERNA-CZY-DOTYCZY": "Na niskim napięciu opłata za energię bierną obowiązuje tylko wtedy, gdy przewiduje ją umowa lub warunki przyłączenia — sprawdź, czy masz tę pozycję na fakturze.",
  "SIEC-MOC-BIERNA-ZALOZENIE-K": "Krotność k = {k} dla niskiego napięcia (taryfy OSD 2026: Tauron, Energa, Stoen); wzór z pierwiastkiem jak w taryfach.",
  "SIEC-MOC-BIERNA-ZALOZENIE-CRK": "C_rk to cena energii ogłoszona przez Prezesa URE (art. 23 ust. 2 pkt 18 lit. b Prawa energetycznego), obowiązująca w dniu zatwierdzenia taryfy — nie cena z Twojej faktury za energię. Wpisz ją z faktury za energię bierną.",
  "SIEC-MOC-UMOWNA-TYLKO-C": "Przekroczenia mocy umownej liczymy dla grup C (firma), nie dla {grupa}.",
  "SIEC-PRZEKROCZENIA-GORNE-OSZACOWANIE": "Wariant „suma 10 największych nadwyżek” bez podanych 10 wartości w miesiącach {miesiace} — przyjęto 10 × największa nadwyżka, czyli górne oszacowanie opłaty.",
  "SIEC-NIEPELNY-ROK": "Wpisano {n} z 12 miesięcy — koszt roczny i optymalna moc umowna nie obejmują brakujących miesięcy.",
  "SIEC-OPTIMUM-W-GRUPIE": "Optymalną moc szukamy w zakresie Twojej grupy (C1x do 40 kW, C2x powyżej) co 1 kW — przejście między C1x i C2x zmienia stawki, porównaj je w porównywarce taryf.",
  "SIEC-MOC-UMOWNA-STALA-TARYFA": "Składnik stały stawki sieciowej {stala} zł/kW/mies. z taryfy OSD 2026.",
  "SIEC-MOC-UMOWNA-STALA-FAKTURA": "Składnik stały stawki sieciowej {stala} zł/kW/mies. z Twojej faktury.",
  "SIEC-MOC-UMOWNA-WARIANT-SUMA10": "Opłata = składnik stały × suma 10 największych nadwyżek mocy (pomiar 15-minutowy), za każdy miesiąc z przekroczeniem.",
  "SIEC-MOC-UMOWNA-WARIANT-10XMAX": "Opłata = składnik stały × 10 × największa nadwyżka mocy — gdy układ pomiarowy nie pozwala zmierzyć 10 nadwyżek.",
  "SIEC-PRZESUNIECIE-POZA-ZAKRESEM": "Przesunięcie poboru musi być z zakresu 0–100%.",
  "SIEC-MOCOWA-STAWKA-URE": "Stawka {stawka} zł/kWh netto za energię pobraną w dni robocze 7:00–22:00 (Informacja Prezesa URE nr 58/2025).",
  "SIEC-MOCOWA-STAWKA-FAKTURA": "Stawka {stawka} zł/kWh z Twojej faktury.",
  "SIEC-UDZIAL-POZA-ZAKRESEM": "Udział w polu „{pole}” musi być większy od 0 i nie większy niż 100%.",
  "SIEC-BILANS-MODEL-MIESIECZNY": "Bilans miesięczny: magazyn przenosi najwyżej jeden pełny cykl na dobę — to górne oszacowanie, nie symulacja dzień po dniu. Serie pochmurnych dni sprawdza stress-test zimowy (M7).",
  "SIEC-BILANS-NIEDOBOR-ZIMA": "Bez sieci w miesiącach {miesiace} brakuje łącznie ok. {kwh} kWh — tę energię musi dać agregat albo trzeba zwiększyć PV, magazyn lub ograniczyć zużycie.",
  "SIEC-BILANS-NIEDOBOR-POZA-ZIMA": "Niedobór bez sieci występuje także poza zimą: {miesiace}.",
  "SIEC-BILANS-ZALOZENIE-PVGIS": "Produkcja PV miesiąc po miesiącu z danych PVGIS dla Twojej lokalizacji i kąta (Moduł 3) — bez stałej „zima = x% lata”.",
  "SIEC-BILANS-ZALOZENIE-AUTOKONSUMPCJA": "Autokonsumpcja bezpośrednia {procent}% produkcji PV — Twoja wartość (np. z aplikacji falownika). Standardowych profili zużycia OSD jeszcze nie ma w aplikacji.",
  "SIEC-BILANS-ZALOZENIE-CYKL": "Magazyn: sprawność w cyklu {sprawnosc}%, najwyżej jeden pełny cykl pojemności użytecznej na dobę.",
  "SIEC-TCO-D-BEZ-AGREGATU": "STOP: w scenariuszu D bez sieci brakuje ok. {kwh} kWh rocznie, a nie ma agregatu. Dom zostanie bez prądu — dodaj agregat albo zwiększ PV i magazyn.",
  "SIEC-TCO-D-ZALEZNI-MEDYCZNIE": "STOP: ktoś w domu zależy od zasilanego sprzętu medycznego, a scenariusz D nie ma redundantnego zapasu (drugiego, niezależnego źródła). Awaria jedynego źródła zagraża życiu.",
  "SIEC-TCO-D-RYZYKOWNE": "D ryzykowne: agregat pracuje do {godziny} h w miesiącu, więcej niż Twój próg {prog} h.",
  "SIEC-TCO-D-NIEODWRACALNE": "Pełne odłączenie jest praktycznie nieodwracalne: umowa rozwiązana, licznik zdjęty, powrót to nowe przyłączenie (koszt i czas OSD).",
  "SIEC-TCO-UTRATA-ROZLICZEN": "W scenariuszach C i D energia nie jest oddawana: tracisz depozyt prosumencki lub opusty, a odłączenie w okresie trwałości projektu może oznaczać zwrot dotacji — sprawdź regulamin.",
  "SIEC-TCO-PRACA-ROWNOLEGLA": "Scenariusze A i B pracują równolegle z siecią: instalację trzeba zgłosić do OSD, a falownik musi mieć certyfikat NC RfG (także przy „zero oddawania”).",
  "SIEC-TCO-C-PRZELACZNIK": "Scenariusz C wymaga przełącznika sieć – 0 – wyspa z blokadą (fazy i N) — szczegóły na ekranie „Przełącznik sieć/wyspa i bezpieczeństwo”.",
  "SIEC-TCO-WARUNEK-M7": "Dla C i D to bilans miesięczny, nie stress-test zimowy. Warunek konieczny odłączenia: sprawdź serię pochmurnych dni, DoD i temperaturę magazynu na ekranie „Zima bez sieci”.",
  "SIEC-TCO-SALDO-OBCIETE": "Scenariusz {scenariusz}: wartość energii oddanej przewyższa koszt zmienny poboru — przyjęto, że płacisz tylko opłaty stałe (nadwyżki depozytu nie wypłaca się w całości).",
  "SIEC-TCO-RF1": "Ciągłość działalności: firma znosi najwyżej {h} h bez zasilania. W tym czasie zapas musi dać co najmniej ok. {kwh} kWh (średni pobór × czas — dolne oszacowanie), a D nie ma redundantnego zapasu.",
  "SIEC-TCO-RF1-INFO": "Ciągłość działalności: dopuszczalne {h} h bez zasilania — zapas redundantny musi dać co najmniej ok. {kwh} kWh (średni pobór × czas — dolne oszacowanie; szczyty poboru są większe).",
  "SIEC-TCO-BRAK-SCENARIUSZY": "Wpisz koszt inwestycji przynajmniej w jednym scenariuszu (A, B, C albo D).",
  "SIEC-TCO-ZALOZENIE-DYSKONTO": "Stopa dyskontowa r = {r} %/rok (0 = tryb prosty, bez dyskonta).",
  "SIEC-TCO-ZALOZENIE-NADWYZKA": "Wartość energii oddanej pomniejsza tylko koszt zmienny poboru, nie opłaty stałe; ścieżka cen dotyczy obu jednakowo. Dokładne zasady rozliczenia depozytu — ekran „Net-metering, net-billing, depozyt”.",
  "SIEC-TCO-ZALOZENIE-REZYDUALNA": "Wartość rezydualna liczona tylko dla magazynu, liniowo do pozostałej żywotności; wymiana magazynu po każdym okresie żywotności w cenie z roku wymiany. PV i agregat bez wartości rezydualnej (ostrożnie).",
  "SIEC-BRAK-KOSZTSTALY": "Brak „ceny trzymania sieci” (opłaty stałe brutto na rok) — policz ją na ekranie „Mój rachunek dziś” albo wpisz z faktury.",
  "SIEC-BRAK-CENAZMIENNA": "Brak kosztu zmiennego 1 kWh pobranej (brutto) — z ekranu „Mój rachunek dziś” albo z faktury.",
  "SIEC-BRAK-WARTOSCNADWYZKI": "Brak wartości 1 kWh oddanej do sieci — policz ją na ekranie depozytu (0, jeśli nic nie oddajesz).",
  "SIEC-BRAK-ZYWOTNOSCMAGAZYNU": "Brak żywotności magazynu w latach — z karty katalogowej (liczba cykli) albo z ekranu magazynu (M4).",
  "SIEC-BRAK-OSOBYZALEZNE": "Odpowiedz, czy ktoś w domu lub firmie zależy od zasilanego sprzętu medycznego — bez tego scenariusz D nie zostanie oceniony.",
  "SIEC-BRAK-DOPUSZCZALNYCZAS": "Firma: wpisz dopuszczalny czas bez zasilania (godziny) — bez tego scenariusz D nie zostanie oceniony (RF1).",
  "SIEC-BRAK-BILANS": "Do bilansu brakuje danych: przy PV wpisz autokonsumpcję bezpośrednią, przy magazynie — jego sprawność.",
  "SIEC-BRAK-AGREGAT": "Brak zużycia paliwa (l/h) albo ceny paliwa agregatu — potrzebne do kosztu scenariusza D.",
  "SIEC-BACKFEED": "STOP: instalacja wyspowa albo agregat może podać napięcie do sieci OSD — brak przełącznika z pozycją 0 i blokadą. Grozi porażeniem monterów pracujących na „wyłączonej” linii. Wymagany przełącznik sieć – 0 – wyspa z blokadą mechaniczną albo SZR z blokadą elektryczną i mechaniczną.",
  "SIEC-PRZELACZNIK-N": "Przełączane muszą być przewody fazowe i neutralny (N) — zgodnie z układem sieci. Ustal to z elektrykiem z uprawnieniami; szczegół normowy (HD 60364-5-551) jest do doprecyzowania.",
  "SIEC-PRZELACZNIK-OK": "Przełącznik z pozycją 0 i blokadą (albo SZR z blokadą elektryczną i mechaniczną) wyklucza jednoczesne połączenie wyspy i sieci.",
  "SIEC-ROWNOLEGLE-BEZ-ZGLOSZENIA": "Falownik pracujący równolegle z siecią bez zgłoszenia mikroinstalacji do OSD — także przy „zero oddawania”. Zgłoś instalację (z certyfikatem NC RfG) przed uruchomieniem.",
  "SIEC-PRZELACZNIK-NORMA-BRAK": "Szczegółowe wymagania dla przełącznika i agregatu zasilającego instalację opisuje HD 60364-5-551 — tej normy nie ma jeszcze w aplikacji. Wykonanie i pomiary zleć osobie z uprawnieniami.",
  "SIEC-POWROT-NIEODWRACALNE": "Odłączenie jest praktycznie nieodwracalne: powrót to nowy wniosek o przyłączenie, nowe warunki, opłata przyłączeniowa, miesiące oczekiwania i ryzyko odmowy przy braku warunków technicznych.",
  "SIEC-POWROT-WYCENA-INDYWIDUALNA": "Powyżej standardowej odległości z taryfy OSD opłata liczona jest według rzeczywistych nakładów — wycena indywidualna OSD. Aplikacja pokazuje tylko wzór.",
  "SIEC-POWROT-ZALOZENIE-GRUPY": "Wzór dla grup przyłączeniowych IV–VI przy standardowej odległości; kwota netto, stawka z taryfy Twojego OSD.",
  "SIEC-POWROT-ZALOZENIE-CZAS": "Czas powrotu to wydanie warunków przyłączenia plus budowa — zwykle liczony w miesiącach; aplikacja nie podaje liczby.",
  "SIEC-BRAK-TRYBPRACY": "Wybierz, jak instalacja styka się z siecią: przełączana, równolegle czy bez sieci.",
  "SIEC-BRAK-PRZELACZNIK": "Wybierz rodzaj przełącznika sieć/wyspa.",
  "SIEC-BRAK-MOCPRZYLACZENIOWA": "Wpisz moc przyłączeniową (z umowy albo warunków przyłączenia).",
  "SIEC-BRAK-STAWKAPRZYLACZENIOWA": "Wpisz stawkę opłaty przyłączeniowej z taryfy Twojego OSD [zł/kW] — aplikacja jeszcze jej nie ma.",
  "SIEC-BRAK-ODLEGLOSC": "Zaznacz, czy odległość od sieci mieści się w standardowej odległości z taryfy OSD.",
  "SIEC-BESS-MOC-C1X": "W grupach C1x opłata stała zależy od mocy umownej, ale moc umowną zmienia się wnioskiem do OSD — zwykle bez magazynu. Redukcja opłat za moc przez magazyn jest realna głównie w C2x i przy przekroczeniach.",
  "SIEC-BESS-USLUGI-SYSTEMOWE": "Usługi systemowe (rynek bilansujący, rynek mocy) są dla małych magazynów praktycznie niedostępne bez agregatora — nie liczymy ich jako korzyści.",
  "SIEC-BESS-STRATNA-AUTOKONSUMPCJA": "Autokonsumpcja daje {zysk} zł na 1 kWh, a zużycie magazynu kosztuje {koszt} zł na 1 kWh — na tym strumieniu magazyn traci.",
  "SIEC-BESS-STRATNY-ARBITRAZ": "Arbitraż daje {zysk} zł na 1 kWh, a zużycie magazynu kosztuje {koszt} zł na 1 kWh — na tym strumieniu magazyn traci.",
  "SIEC-BESS-MOCOWA-PONAD-PRZEPLYW": "Energia oddana w godzinach 7:00–22:00 nie może być większa niż cała energia przepuszczona przez magazyn (autokonsumpcja + arbitraż).",
  "SIEC-BESS-ZALOZENIE-MOCOWA-OSOBNO": "Opłatę mocową ({stawka} zł/kWh, dni robocze 7:00–22:00) liczymy osobno — w zysku autokonsumpcji i arbitrażu jej nie wpisuj.",
  "SIEC-BRAK-KOSZTCYKLU": "Brak kosztu 1 kWh z magazynu — policz go w „Analizie opłacalności magazynu” (cena, pojemność, cykle, sprawność).",
  "SIEC-BRAK-ZYSKAUTOKONSUMPCJI": "Wpisz zysk na 1 kWh z autokonsumpcji (cena zakupu − wartość oddanej kWh).",
  "SIEC-BRAK-ZYSKARBITRAZU": "Wpisz różnicę cen dla arbitrażu (drogie godziny − tanie godziny) [zł/kWh].",
  "SIEC-BRAK-PRZEPLYW": "Wpisz, ile energii rocznie przejdzie przez magazyn (autokonsumpcja albo arbitraż).",
  "POMOC-UI-ARIA-POLE": "Więcej informacji: {nazwa}",
  "POMOC-UI-DO-CZEGO": "Do czego służy",
  "POMOC-UI-GDZIE": "Gdzie to znaleźć",
  "POMOC-UI-ZAKRES": "Typowy zakres",
  "MIGAWKA-UI-ARIA": "Jak działa ten kalkulator — wyjaśnienie",
  "MIGAWKA-UI-PO-LUDZKU": "Po ludzku",
  "MIGAWKA-UI-FIZYKA": "Fizyka",
  "MIGAWKA-UI-JAK-DZIALA": "Jak to liczy",
  "MIGAWKA-UI-PO-CO": "Po co to",
  "MIGAWKA-UI-WZOR": "Wzór",
  "MIGAWKA-UI-ZALOZENIA": "Założenia bieżącego wyniku",
  "POMOC-UI-ZAMKNIJ": "Zamknij",
  "WYNIK-UI-ZALOZENIE": "Założenie",
  "M6-WARTOSC-UJEMNA": "Wpisana wartość nie może być ujemna.",
  "M6-GODZINY-POZA-ZAKRESEM": "Doba ma 24 godziny — wpisz liczbę godzin na dobę od 0 do 24.",
  "M6-PROCENT-POZA-ZAKRESEM": "Wartość procentowa musi mieścić się w zakresie 0–100%.",
  "M6-COP-POZA-ZAKRESEM": "COP nie może być mniejszy niż 1 — nawet grzałka zamienia 1 kWh prądu w 1 kWh ciepła. Wpisz wartość z karty urządzenia.",
  "DYS-GRZEJNIKI-WYSOKOTEMP-POMPA": "Nie montuj zwykłych (wysokotemperaturowych, {standard}) grzejników przy pompie ciepła — wymagają wysokiej temperatury zasilania i drastycznie obniżą COP. Wybierz ogrzewanie podłogowe albo większe grzejniki niskotemperaturowe ({nisko}).",
  "DYS-PODLOGOWE-BEZWLADNOSC": "Ogrzewanie podłogowe ma dużą bezwładność — nie reaguje szybko na zmiany. W domu o niskiej bezwładności może przegrzewać pomieszczenia (sprawdź Ekran 8 — pojemność cieplna).",
  "DYS-COP-TYLKO-POMPA": "Porównanie COP dotyczy pompy ciepła. Przy innym źródle (kocioł, kominek) temperatura zasilania nie zmienia tak zużycia energii — ekran pokazuje tylko dopasowanie systemu.",
  "DYS-COP-NIE-WYZSZY": "COP przy niższej temperaturze zasilania ({cop}) nie jest wyższy niż przy grzejnikach standardowych ({copOdn}) — sprawdź, czy obie wartości są z tej samej karty i przy tej samej temperaturze zewnętrznej.",
  "DYS-ZALOZENIE-COP-Z-KARTY": "Oba COP z karty tej samej pompy, przy tej samej temperaturze zewnętrznej — różnią się tylko temperaturą zasilania.",
  "STREF-SILOWNIKI-ZJADAJA-ZYSK": "Siłowniki i sterowniki zużywają {sterowanie} kWh/dobę, a sterowanie strefowe oszczędza tylko {zysk} kWh/dobę prądu ogrzewania — zbyt duża liczba siłowników podnosi zużycie prądu. Zbilansuj zyski z ogrzewania i koszt zasilania samych siłowników (mniej stref, siłowniki o mniejszym poborze, krótsze zasilanie).",
  "STREF-STAN-USTALONY": "Oszczędność liczona w stanie ustalonym (Q = H·ΔT·t) — to górne oszacowanie. Masa budynku i ponowne nagrzewanie strefy, a także ciepło przepływające z cieplejszych stref, zmniejszają realny zysk.",
  "STREF-BEZ-COP": "Ogrzewanie nieelektryczne (COP nie wpisany) — pokazujemy zysk ciepła; bilansu z prądem siłowników nie liczymy, bo ciepło nie pochodzi z prądu.",
  "STREF-OBNIZONA-POZA-ZAKRESEM": "Strefa {n}: temperatura obniżona nie może być wyższa niż komfortowa.",
  "STREF-ZALOZENIE-H-STREFY": "H strefy to część strat ciepła budynku (Ekran 1) przypadająca na tę strefę; suma H stref = H budynku.",
  "ZAS-CWU-POZA-ZAKRESEM": "Temperatura C.W.U. musi być wyższa niż temperatura zimnej wody.",
  "ZAS-NIEOGRZEWANE": "Zasobnik w nieogrzewanym pomieszczeniu (garaż, piwnica) traci znacznie więcej ciepła — teraz {strata} kWh/dobę. Przenieś go do ogrzewanej części domu albo dołóż izolację.",
  "ZAS-CYRKULACJA-UPROSZCZENIE": "Straty rur cyrkulacji liczone tylko w godzinach pracy pompy, przy rurze w temperaturze C.W.U.; ciepło oddane przez rury stygnące po wyłączeniu pompy pominięte. Nieizolowane rury cyrkulacji to grzejnik, którego nie chcesz.",
  "ZAS-ZALOZENIE-UA-Z-KARTY": "Strata postojowa UA [W/K] z karty zasobnika — obejmuje już izolację, przyłącza, dno i pokrywę. Strata = UA × (temperatura wody − temperatura otoczenia) × 24 h.",
  "GRZ-TEMPERATURA-POZA-ZAKRESEM": "Temperatura docelowa musi być wyższa niż startowa.",
  "GRZ-PONAD-FALOWNIK": "Grzałka {grzalka} kW to duże obciążenie — większe niż moc ciągła falownika ({falownik} kW). Sprawdź, czy falownik ją udźwignie (razem z innymi odbiornikami włączonymi w tym czasie) albo wybierz mniejszą grzałkę.",
  "GRZ-Z-BATERII": "Grzałka o stałej mocy pobiera swoją moc niezależnie od słońca — {kwh} kWh weźmie z baterii. Zimą lepiej dogrzewać pompą ciepła albo użyć regulatora nadwyżki PV.",
  "GRZ-PV-STALA": "Nadwyżka PV przyjęta jako stała przez cały czas grzania — w rzeczywistości zmienia się z chmurami i porą dnia.",
  "GRZ-ZALOZENIE-OPOROWA": "Grzałka oporowa zamienia 1 kWh prądu w 1 kWh ciepła; straty zasobnika w czasie grzania pominięte (Ekran 17).",
  "OSL-OKAP-ZIMA": "Stały okap chroni latem, ale zimą odbiera cenne darmowe zyski ciepła — w zimowe południe zasłania {pct}% okna. Rozważ krótszy okap albo osłonę ruchomą (żaluzje zewnętrzne, markiza) zamiast stałej.",
  "OSL-TYLKO-GEOMETRIA": "Liczona tylko geometria w południe słoneczne dla okna skierowanego na południe i okapu szerszego niż okno. Zysków słonecznych w kWh aplikacja nie liczy — wymagają napromieniowania fasady, współczynnika g szyby i współczynnika osłony z normy, której nie ma w aplikacji (ten sam model co ekran okien, odłożony). Okap poziomy nie chroni okien wschodnich i zachodnich — tam słońce świeci nisko; potrzebna osłona pionowa albo ruchoma.",
  "OSL-SZEROKOSC-POZA-MODELEM": "Model działa dla szerokości geograficznej od {min}° do {max}°N — tam słońce w południe jest zawsze na południu i zimą nad horyzontem.",
  "OSL-ZALOZENIE-POLUDNIE": "Wysokość słońca w południe przesilenia: h = 90° − φ ± {delta}° (deklinacja Słońca). Cień okapu sięga wysięg × tg h poniżej okapu.",
  "WPOR-DNI-POZA-ZAKRESEM": "Sezon grzewczy nie może mieć więcej niż 366 dni.",
  "WPOR-NATURALNA-SZCZELNY-DOM": "Wentylacja naturalna w nowym, szczelnym domu to prosta droga do pleśni — bez nieszczelności ciąg grawitacyjny nie wymieni powietrza (sprawdź test szczelności, Ekran 12).",
  "WPOR-MECHANICZNA-NIE-OSZCZEDZA": "Wentylatory zużyją więcej prądu, niż rekuperacja oszczędzi na ogrzewaniu — bilans {netto} kWh/dobę. Sprawdź pobór wentylatorów i sprawność odzysku albo policz dla zimniejszej doby.",
  "WPOR-BEZ-COP": "Ogrzewanie nieelektryczne (COP nie wpisany) — pokazujemy oszczędność ciepła i prąd wentylatorów osobno; bilansu prądu nie liczymy.",
  "WPOR-ZALOZENIE-DOBA": "Liczone dla jednej doby o wpisanej średniej temperaturze zewnętrznej; wynik sezonowy = doba × dni sezonu (zimniejsze i cieplejsze dni się uśredniają tylko wtedy, gdy wpiszesz średnią sezonu).",
  "KOL-PLYCEJ-NIZ-PRZEMARZANIE": "Kolektor poziomy na {glebokosc} m leży nie głębiej niż strefa przemarzania ({przemarzanie} m) — zamarznie i straci wydajność. Ułóż rury poniżej strefy przemarzania.",
  "KOL-BRAK-PRZEMARZANIA": "Wpisz głębokość ułożenia i głębokość przemarzania gruntu — bez nich nie sprawdzimy, czy kolektor nie zamarznie.",
  "KOL-GLEBOKOSC-NIETYPOWA": "Głębokość ułożenia {glebokosc} m jest poza typowym zakresem {min}–{max} m. Płycej — ryzyko zamarzania i słabszy odbiór ciepła; głębiej — koszt wykopu rośnie.",
  "KOL-ODWIERT-NIETYPOWY": "Odwiert {glebokosc} m jest poza typowym zakresem {min}–{max} m — zbyt głęboki odwiert podnosi koszt szybciej niż zysk. Sprawdź projekt odwiertu.",
  "KOL-WSKAZNIK-SPOZA-ZRODLA": "Wpisany wskaźnik {wartosc} jest poza zakresem {min}–{max} podanym w źródle — wynik liczony z Twojego wskaźnika; upewnij się, że pochodzi z projektu dla Twojego gruntu.",
  "KOL-SPIRALNY-BEZ-WSKAZNIKA": "Kolektor spiralny (koszowy) to rozwiązanie kompaktowe, gdy brakuje miejsca — źródło nie podaje wskaźnika do jego wymiarowania, więc nie liczymy wymiarów. Dobór według karty producenta.",
  "KOL-ZALOZENIE-MOC-POMPY": "Wskaźniki są liczone na moc pompy ciepła (jak w źródle), nie na moc pobieraną z gruntu P·(1 − 1/COP). Typ i wilgotność gruntu są zawarte we wskaźniku, który wpisujesz.",
  "ALT-KOMINEK-PRZEGRZANIE": "Przy braku prądu pompa cyrkulacyjna nie działa — bez schładzania grawitacyjnego (albo wężownicy schładzającej) instalacja kominka się przegrzeje.",
  "ALT-IR-PUNKTOWE": "IR to ogrzewanie punktowe. Nie zastąpi pełnego ogrzewania w mroźną noc.",
  "ALT-MATY-STROP": "Sufit z matami musi być odpowiednio zaizolowany, inaczej grzejesz strop.",
  "ALT-PCM-KOSZT": "PCM jest droższy od wody — stosuj go tam, gdzie brakuje miejsca.",
  "ALT-KOCIOL-OSOBNY-EKRAN": "Kocioł elektryczny ma osobny ekran z porównaniem kosztu względem pompy ciepła — przejdź do niego linkiem poniżej.",
  "ALT-ZALOZENIE-KOMINEK": "Moc nominalna kominka przy ciągłym paleniu; podział woda/pomieszczenie wg udziału z karty. Pokrycie liczone z mocy do wody (trafia do instalacji) oraz osobno z całej mocy.",
  "ALT-ZALOZENIE-PCM": "Liczone tylko ciepło utajone przy pełnym stopieniu (V × ρ × L); ciepło jawne PCM pominięte. Bufor wodny: 1 l ≈ 1 kg, ciepło właściwe wody, wpisana różnica temperatur.",
} as const

export type KluczTlumaczenia = keyof typeof dictionaryPl
