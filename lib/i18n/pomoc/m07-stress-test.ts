/**
 * Help content — Module 7 (winter stress test). Numbers kept by the engines as constants enter
 * through `{params}`; the app never assumes a user value (Directive #1).
 */
import type { Tlumaczenie } from "./typy"

const TWOJ = "Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie."
const T_MIEJSCA = {
  nazwa: "Najniższa temperatura w miejscu montażu [°C]",
  cel: "Z nią porównywana jest minimalna temperatura pracy każdej pozycji.",
  gdzie: "Najzimniejsza noc w tym miejscu (garaż, szafka zewnętrzna, studnia) — nie średnia zimowa. Najlepiej z termometru min/max.",
  zakres: TWOJ,
}
const NAZWA = { nazwa: "Nazwa", cel: "Tylko opis pozycji — nie wpływa na wynik.", gdzie: "Dowolna.", zakres: "Tekst." }
const T_MIN_PRACY = {
  nazwa: "Minimalna temperatura pracy [°C]",
  cel: "Najniższa temperatura, w której producent gwarantuje poprawną pracę.",
  gdzie: "Karta katalogowa („operating temperature”) — dolna granica.",
  zakres: "Puste = brak danych, pozycja nie zostanie oceniona.",
}
const SPRAWNOSC = {
  nazwa: "Sprawność falownika [%]",
  cel: "Część energii z baterii, która dociera do odbiorników.",
  gdzie: "Karta katalogowa falownika.",
  zakres: "0–100%. " + TWOJ,
}
const SOC_MIN = {
  nazwa: "Krytyczne minimum SoC [%]",
  cel: "Poziom, przy którym BMS albo falownik odetnie zasilanie — poniżej tej granicy energii już nie ma.",
  gdzie: "Ustawienia BMS/falownika (odcięcie niskiego napięcia/SoC).",
  zakres: "0–100%. " + TWOJ,
}

