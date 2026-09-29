/**
 * Help content — Module 8 (safety and emergencies). Thresholds from engine constants enter through
 * `{params}` (`MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM`, `MIN_CZUJNIKOW_POTWIERDZENIA`).
 */
import type { Tlumaczenie } from "./typy"

const Z_KARTY = "zakres z karty katalogowej urządzenia — aplikacja nie przyjmuje typowej wartości za Ciebie."

export const pl = {
  "audyt-pozarowy": {
    migawka: {
      oCoChodzi:
        "Regularny przegląd, czy w razie pożaru wszystko zadziała tak, jak powinno — żeby nie odkryć zepsutego czujnika dopiero w trakcie prawdziwego pożaru.",
      jakDziala:
        "Aplikacja zestawia elementy ochrony (czujniki, centrala, oświetlenie awaryjne, zasilanie awaryjne, gaszenie) i pokazuje, które są sprawne, które wymagają uwagi, a które są niesprawne. Na razie działa na danych demonstracyjnych — prawdziwy stan przyjdzie z telemetrii (Tryb Live).",
      poCo:
        "Każdy element ochrony pożarowej psuje się po cichu: bateria w czujce, lampa awaryjna, akumulator UPS. Audyt znajduje to, zanim będzie potrzebne.",
    },
    pola: {},
  },
  "awaryjne-zrodlo-ciepla": {
    migawka: {
      oCoChodzi:
        "Ogień to najstarsze źródło ciepła — w off-gridzie wraca jako sensowna rezerwa, o ile jest bezpiecznie zintegrowany z resztą systemu. Ile ciepła da kominek i ile drewna zje?",
      jakDziala:
        "Energia cieplna = moc × czas palenia. Jeśli kominek ma płaszcz wodny, aplikacja liczy, jaką część dobowego zapotrzebowania na ciepło w mroźny dzień pokryje moc oddawana do wody. Ilość paliwa: energia ÷ (sprawność × wartość opałowa).",
      poCo:
        "Żeby wiedzieć, czy kominek naprawdę uratuje dom przy awarii pompy ciepła albo braku prądu, i ile drewna trzeba mieć w zapasie na mroźny tydzień.",
      fizyka:
        "Wartość opałowa drewna mocno zależy od wilgotności — mokre drewno część energii zużywa na odparowanie wody, dlatego wartość bierzesz od dostawcy, nie z tabeli.",
    },
    pola: {
      typ: {
        nazwa: "Typ źródła ciepła",
        cel: "Kominek, koza albo piec na drewno — rodzaj urządzenia, którego dotyczą dane z karty.",
        gdzie: "Z tabliczki albo instrukcji urządzenia.",
        zakres: "Kominek, koza albo piec na drewno.",
      },
      moc: {
        nazwa: "Nominalna moc cieplna [kW]",
        cel: "Ile ciepła urządzenie oddaje w czasie palenia. Razem z czasem palenia daje energię na dobę.",
        gdzie: "Z karty katalogowej albo tabliczki znamionowej urządzenia.",
        zakres: Z_KARTY,
      },
      czas: {
        nazwa: "Czas palenia w dobie [h]",
        cel: "Ile godzin na dobę urządzenie pracuje z mocą nominalną.",
        gdzie: "Twój realny tryb palenia — np. wieczór i noc w mrozie.",
        zakres: "0–24 h.",
      },
      mocWoda: {
        nazwa: "Moc oddawana do wody [kW]",
        cel: "Część mocy, którą płaszcz wodny przekazuje do instalacji c.o. — tylko ta część ogrzewa cały dom, reszta grzeje pomieszczenie z kominkiem.",
        gdzie: "Z karty katalogowej (moc do wody / moc płaszcza). Bez płaszcza wodnego — 0.",
        zakres: Z_KARTY,
      },
      zapotrzebowanie: {
        nazwa: "Zapotrzebowanie na ciepło w mroźny dzień [kWh/dobę]",
        cel: "Ile ciepła dom traci w najzimniejszy dzień. Porównywane z tym, co da płaszcz wodny.",
        gdzie: "Z Modułu 6 — „Zapotrzebowanie na C.O. i C.W.U.” albo „Straty ciepła budynku”.",
        zakres: "Wynik z Modułu 6 dla Twojego budynku.",
      },
      sprawnosc: {
        nazwa: "Sprawność urządzenia [%]",
        cel: "Jaka część energii z drewna trafia do domu jako ciepło. Im niższa, tym więcej drewna na tę samą ilość ciepła.",
        gdzie: "Z karty katalogowej urządzenia.",
        zakres: "Z karty — typowo 60–80%.",
      },
      wartoscOpalowa: {
        nazwa: "Wartość opałowa paliwa [kWh/kg]",
        cel: "Ile energii zawiera kilogram paliwa. Dzielnik przy obliczaniu, ile paliwa potrzeba.",
        gdzie: "Od dostawcy — zależy od gatunku i wilgotności drewna.",
        zakres: "Wartość od dostawcy paliwa — aplikacja nie przyjmuje jej za Ciebie.",
      },
    },
  },
  "centrala-ssp": {
    migawka: {
      oCoChodzi:
        "Centrala sygnalizacji pożaru to serce ochrony — sterownik domu musi z nią „rozmawiać” bez zakłóceń, bo od niej zależy, czy reszta systemu w ogóle dowie się o zagrożeniu.",
      jakDziala:
        "Aplikacja sprawdza, jak sterownik jest połączony z centralą (styki bezpotencjałowe albo RS485), czy odbiera trzy sygnały — alarm, awarię i rozbrojenie — i w jakim stanie jest centrala. Centrala zgłaszająca awarię to czerwony stop.",
      poCo:
        "Jeśli sterownik nie odbiera sygnału alarmu, nie wyłączy wentylacji, nie zwolni zamków i nie wezwie pomocy — cała automatyka pożarowa jest wtedy ślepa.",
    },
    pola: {
      polaczenie: {
        nazwa: "Połączenie sterownika z centralą",
        cel: "Styki bezpotencjałowe (proste przekaźniki: alarm, awaria) albo magistrala RS485 (więcej informacji, ale wymaga właściwej konfiguracji).",
        gdzie: "Z dokumentacji centrali — opis wyjść.",
        zakres: "Styki bezpotencjałowe albo RS485.",
      },
      stan: {
        nazwa: "Stan centrali",
        cel: "Dozór oznacza sprawną centralę. Zgłoszona awaria to czerwony stop — centrala może nie wykryć pożaru.",
        gdzie: "Na panelu centrali (dioda/komunikat „dozór” albo „awaria”).",
        zakres: "Dozór albo awaria.",
      },
    },
  },
  "dogrzewanie-paliwem-stalym": {
    migawka: {
      oCoChodzi:
        "Otwarty ogień w domu to realna odpowiedzialność — spalanie zużywa tlen z pomieszczenia i produkuje czad, który nie ma zapachu i zabija we śnie.",
      jakDziala:
        "Aplikacja sprawdza trzy twarde warunki: odległość urządzenia od materiałów palnych (minimum {minOdleglosc} cm), osobny nawiew powietrza do spalania i czujnik czadu w pomieszczeniu. Brak któregokolwiek to czerwony stop.",
      poCo:
        "Szczelny, energooszczędny dom z rekuperacją potrafi „wyssać” spaliny z kominka do wnętrza. Czujnik czadu i osobny nawiew to najtańsze zabezpieczenie życia.",
      fizyka:
        "Tlenek węgla (CO) powstaje przy niepełnym spalaniu, gdy brakuje tlenu. Wiąże się z hemoglobiną silniej niż tlen — dlatego jest groźny w małych stężeniach.",
    },
    pola: {
      paliwo: {
        nazwa: "Typ paliwa",
        cel: "Drewno, pellet albo węgiel — rodzaj paliwa, którym palisz.",
        gdzie: "Twoje urządzenie i paliwo.",
        zakres: "Drewno, pellet albo węgiel.",
      },
      odleglosc: {
        nazwa: "Odległość od materiałów palnych [cm]",
        cel: "Odstęp urządzenia od drewna, mebli, zasłon i innych materiałów, które mogą się zapalić od promieniowania ciepła.",
        gdzie: "Zmierz od obudowy urządzenia do najbliższego palnego elementu. Sprawdź też instrukcję producenta — może wymagać więcej.",
        zakres: "Minimum {minOdleglosc} cm — poniżej czerwony stop.",
      },
    },
  },
  "klapy-pozarowe": {
    migawka: {
      oCoChodzi:
        "Dym zabija szybciej niż ogień — trzeba go zatrzymać, żeby się nie rozprzestrzenił kanałami wentylacji, a potem sprawnie usunąć.",
      jakDziala:
        "Przy wentylacji mechanicznej (rekuperacji z kanałami) sygnał pożaru musi zamknąć klapy pożarowe i wyłączyć wentylator. Aplikacja sprawdza, czy te reakcje są skonfigurowane. Przy wentylacji grawitacyjnej problem nie występuje.",
      poCo:
        "Działająca rekuperacja w czasie pożaru rozprowadza dym po całym domu w kilka minut — także do sypialni.",
    },
    pola: {
      wentylacja: {
        nazwa: "Rodzaj wentylacji w budynku",
        cel: "Kanały wentylacji mechanicznej mogą roznosić dym — wtedy potrzebne są klapy i wyłączenie wentylatora po alarmie.",
        gdzie: "Twój budynek: rekuperator z kanałami = mechaniczna; kratki bez wentylatora = grawitacyjna.",
        zakres: "Mechaniczna albo grawitacyjna / brak.",
      },
    },
  },
  "modul-gasniczy": {
    migawka: {
      oCoChodzi:
        "Człowiek może nie zdążyć pomyśleć we właściwej kolejności podczas pożaru — system gaśniczy realizuje sprawdzoną sekwencję kroków w ciągu sekund.",
      jakDziala:
        "Aplikacja sprawdza środek gaśniczy względem tego, co jest w strefie: przy magazynie LiFePO4 proszek i CO₂ to czerwony stop (nie chłodzą ogniw, grozi ponowny zapłon), właściwe są mgła wodna albo środek przeznaczony do magazynów energii. Sprawdza też, ile czujników musi potwierdzić pożar (minimum {minCzujnikow}) i czy moduł jest naładowany.",
      poCo:
        "Pożar baterii litowej wytwarza własne ciepło i gazy — zły środek gaśniczy tylko na chwilę zdusi płomień. A gaszenie po jednym, fałszywym sygnale zniszczy sprzęt bez powodu.",
      fizyka:
        "W ogniwie w stanie niekontrolowanego nagrzewania (thermal runaway) reakcja podtrzymuje się sama — trzeba odebrać ciepło (chłodzenie), a nie tylko odciąć tlen.",
    },
    pola: {
      srodek: {
        nazwa: "Środek gaśniczy",
        cel: "Rodzaj środka w module. Przy magazynie litowym decyduje o skuteczności: mgła wodna i środki do magazynów energii chłodzą, proszek i CO₂ nie.",
        gdzie: "Z tabliczki albo karty modułu gaśniczego.",
        zakres: "Opcje z listy. Przy LiFePO4: proszek i CO₂ — czerwony stop.",
      },
      magazyn: {
        nazwa: "Magazyn energii w strefie gaśniczej",
        cel: "Czy w strefie działania modułu stoi magazyn energii i jakiej chemii. Od tego zależy wymagany środek.",
        gdzie: "Twoja instalacja.",
        zakres: "Brak, LiFePO4 albo inna chemia.",
      },
      czujniki: {
        nazwa: "Liczba czujników potwierdzających alarm [szt.]",
        cel: "Ile niezależnych czujników musi potwierdzić pożar, zanim ruszy gaszenie. Chroni przed wyzwoleniem od jednego fałszywego sygnału.",
        gdzie: "Z konfiguracji sterownika modułu gaśniczego.",
        zakres: "Minimum {minCzujnikow} — mniej to ostrzeżenie.",
      },
      stanModulu: {
        nazwa: "Stan modułu gaśniczego",
        cel: "Rozładowany moduł (po wyzwoleniu albo z upływu ciśnienia) nie ugasi pożaru — czerwony stop.",
        gdzie: "Wskaźnik ciśnienia albo stanu na module, protokół przeglądu.",
        zakres: "Sprawny (naładowany) albo rozładowany.",
      },
    },
  },
  "oswietlenie-awaryjne": {
    migawka: {
      oCoChodzi:
        "W dymie nie widać drogi — awaria lampy na trasie ewakuacji musi być widoczna, zanim będzie potrzebna.",
      jakDziala:
        "Wpisujesz lampy na drogach ewakuacji i ich stan z ostatniego testu. Niesprawna lampa to czerwony stop, nietestowana — ostrzeżenie. Aplikacja pyta też o źródło zasilania lamp i o oświetlenie zewnętrzne dla służb.",
      poCo:
        "Lampy awaryjne psują się po cichu — akumulator w lampie traci pojemność i po latach świeci kilka minut zamiast godziny. Test raz na jakiś czas to jedyny sposób, żeby to wiedzieć.",
    },
    pola: {
      zasilanie: {
        nazwa: "Zasilanie lamp awaryjnych",
        cel: "Z UPS (centralnie) albo z własnych akumulatorów w każdej lampie. Przy UPS jego awaria gasi wszystkie lampy naraz.",
        gdzie: "Z projektu instalacji albo opisu lamp.",
        zakres: "Z UPS albo własne akumulatory.",
      },
      miejsce: {
        nazwa: "Miejsce lampy",
        cel: "Gdzie wisi lampa (np. korytarz, schody, wyjście) — żeby wiedzieć, którą naprawić.",
        gdzie: "Twój opis.",
        zakres: "Dowolny tekst.",
      },
      stanLampy: {
        nazwa: "Stan lampy z ostatniego testu",
        cel: "Sprawna, niesprawna albo nietestowana. Niesprawna — czerwony stop, nietestowana — ostrzeżenie.",
        gdzie: "Z testu: odłącz zasilanie lampy i sprawdź, czy świeci przez wymagany czas.",
        zakres: "Sprawna, niesprawna albo nietestowana.",
      },
    },
  },
  "powiadomienia-alarmowe": {
    migawka: {
      oCoChodzi:
        "System nie tylko wykrywa zagrożenie, ale może też wezwać pomoc — ostatnia deska ratunku, gdy nikogo nie ma w domu.",
      jakDziala:
        "Aplikacja sprawdza syrenę, powiadomienia do kontaktów alarmowych i automatyczne wezwanie służb. Automatyczne wezwanie służb bez Twojej wyraźnej zgody to czerwony stop — źródło dopuszcza je tylko za zgodą.",
      poCo:
        "Pożar w pustym domu na odludziu wykryty o 3 w nocy nic nie da, jeśli nikt się o nim nie dowie. Ale fałszywe wezwania służb też kosztują.",
    },
    pola: {
      kontakty: {
        nazwa: "Liczba kontaktów alarmowych [szt.]",
        cel: "Ile osób dostanie powiadomienie o alarmie. Więcej niż jedna osoba to zapas, gdy ktoś nie odbierze.",
        gdzie: "Ty, rodzina, sąsiad, firma ochroniarska.",
        zakres: "Co najmniej jedna osoba; więcej to bezpieczniej.",
      },
    },
  },
  "ups-krytyczny": {
    migawka: {
      oCoChodzi:
        "W pożarze często pada normalne zasilanie — UPS daje systemowi te kluczowe minuty na wykonanie sekwencji bezpieczeństwa, zamiast zamilknąć w najgorszym momencie.",
      jakDziala:
        "Zaznaczasz urządzenia krytyczne (sterownik, router, zamki, centrala, oświetlenie awaryjne) i wpisujesz ich moc. Aplikacja sumuje moc i liczy czas pracy: pojemność × napięcie × sprawność ÷ moc.",
      poCo:
        "Żeby UPS wystarczył na zwolnienie zamków, powiadomienia i oświetlenie ewakuacji. Za mały UPS padnie po kilku minutach — dokładnie wtedy, gdy jest potrzebny.",
      fizyka: "t = (C [Ah] × U [V] × η) / P [W]. Moc urządzeń sprawdzasz na ich tabliczkach — aplikacja nie ma domyślnych mocy.",
    },
    pola: {
      mocUrzadzenia: {
        nazwa: "Moc urządzenia krytycznego [W]",
        cel: "Pobór urządzenia zasilanego z UPS. Sumowany z pozostałymi zaznaczonymi urządzeniami.",
        gdzie: "Z tabliczki, zasilacza albo instrukcji urządzenia.",
        zakres: Z_KARTY,
      },
      pojemnosc: {
        nazwa: "Pojemność akumulatora UPS [Ah]",
        cel: "Razem z napięciem daje energię, z której liczony jest czas pracy.",
        gdzie: "Z karty UPS albo naklejki akumulatora.",
        zakres: Z_KARTY,
      },
      napiecie: {
        nazwa: "Napięcie systemu UPS [V]",
        cel: "Napięcie akumulatorów UPS — zamienia Ah na Wh.",
        gdzie: "Z karty UPS (napięcie baterii, np. 12, 24 albo 48 V).",
        zakres: Z_KARTY,
      },
    },
  },
  "zamki-drzwi-ewakuacyjnych": {
    migawka: {
      oCoChodzi:
        "W pożarze nie może być zablokowanych drzwi — dobra zasada projektowa to „fail-safe”: brak prądu = drzwi otwarte, nigdy odwrotnie.",
      jakDziala:
        "Aplikacja sprawdza typ zamka i jego zachowanie przy zaniku prądu. Zamek, który blokuje drzwi bez prądu (fail-secure) i nie ma zasilania awaryjnego, to czerwony stop. Sprawdza też zwalnianie po alarmie pożarowym, przycisk ewakuacyjny i kontaktron.",
      poCo:
        "W pożarze prąd pada często w pierwszych minutach. Zamek, który wtedy się blokuje, zamyka ludzi w środku.",
    },
    pola: {
      typ: {
        nazwa: "Typ zamka",
        cel: "Zwora elektromagnetyczna (trzyma, gdy jest prąd), elektrozaczep albo siłownik drzwi — od typu zależy typowe zachowanie przy zaniku prądu.",
        gdzie: "Z opisu zamka albo od instalatora.",
        zakres: "Zwora, elektrozaczep albo siłownik.",
      },
      zanikPradu: {
        nazwa: "Zachowanie zamka przy zaniku prądu",
        cel: "Fail-safe otwiera drzwi bez prądu (właściwe dla drogi ewakuacji), fail-secure je blokuje. „Nie wiem” aplikacja traktuje jak blokowanie — to strona bezpieczna.",
        gdzie: "Z karty katalogowej zamka (tryb NC/NO, fail-safe/fail-secure) albo sprawdź, odłączając zasilanie przy otwartych drzwiach.",
        zakres: "Otwiera, blokuje albo nie wiem.",
      },
    },
  },
}

