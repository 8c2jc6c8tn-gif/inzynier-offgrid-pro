/**
 * Help content — Module 6 (heating). Numbers kept by the engines as constants enter through
 * `{params}`; the app never assumes a user value (Directive #1). Screens without a formula in the
 * source (noise, ground-source freezing) get a snapshot only — no invented physics.
 */
import type { Tlumaczenie } from "./typy"

const TWOJ = "Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie."
const NAZWA = { nazwa: "Nazwa", cel: "Tylko opis pozycji — nie wpływa na wynik.", gdzie: "Dowolna.", zakres: "Tekst." }
const DELTA_T = {
  nazwa: "Różnica temperatur wewnątrz/na zewnątrz [K]",
  cel: "Im większa różnica, tym więcej ciepła ucieka z wymienianym powietrzem.",
  gdzie: "Temperatura w domu minus temperatura na zewnątrz w analizowanym okresie (1 K = 1 °C różnicy).",
  zakres: "≥ 0. " + TWOJ,
}
const T_DOM = { nazwa: "Temperatura w domu [°C]", cel: "Temperatura, którą chcesz utrzymać zimą.", gdzie: "Jaką chcesz utrzymać zimą.", zakres: TWOJ }

export const pl = {
  "bufor-ciepla": {
    migawka: {
      oCoChodzi: "Bufor to termos dla ciepła — gromadzi je, gdy jest „tanio” (słońce świeci), i oddaje, gdy jest „drogo” (noc, chmury).",
      jakDziala: "Zalecana pojemność = moc pompy ciepła × {lkw} l/kW. Porównuję ją z pojemnością, którą masz albo planujesz. Niżej: ile startów na dobę pompa robi bez bufora i z nim, ile ciepła bufor zmagazynuje z PV i ile traci postojowo.",
      poCo: "Wiesz, czy bufor pozwoli pompie pracować w dzień na prądzie z PV i oddać ciepło w nocy — i czy nie będzie taktować.",
      fizyka: "V_zal = P · {lkw} l/kW.",
    },
    pola: {
      moc: { nazwa: "Moc pompy ciepła [kW]", cel: "Od niej liczona jest zalecana pojemność bufora.", gdzie: "Karta katalogowa pompy — nominalna moc grzewcza.", zakres: "≥ 0. " + TWOJ },
      pojemnosc: { nazwa: "Posiadana/planowana pojemność bufora [l]", cel: "Porównywana z zalecaną pojemnością ({lkw} l na każdy kW mocy pompy).", gdzie: "Tabliczka zbiornika albo oferta.", zakres: "≥ 0. " + TWOJ },
    },
  },
  "cop-pompy-ciepla": {
    migawka: {
      oCoChodzi: "COP to „mnożnik” — pompa ciepła nie produkuje ciepła z niczego, tylko przenosi je z zewnątrz, zużywając mniej prądu niż grzałka elektryczna.",
      jakDziala: "Moc elektryczna = zapotrzebowanie na moc cieplną ÷ COP przy aktualnej temperaturze. Niżej: dobór mocy pompy do budynku (zapas albo brak mocy w największy mróz, ile dogrzewania, punkt biwalentny) i krzywa grzewcza (o ile niższe zasilanie i jaki COP po jej obniżeniu).",
      poCo: "Wiesz, ile prądu z baterii albo PV pobierze pompa w danych warunkach — i ile więcej w mróz, gdy COP spada.",
      fizyka: "P_el = P_ciepl / COP.",
    },
    pola: {
      moc: { nazwa: "Zapotrzebowanie na moc cieplną [kW]", cel: "Ile ciepła pompa ma dostarczyć.", gdzie: "Z ekranu „Straty ciepła budynku” albo od projektanta.", zakres: "Do {mocMax} kW. " + TWOJ },
      cop: { nazwa: "COP przy aktualnej temperaturze [–]", cel: "Ile kWh ciepła pompa daje z 1 kWh prądu w tej temperaturze zewnętrznej.", gdzie: "Karta katalogowa pompy — tabela COP dla temperatur zewnętrznych (np. A2/W35, A−7/W35).", zakres: "{min}–{max}." },
    },
  },
  "halas-i-wibracje": {
    migawka: {
      oCoChodzi: "Pompa ciepła to maszyna z wentylatorem i sprężarką — jak stoi pod oknem sypialni, nie da Ci spać, a sąsiad może złożyć skargę.",
      jakDziala: "Treść informacyjna: czynniki wpływające na hałas (moc akustyczna, miejsce montażu, odległość od okien, lokalna norma nocna) i zalecenia. Źródło nie podaje wzoru propagacji akustycznej, więc aplikacja nie liczy poziomu hałasu.",
      poCo: "Wiesz, co sprawdzić i co zrobić, zanim postawisz jednostkę zewnętrzną.",
    },
    pola: {},
  },
  "infiltracja-powietrza": {
    migawka: {
      oCoChodzi: "Szpary w budynku to darmowa wentylacja, ale zimą płacisz za nią ciepłem — lepiej mieć kontrolowaną wymianę powietrza niż przypadkową.",
      jakDziala: "Strata = liczba wymian na godzinę × kubatura × gęstość i ciepło właściwe powietrza × różnica temperatur.",
      poCo: "Wiesz, ile mocy grzewczej zjada nieszczelność — i czy uszczelnienie się opłaci.",
      fizyka: "Q = n · V · ρ · c_p · ΔT / 3600.",
    },
    pola: {
      wymiany: { nazwa: "Wymiany powietrza na godzinę [1/h]", cel: "Ile razy na godzinę całe powietrze w domu wymienia się przez nieszczelności.", gdzie: "Z testu szczelności (blower door) lub szacunek na podstawie typu konstrukcji.", zakres: "≥ 0. " + TWOJ },
      kubatura: { nazwa: "Kubatura budynku [m³]", cel: "Objętość powietrza, które się wymienia.", gdzie: "Powierzchnia × wysokość pomieszczeń.", zakres: "≥ 0. " + TWOJ },
      deltaT: DELTA_T,
    },
  },
  "kociol-elektryczny": {
    migawka: {
      oCoChodzi: "Kocioł elektryczny ma sprawność blisko 100%, ale to nie to samo co tanie ogrzewanie — pompa ciepła nie produkuje ciepła z prądu, tylko przenosi je z zewnątrz, więc zużywa kilka razy mniej.",
      jakDziala: "Prąd = ciepło ÷ COP (kocioł: COP = 1, pompa: Twój COP). Koszt = prąd × cena energii.",
      poCo: "Widzisz różnicę w kWh i pieniądzach — w off-gridzie to różnica w wielkości PV i baterii.",
      fizyka: "E = Q / COP; K = E · c.",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Zapotrzebowanie na ciepło do pokrycia [kWh]", cel: "Ciepło, które ma dostarczyć kocioł albo pompa.", gdzie: "Z ekranu „Zapotrzebowanie na C.O. i C.W.U.” albo z zużycia w poprzednich sezonach.", zakres: "≥ 0. " + TWOJ },
      cop: { nazwa: "COP pompy ciepła [–]", cel: "Ile kWh ciepła pompa daje z 1 kWh prądu.", gdzie: "Karta katalogowa albo ekran „COP pompy ciepła”. Typowe pompy powietrze-woda: 1,5–6, zależnie od temperatury.", zakres: "≥ 0. " + TWOJ },
      cena: { nazwa: "Cena energii elektrycznej [{waluta}/kWh]", cel: "Przelicza kWh na pieniądze.", gdzie: "Rachunek, koszt z agregatu albo wycena prądu z PV.", zakres: "≥ 0. " + TWOJ },
    },
  },
  "koszty-ogrzewania": {
    migawka: {
      oCoChodzi: "Nie daj się zwieść tanim paliwom. Licz koszt całkowity, nie tylko cenę za kg.",
      jakDziala: "Dla każdego źródła: koszt 1 kWh ciepła (paliwo: cena ÷ (wartość opałowa × sprawność); nagrzewnica: cena × zużycie ÷ moc; prąd: cena ÷ COP). Koszt całkowity = zakup + liczba lat × (ciepło × koszt kWh + serwis).",
      poCo: "Widzisz, które źródło naprawdę wychodzi najtaniej w {lata} lat — i ile prądu zimą potrzebuje z Twojej instalacji off-grid.",
      fizyka: "c_Q = c / (WO · η) | c · V̇ / P | c_el / COP;  K = I + n · (Q · c_Q + S).",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Ciepło potrzebne w sezonie [kWh]", cel: "Ile ciepła każde źródło musi dostarczyć w sezonie.", gdzie: "Z zużycia w poprzednich sezonach, od projektanta albo suma miesięcy z ekranu „Straty ciepła budynku”.", zakres: "≥ 0. " + TWOJ },
      liczbaLat: { nazwa: "Okres analizy [lat]", cel: "Przez ile lat sumowany jest koszt paliwa i serwisu.", gdzie: "Źródło proponuje {lata} lat. Możesz zmienić.", zakres: "≥ 1." },
      rodzaj: { nazwa: "Rodzaj źródła", cel: "Decyduje, jak liczony jest koszt 1 kWh ciepła (paliwo, karta nagrzewnicy albo prąd) i które pola są potrzebne.", gdzie: "Urządzenie, które masz albo rozważasz.", zakres: "Lista." },
      nazwa: { ...NAZWA, zakres: "Tekst. Puste = nazwa rodzaju." },
      jednostka: { nazwa: "Jednostka paliwa", cel: "W niej podajesz cenę, wartość opałową i zużycie.", gdzie: "Tak, jak kupujesz paliwo. mp — metr przestrzenny (drewno układane).", zakres: "kg, t, mp, m³, l." },
      cenaZl: { nazwa: "Cena", cel: "Cena jednostki paliwa albo 1 kWh prądu.", gdzie: "Paliwo: faktura lub oferta. Prąd: Twój koszt 1 kWh prądu zimą (z agregatu, z sieci albo wyceniony z PV).", zakres: "≥ 0. " + TWOJ },
      wartoscOpalowaKwh: { nazwa: "Wartość opałowa [kWh/jedn.]", cel: "Ile energii jest w jednostce paliwa.", gdzie: "Od dostawcy albo z certyfikatu paliwa. Dla drewna zależy mocno od wilgotności.", zakres: "≥ 0. " + TWOJ },
      sprawnoscPct: { nazwa: "Sprawność urządzenia [%]", cel: "Jaka część energii paliwa trafia do domu jako ciepło.", gdzie: "Z karty katalogowej kotła, pieca lub kominka.", zakres: "0–100%. " + TWOJ },
      mocGrzewczaKw: { nazwa: "Moc grzewcza [kW]", cel: "Nagrzewnica: razem ze zużyciem daje koszt 1 kWh ciepła. Kocioł na paliwo (opcjonalnie): potrzebna, żeby policzyć godziny pracy i prąd pomocniczy.", gdzie: "Z karty katalogowej urządzenia.", zakres: "≥ 0. " + TWOJ },
      zuzyciePaliwaNaH: { nazwa: "Zużycie paliwa przy tej mocy [jedn./h]", cel: "Razem z mocą daje koszt 1 kWh ciepła z nagrzewnicy.", gdzie: "Z karty katalogowej.", zakres: "≥ 0. " + TWOJ },
      cop: { nazwa: "COP (średni w sezonie) [–]", cel: "Ile kWh ciepła pompa daje z 1 kWh prądu średnio w sezonie.", gdzie: "SCOP z karty albo z ekranu „COP pompy ciepła”.", zakres: "≥ 0. " + TWOJ },
      poborPraduW: { nazwa: "Pobór prądu w pracy [W] (opcjonalnie)", cel: "Prąd pomocniczy źródła paliwowego — w off-gridzie musi go dać Twoja instalacja.", gdzie: "Wentylator, podajnik, pompa, świeca — z karty.", zakres: "Puste = prąd pomocniczy nie jest liczony." },
      kosztInwestycjiZl: { nazwa: "Koszt zakupu i montażu [{waluta}]", cel: "Jednorazowy koszt, doliczany do kosztu całkowitego i zwrotu.", gdzie: "Oferta. 0 — jeśli już masz to urządzenie.", zakres: "≥ 0." },
      kosztSerwisuRocznyZl: { nazwa: "Serwis i przeglądy rocznie [{waluta}]", cel: "Koszt stały doliczany za każdy rok analizy.", gdzie: "Np. przegląd, czyszczenie komina, części.", zakres: "≥ 0." },
    },
  },
  "mostki-termiczne": {
    migawka: {
      oCoChodzi: "To jak dziura w swetrze — nawet jak reszta jest ciepła, przez dziurę ucieka mnóstwo energii, nieproporcjonalnie do jej wielkości.",
      jakDziala: "Każdy mostek liniowy: Ψ × długość. Suma daje dodatkowy współczynnik strat, który mnożę przez różnicę temperatur z Ekranu 1 i porównuję ze stratami przez przegrody.",
      poCo: "Wiesz, ile ciepła ucieka przez narożniki, nadproża, balkony i ościeża — i ile da ich poprawa.",
      fizyka: "H_tb = Σ Ψ · l;  Φ_tb = H_tb · (θ_i − θ_e).",
    },
    pola: {
      detal: { nazwa: "Detal z PN-EN ISO 14683", cel: "Wstawia wartość Ψ z tablicy normy dla typowego połączenia.", gdzie: "Wybierz detal najbliższy Twojemu połączeniu albo zostaw „własna wartość Ψ”.", zakres: "Opcjonalnie." },
      nazwa: NAZWA,
      dlugosc: { nazwa: "Długość [m]", cel: "Straty mostka rosną z jego długością.", gdzie: "Łączna długość takich połączeń w domu — z rzutów i przekrojów.", zakres: "≥ 0. " + TWOJ },
      psi: { nazwa: "Ψ [W/(m·K)]", cel: "Liniowy współczynnik przenikania ciepła — ile W ucieka na metr połączenia przy 1 K różnicy.", gdzie: "Z katalogu mostków cieplnych albo od projektanta.", zakres: TWOJ },
      psiPo: { nazwa: "Ψ po poprawie [W/(m·K)] (opcjonalnie)", cel: "Pokazuje, ile daje poprawa detalu.", gdzie: "Np. po dociepleniu ościeży — z katalogu albo od projektanta.", zakres: "Puste = bez wariantu poprawy." },
      nadproze: { nazwa: "Nadproże nad oknem bez izolacji", cel: "Oznacza mostek jako nadproże bez izolacji — aplikacja wskaże go jako typowe miejsce ryzyka.", gdzie: "Oględziny albo projekt.", zakres: "Tak / nie." },
      system: { nazwa: "Jak mierzone są powierzchnie na Ekranie 1", cel: "Ψ z tablicy zależy od systemu wymiarów (zewnętrzne, wewnętrzne całkowite, wewnętrzne) — suma strat nie.", gdzie: "Potrzebne tylko dla detali z tablicy. Tak, jak liczyłeś powierzchnie przegród na Ekranie 1.", zakres: "Ψe / Ψoi / Ψi." },
    },
  },
  "obciazenie-cieplne": {
    migawka: {
      oCoChodzi: "Dom zimą to wiadro z dziurami — ogrzewanie musi dolewać tyle, ile wycieka.",
      jakDziala: "Straty przez przegrody (U × A × różnica temperatur) plus straty z wymienianym powietrzem, w najzimniejszym dniu dla Twojej strefy klimatycznej. Dla miesięcy — ze średniej temperatury miesiąca; z COP przeliczam ciepło na prąd. Pod wynikiem: raport — co traci najwięcej ciepła (ranking z wentylacją), ciepło na m² w roku i roczny koszt ogrzewania. U przegrody wpisujesz albo liczysz z jej warstw (U = 1/(Rsi + Σ grubość/λ + Rse), PN-EN ISO 6946, bez mostków cieplnych — dla ściany szkieletowej to wartość zbyt optymistyczna).",
      poCo: "To moc, którą musi dać ogrzewanie — w off-gridzie od niej zależy, ile prądu albo paliwa potrzebujesz zimą.",
      fizyka: "Φ = Σ U·A·Δθ + n·V·ρ·c_p/3600·Δθ;  Q = Φ · 24 h;  E_el = Q / COP.",
    },
    pola: {
      nazwa: NAZWA,
      powierzchnia: { nazwa: "Powierzchnia [m²]", cel: "Straty przez przegrodę rosną z jej powierzchnią.", gdzie: "Z projektu albo pomiaru. Ściany — bez okien i drzwi (te wpisz osobno).", zakres: "≥ 0. " + TWOJ },
      u: { nazwa: "Współczynnik U [W/(m²·K)]", cel: "Ile W ucieka przez 1 m² przy 1 K różnicy temperatur.", gdzie: "Z projektu, świadectwa energetycznego albo karty okna.", zakres: "≥ 0. " + TWOJ },
      strona: { nazwa: "Po drugiej stronie", cel: "Decyduje, czy liczę z temperaturą zewnętrzną strefy, czy z Twoją temperaturą po drugiej stronie.", gdzie: "Powietrze zewnętrzne albo grunt / nieogrzewane pomieszczenie.", zakres: "Lista." },
      tempStrona: { nazwa: "Temperatura po drugiej stronie [°C]", cel: "Temperatura gruntu albo nieogrzewanego pomieszczenia za przegrodą.", gdzie: "Np. grunt pod podłogą, nieogrzewany strych lub garaż — Twoja ocena albo z projektu.", zakres: TWOJ },
      strefa: { nazwa: "Strefa klimatyczna", cel: "Wyznacza projektową temperaturę zewnętrzną najzimniejszego dnia.", gdzie: "Z mapy stref klimatycznych Polski (PN-82/B-02403 / PN-EN 12831).", zakres: "Strefy I–V." },
      tempDom: T_DOM,
      kubatura: { nazwa: "Kubatura ogrzewana [m³]", cel: "Objętość powietrza, które trzeba ogrzać przy wymianie.", gdzie: "Powierzchnia × wysokość pomieszczeń.", zakres: "≥ 0. " + TWOJ },
      wymiany: { nazwa: "Wymiany powietrza [1/h]", cel: "Ile razy na godzinę wymienia się powietrze w domu.", gdzie: "Nieszczelności + wentylacja. Wynik testu szczelności albo od projektanta; odzysk ciepła wpisz osobno.", zakres: "≥ 0. " + TWOJ },
      cop: { nazwa: "COP ogrzewania [–] (opcjonalnie)", cel: "Przelicza ciepło na prąd.", gdzie: "Grzałka, kocioł elektryczny: 1. Pompa ciepła: z karty albo z ekranu „COP pompy ciepła”.", zakres: "Puste = bez przeliczenia na prąd." },
      odzysk: { nazwa: "Odzysk ciepła z wentylacji [%] (opcjonalnie)", cel: "O tyle procent zmniejsza stratę wentylacyjną rekuperator.", gdzie: "Sprawność rekuperatora z karty centrali (deklarowana). Zakładam, że cała wpisana wymiana powietrza przechodzi przez rekuperator — jeśli część to nieszczelności, wpisz mniejszą wartość.", zakres: "0–100. Puste = bez odzysku. " + TWOJ },
      zrodlo: { nazwa: "Źródło ciepła", cel: "Prąd (grzałka, kocioł elektryczny, pompa ciepła) wchodzi do bilansu zimy na panelach; paliwo (drewno, węgiel, gaz, olej) liczy, na jak długo starczy zapasu.", gdzie: "Wybierz to, czym faktycznie grzejesz.", zakres: "Lista." },
      paliwoJednostka: { nazwa: "Jednostka paliwa", cel: "Tylko opis w wyniku (np. kg, l, m³, mp).", gdzie: "Tak, jak kupujesz paliwo.", zakres: "Dowolny krótki tekst." },
      paliwoWo: { nazwa: "Wartość opałowa [kWh/jednostkę]", cel: "Ile ciepła daje jednostka paliwa przy spaleniu.", gdzie: "Od sprzedawcy paliwa albo z jego karty — aplikacja nie podaje wartości domyślnej, bo zależy od gatunku i wilgotności.", zakres: "> 0. " + TWOJ },
      paliwoSprawnosc: { nazwa: "Sprawność kotła lub pieca [%]", cel: "Jaka część ciepła ze spalania trafia do domu.", gdzie: "Z karty kotła lub pieca.", zakres: "Powyżej 0 do 100. " + TWOJ },
      paliwoZapas: { nazwa: "Zapas paliwa [jednostek]", cel: "Z niego liczę, na ile dni i jaką część roku wystarczy.", gdzie: "Ile paliwa masz albo planujesz zmagazynować.", zakres: "≥ 0. " + TWOJ },
      kierunek: { nazwa: "Kierunek strumienia ciepła", cel: "Od niego zależą opory przejmowania ciepła przy powierzchniach (Rsi 0,10 / 0,13 / 0,17 m²·K/W, Rse 0,04) w obliczeniu U z warstw.", gdzie: "Ściana — poziomo, dach lub strop pod nieogrzewanym strychem — w górę, podłoga — w dół.", zakres: "Lista (PN-EN ISO 6946:2017, tablica 7)." },
      warstwaNazwa: { nazwa: "Nazwa warstwy", cel: "Tylko dla Ciebie — pomaga odróżnić warstwy.", gdzie: "Np. płyta OSB, wełna, płyta gipsowo-kartonowa.", zakres: "Dowolny tekst." },
      warstwaGrubosc: { nazwa: "Grubość warstwy [mm]", cel: "Opór warstwy to grubość podzielona przez λ.", gdzie: "Z projektu albo pomiaru. Podaj grubość samej warstwy, nie całej przegrody.", zakres: "> 0. " + TWOJ },
      warstwaLambda: { nazwa: "Przewodność cieplna λ [W/(m·K)]", cel: "Im mniejsza λ, tym lepiej warstwa izoluje.", gdzie: "λ deklarowane z karty produktu. Materiał z biblioteki wstawia wartość przejętą z Inżyniera Szkieletowego Pro wraz z jej statusem (zwykle „orientacyjna”) — nie zgaduję przewodności materiałów; własna wartość z karty zawsze wygrywa.", zakres: "> 0. " + TWOJ },
      szablonPrzegrody: { nazwa: "Gotowa przegroda (szablon warstw)", cel: "Wypełnia warstwy typową przegrodą szkieletową i ustawia kierunek strumienia ciepła.", gdzie: "Wybierz najbliższą swojej przegrodzie; potem popraw grubości i materiały. Podmienia wszystkie wpisane dotąd warstwy tej przegrody.", zakres: "Szablon bez membran i szczelin (nie mają λ). Mostki cieplne nie są uwzględnione." },
      materialWarstwy: { nazwa: "Materiał z biblioteki", cel: "Wstawia nazwę i λ materiału (oraz typową grubość, jeśli pole jest puste).", gdzie: "Lista z Inżyniera Szkieletowego Pro. Poniżej widać status λ: karta producenta, norma albo orientacyjna.", zakres: "Wpisanie własnej λ odłącza materiał od biblioteki." },
      warstwaOpor: { nazwa: "Opór cieplny warstwy R [m²·K/W]", cel: "Gotowy opór zamiast grubości i λ — dla warstw, które producent opisuje oporem (np. szczelina powietrzna).", gdzie: "Z karty producenta. Jeśli podasz R, grubość i λ tej warstwy są pomijane.", zakres: "> 0. " + TWOJ },
      miesiac: { nazwa: "Średnia temperatura miesiąca [°C]", cel: "Z niej liczone są straty i prąd w danym miesiącu.", gdzie: "Z PVGIS dla Twojej lokalizacji albo wpisana ręcznie.", zakres: "Puste miesiące są pomijane." },
    },
  },
  "optymalizacja-izolacji": {
    migawka: {
      oCoChodzi: "Nie chodzi o to, żeby zaizolować jak najgrubiej, tylko żeby rozsądnie wydać pieniądze — jest punkt, po którym kolejny centymetr izolacji już się nie opłaca.",
      jakDziala: "Dla każdego wariantu: nowe U po dodaniu warstwy, roczna oszczędność ciepła i koszt jednej zaoszczędzonej kWh w {lata} lat. Z ceną ciepła — porównanie z tym, co płacisz dziś.",
      poCo: "Wybierasz materiał i grubość, która się zwraca — zamiast płacić za centymetry, które nic nie dają.",
      fizyka: "U' = 1 / (1/U + d/λ);  ΔQ = (U − U') · A · Σ(Δθ·t);  k = K / ({lata} · ΔQ).",
    },
    pola: {
      przegroda: { nazwa: "Przegroda z Ekranu 1", cel: "Wstawia powierzchnię i U — możesz je poprawić niżej.", gdzie: "Lista przegród zewnętrznych z ekranu „Straty ciepła budynku”.", zakres: "Opcjonalnie." },
      powierzchnia: { nazwa: "Powierzchnia przegrody [m²]", cel: "Oszczędność rośnie z powierzchnią docieplenia.", gdzie: "Z projektu, pomiaru albo Ekranu 1.", zakres: "≥ 0. " + TWOJ },
      u: { nazwa: "Obecne U [W/(m²·K)]", cel: "Punkt wyjścia — od niego liczona jest poprawa.", gdzie: "Przed dociepleniem — z projektu, świadectwa albo Ekranu 1.", zakres: "≥ 0. " + TWOJ },
      cenaCiepla: { nazwa: "Cena ciepła [{waluta}/kWh] (opcjonalnie)", cel: "Pozwala ocenić, od której grubości kolejne centymetry się nie zwracają.", gdzie: "Np. z ekranu „Porównanie kosztów ogrzewania”.", zakres: "Puste = bez oceny opłacalności." },
      material: { ...NAZWA, nazwa: "Materiał" },
      lambda: { nazwa: "λ [W/(m·K)]", cel: "Przewodność cieplna materiału — im mniejsza, tym lepiej izoluje.", gdzie: "λ deklarowane z karty produktu (np. 0,035).", zakres: "> 0. " + TWOJ },
      grubosc: { nazwa: "Grubość [cm]", cel: "Grubość dodawanej warstwy izolacji.", gdzie: "Oferowana grubość płyt lub warstwy.", zakres: "≥ 0. " + TWOJ },
      cena: { nazwa: "Cena [{waluta}/m²]", cel: "Koszt wariantu — z niego liczony jest koszt zaoszczędzonej kWh.", gdzie: "Za m² warstwy tej grubości (z robocizną, jeśli ją liczysz).", zakres: "≥ 0. " + TWOJ },
    },
  },
  "pojemnosc-cieplna": {
    migawka: {
      oCoChodzi: "Ciężki dom to jak piec kaflowy — długo się nagrzewa, ale długo trzyma ciepło. To ta sama liczba, która mówi, ile czasu masz w razie awarii ogrzewania, zanim zacznie robić się naprawdę zimno.",
      jakDziala: "Pojemność = suma po warstwach (gęstość × ciepło właściwe × efektywna grubość × powierzchnia) plus powietrze. Stała czasowa = pojemność ÷ współczynnik strat z Ekranu 1 — z niej przebieg temperatury po awarii.",
      poCo: "Wiesz, ile godzin masz do progu, poniżej którego zamarznie instalacja — i czy potrzebujesz zapasowego źródła ciepła.",
      fizyka: "κ = ρ · c · d;  C = Σ n·A·κ' + ρ_a·c_a·V;  τ = C / H;  θ(t) = θ_∞ + (θ_0 − θ_∞) · e^(−t/τ).",
    },
    pola: {
      nazwa: { ...NAZWA, nazwa: "Warstwa / materiał" },
      polozenie: { nazwa: "Położenie", cel: "Decyduje, ile razy i czy w ogóle warstwa magazynuje ciepło dla wnętrza.", gdzie: "Jedną stroną do wnętrza (ściana zewnętrzna), cała wewnątrz (ścianka działowa, strop) albo za izolacją (nie liczy się).", zakres: "Lista." },
      powierzchnia: { nazwa: "Powierzchnia [m²]", cel: "Pojemność rośnie z powierzchnią warstwy.", gdzie: "Z projektu albo pomiaru.", zakres: "≥ 0. " + TWOJ },
      grubosc: { nazwa: "Grubość warstwy [cm]", cel: "Grubość materiału magazynującego ciepło.", gdzie: "Materiał od strony pokoju do pierwszej warstwy izolacji.", zakres: "≥ 0. " + TWOJ },
      gestosc: { nazwa: "Gęstość [kg/m³]", cel: "Cięższy materiał magazynuje więcej ciepła.", gdzie: "Z karty materiału.", zakres: "≥ 0. " + TWOJ },
      cieplo: { nazwa: "Ciepło właściwe [J/(kg·K)]", cel: "Ile energii magazynuje 1 kg materiału na 1 K.", gdzie: "Z karty materiału — w J, nie kJ.", zakres: "≥ 0. " + TWOJ },
      gruboscElementu: { nazwa: "Grubość całego elementu [cm] (opcjonalnie)", cel: "Ogranicza efektywną grubość, gdy przegroda ma więcej warstw.", gdzie: "Gdy przegroda ma więcej warstw niż ta.", zakres: "Puste = sama ta warstwa." },
      tempDom: { ...T_DOM, cel: "Temperatura startowa wychładzania.", gdzie: "W chwili awarii.", zakres: "Puste = z Ekranu 1." },
      tempZew: { nazwa: "Temperatura na zewnątrz [°C]", cel: "Do niej dąży temperatura w domu po awarii.", gdzie: "Podczas awarii.", zakres: "Puste = obliczeniowa dla strefy z Ekranu 1." },
      prog: { nazwa: "Nie niżej niż [°C] (opcjonalnie)", cel: "Aplikacja policzy, po ilu godzinach dom osiągnie ten próg.", gdzie: "Twój próg ochrony, np. rur z wodą.", zakres: "Puste = bez progu." },
    },
  },
  "pompy-cyrkulacyjne": {
    migawka: {
      oCoChodzi: "W off-gridzie pompy cyrkulacyjne to cisi złodzieje energii — pracują 24/7 i łatwo je zlekceważyć, a różnica między starym a nowym modelem to realne kilowatogodziny dziennie.",
      jakDziala: "Energia = moc × godziny pracy. Porównuję obecną pompę z elektroniczną (PWM) — na dobę, a z dniami sezonu także w całym sezonie (kWh i {waluta}). Niżej: przepływ przez pompę ciepła — ile m³/h potrzeba i czy pompa obiegowa go da.",
      poCo: "Wiesz, ile energii z baterii odzyskasz wymianą pompy.",
      fizyka: "E = P · h / 1000.",
    },
    pola: {
      mocObecna: { nazwa: "Moc obecnej pompy [W]", cel: "Pobór pompy, którą masz dziś.", gdzie: "Tabliczka znamionowa albo pomiar. Typowo pompa stałoobrotowa: {min}–{max} W.", zakres: "≥ 0. " + TWOJ },
      mocNowa: { nazwa: "Moc rozważanej pompy elektronicznej (PWM) [W]", cel: "Pobór pompy, którą rozważasz.", gdzie: "Karta katalogowa. Typowo {min}–{max} W.", zakres: "≥ 0. " + TWOJ },
      godziny: { nazwa: "Godziny pracy na dobę [h]", cel: "Ile godzin dziennie pracuje pompa.", gdzie: "Sterownik albo harmonogram. {h} dla pracy ciągłej (24/7).", zakres: "0–24." },
    },
  },
  "ryzyko-niskiego-napiecia": {
    migawka: {
      oCoChodzi: "Niskie napięcie to cichy zabójca pomp — nie zepsuje się od razu, po prostu przestanie działać dokładnie wtedy, gdy jest najbardziej potrzebna.",
      jakDziala: "Margines = napięcie systemu − minimalne napięcie pracy pompy. Ujemny albo mały margines to ryzyko wyłączenia.",
      poCo: "Wiesz, czy pompa przetrwa noc na rozładowującej się baterii.",
      fizyka: "ΔV = V_sys − V_min.",
    },
    pola: {
      vMin: { nazwa: "Minimalne napięcie pracy pompy [V]", cel: "Poniżej tego napięcia pompa się wyłącza.", gdzie: "Z karty katalogowej pompy ciepła.", zakres: "≥ 0. " + TWOJ },
      vSys: { nazwa: "Aktualne napięcie systemu off-grid [V]", cel: "Porównywane z minimalnym napięciem pracy pompy.", gdzie: "Docelowo auto z Modułu 4 (live) — dziś wpisz ręcznie z BMS albo miernika.", zakres: "≥ 0. " + TWOJ },
    },
  },
  "ryzyko-zamarzniecia-dolnego-zrodla": {
    migawka: {
      oCoChodzi: "Grunt to bateria ciepła — jak za mocno i za długo z niej czerpiesz bez przerwy na regenerację, w końcu zamarza.",
      jakDziala: "Treść informacyjna: czynniki ryzyka (temperatura gruntu, głębokość kolektora, stężenie glikolu, czas pracy ciągłej) i zalecenia. Źródło nie podaje wzoru wiążącego je z temperaturą solanki, więc aplikacja jej nie liczy.",
      poCo: "Wiesz, co sprawdzić i monitorować, zanim dolne źródło zamarznie i zatrzyma pompę.",
    },
    pola: {},
  },
  "wentylacja-odzysk-ciepla": {
    migawka: {
      oCoChodzi: "Wentylacja to płuca domu. Rekuperacja sprawia, że płuca oddychają, ale nie tracą przy tym ciepła.",
      jakDziala: "Odzyskane ciepło = przepływ × sprawność × gęstość i ciepło właściwe powietrza × różnica temperatur. Od zysku odejmuję stały pobór wentylatorów.",
      poCo: "Wiesz, czy rekuperator w off-gridzie daje więcej, niż zjadają jego wentylatory.",
      fizyka: "Q = V̇ · η · ρ · c_p · ΔT / 3600.",
    },
    pola: {
      przeplyw: { nazwa: "Wydajność centrali wentylacyjnej [m³/h]", cel: "Ile powietrza wymienia centrala.", gdzie: "Ustawienie centrali albo projekt wentylacji.", zakres: "≥ 0. " + TWOJ },
      sprawnosc: { nazwa: "Sprawność rekuperatora [%]", cel: "Jaka część ciepła z powietrza wywiewanego wraca do domu.", gdzie: "Karta katalogowa centrali.", zakres: "0–100%. " + TWOJ },
      deltaT: DELTA_T,
      pobor: { nazwa: "Stały pobór mocy wentylatorów [W]", cel: "Prąd zużywany przez centralę przez całą dobę.", gdzie: "Karta katalogowa. Typowo {min}–{max} W.", zakres: "≥ 0. " + TWOJ },
    },
  },
  "zapotrzebowanie-co-cwu": {
    migawka: {
      oCoChodzi: "To są dwa różne ‘apetyty na ciepło’ — C.O. skacze z pogodą, C.W.U. jest w miarę stałe cały rok.",
      jakDziala: "C.O. — ze strat ciepła z Ekranu 1 dla każdego miesiąca. C.W.U. — liczba osób × litry na osobę × podgrzanie wody. Z COP przeliczam oba na prąd.",
      poCo: "Wiesz, ile ciepła i prądu potrzeba w każdym miesiącu — to wejście do bilansu zimowego.",
      fizyka: "E_CWU = n · V · Δθ · c_w / 3,6·10⁶;  E_el = E_CO / COP_CO + E_CWU / COP_CWU.",
    },
    pola: {
      osoby: { nazwa: "Liczba osób", cel: "Od niej zależy zużycie ciepłej wody.", gdzie: "Ile osób mieszka w domu. Możesz ustawić na ekranie „Liczba domowników” w Module 2.", zakres: "Puste = wartość z Modułu 2, jeśli jest ustawiona." },
      litry: { nazwa: "Ciepła woda na osobę [l/dobę]", cel: "Dobowe zużycie ciepłej wody na osobę.", gdzie: "Źródło: ok. {l} l; Moduł 2 podaje zakres 50–70 l. Zmień, jeśli znasz swoje zużycie.", zakres: "≥ 0. " + TWOJ },
      tZimna: { nazwa: "Temperatura zimnej wody [°C]", cel: "Od niej zaczyna się podgrzewanie.", gdzie: "Woda z sieci albo studni — zmierz na kranie zimnej wody.", zakres: TWOJ },
      tCiepla: { nazwa: "Temperatura ciepłej wody [°C]", cel: "Do niej podgrzewasz wodę.", gdzie: "Ustawienie podgrzewacza lub bojlera.", zakres: TWOJ },
      cop: { nazwa: "COP podgrzewania wody [–] (opcjonalnie)", cel: "Przelicza ciepło C.W.U. na prąd.", gdzie: "Grzałka elektryczna: 1. Pompa ciepła: z karty.", zakres: "Puste = bez przeliczenia na prąd." },
    },
  },
}

