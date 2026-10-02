/**
 * Help content — Module 2 (energy demand). Numbers kept by the engines as constants enter
 * through `{params}`; the app never assumes a user value (Directive #1).
 */
import type { Tlumaczenie } from "./typy"

const TWOJ = "Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie."
const DOD = {
  nazwa: "DoD — głębokość rozładowania [%]",
  cel: "Jaką część pojemności baterii wolno realnie zużyć bez skracania jej życia.",
  gdzie: "Z karty katalogowej baterii albo ustawień BMS.",
  zakres: "0–100%. " + TWOJ,
}
const SPRAWNOSC_FALOWNIKA = {
  nazwa: "Sprawność falownika [%]",
  cel: "Część energii z baterii, która dociera do odbiorników po stratach w falowniku.",
  gdzie: "Z karty katalogowej falownika (sprawność przy typowym obciążeniu).",
  zakres: "0–100%. " + TWOJ,
}
const STANDBY = {
  nazwa: "Pobór standby [W]",
  cel: "Suma mocy, którą urządzenia pobierają stale, nawet gdy „nic nie robią”.",
  gdzie: "Z zakładki „Katalog urządzeń” albo „Pomiar mocy jałowej” — albo z miernika gniazdkowego.",
  zakres: TWOJ,
}

export const pl = {
  "systemy-podtrzymania-zycia": {
    migawka: {
      oCoChodzi: "Lista odbiorników, bez których dom przestaje być bezpieczny do mieszkania — pompa wody, ogrzewanie, wentylacja, łączność.",
      jakDziala: "Zaznaczasz, co jest u Ciebie krytyczne, i korygujesz moc. Aplikacja sumuje moce zaznaczonych pozycji w moc bazową.",
      poCo: "Reszta aplikacji chroni te odbiorniki jako pierwsze — przy doborze baterii, odłączaniu i procedurach awaryjnych.",
      fizyka: "P_bazowe = Σ P_i (zaznaczone).",
    },
    pola: {
      moc: { nazwa: "Moc urządzenia [W]", cel: "Moc tego odbiornika wliczana do mocy bazowej.", gdzie: "Z tabliczki znamionowej albo miernika. Wartość startowa to tylko punkt wyjścia.", zakres: TWOJ },
    },
  },
  "bojler-cwu": {
    migawka: {
      oCoChodzi: "Bojler to jeden z największych „elastycznych” odbiorników w domu — można go grzać wtedy, gdy świeci słońce.",
      jakDziala: "Energia dobowa = litry C.W.U. × wzrost temperatury × ciepło właściwe wody; czas ładowania = energia ÷ moc grzałki.",
      poCo: "Wiesz, ile godzin grzałka musi pracować — i czy zmieści się w oknie produkcji PV.",
      fizyka: "Q = m · c · ΔT, c_wody = {cWody} J/(kg·K) → {kwhNaLK} kWh/(l·K).",
    },
    pola: {
      wolumen: { nazwa: "Dobowe zapotrzebowanie na C.W.U. [l/dobę]", cel: "Ile ciepłej wody zużywa dom na dobę.", gdzie: "Z ekranu „Liczba domowników” (liczba osób × litry na osobę) albo z wodomierza.", zakres: TWOJ },
      deltaT: { nazwa: "Wzrost temperatury wody [K]", cel: "O ile trzeba podgrzać zimną wodę.", gdzie: "Temperatura C.W.U. minus temperatura wody z sieci/studni (np. 45 °C − 10 °C = 35 K).", zakres: "Źródło nie podaje wartości domyślnej — wpisz własną." },
      mocGrzalki: { nazwa: "Moc grzałki [kW]", cel: "Od niej zależy czas ładowania bojlera.", gdzie: "Tabliczka grzałki.", zakres: TWOJ },
      pojemnosc: { nazwa: "Pojemność zbiornika [l]", cel: "Sprawdza, czy dobowe zapotrzebowanie mieści się w zbiorniku.", gdzie: "Tabliczka bojlera.", zakres: TWOJ },
    },
  },
  "urzadzenia-zmienne": {
    migawka: {
      oCoChodzi: "Stare urządzenia to w off-gridzie nie tylko wyższy rachunek — to większa, droższa bateria, żeby je udźwignąć.",
      jakDziala: "Dla każdego zaznaczonego urządzenia: moc × czas pracy × mnożnik klasy energetycznej (nowoczesne {nowoczesne}, standardowe {standardowe}, stare {stare}). Suma to energia dobowa.",
      poCo: "Widzisz, ile energii zjada każde urządzenie i co da wymiana na nowsze.",
      fizyka: "E = Σ P_i · t_i · mnożnik_klasy(i).",
    },
    pola: {
      moc: { nazwa: "Moc urządzenia [W]", cel: "Moc podczas pracy.", gdzie: "Tabliczka znamionowa albo miernik.", zakres: TWOJ },
      czas: { nazwa: "Czas pracy dziennie [min]", cel: "Ile minut na dobę urządzenie realnie pracuje.", gdzie: "Twoje nawyki — policz typowy dzień.", zakres: "0–1440 min." },
      klasa: { nazwa: "Klasa energetyczna", cel: "Mnoży zużycie: nowoczesne {nowoczesne}×, standardowe {standardowe}×, stare {stare}×.", gdzie: "Etykieta energetyczna albo wiek urządzenia.", zakres: "Nowoczesne / standardowe / stare." },
      mocPlyty: { nazwa: "Moc palników płyty indukcyjnej [W]", cel: "Łączna moc płyty — wpływa na szczyt poboru i energię gotowania.", gdzie: "Tabliczka płyty.", zakres: "Typowo {sugerowana} W — wybierz swoją." },
      czasGotowania: { nazwa: "Czas gotowania dziennie [min/dobę]", cel: "Ile minut dziennie pracuje płyta.", gdzie: "Twoje nawyki.", zakres: TWOJ },
    },
  },
  "liczba-domownikow": {
    migawka: {
      oCoChodzi: "Liczba osób w domu wyznacza zużycie ciepłej wody — a to jeden z największych odbiorników energii.",
      jakDziala: "Zapotrzebowanie na C.W.U. = liczba osób × {cwuMin}–{cwuMax} l na osobę na dobę.",
      poCo: "Wynik zasila ekran „Inteligentny bojler C.W.U.” i profil zużycia wody.",
      fizyka: "V_CWU = n × ({cwuMin}–{cwuMax}) l.",
    },
    pola: {
      liczba: { nazwa: "Liczba domowników [os.]", cel: "Ile osób stale mieszka w domu.", gdzie: "Policz domowników (goście okazjonalni — nie).", zakres: "{min}–{max} osób." },
    },
  },
  "profil-astronomiczny": {
    migawka: {
      oCoChodzi: "Profil dobowy to też to, kiedy jest ciemno — długość nocy zmienia się drastycznie między latem a zimą.",
      jakDziala: "Z szerokości geograficznej i dnia roku aplikacja liczy deklinację Słońca i długość dnia; noc = 24 h − dzień. Opcjonalnie liczy zużycie odbiornika pracującego tylko po zmroku.",
      poCo: "Oświetlenie i inne „nocne” odbiorniki w grudniu pracują kilka godzin dłużej niż w czerwcu — bateria musi to udźwignąć.",
      fizyka: "δ = {amplituda}° · sin(360/{dniRoku} · ({przesuniecie} + n)); N = (2/15) · arccos(−tan φ · tan δ).",
    },
    pola: {
      szerokosc: { nazwa: "Szerokość geograficzna [°]", cel: "Od niej zależy długość dnia i nocy.", gdzie: "Z mapy albo Modułu 1 (lokalizacja).", zakres: "−90…90° (Polska ok. 49–55°)." },
      dzienRoku: { nazwa: "Dzień roku [1–365]", cel: "Który dzień roku sprawdzasz.", gdzie: "Np. 21 grudnia = 355, 21 czerwca = 172.", zakres: "1–365." },
      moc: { nazwa: "Moc odbiornika pracującego w ciemności [W] (opcjonalnie)", cel: "Pokazuje, ile energii zjada np. oświetlenie zewnętrzne przez całą noc.", gdzie: "Tabliczka lampy/odbiornika.", zakres: "Puste = pominięte." },
    },
  },
  sezonowosc: {
    migawka: {
      oCoChodzi: "Nie każde urządzenie pracuje cały rok — klimatyzacja zimą stoi, odśnieżarka latem nie istnieje.",
      jakDziala: "Dla sprawdzanego miesiąca aplikacja sprawdza, czy urządzenie jest aktywne (całoroczne zawsze, sezonowe w zakresie miesięcy, weekendowe tylko w weekend). Aktywne — wlicza jego energię, nieaktywne — zero.",
      poCo: "Bilans miesiąca nie jest zawyżony przez urządzenia, które wtedy stoją.",
    },
    pola: {
      energia: { nazwa: "Zapotrzebowanie urządzenia [kWh/dobę]", cel: "Energia w okresie, gdy urządzenie pracuje.", gdzie: "Z ekranu urządzeń albo licznika.", zakres: TWOJ },
      typ: { nazwa: "Typ sezonowości", cel: "Kiedy urządzenie pracuje: cały rok, w wybranych miesiącach albo w weekendy.", gdzie: "Twój sposób użytkowania.", zakres: "Całoroczny / sezonowy / weekendowy." },
      miesiacOd: { nazwa: "Miesiąc początku sezonu [1–12]", cel: "Od kiedy urządzenie pracuje.", gdzie: "Np. klimatyzacja: czerwiec = 6.", zakres: "1–12. Sezon może przechodzić przez Nowy Rok (np. 11 → 3)." },
      miesiacDo: { nazwa: "Miesiąc końca sezonu [1–12]", cel: "Do kiedy urządzenie pracuje.", gdzie: "Np. klimatyzacja: wrzesień = 9.", zakres: "1–12." },
      miesiac: { nazwa: "Sprawdzany miesiąc [1–12]", cel: "Miesiąc, dla którego liczysz bilans.", gdzie: "Twój wybór — zwykle najgorszy miesiąc (grudzień).", zakres: "1–12." },
    },
  },
  "dni-autonomii": {
    migawka: {
      oCoChodzi: "Ile dni bez słońca system ma wytrzymać wyłącznie na baterii — im więcej, tym większy i droższy magazyn.",
      jakDziala: "Wybierasz liczbę dni. Jeśli wpiszesz też zapotrzebowanie, sprawność i DoD — aplikacja szacuje pojemność: energia dobowa × dni ÷ (sprawność × DoD).",
      poCo: "Wartość zasila dobór pojemności baterii (Moduł 4, Ekran 1).",
      fizyka: "C_użyteczna = E_dobowe · d / (η · DoD).",
    },
    pola: {
      dni: { nazwa: "Dni autonomii", cel: "Ile dni pochmurnych z rzędu system ma przetrwać bez słońca i agregatu.", gdzie: "Twoja decyzja — zależy od klimatu i tego, czy masz agregat.", zakres: "Do wyboru: {opcje} dni." },
      zapotrzebowanie: { nazwa: "Zapotrzebowanie dobowe [kWh]", cel: "Energia zużywana na dobę.", gdzie: "Z bilansu Modułu 2.", zakres: TWOJ },
      sprawnosc: SPRAWNOSC_FALOWNIKA,
      dod: DOD,
    },
  },
  "moc-pozorna-cosfi": {
    migawka: {
      oCoChodzi: "Waty na tabliczce to nie cała historia — silniki i sprężarki obciążają falownik mocą pozorną (VA), nie tylko czynną (W).",
      jakDziala: "Moc pozorna = moc czynna ÷ cos φ. Falownik trzeba dobrać do VA, nie do W.",
      poCo: "Falownik dobrany „na waty” może nie uciągnąć lodówki czy pompy.",
      fizyka: "S [VA] = P [W] / cos φ.",
    },
    pola: {
      moc: { nazwa: "Moc czynna urządzenia [W]", cel: "Moc, która wykonuje pracę.", gdzie: "Tabliczka znamionowa urządzenia z silnikiem/sprężarką.", zakres: TWOJ },
      cosFi: { nazwa: "Współczynnik mocy cos φ", cel: "Jak duża część mocy pozornej to moc czynna.", gdzie: "Tabliczka silnika (cos φ).", zakres: "0–1. Domyślnie {cosFi} dla urządzeń z silnikiem." },
    },
  },
  "pobor-wlasny-falownika": {
    migawka: {
      oCoChodzi: "Falownik sam coś zużywa, tylko żeby być gotowym do pracy — niewidoczny, ale stały koszt.",
      jakDziala: "Strata dobowa = pobór jałowy × 24 h ÷ 1000.",
      poCo: "Te kWh trzeba dołożyć do bilansu — zimą potrafią zjeść zauważalną część produkcji.",
      fizyka: "E_doba = P_jałowy · 24 / 1000.",
    },
    pola: {
      pobor: { nazwa: "Pobór w stanie jałowym [W]", cel: "Moc pobierana przez falownik bez obciążenia.", gdzie: "Karta katalogowa („no-load consumption”).", zakres: "Typowo 20–100 W. Domyślnie {domyslny} W, jeśli model nieznany." },
    },
  },
  "sprawnosc-inwertera-niskie-obciazenie": {
    migawka: {
      oCoChodzi: "Za duży falownik względem obciążenia to jak jazda na najwyższym biegu w mieście — pracuje, ale nieefektywnie.",
      jakDziala: "Realne zużycie = zapotrzebowanie ÷ sprawność przy tym obciążeniu; aplikacja pokazuje też obciążenie falownika w % mocy. Najlepsza sprawność typowo przy {optMin}–{optMax}% mocy, poniżej {prog}% wyraźnie spada.",
      poCo: "Widzisz, ile energii tracisz, gdy duży falownik zasila małe odbiorniki (np. nocą).",
      fizyka: "P_realne = P_zapotrzebowanie / η.",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Bieżące zapotrzebowanie [W]", cel: "Moc odbiorników w sprawdzanej chwili.", gdzie: "Suma mocy włączonych odbiorników albo odczyt z falownika.", zakres: TWOJ },
      mocFalownika: { nazwa: "Znamionowa moc falownika [W]", cel: "Z nią porównywane jest obciążenie.", gdzie: "Karta katalogowa falownika.", zakres: TWOJ },
      sprawnosc: { nazwa: "Sprawność falownika przy tym obciążeniu [%]", cel: "Część energii, która dociera do odbiorników.", gdzie: "Krzywa sprawności producenta — typowo ~95% przy 40–80% obciążenia, 70–80% poniżej 10%.", zakres: "0–100%." },
    },
  },
  "przetwornice-dcdc": {
    migawka: {
      oCoChodzi: "Każda zmiana napięcia kosztuje energię — czasem lepiej zasilić urządzenie wprost z magistrali w jego natywnym napięciu.",
      jakDziala: "Realne zapotrzebowanie = moc urządzenia ÷ sprawność przetwornicy; różnica to strata.",
      poCo: "Pokazuje, ile kosztuje przetwornica pracująca 24 h na dobę.",
      fizyka: "P_realne = P_urządzenia / η_przetwornicy.",
    },
    pola: {
      moc: { nazwa: "Zapotrzebowanie mocy urządzenia [W]", cel: "Moc po stronie wyjścia przetwornicy.", gdzie: "Tabliczka urządzenia.", zakres: TWOJ },
      sprawnosc: { nazwa: "Sprawność przetwornicy DC/DC [%]", cel: "Część mocy, która przechodzi przez przetwornicę.", gdzie: "Karta katalogowa przetwornicy.", zakres: "Typowo {min}–{max}%." },
    },
  },
  "load-shedding": {
    migawka: {
      oCoChodzi: "System sam decyduje, co poświęcić, zanim musiałbyś to robić ręcznie przy niskiej baterii.",
      jakDziala: "Priorytet 1 (krytyczny) nigdy nie jest odłączany; priorytet 2 (komfort) — przy SoC poniżej {prog2}%; priorytet 3 (nadwyżkowy) — przy SoC poniżej {prog3}% albo braku nadwyżki PV.",
      poCo: "Bateria zostaje dla tego, co naprawdę ważne.",
    },
    pola: {
      priorytet: { nazwa: "Priorytet odbiornika", cel: "Kolejność odłączania przy spadku SoC.", gdzie: "Twoja decyzja — krytyczne to te z ekranu „Systemy podtrzymania życia”.", zakres: "1 — krytyczny, 2 — komfort, 3 — nadwyżkowy." },
      soc: { nazwa: "Aktualny SoC baterii [%]", cel: "Stan naładowania, dla którego sprawdzasz decyzję.", gdzie: "Wyświetlacz BMS/falownika.", zakres: "0–100%." },
    },
  },
  "bufor-rozbudowe": {
    migawka: {
      oCoChodzi: "System projektowany tylko pod dzisiejsze potrzeby za dwa lata będzie za mały.",
      jakDziala: "Zapotrzebowanie z buforem = zapotrzebowanie całkowite × (1 + bufor %).",
      poCo: "Świadoma decyzja, ile zapasu wbudować od razu — taniej niż rozbudowa później.",
      fizyka: "E_z_buforem = E · (1 + bufor%).",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Całkowite zapotrzebowanie dobowe [kWh]", cel: "Punkt wyjścia bez zapasu.", gdzie: "Z bilansu Modułu 2.", zakres: TWOJ },
      bufor: { nazwa: "Bufor na rozbudowę [%]", cel: "Zapas na przyszłe odbiorniki (pompa ciepła, auto, warsztat).", gdzie: "Twoje plany na kilka lat.", zakres: "Do wyboru: {opcje}%." },
    },
  },
  "architektura-fazowa": {
    migawka: {
      oCoChodzi: "W systemie 3-fazowym nie liczy się tylko suma mocy — liczy się, jak równo rozkłada się na fazy, bo każda ma własny limit.",
      jakDziala: "Asymetria = (najbardziej obciążona faza − najmniej obciążona) ÷ najbardziej obciążona × 100%.",
      poCo: "Duża asymetria przeciąża jedną fazę falownika, choć suma mieści się w jego mocy.",
      fizyka: "asymetria = (P_max − P_min) / P_max · 100%.",
    },
    pola: {
      l1: { nazwa: "Obciążenie L1 [W]", cel: "Moc odbiorników na fazie L1.", gdzie: "Rozdzielnica — przypisanie obwodów do faz, albo pomiar.", zakres: TWOJ },
      l2: { nazwa: "Obciążenie L2 [W]", cel: "Moc odbiorników na fazie L2.", gdzie: "Jak L1.", zakres: "0, jeśli instalacja jednofazowa." },
      l3: { nazwa: "Obciążenie L3 [W]", cel: "Moc odbiorników na fazie L3.", gdzie: "Jak L1.", zakres: "0, jeśli instalacja jednofazowa." },
    },
  },
  "kategorie-specjalne": {
    migawka: {
      oCoChodzi: "Zamiast pustej listy wybierasz profil (warsztat, gospodarstwo, oświetlenie terenowe) i dostajesz punkt startowy.",
      jakDziala: "Energia dobowa = suma (moc × czas pracy) wszystkich pozycji.",
      poCo: "Szybko widzisz, ile energii dokłada warsztat czy gospodarstwo do bilansu domu.",
      fizyka: "E = Σ P_i · t_i.",
    },
    pola: {
      kategoria: { nazwa: "Kategoria", cel: "Profil podpowiadający typowe urządzenia.", gdzie: "Twój przypadek.", zakres: "Warsztat / gospodarstwo / oświetlenie terenowe." },
      nazwa: { nazwa: "Nazwa urządzenia", cel: "Tylko opis pozycji — nie wpływa na wynik.", gdzie: "Dowolna.", zakres: "Tekst." },
      moc: { nazwa: "Moc [W]", cel: "Moc urządzenia podczas pracy.", gdzie: "Tabliczka znamionowa.", zakres: "Źródło nie podaje mocy domyślnych — wpisz własną." },
      czas: { nazwa: "Czas pracy [min/dobę]", cel: "Ile minut dziennie urządzenie pracuje.", gdzie: "Twoje nawyki.", zakres: "0–1440 min." },
    },
  },
  pomocnicze: {
    migawka: {
      oCoChodzi: "Podręczny kalkulator do szybkich przeliczeń w terenie, bez pełnego procesu projektowego.",
      jakDziala: "Tryby: moc → prąd (I = P ÷ (U × η)), Ah → Wh (E = C × U), Wh → Ah (C = E ÷ U) i szacowany czas pracy z baterii.",
      poCo: "Szybka odpowiedź „ile amperów”, „ile Wh ma ta bateria”, „na ile starczy”.",
      fizyka: "I = P / (U · η); E = C · U.",
    },
    pola: {
      tryb: { nazwa: "Tryb", cel: "Które przeliczenie wykonać.", gdzie: "Wybierz z listy.", zakres: "Moc → prąd, Ah → Wh, Wh → Ah, czas pracy." },
      moc: { nazwa: "Moc urządzenia [W]", cel: "Moc odbiornika.", gdzie: "Tabliczka znamionowa.", zakres: TWOJ },
      napiecie: { nazwa: "Napięcie systemu [V]", cel: "Napięcie baterii/magistrali DC.", gdzie: "Typowo 12, 24 albo 48 V.", zakres: TWOJ },
      pojemnosc: { nazwa: "Pojemność [Ah]", cel: "Pojemność baterii.", gdzie: "Tabliczka baterii.", zakres: TWOJ },
      energia: { nazwa: "Energia [Wh]", cel: "Energia do przeliczenia na Ah.", gdzie: "Tabliczka baterii albo wynik bilansu.", zakres: TWOJ },
      sprawnosc: { nazwa: "Sprawność układu [0–1] (opcjonalnie)", cel: "Straty falownika/przetwornicy przy liczeniu prądu.", gdzie: "Karta katalogowa falownika.", zakres: "{min}–{max}. Puste = {domyslna}." },
    },
  },
  "agregat-pradotworczy": {
    migawka: {
      oCoChodzi: "Jeśli w najgorszym miesiącu PV nie pokrywa zapotrzebowania, deficyt pokrywa agregat.",
      jakDziala: "Godziny pracy = deficyt ÷ (moc agregatu × {obciazenie}% optymalnego obciążenia); paliwo = godziny × zużycie; koszt = paliwo × cena.",
      poCo: "Wiesz, ile godzin, litrów i złotych kosztuje zima — i czy warto dołożyć paneli lub baterii.",
      fizyka: "t = deficyt / (P · {obciazenie}%); paliwo = t · zużycie; koszt = paliwo · cena.",
    },
    pola: {
      deficyt: { nazwa: "Deficyt energetyczny w najgorszym miesiącu [kWh]", cel: "Energia, której PV nie pokryje.", gdzie: "Zapotrzebowanie minus produkcja PV w tym miesiącu (bilans roczny).", zakres: TWOJ },
      moc: { nazwa: "Moc znamionowa agregatu [kW]", cel: "Z nią liczone są godziny pracy.", gdzie: "Tabliczka agregatu.", zakres: TWOJ },
      zuzycie: { nazwa: "Średnie zużycie paliwa [l/h]", cel: "Zużycie przy optymalnym obciążeniu.", gdzie: "Karta katalogowa agregatu — przy ok. 70–80% mocy.", zakres: TWOJ },
      cena: { nazwa: "Cena paliwa [{waluta}/l]", cel: "Wycenia koszt pracy agregatu.", gdzie: "Twoja cena na stacji.", zakres: TWOJ },
    },
  },
  "wampiry-energetyczne": {
    migawka: {
      oCoChodzi: "Drobny, ciągły pobór urządzeń w czuwaniu — pojedynczo niewiele, ale w skali roku regularnie zjada baterię.",
      jakDziala: "Katalog i pomiar sumują pobór standby (energia doby = W × 24 ÷ 1000). Symulacje liczą autonomię, roczny koszt i o ile mniejsza może być bateria po eliminacji. Rekomendacje porównują metody odłączania (zwrot = koszt ÷ oszczędność × 12 mies.), automatyzacja — scenariusze czuwania.",
      poCo: "W off-gridzie każdy wat stały to kilowatogodziny baterii — eliminacja standby bywa najtańszą „rozbudową” systemu.",
      fizyka: "E_rok = P_standby · 8760 / 1000; t = C · 1000 · DoD / P_standby.",
    },
    pola: {
      podzakladka: { nazwa: "Podzakładka", cel: "Który aspekt wampirów energetycznych oglądasz.", gdzie: "Wybierz z listy.", zakres: "Katalog, pomiar, symulacje, rekomendacje, automatyzacja." },
      mocCzuwania: { nazwa: "Moc czuwania [W]", cel: "Pobór urządzenia w trybie standby.", gdzie: "Miernik gniazdkowy albo karta urządzenia. Wartość z katalogu to punkt wyjścia.", zakres: TWOJ },
      nazwa: { nazwa: "Nazwa urządzenia", cel: "Tylko opis pozycji — nie wpływa na wynik.", gdzie: "Dowolna.", zakres: "Tekst." },
      mocJalowa: { nazwa: "Zmierzona moc jałowa [W]", cel: "Pobór zmierzony, gdy urządzenie „nic nie robi”.", gdzie: "Miernik gniazdkowy — odczyt po kilku minutach czuwania.", zakres: TWOJ },
      koszt: { nazwa: "Koszt zakupu [{waluta}]", cel: "Cena metody odłączania (listwa, gniazdo, przekaźnik).", gdzie: "Twoja oferta.", zakres: "Aplikacja nie zakłada cen sprzętu." },
      oszczednosc: { nazwa: "Roczna oszczędność [{waluta}/rok]", cel: "Ile zaoszczędzisz rocznie dzięki odłączaniu.", gdzie: "Np. z symulacji „Roczny koszt poboru standby”.", zakres: TWOJ },
      kategoria: { nazwa: "Kategoria urządzenia", cel: "Podpowiada metodę odłączania dla tej grupy urządzeń.", gdzie: "Wybierz z listy.", zakres: "Kategorie ze źródła." },
      standby: STANDBY,
      standbyRedukcja: { nazwa: "Pobór po redukcji [W] (opcjonalnie)", cel: "Drugi scenariusz do porównania.", gdzie: "Pobór po odłączeniu części urządzeń.", zakres: "0 = pomiń drugi scenariusz." },
      pojemnosc: { nazwa: "Pojemność użyteczna baterii [kWh]", cel: "Energia, z której zasilany jest standby.", gdzie: "Karta baterii albo dobór z Modułu 4.", zakres: TWOJ },
      dod: DOD,
      cenaEnergii: { nazwa: "Cena energii [{waluta}/kWh]", cel: "Wycenia roczny koszt standby.", gdzie: "Twoja cena — źródło nie podaje uniwersalnej wartości.", zakres: TWOJ },
      zuzycieRoczne: { nazwa: "Całkowite roczne zużycie domu [kWh] (opcjonalnie)", cel: "Pokazuje udział standby w całości.", gdzie: "Bilans roczny albo licznik.", zakres: "0 = pomiń wyliczenie udziału." },
      standbyDobowa: { nazwa: "Dobowa energia standby [kWh/dobę]", cel: "Energia czuwania na dobę.", gdzie: "Z zakładki „Katalog” albo „Pomiar”.", zakres: TWOJ },
      eliminacja: { nazwa: "Planowana eliminacja standby [%]", cel: "Jaką część czuwania chcesz wyeliminować.", gdzie: "Twój plan.", zakres: "0–100%." },
      dniAutonomii: { nazwa: "Dni autonomii", cel: "Ile dni bez słońca bateria ma wytrzymać.", gdzie: "Z ekranu „Dni autonomii”.", zakres: TWOJ },
      sprawnosc: SPRAWNOSC_FALOWNIKA,
      standbyRef: { nazwa: "Standby referencyjny [W]", cel: "Pobór czuwania w trybie normalnym.", gdzie: "Z katalogu albo pomiaru.", zakres: TWOJ },
      standbyScenariusz: { nazwa: "Standby w scenariuszu [W]", cel: "Pobór czuwania w wybranym scenariuszu automatyzacji.", gdzie: "Np. tryb nocny, nieobecność, praca z domu, weekend, urlop.", zakres: TWOJ },
    },
  },
}

