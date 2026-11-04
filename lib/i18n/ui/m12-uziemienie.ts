/**
 * M12 — E38 „Uziemienie małej instalacji” (`app/kalkulatory/uziemienie-male-instalacje/page.tsx`).
 * The external-supply section has one key per variant (`-J` jacht / `-K` kamper) instead of pasted
 * word fragments, so every language keeps its own grammar. Terminology as in the `UMI-*` engine
 * messages (RU: УЗО, EN: RCD).
 */
// English: ./m12-uziemienie.en.ts, Russian: ./m12-uziemienie.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
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
