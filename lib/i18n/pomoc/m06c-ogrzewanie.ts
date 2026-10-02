/**
 * Help content — Module 6 (heating), screens built on 01.10.2026 (branch `work/screens`). Numbers kept by the
 * engines as constants enter through `{params}`; the app never assumes a user value (Directive #1).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "cykle-odszraniania": {
    migawka: {
      oCoChodzi: "To jak rozmrażanie zamrażarki — pompa ciepła od czasu do czasu musi „oczyścić się” ze szronu, żeby dalej efektywnie pracować, i to też kosztuje energię.",
      jakDziala: "Wpisz cykl defrostu: co ile minut, jak długo i z jaką mocą, oraz pobór przy normalnym grzaniu. Aplikacja policzy, jaką część czasu zajmuje defrost, ile energii dokłada na godzinę i na dobę oraz o ile procent rośnie zużycie — a z COP z katalogu realny COP z defrostem.",
      poCo: "Zimą w wilgotny mróz pompa zużywa więcej prądu, niż wynika z katalogowego COP — bez tego bilans baterii jest zbyt optymistyczny.",
      fizyka: "Szron osadza się na parowniku typowo poniżej 5–{prog} °C przy wysokiej wilgotności (źródło). E_h = P_def · t_def / T; narzut = P_def·t_def / (P_baz·T); COP_ef = COP_kat / (1 + narzut). Przykład źródła „co 45 min, 5 min → +8%” wymaga mocy defrostu 0,72 × mocy pracy (przy równej mocy wychodzi 11%).",
    },
    pola: {
      tZewn: {
        nazwa: "Temperatura zewnętrzna [°C]",
        cel: "Porównywana z zakresem szronienia ze źródła i z minimalną temperaturą pracy pompy.",
        gdzie: "Termometr zewnętrzny albo dane klimatyczne (Moduł 1).",
        zakres: "Twoja lokalizacja.",
      },
      wilgotnosc: {
        nazwa: "Wilgotność względna powietrza [%]",
        cel: "Tylko informacja przy wyniku — przy wysokiej wilgotności szronienie jest częstsze, ale źródło nie podaje progu.",
        gdzie: "Higrometr albo prognoza pogody.",
        zakres: "0–100%. Puste = nie wpisano.",
      },
      odstep: {
        nazwa: "Odstęp między defrostami [min]",
        cel: "Czas od początku jednego defrostu do początku następnego.",
        gdzie: "Instrukcja/karta pompy (sterowanie defrostem) albo obserwacja — licznik pracy, aplikacja producenta.",
        zakres: "Karta katalogowa urządzenia albo Twój pomiar.",
      },
      czas: {
        nazwa: "Czas jednego defrostu [min]",
        cel: "Jak długo pompa pracuje „na chłodzenie”, topiąc szron.",
        gdzie: "Instrukcja albo obserwacja (wentylator jednostki zewnętrznej staje, z parownika paruje).",
        zakres: "Krótszy niż odstęp.",
      },
      mocDefrostu: {
        nazwa: "Pobór prądu w czasie defrostu [kW]",
        cel: "Z nim liczona jest energia jednego defrostu.",
        gdzie: "Pomiar licznikiem/watomierzem w czasie defrostu albo dane producenta.",
        zakres: "Karta katalogowa urządzenia albo Twój pomiar.",
      },
      mocBazowa: {
        nazwa: "Pobór prądu przy normalnym grzaniu [kW]",
        cel: "Odniesienie dla narzutu procentowego.",
        gdzie: "Karta pompy przy tej temperaturze albo pomiar.",
        zakres: "Karta katalogowa urządzenia albo Twój pomiar.",
      },
      godziny: {
        nazwa: "Godziny szronienia na dobę [h]",
        cel: "Ile godzin w dobie panują warunki szronienia — mnoży energię na godzinę do energii na dobę.",
        gdzie: "Prognoza: godziny z temperaturą w zakresie szronienia i wysoką wilgotnością.",
        zakres: "0–24. Puste = bez wyniku dobowego.",
      },
      cop: {
        nazwa: "COP katalogowy w tej temperaturze",
        cel: "Z niego liczony jest realny COP z defrostem.",
        gdzie: "Karta pompy (COP przy tej temperaturze zewnętrznej) albo Ekran 5.",
        zakres: "≥ 1. Puste = bez realnego COP.",
      },
      tMin: {
        nazwa: "Minimalna temperatura pracy pompy [°C]",
        cel: "Poniżej niej pompa się wyłącza — dom muszą grzać grzałki awaryjne.",
        gdzie: "Karta pompy — zakres temperatur pracy w trybie grzania.",
        zakres: "Puste = nie sprawdzam.",
      },
    },
  },
  "wentylacja-grawitacyjna": {
    "migawka": {
      "oCoChodzi": "Ciepłe powietrze ucieka kominem samo z siebie — trzeba je powstrzymać, ale nie kosztem świeżego powietrza w domu.",
      "jakDziala": "Wpisz kubaturę, liczbę wymian powietrza na dobę i temperatury. Aplikacja zamieni wymiany na strumień powietrza i policzy straty ciepła na dobę (i w okresie). Z pozostałymi stratami budynku — udział wentylacji; ze sprawnością rekuperatora — ile zostałoby przy tym samym strumieniu z odzyskiem ciepła.",
      "poCo": "Wentylacja grawitacyjna to często największa pojedyncza strata starego domu — wiesz, czy rekuperacja ma sens, zanim wydasz pieniądze.",
      "fizyka": "V̇ = n·V / 24 h; Φ = V̇·ρ·cp·ΔT (ρ = 1,2 kg/m³, cp = 1005 J/(kg·K) — jak Ekrany 3 i 12); z odzyskiem Φ·(1 − η). Przykład źródła „15% strat → 5% z rekuperacją” odpowiada sprawności ok. 70%."
    },
    "pola": {
      "kubatura": {
        "nazwa": "Kubatura ogrzewana [m³]",
        "cel": "Objętość powietrza, które wentylacja wymienia.",
        "gdzie": "Powierzchnia ogrzewana × wysokość pomieszczeń (Ekran 1/12).",
        "zakres": "Twój budynek."
      },
      "wymiany": {
        "nazwa": "Liczba wymian powietrza na dobę [1/doba]",
        "cel": "Ile razy na dobę wymienia się całe powietrze domu.",
        "gdzie": "Test szczelności (Ekran 12, wymiany na godzinę × 24) albo pomiar anemometrem na kratkach. Przy silnym wietrze i dużym mrozie wymian jest więcej.",
        "zakres": "Twój budynek — wzoru na ciąg kominowy aplikacja nie ma."
      },
      "tWew": {
        "nazwa": "Temperatura wewnątrz [°C]",
        "cel": "Różnica temperatur napędza straty.",
        "gdzie": "Temperatura, którą utrzymujesz zimą.",
        "zakres": "Twoje ustawienie."
      },
      "tZewn": {
        "nazwa": "Średnia temperatura zewnętrzna [°C]",
        "cel": "Doba, dla której liczysz.",
        "gdzie": "Dane klimatyczne (Moduł 1) albo średnie miesięczne z Ekranu 1.",
        "zakres": "Twoja lokalizacja."
      },
      "szczelny": {
        "nazwa": "Dom nowy, szczelny, bez wentylacji mechanicznej",
        "cel": "Ostrzeżenie źródła: w szczelnym domu wentylacja grawitacyjna nie wymieni powietrza — ryzyko pleśni.",
        "gdzie": "Nowe okna, membrany, dobry wynik testu szczelności.",
        "zakres": "Tak / nie."
      },
      "pozostale": {
        "nazwa": "Pozostałe straty ciepła budynku [W]",
        "cel": "Z nimi liczony jest udział wentylacji w całkowitych stratach.",
        "gdzie": "Strata przez przenikanie z Ekranu 1 przy tych samych temperaturach (bez wentylacji).",
        "zakres": "Puste = bez udziału procentowego."
      },
      "sprawnosc": {
        "nazwa": "Sprawność rekuperatora do porównania [%]",
        "cel": "Ile strat zostałoby przy tym samym strumieniu z odzyskiem ciepła.",
        "gdzie": "Karta rekuperatora (Ekran 3).",
        "zakres": "0–100%. Puste = bez porównania."
      },
      "dni": {
        "nazwa": "Liczba dni",
        "cel": "Mnoży stratę doby na okres (np. miesiąc).",
        "gdzie": "Liczba dni okresu o podobnej średniej temperaturze.",
        "zakres": "Puste = tylko na dobę."
      }
    }
  },
  "gwc": {
    "migawka": {
      "oCoChodzi": "Grunt na głębokości kilku metrów ma stałą temperaturę przez cały rok — GWC to sposób, żeby to „pożyczyć” na wstępne podgrzanie lub schłodzenie powietrza.",
      "jakDziala": "Wpisz strumień powietrza, o ile stopni GWC podgrzewa powietrze zimą i ile godzin na dobę pracuje. Aplikacja policzy moc i ciepło na dobę; za rekuperatorem tylko część zysku zostaje w domu. Z zapotrzebowaniem — udział, z COP — mniej prądu.",
      "poCo": "Wiesz, ile realnie daje GWC w Twoim systemie — szczególnie za rekuperatorem, gdzie zysk jest dużo mniejszy, niż sugeruje sam przyrost temperatury.",
      "fizyka": "Φ = V̇·ρ·cp·ΔT (ρ = 1,2 kg/m³, cp = 1005 J/(kg·K) — jak Ekrany 3 i 12); Q = Φ·(1 − η)·h. Przykład źródła „+4 °C → −5%” nie podaje strumienia ani zapotrzebowania — sam z siebie nie jest odtwarzalny."
    },
    "pola": {
      "strumien": {
        "nazwa": "Strumień powietrza przez GWC [m³/h]",
        "cel": "Ile powietrza podgrzewa grunt.",
        "gdzie": "Nastawa centrali wentylacyjnej (Ekran 3).",
        "zakres": "Twoja instalacja."
      },
      "przyrost": {
        "nazwa": "Przyrost temperatury powietrza zimą [K]",
        "cel": "O ile stopni powietrze za GWC jest cieplejsze niż na zewnątrz.",
        "gdzie": "Dane producenta GWC dla Twojej długości i głębokości albo pomiar termometrem przed i za wymiennikiem w mroźny dzień.",
        "zakres": "Karta katalogowa albo Twój pomiar — aplikacja nie ma modelu gruntu."
      },
      "godziny": {
        "nazwa": "Godziny pracy GWC na dobę [h]",
        "cel": "Mnoży moc na ciepło doby.",
        "gdzie": "Sterowanie przepustnicą GWC (np. tylko poniżej określonej temperatury).",
        "zakres": "0–24."
      },
      "rekuperator": {
        "nazwa": "Sprawność rekuperatora za GWC [%]",
        "cel": "Za rekuperatorem zostaje w domu tylko (1 − sprawność) zysku z GWC.",
        "gdzie": "Karta rekuperatora.",
        "zakres": "0–100%. Puste = brak rekuperatora."
      },
      "zapotrzebowanie": {
        "nazwa": "Zapotrzebowanie na ciepło na dobę [kWh]",
        "cel": "Z nim liczony jest udział GWC.",
        "gdzie": "Ekran 1 albo 2 dla tej samej temperatury zewnętrznej.",
        "zakres": "Puste = bez udziału."
      },
      "cop": {
        "nazwa": "COP ogrzewania",
        "cel": "Zamienia zaoszczędzone ciepło na zaoszczędzony prąd.",
        "gdzie": "1 = grzałka; pompa ciepła — karta (Ekran 5).",
        "zakres": "≥ 1. Puste = bez prądu."
      }
    }
  },
  "wplyw-czynnika": {
    "migawka": {
      "oCoChodzi": "Jeden ekran na wiele pytań „a co, jeśli…”: wymienię okna, ocieplę dach, obniżę temperaturę zasilania, dołożę bufor. Każdy czynnik pokazuje jedną konkretną liczbę — ile kW, kWh albo startów sprężarki zmienia.",
      "jakDziala": "Wybierz czynnik, wpisz stan obecny i porównywany. Aplikacja liczy wzorem właściwym dla tego czynnika — tymi samymi co na ekranach Części 1 (straty przegrody, infiltracja, wentylacja, izolacja) — i, jeśli podasz zapotrzebowanie domu i moc pompy, sprawdza, czy pompa dalej wystarcza.",
      "poCo": "Pompę dobiera się do budynku z jego wadami — ale najpierw warto wiedzieć, które wady naprawić, bo to tańsze niż większa pompa i większy falownik w off-gridzie.",
      "fizyka": "Moc strat: Φ = U·A·ΔT, Φ = n·V·ρ·cp·ΔT/3600, U' = 1/(1/U + d/λ). Prąd: E = Q/COP. Przepływ: V̇ = P/(cw·ΔT). Bufor: cykl = C·ΔT_h/(P − L) + C·ΔT_h/L, C = V·cw. Zyski słoneczne zmniejszają zużycie w sezonie, nie moc obliczeniową."
    },
    "pola": {
      "czynnik": {
        "nazwa": "Czynnik wpływający na pompę ciepła",
        "cel": "Każdy czynnik ma własne pola i własny wzór; wpisane wartości zostają przy zmianie czynnika (to samo pole znaczy to samo).",
        "gdzie": "Wybierz to, co chcesz zmienić albo sprawdzić w swoim domu.",
        "zakres": "18 czynników z Części 2D źródła; 7 pozycji bez wzoru w źródle nie jest liczonych (lista pod wynikiem)."
      },
      "dTK": {
        "nazwa": "Różnica temperatur wewnątrz i na zewnątrz w dniu obliczeniowym [K]",
        "cel": "Mnoży współczynnik strat — z niej wychodzi moc w kW, jak na Ekranie 1.",
        "gdzie": "Ekran 1 (temperatura wewnętrzna minus obliczeniowa zewnętrzna dla Twojej strefy klimatycznej).",
        "zakres": "Twoja strefa klimatyczna i temperatura w domu."
      },
      "zapotrzebowanieKw": {
        "nazwa": "Zapotrzebowanie domu na moc grzewczą [kW]",
        "cel": "Opcjonalne: pokazuje, jak zmienia się całe zapotrzebowanie i o ile procent. Wpisz stan obecny („przed”).",
        "gdzie": "Ekran 1 (straty ciepła) albo Ekran 2.",
        "zakres": "Wynik Twojego Ekranu 1."
      },
      "mocPompyKw": {
        "nazwa": "Moc grzewcza pompy ciepła [kW]",
        "cel": "Do sprawdzenia, czy pompa pokryje zapotrzebowanie; przy przepływie, buforze i ograniczeniu — moc, którą pompa oddaje.",
        "gdzie": "Karta katalogowa pompy (moc w punkcie pracy, np. A-7/W35).",
        "zakres": "Z karty katalogowej albo Twojego pomiaru — aplikacja nie zakłada wartości."
      },
      "powierzchniaM2": {
        "nazwa": "Powierzchnia przegrody [m²]",
        "cel": "Mnoży U — więcej powierzchni to więcej strat.",
        "gdzie": "Projekt budynku albo pomiar (okna: sama powierzchnia okien; dach/podłoga: powierzchnia ocieplana).",
        "zakres": "Twój budynek."
      },
      "uPrzed": {
        "nazwa": "Współczynnik przenikania ciepła U teraz [W/(m²·K)]",
        "cel": "Straty przez przegrodę w obecnym stanie: U × A × ΔT.",
        "gdzie": "Ekran 1 albo karta okna / obliczenie przegrody.",
        "zakres": "Ekran 1 albo karta producenta."
      },
      "uPo": {
        "nazwa": "Współczynnik U po zmianie [W/(m²·K)]",
        "cel": "Straty po wymianie okien — porównywane ze stanem obecnym.",
        "gdzie": "Karta nowego okna (Uw).",
        "zakres": "Karta producenta nowego okna."
      },
      "gruboscCm": {
        "nazwa": "Grubość dokładanej izolacji [cm]",
        "cel": "Warstwa dodana szeregowo do obecnej przegrody: U' = 1/(1/U + d/λ), jak na Ekranie 10.",
        "gdzie": "Oferta wykonawcy albo Twój plan.",
        "zakres": "Twój wariant docieplenia."
      },
      "lambda": {
        "nazwa": "Współczynnik przewodzenia ciepła izolacji λ [W/(m·K)]",
        "cel": "Im mniejsza λ, tym mniej ciepła przechodzi przez tę samą grubość.",
        "gdzie": "Karta materiału izolacyjnego (deklarowana λ).",
        "zakres": "Karta materiału."
      },
      "dTGruntK": {
        "nazwa": "Różnica temperatur między wnętrzem a gruntem pod podłogą [K]",
        "cel": "Podłoga na gruncie oddaje ciepło do gruntu, nie do powietrza zewnętrznego — dlatego osobna różnica temperatur.",
        "gdzie": "Temperatura w domu minus temperatura gruntu pod podłogą (pomiar albo dane z Modułu 1).",
        "zakres": "Twoja lokalizacja — aplikacja nie przyjmuje temperatury gruntu."
      },
      "hMostkowPrzedWK": {
        "nazwa": "Współczynnik strat przez mostki termiczne teraz H_TB [W/K]",
        "cel": "Suma Ψ·L wszystkich mostków; × ΔT daje dodatkową moc strat.",
        "gdzie": "Ekran 7 (mostki termiczne) — wynik H_TB.",
        "zakres": "Wynik Twojego Ekranu 7."
      },
      "hMostkowPoWK": {
        "nazwa": "H_TB po poprawie [W/K]",
        "cel": "Mostki po dociepleniu/korekcie detali; puste = mostki całkiem wyeliminowane.",
        "gdzie": "Ekran 7 przeliczony z poprawionymi detalami.",
        "zakres": "Wynik Ekranu 7 dla wariantu po poprawie."
      },
      "kubaturaM3": {
        "nazwa": "Kubatura ogrzewana [m³]",
        "cel": "Z liczbą wymian powietrza daje stratę na infiltrację, jak na Ekranie 12.",
        "gdzie": "Projekt budynku albo powierzchnia × wysokość.",
        "zakres": "Twój budynek."
      },
      "nPrzed": {
        "nazwa": "Liczba wymian powietrza na godzinę teraz [1/h]",
        "cel": "Strata wentylacyjna: n × V × ρ × cp × ΔT / 3600. Przy wysokości pomieszczeń — wymiany, które zostają po zmianie wysokości.",
        "gdzie": "Ekran 12 (test szczelności, wynik przeliczony na wymiany w zwykłych warunkach).",
        "zakres": "Wynik testu szczelności albo Ekranu 12."
      },
      "nPo": {
        "nazwa": "Liczba wymian powietrza po uszczelnieniu [1/h]",
        "cel": "Porównanie ze stanem obecnym; puste = bez infiltracji (jak w przykładzie źródła).",
        "gdzie": "Cel uszczelnienia albo test po pracach.",
        "zakres": "Wynik testu po uszczelnieniu."
      },
      "strumienM3H": {
        "nazwa": "Strumień powietrza wentylacji [m³/h]",
        "cel": "Ilość powietrza wymienianego na godzinę — strata = strumień × ρ × cp × (1 − odzysk) × ΔT.",
        "gdzie": "Projekt wentylacji albo Ekran 3.",
        "zakres": "Projekt wentylacji."
      },
      "etaPrzedPct": {
        "nazwa": "Sprawność odzysku ciepła teraz [%]",
        "cel": "0 = wentylacja bez odzysku (grawitacyjna albo wywiewna).",
        "gdzie": "Karta rekuperatora albo 0, jeśli go nie ma.",
        "zakres": "0–100% — karta rekuperatora."
      },
      "etaPoPct": {
        "nazwa": "Sprawność odzysku ciepła po zmianie [%]",
        "cel": "Wariant porównywany, np. nowy rekuperator.",
        "gdzie": "Karta rekuperatora.",
        "zakres": "0–100% — karta rekuperatora."
      },
      "wentylatoryKwhDoba": {
        "nazwa": "Prąd wentylatorów rekuperatora na dobę [kWh]",
        "cel": "Źródło: rekuperacja zmniejsza straty, ale zużywa prąd — pokazane obok wyniku, żeby było widać oba.",
        "gdzie": "Moc wentylatorów z karty × 24 h albo licznik.",
        "zakres": "Z karty katalogowej albo Twojego pomiaru — aplikacja nie zakłada wartości."
      },
      "powierzchniaPodlogiM2": {
        "nazwa": "Powierzchnia podłogi ogrzewanej [m²]",
        "cel": "Powierzchnia × wysokość = kubatura, od której zależy strata wentylacyjna.",
        "gdzie": "Projekt budynku.",
        "zakres": "Twój budynek."
      },
      "obwodM": {
        "nazwa": "Obwód ścian zewnętrznych [m]",
        "cel": "Obwód × wysokość = powierzchnia ścian, która rośnie z wysokością pomieszczeń.",
        "gdzie": "Projekt albo pomiar po obrysie.",
        "zakres": "Twój budynek."
      },
      "uScian": {
        "nazwa": "Współczynnik U ścian zewnętrznych [W/(m²·K)]",
        "cel": "Straty przez dodatkową powierzchnię ścian przy wyższych pomieszczeniach.",
        "gdzie": "Ekran 1.",
        "zakres": "Ekran 1."
      },
      "hPrzedM": {
        "nazwa": "Wysokość pomieszczeń teraz [m]",
        "cel": "Stan porównywany.",
        "gdzie": "Projekt albo pomiar.",
        "zakres": "Twój budynek."
      },
      "hPoM": {
        "nazwa": "Wysokość porównywana [m]",
        "cel": "Np. 3 m zamiast 2,5 m (przykład źródła: kubatura +20%).",
        "gdzie": "Twój wariant.",
        "zakres": "Twój wariant."
      },
      "dlugoscRurM": {
        "nazwa": "Długość rur w nieogrzewanym miejscu [m]",
        "cel": "Straty liczone tylko tam, gdzie rury oddają ciepło na zewnątrz ogrzewanej strefy (garaż, piwnica, strych).",
        "gdzie": "Pomiar na instalacji.",
        "zakres": "Twoja instalacja."
      },
      "psiPrzed": {
        "nazwa": "Strata liniowa rury teraz [W/(m·K)]",
        "cel": "Ile watów oddaje metr rury na każdy stopień różnicy temperatur — ten sam parametr co na Ekranie 17 (cyrkulacja).",
        "gdzie": "Karta otuliny / tabela producenta rur dla danej średnicy i izolacji.",
        "zakres": "Z karty katalogowej albo Twojego pomiaru — aplikacja nie zakłada wartości."
      },
      "psiPo": {
        "nazwa": "Strata liniowa rury po izolacji [W/(m·K)]",
        "cel": "Wariant z otuliną; puste = bez strat.",
        "gdzie": "Karta otuliny dla wybranej grubości.",
        "zakres": "Z karty katalogowej albo Twojego pomiaru — aplikacja nie zakłada wartości."
      },
      "tWodyC": {
        "nazwa": "Temperatura wody w rurach [°C]",
        "cel": "Różnica z temperaturą otoczenia napędza straty.",
        "gdzie": "Nastawa zasilania pompy (Ekran 5) albo termometr.",
        "zakres": "Twoja instalacja."
      },
      "tOtoczeniaC": {
        "nazwa": "Temperatura wokół rur [°C]",
        "cel": "Garaż, piwnica czy strych zimą — im zimniej, tym większe straty.",
        "gdzie": "Termometr w tym pomieszczeniu.",
        "zakres": "Twój pomiar."
      },
      "godzinyH": {
        "nazwa": "Godziny przepływu gorącej wody na dobę [h]",
        "cel": "Rury tracą ciepło tylko wtedy, gdy płynie w nich ciepła woda.",
        "gdzie": "Licznik pracy pompy albo sterownik.",
        "zakres": "0–24 h."
      },
      "powierzchniaOkienM2": {
        "nazwa": "Powierzchnia samych szyb [m²]",
        "cel": "Zyski liczone przez szybę — bez ramy.",
        "gdzie": "Karta okna (powierzchnia przeszklenia) albo pomiar.",
        "zakres": "Twoje okna."
      },
      "g": {
        "nazwa": "Współczynnik przepuszczalności energii słonecznej g [–]",
        "cel": "Jaka część energii słońca przechodzi przez szybę do środka.",
        "gdzie": "Karta okna / szyby (g, np. 0,5).",
        "zakres": "0–1 — karta szyby."
      },
      "napromieniowanieKwhM2": {
        "nazwa": "Napromieniowanie płaszczyzny okna w sezonie grzewczym [kWh/m²]",
        "cel": "Ile energii słońca pada na metr okna przy jego orientacji (południe dużo, północ mało) — tu wchodzi orientacja budynku.",
        "gdzie": "Moduł 1 (dane PVGIS dla pionowej płaszczyzny o danym azymucie), zsumowane za miesiące grzewcze.",
        "zakres": "Dane PVGIS Twojej lokalizacji."
      },
      "zacienieniePrzedPct": {
        "nazwa": "Zacienienie okna teraz [%]",
        "cel": "Część zysków zabrana przez drzewo, budynek, okap.",
        "gdzie": "Analiza zacienienia (Moduł 1) albo oszacowanie.",
        "zakres": "0–100%."
      },
      "zacieniePoPct": {
        "nazwa": "Zacienienie po zmianie [%]",
        "cel": "Np. po wycięciu drzewa — różnica to zysk, który wraca.",
        "gdzie": "Twój wariant.",
        "zakres": "0–100%."
      },
      "godzinySezonuH": {
        "nazwa": "Godziny sezonu grzewczego [h]",
        "cel": "Opcjonalne: energia ÷ godziny = średnia moc, tak jak źródło przelicza kWh na kW.",
        "gdzie": "Liczba dni sezonu × 24 albo dane z Ekranu 1.",
        "zakres": "Twoja lokalizacja."
      },
      "zyskiKwhDoba": {
        "nazwa": "Zyski bytowe na dobę [kWh]",
        "cel": "Ciepło od ludzi, AGD, oświetlenia i gotowania.",
        "gdzie": "Moduł 2 (bilans urządzeń — prąd zużyty w domu zamienia się w ciepło) + ludzie.",
        "zakres": "Źródło: w nowoczesnym domu często 2–3 kWh/dobę."
      },
      "dniSezonu": {
        "nazwa": "Dni sezonu grzewczego",
        "cel": "Opcjonalne: zyski w całym sezonie.",
        "gdzie": "Dane klimatyczne (Moduł 1) albo Ekran 1.",
        "zakres": "Twoja lokalizacja."
      },
      "tPrzedC": {
        "nazwa": "Temperatura teraz [°C]",
        "cel": "Temperatura zasilania, dolnego źródła albo powrotu — zależnie od wybranego czynnika.",
        "gdzie": "Nastawa sterownika albo termometr.",
        "zakres": "Twoja instalacja."
      },
      "tPoC": {
        "nazwa": "Temperatura po zmianie [°C]",
        "cel": "Wariant porównywany.",
        "gdzie": "Twój wariant.",
        "zakres": "Twój wariant."
      },
      "copPrzed": {
        "nazwa": "COP przy obecnej temperaturze [–]",
        "cel": "Ciepło ÷ prąd w obecnym punkcie pracy.",
        "gdzie": "Karta katalogowa pompy (tabela COP dla temperatur) albo Ekran 5.",
        "zakres": "Karta pompy."
      },
      "copPo": {
        "nazwa": "COP po zmianie temperatury [–]",
        "cel": "Przy temperaturze zasilania można zostawić puste — wtedy widełki z reguły źródła 2–3% na °C.",
        "gdzie": "Karta katalogowa pompy dla nowego punktu pracy.",
        "zakres": "Karta pompy."
      },
      "cieploSezonKwh": {
        "nazwa": "Ciepło potrzebne w sezonie [kWh]",
        "cel": "Opcjonalne: przelicza zmianę COP na kWh prądu (prąd = ciepło ÷ COP).",
        "gdzie": "Ekran 2 (zapotrzebowanie roczne).",
        "zakres": "Wynik Twojego Ekranu 2."
      },
      "defrostKwhDoba": {
        "nazwa": "Energia defrostu na dobę [kWh]",
        "cel": "Dodatkowa energia odszraniania w dniu ze szronieniem.",
        "gdzie": "Ekran 6 (cykle odszraniania) — wynik na dobę.",
        "zakres": "Wynik Twojego Ekranu 6."
      },
      "dniSzronienia": {
        "nazwa": "Dni ze szronieniem w sezonie",
        "cel": "Dni, w których pompa się odszrania (wilgotno, temperatura w strefie szronienia).",
        "gdzie": "Dane klimatyczne (Moduł 1) albo obserwacja z poprzedniej zimy.",
        "zakres": "Twoja lokalizacja."
      },
      "zuzyciePompySezonKwh": {
        "nazwa": "Zużycie prądu pompy w sezonie [kWh]",
        "cel": "Opcjonalne: pokazuje udział defrostu w całym zużyciu.",
        "gdzie": "Licznik albo Ekran 2 ÷ SCOP.",
        "zakres": "Twój licznik."
      },
      "ograniczeniePct": {
        "nazwa": "Moc po ograniczeniu [% mocy]",
        "cel": "Tryb cichy albo limit mocy z poziomu sterownika — jaką część mocy pompa może oddać.",
        "gdzie": "Instrukcja pompy (tryb cichy) albo Twoja nastawa limitu.",
        "zakres": "0–100% — instrukcja pompy."
      },
      "copOgraniczony": {
        "nazwa": "COP przy ograniczonej mocy [–]",
        "cel": "Opcjonalne: przy niższej mocy COP bywa wyższy — zmienia zużycie prądu na to samo ciepło.",
        "gdzie": "Karta katalogowa (COP przy obciążeniu częściowym).",
        "zakres": "Karta pompy."
      },
      "mocFalownikaKw": {
        "nazwa": "Moc ciągła falownika [kW]",
        "cel": "Sprawdzenie, czy pobór pompy (moc ÷ COP) mieści się w falowniku.",
        "gdzie": "Tabliczka / karta falownika (moc ciągła, nie szczytowa).",
        "zakres": "Karta falownika."
      },
      "dTObieguK": {
        "nazwa": "Różnica temperatur zasilanie–powrót [K]",
        "cel": "Przepływ = moc ÷ (ciepło właściwe wody × ΔT).",
        "gdzie": "Projekt instalacji albo instrukcja pompy (zalecana ΔT).",
        "zakres": "Instrukcja pompy."
      },
      "liczbaA": {
        "nazwa": "Liczba odwiertów w wariancie A",
        "cel": "Długość całkowita = liczba × głębokość.",
        "gdzie": "Oferta wiertnicza.",
        "zakres": "Twój wariant."
      },
      "glebokoscAM": {
        "nazwa": "Głębokość odwiertu w wariancie A [m]",
        "cel": "Głębszy odwiert to więcej metrów kolektora.",
        "gdzie": "Oferta wiertnicza / projekt.",
        "zakres": "Źródło (5.42): typowo 50–100 m."
      },
      "liczbaB": {
        "nazwa": "Liczba odwiertów w wariancie B",
        "cel": "Drugi wariant do porównania.",
        "gdzie": "Oferta wiertnicza.",
        "zakres": "Twój wariant."
      },
      "glebokoscBM": {
        "nazwa": "Głębokość odwiertu w wariancie B [m]",
        "cel": "Drugi wariant do porównania.",
        "gdzie": "Oferta wiertnicza / projekt.",
        "zakres": "Źródło (5.42): typowo 50–100 m."
      },
      "cenaZlM": {
        "nazwa": "Cena metra odwiertu [zł/m]",
        "cel": "Koszt = długość × cena; źródło zakłada koszt rosnący liniowo z długością.",
        "gdzie": "Oferta wiertnicza.",
        "zakres": "Oferta wykonawcy."
      },
      "wNaM": {
        "nazwa": "Moc pompy na metr odwiertu [W/m]",
        "cel": "Ten sam wskaźnik co na ekranie kolektora gruntowego — zależy od gruntu.",
        "gdzie": "Projekt / badanie gruntu (test TRT) albo widełki źródła.",
        "zakres": "Źródło (5.42): ok. 50–70 W/m."
      },
      "obciazenieKw": {
        "nazwa": "Obciążenie — ciepło potrzebne w tej chwili [kW]",
        "cel": "Przy obciążeniu mniejszym od mocy pompy sprężarka grzeje, wyłącza się i startuje ponownie.",
        "gdzie": "Ekran 1 dla danej temperatury zewnętrznej.",
        "zakres": "Wynik Twojego Ekranu 1."
      },
      "wodaInstalacjiL": {
        "nazwa": "Woda w instalacji bez bufora [l]",
        "cel": "Ta woda to „bufor”, który pompa ma bez zbiornika.",
        "gdzie": "Projekt instalacji (pojemność rur i grzejników/pętli) albo przy napełnianiu.",
        "zakres": "Twoja instalacja."
      },
      "buforL": {
        "nazwa": "Pojemność bufora [l]",
        "cel": "Dodaje się do wody w instalacji — więcej wody to dłuższe cykle i mniej startów.",
        "gdzie": "Karta bufora (Ekran 14).",
        "zakres": "Karta bufora."
      },
      "histerezaK": {
        "nazwa": "Histereza termostatu [K]",
        "cel": "O ile woda stygnie, zanim pompa wystartuje ponownie.",
        "gdzie": "Nastawa sterownika pompy.",
        "zakres": "Instrukcja sterownika."
      }
    }
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "cykle-odszraniania": {
    migawka: {
      oCoChodzi: "Like defrosting a freezer — a heat pump from time to time has to “clean itself” of frost to keep working efficiently, and that costs energy too.",
      jakDziala: "Enter the defrost cycle: every how many minutes, how long and at what power, and the power in normal heating. The app computes the share of time spent defrosting, the extra energy per hour and per day, and the percentage increase in consumption — and with the catalogue COP, the real COP including defrost.",
      poCo: "In humid frost the pump uses more electricity than the catalogue COP suggests — without this the battery balance is too optimistic.",
      fizyka: "Frost forms on the evaporator typically below 5–{prog} °C at high humidity (source). E_h = P_def · t_def / T; overhead = P_def·t_def / (P_base·T); COP_eff = COP_cat / (1 + overhead). The source example “every 45 min, 5 min → +8%” needs a defrost power of 0.72 × the running power (equal power gives 11%).",
    },
    pola: {
      tZewn: {
        nazwa: "Outdoor temperature [°C]",
        cel: "Compared with the source's frosting range and the pump minimum operating temperature.",
        gdzie: "Outdoor thermometer or climate data (Module 1).",
        zakres: "Your location.",
      },
      wilgotnosc: {
        nazwa: "Relative air humidity [%]",
        cel: "Information next to the result only — frosting is more frequent at high humidity, but the source gives no threshold.",
        gdzie: "Hygrometer or weather forecast.",
        zakres: "0–100%. Empty = not entered.",
      },
      odstep: {
        nazwa: "Interval between defrosts [min]",
        cel: "Time from the start of one defrost to the start of the next.",
        gdzie: "Pump manual/datasheet (defrost control) or observation — run counter, manufacturer app.",
        zakres: "The device datasheet or your measurement.",
      },
      czas: {
        nazwa: "Duration of one defrost [min]",
        cel: "How long the pump runs “in cooling” to melt the frost.",
        gdzie: "Manual or observation (the outdoor unit fan stops, the evaporator steams).",
        zakres: "Shorter than the interval.",
      },
      mocDefrostu: {
        nazwa: "Electrical power during defrost [kW]",
        cel: "Gives the energy of one defrost.",
        gdzie: "Meter/wattmeter reading during defrost or manufacturer data.",
        zakres: "The device datasheet or your measurement.",
      },
      mocBazowa: {
        nazwa: "Electrical power in normal heating [kW]",
        cel: "Reference for the percentage overhead.",
        gdzie: "Pump datasheet at this temperature or a measurement.",
        zakres: "The device datasheet or your measurement.",
      },
      godziny: {
        nazwa: "Frosting hours per day [h]",
        cel: "How many hours a day frosting conditions last — turns energy per hour into energy per day.",
        gdzie: "Forecast: hours with temperature in the frosting range and high humidity.",
        zakres: "0–24. Empty = no daily result.",
      },
      cop: {
        nazwa: "Catalogue COP at this temperature",
        cel: "Gives the real COP including defrost.",
        gdzie: "Pump datasheet (COP at this outdoor temperature) or Screen 5.",
        zakres: "≥ 1. Empty = no real COP.",
      },
      tMin: {
        nazwa: "Pump minimum operating temperature [°C]",
        cel: "Below it the pump switches off — backup heaters must heat the house.",
        gdzie: "Pump datasheet — heating mode operating range.",
        zakres: "Empty = not checked.",
      },
    },
  },
  "wentylacja-grawitacyjna": {
    "migawka": {
      "oCoChodzi": "Warm air escapes up the chimney on its own — you have to stop it, but not at the cost of fresh air in the house.",
      "jakDziala": "Enter the volume, the air changes per day and the temperatures. The app turns air changes into an air flow and computes the heat loss per day (and over a period). With the building's other losses — the ventilation share; with a heat recovery efficiency — what would remain at the same flow with recovery.",
      "poCo": "Stack ventilation is often the largest single loss of an old house — you know whether heat recovery makes sense before spending money.",
      "fizyka": "V̇ = n·V / 24 h; Φ = V̇·ρ·cp·ΔT (ρ = 1.2 kg/m³, cp = 1005 J/(kg·K) — as Screens 3 and 12); with recovery Φ·(1 − η). The source example “15% of losses → 5% with recovery” corresponds to an efficiency of about 70%."
    },
    "pola": {
      "kubatura": {
        "nazwa": "Heated volume [m³]",
        "cel": "Volume of air exchanged by ventilation.",
        "gdzie": "Heated floor area × room height (Screen 1/12).",
        "zakres": "Your building."
      },
      "wymiany": {
        "nazwa": "Air changes per day [1/day]",
        "cel": "How many times a day the whole air of the house is exchanged.",
        "gdzie": "Airtightness test (Screen 12, air changes per hour × 24) or an anemometer at the grilles. Strong wind and hard frost mean more changes.",
        "zakres": "Your building — the app has no formula for the stack effect."
      },
      "tWew": {
        "nazwa": "Indoor temperature [°C]",
        "cel": "The temperature difference drives the losses.",
        "gdzie": "The temperature you keep in winter.",
        "zakres": "Your setting."
      },
      "tZewn": {
        "nazwa": "Mean outdoor temperature [°C]",
        "cel": "The day you compute for.",
        "gdzie": "Climate data (Module 1) or monthly means from Screen 1.",
        "zakres": "Your location."
      },
      "szczelny": {
        "nazwa": "New, airtight house without mechanical ventilation",
        "cel": "Source warning: in an airtight house stack ventilation will not exchange the air — mould risk.",
        "gdzie": "New windows, membranes, a good airtightness test result.",
        "zakres": "Yes / no."
      },
      "pozostale": {
        "nazwa": "Other heat losses of the building [W]",
        "cel": "Gives the ventilation share of total losses.",
        "gdzie": "Transmission loss from Screen 1 at the same temperatures (without ventilation).",
        "zakres": "Empty = no percentage share."
      },
      "sprawnosc": {
        "nazwa": "Heat recovery efficiency for comparison [%]",
        "cel": "How much loss would remain at the same flow with heat recovery.",
        "gdzie": "Heat recovery unit datasheet (Screen 3).",
        "zakres": "0–100%. Empty = no comparison."
      },
      "dni": {
        "nazwa": "Number of days",
        "cel": "Multiplies the daily loss over a period (e.g. a month).",
        "gdzie": "Days of a period with a similar mean temperature.",
        "zakres": "Empty = per day only."
      }
    }
  },
  "gwc": {
    "migawka": {
      "oCoChodzi": "The ground a few metres down has a constant temperature all year — a GHE is a way to “borrow” it to pre-heat or pre-cool the air.",
      "jakDziala": "Enter the air flow, how many degrees the GHE warms the air in winter and how many hours a day it runs. The app computes the power and daily heat; behind a heat recovery unit only part of the gain stays in the house. With the demand — the share; with COP — less electricity.",
      "poCo": "You know what the GHE really gives in your system — especially behind a recuperator, where the gain is much smaller than the temperature rise suggests.",
      "fizyka": "Φ = V̇·ρ·cp·ΔT (ρ = 1.2 kg/m³, cp = 1005 J/(kg·K) — as Screens 3 and 12); Q = Φ·(1 − η)·h. The source example “+4 °C → −5%” gives no air flow or demand — it cannot be reproduced by itself."
    },
    "pola": {
      "strumien": {
        "nazwa": "Air flow through the GHE [m³/h]",
        "cel": "How much air the ground warms.",
        "gdzie": "Ventilation unit setting (Screen 3).",
        "zakres": "Your installation."
      },
      "przyrost": {
        "nazwa": "Winter air temperature rise [K]",
        "cel": "How many degrees warmer the air after the GHE is than outdoors.",
        "gdzie": "GHE manufacturer data for your length and depth, or a thermometer before and after the exchanger on a frosty day.",
        "zakres": "Datasheet or your measurement — the app has no ground model."
      },
      "godziny": {
        "nazwa": "GHE operating hours per day [h]",
        "cel": "Turns power into daily heat.",
        "gdzie": "GHE damper control (e.g. only below a set temperature).",
        "zakres": "0–24."
      },
      "rekuperator": {
        "nazwa": "Heat recovery efficiency behind the GHE [%]",
        "cel": "Behind a recuperator only (1 − efficiency) of the GHE gain stays in the house.",
        "gdzie": "Recuperator datasheet.",
        "zakres": "0–100%. Empty = no recuperator."
      },
      "zapotrzebowanie": {
        "nazwa": "Daily heating demand [kWh]",
        "cel": "Gives the GHE share.",
        "gdzie": "Screen 1 or 2 at the same outdoor temperature.",
        "zakres": "Empty = no share."
      },
      "cop": {
        "nazwa": "Heating COP",
        "cel": "Turns heat saved into electricity saved.",
        "gdzie": "1 = heater; heat pump — datasheet (Screen 5).",
        "zakres": "≥ 1. Empty = no electricity."
      }
    }
  },
  "wplyw-czynnika": {
    "migawka": {
      "oCoChodzi": "One screen for many \"what if…\" questions: I replace the windows, insulate the roof, lower the flow temperature, add a buffer. Each factor shows one concrete number — how many kW, kWh or compressor starts it changes.",
      "jakDziala": "Pick a factor, enter the current and the compared state. The app uses the formula of that factor — the same ones as the Part 1 screens (element loss, infiltration, ventilation, insulation) — and, if you give the house demand and pump power, checks whether the pump is still enough.",
      "poCo": "A pump is sized to the building with its flaws — but first it pays to know which flaws to fix, because that is cheaper than a bigger pump and a bigger inverter off-grid.",
      "fizyka": "Loss power: Φ = U·A·ΔT, Φ = n·V·ρ·cp·ΔT/3600, U' = 1/(1/U + d/λ). Electricity: E = Q/COP. Flow: V̇ = P/(cw·ΔT). Buffer: cycle = C·ΔT_h/(P − L) + C·ΔT_h/L, C = V·cw. Solar gains cut seasonal use, not the design power."
    },
    "pola": {
      "czynnik": {
        "nazwa": "Factor affecting the heat pump",
        "cel": "Each factor has its own fields and formula; entered values stay when you switch the factor (the same field means the same thing).",
        "gdzie": "Pick what you want to change or check in your house.",
        "zakres": "18 factors from Part 2D of the source; 7 items without a formula in the source are not computed (list below the result)."
      },
      "dTK": {
        "nazwa": "Indoor–outdoor temperature difference on the design day [K]",
        "cel": "Multiplies the loss coefficient — that gives the power in kW, as on Screen 1.",
        "gdzie": "Screen 1 (indoor temperature minus the design outdoor temperature of your climate zone).",
        "zakres": "Your climate zone and indoor temperature."
      },
      "zapotrzebowanieKw": {
        "nazwa": "House heating power demand [kW]",
        "cel": "Optional: shows how the whole demand changes and by how many percent. Enter the current (\"before\") state.",
        "gdzie": "Screen 1 (heat loss) or Screen 2.",
        "zakres": "Your Screen 1 result."
      },
      "mocPompyKw": {
        "nazwa": "Heat pump heating power [kW]",
        "cel": "To check whether the pump covers the demand; for flow, buffer and limit — the power the pump delivers.",
        "gdzie": "Pump datasheet (power at an operating point, e.g. A-7/W35).",
        "zakres": "From the datasheet or your measurement — the app assumes no value."
      },
      "powierzchniaM2": {
        "nazwa": "Element area [m²]",
        "cel": "Multiplies U — more area, more loss.",
        "gdzie": "Building plans or measurement (windows: window area only; roof/floor: the insulated area).",
        "zakres": "Your building."
      },
      "uPrzed": {
        "nazwa": "Heat transfer coefficient U now [W/(m²·K)]",
        "cel": "Loss through the element in its current state: U × A × ΔT.",
        "gdzie": "Screen 1 or the window datasheet / element calculation.",
        "zakres": "Screen 1 or the manufacturer's datasheet."
      },
      "uPo": {
        "nazwa": "U after the change [W/(m²·K)]",
        "cel": "Loss after replacing the windows — compared with the current state.",
        "gdzie": "Datasheet of the new window (Uw).",
        "zakres": "Datasheet of the new window."
      },
      "gruboscCm": {
        "nazwa": "Added insulation thickness [cm]",
        "cel": "Layer added in series to the current element: U' = 1/(1/U + d/λ), as on Screen 10.",
        "gdzie": "Contractor's offer or your plan.",
        "zakres": "Your insulation variant."
      },
      "lambda": {
        "nazwa": "Insulation thermal conductivity λ [W/(m·K)]",
        "cel": "The lower λ, the less heat passes through the same thickness.",
        "gdzie": "Insulation material datasheet (declared λ).",
        "zakres": "Material datasheet."
      },
      "dTGruntK": {
        "nazwa": "Temperature difference between indoors and the ground below the floor [K]",
        "cel": "A floor on the ground loses heat to the ground, not to the outdoor air — hence a separate temperature difference.",
        "gdzie": "Indoor temperature minus the ground temperature under the floor (measurement or Module 1 data).",
        "zakres": "Your location — the app assumes no ground temperature."
      },
      "hMostkowPrzedWK": {
        "nazwa": "Thermal bridge loss coefficient now H_TB [W/K]",
        "cel": "Sum of Ψ·L of all bridges; × ΔT gives the extra loss power.",
        "gdzie": "Screen 7 (thermal bridges) — the H_TB result.",
        "zakres": "Your Screen 7 result."
      },
      "hMostkowPoWK": {
        "nazwa": "H_TB after the fix [W/K]",
        "cel": "Bridges after insulating/fixing the details; empty = bridges fully eliminated.",
        "gdzie": "Screen 7 recalculated with the improved details.",
        "zakres": "Screen 7 result for the improved variant."
      },
      "kubaturaM3": {
        "nazwa": "Heated volume [m³]",
        "cel": "With the air change rate gives the infiltration loss, as on Screen 12.",
        "gdzie": "Building plans or area × height.",
        "zakres": "Your building."
      },
      "nPrzed": {
        "nazwa": "Air changes per hour now [1/h]",
        "cel": "Ventilation loss: n × V × ρ × cp × ΔT / 3600. For room height — the air changes that stay after the height change.",
        "gdzie": "Screen 12 (airtightness test, converted to air changes in normal conditions).",
        "zakres": "Airtightness test result or Screen 12."
      },
      "nPo": {
        "nazwa": "Air changes per hour after sealing [1/h]",
        "cel": "Compared with the current state; empty = no infiltration (as in the source example).",
        "gdzie": "Sealing target or a test after the works.",
        "zakres": "Test result after sealing."
      },
      "strumienM3H": {
        "nazwa": "Ventilation air flow [m³/h]",
        "cel": "Air exchanged per hour — loss = flow × ρ × cp × (1 − recovery) × ΔT.",
        "gdzie": "Ventilation design or Screen 3.",
        "zakres": "Ventilation design."
      },
      "etaPrzedPct": {
        "nazwa": "Heat recovery efficiency now [%]",
        "cel": "0 = ventilation without recovery (natural or exhaust only).",
        "gdzie": "Recuperator datasheet, or 0 if there is none.",
        "zakres": "0–100% — recuperator datasheet."
      },
      "etaPoPct": {
        "nazwa": "Heat recovery efficiency after the change [%]",
        "cel": "The compared variant, e.g. a new recuperator.",
        "gdzie": "Recuperator datasheet.",
        "zakres": "0–100% — recuperator datasheet."
      },
      "wentylatoryKwhDoba": {
        "nazwa": "Recuperator fan electricity per day [kWh]",
        "cel": "Source: recovery cuts losses but uses electricity — shown next to the result so both are visible.",
        "gdzie": "Fan power from the datasheet × 24 h, or a meter.",
        "zakres": "From the datasheet or your measurement — the app assumes no value."
      },
      "powierzchniaPodlogiM2": {
        "nazwa": "Heated floor area [m²]",
        "cel": "Area × height = volume, which the ventilation loss depends on.",
        "gdzie": "Building plans.",
        "zakres": "Your building."
      },
      "obwodM": {
        "nazwa": "Perimeter of external walls [m]",
        "cel": "Perimeter × height = wall area, which grows with room height.",
        "gdzie": "Plans or measuring around the outline.",
        "zakres": "Your building."
      },
      "uScian": {
        "nazwa": "External wall U [W/(m²·K)]",
        "cel": "Loss through the extra wall area of taller rooms.",
        "gdzie": "Screen 1.",
        "zakres": "Screen 1."
      },
      "hPrzedM": {
        "nazwa": "Room height now [m]",
        "cel": "The compared state.",
        "gdzie": "Plans or measurement.",
        "zakres": "Your building."
      },
      "hPoM": {
        "nazwa": "Height compared [m]",
        "cel": "E.g. 3 m instead of 2.5 m (source example: volume +20%).",
        "gdzie": "Your variant.",
        "zakres": "Your variant."
      },
      "dlugoscRurM": {
        "nazwa": "Pipe length in an unheated space [m]",
        "cel": "Losses counted only where pipes give heat away outside the heated zone (garage, basement, attic).",
        "gdzie": "Measurement on the installation.",
        "zakres": "Your installation."
      },
      "psiPrzed": {
        "nazwa": "Linear pipe loss now [W/(m·K)]",
        "cel": "Watts lost by one metre of pipe per degree of temperature difference — the same parameter as on Screen 17 (circulation).",
        "gdzie": "Pipe insulation datasheet / the pipe maker's table for the diameter and insulation.",
        "zakres": "From the datasheet or your measurement — the app assumes no value."
      },
      "psiPo": {
        "nazwa": "Linear pipe loss after insulating [W/(m·K)]",
        "cel": "Variant with insulation; empty = no loss.",
        "gdzie": "Insulation datasheet for the chosen thickness.",
        "zakres": "From the datasheet or your measurement — the app assumes no value."
      },
      "tWodyC": {
        "nazwa": "Water temperature in the pipes [°C]",
        "cel": "The difference to the surroundings drives the loss.",
        "gdzie": "Pump flow set point (Screen 5) or a thermometer.",
        "zakres": "Your installation."
      },
      "tOtoczeniaC": {
        "nazwa": "Temperature around the pipes [°C]",
        "cel": "Garage, basement or attic in winter — the colder, the larger the loss.",
        "gdzie": "Thermometer in that room.",
        "zakres": "Your measurement."
      },
      "godzinyH": {
        "nazwa": "Hours of hot-water flow per day [h]",
        "cel": "Pipes lose heat only while warm water flows in them.",
        "gdzie": "Pump run-hour counter or the controller.",
        "zakres": "0–24 h."
      },
      "powierzchniaOkienM2": {
        "nazwa": "Glass area only [m²]",
        "cel": "Gains counted through the glass — without the frame.",
        "gdzie": "Window datasheet (glazed area) or measurement.",
        "zakres": "Your windows."
      },
      "g": {
        "nazwa": "Solar energy transmittance g [–]",
        "cel": "Which part of the sun's energy passes through the glass into the room.",
        "gdzie": "Window / glass datasheet (g, e.g. 0.5).",
        "zakres": "0–1 — glass datasheet."
      },
      "napromieniowanieKwhM2": {
        "nazwa": "Irradiation on the window plane over the heating season [kWh/m²]",
        "cel": "How much solar energy falls on one metre of window at its orientation (south a lot, north little) — this is where the building orientation enters.",
        "gdzie": "Module 1 (PVGIS data for a vertical plane at the given azimuth), summed over the heating months.",
        "zakres": "PVGIS data for your location."
      },
      "zacienieniePrzedPct": {
        "nazwa": "Window shading now [%]",
        "cel": "Part of the gains taken away by a tree, building or overhang.",
        "gdzie": "Shading analysis (Module 1) or an estimate.",
        "zakres": "0–100%."
      },
      "zacieniePoPct": {
        "nazwa": "Shading after the change [%]",
        "cel": "E.g. after cutting a tree — the difference is the gain that comes back.",
        "gdzie": "Your variant.",
        "zakres": "0–100%."
      },
      "godzinySezonuH": {
        "nazwa": "Hours of the heating season [h]",
        "cel": "Optional: energy ÷ hours = average power, the way the source converts kWh into kW.",
        "gdzie": "Number of season days × 24, or Screen 1 data.",
        "zakres": "Your location."
      },
      "zyskiKwhDoba": {
        "nazwa": "Internal gains per day [kWh]",
        "cel": "Heat from people, appliances, lighting and cooking.",
        "gdzie": "Module 2 (appliance balance — electricity used in the house turns into heat) + people.",
        "zakres": "Source: in a modern house often 2–3 kWh/day."
      },
      "dniSezonu": {
        "nazwa": "Days of the heating season",
        "cel": "Optional: gains over the whole season.",
        "gdzie": "Climate data (Module 1) or Screen 1.",
        "zakres": "Your location."
      },
      "tPrzedC": {
        "nazwa": "Temperature now [°C]",
        "cel": "Flow, source or return temperature — depending on the chosen factor.",
        "gdzie": "Controller set point or a thermometer.",
        "zakres": "Your installation."
      },
      "tPoC": {
        "nazwa": "Temperature after the change [°C]",
        "cel": "The compared variant.",
        "gdzie": "Your variant.",
        "zakres": "Your variant."
      },
      "copPrzed": {
        "nazwa": "COP at the current temperature [–]",
        "cel": "Heat ÷ electricity at the current operating point.",
        "gdzie": "Pump datasheet (COP table by temperature) or Screen 5.",
        "zakres": "Pump datasheet."
      },
      "copPo": {
        "nazwa": "COP after the temperature change [–]",
        "cel": "For the flow temperature you may leave it empty — then a range from the source's 2–3 % per °C rule.",
        "gdzie": "Pump datasheet for the new operating point.",
        "zakres": "Pump datasheet."
      },
      "cieploSezonKwh": {
        "nazwa": "Heat needed over the season [kWh]",
        "cel": "Optional: turns the COP change into kWh of electricity (electricity = heat ÷ COP).",
        "gdzie": "Screen 2 (annual demand).",
        "zakres": "Your Screen 2 result."
      },
      "defrostKwhDoba": {
        "nazwa": "Defrost energy per day [kWh]",
        "cel": "Extra defrost energy on a frosting day.",
        "gdzie": "Screen 6 (defrost cycles) — the per-day result.",
        "zakres": "Your Screen 6 result."
      },
      "dniSzronienia": {
        "nazwa": "Days with frosting in the season",
        "cel": "Days on which the pump defrosts (humid, temperature in the frosting band).",
        "gdzie": "Climate data (Module 1) or last winter's observation.",
        "zakres": "Your location."
      },
      "zuzyciePompySezonKwh": {
        "nazwa": "Pump electricity use over the season [kWh]",
        "cel": "Optional: shows the defrost share of the total use.",
        "gdzie": "Meter, or Screen 2 ÷ SCOP.",
        "zakres": "Your meter."
      },
      "ograniczeniePct": {
        "nazwa": "Power after the limit [% of power]",
        "cel": "Quiet mode or a controller power limit — what part of its power the pump may deliver.",
        "gdzie": "Pump manual (quiet mode) or your limit setting.",
        "zakres": "0–100% — pump manual."
      },
      "copOgraniczony": {
        "nazwa": "COP at the limited power [–]",
        "cel": "Optional: at lower power COP is often higher — it changes the electricity for the same heat.",
        "gdzie": "Datasheet (part-load COP).",
        "zakres": "Pump datasheet."
      },
      "mocFalownikaKw": {
        "nazwa": "Inverter continuous power [kW]",
        "cel": "Checks whether the pump's draw (power ÷ COP) fits the inverter.",
        "gdzie": "Inverter nameplate / datasheet (continuous, not peak power).",
        "zakres": "Inverter datasheet."
      },
      "dTObieguK": {
        "nazwa": "Flow–return temperature difference [K]",
        "cel": "Flow = power ÷ (specific heat of water × ΔT).",
        "gdzie": "Installation design or pump manual (recommended ΔT).",
        "zakres": "Pump manual."
      },
      "liczbaA": {
        "nazwa": "Number of boreholes in variant A",
        "cel": "Total length = number × depth.",
        "gdzie": "Drilling offer.",
        "zakres": "Your variant."
      },
      "glebokoscAM": {
        "nazwa": "Borehole depth in variant A [m]",
        "cel": "A deeper borehole means more metres of collector.",
        "gdzie": "Drilling offer / design.",
        "zakres": "Source (5.42): typically 50–100 m."
      },
      "liczbaB": {
        "nazwa": "Number of boreholes in variant B",
        "cel": "The second variant to compare.",
        "gdzie": "Drilling offer.",
        "zakres": "Your variant."
      },
      "glebokoscBM": {
        "nazwa": "Borehole depth in variant B [m]",
        "cel": "The second variant to compare.",
        "gdzie": "Drilling offer / design.",
        "zakres": "Source (5.42): typically 50–100 m."
      },
      "cenaZlM": {
        "nazwa": "Price per metre drilled [zł/m]",
        "cel": "Cost = length × price; the source assumes cost growing linearly with length.",
        "gdzie": "Drilling offer.",
        "zakres": "Contractor's offer."
      },
      "wNaM": {
        "nazwa": "Pump power per metre of borehole [W/m]",
        "cel": "The same index as on the ground collector screen — it depends on the ground.",
        "gdzie": "Design / ground test (TRT) or the source range.",
        "zakres": "Source (5.42): about 50–70 W/m."
      },
      "obciazenieKw": {
        "nazwa": "Load — heat needed right now [kW]",
        "cel": "With a load below the pump power the compressor heats, stops and starts again.",
        "gdzie": "Screen 1 for the given outdoor temperature.",
        "zakres": "Your Screen 1 result."
      },
      "wodaInstalacjiL": {
        "nazwa": "Water in the system without a buffer [l]",
        "cel": "This water is the \"buffer\" the pump has without a tank.",
        "gdzie": "Installation design (pipe and radiator/loop volume) or at filling.",
        "zakres": "Your installation."
      },
      "buforL": {
        "nazwa": "Buffer volume [l]",
        "cel": "Adds to the system water — more water means longer cycles and fewer starts.",
        "gdzie": "Buffer datasheet (Screen 14).",
        "zakres": "Buffer datasheet."
      },
      "histerezaK": {
        "nazwa": "Thermostat hysteresis [K]",
        "cel": "How much the water cools before the pump starts again.",
        "gdzie": "Pump controller setting.",
        "zakres": "Controller manual."
      }
    }
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "cykle-odszraniania": {
    migawka: {
      oCoChodzi: "Как разморозка морозилки — тепловой насос время от времени должен «очиститься» от инея, чтобы дальше работать эффективно, и это тоже стоит энергии.",
      jakDziala: "Введите цикл оттайки: каждые сколько минут, как долго и с какой мощностью, а также потребление при обычном отоплении. Приложение посчитает долю времени на оттайку, дополнительную энергию за час и за сутки и рост потребления в процентах — а с каталожным COP реальный COP с оттайкой.",
      poCo: "Во влажный мороз насос потребляет больше электроэнергии, чем следует из каталожного COP, — без этого баланс батареи слишком оптимистичен.",
      fizyka: "Иней образуется на испарителе обычно ниже 5–{prog} °C при высокой влажности (источник). E_ч = P_отт · t_отт / T; надбавка = P_отт·t_отт / (P_баз·T); COP_эф = COP_кат / (1 + надбавка). Пример источника «каждые 45 мин, 5 мин → +8%» требует мощности оттайки 0,72 × рабочей (при равной мощности выходит 11%).",
    },
    pola: {
      tZewn: {
        nazwa: "Наружная температура [°C]",
        cel: "Сравнивается с диапазоном обмерзания из источника и с минимальной рабочей температурой насоса.",
        gdzie: "Уличный термометр или климатические данные (Модуль 1).",
        zakres: "Ваше местоположение.",
      },
      wilgotnosc: {
        nazwa: "Относительная влажность воздуха [%]",
        cel: "Только информация при результате — при высокой влажности обмерзание чаще, но источник не даёт порога.",
        gdzie: "Гигрометр или прогноз погоды.",
        zakres: "0–100%. Пусто = не введено.",
      },
      odstep: {
        nazwa: "Интервал между оттайками [мин]",
        cel: "Время от начала одной оттайки до начала следующей.",
        gdzie: "Инструкция/паспорт насоса (управление оттайкой) или наблюдение — счётчик работы, приложение производителя.",
        zakres: "Паспорт устройства или ваше измерение.",
      },
      czas: {
        nazwa: "Длительность одной оттайки [мин]",
        cel: "Как долго насос работает «на охлаждение», растапливая иней.",
        gdzie: "Инструкция или наблюдение (вентилятор наружного блока останавливается, испаритель парит).",
        zakres: "Короче интервала.",
      },
      mocDefrostu: {
        nazwa: "Потребляемая мощность во время оттайки [кВт]",
        cel: "Из неё считается энергия одной оттайки.",
        gdzie: "Измерение счётчиком/ваттметром во время оттайки или данные производителя.",
        zakres: "Паспорт устройства или ваше измерение.",
      },
      mocBazowa: {
        nazwa: "Потребляемая мощность при обычном отоплении [кВт]",
        cel: "Опорное значение для процентной надбавки.",
        gdzie: "Паспорт насоса при этой температуре или измерение.",
        zakres: "Паспорт устройства или ваше измерение.",
      },
      godziny: {
        nazwa: "Часы обмерзания в сутки [ч]",
        cel: "Сколько часов в сутки держатся условия обмерзания — переводит энергию за час в энергию за сутки.",
        gdzie: "Прогноз: часы с температурой в диапазоне обмерзания и высокой влажностью.",
        zakres: "0–24. Пусто = без суточного результата.",
      },
      cop: {
        nazwa: "Каталожный COP при этой температуре",
        cel: "Из него считается реальный COP с оттайкой.",
        gdzie: "Паспорт насоса (COP при этой наружной температуре) или Экран 5.",
        zakres: "≥ 1. Пусто = без реального COP.",
      },
      tMin: {
        nazwa: "Минимальная рабочая температура насоса [°C]",
        cel: "Ниже неё насос выключается — дом должны греть резервные ТЭНы.",
        gdzie: "Паспорт насоса — рабочий диапазон в режиме отопления.",
        zakres: "Пусто = не проверяется.",
      },
    },
  },
  "wentylacja-grawitacyjna": {
    "migawka": {
      "oCoChodzi": "Тёплый воздух сам уходит в дымоход — его нужно удержать, но не ценой свежего воздуха в доме.",
      "jakDziala": "Введите объём, кратность воздухообмена в сутки и температуры. Приложение переведёт кратность в расход воздуха и посчитает теплопотери за сутки (и за период). С прочими потерями здания — долю вентиляции; с КПД рекуператора — что осталось бы при том же расходе с рекуперацией.",
      "poCo": "Естественная вентиляция часто крупнейшая отдельная потеря старого дома — вы знаете, есть ли смысл в рекуперации, до трат.",
      "fizyka": "V̇ = n·V / 24 ч; Φ = V̇·ρ·cp·ΔT (ρ = 1,2 кг/м³, cp = 1005 Дж/(кг·К) — как на Экранах 3 и 12); с рекуперацией Φ·(1 − η). Пример источника «15% потерь → 5% с рекуперацией» соответствует КПД около 70%."
    },
    "pola": {
      "kubatura": {
        "nazwa": "Отапливаемый объём [м³]",
        "cel": "Объём воздуха, который обменивает вентиляция.",
        "gdzie": "Отапливаемая площадь × высота помещений (Экран 1/12).",
        "zakres": "Ваше здание."
      },
      "wymiany": {
        "nazwa": "Кратность воздухообмена в сутки [1/сутки]",
        "cel": "Сколько раз в сутки обменивается весь воздух дома.",
        "gdzie": "Тест герметичности (Экран 12, обмены в час × 24) или анемометр на решётках. При сильном ветре и морозе обменов больше.",
        "zakres": "Ваше здание — формулы тяги в приложении нет."
      },
      "tWew": {
        "nazwa": "Температура внутри [°C]",
        "cel": "Разница температур определяет потери.",
        "gdzie": "Температура, которую вы держите зимой.",
        "zakres": "Ваша настройка."
      },
      "tZewn": {
        "nazwa": "Средняя наружная температура [°C]",
        "cel": "Сутки, для которых считается.",
        "gdzie": "Климатические данные (Модуль 1) или средние по месяцам с Экрана 1.",
        "zakres": "Ваше местоположение."
      },
      "szczelny": {
        "nazwa": "Новый герметичный дом без механической вентиляции",
        "cel": "Предупреждение источника: в герметичном доме естественная вентиляция не обменяет воздух — риск плесени.",
        "gdzie": "Новые окна, мембраны, хороший результат теста герметичности.",
        "zakres": "Да / нет."
      },
      "pozostale": {
        "nazwa": "Прочие теплопотери здания [Вт]",
        "cel": "Из них считается доля вентиляции в общих потерях.",
        "gdzie": "Потери теплопередачей с Экрана 1 при тех же температурах (без вентиляции).",
        "zakres": "Пусто = без процентной доли."
      },
      "sprawnosc": {
        "nazwa": "КПД рекуператора для сравнения [%]",
        "cel": "Сколько потерь осталось бы при том же расходе с рекуперацией.",
        "gdzie": "Паспорт рекуператора (Экран 3).",
        "zakres": "0–100%. Пусто = без сравнения."
      },
      "dni": {
        "nazwa": "Число дней",
        "cel": "Умножает суточные потери на период (например, месяц).",
        "gdzie": "Дни периода с похожей средней температурой.",
        "zakres": "Пусто = только за сутки."
      }
    }
  },
  "gwc": {
    "migawka": {
      "oCoChodzi": "Грунт на глубине нескольких метров круглый год имеет постоянную температуру — ГТО позволяет «позаимствовать» её для подогрева или охлаждения воздуха.",
      "jakDziala": "Введите расход воздуха, на сколько градусов ГТО подогревает воздух зимой и сколько часов в сутки работает. Приложение посчитает мощность и тепло за сутки; после рекуператора в доме остаётся лишь часть выигрыша. С потребностью — доля, с COP — меньше электроэнергии.",
      "poCo": "Вы знаете, что реально даёт ГТО в вашей системе — особенно после рекуператора, где выигрыш намного меньше, чем кажется по приросту температуры.",
      "fizyka": "Φ = V̇·ρ·cp·ΔT (ρ = 1,2 кг/м³, cp = 1005 Дж/(кг·К) — как на Экранах 3 и 12); Q = Φ·(1 − η)·h. Пример источника «+4 °C → −5%» не даёт расхода и потребности — сам по себе не воспроизводим."
    },
    "pola": {
      "strumien": {
        "nazwa": "Расход воздуха через ГТО [м³/ч]",
        "cel": "Сколько воздуха подогревает грунт.",
        "gdzie": "Настройка вентустановки (Экран 3).",
        "zakres": "Ваша установка."
      },
      "przyrost": {
        "nazwa": "Прирост температуры воздуха зимой [K]",
        "cel": "На сколько градусов воздух после ГТО теплее наружного.",
        "gdzie": "Данные производителя ГТО для вашей длины и глубины или термометр до и после теплообменника в морозный день.",
        "zakres": "Паспорт или ваше измерение — модели грунта в приложении нет."
      },
      "godziny": {
        "nazwa": "Часы работы ГТО в сутки [ч]",
        "cel": "Переводит мощность в тепло за сутки.",
        "gdzie": "Управление заслонкой ГТО (например, только ниже заданной температуры).",
        "zakres": "0–24."
      },
      "rekuperator": {
        "nazwa": "КПД рекуператора после ГТО [%]",
        "cel": "После рекуператора в доме остаётся лишь (1 − КПД) выигрыша ГТО.",
        "gdzie": "Паспорт рекуператора.",
        "zakres": "0–100%. Пусто = без рекуператора."
      },
      "zapotrzebowanie": {
        "nazwa": "Суточная потребность в тепле [кВт·ч]",
        "cel": "Из неё считается доля ГТО.",
        "gdzie": "Экран 1 или 2 при той же наружной температуре.",
        "zakres": "Пусто = без доли."
      },
      "cop": {
        "nazwa": "COP отопления",
        "cel": "Переводит сэкономленное тепло в сэкономленную электроэнергию.",
        "gdzie": "1 = ТЭН; тепловой насос — паспорт (Экран 5).",
        "zakres": "≥ 1. Пусто = без электроэнергии."
      }
    }
  },
  "wplyw-czynnika": {
    "migawka": {
      "oCoChodzi": "Один экран для многих вопросов «а что, если…»: заменю окна, утеплю крышу, понижу температуру подачи, добавлю буфер. Каждый фактор показывает одно конкретное число — сколько кВт, кВт·ч или пусков компрессора он меняет.",
      "jakDziala": "Выберите фактор, введите текущее и сравниваемое состояние. Приложение считает по формуле этого фактора — тем же, что на экранах Части 1 (потери ограждения, инфильтрация, вентиляция, утепление), — и, если указать потребность дома и мощность насоса, проверяет, хватает ли насоса.",
      "poCo": "Насос подбирают под здание со всеми его недостатками — но сначала стоит знать, какие из них исправить: это дешевле, чем больший насос и больший инвертор в автономной системе.",
      "fizyka": "Мощность потерь: Φ = U·A·ΔT, Φ = n·V·ρ·cp·ΔT/3600, U' = 1/(1/U + d/λ). Электричество: E = Q/COP. Расход: V̇ = P/(cw·ΔT). Буфер: цикл = C·ΔT_h/(P − L) + C·ΔT_h/L, C = V·cw. Солнечные поступления снижают потребление за сезон, а не расчётную мощность."
    },
    "pola": {
      "czynnik": {
        "nazwa": "Фактор, влияющий на тепловой насос",
        "cel": "У каждого фактора свои поля и своя формула; введённые значения сохраняются при смене фактора (одно и то же поле значит одно и то же).",
        "gdzie": "Выберите то, что хотите изменить или проверить в своём доме.",
        "zakres": "18 факторов из Части 2D источника; 7 позиций без формулы в источнике не считаются (список под результатом)."
      },
      "dTK": {
        "nazwa": "Разница температур внутри и снаружи в расчётный день [К]",
        "cel": "Умножает коэффициент потерь — получается мощность в кВт, как на Экране 1.",
        "gdzie": "Экран 1 (внутренняя температура минус расчётная наружная для вашей климатической зоны).",
        "zakres": "Ваша климатическая зона и температура в доме."
      },
      "zapotrzebowanieKw": {
        "nazwa": "Потребность дома в мощности отопления [кВт]",
        "cel": "Необязательно: показывает, как меняется вся потребность и на сколько процентов. Введите текущее состояние («до»).",
        "gdzie": "Экран 1 (теплопотери) или Экран 2.",
        "zakres": "Результат вашего Экрана 1."
      },
      "mocPompyKw": {
        "nazwa": "Тепловая мощность насоса [кВт]",
        "cel": "Для проверки, покрывает ли насос потребность; для расхода, буфера и ограничения — мощность, которую отдаёт насос.",
        "gdzie": "Паспорт насоса (мощность в рабочей точке, например A-7/W35).",
        "zakres": "Из паспорта или вашего измерения — приложение не подставляет значений."
      },
      "powierzchniaM2": {
        "nazwa": "Площадь ограждения [м²]",
        "cel": "Умножает U — больше площадь, больше потери.",
        "gdzie": "Проект здания или замер (окна: только площадь окон; крыша/пол: утепляемая площадь).",
        "zakres": "Ваше здание."
      },
      "uPrzed": {
        "nazwa": "Коэффициент теплопередачи U сейчас [Вт/(м²·К)]",
        "cel": "Потери через ограждение в текущем состоянии: U × A × ΔT.",
        "gdzie": "Экран 1 или паспорт окна / расчёт ограждения.",
        "zakres": "Экран 1 или паспорт производителя."
      },
      "uPo": {
        "nazwa": "U после изменения [Вт/(м²·К)]",
        "cel": "Потери после замены окон — сравниваются с текущим состоянием.",
        "gdzie": "Паспорт нового окна (Uw).",
        "zakres": "Паспорт нового окна."
      },
      "gruboscCm": {
        "nazwa": "Толщина добавляемого утеплителя [см]",
        "cel": "Слой добавляется последовательно к ограждению: U' = 1/(1/U + d/λ), как на Экране 10.",
        "gdzie": "Предложение подрядчика или ваш план.",
        "zakres": "Ваш вариант утепления."
      },
      "lambda": {
        "nazwa": "Теплопроводность утеплителя λ [Вт/(м·К)]",
        "cel": "Чем меньше λ, тем меньше тепла проходит через ту же толщину.",
        "gdzie": "Паспорт утеплителя (заявленная λ).",
        "zakres": "Паспорт материала."
      },
      "dTGruntK": {
        "nazwa": "Разница температур между помещением и грунтом под полом [К]",
        "cel": "Пол по грунту отдаёт тепло грунту, а не наружному воздуху — поэтому отдельная разница температур.",
        "gdzie": "Температура в доме минус температура грунта под полом (замер или данные Модуля 1).",
        "zakres": "Ваше местоположение — приложение не подставляет температуру грунта."
      },
      "hMostkowPrzedWK": {
        "nazwa": "Коэффициент потерь через мостики холода сейчас H_TB [Вт/К]",
        "cel": "Сумма Ψ·L всех мостиков; × ΔT даёт дополнительную мощность потерь.",
        "gdzie": "Экран 7 (мостики холода) — результат H_TB.",
        "zakres": "Результат вашего Экрана 7."
      },
      "hMostkowPoWK": {
        "nazwa": "H_TB после исправления [Вт/К]",
        "cel": "Мостики после утепления/исправления узлов; пусто = мостики полностью устранены.",
        "gdzie": "Экран 7, пересчитанный с исправленными узлами.",
        "zakres": "Результат Экрана 7 для варианта после исправления."
      },
      "kubaturaM3": {
        "nazwa": "Отапливаемый объём [м³]",
        "cel": "Вместе с кратностью воздухообмена даёт потери на инфильтрацию, как на Экране 12.",
        "gdzie": "Проект здания или площадь × высота.",
        "zakres": "Ваше здание."
      },
      "nPrzed": {
        "nazwa": "Кратность воздухообмена сейчас [1/ч]",
        "cel": "Вентиляционные потери: n × V × ρ × cp × ΔT / 3600. Для высоты помещений — воздухообмен, который остаётся после изменения высоты.",
        "gdzie": "Экран 12 (тест герметичности, пересчитанный на обычные условия).",
        "zakres": "Результат теста герметичности или Экрана 12."
      },
      "nPo": {
        "nazwa": "Кратность воздухообмена после герметизации [1/ч]",
        "cel": "Сравнение с текущим состоянием; пусто = без инфильтрации (как в примере источника).",
        "gdzie": "Цель герметизации или тест после работ.",
        "zakres": "Результат теста после герметизации."
      },
      "strumienM3H": {
        "nazwa": "Расход вентиляционного воздуха [м³/ч]",
        "cel": "Сколько воздуха меняется в час — потери = расход × ρ × cp × (1 − рекуперация) × ΔT.",
        "gdzie": "Проект вентиляции или Экран 3.",
        "zakres": "Проект вентиляции."
      },
      "etaPrzedPct": {
        "nazwa": "КПД рекуперации сейчас [%]",
        "cel": "0 = вентиляция без рекуперации (естественная или вытяжная).",
        "gdzie": "Паспорт рекуператора или 0, если его нет.",
        "zakres": "0–100% — паспорт рекуператора."
      },
      "etaPoPct": {
        "nazwa": "КПД рекуперации после изменения [%]",
        "cel": "Сравниваемый вариант, например новый рекуператор.",
        "gdzie": "Паспорт рекуператора.",
        "zakres": "0–100% — паспорт рекуператора."
      },
      "wentylatoryKwhDoba": {
        "nazwa": "Электричество вентиляторов рекуператора в сутки [кВт·ч]",
        "cel": "Источник: рекуперация снижает потери, но потребляет электричество — показано рядом с результатом, чтобы было видно и то, и другое.",
        "gdzie": "Мощность вентиляторов из паспорта × 24 ч или счётчик.",
        "zakres": "Из паспорта или вашего измерения — приложение не подставляет значений."
      },
      "powierzchniaPodlogiM2": {
        "nazwa": "Площадь отапливаемого пола [м²]",
        "cel": "Площадь × высота = объём, от которого зависят вентиляционные потери.",
        "gdzie": "Проект здания.",
        "zakres": "Ваше здание."
      },
      "obwodM": {
        "nazwa": "Периметр наружных стен [м]",
        "cel": "Периметр × высота = площадь стен, которая растёт с высотой помещений.",
        "gdzie": "Проект или замер по контуру.",
        "zakres": "Ваше здание."
      },
      "uScian": {
        "nazwa": "U наружных стен [Вт/(м²·К)]",
        "cel": "Потери через дополнительную площадь стен при более высоких помещениях.",
        "gdzie": "Экран 1.",
        "zakres": "Экран 1."
      },
      "hPrzedM": {
        "nazwa": "Высота помещений сейчас [м]",
        "cel": "Сравниваемое состояние.",
        "gdzie": "Проект или замер.",
        "zakres": "Ваше здание."
      },
      "hPoM": {
        "nazwa": "Сравниваемая высота [м]",
        "cel": "Например 3 м вместо 2,5 м (пример источника: объём +20%).",
        "gdzie": "Ваш вариант.",
        "zakres": "Ваш вариант."
      },
      "dlugoscRurM": {
        "nazwa": "Длина труб в неотапливаемом месте [м]",
        "cel": "Потери считаются только там, где трубы отдают тепло вне отапливаемой зоны (гараж, подвал, чердак).",
        "gdzie": "Замер на установке.",
        "zakres": "Ваша установка."
      },
      "psiPrzed": {
        "nazwa": "Линейные потери трубы сейчас [Вт/(м·К)]",
        "cel": "Сколько ватт отдаёт метр трубы на каждый градус разницы температур — тот же параметр, что на Экране 17 (циркуляция).",
        "gdzie": "Паспорт изоляции / таблица производителя труб для диаметра и изоляции.",
        "zakres": "Из паспорта или вашего измерения — приложение не подставляет значений."
      },
      "psiPo": {
        "nazwa": "Линейные потери трубы с изоляцией [Вт/(м·К)]",
        "cel": "Вариант с изоляцией; пусто = без потерь.",
        "gdzie": "Паспорт изоляции для выбранной толщины.",
        "zakres": "Из паспорта или вашего измерения — приложение не подставляет значений."
      },
      "tWodyC": {
        "nazwa": "Температура воды в трубах [°C]",
        "cel": "Разница с окружающей температурой задаёт потери.",
        "gdzie": "Уставка подачи насоса (Экран 5) или термометр.",
        "zakres": "Ваша установка."
      },
      "tOtoczeniaC": {
        "nazwa": "Температура вокруг труб [°C]",
        "cel": "Гараж, подвал или чердак зимой — чем холоднее, тем больше потери.",
        "gdzie": "Термометр в этом помещении.",
        "zakres": "Ваш замер."
      },
      "godzinyH": {
        "nazwa": "Часы протока горячей воды в сутки [ч]",
        "cel": "Трубы теряют тепло только пока по ним течёт тёплая вода.",
        "gdzie": "Счётчик работы насоса или контроллер.",
        "zakres": "0–24 ч."
      },
      "powierzchniaOkienM2": {
        "nazwa": "Площадь только стёкол [м²]",
        "cel": "Поступления считаются через стекло — без рамы.",
        "gdzie": "Паспорт окна (площадь остекления) или замер.",
        "zakres": "Ваши окна."
      },
      "g": {
        "nazwa": "Коэффициент пропускания солнечной энергии g [–]",
        "cel": "Какая часть энергии солнца проходит через стекло внутрь.",
        "gdzie": "Паспорт окна / стекла (g, например 0,5).",
        "zakres": "0–1 — паспорт стекла."
      },
      "napromieniowanieKwhM2": {
        "nazwa": "Облучённость плоскости окна за отопительный сезон [кВт·ч/м²]",
        "cel": "Сколько солнечной энергии падает на метр окна при его ориентации (юг много, север мало) — здесь учитывается ориентация здания.",
        "gdzie": "Модуль 1 (данные PVGIS для вертикальной плоскости с данным азимутом), суммированные за отопительные месяцы.",
        "zakres": "Данные PVGIS вашего местоположения."
      },
      "zacienieniePrzedPct": {
        "nazwa": "Затенение окна сейчас [%]",
        "cel": "Часть поступлений, которую забирает дерево, здание, навес.",
        "gdzie": "Анализ затенения (Модуль 1) или оценка.",
        "zakres": "0–100%."
      },
      "zacieniePoPct": {
        "nazwa": "Затенение после изменения [%]",
        "cel": "Например, после вырубки дерева — разница и есть возвращённые поступления.",
        "gdzie": "Ваш вариант.",
        "zakres": "0–100%."
      },
      "godzinySezonuH": {
        "nazwa": "Часы отопительного сезона [ч]",
        "cel": "Необязательно: энергия ÷ часы = средняя мощность, как источник переводит кВт·ч в кВт.",
        "gdzie": "Число дней сезона × 24 или данные Экрана 1.",
        "zakres": "Ваше местоположение."
      },
      "zyskiKwhDoba": {
        "nazwa": "Бытовые теплопоступления в сутки [кВт·ч]",
        "cel": "Тепло от людей, бытовой техники, освещения и готовки.",
        "gdzie": "Модуль 2 (баланс приборов — электричество в доме превращается в тепло) + люди.",
        "zakres": "Источник: в современном доме часто 2–3 кВт·ч/сутки."
      },
      "dniSezonu": {
        "nazwa": "Дни отопительного сезона",
        "cel": "Необязательно: поступления за весь сезон.",
        "gdzie": "Климатические данные (Модуль 1) или Экран 1.",
        "zakres": "Ваше местоположение."
      },
      "tPrzedC": {
        "nazwa": "Температура сейчас [°C]",
        "cel": "Температура подачи, источника или обратки — в зависимости от выбранного фактора.",
        "gdzie": "Уставка контроллера или термометр.",
        "zakres": "Ваша установка."
      },
      "tPoC": {
        "nazwa": "Температура после изменения [°C]",
        "cel": "Сравниваемый вариант.",
        "gdzie": "Ваш вариант.",
        "zakres": "Ваш вариант."
      },
      "copPrzed": {
        "nazwa": "COP при текущей температуре [–]",
        "cel": "Тепло ÷ электричество в текущей рабочей точке.",
        "gdzie": "Паспорт насоса (таблица COP по температурам) или Экран 5.",
        "zakres": "Паспорт насоса."
      },
      "copPo": {
        "nazwa": "COP после изменения температуры [–]",
        "cel": "Для температуры подачи можно оставить пустым — тогда диапазон по правилу источника 2–3% на °C.",
        "gdzie": "Паспорт насоса для новой рабочей точки.",
        "zakres": "Паспорт насоса."
      },
      "cieploSezonKwh": {
        "nazwa": "Тепло, нужное за сезон [кВт·ч]",
        "cel": "Необязательно: переводит изменение COP в кВт·ч электричества (электричество = тепло ÷ COP).",
        "gdzie": "Экран 2 (годовая потребность).",
        "zakres": "Результат вашего Экрана 2."
      },
      "defrostKwhDoba": {
        "nazwa": "Энергия оттайки в сутки [кВт·ч]",
        "cel": "Дополнительная энергия оттайки в день с обмерзанием.",
        "gdzie": "Экран 6 (циклы оттайки) — результат за сутки.",
        "zakres": "Результат вашего Экрана 6."
      },
      "dniSzronienia": {
        "nazwa": "Дни с обмерзанием за сезон",
        "cel": "Дни, когда насос оттаивает (влажно, температура в зоне обмерзания).",
        "gdzie": "Климатические данные (Модуль 1) или наблюдение прошлой зимы.",
        "zakres": "Ваше местоположение."
      },
      "zuzyciePompySezonKwh": {
        "nazwa": "Потребление насоса за сезон [кВт·ч]",
        "cel": "Необязательно: показывает долю оттайки во всём потреблении.",
        "gdzie": "Счётчик или Экран 2 ÷ SCOP.",
        "zakres": "Ваш счётчик."
      },
      "ograniczeniePct": {
        "nazwa": "Мощность после ограничения [% мощности]",
        "cel": "Тихий режим или ограничение мощности в контроллере — какую часть мощности насос может отдать.",
        "gdzie": "Инструкция насоса (тихий режим) или ваша уставка ограничения.",
        "zakres": "0–100% — инструкция насоса."
      },
      "copOgraniczony": {
        "nazwa": "COP при ограниченной мощности [–]",
        "cel": "Необязательно: при меньшей мощности COP бывает выше — это меняет расход электричества на то же тепло.",
        "gdzie": "Паспорт (COP при частичной нагрузке).",
        "zakres": "Паспорт насоса."
      },
      "mocFalownikaKw": {
        "nazwa": "Длительная мощность инвертора [кВт]",
        "cel": "Проверка, помещается ли потребление насоса (мощность ÷ COP) в инвертор.",
        "gdzie": "Табличка / паспорт инвертора (длительная, не пиковая мощность).",
        "zakres": "Паспорт инвертора."
      },
      "dTObieguK": {
        "nazwa": "Разница температур подача–обратка [К]",
        "cel": "Расход = мощность ÷ (теплоёмкость воды × ΔT).",
        "gdzie": "Проект системы или инструкция насоса (рекомендуемая ΔT).",
        "zakres": "Инструкция насоса."
      },
      "liczbaA": {
        "nazwa": "Число скважин в варианте A",
        "cel": "Общая длина = число × глубина.",
        "gdzie": "Предложение буровой компании.",
        "zakres": "Ваш вариант."
      },
      "glebokoscAM": {
        "nazwa": "Глубина скважины в варианте A [м]",
        "cel": "Более глубокая скважина — больше метров коллектора.",
        "gdzie": "Предложение буровой / проект.",
        "zakres": "Источник (5.42): обычно 50–100 м."
      },
      "liczbaB": {
        "nazwa": "Число скважин в варианте B",
        "cel": "Второй вариант для сравнения.",
        "gdzie": "Предложение буровой компании.",
        "zakres": "Ваш вариант."
      },
      "glebokoscBM": {
        "nazwa": "Глубина скважины в варианте B [м]",
        "cel": "Второй вариант для сравнения.",
        "gdzie": "Предложение буровой / проект.",
        "zakres": "Источник (5.42): обычно 50–100 м."
      },
      "cenaZlM": {
        "nazwa": "Цена метра бурения [зл/м]",
        "cel": "Стоимость = длина × цена; источник считает, что стоимость растёт линейно с длиной.",
        "gdzie": "Предложение буровой компании.",
        "zakres": "Предложение подрядчика."
      },
      "wNaM": {
        "nazwa": "Мощность насоса на метр скважины [Вт/м]",
        "cel": "Тот же показатель, что на экране грунтового коллектора, — зависит от грунта.",
        "gdzie": "Проект / исследование грунта (тест TRT) или диапазон источника.",
        "zakres": "Источник (5.42): около 50–70 Вт/м."
      },
      "obciazenieKw": {
        "nazwa": "Нагрузка — тепло, нужное сейчас [кВт]",
        "cel": "При нагрузке меньше мощности насоса компрессор греет, выключается и снова запускается.",
        "gdzie": "Экран 1 для данной наружной температуры.",
        "zakres": "Результат вашего Экрана 1."
      },
      "wodaInstalacjiL": {
        "nazwa": "Вода в системе без буфера [л]",
        "cel": "Эта вода — «буфер», который у насоса есть без бака.",
        "gdzie": "Проект системы (объём труб и радиаторов/контуров) или при заполнении.",
        "zakres": "Ваша установка."
      },
      "buforL": {
        "nazwa": "Объём буфера [л]",
        "cel": "Добавляется к воде в системе — больше воды, длиннее циклы и меньше пусков.",
        "gdzie": "Паспорт буфера (Экран 14).",
        "zakres": "Паспорт буфера."
      },
      "histerezaK": {
        "nazwa": "Гистерезис термостата [К]",
        "cel": "На сколько остывает вода, прежде чем насос снова запустится.",
        "gdzie": "Уставка контроллера насоса.",
        "zakres": "Инструкция контроллера."
      }
    }
  },
}
