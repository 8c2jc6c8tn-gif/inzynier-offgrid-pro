/**
 * Help content — Module 5 (cabling and protection). Norm values used by the engines (PN-HD 60364,
 * PN-EN 60445…) are described, not copied; thresholds that the engines keep as constants enter
 * the text through `{params}`.
 */
import type { Tlumaczenie } from "./typy"

const Z_KARTY = "zakres z karty katalogowej urządzenia — aplikacja nie przyjmuje typowej wartości za Ciebie."
const TWOJA_INSTALACJA = "Twoja instalacja — zmierz albo sprawdź w projekcie, nie szacuj."

export const pl = {
  "dobor-przekroju-kabla": {
    migawka: {
      oCoChodzi:
        "Prąd płynący długim kablem traci energię jak woda w długim wężu — im dłuższa droga i cieńsza rura, tym mniej ciśnienia (napięcia) zostaje na końcu. A za cienki kabel dodatkowo się grzeje.",
      jakDziala:
        "Aplikacja sprawdza dwa warunki wg PN-HD 60364-5-52. Obciążalność: prąd z tabeli normy dla sposobu ułożenia, poprawiony o temperaturę otoczenia i liczbę kabli w wiązce, musi być większy od prądu obwodu. Spadek napięcia: na trasie tam i z powrotem nie może przekroczyć dopuszczalnego procentu. Wybiera najmniejszy przekrój spełniający oba — albo sprawdza przekrój, który podasz.",
      poCo:
        "Za cienki kabel to ryzyko pożaru (przegrzanie izolacji) i straty energii przez lata. Za gruby — niepotrzebny koszt. Margines poniżej {margines}% aplikacja oznacza jako ciasny.",
      fizyka:
        "Opór przewodu R = ρ · 2L / S (miedź ρ ≈ {rhoCu} Ω·mm²/m, aluminium ≈ {rhoAl}). Spadek napięcia ΔU = I · R. Ciepło w kablu rośnie z kwadratem prądu, a oddawanie ciepła zależy od otoczenia — stąd współczynniki k₁ (temperatura) i k₂ (grupowanie).",
    },
    pola: {
      prad: {
        nazwa: "Prąd roboczy obwodu I [A]",
        cel: "Prąd płynący w obwodzie w normalnej pracy. Od niego zależy obciążalność i spadek napięcia.",
        gdzie: "Z danych panelu, falownika albo odbiornika, albo policz: moc [W] ÷ napięcie [V].",
        zakres: Z_KARTY,
      },
      napiecie: {
        nazwa: "Napięcie systemowe U [V]",
        cel: "Napięcie obwodu — potrzebne do przeliczenia spadku napięcia na procenty. Przy niskim napięciu ten sam spadek w woltach to dużo większy procent.",
        gdzie: "Napięcie DC (12/24/48 V) albo AC (230 V) tego obwodu.",
        zakres: "Typowo 12, 24, 48 V DC albo 230 V AC.",
      },
      dlugosc: {
        nazwa: "Długość trasy L (w jedną stronę) [m]",
        cel: "Aplikacja sama liczy drogę tam i z powrotem (2L). Im dłuższa, tym większy spadek napięcia.",
        gdzie: "Rzeczywista długość kabla od źródła do odbiornika po trasie prowadzenia (z zakrętami i pionami), nie w linii prostej.",
        zakres: TWOJA_INSTALACJA,
      },
      material: {
        nazwa: "Materiał przewodnika",
        cel: "Miedź przewodzi lepiej niż aluminium — aluminium wymaga większego przekroju dla tego samego prądu.",
        gdzie: "Z opisu kabla albo koloru żyły (miedź — czerwonawa, aluminium — srebrna).",
        zakres: "Miedź (Cu) albo aluminium (Al).",
      },
      ulozenie: {
        nazwa: "Sposób ułożenia kabla",
        cel: "Im gorsze chłodzenie kabla (w rurze, w ziemi, w wiązce), tym mniej prądu może bezpiecznie przenieść — norma ma dla każdego sposobu inną tabelę.",
        gdzie: "Wybierz, jak kabel leży na najgorszym odcinku trasy.",
        zakres: "Swobodnie, w peszlu/rurze, w ziemi albo w wiązce.",
      },
      wiazka: {
        nazwa: "Liczba kabli w wiązce [szt.]",
        cel: "Kable leżące razem grzeją się nawzajem — im więcej, tym mniejszy współczynnik k₂ i tym większy potrzebny przekrój.",
        gdzie: "Policz obciążone przewody biegnące razem w jednej wiązce lub korycie.",
        zakres: TWOJA_INSTALACJA,
      },
      temperatura: {
        nazwa: "Temperatura otoczenia [°C]",
        cel: "Maksymalna temperatura wokół kabla — obniża dopuszczalny prąd (współczynnik k₁).",
        gdzie: "Najwyższa spodziewana temperatura w miejscu prowadzenia (np. poddasze latem), nie średnia roczna.",
        zakres: "Twoje warunki.",
      },
      spadek: {
        nazwa: "Dopuszczalny spadek napięcia [%]",
        cel: "Ile procent napięcia może się „zgubić” na kablu. Mniejszy spadek wymaga grubszego przewodu.",
        gdzie: "Przyjmij domyślną wartość albo wymaganie producenta odbiornika.",
        zakres: "Domyślnie {spadekAc}% AC / {spadekDc}% DC.",
      },
      sprawdzany: {
        nazwa: "Przekrój do sprawdzenia [mm²]",
        cel: "Zamiast doboru aplikacja sprawdza przekrój, który masz albo planujesz.",
        gdzie: "Z izolacji kabla (np. „6 mm²”) albo z projektu.",
        zakres: "Przekroje handlowe.",
      },
    },
  },
  "ochrona-przepieciowa-spd": {
    migawka: {
      oCoChodzi:
        "Piorun nie musi trafić w panel — wystarczy, że uderzy w pobliżu, a w kablach indukuje się napięcie, które niszczy elektronikę.",
      jakDziala:
        "Aplikacja dobiera typ ogranicznika przepięć (Typ 1 przy instalacji odgromowej, Typ 2 bez niej), sprawdza margines napięciowy Uc ≥ Voc,max × {marginesUc}, odległość paneli od zwodu (minimum {minOdleglosc} m) i uziemienie SPD przez główną szynę wyrównawczą. W osobnej sekcji liczy wskaźnik ryzyka CRL wg HD 60364-4-443 — czy SPD jest w ogóle obowiązkowy.",
      poCo:
        "SPD o za niskim Uc będzie przewodził przy zwykłym, zimowym napięciu stringu i się spali; bez SPD jedno bliskie wyładowanie potrafi zniszczyć falownik i regulator.",
      fizyka:
        "Voc stringu rośnie na mrozie, dlatego margines liczy się od zimowego Voc,max (Moduł 3, stress-test MPPT), nie od napięcia STC.",
    },
    pola: {
      voc: {
        nazwa: "Napięcie robocze stringu PV — Voc,max zimowe [V]",
        cel: "Najwyższe napięcie, jakie pojawi się na stringu (mroźny słoneczny poranek). SPD musi je wytrzymać z zapasem.",
        gdzie: "Z ekranu „Zimowy stress-test MPPT” (Moduł 3) — nie z warunków STC.",
        zakres: "Wynik z Modułu 3 dla Twojego stringu.",
      },
      odleglosc: {
        nazwa: "Odległość paneli od zwodu piorunochronu [m]",
        cel: "Zbyt mała odległość grozi przeskokiem iskry z instalacji odgromowej na panele.",
        gdzie: "Zmierz najmniejszy odstęp między konstrukcją paneli a przewodem zwodu.",
        zakres: "Minimum {minOdleglosc} m.",
      },
      uc: {
        nazwa: "Napięcie trwałej pracy Uc rozważanego SPD [V]",
        cel: "Najwyższe napięcie, przy którym SPD jeszcze nie przewodzi. Musi być co najmniej Voc,max × {marginesUc}.",
        gdzie: "Z karty katalogowej ogranicznika (Ucpv albo Uc).",
        zakres: Z_KARTY,
      },
    },
  },
  "spd-crl": {
    pola: {
      napowietrznaNn: {
        nazwa: "Długość linii napowietrznej niskiego napięcia [km]",
        cel: "Linie zasilające budynek zbierają przepięcia z burz. Linia napowietrzna nN liczy się podwójnie (2·L_PAL).",
        gdzie: "Od budynku do najbliższej stacji transformatorowej — z mapy albo od operatora.",
        zakres: "Liczy się najwyżej {lpMax} km (albo do pierwszego SPD w sieci). Dom w pełni off-grid bez linii: zostaw puste.",
      },
      kablowaNn: {
        nazwa: "Długość linii kablowej niskiego napięcia [km]",
        cel: "Kabel w ziemi zbiera mniej przepięć niż linia napowietrzna — liczy się pojedynczo (L_PCL).",
        gdzie: "Od budynku do stacji transformatorowej — z mapy albo od operatora.",
        zakres: "Liczy się najwyżej {lpMax} km. Bez linii: zostaw puste.",
      },
      napowietrznaSn: {
        nazwa: "Długość linii napowietrznej średniego napięcia [km]",
        cel: "Odcinek SN za stacją transformatorową — liczy się z wagą 0,4 (L_PAH).",
        gdzie: "Od operatora sieci albo z mapy.",
        zakres: "Liczy się najwyżej {lpMax} km łącznie. Bez linii: zostaw puste.",
      },
      kablowaSn: {
        nazwa: "Długość linii kablowej średniego napięcia [km]",
        cel: "Kablowy odcinek SN — liczy się z wagą 0,2 (L_PCH).",
        gdzie: "Od operatora sieci albo z mapy.",
        zakres: "Liczy się najwyżej {lpMax} km łącznie. Bez linii: zostaw puste.",
      },
      otoczenie: {
        nazwa: "Otoczenie budynku",
        cel: "W mieście sąsiednie budynki częściowo osłaniają linie — zmienia to współczynnik środowiskowy we wzorze.",
        gdzie: "Wiejskie/podmiejskie (mało budynków) albo miejskie.",
        zakres: "Wiejskie lub miejskie.",
      },
      ng: {
        nazwa: "Gęstość wyładowań doziemnych Ng [1/(km²·rok)]",
        cel: "Ile wyładowań rocznie trafia w km² w Twojej okolicy. Im więcej, tym mniejszy CRL i tym bardziej potrzebny SPD.",
        gdzie: "Z mapy wyładowań dla Twojej okolicy — aplikacja jej nie ma.",
        zakres: "Wartość z mapy wyładowań.",
      },
      td: {
        nazwa: "Liczba dni burzowych w roku Td [dni]",
        cel: "Zastępcze źródło, gdy nie znasz Ng: Ng = {ngNaDzien} · Td.",
        gdzie: "Z danych meteorologicznych dla regionu.",
        zakres: "Używane tylko, gdy pole Ng jest puste.",
      },
      odlegloscSpd: {
        nazwa: "Odległość do pierwszego SPD w sieci [km] (opcjonalnie)",
        cel: "Przepięcia z dalszej części linii zatrzyma ogranicznik w sieci — liczy się tylko odcinek do niego.",
        gdzie: "Od operatora sieci.",
        zakres: "Liczy się najwyżej {lpMax} km albo do tego SPD.",
      },
      kolejnosc: {
        nazwa: "Kolejność odcinków sieci od budynku",
        cel: "Liczy się tylko {lpMax} km sieci najbliżej budynku (D54). Kolejność mówi, które odcinki są przy domu.",
        gdzie: "Zwykle przy domu jest sieć nn, a za stacją transformatorową SN. Kolejność kabla i linii napowietrznej — z mapy albo od operatora.",
        zakres: "Nie wiem = liczone ostrożnie: najpierw linia napowietrzna nn (największa waga, SPD wychodzi częściej). Ma znaczenie tylko przy sieci dłuższej niż {lpMax} km.",
      },
    },
  },
  "szyny-zbiorcze-polaczenia": {
    migawka: {
      oCoChodzi:
        "Śruba to sprężyna. Za słabo dokręcona — iskrzy i grzeje się. Za mocno — pęka gwint albo miażdży końcówkę. Trzeba trafić w właściwy moment, inny dla aluminium niż dla miedzi.",
      jakDziala:
        "Lista kontrolna momentów dokręcania ze źródła: zaciski baterii, szyna główna, uziom — i obowiązkowa kontrola po 24 godzinach, bo połączenia „siadają”.",
      poCo:
        "Luźne połączenie przy dużym prądzie DC to jedna z najczęstszych przyczyn pożarów instalacji bateryjnych. Klucz dynamometryczny kosztuje mniej niż jeden spalony zacisk.",
      fizyka: "Rezystancja styku rośnie, gdy spada docisk — moc tracona P = I²R zamienia się w ciepło dokładnie w miejscu połączenia.",
    },
    pola: {},
  },
  "laczenie-cu-al": {
    migawka: {
      oCoChodzi:
        "Miedź i aluminium w wilgoci nie znoszą bezpośredniego kontaktu — trzeba je rozdzielić barierą, inaczej korodują tam, gdzie się stykają.",
      jakDziala:
        "Wybierasz dwa materiały i środowisko. Aplikacja podaje sposób łączenia tylko dla par opisanych w źródle (np. końcówki bimetalowe, pasta, podkładki); innych kombinacji nie zgaduje. Opcjonalnie przelicza przekrój miedzi na aluminium: S_Al = S_Cu × {wspAl}.",
      poCo:
        "Korozja galwaniczna podnosi rezystancję połączenia — ono się grzeje, a po latach może się przepalić.",
      fizyka:
        "Dwa metale o różnym potencjale elektrochemicznym w obecności elektrolitu (wilgoci) tworzą ogniwo — mniej szlachetny metal (aluminium) się rozpuszcza.",
    },
    pola: {
      material1: {
        nazwa: "Materiał przewodu 1",
        cel: "Pierwszy z łączonych metali.",
        gdzie: "Z opisu kabla, końcówki albo szyny.",
        zakres: "Opcje z listy.",
      },
      material2: {
        nazwa: "Materiał przewodu 2",
        cel: "Drugi z łączonych metali.",
        gdzie: "Z opisu kabla, końcówki albo szyny.",
        zakres: "Opcje z listy.",
      },
      srodowisko: {
        nazwa: "Środowisko połączenia",
        cel: "W wilgoci korozja galwaniczna postępuje szybko; w suchym wnętrzu wolno.",
        gdzie: "Gdzie jest połączenie: wewnątrz, na zewnątrz, w wilgotnym pomieszczeniu.",
        zakres: "Opcje z listy.",
      },
      przekrojCu: {
        nazwa: "Przekrój miedzi do przeliczenia [mm²] (opcjonalnie)",
        cel: "Aluminium potrzebuje większego przekroju niż miedź dla tego samego prądu — aplikacja przeliczy.",
        gdzie: "Przekrój kabla miedzianego, który chcesz zastąpić aluminiowym.",
        zakres: "Współczynnik ok. {wspAl}× (S_Al = S_Cu × {wspAl}).",
      },
    },
  },
  "zlacza-mc4": {
    migawka: {
      oCoChodzi:
        "MC4 wygląda uniwersalnie, ale styki różnych producentów nie zawsze pasują idealnie — luźny styk pod prądem robi łuk elektryczny, a to już realny pożar.",
      jakDziala:
        "Wybierasz producenta/rodzinę złączki żeńskiej i męskiej. Różne rodziny w jednym połączeniu to czerwony stop.",
      poCo:
        "Łuk w złączce na dachu przy napięciu stringu kilkuset woltów DC nie gaśnie sam — to typowa przyczyna pożarów instalacji PV.",
    },
    pola: {
      zenska: {
        nazwa: "Złączka żeńska — producent / rodzina",
        cel: "Porównywana z męską — muszą być z tej samej rodziny.",
        gdzie: "Z nadruku na złączce albo opakowania.",
        zakres: "Opcje z listy.",
      },
      meska: {
        nazwa: "Złączka męska — producent / rodzina",
        cel: "Porównywana z żeńską — muszą być z tej samej rodziny.",
        gdzie: "Z nadruku na złączce albo opakowania.",
        zakres: "Opcje z listy.",
      },
    },
  },
  "dobor-bezpiecznika-rozlacznika": {
    migawka: {
      oCoChodzi:
        "Bezpiecznik to wkładka, która ma przepalić się zanim przepali się kabel — i musi umieć przerwać prąd zwarcia.",
      jakDziala:
        "Aplikacja dobiera prąd bezpiecznika jako 1,25 × prąd obwodu i sprawdza zdolność łączeniową (AIC): musi być większa niż prąd zwarciowy w tym punkcie. AIC poniżej prądu zwarciowego to czerwony stop.",
      poCo:
        "Bezpiecznik ze zbyt małym AIC przy zwarciu z baterii litowej może eksplodować zamiast przerwać obwód.",
    },
    pola: {
      prad: {
        nazwa: "Prąd znamionowy obwodu [A]",
        cel: "Prąd pracy obwodu — bezpiecznik dobierany jest z zapasem 25%.",
        gdzie: "Z danych odbiornika/falownika albo moc ÷ napięcie.",
        zakres: Z_KARTY,
      },
      pradZwarcia: {
        nazwa: "Prąd zwarciowy w tym punkcie [A]",
        cel: "Największy prąd, jaki popłynie przy zwarciu. Bezpiecznik musi go przerwać.",
        gdzie: "Z ekranu „Analiza zwarciowa” (Moduł 5, Ekran 12) albo z karty baterii.",
        zakres: "Wynik analizy zwarciowej.",
      },
      aic: {
        nazwa: "Zdolność łączeniowa (AIC) bezpiecznika [A]",
        cel: "Największy prąd, jaki bezpiecznik potrafi bezpiecznie przerwać.",
        gdzie: "Z karty katalogowej bezpiecznika (breaking capacity).",
        zakres: Z_KARTY,
      },
    },
  },
  "dobor-mocy-falownika": {
    migawka: {
      oCoChodzi:
        "Falownik musi wytrzymać nie tylko normalną pracę, ale ułamek sekundy, gdy silnik lodówki czy pompy rusza — wtedy pobiera nawet 5–7× więcej prądu.",
      jakDziala:
        "Aplikacja dzieli moc szczytową odbiorników przez współczynnik jednoczesności (domyślnie {wspJednoczesnosci}) — współczynnik działa tu jako zapas na rozruchy, nie jako zmniejszenie sumy. Sprawdza też moc pozorną (VA) i, jeśli podasz, czy rozważany falownik wystarczy.",
      poCo:
        "Za mały falownik wyłącza się przy każdym starcie sprężarki; za duży ma większy pobór własny, który zjada baterię nocą.",
    },
    pola: {
      mocSzczytowa: {
        nazwa: "Moc szczytowa odbiorników [W]",
        cel: "Największa moc, jaka może być pobierana naraz.",
        gdzie: "Z bilansu obciążeń (Moduł 2) albo suma mocy urządzeń pracujących jednocześnie.",
        zakres: "Twoje odbiorniki.",
      },
      mocPozorna: {
        nazwa: "Moc pozorna odbiorników [VA] (opcjonalnie)",
        cel: "Przy silnikach i zasilaczach moc pozorna jest większa od czynnej — falownik musi ją udźwignąć.",
        gdzie: "Z ekranu „Moc pozorna i cos φ” (Moduł 2) albo z tabliczek (VA).",
        zakres: "Wynik z Modułu 2.",
      },
      wspolczynnik: {
        nazwa: "Współczynnik jednoczesności",
        cel: "Zapas na rozruchy silników. Mniejsza wartość = większy dobrany falownik.",
        gdzie: "Przyjmij domyślną wartość ze źródła albo swoją, jeśli znasz profil obciążenia.",
        zakres: "Domyślnie {wspJednoczesnosci}.",
      },
      mocFalownika: {
        nazwa: "Moc rozważanego falownika [W] (opcjonalnie)",
        cel: "Aplikacja sprawdzi, czy konkretny falownik wystarczy.",
        gdzie: "Z karty falownika (moc ciągła).",
        zakres: Z_KARTY,
      },
    },
  },
  "przepust-powietrza": {
    migawka: {
      oCoChodzi:
        "Panele nagrzewają się jak dach samochodu w słońcu — im gorszy przepływ powietrza pod spodem, tym gorętsze i mniej wydajne.",
      jakDziala:
        "Aplikacja ocenia szczelinę wentylacyjną pod panelami: poniżej {progKrytyczny} cm panel może osiągać ok. {tKrytyczna} °C i tracić kilkanaście procent mocy ({strata}%/°C powyżej {tStc} °C), od {progBezpieczny} cm chłodzenie jest dobre. Zakres pośredni nie jest zgadywany — źródło nie podaje zależności.",
      poCo:
        "Szczelina to darmowa moc: kilka centymetrów więcej przy montażu daje więcej energii przez całe życie instalacji.",
      fizyka: "strata % = (T_panelu − {tStc} °C) × {strata} %/°C. Moc ogniwa krzemowego spada, gdy rośnie temperatura.",
    },
    pola: {
      szczelina: {
        nazwa: "Planowana szczelina wentylacyjna pod panelami [cm]",
        cel: "Odstęp między spodem paneli a dachem — przez niego ucieka ciepło.",
        gdzie: "Z projektu konstrukcji albo zmierz po montażu.",
        zakres: "Poniżej {progKrytyczny} cm — krytycznie; od {progBezpieczny} cm — dobrze.",
      },
    },
  },
  "projekt-uziemienia": {
    migawka: {
      oCoChodzi:
        "Ziemia to też przewodnik — jeśli styk z nią jest za słaby, prąd zwarciowy nie ucieknie skutecznie i może wrócić do Ciebie.",
      jakDziala:
        "Z rezystywności gruntu i wymiarów pręta aplikacja liczy rezystancję jednego pręta (wzór Dwighta), a potem, ile prętów potrzeba, żeby zejść poniżej progu dla wybranego celu. Model wielu prętów jest uproszczony (bez wzajemnego oddziaływania) — aplikacja to zaznacza.",
      poCo:
        "Za wysoka rezystancja uziemienia to ochrona tylko na papierze: bezpiecznik albo RCD może nie zadziałać na czas.",
      fizyka: "R = ρ / (2πL) · (ln(4L/d) − 1). Dłuższy pręt obniża rezystancję skuteczniej niż grubszy.",
    },
    pola: {
      rezystywnosc: {
        nazwa: "Rezystywność gruntu ρ [Ω·m]",
        cel: "Jak dobrze grunt przewodzi prąd. Im wyższa, tym więcej prętów potrzeba.",
        gdzie: "Z pomiaru (metoda Wennera) albo wartość orientacyjna dla typu gruntu (np. glina ok. 100 Ω·m).",
        zakres: "Pomiar albo wartość orientacyjna — sucha piaszczysta ziemia ma dużo wyższą niż glina.",
      },
      dlugosc: {
        nazwa: "Długość pojedynczego pręta uziomowego [m]",
        cel: "Dłuższy pręt sięga głębszych, wilgotniejszych warstw i ma mniejszą rezystancję.",
        gdzie: "Z oferty albo projektu uziomu.",
        zakres: Z_KARTY,
      },
      srednica: {
        nazwa: "Średnica pręta uziomowego [mm]",
        cel: "Ma mały wpływ na wynik (pod logarytmem), ale jest częścią wzoru.",
        gdzie: "Z karty pręta.",
        zakres: Z_KARTY,
      },
      cel: {
        nazwa: "Cel uziemienia",
        cel: "Od celu zależy wymagany próg rezystancji: odgromowe, przeciwporażeniowe albo dla czułej elektroniki.",
        gdzie: "Wybierz, do czego służy uziom.",
        zakres: "Progi podane przy każdej opcji listy.",
      },
    },
  },
  "glowna-szyna-wyrownawcza": {
    migawka: {
      oCoChodzi:
        "Jeśli dotkniesz dwóch metalowych rzeczy o różnym potencjale, popłynie przez Ciebie prąd — główna szyna wyrównawcza (GSW) wyrównuje potencjały, więc nic nie „kopie”.",
      jakDziala:
        "Lista pięciu obowiązkowych połączeń do GSW (konstrukcja paneli, falownik, bateria, instalacja wodna, uziom) z minimalnymi przekrojami ze źródła. Osobny czerwony stop: GSW użyta do zasilania odbiorników — to błąd koncepcyjny.",
      poCo: "Bez wyrównania potencjałów awaria izolacji w jednym urządzeniu może postawić pod napięciem kran albo ramę paneli.",
    },
    pola: {},
  },
  "uziemienie-funkcjonalne-ochronne": {
    migawka: {
      oCoChodzi:
        "Uziemienie ochronne to poduszka powietrzna dla Ciebie. Funkcjonalne to stabilizator dla elektroniki. Oba są potrzebne, ale nie zawsze razem.",
      jakDziala:
        "Wybierasz układ sieci i odpowiadasz, czy biegun DC jest uziemiony. Uziemienie bieguna DC wbrew wymaganiom producenta (np. falownik w układzie IT) to czerwony stop — może uszkodzić MPPT.",
      poCo:
        "Pomylenie uziemienia funkcjonalnego z ochronnym to częsty błąd: albo ochrona nie działa, albo niszczy się elektronika.",
    },
    pola: {
      uklad: {
        nazwa: "Układ sieci",
        cel: "TN-S, TN-C-S, TT albo IT — określa, jak połączony jest przewód ochronny i neutralny. Tu informacyjnie.",
        gdzie: "Z projektu instalacji albo od elektryka; w off-gridzie często TN-S tworzony w falowniku albo IT.",
        zakres: "TN-S, TN-C-S, TT albo IT.",
      },
    },
  },
  "analiza-zwarciowa": {
    migawka: {
      oCoChodzi:
        "Zwarcie to jak wybuch — trzeba wiedzieć, ile prądu popłynie, zanim bezpiecznik zdąży przerwać obwód.",
      jakDziala:
        "Aplikacja liczy prąd zwarciowy baterii (napięcie ÷ rezystancja wewnętrzna) i paneli (Isc × liczba stringów równoległych) i bierze większy. Jeśli podasz AIC zabezpieczenia, sprawdza, czy je przerwie.",
      poCo:
        "Bateria litowa 48 V o rezystancji 10 mΩ daje przy zwarciu kilka tysięcy amperów. Każdy bezpiecznik i wyłącznik w tym obwodzie musi taki prąd przerwać — to punkt odniesienia dla innych ekranów modułu.",
      fizyka: "I_zw,bat = U / R_wewn; I_zw,PV = Isc × N_stringów. Panele dają prąd niewiele większy od znamionowego — bateria jest groźniejsza.",
    },
    pola: {
      napiecie: {
        nazwa: "Napięcie baterii [V]",
        cel: "Z napięcia i rezystancji wewnętrznej liczony jest prąd zwarcia baterii.",
        gdzie: "Napięcie znamionowe pakietu.",
        zakres: "Typowo 12, 24 albo 48 V.",
      },
      rezystancja: {
        nazwa: "Rezystancja wewnętrzna pakietu [Ω]",
        cel: "Im mniejsza, tym większy prąd zwarcia.",
        gdzie: "Z pomiaru albo karty katalogowej ogniw (suma dla połączenia szeregowego).",
        zakres: Z_KARTY,
      },
      isc: {
        nazwa: "Prąd zwarciowy panelu Isc [A]",
        cel: "Prąd zwarcia jednego stringu PV.",
        gdzie: "Z karty katalogowej panelu (Isc).",
        zakres: Z_KARTY,
      },
      stringi: {
        nazwa: "Liczba stringów PV połączonych równolegle [szt.]",
        cel: "Prądy stringów równoległych się sumują.",
        gdzie: "Z projektu instalacji.",
        zakres: TWOJA_INSTALACJA,
      },
      aic: {
        nazwa: "AIC sprawdzanego zabezpieczenia [A] (opcjonalnie)",
        cel: "Aplikacja sprawdzi, czy zabezpieczenie przerwie policzony prąd zwarcia.",
        gdzie: "Z karty katalogowej bezpiecznika albo wyłącznika (zdolność wyłączania).",
        zakres: Z_KARTY,
      },
    },
  },
  "selektywnosc-zabezpieczen": {
    migawka: {
      oCoChodzi:
        "Jak pęknie jedna rura, nie zakręcasz głównego zaworu w całym domu. Tak samo z prądem — ma zadziałać tylko ten bezpiecznik, który jest najbliżej awarii.",
      jakDziala:
        "To przewodnik, nie kalkulator: rzeczywista ocena selektywności wymaga krzywych czasowo-prądowych konkretnych zabezpieczeń od producenta. Ekran pokazuje zasady i przykład, jak je porównywać.",
      poCo: "Bez selektywności jedna usterka w gniazdku może wyłączyć cały dom — łącznie z lodówką i ogrzewaniem.",
    },
    pola: {},
  },
  "wylaczniki-nadpradowe-dc": {
    migawka: {
      oCoChodzi:
        "Prąd stały pali się jak spawarka. Wyłącznik musi umieć zgasić ten łuk, inaczej sam zamieni się w źródło pożaru.",
      jakDziala:
        "Aplikacja sprawdza, czy wyłącznik jest przeznaczony do DC i na napięcie obwodu (wyłącznik AC w obwodzie DC to czerwony stop), liczbę biegunów i — opcjonalnie — czy jego zdolność wyłączania (AIC) przewyższa prąd zwarciowy.",
      poCo: "Prąd przemienny sam przechodzi przez zero 100 razy na sekundę i łuk gaśnie; prąd stały nie — wyłącznik AC może go nie przerwać.",
    },
    pola: {
      prad: {
        nazwa: "Prąd obwodu [A]",
        cel: "Prąd pracy — dobór prądu znamionowego wyłącznika.",
        gdzie: "Z danych odbiornika albo moc ÷ napięcie.",
        zakres: Z_KARTY,
      },
      napiecie: {
        nazwa: "Napięcie DC obwodu [V]",
        cel: "Wyłącznik musi być przewidziany na to napięcie DC — przy wyższym napięciu łuk trudniej zgasić.",
        gdzie: "Napięcie baterii albo Voc,max stringu.",
        zakres: "Z karty wyłącznika (napięcie znamionowe DC).",
      },
      bieguny: {
        nazwa: "Liczba biegunów",
        cel: "Przy wyższych napięciach DC producent często wymaga połączenia kilku biegunów szeregowo.",
        gdzie: "Z karty wyłącznika i schematu połączeń producenta.",
        zakres: Z_KARTY,
      },
      aic: {
        nazwa: "Zdolność wyłączania (AIC) [A] (opcjonalnie)",
        cel: "Porównywana z prądem zwarciowym w tym punkcie.",
        gdzie: "Z karty katalogowej wyłącznika.",
        zakres: Z_KARTY,
      },
      pradZwarcia: {
        nazwa: "Prąd zwarciowy w tym punkcie [A] (opcjonalnie)",
        cel: "Największy prąd, jaki wyłącznik może musieć przerwać.",
        gdzie: "Z ekranu „Analiza zwarciowa”.",
        zakres: "Wynik analizy zwarciowej.",
      },
    },
  },
  "ochrona-odwrotna-polaryzacja": {
    migawka: {
      oCoChodzi:
        "Plus z minusem to jak ogień z benzyną. Zabezpieczenie to blokada, która nie pozwala na pomyłkę przy podłączaniu.",
      jakDziala:
        "Aplikacja porównuje diodę blokującą (prosta, ale traci trochę energii) i wyłącznik z blokadą mechaniczną. Brak jakiejkolwiek ochrony to czerwony stop.",
      poCo: "Odwrotne podłączenie baterii do falownika potrafi w ułamku sekundy zniszczyć jego wejście — i nie jest objęte gwarancją.",
    },
    pola: {
      miejsce: {
        nazwa: "Miejsce obwodu",
        cel: "Gdzie jest zabezpieczenie: przy baterii, stringu PV czy falowniku. Tu informacyjnie.",
        gdzie: "Twoja instalacja.",
        zakres: "Bateria, panele / string PV albo falownik.",
      },
      ochrona: {
        nazwa: "Zastosowana ochrona",
        cel: "Dioda blokująca, wyłącznik z blokadą mechaniczną albo brak. Brak — czerwony stop.",
        gdzie: "Z projektu instalacji albo oględzin.",
        zakres: "Opcje z listy.",
      },
    },
  },
  "wylaczniki-rcd": {
    migawka: {
      oCoChodzi:
        "RCD (wyłącznik różnicowoprądowy) wyczuwa, że prąd ucieka tam, gdzie nie powinien — np. przez Twoje ciało — i wyłącza w ułamku sekundy.",
      jakDziala:
        "Aplikacja sprawdza trzy niezależne reguły: przy falowniku hybrydowym potrzebny jest typ B, przy silnikach co najmniej typ A, a prąd różnicowy — {progOsob} mA dla ochrony osób albo {progPozar} mA dla ochrony przeciwpożarowej.",
      poCo:
        "Zwykły RCD typu AC może „oślepnąć” na prąd stały płynący od falownika — i nie zadziała, gdy będzie potrzebny.",
    },
    pola: {
      typ: {
        nazwa: "Typ zainstalowanego RCD",
        cel: "AC wykrywa tylko prąd przemienny, A także pulsujący, B także gładki prąd stały.",
        gdzie: "Z nadruku na wyłączniku (symbol typu) albo karty.",
        zakres: "AC, A albo B.",
      },
      cel: {
        nazwa: "Cel ochrony obwodu",
        cel: "Ochrona osób wymaga czułego RCD ({progOsob} mA), ochrona przeciwpożarowa dopuszcza {progPozar} mA.",
        gdzie: "Gniazda i obwody, których dotykają ludzie — ochrona osób; wyłącznik główny — często przeciwpożarowa.",
        zakres: "{progOsob} mA albo {progPozar} mA.",
      },
      prad: {
        nazwa: "Prąd różnicowy zainstalowanego RCD [mA]",
        cel: "Porównywany z wymaganym progiem dla celu ochrony.",
        gdzie: "Z nadruku na wyłączniku (IΔn).",
        zakres: "{progOsob} mA dla osób, {progPozar} mA przeciwpożarowo.",
      },
    },
  },
  "ochrona-przed-dotykiem": {
    migawka: {
      oCoChodzi:
        "Prąd nie wybacza. Jak dotkniesz nieosłoniętego plusa, nie zdążysz zareagować. Osłony i szybkie wyłączenie to Twoje bezpieczeństwo.",
      jakDziala:
        "Lista kontrolna dwóch mechanizmów: ochrony podstawowej (osłony, izolacja, obudowy) i ochrony przy uszkodzeniu (samoczynne wyłączenie, wyrównanie potencjałów).",
      poCo: "Przy bateriach 48 V i stringach PV kilkaset woltów DC nieosłonięty zacisk to realne zagrożenie życia.",
    },
    pola: {},
  },
  "monitorowanie-izolacji-imd": {
    migawka: {
      oCoChodzi:
        "W układzie IT nie ma bezpośredniego uziemienia, więc pierwsze doziemienie nie wyłączy bezpiecznika. Przekaźnik kontroli izolacji (IMD) wyłapie problem, zanim stanie się groźny.",
      jakDziala:
        "Dla układu IT aplikacja wymaga IMD (brak — czerwony stop) i sprawdza próg alarmu, który wpisujesz. Źródło podaje przykład {progPrzyklad} kΩ, ale realny próg zależy od napięcia systemu i producenta.",
      poCo: "Pierwsze doziemienie w IT jest „ciche”; drugie robi zwarcie. IMD daje czas na naprawę między nimi.",
    },
    pola: {
      prog: {
        nazwa: "Próg alarmu IMD [kΩ]",
        cel: "Rezystancja izolacji, poniżej której IMD zgłasza alarm.",
        gdzie: "Z zaleceń producenta IMD i instalacji.",
        zakres: "Przykład ze źródła: {progPrzyklad} kΩ — nie wartość uniwersalna.",
      },
    },
  },
  "trasy-kablowe": {
    migawka: {
      oCoChodzi:
        "Kable to drogi. Nie chcesz, żeby ruch tranzytowy (prąd) blokował spokojną uliczkę (internet) — trzeba je prowadzić osobno.",
      jakDziala: "Przewodnik z zasadami prowadzenia tras: separacja kabli siłowych i sygnałowych, osłony, zakręty, oznaczenia.",
      poCo: "Dobrze poprowadzona trasa to mniej zakłóceń, łatwiejszy serwis i mniejsze ryzyko uszkodzenia kabla.",
    },
    pola: {},
  },
  "oznakowanie-obwodow": {
    migawka: {
      oCoChodzi: "Za 5 lat zapomnisz, co jest czym. Etykieta to pamięć Twojego systemu.",
      jakDziala:
        "Lista kodów oznaczeń przewodów wg PN-EN 60445 (+, −, PE, U, N). Kolorystyki żył aplikacja nie narzuca — tej normy nie ma w repozytorium.",
      poCo: "Serwisant (albo Ty za kilka lat) musi w 10 sekund wiedzieć, który przewód jest plusem, a który ochronnym.",
    },
    pola: {},
  },
  "normy-i-certyfikaty": {
    migawka: {
      oCoChodzi: "Certyfikat to dowód, że coś nie wybuchnie przy normalnym użytkowaniu. Bez niego jesteś testerem wersji beta.",
      jakDziala:
        "Lista kontrolna norm dla kluczowych komponentów: IEC 61730 (panele), IEC 62109 (falownik), IEC 62619 (baterie litowe) i zbiorczy wpis dla pozostałych.",
      poCo: "Tani sprzęt bez certyfikatów to częsta przyczyna pożarów — i problem przy ubezpieczeniu oraz odbiorze instalacji.",
    },
    pola: {},
  },
  "string-box": {
    migawka: {
      oCoChodzi:
        "String box to węzeł, w którym kable z paneli spotykają się w uporządkowany sposób — bez niego masz plątaninę i ryzyko pożaru.",
      jakDziala:
        "Aplikacja sprawdza, czy skrzynka ma dość wejść DC na Twoje stringi, czy bezpiecznik stringowy mieści się w zalecanym zakresie ({bezpMin}–{bezpMax} A) i czy przy łączeniu na zewnątrz skrzynka ma IP66 (brak — czerwony stop).",
      poCo: "Przy kilku stringach równoległych uszkodzony string może przyjąć prąd pozostałych — bezpieczniki stringowe temu zapobiegają.",
    },
    pola: {
      stringi: {
        nazwa: "Liczba stringów",
        cel: "Ile łańcuchów paneli trafia do skrzynki.",
        gdzie: "Z projektu instalacji.",
        zakres: TWOJA_INSTALACJA,
      },
      wejscia: {
        nazwa: "Liczba wejść DC skrzynki",
        cel: "Musi być co najmniej tyle, ile stringów.",
        gdzie: "Z karty skrzynki.",
        zakres: Z_KARTY,
      },
      bezpiecznik: {
        nazwa: "Bezpiecznik stringowy [A]",
        cel: "Chroni string przed prądem wstecznym z pozostałych stringów.",
        gdzie: "Z projektu albo karty panelu (maksymalny bezpiecznik szeregowy).",
        zakres: "Zalecany zakres: {bezpMin}–{bezpMax} A na string.",
      },
    },
  },
  "separacja-emc": {
    migawka: {
      oCoChodzi: "Prąd w kablu wytwarza pole magnetyczne. To pole może „zagłuszyć” kabel internetowy. Trzeba je rozdzielić.",
      jakDziala:
        "Przewodnik: minimalny odstęp kabli siłowych od sygnałowych 10–20 cm, krzyżowanie pod kątem prostym, ekranowana skrętka (FTP) blisko falownika.",
      poCo: "Falownik to źródło silnych zakłóceń — źle poprowadzony kabel sieciowy albo czujnika zacznie gubić dane.",
    },
    pola: {},
  },
  "peszle-koryta-rurki": {
    migawka: {
      oCoChodzi:
        "Osłona to ubranie dla kabla. Musi być dobrana do pogody i miejsca, inaczej kabel zużyje się przedwcześnie.",
      jakDziala: "Wybierasz miejsce montażu — aplikacja podaje właściwą osłonę ze źródła: peszel karbowany, peszel odporny na UV, rurę HDPE albo korytko metalowe.",
      poCo: "Zwykły peszel na słońcu kruszy się po kilku latach; w ziemi bez rury kabel narażony jest na uszkodzenie mechaniczne.",
    },
    pola: {
      miejsce: {
        nazwa: "Miejsce montażu",
        cel: "Od miejsca zależy, jaka osłona wytrzyma warunki (UV, wilgoć, nacisk, temperatura).",
        gdzie: "Gdzie biegnie ten odcinek trasy.",
        zakres: "Opcje z listy.",
      },
    },
  },
  "ochrona-przed-gryzoniami": {
    migawka: {
      oCoChodzi: "Mysz nie patrzy, czy kabel jest ładny. Po prostu go przegryzie i zrobi zwarcie.",
      jakDziala: "Wybierasz poziom ryzyka gryzoni. Przy wysokim ryzyku aplikacja wskazuje peszel metalowy spiralny, przy niskim wystarczy plastikowy.",
      poCo: "Przegryziony kabel DC w stodole albo na strychu to ryzyko zwarcia i pożaru — często w miejscu, którego nikt nie ogląda.",
    },
    pola: {
      ryzyko: {
        nazwa: "Ryzyko gryzoni w okolicy",
        cel: "Od ryzyka zależy wymagana osłona kabli.",
        gdzie: "Twoja ocena: gospodarstwo, stodoła, las, poddasze — zwykle wysokie.",
        zakres: "Opcje z listy.",
      },
    },
  },
  "optymalizacja-trasy-kabla": {
    migawka: {
      oCoChodzi:
        "Nie patrz tylko na cenę kabla — grubszy, krótszy kabel często zwraca się w mniejszych stratach przez lata.",
      jakDziala:
        "Dla dwóch wariantów trasy aplikacja liczy roczną stratę energii tym samym silnikiem co dobór przekroju (Moduł 5, Ekran 1) i koszt całkowity: zakup + strata × lata × cena kWh.",
      poCo: "Żeby porównać warianty uczciwie — tańszy na starcie kabel bywa droższy po 10 latach.",
      fizyka: "TCO = koszt zakupu + strata roczna [kWh] × lata × cena kWh.",
    },
    pola: {
      prad: {
        nazwa: "Prąd obwodu [A]",
        cel: "Wspólny dla obu wariantów trasy — od niego zależą straty.",
        gdzie: "Z danych odbiornika albo moc ÷ napięcie.",
        zakres: Z_KARTY,
      },
      napiecie: {
        nazwa: "Napięcie systemowe [V]",
        cel: "Do przeliczenia spadku napięcia.",
        gdzie: "Napięcie obwodu.",
        zakres: "Typowo 12/24/48 V DC albo 230 V AC.",
      },
      material: {
        nazwa: "Materiał przewodnika",
        cel: "Miedź albo aluminium — różna rezystywność.",
        gdzie: "Z opisu kabla.",
        zakres: "Cu albo Al.",
      },
      ulozenie: {
        nazwa: "Sposób ułożenia",
        cel: "Wpływa na obciążalność kabla (tabela normy).",
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
        zakres: TWOJA_INSTALACJA,
      },
      spadek: {
        nazwa: "Dopuszczalny spadek napięcia [%]",
        cel: "Warunek, który oba warianty muszą spełnić.",
        gdzie: "Domyślna wartość albo wymaganie producenta.",
        zakres: "Domyślnie {spadekAc}% AC / {spadekDc}% DC.",
      },
      cenaEnergii: {
        nazwa: "Cena energii elektrycznej [zł/kWh]",
        cel: "Wycenia stratę energii w kablu.",
        gdzie: "Z rachunku (koszt 1 kWh) albo koszt energii z instalacji.",
        zakres: "Twoja cena.",
      },
      horyzont: {
        nazwa: "Horyzont porównania [lat]",
        cel: "Przez ile lat sumowane są straty.",
        gdzie: "Tyle, ile ma pracować instalacja.",
        zakres: "Twój wybór.",
      },
      dlugosc: {
        nazwa: "Długość trasy [m]",
        cel: "Długość kabla w danym wariancie.",
        gdzie: "Zmierz po planowanej trasie.",
        zakres: TWOJA_INSTALACJA,
      },
      przekroj: {
        nazwa: "Przekrój rozważany [mm²]",
        cel: "Przekrój kabla w danym wariancie.",
        gdzie: "Z oferty albo projektu.",
        zakres: "Przekroje handlowe.",
      },
      koszt: {
        nazwa: "Koszt zakupu wariantu [zł]",
        cel: "Kabel, osłony i robocizna dla tego wariantu.",
        gdzie: "Z oferty.",
        zakres: "Twoja cena.",
      },
    },
  },
  "puszki-polaczeniowe": {
    migawka: {
      oCoChodzi: "Każde połączenie to potencjalny przeciek. Trzeba je zamknąć w szczelnej puszce, żeby woda nie zrobiła zwarcia.",
      jakDziala: "Wybierasz miejsce montażu — aplikacja podaje typ puszki ze źródła: IP66 z dławikami, zalewana żywicą albo IP20 do suchych wnętrz.",
      poCo: "Wilgoć w puszce na zewnątrz powoduje korozję i upływy — często widoczne dopiero, gdy wyłączy się RCD albo IMD.",
    },
    pola: {
      miejsce: {
        nazwa: "Miejsce montażu puszki",
        cel: "Od miejsca zależy wymagana szczelność.",
        gdzie: "Gdzie jest połączenie.",
        zakres: "Opcje z listy.",
      },
    },
  },
  "dobor-izolacji-kabla": {
    migawka: {
      oCoChodzi: "Izolacja to skóra kabla — musi być dobrana do temperatury i miejsca, inaczej pęka i puszcza wilgoć.",
      jakDziala: "Aplikacja porównuje najwyższą spodziewaną temperaturę z dopuszczalną dla izolacji: PVC do 70 °C, XLPE do 90 °C. Miejsce trasy to tylko podpowiedź.",
      poCo: "Kabel PVC na gorącym dachu albo przy falowniku starzeje się szybko — izolacja twardnieje i pęka.",
    },
    pola: {
      miejsce: {
        nazwa: "Miejsce trasy (informacyjnie)",
        cel: "Podpowiada, jakich temperatur się spodziewać. Nie wpływa na wynik.",
        gdzie: "Gdzie biegnie kabel.",
        zakres: "Opcje z listy.",
      },
      izolacja: {
        nazwa: "Rozważana izolacja kabla",
        cel: "PVC (np. YKY/YAKY) wytrzymuje do 70 °C, XLPE do 90 °C.",
        gdzie: "Z oznaczenia kabla albo karty.",
        zakres: "PVC albo XLPE.",
      },
      temperatura: {
        nazwa: "Maksymalna spodziewana temperatura [°C]",
        cel: "Porównywana z dopuszczalną temperaturą izolacji.",
        gdzie: "Najgorętsze miejsce trasy latem (dach, poddasze, przy falowniku).",
        zakres: "PVC do 70 °C, XLPE do 90 °C.",
      },
    },
  },
  "pomiary-powykonawcze": {
    migawka: {
      oCoChodzi:
        "Ostatni krok przed odbiorem instalacji — sześć testów, każdy z twardym progiem. Dowolny wynik poza progiem oznacza brak formalnego odbioru.",
      jakDziala:
        "Wpisujesz wyniki pomiarów: rezystancja izolacji (powyżej {minIzolacja} MΩ), rezystancja uziemienia (próg zależny od celu), czas zadziałania RCD (poniżej {maxRcd} s) i potwierdzasz trzy testy kontrolne. Każdy brak albo wynik poza progiem to czerwony stop.",
      poCo: "Pomiary to jedyny dowód, że instalacja jest bezpieczna — i dokument potrzebny przy odbiorze oraz ubezpieczeniu.",
    },
    pola: {
      izolacja: {
        nazwa: "Rezystancja izolacji [MΩ]",
        cel: "Jak dobrze izolacja oddziela przewody od siebie i od ziemi.",
        gdzie: "Z pomiaru miernikiem izolacji (induktorem) — protokół elektryka.",
        zakres: "Wymagane powyżej {minIzolacja} MΩ.",
      },
      celUziemienia: {
        nazwa: "Cel uziemienia",
        cel: "Od celu zależy próg rezystancji uziemienia.",
        gdzie: "Do czego służy mierzony uziom.",
        zakres: "Progi podane przy opcjach listy.",
      },
      uziemienie: {
        nazwa: "Rezystancja uziemienia [Ω]",
        cel: "Porównywana z progiem dla celu uziemienia.",
        gdzie: "Z pomiaru miernikiem uziemień — protokół elektryka.",
        zakres: "Próg zależny od celu (podany przy opcjach).",
      },
      rcd: {
        nazwa: "Czas zadziałania RCD [s]",
        cel: "Jak szybko wyłącznik różnicowoprądowy odcina zasilanie przy upływie.",
        gdzie: "Z pomiaru testerem RCD — protokół elektryka.",
        zakres: "Wymagane poniżej {maxRcd} s.",
      },
    },
  },
}

