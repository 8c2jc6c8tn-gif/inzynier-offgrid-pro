/**
 * Help content — Module 3 (PV installation). Numbers kept by the engines as constants enter
 * through `{params}`; wind and ballast rules follow PN-EN 1991-1-4 and PN-EN 1990 as the engines do.
 */
import type { Tlumaczenie } from "./typy"

const Z_KARTY = "zakres z karty katalogowej — aplikacja nie przyjmuje typowej wartości za Ciebie."
const PR = {
  nazwa: "Współczynnik wydajności instalacji PR",
  cel: "Ułamek 0–1: jaka część „teoretycznej” energii zostaje po stratach (temperatura, kable, falownik, zabrudzenie). Mnoży uzysk z nasłonecznienia.",
  gdzie: "Z projektu instalatora albo monitoringu istniejącej instalacji.",
  zakres: "0–1. Źródło aplikacji nie podaje wartości — wpisz własną.",
}
const MASA = {
  nazwa: "Masa paneli i stelaża [kg] (opcjonalnie)",
  cel: "Ciężar paneli i stelaża dociska konstrukcję do podłoża, tak jak balast. Norma PN-EN 1990 każe liczyć go ostrożnie — tylko 90% (γG,inf = 0,90), bo rzeczywista masa może być mniejsza od deklarowanej. Aplikacja pokazuje wtedy balast dodatkowy, ponad tę masę. Przesuwu i wywracania to nie sprawdza.",
  gdzie: "Masa paneli — z karty katalogowej; stelaża — od producenta albo zważ elementy. Bez balastu.",
  zakres: "Nie zgaduj: puste pole liczy balast tak, jakby konstrukcja nic nie ważyła (bezpieczniej).",
}