const EN_YOURS = "Your installation — the app never assumes a typical value for you."
const EN_NAME = { nazwa: "Name", cel: "Only describes the item — does not affect the result.", gdzie: "Anything.", zakres: "Text." }
const EN_DELTA_T = {
  nazwa: "Indoor/outdoor temperature difference [K]",
  cel: "The larger the difference, the more heat leaves with the exchanged air.",
  gdzie: "Indoor minus outdoor temperature for the analysed period (1 K = 1 °C of difference).",
  zakres: "≥ 0. " + EN_YOURS,
}
const EN_T_HOME = { nazwa: "Indoor temperature [°C]", cel: "The temperature you want to keep in winter.", gdzie: "What you want to keep in winter.", zakres: EN_YOURS }

export const en: Tlumaczenie<typeof pl> = {
  "bufor-ciepla": {
    migawka: {
      oCoChodzi: "A buffer is a thermos for heat — it stores it when it is “cheap” (sun shining) and releases it when it is “expensive” (night, clouds).",
      jakDziala: "Recommended volume = heat pump output × {lkw} l/kW. I compare it with the volume you have or plan. Below: how many starts per day the pump makes without and with the buffer, how much heat the buffer stores from PV and how much it loses standing.",
      poCo: "You know whether the buffer lets the pump run on PV power by day and release heat at night — and whether it will short-cycle.",
      fizyka: "V_rec = P · {lkw} l/kW.",
    },
    pola: {
      moc: { nazwa: "Heat pump output [kW]", cel: "The recommended buffer volume is based on it.", gdzie: "Pump datasheet — nominal heating output.", zakres: "≥ 0. " + EN_YOURS },
      pojemnosc: { nazwa: "Existing/planned buffer volume [l]", cel: "Compared with the recommended volume ({lkw} l per kW of pump output).", gdzie: "Tank nameplate or offer.", zakres: "≥ 0. " + EN_YOURS },
    },
  },
  "cop-pompy-ciepla": {
    migawka: {
      oCoChodzi: "COP is a “multiplier” — a heat pump does not make heat out of nothing, it moves it from outside, using less electricity than an electric heater.",
      jakDziala: "Electrical power = heat demand ÷ COP at the current temperature. Below: sizing the pump to the building (margin or deficit in the hardest frost, how much backup heating, balance point) and the heating curve (how much lower the flow and what COP after lowering it).",
      poCo: "You know how much power from the battery or PV the pump draws in given conditions — and how much more in frost, when COP drops.",
      fizyka: "P_el = P_heat / COP.",
    },
    pola: {
      moc: { nazwa: "Heat demand [kW]", cel: "How much heat the pump has to deliver.", gdzie: "From the “Building heat loss” screen or from the designer.", zakres: "Up to {mocMax} kW. " + EN_YOURS },
      cop: { nazwa: "COP at current temperature [–]", cel: "How many kWh of heat the pump gives from 1 kWh of electricity at this outdoor temperature.", gdzie: "Pump datasheet — COP table for outdoor temperatures (e.g. A2/W35, A−7/W35).", zakres: "{min}–{max}." },
    },
  },
  "halas-i-wibracje": {
    migawka: {
      oCoChodzi: "A heat pump is a machine with a fan and a compressor — placed under a bedroom window, it will keep you awake, and a neighbour may file a complaint.",
      jakDziala: "Informational content: factors affecting noise (sound power, mounting location, distance to windows, local night limit) and recommendations. The source gives no acoustic propagation formula, so the app does not calculate the noise level.",
      poCo: "You know what to check and what to do before placing the outdoor unit.",
    },
    pola: {},
  },
  "infiltracja-powietrza": {
    migawka: {
      oCoChodzi: "Gaps in the building are free ventilation, but in winter you pay for it with heat — controlled air exchange is better than accidental.",
      jakDziala: "Loss = air changes per hour × volume × air density and specific heat × temperature difference.",
      poCo: "You know how much heating power leakage eats — and whether sealing pays off.",
      fizyka: "Q = n · V · ρ · c_p · ΔT / 3600.",
    },
    pola: {
      wymiany: { nazwa: "Air changes per hour [1/h]", cel: "How many times per hour all the air in the house is replaced through leaks.", gdzie: "From an airtightness test (blower door) or an estimate based on the construction type.", zakres: "≥ 0. " + EN_YOURS },
      kubatura: { nazwa: "Building volume [m³]", cel: "Volume of air being exchanged.", gdzie: "Floor area × room height.", zakres: "≥ 0. " + EN_YOURS },
      deltaT: EN_DELTA_T,
    },
  },
  "kociol-elektryczny": {
    migawka: {
      oCoChodzi: "An electric boiler is nearly 100% efficient, but that is not the same as cheap heating — a heat pump does not make heat from electricity, it moves it from outside, so it uses several times less.",
      jakDziala: "Electricity = heat ÷ COP (boiler: COP = 1, pump: your COP). Cost = electricity × energy price.",
      poCo: "You see the difference in kWh and money — off-grid, it is the difference in PV and battery size.",
      fizyka: "E = Q / COP; K = E · c.",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Heat demand to cover [kWh]", cel: "Heat the boiler or the pump has to deliver.", gdzie: "From the “Space heating and hot water demand” screen or from past seasons' consumption.", zakres: "≥ 0. " + EN_YOURS },
      cop: { nazwa: "Heat pump COP [–]", cel: "How many kWh of heat the pump gives from 1 kWh of electricity.", gdzie: "Datasheet or the “Heat pump COP” screen. Typical air-to-water pumps: 1.5–6, depending on temperature.", zakres: "≥ 0. " + EN_YOURS },
      cena: { nazwa: "Electricity price [{waluta}/kWh]", cel: "Converts kWh to money.", gdzie: "Bill, generator cost or the valued cost of PV power.", zakres: "≥ 0. " + EN_YOURS },
    },
  },
  "koszty-ogrzewania": {
    migawka: {
      oCoChodzi: "Don't be fooled by cheap fuels. Count the total cost, not just the price per kg.",
      jakDziala: "For each source: cost of 1 kWh of heat (fuel: price ÷ (calorific value × efficiency); heater: price × consumption ÷ output; electricity: price ÷ COP). Total cost = purchase + years × (heat × cost per kWh + service).",
      poCo: "You see which source really is cheapest over {lata} years — and how much winter electricity it needs from your off-grid system.",
      fizyka: "c_Q = c / (CV · η) | c · V̇ / P | c_el / COP;  K = I + n · (Q · c_Q + S).",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Heat needed per season [kWh]", cel: "How much heat each source has to deliver per season.", gdzie: "From past seasons' consumption, from the designer or the sum of months from the “Building heat loss” screen.", zakres: "≥ 0. " + EN_YOURS },
      liczbaLat: { nazwa: "Analysis period [years]", cel: "Over how many years fuel and service costs are summed.", gdzie: "The source suggests {lata} years. You can change it.", zakres: "≥ 1." },
      rodzaj: { nazwa: "Source type", cel: "Decides how the cost of 1 kWh of heat is calculated (fuel, heater datasheet or electricity) and which fields are needed.", gdzie: "The device you have or are considering.", zakres: "List." },
      nazwa: { ...EN_NAME, zakres: "Text. Empty = type name." },
      jednostka: { nazwa: "Fuel unit", cel: "The unit for price, calorific value and consumption.", gdzie: "As you buy the fuel. mp — stacked cubic metre (stacked wood).", zakres: "kg, t, mp, m³, l." },
      cenaZl: { nazwa: "Price", cel: "Price of a fuel unit or of 1 kWh of electricity.", gdzie: "Fuel: invoice or offer. Electricity: your cost of 1 kWh in winter (from a generator, the grid or valued from PV).", zakres: "≥ 0. " + EN_YOURS },
      wartoscOpalowaKwh: { nazwa: "Calorific value [kWh/unit]", cel: "How much energy a unit of fuel contains.", gdzie: "From the supplier or the fuel certificate. For wood it depends strongly on moisture.", zakres: "≥ 0. " + EN_YOURS },
      sprawnoscPct: { nazwa: "Device efficiency [%]", cel: "What part of the fuel's energy reaches the house as heat.", gdzie: "From the boiler, stove or fireplace datasheet.", zakres: "0–100%. " + EN_YOURS },
      mocGrzewczaKw: { nazwa: "Heating output [kW]", cel: "Heater: together with consumption gives the cost of 1 kWh of heat. Fuel boiler (optional): needed to calculate running hours and auxiliary power.", gdzie: "From the device datasheet.", zakres: "≥ 0. " + EN_YOURS },
      zuzyciePaliwaNaH: { nazwa: "Fuel consumption at this output [unit/h]", cel: "Together with output gives the cost of 1 kWh of heat from the heater.", gdzie: "From the datasheet.", zakres: "≥ 0. " + EN_YOURS },
      cop: { nazwa: "COP (seasonal average) [–]", cel: "How many kWh of heat the pump gives from 1 kWh of electricity on average over the season.", gdzie: "SCOP from the datasheet or from the “Heat pump COP” screen.", zakres: "≥ 0. " + EN_YOURS },
      poborPraduW: { nazwa: "Power draw while running [W] (optional)", cel: "Auxiliary power of a fuel source — off-grid, your system must supply it.", gdzie: "Fan, feeder, pump, glow plug — from the datasheet.", zakres: "Empty = auxiliary power is not counted." },
      kosztInwestycjiZl: { nazwa: "Purchase and installation cost [{waluta}]", cel: "One-off cost added to the total cost and payback.", gdzie: "Offer. 0 — if you already own the device.", zakres: "≥ 0." },
      kosztSerwisuRocznyZl: { nazwa: "Service and inspections per year [{waluta}]", cel: "Fixed cost added for every year of the analysis.", gdzie: "E.g. inspection, chimney sweeping, parts.", zakres: "≥ 0." },
    },
  },
  "mostki-termiczne": {
    migawka: {
      oCoChodzi: "It's like a hole in a jumper — even if the rest is warm, a lot of energy escapes through the hole, out of proportion to its size.",
      jakDziala: "Each linear bridge: Ψ × length. The sum gives an extra heat loss coefficient, which I multiply by the temperature difference from Screen 1 and compare with losses through the envelope.",
      poCo: "You know how much heat escapes through corners, lintels, balconies and reveals — and how much fixing them gives.",
      fizyka: "H_tb = Σ Ψ · l;  Φ_tb = H_tb · (θ_i − θ_e).",
    },
    pola: {
      detal: { nazwa: "Detail from EN ISO 14683", cel: "Inserts the Ψ value from the standard's table for a typical junction.", gdzie: "Pick the detail closest to your junction or leave “own Ψ value”.", zakres: "Optional." },
      nazwa: EN_NAME,
      dlugosc: { nazwa: "Length [m]", cel: "Bridge losses grow with its length.", gdzie: "Total length of such junctions in the house — from plans and sections.", zakres: "≥ 0. " + EN_YOURS },
      psi: { nazwa: "Ψ [W/(m·K)]", cel: "Linear thermal transmittance — how many W escape per metre of junction at 1 K difference.", gdzie: "From a thermal bridge catalogue or from the designer.", zakres: EN_YOURS },
      psiPo: { nazwa: "Ψ after improvement [W/(m·K)] (optional)", cel: "Shows how much improving the detail gives.", gdzie: "E.g. after insulating window reveals — from a catalogue or the designer.", zakres: "Empty = no improvement variant." },
      nadproze: { nazwa: "Uninsulated lintel above a window", cel: "Marks the bridge as an uninsulated lintel — the app will flag it as a typical risk spot.", gdzie: "Inspection or design.", zakres: "Yes / no." },
      system: { nazwa: "How areas on Screen 1 are measured", cel: "Tabulated Ψ depends on the dimension system (external, overall internal, internal) — the total loss does not.", gdzie: "Needed only for table details. The way you measured element areas on Screen 1.", zakres: "Ψe / Ψoi / Ψi." },
    },
  },
  "obciazenie-cieplne": {
    migawka: {
      oCoChodzi: "A house in winter is a leaky bucket — heating has to top up as much as leaks out.",
      jakDziala: "Losses through the envelope (U × A × temperature difference) plus losses with exchanged air, on the coldest day for your climate zone. For months — from the monthly mean temperature; with COP I convert heat to electricity. Below the result: a report — what loses the most heat (ranking incl. ventilation), heat per m² per year and the yearly heating cost. You type the element's U or calculate it from its layers (U = 1/(Rsi + Σ thickness/λ + Rse), EN ISO 6946, no thermal bridges — for a framed wall that is too optimistic).",
      poCo: "This is the output heating must deliver — off-grid, it decides how much electricity or fuel you need in winter.",
      fizyka: "Φ = Σ U·A·Δθ + n·V·ρ·c_p/3600·Δθ;  Q = Φ · 24 h;  E_el = Q / COP.",
    },
    pola: {
      nazwa: EN_NAME,
      powierzchnia: { nazwa: "Area [m²]", cel: "Losses through an element grow with its area.", gdzie: "From the design or measurement. Walls — without windows and doors (enter those separately).", zakres: "≥ 0. " + EN_YOURS },
      u: { nazwa: "U-value [W/(m²·K)]", cel: "How many W escape through 1 m² at 1 K temperature difference.", gdzie: "From the design, energy certificate or window datasheet.", zakres: "≥ 0. " + EN_YOURS },
      strona: { nazwa: "On the other side", cel: "Decides whether I use the zone's outdoor temperature or your temperature on the other side.", gdzie: "Outdoor air or ground / unheated room.", zakres: "List." },
      tempStrona: { nazwa: "Temperature on the other side [°C]", cel: "Temperature of the ground or unheated room behind the element.", gdzie: "E.g. ground under the floor, unheated attic or garage — your estimate or from the design.", zakres: EN_YOURS },
      strefa: { nazwa: "Climate zone", cel: "Sets the design outdoor temperature of the coldest day.", gdzie: "From the map of Polish climate zones (PN-82/B-02403 / EN 12831).", zakres: "Zones I–V." },
      tempDom: EN_T_HOME,
      kubatura: { nazwa: "Heated volume [m³]", cel: "Volume of air to heat during exchange.", gdzie: "Floor area × room height.", zakres: "≥ 0. " + EN_YOURS },
      wymiany: { nazwa: "Air changes [1/h]", cel: "How many times per hour the air in the house is exchanged.", gdzie: "Leakage + ventilation. Airtightness test result or from the designer; enter the heat recovery separately.", zakres: "≥ 0. " + EN_YOURS },
      cop: { nazwa: "Heating COP [–] (optional)", cel: "Converts heat to electricity.", gdzie: "Heater, electric boiler: 1. Heat pump: from the datasheet or the “Heat pump COP” screen.", zakres: "Empty = no conversion to electricity." },
      odzysk: { nazwa: "Ventilation heat recovery [%] (optional)", cel: "By this many percent the recuperator reduces the ventilation loss.", gdzie: "Recuperator efficiency from the unit's datasheet (declared). The whole entered air change rate is assumed to go through the recuperator — if part of it is leakage, enter a smaller value.", zakres: "0–100. Empty = no recovery. " + EN_YOURS },
      zrodlo: { nazwa: "Heat source", cel: "Electricity (heater, electric boiler, heat pump) goes into the winter balance on panels; fuel (wood, coal, gas, oil) is used to count how long the stock lasts.", gdzie: "Choose what you actually heat with.", zakres: "List." },
      paliwoJednostka: { nazwa: "Fuel unit", cel: "Only a label in the result (e.g. kg, l, m³).", gdzie: "As you buy the fuel.", zakres: "Any short text." },
      paliwoWo: { nazwa: "Calorific value [kWh/unit]", cel: "How much heat one unit of the fuel gives when burnt.", gdzie: "From the fuel seller or its card — the app gives no default because it depends on the grade and moisture.", zakres: "> 0. " + EN_YOURS },
      paliwoSprawnosc: { nazwa: "Boiler or stove efficiency [%]", cel: "What part of the heat of combustion reaches the house.", gdzie: "From the boiler or stove datasheet.", zakres: "Above 0 up to 100. " + EN_YOURS },
      paliwoZapas: { nazwa: "Fuel stock [units]", cel: "From it I count how many days and what part of the year it lasts.", gdzie: "How much fuel you have or plan to store.", zakres: "≥ 0. " + EN_YOURS },
      kierunek: { nazwa: "Direction of heat flow", cel: "It sets the surface heat-transfer resistances (Rsi 0.10 / 0.13 / 0.17 m²·K/W, Rse 0.04) used in the U-from-layers calculation.", gdzie: "Wall — horizontal, roof or ceiling under an unheated attic — upward, floor — downward.", zakres: "List (EN ISO 6946:2017, Table 7)." },
      warstwaNazwa: { nazwa: "Layer name", cel: "Only for you — it helps tell the layers apart.", gdzie: "E.g. OSB board, wool, plasterboard.", zakres: "Any text." },
      warstwaGrubosc: { nazwa: "Layer thickness [mm]", cel: "The layer's resistance is its thickness divided by λ.", gdzie: "From the design or measurement. Enter the thickness of the layer alone, not of the whole element.", zakres: "> 0. " + EN_YOURS },
      warstwaLambda: { nazwa: "Thermal conductivity λ [W/(m·K)]", cel: "The lower λ, the better the layer insulates.", gdzie: "Declared λ from the product datasheet. A library material inserts the value taken from Inżynier Szkieletowy Pro together with its status (usually “indicative”) — I do not guess material conductivities; your own datasheet value always wins.", zakres: "> 0. " + EN_YOURS },
      szablonPrzegrody: { nazwa: "Ready partition (layer template)", cel: "Fills the layers with a typical framed partition and sets the heat-flow direction.", gdzie: "Pick the one closest to your partition, then adjust thicknesses and materials. It replaces all layers entered so far for this partition.", zakres: "The template has no membranes or air gaps (they have no λ). Thermal bridges are not included." },
      materialWarstwy: { nazwa: "Material from the library", cel: "Inserts the material name and λ (and a typical thickness if the field is empty).", gdzie: "List taken from Inżynier Szkieletowy Pro. Below you see the λ status: manufacturer datasheet, standard or indicative.", zakres: "Typing your own λ detaches the material from the library." },
      warstwaOpor: { nazwa: "Layer thermal resistance R [m²·K/W]", cel: "A ready resistance instead of thickness and λ — for layers the manufacturer describes by resistance (e.g. an air gap).", gdzie: "From the manufacturer's datasheet. If you enter R, this layer's thickness and λ are ignored.", zakres: "> 0. " + EN_YOURS },
      miesiac: { nazwa: "Monthly mean temperature [°C]", cel: "Losses and electricity for that month are calculated from it.", gdzie: "From PVGIS for your location or entered by hand.", zakres: "Empty months are skipped." },
    },
  },
  "optymalizacja-izolacji": {
    migawka: {
      oCoChodzi: "The point is not to insulate as thickly as possible, but to spend money sensibly — there is a point after which another centimetre of insulation no longer pays off.",
      jakDziala: "For each variant: new U after adding the layer, annual heat saving and the cost of one saved kWh over {lata} years. With a heat price — a comparison with what you pay today.",
      poCo: "You pick the material and thickness that pays back — instead of paying for centimetres that do nothing.",
      fizyka: "U' = 1 / (1/U + d/λ);  ΔQ = (U − U') · A · Σ(Δθ·t);  k = K / ({lata} · ΔQ).",
    },
    pola: {
      przegroda: { nazwa: "Element from Screen 1", cel: "Inserts area and U — you can adjust them below.", gdzie: "List of external elements from the “Building heat loss” screen.", zakres: "Optional." },
      powierzchnia: { nazwa: "Element area [m²]", cel: "Savings grow with the insulated area.", gdzie: "From the design, measurement or Screen 1.", zakres: "≥ 0. " + EN_YOURS },
      u: { nazwa: "Current U [W/(m²·K)]", cel: "Starting point — the improvement is calculated from it.", gdzie: "Before insulating — from the design, certificate or Screen 1.", zakres: "≥ 0. " + EN_YOURS },
      cenaCiepla: { nazwa: "Heat price [{waluta}/kWh] (optional)", cel: "Lets the app judge from which thickness further centimetres stop paying back.", gdzie: "E.g. from the “Heating cost comparison” screen.", zakres: "Empty = no cost-effectiveness verdict." },
      material: { ...EN_NAME, nazwa: "Material" },
      lambda: { nazwa: "λ [W/(m·K)]", cel: "Thermal conductivity of the material — the lower, the better it insulates.", gdzie: "Declared λ from the product datasheet (e.g. 0.035).", zakres: "> 0. " + EN_YOURS },
      grubosc: { nazwa: "Thickness [cm]", cel: "Thickness of the added insulation layer.", gdzie: "Offered board or layer thickness.", zakres: "≥ 0. " + EN_YOURS },
      cena: { nazwa: "Price [{waluta}/m²]", cel: "Cost of the variant — the cost of a saved kWh is based on it.", gdzie: "Per m² of a layer of this thickness (with labour, if you count it).", zakres: "≥ 0. " + EN_YOURS },
    },
  },
  "pojemnosc-cieplna": {
    migawka: {
      oCoChodzi: "A heavy house is like a tiled stove — it heats up slowly but holds heat for long. It is the same number that tells you how much time you have after a heating failure before it gets really cold.",
      jakDziala: "Capacity = sum over layers (density × specific heat × effective thickness × area) plus air. Time constant = capacity ÷ loss coefficient from Screen 1 — from it the temperature curve after a failure.",
      poCo: "You know how many hours you have until the threshold below which the plumbing freezes — and whether you need a backup heat source.",
      fizyka: "κ = ρ · c · d;  C = Σ n·A·κ' + ρ_a·c_a·V;  τ = C / H;  θ(t) = θ_∞ + (θ_0 − θ_∞) · e^(−t/τ).",
    },
    pola: {
      nazwa: { ...EN_NAME, nazwa: "Layer / material" },
      polozenie: { nazwa: "Position", cel: "Decides how many times, and whether at all, the layer stores heat for the interior.", gdzie: "One side facing the interior (external wall), fully inside (partition, floor slab) or behind insulation (not counted).", zakres: "List." },
      powierzchnia: { nazwa: "Area [m²]", cel: "Capacity grows with the layer area.", gdzie: "From the design or measurement.", zakres: "≥ 0. " + EN_YOURS },
      grubosc: { nazwa: "Layer thickness [cm]", cel: "Thickness of the heat-storing material.", gdzie: "Material from the room side up to the first insulation layer.", zakres: "≥ 0. " + EN_YOURS },
      gestosc: { nazwa: "Density [kg/m³]", cel: "Heavier material stores more heat.", gdzie: "From the material datasheet.", zakres: "≥ 0. " + EN_YOURS },
      cieplo: { nazwa: "Specific heat [J/(kg·K)]", cel: "How much energy 1 kg of material stores per 1 K.", gdzie: "From the material datasheet — in J, not kJ.", zakres: "≥ 0. " + EN_YOURS },
      gruboscElementu: { nazwa: "Whole element thickness [cm] (optional)", cel: "Limits the effective thickness when the element has more layers.", gdzie: "When the element has more layers than this one.", zakres: "Empty = this layer only." },
      tempDom: { ...EN_T_HOME, cel: "Starting temperature of cooling down.", gdzie: "At the moment of failure.", zakres: "Empty = from Screen 1." },
      tempZew: { nazwa: "Outdoor temperature [°C]", cel: "Indoor temperature tends towards it after a failure.", gdzie: "During the failure.", zakres: "Empty = design value for the zone from Screen 1." },
      prog: { nazwa: "Not lower than [°C] (optional)", cel: "The app calculates after how many hours the house reaches this threshold.", gdzie: "Your protection threshold, e.g. for water pipes.", zakres: "Empty = no threshold." },
    },
  },
  "pompy-cyrkulacyjne": {
    migawka: {
      oCoChodzi: "Off-grid, circulation pumps are silent energy thieves — they run 24/7 and are easy to ignore, and the difference between an old and a new model is real kilowatt-hours a day.",
      jakDziala: "Energy = power × running hours. I compare the current pump with an electronic (PWM) one — per day, and with the season days also for the whole season (kWh and {waluta}). Below: the flow through the heat pump — how many m³/h are needed and whether the circulation pump gives them.",
      poCo: "You know how much battery energy you recover by replacing the pump.",
      fizyka: "E = P · h / 1000.",
    },
    pola: {
      mocObecna: { nazwa: "Current pump power [W]", cel: "Draw of the pump you have today.", gdzie: "Nameplate or measurement. Typical fixed-speed pump: {min}–{max} W.", zakres: "≥ 0. " + EN_YOURS },
      mocNowa: { nazwa: "Considered electronic (PWM) pump power [W]", cel: "Draw of the pump you are considering.", gdzie: "Datasheet. Typically {min}–{max} W.", zakres: "≥ 0. " + EN_YOURS },
      godziny: { nazwa: "Running hours per day [h]", cel: "How many hours a day the pump runs.", gdzie: "Controller or schedule. {h} for continuous operation (24/7).", zakres: "0–24." },
    },
  },
  "ryzyko-niskiego-napiecia": {
    migawka: {
      oCoChodzi: "Low voltage is a silent pump killer — it won't break at once, it will simply stop working exactly when it is needed most.",
      jakDziala: "Margin = system voltage − pump's minimum operating voltage. A negative or small margin means a risk of shutdown.",
      poCo: "You know whether the pump survives the night on a discharging battery.",
      fizyka: "ΔV = V_sys − V_min.",
    },
    pola: {
      vMin: { nazwa: "Pump minimum operating voltage [V]", cel: "Below this voltage the pump shuts down.", gdzie: "From the heat pump datasheet.", zakres: "≥ 0. " + EN_YOURS },
      vSys: { nazwa: "Current off-grid system voltage [V]", cel: "Compared with the pump's minimum operating voltage.", gdzie: "Eventually automatic from Module 4 (live) — for now enter it by hand from the BMS or a meter.", zakres: "≥ 0. " + EN_YOURS },
    },
  },
  "ryzyko-zamarzniecia-dolnego-zrodla": {
    migawka: {
      oCoChodzi: "The ground is a heat battery — draw from it too hard and too long without a break for regeneration, and it eventually freezes.",
      jakDziala: "Informational content: risk factors (ground temperature, collector depth, glycol concentration, continuous running time) and recommendations. The source gives no formula linking them to brine temperature, so the app does not calculate it.",
      poCo: "You know what to check and monitor before the ground source freezes and stops the pump.",
    },
    pola: {},
  },
  "wentylacja-odzysk-ciepla": {
    migawka: {
      oCoChodzi: "Ventilation is the lungs of the house. Heat recovery lets the lungs breathe without losing heat.",
      jakDziala: "Recovered heat = airflow × efficiency × air density and specific heat × temperature difference. From the gain I subtract the constant fan draw.",
      poCo: "You know whether an off-grid heat recovery unit gives more than its fans consume.",
      fizyka: "Q = V̇ · η · ρ · c_p · ΔT / 3600.",
    },
    pola: {
      przeplyw: { nazwa: "Ventilation unit airflow [m³/h]", cel: "How much air the unit exchanges.", gdzie: "Unit setting or ventilation design.", zakres: "≥ 0. " + EN_YOURS },
      sprawnosc: { nazwa: "Heat recovery efficiency [%]", cel: "What part of the heat in the exhaust air returns to the house.", gdzie: "Unit datasheet.", zakres: "0–100%. " + EN_YOURS },
      deltaT: EN_DELTA_T,
      pobor: { nazwa: "Constant fan power draw [W]", cel: "Electricity used by the unit around the clock.", gdzie: "Datasheet. Typically {min}–{max} W.", zakres: "≥ 0. " + EN_YOURS },
    },
  },
  "zapotrzebowanie-co-cwu": {
    migawka: {
      oCoChodzi: "These are two different ‘appetites for heat’ — space heating jumps with the weather, hot water is fairly constant all year.",
      jakDziala: "Space heating — from heat losses on Screen 1 for each month. Hot water — people × litres per person × water heating. With COP I convert both to electricity.",
      poCo: "You know how much heat and electricity is needed each month — the input to the winter balance.",
      fizyka: "E_DHW = n · V · Δθ · c_w / 3.6·10⁶;  E_el = E_SH / COP_SH + E_DHW / COP_DHW.",
    },
    pola: {
      osoby: { nazwa: "Number of people", cel: "Hot water use depends on it.", gdzie: "How many people live in the house. You can set it on the “Household members” screen in Module 2.", zakres: "Empty = value from Module 2, if set." },
      litry: { nazwa: "Hot water per person [l/day]", cel: "Daily hot water use per person.", gdzie: "Source: approx. {l} l; Module 2 gives a range of 50–70 l. Change it if you know your consumption.", zakres: "≥ 0. " + EN_YOURS },
      tZimna: { nazwa: "Cold water temperature [°C]", cel: "Heating starts from it.", gdzie: "Mains or well water — measure at the cold tap.", zakres: EN_YOURS },
      tCiepla: { nazwa: "Hot water temperature [°C]", cel: "The temperature you heat water to.", gdzie: "Water heater or boiler setting.", zakres: EN_YOURS },
      cop: { nazwa: "Water heating COP [–] (optional)", cel: "Converts hot water heat to electricity.", gdzie: "Electric heater: 1. Heat pump: from the datasheet.", zakres: "Empty = no conversion to electricity." },
    },
  },
}