const Z_KARTY_EN = "range from the device datasheet — the app does not assume a typical value for you."
const TWOJA_INSTALACJA_EN = "Your installation — measure it or check the design, don't guess."

export const en: Tlumaczenie<typeof pl> = {
  "dobor-przekroju-kabla": {
    migawka: {
      oCoChodzi:
        "Current flowing through a long cable loses energy like water in a long hose — the longer the path and the thinner the pipe, the less pressure (voltage) is left at the end. And a cable that is too thin also heats up.",
      jakDziala:
        "The app checks two conditions per HD 60364-5-52. Current-carrying capacity: the current from the standard's table for the installation method, corrected for ambient temperature and the number of cables in the bundle, must exceed the circuit current. Voltage drop: over the route there and back it must not exceed the allowed percentage. It picks the smallest cross-section meeting both — or checks the one you enter.",
      poCo:
        "A cable that is too thin is a fire risk (overheated insulation) and wastes energy for years. Too thick — needless cost. The app marks a margin below {margines}% as tight.",
      fizyka:
        "Conductor resistance R = ρ · 2L / S (copper ρ ≈ {rhoCu} Ω·mm²/m, aluminium ≈ {rhoAl}). Voltage drop ΔU = I · R. Heat in a cable grows with the square of the current, and heat dissipation depends on the surroundings — hence the factors k₁ (temperature) and k₂ (grouping).",
    },
    pola: {
      prad: {
        nazwa: "Circuit operating current I [A]",
        cel: "The current in the circuit in normal operation. Capacity and voltage drop depend on it.",
        gdzie: "From the panel, inverter or load data, or calculate: power [W] ÷ voltage [V].",
        zakres: Z_KARTY_EN,
      },
      napiecie: {
        nazwa: "System voltage U [V]",
        cel: "The circuit voltage — needed to convert the voltage drop to percent. At low voltage the same drop in volts is a much larger percentage.",
        gdzie: "DC voltage (12/24/48 V) or AC (230 V) of this circuit.",
        zakres: "Typically 12, 24, 48 V DC or 230 V AC.",
      },
      dlugosc: {
        nazwa: "Route length L (one way) [m]",
        cel: "The app itself counts the path there and back (2L). The longer it is, the larger the voltage drop.",
        gdzie: "The real cable length from source to load along the route (with bends and risers), not in a straight line.",
        zakres: TWOJA_INSTALACJA_EN,
      },
      material: {
        nazwa: "Conductor material",
        cel: "Copper conducts better than aluminium — aluminium needs a larger cross-section for the same current.",
        gdzie: "From the cable description or the core colour (copper — reddish, aluminium — silver).",
        zakres: "Copper (Cu) or aluminium (Al).",
      },
      ulozenie: {
        nazwa: "Installation method",
        cel: "The worse the cable is cooled (in a conduit, in the ground, in a bundle), the less current it can carry safely — the standard has a different table for each method.",
        gdzie: "Choose how the cable lies on the worst section of the route.",
        zakres: "Free air, in conduit/pipe, in the ground or in a bundle.",
      },
      wiazka: {
        nazwa: "Number of cables in the bundle [pcs]",
        cel: "Cables lying together heat each other — the more there are, the lower the k₂ factor and the larger the required cross-section.",
        gdzie: "Count the loaded conductors running together in one bundle or tray.",
        zakres: TWOJA_INSTALACJA_EN,
      },
      temperatura: {
        nazwa: "Ambient temperature [°C]",
        cel: "The maximum temperature around the cable — it lowers the allowed current (factor k₁).",
        gdzie: "The highest expected temperature along the route (e.g. an attic in summer), not the annual average.",
        zakres: "Your conditions.",
      },
      spadek: {
        nazwa: "Allowed voltage drop [%]",
        cel: "What percentage of the voltage may be “lost” in the cable. A smaller drop requires a thicker conductor.",
        gdzie: "Accept the default or the load manufacturer's requirement.",
        zakres: "Default {spadekAc}% AC / {spadekDc}% DC.",
      },
      sprawdzany: {
        nazwa: "Cross-section to check [mm²]",
        cel: "Instead of sizing, the app checks the cross-section you have or plan.",
        gdzie: "From the cable insulation (e.g. “6 mm²”) or the design.",
        zakres: "Standard sizes.",
      },
    },
  },
  "ochrona-przepieciowa-spd": {
    migawka: {
      oCoChodzi:
        "Lightning doesn't have to hit the panel — a strike nearby is enough to induce a voltage in the cables that destroys electronics.",
      jakDziala:
        "The app selects the surge protective device type (Type 1 with a lightning protection system, Type 2 without), checks the voltage margin Uc ≥ Voc,max × {marginesUc}, the distance of the panels from the air terminal (minimum {minOdleglosc} m) and SPD earthing via the main earthing bar. In a separate section it calculates the CRL risk index per HD 60364-4-443 — whether an SPD is mandatory at all.",
      poCo:
        "An SPD with too low a Uc will conduct at the ordinary winter string voltage and burn out; without an SPD one nearby strike can destroy the inverter and controller.",
      fizyka:
        "String Voc rises in the cold, so the margin is calculated from the winter Voc,max (Module 3, MPPT stress test), not from the STC voltage.",
    },
    pola: {
      voc: {
        nazwa: "PV string operating voltage — winter Voc,max [V]",
        cel: "The highest voltage that will appear on the string (a frosty sunny morning). The SPD must withstand it with a margin.",
        gdzie: "From the “Winter MPPT stress test” screen (Module 3) — not from STC conditions.",
        zakres: "The Module 3 result for your string.",
      },
      odleglosc: {
        nazwa: "Distance of panels from the air terminal [m]",
        cel: "Too small a distance risks a spark jumping from the lightning protection system to the panels.",
        gdzie: "Measure the smallest gap between the panel structure and the air terminal conductor.",
        zakres: "Minimum {minOdleglosc} m.",
      },
      uc: {
        nazwa: "Maximum continuous operating voltage Uc of the SPD [V]",
        cel: "The highest voltage at which the SPD does not yet conduct. It must be at least Voc,max × {marginesUc}.",
        gdzie: "From the SPD datasheet (Ucpv or Uc).",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "spd-crl": {
    pola: {
      napowietrznaNn: {
        nazwa: "Low-voltage overhead line length [km]",
        cel: "Lines feeding the building pick up surges from storms. An LV overhead line counts double (2·L_PAL).",
        gdzie: "From the building to the nearest transformer station — from a map or the operator.",
        zakres: "At most {lpMax} km counts (or up to the first SPD in the network). A fully off-grid house with no line: leave empty.",
      },
      kablowaNn: {
        nazwa: "Low-voltage underground cable length [km]",
        cel: "A buried cable picks up fewer surges than an overhead line — it counts once (L_PCL).",
        gdzie: "From the building to the transformer station — from a map or the operator.",
        zakres: "At most {lpMax} km counts. No line: leave empty.",
      },
      napowietrznaSn: {
        nazwa: "Medium-voltage overhead line length [km]",
        cel: "The MV section beyond the transformer station — counts with a weight of 0.4 (L_PAH).",
        gdzie: "From the network operator or a map.",
        zakres: "At most {lpMax} km in total counts. No line: leave empty.",
      },
      kablowaSn: {
        nazwa: "Medium-voltage underground cable length [km]",
        cel: "An MV cable section — counts with a weight of 0.2 (L_PCH).",
        gdzie: "From the network operator or a map.",
        zakres: "At most {lpMax} km in total counts. No line: leave empty.",
      },
      otoczenie: {
        nazwa: "Building surroundings",
        cel: "In a town neighbouring buildings partly shield the lines — this changes the environmental factor in the formula.",
        gdzie: "Rural/suburban (few buildings) or urban.",
        zakres: "Rural or urban.",
      },
      ng: {
        nazwa: "Ground flash density Ng [1/(km²·year)]",
        cel: "How many flashes per year strike a km² in your area. The more, the lower the CRL and the more an SPD is needed.",
        gdzie: "From a lightning density map for your area — the app doesn't have one.",
        zakres: "The value from the lightning map.",
      },
      td: {
        nazwa: "Thunderstorm days per year Td [days]",
        cel: "A substitute source when you don't know Ng: Ng = {ngNaDzien} · Td.",
        gdzie: "From meteorological data for the region.",
        zakres: "Used only when the Ng field is empty.",
      },
      odlegloscSpd: {
        nazwa: "Distance to the first SPD in the network [km] (optional)",
        cel: "Surges from further along the line are stopped by the network SPD — only the section up to it counts.",
        gdzie: "From the network operator.",
        zakres: "At most {lpMax} km or up to that SPD.",
      },
      kolejnosc: {
        nazwa: "Order of network sections from the building",
        cel: "Only the {lpMax} km of network nearest the building counts (D54). The order says which sections are at the house.",
        gdzie: "Usually the LV network is at the house and MV beyond the transformer station. The order of cable and overhead line — from a map or the network operator.",
        zakres: "Don't know = conservative: LV overhead line first (highest weight, SPD comes out more often). Matters only for a network longer than {lpMax} km.",
      },
    },
  },
  "szyny-zbiorcze-polaczenia": {
    migawka: {
      oCoChodzi:
        "A bolt is a spring. Too loose — it sparks and heats up. Too tight — the thread breaks or the lug is crushed. You have to hit the right torque, which is different for aluminium than for copper.",
      jakDziala:
        "A checklist of tightening torques from the source: battery terminals, main busbar, earth electrode — and a mandatory re-check after 24 hours, because connections “settle”.",
      poCo:
        "A loose connection at high DC current is one of the most common causes of battery installation fires. A torque wrench costs less than one burnt terminal.",
      fizyka: "Contact resistance rises when clamping pressure falls — the lost power P = I²R turns into heat exactly at the connection.",
    },
    pola: {},
  },
  "laczenie-cu-al": {
    migawka: {
      oCoChodzi:
        "Copper and aluminium in moisture can't stand direct contact — they must be separated by a barrier, otherwise they corrode where they touch.",
      jakDziala:
        "You choose two materials and the environment. The app gives the joining method only for pairs described in the source (e.g. bimetallic lugs, paste, washers); it does not guess other combinations. Optionally it converts a copper cross-section to aluminium: S_Al = S_Cu × {wspAl}.",
      poCo: "Galvanic corrosion raises the joint's resistance — it heats up and after years may burn through.",
      fizyka:
        "Two metals with different electrochemical potentials in the presence of an electrolyte (moisture) form a cell — the less noble metal (aluminium) dissolves.",
    },
    pola: {
      material1: {
        nazwa: "Conductor 1 material",
        cel: "The first of the metals being joined.",
        gdzie: "From the cable, lug or bar description.",
        zakres: "Options on the list.",
      },
      material2: {
        nazwa: "Conductor 2 material",
        cel: "The second of the metals being joined.",
        gdzie: "From the cable, lug or bar description.",
        zakres: "Options on the list.",
      },
      srodowisko: {
        nazwa: "Joint environment",
        cel: "In moisture galvanic corrosion progresses quickly; in a dry interior slowly.",
        gdzie: "Where the joint is: indoors, outdoors, in a damp room.",
        zakres: "Options on the list.",
      },
      przekrojCu: {
        nazwa: "Copper cross-section to convert [mm²] (optional)",
        cel: "Aluminium needs a larger cross-section than copper for the same current — the app converts it.",
        gdzie: "The cross-section of the copper cable you want to replace with aluminium.",
        zakres: "Factor about {wspAl}× (S_Al = S_Cu × {wspAl}).",
      },
    },
  },
  "zlacza-mc4": {
    migawka: {
      oCoChodzi:
        "MC4 looks universal, but contacts from different manufacturers don't always fit perfectly — a loose contact under current makes an electric arc, and that is a real fire.",
      jakDziala: "You choose the manufacturer/family of the female and male connector. Different families in one connection are a red stop.",
      poCo: "An arc in a connector on the roof at a string voltage of several hundred volts DC doesn't go out by itself — a typical cause of PV fires.",
    },
    pola: {
      zenska: {
        nazwa: "Female connector — manufacturer / family",
        cel: "Compared with the male one — they must be from the same family.",
        gdzie: "From the print on the connector or the packaging.",
        zakres: "Options on the list.",
      },
      meska: {
        nazwa: "Male connector — manufacturer / family",
        cel: "Compared with the female one — they must be from the same family.",
        gdzie: "From the print on the connector or the packaging.",
        zakres: "Options on the list.",
      },
    },
  },
  "dobor-bezpiecznika-rozlacznika": {
    migawka: {
      oCoChodzi:
        "A fuse is a link that must blow before the cable burns — and it must be able to interrupt the short-circuit current.",
      jakDziala:
        "The app sizes the fuse current as 1.25 × the circuit current and checks the breaking capacity (AIC): it must be higher than the short-circuit current at that point. AIC below the short-circuit current is a red stop.",
      poCo: "A fuse with too low an AIC can explode instead of breaking the circuit on a lithium battery short circuit.",
    },
    pola: {
      prad: {
        nazwa: "Circuit rated current [A]",
        cel: "The operating current — the fuse is sized with a 25% margin.",
        gdzie: "From the load/inverter data or power ÷ voltage.",
        zakres: Z_KARTY_EN,
      },
      pradZwarcia: {
        nazwa: "Short-circuit current at this point [A]",
        cel: "The largest current that will flow in a short circuit. The fuse must interrupt it.",
        gdzie: "From the “Short-circuit analysis” screen (Module 5, Screen 12) or the battery datasheet.",
        zakres: "The short-circuit analysis result.",
      },
      aic: {
        nazwa: "Fuse breaking capacity (AIC) [A]",
        cel: "The largest current the fuse can safely interrupt.",
        gdzie: "From the fuse datasheet (breaking capacity).",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "dobor-mocy-falownika": {
    migawka: {
      oCoChodzi:
        "An inverter must withstand not only normal operation but the split second when a fridge or pump motor starts — it then draws up to 5–7× more current.",
      jakDziala:
        "The app divides the peak power of the loads by the simultaneity factor (default {wspJednoczesnosci}) — here the factor works as a margin for motor starts, not as a reduction of the sum. It also checks apparent power (VA) and, if you enter it, whether the considered inverter is enough.",
      poCo: "Too small an inverter shuts down at every compressor start; too large has a higher standby draw that eats the battery at night.",
    },
    pola: {
      mocSzczytowa: {
        nazwa: "Peak power of loads [W]",
        cel: "The largest power that can be drawn at once.",
        gdzie: "From the load balance (Module 2) or the sum of the powers of devices running simultaneously.",
        zakres: "Your loads.",
      },
      mocPozorna: {
        nazwa: "Apparent power of loads [VA] (optional)",
        cel: "With motors and power supplies apparent power is higher than active — the inverter must carry it.",
        gdzie: "From the “Apparent power and cos φ” screen (Module 2) or from nameplates (VA).",
        zakres: "The Module 2 result.",
      },
      wspolczynnik: {
        nazwa: "Simultaneity factor",
        cel: "A margin for motor starts. A smaller value = a larger inverter.",
        gdzie: "Accept the source's default or your own if you know the load profile.",
        zakres: "Default {wspJednoczesnosci}.",
      },
      mocFalownika: {
        nazwa: "Power of the considered inverter [W] (optional)",
        cel: "The app checks whether a specific inverter is enough.",
        gdzie: "From the inverter datasheet (continuous power).",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "przepust-powietrza": {
    migawka: {
      oCoChodzi:
        "Panels heat up like a car roof in the sun — the worse the airflow underneath, the hotter and less efficient they are.",
      jakDziala:
        "The app assesses the ventilation gap under the panels: below {progKrytyczny} cm a panel can reach about {tKrytyczna} °C and lose over ten percent of its power ({strata}%/°C above {tStc} °C); from {progBezpieczny} cm cooling is good. The intermediate range is not guessed — the source gives no relationship.",
      poCo: "The gap is free power: a few centimetres more at installation give more energy for the whole life of the system.",
      fizyka: "loss % = (T_panel − {tStc} °C) × {strata} %/°C. The power of a silicon cell falls as temperature rises.",
    },
    pola: {
      szczelina: {
        nazwa: "Planned ventilation gap under the panels [cm]",
        cel: "The gap between the underside of the panels and the roof — heat escapes through it.",
        gdzie: "From the mounting structure design or measure after installation.",
        zakres: "Below {progKrytyczny} cm — critical; from {progBezpieczny} cm — good.",
      },
    },
  },
  "projekt-uziemienia": {
    migawka: {
      oCoChodzi:
        "The ground is also a conductor — if the contact with it is too weak, the fault current won't escape effectively and may come back to you.",
      jakDziala:
        "From soil resistivity and rod dimensions the app calculates the resistance of one rod (Dwight's formula), then how many rods are needed to get below the threshold for the chosen purpose. The multi-rod model is simplified (no mutual interaction) — the app says so.",
      poCo: "Too high an earth resistance is protection only on paper: the fuse or RCD may not trip in time.",
      fizyka: "R = ρ / (2πL) · (ln(4L/d) − 1). A longer rod lowers resistance more effectively than a thicker one.",
    },
    pola: {
      rezystywnosc: {
        nazwa: "Soil resistivity ρ [Ω·m]",
        cel: "How well the soil conducts. The higher it is, the more rods are needed.",
        gdzie: "From a measurement (Wenner method) or an indicative value for the soil type (e.g. clay about 100 Ω·m).",
        zakres: "A measurement or an indicative value — dry sandy soil is much higher than clay.",
      },
      dlugosc: {
        nazwa: "Length of a single earth rod [m]",
        cel: "A longer rod reaches deeper, wetter layers and has lower resistance.",
        gdzie: "From the offer or the earthing design.",
        zakres: Z_KARTY_EN,
      },
      srednica: {
        nazwa: "Earth rod diameter [mm]",
        cel: "It has little effect on the result (under the logarithm), but it is part of the formula.",
        gdzie: "From the rod datasheet.",
        zakres: Z_KARTY_EN,
      },
      cel: {
        nazwa: "Earthing purpose",
        cel: "The required resistance threshold depends on the purpose: lightning protection, shock protection or sensitive electronics.",
        gdzie: "Choose what the electrode is for.",
        zakres: "Thresholds are given with each option on the list.",
      },
    },
  },
  "glowna-szyna-wyrownawcza": {
    migawka: {
      oCoChodzi:
        "If you touch two metal objects at different potentials, current flows through you — the main earthing bar equalises the potentials so nothing “bites”.",
      jakDziala:
        "A list of five mandatory connections to the bar (panel structure, inverter, battery, water pipes, earth electrode) with the minimum cross-sections from the source. A separate red stop: the bar used to feed loads — a conceptual error.",
      poCo: "Without equipotential bonding an insulation fault in one device can make a tap or the panel frame live.",
    },
    pola: {},
  },
  "uziemienie-funkcjonalne-ochronne": {
    migawka: {
      oCoChodzi:
        "Protective earthing is an airbag for you. Functional earthing is a stabiliser for electronics. Both are needed, but not always together.",
      jakDziala:
        "You choose the network system and answer whether a DC pole is earthed. Earthing a DC pole against the manufacturer's requirements (e.g. an inverter in an IT system) is a red stop — it can damage the MPPT.",
      poCo: "Confusing functional with protective earthing is a common mistake: either the protection doesn't work or the electronics get destroyed.",
    },
    pola: {
      uklad: {
        nazwa: "Network system",
        cel: "TN-S, TN-C-S, TT or IT — it determines how the protective and neutral conductors are connected. Informative here.",
        gdzie: "From the installation design or an electrician; off-grid it is often TN-S created in the inverter, or IT.",
        zakres: "TN-S, TN-C-S, TT or IT.",
      },
    },
  },
  "analiza-zwarciowa": {
    migawka: {
      oCoChodzi: "A short circuit is like an explosion — you need to know how much current will flow before the fuse manages to break the circuit.",
      jakDziala:
        "The app calculates the short-circuit current of the battery (voltage ÷ internal resistance) and of the panels (Isc × number of parallel strings) and takes the larger. If you enter the protective device's AIC, it checks whether it will interrupt it.",
      poCo:
        "A 48 V lithium battery with 10 mΩ resistance gives several thousand amps in a short circuit. Every fuse and breaker in that circuit must interrupt such a current — the reference point for the module's other screens.",
      fizyka: "I_sc,bat = U / R_int; I_sc,PV = Isc × N_strings. Panels give a current only slightly above rated — the battery is more dangerous.",
    },
    pola: {
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "The battery short-circuit current is calculated from voltage and internal resistance.",
        gdzie: "The pack's nominal voltage.",
        zakres: "Typically 12, 24 or 48 V.",
      },
      rezystancja: {
        nazwa: "Pack internal resistance [Ω]",
        cel: "The smaller it is, the larger the short-circuit current.",
        gdzie: "From a measurement or the cell datasheet (sum for a series connection).",
        zakres: Z_KARTY_EN,
      },
      isc: {
        nazwa: "Panel short-circuit current Isc [A]",
        cel: "The short-circuit current of one PV string.",
        gdzie: "From the panel datasheet (Isc).",
        zakres: Z_KARTY_EN,
      },
      stringi: {
        nazwa: "Number of PV strings in parallel [pcs]",
        cel: "The currents of parallel strings add up.",
        gdzie: "From the installation design.",
        zakres: TWOJA_INSTALACJA_EN,
      },
      aic: {
        nazwa: "AIC of the protective device checked [A] (optional)",
        cel: "The app checks whether the device will interrupt the calculated short-circuit current.",
        gdzie: "From the fuse or breaker datasheet (breaking capacity).",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "selektywnosc-zabezpieczen": {
    migawka: {
      oCoChodzi:
        "When one pipe bursts, you don't close the main valve of the whole house. Same with electricity — only the fuse closest to the fault should trip.",
      jakDziala:
        "This is a guide, not a calculator: a real selectivity assessment needs the manufacturer's time-current curves of the specific devices. The screen shows the rules and an example of how to compare them.",
      poCo: "Without selectivity one fault in a socket can switch off the whole house — fridge and heating included.",
    },
    pola: {},
  },
  "wylaczniki-nadpradowe-dc": {
    migawka: {
      oCoChodzi: "Direct current burns like a welder. The breaker must be able to extinguish this arc, otherwise it becomes a fire source itself.",
      jakDziala:
        "The app checks whether the breaker is designed for DC and for the circuit voltage (an AC breaker in a DC circuit is a red stop), the number of poles and — optionally — whether its breaking capacity (AIC) exceeds the short-circuit current.",
      poCo: "Alternating current passes through zero 100 times a second and the arc goes out; direct current doesn't — an AC breaker may fail to interrupt it.",
    },
    pola: {
      prad: {
        nazwa: "Circuit current [A]",
        cel: "The operating current — for selecting the breaker's rated current.",
        gdzie: "From the load data or power ÷ voltage.",
        zakres: Z_KARTY_EN,
      },
      napiecie: {
        nazwa: "Circuit DC voltage [V]",
        cel: "The breaker must be rated for this DC voltage — at higher voltage the arc is harder to extinguish.",
        gdzie: "The battery voltage or the string Voc,max.",
        zakres: "From the breaker datasheet (rated DC voltage).",
      },
      bieguny: {
        nazwa: "Number of poles",
        cel: "At higher DC voltages the manufacturer often requires several poles connected in series.",
        gdzie: "From the breaker datasheet and the manufacturer's wiring diagram.",
        zakres: Z_KARTY_EN,
      },
      aic: {
        nazwa: "Breaking capacity (AIC) [A] (optional)",
        cel: "Compared with the short-circuit current at this point.",
        gdzie: "From the breaker datasheet.",
        zakres: Z_KARTY_EN,
      },
      pradZwarcia: {
        nazwa: "Short-circuit current at this point [A] (optional)",
        cel: "The largest current the breaker may have to interrupt.",
        gdzie: "From the “Short-circuit analysis” screen.",
        zakres: "The short-circuit analysis result.",
      },
    },
  },
  "ochrona-odwrotna-polaryzacja": {
    migawka: {
      oCoChodzi: "Plus with minus is like fire with petrol. Protection is a lock that prevents a mistake when connecting.",
      jakDziala:
        "The app compares a blocking diode (simple, but loses a little energy) with a switch with a mechanical interlock. No protection at all is a red stop.",
      poCo: "Connecting a battery to an inverter the wrong way round can destroy its input in a split second — and it is not covered by warranty.",
    },
    pola: {
      miejsce: {
        nazwa: "Circuit location",
        cel: "Where the protection is: at the battery, the PV string or the inverter. Informative here.",
        gdzie: "Your installation.",
        zakres: "Battery, panels / PV string or inverter.",
      },
      ochrona: {
        nazwa: "Protection used",
        cel: "A blocking diode, a switch with a mechanical interlock or none. None — red stop.",
        gdzie: "From the installation design or an inspection.",
        zakres: "Options on the list.",
      },
    },
  },
  "wylaczniki-rcd": {
    migawka: {
      oCoChodzi:
        "An RCD (residual current device) senses that current is escaping where it shouldn't — e.g. through your body — and switches off in a fraction of a second.",
      jakDziala:
        "The app checks three independent rules: with a hybrid inverter Type B is needed, with motors at least Type A, and the residual current — {progOsob} mA for personal protection or {progPozar} mA for fire protection.",
      poCo: "An ordinary Type AC RCD can be “blinded” by DC current from the inverter — and won't trip when it is needed.",
    },
    pola: {
      typ: {
        nazwa: "Installed RCD type",
        cel: "AC detects only alternating current, A also pulsating, B also smooth direct current.",
        gdzie: "From the print on the device (type symbol) or the datasheet.",
        zakres: "AC, A or B.",
      },
      cel: {
        nazwa: "Protection purpose of the circuit",
        cel: "Personal protection requires a sensitive RCD ({progOsob} mA), fire protection allows {progPozar} mA.",
        gdzie: "Sockets and circuits people touch — personal protection; the main switch — often fire protection.",
        zakres: "{progOsob} mA or {progPozar} mA.",
      },
      prad: {
        nazwa: "Residual current of the installed RCD [mA]",
        cel: "Compared with the required threshold for the protection purpose.",
        gdzie: "From the print on the device (IΔn).",
        zakres: "{progOsob} mA for people, {progPozar} mA for fire protection.",
      },
    },
  },
  "ochrona-przed-dotykiem": {
    migawka: {
      oCoChodzi:
        "Electricity doesn't forgive. If you touch an uncovered plus, you won't have time to react. Covers and fast disconnection are your safety.",
      jakDziala:
        "A checklist of two mechanisms: basic protection (covers, insulation, enclosures) and fault protection (automatic disconnection, equipotential bonding).",
      poCo: "With 48 V batteries and PV strings of several hundred volts DC an uncovered terminal is a real threat to life.",
    },
    pola: {},
  },
  "monitorowanie-izolacji-imd": {
    migawka: {
      oCoChodzi:
        "In an IT system there is no direct earth connection, so the first earth fault won't trip a fuse. An insulation monitoring device (IMD) catches the problem before it becomes dangerous.",
      jakDziala:
        "For an IT system the app requires an IMD (none — red stop) and checks the alarm threshold you enter. The source gives an example of {progPrzyklad} kΩ, but the real threshold depends on the system voltage and the manufacturer.",
      poCo: "The first earth fault in IT is “silent”; the second makes a short circuit. The IMD gives time to repair between them.",
    },
    pola: {
      prog: {
        nazwa: "IMD alarm threshold [kΩ]",
        cel: "The insulation resistance below which the IMD raises an alarm.",
        gdzie: "From the recommendations of the IMD manufacturer and the installation.",
        zakres: "Example from the source: {progPrzyklad} kΩ — not a universal value.",
      },
    },
  },
  "trasy-kablowe": {
    migawka: {
      oCoChodzi:
        "Cables are roads. You don't want through traffic (power) to block a quiet street (internet) — they must be routed separately.",
      jakDziala: "A guide with routing rules: separating power and signal cables, protection, bends, markings.",
      poCo: "A well-routed cable run means less interference, easier servicing and less risk of cable damage.",
    },
    pola: {},
  },
  "oznakowanie-obwodow": {
    migawka: {
      oCoChodzi: "In 5 years you will forget what is what. A label is your system's memory.",
      jakDziala:
        "A list of conductor marking codes per EN 60445 (+, −, PE, U, N). The app does not impose core colours — that standard is not in the repository.",
      poCo: "A service technician (or you in a few years) must know within 10 seconds which conductor is plus and which is protective.",
    },
    pola: {},
  },
  "normy-i-certyfikaty": {
    migawka: {
      oCoChodzi: "A certificate is proof that something won't explode in normal use. Without it you are a beta tester.",
      jakDziala:
        "A checklist of standards for key components: IEC 61730 (panels), IEC 62109 (inverter), IEC 62619 (lithium batteries) and a collective item for the rest.",
      poCo: "Cheap uncertified equipment is a common cause of fires — and a problem for insurance and installation acceptance.",
    },
    pola: {},
  },
  "string-box": {
    migawka: {
      oCoChodzi:
        "A string box is a node where cables from the panels meet in an orderly way — without it you have a tangle and a fire risk.",
      jakDziala:
        "The app checks whether the box has enough DC inputs for your strings, whether the string fuse is within the recommended range ({bezpMin}–{bezpMax} A) and whether, when combining outdoors, the box is IP66 (none — red stop).",
      poCo: "With several parallel strings a damaged string can take the current of the others — string fuses prevent this.",
    },
    pola: {
      stringi: {
        nazwa: "Number of strings",
        cel: "How many panel strings go into the box.",
        gdzie: "From the installation design.",
        zakres: TWOJA_INSTALACJA_EN,
      },
      wejscia: {
        nazwa: "Number of DC inputs of the box",
        cel: "There must be at least as many as strings.",
        gdzie: "From the box datasheet.",
        zakres: Z_KARTY_EN,
      },
      bezpiecznik: {
        nazwa: "String fuse [A]",
        cel: "Protects the string against reverse current from the other strings.",
        gdzie: "From the design or the panel datasheet (maximum series fuse).",
        zakres: "Recommended range: {bezpMin}–{bezpMax} A per string.",
      },
    },
  },
  "separacja-emc": {
    migawka: {
      oCoChodzi: "Current in a cable creates a magnetic field. That field can “drown out” a network cable. They must be separated.",
      jakDziala:
        "A guide: a minimum distance of 10–20 cm between power and signal cables, crossing at right angles, shielded twisted pair (FTP) near the inverter.",
      poCo: "An inverter is a source of strong interference — a badly routed network or sensor cable will start losing data.",
    },
    pola: {},
  },
  "peszle-koryta-rurki": {
    migawka: {
      oCoChodzi: "A conduit is clothing for a cable. It must suit the weather and place, otherwise the cable wears out early.",
      jakDziala: "You choose the installation location — the app gives the right protection from the source: corrugated conduit, UV-resistant conduit, HDPE pipe or metal tray.",
      poCo: "Ordinary conduit in the sun crumbles after a few years; in the ground without a pipe a cable is exposed to mechanical damage.",
    },
    pola: {
      miejsce: {
        nazwa: "Installation location",
        cel: "The location determines which protection will withstand the conditions (UV, moisture, pressure, temperature).",
        gdzie: "Where this section of the route runs.",
        zakres: "Options on the list.",
      },
    },
  },
  "ochrona-przed-gryzoniami": {
    migawka: {
      oCoChodzi: "A mouse doesn't care whether a cable is pretty. It just bites through it and makes a short circuit.",
      jakDziala: "You choose the rodent risk level. With high risk the app points to a spiral metal conduit; with low risk a plastic one is enough.",
      poCo: "A bitten-through DC cable in a barn or attic is a short-circuit and fire risk — often in a place nobody inspects.",
    },
    pola: {
      ryzyko: {
        nazwa: "Rodent risk in the area",
        cel: "The required cable protection depends on the risk.",
        gdzie: "Your assessment: farm, barn, forest, attic — usually high.",
        zakres: "Options on the list.",
      },
    },
  },
  "optymalizacja-trasy-kabla": {
    migawka: {
      oCoChodzi: "Don't look only at the cable price — a thicker, shorter cable often pays back through lower losses over the years.",
      jakDziala:
        "For two route variants the app calculates the annual energy loss with the same engine as cable sizing (Module 5, Screen 1) and the total cost: purchase + loss × years × price per kWh.",
      poCo: "To compare the variants fairly — the cable that is cheaper at the start may be more expensive after 10 years.",
      fizyka: "TCO = purchase cost + annual loss [kWh] × years × price per kWh.",
    },
    pola: {
      prad: {
        nazwa: "Circuit current [A]",
        cel: "Common to both route variants — the losses depend on it.",
        gdzie: "From the load data or power ÷ voltage.",
        zakres: Z_KARTY_EN,
      },
      napiecie: {
        nazwa: "System voltage [V]",
        cel: "For converting the voltage drop.",
        gdzie: "The circuit voltage.",
        zakres: "Typically 12/24/48 V DC or 230 V AC.",
      },
      material: {
        nazwa: "Conductor material",
        cel: "Copper or aluminium — different resistivity.",
        gdzie: "From the cable description.",
        zakres: "Cu or Al.",
      },
      ulozenie: {
        nazwa: "Installation method",
        cel: "Affects the cable's current-carrying capacity (standard table).",
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
        zakres: TWOJA_INSTALACJA_EN,
      },
      spadek: {
        nazwa: "Allowed voltage drop [%]",
        cel: "A condition both variants must meet.",
        gdzie: "The default or the manufacturer's requirement.",
        zakres: "Default {spadekAc}% AC / {spadekDc}% DC.",
      },
      cenaEnergii: {
        nazwa: "Electricity price [PLN/kWh]",
        cel: "Values the energy lost in the cable.",
        gdzie: "From the bill (cost of 1 kWh) or the cost of energy from the installation.",
        zakres: "Your price.",
      },
      horyzont: {
        nazwa: "Comparison horizon [years]",
        cel: "For how many years the losses are summed.",
        gdzie: "As long as the installation is meant to run.",
        zakres: "Your choice.",
      },
      dlugosc: {
        nazwa: "Route length [m]",
        cel: "The cable length in this variant.",
        gdzie: "Measure along the planned route.",
        zakres: TWOJA_INSTALACJA_EN,
      },
      przekroj: {
        nazwa: "Considered cross-section [mm²]",
        cel: "The cable cross-section in this variant.",
        gdzie: "From the offer or design.",
        zakres: "Standard sizes.",
      },
      koszt: {
        nazwa: "Purchase cost of the variant [PLN]",
        cel: "Cable, protection and labour for this variant.",
        gdzie: "From the offer.",
        zakres: "Your price.",
      },
    },
  },
  "puszki-polaczeniowe": {
    migawka: {
      oCoChodzi: "Every connection is a potential leak. It must be closed in a sealed box so water can't make a short circuit.",
      jakDziala: "You choose the installation location — the app gives the box type from the source: IP66 with glands, resin-filled or IP20 for dry interiors.",
      poCo: "Moisture in an outdoor box causes corrosion and leakage — often noticed only when the RCD or IMD trips.",
    },
    pola: {
      miejsce: {
        nazwa: "Box installation location",
        cel: "The required tightness depends on the location.",
        gdzie: "Where the connection is.",
        zakres: "Options on the list.",
      },
    },
  },
  "dobor-izolacji-kabla": {
    migawka: {
      oCoChodzi: "Insulation is the cable's skin — it must suit the temperature and place, otherwise it cracks and lets moisture in.",
      jakDziala: "The app compares the highest expected temperature with the insulation's allowed one: PVC up to 70 °C, XLPE up to 90 °C. The route location is only a hint.",
      poCo: "A PVC cable on a hot roof or near an inverter ages quickly — the insulation hardens and cracks.",
    },
    pola: {
      miejsce: {
        nazwa: "Route location (informative)",
        cel: "Hints at which temperatures to expect. It does not affect the result.",
        gdzie: "Where the cable runs.",
        zakres: "Options on the list.",
      },
      izolacja: {
        nazwa: "Considered cable insulation",
        cel: "PVC (e.g. YKY/YAKY) withstands up to 70 °C, XLPE up to 90 °C.",
        gdzie: "From the cable marking or datasheet.",
        zakres: "PVC or XLPE.",
      },
      temperatura: {
        nazwa: "Maximum expected temperature [°C]",
        cel: "Compared with the insulation's allowed temperature.",
        gdzie: "The hottest place on the route in summer (roof, attic, near the inverter).",
        zakres: "PVC up to 70 °C, XLPE up to 90 °C.",
      },
    },
  },
  "pomiary-powykonawcze": {
    migawka: {
      oCoChodzi:
        "The last step before handing over the installation — six tests, each with a hard threshold. Any result outside the threshold means no formal acceptance.",
      jakDziala:
        "You enter the measurement results: insulation resistance (above {minIzolacja} MΩ), earth resistance (threshold depending on the purpose), RCD trip time (below {maxRcd} s) and confirm three check tests. Any missing value or result outside the threshold is a red stop.",
      poCo: "Measurements are the only proof that the installation is safe — and a document needed for acceptance and insurance.",
    },
    pola: {
      izolacja: {
        nazwa: "Insulation resistance [MΩ]",
        cel: "How well the insulation separates the conductors from each other and from earth.",
        gdzie: "From a measurement with an insulation tester — the electrician's report.",
        zakres: "Required above {minIzolacja} MΩ.",
      },
      celUziemienia: {
        nazwa: "Earthing purpose",
        cel: "The earth resistance threshold depends on the purpose.",
        gdzie: "What the measured electrode is for.",
        zakres: "Thresholds are given with the list options.",
      },
      uziemienie: {
        nazwa: "Earth resistance [Ω]",
        cel: "Compared with the threshold for the earthing purpose.",
        gdzie: "From a measurement with an earth tester — the electrician's report.",
        zakres: "Threshold depending on the purpose (given with the options).",
      },
      rcd: {
        nazwa: "RCD trip time [s]",
        cel: "How quickly the RCD cuts off the supply on leakage.",
        gdzie: "From a measurement with an RCD tester — the electrician's report.",
        zakres: "Required below {maxRcd} s.",
      },
    },
  },
}

const Z_KARTY_RU = "диапазон из технической документации устройства — приложение не подставляет типовое значение за вас."
const TWOJA_INSTALACJA_RU = "Ваша установка — измерьте или проверьте в проекте, не угадывайте."

export const ru: Tlumaczenie<typeof pl> = {
  "dobor-przekroju-kabla": {
    migawka: {
      oCoChodzi:
        "Ток в длинном кабеле теряет энергию, как вода в длинном шланге: чем длиннее путь и тоньше труба, тем меньше давления (напряжения) остаётся на конце. А слишком тонкий кабель ещё и греется.",
      jakDziala:
        "Приложение проверяет два условия по HD 60364-5-52. Допустимый ток: ток из таблицы стандарта для способа прокладки, скорректированный на температуру среды и число кабелей в пучке, должен превышать ток цепи. Падение напряжения: на трассе туда и обратно оно не должно превышать допустимый процент. Выбирается наименьшее сечение, удовлетворяющее обоим, — или проверяется введённое вами.",
      poCo:
        "Слишком тонкий кабель — риск пожара (перегрев изоляции) и потери энергии годами. Слишком толстый — лишние расходы. Запас меньше {margines}% приложение отмечает как недостаточный.",
      fizyka:
        "Сопротивление проводника R = ρ · 2L / S (медь ρ ≈ {rhoCu} Ом·мм²/м, алюминий ≈ {rhoAl}). Падение напряжения ΔU = I · R. Тепло в кабеле растёт с квадратом тока, а теплоотдача зависит от окружения — отсюда коэффициенты k₁ (температура) и k₂ (группировка).",
    },
    pola: {
      prad: {
        nazwa: "Рабочий ток цепи I [А]",
        cel: "Ток в цепи при нормальной работе. От него зависят допустимый ток и падение напряжения.",
        gdzie: "Из данных панели, инвертора или потребителя, или посчитайте: мощность [Вт] ÷ напряжение [В].",
        zakres: Z_KARTY_RU,
      },
      napiecie: {
        nazwa: "Системное напряжение U [В]",
        cel: "Напряжение цепи — нужно для пересчёта падения напряжения в проценты. При низком напряжении то же падение в вольтах — гораздо больший процент.",
        gdzie: "Напряжение DC (12/24/48 В) или AC (230 В) этой цепи.",
        zakres: "Обычно 12, 24, 48 В DC или 230 В AC.",
      },
      dlugosc: {
        nazwa: "Длина трассы L (в одну сторону) [м]",
        cel: "Приложение само считает путь туда и обратно (2L). Чем длиннее, тем больше падение напряжения.",
        gdzie: "Реальная длина кабеля от источника до потребителя по трассе (с поворотами и подъёмами), а не по прямой.",
        zakres: TWOJA_INSTALACJA_RU,
      },
      material: {
        nazwa: "Материал проводника",
        cel: "Медь проводит лучше алюминия — алюминию нужно большее сечение при том же токе.",
        gdzie: "Из описания кабеля или по цвету жилы (медь — красноватая, алюминий — серебристый).",
        zakres: "Медь (Cu) или алюминий (Al).",
      },
      ulozenie: {
        nazwa: "Способ прокладки",
        cel: "Чем хуже охлаждение кабеля (в трубе, в земле, в пучке), тем меньший ток он может безопасно нести — в стандарте для каждого способа своя таблица.",
        gdzie: "Выберите, как кабель лежит на самом неблагоприятном участке трассы.",
        zakres: "Свободно, в гофре/трубе, в земле или в пучке.",
      },
      wiazka: {
        nazwa: "Число кабелей в пучке [шт.]",
        cel: "Кабели, лежащие вместе, нагревают друг друга — чем их больше, тем меньше коэффициент k₂ и тем больше нужное сечение.",
        gdzie: "Посчитайте нагруженные проводники, идущие вместе в одном пучке или лотке.",
        zakres: TWOJA_INSTALACJA_RU,
      },
      temperatura: {
        nazwa: "Температура окружающей среды [°C]",
        cel: "Максимальная температура вокруг кабеля — снижает допустимый ток (коэффициент k₁).",
        gdzie: "Наибольшая ожидаемая температура на трассе (например, чердак летом), а не среднегодовая.",
        zakres: "Ваши условия.",
      },
      spadek: {
        nazwa: "Допустимое падение напряжения [%]",
        cel: "Сколько процентов напряжения может «потеряться» в кабеле. Меньшее падение требует более толстого провода.",
        gdzie: "Примите значение по умолчанию или требование производителя потребителя.",
        zakres: "По умолчанию {spadekAc}% AC / {spadekDc}% DC.",
      },
      sprawdzany: {
        nazwa: "Сечение для проверки [мм²]",
        cel: "Вместо подбора приложение проверяет сечение, которое у вас есть или планируется.",
        gdzie: "С изоляции кабеля (например, «6 mm²») или из проекта.",
        zakres: "Стандартные сечения.",
      },
    },
  },
  "ochrona-przepieciowa-spd": {
    migawka: {
      oCoChodzi:
        "Молнии не обязательно попадать в панель — достаточно удара поблизости, и в кабелях наводится напряжение, которое разрушает электронику.",
      jakDziala:
        "Приложение подбирает тип УЗИП (Тип 1 при наличии молниезащиты, Тип 2 без неё), проверяет запас по напряжению Uc ≥ Voc,max × {marginesUc}, расстояние панелей от молниеприёмника (минимум {minOdleglosc} м) и заземление УЗИП через главную шину уравнивания. В отдельном разделе считает индекс риска CRL по HD 60364-4-443 — обязателен ли УЗИП вообще.",
      poCo:
        "УЗИП со слишком низким Uc начнёт проводить при обычном зимнем напряжении стринга и сгорит; без УЗИП один близкий удар может уничтожить инвертор и контроллер.",
      fizyka:
        "Voc стринга растёт на морозе, поэтому запас считается от зимнего Voc,max (Модуль 3, стресс-тест MPPT), а не от напряжения STC.",
    },
    pola: {
      voc: {
        nazwa: "Рабочее напряжение стринга PV — зимнее Voc,max [В]",
        cel: "Наибольшее напряжение на стринге (морозное солнечное утро). УЗИП должен выдерживать его с запасом.",
        gdzie: "С экрана «Зимний стресс-тест MPPT» (Модуль 3) — не из условий STC.",
        zakres: "Результат Модуля 3 для вашего стринга.",
      },
      odleglosc: {
        nazwa: "Расстояние панелей от молниеприёмника [м]",
        cel: "Слишком малое расстояние грозит перекрытием искры с молниезащиты на панели.",
        gdzie: "Измерьте наименьший зазор между конструкцией панелей и проводником молниеприёмника.",
        zakres: "Минимум {minOdleglosc} м.",
      },
      uc: {
        nazwa: "Длительное рабочее напряжение Uc УЗИП [В]",
        cel: "Наибольшее напряжение, при котором УЗИП ещё не проводит. Должно быть не меньше Voc,max × {marginesUc}.",
        gdzie: "Из документации УЗИП (Ucpv или Uc).",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "spd-crl": {
    pola: {
      napowietrznaNn: {
        nazwa: "Длина воздушной линии низкого напряжения [км]",
        cel: "Линии, питающие здание, собирают перенапряжения от гроз. Воздушная линия НН считается вдвойне (2·L_PAL).",
        gdzie: "От здания до ближайшей трансформаторной подстанции — по карте или у оператора.",
        zakres: "Учитывается максимум {lpMax} км (или до первого УЗИП в сети). Полностью автономный дом без линии: оставьте пустым.",
      },
      kablowaNn: {
        nazwa: "Длина кабельной линии низкого напряжения [км]",
        cel: "Кабель в земле собирает меньше перенапряжений, чем воздушная линия, — считается один раз (L_PCL).",
        gdzie: "От здания до подстанции — по карте или у оператора.",
        zakres: "Учитывается максимум {lpMax} км. Без линии: оставьте пустым.",
      },
      napowietrznaSn: {
        nazwa: "Длина воздушной линии среднего напряжения [км]",
        cel: "Участок СН за подстанцией — считается с весом 0,4 (L_PAH).",
        gdzie: "У оператора сети или по карте.",
        zakres: "Всего учитывается максимум {lpMax} км. Без линии: оставьте пустым.",
      },
      kablowaSn: {
        nazwa: "Длина кабельной линии среднего напряжения [км]",
        cel: "Кабельный участок СН — считается с весом 0,2 (L_PCH).",
        gdzie: "У оператора сети или по карте.",
        zakres: "Всего учитывается максимум {lpMax} км. Без линии: оставьте пустым.",
      },
      otoczenie: {
        nazwa: "Окружение здания",
        cel: "В городе соседние здания частично экранируют линии — это меняет коэффициент среды в формуле.",
        gdzie: "Сельская/пригородная местность (мало зданий) или город.",
        zakres: "Сельская или городская.",
      },
      ng: {
        nazwa: "Плотность ударов молнии в землю Ng [1/(км²·год)]",
        cel: "Сколько ударов в год приходится на км² в вашей местности. Чем больше, тем меньше CRL и тем нужнее УЗИП.",
        gdzie: "С карты грозовой активности для вашей местности — в приложении её нет.",
        zakres: "Значение с карты грозовой активности.",
      },
      td: {
        nazwa: "Число грозовых дней в году Td [дней]",
        cel: "Замещающий источник, если Ng неизвестна: Ng = {ngNaDzien} · Td.",
        gdzie: "Из метеоданных для региона.",
        zakres: "Используется только при пустом поле Ng.",
      },
      odlegloscSpd: {
        nazwa: "Расстояние до первого УЗИП в сети [км] (необязательно)",
        cel: "Перенапряжения с дальней части линии остановит УЗИП в сети — учитывается только участок до него.",
        gdzie: "У оператора сети.",
        zakres: "Максимум {lpMax} км или до этого УЗИП.",
      },
      kolejnosc: {
        nazwa: "Порядок участков сети от здания",
        cel: "Учитываются только {lpMax} км сети, ближайшие к зданию (D54). Порядок показывает, какие участки находятся у дома.",
        gdzie: "Обычно у дома сеть НН, а за трансформаторной подстанцией — СН. Порядок кабеля и воздушной линии — по карте или у оператора сети.",
        zakres: "Не знаю = осторожно: сначала воздушная линия НН (наибольший вес, УЗИП получается чаще). Важно только для сети длиннее {lpMax} км.",
      },
    },
  },
  "szyny-zbiorcze-polaczenia": {
    migawka: {
      oCoChodzi:
        "Болт — это пружина. Затянут слабо — искрит и греется. Слишком сильно — срывается резьба или сминается наконечник. Нужно попасть в правильный момент, для алюминия другой, чем для меди.",
      jakDziala:
        "Контрольный список моментов затяжки из источника: клеммы батареи, главная шина, заземлитель — и обязательная повторная проверка через 24 часа, потому что соединения «садятся».",
      poCo:
        "Ослабленное соединение при большом постоянном токе — одна из самых частых причин пожаров аккумуляторных установок. Динамометрический ключ стоит меньше одной сгоревшей клеммы.",
      fizyka: "Переходное сопротивление растёт при ослаблении прижима — теряемая мощность P = I²R превращается в тепло именно в месте соединения.",
    },
    pola: {},
  },
  "laczenie-cu-al": {
    migawka: {
      oCoChodzi:
        "Медь и алюминий во влажной среде не терпят прямого контакта — их нужно разделить барьером, иначе они корродируют в месте соприкосновения.",
      jakDziala:
        "Вы выбираете два материала и среду. Приложение даёт способ соединения только для пар, описанных в источнике (например, биметаллические наконечники, паста, шайбы); другие комбинации не угадывает. При желании пересчитывает сечение меди на алюминий: S_Al = S_Cu × {wspAl}.",
      poCo: "Гальваническая коррозия повышает сопротивление соединения — оно греется и через годы может прогореть.",
      fizyka:
        "Два металла с разным электрохимическим потенциалом в присутствии электролита (влаги) образуют гальваническую пару — менее благородный металл (алюминий) растворяется.",
    },
    pola: {
      material1: {
        nazwa: "Материал проводника 1",
        cel: "Первый из соединяемых металлов.",
        gdzie: "Из описания кабеля, наконечника или шины.",
        zakres: "Варианты из списка.",
      },
      material2: {
        nazwa: "Материал проводника 2",
        cel: "Второй из соединяемых металлов.",
        gdzie: "Из описания кабеля, наконечника или шины.",
        zakres: "Варианты из списка.",
      },
      srodowisko: {
        nazwa: "Среда соединения",
        cel: "Во влажной среде гальваническая коррозия идёт быстро, в сухом помещении — медленно.",
        gdzie: "Где находится соединение: внутри, снаружи, во влажном помещении.",
        zakres: "Варианты из списка.",
      },
      przekrojCu: {
        nazwa: "Сечение меди для пересчёта [мм²] (необязательно)",
        cel: "Алюминию нужно большее сечение, чем меди, при том же токе — приложение пересчитает.",
        gdzie: "Сечение медного кабеля, который вы хотите заменить алюминиевым.",
        zakres: "Коэффициент около {wspAl}× (S_Al = S_Cu × {wspAl}).",
      },
    },
  },
  "zlacza-mc4": {
    migawka: {
      oCoChodzi:
        "MC4 выглядит универсальным, но контакты разных производителей не всегда идеально совместимы — неплотный контакт под током даёт электрическую дугу, а это уже реальный пожар.",
      jakDziala: "Вы выбираете производителя/серию гнездового и штыревого разъёма. Разные серии в одном соединении — красный стоп.",
      poCo: "Дуга в разъёме на крыше при напряжении стринга в несколько сотен вольт DC сама не гаснет — типичная причина пожаров PV.",
    },
    pola: {
      zenska: {
        nazwa: "Гнездовой разъём — производитель / серия",
        cel: "Сравнивается со штыревым — они должны быть одной серии.",
        gdzie: "По маркировке на разъёме или упаковке.",
        zakres: "Варианты из списка.",
      },
      meska: {
        nazwa: "Штыревой разъём — производитель / серия",
        cel: "Сравнивается с гнездовым — они должны быть одной серии.",
        gdzie: "По маркировке на разъёме или упаковке.",
        zakres: "Варианты из списка.",
      },
    },
  },
  "dobor-bezpiecznika-rozlacznika": {
    migawka: {
      oCoChodzi:
        "Предохранитель — это вставка, которая должна перегореть раньше, чем сгорит кабель, — и она должна уметь разорвать ток короткого замыкания.",
      jakDziala:
        "Приложение подбирает ток предохранителя как 1,25 × ток цепи и проверяет отключающую способность (AIC): она должна быть больше тока КЗ в этой точке. AIC ниже тока КЗ — красный стоп.",
      poCo: "Предохранитель со слишком малой AIC при КЗ литиевой батареи может взорваться вместо того, чтобы разорвать цепь.",
    },
    pola: {
      prad: {
        nazwa: "Номинальный ток цепи [А]",
        cel: "Рабочий ток цепи — предохранитель подбирается с запасом 25%.",
        gdzie: "Из данных потребителя/инвертора или мощность ÷ напряжение.",
        zakres: Z_KARTY_RU,
      },
      pradZwarcia: {
        nazwa: "Ток короткого замыкания в этой точке [А]",
        cel: "Наибольший ток, который потечёт при КЗ. Предохранитель должен его разорвать.",
        gdzie: "С экрана «Анализ коротких замыканий» (Модуль 5, Экран 12) или из документации батареи.",
        zakres: "Результат анализа КЗ.",
      },
      aic: {
        nazwa: "Отключающая способность (AIC) предохранителя [А]",
        cel: "Наибольший ток, который предохранитель может безопасно разорвать.",
        gdzie: "Из документации предохранителя (breaking capacity).",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "dobor-mocy-falownika": {
    migawka: {
      oCoChodzi:
        "Инвертор должен выдерживать не только нормальную работу, но и долю секунды, когда трогается двигатель холодильника или насоса, — тогда он потребляет в 5–7 раз больше тока.",
      jakDziala:
        "Приложение делит пиковую мощность потребителей на коэффициент одновременности (по умолчанию {wspJednoczesnosci}) — здесь он работает как запас на пуски, а не как уменьшение суммы. Проверяет также полную мощность (ВА) и, если вы её введёте, хватит ли рассматриваемого инвертора.",
      poCo: "Слишком маленький инвертор отключается при каждом пуске компрессора; слишком большой имеет больший собственный расход, который ночью съедает батарею.",
    },
    pola: {
      mocSzczytowa: {
        nazwa: "Пиковая мощность потребителей [Вт]",
        cel: "Наибольшая мощность, которая может потребляться одновременно.",
        gdzie: "Из баланса нагрузок (Модуль 2) или сумма мощностей одновременно работающих устройств.",
        zakres: "Ваши потребители.",
      },
      mocPozorna: {
        nazwa: "Полная мощность потребителей [ВА] (необязательно)",
        cel: "У двигателей и блоков питания полная мощность больше активной — инвертор должен её выдержать.",
        gdzie: "С экрана «Полная мощность и cos φ» (Модуль 2) или с табличек (ВА).",
        zakres: "Результат Модуля 2.",
      },
      wspolczynnik: {
        nazwa: "Коэффициент одновременности",
        cel: "Запас на пуски двигателей. Меньшее значение = более мощный инвертор.",
        gdzie: "Примите значение источника по умолчанию или своё, если знаете профиль нагрузки.",
        zakres: "По умолчанию {wspJednoczesnosci}.",
      },
      mocFalownika: {
        nazwa: "Мощность рассматриваемого инвертора [Вт] (необязательно)",
        cel: "Приложение проверит, хватит ли конкретного инвертора.",
        gdzie: "Из документации инвертора (длительная мощность).",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "przepust-powietrza": {
    migawka: {
      oCoChodzi:
        "Панели нагреваются, как крыша автомобиля на солнце, — чем хуже поток воздуха под ними, тем они горячее и менее эффективны.",
      jakDziala:
        "Приложение оценивает вентиляционный зазор под панелями: меньше {progKrytyczny} см панель может нагреваться примерно до {tKrytyczna} °C и терять более десяти процентов мощности ({strata}%/°C выше {tStc} °C); от {progBezpieczny} см охлаждение хорошее. Промежуточный диапазон не угадывается — источник не даёт зависимости.",
      poCo: "Зазор — бесплатная мощность: несколько сантиметров больше при монтаже дают больше энергии на весь срок службы.",
      fizyka: "потери % = (T_панели − {tStc} °C) × {strata} %/°C. Мощность кремниевого элемента падает с ростом температуры.",
    },
    pola: {
      szczelina: {
        nazwa: "Планируемый вентиляционный зазор под панелями [см]",
        cel: "Промежуток между нижней стороной панелей и крышей — через него уходит тепло.",
        gdzie: "Из проекта конструкции или измерьте после монтажа.",
        zakres: "Меньше {progKrytyczny} см — критично; от {progBezpieczny} см — хорошо.",
      },
    },
  },
  "projekt-uziemienia": {
    migawka: {
      oCoChodzi:
        "Земля тоже проводник — если контакт с ней слишком слабый, ток КЗ не уйдёт эффективно и может вернуться к вам.",
      jakDziala:
        "По удельному сопротивлению грунта и размерам электрода приложение считает сопротивление одного электрода (формула Дуайта), а затем сколько электродов нужно, чтобы опуститься ниже порога для выбранной цели. Модель нескольких электродов упрощённая (без взаимного влияния) — приложение это отмечает.",
      poCo: "Слишком большое сопротивление заземления — защита только на бумаге: предохранитель или УЗО может не сработать вовремя.",
      fizyka: "R = ρ / (2πL) · (ln(4L/d) − 1). Более длинный электрод снижает сопротивление эффективнее, чем более толстый.",
    },
    pola: {
      rezystywnosc: {
        nazwa: "Удельное сопротивление грунта ρ [Ом·м]",
        cel: "Насколько хорошо грунт проводит ток. Чем выше, тем больше нужно электродов.",
        gdzie: "По измерению (метод Веннера) или ориентировочное значение для типа грунта (например, глина около 100 Ом·м).",
        zakres: "Измерение или ориентировочное значение — у сухого песчаного грунта намного выше, чем у глины.",
      },
      dlugosc: {
        nazwa: "Длина одного заземляющего электрода [м]",
        cel: "Более длинный электрод достигает более глубоких, влажных слоёв и имеет меньшее сопротивление.",
        gdzie: "Из предложения или проекта заземления.",
        zakres: Z_KARTY_RU,
      },
      srednica: {
        nazwa: "Диаметр заземляющего электрода [мм]",
        cel: "Мало влияет на результат (под логарифмом), но входит в формулу.",
        gdzie: "Из документации электрода.",
        zakres: Z_KARTY_RU,
      },
      cel: {
        nazwa: "Назначение заземления",
        cel: "От назначения зависит требуемый порог сопротивления: молниезащита, защита от поражения или чувствительная электроника.",
        gdzie: "Выберите, для чего служит заземлитель.",
        zakres: "Пороги указаны у каждого варианта списка.",
      },
    },
  },
  "glowna-szyna-wyrownawcza": {
    migawka: {
      oCoChodzi:
        "Если вы коснётесь двух металлических предметов с разным потенциалом, через вас потечёт ток — главная шина уравнивания выравнивает потенциалы, чтобы ничего не «било».",
      jakDziala:
        "Список пяти обязательных подключений к ГЗШ (конструкция панелей, инвертор, батарея, водопровод, заземлитель) с минимальными сечениями из источника. Отдельный красный стоп: ГЗШ используется для питания потребителей — концептуальная ошибка.",
      poCo: "Без уравнивания потенциалов пробой изоляции в одном устройстве может поставить под напряжение кран или раму панелей.",
    },
    pola: {},
  },
  "uziemienie-funkcjonalne-ochronne": {
    migawka: {
      oCoChodzi:
        "Защитное заземление — подушка безопасности для вас. Функциональное — стабилизатор для электроники. Нужны оба, но не всегда вместе.",
      jakDziala:
        "Вы выбираете систему сети и отвечаете, заземлён ли полюс DC. Заземление полюса DC вопреки требованиям производителя (например, инвертор в системе IT) — красный стоп: может повредить MPPT.",
      poCo: "Путаница функционального и защитного заземления — частая ошибка: либо защита не работает, либо портится электроника.",
    },
    pola: {
      uklad: {
        nazwa: "Система сети",
        cel: "TN-S, TN-C-S, TT или IT — определяет, как соединены защитный и нейтральный проводники. Здесь информационно.",
        gdzie: "Из проекта установки или у электрика; в off-grid часто TN-S, создаваемая в инверторе, или IT.",
        zakres: "TN-S, TN-C-S, TT или IT.",
      },
    },
  },
  "analiza-zwarciowa": {
    migawka: {
      oCoChodzi: "Короткое замыкание — как взрыв: нужно знать, сколько тока потечёт, прежде чем предохранитель успеет разорвать цепь.",
      jakDziala:
        "Приложение считает ток КЗ батареи (напряжение ÷ внутреннее сопротивление) и панелей (Isc × число параллельных стрингов) и берёт больший. Если вы введёте AIC защитного аппарата, проверит, разорвёт ли он этот ток.",
      poCo:
        "Литиевая батарея 48 В с сопротивлением 10 мОм даёт при КЗ несколько тысяч ампер. Каждый предохранитель и автомат в этой цепи должен разорвать такой ток — это отправная точка для других экранов модуля.",
      fizyka: "I_кз,бат = U / R_вн; I_кз,PV = Isc × N_стрингов. Панели дают ток лишь немного выше номинального — батарея опаснее.",
    },
    pola: {
      napiecie: {
        nazwa: "Напряжение батареи [В]",
        cel: "По напряжению и внутреннему сопротивлению считается ток КЗ батареи.",
        gdzie: "Номинальное напряжение пакета.",
        zakres: "Обычно 12, 24 или 48 В.",
      },
      rezystancja: {
        nazwa: "Внутреннее сопротивление пакета [Ом]",
        cel: "Чем оно меньше, тем больше ток КЗ.",
        gdzie: "По измерению или из документации элементов (сумма при последовательном соединении).",
        zakres: Z_KARTY_RU,
      },
      isc: {
        nazwa: "Ток КЗ панели Isc [А]",
        cel: "Ток короткого замыкания одного стринга PV.",
        gdzie: "Из документации панели (Isc).",
        zakres: Z_KARTY_RU,
      },
      stringi: {
        nazwa: "Число параллельных стрингов PV [шт.]",
        cel: "Токи параллельных стрингов складываются.",
        gdzie: "Из проекта установки.",
        zakres: TWOJA_INSTALACJA_RU,
      },
      aic: {
        nazwa: "AIC проверяемого аппарата защиты [А] (необязательно)",
        cel: "Приложение проверит, разорвёт ли аппарат рассчитанный ток КЗ.",
        gdzie: "Из документации предохранителя или автомата (отключающая способность).",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "selektywnosc-zabezpieczen": {
    migawka: {
      oCoChodzi:
        "Когда лопнула одна труба, вы не перекрываете главный кран всего дома. С электричеством так же — должен сработать только ближайший к аварии предохранитель.",
      jakDziala:
        "Это путеводитель, а не калькулятор: реальная оценка селективности требует время-токовых характеристик конкретных аппаратов от производителя. Экран показывает правила и пример их сравнения.",
      poCo: "Без селективности одна неисправность в розетке может обесточить весь дом — вместе с холодильником и отоплением.",
    },
    pola: {},
  },
  "wylaczniki-nadpradowe-dc": {
    migawka: {
      oCoChodzi: "Постоянный ток горит, как сварка. Автомат должен уметь погасить эту дугу, иначе он сам станет источником пожара.",
      jakDziala:
        "Приложение проверяет, предназначен ли автомат для DC и на напряжение цепи (автомат AC в цепи DC — красный стоп), число полюсов и — при желании — превышает ли его отключающая способность (AIC) ток КЗ.",
      poCo: "Переменный ток сам проходит через ноль 100 раз в секунду, и дуга гаснет; постоянный — нет: автомат AC может его не разорвать.",
    },
    pola: {
      prad: {
        nazwa: "Ток цепи [А]",
        cel: "Рабочий ток — для выбора номинального тока автомата.",
        gdzie: "Из данных потребителя или мощность ÷ напряжение.",
        zakres: Z_KARTY_RU,
      },
      napiecie: {
        nazwa: "Напряжение DC цепи [В]",
        cel: "Автомат должен быть рассчитан на это напряжение DC — при более высоком напряжении дугу погасить труднее.",
        gdzie: "Напряжение батареи или Voc,max стринга.",
        zakres: "Из документации автомата (номинальное напряжение DC).",
      },
      bieguny: {
        nazwa: "Число полюсов",
        cel: "При более высоких напряжениях DC производитель часто требует последовательного соединения нескольких полюсов.",
        gdzie: "Из документации автомата и схемы подключения производителя.",
        zakres: Z_KARTY_RU,
      },
      aic: {
        nazwa: "Отключающая способность (AIC) [А] (необязательно)",
        cel: "Сравнивается с током КЗ в этой точке.",
        gdzie: "Из документации автомата.",
        zakres: Z_KARTY_RU,
      },
      pradZwarcia: {
        nazwa: "Ток КЗ в этой точке [А] (необязательно)",
        cel: "Наибольший ток, который автомату может понадобиться разорвать.",
        gdzie: "С экрана «Анализ коротких замыканий».",
        zakres: "Результат анализа КЗ.",
      },
    },
  },
  "ochrona-odwrotna-polaryzacja": {
    migawka: {
      oCoChodzi: "Плюс с минусом — как огонь с бензином. Защита — это блокировка, которая не даёт ошибиться при подключении.",
      jakDziala:
        "Приложение сравнивает блокирующий диод (просто, но теряет немного энергии) и выключатель с механической блокировкой. Отсутствие какой-либо защиты — красный стоп.",
      poCo: "Подключение батареи к инвертору с перепутанной полярностью может за доли секунды уничтожить его вход — и это не гарантийный случай.",
    },
    pola: {
      miejsce: {
        nazwa: "Место в цепи",
        cel: "Где стоит защита: у батареи, стринга PV или инвертора. Здесь информационно.",
        gdzie: "Ваша установка.",
        zakres: "Батарея, панели / стринг PV или инвертор.",
      },
      ochrona: {
        nazwa: "Применённая защита",
        cel: "Блокирующий диод, выключатель с механической блокировкой или ничего. Ничего — красный стоп.",
        gdzie: "Из проекта установки или при осмотре.",
        zakres: "Варианты из списка.",
      },
    },
  },
  "wylaczniki-rcd": {
    migawka: {
      oCoChodzi:
        "УЗО (устройство защитного отключения) чувствует, что ток уходит туда, куда не должен, — например, через ваше тело — и отключает за доли секунды.",
      jakDziala:
        "Приложение проверяет три независимых правила: при гибридном инверторе нужен тип B, при двигателях — не ниже типа A, а дифференциальный ток — {progOsob} мА для защиты людей или {progPozar} мА для противопожарной защиты.",
      poCo: "Обычное УЗО типа AC может «ослепнуть» от постоянного тока инвертора — и не сработает, когда нужно.",
    },
    pola: {
      typ: {
        nazwa: "Тип установленного УЗО",
        cel: "AC обнаруживает только переменный ток, A — также пульсирующий, B — также гладкий постоянный.",
        gdzie: "По маркировке на аппарате (символ типа) или из документации.",
        zakres: "AC, A или B.",
      },
      cel: {
        nazwa: "Цель защиты цепи",
        cel: "Защита людей требует чувствительного УЗО ({progOsob} мА), противопожарная допускает {progPozar} мА.",
        gdzie: "Розетки и цепи, которых касаются люди, — защита людей; вводной аппарат — часто противопожарная.",
        zakres: "{progOsob} мА или {progPozar} мА.",
      },
      prad: {
        nazwa: "Дифференциальный ток установленного УЗО [мА]",
        cel: "Сравнивается с требуемым порогом для цели защиты.",
        gdzie: "По маркировке на аппарате (IΔn).",
        zakres: "{progOsob} мА для людей, {progPozar} мА противопожарно.",
      },
    },
  },
  "ochrona-przed-dotykiem": {
    migawka: {
      oCoChodzi:
        "Ток не прощает. Если коснётесь открытого плюса, не успеете среагировать. Защитные крышки и быстрое отключение — ваша безопасность.",
      jakDziala:
        "Контрольный список двух механизмов: основная защита (крышки, изоляция, оболочки) и защита при повреждении (автоматическое отключение, уравнивание потенциалов).",
      poCo: "При батареях 48 В и стрингах PV в несколько сотен вольт DC открытая клемма — реальная угроза жизни.",
    },
    pola: {},
  },
  "monitorowanie-izolacji-imd": {
    migawka: {
      oCoChodzi:
        "В системе IT нет прямого заземления, поэтому первое замыкание на землю не отключит предохранитель. Устройство контроля изоляции (IMD) выявит проблему, прежде чем она станет опасной.",
      jakDziala:
        "Для системы IT приложение требует IMD (нет — красный стоп) и проверяет введённый порог тревоги. Источник даёт пример {progPrzyklad} кОм, но реальный порог зависит от напряжения системы и производителя.",
      poCo: "Первое замыкание на землю в IT «тихое»; второе даёт КЗ. IMD даёт время на ремонт между ними.",
    },
    pola: {
      prog: {
        nazwa: "Порог тревоги IMD [кОм]",
        cel: "Сопротивление изоляции, ниже которого IMD подаёт тревогу.",
        gdzie: "По рекомендациям производителя IMD и установки.",
        zakres: "Пример из источника: {progPrzyklad} кОм — не универсальное значение.",
      },
    },
  },
  "trasy-kablowe": {
    migawka: {
      oCoChodzi:
        "Кабели — это дороги. Вы не хотите, чтобы транзитный поток (силовой ток) перекрывал тихую улочку (интернет), — их нужно прокладывать раздельно.",
      jakDziala: "Путеводитель с правилами прокладки трасс: разделение силовых и сигнальных кабелей, защита, повороты, маркировка.",
      poCo: "Хорошо проложенная трасса — меньше помех, проще обслуживание и меньше риск повреждения кабеля.",
    },
    pola: {},
  },
  "oznakowanie-obwodow": {
    migawka: {
      oCoChodzi: "Через 5 лет вы забудете, что есть что. Маркировка — память вашей системы.",
      jakDziala:
        "Список кодов маркировки проводников по EN 60445 (+, −, PE, U, N). Цвета жил приложение не навязывает — этого стандарта нет в репозитории.",
      poCo: "Сервисный специалист (или вы через несколько лет) должен за 10 секунд понять, какой провод плюс, а какой защитный.",
    },
    pola: {},
  },
  "normy-i-certyfikaty": {
    migawka: {
      oCoChodzi: "Сертификат — доказательство, что устройство не взорвётся при нормальном использовании. Без него вы бета-тестер.",
      jakDziala:
        "Контрольный список стандартов для ключевых компонентов: IEC 61730 (панели), IEC 62109 (инвертор), IEC 62619 (литиевые батареи) и общая позиция для остальных.",
      poCo: "Дешёвое несертифицированное оборудование — частая причина пожаров и проблема при страховании и приёмке установки.",
    },
    pola: {},
  },
  "string-box": {
    migawka: {
      oCoChodzi:
        "String box — узел, где кабели от панелей сходятся упорядоченно; без него у вас путаница проводов и риск пожара.",
      jakDziala:
        "Приложение проверяет, хватает ли в коробке входов DC для ваших стрингов, укладывается ли стринговый предохранитель в рекомендуемый диапазон ({bezpMin}–{bezpMax} А) и имеет ли коробка IP66 при объединении снаружи (нет — красный стоп).",
      poCo: "При нескольких параллельных стрингах повреждённый стринг может принять ток остальных — стринговые предохранители это предотвращают.",
    },
    pola: {
      stringi: {
        nazwa: "Число стрингов",
        cel: "Сколько цепочек панелей приходит в коробку.",
        gdzie: "Из проекта установки.",
        zakres: TWOJA_INSTALACJA_RU,
      },
      wejscia: {
        nazwa: "Число входов DC коробки",
        cel: "Их должно быть не меньше, чем стрингов.",
        gdzie: "Из документации коробки.",
        zakres: Z_KARTY_RU,
      },
      bezpiecznik: {
        nazwa: "Стринговый предохранитель [А]",
        cel: "Защищает стринг от обратного тока остальных стрингов.",
        gdzie: "Из проекта или документации панели (максимальный последовательный предохранитель).",
        zakres: "Рекомендуемый диапазон: {bezpMin}–{bezpMax} А на стринг.",
      },
    },
  },
  "separacja-emc": {
    migawka: {
      oCoChodzi: "Ток в кабеле создаёт магнитное поле. Оно может «заглушить» сетевой кабель. Их нужно разнести.",
      jakDziala:
        "Путеводитель: минимальное расстояние силовых кабелей от сигнальных 10–20 см, пересечение под прямым углом, экранированная витая пара (FTP) рядом с инвертором.",
      poCo: "Инвертор — источник сильных помех: плохо проложенный сетевой кабель или кабель датчика начнёт терять данные.",
    },
    pola: {},
  },
  "peszle-koryta-rurki": {
    migawka: {
      oCoChodzi: "Защитная оболочка — одежда для кабеля. Она должна подходить к погоде и месту, иначе кабель износится раньше времени.",
      jakDziala: "Вы выбираете место монтажа — приложение называет подходящую защиту из источника: гофру, УФ-стойкую гофру, трубу ПНД или металлический лоток.",
      poCo: "Обычная гофра на солнце крошится через несколько лет; в земле без трубы кабель подвержен механическим повреждениям.",
    },
    pola: {
      miejsce: {
        nazwa: "Место монтажа",
        cel: "От места зависит, какая защита выдержит условия (УФ, влага, нагрузка, температура).",
        gdzie: "Где проходит этот участок трассы.",
        zakres: "Варианты из списка.",
      },
    },
  },
  "ochrona-przed-gryzoniami": {
    migawka: {
      oCoChodzi: "Мышь не смотрит, красивый ли кабель. Она просто перегрызёт его и устроит КЗ.",
      jakDziala: "Вы выбираете уровень риска грызунов. При высоком риске приложение указывает металлический спиральный рукав, при низком хватит пластиковой гофры.",
      poCo: "Перегрызенный кабель DC в сарае или на чердаке — риск КЗ и пожара, часто там, куда никто не заглядывает.",
    },
    pola: {
      ryzyko: {
        nazwa: "Риск грызунов в округе",
        cel: "От риска зависит требуемая защита кабелей.",
        gdzie: "Ваша оценка: хозяйство, сарай, лес, чердак — обычно высокий.",
        zakres: "Варианты из списка.",
      },
    },
  },
  "optymalizacja-trasy-kabla": {
    migawka: {
      oCoChodzi: "Смотрите не только на цену кабеля — более толстый и короткий кабель часто окупается меньшими потерями за годы.",
      jakDziala:
        "Для двух вариантов трассы приложение считает годовые потери энергии тем же движком, что и подбор сечения (Модуль 5, Экран 1), и полную стоимость: покупка + потери × годы × цена кВт·ч.",
      poCo: "Чтобы честно сравнить варианты — более дешёвый на старте кабель может оказаться дороже через 10 лет.",
      fizyka: "TCO = стоимость покупки + годовые потери [кВт·ч] × годы × цена кВт·ч.",
    },
    pola: {
      prad: {
        nazwa: "Ток цепи [А]",
        cel: "Общий для обоих вариантов трассы — от него зависят потери.",
        gdzie: "Из данных потребителя или мощность ÷ напряжение.",
        zakres: Z_KARTY_RU,
      },
      napiecie: {
        nazwa: "Системное напряжение [В]",
        cel: "Для пересчёта падения напряжения.",
        gdzie: "Напряжение цепи.",
        zakres: "Обычно 12/24/48 В DC или 230 В AC.",
      },
      material: {
        nazwa: "Материал проводника",
        cel: "Медь или алюминий — разное удельное сопротивление.",
        gdzie: "Из описания кабеля.",
        zakres: "Cu или Al.",
      },
      ulozenie: {
        nazwa: "Способ прокладки",
        cel: "Влияет на допустимый ток кабеля (таблица стандарта).",
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
        zakres: TWOJA_INSTALACJA_RU,
      },
      spadek: {
        nazwa: "Допустимое падение напряжения [%]",
        cel: "Условие, которое должны выполнить оба варианта.",
        gdzie: "Значение по умолчанию или требование производителя.",
        zakres: "По умолчанию {spadekAc}% AC / {spadekDc}% DC.",
      },
      cenaEnergii: {
        nazwa: "Цена электроэнергии [зл/кВт·ч]",
        cel: "Оценивает потери энергии в кабеле.",
        gdzie: "Из счёта (стоимость 1 кВт·ч) или стоимость энергии от установки.",
        zakres: "Ваша цена.",
      },
      horyzont: {
        nazwa: "Горизонт сравнения [лет]",
        cel: "За сколько лет суммируются потери.",
        gdzie: "Столько, сколько должна работать установка.",
        zakres: "Ваш выбор.",
      },
      dlugosc: {
        nazwa: "Длина трассы [м]",
        cel: "Длина кабеля в этом варианте.",
        gdzie: "Измерьте по планируемой трассе.",
        zakres: TWOJA_INSTALACJA_RU,
      },
      przekroj: {
        nazwa: "Рассматриваемое сечение [мм²]",
        cel: "Сечение кабеля в этом варианте.",
        gdzie: "Из предложения или проекта.",
        zakres: "Стандартные сечения.",
      },
      koszt: {
        nazwa: "Стоимость покупки варианта [зл]",
        cel: "Кабель, защита и работа для этого варианта.",
        gdzie: "Из предложения.",
        zakres: "Ваша цена.",
      },
    },
  },
  "puszki-polaczeniowe": {
    migawka: {
      oCoChodzi: "Каждое соединение — потенциальная течь. Его нужно закрыть в герметичной коробке, чтобы вода не устроила КЗ.",
      jakDziala: "Вы выбираете место монтажа — приложение называет тип коробки из источника: IP66 с кабельными вводами, залитая смолой или IP20 для сухих помещений.",
      poCo: "Влага в наружной коробке вызывает коррозию и утечки — часто заметные только тогда, когда срабатывает УЗО или IMD.",
    },
    pola: {
      miejsce: {
        nazwa: "Место монтажа коробки",
        cel: "От места зависит требуемая герметичность.",
        gdzie: "Где находится соединение.",
        zakres: "Варианты из списка.",
      },
    },
  },
  "dobor-izolacji-kabla": {
    migawka: {
      oCoChodzi: "Изоляция — кожа кабеля: она должна подходить к температуре и месту, иначе трескается и пропускает влагу.",
      jakDziala: "Приложение сравнивает наибольшую ожидаемую температуру с допустимой для изоляции: ПВХ до 70 °C, XLPE до 90 °C. Место трассы — только подсказка.",
      poCo: "Кабель в ПВХ-изоляции на горячей крыше или у инвертора быстро стареет — изоляция твердеет и трескается.",
    },
    pola: {
      miejsce: {
        nazwa: "Место трассы (информационно)",
        cel: "Подсказывает, каких температур ожидать. На результат не влияет.",
        gdzie: "Где проходит кабель.",
        zakres: "Варианты из списка.",
      },
      izolacja: {
        nazwa: "Рассматриваемая изоляция кабеля",
        cel: "ПВХ (например, YKY/YAKY) выдерживает до 70 °C, XLPE — до 90 °C.",
        gdzie: "По маркировке кабеля или из документации.",
        zakres: "ПВХ или XLPE.",
      },
      temperatura: {
        nazwa: "Максимальная ожидаемая температура [°C]",
        cel: "Сравнивается с допустимой температурой изоляции.",
        gdzie: "Самое горячее место трассы летом (крыша, чердак, у инвертора).",
        zakres: "ПВХ до 70 °C, XLPE до 90 °C.",
      },
    },
  },
  "pomiary-powykonawcze": {
    migawka: {
      oCoChodzi:
        "Последний шаг перед приёмкой установки — шесть испытаний, каждое с жёстким порогом. Любой результат за порогом означает отсутствие формальной приёмки.",
      jakDziala:
        "Вы вводите результаты измерений: сопротивление изоляции (выше {minIzolacja} МОм), сопротивление заземления (порог зависит от назначения), время срабатывания УЗО (меньше {maxRcd} с) и подтверждаете три контрольных теста. Любое отсутствие или результат за порогом — красный стоп.",
      poCo: "Измерения — единственное доказательство безопасности установки и документ, нужный при приёмке и страховании.",
    },
    pola: {
      izolacja: {
        nazwa: "Сопротивление изоляции [МОм]",
        cel: "Насколько хорошо изоляция отделяет проводники друг от друга и от земли.",
        gdzie: "По измерению мегаомметром — протокол электрика.",
        zakres: "Требуется выше {minIzolacja} МОм.",
      },
      celUziemienia: {
        nazwa: "Назначение заземления",
        cel: "От назначения зависит порог сопротивления заземления.",
        gdzie: "Для чего служит измеряемый заземлитель.",
        zakres: "Пороги указаны у вариантов списка.",
      },
      uziemienie: {
        nazwa: "Сопротивление заземления [Ом]",
        cel: "Сравнивается с порогом для назначения заземления.",
        gdzie: "По измерению измерителем заземления — протокол электрика.",
        zakres: "Порог зависит от назначения (указан у вариантов).",
      },
      rcd: {
        nazwa: "Время срабатывания УЗО [с]",
        cel: "Как быстро УЗО отключает питание при утечке.",
        gdzie: "По измерению тестером УЗО — протокол электрика.",
        zakres: "Требуется меньше {maxRcd} с.",
      },
    },
  },
}
