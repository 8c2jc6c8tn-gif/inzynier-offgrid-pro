/**
 * Help content — Module 11 (battery assembly). Path A = LiFePO4 pack, path B = lead-acid.
 * Engine constants enter the text through `{params}`.
 */
import type { Tlumaczenie } from "./typy"

const Z_KARTY = "zakres z karty katalogowej — aplikacja nie przyjmuje typowej wartości za Ciebie."

export const pl = {
  "weryfikacja-ogniw": {
    migawka: {
      oCoChodzi:
        "Zanim ogniwa trafią do wspólnego pakietu, muszą przejść kontrolę — zła liczba ogniw albo zbyt duża różnica napięć to najczęstsza przyczyna problemów przy budowie własnego pakietu LiFePO4.",
      jakDziala:
        "Wybierasz napięcie systemu (12 V = 4S, 24 V = 8S, 48 V = 16S) i wpisujesz napięcie każdego ogniwa. Aplikacja sprawdza liczbę ogniw i różnicę między najwyższym a najniższym napięciem — powyżej {maxRoznica} V ogniwa trzeba najpierw wyrównać.",
      poCo:
        "Ogniwa o różnym stanie naładowania połączone w szereg rozjadą się przy pierwszym ładowaniu: jedno dojdzie do górnego progu BMS, zanim reszta się naładuje, i pakiet nigdy nie da pełnej pojemności.",
      fizyka: "ΔV = V_max − V_min.",
    },
    pola: {
      napiecieSystemu: {
        nazwa: "Napięcie systemu",
        cel: "Wyznacza oczekiwaną liczbę ogniw w szeregu (ogniwo LiFePO4 ma 3,2 V nominalnie).",
        gdzie: "Twój projekt: napięcie falownika/ładowarki.",
        zakres: "12 V (4S), 24 V (8S) albo 48 V (16S).",
      },
      liczbaOgniw: {
        nazwa: "Liczba ogniw w pakiecie",
        cel: "Porównywana z oczekiwaną dla napięcia systemu.",
        gdzie: "Policz ogniwa, które masz.",
        zakres: "Zmień tylko, jeśli budujesz inną konfigurację niż standardowa.",
      },
      napiecieOgniwa: {
        nazwa: "Napięcie ogniwa [V]",
        cel: "Napięcie spoczynkowe każdego ogniwa — z nich liczona jest różnica ΔV.",
        gdzie: "Miernik z dokładnością do 0,001 V, na zaciskach ogniwa, bez obciążenia.",
        zakres: "Różnica między ogniwami najwyżej {maxRoznica} V.",
      },
    },
  },
  "montaz-mechaniczny": {
    migawka: {
      oCoChodzi:
        "Zanim ogniwa zostaną połączone elektrycznie — sprawdź docisk i separację. Docisk poza zakresem to ryzyko utraty kontaktu wewnętrznego albo uszkodzenia ogniw.",
      jakDziala: "Aplikacja porównuje docisk ogniw pryzmatycznych z zakresem {dociskMin}–{dociskMax} kgf (ten sam próg co Moduł 4, Ekran 21) i sprawdza listę separacji.",
      poCo: "Ogniwa pryzmatyczne bez docisku puchną i szybciej się starzeją; bez separacji obudowy mogą się przetrzeć i zewrzeć.",
    },
    pola: {
      docisk: {
        nazwa: "Docisk ogniw pryzmatycznych [kgf]",
        cel: "Siła ściskająca ogniwa w pakiecie.",
        gdzie: "Z projektu ścisków albo pomiaru momentu śrub ściągających.",
        zakres: "Zalecany zakres: {dociskMin}–{dociskMax} kgf.",
      },
    },
  },
  "polaczenia-elektryczne": {
    migawka: {
      oCoChodzi:
        "Kolejność łączenia ma znaczenie — przypadkowe zwarcie podczas montażu szeregu ogniw to najczęstsza przyczyna wypadków przy budowie własnego pakietu.",
      jakDziala: "Lista kolejnych połączeń i zasad bezpieczeństwa: izolowane narzędzia, jeden busbar naraz, osłanianie odsłoniętych biegunów.",
      poCo: "Pakiet 48 V zwarty kluczem potrafi go w ułamku sekundy rozgrzać do czerwoności — i poparzyć rękę.",
    },
    pola: {},
  },
  "podlaczenie-bms": {
    migawka: {
      oCoChodzi:
        "Zanim główny bezpiecznik albo stycznik zostanie włączony, kondensatory wejściowe falownika muszą się naładować przez rezystor — inaczej zaiskrzy.",
      jakDziala: "Z pojemności wejściowej falownika i rezystora wstępnego aplikacja liczy czas ładowania kondensatorów (5 stałych czasowych) — ten sam wzór co Moduł 4, Ekran 7.",
      poCo: "Iskra przy włączaniu wypala styki, a skok prądu może zadziałać zabezpieczeniem zwarciowym BMS.",
      fizyka: "T = 5 · R · C.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pojemność wejściowa DC falownika [µF]",
        cel: "Im większa, tym dłużej trwa ładowanie przez rezystor.",
        gdzie: "Z karty katalogowej falownika.",
        zakres: Z_KARTY,
      },
      rezystor: {
        nazwa: "Rezystor wstępny (pre-charge) [Ω]",
        cel: "Ogranicza prąd ładowania kondensatorów.",
        gdzie: "Dobierz tak, by ograniczyć prąd uderzeniowy; sprawdź też jego moc.",
        zakres: "Przykład ze źródła: {rezystor} Ω / 50 W.",
      },
    },
  },
  "pierwsze-uruchomienie": {
    migawka: {
      oCoChodzi:
        "Pierwsze ładowanie to nie jest „włącz i zapomnij” — to moment, kiedy BMS uczy się Twojego pakietu i wyrównuje różnice między ogniwami z fabryki.",
      jakDziala:
        "Aplikacja liczy prąd testowy ładowania ({cRate}C × pojemność przez {czas} minut) i sprawdza, czy najwyżej naładowane ogniwo osiągnęło próg top balancing ({prog} V).",
      poCo: "Bez wyrównania na górze pakiet nigdy nie naładuje się do pełna — BMS odetnie ładowanie na pierwszym „szybszym” ogniwie.",
      fizyka: "I_test = {cRate}C × C_Ah.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pojemność pakietu [Ah]",
        cel: "Do wyliczenia prądu testowego ładowania.",
        gdzie: "Z karty ogniw.",
        zakres: "Prąd testowy: {cRate}C przez {czas} minut.",
      },
      napiecieMax: {
        nazwa: "Napięcie najwyżej naładowanego ogniwa [V]",
        cel: "Pokazuje, czy osiągnięto top balancing.",
        gdzie: "Z BMS (napięcia ogniw) albo miernikiem.",
        zakres: "Top balancing przy {prog} V.",
      },
    },
  },
  "demontaz-pakietu": {
    migawka: {
      oCoChodzi:
        "Kolejność demontażu nie jest sugestią — to dokładna odwrotność kolejności montażu, a każde odstępstwo zwiększa ryzyko zwarcia w rękach.",
      jakDziala: "Aplikacja przelicza napięcie pakietu na napięcie ogniwa (V ÷ liczba ogniw) i sprawdza, czy mieści się w zakresie zalecanym przed demontażem. Potem prowadzi przez kroki.",
      poCo: "Ogniwa rozebrane w pełni naładowane są groźniejsze przy przypadkowym zwarciu i gorzej znoszą przechowywanie.",
      fizyka: "V_ogniwo = V_pakietu / S.",
    },
    pola: {
      napiecieSystemu: {
        nazwa: "Napięcie systemu",
        cel: "Wyznacza liczbę ogniw w szeregu.",
        gdzie: "Napięcie pakietu, który rozbierasz.",
        zakres: "12 V (4S), 24 V (8S) albo 48 V (16S).",
      },
      napiecie: {
        nazwa: "Zmierzone napięcie pakietu [V]",
        cel: "Przeliczane na napięcie jednego ogniwa.",
        gdzie: "Miernik na zaciskach pakietu, bez obciążenia.",
        zakres: "Zalecane przed demontażem: 3,0–{vMax} V/ogniwo (dla {s}S ok. {vLo}–{vHi} V).",
      },
    },
  },
  "przygotowanie-stanowiska": {
    migawka: {
      oCoChodzi: "Zanim zaczniesz montaż pakietu — stanowisko i narzędzia muszą być gotowe.",
      jakDziala: "Lista kontrolna: mata izolacyjna, klucz dynamometryczny z izolowanymi nasadkami, rękawice, okulary, gaśnica w zasięgu ręki, żadnych metalowych przedmiotów luzem.",
      poCo: "Jedna obrączka albo upuszczony klucz między biegunami to zwarcie setek amperów. Przygotowanie trwa 10 minut.",
    },
    pola: {},
  },
  "ocena-zuzycia": {
    migawka: {
      oCoChodzi: "Trzy pomiary po zdjęciu ogniwa i jedna ocena, która decyduje o wszystkim: czy obudowa widocznie spuchła.",
      jakDziala: "Lista kontrolna: grubość ogniwa względem fabrycznej, napięcie po 24 godzinach (samorozładowanie), rezystancja wewnętrzna. Spuchnięte ogniwo nie wraca do użytku.",
      poCo: "Ogniwo z odzysku wygląda dobrze do chwili, gdy w pakiecie zacznie się grzać. Pomiar przed ponownym użyciem to jedyna ochrona.",
    },
    pola: {},
  },
  "ratowanie-ogniwa": {
    migawka: {
      oCoChodzi:
        "Głębokie rozładowanie to często nieodwracalne uszkodzenie ogniwa — czasem da się je obudzić, ale próba ratunku ma realne ryzyko.",
      jakDziala:
        "Z napięcia ogniwa aplikacja ocenia, czy ratunek jest bezpieczny: powyżej {progRatunku} V — ładowanie małym prądem ({prad} A) z zasilacza ustawionego na {napiecieZasilacza} V pod nadzorem; poniżej — ogniwo do utylizacji.",
      poCo: "Ogniwo zbyt głęboko rozładowane może mieć wewnętrzne zwarcia z rozpuszczonej miedzi — przy ładowaniu grozi przegrzaniem.",
    },
    pola: {
      napiecie: {
        nazwa: "Zmierzone napięcie ogniwa [V]",
        cel: "Decyduje, czy próba ratunku jest bezpieczna.",
        gdzie: "Miernik na zaciskach ogniwa. 0 V to prawidłowy, krytyczny wynik.",
        zakres: "Próg bezpiecznego ratunku: {progRatunku} V.",
      },
    },
  },
  "przechowywanie-recykling": {
    migawka: {
      oCoChodzi:
        "Ogniwo, które nie pracuje, nie jest ogniwem „wyłączonym” — złe przechowywanie (pełne naładowanie, mróz, wilgoć) starzeje je tak samo jak złe użytkowanie.",
      jakDziala: "Trzy tematy: jak przechowywać ogniwa LiFePO4, gdzie oddać zużyte do recyklingu i jakie narzędzia diagnostyczne warto mieć.",
      poCo: "Poprawne przechowywanie przedłuża życie ogniw o lata; ogniwa litowe nie mogą trafić do zwykłych śmieci.",
    },
    pola: {},
  },
  "sekwencja-montazu": {
    migawka: {
      oCoChodzi: "Dokładna, ponumerowana kolejność połączeń busbarów i BMS — dopasowana do liczby ogniw w Twoim pakiecie.",
      jakDziala: "Wybierasz liczbę ogniw (preset albo własną, parzystą, od {min} do {max}). Aplikacja generuje kolejne kroki łączenia w układzie dwurzędowym, z miejscem na zdjęcie przy każdym kroku.",
      poCo: "Pomyłka w kolejności to zwarcie w rękach albo odwrotnie podłączony przewód balansujący, który pali BMS.",
    },
    pola: {
      liczbaOgniw: {
        nazwa: "Liczba ogniw w szeregu",
        cel: "Z niej generowana jest sekwencja połączeń.",
        gdzie: "Twój projekt pakietu (np. 16S dla 48 V).",
        zakres: "Preset 4S/8S/16S albo „Inna liczba”.",
      },
      wlasnaLiczba: {
        nazwa: "Własna liczba ogniw [szt.]",
        cel: "Dla niestandardowych pakietów.",
        gdzie: "Twój projekt.",
        zakres: "Tylko parzysta, od {min} do {max} — układ dwurzędowy wymaga równego podziału.",
      },
    },
  },
  "weryfikacja-wstepna-olow": {
    migawka: {
      oCoChodzi: "Kontrola akumulatorów kwasowo-ołowiowych przed złożeniem zestawu.",
      jakDziala: "Lista kontrolna: ten sam typ, pojemność i podobny wiek, napięcie spoczynkowe, poziom elektrolitu (w akumulatorach z korkami), brak pęknięć i wycieków.",
      poCo: "Jeden starszy lub słabszy akumulator w szeregu ogranicza cały zestaw i jest ciągle przeładowywany albo niedoładowany.",
    },
    pola: {},
  },
  "montaz-mechaniczny-olow": {
    migawka: {
      oCoChodzi: "Akumulatory kwasowe są ciężkie i wydzielają wodór — montaż musi uwzględnić jedno i drugie.",
      jakDziala: "Lista kontrolna: nośność podłoża, stabilne mocowanie, wentylacja pomieszczenia, odległość od źródeł iskier i ognia.",
      poCo: "Zestaw kilku akumulatorów waży setki kilogramów; wodór w niewentylowanym pomieszczeniu może wybuchnąć od iskry.",
    },
    pola: {},
  },
  "polaczenia-czyszczenie-olow": {
    migawka: {
      oCoChodzi: "Czyste bieguny i dobre połączenia to mniejsza rezystancja i mniej ciepła w miejscu styku.",
      jakDziala: "Lista kontrolna: czyszczenie biegunów, wazelina techniczna na połączeniach, schemat połączeń zgodny z napięciem.",
      poCo: "Nalot na biegunach podnosi rezystancję — połączenie się grzeje, a zestaw ładuje nierówno.",
    },
    pola: {},
  },
  "balansery-zewnetrzne-olow": {
    migawka: {
      oCoChodzi:
        "Akumulatory kwasowe nie mają wbudowanego „sędziego” pilnującego równowagi — przy połączeniu szeregowym trzeba go dodać z zewnątrz, inaczej najsłabszy akumulator ograniczy cały zestaw.",
      jakDziala: "Aplikacja sprawdza liczbę akumulatorów w szeregu: od {minAku} wzwyż zaleca balanser zewnętrzny.",
      poCo: "Bez balansera jeden akumulator jest stale przeładowywany (gazuje i wysycha), a inny niedoładowany (siarczanieje).",
    },
    pola: {
      liczba: {
        nazwa: "Liczba akumulatorów w szeregu [szt.]",
        cel: "Od niej zależy, czy potrzebny jest balanser.",
        gdzie: "Policz akumulatory połączone plus-do-minusa.",
        zakres: "Od {minAku} — balanser zalecany.",
      },
    },
  },
  "dobor-kabli-bezpiecznikow-olow": {
    migawka: {
      oCoChodzi:
        "Dobór kabla nie zależy od chemii baterii, tylko od prądu i długości — ten sam silnik obliczeniowy co w Module 5, tylko inne liczby.",
      jakDziala: "Aplikacja dobiera przekrój wg PN-HD 60364-5-52 (obciążalność i spadek napięcia) i, jeśli podasz dane, sprawdza zdolność wyłączania bezpiecznika wobec prądu zwarciowego zestawu.",
      poCo: "Akumulatory kwasowe też dają przy zwarciu setki amperów — za cienki kabel albo bezpiecznik o za małym AIC to ryzyko pożaru.",
    },
    pola: {
      prad: {
        nazwa: "Prąd ładowania/rozładowania [A]",
        cel: "Największy stały prąd w kablu.",
        gdzie: "Z karty falownika/ładowarki albo moc ÷ napięcie.",
        zakres: Z_KARTY,
      },
      napiecie: {
        nazwa: "Napięcie systemu [V]",
        cel: "Do przeliczenia spadku napięcia.",
        gdzie: "Napięcie zestawu akumulatorów.",
        zakres: "Typowo 12, 24 albo 48 V.",
      },
      dlugosc: {
        nazwa: "Długość trasy kabla [m]",
        cel: "Im dłuższa, tym większy spadek napięcia (liczona tam i z powrotem).",
        gdzie: "Zmierz po trasie prowadzenia.",
        zakres: "Twoja instalacja.",
      },
      material: {
        nazwa: "Materiał przewodnika",
        cel: "Miedź albo aluminium — różna rezystywność.",
        gdzie: "Z opisu kabla.",
        zakres: "Cu albo Al.",
      },
      ulozenie: {
        nazwa: "Sposób ułożenia",
        cel: "Wpływa na obciążalność kabla.",
        gdzie: "Najgorszy odcinek trasy.",
        zakres: "Opcje z listy.",
      },
      temperatura: {
        nazwa: "Temperatura otoczenia [°C]",
        cel: "Obniża dopuszczalny prąd kabla.",
        gdzie: "Najwyższa spodziewana na trasie.",
        zakres: "Twoje warunki.",
      },
      wiazka: {
        nazwa: "Liczba kabli w wiązce [szt.]",
        cel: "Kable w wiązce grzeją się nawzajem.",
        gdzie: "Policz obciążone przewody biegnące razem.",
        zakres: "Twoja instalacja.",
      },
      spadek: {
        nazwa: "Dopuszczalny spadek napięcia [%]",
        cel: "Warunek doboru przekroju.",
        gdzie: "Domyślna wartość albo wymaganie producenta.",
        zakres: "Dla DC zwykle {spadekDc}%.",
      },
      pradZwarcia: {
        nazwa: "Prąd zwarciowy zestawu [A] (opcjonalnie)",
        cel: "Porównywany ze zdolnością wyłączania bezpiecznika.",
        gdzie: "Z karty akumulatora albo ekranu „Analiza zwarciowa” (Moduł 5).",
        zakres: "Wynik analizy zwarciowej.",
      },
      aic: {
        nazwa: "Zdolność wyłączania (AIC) bezpiecznika [A] (opcjonalnie)",
        cel: "Musi przewyższać prąd zwarciowy.",
        gdzie: "Z karty katalogowej bezpiecznika.",
        zakres: Z_KARTY,
      },
    },
  },
  "uruchomienie-testy-olow": {
    migawka: {
      oCoChodzi: "Pierwsze uruchomienie zestawu kwasowego — sprawdzasz, czy wszystkie akumulatory zachowują się tak samo.",
      jakDziala: "Lista kontrolna: napięcie spoczynkowe każdego akumulatora, obserwacja krzywej ładowania, temperatura podczas pierwszego ładowania.",
      poCo: "Akumulator, który grzeje się bardziej niż inne albo ma inne napięcie, trzeba wychwycić na starcie, zanim zniszczy resztę.",
    },
    pola: {},
  },
  "demontaz-olow": {
    migawka: {
      oCoChodzi: "Ta sama zasada co w LiFePO4 — masa (minus) zawsze pierwsza przy odłączaniu.",
      jakDziala: "Lista kroków demontażu zestawu kwasowego w bezpiecznej kolejności, z zabezpieczeniem biegunów i elektrolitu.",
      poCo: "Odłączenie plusa jako pierwszego przy dotknięciu kluczem masy robi zwarcie. Rozlany elektrolit parzy.",
    },
    pola: {},
  },
  "bezpieczenstwo-kwas": {
    migawka: {
      oCoChodzi: "Elektrolit to kwas siarkowy — parzy skórę i oczy.",
      jakDziala: "Lista kontrolna: okulary i rękawice kwasoodporne, soda oczyszczona do neutralizacji, znana procedura przy kontakcie ze skórą lub oczami.",
      poCo: "Przy dolewaniu wody czy czyszczeniu biegunów kropla kwasu w oku to wizyta na ostrym dyżurze. Przygotowanie zajmuje minutę.",
    },
    pola: {},
  },
  "gestosc-elektrolitu": {
    migawka: {
      oCoChodzi:
        "Gęstość elektrolitu to bezpośredni wskaźnik stanu naładowania akumulatora kwasowego — odpowiednik SoC z BMS, tylko mierzony ręcznie areometrem.",
      jakDziala: "Aplikacja porównuje zmierzoną gęstość z punktami odniesienia ze źródła: {pelny} = pełny, {polowa} = połowa, {rozladowany} = rozładowany.",
      poCo: "Różnica gęstości między celami akumulatora zdradza słabą celę, zanim zestaw przestanie trzymać energię.",
    },
    pola: {
      gestosc: {
        nazwa: "Zmierzona gęstość elektrolitu [g/cm³]",
        cel: "Wskaźnik stanu naładowania.",
        gdzie: "Areometr, w każdej celi (tylko akumulatory z korkami), po odstaniu bez ładowania.",
        zakres: "{pelny} = pełny, {polowa} = połowa, {rozladowany} = rozładowany.",
      },
    },
  },
  "ocena-zasiarczenia": {
    migawka: {
      oCoChodzi: "Siarczanowanie to twardniejący siarczan ołowiu na płytach — akumulator traci pojemność.",
      jakDziala: "Zaznaczasz objawy, które faktycznie widzisz: długie ładowanie, szybkie rozładowanie, biały nalot na klemach, szybki spadek napięcia po naładowaniu. Aplikacja ocenia prawdopodobieństwo zasiarczenia.",
      poCo: "Wcześnie wykryte zasiarczenie da się czasem cofnąć (Ekran B11); zaniedbane — już nie.",
    },
    pola: {},
  },
  "ratowanie-zasiarczenia": {
    migawka: {
      oCoChodzi:
        "Odsiarczanie to próba odwrócenia procesu chemicznego, który normalnie jest nieodwracalny — działa czasem przy wczesnym wykryciu, rzadko przy zaniedbanym akumulatorze.",
      jakDziala: "Dla akumulatora ze zdiagnozowanym zasiarczeniem (Ekran B10) aplikacja podaje zalecaną procedurę odsiarczania i jej ograniczenia.",
      poCo: "Żeby nie wydawać pieniędzy na ratowanie akumulatora, który już nie wróci — i wiedzieć, kiedy próba ma sens.",
    },
    pola: {},
  },
  "przechowywanie-recykling-olow": {
    migawka: {
      oCoChodzi:
        "Kluczowa różnica względem LiFePO4: akumulator kwasowy przechowuj w pełni naładowany, nie na 50% — rozładowany zamarza i traci pojemność przez siarczanowanie.",
      jakDziala: "Trzy tematy: przechowywanie akumulatorów kwasowych, recykling (ołów i kwas to odpady niebezpieczne) i narzędzia diagnostyczne.",
      poCo: "Rozładowany akumulator kwasowy zamarza już przy kilku stopniach mrozu i pęka; zużyty trzeba oddać do punktu zbiórki.",
    },
    pola: {},
  },
}