const Z_KARTY_EN = "range from the device datasheet — the app does not assume a typical value for you."

export const en: Tlumaczenie<typeof pl> = {
  "audyt-pozarowy": {
    migawka: {
      oCoChodzi:
        "A regular check that everything will work as it should in a fire — so you don't discover a broken detector only during a real fire.",
      jakDziala:
        "The app lists the protection elements (detectors, control panel, emergency lighting, backup power, extinguishing) and shows which are working, which need attention and which are faulty. For now it works on demonstration data — the real state will come from telemetry (Live mode).",
      poCo:
        "Every fire protection element fails silently: a detector battery, an emergency lamp, a UPS battery. The audit finds it before it is needed.",
    },
    pola: {},
  },
  "awaryjne-zrodlo-ciepla": {
    migawka: {
      oCoChodzi:
        "Fire is the oldest source of heat — off-grid it returns as a sensible reserve, as long as it is safely integrated with the rest of the system. How much heat will a fireplace give and how much wood will it burn?",
      jakDziala:
        "Heat energy = power × burning time. If the fireplace has a water jacket, the app calculates what part of the daily heat demand on a frosty day the power delivered to water will cover. Amount of fuel: energy ÷ (efficiency × calorific value).",
      poCo:
        "To know whether the fireplace will really save the house when the heat pump fails or there is no power, and how much wood you need in stock for a frosty week.",
      fizyka:
        "The calorific value of wood depends heavily on moisture — wet wood uses part of its energy to evaporate water, which is why you take the value from the supplier, not from a table.",
    },
    pola: {
      typ: {
        nazwa: "Type of heat source",
        cel: "Fireplace, stove or wood-burning furnace — the device the datasheet data refer to.",
        gdzie: "From the device nameplate or manual.",
        zakres: "Fireplace, stove or wood furnace.",
      },
      moc: {
        nazwa: "Nominal heat output [kW]",
        cel: "How much heat the device gives off while burning. Together with burning time it gives energy per day.",
        gdzie: "From the datasheet or nameplate of the device.",
        zakres: Z_KARTY_EN,
      },
      czas: {
        nazwa: "Burning time per day [h]",
        cel: "How many hours a day the device runs at nominal output.",
        gdzie: "Your real burning pattern — e.g. evening and night in frost.",
        zakres: "0–24 h.",
      },
      mocWoda: {
        nazwa: "Output to water [kW]",
        cel: "The part of the output the water jacket passes to the central heating system — only this part heats the whole house, the rest heats the room with the fireplace.",
        gdzie: "From the datasheet (output to water / jacket output). Without a water jacket — 0.",
        zakres: Z_KARTY_EN,
      },
      zapotrzebowanie: {
        nazwa: "Heat demand on a frosty day [kWh/day]",
        cel: "How much heat the house loses on the coldest day. Compared with what the water jacket gives.",
        gdzie: "From Module 6 — “Space heating and hot water demand” or “Building heat loss”.",
        zakres: "The Module 6 result for your building.",
      },
      sprawnosc: {
        nazwa: "Device efficiency [%]",
        cel: "What part of the energy in the wood reaches the house as heat. The lower it is, the more wood for the same heat.",
        gdzie: "From the device datasheet.",
        zakres: "From the datasheet — typically 60–80%.",
      },
      wartoscOpalowa: {
        nazwa: "Fuel calorific value [kWh/kg]",
        cel: "How much energy a kilogram of fuel contains. The divisor when calculating how much fuel is needed.",
        gdzie: "From the supplier — it depends on the wood species and moisture.",
        zakres: "The value from the fuel supplier — the app does not assume it for you.",
      },
    },
  },
  "centrala-ssp": {
    migawka: {
      oCoChodzi:
        "The fire alarm control panel is the heart of protection — the house controller must “talk” to it reliably, because it decides whether the rest of the system learns about the danger at all.",
      jakDziala:
        "The app checks how the controller is connected to the panel (volt-free contacts or RS485), whether it receives three signals — alarm, fault and disarm — and what state the panel is in. A panel reporting a fault is a red stop.",
      poCo:
        "If the controller does not receive the alarm signal, it will not switch off ventilation, release the locks or call for help — the whole fire automation is blind.",
    },
    pola: {
      polaczenie: {
        nazwa: "Controller connection to the panel",
        cel: "Volt-free contacts (simple relays: alarm, fault) or an RS485 bus (more information, but needs correct configuration).",
        gdzie: "From the panel documentation — description of outputs.",
        zakres: "Volt-free contacts or RS485.",
      },
      stan: {
        nazwa: "Panel state",
        cel: "Normal (monitoring) means a working panel. A reported fault is a red stop — the panel may not detect a fire.",
        gdzie: "On the panel display (LED/message “normal” or “fault”).",
        zakres: "Normal or fault.",
      },
    },
  },
  "dogrzewanie-paliwem-stalym": {
    migawka: {
      oCoChodzi:
        "An open fire in the house is a real responsibility — combustion uses the room's oxygen and produces carbon monoxide, which has no smell and kills in sleep.",
      jakDziala:
        "The app checks three hard conditions: the distance of the device from combustible materials (minimum {minOdleglosc} cm), a separate combustion air inlet and a CO detector in the room. Missing any of them is a red stop.",
      poCo:
        "A tight, energy-efficient house with heat recovery ventilation can “suck” fireplace flue gases indoors. A CO detector and a separate air inlet are the cheapest life protection.",
      fizyka:
        "Carbon monoxide (CO) forms during incomplete combustion when oxygen is lacking. It binds to haemoglobin more strongly than oxygen — which is why it is dangerous at low concentrations.",
    },
    pola: {
      paliwo: {
        nazwa: "Fuel type",
        cel: "Wood, pellets or coal — the kind of fuel you burn.",
        gdzie: "Your device and fuel.",
        zakres: "Wood, pellets or coal.",
      },
      odleglosc: {
        nazwa: "Distance from combustible materials [cm]",
        cel: "The gap between the device and wood, furniture, curtains and other materials that can ignite from radiant heat.",
        gdzie: "Measure from the device casing to the nearest combustible item. Also check the manufacturer's manual — it may require more.",
        zakres: "Minimum {minOdleglosc} cm — below it a red stop.",
      },
    },
  },
  "klapy-pozarowe": {
    migawka: {
      oCoChodzi:
        "Smoke kills faster than fire — it must be stopped from spreading through ventilation ducts and then removed efficiently.",
      jakDziala:
        "With mechanical ventilation (ducted heat recovery) the fire signal must close the fire dampers and switch off the fan. The app checks whether these reactions are configured. With natural ventilation the problem does not arise.",
      poCo: "Heat recovery running during a fire spreads smoke through the whole house in minutes — bedrooms included.",
    },
    pola: {
      wentylacja: {
        nazwa: "Ventilation type in the building",
        cel: "Mechanical ventilation ducts can carry smoke — then dampers and switching off the fan after the alarm are needed.",
        gdzie: "Your building: a heat recovery unit with ducts = mechanical; grilles without a fan = natural.",
        zakres: "Mechanical or natural / none.",
      },
    },
  },
  "modul-gasniczy": {
    migawka: {
      oCoChodzi:
        "A person may not manage to think in the right order during a fire — the extinguishing system carries out a proven sequence of steps within seconds.",
      jakDziala:
        "The app checks the extinguishing agent against what is in the zone: with a LiFePO4 storage, powder and CO₂ are a red stop (they don't cool the cells, re-ignition is likely); water mist or an agent designed for energy storage is appropriate. It also checks how many detectors must confirm the fire (minimum {minCzujnikow}) and whether the module is charged.",
      poCo:
        "A lithium battery fire produces its own heat and gases — the wrong agent only smothers the flame for a moment. And extinguishing after a single false signal destroys equipment for no reason.",
      fizyka:
        "In a cell in thermal runaway the reaction sustains itself — heat must be removed (cooling), not only oxygen cut off.",
    },
    pola: {
      srodek: {
        nazwa: "Extinguishing agent",
        cel: "The type of agent in the module. With lithium storage it decides effectiveness: water mist and energy-storage agents cool, powder and CO₂ don't.",
        gdzie: "From the extinguishing module's label or datasheet.",
        zakres: "Options on the list. With LiFePO4: powder and CO₂ — red stop.",
      },
      magazyn: {
        nazwa: "Energy storage in the extinguishing zone",
        cel: "Whether an energy storage stands in the module's zone and what chemistry. The required agent depends on it.",
        gdzie: "Your installation.",
        zakres: "None, LiFePO4 or another chemistry.",
      },
      czujniki: {
        nazwa: "Number of detectors confirming the alarm [pcs]",
        cel: "How many independent detectors must confirm the fire before extinguishing starts. Protects against triggering on a single false signal.",
        gdzie: "From the extinguishing module controller's configuration.",
        zakres: "Minimum {minCzujnikow} — fewer is a warning.",
      },
      stanModulu: {
        nazwa: "Extinguishing module state",
        cel: "A discharged module (after release or loss of pressure) will not put out a fire — red stop.",
        gdzie: "The pressure or status indicator on the module, the inspection report.",
        zakres: "Working (charged) or discharged.",
      },
    },
  },
  "oswietlenie-awaryjne": {
    migawka: {
      oCoChodzi:
        "In smoke you can't see the way — a failed lamp on the escape route must be visible before it is needed.",
      jakDziala:
        "You enter the lamps on escape routes and their state from the last test. A faulty lamp is a red stop, an untested one a warning. The app also asks about the lamps' power source and outdoor lighting for emergency services.",
      poCo:
        "Emergency lamps fail silently — the battery in a lamp loses capacity and after years lights for a few minutes instead of an hour. A test now and then is the only way to know.",
    },
    pola: {
      zasilanie: {
        nazwa: "Emergency lamp power supply",
        cel: "From a UPS (central) or from each lamp's own batteries. With a UPS its failure turns off all lamps at once.",
        gdzie: "From the installation design or the lamp description.",
        zakres: "From a UPS or own batteries.",
      },
      miejsce: {
        nazwa: "Lamp location",
        cel: "Where the lamp hangs (e.g. corridor, stairs, exit) — so you know which one to fix.",
        gdzie: "Your description.",
        zakres: "Any text.",
      },
      stanLampy: {
        nazwa: "Lamp state from the last test",
        cel: "Working, faulty or untested. Faulty — red stop, untested — warning.",
        gdzie: "From a test: disconnect the lamp's power and check that it lights for the required time.",
        zakres: "Working, faulty or untested.",
      },
    },
  },
  "powiadomienia-alarmowe": {
    migawka: {
      oCoChodzi:
        "The system not only detects danger but can also call for help — the last resort when nobody is at home.",
      jakDziala:
        "The app checks the siren, notifications to emergency contacts and automatic calling of emergency services. Automatically calling the services without your explicit consent is a red stop — the source allows it only with consent.",
      poCo:
        "A fire in an empty remote house detected at 3 a.m. is useless if nobody learns about it. But false calls to the services also cost.",
    },
    pola: {
      kontakty: {
        nazwa: "Number of emergency contacts [pcs]",
        cel: "How many people receive the alarm notification. More than one person is a backup when someone doesn't answer.",
        gdzie: "You, family, a neighbour, a security company.",
        zakres: "At least one person; more is safer.",
      },
    },
  },
  "ups-krytyczny": {
    migawka: {
      oCoChodzi:
        "In a fire normal power often fails — a UPS gives the system those key minutes to carry out the safety sequence instead of going silent at the worst moment.",
      jakDziala:
        "You tick the critical devices (controller, router, locks, control panel, emergency lighting) and enter their power. The app adds up the power and calculates run time: capacity × voltage × efficiency ÷ power.",
      poCo:
        "So the UPS is enough to release the locks, send notifications and light the escape routes. Too small a UPS dies after a few minutes — exactly when it is needed.",
      fizyka: "t = (C [Ah] × U [V] × η) / P [W]. Check the device powers on their nameplates — the app has no default powers.",
    },
    pola: {
      mocUrzadzenia: {
        nazwa: "Critical device power [W]",
        cel: "The draw of a device powered from the UPS. Added to the other ticked devices.",
        gdzie: "From the nameplate, power adapter or device manual.",
        zakres: Z_KARTY_EN,
      },
      pojemnosc: {
        nazwa: "UPS battery capacity [Ah]",
        cel: "Together with voltage gives the energy from which run time is calculated.",
        gdzie: "From the UPS datasheet or the battery label.",
        zakres: Z_KARTY_EN,
      },
      napiecie: {
        nazwa: "UPS system voltage [V]",
        cel: "The voltage of the UPS batteries — converts Ah to Wh.",
        gdzie: "From the UPS datasheet (battery voltage, e.g. 12, 24 or 48 V).",
        zakres: Z_KARTY_EN,
      },
    },
  },
  "zamki-drzwi-ewakuacyjnych": {
    migawka: {
      oCoChodzi:
        "In a fire no door may be locked — a good design rule is “fail-safe”: no power = door open, never the other way round.",
      jakDziala:
        "The app checks the lock type and its behaviour on power loss. A lock that blocks the door without power (fail-secure) and has no backup power is a red stop. It also checks release on fire alarm, an emergency exit button and a reed contact.",
      poCo: "In a fire power often fails in the first minutes. A lock that then blocks shuts people inside.",
    },
    pola: {
      typ: {
        nazwa: "Lock type",
        cel: "Electromagnetic lock (holds while powered), electric strike or door actuator — the typical behaviour on power loss depends on the type.",
        gdzie: "From the lock description or the installer.",
        zakres: "Magnetic lock, electric strike or actuator.",
      },
      zanikPradu: {
        nazwa: "Lock behaviour on power loss",
        cel: "Fail-safe opens the door without power (right for an escape route), fail-secure blocks it. The app treats “don't know” as blocking — the safe side.",
        gdzie: "From the lock datasheet (NC/NO mode, fail-safe/fail-secure) or check by disconnecting power with the door open.",
        zakres: "Opens, blocks or don't know.",
      },
    },
  },
}

