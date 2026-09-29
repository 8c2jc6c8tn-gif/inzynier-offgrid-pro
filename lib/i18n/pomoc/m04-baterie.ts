/**
 * Help content — Module 4 (energy storage / batteries) and M14/F7 (business BESS, engine in baterie/).
 * Every number the engines keep as a constant enters the text through `{params}`.
 */
import type { Tlumaczenie } from "./typy"

const Z_KARTY = "zakres z karty katalogowej — aplikacja nie przyjmuje typowej wartości za Ciebie."
const Z_BMS = "Odczyt z BMS (aplikacja producenta, wyświetlacz albo monitoring)."
const TWOJA_CENA = "Twoja cena — aplikacja nie zgaduje cen."

export const pl = {
  "dobor-pojemnosci-baterii": {
    migawka: {
      oCoChodzi:
        "Bateria nigdy nie jest w 100% „użyteczna” — część pojemności to bufor, żeby nie skracać jej życia głębokim rozładowaniem. Ten ekran liczy, ile pojemności naprawdę kupić.",
      jakDziala:
        "Zapotrzebowanie dobowe × dni autonomii daje energię, którą bateria ma oddać. Aplikacja dzieli ją przez sprawność falownika (straty przy zamianie DC na AC) i przez DoD (dopuszczalną głębokość rozładowania) — wychodzi pojemność do zakupu.",
      poCo:
        "Kupiona „na styk” bateria rozładowywana do zera szybko traci pojemność. Właściwy bufor to dłuższe życie magazynu i system, który przetrwa pochmurne dni.",
      fizyka: "C = (E_dobowe × d_autonomii) / (η_falownika × DoD).",
    },
    pola: {
      zapotrzebowanie: {
        nazwa: "Zapotrzebowanie dobowe [kWh]",
        cel: "Ile energii zużywasz w ciągu doby — podstawa obliczenia.",
        gdzie: "Z bilansu obciążeń (Moduł 2) albo z licznika/rachunku: roczne zużycie ÷ 365 (zimą zwykle więcej).",
        zakres: "Twoje dane.",
      },
      dniAutonomii: {
        nazwa: "Dni autonomii [dni]",
        cel: "Ile dni bez słońca system ma przetrwać wyłącznie na baterii.",
        gdzie: "Twój wybór — Moduł 2, Ekran 7 pomaga go ustalić.",
        zakres: "Suwak w Module 2: 1 / 2 / 3 / 5 / 7 dni.",
      },
      sprawnosc: {
        nazwa: "Sprawność falownika [%]",
        cel: "Falownik traci część energii przy zamianie DC na AC — bateria musi to pokryć.",
        gdzie: "Z karty falownika („efficiency”).",
        zakres: "Sugerowany start: {sprawnosc}% — wpisz wartość ze swojej karty.",
      },
      dod: {
        nazwa: "DoD — głębokość rozładowania [%]",
        cel: "Jaką część pojemności wolno zużyć. Reszta to bufor chroniący żywotność.",
        gdzie: "Z karty katalogowej baterii (cykle przy danym DoD).",
        zakres: "Dla LiFePO4 typowo {dodMin}–{dodMax}%.",
      },
    },
  },
  "napiecie-systemowe": {
    migawka: {
      oCoChodzi:
        "Napięcie systemu (12, 24 czy 48 V) wybiera się na podstawie największego jednorazowego poboru mocy, dziennego zużycia i zastosowania — nie ceny BMS. Wyższe napięcie = mniejszy prąd przy tej samej mocy = cieńsze, tańsze i bezpieczniejsze kable.",
      jakDziala:
        "Etap A: kontekst (gdzie i co ważniejsze). Etap B: kreator odbiorników — z mocy i czasu pracy aplikacja liczy szczyt i sprawdza konflikt jednoczesności z falownikiem. Rekomendacja: powyżej {prog48} W — 48 V, poniżej {prog12} W — 12 V, pomiędzy — 24 V. Dalej porównanie przekrojów kabli (silnik z Modułu 5) i kosztorysy wariantów.",
      poCo:
        "Zmiana napięcia po zakupie sprzętu jest bardzo droga. Za niskie napięcie przy dużej mocy oznacza setki amperów, grube kable i ryzyko pożaru.",
      fizyka: "I = P / U. Przy 3000 W w 12 V płynie 250 A, w 48 V — około 63 A.",
    },
    pola: {
      obciazenie: {
        nazwa: "Obciążenie szczytowe [W] (opcjonalnie)",
        cel: "Największa moc pobierana naraz. Nadpisuje sumę z kreatora odbiorników.",
        gdzie: "Z bilansu obciążeń (Moduł 2) albo suma mocy urządzeń pracujących jednocześnie.",
        zakres: "Powyżej {prog48} W → 48 V, poniżej {prog12} W → 12 V.",
      },
      zastosowanie: {
        nazwa: "Zastosowanie systemu",
        cel: "Kamper, domek, dom całoroczny — kontekst wpływa na rekomendację (np. dostępność sprzętu 12 V w pojazdach).",
        gdzie: "Twój projekt.",
        zakres: "Opcje z listy.",
      },
      priorytet: {
        nazwa: "Co jest ważniejsze",
        cel: "Koszt, rozbudowa w przyszłości albo prostota — rozstrzyga przy granicznych przypadkach.",
        gdzie: "Twoja decyzja.",
        zakres: "Opcje z listy.",
      },
      ogrzewanie: {
        nazwa: "Szczytowa moc ogrzewania elektrycznego [W]",
        cel: "Grzałki i pompy ciepła to zwykle największy pobór — decydują o napięciu.",
        gdzie: "Z tabliczki urządzenia. Pomiń, jeśli rozpiszesz je w kreatorze odbiorników — nie licz tej samej mocy dwa razy.",
        zakres: Z_KARTY,
      },
      wierszOdbiornika: {
        nazwa: "Odbiornik: moc [W] i czas pracy jednorazowo",
        cel: "Moc i czas pracy każdego zaznaczonego urządzenia. Z nich aplikacja liczy szczyt i sprawdza, czy falownik udźwignie odbiorniki pracujące razem.",
        gdzie: "Moc z tabliczki urządzenia; czas pracy — ile minut albo godzin pracuje jednorazowo (np. czajnik 3 min, pralka 2 h).",
        zakres: Z_KARTY,
      },
      mocFalownika: {
        nazwa: "Planowana moc ciągła falownika [W] (opcjonalnie)",
        cel: "Do sprawdzenia konfliktu jednoczesności: czy falownik udźwignie odbiorniki pracujące naraz.",
        gdzie: "Z karty falownika (moc ciągła).",
        zakres: Z_KARTY,
      },
      dlugosc: {
        nazwa: "Długość trasy kabla (w jedną stronę) [m]",
        cel: "Do porównania przekrojów kabli dla wariantów 12/24/48 V.",
        gdzie: "Od baterii do falownika — po trasie prowadzenia.",
        zakres: "Twoja instalacja.",
      },
      temperatura: {
        nazwa: "Temperatura otoczenia kabla [°C]",
        cel: "Obniża dopuszczalny prąd kabla (PN-HD 60364-5-52).",
        gdzie: "Najwyższa spodziewana w miejscu prowadzenia.",
        zakres: "Twoje warunki.",
      },
      material: {
        nazwa: "Materiał przewodnika",
        cel: "Miedź albo aluminium — różna rezystywność.",
        gdzie: "Z opisu kabla.",
        zakres: "Cu albo Al.",
      },
      ulozenie: {
        nazwa: "Sposób ułożenia kabla",
        cel: "Wpływa na obciążalność (tabela normy).",
        gdzie: "Najgorszy odcinek trasy.",
        zakres: "Opcje z listy.",
      },
      wiazka: {
        nazwa: "Liczba kabli w wiązce",
        cel: "Kable w wiązce grzeją się nawzajem.",
        gdzie: "Policz obciążone przewody biegnące razem.",
        zakres: "Twoja instalacja.",
      },
      spadek: {
        nazwa: "Dopuszczalny spadek napięcia [%]",
        cel: "Warunek doboru przekroju dla każdego wariantu napięcia.",
        gdzie: "Domyślna wartość albo wymaganie producenta.",
        zakres: "Dla DC zwykle {spadekDc}%.",
      },
      pojemnoscBanku: {
        nazwa: "Docelowa pojemność energetyczna banku [kWh]",
        cel: "Do kosztorysu wariantów: ile ogniw potrzeba przy każdym napięciu.",
        gdzie: "Z ekranu „Dobór pojemności baterii”.",
        zakres: "Wynik z Ekranu 1.",
      },
      linie24v: {
        nazwa: "Liczba linii oświetlenia 24 V (przy systemie 48 V)",
        cel: "Każda linia 24 V w systemie 48 V wymaga przetwornicy DC-DC 48→24 V — dolicza się do kosztorysu.",
        gdzie: "Twój projekt oświetlenia.",
        zakres: "Twoja instalacja.",
      },
      cenaSkladnika: {
        nazwa: "Cena składnika wariantu [zł]",
        cel: "Cena ogniwa, falownika, przewodów, bezpiecznika albo przetwornicy do kosztorysu wariantów.",
        gdzie: "Z ofert sklepów.",
        zakres: TWOJA_CENA,
      },
    },
  },
  "symulacja-ladowania-rozladowania": {
    migawka: {
      oCoChodzi:
        "Czy bateria i produkcja PV są zsynchronizowane z Twoim zużyciem — czy zdąży naładować się w ciągu dnia i czy przetrwa do rana.",
      jakDziala:
        "Aplikacja liczy czas pełnego naładowania z mocy ładowania PV (netto, po zużyciu w dzień) i porównuje z długością okna słonecznego. Potem liczy, jak spadnie SoC w nocy przy średniej mocy rozładowania, i ostrzega, gdy zejdzie poniżej progu.",
      poCo: "Bateria, która nie ładuje się do pełna w dzień, z każdym dniem schodzi niżej — i pada w trzecią noc, nie w pierwszą.",
      fizyka: "t_pełna = C × (100 − SoC_start)/100 ÷ P_ładowania; SoC_rano = SoC_wieczór − P_noc × t_noc ÷ C.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pojemność użyteczna baterii [kWh]",
        cel: "Ile energii mieści bateria po odjęciu bufora.",
        gdzie: "Z ekranu „Dobór pojemności baterii” albo karty (usable capacity).",
        zakres: Z_KARTY,
      },
      socStart: {
        nazwa: "SoC na początku dnia [%]",
        cel: "Stan naładowania rano, przed słońcem.",
        gdzie: Z_BMS,
        zakres: "0–100%.",
      },
      mocLadowania: {
        nazwa: "Średnia moc ładowania z PV [kW]",
        cel: "Netto — po odjęciu zużycia w dzień. 0 = dzień bez słońca.",
        gdzie: "Z monitoringu falownika albo produkcja PV (Moduł 3) minus zużycie dzienne.",
        zakres: "Twoja instalacja.",
      },
      oknoLadowania: {
        nazwa: "Długość okna ładowania [godz.]",
        cel: "Ile godzin w dzień panele realnie ładują baterię.",
        gdzie: "Z długości dnia w Twojej lokalizacji (Moduł 1) — zimą znacznie krócej.",
        zakres: "0–24 h.",
      },
      mocNoc: {
        nazwa: "Średnia moc rozładowania w nocy [kW]",
        cel: "Ile pobierają odbiorniki nocą — z tego liczony jest spadek SoC do rana.",
        gdzie: "Z profilu obciążenia nocnego (Moduł 2) albo monitoringu.",
        zakres: "Twoje dane.",
      },
      progSoc: {
        nazwa: "Próg ostrzegawczy SoC [%]",
        cel: "Poniżej tej wartości aplikacja ostrzega, że bateria schodzi za nisko.",
        gdzie: "Twój wybór, dopasowany do DoD baterii.",
        zakres: "Sugerowany start: {progSoc}%.",
      },
    },
  },
  "modul-ev": {
    migawka: {
      oCoChodzi:
        "Samochód elektryczny to dodatkowy odbiornik o dużym apetycie — trzeba go policzyć osobno, bo potrafi zjeść całą nadwyżkę produkcji.",
      jakDziala:
        "Aplikacja porównuje dobowe zapotrzebowanie EV z nadwyżką PV latem i zimą: brak = zapotrzebowanie EV − nadwyżka (nie mniej niż 0). Pokazuje, ile energii trzeba wziąć z innego źródła w każdym sezonie.",
      poCo: "Latem PV zwykle wystarczy na auto, zimą nie. Bez tego rachunku łatwo rozładować magazyn domu na ładowanie samochodu.",
      fizyka: "brak_sezon = max(0, E_EV − nadwyżka_PV,sezon).",
    },
    pola: {
      zapotrzebowanieEv: {
        nazwa: "Dobowe zapotrzebowanie na ładowanie EV [kWh/dobę]",
        cel: "Ile energii auto potrzebuje na dzień jazdy.",
        gdzie: "Dzienny przebieg × zużycie auta (kWh/100 km) ÷ 100, plus straty ładowania.",
        zakres: "Twoje auto i trasa.",
      },
      nadwyzkaLato: {
        nazwa: "Nadwyżka produkcji PV latem [kWh/dobę]",
        cel: "Ile energii zostaje latem po pokryciu zużycia domu.",
        gdzie: "Z Modułu 3 (produkcja) minus zużycie domu, albo z monitoringu.",
        zakres: "Twoja instalacja.",
      },
      nadwyzkaZima: {
        nazwa: "Nadwyżka produkcji PV zimą [kWh/dobę]",
        cel: "Ile energii zostaje zimą — zwykle bardzo mało.",
        gdzie: "Z Modułu 3 dla miesięcy zimowych minus zużycie domu.",
        zakres: "Twoja instalacja.",
      },
    },
  },
  "grzalki-bms-mroz": {
    migawka: {
      oCoChodzi:
        "LiFePO4 nie wolno ładować na mrozie, więc BMS grzeje ogniwa. Ale nie ma sensu grzać z baterii, jeśli za chwilę słońce zrobi to za darmo.",
      jakDziala:
        "Poniżej {progTemp} °C grzałki są potrzebne. Aplikacja decyduje, skąd je zasilić: przy produkcji PV — ze słońca; bez PV i przy SoC poniżej {progSoc}% grzanie z baterii jest wstrzymywane, żeby jej nie wyczerpać.",
      poCo: "Grzanie z baterii w nocy przy niskim SoC potrafi rozładować magazyn do zera — a rano i tak nie da się go naładować, bo jest za zimno.",
    },
    pola: {
      temperatura: {
        nazwa: "Najniższa spodziewana temperatura przy baterii [°C]",
        cel: "Porównywana z progiem włączenia grzałek.",
        gdzie: "Temperatura w miejscu magazynu. Jeśli stoi w ogrzewanym pomieszczeniu — wpisz temperaturę tam, nie zewnętrzną.",
        zakres: "Próg włączenia grzałek: {progTemp} °C.",
      },
      soc: {
        nazwa: "Bieżący SoC baterii [%]",
        cel: "Poniżej progu, bez produkcji PV, grzanie z baterii jest wstrzymywane.",
        gdzie: Z_BMS,
        zakres: "Próg wstrzymania grzania z baterii (brak PV): {progSoc}%.",
      },
      pv: {
        nazwa: "Produkcja PV w tej chwili",
        cel: "Czy grzałki mogą pracować ze słońca zamiast z baterii.",
        gdzie: "Z monitoringu falownika.",
        zakres: "Tak albo nie.",
      },
    },
  },
  "starzenie-degradacja": {
    migawka: {
      oCoChodzi:
        "Kupujesz baterię nie na dziś, tylko na cały okres jej życia — trzeba od razu doliczyć zapas na to, że będzie słabnąć.",
      jakDziala:
        "Z pojemności potrzebnej dziś, rocznego spadku pojemności i horyzontu aplikacja liczy pojemność początkową, która na końcu horyzontu nadal da potrzebną energię.",
      poCo: "Bateria dobrana „na dziś” po 10 latach może mieć o jedną czwartą mniej pojemności — i zimą przestanie wystarczać.",
      fizyka: "C_początkowa = C_potrzebna ÷ (1 − r × lata).",
    },
    pola: {
      pojemnoscDzis: {
        nazwa: "Pojemność użyteczna potrzebna dziś [kWh]",
        cel: "Ile pojemności potrzebujesz teraz — punkt wyjścia.",
        gdzie: "Z ekranu „Dobór pojemności baterii” — aplikacja podstawia ją automatycznie, możesz nadpisać.",
        zakres: "Wynik z Ekranu 1.",
      },
      horyzont: {
        nazwa: "Horyzont projektowy [lat]",
        cel: "Po ilu latach bateria ma nadal wystarczać.",
        gdzie: "Twój wybór — zwykle okres gwarancji albo planowane życie instalacji.",
        zakres: "5, 10 albo 15 lat.",
      },
      degradacja: {
        nazwa: "Roczny spadek pojemności [%]",
        cel: "O ile procent pojemności bateria traci co rok.",
        gdzie: "Z karty katalogowej (gwarancja pojemności po N latach/cyklach).",
        zakres: "LiFePO4 typowo {degMin}–{degMax}% rocznie.",
      },
    },
  },
  "obwod-precharge": {
    migawka: {
      oCoChodzi:
        "Kondensatory falownika w pierwszej chwili zachowują się jak zwarcie — pre-charge to łagodne „obudzenie” ich prądem przez rezystor, zanim puścisz pełną moc.",
      jakDziala:
        "Z pojemności wejściowej falownika i rezystora wstępnego aplikacja liczy czas ładowania kondensatorów (5 stałych czasowych) i prąd uderzeniowy na starcie.",
      poCo: "Bez pre-charge przy podłączaniu baterii iskrzy, wypalają się styki, a BMS może wyłączyć się na zwarciu.",
      fizyka: "T = 5 · R · C; prąd na starcie I = U / R.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pojemność wejściowa DC falownika [µF]",
        cel: "Im większa, tym dłużej trwa ładowanie przez rezystor.",
        gdzie: "Z karty katalogowej falownika (input capacitance) albo od producenta.",
        zakres: Z_KARTY,
      },
      rezystor: {
        nazwa: "Rezystor wstępny (pre-charge) [Ω]",
        cel: "Ogranicza prąd uderzeniowy. Większy = mniejszy prąd, ale dłuższy czas.",
        gdzie: "Dobierz tak, by ograniczyć prąd uderzeniowy (np. do kilku amperów); sprawdź też jego moc.",
        zakres: "Przykład ze źródła: {rezystor} Ω / 50 W.",
      },
    },
  },
  "slabe-ogniwo": {
    migawka: {
      oCoChodzi: "Jedno słabe ogniwo ogranicza cały pakiet — jak hamulec w jednym wagonie, który zatrzymuje cały pociąg.",
      jakDziala:
        "Z pojemności znamionowej i tolerancji fabrycznej aplikacja liczy pojemność najsłabszego ogniwa. W połączeniu szeregowym pakiet ma pojemność właśnie tego ogniwa — balansowanie tylko częściowo to wyrównuje.",
      poCo: "Żeby wiedzieć, ile realnie da pakiet i dlaczego dobór ogniw „w parach” oraz dobry balanser mają znaczenie.",
      fizyka: "C_najsłabsze = C_znamionowa × (1 − tolerancja).",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pojemność znamionowa ogniwa [Ah]",
        cel: "Punkt wyjścia do obliczenia pojemności najsłabszego ogniwa.",
        gdzie: "Z karty ogniwa.",
        zakres: Z_KARTY,
      },
      tolerancja: {
        nazwa: "Tolerancja fabryczna [%]",
        cel: "O ile pojemność pojedynczego ogniwa może odbiegać od znamionowej.",
        gdzie: "Z karty ogniwa albo protokołu dopasowania od sprzedawcy.",
        zakres: "Domyślnie ±{tolerancja}% wg źródła.",
      },
    },
  },
  "detekcja-zwarcia-efuse": {
    migawka: {
      oCoChodzi:
        "Zwykły bezpiecznik wyłącza zwarcie w ok. 10 ms — elektroniczny e-Fuse w mniej niż 100 µs. Przy bardzo dużych prądach ta różnica decyduje, czy tranzystory BMS przetrwają.",
      jakDziala:
        "Aplikacja liczy prąd zwarciowy baterii (napięcie ÷ rezystancja wewnętrzna) i porównuje ze zdolnością łączeniową tranzystorów BMS. Gdy prąd zwarcia ją przekracza, BMS może nie przerwać zwarcia — potrzebny szybki bezpiecznik przed nim.",
      poCo: "BMS nie jest bezpiecznikiem. Przy zwarciu tysięcy amperów tranzystory potrafią się zespawać w stanie przewodzenia.",
      fizyka: "I_zw = U / R_wewn.",
    },
    pola: {
      napiecie: {
        nazwa: "Napięcie baterii [V]",
        cel: "Z napięcia i rezystancji wewnętrznej liczony jest prąd zwarcia.",
        gdzie: "Napięcie znamionowe pakietu.",
        zakres: "Typowo 12, 24 albo 48 V.",
      },
      rezystancja: {
        nazwa: "Rezystancja wewnętrzna pakietu [Ω]",
        cel: "Im mniejsza, tym większy prąd zwarcia.",
        gdzie: "Z pomiaru albo karty ogniw (suma dla połączenia szeregowego).",
        zakres: Z_KARTY,
      },
      zdolnoscBms: {
        nazwa: "Zdolność łączeniowa tranzystorów BMS [A]",
        cel: "Największy prąd, jaki BMS potrafi bezpiecznie przerwać.",
        gdzie: "Z karty katalogowej BMS.",
        zakres: Z_KARTY,
      },
    },
  },
  "ochrona-wilgoc": {
    migawka: {
      oCoChodzi: "Mokry BMS i miedziane szyny to gotowy przepis na zwarcie — kondensacja to cichy zabójca elektroniki.",
      jakDziala:
        "Z temperatury i wilgotności powietrza aplikacja liczy punkt rosy (równanie Magnusa-Tetensa). Jeśli obudowa albo ogniwa są zimniejsze niż punkt rosy, na nich skrapla się woda. Sprawdza też stopień IP obudowy (w wilgoci minimum IP{minIp}).",
      poCo: "Nocą obudowa wychładza się szybciej niż powietrze — rano na elektronice pojawia się rosa, nawet w „suchym” garażu.",
      fizyka: "Punkt rosy: T_d = b·α / (a − α), α = a·T/(b + T) + ln(RH/100); a = 17,27, b = 237,7 °C.",
    },
    pola: {
      temperatura: {
        nazwa: "Temperatura otoczenia [°C]",
        cel: "Razem z wilgotnością wyznacza punkt rosy.",
        gdzie: "Termometr w pomieszczeniu magazynu.",
        zakres: "Twoje warunki.",
      },
      wilgotnosc: {
        nazwa: "Wilgotność względna [%]",
        cel: "Im wyższa, tym wyższy punkt rosy — łatwiej o skroplenie.",
        gdzie: "Higrometr w pomieszczeniu magazynu.",
        zakres: "0–100%.",
      },
      temperaturaObudowy: {
        nazwa: "Temperatura obudowy / ogniw [°C]",
        cel: "Jeśli jest niższa od punktu rosy, na obudowie skrapla się woda.",
        gdzie: "Zmierzona albo spodziewana — nocą może być niższa niż otoczenia (wychłodzenie radiacyjne).",
        zakres: "Twoje warunki.",
      },
      ip: {
        nazwa: "Stopień ochrony obudowy (IP)",
        cel: "Chroni przed pyłem (pierwsza cyfra) i wodą (druga).",
        gdzie: "Z tabliczki albo karty obudowy.",
        zakres: "W wilgotnym miejscu minimum IP{minIp}.",
      },
    },
  },
  "moment-dokrecania-srub": {
    migawka: {
      oCoChodzi:
        "Śruba to sprężyna — trzeba ją dokręcić dokładnie tyle, ile trzeba, żeby docisnęła końcówkę kablową, ani trochę więcej.",
      jakDziala: "Wybierasz typ i pojemność ogniwa — aplikacja podaje moment dokręcania zacisków ze źródła.",
      poCo: "Za słabo — połączenie iskrzy i się grzeje. Za mocno — pęka gwint w aluminiowym zacisku ogniwa, a to często koniec ogniwa.",
    },
    pola: {
      typ: {
        nazwa: "Typ / pojemność ogniwa",
        cel: "Od typu zacisku (gwint, materiał) zależy właściwy moment.",
        gdzie: "Z karty ogniwa.",
        zakres: "Opcje z listy.",
      },
    },
  },
  "cold-c-rate": {
    migawka: {
      oCoChodzi:
        "W zimnie jony litu poruszają się wolniej — zbyt szybkie ładowanie trwale uszkadza ogniwa (osadzanie litu metalicznego).",
      jakDziala:
        "Aplikacja ustala dopuszczalny prąd ładowania z temperatury ogniwa: poniżej {blokada} °C ładowanie zablokowane, od {blokada} do {limit02} °C najwyżej {cZimno}C, od {limit02} do {luka} °C najwyżej {cChlodno}C, od {pelny} °C pełny prąd. Zakres {luka}–{pelny} °C nie jest zgadywany — źródło go nie opisuje.",
      poCo: "Uszkodzenie od ładowania na mrozie jest nieodwracalne i nie widać go od razu — pojemność spada z każdym takim cyklem.",
    },
    pola: {
      temperatura: {
        nazwa: "Temperatura ogniwa [°C]",
        cel: "Od niej zależy dopuszczalny prąd ładowania.",
        gdzie: "Odczyt na żywo z BMS (czujnik na ogniwach). 0 °C to prawidłowy pomiar.",
        zakres: "Blokada poniżej {blokada} °C; pełny prąd od {pelny} °C.",
      },
      pojemnosc: {
        nazwa: "Pojemność pakietu [Ah]",
        cel: "Przelicza limit C-rate na amperomierz: I = C-rate × pojemność.",
        gdzie: "Z karty pakietu.",
        zakres: Z_KARTY,
      },
    },
  },
  "koniec-ladowania": {
    migawka: {
      oCoChodzi:
        "Jak napełnianie butelki — ciśnienie już jest, ale trzeba chwilę odczekać, żeby woda dotarła do samego końca. Ładowanie kończy się, gdy prąd spadnie przy napięciu absorpcji.",
      jakDziala:
        "Aplikacja liczy prąd końcowy: próg C × pojemność. Porównuje go z bieżącym prądem przy napięciu absorpcji — gdy prąd spadnie poniżej progu, bateria jest pełna i ładowanie można zakończyć.",
      poCo: "Za wczesne przerwanie ładowania to niedoładowana bateria i błędny SoC; za późne — niepotrzebne trzymanie ogniw na wysokim napięciu.",
      fizyka: "I_końcowy = próg C × C_Ah.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pojemność baterii [Ah]",
        cel: "Przelicza próg C na amperomierz.",
        gdzie: "Z karty baterii.",
        zakres: Z_KARTY,
      },
      napiecieAbsorpcji: {
        nazwa: "Napięcie absorpcji [V]",
        cel: "Napięcie, przy którym regulator trzyma baterię na końcu ładowania.",
        gdzie: "Z ustawień regulatora/ładowarki albo karty baterii.",
        zakres: Z_KARTY,
      },
      progKoncowy: {
        nazwa: "Próg prądu końcowego [C]",
        cel: "Przy jakim prądu (jako ułamek pojemności) uznać baterię za pełną.",
        gdzie: "Z karty baterii albo zaleceń producenta regulatora.",
        zakres: "Przykład ze źródła: {progC}C.",
      },
      prad: {
        nazwa: "Aktualny prąd ładowania [A]",
        cel: "Porównywany z prądem końcowym.",
        gdzie: Z_BMS,
        zakres: "Odczyt na żywo.",
      },
      napiecie: {
        nazwa: "Aktualne napięcie [V]",
        cel: "Sprawdza, czy bateria jest już na napięciu absorpcji.",
        gdzie: Z_BMS,
        zakres: "Odczyt na żywo.",
      },
    },
  },
  "soh-per-ogniwo": {
    migawka: {
      oCoChodzi:
        "Rosnąca rezystancja jednego ogniwa jest jak zatkane naczynie — reszta pakietu musi pracować ciężej, żeby to skompensować.",
      jakDziala: "Aplikacja porównuje aktualną rezystancję wewnętrzną ogniwa z fabryczną. Wzrost o {progWzrostu}% i więcej oznacza ogniwo krytyczne.",
      poCo: "Słabe ogniwo grzeje się bardziej, szybciej się starzeje i jako pierwsze wyłącza cały pakiet — lepiej je wymienić wcześniej.",
      fizyka: "wzrost % = (R_aktualna − R_fabryczna) / R_fabryczna × 100.",
    },
    pola: {
      rFabryczna: {
        nazwa: "Rezystancja wewnętrzna fabryczna [mΩ]",
        cel: "Punkt odniesienia — rezystancja nowego ogniwa.",
        gdzie: "Z karty ogniwa albo pierwszego pomiaru po zakupie.",
        zakres: Z_KARTY,
      },
      rAktualna: {
        nazwa: "Rezystancja wewnętrzna aktualna [mΩ]",
        cel: "Porównywana z fabryczną.",
        gdzie: "Z pomiaru testerem rezystancji wewnętrznej (metoda AC 1 kHz).",
        zakres: "Wzrost od {progWzrostu}% — krytycznie.",
      },
    },
  },
  "cold-cranking-amps": {
    migawka: {
      oCoChodzi:
        "Zimna bateria to leniwa chemia — chwilowo nie nadąża z prądem rozruchowym, nawet jeśli ma dużo energii. Napięcie spada tak, że falownik się wyłącza.",
      jakDziala:
        "Aplikacja liczy spadek napięcia przy rozruchu: napięcie bez obciążenia − prąd rozruchowy × rezystancja wewnętrzna (zmierzona na zimno), i porównuje z minimalnym napięciem pracy falownika.",
      poCo: "Pompa głębinowa czy sprężarka, która latem rusza bez problemu, zimą może wyłączać falownik przy każdym starcie.",
      fizyka: "V_sag = V_oc − I_rozruch × R_wewn.",
    },
    pola: {
      napiecie: {
        nazwa: "Napięcie pakietu bez obciążenia [V]",
        cel: "Punkt wyjścia do obliczenia spadku.",
        gdzie: "Pomiar na zaciskach bez obciążenia albo odczyt z BMS.",
        zakres: "Twój pakiet.",
      },
      pradRozruchu: {
        nazwa: "Prąd rozruchowy odbiornika [A]",
        cel: "Chwilowy prąd przy starcie silnika — kilkukrotnie większy niż prąd pracy.",
        gdzie: "Z karty urządzenia (np. prąd startowy pompy głębinowej) po stronie DC falownika.",
        zakres: Z_KARTY,
      },
      rezystancja: {
        nazwa: "Rezystancja wewnętrzna pakietu [mΩ]",
        cel: "Zimą rośnie — i to ona powoduje spadek napięcia.",
        gdzie: "Zmierzona w bieżącej (zimnej) temperaturze ogniw testerem rezystancji.",
        zakres: "Pomiar na zimno.",
      },
      minFalownika: {
        nazwa: "Minimalne napięcie pracy falownika [V]",
        cel: "Poniżej niego falownik się wyłącza.",
        gdzie: "Z karty falownika (low voltage cut-off / min. DC input).",
        zakres: Z_KARTY,
      },
    },
  },
  "long-term-storage": {
    migawka: {
      oCoChodzi:
        "Bateria odstawiona na dłużej nie lubi być ani przesuszona, ani przelana — a mróz poniżej pewnej granicy uszkadza ogniwa nawet bez ładowania.",
      jakDziala: "Aplikacja sprawdza SoC przed odstawieniem (zalecane {socMin}–{socMax}%) i najniższą temperaturę przechowywania (bezpieczne minimum {tMin} °C).",
      poCo: "Pełna bateria przechowywana miesiącami starzeje się szybciej, pusta może rozładować się poniżej progu BMS. Mróz poniżej minimum uszkadza elektrolit.",
    },
    pola: {
      soc: {
        nazwa: "Docelowy SoC przed odstawieniem [%]",
        cel: "Stan naładowania na czas przechowywania.",
        gdzie: "Ustaw ładowanie/rozładowanie do tej wartości przed odłączeniem.",
        zakres: "Zalecany zakres: {socMin}–{socMax}%.",
      },
      temperatura: {
        nazwa: "Najniższa spodziewana temperatura przechowywania [°C]",
        cel: "Porównywana z bezpiecznym minimum.",
        gdzie: "Najzimniejsza noc w miejscu przechowywania.",
        zakres: "Bezpieczne minimum: {tMin} °C.",
      },
    },
  },
  "second-life": {
    migawka: {
      oCoChodzi:
        "Bateria z rozbiórki auta elektrycznego może być świetną okazją albo drogim rozczarowaniem — zależnie od realnego stanu, nie deklarowanego.",
      jakDziala:
        "Aplikacja szacuje stan zdrowia (SoH) z wieku ({degRok}% rocznie) albo przebiegu ({degKm}% na 10 000 km), liczy realną pojemność i koszt za kWh, i opcjonalnie porównuje z nową baterią LiFePO4.",
      poCo: "Cena za „deklarowane kWh” wprowadza w błąd — liczy się koszt realnie użytecznej kWh.",
      fizyka: "SoH = 100% − degradacja; C_użyteczna = C_deklarowana × SoH; koszt_kWh = cena ÷ C_użyteczna.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Deklarowana pojemność [kWh]",
        cel: "Pojemność podawana przez sprzedawcę — punkt wyjścia.",
        gdzie: "Z ogłoszenia albo tabliczki modułu.",
        zakres: "Deklaracja sprzedawcy.",
      },
      cena: {
        nazwa: "Cena zakupu [zł]",
        cel: "Dzielona przez realną pojemność daje koszt kWh.",
        gdzie: "Z oferty.",
        zakres: TWOJA_CENA,
      },
      metoda: {
        nazwa: "Metoda szacunku SoH",
        cel: "Z wieku baterii albo z przebiegu pojazdu — zależnie od tego, co wiesz.",
        gdzie: "Wybierz dostępną informację.",
        zakres: "Wiek albo przebieg.",
      },
      wiek: {
        nazwa: "Wiek baterii [lata]",
        cel: "Z wieku aplikacja szacuje utratę pojemności.",
        gdzie: "Z dokumentów pojazdu albo daty produkcji modułu.",
        zakres: "Degradacja przyjęta: {degRok}% rocznie.",
      },
      przebieg: {
        nazwa: "Przebieg pojazdu [km]",
        cel: "Z przebiegu aplikacja szacuje utratę pojemności.",
        gdzie: "Z dokumentów pojazdu.",
        zakres: "Degradacja przyjęta: {degKm}% na 10 000 km.",
      },
      cenaNowej: {
        nazwa: "Cena nowej baterii LiFePO4 [zł/kWh] (opcjonalnie)",
        cel: "Do porównania — czy używana się opłaca.",
        gdzie: "Z aktualnych ofert.",
        zakres: TWOJA_CENA,
      },
    },
  },
  "mixing-rownolegle": {
    migawka: {
      oCoChodzi:
        "Łączenie równoległe różnych baterii to jak zaprzęgnięcie konia pociągowego z kucykiem do jednego wozu — jeden ciągnie więcej i szybciej się wykończy.",
      jakDziala:
        "Aplikacja sprawdza zgodność chemii i liczy prąd wyrównawczy przy połączeniu: różnica napięć ÷ suma rezystancji. Różnica napięć powyżej {progRoznicy} V to ostrzeżenie.",
      poCo: "Duży prąd wyrównawczy w chwili łączenia potrafi uszkodzić złącza i BMS; różne chemie mają inne napięcia ładowania — jedna zawsze będzie przeładowana albo niedoładowana.",
      fizyka: "I_wyr = ΔU / (R₁ + R₂).",
    },
    pola: {
      chemia: {
        nazwa: "Chemia ogniw",
        cel: "Różne chemie mają różne napięcia pracy i ładowania — mieszanie ich jest ryzykowne.",
        gdzie: "Z karty baterii.",
        zakres: "Opcje z listy.",
      },
      napiecie: {
        nazwa: "Napięcie nominalne [V]",
        cel: "Różnica napięć napędza prąd wyrównawczy.",
        gdzie: "Zmierz napięcie obu baterii tuż przed połączeniem.",
        zakres: "Różnica powyżej {progRoznicy} V — ostrzeżenie.",
      },
      rezystancja: {
        nazwa: "Rezystancja wewnętrzna [mΩ]",
        cel: "Ogranicza prąd wyrównawczy.",
        gdzie: "Z pomiaru albo karty baterii.",
        zakres: Z_KARTY,
      },
    },
  },
  "vehicle-to-home": {
    migawka: {
      oCoChodzi:
        "Auto może być powerbankiem na kółkach, ale to zużywa jego baterię trakcyjną — warto policzyć, czy to się opłaca.",
      jakDziala:
        "Aplikacja liczy realnie dostępną energię (pojemność − rezerwa na dojazd, × sprawność) i koszt zużycia baterii na kWh: cena wymiany ÷ (pojemność × cykle × sprawność).",
      poCo: "Jeśli koszt zużycia baterii auta na kWh jest wyższy niż kWh z sieci czy agregatu, V2H jest tylko na awarie.",
      fizyka: "C_realna = (C_EV − rezerwa) × η; koszt_kWh = cena_wymiany ÷ (C_EV × cykle × η).",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pojemność baterii trakcyjnej EV [kWh]",
        cel: "Całkowita energia w baterii auta.",
        gdzie: "Z danych technicznych auta (pojemność netto).",
        zakres: "Dane auta.",
      },
      rezerwa: {
        nazwa: "Rezerwa na dojazd [kWh]",
        cel: "Energia, której nie oddasz domowi — żeby móc pojechać.",
        gdzie: "Twoje potrzeby: najdłuższy nagły dojazd × zużycie auta.",
        zakres: "Twój wybór.",
      },
      sprawnosc: {
        nazwa: "Sprawność efektywna [%]",
        cel: "Straty przy oddawaniu energii do domu i degradacja.",
        gdzie: "Z danych ładowarki dwukierunkowej albo producenta auta.",
        zakres: "0–100%.",
      },
      kosztWymiany: {
        nazwa: "Koszt wymiany baterii trakcyjnej [zł]",
        cel: "Do obliczenia kosztu zużycia na kWh.",
        gdzie: "Z serwisu albo cennika producenta.",
        zakres: TWOJA_CENA,
      },
      cykle: {
        nazwa: "Liczba cykli życia baterii trakcyjnej",
        cel: "Na ile pełnych cykli rozkłada się koszt wymiany.",
        gdzie: "Z danych producenta albo gwarancji baterii.",
        zakres: Z_KARTY,
      },
    },
  },
  "komunikacja-bms": {
    migawka: {
      oCoChodzi:
        "BMS i falownik muszą „mówić tym samym językiem” — bez tego falownik nie wie, ile realnie ma baterii, i musi zgadywać z napięcia.",
      jakDziala: "Wybierasz protokół BMS i falownika (CAN, RS485, Modbus…). Aplikacja sprawdza zgodność i ostrzega, gdy się nie dogadają.",
      poCo: "Bez komunikacji falownik ładuje na podstawie napięcia — gorzej chroni ogniwa i źle pokazuje SoC.",
    },
    pola: {
      protokolBms: {
        nazwa: "Protokół BMS",
        cel: "Jak BMS przekazuje dane (SoC, limity prądu, alarmy).",
        gdzie: "Z karty BMS albo instrukcji baterii.",
        zakres: "Opcje z listy.",
      },
      protokolFalownika: {
        nazwa: "Protokół falownika / ładowarki",
        cel: "Jakiego protokołu oczekuje falownik.",
        gdzie: "Z instrukcji falownika — lista obsługiwanych BMS.",
        zakres: "Opcje z listy.",
      },
    },
  },
  "pozycjonowanie-ogniw": {
    migawka: {
      oCoChodzi:
        "Ogniwa pryzmatyczne lubią być trzymane stabilnie, ale nie jak w imadle — muszą mieć trochę przestrzeni na naturalne „oddychanie” podczas pracy.",
      jakDziala: "Aplikacja porównuje zastosowany docisk z zalecanym zakresem dla ogniw pryzmatycznych.",
      poCo: "Za słaby docisk — ogniwa puchną i szybciej się starzeją; za mocny — uszkodzenie obudowy i elektrod.",
    },
    pola: {
      docisk: {
        nazwa: "Zastosowany docisk na pakiet [kgf]",
        cel: "Siła ściskająca ogniwa w pakiecie.",
        gdzie: "Z projektu obudowy/ścisków albo pomiaru (np. momentem śrub ściągających).",
        zakres: "Zalecany zakres dla ogniw pryzmatycznych: {dociskMin}–{dociskMax} kgf.",
      },
    },
  },
  "pobor-wlasny-bms": {
    migawka: {
      oCoChodzi:
        "BMS to też odbiornik prądu, nawet gdy „nic nie robi” — w małych off-gridach ten stały pobór potrafi być zaskakująco dużą częścią bilansu.",
      jakDziala: "Aplikacja liczy roczną energię poboru własnego w pracy ciągłej i w uśpieniu: moc × 24 h × 365 dni.",
      poCo: "Kilka watów przez całą dobę to dziesiątki kWh rocznie — i powód, dla którego odstawiona bateria sama się rozładowuje.",
      fizyka: "E_roczna = P × 24 × 365 / 1000 [kWh].",
    },
    pola: {
      ciagle: {
        nazwa: "Pobór w trybie pracy ciągłej [W]",
        cel: "Pobór BMS podczas normalnej pracy.",
        gdzie: "Z karty BMS (self-consumption).",
        zakres: "Typowo {ciagleMin}–{ciagleMax} W.",
      },
      uspienie: {
        nazwa: "Pobór w trybie uśpienia (deep sleep) [W]",
        cel: "Pobór BMS w uśpieniu — ważny przy odstawieniu baterii.",
        gdzie: "Z karty BMS.",
        zakres: "Typowo {uspienieMin}–{uspienieMax} W.",
      },
    },
  },
  "oplacalnosc-magazynu": {
    migawka: {
      oCoChodzi:
        "Bateria to skarbonka energii, ale sama też kosztuje — dopiero koszt każdej oddanej kWh pokazuje, czy magazyn się opłaca.",
      jakDziala: "Koszt 1 kWh z magazynu = cena ÷ (pojemność użyteczna × liczba cykli × sprawność). Opcjonalnie aplikacja porównuje go z kosztem kWh z alternatywy (agregat, sieć).",
      poCo: "Jeśli kWh z magazynu kosztuje więcej niż z sieci, magazyn nie zarabia na przesuwaniu energii — ma sens tylko dla niezależności.",
      fizyka: "koszt_kWh = cena ÷ (C × cykle × η).",
    },
    pola: {
      cena: {
        nazwa: "Cena baterii [zł]",
        cel: "Nakład na magazyn.",
        gdzie: "Z oferty (z montażem, jeśli chcesz pełny koszt).",
        zakres: TWOJA_CENA,
      },
      pojemnosc: {
        nazwa: "Pojemność użyteczna [kWh]",
        cel: "Energia oddawana w jednym cyklu.",
        gdzie: "Z karty (usable capacity).",
        zakres: Z_KARTY,
      },
      cykle: {
        nazwa: "Liczba cykli życia przy wybranym DoD",
        cel: "Na ile cykli rozkłada się koszt.",
        gdzie: "Z karty katalogowej albo Ekranu 30 (Porównanie technologii).",
        zakres: Z_KARTY,
      },
      sprawnosc: {
        nazwa: "Sprawność magazynu [%]",
        cel: "Straty ładowania i rozładowania.",
        gdzie: "Z karty (round-trip efficiency).",
        zakres: "0–100%.",
      },
      alternatywa: {
        nazwa: "Koszt alternatywy [zł/kWh] (opcjonalnie)",
        cel: "Koszt kWh z agregatu albo sieci — do porównania.",
        gdzie: "Z rachunku albo ekranu agregatu. Puste = sam koszt magazynu.",
        zakres: "Twoja wartość.",
      },
    },
  },
  "szyny-zbiorcze-miedzypakietowe": {
    migawka: {
      oCoChodzi:
        "Prąd, jak wszystko leniwe, płynie tam, gdzie mu łatwiej — nierówne długości kabli czy niesymetryczne podłączenie zawsze dają nierówne obciążenie pakietów.",
      jakDziala: "Aplikacja liczy rozpływ prądu między gałęziami: każda gałąź dostaje prąd odwrotnie proporcjonalny do swojej rezystancji (długość i przekrój przewodu).",
      poCo: "Pakiet na krótszym kablu pracuje ciężej i szybciej się zużywa. Równe długości i symetryczne podłączenie (po przekątnej) to prawie darmowa poprawa.",
      fizyka: "I_i = I_całk × (1/R_i) ÷ Σ(1/R_j); R_i = ρ × 2L_i / A_i.",
    },
    pola: {
      pradCalkowity: {
        nazwa: "Prąd całkowity [A]",
        cel: "Prąd dzielący się między gałęzie pakietów.",
        gdzie: "Maksymalny prąd falownika albo ładowarki po stronie DC.",
        zakres: Z_KARTY,
      },
      material: {
        nazwa: "Materiał przewodów",
        cel: "Miedź albo aluminium — różna rezystywność.",
        gdzie: "Z opisu kabla.",
        zakres: "Cu albo Al.",
      },
      dlugosc: {
        nazwa: "Długość odcinka do wspólnej szyny [m]",
        cel: "Dłuższy odcinek = większa rezystancja = mniejszy prąd tej gałęzi.",
        gdzie: "Zmierz przewód od pakietu do szyny.",
        zakres: "Twoja instalacja.",
      },
      przekroj: {
        nazwa: "Przekrój przewodu [mm²]",
        cel: "Większy przekrój = mniejsza rezystancja.",
        gdzie: "Z izolacji przewodu.",
        zakres: "Przekroje handlowe.",
      },
    },
  },
  "topologia-bms": {
    migawka: {
      oCoChodzi:
        "Jak masz jedną rurę do wody i ścieków, w końcu się zapcha — czasem lepiej rozdzielić drogi ładowania i rozładowania (Separate Port).",
      jakDziala: "Aplikacja porównuje prąd znamionowy Common Port BMS ze szczytowym prądem rozruchu falownika. Gdy rozruch go przekracza, BMS może się wyłączać przy starcie.",
      poCo: "BMS dobrany tylko do prądu nominalnego wyłącza się, gdy falownik zasila silnik — cały dom gaśnie przy starcie pompy.",
    },
    pola: {
      pradCommon: {
        nazwa: "Prąd znamionowy Common Port BMS [A]",
        cel: "Największy prąd, jaki przepuści wspólny port ładowania i rozładowania.",
        gdzie: "Z karty BMS.",
        zakres: Z_KARTY,
      },
      pradRozruchu: {
        nazwa: "Szczytowy prąd rozruchu falownika [A]",
        cel: "Chwilowy prąd pobierany przez falownik przy rozruchu dużych odbiorników.",
        gdzie: "Z karty falownika — prąd rozruchowy bywa znacznie wyższy niż nominalny.",
        zakres: Z_KARTY,
      },
    },
  },
  "dobor-bezpiecznika-dc": {
    migawka: {
      oCoChodzi:
        "Bezpiecznik musi umieć ugasić łuk elektryczny, a nie tylko się przepalić — źle dobrany pod względem AIC sam staje się źródłem łuku.",
      jakDziala: "Aplikacja liczy prąd zwarciowy baterii (napięcie ÷ rezystancja wewnętrzna) i porównuje ze zdolnością wyłączania (AIC) bezpiecznika. Dla LiFePO4 minimum to {minAic} A.",
      poCo: "Baterie LiFePO4 mają bardzo małą rezystancję — przy zwarciu dają tysiące amperów. Zwykły bezpiecznik samochodowy tego nie przerwie.",
      fizyka: "I_zw = U / R_wewn.",
    },
    pola: {
      napiecie: {
        nazwa: "Napięcie baterii [V]",
        cel: "Z napięcia i rezystancji wewnętrznej liczony jest prąd zwarcia.",
        gdzie: "Napięcie znamionowe pakietu.",
        zakres: "Typowo 12, 24 albo 48 V.",
      },
      rezystancja: {
        nazwa: "Rezystancja wewnętrzna pakietu [Ω]",
        cel: "Im mniejsza, tym większy prąd zwarcia.",
        gdzie: "Z pomiaru albo karty ogniw.",
        zakres: Z_KARTY,
      },
      aic: {
        nazwa: "AIC wybranego bezpiecznika [A]",
        cel: "Zdolność wyłączania — musi przewyższać prąd zwarcia.",
        gdzie: "Z karty katalogowej bezpiecznika (breaking capacity).",
        zakres: "Dla LiFePO4 minimum {minAic} A.",
      },
    },
  },
  "chlodzenie-latem": {
    migawka: {
      oCoChodzi: "Bateria to nie piec — wysoka temperatura nie tylko chwilowo obniża wydajność, ale trwale przyspiesza starzenie ogniw.",
      jakDziala: "Aplikacja porównuje temperaturę ogniw z zakresem pracy {tMin}–{tMax} °C i podpowiada chłodzenie (wentylacja, cień, izolacja).",
      poCo: "Każde kilka stopni powyżej optimum skraca życie ogniw. Magazyn na poddaszu albo w nasłonecznionym kontenerze starzeje się dużo szybciej.",
    },
    pola: {
      temperatura: {
        nazwa: "Temperatura ogniw [°C]",
        cel: "Porównywana z dopuszczalnym zakresem pracy.",
        gdzie: Z_BMS,
        zakres: "Dopuszczalny zakres pracy: {tMin}–{tMax} °C.",
      },
    },
  },
  "kalibracja-soc": {
    migawka: {
      oCoChodzi:
        "Liczenie prądu w BMS to ciągły szacunek, nie dokładny pomiar — od czasu do czasu trzeba go „zresetować” pełnym naładowaniem, żeby błąd się nie kumulował.",
      jakDziala: "Aplikacja sprawdza, ile dni minęło od ostatniego pełnego naładowania. Po {progDni} dniach zaleca kalibrację.",
      poCo: "Z rozkalibrowanym SoC system może odciąć odbiorniki za wcześnie albo rozładować baterię poniżej bezpiecznego progu.",
    },
    pola: {
      dni: {
        nazwa: "Dni od ostatniego pełnego naładowania [dni]",
        cel: "Im dłużej, tym większy skumulowany błąd SoC.",
        gdzie: "Z historii BMS albo Twojej pamięci. 0 = dziś było pełne ładowanie.",
        zakres: "Próg rekomendacji kalibracji: {progDni} dni.",
      },
    },
  },
  "detekcja-doziemienia": {
    migawka: {
      oCoChodzi:
        "Prąd stały trzyma ofiarę porażenia mocniej niż zmienny — mięśnie nie mogą się „puścić”. Dlatego wykrywanie doziemienia w DC jest tak ważne.",
      jakDziala: "Lista kontrolna: monitor izolacji (IMD) i różnicówka DC. Brak zabezpieczenia to ostrzeżenie albo czerwony stop zależnie od układu.",
      poCo: "Uszkodzona izolacja przewodu DC może latami być niewidoczna — do chwili, gdy ktoś dotknie konstrukcji.",
    },
    pola: {},
  },
  "matryca-alarmow-bms": {
    migawka: {
      oCoChodzi:
        "System broni się sam — Twoim zadaniem jest zrozumieć komunikat i usunąć przyczynę, nie tylko skasować alarm. Tabela pokazuje, co BMS robi automatycznie przy każdym stanie alarmowym.",
      jakDziala: "Dla każdego alarmu (przepięcie, podnapięcie, temperatura, prąd…) tabela pokazuje reakcję BMS i systemu oraz przykładowy komunikat dla użytkownika.",
      poCo: "Żeby wiedzieć, dlaczego system się wyłączył i co zrobić — zanim zaczniesz szukać usterki na ślepo.",
    },
    pola: {},
  },
  "porownanie-technologii-magazynow": {
    migawka: {
      oCoChodzi:
        "Cena zakupu to nie to samo co koszt w całym cyklu życia — trzeba doliczyć wagę (konstrukcja podłogi), obsługę i realną liczbę cykli.",
      jakDziala: "Tabela porównuje technologie magazynów: energię oddaną przez całe życie (pojemność × cykle × DoD), masę, obsługę. Opcjonalnie przelicza na planowaną pojemność.",
      poCo: "Tańszy na starcie akumulator ołowiowy może kosztować kilka razy więcej za kWh w całym życiu niż LiFePO4.",
      fizyka: "E_całkowita = pojemność × cykle × DoD.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Planowana pojemność magazynu [kWh] (opcjonalnie)",
        cel: "Przelicza tabelę (masa, koszt) na Twój rozmiar magazynu.",
        gdzie: "Z ekranu „Dobór pojemności baterii”.",
        zakres: "Wynik z Ekranu 1.",
      },
    },
  },
  "napiecie-odciecia-a-zywotnosc": {
    migawka: {
      oCoChodzi:
        "Nie wyciskaj baterii do ostatniej kropli — wyższe napięcie odcięcia (mały zapas) radykalnie wydłuża jej życie, kosztem niewielkiej części dostępnej pojemności.",
      jakDziala:
        "Z napięcia odcięcia i liczby ogniw aplikacja liczy napięcie na ogniwo, a z punktów kalibracyjnych źródła — przybliżony DoD i liczbę cykli (interpolacja liniowa między {vMin} V/ogniwo ≈ 100% DoD i {vMax} V/ogniwo ≈ 80% DoD).",
      poCo: "Podniesienie odcięcia o kilka dziesiątych wolta może podwoić liczbę cykli — i przedłużyć życie magazynu o lata.",
    },
    pola: {
      napiecie: {
        nazwa: "Napięcie odcięcia [V]",
        cel: "Napięcie pakietu, przy którym falownik/BMS przestaje rozładowywać baterię.",
        gdzie: "Z ustawień falownika albo BMS (low voltage cut-off).",
        zakres: "Twoje ustawienia.",
      },
      ogniwa: {
        nazwa: "Liczba ogniw połączonych szeregowo (S)",
        cel: "Dzieli napięcie pakietu na napięcie jednego ogniwa.",
        gdzie: "Z opisu pakietu (np. 16S).",
        zakres: "Typowy pakiet 48 V LiFePO4 to 16S — sugerowana wartość: {ogniwa}.",
      },
    },
  },
  "hierarchia-ladowania": {
    migawka: {
      oCoChodzi: "Mądry system czeka na darmowe paliwo ze słońca, zamiast od razu sięgać po drogi agregat.",
      jakDziala: "Kolejność źródeł: PV zawsze pierwsze, agregat dopiero poniżej progu krytycznego SoC, sieć (jeśli jest) jako ostatnia. Aplikacja pokazuje, które źródło ładuje przy obecnym SoC.",
      poCo: "Agregat uruchomiony za wcześnie pali paliwo na energię, którą za godzinę dałoby słońce.",
    },
    pola: {
      soc: {
        nazwa: "Aktualny SoC baterii [%]",
        cel: "Porównywany z progiem krytycznym.",
        gdzie: Z_BMS,
        zakres: "0–100%.",
      },
      progKrytyczny: {
        nazwa: "Próg krytyczny SoC [%]",
        cel: "Poniżej tej wartości rozważany jest agregat.",
        gdzie: "Twoja decyzja — dopasuj do DoD baterii i czasu uruchomienia agregatu.",
        zakres: "Brak sugerowanej wartości — dane bezpieczeństwa nie mają ukrytego domyślnego wypełnienia.",
      },
    },
  },
  "symulacja-miesiaca-zachmurzenia": {
    migawka: {
      oCoChodzi:
        "Projektujesz system nie na średnią pogodę, tylko na najgorszy realistyczny tydzień w roku — to istota prawdziwego off-gridu.",
      jakDziala:
        "Aplikacja liczy dzień po dniu: produkcja = nominalna × poziom zachmurzenia; deficyt dobowy zjada baterię, aż SoC spadnie do zera. Pokazuje, w którym dniu system padnie i ile pojemności brakuje.",
      poCo: "Średnia roczna produkcja kłamie. Kilkanaście dni bez słońca w grudniu to realny scenariusz — lepiej go przeliczyć wcześniej.",
      fizyka: "ΔE_doba = E_zapotrzebowanie − E_produkcja,nom × zachmurzenie % ÷ 100.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Pojemność użyteczna baterii [kWh]",
        cel: "Zapas energii na czarny scenariusz.",
        gdzie: "Z ekranu „Dobór pojemności baterii”.",
        zakres: "Wynik z Ekranu 1.",
      },
      socStart: {
        nazwa: "SoC na początku scenariusza [%]",
        cel: "Od jakiego stanu naładowania zaczyna się seria pochmurnych dni.",
        gdzie: "Zwykle pełna bateria (100%) — albo realny stan, jeśli testujesz gorszy przypadek.",
        zakres: "0–100%.",
      },
      zapotrzebowanie: {
        nazwa: "Zapotrzebowanie dobowe [kWh/dzień]",
        cel: "Ile energii zużywasz każdego dnia scenariusza.",
        gdzie: "Z bilansu obciążeń (Moduł 2) — zimowe zużycie.",
        zakres: "Twoje dane.",
      },
      produkcja: {
        nazwa: "Nominalna produkcja dobowa PV (dzień słoneczny) [kWh/dzień]",
        cel: "Punkt wyjścia do produkcji w pochmurny dzień.",
        gdzie: "Z Modułu 3 dla miesiąca scenariusza.",
        zakres: "Twoja instalacja.",
      },
      zachmurzenie: {
        nazwa: "Poziom zachmurzenia [% produkcji nominalnej]",
        cel: "Jaki procent nominalnej produkcji zostaje w pochmurny dzień.",
        gdzie: "Twoje założenie o najgorszym tygodniu.",
        zakres: "Źródło sugeruje 5–10% dla czarnego scenariusza — brak jednej kanonicznej wartości, ustal świadomie.",
      },
      dni: {
        nazwa: "Liczba dni scenariusza [dni]",
        cel: "Jak długo trwa seria pochmurnych dni.",
        gdzie: "Twoje założenie.",
        zakres: "Sugerowane ze źródła: {dni} dni.",
      },
    },
  },
  "magazyn-firmy": {
    migawka: {
      oCoChodzi:
        "Magazyn w firmie zarabia na pięć sposobów, ale nie każdy jest dostępny dla Twojej firmy. Każdy strumień porównujemy z kosztem zużycia magazynu na 1 kWh.",
      jakDziala:
        "Aplikacja liczy osobno: autokonsumpcję (energia × zysk na kWh), arbitraż cenowy (energia × różnica cen), obniżenie opłaty mocowej (energia oddana w dni robocze 7–22), oszczędność na mocy umownej (realna tylko w C2x i przy przekroczeniach) — i porównuje z kosztem kWh z magazynu z „Analizy opłacalności magazynu” (Moduł 4). Usługi systemowe są dla małych magazynów praktycznie niedostępne bez agregatora — tylko jako informacja.",
      poCo: "Strumień, który kosztuje więcej zużycia magazynu, niż daje zysku, jest stratny — lepiej to wiedzieć przed zakupem.",
    },
    pola: {
      energiaAutokonsumpcja: {
        nazwa: "Energia przez magazyn [kWh/rok]",
        cel: "Ile energii rocznie magazyn przesunie w danym strumieniu (autokonsumpcja albo arbitraż).",
        gdzie: "Z bilansu PV i magazynu (ekran F6) albo Twojego planu pracy magazynu.",
        zakres: "Twoje dane.",
      },
      zyskKwh: {
        nazwa: "Zysk na 1 kWh z autokonsumpcji [zł/kWh]",
        cel: "Ile zyskujesz na każdej kWh zużytej z magazynu zamiast z sieci.",
        gdzie: "Cena zakupu kWh − wartość kWh oddanej do sieci, bez opłaty mocowej.",
        zakres: "Twoje ceny.",
      },
      roznicaCen: {
        nazwa: "Różnica cen dla arbitrażu [zł/kWh]",
        cel: "Zysk z kupowania w tanich godzinach i zużywania w drogich.",
        gdzie: "Drogie − tanie godziny w Twojej taryfie albo umowie dynamicznej, bez opłaty mocowej.",
        zakres: "Twoje ceny.",
      },
      energiaMocowa: {
        nazwa: "Energia z magazynu w dni robocze 7:00–22:00 [kWh/rok]",
        cel: "Energia, której nie pobierzesz z sieci w godzinach opłaty mocowej — obniża tę opłatę.",
        gdzie: "Z planu pracy magazynu.",
        zakres: "Nie więcej niż energia przez magazyn.",
      },
      grupa: {
        nazwa: "Grupa taryfowa",
        cel: "Oszczędność na mocy umownej jest realna tylko w C2x (powyżej 40 kW) i przy przekroczeniach.",
        gdzie: "Na fakturze.",
        zakres: "C1x albo C2x.",
      },
      mocUmowna: {
        nazwa: "Oszczędność na mocy umownej i przekroczeniach [zł/rok]",
        cel: "Roczna oszczędność dzięki obniżeniu mocy umownej albo uniknięciu przekroczeń.",
        gdzie: "Z kalkulatora mocy umownej (ekran F4). Puste = nie liczymy.",
        zakres: "Wynik z ekranu F4.",
      },
    },
  },
}

