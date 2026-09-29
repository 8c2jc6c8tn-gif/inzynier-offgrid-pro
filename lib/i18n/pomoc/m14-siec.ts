/**
 * Help content — Module 14 („Dom – sieć” / „Firma – sieć”). Formulas and rules: `03_M14_Dom_i_Firma_Siec.md`.
 * No tariff rate is written here as a number — rates live in `lib/core/dane/rozliczenia-pl-2026` (DANE-1) and
 * change with periods; the help only says where they come from.
 */
import type { Tlumaczenie } from "./typy"

const Z_FAKTURY = "wartość z Twojej faktury albo umowy — aplikacja nie przyjmuje typowej wartości za Ciebie."
const TWOJA_CENA = "Twoja cena — aplikacja nie zgaduje cen sprzętu, paliwa ani usług."
const MIESIAC_ZUZYCIE = {
  nazwa: "Zużycie energii w miesiącu [kWh]",
  cel: "Dwanaście kolejnych miesięcy pokazuje, kiedy zużywasz najwięcej. Z tych liczb korzystają rachunek, bilans PV i magazynu, zima bez sieci i porównanie scenariuszy.",
  gdzie: "Z faktur (rozliczenia okresowe) albo z portalu pomiarowego Twojego operatora (OSD) — tam jest zużycie miesiąc po miesiącu.",
  zakres: "Twoje dane — nie szacuj; zimą zwykle więcej, zwłaszcza z pompą ciepła albo ogrzewaniem elektrycznym.",
}