export const pl = {
  "agregat-w-mrozie": {
    migawka: {
      oCoChodzi: "Rozruch na zimno, długa praca i długi postój — ile paliwa, wymian oleju i przerw kosztuje agregat w zimowym scenariuszu.",
      jakDziala: "Paliwo = czas pracy × zużycie; wymiany oleju = czas ÷ interwał; przerwy wynikają z limitu pracy ciągłej producenta. Dodatkowo ocena ryzyka rozruchu dla paliwa i temperatury oraz postoju ≥ {postoj} dni w mrozie.",
      poCo: "Wiesz, ile paliwa i oleju zgromadzić przed zimą i czy agregat w ogóle odpali.",
      fizyka: "V = t · q; n_olej = ⌊t / t_olej⌋; n_przerw = ⌈t / t_ciąg⌉ − 1.",
    },
    pola: {
      paliwo: { nazwa: "Paliwo", cel: "Od rodzaju paliwa zależy ryzyko rozruchu na mrozie.", gdzie: "Co faktycznie tankujesz.", zakres: "Zwykły olej napędowy: ryzyko od +{ryzyko} °C, wysokie poniżej +{wysokie} °C; od {rozruch} °C każdy diesel potrzebuje naładowanego akumulatora i sprawnych świec żarowych." },
      temp: { nazwa: "Najniższa temperatura przy agregacie [°C]", cel: "Temperatura agregatu i paliwa przy rozruchu.", gdzie: "Tam, gdzie stoi agregat i zbiornik — na zewnątrz, garaż, wiata, kontener — najzimniejsza noc.", zakres: TWOJ },
      czasPracy: { nazwa: "Łączny czas pracy [h]", cel: "Ile godzin agregat ma pracować w scenariuszu.", gdzie: "Np. z ekranu „Agregat prądotwórczy” (Moduł 2) albo „Blackout”.", zakres: TWOJ },
      maxCiagla: { nazwa: "Maks. praca ciągła wg producenta [h]", cel: "Po ilu godzinach agregat wymaga przerwy.", gdzie: "Instrukcja — niektóre agregaty wymagają przerwy co 8–12 h.", zakres: "Puste = bez limitu." },
      przerwa: { nazwa: "Wymagana przerwa [h]", cel: "Długość przerwy — wydłuża czas kalendarzowy scenariusza.", gdzie: "Instrukcja agregatu.", zakres: TWOJ },
      zuzycie: { nazwa: "Zużycie paliwa [l/h]", cel: "Z nim liczony jest zapas paliwa.", gdzie: "Karta katalogowa przy typowym obciążeniu.", zakres: TWOJ },
      olej: { nazwa: "Wymiana oleju co [h]", cel: "Liczba wymian oleju w trakcie scenariusza.", gdzie: "Instrukcja agregatu (interwał serwisowy).", zakres: "Puste = nie liczę wymian." },
      dniPostoju: { nazwa: "Dni postoju bez uruchamiania", cel: "Długi postój w mrozie zwiększa ryzyko, że agregat nie odpali.", gdzie: "Ile dni agregat stoi między uruchomieniami.", zakres: "Ryzyko od {postoj} dni w mrozie." },
    },
  },
  "analiza-spof": {
    migawka: {
      oCoChodzi: "Pojedynczy punkt awarii (SPOF) to element, którego awaria zatrzymuje cały system.",
      jakDziala: "Wpisujesz komponenty i zaznaczasz, które mają redundancję (zapasowy egzemplarz albo obejście). Każdy bez redundancji trafia na listę SPOF.",
      poCo: "Znajdziesz słabe ogniwo, zanim znajdzie je zima — i wiesz, co zdublować albo mieć na półce.",
      fizyka: "SPOF = { k : brak redundancji(k) }.",
    },
    pola: {
      nazwa: NAZWA,
      typ: { nazwa: "Typ komponentu", cel: "Kategoria elementu systemu.", gdzie: "Wybierz z listy.", zakres: "BMS, falownik, bezpiecznik główny, MPPT, pompa ciepła, pompa, czujnik, inne." },
      redundancja: { nazwa: "Redundancja", cel: "Czy awaria tego elementu ma obejście (drugi egzemplarz, bypass, część zapasowa).", gdzie: "Twoja instalacja i magazyn części.", zakres: "Zaznaczone = nie jest SPOF." },
    },
  },
  "awaria-stringa-zima": {
    migawka: {
      oCoChodzi: "Jeden chory string, który latem byłby drobnym problemem, w styczniu może oznaczać, że dom nie przetrwa nocy bez agregatu.",
      jakDziala: "Deficyt = zapotrzebowanie − (produkcja całkowita − produkcja stringu). Jeśli podasz baterię — ile dni bateria pokryje ten deficyt.",
      poCo: "Wiesz, czy awaria jednego stringu to niewygoda, czy sytuacja awaryjna.",
      fizyka: "D = E − (P_cał − P_str); d = C · η · DoD / D.",
    },
    pola: {
      produkcjaCalkowitaKwhDoba: { nazwa: "Produkcja instalacji w najgorszym miesiącu [kWh/dobę]", cel: "Punkt wyjścia przed awarią.", gdzie: "Z Modułu 3 (produkcja miesięczna).", zakres: TWOJ },
      produkcjaStringuKwhDoba: { nazwa: "Produkcja stringu, który ulega awarii [kWh/dobę]", cel: "Ile produkcji znika.", gdzie: "Udział stringu w produkcji (np. proporcjonalnie do liczby paneli).", zakres: TWOJ },
      zapotrzebowanieKwhDoba: { nazwa: "Zapotrzebowanie w tym miesiącu [kWh/dobę]", cel: "Z nim porównywana jest produkcja po awarii.", gdzie: "Bilans Modułu 2.", zakres: TWOJ },
      pojemnoscBateriiKwh: { nazwa: "Pojemność baterii [kWh] (opcjonalnie)", cel: "Pozwala policzyć, ile dni bateria pokryje deficyt.", gdzie: "Karta baterii.", zakres: "Puste = bez liczenia dni." },
      dodPct: { nazwa: "Użyteczna głębokość rozładowania [%]", cel: "Część pojemności, którą wolno zużyć.", gdzie: "Karta baterii albo ustawienia BMS.", zakres: "0–100%." },
      sprawnoscFalownikaPct: SPRAWNOSC,
    },
  },
  "bez-rekuperacji": {
    migawka: {
      oCoChodzi: "Gdy rekuperator zamarznie, dom traci odzysk ciepła z powietrza wentylacyjnego — albo trzeba wyłączyć wentylację.",
      jakDziala: "Dodatkowa strata = strumień powietrza × sprawność odzysku × ρ·c_p × (T_wewn − T_zewn) ÷ 3600. Opcjonalnie moc nagrzewnicy wstępnej, która podgrzeje powietrze do bezpiecznej temperatury.",
      poCo: "Wiesz, ile kW i kWh na dobę kosztuje utrata odzysku i jak mocnej nagrzewnicy potrzebujesz.",
      fizyka: "ΔP = V̇ · η · ρ · c_p · (T_w − T_z) / 3600; P_nagrz = V̇ · ρ · c_p · (T_nagrz − T_z) / 3600.",
    },
    pola: {
      strumienM3H: { nazwa: "Wydajność centrali [m³/h]", cel: "Ile powietrza wymienia wentylacja.", gdzie: "Moduł 6 „Wentylacja z odzyskiem ciepła” albo nastawa centrali.", zakres: TWOJ },
      sprawnoscOdzyskuPct: { nazwa: "Sprawność odzysku [%]", cel: "Część ciepła odzyskiwana przez wymiennik — tyle tracisz po zamarznięciu.", gdzie: "Karta rekuperatora.", zakres: "0–100%." },
      tempWewnC: { nazwa: "Temperatura wewnątrz [°C]", cel: "Temperatura powietrza wywiewanego.", gdzie: "Twoja nastawa.", zakres: TWOJ },
      tempZewnC: { nazwa: "Najniższa temperatura na zewnątrz [°C]", cel: "Temperatura powietrza nawiewanego.", gdzie: "Najzimniejsza noc w lokalizacji.", zakres: TWOJ },
      tempZamarzaniaWymiennikaC: { nazwa: "Granica zamarzania wymiennika [°C] (opcjonalnie)", cel: "Poniżej tej temperatury wymiennik szroni się.", gdzie: "Instrukcja rekuperatora.", zakres: "Puste = bez oceny." },
      tempZaNagrzewnicaC: { nazwa: "Temperatura za nagrzewnicą wstępną [°C] (opcjonalnie)", cel: "Do obliczenia mocy nagrzewnicy.", gdzie: "Instrukcja rekuperatora (wymagana temperatura na wlocie wymiennika).", zakres: "Puste = bez obliczenia nagrzewnicy." },
    },
  },
  blackout: {
    migawka: {
      oCoChodzi: "Test najgorszego koszmaru: wiele dni bez słońca w mrozie. Jeśli system przeżyje ten scenariusz, przeżyje prawie wszystko inne.",
      jakDziala: "Dni przetrwania = energia dostępna w baterii (C × η × (SoC₀ − SoC_min)) ÷ (zużycie dobowe − energia z agregatu). Jeśli bateria nie wystarczy na cały scenariusz — ile pojemności brakuje.",
      poCo: "Twarda odpowiedź: przetrwasz czy nie, i co trzeba dołożyć.",
      fizyka: "d = C · η · (SoC₀ − SoC_min) / (E − E_agr); ΔC = (N · (E − E_agr) − E_dost) / (η · (SoC₀ − SoC_min)).",
    },
    pola: {
      pojemnoscKwh: { nazwa: "Pojemność baterii (znamionowa) [kWh]", cel: "Energia zgromadzona w magazynie.", gdzie: "Karta baterii.", zakres: TWOJ },
      socStartPct: { nazwa: "SoC na początku [%]", cel: "Stan naładowania w chwili, gdy znika słońce.", gdzie: "Zakładany poziom przed frontem pogodowym.", zakres: "0–100%." },
      socMinPct: { ...SOC_MIN, gdzie: "Ustawienia BMS/falownika (odcięcie niskiego napięcia/SoC) — np. 10%." },
      sprawnoscFalownikaPct: SPRAWNOSC,
      zuzycieDoboweKwh: { nazwa: "Zużycie dobowe w mrozie [kWh/dobę]", cel: "Energia potrzebna w najzimniejsze dni, z ogrzewaniem.", gdzie: "Bilans Modułu 2 i 6.", zakres: TWOJ },
      dniScenariusza: { nazwa: "Dni bez słońca", cel: "Długość testowanego scenariusza.", gdzie: "Twoja decyzja — scenariusz skrajny źródła: 10–14 dni, do −25 °C.", zakres: TWOJ },
      agregatKwhDoba: { nazwa: "Energia z agregatu [kWh/dobę] (opcjonalnie)", cel: "Pomniejsza dobowy deficyt.", gdzie: "Moc agregatu × godziny pracy na dobę (× sprawność ładowania).", zakres: "Puste = bez agregatu." },
    },
  },
  "elektronika-w-mrozie": {
    migawka: {
      oCoChodzi: "Które urządzenia przestaną działać poprawnie przy najniższej temperaturze w miejscu montażu.",
      jakDziala: "Dla każdego urządzenia: czy najniższa temperatura miejsca ≥ minimalnej temperatury pracy. BMS i przetwornica/falownik są krytyczne (brak startu = brak zasilania); pozostałe — ostrzeżenie.",
      poCo: "Wiesz, co przenieść do ciepła, dogrzać albo wymienić na wersję mrozoodporną.",
      fizyka: "T_min,miejsca ≥ T_min,pracy.",
    },
    pola: {
      temp: T_MIEJSCA,
      nazwa: NAZWA,
      typ: { nazwa: "Typ urządzenia", cel: "Decyduje, czy brak pracy to twardy stop, czy ostrzeżenie.", gdzie: "Wybierz z listy.", zakres: "BMS, wyświetlacz, czujnik, przetwornica, regulator, inne." },
      tempMin: T_MIN_PRACY,
    },
  },
  "grzalki-dachowe": {
    migawka: {
      oCoChodzi: "Kable grzewcze przeciw zatorom lodowym w rynnach i koszach dachu potrafią pobierać więcej niż pompa ciepła.",
      jakDziala: "Moc = długość kabla × moc na metr; energia dobowa = moc × godziny pracy ÷ 1000. Opcjonalnie porównanie z pompą ciepła i wolnym zapasem mocy falownika.",
      poCo: "Wiesz, czy falownik i bateria udźwigną grzanie rynien w mroźną noc.",
      fizyka: "P = L · p_m; E = P · t / 1000.",
    },
    pola: {
      dlugosc: { nazwa: "Łączna długość kabla grzewczego [m]", cel: "Z niej liczona jest moc całkowita.", gdzie: "Rynny, rury spustowe i kosze dachowe — tam, gdzie kabel faktycznie leży.", zakres: TWOJ },
      mocNaMetr: { nazwa: "Moc kabla na metr [W/m]", cel: "Moc jednostkowa kabla.", gdzie: "Karta katalogowa kabla.", zakres: TWOJ },
      czas: { nazwa: "Czas pracy na dobę [h]", cel: "Ile godzin kable grzeją.", gdzie: "Nastawa sterownika / termostatu.", zakres: "0–24 h." },
      mocPompy: { nazwa: "Moc elektryczna pompy ciepła [W] (opcjonalnie)", cel: "Do porównania — grzałki potrafią pobierać więcej niż pompa.", gdzie: "Karta pompy ciepła.", zakres: "Puste = bez porównania." },
      zapasFalownika: { nazwa: "Wolny zapas mocy falownika [W] (opcjonalnie)", cel: "Sprawdza, czy falownik udźwignie grzałki.", gdzie: "Moc falownika minus odbiorniki pracujące w tym samym czasie.", zakres: "Puste = bez sprawdzenia." },
    },
  },
  "obciazenie-dachu-sniegiem": {
    migawka: {
      oCoChodzi: "Ile śniegu musi przenieść dach według normy i ile waży to, co leży na nim teraz.",
      jakDziala: "Obciążenie normowe = współczynnik kształtu dachu × współczynnik ekspozycji × współczynnik termiczny × obciążenie gruntu dla strefy i wysokości (PN-EN 1991-1-3). Ciężar bieżący = ciężar objętościowy śniegu × grubość. Oba porównywane z nośnością dachu; ostrzeżenie od {prog}% nośności.",
      poCo: "Wiesz, kiedy odśnieżać dach z panelami, zanim zrobi się groźnie.",
      fizyka: "s = μ₁ · C_e · C_t · s_k; q = γ · h.",
    },
    pola: {
      strefa: { nazwa: "Strefa obciążenia śniegiem", cel: "Wyznacza obciążenie śniegiem gruntu s_k.", gdzie: "Mapa stref PN-EN 1991-1-3, Załącznik krajowy NB.1. Strefa 2 — większość środkowej Polski; 4 — Pomorze Zachodnie i część Wielkopolski/Kujaw; 5 — okolice Tatr.", zakres: "Strefy 1–5." },
      wysokosc: { nazwa: "Wysokość nad poziomem morza [m]", cel: "W części stref s_k rośnie z wysokością.", gdzie: "Mapa / GPS / Moduł 1.", zakres: TWOJ },
      kat: { nazwa: "Kąt spadku dachu [°]", cel: "Wyznacza współczynnik kształtu μ₁.", gdzie: "Projekt budowlany albo pomiar.", zakres: "0–90°. 0° = dach płaski." },
      otoczenie: { nazwa: "Otoczenie budynku", cel: "Współczynnik ekspozycji C_e — wiatr zwiewa albo nawiewa śnieg.", gdzie: "Wystawiony: płasko, otwarte ze wszystkich stron. Osłonięty: budynek dużo niższy niż teren, drzewa lub budynki wokół.", zakres: "Wystawiony / normalny / osłonięty." },
      nosnosc: { nazwa: "Nośność dachu na śnieg [kN/m²]", cel: "Z nią porównywane są oba obciążenia.", gdzie: "Projekt budowlany albo konstruktor (wartość charakterystyczna). 1 kN/m² ≈ 102 kg/m².", zakres: TWOJ },
      grubosc: { nazwa: "Grubość śniegu na dachu teraz [cm] (opcjonalnie)", cel: "Do oceny bieżącego ciężaru śniegu.", gdzie: "Pomiar tyczką / z ziemi.", zakres: "Puste = tylko obciążenie normowe." },
      rodzajSniegu: { nazwa: "Rodzaj śniegu", cel: "Ciężar objętościowy śniegu zależy od jego stanu — mokry waży wielokrotnie więcej niż świeży.", gdzie: "Oceń wzrokowo.", zakres: "Świeży / osiadły / stary / mokry." },
    },
  },
  "pompy-zawory-w-mrozie": {
    migawka: {
      oCoChodzi: "Które pompy, zawory i siłowniki mogą się zablokować przy najniższej temperaturze w miejscu montażu.",
      jakDziala: "Dla każdego elementu: czy najniższa temperatura miejsca ≥ minimalnej temperatury pracy z karty.",
      poCo: "Wiesz, co zaizolować, dogrzać albo przenieść, zanim woda stanie.",
      fizyka: "T_min,miejsca ≥ T_min,pracy.",
    },
    pola: {
      temp: T_MIEJSCA,
      nazwa: NAZWA,
      typ: { nazwa: "Typ elementu", cel: "Kategoria armatury.", gdzie: "Wybierz z listy.", zakres: "Pompa, zawór, siłownik, inne." },
      tempMin: T_MIN_PRACY,
    },
  },
  "pre-heat": {
    migawka: {
      oCoChodzi: "Ładuj ciepło, zanim przyjdzie mróz — przegrzej dom i bojler w słoneczny dzień przed frontem.",
      jakDziala: "Ciepło w budynku = pojemność cieplna × podniesienie temperatury; ciepło w bojlerze = litry × ΔT × {kwhNaLK}; energia elektryczna = suma ÷ COP; bufor czasowy = ciepło budynku ÷ straty.",
      poCo: "Wiesz, ile godzin mrozu „kupujesz” nadwyżką PV i czy ta nadwyżka wystarczy.",
      fizyka: "Q_dom = C · ΔT; Q_CWU = V · ΔT_CWU · {kwhNaLK}; E_el = (Q_dom + Q_CWU) / COP; t = Q_dom / P_strat.",
    },
    pola: {
      pojemnoscCieplnaKwhK: { nazwa: "Pojemność cieplna budynku [kWh/K]", cel: "Ile ciepła budynek magazynuje na 1 K.", gdzie: "Moduł 6 „Pojemność cieplna budynku”.", zakres: TWOJ },
      podniesienieTempDomuK: { nazwa: "O ile podnieść temperaturę w domu [K]", cel: "Zakres przegrzania.", gdzie: "Np. z 20 °C do 23 °C = 3 K.", zakres: TWOJ },
      stratyCieplaKw: { nazwa: "Straty ciepła przy nadchodzącym mrozie [kW]", cel: "Jak szybko budynek oddaje zgromadzone ciepło.", gdzie: "Moduł 6 „Straty ciepła budynku”.", zakres: TWOJ },
      pojemnoscBojleraL: { nazwa: "Pojemność bojlera [l] (opcjonalnie)", cel: "Dodatkowy magazyn ciepła w C.W.U.", gdzie: "Tabliczka bojlera.", zakres: "Puste = bez bojlera." },
      podniesienieTempBojleraK: { nazwa: "O ile podgrzać bojler [K]", cel: "Zakres przegrzania C.W.U.", gdzie: "Np. z 50 °C do 70 °C = 20 K.", zakres: TWOJ },
      cop: { nazwa: "COP ogrzewania", cel: "Ile ciepła daje 1 kWh prądu.", gdzie: "Pompa ciepła — z karty; grzałka elektryczna = 1.", zakres: TWOJ },
      nadwyzkaPvKwh: { nazwa: "Nadwyżka PV w dniu przed mrozem [kWh] (opcjonalnie)", cel: "Sprawdza, czy przegrzanie zmieści się w nadwyżce.", gdzie: "Prognoza produkcji minus zużycie.", zakres: "Puste = bez sprawdzenia." },
      zrodloEnergii: { nazwa: "Skąd energia na przegrzanie?", cel: "Grzanie nocą z baterii zjada rezerwę na mróz — aplikacja to ostrzega.", gdzie: "Twoja strategia.", zakres: "Nadwyżka PV w dzień / agregat / bateria w nocy." },
    },
  },
  "procedura-black-start": {
    migawka: {
      oCoChodzi: "Uruchomienie systemu po całkowitym rozładowaniu — trzeba wiedzieć dokładnie, co i w jakiej kolejności zrobić.",
      jakDziala: "Lista kroków w wymaganej kolejności: agregat → ładowarka/MPPT → wybudzenie BMS → minimalne naładowanie → falownik i stopniowe załączanie odbiorników krytycznych.",
      poCo: "Nie uszkodzisz ogniw ani falownika w stresie, po ciemku i na mrozie.",
    },
    pola: {},
  },
  "ryzyko-zamarzniecia": {
    migawka: {
      oCoChodzi: "Czy kable, rury i uziomy leżą poniżej strefy przemarzania, i jak bezpiecznie rozmrozić rurę.",
      jakDziala: "Dla każdej instalacji: głębokość ułożenia ≥ głębokość przemarzania; dla rury wodnej wymagany dodatkowy zapas {zapas} cm.",
      poCo: "Wiesz, która instalacja zamarznie, zanim to się stanie.",
      fizyka: "h_ułożenia ≥ h_z (rura wodna: h_z + {zapas} cm).",
    },
    pola: {
      glebokoscPrzemarzania: { nazwa: "Głębokość przemarzania gruntu [cm]", cel: "Granica, poniżej której grunt nie zamarza.", gdzie: "Mapa stref przemarzania dla lokalizacji albo projekt budowlany.", zakres: TWOJ },
      nazwa: NAZWA,
      typ: { nazwa: "Typ instalacji", cel: "Rura wodna wymaga większego zapasu niż kabel czy uziom.", gdzie: "Wybierz z listy.", zakres: "Kabel, rura wodna, uziom, inne." },
      glebokosc: { nazwa: "Głębokość ułożenia [cm]", cel: "Na jakiej głębokości leży instalacja.", gdzie: "Dokumentacja powykonawcza albo pomiar.", zakres: TWOJ },
      rozmrazanie: { nazwa: "Jak rozmrozisz zamarzniętą rurę?", cel: "Otwarty ogień przy rurach to ryzyko pożaru i uszkodzenia — aplikacja to ostrzega.", gdzie: "Twój plan awaryjny.", zakres: "Nie dotyczy / kabel grzewczy / otwarty ogień." },
    },
  },
  "strategia-zamarzanie": {
    migawka: {
      oCoChodzi: "Gdy energii jest mało, trzeba wybrać, co poświęcić — ogrzewanie i woda są ważniejsze niż zmywarka.",
      jakDziala: "Komfort (3) odłączany od razu, ważne (2) przy SoC poniżej {prog}%, krytyczne (1) nigdy. Etap A: krytyczne + ważne do max({prog}%, SoC_min); etap B: same krytyczne do SoC_min. Energia = C × η × ΔSoC.",
      poCo: "Wiesz, ile godzin wytrzymają najważniejsze odbiorniki.",
      fizyka: "t_A = C·η·(SoC₀ − max({prog}%, SoC_min)) / (P₁ + P₂); t_B = C·η·(min(SoC₀, {prog}%) − SoC_min) / P₁.",
    },
    pola: {
      pojemnoscKwh: { nazwa: "Pojemność baterii [kWh]", cel: "Energia zgromadzona w magazynie.", gdzie: "Karta baterii.", zakres: TWOJ },
      socPct: { nazwa: "Aktualny SoC [%]", cel: "Punkt startowy strategii.", gdzie: "Wyświetlacz BMS/falownika.", zakres: "0–100%." },
      socMinPct: { ...SOC_MIN, nazwa: "SoC wyłączenia systemu [%]" },
      sprawnoscFalownikaPct: SPRAWNOSC,
      nazwa: NAZWA,
      moc: { nazwa: "Moc odbiornika [W]", cel: "Moc tego odbiornika w czasie mrozu.", gdzie: "Tabliczka albo pomiar.", zakres: TWOJ },
      priorytet: { nazwa: "Priorytet", cel: "Kolejność odłączania przy spadku SoC.", gdzie: "Twoja decyzja.", zakres: "1 — krytyczny (nigdy), 2 — ważny (przy SoC < {prog}%), 3 — komfort (od razu)." },
    },
  },
  "sztywnienie-izolacji": {
    migawka: {
      oCoChodzi: "Czy izolacja kabli, osłony i złączki wytrzymają najniższą temperaturę w miejscu montażu.",
      jakDziala: "Dla każdego materiału: czy temperatura miejsca ≥ jego granicy. PVC sztywnieje i pęka poniżej {pvc} °C, XLPE wytrzymuje do {xlpe} °C; dla gumy i aluminium źródło nie podaje liczby — tylko ostrzeżenie opisowe.",
      poCo: "Wiesz, które kable i złączki wymienić, zanim pękną przy poruszeniu na mrozie.",
      fizyka: "T_min,miejsca ≥ T_min,materiału.",
    },
    pola: {
      temp: { ...T_MIEJSCA, gdzie: "Dla kabli na zewnątrz i złączek w ziemi — najzimniejsza noc w lokalizacji, nie średnia zimowa." },
    },
  },
  "wind-chill": {
    migawka: {
      oCoChodzi: "Wiatr wywiewa ciepło z domu nawet wtedy, gdy termometr nie pokazuje wcale tak niskiej temperatury.",
      jakDziala: "Temperatura odczuwalna ze wzoru NWS/Environment Canada (2001). Wzór obowiązuje dla temperatury ≤ {maxT} °C i wiatru ≥ {minV} km/h.",
      poCo: "Uświadamia, że straty ciepła w wietrzną noc są większe, niż sugeruje sam termometr.",
      fizyka: "WC = 13,12 + 0,6215·T − 11,37·V^0,16 + 0,3965·T·V^0,16.",
    },
    pola: {
      temp: { nazwa: "Temperatura powietrza [°C]", cel: "Temperatura z termometru.", gdzie: "Prognoza pogody albo stacja lokalna.", zakres: "Wzór ma sens do {maxT} °C." },
      wiatr: { nazwa: "Prędkość wiatru [km/h]", cel: "Im mocniej wieje, tym niższa temperatura odczuwalna.", gdzie: "Na wysokości ok. 10 m — prognoza pogody albo stacja lokalna.", zakres: "Wzór ma sens od {minV} km/h." },
    },
  },
}