const Z_KARTY_EN = "range from the datasheet — the app does not assume a typical value for you."
const Z_BMS_EN = "Reading from the BMS (manufacturer app, display or monitoring)."
const TWOJA_CENA_EN = "Your price — the app does not guess prices."

export const en: Tlumaczenie<typeof pl> = {
  "dobor-pojemnosci-baterii": {
    migawka: {
      oCoChodzi:
        "A battery is never 100% “usable” — part of the capacity is a buffer so as not to shorten its life with deep discharge. This screen calculates how much capacity to really buy.",
      jakDziala:
        "Daily demand × days of autonomy gives the energy the battery must deliver. The app divides it by inverter efficiency (losses converting DC to AC) and by DoD (allowed depth of discharge) — giving the capacity to buy.",
      poCo:
        "A battery bought “just enough” and discharged to zero quickly loses capacity. The right buffer means a longer storage life and a system that survives cloudy days.",
      fizyka: "C = (E_daily × d_autonomy) / (η_inverter × DoD).",
    },
    pola: {
      zapotrzebowanie: {
        nazwa: "Daily demand [kWh]",
        cel: "How much energy you use per day — the basis of the calculation.",
        gdzie: "From the load balance (Module 2) or from the meter/bill: annual use ÷ 365 (usually more in winter).",
        zakres: "Your data.",
      },
      dniAutonomii: {
        nazwa: "Days of autonomy [days]",
        cel: "How many days without sun the system must survive on the battery alone.",
        gdzie: "Your choice — Module 2, Screen 7 helps you set it.",
        zakres: "Slider in Module 2: 1 / 2 / 3 / 5 / 7 days.",
      },
      sprawnosc: {
        nazwa: "Inverter efficiency [%]",
        cel: "The inverter loses part of the energy converting DC to AC — the battery must cover it.",
        gdzie: "From the inverter datasheet (“efficiency”).",
        zakres: "Suggested start: {sprawnosc}% — enter the value from your datasheet.",
      },
      dod: {
        nazwa: "DoD — depth of discharge [%]",
        cel: "What part of the capacity may be used. The rest is a buffer protecting service life.",
        gdzie: "From the battery datasheet (cycles at a given DoD).",
        zakres: "For LiFePO4 typically {dodMin}–{dodMax}%.",
      },
    },
  },
  "napiecie-systemowe": {
    migawka: {
      oCoChodzi:
        "The system voltage (12, 24 or 48 V) is chosen from the largest single power draw, daily consumption and the application — not the BMS price. Higher voltage = less current for the same power = thinner, cheaper and safer cables.",
      jakDziala:
        "Stage A: context (where and what matters more). Stage B: load wizard — from power and run time the app calculates the peak and checks for a simultaneity conflict with the inverter. Recommendation: above {prog48} W — 48 V, below {prog12} W — 12 V, in between — 24 V. Then a comparison of cable cross-sections (Module 5 engine) and cost estimates of the variants.",
      poCo:
        "Changing the voltage after buying equipment is very expensive. Too low a voltage at high power means hundreds of amps, thick cables and a fire risk.",
      fizyka: "I = P / U. At 3000 W, 12 V carries 250 A, 48 V — about 63 A.",
    },
    pola: {
      obciazenie: {
        nazwa: "Peak load [W] (optional)",
        cel: "The largest power drawn at once. Overrides the sum from the load wizard.",
        gdzie: "From the load balance (Module 2) or the sum of the powers of devices running simultaneously.",
        zakres: "Above {prog48} W → 48 V, below {prog12} W → 12 V.",
      },
      zastosowanie: {
        nazwa: "System application",
        cel: "Camper, cabin, year-round house — the context affects the recommendation (e.g. availability of 12 V equipment in vehicles).",
        gdzie: "Your project.",
        zakres: "Options on the list.",
      },
      priorytet: {
        nazwa: "What matters more",
        cel: "Cost, future expansion or simplicity — decides borderline cases.",
        gdzie: "Your decision.",
        zakres: "Options on the list.",
      },
      ogrzewanie: {
        nazwa: "Peak electric heating power [W]",
        cel: "Heaters and heat pumps are usually the largest draw — they decide the voltage.",
        gdzie: "From the device nameplate. Skip it if you list them in the load wizard — don't count the same power twice.",
        zakres: Z_KARTY_EN,
      },
      wierszOdbiornika: {
        nazwa: "Load: power [W] and single run time",
        cel: "The power and run time of each ticked device. From them the app calculates the peak and checks whether the inverter can carry the loads running together.",
        gdzie: "Power from the device nameplate; run time — how many minutes or hours it runs at a time (e.g. kettle 3 min, washing machine 2 h).",
        zakres: Z_KARTY_EN,
      },
      mocFalownika: {
        nazwa: "Planned continuous inverter power [W] (optional)",
        cel: "To check for a simultaneity conflict: whether the inverter can carry the loads running at once.",
        gdzie: "From the inverter datasheet (continuous power).",
        zakres: Z_KARTY_EN,
      },
      dlugosc: {
        nazwa: "Cable route length (one way) [m]",
        cel: "To compare cable cross-sections for the 12/24/48 V variants.",
        gdzie: "From the battery to the inverter — along the route.",
        zakres: "Your installation.",
      },
      temperatura: {
        nazwa: "Cable ambient temperature [°C]",
        cel: "Lowers the cable's allowed current (HD 60364-5-52).",
        gdzie: "The highest expected along the route.",
        zakres: "Your conditions.",
      },
      material: {
        nazwa: "Conductor material",
        cel: "Copper or aluminium — different resistivity.",
        gdzie: "From the cable description.",
        zakres: "Cu or Al.",
      },
      ulozenie: {
        nazwa: "Cable installation method",
        cel: "Affects current-carrying capacity (standard table).",
        gdzie: "The worst section of the route.",
        zakres: "Options on the list.",
      },
      wiazka: {
        nazwa: "Number of cables in the bundle",
        cel: "Cables in a bundle heat each other.",
        gdzie: "Count the loaded conductors running together.",
        zakres: "Your installation.",
      },
      spadek: {
        nazwa: "Allowed voltage drop [%]",
        cel: "The cross-section condition for each voltage variant.",
        gdzie: "The default or the manufacturer's requirement.",
        zakres: "For DC usually {spadekDc}%.",
      },
      pojemnoscBanku: {
        nazwa: "Target energy capacity of the bank [kWh]",
        cel: "For the cost estimate of the variants: how many cells are needed at each voltage.",
        gdzie: "From the “Battery capacity sizing” screen.",
        zakres: "The Screen 1 result.",
      },
      linie24v: {
        nazwa: "Number of 24 V lighting lines (with a 48 V system)",
        cel: "Each 24 V line in a 48 V system needs a 48→24 V DC-DC converter — it is added to the estimate.",
        gdzie: "Your lighting design.",
        zakres: "Your installation.",
      },
      cenaSkladnika: {
        nazwa: "Price of a variant component [PLN]",
        cel: "The price of a cell, inverter, cables, fuse or converter for the variant estimates.",
        gdzie: "From shop offers.",
        zakres: TWOJA_CENA_EN,
      },
    },
  },
  "symulacja-ladowania-rozladowania": {
    migawka: {
      oCoChodzi:
        "Whether the battery and PV production are in sync with your consumption — whether it manages to charge during the day and survives until morning.",
      jakDziala:
        "The app calculates the full charge time from the PV charging power (net, after daytime use) and compares it with the length of the sunny window. Then it calculates how SoC falls at night at the average discharge power and warns when it drops below the threshold.",
      poCo: "A battery that doesn't fully charge during the day goes lower every day — and dies on the third night, not the first.",
      fizyka: "t_full = C × (100 − SoC_start)/100 ÷ P_charge; SoC_morning = SoC_evening − P_night × t_night ÷ C.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Usable battery capacity [kWh]",
        cel: "How much energy the battery holds after subtracting the buffer.",
        gdzie: "From the “Battery capacity sizing” screen or the datasheet (usable capacity).",
        zakres: Z_KARTY_EN,
      },
      socStart: {
        nazwa: "SoC at the start of the day [%]",
        cel: "State of charge in the morning, before the sun.",
        gdzie: Z_BMS_EN,
        zakres: "0–100%.",
      },
      mocLadowania: {
        nazwa: "Average PV charging power [kW]",
        cel: "Net — after subtracting daytime use. 0 = a day without sun.",
        gdzie: "From inverter monitoring or PV production (Module 3) minus daytime use.",
        zakres: "Your installation.",
      },
      oknoLadowania: {
        nazwa: "Charging window length [h]",
        cel: "How many hours a day the panels really charge the battery.",
        gdzie: "From the day length at your location (Module 1) — much shorter in winter.",
        zakres: "0–24 h.",
      },
      mocNoc: {
        nazwa: "Average night discharge power [kW]",
        cel: "What the loads draw at night — the SoC drop until morning is calculated from it.",
        gdzie: "From the night load profile (Module 2) or monitoring.",
        zakres: "Your data.",
      },
      progSoc: {
        nazwa: "SoC warning threshold [%]",
        cel: "Below this value the app warns that the battery is going too low.",
        gdzie: "Your choice, matched to the battery's DoD.",
        zakres: "Suggested start: {progSoc}%.",
      },
    },
  },
  "modul-ev": {
    migawka: {
      oCoChodzi:
        "An electric car is an extra load with a big appetite — it must be calculated separately, because it can eat the whole production surplus.",
      jakDziala:
        "The app compares the EV's daily demand with the PV surplus in summer and winter: shortfall = EV demand − surplus (not less than 0). It shows how much energy must come from another source in each season.",
      poCo: "In summer PV is usually enough for the car, in winter not. Without this calculation it is easy to drain the house storage charging the car.",
      fizyka: "shortfall_season = max(0, E_EV − surplus_PV,season).",
    },
    pola: {
      zapotrzebowanieEv: {
        nazwa: "Daily EV charging demand [kWh/day]",
        cel: "How much energy the car needs for a day of driving.",
        gdzie: "Daily distance × car consumption (kWh/100 km) ÷ 100, plus charging losses.",
        zakres: "Your car and route.",
      },
      nadwyzkaLato: {
        nazwa: "PV production surplus in summer [kWh/day]",
        cel: "How much energy is left in summer after covering the house's use.",
        gdzie: "From Module 3 (production) minus house use, or from monitoring.",
        zakres: "Your installation.",
      },
      nadwyzkaZima: {
        nazwa: "PV production surplus in winter [kWh/day]",
        cel: "How much energy is left in winter — usually very little.",
        gdzie: "From Module 3 for the winter months minus house use.",
        zakres: "Your installation.",
      },
    },
  },
  "grzalki-bms-mroz": {
    migawka: {
      oCoChodzi:
        "LiFePO4 must not be charged below freezing, so the BMS heats the cells. But there's no point heating from the battery if the sun will do it for free shortly.",
      jakDziala:
        "Below {progTemp} °C the heaters are needed. The app decides what powers them: with PV production — the sun; without PV and at SoC below {progSoc}% heating from the battery is suspended so as not to drain it.",
      poCo: "Heating from the battery at night at low SoC can drain the storage to zero — and in the morning it still can't be charged because it's too cold.",
    },
    pola: {
      temperatura: {
        nazwa: "Lowest expected temperature at the battery [°C]",
        cel: "Compared with the heater switch-on threshold.",
        gdzie: "The temperature where the storage stands. If it is in a heated room — enter the temperature there, not outdoors.",
        zakres: "Heater switch-on threshold: {progTemp} °C.",
      },
      soc: {
        nazwa: "Current battery SoC [%]",
        cel: "Below the threshold, without PV production, heating from the battery is suspended.",
        gdzie: Z_BMS_EN,
        zakres: "Threshold for suspending battery heating (no PV): {progSoc}%.",
      },
      pv: {
        nazwa: "PV production right now",
        cel: "Whether the heaters can run from the sun instead of the battery.",
        gdzie: "From inverter monitoring.",
        zakres: "Yes or no.",
      },
    },
  },
  "starzenie-degradacja": {
    migawka: {
      oCoChodzi:
        "You buy a battery not for today but for its whole life — you must add a margin right away for it getting weaker.",
      jakDziala:
        "From the capacity needed today, the annual capacity loss and the horizon, the app calculates the initial capacity that at the end of the horizon will still deliver the needed energy.",
      poCo: "A battery sized “for today” may have a quarter less capacity after 10 years — and stop being enough in winter.",
      fizyka: "C_initial = C_needed ÷ (1 − r × years).",
    },
    pola: {
      pojemnoscDzis: {
        nazwa: "Usable capacity needed today [kWh]",
        cel: "How much capacity you need now — the starting point.",
        gdzie: "From the “Battery capacity sizing” screen — the app fills it in automatically, you can override it.",
        zakres: "The Screen 1 result.",
      },
      horyzont: {
        nazwa: "Design horizon [years]",
        cel: "After how many years the battery must still be enough.",
        gdzie: "Your choice — usually the warranty period or the planned installation life.",
        zakres: "5, 10 or 15 years.",
      },
      degradacja: {
        nazwa: "Annual capacity loss [%]",
        cel: "By what percentage of capacity the battery loses each year.",
        gdzie: "From the datasheet (capacity warranty after N years/cycles).",
        zakres: "LiFePO4 typically {degMin}–{degMax}% per year.",
      },
    },
  },
  "obwod-precharge": {
    migawka: {
      oCoChodzi:
        "The inverter's capacitors behave like a short circuit at first — pre-charge gently “wakes” them with current through a resistor before you let full power in.",
      jakDziala:
        "From the inverter's input capacitance and the pre-charge resistor the app calculates the capacitor charging time (5 time constants) and the inrush current at the start.",
      poCo: "Without pre-charge, connecting the battery sparks, contacts burn and the BMS may shut down on a short circuit.",
      fizyka: "T = 5 · R · C; starting current I = U / R.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Inverter DC input capacitance [µF]",
        cel: "The larger it is, the longer charging through the resistor takes.",
        gdzie: "From the inverter datasheet (input capacitance) or the manufacturer.",
        zakres: Z_KARTY_EN,
      },
      rezystor: {
        nazwa: "Pre-charge resistor [Ω]",
        cel: "Limits the inrush current. Larger = smaller current but longer time.",
        gdzie: "Choose it to limit the inrush current (e.g. to a few amps); check its power rating too.",
        zakres: "Example from the source: {rezystor} Ω / 50 W.",
      },
    },
  },
  "slabe-ogniwo": {
    migawka: {
      oCoChodzi: "One weak cell limits the whole pack — like a brake in one carriage that stops the whole train.",
      jakDziala:
        "From the rated capacity and factory tolerance the app calculates the capacity of the weakest cell. In a series connection the pack has exactly that cell's capacity — balancing only partly evens it out.",
      poCo: "To know what the pack will really give and why matched cells and a good balancer matter.",
      fizyka: "C_weakest = C_rated × (1 − tolerance).",
    },
    pola: {
      pojemnosc: {
        nazwa: "Cell rated capacity [Ah]",
        cel: "The starting point for calculating the weakest cell's capacity.",
        gdzie: "From the cell datasheet.",
        zakres: Z_KARTY_EN,
      },
      tolerancja: {
        nazwa: "Factory tolerance [%]",
        cel: "How far a single cell's capacity may deviate from rated.",
        gdzie: "From the cell datasheet or the seller's matching report.",
        zakres: "Default ±{tolerancja}% per the source.",
      },
    },
  },
  "detekcja-zwarcia-efuse": {
    migawka: {
      oCoChodzi:
        "An ordinary fuse clears a short circuit in about 10 ms — an electronic e-Fuse in under 100 µs. At very high currents this difference decides whether the BMS transistors survive.",
      jakDziala:
        "The app calculates the battery short-circuit current (voltage ÷ internal resistance) and compares it with the switching capacity of the BMS transistors. When the short-circuit current exceeds it, the BMS may fail to interrupt the short — a fast fuse is needed in front of it.",
      poCo: "A BMS is not a fuse. At a short circuit of thousands of amps the transistors can weld in the conducting state.",
      fizyka: "I_sc = U / R_int.",
    },
    pola: {
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "The short-circuit current is calculated from voltage and internal resistance.",
        gdzie: "The pack's nominal voltage.",
        zakres: "Typically 12, 24 or 48 V.",
      },
      rezystancja: {
        nazwa: "Pack internal resistance [Ω]",
        cel: "The smaller it is, the larger the short-circuit current.",
        gdzie: "From a measurement or the cell datasheet (sum for a series connection).",
        zakres: Z_KARTY_EN,
      },
      zdolnoscBms: {
        nazwa: "BMS transistor switching capacity [A]",
        cel: "The largest current the BMS can safely interrupt.",
        gdzie: "From the BMS datasheet.",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "ochrona-wilgoc": {
    migawka: {
      oCoChodzi: "A wet BMS and copper busbars are a ready recipe for a short circuit — condensation is a silent killer of electronics.",
      jakDziala:
        "From air temperature and humidity the app calculates the dew point (Magnus-Tetens equation). If the enclosure or cells are colder than the dew point, water condenses on them. It also checks the enclosure's IP rating (at least IP{minIp} in damp places).",
      poCo: "At night the enclosure cools faster than the air — in the morning dew appears on the electronics, even in a “dry” garage.",
      fizyka: "Dew point: T_d = b·α / (a − α), α = a·T/(b + T) + ln(RH/100); a = 17.27, b = 237.7 °C.",
    },
    pola: {
      temperatura: {
        nazwa: "Ambient temperature [°C]",
        cel: "Together with humidity it determines the dew point.",
        gdzie: "A thermometer in the storage room.",
        zakres: "Your conditions.",
      },
      wilgotnosc: {
        nazwa: "Relative humidity [%]",
        cel: "The higher it is, the higher the dew point — condensation is easier.",
        gdzie: "A hygrometer in the storage room.",
        zakres: "0–100%.",
      },
      temperaturaObudowy: {
        nazwa: "Enclosure / cell temperature [°C]",
        cel: "If it is below the dew point, water condenses on the enclosure.",
        gdzie: "Measured or expected — at night it can be lower than ambient (radiative cooling).",
        zakres: "Your conditions.",
      },
      ip: {
        nazwa: "Enclosure protection rating (IP)",
        cel: "Protects against dust (first digit) and water (second).",
        gdzie: "From the enclosure plate or datasheet.",
        zakres: "In a damp place at least IP{minIp}.",
      },
    },
  },
  "moment-dokrecania-srub": {
    migawka: {
      oCoChodzi:
        "A bolt is a spring — you must tighten it exactly as much as needed to clamp the cable lug, not a bit more.",
      jakDziala: "You choose the cell type and capacity — the app gives the terminal tightening torque from the source.",
      poCo: "Too loose — the joint sparks and heats up. Too tight — the thread in the cell's aluminium terminal breaks, often the end of the cell.",
    },
    pola: {
      typ: {
        nazwa: "Cell type / capacity",
        cel: "The right torque depends on the terminal type (thread, material).",
        gdzie: "From the cell datasheet.",
        zakres: "Options on the list.",
      },
    },
  },
  "cold-c-rate": {
    migawka: {
      oCoChodzi:
        "In the cold lithium ions move more slowly — charging too fast permanently damages cells (lithium plating).",
      jakDziala:
        "The app sets the allowed charging current from the cell temperature: below {blokada} °C charging is blocked, from {blokada} to {limit02} °C at most {cZimno}C, from {limit02} to {luka} °C at most {cChlodno}C, from {pelny} °C full current. The {luka}–{pelny} °C range is not guessed — the source doesn't describe it.",
      poCo: "Damage from charging in frost is irreversible and not visible right away — capacity falls with every such cycle.",
    },
    pola: {
      temperatura: {
        nazwa: "Cell temperature [°C]",
        cel: "The allowed charging current depends on it.",
        gdzie: "Live reading from the BMS (sensor on the cells). 0 °C is a valid reading.",
        zakres: "Blocked below {blokada} °C; full current from {pelny} °C.",
      },
      pojemnosc: {
        nazwa: "Pack capacity [Ah]",
        cel: "Converts the C-rate limit into amps: I = C-rate × capacity.",
        gdzie: "From the pack datasheet.",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "koniec-ladowania": {
    migawka: {
      oCoChodzi:
        "Like filling a bottle — the pressure is there, but you must wait a moment for the water to reach the very end. Charging ends when the current falls at the absorption voltage.",
      jakDziala:
        "The app calculates the tail current: C threshold × capacity. It compares it with the present current at the absorption voltage — when the current falls below the threshold, the battery is full and charging can end.",
      poCo: "Ending charging too early means an undercharged battery and a wrong SoC; too late — needlessly holding the cells at high voltage.",
      fizyka: "I_tail = C threshold × C_Ah.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Battery capacity [Ah]",
        cel: "Converts the C threshold into amps.",
        gdzie: "From the battery datasheet.",
        zakres: Z_KARTY_EN,
      },
      napiecieAbsorpcji: {
        nazwa: "Absorption voltage [V]",
        cel: "The voltage at which the controller holds the battery at the end of charging.",
        gdzie: "From the controller/charger settings or the battery datasheet.",
        zakres: Z_KARTY_EN,
      },
      progKoncowy: {
        nazwa: "Tail current threshold [C]",
        cel: "At what current (as a fraction of capacity) to consider the battery full.",
        gdzie: "From the battery datasheet or the controller manufacturer's recommendation.",
        zakres: "Example from the source: {progC}C.",
      },
      prad: {
        nazwa: "Present charging current [A]",
        cel: "Compared with the tail current.",
        gdzie: Z_BMS_EN,
        zakres: "Live reading.",
      },
      napiecie: {
        nazwa: "Present voltage [V]",
        cel: "Checks whether the battery is already at the absorption voltage.",
        gdzie: Z_BMS_EN,
        zakres: "Live reading.",
      },
    },
  },
  "soh-per-ogniwo": {
    migawka: {
      oCoChodzi:
        "The rising resistance of one cell is like a clogged vessel — the rest of the pack must work harder to compensate.",
      jakDziala: "The app compares the cell's present internal resistance with the factory value. A rise of {progWzrostu}% or more means a critical cell.",
      poCo: "A weak cell heats more, ages faster and is the first to shut down the whole pack — better to replace it early.",
      fizyka: "rise % = (R_present − R_factory) / R_factory × 100.",
    },
    pola: {
      rFabryczna: {
        nazwa: "Factory internal resistance [mΩ]",
        cel: "The reference — the resistance of a new cell.",
        gdzie: "From the cell datasheet or the first measurement after purchase.",
        zakres: Z_KARTY_EN,
      },
      rAktualna: {
        nazwa: "Present internal resistance [mΩ]",
        cel: "Compared with the factory value.",
        gdzie: "From a measurement with an internal resistance tester (AC 1 kHz method).",
        zakres: "A rise from {progWzrostu}% — critical.",
      },
    },
  },
  "cold-cranking-amps": {
    migawka: {
      oCoChodzi:
        "A cold battery is lazy chemistry — it momentarily can't keep up with the starting current, even with plenty of energy. The voltage sags so much that the inverter shuts down.",
      jakDziala:
        "The app calculates the voltage sag at start-up: no-load voltage − starting current × internal resistance (measured cold), and compares it with the inverter's minimum operating voltage.",
      poCo: "A deep-well pump or compressor that starts easily in summer may shut the inverter down at every start in winter.",
      fizyka: "V_sag = V_oc − I_start × R_int.",
    },
    pola: {
      napiecie: {
        nazwa: "Pack no-load voltage [V]",
        cel: "The starting point for calculating the sag.",
        gdzie: "Measure at the terminals without load or read from the BMS.",
        zakres: "Your pack.",
      },
      pradRozruchu: {
        nazwa: "Load starting current [A]",
        cel: "The momentary current at motor start — several times the running current.",
        gdzie: "From the device datasheet (e.g. deep-well pump starting current) on the inverter's DC side.",
        zakres: Z_KARTY_EN,
      },
      rezystancja: {
        nazwa: "Pack internal resistance [mΩ]",
        cel: "It rises in winter — and causes the voltage sag.",
        gdzie: "Measured at the present (cold) cell temperature with a resistance tester.",
        zakres: "Cold measurement.",
      },
      minFalownika: {
        nazwa: "Inverter minimum operating voltage [V]",
        cel: "Below it the inverter shuts down.",
        gdzie: "From the inverter datasheet (low voltage cut-off / min. DC input).",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "long-term-storage": {
    migawka: {
      oCoChodzi:
        "A battery put away for a long time likes to be neither drained nor overfilled — and frost below a certain limit damages cells even without charging.",
      jakDziala: "The app checks the SoC before storage (recommended {socMin}–{socMax}%) and the lowest storage temperature (safe minimum {tMin} °C).",
      poCo: "A full battery stored for months ages faster; an empty one may self-discharge below the BMS threshold. Frost below the minimum damages the electrolyte.",
    },
    pola: {
      soc: {
        nazwa: "Target SoC before storage [%]",
        cel: "The state of charge for the storage period.",
        gdzie: "Charge/discharge to this value before disconnecting.",
        zakres: "Recommended range: {socMin}–{socMax}%.",
      },
      temperatura: {
        nazwa: "Lowest expected storage temperature [°C]",
        cel: "Compared with the safe minimum.",
        gdzie: "The coldest night at the storage place.",
        zakres: "Safe minimum: {tMin} °C.",
      },
    },
  },
  "second-life": {
    migawka: {
      oCoChodzi:
        "A battery from a dismantled electric car can be a great deal or an expensive disappointment — depending on its real condition, not the declared one.",
      jakDziala:
        "The app estimates the state of health (SoH) from age ({degRok}% per year) or mileage ({degKm}% per 10,000 km), calculates the real capacity and cost per kWh, and optionally compares with a new LiFePO4 battery.",
      poCo: "The price per “declared kWh” is misleading — what counts is the cost of a really usable kWh.",
      fizyka: "SoH = 100% − degradation; C_usable = C_declared × SoH; cost_kWh = price ÷ C_usable.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Declared capacity [kWh]",
        cel: "The capacity stated by the seller — the starting point.",
        gdzie: "From the listing or the module plate.",
        zakres: "The seller's declaration.",
      },
      cena: {
        nazwa: "Purchase price [PLN]",
        cel: "Divided by the real capacity it gives the cost per kWh.",
        gdzie: "From the offer.",
        zakres: TWOJA_CENA_EN,
      },
      metoda: {
        nazwa: "SoH estimation method",
        cel: "From battery age or vehicle mileage — depending on what you know.",
        gdzie: "Choose the information available.",
        zakres: "Age or mileage.",
      },
      wiek: {
        nazwa: "Battery age [years]",
        cel: "From age the app estimates the capacity loss.",
        gdzie: "From the vehicle documents or the module's production date.",
        zakres: "Assumed degradation: {degRok}% per year.",
      },
      przebieg: {
        nazwa: "Vehicle mileage [km]",
        cel: "From mileage the app estimates the capacity loss.",
        gdzie: "From the vehicle documents.",
        zakres: "Assumed degradation: {degKm}% per 10,000 km.",
      },
      cenaNowej: {
        nazwa: "New LiFePO4 battery price [PLN/kWh] (optional)",
        cel: "For comparison — whether the used one pays off.",
        gdzie: "From current offers.",
        zakres: TWOJA_CENA_EN,
      },
    },
  },
  "mixing-rownolegle": {
    migawka: {
      oCoChodzi:
        "Connecting different batteries in parallel is like harnessing a draught horse and a pony to one cart — one pulls more and wears out faster.",
      jakDziala:
        "The app checks chemistry compatibility and calculates the equalising current at connection: voltage difference ÷ sum of resistances. A voltage difference above {progRoznicy} V is a warning.",
      poCo: "A large equalising current at the moment of connection can damage connectors and the BMS; different chemistries have different charging voltages — one will always be over- or undercharged.",
      fizyka: "I_eq = ΔU / (R₁ + R₂).",
    },
    pola: {
      chemia: {
        nazwa: "Cell chemistry",
        cel: "Different chemistries have different operating and charging voltages — mixing them is risky.",
        gdzie: "From the battery datasheet.",
        zakres: "Options on the list.",
      },
      napiecie: {
        nazwa: "Nominal voltage [V]",
        cel: "The voltage difference drives the equalising current.",
        gdzie: "Measure both batteries' voltage just before connecting.",
        zakres: "A difference above {progRoznicy} V — warning.",
      },
      rezystancja: {
        nazwa: "Internal resistance [mΩ]",
        cel: "Limits the equalising current.",
        gdzie: "From a measurement or the battery datasheet.",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "vehicle-to-home": {
    migawka: {
      oCoChodzi:
        "A car can be a power bank on wheels, but that wears its traction battery — worth calculating whether it pays off.",
      jakDziala:
        "The app calculates the really available energy (capacity − driving reserve, × efficiency) and the battery wear cost per kWh: replacement price ÷ (capacity × cycles × efficiency).",
      poCo: "If the car battery's wear cost per kWh is higher than a kWh from the grid or a generator, V2H is only for emergencies.",
      fizyka: "C_real = (C_EV − reserve) × η; cost_kWh = replacement_price ÷ (C_EV × cycles × η).",
    },
    pola: {
      pojemnosc: {
        nazwa: "EV traction battery capacity [kWh]",
        cel: "The total energy in the car battery.",
        gdzie: "From the car's technical data (net capacity).",
        zakres: "Car data.",
      },
      rezerwa: {
        nazwa: "Driving reserve [kWh]",
        cel: "Energy you won't give to the house — so you can still drive.",
        gdzie: "Your needs: longest sudden trip × car consumption.",
        zakres: "Your choice.",
      },
      sprawnosc: {
        nazwa: "Effective efficiency [%]",
        cel: "Losses when delivering energy to the house and degradation.",
        gdzie: "From the bidirectional charger or car manufacturer data.",
        zakres: "0–100%.",
      },
      kosztWymiany: {
        nazwa: "Traction battery replacement cost [PLN]",
        cel: "For calculating the wear cost per kWh.",
        gdzie: "From the service or the manufacturer's price list.",
        zakres: TWOJA_CENA_EN,
      },
      cykle: {
        nazwa: "Traction battery cycle life",
        cel: "Over how many full cycles the replacement cost is spread.",
        gdzie: "From the manufacturer or the battery warranty.",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "komunikacja-bms": {
    migawka: {
      oCoChodzi:
        "The BMS and inverter must “speak the same language” — without it the inverter doesn't know how much battery it really has and must guess from voltage.",
      jakDziala: "You choose the BMS and inverter protocol (CAN, RS485, Modbus…). The app checks compatibility and warns when they won't understand each other.",
      poCo: "Without communication the inverter charges based on voltage — protecting the cells worse and showing SoC poorly.",
    },
    pola: {
      protokolBms: {
        nazwa: "BMS protocol",
        cel: "How the BMS passes data (SoC, current limits, alarms).",
        gdzie: "From the BMS datasheet or battery manual.",
        zakres: "Options on the list.",
      },
      protokolFalownika: {
        nazwa: "Inverter / charger protocol",
        cel: "Which protocol the inverter expects.",
        gdzie: "From the inverter manual — list of supported BMS.",
        zakres: "Options on the list.",
      },
    },
  },
  "pozycjonowanie-ogniw": {
    migawka: {
      oCoChodzi:
        "Prismatic cells like to be held firmly but not as in a vice — they need a little room for natural “breathing” during operation.",
      jakDziala: "The app compares the applied compression with the recommended range for prismatic cells.",
      poCo: "Too little compression — cells swell and age faster; too much — damage to the casing and electrodes.",
    },
    pola: {
      docisk: {
        nazwa: "Applied pack compression [kgf]",
        cel: "The force squeezing the cells in the pack.",
        gdzie: "From the enclosure/clamp design or a measurement (e.g. torque of the tie rods).",
        zakres: "Recommended range for prismatic cells: {dociskMin}–{dociskMax} kgf.",
      },
    },
  },
  "pobor-wlasny-bms": {
    migawka: {
      oCoChodzi:
        "A BMS is also a power consumer, even when it “does nothing” — in small off-grid systems this constant draw can be a surprisingly large part of the balance.",
      jakDziala: "The app calculates the annual self-consumption energy in continuous operation and in sleep: power × 24 h × 365 days.",
      poCo: "A few watts all day is tens of kWh a year — and the reason a stored battery discharges by itself.",
      fizyka: "E_year = P × 24 × 365 / 1000 [kWh].",
    },
    pola: {
      ciagle: {
        nazwa: "Draw in continuous operation [W]",
        cel: "The BMS draw during normal operation.",
        gdzie: "From the BMS datasheet (self-consumption).",
        zakres: "Typically {ciagleMin}–{ciagleMax} W.",
      },
      uspienie: {
        nazwa: "Draw in sleep mode (deep sleep) [W]",
        cel: "The BMS draw in sleep — important when storing the battery.",
        gdzie: "From the BMS datasheet.",
        zakres: "Typically {uspienieMin}–{uspienieMax} W.",
      },
    },
  },
  "oplacalnosc-magazynu": {
    migawka: {
      oCoChodzi:
        "A battery is an energy piggy bank, but it costs money too — only the cost of each delivered kWh shows whether the storage pays off.",
      jakDziala: "Cost of 1 kWh from storage = price ÷ (usable capacity × number of cycles × efficiency). Optionally the app compares it with the cost of a kWh from an alternative (generator, grid).",
      poCo: "If a kWh from storage costs more than from the grid, the storage doesn't earn by shifting energy — it makes sense only for independence.",
      fizyka: "cost_kWh = price ÷ (C × cycles × η).",
    },
    pola: {
      cena: {
        nazwa: "Battery price [PLN]",
        cel: "The storage investment.",
        gdzie: "From the offer (with installation, if you want the full cost).",
        zakres: TWOJA_CENA_EN,
      },
      pojemnosc: {
        nazwa: "Usable capacity [kWh]",
        cel: "The energy delivered in one cycle.",
        gdzie: "From the datasheet (usable capacity).",
        zakres: Z_KARTY_EN,
      },
      cykle: {
        nazwa: "Cycle life at the chosen DoD",
        cel: "Over how many cycles the cost is spread.",
        gdzie: "From the datasheet or Screen 30 (Technology comparison).",
        zakres: Z_KARTY_EN,
      },
      sprawnosc: {
        nazwa: "Storage efficiency [%]",
        cel: "Charging and discharging losses.",
        gdzie: "From the datasheet (round-trip efficiency).",
        zakres: "0–100%.",
      },
      alternatywa: {
        nazwa: "Alternative cost [PLN/kWh] (optional)",
        cel: "The cost of a kWh from a generator or the grid — for comparison.",
        gdzie: "From the bill or the generator screen. Empty = storage cost only.",
        zakres: "Your value.",
      },
    },
  },
  "szyny-zbiorcze-miedzypakietowe": {
    migawka: {
      oCoChodzi:
        "Current, like everything lazy, flows where it's easiest — unequal cable lengths or asymmetric connection always load the packs unevenly.",
      jakDziala: "The app calculates the current split between branches: each branch gets a current inversely proportional to its resistance (conductor length and cross-section).",
      poCo: "The pack on the shorter cable works harder and wears faster. Equal lengths and symmetric (diagonal) connection are an almost free improvement.",
      fizyka: "I_i = I_total × (1/R_i) ÷ Σ(1/R_j); R_i = ρ × 2L_i / A_i.",
    },
    pola: {
      pradCalkowity: {
        nazwa: "Total current [A]",
        cel: "The current splitting between the pack branches.",
        gdzie: "The maximum inverter or charger current on the DC side.",
        zakres: Z_KARTY_EN,
      },
      material: {
        nazwa: "Conductor material",
        cel: "Copper or aluminium — different resistivity.",
        gdzie: "From the cable description.",
        zakres: "Cu or Al.",
      },
      dlugosc: {
        nazwa: "Length of the run to the common busbar [m]",
        cel: "Longer run = higher resistance = less current in this branch.",
        gdzie: "Measure the conductor from the pack to the busbar.",
        zakres: "Your installation.",
      },
      przekroj: {
        nazwa: "Conductor cross-section [mm²]",
        cel: "Larger cross-section = lower resistance.",
        gdzie: "From the conductor insulation.",
        zakres: "Standard sizes.",
      },
    },
  },
  "topologia-bms": {
    migawka: {
      oCoChodzi:
        "If you have one pipe for water and sewage, it eventually clogs — sometimes it's better to separate the charging and discharging paths (Separate Port).",
      jakDziala: "The app compares the BMS Common Port rated current with the inverter's peak starting current. When the start exceeds it, the BMS may shut down at start-up.",
      poCo: "A BMS sized only for the nominal current shuts down when the inverter starts a motor — the whole house goes dark when the pump starts.",
    },
    pola: {
      pradCommon: {
        nazwa: "BMS Common Port rated current [A]",
        cel: "The largest current the shared charge/discharge port will pass.",
        gdzie: "From the BMS datasheet.",
        zakres: Z_KARTY_EN,
      },
      pradRozruchu: {
        nazwa: "Inverter peak starting current [A]",
        cel: "The momentary current drawn by the inverter when starting large loads.",
        gdzie: "From the inverter datasheet — the starting current is often much higher than nominal.",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "dobor-bezpiecznika-dc": {
    migawka: {
      oCoChodzi:
        "A fuse must be able to extinguish an electric arc, not just blow — one with the wrong AIC becomes an arc source itself.",
      jakDziala: "The app calculates the battery short-circuit current (voltage ÷ internal resistance) and compares it with the fuse's breaking capacity (AIC). For LiFePO4 the minimum is {minAic} A.",
      poCo: "LiFePO4 batteries have very low resistance — in a short circuit they give thousands of amps. An ordinary car fuse won't interrupt that.",
      fizyka: "I_sc = U / R_int.",
    },
    pola: {
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "The short-circuit current is calculated from voltage and internal resistance.",
        gdzie: "The pack's nominal voltage.",
        zakres: "Typically 12, 24 or 48 V.",
      },
      rezystancja: {
        nazwa: "Pack internal resistance [Ω]",
        cel: "The smaller it is, the larger the short-circuit current.",
        gdzie: "From a measurement or the cell datasheet.",
        zakres: Z_KARTY_EN,
      },
      aic: {
        nazwa: "AIC of the chosen fuse [A]",
        cel: "Breaking capacity — it must exceed the short-circuit current.",
        gdzie: "From the fuse datasheet (breaking capacity).",
        zakres: "For LiFePO4 at least {minAic} A.",
      },
    },
  },
  "chlodzenie-latem": {
    migawka: {
      oCoChodzi: "A battery is not an oven — high temperature not only lowers performance temporarily but permanently speeds up cell ageing.",
      jakDziala: "The app compares the cell temperature with the operating range {tMin}–{tMax} °C and suggests cooling (ventilation, shade, insulation).",
      poCo: "Every few degrees above the optimum shortens cell life. Storage in an attic or a sunlit container ages much faster.",
    },
    pola: {
      temperatura: {
        nazwa: "Cell temperature [°C]",
        cel: "Compared with the allowed operating range.",
        gdzie: Z_BMS_EN,
        zakres: "Allowed operating range: {tMin}–{tMax} °C.",
      },
    },
  },
  "kalibracja-soc": {
    migawka: {
      oCoChodzi:
        "Counting current in a BMS is a constant estimate, not an exact measurement — now and then it must be “reset” with a full charge so the error doesn't accumulate.",
      jakDziala: "The app checks how many days have passed since the last full charge. After {progDni} days it recommends calibration.",
      poCo: "With a drifted SoC the system may cut off loads too early or discharge the battery below the safe threshold.",
    },
    pola: {
      dni: {
        nazwa: "Days since the last full charge [days]",
        cel: "The longer, the larger the accumulated SoC error.",
        gdzie: "From the BMS history or your memory. 0 = there was a full charge today.",
        zakres: "Calibration recommendation threshold: {progDni} days.",
      },
    },
  },
  "detekcja-doziemienia": {
    migawka: {
      oCoChodzi:
        "Direct current holds an electric shock victim more firmly than alternating — the muscles can't “let go”. That's why earth fault detection in DC is so important.",
      jakDziala: "A checklist: an insulation monitor (IMD) and a DC residual current device. Missing protection is a warning or a red stop depending on the system.",
      poCo: "Damaged insulation of a DC conductor can stay invisible for years — until someone touches the structure.",
    },
    pola: {},
  },
  "matryca-alarmow-bms": {
    migawka: {
      oCoChodzi:
        "The system defends itself — your job is to understand the message and remove the cause, not just clear the alarm. The table shows what the BMS does automatically in each alarm state.",
      jakDziala: "For each alarm (over-voltage, under-voltage, temperature, current…) the table shows the BMS and system reaction and a sample message for the user.",
      poCo: "To know why the system shut down and what to do — before you start looking for a fault blindly.",
    },
    pola: {},
  },
  "porownanie-technologii-magazynow": {
    migawka: {
      oCoChodzi:
        "The purchase price is not the same as the lifetime cost — you must add weight (floor structure), maintenance and the real number of cycles.",
      jakDziala: "The table compares storage technologies: lifetime energy delivered (capacity × cycles × DoD), weight, maintenance. Optionally it scales to the planned capacity.",
      poCo: "A lead-acid battery cheaper at the start can cost several times more per kWh over its life than LiFePO4.",
      fizyka: "E_total = capacity × cycles × DoD.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Planned storage capacity [kWh] (optional)",
        cel: "Scales the table (weight, cost) to your storage size.",
        gdzie: "From the “Battery capacity sizing” screen.",
        zakres: "The Screen 1 result.",
      },
    },
  },
  "napiecie-odciecia-a-zywotnosc": {
    migawka: {
      oCoChodzi:
        "Don't squeeze the battery to the last drop — a higher cut-off voltage (a small reserve) radically extends its life at the cost of a small part of the available capacity.",
      jakDziala:
        "From the cut-off voltage and number of cells the app calculates the voltage per cell and, from the source's calibration points, the approximate DoD and number of cycles (linear interpolation between {vMin} V/cell ≈ 100% DoD and {vMax} V/cell ≈ 80% DoD).",
      poCo: "Raising the cut-off by a few tenths of a volt can double the number of cycles — and extend the storage life by years.",
    },
    pola: {
      napiecie: {
        nazwa: "Cut-off voltage [V]",
        cel: "The pack voltage at which the inverter/BMS stops discharging the battery.",
        gdzie: "From the inverter or BMS settings (low voltage cut-off).",
        zakres: "Your settings.",
      },
      ogniwa: {
        nazwa: "Number of cells in series (S)",
        cel: "Divides the pack voltage into the voltage of one cell.",
        gdzie: "From the pack description (e.g. 16S).",
        zakres: "A typical 48 V LiFePO4 pack is 16S — suggested value: {ogniwa}.",
      },
    },
  },
  "hierarchia-ladowania": {
    migawka: {
      oCoChodzi: "A smart system waits for free fuel from the sun instead of reaching for an expensive generator right away.",
      jakDziala: "Order of sources: PV always first, the generator only below the critical SoC threshold, the grid (if present) last. The app shows which source charges at the present SoC.",
      poCo: "A generator started too early burns fuel for energy the sun would give an hour later.",
    },
    pola: {
      soc: {
        nazwa: "Current battery SoC [%]",
        cel: "Compared with the critical threshold.",
        gdzie: Z_BMS_EN,
        zakres: "0–100%.",
      },
      progKrytyczny: {
        nazwa: "Critical SoC threshold [%]",
        cel: "Below this value the generator is considered.",
        gdzie: "Your decision — match it to the battery DoD and the generator start-up time.",
        zakres: "No suggested value — safety data have no hidden default.",
      },
    },
  },
  "symulacja-miesiaca-zachmurzenia": {
    migawka: {
      oCoChodzi:
        "You design the system not for average weather but for the worst realistic week of the year — that is the essence of real off-grid.",
      jakDziala:
        "The app calculates day by day: production = nominal × cloud level; the daily deficit eats the battery until SoC reaches zero. It shows on which day the system dies and how much capacity is missing.",
      poCo: "Average annual production lies. A dozen days without sun in December is a real scenario — better to calculate it in advance.",
      fizyka: "ΔE_day = E_demand − E_production,nom × cloud % ÷ 100.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Usable battery capacity [kWh]",
        cel: "The energy reserve for the black scenario.",
        gdzie: "From the “Battery capacity sizing” screen.",
        zakres: "The Screen 1 result.",
      },
      socStart: {
        nazwa: "SoC at the start of the scenario [%]",
        cel: "The state of charge at which the series of cloudy days begins.",
        gdzie: "Usually a full battery (100%) — or the real state, if you test a worse case.",
        zakres: "0–100%.",
      },
      zapotrzebowanie: {
        nazwa: "Daily demand [kWh/day]",
        cel: "How much energy you use every day of the scenario.",
        gdzie: "From the load balance (Module 2) — winter use.",
        zakres: "Your data.",
      },
      produkcja: {
        nazwa: "Nominal daily PV production (sunny day) [kWh/day]",
        cel: "The starting point for production on a cloudy day.",
        gdzie: "From Module 3 for the scenario month.",
        zakres: "Your installation.",
      },
      zachmurzenie: {
        nazwa: "Cloud level [% of nominal production]",
        cel: "What percentage of nominal production remains on a cloudy day.",
        gdzie: "Your assumption about the worst week.",
        zakres: "The source suggests 5–10% for the black scenario — no single canonical value, set it deliberately.",
      },
      dni: {
        nazwa: "Number of scenario days [days]",
        cel: "How long the series of cloudy days lasts.",
        gdzie: "Your assumption.",
        zakres: "Suggested by the source: {dni} days.",
      },
    },
  },
  "magazyn-firmy": {
    migawka: {
      oCoChodzi:
        "Storage in a business earns in five ways, but not every one is available to your business. We compare each stream with the storage wear cost per kWh.",
      jakDziala:
        "The app calculates separately: self-consumption (energy × gain per kWh), price arbitrage (energy × price spread), capacity charge reduction (energy delivered on working days 7–22), contracted power savings (real only in C2x and with excesses) — and compares them with the cost of a kWh from storage from “Storage cost analysis” (Module 4). System services are practically unavailable to small storage without an aggregator — information only.",
      poCo: "A stream that costs more storage wear than it earns is loss-making — better to know before buying.",
    },
    pola: {
      energiaAutokonsumpcja: {
        nazwa: "Energy through storage [kWh/year]",
        cel: "How much energy per year the storage shifts in a given stream (self-consumption or arbitrage).",
        gdzie: "From the PV and storage balance (screen F6) or your storage operating plan.",
        zakres: "Your data.",
      },
      zyskKwh: {
        nazwa: "Gain per 1 kWh from self-consumption [PLN/kWh]",
        cel: "What you gain on each kWh used from storage instead of the grid.",
        gdzie: "Purchase price per kWh − value of an exported kWh, without the capacity charge.",
        zakres: "Your prices.",
      },
      roznicaCen: {
        nazwa: "Price spread for arbitrage [PLN/kWh]",
        cel: "The gain from buying at cheap hours and using at expensive ones.",
        gdzie: "Expensive − cheap hours in your tariff or dynamic contract, without the capacity charge.",
        zakres: "Your prices.",
      },
      energiaMocowa: {
        nazwa: "Energy from storage on working days 7:00–22:00 [kWh/year]",
        cel: "Energy you won't draw from the grid during capacity charge hours — lowers that charge.",
        gdzie: "From the storage operating plan.",
        zakres: "No more than the energy through storage.",
      },
      grupa: {
        nazwa: "Tariff group",
        cel: "Contracted power savings are real only in C2x (above 40 kW) and with excesses.",
        gdzie: "On the invoice.",
        zakres: "C1x or C2x.",
      },
      mocUmowna: {
        nazwa: "Contracted power and excess savings [PLN/year]",
        cel: "Annual saving from lowering contracted power or avoiding excesses.",
        gdzie: "From the contracted power calculator (screen F4). Empty = not counted.",
        zakres: "The screen F4 result.",
      },
    },
  },
}

const Z_KARTY_RU = "диапазон из технической документации — приложение не подставляет типовое значение за вас."
const Z_BMS_RU = "Показание BMS (приложение производителя, дисплей или мониторинг)."
const TWOJA_CENA_RU = "Ваша цена — приложение не угадывает цены."

export const ru: Tlumaczenie<typeof pl> = {
  "dobor-pojemnosci-baterii": {
    migawka: {
      oCoChodzi:
        "Батарея никогда не бывает «полезной» на 100% — часть ёмкости служит буфером, чтобы не сокращать срок службы глубоким разрядом. Этот экран считает, сколько ёмкости реально покупать.",
      jakDziala:
        "Суточная потребность × дни автономии дают энергию, которую должна отдать батарея. Приложение делит её на КПД инвертора (потери при преобразовании DC в AC) и на DoD (допустимую глубину разряда) — получается ёмкость к покупке.",
      poCo:
        "Батарея, купленная «впритык» и разряжаемая до нуля, быстро теряет ёмкость. Правильный буфер — это более долгая жизнь накопителя и система, которая переживёт пасмурные дни.",
      fizyka: "C = (E_сут × d_автономии) / (η_инвертора × DoD).",
    },
    pola: {
      zapotrzebowanie: {
        nazwa: "Суточная потребность [кВт·ч]",
        cel: "Сколько энергии вы расходуете за сутки — основа расчёта.",
        gdzie: "Из баланса нагрузок (Модуль 2) или по счётчику/счёту: годовое потребление ÷ 365 (зимой обычно больше).",
        zakres: "Ваши данные.",
      },
      dniAutonomii: {
        nazwa: "Дни автономии [дней]",
        cel: "Сколько дней без солнца система должна продержаться только на батарее.",
        gdzie: "Ваш выбор — Модуль 2, Экран 7 помогает его определить.",
        zakres: "Ползунок в Модуле 2: 1 / 2 / 3 / 5 / 7 дней.",
      },
      sprawnosc: {
        nazwa: "КПД инвертора [%]",
        cel: "Инвертор теряет часть энергии при преобразовании DC в AC — батарея должна это покрыть.",
        gdzie: "Из документации инвертора («efficiency»).",
        zakres: "Предлагаемое начальное значение: {sprawnosc}% — введите значение из своей документации.",
      },
      dod: {
        nazwa: "DoD — глубина разряда [%]",
        cel: "Какую часть ёмкости можно использовать. Остальное — буфер, защищающий срок службы.",
        gdzie: "Из документации батареи (циклы при данном DoD).",
        zakres: "Для LiFePO4 обычно {dodMin}–{dodMax}%.",
      },
    },
  },
  "napiecie-systemowe": {
    migawka: {
      oCoChodzi:
        "Напряжение системы (12, 24 или 48 В) выбирают по наибольшей разовой потребляемой мощности, суточному потреблению и назначению — а не по цене BMS. Выше напряжение = меньше ток при той же мощности = тоньше, дешевле и безопаснее кабели.",
      jakDziala:
        "Этап A: контекст (где и что важнее). Этап B: мастер потребителей — по мощности и времени работы приложение считает пик и проверяет конфликт одновременности с инвертором. Рекомендация: выше {prog48} Вт — 48 В, ниже {prog12} Вт — 12 В, между — 24 В. Далее сравнение сечений кабеля (движок Модуля 5) и сметы вариантов.",
      poCo:
        "Сменить напряжение после покупки оборудования очень дорого. Слишком низкое напряжение при большой мощности — это сотни ампер, толстые кабели и риск пожара.",
      fizyka: "I = P / U. При 3000 Вт в 12 В течёт 250 А, в 48 В — около 63 А.",
    },
    pola: {
      obciazenie: {
        nazwa: "Пиковая нагрузка [Вт] (необязательно)",
        cel: "Наибольшая одновременно потребляемая мощность. Заменяет сумму из мастера потребителей.",
        gdzie: "Из баланса нагрузок (Модуль 2) или сумма мощностей одновременно работающих устройств.",
        zakres: "Выше {prog48} Вт → 48 В, ниже {prog12} Вт → 12 В.",
      },
      zastosowanie: {
        nazwa: "Назначение системы",
        cel: "Автодом, домик, круглогодичный дом — контекст влияет на рекомендацию (например, доступность оборудования 12 В в транспорте).",
        gdzie: "Ваш проект.",
        zakres: "Варианты из списка.",
      },
      priorytet: {
        nazwa: "Что важнее",
        cel: "Стоимость, расширение в будущем или простота — решает в пограничных случаях.",
        gdzie: "Ваше решение.",
        zakres: "Варианты из списка.",
      },
      ogrzewanie: {
        nazwa: "Пиковая мощность электроотопления [Вт]",
        cel: "Нагреватели и тепловые насосы — обычно самое большое потребление; они определяют напряжение.",
        gdzie: "С таблички устройства. Пропустите, если распишете их в мастере потребителей, — не считайте одну и ту же мощность дважды.",
        zakres: Z_KARTY_RU,
      },
      wierszOdbiornika: {
        nazwa: "Потребитель: мощность [Вт] и время разовой работы",
        cel: "Мощность и время работы каждого отмеченного устройства. По ним приложение считает пик и проверяет, выдержит ли инвертор одновременно работающие потребители.",
        gdzie: "Мощность — с таблички; время работы — сколько минут или часов работает за раз (например, чайник 3 мин, стиральная машина 2 ч).",
        zakres: Z_KARTY_RU,
      },
      mocFalownika: {
        nazwa: "Планируемая длительная мощность инвертора [Вт] (необязательно)",
        cel: "Для проверки конфликта одновременности: выдержит ли инвертор потребители, работающие одновременно.",
        gdzie: "Из документации инвертора (длительная мощность).",
        zakres: Z_KARTY_RU,
      },
      dlugosc: {
        nazwa: "Длина трассы кабеля (в одну сторону) [м]",
        cel: "Для сравнения сечений кабеля для вариантов 12/24/48 В.",
        gdzie: "От батареи до инвертора — по трассе.",
        zakres: "Ваша установка.",
      },
      temperatura: {
        nazwa: "Температура окружающей среды кабеля [°C]",
        cel: "Снижает допустимый ток кабеля (HD 60364-5-52).",
        gdzie: "Наибольшая ожидаемая на трассе.",
        zakres: "Ваши условия.",
      },
      material: {
        nazwa: "Материал проводника",
        cel: "Медь или алюминий — разное удельное сопротивление.",
        gdzie: "Из описания кабеля.",
        zakres: "Cu или Al.",
      },
      ulozenie: {
        nazwa: "Способ прокладки кабеля",
        cel: "Влияет на допустимый ток (таблица стандарта).",
        gdzie: "Самый неблагоприятный участок трассы.",
        zakres: "Варианты из списка.",
      },
      wiazka: {
        nazwa: "Число кабелей в пучке",
        cel: "Кабели в пучке нагревают друг друга.",
        gdzie: "Посчитайте нагруженные проводники, идущие вместе.",
        zakres: "Ваша установка.",
      },
      spadek: {
        nazwa: "Допустимое падение напряжения [%]",
        cel: "Условие подбора сечения для каждого варианта напряжения.",
        gdzie: "Значение по умолчанию или требование производителя.",
        zakres: "Для DC обычно {spadekDc}%.",
      },
      pojemnoscBanku: {
        nazwa: "Целевая энергоёмкость банка [кВт·ч]",
        cel: "Для сметы вариантов: сколько элементов нужно при каждом напряжении.",
        gdzie: "С экрана «Подбор ёмкости батареи».",
        zakres: "Результат Экрана 1.",
      },
      linie24v: {
        nazwa: "Число линий освещения 24 В (при системе 48 В)",
        cel: "Каждая линия 24 В в системе 48 В требует преобразователя DC-DC 48→24 В — он добавляется в смету.",
        gdzie: "Ваш проект освещения.",
        zakres: "Ваша установка.",
      },
      cenaSkladnika: {
        nazwa: "Цена компонента варианта [зл]",
        cel: "Цена элемента, инвертора, проводов, предохранителя или преобразователя для смет вариантов.",
        gdzie: "Из предложений магазинов.",
        zakres: TWOJA_CENA_RU,
      },
    },
  },
  "symulacja-ladowania-rozladowania": {
    migawka: {
      oCoChodzi:
        "Синхронизированы ли батарея и выработка PV с вашим потреблением — успеет ли она зарядиться за день и продержится ли до утра.",
      jakDziala:
        "Приложение считает время полной зарядки по мощности зарядки от PV (нетто, после дневного потребления) и сравнивает с длиной солнечного окна. Затем считает, как упадёт SoC ночью при средней мощности разряда, и предупреждает, если он опустится ниже порога.",
      poCo: "Батарея, которая не заряжается днём до конца, с каждым днём опускается ниже — и садится на третью ночь, а не на первую.",
      fizyka: "t_полн = C × (100 − SoC_старт)/100 ÷ P_заряда; SoC_утро = SoC_вечер − P_ночь × t_ночь ÷ C.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Полезная ёмкость батареи [кВт·ч]",
        cel: "Сколько энергии вмещает батарея за вычетом буфера.",
        gdzie: "С экрана «Подбор ёмкости батареи» или из документации (usable capacity).",
        zakres: Z_KARTY_RU,
      },
      socStart: {
        nazwa: "SoC в начале дня [%]",
        cel: "Степень заряда утром, до солнца.",
        gdzie: Z_BMS_RU,
        zakres: "0–100%.",
      },
      mocLadowania: {
        nazwa: "Средняя мощность зарядки от PV [кВт]",
        cel: "Нетто — за вычетом дневного потребления. 0 = день без солнца.",
        gdzie: "Из мониторинга инвертора или выработка PV (Модуль 3) минус дневное потребление.",
        zakres: "Ваша установка.",
      },
      oknoLadowania: {
        nazwa: "Длина окна зарядки [ч]",
        cel: "Сколько часов в день панели реально заряжают батарею.",
        gdzie: "По длине дня в вашем месте (Модуль 1) — зимой намного короче.",
        zakres: "0–24 ч.",
      },
      mocNoc: {
        nazwa: "Средняя мощность разряда ночью [кВт]",
        cel: "Сколько потребители берут ночью — отсюда считается падение SoC к утру.",
        gdzie: "Из профиля ночной нагрузки (Модуль 2) или мониторинга.",
        zakres: "Ваши данные.",
      },
      progSoc: {
        nazwa: "Предупредительный порог SoC [%]",
        cel: "Ниже этого значения приложение предупреждает, что батарея опускается слишком низко.",
        gdzie: "Ваш выбор, согласованный с DoD батареи.",
        zakres: "Предлагаемое начальное значение: {progSoc}%.",
      },
    },
  },
  "modul-ev": {
    migawka: {
      oCoChodzi:
        "Электромобиль — дополнительный потребитель с большим аппетитом; его нужно считать отдельно, потому что он может съесть весь излишек выработки.",
      jakDziala:
        "Приложение сравнивает суточную потребность EV с излишком PV летом и зимой: нехватка = потребность EV − излишек (не меньше 0). Показывает, сколько энергии нужно взять из другого источника в каждом сезоне.",
      poCo: "Летом PV обычно хватает на машину, зимой — нет. Без этого расчёта легко разрядить домашний накопитель на зарядку авто.",
      fizyka: "нехватка_сезон = max(0, E_EV − излишек_PV,сезон).",
    },
    pola: {
      zapotrzebowanieEv: {
        nazwa: "Суточная потребность в зарядке EV [кВт·ч/сутки]",
        cel: "Сколько энергии машине нужно на день поездок.",
        gdzie: "Суточный пробег × расход авто (кВт·ч/100 км) ÷ 100 плюс потери зарядки.",
        zakres: "Ваше авто и маршрут.",
      },
      nadwyzkaLato: {
        nazwa: "Излишек выработки PV летом [кВт·ч/сутки]",
        cel: "Сколько энергии остаётся летом после покрытия потребления дома.",
        gdzie: "Из Модуля 3 (выработка) минус потребление дома или из мониторинга.",
        zakres: "Ваша установка.",
      },
      nadwyzkaZima: {
        nazwa: "Излишек выработки PV зимой [кВт·ч/сутки]",
        cel: "Сколько энергии остаётся зимой — обычно очень мало.",
        gdzie: "Из Модуля 3 для зимних месяцев минус потребление дома.",
        zakres: "Ваша установка.",
      },
    },
  },
  "grzalki-bms-mroz": {
    migawka: {
      oCoChodzi:
        "LiFePO4 нельзя заряжать на морозе, поэтому BMS греет элементы. Но нет смысла греть от батареи, если скоро солнце сделает это бесплатно.",
      jakDziala:
        "Ниже {progTemp} °C нагреватели нужны. Приложение решает, от чего их питать: при выработке PV — от солнца; без PV и при SoC ниже {progSoc}% нагрев от батареи приостанавливается, чтобы её не исчерпать.",
      poCo: "Нагрев от батареи ночью при низком SoC может разрядить накопитель до нуля — а утром его всё равно не зарядить, потому что слишком холодно.",
    },
    pola: {
      temperatura: {
        nazwa: "Самая низкая ожидаемая температура у батареи [°C]",
        cel: "Сравнивается с порогом включения нагревателей.",
        gdzie: "Температура в месте накопителя. Если он в отапливаемом помещении — введите температуру там, а не наружную.",
        zakres: "Порог включения нагревателей: {progTemp} °C.",
      },
      soc: {
        nazwa: "Текущий SoC батареи [%]",
        cel: "Ниже порога, без выработки PV, нагрев от батареи приостанавливается.",
        gdzie: Z_BMS_RU,
        zakres: "Порог приостановки нагрева от батареи (нет PV): {progSoc}%.",
      },
      pv: {
        nazwa: "Выработка PV в данный момент",
        cel: "Могут ли нагреватели работать от солнца вместо батареи.",
        gdzie: "Из мониторинга инвертора.",
        zakres: "Да или нет.",
      },
    },
  },
  "starzenie-degradacja": {
    migawka: {
      oCoChodzi:
        "Батарею покупают не на сегодня, а на весь срок службы — сразу нужно заложить запас на то, что она будет слабеть.",
      jakDziala:
        "По ёмкости, нужной сегодня, годовому снижению ёмкости и горизонту приложение считает начальную ёмкость, которая в конце горизонта всё ещё даст нужную энергию.",
      poCo: "Батарея, подобранная «на сегодня», через 10 лет может иметь на четверть меньше ёмкости — и зимой перестанет хватать.",
      fizyka: "C_начальная = C_нужная ÷ (1 − r × лет).",
    },
    pola: {
      pojemnoscDzis: {
        nazwa: "Полезная ёмкость, нужная сегодня [кВт·ч]",
        cel: "Сколько ёмкости нужно сейчас — отправная точка.",
        gdzie: "С экрана «Подбор ёмкости батареи» — приложение подставляет её автоматически, можно изменить.",
        zakres: "Результат Экрана 1.",
      },
      horyzont: {
        nazwa: "Проектный горизонт [лет]",
        cel: "Через сколько лет батареи должно всё ещё хватать.",
        gdzie: "Ваш выбор — обычно срок гарантии или планируемый срок службы установки.",
        zakres: "5, 10 или 15 лет.",
      },
      degradacja: {
        nazwa: "Годовое снижение ёмкости [%]",
        cel: "Сколько процентов ёмкости батарея теряет каждый год.",
        gdzie: "Из документации (гарантия ёмкости через N лет/циклов).",
        zakres: "LiFePO4 обычно {degMin}–{degMax}% в год.",
      },
    },
  },
  "obwod-precharge": {
    migawka: {
      oCoChodzi:
        "Конденсаторы инвертора в первый момент ведут себя как короткое замыкание — pre-charge мягко «будит» их током через резистор, прежде чем вы пустите полную мощность.",
      jakDziala:
        "По входной ёмкости инвертора и резистору предзаряда приложение считает время зарядки конденсаторов (5 постоянных времени) и бросок тока в начале.",
      poCo: "Без pre-charge при подключении батареи искрит, выгорают контакты, а BMS может отключиться по КЗ.",
      fizyka: "T = 5 · R · C; ток в начале I = U / R.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Входная ёмкость DC инвертора [мкФ]",
        cel: "Чем она больше, тем дольше зарядка через резистор.",
        gdzie: "Из документации инвертора (input capacitance) или у производителя.",
        zakres: Z_KARTY_RU,
      },
      rezystor: {
        nazwa: "Резистор предзаряда (pre-charge) [Ом]",
        cel: "Ограничивает бросок тока. Больше = меньше ток, но дольше время.",
        gdzie: "Подберите так, чтобы ограничить бросок тока (например, до нескольких ампер); проверьте и его мощность.",
        zakres: "Пример из источника: {rezystor} Ом / 50 Вт.",
      },
    },
  },
  "slabe-ogniwo": {
    migawka: {
      oCoChodzi: "Один слабый элемент ограничивает весь пакет — как тормоз в одном вагоне, который останавливает весь поезд.",
      jakDziala:
        "По номинальной ёмкости и заводскому допуску приложение считает ёмкость самого слабого элемента. При последовательном соединении пакет имеет именно его ёмкость — балансировка лишь частично это выравнивает.",
      poCo: "Чтобы знать, сколько реально даст пакет и почему важны подбор элементов и хороший балансир.",
      fizyka: "C_слабейший = C_номинальная × (1 − допуск).",
    },
    pola: {
      pojemnosc: {
        nazwa: "Номинальная ёмкость элемента [А·ч]",
        cel: "Отправная точка для расчёта ёмкости самого слабого элемента.",
        gdzie: "Из документации элемента.",
        zakres: Z_KARTY_RU,
      },
      tolerancja: {
        nazwa: "Заводской допуск [%]",
        cel: "Насколько ёмкость отдельного элемента может отличаться от номинальной.",
        gdzie: "Из документации элемента или протокола подбора от продавца.",
        zakres: "По умолчанию ±{tolerancja}% по источнику.",
      },
    },
  },
  "detekcja-zwarcia-efuse": {
    migawka: {
      oCoChodzi:
        "Обычный предохранитель отключает КЗ примерно за 10 мс — электронный e-Fuse менее чем за 100 мкс. При очень больших токах эта разница решает, выживут ли транзисторы BMS.",
      jakDziala:
        "Приложение считает ток КЗ батареи (напряжение ÷ внутреннее сопротивление) и сравнивает с коммутационной способностью транзисторов BMS. Если ток КЗ её превышает, BMS может не разорвать КЗ — перед ним нужен быстрый предохранитель.",
      poCo: "BMS — не предохранитель. При КЗ в тысячи ампер транзисторы могут свариться в проводящем состоянии.",
      fizyka: "I_кз = U / R_вн.",
    },
    pola: {
      napiecie: {
        nazwa: "Напряжение батареи [В]",
        cel: "По напряжению и внутреннему сопротивлению считается ток КЗ.",
        gdzie: "Номинальное напряжение пакета.",
        zakres: "Обычно 12, 24 или 48 В.",
      },
      rezystancja: {
        nazwa: "Внутреннее сопротивление пакета [Ом]",
        cel: "Чем меньше, тем больше ток КЗ.",
        gdzie: "По измерению или из документации элементов (сумма при последовательном соединении).",
        zakres: Z_KARTY_RU,
      },
      zdolnoscBms: {
        nazwa: "Коммутационная способность транзисторов BMS [А]",
        cel: "Наибольший ток, который BMS может безопасно разорвать.",
        gdzie: "Из документации BMS.",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "ochrona-wilgoc": {
    migawka: {
      oCoChodzi: "Мокрая BMS и медные шины — готовый рецепт короткого замыкания; конденсация — тихий убийца электроники.",
      jakDziala:
        "По температуре и влажности воздуха приложение считает точку росы (уравнение Магнуса-Тетенса). Если корпус или элементы холоднее точки росы, на них конденсируется вода. Проверяет также степень IP корпуса (во влажном месте не ниже IP{minIp}).",
      poCo: "Ночью корпус остывает быстрее воздуха — утром на электронике появляется роса, даже в «сухом» гараже.",
      fizyka: "Точка росы: T_d = b·α / (a − α), α = a·T/(b + T) + ln(RH/100); a = 17,27, b = 237,7 °C.",
    },
    pola: {
      temperatura: {
        nazwa: "Температура окружающей среды [°C]",
        cel: "Вместе с влажностью определяет точку росы.",
        gdzie: "Термометр в помещении накопителя.",
        zakres: "Ваши условия.",
      },
      wilgotnosc: {
        nazwa: "Относительная влажность [%]",
        cel: "Чем выше, тем выше точка росы — конденсат образуется легче.",
        gdzie: "Гигрометр в помещении накопителя.",
        zakres: "0–100%.",
      },
      temperaturaObudowy: {
        nazwa: "Температура корпуса / элементов [°C]",
        cel: "Если она ниже точки росы, на корпусе конденсируется вода.",
        gdzie: "Измеренная или ожидаемая — ночью может быть ниже окружающей (радиационное охлаждение).",
        zakres: "Ваши условия.",
      },
      ip: {
        nazwa: "Степень защиты корпуса (IP)",
        cel: "Защищает от пыли (первая цифра) и воды (вторая).",
        gdzie: "С таблички или из документации корпуса.",
        zakres: "Во влажном месте не ниже IP{minIp}.",
      },
    },
  },
  "moment-dokrecania-srub": {
    migawka: {
      oCoChodzi:
        "Болт — это пружина: его нужно затянуть ровно настолько, чтобы прижать кабельный наконечник, и ни капли больше.",
      jakDziala: "Вы выбираете тип и ёмкость элемента — приложение даёт момент затяжки клемм из источника.",
      poCo: "Слабо — соединение искрит и греется. Слишком сильно — срывается резьба в алюминиевой клемме элемента, а это часто конец элемента.",
    },
    pola: {
      typ: {
        nazwa: "Тип / ёмкость элемента",
        cel: "Правильный момент зависит от типа клеммы (резьба, материал).",
        gdzie: "Из документации элемента.",
        zakres: "Варианты из списка.",
      },
    },
  },
  "cold-c-rate": {
    migawka: {
      oCoChodzi:
        "В холоде ионы лития движутся медленнее — слишком быстрая зарядка необратимо повреждает элементы (осаждение металлического лития).",
      jakDziala:
        "Приложение устанавливает допустимый ток зарядки по температуре элемента: ниже {blokada} °C зарядка заблокирована, от {blokada} до {limit02} °C не более {cZimno}C, от {limit02} до {luka} °C не более {cChlodno}C, от {pelny} °C полный ток. Диапазон {luka}–{pelny} °C не угадывается — источник его не описывает.",
      poCo: "Повреждение от зарядки на морозе необратимо и не видно сразу — ёмкость падает с каждым таким циклом.",
    },
    pola: {
      temperatura: {
        nazwa: "Температура элемента [°C]",
        cel: "От неё зависит допустимый ток зарядки.",
        gdzie: "Показание BMS в реальном времени (датчик на элементах). 0 °C — корректное измерение.",
        zakres: "Блокировка ниже {blokada} °C; полный ток от {pelny} °C.",
      },
      pojemnosc: {
        nazwa: "Ёмкость пакета [А·ч]",
        cel: "Переводит предел C-rate в амперы: I = C-rate × ёмкость.",
        gdzie: "Из документации пакета.",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "koniec-ladowania": {
    migawka: {
      oCoChodzi:
        "Как наполнение бутылки: давление уже есть, но нужно немного подождать, чтобы вода дошла до самого конца. Зарядка заканчивается, когда ток падает при напряжении абсорбции.",
      jakDziala:
        "Приложение считает конечный ток: порог C × ёмкость. Сравнивает его с текущим током при напряжении абсорбции — когда ток падает ниже порога, батарея полная и зарядку можно завершить.",
      poCo: "Слишком раннее завершение — недозаряженная батарея и неверный SoC; слишком позднее — лишнее удержание элементов на высоком напряжении.",
      fizyka: "I_конечный = порог C × C_А·ч.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Ёмкость батареи [А·ч]",
        cel: "Переводит порог C в амперы.",
        gdzie: "Из документации батареи.",
        zakres: Z_KARTY_RU,
      },
      napiecieAbsorpcji: {
        nazwa: "Напряжение абсорбции [В]",
        cel: "Напряжение, на котором контроллер держит батарею в конце зарядки.",
        gdzie: "Из настроек контроллера/зарядного устройства или документации батареи.",
        zakres: Z_KARTY_RU,
      },
      progKoncowy: {
        nazwa: "Порог конечного тока [C]",
        cel: "При каком токе (как доля ёмкости) считать батарею полной.",
        gdzie: "Из документации батареи или рекомендаций производителя контроллера.",
        zakres: "Пример из источника: {progC}C.",
      },
      prad: {
        nazwa: "Текущий ток зарядки [А]",
        cel: "Сравнивается с конечным током.",
        gdzie: Z_BMS_RU,
        zakres: "Показание в реальном времени.",
      },
      napiecie: {
        nazwa: "Текущее напряжение [В]",
        cel: "Проверяет, находится ли батарея уже на напряжении абсорбции.",
        gdzie: Z_BMS_RU,
        zakres: "Показание в реальном времени.",
      },
    },
  },
  "soh-per-ogniwo": {
    migawka: {
      oCoChodzi:
        "Растущее сопротивление одного элемента — как закупоренный сосуд: остальной пакет должен работать тяжелее, чтобы это компенсировать.",
      jakDziala: "Приложение сравнивает текущее внутреннее сопротивление элемента с заводским. Рост на {progWzrostu}% и более означает критический элемент.",
      poCo: "Слабый элемент сильнее греется, быстрее стареет и первым отключает весь пакет — лучше заменить его раньше.",
      fizyka: "рост % = (R_текущее − R_заводское) / R_заводское × 100.",
    },
    pola: {
      rFabryczna: {
        nazwa: "Заводское внутреннее сопротивление [мОм]",
        cel: "Точка отсчёта — сопротивление нового элемента.",
        gdzie: "Из документации элемента или первого измерения после покупки.",
        zakres: Z_KARTY_RU,
      },
      rAktualna: {
        nazwa: "Текущее внутреннее сопротивление [мОм]",
        cel: "Сравнивается с заводским.",
        gdzie: "По измерению тестером внутреннего сопротивления (метод AC 1 кГц).",
        zakres: "Рост от {progWzrostu}% — критично.",
      },
    },
  },
  "cold-cranking-amps": {
    migawka: {
      oCoChodzi:
        "Холодная батарея — ленивая химия: она на мгновение не успевает дать пусковой ток, даже если энергии много. Напряжение проседает так, что инвертор отключается.",
      jakDziala:
        "Приложение считает просадку напряжения при пуске: напряжение без нагрузки − пусковой ток × внутреннее сопротивление (измеренное на холоде) и сравнивает с минимальным рабочим напряжением инвертора.",
      poCo: "Глубинный насос или компрессор, который летом стартует без проблем, зимой может отключать инвертор при каждом пуске.",
      fizyka: "V_просадка = V_хх − I_пуск × R_вн.",
    },
    pola: {
      napiecie: {
        nazwa: "Напряжение пакета без нагрузки [В]",
        cel: "Отправная точка для расчёта просадки.",
        gdzie: "Измерение на клеммах без нагрузки или показание BMS.",
        zakres: "Ваш пакет.",
      },
      pradRozruchu: {
        nazwa: "Пусковой ток потребителя [А]",
        cel: "Мгновенный ток при пуске двигателя — в несколько раз больше рабочего.",
        gdzie: "Из документации устройства (например, пусковой ток глубинного насоса) со стороны DC инвертора.",
        zakres: Z_KARTY_RU,
      },
      rezystancja: {
        nazwa: "Внутреннее сопротивление пакета [мОм]",
        cel: "Зимой растёт — и вызывает просадку напряжения.",
        gdzie: "Измеренное при текущей (холодной) температуре элементов тестером сопротивления.",
        zakres: "Измерение на холоде.",
      },
      minFalownika: {
        nazwa: "Минимальное рабочее напряжение инвертора [В]",
        cel: "Ниже него инвертор отключается.",
        gdzie: "Из документации инвертора (low voltage cut-off / мин. вход DC).",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "long-term-storage": {
    migawka: {
      oCoChodzi:
        "Батарея, отставленная надолго, не любит быть ни пересушенной, ни переполненной — а мороз ниже определённой границы повреждает элементы даже без зарядки.",
      jakDziala: "Приложение проверяет SoC перед хранением (рекомендуется {socMin}–{socMax}%) и самую низкую температуру хранения (безопасный минимум {tMin} °C).",
      poCo: "Полная батарея, хранящаяся месяцами, стареет быстрее; пустая может саморазрядиться ниже порога BMS. Мороз ниже минимума повреждает электролит.",
    },
    pola: {
      soc: {
        nazwa: "Целевой SoC перед хранением [%]",
        cel: "Степень заряда на время хранения.",
        gdzie: "Зарядите/разрядите до этого значения перед отключением.",
        zakres: "Рекомендуемый диапазон: {socMin}–{socMax}%.",
      },
      temperatura: {
        nazwa: "Самая низкая ожидаемая температура хранения [°C]",
        cel: "Сравнивается с безопасным минимумом.",
        gdzie: "Самая холодная ночь в месте хранения.",
        zakres: "Безопасный минимум: {tMin} °C.",
      },
    },
  },
  "second-life": {
    migawka: {
      oCoChodzi:
        "Батарея от разобранного электромобиля может быть отличной находкой или дорогим разочарованием — в зависимости от реального, а не заявленного состояния.",
      jakDziala:
        "Приложение оценивает состояние (SoH) по возрасту ({degRok}% в год) или пробегу ({degKm}% на 10 000 км), считает реальную ёмкость и стоимость кВт·ч и при желании сравнивает с новой батареей LiFePO4.",
      poCo: "Цена за «заявленный кВт·ч» вводит в заблуждение — значение имеет стоимость реально полезного кВт·ч.",
      fizyka: "SoH = 100% − деградация; C_полезная = C_заявленная × SoH; стоимость_кВт·ч = цена ÷ C_полезная.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Заявленная ёмкость [кВт·ч]",
        cel: "Ёмкость, указанная продавцом, — отправная точка.",
        gdzie: "Из объявления или таблички модуля.",
        zakres: "Заявление продавца.",
      },
      cena: {
        nazwa: "Цена покупки [зл]",
        cel: "Делённая на реальную ёмкость, даёт стоимость кВт·ч.",
        gdzie: "Из предложения.",
        zakres: TWOJA_CENA_RU,
      },
      metoda: {
        nazwa: "Метод оценки SoH",
        cel: "По возрасту батареи или по пробегу автомобиля — в зависимости от того, что вы знаете.",
        gdzie: "Выберите доступную информацию.",
        zakres: "Возраст или пробег.",
      },
      wiek: {
        nazwa: "Возраст батареи [лет]",
        cel: "По возрасту приложение оценивает потерю ёмкости.",
        gdzie: "Из документов автомобиля или по дате производства модуля.",
        zakres: "Принятая деградация: {degRok}% в год.",
      },
      przebieg: {
        nazwa: "Пробег автомобиля [км]",
        cel: "По пробегу приложение оценивает потерю ёмкости.",
        gdzie: "Из документов автомобиля.",
        zakres: "Принятая деградация: {degKm}% на 10 000 км.",
      },
      cenaNowej: {
        nazwa: "Цена новой батареи LiFePO4 [зл/кВт·ч] (необязательно)",
        cel: "Для сравнения — окупается ли б/у.",
        gdzie: "Из текущих предложений.",
        zakres: TWOJA_CENA_RU,
      },
    },
  },
  "mixing-rownolegle": {
    migawka: {
      oCoChodzi:
        "Параллельное соединение разных батарей — как запрячь в одну телегу тяжеловоза и пони: один тянет больше и быстрее изнашивается.",
      jakDziala:
        "Приложение проверяет совместимость химии и считает уравнительный ток при соединении: разница напряжений ÷ сумма сопротивлений. Разница напряжений выше {progRoznicy} В — предупреждение.",
      poCo: "Большой уравнительный ток в момент соединения может повредить разъёмы и BMS; у разных химий разные напряжения зарядки — одна всегда будет перезаряжена или недозаряжена.",
      fizyka: "I_ур = ΔU / (R₁ + R₂).",
    },
    pola: {
      chemia: {
        nazwa: "Химия элементов",
        cel: "У разных химий разные рабочие и зарядные напряжения — смешивать их рискованно.",
        gdzie: "Из документации батареи.",
        zakres: "Варианты из списка.",
      },
      napiecie: {
        nazwa: "Номинальное напряжение [В]",
        cel: "Разница напряжений создаёт уравнительный ток.",
        gdzie: "Измерьте напряжение обеих батарей непосредственно перед соединением.",
        zakres: "Разница выше {progRoznicy} В — предупреждение.",
      },
      rezystancja: {
        nazwa: "Внутреннее сопротивление [мОм]",
        cel: "Ограничивает уравнительный ток.",
        gdzie: "По измерению или из документации батареи.",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "vehicle-to-home": {
    migawka: {
      oCoChodzi:
        "Автомобиль может быть пауэрбанком на колёсах, но это изнашивает его тяговую батарею — стоит посчитать, окупается ли это.",
      jakDziala:
        "Приложение считает реально доступную энергию (ёмкость − резерв на поездку, × КПД) и стоимость износа батареи на кВт·ч: цена замены ÷ (ёмкость × циклы × КПД).",
      poCo: "Если стоимость износа батареи авто на кВт·ч выше, чем кВт·ч из сети или от генератора, V2H — только на аварии.",
      fizyka: "C_реальная = (C_EV − резерв) × η; стоимость_кВт·ч = цена_замены ÷ (C_EV × циклы × η).",
    },
    pola: {
      pojemnosc: {
        nazwa: "Ёмкость тяговой батареи EV [кВт·ч]",
        cel: "Вся энергия в батарее автомобиля.",
        gdzie: "Из технических данных авто (ёмкость нетто).",
        zakres: "Данные авто.",
      },
      rezerwa: {
        nazwa: "Резерв на поездку [кВт·ч]",
        cel: "Энергия, которую вы не отдадите дому, — чтобы можно было поехать.",
        gdzie: "Ваши потребности: самая длинная внезапная поездка × расход авто.",
        zakres: "Ваш выбор.",
      },
      sprawnosc: {
        nazwa: "Эффективный КПД [%]",
        cel: "Потери при отдаче энергии в дом и деградация.",
        gdzie: "Из данных двунаправленного зарядного устройства или производителя авто.",
        zakres: "0–100%.",
      },
      kosztWymiany: {
        nazwa: "Стоимость замены тяговой батареи [зл]",
        cel: "Для расчёта стоимости износа на кВт·ч.",
        gdzie: "Из сервиса или прайс-листа производителя.",
        zakres: TWOJA_CENA_RU,
      },
      cykle: {
        nazwa: "Ресурс тяговой батареи в циклах",
        cel: "На сколько полных циклов распределяется стоимость замены.",
        gdzie: "Из данных производителя или гарантии батареи.",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "komunikacja-bms": {
    migawka: {
      oCoChodzi:
        "BMS и инвертор должны «говорить на одном языке» — без этого инвертор не знает, сколько реально у него батареи, и вынужден угадывать по напряжению.",
      jakDziala: "Вы выбираете протокол BMS и инвертора (CAN, RS485, Modbus…). Приложение проверяет совместимость и предупреждает, если они не договорятся.",
      poCo: "Без связи инвертор заряжает по напряжению — хуже защищает элементы и плохо показывает SoC.",
    },
    pola: {
      protokolBms: {
        nazwa: "Протокол BMS",
        cel: "Как BMS передаёт данные (SoC, ограничения тока, тревоги).",
        gdzie: "Из документации BMS или инструкции батареи.",
        zakres: "Варианты из списка.",
      },
      protokolFalownika: {
        nazwa: "Протокол инвертора / зарядного устройства",
        cel: "Какой протокол ожидает инвертор.",
        gdzie: "Из инструкции инвертора — список поддерживаемых BMS.",
        zakres: "Варианты из списка.",
      },
    },
  },
  "pozycjonowanie-ogniw": {
    migawka: {
      oCoChodzi:
        "Призматические элементы любят, когда их держат крепко, но не как в тисках — им нужно немного места для естественного «дыхания» во время работы.",
      jakDziala: "Приложение сравнивает приложенное сжатие с рекомендуемым диапазоном для призматических элементов.",
      poCo: "Слишком слабое сжатие — элементы вздуваются и быстрее стареют; слишком сильное — повреждение корпуса и электродов.",
    },
    pola: {
      docisk: {
        nazwa: "Приложенное сжатие пакета [кгс]",
        cel: "Сила, сжимающая элементы в пакете.",
        gdzie: "Из проекта корпуса/стяжек или по измерению (например, по моменту стяжных болтов).",
        zakres: "Рекомендуемый диапазон для призматических элементов: {dociskMin}–{dociskMax} кгс.",
      },
    },
  },
  "pobor-wlasny-bms": {
    migawka: {
      oCoChodzi:
        "BMS — тоже потребитель тока, даже когда «ничего не делает»; в малых off-grid системах это постоянное потребление может быть удивительно большой частью баланса.",
      jakDziala: "Приложение считает годовую энергию собственного потребления в непрерывной работе и во сне: мощность × 24 ч × 365 дней.",
      poCo: "Несколько ватт круглые сутки — это десятки кВт·ч в год и причина, по которой отставленная батарея сама разряжается.",
      fizyka: "E_год = P × 24 × 365 / 1000 [кВт·ч].",
    },
    pola: {
      ciagle: {
        nazwa: "Потребление в режиме непрерывной работы [Вт]",
        cel: "Потребление BMS при нормальной работе.",
        gdzie: "Из документации BMS (self-consumption).",
        zakres: "Обычно {ciagleMin}–{ciagleMax} Вт.",
      },
      uspienie: {
        nazwa: "Потребление в режиме сна (deep sleep) [Вт]",
        cel: "Потребление BMS во сне — важно при хранении батареи.",
        gdzie: "Из документации BMS.",
        zakres: "Обычно {uspienieMin}–{uspienieMax} Вт.",
      },
    },
  },
  "oplacalnosc-magazynu": {
    migawka: {
      oCoChodzi:
        "Батарея — копилка энергии, но и сама стоит денег; только стоимость каждого отданного кВт·ч показывает, окупается ли накопитель.",
      jakDziala: "Стоимость 1 кВт·ч из накопителя = цена ÷ (полезная ёмкость × число циклов × КПД). При желании приложение сравнивает её со стоимостью кВт·ч от альтернативы (генератор, сеть).",
      poCo: "Если кВт·ч из накопителя дороже, чем из сети, накопитель не зарабатывает на переносе энергии — он имеет смысл только ради независимости.",
      fizyka: "стоимость_кВт·ч = цена ÷ (C × циклы × η).",
    },
    pola: {
      cena: {
        nazwa: "Цена батареи [зл]",
        cel: "Затраты на накопитель.",
        gdzie: "Из предложения (с монтажом, если нужна полная стоимость).",
        zakres: TWOJA_CENA_RU,
      },
      pojemnosc: {
        nazwa: "Полезная ёмкость [кВт·ч]",
        cel: "Энергия, отдаваемая за один цикл.",
        gdzie: "Из документации (usable capacity).",
        zakres: Z_KARTY_RU,
      },
      cykle: {
        nazwa: "Ресурс в циклах при выбранном DoD",
        cel: "На сколько циклов распределяется стоимость.",
        gdzie: "Из документации или Экрана 30 (Сравнение технологий).",
        zakres: Z_KARTY_RU,
      },
      sprawnosc: {
        nazwa: "КПД накопителя [%]",
        cel: "Потери при зарядке и разрядке.",
        gdzie: "Из документации (round-trip efficiency).",
        zakres: "0–100%.",
      },
      alternatywa: {
        nazwa: "Стоимость альтернативы [зл/кВт·ч] (необязательно)",
        cel: "Стоимость кВт·ч от генератора или сети — для сравнения.",
        gdzie: "Из счёта или экрана генератора. Пусто = только стоимость накопителя.",
        zakres: "Ваше значение.",
      },
    },
  },
  "szyny-zbiorcze-miedzypakietowe": {
    migawka: {
      oCoChodzi:
        "Ток, как всё ленивое, течёт туда, где легче, — неравная длина кабелей или несимметричное подключение всегда дают неравную нагрузку пакетов.",
      jakDziala: "Приложение считает распределение тока между ветвями: каждая ветвь получает ток, обратно пропорциональный своему сопротивлению (длина и сечение проводника).",
      poCo: "Пакет на более коротком кабеле работает тяжелее и быстрее изнашивается. Равные длины и симметричное (диагональное) подключение — почти бесплатное улучшение.",
      fizyka: "I_i = I_общ × (1/R_i) ÷ Σ(1/R_j); R_i = ρ × 2L_i / A_i.",
    },
    pola: {
      pradCalkowity: {
        nazwa: "Общий ток [А]",
        cel: "Ток, делящийся между ветвями пакетов.",
        gdzie: "Максимальный ток инвертора или зарядного устройства на стороне DC.",
        zakres: Z_KARTY_RU,
      },
      material: {
        nazwa: "Материал проводников",
        cel: "Медь или алюминий — разное удельное сопротивление.",
        gdzie: "Из описания кабеля.",
        zakres: "Cu или Al.",
      },
      dlugosc: {
        nazwa: "Длина участка до общей шины [м]",
        cel: "Длиннее участок = больше сопротивление = меньше ток этой ветви.",
        gdzie: "Измерьте проводник от пакета до шины.",
        zakres: "Ваша установка.",
      },
      przekroj: {
        nazwa: "Сечение проводника [мм²]",
        cel: "Больше сечение = меньше сопротивление.",
        gdzie: "С изоляции проводника.",
        zakres: "Стандартные сечения.",
      },
    },
  },
  "topologia-bms": {
    migawka: {
      oCoChodzi:
        "Если у вас одна труба и для воды, и для стоков, она в конце концов засорится, — иногда лучше разделить пути зарядки и разрядки (Separate Port).",
      jakDziala: "Приложение сравнивает номинальный ток Common Port BMS с пиковым пусковым током инвертора. Если пуск его превышает, BMS может отключаться при старте.",
      poCo: "BMS, подобранная только по номинальному току, отключается, когда инвертор запускает двигатель, — весь дом гаснет при старте насоса.",
    },
    pola: {
      pradCommon: {
        nazwa: "Номинальный ток Common Port BMS [А]",
        cel: "Наибольший ток, который пропустит общий порт зарядки и разрядки.",
        gdzie: "Из документации BMS.",
        zakres: Z_KARTY_RU,
      },
      pradRozruchu: {
        nazwa: "Пиковый пусковой ток инвертора [А]",
        cel: "Мгновенный ток, потребляемый инвертором при пуске крупных потребителей.",
        gdzie: "Из документации инвертора — пусковой ток бывает намного выше номинального.",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "dobor-bezpiecznika-dc": {
    migawka: {
      oCoChodzi:
        "Предохранитель должен уметь погасить электрическую дугу, а не просто перегореть; неправильно подобранный по AIC он сам становится источником дуги.",
      jakDziala: "Приложение считает ток КЗ батареи (напряжение ÷ внутреннее сопротивление) и сравнивает с отключающей способностью (AIC) предохранителя. Для LiFePO4 минимум — {minAic} А.",
      poCo: "У батарей LiFePO4 очень малое сопротивление — при КЗ они дают тысячи ампер. Обычный автомобильный предохранитель это не разорвёт.",
      fizyka: "I_кз = U / R_вн.",
    },
    pola: {
      napiecie: {
        nazwa: "Напряжение батареи [В]",
        cel: "По напряжению и внутреннему сопротивлению считается ток КЗ.",
        gdzie: "Номинальное напряжение пакета.",
        zakres: "Обычно 12, 24 или 48 В.",
      },
      rezystancja: {
        nazwa: "Внутреннее сопротивление пакета [Ом]",
        cel: "Чем меньше, тем больше ток КЗ.",
        gdzie: "По измерению или из документации элементов.",
        zakres: Z_KARTY_RU,
      },
      aic: {
        nazwa: "AIC выбранного предохранителя [А]",
        cel: "Отключающая способность — должна превышать ток КЗ.",
        gdzie: "Из документации предохранителя (breaking capacity).",
        zakres: "Для LiFePO4 не менее {minAic} А.",
      },
    },
  },
  "chlodzenie-latem": {
    migawka: {
      oCoChodzi: "Батарея — не печь: высокая температура не только временно снижает эффективность, но и необратимо ускоряет старение элементов.",
      jakDziala: "Приложение сравнивает температуру элементов с рабочим диапазоном {tMin}–{tMax} °C и подсказывает охлаждение (вентиляция, тень, изоляция).",
      poCo: "Каждые несколько градусов выше оптимума сокращают жизнь элементов. Накопитель на чердаке или в контейнере на солнце стареет намного быстрее.",
    },
    pola: {
      temperatura: {
        nazwa: "Температура элементов [°C]",
        cel: "Сравнивается с допустимым рабочим диапазоном.",
        gdzie: Z_BMS_RU,
        zakres: "Допустимый рабочий диапазон: {tMin}–{tMax} °C.",
      },
    },
  },
  "kalibracja-soc": {
    migawka: {
      oCoChodzi:
        "Подсчёт тока в BMS — постоянная оценка, а не точное измерение; время от времени его нужно «сбросить» полной зарядкой, чтобы ошибка не накапливалась.",
      jakDziala: "Приложение проверяет, сколько дней прошло с последней полной зарядки. Через {progDni} дней рекомендует калибровку.",
      poCo: "С расcтроенным SoC система может отключить потребителей слишком рано или разрядить батарею ниже безопасного порога.",
    },
    pola: {
      dni: {
        nazwa: "Дней с последней полной зарядки [дней]",
        cel: "Чем дольше, тем больше накопленная ошибка SoC.",
        gdzie: "Из истории BMS или по памяти. 0 = сегодня была полная зарядка.",
        zakres: "Порог рекомендации калибровки: {progDni} дней.",
      },
    },
  },
  "detekcja-doziemienia": {
    migawka: {
      oCoChodzi:
        "Постоянный ток удерживает пострадавшего от поражения сильнее переменного — мышцы не могут «отпустить». Поэтому обнаружение замыкания на землю в DC так важно.",
      jakDziala: "Контрольный список: монитор изоляции (IMD) и дифференциальный автомат DC. Отсутствие защиты — предупреждение или красный стоп в зависимости от системы.",
      poCo: "Повреждённая изоляция проводника DC может годами оставаться незаметной — до момента, когда кто-то коснётся конструкции.",
    },
    pola: {},
  },
  "matryca-alarmow-bms": {
    migawka: {
      oCoChodzi:
        "Система защищается сама — ваша задача понять сообщение и устранить причину, а не просто сбросить тревогу. Таблица показывает, что BMS делает автоматически при каждом аварийном состоянии.",
      jakDziala: "Для каждой тревоги (перенапряжение, пониженное напряжение, температура, ток…) таблица показывает реакцию BMS и системы и пример сообщения для пользователя.",
      poCo: "Чтобы знать, почему система отключилась и что делать, — прежде чем искать неисправность вслепую.",
    },
    pola: {},
  },
  "porownanie-technologii-magazynow": {
    migawka: {
      oCoChodzi:
        "Цена покупки — не то же самое, что стоимость за весь срок службы: нужно добавить вес (конструкция пола), обслуживание и реальное число циклов.",
      jakDziala: "Таблица сравнивает технологии накопителей: энергию, отданную за всю жизнь (ёмкость × циклы × DoD), массу, обслуживание. При желании пересчитывает на планируемую ёмкость.",
      poCo: "Более дешёвый на старте свинцовый аккумулятор может стоить за кВт·ч за всю жизнь в несколько раз больше, чем LiFePO4.",
      fizyka: "E_общая = ёмкость × циклы × DoD.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Планируемая ёмкость накопителя [кВт·ч] (необязательно)",
        cel: "Пересчитывает таблицу (масса, стоимость) на размер вашего накопителя.",
        gdzie: "С экрана «Подбор ёмкости батареи».",
        zakres: "Результат Экрана 1.",
      },
    },
  },
  "napiecie-odciecia-a-zywotnosc": {
    migawka: {
      oCoChodzi:
        "Не выжимайте батарею до последней капли — более высокое напряжение отсечки (небольшой запас) радикально продлевает её жизнь ценой небольшой части доступной ёмкости.",
      jakDziala:
        "По напряжению отсечки и числу элементов приложение считает напряжение на элемент, а по калибровочным точкам источника — приблизительный DoD и число циклов (линейная интерполяция между {vMin} В/элемент ≈ 100% DoD и {vMax} В/элемент ≈ 80% DoD).",
      poCo: "Поднятие отсечки на несколько десятых вольта может удвоить число циклов — и продлить жизнь накопителя на годы.",
    },
    pola: {
      napiecie: {
        nazwa: "Напряжение отсечки [В]",
        cel: "Напряжение пакета, при котором инвертор/BMS прекращает разряд батареи.",
        gdzie: "Из настроек инвертора или BMS (low voltage cut-off).",
        zakres: "Ваши настройки.",
      },
      ogniwa: {
        nazwa: "Число последовательных элементов (S)",
        cel: "Делит напряжение пакета на напряжение одного элемента.",
        gdzie: "Из описания пакета (например, 16S).",
        zakres: "Типичный пакет 48 В LiFePO4 — 16S; предлагаемое значение: {ogniwa}.",
      },
    },
  },
  "hierarchia-ladowania": {
    migawka: {
      oCoChodzi: "Умная система ждёт бесплатного топлива от солнца, а не хватается сразу за дорогой генератор.",
      jakDziala: "Порядок источников: PV всегда первое, генератор — только ниже критического порога SoC, сеть (если есть) — последней. Приложение показывает, какой источник заряжает при текущем SoC.",
      poCo: "Генератор, запущенный слишком рано, сжигает топливо ради энергии, которую через час дало бы солнце.",
    },
    pola: {
      soc: {
        nazwa: "Текущий SoC батареи [%]",
        cel: "Сравнивается с критическим порогом.",
        gdzie: Z_BMS_RU,
        zakres: "0–100%.",
      },
      progKrytyczny: {
        nazwa: "Критический порог SoC [%]",
        cel: "Ниже этого значения рассматривается генератор.",
        gdzie: "Ваше решение — согласуйте с DoD батареи и временем запуска генератора.",
        zakres: "Предлагаемого значения нет — данные безопасности не имеют скрытого значения по умолчанию.",
      },
    },
  },
  "symulacja-miesiaca-zachmurzenia": {
    migawka: {
      oCoChodzi:
        "Систему проектируют не на среднюю погоду, а на самую плохую реалистичную неделю года — в этом суть настоящего off-grid.",
      jakDziala:
        "Приложение считает день за днём: выработка = номинальная × уровень облачности; суточный дефицит съедает батарею, пока SoC не упадёт до нуля. Показывает, в какой день система отключится и сколько ёмкости не хватает.",
      poCo: "Среднегодовая выработка лжёт. Десяток дней без солнца в декабре — реальный сценарий; лучше просчитать его заранее.",
      fizyka: "ΔE_сут = E_потребность − E_выработка,ном × облачность % ÷ 100.",
    },
    pola: {
      pojemnosc: {
        nazwa: "Полезная ёмкость батареи [кВт·ч]",
        cel: "Запас энергии на чёрный сценарий.",
        gdzie: "С экрана «Подбор ёмкости батареи».",
        zakres: "Результат Экрана 1.",
      },
      socStart: {
        nazwa: "SoC в начале сценария [%]",
        cel: "С какой степени заряда начинается серия пасмурных дней.",
        gdzie: "Обычно полная батарея (100%) — или реальное состояние, если проверяете худший случай.",
        zakres: "0–100%.",
      },
      zapotrzebowanie: {
        nazwa: "Суточная потребность [кВт·ч/сутки]",
        cel: "Сколько энергии вы расходуете каждый день сценария.",
        gdzie: "Из баланса нагрузок (Модуль 2) — зимнее потребление.",
        zakres: "Ваши данные.",
      },
      produkcja: {
        nazwa: "Номинальная суточная выработка PV (солнечный день) [кВт·ч/сутки]",
        cel: "Отправная точка для выработки в пасмурный день.",
        gdzie: "Из Модуля 3 для месяца сценария.",
        zakres: "Ваша установка.",
      },
      zachmurzenie: {
        nazwa: "Уровень облачности [% номинальной выработки]",
        cel: "Какой процент номинальной выработки остаётся в пасмурный день.",
        gdzie: "Ваше предположение о худшей неделе.",
        zakres: "Источник предлагает 5–10% для чёрного сценария — единого канонического значения нет, выберите осознанно.",
      },
      dni: {
        nazwa: "Число дней сценария [дней]",
        cel: "Сколько длится серия пасмурных дней.",
        gdzie: "Ваше предположение.",
        zakres: "Предложено источником: {dni} дней.",
      },
    },
  },
  "magazyn-firmy": {
    migawka: {
      oCoChodzi:
        "Накопитель в фирме зарабатывает пятью способами, но не каждый доступен вашей фирме. Каждый поток мы сравниваем со стоимостью износа накопителя на 1 кВт·ч.",
      jakDziala:
        "Приложение считает отдельно: самопотребление (энергия × выгода на кВт·ч), ценовой арбитраж (энергия × разница цен), снижение платы за мощность (энергия, отданная в рабочие дни 7–22), экономию на договорной мощности (реальна только в C2x и при превышениях) — и сравнивает со стоимостью кВт·ч из накопителя из «Анализа окупаемости накопителя» (Модуль 4). Системные услуги для малых накопителей практически недоступны без агрегатора — только как информация.",
      poCo: "Поток, который стоит больше износа накопителя, чем приносит, убыточен — лучше знать это до покупки.",
    },
    pola: {
      energiaAutokonsumpcja: {
        nazwa: "Энергия через накопитель [кВт·ч/год]",
        cel: "Сколько энергии в год накопитель перенесёт в данном потоке (самопотребление или арбитраж).",
        gdzie: "Из баланса PV и накопителя (экран F6) или вашего плана работы накопителя.",
        zakres: "Ваши данные.",
      },
      zyskKwh: {
        nazwa: "Выгода на 1 кВт·ч от самопотребления [зл/кВт·ч]",
        cel: "Сколько вы выигрываете на каждом кВт·ч из накопителя вместо сети.",
        gdzie: "Цена покупки кВт·ч − стоимость отданного кВт·ч, без платы за мощность.",
        zakres: "Ваши цены.",
      },
      roznicaCen: {
        nazwa: "Разница цен для арбитража [зл/кВт·ч]",
        cel: "Выгода от покупки в дешёвые часы и потребления в дорогие.",
        gdzie: "Дорогие − дешёвые часы в вашем тарифе или динамическом договоре, без платы за мощность.",
        zakres: "Ваши цены.",
      },
      energiaMocowa: {
        nazwa: "Энергия из накопителя в рабочие дни 7:00–22:00 [кВт·ч/год]",
        cel: "Энергия, которую вы не возьмёте из сети в часы платы за мощность, — снижает эту плату.",
        gdzie: "Из плана работы накопителя.",
        zakres: "Не больше энергии через накопитель.",
      },
      grupa: {
        nazwa: "Тарифная группа",
        cel: "Экономия на договорной мощности реальна только в C2x (свыше 40 кВт) и при превышениях.",
        gdzie: "В счёте.",
        zakres: "C1x или C2x.",
      },
      mocUmowna: {
        nazwa: "Экономия на договорной мощности и превышениях [зл/год]",
        cel: "Годовая экономия за счёт снижения договорной мощности или избежания превышений.",
        gdzie: "Из калькулятора договорной мощности (экран F4). Пусто = не учитывается.",
        zakres: "Результат экрана F4.",
      },
    },
  },
}