export const pl = {
  "typ-montazu-pola": {
    pola: {
      strefa: {
        nazwa: "Strefa obciążenia wiatrem",
        cel: "Od strefy zależy bazowa prędkość wiatru, z której norma PN-EN 1991-1-4 liczy siłę działającą na stelaż.",
        gdzie: "Z mapy stref wiatrowych w Załączniku krajowym normy PN-EN 1991-1-4 (Rysunek NA.1).",
        zakres: "Strefa 1, 2 albo 3.",
      },
      wysokoscNpm: {
        nazwa: "Wysokość terenu n.p.m. [m]",
        cel: "Powyżej 300 m wiatr w strefach 1 i 3 liczy się mocniej.",
        gdzie: "Z mapy albo danych lokalizacji. Puste pole = wysokość z danych PVGIS dla lokalizacji (jeśli są wczytane).",
        zakres: "Twoja lokalizacja.",
      },
      teren: {
        nazwa: "Kategoria terenu",
        cel: "Im bardziej otwarty teren od strony wiatru, tym silniejszy wiatr przy ziemi.",
        gdzie: "Wybierz teren, jaki ciągnie się od strony wiatru (woda, pola, zabudowa podmiejska, miasto).",
        zakres: "Opcje z listy (kategorie wg PN-EN 1991-1-4).",
      },
      zabudowa: {
        nazwa: "Zabudowa pod stelażem φ",
        cel: "Rzeczy pod panelami zmieniają przepływ wiatru i siłę podrywającą — norma uwzględnia to współczynnikiem φ.",
        gdzie: "0 = pod panelami pusto (typowy stelaż naziemny). 1 = pod panelami składowane rzeczy aż do krawędzi (drewno, skrzynie).",
        zakres: "0–1, wartości pośrednie dozwolone.",
      },
      dlugoscL: {
        nazwa: "Długość wzdłuż spadku L [m]",
        cel: "Razem z szerokością daje powierzchnię paneli, na którą działa wiatr.",
        gdzie: "Od dolnej do górnej krawędzi paneli, mierzone po ich powierzchni.",
        zakres: "Twój stelaż.",
      },
      szerokosc: {
        nazwa: "Szerokość stelaża [m]",
        cel: "W poprzek spadku — razem z L daje powierzchnię paneli.",
        gdzie: "Zmierz albo z projektu.",
        zakres: "Twój stelaż.",
      },
      krawedzRegulowany: {
        nazwa: "Dolna krawędź nad terenem [m]",
        cel: "Wysokość, na której działa wiatr — wpływa na jego prędkość i siłę.",
        gdzie: "Stała przy każdym kącie — stelaż obraca się na dolnej krawędzi.",
        zakres: "Twój stelaż.",
      },
      krawedzDachPlaski: {
        nazwa: "Dolna krawędź nad terenem [m]",
        cel: "Wysokość, na której działa wiatr — wpływa na jego prędkość i siłę.",
        gdzie: "Na dachu — wysokość budynku plus odstęp paneli od dachu.",
        zakres: "Twój stelaż.",
      },
      masa: MASA,
      azymut: {
        nazwa: "Azymut paneli [°]",
        cel: "Kierunek, w który patrzą panele — wpływa na produkcję.",
        gdzie: "Z projektu albo kompasu.",
        zakres: "180° = południe, 90° = wschód, 270° = zachód.",
      },
      gdzieStelaz: {
        nazwa: "Gdzie stoi stelaż",
        cel: "Na gruncie albo na dachu płaskim — zmienia wysokość nad terenem i warunki wiatru.",
        gdzie: "Twój projekt.",
        zakres: "Na gruncie albo na dachu płaskim.",
      },
      katStelaza: {
        nazwa: "Kąt nachylenia stelaża [°]",
        cel: "Bardziej stromy stelaż łapie więcej słońca zimą, ale mocniej go podrywa wiatr.",
        gdzie: "Z projektu stelaża.",
        zakres: "0–90°. Poniżej {progSnieg}° śnieg łatwiej zalega.",
      },
      krawedzPionowy: {
        nazwa: "Dolna krawędź paneli nad gruntem [m]",
        cel: "Panele pionowe przy ziemi zasłania trawa i śnieg — aplikacja porównuje wysokość krawędzi z zaspami.",
        gdzie: "Zmierz od gruntu do dolnej krawędzi paneli.",
        zakres: "Twój montaż.",
      },
      trawaSnieg: {
        nazwa: "Trawa lub zaspy śniegu w okolicy [cm]",
        cel: "Najwyższe, jakie zdarzają się przy panelach — nie mogą zasłaniać dolnej części.",
        gdzie: "Twoja obserwacja z poprzednich lat.",
        zakres: "Twoje warunki.",
      },
      mocPowierzchni: {
        nazwa: "Moc paneli na tej powierzchni [kWp]",
        cel: "Z mocy i nasłonecznienia powierzchni liczony jest uzysk.",
        gdzie: "Suma mocy paneli (Wp) na tej powierzchni ÷ 1000.",
        zakres: "Twój projekt.",
      },
      pr: PR,
      katMin: {
        nazwa: "Najmniejszy kąt regulacji [°]",
        cel: "Dolna granica regulacji stelaża — do porównania uzysku miesiąc po miesiącu.",
        gdzie: "Z karty stelaża.",
        zakres: "0–90°.",
      },
      katMax: {
        nazwa: "Największy kąt regulacji [°]",
        cel: "Górna granica regulacji — przy stromych kątach wiatr podrywa mocniej.",
        gdzie: "Z karty stelaża.",
        zakres: "Do 30° norma podaje siłę wiatru — powyżej balastu nie policzymy.",
      },
      dlugoscM: {
        nazwa: "Długość wiaty [m]",
        cel: "Z wymiarów połaci i paneli aplikacja liczy, ile paneli się zmieści.",
        gdzie: "Wymiar połaci po jej powierzchni (wzdłuż spadku), nie rzut z góry.",
        zakres: "Twoja wiata.",
      },
      szerokoscM: {
        nazwa: "Szerokość wiaty [m]",
        cel: "Drugi wymiar połaci.",
        gdzie: "Zmierz albo z projektu.",
        zakres: "Twoja wiata.",
      },
      dlugoscPaneluM: {
        nazwa: "Długość panelu [m]",
        cel: "Do rozmieszczenia paneli na połaci.",
        gdzie: "Z karty katalogowej panelu.",
        zakres: Z_KARTY,
      },
      szerokoscPaneluM: {
        nazwa: "Szerokość panelu [m]",
        cel: "Do rozmieszczenia paneli na połaci.",
        gdzie: "Z karty katalogowej panelu.",
        zakres: Z_KARTY,
      },
      mocPaneluW: {
        nazwa: "Moc jednego panelu [Wp]",
        cel: "Z liczby paneli daje moc instalacji na wiacie.",
        gdzie: "Z karty katalogowej (STC).",
        zakres: Z_KARTY,
      },
      nachylenieDeg: {
        nazwa: "Kąt nachylenia dachu wiaty [°]",
        cel: "Wpływa na uzysk i na samooczyszczanie paneli przez deszcz.",
        gdzie: "Z projektu wiaty.",
        zakres: "Samooczyszczanie od ok. {wiataMin}–{wiataMax}°.",
      },
    },
  },
  "typ-montazu": {
    migawka: {
      oCoChodzi:
        "Nie ma jednego „najlepszego” montażu — jest najlepszy montaż dla Twojej konkretnej działki i dachu. Ten ekran pokazuje realne liczby dla każdej opcji, nie ogólniki.",
      jakDziala:
        "Wybierasz, jak staną panele: dach skośny, kilka powierzchni, stelaż na dachu płaskim albo gruncie, stelaż z regulacją, pionowo albo wiata. Dla każdego wariantu aplikacja liczy to, co ma znaczenie: uzysk z nasłonecznienia PVGIS, wiatr i balast wg PN-EN 1991-1-4, zaleganie śniegu, liczbę paneli.",
      poCo: "Każdy wariant ma inne ryzyka: stromy stelaż — wiatr, płaski — śnieg, pionowy — zaspy i trawa. Lepiej je zobaczyć przed zakupem konstrukcji.",
    },
    pola: {
      tryb: {
        nazwa: "Sposób montażu paneli",
        cel: "Od wariantu zależy, które pola i obliczenia się pokażą.",
        gdzie: "Twój projekt i to, co masz do dyspozycji (dach, grunt, ogrodzenie, wiata).",
        zakres: "Opcje z listy.",
      },
    },
  },
  "kat-i-azymut": {
    migawka: {
      oCoChodzi:
        "Kąt i kierunek panelu decydują, ile słońca złapie w ciągu roku — to jak ustawienie parasola, tylko na odwrót: chcemy złapać jak najwięcej słońca.",
      jakDziala:
        "Aplikacja liczy nasłonecznienie płaszczyzny paneli z godzinowych danych PVGIS dla Twojej lokalizacji, miesiąc po miesiącu, przy wybranym kącie i azymucie. Dla stelaża z regulacją podaje najlepszy kąt na każdy miesiąc. Z mocą i PR przelicza to na kWh.",
      poCo: "Kąt „na lato” daje najwięcej w roku, ale mało zimą — kiedy energii brakuje najbardziej. Tu widać tę różnicę w liczbach.",
    },
    pola: {
      kat: {
        nazwa: "Kąt pochylenia paneli [°]",
        cel: "Kąt od poziomu. Bardziej strome panele dają więcej zimą, mniej latem.",
        gdzie: "Z projektu albo zmierz kątomierzem.",
        zakres: "0° = panel leży płasko, 90° = stoi pionowo.",
      },
      azymut: {
        nazwa: "Azymut paneli [°]",
        cel: "Kierunek, w który patrzy panel.",
        gdzie: "Z projektu albo kompasu.",
        zakres: "180° = południe (najlepsze), 90° = wschód, 270° = zachód.",
      },
      moc: {
        nazwa: "Moc instalacji [kWp] (opcjonalnie)",
        cel: "Do przeliczenia nasłonecznienia na kWh.",
        gdzie: "Suma mocy paneli (Wp) ÷ 1000.",
        zakres: "Twój projekt.",
      },
      pr: PR,
    },
  },
  "liczba-paneli": {
    migawka: {
      oCoChodzi:
        "Im więcej paneli „na zapas”, tym mniej będziesz się martwić w grudniu — ale to też więcej miejsca i pieniędzy na start. Wybierz świadomie, nie automatycznie największy wariant.",
      jakDziala:
        "Z nasłonecznienia Twojej lokalizacji (PVGIS), kąta, azymutu i PR aplikacja liczy, ile paneli potrzeba, żeby pokryć zużycie w czterech okresach: samo lato, marzec–październik, luty–listopad i cały rok. Obok pokazuje, ile paneli realnie zamontujesz i ile energii zabraknie zimą.",
      poCo: "Pokrycie całego roku samym PV zwykle oznacza kilka razy więcej paneli niż na lato. Ten ekran pozwala świadomie wybrać okres i uzupełnić zimę innym źródłem.",
    },
    pola: {
      azymut: {
        nazwa: "Azymut paneli [°]",
        cel: "Kierunek paneli — wpływa na uzysk.",
        gdzie: "Z projektu albo kompasu.",
        zakres: "180° = południe, 90° = wschód, 270° = zachód.",
      },
      kat: {
        nazwa: "Kąt pochylenia [°]",
        cel: "Stały kąt przez cały rok.",
        gdzie: "Najlepszy kąt dla swojej lokalizacji znajdziesz na ekranie „Kąt pochylenia i azymut”.",
        zakres: "0–90°.",
      },
      mocPanelu: {
        nazwa: "Moc jednego panelu [Wp]",
        cel: "Z niej liczona jest liczba paneli.",
        gdzie: "Z karty katalogowej (STC).",
        zakres: Z_KARTY,
      },
      powierzchniaPanelu: {
        nazwa: "Powierzchnia jednego panelu [m²] (opcjonalnie)",
        cel: "Do obliczenia powierzchni potrzebnej na panele.",
        gdzie: "Długość × szerokość z karty katalogowej.",
        zakres: Z_KARTY,
      },
      pr: PR,
      zuzycie: {
        nazwa: "Zużycie energii na dobę [kWh/dzień]",
        cel: "Ile energii panele mają pokryć każdego dnia.",
        gdzie: "Suma wszystkich odbiorników z Modułu 2 (Zapotrzebowanie).",
        zakres: "Twoje dane.",
      },
      ogrzewanie: {
        nazwa: "Dodatkowe zużycie w sezonie grzewczym [kWh/dzień]",
        cel: "Prąd na ogrzewanie (pompa, grzałki, dmuchawy, sterowanie kotła) — tylko w sezonie grzewczym.",
        gdzie: "Z ekranu „Straty ciepła budynku” (Moduł 6) — prąd na dobę przy danym COP. 0 = nie grzejesz prądem.",
        zakres: "Twoje dane.",
      },
      realnie: {
        nazwa: "Ile paneli realnie zamontujesz [szt.]",
        cel: "Porównywane z potrzebną liczbą — pokazuje, ile energii zabraknie zimą.",
        gdzie: "Ile zmieścisz na dachu i gruncie i ile udźwignie budżet.",
        zakres: "Podpowiedź {limit} szt. — praktyczny pułap dla domu (wartość właściciela projektu, nie z normy).",
      },
    },
  },
  "stress-test-mppt": {
    migawka: {
      oCoChodzi:
        "Panele zachowują się odwrotnie, niż można by się spodziewać — im zimniej, tym wyższe napięcie jałowe. Mroźny, słoneczny poranek to najgroźniejszy moment dla falownika, nie upał. Przekroczenie limitu MPPT to gwarantowane uszkodzenie sprzętu.",
      jakDziala:
        "Aplikacja liczy napięcie stringu w najzimniejszy poranek: Voc × (1 + β × (T_min − 25 °C)) × liczba paneli, i porównuje z maksymalnym napięciem wejścia falownika. Powyżej limitu — czerwony stop; od {progOstrzezenia}% limitu — ostrzeżenie.",
      poCo: "To jeden z najważniejszych twardych stopów w aplikacji. Uszkodzenie wejścia DC od przepięcia zwykle nie jest objęte gwarancją.",
      fizyka: "Voc_max = Voc_STC × (1 + β/100 × (T_min − 25)) × N. β jest ujemne, więc przy T_min poniżej 25 °C napięcie rośnie.",
    },
    pola: {
      voc: {
        nazwa: "Voc panelu przy STC (25 °C) [V]",
        cel: "Napięcie obwodu otwartego — punkt wyjścia obliczenia.",
        gdzie: "Z karty katalogowej panelu.",
        zakres: Z_KARTY,
      },
      beta: {
        nazwa: "Współczynnik temperaturowy Voc (β) [%/°C]",
        cel: "O ile procent rośnie napięcie na każdy stopień poniżej 25 °C.",
        gdzie: "Z karty katalogowej panelu. Wartość ujemna.",
        zakres: "Typowo od {betaMin} do {betaMax} %/°C.",
      },
      tmin: {
        nazwa: "Minimalna temperatura w lokalizacji (T_min) [°C]",
        cel: "Najzimniejszy poranek, w którym słońce oświetli panele.",
        gdzie: "Z danych klimatycznych lokalizacji (docelowo z Modułu 1).",
        zakres: "Twoja lokalizacja.",
      },
      liczbaPaneli: {
        nazwa: "Liczba paneli w stringu [szt.]",
        cel: "Napięcia paneli w szeregu się sumują.",
        gdzie: "Z projektu stringu.",
        zakres: "Twój projekt.",
      },
      limit: {
        nazwa: "Maksymalne napięcie wejściowe MPPT / falownika [V]",
        cel: "Granica, której napięcie stringu na mrozie nie może przekroczyć.",
        gdzie: "Z karty katalogowej falownika — przekroczenie może trwale uszkodzić wejście DC.",
        zakres: Z_KARTY,
      },
    },
  },
  "napor-wiatru": {
    migawka: {
      oCoChodzi:
        "Panel działa trochę jak żagiel — wiatr może go pchać, ale też „zajrzeć” pod spód i ciągnąć do góry jak skrzydło samolotu.",
      jakDziala:
        "Aplikacja liczy siłę wiatru na panel: ½ × gęstość powietrza × prędkość² × powierzchnia × współczynnik oporu Cd, i balast potrzebny do jej zrównoważenia. Masę paneli i stelaża liczy tylko w 90% (PN-EN 1990). Porównuje wynik z planowanym balastem.",
      poCo: "Zerwany przez wiatr stelaż to zniszczone panele i realne zagrożenie dla ludzi. Balast „na oko” to częsty błąd.",
      fizyka: "F = ½ · ρ · v² · A · Cd (ρ powietrza ≈ 1,225 kg/m³). Siła rośnie z kwadratem prędkości — dwa razy silniejszy wiatr to cztery razy większa siła.",
    },
    pola: {
      predkosc: {
        nazwa: "Prędkość wiatru [m/s]",
        cel: "Siła rośnie z kwadratem prędkości.",
        gdzie: "Prędkość projektowa dla Twojej lokalizacji (np. z normy wiatrowej albo ekranu „Złoty środek”).",
        zakres: "Twoja lokalizacja.",
      },
      powierzchnia: {
        nazwa: "Powierzchnia panelu [m²]",
        cel: "Powierzchnia, na którą działa wiatr.",
        gdzie: "Długość × szerokość z karty katalogowej.",
        zakres: Z_KARTY,
      },
      cd: {
        nazwa: "Współczynnik oporu Cd",
        cel: "Jak mocno kształt panelu stawia opór wiatrowi.",
        gdzie: "Z opracowań aerodynamicznych albo projektu konstrukcji.",
        zakres: "Typowo {cdMin}–{cdMax} dla paneli PV.",
      },
      balast: {
        nazwa: "Planowany balast [kg] (opcjonalnie)",
        cel: "Aplikacja porówna go z balastem projektowym.",
        gdzie: "Ile balastu planujesz dać.",
        zakres: "Twój projekt.",
      },
      masa: MASA,
    },
  },
  "mikropekniecia-termiczne": {
    migawka: {
      oCoChodzi:
        "Materiały „oddychają” przy zmianach temperatury inaczej — trzeba im dać trochę luzu, inaczej pękają od środka, niewidocznie.",
      jakDziala:
        "Panele nagrzewają się w słońcu do {tMin}–{tMax} °C, a przy nagłym deszczu chłodzą o {schlodzenie} °C w kilka minut. Aplikacja sprawdza odstęp dylatacyjny między panelami — poniżej {odstepMin} mm grozi mikropęknięciami w ciągu ok. {lata} lat.",
      poCo: "Mikropęknięć nie widać gołym okiem, ale obniżają moc i tworzą gorące punkty. Kilka milimetrów luzu przy montażu im zapobiega.",
    },
    pola: {
      odstep: {
        nazwa: "Odstęp dylatacyjny między panelami [mm]",
        cel: "Luz między sąsiednimi panelami w rzędzie na rozszerzalność cieplną.",
        gdzie: "Z projektu montażu albo zmierz. 0 = montaż na styk.",
        zakres: "Zalecane minimum: {odstepMin} mm.",
      },
    },
  },
  "straty-okablowanie-dc": {
    migawka: {
      oCoChodzi:
        "Prąd płynący kablem zawsze trochę go grzeje — to normalne, ale zbyt cienki kabel zamienia w ciepło więcej energii, niż powinien.",
      jakDziala: "Aplikacja liczy rezystancję kabla (tam i z powrotem), stratę mocy I²R i jej udział w mocy stringu. Cel: straty poniżej {cel}%.",
      poCo: "Każdy procent strat to procent energii traconej przez całe życie instalacji — często taniej dać grubszy kabel.",
      fizyka: "R = ρ · 2L / S; P_strat = I² · R (miedź ρ ≈ 0,0175 Ω·mm²/m).",
    },
    pola: {
      dlugosc: {
        nazwa: "Długość kabla panel → falownik (jedna strona) [m]",
        cel: "Aplikacja sama liczy drogę tam i z powrotem.",
        gdzie: "Zmierz po trasie prowadzenia.",
        zakres: "Twoja instalacja.",
      },
      prad: {
        nazwa: "Prąd roboczy (Imp) [A]",
        cel: "Prąd płynący kablem przy pracy w punkcie mocy maksymalnej.",
        gdzie: "Z karty panelu (Imp) × liczba stringów równoległych na tym kablu.",
        zakres: Z_KARTY,
      },
      napiecie: {
        nazwa: "Napięcie robocze (Vmp) [V]",
        cel: "Do obliczenia mocy stringu i procentu strat.",
        gdzie: "Vmp panelu × liczba paneli w stringu.",
        zakres: Z_KARTY,
      },
      przekroj: {
        nazwa: "Przekrój kabla [mm²]",
        cel: "Większy przekrój = mniejsza rezystancja i straty.",
        gdzie: "Z oznaczenia kabla solarnego (np. 4 albo 6 mm²).",
        zakres: "Przekroje handlowe kabli solarnych.",
      },
    },
  },
  "konfigurator-stringow": {
    migawka: {
      oCoChodzi:
        "Szereg dodaje napięcia, równoległe dodaje prądy — jak łączenie ogniw latarki: jedna za drugą (szereg) albo obok siebie (równolegle).",
      jakDziala: "Wybierasz tryb (szereg, równolegle, mieszany) i dane panelu. Aplikacja liczy napięcie i prąd całej tablicy.",
      poCo: "Od konfiguracji zależy, czy tablica zmieści się w oknie napięcia i prądu falownika — sprawdzisz to w „Dopasowaniu tablicy do falownika”.",
    },
    pola: {
      tryb: {
        nazwa: "Tryb połączenia",
        cel: "Szereg, równolegle albo grupy szeregowe połączone równolegle.",
        gdzie: "Twój projekt.",
        zakres: "Opcje z listy.",
      },
      vmp: {
        nazwa: "Napięcie Vmp panelu [V]",
        cel: "Napięcie pracy panelu — sumuje się w szeregu.",
        gdzie: "Z karty katalogowej panelu.",
        zakres: Z_KARTY,
      },
      imp: {
        nazwa: "Prąd Imp panelu [A]",
        cel: "Prąd pracy panelu — sumuje się równolegle.",
        gdzie: "Z karty katalogowej panelu.",
        zakres: Z_KARTY,
      },
      szereg: {
        nazwa: "Paneli w grupie (szereg) [szt.]",
        cel: "Ile paneli połączonych szeregowo w jednej grupie.",
        gdzie: "Twój projekt.",
        zakres: "Twój projekt.",
      },
      grupy: {
        nazwa: "Liczba grup (równolegle) [szt.]",
        cel: "Ile grup szeregowych połączonych równolegle.",
        gdzie: "Twój projekt.",
        zakres: "Twój projekt.",
      },
      liczba: {
        nazwa: "Liczba paneli [szt.]",
        cel: "Łączna liczba paneli w trybie czysto szeregowym albo równoległym.",
        gdzie: "Twój projekt.",
        zakres: "Do {max} szt. (kontrola sensowności).",
      },
    },
  },
  "diody-bocznikujace": {
    migawka: {
      oCoChodzi: "Diody to objazdy dla prądu — dzięki nim cień na kawałku panelu nie zatrzymuje całego panelu.",
      jakDziala:
        "Panel jest podzielony na {sekcje} sekcje ogniw, każda z własną diodą. Gdy sekcja jest zacieniona, dioda pozwala prądowi ją ominąć — aplikacja pokazuje, jaka część mocy panelu zostaje przy danej liczbie zacienionych sekcji.",
      poCo: "Bez diod zacienione ogniwa przegrzewają się (hot-spot) i niszczą panel.",
    },
    pola: {
      sekcje: {
        nazwa: "Liczba zacienionych sekcji",
        cel: "Każda zacieniona sekcja jest omijana przez diodę — traci się jej udział w mocy.",
        gdzie: "Obserwacja: które pasy panelu obejmuje cień.",
        zakres: "0–{sekcje}.",
      },
    },
  },
  "zacienienie-diody-bocznikujace": {
    migawka: {
      oCoChodzi:
        "Jeden cień potrafi „położyć” cały string, nie tylko zacieniony panel — jak korek na jednym pasie, który spowalnia cały ruch.",
      jakDziala: "Aplikacja liczy stratę mocy panelu przy danej liczbie zacienionych sekcji i jej wpływ na cały string połączony szeregowo.",
      poCo: "Żeby wiedzieć, czy cień (komin, drzewo) uzasadnia optymalizatory albo mikroinwertery, czy wystarczy inny układ stringów.",
    },
    pola: {
      moc: {
        nazwa: "Moc znamionowa panelu (STC) [W]",
        cel: "Punkt wyjścia obliczenia straty.",
        gdzie: "Z karty katalogowej.",
        zakres: Z_KARTY,
      },
      sekcje: {
        nazwa: "Liczba zacienionych sekcji panelu",
        cel: "Każda zacieniona sekcja jest omijana przez diodę.",
        gdzie: "Obserwacja cienia na panelu.",
        zakres: "0–{sekcje}.",
      },
      liczbaPaneli: {
        nazwa: "Liczba paneli w stringu (szeregowo) [szt.]",
        cel: "Do oceny wpływu na cały string.",
        gdzie: "Z projektu stringu.",
        zakres: "Twój projekt.",
      },
    },
  },
  "dopasowanie-tablicy-falownika": {
    migawka: {
      oCoChodzi:
        "Nie wystarczy sprawdzić jednego parametru — falownik i panele muszą pasować naraz: napięcie zimą, napięcie latem, prąd i stosunek mocy.",
      jakDziala:
        "Aplikacja sprawdza cztery kryteria: Voc na mrozie poniżej maksymalnego napięcia DC, Vmp w oknie MPPT, prąd stringu poniżej limitu MPPT i stosunek mocy DC/AC (zalecane {dcacMin}–{dcacMax}).",
      poCo: "Za wysokie napięcie zimą uszkadza falownik; za niskie latem wypycha pracę poza okno MPPT i traci się energię.",
    },
    pola: {
      voc: { nazwa: "Voc panelu (STC) [V]", cel: "Napięcie jałowe — do sprawdzenia napięcia zimą.", gdzie: "Z karty panelu.", zakres: Z_KARTY },
      vmp: { nazwa: "Vmp panelu (STC) [V]", cel: "Napięcie pracy — do sprawdzenia okna MPPT.", gdzie: "Z karty panelu.", zakres: Z_KARTY },
      imp: { nazwa: "Prąd roboczy panelu (Imp) [A]", cel: "Porównywany z maksymalnym prądem MPPT.", gdzie: "Z karty panelu.", zakres: Z_KARTY },
      beta: {
        nazwa: "Współczynnik temperaturowy Voc (β) [%/°C]",
        cel: "O ile rośnie napięcie na mrozie.",
        gdzie: "Z karty katalogowej panelu. Wartość ujemna.",
        zakres: "Typowo od {betaMin} do {betaMax} %/°C.",
      },
      tmin: { nazwa: "Minimalna temperatura w lokalizacji (T_min) [°C]", cel: "Najzimniejszy poranek z pracującymi panelami.", gdzie: "Z danych klimatycznych lokalizacji.", zakres: "Twoja lokalizacja." },
      liczbaPaneli: { nazwa: "Liczba paneli w stringu [szt.]", cel: "Napięcia paneli się sumują.", gdzie: "Z projektu stringu.", zakres: "Twój projekt." },
      maxDc: { nazwa: "Maksymalne napięcie DC falownika [V]", cel: "Granica napięcia zimą.", gdzie: "Z karty falownika.", zakres: Z_KARTY },
      mpptMin: { nazwa: "Okno MPPT — dolna granica [V]", cel: "Poniżej niej falownik nie śledzi punktu mocy maksymalnej.", gdzie: "Z karty falownika.", zakres: Z_KARTY },
      mpptMax: { nazwa: "Okno MPPT — górna granica [V]", cel: "Powyżej niej falownik ogranicza produkcję.", gdzie: "Z karty falownika.", zakres: Z_KARTY },
      maxPrad: { nazwa: "Maksymalny prąd MPPT [A]", cel: "Porównywany z prądem stringu.", gdzie: "Z karty falownika.", zakres: Z_KARTY },
      mocAc: {
        nazwa: "Moc znamionowa AC falownika [W]",
        cel: "Do stosunku mocy DC/AC.",
        gdzie: "Z karty falownika.",
        zakres: "Stosunek DC/AC zalecany {dcacMin}–{dcacMax}.",
      },
    },
  },
  "technologie-paneli": {
    migawka: {
      oCoChodzi: "Technologia paneli to nie marketing. Ma realny wpływ na produkcję.",
      jakDziala: "Tabela porównuje Half-Cut, PERC, TOPCon, HJT i panele cienkowarstwowe: sprawność, tempo starzenia, zachowanie w cieple i cieniu. Opcjonalnie liczy, ile m² zajmie każda technologia przy Twojej mocy.",
      poCo: "Przy ograniczonym dachu liczy się sprawność; przy upałach — współczynnik temperaturowy; przy długim horyzoncie — tempo starzenia.",
    },
    pola: {
      moc: {
        nazwa: "Planowana moc instalacji [kWp] (opcjonalnie)",
        cel: "Żeby zobaczyć, ile m² modułów zajmie każda technologia.",
        gdzie: "Twój projekt.",
        zakres: "Twój projekt.",
      },
    },
  },
  "panele-bifacjalne": {
    migawka: {
      oCoChodzi: "Panele bifacjalne zbierają światło także z dołu — ale tylko jeśli dasz im jasne tło, od którego światło się odbije.",
      jakDziala: "Do rocznego uzysku przedniej strony aplikacja dodaje procent z tylnej strony, typowy dla rodzaju powierzchni pod spodem (trawa, piasek, śnieg, jasna membrana).",
      poCo: "Na ciemnym dachu bifacjalny panel daje niewiele więcej niż zwykły — dopłata ma sens tylko przy jasnym, odbijającym podłożu i wysokim montażu.",
    },
    pola: {
      uzyskPrzod: {
        nazwa: "Roczny uzysk z przedniej strony [kWh]",
        cel: "Uzysk jak dla zwykłego panelu — punkt wyjścia.",
        gdzie: "Z ekranu „Kąt pochylenia i azymut” albo projektu.",
        zakres: "Twoja instalacja.",
      },
      powierzchnia: {
        nazwa: "Typ powierzchni pod panelami",
        cel: "Od jasności podłoża zależy, ile światła odbije się na tył panelu.",
        gdzie: "Co jest pod panelami.",
        zakres: "Opcje z listy (z typowym zakresem uzysku przy każdej).",
      },
      uzyskTyl: {
        nazwa: "Dodatkowy uzysk z tylnej strony [%]",
        cel: "Procent dodawany do uzysku przedniej strony.",
        gdzie: "Z karty panelu (współczynnik bifacjalności) i typowego zakresu dla wybranej powierzchni.",
        zakres: "Typowy zakres pokazany przy wybranej powierzchni.",
      },
    },
  },
  "niedopasowanie-paneli": {
    migawka: {
      oCoChodzi: "String działa jak zespół wioślarzy — tempo narzuca najsłabszy. Mieszanie mocnych i słabych paneli w jednym stringu marnuje potencjał mocniejszych.",
      jakDziala: "Aplikacja porównuje dwa panele: w szeregu prąd całego stringu ogranicza panel o niższym Imp. Różnica mocy powyżej {ostrzezenie}% to ostrzeżenie, powyżej {krytyczna}% — krytycznie.",
      poCo: "Dołożenie nowych, mocniejszych paneli do starego stringu często nie daje prawie nic — lepiej zrobić osobny string.",
    },
    pola: {
      moc1: { nazwa: "Moc panelu 1 [W]", cel: "Do porównania mocy paneli.", gdzie: "Z karty katalogowej.", zakres: Z_KARTY },
      imp1: { nazwa: "Prąd roboczy panelu 1 (Imp) [A]", cel: "W szeregu decyduje najniższy prąd.", gdzie: "Z karty katalogowej.", zakres: Z_KARTY },
      moc2: { nazwa: "Moc panelu 2 [W]", cel: "Do porównania mocy paneli.", gdzie: "Z karty katalogowej.", zakres: Z_KARTY },
      imp2: { nazwa: "Prąd roboczy panelu 2 (Imp) [A]", cel: "W szeregu decyduje najniższy prąd.", gdzie: "Z karty katalogowej.", zakres: Z_KARTY },
      vmp: {
        nazwa: "Wspólne napięcie robocze stringu (Vmp) [V]",
        cel: "Do obliczenia mocy traconej na niedopasowaniu.",
        gdzie: "Vmp paneli × liczba w stringu.",
        zakres: Z_KARTY,
      },
    },
  },
  "wplyw-temperatury": {
    migawka: {
      oCoChodzi: "Panele nie lubią upałów — paradoksalnie najzimniejszy słoneczny dzień daje więcej mocy niż najgorętszy.",
      jakDziala: "Aplikacja liczy temperaturę panelu (otoczenie + przyrost od słońca) i spadek mocy: γ × (T_panelu − 25 °C).",
      poCo: "W upale panel może oddawać o kilkanaście procent mniej, niż ma na tabliczce — trzeba to uwzględnić w bilansie i doborze falownika.",
      fizyka: "P = P_STC × (1 + γ/100 × (T_panelu − 25)). γ jest ujemne.",
    },
    pola: {
      tOtoczenia: { nazwa: "Temperatura otoczenia [°C]", cel: "Punkt wyjścia do temperatury panelu.", gdzie: "Twoje warunki (np. upalny dzień).", zakres: "Twoje warunki." },
      przyrost: {
        nazwa: "Przyrost temperatury panelu ponad otoczenie [°C]",
        cel: "Nagrzewanie panelu od słońca.",
        gdzie: "Z karty (NOCT) albo pomiaru.",
        zakres: "Typowo {przyrostMin}–{przyrostMax} °C.",
      },
      gamma: {
        nazwa: "Współczynnik temperaturowy mocy γ [%/°C]",
        cel: "O ile procent spada moc na każdy stopień powyżej 25 °C.",
        gdzie: "Z karty katalogowej panelu.",
        zakres: "Typowo od {gammaMin} do {gammaMax} %/°C.",
      },
      moc: { nazwa: "Moc nominalna panelu (STC, 25 °C) [W]", cel: "Punkt odniesienia.", gdzie: "Z karty katalogowej.", zakres: Z_KARTY },
    },
  },
  "wschod-zachod": {
    migawka: {
      oCoChodzi: "Nie masz idealnego południowego dachu? Wschód-zachód to nie kompromis, to inna strategia — czasem lepiej dopasowana do tego, kiedy realnie zużywasz prąd.",
      jakDziala: "Aplikacja porównuje roczny uzysk paneli na dwóch połaciach (wschód + zachód) z panelami na południe i pokazuje rozkład produkcji w ciągu dnia. Typowo daje to {stosunekMin}–{stosunekMax}% uzysku układu południowego.",
      poCo: "Układ wschód-zachód daje mniej w południe, ale więcej rano i wieczorem — mniej energii trzeba przechowywać w magazynie.",
    },
    pola: {
      wschodKat: { nazwa: "Wschód — nachylenie [°]", cel: "Kąt połaci wschodniej.", gdzie: "Z projektu dachu.", zakres: "0–90°." },
      wschodAzymut: { nazwa: "Wschód — azymut [°]", cel: "Kierunek połaci wschodniej.", gdzie: "Z projektu albo kompasu.", zakres: "Wschód = 90°." },
      zachodKat: { nazwa: "Zachód — nachylenie [°]", cel: "Kąt połaci zachodniej.", gdzie: "Z projektu dachu.", zakres: "0–90°." },
      zachodAzymut: { nazwa: "Zachód — azymut [°]", cel: "Kierunek połaci zachodniej.", gdzie: "Z projektu albo kompasu.", zakres: "Zachód = 270°." },
      udzial: {
        nazwa: "Udział mocy paneli na połaci wschodniej [%]",
        cel: "Reszta mocy trafia na zachód.",
        gdzie: "Twój projekt. Przy tej samej liczbie paneli na obu połaciach wpisz 50.",
        zakres: "0–100%.",
      },
    },
  },
  "mikroinwertery-vs-centralny": {
    migawka: {
      oCoChodzi: "Cień to wróg klasycznej instalacji szeregowej. Mikroinwerter daje każdemu panelowi niezależność od sąsiadów.",
      jakDziala: "Aplikacja porównuje mikroinwertery (osobny falownik przy każdym panelu) z inwerterem centralnym. W off-gridzie mikroinwertery wymagają falownika wyspowego z AC-coupling — bez niego czerwony stop.",
      poCo: "Mikroinwertery wygrywają przy cieniu i nierównych połaciach, ale w instalacji wyspowej bez sprzężenia AC nie da się ich bezpiecznie ograniczyć, gdy magazyn jest pełny.",
    },
    pola: {
      cien: {
        nazwa: "Częściowe lub regularne zacienienie paneli",
        cel: "Przy cieniu mikroinwertery tracą dużo mniej niż string szeregowy.",
        gdzie: "Drzewa, komin, sąsiedni budynek, lukarna — cień, który co dzień pada na część paneli.",
        zakres: "Tak albo nie.",
      },
      acCoupling: {
        nazwa: "Falownik wyspowy z AC-coupling",
        cel: "Falownik off-grid, który sam tworzy sieć 230 V/50 Hz i potrafi ograniczyć moc mikroinwerterów, gdy magazyn jest pełny (zwykle przesunięciem częstotliwości).",
        gdzie: "W karcie katalogowej falownika: hasło „AC coupling” i lista zgodnych mikroinwerterów.",
        zakres: "Tak, nie albo nie wiem. „Nie” albo „nie wiem” w off-gridzie — czerwony stop.",
      },
    },
  },
  "ochrona-stringow": {
    migawka: {
      oCoChodzi: "Chroń każdy string osobno, żeby awaria jednego nie pociągnęła za sobą reszty instalacji.",
      jakDziala:
        "Wg HD 60364-7-712 aplikacja sprawdza, czy bezpieczniki stringowe są obowiązkowe (od {progStringow} stringów równoległych, gdy prąd wsteczny przekracza zdolność modułu) i czy dobrany bezpiecznik mieści się w oknie: ≥ {k1} × Isc i ≤ prąd I_MOD_MAX_OCPR z karty.",
      poCo: "Przy zwarciu w jednym stringu pozostałe mogą wpychać w niego swój prąd — bez bezpiecznika kabel i panel mogą się zapalić.",
    },
    pola: {
      isc: { nazwa: "Prąd zwarciowy panelu przy STC (Isc) [A]", cel: "Dolna granica bezpiecznika i prąd wsteczny.", gdzie: "Z karty katalogowej panelu.", zakres: Z_KARTY },
      ocpr: {
        nazwa: "Maksymalny prąd zabezpieczenia modułu (I_MOD_MAX_OCPR) [A]",
        cel: "Górna granica bezpiecznika — tyle prądu wstecznego moduł wytrzyma.",
        gdzie: "Z karty katalogowej panelu („Maximum series fuse rating”).",
        zakres: Z_KARTY,
      },
      stringi: { nazwa: "Liczba stringów równoległych [szt.]", cel: "Od niej zależy, czy bezpieczniki są obowiązkowe.", gdzie: "Z projektu.", zakres: "Od {progStringow} — sprawdzany obowiązek zabezpieczenia." },
      bezpiecznik: { nazwa: "Prąd znamionowy wybranego bezpiecznika [A]", cel: "Sprawdzany wobec okna ≥ {k1} × Isc i ≤ I_MOD_MAX_OCPR.", gdzie: "Z karty bezpiecznika gPV.", zakres: Z_KARTY },
    },
  },
  "czystosc-i-snieg": {
    migawka: {
      oCoChodzi: "Zasypany panel to martwy panel, a wiatr rozkłada śnieg nierównomiernie. Trzy tematy uzupełniają się nawzajem: śnieg, deszcz i mycie.",
      jakDziala:
        "Z kąta pochylenia aplikacja ocenia, czy śnieg zalega (do {katZaleganie}°), zsuwa się częściowo (do {katPrzejsciowy}°), czy deszcz spłukuje brud (do {katSplukiwanie}°). Ze spadku produkcji względem oczekiwanej ocenia, czy czas na mycie (od {progMycia}%).",
      poCo: "Płaskie panele trzymają śnieg i brud — mycie i odśnieżanie to realny zysk energii zimą i wiosną.",
    },
    pola: {
      kat: { nazwa: "Kąt pochylenia panelu [°]", cel: "Decyduje, czy śnieg i brud zsuwają się same.", gdzie: "Z projektu albo kątomierzem.", zakres: "0–90°." },
      spadek: {
        nazwa: "Spadek produkcji względem oczekiwanej [%]",
        cel: "Sygnał, że panele wymagają mycia.",
        gdzie: "Porównaj monitoring falownika z produkcją w podobny słoneczny dzień po myciu albo z prognozą.",
        zakres: "Od {progMycia}% — zalecane mycie.",
      },
    },
  },
  "powloki-antyrefleksyjne": {
    migawka: {
      oCoChodzi: "Nie odbijaj słońca — wchłoń je. Powłoka antyrefleksyjna pomaga panelowi „złapać” więcej z tego, co i tak na niego pada.",
      jakDziala: "Powłoka i teksturowane szkło zmniejszają odbicie światła — typowo +{wzrostMin}–{wzrostMax}% uzysku rocznie. Aplikacja przelicza to na kWh Twojej instalacji.",
      poCo: "Żeby ocenić, czy dopłata za panele z powłoką zwróci się w dodatkowej energii.",
    },
    pola: {
      uzysk: {
        nazwa: "Roczny uzysk instalacji bez powłoki [kWh/rok] (opcjonalnie)",
        cel: "Żeby zobaczyć, ile to kWh w Twojej instalacji.",
        gdzie: "Z ekranu „Kąt pochylenia i azymut” albo monitoringu.",
        zakres: "Twoja instalacja.",
      },
    },
  },
  "warunki-nadmorskie-pyliste": {
    migawka: {
      oCoChodzi: "Morze i pustynia to trudne środowiska dla elektroniki — nie każdy panel i nie każda złączka są do tego przystosowane.",
      jakDziala: "Wybierasz typ lokalizacji. Aplikacja podaje wymagania: odporność na mgłę solną (korozja ram i połączeń), na piasek i pył (rysowanie szkła) i na PID przy wysokiej wilgotności.",
      poCo: "Panel bez certyfikatu odporności na mgłę solną nad morzem może stracić moc i gwarancję w kilka lat.",
    },
    pola: {
      typ: { nazwa: "Typ lokalizacji", cel: "Od środowiska zależą wymagania wobec paneli i osprzętu.", gdzie: "Twoja lokalizacja.", zakres: "Nadmorska, pylista albo standardowa." },
    },
  },
  "ryzyko-pid": {
    migawka: {
      oCoChodzi:
        "W długich stringach napięcie panelu względem ramy może przekroczyć kilkaset woltów. Przy wilgotnej pogodzie jony sodu ze szkła migrują pod wpływem tego napięcia i trwale obniżają moc (PID).",
      jakDziala: "Aplikacja porównuje napięcie systemu DC względem ziemi z progiem {prog} V — powyżej zaleca panele odporne na PID albo środki zaradcze.",
      poCo: "PID potrafi obniżyć moc stringu o kilkadziesiąt procent w ciągu kilku lat — i nie widać go bez pomiarów.",
    },
    pola: {
      napiecie: { nazwa: "Napięcie systemu DC względem ziemi [V]", cel: "Porównywane z progiem ryzyka PID.", gdzie: "Voc panelu × liczba paneli w stringu.", zakres: "Próg ryzyka: {prog} V." },
    },
  },
  "tracker-vs-staly": {
    migawka: {
      oCoChodzi: "Tracker brzmi zaawansowanie, ale w praktyce często taniej i bezpieczniej wychodzi dokupić więcej paneli na stałym stelażu.",
      jakDziala: "Tracker zwiększa uzysk o {zyskMin}–{zyskMax}%. Aplikacja porównuje ten zysk z tym, ile dodatkowych paneli kupisz za koszt trackera, i ile energii one dadzą.",
      poCo: "Tracker ma ruchome części, silniki i serwis; dodatkowe panele — nie. Liczby pokazują, co się bardziej opłaca.",
    },
    pola: {
      liczbaPaneli: { nazwa: "Liczba paneli na trackerze [szt.]", cel: "Do obliczenia zysku z trackera.", gdzie: "Twój projekt.", zakres: "Twój projekt." },
      kosztTrackera: { nazwa: "Koszt trackera (mechanizm + fundament) [zł]", cel: "Tyle, ile tracker kosztuje więcej niż zwykły stelaż pod te same panele.", gdzie: "Z oferty.", zakres: "Twoja cena." },
      kosztPanelu: { nazwa: "Koszt jednego dodatkowego panelu na stałym stelażu [zł]", cel: "Panel razem z jego częścią stelaża, okablowania i montażu.", gdzie: "Z oferty.", zakres: "Twoja cena." },
      uzyskPanelu: {
        nazwa: "Roczny uzysk jednego panelu na stałym stelażu [kWh/rok]",
        cel: "Punkt odniesienia dla obu wariantów.",
        gdzie: "Np. z ekranu „Kąt pochylenia i azymut” (uzysk instalacji ÷ liczba paneli).",
        zakres: "Twoja lokalizacja.",
      },
    },
  },
  "straty-zlaczki-mc4": {
    migawka: {
      oCoChodzi: "Małe złączki, duże znaczenie — luźny styk MC4 to jedna z najczęstszych przyczyn awarii i pożarów instalacji PV, mimo że wygląda niepozornie.",
      jakDziala: "Aplikacja liczy moc traconą na złączkach: I² × R × liczba złączek, i porównuje stan dobry ({rMin}–{rMax} mΩ) ze złym stykiem (nawet {mnoznik}× więcej).",
      poCo: "Zła złączka grzeje się w jednym punkcie — to początek łuku i pożaru na dachu.",
      fizyka: "P_strat = I² · R_złączki · n.",
    },
    pola: {
      rezystancja: { nazwa: "Rezystancja jednej złączki [mΩ]", cel: "Rezystancja styku.", gdzie: "Z pomiaru miliomomierzem albo karty złączki.", zakres: "Dobry stan: {rMin}–{rMax} mΩ. Luźna/zaśniedziała: nawet {mnoznik}× więcej." },
      liczba: { nazwa: "Liczba złączek [szt.]", cel: "Straty się sumują.", gdzie: "Policz pary złączek w stringu.", zakres: "Twoja instalacja." },
      prad: { nazwa: "Prąd [A]", cel: "Straty rosną z kwadratem prądu.", gdzie: "Imp stringu z karty panelu.", zakres: Z_KARTY },
    },
  },
  "zloty-srodek": {
    migawka: {
      oCoChodzi:
        "Najwyższa produkcja teoretyczna rzadko jest najlepszym wyborem w praktyce — czasem warto oddać 5–6% energii, żeby radykalnie obniżyć ryzyko uszkodzenia instalacji.",
      jakDziala:
        "Dla każdego kąta aplikacja liczy dwie strony: wartość energii w okresie analizy (PVGIS × moc × PR × cena kWh) i koszt balastu potrzebnego wg normy wiatrowej PN-EN 1991-1-4 (masa paneli liczona w 90% wg PN-EN 1990). Wskazuje kąt z najlepszym bilansem.",
      poCo: "Stromy stelaż łapie więcej słońca zimą, ale wiatr podrywa go mocniej — balast i ryzyko rosną szybciej niż uzysk.",
    },
    pola: {
      azymut: { nazwa: "Azymut paneli [°]", cel: "Kierunek paneli — wpływa na uzysk.", gdzie: "Z projektu albo kompasu.", zakres: "180° = południe, 90° = wschód, 270° = zachód." },
      katSprawdz: { nazwa: "Sprawdź dowolny kąt [°]", cel: "Pokazuje energię, balast i bilans dla wybranego kąta.", gdzie: "Przesuń suwak.", zakres: "0–90°." },
      wysokoscStelaza: { nazwa: "Wysokość górnej krawędzi stelaża [m]", cel: "Na tej wysokości liczony jest wiatr.", gdzie: "Od gruntu do najwyższego punktu paneli.", zakres: "Twój stelaż." },
      powierzchnia: { nazwa: "Powierzchnia paneli na stelażu [m²]", cel: "Na nią działa wiatr.", gdzie: "Suma powierzchni paneli na jednym stelażu (np. 6 × 1,95 m²).", zakres: "Twój stelaż." },
      cenaBalastu: { nazwa: "Cena balastu [zł/kg]", cel: "Wycenia balast potrzebny przy każdym kącie.", gdzie: "Twoja cena.", zakres: "Podpowiedź {cena} zł/kg — bloczki odlane samodzielnie z betonu (wartość właściciela projektu, nie z normy)." },
      moc: { nazwa: "Moc paneli na stelażu [kWp]", cel: "Z nią i nasłonecznieniem liczona jest energia.", gdzie: "Suma mocy paneli ÷ 1000.", zakres: "Twój projekt." },
      pr: PR,
      wartoscKwh: { nazwa: "Wartość 1 kWh [zł]", cel: "Wycenia energię przy każdym kącie.", gdzie: "Ile płaciłbyś za tę energię z innego źródła (sieć, agregat).", zakres: "Twoja cena." },
      okres: { nazwa: "Okres analizy [lat]", cel: "Przez ile lat liczyć wartość energii.", gdzie: "Tyle, ile ma stać instalacja.", zakres: "Twój wybór." },
    },
  },
}

