/**
 * Help („?” + „i”) of the Module 6 screens built on 01.10.2026 (E13, E16–E20, 5.42, 2A). A separate file
 * from `m06-ogrzewanie.ts` only to keep parallel sessions from editing the same file; same shape.
 */
import type { Tlumaczenie } from "./typy"

const KARTA = "Karta katalogowa urządzenia — aplikacja nie przyjmuje typowej wartości za Ciebie."
const OPCJA = "Puste = nie liczymy tej części."

export const pl = {
  "dystrybucja-ciepla": {
    migawka: {
      oCoChodzi:
        "To jak wybór butów — do biegania inne, do wspinaczki inne. Do pompy ciepła pasuje podłogówka albo duże grzejniki niskotemperaturowe, nie małe grzejniki „na wysoką temperaturę”.",
      jakDziala:
        "Wybierz źródło ciepła i system. Przy pompie ciepła wpisz z jej karty COP przy temperaturze zasilania Twojego systemu i przy temperaturze grzejników standardowych — aplikacja policzy, o ile mniej prądu zużyje pompa, a z zapotrzebowaniem i ceną prądu — oszczędność w zł i zwrot dopłaty.",
      poCo:
        "Im niższa temperatura zasilania, tym wyższy COP pompy. Zwykłe grzejniki wymagają wysokiej temperatury i potrafią zjeść dużą część zysku z pompy ciepła.",
      fizyka:
        "E = Q ÷ COP. Oszczędność = 1 − COP_odn ÷ COP_sys. Przykład źródła: COP 4,5 przy 35 °C zamiast 3,2 przy 55 °C → 1 − 3,2/4,5 ≈ 29% (źródło podaje 28%). Wielkości grzejnika przy niższej temperaturze ani projektu pętli podłogówki aplikacja nie liczy — wymagają norm PN-EN 442 i PN-EN 1264, których nie ma w aplikacji.",
    },
    pola: {
      zrodlo: {
        nazwa: "Źródło ciepła",
        cel: "Porównanie COP i ostrzeżenie o zwykłych grzejnikach dotyczą pompy ciepła.",
        gdzie: "Twoja instalacja.",
        zakres: "Pompa ciepła albo inne (kocioł, kominek).",
      },
      system: {
        nazwa: "System dystrybucji ciepła",
        cel: "Określa temperaturę zasilania: podłogówka ok. 30–35 °C, grzejniki niskotemperaturowe 45/35/20, standardowe 75/65/20 (dane źródła).",
        gdzie: "Projekt instalacji albo to, co masz w domu.",
        zakres: "Jeden z trzech.",
      },
      copSystemu: {
        nazwa: "COP pompy przy temperaturze zasilania wybranego systemu",
        cel: "Ile kWh ciepła daje 1 kWh prądu przy niższej temperaturze zasilania.",
        gdzie: KARTA + " Odczytaj przy tej samej temperaturze zewnętrznej co drugi COP.",
        zakres: "≥ 1. " + OPCJA,
      },
      copOdniesienia: {
        nazwa: "COP pompy przy temperaturze zasilania grzejników standardowych",
        cel: "Punkt odniesienia — to samo urządzenie przy wysokiej temperaturze zasilania.",
        gdzie: KARTA,
        zakres: "≥ 1. " + OPCJA,
      },
      cieplo: {
        nazwa: "Roczne zapotrzebowanie na ciepło do ogrzewania [kWh/rok]",
        cel: "Zamienia procent oszczędności na kWh prądu w roku.",
        gdzie: "Ekran 2 Modułu 6 (zapotrzebowanie na C.O.) albo audyt energetyczny.",
        zakres: OPCJA,
      },
      doplata: {
        nazwa: "Dopłata za wybrany system [zł]",
        cel: "Różnica kosztu względem grzejników standardowych — do policzenia zwrotu.",
        gdzie: "Oferty instalatorów, ceny grzejników.",
        zakres: OPCJA,
      },
      cena: {
        nazwa: "Cena prądu [zł/kWh]",
        cel: "Zamienia kWh oszczędności na złotówki.",
        gdzie: "Rachunek za prąd albo koszt kWh z Twojego systemu off-grid.",
        zakres: OPCJA,
      },
    },
  },
  "sterowanie-strefowe": {
    "migawka": {
      "oCoChodzi": "Po co grzać puste pokoje? Sterowanie strefowe to jak oświetlenie tylko tam, gdzie akurat jesteś.",
      "jakDziala": "Podziel dom na strefy (np. salon, sypialnie, łazienka). Dla każdej wpisz jej część strat ciepła H, temperaturę komfortową i — jeśli ją obniżasz — temperaturę obniżoną i liczbę godzin. Aplikacja porówna ciepło z grzaniem całego domu do komfortu i policzy, ile prądu zużyją siłowniki i sterowniki (źródło: 1–5 W każdy).",
      "poCo": "Zysk ze stref może być spory, ale w off-gridzie każdy wat ciągłego poboru się liczy — przy wielu siłownikach i małym zysku sterowanie potrafi kosztować więcej prądu, niż oszczędza.",
      "fizyka": "Q = H·(θ − θe)·t dla każdej strefy — ta sama fizyka co Ekran 1, w stanie ustalonym (górne oszacowanie zysku). Prąd sterowania = n·P·h + P_sterownika·24. Oszczędność prądu ogrzewania = ciepło ÷ COP. „18%” ze źródła to przykład, nie stała."
    },
    "pola": {
      "nazwa": {
        "nazwa": "Nazwa strefy",
        "cel": "Tylko opis — nie wpływa na wynik.",
        "gdzie": "Dowolna.",
        "zakres": "Tekst."
      },
      "h": {
        "nazwa": "Współczynnik strat ciepła strefy H [W/K]",
        "cel": "Ile watów traci strefa na każdy stopień różnicy temperatur.",
        "gdzie": "Ekran 1 Modułu 6 — straty przegród i wentylacji tej części domu; suma H stref = H budynku.",
        "zakres": "Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie."
      },
      "komfort": {
        "nazwa": "Temperatura komfortowa [°C]",
        "cel": "Temperatura strefy, gdy jest używana.",
        "gdzie": "Ustawienie termostatu.",
        "zakres": "Twoje ustawienie."
      },
      "obnizona": {
        "nazwa": "Temperatura obniżona [°C]",
        "cel": "Temperatura strefy, gdy nikt jej nie używa.",
        "gdzie": "Ustawienie termostatu w trybie obniżonym.",
        "zakres": "Nie wyższa niż komfortowa. Puste = strefa bez obniżenia."
      },
      "godzin": {
        "nazwa": "Czas obniżenia [h/dobę]",
        "cel": "Przez ile godzin doby strefa ma temperaturę obniżoną.",
        "gdzie": "Twój plan dnia (np. sypialnia w dzień, salon w nocy).",
        "zakres": "0–24 h."
      },
      "tZewn": {
        "nazwa": "Średnia temperatura zewnętrzna [°C]",
        "cel": "Doba, dla której liczysz zysk (np. typowa doba zimowa).",
        "gdzie": "Dane klimatyczne lokalizacji (Moduł 1) albo średnia miesiąca z Ekranu 1.",
        "zakres": "Twoja lokalizacja."
      },
      "liczbaSilownikow": {
        "nazwa": "Liczba siłowników",
        "cel": "Każdy siłownik pobiera prąd przez czas zasilania.",
        "gdzie": "Projekt instalacji — zwykle jeden na pętlę/grzejnik sterowany.",
        "zakres": "Sztuki."
      },
      "mocSilownika": {
        "nazwa": "Pobór jednego siłownika [W]",
        "cel": "Pobór prądu siłownika w czasie zasilania.",
        "gdzie": "Karta siłownika.",
        "zakres": "Źródło: 1–5 W każdy — wpisz wartość z karty."
      },
      "godzinSilownikow": {
        "nazwa": "Zasilanie siłowników [h/dobę]",
        "cel": "Ile godzin na dobę siłowniki pobierają prąd.",
        "gdzie": "Typ siłownika (termiczny NC pobiera prąd, gdy zawór jest otwarty) i Twój plan.",
        "zakres": "0–24 h."
      },
      "mocSterownikow": {
        "nazwa": "Sterownik i termostaty — pobór łączny [W]",
        "cel": "Urządzenia zasilane całą dobę.",
        "gdzie": "Karty sterownika strefowego i termostatów (źródło: 1–5 W każde).",
        "zakres": "Suma z kart."
      },
      "cop": {
        "nazwa": "COP ogrzewania",
        "cel": "Zamienia zaoszczędzone ciepło na zaoszczędzony prąd, żeby porównać z poborem siłowników.",
        "gdzie": "1 = grzałka/kocioł elektryczny; pompa ciepła — karta (Ekran 5).",
        "zakres": "≥ 1. Puste = ogrzewanie nieelektryczne (paliwo) — bez bilansu prądu."
      }
    }
  },
  "zasobnik-cwu": {
    "migawka": {
      "oCoChodzi": "Bojler to termos — dobry trzyma ciepło, zły wypuszcza je do garażu. A cyrkulacja to luksus natychmiastowej ciepłej wody w kranie, który kosztuje energię non stop, jeśli nie jest sterowany rozsądnie.",
      "jakDziala": "Wpisz domowników i temperatury wody — aplikacja policzy ciepło na podgrzanie wody. Ze straty UA z karty zasobnika i temperatury otoczenia — stratę postojową (możesz porównać z innym zasobnikiem). Dla cyrkulacji wpisz długość rur, stratę liniową, godziny pracy i moc pompy — zobaczysz koszt Twojego trybu i trybu ciągłego.",
      "poCo": "Straty postojowe i cyrkulacja potrafią zjeść dużą część energii na ciepłą wodę — w off-gridzie to prąd z baterii albo pompy ciepła, codziennie.",
      "fizyka": "Q_woda = n·V·ΔT·c (c = 4186 J/(kg·K)). Q_postój = UA·(θ_cwu − θ_ot)·24 h. Q_cyrk = q·L·(θ_cwu − θ_rur)·h, prąd pompy = P·h. Przykład źródła „0,8 W/K → 1,2 kWh/dobę” odpowiada ΔT = 62,5 K; „0,5 W/K → 0,7” i „180 kWh/rok” nie bilansują się przy jednej ΔT (wychodzi 0,75 i ok. 164 kWh/rok)."
    },
    "pola": {
      "osoby": {
        "nazwa": "Liczba domowników",
        "cel": "Mnożnik dobowego zużycia ciepłej wody.",
        "gdzie": "Twój dom (Moduł 2, Ekran 4).",
        "zakres": "Osoby."
      },
      "litrow": {
        "nazwa": "Zużycie C.W.U. na osobę [l/os./dobę]",
        "cel": "Dobowe zużycie ciepłej wody na osobę.",
        "gdzie": "Wartość startowa 50 l ze źródła (Ekran 2); Moduł 2 podaje 50–70 l. Zmień, jeśli znasz swoje zużycie.",
        "zakres": "Źródło: ok. 50 l/os./dobę."
      },
      "tZimna": {
        "nazwa": "Temperatura zimnej wody [°C]",
        "cel": "Od tej temperatury woda jest podgrzewana.",
        "gdzie": "Pomiar na wejściu do zasobnika (studnia, wodociąg).",
        "zakres": "Twoja instalacja."
      },
      "tCwu": {
        "nazwa": "Temperatura C.W.U. w zasobniku [°C]",
        "cel": "Do tej temperatury woda jest podgrzewana i z nią liczona strata postojowa.",
        "gdzie": "Nastawa termostatu zasobnika.",
        "zakres": "Wyższa niż zimna woda."
      },
      "pojemnosc": {
        "nazwa": "Pojemność zasobnika [l]",
        "cel": "Porównanie z dobowym zużyciem — za mały zasobnik nie pokryje doby.",
        "gdzie": "Tabliczka zasobnika.",
        "zakres": "Źródło: np. 200 l dla 4 osób."
      },
      "ua": {
        "nazwa": "Strata postojowa zasobnika UA [W/K]",
        "cel": "Ile watów traci zasobnik na każdy stopień różnicy między wodą a otoczeniem.",
        "gdzie": "Karta zasobnika (strata postojowa); gdy karta podaje stratę w W przy danej różnicy temperatur, podziel ją przez tę różnicę.",
        "zakres": "Karta katalogowa urządzenia — aplikacja nie przyjmuje typowej wartości za Ciebie."
      },
      "uaPorownawczy": {
        "nazwa": "UA innego zasobnika [W/K]",
        "cel": "Porównanie z lepszym (albo starszym) modelem — różnica w kWh/rok.",
        "gdzie": "Karta porównywanego zasobnika.",
        "zakres": "Puste = bez porównania."
      },
      "tOtoczenia": {
        "nazwa": "Temperatura otoczenia zasobnika [°C]",
        "cel": "Im zimniej wokół zasobnika, tym większa strata.",
        "gdzie": "Temperatura pomieszczenia, w którym stoi zasobnik (zimą).",
        "zakres": "Twoja instalacja."
      },
      "nieogrzewane": {
        "nazwa": "Pomieszczenie nieogrzewane",
        "cel": "Ostrzeżenie źródła: zasobnik w nieogrzewanym garażu traci znacznie więcej.",
        "gdzie": "Gdzie stoi Twój zasobnik.",
        "zakres": "Tak / nie."
      },
      "dlugosc": {
        "nazwa": "Długość rur cyrkulacji [m]",
        "cel": "Długość pętli, w której krąży ciepła woda.",
        "gdzie": "Projekt instalacji albo pomiar.",
        "zakres": "Puste = bez cyrkulacji."
      },
      "strataRury": {
        "nazwa": "Strata liniowa izolowanej rury [W/(m·K)]",
        "cel": "Ile watów traci metr rury na stopień różnicy temperatur.",
        "gdzie": "Karta otuliny / producenta rur dla Twojej średnicy.",
        "zakres": "Karta katalogowa — aplikacja nie przyjmuje typowej wartości za Ciebie."
      },
      "tRur": {
        "nazwa": "Temperatura otoczenia rur [°C]",
        "cel": "Temperatura wokół rur cyrkulacji.",
        "gdzie": "Gdzie biegną rury (bruzda w ogrzewanej ścianie, nieogrzewany strych...).",
        "zakres": "Twoja instalacja."
      },
      "godzin": {
        "nazwa": "Praca cyrkulacji [h/dobę]",
        "cel": "Ile godzin na dobę pompa utrzymuje ciepłą wodę w rurach.",
        "gdzie": "Ustawienie: ciągła = 24 h, czasowa (np. rano i wieczorem), na żądanie (czujnik przepływu / przycisk).",
        "zakres": "0–24 h."
      },
      "mocPompy": {
        "nazwa": "Moc pompy cyrkulacyjnej [W]",
        "cel": "Prąd zużywany przez pompę w godzinach pracy.",
        "gdzie": "Tabliczka / karta pompy (Ekran 15).",
        "zakres": "Karta katalogowa urządzenia."
      }
    }
  },
  "grzalka-cwu": {
    "migawka": {
      "oCoChodzi": "Grzałka elektryczna to prosty i tani sposób na ciepłą wodę, ale bardzo „głodny” — latem grzanie z nadwyżki PV jest praktycznie darmowe, zimą lepiej dogrzewać pompą ciepła, bo grzałka szybko wyczerpuje baterię.",
      "jakDziala": "Wpisz pojemność zasobnika, temperatury i moc grzałki — aplikacja policzy energię i czas grzania. Z nadwyżką PV i sposobem sterowania pokaże, ile energii da słońce, a ile bateria; z mocą falownika — czy ją udźwignie.",
      "poCo": "Grzałka to jeden z największych odbiorników w domu off-grid. Źle zaplanowana grzeje z baterii albo przeciąża falownik.",
      "fizyka": "Q = V·ΔT·c (c = 4186 J/(kg·K)), t = Q / P. Stała moc: grzałka pobiera P niezależnie od słońca, brak z PV pokrywa bateria. Regulator PV: P_ef = min(P, P_PV), grzeje dłużej, 0 z baterii. Przykład źródła: 2 kW, 200 l, 10 → 50 °C → 9,3 kWh i 4,65 h (źródło: 9,2 kWh, 4,6 h). „Przy PV 3 kW — 3 h” nie zgadza się: grzałka 2 kW nie pobierze 3 kW."
    },
    "pola": {
      "pojemnosc": {
        "nazwa": "Pojemność zasobnika [l]",
        "cel": "Ile wody grzałka musi podgrzać.",
        "gdzie": "Tabliczka zasobnika (Ekran 17).",
        "zakres": "Twoja instalacja."
      },
      "tStart": {
        "nazwa": "Temperatura wody na starcie [°C]",
        "cel": "Od tej temperatury liczona jest energia.",
        "gdzie": "Zimna woda (np. 10 °C) albo temperatura po nocnym zużyciu.",
        "zakres": "Twoja instalacja."
      },
      "tKoniec": {
        "nazwa": "Temperatura docelowa [°C]",
        "cel": "Do tej temperatury grzałka podgrzewa wodę.",
        "gdzie": "Nastawa termostatu grzałki.",
        "zakres": "Wyższa niż startowa."
      },
      "moc": {
        "nazwa": "Moc grzałki [kW]",
        "cel": "Wyznacza czas grzania i obciążenie falownika.",
        "gdzie": "Tabliczka grzałki.",
        "zakres": "Karta katalogowa urządzenia."
      },
      "mocPv": {
        "nazwa": "Nadwyżka PV w czasie grzania [kW]",
        "cel": "Moc z paneli, która zostaje po zasileniu reszty domu.",
        "gdzie": "Moduł 3 (produkcja PV) albo odczyt z falownika w słoneczne południe.",
        "zakres": "Puste = nie liczymy udziału PV."
      },
      "sterowanie": {
        "nazwa": "Sterowanie grzałką",
        "cel": "Stała moc grzeje pełną mocą (brak z PV bierze z baterii); regulator nadwyżki dopasowuje moc do słońca.",
        "gdzie": "Twoja instalacja — termostat albo sterownik nadwyżki PV.",
        "zakres": "Potrzebne tylko z nadwyżką PV."
      },
      "falownik": {
        "nazwa": "Moc ciągła falownika [kW]",
        "cel": "Sprawdzenie, czy falownik udźwignie grzałkę.",
        "gdzie": "Karta falownika (moc znamionowa ciągła, nie szczytowa).",
        "zakres": "Puste = bez sprawdzenia."
      }
    }
  },
  "oslony-przeciwsloneczne": {
    "migawka": {
      "oCoChodzi": "Słońce latem to wróg (przegrzanie), zimą przyjaciel (darmowe ogrzewanie) — dobra osłona musi to rozróżniać, a nie blokować słońce przez cały rok jednakowo.",
      "jakDziala": "Wpisz szerokość geograficzną (albo zostaw puste — weźmiemy ją z lokalizacji projektu), wysięg okapu, odstęp okapu nad oknem i wysokość okna. Aplikacja policzy wysokość słońca w południe w najdłuższy i najkrótszy dzień roku i jaka część okna będzie wtedy w cieniu.",
      "poCo": "Dobrze dobrany okap zasłania okno południowe latem, a zimą wpuszcza słońce, które grzeje dom za darmo. Za długi okap zabiera zimowe zyski, za krótki nie chroni przed przegrzaniem.",
      "fizyka": "Wysokość słońca w południe: h = 90° − φ ± 23,45° (przesilenie letnie +, zimowe −). Cień okapu o wysięgu P sięga P·tg h poniżej okapu; zacieniona część okna = (P·tg h − odstęp) ÷ wysokość okna, w granicach 0–100%. Zysków w kWh aplikacja nie liczy (potrzebna norma ze współczynnikami osłon i model okien — odłożony)."
    },
    "pola": {
      "szerokosc": {
        "nazwa": "Szerokość geograficzna [°N]",
        "cel": "Wyznacza wysokość słońca latem i zimą.",
        "gdzie": "Lokalizacja projektu (Moduł 1) albo mapa. Puste = z lokalizacji projektu.",
        "zakres": "Model: ok. 23,5–66,5°N (Polska 49–55°N)."
      },
      "wysieg": {
        "nazwa": "Wysięg okapu [m]",
        "cel": "Jak daleko okap (balkon, daszek, pergola) wystaje przed ścianę.",
        "gdzie": "Pomiar albo projekt.",
        "zakres": "Twój budynek."
      },
      "odstep": {
        "nazwa": "Odstęp okapu nad oknem [m]",
        "cel": "Od spodu okapu do górnej krawędzi przeszklenia — cień musi go najpierw „przejść”.",
        "gdzie": "Pomiar albo projekt.",
        "zakres": "0 = okap tuż nad oknem."
      },
      "wysokosc": {
        "nazwa": "Wysokość okna [m]",
        "cel": "Wysokość przeszklenia, które ma być zacienione.",
        "gdzie": "Pomiar albo zestawienie stolarki.",
        "zakres": "Twój budynek."
      }
    }
  },
}

