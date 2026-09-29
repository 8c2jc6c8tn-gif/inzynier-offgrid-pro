/**
 * M12 — E38 „Uziemienie małej instalacji” (`app/kalkulatory/uziemienie-male-instalacje/page.tsx`).
 * The external-supply section has one key per variant (`-J` jacht / `-K` kamper) instead of pasted
 * word fragments, so every language keeps its own grammar. Terminology as in the `UMI-*` engine
 * messages (RU: УЗО, EN: RCD).
 */
export const pl = {
  "UI-UMI-SCHEMAT-ARIA":
    "Schemat pętli zwarcia: falownik z połączeniem N–PE, wyłącznik RCD 30 mA, gniazdo z urządzeniem, przewód ochronny PE łączący obudowę urządzenia, podwozie i punkt N–PE w falowniku",
  "UI-UMI-SCH-FALOWNIK": "Falownik 230 V",
  "UI-UMI-SCH-ODBIORNIK": "Odbiornik",
  "UI-UMI-SCH-GNIAZDO": "(gniazdo + urządzenie)",
  "UI-UMI-SCH-ZWARCIE": "zwarcie na obudowę",
  "UI-UMI-SCH-PE": "przewód ochronny PE",
  "UI-UMI-SCH-PODWOZIE": "podwozie / masa pojazdu",
  "UI-UMI-SCH-PRAD": "Prąd zwarcia: obudowa → PE → N–PE → falownik.",
  "UI-UMI-SCH-DUZY": "Duży prąd — bezpiecznik albo RCD wyłącza obwód.",
  "UI-UMI-M-GARAZ": "Garaż",
  "UI-UMI-M-KAMPER": "Kamper / przyczepa",
  "UI-UMI-M-JACHT": "Jacht / łódź",
  "UI-UMI-M-ZEWNATRZ": "Na zewnątrz",
  "UI-UMI-M-NAMIOT": "Namiot",
  "UI-UMI-TYTUL": "Uziemienie małej instalacji",
  "UI-UMI-OPIS":
    "Kamper, jacht, garaż albo zestaw na zewnątrz: sprawdza, czy instalacja wymaga uziemienia ochronnego i czy falownik oraz gniazda 230 V są poprawnie podłączone. Moduł 12, Ekran 38 (uproszczona wersja Modułu 5, Ekrany 9 i 11).",
  "UI-UMI-RODZAJ": "Rodzaj instalacji",
  "UI-UMI-RODZAJ-DC": "Tylko 12/24 V DC",
  "UI-UMI-RODZAJ-AC": "230 V z falownika",
  "UI-UMI-GDZIE": "Gdzie jest instalacja",
  "UI-UMI-Q-ZASILANIE-J": "Czy jacht bywa zasilany z kei?",
  "UI-UMI-Q-ZASILANIE-K": "Czy kamper bywa zasilany ze słupka (kemping)?",
  "UI-UMI-Q-NPE-NAMIOT": "Czy wyjście 230 V stacji albo falownika ma połączenie N–PE (wg instrukcji)?",
  "UI-UMI-Q-OBUDOWA": "Czy obudowa falownika jest uziemiona?",
  "UI-UMI-Q-GNIAZDA": "Czy gniazda 230 V mają podłączony styk ochronny?",
  "UI-UMI-Q-NPE": "Czy falownik ma połączenie N–PE (fabryczne, przekaźnik albo wg instrukcji)?",
  "UI-UMI-Q-NPE-ROZLACZANE": "Czy to połączenie N–PE jest rozłączane przy zasilaniu z zewnątrz?",
  "UI-UMI-Q-RCD": "Czy za falownikiem jest wyłącznik różnicowoprądowy (RCD) 30 mA?",
  "UI-UMI-WYBIERZ-DC": "Wybierz rodzaj instalacji i miejsce.",
  "UI-UMI-WYBIERZ-AC":
    "Wybierz rodzaj instalacji i miejsce, a potem odpowiedz na wszystkie pytania, które się pojawią.",
  "UI-UMI-W-PODWOJNE": "Podwójne połączenie N–PE przy zasilaniu z zewnątrz",
  "UI-UMI-W-OBUDOWA": "Obudowa falownika nieuziemiona — ryzyko porażenia",
  "UI-UMI-W-BRAK-NPE": "Brak połączenia N–PE — zabezpieczenie nie wyłączy zwarcia",
  "UI-UMI-W-BRAK-RCD": "Brak RCD 30 mA — ryzyko porażenia",
  "UI-UMI-W-NAMIOT": "Namiot, wyjście pływające — stosuj zasady poniżej",
  "UI-UMI-W-GNIAZDA": "Gniazda bez styku ochronnego — przeczytaj, czym to grozi",
  "UI-UMI-W-PETLA": "Pętla zwarcia zamknięta — ochrona kompletna",
  "UI-UMI-W-WILGOC": "Uziemienie niewymagane — zalecane przy wilgoci",
  "UI-UMI-W-ZWYKLE": "Uziemienie ochronne zwykle niewymagane",
  "UI-UMI-G-WYMAGANE": "uziemienie ochronne wymagane",
  "UI-UMI-G-PLYWAJACE": "wyjście pływające — nie uziemiaj na własną rękę",
  "UI-UMI-G-ZWYKLE": "uziemienie ochronne zwykle niewymagane",
  "UI-UMI-NAMIOT-H": "Namiot — stacja zasilania albo mały falownik",
  "UI-UMI-NAMIOT-OPIS":
    "W namiocie nie ma podwozia, więc strategia jest inna. Zobacz w instrukcji, jakie wyjście ma stacja. Większość przenośnych stacji ma wyjście 230 V „pływające”, czyli bez połączenia z ziemią. Pojedyncza usterka (np. dotknięcie jednego przewodu) nie grozi wtedy porażeniem, bo prąd nie ma drogi powrotnej. Niebezpieczna jest druga usterka naraz.",
  "UI-UMI-NAMIOT-1": "Takiego wyjścia nie uziemiaj na własną rękę, jeśli producent tego nie przewiduje.",
  "UI-UMI-NAMIOT-2":
    "Najbezpieczniej: jedno urządzenie na jedno wyjście. Norma zna taki środek ochrony pod nazwą „separacja elektryczna”.",
  "UI-UMI-NAMIOT-3": "Wybieraj urządzenia z podwójną izolacją (symbol podwójnego kwadratu, płaska wtyczka).",
  "UI-UMI-NAMIOT-4":
    "Użyj przenośnego RCD 30 mA (PRCD) między stacją a przedłużaczem. Uwaga: przy wyjściu pływającym RCD może nie zadziałać, zależnie od konstrukcji stacji — sprawdź to w instrukcji, to nie jest pewnik.",
  "UI-UMI-NAMIOT-5": "Sprzęt trzymaj nad podłogą, nie na mokrym tropiku, a złącza w obudowach IP —",
  "UI-UMI-NAMIOT-5-L": "zabezpieczenia przeciwwilgociowe (IP65/IP67)",
  "UI-UMI-NAMIOT-6":
    "Szpilka namiotowa jako uziom działa tylko wtedy, gdy instrukcja stacji przewiduje zacisk uziemienia. Poza tym daje głównie fałszywe poczucie bezpieczeństwa, tak jak wiszący przewód.",
  "UI-UMI-OCHRONA-H": "Jak działa ochrona na falowniku",
  "UI-UMI-OCHRONA-OPIS":
    "Ochrona nie potrzebuje ziemi — potrzebuje zamkniętej pętli zwarcia do źródła. Przy zwarciu na obudowę prąd płynie: obudowa → przewód ochronny (PE) → punkt połączenia N z PE w falowniku → z powrotem do falownika. Płynie wtedy duży prąd, więc bezpiecznik albo wyłącznik różnicowoprądowy (RCD) wyłącza obwód. Warunki są trzy:",
  "UI-UMI-OCHRONA-1":
    "wszystkie obudowy, styki ochronne gniazd i podwozie połączone jednym przewodem PE (połączenie wyrównawcze);",
  "UI-UMI-OCHRONA-2":
    "falownik ma połączenie N–PE, ale tylko jeśli producent na to pozwala — wiele falowników z przełącznikiem sieci robi to automatycznie przekaźnikiem, gdy nie ma zasilania z zewnątrz;",
  "UI-UMI-OCHRONA-3": "za tym połączeniem jest RCD 30 mA.",
  "UI-UMI-PRET": "Pręt wbity w ziemię ani przewód czy łańcuch wiszący spod kampera nie zastąpią tej pętli.",
  "UI-UMI-Z-P1-S-J": "Przy zasilaniu z kei",
  "UI-UMI-Z-P1-S-K": "Przy zasilaniu ze słupka",
  "UI-UMI-Z-P1-J":
    "przewód ochronny przychodzi z sieci. Połączenie N–PE na jachcie musi być wtedy rozłączone, inaczej powstaje podwójne połączenie N–PE.",
  "UI-UMI-Z-P1-K":
    "przewód ochronny przychodzi z sieci. Połączenie N–PE w kamperze musi być wtedy rozłączone, inaczej powstaje podwójne połączenie N–PE.",
  "UI-UMI-Z-P2-J":
    "Na kei N i PE przychodzą już rozdzielone, bo rozdzielenie jest po stronie sieci. Połączenie N–PE na jachcie to ponowne połączenie N z częścią uziemioną. Norma PN-HD 60364-5-54 (punkt 543.4.3) nazywa to „niedopuszczalnym”, nie „zalecanym”. Co się wtedy dzieje:",
  "UI-UMI-Z-P2-K":
    "Na słupku N i PE przychodzą już rozdzielone, bo rozdzielenie jest po stronie sieci. Połączenie N–PE w kamperze to ponowne połączenie N z częścią uziemioną. Norma PN-HD 60364-5-54 (punkt 543.4.3) nazywa to „niedopuszczalnym”, nie „zalecanym”. Co się wtedy dzieje:",
  "UI-UMI-Z-L1-S": "Prąd roboczy płynie przewodem ochronnym.",
  "UI-UMI-Z-L1-J":
    "Powrót z odbiorników dzieli się na N i PE razem z kadłubem. Na obudowach pojawia się napięcie względem ziemi, równe spadkowi napięcia na PE i przyłączu. Przewód ochronny przestaje być „czysty”.",
  "UI-UMI-Z-L1-K":
    "Powrót z odbiorników dzieli się na N i PE razem z podwoziem. Na obudowach pojawia się napięcie względem ziemi, równe spadkowi napięcia na PE i przyłączu. Przewód ochronny przestaje być „czysty”.",
  "UI-UMI-Z-L2-S-J": "Najczęstszy objaw: wybija RCD na kei.",
  "UI-UMI-Z-L2-S-K": "Najczęstszy objaw: wybija RCD na słupku.",
  "UI-UMI-Z-L2-J":
    "Część prądu wraca przez PE, z pominięciem RCD, więc RCD widzi różnicę i wyłącza. To wyłączenie jest bezpieczne, ale mylące: łatwo obwinić keję i szukać obejścia. Nie szukaj — rozłącz N–PE.",
  "UI-UMI-Z-L2-K":
    "Część prądu wraca przez PE, z pominięciem RCD, więc RCD widzi różnicę i wyłącza. To wyłączenie jest bezpieczne, ale mylące: łatwo obwinić słupek i szukać obejścia. Nie szukaj — rozłącz N–PE.",
  "UI-UMI-Z-L3-S": "Groźny przypadek: stare przyłącze bez RCD.",
  "UI-UMI-Z-L3-J":
    "Nic nie wybija, a PE stale niesie prąd. Jeśli w sieci przerwie się przewód PEN, cały prąd powrotny szuka drogi przez PE i kadłub. Na metalowych częściach jachtu może pojawić się niebezpieczne napięcie. Porażony zostaje ktoś, kto ich dotyka, stojąc na pomoście.",
  "UI-UMI-Z-L3-K":
    "Nic nie wybija, a PE stale niesie prąd. Jeśli w sieci przerwie się przewód PEN, cały prąd powrotny szuka drogi przez PE i podwozie. Na karoserii może pojawić się niebezpieczne napięcie. Porażony zostaje ktoś, kto jej dotyka, stojąc na trawie.",
  "UI-UMI-Z-L4-S": "Na jachcie jest gorzej.",
  "UI-UMI-Z-L4":
    "Prąd płynący przewodem ochronnym przez wodę powoduje korozję części podwodnych. W marinie prąd w wodzie grozi też porażeniem pływających w pobliżu. Dlatego przepisy jachtowe są tu szczególnie ostre.",
  "UI-UMI-Z-P3":
    "Ta usterka nie zabija od razu, tak jak brak N–PE na samym falowniku. Łamie jednak podstawową regułę układu i przy drugiej usterce — przerwanym PEN — robi się groźna. Dlatego aplikacja pokazuje ją na czerwono, tak jak nieuziemioną obudowę.",
  "UI-UMI-POSTOJ-S": "Przy dłuższym postoju",
  "UI-UMI-POSTOJ":
    "szpilka uziemiająca wbita w grunt ma sens jako dodatek. Nie zastępuje połączenia wyrównawczego ani RCD.",
  "UI-UMI-STOPKA": "Uziemienie w domu, z uziomem w ziemi i pomiarem rezystancji — pełne kalkulatory:",
  "UI-UMI-STOPKA-L1": "Moduł 5 — Projekt uziemienia",
  "UI-UMI-STOPKA-ORAZ": " oraz ",
  "UI-UMI-STOPKA-L2": "Moduł 5 — Uziemienie funkcjonalne vs ochronne",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-UMI-SCHEMAT-ARIA":
    "Fault loop diagram: inverter with an N–PE bond, 30 mA RCD, socket with an appliance, protective conductor PE connecting the appliance enclosure, the chassis and the N–PE point in the inverter",
  "UI-UMI-SCH-FALOWNIK": "Inverter 230 V",
  "UI-UMI-SCH-ODBIORNIK": "Load",
  "UI-UMI-SCH-GNIAZDO": "(socket + appliance)",
  "UI-UMI-SCH-ZWARCIE": "fault to enclosure",
  "UI-UMI-SCH-PE": "protective conductor PE",
  "UI-UMI-SCH-PODWOZIE": "chassis / vehicle ground",
  "UI-UMI-SCH-PRAD": "Fault current: enclosure → PE → N–PE → inverter.",
  "UI-UMI-SCH-DUZY": "High current — the fuse or RCD disconnects the circuit.",
  "UI-UMI-M-GARAZ": "Garage",
  "UI-UMI-M-KAMPER": "Camper / caravan",
  "UI-UMI-M-JACHT": "Yacht / boat",
  "UI-UMI-M-ZEWNATRZ": "Outdoors",
  "UI-UMI-M-NAMIOT": "Tent",
  "UI-UMI-TYTUL": "Earthing of a small installation",
  "UI-UMI-OPIS":
    "Camper, yacht, garage or an outdoor kit: checks whether the installation needs protective earthing and whether the inverter and the 230 V sockets are connected correctly. Module 12, Screen 38 (simplified version of Module 5, Screens 9 and 11).",
  "UI-UMI-RODZAJ": "Installation type",
  "UI-UMI-RODZAJ-DC": "12/24 V DC only",
  "UI-UMI-RODZAJ-AC": "230 V from an inverter",
  "UI-UMI-GDZIE": "Where the installation is",
  "UI-UMI-Q-ZASILANIE-J": "Is the yacht sometimes supplied from shore power?",
  "UI-UMI-Q-ZASILANIE-K": "Is the camper sometimes supplied from a hook-up post (campsite)?",
  "UI-UMI-Q-NPE-NAMIOT": "Does the 230 V output of the station or inverter have an N–PE bond (per the manual)?",
  "UI-UMI-Q-OBUDOWA": "Is the inverter enclosure earthed?",
  "UI-UMI-Q-GNIAZDA": "Do the 230 V sockets have the protective contact connected?",
  "UI-UMI-Q-NPE": "Does the inverter have an N–PE bond (factory, relay or per the manual)?",
  "UI-UMI-Q-NPE-ROZLACZANE": "Is this N–PE bond opened when supplied externally?",
  "UI-UMI-Q-RCD": "Is there a 30 mA residual current device (RCD) after the inverter?",
  "UI-UMI-WYBIERZ-DC": "Choose the installation type and location.",
  "UI-UMI-WYBIERZ-AC": "Choose the installation type and location, then answer all the questions that appear.",
  "UI-UMI-W-PODWOJNE": "Double N–PE bond with an external supply",
  "UI-UMI-W-OBUDOWA": "Inverter enclosure not earthed — risk of electric shock",
  "UI-UMI-W-BRAK-NPE": "No N–PE bond — the protection will not clear a fault",
  "UI-UMI-W-BRAK-RCD": "No 30 mA RCD — risk of electric shock",
  "UI-UMI-W-NAMIOT": "Tent, floating output — follow the rules below",
  "UI-UMI-W-GNIAZDA": "Sockets without a protective contact — read what this risks",
  "UI-UMI-W-PETLA": "Fault loop closed — protection complete",
  "UI-UMI-W-WILGOC": "Earthing not required — recommended in damp conditions",
  "UI-UMI-W-ZWYKLE": "Protective earthing usually not required",
  "UI-UMI-G-WYMAGANE": "protective earthing required",
  "UI-UMI-G-PLYWAJACE": "floating output — do not earth it on your own",
  "UI-UMI-G-ZWYKLE": "protective earthing usually not required",
  "UI-UMI-NAMIOT-H": "Tent — power station or a small inverter",
  "UI-UMI-NAMIOT-OPIS":
    "A tent has no chassis, so the strategy is different. Check in the manual what output the station has. Most portable stations have a “floating” 230 V output, i.e. not connected to earth. A single fault (e.g. touching one conductor) then does not cause a shock, because the current has no return path. A second fault at the same time is dangerous.",
  "UI-UMI-NAMIOT-1": "Do not earth such an output on your own if the manufacturer does not provide for it.",
  "UI-UMI-NAMIOT-2":
    "Safest: one device per output. The standard knows this protective measure as “electrical separation”.",
  "UI-UMI-NAMIOT-3": "Choose double-insulated devices (double-square symbol, flat plug).",
  "UI-UMI-NAMIOT-4":
    "Use a portable 30 mA RCD (PRCD) between the station and the extension cord. Note: with a floating output the RCD may not trip, depending on the station's design — check the manual, it is not a given.",
  "UI-UMI-NAMIOT-5": "Keep equipment off the floor, not on a wet groundsheet, and connectors in IP enclosures —",
  "UI-UMI-NAMIOT-5-L": "moisture protection (IP65/IP67)",
  "UI-UMI-NAMIOT-6":
    "A tent peg works as an earth electrode only if the station's manual provides an earth terminal. Otherwise it mostly gives a false sense of safety, like a hanging wire.",
  "UI-UMI-OCHRONA-H": "How protection works on an inverter",
  "UI-UMI-OCHRONA-OPIS":
    "Protection does not need earth — it needs a closed fault loop back to the source. With a fault to the enclosure the current flows: enclosure → protective conductor (PE) → N–PE bond point in the inverter → back to the inverter. A large current then flows, so the fuse or the residual current device (RCD) disconnects the circuit. There are three conditions:",
  "UI-UMI-OCHRONA-1":
    "all enclosures, the sockets' protective contacts and the chassis connected by one PE conductor (equipotential bonding);",
  "UI-UMI-OCHRONA-2":
    "the inverter has an N–PE bond, but only if the manufacturer allows it — many inverters with a transfer switch do this automatically with a relay when there is no external supply;",
  "UI-UMI-OCHRONA-3": "after this bond there is a 30 mA RCD.",
  "UI-UMI-PRET":
    "Neither a rod driven into the ground nor a wire or chain hanging under the camper will replace this loop.",
  "UI-UMI-Z-P1-S-J": "On shore power",
  "UI-UMI-Z-P1-S-K": "On a hook-up post supply",
  "UI-UMI-Z-P1-J":
    "the protective conductor comes from the grid. The N–PE bond on the yacht must then be opened, otherwise a double N–PE bond is created.",
  "UI-UMI-Z-P1-K":
    "the protective conductor comes from the grid. The N–PE bond in the camper must then be opened, otherwise a double N–PE bond is created.",
  "UI-UMI-Z-P2-J":
    "At the shore-power pedestal N and PE already arrive separated, because the separation is on the grid side. An N–PE bond on the yacht is a reconnection of N to an earthed part. PN-HD 60364-5-54 (clause 543.4.3) calls this “not permitted”, not “recommended”. What happens then:",
  "UI-UMI-Z-P2-K":
    "At the hook-up post N and PE already arrive separated, because the separation is on the grid side. An N–PE bond in the camper is a reconnection of N to an earthed part. PN-HD 60364-5-54 (clause 543.4.3) calls this “not permitted”, not “recommended”. What happens then:",
  "UI-UMI-Z-L1-S": "Working current flows through the protective conductor.",
  "UI-UMI-Z-L1-J":
    "The return from the loads splits between N and PE together with the hull. The enclosures carry a voltage to earth equal to the voltage drop on PE and the supply lead. The protective conductor is no longer “clean”.",
  "UI-UMI-Z-L1-K":
    "The return from the loads splits between N and PE together with the chassis. The enclosures carry a voltage to earth equal to the voltage drop on PE and the supply lead. The protective conductor is no longer “clean”.",
  "UI-UMI-Z-L2-S-J": "Most common symptom: the RCD at the shore-power pedestal trips.",
  "UI-UMI-Z-L2-S-K": "Most common symptom: the RCD on the hook-up post trips.",
  "UI-UMI-Z-L2-J":
    "Part of the current returns through PE, bypassing the RCD, so the RCD sees a difference and trips. This trip is safe but misleading: it is easy to blame the pedestal and look for a workaround. Don't — open the N–PE bond.",
  "UI-UMI-Z-L2-K":
    "Part of the current returns through PE, bypassing the RCD, so the RCD sees a difference and trips. This trip is safe but misleading: it is easy to blame the post and look for a workaround. Don't — open the N–PE bond.",
  "UI-UMI-Z-L3-S": "Dangerous case: an old supply point without an RCD.",
  "UI-UMI-Z-L3-J":
    "Nothing trips, and PE carries current all the time. If the PEN conductor in the grid breaks, all the return current seeks a path through PE and the hull. The yacht's metal parts may carry a dangerous voltage. Whoever touches them while standing on the jetty gets a shock.",
  "UI-UMI-Z-L3-K":
    "Nothing trips, and PE carries current all the time. If the PEN conductor in the grid breaks, all the return current seeks a path through PE and the chassis. The bodywork may carry a dangerous voltage. Whoever touches it while standing on the grass gets a shock.",
  "UI-UMI-Z-L4-S": "On a yacht it is worse.",
  "UI-UMI-Z-L4":
    "Current flowing through the protective conductor via the water corrodes underwater parts. In a marina, current in the water also puts nearby swimmers at risk of shock. That is why yacht rules are especially strict here.",
  "UI-UMI-Z-P3":
    "This fault does not kill straight away, like a missing N–PE on the inverter itself. But it breaks a basic rule of the system and becomes dangerous with a second fault — a broken PEN. That is why the app shows it in red, like an unearthed enclosure.",
  "UI-UMI-POSTOJ-S": "On a longer stay",
  "UI-UMI-POSTOJ":
    "an earth spike driven into the ground makes sense as an addition. It does not replace equipotential bonding or an RCD.",
  "UI-UMI-STOPKA": "Earthing at home, with an earth electrode and resistance measurement — full calculators:",
  "UI-UMI-STOPKA-L1": "Module 5 — Earthing design",
  "UI-UMI-STOPKA-ORAZ": " and ",
  "UI-UMI-STOPKA-L2": "Module 5 — Functional vs protective earthing",
}