const TWOJ_EN = "Your installation — the app does not assume a typical value for you."
const T_MIEJSCA_EN = {
  nazwa: "Lowest temperature at the installation site [°C]",
  cel: "Each item's minimum operating temperature is compared with it.",
  gdzie: "The coldest night at that spot (garage, outdoor cabinet, well) — not the winter average. Best from a min/max thermometer.",
  zakres: TWOJ_EN,
}
const NAZWA_EN = { nazwa: "Name", cel: "Only a description of the item — does not affect the result.", gdzie: "Anything.", zakres: "Text." }
const T_MIN_PRACY_EN = {
  nazwa: "Minimum operating temperature [°C]",
  cel: "The lowest temperature at which the manufacturer guarantees correct operation.",
  gdzie: "Datasheet (“operating temperature”) — lower limit.",
  zakres: "Empty = no data, the item will not be assessed.",
}
const SPRAWNOSC_EN = {
  nazwa: "Inverter efficiency [%]",
  cel: "The part of battery energy that reaches the loads.",
  gdzie: "Inverter datasheet.",
  zakres: "0–100%. " + TWOJ_EN,
}
const SOC_MIN_EN = {
  nazwa: "Critical minimum SoC [%]",
  cel: "The level at which the BMS or inverter cuts power — below it there is no more energy.",
  gdzie: "BMS/inverter settings (low voltage/SoC cut-off).",
  zakres: "0–100%. " + TWOJ_EN,
}