export const pl = {
  // ——— shared field groups ———
  "siec-osd": {
    pola: {
      osd: {
        nazwa: "Operator systemu dystrybucyjnego (OSD)",
        cel: "Firma, która dostarcza prąd siecią do Twojego licznika (nie sprzedawca energii). Od niej zależą stawki dystrybucyjne: opłata sieciowa stała i zmienna, abonament, strefy czasowe.",
        gdzie: "Na fakturze — w części „dystrybucja” albo w nagłówku (np. Tauron Dystrybucja, Energa-Operator, Stoen Operator, Enea Operator, PGE Dystrybucja).",
        zakres: "Dla części operatorów stawki 2026 są w aplikacji (odczyt taryfy zatwierdzonej przez URE); dla pozostałych wpiszesz je z faktury.",
      },
    },
  },
  "siec-rachunek": {
    pola: {
      grupa: {
        nazwa: "Grupa taryfowa",
        cel: "Określa, jak liczona jest dystrybucja i w jakich strefach czasowych płacisz. Dom: G11 (jedna cena przez całą dobę), G12/G12w/G12as/G13 (tańsze godziny). Firma: C11–C22b.",
        gdzie: "Na fakturze albo w umowie — zwykle obok numeru punktu poboru (PPE).",
        zakres: "Firma: C11/C12a/C12b dla mocy umownej do 40 kW, C21/C22a/C22b powyżej 40 kW. Nie każdy operator ma każdą grupę.",
      },
      przylacze: {
        nazwa: "Rodzaj przyłącza (jedno- albo trójfazowe)",
        cel: "W taryfach G opłata sieciowa stała zależy od tego, czy przyłącze jest jedno- czy trójfazowe.",
        gdzie: "Na fakturze (opłata stała „1-fazowa”/„3-fazowa”), w umowie albo na liczniku (trzy fazy = trzy przewody fazowe).",
        zakres: "Jednofazowe albo trójfazowe.",
      },
      mocUmowna: {
        nazwa: "Moc umowna [kW]",
        cel: "Moc zamówiona u operatora. W firmie (taryfy C) od niej liczona jest opłata sieciowa stała, a jej przekroczenie kosztuje dodatkowo. Decyduje też, które grupy C są dostępne.",
        gdzie: "Na fakturze albo w umowie dystrybucyjnej.",
        zakres: "C11/C12a/C12b do 40 kW, C21/C22a/C22b powyżej 40 kW.",
      },
      rok: {
        nazwa: "Rok rozliczenia",
        cel: "Stawki zmieniają się co roku (i czasem w trakcie roku). Aplikacja bierze stawki obowiązujące w tym roku.",
        gdzie: "Rok, za który liczysz rachunek.",
        zakres: "Stawki w aplikacji dotyczą 2026 r. Dla innego roku wpiszesz je z faktury.",
      },
      okres: {
        nazwa: "Okres rozliczeniowy",
        cel: "Co ile miesięcy dostajesz rozliczenie. Od niego zależy wysokość opłaty abonamentowej.",
        gdzie: "Na fakturze („okres rozliczeniowy”). Prosument jest rozliczany co 1 miesiąc.",
        zakres: "1, 2, 6 albo 12 miesięcy.",
      },
      zuzycieStrefy: {
        nazwa: "Roczne zużycie energii w strefie [kWh/rok]",
        cel: "Ile energii pobierasz w danej strefie czasowej (np. dzień/noc). Mnożone przez cenę energii i opłaty zmienne tej strefy.",
        gdzie: "Na fakturze rozliczeniowej — zużycie jest rozbite na strefy. Suma z 12 miesięcy albo z rocznego rozliczenia.",
        zakres: "Twoje dane z faktury.",
      },
      cenaStrefy: {
        nazwa: "Cena energii czynnej w strefie [zł/kWh netto]",
        cel: "Cena sprzedaży energii (część „sprzedaż”, nie „dystrybucja”). W firmie zawsze rynkowa, w domu z taryfy sprzedawcy albo z oferty.",
        gdzie: "Na fakturze, w części sprzedaży energii — cena netto za kWh w danej strefie.",
        zakres: Z_FAKTURY,
      },
      handlowa: {
        nazwa: "Opłata handlowa sprzedawcy [zł/mies. netto]",
        cel: "Stała miesięczna opłata sprzedawcy. Płacisz ją niezależnie od zużycia — wchodzi do „ceny trzymania sieci”.",
        gdzie: "Na fakturze w części sprzedaży. Jeśli jej tam nie ma — wpisz 0.",
        zakres: Z_FAKTURY,
      },
      energiaMocowa: {
        nazwa: "Energia pobrana w dni robocze 7:00–22:00 [kWh/rok]",
        cel: "W firmie opłata mocowa liczona jest tylko od energii pobranej w tych godzinach. Im mniejszy udział, tym niższa opłata.",
        gdzie: "Na fakturze (pozycja opłaty mocowej) albo w portalu pomiarowym operatora.",
        zakres: "Nie więcej niż całe roczne zużycie.",
      },
      siecZmienna: {
        nazwa: "Opłata sieciowa zmienna w strefie [zł/kWh]",
        cel: "Część dystrybucji zależna od zużycia. Maleje, gdy mniej pobierasz z sieci (PV, magazyn).",
        gdzie: "Na fakturze w części dystrybucji. Pole jest aktywne, gdy aplikacja nie ma stawek Twojego operatora.",
        zakres: Z_FAKTURY,
      },
      siecStala: {
        nazwa: "Opłata sieciowa stała",
        cel: "Część dystrybucji niezależna od zużycia — płacisz ją, dopóki masz przyłącze. Dom: zł/mies.; firma: zł za każdy kW mocy umownej na miesiąc.",
        gdzie: "Na fakturze w części dystrybucji (składnik stały stawki sieciowej).",
        zakres: Z_FAKTURY,
      },
      abonament: {
        nazwa: "Opłata abonamentowa [zł/mies.]",
        cel: "Opłata operatora za odczyt i rozliczenie licznika. Stała — wchodzi do „ceny trzymania sieci”.",
        gdzie: "Na fakturze w części dystrybucji. Zależy od okresu rozliczeniowego.",
        zakres: Z_FAKTURY,
      },
      jakosciowa: {
        nazwa: "Stawka jakościowa [zł/kWh]",
        cel: "Opłata za utrzymanie jakości systemu, doliczana do każdej kWh pobranej z sieci.",
        gdzie: "Na fakturze w części dystrybucji.",
        zakres: "Stawka ogólnokrajowa ustalana w taryfie — w aplikacji jest wartość na 2026 r.",
      },
      oze: {
        nazwa: "Opłata OZE [zł/kWh]",
        cel: "Opłata na wsparcie odnawialnych źródeł, doliczana do każdej kWh pobranej z sieci.",
        gdzie: "Na fakturze w części dystrybucji (często podana w zł/MWh — podziel przez 1000).",
        zakres: "Stawka ogólnokrajowa — w aplikacji jest wartość na 2026 r.",
      },
      kogeneracyjna: {
        nazwa: "Opłata kogeneracyjna [zł/kWh]",
        cel: "Opłata na wsparcie wysokosprawnej kogeneracji, doliczana do każdej kWh pobranej z sieci.",
        gdzie: "Na fakturze w części dystrybucji (często w zł/MWh — podziel przez 1000).",
        zakres: "Stawka ogólnokrajowa — w aplikacji jest wartość na 2026 r.",
      },
      mocowa: {
        nazwa: "Opłata mocowa",
        cel: "Opłata na utrzymanie rezerw mocy w kraju. Dom: ryczałt miesięczny zależny od progu rocznego zużycia. Firma: zł za każdą kWh pobraną w dni robocze 7:00–22:00.",
        gdzie: "Na fakturze (osobna pozycja „opłata mocowa”).",
        zakres: "Stawki ogólnokrajowe z informacji Prezesa URE — w aplikacji są wartości na 2026 r.",
      },
    },
  },
  "siec-wzrost-cen": {
    pola: {
      zrodlo: {
        nazwa: "Wzrost cen energii — skąd go wziąć",
        cel: "„Suwak %” i „Plany UE” to zmiana ceny ponad inflację — wynik w dzisiejszych złotych. „Plany UE + inflacja” pokazuje kwoty do zapłaty w złotych z tamtych lat; ranking scenariuszy i tak liczy się w dzisiejszych złotych. Aplikacja sama nie prognozuje cen — pokazuje wrażliwość albo oficjalną projekcję.",
        gdzie: "„Plany UE” = projekcja Komisji Europejskiej dla Polski (EU Reference Scenario 2020). Uwaga: zakłada politykę z końca 2019 r., bez kryzysu 2021–2023, Fit for 55 i ETS2 — to scenariusz odniesienia, nie prognoza rachunku.",
        zakres: "Suwak: −3 / 0 / +5 / +10 %/rok (0 = ceny stałe, domyślnie).",
      },
      inflacjaZrodlo: {
        nazwa: "Źródło inflacji",
        cel: "Przy „Plany UE + inflacja” każdy koszt bieżący (energia, paliwo, serwis, wymiany) rośnie o inflację — inaczej scenariusze z agregatem wyglądałyby sztucznie tanio.",
        gdzie: "Średnia GUS z ostatnich 15 lat (domyślnie), cel inflacyjny NBP albo własna wartość.",
        zakres: "Wartości obu źródeł pokazuje wynik pod polem, z nazwą źródła.",
      },
      inflacjaWlasna: {
        nazwa: "Własna inflacja [%/rok]",
        cel: "Średnioroczny wzrost cen, jaki zakładasz w całym horyzoncie.",
        gdzie: "Twoje założenie — dla porównania sprawdź średnią GUS i cel NBP.",
        zakres: "Twoja wartość.",
      },
    },
  },
  "siec-scenariusze": {
    pola: {
      horyzont: {
        nazwa: "Horyzont porównania N [lat]",
        cel: "Przez ile lat sumowane są koszty każdego scenariusza (koszt całkowity, TCO).",
        gdzie: "Twój wybór — zwykle tyle, ile ma żyć instalacja.",
        zakres: "10–25 lat, domyślnie 15.",
      },
      stopa: {
        nazwa: "Stopa dyskontowa r [%/rok]",
        cel: "Ile mniej warta jest złotówka wydana za kilka lat niż dziś. 0 = tryb prosty: wszystko w dzisiejszych złotych, bez dyskonta.",
        gdzie: "Twój wybór — np. oprocentowanie lokaty albo kredytu, jeśli tak porównujesz inwestycje.",
        zakres: "0 w trybie prostym (domyślnie).",
      },
      cenaSieci: {
        nazwa: "„Cena trzymania sieci” brutto [zł/rok]",
        cel: "Ile rocznie kosztuje samo posiadanie przyłącza: opłaty stałe (sieciowa stała, abonament, handlowa, w domu także mocowa) z VAT. PV i magazyn tego nie obniżą — znika dopiero po odłączeniu.",
        gdzie: "Policz na ekranie „Mój rachunek dziś” — puste pole bierze wynik stamtąd.",
        zakres: "Wynik z Twojego rachunku.",
      },
      kosztKwh: {
        nazwa: "Koszt zmienny 1 kWh z sieci, brutto [zł/kWh]",
        cel: "Ile płacisz za każdą kWh pobraną z sieci (energia + opłaty zmienne + VAT). To oszczędzasz, gdy PV i magazyn zastępują sieć.",
        gdzie: "Z ekranu „Mój rachunek dziś” — puste pole bierze wynik stamtąd.",
        zakres: "Wynik z Twojego rachunku.",
      },
      wartoscOddanej: {
        nazwa: "Wartość 1 kWh oddanej do sieci [zł/kWh]",
        cel: "Ile wart jest nadmiar energii oddany do sieci w net-billingu (trafia na depozyt). Zwykle dużo mniej niż kWh pobrana — dlatego liczy się autokonsumpcja.",
        gdzie: "Z ekranu depozytu prosumenckiego (cena RCE/RCEm × 1,23). Jeśli nic nie oddajesz — wpisz 0.",
        zakres: "Wynik z ekranu depozytu.",
      },
      zywotnosc: {
        nazwa: "Żywotność magazynu [lat]",
        cel: "Po tylu latach magazyn trzeba wymienić — koszt wymiany wchodzi do scenariusza, a niewykorzystana część życia daje wartość końcową.",
        gdzie: "Z karty katalogowej magazynu: liczba cykli ÷ cykle w roku, albo okres gwarancji.",
        zakres: "Z karty katalogowej magazynu.",
      },
      inwestycja: {
        nazwa: "Nakład inwestycyjny scenariusza [zł]",
        cel: "Ile kosztuje zbudowanie instalacji w tym scenariuszu (PV, magazyn, falownik, montaż, przełącznik, agregat). Puste pole = scenariusz pominięty w porównaniu.",
        gdzie: "Z ofert instalatorów.",
        zakres: TWOJA_CENA,
      },
      dotacja: {
        nazwa: "Dotacja [zł]",
        cel: "Odejmowana od nakładu. Uwaga: odłączenie od sieci w okresie trwałości projektu może oznaczać zwrot dotacji.",
        gdzie: "Z umowy o dofinansowanie albo z warunków naboru (ekran „Dotacje”).",
        zakres: "Twoja kwota.",
      },
      mocPv: {
        nazwa: "Moc instalacji PV [kWp]",
        cel: "Z niej i z nasłonecznienia Twojej lokalizacji liczona jest produkcja miesiąc po miesiącu.",
        gdzie: "Z oferty: suma mocy paneli (Wp) ÷ 1000.",
        zakres: "Twój projekt.",
      },
      magazyn: {
        nazwa: "Pojemność magazynu [kWh]",
        cel: "Ile energii magazyn przesuwa z dnia na wieczór i noc. W scenariuszu D razem z agregatem pokrywa zimę.",
        gdzie: "Z oferty albo karty magazynu — pojemność użyteczna.",
        zakres: "Twój projekt.",
      },
      kosztMagazynu: {
        nazwa: "W tym koszt magazynu [zł]",
        cel: "Część nakładu przypadająca na magazyn — tyle kosztuje jego wymiana po upływie żywotności.",
        gdzie: "Z oferty (pozycja magazynu).",
        zakres: TWOJA_CENA,
      },
      serwis: {
        nazwa: "Serwis [zł/rok]",
        cel: "Roczne koszty przeglądów i utrzymania instalacji w tym scenariuszu.",
        gdzie: "Z oferty serwisowej albo własnego doświadczenia.",
        zakres: TWOJA_CENA,
      },
      agregatMoc: {
        nazwa: "Moc agregatu [kW]",
        cel: "Agregat pokrywa niedobór energii zimą w scenariuszach off-grid. 0 = scenariusz bez agregatu.",
        gdzie: "Z tabliczki albo karty agregatu (moc ciągła).",
        zakres: "Z karty katalogowej agregatu.",
      },
      paliwoZuzycie: {
        nazwa: "Zużycie paliwa agregatu [l/h]",
        cel: "Razem z godzinami pracy daje roczny koszt paliwa.",
        gdzie: "Z karty katalogowej agregatu (przy obciążeniu zbliżonym do pracy przy ładowaniu magazynu).",
        zakres: "Z karty katalogowej agregatu.",
      },
      paliwoCena: {
        nazwa: "Cena paliwa [zł/l]",
        cel: "Koszt litra paliwa do agregatu.",
        gdzie: "Aktualna cena na stacji.",
        zakres: TWOJA_CENA,
      },
      progAgregatu: {
        nazwa: "Mój próg pracy agregatu [h/mies.]",
        cel: "Ile godzin w miesiącu akceptujesz pracę agregatu (hałas, paliwo, serwis). Powyżej tego progu scenariusz D jest oznaczony jako ryzykowny.",
        gdzie: "Twoja decyzja.",
        zakres: "Twój wybór.",
      },
      medyczny: {
        nazwa: "Sprzęt medyczny zależny od zasilania",
        cel: "Koncentrator tlenu, sprzęt medyczny, lodówka z lekami (ryzyko R4). Przy „tak” pełne odłączenie od sieci wymaga niezawodnego zapasu — aplikacja to wyraźnie zaznacza.",
        gdzie: "Twoja sytuacja domowa.",
        zakres: "Tak albo nie.",
      },
      czasBezZasilania: {
        nazwa: "Dopuszczalny czas bez zasilania [h]",
        cel: "Ile godzin firma zniesie bez prądu (chłodnie, produkcja, serwery) — ryzyko RF1. Porównywane z tym, co pokryją magazyn i agregat.",
        gdzie: "Z oceny ciągłości działania firmy albo wymagań klientów i ubezpieczyciela.",
        zakres: "Twoja firma.",
      },
    },
  },
  "siec-pv-magazyn": {
    pola: {
      mocPv: {
        nazwa: "Moc instalacji PV [kWp]",
        cel: "Z mocy i miesięcznego uzysku z Twojej lokalizacji aplikacja liczy produkcję w każdym miesiącu.",
        gdzie: "Z oferty albo istniejącej instalacji: suma mocy paneli (Wp) ÷ 1000.",
        zakres: "Twój projekt.",
      },
      autokonsumpcja: {
        nazwa: "Autokonsumpcja bezpośrednia [%]",
        cel: "Jaka część produkcji PV jest zużywana od razu, w chwili produkcji. Reszta idzie do magazynu albo do sieci.",
        gdzie: "Z monitoringu falownika (jeśli masz PV) albo własne oszacowanie — typowe profile operatorów nie są jeszcze w aplikacji.",
        zakres: "0–100%. Twoja wartość.",
      },
      magazyn: {
        nazwa: "Pojemność użyteczna magazynu [kWh]",
        cel: "Ile nadwyżki z dnia magazyn może przesunąć na wieczór i noc. Użyteczna, czyli po odjęciu rezerwy (DoD, Moduł 4).",
        gdzie: "Z karty magazynu (usable capacity) albo pojemność × DoD. 0 lub puste = bez magazynu.",
        zakres: "Z karty katalogowej magazynu.",
      },
      sprawnosc: {
        nazwa: "Sprawność cyklu magazynu [%]",
        cel: "Ile energii wraca z magazynu z tego, co do niego weszło (straty baterii i falownika).",
        gdzie: "Z karty katalogowej magazynu i falownika (round-trip efficiency).",
        zakres: "0–100%, z karty katalogowej.",
      },
    },
  },
  "siec-uzysk-pv": {
    pola: {
      zrodlo: {
        nazwa: "Skąd uzysk PV",
        cel: "Ile kWh daje 1 kWp w każdym miesiącu. Z lokalizacji — aplikacja liczy z nasłonecznienia (Moduły 1 i 3); ręcznie — wpisujesz 12 wartości, np. z PVGIS.",
        gdzie: "Lokalizację ustawiasz w Module 1. Wartości ręczne — z kalkulatora PVGIS dla Twojej działki.",
        zakres: "Z lokalizacji albo 12 wartości ręcznie.",
      },
      azymut: {
        nazwa: "Azymut paneli [°]",
        cel: "Kierunek, w którym patrzą panele. Wpływa na produkcję w ciągu dnia i roku.",
        gdzie: "Z projektu albo kompasu. 0 = południe, ujemne na wschód, dodatnie na zachód.",
        zakres: "Od −180° do 180°, 0 = południe.",
      },
      nachylenie: {
        nazwa: "Nachylenie paneli [°]",
        cel: "Kąt paneli od poziomu. Bardziej strome panele dają więcej zimą, mniej latem.",
        gdzie: "Z projektu albo zmierz kątomierzem (0° = płasko, 90° = pionowo).",
        zakres: "0–90°.",
      },
      pr: {
        nazwa: "Współczynnik sprawności instalacji PR",
        cel: "Jaka część teoretycznej produkcji dochodzi do licznika po stratach (temperatura, kable, falownik, zabrudzenie).",
        gdzie: "Z projektu instalatora albo z monitoringu istniejącej instalacji.",
        zakres: "0–1, Twoja wartość.",
      },
      miesiac: {
        nazwa: "Uzysk w miesiącu [kWh/kWp]",
        cel: "Ile kWh daje 1 kWp w tym miesiącu. Mnożone przez moc PV.",
        gdzie: "Z PVGIS (produkcja miesięczna dla 1 kWp) albo z monitoringu istniejącej instalacji.",
        zakres: "Twoje dane — zimą kilka razy mniej niż latem.",
      },
    },
  },
  "siec-zuzycie": {
    pola: { miesiac: MIESIAC_ZUZYCIE },
  },
  "agregat-bezpieczenstwo": {
    pola: {
      miejsce: {
        nazwa: "Miejsce pracy agregatu",
        cel: "Spaliny zawierają czad (CO) — bezwonny i śmiertelny. Agregat w budynku (piwnica, garaż przy domu, kotłownia) to czerwony stop; wydzielone pomieszczenie z wydechem na zewnątrz — ostrzeżenie z listą warunków; na zewnątrz — informacja.",
        gdzie: "Wybierz miejsce, gdzie agregat faktycznie stoi podczas pracy.",
        zakres: "Na zewnątrz, wydzielone pomieszczenie techniczne albo w budynku.",
      },
      podlaczenie: {
        nazwa: "Sposób podłączenia agregatu",
        cel: "Agregat podłączony do instalacji budynku bez przełącznika (np. „wtyczką” do gniazdka) może podać napięcie do sieci i zabić montera na „wyłączonej” linii — czerwony stop. Przełącznik I–0–II jest wymagany zawsze, gdy agregat zasila instalację budynku.",
        gdzie: "Sprawdź, jak agregat jest połączony: przez przełącznik, wprost do instalacji, przez wejście AC falownika albo tylko odbiorniki wpięte w jego gniazda.",
        zakres: "Opcje z listy. Szczegóły przełącznika — ekran „Przełącznik sieć/wyspa i bezpieczeństwo”.",
      },
    },
  },
  // ——— screens ———
  "rachunek-dom": {
    migawka: {
      oCoChodzi:
        "Z czego składa się Twój rachunek za prąd i ile z niego płacisz za samo posiadanie przyłącza — „cenę trzymania sieci”.",
      jakDziala:
        "Rachunek = sprzedaż + dystrybucja. Aplikacja dzieli go na część zmienną (energia, opłaty sieciowe zmienne, jakościowa, OZE, kogeneracyjna — rosną z każdą kWh) i stałą (opłata sieciowa stała, abonament, opłata handlowa, w domu ryczałt mocowy — płacisz je, dopóki masz umowę i licznik). Stawki dystrybucyjne 2026 bierze z taryf operatorów, a brakujące wpisujesz z faktury.",
      poCo:
        "To oś całej decyzji o przejściu na off-grid: PV i magazyn obniżają tylko część zmienną. Część stała („cena trzymania sieci”) znika dopiero po odłączeniu — i to z nią porównujesz koszt pełnej niezależności.",
      fizyka: "K_stałe,rok = 12 · (opłata sieciowa stała + abonamentowa + handlowa + mocowa_G) · (1 + VAT).",
    },
    pola: {},
  },
  "rachunek-firma": {
    migawka: {
      oCoChodzi:
        "Rachunek firmy na niskim napięciu (taryfy C11–C22b): energia, dystrybucja, opłata mocowa za pobór w dni robocze 7–22 i koszt stały zależny od mocy umownej.",
      jakDziala:
        "Aplikacja sumuje energię w strefach (cenę sprzedaży wpisujesz z faktury — w firmie jest zawsze rynkowa), opłaty sieciowe zmienne i ogólnokrajowe, opłatę mocową od energii pobranej w dni robocze 7:00–22:00 oraz 12 × (moc umowna × składnik stały + abonament + opłata handlowa). Stawki dystrybucyjne 2026 są w aplikacji dla części operatorów.",
      poCo:
        "Żeby zobaczyć, które pozycje da się obniżyć: przesunięciem poboru (opłata mocowa), korektą mocy umownej, kompensacją mocy biernej albo własną produkcją.",
      fizyka: "K_T = Σ E_z·(c_energia + c_sieć_zm + c_jakość + c_OZE + c_kogen) + E_mocowa·c_mocowa + 12·(P_u·c_sieć_st + c_abon + c_handl); brutto × 1,23.",
    },
    pola: {},
  },
  "taryfa-g": {
    migawka: {
      oCoChodzi:
        "Która taryfa G — G11, G12 czy G12w — da najniższy roczny koszt przy Twoim zużyciu.",
      jakDziala:
        "Dla każdej taryfy aplikacja liczy pełny rachunek roczny z tym samym zużyciem, rozłożonym na strefy tej taryfy: energia i opłaty zmienne w każdej strefie plus opłaty stałe. Wyniki stawia obok siebie.",
      poCo:
        "Taryfa dwustrefowa opłaca się tylko wtedy, gdy jej tańsze godziny pasują do tego, kiedy naprawdę zużywasz prąd (np. grzanie wody nocą, ładowanie auta, pompa ciepła z buforem).",
    },
    pola: {},
  },
  "taryfy-c": {
    migawka: {
      oCoChodzi: "Roczny koszt w taryfach C11–C22b dla Twojej mocy umownej i zużycia.",
      jakDziala:
        "Dla każdej grupy dostępnej przy Twojej mocy umownej aplikacja liczy pełny koszt roczny: energia w strefach, opłaty zmienne i ogólnokrajowe, opłata mocowa, 12 × opłaty stałe. Grupy niedostępne dla tej mocy (C1x do 40 kW, C2x powyżej) są wyłączone z porównania, a nie „uznane za gorsze”.",
      poCo: "Zmiana grupy taryfowej to często najtańsza oszczędność — bez żadnej inwestycji.",
    },
    pola: {},
  },
  "zuzycie-miesieczne": {
    migawka: {
      oCoChodzi: "Twoje zużycie energii z 12 kolejnych miesięcy — podstawa wszystkich dalszych obliczeń w tym rozdziale.",
      jakDziala:
        "Wpisujesz zużycie z faktur albo z portalu pomiarowego operatora. Aplikacja zapisuje je na tym urządzeniu i przekazuje dalej: do rachunku, bilansu PV i magazynu, zimy bez sieci i porównania scenariuszy.",
      poCo:
        "Średnia roczna ukrywa zimę. Bez rozkładu na miesiące nie da się uczciwie ocenić, czy PV i magazyn wystarczą w grudniu i styczniu.",
    },
    pola: {},
  },
  "depozyt-prosumencki": {
    migawka: {
      oCoChodzi:
        "Jak rozliczana jest energia oddana do sieci (net-metering, net-billing) i co dzieje się z depozytem, gdy rezygnujesz z umowy.",
      jakDziala:
        "W net-billingu wartość energii oddanej (ilość × cena RCEm albo RCE) trafia na depozyt, powiększony o 1,23. Depozyt jest ważny 12 miesięcy; niewykorzystany zwracany jest najwyżej w 20% (RCEm) albo 30% (RCE), reszta przepada. Ujemna RCE liczy się jako 0. Aplikacja liczy depozyt, zwrot i realną wartość 1 kWh oddanej w porównaniu z kWh pobraną.",
      poCo:
        "Rozwiązanie umowy kończy rozliczenia — najpierw trzeba wykorzystać saldo. I widać, dlaczego w net-billingu opłaca się zużywać energię na miejscu, a nie oddawać.",
      fizyka: "Ustawa o OZE (Dz.U. 2026 poz. 68): depozyt × 1,23 (art. 4c ust. 4), zwrot 20%/30% (art. 4 ust. 11a), umorzenie po 12 mies. (art. 4c ust. 6).",
    },
    pola: {
      miesiac: {
        nazwa: "Miesiąc wprowadzenia energii",
        cel: "Od niego liczy się 12-miesięczna ważność depozytu i ceny rozliczenia z tego miesiąca.",
        gdzie: "Z rozliczenia prosumenckiego u sprzedawcy.",
        zakres: "Miesiąc i rok.",
      },
      energia: {
        nazwa: "Energia oddana do sieci w tym miesiącu [kWh]",
        cel: "Ilość nadwyżki, której wartość trafia na depozyt.",
        gdzie: "Z faktury prosumenckiej albo portalu pomiarowego operatora (energia wprowadzona).",
        zakres: "Twoje dane.",
      },
      cena: {
        nazwa: "Cena rozliczenia (RCE albo RCEm)",
        cel: "RCEm — średnia cena miesięczna; RCE — cena godzinowa. Przejście z RCEm na RCE jest jednokierunkowe. Od wyboru zależy też limit zwrotu (20% / 30%).",
        gdzie: "Z umowy prosumenckiej albo rozliczenia sprzedawcy.",
        zakres: "RCE albo RCEm.",
      },
      sredniaCena: {
        nazwa: "Średnia cena tej energii [zł/MWh]",
        cel: "Cena, po której wyceniana jest energia oddana w tym miesiącu.",
        gdzie: "Z rozliczenia sprzedawcy albo z publikacji PSE (RCEm / RCE).",
        zakres: "Wartość z rozliczenia albo publikacji PSE.",
      },
      wykorzystanie: {
        nazwa: "Wykorzystanie depozytu w 12 miesięcy [zł] (opcjonalnie)",
        cel: "Ile depozytu zużyjesz na rachunki w ciągu roku. Z tego aplikacja liczy, ile zostanie do zwrotu, a ile przepadnie.",
        gdzie: "Twoje oszacowanie — przy odchodzeniu z sieci zwykle mniej niż cały depozyt.",
        zakres: "Od 0 do wartości depozytu.",
      },
      pelnyKoszt: {
        nazwa: "Pełny koszt 1 kWh pobranej, brutto [zł/kWh] (opcjonalnie)",
        cel: "Pozwala policzyć, ile naprawdę wart jest 1 kWh oddany w porównaniu z kWh pobraną z sieci (współczynnik bilansowania).",
        gdzie: "Np. średnia z ekranu „Mój rachunek dziś”.",
        zakres: "Wynik z Twojego rachunku.",
      },
    },
  },
  "test-licznika": {
    migawka: {
      oCoChodzi:
        "Ile mocy rejestruje licznik — sprawdzisz to sam po migającej diodzie. A przy wątpliwościach aplikacja przygotuje pismo reklamacyjne.",
      jakDziala:
        "Dioda licznika mignie raz przy każdej porcji energii; ile porcji na kWh — mówi stała licznika (imp/kWh). Liczysz mignięcia w określonym czasie, a aplikacja przelicza to na moc: P = 3600 · n / (t · stała). Jeśli wiesz, jaki odbiornik jest włączony (np. czajnik 2000 W), porówna wynik z jego mocą.",
      poCo:
        "Żeby odróżnić „licznik źle liczy” od „coś w domu pobiera prąd”. Przedsiębiorstwo ma 14 dni na odpowiedź na reklamację; badanie laboratoryjne licznika opłaca odbiorca, chyba że wykaże nieprawidłowości.",
      fizyka: "P [kW] = 3600 · n / (t[s] · stała [imp/kWh]). Przykład: 15 impulsów w 60 s przy stałej 1000 imp/kWh → 0,9 kW.",
    },
    pola: {
      impulsy: {
        nazwa: "Liczba impulsów (mignięć diody)",
        cel: "Ile razy mignęła dioda licznika w zmierzonym czasie.",
        gdzie: "Policz mignięcia diody na liczniku (zwykle podpisanej „imp/kWh”), mierząc czas stoperem.",
        zakres: "Im więcej mignięć policzysz, tym dokładniejszy wynik — co najmniej kilkanaście.",
      },
      czas: {
        nazwa: "Czas pomiaru [s]",
        cel: "W jakim czasie policzyłeś impulsy. Razem z liczbą impulsów daje moc.",
        gdzie: "Stoper w telefonie.",
        zakres: "Np. 60 s — dłuższy pomiar jest dokładniejszy.",
      },
      stala: {
        nazwa: "Stała licznika [imp/kWh]",
        cel: "Ile impulsów dioda daje na 1 kWh. Bez niej nie da się przeliczyć mignięć na moc.",
        gdzie: "Nadrukowana na tabliczce licznika, obok diody (np. „1000 imp/kWh”).",
        zakres: "Wartość z tabliczki licznika.",
      },
      mocOdbiornika: {
        nazwa: "Moc włączonego odbiornika [W] (opcjonalnie)",
        cel: "Gdy podczas testu pracuje tylko znany odbiornik, aplikacja porówna jego moc z tym, co pokazał licznik.",
        gdzie: "Z tabliczki odbiornika (np. czajnik, grzejnik). Resztę domu na czas testu wyłącz.",
        zakres: "Z tabliczki urządzenia.",
      },
      nadawca: {
        nazwa: "Imię i nazwisko albo nazwa firmy",
        cel: "Nadawca pisma reklamacyjnego — tak, jak na umowie.",
        gdzie: "Z umowy albo faktury.",
        zakres: "Tekst. Dane zostają na tym urządzeniu.",
      },
      adres: {
        nazwa: "Adres",
        cel: "Adres nadawcy w piśmie reklamacyjnym.",
        gdzie: "Adres z umowy.",
        zakres: "Tekst. Dane zostają na tym urządzeniu.",
      },
      nip: {
        nazwa: "NIP (tylko firma)",
        cel: "Identyfikuje firmę w piśmie. Osoba prywatna zostawia puste.",
        gdzie: "Z faktury.",
        zakres: "10 cyfr albo puste.",
      },
      numerKlienta: {
        nazwa: "Numer klienta",
        cel: "Pozwala szybko znaleźć Twoją umowę.",
        gdzie: "Na fakturze.",
        zakres: "Tekst z faktury.",
      },
      ppe: {
        nazwa: "Numer punktu poboru energii (PPE)",
        cel: "Jednoznacznie wskazuje licznik, którego dotyczy reklamacja.",
        gdzie: "Na fakturze (punkt poboru energii, PPE).",
        zakres: "Tekst z faktury.",
      },
      faktura: {
        nazwa: "Numer i data faktury",
        cel: "Faktura, którą reklamujesz.",
        gdzie: "Z nagłówka faktury.",
        zakres: "Tekst z faktury.",
      },
      opis: {
        nazwa: "Opis problemu",
        cel: "Krótko, co się stało i od kiedy — z wynikiem testu diody, jeśli go masz.",
        gdzie: "Twój opis, np. „Nagły wzrost zużycia po wymianie licznika”.",
        zakres: "Tekst.",
      },
      zadanie: {
        nazwa: "Żądanie",
        cel: "Czego oczekujesz od przedsiębiorstwa — domyślnie weryfikacji układu pomiarowego i korekty faktury.",
        gdzie: "Zostaw domyślne albo dopisz swoje.",
        zakres: "Tekst.",
      },
      miejscowosc: {
        nazwa: "Miejscowość i data",
        cel: "Miejsce i data sporządzenia pisma.",
        gdzie: "Wpisz przed wysłaniem.",
        zakres: "Tekst.",
      },
    },
  },
  "moc-bierna": {
    migawka: {
      oCoChodzi:
        "Ile firma płaci za energię bierną ponad dopuszczalny tgφ₀ i czy opłaca się bateria kondensatorów, która ją skompensuje.",
      jakDziala:
        "Opłata za nadwyżkę indukcyjną liczona jest jak w taryfach operatorów 2026: O = k · C_rk · (√((1 + tg²φ)/(1 + tg²φ₀)) − 1) · A. Energia pojemnościowa płatna jest osobno: k · C_rk · E_b. Kompensacja: moc baterii Q = P · (tgφ − tgφ_cel); zwrot = koszt baterii ÷ roczna opłata.",
      poCo:
        "Silniki, sprężarki i zasilacze impulsowe pobierają energię bierną, za którą operator może naliczać opłatę. Bateria kondensatorów często zwraca się szybko — ale przekompensowanie też kosztuje.",
      fizyka:
        "tgφ = energia bierna / energia czynna. Wersja wzoru bez pierwiastka (spotykana w materiałach) zawyża opłatę ok. dwukrotnie. k = 3 na niskim napięciu.",
    },
    pola: {
      tgPhi: {
        nazwa: "Zmierzony tgφ (średni)",
        cel: "Stosunek energii biernej do czynnej w Twojej instalacji. Im wyższy ponad tgφ₀, tym wyższa opłata.",
        gdzie: "Z faktury (energia bierna ÷ energia czynna) albo z analizatora sieci.",
        zakres: "Twoje dane z faktury albo pomiaru.",
      },
      tgPhi0: {
        nazwa: "Umowny tgφ₀",
        cel: "Próg, powyżej którego energia bierna jest płatna.",
        gdzie: "Z umowy albo warunków przyłączenia.",
        zakres: "Zwykle 0,4, chyba że umowa mówi inaczej — nigdy mniej niż 0,2.",
      },
      energiaCzynna: {
        nazwa: "Energia czynna pobrana [kWh/rok]",
        cel: "Energia, od której naliczana jest opłata za nadwyżkę bierną (A we wzorze).",
        gdzie: "Z faktur — suma za rok.",
        zakres: "Twoje dane.",
      },
      crk: {
        nazwa: "Cena C_rk [zł/kWh]",
        cel: "Cena energii elektrycznej ogłaszana przez Prezesa URE, obowiązująca w dniu zatwierdzenia taryfy — to nie cena Twojej energii. Bez niej aplikacja pokaże tylko czynnik nadwyżki.",
        gdzie: "Z faktury za energię bierną albo taryfy operatora.",
        zakres: "Wartość z faktury — aplikacja nie ma domyślnej.",
      },
      pojemnosciowa: {
        nazwa: "Energia bierna pojemnościowa [kvarh/rok] (opcjonalnie)",
        cel: "Energia bierna pojemnościowa jest płatna w całości (bez progu tgφ₀) — często skutek przekompensowania.",
        gdzie: "Z faktury (osobna pozycja).",
        zakres: "Twoje dane.",
      },
      mocSrednia: {
        nazwa: "Średnia moc czynna w czasie pracy [kW]",
        cel: "Potrzebna do doboru mocy baterii kondensatorów (Q = P · (tgφ − tgφ_cel)).",
        gdzie: "Energia czynna ÷ godziny pracy albo odczyt z analizatora.",
        zakres: "Twoje dane.",
      },
      tgCel: {
        nazwa: "Docelowy tgφ",
        cel: "Do jakiej wartości chcesz obniżyć tgφ kompensacją.",
        gdzie: "Twój wybór — z zapasem poniżej tgφ₀, ale bez przekompensowania.",
        zakres: "Poniżej tgφ₀.",
      },
      kosztBaterii: {
        nazwa: "Koszt baterii kondensatorów [zł]",
        cel: "Z niego i z rocznej opłaty aplikacja liczy okres zwrotu.",
        gdzie: "Z oferty.",
        zakres: TWOJA_CENA,
      },
    },
  },
  "moc-umowna": {
    migawka: {
      oCoChodzi:
        "Ile kosztują przekroczenia mocy umownej i przy jakiej mocy umownej suma opłaty stałej i przekroczeń jest najniższa.",
      jakDziala:
        "Opłata za przekroczenie = składnik stały stawki sieciowej × suma 10 największych nadwyżek (pomiar 15-minutowy) albo × 10 × największa nadwyżka, gdy licznik nie pozwala na pierwszy wariant. Aplikacja sprawdza kolejne poziomy mocy umownej na Twoich 12 miesięcznych maksimach i wskazuje ten z najniższym kosztem łącznym.",
      poCo:
        "Za wysoka moc umowna to stały koszt co miesiąc; za niska — kosztowne przekroczenia. Optymalny poziom zwykle leży pomiędzy.",
    },
    pola: {
      grupa: {
        nazwa: "Grupa taryfowa",
        cel: "Od grupy zależy składnik stały stawki sieciowej.",
        gdzie: "Na fakturze.",
        zakres: "C11–C22b.",
      },
      moc: {
        nazwa: "Obecna moc umowna [kW]",
        cel: "Punkt odniesienia — z nim porównywany jest optymalny poziom.",
        gdzie: "Na fakturze albo w umowie.",
        zakres: "Twoja umowa.",
      },
      skladnikStaly: {
        nazwa: "Składnik stały stawki sieciowej [zł/kW/mies.] (opcjonalnie)",
        cel: "Cena każdego kW mocy umownej na miesiąc — i zarazem stawka za kW przekroczenia.",
        gdzie: "Z faktury. Puste pole = stawka z taryfy 2026 wybranego operatora.",
        zakres: Z_FAKTURY,
      },
      pomiar: {
        nazwa: "Sposób pomiaru przekroczeń",
        cel: "Suma 10 największych nadwyżek (licznik z pomiarem 15-minutowym) albo 10 × największa nadwyżka (gdy licznik tego nie pozwala).",
        gdzie: "Na fakturze albo zapytaj operatora. Przy „10 największych” bez tych 10 wartości aplikacja liczy górne oszacowanie.",
        zakres: "Jedna z dwóch opcji.",
      },
      maksMiesiac: {
        nazwa: "Maksymalna moc w miesiącu [kW]",
        cel: "Najwyższa moc pobrana w danym miesiącu. Z 12 takich wartości aplikacja szuka optymalnej mocy umownej.",
        gdzie: "Z faktur albo portalu pomiarowego operatora (moc maksymalna 15-minutowa).",
        zakres: "Twoje dane.",
      },
    },
  },
  "oplata-mocowa": {
    migawka: {
      oCoChodzi:
        "W firmie opłata mocowa jest liczona od energii pobranej w dni robocze 7:00–22:00. Ile daje przesunięcie części poboru poza te godziny?",
      jakDziala:
        "Aplikacja mnoży energię z godzin szczytu przez stawkę opłaty mocowej, a potem liczy to samo po przesunięciu wskazanego procentu poboru na noc albo weekend. Różnica to roczna oszczędność.",
      poCo:
        "Przesunięcie produkcji, ładowania aut, pompy ciepła z buforem albo użycie magazynu obniża opłatę bez zmniejszania zużycia.",
    },
    pola: {
      energiaRok: {
        nazwa: "Energia pobrana w roku [kWh]",
        cel: "Całe roczne zużycie — do pokazania udziału godzin szczytu.",
        gdzie: "Z faktur — suma za rok.",
        zakres: "Twoje dane.",
      },
      energiaSzczyt: {
        nazwa: "W tym w dni robocze 7:00–22:00 [kWh]",
        cel: "Energia, od której naliczana jest opłata mocowa.",
        gdzie: "Z faktury (pozycja opłaty mocowej) albo portalu pomiarowego operatora.",
        zakres: "Nie więcej niż całe roczne zużycie.",
      },
      przesuniecie: {
        nazwa: "Przesunięcie poza te godziny [%]",
        cel: "Jaką część poboru z godzin szczytu możesz przenieść na noc lub weekend.",
        gdzie: "Twoja ocena — które procesy mogą pracować w innych godzinach.",
        zakres: "0–100%.",
      },
      stawka: {
        nazwa: "Stawka opłaty mocowej z faktury [zł/kWh] (opcjonalnie)",
        cel: "Pozwala użyć stawki z Twojej faktury zamiast ogólnokrajowej stawki 2026 z aplikacji.",
        gdzie: "Na fakturze (pozycja „opłata mocowa”).",
        zakres: Z_FAKTURY,
      },
    },
  },
  "przelacznik-siec-wyspa": {
    migawka: {
      oCoChodzi:
        "Instalacja wyspowa ani agregat nie mogą nigdy podać napięcia do sieci — monter na „wyłączonej” linii może zginąć. Tu sprawdzisz, czy styk z siecią jest bezpieczny.",
      jakDziala:
        "Pytasz sam siebie o cztery rzeczy: jak instalacja styka się z siecią, jaki jest przełącznik, czy przełączany jest przewód N i czy praca równoległa jest zgłoszona. Przełączanie bez blokady albo brak przełącznika to czerwony stop. Praca równoległa z siecią wymaga zgłoszenia mikroinstalacji do operatora.",
      poCo:
        "To najgroźniejszy błąd przy częściowym off-gridzie i agregacie: napięcie zwrotne (backfeed) do sieci. Przełącznik sieć – 0 – wyspa z blokadą mechaniczną albo SZR z blokadą elektryczną i mechaniczną temu zapobiega.",
      fizyka:
        "Szczegóły normowe (HD 60364-5-551) nie są jeszcze w repozytorium — aplikacja pokazuje to wprost i nie wymyśla wymagań.",
    },
    pola: {
      tryb: {
        nazwa: "Sposób styku instalacji z siecią",
        cel: "Przełączana (sieć albo wyspa, bez synchronizacji), równoległa (falownik hybrydowy/sieciowy) albo bez sieci. Od tego zależą wymagania: przełącznik z blokadą albo zgłoszenie do operatora.",
        gdzie: "Z projektu instalacji albo instrukcji falownika.",
        zakres: "Jedna z trzech opcji.",
      },
      przelacznik: {
        nazwa: "Rodzaj przełącznika",
        cel: "Ręczny sieć – 0 – wyspa z blokadą mechaniczną albo SZR z blokadą elektryczną i mechaniczną wykluczają jednoczesne połączenie obu źródeł. Brak przełącznika albo przełącznik bez blokady — czerwony stop.",
        gdzie: "W rozdzielnicy — sprawdź opis aparatu albo zapytaj instalatora.",
        zakres: "Opcje z listy.",
      },
      przewodN: {
        nazwa: "Przełączanie przewodu N",
        cel: "Przełączane muszą być fazy i przewód neutralny N, zgodnie z układem sieci — inaczej część instalacji wyspowej pozostaje połączona z siecią.",
        gdzie: "Z opisu przełącznika (liczba torów, np. 4P w trójfazowym) albo od instalatora.",
        zakres: "Tak, nie albo nie wiem.",
      },
      zgloszenie: {
        nazwa: "Zgłoszenie mikroinstalacji do operatora",
        cel: "Praca równoległa z siecią (także „zero oddawania”) wymaga zgłoszenia mikroinstalacji do operatora i certyfikatu zgodności falownika.",
        gdzie: "Z dokumentów przyłączenia albo potwierdzenia od operatora.",
        zakres: "Tak albo nie.",
      },
    },
  },
  "rezygnacja-z-przylacza": {
    migawka: {
      oCoChodzi:
        "Siedem kroków rezygnacji z przyłącza w kolejności, która ma znaczenie. Kroki 1–4 możesz cofnąć, 5–7 już nie.",
      jakDziala:
        "Aplikacja prowadzi przez kroki: policz scenariusze i zimę, przetestuj system wyspowy przy wciąż podłączonej sieci przez pełną zimę, sprawdź formalności, wykorzystaj saldo prosumenckie — a dopiero potem wypowiedz umowy, demontaż licznika i archiwizacja dokumentów. Na dole liczy koszt powrotu: stawka opłaty przyłączeniowej × moc przyłączeniowa.",
      poCo:
        "Powrót do sieci to nowe przyłączenie — płatne i czasochłonne. Najważniejsza rada: zbuduj i przetestuj wyspę, zanim zrezygnujesz z sieci.",
      fizyka: "K_powrót ≈ stawka opłaty przyłączeniowej [zł/kW] × moc przyłączeniowa [kW] (odległość standardowa). Dalej — wycena indywidualna operatora.",
    },
    pola: {
      stawka: {
        nazwa: "Stawka opłaty przyłączeniowej [zł/kW]",
        cel: "Cena przyłączenia za każdy kW mocy — z niej liczony jest koszt powrotu do sieci.",
        gdzie: "Z taryfy operatora (przyłącze kablowe albo napowietrzne), netto.",
        zakres: "Wartość z taryfy operatora — aplikacja nie ma jej jeszcze w danych.",
      },
      moc: {
        nazwa: "Moc przyłączeniowa [kW]",
        cel: "Moc, jaką przyłącze ma zapewnić po powrocie.",
        gdzie: "Z umowy albo warunków przyłączenia.",
        zakres: "Twoja umowa.",
      },
      odleglosc: {
        nazwa: "Odległość od sieci",
        cel: "W standardowej odległości koszt liczy się ze stawki; dalej operator wycenia indywidualnie — aplikacja podaje wtedy tylko wzór.",
        gdzie: "Z taryfy operatora (definicja odległości standardowej) albo od operatora.",
        zakres: "W standardowej odległości albo dalej.",
      },
    },
  },
  "ryzyka-odlaczenia": {
    migawka: {
      oCoChodzi:
        "Dziesięć ryzyk pełnego odłączenia od sieci (scenariusz D), a dla firmy trzy kolejne. Każde odhaczasz, gdy je sprawdzisz.",
      jakDziala:
        "Lista obejmuje m.in.: nieodwracalność, zimę, awarię jedynego źródła, osoby zależne od sprzętu medycznego, pompę ciepła, formalności (bank, ubezpieczyciel, sprzedaż domu), bezpieczeństwo pożarowe, agregat (czad, hałas, paliwo), utratę rozliczeń i dotacji, wartość nieruchomości; dla firmy — ciągłość działania, umowy B2B, ubezpieczyciela i BHP. Znak przy pozycji mówi, na ile jest pewna.",
      poCo:
        "Pełne odłączenie jest praktycznie nieodwracalne. Lepiej sprawdzić każde ryzyko przed decyzją niż odkryć je w styczniu.",
    },
    pola: {},
  },
  "scenariusze-dom": {
    migawka: {
      oCoChodzi:
        "Cztery drogi obok siebie: A — sieć + PV, B — sieć + PV + magazyn, C — off-grid z siecią jako zapasem, D — pełne odłączenie.",
      jakDziala:
        "Dla każdego scenariusza aplikacja liczy koszt całkowity w horyzoncie (TCO): inwestycja − dotacja + koszty roczne (sieć, paliwo, serwis) + wymiany sprzętu − wartość końcowa. Pokazuje też koszt pierwszego roku, okres zwrotu względem A, godziny agregatu, wynik zimy i odwracalność. Ceny wpisujesz Ty; wzrost cen energii wybierasz w polu „Wzrost cen energii”.",
      poCo:
        "Żeby decyzja opierała się na liczbach, nie na haśle „niezależność”. Aplikacja nigdy nie daje jednego werdyktu „najlepszy” — osobno pokazuje najtańszy i najbardziej niezależny.",
      fizyka: "TCO_s(N) = I − D + Σ [K_sieć + K_paliwo + K_serwis] / (1+r)^t + Σ I_wym / (1+r)^t_wym − R(N) / (1+r)^N.",
    },
    pola: {},
  },
  "scenariusze-firma": {
    migawka: {
      oCoChodzi:
        "Te same cztery scenariusze co dla domu, z kontrolą ciągłości działania firmy: ile godzin firma zniesie bez zasilania i czy magazyn z agregatem to pokrywa.",
      jakDziala:
        "Koszt całkowity w horyzoncie (TCO) liczony jak dla domu, z cenami, które wpisujesz. Dodatkowo aplikacja porównuje dopuszczalny czas bez zasilania z tym, co pokryją magazyn i agregat (ryzyko RF1).",
      poCo:
        "W firmie przerwa w zasilaniu to straty (chłodnie, produkcja, serwery). Scenariusz tańszy na papierze może być nie do przyjęcia, jeśli nie zapewnia ciągłości.",
      fizyka: "TCO_s(N) = I − D + Σ [K_sieć + K_paliwo + K_serwis] / (1+r)^t + Σ I_wym / (1+r)^t_wym − R(N) / (1+r)^N.",
    },
    pola: {},
  },
  "pv-i-magazyn": {
    migawka: {
      oCoChodzi:
        "Ile PV i magazynu potrzeba, żeby uniezależnić się od sieci — miesiąc po miesiącu.",
      jakDziala:
        "Dla każdego miesiąca aplikacja liczy produkcję PV z nasłonecznienia Twojej lokalizacji, odejmuje autokonsumpcję bezpośrednią, przesuwa część nadwyżki przez magazyn (ze stratami) i pokazuje, ile nadal weźmiesz z sieci i ile do niej oddasz.",
      poCo:
        "Roczny bilans „na zero” nie oznacza niezależności: latem jest nadmiar, zimą brak. Widać to dopiero miesiąc po miesiącu.",
      fizyka: "E_sieć,m = max(0, E_zuż,m − E_PV,m·η − ΔE_mag,m).",
    },
    pola: {},
  },
  "pv-w-firmie": {
    migawka: {
      oCoChodzi:
        "Ile energii z paneli firma zużyje od razu, ile przesunie magazyn, a ile odda do sieci.",
      jakDziala:
        "Ten sam bilans miesięczny co dla domu: produkcja z Twojej lokalizacji, autokonsumpcja bezpośrednia, przesunięcie przez magazyn, pobór i oddawanie do sieci.",
      poCo:
        "W net-billingu energia oddana jest warta dużo mniej niż pobrana — im mniej oddajesz, tym lepiej. Firma, która pracuje w dzień, zwykle ma wysoką autokonsumpcję.",
      fizyka: "E_sieć,m = max(0, E_zuż,m − E_PV,m·η − ΔE_mag,m).",
    },
    pola: {},
  },
  "zima-bez-sieci": {
    migawka: {
      oCoChodzi:
        "Ta sama instalacja co na ekranie „Ile PV i magazynu”, ale bez sieci: czego zabraknie w grudniu i styczniu i kto to pokryje.",
      jakDziala:
        "Aplikacja liczy bilans każdego miesiąca bez sieci. Niedobór w najgorszym miesiącu musi pokryć agregat (godziny i paliwo) albo większa instalacja. Ujemny bilans styczniowy bez agregatu to czerwony stop dla pełnego odłączenia. Pełny stress-test zimowy robi Moduł 7.",
      poCo:
        "Zima to warunek konieczny scenariusza D. Stała „zima = x% lata” kłamie — liczy się grudzień i styczeń dla Twojej lokalizacji.",
    },
    pola: {},
  },
  "agregat-jako-zapas": {
    migawka: {
      oCoChodzi:
        "Ile godzin i paliwa potrzeba, żeby agregat pokrył niedobór najgorszego miesiąca bez sieci — i jak go bezpiecznie podłączyć.",
      jakDziala:
        "Niedobór energii z bilansu zimy dzielony jest przez moc agregatu — wychodzą godziny pracy, a z nich zużycie i koszt paliwa. Ten sam silnik co ekran „Agregat prądotwórczy” (Moduł 2), z tymi samymi pytaniami o bezpieczeństwo (czad, przełącznik).",
      poCo:
        "Agregat to realny koszt i obowiązek (paliwo, hałas, serwis). Ile godzin miesięcznie jesteś gotów to znosić — decyduje, czy pełne odłączenie ma sens.",
    },
    pola: {
      moc: {
        nazwa: "Moc agregatu [kW]",
        cel: "Z mocy i niedoboru energii liczone są godziny pracy.",
        gdzie: "Z tabliczki albo karty agregatu (moc ciągła, nie szczytowa).",
        zakres: "Z karty katalogowej agregatu.",
      },
      paliwo: {
        nazwa: "Zużycie paliwa przy obciążeniu 80% [l/h]",
        cel: "Z godzin pracy daje ilość i koszt paliwa.",
        gdzie: "Z karty katalogowej agregatu.",
        zakres: "Z karty katalogowej agregatu.",
      },
      cenaPaliwa: {
        nazwa: "Cena paliwa [zł/l]",
        cel: "Koszt litra paliwa.",
        gdzie: "Aktualna cena na stacji.",
        zakres: TWOJA_CENA,
      },
    },
  },
  dotacje: {
    migawka: {
      oCoChodzi: "Dotacje i ulgi dla domu — informacja ze stanem na dzień, nie porada.",
      jakDziala:
        "Każda pozycja ma datę stanu i znak pewności (✅ odczyt źródła, 🔎B jedno źródło albo wiedza ekspercka). Po terminie naboru pozycja sama zmienia się na „nabór zakończony”.",
      poCo:
        "Dotacja zmienia opłacalność scenariuszy. Uwaga: odłączenie od sieci w okresie trwałości projektu może oznaczać zwrot dotacji — sprawdź warunki przed decyzją.",
    },
    pola: {},
  },
  "dotacje-firma": {
    migawka: {
      oCoChodzi: "Nabory i ulgi dla firm — informacja ze stanem na dzień, nie porada.",
      jakDziala:
        "Każda pozycja ma datę stanu i znak pewności; po terminie naboru zmienia się na „nabór zakończony”. Programy dla osób fizycznych (magazyny przydomowe, ulga termomodernizacyjna) są w części „Dom”.",
      poCo: "Żeby uwzględnić dofinansowanie w porównaniu scenariuszy i nie przeoczyć warunków trwałości projektu.",
    },
    pola: {},
  },
  "faq-dom": {
    migawka: {
      oCoChodzi: "Najczęstsze pytania o rachunek, prosumenta, odłączenie i bezpieczeństwo — w krótkich odpowiedziach.",
      jakDziala: "Każda odpowiedź odsyła do kalkulatora, który liczy daną sprawę na Twoich danych.",
      poCo: "Szybka orientacja, zanim zaczniesz liczyć — i odpowiedzi na mity, które kosztują pieniądze.",
    },
    pola: {},
  },
  "faq-firma": {
    migawka: {
      oCoChodzi: "Najczęstsze pytania firm: taryfy C, moc bierna, opłata mocowa, net-billing, magazyny i licznik.",
      jakDziala:
        "Krótkie odpowiedzi z odnośnikami do kalkulatorów — poprawione względem materiału źródłowego tam, gdzie był błędny (np. wzór na moc bierną z pierwiastkiem).",
      poCo: "Szybka orientacja w kosztach energii firmy, zanim zaczniesz liczyć.",
    },
    pola: {},
  },
  "sciezka-przejscia": {
    migawka: {
      oCoChodzi: "Sześć kroków od rachunku za prąd do decyzji o odejściu od sieci.",
      jakDziala:
        "Każdy krok otwiera ekrany, które go liczą: rachunek i zużycie, prosument, PV i magazyn, scenariusze, zima i ryzyka, procedura. Twoje dane z jednego ekranu przechodzą dalej automatycznie, a postęp zapisuje się na tym urządzeniu.",
      poCo:
        "Kolejność ma znaczenie: najpierw poznaj koszty i zimę, potem decyduj. Przewodnik pilnuje, żeby żaden krok nie został pominięty.",
    },
    pola: {},
  },
}