const TWOJ_EN = "Your installation — the app does not assume a typical value for you."
const DOD_EN = {
  nazwa: "DoD — depth of discharge [%]",
  cel: "What part of the battery capacity can really be used without shortening its life.",
  gdzie: "From the battery datasheet or BMS settings.",
  zakres: "0–100%. " + TWOJ_EN,
}
const SPRAWNOSC_FALOWNIKA_EN = {
  nazwa: "Inverter efficiency [%]",
  cel: "The part of battery energy that reaches the loads after inverter losses.",
  gdzie: "From the inverter datasheet (efficiency at typical load).",
  zakres: "0–100%. " + TWOJ_EN,
}
const STANDBY_EN = {
  nazwa: "Standby draw [W]",
  cel: "Total power devices draw constantly, even when they are “doing nothing”.",
  gdzie: "From the “Device catalogue” or “Idle power measurement” tab — or a plug-in meter.",
  zakres: TWOJ_EN,
}

export const en: Tlumaczenie<typeof pl> = {
  "systemy-podtrzymania-zycia": {
    migawka: {
      oCoChodzi: "The list of loads without which the house stops being safe to live in — water pump, heating, ventilation, communication.",
      jakDziala: "You tick what is critical for you and adjust the power. The app sums the ticked items into the base load.",
      poCo: "The rest of the app protects these loads first — in battery sizing, load shedding and emergency procedures.",
      fizyka: "P_base = Σ P_i (ticked).",
    },
    pola: {
      moc: { nazwa: "Device power [W]", cel: "Power of this load counted into the base load.", gdzie: "Rating plate or a meter. The starting value is only a starting point.", zakres: TWOJ_EN },
    },
  },
  "bojler-cwu": {
    migawka: {
      oCoChodzi: "The water heater is one of the largest “flexible” loads in a house — it can be heated when the sun shines.",
      jakDziala: "Daily energy = litres of hot water × temperature rise × specific heat of water; charging time = energy ÷ heater power.",
      poCo: "You know how many hours the heater must run — and whether it fits into the PV production window.",
      fizyka: "Q = m · c · ΔT, c_water = {cWody} J/(kg·K) → {kwhNaLK} kWh/(l·K).",
    },
    pola: {
      wolumen: { nazwa: "Daily hot water demand [l/day]", cel: "How much hot water the house uses per day.", gdzie: "From the “Number of occupants” screen (people × litres per person) or a water meter.", zakres: TWOJ_EN },
      deltaT: { nazwa: "Water temperature rise [K]", cel: "How much the cold water has to be heated.", gdzie: "Hot water temperature minus mains/well water temperature (e.g. 45 °C − 10 °C = 35 K).", zakres: "The source gives no default value — enter your own." },
      mocGrzalki: { nazwa: "Heater power [kW]", cel: "Determines the charging time.", gdzie: "Heater rating plate.", zakres: TWOJ_EN },
      pojemnosc: { nazwa: "Tank capacity [l]", cel: "Checks whether daily demand fits in the tank.", gdzie: "Water heater rating plate.", zakres: TWOJ_EN },
    },
  },
  "urzadzenia-zmienne": {
    migawka: {
      oCoChodzi: "Off-grid, old appliances mean not just a higher bill — they mean a larger, more expensive battery to carry them.",
      jakDziala: "For each ticked appliance: power × running time × energy class multiplier (modern {nowoczesne}, standard {standardowe}, old {stare}). The sum is the daily energy.",
      poCo: "You see how much energy each appliance eats and what replacing it would give.",
      fizyka: "E = Σ P_i · t_i · class_multiplier(i).",
    },
    pola: {
      moc: { nazwa: "Device power [W]", cel: "Power while running.", gdzie: "Rating plate or a meter.", zakres: TWOJ_EN },
      czas: { nazwa: "Running time per day [min]", cel: "How many minutes per day the appliance really runs.", gdzie: "Your habits — count a typical day.", zakres: "0–1440 min." },
      klasa: { nazwa: "Energy class", cel: "Multiplies consumption: modern {nowoczesne}×, standard {standardowe}×, old {stare}×.", gdzie: "Energy label or the appliance's age.", zakres: "Modern / standard / old." },
      mocPlyty: { nazwa: "Induction hob power [W]", cel: "Total hob power — affects peak draw and cooking energy.", gdzie: "Hob rating plate.", zakres: "Typically {sugerowana} W — choose yours." },
      czasGotowania: { nazwa: "Cooking time per day [min/day]", cel: "How many minutes per day the hob runs.", gdzie: "Your habits.", zakres: TWOJ_EN },
    },
  },
  "liczba-domownikow": {
    migawka: {
      oCoChodzi: "The number of people in the house sets hot water use — one of the largest energy loads.",
      jakDziala: "Hot water demand = people × {cwuMin}–{cwuMax} l per person per day.",
      poCo: "The result feeds the “Smart water heater” screen and the water use profile.",
      fizyka: "V_DHW = n × ({cwuMin}–{cwuMax}) l.",
    },
    pola: {
      liczba: { nazwa: "Number of occupants [people]", cel: "How many people live in the house permanently.", gdzie: "Count the occupants (occasional guests — no).", zakres: "{min}–{max} people." },
    },
  },
  "profil-astronomiczny": {
    migawka: {
      oCoChodzi: "A daily profile is also about when it is dark — night length changes drastically between summer and winter.",
      jakDziala: "From latitude and day of year the app calculates the solar declination and day length; night = 24 h − day. Optionally it calculates the use of a load that runs only after dark.",
      poCo: "Lighting and other “night” loads run several hours longer in December than in June — the battery must carry that.",
      fizyka: "δ = {amplituda}° · sin(360/{dniRoku} · ({przesuniecie} + n)); N = (2/15) · arccos(−tan φ · tan δ).",
    },
    pola: {
      szerokosc: { nazwa: "Latitude [°]", cel: "Determines day and night length.", gdzie: "From a map or Module 1 (location).", zakres: "−90…90° (Poland approx. 49–55°)." },
      dzienRoku: { nazwa: "Day of year [1–365]", cel: "Which day of the year you are checking.", gdzie: "E.g. 21 December = 355, 21 June = 172.", zakres: "1–365." },
      moc: { nazwa: "Power of a load running in darkness [W] (optional)", cel: "Shows how much energy e.g. outdoor lighting uses through the night.", gdzie: "Lamp/load rating plate.", zakres: "Empty = skipped." },
    },
  },
  sezonowosc: {
    migawka: {
      oCoChodzi: "Not every appliance runs all year — air conditioning stands idle in winter, a snow blower does not exist in summer.",
      jakDziala: "For the checked month the app checks whether the appliance is active (year-round always, seasonal within the month range, weekend only at weekends). Active — its energy is counted, inactive — zero.",
      poCo: "The monthly balance is not inflated by appliances that are idle then.",
    },
    pola: {
      energia: { nazwa: "Appliance demand [kWh/day]", cel: "Energy during the period when the appliance runs.", gdzie: "From the appliances screen or a meter.", zakres: TWOJ_EN },
      typ: { nazwa: "Seasonality type", cel: "When the appliance runs: all year, in selected months or at weekends.", gdzie: "How you use it.", zakres: "Year-round / seasonal / weekend." },
      miesiacOd: { nazwa: "Season start month [1–12]", cel: "From when the appliance runs.", gdzie: "E.g. air conditioning: June = 6.", zakres: "1–12. A season may cross New Year (e.g. 11 → 3)." },
      miesiacDo: { nazwa: "Season end month [1–12]", cel: "Until when the appliance runs.", gdzie: "E.g. air conditioning: September = 9.", zakres: "1–12." },
      miesiac: { nazwa: "Checked month [1–12]", cel: "The month for which you calculate the balance.", gdzie: "Your choice — usually the worst month (December).", zakres: "1–12." },
    },
  },
  "dni-autonomii": {
    migawka: {
      oCoChodzi: "How many days without sun the system must survive on the battery alone — the more, the larger and more expensive the storage.",
      jakDziala: "You choose the number of days. If you also enter demand, efficiency and DoD, the app estimates the capacity: daily energy × days ÷ (efficiency × DoD).",
      poCo: "The value feeds battery capacity sizing (Module 4, Screen 1).",
      fizyka: "C_usable = E_daily · d / (η · DoD).",
    },
    pola: {
      dni: { nazwa: "Days of autonomy", cel: "How many cloudy days in a row the system must survive without sun and generator.", gdzie: "Your decision — depends on climate and whether you have a generator.", zakres: "Choose: {opcje} days." },
      zapotrzebowanie: { nazwa: "Daily demand [kWh]", cel: "Energy used per day.", gdzie: "From the Module 2 balance.", zakres: TWOJ_EN },
      sprawnosc: SPRAWNOSC_FALOWNIKA_EN,
      dod: DOD_EN,
    },
  },
  "moc-pozorna-cosfi": {
    migawka: {
      oCoChodzi: "Watts on the rating plate are not the whole story — motors and compressors load the inverter with apparent power (VA), not only real power (W).",
      jakDziala: "Apparent power = real power ÷ cos φ. The inverter must be sized for VA, not W.",
      poCo: "An inverter sized “by watts” may not handle a fridge or a pump.",
      fizyka: "S [VA] = P [W] / cos φ.",
    },
    pola: {
      moc: { nazwa: "Real power of the device [W]", cel: "The power that does the work.", gdzie: "Rating plate of the motor/compressor device.", zakres: TWOJ_EN },
      cosFi: { nazwa: "Power factor cos φ", cel: "How much of the apparent power is real power.", gdzie: "Motor rating plate (cos φ).", zakres: "0–1. Default {cosFi} for motor devices." },
    },
  },
  "pobor-wlasny-falownika": {
    migawka: {
      oCoChodzi: "The inverter itself consumes something just to be ready — an invisible but constant cost.",
      jakDziala: "Daily loss = idle draw × 24 h ÷ 1000.",
      poCo: "These kWh must be added to the balance — in winter they can eat a noticeable part of production.",
      fizyka: "E_day = P_idle · 24 / 1000.",
    },
    pola: {
      pobor: { nazwa: "Idle draw [W]", cel: "Power the inverter draws with no load.", gdzie: "Datasheet (“no-load consumption”).", zakres: "Typically 20–100 W. Default {domyslny} W if the model is unknown." },
    },
  },
  "sprawnosc-inwertera-niskie-obciazenie": {
    migawka: {
      oCoChodzi: "An inverter too large for the load is like driving in top gear in town — it works, but inefficiently.",
      jakDziala: "Real consumption = demand ÷ efficiency at that load; the app also shows the inverter load in % of power. Best efficiency is typically at {optMin}–{optMax}% of power; below {prog}% it drops markedly.",
      poCo: "You see how much energy you lose when a large inverter feeds small loads (e.g. at night).",
      fizyka: "P_real = P_demand / η.",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Current demand [W]", cel: "Load power at the checked moment.", gdzie: "Sum of the switched-on loads or the inverter reading.", zakres: TWOJ_EN },
      mocFalownika: { nazwa: "Inverter rated power [W]", cel: "The load is compared with it.", gdzie: "Inverter datasheet.", zakres: TWOJ_EN },
      sprawnosc: { nazwa: "Inverter efficiency at this load [%]", cel: "The part of energy that reaches the loads.", gdzie: "Manufacturer's efficiency curve — typically ~95% at 40–80% load, 70–80% below 10%.", zakres: "0–100%." },
    },
  },
  "przetwornice-dcdc": {
    migawka: {
      oCoChodzi: "Every voltage conversion costs energy — sometimes it is better to feed a device straight from the bus at its native voltage.",
      jakDziala: "Real demand = device power ÷ converter efficiency; the difference is the loss.",
      poCo: "Shows what a converter running 24 hours a day costs.",
      fizyka: "P_real = P_device / η_converter.",
    },
    pola: {
      moc: { nazwa: "Device power demand [W]", cel: "Power on the converter output side.", gdzie: "Device rating plate.", zakres: TWOJ_EN },
      sprawnosc: { nazwa: "DC/DC converter efficiency [%]", cel: "The part of power that passes through the converter.", gdzie: "Converter datasheet.", zakres: "Typically {min}–{max}%." },
    },
  },
  "load-shedding": {
    migawka: {
      oCoChodzi: "The system decides by itself what to sacrifice before you would have to do it by hand with a low battery.",
      jakDziala: "Priority 1 (critical) is never disconnected; priority 2 (comfort) — at SoC below {prog2}%; priority 3 (surplus) — at SoC below {prog3}% or with no PV surplus.",
      poCo: "The battery stays for what really matters.",
    },
    pola: {
      priorytet: { nazwa: "Load priority", cel: "Disconnection order as SoC falls.", gdzie: "Your decision — critical ones are those from the “Life support systems” screen.", zakres: "1 — critical, 2 — comfort, 3 — surplus." },
      soc: { nazwa: "Current battery SoC [%]", cel: "State of charge for which you check the decision.", gdzie: "BMS/inverter display.", zakres: "0–100%." },
    },
  },
  "bufor-rozbudowe": {
    migawka: {
      oCoChodzi: "A system designed only for today's needs will be too small in two years.",
      jakDziala: "Demand with buffer = total demand × (1 + buffer %).",
      poCo: "A conscious decision on how much reserve to build in now — cheaper than expanding later.",
      fizyka: "E_with_buffer = E · (1 + buffer%).",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Total daily demand [kWh]", cel: "Starting point without reserve.", gdzie: "From the Module 2 balance.", zakres: TWOJ_EN },
      bufor: { nazwa: "Expansion buffer [%]", cel: "Reserve for future loads (heat pump, car, workshop).", gdzie: "Your plans for the next few years.", zakres: "Choose: {opcje}%." },
    },
  },
  "architektura-fazowa": {
    migawka: {
      oCoChodzi: "In a 3-phase system it is not only the total power that counts — it is how evenly it is spread over the phases, because each has its own limit.",
      jakDziala: "Asymmetry = (most loaded phase − least loaded) ÷ most loaded × 100%.",
      poCo: "High asymmetry overloads one inverter phase even though the total fits its power.",
      fizyka: "asymmetry = (P_max − P_min) / P_max · 100%.",
    },
    pola: {
      l1: { nazwa: "Load L1 [W]", cel: "Load power on phase L1.", gdzie: "Distribution board — circuit-to-phase assignment, or a measurement.", zakres: TWOJ_EN },
      l2: { nazwa: "Load L2 [W]", cel: "Load power on phase L2.", gdzie: "As L1.", zakres: "0 if the installation is single-phase." },
      l3: { nazwa: "Load L3 [W]", cel: "Load power on phase L3.", gdzie: "As L1.", zakres: "0 if the installation is single-phase." },
    },
  },
  "kategorie-specjalne": {
    migawka: {
      oCoChodzi: "Instead of an empty list you pick a profile (workshop, farm, outdoor lighting) and get a starting point.",
      jakDziala: "Daily energy = sum of (power × running time) over all items.",
      poCo: "You quickly see how much energy a workshop or farm adds to the house balance.",
      fizyka: "E = Σ P_i · t_i.",
    },
    pola: {
      kategoria: { nazwa: "Category", cel: "A profile suggesting typical devices.", gdzie: "Your case.", zakres: "Workshop / farm / outdoor lighting." },
      nazwa: { nazwa: "Device name", cel: "Only a description of the item — does not affect the result.", gdzie: "Anything.", zakres: "Text." },
      moc: { nazwa: "Power [W]", cel: "Device power while running.", gdzie: "Rating plate.", zakres: "The source gives no default powers — enter your own." },
      czas: { nazwa: "Running time [min/day]", cel: "How many minutes per day the device runs.", gdzie: "Your habits.", zakres: "0–1440 min." },
    },
  },
  pomocnicze: {
    migawka: {
      oCoChodzi: "A pocket calculator for quick conversions in the field, without the full design process.",
      jakDziala: "Modes: power → current (I = P ÷ (U × η)), Ah → Wh (E = C × U), Wh → Ah (C = E ÷ U) and estimated battery runtime.",
      poCo: "A quick answer to “how many amps”, “how many Wh is this battery”, “how long will it last”.",
      fizyka: "I = P / (U · η); E = C · U.",
    },
    pola: {
      tryb: { nazwa: "Mode", cel: "Which conversion to perform.", gdzie: "Choose from the list.", zakres: "Power → current, Ah → Wh, Wh → Ah, runtime." },
      moc: { nazwa: "Device power [W]", cel: "Load power.", gdzie: "Rating plate.", zakres: TWOJ_EN },
      napiecie: { nazwa: "System voltage [V]", cel: "Battery/DC bus voltage.", gdzie: "Typically 12, 24 or 48 V.", zakres: TWOJ_EN },
      pojemnosc: { nazwa: "Capacity [Ah]", cel: "Battery capacity.", gdzie: "Battery rating plate.", zakres: TWOJ_EN },
      energia: { nazwa: "Energy [Wh]", cel: "Energy to convert to Ah.", gdzie: "Battery rating plate or the balance result.", zakres: TWOJ_EN },
      sprawnosc: { nazwa: "System efficiency [0–1] (optional)", cel: "Inverter/converter losses when calculating current.", gdzie: "Inverter datasheet.", zakres: "{min}–{max}. Empty = {domyslna}." },
    },
  },
  "agregat-pradotworczy": {
    migawka: {
      oCoChodzi: "If PV does not cover demand in the worst month, a generator covers the deficit.",
      jakDziala: "Running hours = deficit ÷ (generator power × {obciazenie}% optimal load); fuel = hours × consumption; cost = fuel × price.",
      poCo: "You know how many hours, litres and zloty winter costs — and whether adding panels or battery is worth it.",
      fizyka: "t = deficit / (P · {obciazenie}%); fuel = t · consumption; cost = fuel · price.",
    },
    pola: {
      deficyt: { nazwa: "Energy deficit in the worst month [kWh]", cel: "Energy PV will not cover.", gdzie: "Demand minus PV production in that month (annual balance).", zakres: TWOJ_EN },
      moc: { nazwa: "Generator rated power [kW]", cel: "Running hours are calculated from it.", gdzie: "Generator rating plate.", zakres: TWOJ_EN },
      zuzycie: { nazwa: "Average fuel consumption [l/h]", cel: "Consumption at optimal load.", gdzie: "Generator datasheet — at approx. 70–80% power.", zakres: TWOJ_EN },
      cena: { nazwa: "Fuel price [{waluta}/l]", cel: "Prices the generator's running cost.", gdzie: "Your price at the station.", zakres: TWOJ_EN },
    },
  },
  "wampiry-energetyczne": {
    migawka: {
      oCoChodzi: "Small, constant standby draw of devices — little on its own, but over a year it regularly eats the battery.",
      jakDziala: "Catalogue and measurement sum the standby draw (daily energy = W × 24 ÷ 1000). Simulations calculate autonomy, annual cost and how much smaller the battery can be after elimination. Recommendations compare disconnection methods (payback = cost ÷ saving × 12 months), automation — standby scenarios.",
      poCo: "Off-grid, every constant watt is battery kilowatt-hours — eliminating standby is often the cheapest “expansion” of the system.",
      fizyka: "E_year = P_standby · 8760 / 1000; t = C · 1000 · DoD / P_standby.",
    },
    pola: {
      podzakladka: { nazwa: "Sub-tab", cel: "Which aspect of energy vampires you are viewing.", gdzie: "Choose from the list.", zakres: "Catalogue, measurement, simulations, recommendations, automation." },
      mocCzuwania: { nazwa: "Standby power [W]", cel: "Device draw in standby mode.", gdzie: "Plug-in meter or device documentation. The catalogue value is a starting point.", zakres: TWOJ_EN },
      nazwa: { nazwa: "Device name", cel: "Only a description of the item — does not affect the result.", gdzie: "Anything.", zakres: "Text." },
      mocJalowa: { nazwa: "Measured idle power [W]", cel: "Draw measured when the device is “doing nothing”.", gdzie: "Plug-in meter — read after a few minutes in standby.", zakres: TWOJ_EN },
      koszt: { nazwa: "Purchase cost [{waluta}]", cel: "Price of the disconnection method (strip, socket, relay).", gdzie: "Your quote.", zakres: "The app does not assume equipment prices." },
      oszczednosc: { nazwa: "Annual saving [{waluta}/year]", cel: "How much you save per year by disconnecting.", gdzie: "E.g. from the “Annual standby cost” simulation.", zakres: TWOJ_EN },
      kategoria: { nazwa: "Device category", cel: "Suggests a disconnection method for this group of devices.", gdzie: "Choose from the list.", zakres: "Categories from the source." },
      standby: STANDBY_EN,
      standbyRedukcja: { nazwa: "Draw after reduction [W] (optional)", cel: "A second scenario for comparison.", gdzie: "Draw after disconnecting some devices.", zakres: "0 = skip the second scenario." },
      pojemnosc: { nazwa: "Usable battery capacity [kWh]", cel: "Energy that feeds the standby.", gdzie: "Battery datasheet or Module 4 sizing.", zakres: TWOJ_EN },
      dod: DOD_EN,
      cenaEnergii: { nazwa: "Energy price [{waluta}/kWh]", cel: "Prices the annual standby cost.", gdzie: "Your price — the source gives no universal value.", zakres: TWOJ_EN },
      zuzycieRoczne: { nazwa: "Total annual house consumption [kWh] (optional)", cel: "Shows the standby share of the total.", gdzie: "Annual balance or meter.", zakres: "0 = skip the share calculation." },
      standbyDobowa: { nazwa: "Daily standby energy [kWh/day]", cel: "Standby energy per day.", gdzie: "From the “Catalogue” or “Measurement” tab.", zakres: TWOJ_EN },
      eliminacja: { nazwa: "Planned standby elimination [%]", cel: "What part of the standby you want to eliminate.", gdzie: "Your plan.", zakres: "0–100%." },
      dniAutonomii: { nazwa: "Days of autonomy", cel: "How many days without sun the battery must last.", gdzie: "From the “Days of autonomy” screen.", zakres: TWOJ_EN },
      sprawnosc: SPRAWNOSC_FALOWNIKA_EN,
      standbyRef: { nazwa: "Reference standby [W]", cel: "Standby draw in normal mode.", gdzie: "From the catalogue or measurement.", zakres: TWOJ_EN },
      standbyScenariusz: { nazwa: "Standby in the scenario [W]", cel: "Standby draw in the chosen automation scenario.", gdzie: "E.g. night mode, absence, working from home, weekend, holiday.", zakres: TWOJ_EN },
    },
  },
}