export const en: Tlumaczenie<typeof pl> = {
  "agregat-w-mrozie": {
    migawka: {
      oCoChodzi: "Cold start, long running and long idle periods — how much fuel, oil changes and breaks a generator costs in a winter scenario.",
      jakDziala: "Fuel = running time × consumption; oil changes = time ÷ interval; breaks follow from the manufacturer's continuous-run limit. Plus a starting-risk assessment for fuel and temperature and for idling ≥ {postoj} days in frost.",
      poCo: "You know how much fuel and oil to stock before winter and whether the generator will start at all.",
      fizyka: "V = t · q; n_oil = ⌊t / t_oil⌋; n_breaks = ⌈t / t_cont⌉ − 1.",
    },
    pola: {
      paliwo: { nazwa: "Fuel", cel: "The cold-start risk depends on the fuel type.", gdzie: "What you actually fill up with.", zakres: "Regular diesel: risk from +{ryzyko} °C, high below +{wysokie} °C; from {rozruch} °C every diesel needs a charged battery and working glow plugs." },
      temp: { nazwa: "Lowest temperature at the generator [°C]", cel: "Temperature of the generator and fuel at start-up.", gdzie: "Where the generator and tank stand — outdoors, garage, shed, container — the coldest night.", zakres: TWOJ_EN },
      czasPracy: { nazwa: "Total running time [h]", cel: "How many hours the generator must run in the scenario.", gdzie: "E.g. from the “Generator” screen (Module 2) or “Blackout”.", zakres: TWOJ_EN },
      maxCiagla: { nazwa: "Max. continuous run per manufacturer [h]", cel: "After how many hours the generator needs a break.", gdzie: "Manual — some generators need a break every 8–12 h.", zakres: "Empty = no limit." },
      przerwa: { nazwa: "Required break [h]", cel: "Break length — extends the scenario's calendar time.", gdzie: "Generator manual.", zakres: TWOJ_EN },
      zuzycie: { nazwa: "Fuel consumption [l/h]", cel: "The fuel stock is calculated from it.", gdzie: "Datasheet at typical load.", zakres: TWOJ_EN },
      olej: { nazwa: "Oil change every [h]", cel: "Number of oil changes during the scenario.", gdzie: "Generator manual (service interval).", zakres: "Empty = oil changes not counted." },
      dniPostoju: { nazwa: "Days idle without starting", cel: "A long idle period in frost increases the risk that the generator will not start.", gdzie: "How many days the generator stands between runs.", zakres: "Risk from {postoj} days in frost." },
    },
  },
  "analiza-spof": {
    migawka: {
      oCoChodzi: "A single point of failure (SPOF) is an element whose failure stops the whole system.",
      jakDziala: "You enter the components and tick which have redundancy (a spare unit or a bypass). Every one without redundancy goes on the SPOF list.",
      poCo: "You find the weak link before winter does — and know what to duplicate or keep on the shelf.",
      fizyka: "SPOF = { k : no redundancy(k) }.",
    },
    pola: {
      nazwa: NAZWA_EN,
      typ: { nazwa: "Component type", cel: "Category of the system element.", gdzie: "Choose from the list.", zakres: "BMS, inverter, main fuse, MPPT, heat pump, pump, sensor, other." },
      redundancja: { nazwa: "Redundancy", cel: "Whether a failure of this element has a workaround (second unit, bypass, spare part).", gdzie: "Your installation and spare parts stock.", zakres: "Ticked = not a SPOF." },
    },
  },
  "awaria-stringa-zima": {
    migawka: {
      oCoChodzi: "One sick string, a minor problem in summer, in January can mean the house will not survive the night without a generator.",
      jakDziala: "Deficit = demand − (total production − string production). If you enter a battery — how many days it will cover this deficit.",
      poCo: "You know whether a single string failure is an inconvenience or an emergency.",
      fizyka: "D = E − (P_tot − P_str); d = C · η · DoD / D.",
    },
    pola: {
      produkcjaCalkowitaKwhDoba: { nazwa: "Installation production in the worst month [kWh/day]", cel: "Starting point before the failure.", gdzie: "From Module 3 (monthly production).", zakres: TWOJ_EN },
      produkcjaStringuKwhDoba: { nazwa: "Production of the failing string [kWh/day]", cel: "How much production disappears.", gdzie: "The string's share of production (e.g. proportional to the number of panels).", zakres: TWOJ_EN },
      zapotrzebowanieKwhDoba: { nazwa: "Demand in this month [kWh/day]", cel: "Production after the failure is compared with it.", gdzie: "Module 2 balance.", zakres: TWOJ_EN },
      pojemnoscBateriiKwh: { nazwa: "Battery capacity [kWh] (optional)", cel: "Lets the app calculate how many days the battery covers the deficit.", gdzie: "Battery datasheet.", zakres: "Empty = days not calculated." },
      dodPct: { nazwa: "Usable depth of discharge [%]", cel: "Part of the capacity that may be used.", gdzie: "Battery datasheet or BMS settings.", zakres: "0–100%." },
      sprawnoscFalownikaPct: SPRAWNOSC_EN,
    },
  },
  "bez-rekuperacji": {
    migawka: {
      oCoChodzi: "When the heat recovery unit freezes, the house loses heat recovery from ventilation air — or ventilation has to be switched off.",
      jakDziala: "Extra loss = air flow × recovery efficiency × ρ·c_p × (T_in − T_out) ÷ 3600. Optionally the power of a pre-heater that warms the air to a safe temperature.",
      poCo: "You know how many kW and kWh per day the loss of recovery costs and how strong a pre-heater you need.",
      fizyka: "ΔP = V̇ · η · ρ · c_p · (T_in − T_out) / 3600; P_preheat = V̇ · ρ · c_p · (T_preheat − T_out) / 3600.",
    },
    pola: {
      strumienM3H: { nazwa: "Unit air flow [m³/h]", cel: "How much air the ventilation exchanges.", gdzie: "Module 6 “Heat recovery ventilation” or the unit setting.", zakres: TWOJ_EN },
      sprawnoscOdzyskuPct: { nazwa: "Recovery efficiency [%]", cel: "Part of heat recovered by the exchanger — this is what you lose when it freezes.", gdzie: "Unit datasheet.", zakres: "0–100%." },
      tempWewnC: { nazwa: "Indoor temperature [°C]", cel: "Exhaust air temperature.", gdzie: "Your setting.", zakres: TWOJ_EN },
      tempZewnC: { nazwa: "Lowest outdoor temperature [°C]", cel: "Supply air temperature.", gdzie: "The coldest night at the location.", zakres: TWOJ_EN },
      tempZamarzaniaWymiennikaC: { nazwa: "Exchanger freezing limit [°C] (optional)", cel: "Below this temperature the exchanger frosts up.", gdzie: "Unit manual.", zakres: "Empty = not assessed." },
      tempZaNagrzewnicaC: { nazwa: "Temperature after the pre-heater [°C] (optional)", cel: "For calculating the pre-heater power.", gdzie: "Unit manual (required exchanger inlet temperature).", zakres: "Empty = pre-heater not calculated." },
    },
  },
  blackout: {
    migawka: {
      oCoChodzi: "The worst-nightmare test: many days without sun in frost. If the system survives this, it survives almost anything else.",
      jakDziala: "Survival days = energy available in the battery (C × η × (SoC₀ − SoC_min)) ÷ (daily consumption − generator energy). If the battery does not last the whole scenario — how much capacity is missing.",
      poCo: "A hard answer: you survive or not, and what needs adding.",
      fizyka: "d = C · η · (SoC₀ − SoC_min) / (E − E_gen); ΔC = (N · (E − E_gen) − E_avail) / (η · (SoC₀ − SoC_min)).",
    },
    pola: {
      pojemnoscKwh: { nazwa: "Battery capacity (rated) [kWh]", cel: "Energy stored in the battery.", gdzie: "Battery datasheet.", zakres: TWOJ_EN },
      socStartPct: { nazwa: "SoC at the start [%]", cel: "State of charge when the sun disappears.", gdzie: "Assumed level before the weather front.", zakres: "0–100%." },
      socMinPct: { ...SOC_MIN_EN, gdzie: "BMS/inverter settings (low voltage/SoC cut-off) — e.g. 10%." },
      sprawnoscFalownikaPct: SPRAWNOSC_EN,
      zuzycieDoboweKwh: { nazwa: "Daily consumption in frost [kWh/day]", cel: "Energy needed on the coldest days, including heating.", gdzie: "Module 2 and 6 balance.", zakres: TWOJ_EN },
      dniScenariusza: { nazwa: "Days without sun", cel: "Length of the tested scenario.", gdzie: "Your decision — the source's extreme scenario: 10–14 days, down to −25 °C.", zakres: TWOJ_EN },
      agregatKwhDoba: { nazwa: "Generator energy [kWh/day] (optional)", cel: "Reduces the daily deficit.", gdzie: "Generator power × running hours per day (× charging efficiency).", zakres: "Empty = no generator." },
    },
  },
  "elektronika-w-mrozie": {
    migawka: {
      oCoChodzi: "Which devices will stop working correctly at the lowest temperature at the installation site.",
      jakDziala: "For each device: is the site's lowest temperature ≥ the minimum operating temperature. BMS and converter/inverter are critical (no start = no power); the others — a warning.",
      poCo: "You know what to move somewhere warm, heat, or replace with a frost-proof version.",
      fizyka: "T_min,site ≥ T_min,operating.",
    },
    pola: {
      temp: T_MIEJSCA_EN,
      nazwa: NAZWA_EN,
      typ: { nazwa: "Device type", cel: "Decides whether failure to work is a hard stop or a warning.", gdzie: "Choose from the list.", zakres: "BMS, display, sensor, converter, controller, other." },
      tempMin: T_MIN_PRACY_EN,
    },
  },
  "grzalki-dachowe": {
    migawka: {
      oCoChodzi: "Heating cables against ice dams in gutters and roof valleys can draw more than a heat pump.",
      jakDziala: "Power = cable length × power per metre; daily energy = power × running hours ÷ 1000. Optionally a comparison with the heat pump and the inverter's free power headroom.",
      poCo: "You know whether the inverter and battery can handle gutter heating on a frosty night.",
      fizyka: "P = L · p_m; E = P · t / 1000.",
    },
    pola: {
      dlugosc: { nazwa: "Total heating cable length [m]", cel: "Total power is calculated from it.", gdzie: "Gutters, downpipes and roof valleys — where the cable actually lies.", zakres: TWOJ_EN },
      mocNaMetr: { nazwa: "Cable power per metre [W/m]", cel: "Specific cable power.", gdzie: "Cable datasheet.", zakres: TWOJ_EN },
      czas: { nazwa: "Running time per day [h]", cel: "How many hours the cables heat.", gdzie: "Controller / thermostat setting.", zakres: "0–24 h." },
      mocPompy: { nazwa: "Heat pump electrical power [W] (optional)", cel: "For comparison — heaters can draw more than the pump.", gdzie: "Heat pump datasheet.", zakres: "Empty = no comparison." },
      zapasFalownika: { nazwa: "Free inverter power headroom [W] (optional)", cel: "Checks whether the inverter can carry the heaters.", gdzie: "Inverter power minus loads running at the same time.", zakres: "Empty = not checked." },
    },
  },
  "obciazenie-dachu-sniegiem": {
    migawka: {
      oCoChodzi: "How much snow the roof must carry according to the standard and how much what lies on it now weighs.",
      jakDziala: "Standard load = roof shape coefficient × exposure coefficient × thermal coefficient × ground snow load for the zone and altitude (PN-EN 1991-1-3). Current weight = snow unit weight × depth. Both are compared with the roof capacity; warning from {prog}% of capacity.",
      poCo: "You know when to clear a roof with panels before it gets dangerous.",
      fizyka: "s = μ₁ · C_e · C_t · s_k; q = γ · h.",
    },
    pola: {
      strefa: { nazwa: "Snow load zone", cel: "Determines the ground snow load s_k.", gdzie: "Zone map in PN-EN 1991-1-3, National Annex NB.1. Zone 2 — most of central Poland; 4 — Western Pomerania and part of Greater Poland/Kuyavia; 5 — Tatra area.", zakres: "Zones 1–5." },
      wysokosc: { nazwa: "Altitude above sea level [m]", cel: "In some zones s_k grows with altitude.", gdzie: "Map / GPS / Module 1.", zakres: TWOJ_EN },
      kat: { nazwa: "Roof pitch [°]", cel: "Determines the shape coefficient μ₁.", gdzie: "Building design or measurement.", zakres: "0–90°. 0° = flat roof." },
      otoczenie: { nazwa: "Building surroundings", cel: "Exposure coefficient C_e — wind blows snow off or drifts it on.", gdzie: "Windswept: flat, open on all sides. Sheltered: building much lower than the terrain, trees or buildings around.", zakres: "Windswept / normal / sheltered." },
      nosnosc: { nazwa: "Roof snow capacity [kN/m²]", cel: "Both loads are compared with it.", gdzie: "Building design or structural engineer (characteristic value). 1 kN/m² ≈ 102 kg/m².", zakres: TWOJ_EN },
      grubosc: { nazwa: "Snow depth on the roof now [cm] (optional)", cel: "To assess the current snow weight.", gdzie: "Measure with a pole / from the ground.", zakres: "Empty = standard load only." },
      rodzajSniegu: { nazwa: "Snow type", cel: "Snow unit weight depends on its state — wet snow weighs several times more than fresh.", gdzie: "Assess visually.", zakres: "Fresh / settled / old / wet." },
    },
  },
  "pompy-zawory-w-mrozie": {
    migawka: {
      oCoChodzi: "Which pumps, valves and actuators may seize at the lowest temperature at the installation site.",
      jakDziala: "For each element: is the site's lowest temperature ≥ the minimum operating temperature from the datasheet.",
      poCo: "You know what to insulate, heat or move before the water stops.",
      fizyka: "T_min,site ≥ T_min,operating.",
    },
    pola: {
      temp: T_MIEJSCA_EN,
      nazwa: NAZWA_EN,
      typ: { nazwa: "Element type", cel: "Fitting category.", gdzie: "Choose from the list.", zakres: "Pump, valve, actuator, other." },
      tempMin: T_MIN_PRACY_EN,
    },
  },
  "pre-heat": {
    migawka: {
      oCoChodzi: "Store heat before the frost arrives — overheat the house and water heater on a sunny day before the front.",
      jakDziala: "Heat in the building = heat capacity × temperature rise; heat in the water heater = litres × ΔT × {kwhNaLK}; electrical energy = sum ÷ COP; time buffer = building heat ÷ losses.",
      poCo: "You know how many hours of frost you “buy” with PV surplus and whether the surplus is enough.",
      fizyka: "Q_house = C · ΔT; Q_DHW = V · ΔT_DHW · {kwhNaLK}; E_el = (Q_house + Q_DHW) / COP; t = Q_house / P_loss.",
    },
    pola: {
      pojemnoscCieplnaKwhK: { nazwa: "Building heat capacity [kWh/K]", cel: "How much heat the building stores per 1 K.", gdzie: "Module 6 “Building heat capacity”.", zakres: TWOJ_EN },
      podniesienieTempDomuK: { nazwa: "Indoor temperature rise [K]", cel: "Overheating range.", gdzie: "E.g. from 20 °C to 23 °C = 3 K.", zakres: TWOJ_EN },
      stratyCieplaKw: { nazwa: "Heat loss in the coming frost [kW]", cel: "How fast the building releases the stored heat.", gdzie: "Module 6 “Building heat loss”.", zakres: TWOJ_EN },
      pojemnoscBojleraL: { nazwa: "Water heater capacity [l] (optional)", cel: "An extra heat store in hot water.", gdzie: "Water heater rating plate.", zakres: "Empty = no water heater." },
      podniesienieTempBojleraK: { nazwa: "Water heater temperature rise [K]", cel: "Hot water overheating range.", gdzie: "E.g. from 50 °C to 70 °C = 20 K.", zakres: TWOJ_EN },
      cop: { nazwa: "Heating COP", cel: "How much heat 1 kWh of electricity gives.", gdzie: "Heat pump — from the datasheet; electric heater = 1.", zakres: TWOJ_EN },
      nadwyzkaPvKwh: { nazwa: "PV surplus on the day before the frost [kWh] (optional)", cel: "Checks whether overheating fits in the surplus.", gdzie: "Production forecast minus consumption.", zakres: "Empty = not checked." },
      zrodloEnergii: { nazwa: "Where does the overheating energy come from?", cel: "Heating at night from the battery eats the frost reserve — the app warns about it.", gdzie: "Your strategy.", zakres: "Daytime PV surplus / generator / battery at night." },
    },
  },
  "procedura-black-start": {
    migawka: {
      oCoChodzi: "Starting the system after a complete discharge — you need to know exactly what to do and in which order.",
      jakDziala: "A list of steps in the required order: generator → charger/MPPT → wake the BMS → minimum charge → inverter and gradual switching-on of critical loads.",
      poCo: "You will not damage the cells or the inverter under stress, in the dark and in frost.",
    },
    pola: {},
  },
  "ryzyko-zamarzniecia": {
    migawka: {
      oCoChodzi: "Whether cables, pipes and earth electrodes lie below the frost line, and how to thaw a pipe safely.",
      jakDziala: "For each installation: laying depth ≥ frost depth; a water pipe requires an extra {zapas} cm margin.",
      poCo: "You know which installation will freeze before it happens.",
      fizyka: "h_laid ≥ h_f (water pipe: h_f + {zapas} cm).",
    },
    pola: {
      glebokoscPrzemarzania: { nazwa: "Ground frost depth [cm]", cel: "The limit below which the ground does not freeze.", gdzie: "Frost depth zone map for the location or the building design.", zakres: TWOJ_EN },
      nazwa: NAZWA_EN,
      typ: { nazwa: "Installation type", cel: "A water pipe needs a larger margin than a cable or earth electrode.", gdzie: "Choose from the list.", zakres: "Cable, water pipe, earth electrode, other." },
      glebokosc: { nazwa: "Laying depth [cm]", cel: "At what depth the installation lies.", gdzie: "As-built documentation or measurement.", zakres: TWOJ_EN },
      rozmrazanie: { nazwa: "How will you thaw a frozen pipe?", cel: "Open flame near pipes is a fire and damage risk — the app warns about it.", gdzie: "Your emergency plan.", zakres: "Not applicable / heating cable / open flame." },
    },
  },
  "strategia-zamarzanie": {
    migawka: {
      oCoChodzi: "When energy is short you must choose what to sacrifice — heating and water matter more than the dishwasher.",
      jakDziala: "Comfort (3) is disconnected immediately, important (2) at SoC below {prog}%, critical (1) never. Stage A: critical + important down to max({prog}%, SoC_min); stage B: critical only down to SoC_min. Energy = C × η × ΔSoC.",
      poCo: "You know how many hours the most important loads will last.",
      fizyka: "t_A = C·η·(SoC₀ − max({prog}%, SoC_min)) / (P₁ + P₂); t_B = C·η·(min(SoC₀, {prog}%) − SoC_min) / P₁.",
    },
    pola: {
      pojemnoscKwh: { nazwa: "Battery capacity [kWh]", cel: "Energy stored in the battery.", gdzie: "Battery datasheet.", zakres: TWOJ_EN },
      socPct: { nazwa: "Current SoC [%]", cel: "Starting point of the strategy.", gdzie: "BMS/inverter display.", zakres: "0–100%." },
      socMinPct: { ...SOC_MIN_EN, nazwa: "System shutdown SoC [%]" },
      sprawnoscFalownikaPct: SPRAWNOSC_EN,
      nazwa: NAZWA_EN,
      moc: { nazwa: "Load power [W]", cel: "Power of this load during frost.", gdzie: "Rating plate or measurement.", zakres: TWOJ_EN },
      priorytet: { nazwa: "Priority", cel: "Disconnection order as SoC falls.", gdzie: "Your decision.", zakres: "1 — critical (never), 2 — important (at SoC < {prog}%), 3 — comfort (immediately)." },
    },
  },
  "sztywnienie-izolacji": {
    migawka: {
      oCoChodzi: "Whether cable insulation, sheaths and connectors will withstand the lowest temperature at the installation site.",
      jakDziala: "For each material: is the site temperature ≥ its limit. PVC stiffens and cracks below {pvc} °C, XLPE withstands down to {xlpe} °C; for rubber and aluminium the source gives no number — only a descriptive warning.",
      poCo: "You know which cables and connectors to replace before they crack when moved in frost.",
      fizyka: "T_min,site ≥ T_min,material.",
    },
    pola: {
      temp: { ...T_MIEJSCA_EN, gdzie: "For outdoor cables and buried connectors — the coldest night at the location, not the winter average." },
    },
  },
  "wind-chill": {
    migawka: {
      oCoChodzi: "Wind carries heat away from the house even when the thermometer does not show such a low temperature.",
      jakDziala: "Wind chill from the NWS/Environment Canada (2001) formula. The formula applies for temperature ≤ {maxT} °C and wind ≥ {minV} km/h.",
      poCo: "Shows that heat loss on a windy night is greater than the thermometer alone suggests.",
      fizyka: "WC = 13.12 + 0.6215·T − 11.37·V^0.16 + 0.3965·T·V^0.16.",
    },
    pola: {
      temp: { nazwa: "Air temperature [°C]", cel: "Thermometer temperature.", gdzie: "Weather forecast or local station.", zakres: "The formula applies up to {maxT} °C." },
      wiatr: { nazwa: "Wind speed [km/h]", cel: "The stronger the wind, the lower the felt temperature.", gdzie: "At approx. 10 m height — weather forecast or local station.", zakres: "The formula applies from {minV} km/h." },
    },
  },
}