// ————————————————————————————— EN —————————————————————————————

const Z_FAKTURY_EN = "the value from your invoice or contract — the app does not assume a typical value for you."
const TWOJA_CENA_EN = "Your price — the app does not guess prices of equipment, fuel or services."
const MIESIAC_ZUZYCIE_EN = {
  nazwa: "Energy use in the month [kWh]",
  cel: "Twelve consecutive months show when you use the most. The bill, the PV and storage balance, winter without the grid and the scenario comparison use these numbers.",
  gdzie: "From invoices (periodic settlements) or from your distribution operator's (DSO) metering portal — it shows use month by month.",
  zakres: "Your data — don't guess; usually more in winter, especially with a heat pump or electric heating.",
}

export const en: Tlumaczenie<typeof pl> = {
  "siec-osd": {
    pola: {
      osd: {
        nazwa: "Distribution system operator (DSO)",
        cel: "The company that delivers electricity through the grid to your meter (not the energy seller). It determines distribution rates: fixed and variable network charge, subscription fee, time zones.",
        gdzie: "On the invoice — in the “distribution” part or in the header (e.g. Tauron Dystrybucja, Energa-Operator, Stoen Operator, Enea Operator, PGE Dystrybucja).",
        zakres: "For some operators the 2026 rates are in the app (read from the tariff approved by URE); for others you enter them from the invoice.",
      },
    },
  },
  "siec-rachunek": {
    pola: {
      grupa: {
        nazwa: "Tariff group",
        cel: "Determines how distribution is charged and in which time zones you pay. Home: G11 (one price all day), G12/G12w/G12as/G13 (cheaper hours). Business: C11–C22b.",
        gdzie: "On the invoice or in the contract — usually next to the point of delivery number (PPE).",
        zakres: "Business: C11/C12a/C12b for contracted power up to 40 kW, C21/C22a/C22b above 40 kW. Not every operator offers every group.",
      },
      przylacze: {
        nazwa: "Connection type (single- or three-phase)",
        cel: "In G tariffs the fixed network charge depends on whether the connection is single- or three-phase.",
        gdzie: "On the invoice (“1-phase”/“3-phase” fixed charge), in the contract or on the meter (three phases = three phase conductors).",
        zakres: "Single-phase or three-phase.",
      },
      mocUmowna: {
        nazwa: "Contracted power [kW]",
        cel: "The power ordered from the operator. For businesses (C tariffs) the fixed network charge is based on it, and exceeding it costs extra. It also decides which C groups are available.",
        gdzie: "On the invoice or in the distribution contract.",
        zakres: "C11/C12a/C12b up to 40 kW, C21/C22a/C22b above 40 kW.",
      },
      rok: {
        nazwa: "Settlement year",
        cel: "Rates change every year (and sometimes during the year). The app uses the rates valid in that year.",
        gdzie: "The year you are calculating the bill for.",
        zakres: "The rates in the app are for 2026. For another year you enter them from the invoice.",
      },
      okres: {
        nazwa: "Billing period",
        cel: "How many months each settlement covers. The subscription fee depends on it.",
        gdzie: "On the invoice (“billing period”). A prosumer is billed every 1 month.",
        zakres: "1, 2, 6 or 12 months.",
      },
      zuzycieStrefy: {
        nazwa: "Annual energy use in the zone [kWh/year]",
        cel: "How much energy you draw in a given time zone (e.g. day/night). Multiplied by the energy price and the variable charges of that zone.",
        gdzie: "On the settlement invoice — use is split by zones. The sum of 12 months or the annual settlement.",
        zakres: "Your invoice data.",
      },
      cenaStrefy: {
        nazwa: "Active energy price in the zone [PLN/kWh net]",
        cel: "The energy sale price (the “sale” part, not “distribution”). For businesses always market-based, for homes from the seller's tariff or an offer.",
        gdzie: "On the invoice, in the energy sale part — the net price per kWh in the zone.",
        zakres: Z_FAKTURY_EN,
      },
      handlowa: {
        nazwa: "Seller's trading fee [PLN/month net]",
        cel: "A fixed monthly fee of the seller. You pay it regardless of use — it is part of the “cost of keeping the grid”.",
        gdzie: "On the invoice in the sale part. If there is none — enter 0.",
        zakres: Z_FAKTURY_EN,
      },
      energiaMocowa: {
        nazwa: "Energy drawn on working days 7:00–22:00 [kWh/year]",
        cel: "For businesses the capacity charge is calculated only on energy drawn in these hours. The smaller the share, the lower the charge.",
        gdzie: "On the invoice (capacity charge item) or in the operator's metering portal.",
        zakres: "No more than the whole annual use.",
      },
      siecZmienna: {
        nazwa: "Variable network charge in the zone [PLN/kWh]",
        cel: "The part of distribution that depends on use. It falls when you draw less from the grid (PV, storage).",
        gdzie: "On the invoice in the distribution part. The field is active when the app has no rates for your operator.",
        zakres: Z_FAKTURY_EN,
      },
      siecStala: {
        nazwa: "Fixed network charge",
        cel: "The part of distribution independent of use — you pay it as long as you have a connection. Home: PLN/month; business: PLN per kW of contracted power per month.",
        gdzie: "On the invoice in the distribution part (fixed component of the network rate).",
        zakres: Z_FAKTURY_EN,
      },
      abonament: {
        nazwa: "Subscription fee [PLN/month]",
        cel: "The operator's fee for reading and settling the meter. Fixed — part of the “cost of keeping the grid”.",
        gdzie: "On the invoice in the distribution part. It depends on the billing period.",
        zakres: Z_FAKTURY_EN,
      },
      jakosciowa: {
        nazwa: "Quality charge [PLN/kWh]",
        cel: "A charge for maintaining system quality, added to every kWh drawn from the grid.",
        gdzie: "On the invoice in the distribution part.",
        zakres: "A national rate set in the tariff — the app has the 2026 value.",
      },
      oze: {
        nazwa: "RES charge [PLN/kWh]",
        cel: "A charge supporting renewable sources, added to every kWh drawn from the grid.",
        gdzie: "On the invoice in the distribution part (often in PLN/MWh — divide by 1000).",
        zakres: "A national rate — the app has the 2026 value.",
      },
      kogeneracyjna: {
        nazwa: "Cogeneration charge [PLN/kWh]",
        cel: "A charge supporting high-efficiency cogeneration, added to every kWh drawn from the grid.",
        gdzie: "On the invoice in the distribution part (often in PLN/MWh — divide by 1000).",
        zakres: "A national rate — the app has the 2026 value.",
      },
      mocowa: {
        nazwa: "Capacity charge",
        cel: "A charge for maintaining national power reserves. Home: a monthly flat fee depending on the annual use threshold. Business: PLN for every kWh drawn on working days 7:00–22:00.",
        gdzie: "On the invoice (a separate “capacity charge” item).",
        zakres: "National rates from the URE President's announcement — the app has the 2026 values.",
      },
    },
  },
  "siec-wzrost-cen": {
    pola: {
      zrodlo: {
        nazwa: "Energy price growth — where it comes from",
        cel: "“Slider %” and “EU plans” are the price change above inflation — the result in today's zloty. “EU plans + inflation” shows the amounts to pay in the zloty of those years; the scenario ranking is still calculated in today's zloty. The app does not forecast prices itself — it shows sensitivity or an official projection.",
        gdzie: "“EU plans” = the European Commission's projection for Poland (EU Reference Scenario 2020). Note: it assumes policy as of end-2019, without the 2021–2023 crisis, Fit for 55 and ETS2 — a reference scenario, not a bill forecast.",
        zakres: "Slider: −3 / 0 / +5 / +10 %/year (0 = constant prices, default).",
      },
      inflacjaZrodlo: {
        nazwa: "Inflation source",
        cel: "With “EU plans + inflation” every running cost (energy, fuel, service, replacements) grows with inflation — otherwise generator scenarios would look artificially cheap.",
        gdzie: "The Statistics Poland (GUS) 15-year average (default), the NBP inflation target or your own value.",
        zakres: "The result below the field shows the values of both sources with their names.",
      },
      inflacjaWlasna: {
        nazwa: "Own inflation [%/year]",
        cel: "The average annual price growth you assume over the whole horizon.",
        gdzie: "Your assumption — compare with the GUS average and the NBP target.",
        zakres: "Your value.",
      },
    },
  },
  "siec-scenariusze": {
    pola: {
      horyzont: {
        nazwa: "Comparison horizon N [years]",
        cel: "For how many years the costs of each scenario are summed (total cost of ownership, TCO).",
        gdzie: "Your choice — usually as long as the installation is meant to last.",
        zakres: "10–25 years, default 15.",
      },
      stopa: {
        nazwa: "Discount rate r [%/year]",
        cel: "How much less a zloty spent in a few years is worth than today. 0 = simple mode: everything in today's zloty, no discounting.",
        gdzie: "Your choice — e.g. deposit or loan interest, if that is how you compare investments.",
        zakres: "0 in simple mode (default).",
      },
      cenaSieci: {
        nazwa: "“Cost of keeping the grid”, gross [PLN/year]",
        cel: "How much just having the connection costs per year: fixed charges (fixed network charge, subscription, trading fee, for homes also capacity) with VAT. PV and storage won't reduce it — it disappears only after disconnection.",
        gdzie: "Calculate it on the “My bill today” screen — an empty field takes the result from there.",
        zakres: "The result from your bill.",
      },
      kosztKwh: {
        nazwa: "Variable cost of 1 kWh from the grid, gross [PLN/kWh]",
        cel: "What you pay for each kWh drawn from the grid (energy + variable charges + VAT). This is what you save when PV and storage replace the grid.",
        gdzie: "From the “My bill today” screen — an empty field takes the result from there.",
        zakres: "The result from your bill.",
      },
      wartoscOddanej: {
        nazwa: "Value of 1 kWh exported to the grid [PLN/kWh]",
        cel: "How much surplus energy exported in net-billing is worth (it goes to the deposit). Usually much less than a kWh drawn — which is why self-consumption matters.",
        gdzie: "From the prosumer deposit screen (RCE/RCEm price × 1.23). If you export nothing — enter 0.",
        zakres: "The result from the deposit screen.",
      },
      zywotnosc: {
        nazwa: "Storage lifetime [years]",
        cel: "After this many years the storage must be replaced — the replacement cost enters the scenario, and the unused part of its life gives a residual value.",
        gdzie: "From the storage datasheet: number of cycles ÷ cycles per year, or the warranty period.",
        zakres: "From the storage datasheet.",
      },
      inwestycja: {
        nazwa: "Scenario investment [PLN]",
        cel: "What building the installation costs in this scenario (PV, storage, inverter, installation, switch, generator). Empty field = scenario left out of the comparison.",
        gdzie: "From installers' offers.",
        zakres: TWOJA_CENA_EN,
      },
      dotacja: {
        nazwa: "Subsidy [PLN]",
        cel: "Subtracted from the investment. Note: disconnecting from the grid during the project's durability period may mean repaying the subsidy.",
        gdzie: "From the grant agreement or the call conditions (“Subsidies” screen).",
        zakres: "Your amount.",
      },
      mocPv: {
        nazwa: "PV installation power [kWp]",
        cel: "From it and the insolation of your location, production is calculated month by month.",
        gdzie: "From the offer: total panel power (Wp) ÷ 1000.",
        zakres: "Your design.",
      },
      magazyn: {
        nazwa: "Storage capacity [kWh]",
        cel: "How much energy the storage shifts from day to evening and night. In scenario D, together with the generator, it covers winter.",
        gdzie: "From the offer or storage datasheet — usable capacity.",
        zakres: "Your design.",
      },
      kosztMagazynu: {
        nazwa: "Of which storage cost [PLN]",
        cel: "The part of the investment for the storage — what replacing it costs after its lifetime.",
        gdzie: "From the offer (storage item).",
        zakres: TWOJA_CENA_EN,
      },
      serwis: {
        nazwa: "Service [PLN/year]",
        cel: "Annual costs of inspections and upkeep of the installation in this scenario.",
        gdzie: "From a service offer or your own experience.",
        zakres: TWOJA_CENA_EN,
      },
      agregatMoc: {
        nazwa: "Generator power [kW]",
        cel: "The generator covers the winter energy shortfall in off-grid scenarios. 0 = scenario without a generator.",
        gdzie: "From the generator nameplate or datasheet (continuous power).",
        zakres: "From the generator datasheet.",
      },
      paliwoZuzycie: {
        nazwa: "Generator fuel consumption [l/h]",
        cel: "Together with operating hours it gives the annual fuel cost.",
        gdzie: "From the generator datasheet (at a load close to charging the storage).",
        zakres: "From the generator datasheet.",
      },
      paliwoCena: {
        nazwa: "Fuel price [PLN/l]",
        cel: "The cost of a litre of generator fuel.",
        gdzie: "The current price at the station.",
        zakres: TWOJA_CENA_EN,
      },
      progAgregatu: {
        nazwa: "My generator running threshold [h/month]",
        cel: "How many hours a month you accept the generator running (noise, fuel, service). Above this threshold scenario D is marked as risky.",
        gdzie: "Your decision.",
        zakres: "Your choice.",
      },
      medyczny: {
        nazwa: "Power-dependent medical equipment",
        cel: "An oxygen concentrator, medical equipment, a fridge with medicines (risk R4). With “yes” full disconnection requires a reliable backup — the app flags this clearly.",
        gdzie: "Your household situation.",
        zakres: "Yes or no.",
      },
      czasBezZasilania: {
        nazwa: "Acceptable time without power [h]",
        cel: "How many hours the business can bear without power (cold stores, production, servers) — risk RF1. Compared with what storage and the generator can cover.",
        gdzie: "From the business continuity assessment or customer and insurer requirements.",
        zakres: "Your business.",
      },
    },
  },
  "siec-pv-magazyn": {
    pola: {
      mocPv: {
        nazwa: "PV installation power [kWp]",
        cel: "From the power and the monthly yield of your location, the app calculates production in each month.",
        gdzie: "From the offer or existing installation: total panel power (Wp) ÷ 1000.",
        zakres: "Your design.",
      },
      autokonsumpcja: {
        nazwa: "Direct self-consumption [%]",
        cel: "What part of PV production is used immediately, at the moment of production. The rest goes to storage or the grid.",
        gdzie: "From the inverter monitoring (if you have PV) or your own estimate — typical operator profiles are not yet in the app.",
        zakres: "0–100%. Your value.",
      },
      magazyn: {
        nazwa: "Usable storage capacity [kWh]",
        cel: "How much of the daytime surplus the storage can shift to evening and night. Usable, i.e. after subtracting the reserve (DoD, Module 4).",
        gdzie: "From the storage datasheet (usable capacity) or capacity × DoD. 0 or empty = no storage.",
        zakres: "From the storage datasheet.",
      },
      sprawnosc: {
        nazwa: "Storage round-trip efficiency [%]",
        cel: "How much energy comes back out of the storage from what went in (battery and inverter losses).",
        gdzie: "From the storage and inverter datasheets (round-trip efficiency).",
        zakres: "0–100%, from the datasheet.",
      },
    },
  },
  "siec-uzysk-pv": {
    pola: {
      zrodlo: {
        nazwa: "Source of the PV yield",
        cel: "How many kWh 1 kWp gives in each month. From the location — the app calculates it from insolation (Modules 1 and 3); manually — you enter 12 values, e.g. from PVGIS.",
        gdzie: "You set the location in Module 1. Manual values — from the PVGIS calculator for your plot.",
        zakres: "From the location or 12 values manually.",
      },
      azymut: {
        nazwa: "Panel azimuth [°]",
        cel: "The direction the panels face. It affects production over the day and the year.",
        gdzie: "From the design or a compass. 0 = south, negative towards east, positive towards west.",
        zakres: "From −180° to 180°, 0 = south.",
      },
      nachylenie: {
        nazwa: "Panel tilt [°]",
        cel: "The angle of the panels from horizontal. Steeper panels give more in winter, less in summer.",
        gdzie: "From the design or measure with an inclinometer (0° = flat, 90° = vertical).",
        zakres: "0–90°.",
      },
      pr: {
        nazwa: "Performance ratio PR",
        cel: "What part of the theoretical production reaches the meter after losses (temperature, cables, inverter, soiling).",
        gdzie: "From the installer's design or the monitoring of an existing installation.",
        zakres: "0–1, your value.",
      },
      miesiac: {
        nazwa: "Yield in the month [kWh/kWp]",
        cel: "How many kWh 1 kWp gives in this month. Multiplied by the PV power.",
        gdzie: "From PVGIS (monthly production for 1 kWp) or from the monitoring of an existing installation.",
        zakres: "Your data — in winter several times less than in summer.",
      },
    },
  },
  "siec-zuzycie": {
    pola: { miesiac: MIESIAC_ZUZYCIE_EN },
  },
  "agregat-bezpieczenstwo": {
    pola: {
      miejsce: {
        nazwa: "Where the generator runs",
        cel: "Exhaust contains carbon monoxide (CO) — odourless and deadly. A generator inside a building (basement, attached garage, boiler room) is a red stop; a separate room with the exhaust led outside — a warning with a list of conditions; outdoors — information.",
        gdzie: "Choose where the generator actually stands while running.",
        zakres: "Outdoors, a separate technical room or inside the building.",
      },
      podlaczenie: {
        nazwa: "How the generator is connected",
        cel: "A generator connected to the building installation without a switch (e.g. with a plug into a socket) can feed voltage into the grid and kill a line worker on a “switched-off” line — red stop. A I–0–II changeover switch is always required when a generator feeds the building installation.",
        gdzie: "Check how the generator is connected: through a switch, directly into the installation, through the inverter's AC input, or only loads plugged into its sockets.",
        zakres: "Options on the list. Switch details — the “Grid/island switch and safety” screen.",
      },
    },
  },
  "rachunek-dom": {
    migawka: {
      oCoChodzi:
        "What your electricity bill consists of and how much of it you pay just for having the connection — the “cost of keeping the grid”.",
      jakDziala:
        "Bill = sale + distribution. The app splits it into a variable part (energy, variable network charges, quality, RES, cogeneration — they grow with every kWh) and a fixed part (fixed network charge, subscription, trading fee, for homes the flat capacity fee — you pay them as long as you have a contract and a meter). It takes the 2026 distribution rates from the operators' tariffs, and you enter missing ones from the invoice.",
      poCo:
        "This is the axis of the whole off-grid decision: PV and storage reduce only the variable part. The fixed part (“cost of keeping the grid”) disappears only after disconnection — and that is what you compare the cost of full independence with.",
      fizyka: "K_fixed,year = 12 · (fixed network charge + subscription + trading + capacity_G) · (1 + VAT).",
    },
    pola: {},
  },
  "rachunek-firma": {
    migawka: {
      oCoChodzi:
        "A business bill at low voltage (C11–C22b tariffs): energy, distribution, the capacity charge on use on working days 7–22 and a fixed cost depending on contracted power.",
      jakDziala:
        "The app adds up energy in zones (you enter the sale price from the invoice — for businesses it is always market-based), variable and national charges, the capacity charge on energy drawn on working days 7:00–22:00, and 12 × (contracted power × fixed component + subscription + trading fee). The 2026 distribution rates are in the app for some operators.",
      poCo:
        "To see which items can be reduced: by shifting consumption (capacity charge), correcting contracted power, compensating reactive power or own generation.",
      fizyka: "K_T = Σ E_z·(c_energy + c_net_var + c_quality + c_RES + c_cogen) + E_capacity·c_capacity + 12·(P_c·c_net_fix + c_sub + c_trade); gross × 1.23.",
    },
    pola: {},
  },
  "taryfa-g": {
    migawka: {
      oCoChodzi: "Which G tariff — G11, G12 or G12w — gives the lowest annual cost for your consumption.",
      jakDziala:
        "For each tariff the app calculates the full annual bill with the same consumption, spread over that tariff's zones: energy and variable charges in each zone plus fixed charges. It puts the results side by side.",
      poCo:
        "A two-zone tariff pays off only when its cheaper hours match when you really use electricity (e.g. heating water at night, charging a car, a heat pump with a buffer).",
    },
    pola: {},
  },
  "taryfy-c": {
    migawka: {
      oCoChodzi: "The annual cost in C11–C22b tariffs for your contracted power and consumption.",
      jakDziala:
        "For each group available at your contracted power the app calculates the full annual cost: energy in zones, variable and national charges, capacity charge, 12 × fixed charges. Groups not available for this power (C1x up to 40 kW, C2x above) are excluded from the comparison, not “considered worse”.",
      poCo: "Changing the tariff group is often the cheapest saving — without any investment.",
    },
    pola: {},
  },
  "zuzycie-miesieczne": {
    migawka: {
      oCoChodzi: "Your energy use over 12 consecutive months — the basis of all further calculations in this chapter.",
      jakDziala:
        "You enter use from invoices or from the operator's metering portal. The app saves it on this device and passes it on: to the bill, the PV and storage balance, winter without the grid and the scenario comparison.",
      poCo:
        "The annual average hides winter. Without a monthly breakdown you cannot honestly judge whether PV and storage will be enough in December and January.",
    },
    pola: {},
  },
  "depozyt-prosumencki": {
    migawka: {
      oCoChodzi:
        "How energy exported to the grid is settled (net-metering, net-billing) and what happens to the deposit when you terminate the contract.",
      jakDziala:
        "In net-billing the value of exported energy (quantity × RCEm or RCE price) goes to a deposit, increased by 1.23. The deposit is valid for 12 months; an unused deposit is refunded at most 20% (RCEm) or 30% (RCE), the rest expires. A negative RCE counts as 0. The app calculates the deposit, the refund and the real value of 1 kWh exported compared with a kWh drawn.",
      poCo:
        "Terminating the contract ends the settlements — the balance must be used first. It also shows why in net-billing it pays to use energy on site rather than export it.",
      fizyka: "RES Act (Journal of Laws 2026 item 68): deposit × 1.23 (Art. 4c(4)), refund 20%/30% (Art. 4(11a)), expiry after 12 months (Art. 4c(6)).",
    },
    pola: {
      miesiac: {
        nazwa: "Month of export",
        cel: "The 12-month validity of the deposit and the settlement prices of that month count from it.",
        gdzie: "From the seller's prosumer settlement.",
        zakres: "Month and year.",
      },
      energia: {
        nazwa: "Energy exported to the grid in this month [kWh]",
        cel: "The amount of surplus whose value goes to the deposit.",
        gdzie: "From the prosumer invoice or the operator's metering portal (energy fed in).",
        zakres: "Your data.",
      },
      cena: {
        nazwa: "Settlement price (RCE or RCEm)",
        cel: "RCEm — average monthly price; RCE — hourly price. Switching from RCEm to RCE is one-way. The refund limit (20% / 30%) also depends on the choice.",
        gdzie: "From the prosumer contract or the seller's settlement.",
        zakres: "RCE or RCEm.",
      },
      sredniaCena: {
        nazwa: "Average price of this energy [PLN/MWh]",
        cel: "The price at which energy exported in this month is valued.",
        gdzie: "From the seller's settlement or the PSE publication (RCEm / RCE).",
        zakres: "The value from the settlement or the PSE publication.",
      },
      wykorzystanie: {
        nazwa: "Deposit used within 12 months [PLN] (optional)",
        cel: "How much of the deposit you will use on bills within a year. From this the app calculates how much will be refunded and how much will expire.",
        gdzie: "Your estimate — when leaving the grid usually less than the whole deposit.",
        zakres: "From 0 to the deposit value.",
      },
      pelnyKoszt: {
        nazwa: "Full cost of 1 kWh drawn, gross [PLN/kWh] (optional)",
        cel: "Lets you calculate how much 1 kWh exported is really worth compared with a kWh drawn from the grid (balancing factor).",
        gdzie: "E.g. the average from the “My bill today” screen.",
        zakres: "The result from your bill.",
      },
    },
  },
  "test-licznika": {
    migawka: {
      oCoChodzi:
        "How much power the meter registers — you can check it yourself with the blinking LED. And if in doubt, the app prepares a complaint letter.",
      jakDziala:
        "The meter LED blinks once for each portion of energy; how many portions per kWh is given by the meter constant (imp/kWh). You count blinks over a measured time and the app converts it to power: P = 3600 · n / (t · constant). If you know which load is on (e.g. a 2000 W kettle), it compares the result with its power.",
      poCo:
        "To tell “the meter counts wrong” from “something in the house draws power”. The company has 14 days to respond to a complaint; a laboratory test of the meter is paid by the customer unless it shows irregularities.",
      fizyka: "P [kW] = 3600 · n / (t[s] · constant [imp/kWh]). Example: 15 pulses in 60 s with a constant of 1000 imp/kWh → 0.9 kW.",
    },
    pola: {
      impulsy: {
        nazwa: "Number of pulses (LED blinks)",
        cel: "How many times the meter LED blinked in the measured time.",
        gdzie: "Count the blinks of the LED on the meter (usually labelled “imp/kWh”), timing with a stopwatch.",
        zakres: "The more blinks you count, the more accurate the result — at least a dozen or so.",
      },
      czas: {
        nazwa: "Measurement time [s]",
        cel: "Over what time you counted the pulses. Together with the number of pulses it gives power.",
        gdzie: "A stopwatch on your phone.",
        zakres: "E.g. 60 s — a longer measurement is more accurate.",
      },
      stala: {
        nazwa: "Meter constant [imp/kWh]",
        cel: "How many pulses the LED gives per 1 kWh. Without it blinks cannot be converted to power.",
        gdzie: "Printed on the meter nameplate next to the LED (e.g. “1000 imp/kWh”).",
        zakres: "The value from the meter nameplate.",
      },
      mocOdbiornika: {
        nazwa: "Power of the switched-on load [W] (optional)",
        cel: "When only a known load runs during the test, the app compares its power with what the meter showed.",
        gdzie: "From the load's nameplate (e.g. a kettle, a heater). Switch off the rest of the house for the test.",
        zakres: "From the device nameplate.",
      },
      nadawca: {
        nazwa: "Name or company name",
        cel: "The sender of the complaint letter — as in the contract.",
        gdzie: "From the contract or invoice.",
        zakres: "Text. The data stays on this device.",
      },
      adres: {
        nazwa: "Address",
        cel: "The sender's address in the complaint letter.",
        gdzie: "The address from the contract.",
        zakres: "Text. The data stays on this device.",
      },
      nip: {
        nazwa: "Tax ID (NIP, business only)",
        cel: "Identifies the business in the letter. A private person leaves it empty.",
        gdzie: "From the invoice.",
        zakres: "10 digits or empty.",
      },
      numerKlienta: {
        nazwa: "Customer number",
        cel: "Lets the company find your contract quickly.",
        gdzie: "On the invoice.",
        zakres: "Text from the invoice.",
      },
      ppe: {
        nazwa: "Point of delivery number (PPE)",
        cel: "Unambiguously identifies the meter the complaint concerns.",
        gdzie: "On the invoice (point of delivery, PPE).",
        zakres: "Text from the invoice.",
      },
      faktura: {
        nazwa: "Invoice number and date",
        cel: "The invoice you are disputing.",
        gdzie: "From the invoice header.",
        zakres: "Text from the invoice.",
      },
      opis: {
        nazwa: "Description of the problem",
        cel: "Briefly, what happened and since when — with the LED test result, if you have it.",
        gdzie: "Your description, e.g. “Sudden rise in consumption after the meter was replaced”.",
        zakres: "Text.",
      },
      zadanie: {
        nazwa: "Request",
        cel: "What you expect from the company — by default verification of the metering system and correction of the invoice.",
        gdzie: "Keep the default or add your own.",
        zakres: "Text.",
      },
      miejscowosc: {
        nazwa: "Place and date",
        cel: "Where and when the letter was written.",
        gdzie: "Fill in before sending.",
        zakres: "Text.",
      },
    },
  },
  "moc-bierna": {
    migawka: {
      oCoChodzi:
        "How much a business pays for reactive energy above the allowed tgφ₀ and whether a capacitor bank that compensates it pays off.",
      jakDziala:
        "The charge for inductive excess is calculated as in the operators' 2026 tariffs: O = k · C_rk · (√((1 + tg²φ)/(1 + tg²φ₀)) − 1) · A. Capacitive energy is charged separately: k · C_rk · E_b. Compensation: bank power Q = P · (tgφ − tgφ_target); payback = bank cost ÷ annual charge.",
      poCo:
        "Motors, compressors and switch-mode power supplies draw reactive energy, which the operator may charge for. A capacitor bank often pays back quickly — but overcompensation also costs.",
      fizyka:
        "tgφ = reactive energy / active energy. The version of the formula without the square root (found in some materials) overstates the charge about twofold. k = 3 at low voltage.",
    },
    pola: {
      tgPhi: {
        nazwa: "Measured tgφ (average)",
        cel: "The ratio of reactive to active energy in your installation. The higher above tgφ₀, the higher the charge.",
        gdzie: "From the invoice (reactive energy ÷ active energy) or from a power analyser.",
        zakres: "Your data from the invoice or measurement.",
      },
      tgPhi0: {
        nazwa: "Contractual tgφ₀",
        cel: "The threshold above which reactive energy is charged.",
        gdzie: "From the contract or connection conditions.",
        zakres: "Usually 0.4 unless the contract says otherwise — never less than 0.2.",
      },
      energiaCzynna: {
        nazwa: "Active energy drawn [kWh/year]",
        cel: "The energy on which the reactive excess charge is calculated (A in the formula).",
        gdzie: "From invoices — the annual total.",
        zakres: "Your data.",
      },
      crk: {
        nazwa: "Price C_rk [PLN/kWh]",
        cel: "The electricity price announced by the URE President, valid on the day the tariff was approved — not the price of your energy. Without it the app shows only the excess factor.",
        gdzie: "From the reactive energy invoice or the operator's tariff.",
        zakres: "The value from the invoice — the app has no default.",
      },
      pojemnosciowa: {
        nazwa: "Capacitive reactive energy [kvarh/year] (optional)",
        cel: "Capacitive reactive energy is charged in full (without the tgφ₀ threshold) — often a result of overcompensation.",
        gdzie: "From the invoice (a separate item).",
        zakres: "Your data.",
      },
      mocSrednia: {
        nazwa: "Average active power during operation [kW]",
        cel: "Needed to size the capacitor bank (Q = P · (tgφ − tgφ_target)).",
        gdzie: "Active energy ÷ operating hours, or a power analyser reading.",
        zakres: "Your data.",
      },
      tgCel: {
        nazwa: "Target tgφ",
        cel: "The value you want to bring tgφ down to by compensation.",
        gdzie: "Your choice — with a margin below tgφ₀ but without overcompensation.",
        zakres: "Below tgφ₀.",
      },
      kosztBaterii: {
        nazwa: "Capacitor bank cost [PLN]",
        cel: "From it and the annual charge the app calculates the payback period.",
        gdzie: "From an offer.",
        zakres: TWOJA_CENA_EN,
      },
    },
  },
  "moc-umowna": {
    migawka: {
      oCoChodzi:
        "What exceeding contracted power costs and at which contracted power the sum of the fixed charge and excess charges is lowest.",
      jakDziala:
        "Excess charge = fixed component of the network rate × the sum of the 10 largest excesses (15-minute measurement), or × 10 × the largest excess when the meter does not allow the first variant. The app tests successive contracted power levels against your 12 monthly maxima and points to the one with the lowest total cost.",
      poCo:
        "Too high a contracted power is a fixed cost every month; too low — costly excesses. The optimum usually lies in between.",
    },
    pola: {
      grupa: {
        nazwa: "Tariff group",
        cel: "The fixed component of the network rate depends on the group.",
        gdzie: "On the invoice.",
        zakres: "C11–C22b.",
      },
      moc: {
        nazwa: "Current contracted power [kW]",
        cel: "The reference point — the optimum level is compared with it.",
        gdzie: "On the invoice or in the contract.",
        zakres: "Your contract.",
      },
      skladnikStaly: {
        nazwa: "Fixed component of the network rate [PLN/kW/month] (optional)",
        cel: "The price of each kW of contracted power per month — and also the rate per kW of excess.",
        gdzie: "From the invoice. Empty field = the 2026 tariff rate of the selected operator.",
        zakres: Z_FAKTURY_EN,
      },
      pomiar: {
        nazwa: "How excesses are measured",
        cel: "The sum of the 10 largest excesses (meter with 15-minute measurement) or 10 × the largest excess (when the meter does not allow that).",
        gdzie: "On the invoice, or ask the operator. With “10 largest” but without those 10 values, the app calculates an upper estimate.",
        zakres: "One of two options.",
      },
      maksMiesiac: {
        nazwa: "Maximum power in the month [kW]",
        cel: "The highest power drawn in the month. From 12 such values the app looks for the optimal contracted power.",
        gdzie: "From invoices or the operator's metering portal (15-minute maximum power).",
        zakres: "Your data.",
      },
    },
  },
  "oplata-mocowa": {
    migawka: {
      oCoChodzi:
        "For businesses the capacity charge is based on energy drawn on working days 7:00–22:00. What does shifting part of the consumption outside these hours give?",
      jakDziala:
        "The app multiplies the peak-hours energy by the capacity charge rate, then calculates the same after shifting the given percentage of consumption to night or weekend. The difference is the annual saving.",
      poCo:
        "Shifting production, car charging, a heat pump with a buffer or using storage lowers the charge without reducing consumption.",
    },
    pola: {
      energiaRok: {
        nazwa: "Energy drawn in the year [kWh]",
        cel: "The whole annual use — to show the share of peak hours.",
        gdzie: "From invoices — the annual total.",
        zakres: "Your data.",
      },
      energiaSzczyt: {
        nazwa: "Of which on working days 7:00–22:00 [kWh]",
        cel: "The energy on which the capacity charge is calculated.",
        gdzie: "From the invoice (capacity charge item) or the operator's metering portal.",
        zakres: "No more than the whole annual use.",
      },
      przesuniecie: {
        nazwa: "Shift outside these hours [%]",
        cel: "What part of peak-hour consumption you can move to night or weekend.",
        gdzie: "Your assessment — which processes can run at other times.",
        zakres: "0–100%.",
      },
      stawka: {
        nazwa: "Capacity charge rate from the invoice [PLN/kWh] (optional)",
        cel: "Lets you use the rate from your invoice instead of the app's national 2026 rate.",
        gdzie: "On the invoice (“capacity charge” item).",
        zakres: Z_FAKTURY_EN,
      },
    },
  },
  "przelacznik-siec-wyspa": {
    migawka: {
      oCoChodzi:
        "An island installation or a generator must never feed voltage into the grid — a line worker on a “switched-off” line can die. Here you check whether the contact with the grid is safe.",
      jakDziala:
        "You answer four questions: how the installation meets the grid, what the switch is, whether the N conductor is switched and whether parallel operation is notified. Switching without an interlock or no switch at all is a red stop. Parallel operation with the grid requires notifying the operator of the micro-installation.",
      poCo:
        "This is the most dangerous mistake with a partial off-grid and a generator: backfeed into the grid. A grid – 0 – island switch with a mechanical interlock or an ATS with electrical and mechanical interlocks prevents it.",
      fizyka:
        "The standard's details (HD 60364-5-551) are not yet in the repository — the app says so openly and does not invent requirements.",
    },
    pola: {
      tryb: {
        nazwa: "How the installation meets the grid",
        cel: "Switched (grid or island, without synchronisation), parallel (hybrid/grid-tie inverter) or without the grid. The requirements depend on it: a switch with an interlock or notification to the operator.",
        gdzie: "From the installation design or the inverter manual.",
        zakres: "One of three options.",
      },
      przelacznik: {
        nazwa: "Switch type",
        cel: "A manual grid – 0 – island switch with a mechanical interlock or an ATS with electrical and mechanical interlocks rules out connecting both sources at once. No switch or a switch without an interlock — red stop.",
        gdzie: "In the switchboard — check the device description or ask the installer.",
        zakres: "Options on the list.",
      },
      przewodN: {
        nazwa: "Switching of the N conductor",
        cel: "The phases and the neutral conductor N must be switched, according to the network system — otherwise part of the island installation stays connected to the grid.",
        gdzie: "From the switch description (number of poles, e.g. 4P in three-phase) or from the installer.",
        zakres: "Yes, no or don't know.",
      },
      zgloszenie: {
        nazwa: "Micro-installation notified to the operator",
        cel: "Parallel operation with the grid (also “zero export”) requires notifying the operator of the micro-installation and an inverter compliance certificate.",
        gdzie: "From the connection documents or confirmation from the operator.",
        zakres: "Yes or no.",
      },
    },
  },
  "rezygnacja-z-przylacza": {
    migawka: {
      oCoChodzi:
        "Seven steps to give up the grid connection, in an order that matters. Steps 1–4 can be undone, 5–7 cannot.",
      jakDziala:
        "The app guides you through the steps: calculate the scenarios and winter, test the island system with the grid still connected for a full winter, check the formalities, use up the prosumer balance — and only then terminate the contracts, meter removal and keeping the documents. At the bottom it calculates the cost of returning: connection fee rate × connection power.",
      poCo:
        "Returning to the grid means a new connection — paid and time-consuming. The most important advice: build and test the island before giving up the grid.",
      fizyka: "K_return ≈ connection fee rate [PLN/kW] × connection power [kW] (standard distance). Beyond it — the operator's individual quote.",
    },
    pola: {
      stawka: {
        nazwa: "Connection fee rate [PLN/kW]",
        cel: "The connection price per kW of power — the cost of returning to the grid is calculated from it.",
        gdzie: "From the operator's tariff (cable or overhead connection), net.",
        zakres: "The value from the operator's tariff — the app does not have it in its data yet.",
      },
      moc: {
        nazwa: "Connection power [kW]",
        cel: "The power the connection should provide after returning.",
        gdzie: "From the contract or connection conditions.",
        zakres: "Your contract.",
      },
      odleglosc: {
        nazwa: "Distance from the grid",
        cel: "Within the standard distance the cost is calculated from the rate; beyond it the operator quotes individually — the app then gives only the formula.",
        gdzie: "From the operator's tariff (definition of the standard distance) or from the operator.",
        zakres: "Within the standard distance or beyond.",
      },
    },
  },
  "ryzyka-odlaczenia": {
    migawka: {
      oCoChodzi:
        "Ten risks of full disconnection from the grid (scenario D), and three more for a business. You tick each one when you have checked it.",
      jakDziala:
        "The list covers, among others: irreversibility, winter, failure of the only source, people depending on medical equipment, a heat pump, formalities (bank, insurer, selling the house), fire safety, the generator (CO, noise, fuel), loss of settlements and subsidies, property value; for a business — continuity of operations, B2B contracts, the insurer and health and safety. The mark next to an item says how certain it is.",
      poCo:
        "Full disconnection is practically irreversible. Better to check every risk before deciding than to discover it in January.",
    },
    pola: {},
  },
  "scenariusze-dom": {
    migawka: {
      oCoChodzi:
        "Four paths side by side: A — grid + PV, B — grid + PV + storage, C — off-grid with the grid as a backup, D — full disconnection.",
      jakDziala:
        "For each scenario the app calculates the total cost over the horizon (TCO): investment − subsidy + annual costs (grid, fuel, service) + equipment replacements − residual value. It also shows the first-year cost, payback relative to A, generator hours, the winter result and reversibility. You enter the prices; you choose the energy price growth in the “Energy price growth” field.",
      poCo:
        "So that the decision rests on numbers, not on the slogan “independence”. The app never gives a single “best” verdict — it shows the cheapest and the most independent separately.",
      fizyka: "TCO_s(N) = I − D + Σ [K_grid + K_fuel + K_service] / (1+r)^t + Σ I_repl / (1+r)^t_repl − R(N) / (1+r)^N.",
    },
    pola: {},
  },
  "scenariusze-firma": {
    migawka: {
      oCoChodzi:
        "The same four scenarios as for a home, with a business continuity check: how many hours the business can bear without power and whether storage with a generator covers it.",
      jakDziala:
        "The total cost over the horizon (TCO) is calculated as for a home, with the prices you enter. In addition the app compares the acceptable time without power with what storage and the generator cover (risk RF1).",
      poCo:
        "For a business a power cut means losses (cold stores, production, servers). A scenario cheaper on paper may be unacceptable if it does not ensure continuity.",
      fizyka: "TCO_s(N) = I − D + Σ [K_grid + K_fuel + K_service] / (1+r)^t + Σ I_repl / (1+r)^t_repl − R(N) / (1+r)^N.",
    },
    pola: {},
  },
  "pv-i-magazyn": {
    migawka: {
      oCoChodzi: "How much PV and storage you need to become independent of the grid — month by month.",
      jakDziala:
        "For each month the app calculates PV production from the insolation of your location, subtracts direct self-consumption, shifts part of the surplus through storage (with losses) and shows how much you will still take from the grid and how much you will export.",
      poCo:
        "An annual “net zero” balance does not mean independence: in summer there is a surplus, in winter a shortfall. You only see it month by month.",
      fizyka: "E_grid,m = max(0, E_use,m − E_PV,m·η − ΔE_stor,m).",
    },
    pola: {},
  },
  "pv-w-firmie": {
    migawka: {
      oCoChodzi: "How much energy from the panels a business uses immediately, how much storage shifts and how much it exports to the grid.",
      jakDziala:
        "The same monthly balance as for a home: production from your location, direct self-consumption, shifting through storage, drawing from and exporting to the grid.",
      poCo:
        "In net-billing exported energy is worth much less than energy drawn — the less you export, the better. A business working during the day usually has high self-consumption.",
      fizyka: "E_grid,m = max(0, E_use,m − E_PV,m·η − ΔE_stor,m).",
    },
    pola: {},
  },
  "zima-bez-sieci": {
    migawka: {
      oCoChodzi:
        "The same installation as on the “How much PV and storage” screen, but without the grid: what will be missing in December and January and who will cover it.",
      jakDziala:
        "The app calculates the balance of each month without the grid. The shortfall in the worst month must be covered by a generator (hours and fuel) or a larger installation. A negative January balance without a generator is a red stop for full disconnection. The full winter stress test is done by Module 7.",
      poCo:
        "Winter is a necessary condition for scenario D. A constant “winter = x% of summer” lies — what counts is December and January for your location.",
    },
    pola: {},
  },
  "agregat-jako-zapas": {
    migawka: {
      oCoChodzi:
        "How many hours and how much fuel a generator needs to cover the shortfall of the worst month without the grid — and how to connect it safely.",
      jakDziala:
        "The energy shortfall from the winter balance is divided by the generator power — giving operating hours, and from them fuel consumption and cost. The same engine as the “Generator” screen (Module 2), with the same safety questions (CO, switch).",
      poCo:
        "A generator is a real cost and obligation (fuel, noise, service). How many hours a month you are willing to bear decides whether full disconnection makes sense.",
    },
    pola: {
      moc: {
        nazwa: "Generator power [kW]",
        cel: "From the power and the energy shortfall the operating hours are calculated.",
        gdzie: "From the generator nameplate or datasheet (continuous, not peak power).",
        zakres: "From the generator datasheet.",
      },
      paliwo: {
        nazwa: "Fuel consumption at 80% load [l/h]",
        cel: "With operating hours it gives the amount and cost of fuel.",
        gdzie: "From the generator datasheet.",
        zakres: "From the generator datasheet.",
      },
      cenaPaliwa: {
        nazwa: "Fuel price [PLN/l]",
        cel: "The cost of a litre of fuel.",
        gdzie: "The current price at the station.",
        zakres: TWOJA_CENA_EN,
      },
    },
  },
  dotacje: {
    migawka: {
      oCoChodzi: "Subsidies and tax reliefs for homes — information as of a date, not advice.",
      jakDziala:
        "Each item has a status date and a certainty mark (✅ read from the source, 🔎B a single source or expert knowledge). After the call deadline the item changes to “call closed” by itself.",
      poCo:
        "A subsidy changes the profitability of the scenarios. Note: disconnecting from the grid during the project's durability period may mean repaying the subsidy — check the conditions before deciding.",
    },
    pola: {},
  },
  "dotacje-firma": {
    migawka: {
      oCoChodzi: "Calls and reliefs for businesses — information as of a date, not advice.",
      jakDziala:
        "Each item has a status date and a certainty mark; after the call deadline it changes to “call closed”. Programmes for individuals (home storage, thermal modernisation relief) are in the “Home” part.",
      poCo: "To include funding in the scenario comparison and not overlook the project durability conditions.",
    },
    pola: {},
  },
  "faq-dom": {
    migawka: {
      oCoChodzi: "The most common questions about the bill, prosumers, disconnection and safety — in short answers.",
      jakDziala: "Each answer points to the calculator that works the matter out on your data.",
      poCo: "Quick orientation before you start calculating — and answers to myths that cost money.",
    },
    pola: {},
  },
  "faq-firma": {
    migawka: {
      oCoChodzi: "The most common business questions: C tariffs, reactive power, the capacity charge, net-billing, storage and the meter.",
      jakDziala:
        "Short answers with links to calculators — corrected against the source material where it was wrong (e.g. the reactive power formula with a square root).",
      poCo: "Quick orientation in a business's energy costs before you start calculating.",
    },
    pola: {},
  },
  "sciezka-przejscia": {
    migawka: {
      oCoChodzi: "Six steps from the electricity bill to the decision to leave the grid.",
      jakDziala:
        "Each step opens the screens that calculate it: bill and consumption, prosumer, PV and storage, scenarios, winter and risks, procedure. Your data from one screen passes on automatically, and progress is saved on this device.",
      poCo:
        "The order matters: first learn the costs and winter, then decide. The guide makes sure no step is skipped.",
    },
    pola: {},
  },
}

