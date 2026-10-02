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
        "Wybierz źródło ciepła i system. Przy pompie ciepła wpisz z jej karty COP przy temperaturze zasilania Twojego systemu i przy temperaturze grzejników standardowych — aplikacja policzy, o ile mniej prądu zużyje pompa, a z zapotrzebowaniem i ceną prądu — oszczędność w {waluta} i zwrot dopłaty.",
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
        nazwa: "Dopłata za wybrany system [{waluta}]",
        cel: "Różnica kosztu względem grzejników standardowych — do policzenia zwrotu.",
        gdzie: "Oferty instalatorów, ceny grzejników.",
        zakres: OPCJA,
      },
      cena: {
        nazwa: "Cena prądu [{waluta}/kWh]",
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
      "jakDziala": "Wpisz pojemność zasobnika, temperatury i moc grzałki — aplikacja policzy energię i czas grzania. Z nadwyżką PV i sposobem sterowania pokaże, ile energii da słońce, a ile bateria; z mocą falownika — czy ją udźwignie. Niżej: pompa ciepła w grzaniu wody — ile prądu i czasu do jej temperatury maksymalnej, resztę grzałką, i ile mniej niż sama grzałka.",
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
  "wentylacja-porownanie": {
    "migawka": {
      "oCoChodzi": "Oddychać trzeba, ale bez rekuperacji to oddychanie zimą słono kosztuje — pytanie nie brzmi „czy wentylować”, tylko „jak zrobić to najtaniej”.",
      "jakDziala": "Wpisz temperatury, strumień powietrza wentylacji naturalnej i mechanicznej, sprawność odzysku i pobór wentylatorów. Aplikacja policzy straty ciepła obu wariantów na dobę, a z COP ogrzewania — ile prądu netto oszczędza rekuperacja po odjęciu wentylatorów. Z dniami sezonu, ceną prądu i dopłatą — zwrot.",
      "poCo": "W off-gridzie wentylatory pracują całą dobę z baterii — rekuperacja musi oszczędzić na ogrzewaniu więcej, niż sama zużywa.",
      "fizyka": "Q = V̇·(1 − η)·ρ·cp·ΔT·24 h (ρ = 1,2 kg/m³, cp = 1005 J/(kg·K) — jak Ekrany 3 i 12). Netto = (Q_nat − Q_mech) ÷ COP − P_went·24 h. Przykład źródła „8 − 3 − 0,5 = 4,5 kWh/dobę” odejmuje ciepło od prądu 1:1 — to prawda tylko przy COP = 1; „1600 kWh rocznie” = 4,5 × 365 dni zimowej doby."
    },
    "pola": {
      "tWew": {
        "nazwa": "Temperatura wewnątrz [°C]",
        "cel": "Różnica temperatur napędza straty wentylacji.",
        "gdzie": "Temperatura, którą utrzymujesz zimą.",
        "zakres": "Twoje ustawienie."
      },
      "tZewn": {
        "nazwa": "Średnia temperatura zewnętrzna [°C]",
        "cel": "Doba, dla której liczysz (np. średnia sezonu albo typowa zimowa doba).",
        "gdzie": "Dane klimatyczne lokalizacji (Moduł 1) albo średnie miesięczne z Ekranu 1.",
        "zakres": "Twoja lokalizacja."
      },
      "strumienNat": {
        "nazwa": "Strumień powietrza wentylacji naturalnej [m³/h]",
        "cel": "Ile powietrza wymienia wentylacja grawitacyjna.",
        "gdzie": "Liczba wymian × kubatura (Ekran 12 — test szczelności) albo pomiar anemometrem na kratkach.",
        "zakres": "Twój budynek — wzoru na ciąg kominowy aplikacja nie ma."
      },
      "szczelny": {
        "nazwa": "Dom nowy, szczelny",
        "cel": "Ostrzeżenie źródła: w szczelnym domu wentylacja naturalna nie działa i grozi pleśnią.",
        "gdzie": "Nowe okna, membrany, dobry wynik testu szczelności.",
        "zakres": "Tak / nie."
      },
      "strumienMech": {
        "nazwa": "Strumień powietrza wentylacji mechanicznej [m³/h]",
        "cel": "Wydajność centrali w normalnej pracy.",
        "gdzie": "Projekt wentylacji / nastawa centrali (Ekran 3).",
        "zakres": "Twoja instalacja."
      },
      "sprawnosc": {
        "nazwa": "Sprawność odzysku ciepła [%]",
        "cel": "Jaka część ciepła z powietrza wywiewanego wraca do domu.",
        "gdzie": "Karta rekuperatora.",
        "zakres": "0–100% — wartość z karty."
      },
      "wentylatory": {
        "nazwa": "Pobór wentylatorów [W]",
        "cel": "Prąd zużywany przez centralę całą dobę.",
        "gdzie": "Karta centrali (pobór przy Twoim strumieniu).",
        "zakres": "Karta katalogowa urządzenia."
      },
      "cop": {
        "nazwa": "COP ogrzewania",
        "cel": "Zamienia zaoszczędzone ciepło na zaoszczędzony prąd.",
        "gdzie": "1 = grzałka/kocioł elektryczny; pompa ciepła — karta (Ekran 5).",
        "zakres": "≥ 1. Puste = ogrzewanie nieelektryczne — bez bilansu prądu."
      },
      "dni": {
        "nazwa": "Dni sezonu grzewczego",
        "cel": "Mnoży oszczędność doby na sezon.",
        "gdzie": "Liczba dni z ogrzewaniem w Twojej lokalizacji.",
        "zakres": "Do 366. Puste = bez wyniku sezonowego."
      },
      "cena": {
        "nazwa": "Cena prądu [{waluta}/kWh]",
        "cel": "Zamienia kWh na złotówki.",
        "gdzie": "Rachunek albo koszt kWh z Twojego systemu.",
        "zakres": "Puste = bez {waluta} i zwrotu."
      },
      "doplata": {
        "nazwa": "Dopłata za rekuperację [{waluta}]",
        "cel": "Różnica kosztu instalacji względem wentylacji naturalnej.",
        "gdzie": "Oferty instalatorów.",
        "zakres": "Puste = bez zwrotu."
      }
    }
  },
  "kolektor-gruntowy": {
    "migawka": {
      "oCoChodzi": "Pompa ciepła pobiera ciepło z gruntu. Trzeba dać jej odpowiedni kolektor, inaczej będzie jak samochód bez paliwa.",
      "jakDziala": "Wybierz typ kolektora i wpisz moc pompy. Dla poziomego — wskaźnik m² na 10 kW z projektu dla Twojego gruntu, głębokość ułożenia i głębokość przemarzania; dla pionowego — moc z 1 m odwiertu i głębokość jednego odwiertu. Obok wyniku pokazujemy widełki ze źródła.",
      "poCo": "Za mały kolektor wychładza grunt — pompa traci COP i w mrozy może stanąć; zbyt płytki zamarza. Za duży odwiert to koszt, który się nie zwraca.",
      "fizyka": "Poziomy: A = P/10 × wskaźnik (źródło: 60–120 m²/10 kW, głębokość 1,2–1,8 m). Pionowy: L = P / q (źródło: 50–70 W/m, odwierty 50–100 m), liczba odwiertów = L / głębokość w górę. Przykład źródła „8 kW → 400 m² albo 1 odwiert 100 m” nie wynika z tych widełek (dałyby 48–96 m² i 114–160 m) — 400 m² to 500 m²/10 kW, 100 m to 80 W/m."
    },
    "pola": {
      "typ": {
        "nazwa": "Typ kolektora",
        "cel": "Poziomy potrzebuje dużej działki, pionowy — wiertni, spiralny jest kompaktowy.",
        "gdzie": "Projekt dolnego źródła albo dostępna powierzchnia działki.",
        "zakres": "Poziomy / pionowy / spiralny (spiralny bez wymiarowania — źródło nie daje wskaźnika)."
      },
      "moc": {
        "nazwa": "Moc pompy ciepła [kW]",
        "cel": "Wskaźniki źródła są podane na moc pompy.",
        "gdzie": "Karta pompy albo Ekran 2 (zapotrzebowanie na ciepło).",
        "zakres": "Typowo kilka–kilkanaście kW dla domu."
      },
      "m2Na10Kw": {
        "nazwa": "Powierzchnia na 10 kW [m²/10 kW]",
        "cel": "Zależy od gruntu: suchy piasek wymaga więcej niż wilgotna glina.",
        "gdzie": "Projekt dolnego źródła / badanie gruntu.",
        "zakres": "Źródło: 60–120 m² na każde 10 kW."
      },
      "glebokosc": {
        "nazwa": "Głębokość ułożenia rur [m]",
        "cel": "Kolektor musi leżeć poniżej strefy przemarzania.",
        "gdzie": "Projekt wykopu.",
        "zakres": "Źródło: 1,2–1,8 m."
      },
      "przemarzanie": {
        "nazwa": "Głębokość przemarzania [m]",
        "cel": "Granica, płycej której kolektor zamarza (🔴).",
        "gdzie": "Mapa stref przemarzania dla Twojej lokalizacji albo projekt.",
        "zakres": "Zależy od strefy klimatycznej — wpisz wartość z mapy."
      },
      "wNaMetr": {
        "nazwa": "Moc z 1 m odwiertu [W/m]",
        "cel": "Ile mocy grunt odda z każdego metra odwiertu.",
        "gdzie": "Projekt odwiertu / badanie gruntu (test reakcji termicznej).",
        "zakres": "Źródło: ok. 50–70 W/m."
      },
      "odwiert": {
        "nazwa": "Głębokość jednego odwiertu [m]",
        "cel": "Dzieli łączną długość na liczbę odwiertów.",
        "gdzie": "Oferta firmy wiertniczej / warunki geologiczne.",
        "zakres": "Źródło: 50–100 m."
      }
    }
  },
  "alternatywne-zrodla-ciepla": {
    "migawka": {
      "oCoChodzi": "Pompa ciepła to nie jedyna droga. Kominek z płaszczem, promienniki IR, maty kapilarne czy magazyn PCM mogą ją uzupełnić — każde ma swoje miejsce i swoją pułapkę.",
      "jakDziala": "Wybierz kartę źródła. Kominek: moc i udział do wody → ile kW trafi do instalacji, ile do salonu i jaką część zapotrzebowania pokryje. IR: moc × godziny → kWh na dobę. Maty: W/m² × m² → moc grzewcza i pokrycie. PCM: objętość × gęstość × ciepło topnienia → kWh i równoważnik bufora wodnego. Kocioł elektryczny ma osobny ekran.",
      "poCo": "W off-gridzie każde źródło ciepła to inny koszt prądu i inne ryzyko przy jego braku — kominek bez schładzania grawitacyjnego przegrzeje się właśnie wtedy, gdy padnie zasilanie pompy obiegowej.",
      "fizyka": "Kominek: P_woda = P × udział. IR: E = P × t. Maty: P = q × A. PCM: Q = V × ρ × L (ciepło utajone), bufor wodny o tej samej energii V_w = Q / (c_w × ΔT). Przykład źródła „100 l PCM × 200 kJ/kg ≈ 300 l wody” wychodzi przy gęstości 1 kg/l i ΔT ≈ 16 K — źródło tych danych nie podaje."
    },
    "pola": {
      "zrodlo": {
        "nazwa": "Źródło ciepła",
        "cel": "Wybiera kartę z danymi i obliczeniem tego źródła.",
        "gdzie": "To, co rozważasz jako uzupełnienie albo alternatywę pompy.",
        "zakres": "Kominek / kocioł elektryczny / IR / maty / PCM."
      },
      "zapotrzebowanie": {
        "nazwa": "Zapotrzebowanie w mroźny dzień [kW]",
        "cel": "Do policzenia, jaką część potrzeb pokryje kominek albo maty.",
        "gdzie": "Ekran 2 (zapotrzebowanie na ciepło).",
        "zakres": "Opcjonalne; puste = bez pokrycia %."
      },
      "kominekMoc": {
        "nazwa": "Moc kominka [kW]",
        "cel": "Moc nominalna przy paleniu.",
        "gdzie": "Karta kominka.",
        "zakres": "Z karty producenta."
      },
      "kominekUdzial": {
        "nazwa": "Udział mocy do wody [%]",
        "cel": "Część mocy oddawana przez płaszcz wodny do instalacji.",
        "gdzie": "Karta kominka (moc do wody / moc całkowita).",
        "zakres": "0–100%; przykład źródła: 70%."
      },
      "kominekZabezp": {
        "nazwa": "Zabezpieczenie przy braku prądu",
        "cel": "Bez prądu pompa obiegowa stoi — płaszcz musi oddać ciepło grawitacyjnie albo przez wężownicę schładzającą.",
        "gdzie": "Projekt podłączenia kominka do bufora.",
        "zakres": "Tak / nie; brak → ostrzeżenie."
      },
      "irMoc": {
        "nazwa": "Moc paneli IR [W]",
        "cel": "Moc elektryczna = moc grzewcza promiennika.",
        "gdzie": "Karta panelu (suma paneli).",
        "zakres": "Przykład źródła: 600 W w łazience."
      },
      "irGodzin": {
        "nazwa": "Czas pracy [h/dobę]",
        "cel": "Mnoży moc na energię dobową.",
        "gdzie": "Twój plan użytkowania.",
        "zakres": "0–24 h."
      },
      "irPodstawowe": {
        "nazwa": "IR jako ogrzewanie podstawowe",
        "cel": "Źródło ostrzega, że IR to ogrzewanie punktowe.",
        "gdzie": "Twój plan ogrzewania.",
        "zakres": "Tak / nie; tak → ostrzeżenie."
      },
      "matyQ": {
        "nazwa": "Moc jednostkowa mat [W/m²]",
        "cel": "Moc z m² przy Twojej temperaturze zasilania.",
        "gdzie": "Karta mat (tabela mocy dla temperatury zasilania).",
        "zakres": "Przykład źródła: 60 W/m² przy 30 °C."
      },
      "matyA": {
        "nazwa": "Powierzchnia aktywna [m²]",
        "cel": "Powierzchnia sufitu/ścian pokryta matami.",
        "gdzie": "Projekt rozmieszczenia mat.",
        "zakres": "Twoja wartość."
      },
      "matyStrop": {
        "nazwa": "Strop nieizolowany",
        "cel": "Maty pod nieizolowanym stropem grzeją strop zamiast pokoju.",
        "gdzie": "Przekrój stropu.",
        "zakres": "Tak / nie; tak → ostrzeżenie."
      },
      "pcmV": {
        "nazwa": "Objętość PCM [l]",
        "cel": "Ilość materiału zmiennofazowego.",
        "gdzie": "Projekt / oferta akumulatora PCM.",
        "zakres": "Przykład źródła: 100 l."
      },
      "pcmGestosc": {
        "nazwa": "Gęstość PCM [kg/l]",
        "cel": "Przelicza objętość na masę.",
        "gdzie": "Karta materiału.",
        "zakres": "Z karty materiału — źródło jej nie podaje."
      },
      "pcmL": {
        "nazwa": "Ciepło topnienia [kJ/kg]",
        "cel": "Energia pochłaniana przy topnieniu 1 kg.",
        "gdzie": "Karta materiału.",
        "zakres": "Przykład źródła: 200 kJ/kg."
      },
      "pcmDt": {
        "nazwa": "ΔT bufora wodnego [K]",
        "cel": "Do porównania z buforem wodnym tej samej energii.",
        "gdzie": "Użyteczny zakres temperatur bufora (Ekran 14).",
        "zakres": "Opcjonalne; puste = bez porównania."
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
        "Choose the heat source and the system. With a heat pump, enter from its datasheet the COP at your system's supply temperature and at the standard radiators' temperature — the app shows how much less electricity the pump uses, and with the demand and price, the saving in {waluta} and the payback of the extra cost.",
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
        nazwa: "Extra cost of the chosen system [{waluta}]",
        cel: "Cost difference against standard radiators — for the payback.",
        gdzie: "Installer quotes, radiator prices.",
        zakres: EN_OPT,
      },
      cena: {
        nazwa: "Electricity price [{waluta}/kWh]",
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
      "jakDziala": "Enter the tank capacity, temperatures and heater power — the app computes the energy and heating time. With the PV surplus and the control type it shows how much comes from the sun and how much from the battery; with the inverter power — whether it can carry the heater. Below: the heat pump heating water — how much electricity and time up to its maximum temperature, the rest by the heater, and how much less than the heater alone.",
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
  "wentylacja-porownanie": {
    "migawka": {
      "oCoChodzi": "You have to breathe, but without heat recovery breathing in winter is expensive — the question is not “whether to ventilate” but “how to do it most cheaply”.",
      "jakDziala": "Enter the temperatures, the natural and mechanical air flows, the recovery efficiency and the fan power. The app computes the daily heat loss of both options and, with the heating COP, how much net electricity recovery saves after the fans. With season days, electricity price and extra cost — the payback.",
      "poCo": "Off-grid the fans run all day from the battery — heat recovery must save more on heating than it uses itself.",
      "fizyka": "Q = V̇·(1 − η)·ρ·cp·ΔT·24 h (ρ = 1.2 kg/m³, cp = 1005 J/(kg·K) — as Screens 3 and 12). Net = (Q_nat − Q_mech) ÷ COP − P_fans·24 h. The source example “8 − 3 − 0.5 = 4.5 kWh/day” subtracts heat from electricity 1:1 — true only at COP = 1; “1600 kWh a year” = 4.5 × 365 days of a winter day."
    },
    "pola": {
      "tWew": {
        "nazwa": "Indoor temperature [°C]",
        "cel": "The temperature difference drives ventilation losses.",
        "gdzie": "The temperature you keep in winter.",
        "zakres": "Your setting."
      },
      "tZewn": {
        "nazwa": "Mean outdoor temperature [°C]",
        "cel": "The day you compute for (e.g. season mean or a typical winter day).",
        "gdzie": "Climate data of the location (Module 1) or monthly means from Screen 1.",
        "zakres": "Your location."
      },
      "strumienNat": {
        "nazwa": "Natural ventilation air flow [m³/h]",
        "cel": "How much air the stack ventilation exchanges.",
        "gdzie": "Air changes × volume (Screen 12 — airtightness test) or an anemometer at the grilles.",
        "zakres": "Your building — the app has no formula for the stack effect."
      },
      "szczelny": {
        "nazwa": "New, airtight house",
        "cel": "Source warning: in an airtight house natural ventilation does not work and risks mould.",
        "gdzie": "New windows, membranes, a good airtightness test result.",
        "zakres": "Yes / no."
      },
      "strumienMech": {
        "nazwa": "Mechanical ventilation air flow [m³/h]",
        "cel": "Unit output in normal operation.",
        "gdzie": "Ventilation design / unit setting (Screen 3).",
        "zakres": "Your installation."
      },
      "sprawnosc": {
        "nazwa": "Heat recovery efficiency [%]",
        "cel": "What part of the exhaust air heat returns to the house.",
        "gdzie": "Heat recovery unit datasheet.",
        "zakres": "0–100% — the datasheet value."
      },
      "wentylatory": {
        "nazwa": "Fan power [W]",
        "cel": "Electricity used by the unit all day.",
        "gdzie": "Unit datasheet (power at your air flow).",
        "zakres": "The device datasheet."
      },
      "cop": {
        "nazwa": "Heating COP",
        "cel": "Turns the heat saved into electricity saved.",
        "gdzie": "1 = electric heater/boiler; heat pump — datasheet (Screen 5).",
        "zakres": "≥ 1. Empty = non-electric heating — no electricity balance."
      },
      "dni": {
        "nazwa": "Heating season days",
        "cel": "Multiplies the daily saving to the season.",
        "gdzie": "Number of heating days at your location.",
        "zakres": "Up to 366. Empty = no season result."
      },
      "cena": {
        "nazwa": "Electricity price [{waluta}/kWh]",
        "cel": "Turns kWh into money.",
        "gdzie": "Bill or the cost of a kWh from your system.",
        "zakres": "Empty = no {waluta} and payback."
      },
      "doplata": {
        "nazwa": "Extra cost of heat recovery [{waluta}]",
        "cel": "Installation cost difference against natural ventilation.",
        "gdzie": "Installer quotes.",
        "zakres": "Empty = no payback."
      }
    }
  },
  "kolektor-gruntowy": {
    "migawka": {
      "oCoChodzi": "A heat pump draws heat from the ground. It needs the right collector, otherwise it is like a car without fuel.",
      "jakDziala": "Choose the collector type and enter the pump power. Horizontal — the m² per 10 kW index from a design for your soil, the laying depth and the frost depth; vertical — power per 1 m of borehole and the depth of one borehole. The source's ranges are shown next to the result.",
      "poCo": "Too small a collector cools the ground — the pump loses COP and may stop in a frost; too shallow a collector freezes. Too deep a borehole is a cost that never pays back.",
      "fizyka": "Horizontal: A = P/10 × index (source: 60–120 m²/10 kW, depth 1.2–1.8 m). Vertical: L = P / q (source: 50–70 W/m, boreholes 50–100 m), number of boreholes = L / depth rounded up. The source's example \"8 kW → 400 m² or 1 borehole of 100 m\" does not follow from these ranges (they give 48–96 m² and 114–160 m) — 400 m² is 500 m²/10 kW, 100 m is 80 W/m."
    },
    "pola": {
      "typ": {
        "nazwa": "Collector type",
        "cel": "Horizontal needs a large plot, vertical a drilling rig, spiral is compact.",
        "gdzie": "Ground source design or the available plot area.",
        "zakres": "Horizontal / vertical / spiral (spiral not sized — the source gives no index)."
      },
      "moc": {
        "nazwa": "Heat pump power [kW]",
        "cel": "The source's indices are given per pump power.",
        "gdzie": "Pump data sheet or Screen 2 (heat demand).",
        "zakres": "Typically a few to a dozen or so kW for a house."
      },
      "m2Na10Kw": {
        "nazwa": "Area per 10 kW [m²/10 kW]",
        "cel": "Depends on the soil: dry sand needs more than moist clay.",
        "gdzie": "Ground source design / soil survey.",
        "zakres": "Source: 60–120 m² per 10 kW."
      },
      "glebokosc": {
        "nazwa": "Pipe laying depth [m]",
        "cel": "The collector must lie below the frost depth.",
        "gdzie": "Excavation design.",
        "zakres": "Source: 1.2–1.8 m."
      },
      "przemarzanie": {
        "nazwa": "Frost depth [m]",
        "cel": "The limit above which the collector freezes (🔴).",
        "gdzie": "Frost-zone map for your location or the design.",
        "zakres": "Depends on the climate zone — enter the value from the map."
      },
      "wNaMetr": {
        "nazwa": "Power per 1 m of borehole [W/m]",
        "cel": "How much power the ground gives per metre of borehole.",
        "gdzie": "Borehole design / soil survey (thermal response test).",
        "zakres": "Source: about 50–70 W/m."
      },
      "odwiert": {
        "nazwa": "Depth of one borehole [m]",
        "cel": "Splits the total length into a number of boreholes.",
        "gdzie": "Drilling company quote / geological conditions.",
        "zakres": "Source: 50–100 m."
      }
    }
  },
  "alternatywne-zrodla-ciepla": {
    "migawka": {
      "oCoChodzi": "A heat pump is not the only way. A water-jacket fireplace, IR panels, capillary mats or PCM storage can supplement it — each has its place and its trap.",
      "jakDziala": "Pick a source card. Fireplace: power and water share → how many kW reach the system, how many the living room, and what part of the demand it covers. IR: power × hours → kWh a day. Mats: W/m² × m² → heating output and coverage. PCM: volume × density × latent heat → kWh and the water buffer equivalent. The electric boiler has its own screen.",
      "poCo": "Off-grid, every heat source means a different electricity cost and a different risk when power fails — a fireplace without gravity cooling overheats exactly when the circulation pump loses power.",
      "fizyka": "Fireplace: P_water = P × share. IR: E = P × t. Mats: P = q × A. PCM: Q = V × ρ × L (latent heat), water buffer of the same energy V_w = Q / (c_w × ΔT). The source's \"100 l PCM × 200 kJ/kg ≈ 300 l of water\" holds at a density of 1 kg/l and ΔT ≈ 16 K — the source gives neither."
    },
    "pola": {
      "zrodlo": {
        "nazwa": "Heat source",
        "cel": "Selects the card with this source's data and calculation.",
        "gdzie": "What you are considering as a supplement or alternative to the heat pump.",
        "zakres": "Fireplace / electric boiler / IR / mats / PCM."
      },
      "zapotrzebowanie": {
        "nazwa": "Demand on a frosty day [kW]",
        "cel": "To compute what part of the demand the fireplace or mats cover.",
        "gdzie": "Screen 2 (heat demand).",
        "zakres": "Optional; empty = no coverage %."
      },
      "kominekMoc": {
        "nazwa": "Fireplace power [kW]",
        "cel": "Nominal power when firing.",
        "gdzie": "Fireplace data sheet.",
        "zakres": "From the manufacturer's data sheet."
      },
      "kominekUdzial": {
        "nazwa": "Share of power to water [%]",
        "cel": "The part of the power the water jacket passes to the system.",
        "gdzie": "Fireplace data sheet (water output / total output).",
        "zakres": "0–100%; source example: 70%."
      },
      "kominekZabezp": {
        "nazwa": "Power-cut protection",
        "cel": "Without power the circulation pump stops — the jacket must shed heat by gravity or through a cooling coil.",
        "gdzie": "Design of the fireplace-to-buffer connection.",
        "zakres": "Yes / no; no → warning."
      },
      "irMoc": {
        "nazwa": "IR panel power [W]",
        "cel": "Electrical power = heating power of the panel.",
        "gdzie": "Panel data sheet (sum of panels).",
        "zakres": "Source example: 600 W in a bathroom."
      },
      "irGodzin": {
        "nazwa": "Running time [h/day]",
        "cel": "Turns power into daily energy.",
        "gdzie": "Your usage plan.",
        "zakres": "0–24 h."
      },
      "irPodstawowe": {
        "nazwa": "IR as the main heating",
        "cel": "The source warns that IR is spot heating.",
        "gdzie": "Your heating plan.",
        "zakres": "Yes / no; yes → warning."
      },
      "matyQ": {
        "nazwa": "Mat output per m² [W/m²]",
        "cel": "Output per m² at your supply temperature.",
        "gdzie": "Mat data sheet (output table for the supply temperature).",
        "zakres": "Source example: 60 W/m² at 30 °C."
      },
      "matyA": {
        "nazwa": "Active area [m²]",
        "cel": "Ceiling/wall area covered with mats.",
        "gdzie": "Mat layout design.",
        "zakres": "Your value."
      },
      "matyStrop": {
        "nazwa": "Uninsulated slab",
        "cel": "Mats under an uninsulated slab heat the slab instead of the room.",
        "gdzie": "Slab cross-section.",
        "zakres": "Yes / no; yes → warning."
      },
      "pcmV": {
        "nazwa": "PCM volume [l]",
        "cel": "Amount of phase-change material.",
        "gdzie": "PCM storage design / quote.",
        "zakres": "Source example: 100 l."
      },
      "pcmGestosc": {
        "nazwa": "PCM density [kg/l]",
        "cel": "Converts volume to mass.",
        "gdzie": "Material data sheet.",
        "zakres": "From the material data sheet — the source does not give it."
      },
      "pcmL": {
        "nazwa": "Latent heat of melting [kJ/kg]",
        "cel": "Energy absorbed when 1 kg melts.",
        "gdzie": "Material data sheet.",
        "zakres": "Source example: 200 kJ/kg."
      },
      "pcmDt": {
        "nazwa": "Water buffer ΔT [K]",
        "cel": "For comparison with a water buffer of the same energy.",
        "gdzie": "Usable temperature range of the buffer (Screen 14).",
        "zakres": "Optional; empty = no comparison."
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
        "Выберите источник тепла и систему. Для теплового насоса введите из паспорта COP при температуре подачи вашей системы и при температуре стандартных радиаторов — приложение покажет, насколько меньше электроэнергии потребит насос, а с потребностью и ценой — экономию в {waluta} и окупаемость доплаты.",
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
        nazwa: "Доплата за выбранную систему [{waluta}]",
        cel: "Разница в стоимости по сравнению со стандартными радиаторами — для окупаемости.",
        gdzie: "Предложения монтажников, цены радиаторов.",
        zakres: RU_OPT,
      },
      cena: {
        nazwa: "Цена электроэнергии [{waluta}/кВт·ч]",
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
      "jakDziala": "Введите объём бойлера, температуры и мощность ТЭНа — приложение посчитает энергию и время нагрева. С излишком PV и способом управления покажет, сколько даст солнце, а сколько батарея; с мощностью инвертора — выдержит ли он. Ниже: тепловой насос в нагреве воды — сколько электричества и времени до его максимальной температуры, остальное ТЭНом, и насколько меньше, чем один ТЭН.",
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
  "wentylacja-porownanie": {
    "migawka": {
      "oCoChodzi": "Дышать нужно, но без рекуперации дыхание зимой обходится дорого — вопрос не «вентилировать ли», а «как сделать это дешевле всего».",
      "jakDziala": "Введите температуры, расходы воздуха естественной и механической вентиляции, КПД рекуперации и потребление вентиляторов. Приложение посчитает суточные теплопотери обоих вариантов, а с COP отопления — сколько электроэнергии нетто экономит рекуперация за вычетом вентиляторов. С днями сезона, ценой и доплатой — окупаемость.",
      "poCo": "В автономной системе вентиляторы работают круглосуточно от батареи — рекуперация должна экономить на отоплении больше, чем потребляет сама.",
      "fizyka": "Q = V̇·(1 − η)·ρ·cp·ΔT·24 ч (ρ = 1,2 кг/м³, cp = 1005 Дж/(кг·К) — как на Экранах 3 и 12). Нетто = (Q_ест − Q_мех) ÷ COP − P_вент·24 ч. Пример источника «8 − 3 − 0,5 = 4,5 кВт·ч/сутки» вычитает тепло из электроэнергии 1:1 — верно только при COP = 1; «1600 кВт·ч в год» = 4,5 × 365 дней зимних суток."
    },
    "pola": {
      "tWew": {
        "nazwa": "Температура внутри [°C]",
        "cel": "Разница температур определяет вентиляционные потери.",
        "gdzie": "Температура, которую вы держите зимой.",
        "zakres": "Ваша настройка."
      },
      "tZewn": {
        "nazwa": "Средняя наружная температура [°C]",
        "cel": "Сутки, для которых считается (средняя сезона или типичные зимние).",
        "gdzie": "Климатические данные (Модуль 1) или средние по месяцам с Экрана 1.",
        "zakres": "Ваше местоположение."
      },
      "strumienNat": {
        "nazwa": "Расход воздуха естественной вентиляции [м³/ч]",
        "cel": "Сколько воздуха обменивает гравитационная вентиляция.",
        "gdzie": "Кратность × объём (Экран 12 — тест герметичности) или анемометр на решётках.",
        "zakres": "Ваше здание — формулы тяги в приложении нет."
      },
      "szczelny": {
        "nazwa": "Новый герметичный дом",
        "cel": "Предупреждение источника: в герметичном доме естественная вентиляция не работает и грозит плесенью.",
        "gdzie": "Новые окна, мембраны, хороший результат теста герметичности.",
        "zakres": "Да / нет."
      },
      "strumienMech": {
        "nazwa": "Расход воздуха механической вентиляции [м³/ч]",
        "cel": "Производительность установки в обычном режиме.",
        "gdzie": "Проект вентиляции / настройка установки (Экран 3).",
        "zakres": "Ваша установка."
      },
      "sprawnosc": {
        "nazwa": "КПД рекуперации [%]",
        "cel": "Какая часть тепла вытяжного воздуха возвращается в дом.",
        "gdzie": "Паспорт рекуператора.",
        "zakres": "0–100% — значение из паспорта."
      },
      "wentylatory": {
        "nazwa": "Потребление вентиляторов [Вт]",
        "cel": "Электроэнергия установки круглые сутки.",
        "gdzie": "Паспорт установки (потребление при вашем расходе).",
        "zakres": "Паспорт устройства."
      },
      "cop": {
        "nazwa": "COP отопления",
        "cel": "Переводит сэкономленное тепло в сэкономленную электроэнергию.",
        "gdzie": "1 = ТЭН/электрокотёл; тепловой насос — паспорт (Экран 5).",
        "zakres": "≥ 1. Пусто = неэлектрическое отопление — без баланса."
      },
      "dni": {
        "nazwa": "Дни отопительного сезона",
        "cel": "Умножает суточную экономию на сезон.",
        "gdzie": "Число дней с отоплением в вашем месте.",
        "zakres": "До 366. Пусто = без сезонного результата."
      },
      "cena": {
        "nazwa": "Цена электроэнергии [{waluta}/кВт·ч]",
        "cel": "Переводит кВт·ч в деньги.",
        "gdzie": "Счёт или стоимость кВт·ч вашей системы.",
        "zakres": "Пусто = без {waluta} и окупаемости."
      },
      "doplata": {
        "nazwa": "Доплата за рекуперацию [{waluta}]",
        "cel": "Разница в стоимости установки по сравнению с естественной вентиляцией.",
        "gdzie": "Предложения монтажников.",
        "zakres": "Пусто = без окупаемости."
      }
    }
  },
  "kolektor-gruntowy": {
    "migawka": {
      "oCoChodzi": "Тепловой насос берёт тепло из грунта. Ему нужен правильный коллектор, иначе он как автомобиль без топлива.",
      "jakDziala": "Выберите тип коллектора и введите мощность насоса. Для горизонтального — показатель м² на 10 кВт из проекта для вашего грунта, глубину укладки и глубину промерзания; для вертикального — мощность с 1 м скважины и глубину одной скважины. Рядом с результатом показаны диапазоны источника.",
      "poCo": "Слишком маленький коллектор выхолаживает грунт — насос теряет COP и в мороз может остановиться; слишком мелкий замерзает. Слишком глубокая скважина — затраты, которые не окупаются.",
      "fizyka": "Горизонтальный: A = P/10 × показатель (источник: 60–120 м²/10 кВт, глубина 1,2–1,8 м). Вертикальный: L = P / q (источник: 50–70 Вт/м, скважины 50–100 м), число скважин = L / глубина с округлением вверх. Пример источника «8 кВт → 400 м² или 1 скважина 100 м» не следует из этих диапазонов (они дают 48–96 м² и 114–160 м) — 400 м² это 500 м²/10 кВт, 100 м это 80 Вт/м."
    },
    "pola": {
      "typ": {
        "nazwa": "Тип коллектора",
        "cel": "Горизонтальному нужен большой участок, вертикальному — буровая, спиральный компактен.",
        "gdzie": "Проект нижнего источника или доступная площадь участка.",
        "zakres": "Горизонтальный / вертикальный / спиральный (спиральный без расчёта — источник не даёт показателя)."
      },
      "moc": {
        "nazwa": "Мощность теплового насоса [кВт]",
        "cel": "Показатели источника даны на мощность насоса.",
        "gdzie": "Паспорт насоса или Экран 2 (потребность в тепле).",
        "zakres": "Обычно от нескольких до десятка с лишним кВт для дома."
      },
      "m2Na10Kw": {
        "nazwa": "Площадь на 10 кВт [м²/10 кВт]",
        "cel": "Зависит от грунта: сухому песку нужно больше, чем влажной глине.",
        "gdzie": "Проект нижнего источника / изыскания грунта.",
        "zakres": "Источник: 60–120 м² на каждые 10 кВт."
      },
      "glebokosc": {
        "nazwa": "Глубина укладки труб [м]",
        "cel": "Коллектор должен лежать ниже зоны промерзания.",
        "gdzie": "Проект земляных работ.",
        "zakres": "Источник: 1,2–1,8 м."
      },
      "przemarzanie": {
        "nazwa": "Глубина промерзания [м]",
        "cel": "Граница, выше которой коллектор замерзает (🔴).",
        "gdzie": "Карта зон промерзания для вашего места или проект.",
        "zakres": "Зависит от климатической зоны — введите значение с карты."
      },
      "wNaMetr": {
        "nazwa": "Мощность с 1 м скважины [Вт/м]",
        "cel": "Сколько мощности грунт отдаёт с каждого метра скважины.",
        "gdzie": "Проект скважины / изыскания (тест термического отклика).",
        "zakres": "Источник: около 50–70 Вт/м."
      },
      "odwiert": {
        "nazwa": "Глубина одной скважины [м]",
        "cel": "Делит общую длину на число скважин.",
        "gdzie": "Предложение буровой компании / геологические условия.",
        "zakres": "Источник: 50–100 м."
      }
    }
  },
  "alternatywne-zrodla-ciepla": {
    "migawka": {
      "oCoChodzi": "Тепловой насос — не единственный путь. Камин с водяной рубашкой, ИК-панели, капиллярные маты или аккумулятор PCM могут его дополнить — у каждого своё место и своя ловушка.",
      "jakDziala": "Выберите карточку источника. Камин: мощность и доля в воду → сколько кВт попадёт в систему, сколько в гостиную и какую часть потребности он покроет. ИК: мощность × часы → кВт·ч в сутки. Маты: Вт/м² × м² → тепловая мощность и покрытие. PCM: объём × плотность × теплота плавления → кВт·ч и эквивалент водяного буфера. Для электрокотла есть отдельный экран.",
      "poCo": "В автономной системе каждый источник тепла — это разные затраты электроэнергии и разный риск при её отсутствии: камин без гравитационного охлаждения перегреется именно тогда, когда циркуляционный насос останется без питания.",
      "fizyka": "Камин: P_вода = P × доля. ИК: E = P × t. Маты: P = q × A. PCM: Q = V × ρ × L (скрытая теплота), водяной буфер той же энергии V_в = Q / (c_в × ΔT). Пример источника «100 л PCM × 200 кДж/кг ≈ 300 л воды» сходится при плотности 1 кг/л и ΔT ≈ 16 K — источник этих данных не приводит."
    },
    "pola": {
      "zrodlo": {
        "nazwa": "Источник тепла",
        "cel": "Выбирает карточку с данными и расчётом этого источника.",
        "gdzie": "То, что вы рассматриваете как дополнение или альтернативу насосу.",
        "zakres": "Камин / электрокотёл / ИК / маты / PCM."
      },
      "zapotrzebowanie": {
        "nazwa": "Потребность в морозный день [кВт]",
        "cel": "Для расчёта, какую часть потребности покроют камин или маты.",
        "gdzie": "Экран 2 (потребность в тепле).",
        "zakres": "Необязательно; пусто = без покрытия %."
      },
      "kominekMoc": {
        "nazwa": "Мощность камина [кВт]",
        "cel": "Номинальная мощность при топке.",
        "gdzie": "Паспорт камина.",
        "zakres": "Из паспорта производителя."
      },
      "kominekUdzial": {
        "nazwa": "Доля мощности в воду [%]",
        "cel": "Часть мощности, которую водяная рубашка передаёт в систему.",
        "gdzie": "Паспорт камина (мощность в воду / полная мощность).",
        "zakres": "0–100%; пример источника: 70%."
      },
      "kominekZabezp": {
        "nazwa": "Защита при отключении электричества",
        "cel": "Без электричества циркуляционный насос стоит — рубашка должна сбрасывать тепло гравитационно или через охлаждающий змеевик.",
        "gdzie": "Проект подключения камина к буферу.",
        "zakres": "Да / нет; нет → предупреждение."
      },
      "irMoc": {
        "nazwa": "Мощность ИК-панелей [Вт]",
        "cel": "Электрическая мощность = тепловая мощность панели.",
        "gdzie": "Паспорт панели (сумма панелей).",
        "zakres": "Пример источника: 600 Вт в ванной."
      },
      "irGodzin": {
        "nazwa": "Время работы [ч/сутки]",
        "cel": "Переводит мощность в суточную энергию.",
        "gdzie": "Ваш план использования.",
        "zakres": "0–24 ч."
      },
      "irPodstawowe": {
        "nazwa": "ИК как основное отопление",
        "cel": "Источник предупреждает, что ИК — точечный обогрев.",
        "gdzie": "Ваш план отопления.",
        "zakres": "Да / нет; да → предупреждение."
      },
      "matyQ": {
        "nazwa": "Удельная мощность матов [Вт/м²]",
        "cel": "Мощность с м² при вашей температуре подачи.",
        "gdzie": "Паспорт матов (таблица мощности по температуре подачи).",
        "zakres": "Пример источника: 60 Вт/м² при 30 °C."
      },
      "matyA": {
        "nazwa": "Активная площадь [м²]",
        "cel": "Площадь потолка/стен, покрытая матами.",
        "gdzie": "Проект раскладки матов.",
        "zakres": "Ваше значение."
      },
      "matyStrop": {
        "nazwa": "Неутеплённое перекрытие",
        "cel": "Маты под неутеплённым перекрытием греют перекрытие вместо комнаты.",
        "gdzie": "Разрез перекрытия.",
        "zakres": "Да / нет; да → предупреждение."
      },
      "pcmV": {
        "nazwa": "Объём PCM [л]",
        "cel": "Количество материала с фазовым переходом.",
        "gdzie": "Проект / предложение аккумулятора PCM.",
        "zakres": "Пример источника: 100 л."
      },
      "pcmGestosc": {
        "nazwa": "Плотность PCM [кг/л]",
        "cel": "Переводит объём в массу.",
        "gdzie": "Паспорт материала.",
        "zakres": "Из паспорта материала — источник её не приводит."
      },
      "pcmL": {
        "nazwa": "Теплота плавления [кДж/кг]",
        "cel": "Энергия, поглощаемая при плавлении 1 кг.",
        "gdzie": "Паспорт материала.",
        "zakres": "Пример источника: 200 кДж/кг."
      },
      "pcmDt": {
        "nazwa": "ΔT водяного буфера [K]",
        "cel": "Для сравнения с водяным буфером той же энергии.",
        "gdzie": "Полезный диапазон температур буфера (Экран 14).",
        "zakres": "Необязательно; пусто = без сравнения."
      }
    }
  },
}
