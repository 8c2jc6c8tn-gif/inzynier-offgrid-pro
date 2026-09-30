/**
 * Help content — Module 12 (quick calculator / small and mobile installations).
 * Ranges only from the engines' constants and sources in the repo (Directive #1); where the repo
 * has none, the text sends the user to the datasheet.
 */
import type { Tlumaczenie } from "./typy"

const Z_KARTY = "zakres z karty katalogowej urządzenia — aplikacja nie przyjmuje typowej wartości za Ciebie."

export const pl = {
  "bezpieczenstwo-kamper": {
    migawka: {
      oCoChodzi:
        "Akumulator w kamperze jedzie razem z Tobą: waży kilkanaście–kilkadziesiąt kilogramów, przy hamowaniu leci do przodu, a niektóre typy wydzielają wodór. Ta lista pokazuje, co musi być zrobione, żeby był bezpiecznym pasażerem.",
      jakDziala:
        "Wybierasz typ akumulatora (AGM, kwasowy albo LiFePO4). Aplikacja pokazuje tylko te punkty, które dotyczą tej chemii — np. wentylacja jest obowiązkowa dla akumulatora kwasowego, a dla LiFePO4 ważniejsze jest zabezpieczenie przed zimnem przy ładowaniu. Odhaczasz punkty, które masz zrobione; niezaznaczony punkt krytyczny zostaje na czerwono.",
      poCo:
        "Żeby przed wyjazdem sprawdzić mocowanie, wentylację i zabezpieczenia. Źle zamocowany akumulator przy gwałtownym hamowaniu staje się pociskiem, a wodór z akumulatora kwasowego w zamkniętej zabudowie może wybuchnąć od iskry.",
    },
    pola: {},
  },
  "ladowanie-w-garazu": {
    migawka: {
      oCoChodzi:
        "Ładowanie akumulatora w zamkniętym garażu to nie to samo co w otwartej przestrzeni: ołowiowe akumulatory przy ładowaniu wydzielają wodór, który jest bezwonny i wybuchowy.",
      jakDziala:
        "Wybierasz typ akumulatora. Aplikacja pokazuje listę kontrolną dla tej chemii: wentylację, odległość od źródeł iskier, ładowarkę z właściwym profilem, podłoże i nadzór. Dla akumulatora kwasowego brak wentylacji to czerwony stop, dla AGM ostrzeżenie.",
      poCo:
        "Żeby ładować bezpiecznie i nie wywołać pożaru ani wybuchu. Najczęstszy błąd to ładowanie przy zamkniętej bramie obok szlifierki, pieca albo innego źródła iskier.",
    },
    pola: {},
  },
  "checklista-chemii": {
    pola: {
      typ: {
        nazwa: "Typ (chemia) akumulatora",
        cel: "Od chemii zależy, które punkty listy obowiązują: akumulator kwasowy (zalewowy) wydziela najwięcej wodoru, AGM mniej (jest szczelny, ale przy przeładowaniu też odgazowuje), LiFePO4 nie wydziela wodoru, ale nie wolno go ładować na mrozie.",
        gdzie: "Na naklejce akumulatora albo w jego karcie katalogowej. Korki do dolewania wody = kwasowy; napis AGM lub VRLA = AGM; LiFePO4 / LFP / Li-ion z BMS = litowy.",
        zakres: "Jedna z trzech opcji na liście. Nie wiesz? Wybierz kwasowy — to najbardziej wymagająca, bezpieczna strona.",
      },
    },
  },
  "dni-bez-slonca": {
    migawka: {
      oCoChodzi:
        "Ile pochmurnych dni z rzędu wytrzyma akumulator, który już masz, zanim trzeba będzie go doładować — bez paneli, agregatu i sieci.",
      jakDziala:
        "Aplikacja liczy energię, którą naprawdę możesz wyjąć z akumulatora: pojemność [Ah] × napięcie [V] daje energię [Wh], z niej bierze tylko dopuszczalną część (DoD) i odejmuje straty przetwornicy. Wynik dzieli przez Twoje dobowe zużycie — wychodzi liczba dni.",
      poCo:
        "Żeby wiedzieć, czy obecny akumulator wystarczy na weekend bez słońca, czy trzeba go powiększyć albo zabrać ładowarkę. Liczenie na pełną pojemność z naklejki daje zawyżony, fałszywy wynik.",
      fizyka:
        "Energia zmagazynowana w akumulatorze to iloczyn ładunku i napięcia: 1 Ah przy 12 V to 12 Wh. Część energii zostaje w akumulatorze (DoD), część traci przetwornica (sprawność η).",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pojemność akumulatora [Ah]",
        cel: "Ile ładunku mieści akumulator. Razem z napięciem daje energię, z której liczone są dni pracy.",
        gdzie: "Na naklejce lub w karcie akumulatora (np. „100 Ah”). Przy kilku akumulatorach połączonych równolegle zsumuj ich pojemności.",
        zakres: Z_KARTY,
      },
      napiecie: {
        nazwa: "Napięcie znamionowe akumulatora [V]",
        cel: "Zamienia pojemność w amperogodzinach na energię w watogodzinach (Wh = Ah × V).",
        gdzie: "Na naklejce akumulatora: zwykle 12 V; przy dwóch połączonych szeregowo — 24 V.",
        zakres: "W małych instalacjach 12 V albo 24 V.",
      },
      dod: {
        nazwa: "Dopuszczalna głębokość rozładowania (DoD) [%]",
        cel: "Jaką część pojemności wolno zużyć bez skracania życia akumulatora. Aplikacja liczy tylko tę część energii.",
        gdzie: "W karcie katalogowej akumulatora (liczba cykli przy danym DoD).",
        zakres:
          "LiFePO4 typowo {dodMin}–{dodMax}%. AGM — źródło podaje 300–500 cykli przy 50% DoD; głębsze rozładowanie skraca jego życie.",
      },
      sprawnosc: {
        nazwa: "Sprawność przetwornicy (falownika) [%]",
        cel: "Przetwornica 12 V → 230 V traci część energii na ciepło. Aplikacja zmniejsza o tyle energię dostępną dla odbiorników.",
        gdzie: "W karcie przetwornicy („efficiency”). Gdy odbiorniki 12 V są zasilane wprost z akumulatora — wpisz 100%.",
        zakres: "100% bez przetwornicy. Z przetwornicą — wartość z karty (Moduł 4 sugeruje {sprawnosc}%).",
      },
      zuzycie: {
        nazwa: "Zużycie energii na dobę [Wh]",
        cel: "Ile energii odbiorniki pobierają w ciągu doby. Dzielnik w obliczeniu liczby dni.",
        gdzie: "Zsumuj: moc urządzenia × godziny pracy na dobę, np. lodówka 50 W × 6 h = 300 Wh. Pomoże ekran „Zużycie energii per urządzenie”.",
        zakres: "Zależy od Twoich odbiorników — policz je, nie szacuj.",
      },
    },
  },
  "dobor-regulatora-pwm-mppt": {
    migawka: {
      oCoChodzi:
        "Regulator ładowania stoi między panelem a akumulatorem. PWM to prosty łącznik, MPPT to przetwornica, która dopasowuje napięcie panelu do akumulatora i wyciska z panelu więcej energii.",
      jakDziala:
        "Aplikacja sprawdza dwie reguły ze źródła. Pierwsza: jeśli klasa napięcia paneli jest wyższa niż napięcie akumulatora, PWM nie da rady — potrzebny jest MPPT (to wymóg, nie zalecenie). Druga: przy zgodnych napięciach MPPT zaczyna się opłacać powyżej ok. {progMppt} W mocy paneli (środek zakresu 200–300 W ze źródła).",
      poCo:
        "Żeby nie przepłacić za MPPT przy małym panelu i nie kupić PWM tam, gdzie zmarnuje dużą część energii albo w ogóle nie zadziała.",
      fizyka:
        "PWM łączy panel wprost z akumulatorem, więc panel pracuje na napięciu akumulatora, a nie w swoim punkcie mocy maksymalnej. MPPT przetwarza nadwyżkę napięcia na dodatkowy prąd ładowania.",
    },
    pola: {
      moc: {
        nazwa: "Łączna moc paneli [W]",
        cel: "Od mocy zależy, czy droższy regulator MPPT zwróci się dodatkowym uzyskiem.",
        gdzie: "Na tabliczce panelu (Pmax, „W”). Przy kilku panelach zsumuj.",
        zakres: "Próg opłacalności MPPT w tej aplikacji: {progMppt} W. Moc panelu — z karty katalogowej.",
      },
      napieciePanelu: {
        nazwa: "Klasa napięciowa paneli [V]",
        cel: "Porównywana z napięciem akumulatora: panel o wyższej klasie niż akumulator wymaga MPPT.",
        gdzie: "Na tabliczce lub w opisie panelu: panel „12 V” albo „24 V”. To napięcie znamionowe, nie Voc (napięcie jałowe, zawsze wyższe).",
        zakres: "W małych instalacjach 12 V albo 24 V.",
      },
      napiecieAkumulatora: {
        nazwa: "Napięcie systemowe akumulatora [V]",
        cel: "Napięcie, do którego regulator ładuje akumulator. Porównywane z klasą paneli.",
        gdzie: "Na naklejce akumulatora; przy dwóch połączonych szeregowo — suma.",
        zakres: "W małych instalacjach 12 V albo 24 V.",
      },
    },
  },
  "gniazdo-zapalniczki": {
    migawka: {
      oCoChodzi:
        "Gniazdo zapalniczki ma własny, niewielki bezpiecznik. Wszystko, co podłączysz naraz — także przez rozgałęźnik — musi się w nim zmieścić.",
      jakDziala:
        "Aplikacja sumuje moc urządzeń włączonych jednocześnie i dzieli przez napięcie instalacji — wychodzi prąd. Porównuje go z bezpiecznikiem gniazda. Pokazuje też moc maksymalną gniazda: bezpiecznik × napięcie (np. 15 A × 12 V = 180 W).",
      poCo:
        "Żeby wiedzieć, co można podłączyć, zanim przepali się bezpiecznik albo — gorzej — przegrzeje się cienki przewód za gniazdem. Lodówka turystyczna zwykle zmieści się, kompresor do opon jest na granicy, sprzęt powyżej ok. 180 W raczej nie.",
      fizyka: "Prąd I = P / U. Bezpiecznik chroni przewód: prąd większy niż jego wartość powoduje przepalenie.",
    },
    pola: {
      napiecie: {
        nazwa: "Napięcie instalacji pojazdu [V]",
        cel: "Dzielnik przy przeliczaniu mocy urządzeń na prąd. Przy tej samej mocy w 24 V płynie o połowę mniejszy prąd niż w 12 V.",
        gdzie: "Samochody osobowe i kampery mają 12 V, ciężarówki i autobusy zwykle 24 V (instrukcja pojazdu).",
        zakres: "12 V albo 24 V.",
      },
      bezpiecznik: {
        nazwa: "Wartość bezpiecznika gniazda [A]",
        cel: "Najwyższy prąd, jaki gniazdo może stale oddać. Aplikacja porównuje z nim prąd podłączonych urządzeń.",
        gdzie: "W instrukcji pojazdu albo na opisie skrzynki bezpieczników (pokrywa lub schemat).",
        zakres: "Typowo 10–15 A.",
      },
      nazwaUrzadzenia: {
        nazwa: "Nazwa urządzenia",
        cel: "Tylko dla Ciebie — żeby rozpoznać pozycję na liście. Nie wpływa na obliczenia.",
        gdzie: "Wpisz dowolną nazwę, np. „lodówka”.",
        zakres: "Dowolny tekst.",
      },
      mocUrzadzenia: {
        nazwa: "Moc urządzenia [W]",
        cel: "Sumowana z mocą pozostałych urządzeń włączonych jednocześnie i przeliczana na prąd.",
        gdzie: "Na tabliczce, zasilaczu albo w instrukcji urządzenia (W). Gdy podany jest tylko prąd — pomnóż A × V.",
        zakres: Z_KARTY,
      },
    },
  },
  "ochrona-przed-rozladowaniem": {
    migawka: {
      oCoChodzi:
        "Dozownik napięcia (LVD, Low Voltage Disconnect) odłącza odbiornik, zanim rozładuje on akumulator za głęboko. Ten ekran podaje, na jakie napięcie go ustawić.",
      jakDziala:
        "Aplikacja bierze próg odcięcia dla akumulatora 12 V ze źródła (AGM {progAgm} V, LiFePO4 {progLfp} V) i przelicza go na napięcie Twojej instalacji: próg × (napięcie / 12). Dla akumulatora kwasowego źródło progu nie podaje — aplikacja go nie zgaduje.",
      poCo:
        "Głębokie rozładowanie niszczy akumulatory ołowiowe (zasiarczenie) i może zablokować BMS akumulatora litowego. LVD ustawiony na właściwy próg to tania ochrona drogiego akumulatora.",
      fizyka:
        "Napięcie spoczynkowe akumulatora spada wraz z rozładowaniem. Akumulator 12 V ołowiowy ma {ogniwaOlow} ogniw po 2 V, LiFePO4 — {ogniwaLfp} ogniwa po 3,2 V, dlatego progi się różnią.",
    },
    pola: {
      typ: {
        nazwa: "Typ (chemia) akumulatora",
        cel: "Każda chemia ma inny bezpieczny próg odcięcia.",
        gdzie: "Na naklejce akumulatora lub w karcie katalogowej (AGM/VRLA, kwasowy z korkami, LiFePO4/LFP).",
        zakres: "AGM, kwasowy albo LiFePO4.",
      },
      napiecie: {
        nazwa: "Napięcie znamionowe instalacji [V]",
        cel: "Próg z akumulatora 12 V aplikacja mnoży przez (napięcie / 12), żeby dostać próg dla Twojej instalacji.",
        gdzie: "Na naklejce akumulatora; przy połączeniu szeregowym — suma napięć.",
        zakres: "12, 24 albo 48 V.",
      },
    },
  },
  "panel-do-stacji-zasilania": {
    migawka: {
      oCoChodzi:
        "Stacje zasilania i powerbanki mają niższe limity wejścia solarnego niż profesjonalne regulatory MPPT. Panel dobrany „na oko” łatwo je uszkodzi — zwłaszcza zimą, bo na mrozie napięcie panelu rośnie.",
      jakDziala:
        "Aplikacja liczy najwyższe napięcie paneli w najzimniejszy poranek: Voc × (1 + β × (T_min − {tStc} °C)) × liczba paneli w szeregu, i porównuje z limitem napięcia stacji. Osobno liczy prąd: Isc × liczba gałęzi równoległych — i porównuje z limitem prądu stacji. Przekroczenie napięcia to czerwony stop.",
      poCo:
        "Za wysokie napięcie z panelu uszkadza wejście stacji natychmiast i zwykle bez gwarancji. Zbyt duży prąd zwykle jest tylko ograniczany, ale warto wiedzieć, że część mocy się zmarnuje.",
      fizyka:
        "Napięcie ogniwa krzemowego rośnie, gdy temperatura spada (współczynnik β jest ujemny). Karta panelu podaje Voc przy {tStc} °C (STC), więc w mroźny słoneczny poranek napięcie jest wyższe niż na tabliczce.",
    },
    pola: {
      voc: {
        nazwa: "Napięcie jałowe panelu Voc przy STC [V]",
        cel: "Punkt wyjścia do obliczenia napięcia na mrozie. Voc to napięcie bez obciążenia — najwyższe, jakie panel poda.",
        gdzie: "Na tabliczce z tyłu panelu albo w karcie katalogowej („Voc”, „Open circuit voltage”).",
        zakres: Z_KARTY,
      },
      beta: {
        nazwa: "Współczynnik temperaturowy napięcia Voc (β) [%/°C]",
        cel: "O ile procent rośnie napięcie na każdy stopień poniżej 25 °C. Aplikacja używa go do obliczenia Voc na mrozie.",
        gdzie: "W karcie katalogowej panelu („Temperature coefficient of Voc”). Wartość jest ujemna.",
        zakres: "Typowo od {betaMin} do {betaMax} %/°C.",
      },
      tmin: {
        nazwa: "Najniższa temperatura pracy [°C]",
        cel: "Im zimniej, tym wyższe napięcie panelu. Aplikacja liczy napięcie dla tej temperatury.",
        gdzie: "Najzimniejszy poranek, w którym panel będzie podłączony do stacji (np. wyjazdy zimowe).",
        zakres: "Twoje warunki — przy użyciu tylko latem wpisz najzimniejszy letni poranek.",
      },
      szeregowo: {
        nazwa: "Liczba paneli połączonych szeregowo",
        cel: "Przy połączeniu szeregowym napięcia paneli się sumują.",
        gdzie: "Policz panele połączone „plus do minusa” w jednym łańcuchu.",
        zakres: "Najczęściej 1–2 przy stacjach zasilania.",
      },
      limitNapiecia: {
        nazwa: "Maksymalne napięcie wejścia solarnego stacji [V]",
        cel: "Granica, której napięcie paneli na mrozie nie może przekroczyć.",
        gdzie: "W karcie stacji/powerbanka (np. „Solar input: 12–60 V” — bierzesz górną wartość).",
        zakres: Z_KARTY,
      },
      isc: {
        nazwa: "Prąd zwarciowy panelu Isc [A]",
        cel: "Najwyższy prąd, jaki panel może dać. Porównywany z limitem prądu stacji.",
        gdzie: "Na tabliczce lub w karcie panelu („Isc”, „Short circuit current”).",
        zakres: Z_KARTY,
      },
      rownolegle: {
        nazwa: "Liczba gałęzi równoległych",
        cel: "Przy połączeniu równoległym prądy gałęzi się sumują.",
        gdzie: "Policz łańcuchy paneli połączone równolegle (plus z plusem). Puste pole = jedna gałąź.",
        zakres: "Najczęściej 1.",
      },
      limitPradu: {
        nazwa: "Maksymalny prąd wejścia solarnego stacji [A]",
        cel: "Granica prądu wejścia. Większy prąd paneli stacja zwykle ogranicza — część mocy się marnuje.",
        gdzie: "W karcie stacji/powerbanka („Solar input … A”).",
        zakres: Z_KARTY,
      },
    },
  },
  "ratowanie-akumulatora-maly": {
    migawka: {
      oCoChodzi:
        "Rozładowany akumulator nie zawsze jest do wyrzucenia. To, czy i jak go ratować, zależy od chemii i od tego, jak głęboko się rozładował.",
      jakDziala:
        "Wybierasz typ akumulatora, a opcjonalnie wpisujesz napięcie spoczynkowe. Dla akumulatora ołowiowego 12 V (AGM, kwasowy) napięcie poniżej {prog} V oznacza krytyczne rozładowanie. Aplikacja kieruje Cię do pełnej procedury ratowania w sekcji Montaż baterii.",
      poCo:
        "Żeby nie pogorszyć sprawy: zły sposób ładowania głęboko rozładowanego akumulatora może go przegrzać, a akumulator LiFePO4 z zablokowanym BMS wymaga innego postępowania niż ołowiowy.",
    },
    pola: {
      typ: {
        nazwa: "Typ (chemia) akumulatora",
        cel: "Od chemii zależy procedura ratowania i próg krytycznego rozładowania.",
        gdzie: "Na naklejce akumulatora lub w karcie (AGM/VRLA, kwasowy z korkami, LiFePO4/LFP).",
        zakres: "AGM, kwasowy albo LiFePO4.",
      },
      napiecie: {
        nazwa: "Napięcie spoczynkowe akumulatora [V] (opcjonalnie)",
        cel: "Pokazuje, jak głęboko akumulator się rozładował. Dla ołowiowego 12 V poniżej {prog} V — krytycznie.",
        gdzie: "Zmierz miernikiem na zaciskach akumulatora 12 V po kilku godzinach bez ładowania i bez obciążenia.",
        zakres: "Próg krytyczny dla ołowiowego 12 V: {prog} V.",
      },
    },
  },
  "tryb-uproszczony": {
    migawka: {
      oCoChodzi:
        "Szybka odpowiedź na jedno pytanie: jak długo ten akumulator zasili to urządzenie? Bez pełnego projektu instalacji.",
      jakDziala:
        "Aplikacja mnoży pojemność akumulatora [Ah] przez napięcie [V] — to energia w Wh — i dzieli przez moc odbiornika [W]. Wynik to czas pracy w godzinach przy założeniu, że cała energia jest dostępna.",
      poCo:
        "Żeby w kilka sekund ocenić, czy zestaw ma sens. To górna granica — w praktyce odejmij rezerwę akumulatora (DoD) i straty przetwornicy; dokładniej policzy ekran „Ile dni pracy bez słońca”.",
      fizyka: "Energia E = C × U (Ah × V = Wh). Czas t = E / P.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pojemność akumulatora [Ah]",
        cel: "Razem z napięciem daje energię zmagazynowaną w akumulatorze.",
        gdzie: "Na naklejce akumulatora lub powerbanka (Ah).",
        zakres: Z_KARTY,
      },
      napiecie: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Zamienia amperogodziny na watogodziny.",
        gdzie: "Na naklejce akumulatora (zwykle 12 V).",
        zakres: "W małych zestawach zwykle 12 V albo 24 V.",
      },
      moc: {
        nazwa: "Moc odbiornika [W]",
        cel: "Dzielnik: im większa moc, tym krócej pracuje odbiornik.",
        gdzie: "Na tabliczce lub zasilaczu urządzenia (W). Gdy podany jest prąd — pomnóż A × V.",
        zakres: Z_KARTY,
      },
    },
  },
  "urzadzenie-12v-bezposrednio": {
    migawka: {
      oCoChodzi:
        "„12 V” na akumulatorze to uproszczenie. Realnie napięcie waha się od ok. 11 V przy rozładowaniu do napięcia ładowania — ok. 14,5 V i więcej. Nie każde urządzenie „12 V” to wytrzyma.",
      jakDziala:
        "Z napięcia urządzenia i jego tolerancji aplikacja liczy zakres, w którym urządzenie pracuje bezpiecznie. Porównuje go z zakresem napięć instalacji: od ok. 11 V (dla 12 V) do maksymalnego napięcia ładowania, które podajesz. Gdy napięcie ładowania przekracza górną granicę urządzenia — czerwony stop.",
      poCo:
        "Żeby nie spalić urządzenia w słoneczne południe, gdy regulator ładuje akumulator najwyższym napięciem. Jeśli zakresy się nie mieszczą, potrzebna jest przetwornica DC/DC stabilizująca napięcie.",
      fizyka:
        "Napięcie na zaciskach akumulatora zależy od stanu naładowania i od tego, czy trwa ładowanie. Przy ładowaniu absorpcyjnym jest najwyższe.",
    },
    pola: {
      napiecieInstalacji: {
        nazwa: "Napięcie znamionowe instalacji (akumulatora) [V]",
        cel: "Określa dolną granicę napięcia instalacji (dla 12 V ok. 11 V) i skalę porównania.",
        gdzie: "Na naklejce akumulatora.",
        zakres: "12 V albo 24 V.",
      },
      napiecieUrzadzenia: {
        nazwa: "Napięcie znamionowe urządzenia [V]",
        cel: "Środek zakresu, w którym urządzenie pracuje poprawnie.",
        gdzie: "Na tabliczce, gnieździe zasilania albo w instrukcji urządzenia.",
        zakres: Z_KARTY,
      },
      tolerancja: {
        nazwa: "Tolerancja napięcia urządzenia [± %]",
        cel: "O ile napięcie może odbiegać od znamionowego. Razem z napięciem daje zakres pracy urządzenia.",
        gdzie: "W instrukcji lub na tabliczce. Gdy podany jest zakres (np. 10–16 V), przelicz go na ± % od napięcia znamionowego.",
        zakres: Z_KARTY,
      },
      napiecieLadowania: {
        nazwa: "Maksymalne napięcie ładowania instalacji [V]",
        cel: "Najwyższe napięcie, do jakiego regulator lub ładowarka doprowadza akumulator (absorpcja; przy ołowiowym także wyrównywanie, jeśli jest włączone). Górna granica napięcia, jakie zobaczy urządzenie.",
        gdzie: "W ustawieniach regulatora albo w instrukcji ładowarki. Dla instalacji 24 V wpisz wartość całej instalacji, nie jednego akumulatora.",
        zakres: "Dla 12 V źródła podają {ladowanieMin}–{ladowanieMax} V.",
      },
    },
  },
  "uziemienie-male-instalacje": {
    migawka: {
      oCoChodzi: "Uziemienie to droga ucieczki dla prądu. Jak jej nie ma, prąd ucieka przez Ciebie.",
      jakDziala:
        "Wybierasz rodzaj instalacji i miejsce. Instalacja z samym 12/24 V DC zwykle nie wymaga uziemienia ochronnego, ale na jachcie i na zewnątrz (wilgoć) jest ono zalecane — żółte ostrzeżenie. Instalacja z falownikiem 230 V wymaga uziemienia — wtedy aplikacja pyta, czy obudowa falownika i styki ochronne gniazd są podłączone. Nieuziemiona obudowa falownika („nie” albo „nie wiem”) to czerwony stop; gniazda bez podłączonego styku ochronnego — żółte ostrzeżenie z wyjaśnieniem, czym to grozi. Na koniec pyta o połączenie N–PE w falowniku i o wyłącznik różnicowoprądowy (RCD) 30 mA — brak któregoś z nich to czerwony stop, bo bez nich zabezpieczenie nie wyłączy zwarcia. W kamperze i na jachcie pyta jeszcze o zasilanie z zewnątrz (słupek, keja); w namiocie wyjście pływające daje żółte ostrzeżenie z zasadami zamiast czerwonego stopu.",
      poCo:
        "Przy uszkodzeniu izolacji w falowniku obudowa albo metalowe elementy pojazdu mogą znaleźć się pod napięciem 230 V. Przewód ochronny odprowadza wtedy prąd zwarcia, zanim dotknie go człowiek. To uproszczona wersja Modułu 5 (ekrany 9 i 11) — dom z uziomem w ziemi liczy się tam.",
      fizyka:
        "Ochrona na falowniku nie potrzebuje ziemi, tylko zamkniętej pętli zwarcia do źródła: obudowa → przewód ochronny (PE) → punkt połączenia N z PE w falowniku → z powrotem do falownika. Wtedy przy zwarciu płynie duży prąd i bezpiecznik albo RCD wyłącza obwód. Warunki są trzy: (1) wszystkie obudowy, styki ochronne gniazd i podwozie połączone jednym przewodem PE (połączenie wyrównawcze); (2) falownik ma połączenie N–PE, ale tylko jeśli producent na to pozwala — wiele falowników z przełącznikiem sieci robi to automatycznie przekaźnikiem, gdy nie ma zasilania z zewnątrz; (3) RCD 30 mA za tym połączeniem. Pręt w ziemi ani przewód czy łańcuch wiszący spod pojazdu nie zastąpią tej pętli.",
    },
    pola: {
      rodzaj: {
        nazwa: "Rodzaj instalacji",
        cel: "Czy w instalacji jest tylko niskie napięcie stałe z akumulatora (12 V albo 24 V DC), czy także falownik (przetwornica), który robi z niego 230 V AC do zwykłych gniazdek. Od tego zależy, czy uziemienie ochronne jest wymagane: sama instalacja 12/24 V DC zwykle go nie wymaga, instalacja 230 V z falownika — tak.",
        gdzie: "Sprawdź, czy masz przetwornicę/falownik i gniazda 230 V. Jeśli masz choćby jedno gniazdko 230 V zasilane z falownika, wybierz „230 V z falownika”.",
        zakres: "Tylko 12/24 V DC albo 230 V z falownika.",
      },
      miejsce: {
        nazwa: "Miejsce instalacji",
        cel: "Gdzie pracuje zestaw. Ten ekran jest dla instalacji tymczasowych i mobilnych, w których pełne uziemienie budynkowe nie ma zastosowania. Na jachcie i na zewnątrz jest wilgotno — tam uziemienie jest zalecane także przy samym 12/24 V DC.",
        gdzie: "Wybierz miejsce, w którym instalacja pracuje najczęściej. Dla domu z uziomem w ziemi użyj pełnego projektu uziemienia w Module 5.",
        zakres: "Garaż, kamper/przyczepa, jacht/łódź, na zewnątrz albo namiot. W namiocie nie ma podwozia, więc strategia ochrony jest inna — aplikacja najpierw pyta, jakie wyjście ma stacja albo falownik.",
      },
      obudowa: {
        nazwa: "Uziemienie obudowy falownika",
        cel: "Przewód ochronny (zielono-żółty) z zacisku uziemienia falownika, oznaczonego PE albo symbolem uziemienia, do uziemienia pojazdu (masy) lub uziomu. Gdy dojdzie do zwarcia wewnątrz, ten przewód odprowadza prąd — bez niego obudowa jest pod napięciem.",
        gdzie: "Zacisk znajdziesz na obudowie albo w instrukcji falownika — sprawdź, czy dochodzi do niego przewód.",
        zakres: "Tak, nie albo nie wiem. „Nie wiem” aplikacja traktuje jak „nie” — to strona bezpieczna.",
      },
      gniazda: {
        nazwa: "Styk ochronny gniazd 230 V",
        cel: "Bolec albo boczne styki w gnieździe 230 V, do których dochodzi przewód ochronny (zielono-żółty) połączony z uziemieniem pojazdu lub uziomem. Bolec łączy metalową obudowę podłączonego urządzenia z tym przewodem: gdy w urządzeniu uszkodzi się izolacja, prąd zwarcia płynie przewodem ochronnym, a nie przez człowieka, który dotknie obudowy. Samo gniazdo z bolcem nie wystarczy — przewód musi być podłączony.",
        gdzie: "Sprawdź puszkę gniazda albo schemat instalacji.",
        zakres: "Tak, nie albo nie wiem. „Nie wiem” aplikacja traktuje jak „nie” — to strona bezpieczna.",
      },
      npe: {
        nazwa: "Połączenie N–PE w falowniku",
        cel: "Punkt, w którym przewód neutralny (N) jest połączony z przewodem ochronnym (PE). To do niego wraca prąd zwarcia z obudowy — bez niego pętla zwarcia jest otwarta, prąd jest mały i ani bezpiecznik, ani RCD nie wyłączą obwodu. Wiele falowników z przełącznikiem sieci robi to połączenie samo, przekaźnikiem, gdy nie ma zasilania z zewnątrz, i rozłącza je po podłączeniu do sieci.",
        gdzie: "W instrukcji falownika: szukaj „N–PE”, „neutral-ground bond”, „ground relay” albo „przekaźnik uziemienia”. Połączenie wykonuj sam tylko wtedy, gdy producent na to pozwala — nigdy wbrew instrukcji.",
        zakres: "Tak, nie albo nie wiem. „Nie wiem” aplikacja traktuje jak „nie” — to strona bezpieczna.",
      },
      rcd: {
        nazwa: "Wyłącznik różnicowoprądowy (RCD) 30 mA",
        cel: "Wyłącznik, który odłącza obwód, gdy część prądu ucieka poza przewody robocze — przez obudowę do PE albo przez człowieka. Do ochrony osób potrzebny jest próg 30 mA. Działa tylko za połączeniem N–PE, dlatego montuje się go między falownikiem a gniazdami.",
        gdzie: "W rozdzielnicy albo skrzynce za falownikiem: aparat z przyciskiem „T” (test) i oznaczeniem 30 mA (IΔn = 0,03 A).",
        zakres: "Tak, nie albo nie wiem. „Nie wiem” aplikacja traktuje jak „nie” — to strona bezpieczna.",
      },
      zasilanie: {
        nazwa: "Zasilanie z zewnątrz (słupek, keja)",
        cel: "Czy kamper albo jacht bywa podłączany do słupka na kempingu albo do kei. Wtedy przewód ochronny (PE) przychodzi z sieci, a połączenie N–PE jest już po stronie sieci — połączenie N–PE w falowniku musi być wtedy rozłączone.",
        gdzie: "Jeśli masz gniazdo wejściowe CEE (niebieskie, 230 V) albo przewód do słupka, odpowiedz „tak”.",
        zakres: "Tak albo nie.",
      },
      npeRozlaczane: {
        nazwa: "Rozłączanie N–PE przy zasilaniu z zewnątrz",
        cel: "Czy połączenie N–PE w falowniku jest rozłączane, gdy podłączysz zasilanie ze słupka albo z kei. Wiele falowników z przełącznikiem sieci robi to samo, przekaźnikiem. Jeśli nie — powstaje podwójne połączenie N–PE, które norma (PN-HD 60364-5-54, 543.4.3) nazywa niedopuszczalnym: prąd roboczy płynie też przewodem ochronnym. Typowy objaw: RCD na słupku wybija zaraz po podłączeniu.",
        gdzie: "W instrukcji falownika: szukaj „ground relay”, „przekaźnik uziemienia”, „N–PE switching”. Stały mostek N–PE przy zasilaniu ze słupka jest błędem.",
        zakres: "Tak, nie albo nie wiem. „Nie wiem” aplikacja traktuje jak „nie” — to strona bezpieczna.",
      },
    },
  },
  "wilgoc-male-instalacje": {
    migawka: {
      oCoChodzi: "Woda i prąd to nie jest dobra para. Trzeba je rozdzielić.",
      jakDziala:
        "Wybierasz miejsce, mówisz, czy jest tam wilgoć, i podajesz stopień ochrony IP najsłabszej obudowy. Przy wilgoci minimum to IP55 (ten sam próg co w Module 4), zalecane IP65. Namiot i jacht aplikacja zawsze traktuje jako wilgotne: poniżej IP65 czerwony stop, zalecane IP67–IP68. Na koniec podaje osłony: puszki z uszczelką, przewody w peszlu, pochłaniacz wilgoci.",
      poCo:
        "Wilgoć powoduje korozję styków, upływy prądu, zwarcia i uszkodzenia elektroniki — często po kilku tygodniach, nie od razu. Właściwa obudowa kosztuje mniej niż nowy regulator. To uproszczona wersja Modułu 4, Ekran 10.",
      fizyka:
        "Stopień IP (PN-EN 60529) ma dwie cyfry: pierwsza to ochrona przed ciałami stałymi i pyłem, druga przed wodą. Im wyższa cyfra, tym lepsza ochrona.",
    },
    pola: {
      miejsce: {
        nazwa: "Miejsce instalacji",
        cel: "Pomieszczenie albo miejsce, w którym stoją akumulator, regulator i przetwornica. Namiot i jacht to większe ryzyko (deszcz, rosa, bryzgi, słone powietrze) — zawsze traktowane jako wilgotne.",
        gdzie: "Wybierz miejsce, gdzie faktycznie stoją urządzenia.",
        zakres: "Opcje z listy. Namiot i jacht: minimum IP65, zalecane IP67–IP68.",
      },
      wilgoc: {
        nazwa: "Narażenie na wilgoć",
        cel: "Odpowiedz „tak”, jeśli bywa tam para wodna, skropliny na ścianach, zacieki, bryzgi albo woda z butów i samochodu. Przy „tak” obudowa musi mieć co najmniej IP55, zalecane IP65; przy „nie” próg nie dotyczy.",
        gdzie: "Oceń miejsce jesienią i zimą — wtedy wilgoci jest najwięcej.",
        zakres: "Tak albo nie. Nie wiesz? Wybierz „tak” — to strona bezpieczna.",
      },
      ip: {
        nazwa: "Stopień ochrony obudowy (IP)",
        cel: "Dwie cyfry: pierwsza mówi, jak obudowa chroni przed pyłem, druga — przed wodą (im wyższa, tym lepiej). Aplikacja porównuje go z progiem dla miejsca.",
        gdzie: "Na tabliczce znamionowej albo w karcie katalogowej urządzenia (np. „IP65”). Wybierz najniższy stopień spośród urządzeń stojących w tym miejscu — to ono pierwsze ulegnie wilgoci.",
        zakres: "Przy wilgoci minimum IP55, zalecane IP65; namiot i jacht minimum IP65, zalecane IP67–IP68.",
      },
    },
  },
  "zuzycie-per-urzadzenie": {
    migawka: {
      oCoChodzi:
        "Ile energii na dobę zużywa każde urządzenie i wszystkie razem. Dla lodówki czy klimatyzatora liczy się też to, że sprężarka nie pracuje bez przerwy.",
      jakDziala:
        "Dla każdego urządzenia: moc × godziny pracy na dobę. Przy urządzeniach ze sprężarką wynik jest dodatkowo mnożony przez współczynnik pracy sprężarki (jaką część czasu faktycznie pracuje). Aplikacja sumuje wszystkie pozycje w dobowe zużycie w Wh.",
      poCo:
        "Dobowe zużycie to podstawa doboru akumulatora i paneli. Bez współczynnika pracy lodówka wychodzi 2–3 razy „droższa”, niż jest naprawdę — i przewymiarujesz cały zestaw.",
      fizyka: "Energia = moc × czas (W × h = Wh). Urządzenia cykliczne: E = P × t × k_pracy.",
    },
    pola: {
      nazwa: {
        nazwa: "Nazwa urządzenia",
        cel: "Tylko do rozpoznania pozycji na liście — nie wpływa na obliczenia.",
        gdzie: "Wpisz dowolną nazwę, np. „lodówka turystyczna”.",
        zakres: "Dowolny tekst.",
      },
      moc: {
        nazwa: "Moc urządzenia [W]",
        cel: "Pobór mocy podczas pracy. Mnożony przez czas pracy daje energię.",
        gdzie: "Na tabliczce, zasilaczu albo w instrukcji (W). Gdy podany jest prąd — pomnóż A × V.",
        zakres: Z_KARTY,
      },
      godziny: {
        nazwa: "Czas włączenia [h/dobę]",
        cel: "Ile godzin na dobę urządzenie jest włączone.",
        gdzie: "Twoje zwyczaje — np. lampka 4 h wieczorem, lodówka 24 h.",
        zakres: "0–24 h.",
      },
      wspolczynnik: {
        nazwa: "Współczynnik pracy sprężarki [%]",
        cel: "Jaką część czasu włączenia sprężarka faktycznie pracuje. Zmniejsza energię urządzeń cyklicznych.",
        gdzie: "Z pomiaru (licznik energii) albo z karty urządzenia. W upale sprężarka pracuje dłużej.",
        zakres: "0–100%. Przykład ze źródła: lodówka turystyczna ok. 40% przy 25 °C otoczenia.",
      },
    },
  },
  "kable-bezpieczniki-male": {
    migawka: {
      oCoChodzi:
        "Nawet mały zestaw solarny rządzi się tą samą fizyką co duża instalacja — tylko liczby są mniejsze. Przewód musi wytrzymać prąd, a bezpiecznik musi chronić przewód.",
      jakDziala:
        "Z prądu, długości trasy, sposobu ułożenia i temperatury aplikacja dobiera przekrój — ten sam silnik co pełny Doradca doboru kabla (Moduł 5, Ekran 1, wg PN-HD 60364-5-52): sprawdza obciążalność prądową po współczynnikach poprawkowych i spadek napięcia na trasie tam i z powrotem. Potem dobiera bezpiecznik, który mieści się między prądem obciążenia a obciążalnością przewodu (koordynacja wg PN-HD 60364-4-43).",
      poCo:
        "Za cienki przewód grzeje się i może się zapalić, zanim cokolwiek się przepali. Za duży spadek napięcia sprawia, że urządzenia na końcu kabla dostają za mało napięcia, a LVD odcina je przedwcześnie.",
      fizyka:
        "Spadek napięcia ΔU = 2 × L × I × ρ / S (prąd płynie tam i z powrotem). Obciążalność przewodu maleje, gdy jest mu gorąco albo leży w wiązce z innymi — dlatego potrzebne są współczynniki poprawkowe.",
    },
    pola: {},
  },
  "kable-bezpieczniki-kamper": {
    migawka: {
      oCoChodzi:
        "W pojeździe prąd płynie krótkimi trasami, ale często duży — przewód musi go wytrzymać, a bezpiecznik musi go chronić. Dochodzą wibracje i wysoka temperatura w komorze silnika.",
      jakDziala:
        "Ten sam silnik co ekran „Kabel i bezpiecznik dla małej instalacji” (Moduł 5, Ekran 1 wg PN-HD 60364-5-52), z flagą pojazdu: przyjmuje najwyższą temperaturę otoczenia w pojeździe i dobiera przekrój oraz bezpiecznik. Sprawdza obciążalność i spadek napięcia na trasie tam i z powrotem.",
      poCo:
        "Przewód od akumulatora do przetwornicy w kamperze przenosi dziesiątki amperów. Przegrzany kabel w zabudowie meblowej to realne ryzyko pożaru.",
      fizyka:
        "Spadek napięcia ΔU = 2 × L × I × ρ / S. W wysokiej temperaturze przewód może stale przenosić mniejszy prąd.",
    },
    pola: {},
  },
  "kable-male-instalacje": {
    pola: {
      prad: {
        nazwa: "Prąd obciążenia [A]",
        cel: "Prąd, który stale płynie przewodem. Od niego zależy przekrój i bezpiecznik.",
        gdzie: "Moc odbiornika ÷ napięcie, np. przetwornica 600 W / 12 V = 50 A. Albo z karty urządzenia (prąd wejściowy).",
        zakres: Z_KARTY,
      },
      napiecie: {
        nazwa: "Napięcie instalacji [V]",
        cel: "Potrzebne do przeliczenia dopuszczalnego spadku napięcia z procentów na wolty.",
        gdzie: "Na naklejce akumulatora.",
        zakres: "12 V albo 24 V.",
      },
      dlugosc: {
        nazwa: "Długość trasy kabla w jedną stronę [m]",
        cel: "Im dłuższy kabel, tym większy spadek napięcia. Aplikacja sama liczy drogę tam i z powrotem (× 2).",
        gdzie: "Zmierz trasę od akumulatora do odbiornika — tak, jak faktycznie będzie prowadzony kabel, nie w linii prostej.",
        zakres: "Twoja instalacja — zmierz, nie szacuj.",
      },
      ulozenie: {
        nazwa: "Sposób ułożenia kabla",
        cel: "Kabel w peszlu, w ziemi albo w wiązce oddaje ciepło gorzej niż swobodny — może stale przenosić mniejszy prąd (współczynnik poprawkowy wg PN-HD 60364-5-52).",
        gdzie: "Wybierz, jak kabel będzie leżał na najgorszym odcinku trasy.",
        zakres: "Swobodnie, w peszlu/rurze, w ziemi albo w wiązce.",
      },
      wiazka: {
        nazwa: "Liczba kabli w wiązce [szt.]",
        cel: "Kable w wiązce grzeją się nawzajem — im więcej, tym mniejszy dopuszczalny prąd każdego z nich.",
        gdzie: "Policz przewody obciążone prądem, które biegną razem w jednej wiązce lub korycie.",
        zakres: "Twoja instalacja.",
      },
      temperatura: {
        nazwa: "Temperatura otoczenia kabla [°C]",
        cel: "W cieple kabel może stale przenosić mniejszy prąd (współczynnik temperaturowy wg PN-HD 60364-5-52).",
        gdzie: "Najwyższa spodziewana temperatura w miejscu prowadzenia kabla.",
        zakres: "Twoje warunki.",
      },
      temperaturaPojazd: {
        nazwa: "Temperatura otoczenia kabla w pojeździe [°C]",
        cel: "W cieple kabel może stale przenosić mniejszy prąd (współczynnik temperaturowy wg PN-HD 60364-5-52).",
        gdzie: "Najwyższa spodziewana — np. komora silnika albo nagrzany kamper latem.",
        zakres: "Twoje warunki — w komorze silnika znacznie wyżej niż w kabinie.",
      },
      spadek: {
        nazwa: "Dopuszczalny spadek napięcia [%]",
        cel: "Ile procent napięcia może „zgubić się” na kablu. Mniejszy spadek wymaga grubszego przewodu.",
        gdzie: "Przyjmij wartość domyślną albo wymaganie producenta odbiornika.",
        zakres: "Dla instalacji DC zwykle {spadek}%.",
      },
      przekroj: {
        nazwa: "Mój przekrój przewodu [mm²]",
        cel: "Zamiast doboru automatycznego aplikacja sprawdza przekrój, który już masz albo chcesz użyć.",
        gdzie: "Na izolacji przewodu (np. „6 mm²”) albo na fakturze.",
        zakres: "Przekroje handlowe, np. 1,5 / 2,5 / 4 / 6 / 10 / 16 / 25 / 35 mm².",
      },
    },
  },
}