const EN_SHEET = "The device datasheet — the app never assumes a typical value for you."
const EN_OPT = "Empty = this part is not calculated."

export const en: Tlumaczenie<typeof pl> = {
  "dystrybucja-ciepla": {
    migawka: {
      oCoChodzi:
        "It is like choosing shoes — different for running, different for climbing. A heat pump suits underfloor heating or large low-temperature radiators, not small “high-temperature” radiators.",
      jakDziala:
        "Choose the heat source and the system. With a heat pump, enter from its datasheet the COP at your system's supply temperature and at the standard radiators' temperature — the app shows how much less electricity the pump uses, and with the demand and price, the saving in PLN and the payback of the extra cost.",
      poCo:
        "The lower the supply temperature, the higher the pump's COP. Ordinary radiators need a high temperature and can eat a large part of the heat pump's gain.",
      fizyka:
        "E = Q ÷ COP. Saving = 1 − COP_ref ÷ COP_sys. Source example: COP 4.5 at 35 °C instead of 3.2 at 55 °C → 1 − 3.2/4.5 ≈ 29% (the source says 28%). The app does not size radiators at a lower temperature nor design floor loops — that needs PN-EN 442 and PN-EN 1264, which the app does not have.",
    },
    pola: {
      zrodlo: {
        nazwa: "Heat source",
        cel: "The COP comparison and the warning about ordinary radiators apply to a heat pump.",
        gdzie: "Your installation.",
        zakres: "Heat pump or other (boiler, stove).",
      },
      system: {
        nazwa: "Heat distribution system",
        cel: "Sets the supply temperature: underfloor approx. 30–35 °C, low-temperature radiators 45/35/20, standard 75/65/20 (source data).",
        gdzie: "Installation design or what you have at home.",
        zakres: "One of three.",
      },
      copSystemu: {
        nazwa: "Pump COP at the chosen system's supply temperature",
        cel: "How many kWh of heat 1 kWh of electricity gives at the lower supply temperature.",
        gdzie: EN_SHEET + " Read it at the same outdoor temperature as the other COP.",
        zakres: "≥ 1. " + EN_OPT,
      },
      copOdniesienia: {
        nazwa: "Pump COP at the standard radiators' supply temperature",
        cel: "The reference — the same unit at a high supply temperature.",
        gdzie: EN_SHEET,
        zakres: "≥ 1. " + EN_OPT,
      },
      cieplo: {
        nazwa: "Annual space heating demand [kWh/year]",
        cel: "Turns the percentage saving into kWh of electricity per year.",
        gdzie: "Module 6 Screen 2 (space heating demand) or an energy audit.",
        zakres: EN_OPT,
      },
      doplata: {
        nazwa: "Extra cost of the chosen system [PLN]",
        cel: "Cost difference against standard radiators — for the payback.",
        gdzie: "Installer quotes, radiator prices.",
        zakres: EN_OPT,
      },
      cena: {
        nazwa: "Electricity price [PLN/kWh]",
        cel: "Turns the kWh saved into money.",
        gdzie: "Your electricity bill or the cost of a kWh from your off-grid system.",
        zakres: EN_OPT,
      },
    },
  },
  "sterowanie-strefowe": {
    "migawka": {
      "oCoChodzi": "Why heat empty rooms? Zone control is like lighting only where you are.",
      "jakDziala": "Split the house into zones (e.g. living room, bedrooms, bathroom). For each enter its share of heat loss H, the comfort temperature and — if you lower it — the setback temperature and hours. The app compares the heat with heating the whole house to comfort and counts the electricity of actuators and controllers (source: 1–5 W each).",
      "poCo": "The zoning gain can be large, but off-grid every watt of continuous draw counts — with many actuators and a small gain the control can cost more electricity than it saves.",
      "fizyka": "Q = H·(θ − θe)·t for each zone — the same physics as Screen 1, in steady state (upper estimate of the gain). Control electricity = n·P·h + P_controller·24. Heating electricity saved = heat ÷ COP. The source's “18%” is an example, not a constant."
    },
    "pola": {
      "nazwa": {
        "nazwa": "Zone name",
        "cel": "Only a description — does not affect the result.",
        "gdzie": "Anything.",
        "zakres": "Text."
      },
      "h": {
        "nazwa": "Zone heat loss coefficient H [W/K]",
        "cel": "How many watts the zone loses per degree of temperature difference.",
        "gdzie": "Module 6 Screen 1 — fabric and ventilation losses of this part of the house; the zones' H add up to the building's H.",
        "zakres": "Your installation — the app never assumes a typical value for you."
      },
      "komfort": {
        "nazwa": "Comfort temperature [°C]",
        "cel": "Zone temperature when in use.",
        "gdzie": "Thermostat setting.",
        "zakres": "Your setting."
      },
      "obnizona": {
        "nazwa": "Setback temperature [°C]",
        "cel": "Zone temperature when nobody uses it.",
        "gdzie": "Thermostat setback setting.",
        "zakres": "Not higher than comfort. Empty = no setback."
      },
      "godzin": {
        "nazwa": "Setback time [h/day]",
        "cel": "How many hours a day the zone is at the setback temperature.",
        "gdzie": "Your daily plan (e.g. bedroom by day, living room at night).",
        "zakres": "0–24 h."
      },
      "tZewn": {
        "nazwa": "Mean outdoor temperature [°C]",
        "cel": "The day you compute the gain for (e.g. a typical winter day).",
        "gdzie": "Climate data of the location (Module 1) or the month mean from Screen 1.",
        "zakres": "Your location."
      },
      "liczbaSilownikow": {
        "nazwa": "Number of actuators",
        "cel": "Each actuator draws power while powered.",
        "gdzie": "Installation design — usually one per controlled loop/radiator.",
        "zakres": "Pieces."
      },
      "mocSilownika": {
        "nazwa": "Power of one actuator [W]",
        "cel": "Actuator draw while powered.",
        "gdzie": "Actuator datasheet.",
        "zakres": "Source: 1–5 W each — enter the datasheet value."
      },
      "godzinSilownikow": {
        "nazwa": "Actuators powered [h/day]",
        "cel": "How many hours a day the actuators draw power.",
        "gdzie": "Actuator type (a thermal NC actuator draws power while the valve is open) and your plan.",
        "zakres": "0–24 h."
      },
      "mocSterownikow": {
        "nazwa": "Controller and thermostats — total power [W]",
        "cel": "Devices powered all day.",
        "gdzie": "Datasheets of the zone controller and thermostats (source: 1–5 W each).",
        "zakres": "Sum from the datasheets."
      },
      "cop": {
        "nazwa": "Heating COP",
        "cel": "Turns the heat saved into electricity saved, to compare with the actuators' draw.",
        "gdzie": "1 = electric heater/boiler; heat pump — datasheet (Screen 5).",
        "zakres": "≥ 1. Empty = non-electric heating (fuel) — no electricity balance."
      }
    }
  },
  "zasobnik-cwu": {
    "migawka": {
      "oCoChodzi": "A water tank is a thermos — a good one keeps the heat, a bad one lets it out into the garage. Circulation is the luxury of instant hot water at the tap, and it costs energy non-stop if not controlled sensibly.",
      "jakDziala": "Enter the household and the water temperatures — the app computes the heat to warm the water. From the UA loss on the tank datasheet and the ambient temperature — the standing loss (you can compare with another tank). For circulation enter the pipe length, linear loss, running hours and pump power — you will see the cost of your mode and of continuous circulation.",
      "poCo": "Standing losses and circulation can eat a large part of the hot water energy — off-grid that is battery or heat pump electricity, every day.",
      "fizyka": "Q_water = n·V·ΔT·c (c = 4186 J/(kg·K)). Q_standing = UA·(θ_hw − θ_amb)·24 h. Q_circ = q·L·(θ_hw − θ_pipe)·h, pump electricity = P·h. The source example “0.8 W/K → 1.2 kWh/day” means ΔT = 62.5 K; “0.5 W/K → 0.7” and “180 kWh/year” do not balance at one ΔT (it gives 0.75 and about 164 kWh/year)."
    },
    "pola": {
      "osoby": {
        "nazwa": "Household members",
        "cel": "Multiplier of the daily hot water use.",
        "gdzie": "Your home (Module 2, Screen 4).",
        "zakres": "People."
      },
      "litrow": {
        "nazwa": "Hot water per person [l/person/day]",
        "cel": "Daily hot water use per person.",
        "gdzie": "Starting value 50 l from the source (Screen 2); Module 2 gives 50–70 l. Change it if you know your use.",
        "zakres": "Source: approx. 50 l/person/day."
      },
      "tZimna": {
        "nazwa": "Cold water temperature [°C]",
        "cel": "The water is heated from this temperature.",
        "gdzie": "Measured at the tank inlet (well, mains).",
        "zakres": "Your installation."
      },
      "tCwu": {
        "nazwa": "Hot water temperature in the tank [°C]",
        "cel": "The water is heated to this temperature; the standing loss is computed with it.",
        "gdzie": "Tank thermostat setting.",
        "zakres": "Higher than the cold water."
      },
      "pojemnosc": {
        "nazwa": "Tank capacity [l]",
        "cel": "Compared with the daily use — a tank too small does not cover a day.",
        "gdzie": "Tank nameplate.",
        "zakres": "Source: e.g. 200 l for 4 people."
      },
      "ua": {
        "nazwa": "Tank standing loss UA [W/K]",
        "cel": "How many watts the tank loses per degree between water and surroundings.",
        "gdzie": "Tank datasheet (standing loss); if it gives the loss in W at a temperature difference, divide by that difference.",
        "zakres": "The device datasheet — the app never assumes a typical value for you."
      },
      "uaPorownawczy": {
        "nazwa": "UA of another tank [W/K]",
        "cel": "Comparison with a better (or older) model — the difference in kWh/year.",
        "gdzie": "Datasheet of the compared tank.",
        "zakres": "Empty = no comparison."
      },
      "tOtoczenia": {
        "nazwa": "Tank ambient temperature [°C]",
        "cel": "The colder around the tank, the larger the loss.",
        "gdzie": "Temperature of the room the tank stands in (in winter).",
        "zakres": "Your installation."
      },
      "nieogrzewane": {
        "nazwa": "Unheated room",
        "cel": "Source warning: a tank in an unheated garage loses much more.",
        "gdzie": "Where your tank stands.",
        "zakres": "Yes / no."
      },
      "dlugosc": {
        "nazwa": "Circulation pipe length [m]",
        "cel": "Length of the loop with circulating hot water.",
        "gdzie": "Installation design or measurement.",
        "zakres": "Empty = no circulation."
      },
      "strataRury": {
        "nazwa": "Linear loss of the insulated pipe [W/(m·K)]",
        "cel": "How many watts a metre of pipe loses per degree of temperature difference.",
        "gdzie": "Pipe insulation / pipe manufacturer's datasheet for your diameter.",
        "zakres": "The datasheet — the app never assumes a typical value for you."
      },
      "tRur": {
        "nazwa": "Pipe ambient temperature [°C]",
        "cel": "Temperature around the circulation pipes.",
        "gdzie": "Where the pipes run (chase in a heated wall, unheated attic...).",
        "zakres": "Your installation."
      },
      "godzin": {
        "nazwa": "Circulation running [h/day]",
        "cel": "How many hours a day the pump keeps hot water in the pipes.",
        "gdzie": "Setting: continuous = 24 h, timed (e.g. morning and evening), on demand (flow sensor / button).",
        "zakres": "0–24 h."
      },
      "mocPompy": {
        "nazwa": "Circulation pump power [W]",
        "cel": "Electricity used by the pump while running.",
        "gdzie": "Pump nameplate / datasheet (Screen 15).",
        "zakres": "The device datasheet."
      }
    }
  },
  "grzalka-cwu": {
    "migawka": {
      "oCoChodzi": "An electric heater is a simple and cheap way to get hot water, but very “hungry” — in summer heating from the PV surplus is practically free, in winter it is better to top up with a heat pump, because a heater drains the battery quickly.",
      "jakDziala": "Enter the tank capacity, temperatures and heater power — the app computes the energy and heating time. With the PV surplus and the control type it shows how much comes from the sun and how much from the battery; with the inverter power — whether it can carry the heater.",
      "poCo": "A heater is one of the largest loads in an off-grid home. Badly planned, it heats from the battery or overloads the inverter.",
      "fizyka": "Q = V·ΔT·c (c = 4186 J/(kg·K)), t = Q / P. Fixed power: the heater draws P regardless of the sun, the battery covers what PV lacks. PV controller: P_ef = min(P, P_PV), heats longer, 0 from the battery. Source example: 2 kW, 200 l, 10 → 50 °C → 9.3 kWh and 4.65 h (source: 9.2 kWh, 4.6 h). “With 3 kW of PV — 3 h” does not hold: a 2 kW heater cannot draw 3 kW."
    },
    "pola": {
      "pojemnosc": {
        "nazwa": "Tank capacity [l]",
        "cel": "How much water the heater must warm.",
        "gdzie": "Tank nameplate (Screen 17).",
        "zakres": "Your installation."
      },
      "tStart": {
        "nazwa": "Starting water temperature [°C]",
        "cel": "The energy is counted from this temperature.",
        "gdzie": "Cold water (e.g. 10 °C) or the temperature after the night's use.",
        "zakres": "Your installation."
      },
      "tKoniec": {
        "nazwa": "Target temperature [°C]",
        "cel": "The heater warms the water up to this temperature.",
        "gdzie": "Heater thermostat setting.",
        "zakres": "Higher than the starting one."
      },
      "moc": {
        "nazwa": "Heater power [kW]",
        "cel": "Sets the heating time and the inverter load.",
        "gdzie": "Heater nameplate.",
        "zakres": "The device datasheet."
      },
      "mocPv": {
        "nazwa": "PV surplus while heating [kW]",
        "cel": "Panel power left after supplying the rest of the house.",
        "gdzie": "Module 3 (PV production) or the inverter reading at a sunny noon.",
        "zakres": "Empty = the PV share is not calculated."
      },
      "sterowanie": {
        "nazwa": "Heater control",
        "cel": "Fixed power heats at full power (what PV lacks comes from the battery); a surplus controller matches the power to the sun.",
        "gdzie": "Your installation — a thermostat or a PV surplus controller.",
        "zakres": "Needed only with a PV surplus."
      },
      "falownik": {
        "nazwa": "Inverter continuous power [kW]",
        "cel": "Checks whether the inverter can carry the heater.",
        "gdzie": "Inverter datasheet (rated continuous power, not peak).",
        "zakres": "Empty = no check."
      }
    }
  },
  "oslony-przeciwsloneczne": {
    "migawka": {
      "oCoChodzi": "The sun is an enemy in summer (overheating) and a friend in winter (free heating) — a good shade must tell them apart instead of blocking the sun the same way all year.",
      "jakDziala": "Enter the latitude (or leave it empty — we take it from the project location), the overhang projection, the gap above the window and the window height. The app computes the noon sun height on the longest and shortest day of the year and what part of the window is then in shade.",
      "poCo": "A well-sized overhang shades a south window in summer and lets in the winter sun that heats the house for free. Too long takes away winter gains, too short does not prevent overheating.",
      "fizyka": "Noon sun height: h = 90° − φ ± 23.45° (summer solstice +, winter −). The shadow of an overhang with projection P reaches P·tan h below it; shaded part of the window = (P·tan h − gap) ÷ window height, within 0–100%. The app does not compute gains in kWh (it needs a standard with shading factors and the windows model — deferred)."
    },
    "pola": {
      "szerokosc": {
        "nazwa": "Latitude [°N]",
        "cel": "Sets the sun height in summer and winter.",
        "gdzie": "Project location (Module 1) or a map. Empty = from the project location.",
        "zakres": "Model: approx. 23.5–66.5°N (Poland 49–55°N)."
      },
      "wysieg": {
        "nazwa": "Overhang projection [m]",
        "cel": "How far the overhang (balcony, canopy, pergola) sticks out from the wall.",
        "gdzie": "Measurement or design.",
        "zakres": "Your building."
      },
      "odstep": {
        "nazwa": "Gap above the window [m]",
        "cel": "From the underside of the overhang to the top edge of the glazing — the shadow must “cross” it first.",
        "gdzie": "Measurement or design.",
        "zakres": "0 = overhang right above the window."
      },
      "wysokosc": {
        "nazwa": "Window height [m]",
        "cel": "Height of the glazing to be shaded.",
        "gdzie": "Measurement or window schedule.",
        "zakres": "Your building."
      }
    }
  },
}