const TWOJ_RU = "Ваша установка — приложение не подставляет типовое значение за вас."
const T_MIEJSCA_RU = {
  nazwa: "Минимальная температура в месте установки [°C]",
  cel: "С ней сравнивается минимальная рабочая температура каждой позиции.",
  gdzie: "Самая холодная ночь в этом месте (гараж, уличный шкаф, колодец) — не средняя зимняя. Лучше всего по термометру min/max.",
  zakres: TWOJ_RU,
}
const NAZWA_RU = { nazwa: "Название", cel: "Только описание позиции — на результат не влияет.", gdzie: "Любое.", zakres: "Текст." }
const T_MIN_PRACY_RU = {
  nazwa: "Минимальная рабочая температура [°C]",
  cel: "Самая низкая температура, при которой производитель гарантирует корректную работу.",
  gdzie: "Техническая документация («operating temperature») — нижняя граница.",
  zakres: "Пусто = нет данных, позиция не оценивается.",
}
const SPRAWNOSC_RU = {
  nazwa: "КПД инвертора [%]",
  cel: "Часть энергии батареи, доходящая до потребителей.",
  gdzie: "Техническая документация инвертора.",
  zakres: "0–100%. " + TWOJ_RU,
}
const SOC_MIN_RU = {
  nazwa: "Критический минимум SoC [%]",
  cel: "Уровень, при котором BMS или инвертор отключит питание — ниже энергии уже нет.",
  gdzie: "Настройки BMS/инвертора (отсечка по низкому напряжению/SoC).",
  zakres: "0–100%. " + TWOJ_RU,
}