export const ru: Record<Klucz, string> = {
  "UI-UMI-SCHEMAT-ARIA":
    "Схема петли замыкания: инвертор с соединением N–PE, УЗО 30 мА, розетка с прибором, защитный проводник PE, соединяющий корпус прибора, шасси и точку N–PE в инверторе",
  "UI-UMI-SCH-FALOWNIK": "Инвертор 230 В",
  "UI-UMI-SCH-ODBIORNIK": "Потребитель",
  "UI-UMI-SCH-GNIAZDO": "(розетка + прибор)",
  "UI-UMI-SCH-ZWARCIE": "замыкание на корпус",
  "UI-UMI-SCH-PE": "защитный проводник PE",
  "UI-UMI-SCH-PODWOZIE": "шасси / масса транспортного средства",
  "UI-UMI-SCH-PRAD": "Ток замыкания: корпус → PE → N–PE → инвертор.",
  "UI-UMI-SCH-DUZY": "Большой ток — предохранитель или УЗО отключает цепь.",
  "UI-UMI-M-GARAZ": "Гараж",
  "UI-UMI-M-KAMPER": "Автодом / прицеп",
  "UI-UMI-M-JACHT": "Яхта / лодка",
  "UI-UMI-M-ZEWNATRZ": "На улице",
  "UI-UMI-M-NAMIOT": "Палатка",
  "UI-UMI-TYTUL": "Заземление малой установки",
  "UI-UMI-OPIS":
    "Автодом, яхта, гараж или комплект на улице: проверяет, требует ли установка защитного заземления и правильно ли подключены инвертор и розетки 230 В. Модуль 12, экран 38 (упрощённая версия модуля 5, экраны 9 и 11).",
  "UI-UMI-RODZAJ": "Тип установки",
  "UI-UMI-RODZAJ-DC": "Только 12/24 В постоянного тока",
  "UI-UMI-RODZAJ-AC": "230 В от инвертора",
  "UI-UMI-GDZIE": "Где находится установка",
  "UI-UMI-Q-ZASILANIE-J": "Бывает ли яхта подключена к питанию с причала?",
  "UI-UMI-Q-ZASILANIE-K": "Бывает ли автодом подключён к колонке (кемпинг)?",
  "UI-UMI-Q-NPE-NAMIOT": "Есть ли у выхода 230 В станции или инвертора соединение N–PE (по инструкции)?",
  "UI-UMI-Q-OBUDOWA": "Заземлён ли корпус инвертора?",
  "UI-UMI-Q-GNIAZDA": "Подключён ли у розеток 230 В защитный контакт?",
  "UI-UMI-Q-NPE": "Есть ли у инвертора соединение N–PE (заводское, реле или по инструкции)?",
  "UI-UMI-Q-NPE-ROZLACZANE": "Размыкается ли это соединение N–PE при внешнем питании?",
  "UI-UMI-Q-RCD": "Есть ли после инвертора устройство защитного отключения (УЗО) 30 мА?",
  "UI-UMI-WYBIERZ-DC": "Выберите тип установки и место.",
  "UI-UMI-WYBIERZ-AC": "Выберите тип установки и место, а затем ответьте на все появившиеся вопросы.",
  "UI-UMI-W-PODWOJNE": "Двойное соединение N–PE при внешнем питании",
  "UI-UMI-W-OBUDOWA": "Корпус инвертора не заземлён — риск поражения током",
  "UI-UMI-W-BRAK-NPE": "Нет соединения N–PE — защита не отключит замыкание",
  "UI-UMI-W-BRAK-RCD": "Нет УЗО 30 мА — риск поражения током",
  "UI-UMI-W-NAMIOT": "Палатка, плавающий выход — соблюдайте правила ниже",
  "UI-UMI-W-GNIAZDA": "Розетки без защитного контакта — прочитайте, чем это грозит",
  "UI-UMI-W-PETLA": "Петля замыкания замкнута — защита полная",
  "UI-UMI-W-WILGOC": "Заземление не требуется — рекомендуется при влажности",
  "UI-UMI-W-ZWYKLE": "Защитное заземление обычно не требуется",
  "UI-UMI-G-WYMAGANE": "защитное заземление требуется",
  "UI-UMI-G-PLYWAJACE": "плавающий выход — не заземляйте самостоятельно",
  "UI-UMI-G-ZWYKLE": "защитное заземление обычно не требуется",
  "UI-UMI-NAMIOT-H": "Палатка — электростанция или небольшой инвертор",
  "UI-UMI-NAMIOT-OPIS":
    "В палатке нет шасси, поэтому стратегия другая. Посмотрите в инструкции, какой выход у станции. У большинства портативных станций выход 230 В «плавающий», то есть без связи с землёй. Одна неисправность (например, касание одного провода) тогда не грозит поражением, потому что у тока нет обратного пути. Опасна вторая неисправность одновременно.",
  "UI-UMI-NAMIOT-1": "Не заземляйте такой выход самостоятельно, если производитель этого не предусматривает.",
  "UI-UMI-NAMIOT-2":
    "Безопаснее всего: одно устройство на один выход. Стандарт знает такую меру защиты под названием «электрическое разделение».",
  "UI-UMI-NAMIOT-3": "Выбирайте устройства с двойной изоляцией (символ двойного квадрата, плоская вилка).",
  "UI-UMI-NAMIOT-4":
    "Используйте переносное УЗО 30 мА (PRCD) между станцией и удлинителем. Внимание: при плавающем выходе УЗО может не сработать, в зависимости от конструкции станции, — проверьте это в инструкции, это не гарантировано.",
  "UI-UMI-NAMIOT-5": "Держите оборудование над полом, не на мокром тенте, а разъёмы — в корпусах IP —",
  "UI-UMI-NAMIOT-5-L": "защита от влаги (IP65/IP67)",
  "UI-UMI-NAMIOT-6":
    "Колышек палатки работает как заземлитель, только если инструкция станции предусматривает клемму заземления. Иначе он в основном даёт ложное чувство безопасности, как висящий провод.",
  "UI-UMI-OCHRONA-H": "Как работает защита на инверторе",
  "UI-UMI-OCHRONA-OPIS":
    "Защите не нужна земля — ей нужна замкнутая петля замыкания до источника. При замыкании на корпус ток идёт: корпус → защитный проводник (PE) → точка соединения N с PE в инверторе → обратно в инвертор. Тогда течёт большой ток, и предохранитель или устройство защитного отключения (УЗО) отключает цепь. Условий три:",
  "UI-UMI-OCHRONA-1":
    "все корпуса, защитные контакты розеток и шасси соединены одним проводником PE (уравнивание потенциалов);",
  "UI-UMI-OCHRONA-2":
    "у инвертора есть соединение N–PE, но только если производитель это разрешает, — многие инверторы с переключателем сети делают это автоматически реле, когда нет внешнего питания;",
  "UI-UMI-OCHRONA-3": "после этого соединения стоит УЗО 30 мА.",
  "UI-UMI-PRET": "Ни штырь, вбитый в землю, ни провод или цепь, свисающие под автодомом, не заменят эту петлю.",
  "UI-UMI-Z-P1-S-J": "При питании с причала",
  "UI-UMI-Z-P1-S-K": "При питании от колонки",
  "UI-UMI-Z-P1-J":
    "защитный проводник приходит из сети. Соединение N–PE на яхте тогда должно быть разомкнуто, иначе возникает двойное соединение N–PE.",
  "UI-UMI-Z-P1-K":
    "защитный проводник приходит из сети. Соединение N–PE в автодоме тогда должно быть разомкнуто, иначе возникает двойное соединение N–PE.",
  "UI-UMI-Z-P2-J":
    "На причале N и PE приходят уже разделёнными, потому что разделение сделано на стороне сети. Соединение N–PE на яхте — это повторное соединение N с заземлённой частью. Норма PN-HD 60364-5-54 (пункт 543.4.3) называет это «недопустимым», а не «рекомендуемым». Что тогда происходит:",
  "UI-UMI-Z-P2-K":
    "На колонке N и PE приходят уже разделёнными, потому что разделение сделано на стороне сети. Соединение N–PE в автодоме — это повторное соединение N с заземлённой частью. Норма PN-HD 60364-5-54 (пункт 543.4.3) называет это «недопустимым», а не «рекомендуемым». Что тогда происходит:",
  "UI-UMI-Z-L1-S": "Рабочий ток идёт по защитному проводнику.",
  "UI-UMI-Z-L1-J":
    "Обратный ток от потребителей делится между N и PE вместе с корпусом яхты. На корпусах приборов появляется напряжение относительно земли, равное падению напряжения на PE и подводке. Защитный проводник перестаёт быть «чистым».",
  "UI-UMI-Z-L1-K":
    "Обратный ток от потребителей делится между N и PE вместе с шасси. На корпусах приборов появляется напряжение относительно земли, равное падению напряжения на PE и подводке. Защитный проводник перестаёт быть «чистым».",
  "UI-UMI-Z-L2-S-J": "Самый частый признак: срабатывает УЗО на причале.",
  "UI-UMI-Z-L2-S-K": "Самый частый признак: срабатывает УЗО на колонке.",
  "UI-UMI-Z-L2-J":
    "Часть тока возвращается через PE, минуя УЗО, поэтому УЗО видит разницу и отключает. Это отключение безопасно, но вводит в заблуждение: легко обвинить причал и искать обход. Не ищите — разомкните N–PE.",
  "UI-UMI-Z-L2-K":
    "Часть тока возвращается через PE, минуя УЗО, поэтому УЗО видит разницу и отключает. Это отключение безопасно, но вводит в заблуждение: легко обвинить колонку и искать обход. Не ищите — разомкните N–PE.",
  "UI-UMI-Z-L3-S": "Опасный случай: старое подключение без УЗО.",
  "UI-UMI-Z-L3-J":
    "Ничего не срабатывает, а PE постоянно несёт ток. Если в сети оборвётся проводник PEN, весь обратный ток ищет путь через PE и корпус яхты. На металлических частях яхты может появиться опасное напряжение. Поражение получает тот, кто их касается, стоя на причале.",
  "UI-UMI-Z-L3-K":
    "Ничего не срабатывает, а PE постоянно несёт ток. Если в сети оборвётся проводник PEN, весь обратный ток ищет путь через PE и шасси. На кузове может появиться опасное напряжение. Поражение получает тот, кто его касается, стоя на траве.",
  "UI-UMI-Z-L4-S": "На яхте хуже.",
  "UI-UMI-Z-L4":
    "Ток, идущий по защитному проводнику через воду, вызывает коррозию подводных частей. В марине ток в воде также грозит поражением пловцам поблизости. Поэтому яхтенные правила здесь особенно строги.",
  "UI-UMI-Z-P3":
    "Эта неисправность не убивает сразу, как отсутствие N–PE на самом инверторе. Но она нарушает основное правило системы и при второй неисправности — обрыве PEN — становится опасной. Поэтому приложение показывает её красным, как незаземлённый корпус.",
  "UI-UMI-POSTOJ-S": "При долгой стоянке",
  "UI-UMI-POSTOJ":
    "заземляющий штырь, вбитый в грунт, имеет смысл как дополнение. Он не заменяет уравнивание потенциалов и УЗО.",
  "UI-UMI-STOPKA": "Заземление в доме, с заземлителем в земле и измерением сопротивления — полные калькуляторы:",
  "UI-UMI-STOPKA-L1": "Модуль 5 — Проект заземления",
  "UI-UMI-STOPKA-ORAZ": " и ",
  "UI-UMI-STOPKA-L2": "Модуль 5 — Функциональное и защитное заземление",
}
