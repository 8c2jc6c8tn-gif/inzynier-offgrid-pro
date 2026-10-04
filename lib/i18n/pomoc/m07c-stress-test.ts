/**
 * Help content — Module 7 (winter stress test), screens built on 03.10.2026:
 * Deep Winter Energy Budget (E25), inverter under distorted loads (E24), wind turbine as winter support (E16).
 * Every number comes from the user or from a datasheet the user types in (Directive #1, owner decision 03.10.2026).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "deep-winter-budget": {
    migawka: {
      oCoChodzi:
        "Energia zimą jest jak pensja — trzeba nią zarządzać, żeby starczyło do „pierwszego”, czyli do wiosny. Ten ekran pilnuje budżetu jednego zimowego miesiąca: porównuje to, co zużyłeś do dziś, z tym, co zaplanowałeś.",
      jakDziala:
        "1) Wpisujesz plan miesiąca: ile da PV, ile agregat i ile użytecznej rezerwy z magazynu przeznaczasz na ten miesiąc — plan P to ich suma. 2) Wpisujesz, który to dzień miesiąca i ile energii zużyto od 1. dnia. 3) Aplikacja liczy budżet na dziś (plan rozłożony po równo na dni), ile zostało z całego planu, tempo dzienne bieżące i dopuszczalne na resztę miesiąca oraz prognozę końca miesiąca. 4) Jeśli jesteś ponad budżetem, podaje o ile procent trzeba ograniczyć zużycie na pozostałe dni, a gdy wpiszesz udział ogrzewania i różnicę temperatur — o ile stopni obniżyć temperaturę w domu. 5) Opcjonalnie dzielisz plan na cele (ogrzewanie, ciepła woda, pompy, światło, reszta) i widzisz, który cel wyprzedził swój budżet.",
      poCo: "Bez tego o braku energii dowiadujesz się w ostatnim tygodniu miesiąca, kiedy zostają już tylko drastyczne decyzje. W środku miesiąca wystarczy obniżyć temperaturę o stopień lub dwa.",
      fizyka:
        "Co i jak liczymy — i dlaczego. Plan P = PV + agregat + magazyn [kWh]. Budżet narastający na dzień d z N dni: B = P·d/N — zakładamy, że plan wydajesz równo; to najprostsza, uczciwa linia odniesienia, ale zimą zużycie bywa nierówne. Odchylenie = zużycie/B − 1. Zostało = P − zużycie. Tempo bieżące = zużycie/d; tempo dopuszczalne = (P − zużycie)/(N − d): tyle możesz dziennie, żeby dociągnąć do końca. Prognoza końca = zużycie/d·N. Wymagane ograniczenie r = 1 − dopuszczalne/bieżące. Ogrzewanie: moc grzewcza jest w przybliżeniu proporcjonalna do różnicy temperatur wewnątrz–na zewnątrz ΔT, więc obniżenie temperatury o 1 K zmniejsza zużycie na ogrzewanie o 1/ΔT jego wartości, a całego zużycia o udział/ΔT. Potrzebne obniżenie = r·ΔT/udział. To przybliżenie stacjonarne — pomija zyski wewnętrzne i bezwładność budynku, traktuj wynik jako rząd wielkości. Uwaga: „prognoza większa od planu” i „zużycie większe od budżetu” to ten sam warunek (zużycie/d·N > P ⇔ zużycie > P·d/N), dlatego żółty oznacza „ponad budżet, jeszcze do uratowania”, a czerwony — „plan już wyczerpany albo nawet wyłączenie ogrzewania nie wystarczy”. Próg wynika z bilansu energii, nie z normy.",
    },
    pola: {
      dniMiesiaca: {
        nazwa: "Liczba dni miesiąca",
        cel: "Rozkłada plan na dni: budżet jednego dnia to plan podzielony przez tę liczbę.",
        gdzie: "Kalendarz (styczeń 31, luty 28 lub 29, grudzień 31).",
        zakres: "Liczba całkowita 28–31.",
      },
      biezacyDzien: {
        nazwa: "Bieżący dzień miesiąca",
        cel: "Mówi, ile dni już minęło — od tego zależy budżet na dziś i tempo na resztę miesiąca.",
        gdzie: "Kalendarz; wpisz dzień, do którego masz odczytane zużycie (włącznie z nim).",
        zakres: "Liczba całkowita od 1 do liczby dni miesiąca.",
      },
      planPv: {
        nazwa: "Zaplanowana produkcja PV w miesiącu [kWh]",
        cel: "Pierwsze ze źródeł planu — razem z agregatem i magazynem daje całą energię do wydania.",
        gdzie: "Moduł 3 (produkcja miesięczna) albo Twoja ostrożna ocena dla tego miesiąca.",
        zakres: "Twoja instalacja; 0, jeśli PV w tym miesiącu nie liczysz.",
      },
      planAgregat: {
        nazwa: "Zaplanowana energia z agregatu [kWh]",
        cel: "Energia, którą w tym miesiącu zamierzasz wyprodukować agregatem.",
        gdzie: "Ekran „Deficyty miesięczne i agregat” (deficyt miesiąca) albo Twój plan pracy agregatu.",
        zakres: "Puste lub 0 = bez agregatu.",
      },
      planMagazyn: {
        nazwa: "Użyteczna rezerwa magazynu na ten miesiąc [kWh]",
        cel: "Energia z baterii, którą wolno wydać w tym miesiącu (po odjęciu rezerwy awaryjnej).",
        gdzie: "Pojemność użyteczna z Modułu 4 pomniejszona o zapas, który chcesz zostawić na kolejne miesiące.",
        zakres: "Nie więcej niż pojemność użyteczna baterii.",
      },
      zuzycie: {
        nazwa: "Zużycie od 1. dnia do dziś [kWh]",
        cel: "Dotychczas wydana energia — porównywana z budżetem na dziś.",
        gdzie: "Licznik energii / falownik / monitoring: suma zużycia domu od początku miesiąca (z agregatem i ogrzewaniem).",
        zakres: "Większe od zera.",
      },
      celUdzial: {
        nazwa: "Udział celu w planie [%]",
        cel: "Jaką część planu miesiąca przeznaczasz na ten cel; z niej liczony jest budżet celu.",
        gdzie: "Twoja decyzja — zwykle z historii zużycia lub Modułów 2 i 6.",
        zakres: "0–100%, wszystkie cele razem do 100%.",
      },
      celZuzycie: {
        nazwa: "Zużycie celu od 1. dnia do dziś [kWh]",
        cel: "Ile z dotychczasowego zużycia poszło na ten cel.",
        gdzie: "Podlicznik albo szacunek: ogrzewanie, ciepła woda, pompy, oświetlenie.",
        zakres: "Nie więcej niż zużycie razem.",
      },
      udzialOgrzewania: {
        nazwa: "Udział ogrzewania w zużyciu [%]",
        cel: "Pozwala przeliczyć wymagane ograniczenie zużycia na stopnie obniżki temperatury.",
        gdzie: "Podlicznik ogrzewania albo Moduł 6: zużycie na ogrzewanie podzielone przez zużycie razem.",
        zakres: "0–100%; puste = bez przeliczenia na stopnie.",
      },
      roznicaTemperatur: {
        nazwa: "Średnia różnica temperatur wewnątrz–na zewnątrz [K]",
        cel: "Od niej zależy, jak bardzo zmniejsza się ogrzewanie po obniżeniu temperatury o 1 K (o 1/ΔT).",
        gdzie: "Temperatura w domu minus średnia temperatura zewnętrzna z ostatnich dni.",
        zakres: "Większa od zera; zimą zwykle kilkanaście do kilkudziesięciu kelwinów.",
      },
      oszczednoscNaK: {
        nazwa: "Własna oszczędność na 1 K niższej temperatury [kWh/dobę]",
        cel: "Zastępuje przybliżenie „1/ΔT”, gdy znasz ją z własnych pomiarów.",
        gdzie: "Z podlicznika: o ile kWh na dobę spadło zużycie, gdy obniżyłeś temperaturę w domu o 1 K (porównaj podobne doby).",
        zakres: "Większa od zera; puste = przybliżenie stacjonarne z różnicy temperatur.",
      },
    },
  },
  "falownik-thd": {
    migawka: {
      oCoChodzi: "Falownik ma na tabliczce moc w kilowatach, ale to moc dla „gładkiego” prądu. Gdy odbiornik (pompa ciepła, silniki, zasilacze) zniekształca prąd, falownik grzeje się bardziej i producent każe mu oddawać mniej. Ten ekran sprawdza, czy mimo to wystarczy mocy.",
      jakDziala: "1) Wpisujesz moc znamionową falownika i moc czynną obciążenia. 2) Wpisujesz THD prądu obciążenia (z analizatora sieci albo z karty odbiornika). 3) Wpisujesz z karty katalogowej falownika tabelę: dla kilku wartości THD — jaką część mocy znamionowej falownik może wtedy oddać (0–1); minimum 2 wiersze, THD rosnąco. 4) Aplikacja odczytuje współczynnik dla Twojego THD (między wierszami liczy po prostej), mnoży przez moc znamionową i porównuje z obciążeniem. 5) Pokazuje zapas w kW i w procentach albo — gdy obciążenie jest większe — czerwony stop.",
      poCo: "Falownik dobrany „na styk” według tabliczki może zimą, przy pracującej pompie ciepła, wyłączać się na przeciążeniu. Lepiej zobaczyć to przy planowaniu niż w środku mrozu.",
      fizyka: "Co i jak liczymy — i dlaczego. Odkształcony prąd zawiera harmoniczne: poza składową podstawową (50 Hz) płyną składowe o wielokrotnościach tej częstotliwości. Zwiększają one wartość skuteczną prądu i straty w falowniku (nagrzewanie tranzystorów, dławików, kondensatorów) bez dodawania mocy czynnej. THD to stosunek wartości skutecznej harmonicznych do składowej podstawowej. Producent podaje, jak bardzo trzeba obniżyć dopuszczalną moc przy danym THD — tej zależności aplikacja nie zna i nie zgaduje, dlatego wpisujesz ją z karty. Współczynnik k dla Twojego THD to interpolacja liniowa między dwoma sąsiednimi wierszami tabeli: k = k1 + (THD − THD1)/(THD2 − THD1)·(k2 − k1). Poza tabelą nie ekstrapolujemy — krzywa jest producenta, nie nasza. Moc dostępna = P_nom·k. Zapas = P_dostępna − P_obciążenia; w procentach względem mocy dostępnej. Czerwono jest tylko wtedy, gdy obciążenie jest większe niż moc dostępna; źródło nie podaje progu „żółtego”, więc go nie ma. Przykład z literatury (THD 25% → 4,1 kW z 5 kW) to ilustracja, nie reguła: Twój falownik może mieć inną krzywą.",
    },
    pola: {
      mocZnamionowa: {
        nazwa: "Moc znamionowa falownika [kW]",
        cel: "Moc czynna, od której liczone jest obniżenie przy odkształconym prądzie.",
        gdzie: "Tabliczka znamionowa albo karta katalogowa falownika (ciągła moc czynna, nie chwilowa).",
        zakres: "Większa od zera.",
      },
      mocObciazenia: {
        nazwa: "Moc czynna obciążenia [kW]",
        cel: "Porównywana z mocą, jaką falownik realnie odda przy Twoim THD.",
        gdzie: "Suma mocy odbiorników pracujących jednocześnie (Moduł 2) albo pomiar z licznika/falownika w szczycie.",
        zakres: "Większa od zera; moc czynna w kW, nie pozorna w kVA.",
      },
      thd: {
        nazwa: "THD prądu obciążenia [%]",
        cel: "Wybiera z tabeli współczynnik obniżenia mocy.",
        gdzie: "Analizator jakości energii, dane odbiornika od producenta (pompa ciepła, napęd) albo pomiar elektryka.",
        zakres: "Musi mieścić się w zakresie THD z tabeli — poza nią nie liczymy.",
      },
      tabelaThd: {
        nazwa: "THD w tabeli falownika [%]",
        cel: "Punkt krzywej obniżania mocy podany przez producenta.",
        gdzie: "Karta katalogowa falownika: wykres lub tabela „moc a THD” (derating).",
        zakres: "Co najmniej 2 wiersze, THD rosnąco, od 0.",
      },
      tabelaK: {
        nazwa: "Współczynnik mocy w tabeli (0–1)",
        cel: "Jaką część mocy znamionowej falownik może oddać przy danym THD (np. 0,9 = 90%).",
        gdzie: "Ta sama karta katalogowa; jeśli producent podaje moc w kW, podziel ją przez moc znamionową.",
        zakres: "Od 0 do 1.",
      },
    },
  },
  "turbina-wiatrowa": {
    migawka: {
      oCoChodzi: "Turbina wiatrowa na tabliczce ma moc w kilowatach, ale oddaje ją tylko przy odpowiednio silnym wietrze. Ten ekran szacuje, ile energii dziennie da turbina, gdy znasz średnią prędkość wiatru, a nie każdy podmuch.",
      jakDziala: "1) Wpisujesz średnią prędkość wiatru na wysokości piasty turbiny. 2) Wpisujesz z karty turbiny krzywą mocy: kilka punktów „przy tej prędkości wiatru turbina oddaje tyle kW” (min. 3, prędkość rosnąco). 3) Wpisujesz prędkość wyłączenia (powyżej niej turbina staje) i współczynnik dostępności i strat od 0 do 1 (postoje, zacienienie przez zabudowę, straty w przewodach i regulatorze). 4) Aplikacja zakłada typowy rozkład prędkości wiatru (Rayleigha) o Twojej średniej, przemnaża go przez krzywą mocy i sumuje. 5) Pokazuje energię na dobę i średnią moc.",
      poCo: "Turbina z katalogu „5 kW” potrafi dać dobowo kilka razy mniej, niż sugeruje liczba na tabliczce. Wynik pozwala ocenić, czy turbina realnie uzupełni zimowy bilans, zanim ją kupisz.",
      fizyka: "Co i jak liczymy — i dlaczego. Moc turbiny zależy od prędkości wiatru w sposób silnie nieliniowy, więc nie wolno mnożyć mocy przy średniej prędkości przez 24 godziny: liczy się to, jak często wieje z każdą prędkością. Ten rozkład aplikacja przyjmuje jako rozkład Rayleigha: f(v) = (π/2)·(v/v̄²)·exp(−π·v²/(4·v̄²)), gdzie v̄ to Twoja średnia prędkość. Energia doby: E = 24·A·∫P(v)·f(v)dv, całka od 0 do prędkości wyłączenia, liczona numerycznie z krokiem 0,1 m/s; A to współczynnik dostępności i strat. Krzywą mocy znasz tylko w punktach — między nimi interpolujemy po prostej, poniżej pierwszego punktu moc to 0, powyżej ostatniego jest równa mocy ostatniego punktu aż do prędkości wyłączenia, a potem 0. Ważne: rozkład jest założony, nie zmierzony. Na prawdziwej działce wiatr może wiać inaczej (osłonięta dolina, wzgórze), a wynik zależy od rozkładu — dlatego traktuj go jako szacunek. Przykład z literatury (1 kW przy 6 m/s → ok. 3 kWh na dobę) to ilustracja, nie reguła: bez krzywej mocy nie da się go odtworzyć. Oblodzenie łopat przy mrozie i wysokiej wilgotności nie jest tu liczone.",
    },
    pola: {
      sredniaPredkosc: {
        nazwa: "Średnia prędkość wiatru na wysokości piasty [m/s]",
        cel: "Parametr rozkładu Rayleigha, z którego liczona jest częstość poszczególnych prędkości wiatru.",
        gdzie: "Pomiar anemometrem na wysokości piasty, atlas wiatrowy dla lokalizacji albo dane stacji meteo — pamiętaj, że wiatr rośnie z wysokością.",
        zakres: "Większa od zera.",
      },
      krzywaV: {
        nazwa: "Prędkość wiatru w punkcie krzywej [m/s]",
        cel: "Punkt krzywej mocy podany przez producenta.",
        gdzie: "Karta katalogowa turbiny: wykres lub tabela „moc a prędkość wiatru”.",
        zakres: "Co najmniej 3 punkty, prędkość rosnąco.",
      },
      krzywaP: {
        nazwa: "Moc turbiny w punkcie krzywej [kW]",
        cel: "Moc elektryczna, jaką turbina oddaje przy danej prędkości wiatru.",
        gdzie: "Ta sama karta katalogowa, kolumna lub oś mocy.",
        zakres: "Zero lub więcej.",
      },
      predkoscWylaczenia: {
        nazwa: "Prędkość wyłączenia [m/s]",
        cel: "Prędkość, od której turbina staje (ochrona przed wichurą); powyżej niej moc to 0.",
        gdzie: "Karta turbiny: „cut-out wind speed”.",
        zakres: "Nie mniejsza niż ostatni punkt krzywej; do 100 m/s (limit obliczeń).",
      },
      wspolczynnikDostepnosci: {
        nazwa: "Współczynnik dostępności i strat (0–1)",
        cel: "Uwzględnia postoje, zaburzenia wiatru przez zabudowę i drzewa oraz straty elektryczne.",
        gdzie: "Wpisujesz sam: z danych producenta albo własnej oceny (np. 0,8 = 80% energii dociera do instalacji). Aplikacja nie zakłada żadnej wartości.",
        zakres: "Od 0 do 1.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "deep-winter-budget": {
    migawka: {
      oCoChodzi:
        "Energy in winter is like a salary — you have to manage it so it lasts until „payday”, i.e. until spring. This screen watches the budget of one winter month: it compares what you have used so far with what you planned.",
      jakDziala:
        "1) You enter the month's plan: how much PV will give, how much the generator and how much usable reserve from storage you assign to this month — the plan P is their sum. 2) You enter which day of the month it is and how much energy was used since day 1. 3) The app computes the budget for today (the plan spread evenly over the days), what is left of the whole plan, the current daily pace and the pace allowed for the rest of the month, and the month-end forecast. 4) If you are over budget, it gives by what percentage consumption must be cut for the remaining days, and — if you enter the heating share and the temperature difference — by how many degrees to lower the indoor temperature. 5) Optionally you split the plan into categories (heating, hot water, pumps, light, the rest) and see which one is ahead of its budget.",
      poCo: "Without this you find out about a shortage in the last week of the month, when only drastic decisions are left. Mid-month it is enough to lower the temperature by a degree or two.",
      fizyka:
        "What we compute — and why. Plan P = PV + generator + storage [kWh]. Cumulative budget for day d of N: B = P·d/N — we assume you spend the plan evenly; it is the simplest honest reference line, but winter consumption is uneven. Deviation = consumption/B − 1. Left = P − consumption. Current pace = consumption/d; allowed pace = (P − consumption)/(N − d): that is what you can use per day to make it to the end. Month-end forecast = consumption/d·N. Required cut r = 1 − allowed/current. Heating: heating power is roughly proportional to the indoor–outdoor temperature difference ΔT, so lowering the temperature by 1 K reduces heating consumption by 1/ΔT of its value, and total consumption by share/ΔT. Required lowering = r·ΔT/share. This is a stationary approximation — it ignores internal gains and the building's inertia, so treat the result as an order of magnitude. Note: „forecast above the plan” and „consumption above the budget” are the same condition (consumption/d·N > P ⇔ consumption > P·d/N), so yellow means „over budget, still recoverable” and red means „the plan is already used up, or even switching the heating off is not enough”. The limit comes from the energy balance, not from a standard.",
    },
    pola: {
      dniMiesiaca: {
        nazwa: "Days in the month",
        cel: "Spreads the plan over the days: one day's budget is the plan divided by this number.",
        gdzie: "Calendar (January 31, February 28 or 29, December 31).",
        zakres: "Whole number 28–31.",
      },
      biezacyDzien: {
        nazwa: "Current day of the month",
        cel: "Says how many days have passed — today's budget and the pace for the rest of the month depend on it.",
        gdzie: "Calendar; enter the day up to which you have the consumption reading (inclusive).",
        zakres: "Whole number from 1 to the number of days in the month.",
      },
      planPv: {
        nazwa: "Planned PV production in the month [kWh]",
        cel: "The first source of the plan — together with the generator and storage it gives all the energy to spend.",
        gdzie: "Module 3 (monthly production) or your cautious estimate for this month.",
        zakres: "Your installation; 0 if you do not count PV this month.",
      },
      planAgregat: {
        nazwa: "Planned generator energy [kWh]",
        cel: "The energy you intend to produce with the generator this month.",
        gdzie: "The „Monthly deficits and the generator” screen (the month's deficit) or your generator run plan.",
        zakres: "Empty or 0 = no generator.",
      },
      planMagazyn: {
        nazwa: "Usable storage reserve for this month [kWh]",
        cel: "Battery energy you may spend this month (after subtracting the emergency reserve).",
        gdzie: "Usable capacity from Module 4 minus the stock you want to leave for the following months.",
        zakres: "No more than the battery's usable capacity.",
      },
      zuzycie: {
        nazwa: "Consumption from day 1 to today [kWh]",
        cel: "Energy spent so far — compared with today's budget.",
        gdzie: "Energy meter / inverter / monitoring: the house's consumption summed since the start of the month (including generator and heating).",
        zakres: "Greater than zero.",
      },
      celUdzial: {
        nazwa: "Category share of the plan [%]",
        cel: "What part of the month's plan you give to this category; the category budget is computed from it.",
        gdzie: "Your decision — usually from consumption history or Modules 2 and 6.",
        zakres: "0–100%, all categories together up to 100%.",
      },
      celZuzycie: {
        nazwa: "Category consumption from day 1 to today [kWh]",
        cel: "How much of the consumption so far went to this category.",
        gdzie: "A sub-meter or an estimate: heating, hot water, pumps, lighting.",
        zakres: "No more than the total consumption.",
      },
      udzialOgrzewania: {
        nazwa: "Heating share of consumption [%]",
        cel: "Lets the required cut in consumption be converted into degrees of temperature reduction.",
        gdzie: "A heating sub-meter or Module 6: heating consumption divided by total consumption.",
        zakres: "0–100%; empty = no conversion to degrees.",
      },
      roznicaTemperatur: {
        nazwa: "Mean indoor–outdoor temperature difference [K]",
        cel: "It sets how much heating falls after lowering the temperature by 1 K (by 1/ΔT).",
        gdzie: "Indoor temperature minus the mean outdoor temperature of recent days.",
        zakres: "Greater than zero; in winter typically from over ten to a few dozen kelvins.",
      },
      oszczednoscNaK: {
        nazwa: "Own saving per 1 K lower temperature [kWh/day]",
        cel: "Replaces the „1/ΔT” approximation when you know it from your own measurements.",
        gdzie: "From the meter: by how many kWh per day consumption fell when you lowered the indoor temperature by 1 K (compare similar days).",
        zakres: "Greater than zero; empty = the stationary approximation from the temperature difference.",
      },
    },
  },
  "falownik-thd": {
    migawka: {
      oCoChodzi: "An inverter has a power in kilowatts on its plate, but that is the power for a „smooth” current. When a load (heat pump, motors, power supplies) distorts the current, the inverter runs hotter and the manufacturer makes it deliver less. This screen checks whether the power is still enough.",
      jakDziala: "1) You enter the inverter's rated power and the active power of the load. 2) You enter the THD of the load current (from a power analyser or the appliance datasheet). 3) From the inverter datasheet you enter a table: for several THD values, what share of the rated power the inverter can then deliver (0–1); at least 2 rows, THD ascending. 4) The app reads the coefficient for your THD (between rows it follows a straight line), multiplies it by the rated power and compares it with the load. 5) It shows the margin in kW and in percent or — when the load is higher — a red stop.",
      poCo: "An inverter sized „to the limit” by its plate may trip on overload in winter while the heat pump runs. It is better to see this during planning than in the middle of a frost.",
      fizyka: "What we compute — and why. A distorted current contains harmonics: besides the fundamental component (50 Hz) there are components at multiples of that frequency. They increase the RMS value of the current and the losses in the inverter (heating of transistors, chokes, capacitors) without adding any active power. THD is the ratio of the RMS value of the harmonics to the fundamental component. The manufacturer states how much the permissible power must be reduced at a given THD — the app does not know this relation and does not guess it, so you type it in from the datasheet. The coefficient k for your THD is a linear interpolation between two neighbouring table rows: k = k1 + (THD − THD1)/(THD2 − THD1)·(k2 − k1). Outside the table we do not extrapolate — the curve is the manufacturer's, not ours. Available power = P_nom·k. Margin = P_available − P_load; in percent relative to the available power. It is red only when the load is higher than the available power; the source gives no „yellow” limit, so there is none. The literature example (THD 25% → 4.1 kW of 5 kW) is an illustration, not a rule: your inverter may have a different curve.",
    },
    pola: {
      mocZnamionowa: {
        nazwa: "Inverter rated power [kW]",
        cel: "The active power from which the derating at a distorted current is counted.",
        gdzie: "Rating plate or datasheet of the inverter (continuous active power, not peak).",
        zakres: "Greater than zero.",
      },
      mocObciazenia: {
        nazwa: "Active power of the load [kW]",
        cel: "Compared with the power the inverter will really deliver at your THD.",
        gdzie: "Sum of the appliances running at the same time (Module 2) or a meter/inverter reading at the peak.",
        zakres: "Greater than zero; active power in kW, not apparent power in kVA.",
      },
      thd: {
        nazwa: "THD of the load current [%]",
        cel: "Selects the derating coefficient from the table.",
        gdzie: "Power quality analyser, the appliance manufacturer's data (heat pump, drive) or an electrician's measurement.",
        zakres: "Must lie within the THD range of the table — nothing is computed outside it.",
      },
      tabelaThd: {
        nazwa: "THD in the inverter table [%]",
        cel: "A point of the manufacturer's derating curve.",
        gdzie: "Inverter datasheet: the „power vs. THD” chart or table (derating).",
        zakres: "At least 2 rows, THD ascending, starting from 0.",
      },
      tabelaK: {
        nazwa: "Power coefficient in the table (0–1)",
        cel: "What share of the rated power the inverter can deliver at the given THD (e.g. 0.9 = 90%).",
        gdzie: "The same datasheet; if the manufacturer gives power in kW, divide it by the rated power.",
        zakres: "From 0 to 1.",
      },
    },
  },
  "turbina-wiatrowa": {
    migawka: {
      oCoChodzi: "A wind turbine has a power in kilowatts on its plate, but it delivers it only in a sufficiently strong wind. This screen estimates how much energy per day the turbine gives when you know the mean wind speed, not every gust.",
      jakDziala: "1) You enter the mean wind speed at the turbine's hub height. 2) From the turbine datasheet you enter the power curve: several points „at this wind speed the turbine delivers this many kW” (at least 3, speed ascending). 3) You enter the cut-out speed (above it the turbine stops) and the availability and loss factor from 0 to 1 (downtime, shading by buildings, losses in cables and the controller). 4) The app assumes a typical wind-speed distribution (Rayleigh) with your mean, multiplies it by the power curve and sums up. 5) It shows the energy per day and the mean power.",
      poCo: "A „5 kW” turbine from a catalogue may give several times less per day than the number on the plate suggests. The result lets you judge whether the turbine will really add to the winter balance before you buy it.",
      fizyka: "What we compute — and why. The turbine's power depends on wind speed in a strongly nonlinear way, so you must not multiply the power at the mean speed by 24 hours: what counts is how often each speed occurs. The app takes this distribution as a Rayleigh distribution: f(v) = (π/2)·(v/v̄²)·exp(−π·v²/(4·v̄²)), where v̄ is your mean speed. Energy per day: E = 24·A·∫P(v)·f(v)dv, the integral from 0 to the cut-out speed, computed numerically with a step of 0.1 m/s; A is the availability and loss factor. The power curve is known only at points — between them we interpolate along a straight line, below the first point the power is 0, above the last one it equals the power of the last point up to the cut-out speed, and then 0. Important: the distribution is assumed, not measured. At a real site the wind may blow differently (a sheltered valley, a hill), and the result depends on the distribution — so treat it as an estimate. The literature example (1 kW at 6 m/s → about 3 kWh per day) is an illustration, not a rule: it cannot be reproduced without a power curve. Icing of the blades in frost and high humidity is not computed here.",
    },
    pola: {
      sredniaPredkosc: {
        nazwa: "Mean wind speed at hub height [m/s]",
        cel: "The parameter of the Rayleigh distribution from which the frequency of each wind speed is computed.",
        gdzie: "Anemometer measurement at hub height, a wind atlas for the location or weather-station data — remember that wind grows with height.",
        zakres: "Greater than zero.",
      },
      krzywaV: {
        nazwa: "Wind speed at the curve point [m/s]",
        cel: "A point of the power curve given by the manufacturer.",
        gdzie: "Turbine datasheet: the „power vs. wind speed” chart or table.",
        zakres: "At least 3 points, speed ascending.",
      },
      krzywaP: {
        nazwa: "Turbine power at the curve point [kW]",
        cel: "The electrical power the turbine delivers at the given wind speed.",
        gdzie: "The same datasheet, the power column or axis.",
        zakres: "Zero or more.",
      },
      predkoscWylaczenia: {
        nazwa: "Cut-out speed [m/s]",
        cel: "The speed from which the turbine stops (storm protection); above it the power is 0.",
        gdzie: "Turbine datasheet: „cut-out wind speed”.",
        zakres: "Not lower than the last curve point; up to 100 m/s (calculation limit).",
      },
      wspolczynnikDostepnosci: {
        nazwa: "Availability and loss factor (0–1)",
        cel: "Accounts for downtime, wind disturbance by buildings and trees, and electrical losses.",
        gdzie: "You enter it yourself: from manufacturer data or your own assessment (e.g. 0.8 = 80% of the energy reaches the installation). The app assumes no value.",
        zakres: "From 0 to 1.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "deep-winter-budget": {
    migawka: {
      oCoChodzi:
        "Энергия зимой как зарплата — ею нужно управлять, чтобы хватило до «получки», то есть до весны. Этот экран следит за бюджетом одного зимнего месяца: сравнивает то, что вы израсходовали к сегодняшнему дню, с тем, что запланировали.",
      jakDziala:
        "1) Вы вводите план месяца: сколько даст PV, сколько генератор и какой полезный резерв накопителя вы отводите на этот месяц — план P это их сумма. 2) Вводите, какой сегодня день месяца и сколько энергии израсходовано с 1-го дня. 3) Приложение считает бюджет на сегодня (план, поровну разложенный по дням), сколько осталось от всего плана, текущий и допустимый на остаток месяца суточный темп и прогноз на конец месяца. 4) Если вы выше бюджета, оно показывает, на сколько процентов нужно сократить потребление на оставшиеся дни, а при вводе доли отопления и разности температур — на сколько градусов снизить температуру в доме. 5) По желанию вы делите план на категории (отопление, горячая вода, насосы, свет, остальное) и видите, какая из них опережает свой бюджет.",
      poCo: "Без этого о нехватке энергии узнаёшь в последнюю неделю месяца, когда остаются только радикальные решения. В середине месяца достаточно снизить температуру на градус-два.",
      fizyka:
        "Что и как считаем — и почему. План P = PV + генератор + накопитель [кВт·ч]. Нарастающий бюджет на день d из N: B = P·d/N — предполагаем, что план тратится равномерно; это простейшая честная опорная линия, но зимой потребление неравномерно. Отклонение = потребление/B − 1. Осталось = P − потребление. Текущий темп = потребление/d; допустимый темп = (P − потребление)/(N − d): столько можно тратить в сутки, чтобы дотянуть до конца. Прогноз конца месяца = потребление/d·N. Необходимое сокращение r = 1 − допустимый/текущий. Отопление: мощность отопления примерно пропорциональна разности температур внутри–снаружи ΔT, поэтому снижение температуры на 1 К уменьшает потребление отопления на 1/ΔT его величины, а всего потребления — на долю/ΔT. Необходимое снижение = r·ΔT/доля. Это стационарное приближение — не учитывает внутренние теплопритоки и инерцию здания, считайте результат порядком величины. Важно: «прогноз больше плана» и «потребление больше бюджета» — одно и то же условие (потребление/d·N > P ⇔ потребление > P·d/N), поэтому жёлтый означает «выше бюджета, ещё можно спасти», а красный — «план уже исчерпан или даже отключение отопления не поможет». Граница вытекает из энергетического баланса, а не из нормы.",
    },
    pola: {
      dniMiesiaca: {
        nazwa: "Число дней в месяце",
        cel: "Раскладывает план по дням: бюджет одного дня — это план, делённый на это число.",
        gdzie: "Календарь (январь 31, февраль 28 или 29, декабрь 31).",
        zakres: "Целое число 28–31.",
      },
      biezacyDzien: {
        nazwa: "Текущий день месяца",
        cel: "Показывает, сколько дней прошло — от этого зависят бюджет на сегодня и темп на остаток месяца.",
        gdzie: "Календарь; укажите день, до которого у вас есть показания потребления (включительно).",
        zakres: "Целое число от 1 до числа дней месяца.",
      },
      planPv: {
        nazwa: "Запланированная выработка PV за месяц [кВт·ч]",
        cel: "Первый источник плана — вместе с генератором и накопителем даёт всю энергию для расходования.",
        gdzie: "Модуль 3 (месячная выработка) или ваша осторожная оценка на этот месяц.",
        zakres: "Ваша установка; 0, если PV в этом месяце не учитываете.",
      },
      planAgregat: {
        nazwa: "Запланированная энергия генератора [кВт·ч]",
        cel: "Энергия, которую вы намерены выработать генератором в этом месяце.",
        gdzie: "Экран «Месячные дефициты и генератор» (дефицит месяца) или ваш план работы генератора.",
        zakres: "Пусто или 0 = без генератора.",
      },
      planMagazyn: {
        nazwa: "Полезный резерв накопителя на этот месяц [кВт·ч]",
        cel: "Энергия батареи, которую можно израсходовать в этом месяце (за вычетом аварийного резерва).",
        gdzie: "Полезная ёмкость из Модуля 4 за вычетом запаса, который вы хотите оставить на следующие месяцы.",
        zakres: "Не больше полезной ёмкости батареи.",
      },
      zuzycie: {
        nazwa: "Потребление с 1-го дня до сегодня [кВт·ч]",
        cel: "Израсходованная к настоящему моменту энергия — сравнивается с бюджетом на сегодня.",
        gdzie: "Счётчик энергии / инвертор / мониторинг: потребление дома с начала месяца (включая генератор и отопление).",
        zakres: "Больше нуля.",
      },
      celUdzial: {
        nazwa: "Доля категории в плане [%]",
        cel: "Какую часть плана месяца вы отводите на эту категорию; по ней считается бюджет категории.",
        gdzie: "Ваше решение — обычно по истории потребления или Модулям 2 и 6.",
        zakres: "0–100%, все категории вместе до 100%.",
      },
      celZuzycie: {
        nazwa: "Потребление категории с 1-го дня до сегодня [кВт·ч]",
        cel: "Сколько из потребления на сегодня пошло на эту категорию.",
        gdzie: "Субсчётчик или оценка: отопление, горячая вода, насосы, освещение.",
        zakres: "Не больше общего потребления.",
      },
      udzialOgrzewania: {
        nazwa: "Доля отопления в потреблении [%]",
        cel: "Позволяет пересчитать необходимое сокращение потребления в градусы снижения температуры.",
        gdzie: "Субсчётчик отопления или Модуль 6: потребление на отопление, делённое на общее потребление.",
        zakres: "0–100%; пусто = без пересчёта в градусы.",
      },
      roznicaTemperatur: {
        nazwa: "Средняя разность температур внутри–снаружи [К]",
        cel: "От неё зависит, насколько уменьшится отопление при снижении температуры на 1 К (на 1/ΔT).",
        gdzie: "Температура в доме минус средняя наружная температура последних дней.",
        zakres: "Больше нуля; зимой обычно от десятка до нескольких десятков кельвинов.",
      },
      oszczednoscNaK: {
        nazwa: "Собственная экономия на 1 К более низкой температуры [кВт·ч/сутки]",
        cel: "Заменяет приближение «1/ΔT», если вы знаете её по собственным измерениям.",
        gdzie: "По счётчику: на сколько кВт·ч в сутки упало потребление, когда вы снизили температуру в доме на 1 К (сравнивайте похожие сутки).",
        zakres: "Больше нуля; пусто = стационарное приближение по разности температур.",
      },
    },
  },
  "falownik-thd": {
    migawka: {
      oCoChodzi: "У инвертора на табличке указана мощность в киловаттах, но это мощность для «гладкого» тока. Когда потребитель (тепловой насос, двигатели, блоки питания) искажает ток, инвертор сильнее нагревается, и производитель требует от него отдавать меньше. Этот экран проверяет, хватит ли мощности при этом.",
      jakDziala: "1) Вводите номинальную мощность инвертора и активную мощность нагрузки. 2) Вводите THD тока нагрузки (с анализатора сети или из паспорта потребителя). 3) Из паспорта инвертора вводите таблицу: для нескольких значений THD — какую долю номинальной мощности инвертор может отдать (0–1); минимум 2 строки, THD по возрастанию. 4) Приложение считывает коэффициент для вашего THD (между строками — по прямой), умножает на номинальную мощность и сравнивает с нагрузкой. 5) Показывает запас в кВт и в процентах или — если нагрузка больше — красный стоп.",
      poCo: "Инвертор, подобранный «впритык» по табличке, зимой при работающем тепловом насосе может отключаться по перегрузке. Лучше увидеть это при планировании, чем посреди мороза.",
      fizyka: "Что и как считаем — и почему. Искажённый ток содержит гармоники: кроме основной составляющей (50 Гц) текут составляющие с кратными частотами. Они увеличивают действующее значение тока и потери в инверторе (нагрев транзисторов, дросселей, конденсаторов), не добавляя активной мощности. THD — отношение действующего значения гармоник к основной составляющей. Производитель указывает, насколько надо снизить допустимую мощность при данном THD — эту зависимость приложение не знает и не угадывает, поэтому вы вводите её из паспорта. Коэффициент k для вашего THD — линейная интерполяция между двумя соседними строками таблицы: k = k1 + (THD − THD1)/(THD2 − THD1)·(k2 − k1). Вне таблицы не экстраполируем — кривая принадлежит производителю, а не нам. Доступная мощность = P_ном·k. Запас = P_доступная − P_нагрузки; в процентах относительно доступной мощности. Красным — только если нагрузка больше доступной мощности; источник не даёт «жёлтого» порога, поэтому его нет. Пример из литературы (THD 25% → 4,1 кВт из 5 кВт) — иллюстрация, а не правило: у вашего инвертора кривая может быть другой.",
    },
    pola: {
      mocZnamionowa: {
        nazwa: "Номинальная мощность инвертора [кВт]",
        cel: "Активная мощность, от которой считается снижение при искажённом токе.",
        gdzie: "Табличка или паспорт инвертора (длительная активная мощность, не пиковая).",
        zakres: "Больше нуля.",
      },
      mocObciazenia: {
        nazwa: "Активная мощность нагрузки [кВт]",
        cel: "Сравнивается с мощностью, которую инвертор реально отдаст при вашем THD.",
        gdzie: "Сумма одновременно работающих потребителей (Модуль 2) или показание счётчика/инвертора в пике.",
        zakres: "Больше нуля; активная мощность в кВт, не полная в кВА.",
      },
      thd: {
        nazwa: "THD тока нагрузки [%]",
        cel: "Выбирает из таблицы коэффициент снижения мощности.",
        gdzie: "Анализатор качества электроэнергии, данные производителя потребителя (тепловой насос, привод) или измерение электрика.",
        zakres: "Должно лежать в диапазоне THD таблицы — вне него расчёт не выполняется.",
      },
      tabelaThd: {
        nazwa: "THD в таблице инвертора [%]",
        cel: "Точка кривой снижения мощности от производителя.",
        gdzie: "Паспорт инвертора: график или таблица «мощность от THD» (derating).",
        zakres: "Не менее 2 строк, THD по возрастанию, начиная с 0.",
      },
      tabelaK: {
        nazwa: "Коэффициент мощности в таблице (0–1)",
        cel: "Какую долю номинальной мощности инвертор может отдать при данном THD (например 0,9 = 90%).",
        gdzie: "Тот же паспорт; если производитель даёт мощность в кВт, разделите её на номинальную.",
        zakres: "От 0 до 1.",
      },
    },
  },
  "turbina-wiatrowa": {
    migawka: {
      oCoChodzi: "У ветрогенератора на табличке указана мощность в киловаттах, но он отдаёт её только при достаточно сильном ветре. Этот экран оценивает, сколько энергии в сутки даст турбина, когда вы знаете среднюю скорость ветра, а не каждый порыв.",
      jakDziala: "1) Вводите среднюю скорость ветра на высоте ступицы турбины. 2) Из паспорта турбины вводите кривую мощности: несколько точек «при этой скорости ветра турбина отдаёт столько кВт» (минимум 3, скорость по возрастанию). 3) Вводите скорость отключения (выше неё турбина останавливается) и коэффициент доступности и потерь от 0 до 1 (простои, затенение застройкой, потери в проводах и контроллере). 4) Приложение предполагает типичное распределение скорости ветра (Рэлея) с вашей средней, умножает его на кривую мощности и суммирует. 5) Показывает энергию за сутки и среднюю мощность.",
      poCo: "Турбина «5 кВт» из каталога может давать в сутки в несколько раз меньше, чем подсказывает число на табличке. Результат позволяет оценить, действительно ли турбина дополнит зимний баланс, до покупки.",
      fizyka: "Что и как считаем — и почему. Мощность турбины сильно нелинейно зависит от скорости ветра, поэтому нельзя умножать мощность при средней скорости на 24 часа: важно, как часто бывает каждая скорость. Это распределение приложение принимает как распределение Рэлея: f(v) = (π/2)·(v/v̄²)·exp(−π·v²/(4·v̄²)), где v̄ — ваша средняя скорость. Энергия за сутки: E = 24·A·∫P(v)·f(v)dv, интеграл от 0 до скорости отключения, считается численно с шагом 0,1 м/с; A — коэффициент доступности и потерь. Кривая мощности известна только в точках — между ними интерполируем по прямой, ниже первой точки мощность 0, выше последней равна мощности последней точки до скорости отключения, затем 0. Важно: распределение предположено, а не измерено. На реальном участке ветер может дуть иначе (защищённая долина, холм), а результат зависит от распределения — поэтому считайте его оценкой. Пример из литературы (1 кВт при 6 м/с → около 3 кВт·ч в сутки) — иллюстрация, а не правило: без кривой мощности его не воспроизвести. Обледенение лопастей при морозе и высокой влажности здесь не считается.",
    },
    pola: {
      sredniaPredkosc: {
        nazwa: "Средняя скорость ветра на высоте ступицы [м/с]",
        cel: "Параметр распределения Рэлея, по которому считается частота каждой скорости ветра.",
        gdzie: "Измерение анемометром на высоте ступицы, ветровой атлас местности или данные метеостанции — помните, что ветер растёт с высотой.",
        zakres: "Больше нуля.",
      },
      krzywaV: {
        nazwa: "Скорость ветра в точке кривой [м/с]",
        cel: "Точка кривой мощности от производителя.",
        gdzie: "Паспорт турбины: график или таблица «мощность от скорости ветра».",
        zakres: "Не менее 3 точек, скорость по возрастанию.",
      },
      krzywaP: {
        nazwa: "Мощность турбины в точке кривой [кВт]",
        cel: "Электрическая мощность, которую турбина отдаёт при данной скорости ветра.",
        gdzie: "Тот же паспорт, столбец или ось мощности.",
        zakres: "Ноль или больше.",
      },
      predkoscWylaczenia: {
        nazwa: "Скорость отключения [м/с]",
        cel: "Скорость, с которой турбина останавливается (защита от бури); выше неё мощность 0.",
        gdzie: "Паспорт турбины: «cut-out wind speed».",
        zakres: "Не меньше последней точки кривой; до 100 м/с (предел расчёта).",
      },
      wspolczynnikDostepnosci: {
        nazwa: "Коэффициент доступности и потерь (0–1)",
        cel: "Учитывает простои, искажение ветра застройкой и деревьями, электрические потери.",
        gdzie: "Вводите сами: из данных производителя или собственной оценки (например 0,8 = 80% энергии доходит до установки). Приложение не предполагает никакого значения.",
        zakres: "От 0 до 1.",
      },
    },
  },
}