const Z_KARTY_EN = "range from the datasheet — the app does not assume a typical value for you."

export const en: Tlumaczenie<typeof pl> = {
  "weryfikacja-ogniw": {
    migawka: {
      oCoChodzi:
        "Before cells go into a common pack they must pass this check — the wrong number of cells or too large a voltage difference between them is the most common cause of problems when building your own LiFePO4 pack.",
      jakDziala:
        "You choose the system voltage (12 V = 4S, 24 V = 8S, 48 V = 16S) and enter the voltage of each cell. The app checks the number of cells and the difference between the highest and lowest voltage — above {maxRoznica} V the cells must be balanced first.",
      poCo:
        "Cells at different states of charge connected in series drift apart on the first charge: one reaches the BMS upper limit before the rest charge, and the pack never gives full capacity.",
      fizyka: "ΔV = V_max − V_min.",
    },
    pola: {
      napiecieSystemu: {
        nazwa: "System voltage",
        cel: "Sets the expected number of cells in series (a LiFePO4 cell is 3.2 V nominal).",
        gdzie: "Your design: the inverter/charger voltage.",
        zakres: "12 V (4S), 24 V (8S) or 48 V (16S).",
      },
      liczbaOgniw: {
        nazwa: "Number of cells in the pack",
        cel: "Compared with the expected number for the system voltage.",
        gdzie: "Count the cells you have.",
        zakres: "Change it only if you build a non-standard configuration.",
      },
      napiecieOgniwa: {
        nazwa: "Cell voltage [V]",
        cel: "The rest voltage of each cell — the ΔV difference is calculated from them.",
        gdzie: "A meter with 0.001 V resolution, at the cell terminals, without load.",
        zakres: "Difference between cells at most {maxRoznica} V.",
      },
    },
  },
  "montaz-mechaniczny": {
    migawka: {
      oCoChodzi:
        "Before the cells are connected electrically — check compression and separation. Compression outside the range risks losing internal contact or damaging the cells.",
      jakDziala: "The app compares the prismatic cell compression with the range {dociskMin}–{dociskMax} kgf (the same threshold as Module 4, Screen 21) and checks the separation list.",
      poCo: "Prismatic cells without compression swell and age faster; without separation the casings can chafe and short.",
    },
    pola: {
      docisk: {
        nazwa: "Prismatic cell compression [kgf]",
        cel: "The force squeezing the cells in the pack.",
        gdzie: "From the clamp design or a measurement of the tie-rod torque.",
        zakres: "Recommended range: {dociskMin}–{dociskMax} kgf.",
      },
    },
  },
  "polaczenia-elektryczne": {
    migawka: {
      oCoChodzi:
        "The connection order matters — an accidental short while assembling a series of cells is the most common cause of accidents when building your own pack.",
      jakDziala: "A list of successive connections and safety rules: insulated tools, one busbar at a time, covering exposed terminals.",
      poCo: "A 48 V pack shorted with a spanner can heat it red-hot in a split second — and burn your hand.",
    },
    pola: {},
  },
  "podlaczenie-bms": {
    migawka: {
      oCoChodzi:
        "Before the main fuse or contactor is switched on, the inverter's input capacitors must charge through a resistor — otherwise it sparks.",
      jakDziala: "From the inverter's input capacitance and the pre-charge resistor the app calculates the capacitor charging time (5 time constants) — the same formula as Module 4, Screen 7.",
      poCo: "A spark at switch-on burns contacts, and the current surge can trip the BMS short-circuit protection.",
      fizyka: "T = 5 · R · C.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Inverter DC input capacitance [µF]",
        cel: "The larger it is, the longer charging through the resistor takes.",
        gdzie: "From the inverter datasheet.",
        zakres: Z_KARTY_EN,
      },
      rezystor: {
        nazwa: "Pre-charge resistor [Ω]",
        cel: "Limits the capacitor charging current.",
        gdzie: "Choose it to limit the inrush current; check its power rating too.",
        zakres: "Example from the source: {rezystor} Ω / 50 W.",
      },
    },
  },
  "pierwsze-uruchomienie": {
    migawka: {
      oCoChodzi:
        "The first charge is not “switch on and forget” — it's the moment the BMS learns your pack and evens out the factory differences between cells.",
      jakDziala:
        "The app calculates the test charging current ({cRate}C × capacity for {czas} minutes) and checks whether the highest-charged cell reached the top balancing threshold ({prog} V).",
      poCo: "Without top balancing the pack never fully charges — the BMS cuts off charging at the first “faster” cell.",
      fizyka: "I_test = {cRate}C × C_Ah.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pack capacity [Ah]",
        cel: "To calculate the test charging current.",
        gdzie: "From the cell datasheet.",
        zakres: "Test current: {cRate}C for {czas} minutes.",
      },
      napiecieMax: {
        nazwa: "Voltage of the highest-charged cell [V]",
        cel: "Shows whether top balancing was reached.",
        gdzie: "From the BMS (cell voltages) or with a meter.",
        zakres: "Top balancing at {prog} V.",
      },
    },
  },
  "demontaz-pakietu": {
    migawka: {
      oCoChodzi:
        "The disassembly order is not a suggestion — it is the exact reverse of the assembly order, and every deviation raises the risk of a short circuit in your hands.",
      jakDziala: "The app converts the pack voltage into cell voltage (V ÷ number of cells) and checks whether it is within the range recommended before disassembly. Then it guides you through the steps.",
      poCo: "Cells taken apart fully charged are more dangerous in an accidental short and tolerate storage worse.",
      fizyka: "V_cell = V_pack / S.",
    },
    pola: {
      napiecieSystemu: {
        nazwa: "System voltage",
        cel: "Sets the number of cells in series.",
        gdzie: "The voltage of the pack you are taking apart.",
        zakres: "12 V (4S), 24 V (8S) or 48 V (16S).",
      },
      napiecie: {
        nazwa: "Measured pack voltage [V]",
        cel: "Converted to the voltage of one cell.",
        gdzie: "A meter at the pack terminals, without load.",
        zakres: "Recommended before disassembly: 3.0–{vMax} V/cell (for {s}S about {vLo}–{vHi} V).",
      },
    },
  },
  "przygotowanie-stanowiska": {
    migawka: {
      oCoChodzi: "Before you start assembling the pack — the workstation and tools must be ready.",
      jakDziala: "A checklist: insulating mat, torque wrench with insulated sockets, gloves, goggles, an extinguisher within reach, no loose metal objects.",
      poCo: "One wedding ring or a dropped spanner between terminals is a short of hundreds of amps. Preparation takes 10 minutes.",
    },
    pola: {},
  },
  "ocena-zuzycia": {
    migawka: {
      oCoChodzi: "Three measurements after removing a cell and one assessment that decides everything: whether the casing has visibly swollen.",
      jakDziala: "A checklist: cell thickness versus factory, voltage after 24 hours (self-discharge), internal resistance. A swollen cell does not go back into use.",
      poCo: "A reclaimed cell looks fine until it starts heating up in the pack. Measuring before reuse is the only protection.",
    },
    pola: {},
  },
  "ratowanie-ogniwa": {
    migawka: {
      oCoChodzi:
        "Deep discharge is often irreversible damage to a cell — sometimes it can be woken up, but a rescue attempt carries a real risk.",
      jakDziala:
        "From the cell voltage the app judges whether a rescue is safe: above {progRatunku} V — charging with a small current ({prad} A) from a supply set to {napiecieZasilacza} V under supervision; below — the cell is for disposal.",
      poCo: "A cell discharged too deeply may have internal shorts from dissolved copper — charging it risks overheating.",
    },
    pola: {
      napiecie: {
        nazwa: "Measured cell voltage [V]",
        cel: "Decides whether a rescue attempt is safe.",
        gdzie: "A meter at the cell terminals. 0 V is a valid, critical reading.",
        zakres: "Safe rescue threshold: {progRatunku} V.",
      },
    },
  },
  "przechowywanie-recykling": {
    migawka: {
      oCoChodzi:
        "A cell that isn't working is not a “switched-off” cell — poor storage (full charge, frost, moisture) ages it just like poor use.",
      jakDziala: "Three topics: how to store LiFePO4 cells, where to take worn ones for recycling and which diagnostic tools are worth having.",
      poCo: "Proper storage extends cell life by years; lithium cells must not go into ordinary rubbish.",
    },
    pola: {},
  },
  "sekwencja-montazu": {
    migawka: {
      oCoChodzi: "The exact, numbered order of busbar and BMS connections — matched to the number of cells in your pack.",
      jakDziala: "You choose the number of cells (a preset or your own even number from {min} to {max}). The app generates the connection steps in a two-row layout, with room for a photo at each step.",
      poCo: "A mistake in the order means a short circuit in your hands or a reversed balance lead that burns the BMS.",
    },
    pola: {
      liczbaOgniw: {
        nazwa: "Number of cells in series",
        cel: "The connection sequence is generated from it.",
        gdzie: "Your pack design (e.g. 16S for 48 V).",
        zakres: "Preset 4S/8S/16S or “Other number”.",
      },
      wlasnaLiczba: {
        nazwa: "Own number of cells [pcs]",
        cel: "For non-standard packs.",
        gdzie: "Your design.",
        zakres: "Even numbers only, from {min} to {max} — the two-row layout needs an equal split.",
      },
    },
  },
  "weryfikacja-wstepna-olow": {
    migawka: {
      oCoChodzi: "Checking lead-acid batteries before assembling the set.",
      jakDziala: "A checklist: same type, capacity and similar age, rest voltage, electrolyte level (flooded batteries), no cracks or leaks.",
      poCo: "One older or weaker battery in a series limits the whole set and is constantly over- or undercharged.",
    },
    pola: {},
  },
  "montaz-mechaniczny-olow": {
    migawka: {
      oCoChodzi: "Lead-acid batteries are heavy and release hydrogen — mounting must take both into account.",
      jakDziala: "A checklist: floor load capacity, stable fixing, room ventilation, distance from spark and fire sources.",
      poCo: "A set of several batteries weighs hundreds of kilograms; hydrogen in an unventilated room can explode from a spark.",
    },
    pola: {},
  },
  "polaczenia-czyszczenie-olow": {
    migawka: {
      oCoChodzi: "Clean terminals and good connections mean lower resistance and less heat at the joint.",
      jakDziala: "A checklist: cleaning the terminals, technical petroleum jelly on the joints, a wiring diagram matching the voltage.",
      poCo: "Deposits on the terminals raise resistance — the joint heats up and the set charges unevenly.",
    },
    pola: {},
  },
  "balansery-zewnetrzne-olow": {
    migawka: {
      oCoChodzi:
        "Lead-acid batteries have no built-in “referee” keeping them in balance — in a series connection one must be added externally, otherwise the weakest battery limits the whole set.",
      jakDziala: "The app checks the number of batteries in series: from {minAku} upwards it recommends an external balancer.",
      poCo: "Without a balancer one battery is constantly overcharged (gasses and dries out) and another undercharged (sulphates).",
    },
    pola: {
      liczba: {
        nazwa: "Number of batteries in series [pcs]",
        cel: "Whether a balancer is needed depends on it.",
        gdzie: "Count the batteries connected plus-to-minus.",
        zakres: "From {minAku} — a balancer is recommended.",
      },
    },
  },
  "dobor-kabli-bezpiecznikow-olow": {
    migawka: {
      oCoChodzi:
        "Cable sizing doesn't depend on battery chemistry, only on current and length — the same calculation engine as in Module 5, just different numbers.",
      jakDziala: "The app sizes the cross-section per HD 60364-5-52 (current-carrying capacity and voltage drop) and, if you enter the data, checks the fuse breaking capacity against the set's short-circuit current.",
      poCo: "Lead-acid batteries also give hundreds of amps in a short circuit — too thin a cable or a fuse with too low an AIC is a fire risk.",
    },
    pola: {
      prad: {
        nazwa: "Charge/discharge current [A]",
        cel: "The largest continuous current in the cable.",
        gdzie: "From the inverter/charger datasheet or power ÷ voltage.",
        zakres: Z_KARTY_EN,
      },
      napiecie: {
        nazwa: "System voltage [V]",
        cel: "For converting the voltage drop.",
        gdzie: "The battery set voltage.",
        zakres: "Typically 12, 24 or 48 V.",
      },
      dlugosc: {
        nazwa: "Cable route length [m]",
        cel: "The longer it is, the larger the voltage drop (counted there and back).",
        gdzie: "Measure along the route.",
        zakres: "Your installation.",
      },
      material: {
        nazwa: "Conductor material",
        cel: "Copper or aluminium — different resistivity.",
        gdzie: "From the cable description.",
        zakres: "Cu or Al.",
      },
      ulozenie: {
        nazwa: "Installation method",
        cel: "Affects the cable's current-carrying capacity.",
        gdzie: "The worst section of the route.",
        zakres: "Options on the list.",
      },
      temperatura: {
        nazwa: "Ambient temperature [°C]",
        cel: "Lowers the cable's allowed current.",
        gdzie: "The highest expected along the route.",
        zakres: "Your conditions.",
      },
      wiazka: {
        nazwa: "Number of cables in the bundle [pcs]",
        cel: "Cables in a bundle heat each other.",
        gdzie: "Count the loaded conductors running together.",
        zakres: "Your installation.",
      },
      spadek: {
        nazwa: "Allowed voltage drop [%]",
        cel: "The cross-section condition.",
        gdzie: "The default or the manufacturer's requirement.",
        zakres: "For DC usually {spadekDc}%.",
      },
      pradZwarcia: {
        nazwa: "Short-circuit current of the set [A] (optional)",
        cel: "Compared with the fuse breaking capacity.",
        gdzie: "From the battery datasheet or the “Short-circuit analysis” screen (Module 5).",
        zakres: "The short-circuit analysis result.",
      },
      aic: {
        nazwa: "Fuse breaking capacity (AIC) [A] (optional)",
        cel: "It must exceed the short-circuit current.",
        gdzie: "From the fuse datasheet.",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "uruchomienie-testy-olow": {
    migawka: {
      oCoChodzi: "The first start-up of a lead-acid set — you check that all the batteries behave the same.",
      jakDziala: "A checklist: rest voltage of each battery, watching the charging curve, temperature during the first charge.",
      poCo: "A battery that heats more than the others or has a different voltage must be caught at the start, before it ruins the rest.",
    },
    pola: {},
  },
  "demontaz-olow": {
    migawka: {
      oCoChodzi: "The same rule as with LiFePO4 — ground (minus) always first when disconnecting.",
      jakDziala: "A list of disassembly steps for a lead-acid set in a safe order, protecting the terminals and electrolyte.",
      poCo: "Disconnecting plus first and touching ground with the spanner makes a short circuit. Spilled electrolyte burns.",
    },
    pola: {},
  },
  "bezpieczenstwo-kwas": {
    migawka: {
      oCoChodzi: "Electrolyte is sulphuric acid — it burns skin and eyes.",
      jakDziala: "A checklist: acid-resistant goggles and gloves, baking soda for neutralisation, a known procedure for contact with skin or eyes.",
      poCo: "When topping up water or cleaning terminals a drop of acid in the eye means a trip to A&E. Preparation takes a minute.",
    },
    pola: {},
  },
  "gestosc-elektrolitu": {
    migawka: {
      oCoChodzi:
        "Electrolyte density is a direct indicator of a lead-acid battery's state of charge — the equivalent of the BMS SoC, only measured by hand with a hydrometer.",
      jakDziala: "The app compares the measured density with the source's reference points: {pelny} = full, {polowa} = half, {rozladowany} = discharged.",
      poCo: "A density difference between a battery's cells reveals a weak cell before the set stops holding energy.",
    },
    pola: {
      gestosc: {
        nazwa: "Measured electrolyte density [g/cm³]",
        cel: "An indicator of the state of charge.",
        gdzie: "A hydrometer, in each cell (flooded batteries only), after resting without charging.",
        zakres: "{pelny} = full, {polowa} = half, {rozladowany} = discharged.",
      },
    },
  },
  "ocena-zasiarczenia": {
    migawka: {
      oCoChodzi: "Sulphation is hardening lead sulphate on the plates — the battery loses capacity.",
      jakDziala: "You tick the symptoms you actually see: long charging, fast discharge, white deposit on the terminals, fast voltage drop after charging. The app assesses the likelihood of sulphation.",
      poCo: "Sulphation detected early can sometimes be reversed (Screen B11); neglected — no longer.",
    },
    pola: {},
  },
  "ratowanie-zasiarczenia": {
    migawka: {
      oCoChodzi:
        "Desulphation is an attempt to reverse a chemical process that is normally irreversible — it sometimes works when detected early, rarely with a neglected battery.",
      jakDziala: "For a battery with diagnosed sulphation (Screen B10) the app gives the recommended desulphation procedure and its limits.",
      poCo: "So you don't spend money rescuing a battery that won't come back — and know when an attempt makes sense.",
    },
    pola: {},
  },
  "przechowywanie-recykling-olow": {
    migawka: {
      oCoChodzi:
        "The key difference from LiFePO4: store a lead-acid battery fully charged, not at 50% — a discharged one freezes and loses capacity through sulphation.",
      jakDziala: "Three topics: storing lead-acid batteries, recycling (lead and acid are hazardous waste) and diagnostic tools.",
      poCo: "A discharged lead-acid battery freezes at a few degrees below zero and cracks; a worn one must go to a collection point.",
    },
    pola: {},
  },
}

const Z_KARTY_RU = "диапазон из технической документации — приложение не подставляет типовое значение за вас."

export const ru: Tlumaczenie<typeof pl> = {
  "weryfikacja-ogniw": {
    migawka: {
      oCoChodzi:
        "Прежде чем элементы попадут в общий пакет, они должны пройти эту проверку — неверное число элементов или слишком большая разница напряжений — самая частая причина проблем при сборке собственного пакета LiFePO4.",
      jakDziala:
        "Вы выбираете напряжение системы (12 В = 4S, 24 В = 8S, 48 В = 16S) и вводите напряжение каждого элемента. Приложение проверяет число элементов и разницу между самым высоким и самым низким напряжением — выше {maxRoznica} В элементы сначала нужно выровнять.",
      poCo:
        "Элементы с разной степенью заряда, соединённые последовательно, разойдутся при первой же зарядке: один дойдёт до верхнего порога BMS раньше, чем остальные зарядятся, и пакет никогда не даст полной ёмкости.",
      fizyka: "ΔV = V_max − V_min.",
    },
    pola: {
      napiecieSystemu: {
        nazwa: "Напряжение системы",
        cel: "Определяет ожидаемое число элементов в последовательной цепи (элемент LiFePO4 — 3,2 В номинально).",
        gdzie: "Ваш проект: напряжение инвертора/зарядного устройства.",
        zakres: "12 В (4S), 24 В (8S) или 48 В (16S).",
      },
      liczbaOgniw: {
        nazwa: "Число элементов в пакете",
        cel: "Сравнивается с ожидаемым для напряжения системы.",
        gdzie: "Посчитайте имеющиеся элементы.",
        zakres: "Меняйте, только если собираете нестандартную конфигурацию.",
      },
      napiecieOgniwa: {
        nazwa: "Напряжение элемента [В]",
        cel: "Напряжение покоя каждого элемента — по ним считается разница ΔV.",
        gdzie: "Мультиметр с точностью 0,001 В на клеммах элемента, без нагрузки.",
        zakres: "Разница между элементами не более {maxRoznica} В.",
      },
    },
  },
  "montaz-mechaniczny": {
    migawka: {
      oCoChodzi:
        "Прежде чем соединять элементы электрически — проверьте сжатие и разделение. Сжатие вне диапазона грозит потерей внутреннего контакта или повреждением элементов.",
      jakDziala: "Приложение сравнивает сжатие призматических элементов с диапазоном {dociskMin}–{dociskMax} кгс (тот же порог, что в Модуле 4, Экран 21) и проверяет список разделения.",
      poCo: "Призматические элементы без сжатия вздуваются и быстрее стареют; без разделения корпуса могут перетереться и замкнуть.",
    },
    pola: {
      docisk: {
        nazwa: "Сжатие призматических элементов [кгс]",
        cel: "Сила, сжимающая элементы в пакете.",
        gdzie: "Из проекта стяжек или по измерению момента стяжных болтов.",
        zakres: "Рекомендуемый диапазон: {dociskMin}–{dociskMax} кгс.",
      },
    },
  },
  "polaczenia-elektryczne": {
    migawka: {
      oCoChodzi:
        "Порядок соединения важен — случайное КЗ при сборке последовательной цепи элементов — самая частая причина несчастных случаев при сборке собственного пакета.",
      jakDziala: "Список последовательных соединений и правил безопасности: изолированные инструменты, одна шина за раз, закрывание открытых клемм.",
      poCo: "Пакет 48 В, замкнутый ключом, за долю секунды может раскалить его докрасна — и обжечь руку.",
    },
    pola: {},
  },
  "podlaczenie-bms": {
    migawka: {
      oCoChodzi:
        "Прежде чем включить главный предохранитель или контактор, входные конденсаторы инвертора должны зарядиться через резистор — иначе будет искра.",
      jakDziala: "По входной ёмкости инвертора и резистору предзаряда приложение считает время зарядки конденсаторов (5 постоянных времени) — та же формула, что в Модуле 4, Экран 7.",
      poCo: "Искра при включении выжигает контакты, а бросок тока может сработать защиту BMS от КЗ.",
      fizyka: "T = 5 · R · C.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Входная ёмкость DC инвертора [мкФ]",
        cel: "Чем она больше, тем дольше зарядка через резистор.",
        gdzie: "Из документации инвертора.",
        zakres: Z_KARTY_RU,
      },
      rezystor: {
        nazwa: "Резистор предзаряда (pre-charge) [Ом]",
        cel: "Ограничивает ток зарядки конденсаторов.",
        gdzie: "Подберите так, чтобы ограничить бросок тока; проверьте и его мощность.",
        zakres: "Пример из источника: {rezystor} Ом / 50 Вт.",
      },
    },
  },
  "pierwsze-uruchomienie": {
    migawka: {
      oCoChodzi:
        "Первая зарядка — это не «включил и забыл»: в этот момент BMS изучает ваш пакет и выравнивает заводские различия между элементами.",
      jakDziala:
        "Приложение считает тестовый ток зарядки ({cRate}C × ёмкость в течение {czas} минут) и проверяет, достиг ли самый заряженный элемент порога top balancing ({prog} В).",
      poCo: "Без выравнивания сверху пакет никогда не зарядится полностью — BMS прервёт зарядку на первом «быстром» элементе.",
      fizyka: "I_тест = {cRate}C × C_А·ч.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Ёмкость пакета [А·ч]",
        cel: "Для расчёта тестового тока зарядки.",
        gdzie: "Из документации элементов.",
        zakres: "Тестовый ток: {cRate}C в течение {czas} минут.",
      },
      napiecieMax: {
        nazwa: "Напряжение самого заряженного элемента [В]",
        cel: "Показывает, достигнут ли top balancing.",
        gdzie: "Из BMS (напряжения элементов) или мультиметром.",
        zakres: "Top balancing при {prog} В.",
      },
    },
  },
  "demontaz-pakietu": {
    migawka: {
      oCoChodzi:
        "Порядок разборки — не рекомендация: это точная противоположность порядка сборки, и каждое отступление повышает риск КЗ в руках.",
      jakDziala: "Приложение пересчитывает напряжение пакета в напряжение элемента (V ÷ число элементов) и проверяет, укладывается ли оно в диапазон, рекомендуемый перед разборкой. Затем ведёт по шагам.",
      poCo: "Элементы, разобранные полностью заряженными, опаснее при случайном КЗ и хуже переносят хранение.",
      fizyka: "V_элемент = V_пакета / S.",
    },
    pola: {
      napiecieSystemu: {
        nazwa: "Напряжение системы",
        cel: "Определяет число элементов в последовательной цепи.",
        gdzie: "Напряжение разбираемого пакета.",
        zakres: "12 В (4S), 24 В (8S) или 48 В (16S).",
      },
      napiecie: {
        nazwa: "Измеренное напряжение пакета [В]",
        cel: "Пересчитывается в напряжение одного элемента.",
        gdzie: "Мультиметр на клеммах пакета, без нагрузки.",
        zakres: "Рекомендуется перед разборкой: 3,0–{vMax} В/элемент (для {s}S около {vLo}–{vHi} В).",
      },
    },
  },
  "przygotowanie-stanowiska": {
    migawka: {
      oCoChodzi: "Прежде чем начать сборку пакета — рабочее место и инструменты должны быть готовы.",
      jakDziala: "Контрольный список: изолирующий коврик, динамометрический ключ с изолированными головками, перчатки, очки, огнетушитель под рукой, никаких незакреплённых металлических предметов.",
      poCo: "Одно обручальное кольцо или упавший ключ между клеммами — это КЗ в сотни ампер. Подготовка занимает 10 минут.",
    },
    pola: {},
  },
  "ocena-zuzycia": {
    migawka: {
      oCoChodzi: "Три измерения после снятия элемента и одна оценка, которая решает всё: заметно ли вздулся корпус.",
      jakDziala: "Контрольный список: толщина элемента по сравнению с заводской, напряжение через 24 часа (саморазряд), внутреннее сопротивление. Вздувшийся элемент в работу не возвращается.",
      poCo: "Элемент б/у выглядит хорошо до тех пор, пока в пакете не начнёт греться. Измерение перед повторным использованием — единственная защита.",
    },
    pola: {},
  },
  "ratowanie-ogniwa": {
    migawka: {
      oCoChodzi:
        "Глубокий разряд — часто необратимое повреждение элемента; иногда его удаётся «разбудить», но попытка спасения несёт реальный риск.",
      jakDziala:
        "По напряжению элемента приложение оценивает, безопасно ли спасение: выше {progRatunku} В — зарядка малым током ({prad} А) от источника, настроенного на {napiecieZasilacza} В, под присмотром; ниже — элемент на утилизацию.",
      poCo: "У слишком глубоко разряженного элемента могут быть внутренние замыкания из растворённой меди — при зарядке грозит перегрев.",
    },
    pola: {
      napiecie: {
        nazwa: "Измеренное напряжение элемента [В]",
        cel: "Решает, безопасна ли попытка спасения.",
        gdzie: "Мультиметр на клеммах элемента. 0 В — корректный, критический результат.",
        zakres: "Порог безопасного спасения: {progRatunku} В.",
      },
    },
  },
  "przechowywanie-recykling": {
    migawka: {
      oCoChodzi:
        "Неработающий элемент — не «выключенный» элемент: неправильное хранение (полный заряд, мороз, влага) старит его так же, как неправильное использование.",
      jakDziala: "Три темы: как хранить элементы LiFePO4, куда сдать изношенные на переработку и какие диагностические инструменты стоит иметь.",
      poCo: "Правильное хранение продлевает жизнь элементов на годы; литиевые элементы нельзя выбрасывать в обычный мусор.",
    },
    pola: {},
  },
  "sekwencja-montazu": {
    migawka: {
      oCoChodzi: "Точный пронумерованный порядок подключения шин и BMS — под число элементов в вашем пакете.",
      jakDziala: "Вы выбираете число элементов (пресет или своё чётное число от {min} до {max}). Приложение формирует последовательные шаги соединения в двухрядной схеме с местом для фото на каждом шаге.",
      poCo: "Ошибка в порядке — это КЗ в руках или перепутанный балансировочный провод, который сжигает BMS.",
    },
    pola: {
      liczbaOgniw: {
        nazwa: "Число последовательных элементов",
        cel: "По нему формируется последовательность соединений.",
        gdzie: "Ваш проект пакета (например, 16S для 48 В).",
        zakres: "Пресет 4S/8S/16S или «Другое число».",
      },
      wlasnaLiczba: {
        nazwa: "Своё число элементов [шт.]",
        cel: "Для нестандартных пакетов.",
        gdzie: "Ваш проект.",
        zakres: "Только чётное, от {min} до {max} — двухрядная схема требует равного деления.",
      },
    },
  },
  "weryfikacja-wstepna-olow": {
    migawka: {
      oCoChodzi: "Проверка свинцово-кислотных аккумуляторов перед сборкой комплекта.",
      jakDziala: "Контрольный список: одинаковые тип, ёмкость и близкий возраст, напряжение покоя, уровень электролита (для обслуживаемых), отсутствие трещин и протечек.",
      poCo: "Один более старый или слабый аккумулятор в последовательной цепи ограничивает весь комплект и постоянно перезаряжается или недозаряжается.",
    },
    pola: {},
  },
  "montaz-mechaniczny-olow": {
    migawka: {
      oCoChodzi: "Свинцово-кислотные аккумуляторы тяжёлые и выделяют водород — монтаж должен учитывать и то, и другое.",
      jakDziala: "Контрольный список: несущая способность основания, надёжное крепление, вентиляция помещения, удаление от источников искр и огня.",
      poCo: "Комплект из нескольких аккумуляторов весит сотни килограммов; водород в невентилируемом помещении может взорваться от искры.",
    },
    pola: {},
  },
  "polaczenia-czyszczenie-olow": {
    migawka: {
      oCoChodzi: "Чистые клеммы и хорошие соединения — меньше сопротивление и меньше тепла в месте контакта.",
      jakDziala: "Контрольный список: очистка клемм, техническое вазелиновое покрытие соединений, схема соединений, соответствующая напряжению.",
      poCo: "Налёт на клеммах повышает сопротивление — соединение греется, а комплект заряжается неравномерно.",
    },
    pola: {},
  },
  "balansery-zewnetrzne-olow": {
    migawka: {
      oCoChodzi:
        "У свинцово-кислотных аккумуляторов нет встроенного «судьи», следящего за балансом, — при последовательном соединении его нужно добавить снаружи, иначе самый слабый аккумулятор ограничит весь комплект.",
      jakDziala: "Приложение проверяет число аккумуляторов в последовательной цепи: начиная с {minAku} рекомендует внешний балансир.",
      poCo: "Без балансира один аккумулятор постоянно перезаряжается (газит и высыхает), а другой недозаряжается (сульфатируется).",
    },
    pola: {
      liczba: {
        nazwa: "Число аккумуляторов в последовательной цепи [шт.]",
        cel: "От него зависит, нужен ли балансир.",
        gdzie: "Посчитайте аккумуляторы, соединённые плюс к минусу.",
        zakres: "От {minAku} — балансир рекомендуется.",
      },
    },
  },
  "dobor-kabli-bezpiecznikow-olow": {
    migawka: {
      oCoChodzi:
        "Подбор кабеля зависит не от химии батареи, а от тока и длины — тот же вычислительный движок, что в Модуле 5, только другие числа.",
      jakDziala: "Приложение подбирает сечение по HD 60364-5-52 (допустимый ток и падение напряжения) и, если вы введёте данные, проверяет отключающую способность предохранителя относительно тока КЗ комплекта.",
      poCo: "Свинцово-кислотные аккумуляторы тоже дают при КЗ сотни ампер — слишком тонкий кабель или предохранитель с малой AIC — риск пожара.",
    },
    pola: {
      prad: {
        nazwa: "Ток заряда/разряда [А]",
        cel: "Наибольший длительный ток в кабеле.",
        gdzie: "Из документации инвертора/зарядного устройства или мощность ÷ напряжение.",
        zakres: Z_KARTY_RU,
      },
      napiecie: {
        nazwa: "Напряжение системы [В]",
        cel: "Для пересчёта падения напряжения.",
        gdzie: "Напряжение комплекта аккумуляторов.",
        zakres: "Обычно 12, 24 или 48 В.",
      },
      dlugosc: {
        nazwa: "Длина трассы кабеля [м]",
        cel: "Чем длиннее, тем больше падение напряжения (считается туда и обратно).",
        gdzie: "Измерьте по трассе.",
        zakres: "Ваша установка.",
      },
      material: {
        nazwa: "Материал проводника",
        cel: "Медь или алюминий — разное удельное сопротивление.",
        gdzie: "Из описания кабеля.",
        zakres: "Cu или Al.",
      },
      ulozenie: {
        nazwa: "Способ прокладки",
        cel: "Влияет на допустимый ток кабеля.",
        gdzie: "Самый неблагоприятный участок трассы.",
        zakres: "Варианты из списка.",
      },
      temperatura: {
        nazwa: "Температура окружающей среды [°C]",
        cel: "Снижает допустимый ток кабеля.",
        gdzie: "Наибольшая ожидаемая на трассе.",
        zakres: "Ваши условия.",
      },
      wiazka: {
        nazwa: "Число кабелей в пучке [шт.]",
        cel: "Кабели в пучке нагревают друг друга.",
        gdzie: "Посчитайте нагруженные проводники, идущие вместе.",
        zakres: "Ваша установка.",
      },
      spadek: {
        nazwa: "Допустимое падение напряжения [%]",
        cel: "Условие подбора сечения.",
        gdzie: "Значение по умолчанию или требование производителя.",
        zakres: "Для DC обычно {spadekDc}%.",
      },
      pradZwarcia: {
        nazwa: "Ток КЗ комплекта [А] (необязательно)",
        cel: "Сравнивается с отключающей способностью предохранителя.",
        gdzie: "Из документации аккумулятора или с экрана «Анализ коротких замыканий» (Модуль 5).",
        zakres: "Результат анализа КЗ.",
      },
      aic: {
        nazwa: "Отключающая способность (AIC) предохранителя [А] (необязательно)",
        cel: "Должна превышать ток КЗ.",
        gdzie: "Из документации предохранителя.",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "uruchomienie-testy-olow": {
    migawka: {
      oCoChodzi: "Первый запуск свинцово-кислотного комплекта — проверяете, ведут ли себя все аккумуляторы одинаково.",
      jakDziala: "Контрольный список: напряжение покоя каждого аккумулятора, наблюдение кривой зарядки, температура во время первой зарядки.",
      poCo: "Аккумулятор, который греется сильнее других или имеет другое напряжение, нужно выявить в самом начале, пока он не испортил остальные.",
    },
    pola: {},
  },
  "demontaz-olow": {
    migawka: {
      oCoChodzi: "То же правило, что и для LiFePO4: масса (минус) всегда отключается первой.",
      jakDziala: "Список шагов разборки свинцово-кислотного комплекта в безопасном порядке, с защитой клемм и электролита.",
      poCo: "Если первым отключить плюс и коснуться ключом массы — будет КЗ. Пролитый электролит обжигает.",
    },
    pola: {},
  },
  "bezpieczenstwo-kwas": {
    migawka: {
      oCoChodzi: "Электролит — это серная кислота: она обжигает кожу и глаза.",
      jakDziala: "Контрольный список: кислотостойкие очки и перчатки, пищевая сода для нейтрализации, известная процедура при попадании на кожу или в глаза.",
      poCo: "При доливке воды или чистке клемм капля кислоты в глазу — поездка в травмпункт. Подготовка занимает минуту.",
    },
    pola: {},
  },
  "gestosc-elektrolitu": {
    migawka: {
      oCoChodzi:
        "Плотность электролита — прямой показатель степени заряда свинцово-кислотного аккумулятора, аналог SoC из BMS, только измеряемый вручную ареометром.",
      jakDziala: "Приложение сравнивает измеренную плотность с опорными точками источника: {pelny} = полный, {polowa} = половина, {rozladowany} = разряжен.",
      poCo: "Разница плотности между банками аккумулятора выдаёт слабую банку до того, как комплект перестанет держать энергию.",
    },
    pola: {
      gestosc: {
        nazwa: "Измеренная плотность электролита [г/см³]",
        cel: "Показатель степени заряда.",
        gdzie: "Ареометр, в каждой банке (только обслуживаемые аккумуляторы), после отстоя без зарядки.",
        zakres: "{pelny} = полный, {polowa} = половина, {rozladowany} = разряжен.",
      },
    },
  },
  "ocena-zasiarczenia": {
    migawka: {
      oCoChodzi: "Сульфатация — твердеющий сульфат свинца на пластинах: аккумулятор теряет ёмкость.",
      jakDziala: "Вы отмечаете симптомы, которые действительно видите: долгая зарядка, быстрый разряд, белый налёт на клеммах, быстрое падение напряжения после зарядки. Приложение оценивает вероятность сульфатации.",
      poCo: "Рано обнаруженную сульфатацию иногда удаётся обратить (Экран B11); запущенную — уже нет.",
    },
    pola: {},
  },
  "ratowanie-zasiarczenia": {
    migawka: {
      oCoChodzi:
        "Десульфатация — попытка обратить химический процесс, который обычно необратим: иногда помогает при раннем обнаружении, редко — при запущенном аккумуляторе.",
      jakDziala: "Для аккумулятора с диагностированной сульфатацией (Экран B10) приложение даёт рекомендуемую процедуру десульфатации и её ограничения.",
      poCo: "Чтобы не тратить деньги на спасение аккумулятора, который уже не вернётся, — и знать, когда попытка имеет смысл.",
    },
    pola: {},
  },
  "przechowywanie-recykling-olow": {
    migawka: {
      oCoChodzi:
        "Ключевое отличие от LiFePO4: свинцово-кислотный аккумулятор храните полностью заряженным, а не на 50% — разряженный замерзает и теряет ёмкость из-за сульфатации.",
      jakDziala: "Три темы: хранение свинцово-кислотных аккумуляторов, переработка (свинец и кислота — опасные отходы) и диагностические инструменты.",
      poCo: "Разряженный свинцово-кислотный аккумулятор замерзает уже при нескольких градусах мороза и трескается; изношенный нужно сдать в пункт приёма.",
    },
    pola: {},
  },
}