// ————————————————————————————— EN —————————————————————————————

const Z_KARTY_EN = "range from the datasheet — the app does not assume a typical value for you."
const PR_EN = {
  nazwa: "Performance ratio PR",
  cel: "A fraction 0–1: what part of the “theoretical” energy remains after losses (temperature, cables, inverter, soiling). It multiplies the insolation yield.",
  gdzie: "From the installer's design or the monitoring of an existing installation.",
  zakres: "0–1. The app's source gives no value — enter your own.",
}
const MASA_EN = {
  nazwa: "Mass of panels and frame [kg] (optional)",
  cel: "The weight of the panels and frame holds the structure down, like ballast. EN 1990 requires counting it cautiously — only 90% (γG,inf = 0.90), because the real mass may be less than declared. The app then shows the additional ballast beyond that mass. It does not check sliding or overturning.",
  gdzie: "Panel mass — from the datasheet; frame — from the manufacturer or weigh the parts. Without ballast.",
  zakres: "Don't guess: an empty field calculates ballast as if the structure weighed nothing (safer).",
}

export const en: Tlumaczenie<typeof pl> = {
  "typ-montazu-pola": {
    pola: {
      strefa: {
        nazwa: "Wind load zone",
        cel: "The basic wind speed from which EN 1991-1-4 calculates the force on the frame depends on the zone.",
        gdzie: "From the wind zone map in the Polish National Annex to EN 1991-1-4 (Figure NA.1).",
        zakres: "Zone 1, 2 or 3.",
      },
      wysokoscNpm: {
        nazwa: "Terrain altitude above sea level [m]",
        cel: "Above 300 m the wind in zones 1 and 3 counts more strongly.",
        gdzie: "From a map or location data. Empty field = the altitude from PVGIS data for the location (if loaded).",
        zakres: "Your location.",
      },
      teren: {
        nazwa: "Terrain category",
        cel: "The more open the terrain upwind, the stronger the wind near the ground.",
        gdzie: "Choose the terrain stretching upwind (water, fields, suburbs, town).",
        zakres: "Options on the list (categories per EN 1991-1-4).",
      },
      zabudowa: {
        nazwa: "Blockage under the frame φ",
        cel: "Items under the panels change the airflow and uplift force — the standard accounts for it with the φ factor.",
        gdzie: "0 = empty under the panels (typical ground frame). 1 = items stored under the panels up to the edge (wood, crates).",
        zakres: "0–1, intermediate values allowed.",
      },
      dlugoscL: {
        nazwa: "Length along the slope L [m]",
        cel: "Together with the width it gives the panel area the wind acts on.",
        gdzie: "From the lower to the upper edge of the panels, measured along their surface.",
        zakres: "Your frame.",
      },
      szerokosc: {
        nazwa: "Frame width [m]",
        cel: "Across the slope — together with L it gives the panel area.",
        gdzie: "Measure or from the design.",
        zakres: "Your frame.",
      },
      krawedzRegulowany: {
        nazwa: "Lower edge above ground [m]",
        cel: "The height at which the wind acts — it affects its speed and force.",
        gdzie: "Constant at every angle — the frame pivots on its lower edge.",
        zakres: "Your frame.",
      },
      krawedzDachPlaski: {
        nazwa: "Lower edge above ground [m]",
        cel: "The height at which the wind acts — it affects its speed and force.",
        gdzie: "On a roof — the building height plus the panels' gap from the roof.",
        zakres: "Your frame.",
      },
      masa: MASA_EN,
      azymut: {
        nazwa: "Panel azimuth [°]",
        cel: "The direction the panels face — it affects production.",
        gdzie: "From the design or a compass.",
        zakres: "180° = south, 90° = east, 270° = west.",
      },
      gdzieStelaz: {
        nazwa: "Where the frame stands",
        cel: "On the ground or on a flat roof — changes the height above terrain and the wind conditions.",
        gdzie: "Your design.",
        zakres: "On the ground or on a flat roof.",
      },
      katStelaza: {
        nazwa: "Frame tilt [°]",
        cel: "A steeper frame catches more sun in winter but is lifted harder by the wind.",
        gdzie: "From the frame design.",
        zakres: "0–90°. Below {progSnieg}° snow settles more easily.",
      },
      krawedzPionowy: {
        nazwa: "Lower edge of the panels above ground [m]",
        cel: "Vertical panels near the ground are covered by grass and snow — the app compares the edge height with drifts.",
        gdzie: "Measure from the ground to the lower edge of the panels.",
        zakres: "Your installation.",
      },
      trawaSnieg: {
        nazwa: "Grass or snow drifts nearby [cm]",
        cel: "The highest that occur at the panels — they must not cover the lower part.",
        gdzie: "Your observation from previous years.",
        zakres: "Your conditions.",
      },
      mocPowierzchni: {
        nazwa: "Panel power on this surface [kWp]",
        cel: "The yield is calculated from the power and the surface's insolation.",
        gdzie: "Total panel power (Wp) on this surface ÷ 1000.",
        zakres: "Your design.",
      },
      pr: PR_EN,
      katMin: {
        nazwa: "Smallest adjustment angle [°]",
        cel: "The lower adjustment limit — for comparing the yield month by month.",
        gdzie: "From the frame datasheet.",
        zakres: "0–90°.",
      },
      katMax: {
        nazwa: "Largest adjustment angle [°]",
        cel: "The upper adjustment limit — at steep angles the wind lifts harder.",
        gdzie: "From the frame datasheet.",
        zakres: "The standard gives the wind force up to 30° — above that we won't calculate ballast.",
      },
      dlugoscM: {
        nazwa: "Carport length [m]",
        cel: "From the roof and panel dimensions the app calculates how many panels fit.",
        gdzie: "The dimension of the roof along its surface (along the slope), not the plan view.",
        zakres: "Your carport.",
      },
      szerokoscM: {
        nazwa: "Carport width [m]",
        cel: "The second roof dimension.",
        gdzie: "Measure or from the design.",
        zakres: "Your carport.",
      },
      dlugoscPaneluM: {
        nazwa: "Panel length [m]",
        cel: "For laying out the panels on the roof.",
        gdzie: "From the panel datasheet.",
        zakres: Z_KARTY_EN,
      },
      szerokoscPaneluM: {
        nazwa: "Panel width [m]",
        cel: "For laying out the panels on the roof.",
        gdzie: "From the panel datasheet.",
        zakres: Z_KARTY_EN,
      },
      mocPaneluW: {
        nazwa: "Power of one panel [Wp]",
        cel: "With the number of panels it gives the carport installation power.",
        gdzie: "From the datasheet (STC).",
        zakres: Z_KARTY_EN,
      },
      nachylenieDeg: {
        nazwa: "Carport roof tilt [°]",
        cel: "Affects the yield and the self-cleaning of the panels by rain.",
        gdzie: "From the carport design.",
        zakres: "Self-cleaning from about {wiataMin}–{wiataMax}°.",
      },
    },
  },
  "typ-montazu": {
    migawka: {
      oCoChodzi:
        "There is no single “best” mounting — there is the best mounting for your particular plot and roof. This screen shows real numbers for each option, not generalities.",
      jakDziala:
        "You choose how the panels will stand: pitched roof, several surfaces, a frame on a flat roof or the ground, an adjustable frame, vertically or a carport. For each variant the app calculates what matters: yield from PVGIS insolation, wind and ballast per EN 1991-1-4, snow settling, number of panels.",
      poCo: "Each variant has different risks: a steep frame — wind, a flat one — snow, a vertical one — drifts and grass. Better to see them before buying the structure.",
    },
    pola: {
      tryb: {
        nazwa: "Panel mounting method",
        cel: "Which fields and calculations appear depends on the variant.",
        gdzie: "Your design and what you have available (roof, ground, fence, carport).",
        zakres: "Options on the list.",
      },
    },
  },
  "kat-i-azymut": {
    migawka: {
      oCoChodzi:
        "The panel's tilt and direction decide how much sun it catches over the year — like setting up an umbrella, only the other way round: we want to catch as much sun as possible.",
      jakDziala:
        "The app calculates the insolation of the panel plane from hourly PVGIS data for your location, month by month, at the chosen tilt and azimuth. For an adjustable frame it gives the best angle for each month. With power and PR it converts this into kWh.",
      poCo: "A “summer” angle gives the most per year but little in winter — when energy is scarcest. Here you see that difference in numbers.",
    },
    pola: {
      kat: {
        nazwa: "Panel tilt [°]",
        cel: "The angle from horizontal. Steeper panels give more in winter, less in summer.",
        gdzie: "From the design or measure with an inclinometer.",
        zakres: "0° = panel lies flat, 90° = stands vertically.",
      },
      azymut: {
        nazwa: "Panel azimuth [°]",
        cel: "The direction the panel faces.",
        gdzie: "From the design or a compass.",
        zakres: "180° = south (best), 90° = east, 270° = west.",
      },
      moc: {
        nazwa: "Installation power [kWp] (optional)",
        cel: "To convert insolation into kWh.",
        gdzie: "Total panel power (Wp) ÷ 1000.",
        zakres: "Your design.",
      },
      pr: PR_EN,
    },
  },
  "liczba-paneli": {
    migawka: {
      oCoChodzi:
        "The more panels “in reserve”, the less you'll worry in December — but that's also more space and money at the start. Choose deliberately, not automatically the largest variant.",
      jakDziala:
        "From your location's insolation (PVGIS), tilt, azimuth and PR, the app calculates how many panels are needed to cover consumption in four periods: summer only, March–October, February–November and the whole year. Alongside it shows how many panels you will really mount and how much energy will be missing in winter.",
      poCo: "Covering the whole year with PV alone usually means several times more panels than for summer. This screen lets you choose the period deliberately and fill winter with another source.",
    },
    pola: {
      azymut: { nazwa: "Panel azimuth [°]", cel: "The panel direction — it affects the yield.", gdzie: "From the design or a compass.", zakres: "180° = south, 90° = east, 270° = west." },
      kat: { nazwa: "Tilt [°]", cel: "A fixed angle all year.", gdzie: "You'll find the best angle for your location on the “Tilt and azimuth” screen.", zakres: "0–90°." },
      mocPanelu: { nazwa: "Power of one panel [Wp]", cel: "The number of panels is calculated from it.", gdzie: "From the datasheet (STC).", zakres: Z_KARTY_EN },
      powierzchniaPanelu: { nazwa: "Area of one panel [m²] (optional)", cel: "To calculate the area needed for the panels.", gdzie: "Length × width from the datasheet.", zakres: Z_KARTY_EN },
      pr: PR_EN,
      zuzycie: { nazwa: "Energy use per day [kWh/day]", cel: "How much energy the panels must cover each day.", gdzie: "The sum of all loads from Module 2 (Demand).", zakres: "Your data." },
      ogrzewanie: {
        nazwa: "Additional use in the heating season [kWh/day]",
        cel: "Electricity for heating (heat pump, heaters, fans, boiler controls) — only in the heating season.",
        gdzie: "From the “Building heat loss” screen (Module 6) — electricity per day at a given COP. 0 = you don't heat with electricity.",
        zakres: "Your data.",
      },
      realnie: {
        nazwa: "How many panels you will really mount [pcs]",
        cel: "Compared with the needed number — it shows how much energy will be missing in winter.",
        gdzie: "How many fit on the roof and ground and what the budget allows.",
        zakres: "Hint {limit} pcs — a practical ceiling for a house (the project owner's value, not from a standard).",
      },
    },
  },
  "stress-test-mppt": {
    migawka: {
      oCoChodzi:
        "Panels behave opposite to what you might expect — the colder it is, the higher the open-circuit voltage. A frosty sunny morning is the most dangerous moment for the inverter, not a heatwave. Exceeding the MPPT limit means guaranteed equipment damage.",
      jakDziala:
        "The app calculates the string voltage on the coldest morning: Voc × (1 + β × (T_min − 25 °C)) × number of panels, and compares it with the inverter's maximum input voltage. Above the limit — red stop; from {progOstrzezenia}% of the limit — a warning.",
      poCo: "This is one of the most important hard stops in the app. DC input damage from overvoltage is usually not covered by warranty.",
      fizyka: "Voc_max = Voc_STC × (1 + β/100 × (T_min − 25)) × N. β is negative, so at T_min below 25 °C the voltage rises.",
    },
    pola: {
      voc: { nazwa: "Panel Voc at STC (25 °C) [V]", cel: "The open-circuit voltage — the starting point of the calculation.", gdzie: "From the panel datasheet.", zakres: Z_KARTY_EN },
      beta: { nazwa: "Temperature coefficient of Voc (β) [%/°C]", cel: "By how many percent the voltage rises for every degree below 25 °C.", gdzie: "From the panel datasheet. The value is negative.", zakres: "Typically from {betaMin} to {betaMax} %/°C." },
      tmin: { nazwa: "Minimum temperature at the location (T_min) [°C]", cel: "The coldest morning on which the sun lights the panels.", gdzie: "From the location's climate data (eventually from Module 1).", zakres: "Your location." },
      liczbaPaneli: { nazwa: "Number of panels in the string [pcs]", cel: "The voltages of panels in series add up.", gdzie: "From the string design.", zakres: "Your design." },
      limit: { nazwa: "Maximum MPPT / inverter input voltage [V]", cel: "The limit the string voltage in frost must not exceed.", gdzie: "From the inverter datasheet — exceeding it can permanently damage the DC input.", zakres: Z_KARTY_EN },
    },
  },
  "napor-wiatru": {
    migawka: {
      oCoChodzi:
        "A panel works a bit like a sail — the wind can push it, but it can also “look” underneath and pull it upwards like an aircraft wing.",
      jakDziala:
        "The app calculates the wind force on the panel: ½ × air density × speed² × area × drag coefficient Cd, and the ballast needed to balance it. It counts the panel and frame mass only at 90% (EN 1990). It compares the result with the planned ballast.",
      poCo: "A frame torn off by the wind means destroyed panels and a real danger to people. Ballast “by eye” is a common mistake.",
      fizyka: "F = ½ · ρ · v² · A · Cd (air ρ ≈ 1.225 kg/m³). The force grows with the square of the speed — twice as strong a wind is four times the force.",
    },
    pola: {
      predkosc: { nazwa: "Wind speed [m/s]", cel: "The force grows with the square of the speed.", gdzie: "The design speed for your location (e.g. from the wind standard or the “Golden mean” screen).", zakres: "Your location." },
      powierzchnia: { nazwa: "Panel area [m²]", cel: "The area the wind acts on.", gdzie: "Length × width from the datasheet.", zakres: Z_KARTY_EN },
      cd: { nazwa: "Drag coefficient Cd", cel: "How strongly the panel shape resists the wind.", gdzie: "From aerodynamic studies or the structural design.", zakres: "Typically {cdMin}–{cdMax} for PV panels." },
      balast: { nazwa: "Planned ballast [kg] (optional)", cel: "The app compares it with the design ballast.", gdzie: "How much ballast you plan to use.", zakres: "Your design." },
      masa: MASA_EN,
    },
  },
  "mikropekniecia-termiczne": {
    migawka: {
      oCoChodzi:
        "Materials “breathe” differently with temperature changes — they need a little play, otherwise they crack from inside, invisibly.",
      jakDziala:
        "Panels heat up in the sun to {tMin}–{tMax} °C and in sudden rain cool by {schlodzenie} °C within minutes. The app checks the expansion gap between panels — below {odstepMin} mm microcracks are likely within about {lata} years.",
      poCo: "Microcracks are invisible to the naked eye but lower power and create hot spots. A few millimetres of play at installation prevents them.",
    },
    pola: {
      odstep: {
        nazwa: "Expansion gap between panels [mm]",
        cel: "Play between neighbouring panels in a row for thermal expansion.",
        gdzie: "From the mounting design or measure. 0 = mounted edge to edge.",
        zakres: "Recommended minimum: {odstepMin} mm.",
      },
    },
  },
  "straty-okablowanie-dc": {
    migawka: {
      oCoChodzi: "Current flowing through a cable always heats it a little — that's normal, but a cable that is too thin turns more energy into heat than it should.",
      jakDziala: "The app calculates the cable resistance (there and back), the power loss I²R and its share of the string power. Target: losses below {cel}%.",
      poCo: "Every percent of losses is a percent of energy lost over the installation's whole life — a thicker cable is often cheaper.",
      fizyka: "R = ρ · 2L / S; P_loss = I² · R (copper ρ ≈ 0.0175 Ω·mm²/m).",
    },
    pola: {
      dlugosc: { nazwa: "Cable length panel → inverter (one way) [m]", cel: "The app itself counts the route there and back.", gdzie: "Measure along the route.", zakres: "Your installation." },
      prad: { nazwa: "Operating current (Imp) [A]", cel: "The current in the cable at the maximum power point.", gdzie: "From the panel datasheet (Imp) × number of parallel strings on this cable.", zakres: Z_KARTY_EN },
      napiecie: { nazwa: "Operating voltage (Vmp) [V]", cel: "To calculate the string power and the loss percentage.", gdzie: "Panel Vmp × number of panels in the string.", zakres: Z_KARTY_EN },
      przekroj: { nazwa: "Cable cross-section [mm²]", cel: "Larger cross-section = lower resistance and losses.", gdzie: "From the solar cable marking (e.g. 4 or 6 mm²).", zakres: "Standard solar cable sizes." },
    },
  },
  "konfigurator-stringow": {
    migawka: {
      oCoChodzi: "Series adds voltages, parallel adds currents — like connecting torch batteries: one after another (series) or side by side (parallel).",
      jakDziala: "You choose the mode (series, parallel, mixed) and the panel data. The app calculates the voltage and current of the whole array.",
      poCo: "Whether the array fits within the inverter's voltage and current window depends on the configuration — check it in “Array to inverter matching”.",
    },
    pola: {
      tryb: { nazwa: "Connection mode", cel: "Series, parallel or series groups connected in parallel.", gdzie: "Your design.", zakres: "Options on the list." },
      vmp: { nazwa: "Panel Vmp [V]", cel: "The panel operating voltage — adds up in series.", gdzie: "From the panel datasheet.", zakres: Z_KARTY_EN },
      imp: { nazwa: "Panel Imp [A]", cel: "The panel operating current — adds up in parallel.", gdzie: "From the panel datasheet.", zakres: Z_KARTY_EN },
      szereg: { nazwa: "Panels per group (series) [pcs]", cel: "How many panels in series in one group.", gdzie: "Your design.", zakres: "Your design." },
      grupy: { nazwa: "Number of groups (parallel) [pcs]", cel: "How many series groups connected in parallel.", gdzie: "Your design.", zakres: "Your design." },
      liczba: { nazwa: "Number of panels [pcs]", cel: "The total number of panels in purely series or parallel mode.", gdzie: "Your design.", zakres: "Up to {max} pcs (sanity check)." },
    },
  },
  "diody-bocznikujace": {
    migawka: {
      oCoChodzi: "Diodes are detours for current — thanks to them a shadow on part of a panel doesn't stop the whole panel.",
      jakDziala:
        "The panel is divided into {sekcje} cell sections, each with its own diode. When a section is shaded, the diode lets current bypass it — the app shows what part of the panel's power remains with a given number of shaded sections.",
      poCo: "Without diodes shaded cells overheat (hot-spot) and destroy the panel.",
    },
    pola: {
      sekcje: { nazwa: "Number of shaded sections", cel: "Each shaded section is bypassed by a diode — its share of power is lost.", gdzie: "Observation: which bands of the panel the shadow covers.", zakres: "0–{sekcje}." },
    },
  },
  "zacienienie-diody-bocznikujace": {
    migawka: {
      oCoChodzi: "One shadow can bring down a whole string, not just the shaded panel — like a jam in one lane that slows all the traffic.",
      jakDziala: "The app calculates the panel's power loss with a given number of shaded sections and its effect on the whole series string.",
      poCo: "To know whether a shadow (chimney, tree) justifies optimisers or microinverters, or whether a different string layout is enough.",
    },
    pola: {
      moc: { nazwa: "Panel rated power (STC) [W]", cel: "The starting point for the loss calculation.", gdzie: "From the datasheet.", zakres: Z_KARTY_EN },
      sekcje: { nazwa: "Number of shaded panel sections", cel: "Each shaded section is bypassed by a diode.", gdzie: "Observation of the shadow on the panel.", zakres: "0–{sekcje}." },
      liczbaPaneli: { nazwa: "Number of panels in the string (series) [pcs]", cel: "To assess the effect on the whole string.", gdzie: "From the string design.", zakres: "Your design." },
    },
  },
  "dopasowanie-tablicy-falownika": {
    migawka: {
      oCoChodzi:
        "Checking one parameter isn't enough — the inverter and panels must match on several fronts at once: winter voltage, summer voltage, current and power ratio.",
      jakDziala:
        "The app checks four criteria: Voc in frost below the maximum DC voltage, Vmp within the MPPT window, string current below the MPPT limit and the DC/AC power ratio (recommended {dcacMin}–{dcacMax}).",
      poCo: "Too high a voltage in winter damages the inverter; too low in summer pushes operation outside the MPPT window and energy is lost.",
    },
    pola: {
      voc: { nazwa: "Panel Voc (STC) [V]", cel: "Open-circuit voltage — to check the winter voltage.", gdzie: "From the panel datasheet.", zakres: Z_KARTY_EN },
      vmp: { nazwa: "Panel Vmp (STC) [V]", cel: "Operating voltage — to check the MPPT window.", gdzie: "From the panel datasheet.", zakres: Z_KARTY_EN },
      imp: { nazwa: "Panel operating current (Imp) [A]", cel: "Compared with the maximum MPPT current.", gdzie: "From the panel datasheet.", zakres: Z_KARTY_EN },
      beta: { nazwa: "Temperature coefficient of Voc (β) [%/°C]", cel: "How much the voltage rises in frost.", gdzie: "From the panel datasheet. The value is negative.", zakres: "Typically from {betaMin} to {betaMax} %/°C." },
      tmin: { nazwa: "Minimum temperature at the location (T_min) [°C]", cel: "The coldest morning with the panels working.", gdzie: "From the location's climate data.", zakres: "Your location." },
      liczbaPaneli: { nazwa: "Number of panels in the string [pcs]", cel: "The panel voltages add up.", gdzie: "From the string design.", zakres: "Your design." },
      maxDc: { nazwa: "Inverter maximum DC voltage [V]", cel: "The voltage limit in winter.", gdzie: "From the inverter datasheet.", zakres: Z_KARTY_EN },
      mpptMin: { nazwa: "MPPT window — lower limit [V]", cel: "Below it the inverter doesn't track the maximum power point.", gdzie: "From the inverter datasheet.", zakres: Z_KARTY_EN },
      mpptMax: { nazwa: "MPPT window — upper limit [V]", cel: "Above it the inverter limits production.", gdzie: "From the inverter datasheet.", zakres: Z_KARTY_EN },
      maxPrad: { nazwa: "Maximum MPPT current [A]", cel: "Compared with the string current.", gdzie: "From the inverter datasheet.", zakres: Z_KARTY_EN },
      mocAc: { nazwa: "Inverter rated AC power [W]", cel: "For the DC/AC power ratio.", gdzie: "From the inverter datasheet.", zakres: "DC/AC ratio recommended {dcacMin}–{dcacMax}." },
    },
  },
  "technologie-paneli": {
    migawka: {
      oCoChodzi: "Panel technology isn't marketing. It has a real effect on production.",
      jakDziala: "The table compares Half-Cut, PERC, TOPCon, HJT and thin-film panels: efficiency, ageing rate, behaviour in heat and shade. Optionally it calculates how many m² each technology takes at your power.",
      poCo: "With a limited roof efficiency matters; in heat — the temperature coefficient; over a long horizon — the ageing rate.",
    },
    pola: {
      moc: { nazwa: "Planned installation power [kWp] (optional)", cel: "To see how many m² of modules each technology takes.", gdzie: "Your design.", zakres: "Your design." },
    },
  },
  "panele-bifacjalne": {
    migawka: {
      oCoChodzi: "Bifacial panels collect light from below too — but only if you give them a bright background to reflect the light.",
      jakDziala: "To the front-side annual yield the app adds a rear-side percentage typical for the kind of surface underneath (grass, sand, snow, a light membrane).",
      poCo: "On a dark roof a bifacial panel gives little more than a standard one — the extra cost makes sense only with a bright, reflective surface and high mounting.",
    },
    pola: {
      uzyskPrzod: { nazwa: "Annual front-side yield [kWh]", cel: "The yield as for a standard panel — the starting point.", gdzie: "From the “Tilt and azimuth” screen or the design.", zakres: "Your installation." },
      powierzchnia: { nazwa: "Surface type under the panels", cel: "How much light reflects onto the panel's back depends on the brightness of the ground.", gdzie: "What is under the panels.", zakres: "Options on the list (with the typical yield range for each)." },
      uzyskTyl: { nazwa: "Additional rear-side yield [%]", cel: "The percentage added to the front-side yield.", gdzie: "From the panel datasheet (bifaciality factor) and the typical range for the chosen surface.", zakres: "The typical range is shown with the chosen surface." },
    },
  },
  "niedopasowanie-paneli": {
    migawka: {
      oCoChodzi: "A string works like a rowing team — the weakest sets the pace. Mixing strong and weak panels in one string wastes the stronger ones' potential.",
      jakDziala: "The app compares two panels: in series the whole string's current is limited by the panel with the lower Imp. A power difference above {ostrzezenie}% is a warning, above {krytyczna}% — critical.",
      poCo: "Adding new, stronger panels to an old string often gives almost nothing — better to make a separate string.",
    },
    pola: {
      moc1: { nazwa: "Panel 1 power [W]", cel: "For comparing panel powers.", gdzie: "From the datasheet.", zakres: Z_KARTY_EN },
      imp1: { nazwa: "Panel 1 operating current (Imp) [A]", cel: "In series the lowest current decides.", gdzie: "From the datasheet.", zakres: Z_KARTY_EN },
      moc2: { nazwa: "Panel 2 power [W]", cel: "For comparing panel powers.", gdzie: "From the datasheet.", zakres: Z_KARTY_EN },
      imp2: { nazwa: "Panel 2 operating current (Imp) [A]", cel: "In series the lowest current decides.", gdzie: "From the datasheet.", zakres: Z_KARTY_EN },
      vmp: { nazwa: "Common string operating voltage (Vmp) [V]", cel: "To calculate the power lost to mismatch.", gdzie: "Panel Vmp × number in the string.", zakres: Z_KARTY_EN },
    },
  },
  "wplyw-temperatury": {
    migawka: {
      oCoChodzi: "Panels don't like heat — paradoxically, the coldest sunny day gives more power than the hottest.",
      jakDziala: "The app calculates the panel temperature (ambient + rise from the sun) and the power drop: γ × (T_panel − 25 °C).",
      poCo: "In a heatwave a panel may deliver over ten percent less than its nameplate — this must be included in the balance and inverter sizing.",
      fizyka: "P = P_STC × (1 + γ/100 × (T_panel − 25)). γ is negative.",
    },
    pola: {
      tOtoczenia: { nazwa: "Ambient temperature [°C]", cel: "The starting point for the panel temperature.", gdzie: "Your conditions (e.g. a hot day).", zakres: "Your conditions." },
      przyrost: { nazwa: "Panel temperature rise above ambient [°C]", cel: "Heating of the panel by the sun.", gdzie: "From the datasheet (NOCT) or a measurement.", zakres: "Typically {przyrostMin}–{przyrostMax} °C." },
      gamma: { nazwa: "Temperature coefficient of power γ [%/°C]", cel: "By how many percent the power falls for every degree above 25 °C.", gdzie: "From the panel datasheet.", zakres: "Typically from {gammaMin} to {gammaMax} %/°C." },
      moc: { nazwa: "Panel rated power (STC, 25 °C) [W]", cel: "The reference point.", gdzie: "From the datasheet.", zakres: Z_KARTY_EN },
    },
  },
  "wschod-zachod": {
    migawka: {
      oCoChodzi: "No ideal south-facing roof? East-west is not a compromise, it's a different strategy — sometimes better matched to when you actually use electricity.",
      jakDziala: "The app compares the annual yield of panels on two roof planes (east + west) with south-facing panels and shows how production is spread over the day. Typically this gives {stosunekMin}–{stosunekMax}% of the south layout's yield.",
      poCo: "An east-west layout gives less at noon but more in the morning and evening — less energy has to be stored in the battery.",
    },
    pola: {
      wschodKat: { nazwa: "East — tilt [°]", cel: "The east roof plane angle.", gdzie: "From the roof design.", zakres: "0–90°." },
      wschodAzymut: { nazwa: "East — azimuth [°]", cel: "The east roof plane direction.", gdzie: "From the design or a compass.", zakres: "East = 90°." },
      zachodKat: { nazwa: "West — tilt [°]", cel: "The west roof plane angle.", gdzie: "From the roof design.", zakres: "0–90°." },
      zachodAzymut: { nazwa: "West — azimuth [°]", cel: "The west roof plane direction.", gdzie: "From the design or a compass.", zakres: "West = 270°." },
      udzial: { nazwa: "Share of panel power on the east plane [%]", cel: "The rest of the power goes west.", gdzie: "Your design. With the same number of panels on both planes enter 50.", zakres: "0–100%." },
    },
  },
  "mikroinwertery-vs-centralny": {
    migawka: {
      oCoChodzi: "Shade is the enemy of a classic series installation. A microinverter gives each panel independence from its neighbours.",
      jakDziala: "The app compares microinverters (a separate inverter at each panel) with a central inverter. Off-grid, microinverters require an island inverter with AC-coupling — without it a red stop.",
      poCo: "Microinverters win with shade and uneven roof planes, but in an island installation without AC coupling they can't be safely curtailed when the battery is full.",
    },
    pola: {
      cien: { nazwa: "Partial or regular panel shading", cel: "With shade microinverters lose much less than a series string.", gdzie: "Trees, a chimney, a neighbouring building, a dormer — a shadow that falls daily on some panels.", zakres: "Yes or no." },
      acCoupling: {
        nazwa: "Island inverter with AC-coupling",
        cel: "An off-grid inverter that creates its own 230 V/50 Hz grid and can curtail the microinverters' power when the battery is full (usually by shifting frequency).",
        gdzie: "In the inverter datasheet: the term “AC coupling” and the list of compatible microinverters.",
        zakres: "Yes, no or don't know. “No” or “don't know” off-grid — red stop.",
      },
    },
  },
  "ochrona-stringow": {
    migawka: {
      oCoChodzi: "Protect each string separately so that the failure of one doesn't drag down the rest of the installation.",
      jakDziala:
        "Per HD 60364-7-712 the app checks whether string fuses are mandatory (from {progStringow} parallel strings, when the reverse current exceeds the module's capacity) and whether the chosen fuse fits the window: ≥ {k1} × Isc and ≤ I_MOD_MAX_OCPR from the datasheet.",
      poCo: "With a short in one string the others can push their current into it — without a fuse the cable and panel can catch fire.",
    },
    pola: {
      isc: { nazwa: "Panel short-circuit current at STC (Isc) [A]", cel: "The fuse's lower limit and the reverse current.", gdzie: "From the panel datasheet.", zakres: Z_KARTY_EN },
      ocpr: { nazwa: "Maximum module overcurrent protection (I_MOD_MAX_OCPR) [A]", cel: "The fuse's upper limit — how much reverse current the module withstands.", gdzie: "From the panel datasheet (“Maximum series fuse rating”).", zakres: Z_KARTY_EN },
      stringi: { nazwa: "Number of parallel strings [pcs]", cel: "Whether fuses are mandatory depends on it.", gdzie: "From the design.", zakres: "From {progStringow} — the protection requirement is checked." },
      bezpiecznik: { nazwa: "Rated current of the chosen fuse [A]", cel: "Checked against the window ≥ {k1} × Isc and ≤ I_MOD_MAX_OCPR.", gdzie: "From the gPV fuse datasheet.", zakres: Z_KARTY_EN },
    },
  },
  "czystosc-i-snieg": {
    migawka: {
      oCoChodzi: "A snow-covered panel is a dead panel, and the wind spreads snow unevenly. Three topics complement each other: snow, rain and washing.",
      jakDziala:
        "From the tilt the app judges whether snow settles (up to {katZaleganie}°), partly slides off (up to {katPrzejsciowy}°), or rain washes the dirt off (up to {katSplukiwanie}°). From the production drop against the expected, it judges whether it's time to wash (from {progMycia}%).",
      poCo: "Flat panels hold snow and dirt — washing and clearing snow is a real energy gain in winter and spring.",
    },
    pola: {
      kat: { nazwa: "Panel tilt [°]", cel: "Decides whether snow and dirt slide off by themselves.", gdzie: "From the design or with an inclinometer.", zakres: "0–90°." },
      spadek: { nazwa: "Production drop against expected [%]", cel: "A signal that the panels need washing.", gdzie: "Compare inverter monitoring with production on a similar sunny day after washing, or with a forecast.", zakres: "From {progMycia}% — washing recommended." },
    },
  },
  "powloki-antyrefleksyjne": {
    migawka: {
      oCoChodzi: "Don't reflect the sun — absorb it. An anti-reflective coating helps the panel “catch” more of what falls on it anyway.",
      jakDziala: "The coating and textured glass reduce light reflection — typically +{wzrostMin}–{wzrostMax}% yield per year. The app converts this into kWh for your installation.",
      poCo: "To judge whether the extra cost for coated panels pays back in additional energy.",
    },
    pola: {
      uzysk: { nazwa: "Annual installation yield without coating [kWh/year] (optional)", cel: "To see how many kWh this is in your installation.", gdzie: "From the “Tilt and azimuth” screen or monitoring.", zakres: "Your installation." },
    },
  },
  "warunki-nadmorskie-pyliste": {
    migawka: {
      oCoChodzi: "The sea and the desert are harsh environments for electronics — not every panel and not every connector is suited to them.",
      jakDziala: "You choose the location type. The app gives the requirements: resistance to salt mist (corrosion of frames and connections), to sand and dust (scratching the glass) and to PID in high humidity.",
      poCo: "A panel without a salt-mist resistance certificate by the sea can lose power and warranty within a few years.",
    },
    pola: {
      typ: { nazwa: "Location type", cel: "The requirements for panels and accessories depend on the environment.", gdzie: "Your location.", zakres: "Coastal, dusty or standard." },
    },
  },
  "ryzyko-pid": {
    migawka: {
      oCoChodzi:
        "In long strings the panel voltage relative to the frame can exceed several hundred volts. In humid weather sodium ions from the glass migrate under this voltage and permanently lower power (PID).",
      jakDziala: "The app compares the DC system voltage to ground with the {prog} V threshold — above it recommends PID-resistant panels or countermeasures.",
      poCo: "PID can lower a string's power by tens of percent within a few years — and it's invisible without measurements.",
    },
    pola: {
      napiecie: { nazwa: "DC system voltage to ground [V]", cel: "Compared with the PID risk threshold.", gdzie: "Panel Voc × number of panels in the string.", zakres: "Risk threshold: {prog} V." },
    },
  },
  "tracker-vs-staly": {
    migawka: {
      oCoChodzi: "A tracker sounds advanced, but in practice it's often cheaper and safer to simply buy more panels on a fixed frame.",
      jakDziala: "A tracker increases the yield by {zyskMin}–{zyskMax}%. The app compares this gain with how many additional panels you can buy for the cost of the tracker, and how much energy they give.",
      poCo: "A tracker has moving parts, motors and servicing; extra panels don't. The numbers show which pays off better.",
    },
    pola: {
      liczbaPaneli: { nazwa: "Number of panels on the tracker [pcs]", cel: "To calculate the tracker's gain.", gdzie: "Your design.", zakres: "Your design." },
      kosztTrackera: { nazwa: "Tracker cost (mechanism + foundation) [PLN]", cel: "How much more the tracker costs than a standard frame for the same panels.", gdzie: "From the offer.", zakres: "Your price." },
      kosztPanelu: { nazwa: "Cost of one additional panel on a fixed frame [PLN]", cel: "The panel with its share of frame, cabling and installation.", gdzie: "From the offer.", zakres: "Your price." },
      uzyskPanelu: { nazwa: "Annual yield of one panel on a fixed frame [kWh/year]", cel: "The reference for both variants.", gdzie: "E.g. from the “Tilt and azimuth” screen (installation yield ÷ number of panels).", zakres: "Your location." },
    },
  },
  "straty-zlaczki-mc4": {
    migawka: {
      oCoChodzi: "Small connectors, big importance — a loose MC4 contact is one of the most common causes of PV failures and fires, even though it looks harmless.",
      jakDziala: "The app calculates the power lost on the connectors: I² × R × number of connectors, and compares a good state ({rMin}–{rMax} mΩ) with a bad contact (up to {mnoznik}× more).",
      poCo: "A bad connector heats up at one point — the start of an arc and a fire on the roof.",
      fizyka: "P_loss = I² · R_connector · n.",
    },
    pola: {
      rezystancja: { nazwa: "Resistance of one connector [mΩ]", cel: "The contact resistance.", gdzie: "From a milliohm-meter measurement or the connector datasheet.", zakres: "Good state: {rMin}–{rMax} mΩ. Loose/corroded: up to {mnoznik}× more." },
      liczba: { nazwa: "Number of connectors [pcs]", cel: "The losses add up.", gdzie: "Count the connector pairs in the string.", zakres: "Your installation." },
      prad: { nazwa: "Current [A]", cel: "The losses grow with the square of the current.", gdzie: "String Imp from the panel datasheet.", zakres: Z_KARTY_EN },
    },
  },
  "zloty-srodek": {
    migawka: {
      oCoChodzi:
        "The highest theoretical production is rarely the best choice in practice — sometimes it's worth giving up 5–6% of energy to radically reduce the risk of damage to the installation.",
      jakDziala:
        "For each angle the app calculates two sides: the value of energy over the analysis period (PVGIS × power × PR × price per kWh) and the cost of the ballast needed per the wind standard EN 1991-1-4 (panel mass counted at 90% per EN 1990). It points to the angle with the best balance.",
      poCo: "A steep frame catches more sun in winter, but the wind lifts it harder — ballast and risk grow faster than the yield.",
    },
    pola: {
      azymut: { nazwa: "Panel azimuth [°]", cel: "The panel direction — it affects the yield.", gdzie: "From the design or a compass.", zakres: "180° = south, 90° = east, 270° = west." },
      katSprawdz: { nazwa: "Check any angle [°]", cel: "Shows energy, ballast and balance for the chosen angle.", gdzie: "Move the slider.", zakres: "0–90°." },
      wysokoscStelaza: { nazwa: "Height of the frame's upper edge [m]", cel: "The wind is calculated at this height.", gdzie: "From the ground to the highest point of the panels.", zakres: "Your frame." },
      powierzchnia: { nazwa: "Panel area on the frame [m²]", cel: "The wind acts on it.", gdzie: "The total area of the panels on one frame (e.g. 6 × 1.95 m²).", zakres: "Your frame." },
      cenaBalastu: { nazwa: "Ballast price [PLN/kg]", cel: "Prices the ballast needed at each angle.", gdzie: "Your price.", zakres: "Hint {cena} PLN/kg — self-cast concrete blocks (the project owner's value, not from a standard)." },
      moc: { nazwa: "Panel power on the frame [kWp]", cel: "Energy is calculated from it and the insolation.", gdzie: "Total panel power ÷ 1000.", zakres: "Your design." },
      pr: PR_EN,
      wartoscKwh: { nazwa: "Value of 1 kWh [PLN]", cel: "Values the energy at each angle.", gdzie: "What you would pay for this energy from another source (grid, generator).", zakres: "Your price." },
      okres: { nazwa: "Analysis period [years]", cel: "For how many years to count the value of energy.", gdzie: "As long as the installation is meant to stand.", zakres: "Your choice." },
    },
  },
}