// ————————————————————————————— RU —————————————————————————————

const Z_FAKTURY_RU = "значение из вашего счёта или договора — приложение не подставляет типовое значение за вас."
const TWOJA_CENA_RU = "Ваша цена — приложение не угадывает цены оборудования, топлива и услуг."
const MIESIAC_ZUZYCIE_RU = {
  nazwa: "Потребление энергии за месяц [кВт·ч]",
  cel: "Двенадцать месяцев подряд показывают, когда вы потребляете больше всего. Эти числа используют счёт, баланс PV и накопителя, зима без сети и сравнение сценариев.",
  gdzie: "Из счетов (периодические расчёты) или из портала учёта вашего оператора (ОСР) — там потребление по месяцам.",
  zakres: "Ваши данные — не угадывайте; зимой обычно больше, особенно с тепловым насосом или электроотоплением.",
}

export const ru: Tlumaczenie<typeof pl> = {
  "siec-osd": {
    pola: {
      osd: {
        nazwa: "Оператор системы распределения (ОСР)",
        cel: "Компания, которая доставляет электроэнергию по сети до вашего счётчика (не продавец энергии). От неё зависят тарифы на распределение: постоянная и переменная сетевая плата, абонентская плата, временные зоны.",
        gdzie: "В счёте — в части «распределение» или в заголовке (например, Tauron Dystrybucja, Energa-Operator, Stoen Operator, Enea Operator, PGE Dystrybucja).",
        zakres: "Для части операторов ставки 2026 г. есть в приложении (из тарифа, утверждённого URE); для остальных вы вводите их из счёта.",
      },
    },
  },
  "siec-rachunek": {
    pola: {
      grupa: {
        nazwa: "Тарифная группа",
        cel: "Определяет, как считается распределение и в каких временных зонах вы платите. Дом: G11 (одна цена круглые сутки), G12/G12w/G12as/G13 (более дешёвые часы). Фирма: C11–C22b.",
        gdzie: "В счёте или договоре — обычно рядом с номером точки отбора (PPE).",
        zakres: "Фирма: C11/C12a/C12b при договорной мощности до 40 кВт, C21/C22a/C22b свыше 40 кВт. Не у каждого оператора есть каждая группа.",
      },
      przylacze: {
        nazwa: "Тип подключения (одно- или трёхфазное)",
        cel: "В тарифах G постоянная сетевая плата зависит от того, одно- или трёхфазное подключение.",
        gdzie: "В счёте (постоянная плата «1-фазная»/«3-фазная»), в договоре или на счётчике (три фазы = три фазных провода).",
        zakres: "Однофазное или трёхфазное.",
      },
      mocUmowna: {
        nazwa: "Договорная мощность [кВт]",
        cel: "Мощность, заказанная у оператора. Для фирмы (тарифы C) от неё считается постоянная сетевая плата, а её превышение стоит дополнительно. Она же определяет, какие группы C доступны.",
        gdzie: "В счёте или в договоре на распределение.",
        zakres: "C11/C12a/C12b до 40 кВт, C21/C22a/C22b свыше 40 кВт.",
      },
      rok: {
        nazwa: "Год расчёта",
        cel: "Ставки меняются каждый год (а иногда и в течение года). Приложение берёт ставки, действующие в этом году.",
        gdzie: "Год, за который вы считаете счёт.",
        zakres: "Ставки в приложении относятся к 2026 г. Для другого года вы вводите их из счёта.",
      },
      okres: {
        nazwa: "Расчётный период",
        cel: "Раз в сколько месяцев вы получаете расчёт. От него зависит абонентская плата.",
        gdzie: "В счёте («расчётный период»). Просьюмер рассчитывается раз в 1 месяц.",
        zakres: "1, 2, 6 или 12 месяцев.",
      },
      zuzycieStrefy: {
        nazwa: "Годовое потребление в зоне [кВт·ч/год]",
        cel: "Сколько энергии вы берёте в данной временной зоне (например, день/ночь). Умножается на цену энергии и переменные платы этой зоны.",
        gdzie: "В расчётном счёте — потребление разбито по зонам. Сумма за 12 месяцев или годовой расчёт.",
        zakres: "Ваши данные из счёта.",
      },
      cenaStrefy: {
        nazwa: "Цена активной энергии в зоне [зл/кВт·ч нетто]",
        cel: "Цена продажи энергии (часть «продажа», не «распределение»). Для фирмы всегда рыночная, для дома — по тарифу продавца или по предложению.",
        gdzie: "В счёте, в части продажи энергии — цена нетто за кВт·ч в данной зоне.",
        zakres: Z_FAKTURY_RU,
      },
      handlowa: {
        nazwa: "Торговая плата продавца [зл/мес. нетто]",
        cel: "Постоянная ежемесячная плата продавца. Вы платите её независимо от потребления — она входит в «цену содержания сети».",
        gdzie: "В счёте в части продажи. Если её нет — введите 0.",
        zakres: Z_FAKTURY_RU,
      },
      energiaMocowa: {
        nazwa: "Энергия, взятая в рабочие дни 7:00–22:00 [кВт·ч/год]",
        cel: "Для фирмы плата за мощность считается только от энергии, взятой в эти часы. Чем меньше доля, тем ниже плата.",
        gdzie: "В счёте (позиция платы за мощность) или в портале учёта оператора.",
        zakres: "Не больше всего годового потребления.",
      },
      siecZmienna: {
        nazwa: "Переменная сетевая плата в зоне [зл/кВт·ч]",
        cel: "Часть распределения, зависящая от потребления. Уменьшается, когда вы меньше берёте из сети (PV, накопитель).",
        gdzie: "В счёте в части распределения. Поле активно, когда в приложении нет ставок вашего оператора.",
        zakres: Z_FAKTURY_RU,
      },
      siecStala: {
        nazwa: "Постоянная сетевая плата",
        cel: "Часть распределения, не зависящая от потребления, — вы платите её, пока у вас есть подключение. Дом: зл/мес.; фирма: зл за каждый кВт договорной мощности в месяц.",
        gdzie: "В счёте в части распределения (постоянная составляющая сетевой ставки).",
        zakres: Z_FAKTURY_RU,
      },
      abonament: {
        nazwa: "Абонентская плата [зл/мес.]",
        cel: "Плата оператора за снятие показаний и расчёт счётчика. Постоянная — входит в «цену содержания сети».",
        gdzie: "В счёте в части распределения. Зависит от расчётного периода.",
        zakres: Z_FAKTURY_RU,
      },
      jakosciowa: {
        nazwa: "Ставка за качество [зл/кВт·ч]",
        cel: "Плата за поддержание качества системы, добавляемая к каждому кВт·ч из сети.",
        gdzie: "В счёте в части распределения.",
        zakres: "Общегосударственная ставка из тарифа — в приложении значение на 2026 г.",
      },
      oze: {
        nazwa: "Плата ВИЭ (OZE) [зл/кВт·ч]",
        cel: "Плата на поддержку возобновляемых источников, добавляемая к каждому кВт·ч из сети.",
        gdzie: "В счёте в части распределения (часто в зл/МВт·ч — разделите на 1000).",
        zakres: "Общегосударственная ставка — в приложении значение на 2026 г.",
      },
      kogeneracyjna: {
        nazwa: "Когенерационная плата [зл/кВт·ч]",
        cel: "Плата на поддержку высокоэффективной когенерации, добавляемая к каждому кВт·ч из сети.",
        gdzie: "В счёте в части распределения (часто в зл/МВт·ч — разделите на 1000).",
        zakres: "Общегосударственная ставка — в приложении значение на 2026 г.",
      },
      mocowa: {
        nazwa: "Плата за мощность",
        cel: "Плата на поддержание резервов мощности в стране. Дом: ежемесячный фиксированный платёж в зависимости от порога годового потребления. Фирма: зл за каждый кВт·ч, взятый в рабочие дни 7:00–22:00.",
        gdzie: "В счёте (отдельная позиция «плата за мощность»).",
        zakres: "Общегосударственные ставки из сообщения Председателя URE — в приложении значения на 2026 г.",
      },
    },
  },
  "siec-wzrost-cen": {
    pola: {
      zrodlo: {
        nazwa: "Рост цен на энергию — откуда его взять",
        cel: "«Ползунок %» и «Планы ЕС» — изменение цены сверх инфляции, результат в сегодняшних злотых. «Планы ЕС + инфляция» показывают суммы к оплате в злотых тех лет; рейтинг сценариев всё равно считается в сегодняшних злотых. Приложение само не прогнозирует цены — оно показывает чувствительность или официальную проекцию.",
        gdzie: "«Планы ЕС» = проекция Европейской комиссии для Польши (EU Reference Scenario 2020). Внимание: она исходит из политики конца 2019 г., без кризиса 2021–2023, Fit for 55 и ETS2 — это сценарий сравнения, а не прогноз счёта.",
        zakres: "Ползунок: −3 / 0 / +5 / +10 %/год (0 = постоянные цены, по умолчанию).",
      },
      inflacjaZrodlo: {
        nazwa: "Источник инфляции",
        cel: "При «Планы ЕС + инфляция» каждая текущая статья расходов (энергия, топливо, сервис, замены) растёт на инфляцию — иначе сценарии с генератором выглядели бы искусственно дешёвыми.",
        gdzie: "Среднее по данным GUS за последние 15 лет (по умолчанию), инфляционная цель NBP или собственное значение.",
        zakres: "Значения обоих источников показывает результат под полем, с названием источника.",
      },
      inflacjaWlasna: {
        nazwa: "Собственная инфляция [%/год]",
        cel: "Среднегодовой рост цен, который вы предполагаете на весь горизонт.",
        gdzie: "Ваше предположение — для сравнения посмотрите среднее GUS и цель NBP.",
        zakres: "Ваше значение.",
      },
    },
  },
  "siec-scenariusze": {
    pola: {
      horyzont: {
        nazwa: "Горизонт сравнения N [лет]",
        cel: "За сколько лет суммируются затраты каждого сценария (полная стоимость владения, TCO).",
        gdzie: "Ваш выбор — обычно столько, сколько должна прослужить установка.",
        zakres: "10–25 лет, по умолчанию 15.",
      },
      stopa: {
        nazwa: "Ставка дисконтирования r [%/год]",
        cel: "Насколько злотый, потраченный через несколько лет, стоит меньше, чем сегодня. 0 = простой режим: всё в сегодняшних злотых, без дисконтирования.",
        gdzie: "Ваш выбор — например, процент по вкладу или кредиту, если так вы сравниваете инвестиции.",
        zakres: "0 в простом режиме (по умолчанию).",
      },
      cenaSieci: {
        nazwa: "«Цена содержания сети» брутто [зл/год]",
        cel: "Сколько в год стоит само наличие подключения: постоянные платы (постоянная сетевая, абонентская, торговая, для дома также за мощность) с НДС. PV и накопитель её не уменьшат — она исчезает только после отключения.",
        gdzie: "Посчитайте на экране «Мой счёт сегодня» — пустое поле берёт результат оттуда.",
        zakres: "Результат из вашего счёта.",
      },
      kosztKwh: {
        nazwa: "Переменная стоимость 1 кВт·ч из сети, брутто [зл/кВт·ч]",
        cel: "Сколько вы платите за каждый кВт·ч из сети (энергия + переменные платы + НДС). Это вы экономите, когда PV и накопитель заменяют сеть.",
        gdzie: "С экрана «Мой счёт сегодня» — пустое поле берёт результат оттуда.",
        zakres: "Результат из вашего счёта.",
      },
      wartoscOddanej: {
        nazwa: "Стоимость 1 кВт·ч, отданного в сеть [зл/кВт·ч]",
        cel: "Сколько стоит излишек энергии, отданный в сеть при net-billing (идёт на депозит). Обычно намного меньше взятого кВт·ч — поэтому важно самопотребление.",
        gdzie: "С экрана депозита просьюмера (цена RCE/RCEm × 1,23). Если ничего не отдаёте — введите 0.",
        zakres: "Результат с экрана депозита.",
      },
      zywotnosc: {
        nazwa: "Срок службы накопителя [лет]",
        cel: "Через столько лет накопитель нужно заменить — стоимость замены входит в сценарий, а неиспользованная часть срока даёт остаточную стоимость.",
        gdzie: "Из документации накопителя: число циклов ÷ циклов в год или срок гарантии.",
        zakres: "Из документации накопителя.",
      },
      inwestycja: {
        nazwa: "Инвестиции в сценарий [зл]",
        cel: "Сколько стоит построить установку в этом сценарии (PV, накопитель, инвертор, монтаж, переключатель, генератор). Пустое поле = сценарий исключён из сравнения.",
        gdzie: "Из предложений монтажников.",
        zakres: TWOJA_CENA_RU,
      },
      dotacja: {
        nazwa: "Дотация [зл]",
        cel: "Вычитается из инвестиций. Внимание: отключение от сети в период обязательств по проекту может означать возврат дотации.",
        gdzie: "Из договора о финансировании или условий набора (экран «Дотации»).",
        zakres: "Ваша сумма.",
      },
      mocPv: {
        nazwa: "Мощность установки PV [кВт пик]",
        cel: "По ней и по инсоляции вашего места считается выработка по месяцам.",
        gdzie: "Из предложения: суммарная мощность панелей (Вт пик) ÷ 1000.",
        zakres: "Ваш проект.",
      },
      magazyn: {
        nazwa: "Ёмкость накопителя [кВт·ч]",
        cel: "Сколько энергии накопитель переносит с дня на вечер и ночь. В сценарии D вместе с генератором покрывает зиму.",
        gdzie: "Из предложения или документации накопителя — полезная ёмкость.",
        zakres: "Ваш проект.",
      },
      kosztMagazynu: {
        nazwa: "В том числе стоимость накопителя [зл]",
        cel: "Часть инвестиций, приходящаяся на накопитель, — столько стоит его замена по истечении срока службы.",
        gdzie: "Из предложения (позиция накопителя).",
        zakres: TWOJA_CENA_RU,
      },
      serwis: {
        nazwa: "Сервис [зл/год]",
        cel: "Годовые расходы на осмотры и содержание установки в этом сценарии.",
        gdzie: "Из сервисного предложения или собственного опыта.",
        zakres: TWOJA_CENA_RU,
      },
      agregatMoc: {
        nazwa: "Мощность генератора [кВт]",
        cel: "Генератор покрывает зимний дефицит энергии в сценариях off-grid. 0 = сценарий без генератора.",
        gdzie: "С таблички или из документации генератора (длительная мощность).",
        zakres: "Из документации генератора.",
      },
      paliwoZuzycie: {
        nazwa: "Расход топлива генератора [л/ч]",
        cel: "Вместе с часами работы даёт годовую стоимость топлива.",
        gdzie: "Из документации генератора (при нагрузке, близкой к зарядке накопителя).",
        zakres: "Из документации генератора.",
      },
      paliwoCena: {
        nazwa: "Цена топлива [зл/л]",
        cel: "Стоимость литра топлива для генератора.",
        gdzie: "Текущая цена на заправке.",
        zakres: TWOJA_CENA_RU,
      },
      progAgregatu: {
        nazwa: "Мой порог работы генератора [ч/мес.]",
        cel: "Сколько часов в месяц вы готовы терпеть работу генератора (шум, топливо, сервис). Выше этого порога сценарий D помечается как рискованный.",
        gdzie: "Ваше решение.",
        zakres: "Ваш выбор.",
      },
      medyczny: {
        nazwa: "Медицинское оборудование, зависящее от питания",
        cel: "Кислородный концентратор, медицинское оборудование, холодильник с лекарствами (риск R4). При «да» полное отключение от сети требует надёжного резерва — приложение это чётко отмечает.",
        gdzie: "Ваша домашняя ситуация.",
        zakres: "Да или нет.",
      },
      czasBezZasilania: {
        nazwa: "Допустимое время без питания [ч]",
        cel: "Сколько часов фирма выдержит без электричества (холодильные камеры, производство, серверы) — риск RF1. Сравнивается с тем, что покроют накопитель и генератор.",
        gdzie: "Из оценки непрерывности деятельности фирмы или требований клиентов и страховщика.",
        zakres: "Ваша фирма.",
      },
    },
  },
  "siec-pv-magazyn": {
    pola: {
      mocPv: {
        nazwa: "Мощность установки PV [кВт пик]",
        cel: "По мощности и месячной выработке вашего места приложение считает производство в каждом месяце.",
        gdzie: "Из предложения или существующей установки: суммарная мощность панелей (Вт пик) ÷ 1000.",
        zakres: "Ваш проект.",
      },
      autokonsumpcja: {
        nazwa: "Прямое самопотребление [%]",
        cel: "Какая часть выработки PV потребляется сразу, в момент производства. Остальное идёт в накопитель или в сеть.",
        gdzie: "Из мониторинга инвертора (если у вас есть PV) или ваша оценка — типовые профили операторов пока не внесены в приложение.",
        zakres: "0–100%. Ваше значение.",
      },
      magazyn: {
        nazwa: "Полезная ёмкость накопителя [кВт·ч]",
        cel: "Сколько дневного излишка накопитель может перенести на вечер и ночь. Полезная, т. е. за вычетом резерва (DoD, Модуль 4).",
        gdzie: "Из документации накопителя (usable capacity) или ёмкость × DoD. 0 или пусто = без накопителя.",
        zakres: "Из документации накопителя.",
      },
      sprawnosc: {
        nazwa: "КПД цикла накопителя [%]",
        cel: "Сколько энергии возвращается из накопителя из того, что в него вошло (потери батареи и инвертора).",
        gdzie: "Из документации накопителя и инвертора (round-trip efficiency).",
        zakres: "0–100%, из документации.",
      },
    },
  },
  "siec-uzysk-pv": {
    pola: {
      zrodlo: {
        nazwa: "Источник выработки PV",
        cel: "Сколько кВт·ч даёт 1 кВт пик в каждом месяце. По местоположению — приложение считает по инсоляции (Модули 1 и 3); вручную — вы вводите 12 значений, например из PVGIS.",
        gdzie: "Местоположение задаётся в Модуле 1. Значения вручную — из калькулятора PVGIS для вашего участка.",
        zakres: "По местоположению или 12 значений вручную.",
      },
      azymut: {
        nazwa: "Азимут панелей [°]",
        cel: "Направление, в которое смотрят панели. Влияет на выработку в течение дня и года.",
        gdzie: "Из проекта или по компасу. 0 = юг, отрицательные к востоку, положительные к западу.",
        zakres: "От −180° до 180°, 0 = юг.",
      },
      nachylenie: {
        nazwa: "Наклон панелей [°]",
        cel: "Угол панелей от горизонтали. Более крутые панели дают больше зимой и меньше летом.",
        gdzie: "Из проекта или измерьте угломером (0° = плоско, 90° = вертикально).",
        zakres: "0–90°.",
      },
      pr: {
        nazwa: "Коэффициент эффективности установки PR",
        cel: "Какая часть теоретической выработки доходит до счётчика после потерь (температура, кабели, инвертор, загрязнение).",
        gdzie: "Из проекта монтажника или из мониторинга существующей установки.",
        zakres: "0–1, ваше значение.",
      },
      miesiac: {
        nazwa: "Выработка за месяц [кВт·ч/кВт пик]",
        cel: "Сколько кВт·ч даёт 1 кВт пик в этом месяце. Умножается на мощность PV.",
        gdzie: "Из PVGIS (месячная выработка для 1 кВт пик) или из мониторинга существующей установки.",
        zakres: "Ваши данные — зимой в несколько раз меньше, чем летом.",
      },
    },
  },
  "siec-zuzycie": {
    pola: { miesiac: MIESIAC_ZUZYCIE_RU },
  },
  "agregat-bezpieczenstwo": {
    pola: {
      miejsce: {
        nazwa: "Место работы генератора",
        cel: "Выхлоп содержит угарный газ (CO) — без запаха и смертельный. Генератор в здании (подвал, пристроенный гараж, котельная) — красный стоп; отдельное помещение с выводом выхлопа наружу — предупреждение со списком условий; снаружи — информация.",
        gdzie: "Выберите место, где генератор фактически стоит во время работы.",
        zakres: "Снаружи, отдельное техническое помещение или в здании.",
      },
      podlaczenie: {
        nazwa: "Способ подключения генератора",
        cel: "Генератор, подключённый к электропроводке здания без переключателя (например, «вилкой» в розетку), может подать напряжение в сеть и убить монтёра на «отключённой» линии — красный стоп. Переключатель I–0–II обязателен всегда, когда генератор питает проводку здания.",
        gdzie: "Проверьте, как подключён генератор: через переключатель, напрямую в проводку, через вход AC инвертора или только потребители, включённые в его розетки.",
        zakres: "Варианты из списка. Подробности о переключателе — экран «Переключатель сеть/остров и безопасность».",
      },
    },
  },
  "rachunek-dom": {
    migawka: {
      oCoChodzi:
        "Из чего состоит ваш счёт за электричество и сколько из него вы платите за само наличие подключения — «цену содержания сети».",
      jakDziala:
        "Счёт = продажа + распределение. Приложение делит его на переменную часть (энергия, переменные сетевые платы, за качество, ВИЭ, когенерационная — растут с каждым кВт·ч) и постоянную (постоянная сетевая плата, абонентская, торговая, для дома — фиксированная плата за мощность — вы платите их, пока есть договор и счётчик). Ставки распределения 2026 г. берутся из тарифов операторов, недостающие вы вводите из счёта.",
      poCo:
        "Это ось всего решения о переходе на off-grid: PV и накопитель снижают только переменную часть. Постоянная часть («цена содержания сети») исчезает только после отключения — именно с ней вы сравниваете стоимость полной независимости.",
      fizyka: "K_пост,год = 12 · (постоянная сетевая + абонентская + торговая + за мощность_G) · (1 + НДС).",
    },
    pola: {},
  },
  "rachunek-firma": {
    migawka: {
      oCoChodzi:
        "Счёт фирмы на низком напряжении (тарифы C11–C22b): энергия, распределение, плата за мощность за потребление в рабочие дни 7–22 и постоянные затраты, зависящие от договорной мощности.",
      jakDziala:
        "Приложение суммирует энергию по зонам (цену продажи вы вводите из счёта — для фирмы она всегда рыночная), переменные и общегосударственные платы, плату за мощность от энергии, взятой в рабочие дни 7:00–22:00, и 12 × (договорная мощность × постоянная составляющая + абонентская + торговая). Ставки распределения 2026 г. есть в приложении для части операторов.",
      poCo:
        "Чтобы увидеть, какие позиции можно снизить: переносом потребления (плата за мощность), корректировкой договорной мощности, компенсацией реактивной мощности или собственной выработкой.",
      fizyka: "K_T = Σ E_z·(c_энергия + c_сеть_пер + c_качество + c_ВИЭ + c_коген) + E_мощн·c_мощн + 12·(P_д·c_сеть_пост + c_абон + c_торг); брутто × 1,23.",
    },
    pola: {},
  },
  "taryfa-g": {
    migawka: {
      oCoChodzi: "Какой тариф G — G11, G12 или G12w — даст наименьшую годовую стоимость при вашем потреблении.",
      jakDziala:
        "Для каждого тарифа приложение считает полный годовой счёт при том же потреблении, распределённом по зонам этого тарифа: энергия и переменные платы в каждой зоне плюс постоянные платы. Результаты ставит рядом.",
      poCo:
        "Двухзонный тариф выгоден, только если его дешёвые часы совпадают с тем, когда вы действительно потребляете электроэнергию (например, нагрев воды ночью, зарядка авто, тепловой насос с буфером).",
    },
    pola: {},
  },
  "taryfy-c": {
    migawka: {
      oCoChodzi: "Годовая стоимость в тарифах C11–C22b при вашей договорной мощности и потреблении.",
      jakDziala:
        "Для каждой группы, доступной при вашей договорной мощности, приложение считает полную годовую стоимость: энергия по зонам, переменные и общегосударственные платы, плата за мощность, 12 × постоянные платы. Группы, недоступные для этой мощности (C1x до 40 кВт, C2x выше), исключаются из сравнения, а не «считаются хуже».",
      poCo: "Смена тарифной группы — часто самая дешёвая экономия, без каких-либо инвестиций.",
    },
    pola: {},
  },
  "zuzycie-miesieczne": {
    migawka: {
      oCoChodzi: "Ваше потребление энергии за 12 месяцев подряд — основа всех дальнейших расчётов этого раздела.",
      jakDziala:
        "Вы вводите потребление из счетов или из портала учёта оператора. Приложение сохраняет его на этом устройстве и передаёт дальше: в счёт, баланс PV и накопителя, зиму без сети и сравнение сценариев.",
      poCo:
        "Среднегодовое значение скрывает зиму. Без разбивки по месяцам нельзя честно оценить, хватит ли PV и накопителя в декабре и январе.",
    },
    pola: {},
  },
  "depozyt-prosumencki": {
    migawka: {
      oCoChodzi:
        "Как рассчитывается энергия, отданная в сеть (net-metering, net-billing), и что происходит с депозитом при расторжении договора.",
      jakDziala:
        "При net-billing стоимость отданной энергии (количество × цена RCEm или RCE) идёт на депозит, увеличенный на 1,23. Депозит действует 12 месяцев; неиспользованный возвращается максимум на 20% (RCEm) или 30% (RCE), остальное сгорает. Отрицательная RCE считается как 0. Приложение считает депозит, возврат и реальную стоимость 1 кВт·ч отданного по сравнению со взятым.",
      poCo:
        "Расторжение договора завершает расчёты — сначала нужно использовать сальдо. И видно, почему при net-billing выгодно потреблять энергию на месте, а не отдавать.",
      fizyka: "Закон о ВИЭ (Dz.U. 2026 поз. 68): депозит × 1,23 (ст. 4c п. 4), возврат 20%/30% (ст. 4 п. 11a), списание через 12 мес. (ст. 4c п. 6).",
    },
    pola: {
      miesiac: {
        nazwa: "Месяц отдачи энергии",
        cel: "От него считается 12-месячный срок действия депозита и цены расчёта этого месяца.",
        gdzie: "Из расчёта просьюмера у продавца.",
        zakres: "Месяц и год.",
      },
      energia: {
        nazwa: "Энергия, отданная в сеть в этом месяце [кВт·ч]",
        cel: "Количество излишка, стоимость которого идёт на депозит.",
        gdzie: "Из счёта просьюмера или портала учёта оператора (отданная энергия).",
        zakres: "Ваши данные.",
      },
      cena: {
        nazwa: "Цена расчёта (RCE или RCEm)",
        cel: "RCEm — средняя месячная цена; RCE — почасовая. Переход с RCEm на RCE односторонний. От выбора зависит и лимит возврата (20% / 30%).",
        gdzie: "Из договора просьюмера или расчёта продавца.",
        zakres: "RCE или RCEm.",
      },
      sredniaCena: {
        nazwa: "Средняя цена этой энергии [зл/МВт·ч]",
        cel: "Цена, по которой оценивается энергия, отданная в этом месяце.",
        gdzie: "Из расчёта продавца или публикации PSE (RCEm / RCE).",
        zakres: "Значение из расчёта или публикации PSE.",
      },
      wykorzystanie: {
        nazwa: "Использование депозита за 12 месяцев [зл] (необязательно)",
        cel: "Сколько депозита вы используете на счета в течение года. Отсюда приложение считает, сколько вернут и сколько сгорит.",
        gdzie: "Ваша оценка — при уходе из сети обычно меньше всего депозита.",
        zakres: "От 0 до суммы депозита.",
      },
      pelnyKoszt: {
        nazwa: "Полная стоимость 1 кВт·ч из сети, брутто [зл/кВт·ч] (необязательно)",
        cel: "Позволяет посчитать, сколько реально стоит 1 кВт·ч отданный по сравнению с кВт·ч, взятым из сети (коэффициент балансирования).",
        gdzie: "Например, среднее с экрана «Мой счёт сегодня».",
        zakres: "Результат из вашего счёта.",
      },
    },
  },
  "test-licznika": {
    migawka: {
      oCoChodzi:
        "Какую мощность регистрирует счётчик — вы проверите это сами по мигающему светодиоду. А при сомнениях приложение подготовит письмо-рекламацию.",
      jakDziala:
        "Светодиод счётчика мигает один раз на каждую порцию энергии; сколько порций на кВт·ч — говорит постоянная счётчика (имп/кВт·ч). Вы считаете вспышки за измеренное время, а приложение пересчитывает это в мощность: P = 3600 · n / (t · постоянная). Если вы знаете, какой потребитель включён (например, чайник 2000 Вт), оно сравнит результат с его мощностью.",
      poCo:
        "Чтобы отличить «счётчик считает неправильно» от «что-то в доме потребляет ток». У компании 14 дней на ответ на рекламацию; лабораторную проверку счётчика оплачивает потребитель, если она не выявит нарушений.",
      fizyka: "P [кВт] = 3600 · n / (t[с] · постоянная [имп/кВт·ч]). Пример: 15 импульсов за 60 с при постоянной 1000 имп/кВт·ч → 0,9 кВт.",
    },
    pola: {
      impulsy: {
        nazwa: "Число импульсов (вспышек светодиода)",
        cel: "Сколько раз мигнул светодиод счётчика за измеренное время.",
        gdzie: "Посчитайте вспышки светодиода на счётчике (обычно подписан «imp/kWh»), засекая время секундомером.",
        zakres: "Чем больше вспышек вы посчитаете, тем точнее результат — не меньше десятка-полутора.",
      },
      czas: {
        nazwa: "Время измерения [с]",
        cel: "За какое время вы посчитали импульсы. Вместе с их числом даёт мощность.",
        gdzie: "Секундомер в телефоне.",
        zakres: "Например, 60 с — более долгое измерение точнее.",
      },
      stala: {
        nazwa: "Постоянная счётчика [имп/кВт·ч]",
        cel: "Сколько импульсов светодиод даёт на 1 кВт·ч. Без неё нельзя пересчитать вспышки в мощность.",
        gdzie: "Напечатана на табличке счётчика рядом со светодиодом (например, «1000 imp/kWh»).",
        zakres: "Значение с таблички счётчика.",
      },
      mocOdbiornika: {
        nazwa: "Мощность включённого потребителя [Вт] (необязательно)",
        cel: "Когда во время теста работает только известный потребитель, приложение сравнит его мощность с показанием счётчика.",
        gdzie: "С таблички потребителя (например, чайник, обогреватель). Остальное в доме на время теста выключите.",
        zakres: "С таблички устройства.",
      },
      nadawca: {
        nazwa: "Имя и фамилия или название фирмы",
        cel: "Отправитель письма-рекламации — как в договоре.",
        gdzie: "Из договора или счёта.",
        zakres: "Текст. Данные остаются на этом устройстве.",
      },
      adres: {
        nazwa: "Адрес",
        cel: "Адрес отправителя в письме-рекламации.",
        gdzie: "Адрес из договора.",
        zakres: "Текст. Данные остаются на этом устройстве.",
      },
      nip: {
        nazwa: "NIP (только для фирмы)",
        cel: "Идентифицирует фирму в письме. Частное лицо оставляет пустым.",
        gdzie: "Из счёта.",
        zakres: "10 цифр или пусто.",
      },
      numerKlienta: {
        nazwa: "Номер клиента",
        cel: "Позволяет быстро найти ваш договор.",
        gdzie: "В счёте.",
        zakres: "Текст из счёта.",
      },
      ppe: {
        nazwa: "Номер точки отбора энергии (PPE)",
        cel: "Однозначно указывает счётчик, к которому относится рекламация.",
        gdzie: "В счёте (точка отбора энергии, PPE).",
        zakres: "Текст из счёта.",
      },
      faktura: {
        nazwa: "Номер и дата счёта",
        cel: "Счёт, который вы оспариваете.",
        gdzie: "Из заголовка счёта.",
        zakres: "Текст из счёта.",
      },
      opis: {
        nazwa: "Описание проблемы",
        cel: "Коротко: что произошло и с какого времени — с результатом теста светодиода, если он есть.",
        gdzie: "Ваше описание, например «Резкий рост потребления после замены счётчика».",
        zakres: "Текст.",
      },
      zadanie: {
        nazwa: "Требование",
        cel: "Чего вы ожидаете от компании — по умолчанию проверки системы учёта и корректировки счёта.",
        gdzie: "Оставьте по умолчанию или допишите своё.",
        zakres: "Текст.",
      },
      miejscowosc: {
        nazwa: "Населённый пункт и дата",
        cel: "Место и дата составления письма.",
        gdzie: "Заполните перед отправкой.",
        zakres: "Текст.",
      },
    },
  },
  "moc-bierna": {
    migawka: {
      oCoChodzi:
        "Сколько фирма платит за реактивную энергию сверх допустимого tgφ₀ и окупится ли конденсаторная батарея, которая её скомпенсирует.",
      jakDziala:
        "Плата за индуктивный избыток считается как в тарифах операторов 2026 г.: O = k · C_rk · (√((1 + tg²φ)/(1 + tg²φ₀)) − 1) · A. Ёмкостная энергия оплачивается отдельно: k · C_rk · E_b. Компенсация: мощность батареи Q = P · (tgφ − tgφ_цель); окупаемость = стоимость батареи ÷ годовая плата.",
      poCo:
        "Двигатели, компрессоры и импульсные блоки питания потребляют реактивную энергию, за которую оператор может начислять плату. Конденсаторная батарея часто окупается быстро — но перекомпенсация тоже стоит денег.",
      fizyka:
        "tgφ = реактивная энергия / активная энергия. Вариант формулы без корня (встречается в материалах) завышает плату примерно вдвое. k = 3 на низком напряжении.",
    },
    pola: {
      tgPhi: {
        nazwa: "Измеренный tgφ (средний)",
        cel: "Отношение реактивной энергии к активной в вашей установке. Чем выше tgφ₀, тем выше плата.",
        gdzie: "Из счёта (реактивная энергия ÷ активная) или с анализатора сети.",
        zakres: "Ваши данные из счёта или измерения.",
      },
      tgPhi0: {
        nazwa: "Договорной tgφ₀",
        cel: "Порог, выше которого реактивная энергия оплачивается.",
        gdzie: "Из договора или условий подключения.",
        zakres: "Обычно 0,4, если договор не говорит иначе, — никогда не меньше 0,2.",
      },
      energiaCzynna: {
        nazwa: "Потреблённая активная энергия [кВт·ч/год]",
        cel: "Энергия, от которой начисляется плата за реактивный избыток (A в формуле).",
        gdzie: "Из счетов — сумма за год.",
        zakres: "Ваши данные.",
      },
      crk: {
        nazwa: "Цена C_rk [зл/кВт·ч]",
        cel: "Цена электроэнергии, объявляемая Председателем URE и действующая на день утверждения тарифа, — это не цена вашей энергии. Без неё приложение покажет только коэффициент избытка.",
        gdzie: "Из счёта за реактивную энергию или тарифа оператора.",
        zakres: "Значение из счёта — в приложении нет значения по умолчанию.",
      },
      pojemnosciowa: {
        nazwa: "Ёмкостная реактивная энергия [квар·ч/год] (необязательно)",
        cel: "Ёмкостная реактивная энергия оплачивается полностью (без порога tgφ₀) — часто следствие перекомпенсации.",
        gdzie: "Из счёта (отдельная позиция).",
        zakres: "Ваши данные.",
      },
      mocSrednia: {
        nazwa: "Средняя активная мощность во время работы [кВт]",
        cel: "Нужна для подбора мощности конденсаторной батареи (Q = P · (tgφ − tgφ_цель)).",
        gdzie: "Активная энергия ÷ часы работы или показания анализатора.",
        zakres: "Ваши данные.",
      },
      tgCel: {
        nazwa: "Целевой tgφ",
        cel: "До какого значения вы хотите снизить tgφ компенсацией.",
        gdzie: "Ваш выбор — с запасом ниже tgφ₀, но без перекомпенсации.",
        zakres: "Ниже tgφ₀.",
      },
      kosztBaterii: {
        nazwa: "Стоимость конденсаторной батареи [зл]",
        cel: "По ней и годовой плате приложение считает срок окупаемости.",
        gdzie: "Из предложения.",
        zakres: TWOJA_CENA_RU,
      },
    },
  },
  "moc-umowna": {
    migawka: {
      oCoChodzi:
        "Сколько стоят превышения договорной мощности и при какой договорной мощности сумма постоянной платы и превышений наименьшая.",
      jakDziala:
        "Плата за превышение = постоянная составляющая сетевой ставки × сумма 10 наибольших превышений (15-минутное измерение) или × 10 × наибольшее превышение, если счётчик не позволяет первый вариант. Приложение проверяет последовательные уровни договорной мощности на ваших 12 месячных максимумах и указывает уровень с наименьшими общими затратами.",
      poCo:
        "Слишком высокая договорная мощность — постоянные расходы каждый месяц; слишком низкая — дорогие превышения. Оптимум обычно посередине.",
    },
    pola: {
      grupa: {
        nazwa: "Тарифная группа",
        cel: "От группы зависит постоянная составляющая сетевой ставки.",
        gdzie: "В счёте.",
        zakres: "C11–C22b.",
      },
      moc: {
        nazwa: "Текущая договорная мощность [кВт]",
        cel: "Точка отсчёта — с ней сравнивается оптимальный уровень.",
        gdzie: "В счёте или договоре.",
        zakres: "Ваш договор.",
      },
      skladnikStaly: {
        nazwa: "Постоянная составляющая сетевой ставки [зл/кВт/мес.] (необязательно)",
        cel: "Цена каждого кВт договорной мощности в месяц — и одновременно ставка за кВт превышения.",
        gdzie: "Из счёта. Пустое поле = ставка из тарифа 2026 г. выбранного оператора.",
        zakres: Z_FAKTURY_RU,
      },
      pomiar: {
        nazwa: "Способ измерения превышений",
        cel: "Сумма 10 наибольших превышений (счётчик с 15-минутным измерением) или 10 × наибольшее превышение (если счётчик это не позволяет).",
        gdzie: "В счёте или спросите оператора. При «10 наибольших» без этих 10 значений приложение считает верхнюю оценку.",
        zakres: "Один из двух вариантов.",
      },
      maksMiesiac: {
        nazwa: "Максимальная мощность за месяц [кВт]",
        cel: "Наибольшая мощность, взятая в данном месяце. По 12 таким значениям приложение ищет оптимальную договорную мощность.",
        gdzie: "Из счетов или портала учёта оператора (15-минутная максимальная мощность).",
        zakres: "Ваши данные.",
      },
    },
  },
  "oplata-mocowa": {
    migawka: {
      oCoChodzi:
        "Для фирмы плата за мощность считается от энергии, взятой в рабочие дни 7:00–22:00. Что даёт перенос части потребления за пределы этих часов?",
      jakDziala:
        "Приложение умножает энергию часов пик на ставку платы за мощность, а затем считает то же после переноса указанного процента потребления на ночь или выходные. Разница — годовая экономия.",
      poCo:
        "Перенос производства, зарядки авто, работы теплового насоса с буфером или использование накопителя снижает плату без уменьшения потребления.",
    },
    pola: {
      energiaRok: {
        nazwa: "Энергия, взятая за год [кВт·ч]",
        cel: "Всё годовое потребление — чтобы показать долю часов пик.",
        gdzie: "Из счетов — сумма за год.",
        zakres: "Ваши данные.",
      },
      energiaSzczyt: {
        nazwa: "В том числе в рабочие дни 7:00–22:00 [кВт·ч]",
        cel: "Энергия, от которой начисляется плата за мощность.",
        gdzie: "Из счёта (позиция платы за мощность) или портала учёта оператора.",
        zakres: "Не больше всего годового потребления.",
      },
      przesuniecie: {
        nazwa: "Перенос за пределы этих часов [%]",
        cel: "Какую часть потребления в часы пик вы можете перенести на ночь или выходные.",
        gdzie: "Ваша оценка — какие процессы могут работать в другое время.",
        zakres: "0–100%.",
      },
      stawka: {
        nazwa: "Ставка платы за мощность из счёта [зл/кВт·ч] (необязательно)",
        cel: "Позволяет использовать ставку из вашего счёта вместо общегосударственной ставки 2026 г. из приложения.",
        gdzie: "В счёте (позиция «плата за мощность»).",
        zakres: Z_FAKTURY_RU,
      },
    },
  },
  "przelacznik-siec-wyspa": {
    migawka: {
      oCoChodzi:
        "Автономная установка или генератор никогда не должны подавать напряжение в сеть — монтёр на «отключённой» линии может погибнуть. Здесь вы проверите, безопасен ли контакт с сетью.",
      jakDziala:
        "Вы отвечаете на четыре вопроса: как установка соединяется с сетью, какой переключатель, переключается ли провод N и заявлена ли параллельная работа. Переключение без блокировки или отсутствие переключателя — красный стоп. Параллельная работа с сетью требует уведомления оператора о микроустановке.",
      poCo:
        "Это самая опасная ошибка при частичном off-grid и генераторе: обратное напряжение (backfeed) в сеть. Переключатель сеть – 0 – остров с механической блокировкой или АВР с электрической и механической блокировкой это предотвращает.",
      fizyka:
        "Нормативные подробности (HD 60364-5-551) пока отсутствуют в репозитории — приложение прямо это показывает и не выдумывает требования.",
    },
    pola: {
      tryb: {
        nazwa: "Способ соединения установки с сетью",
        cel: "Переключаемая (сеть или остров, без синхронизации), параллельная (гибридный/сетевой инвертор) или без сети. От этого зависят требования: переключатель с блокировкой или уведомление оператора.",
        gdzie: "Из проекта установки или инструкции инвертора.",
        zakres: "Один из трёх вариантов.",
      },
      przelacznik: {
        nazwa: "Тип переключателя",
        cel: "Ручной переключатель сеть – 0 – остров с механической блокировкой или АВР с электрической и механической блокировкой исключают одновременное соединение обоих источников. Нет переключателя или переключатель без блокировки — красный стоп.",
        gdzie: "В распределительном щите — проверьте описание аппарата или спросите монтажника.",
        zakres: "Варианты из списка.",
      },
      przewodN: {
        nazwa: "Переключение провода N",
        cel: "Переключаться должны фазы и нейтральный провод N в соответствии с системой сети — иначе часть автономной установки остаётся соединённой с сетью.",
        gdzie: "Из описания переключателя (число полюсов, например 4P в трёхфазной сети) или у монтажника.",
        zakres: "Да, нет или не знаю.",
      },
      zgloszenie: {
        nazwa: "Уведомление оператора о микроустановке",
        cel: "Параллельная работа с сетью (в том числе «нулевая отдача») требует уведомления оператора о микроустановке и сертификата соответствия инвертора.",
        gdzie: "Из документов о подключении или подтверждения от оператора.",
        zakres: "Да или нет.",
      },
    },
  },
  "rezygnacja-z-przylacza": {
    migawka: {
      oCoChodzi:
        "Семь шагов отказа от подключения в порядке, который имеет значение. Шаги 1–4 можно отменить, 5–7 — уже нет.",
      jakDziala:
        "Приложение ведёт по шагам: посчитайте сценарии и зиму, протестируйте автономную систему при всё ещё подключённой сети в течение полной зимы, проверьте формальности, используйте сальдо просьюмера — и только потом расторжение договоров, снятие счётчика и хранение документов. Внизу считается стоимость возврата: ставка платы за подключение × мощность подключения.",
      poCo:
        "Возврат в сеть — это новое подключение, платное и долгое. Главный совет: постройте и протестируйте остров, прежде чем отказаться от сети.",
      fizyka: "K_возврат ≈ ставка платы за подключение [зл/кВт] × мощность подключения [кВт] (стандартное расстояние). Дальше — индивидуальная оценка оператора.",
    },
    pola: {
      stawka: {
        nazwa: "Ставка платы за подключение [зл/кВт]",
        cel: "Цена подключения за каждый кВт мощности — по ней считается стоимость возврата в сеть.",
        gdzie: "Из тарифа оператора (кабельное или воздушное подключение), нетто.",
        zakres: "Значение из тарифа оператора — в данных приложения его пока нет.",
      },
      moc: {
        nazwa: "Мощность подключения [кВт]",
        cel: "Мощность, которую должно обеспечить подключение после возврата.",
        gdzie: "Из договора или условий подключения.",
        zakres: "Ваш договор.",
      },
      odleglosc: {
        nazwa: "Расстояние до сети",
        cel: "В пределах стандартного расстояния стоимость считается по ставке; дальше оператор оценивает индивидуально — тогда приложение даёт только формулу.",
        gdzie: "Из тарифа оператора (определение стандартного расстояния) или у оператора.",
        zakres: "В пределах стандартного расстояния или дальше.",
      },
    },
  },
  "ryzyka-odlaczenia": {
    migawka: {
      oCoChodzi:
        "Десять рисков полного отключения от сети (сценарий D) и ещё три для фирмы. Отмечайте каждый, когда проверите его.",
      jakDziala:
        "Список включает, среди прочего: необратимость, зиму, отказ единственного источника, людей, зависящих от медицинского оборудования, тепловой насос, формальности (банк, страховщик, продажа дома), пожарную безопасность, генератор (угарный газ, шум, топливо), потерю расчётов и дотаций, стоимость недвижимости; для фирмы — непрерывность работы, договоры B2B, страховщика и охрану труда. Знак у позиции говорит, насколько она достоверна.",
      poCo:
        "Полное отключение практически необратимо. Лучше проверить каждый риск до решения, чем обнаружить его в январе.",
    },
    pola: {},
  },
  "scenariusze-dom": {
    migawka: {
      oCoChodzi:
        "Четыре пути рядом: A — сеть + PV, B — сеть + PV + накопитель, C — off-grid с сетью в резерве, D — полное отключение.",
      jakDziala:
        "Для каждого сценария приложение считает полную стоимость за горизонт (TCO): инвестиции − дотация + годовые расходы (сеть, топливо, сервис) + замены оборудования − остаточная стоимость. Показывает также стоимость первого года, срок окупаемости относительно A, часы работы генератора, результат зимы и обратимость. Цены вводите вы; рост цен на энергию выбираете в поле «Рост цен на энергию».",
      poCo:
        "Чтобы решение опиралось на числа, а не на лозунг «независимость». Приложение никогда не выносит одного вердикта «лучший» — отдельно показывает самый дешёвый и самый независимый.",
      fizyka: "TCO_s(N) = I − D + Σ [K_сеть + K_топливо + K_сервис] / (1+r)^t + Σ I_зам / (1+r)^t_зам − R(N) / (1+r)^N.",
    },
    pola: {},
  },
  "scenariusze-firma": {
    migawka: {
      oCoChodzi:
        "Те же четыре сценария, что и для дома, с проверкой непрерывности работы фирмы: сколько часов фирма выдержит без питания и покрывают ли это накопитель с генератором.",
      jakDziala:
        "Полная стоимость за горизонт (TCO) считается как для дома, с ценами, которые вы вводите. Дополнительно приложение сравнивает допустимое время без питания с тем, что покроют накопитель и генератор (риск RF1).",
      poCo:
        "Для фирмы перерыв в питании — это убытки (холодильные камеры, производство, серверы). Сценарий, более дешёвый на бумаге, может быть неприемлем, если не обеспечивает непрерывность.",
      fizyka: "TCO_s(N) = I − D + Σ [K_сеть + K_топливо + K_сервис] / (1+r)^t + Σ I_зам / (1+r)^t_зам − R(N) / (1+r)^N.",
    },
    pola: {},
  },
  "pv-i-magazyn": {
    migawka: {
      oCoChodzi: "Сколько PV и накопителя нужно, чтобы стать независимым от сети, — месяц за месяцем.",
      jakDziala:
        "Для каждого месяца приложение считает выработку PV по инсоляции вашего места, вычитает прямое самопотребление, переносит часть излишка через накопитель (с потерями) и показывает, сколько вы всё ещё возьмёте из сети и сколько отдадите.",
      poCo:
        "Годовой баланс «в ноль» не означает независимости: летом избыток, зимой нехватка. Это видно только помесячно.",
      fizyka: "E_сеть,m = max(0, E_потр,m − E_PV,m·η − ΔE_нак,m).",
    },
    pola: {},
  },
  "pv-w-firmie": {
    migawka: {
      oCoChodzi: "Сколько энергии с панелей фирма потребит сразу, сколько перенесёт накопитель и сколько отдаст в сеть.",
      jakDziala:
        "Тот же месячный баланс, что и для дома: выработка по вашему месту, прямое самопотребление, перенос через накопитель, потребление из сети и отдача в неё.",
      poCo:
        "При net-billing отданная энергия стоит намного меньше взятой — чем меньше отдаёте, тем лучше. Фирма, работающая днём, обычно имеет высокое самопотребление.",
      fizyka: "E_сеть,m = max(0, E_потр,m − E_PV,m·η − ΔE_нак,m).",
    },
    pola: {},
  },
  "zima-bez-sieci": {
    migawka: {
      oCoChodzi:
        "Та же установка, что на экране «Сколько PV и накопителя», но без сети: чего не хватит в декабре и январе и кто это покроет.",
      jakDziala:
        "Приложение считает баланс каждого месяца без сети. Дефицит в худшем месяце должен покрыть генератор (часы и топливо) или более крупная установка. Отрицательный январский баланс без генератора — красный стоп для полного отключения. Полный зимний стресс-тест выполняет Модуль 7.",
      poCo:
        "Зима — необходимое условие сценария D. Константа «зима = x% лета» лжёт — значение имеют декабрь и январь для вашего места.",
    },
    pola: {},
  },
  "agregat-jako-zapas": {
    migawka: {
      oCoChodzi:
        "Сколько часов и топлива нужно, чтобы генератор покрыл дефицит худшего месяца без сети, — и как его безопасно подключить.",
      jakDziala:
        "Дефицит энергии из зимнего баланса делится на мощность генератора — получаются часы работы, а из них расход и стоимость топлива. Тот же движок, что и экран «Электрогенератор» (Модуль 2), с теми же вопросами безопасности (угарный газ, переключатель).",
      poCo:
        "Генератор — это реальные расходы и обязанности (топливо, шум, сервис). Сколько часов в месяц вы готовы это терпеть, решает, имеет ли смысл полное отключение.",
    },
    pola: {
      moc: {
        nazwa: "Мощность генератора [кВт]",
        cel: "По мощности и дефициту энергии считаются часы работы.",
        gdzie: "С таблички или из документации генератора (длительная, не пиковая мощность).",
        zakres: "Из документации генератора.",
      },
      paliwo: {
        nazwa: "Расход топлива при нагрузке 80% [л/ч]",
        cel: "С часами работы даёт количество и стоимость топлива.",
        gdzie: "Из документации генератора.",
        zakres: "Из документации генератора.",
      },
      cenaPaliwa: {
        nazwa: "Цена топлива [зл/л]",
        cel: "Стоимость литра топлива.",
        gdzie: "Текущая цена на заправке.",
        zakres: TWOJA_CENA_RU,
      },
    },
  },
  dotacje: {
    migawka: {
      oCoChodzi: "Дотации и льготы для дома — информация на дату, а не совет.",
      jakDziala:
        "У каждой позиции есть дата состояния и знак достоверности (✅ прочитано в источнике, 🔎B один источник или экспертное знание). После срока набора позиция сама меняется на «набор завершён».",
      poCo:
        "Дотация меняет выгодность сценариев. Внимание: отключение от сети в период обязательств по проекту может означать возврат дотации — проверьте условия до решения.",
    },
    pola: {},
  },
  "dotacje-firma": {
    migawka: {
      oCoChodzi: "Наборы и льготы для фирм — информация на дату, а не совет.",
      jakDziala:
        "У каждой позиции есть дата состояния и знак достоверности; после срока набора она меняется на «набор завершён». Программы для физических лиц (домашние накопители, льгота на термомодернизацию) — в части «Дом».",
      poCo: "Чтобы учесть финансирование при сравнении сценариев и не упустить условия долговечности проекта.",
    },
    pola: {},
  },
  "faq-dom": {
    migawka: {
      oCoChodzi: "Самые частые вопросы о счёте, просьюмере, отключении и безопасности — в коротких ответах.",
      jakDziala: "Каждый ответ отсылает к калькулятору, который посчитает вопрос на ваших данных.",
      poCo: "Быстрая ориентация до начала расчётов — и ответы на мифы, которые стоят денег.",
    },
    pola: {},
  },
  "faq-firma": {
    migawka: {
      oCoChodzi: "Самые частые вопросы фирм: тарифы C, реактивная мощность, плата за мощность, net-billing, накопители и счётчик.",
      jakDziala:
        "Короткие ответы со ссылками на калькуляторы — исправленные относительно исходного материала там, где он был ошибочен (например, формула реактивной мощности с корнем).",
      poCo: "Быстрая ориентация в расходах фирмы на энергию до начала расчётов.",
    },
    pola: {},
  },
  "sciezka-przejscia": {
    migawka: {
      oCoChodzi: "Шесть шагов от счёта за электричество до решения об уходе из сети.",
      jakDziala:
        "Каждый шаг открывает экраны, которые его считают: счёт и потребление, просьюмер, PV и накопитель, сценарии, зима и риски, процедура. Ваши данные с одного экрана автоматически переходят дальше, а прогресс сохраняется на этом устройстве.",
      poCo:
        "Порядок имеет значение: сначала узнайте затраты и зиму, потом решайте. Путеводитель следит, чтобы ни один шаг не был пропущен.",
    },
    pola: {},
  },
}
