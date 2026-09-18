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
} as const

export type KluczTlumaczenia = keyof typeof dictionaryPl