// ————————————————————————————— RU —————————————————————————————

const Z_KARTY_RU = "диапазон из технической документации — приложение не подставляет типовое значение за вас."
const PR_RU = {
  nazwa: "Коэффициент эффективности установки PR",
  cel: "Доля 0–1: какая часть «теоретической» энергии остаётся после потерь (температура, кабели, инвертор, загрязнение). Умножает выработку по инсоляции.",
  gdzie: "Из проекта монтажника или мониторинга существующей установки.",
  zakres: "0–1. Источник приложения не даёт значения — введите своё.",
}
const MASA_RU = {
  nazwa: "Масса панелей и каркаса [кг] (необязательно)",
  cel: "Вес панелей и каркаса прижимает конструкцию к основанию, как балласт. EN 1990 требует учитывать его осторожно — только 90% (γG,inf = 0,90), поскольку реальная масса может быть меньше заявленной. Тогда приложение показывает дополнительный балласт сверх этой массы. Сдвиг и опрокидывание не проверяются.",
  gdzie: "Масса панелей — из документации; каркаса — у производителя или взвесьте элементы. Без балласта.",
  zakres: "Не угадывайте: пустое поле считает балласт так, будто конструкция ничего не весит (безопаснее).",
}

export const ru: Tlumaczenie<typeof pl> = {
  "typ-montazu-pola": {
    pola: {
      strefa: {
        nazwa: "Ветровая зона",
        cel: "От зоны зависит базовая скорость ветра, по которой EN 1991-1-4 считает силу, действующую на каркас.",
        gdzie: "С карты ветровых зон в Национальном приложении Польши к EN 1991-1-4 (рисунок NA.1).",
        zakres: "Зона 1, 2 или 3.",
      },
      wysokoscNpm: {
        nazwa: "Высота местности над уровнем моря [м]",
        cel: "Выше 300 м ветер в зонах 1 и 3 учитывается сильнее.",
        gdzie: "С карты или из данных местоположения. Пустое поле = высота из данных PVGIS для местоположения (если загружены).",
        zakres: "Ваше местоположение.",
      },
      teren: {
        nazwa: "Категория местности",
        cel: "Чем более открыта местность с наветренной стороны, тем сильнее ветер у земли.",
        gdzie: "Выберите местность, простирающуюся с наветренной стороны (вода, поля, пригород, город).",
        zakres: "Варианты из списка (категории по EN 1991-1-4).",
      },
      zabudowa: {
        nazwa: "Загромождение под каркасом φ",
        cel: "Предметы под панелями меняют обтекание и подъёмную силу — стандарт учитывает это коэффициентом φ.",
        gdzie: "0 = под панелями пусто (типичный наземный каркас). 1 = под панелями до края сложены вещи (дрова, ящики).",
        zakres: "0–1, промежуточные значения допустимы.",
      },
      dlugoscL: {
        nazwa: "Длина вдоль уклона L [м]",
        cel: "Вместе с шириной даёт площадь панелей, на которую действует ветер.",
        gdzie: "От нижней до верхней кромки панелей, по их поверхности.",
        zakres: "Ваш каркас.",
      },
      szerokosc: {
        nazwa: "Ширина каркаса [м]",
        cel: "Поперёк уклона — вместе с L даёт площадь панелей.",
        gdzie: "Измерьте или из проекта.",
        zakres: "Ваш каркас.",
      },
      krawedzRegulowany: {
        nazwa: "Нижняя кромка над землёй [м]",
        cel: "Высота, на которой действует ветер, — влияет на его скорость и силу.",
        gdzie: "Постоянна при любом угле — каркас поворачивается на нижней кромке.",
        zakres: "Ваш каркас.",
      },
      krawedzDachPlaski: {
        nazwa: "Нижняя кромка над землёй [м]",
        cel: "Высота, на которой действует ветер, — влияет на его скорость и силу.",
        gdzie: "На крыше — высота здания плюс зазор панелей от крыши.",
        zakres: "Ваш каркас.",
      },
      masa: MASA_RU,
      azymut: {
        nazwa: "Азимут панелей [°]",
        cel: "Направление, в котором смотрят панели, — влияет на выработку.",
        gdzie: "Из проекта или по компасу.",
        zakres: "180° = юг, 90° = восток, 270° = запад.",
      },
      gdzieStelaz: {
        nazwa: "Где стоит каркас",
        cel: "На земле или на плоской крыше — меняет высоту над местностью и ветровые условия.",
        gdzie: "Ваш проект.",
        zakres: "На земле или на плоской крыше.",
      },
      katStelaza: {
        nazwa: "Угол наклона каркаса [°]",
        cel: "Более крутой каркас ловит больше солнца зимой, но сильнее поднимается ветром.",
        gdzie: "Из проекта каркаса.",
        zakres: "0–90°. Ниже {progSnieg}° снег залёживается легче.",
      },
      krawedzPionowy: {
        nazwa: "Нижняя кромка панелей над землёй [м]",
        cel: "Вертикальные панели у земли закрывают трава и снег — приложение сравнивает высоту кромки с сугробами.",
        gdzie: "Измерьте от земли до нижней кромки панелей.",
        zakres: "Ваш монтаж.",
      },
      trawaSnieg: {
        nazwa: "Трава или сугробы поблизости [см]",
        cel: "Наибольшие, какие бывают у панелей, — они не должны закрывать нижнюю часть.",
        gdzie: "Ваши наблюдения за прошлые годы.",
        zakres: "Ваши условия.",
      },
      mocPowierzchni: {
        nazwa: "Мощность панелей на этой поверхности [кВт пик]",
        cel: "По мощности и инсоляции поверхности считается выработка.",
        gdzie: "Суммарная мощность панелей (Вт пик) на этой поверхности ÷ 1000.",
        zakres: "Ваш проект.",
      },
      pr: PR_RU,
      katMin: {
        nazwa: "Наименьший угол регулировки [°]",
        cel: "Нижняя граница регулировки — для сравнения выработки по месяцам.",
        gdzie: "Из документации каркаса.",
        zakres: "0–90°.",
      },
      katMax: {
        nazwa: "Наибольший угол регулировки [°]",
        cel: "Верхняя граница регулировки — при крутых углах ветер поднимает сильнее.",
        gdzie: "Из документации каркаса.",
        zakres: "До 30° стандарт даёт силу ветра — выше балласт не посчитаем.",
      },
      dlugoscM: {
        nazwa: "Длина навеса [м]",
        cel: "По размерам кровли и панелей приложение считает, сколько панелей поместится.",
        gdzie: "Размер кровли по её поверхности (вдоль уклона), а не в плане.",
        zakres: "Ваш навес.",
      },
      szerokoscM: {
        nazwa: "Ширина навеса [м]",
        cel: "Второй размер кровли.",
        gdzie: "Измерьте или из проекта.",
        zakres: "Ваш навес.",
      },
      dlugoscPaneluM: {
        nazwa: "Длина панели [м]",
        cel: "Для раскладки панелей на кровле.",
        gdzie: "Из документации панели.",
        zakres: Z_KARTY_RU,
      },
      szerokoscPaneluM: {
        nazwa: "Ширина панели [м]",
        cel: "Для раскладки панелей на кровле.",
        gdzie: "Из документации панели.",
        zakres: Z_KARTY_RU,
      },
      mocPaneluW: {
        nazwa: "Мощность одной панели [Вт пик]",
        cel: "С числом панелей даёт мощность установки на навесе.",
        gdzie: "Из документации (STC).",
        zakres: Z_KARTY_RU,
      },
      nachylenieDeg: {
        nazwa: "Угол наклона кровли навеса [°]",
        cel: "Влияет на выработку и самоочистку панелей дождём.",
        gdzie: "Из проекта навеса.",
        zakres: "Самоочистка примерно от {wiataMin}–{wiataMax}°.",
      },
    },
  },
  "typ-montazu": {
    migawka: {
      oCoChodzi:
        "Нет одного «лучшего» монтажа — есть лучший монтаж для вашего конкретного участка и крыши. Этот экран показывает реальные числа для каждого варианта, а не общие слова.",
      jakDziala:
        "Вы выбираете, как встанут панели: скатная крыша, несколько поверхностей, каркас на плоской крыше или земле, регулируемый каркас, вертикально или навес. Для каждого варианта приложение считает важное: выработку по инсоляции PVGIS, ветер и балласт по EN 1991-1-4, залёживание снега, число панелей.",
      poCo: "У каждого варианта свои риски: крутой каркас — ветер, плоский — снег, вертикальный — сугробы и трава. Лучше увидеть их до покупки конструкции.",
    },
    pola: {
      tryb: {
        nazwa: "Способ монтажа панелей",
        cel: "От варианта зависит, какие поля и расчёты появятся.",
        gdzie: "Ваш проект и то, что есть в распоряжении (крыша, земля, забор, навес).",
        zakres: "Варианты из списка.",
      },
    },
  },
  "kat-i-azymut": {
    migawka: {
      oCoChodzi:
        "Угол и направление панели решают, сколько солнца она поймает за год, — как установка зонта, только наоборот: мы хотим поймать как можно больше солнца.",
      jakDziala:
        "Приложение считает инсоляцию плоскости панелей по почасовым данным PVGIS для вашего места, месяц за месяцем, при выбранном угле и азимуте. Для регулируемого каркаса даёт лучший угол на каждый месяц. С мощностью и PR пересчитывает это в кВт·ч.",
      poCo: "«Летний» угол даёт больше всего за год, но мало зимой — когда энергии не хватает сильнее всего. Здесь эта разница видна в числах.",
    },
    pola: {
      kat: {
        nazwa: "Угол наклона панелей [°]",
        cel: "Угол от горизонтали. Более крутые панели дают больше зимой, меньше летом.",
        gdzie: "Из проекта или измерьте угломером.",
        zakres: "0° = панель лежит плоско, 90° = стоит вертикально.",
      },
      azymut: {
        nazwa: "Азимут панелей [°]",
        cel: "Направление, в котором смотрит панель.",
        gdzie: "Из проекта или по компасу.",
        zakres: "180° = юг (лучшее), 90° = восток, 270° = запад.",
      },
      moc: {
        nazwa: "Мощность установки [кВт пик] (необязательно)",
        cel: "Для пересчёта инсоляции в кВт·ч.",
        gdzie: "Суммарная мощность панелей (Вт пик) ÷ 1000.",
        zakres: "Ваш проект.",
      },
      pr: PR_RU,
    },
  },
  "liczba-paneli": {
    migawka: {
      oCoChodzi:
        "Чем больше панелей «про запас», тем меньше волнений в декабре, но это и больше места и денег на старте. Выбирайте осознанно, а не автоматически самый большой вариант.",
      jakDziala:
        "По инсоляции вашего места (PVGIS), углу, азимуту и PR приложение считает, сколько панелей нужно, чтобы покрыть потребление в четырёх периодах: только лето, март–октябрь, февраль–ноябрь и весь год. Рядом показывает, сколько панелей вы реально установите и сколько энергии не хватит зимой.",
      poCo: "Покрытие всего года одними PV обычно означает в несколько раз больше панелей, чем на лето. Этот экран позволяет осознанно выбрать период и дополнить зиму другим источником.",
    },
    pola: {
      azymut: { nazwa: "Азимут панелей [°]", cel: "Направление панелей — влияет на выработку.", gdzie: "Из проекта или по компасу.", zakres: "180° = юг, 90° = восток, 270° = запад." },
      kat: { nazwa: "Угол наклона [°]", cel: "Постоянный угол весь год.", gdzie: "Лучший угол для вашего места — на экране «Угол наклона и азимут».", zakres: "0–90°." },
      mocPanelu: { nazwa: "Мощность одной панели [Вт пик]", cel: "По ней считается число панелей.", gdzie: "Из документации (STC).", zakres: Z_KARTY_RU },
      powierzchniaPanelu: { nazwa: "Площадь одной панели [м²] (необязательно)", cel: "Для расчёта площади под панели.", gdzie: "Длина × ширина из документации.", zakres: Z_KARTY_RU },
      pr: PR_RU,
      zuzycie: { nazwa: "Потребление энергии в сутки [кВт·ч/сутки]", cel: "Сколько энергии панели должны покрывать каждый день.", gdzie: "Сумма всех потребителей из Модуля 2 (Потребность).", zakres: "Ваши данные." },
      ogrzewanie: {
        nazwa: "Дополнительное потребление в отопительный сезон [кВт·ч/сутки]",
        cel: "Электричество на отопление (насос, нагреватели, вентиляторы, управление котлом) — только в отопительный сезон.",
        gdzie: "С экрана «Теплопотери здания» (Модуль 6) — электричество в сутки при данном COP. 0 = не отапливаетесь электричеством.",
        zakres: "Ваши данные.",
      },
      realnie: {
        nazwa: "Сколько панелей вы реально установите [шт.]",
        cel: "Сравнивается с нужным числом — показывает, сколько энергии не хватит зимой.",
        gdzie: "Сколько поместится на крыше и земле и сколько позволит бюджет.",
        zakres: "Подсказка {limit} шт. — практический потолок для дома (значение владельца проекта, не из стандарта).",
      },
    },
  },
  "stress-test-mppt": {
    migawka: {
      oCoChodzi:
        "Панели ведут себя наоборот ожиданиям — чем холоднее, тем выше напряжение холостого хода. Морозное солнечное утро — самый опасный момент для инвертора, а не жара. Превышение предела MPPT — гарантированное повреждение оборудования.",
      jakDziala:
        "Приложение считает напряжение стринга в самое холодное утро: Voc × (1 + β × (T_min − 25 °C)) × число панелей и сравнивает с максимальным входным напряжением инвертора. Выше предела — красный стоп; от {progOstrzezenia}% предела — предупреждение.",
      poCo: "Это один из важнейших жёстких стопов приложения. Повреждение входа DC от перенапряжения обычно не покрывается гарантией.",
      fizyka: "Voc_max = Voc_STC × (1 + β/100 × (T_min − 25)) × N. β отрицательный, поэтому при T_min ниже 25 °C напряжение растёт.",
    },
    pola: {
      voc: { nazwa: "Voc панели при STC (25 °C) [В]", cel: "Напряжение холостого хода — отправная точка расчёта.", gdzie: "Из документации панели.", zakres: Z_KARTY_RU },
      beta: { nazwa: "Температурный коэффициент Voc (β) [%/°C]", cel: "На сколько процентов растёт напряжение на каждый градус ниже 25 °C.", gdzie: "Из документации панели. Значение отрицательное.", zakres: "Обычно от {betaMin} до {betaMax} %/°C." },
      tmin: { nazwa: "Минимальная температура в месте (T_min) [°C]", cel: "Самое холодное утро, когда солнце освещает панели.", gdzie: "Из климатических данных места (со временем из Модуля 1).", zakres: "Ваше место." },
      liczbaPaneli: { nazwa: "Число панелей в стринге [шт.]", cel: "Напряжения последовательных панелей складываются.", gdzie: "Из проекта стринга.", zakres: "Ваш проект." },
      limit: { nazwa: "Максимальное входное напряжение MPPT / инвертора [В]", cel: "Граница, которую напряжение стринга на морозе не должно превысить.", gdzie: "Из документации инвертора — превышение может необратимо повредить вход DC.", zakres: Z_KARTY_RU },
    },
  },
  "napor-wiatru": {
    migawka: {
      oCoChodzi:
        "Панель работает немного как парус — ветер может её толкать, а может «заглянуть» под неё и тянуть вверх, как крыло самолёта.",
      jakDziala:
        "Приложение считает силу ветра на панель: ½ × плотность воздуха × скорость² × площадь × коэффициент сопротивления Cd — и балласт, нужный для её уравновешивания. Массу панелей и каркаса учитывает только на 90% (EN 1990). Сравнивает результат с планируемым балластом.",
      poCo: "Сорванный ветром каркас — это уничтоженные панели и реальная опасность для людей. Балласт «на глаз» — частая ошибка.",
      fizyka: "F = ½ · ρ · v² · A · Cd (ρ воздуха ≈ 1,225 кг/м³). Сила растёт с квадратом скорости — вдвое сильнее ветер даёт вчетверо большую силу.",
    },
    pola: {
      predkosc: { nazwa: "Скорость ветра [м/с]", cel: "Сила растёт с квадратом скорости.", gdzie: "Расчётная скорость для вашего места (например, из ветрового стандарта или экрана «Золотая середина»).", zakres: "Ваше место." },
      powierzchnia: { nazwa: "Площадь панели [м²]", cel: "Площадь, на которую действует ветер.", gdzie: "Длина × ширина из документации.", zakres: Z_KARTY_RU },
      cd: { nazwa: "Коэффициент сопротивления Cd", cel: "Насколько сильно форма панели сопротивляется ветру.", gdzie: "Из аэродинамических исследований или проекта конструкции.", zakres: "Обычно {cdMin}–{cdMax} для панелей PV." },
      balast: { nazwa: "Планируемый балласт [кг] (необязательно)", cel: "Приложение сравнит его с расчётным балластом.", gdzie: "Сколько балласта вы планируете.", zakres: "Ваш проект." },
      masa: MASA_RU,
    },
  },
  "mikropekniecia-termiczne": {
    migawka: {
      oCoChodzi:
        "Материалы «дышат» при перепадах температуры по-разному — им нужен небольшой зазор, иначе они трескаются изнутри, незаметно.",
      jakDziala:
        "Панели нагреваются на солнце до {tMin}–{tMax} °C, а при внезапном дожде остывают на {schlodzenie} °C за несколько минут. Приложение проверяет температурный зазор между панелями — меньше {odstepMin} мм грозит микротрещинами примерно через {lata} года.",
      poCo: "Микротрещины не видны невооружённым глазом, но снижают мощность и создают горячие точки. Несколько миллиметров зазора при монтаже предотвращают их.",
    },
    pola: {
      odstep: {
        nazwa: "Температурный зазор между панелями [мм]",
        cel: "Зазор между соседними панелями в ряду на тепловое расширение.",
        gdzie: "Из проекта монтажа или измерьте. 0 = монтаж впритык.",
        zakres: "Рекомендуемый минимум: {odstepMin} мм.",
      },
    },
  },
  "straty-okablowanie-dc": {
    migawka: {
      oCoChodzi: "Ток в кабеле всегда немного его нагревает — это нормально, но слишком тонкий кабель превращает в тепло больше энергии, чем следует.",
      jakDziala: "Приложение считает сопротивление кабеля (туда и обратно), потери мощности I²R и их долю в мощности стринга. Цель: потери ниже {cel}%.",
      poCo: "Каждый процент потерь — это процент энергии, теряемой весь срок службы установки; более толстый кабель часто дешевле.",
      fizyka: "R = ρ · 2L / S; P_потерь = I² · R (медь ρ ≈ 0,0175 Ом·мм²/м).",
    },
    pola: {
      dlugosc: { nazwa: "Длина кабеля панель → инвертор (в одну сторону) [м]", cel: "Приложение само считает путь туда и обратно.", gdzie: "Измерьте по трассе.", zakres: "Ваша установка." },
      prad: { nazwa: "Рабочий ток (Imp) [А]", cel: "Ток в кабеле в точке максимальной мощности.", gdzie: "Из документации панели (Imp) × число параллельных стрингов на этом кабеле.", zakres: Z_KARTY_RU },
      napiecie: { nazwa: "Рабочее напряжение (Vmp) [В]", cel: "Для расчёта мощности стринга и процента потерь.", gdzie: "Vmp панели × число панелей в стринге.", zakres: Z_KARTY_RU },
      przekroj: { nazwa: "Сечение кабеля [мм²]", cel: "Больше сечение = меньше сопротивление и потери.", gdzie: "По маркировке солнечного кабеля (например, 4 или 6 мм²).", zakres: "Стандартные сечения солнечных кабелей." },
    },
  },
  "konfigurator-stringow": {
    migawka: {
      oCoChodzi: "Последовательное соединение складывает напряжения, параллельное — токи, как соединение батареек фонарика: одна за другой (последовательно) или рядом (параллельно).",
      jakDziala: "Вы выбираете режим (последовательно, параллельно, смешанно) и данные панели. Приложение считает напряжение и ток всего массива.",
      poCo: "От конфигурации зависит, уложится ли массив в окно напряжения и тока инвертора, — это проверяется в «Согласовании массива с инвертором».",
    },
    pola: {
      tryb: { nazwa: "Режим соединения", cel: "Последовательно, параллельно или последовательные группы, соединённые параллельно.", gdzie: "Ваш проект.", zakres: "Варианты из списка." },
      vmp: { nazwa: "Напряжение Vmp панели [В]", cel: "Рабочее напряжение панели — складывается последовательно.", gdzie: "Из документации панели.", zakres: Z_KARTY_RU },
      imp: { nazwa: "Ток Imp панели [А]", cel: "Рабочий ток панели — складывается параллельно.", gdzie: "Из документации панели.", zakres: Z_KARTY_RU },
      szereg: { nazwa: "Панелей в группе (последовательно) [шт.]", cel: "Сколько панелей последовательно в одной группе.", gdzie: "Ваш проект.", zakres: "Ваш проект." },
      grupy: { nazwa: "Число групп (параллельно) [шт.]", cel: "Сколько последовательных групп соединено параллельно.", gdzie: "Ваш проект.", zakres: "Ваш проект." },
      liczba: { nazwa: "Число панелей [шт.]", cel: "Общее число панелей в чисто последовательном или параллельном режиме.", gdzie: "Ваш проект.", zakres: "До {max} шт. (проверка разумности)." },
    },
  },
  "diody-bocznikujace": {
    migawka: {
      oCoChodzi: "Диоды — объезд для тока: благодаря им тень на части панели не останавливает всю панель.",
      jakDziala:
        "Панель разделена на {sekcje} секции элементов, у каждой свой диод. Когда секция затенена, диод позволяет току её обойти — приложение показывает, какая часть мощности панели остаётся при данном числе затенённых секций.",
      poCo: "Без диодов затенённые элементы перегреваются (hot-spot) и разрушают панель.",
    },
    pola: {
      sekcje: { nazwa: "Число затенённых секций", cel: "Каждая затенённая секция обходится диодом — её доля мощности теряется.", gdzie: "Наблюдение: какие полосы панели накрывает тень.", zakres: "0–{sekcje}." },
    },
  },
  "zacienienie-diody-bocznikujace": {
    migawka: {
      oCoChodzi: "Одна тень может «положить» весь стринг, а не только затенённую панель, — как пробка в одном ряду, которая замедляет всё движение.",
      jakDziala: "Приложение считает потерю мощности панели при данном числе затенённых секций и её влияние на весь последовательный стринг.",
      poCo: "Чтобы понять, оправдывает ли тень (труба, дерево) оптимизаторы или микроинверторы, или хватит другой схемы стрингов.",
    },
    pola: {
      moc: { nazwa: "Номинальная мощность панели (STC) [Вт]", cel: "Отправная точка расчёта потерь.", gdzie: "Из документации.", zakres: Z_KARTY_RU },
      sekcje: { nazwa: "Число затенённых секций панели", cel: "Каждая затенённая секция обходится диодом.", gdzie: "Наблюдение тени на панели.", zakres: "0–{sekcje}." },
      liczbaPaneli: { nazwa: "Число панелей в стринге (последовательно) [шт.]", cel: "Для оценки влияния на весь стринг.", gdzie: "Из проекта стринга.", zakres: "Ваш проект." },
    },
  },
  "dopasowanie-tablicy-falownika": {
    migawka: {
      oCoChodzi:
        "Проверить один параметр недостаточно — инвертор и панели должны совпадать сразу по нескольким фронтам: напряжение зимой, напряжение летом, ток и соотношение мощностей.",
      jakDziala:
        "Приложение проверяет четыре критерия: Voc на морозе ниже максимального напряжения DC, Vmp в окне MPPT, ток стринга ниже предела MPPT и соотношение мощностей DC/AC (рекомендуется {dcacMin}–{dcacMax}).",
      poCo: "Слишком высокое напряжение зимой повреждает инвертор; слишком низкое летом выводит работу за окно MPPT, и энергия теряется.",
    },
    pola: {
      voc: { nazwa: "Voc панели (STC) [В]", cel: "Напряжение холостого хода — для проверки напряжения зимой.", gdzie: "Из документации панели.", zakres: Z_KARTY_RU },
      vmp: { nazwa: "Vmp панели (STC) [В]", cel: "Рабочее напряжение — для проверки окна MPPT.", gdzie: "Из документации панели.", zakres: Z_KARTY_RU },
      imp: { nazwa: "Рабочий ток панели (Imp) [А]", cel: "Сравнивается с максимальным током MPPT.", gdzie: "Из документации панели.", zakres: Z_KARTY_RU },
      beta: { nazwa: "Температурный коэффициент Voc (β) [%/°C]", cel: "Насколько растёт напряжение на морозе.", gdzie: "Из документации панели. Значение отрицательное.", zakres: "Обычно от {betaMin} до {betaMax} %/°C." },
      tmin: { nazwa: "Минимальная температура в месте (T_min) [°C]", cel: "Самое холодное утро с работающими панелями.", gdzie: "Из климатических данных места.", zakres: "Ваше место." },
      liczbaPaneli: { nazwa: "Число панелей в стринге [шт.]", cel: "Напряжения панелей складываются.", gdzie: "Из проекта стринга.", zakres: "Ваш проект." },
      maxDc: { nazwa: "Максимальное напряжение DC инвертора [В]", cel: "Граница напряжения зимой.", gdzie: "Из документации инвертора.", zakres: Z_KARTY_RU },
      mpptMin: { nazwa: "Окно MPPT — нижняя граница [В]", cel: "Ниже неё инвертор не отслеживает точку максимальной мощности.", gdzie: "Из документации инвертора.", zakres: Z_KARTY_RU },
      mpptMax: { nazwa: "Окно MPPT — верхняя граница [В]", cel: "Выше неё инвертор ограничивает выработку.", gdzie: "Из документации инвертора.", zakres: Z_KARTY_RU },
      maxPrad: { nazwa: "Максимальный ток MPPT [А]", cel: "Сравнивается с током стринга.", gdzie: "Из документации инвертора.", zakres: Z_KARTY_RU },
      mocAc: { nazwa: "Номинальная мощность AC инвертора [Вт]", cel: "Для соотношения мощностей DC/AC.", gdzie: "Из документации инвертора.", zakres: "Рекомендуемое соотношение DC/AC {dcacMin}–{dcacMax}." },
    },
  },
  "technologie-paneli": {
    migawka: {
      oCoChodzi: "Технология панелей — не маркетинг. Она реально влияет на выработку.",
      jakDziala: "Таблица сравнивает Half-Cut, PERC, TOPCon, HJT и тонкоплёночные панели: КПД, скорость старения, поведение в жару и в тени. При желании считает, сколько м² займёт каждая технология при вашей мощности.",
      poCo: "При ограниченной крыше важен КПД; в жару — температурный коэффициент; на длинном горизонте — скорость старения.",
    },
    pola: {
      moc: { nazwa: "Планируемая мощность установки [кВт пик] (необязательно)", cel: "Чтобы увидеть, сколько м² модулей займёт каждая технология.", gdzie: "Ваш проект.", zakres: "Ваш проект." },
    },
  },
  "panele-bifacjalne": {
    migawka: {
      oCoChodzi: "Двусторонние панели собирают свет и снизу — но только если дать им светлый фон, от которого свет отразится.",
      jakDziala: "К годовой выработке лицевой стороны приложение добавляет процент с тыльной стороны, типичный для вида поверхности под панелями (трава, песок, снег, светлая мембрана).",
      poCo: "На тёмной крыше двусторонняя панель даёт немногим больше обычной — доплата имеет смысл только при светлом отражающем основании и высоком монтаже.",
    },
    pola: {
      uzyskPrzod: { nazwa: "Годовая выработка лицевой стороны [кВт·ч]", cel: "Выработка как у обычной панели — отправная точка.", gdzie: "С экрана «Угол наклона и азимут» или из проекта.", zakres: "Ваша установка." },
      powierzchnia: { nazwa: "Тип поверхности под панелями", cel: "От светлоты основания зависит, сколько света отразится на тыльную сторону.", gdzie: "Что находится под панелями.", zakres: "Варианты из списка (с типичным диапазоном прироста для каждого)." },
      uzyskTyl: { nazwa: "Дополнительная выработка тыльной стороны [%]", cel: "Процент, добавляемый к выработке лицевой стороны.", gdzie: "Из документации панели (коэффициент двусторонности) и типичного диапазона для выбранной поверхности.", zakres: "Типичный диапазон показан у выбранной поверхности." },
    },
  },
  "niedopasowanie-paneli": {
    migawka: {
      oCoChodzi: "Стринг работает как команда гребцов — темп задаёт самый слабый. Смешивание сильных и слабых панелей в одном стринге расходует потенциал более сильных.",
      jakDziala: "Приложение сравнивает две панели: при последовательном соединении ток всего стринга ограничивает панель с меньшим Imp. Разница мощностей выше {ostrzezenie}% — предупреждение, выше {krytyczna}% — критично.",
      poCo: "Добавление новых, более мощных панелей в старый стринг часто почти ничего не даёт — лучше сделать отдельный стринг.",
    },
    pola: {
      moc1: { nazwa: "Мощность панели 1 [Вт]", cel: "Для сравнения мощностей панелей.", gdzie: "Из документации.", zakres: Z_KARTY_RU },
      imp1: { nazwa: "Рабочий ток панели 1 (Imp) [А]", cel: "При последовательном соединении решает наименьший ток.", gdzie: "Из документации.", zakres: Z_KARTY_RU },
      moc2: { nazwa: "Мощность панели 2 [Вт]", cel: "Для сравнения мощностей панелей.", gdzie: "Из документации.", zakres: Z_KARTY_RU },
      imp2: { nazwa: "Рабочий ток панели 2 (Imp) [А]", cel: "При последовательном соединении решает наименьший ток.", gdzie: "Из документации.", zakres: Z_KARTY_RU },
      vmp: { nazwa: "Общее рабочее напряжение стринга (Vmp) [В]", cel: "Для расчёта мощности, теряемой на рассогласовании.", gdzie: "Vmp панелей × число в стринге.", zakres: Z_KARTY_RU },
    },
  },
  "wplyw-temperatury": {
    migawka: {
      oCoChodzi: "Панели не любят жару — парадоксально, самый холодный солнечный день даёт больше мощности, чем самый жаркий.",
      jakDziala: "Приложение считает температуру панели (окружающая + нагрев от солнца) и падение мощности: γ × (T_панели − 25 °C).",
      poCo: "В жару панель может отдавать на десяток с лишним процентов меньше, чем указано на табличке, — это нужно учесть в балансе и подборе инвертора.",
      fizyka: "P = P_STC × (1 + γ/100 × (T_панели − 25)). γ отрицательный.",
    },
    pola: {
      tOtoczenia: { nazwa: "Температура окружающей среды [°C]", cel: "Отправная точка для температуры панели.", gdzie: "Ваши условия (например, жаркий день).", zakres: "Ваши условия." },
      przyrost: { nazwa: "Нагрев панели сверх окружающей среды [°C]", cel: "Нагрев панели солнцем.", gdzie: "Из документации (NOCT) или по измерению.", zakres: "Обычно {przyrostMin}–{przyrostMax} °C." },
      gamma: { nazwa: "Температурный коэффициент мощности γ [%/°C]", cel: "На сколько процентов падает мощность на каждый градус выше 25 °C.", gdzie: "Из документации панели.", zakres: "Обычно от {gammaMin} до {gammaMax} %/°C." },
      moc: { nazwa: "Номинальная мощность панели (STC, 25 °C) [Вт]", cel: "Точка отсчёта.", gdzie: "Из документации.", zakres: Z_KARTY_RU },
    },
  },
  "wschod-zachod": {
    migawka: {
      oCoChodzi: "Нет идеальной южной крыши? Восток-запад — не компромисс, а другая стратегия, иногда лучше согласованная с тем, когда вы реально потребляете электроэнергию.",
      jakDziala: "Приложение сравнивает годовую выработку панелей на двух скатах (восток + запад) с панелями на юг и показывает распределение выработки в течение дня. Обычно это даёт {stosunekMin}–{stosunekMax}% выработки южной схемы.",
      poCo: "Схема восток-запад даёт меньше в полдень, но больше утром и вечером — меньше энергии нужно хранить в накопителе.",
    },
    pola: {
      wschodKat: { nazwa: "Восток — наклон [°]", cel: "Угол восточного ската.", gdzie: "Из проекта крыши.", zakres: "0–90°." },
      wschodAzymut: { nazwa: "Восток — азимут [°]", cel: "Направление восточного ската.", gdzie: "Из проекта или по компасу.", zakres: "Восток = 90°." },
      zachodKat: { nazwa: "Запад — наклон [°]", cel: "Угол западного ската.", gdzie: "Из проекта крыши.", zakres: "0–90°." },
      zachodAzymut: { nazwa: "Запад — азимут [°]", cel: "Направление западного ската.", gdzie: "Из проекта или по компасу.", zakres: "Запад = 270°." },
      udzial: { nazwa: "Доля мощности панелей на восточном скате [%]", cel: "Остальная мощность идёт на запад.", gdzie: "Ваш проект. При одинаковом числе панелей на обоих скатах введите 50.", zakres: "0–100%." },
    },
  },
  "mikroinwertery-vs-centralny": {
    migawka: {
      oCoChodzi: "Тень — враг классической последовательной установки. Микроинвертор даёт каждой панели независимость от соседей.",
      jakDziala: "Приложение сравнивает микроинверторы (отдельный инвертор у каждой панели) с центральным инвертором. В off-grid микроинверторы требуют автономного инвертора с AC-coupling — без него красный стоп.",
      poCo: "Микроинверторы выигрывают при тени и неровных скатах, но в автономной установке без связи по AC их нельзя безопасно ограничить, когда накопитель полон.",
    },
    pola: {
      cien: { nazwa: "Частичное или регулярное затенение панелей", cel: "При тени микроинверторы теряют намного меньше последовательного стринга.", gdzie: "Деревья, труба, соседнее здание, слуховое окно — тень, ежедневно падающая на часть панелей.", zakres: "Да или нет." },
      acCoupling: {
        nazwa: "Автономный инвертор с AC-coupling",
        cel: "Автономный инвертор, который сам создаёт сеть 230 В/50 Гц и умеет ограничивать мощность микроинверторов, когда накопитель полон (обычно сдвигом частоты).",
        gdzie: "В документации инвертора: термин «AC coupling» и список совместимых микроинверторов.",
        zakres: "Да, нет или не знаю. «Нет» или «не знаю» в off-grid — красный стоп.",
      },
    },
  },
  "ochrona-stringow": {
    migawka: {
      oCoChodzi: "Защищайте каждый стринг отдельно, чтобы отказ одного не потянул за собой остальную установку.",
      jakDziala:
        "По HD 60364-7-712 приложение проверяет, обязательны ли стринговые предохранители (от {progStringow} параллельных стрингов, когда обратный ток превышает способность модуля), и укладывается ли выбранный предохранитель в окно: ≥ {k1} × Isc и ≤ I_MOD_MAX_OCPR из документации.",
      poCo: "При КЗ в одном стринге остальные могут вгонять в него свой ток — без предохранителя кабель и панель могут загореться.",
    },
    pola: {
      isc: { nazwa: "Ток КЗ панели при STC (Isc) [А]", cel: "Нижняя граница предохранителя и обратный ток.", gdzie: "Из документации панели.", zakres: Z_KARTY_RU },
      ocpr: { nazwa: "Максимальный ток защиты модуля (I_MOD_MAX_OCPR) [А]", cel: "Верхняя граница предохранителя — сколько обратного тока выдержит модуль.", gdzie: "Из документации панели («Maximum series fuse rating»).", zakres: Z_KARTY_RU },
      stringi: { nazwa: "Число параллельных стрингов [шт.]", cel: "От него зависит, обязательны ли предохранители.", gdzie: "Из проекта.", zakres: "От {progStringow} — проверяется обязательность защиты." },
      bezpiecznik: { nazwa: "Номинальный ток выбранного предохранителя [А]", cel: "Проверяется по окну ≥ {k1} × Isc и ≤ I_MOD_MAX_OCPR.", gdzie: "Из документации предохранителя gPV.", zakres: Z_KARTY_RU },
    },
  },
  "czystosc-i-snieg": {
    migawka: {
      oCoChodzi: "Засыпанная снегом панель — мёртвая панель, а ветер распределяет снег неравномерно. Три темы дополняют друг друга: снег, дождь и мойка.",
      jakDziala:
        "По углу наклона приложение оценивает, залёживается ли снег (до {katZaleganie}°), частично сползает (до {katPrzejsciowy}°) или дождь смывает грязь (до {katSplukiwanie}°). По падению выработки относительно ожидаемой оценивает, пора ли мыть (от {progMycia}%).",
      poCo: "Плоские панели держат снег и грязь — мойка и очистка от снега дают реальную прибавку энергии зимой и весной.",
    },
    pola: {
      kat: { nazwa: "Угол наклона панели [°]", cel: "Решает, сползают ли снег и грязь сами.", gdzie: "Из проекта или угломером.", zakres: "0–90°." },
      spadek: { nazwa: "Падение выработки относительно ожидаемой [%]", cel: "Сигнал, что панели нужно помыть.", gdzie: "Сравните мониторинг инвертора с выработкой в похожий солнечный день после мойки или с прогнозом.", zakres: "От {progMycia}% — рекомендуется мойка." },
    },
  },
  "powloki-antyrefleksyjne": {
    migawka: {
      oCoChodzi: "Не отражайте солнце — поглощайте его. Антибликовое покрытие помогает панели «поймать» больше того, что и так на неё падает.",
      jakDziala: "Покрытие и текстурированное стекло уменьшают отражение света — обычно +{wzrostMin}–{wzrostMax}% выработки в год. Приложение пересчитывает это в кВт·ч вашей установки.",
      poCo: "Чтобы оценить, окупится ли доплата за панели с покрытием дополнительной энергией.",
    },
    pola: {
      uzysk: { nazwa: "Годовая выработка установки без покрытия [кВт·ч/год] (необязательно)", cel: "Чтобы увидеть, сколько это кВт·ч в вашей установке.", gdzie: "С экрана «Угол наклона и азимут» или из мониторинга.", zakres: "Ваша установка." },
    },
  },
  "warunki-nadmorskie-pyliste": {
    migawka: {
      oCoChodzi: "Море и пустыня — трудная среда для электроники; не каждая панель и не каждый разъём к ней приспособлены.",
      jakDziala: "Вы выбираете тип местности. Приложение называет требования: стойкость к солевому туману (коррозия рам и соединений), к песку и пыли (царапание стекла) и к PID при высокой влажности.",
      poCo: "Панель без сертификата стойкости к солевому туману у моря может потерять мощность и гарантию за несколько лет.",
    },
    pola: {
      typ: { nazwa: "Тип местности", cel: "От среды зависят требования к панелям и комплектующим.", gdzie: "Ваше место.", zakres: "Приморская, пыльная или стандартная." },
    },
  },
  "ryzyko-pid": {
    migawka: {
      oCoChodzi:
        "В длинных стрингах напряжение панели относительно рамы может превышать несколько сотен вольт. Во влажную погоду ионы натрия из стекла мигрируют под этим напряжением и необратимо снижают мощность (PID).",
      jakDziala: "Приложение сравнивает напряжение системы DC относительно земли с порогом {prog} В — выше рекомендует панели, стойкие к PID, или меры защиты.",
      poCo: "PID может снизить мощность стринга на десятки процентов за несколько лет — и его не видно без измерений.",
    },
    pola: {
      napiecie: { nazwa: "Напряжение системы DC относительно земли [В]", cel: "Сравнивается с порогом риска PID.", gdzie: "Voc панели × число панелей в стринге.", zakres: "Порог риска: {prog} В." },
    },
  },
  "tracker-vs-staly": {
    migawka: {
      oCoChodzi: "Трекер звучит продвинуто, но на практике часто дешевле и надёжнее просто докупить панелей на неподвижный каркас.",
      jakDziala: "Трекер увеличивает выработку на {zyskMin}–{zyskMax}%. Приложение сравнивает этот прирост с тем, сколько дополнительных панелей вы купите за стоимость трекера и сколько энергии они дадут.",
      poCo: "У трекера есть подвижные части, двигатели и обслуживание; у дополнительных панелей — нет. Числа показывают, что выгоднее.",
    },
    pola: {
      liczbaPaneli: { nazwa: "Число панелей на трекере [шт.]", cel: "Для расчёта прироста от трекера.", gdzie: "Ваш проект.", zakres: "Ваш проект." },
      kosztTrackera: { nazwa: "Стоимость трекера (механизм + фундамент) [зл]", cel: "Насколько трекер дороже обычного каркаса под те же панели.", gdzie: "Из предложения.", zakres: "Ваша цена." },
      kosztPanelu: { nazwa: "Стоимость одной дополнительной панели на неподвижном каркасе [зл]", cel: "Панель вместе с её долей каркаса, кабелей и монтажа.", gdzie: "Из предложения.", zakres: "Ваша цена." },
      uzyskPanelu: { nazwa: "Годовая выработка одной панели на неподвижном каркасе [кВт·ч/год]", cel: "Точка отсчёта для обоих вариантов.", gdzie: "Например, с экрана «Угол наклона и азимут» (выработка установки ÷ число панелей).", zakres: "Ваше место." },
    },
  },
  "straty-zlaczki-mc4": {
    migawka: {
      oCoChodzi: "Маленькие разъёмы — большое значение: ослабленный контакт MC4 — одна из самых частых причин отказов и пожаров PV, хотя выглядит безобидно.",
      jakDziala: "Приложение считает мощность, теряемую на разъёмах: I² × R × число разъёмов, и сравнивает хорошее состояние ({rMin}–{rMax} мОм) с плохим контактом (до {mnoznik}× больше).",
      poCo: "Плохой разъём греется в одной точке — это начало дуги и пожара на крыше.",
      fizyka: "P_потерь = I² · R_разъёма · n.",
    },
    pola: {
      rezystancja: { nazwa: "Сопротивление одного разъёма [мОм]", cel: "Сопротивление контакта.", gdzie: "По измерению миллиомметром или из документации разъёма.", zakres: "Хорошее состояние: {rMin}–{rMax} мОм. Ослабленный/окисленный: до {mnoznik}× больше." },
      liczba: { nazwa: "Число разъёмов [шт.]", cel: "Потери складываются.", gdzie: "Посчитайте пары разъёмов в стринге.", zakres: "Ваша установка." },
      prad: { nazwa: "Ток [А]", cel: "Потери растут с квадратом тока.", gdzie: "Imp стринга из документации панели.", zakres: Z_KARTY_RU },
    },
  },
  "zloty-srodek": {
    migawka: {
      oCoChodzi:
        "Наибольшая теоретическая выработка редко бывает лучшим выбором на практике — иногда стоит отдать 5–6% энергии, чтобы радикально снизить риск повреждения установки.",
      jakDziala:
        "Для каждого угла приложение считает две стороны: стоимость энергии за период анализа (PVGIS × мощность × PR × цена кВт·ч) и стоимость балласта по ветровому стандарту EN 1991-1-4 (масса панелей учитывается на 90% по EN 1990). Указывает угол с лучшим балансом.",
      poCo: "Крутой каркас ловит больше солнца зимой, но ветер поднимает его сильнее — балласт и риск растут быстрее выработки.",
    },
    pola: {
      azymut: { nazwa: "Азимут панелей [°]", cel: "Направление панелей — влияет на выработку.", gdzie: "Из проекта или по компасу.", zakres: "180° = юг, 90° = восток, 270° = запад." },
      katSprawdz: { nazwa: "Проверить любой угол [°]", cel: "Показывает энергию, балласт и баланс для выбранного угла.", gdzie: "Передвиньте ползунок.", zakres: "0–90°." },
      wysokoscStelaza: { nazwa: "Высота верхней кромки каркаса [м]", cel: "Ветер считается на этой высоте.", gdzie: "От земли до самой высокой точки панелей.", zakres: "Ваш каркас." },
      powierzchnia: { nazwa: "Площадь панелей на каркасе [м²]", cel: "На неё действует ветер.", gdzie: "Суммарная площадь панелей на одном каркасе (например, 6 × 1,95 м²).", zakres: "Ваш каркас." },
      cenaBalastu: { nazwa: "Цена балласта [зл/кг]", cel: "Оценивает балласт, нужный при каждом угле.", gdzie: "Ваша цена.", zakres: "Подсказка {cena} зл/кг — самостоятельно отлитые бетонные блоки (значение владельца проекта, не из стандарта)." },
      moc: { nazwa: "Мощность панелей на каркасе [кВт пик]", cel: "По ней и инсоляции считается энергия.", gdzie: "Суммарная мощность панелей ÷ 1000.", zakres: "Ваш проект." },
      pr: PR_RU,
      wartoscKwh: { nazwa: "Стоимость 1 кВт·ч [зл]", cel: "Оценивает энергию при каждом угле.", gdzie: "Сколько бы вы платили за эту энергию из другого источника (сеть, генератор).", zakres: "Ваша цена." },
      okres: { nazwa: "Период анализа [лет]", cel: "За сколько лет считать стоимость энергии.", gdzie: "Столько, сколько должна простоять установка.", zakres: "Ваш выбор." },
    },
  },
}