const Z_KARTY_EN = "range from the device datasheet — the app does not assume a typical value for you."

export const en: Tlumaczenie<typeof pl> = {
  "bezpieczenstwo-kamper": {
    migawka: {
      oCoChodzi:
        "The battery in a camper travels with you: it weighs from a dozen to several dozen kilograms, flies forward under braking, and some types release hydrogen. This list shows what must be done to make it a safe passenger.",
      jakDziala:
        "You choose the battery type (AGM, flooded or LiFePO4). The app shows only the items that apply to that chemistry — e.g. ventilation is mandatory for a flooded battery, while for LiFePO4 protection against charging in the cold matters more. You tick the items you have done; an unticked critical item stays red.",
      poCo:
        "To check mounting, ventilation and protection before a trip. A badly fixed battery becomes a projectile under hard braking, and hydrogen from a flooded battery in a closed body can explode from a spark.",
    },
    pola: {},
  },
  "ladowanie-w-garazu": {
    migawka: {
      oCoChodzi:
        "Charging a battery in a closed garage is not the same as in the open: lead-acid batteries release hydrogen while charging, which is odourless and explosive.",
      jakDziala:
        "You choose the battery type. The app shows the checklist for that chemistry: ventilation, distance from spark sources, a charger with the right profile, the surface and supervision. For a flooded battery missing ventilation is a red stop, for AGM a warning.",
      poCo:
        "To charge safely without causing a fire or explosion. The most common mistake is charging with the door closed next to a grinder, a stove or another spark source.",
    },
    pola: {},
  },
  "checklista-chemii": {
    pola: {
      typ: {
        nazwa: "Battery type (chemistry)",
        cel: "The chemistry decides which checklist items apply: a flooded battery releases the most hydrogen, AGM less (it is sealed but also gasses when overcharged), LiFePO4 releases no hydrogen but must not be charged below freezing.",
        gdzie: "On the battery label or in its datasheet. Filler caps = flooded; AGM or VRLA marking = AGM; LiFePO4 / LFP / Li-ion with BMS = lithium.",
        zakres: "One of the three options on the list. Not sure? Choose flooded — the most demanding, safe side.",
      },
    },
  },
  "dni-bez-slonca": {
    migawka: {
      oCoChodzi:
        "How many cloudy days in a row the battery you already have will last before it needs recharging — without panels, a generator or the grid.",
      jakDziala:
        "The app calculates the energy you can really take out of the battery: capacity [Ah] × voltage [V] gives energy [Wh]; it takes only the allowed part (DoD) and subtracts inverter losses. The result is divided by your daily consumption — giving the number of days.",
      poCo:
        "To know whether the current battery will last a sunless weekend or whether it needs to be bigger or you need to bring a charger. Counting on the full label capacity gives an inflated, false result.",
      fizyka:
        "The energy stored in a battery is charge times voltage: 1 Ah at 12 V is 12 Wh. Part of the energy stays in the battery (DoD), part is lost in the inverter (efficiency η).",
    },
    pola: {
      pojemnosc: {
        nazwa: "Battery capacity [Ah]",
        cel: "How much charge the battery holds. Together with voltage it gives the energy from which the days are calculated.",
        gdzie: "On the battery label or datasheet (e.g. “100 Ah”). With several batteries in parallel, add up their capacities.",
        zakres: Z_KARTY_EN,
      },
      napiecie: {
        nazwa: "Nominal battery voltage [V]",
        cel: "Converts capacity in amp-hours into energy in watt-hours (Wh = Ah × V).",
        gdzie: "On the battery label: usually 12 V; with two in series — 24 V.",
        zakres: "In small installations 12 V or 24 V.",
      },
      dod: {
        nazwa: "Allowed depth of discharge (DoD) [%]",
        cel: "Which part of the capacity may be used without shortening battery life. The app counts only this part of the energy.",
        gdzie: "In the battery datasheet (number of cycles at a given DoD).",
        zakres:
          "LiFePO4 typically {dodMin}–{dodMax}%. AGM — the source gives 300–500 cycles at 50% DoD; deeper discharge shortens its life.",
      },
      sprawnosc: {
        nazwa: "Inverter efficiency [%]",
        cel: "A 12 V → 230 V inverter loses part of the energy as heat. The app reduces the energy available to loads by that amount.",
        gdzie: "In the inverter datasheet (“efficiency”). When 12 V loads are powered directly from the battery — enter 100%.",
        zakres: "100% without an inverter. With an inverter — the datasheet value (Module 4 suggests {sprawnosc}%).",
      },
      zuzycie: {
        nazwa: "Daily energy consumption [Wh]",
        cel: "How much energy the loads use per day. The divisor in the number-of-days calculation.",
        gdzie: "Add up: device power × hours of use per day, e.g. fridge 50 W × 6 h = 300 Wh. The “Energy use per device” screen helps.",
        zakres: "Depends on your loads — calculate them, don't guess.",
      },
    },
  },
  "dobor-regulatora-pwm-mppt": {
    migawka: {
      oCoChodzi:
        "The charge controller sits between the panel and the battery. PWM is a simple switch, MPPT is a converter that matches the panel voltage to the battery and gets more energy out of the panel.",
      jakDziala:
        "The app checks two rules from the source. First: if the panels' voltage class is higher than the battery voltage, PWM cannot cope — MPPT is needed (a requirement, not a recommendation). Second: with matching voltages MPPT starts to pay off above about {progMppt} W of panel power (the middle of the source's 200–300 W range).",
      poCo:
        "So you don't overpay for MPPT with a small panel, and don't buy PWM where it would waste a large part of the energy or not work at all.",
      fizyka:
        "PWM connects the panel directly to the battery, so the panel works at the battery voltage rather than at its maximum power point. MPPT converts the excess voltage into additional charging current.",
    },
    pola: {
      moc: {
        nazwa: "Total panel power [W]",
        cel: "The power decides whether a more expensive MPPT controller pays back through extra yield.",
        gdzie: "On the panel nameplate (Pmax, “W”). With several panels, add them up.",
        zakres: "MPPT break-even threshold in this app: {progMppt} W. Panel power — from the datasheet.",
      },
      napieciePanelu: {
        nazwa: "Panel voltage class [V]",
        cel: "Compared with the battery voltage: a panel with a higher class than the battery requires MPPT.",
        gdzie: "On the nameplate or in the panel description: a “12 V” or “24 V” panel. This is the nominal voltage, not Voc (open-circuit voltage, always higher).",
        zakres: "In small installations 12 V or 24 V.",
      },
      napiecieAkumulatora: {
        nazwa: "Battery system voltage [V]",
        cel: "The voltage the controller charges the battery to. Compared with the panel class.",
        gdzie: "On the battery label; with two in series — the sum.",
        zakres: "In small installations 12 V or 24 V.",
      },
    },
  },
  "gniazdo-zapalniczki": {
    migawka: {
      oCoChodzi:
        "The cigarette-lighter socket has its own small fuse. Everything you plug in at the same time — also through a splitter — must fit within it.",
      jakDziala:
        "The app adds up the power of devices switched on at the same time and divides it by the installation voltage — giving the current. It compares it with the socket fuse. It also shows the socket's maximum power: fuse × voltage (e.g. 15 A × 12 V = 180 W).",
      poCo:
        "To know what can be plugged in before the fuse blows or — worse — the thin wire behind the socket overheats. A travel fridge usually fits, a tyre compressor is borderline, equipment above about 180 W rather not.",
      fizyka: "Current I = P / U. The fuse protects the wire: a current above its rating makes it blow.",
    },
    pola: {
      napiecie: {
        nazwa: "Vehicle system voltage [V]",
        cel: "The divisor when converting device power into current. At the same power, 24 V carries half the current of 12 V.",
        gdzie: "Cars and campers have 12 V, trucks and buses usually 24 V (vehicle manual).",
        zakres: "12 V or 24 V.",
      },
      bezpiecznik: {
        nazwa: "Socket fuse rating [A]",
        cel: "The highest current the socket can deliver continuously. The app compares the current of connected devices with it.",
        gdzie: "In the vehicle manual or on the fuse box description (cover or diagram).",
        zakres: "Typically 10–15 A.",
      },
      nazwaUrzadzenia: {
        nazwa: "Device name",
        cel: "Just for you — to recognise the item on the list. It does not affect the calculation.",
        gdzie: "Enter any name, e.g. “fridge”.",
        zakres: "Any text.",
      },
      mocUrzadzenia: {
        nazwa: "Device power [W]",
        cel: "Added to the power of the other devices switched on at the same time and converted into current.",
        gdzie: "On the nameplate, power adapter or in the device manual (W). If only current is given — multiply A × V.",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "ochrona-przed-rozladowaniem": {
    migawka: {
      oCoChodzi:
        "A low voltage disconnect (LVD) cuts off the load before it discharges the battery too deeply. This screen tells you what voltage to set it to.",
      jakDziala:
        "The app takes the cut-off threshold for a 12 V battery from the source (AGM {progAgm} V, LiFePO4 {progLfp} V) and scales it to your installation voltage: threshold × (voltage / 12). For a flooded battery the source gives no threshold — the app does not guess it.",
      poCo:
        "Deep discharge destroys lead-acid batteries (sulphation) and can lock the BMS of a lithium battery. An LVD set to the right threshold is cheap protection for an expensive battery.",
      fizyka:
        "The battery's rest voltage falls as it discharges. A 12 V lead-acid battery has {ogniwaOlow} cells of 2 V, LiFePO4 — {ogniwaLfp} cells of 3.2 V, which is why the thresholds differ.",
    },
    pola: {
      typ: {
        nazwa: "Battery type (chemistry)",
        cel: "Each chemistry has a different safe cut-off threshold.",
        gdzie: "On the battery label or datasheet (AGM/VRLA, flooded with caps, LiFePO4/LFP).",
        zakres: "AGM, flooded or LiFePO4.",
      },
      napiecie: {
        nazwa: "Nominal installation voltage [V]",
        cel: "The app multiplies the 12 V threshold by (voltage / 12) to get the threshold for your installation.",
        gdzie: "On the battery label; with a series connection — the sum of voltages.",
        zakres: "12, 24 or 48 V.",
      },
    },
  },
  "panel-do-stacji-zasilania": {
    migawka: {
      oCoChodzi:
        "Power stations and power banks have lower solar input limits than professional MPPT controllers. A panel chosen “by eye” can easily damage them — especially in winter, because panel voltage rises in the cold.",
      jakDziala:
        "The app calculates the highest panel voltage on the coldest morning: Voc × (1 + β × (T_min − {tStc} °C)) × number of panels in series, and compares it with the station's voltage limit. Separately it calculates the current: Isc × number of parallel strings — and compares it with the station's current limit. Exceeding the voltage is a red stop.",
      poCo:
        "Too high a panel voltage damages the station input immediately and usually without warranty. Too much current is usually just limited, but it is worth knowing that part of the power will be wasted.",
      fizyka:
        "The voltage of a silicon cell rises as temperature falls (the coefficient β is negative). The panel datasheet gives Voc at {tStc} °C (STC), so on a frosty sunny morning the voltage is higher than on the nameplate.",
    },
    pola: {
      voc: {
        nazwa: "Panel open-circuit voltage Voc at STC [V]",
        cel: "The starting point for calculating the voltage in the cold. Voc is the no-load voltage — the highest the panel will deliver.",
        gdzie: "On the nameplate on the back of the panel or in the datasheet (“Voc”, “Open circuit voltage”).",
        zakres: Z_KARTY_EN,
      },
      beta: {
        nazwa: "Temperature coefficient of Voc (β) [%/°C]",
        cel: "By how many percent the voltage rises for every degree below 25 °C. The app uses it to calculate Voc in the cold.",
        gdzie: "In the panel datasheet (“Temperature coefficient of Voc”). The value is negative.",
        zakres: "Typically from {betaMin} to {betaMax} %/°C.",
      },
      tmin: {
        nazwa: "Lowest operating temperature [°C]",
        cel: "The colder it is, the higher the panel voltage. The app calculates the voltage for this temperature.",
        gdzie: "The coldest morning on which the panel will be connected to the station (e.g. winter trips).",
        zakres: "Your conditions — if used only in summer, enter the coldest summer morning.",
      },
      szeregowo: {
        nazwa: "Number of panels in series",
        cel: "In a series connection the panel voltages add up.",
        gdzie: "Count the panels connected “plus to minus” in one string.",
        zakres: "Usually 1–2 with power stations.",
      },
      limitNapiecia: {
        nazwa: "Maximum solar input voltage of the station [V]",
        cel: "The limit that the panels' voltage in the cold must not exceed.",
        gdzie: "In the station/power bank datasheet (e.g. “Solar input: 12–60 V” — take the upper value).",
        zakres: Z_KARTY_EN,
      },
      isc: {
        nazwa: "Panel short-circuit current Isc [A]",
        cel: "The highest current the panel can deliver. Compared with the station's current limit.",
        gdzie: "On the nameplate or in the panel datasheet (“Isc”, “Short circuit current”).",
        zakres: Z_KARTY_EN,
      },
      rownolegle: {
        nazwa: "Number of parallel strings",
        cel: "In a parallel connection the string currents add up.",
        gdzie: "Count the panel strings connected in parallel (plus to plus). Empty field = one string.",
        zakres: "Usually 1.",
      },
      limitPradu: {
        nazwa: "Maximum solar input current of the station [A]",
        cel: "The input current limit. The station usually limits a larger panel current — part of the power is wasted.",
        gdzie: "In the station/power bank datasheet (“Solar input … A”).",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "ratowanie-akumulatora-maly": {
    migawka: {
      oCoChodzi:
        "A discharged battery is not always for the bin. Whether and how to rescue it depends on the chemistry and on how deeply it was discharged.",
      jakDziala:
        "You choose the battery type and optionally enter the rest voltage. For a 12 V lead-acid battery (AGM, flooded) a voltage below {prog} V means critical discharge. The app sends you to the full rescue procedure in the Battery installation section.",
      poCo:
        "So as not to make things worse: charging a deeply discharged battery the wrong way can overheat it, and a LiFePO4 battery with a locked BMS needs a different procedure than a lead-acid one.",
    },
    pola: {
      typ: {
        nazwa: "Battery type (chemistry)",
        cel: "The chemistry determines the rescue procedure and the critical discharge threshold.",
        gdzie: "On the battery label or datasheet (AGM/VRLA, flooded with caps, LiFePO4/LFP).",
        zakres: "AGM, flooded or LiFePO4.",
      },
      napiecie: {
        nazwa: "Battery rest voltage [V] (optional)",
        cel: "Shows how deeply the battery was discharged. For 12 V lead-acid below {prog} V — critical.",
        gdzie: "Measure with a meter at the terminals of the 12 V battery after a few hours without charging and without load.",
        zakres: "Critical threshold for 12 V lead-acid: {prog} V.",
      },
    },
  },
  "tryb-uproszczony": {
    migawka: {
      oCoChodzi:
        "A quick answer to one question: how long will this battery power this device? Without a full installation design.",
      jakDziala:
        "The app multiplies the battery capacity [Ah] by the voltage [V] — that is the energy in Wh — and divides it by the load power [W]. The result is the run time in hours, assuming all the energy is available.",
      poCo:
        "To judge in seconds whether the kit makes sense. This is an upper limit — in practice subtract the battery reserve (DoD) and the inverter losses; the “Days without sun” screen calculates it more precisely.",
      fizyka: "Energy E = C × U (Ah × V = Wh). Time t = E / P.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Battery capacity [Ah]",
        cel: "Together with voltage gives the energy stored in the battery.",
        gdzie: "On the battery or power bank label (Ah).",
        zakres: Z_KARTY_EN,
      },
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "Converts amp-hours into watt-hours.",
        gdzie: "On the battery label (usually 12 V).",
        zakres: "In small kits usually 12 V or 24 V.",
      },
      moc: {
        nazwa: "Load power [W]",
        cel: "The divisor: the higher the power, the shorter the load runs.",
        gdzie: "On the device nameplate or power adapter (W). If current is given — multiply A × V.",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "urzadzenie-12v-bezposrednio": {
    migawka: {
      oCoChodzi:
        "“12 V” on a battery is a simplification. In reality the voltage ranges from about 11 V when discharged to the charging voltage — about 14.5 V and more. Not every “12 V” device can take it.",
      jakDziala:
        "From the device voltage and its tolerance the app calculates the range in which the device works safely. It compares it with the installation voltage range: from about 11 V (for 12 V) to the maximum charging voltage you enter. When the charging voltage exceeds the device's upper limit — a red stop.",
      poCo:
        "So you don't burn the device at sunny noon, when the controller charges the battery at its highest voltage. If the ranges don't fit, a DC/DC converter stabilising the voltage is needed.",
      fizyka:
        "The voltage at the battery terminals depends on the state of charge and on whether it is being charged. It is highest during absorption charging.",
    },
    pola: {
      napiecieInstalacji: {
        nazwa: "Nominal installation (battery) voltage [V]",
        cel: "Sets the lower limit of the installation voltage (about 11 V for 12 V) and the scale of comparison.",
        gdzie: "On the battery label.",
        zakres: "12 V or 24 V.",
      },
      napiecieUrzadzenia: {
        nazwa: "Nominal device voltage [V]",
        cel: "The centre of the range in which the device works correctly.",
        gdzie: "On the nameplate, power socket or in the device manual.",
        zakres: Z_KARTY_EN,
      },
      tolerancja: {
        nazwa: "Device voltage tolerance [± %]",
        cel: "How far the voltage may deviate from nominal. Together with the voltage it gives the device's operating range.",
        gdzie: "In the manual or on the nameplate. If a range is given (e.g. 10–16 V), convert it into ± % of the nominal voltage.",
        zakres: Z_KARTY_EN,
      },
      napiecieLadowania: {
        nazwa: "Maximum charging voltage of the installation [V]",
        cel: "The highest voltage the controller or charger brings the battery to (absorption; for lead-acid also equalisation, if enabled). The upper limit of the voltage the device will see.",
        gdzie: "In the controller settings or the charger manual. For a 24 V installation enter the value for the whole installation, not one battery.",
        zakres: "For 12 V the sources give {ladowanieMin}–{ladowanieMax} V.",
      },
    },
  },
  "uziemienie-male-instalacje": {
    migawka: {
      oCoChodzi: "Earthing is an escape route for current. Without it, the current escapes through you.",
      jakDziala:
        "You choose the installation type and location. A 12/24 V DC-only installation usually does not need protective earthing, but on a yacht and outdoors (moisture) it is recommended — a yellow warning. An installation with a 230 V inverter requires earthing — then the app asks whether the inverter housing and the protective contacts of the sockets are connected. An unearthed inverter housing (“no” or “don't know”) is a red stop; sockets without a connected protective contact give a yellow warning explaining the risk. Finally it asks about the N–PE bond in the inverter and about a 30 mA residual current device (RCD) — missing either is a red stop, because without them the protection will not clear a fault. In a camper and on a yacht it also asks about external supply (hook-up post, shore power); in a tent a floating output gives a yellow warning with the rules instead of a red stop.",
      poCo:
        "When insulation fails in the inverter, its housing or metal parts of the vehicle can become live at 230 V. The protective conductor then carries the fault current away before a person touches it. This is a simplified version of Module 5 (screens 9 and 11) — a house with an earth electrode is calculated there.",
      fizyka:
        "Protection on an inverter does not need earth, only a closed fault loop back to the source: enclosure → protective conductor (PE) → N–PE bond point in the inverter → back to the inverter. Then a fault drives a large current and the fuse or RCD disconnects the circuit. There are three conditions: (1) all enclosures, socket protective contacts and the chassis joined by one PE conductor (equipotential bonding); (2) the inverter has an N–PE bond, but only if the manufacturer allows it — many inverters with a transfer switch make it automatically with a relay when there is no external supply; (3) a 30 mA RCD after that bond. A rod in the ground or a wire or chain hanging under the vehicle does not replace this loop.",
    },
    pola: {
      rodzaj: {
        nazwa: "Installation type",
        cel: "Whether the installation has only low DC voltage from the battery (12 V or 24 V DC), or also an inverter that makes 230 V AC for ordinary sockets. This decides whether protective earthing is required: a 12/24 V DC installation alone usually does not need it, a 230 V inverter installation does.",
        gdzie: "Check whether you have an inverter and 230 V sockets. If you have even one 230 V socket fed from an inverter, choose “230 V from an inverter”.",
        zakres: "12/24 V DC only or 230 V from an inverter.",
      },
      miejsce: {
        nazwa: "Installation location",
        cel: "Where the kit works. This screen is for temporary and mobile installations where full building earthing does not apply. On a yacht and outdoors it is damp — earthing is recommended there even for 12/24 V DC alone.",
        gdzie: "Choose where the installation works most often. For a house with an earth electrode use the full earthing design in Module 5.",
        zakres: "Garage, camper/caravan, yacht/boat, outdoors or tent. A tent has no chassis, so the protection strategy is different — the app first asks what output the station or inverter has.",
      },
      obudowa: {
        nazwa: "Inverter housing earthing",
        cel: "A protective conductor (green-yellow) from the inverter's earth terminal, marked PE or with the earth symbol, to the vehicle earth (chassis) or an earth electrode. If a fault occurs inside, this conductor carries the current away — without it the housing is live.",
        gdzie: "You'll find the terminal on the housing or in the inverter manual — check that a conductor is connected to it.",
        zakres: "Yes, no or don't know. The app treats “don't know” as “no” — the safe side.",
      },
      gniazda: {
        nazwa: "Protective contact of 230 V sockets",
        cel: "The pin or side contacts in a 230 V socket, to which the protective conductor (green-yellow) connected to the vehicle earth or an earth electrode leads. The pin connects the metal casing of the plugged-in appliance to that conductor: when the appliance's insulation fails, the fault current flows through the protective conductor, not through the person who touches the casing. A socket with a pin alone is not enough — the conductor must be connected.",
        gdzie: "Check the socket box or the installation diagram.",
        zakres: "Yes, no or don't know. The app treats “don't know” as “no” — the safe side.",
      },
      npe: {
        nazwa: "N–PE bond in the inverter",
        cel: "The point where the neutral conductor (N) is joined to the protective conductor (PE). The fault current from the enclosure returns to it — without it the fault loop is open, the current is small and neither the fuse nor the RCD will disconnect the circuit. Many inverters with a transfer switch make this bond themselves, with a relay, when there is no external supply, and open it when connected to the grid.",
        gdzie: "In the inverter manual: look for “N–PE”, “neutral-ground bond” or “ground relay”. Make the bond yourself only if the manufacturer allows it — never against the manual.",
        zakres: "Yes, no or don't know. The app treats “don't know” as “no” — the safe side.",
      },
      rcd: {
        nazwa: "30 mA residual current device (RCD)",
        cel: "A switch that disconnects the circuit when part of the current escapes outside the live conductors — through the enclosure to PE or through a person. Protection of persons needs a 30 mA threshold. It works only after the N–PE bond, so it is installed between the inverter and the sockets.",
        gdzie: "In the distribution board or box after the inverter: a device with a “T” (test) button marked 30 mA (IΔn = 0.03 A).",
        zakres: "Yes, no or don't know. The app treats “don't know” as “no” — the safe side.",
      },
      zasilanie: {
        nazwa: "External supply (hook-up post, shore power)",
        cel: "Whether the camper or yacht is sometimes connected to a campsite hook-up post or to shore power. Then the protective conductor (PE) comes from the grid and the N–PE bond is already on the grid side — the inverter's N–PE bond must then be opened.",
        gdzie: "If you have a CEE inlet (blue, 230 V) or a hook-up cable, answer “yes”.",
        zakres: "Yes or no.",
      },
      npeRozlaczane: {
        nazwa: "N–PE bond opened on external supply",
        cel: "Whether the inverter's N–PE bond is opened when you connect hook-up or shore power. Many inverters with a transfer switch do this themselves, with a relay. If not, there is a double N–PE bond, which the standard (PN-HD 60364-5-54, 543.4.3) calls not permitted: working current also flows through the protective conductor. Typical symptom: the RCD on the hook-up post trips right after plugging in.",
        gdzie: "In the inverter manual: look for “ground relay” or “N–PE switching”. A fixed N–PE link while on hook-up power is a fault.",
        zakres: "Yes, no or don't know. The app treats “don't know” as “no” — the safe side.",
      },
    },
  },
  "wilgoc-male-instalacje": {
    migawka: {
      oCoChodzi: "Water and electricity are not a good pair. They must be kept apart.",
      jakDziala:
        "You choose the location, say whether it is damp, and enter the IP rating of the weakest enclosure. With moisture the minimum is IP55 (the same threshold as in Module 4), IP65 recommended. The app always treats a tent and a yacht as damp: below IP65 a red stop, IP67–IP68 recommended. Finally it lists protection measures: boxes with gaskets, cables in conduit, a moisture absorber.",
      poCo:
        "Moisture causes contact corrosion, leakage currents, short circuits and electronics damage — often after a few weeks, not immediately. The right enclosure costs less than a new controller. This is a simplified version of Module 4, Screen 10.",
      fizyka:
        "The IP rating (EN 60529) has two digits: the first is protection against solids and dust, the second against water. The higher the digit, the better the protection.",
    },
    pola: {
      miejsce: {
        nazwa: "Installation location",
        cel: "The room or place where the battery, controller and inverter stand. A tent and a yacht are a higher risk (rain, dew, spray, salty air) — always treated as damp.",
        gdzie: "Choose where the devices actually stand.",
        zakres: "Options on the list. Tent and yacht: minimum IP65, IP67–IP68 recommended.",
      },
      wilgoc: {
        nazwa: "Exposure to moisture",
        cel: "Answer “yes” if there is water vapour, condensation on walls, leaks, spray or water from boots and a car. With “yes” the enclosure must be at least IP55, IP65 recommended; with “no” the threshold does not apply.",
        gdzie: "Assess the place in autumn and winter — that is when moisture is highest.",
        zakres: "Yes or no. Not sure? Choose “yes” — the safe side.",
      },
      ip: {
        nazwa: "Enclosure protection rating (IP)",
        cel: "Two digits: the first says how the enclosure protects against dust, the second against water (the higher, the better). The app compares it with the threshold for the location.",
        gdzie: "On the rating plate or in the device datasheet (e.g. “IP65”). Choose the lowest rating among the devices in that place — it will be the first to suffer from moisture.",
        zakres: "With moisture minimum IP55, IP65 recommended; tent and yacht minimum IP65, IP67–IP68 recommended.",
      },
    },
  },
  "zuzycie-per-urzadzenie": {
    migawka: {
      oCoChodzi:
        "How much energy per day each device and all of them together use. For a fridge or an air conditioner it also counts that the compressor does not run non-stop.",
      jakDziala:
        "For each device: power × hours of use per day. For devices with a compressor the result is also multiplied by the compressor duty factor (what part of the time it actually runs). The app adds all items into daily consumption in Wh.",
      poCo:
        "Daily consumption is the basis for sizing the battery and panels. Without the duty factor a fridge comes out 2–3 times “more expensive” than it really is — and you oversize the whole kit.",
      fizyka: "Energy = power × time (W × h = Wh). Cyclic devices: E = P × t × k_duty.",
    },
    pola: {
      nazwa: {
        nazwa: "Device name",
        cel: "Only to recognise the item on the list — it does not affect the calculation.",
        gdzie: "Enter any name, e.g. “travel fridge”.",
        zakres: "Any text.",
      },
      moc: {
        nazwa: "Device power [W]",
        cel: "Power draw during operation. Multiplied by run time it gives energy.",
        gdzie: "On the nameplate, power adapter or in the manual (W). If current is given — multiply A × V.",
        zakres: Z_KARTY_EN,
      },
      godziny: {
        nazwa: "Switched-on time [h/day]",
        cel: "How many hours per day the device is switched on.",
        gdzie: "Your habits — e.g. a lamp 4 h in the evening, a fridge 24 h.",
        zakres: "0–24 h.",
      },
      wspolczynnik: {
        nazwa: "Compressor duty factor [%]",
        cel: "What part of the switched-on time the compressor actually runs. Reduces the energy of cyclic devices.",
        gdzie: "From a measurement (energy meter) or the device datasheet. In hot weather the compressor runs longer.",
        zakres: "0–100%. Example from the source: a travel fridge about 40% at 25 °C ambient.",
      },
    },
  },
  "kable-bezpieczniki-male": {
    migawka: {
      oCoChodzi:
        "Even a small solar kit follows the same physics as a large installation — only the numbers are smaller. The cable must withstand the current, and the fuse must protect the cable.",
      jakDziala:
        "From the current, route length, installation method and temperature the app selects the cross-section — the same engine as the full cable sizing Advisor (Module 5, Screen 1, per HD 60364-5-52): it checks current-carrying capacity after correction factors and the voltage drop over the route there and back. Then it selects a fuse that fits between the load current and the cable capacity (coordination per HD 60364-4-43).",
      poCo:
        "A cable that is too thin heats up and can catch fire before anything blows. Too large a voltage drop means devices at the end of the cable get too little voltage and the LVD cuts them off early.",
      fizyka:
        "Voltage drop ΔU = 2 × L × I × ρ / S (current flows there and back). A cable's capacity falls when it is hot or lies in a bundle with others — hence the correction factors.",
    },
    pola: {},
  },
  "kable-bezpieczniki-kamper": {
    migawka: {
      oCoChodzi:
        "In a vehicle current flows over short routes but is often large — the cable must withstand it and the fuse must protect it. Add vibration and high temperature in the engine bay.",
      jakDziala:
        "The same engine as the “Cable and fuse for a small installation” screen (Module 5, Screen 1 per HD 60364-5-52), with the vehicle flag: it takes the highest ambient temperature in the vehicle and selects the cross-section and fuse. It checks current-carrying capacity and the voltage drop over the route there and back.",
      poCo:
        "The cable from the battery to the inverter in a camper carries tens of amps. An overheated cable inside furniture is a real fire risk.",
      fizyka: "Voltage drop ΔU = 2 × L × I × ρ / S. At high temperature a cable can carry less current continuously.",
    },
    pola: {},
  },
  "kable-male-instalacje": {
    pola: {
      prad: {
        nazwa: "Load current [A]",
        cel: "The current that flows continuously through the cable. It determines the cross-section and the fuse.",
        gdzie: "Load power ÷ voltage, e.g. inverter 600 W / 12 V = 50 A. Or from the device datasheet (input current).",
        zakres: Z_KARTY_EN,
      },
      napiecie: {
        nazwa: "Installation voltage [V]",
        cel: "Needed to convert the allowed voltage drop from percent into volts.",
        gdzie: "On the battery label.",
        zakres: "12 V or 24 V.",
      },
      dlugosc: {
        nazwa: "One-way cable route length [m]",
        cel: "The longer the cable, the larger the voltage drop. The app counts the route there and back itself (× 2).",
        gdzie: "Measure the route from the battery to the load — the way the cable will actually run, not in a straight line.",
        zakres: "Your installation — measure, don't guess.",
      },
      ulozenie: {
        nazwa: "Cable installation method",
        cel: "A cable in conduit, in the ground or in a bundle dissipates heat worse than a free one — it can carry less current continuously (correction factor per HD 60364-5-52).",
        gdzie: "Choose how the cable will lie on the worst section of the route.",
        zakres: "Free air, in conduit/pipe, in the ground or in a bundle.",
      },
      wiazka: {
        nazwa: "Number of cables in the bundle [pcs]",
        cel: "Cables in a bundle heat each other — the more there are, the lower the allowed current of each.",
        gdzie: "Count the current-carrying conductors running together in one bundle or tray.",
        zakres: "Your installation.",
      },
      temperatura: {
        nazwa: "Cable ambient temperature [°C]",
        cel: "In heat a cable can carry less current continuously (temperature factor per HD 60364-5-52).",
        gdzie: "The highest expected temperature where the cable runs.",
        zakres: "Your conditions.",
      },
      temperaturaPojazd: {
        nazwa: "Cable ambient temperature in the vehicle [°C]",
        cel: "In heat a cable can carry less current continuously (temperature factor per HD 60364-5-52).",
        gdzie: "The highest expected — e.g. the engine bay or a camper heated up in summer.",
        zakres: "Your conditions — much higher in the engine bay than in the cabin.",
      },
      spadek: {
        nazwa: "Allowed voltage drop [%]",
        cel: "What percentage of the voltage may be “lost” in the cable. A smaller drop requires a thicker cable.",
        gdzie: "Accept the default value or the load manufacturer's requirement.",
        zakres: "For DC installations usually {spadek}%.",
      },
      przekroj: {
        nazwa: "My cable cross-section [mm²]",
        cel: "Instead of automatic sizing, the app checks the cross-section you already have or want to use.",
        gdzie: "On the cable insulation (e.g. “6 mm²”) or on the invoice.",
        zakres: "Standard sizes, e.g. 1.5 / 2.5 / 4 / 6 / 10 / 16 / 25 / 35 mm².",
      },
    },
  },
}

const Z_KARTY_RU = "диапазон из технической документации устройства — приложение не подставляет типовое значение за вас."

export const ru: Tlumaczenie<typeof pl> = {
  "bezpieczenstwo-kamper": {
    migawka: {
      oCoChodzi:
        "Аккумулятор в автодоме едет вместе с вами: он весит от десятка до нескольких десятков килограммов, при торможении летит вперёд, а некоторые типы выделяют водород. Этот список показывает, что нужно сделать, чтобы он был безопасным пассажиром.",
      jakDziala:
        "Вы выбираете тип аккумулятора (AGM, заливной или LiFePO4). Приложение показывает только пункты, относящиеся к этой химии — например, вентиляция обязательна для заливного аккумулятора, а для LiFePO4 важнее защита от зарядки на морозе. Вы отмечаете выполненные пункты; неотмеченный критический пункт остаётся красным.",
      poCo:
        "Чтобы перед поездкой проверить крепление, вентиляцию и защиту. Плохо закреплённый аккумулятор при резком торможении становится снарядом, а водород из заливного аккумулятора в закрытом кузове может взорваться от искры.",
    },
    pola: {},
  },
  "ladowanie-w-garazu": {
    migawka: {
      oCoChodzi:
        "Зарядка аккумулятора в закрытом гараже — не то же самое, что на открытом воздухе: свинцовые аккумуляторы при зарядке выделяют водород, который не имеет запаха и взрывоопасен.",
      jakDziala:
        "Вы выбираете тип аккумулятора. Приложение показывает контрольный список для этой химии: вентиляция, расстояние от источников искр, зарядное устройство с правильным профилем, основание и надзор. Для заливного аккумулятора отсутствие вентиляции — красный стоп, для AGM — предупреждение.",
      poCo:
        "Чтобы заряжать безопасно и не вызвать пожар или взрыв. Самая частая ошибка — зарядка при закрытых воротах рядом с болгаркой, печью или другим источником искр.",
    },
    pola: {},
  },
  "checklista-chemii": {
    pola: {
      typ: {
        nazwa: "Тип (химия) аккумулятора",
        cel: "От химии зависит, какие пункты списка действуют: заливной аккумулятор выделяет больше всего водорода, AGM меньше (он герметичен, но при перезаряде тоже газит), LiFePO4 не выделяет водород, но его нельзя заряжать на морозе.",
        gdzie: "На наклейке аккумулятора или в его технической документации. Пробки для доливки воды = заливной; надпись AGM или VRLA = AGM; LiFePO4 / LFP / Li-ion с BMS = литиевый.",
        zakres: "Один из трёх вариантов списка. Не знаете? Выберите заливной — самый требовательный, безопасный вариант.",
      },
    },
  },
  "dni-bez-slonca": {
    migawka: {
      oCoChodzi:
        "Сколько пасмурных дней подряд продержится уже имеющийся аккумулятор, прежде чем его нужно будет подзарядить — без панелей, генератора и сети.",
      jakDziala:
        "Приложение считает энергию, которую реально можно взять из аккумулятора: ёмкость [А·ч] × напряжение [В] даёт энергию [Вт·ч], из неё берётся только допустимая часть (DoD) и вычитаются потери инвертора. Результат делится на ваше суточное потребление — получается число дней.",
      poCo:
        "Чтобы знать, хватит ли нынешнего аккумулятора на выходные без солнца или его нужно увеличить либо взять зарядное устройство. Расчёт по полной ёмкости с наклейки даёт завышенный, ложный результат.",
      fizyka:
        "Энергия, запасённая в аккумуляторе, — это произведение заряда на напряжение: 1 А·ч при 12 В — это 12 Вт·ч. Часть энергии остаётся в аккумуляторе (DoD), часть теряет инвертор (КПД η).",
    },
    pola: {
      pojemnosc: {
        nazwa: "Ёмкость аккумулятора [А·ч]",
        cel: "Сколько заряда вмещает аккумулятор. Вместе с напряжением даёт энергию, по которой считаются дни работы.",
        gdzie: "На наклейке или в документации аккумулятора (например, «100 Ah»). При нескольких аккумуляторах, соединённых параллельно, сложите их ёмкости.",
        zakres: Z_KARTY_RU,
      },
      napiecie: {
        nazwa: "Номинальное напряжение аккумулятора [В]",
        cel: "Переводит ёмкость в ампер-часах в энергию в ватт-часах (Вт·ч = А·ч × В).",
        gdzie: "На наклейке аккумулятора: обычно 12 В; при двух, соединённых последовательно, — 24 В.",
        zakres: "В малых установках 12 В или 24 В.",
      },
      dod: {
        nazwa: "Допустимая глубина разряда (DoD) [%]",
        cel: "Какую часть ёмкости можно использовать без сокращения срока службы аккумулятора. Приложение учитывает только эту часть энергии.",
        gdzie: "В технической документации аккумулятора (число циклов при данном DoD).",
        zakres:
          "LiFePO4 обычно {dodMin}–{dodMax}%. AGM — источник указывает 300–500 циклов при 50% DoD; более глубокий разряд сокращает срок службы.",
      },
      sprawnosc: {
        nazwa: "КПД инвертора [%]",
        cel: "Инвертор 12 В → 230 В теряет часть энергии в виде тепла. Приложение уменьшает на эту величину энергию, доступную потребителям.",
        gdzie: "В документации инвертора («efficiency»). Если потребители 12 В питаются прямо от аккумулятора — введите 100%.",
        zakres: "100% без инвертора. С инвертором — значение из документации (Модуль 4 предлагает {sprawnosc}%).",
      },
      zuzycie: {
        nazwa: "Суточное потребление энергии [Вт·ч]",
        cel: "Сколько энергии потребители расходуют за сутки. Делитель при расчёте числа дней.",
        gdzie: "Сложите: мощность устройства × часы работы в сутки, например холодильник 50 Вт × 6 ч = 300 Вт·ч. Поможет экран «Потребление энергии по устройствам».",
        zakres: "Зависит от ваших потребителей — посчитайте их, не угадывайте.",
      },
    },
  },
  "dobor-regulatora-pwm-mppt": {
    migawka: {
      oCoChodzi:
        "Контроллер заряда стоит между панелью и аккумулятором. PWM — простой ключ, MPPT — преобразователь, который согласует напряжение панели с аккумулятором и выжимает из панели больше энергии.",
      jakDziala:
        "Приложение проверяет два правила из источника. Первое: если класс напряжения панелей выше напряжения аккумулятора, PWM не справится — нужен MPPT (это требование, а не рекомендация). Второе: при совпадающих напряжениях MPPT начинает окупаться при мощности панелей выше примерно {progMppt} Вт (середина диапазона 200–300 Вт из источника).",
      poCo:
        "Чтобы не переплатить за MPPT при маленькой панели и не купить PWM там, где он потеряет значительную часть энергии или вообще не будет работать.",
      fizyka:
        "PWM подключает панель прямо к аккумулятору, поэтому панель работает на напряжении аккумулятора, а не в точке максимальной мощности. MPPT превращает избыток напряжения в дополнительный ток заряда.",
    },
    pola: {
      moc: {
        nazwa: "Суммарная мощность панелей [Вт]",
        cel: "От мощности зависит, окупится ли более дорогой контроллер MPPT дополнительной выработкой.",
        gdzie: "На табличке панели (Pmax, «W»). При нескольких панелях сложите.",
        zakres: "Порог окупаемости MPPT в этом приложении: {progMppt} Вт. Мощность панели — из документации.",
      },
      napieciePanelu: {
        nazwa: "Класс напряжения панелей [В]",
        cel: "Сравнивается с напряжением аккумулятора: панель с классом выше аккумулятора требует MPPT.",
        gdzie: "На табличке или в описании панели: панель «12 V» или «24 V». Это номинальное напряжение, а не Voc (напряжение холостого хода, всегда выше).",
        zakres: "В малых установках 12 В или 24 В.",
      },
      napiecieAkumulatora: {
        nazwa: "Системное напряжение аккумулятора [В]",
        cel: "Напряжение, до которого контроллер заряжает аккумулятор. Сравнивается с классом панелей.",
        gdzie: "На наклейке аккумулятора; при двух, соединённых последовательно, — сумма.",
        zakres: "В малых установках 12 В или 24 В.",
      },
    },
  },
  "gniazdo-zapalniczki": {
    migawka: {
      oCoChodzi:
        "Гнездо прикуривателя имеет свой небольшой предохранитель. Всё, что вы подключаете одновременно — в том числе через разветвитель, — должно в него уложиться.",
      jakDziala:
        "Приложение суммирует мощность одновременно включённых устройств и делит на напряжение сети — получается ток. Сравнивает его с предохранителем гнезда. Показывает также максимальную мощность гнезда: предохранитель × напряжение (например, 15 А × 12 В = 180 Вт).",
      poCo:
        "Чтобы знать, что можно подключить, прежде чем сгорит предохранитель или — хуже — перегреется тонкий провод за гнездом. Туристический холодильник обычно укладывается, компрессор для шин на границе, оборудование свыше примерно 180 Вт — скорее нет.",
      fizyka: "Ток I = P / U. Предохранитель защищает провод: ток больше его номинала приводит к перегоранию.",
    },
    pola: {
      napiecie: {
        nazwa: "Напряжение бортовой сети [В]",
        cel: "Делитель при пересчёте мощности устройств в ток. При той же мощности в 24 В течёт вдвое меньший ток, чем в 12 В.",
        gdzie: "Легковые автомобили и автодома — 12 В, грузовики и автобусы обычно 24 В (руководство по эксплуатации).",
        zakres: "12 В или 24 В.",
      },
      bezpiecznik: {
        nazwa: "Номинал предохранителя гнезда [А]",
        cel: "Наибольший ток, который гнездо может отдавать длительно. Приложение сравнивает с ним ток подключённых устройств.",
        gdzie: "В руководстве по эксплуатации автомобиля или на описании блока предохранителей (крышка или схема).",
        zakres: "Обычно 10–15 А.",
      },
      nazwaUrzadzenia: {
        nazwa: "Название устройства",
        cel: "Только для вас — чтобы узнать позицию в списке. На расчёт не влияет.",
        gdzie: "Введите любое название, например «холодильник».",
        zakres: "Любой текст.",
      },
      mocUrzadzenia: {
        nazwa: "Мощность устройства [Вт]",
        cel: "Суммируется с мощностью остальных одновременно включённых устройств и пересчитывается в ток.",
        gdzie: "На табличке, блоке питания или в инструкции устройства (Вт). Если указан только ток — умножьте А × В.",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "ochrona-przed-rozladowaniem": {
    migawka: {
      oCoChodzi:
        "Реле отключения по низкому напряжению (LVD, Low Voltage Disconnect) отключает потребителя, прежде чем он разрядит аккумулятор слишком глубоко. Этот экран подсказывает, на какое напряжение его настроить.",
      jakDziala:
        "Приложение берёт порог отключения для аккумулятора 12 В из источника (AGM {progAgm} В, LiFePO4 {progLfp} В) и пересчитывает его на напряжение вашей установки: порог × (напряжение / 12). Для заливного аккумулятора источник порог не указывает — приложение его не угадывает.",
      poCo:
        "Глубокий разряд разрушает свинцовые аккумуляторы (сульфатация) и может заблокировать BMS литиевого аккумулятора. Правильно настроенный LVD — дешёвая защита дорогого аккумулятора.",
      fizyka:
        "Напряжение покоя аккумулятора падает по мере разряда. Свинцовый аккумулятор 12 В имеет {ogniwaOlow} элементов по 2 В, LiFePO4 — {ogniwaLfp} элемента по 3,2 В, поэтому пороги различаются.",
    },
    pola: {
      typ: {
        nazwa: "Тип (химия) аккумулятора",
        cel: "У каждой химии свой безопасный порог отключения.",
        gdzie: "На наклейке аккумулятора или в документации (AGM/VRLA, заливной с пробками, LiFePO4/LFP).",
        zakres: "AGM, заливной или LiFePO4.",
      },
      napiecie: {
        nazwa: "Номинальное напряжение установки [В]",
        cel: "Порог для аккумулятора 12 В приложение умножает на (напряжение / 12), чтобы получить порог для вашей установки.",
        gdzie: "На наклейке аккумулятора; при последовательном соединении — сумма напряжений.",
        zakres: "12, 24 или 48 В.",
      },
    },
  },
  "panel-do-stacji-zasilania": {
    migawka: {
      oCoChodzi:
        "Портативные электростанции и пауэрбанки имеют более низкие пределы солнечного входа, чем профессиональные контроллеры MPPT. Панель, подобранная «на глаз», легко их повредит — особенно зимой, потому что на морозе напряжение панели растёт.",
      jakDziala:
        "Приложение считает наибольшее напряжение панелей в самое холодное утро: Voc × (1 + β × (T_min − {tStc} °C)) × число панелей последовательно, и сравнивает с пределом напряжения станции. Отдельно считает ток: Isc × число параллельных веток — и сравнивает с пределом тока станции. Превышение напряжения — красный стоп.",
      poCo:
        "Слишком высокое напряжение панели повреждает вход станции сразу и обычно без гарантии. Слишком большой ток обычно просто ограничивается, но стоит знать, что часть мощности пропадёт.",
      fizyka:
        "Напряжение кремниевого элемента растёт при понижении температуры (коэффициент β отрицательный). Документация панели даёт Voc при {tStc} °C (STC), поэтому морозным солнечным утром напряжение выше, чем на табличке.",
    },
    pola: {
      voc: {
        nazwa: "Напряжение холостого хода панели Voc при STC [В]",
        cel: "Отправная точка для расчёта напряжения на морозе. Voc — напряжение без нагрузки, самое высокое, которое даёт панель.",
        gdzie: "На табличке на обороте панели или в документации («Voc», «Open circuit voltage»).",
        zakres: Z_KARTY_RU,
      },
      beta: {
        nazwa: "Температурный коэффициент напряжения Voc (β) [%/°C]",
        cel: "На сколько процентов растёт напряжение на каждый градус ниже 25 °C. Приложение использует его для расчёта Voc на морозе.",
        gdzie: "В документации панели («Temperature coefficient of Voc»). Значение отрицательное.",
        zakres: "Обычно от {betaMin} до {betaMax} %/°C.",
      },
      tmin: {
        nazwa: "Самая низкая рабочая температура [°C]",
        cel: "Чем холоднее, тем выше напряжение панели. Приложение считает напряжение для этой температуры.",
        gdzie: "Самое холодное утро, когда панель будет подключена к станции (например, зимние поездки).",
        zakres: "Ваши условия — при использовании только летом введите самое холодное летнее утро.",
      },
      szeregowo: {
        nazwa: "Число панелей, соединённых последовательно",
        cel: "При последовательном соединении напряжения панелей складываются.",
        gdzie: "Посчитайте панели, соединённые «плюс к минусу» в одной цепочке.",
        zakres: "Чаще всего 1–2 при портативных станциях.",
      },
      limitNapiecia: {
        nazwa: "Максимальное напряжение солнечного входа станции [В]",
        cel: "Граница, которую напряжение панелей на морозе не должно превысить.",
        gdzie: "В документации станции/пауэрбанка (например, «Solar input: 12–60 V» — берите верхнее значение).",
        zakres: Z_KARTY_RU,
      },
      isc: {
        nazwa: "Ток короткого замыкания панели Isc [А]",
        cel: "Наибольший ток, который может дать панель. Сравнивается с пределом тока станции.",
        gdzie: "На табличке или в документации панели («Isc», «Short circuit current»).",
        zakres: Z_KARTY_RU,
      },
      rownolegle: {
        nazwa: "Число параллельных веток",
        cel: "При параллельном соединении токи веток складываются.",
        gdzie: "Посчитайте цепочки панелей, соединённые параллельно (плюс с плюсом). Пустое поле = одна ветка.",
        zakres: "Чаще всего 1.",
      },
      limitPradu: {
        nazwa: "Максимальный ток солнечного входа станции [А]",
        cel: "Предел входного тока. Больший ток панелей станция обычно ограничивает — часть мощности пропадает.",
        gdzie: "В документации станции/пауэрбанка («Solar input … A»).",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "ratowanie-akumulatora-maly": {
    migawka: {
      oCoChodzi:
        "Разряженный аккумулятор не всегда нужно выбрасывать. Можно ли и как его спасти, зависит от химии и от того, насколько глубоко он разрядился.",
      jakDziala:
        "Вы выбираете тип аккумулятора и при желании вводите напряжение покоя. Для свинцового аккумулятора 12 В (AGM, заливной) напряжение ниже {prog} В означает критический разряд. Приложение направляет вас к полной процедуре восстановления в разделе «Монтаж батарей».",
      poCo:
        "Чтобы не усугубить ситуацию: неправильная зарядка глубоко разряженного аккумулятора может его перегреть, а аккумулятор LiFePO4 с заблокированной BMS требует иных действий, чем свинцовый.",
    },
    pola: {
      typ: {
        nazwa: "Тип (химия) аккумулятора",
        cel: "От химии зависит процедура восстановления и порог критического разряда.",
        gdzie: "На наклейке аккумулятора или в документации (AGM/VRLA, заливной с пробками, LiFePO4/LFP).",
        zakres: "AGM, заливной или LiFePO4.",
      },
      napiecie: {
        nazwa: "Напряжение покоя аккумулятора [В] (необязательно)",
        cel: "Показывает, насколько глубоко разрядился аккумулятор. Для свинцового 12 В ниже {prog} В — критично.",
        gdzie: "Измерьте мультиметром на клеммах аккумулятора 12 В через несколько часов без зарядки и без нагрузки.",
        zakres: "Критический порог для свинцового 12 В: {prog} В.",
      },
    },
  },
  "tryb-uproszczony": {
    migawka: {
      oCoChodzi:
        "Быстрый ответ на один вопрос: как долго этот аккумулятор будет питать это устройство? Без полного проекта установки.",
      jakDziala:
        "Приложение умножает ёмкость аккумулятора [А·ч] на напряжение [В] — это энергия в Вт·ч — и делит на мощность потребителя [Вт]. Результат — время работы в часах при условии, что доступна вся энергия.",
      poCo:
        "Чтобы за несколько секунд оценить, имеет ли комплект смысл. Это верхняя граница — на практике вычтите резерв аккумулятора (DoD) и потери инвертора; точнее посчитает экран «Сколько дней без солнца».",
      fizyka: "Энергия E = C × U (А·ч × В = Вт·ч). Время t = E / P.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Ёмкость аккумулятора [А·ч]",
        cel: "Вместе с напряжением даёт энергию, запасённую в аккумуляторе.",
        gdzie: "На наклейке аккумулятора или пауэрбанка (А·ч).",
        zakres: Z_KARTY_RU,
      },
      napiecie: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Переводит ампер-часы в ватт-часы.",
        gdzie: "На наклейке аккумулятора (обычно 12 В).",
        zakres: "В малых комплектах обычно 12 В или 24 В.",
      },
      moc: {
        nazwa: "Мощность потребителя [Вт]",
        cel: "Делитель: чем больше мощность, тем меньше работает потребитель.",
        gdzie: "На табличке или блоке питания устройства (Вт). Если указан ток — умножьте А × В.",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "urzadzenie-12v-bezposrednio": {
    migawka: {
      oCoChodzi:
        "«12 В» на аккумуляторе — упрощение. Реально напряжение колеблется от примерно 11 В при разряде до напряжения зарядки — около 14,5 В и выше. Не каждое устройство «12 В» это выдержит.",
      jakDziala:
        "По напряжению устройства и его допуску приложение считает диапазон, в котором устройство работает безопасно. Сравнивает его с диапазоном напряжений установки: от примерно 11 В (для 12 В) до максимального напряжения зарядки, которое вы вводите. Если напряжение зарядки превышает верхнюю границу устройства — красный стоп.",
      poCo:
        "Чтобы не сжечь устройство солнечным полднем, когда контроллер заряжает аккумулятор самым высоким напряжением. Если диапазоны не совпадают, нужен DC/DC-преобразователь, стабилизирующий напряжение.",
      fizyka:
        "Напряжение на клеммах аккумулятора зависит от степени заряда и от того, идёт ли зарядка. При абсорбционной зарядке оно самое высокое.",
    },
    pola: {
      napiecieInstalacji: {
        nazwa: "Номинальное напряжение установки (аккумулятора) [В]",
        cel: "Определяет нижнюю границу напряжения установки (для 12 В около 11 В) и масштаб сравнения.",
        gdzie: "На наклейке аккумулятора.",
        zakres: "12 В или 24 В.",
      },
      napiecieUrzadzenia: {
        nazwa: "Номинальное напряжение устройства [В]",
        cel: "Центр диапазона, в котором устройство работает правильно.",
        gdzie: "На табличке, разъёме питания или в инструкции устройства.",
        zakres: Z_KARTY_RU,
      },
      tolerancja: {
        nazwa: "Допуск напряжения устройства [± %]",
        cel: "Насколько напряжение может отличаться от номинального. Вместе с напряжением даёт рабочий диапазон устройства.",
        gdzie: "В инструкции или на табличке. Если указан диапазон (например, 10–16 В), пересчитайте его в ± % от номинального напряжения.",
        zakres: Z_KARTY_RU,
      },
      napiecieLadowania: {
        nazwa: "Максимальное напряжение зарядки установки [В]",
        cel: "Наибольшее напряжение, до которого контроллер или зарядное устройство доводит аккумулятор (абсорбция; у свинцового также выравнивающий заряд, если он включён). Верхняя граница напряжения, которое увидит устройство.",
        gdzie: "В настройках контроллера или в инструкции зарядного устройства. Для установки 24 В введите значение для всей установки, а не одного аккумулятора.",
        zakres: "Для 12 В источники указывают {ladowanieMin}–{ladowanieMax} В.",
      },
    },
  },
  "uziemienie-male-instalacje": {
    migawka: {
      oCoChodzi: "Заземление — это путь отхода для тока. Если его нет, ток уходит через вас.",
      jakDziala:
        "Вы выбираете тип установки и место. Установка только на 12/24 В постоянного тока обычно не требует защитного заземления, но на яхте и на улице (влажность) оно рекомендуется — жёлтое предупреждение. Установка с инвертором 230 В требует заземления — тогда приложение спрашивает, подключены ли корпус инвертора и защитные контакты розеток. Незаземлённый корпус инвертора («нет» или «не знаю») — красный стоп; розетки без подключённого защитного контакта — жёлтое предупреждение с объяснением, чем это грозит. В конце спрашивает о соединении N–PE в инверторе и об устройстве защитного отключения (УЗО) 30 мА — отсутствие любого из них — красный стоп, потому что без них защита не отключит замыкание. В автодоме и на яхте спрашивает ещё о внешнем питании (колонка, причал); в палатке плавающий выход даёт жёлтое предупреждение с правилами вместо красного стопа.",
      poCo:
        "При повреждении изоляции в инверторе корпус или металлические части автомобиля могут оказаться под напряжением 230 В. Защитный проводник отводит ток замыкания, прежде чем его коснётся человек. Это упрощённая версия Модуля 5 (экраны 9 и 11) — дом с заземлителем в грунте считается там.",
      fizyka:
        "Защите на инверторе не нужна земля, нужна только замкнутая петля замыкания до источника: корпус → защитный проводник (PE) → точка соединения N с PE в инверторе → обратно в инвертор. Тогда при замыкании течёт большой ток, и предохранитель или УЗО отключает цепь. Условий три: (1) все корпуса, защитные контакты розеток и шасси соединены одним проводником PE (уравнивание потенциалов); (2) в инверторе есть соединение N–PE, но только если производитель это разрешает — многие инверторы с переключателем сети делают его автоматически реле, когда нет внешнего питания; (3) УЗО 30 мА после этого соединения. Штырь в земле или провод либо цепь, свисающие под автомобилем, не заменяют эту петлю.",
    },
    pola: {
      rodzaj: {
        nazwa: "Тип установки",
        cel: "Есть ли в установке только низкое постоянное напряжение от аккумулятора (12 В или 24 В DC) или также инвертор, который делает из него 230 В AC для обычных розеток. От этого зависит, требуется ли защитное заземление: установка только на 12/24 В DC обычно его не требует, установка 230 В от инвертора — требует.",
        gdzie: "Проверьте, есть ли у вас инвертор и розетки 230 В. Если есть хотя бы одна розетка 230 В от инвертора, выберите «230 В от инвертора».",
        zakres: "Только 12/24 В DC или 230 В от инвертора.",
      },
      miejsce: {
        nazwa: "Место установки",
        cel: "Где работает комплект. Этот экран — для временных и мобильных установок, где полное заземление здания неприменимо. На яхте и на улице влажно — там заземление рекомендуется даже только при 12/24 В DC.",
        gdzie: "Выберите место, где установка работает чаще всего. Для дома с заземлителем в грунте используйте полный проект заземления в Модуле 5.",
        zakres: "Гараж, автодом/прицеп, яхта/лодка, на улице или палатка. В палатке нет шасси, поэтому стратегия защиты другая — приложение сначала спрашивает, какой выход у станции или инвертора.",
      },
      obudowa: {
        nazwa: "Заземление корпуса инвертора",
        cel: "Защитный проводник (жёлто-зелёный) от клеммы заземления инвертора, обозначенной PE или символом заземления, к массе автомобиля или заземлителю. При замыкании внутри этот проводник отводит ток — без него корпус находится под напряжением.",
        gdzie: "Клемму вы найдёте на корпусе или в инструкции инвертора — проверьте, подключён ли к ней проводник.",
        zakres: "Да, нет или не знаю. «Не знаю» приложение считает как «нет» — это безопасная сторона.",
      },
      gniazda: {
        nazwa: "Защитный контакт розеток 230 В",
        cel: "Штырь или боковые контакты в розетке 230 В, к которым подходит защитный проводник (жёлто-зелёный), соединённый с массой автомобиля или заземлителем. Штырь соединяет металлический корпус подключённого прибора с этим проводником: при повреждении изоляции прибора ток замыкания идёт по защитному проводнику, а не через человека, коснувшегося корпуса. Одной розетки со штырём недостаточно — проводник должен быть подключён.",
        gdzie: "Проверьте коробку розетки или схему установки.",
        zakres: "Да, нет или не знаю. «Не знаю» приложение считает как «нет» — это безопасная сторона.",
      },
      npe: {
        nazwa: "Соединение N–PE в инверторе",
        cel: "Точка, в которой нейтральный проводник (N) соединён с защитным (PE). К ней возвращается ток замыкания с корпуса — без неё петля замыкания разомкнута, ток мал, и ни предохранитель, ни УЗО не отключат цепь. Многие инверторы с переключателем сети делают это соединение сами, реле, когда нет внешнего питания, и размыкают его при подключении к сети.",
        gdzie: "В инструкции инвертора: ищите «N–PE», «neutral-ground bond», «ground relay» или «реле заземления». Выполняйте соединение сами только если производитель это разрешает — никогда вопреки инструкции.",
        zakres: "Да, нет или не знаю. «Не знаю» приложение считает как «нет» — это безопасная сторона.",
      },
      rcd: {
        nazwa: "Устройство защитного отключения (УЗО) 30 мА",
        cel: "Выключатель, который отключает цепь, когда часть тока уходит мимо рабочих проводников — через корпус в PE или через человека. Для защиты людей нужен порог 30 мА. Работает только после соединения N–PE, поэтому его ставят между инвертором и розетками.",
        gdzie: "В щитке или коробке после инвертора: аппарат с кнопкой «T» (тест) и обозначением 30 мА (IΔn = 0,03 А).",
        zakres: "Да, нет или не знаю. «Не знаю» приложение считает как «нет» — это безопасная сторона.",
      },
      zasilanie: {
        nazwa: "Внешнее питание (колонка, причал)",
        cel: "Подключается ли автодом или яхта к колонке на кемпинге или к причалу. Тогда защитный проводник (PE) приходит из сети, а соединение N–PE уже есть на стороне сети — соединение N–PE в инверторе тогда должно быть разомкнуто.",
        gdzie: "Если у вас есть входная розетка CEE (синяя, 230 В) или кабель к колонке, ответьте «да».",
        zakres: "Да или нет.",
      },
      npeRozlaczane: {
        nazwa: "Размыкание N–PE при внешнем питании",
        cel: "Размыкается ли соединение N–PE в инверторе, когда вы подключаете питание от колонки или причала. Многие инверторы с переключателем сети делают это сами, реле. Если нет — возникает двойное соединение N–PE, которое норма (PN-HD 60364-5-54, 543.4.3) называет недопустимым: рабочий ток идёт и по защитному проводнику. Типичный признак: УЗО на колонке срабатывает сразу после подключения.",
        gdzie: "В инструкции инвертора: ищите «ground relay», «реле заземления», «N–PE switching». Постоянная перемычка N–PE при питании от колонки — ошибка.",
        zakres: "Да, нет или не знаю. «Не знаю» приложение считает как «нет» — это безопасная сторона.",
      },
    },
  },
  "wilgoc-male-instalacje": {
    migawka: {
      oCoChodzi: "Вода и электричество — плохая пара. Их нужно разделить.",
      jakDziala:
        "Вы выбираете место, указываете, есть ли там влага, и вводите степень защиты IP самого слабого корпуса. При влажности минимум — IP55 (тот же порог, что в Модуле 4), рекомендуется IP65. Палатку и яхту приложение всегда считает влажными: ниже IP65 — красный стоп, рекомендуется IP67–IP68. В конце перечисляет средства защиты: коробки с уплотнением, провода в гофре, поглотитель влаги.",
      poCo:
        "Влага вызывает коррозию контактов, токи утечки, короткие замыкания и повреждение электроники — часто через несколько недель, а не сразу. Подходящий корпус стоит меньше нового контроллера. Это упрощённая версия Модуля 4, Экран 10.",
      fizyka:
        "Степень IP (EN 60529) состоит из двух цифр: первая — защита от твёрдых тел и пыли, вторая — от воды. Чем выше цифра, тем лучше защита.",
    },
    pola: {
      miejsce: {
        nazwa: "Место установки",
        cel: "Помещение или место, где стоят аккумулятор, контроллер и инвертор. Палатка и яхта — повышенный риск (дождь, роса, брызги, солёный воздух) — всегда считаются влажными.",
        gdzie: "Выберите место, где фактически стоят устройства.",
        zakres: "Варианты из списка. Палатка и яхта: минимум IP65, рекомендуется IP67–IP68.",
      },
      wilgoc: {
        nazwa: "Воздействие влаги",
        cel: "Ответьте «да», если там бывает пар, конденсат на стенах, подтёки, брызги или вода с обуви и автомобиля. При «да» корпус должен иметь не ниже IP55, рекомендуется IP65; при «нет» порог не применяется.",
        gdzie: "Оцените место осенью и зимой — тогда влаги больше всего.",
        zakres: "Да или нет. Не знаете? Выберите «да» — это безопасная сторона.",
      },
      ip: {
        nazwa: "Степень защиты корпуса (IP)",
        cel: "Две цифры: первая говорит, как корпус защищает от пыли, вторая — от воды (чем выше, тем лучше). Приложение сравнивает её с порогом для места.",
        gdzie: "На заводской табличке или в документации устройства (например, «IP65»). Выберите самую низкую степень среди устройств в этом месте — оно первым пострадает от влаги.",
        zakres: "При влажности минимум IP55, рекомендуется IP65; палатка и яхта минимум IP65, рекомендуется IP67–IP68.",
      },
    },
  },
  "zuzycie-per-urzadzenie": {
    migawka: {
      oCoChodzi:
        "Сколько энергии в сутки потребляет каждое устройство и все вместе. Для холодильника или кондиционера учитывается также то, что компрессор работает не постоянно.",
      jakDziala:
        "Для каждого устройства: мощность × часы работы в сутки. Для устройств с компрессором результат дополнительно умножается на коэффициент работы компрессора (какую часть времени он действительно работает). Приложение суммирует все позиции в суточное потребление в Вт·ч.",
      poCo:
        "Суточное потребление — основа подбора аккумулятора и панелей. Без коэффициента работы холодильник выходит в 2–3 раза «дороже», чем на самом деле, — и вы завысите весь комплект.",
      fizyka: "Энергия = мощность × время (Вт × ч = Вт·ч). Циклические устройства: E = P × t × k_работы.",
    },
    pola: {
      nazwa: {
        nazwa: "Название устройства",
        cel: "Только чтобы узнать позицию в списке — на расчёт не влияет.",
        gdzie: "Введите любое название, например «туристический холодильник».",
        zakres: "Любой текст.",
      },
      moc: {
        nazwa: "Мощность устройства [Вт]",
        cel: "Потребляемая мощность во время работы. Умноженная на время работы, даёт энергию.",
        gdzie: "На табличке, блоке питания или в инструкции (Вт). Если указан ток — умножьте А × В.",
        zakres: Z_KARTY_RU,
      },
      godziny: {
        nazwa: "Время включения [ч/сутки]",
        cel: "Сколько часов в сутки устройство включено.",
        gdzie: "Ваши привычки — например, лампа 4 ч вечером, холодильник 24 ч.",
        zakres: "0–24 ч.",
      },
      wspolczynnik: {
        nazwa: "Коэффициент работы компрессора [%]",
        cel: "Какую часть времени включения компрессор действительно работает. Уменьшает энергию циклических устройств.",
        gdzie: "Из измерения (счётчик энергии) или из документации устройства. В жару компрессор работает дольше.",
        zakres: "0–100%. Пример из источника: туристический холодильник около 40% при 25 °C окружающей среды.",
      },
    },
  },
  "kable-bezpieczniki-male": {
    migawka: {
      oCoChodzi:
        "Даже маленький солнечный комплект подчиняется той же физике, что и большая установка, — только числа меньше. Провод должен выдерживать ток, а предохранитель — защищать провод.",
      jakDziala:
        "По току, длине трассы, способу прокладки и температуре приложение подбирает сечение — тем же движком, что и полный Советник подбора кабеля (Модуль 5, Экран 1, по HD 60364-5-52): проверяет допустимый ток с поправочными коэффициентами и падение напряжения на трассе туда и обратно. Затем подбирает предохранитель, который укладывается между током нагрузки и допустимым током провода (координация по HD 60364-4-43).",
      poCo:
        "Слишком тонкий провод греется и может загореться раньше, чем что-то сгорит. Слишком большое падение напряжения приводит к тому, что устройства в конце кабеля получают слишком мало напряжения, и LVD отключает их преждевременно.",
      fizyka:
        "Падение напряжения ΔU = 2 × L × I × ρ / S (ток течёт туда и обратно). Допустимый ток провода снижается, когда ему жарко или он лежит в пучке с другими, — поэтому нужны поправочные коэффициенты.",
    },
    pola: {},
  },
  "kable-bezpieczniki-kamper": {
    migawka: {
      oCoChodzi:
        "В автомобиле ток течёт по коротким трассам, но часто большой — провод должен его выдерживать, а предохранитель — защищать. Добавляются вибрации и высокая температура в моторном отсеке.",
      jakDziala:
        "Тот же движок, что и на экране «Кабель и предохранитель для малой установки» (Модуль 5, Экран 1 по HD 60364-5-52), с флагом транспортного средства: принимает наибольшую температуру окружающей среды в автомобиле и подбирает сечение и предохранитель. Проверяет допустимый ток и падение напряжения на трассе туда и обратно.",
      poCo:
        "Провод от аккумулятора к инвертору в автодоме несёт десятки ампер. Перегретый кабель внутри мебели — реальный риск пожара.",
      fizyka: "Падение напряжения ΔU = 2 × L × I × ρ / S. При высокой температуре провод может длительно нести меньший ток.",
    },
    pola: {},
  },
  "kable-male-instalacje": {
    pola: {
      prad: {
        nazwa: "Ток нагрузки [А]",
        cel: "Ток, который длительно течёт по проводу. От него зависят сечение и предохранитель.",
        gdzie: "Мощность потребителя ÷ напряжение, например инвертор 600 Вт / 12 В = 50 А. Или из документации устройства (входной ток).",
        zakres: Z_KARTY_RU,
      },
      napiecie: {
        nazwa: "Напряжение установки [В]",
        cel: "Нужно для пересчёта допустимого падения напряжения из процентов в вольты.",
        gdzie: "На наклейке аккумулятора.",
        zakres: "12 В или 24 В.",
      },
      dlugosc: {
        nazwa: "Длина трассы кабеля в одну сторону [м]",
        cel: "Чем длиннее кабель, тем больше падение напряжения. Приложение само считает путь туда и обратно (× 2).",
        gdzie: "Измерьте трассу от аккумулятора до потребителя — так, как фактически будет проложен кабель, а не по прямой.",
        zakres: "Ваша установка — измерьте, не угадывайте.",
      },
      ulozenie: {
        nazwa: "Способ прокладки кабеля",
        cel: "Кабель в гофре, в земле или в пучке отводит тепло хуже, чем свободный, — может длительно нести меньший ток (поправочный коэффициент по HD 60364-5-52).",
        gdzie: "Выберите, как будет лежать кабель на самом неблагоприятном участке трассы.",
        zakres: "Свободно, в гофре/трубе, в земле или в пучке.",
      },
      wiazka: {
        nazwa: "Число кабелей в пучке [шт.]",
        cel: "Кабели в пучке нагревают друг друга — чем их больше, тем меньше допустимый ток каждого.",
        gdzie: "Посчитайте проводники под нагрузкой, идущие вместе в одном пучке или лотке.",
        zakres: "Ваша установка.",
      },
      temperatura: {
        nazwa: "Температура окружающей среды кабеля [°C]",
        cel: "В тепле кабель может длительно нести меньший ток (температурный коэффициент по HD 60364-5-52).",
        gdzie: "Наибольшая ожидаемая температура в месте прокладки кабеля.",
        zakres: "Ваши условия.",
      },
      temperaturaPojazd: {
        nazwa: "Температура окружающей среды кабеля в автомобиле [°C]",
        cel: "В тепле кабель может длительно нести меньший ток (температурный коэффициент по HD 60364-5-52).",
        gdzie: "Наибольшая ожидаемая — например, моторный отсек или нагретый летом автодом.",
        zakres: "Ваши условия — в моторном отсеке значительно выше, чем в салоне.",
      },
      spadek: {
        nazwa: "Допустимое падение напряжения [%]",
        cel: "Сколько процентов напряжения может «потеряться» в кабеле. Меньшее падение требует более толстого провода.",
        gdzie: "Примите значение по умолчанию или требование производителя потребителя.",
        zakres: "Для установок постоянного тока обычно {spadek}%.",
      },
      przekroj: {
        nazwa: "Моё сечение провода [мм²]",
        cel: "Вместо автоматического подбора приложение проверяет сечение, которое у вас уже есть или которое вы хотите использовать.",
        gdzie: "На изоляции провода (например, «6 mm²») или в счёте.",
        zakres: "Стандартные сечения, например 1,5 / 2,5 / 4 / 6 / 10 / 16 / 25 / 35 мм².",
      },
    },
  },
}