const TWOJ_RU = "Ваша установка — приложение не подставляет типовое значение за вас."
const DOD_RU = {
  nazwa: "DoD — глубина разряда [%]",
  cel: "Какую часть ёмкости батареи можно реально использовать без сокращения её срока службы.",
  gdzie: "Из технической документации батареи или настроек BMS.",
  zakres: "0–100%. " + TWOJ_RU,
}
const SPRAWNOSC_FALOWNIKA_RU = {
  nazwa: "КПД инвертора [%]",
  cel: "Часть энергии батареи, доходящая до потребителей после потерь в инверторе.",
  gdzie: "Из технической документации инвертора (КПД при типовой нагрузке).",
  zakres: "0–100%. " + TWOJ_RU,
}
const STANDBY_RU = {
  nazwa: "Потребление в режиме ожидания [Вт]",
  cel: "Суммарная мощность, которую устройства потребляют постоянно, даже когда «ничего не делают».",
  gdzie: "С вкладки «Каталог устройств» или «Измерение мощности холостого хода» — или розеточным ваттметром.",
  zakres: TWOJ_RU,
}

export const ru: Tlumaczenie<typeof pl> = {
  "systemy-podtrzymania-zycia": {
    migawka: {
      oCoChodzi: "Список потребителей, без которых дом перестаёт быть безопасным для жизни — водяной насос, отопление, вентиляция, связь.",
      jakDziala: "Вы отмечаете, что для вас критично, и корректируете мощность. Приложение суммирует мощности отмеченных позиций в базовую нагрузку.",
      poCo: "Остальная часть приложения защищает эти потребители в первую очередь — при подборе батареи, отключении нагрузок и аварийных процедурах.",
      fizyka: "P_баз = Σ P_i (отмеченные).",
    },
    pola: {
      moc: { nazwa: "Мощность устройства [Вт]", cel: "Мощность этого потребителя, учитываемая в базовой нагрузке.", gdzie: "Паспортная табличка или измеритель. Начальное значение — лишь отправная точка.", zakres: TWOJ_RU },
    },
  },
  "bojler-cwu": {
    migawka: {
      oCoChodzi: "Бойлер — один из крупнейших «гибких» потребителей в доме: его можно греть, когда светит солнце.",
      jakDziala: "Суточная энергия = литры ГВС × нагрев × удельная теплоёмкость воды; время нагрева = энергия ÷ мощность ТЭНа.",
      poCo: "Вы знаете, сколько часов должен работать ТЭН — и укладывается ли это в окно выработки PV.",
      fizyka: "Q = m · c · ΔT, c_воды = {cWody} Дж/(кг·К) → {kwhNaLK} кВт·ч/(л·К).",
    },
    pola: {
      wolumen: { nazwa: "Суточная потребность в ГВС [л/сут]", cel: "Сколько горячей воды дом расходует в сутки.", gdzie: "С экрана «Число жильцов» (люди × литры на человека) или по водомеру.", zakres: TWOJ_RU },
      deltaT: { nazwa: "Нагрев воды [К]", cel: "На сколько нужно нагреть холодную воду.", gdzie: "Температура ГВС минус температура воды из сети/скважины (напр. 45 °C − 10 °C = 35 К).", zakres: "Источник не даёт значения по умолчанию — введите своё." },
      mocGrzalki: { nazwa: "Мощность ТЭНа [кВт]", cel: "От неё зависит время нагрева.", gdzie: "Табличка ТЭНа.", zakres: TWOJ_RU },
      pojemnosc: { nazwa: "Объём бака [л]", cel: "Проверяет, помещается ли суточная потребность в баке.", gdzie: "Табличка бойлера.", zakres: TWOJ_RU },
    },
  },
  "urzadzenia-zmienne": {
    migawka: {
      oCoChodzi: "В автономной системе старые приборы — это не только больший счёт, но и бо́льшая, более дорогая батарея, чтобы их потянуть.",
      jakDziala: "Для каждого отмеченного прибора: мощность × время работы × множитель класса энергоэффективности (современные {nowoczesne}, стандартные {standardowe}, старые {stare}). Сумма — суточная энергия.",
      poCo: "Вы видите, сколько энергии съедает каждый прибор и что даст замена на новый.",
      fizyka: "E = Σ P_i · t_i · множитель_класса(i).",
    },
    pola: {
      moc: { nazwa: "Мощность прибора [Вт]", cel: "Мощность во время работы.", gdzie: "Паспортная табличка или измеритель.", zakres: TWOJ_RU },
      czas: { nazwa: "Время работы в сутки [мин]", cel: "Сколько минут в сутки прибор реально работает.", gdzie: "Ваши привычки — посчитайте типичный день.", zakres: "0–1440 мин." },
      klasa: { nazwa: "Класс энергоэффективности", cel: "Умножает потребление: современные {nowoczesne}×, стандартные {standardowe}×, старые {stare}×.", gdzie: "Энергетическая этикетка или возраст прибора.", zakres: "Современные / стандартные / старые." },
      mocPlyty: { nazwa: "Мощность индукционной плиты [Вт]", cel: "Суммарная мощность плиты — влияет на пик потребления и энергию на готовку.", gdzie: "Табличка плиты.", zakres: "Типично {sugerowana} Вт — выберите свою." },
      czasGotowania: { nazwa: "Время готовки в сутки [мин/сут]", cel: "Сколько минут в сутки работает плита.", gdzie: "Ваши привычки.", zakres: TWOJ_RU },
    },
  },
  "liczba-domownikow": {
    migawka: {
      oCoChodzi: "Число людей в доме задаёт расход горячей воды — одного из крупнейших потребителей энергии.",
      jakDziala: "Потребность в ГВС = число людей × {cwuMin}–{cwuMax} л на человека в сутки.",
      poCo: "Результат питает экран «Умный бойлер ГВС» и профиль водопотребления.",
      fizyka: "V_ГВС = n × ({cwuMin}–{cwuMax}) л.",
    },
    pola: {
      liczba: { nazwa: "Число жильцов [чел.]", cel: "Сколько человек постоянно живёт в доме.", gdzie: "Посчитайте жильцов (случайные гости — нет).", zakres: "{min}–{max} чел." },
    },
  },
  "profil-astronomiczny": {
    migawka: {
      oCoChodzi: "Суточный профиль — это ещё и то, когда темно: длина ночи резко меняется между летом и зимой.",
      jakDziala: "По широте и дню года приложение рассчитывает склонение Солнца и длину дня; ночь = 24 ч − день. Дополнительно считает потребление прибора, работающего только в темноте.",
      poCo: "Освещение и другие «ночные» потребители в декабре работают на несколько часов дольше, чем в июне — батарея должна это выдержать.",
      fizyka: "δ = {amplituda}° · sin(360/{dniRoku} · ({przesuniecie} + n)); N = (2/15) · arccos(−tg φ · tg δ).",
    },
    pola: {
      szerokosc: { nazwa: "Географическая широта [°]", cel: "От неё зависит длина дня и ночи.", gdzie: "По карте или из Модуля 1 (местоположение).", zakres: "−90…90° (Польша ок. 49–55°)." },
      dzienRoku: { nazwa: "День года [1–365]", cel: "Какой день года вы проверяете.", gdzie: "Напр. 21 декабря = 355, 21 июня = 172.", zakres: "1–365." },
      moc: { nazwa: "Мощность прибора, работающего в темноте [Вт] (необязательно)", cel: "Показывает, сколько энергии за ночь съедает, напр., наружное освещение.", gdzie: "Табличка светильника/прибора.", zakres: "Пусто = пропущено." },
    },
  },
  sezonowosc: {
    migawka: {
      oCoChodzi: "Не каждый прибор работает круглый год — кондиционер зимой стоит, снегоуборщик летом не существует.",
      jakDziala: "Для проверяемого месяца приложение проверяет, активен ли прибор (круглогодичный — всегда, сезонный — в диапазоне месяцев, выходного дня — только в выходные). Активен — его энергия учитывается, неактивен — ноль.",
      poCo: "Баланс месяца не завышен приборами, которые в это время стоят.",
    },
    pola: {
      energia: { nazwa: "Потребность прибора [кВт·ч/сут]", cel: "Энергия в период, когда прибор работает.", gdzie: "С экрана приборов или по счётчику.", zakres: TWOJ_RU },
      typ: { nazwa: "Тип сезонности", cel: "Когда прибор работает: круглый год, в выбранные месяцы или в выходные.", gdzie: "Как вы им пользуетесь.", zakres: "Круглогодичный / сезонный / выходного дня." },
      miesiacOd: { nazwa: "Месяц начала сезона [1–12]", cel: "С какого месяца прибор работает.", gdzie: "Напр. кондиционер: июнь = 6.", zakres: "1–12. Сезон может переходить через Новый год (напр. 11 → 3)." },
      miesiacDo: { nazwa: "Месяц конца сезона [1–12]", cel: "До какого месяца прибор работает.", gdzie: "Напр. кондиционер: сентябрь = 9.", zakres: "1–12." },
      miesiac: { nazwa: "Проверяемый месяц [1–12]", cel: "Месяц, для которого считается баланс.", gdzie: "Ваш выбор — обычно худший месяц (декабрь).", zakres: "1–12." },
    },
  },
  "dni-autonomii": {
    migawka: {
      oCoChodzi: "Сколько дней без солнца система должна продержаться только на батарее — чем больше, тем больше и дороже накопитель.",
      jakDziala: "Вы выбираете число дней. Если ввести также потребность, КПД и DoD — приложение оценит ёмкость: суточная энергия × дни ÷ (КПД × DoD).",
      poCo: "Значение питает подбор ёмкости батареи (Модуль 4, Экран 1).",
      fizyka: "C_полезн = E_сут · d / (η · DoD).",
    },
    pola: {
      dni: { nazwa: "Дни автономии", cel: "Сколько пасмурных дней подряд система должна пережить без солнца и генератора.", gdzie: "Ваше решение — зависит от климата и наличия генератора.", zakres: "На выбор: {opcje} дн." },
      zapotrzebowanie: { nazwa: "Суточная потребность [кВт·ч]", cel: "Энергия, расходуемая за сутки.", gdzie: "Из баланса Модуля 2.", zakres: TWOJ_RU },
      sprawnosc: SPRAWNOSC_FALOWNIKA_RU,
      dod: DOD_RU,
    },
  },
  "moc-pozorna-cosfi": {
    migawka: {
      oCoChodzi: "Ватты на табличке — не вся история: двигатели и компрессоры нагружают инвертор полной мощностью (ВА), а не только активной (Вт).",
      jakDziala: "Полная мощность = активная мощность ÷ cos φ. Инвертор нужно подбирать по ВА, а не по Вт.",
      poCo: "Инвертор, подобранный «по ваттам», может не потянуть холодильник или насос.",
      fizyka: "S [ВА] = P [Вт] / cos φ.",
    },
    pola: {
      moc: { nazwa: "Активная мощность прибора [Вт]", cel: "Мощность, совершающая работу.", gdzie: "Табличка прибора с двигателем/компрессором.", zakres: TWOJ_RU },
      cosFi: { nazwa: "Коэффициент мощности cos φ", cel: "Какая часть полной мощности — активная.", gdzie: "Табличка двигателя (cos φ).", zakres: "0–1. По умолчанию {cosFi} для приборов с двигателем." },
    },
  },
  "pobor-wlasny-falownika": {
    migawka: {
      oCoChodzi: "Инвертор сам что-то потребляет, просто чтобы быть готовым к работе — невидимая, но постоянная статья расхода.",
      jakDziala: "Суточные потери = потребление холостого хода × 24 ч ÷ 1000.",
      poCo: "Эти кВт·ч нужно добавить в баланс — зимой они могут съесть заметную часть выработки.",
      fizyka: "E_сут = P_хх · 24 / 1000.",
    },
    pola: {
      pobor: { nazwa: "Потребление на холостом ходу [Вт]", cel: "Мощность, потребляемая инвертором без нагрузки.", gdzie: "Техническая документация («no-load consumption»).", zakres: "Типично 20–100 Вт. По умолчанию {domyslny} Вт, если модель неизвестна." },
    },
  },
  "sprawnosc-inwertera-niskie-obciazenie": {
    migawka: {
      oCoChodzi: "Слишком большой инвертор относительно нагрузки — как езда на высшей передаче по городу: работает, но неэффективно.",
      jakDziala: "Реальное потребление = потребность ÷ КПД при этой нагрузке; приложение показывает также загрузку инвертора в % мощности. Лучший КПД обычно при {optMin}–{optMax}% мощности, ниже {prog}% он заметно падает.",
      poCo: "Вы видите, сколько энергии теряете, когда большой инвертор питает малые нагрузки (напр. ночью).",
      fizyka: "P_реал = P_потр / η.",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Текущая потребность [Вт]", cel: "Мощность потребителей в проверяемый момент.", gdzie: "Сумма включённых потребителей или показание инвертора.", zakres: TWOJ_RU },
      mocFalownika: { nazwa: "Номинальная мощность инвертора [Вт]", cel: "С ней сравнивается нагрузка.", gdzie: "Техническая документация инвертора.", zakres: TWOJ_RU },
      sprawnosc: { nazwa: "КПД инвертора при этой нагрузке [%]", cel: "Часть энергии, доходящая до потребителей.", gdzie: "Кривая КПД производителя — типично ~95% при 40–80% нагрузки, 70–80% ниже 10%.", zakres: "0–100%." },
    },
  },
  "przetwornice-dcdc": {
    migawka: {
      oCoChodzi: "Каждое преобразование напряжения стоит энергии — иногда лучше питать устройство прямо от шины на его родном напряжении.",
      jakDziala: "Реальная потребность = мощность устройства ÷ КПД преобразователя; разница — потери.",
      poCo: "Показывает, во что обходится преобразователь, работающий 24 часа в сутки.",
      fizyka: "P_реал = P_устр / η_преобр.",
    },
    pola: {
      moc: { nazwa: "Потребляемая мощность устройства [Вт]", cel: "Мощность на выходе преобразователя.", gdzie: "Табличка устройства.", zakres: TWOJ_RU },
      sprawnosc: { nazwa: "КПД преобразователя DC/DC [%]", cel: "Часть мощности, проходящая через преобразователь.", gdzie: "Техническая документация преобразователя.", zakres: "Типично {min}–{max}%." },
    },
  },
  "load-shedding": {
    migawka: {
      oCoChodzi: "Система сама решает, чем пожертвовать, прежде чем вам пришлось бы делать это вручную при разряженной батарее.",
      jakDziala: "Приоритет 1 (критический) никогда не отключается; приоритет 2 (комфорт) — при SoC ниже {prog2}%; приоритет 3 (избыточный) — при SoC ниже {prog3}% или при отсутствии избытка PV.",
      poCo: "Батарея остаётся для того, что действительно важно.",
    },
    pola: {
      priorytet: { nazwa: "Приоритет потребителя", cel: "Порядок отключения при падении SoC.", gdzie: "Ваше решение — критические берутся с экрана «Системы жизнеобеспечения».", zakres: "1 — критический, 2 — комфорт, 3 — избыточный." },
      soc: { nazwa: "Текущий SoC батареи [%]", cel: "Уровень заряда, для которого проверяется решение.", gdzie: "Дисплей BMS/инвертора.", zakres: "0–100%." },
    },
  },
  "bufor-rozbudowe": {
    migawka: {
      oCoChodzi: "Система, спроектированная только под сегодняшние нужды, через два года окажется мала.",
      jakDziala: "Потребность с запасом = общая потребность × (1 + запас %).",
      poCo: "Осознанное решение, сколько запаса заложить сразу — дешевле, чем расширять потом.",
      fizyka: "E_с_запасом = E · (1 + запас%).",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Общая суточная потребность [кВт·ч]", cel: "Исходная точка без запаса.", gdzie: "Из баланса Модуля 2.", zakres: TWOJ_RU },
      bufor: { nazwa: "Запас на расширение [%]", cel: "Резерв на будущих потребителей (тепловой насос, автомобиль, мастерская).", gdzie: "Ваши планы на несколько лет.", zakres: "На выбор: {opcje}%." },
    },
  },
  "architektura-fazowa": {
    migawka: {
      oCoChodzi: "В трёхфазной системе важна не только сумма мощностей, но и то, насколько равномерно она распределена по фазам — у каждой свой предел.",
      jakDziala: "Асимметрия = (самая нагруженная фаза − наименее нагруженная) ÷ самая нагруженная × 100%.",
      poCo: "Большая асимметрия перегружает одну фазу инвертора, хотя сумма укладывается в его мощность.",
      fizyka: "асимметрия = (P_max − P_min) / P_max · 100%.",
    },
    pola: {
      l1: { nazwa: "Нагрузка L1 [Вт]", cel: "Мощность потребителей на фазе L1.", gdzie: "Щит — распределение цепей по фазам, или измерение.", zakres: TWOJ_RU },
      l2: { nazwa: "Нагрузка L2 [Вт]", cel: "Мощность потребителей на фазе L2.", gdzie: "Как L1.", zakres: "0, если установка однофазная." },
      l3: { nazwa: "Нагрузка L3 [Вт]", cel: "Мощность потребителей на фазе L3.", gdzie: "Как L1.", zakres: "0, если установка однофазная." },
    },
  },
  "kategorie-specjalne": {
    migawka: {
      oCoChodzi: "Вместо пустого списка вы выбираете профиль (мастерская, хозяйство, наружное освещение) и получаете отправную точку.",
      jakDziala: "Суточная энергия = сумма (мощность × время работы) по всем позициям.",
      poCo: "Вы быстро видите, сколько энергии добавляет к балансу дома мастерская или хозяйство.",
      fizyka: "E = Σ P_i · t_i.",
    },
    pola: {
      kategoria: { nazwa: "Категория", cel: "Профиль с подсказкой типичных устройств.", gdzie: "Ваш случай.", zakres: "Мастерская / хозяйство / наружное освещение." },
      nazwa: { nazwa: "Название устройства", cel: "Только описание позиции — на результат не влияет.", gdzie: "Любое.", zakres: "Текст." },
      moc: { nazwa: "Мощность [Вт]", cel: "Мощность устройства во время работы.", gdzie: "Паспортная табличка.", zakres: "Источник не даёт мощностей по умолчанию — введите свою." },
      czas: { nazwa: "Время работы [мин/сут]", cel: "Сколько минут в сутки работает устройство.", gdzie: "Ваши привычки.", zakres: "0–1440 мин." },
    },
  },
  pomocnicze: {
    migawka: {
      oCoChodzi: "Карманный калькулятор для быстрых пересчётов на месте, без полного процесса проектирования.",
      jakDziala: "Режимы: мощность → ток (I = P ÷ (U × η)), А·ч → Вт·ч (E = C × U), Вт·ч → А·ч (C = E ÷ U) и оценка времени работы от батареи.",
      poCo: "Быстрый ответ на «сколько ампер», «сколько Вт·ч в этой батарее», «на сколько хватит».",
      fizyka: "I = P / (U · η); E = C · U.",
    },
    pola: {
      tryb: { nazwa: "Режим", cel: "Какой пересчёт выполнить.", gdzie: "Выберите из списка.", zakres: "Мощность → ток, А·ч → Вт·ч, Вт·ч → А·ч, время работы." },
      moc: { nazwa: "Мощность устройства [Вт]", cel: "Мощность потребителя.", gdzie: "Паспортная табличка.", zakres: TWOJ_RU },
      napiecie: { nazwa: "Напряжение системы [В]", cel: "Напряжение батареи/шины DC.", gdzie: "Типично 12, 24 или 48 В.", zakres: TWOJ_RU },
      pojemnosc: { nazwa: "Ёмкость [А·ч]", cel: "Ёмкость батареи.", gdzie: "Табличка батареи.", zakres: TWOJ_RU },
      energia: { nazwa: "Энергия [Вт·ч]", cel: "Энергия для пересчёта в А·ч.", gdzie: "Табличка батареи или результат баланса.", zakres: TWOJ_RU },
      sprawnosc: { nazwa: "КПД системы [0–1] (необязательно)", cel: "Потери инвертора/преобразователя при расчёте тока.", gdzie: "Техническая документация инвертора.", zakres: "{min}–{max}. Пусто = {domyslna}." },
    },
  },
  "agregat-pradotworczy": {
    migawka: {
      oCoChodzi: "Если в худший месяц PV не покрывает потребность, дефицит покрывает генератор.",
      jakDziala: "Часы работы = дефицит ÷ (мощность генератора × {obciazenie}% оптимальной нагрузки); топливо = часы × расход; стоимость = топливо × цена.",
      poCo: "Вы знаете, сколько часов, литров и злотых стоит зима — и стоит ли добавить панелей или батарею.",
      fizyka: "t = дефицит / (P · {obciazenie}%); топливо = t · расход; стоимость = топливо · цена.",
    },
    pola: {
      deficyt: { nazwa: "Энергетический дефицит в худший месяц [кВт·ч]", cel: "Энергия, которую PV не покроет.", gdzie: "Потребность минус выработка PV в этом месяце (годовой баланс).", zakres: TWOJ_RU },
      moc: { nazwa: "Номинальная мощность генератора [кВт]", cel: "По ней рассчитываются часы работы.", gdzie: "Табличка генератора.", zakres: TWOJ_RU },
      zuzycie: { nazwa: "Средний расход топлива [л/ч]", cel: "Расход при оптимальной нагрузке.", gdzie: "Техническая документация генератора — при ок. 70–80% мощности.", zakres: TWOJ_RU },
      cena: { nazwa: "Цена топлива [{waluta}/л]", cel: "Оценивает стоимость работы генератора.", gdzie: "Ваша цена на заправке.", zakres: TWOJ_RU },
    },
  },
  "wampiry-energetyczne": {
    migawka: {
      oCoChodzi: "Мелкое постоянное потребление устройств в режиме ожидания — по отдельности немного, но за год регулярно съедает батарею.",
      jakDziala: "Каталог и измерение суммируют потребление в ожидании (энергия в сутки = Вт × 24 ÷ 1000). Симуляции считают автономию, годовую стоимость и насколько меньше может быть батарея после устранения. Рекомендации сравнивают способы отключения (окупаемость = стоимость ÷ экономия × 12 мес.), автоматизация — сценарии ожидания.",
      poCo: "В автономной системе каждый постоянный ватт — это киловатт-часы батареи; устранение ожидания часто самое дешёвое «расширение» системы.",
      fizyka: "E_год = P_ожид · 8760 / 1000; t = C · 1000 · DoD / P_ожид.",
    },
    pola: {
      podzakladka: { nazwa: "Подвкладка", cel: "Какой аспект «энергетических вампиров» вы смотрите.", gdzie: "Выберите из списка.", zakres: "Каталог, измерение, симуляции, рекомендации, автоматизация." },
      mocCzuwania: { nazwa: "Мощность в режиме ожидания [Вт]", cel: "Потребление устройства в режиме ожидания.", gdzie: "Розеточный ваттметр или документация устройства. Значение из каталога — отправная точка.", zakres: TWOJ_RU },
      nazwa: { nazwa: "Название устройства", cel: "Только описание позиции — на результат не влияет.", gdzie: "Любое.", zakres: "Текст." },
      mocJalowa: { nazwa: "Измеренная мощность холостого хода [Вт]", cel: "Потребление, измеренное, когда устройство «ничего не делает».", gdzie: "Розеточный ваттметр — показание через несколько минут ожидания.", zakres: TWOJ_RU },
      koszt: { nazwa: "Стоимость покупки [{waluta}]", cel: "Цена способа отключения (удлинитель, розетка, реле).", gdzie: "Ваше предложение.", zakres: "Приложение не предполагает цен оборудования." },
      oszczednosc: { nazwa: "Годовая экономия [{waluta}/год]", cel: "Сколько вы сэкономите в год благодаря отключению.", gdzie: "Напр. из симуляции «Годовая стоимость ожидания».", zakres: TWOJ_RU },
      kategoria: { nazwa: "Категория устройства", cel: "Подсказывает способ отключения для этой группы устройств.", gdzie: "Выберите из списка.", zakres: "Категории из источника." },
      standby: STANDBY_RU,
      standbyRedukcja: { nazwa: "Потребление после сокращения [Вт] (необязательно)", cel: "Второй сценарий для сравнения.", gdzie: "Потребление после отключения части устройств.", zakres: "0 = пропустить второй сценарий." },
      pojemnosc: { nazwa: "Полезная ёмкость батареи [кВт·ч]", cel: "Энергия, питающая режим ожидания.", gdzie: "Документация батареи или подбор из Модуля 4.", zakres: TWOJ_RU },
      dod: DOD_RU,
      cenaEnergii: { nazwa: "Цена энергии [{waluta}/кВт·ч]", cel: "Оценивает годовую стоимость ожидания.", gdzie: "Ваша цена — источник не даёт универсального значения.", zakres: TWOJ_RU },
      zuzycieRoczne: { nazwa: "Общее годовое потребление дома [кВт·ч] (необязательно)", cel: "Показывает долю ожидания в общем потреблении.", gdzie: "Годовой баланс или счётчик.", zakres: "0 = пропустить расчёт доли." },
      standbyDobowa: { nazwa: "Суточная энергия ожидания [кВт·ч/сут]", cel: "Энергия ожидания за сутки.", gdzie: "С вкладки «Каталог» или «Измерение».", zakres: TWOJ_RU },
      eliminacja: { nazwa: "Планируемое устранение ожидания [%]", cel: "Какую часть ожидания вы хотите устранить.", gdzie: "Ваш план.", zakres: "0–100%." },
      dniAutonomii: { nazwa: "Дни автономии", cel: "Сколько дней без солнца должна продержаться батарея.", gdzie: "С экрана «Дни автономии».", zakres: TWOJ_RU },
      sprawnosc: SPRAWNOSC_FALOWNIKA_RU,
      standbyRef: { nazwa: "Эталонное ожидание [Вт]", cel: "Потребление в ожидании в обычном режиме.", gdzie: "Из каталога или измерения.", zakres: TWOJ_RU },
      standbyScenariusz: { nazwa: "Ожидание в сценарии [Вт]", cel: "Потребление в ожидании в выбранном сценарии автоматизации.", gdzie: "Напр. ночной режим, отсутствие, работа из дома, выходные, отпуск.", zakres: TWOJ_RU },
    },
  },
}