const Z_KARTY_RU = "диапазон из технической документации устройства — приложение не подставляет типовое значение за вас."

export const ru: Tlumaczenie<typeof pl> = {
  "audyt-pozarowy": {
    migawka: {
      oCoChodzi:
        "Регулярная проверка того, что при пожаре всё сработает как надо, — чтобы не обнаружить неисправный датчик только во время настоящего пожара.",
      jakDziala:
        "Приложение перечисляет элементы защиты (датчики, пожарный прибор, аварийное освещение, резервное питание, пожаротушение) и показывает, какие исправны, какие требуют внимания, а какие неисправны. Пока работает на демонстрационных данных — реальное состояние придёт из телеметрии (Режим Live).",
      poCo:
        "Любой элемент пожарной защиты выходит из строя незаметно: батарея в датчике, аварийная лампа, аккумулятор ИБП. Аудит находит это до того, как понадобится.",
    },
    pola: {},
  },
  "awaryjne-zrodlo-ciepla": {
    migawka: {
      oCoChodzi:
        "Огонь — древнейший источник тепла; в off-grid он возвращается как разумный резерв, если безопасно встроен в остальную систему. Сколько тепла даст камин и сколько дров он съест?",
      jakDziala:
        "Тепловая энергия = мощность × время горения. Если у камина есть водяная рубашка, приложение считает, какую часть суточной потребности в тепле в морозный день покроет мощность, отдаваемая в воду. Количество топлива: энергия ÷ (КПД × теплотворная способность).",
      poCo:
        "Чтобы знать, действительно ли камин спасёт дом при отказе теплового насоса или без электричества, и сколько дров нужно в запасе на морозную неделю.",
      fizyka:
        "Теплотворная способность дров сильно зависит от влажности — сырые дрова тратят часть энергии на испарение воды, поэтому значение берите у поставщика, а не из таблицы.",
    },
    pola: {
      typ: {
        nazwa: "Тип источника тепла",
        cel: "Камин, буржуйка или дровяная печь — устройство, к которому относятся данные из документации.",
        gdzie: "С таблички или из инструкции устройства.",
        zakres: "Камин, буржуйка или дровяная печь.",
      },
      moc: {
        nazwa: "Номинальная тепловая мощность [кВт]",
        cel: "Сколько тепла устройство отдаёт при горении. Вместе с временем горения даёт энергию в сутки.",
        gdzie: "Из документации или с заводской таблички устройства.",
        zakres: Z_KARTY_RU,
      },
      czas: {
        nazwa: "Время горения в сутки [ч]",
        cel: "Сколько часов в сутки устройство работает на номинальной мощности.",
        gdzie: "Ваш реальный режим топки — например, вечер и ночь в мороз.",
        zakres: "0–24 ч.",
      },
      mocWoda: {
        nazwa: "Мощность, отдаваемая в воду [кВт]",
        cel: "Часть мощности, которую водяная рубашка передаёт в систему отопления, — только она греет весь дом, остальное греет комнату с камином.",
        gdzie: "Из документации (мощность в воду / мощность рубашки). Без водяной рубашки — 0.",
        zakres: Z_KARTY_RU,
      },
      zapotrzebowanie: {
        nazwa: "Потребность в тепле в морозный день [кВт·ч/сутки]",
        cel: "Сколько тепла дом теряет в самый холодный день. Сравнивается с тем, что даст водяная рубашка.",
        gdzie: "Из Модуля 6 — «Потребность в отоплении и ГВС» или «Теплопотери здания».",
        zakres: "Результат Модуля 6 для вашего здания.",
      },
      sprawnosc: {
        nazwa: "КПД устройства [%]",
        cel: "Какая часть энергии дров попадает в дом в виде тепла. Чем ниже, тем больше дров на то же количество тепла.",
        gdzie: "Из документации устройства.",
        zakres: "Из документации — обычно 60–80%.",
      },
      wartoscOpalowa: {
        nazwa: "Теплотворная способность топлива [кВт·ч/кг]",
        cel: "Сколько энергии содержит килограмм топлива. Делитель при расчёте необходимого количества топлива.",
        gdzie: "У поставщика — зависит от породы и влажности дров.",
        zakres: "Значение от поставщика топлива — приложение не подставляет его за вас.",
      },
    },
  },
  "centrala-ssp": {
    migawka: {
      oCoChodzi:
        "Прибор пожарной сигнализации — сердце защиты; контроллер дома должен «общаться» с ним без сбоев, потому что от него зависит, узнает ли остальная система об опасности вообще.",
      jakDziala:
        "Приложение проверяет, как контроллер подключён к прибору (сухие контакты или RS485), получает ли он три сигнала — тревогу, неисправность и снятие с охраны — и в каком состоянии прибор. Прибор, сообщающий о неисправности, — красный стоп.",
      poCo:
        "Если контроллер не получает сигнал тревоги, он не выключит вентиляцию, не разблокирует замки и не вызовет помощь — вся пожарная автоматика слепа.",
    },
    pola: {
      polaczenie: {
        nazwa: "Подключение контроллера к прибору",
        cel: "Сухие контакты (простые реле: тревога, неисправность) или шина RS485 (больше информации, но нужна правильная настройка).",
        gdzie: "Из документации прибора — описание выходов.",
        zakres: "Сухие контакты или RS485.",
      },
      stan: {
        nazwa: "Состояние прибора",
        cel: "Дежурный режим означает исправный прибор. Сообщение о неисправности — красный стоп: прибор может не обнаружить пожар.",
        gdzie: "На панели прибора (индикатор/сообщение «дежурный режим» или «неисправность»).",
        zakres: "Дежурный режим или неисправность.",
      },
    },
  },
  "dogrzewanie-paliwem-stalym": {
    migawka: {
      oCoChodzi:
        "Открытый огонь в доме — реальная ответственность: горение расходует кислород помещения и производит угарный газ, который не имеет запаха и убивает во сне.",
      jakDziala:
        "Приложение проверяет три жёстких условия: расстояние устройства от горючих материалов (минимум {minOdleglosc} см), отдельный приток воздуха для горения и датчик угарного газа в помещении. Отсутствие любого — красный стоп.",
      poCo:
        "Герметичный энергоэффективный дом с рекуперацией может «вытянуть» дымовые газы камина внутрь. Датчик CO и отдельный приток — самая дешёвая защита жизни.",
      fizyka:
        "Угарный газ (CO) образуется при неполном сгорании, когда не хватает кислорода. Он связывается с гемоглобином сильнее кислорода — поэтому опасен даже в малых концентрациях.",
    },
    pola: {
      paliwo: {
        nazwa: "Тип топлива",
        cel: "Дрова, пеллеты или уголь — вид топлива, которым вы топите.",
        gdzie: "Ваше устройство и топливо.",
        zakres: "Дрова, пеллеты или уголь.",
      },
      odleglosc: {
        nazwa: "Расстояние от горючих материалов [см]",
        cel: "Зазор между устройством и деревом, мебелью, шторами и другими материалами, которые могут загореться от теплового излучения.",
        gdzie: "Измерьте от корпуса устройства до ближайшего горючего элемента. Проверьте и инструкцию производителя — она может требовать больше.",
        zakres: "Минимум {minOdleglosc} см — ниже красный стоп.",
      },
    },
  },
  "klapy-pozarowe": {
    migawka: {
      oCoChodzi:
        "Дым убивает быстрее огня — его нужно остановить, чтобы он не распространялся по вентиляционным каналам, а затем эффективно удалить.",
      jakDziala:
        "При механической вентиляции (рекуперация с каналами) сигнал пожара должен закрыть противопожарные клапаны и выключить вентилятор. Приложение проверяет, настроены ли эти реакции. При естественной вентиляции проблемы нет.",
      poCo: "Работающая во время пожара рекуперация за несколько минут разносит дым по всему дому — и в спальни.",
    },
    pola: {
      wentylacja: {
        nazwa: "Тип вентиляции в здании",
        cel: "Каналы механической вентиляции могут разносить дым — тогда нужны клапаны и отключение вентилятора после тревоги.",
        gdzie: "Ваше здание: рекуператор с каналами = механическая; решётки без вентилятора = естественная.",
        zakres: "Механическая или естественная / нет.",
      },
    },
  },
  "modul-gasniczy": {
    migawka: {
      oCoChodzi:
        "Человек может не успеть подумать в правильном порядке во время пожара — система пожаротушения выполняет проверенную последовательность шагов за секунды.",
      jakDziala:
        "Приложение проверяет огнетушащее вещество относительно того, что находится в зоне: при накопителе LiFePO4 порошок и CO₂ — красный стоп (не охлаждают элементы, возможно повторное возгорание); подходят тонкораспылённая вода или вещество для накопителей энергии. Также проверяет, сколько датчиков должны подтвердить пожар (минимум {minCzujnikow}), и заряжен ли модуль.",
      poCo:
        "Пожар литиевой батареи сам производит тепло и газы — неподходящее вещество лишь на мгновение собьёт пламя. А тушение по одному ложному сигналу уничтожит оборудование без причины.",
      fizyka:
        "В элементе в состоянии теплового разгона (thermal runaway) реакция поддерживает сама себя — нужно отводить тепло (охлаждение), а не только перекрывать кислород.",
    },
    pola: {
      srodek: {
        nazwa: "Огнетушащее вещество",
        cel: "Вид вещества в модуле. При литиевом накопителе определяет эффективность: тонкораспылённая вода и вещества для накопителей охлаждают, порошок и CO₂ — нет.",
        gdzie: "С таблички или из документации модуля пожаротушения.",
        zakres: "Варианты из списка. При LiFePO4: порошок и CO₂ — красный стоп.",
      },
      magazyn: {
        nazwa: "Накопитель энергии в зоне тушения",
        cel: "Стоит ли в зоне действия модуля накопитель энергии и какой химии. От этого зависит требуемое вещество.",
        gdzie: "Ваша установка.",
        zakres: "Нет, LiFePO4 или другая химия.",
      },
      czujniki: {
        nazwa: "Число датчиков, подтверждающих тревогу [шт.]",
        cel: "Сколько независимых датчиков должны подтвердить пожар, прежде чем начнётся тушение. Защищает от срабатывания по одному ложному сигналу.",
        gdzie: "Из конфигурации контроллера модуля пожаротушения.",
        zakres: "Минимум {minCzujnikow} — меньше означает предупреждение.",
      },
      stanModulu: {
        nazwa: "Состояние модуля пожаротушения",
        cel: "Разряженный модуль (после срабатывания или из-за потери давления) не потушит пожар — красный стоп.",
        gdzie: "Индикатор давления или состояния на модуле, протокол осмотра.",
        zakres: "Исправен (заряжен) или разряжен.",
      },
    },
  },
  "oswietlenie-awaryjne": {
    migawka: {
      oCoChodzi:
        "В дыму не видно дороги — неисправность лампы на пути эвакуации должна быть видна до того, как она понадобится.",
      jakDziala:
        "Вы вводите лампы на путях эвакуации и их состояние по последнему тесту. Неисправная лампа — красный стоп, непротестированная — предупреждение. Приложение также спрашивает об источнике питания ламп и о наружном освещении для служб.",
      poCo:
        "Аварийные лампы выходят из строя незаметно — аккумулятор в лампе теряет ёмкость и через годы светит несколько минут вместо часа. Периодический тест — единственный способ это узнать.",
    },
    pola: {
      zasilanie: {
        nazwa: "Питание аварийных ламп",
        cel: "От ИБП (централизованно) или от собственных аккумуляторов каждой лампы. При ИБП его отказ гасит все лампы сразу.",
        gdzie: "Из проекта установки или описания ламп.",
        zakres: "От ИБП или собственные аккумуляторы.",
      },
      miejsce: {
        nazwa: "Место лампы",
        cel: "Где висит лампа (например, коридор, лестница, выход) — чтобы знать, какую чинить.",
        gdzie: "Ваше описание.",
        zakres: "Любой текст.",
      },
      stanLampy: {
        nazwa: "Состояние лампы по последнему тесту",
        cel: "Исправна, неисправна или не тестировалась. Неисправна — красный стоп, не тестировалась — предупреждение.",
        gdzie: "Из теста: отключите питание лампы и проверьте, светит ли она требуемое время.",
        zakres: "Исправна, неисправна или не тестировалась.",
      },
    },
  },
  "powiadomienia-alarmowe": {
    migawka: {
      oCoChodzi:
        "Система не только обнаруживает опасность, но и может вызвать помощь — последняя надежда, когда дома никого нет.",
      jakDziala:
        "Приложение проверяет сирену, уведомления контактам и автоматический вызов служб. Автоматический вызов служб без вашего явного согласия — красный стоп: источник допускает его только с согласия.",
      poCo:
        "Пожар в пустом доме в глуши, обнаруженный в 3 часа ночи, бесполезен, если о нём никто не узнает. Но ложные вызовы служб тоже стоят денег.",
    },
    pola: {
      kontakty: {
        nazwa: "Число экстренных контактов [шт.]",
        cel: "Сколько человек получат уведомление о тревоге. Больше одного — запас на случай, если кто-то не ответит.",
        gdzie: "Вы, семья, сосед, охранная фирма.",
        zakres: "Хотя бы один человек; больше — надёжнее.",
      },
    },
  },
  "ups-krytyczny": {
    migawka: {
      oCoChodzi:
        "При пожаре обычное питание часто пропадает — ИБП даёт системе ключевые минуты на выполнение последовательности безопасности, вместо того чтобы замолчать в худший момент.",
      jakDziala:
        "Вы отмечаете критические устройства (контроллер, роутер, замки, пожарный прибор, аварийное освещение) и вводите их мощность. Приложение суммирует мощность и считает время работы: ёмкость × напряжение × КПД ÷ мощность.",
      poCo:
        "Чтобы ИБП хватило на разблокировку замков, уведомления и освещение эвакуации. Слишком маленький ИБП сядет через несколько минут — именно тогда, когда нужен.",
      fizyka: "t = (C [А·ч] × U [В] × η) / P [Вт]. Мощность устройств смотрите на их табличках — в приложении нет мощностей по умолчанию.",
    },
    pola: {
      mocUrzadzenia: {
        nazwa: "Мощность критического устройства [Вт]",
        cel: "Потребление устройства, питаемого от ИБП. Суммируется с остальными отмеченными устройствами.",
        gdzie: "С таблички, блока питания или из инструкции устройства.",
        zakres: Z_KARTY_RU,
      },
      pojemnosc: {
        nazwa: "Ёмкость аккумулятора ИБП [А·ч]",
        cel: "Вместе с напряжением даёт энергию, по которой считается время работы.",
        gdzie: "Из документации ИБП или с наклейки аккумулятора.",
        zakres: Z_KARTY_RU,
      },
      napiecie: {
        nazwa: "Напряжение системы ИБП [В]",
        cel: "Напряжение аккумуляторов ИБП — переводит А·ч в Вт·ч.",
        gdzie: "Из документации ИБП (напряжение батареи, например 12, 24 или 48 В).",
        zakres: Z_KARTY_RU,
      },
    },
  },
  "zamki-drzwi-ewakuacyjnych": {
    migawka: {
      oCoChodzi:
        "При пожаре двери не должны быть заблокированы — хорошее проектное правило «fail-safe»: нет тока = дверь открыта, никогда наоборот.",
      jakDziala:
        "Приложение проверяет тип замка и его поведение при пропадании питания. Замок, который блокирует дверь без тока (fail-secure) и не имеет резервного питания, — красный стоп. Проверяет также разблокировку по пожарной тревоге, кнопку аварийного выхода и геркон.",
      poCo: "При пожаре ток часто пропадает в первые минуты. Замок, который тогда блокируется, запирает людей внутри.",
    },
    pola: {
      typ: {
        nazwa: "Тип замка",
        cel: "Электромагнитный замок (держит под током), электрозащёлка или привод двери — от типа зависит типичное поведение при пропадании тока.",
        gdzie: "Из описания замка или у монтажника.",
        zakres: "Электромагнит, электрозащёлка или привод.",
      },
      zanikPradu: {
        nazwa: "Поведение замка при пропадании питания",
        cel: "Fail-safe открывает дверь без тока (правильно для пути эвакуации), fail-secure блокирует. «Не знаю» приложение считает блокировкой — это безопасная сторона.",
        gdzie: "Из документации замка (режим NC/NO, fail-safe/fail-secure) или проверьте, отключив питание при открытой двери.",
        zakres: "Открывает, блокирует или не знаю.",
      },
    },
  },
}