const RU_YOURS = "Ваша установка — приложение не подставляет типовое значение за вас."
const RU_NAME = { nazwa: "Название", cel: "Только описание позиции — на результат не влияет.", gdzie: "Любое.", zakres: "Текст." }
const RU_DELTA_T = {
  nazwa: "Разница температур внутри/снаружи [K]",
  cel: "Чем больше разница, тем больше тепла уходит с обменным воздухом.",
  gdzie: "Температура в доме минус температура снаружи за анализируемый период (1 K = 1 °C разницы).",
  zakres: "≥ 0. " + RU_YOURS,
}
const RU_T_HOME = { nazwa: "Температура в доме [°C]", cel: "Температура, которую вы хотите поддерживать зимой.", gdzie: "Какую хотите поддерживать зимой.", zakres: RU_YOURS }

export const ru: Tlumaczenie<typeof pl> = {
  "bufor-ciepla": {
    migawka: {
      oCoChodzi: "Буфер — это термос для тепла: накапливает его, когда оно «дешёвое» (светит солнце), и отдаёт, когда «дорогое» (ночь, облака).",
      jakDziala: "Рекомендуемый объём = мощность теплового насоса × {lkw} л/кВт. Сравниваю его с объёмом, который у вас есть или планируется. Ниже: сколько пусков в сутки насос делает без буфера и с ним, сколько тепла буфер запасает от PV и сколько теряет в простое.",
      poCo: "Вы знаете, позволит ли буфер насосу работать днём на энергии PV и отдавать тепло ночью — и не будет ли он тактовать.",
      fizyka: "V_рек = P · {lkw} л/кВт.",
    },
    pola: {
      moc: { nazwa: "Мощность теплового насоса [кВт]", cel: "От неё рассчитывается рекомендуемый объём буфера.", gdzie: "Паспорт насоса — номинальная тепловая мощность.", zakres: "≥ 0. " + RU_YOURS },
      pojemnosc: { nazwa: "Имеющийся/планируемый объём буфера [л]", cel: "Сравнивается с рекомендуемым объёмом ({lkw} л на каждый кВт мощности насоса).", gdzie: "Табличка бака или предложение.", zakres: "≥ 0. " + RU_YOURS },
    },
  },
  "cop-pompy-ciepla": {
    migawka: {
      oCoChodzi: "COP — это «множитель»: тепловой насос не производит тепло из ничего, а переносит его снаружи, потребляя меньше электроэнергии, чем электронагреватель.",
      jakDziala: "Электрическая мощность = потребность в тепловой мощности ÷ COP при текущей температуре. Ниже: подбор мощности насоса к дому (запас или дефицит в самый сильный мороз, сколько догрева, бивалентная точка) и отопительная кривая (насколько ниже подача и какой COP после её снижения).",
      poCo: "Вы знаете, сколько энергии от батареи или PV потребит насос в данных условиях — и насколько больше в мороз, когда COP падает.",
      fizyka: "P_эл = P_тепл / COP.",
    },
    pola: {
      moc: { nazwa: "Потребность в тепловой мощности [кВт]", cel: "Сколько тепла должен дать насос.", gdzie: "С экрана «Теплопотери здания» или от проектировщика.", zakres: "До {mocMax} кВт. " + RU_YOURS },
      cop: { nazwa: "COP при текущей температуре [–]", cel: "Сколько кВт·ч тепла насос даёт из 1 кВт·ч электроэнергии при этой наружной температуре.", gdzie: "Паспорт насоса — таблица COP для наружных температур (напр. A2/W35, A−7/W35).", zakres: "{min}–{max}." },
    },
  },
  "halas-i-wibracje": {
    migawka: {
      oCoChodzi: "Тепловой насос — это машина с вентилятором и компрессором: если он стоит под окном спальни, спать не даст, а сосед может подать жалобу.",
      jakDziala: "Информационный экран: факторы, влияющие на шум (акустическая мощность, место монтажа, расстояние до окон, местная ночная норма), и рекомендации. Источник не даёт формулы распространения звука, поэтому приложение не рассчитывает уровень шума.",
      poCo: "Вы знаете, что проверить и что сделать, прежде чем ставить наружный блок.",
    },
    pola: {},
  },
  "infiltracja-powietrza": {
    migawka: {
      oCoChodzi: "Щели в здании — бесплатная вентиляция, но зимой вы платите за неё теплом: лучше контролируемый воздухообмен, чем случайный.",
      jakDziala: "Потери = кратность воздухообмена × объём × плотность и теплоёмкость воздуха × разница температур.",
      poCo: "Вы знаете, сколько тепловой мощности съедает негерметичность — и окупится ли уплотнение.",
      fizyka: "Q = n · V · ρ · c_p · ΔT / 3600.",
    },
    pola: {
      wymiany: { nazwa: "Кратность воздухообмена [1/ч]", cel: "Сколько раз в час весь воздух в доме меняется через неплотности.", gdzie: "По тесту герметичности (blower door) или оценка по типу конструкции.", zakres: "≥ 0. " + RU_YOURS },
      kubatura: { nazwa: "Объём здания [м³]", cel: "Объём воздуха, который меняется.", gdzie: "Площадь × высота помещений.", zakres: "≥ 0. " + RU_YOURS },
      deltaT: RU_DELTA_T,
    },
  },
  "kociol-elektryczny": {
    migawka: {
      oCoChodzi: "Электрокотёл имеет КПД около 100%, но это не то же самое, что дешёвое отопление: тепловой насос не делает тепло из электричества, а переносит его снаружи, поэтому потребляет в несколько раз меньше.",
      jakDziala: "Электроэнергия = тепло ÷ COP (котёл: COP = 1, насос: ваш COP). Стоимость = электроэнергия × цена.",
      poCo: "Вы видите разницу в кВт·ч и деньгах — в автономной системе это разница в размере PV и батареи.",
      fizyka: "E = Q / COP; K = E · c.",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Потребность в тепле [кВт·ч]", cel: "Тепло, которое должен дать котёл или насос.", gdzie: "С экрана «Потребность в отоплении и ГВС» или по расходу прошлых сезонов.", zakres: "≥ 0. " + RU_YOURS },
      cop: { nazwa: "COP теплового насоса [–]", cel: "Сколько кВт·ч тепла насос даёт из 1 кВт·ч электроэнергии.", gdzie: "Паспорт или экран «COP теплового насоса». Типичные насосы воздух-вода: 1,5–6 в зависимости от температуры.", zakres: "≥ 0. " + RU_YOURS },
      cena: { nazwa: "Цена электроэнергии [{waluta}/кВт·ч]", cel: "Переводит кВт·ч в деньги.", gdzie: "Счёт, стоимость от генератора или оценка энергии PV.", zakres: "≥ 0. " + RU_YOURS },
    },
  },
  "koszty-ogrzewania": {
    migawka: {
      oCoChodzi: "Не дайте себя обмануть дешёвому топливу. Считайте полную стоимость, а не только цену за кг.",
      jakDziala: "Для каждого источника: стоимость 1 кВт·ч тепла (топливо: цена ÷ (теплотворная способность × КПД); нагреватель: цена × расход ÷ мощность; электричество: цена ÷ COP). Полная стоимость = покупка + число лет × (тепло × стоимость кВт·ч + сервис).",
      poCo: "Вы видите, какой источник действительно дешевле за {lata} лет — и сколько электроэнергии зимой ему нужно от вашей автономной системы.",
      fizyka: "c_Q = c / (Q_н · η) | c · V̇ / P | c_эл / COP;  K = I + n · (Q · c_Q + S).",
    },
    pola: {
      zapotrzebowanie: { nazwa: "Тепло на сезон [кВт·ч]", cel: "Сколько тепла каждый источник должен дать за сезон.", gdzie: "По расходу прошлых сезонов, от проектировщика или сумма месяцев с экрана «Теплопотери здания».", zakres: "≥ 0. " + RU_YOURS },
      liczbaLat: { nazwa: "Период анализа [лет]", cel: "За сколько лет суммируются затраты на топливо и сервис.", gdzie: "Источник предлагает {lata} лет. Можно изменить.", zakres: "≥ 1." },
      rodzaj: { nazwa: "Тип источника", cel: "Определяет, как считается стоимость 1 кВт·ч тепла (топливо, паспорт нагревателя или электричество) и какие поля нужны.", gdzie: "Устройство, которое у вас есть или которое вы рассматриваете.", zakres: "Список." },
      nazwa: { ...RU_NAME, zakres: "Текст. Пусто = название типа." },
      jednostka: { nazwa: "Единица топлива", cel: "В ней указываются цена, теплотворная способность и расход.", gdzie: "Как вы покупаете топливо. mp — складометр (дрова в поленнице).", zakres: "kg, t, mp, m³, l." },
      cenaZl: { nazwa: "Цена", cel: "Цена единицы топлива или 1 кВт·ч электроэнергии.", gdzie: "Топливо: счёт или предложение. Электричество: ваша стоимость 1 кВт·ч зимой (от генератора, из сети или оценка PV).", zakres: "≥ 0. " + RU_YOURS },
      wartoscOpalowaKwh: { nazwa: "Теплотворная способность [кВт·ч/ед.]", cel: "Сколько энергии в единице топлива.", gdzie: "От поставщика или из сертификата топлива. Для дров сильно зависит от влажности.", zakres: "≥ 0. " + RU_YOURS },
      sprawnoscPct: { nazwa: "КПД устройства [%]", cel: "Какая часть энергии топлива попадает в дом в виде тепла.", gdzie: "Из паспорта котла, печи или камина.", zakres: "0–100%. " + RU_YOURS },
      mocGrzewczaKw: { nazwa: "Тепловая мощность [кВт]", cel: "Нагреватель: вместе с расходом даёт стоимость 1 кВт·ч тепла. Топливный котёл (необязательно): нужна для расчёта часов работы и вспомогательной электроэнергии.", gdzie: "Из паспорта устройства.", zakres: "≥ 0. " + RU_YOURS },
      zuzyciePaliwaNaH: { nazwa: "Расход топлива при этой мощности [ед./ч]", cel: "Вместе с мощностью даёт стоимость 1 кВт·ч тепла от нагревателя.", gdzie: "Из паспорта.", zakres: "≥ 0. " + RU_YOURS },
      cop: { nazwa: "COP (средний за сезон) [–]", cel: "Сколько кВт·ч тепла насос в среднем за сезон даёт из 1 кВт·ч электроэнергии.", gdzie: "SCOP из паспорта или с экрана «COP теплового насоса».", zakres: "≥ 0. " + RU_YOURS },
      poborPraduW: { nazwa: "Потребление при работе [Вт] (необязательно)", cel: "Вспомогательная электроэнергия топливного источника — в автономной системе её должна дать ваша установка.", gdzie: "Вентилятор, подача, насос, свеча — из паспорта.", zakres: "Пусто = вспомогательная энергия не учитывается." },
      kosztInwestycjiZl: { nazwa: "Стоимость покупки и монтажа [{waluta}]", cel: "Разовая стоимость, добавляемая к полной стоимости и окупаемости.", gdzie: "Предложение. 0 — если устройство уже есть.", zakres: "≥ 0." },
      kosztSerwisuRocznyZl: { nazwa: "Сервис и осмотры в год [{waluta}]", cel: "Постоянные затраты, добавляемые за каждый год анализа.", gdzie: "Напр. осмотр, чистка дымохода, запчасти.", zakres: "≥ 0." },
    },
  },
  "mostki-termiczne": {
    migawka: {
      oCoChodzi: "Это как дыра в свитере: даже если остальное тёплое, через дыру уходит масса энергии — непропорционально её размеру.",
      jakDziala: "Каждый линейный мостик: Ψ × длина. Сумма даёт дополнительный коэффициент потерь, который я умножаю на разницу температур с Экрана 1 и сравниваю с потерями через ограждения.",
      poCo: "Вы знаете, сколько тепла уходит через углы, перемычки, балконы и откосы — и что даст их исправление.",
      fizyka: "H_tb = Σ Ψ · l;  Φ_tb = H_tb · (θ_i − θ_e).",
    },
    pola: {
      detal: { nazwa: "Узел из EN ISO 14683", cel: "Подставляет значение Ψ из таблицы стандарта для типового узла.", gdzie: "Выберите узел, ближайший к вашему, или оставьте «своё значение Ψ».", zakres: "Необязательно." },
      nazwa: RU_NAME,
      dlugosc: { nazwa: "Длина [м]", cel: "Потери мостика растут с его длиной.", gdzie: "Общая длина таких узлов в доме — по планам и разрезам.", zakres: "≥ 0. " + RU_YOURS },
      psi: { nazwa: "Ψ [Вт/(м·K)]", cel: "Линейный коэффициент теплопередачи — сколько Вт уходит через метр узла при разнице 1 K.", gdzie: "Из каталога тепловых мостиков или от проектировщика.", zakres: RU_YOURS },
      psiPo: { nazwa: "Ψ после исправления [Вт/(м·K)] (необязательно)", cel: "Показывает, что даёт исправление узла.", gdzie: "Напр. после утепления откосов — из каталога или от проектировщика.", zakres: "Пусто = без варианта исправления." },
      nadproze: { nazwa: "Неутеплённая перемычка над окном", cel: "Отмечает мостик как неутеплённую перемычку — приложение укажет его как типичное место риска.", gdzie: "Осмотр или проект.", zakres: "Да / нет." },
      system: { nazwa: "Как измерены площади на Экране 1", cel: "Табличное Ψ зависит от системы размеров (наружные, полные внутренние, внутренние) — сумма потерь нет.", gdzie: "Нужно только для узлов из таблицы. Так, как вы считали площади ограждений на Экране 1.", zakres: "Ψe / Ψoi / Ψi." },
    },
  },
  "obciazenie-cieplne": {
    migawka: {
      oCoChodzi: "Дом зимой — дырявое ведро: отопление должно доливать столько, сколько вытекает.",
      jakDziala: "Потери через ограждения (U × A × разница температур) плюс потери с обменным воздухом в самый холодный день для вашей климатической зоны. Для месяцев — по средней температуре месяца; с COP перевожу тепло в электроэнергию. Под результатом: отчёт — что теряет больше всего тепла (рейтинг с вентиляцией), тепло на м² в год и годовая стоимость отопления. U ограждения можно ввести или рассчитать по его слоям (U = 1/(Rsi + Σ толщина/λ + Rse), EN ISO 6946, без тепловых мостов — для каркасной стены значение слишком оптимистично).",
      poCo: "Это мощность, которую должно дать отопление — в автономной системе от неё зависит, сколько электроэнергии или топлива нужно зимой.",
      fizyka: "Φ = Σ U·A·Δθ + n·V·ρ·c_p/3600·Δθ;  Q = Φ · 24 ч;  E_эл = Q / COP.",
    },
    pola: {
      nazwa: RU_NAME,
      powierzchnia: { nazwa: "Площадь [м²]", cel: "Потери через ограждение растут с его площадью.", gdzie: "По проекту или замеру. Стены — без окон и дверей (их введите отдельно).", zakres: "≥ 0. " + RU_YOURS },
      u: { nazwa: "Коэффициент U [Вт/(м²·K)]", cel: "Сколько Вт уходит через 1 м² при разнице температур 1 K.", gdzie: "Из проекта, энергетического сертификата или паспорта окна.", zakres: "≥ 0. " + RU_YOURS },
      strona: { nazwa: "С другой стороны", cel: "Определяет, считаю ли я с наружной температурой зоны или с вашей температурой с другой стороны.", gdzie: "Наружный воздух или грунт / неотапливаемое помещение.", zakres: "Список." },
      tempStrona: { nazwa: "Температура с другой стороны [°C]", cel: "Температура грунта или неотапливаемого помещения за ограждением.", gdzie: "Напр. грунт под полом, холодный чердак или гараж — ваша оценка или из проекта.", zakres: RU_YOURS },
      strefa: { nazwa: "Климатическая зона", cel: "Задаёт расчётную наружную температуру самого холодного дня.", gdzie: "По карте климатических зон Польши (PN-82/B-02403 / EN 12831).", zakres: "Зоны I–V." },
      tempDom: RU_T_HOME,
      kubatura: { nazwa: "Отапливаемый объём [м³]", cel: "Объём воздуха, который нужно нагреть при обмене.", gdzie: "Площадь × высота помещений.", zakres: "≥ 0. " + RU_YOURS },
      wymiany: { nazwa: "Кратность воздухообмена [1/ч]", cel: "Сколько раз в час меняется воздух в доме.", gdzie: "Неплотности + вентиляция. Результат теста герметичности или от проектировщика; рекуперацию тепла введите отдельно.", zakres: "≥ 0. " + RU_YOURS },
      cop: { nazwa: "COP отопления [–] (необязательно)", cel: "Переводит тепло в электроэнергию.", gdzie: "ТЭН, электрокотёл: 1. Тепловой насос: из паспорта или с экрана «COP теплового насоса».", zakres: "Пусто = без перевода в электроэнергию." },
      odzysk: { nazwa: "Рекуперация тепла вентиляции [%] (необязательно)", cel: "На столько процентов рекуператор уменьшает потери на вентиляцию.", gdzie: "КПД рекуператора из паспорта установки (заявленный). Принято, что весь введённый воздухообмен проходит через рекуператор — если часть это неплотности, введите меньшее значение.", zakres: "0–100. Пусто = без рекуперации. " + RU_YOURS },
      zrodlo: { nazwa: "Источник тепла", cel: "Электричество (ТЭН, электрокотёл, тепловой насос) входит в зимний баланс на панелях; топливо (дрова, уголь, газ, масло) используется для расчёта, на сколько хватит запаса.", gdzie: "Выберите то, чем вы действительно отапливаетесь.", zakres: "Список." },
      paliwoJednostka: { nazwa: "Единица топлива", cel: "Только подпись в результате (например кг, л, м³).", gdzie: "Так, как вы покупаете топливо.", zakres: "Любой короткий текст." },
      paliwoWo: { nazwa: "Теплотворная способность [кВт·ч/ед.]", cel: "Сколько тепла даёт единица топлива при сгорании.", gdzie: "У продавца топлива или из его карточки — приложение не подставляет значение по умолчанию, оно зависит от сорта и влажности.", zakres: "> 0. " + RU_YOURS },
      paliwoSprawnosc: { nazwa: "КПД котла или печи [%]", cel: "Какая часть тепла сгорания попадает в дом.", gdzie: "Из паспорта котла или печи.", zakres: "Больше 0 до 100. " + RU_YOURS },
      paliwoZapas: { nazwa: "Запас топлива [единиц]", cel: "По нему считаю, на сколько дней и какую часть года хватит.", gdzie: "Сколько топлива у вас есть или вы планируете запасти.", zakres: "≥ 0. " + RU_YOURS },
      kierunek: { nazwa: "Направление теплового потока", cel: "От него зависят сопротивления теплоотдачи у поверхностей (Rsi 0,10 / 0,13 / 0,17 м²·К/Вт, Rse 0,04) в расчёте U по слоям.", gdzie: "Стена — горизонтально, крыша или перекрытие под неотапливаемым чердаком — вверх, пол — вниз.", zakres: "Список (EN ISO 6946:2017, таблица 7)." },
      warstwaNazwa: { nazwa: "Название слоя", cel: "Только для вас — помогает различать слои.", gdzie: "Например, плита OSB, вата, гипсокартон.", zakres: "Любой текст." },
      warstwaGrubosc: { nazwa: "Толщина слоя [мм]", cel: "Сопротивление слоя — это толщина, делённая на λ.", gdzie: "Из проекта или замера. Укажите толщину самого слоя, а не всего ограждения.", zakres: "> 0. " + RU_YOURS },
      warstwaLambda: { nazwa: "Теплопроводность λ [Вт/(м·К)]", cel: "Чем меньше λ, тем лучше слой изолирует.", gdzie: "Заявленная λ из паспорта продукта. Материал из библиотеки подставляет значение из Inżynier Szkieletowy Pro вместе со статусом (обычно «ориентировочная») — я не угадываю теплопроводность материалов; ваше значение из паспорта всегда главнее.", zakres: "> 0. " + RU_YOURS },
      szablonPrzegrody: { nazwa: "Готовое ограждение (шаблон слоёв)", cel: "Заполняет слои типовым каркасным ограждением и задаёт направление теплового потока.", gdzie: "Выберите ближайшее к вашему ограждению, затем поправьте толщины и материалы. Заменяет все введённые ранее слои этого ограждения.", zakres: "В шаблоне нет мембран и воздушных зазоров (у них нет λ). Тепловые мосты не учитываются." },
      materialWarstwy: { nazwa: "Материал из библиотеки", cel: "Подставляет название и λ материала (и типовую толщину, если поле пустое).", gdzie: "Список из Inżynier Szkieletowy Pro. Ниже виден статус λ: паспорт производителя, норма или ориентировочная.", zakres: "Ввод собственной λ отвязывает материал от библиотеки." },
      warstwaOpor: { nazwa: "Термическое сопротивление слоя R [м²·К/Вт]", cel: "Готовое сопротивление вместо толщины и λ — для слоёв, которые производитель описывает сопротивлением (например, воздушная прослойка).", gdzie: "Из паспорта производителя. Если указать R, толщина и λ этого слоя игнорируются.", zakres: "> 0. " + RU_YOURS },
      miesiac: { nazwa: "Средняя температура месяца [°C]", cel: "По ней считаются потери и электроэнергия за месяц.", gdzie: "Из PVGIS для вашего места или вручную.", zakres: "Пустые месяцы пропускаются." },
    },
  },
  "optymalizacja-izolacji": {
    migawka: {
      oCoChodzi: "Дело не в том, чтобы утеплить как можно толще, а в том, чтобы разумно потратить деньги: есть точка, после которой очередной сантиметр утеплителя уже не окупается.",
      jakDziala: "Для каждого варианта: новое U после добавления слоя, годовая экономия тепла и стоимость одного сэкономленного кВт·ч за {lata} лет. С ценой тепла — сравнение с тем, что вы платите сегодня.",
      poCo: "Вы выбираете материал и толщину, которые окупаются, — вместо оплаты сантиметров, которые ничего не дают.",
      fizyka: "U' = 1 / (1/U + d/λ);  ΔQ = (U − U') · A · Σ(Δθ·t);  k = K / ({lata} · ΔQ).",
    },
    pola: {
      przegroda: { nazwa: "Ограждение с Экрана 1", cel: "Подставляет площадь и U — их можно поправить ниже.", gdzie: "Список наружных ограждений с экрана «Теплопотери здания».", zakres: "Необязательно." },
      powierzchnia: { nazwa: "Площадь ограждения [м²]", cel: "Экономия растёт с площадью утепления.", gdzie: "Из проекта, замера или с Экрана 1.", zakres: "≥ 0. " + RU_YOURS },
      u: { nazwa: "Текущее U [Вт/(м²·K)]", cel: "Исходная точка — от неё считается улучшение.", gdzie: "До утепления — из проекта, сертификата или с Экрана 1.", zakres: "≥ 0. " + RU_YOURS },
      cenaCiepla: { nazwa: "Цена тепла [{waluta}/кВт·ч] (необязательно)", cel: "Позволяет оценить, с какой толщины следующие сантиметры перестают окупаться.", gdzie: "Напр. с экрана «Сравнение затрат на отопление».", zakres: "Пусто = без оценки окупаемости." },
      material: { ...RU_NAME, nazwa: "Материал" },
      lambda: { nazwa: "λ [Вт/(м·K)]", cel: "Теплопроводность материала — чем меньше, тем лучше утепляет.", gdzie: "Декларируемая λ из паспорта продукта (напр. 0,035).", zakres: "> 0. " + RU_YOURS },
      grubosc: { nazwa: "Толщина [см]", cel: "Толщина добавляемого слоя утеплителя.", gdzie: "Предлагаемая толщина плит или слоя.", zakres: "≥ 0. " + RU_YOURS },
      cena: { nazwa: "Цена [{waluta}/м²]", cel: "Стоимость варианта — по ней считается стоимость сэкономленного кВт·ч.", gdzie: "За м² слоя этой толщины (с работой, если вы её учитываете).", zakres: "≥ 0. " + RU_YOURS },
    },
  },
  "pojemnosc-cieplna": {
    migawka: {
      oCoChodzi: "Тяжёлый дом — как изразцовая печь: долго нагревается, но долго держит тепло. Это то же число, которое говорит, сколько времени у вас есть после отказа отопления, прежде чем станет по-настоящему холодно.",
      jakDziala: "Теплоёмкость = сумма по слоям (плотность × удельная теплоёмкость × эффективная толщина × площадь) плюс воздух. Постоянная времени = теплоёмкость ÷ коэффициент потерь с Экрана 1 — из неё кривая температуры после отказа.",
      poCo: "Вы знаете, сколько часов есть до порога, ниже которого замёрзнет система, — и нужен ли резервный источник тепла.",
      fizyka: "κ = ρ · c · d;  C = Σ n·A·κ' + ρ_a·c_a·V;  τ = C / H;  θ(t) = θ_∞ + (θ_0 − θ_∞) · e^(−t/τ).",
    },
    pola: {
      nazwa: { ...RU_NAME, nazwa: "Слой / материал" },
      polozenie: { nazwa: "Расположение", cel: "Определяет, сколько раз и вообще ли слой накапливает тепло для помещения.", gdzie: "Одной стороной внутрь (наружная стена), целиком внутри (перегородка, перекрытие) или за утеплителем (не учитывается).", zakres: "Список." },
      powierzchnia: { nazwa: "Площадь [м²]", cel: "Теплоёмкость растёт с площадью слоя.", gdzie: "Из проекта или замера.", zakres: "≥ 0. " + RU_YOURS },
      grubosc: { nazwa: "Толщина слоя [см]", cel: "Толщина материала, накапливающего тепло.", gdzie: "Материал со стороны комнаты до первого слоя утеплителя.", zakres: "≥ 0. " + RU_YOURS },
      gestosc: { nazwa: "Плотность [кг/м³]", cel: "Более тяжёлый материал накапливает больше тепла.", gdzie: "Из паспорта материала.", zakres: "≥ 0. " + RU_YOURS },
      cieplo: { nazwa: "Удельная теплоёмкость [Дж/(кг·K)]", cel: "Сколько энергии 1 кг материала накапливает на 1 K.", gdzie: "Из паспорта материала — в Дж, не кДж.", zakres: "≥ 0. " + RU_YOURS },
      gruboscElementu: { nazwa: "Толщина всего элемента [см] (необязательно)", cel: "Ограничивает эффективную толщину, когда в ограждении больше слоёв.", gdzie: "Когда ограждение имеет больше слоёв, чем этот.", zakres: "Пусто = только этот слой." },
      tempDom: { ...RU_T_HOME, cel: "Начальная температура остывания.", gdzie: "В момент отказа.", zakres: "Пусто = с Экрана 1." },
      tempZew: { nazwa: "Температура снаружи [°C]", cel: "К ней стремится температура в доме после отказа.", gdzie: "Во время отказа.", zakres: "Пусто = расчётная для зоны с Экрана 1." },
      prog: { nazwa: "Не ниже чем [°C] (необязательно)", cel: "Приложение посчитает, через сколько часов дом достигнет этого порога.", gdzie: "Ваш порог защиты, напр. труб с водой.", zakres: "Пусто = без порога." },
    },
  },
  "pompy-cyrkulacyjne": {
    migawka: {
      oCoChodzi: "В автономной системе циркуляционные насосы — тихие воры энергии: работают 24/7, их легко недооценить, а разница между старой и новой моделью — реальные киловатт-часы в сутки.",
      jakDziala: "Энергия = мощность × часы работы. Сравниваю текущий насос с электронным (PWM) — в сутки, а с днями сезона и за весь сезон (кВт·ч и {waluta}). Ниже: расход через тепловой насос — сколько м³/ч нужно и даст ли его циркуляционный насос.",
      poCo: "Вы знаете, сколько энергии батареи вернёт замена насоса.",
      fizyka: "E = P · h / 1000.",
    },
    pola: {
      mocObecna: { nazwa: "Мощность текущего насоса [Вт]", cel: "Потребление насоса, который у вас сейчас.", gdzie: "Табличка или замер. Типично насос с постоянной скоростью: {min}–{max} Вт.", zakres: "≥ 0. " + RU_YOURS },
      mocNowa: { nazwa: "Мощность рассматриваемого электронного насоса (PWM) [Вт]", cel: "Потребление насоса, который вы рассматриваете.", gdzie: "Паспорт. Типично {min}–{max} Вт.", zakres: "≥ 0. " + RU_YOURS },
      godziny: { nazwa: "Часы работы в сутки [ч]", cel: "Сколько часов в сутки работает насос.", gdzie: "Контроллер или расписание. {h} для непрерывной работы (24/7).", zakres: "0–24." },
    },
  },
  "ryzyko-niskiego-napiecia": {
    migawka: {
      oCoChodzi: "Низкое напряжение — тихий убийца насосов: он не сломается сразу, просто перестанет работать именно тогда, когда нужнее всего.",
      jakDziala: "Запас = напряжение системы − минимальное рабочее напряжение насоса. Отрицательный или малый запас — риск отключения.",
      poCo: "Вы знаете, переживёт ли насос ночь на разряжающейся батарее.",
      fizyka: "ΔV = V_sys − V_min.",
    },
    pola: {
      vMin: { nazwa: "Минимальное рабочее напряжение насоса [В]", cel: "Ниже этого напряжения насос отключается.", gdzie: "Из паспорта теплового насоса.", zakres: "≥ 0. " + RU_YOURS },
      vSys: { nazwa: "Текущее напряжение автономной системы [В]", cel: "Сравнивается с минимальным рабочим напряжением насоса.", gdzie: "В будущем автоматически из Модуля 4 (live) — пока введите вручную с BMS или мультиметра.", zakres: "≥ 0. " + RU_YOURS },
    },
  },
  "ryzyko-zamarzniecia-dolnego-zrodla": {
    migawka: {
      oCoChodzi: "Грунт — это батарея тепла: если брать из неё слишком сильно и долго без перерыва на восстановление, в конце концов он замёрзнет.",
      jakDziala: "Информационный экран: факторы риска (температура грунта, глубина коллектора, концентрация гликоля, время непрерывной работы) и рекомендации. Источник не даёт формулы, связывающей их с температурой рассола, поэтому приложение её не рассчитывает.",
      poCo: "Вы знаете, что проверять и отслеживать, прежде чем нижний источник замёрзнет и остановит насос.",
    },
    pola: {},
  },
  "wentylacja-odzysk-ciepla": {
    migawka: {
      oCoChodzi: "Вентиляция — это лёгкие дома. Рекуперация позволяет лёгким дышать, не теряя при этом тепло.",
      jakDziala: "Возвращённое тепло = расход × КПД × плотность и теплоёмкость воздуха × разница температур. Из выигрыша вычитаю постоянное потребление вентиляторов.",
      poCo: "Вы знаете, даёт ли рекуператор в автономной системе больше, чем съедают его вентиляторы.",
      fizyka: "Q = V̇ · η · ρ · c_p · ΔT / 3600.",
    },
    pola: {
      przeplyw: { nazwa: "Производительность вентустановки [м³/ч]", cel: "Сколько воздуха меняет установка.", gdzie: "Настройка установки или проект вентиляции.", zakres: "≥ 0. " + RU_YOURS },
      sprawnosc: { nazwa: "КПД рекуператора [%]", cel: "Какая часть тепла вытяжного воздуха возвращается в дом.", gdzie: "Паспорт установки.", zakres: "0–100%. " + RU_YOURS },
      deltaT: RU_DELTA_T,
      pobor: { nazwa: "Постоянное потребление вентиляторов [Вт]", cel: "Электроэнергия, которую установка потребляет круглосуточно.", gdzie: "Паспорт. Типично {min}–{max} Вт.", zakres: "≥ 0. " + RU_YOURS },
    },
  },
  "zapotrzebowanie-co-cwu": {
    migawka: {
      oCoChodzi: "Это два разных «аппетита на тепло»: отопление скачет вместе с погодой, ГВС почти постоянно весь год.",
      jakDziala: "Отопление — по теплопотерям с Экрана 1 для каждого месяца. ГВС — число людей × литры на человека × нагрев воды. С COP перевожу оба в электроэнергию.",
      poCo: "Вы знаете, сколько тепла и электроэнергии нужно в каждом месяце, — это вход в зимний баланс.",
      fizyka: "E_ГВС = n · V · Δθ · c_w / 3,6·10⁶;  E_эл = E_отоп / COP_отоп + E_ГВС / COP_ГВС.",
    },
    pola: {
      osoby: { nazwa: "Число людей", cel: "От него зависит расход горячей воды.", gdzie: "Сколько человек живёт в доме. Можно задать на экране «Число жильцов» в Модуле 2.", zakres: "Пусто = значение из Модуля 2, если задано." },
      litry: { nazwa: "Горячая вода на человека [л/сутки]", cel: "Суточный расход горячей воды на человека.", gdzie: "Источник: ок. {l} л; Модуль 2 даёт диапазон 50–70 л. Измените, если знаете свой расход.", zakres: "≥ 0. " + RU_YOURS },
      tZimna: { nazwa: "Температура холодной воды [°C]", cel: "С неё начинается нагрев.", gdzie: "Вода из сети или колодца — измерьте на кране холодной воды.", zakres: RU_YOURS },
      tCiepla: { nazwa: "Температура горячей воды [°C]", cel: "До неё вы нагреваете воду.", gdzie: "Настройка водонагревателя или бойлера.", zakres: RU_YOURS },
      cop: { nazwa: "COP нагрева воды [–] (необязательно)", cel: "Переводит тепло ГВС в электроэнергию.", gdzie: "ТЭН: 1. Тепловой насос: из паспорта.", zakres: "Пусто = без перевода в электроэнергию." },
    },
  },
}