export const ru: Tlumaczenie<typeof pl> = {
  "agregat-w-mrozie": {
    migawka: {
      oCoChodzi: "Холодный пуск, долгая работа и долгий простой — сколько топлива, замен масла и перерывов стоит генератор в зимнем сценарии.",
      jakDziala: "Топливо = время работы × расход; замены масла = время ÷ интервал; перерывы следуют из лимита непрерывной работы производителя. Дополнительно — оценка риска пуска для топлива и температуры и для простоя ≥ {postoj} дн. на морозе.",
      poCo: "Вы знаете, сколько топлива и масла запасти до зимы и заведётся ли генератор вообще.",
      fizyka: "V = t · q; n_масло = ⌊t / t_масло⌋; n_перерывов = ⌈t / t_непр⌉ − 1.",
    },
    pola: {
      paliwo: { nazwa: "Топливо", cel: "От вида топлива зависит риск пуска на морозе.", gdzie: "Чем вы реально заправляетесь.", zakres: "Обычное дизтопливо: риск от +{ryzyko} °C, высокий ниже +{wysokie} °C; от {rozruch} °C любому дизелю нужны заряженный аккумулятор и исправные свечи накала." },
      temp: { nazwa: "Минимальная температура у генератора [°C]", cel: "Температура генератора и топлива при пуске.", gdzie: "Там, где стоят генератор и бак — улица, гараж, навес, контейнер — самая холодная ночь.", zakres: TWOJ_RU },
      czasPracy: { nazwa: "Общее время работы [ч]", cel: "Сколько часов генератор должен работать в сценарии.", gdzie: "Напр. с экрана «Генератор» (Модуль 2) или «Блэкаут».", zakres: TWOJ_RU },
      maxCiagla: { nazwa: "Макс. непрерывная работа по производителю [ч]", cel: "Через сколько часов генератору нужен перерыв.", gdzie: "Инструкция — некоторым генераторам нужен перерыв каждые 8–12 ч.", zakres: "Пусто = без лимита." },
      przerwa: { nazwa: "Требуемый перерыв [ч]", cel: "Длительность перерыва — удлиняет календарное время сценария.", gdzie: "Инструкция генератора.", zakres: TWOJ_RU },
      zuzycie: { nazwa: "Расход топлива [л/ч]", cel: "По нему рассчитывается запас топлива.", gdzie: "Техническая документация при типовой нагрузке.", zakres: TWOJ_RU },
      olej: { nazwa: "Замена масла каждые [ч]", cel: "Число замен масла за сценарий.", gdzie: "Инструкция генератора (сервисный интервал).", zakres: "Пусто = замены не считаются." },
      dniPostoju: { nazwa: "Дней простоя без запуска", cel: "Долгий простой на морозе повышает риск, что генератор не заведётся.", gdzie: "Сколько дней генератор стоит между запусками.", zakres: "Риск от {postoj} дн. на морозе." },
    },
  },
  "analiza-spof": {
    migawka: {
      oCoChodzi: "Единая точка отказа (SPOF) — элемент, отказ которого останавливает всю систему.",
      jakDziala: "Вы вводите компоненты и отмечаете, у каких есть резервирование (запасной экземпляр или обход). Каждый без резерва попадает в список SPOF.",
      poCo: "Вы найдёте слабое звено раньше, чем его найдёт зима, — и знаете, что задублировать или держать на полке.",
      fizyka: "SPOF = { k : нет резерва(k) }.",
    },
    pola: {
      nazwa: NAZWA_RU,
      typ: { nazwa: "Тип компонента", cel: "Категория элемента системы.", gdzie: "Выберите из списка.", zakres: "BMS, инвертор, главный предохранитель, MPPT, тепловой насос, насос, датчик, другое." },
      redundancja: { nazwa: "Резервирование", cel: "Есть ли обход при отказе этого элемента (второй экземпляр, байпас, запчасть).", gdzie: "Ваша установка и склад запчастей.", zakres: "Отмечено = не SPOF." },
    },
  },
  "awaria-stringa-zima": {
    migawka: {
      oCoChodzi: "Одна больная строка, мелкая проблема летом, в январе может означать, что дом не переживёт ночь без генератора.",
      jakDziala: "Дефицит = потребность − (общая выработка − выработка строки). Если указать батарею — сколько дней она покроет этот дефицит.",
      poCo: "Вы знаете, отказ одной строки — это неудобство или авария.",
      fizyka: "D = E − (P_общ − P_стр); d = C · η · DoD / D.",
    },
    pola: {
      produkcjaCalkowitaKwhDoba: { nazwa: "Выработка установки в худший месяц [кВт·ч/сут]", cel: "Исходная точка до отказа.", gdzie: "Из Модуля 3 (месячная выработка).", zakres: TWOJ_RU },
      produkcjaStringuKwhDoba: { nazwa: "Выработка отказавшей строки [кВт·ч/сут]", cel: "Сколько выработки пропадает.", gdzie: "Доля строки в выработке (напр. пропорционально числу панелей).", zakres: TWOJ_RU },
      zapotrzebowanieKwhDoba: { nazwa: "Потребность в этом месяце [кВт·ч/сут]", cel: "С ней сравнивается выработка после отказа.", gdzie: "Баланс Модуля 2.", zakres: TWOJ_RU },
      pojemnoscBateriiKwh: { nazwa: "Ёмкость батареи [кВт·ч] (необязательно)", cel: "Позволяет посчитать, сколько дней батарея покроет дефицит.", gdzie: "Документация батареи.", zakres: "Пусто = дни не считаются." },
      dodPct: { nazwa: "Полезная глубина разряда [%]", cel: "Часть ёмкости, которую можно использовать.", gdzie: "Документация батареи или настройки BMS.", zakres: "0–100%." },
      sprawnoscFalownikaPct: SPRAWNOSC_RU,
    },
  },
  "bez-rekuperacji": {
    migawka: {
      oCoChodzi: "Когда рекуператор замерзает, дом теряет рекуперацию тепла вентиляционного воздуха — или вентиляцию приходится выключить.",
      jakDziala: "Доп. потери = расход воздуха × КПД рекуперации × ρ·c_p × (T_внутр − T_нар) ÷ 3600. Дополнительно — мощность преднагревателя, который подогреет воздух до безопасной температуры.",
      poCo: "Вы знаете, сколько кВт и кВт·ч в сутки стоит потеря рекуперации и какой мощности нужен преднагреватель.",
      fizyka: "ΔP = V̇ · η · ρ · c_p · (T_в − T_н) / 3600; P_нагр = V̇ · ρ · c_p · (T_нагр − T_н) / 3600.",
    },
    pola: {
      strumienM3H: { nazwa: "Производительность установки [м³/ч]", cel: "Сколько воздуха обменивает вентиляция.", gdzie: "Модуль 6 «Вентиляция с рекуперацией» или настройка установки.", zakres: TWOJ_RU },
      sprawnoscOdzyskuPct: { nazwa: "КПД рекуперации [%]", cel: "Часть тепла, возвращаемая теплообменником, — её вы теряете при замерзании.", gdzie: "Документация рекуператора.", zakres: "0–100%." },
      tempWewnC: { nazwa: "Температура внутри [°C]", cel: "Температура вытяжного воздуха.", gdzie: "Ваша уставка.", zakres: TWOJ_RU },
      tempZewnC: { nazwa: "Минимальная температура снаружи [°C]", cel: "Температура приточного воздуха.", gdzie: "Самая холодная ночь в местности.", zakres: TWOJ_RU },
      tempZamarzaniaWymiennikaC: { nazwa: "Граница замерзания теплообменника [°C] (необязательно)", cel: "Ниже этой температуры теплообменник обмерзает.", gdzie: "Инструкция рекуператора.", zakres: "Пусто = без оценки." },
      tempZaNagrzewnicaC: { nazwa: "Температура после преднагревателя [°C] (необязательно)", cel: "Для расчёта мощности преднагревателя.", gdzie: "Инструкция рекуператора (требуемая температура на входе теплообменника).", zakres: "Пусто = преднагреватель не считается." },
    },
  },
  blackout: {
    migawka: {
      oCoChodzi: "Тест худшего кошмара: много дней без солнца на морозе. Если система переживёт это, она переживёт почти всё.",
      jakDziala: "Дни выживания = доступная энергия батареи (C × η × (SoC₀ − SoC_min)) ÷ (суточное потребление − энергия генератора). Если батареи не хватает на весь сценарий — сколько ёмкости недостаёт.",
      poCo: "Жёсткий ответ: выживете или нет и что нужно добавить.",
      fizyka: "d = C · η · (SoC₀ − SoC_min) / (E − E_ген); ΔC = (N · (E − E_ген) − E_дост) / (η · (SoC₀ − SoC_min)).",
    },
    pola: {
      pojemnoscKwh: { nazwa: "Ёмкость батареи (номинальная) [кВт·ч]", cel: "Энергия в накопителе.", gdzie: "Документация батареи.", zakres: TWOJ_RU },
      socStartPct: { nazwa: "SoC в начале [%]", cel: "Уровень заряда в момент, когда пропадает солнце.", gdzie: "Предполагаемый уровень перед атмосферным фронтом.", zakres: "0–100%." },
      socMinPct: { ...SOC_MIN_RU, gdzie: "Настройки BMS/инвертора (отсечка по низкому напряжению/SoC) — напр. 10%." },
      sprawnoscFalownikaPct: SPRAWNOSC_RU,
      zuzycieDoboweKwh: { nazwa: "Суточное потребление в мороз [кВт·ч/сут]", cel: "Энергия, нужная в самые холодные дни, с отоплением.", gdzie: "Баланс Модулей 2 и 6.", zakres: TWOJ_RU },
      dniScenariusza: { nazwa: "Дней без солнца", cel: "Длительность проверяемого сценария.", gdzie: "Ваше решение — крайний сценарий источника: 10–14 дней, до −25 °C.", zakres: TWOJ_RU },
      agregatKwhDoba: { nazwa: "Энергия генератора [кВт·ч/сут] (необязательно)", cel: "Уменьшает суточный дефицит.", gdzie: "Мощность генератора × часы работы в сутки (× КПД зарядки).", zakres: "Пусто = без генератора." },
    },
  },
  "elektronika-w-mrozie": {
    migawka: {
      oCoChodzi: "Какие устройства перестанут корректно работать при минимальной температуре в месте установки.",
      jakDziala: "Для каждого устройства: минимальная температура места ≥ минимальной рабочей температуры. BMS и преобразователь/инвертор критичны (нет пуска = нет питания); остальные — предупреждение.",
      poCo: "Вы знаете, что перенести в тепло, подогреть или заменить морозостойкой версией.",
      fizyka: "T_min,места ≥ T_min,работы.",
    },
    pola: {
      temp: T_MIEJSCA_RU,
      nazwa: NAZWA_RU,
      typ: { nazwa: "Тип устройства", cel: "Определяет, отказ — это жёсткая остановка или предупреждение.", gdzie: "Выберите из списка.", zakres: "BMS, дисплей, датчик, преобразователь, контроллер, другое." },
      tempMin: T_MIN_PRACY_RU,
    },
  },
  "grzalki-dachowe": {
    migawka: {
      oCoChodzi: "Греющие кабели против ледяных пробок в желобах и ендовах крыши могут потреблять больше теплового насоса.",
      jakDziala: "Мощность = длина кабеля × мощность на метр; суточная энергия = мощность × часы работы ÷ 1000. Дополнительно — сравнение с тепловым насосом и свободным запасом мощности инвертора.",
      poCo: "Вы знаете, потянут ли инвертор и батарея обогрев желобов в морозную ночь.",
      fizyka: "P = L · p_м; E = P · t / 1000.",
    },
    pola: {
      dlugosc: { nazwa: "Общая длина греющего кабеля [м]", cel: "По ней считается общая мощность.", gdzie: "Желоба, водосточные трубы и ендовы — там, где кабель реально лежит.", zakres: TWOJ_RU },
      mocNaMetr: { nazwa: "Мощность кабеля на метр [Вт/м]", cel: "Удельная мощность кабеля.", gdzie: "Документация кабеля.", zakres: TWOJ_RU },
      czas: { nazwa: "Время работы в сутки [ч]", cel: "Сколько часов греют кабели.", gdzie: "Настройка контроллера / термостата.", zakres: "0–24 ч." },
      mocPompy: { nazwa: "Электрическая мощность теплового насоса [Вт] (необязательно)", cel: "Для сравнения — кабели могут потреблять больше насоса.", gdzie: "Документация теплового насоса.", zakres: "Пусто = без сравнения." },
      zapasFalownika: { nazwa: "Свободный запас мощности инвертора [Вт] (необязательно)", cel: "Проверяет, потянет ли инвертор кабели.", gdzie: "Мощность инвертора минус потребители, работающие одновременно.", zakres: "Пусто = без проверки." },
    },
  },
  "obciazenie-dachu-sniegiem": {
    migawka: {
      oCoChodzi: "Сколько снега должна выдержать крыша по норме и сколько весит то, что лежит на ней сейчас.",
      jakDziala: "Нормативная нагрузка = коэффициент формы крыши × коэффициент открытости × термический коэффициент × снеговая нагрузка на грунт для зоны и высоты (PN-EN 1991-1-3). Текущий вес = объёмный вес снега × толщина. Обе сравниваются с несущей способностью крыши; предупреждение от {prog}% несущей способности.",
      poCo: "Вы знаете, когда чистить крышу с панелями, пока не стало опасно.",
      fizyka: "s = μ₁ · C_e · C_t · s_k; q = γ · h.",
    },
    pola: {
      strefa: { nazwa: "Снеговая зона", cel: "Определяет снеговую нагрузку на грунт s_k.", gdzie: "Карта зон PN-EN 1991-1-3, Национальное приложение NB.1. Зона 2 — большая часть центральной Польши; 4 — Западное Поморье и часть Великопольши/Куявии; 5 — район Татр.", zakres: "Зоны 1–5." },
      wysokosc: { nazwa: "Высота над уровнем моря [м]", cel: "В части зон s_k растёт с высотой.", gdzie: "Карта / GPS / Модуль 1.", zakres: TWOJ_RU },
      kat: { nazwa: "Уклон крыши [°]", cel: "Определяет коэффициент формы μ₁.", gdzie: "Проект здания или замер.", zakres: "0–90°. 0° = плоская крыша." },
      otoczenie: { nazwa: "Окружение здания", cel: "Коэффициент открытости C_e — ветер сдувает или наметает снег.", gdzie: "Открытое: ровно, открыто со всех сторон. Защищённое: здание намного ниже рельефа, вокруг деревья или здания.", zakres: "Открытое / обычное / защищённое." },
      nosnosc: { nazwa: "Несущая способность крыши по снегу [кН/м²]", cel: "С ней сравниваются обе нагрузки.", gdzie: "Проект здания или конструктор (нормативное значение). 1 кН/м² ≈ 102 кг/м².", zakres: TWOJ_RU },
      grubosc: { nazwa: "Толщина снега на крыше сейчас [см] (необязательно)", cel: "Для оценки текущего веса снега.", gdzie: "Замер рейкой / с земли.", zakres: "Пусто = только нормативная нагрузка." },
      rodzajSniegu: { nazwa: "Вид снега", cel: "Объёмный вес снега зависит от его состояния — мокрый весит в разы больше свежего.", gdzie: "Оцените визуально.", zakres: "Свежий / слежавшийся / старый / мокрый." },
    },
  },
  "pompy-zawory-w-mrozie": {
    migawka: {
      oCoChodzi: "Какие насосы, клапаны и приводы могут заклинить при минимальной температуре в месте установки.",
      jakDziala: "Для каждого элемента: минимальная температура места ≥ минимальной рабочей температуры по документации.",
      poCo: "Вы знаете, что утеплить, подогреть или перенести, пока вода не встала.",
      fizyka: "T_min,места ≥ T_min,работы.",
    },
    pola: {
      temp: T_MIEJSCA_RU,
      nazwa: NAZWA_RU,
      typ: { nazwa: "Тип элемента", cel: "Категория арматуры.", gdzie: "Выберите из списка.", zakres: "Насос, клапан, привод, другое." },
      tempMin: T_MIN_PRACY_RU,
    },
  },
  "pre-heat": {
    migawka: {
      oCoChodzi: "Запасайте тепло до мороза — перегрейте дом и бойлер в солнечный день перед фронтом.",
      jakDziala: "Тепло в здании = теплоёмкость × подъём температуры; тепло в бойлере = литры × ΔT × {kwhNaLK}; электроэнергия = сумма ÷ COP; запас по времени = тепло здания ÷ теплопотери.",
      poCo: "Вы знаете, сколько часов мороза «покупаете» избытком PV и хватит ли этого избытка.",
      fizyka: "Q_дом = C · ΔT; Q_ГВС = V · ΔT_ГВС · {kwhNaLK}; E_эл = (Q_дом + Q_ГВС) / COP; t = Q_дом / P_потерь.",
    },
    pola: {
      pojemnoscCieplnaKwhK: { nazwa: "Теплоёмкость здания [кВт·ч/К]", cel: "Сколько тепла здание запасает на 1 К.", gdzie: "Модуль 6 «Теплоёмкость здания».", zakres: TWOJ_RU },
      podniesienieTempDomuK: { nazwa: "На сколько поднять температуру в доме [К]", cel: "Диапазон перегрева.", gdzie: "Напр. с 20 °C до 23 °C = 3 К.", zakres: TWOJ_RU },
      stratyCieplaKw: { nazwa: "Теплопотери при надвигающемся морозе [кВт]", cel: "Как быстро здание отдаёт запасённое тепло.", gdzie: "Модуль 6 «Теплопотери здания».", zakres: TWOJ_RU },
      pojemnoscBojleraL: { nazwa: "Объём бойлера [л] (необязательно)", cel: "Дополнительный аккумулятор тепла в ГВС.", gdzie: "Табличка бойлера.", zakres: "Пусто = без бойлера." },
      podniesienieTempBojleraK: { nazwa: "На сколько подогреть бойлер [К]", cel: "Диапазон перегрева ГВС.", gdzie: "Напр. с 50 °C до 70 °C = 20 К.", zakres: TWOJ_RU },
      cop: { nazwa: "COP отопления", cel: "Сколько тепла даёт 1 кВт·ч электроэнергии.", gdzie: "Тепловой насос — из документации; электронагреватель = 1.", zakres: TWOJ_RU },
      nadwyzkaPvKwh: { nazwa: "Избыток PV в день перед морозом [кВт·ч] (необязательно)", cel: "Проверяет, укладывается ли перегрев в избыток.", gdzie: "Прогноз выработки минус потребление.", zakres: "Пусто = без проверки." },
      zrodloEnergii: { nazwa: "Откуда энергия на перегрев?", cel: "Нагрев ночью от батареи съедает резерв на мороз — приложение об этом предупреждает.", gdzie: "Ваша стратегия.", zakres: "Дневной избыток PV / генератор / батарея ночью." },
    },
  },
  "procedura-black-start": {
    migawka: {
      oCoChodzi: "Запуск системы после полного разряда — нужно точно знать, что и в каком порядке делать.",
      jakDziala: "Список шагов в обязательном порядке: генератор → зарядное/MPPT → пробуждение BMS → минимальный заряд → инвертор и постепенное включение критичных потребителей.",
      poCo: "Вы не повредите элементы батареи и инвертор в стрессе, в темноте и на морозе.",
    },
    pola: {},
  },
  "ryzyko-zamarzniecia": {
    migawka: {
      oCoChodzi: "Лежат ли кабели, трубы и заземлители ниже глубины промерзания и как безопасно отогреть трубу.",
      jakDziala: "Для каждой коммуникации: глубина укладки ≥ глубины промерзания; для водопроводной трубы нужен дополнительный запас {zapas} см.",
      poCo: "Вы знаете, какая коммуникация замёрзнет, раньше, чем это случится.",
      fizyka: "h_укладки ≥ h_пр (водопровод: h_пр + {zapas} см).",
    },
    pola: {
      glebokoscPrzemarzania: { nazwa: "Глубина промерзания грунта [см]", cel: "Граница, ниже которой грунт не промерзает.", gdzie: "Карта зон промерзания для местности или проект здания.", zakres: TWOJ_RU },
      nazwa: NAZWA_RU,
      typ: { nazwa: "Тип коммуникации", cel: "Водопроводной трубе нужен больший запас, чем кабелю или заземлителю.", gdzie: "Выберите из списка.", zakres: "Кабель, водопровод, заземлитель, другое." },
      glebokosc: { nazwa: "Глубина укладки [см]", cel: "На какой глубине лежит коммуникация.", gdzie: "Исполнительная документация или замер.", zakres: TWOJ_RU },
      rozmrazanie: { nazwa: "Как вы отогреете замёрзшую трубу?", cel: "Открытый огонь у труб — риск пожара и повреждения; приложение об этом предупреждает.", gdzie: "Ваш аварийный план.", zakres: "Не применимо / греющий кабель / открытый огонь." },
    },
  },
  "strategia-zamarzanie": {
    migawka: {
      oCoChodzi: "Когда энергии мало, нужно выбрать, чем пожертвовать — отопление и вода важнее посудомойки.",
      jakDziala: "Комфорт (3) отключается сразу, важные (2) — при SoC ниже {prog}%, критичные (1) — никогда. Этап A: критичные + важные до max({prog}%, SoC_min); этап B: только критичные до SoC_min. Энергия = C × η × ΔSoC.",
      poCo: "Вы знаете, сколько часов продержатся самые важные потребители.",
      fizyka: "t_A = C·η·(SoC₀ − max({prog}%, SoC_min)) / (P₁ + P₂); t_B = C·η·(min(SoC₀, {prog}%) − SoC_min) / P₁.",
    },
    pola: {
      pojemnoscKwh: { nazwa: "Ёмкость батареи [кВт·ч]", cel: "Энергия в накопителе.", gdzie: "Документация батареи.", zakres: TWOJ_RU },
      socPct: { nazwa: "Текущий SoC [%]", cel: "Исходная точка стратегии.", gdzie: "Дисплей BMS/инвертора.", zakres: "0–100%." },
      socMinPct: { ...SOC_MIN_RU, nazwa: "SoC отключения системы [%]" },
      sprawnoscFalownikaPct: SPRAWNOSC_RU,
      nazwa: NAZWA_RU,
      moc: { nazwa: "Мощность потребителя [Вт]", cel: "Мощность этого потребителя во время мороза.", gdzie: "Табличка или замер.", zakres: TWOJ_RU },
      priorytet: { nazwa: "Приоритет", cel: "Порядок отключения при падении SoC.", gdzie: "Ваше решение.", zakres: "1 — критичный (никогда), 2 — важный (при SoC < {prog}%), 3 — комфорт (сразу)." },
    },
  },
  "sztywnienie-izolacji": {
    migawka: {
      oCoChodzi: "Выдержат ли изоляция кабелей, оболочки и соединители минимальную температуру в месте установки.",
      jakDziala: "Для каждого материала: температура места ≥ его границы. ПВХ дубеет и трескается ниже {pvc} °C, XLPE выдерживает до {xlpe} °C; для резины и алюминия источник не даёт числа — только описательное предупреждение.",
      poCo: "Вы знаете, какие кабели и соединители заменить, пока они не треснули при движении на морозе.",
      fizyka: "T_min,места ≥ T_min,материала.",
    },
    pola: {
      temp: { ...T_MIEJSCA_RU, gdzie: "Для наружных кабелей и соединителей в земле — самая холодная ночь в местности, не средняя зимняя." },
    },
  },
  "wind-chill": {
    migawka: {
      oCoChodzi: "Ветер выдувает тепло из дома, даже когда термометр показывает не такую уж низкую температуру.",
      jakDziala: "Ощущаемая температура по формуле NWS/Environment Canada (2001). Формула действует при температуре ≤ {maxT} °C и ветре ≥ {minV} км/ч.",
      poCo: "Показывает, что теплопотери ветреной ночью больше, чем подсказывает один термометр.",
      fizyka: "WC = 13,12 + 0,6215·T − 11,37·V^0,16 + 0,3965·T·V^0,16.",
    },
    pola: {
      temp: { nazwa: "Температура воздуха [°C]", cel: "Температура по термометру.", gdzie: "Прогноз погоды или местная станция.", zakres: "Формула имеет смысл до {maxT} °C." },
      wiatr: { nazwa: "Скорость ветра [км/ч]", cel: "Чем сильнее ветер, тем ниже ощущаемая температура.", gdzie: "На высоте ок. 10 м — прогноз погоды или местная станция.", zakres: "Формула имеет смысл от {minV} км/ч." },
    },
  },
}