const RU_SHEET = "Паспорт устройства — приложение не подставляет типовое значение за вас."
const RU_OPT = "Пусто = эта часть не считается."

export const ru: Tlumaczenie<typeof pl> = {
  "dystrybucja-ciepla": {
    migawka: {
      oCoChodzi:
        "Это как выбор обуви — для бега одна, для скалолазания другая. Тепловому насосу подходит тёплый пол или большие низкотемпературные радиаторы, а не маленькие «высокотемпературные».",
      jakDziala:
        "Выберите источник тепла и систему. Для теплового насоса введите из паспорта COP при температуре подачи вашей системы и при температуре стандартных радиаторов — приложение покажет, насколько меньше электроэнергии потребит насос, а с потребностью и ценой — экономию в злотых и окупаемость доплаты.",
      poCo:
        "Чем ниже температура подачи, тем выше COP насоса. Обычным радиаторам нужна высокая температура, и они могут съесть большую часть выгоды от теплового насоса.",
      fizyka:
        "E = Q ÷ COP. Экономия = 1 − COP_отн ÷ COP_сис. Пример источника: COP 4,5 при 35 °C вместо 3,2 при 55 °C → 1 − 3,2/4,5 ≈ 29% (в источнике 28%). Размер радиатора при более низкой температуре и проект петель тёплого пола приложение не считает — для этого нужны PN-EN 442 и PN-EN 1264, которых в приложении нет.",
    },
    pola: {
      zrodlo: {
        nazwa: "Источник тепла",
        cel: "Сравнение COP и предупреждение об обычных радиаторах относятся к тепловому насосу.",
        gdzie: "Ваша установка.",
        zakres: "Тепловой насос или другое (котёл, камин).",
      },
      system: {
        nazwa: "Система распределения тепла",
        cel: "Задаёт температуру подачи: тёплый пол ок. 30–35 °C, низкотемпературные радиаторы 45/35/20, стандартные 75/65/20 (данные источника).",
        gdzie: "Проект установки или то, что есть в доме.",
        zakres: "Одна из трёх.",
      },
      copSystemu: {
        nazwa: "COP насоса при температуре подачи выбранной системы",
        cel: "Сколько кВт·ч тепла даёт 1 кВт·ч электроэнергии при более низкой температуре подачи.",
        gdzie: RU_SHEET + " Берите при той же наружной температуре, что и второй COP.",
        zakres: "≥ 1. " + RU_OPT,
      },
      copOdniesienia: {
        nazwa: "COP насоса при температуре подачи стандартных радиаторов",
        cel: "Точка отсчёта — то же устройство при высокой температуре подачи.",
        gdzie: RU_SHEET,
        zakres: "≥ 1. " + RU_OPT,
      },
      cieplo: {
        nazwa: "Годовая потребность в тепле на отопление [кВт·ч/год]",
        cel: "Переводит процент экономии в кВт·ч электроэнергии за год.",
        gdzie: "Экран 2 Модуля 6 (потребность в отоплении) или энергоаудит.",
        zakres: RU_OPT,
      },
      doplata: {
        nazwa: "Доплата за выбранную систему [зл]",
        cel: "Разница в стоимости по сравнению со стандартными радиаторами — для окупаемости.",
        gdzie: "Предложения монтажников, цены радиаторов.",
        zakres: RU_OPT,
      },
      cena: {
        nazwa: "Цена электроэнергии [зл/кВт·ч]",
        cel: "Переводит сэкономленные кВт·ч в деньги.",
        gdzie: "Счёт за электричество или стоимость кВт·ч вашей автономной системы.",
        zakres: RU_OPT,
      },
    },
  },
  "sterowanie-strefowe": {
    "migawka": {
      "oCoChodzi": "Зачем отапливать пустые комнаты? Зональное управление — как свет только там, где вы находитесь.",
      "jakDziala": "Разделите дом на зоны (гостиная, спальни, ванная). Для каждой введите её долю теплопотерь H, комфортную температуру и — если понижаете — пониженную температуру и число часов. Приложение сравнит тепло с отоплением всего дома до комфорта и посчитает электроэнергию приводов и контроллеров (источник: 1–5 Вт каждый).",
      "poCo": "Выигрыш от зон может быть большим, но в автономной системе каждый ватт постоянного потребления на счету — при многих приводах и малом выигрыше управление может стоить больше электроэнергии, чем экономит.",
      "fizyka": "Q = H·(θ − θe)·t для каждой зоны — та же физика, что на Экране 1, в установившемся режиме (верхняя оценка выигрыша). Электроэнергия управления = n·P·h + P_контроллера·24. Сэкономленная электроэнергия отопления = тепло ÷ COP. «18%» из источника — пример, не константа."
    },
    "pola": {
      "nazwa": {
        "nazwa": "Название зоны",
        "cel": "Только описание — на результат не влияет.",
        "gdzie": "Любое.",
        "zakres": "Текст."
      },
      "h": {
        "nazwa": "Коэффициент теплопотерь зоны H [Вт/К]",
        "cel": "Сколько ватт теряет зона на каждый градус разницы температур.",
        "gdzie": "Экран 1 Модуля 6 — потери ограждений и вентиляции этой части дома; сумма H зон = H здания.",
        "zakres": "Ваша установка — приложение не подставляет типовое значение за вас."
      },
      "komfort": {
        "nazwa": "Комфортная температура [°C]",
        "cel": "Температура зоны, когда ею пользуются.",
        "gdzie": "Настройка термостата.",
        "zakres": "Ваша настройка."
      },
      "obnizona": {
        "nazwa": "Пониженная температура [°C]",
        "cel": "Температура зоны, когда ею никто не пользуется.",
        "gdzie": "Настройка термостата в пониженном режиме.",
        "zakres": "Не выше комфортной. Пусто = без понижения."
      },
      "godzin": {
        "nazwa": "Время понижения [ч/сутки]",
        "cel": "Сколько часов в сутки зона при пониженной температуре.",
        "gdzie": "Ваш распорядок (спальня днём, гостиная ночью).",
        "zakres": "0–24 ч."
      },
      "tZewn": {
        "nazwa": "Средняя наружная температура [°C]",
        "cel": "Сутки, для которых считается выигрыш (например, типичные зимние).",
        "gdzie": "Климатические данные места (Модуль 1) или средняя месяца с Экрана 1.",
        "zakres": "Ваше местоположение."
      },
      "liczbaSilownikow": {
        "nazwa": "Количество приводов",
        "cel": "Каждый привод потребляет ток, пока запитан.",
        "gdzie": "Проект установки — обычно один на управляемую петлю/радиатор.",
        "zakres": "Штуки."
      },
      "mocSilownika": {
        "nazwa": "Потребление одного привода [Вт]",
        "cel": "Потребление привода во время питания.",
        "gdzie": "Паспорт привода.",
        "zakres": "Источник: 1–5 Вт каждый — введите значение из паспорта."
      },
      "godzinSilownikow": {
        "nazwa": "Питание приводов [ч/сутки]",
        "cel": "Сколько часов в сутки приводы потребляют ток.",
        "gdzie": "Тип привода (термический NC потребляет, пока клапан открыт) и ваш план.",
        "zakres": "0–24 ч."
      },
      "mocSterownikow": {
        "nazwa": "Контроллер и термостаты — суммарное потребление [Вт]",
        "cel": "Устройства, запитанные круглые сутки.",
        "gdzie": "Паспорта зонального контроллера и термостатов (источник: 1–5 Вт каждый).",
        "zakres": "Сумма по паспортам."
      },
      "cop": {
        "nazwa": "COP отопления",
        "cel": "Переводит сэкономленное тепло в сэкономленную электроэнергию для сравнения с потреблением приводов.",
        "gdzie": "1 = ТЭН/электрокотёл; тепловой насос — паспорт (Экран 5).",
        "zakres": "≥ 1. Пусто = неэлектрическое отопление (топливо) — без баланса электроэнергии."
      }
    }
  },
  "zasobnik-cwu": {
    "migawka": {
      "oCoChodzi": "Бойлер — это термос: хороший держит тепло, плохой выпускает его в гараж. А циркуляция — роскошь мгновенной горячей воды из крана, которая без разумного управления постоянно стоит энергии.",
      "jakDziala": "Введите число жильцов и температуры воды — приложение посчитает тепло на нагрев воды. По потерям UA из паспорта бойлера и температуре окружения — потери в режиме ожидания (можно сравнить с другим бойлером). Для циркуляции введите длину труб, линейные потери, часы работы и мощность насоса — увидите стоимость вашего режима и круглосуточного.",
      "poCo": "Потери ожидания и циркуляция могут съесть большую часть энергии на горячую воду — в автономной системе это электроэнергия батареи или теплового насоса, каждый день.",
      "fizyka": "Q_вода = n·V·ΔT·c (c = 4186 Дж/(кг·К)). Q_ожид = UA·(θ_гвс − θ_окр)·24 ч. Q_цирк = q·L·(θ_гвс − θ_труб)·h, электроэнергия насоса = P·h. Пример источника «0,8 Вт/К → 1,2 кВт·ч/сутки» соответствует ΔT = 62,5 К; «0,5 Вт/К → 0,7» и «180 кВт·ч/год» не сходятся при одной ΔT (получается 0,75 и около 164 кВт·ч/год)."
    },
    "pola": {
      "osoby": {
        "nazwa": "Число жильцов",
        "cel": "Множитель суточного расхода горячей воды.",
        "gdzie": "Ваш дом (Модуль 2, Экран 4).",
        "zakres": "Человек."
      },
      "litrow": {
        "nazwa": "ГВС на человека [л/чел./сутки]",
        "cel": "Суточный расход горячей воды на человека.",
        "gdzie": "Начальное значение 50 л из источника (Экран 2); Модуль 2 даёт 50–70 л. Измените, если знаете свой расход.",
        "zakres": "Источник: ок. 50 л/чел./сутки."
      },
      "tZimna": {
        "nazwa": "Температура холодной воды [°C]",
        "cel": "От этой температуры вода нагревается.",
        "gdzie": "Измерение на входе в бойлер (колодец, водопровод).",
        "zakres": "Ваша установка."
      },
      "tCwu": {
        "nazwa": "Температура ГВС в бойлере [°C]",
        "cel": "До этой температуры нагревается вода, с ней считаются потери ожидания.",
        "gdzie": "Настройка термостата бойлера.",
        "zakres": "Выше, чем холодная вода."
      },
      "pojemnosc": {
        "nazwa": "Объём бойлера [л]",
        "cel": "Сравнение с суточным расходом — слишком маленький бойлер не покроет сутки.",
        "gdzie": "Табличка бойлера.",
        "zakres": "Источник: например, 200 л на 4 человек."
      },
      "ua": {
        "nazwa": "Потери бойлера UA [Вт/К]",
        "cel": "Сколько ватт теряет бойлер на каждый градус разницы между водой и окружением.",
        "gdzie": "Паспорт бойлера (потери ожидания); если там потери в Вт при заданной разнице температур, разделите на эту разницу.",
        "zakres": "Паспорт устройства — приложение не подставляет типовое значение за вас."
      },
      "uaPorownawczy": {
        "nazwa": "UA другого бойлера [Вт/К]",
        "cel": "Сравнение с лучшей (или старой) моделью — разница в кВт·ч/год.",
        "gdzie": "Паспорт сравниваемого бойлера.",
        "zakres": "Пусто = без сравнения."
      },
      "tOtoczenia": {
        "nazwa": "Температура окружения бойлера [°C]",
        "cel": "Чем холоднее вокруг бойлера, тем больше потери.",
        "gdzie": "Температура помещения, где стоит бойлер (зимой).",
        "zakres": "Ваша установка."
      },
      "nieogrzewane": {
        "nazwa": "Неотапливаемое помещение",
        "cel": "Предупреждение источника: бойлер в неотапливаемом гараже теряет гораздо больше.",
        "gdzie": "Где стоит ваш бойлер.",
        "zakres": "Да / нет."
      },
      "dlugosc": {
        "nazwa": "Длина труб циркуляции [м]",
        "cel": "Длина петли, по которой циркулирует горячая вода.",
        "gdzie": "Проект установки или замер.",
        "zakres": "Пусто = без циркуляции."
      },
      "strataRury": {
        "nazwa": "Линейные потери изолированной трубы [Вт/(м·К)]",
        "cel": "Сколько ватт теряет метр трубы на градус разницы температур.",
        "gdzie": "Паспорт изоляции / производителя труб для вашего диаметра.",
        "zakres": "Паспорт — приложение не подставляет типовое значение за вас."
      },
      "tRur": {
        "nazwa": "Температура окружения труб [°C]",
        "cel": "Температура вокруг труб циркуляции.",
        "gdzie": "Где проходят трубы (штроба в тёплой стене, холодный чердак...).",
        "zakres": "Ваша установка."
      },
      "godzin": {
        "nazwa": "Работа циркуляции [ч/сутки]",
        "cel": "Сколько часов в сутки насос держит горячую воду в трубах.",
        "gdzie": "Настройка: круглосуточно = 24 ч, по времени (утром и вечером), по запросу (датчик потока / кнопка).",
        "zakres": "0–24 ч."
      },
      "mocPompy": {
        "nazwa": "Мощность циркуляционного насоса [Вт]",
        "cel": "Электроэнергия насоса в часы работы.",
        "gdzie": "Табличка / паспорт насоса (Экран 15).",
        "zakres": "Паспорт устройства."
      }
    }
  },
  "grzalka-cwu": {
    "migawka": {
      "oCoChodzi": "Электрический ТЭН — простой и дешёвый способ получить горячую воду, но очень «прожорливый»: летом нагрев от излишков PV практически бесплатен, зимой лучше догревать тепловым насосом, потому что ТЭН быстро разряжает батарею.",
      "jakDziala": "Введите объём бойлера, температуры и мощность ТЭНа — приложение посчитает энергию и время нагрева. С излишком PV и способом управления покажет, сколько даст солнце, а сколько батарея; с мощностью инвертора — выдержит ли он.",
      "poCo": "ТЭН — одна из самых больших нагрузок в автономном доме. При плохом планировании он греет от батареи или перегружает инвертор.",
      "fizyka": "Q = V·ΔT·c (c = 4186 Дж/(кг·К)), t = Q / P. Постоянная мощность: ТЭН берёт P независимо от солнца, недостаток покрывает батарея. Регулятор PV: P_эф = min(P, P_PV), греет дольше, 0 из батареи. Пример источника: 2 кВт, 200 л, 10 → 50 °C → 9,3 кВт·ч и 4,65 ч (в источнике 9,2 кВт·ч, 4,6 ч). «При PV 3 кВт — 3 ч» не сходится: ТЭН 2 кВт не возьмёт 3 кВт."
    },
    "pola": {
      "pojemnosc": {
        "nazwa": "Объём бойлера [л]",
        "cel": "Сколько воды должен нагреть ТЭН.",
        "gdzie": "Табличка бойлера (Экран 17).",
        "zakres": "Ваша установка."
      },
      "tStart": {
        "nazwa": "Начальная температура воды [°C]",
        "cel": "От этой температуры считается энергия.",
        "gdzie": "Холодная вода (например, 10 °C) или температура после ночного расхода.",
        "zakres": "Ваша установка."
      },
      "tKoniec": {
        "nazwa": "Целевая температура [°C]",
        "cel": "До этой температуры ТЭН греет воду.",
        "gdzie": "Настройка термостата ТЭНа.",
        "zakres": "Выше начальной."
      },
      "moc": {
        "nazwa": "Мощность ТЭНа [кВт]",
        "cel": "Определяет время нагрева и нагрузку на инвертор.",
        "gdzie": "Табличка ТЭНа.",
        "zakres": "Паспорт устройства."
      },
      "mocPv": {
        "nazwa": "Излишек PV во время нагрева [кВт]",
        "cel": "Мощность панелей, остающаяся после питания остального дома.",
        "gdzie": "Модуль 3 (выработка PV) или показания инвертора в солнечный полдень.",
        "zakres": "Пусто = доля PV не считается."
      },
      "sterowanie": {
        "nazwa": "Управление ТЭНом",
        "cel": "Постоянная мощность греет на полную (недостаток PV — из батареи); регулятор излишков подстраивает мощность под солнце.",
        "gdzie": "Ваша установка — термостат или регулятор излишков PV.",
        "zakres": "Нужно только при излишке PV."
      },
      "falownik": {
        "nazwa": "Длительная мощность инвертора [кВт]",
        "cel": "Проверка, выдержит ли инвертор ТЭН.",
        "gdzie": "Паспорт инвертора (номинальная длительная, не пиковая).",
        "zakres": "Пусто = без проверки."
      }
    }
  },
  "oslony-przeciwsloneczne": {
    "migawka": {
      "oCoChodzi": "Солнце летом — враг (перегрев), зимой — друг (бесплатное отопление). Хорошая защита должна это различать, а не закрывать солнце весь год одинаково.",
      "jakDziala": "Введите широту (или оставьте пусто — возьмём из местоположения проекта), вылет козырька, расстояние над окном и высоту окна. Приложение посчитает высоту солнца в полдень в самый длинный и самый короткий день года и какая часть окна будет в тени.",
      "poCo": "Правильно подобранный козырёк затеняет южное окно летом и впускает зимнее солнце, которое бесплатно греет дом. Слишком длинный отнимает зимние теплопоступления, слишком короткий не защищает от перегрева.",
      "fizyka": "Высота солнца в полдень: h = 90° − φ ± 23,45° (летнее солнцестояние +, зимнее −). Тень козырька с вылетом P опускается на P·tg h ниже него; затенённая часть окна = (P·tg h − зазор) ÷ высота окна, в пределах 0–100%. Теплопоступления в кВт·ч приложение не считает (нужна норма с коэффициентами защиты и модель окон — отложена)."
    },
    "pola": {
      "szerokosc": {
        "nazwa": "Географическая широта [° с. ш.]",
        "cel": "Определяет высоту солнца летом и зимой.",
        "gdzie": "Местоположение проекта (Модуль 1) или карта. Пусто = из местоположения проекта.",
        "zakres": "Модель: ок. 23,5–66,5° с. ш. (Польша 49–55°)."
      },
      "wysieg": {
        "nazwa": "Вылет козырька [м]",
        "cel": "Насколько козырёк (балкон, навес, пергола) выступает от стены.",
        "gdzie": "Замер или проект.",
        "zakres": "Ваше здание."
      },
      "odstep": {
        "nazwa": "Расстояние от козырька до окна [м]",
        "cel": "От низа козырька до верхнего края остекления — тень сначала должна его «пройти».",
        "gdzie": "Замер или проект.",
        "zakres": "0 = козырёк сразу над окном."
      },
      "wysokosc": {
        "nazwa": "Высота окна [м]",
        "cel": "Высота остекления, которое нужно затенить.",
        "gdzie": "Замер или спецификация окон.",
        "zakres": "Ваше здание."
      }
    }
  },
}
